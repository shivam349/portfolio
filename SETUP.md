# Production-Grade Automated SEO & Google Search Console Setup Guide

This guide provides step-by-step instructions for deploying, customizing, and automating the SEO & Google Search Console (GSC) integration for this portfolio.

For detailed Google Cloud configuration and production architecture, see [GOOGLE_PRODUCTION_SETUP.md](GOOGLE_PRODUCTION_SETUP.md).

---

## Architecture & Automation Matrix

| Phase | Action | Categorization | Description |
| :--- | :--- | :--- | :--- |
| **Build & Deploy** | Generate `sitemap.xml` & `robots.txt` | **AUTOMATIC** | Generated during `npm run build` from `SITE_URL` |
| **Build & Deploy** | Dynamic Canonical & Metadata | **AUTOMATIC** | Injected on every route using `SITE_URL` |
| **Build & Deploy** | Schema.org JSON-LD | **AUTOMATIC** | Generates `Person`, `ProfilePage`, `WebSite`, `BreadcrumbList` |
| **CI/CD** | Live URL & Sitemap Health Check | **AUTOMATIC** | Runs via `.github/workflows/seo.yml` |
| **GSC Connection** | Google OAuth 2.0 Consent | **USER AUTHORIZATION** | User logs into Google and grants Search Console access |
| **GSC Connection** | Property Detection | **AUTOMATIC** | Matches `SITE_URL` with GSC properties list |
| **GSC Ownership** | Domain/HTML Verification | **GOOGLE-CONTROLLED** | Confirmed via Google Search Console ownership check |
| **GSC Sitemap** | Automated Sitemap Submission | **AUTOMATIC** | Submits `/sitemap.xml` via official GSC API |
| **Indexing** | Page Crawling & Indexing | **GOOGLE-CONTROLLED** | Determined exclusively by Google's search algorithms |
| **Monitoring** | Indexing Status Tracking | **AUTOMATIC** | Queries Search Console URL Inspection API |

---

## 1. Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
SITE_URL=https://shivam349.github.io/portfolio
NEXT_PUBLIC_SITE_URL=https://shivam349.github.io/portfolio
SITE_NAME=Shivam - AI & Full Stack Portfolio
OWNER_NAME=Shivam
OWNER_ROLE=Full Stack & Three.js Engineer
DESCRIPTION=Portfolio of Shivam - Software Engineer specializing in 3D Web, React, and Full Stack Architecture.
OG_IMAGE=https://shivam349.github.io/portfolio/og-image.png

# Google Cloud OAuth 2.0 Credentials (portfolio-509304)
GOOGLE_PROJECT_ID=portfolio-509304
GOOGLE_CLIENT_ID=1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
GOOGLE_ENCRYPTION_KEY=1d908eb4b5245e086840a23cba2a4fd411461a1445d2803eae7d853aa96c7215
NEXT_PUBLIC_SEO_BACKEND_URL=http://localhost:3001
```

### 3. Validate Google & SEO Readiness
```bash
# Verify Google Cloud OAuth, scopes, and API endpoints
npm run google:check

# Build SEO assets (sitemap.xml, robots.txt)
npm run seo:build

# Validate technical SEO integrity
npm run seo:check

# Generate comprehensive SEO report
npm run seo:report
```

---

## 2. Google Cloud & Search Console API Setup

### Step 1: Google Cloud Project
- **Project ID**: `portfolio-509304`
- **APIs to Enable**:
  - **Google Search Console API**
  - **Google Site Verification API**

### Step 2: OAuth 2.0 Scopes
Configure these required scopes in **Google Auth Platform > Data Access**:
- `https://www.googleapis.com/auth/webmasters`
- `https://www.googleapis.com/auth/siteverification`
- `https://www.googleapis.com/auth/userinfo.email`

### Step 3: Authorized Redirect URIs
In **APIs & Services > Credentials** for Client ID `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`:
- **Development**: `http://localhost:3001/api/auth/google/callback`
- **Production**: `https://your-backend-host.vercel.app/api/auth/google/callback`

---

## 3. One-Click SEO Setup & GSC Admin

### Start the Local Admin Console
```bash
npm run dev
```
*(Starts Next.js on port `3000` and SEO Admin Backend on port `3001`)*

1. Navigate to:
   ```text
   http://localhost:3000/admin/seo
   ```
2. Click **[RUN SEO SETUP]** or **[Connect Google Search Console]**.
3. Sign into your Google account and grant permissions.
4. The system automatically:
   - Matches the website URL with your Search Console properties.
   - Verifies property ownership.
   - Submits `https://${SITE_URL}/sitemap.xml` directly to Google.
   - Monitors live indexing status.

Guided step-by-step onboarding is also available at:
```text
http://localhost:3000/admin/setup
```

---

## 4. GitHub Actions Automated Post-Deployment Workflow

The automated workflow `.github/workflows/seo.yml` triggers on every production deployment:
- Validates site availability and HTTP 200 responses.
- Verifies `robots.txt`, `sitemap.xml`, canonical URLs, metadata, and JSON-LD.
- Automatically submits the sitemap to Google Search Console if repository secrets are set.

### Required GitHub Secrets
In **Settings > Secrets and variables > Actions**:
- `GOOGLE_CLIENT_ID`: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET`: Your Google Cloud OAuth client secret
- `GOOGLE_REFRESH_TOKEN`: The refresh token generated during first login (stored in `.gsc-tokens.json`)

---

## 5. Client Reusability & Custom Domain Migration

1. **Update `.env.local`**:
   Set `SITE_URL=https://clientdomain.com`.
2. **Rebuild**:
   `npm run build`
   - Canonical URLs, sitemap, robots.txt, and structured data automatically update.
3. **Connect Google**:
   - Add `https://clientdomain.com` to Search Console.
   - In `/admin/seo`, click **Select Property** to bind the new domain.

---

## 6. Google Search Console Truth & Indexing Policy

- **Sitemap Submitted ≠ Indexed**: Submitting a sitemap prompts Google to discover URLs. Google independently decides when to crawl and index pages.
- **No Faking**: Statuses displayed are strictly derived from live Google Search Console API data:
  - `DEPLOYED`
  - `SITEMAP SUBMITTED`
  - `DISCOVERED`
  - `CRAWLED`
  - `INDEXED`
  - `NOT INDEXED`
  - `UNKNOWN`
- **Priority Indexing**: Google requires priority indexing requests to be submitted through Google Search Console's official URL Inspection interface. Direct deep links are provided in the `/admin/seo` dashboard.
