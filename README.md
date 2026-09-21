# Premium Data-Driven Developer & Analyst Portfolio Template

A modern, high-performance personal portfolio and client-sellable template built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Motion**.

Engineered with a **100% data-driven architecture**, allowing developers, data analysts, AI/ML engineers, and designers to customize their entire portfolio simply by editing structured configuration files without touching component code.

---

## ✨ Features

- **🎯 100% Truthful Resume Data Integration**: Extracted from verified experience, certifications, and quantifiable metrics for Shivam Garg (Data Analyst & AI Builder).
- **⚡ Live Interactive Analytics Sandbox**: Switch between real production scenarios (*COD Risk Segmentation*, *Reporting Automation*, *Latency Optimization*), view dynamic charts, and copy production SQL queries.
- **💎 21st.dev Style UI/UX Pro Max Aesthetic**: Modern dark cinema styling, interactive mouse-following spotlights, glassmorphic borders, and smooth micro-interactions.
- **📊 Measurable Impact Bento**: Highlighting quantifiable results (*10k+ Monthly Orders*, *-15% RTO*, *60+ hrs/mo Saved*, *98% OTD*, *-35% Latency*).
- **🚀 Motion Micro-Animations**: Refined scroll entrances, stagger effects, and smooth navigation active indicators.
- **📱 Ultra-Responsive & Accessible**: Fully optimized for 360px mobile up to 1440px+ ultra-wide desktop displays, respecting `prefers-reduced-motion`.
- **🔍 Complete SEO & Structured Data**: Built-in Schema.org `Person` JSON-LD, OpenGraph tags, dynamic `robots.txt`, and `sitemap.xml`.
- **💼 Sellable White-Label Template**: Includes a full [`CLIENT_CUSTOMIZATION_GUIDE.md`](./CLIENT_CUSTOMIZATION_GUIDE.md) explaining how to rebrand and resell this template to clients.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion successor)
- **Icons**: Lucide React + Custom SVG Brand Icons
- **Fonts**: Inter (Sans) & JetBrains Mono (Code/Metrics)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
d:/d/
├── CLIENT_CUSTOMIZATION_GUIDE.md  # Client resale and customization manual
├── public/                        # Static assets (resume.pdf, icons)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, SEO tags, JSON-LD
│   │   ├── page.tsx               # Main page assembly
│   │   ├── globals.css            # Dark cinema tokens, scrollbars, patterns
│   │   ├── robots.ts              # Dynamic robots.txt
│   │   └── sitemap.ts             # Dynamic sitemap.xml
│   ├── config/
│   │   ├── site.ts                # Site metadata, navigation items, social links
│   │   └── theme.ts               # Theme tokens, accent palettes, switches
│   ├── data/
│   │   └── portfolio.ts           # Central source of truth for all resume data
│   ├── types/
│   │   └── portfolio.ts           # TypeScript interfaces for portfolio data
│   ├── components/
│   │   ├── common/                # Shared headers, theme toggles, brand icons
│   │   ├── ui/                    # BentoCard, Badge, MetricCounter, ShimmerButton
│   │   └── sections/              # Navbar, Hero, Metrics, About, Sandbox,
│   │                              # Experience, Projects, Skills, Education,
│   │                              # Certifications, Contact, Footer
```

---

## 📄 Customization

To adapt this template for another client or profession, see the step-by-step guide in [`CLIENT_CUSTOMIZATION_GUIDE.md`](./CLIENT_CUSTOMIZATION_GUIDE.md).

---

## 🔍 Official Google Search Console API Automation

This portfolio integrates official Google Search Console API automation via OAuth 2.0 (no browser scraping or Playwright required):

```bash
# 1. Verify Google Cloud OAuth & API readiness
npm run google:check

# 2. One-time OAuth authorization (run once locally)
npm run google:auth

# 3. Validate and submit sitemap via official Search Console API
npm run google:sitemap

# 4. View live Search Console indexing and sitemap status
npm run google:status
```

### Pre-submission Validation
Before submitting the sitemap to Google, `npm run google:sitemap` automatically verifies:
1. `https://portfolio-eight-sigma-mzugu1b20s.vercel.app/sitemap.xml` returns **HTTP 200**.
2. Sitemap contains valid XML syntax (`<urlset>...</urlset>`).
3. All `<loc>` elements strictly match the production custom domain.
4. `robots.txt` references the exact production sitemap URL.

### Security Guarantees
- Client Secrets and OAuth refresh tokens are encrypted at rest with AES-256-GCM.
- Refresh tokens and keys are never printed in console logs or bundled into client JavaScript.
- All credential files (`.env*.local`, `.gsc-tokens.json`, `client_secret*.json`) are gitignored.
