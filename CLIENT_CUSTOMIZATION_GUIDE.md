# Client Customization & Resale Guide

This portfolio website is designed as a **production-grade, productized portfolio template**. You can easily customize and sell this template to **software engineers, data analysts, AI/ML developers, business analysts, students, designers, and freelance professionals**.

---

## 1. Architecture Overview (100% Data-Driven)

Unlike standard web templates where personal information is hardcoded across dozens of JSX files, this template is strictly **data-driven and media-driven**:

| File | Purpose | What to Customize |
| :--- | :--- | :--- |
| [`src/data/portfolio.ts`](file:///d:/d/src/data/portfolio.ts) | **Single Source of Truth** | Profile, bio, metrics, work history, projects, skills, education, certifications, and interactive scenarios |
| [`src/config/site.ts`](file:///d:/d/src/config/site.ts) | **SEO & Brand Metadata** | Site name, author, social URLs, navigation menu items, SEO keywords |
| [`src/config/theme.ts`](file:///d:/d/src/config/theme.ts) | **Visual Styling & Themes** | Accent color palette (Blue, Cyan, Emerald, Violet, Amber), border radius, feature toggles |
| [`public/resume.pdf`](file:///d:/d/public/resume.pdf) | **Downloadable CV** | Replace with your client's PDF resume |
| [`public/og-image.png`](file:///d:/d/public/og-image.png) | **Social Share Card** | Replace with client's 1200x630 OpenGraph card |

---

## 2. Quick 5-Minute Client Customization Checklist

### Step 1: Update Personal Profile & Contact
Open [`src/data/portfolio.ts`](file:///d:/d/src/data/portfolio.ts) and modify the `profile` object:
```ts
profile: {
  name: 'Client Name',
  firstName: 'Client',
  lastName: 'Name',
  headline: 'Full Stack Engineer & Cloud Architect',
  titles: ['Senior Software Engineer', 'React & Node.js Specialist', 'AWS Certified'],
  bio: 'Concise 2-3 paragraph professional narrative...',
  shortBio: 'One-line punchy positioning statement.',
  location: 'San Francisco, CA (or Remote)',
  email: 'client@example.com',
  phone: '+1 (555) 000-0000',
  availability: {
    status: 'available', // 'available' | 'busy'
    text: 'Open to full-time roles & consulting',
    locations: ['Remote', 'San Francisco', 'New York'],
  },
  socialLinks: [ ... ],
  resumeUrl: '/resume.pdf',
}
```

### Step 2: Customize Key Quantifiable Metrics
In `keyMetrics` in [`src/data/portfolio.ts`](file:///d:/d/src/data/portfolio.ts), define 4 to 6 quantifiable achievements:
```ts
{
  id: 'users-scaled',
  label: 'Active Users Scaled',
  value: 250000,
  suffix: '+',
  change: '250k MAU',
  changeType: 'accent', // 'positive' | 'neutral' | 'accent'
  context: 'Architected microservices handling high concurrency with 99.99% uptime',
  icon: 'Zap',
}
```

### Step 3: Populate Work Experience
Add, edit, or remove roles in `experiences`:
- `company`: Employer name
- `role`: Title
- `period`: e.g. "2023 – Present"
- `isCurrent`: `true` for present job (adds active status badge)
- `achievements`: Bullet points highlighting impact and technologies
- `metrics`: Quick stat chips shown at the bottom of the card

### Step 4: Add Featured Projects
Add projects to `projects`:
- `category`: e.g. `'AI & GenAI' | 'Business Intelligence' | 'Data Analytics' | 'Full-Stack'`
- `problem` & `solution`: Structured narrative
- `impactMetrics`: Key quantifiable takeaways
- `previewStats`: 3 summary metrics displayed in a grid
- `githubUrl` & `liveUrl`: Links to code and demo

### Step 5: Configure Skills Matrix
Organize technical skills in `skillCategories`:
- Assign levels: `'Advanced' | 'Proficient' | 'Familiar'`
- Add contextual focus tags (e.g. `'Query Optimization'`, `'DAX'`, `'Prompt Engineering'`)

---

## 3. Adapting for Different Client Personas

### Persona A: Software Engineer / Full-Stack Developer
1. Set accent color to **Cyan** or **Violet** in [`src/config/theme.ts`](file:///d:/d/src/config/theme.ts):
   ```ts
   accentColor: 'violet'
   ```
2. In `skillCategories`, configure:
   - Frontend: React, Next.js, TypeScript, Tailwind CSS
   - Backend: Node.js, Go, Python, PostgreSQL, Redis
   - DevOps & Cloud: AWS, Kubernetes, Docker, CI/CD
3. In `sandboxScenarios`, replace SQL queries with API route code or distributed systems benchmarks.

### Persona B: Data Analyst / Business Intelligence Specialist (Current Setup)
1. Set accent color to **Blue** or **Cyan**.
2. Feature Power BI, SQL, DAX, Power Query, Tableau, and automated reporting.
3. Utilize the **Interactive Sandbox** to showcase real SQL queries and optimization stages.

### Persona C: AI / ML Engineer
1. Set accent color to **Emerald** or **Violet**.
2. Feature PyTorch, LangChain, Hugging Face, vector databases, and model training metrics.
3. Highlight model accuracy, latency reductions, and inference scaling.

### Persona D: Product Designer / UX Engineer
1. Disable or adapt the Interactive Sandbox by setting `showSandbox: false` in [`src/config/theme.ts`](file:///d:/d/src/config/theme.ts).
2. Showcase case study links, Figma prototypes, design system tokens, and usability testing metrics.

---

## 4. Theme & Accent Customization

Switch color accents across the entire site by simply changing one word in [`src/config/theme.ts`](file:///d:/d/src/config/theme.ts):
- `'blue'` (Deep Tech & Trust)
- `'cyan'` (Modern Cloud & Futuristic)
- `'emerald'` (Finance & Growth)
- `'violet'` (Creative Engineering & AI)
- `'amber'` (Bold, Confident & Warm)

---

## 5. Deployment Options

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Next.js App Router is detected automatically with zero config required.
4. Click **Deploy**.

### Deploy to Netlify
1. Connect repository in Netlify dashboard.
2. Build command: `npm run build`
3. Publish directory: `.next`
