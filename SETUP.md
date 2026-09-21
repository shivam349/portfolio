# Production-Grade Automated SEO & Google Search Console Setup Guide

This guide provides step-by-step instructions for deploying, customizing, and automating the SEO & Google Search Console (GSC) integration for this portfolio.

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

Edit `.env.local` to match your production domain and details:
```env
SITE_URL=https://shivam349.github.io/portfolio
SITE_NAME=Shivam - AI & Full Stack Portfolio
OWNER_NAME=Shivam
OWNER_ROLE=Full Stack & Three.js Engineer
DESCRIPTION=Portfolio of Shivam - Software Engineer specializing in 3D Web, React, and Full Stack Architecture.
OG_IMAGE=https://shivam349.github.io/portfolio/og-image.png
```

### 3. Validate Local SEO
Run the automated test suite:
```bash
# Build SEO assets (sitemap.xml, robots.txt)
npm run seo:build

# Validate technical SEO integrity
npm run seo:check

# Generate comprehensive SEO report
npm run seo:report
```

---

## 2. Google Cloud & Search Console API Setup

To enable automated sitemap submission and indexing status inspection, configure an official Google Cloud OAuth application:

### Step 1: Create a Google Cloud Project
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** > **New Project**.
3. Name your project (e.g. `Portfolio-SEO-Automation`) and click **Create**.

### Step 2: Enable Google Search Console API
1. In Google Cloud Console, navigate to **APIs & Services** > **Library**.
2. Search for **Google Search Console API** (Webmasters API).
3. Click **Enable**.

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**.
2. Select User Type: **External** > Click **Create**.
3. Fill in:
   - **App name**: `Portfolio SEO Console`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**.
5. In **Scopes**, click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/webmasters.readonly`
   - `https://www.googleapis.com/auth/webmasters`
6. Under **Test Users**, add your personal Google account email (required while app is in Testing mode).
7. Save and finish.

### Step 4: Create OAuth 2.0 Client Credentials
1. Go to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Select Application type: **Web application**.
4. Set Name: `Portfolio SEO Admin`.
5. Under **Authorized redirect URIs**, add:
   ```text
   http://localhost:3001/api/auth/google/callback
   ```
6. Click **Create**.
7. Copy your **Client ID** and **Client Secret**.

### Step 5: Save Credentials Locally
Add the credentials to your local `.env.local`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

---

## 3. One-Click SEO Setup & GSC Admin

### Start the Local Admin Console
```bash
npm run dev
```
*(This starts both the Next.js dev server on port `3000` and the SEO Admin API on port `3001`)*

1. Open your browser and navigate to:
   ```text
   http://localhost:3000/admin/seo
   ```
2. Click **[RUN SEO SETUP]** or **[Connect Google Search Console]**.
3. Sign into your Google account and approve permissions.
4. Google redirects back to the dashboard:
   - Your Search Console property is automatically detected.
   - Property ownership verification is checked.
   - `/sitemap.xml` is automatically submitted to Google!
   - Indexing status is monitored.

Alternatively, use the guided onboarding wizard at:
```text
http://localhost:3000/admin/setup
```

---

## 4. GitHub Actions Automated Post-Deployment Workflow

This repository includes `.github/workflows/seo.yml` which triggers automatically after every production deployment.

### Required GitHub Secrets
To allow GitHub Actions to submit your sitemap to Google automatically after deployment, add these secrets to your repository:
1. Go to **GitHub Repository** > **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `GOOGLE_REFRESH_TOKEN`: The refresh token generated during your first OAuth login (found in `.gsc-tokens.json`)

*Note: If GitHub Secrets are not configured, technical SEO validation (robots.txt, sitemap.xml, canonical URLs, HTTP 200 checks) will still run and PASS, and deployment will succeed.*

---

## 5. Client Reusability & Custom Domain Migration

When reusing this template for a client or migrating from GitHub Pages to a custom domain:

1. **Update `.env.local`**:
   Change `SITE_URL=https://shivam349.github.io/portfolio` to `SITE_URL=https://clientdomain.com`.
2. **Rebuild**:
   `npm run build`
   - Canonical URLs are automatically updated.
   - `public/sitemap.xml` and `public/robots.txt` automatically update with the new domain.
   - JSON-LD and OpenGraph URLs automatically adjust.
3. **Google Search Console**:
   - Add `https://clientdomain.com` in Google Search Console.
   - Open `/admin/seo` and click **Select Property** to switch to the new domain.

---

## 6. Google Search Console Truth & Indexing Policy

- **Sitemap Submitted ≠ Indexed**: Submitting a sitemap prompts Google to discover URLs. Google independently decides when to crawl and index pages.
- **No Faking**: Statuses displayed are strictly derived from live Google Search Console API data:
  - `DEPLOYED`
  - `DISCOVERED`
  - `CRAWLED`
  - `INDEXED`
  - `NOT INDEXED`
  - `UNKNOWN`
- **Request Indexing**: Google requires priority indexing requests to be submitted through Google Search Console's official URL Inspection UI. Direct deep links are provided in the `/admin/seo` dashboard.
