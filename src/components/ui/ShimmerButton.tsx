'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export function ShimmerButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  asLink = false,
  href,
  target,
  rel,
  ...props
}: ShimmerButtonProps) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 select-none';

  if (variant === 'primary') {
    const content = (
      <span className="relative z-10 flex items-center gap-2 text-white font-medium">
        {children}
      </span>
    );

    const buttonClass = cn(
      baseStyles,
      sizeStyles[size],
      'group overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] border border-blue-400/30',
      className
    );

    if (asLink && href) {
      return (
        <motion.a
          href={href}
          target={target}
          rel={rel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={buttonClass}
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={buttonClass}
        {...props}
      >
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {content}
      </motion.button>
    );
  }

  const variantStyles = {
    secondary:
      'bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10 hover:border-white/20',
    outline:
      'bg-transparent text-slate-300 hover:text-white border border-white/15 hover:border-blue-500/50 hover:bg-blue-500/5',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
  };

  const buttonClass = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant as 'secondary' | 'outline' | 'ghost'],
    className
  );

  if (asLink && href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={buttonClass}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClass}
      {...props}
    >
      {children}
    </motion.button>
  );
}
