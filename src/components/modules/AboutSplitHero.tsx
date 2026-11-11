/* src/components/modules/AboutSplitHero.tsx
 *
 * ABOUT hero — TWO HALVES, ONE SEAM ("two minds, one voice"). Built 2026-11-09.
 *   LEFT  (dark, white binary rain from the global #grid-bg): first half of the title + Dom.
 *   RIGHT (oat, a darker binary rain): the solaris second half of the title + Nick.
 *   A vertical solaris seam between them (desktop) / horizontal bar (mobile).
 * The half BACKGROUNDS + seam live in about.astro (.split-bg, so they fill the whole scene incl. under
 * the header); this component is the copy, laid over them on the same 50/50 grid.
 *
 * Motion: the left title scrambles in, THEN the right one (two minds → one voice), then the people +
 * button fade up. On scroll, the solaris seam SPLITS in two and the halves wipe outward (left + right),
 * clearing everything into the oat white-out (lib/scenes/split-hero.ts). Content is centred in each half.
 */
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BOOKING_URL } from '@/config/booking';
import ScrambleHeading from './ScrambleHeading';
import { useIntroGate } from '../../hooks/use-intro-gate';

/** A split hero is TITLES by default; name/meta (and the button) are optional extra lines. */
type Side = { title: string; name?: string; meta?: string };
interface Props {
  left: Side;
  right: Side;
  ctaLabel?: string;
}

export default function AboutSplitHero({ left, right, ctaLabel }: Props) {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  // NB no useHeroSquish here: the split hero doesn't get pulled into the void — the seam WIPES it away
  // instead (lib/scenes/split-hero.ts).
  const [rightOn, setRightOn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const fade = `transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  const titlesOnly = !left.name && !left.meta && !right.name && !right.meta && !ctaLabel;
  const person = (s: Side, tone: 'dark' | 'oat') => !(s.name || s.meta) ? null : (
    <div data-hero-pull="sub" className="hero-copy">
      <div className={fade}>
        {s.name && <p className={`font-mono type-title split-hero__name ${tone === 'oat' ? 'text-[hsl(var(--content-foreground))]' : 'text-foreground'}`}>{s.name}</p>}
        {s.meta && <p className={`font-mono type-body split-hero__meta ${tone === 'oat' ? 'text-[hsl(var(--content-foreground)/0.7)]' : 'text-foreground/70'}`}>{s.meta}</p>}
      </div>
    </div>
  );

  return (
    <div ref={heroRef} data-has-hero className={`split-hero relative w-full flex-1 min-h-0${titlesOnly ? ' split-hero--titles' : ''}`}>
      {started && (
        <>
          {/* LEFT — dark */}
          <div className="split-hero__half split-hero__half--dark">
            <div data-hero-pull="title" className="hero-copy split-hero__title-wrap">
              <ScrambleHeading
                text={left.title}
                className="heading-hero leading-tight font-medium split-hero__title split-hero__title--left"
                onComplete={() => setTimeout(() => setRightOn(true), 120)}
              />
            </div>
            <div className="split-hero__lower">
              {person(left, 'dark')}
              {ctaLabel && (
                <div data-hero-pull="sub" className="hero-copy">
                  <div className={`w-full max-w-xs mt-8 mx-auto ${fade}`}>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="xl" className="morph-accent rounded-none w-full h-14 md:h-24 px-4 md:px-8 text-base md:text-xl">
                        {ctaLabel}
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — oat */}
          <div className="split-hero__half split-hero__half--oat">
            {/* mobile only: the shared oat rain (same markup as lib/rain.ts; desktop's lives in .split-bg) */}
            <div className="binary-waterfall rain rain--oat md:hidden" aria-hidden="true">
              <div className="binary-layer layer-deep" /><div className="binary-layer layer-near" />
            </div>
            <div data-hero-pull="title" className="hero-copy split-hero__title-wrap">
              {rightOn && (
                <ScrambleHeading
                  text={right.title}
                  className="heading-hero leading-tight font-medium text-accent split-hero__title split-hero__title--right"
                  onComplete={() =>
                    setTimeout(() => {
                      setShowContent(true);
                      setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                    }, 200)
                  }
                />
              )}
            </div>
            <div className="split-hero__lower">{person(right, 'oat')}</div>
          </div>
        </>
      )}
    </div>
  );
}
