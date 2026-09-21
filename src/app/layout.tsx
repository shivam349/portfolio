import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';
import { portfolioData } from '@/data/portfolio';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: `${portfolioData.profile.name} — Data Analyst & Business Intelligence Specialist`,
  description: portfolioData.profile.bio,
  keywords: siteConfig.keywords,
  authors: [{ name: portfolioData.profile.name, url: siteConfig.siteUrl }],
  creator: portfolioData.profile.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.siteUrl,
    title: `${portfolioData.profile.name} | Data Analyst & BI Specialist`,
    description: portfolioData.profile.bio,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${portfolioData.profile.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${portfolioData.profile.name} | Data Analyst & BI Specialist`,
    description: portfolioData.profile.shortBio,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolioData.profile.name,
    jobTitle: 'Data Analyst & Business Intelligence Specialist',
    description: portfolioData.profile.bio,
    email: portfolioData.profile.email,
    telephone: portfolioData.profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressCountry: 'India',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Birla Institute of Technology, Mesra',
    },
    knowsAbout: [
      'SQL',
      'Microsoft Power BI',
      'Power Query',
      'Python',
      'Data Analytics',
      'Business Intelligence',
      'LangChain',
      'Streamlit',
      'Tableau',
      'Database Optimization',
    ],
    sameAs: [
      'https://www.linkedin.com/in/shivam-garg-21b25a1b4',
      'https://github.com/shivamgarg1515',
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#090a0f] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
