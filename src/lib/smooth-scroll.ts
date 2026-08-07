/* src/lib/smooth-scroll.ts
 *
 * Global smooth-scroll foundation: Lenis driving GSAP's ScrollTrigger off a single
 * RAF loop. This is the base layer for every scroll-driven effect in the motion
 * plan (hero squish, dark->beige colour handoff, scramble "pull", footer reveal).
 *
 * Wiring rules:
 *   - ONE Lenis instance, ONE ticker. GSAP's ticker runs Lenis so both stay in sync.
 *   - Lenis still scrolls the real window, so native `scroll` events + window.scrollY
 *     keep working — the existing nav-cover / nav-squash inline scripts are unaffected.
 *   - Gated OFF when <html data-smooth="off"> (the returns pages own their own
 *     normalizeScroll / GSAP) or when the user prefers reduced motion.
 *   - Astro-lifecycle aware: (re)inits on astro:page-load, tears down on
 *     astro:before-swap — so it's already correct once ClientRouter lands (Phase 5).
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LENIS_EASING, prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

function tick(time: number) {
  // GSAP ticker time is seconds; Lenis wants milliseconds.
  lenis?.raf(time * 1000);
}

function smoothingAllowed(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.dataset.smooth === 'off') return false; // returns pages
  if (prefersReducedMotion()) return false;
  return true;
}

export function initSmoothScroll(): void {
  destroySmoothScroll();
  if (!smoothingAllowed()) return; // native scroll; the page owns its own triggers

  lenis = new Lenis({
    duration: 1.1,
    easing: LENIS_EASING,
    smoothWheel: true,
    // touch stays native — Lenis smoothing on touch fights mobile snap layouts
    syncTouch: false,
  });

  (window as any).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Metrics settle after fonts swap — refresh so triggers measure correctly.
  ScrollTrigger.refresh();
  if ((document as any).fonts?.ready) {
    (document as any).fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export function destroySmoothScroll(): void {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  (window as any).__lenis = null;
}

/** Programmatic scroll helper (respects Lenis when active, else native). */
export function scrollTo(target: string | number | HTMLElement, opts?: Record<string, unknown>): void {
  if (lenis) lenis.scrollTo(target as any, opts);
  else if (typeof target !== 'number' && target instanceof HTMLElement) target.scrollIntoView({ behavior: 'smooth' });
}

// --- Astro lifecycle ---------------------------------------------------------
document.addEventListener('astro:page-load', initSmoothScroll);
document.addEventListener('astro:before-swap', destroySmoothScroll);

// Cold load (no view transitions yet): init once the page is ready.
if (document.readyState === 'complete') initSmoothScroll();
else window.addEventListener('load', initSmoothScroll);
