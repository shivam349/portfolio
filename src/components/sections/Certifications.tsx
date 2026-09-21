'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle, ExternalLink, ShieldCheck, Trophy } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function Certifications() {
  return (
    <section id="certifications" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Credentials & Honors"
          title="Industry Certifications &"
          titleHighlight="Recognized Achievements"
          description="Verified course completions, simulation programs, and honors confirming technical rigor in analytics, databases, and programming."
        />

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {portfolioData.certifications.map((cert) => (
            <BentoCard key={cert.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" size="sm">
                    {cert.category}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white light:text-slate-900 leading-snug">
                  {cert.name}
                </h3>

                <p className="mt-1 text-xs font-medium text-blue-400 light:text-blue-600">
                  {cert.issuer} • {cert.date}
                </p>

                {cert.skillsVerified && cert.skillsVerified.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06] light:border-slate-200">
                    {cert.skillsVerified.map((skill) => (
                      <Badge key={skill} variant="mono" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {cert.credentialUrl && (
                <div className="mt-5 pt-3 border-t border-white/[0.06] light:border-slate-200">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors light:text-slate-600 light:hover:text-blue-600"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </BentoCard>
          ))}
        </div>

        {/* Honors & Key Milestones Strip */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white light:text-slate-900 mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Honors, Memberships &amp; Problem Solving Milestones</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioData.achievements.map((ach) => (
              <BentoCard key={ach.id} className="p-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="accent" size="sm">
                    {ach.tag}
                  </Badge>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {ach.metric}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white light:text-slate-900 mt-1">
                  {ach.title}
                </h4>

                <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                  {ach.description}
                </p>
              </BentoCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
