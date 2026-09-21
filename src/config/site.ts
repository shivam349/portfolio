export interface NavItem {
  label: string;
  href: string;
  iconName?: string;
}

export const siteConfig = {
  name: 'Shivam Garg | Data Analyst & BI Specialist',
  shortName: 'Shivam Garg',
  title: 'Shivam Garg — Data Analyst, SQL & Power BI Specialist, AI/ML Builder',
  description:
    'Portfolio of Shivam Garg, Data Analyst with 2+ years of experience turning raw business data into decisions using SQL, Power BI, Power Query, Python, and GenAI. Based in Bengaluru, India.',
  author: 'Shivam Garg',
  siteUrl: 'https://shivamgarg.dev',
  ogImage: '/og-image.png',
  keywords: [
    'Shivam Garg',
    'Data Analyst',
    'Business Analyst',
    'Business Intelligence',
    'Power BI Specialist',
    'SQL Developer',
    'Power Query ETL',
    'Python Data Automation',
    'LangChain GenAI',
    'Bengaluru Data Analyst',
    'Portfolio Template',
  ],
  navItems: [
    { label: 'Overview', href: '#hero' },
    { label: 'Metrics', href: '#metrics' },
    { label: 'About', href: '#about' },
    { label: 'Live Sandbox', href: '#sandbox' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ] as NavItem[],
  links: {
    github: 'https://github.com/shivamgarg1515',
    linkedin: 'https://www.linkedin.com/in/shivam-garg-21b25a1b4',
    email: 'shivamgarg1515@gmail.com',
    phone: '+91 8696450535',
  },
};
