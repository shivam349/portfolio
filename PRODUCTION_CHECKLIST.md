# Production SEO & Google Search Console Checklist

This checklist guides you through taking your portfolio from local testing to a fully deployed, automated production system.

---

## 1. Google Cloud & OAuth Checklist

- [ ] **Google Cloud Project Verified**: Project ID is `portfolio-509304` in [Google Cloud Console](https://console.cloud.google.com/).
- [ ] **APIs Enabled**:
  - [x] Google Search Console API (Webmasters API)
  - [x] Google Site Verification API
- [ ] **OAuth Scopes Added**:
  - `https://www.googleapis.com/auth/webmasters`
  - `https://www.googleapis.com/auth/siteverification`
  - `https://www.googleapis.com/auth/userinfo.email`
- [ ] **Test Users Added**: Your personal Google account email added under **Google Auth Platform > Audience > Test Users**.
- [ ] **OAuth Client ID**: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`.

---

## 2. Production Callback Configuration Checklist

In Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID:

- [ ] **Development Callback**:
  ```text
  http://localhost:3001/api/auth/google/callback
  ```
- [ ] **Production HTTPS Callback** (Choose your backend platform):
  - **Vercel**:
    ```text
    https://portfolio-seo-backend.vercel.app/api/auth/google/callback
    ```
  - **Render**:
    ```text
    https://portfolio-seo-backend.onrender.com/api/auth/google/callback
    ```
  - **Custom Domain**:
    ```text
    https://api.yourdomain.com/api/auth/google/callback
    ```

*Important: Never use `http://` or `localhost` for production callbacks.*

---

## 3. SEO Backend Deployment Checklist

The public portfolio is statically hosted on GitHub Pages. Deploy the SEO Automation Backend to any free-tier HTTPS host:

### Option A: Deploy to Vercel (Free Serverless Tier)
1. Import repository `shivam349/portfolio` into [Vercel](https://vercel.com/new).
2. Configure Environment Variables in Vercel Project Settings:
   - `GOOGLE_PROJECT_ID`: `portfolio-509304`
   - `GOOGLE_CLIENT_ID`: `1099105959969-si1uu7hdqbl1mv699qe7pfmen5pt2n55.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET`: Your secret
   - `GOOGLE_REDIRECT_URI`: `https://<your-vercel-project>.vercel.app/api/auth/google/callback`
   - `GOOGLE_ENCRYPTION_KEY`: `1d908eb4b5245e086840a23cba2a4fd411461a1445d2803eae7d853aa96c7215`
   - `SITE_URL`: `https://shivam349.github.io/portfolio`
3. Click **Deploy**. Vercel routes `/api/*` requests through `vercel.json` to `api/index.js`.

### Option B: Deploy to Render (Free Web Service Tier)
1. In [Render Dashboard](https://dashboard.render.com/), click **New** > **Blueprint**.
2. Connect `shivam349/portfolio`. Render automatically detects `render.yaml`.
3. Add the environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, etc.).
4. Click **Apply**. Render assigns a permanent HTTPS domain (`https://portfolio-seo-backend.onrender.com`).

---

## 4. Environment Variables Checklist

### Backend Environment Variables (Server-side Only)
| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `SITE_URL` | `https://shivam349.github.io/portfolio` | Production URL of client portfolio |
| `GOOGLE_PROJECT_ID` | `portfolio-509304` | Google Cloud project |
| `GOOGLE_CLIENT_ID` | `1099105959969-...apps.googleusercontent.com` | OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `[SECRET]` | OAuth client secret |
| `GOOGLE_REDIRECT_URI` | `https://<backend-domain>/api/auth/google/callback` | Production callback |
| `GOOGLE_ENCRYPTION_KEY` | `1d908eb4...` | 32-byte AES key for token encryption |
| `NEXT_PUBLIC_SEO_BACKEND_URL` | `https://<backend-domain>` | Backend endpoint |

### GitHub Secrets for CI/CD Workflow (`.github/workflows/seo.yml`)
In GitHub Repository **Settings > Secrets and variables > Actions**:
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REFRESH_TOKEN`

---

## 5. First Connection & Sitemap Submission Checklist

1. [ ] Deploy the static portfolio (`git push origin master`).
2. [ ] Open the SEO Dashboard at `https://shivam349.github.io/portfolio/admin/seo` (or `http://localhost:3000/admin/seo`).
3. [ ] Click **[RUN SEO SETUP]** or **[Connect Google]**.
4. [ ] Sign in with your Google account and grant Search Console access.
5. [ ] Search Console property is automatically matched against `SITE_URL`.
6. [ ] Ownership is verified.
7. [ ] `${SITE_URL}/sitemap.xml` is automatically submitted via the official Search Console API.
8. [ ] Live indexing status is monitored.

---

## 6. Client Reusability Checklist (Selling to New Clients)

For each new client portfolio, only modify these 6 parameters in `.env.local`:
```env
SITE_URL=https://clientdomain.com
SITE_NAME=Client Name Portfolio
OWNER_NAME=Client Name
OWNER_ROLE=Client Profession
DESCRIPTION=Professional portfolio of Client Name
OG_IMAGE=https://clientdomain.com/og-image.png
```

Everything else (canonical URLs, sitemaps, robots.txt, structured data, Google property matching, and token encryption) adapts automatically.
