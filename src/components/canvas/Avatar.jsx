import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { gsap } from "gsap";
import { decryptFile } from "../../utils/decrypt";

// ── Bone data (from original repo: src/data/boneData.ts) ──
const typingBoneNames = [
  "thighL", "thighR", "shinL", "shinR", "forearmL", "forearmR",
  "handL", "handR", "f_pinky03R", "f_pinky02L", "f_pinky02R",
  "f_pinky01L", "f_pinky01R", "palm04L", "palm04R", "f_ring01L",
  "thumb01L", "thumb01R", "thumb03L", "thumb03R", "palm02L",
  "palm02R", "palm01L", "palm01R", "f_index01L", "f_index01R",
  "palm03L", "palm03R", "f_ring02L", "f_ring02R", "f_ring01R",
  "f_ring03L", "f_ring03R", "f_middle01L", "f_middle02L",
  "f_middle03L", "f_middle01R", "f_middle02R", "f_middle03R",
  "f_index02L", "f_index03L", "f_index02R", "f_index03R",
  "thumb02L", "f_pinky03L", "upper_armL", "upper_armR",
  "thumb02R", "toeL", "heel02L", "toeR", "heel02R",
];
const eyebrowBoneNames = ["eyebrow_L", "eyebrow_R"];

// ── Helper: filter animation tracks to specific bones ──
function filterAnimationTracks(clip, boneNames) {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );
  return new THREE.AnimationClip(clip.name + "_filtered", clip.duration, filteredTracks);
}

const Avatar = ({ isMobile }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let rect = container.getBoundingClientRect();
    const aspect = rect.width / rect.height;

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Renderer (exact original settings) ──
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // In Three.js 0.168.0+, use outputColorSpace instead of outputEncoding
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Camera (exact original settings) ──
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7); // Start centered
    camera.zoom = isMobile ? 0.8 : 0.95;
    camera.updateProjectionMatrix();

    // ── Lighting (exact original: utils/lighting.ts) ──
    const directionalLight = new THREE.DirectionalLight(0xc7a9ff, 0);
    directionalLight.position.set(-0.47, -0.32, -1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xc2a4ff, 0, 100, 3);
    pointLight.position.set(3, 12, 4);
    scene.add(pointLight);

    // ── HDR Environment Map (critical for PBR skin materials!) ──
    let envReady = false;
    new RGBELoader().load("/char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0; // starts dark, fades in via gsap
      scene.environmentRotation.set(5.76, 85.85, 1);
      envReady = true;
    });

    // ── State ──
    let headBone = null;
    let characterRef = null;
    let screenLight = null;
    let mixer = null;
    let deskMeshes = [];
    const clock = new THREE.Clock();
    let animationFrameId;

    // ── GLTF Loader with Draco ──
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    // ── Load Character ──
    // Decrypt character.enc at runtime (exactly like the original website)
    decryptFile("/character.enc", "Character3D#@").then((decryptedBuffer) => {
      const blob = new Blob([decryptedBuffer]);
      const blobUrl = URL.createObjectURL(blob);
      loader.load(blobUrl, (gltf) => {
        URL.revokeObjectURL(blobUrl);
      const character = gltf.scene;
      characterRef = character;

      // ── Material & Mesh setup ──
      character.traverse((child) => {
        // Always hide ground
        if (child.name === "ground") {
          child.visible = false;
        }

        // Desk items + environment: start hidden, reveal on scroll
        // This includes desk (Cube), keyboard (KEYS, Keyboard), 
        // monitor/screen (Plane meshes), and screenlight
        if (child.name && (
          child.name.startsWith("KEYS") ||
          child.name.startsWith("Cube") ||
          child.name === "Keyboard" ||
          child.name === "screenlight" ||
          (child.name.startsWith("Plane") && !child.name.includes("004") && !child.name.includes("003") && !child.name.includes("007"))
        )) {
          child.visible = false;
          deskMeshes.push(child);
        }

        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
        }
      });

      // ── Feet positioning (exact original) ──
      const footR = character.getObjectByName("footR");
      const footL = character.getObjectByName("footL");
      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;

      headBone = character.getObjectByName("spine006") || null;
      screenLight = character.getObjectByName("screenlight") || null;

      scene.add(character);

      // ── Animation setup (exact original: utils/animationUtils.ts) ──
      mixer = new THREE.AnimationMixer(character);

      if (gltf.animations && gltf.animations.length > 0) {
        // Intro animation
        const introClip = gltf.animations.find((c) => c.name === "introAnimation");
        if (introClip) {
          const introAction = mixer.clipAction(introClip);
          introAction.setLoop(THREE.LoopOnce, 1);
          introAction.clampWhenFinished = true;
          introAction.play();
        }

        // Key animations
        ["key1", "key2", "key5", "key6"].forEach((name) => {
          const clip = THREE.AnimationClip.findByName(gltf.animations, name);
          if (clip) {
            const action = mixer.clipAction(clip);
            action.play();
            action.timeScale = 1.2;
          }
        });

        // Typing animation (filtered to specific bones only)
        const typingClipRaw = THREE.AnimationClip.findByName(gltf.animations, "typing");
        if (typingClipRaw) {
          const filteredClip = filterAnimationTracks(typingClipRaw, typingBoneNames);
          const typingAction = mixer.clipAction(filteredClip);
          typingAction.enabled = true;
          typingAction.play();
          typingAction.timeScale = 1.2;
        }

        setLoading(false);

        // ── Intro sequence (exact original timing) ──
        setTimeout(() => {
          // Fade in environment + directional light
          gsap.to(scene, {
            environmentIntensity: 0.64,
            duration: 2,
            ease: "power2.inOut",
          });
          gsap.to(directionalLight, {
            intensity: 1,
            duration: 2,
            ease: "power2.inOut",
          });

          // Replay intro animation
          if (introClip) {
            const introAction = mixer.clipAction(introClip);
            introAction.clampWhenFinished = true;
            introAction.reset().play();
          }

          // Start blink after intro finishes
          setTimeout(() => {
            const blink = gltf.animations.find((c) => c.name === "Blink");
            if (blink) mixer.clipAction(blink).play().fadeIn(0.5);
          }, 2500);
        }, 2500);
      }
      });  // end loader.load callback
    });  // end decryptFile.then

    // ── Mouse tracking (exact original: utils/mouseUtils.ts) ──
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener("mousemove", onMouseMove);

    // ── Render loop ──
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Scroll-based camera transition based on viewport heights (vh)
      // Reference: redoyanulhaque.me scroll sequence
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const vh = window.innerHeight || 800;
      
      // Phase 1 (0 to 1 vh): Hero -> About Me. Camera slides right, avatar goes left.
      const phase1 = Math.min(Math.max(scrollY / vh, 0), 1);
      
      // Phase 2 (1.2 vh to 2.5 vh): About Me -> What I Do. 
      // Camera zooms out dramatically to reveal full body + desk + chair + legs.
      // Starts at 1.2vh just as 'What I Do' starts coming into view.
      const phase2 = Math.min(Math.max((scrollY - vh * 1.2) / (vh * 1.3), 0), 1);
      
      // Easing function for smoother zoom
      const easePhase2 = phase2 * phase2 * (3 - 2 * phase2); // smoothstep
      
      // Camera X: slide right in Phase 1, then slide further right in Phase 2 to keep avatar on the left
      const targetCameraX = phase1 * 4.0 + easePhase2 * 1.0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 0.08);
      
      // Camera Y: start at 13.1 (head level), go down to 10.5 to center full body
      const targetCameraY = 13.1 - easePhase2 * 2.6;
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraY, 0.06);
      
      // Camera Z: start at 24.7, zoom out to ~42 for full body with chair and legs
      const targetCameraZ = 24.7 + easePhase2 * 17.3;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.06);

      // Shift character direction (body rotation) based on scroll
      if (characterRef) {
        // Phase 1: rotate to face About text. Phase 2: rotate back toward center
        const targetRotationY = phase1 * 1.2 - easePhase2 * 0.6;
        characterRef.rotation.y = THREE.MathUtils.lerp(characterRef.rotation.y, targetRotationY, 0.08);
      }

      // Reveal desk/laptop/keyboard only during Phase 2 (What I Do section)
      const showDesk = phase2 > 0.05;
      deskMeshes.forEach((mesh) => {
        mesh.visible = showDesk;
      });

      // Head rotation — scroll-dependent gaze
      // Hero: follow cursor | About Me: look at paragraph (right) | What I Do: look at laptop (down)
      if (headBone) {
        const maxRotation = Math.PI / 6;
        
        let targetHeadY;
        let targetHeadX;
        
        // Helper function to calculate head X based on original mouse.y logic
        const getHeadX = (mouseY) => {
          let minRotationX = -0.3;
          let maxRotationXVal = 0.4;
          if (mouseY > minRotationX) {
            if (mouseY < maxRotationXVal) {
              return -mouseY - 0.5 * maxRotation;
            } else {
              return -maxRotationXVal - 0.5 * maxRotation;
            }
          } else {
            return -minRotationX - 0.5 * maxRotation;
          }
        };

        if (phase1 < 0.3) {
          // ── HERO: Follow cursor ──
          const heroBlend = phase1 / 0.3;
          const cursorY = mouse.x * maxRotation;
          const cursorX = getHeadX(mouse.y);
          
          // Transition to About Me simulated coordinates (mouseX: 0.6, mouseY: 0.1)
          const aboutGazeY = 0.6 * maxRotation;
          const aboutGazeX = getHeadX(0.1);
          
          targetHeadY = THREE.MathUtils.lerp(cursorY, aboutGazeY, heroBlend);
          targetHeadX = THREE.MathUtils.lerp(cursorX, aboutGazeX, heroBlend);
          
        } else if (phase2 < 0.1) {
          // ── ABOUT ME: Look toward paragraph text (right side of screen) ──
          // Simulated mouse at (0.6, 0.1) -> right side, slightly above center
          targetHeadY = 0.6 * maxRotation; 
          targetHeadX = getHeadX(0.1);
          
        } else {
          // ── WHAT I DO: Look down at laptop/screen ──
          // Simulated mouse at (0, -0.8) -> center, bottom (clamped by original logic)
          // But to look further down at laptop, we might need to bypass the clamp.
          // Let's use getHeadX(-0.8) which clamps to looking down.
          const deskBlend = Math.min((phase2 - 0.1) / 0.3, 1);
          
          const laptopGazeY = 0; // Look straight ahead (relative to body)
          const laptopGazeX = getHeadX(-0.8); // Clamped look down
          
          targetHeadY = THREE.MathUtils.lerp(0.6 * maxRotation, laptopGazeY, deskBlend);
          targetHeadX = THREE.MathUtils.lerp(getHeadX(0.1), laptopGazeX, deskBlend);
        }
        
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetHeadY, 0.06);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetHeadX, 0.06);

        // Screen light → point light intensity (original)
        if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
          pointLight.intensity = screenLight.material.emissiveIntensity * 20;
        } else {
          pointLight.intensity = 0;
        }
      }

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ──
    const handleResize = () => {
      if (!container) return;
      const r = container.getBoundingClientRect();
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ──
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
      dracoLoader.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <span className="canvas-loader"></span>
          <p
            style={{
              fontSize: 14,
              color: "#F1F1F1",
              fontWeight: 800,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            Loading...
          </p>
        </div>
      )}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

const AvatarCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  return <Avatar isMobile={isMobile} />;
};

export default AvatarCanvas;
