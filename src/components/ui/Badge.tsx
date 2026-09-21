import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'accent' | 'success' | 'mono';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'sm',
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-xs md:text-sm px-3 py-1 rounded-full',
  };

  const variantClasses = {
    default:
      'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20 transition-colors',
    outline:
      'bg-transparent text-slate-300 border border-white/15 hover:border-blue-500/40 hover:text-blue-400 transition-colors',
    accent:
      'bg-blue-500/10 text-blue-400 border border-blue-500/25 font-medium shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    success:
      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-medium shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    mono:
      'bg-slate-900/80 text-slate-300 border border-slate-700 font-mono tracking-tight text-[11px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium transition-all duration-200 select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
