import React, { useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
import PlayReelButton from '../PlayReelButton';
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
          <div className="container-page relative z-10 flex flex-col justify-center min-h-0">
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

          {/* ROW 2 — blurb centred in the lower half; PLAY REEL button pinned to the bottom (like home). */}
          <div className="container-page relative z-10 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div data-hero-pull="sub" className="hero-copy">
                <p
                  className={`text-foreground/90 text-3xl md:text-5xl font-mono transition-all duration-1000 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Enhance usability and provide critical feedback through purposeful audio.<br/><br/> We bridge the gap between digital interaction and human intuition.
                </p>
              </div>
            </div>
            <div data-hero-pull="track" className="hero-copy">
              <div
                className={`w-full max-w-xs transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <PlayReelButton slug="user-experience" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
