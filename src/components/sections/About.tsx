'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Database,
  BarChart2,
  Sparkles,
  GraduationCap,
  Briefcase,
  MapPin,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function About() {
  const { profile } = portfolioData;

  const coreStrengths = [
    {
      title: 'SQL Query Writing & Database Tuning',
      description: 'Authoring and tuning complex queries across production databases to extract real-time operational insights.',
      icon: <Database className="w-4 h-4 text-blue-400" />,
    },
    {
      title: 'Power BI & Power Query Modeling',
      description: 'Designing interactive multi-page dashboards with custom DAX calculations that stakeholders actively monitor.',
      icon: <BarChart2 className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Automated Reporting Workflows',
      description: 'Replacing manual spreadsheet routines with automated ETL scripts, saving hours of daily analyst overhead.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'GenAI Tools & Streamlit Interfaces',
      description: 'Connecting LLMs (LangChain, GPT-4) with intuitive Streamlit web apps so non-technical teams can query datasets easily.',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    },
  ];

  return (
    <section id="about" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Profile Story"
          title="From Raw Datasets to"
          titleHighlight="Executive Clarity"
          description="A data analyst who bridges complex database schemas, reporting automation, and business decision-making."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main narrative block */}
          <div className="lg:col-span-7 space-y-6">
            <BentoCard className="p-8">
              <h3 className="text-2xl font-bold text-white light:text-slate-900 tracking-tight">
                Turning data into systems that logistics and e-commerce teams actually use.
              </h3>

              <div className="mt-5 space-y-4 text-slate-300 light:text-slate-700 text-base leading-relaxed">
                <p>
                  With 2+ years of hands-on data analytics experience, my focus is on turning noisy transactional records into operational clarity. Whether tracking 10,000+ monthly parcels at NxTree Technologies or troubleshooting query latency at Mithila Organix, my work centers on delivering dependable numbers.
                </p>
                <p>
                  I specialize in writing production SQL queries, engineering Power Query pipelines, and building clean Power BI dashboards with tailored DAX logic. Rather than letting analysts spend hours every morning manually pulling and formatting spreadsheets, I automate those routines to free up time for strategic forecasting and inventory planning.
                </p>
                <p>
                  I also actively integrate GenAI tooling (LangChain, Streamlit, Snorkel) into data ecosystems—building lightweight conversational query layers that make complex databases accessible to business managers who don&apos;t write SQL.
                </p>
              </div>

              {/* Core Strengths Checklist */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08] light:border-slate-200">
                {coreStrengths.map((strength) => (
                  <div key={strength.title} className="flex gap-3">
                    <div className="mt-1 p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 light:bg-slate-100 light:border-slate-300">
                      {strength.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white light:text-slate-900">
                        {strength.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                        {strength.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Sidebar quick info card */}
          <div className="lg:col-span-5 space-y-6">
            <BentoCard className="p-6 space-y-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Quick Profile Specs
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-xs block">Current Role</span>
                    <span className="font-medium text-white light:text-slate-900">
                      Business Analyst / Data Analyst at NxTree Technologies
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-xs block">Academic Degree</span>
                    <span className="font-medium text-white light:text-slate-900">
                      B.Tech in Electrical &amp; Electronics Engineering
                    </span>
                    <span className="text-xs text-slate-400 block">
                      Birla Institute of Technology (BIT), Mesra (GPA: 7.66/10.0)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-xs block">Current Base</span>
                    <span className="font-medium text-white light:text-slate-900">
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="pt-4 border-t border-white/[0.08] light:border-slate-200">
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-blue-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    Target Opportunity
                  </span>
                  <p className="text-xs text-slate-300 light:text-slate-700">
                    Exploring roles in Data Analytics, Business Intelligence, or Analytics Engineering in Bengaluru or Remote.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Problem Solving & DSA Badge Card */}
            <BentoCard className="p-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Problem Solving Rigor
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white light:text-slate-900 font-mono">
                  1,050+
                </span>
                <span className="text-xs text-slate-400">Coding Problems Solved</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                750+ LeetCode and 300+ GeeksforGeeks solutions focused on Data Structures, Algorithms, Dynamic Programming, and SQL optimizations.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge variant="mono">LeetCode: 750+</Badge>
                <Badge variant="mono">GeeksforGeeks: 300+</Badge>
                <Badge variant="mono">IEEE Member</Badge>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
