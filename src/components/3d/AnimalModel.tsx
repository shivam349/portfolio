'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetPath } from '@/lib/basePath';

const modelPath = getAssetPath('/models/animal.glb');

export function AnimalModel(props: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Play the primary flight animation clip
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().fadeIn(0.5).play();
    }

    // Apply bioluminescent nature-neon material styling to the model meshes
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          // Clone material to avoid shared mutation
          mesh.material = (mesh.material as THREE.Material).clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.35;
          mat.metalness = 0.65;
          mat.emissive = new THREE.Color(0x00ff9d);
          mat.emissiveIntensity = 0.25;
        }
      }
    });
  }, [actions, names, scene]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const group = groupRef.current;

    // Smooth banking, turning, and gliding physics toward mouse pointer
    const targetRotY = Math.PI / 2 + pointer.x * 0.75;
    const targetRotX = -pointer.y * 0.35;
    const targetRotZ = -pointer.x * 0.6;

    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.05);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, 0.05);

    // Natural vertical bobbing and gentle cursor following
    const targetPosY = Math.sin(time * 1.8) * 0.4 + pointer.y * 1.2;
    const targetPosX = pointer.x * 2.5;

    group.position.y = THREE.MathUtils.lerp(group.position.y, targetPosY, 0.04);
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetPosX, 0.04);
  });

  return (
    <group ref={groupRef} {...props} dispose={null} scale={[0.045, 0.045, 0.045]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(modelPath);
