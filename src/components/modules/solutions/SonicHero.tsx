import React, { useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
import { useHeroSquish } from '../../../hooks/use-hero-squish';
import { useIntroGate } from '../../../hooks/use-intro-gate';

export default function SonicHero() {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  useHeroSquish(heroRef, started);
  const [showContent, setShowContent] = useState(false);

  return (
    <div ref={heroRef} data-has-hero className="relative w-full min-h-svh flex flex-col justify-center overflow-hidden">
      <div className="container-page relative z-10">
        {started && (
          <>
            <p className="text-eyebrow text-accent text-base font-bold animate-fade-in mb-4">
              Solutions <span className="opacity-50">/</span> Sonic Branding
            </p>

            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={"Define your brand's\naudio DNA"}
                onComplete={() => setTimeout(() => {
                  setShowContent(true);
                  setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                }, 200)}
              />
            </div>

            <div data-hero-pull="sub" className="hero-copy">
              <p className={`text-foreground/90 text-xl transition-all duration-1000 mt-8
                ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Visual identity can only go so far. Turbo charge your brand with a unique sonic footprint to significantly enhance recognition and recall.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
