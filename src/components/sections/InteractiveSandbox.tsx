'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  BarChart3,
  Copy,
  Check,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
} from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';

export function InteractiveSandbox() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    portfolioData.sandboxScenarios[0].id
  );
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);

  const activeScenario =
    portfolioData.sandboxScenarios.find((s) => s.id === selectedScenarioId) ||
    portfolioData.sandboxScenarios[0];

  const handleCopyCode = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(activeScenario.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxValue = Math.max(...activeScenario.chartData.map((d) => d.value));

  return (
    <section id="sandbox" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Interactive Sandbox"
          title="Explore Real Business"
          titleHighlight="Analytics In Action"
          description="Test interactive scenarios extracted directly from production analytics, logistics datasets, and automated reporting systems."
        />

        {/* Scenario Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {portfolioData.sandboxScenarios.map((scenario) => {
            const isSelected = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioId(scenario.id);
                  setCopied(false);
                }}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 light:bg-slate-100 light:text-slate-700 light:border-slate-300 light:hover:bg-slate-200'
                }`}
              >
                {scenario.title}
              </button>
            );
          })}
        </div>

        {/* Main Sandbox Interactive Display */}
        <BentoCard className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] light:border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                  {activeScenario.subtitle}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900 mt-1">
                {activeScenario.title}
              </h3>
              <p className="mt-2 text-sm text-slate-300 light:text-slate-600 max-w-3xl leading-relaxed">
                {activeScenario.businessContext}
              </p>
            </div>

            {/* View Mode Toggle (Visual Chart vs Code) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 shrink-0 self-start lg:self-center light:bg-slate-100 light:border-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Visual Metrics</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'code'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Production Query</span>
              </button>
            </div>
          </div>

          {/* Key KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            {activeScenario.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] light:bg-slate-50 light:border-slate-200"
              >
                <span className="text-xs text-slate-400 block font-medium">{kpi.label}</span>
                <span className="text-2xl font-bold font-mono text-white light:text-slate-900 mt-1 block">
                  {kpi.value}
                </span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  {kpi.trend}
                </span>
              </div>
            ))}
          </div>

          {/* Content Body: Visual Chart vs Code Editor */}
          <AnimatePresence mode="wait">
            {viewMode === 'visual' ? (
              <motion.div
                key="visual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-6 rounded-xl bg-slate-950/60 border border-white/[0.06] light:bg-white light:border-slate-200 space-y-5"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Optimization Progression Stages</span>
                  <span className="font-mono">Relative Value / Benchmark</span>
                </div>

                <div className="space-y-4">
                  {activeScenario.chartData.map((dataPoint, idx) => {
                    const pct = Math.min(100, Math.round((dataPoint.value / maxValue) * 100));
                    const isLast = idx === activeScenario.chartData.length - 1;

                    return (
                      <div key={dataPoint.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-medium ${isLast ? 'text-emerald-400 font-semibold' : 'text-slate-300 light:text-slate-700'}`}>
                            {dataPoint.name} {isLast && '✦ (Optimized)'}
                          </span>
                          <span className="font-mono text-slate-400">
                            {dataPoint.value}
                          </span>
                        </div>

                        {/* Animated Bar */}
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden light:bg-slate-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              isLast
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#07090e]"
              >
                {/* Code Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.08] text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono text-slate-300">
                      {activeScenario.codeSnippet.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Query</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block */}
                <div className="p-4 overflow-x-auto max-h-[340px]">
                  <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                    <code>{activeScenario.codeSnippet.code}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </BentoCard>
      </div>
    </section>
  );
}
