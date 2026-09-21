'use client';

import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function Education() {
  return (
    <section id="education" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Academic Background"
          title="Education & Technical"
          titleHighlight="Foundations"
          description="Formal engineering grounding in electrical, electronic, and computational principles."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolioData.education.map((edu, idx) => {
            const isPrimary = idx === 0;

            return (
              <BentoCard
                key={edu.id}
                className={`p-6 sm:p-8 flex flex-col justify-between ${
                  isPrimary ? 'lg:col-span-2 border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.1)]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 light:bg-slate-100 light:border-slate-200">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                    </div>

                    {edu.grade && (
                      <Badge variant={isPrimary ? 'accent' : 'mono'} size="sm">
                        {edu.grade}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white light:text-slate-900">
                    {edu.institution}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-blue-400 light:text-blue-600">
                    {edu.degree} — {edu.field}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {edu.period}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {edu.location}
                      </span>
                    )}
                  </div>

                  {edu.highlights && (
                    <div className="mt-5 space-y-2 pt-4 border-t border-white/[0.06] light:border-slate-200">
                      {edu.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
