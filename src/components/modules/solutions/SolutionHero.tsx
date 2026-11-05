/* src/components/modules/solutions/SolutionHero.tsx
 *
 * Shared hero for the three solutions pages (sonic-branding, uiux-sound, immersive-audio). Replaces
 * SonicHero / UIUXHero / ImmersiveHero, which were identical apart from their copy + reel slug.
 * Each page passes its own copy, so copy edits stay on the page.
 *
 * Same two-row layout as the home / about heroes (site-wide consistency):
 *   ROW 1 (top half):    title. data-hero-pull="title" → drifts slowly into the void on scroll.
 *   ROW 2 (bottom half): blurb centred in the lower half (data-hero-pull="sub", drifts faster) and the
 *                        PLAY REEL button pinned to the bottom (data-hero-pull="track"), like home.
 * The showContent fade sits on an INNER element so it never fights useHeroSquish's opacity (which
 * would otherwise pin it invisible). The parent #hero-sticky must be `flex flex-col` so this flex-1
 * grid fills the viewport.
 */
import { Fragment, useRef, useState } from 'react';
import ScrambleHeading from '../ScrambleHeading';
import PlayReelButton from '../PlayReelButton';
import { useHeroSquish } from '../../../hooks/use-hero-squish';
import { useIntroGate } from '../../../hooks/use-intro-gate';

interface SolutionHeroProps {
  /** Hero title; `\n` forces a line break. */
  title: string;
  /** Blurb paragraphs, rendered separated by a blank line (`<br/><br/>`). */
  blurb: string[];
  /** Video slug for the play-reel button (see src/data/videos.ts). */
  reelSlug: string;
}

export default function SolutionHero({ title, blurb, reelSlug }: SolutionHeroProps) {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  useHeroSquish(heroRef, started);
  const [showContent, setShowContent] = useState(false);
  const fade = showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div
      ref={heroRef}
      data-has-hero
      className="relative w-full flex-1 flex flex-col mobile:justify-center mobile:gap-8 md:grid md:grid-rows-2 py-[var(--page-gutter)] will-change-transform"
    >
      {started && (
        <>
          {/* ROW 1 — title. Drifts slowly. */}
          <div className="container-page relative z-10 flex flex-col justify-start md:justify-center min-h-0">
            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={title}
                onComplete={() =>
                  setTimeout(() => {
                    setShowContent(true);
                    setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                  }, 200)
                }
              />
            </div>
          </div>

          {/* ROW 2 — blurb centred in the lower half; PLAY REEL button pinned to the bottom. */}
          <div className="container-page relative z-10 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col justify-start md:justify-center min-h-0">
              <div data-hero-pull="sub" className="hero-copy">
                <p className={`text-foreground/90 text-2xl md:text-5xl font-mono transition-all duration-1000 ${fade}`}>
                  {blurb.map((para, i) => (
                    <Fragment key={i}>
                      {i > 0 && <><br /><br /></>}
                      {para}
                    </Fragment>
                  ))}
                </p>
              </div>
            </div>
            <div data-hero-pull="track" className="hero-copy mt-8 md:mt-0">
              <div className={`w-full max-w-[13rem] md:max-w-xs transition-all duration-1000 ${fade}`}>
                <PlayReelButton slug={reelSlug} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
