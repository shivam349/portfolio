'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  PackageCheck,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  Code2,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { MetricCounter } from '@/components/ui/MetricCounter';
import { Badge } from '@/components/ui/Badge';

export function MetricsBento() {
  const iconMap: Record<string, React.ReactNode> = {
    PackageCheck: <PackageCheck className="w-5 h-5 text-blue-400" />,
    TrendingDown: <TrendingDown className="w-5 h-5 text-emerald-400" />,
    Clock: <Clock className="w-5 h-5 text-indigo-400" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    Zap: <Zap className="w-5 h-5 text-cyan-400" />,
    Code2: <Code2 className="w-5 h-5 text-purple-400" />,
  };

  return (
    <section id="metrics" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Impact & Proof"
          title="Measurable Results,"
          titleHighlight="Not Just Theoretical Skills"
          description="Every role and project produces verifiable business value. Here are the core metrics driven across logistics, analytics automation, and operational performance."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioData.keyMetrics.map((item, idx) => {
            const isLarge = idx === 0 || idx === 1;

            return (
              <BentoCard
                key={item.id}
                className={isLarge ? 'md:col-span-1 lg:col-span-1' : ''}
              >
                <div className="flex flex-col h-full justify-between">
                  {/* Card Top Row */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 light:bg-slate-100 light:border-slate-200">
                        {iconMap[item.icon] || <Zap className="w-5 h-5 text-blue-400" />}
                      </div>

                      {item.change && (
                        <Badge
                          variant={item.changeType === 'positive' ? 'success' : 'accent'}
                          size="sm"
                        >
                          {item.change}
                        </Badge>
                      )}
                    </div>

                    {/* Metric Display */}
                    <div className="mt-2 flex items-baseline gap-1">
                      <MetricCounter
                        value={item.value}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        className="text-4xl sm:text-5xl font-extrabold text-white light:text-slate-900 tracking-tight"
                      />
                    </div>

                    {/* Label */}
                    <h3 className="mt-2 text-lg font-semibold text-slate-200 light:text-slate-800">
                      {item.label}
                    </h3>
                  </div>

                  {/* Context Note */}
                  <p className="mt-4 pt-4 border-t border-white/[0.06] light:border-slate-200 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                    {item.context}
                  </p>
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
