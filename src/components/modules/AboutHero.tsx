/* src/components/modules/AboutHero.tsx
 *
 * v2 About hero — NO photographic imagery. The right side is a generative
 * SonicVisual (canvas oscilloscope/spectrum) instead of the old two-minds photo.
 * Text starts only after the IntroSequence hands off (window.__bitmapIntroDone /
 * `intro-complete`), so the typewriter doesn't run underneath the curtain.
 *
 * Keeps `data-has-hero` + fires `hero-content-ready` so Section.astro's reveal
 * observer waits for the hero exactly as it does on the current about page.
 */
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/config/booking';
import ScrambleHeading from './ScrambleHeading';
import { useIntroGate } from '../../hooks/use-intro-gate';
import { useHeroSquish } from '../../hooks/use-hero-squish';

interface AboutHeroProps {
  /** Title; every line after a \n renders in solaris (ScrambleHeading). */
  title?: string;
  /** Support copy; blank-line separated paragraphs. */
  sub?: string;
  /** One button (the booking link). Omit to show no button. */
  ctaLabel?: string;
}

// OLD COPY (pre-2026-11-09 rebuild) — kept as defaults so the old page (_about-v3-old.astro) renders unchanged.
const OLD_TITLE = 'Two minds,\none sonic vision';
const OLD_SUB = 'We look at the parts of the sum. The bits that make you whole.\n\nWe design for them and build them back into a functional sonic framework you can map across your entire branding network.';

export default function AboutHero({ title = OLD_TITLE, sub = OLD_SUB, ctaLabel }: AboutHeroProps = {}) {
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
      className="relative w-full flex-1 flex flex-col mobile:justify-center mobile:gap-8 md:grid md:grid-rows-2 py-[var(--page-gutter)] will-change-transform"
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
          src="/images/heroes/heroBG.webp"
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
          <div className="container-page relative z-10 flex flex-col justify-start md:justify-center min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={title}
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

          {/* ROW 2 (bottom half) — description in the space above; the optional button PINNED to the bottom
              (same split as the home hero). data-hero-pull="sub" → pulled FASTER into the glare. */}
          <div className="container-page relative z-10 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col justify-start min-h-0">
              <div data-hero-pull="sub" className="hero-copy">
                <p
                  className={`text-foreground/90 type-lead font-mono transition-all duration-1000 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {sub.split('\n\n').map((para, i) => (
                    <span key={i}>{i > 0 && <><br/><br/></>}{para}</span>
                  ))}
                </p>
              </div>
            </div>
            {ctaLabel && (
              <div data-hero-pull="sub" className="hero-copy">
                <div
                  className={`w-full max-w-xl mt-8 md:mt-0 transition-all duration-1000 ${
                    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-stretch gap-4 w-full">
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="xl" className="morph-accent rounded-none w-full h-14 md:h-24 px-4 md:px-8 text-base md:text-xl">
                        {ctaLabel}
                      </Button>
                    </a>
                    <span className="flex-1 hidden md:block" aria-hidden="true" />{/* half-width, like the home hero's 2-button row */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
