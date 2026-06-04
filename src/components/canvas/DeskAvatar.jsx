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

      // ── Material & Mesh setup (exact original: utils/character.ts) ──
      character.traverse((child) => {
        // Hide ground and screenlight to avoid giant white planes
        // Also hide extra Plane meshes which are likely walls/background
        if (
          child.name === "ground" || 
          child.name === "screenlight" ||
          (child.name && child.name.startsWith("Plane") && !child.name.includes("004") && !child.name.includes("003") && !child.name.includes("007"))
        ) {
          child.visible = false;
        }

        // Keep everything else visible for Desk Avatar
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

      // No scroll-based shifting for Desk Avatar
      // Just track head to mouse
      
      // Head rotation (exact original math)
      if (headBone) {
        const maxRotation = Math.PI / 6;
        headBone.rotation.y = THREE.MathUtils.lerp(
          headBone.rotation.y,
          mouse.x * maxRotation,
          interpolation.y
        );

        let minRotationX = -0.3;
        let maxRotationX = 0.4;
        if (mouse.y > minRotationX) {
          if (mouse.y < maxRotationX) {
            headBone.rotation.x = THREE.MathUtils.lerp(
              headBone.rotation.x,
              -mouse.y - 0.5 * maxRotation,
              interpolation.x
            );
          } else {
            headBone.rotation.x = THREE.MathUtils.lerp(
              headBone.rotation.x,
              -maxRotation - 0.5 * maxRotation,
              interpolation.x
            );
          }
        } else {
          headBone.rotation.x = THREE.MathUtils.lerp(
            headBone.rotation.x,
            -minRotationX - 0.5 * maxRotation,
            interpolation.x
          );
        }

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

const DeskAvatarCanvas = () => {
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

export default DeskAvatarCanvas;
