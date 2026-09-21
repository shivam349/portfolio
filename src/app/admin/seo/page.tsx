'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle,
  Unplug,
} from 'lucide-react';

const API_BASE = 'http://localhost:3001';

interface StatusState {
  connected: boolean;
  selectedProperty: string | null;
  isVerified: boolean;
  sitemapSubmitted: boolean;
  lastSubmitted: string | null;
  siteUrl: string;
  hasCredentials: boolean;
  indexing: {
    homepage: string;
    projects: string;
    about: string;
  };
  shortcuts: {
    searchConsole: string;
    sitemaps: string;
    urlInspection: string;
    propertySettings: string;
  };
}

interface StepProgress {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  detail?: string;
}

export default function SeoAdminPage() {
  const [status, setStatus] = useState<StatusState | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(true);
  const [properties, setProperties] = useState<Array<{ siteUrl: string; permissionLevel: string }>>([]);
  const [selectingProperty, setSelectingProperty] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Setup wizard state
  const [setupRunning, setSetupRunning] = useState(false);
  const [setupSteps, setSetupSteps] = useState<StepProgress[]>([]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/seo/status`);
      if (!res.ok) throw new Error('API server returned error');
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

    // Check url search params for status updates (e.g. ?connected=true or ?error=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('connected') === 'true') {
        setMessage({ type: 'success', text: 'Google Search Console successfully connected via OAuth 2.0!' });
        window.history.replaceState({}, '', window.location.pathname);
      } else if (params.get('error')) {
        setMessage({ type: 'error', text: decodeURIComponent(params.get('error') || 'OAuth error occurred') });
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleConnectGoogle = () => {
    if (!apiOnline) {
      setMessage({
        type: 'error',
        text: 'SEO Admin server is not running. Start it with "npm run dev" or "npm run seo:admin".',
      });
      return;
    }
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleDisconnect = async () => {
    try {
      setActionLoading('disconnect');
      const res = await fetch(`${API_BASE}/api/auth/google/disconnect`, { method: 'POST' });
      if (res.ok) {
        setMessage({ type: 'info', text: 'Google account disconnected successfully.' });
        fetchStatus();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLoadProperties = async () => {
    try {
      setActionLoading('properties');
      const res = await fetch(`${API_BASE}/api/seo/properties`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch properties');
      setProperties(data.properties || []);
      setSelectingProperty(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectProperty = async (propUrl: string) => {
    try {
      setActionLoading('select_prop');
      const res = await fetch(`${API_BASE}/api/seo/property/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: propUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to select property');
      setSelectingProperty(false);
      setMessage({ type: 'success', text: `Selected property: ${propUrl}` });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyProperty = async () => {
    try {
      setActionLoading('verify');
      const res = await fetch(`${API_BASE}/api/seo/verify`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification check failed');
      if (data.verified) {
        setMessage({ type: 'success', text: 'PROPERTY VERIFIED: Ownership confirmed by Google Search Console.' });
      } else {
        setMessage({
          type: 'error',
          text: `PROPERTY NOT VERIFIED: ${data.message || 'Google account lacks verified ownership permission.'}`,
        });
      }
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitSitemap = async () => {
    try {
      setActionLoading('sitemap');
      const res = await fetch(`${API_BASE}/api/seo/sitemap`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit sitemap');
      setMessage({
        type: 'success',
        text: `SITEMAP SUBMITTED: ${data.sitemapUrl} registered at ${new Date(data.timestamp).toLocaleTimeString()}`,
      });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheckIndexing = async (targetUrl?: string) => {
    try {
      setActionLoading('indexing');
      const res = await fetch(`${API_BASE}/api/seo/inspect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl || status?.siteUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Indexing inspection failed');

      setMessage({
        type: 'info',
        text: `Indexing status for ${data.url}: ${data.status}. (Note: ${data.instruction})`,
      });
      fetchStatus();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunSeoSetup = async () => {
    setSetupRunning(true);
    setSetupSteps([
      { id: '1', title: 'Website detected', status: 'in_progress' },
      { id: '2', title: 'robots.txt', status: 'pending' },
      { id: '3', title: 'sitemap.xml', status: 'pending' },
      { id: '4', title: 'SEO validation', status: 'pending' },
      { id: '5', title: 'Google connected', status: 'pending' },
      { id: '6', title: 'Property selected', status: 'pending' },
      { id: '7', title: 'Property verified', status: 'pending' },
      { id: '8', title: 'Sitemap submitted', status: 'pending' },
      { id: '9', title: 'Indexing monitored', status: 'pending' },
    ]);

    try {
      const res = await fetch(`${API_BASE}/api/seo/setup`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.steps) {
        setSetupSteps(data.steps);
        setMessage({ type: 'success', text: 'One-Click SEO Setup completed!' });
        fetchStatus();
      } else {
        throw new Error(data.error || 'Failed to complete SEO setup');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSetupRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  SEO & Search Console System
                </h1>
                <p className="text-sm text-slate-400">
                  Production-grade automated SEO, Google Search Console sync, and indexing monitoring.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/setup"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Setup Wizard
            </Link>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Offline notice if API server isn't reached */}
        {!apiOnline && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Local SEO Admin Server Not Detected</p>
              <p className="text-amber-300/80 mt-1">
                To interact live with Google OAuth, property selection, and sitemap submission, start the dev environment by running{' '}
                <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-200 font-mono text-xs">npm run dev</code> or{' '}
                <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-200 font-mono text-xs">npm run seo:server</code>.
              </p>
            </div>
          </div>
        )}

        {/* Notifications */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-start gap-3 transition ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : message.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
            {message.type === 'info' && <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" />}
            <div className="flex-1">{message.text}</div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs opacity-60 hover:opacity-100 font-mono"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1-Click SEO Setup Action Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <Zap className="w-3.5 h-3.5" /> One-Click Automated Pipeline
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Automate Full SEO & Search Console Setup</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Validates technical SEO, verifies canonical URLs, connects Google Search Console, verifies property ownership, and submits the sitemap automatically.
              </p>
            </div>

            <button
              onClick={handleRunSeoSetup}
              disabled={setupRunning || !apiOnline}
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <Zap className="w-5 h-5" />
              {setupRunning ? 'Running Setup...' : 'RUN SEO SETUP'}
            </button>
          </div>

          {/* Progress UI if setup running or completed */}
          {setupSteps.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {setupSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                >
                  {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {step.status === 'in_progress' && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
                  {step.status === 'pending' && <Clock className="w-4 h-4 text-slate-500 shrink-0" />}
                  {step.status === 'failed' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <div className="truncate">
                    <span className="font-medium text-slate-200">{step.title}</span>
                    {step.detail && <span className="block text-slate-400 truncate">{step.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Connection</span>
            <div className="flex items-center gap-2">
              {status?.connected ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-slate-400" />
                  <span className="text-lg font-bold text-slate-300">Not Connected</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500">Official Google OAuth 2.0</p>
          </div>

          {/* Property */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Property</span>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-bold text-slate-100 truncate">
                {status?.selectedProperty ? 'Selected' : 'Not Selected'}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate" title={status?.selectedProperty || 'None'}>
              {status?.selectedProperty || 'No property chosen'}
            </p>
          </div>

          {/* Verification */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Verification</span>
            <div className="flex items-center gap-2">
              {status?.isVerified ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-400">Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span className="text-lg font-bold text-amber-400">Not Verified</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500">Google Search Console ownership</p>
          </div>

          {/* Sitemap */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Sitemap</span>
            <div className="flex items-center gap-2">
              {status?.sitemapSubmitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg font-bold text-emerald-400">Submitted</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span className="text-lg font-bold text-slate-300">Not Submitted</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              {status?.lastSubmitted ? `At ${new Date(status.lastSubmitted).toLocaleDateString()}` : 'Pending submission'}
            </p>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Google Search Console Management Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Connect Google Button */}
            {!status?.connected ? (
              <button
                onClick={handleConnectGoogle}
                disabled={actionLoading !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm transition shadow-sm"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                Connect Google Search Console
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                disabled={actionLoading !== null}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm border border-slate-700 transition"
              >
                <Unplug className="w-4 h-4 text-rose-400" />
                Disconnect Account
              </button>
            )}

            {/* Select Property Button */}
            <button
              onClick={handleLoadProperties}
              disabled={!status?.connected || actionLoading !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition disabled:opacity-40"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              {actionLoading === 'properties' ? 'Fetching...' : 'Select Property'}
            </button>

            {/* Verify Property Button */}
            <button
              onClick={handleVerifyProperty}
              disabled={!status?.selectedProperty || actionLoading !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition disabled:opacity-40"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {actionLoading === 'verify' ? 'Checking...' : 'Verify Property'}
            </button>

            {/* Submit Sitemap Button */}
            <button
              onClick={handleSubmitSitemap}
              disabled={!status?.isVerified || actionLoading !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              {actionLoading === 'sitemap' ? 'Submitting...' : 'Submit Sitemap'}
            </button>

            {/* Check Indexing Button */}
            <button
              onClick={() => handleCheckIndexing()}
              disabled={!status?.selectedProperty || actionLoading !== null}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition disabled:opacity-40"
            >
              <Search className="w-4 h-4 text-amber-400" />
              {actionLoading === 'indexing' ? 'Inspecting...' : 'Check Indexing'}
            </button>

            {/* Open Search Console */}
            <a
              href={status?.shortcuts.searchConsole || 'https://search.google.com/search-console'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-semibold text-sm border border-cyan-500/30 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Open Search Console
            </a>
          </div>

          {/* Property Selection Dropdown / List */}
          {selectingProperty && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-cyan-300">Available Search Console Properties</span>
                <button
                  onClick={() => setSelectingProperty(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {properties.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No properties found in this Google account. Ensure you have added the site in Google Search Console.
                </p>
              ) : (
                <div className="space-y-2">
                  {properties.map((p) => (
                    <div
                      key={p.siteUrl}
                      onClick={() => handleSelectProperty(p.siteUrl)}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer transition"
                    >
                      <div className="truncate">
                        <span className="text-sm font-mono text-slate-200">{p.siteUrl}</span>
                        <span className="block text-xs text-slate-400">Permission: {p.permissionLevel}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Indexing Monitor Panel */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white">Indexing Status Monitor</h3>
              <p className="text-xs text-slate-400">
                Verified Google Search Console data. Statuses are strictly evidence-based.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 self-start">
              Policy: Never Faked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Homepage */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">/ (Homepage)</span>
              <div className="mt-1 flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${
                    status?.indexing.homepage === 'INDEXED'
                      ? 'text-emerald-400'
                      : status?.indexing.homepage === 'CRAWLED'
                      ? 'text-cyan-400'
                      : status?.indexing.homepage === 'DISCOVERED'
                      ? 'text-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {status?.indexing.homepage || 'UNKNOWN'}
                </span>
                <button
                  onClick={() => handleCheckIndexing(status?.siteUrl)}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Inspect
                </button>
              </div>
            </div>

            {/* Projects */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">/#projects</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">
                  {status?.indexing.projects || 'UNKNOWN'}
                </span>
                <span className="text-xs text-slate-600">Fragment</span>
              </div>
            </div>

            {/* About */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">/#about</span>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400">
                  {status?.indexing.about || 'UNKNOWN'}
                </span>
                <span className="text-xs text-slate-600">Fragment</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-300">Google Indexing Policy:</strong> Submitting a sitemap prompts Google to discover URLs. Google does not guarantee immediate indexing. To request priority indexing, open the URL Inspection tool in Search Console and click &quot;Request Indexing&quot;.
          </div>
        </div>

        {/* Dynamic Search Console Shortcuts */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Google Search Console Shortcuts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href={status?.shortcuts.searchConsole || 'https://search.google.com/search-console'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
            >
              <span className="text-sm text-slate-300 font-medium">Open Search Console</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </a>

            <a
              href={status?.shortcuts.sitemaps || 'https://search.google.com/search-console/sitemaps'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
            >
              <span className="text-sm text-slate-300 font-medium">Open Sitemaps</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </a>

            <a
              href={status?.shortcuts.urlInspection || 'https://search.google.com/search-console/inspect'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
            >
              <span className="text-sm text-slate-300 font-medium">Open URL Inspection</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </a>

            <a
              href={status?.shortcuts.propertySettings || 'https://search.google.com/search-console/settings'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
            >
              <span className="text-sm text-slate-300 font-medium">Open Property Settings</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
            </a>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
          <div>Portfolio SEO Automation System</div>
          <Link href="/" className="hover:text-cyan-400 transition">
            ← Return to Portfolio Website
          </Link>
        </div>
      </div>
    </div>
  );
}
