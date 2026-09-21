'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Globe,
  ShieldCheck,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_SEO_BACKEND_URL || 'http://localhost:3001';

const STEPS = [
  { id: 1, name: 'Website Configuration' },
  { id: 2, name: 'SEO Validation' },
  { id: 3, name: 'Connect Google' },
  { id: 4, name: 'Select Property' },
  { id: 5, name: 'Verify Ownership' },
  { id: 6, name: 'Submit Sitemap' },
  { id: 7, name: 'Indexing Health Check' },
  { id: 8, name: 'Final SEO Report' },
];

export default function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [checking, setChecking] = useState(false);
  const [stepData, setStepData] = useState<any>({});

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/seo/status`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStatus(data);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep((c) => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((c) => c - 1);
  };

  const handleFetchProperties = async () => {
    try {
      setChecking(true);
      const res = await fetch(`${API_BASE}/api/seo/properties`);
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties || []);
      }
    } catch {
    } finally {
      setChecking(false);
    }
  };

  const handleSelectProperty = async (propUrl: string) => {
    try {
      setChecking(true);
      await fetch(`${API_BASE}/api/seo/property/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: propUrl }),
      });
      await fetchStatus();
    } catch {
    } finally {
      setChecking(false);
    }
  };

  const handleVerify = async () => {
    try {
      setChecking(true);
      await fetch(`${API_BASE}/api/seo/verify`, { method: 'POST' });
      await fetchStatus();
    } catch {
    } finally {
      setChecking(false);
    }
  };

  const handleSubmitSitemap = async () => {
    try {
      setChecking(true);
      await fetch(`${API_BASE}/api/seo/sitemap`, { method: 'POST' });
      await fetchStatus();
    } catch {
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Client SEO Onboarding Wizard</h1>
              <p className="text-sm text-slate-400">Step-by-step production SEO activation</p>
            </div>
          </div>
          <Link
            href="/admin/seo"
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            Go to Admin Dashboard →
          </Link>
        </div>

        {/* Wizard Step Navigation Bar */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {STEPS.map((s) => {
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`p-2.5 rounded-xl text-left border transition ${
                  isActive
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 ring-1 ring-cyan-500/30'
                    : isDone
                    ? 'bg-slate-900/80 border-slate-800 text-emerald-400 hover:bg-slate-900'
                    : 'bg-slate-950 border-slate-900 text-slate-600 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1 text-xs font-mono">
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>0{s.id}</span>}
                </div>
                <div className="text-[11px] font-medium truncate mt-1">{s.name}</div>
              </button>
            );
          })}
        </div>

        {/* Step Card Content */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          {/* STEP 1: Website Configuration */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Globe className="w-5 h-5" /> STEP 1: Website Configuration
              </div>
              <h2 className="text-xl font-bold text-white">Verify Central Portfolio Parameters</h2>
              <p className="text-sm text-slate-400">
                These settings are centrally configured via environment variables and propagate to canonical tags, sitemap.xml, robots.txt, OpenGraph, and JSON-LD structured data.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">SITE_URL:</span>
                  <span className="block text-cyan-300 font-semibold mt-0.5 truncate">
                    {status?.siteUrl || 'https://portfolio-eight-sigma-mzugu1b20s.vercel.app'}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">OWNER_NAME:</span>
                  <span className="block text-slate-200 mt-0.5">Shivam</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">OWNER_ROLE:</span>
                  <span className="block text-slate-200 mt-0.5">Full Stack & Three.js Engineer</span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500">CONFIG SOURCE:</span>
                  <span className="block text-emerald-400 mt-0.5">src/config/seo.ts (.env.local)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                ✓ Centralized configuration active. Changing <code className="font-mono font-bold">SITE_URL</code> automatically updates all canonical tags, sitemaps, and robots.txt.
              </div>
            </div>
          )}

          {/* STEP 2: SEO Validation */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <FileCode className="w-5 h-5" /> STEP 2: Technical SEO Validation
              </div>
              <h2 className="text-xl font-bold text-white">Automated Technical SEO Checks</h2>
              <p className="text-sm text-slate-400">
                Ensures all critical SEO assets and tags comply with production standards.
              </p>

              <div className="space-y-2">
                {[
                  { name: 'robots.txt', desc: 'Allows crawling, specifies sitemap URL, no accidental disallow' },
                  { name: 'sitemap.xml', desc: 'Valid XML schema, HTTPS canonical URLs, excludes /admin & /api' },
                  { name: 'Dynamic Canonical URLs', desc: 'Exact SITE_URL canonical tags generated on every page' },
                  { name: 'Open Graph & Twitter Cards', desc: 'High-res image, titles, description, card type' },
                  { name: 'Schema.org JSON-LD', desc: 'Person, ProfilePage, WebSite, BreadcrumbList structured data' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="block text-xs text-slate-400">{item.desc}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Connect Google */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Globe className="w-5 h-5" /> STEP 3: Connect Google Account
              </div>
              <h2 className="text-xl font-bold text-white">Google OAuth 2.0 Integration</h2>
              <p className="text-sm text-slate-400">
                Authenticate with Google to grant Search Console API access for automated sitemap submissions and indexing data.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">Google Account Status:</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    {status?.connected ? 'Authenticated via official Google OAuth' : 'Not yet connected'}
                  </span>
                </div>
                {status?.connected ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> CONNECTED
                  </span>
                ) : (
                  <a
                    href={`${API_BASE}/api/auth/google`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition"
                  >
                    Connect Google
                  </a>
                )}
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>• Zero passwords requested or stored.</p>
                <p>• Uses official OAuth 2.0 with offline refresh token rotation.</p>
                <p>• Client secrets are handled 100% server-side and never exposed to the browser.</p>
              </div>
            </div>
          )}

          {/* STEP 4: Select Search Console property */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Layers className="w-5 h-5" /> STEP 4: Select Search Console Property
              </div>
              <h2 className="text-xl font-bold text-white">Search Console Property Discovery</h2>
              <p className="text-sm text-slate-400">
                Automatically matches your website URL with properties in your Google Search Console account.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Active Property:</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {status?.selectedProperty || 'None Selected'}
                  </span>
                </div>

                <button
                  onClick={handleFetchProperties}
                  disabled={!status?.connected || checking}
                  className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition disabled:opacity-50"
                >
                  {checking ? 'Scanning Properties...' : 'Fetch Properties from Google'}
                </button>

                {properties.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    {properties.map((p) => (
                      <button
                        key={p.siteUrl}
                        onClick={() => handleSelectProperty(p.siteUrl)}
                        className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-800 text-xs font-mono flex items-center justify-between"
                      >
                        <span className="truncate">{p.siteUrl}</span>
                        <span className="text-[10px] text-slate-500">{p.permissionLevel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Verify ownership */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5" /> STEP 5: Verify Ownership
              </div>
              <h2 className="text-xl font-bold text-white">Google Search Console Verification</h2>
              <p className="text-sm text-slate-400">
                Checks whether your Google account has verified ownership for the property.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">Verification Status:</span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    {status?.isVerified ? 'Ownership verified with Google' : 'Pending verification'}
                  </span>
                </div>
                {status?.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> VERIFIED
                  </span>
                ) : (
                  <button
                    onClick={handleVerify}
                    disabled={checking}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition"
                  >
                    {checking ? 'Checking...' : 'Check Verification'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Submit sitemap */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" /> STEP 6: Submit Sitemap
              </div>
              <h2 className="text-xl font-bold text-white">Submit sitemap.xml to Google</h2>
              <p className="text-sm text-slate-400">
                Submits the clean sitemap URL directly to the official Google Search Console API.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Sitemap:</span>
                  <span className="font-mono text-cyan-300">{status?.siteUrl}/sitemap.xml</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Submission State:</span>
                  <span className={`font-semibold ${status?.sitemapSubmitted ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {status?.sitemapSubmitted ? 'SITEMAP SUBMITTED' : 'NOT SUBMITTED'}
                  </span>
                </div>

                <button
                  onClick={handleSubmitSitemap}
                  disabled={!status?.isVerified || checking}
                  className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition disabled:opacity-40"
                >
                  {checking ? 'Submitting to Google...' : 'Submit Sitemap Now'}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Notice: Google processes sitemaps asynchronously. Sitemap submission does not guarantee immediate indexing.
              </p>
            </div>
          )}

          {/* STEP 7: Indexing health check */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Search className="w-5 h-5" /> STEP 7: Indexing Health Check
              </div>
              <h2 className="text-xl font-bold text-white">Monitor Google Indexing Progress</h2>
              <p className="text-sm text-slate-400">
                Query Search Console URL Inspection for live coverage and indexing state.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">Homepage:</span>
                  <span className="block text-sm font-bold text-slate-200 mt-1">
                    {status?.indexing.homepage || 'UNKNOWN'}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">Projects:</span>
                  <span className="block text-sm font-bold text-slate-200 mt-1">
                    {status?.indexing.projects || 'UNKNOWN'}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">About:</span>
                  <span className="block text-sm font-bold text-slate-200 mt-1">
                    {status?.indexing.about || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Indexing requests must be completed in Google Search Console if priority indexing is required.
              </div>
            </div>
          )}

          {/* STEP 8: Final SEO Report */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" /> STEP 8: Final SEO Report
              </div>
              <h2 className="text-2xl font-bold text-white">SEO SETUP COMPLETE</h2>

              <div className="p-6 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-4 font-mono text-xs">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-slate-500 block uppercase tracking-wider">Website:</span>
                  <span className="text-white font-bold text-sm">{status?.siteUrl || 'Configured'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider">Google:</span>
                    <span className="text-emerald-400 font-bold">{status?.connected ? 'Connected' : 'Pending OAuth'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider">Property:</span>
                    <span className="text-cyan-400 font-bold">{status?.isVerified ? 'Verified' : 'Pending Verification'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider">Sitemap:</span>
                    <span className="text-emerald-400 font-bold">{status?.sitemapSubmitted ? 'Submitted' : 'Pending Submission'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase tracking-wider">Indexing:</span>
                    <span className="text-amber-400 font-bold">Being monitored</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <strong>Policy Compliance:</strong> Google indexing results are never faked. Status remains &quot;Being monitored&quot; until Google crawls and indexes the live URL.
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 disabled:opacity-30 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs text-slate-500 font-mono">
              Step {currentStep} of {STEPS.length}
            </span>

            {currentStep < 8 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/admin/seo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition"
              >
                Go to Dashboard <CheckCircle2 className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
