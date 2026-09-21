'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  Copy,
  Check,
  FileText,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/Icons';
import { portfolioData } from '@/data/portfolio';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BentoCard } from '@/components/ui/BentoCard';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

export function Contact() {
  const { profile } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 border-t border-white/[0.06] light:border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Get In Touch"
          title="Let's Discuss Your Next"
          titleHighlight="Data & BI Initiative"
          description="Open to full-time Data Analyst and Business Intelligence positions in Bengaluru or Remote. Let's explore how my analytics, automation, and SQL expertise can support your team."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left contact card */}
          <div className="lg:col-span-5 space-y-4">
            <BentoCard className="p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-white light:text-slate-900">
                Direct Contact Channels
              </h3>
              <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                Reach out directly via email, phone, or LinkedIn. I typically respond within 24 hours.
              </p>

              <div className="space-y-3">
                {/* Email with copy button */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 light:bg-slate-50 light:border-slate-200">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Email Address</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-mono font-medium text-white hover:text-blue-400 transition-colors truncate block light:text-slate-900 light:hover:text-blue-600"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 light:bg-slate-200 light:text-slate-700"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 light:bg-slate-50 light:border-slate-200">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Phone / Work</span>
                    <a
                      href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                      className="text-sm font-mono font-medium text-white hover:text-emerald-400 transition-colors light:text-slate-900 light:hover:text-emerald-600"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/shivam-garg-21b25a1b4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-blue-500/40 transition-colors group light:bg-slate-50 light:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 shrink-0">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">LinkedIn Profile</span>
                      <span className="text-sm font-mono text-white group-hover:text-blue-400 transition-colors light:text-slate-900">
                        in/shivam-garg-21b25a1b4
                      </span>
                    </div>
                  </div>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/shivamgarg1515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/25 transition-colors group light:bg-slate-50 light:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10 text-white shrink-0 light:bg-slate-200 light:text-slate-800">
                      <GithubIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">GitHub Repositories</span>
                      <span className="text-sm font-mono text-white group-hover:text-blue-400 transition-colors light:text-slate-900">
                        github.com/shivamgarg1515
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Resume download box */}
              <div className="pt-2">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors hover:border-white/30 light:border-slate-300 light:bg-slate-100 light:text-slate-900"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Download Verified Resume (PDF)</span>
                </a>
              </div>
            </BentoCard>
          </div>

          {/* Right quick messaging form */}
          <div className="lg:col-span-7">
            <BentoCard className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white light:text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Send a Direct Message</span>
              </h3>
              <p className="text-sm text-slate-400 light:text-slate-600 mb-6">
                Have an open opportunity, freelance project, or data consultation request? Drop a message here.
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white light:text-slate-900">
                    Message Received!
                  </h4>
                  <p className="text-xs text-slate-300 light:text-slate-700 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. You can also reach out straight to{' '}
                    <strong className="text-white light:text-slate-900">{profile.email}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sarah Jenkins"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1.5">
                        Your Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1.5">
                      Project or Role Details
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Shivam, we're looking for a Data Analyst in Bengaluru for our logistics intelligence team..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder-slate-400"
                    />
                  </div>

                  <ShimmerButton variant="primary" size="md" className="w-full">
                    <Send className="w-4 h-4" />
                    <span>Send Message to Shivam</span>
                  </ShimmerButton>
                </form>
              )}
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
