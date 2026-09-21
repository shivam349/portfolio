'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  BrainCircuit,
  Database,
  Cpu,
  CheckCircle,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function Skills() {
  const iconMap: Record<string, React.ReactNode> = {
    BarChart3: <BarChart3 className="w-5 h-5 text-amber-400" />,
    BrainCircuit: <BrainCircuit className="w-5 h-5 text-cyan-400" />,
    Database: <Database className="w-5 h-5 text-blue-400" />,
    Cpu: <Cpu className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <section id="skills" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Capabilities"
          title="Technical Competencies &"
          titleHighlight="Tooling Ecosystem"
          description="A structured taxonomy of verified skills across BI engineering, machine learning pipelines, backend systems, and database optimization."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.skillCategories.map((category) => (
            <BentoCard key={category.id} className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08] light:border-slate-200">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 light:bg-slate-100 light:border-slate-200">
                    {iconMap[category.icon] || <Database className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white light:text-slate-900">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skills List with contextual application tags */}
                <div className="mt-5 space-y-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 light:bg-slate-50 light:border-slate-200 light:hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-sm font-semibold text-white light:text-slate-900">
                          {skill.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {skill.tag && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {skill.tag}
                          </span>
                        )}
                        {skill.level && (
                          <Badge
                            variant={
                              skill.level === 'Advanced'
                                ? 'accent'
                                : skill.level === 'Proficient'
                                ? 'outline'
                                : 'default'
                            }
                            size="sm"
                          >
                            {skill.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
