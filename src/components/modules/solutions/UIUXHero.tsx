import React, { useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
import { useHeroSquish } from '../../../hooks/use-hero-squish';
import { useIntroGate } from '../../../hooks/use-intro-gate';

export default function UIUXHero() {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  useHeroSquish(heroRef, started);
  const [showContent, setShowContent] = useState(false);

  return (
    <div
      ref={heroRef}
      data-has-hero
      className="relative w-full flex-1 grid grid-rows-2 py-[var(--page-gutter)] will-change-transform"
    >
      {started && (
        <>
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={"Sound that makes\ninterfaces intuitive"}
                onComplete={() =>
                  setTimeout(() => {
                    setShowContent(true);
                    setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                  }, 200)
                }
              />
            </div>
          </div>

          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="sub" className="hero-copy">
              <div
                className={`transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-foreground/90 text-3xl md:text-5xl font-mono">
                  Enhance usability and provide critical feedback through purposeful audio. We bridge the gap between digital interaction and human intuition.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
