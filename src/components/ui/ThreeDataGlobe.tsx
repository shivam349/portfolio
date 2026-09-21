'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Globe, Zap } from 'lucide-react';

export function ThreeDataGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTelemetry, setActiveTelemetry] = useState({
    hub: 'Bengaluru Core Hub',
    orders: '10,000+ orders/mo',
    otd: '98% OTD SLA',
    latency: '28ms latency',
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const container = mountRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all globe objects
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Geodesic Wireframe Inner Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(50, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Glowing Nodes on vertices
    const pointsGeo = new THREE.IcosahedronGeometry(50.5, 2);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 2.4,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // 3. Equatorial & Polar Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(68, 0.6, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.5,
      wireframe: false,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    globeGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(74, 0.5, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = Math.PI / 6;
    globeGroup.add(ringMesh2);

    // 4. Orbiting Data Satellite Packets
    const satGeo = new THREE.SphereGeometry(2, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
    });
    const satellite1 = new THREE.Mesh(satGeo, satMat);
    const satellite2 = new THREE.Mesh(satGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    globeGroup.add(satellite1);
    globeGroup.add(satellite2);

    // Mouse drag & tilt interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.008;
      globeGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Continuous slow rotation if not actively dragging
      if (!isDragging) {
        globeGroup.rotation.y += 0.004;
        globeGroup.rotation.x = Math.sin(time * 0.5) * 0.15;
      }

      // Orbit satellites around rings
      satellite1.position.x = Math.cos(time * 1.8) * 68;
      satellite1.position.y = Math.sin(time * 1.8) * Math.sin(Math.PI / 3) * 68;
      satellite1.position.z = Math.sin(time * 1.8) * Math.cos(Math.PI / 3) * 68;

      satellite2.position.x = Math.sin(time * 1.2) * 74;
      satellite2.position.y = Math.cos(time * 1.2) * 74;
      satellite2.position.z = Math.sin(time * 1.2) * 30;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      satGeo.dispose();
      satMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Glow Halo */}
      <div className="pointer-events-none absolute inset-4 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Interactive Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="Click and drag to spin 3D data telemetry globe"
      />

      {/* Floating 3D Telemetry Badges */}
      <div className="pointer-events-none absolute top-3 right-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-blue-500/30 backdrop-blur-md text-[11px] font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center gap-1.5">
        <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span>10K+ Orders Node</span>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md text-[11px] font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-emerald-400" />
        <span>98% OTD Delivery Gateway</span>
      </div>
    </div>
  );
}
