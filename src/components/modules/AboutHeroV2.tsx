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
      className="relative w-full flex-1 flex flex-col justify-end pt-44 pb-12 md:pb-16"
    >
      {/* Text content — anchored to the bottom of the hero (open space above it,
          reserved for future non-AI imagery). Nothing is clipped. */}
      <div className="w-full md:max-w-6xl pl-4 md:pl-12 relative z-10">
        {started && (
          <>

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

            <p
              className={`text-foreground/90 text-5xl font-mono transition-all duration-1000 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              We look at the parts of the sum. The bits that make you whole.<br/><br/>
              We design for them and build them back into a functional sonic framework you can map across your entire branding network.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
