'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function Experience() {
  return (
    <section id="experience" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Work History"
          title="Professional Experience &"
          titleHighlight="Career Timeline"
          description="A chronological record of technical impact across enterprise logistics, business intelligence, AI pipeline development, and platform optimization."
        />

        <div className="relative border-l border-white/10 ml-4 sm:ml-6 md:ml-8 pl-6 sm:pl-8 space-y-12 light:border-slate-300">
          {portfolioData.experiences.map((exp, index) => {
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-[37px] sm:-left-[45px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    exp.isCurrent
                      ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] text-white'
                      : 'bg-slate-900 border-slate-600 text-slate-400 light:bg-white light:border-slate-400'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                </div>

                {/* Experience Card */}
                <BentoCard className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] light:border-slate-200">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
                          {exp.role}
                        </span>
                        <Badge
                          variant={exp.isCurrent ? 'accent' : 'outline'}
                          size="sm"
                        >
                          {exp.type}
                        </Badge>
                        {exp.isCurrent && (
                          <Badge variant="success" size="sm">
                            Current Role
                          </Badge>
                        )}
                      </div>

                      <div className="text-base font-medium text-blue-400 light:text-blue-600">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs text-slate-400 light:text-slate-600 gap-1 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.period}</span>
                        {exp.duration && <span>({exp.duration})</span>}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights and Achievements */}
                  <div className="mt-5 space-y-3">
                    {exp.achievements.map((item, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300 light:text-slate-700 leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Metric highlights pills */}
                  {exp.metrics && exp.metrics.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/[0.06] light:border-slate-200 flex flex-wrap gap-2">
                      {exp.metrics.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center gap-1.5 light:bg-slate-100 light:border-slate-200"
                        >
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-slate-400">{metric.label}:</span>
                          <span className="font-bold text-white light:text-slate-900 font-mono">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies footer */}
                  <div className="mt-5 pt-4 border-t border-white/[0.06] light:border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-500 mr-2">Technologies:</span>
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="mono" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </BentoCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
