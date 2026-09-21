'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badgeText: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  badgeText,
  title,
  titleHighlight,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        isCenter ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn('flex items-center gap-2 mb-3', isCenter && 'justify-center')}
      >
        <Badge variant="accent" size="sm" className="uppercase tracking-widest text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {badgeText}
        </Badge>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white light:text-slate-900 leading-[1.15]"
      >
        {title}{' '}
        {titleHighlight && (
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {titleHighlight}
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: 0.16, ease: 'easeOut' }}
          className="mt-4 text-base md:text-lg text-slate-400 light:text-slate-600 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
