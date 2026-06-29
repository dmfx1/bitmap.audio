/* src/components/modules/Founders.tsx */
import React from 'react';

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Build & Implementation",
    bio: "Having spent over a decade working as a creative sound designer for advertising and animation, Dom has more recently turned his attention to the world of surround sound for film and object-based audio [Dolby Atmos / Wwise] for immersive experiences. An obsessive systems based thinker looking to explore new ways of user interaction with sound."
  },
  {
    name: "[nick.granville-fall]",
    role: "Theory & Analytics",
    bio: "Nick specialises in emotional storytelling through sound and has built up a wealth of experience across advertising and immersive installations. He has a deep, theoretical understanding of 'why' sound resonates in the way it does, and is able to dissect the psychology to ensure user expereience is heightened in a meaningful way."
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
              <h3 className="text-foreground font-mono text-3xl mb-2 transition-all group-hover:translate-x-2">{f.name}</h3>
              <p className="text-primary font-mono text-sm uppercase tracking-[0.3em] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">{f.role}</p>
              <div className="h-px w-8 bg-foreground/50 mb-8 group-hover:w-full transition-all duration-700" />
              <p className="text-foreground/80 font-mono text-lg mb-12 md:mb-0 leading-relaxed max-w-[90%] group-hover:text-foreground transition-colors">{f.bio}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        );
      })}
    </div>
  );
}
