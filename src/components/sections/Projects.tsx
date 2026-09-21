'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  CheckCircle,
  BarChart,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/common/Icons';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Badge } from '@/components/ui/Badge';
import { CardContainer, CardBody, CardItem } from '@/components/ui/ThreeDCard';

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI & GenAI',
    'Business Intelligence',
    'Data Analytics',
  ];

  const filteredProjects =
    activeCategory === 'All'
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            badgeText="Featured Work"
            title="Production Systems &"
            titleHighlight="Analytics Projects"
            description="Engineering solutions spanning multi-agent AI automation, programmatic data pipelines, and executive business intelligence dashboards."
            className="mb-0"
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0 light:bg-slate-100 light:border-slate-300">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Perspective Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CardContainer className="w-full h-full" containerClassName="py-2">
                  <CardBody className="relative group/card overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d101b]/80 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:border-blue-500/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full light:bg-white light:border-slate-200 light:shadow-sm light:hover:shadow-xl">
                    <div>
                      {/* Top Meta with 3D Z-axis pop */}
                      <CardItem
                        translateZ={30}
                        className="flex items-center justify-between w-full gap-2 mb-4"
                      >
                        <Badge variant="accent" size="sm">
                          {project.category}
                        </Badge>

                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`GitHub repository for ${project.title}`}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10 light:bg-slate-100 light:border-slate-300 light:text-slate-700"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Live demo for ${project.title}`}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10 light:bg-slate-100 light:border-slate-300 light:text-slate-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardItem>

                      {/* Title with 3D Z-axis Pop */}
                      <CardItem translateZ={50} className="w-full">
                        <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900 group-hover/card:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-blue-400/90 light:text-blue-600">
                          {project.tagline}
                        </p>
                      </CardItem>

                      {/* Problem / Solution Narrative with 3D Depth */}
                      <CardItem translateZ={40} className="w-full mt-4 space-y-2 text-xs sm:text-sm text-slate-300 light:text-slate-600">
                        <p>
                          <strong className="text-slate-200 light:text-slate-800">Problem:</strong>{' '}
                          {project.problem}
                        </p>
                        <p>
                          <strong className="text-slate-200 light:text-slate-800">Solution:</strong>{' '}
                          {project.solution}
                        </p>
                      </CardItem>

                      {/* Preview stats strip with high 3D pop */}
                      {project.previewStats && (
                        <CardItem translateZ={60} className="w-full mt-5">
                          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] shadow-inner light:bg-slate-50 light:border-slate-200">
                            {project.previewStats.map((stat, sIdx) => (
                              <div key={sIdx} className="text-center">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                                  {stat.label}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-white light:text-slate-900 font-mono block mt-0.5">
                                  {stat.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardItem>
                      )}

                      {/* Key Impact Points */}
                      <CardItem translateZ={35} className="w-full mt-5 space-y-2">
                        {project.impactMetrics.map((impact, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{impact}</span>
                          </div>
                        ))}
                      </CardItem>
                    </div>

                    {/* Tech stack badge footer */}
                    <CardItem translateZ={25} className="w-full mt-6 pt-4 border-t border-white/[0.06] light:border-slate-200 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="mono" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
