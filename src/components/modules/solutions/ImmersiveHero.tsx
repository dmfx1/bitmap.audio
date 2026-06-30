import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from '../TypewriterHero';

interface ImmersiveHeroProps {
  imageSrc?: string;
}

export default function ImmersiveHero({ imageSrc }: ImmersiveHeroProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div data-has-hero className="relative w-full md:py-32 min-h-[50vh] md:h-full flex flex-col overflow-hidden">

      {/* 1. BACKGROUND CONSTELLATION + HERO IMAGE */}
      <div
        className="absolute right-0 top-0 w-full md:w-[85%] h-full pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
        }}
      >
        {/* HERO IMAGE — full colour, mask handles left-edge fade */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            decoding="async"
            loading="eager"
            className="absolute  inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Bottom fade */}
        {imageSrc && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10 " />
        )}


      </div>

      {/* Text legibility overlay — mobile: top-to-bottom fade */}
      <div className="md:hidden absolute inset-0 z-[5] pointer-events-none bg-gradient-to-b from-background/70 to-transparent" />
      {/* Text legibility overlay — desktop: constrained to text zone, steep right-edge dissolve */}
      {/* Tune: % values control stop positions within this div (which is 38% of hero width) */}
      {/* 0→55%: solid dark behind text | 55→85%: steep fade | 85→100%: final dissolve */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 z-[5] pointer-events-none w-[52%]"
        style={{ background: 'linear-gradient(to right, hsl(var(--background) / 0) 0%, hsl(var(--background) / 0.85) 75%, hsl(var(--background) / 0.15) 95%, transparent 100%)' }}
      />

      {/* 2. HERO CONTENT */}
      <div className="w-full md:max-w-4xl pl-4 md:pl-12 relative z-10">
        <a 
          href="/home" 
          className="group inline-flex items-center text-lg pb-4 md:pb-0 font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12"
        >
          <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
          RTN:HOME
        </a>

        <p className="text-eyebrow text-accent text-base font-bold animate-fade-in mb-4">
          Solutions <span className="opacity-50">/</span> Experiential Audio
        </p>
        
        <TypewriterHero 
          text={"Sound that exists\nin space"} 
          onComplete={() => setTimeout(() => {
            setShowContent(true);
            setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
          }, 200)}
        />
        
        <p className={`text-foreground/90 text-xl max-w-full md:max-w-[65%] transition-all duration-1000 mt-8
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            We design immersive audio experiences for physical installations and augmented reality experiences to transport users into new perception states and bring experiences to life through the feeling of sound.
        </p>
      </div>
    </div>
  );
}