'use client';

import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface BentoCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableSpotlight?: boolean;
}

export function BentoCard({
  children,
  className,
  glowColor = 'rgba(59, 130, 246, 0.15)',
  enableSpotlight = true,
  ...props
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableSpotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d101b]/80 backdrop-blur-md p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)]',
        'light:bg-white light:border-slate-200 light:shadow-sm light:hover:border-blue-400/40 light:hover:shadow-md',
        className
      )}
      {...props}
    >
      {/* Radial spotlight on mouse hover */}
      {enableSpotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
