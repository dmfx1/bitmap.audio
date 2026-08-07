/* src/hooks/use-hero-squish.ts
 *
 * SITE-WIDE hero "pull into the void" — the single source of truth for how every
 * page's hero recedes on scroll. Instead of drifting the whole hero up-left, each
 * marked layer is PULLED toward the centre of the hero (the bright central glare /
 * "black hole"), shrinking and fading as it goes — like being sucked in. On scroll
 * back up they return to place. The header/nav is separate and untouched.
 *
 * Layers are marked in the markup with `data-hero-pull`:
 *   data-hero-pull="title"  → the page title/subtitle: pulled SLOWLY (subtle)
 *   data-hero-pull="sub"    → the hero body copy: pulled FASTER (further away, so it
 *                             gets sucked in quicker — the afternow depth-parallax)
 *   data-hero-pull="0.8"    → or any number for a custom pull strength
 * Mark WRAPPER divs (not the h1/p directly) so this never fights the scramble/opacity
 * transitions on the text itself.
 *
 * Desktop only; reduced-motion skips it.
 *
 * Usage:  const ref = useRef(null); useHeroSquish(ref, started);
 *   ref     = the hero container
 *   ready   = pass the hero's `started` gate — the layers only exist once the intro
 *             hands off, so the effect must (re)run when that flips true, otherwise it
 *             finds zero layers on mount and never sets up.
 * Tune the whole site via HERO_SQUISH below.
 */
import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** ── TUNE THE WHOLE SITE HERE ────────────────────────────────────────────────
 *  titlePull  how far the title travels toward the centre (0–1 of the distance)
 *  subPull    how far the body copy travels — higher = faster/further (sucked in)
 *  shrink     how much a fully-pulled layer scales down (× its pull)
 *  end        scroll the pull spans; '+=80%' ≈ 80% of a viewport
 */
export const HERO_SQUISH = {
  titlePull: 0.5,
  subPull: 1.0,
  shrink: 0.55,
  end: '+=80%',
  /** The (unanimated) ScrollTrigger anchor every hero sticky wrapper carries. */
  trigger: '#hero-sticky',
} as const;

const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export function useHeroSquish(ref: RefObject<HTMLElement | null>, ready: boolean = true): void {
  useEffect(() => {
    if (!ready) return; // layers only exist once the hero content is revealed
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(min-width: 768px)').matches) return; // desktop only
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = ref.current;
    if (!hero) return;
    const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-pull]'));
    if (!layers.length) return;
    // Content just mounted — make sure ScrollTrigger measures the new layout.
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const triggerEl = document.querySelector(HERO_SQUISH.trigger) || hero;

    const tweens = layers.map((el) => {
      const kind = el.getAttribute('data-hero-pull');
      const pull =
        kind === 'sub' ? HERO_SQUISH.subPull :
        kind === 'title' ? HERO_SQUISH.titlePull :
        parseFloat(kind || '0.6') || 0.6;
      el.style.willChange = 'transform, opacity';
      return gsap.to(el, {
        // Pull toward the hero centre (the glare). Function-based so it re-measures
        // the natural positions on refresh (invalidateOnRefresh reverts first).
        x: () => (centre(hero).x - centre(el).x) * pull,
        y: () => (centre(hero).y - centre(el).y) * pull,
        scale: 1 - HERO_SQUISH.shrink * pull,
        opacity: 0,
        ease: 'none',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: HERO_SQUISH.end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      tweens.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
        t.kill();
      });
      layers.forEach((el) => gsap.set(el, { clearProps: 'transform,opacity,willChange' }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}
