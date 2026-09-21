'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, FileText } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { portfolioData } from '@/data/portfolio';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['hero', 'metrics', 'about', 'sandbox', 'experience', 'projects', 'skills', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#090a0f]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] light:bg-white/85 light:border-slate-200 light:shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-white light:text-slate-900 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
            SG
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white light:text-slate-900 group-hover:text-blue-400 transition-colors">
              {portfolioData.profile.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Data & BI Analyst
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full backdrop-blur-md light:bg-slate-100/70 light:border-slate-200">
          {siteConfig.navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  isActive
                    ? 'text-white light:text-blue-600'
                    : 'text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-blue-500/20 border border-blue-500/40 rounded-full -z-10 light:bg-blue-100 light:border-blue-300"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          
          <a
            href={portfolioData.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all light:text-slate-700 light:border-slate-300 light:hover:bg-slate-100"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Resume</span>
          </a>

          <ShimmerButton
            variant="primary"
            size="sm"
            asLink
            href="#contact"
          >
            <span>Let&apos;s Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </ShimmerButton>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white light:border-slate-300 light:bg-slate-100 light:text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-white/10 bg-[#090a0f]/95 backdrop-blur-2xl light:bg-white/95 light:border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {siteConfig.navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400 font-semibold'
                        : 'text-slate-300 hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}

              <div className="pt-4 border-t border-white/10 light:border-slate-200 flex flex-col gap-2">
                <a
                  href={portfolioData.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border border-white/10 text-slate-200 light:text-slate-800"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Download Resume</span>
                </a>
                <ShimmerButton
                  variant="primary"
                  size="md"
                  asLink
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Contact Shivam</span>
                  <ArrowUpRight className="w-4 h-4" />
                </ShimmerButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
