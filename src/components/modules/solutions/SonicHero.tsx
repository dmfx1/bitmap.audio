import React, { useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
import PlayReelButton from '../PlayReelButton';
import { useHeroSquish } from '../../../hooks/use-hero-squish';
import { useIntroGate } from '../../../hooks/use-intro-gate';

/* Solutions hero — same two-row layout as the home / about-v2 heroes (site-wide consistency):
 *   ROW 1 (top half): breadcrumb + title, justify-end so the title reads around the middle.
 *                     data-hero-pull="title" → drifts slowly into the void on scroll.
 *   ROW 2 (bottom half): description, justify-end so it's PINNED to the bottom, and bigger.
 *                     data-hero-pull="sub" → drifts faster; the breadcrumb rides with it.
 * The parent #hero-sticky must be `flex flex-col` so this flex-1 grid fills the viewport.
 */
export default function SonicHero() {
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
          {/* ROW 1 — title, pinned to the bottom of the top half (reads mid). Drifts slowly. */}
          <div className="container-page relative z-10 flex flex-col justify-center min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={"Define your brand's\naudio DNA"}
                onComplete={() =>
                  setTimeout(() => {
                    setShowContent(true);
                    setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                  }, 200)
                }
              />
            </div>
          </div>

          {/* ROW 2 — breadcrumb + description, PINNED to the bottom, description bigger. Drifts
              faster (sub). The showContent fade sits on an INNER div so it never fights
              useHeroSquish's opacity (which would otherwise pin it invisible). */}
          {/* ROW 2 — blurb centred in the lower half; PLAY REEL button pinned to the bottom (like home). */}
          <div className="container-page relative z-10 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div data-hero-pull="sub" className="hero-copy">
                <p
                  className={`text-foreground/90 text-3xl md:text-5xl font-mono transition-all duration-1000 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  Visual identity can only go so far. <br/><br/>Brands with a unique sonic footprint significantly enhance recognition and recall.
                </p>
              </div>
            </div>
            <div data-hero-pull="track" className="hero-copy">
              <div
                className={`w-full max-w-xs transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <PlayReelButton slug="sonic-branding" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
