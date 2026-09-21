'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Download,
  Mail,
  MapPin,
  Sparkles,
  Database,
  BarChart3,
  Terminal,
  Layers,
  Compass,
  Eye,
  Activity,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { portfolioData } from '@/data/portfolio';
import { Badge } from '@/components/ui/Badge';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { ClientHeroAnimal } from '@/components/3d/ClientHeroAnimal';

export function Hero() {
  const { profile } = portfolioData;

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-radial-gradient bg-grid-pattern"
    >
      {/* Interactive 3D Animal Model (React Three Fiber Background Canvas) */}
      <ClientHeroAnimal />

      {/* Bioluminescent ambient neon lighting orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-emerald-500/10 blur-[130px] rounded-full light:bg-emerald-400/10" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Availability Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium backdrop-blur-md shadow-[0_0_18px_rgba(0,255,157,0.2)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>{profile.availability.text}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-slate-300 light:text-slate-700">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Bengaluru &amp; Remote
              </span>
            </motion.div>

            {/* Name Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white light:text-slate-900 leading-[1.08]"
            >
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {profile.name}
              </span>
            </motion.h1>

            {/* Professional Role Title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-200 light:text-slate-800 tracking-tight"
            >
              Data Analyst &amp; Business Intelligence Specialist
            </motion.p>

            {/* Short Positioning Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 text-base sm:text-lg text-slate-400 light:text-slate-600 max-w-xl leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            {/* Quick Technical Stack Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2"
            >
              <Badge variant="mono" size="md" className="gap-1.5 border-emerald-500/20 text-emerald-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQL &amp; Production Queries</span>
              </Badge>
              <Badge variant="mono" size="md" className="gap-1.5 border-cyan-500/20 text-cyan-300">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Power BI &amp; Power Query</span>
              </Badge>
              <Badge variant="mono" size="md" className="gap-1.5 border-teal-500/20 text-teal-300">
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>Python &amp; Automation</span>
              </Badge>
              <Badge variant="mono" size="md" className="gap-1.5 border-blue-500/20 text-blue-300">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>LangChain &amp; GenAI</span>
              </Badge>
            </motion.div>

            {/* Primary & Secondary Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <ShimmerButton
                variant="primary"
                size="lg"
                asLink
                href="#sandbox"
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 border-emerald-400/40 shadow-[0_0_25px_rgba(0,255,157,0.3)] hover:shadow-[0_0_32px_rgba(0,255,157,0.5)]"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Explore Interactive Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>

              <ShimmerButton
                variant="secondary"
                size="lg"
                asLink
                href="#projects"
              >
                <span>View Case Studies</span>
              </ShimmerButton>

              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium transition-all hover:border-white/30 light:border-slate-300 light:bg-slate-100 light:text-slate-800"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download CV</span>
              </a>
            </motion.div>

            {/* Social Profiles & Quick Contact Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-8 flex items-center gap-4 text-slate-400"
            >
              <a
                href="https://www.linkedin.com/in/shivam-garg-21b25a1b4"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-600/15 hover:border-emerald-500/40 hover:text-emerald-400 transition-all light:border-slate-300 light:bg-white light:hover:bg-emerald-50"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/shivamgarg1515"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/30 hover:text-white transition-all light:border-slate-300 light:bg-white light:hover:bg-slate-100"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="mailto:shivamgarg1515@gmail.com"
                aria-label="Send direct email"
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-600/15 hover:border-emerald-500/40 hover:text-emerald-400 transition-all light:border-slate-300 light:bg-white light:hover:bg-emerald-50"
              >
                <Mail className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: 3D Interactive Telemetry & Flight Tracking Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {/* 3D Flight Status Card */}
            <div className="p-6 rounded-2xl border border-emerald-500/25 bg-[#09120d]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    3D Animal Flight Canvas
                  </span>
                </div>
                <Badge variant="success" size="sm">
                  WebGL R3F Active
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    Interactive Tracking:
                  </span>
                  <span className="text-white font-medium">Pointer Vector (XYZ)</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Physics Response:
                  </span>
                  <span className="text-cyan-300 font-medium">Aerodynamic Banking</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    Animation State:
                  </span>
                  <span className="text-emerald-400 font-medium">Looping Wing Flap</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                <span>Move your cursor to guide the avian model in 3D space</span>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Quick Analytics Verification Card */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0b0e17]/80 backdrop-blur-md grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Orders Tracked</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">10,000+/mo</span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">-15% RTO Drop</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">SLA Compliance</span>
                <span className="text-xl font-bold font-mono text-white mt-0.5 block">98% OTD</span>
                <span className="text-[10px] text-cyan-400 mt-0.5 block">Production Delivery</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
