export interface ThemeConfig {
  accentColor: 'blue' | 'cyan' | 'emerald' | 'violet' | 'amber' | 'natureNeon';
  fontSans: string;
  fontMono: string;
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showSandbox: boolean;
  enableMotion: boolean;
}

export const themeConfig: ThemeConfig = {
  accentColor: 'natureNeon',
  fontSans: 'var(--font-sans)',
  fontMono: 'var(--font-mono)',
  borderRadius: 'xl',
  showSandbox: true,
  enableMotion: true,
};

export const accentPalettes = {
  natureNeon: {
    primary: '#00FF9D',
    primaryHover: '#05D683',
    glow: 'rgba(0, 255, 157, 0.35)',
    gradient: 'from-emerald-500/25 via-cyan-500/15 to-transparent',
    borderGlow: 'border-emerald-400/40',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-[0_0_12px_rgba(0,255,157,0.2)]',
    ring: 'ring-emerald-400/50',
  },
  blue: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    glow: 'rgba(59, 130, 246, 0.25)',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderGlow: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    ring: 'ring-blue-500/40',
  },
  cyan: {
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    glow: 'rgba(6, 182, 212, 0.25)',
    gradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    borderGlow: 'border-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    ring: 'ring-cyan-500/40',
  },
  emerald: {
    primary: '#10B981',
    primaryHover: '#059669',
    glow: 'rgba(16, 185, 129, 0.25)',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    borderGlow: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ring: 'ring-emerald-500/40',
  },
  violet: {
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    glow: 'rgba(139, 92, 246, 0.25)',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    borderGlow: 'border-violet-500/30',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    ring: 'ring-violet-500/40',
  },
  amber: {
    primary: '#F59E0B',
    primaryHover: '#D97706',
    glow: 'rgba(245, 158, 11, 0.25)',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderGlow: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ring: 'ring-amber-500/40',
  },
};
