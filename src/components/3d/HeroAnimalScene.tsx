'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import { AnimalModel } from './AnimalModel';

export function HeroAnimalScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* Cinematic Nature-Neon Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} color="#f0fdf4" />
        <pointLight position={[-12, 6, 8]} intensity={4} color="#00ff9d" distance={30} />
        <pointLight position={[12, -8, -6]} intensity={3} color="#06b6d4" distance={30} />
        <pointLight position={[0, -10, 4]} intensity={2} color="#10b981" distance={20} />

        <Suspense fallback={null}>
          {/* Bioluminescent Atmospheric Spores / Fireflies */}
          <Sparkles
            count={60}
            scale={18}
            size={3.5}
            speed={0.4}
            opacity={0.65}
            color="#00ff9d"
          />

          <Sparkles
            count={40}
            scale={16}
            size={2.5}
            speed={0.6}
            opacity={0.45}
            color="#06b6d4"
          />

          {/* Floating animated 3D avian model */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <AnimalModel position={[0, -0.2, 0]} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
