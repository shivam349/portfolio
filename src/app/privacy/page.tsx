import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, Database, UserCheck, Eye, RefreshCw, Mail, Globe, CheckCircle2 } from 'lucide-react';
import { seoConfig } from '@/config/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Privacy Policy | ${seoConfig.ownerName}`,
  description: `Privacy Policy and Google API Data Disclosure for ${seoConfig.ownerName}'s portfolio and analytics services.`,
  alternates: {
    canonical: `${seoConfig.siteUrl}/privacy/`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 21, 2026';

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#090b12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Policy Document</span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title Section */}
        <div className="space-y-4 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Google API Compliance & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Last Updated: {lastUpdated} • Owner: Shivam Garg ({seoConfig.siteUrl})
          </p>
        </div>

        <div className="mt-8 space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-blue-400" />
              1. Overview & Scope
            </h2>
            <p>
              This Privacy Policy explains how <strong>Shivam Garg</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating via the website{' '}
              <a href={seoConfig.siteUrl} className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                {seoConfig.siteUrl}
              </a>, collects, utilizes, stores, and protects user information when you visit this website or use our integrated Google Search Console and SEO automation tools.
            </p>
            <p>
              We are strictly committed to safeguarding your personal data and upholding the highest standards of data transparency in compliance with global standards and Google&apos;s API Services User Data Policy.
            </p>
          </section>

          {/* 2. Google API Services User Data Disclosure */}
          <section className="space-y-4 p-6 rounded-2xl border border-blue-500/30 bg-[#0d1222]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-base sm:text-lg">
              <Lock className="w-5 h-5 text-blue-400" />
              <span>2. Google API Services User Data Policy Compliance</span>
            </div>
            <p className="text-slate-200">
              Our application requests authorization via Google OAuth 2.0 to automate technical SEO property registration and sitemap submissions. Specifically, we request access to the following limited scopes:
            </p>

            <ul className="space-y-2 text-xs sm:text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/[0.06]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>https://www.googleapis.com/auth/webmasters</strong>: Used exclusively to view, add Search Console properties, and submit/monitor XML sitemaps for verified domains.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>https://www.googleapis.com/auth/siteverification</strong>: Used solely to verify website domain ownership with Google automatically.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>userinfo.email / openid</strong>: Used only to display the authenticated account email identifier in the administrative CLI/dashboard for confirmation.</span>
              </li>
            </ul>

            <div className="pt-2 space-y-2">
              <h3 className="font-semibold text-white text-sm">How Google User Data is Handled:</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-sm">
                <li><strong>No Sale of Data:</strong> We never sell, lease, or monetize your Google account credentials or Search Console data under any circumstances.</li>
                <li><strong>No Advertising Use:</strong> Data obtained via Google APIs is never used for serving advertisements, retargeting, or consumer profiling.</li>
                <li><strong>No Training AI Models:</strong> Google user data is strictly excluded from training generative AI models or machine learning algorithms.</li>
                <li><strong>Encrypted Storage:</strong> OAuth refresh tokens are encrypted at rest using AES-256-GCM encryption on secured server environments and are never transmitted to client-side browsers.</li>
              </ul>
            </div>
          </section>

          {/* 3. Information We Collect from Visitors */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Database className="w-5 h-5 text-emerald-400" />
              3. Information Collected from Website Visitors
            </h2>
            <p>
              When navigating the public portfolio, we collect minimal data required for normal website operation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Contact Inquiries:</strong> If you contact us via direct email, we retain your email address and message contents solely to respond to your professional query.</li>
              <li><strong>Technical Diagnostics:</strong> Standard web server logs (IP address, browser type, referring pages) may be generated by hosting platforms (e.g., Vercel) for performance monitoring and DDoS mitigation.</li>
              <li><strong>No Tracking Cookies:</strong> We do not track users across third-party websites or deploy tracking beacons.</li>
            </ul>
          </section>

          {/* 4. Data Retention and Revocation */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              4. Data Retention, Revocation & Deletion
            </h2>
            <p>
              You maintain complete ownership of your Google data and may revoke our application&apos;s permissions at any time:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
              <li>
                Visit your{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
                >
                  Google Account Third-Party Permissions
                </a>{' '}
                page.
              </li>
              <li>Locate this application and select <strong>&quot;Remove Access&quot;</strong>.</li>
            </ol>
            <p>
              Upon request or permission revocation, all stored tokens associated with your account are immediately permanently wiped from our systems.
            </p>
          </section>

          {/* 5. Contact Information */}
          <section className="space-y-3 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0e17]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-blue-400" />
              5. Contact Us / Data Protection Officer
            </h2>
            <p className="text-slate-300">
              If you have any questions, verification concerns, or data deletion requests regarding this Privacy Policy, please contact:
            </p>
            <div className="font-mono text-xs sm:text-sm text-slate-200 space-y-1">
              <p><strong>Entity:</strong> Shivam Garg (Data & Engineering Portfolio)</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:shivamgarg1515@gmail.com" className="text-blue-400 hover:underline">
                  shivamgarg1515@gmail.com
                </a>
              </p>
              <p><strong>Location:</strong> Greater Bengaluru Area, India</p>
              <p><strong>Website:</strong> <a href={seoConfig.siteUrl} className="text-blue-400 hover:underline">{seoConfig.siteUrl}</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-slate-500 font-mono">
        <p>&copy; {new Date().getFullYear()} Shivam Garg. All rights reserved.</p>
      </footer>
    </div>
  );
}
