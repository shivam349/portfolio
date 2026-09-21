# Google Search Console Production & Cloud OAuth Guide

This document outlines the official Google Cloud configuration, production architecture, and security policies for the portfolio's automated SEO and Google Search Console integration.

---

## 1. Google Cloud Project Overview

- **Project ID**: `portfolio-509304`
- **OAuth Client ID**: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`
- **OAuth Auth URI**: `https://accounts.google.com/o/oauth2/auth`
- **OAuth Token URI**: `https://oauth2.googleapis.com/token`
- **Supported Scopes**:
  - `https://www.googleapis.com/auth/webmasters` (Google Search Console API)
  - `https://www.googleapis.com/auth/siteverification` (Google Site Verification API)
  - `https://www.googleapis.com/auth/userinfo.email` (Account identification)

---

## 2. Production Architecture: Frontend vs. Backend Separation

GitHub Pages is a static hosting platform. It cannot execute server-side Node.js code, receive OAuth callback requests, or securely store encrypted Google refresh tokens.

To maintain strict security:
```
┌────────────────────────────────────────────────────────┐
│ PUBLIC PORTFOLIO (GitHub Pages Static Hosting)         │
│ - URL: https://shivam349.github.io/portfolio           │
│ - Static HTML, CSS, Three.js canvas                    │
│ - Injected Canonical tags, JSON-LD, sitemap.xml        │
│ - Zero Google secrets or refresh tokens exposed        │
└──────────────────────────┬─────────────────────────────┘
                           │ API Requests via NEXT_PUBLIC_SEO_BACKEND_URL
                           ▼
┌────────────────────────────────────────────────────────┐
│ SEO AUTOMATION BACKEND (Server / Serverless Platform)  │
│ - Local: http://localhost:3001 (scripts/seo-server.mjs)│
│ - Production: Vercel / Cloud Run / Render HTTPS URL   │
│ - Handles Google OAuth 2.0 callback                    │
│ - Stores AES-256-GCM encrypted refresh tokens          │
│ - Executes Google Search Console API & Sitemap PUT     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Google Auth Platform Configuration

Follow these steps in the [Google Cloud Console](https://console.cloud.google.com/auth/overview?project=portfolio-509304):

### A. Branding
1. Navigate to **Google Auth Platform** > **Branding**.
2. **App name**: `Portfolio SEO Console`
3. **User support email**: Select your verified Google account email.
4. **App logo**: Optional (120x120px square image).
5. **Application home page**: `https://shivam349.github.io/portfolio`
6. **Authorized domains**:
   - `github.io`
   - (Add custom domain if applicable, e.g. `yourdomain.com`)
7. **Developer contact information**: Your contact email address.

### B. Audience & Publishing Status
1. Navigate to **Google Auth Platform** > **Audience**.
2. **User Type**: **External**
3. **Publishing Status**:
   - **Testing Mode**: While testing, you must add your Google email address under **Test Users**. Only added test users can authorize the application.
   - **In Production**: When ready for clients, click **Publish App**. Because the app requests sensitive Search Console scopes, Google may request verification if used by external non-test accounts. For client portfolios you manage directly, adding client emails as test users allows immediate authorization without waiting for Google verification.

### C. Data Access (Scopes)
1. Navigate to **Google Auth Platform** > **Data Access**.
2. Click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/webmasters`
   - `https://www.googleapis.com/auth/siteverification`
   - `https://www.googleapis.com/auth/userinfo.email`
3. Click **Update** and **Save**.

### D. OAuth Client ID & Redirect URIs
1. Navigate to **APIs & Services** > **Credentials**.
2. Open OAuth 2.0 Client ID: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`.
3. Under **Authorized redirect URIs**, configure:
   - **Development**:
     ```text
     http://localhost:3001/api/auth/google/callback
     ```
   - **Production Backend**:
     ```text
     https://your-backend-host.vercel.app/api/auth/google/callback
     ```
   *(Note: Never configure `http://` for production. Google requires HTTPS for production redirect URIs)*

---

## 4. Multi-Client & Multi-Website Architecture

You do **not** need a separate Google Cloud project or OAuth client for every client website. A single OAuth client supports unlimited websites.

### Secure Connection Model
Each authorized client website is stored securely in `.gsc-connections.json`:
```json
{
  "connection_id": "uuid-v4",
  "google_account_identifier": "client@gmail.com",
  "encrypted_refresh_token": "<iv>:<auth_tag>:<encrypted_token>",
  "site_url": "https://clientdomain.com",
  "search_console_property": "sc-domain:clientdomain.com",
  "permission_level": "siteOwner",
  "is_verified": true,
  "sitemap_submitted": true,
  "last_submitted": "2026-09-21T05:00:00.000Z",
  "created_at": "2026-09-21T05:00:00.000Z",
  "updated_at": "2026-09-21T05:00:00.000Z"
}
```

- Refresh tokens are encrypted using **AES-256-GCM** with a 32-byte key (`GOOGLE_ENCRYPTION_KEY`).
- Refresh tokens are **never** exposed over API responses or client-side JavaScript.

---

## 5. Environment Variables & Secrets Reference

### Local Development (`.env.local`)
```env
SITE_URL=https://shivam349.github.io/portfolio
GOOGLE_PROJECT_ID=portfolio-509304
GOOGLE_CLIENT_ID=1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
GOOGLE_ENCRYPTION_KEY=1d908eb4b5245e086840a23cba2a4fd411461a1445d2803eae7d853aa96c7215
NEXT_PUBLIC_SEO_BACKEND_URL=http://localhost:3001
```

### GitHub Actions Secrets (for automated CI/CD sitemap submission)
In **Repository Settings** > **Secrets and variables** > **Actions**:
- `GOOGLE_CLIENT_ID`: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET`: Your Google Cloud client secret
- `GOOGLE_REFRESH_TOKEN`: The refresh token generated during first login

---

## 6. Verification and Health Check Commands

```bash
# 1. Check Google Cloud & production configuration
npm run google:check

# 2. Check technical SEO compliance (robots.txt, sitemap, canonical, metadata)
npm run seo:check

# 3. Output comprehensive SEO and Indexing report
npm run seo:report

# 4. Start local development runner (Next.js :3000 + SEO server :3001)
npm run dev
```
