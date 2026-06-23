import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── HERO IMAGE CONFIG ─────────────────────────────────────────────────────────
// Flip the hero image horizontally — change this line or pass heroFlipped prop.
const HERO_IMAGE_FLIPPED_DEFAULT = false;
// ─────────────────────────────────────────────────────────────────────────────

interface HeroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}

export default function Hero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: HeroProps) {
  const [phase, setPhase] = useState<'idle' | 'grow' | 'expand' | 'active'>('idle');
  const [activeText, setActiveText] = useState<'syncing' | 'connection' | 'activated' | null>(null);

  useEffect(() => {
    const tGrow      = setTimeout(() => setPhase('grow'),                600);
    const tSyncText  = setTimeout(() => setActiveText('syncing'),        600);
    const tExpand    = setTimeout(() => setPhase('expand'),             1800);
    const tConnText  = setTimeout(() => setActiveText('connection'),    2400);
    const tActive    = setTimeout(() => setPhase('active'),             3400);
    const tActiveText = setTimeout(() => setActiveText('activated'),    3600);

    return () => {
      [tGrow, tSyncText, tExpand, tConnText, tActive, tActiveText].forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full relative overflow-hidden">

      {/* ── HERO IMAGE — background, right half, bleeds below frame ──────── */}
      {/* CSS mask fades the left edge to transparent — full colour/brightness on the right */}
      <div
        className="absolute inset-y-0 right-0 w-full md:w-[66%] pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 50%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-data-meets-emotion-07.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-center"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      {/* Single left-aligned column — hero image bleeds in from right as absolute background */}
      <div className="relative z-10 py-8 px-4 md:pl-24 flex flex-col justify-center min-h-[80vh]">

        <div className="flex flex-col space-y-8 animate-fade-in-up md:max-w-[52%]">

          {/* HEADLINE */}
          <div className="space-y-4">
            <p className="text-eyebrow text-sm tracking-[0.4em]">Sonic Architecture</p>
            <h1 className="heading-hero md:text-7xl">
              Where data <br /> meets
              <span className={`text-accent font-medium block md:inline ${phase === 'active' ? 'pulse-sync-active' : ''}`}>
                <br className="hidden md:block" /> emotion
              </span>
            </h1>
          </div>

          {/* BODY */}
          <p className="text-body-muted max-w-base text-xl">
            We architect sonic experiences that bridge the gap between digital interfaces and human perception.
          </p>

          {/* SHARED WIDTH CONTAINER — constrains both buttons and visualizer to the same max width */}
          <div className="w-full max-w-xl">

            {/* CTA BUTTONS */}
            <div className="flex items-stretch gap-4 w-full">
              <a href="/about" className="flex-1">
                <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-base">
                  OUR STORY
                </Button>
              </a>
              <a href="/contact" className="flex-1">
                <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-base">
                  START A PROJECT
                </Button>
              </a>
            </div>

            {/* VISUALIZER — desktop only, fills shared container width */}
            <div className="hidden md:hidden flex-col w-full mt-8">
              <div className={`visualizer-stage phase-${phase}`}>
                <div className="relative w-full h-[40px] flex items-center justify-center">
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className="bar-element"
                      style={{ '--i': i } as React.CSSProperties}
                    />
                  ))}
                </div>
                <div className={`status-label transition-all duration-1000 ${activeText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  {activeText === 'activated' ? "Activated" :
                   activeText === 'connection' ? "Connecting" :
                   activeText === 'syncing' ? "Syncing" : ""}
                </div>
              </div>
            </div>

          </div>
          {/* END SHARED WIDTH CONTAINER */}

        </div>
      </div>
    </div>
  );
}
