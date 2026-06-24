/* src/components/modules/AboutIntro.tsx */
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from './TypewriterHero';

// ── HERO IMAGE CONFIG ─────────────────────────────────────────────────────────
// Flip the hero image horizontally — change this line or pass heroFlipped prop.
const HERO_IMAGE_FLIPPED_DEFAULT = false;
// ─────────────────────────────────────────────────────────────────────────────

interface AboutIntroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}

export default function AboutIntro({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: AboutIntroProps) {
  const [showContent, setShowContent] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:py-32 min-h-svh flex flex-col overflow-hidden">

      {/* 1. HERO IMAGE — 115% tall, anchored top, bleeds below frame — never shows bottom edge */}
      <div
        className="absolute right-0 top-0 w-full md:w-[65%] h-full pointer-events-none z-0"
        style={{
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-about-two-minds-03.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-center brightness-[1.2] contrast-[1.25]"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </div>
        
      {/* 2. WIREFRAME SKETCH — sits on top of hero image, scans in together */}
      <div
        className="hidden absolute right-0 md:right-12 top-[5%] md:top-4 w-[300px] md:w-[750px] pointer-events-none z-[1]"
        style={{
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear'
        }}
      >
        <img
          src="/images/dom-nick-about-sketch.webp"
          decoding="async"
          alt="Founders Wireframe"
          className="w-full h-auto opacity-40 grayscale brightness-200 contrast-125"
        />

        {/* Scanning line — clears once reveal is complete */}
        {revealProgress < 100 && (
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-accent/50 shadow-[0_0_15px_hsl(var(--accent))]"
            style={{ left: `${revealProgress}%` }}
          />
        )}
      </div>
      

      {/* 3. HERO TEXT CONTENT */}
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
          text={"Two minds,\none sonic vision"}
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
