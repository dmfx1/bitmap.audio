/* src/components/modules/AboutIntro.tsx */
import React, { useState, useEffect } from 'react';
import TypewriterHero from './TypewriterHero';

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Sound Designer & Technologist",
    bio: "Deep expertise in digital audio systems, software integration, and the technical architecture of sound. Deep expertise in digital audio systems, software integration, and the technical architecture of sound. Deep expertise in digital audio systems, software integration, and the technical architecture of sound. Deep expertise in digital audio systems, software integration, and the technical architecture of sound. Deep expertise in digital audio systems, software integration, and the technical architecture of sound."
  },
  {
    name: "[nick.granville-fall]",
    role: "Composer & Spatial Audio Designer",
    bio: "Specializes in emotional storytelling through sound and the architecture of immersive audio experiences. Specializes in emotional storytelling through sound and the architecture of immersive audio experiences. Specializes in emotional storytelling through sound and the architecture of immersive audio experiences. Specializes in emotional storytelling through sound and the architecture of immersive audio experiences. Specializes in emotional storytelling through sound and the architecture of immersive audio experiences."
  }
];

export default function AboutIntro() {
  const [showContent, setShowContent] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 20); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-24 md:py-36 min-h-screen flex flex-col overflow-visible">
      
      {/* 1. BACKGROUND SKETCH (Bleeding Layer) */}
      <div 
        className="absolute right-0 md:right-[-5%] top-[5%] w-[300px] md:w-[700px] pointer-events-none z-0"
        style={{
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear'
        }}
      >
        <img 
          src="/images/dom-nick-about-sketch.png" 
          alt="Founders Wireframe" 
          className="w-full h-auto opacity-50 grayscale brightness-200 contrast-125"
        />
        
        {/* FIXED: The line now only renders while revealProgress is less than 100 */}
        {revealProgress < 100 && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-accent/50 shadow-[0_0_15px_hsl(var(--accent))]"
            style={{ left: `${revealProgress}%` }}
          />
        )}
      </div>

      {/* 2. HERO SECTION */}
      <div className="w-full md:max-w-4xl pl-0 md:pl-12 relative z-10 mb-24">
        <p className="text-eyebrow text-accent font-bold animate-fade-in mb-4">About Us</p>
        
        <TypewriterHero 
          text={"Two minds,\none sonic vision"} // Added newline character here
          onComplete={() => setTimeout(() => setShowContent(true), 200)} 
        />
        
        <p className={`text-body-muted text-lg bg-background/50 max-w-[60%] transition-all duration-1000 
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          bitmap.audio is the collaboration of two audio specialists bridging the gap between digital data and human perception.
        </p>
      </div>

      {/* 3. FOUNDERS MODULE (Integrated - No Line) */}
      <div className={`grid grid-cols-1 md:grid-cols-2 mt-24 gap-px bg-foreground/5 w-full transition-all duration-1000 delay-500
        ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        
        {founders.map((f, index) => {
          const formattedId = String(index).padStart(4, '0');
          return (
            <div key={index} className="group relative bg-background/50 p-12 overflow-hidden border-r border-foreground/5 last:border-0">
              
              {/* Card Decoration: Corner Bracket */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-foreground/10 group-hover:border-accent transition-colors" />
              
              <div className="relative z-10">
                <span className="font-mono text-[10px] text-accent block mb-6 tracking-widest">{formattedId}</span>
                
                <h3 className="text-foreground font-mono text-2xl mb-2 transition-all group-hover:translate-x-2">
                   {f.name}
                </h3>
                
                <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                  {f.role}
                </p>
                
                <div className="h-px w-8 bg-foreground/10 mb-8 group-hover:w-full transition-all duration-700" />
                
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm group-hover:text-foreground transition-colors">
                  {f.bio}
                </p>
              </div>

              {/* Technical Hover: Digital Scanning Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none" />
              
              {/* Electrified Footer Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}