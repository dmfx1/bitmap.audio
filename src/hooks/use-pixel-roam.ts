/* src/hooks/use-pixel-roam.ts
 *
 * Subtle bitmap flourish for the rect-grid icons: when `active` flips true, a single pixel "gap"
 * travels through the shape — one <rect> blanks out at a time, stepping along a random path, so it
 * reads as one lone pixel roaming the icon. Coordinate-free (pure opacity), so it works whether the
 * icon positions its pixels via rect x/y OR via per-pixel <g> matrix transforms. Desktop only.
 */
import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

export function usePixelRoam(ref: RefObject<HTMLElement | null>, active: boolean, enabled = true): void {
  useEffect(() => {
    if (!enabled || !active) return;
    if (typeof window !== 'undefined' && window.innerWidth < 768) return; // desktop only
    const el = ref.current;
    if (!el) return;
    const rects = Array.from(el.querySelectorAll('rect')) as SVGRectElement[];
    if (rects.length < 3) return;

    // A single gap steps through a short random path — exactly one pixel missing at any moment.
    const path = (gsap.utils.shuffle(rects.slice()) as SVGRectElement[]).slice(0, Math.min(5, rects.length));
    const step = 0.14; // dwell per pixel
    const tl = gsap.timeline({ delay: 0.15 });
    path.forEach((r, i) => {
      tl.set(r, { opacity: 0 }, 0.15 + i * step)         // pixel blanks…
        .set(r, { opacity: 1 }, 0.15 + (i + 1) * step);  // …restored as the next one blanks
    });

    return () => { tl.kill(); gsap.set(rects, { clearProps: 'opacity' }); };
  }, [active, enabled]);
}
