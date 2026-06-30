import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from '../TypewriterHero';

// ── HERO IMAGE CONFIG ─────────────────────────────────────────────────────────
// Flip the hero image horizontally — change this line or pass heroFlipped prop.
const HERO_IMAGE_FLIPPED_DEFAULT = false;
// ─────────────────────────────────────────────────────────────────────────────

interface UIUXHeroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}

export default function UIUXHero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: UIUXHeroProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div data-has-hero className="relative w-full md:py-32 min-h-[50vh] md:h-full flex flex-col overflow-hidden">

      {/* 1. BACKGROUND — hero image + icon constellation */}
      <div
        className="absolute right-0 top-0 w-full md:w-[85%] h-full pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
        }}
      >
        {/* HERO IMAGE — full colour, no blend mode, mask handles the fade */}
        <img
          src={imageSrc ?? "/images/heroes/hero-uiux-transparent-02.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="absolute -top-80 inset-0 w-full h-[120vh] object-cover object-center contrast-[1.25] brightness-[1.75]"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />

        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />


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
          Solutions <span className="opacity-50">/</span> UI + UX Sound
        </p>

        <TypewriterHero
          text={"Sound that makes\ninterfaces intuitive"}
          onComplete={() => setTimeout(() => {
            setShowContent(true);
            setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
          }, 200)}
        />

        <p className={`text-foreground/90 text-xl max-w-full md:max-w-[65%] transition-all duration-1000 mt-8
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Enhance usability and provide critical feedback through purposeful audio. We bridge the gap between digital interaction and human intuition.
        </p>
      </div>
    </div>
  );
}
