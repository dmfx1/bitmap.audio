/* src/lib/motion.ts
 *
 * Shared motion primitives for the whole site, so intro, scroll choreography and
 * (later) page transitions all speak the same language. Import these instead of
 * re-declaring eases / reduced-motion checks per component.
 *
 *   import { EASE, prefersReducedMotion } from '@/lib/motion';
 */

/** The one site-wide ease. Used for the intro lift, hero squish, header, etc.
 *  Keep everything on this curve unless a specific effect needs a different feel
 *  (scroll-scrubbed tweens should still use ease: 'none' — scrub owns the timing). */
export const EASE = 'power3.inOut';

/** Softer variant for entrances (title reveals, fades). */
export const EASE_OUT = 'power3.out';

/** Lenis wheel/scroll easing (expo-out). Matches EASE_OUT's feel for smooth scroll. */
export const LENIS_EASING = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** True when the user asked for reduced motion. Every timeline should branch on
 *  this and fall back to an instant / opacity-only result. SSR-safe. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
