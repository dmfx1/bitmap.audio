/* src/components/modules/Founders.tsx */
import React from 'react';

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Design & Implementation",
    bio: "Deep expertise in digital audio systems, software integration, and the technical architecture of sound."
  },
  {
    name: "[nick.granville-fall]",
    role: "Design & Analytics",
    bio: "Specializes in emotional storytelling through sound and the architecture of immersive audio experiences."
  }
];

export default function Founders() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-foreground/5 w-full">
      {founders.map((f, index) => {
        const formattedId = String(index).padStart(4, '0');
        return (
          <div key={index} className="mobile-viewport-active group relative bg-background/50 p-4 md:p-12 overflow-hidden border border-foreground/10">
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-foreground/10 group-hover:border-accent transition-colors" />
            <div className="relative z-10">
              <span className="font-mono text-[10px] mt-8 md:mt-0 text-accent block mb-6 tracking-widest">{formattedId}</span>
              <h3 className="text-foreground font-mono text-2xl mb-2 transition-all group-hover:translate-x-2">{f.name}</h3>
              <p className="text-primary font-mono text-xs uppercase tracking-[0.3em] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">{f.role}</p>
              <div className="h-px w-8 bg-foreground/50 mb-8 group-hover:w-full transition-all duration-700" />
              <p className="text-muted-foreground text-lg mb-12 md:mb-0 leading-relaxed max-w-sm group-hover:text-foreground transition-colors">{f.bio}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        );
      })}
    </div>
  );
}
