import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2, AlertCircle, Mail, Globe } from 'lucide-react';
import { seoConfig } from '@/config/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Terms of Service | ${seoConfig.ownerName}`,
  description: `Terms of Service and Conditions of Use for ${seoConfig.ownerName}'s portfolio, analytics tools, and web services.`,
  alternates: {
    canonical: `${seoConfig.siteUrl}/terms/`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = 'September 21, 2026';

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full" />
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
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Legal Agreement</span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title Section */}
        <div className="space-y-4 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span>Terms &amp; Conditions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Effective Date: {lastUpdated} • Domain: {seoConfig.siteUrl}
          </p>
        </div>

        <div className="mt-8 space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* 1. Acceptance */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-blue-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the website at{' '}
              <a href={seoConfig.siteUrl} className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                {seoConfig.siteUrl}
              </a>{' '}
              and any associated subdomains, tools, or integrations provided by <strong>Shivam Garg</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our{' '}
              <Link href="/privacy/" className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                Privacy Policy
              </Link>.
            </p>
            <p>
              If you do not agree with any portion of these Terms, you must immediately cease accessing or using this website and services.
            </p>
          </section>

          {/* 2. Services & Permitted Use */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-emerald-400" />
              2. Description of Services &amp; Permitted Use
            </h2>
            <p>
              This website serves as an engineering portfolio, technical demonstration sandbox, and professional services platform showcasing full-stack web development, 3D interactive graphics, data analytics, and search engine optimization tooling.
            </p>
            <p>You agree to use this site strictly for lawful purposes and agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-sm">
              <li>Engage in any automated scraping, data extraction, or denial-of-service attacks against this site.</li>
              <li>Attempt to reverse-engineer, decompile, or tamper with the underlying security mechanisms or API endpoints.</li>
              <li>Impersonate any individual, entity, or falsely claim affiliation with Shivam Garg.</li>
              <li>Use the site or its APIs in any manner that violates applicable local, national, or international regulations.</li>
            </ul>
          </section>

          {/* 3. Google API Services & OAuth Integrations */}
          <section className="space-y-4 p-6 rounded-2xl border border-blue-500/30 bg-[#0d1222]/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-base sm:text-lg">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>3. Google API &amp; Third-Party Services Integration</span>
            </div>
            <p className="text-slate-200">
              When utilizing integrated Google Cloud OAuth or Search Console automation features:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/[0.06]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You warrant that you own or are an authorized administrator for any website property connected through Google Search Console.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Authentication tokens are held in strict confidence, encrypted with AES-256-GCM, and used solely to fulfill Search Console operations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>You may disconnect our access at any time via Google Account Security Settings without penalty.</span>
              </li>
            </ul>
          </section>

          {/* 4. Intellectual Property Rights */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-purple-400" />
              4. Intellectual Property Rights
            </h2>
            <p>
              Unless otherwise indicated, all original text, interactive demos, graphics, brand marks, and software code on this website are the proprietary property of <strong>Shivam Garg</strong> and are protected by applicable copyright, trademark, and intellectual property laws.
            </p>
            <p>
              Open-source libraries and frameworks (Next.js, Three.js, React, Tailwind CSS) utilized in this project remain the property of their respective copyright holders under their respective permissive open-source licenses.
            </p>
          </section>

          {/* 5. Disclaimer of Warranties */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              5. Disclaimer of Warranties
            </h2>
            <p className="text-slate-300">
              This website, its interactive demos, and automation scripts are provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express or implied.
            </p>
            <p className="text-slate-300">
              We make no representations or warranties that: (a) the website or API endpoints will meet your specific business requirements, (b) service will be uninterrupted, timely, secure, or error-free, or (c) search engines (including Google) will index or rank any specific website within any guaranteed timeframe.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              6. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, in no event shall Shivam Garg be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption, arising out of or related to your use of this website or automation tools.
            </p>
          </section>

          {/* 7. Governing Law */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-blue-400" />
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to conflict of law principles. Any legal suit or proceeding arising under these Terms shall be instituted exclusively in the competent courts located in Bengaluru, Karnataka, India.
            </p>
          </section>

          {/* 8. Contact Information */}
          <section className="space-y-3 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0e17]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-blue-400" />
              8. Contact &amp; Legal Notices
            </h2>
            <p className="text-slate-300">
              For any questions, legal notices, or inquiries regarding these Terms of Service, please reach out directly:
            </p>
            <div className="font-mono text-xs sm:text-sm text-slate-200 space-y-1">
              <p><strong>Contact:</strong> Shivam Garg</p>
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
