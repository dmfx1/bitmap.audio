/* src/components/modules/IntroSequence.tsx
 *
 * afternow-style entry animation (replaces a separate landing page).
 *   1. `bitmap.audio` shows at vertical-centre, hard left.
 *   2. It SCRAMBLES to the page name ("about us") — the morph happens FIRST.
 *   3. Holds on the resolved page name.
 *   4. GSAP then moves it to the top-left corner (+ shrink) while the curtain
 *      dissolves, revealing the page and handing off to the CornerMark anchor.
 *
 * Plays ONCE PER SESSION (sessionStorage). Append ?intro=1 to force a replay.
 *
 * Coordination: sets `window.__bitmapIntroDone = true` and dispatches
 * `intro-complete` so CornerMark / AboutHeroV2 start race-safely.
 */
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useScrambleTransition } from '../../hooks/use-scramble-transition';
import { BRAND_NAME as BRAND, BRAND_MOTION } from '../../config/brandMotion';

const SESSION_KEY = 'bitmap_intro_seen';

function signalDone() {
  if (typeof window === 'undefined') return;
  (window as any).__bitmapIntroDone = true;
  window.dispatchEvent(new CustomEvent('intro-complete'));
}

interface IntroSequenceProps {
  /** Page name the wordmark scrambles into, e.g. "about us". */
  pageName: string;
}

export default function IntroSequence({ pageName }: IntroSequenceProps) {
  const [play, setPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const forced = new URLSearchParams(window.location.search).has('intro');
    const seen = sessionStorage.getItem(SESSION_KEY);
    return forced || !seen;
  });

  // Scramble target: starts as the brand, then flips to the page name.
  const [target, setTarget] = useState(BRAND);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const display = useScrambleTransition(target, {
    outMs: BRAND_MOTION.scrambleOutMs,
    inMs: BRAND_MOTION.scrambleInMs,
  });

  useEffect(() => {
    if (!play) {
      signalDone();
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.overflow = 'hidden';

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.documentElement.style.overflow = '';
      signalDone();
      setPlay(false);
    };

    // 1. Establish the brand for brandHoldMs, then scramble OUT->IN to the page name.
    const scrambleId = window.setTimeout(() => setTarget(pageName), BRAND_MOTION.brandHoldMs);

    // Total time on screen before the wordmark lifts to the corner.
    const waitS =
      (BRAND_MOTION.brandHoldMs +
        BRAND_MOTION.scrambleOutMs +
        BRAND_MOTION.scrambleInMs +
        800) /
      1000;

    const tl = gsap.timeline({ onComplete: finish });

    if (reduced) {
      tl.to({}, { duration: Math.min(waitS, 1.2) }).to(overlayRef.current, { autoAlpha: 0, duration: 0.4 });
    } else {
      // 2/3. Wait for the scramble to resolve + hold on the page name.
      tl.to({}, { duration: waitS })
        // 4. Then travel to the top-left corner + shrink, dissolving the curtain.
        .to(markRef.current, {
          top: '1.25rem',
          left: '1rem',
          xPercent: 0,
          yPercent: 0,
          scale: 0.42,
          transformOrigin: 'top left',
          duration: 0.9,
          ease: 'power3.inOut',
        })
        .to(markRef.current, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.2')
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, '<');
    }

    return () => {
      window.clearTimeout(scrambleId);
      tl.kill();
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  if (!play) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9999] bg-background" aria-hidden="true">
      <div
        ref={markRef}
        className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 will-change-transform"
      >
        <span className="font-mono text-4xl md:text-7xl font-light tracking-tight text-foreground whitespace-nowrap">
          {display}
          <span className="text-accent">_</span>
        </span>
      </div>
    </div>
  );
}
