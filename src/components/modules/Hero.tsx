import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ScrambleHeading from './ScrambleHeading';
import { useHeroSquish } from '../../hooks/use-hero-squish';
import { useIntroGate } from '../../hooks/use-intro-gate';

/* Home hero — same architecture/layout as the about-v2 hero (site-wide consistency):
 *   • flex-1 grid grid-rows-2 fills the sticky hero.
 *   • ROW 1 (top half): eyebrow + title, justify-end so the title sits around the vertical
 *     middle. data-hero-pull="title" → pulled SLOWLY into the central void on scroll.
 *   • ROW 2 (bottom half): blurb + CTAs, justify-end so the copy is PINNED to the bottom of
 *     the section. data-hero-pull="sub" → pulled FASTER into the void on scroll.
 *   • Title uses the default heading-hero size (md:text-8xl) — bigger than the old md:text-7xl.
 */
export default function Hero() {
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
          {/* ROW 1 (top half) — eyebrow + title, pinned to the bottom of the top half so the
              title reads around the vertical middle. Pulled slowly into the void on scroll. */}
          <div className="container-page relative z-10 flex flex-col justify-end min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <p className="text-eyebrow text-sm tracking-[0.4em] mb-6">Sonic Infrastructure</p>
              <ScrambleHeading
                text={'Where data meets\nemotion'}
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

          {/* ROW 2 (bottom half) — blurb is vertically CENTRED in the lower half; the CTAs stay PINNED
              to the bottom of the section (separated, so centring the copy doesn't drag the buttons up).
              data-hero-pull is on each wrapper (useHeroSquish pulls both into the void on scroll); the
              showContent fade lives on INNER divs so it never fights the hook's opacity. */}
          <div className="container-page relative z-10 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div data-hero-pull="sub" className="hero-copy">
                <p
                  className={`text-foreground/90 text-3xl md:text-5xl font-mono transition-all duration-1000 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  We architect sonic experiences that bridge the gap between digital interfaces and human perception.
                </p>
              </div>
            </div>

            <div data-hero-pull="sub" className="hero-copy">
              <div
                className={`w-full max-w-xl transition-all duration-1000 ${
                  showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-stretch gap-4 w-full">
                  <a href="/about" className="flex-1">
                    <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-xl">
                      OUR STORY
                    </Button>
                  </a>
                  <a href="/contact" className="flex-1">
                    <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-xl">
                      START A PROJECT
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
