/* src/components/modules/AboutHeroV2.tsx
 *
 * v2 About hero — NO photographic imagery. The right side is a generative
 * SonicVisual (canvas oscilloscope/spectrum) instead of the old two-minds photo.
 * Text starts only after the IntroSequence hands off (window.__bitmapIntroDone /
 * `intro-complete`), so the typewriter doesn't run underneath the curtain.
 *
 * Keeps `data-has-hero` + fires `hero-content-ready` so Section.astro's reveal
 * observer waits for the hero exactly as it does on the current about page.
 */
import React, { useRef, useState } from 'react';
import ScrambleHeading from './ScrambleHeading';
import { useIntroGate } from '../../hooks/use-intro-gate';
import { useHeroSquish } from '../../hooks/use-hero-squish';

export default function AboutHeroV2() {
  // Hold the hero until the nav intro finishes, so the whole site animates in the
  // same order: bitmap.audio -> page name + b at top -> then the hero types.
  const started = useIntroGate();
  const [showContent, setShowContent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Site-wide hero squish on scroll (tune every hero via HERO_SQUISH in the hook).
  useHeroSquish(heroRef, started);

  return (
    <div
      ref={heroRef}
      data-has-hero
      className="relative w-full flex-1 grid grid-rows-2 py-[var(--page-gutter)] will-change-transform"
    >
      {/* Hero image — anchored RIGHT, fading in from the left (old-site mask).
          Simple opacity fade-in when the hero starts (no flicker). */}
      <div
        aria-hidden="true"
        className="hidden absolute -right-80 top-1/2 h-full w-full md:w-[100%] z-0 pointer-events-none transition-opacity duration-1000 saturate-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 70%)',
          maskImage: 'linear-gradient(to right, transparent 20%, black 70%)',
          opacity: started ? 1 : 0,
        }}
      >
        <img
          src="/images/heroes/heroBG.png"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* Bottom fade — dissolves the image into the background before the edge. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {started && (
        <>
          {/* ROW 1 (top half) — hero title. data-hero-pull="title" → pulled slowly into
              the central glare on scroll (see use-hero-squish). */}
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={'Two minds,\none sonic vision'}
                onComplete={() =>
                  setTimeout(() => {
                    setShowContent(true);
                    setTimeout(
                      () => window.dispatchEvent(new CustomEvent('hero-content-ready')),
                      500
                    );
                  }, 200)
                }
              />
            </div>
          </div>

          {/* ROW 2 (bottom half) — description. data-hero-pull="sub" → pulled FASTER into
              the glare (further away, sucked in quicker). */}
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="sub" className="hero-copy">
              <p
                className={`text-foreground/90 text-5xl font-mono transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                We look at the parts of the sum. The bits that make you whole.<br/><br/>
                We design for them and build them back into a functional sonic framework you can map across your entire branding network.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
