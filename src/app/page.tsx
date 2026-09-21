import { ClientThreeCanvas } from '@/components/ui/ClientThreeCanvas';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { MetricsBento } from '@/components/sections/MetricsBento';
import { About } from '@/components/sections/About';
import { InteractiveSandbox } from '@/components/sections/InteractiveSandbox';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#07080d] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white light:bg-slate-50 light:text-slate-900 transition-colors duration-300 overflow-x-hidden">
      <ClientThreeCanvas />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MetricsBento />
        <About />
        <InteractiveSandbox />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
