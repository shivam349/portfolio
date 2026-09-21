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

## 3. Exact Production Callback URLs

Configure the appropriate production HTTPS callback in [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials?project=portfolio-509304):

| Environment | Platform | Exact Callback URL |
| :--- | :--- | :--- |
| **Development** | Local Server | `http://localhost:3001/api/auth/google/callback` |
| **Production** | Vercel Serverless | `https://portfolio-seo-backend.vercel.app/api/auth/google/callback` |
| **Production** | Render Web Service | `https://portfolio-seo-backend.onrender.com/api/auth/google/callback` |
| **Production** | Custom Backend Domain | `https://api.yourdomain.com/api/auth/google/callback` |

*Security Rule: Never use `http://` or `localhost` in production. Google rejects non-HTTPS redirect URIs on production domains.*

---

## 4. Google Auth Platform Configuration

Follow these steps in the [Google Cloud Console](https://console.cloud.google.com/auth/overview?project=portfolio-509304):

### A. Branding
1. Navigate to **Google Auth Platform** > **Branding**.
2. **App name**: `Portfolio SEO Console`
3. **User support email**: Select your verified Google account email.
4. **Application home page**: `https://shivam349.github.io/portfolio`
5. **Authorized domains**:
   - `github.io`
   - `vercel.app` (or your backend domain)
6. **Developer contact information**: Your contact email address.

### B. Audience & Publishing Status
1. Navigate to **Google Auth Platform** > **Audience**.
2. **User Type**: **External**
3. **Publishing Status**:
   - **Testing Mode**: While testing, add your Google account email under **Test Users**.
   - **In Production**: When ready for broad distribution, click **Publish App**.

### C. Data Access (Scopes)
1. Navigate to **Google Auth Platform** > **Data Access**.
2. Add:
   - `https://www.googleapis.com/auth/webmasters`
   - `https://www.googleapis.com/auth/siteverification`
   - `https://www.googleapis.com/auth/userinfo.email`

---

## 5. Free-Tier Backend Deployment Options

### Option 1: Vercel Serverless (Zero Config)
This repository includes `vercel.json` and `api/index.js`.
1. Push to GitHub: `git push origin master`.
2. In [Vercel](https://vercel.com/new), import `shivam349/portfolio`.
3. Set environment variables:
   - `GOOGLE_PROJECT_ID`: `portfolio-509304`
   - `GOOGLE_CLIENT_ID`: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET`: Your secret
   - `GOOGLE_REDIRECT_URI`: `https://portfolio-seo-backend.vercel.app/api/auth/google/callback`
   - `GOOGLE_ENCRYPTION_KEY`: `1d908eb4b5245e086840a23cba2a4fd411461a1445d2803eae7d853aa96c7215`
   - `SITE_URL`: `https://shivam349.github.io/portfolio`
4. Deploy!

### Option 2: Render Free Web Service
This repository includes `render.yaml`.
1. In [Render Dashboard](https://dashboard.render.com/), select **New > Blueprint**.
2. Connect `shivam349/portfolio`.
3. Add the required environment variables.
4. Render automatically provisions the HTTPS service at `https://portfolio-seo-backend.onrender.com`.

---

## 6. Multi-Client & Multi-Website Architecture

One Google OAuth application supports any number of client websites.

### Connection Model (`.gsc-connections.json`)
```json
{
  "connection_id": "c71e80b2-4d1a-4d26-9f44-9645eb488f72",
  "google_account_identifier": "client@gmail.com",
  "encrypted_refresh_token": "<iv>:<auth_tag>:<encrypted_token>",
  "site_url": "https://clientdomain.com",
  "search_console_property": "sc-domain:clientdomain.com",
  "permission_level": "siteOwner",
  "is_verified": true,
  "sitemap_submitted": true,
  "last_submitted": "2026-09-21T05:20:00.000Z",
  "created_at": "2026-09-21T05:20:00.000Z",
  "updated_at": "2026-09-21T05:20:00.000Z"
}
```

- Refresh tokens are encrypted with **AES-256-GCM** using `GOOGLE_ENCRYPTION_KEY`.
- Refresh tokens are **never** exposed to client-side code or API responses.

---

## 7. Official 8-State Classification Reference

Google Search Console statuses are strictly maintained and never faked:

| State | Definition | Official Google Basis |
| :--- | :--- | :--- |
| **`DEPLOYED`** | Public site is live and returns HTTP 200 | Verified via HTTP probe |
| **`VERIFIED`** | Account has verified ownership for the property | Checked via Search Console API (`siteOwner` / `siteFullUser`) |
| **`SITEMAP SUBMITTED`** | `/sitemap.xml` was transmitted to Google | Confirmed via Search Console Sitemaps API (`PUT`) |
| **`DISCOVERED`** | Googlebot detected URLs in the sitemap | Reported by URL Inspection / Search Console |
| **`CRAWLED`** | Googlebot fetched the page; indexing pending | URL Inspection API `coverageState` |
| **`INDEXED`** | Page is actively indexed in Google Search | URL Inspection API verdict `PASS` |
| **`NOT INDEXED`** | Page excluded (noindex, redirect, crawl issue) | URL Inspection API verdict `FAIL` |
| **`UNKNOWN`** | No crawl or inspection data available yet | Default state before Googlebot crawl |
