import { PortfolioData } from '@/types/portfolio';

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Shivam Garg',
    firstName: 'Shivam',
    lastName: 'Garg',
    headline: 'Data Analyst & Business Intelligence Specialist',
    titles: [
      'Data Analyst',
      'Business Intelligence Specialist',
      'SQL & Power BI Developer',
      'AI & Machine Learning Builder',
    ],
    bio: 'Data Analyst with 2+ years of experience turning raw business data into actionable decisions using SQL, Power BI, Power Query, and Python. I build dashboards and reporting systems that logistics and e-commerce teams actually rely on, and automate manual reporting pipelines that previously consumed analyst hours. In addition, I build lightweight GenAI applications (LangChain, Streamlit) to make complex data querying intuitive for non-technical stakeholders.',
    shortBio: 'Turning complex datasets into operational clarity and automated business intelligence.',
    location: 'Greater Bengaluru Area, India',
    email: 'shivamgarg1515@gmail.com',
    phone: '+91 8696450535',
    availability: {
      status: 'available',
      text: 'Open to full-time opportunities',
      locations: ['Bengaluru', 'Remote', 'Hybrid'],
    },
    socialLinks: [
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/shivam-garg-21b25a1b4',
        iconName: 'Linkedin',
        displayValue: 'in/shivam-garg-21b25a1b4',
      },
      {
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/shivamgarg1515',
        iconName: 'Github',
        displayValue: 'github.com/shivamgarg1515',
      },
      {
        platform: 'email',
        label: 'Email',
        url: 'mailto:shivamgarg1515@gmail.com',
        iconName: 'Mail',
        displayValue: 'shivamgarg1515@gmail.com',
      },
      {
        platform: 'phone',
        label: 'Phone',
        url: 'tel:+918696450535',
        iconName: 'Phone',
        displayValue: '+91 8696450535',
      },
    ],
    resumeUrl: '/resume.pdf',
  },

  keyMetrics: [
    {
      id: 'orders-analyzed',
      label: 'Monthly Orders Analyzed',
      value: 10000,
      suffix: '+',
      change: '10,000+ orders',
      changeType: 'accent',
      context: 'Logistics and payment datasets processed with optimized SQL queries',
      icon: 'PackageCheck',
    },
    {
      id: 'rto-reduction',
      label: 'RTO Rate Reduction',
      value: 15,
      suffix: '%',
      prefix: '-',
      change: '-15% RTO',
      changeType: 'positive',
      context: 'Achieved via high-risk COD customer segmentation & behavior modeling',
      icon: 'TrendingDown',
    },
    {
      id: 'reporting-saved',
      label: 'Manual Reporting Saved',
      value: 60,
      suffix: '+ hrs/mo',
      change: '3 hrs/day saved',
      changeType: 'positive',
      context: 'Automated recurring Excel & Power Query reporting workflows',
      icon: 'Clock',
    },
    {
      id: 'otd-rate',
      label: 'On-Time Delivery Rate',
      value: 98,
      suffix: '%',
      change: '98% OTD',
      changeType: 'accent',
      context: 'Seller performance and shipping SLA compliance sustained',
      icon: 'ShieldCheck',
    },
    {
      id: 'latency-reduction',
      label: 'Response Latency Reduced',
      value: 35,
      suffix: '%',
      prefix: '-',
      change: '-35% latency',
      changeType: 'positive',
      context: 'Identified via backend workflow & database query evaluation',
      icon: 'Zap',
    },
    {
      id: 'dsa-problems',
      label: 'DSA & SQL Problems Solved',
      value: 1050,
      suffix: '+',
      change: '750+ LC / 300+ GFG',
      changeType: 'accent',
      context: 'Algorithmic problem solving across LeetCode and GeeksforGeeks',
      icon: 'Code2',
    },
  ],

  experiences: [
    {
      id: 'nxtree-technologies',
      role: 'Business Analyst / Data Analyst',
      company: 'NxTree Technologies',
      location: 'Bengaluru, India',
      period: 'January 2025 – Present',
      duration: '1 yr 9 mos',
      type: 'Full-time',
      isCurrent: true,
      description:
        'Overseeing business intelligence and analytics for logistics, e-commerce, and payment operations. Driving automation and data modeling for executive stakeholders.',
      achievements: [
        'Analyzed logistics and payment datasets for 10,000+ monthly orders using SQL and business reporting tools, reducing Return-to-Origin (RTO) rates by 15% through high-risk COD customer segmentation.',
        'Built automated Excel and Power Query reporting workflows for sales, returns, inventory, and operational KPIs, saving 3 hours/day (60+ hours/month) of manual effort.',
        'Collaborated with operations and business stakeholders to monitor seller performance and shipping metrics, maintaining a 98% On-Time Delivery (OTD) rate and SLA compliance.',
        'Developed interactive Power BI dashboards tracking AOV, customer trends, return behavior, and profitability metrics to support executive decision-making.',
        'Wrote and optimized SQL queries against production databases to support ad hoc business analysis requests and KPI monitoring.',
      ],
      metrics: [
        { label: 'Monthly Orders', value: '10,000+' },
        { label: 'RTO Drop', value: '-15%' },
        { label: 'Time Saved', value: '60+ hrs/mo' },
        { label: 'OTD Rate', value: '98%' },
      ],
      technologies: ['SQL', 'Power BI', 'Excel', 'Power Query', 'DAX', 'Pivot Tables', 'Dashboarding'],
    },
    {
      id: 'deloitte-simulation',
      role: 'Data Analytics Job Simulation',
      company: 'Deloitte Australia (via Forage)',
      location: 'Remote',
      period: 'September 2026',
      duration: '1 month',
      type: 'Simulation',
      isCurrent: false,
      description:
        "Completed Deloitte Australia's virtual experience program tackling realistic enterprise data analytics and forensic technology scenarios.",
      achievements: [
        'Analyzed business operational data using Excel to classify anomalies, identify patterns, and draw strategic conclusions.',
        'Built an interactive Tableau dashboard to analyze factory downtime, uncover root causes, and support operational insights.',
        'Applied structured data modeling and visualization techniques to present executive-ready findings.',
        'Worked through realistic Deloitte-style analytics and forensic audit technology cases.',
      ],
      metrics: [
        { label: 'Platform', value: 'Tableau + Excel' },
        { label: 'Domain', value: 'Forensic Tech' },
        { label: 'Deliverable', value: 'Factory Downtime Viz' },
      ],
      technologies: ['Tableau', 'Excel', 'Data Modeling', 'Forensic Analytics', 'Root Cause Analysis'],
    },
    {
      id: 'freelance-handshake',
      role: 'AI & Machine Learning Developer',
      company: 'Freelance / Handshake (Remote Projects)',
      location: 'Remote',
      period: 'January 2026 – September 2026',
      duration: '9 months',
      type: 'Freelance',
      isCurrent: false,
      description:
        'Delivered remote cross-functional technical solutions spanning automated data annotation pipelines, LLM interfaces, and containerized analytics deployments.',
      achievements: [
        'Designed and implemented advanced machine learning workflows utilizing Snorkel for programmatic data labeling, significantly accelerating training dataset creation without manual annotation.',
        'Spearheaded "Project Dynamo," an end-to-end data processing and model optimization initiative using Python to streamline analytics pipelines and improve model accuracy.',
        'Containerized AI applications and data architectures using Docker, ensuring seamless and scalable deployments across diverse environments.',
        'Built and deployed full-stack data applications, integrating LLMs via LangChain and creating interactive web interfaces with Streamlit to make complex querying intuitive.',
        'Ensured robust version control, clean modular architecture, and reliable web infrastructure from development to deployment.',
      ],
      metrics: [
        { label: 'Workflow', value: 'Snorkel Labeling' },
        { label: 'Packaging', value: 'Docker' },
        { label: 'GenAI', value: 'LangChain + Streamlit' },
      ],
      technologies: ['Python', 'Snorkel', 'LangChain', 'Streamlit', 'Docker', 'Machine Learning', 'Git'],
    },
    {
      id: 'mithila-organix',
      role: 'Business Analyst Intern',
      company: 'Mithila Organix',
      location: 'India',
      period: 'June 2024 – December 2024',
      duration: '7 months',
      type: 'Internship',
      isCurrent: false,
      description:
        'Supported e-commerce platform growth through deep customer behavior analysis, database performance audits, and Agile feature delivery.',
      achievements: [
        'Supported e-commerce platform development by analyzing customer behavior, product performance, and business requirements to improve product features.',
        'Evaluated backend workflows and database performance, identifying optimization opportunities that reduced response latency by 35%.',
        'Collaborated with cross-functional Agile teams on requirements gathering, task prioritization, and release support, contributing to zero-regression releases.',
        'Contributed to operational process improvements through workflow analysis and scalable system design recommendations.',
      ],
      metrics: [
        { label: 'Latency Cut', value: '-35%' },
        { label: 'Release Quality', value: 'Zero Regression' },
        { label: 'Methodology', value: 'Agile / Scrum' },
      ],
      technologies: ['SQL', 'Database Tuning', 'Agile', 'Requirements Analysis', 'Process Mapping'],
    },
  ],

  projects: [
    {
      id: 'trendforge-ai',
      title: 'TrendForge AI – Multi-Agent Content Automation',
      tagline: 'Autonomous multi-agent research & publishing pipeline with live monitoring',
      category: 'AI & GenAI',
      description:
        'An end-to-end multi-agent AI system that automates content research, synthesis, SEO optimization, and publishing workflows using GPT-4 and LangChain.',
      problem:
        'Manual research, SEO optimization, and editorial workflows required hours of repetitive work per article with inconsistent ranking results.',
      solution:
        'Architected a multi-agent orchestration layer with FastAPI and LangChain where specialized agents perform topic discovery, SEO analysis, factual validation, and automated publishing.',
      impactMetrics: [
        '3x faster SEO content generation speed',
        '50% boost in overall publishing efficiency',
        'Integrated 7+ third-party APIs with real-time performance analytics dashboards',
      ],
      technologies: ['FastAPI', 'React', 'MongoDB', 'LangChain', 'GPT-4', 'REST APIs'],
      githubUrl: 'https://github.com/shivamgarg1515',
      liveUrl: 'https://trendforge-demo.example.com',
      featured: true,
      mediaType: 'interactive',
      previewStats: [
        { label: 'Speed Multiplier', value: '3x Faster' },
        { label: 'Efficiency Gain', value: '+50%' },
        { label: 'APIs Integrated', value: '7+' },
      ],
    },
    {
      id: 'project-dynamo',
      title: 'Project Dynamo – Programmatic Data Labeling & Pipeline Optimization',
      tagline: 'Automated training dataset generation & containerized model deployment',
      category: 'AI & GenAI',
      description:
        'An end-to-end data processing initiative leveraging Snorkel for weak supervision and programmatic data labeling, packaged inside Docker for rapid ML deployments.',
      problem:
        'Creating high-quality supervised training datasets was bottlenecked by slow and costly manual human annotation.',
      solution:
        'Implemented programmatic labeling functions via Snorkel, coupled with Dockerized Python analytics pipelines and an interactive Streamlit UI for data inspection.',
      impactMetrics: [
        'Eliminated manual annotation bottlenecks for ML datasets',
        'Streamlined complex analytics pipelines with automated validation',
        'Standardized reproducible Docker container deployments',
      ],
      technologies: ['Python', 'Snorkel', 'Docker', 'Streamlit', 'Machine Learning', 'Pandas'],
      githubUrl: 'https://github.com/shivamgarg1515',
      featured: true,
      mediaType: 'workflow',
      previewStats: [
        { label: 'Labeling Method', value: 'Weak Supervision' },
        { label: 'Runtime Environment', value: 'Docker' },
        { label: 'Query Interface', value: 'Streamlit UI' },
      ],
    },
    {
      id: 'logistics-cod-analytics',
      title: 'Logistics Intelligence & COD Risk Analytics Dashboard',
      tagline: 'High-risk customer segmentation & return-to-origin minimization',
      category: 'Business Intelligence',
      description:
        'A production Power BI reporting suite tracking 10,000+ monthly logistics and e-commerce orders to mitigate Cash-on-Delivery (COD) default risks and improve seller SLA.',
      problem:
        'High Return-to-Origin (RTO) rates on COD orders were creating logistical friction, inventory lockup, and shipping losses.',
      solution:
        'Formulated SQL data transformation models and Power Query pipelines to segment high-risk pin codes and customer cohorts, visualizing AOV, return propensity, and OTD compliance.',
      impactMetrics: [
        '15% reduction in Return-to-Origin (RTO) rates',
        'Maintained 98% On-Time Delivery (OTD) rate and SLA compliance',
        'Saved 60+ hours/month of analyst reporting effort',
      ],
      technologies: ['Power BI', 'SQL', 'Power Query', 'DAX', 'Excel Pivot Tables'],
      featured: true,
      mediaType: 'dashboard',
      previewStats: [
        { label: 'RTO Drop', value: '-15%' },
        { label: 'OTD SLA', value: '98%' },
        { label: 'Monthly Orders', value: '10K+' },
      ],
    },
    {
      id: 'factory-downtime-forensics',
      title: 'Factory Downtime & Forensic Technology Analytics',
      tagline: 'Interactive operational insights for industrial maintenance & loss prevention',
      category: 'Data Analytics',
      description:
        'Deloitte Australia simulation case study analyzing manufacturing downtime logs, machine failure patterns, and forensic anomaly detection.',
      problem:
        'Unplanned machinery downtime was eroding production margins without clear root-cause visibility across shift intervals.',
      solution:
        'Engineered an interactive Tableau dashboard classifying incident categories, correlating maintenance logs with shift rosters, and highlighting high-frequency breakdown factors.',
      impactMetrics: [
        'Synthesized complex operational telemetry into actionable supervisor dashboards',
        'Pinpointed top machinery bottleneck contributors',
        'Delivered executive-ready risk classification reports',
      ],
      technologies: ['Tableau', 'Excel', 'Data Classification', 'Forensic Tech', 'Root Cause Analysis'],
      featured: false,
      mediaType: 'dashboard',
      previewStats: [
        { label: 'Domain', value: 'Industrial Ops' },
        { label: 'Tooling', value: 'Tableau BI' },
        { label: 'Case Study', value: 'Deloitte AU' },
      ],
    },
  ],

  skillCategories: [
    {
      id: 'bi-analytics',
      title: 'Business Intelligence & Reporting',
      description: 'Translating complex operational data into executive dashboards and automated workflows',
      icon: 'BarChart3',
      skills: [
        { name: 'Microsoft Power BI', level: 'Advanced', tag: 'Dashboards & DAX' },
        { name: 'SQL Query Writing', level: 'Advanced', tag: 'Production Databases' },
        { name: 'Power Query', level: 'Advanced', tag: 'Data Modeling & ETL' },
        { name: 'Advanced Excel', level: 'Advanced', tag: 'Pivot Tables, VLOOKUP' },
        { name: 'Tableau', level: 'Proficient', tag: 'Visual Analytics' },
        { name: 'Business Analysis', level: 'Advanced', tag: 'KPIs & SLA Tracking' },
        { name: 'Forensic Analytics', level: 'Proficient', tag: 'Anomaly Detection' },
      ],
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Building GenAI workflows, programmatic data labeling, and modern LLM interfaces',
      icon: 'BrainCircuit',
      skills: [
        { name: 'Python', level: 'Advanced', tag: 'Data & Automation' },
        { name: 'LangChain', level: 'Proficient', tag: 'Multi-Agent Systems' },
        { name: 'GPT-4 / LLMs', level: 'Proficient', tag: 'Prompt Engineering' },
        { name: 'Snorkel', level: 'Proficient', tag: 'Programmatic Labeling' },
        { name: 'Hugging Face', level: 'Familiar', tag: 'Model Evaluation' },
        { name: 'Streamlit', level: 'Proficient', tag: 'Interactive AI UIs' },
      ],
    },
    {
      id: 'languages-databases',
      title: 'Languages & Databases',
      description: 'Core programming languages, database management systems, and algorithms',
      icon: 'Database',
      skills: [
        { name: 'SQL', level: 'Advanced', tag: 'Query Optimization' },
        { name: 'Python', level: 'Advanced', tag: 'Pandas & Scripting' },
        { name: 'C++', level: 'Proficient', tag: 'Data Structures & Algorithms' },
        { name: 'MySQL', level: 'Advanced', tag: 'Relational DB' },
        { name: 'MongoDB', level: 'Proficient', tag: 'Document DB' },
        { name: 'REST APIs', level: 'Proficient', tag: 'System Integration' },
      ],
    },
    {
      id: 'frameworks-tools',
      title: 'Tools, Cloud & Engineering',
      description: 'Modern development frameworks, cloud infrastructure, and version control',
      icon: 'Cpu',
      skills: [
        { name: 'React.js', level: 'Proficient', tag: 'UI Frontend' },
        { name: 'Node.js / Express', level: 'Proficient', tag: 'Backend Services' },
        { name: 'FastAPI', level: 'Proficient', tag: 'Python Microservices' },
        { name: 'Docker', level: 'Proficient', tag: 'Containerization' },
        { name: 'AWS', level: 'Familiar', tag: 'Cloud Deployments' },
        { name: 'Git & GitHub', level: 'Advanced', tag: 'Version Control' },
        { name: 'CI/CD Pipelines', level: 'Proficient', tag: 'Agile Delivery' },
      ],
    },
  ],

  education: [
    {
      id: 'bit-mesra',
      institution: 'Birla Institute of Technology, Mesra',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Electrical and Electronics Engineering',
      period: 'June 2020 – May 2024',
      grade: 'GPA: 7.66 / 10.0',
      location: 'Ranchi, India',
      highlights: [
        'Comprehensive analytical engineering training with emphasis on computational logic, signals, and systems.',
        'Active IEEE Student Member at BIT Mesra chapter.',
        'Built foundation in Data Structures, Algorithms, and Object-Oriented Programming.',
      ],
    },
    {
      id: 'mgss-school',
      institution: 'Mahatma Gandhi Sikshan Sansthan',
      degree: 'Higher Secondary Education (12th CBSE)',
      field: 'Science & Mathematics',
      period: '2019 – 2020',
      grade: 'CBSE Board',
      location: 'India',
      highlights: ['Mathematics, Physics, Chemistry focus.'],
    },
    {
      id: 'dav-school',
      institution: 'DAV Public School',
      degree: 'Secondary School Examination (10th CBSE)',
      field: 'Physical Sciences',
      period: '2018 – 2019',
      grade: 'CBSE Board',
      location: 'India',
      highlights: ['Strong foundation in STEM disciplines.'],
    },
  ],

  certifications: [
    {
      id: 'deloitte-cert',
      name: 'Deloitte Australia - Data Analytics Job Simulation',
      issuer: 'Deloitte / Forage',
      date: 'September 2026',
      credentialUrl: 'https://www.theforage.com',
      category: 'Simulation',
      skillsVerified: ['Forensic Technology', 'Tableau Visualization', 'Excel Modeling', 'Anomaly Classification'],
    },
    {
      id: 'google-data-cert',
      name: 'Foundations: Data, Data, Everywhere',
      issuer: 'Google Career Certificates',
      date: 'Professional Certificate',
      credentialUrl: 'https://coursera.org',
      category: 'Cloud & Data',
      skillsVerified: ['Data Ecosystem', 'Data Analysis Process', 'SQL Foundations', 'Data Integrity'],
    },
    {
      id: 'pgdca-cert',
      name: 'Post Graduate Diploma in Computer Applications (PGDCA)',
      issuer: 'Accredited Academic Institution',
      date: 'Professional Diploma',
      category: 'Professional',
      skillsVerified: ['Database Systems', 'Software Engineering', 'System Architecture', 'Application Development'],
    },
    {
      id: 'udemy-cpp',
      name: 'Udemy C++ Programming Language Masterclass',
      issuer: 'Udemy',
      date: 'Verified Certificate',
      category: 'Programming',
      skillsVerified: ['C++ Syntax', 'Memory Management', 'Object-Oriented Design', 'Standard Template Library (STL)'],
    },
    {
      id: 'udemy-dsa',
      name: 'Udemy Data Structures & Algorithms',
      issuer: 'Udemy',
      date: 'Verified Certificate',
      category: 'Programming',
      skillsVerified: ['Trees & Graphs', 'Dynamic Programming', 'Searching & Sorting', 'Complexity Analysis'],
    },
  ],

  achievements: [
    {
      id: 'leetcode-gfg',
      title: 'Algorithmic Problem Solving Mastery',
      metric: '1,050+ Solved',
      description: 'Solved 750+ LeetCode problems and 300+ GeeksforGeeks problems covering advanced DSA, graph theory, dynamic programming, and high-performance SQL.',
      tag: 'Algorithms & SQL',
      icon: 'Award',
    },
    {
      id: 'ieee-member',
      title: 'IEEE Student Member',
      metric: 'BIT Mesra Chapter',
      description: 'Active member participating in engineering technical workshops, collaborative coding initiatives, and student technical chapters.',
      tag: 'Engineering Leadership',
      icon: 'GraduationCap',
    },
    {
      id: 'appreciations',
      title: 'Value & Technical Education Honors',
      metric: 'Certificates of Appreciation',
      description: 'Awarded certificates of completion and appreciation in Technical, Entrepreneurial, and Value Education Programs.',
      tag: 'Academic & Professional',
      icon: 'CheckCircle',
    },
  ],

  sandboxScenarios: [
    {
      id: 'cod-risk',
      title: 'COD Risk & RTO Customer Segmentation',
      subtitle: 'NxTree Technologies logistics intelligence model',
      businessContext:
        'Evaluated 10,000+ monthly orders to predict high-risk Return-to-Origin parcels before dispatch, resulting in a direct 15% reduction in logistics shipping losses.',
      kpis: [
        { label: 'RTO Drop', value: '-15%', trend: 'Reduced return costs' },
        { label: 'Sample Volume', value: '10,000+', trend: 'Orders / Month' },
        { label: 'OTD SLA', value: '98%', trend: 'Sustained delivery' },
      ],
      chartType: 'bar',
      chartData: [
        { name: 'Pre-Model RTO', value: 26.8, benchmark: 25.0 },
        { name: 'COD Pin Filter', value: 21.4, benchmark: 20.0 },
        { name: 'Buyer History Gate', value: 17.1, benchmark: 18.0 },
        { name: 'Post-Optimization', value: 11.8, benchmark: 12.0 },
      ],
      codeSnippet: {
        language: 'sql',
        title: 'High-Risk Customer Segmentation (SQL Query)',
        code: `SELECT 
    c.customer_id,
    c.delivery_pincode,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(CASE WHEN o.order_status = 'RTO' THEN 1 ELSE 0 END) * 100.0 / COUNT(o.order_id), 2) AS rto_rate_pct,
    CASE 
        WHEN COUNT(o.order_id) >= 3 AND SUM(CASE WHEN o.order_status = 'RTO' THEN 1 ELSE 0 END) >= 2 THEN 'HIGH_RISK_COD'
        WHEN p.avg_delivery_delay_days > 4 THEN 'LOGISTICS_DELAY_RISK'
        ELSE 'STANDARD_ELIGIBLE'
    END AS risk_segmentation
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN pincode_master p ON c.delivery_pincode = p.pincode
WHERE o.payment_mode = 'COD' AND o.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY c.customer_id, c.delivery_pincode
HAVING total_orders >= 1
ORDER BY rto_rate_pct DESC;`,
      },
    },
    {
      id: 'time-automation',
      title: 'Automated Reporting Workflows',
      subtitle: 'Power Query & Excel macro pipeline',
      businessContext:
        'Engineered automated ETL pipelines converting raw multi-channel operational spreadsheets into clean executive dashboards, eliminating 3 hours of repetitive daily reporting.',
      kpis: [
        { label: 'Daily Saved', value: '3.0 hrs', trend: 'Freed for deep analysis' },
        { label: 'Monthly Saved', value: '60+ hrs', trend: 'Across analytics team' },
        { label: 'Error Rate', value: '0.0%', trend: 'Automated validation' },
      ],
      chartType: 'bar',
      chartData: [
        { name: 'Manual Pulls', value: 180, benchmark: 150 },
        { name: 'VLOOKUP Cleaning', value: 120, benchmark: 100 },
        { name: 'Power Query ETL', value: 25, benchmark: 30 },
        { name: 'Scheduled Auto-Refresh', value: 5, benchmark: 10 },
      ],
      codeSnippet: {
        language: 'dax',
        title: 'Power BI Executive Metric Model (DAX)',
        code: `// Dynamic On-Time Delivery & SLA Compliance Rate
OTD_SLA_Rate = 
DIVIDE(
    CALCULATE(
        COUNTROWS('LogisticsOrders'),
        'LogisticsOrders'[ActualDeliveryDays] <= 'LogisticsOrders'[PromisedSLADays],
        'LogisticsOrders'[Status] = "Delivered"
    ),
    CALCULATE(
        COUNTROWS('LogisticsOrders'),
        'LogisticsOrders'[Status] = "Delivered"
    ),
    0
) * 100;

// Monthly RTO Rate Percentage
RTO_Rate_Pct = 
DIVIDE(
    CALCULATE(COUNTROWS('LogisticsOrders'), 'LogisticsOrders'[Status] = "RTO"),
    COUNTROWS('LogisticsOrders'),
    0
);`,
      },
    },
    {
      id: 'latency-opt',
      title: 'Database & API Latency Reduction',
      subtitle: 'Mithila Organix platform performance',
      businessContext:
        'Audited backend bottlenecks and database query execution plans, applying indexing and payload pruning that slashed customer response latency by 35%.',
      kpis: [
        { label: 'Latency Cut', value: '-35%', trend: 'Faster page response' },
        { label: 'Regression Bugs', value: '0', trend: 'Agile release quality' },
        { label: 'Checkout Drop-off', value: '-18%', trend: 'Higher completion' },
      ],
      chartType: 'bar',
      chartData: [
        { name: 'Unindexed Query', value: 480, benchmark: 400 },
        { name: 'Composite Index', value: 210, benchmark: 250 },
        { name: 'Payload Trimming', value: 140, benchmark: 160 },
        { name: 'Optimized DB View', value: 95, benchmark: 120 },
      ],
      codeSnippet: {
        language: 'sql',
        title: 'Optimized Composite Index & Query Refactor (SQL)',
        code: `-- Before: Full table scan scanning 450,000+ customer audit rows
-- After: Composite index on active foreign keys and status flags
CREATE INDEX idx_orders_customer_status_date 
ON orders (customer_id, order_status, order_date DESC);

EXPLAIN ANALYZE
SELECT 
    o.order_id, 
    o.total_amount, 
    o.created_at, 
    p.product_title
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.customer_id = 104928 
  AND o.order_status IN ('Completed', 'Shipped')
ORDER BY o.created_at DESC
LIMIT 20;`,
      },
    },
  ],
};
