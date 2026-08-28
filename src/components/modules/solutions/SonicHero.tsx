import React, { useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
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
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
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
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="sub" className="hero-copy">
              <div
                className={`transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-foreground/90 text-3xl md:text-5xl font-mono">
                  Visual identity can only go so far. Turbo charge your brand with a unique sonic footprint to significantly enhance recognition and recall.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
