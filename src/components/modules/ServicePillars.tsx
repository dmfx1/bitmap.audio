import React from 'react';
import { Radio, Layers, Headphones, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  { 
    icon: Radio, 
    title: "Sonic Branding", 
    href: "/solutions/sonic-branding",
    desc: "Define your brand's audio identity with custom sound logos, audio guidelines, and comprehensive sonic systems."
  },
  { 
    icon: Layers, 
    title: "UI/UX Sound", 
    href: "/solutions/uiux-sound",
    desc: "Enhance digital products with intuitive audio feedback, notification systems, and interface sounds."
  },
  { 
    icon: Headphones, 
    title: "Immersive Audio", 
    href: "/solutions/immersive-audio",
    desc: "Create spatial audio experiences for AR/VR, installations, and experiential environments."
  },
];

export default function ServicePillars() {
  return (
    <div className="max-w-[1440px] mx-auto py-12 md:py-24 px-4 md:px-10">
      
      {/* HEADER AREA */}
      <div className="text-center mb-20 animate-fade-in-up">
        <p className="text-eyebrow text-accent text-sm mb-4">What We Do</p>
        <h2 className="text-4xl font-mono text-foreground">
          Three pillars of sonic design
        </h2>
      </div>

      {/* GRID AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div 
            key={i} 
            className="group relative flex flex-col p-6 md:p-12 transition-all duration-500 hover:bg-foreground/[0.02] card-glow overflow-hidden border border-border/20"
          >
            {/* ICON CHANGED TO SOLARIS (text-accent) */}
            <s.icon className="w-8 h-8 text-accent mb-8 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]" />
            
            <h3 className="font-mono text-xl font-medium text-foreground mb-4 tracking-tight group-hover:text-accent transition-colors duration-300">
              {s.title}
            </h3>
            
            <p className="text-body-muted mb-10 min-h-[60px]">
              {s.desc}
            </p>
            
            <div className="mt-auto pt-4">
              <a 
                href={s.href} 
                className="inline-flex items-center gap-3 text-[10px] font-mono tracking-[0.2em] uppercase text-primary group-hover:text-accent transition-colors"
              >
                LEARN MORE 
                <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </div>

            {/* ELECTRIFIED FOOTER LINE */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-500 group-hover:w-full group-hover:brightness-150 shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        ))}
      </div>
    </div>
  );
}