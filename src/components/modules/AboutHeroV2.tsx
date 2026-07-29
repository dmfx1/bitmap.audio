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
import React, { useEffect, useState } from 'react';
import TypewriterHero from './TypewriterHero';

export default function AboutHeroV2() {
  // Wait for the nav's intro to finish (curtain covers the page on first load) so
  // the hero text doesn't animate underneath it. Starts immediately on later loads
  // (the nav signals done on mount) and has a fallback so it never gets stuck.
  const [started, setStarted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__bitmapIntroDone) {
      setStarted(true);
      return;
    }
    const onDone = () => setStarted(true);
    window.addEventListener('intro-complete', onDone, { once: true });
    const fallback = window.setTimeout(() => setStarted(true), 4000);
    return () => {
      window.removeEventListener('intro-complete', onDone);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      data-has-hero
      className="relative w-full flex-1 grid grid-rows-2 pt-44 pb-12 md:pb-16"
    >
      {/* Hero image — anchored RIGHT, fading in from the left (old-site mask).
          Simple opacity fade-in when the hero starts (no flicker). */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-[150vh] w-full md:w-[60%] z-0 pointer-events-none transition-opacity duration-1000 saturate-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
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
          {/* ROW 1 (top half) — hero title pinned to the BOTTOM of the row, so it
              sits around the vertical middle of the section (higher than before). */}
          <div className="w-full md:max-w-6xl pl-4 md:pl-12 relative z-10 flex flex-col justify-center min-h-0">
            <TypewriterHero
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

          {/* ROW 2 (bottom half) — description pinned to the BOTTOM of the section. */}
          <div className="w-full md:max-w-6xl pl-4 md:pl-12 relative z-10 flex flex-col justify-end min-h-0">
            <p
              className={`text-foreground/90 text-5xl font-mono transition-all duration-1000 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              We look at the parts of the sum. The bits that make you whole.<br/><br/>
              We design for them and build them back into a functional sonic framework you can map across your entire branding network.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
