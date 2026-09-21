'use client';

import React from 'react';
import { ArrowUp, Heart, Sparkles } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { siteConfig } from '@/config/site';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-white/[0.08] bg-[#07080d] light:bg-slate-50 light:border-slate-200 text-slate-400 light:text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left identity */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white light:text-slate-900 text-sm">
                {portfolioData.profile.name}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                Data Analyst &amp; BI Specialist
              </span>
            </div>
            <p className="text-xs text-slate-500 light:text-slate-500 mt-1">
              Turning raw business data into decisions across logistics, e-commerce, and GenAI.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium">
            <a href="#hero" className="hover:text-white transition-colors">
              Overview
            </a>
            <a href="#metrics" className="hover:text-white transition-colors">
              Metrics
            </a>
            <a href="#sandbox" className="hover:text-white transition-colors">
              Sandbox
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Experience
            </a>
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Right Back to Top */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer light:border-slate-300 light:bg-white light:text-slate-700"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.04] light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {portfolioData.profile.name}. All rights reserved. Reusable Productized Portfolio Template.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision using Next.js, React, Tailwind &amp; Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
