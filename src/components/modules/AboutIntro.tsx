/* src/components/modules/AboutIntro.tsx */
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from './TypewriterHero';

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
    <div className="relative w-full md:py-32 min-h-svh flex flex-col overflow-visible">

      {/* 1. BACKGROUND SKETCH (Bleeding Layer) */}
      <div
        className="absolute right-0 md:right-12 top-[5%] md:top-4 w-[300px] md:w-[750px] pointer-events-none z-0"
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
      <div className="w-full md:max-w-4xl pl-4 md:pl-12 relative z-10 md:mb-24">
        <a 
          href="/home" 
          className="group inline-flex items-center text-lg pb-4 md:pb-0 font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12"
        >
          <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
          RTN:HOME
        </a>
        <p className="text-eyebrow text-accent text-base font-bold animate-fade-in mb-4">About Us</p>

        <TypewriterHero
          text={"Two minds,\none sonic vision"} // Added newline character here
          onComplete={() => setTimeout(() => setShowContent(true), 200)}
        />

        <p className={`text-body-muted text-lg font-mono bg-background/50 md:max-w-[60%] transition-all duration-1000
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          bitmap.audio are two audio specialists bridging the gap between machine states and human perception.
        </p>
        <p className={`text-body-muted text-lg font-mono bg-background/50 md:max-w-[85%] transition-all duration-1000
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <br/>
          We deconstruct brand identity into its smallest possible components <i>[the "bit"]</i> and re-engineer them across a 
          functional sonic framework <i>[the "map"]</i> to build trust and alleviate friction in digital experiences.
        </p>
      </div>

    </div>
  );
}
