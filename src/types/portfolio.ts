export interface SocialLink {
  platform: 'linkedin' | 'github' | 'email' | 'phone' | 'portfolio' | 'twitter';
  label: string;
  url: string;
  iconName: string;
  displayValue?: string;
}

export interface MetricHighlight {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimalPlaces?: number;
  change?: string;
  changeType?: 'positive' | 'neutral' | 'accent';
  context: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  duration?: string;
  type: 'Full-time' | 'Internship' | 'Simulation' | 'Contract' | 'Freelance';
  isCurrent?: boolean;
  description?: string;
  achievements: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'AI & GenAI' | 'Business Intelligence' | 'Data Analytics' | 'Full-Stack';
  description: string;
  problem: string;
  solution: string;
  impactMetrics: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  mediaType: 'interactive' | 'dashboard' | 'workflow';
  previewStats?: {
    label: string;
    value: string;
  }[];
}

export interface SkillItem {
  name: string;
  level?: 'Advanced' | 'Proficient' | 'Familiar';
  tag?: string;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  skills: SkillItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  grade?: string;
  location?: string;
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  category: 'Professional' | 'Cloud & Data' | 'Simulation' | 'Programming';
  skillsVerified: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  metric: string;
  description: string;
  tag: string;
  icon: string;
}

export interface SandboxScenario {
  id: string;
  title: string;
  subtitle: string;
  businessContext: string;
  kpis: {
    label: string;
    value: string;
    trend: string;
  }[];
  chartType: 'bar' | 'line' | 'metric-grid';
  chartData: {
    name: string;
    value: number;
    benchmark?: number;
  }[];
  codeSnippet: {
    language: 'sql' | 'python' | 'dax';
    title: string;
    code: string;
  };
}

export interface PortfolioData {
  profile: {
    name: string;
    firstName: string;
    lastName: string;
    headline: string;
    titles: string[];
    bio: string;
    shortBio: string;
    location: string;
    email: string;
    phone: string;
    availability: {
      status: 'available' | 'busy';
      text: string;
      locations: string[];
    };
    socialLinks: SocialLink[];
    resumeUrl: string;
  };
  keyMetrics: MetricHighlight[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  sandboxScenarios: SandboxScenario[];
}
