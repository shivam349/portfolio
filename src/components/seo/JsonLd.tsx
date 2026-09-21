import React from 'react';
import { seoConfig } from '@/config/seo';
import { portfolioData } from '@/data/portfolio';

export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: seoConfig.ownerName,
    jobTitle: seoConfig.ownerRole,
    description: seoConfig.description,
    url: seoConfig.siteUrl,
    image: seoConfig.ogImage,
    email: seoConfig.email,
    telephone: seoConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: seoConfig.location,
      addressCountry: 'India',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Birla Institute of Technology, Mesra',
    },
    knowsAbout: [
      'SQL Query Writing & Database Tuning',
      'Microsoft Power BI & DAX Modeling',
      'Power Query ETL & Data Automation',
      'Python Data Analytics',
      'Business Intelligence',
      'LangChain & GenAI Tooling',
      'Streamlit Applications',
      'Tableau Visual Analytics',
    ],
    sameAs: portfolioData.profile.socialLinks
      .filter((s) => s.url && s.url.startsWith('http'))
      .map((s) => s.url),
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.description,
    author: {
      '@type': 'Person',
      name: seoConfig.ownerName,
    },
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: seoConfig.ownerName,
    },
    url: seoConfig.siteUrl,
    name: `${seoConfig.ownerName} Profile & Portfolio`,
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: seoConfig.siteUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
    </>
  );
}
