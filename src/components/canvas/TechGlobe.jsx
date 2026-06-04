import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const HolographicGlobe = () => {
  const globeRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current) {
      // Smooth subtle cinematic rotation
      globeRef.current.rotation.y = t * 0.1;
      globeRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
      globeRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={globeRef}>
      {/* 1. Deep Core: A solid but dark core so it doesn't look totally empty inside */}
      <mesh>
        <sphereGeometry args={[1.9, 32, 32]} />
        <meshBasicMaterial 
          color="#120524" 
          transparent 
          opacity={1} 
        />
      </mesh>

      {/* 2. Neon Holographic Grid: High density wireframe */}
      <mesh>
        <sphereGeometry args={[1.95, 48, 48]} />
        <meshBasicMaterial
          color="#c084fc"
          wireframe
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Volumetric Glow: A slightly larger blurred sphere to create the holographic bloom */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial
          color="#d8b4fe"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#9333ea"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Elegant Orbiting Rings for visibility and style */}
      <group rotation={[Math.PI / 2.2, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[2.6, 0.008, 16, 100]} />
          <meshBasicMaterial color="#d8b4fe" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      
      <group rotation={[Math.PI / 1.8, -0.3, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.008, 16, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
};

const TechGlobeCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      camera={{
        fov: 35, // Tighter FOV for cinematic look
        near: 0.1,
        far: 200,
        position: [0, 0, 9], // Moved further back to ensure it perfectly fits
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.2} color="#4c1d95" />
        
        {/* Subtle purple ambient lights from corners to match prompt */}
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#581c87" />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#a855f7" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#c084fc" distance={5} />

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.2} // Much slower, cinematic rotation
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <HolographicGlobe />
      </Suspense>
    </Canvas>
  );
};

export default TechGlobeCanvas;
