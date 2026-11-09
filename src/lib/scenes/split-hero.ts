/* src/lib/scenes/split-hero.ts
 *
 * About's split hero EXIT — the solaris seam SPLITS in two and the halves sweep outward (left + right),
 * each dragging an oat panel behind it, so the hero is WIPED away rather than pulled into the void. The
 * panels are the fog's colour, so the page's usual white-out fog takes over seamlessly afterwards.
 *   start / dur — timeline units (≈ viewports of scroll). Scrubbed both ways.
 */
import { gsap } from 'gsap';

type Timeline = gsap.core.Timeline;

export function buildSplitHeroEntrance(
  tl: Timeline,
  { seam, wipeL, wipeR }: { seam: HTMLElement | null; wipeL: HTMLElement | null; wipeR: HTMLElement | null },
  { start = 0.15, dur = 0.85 }: { start?: number; dur?: number } = {},
) {
  if (seam) tl.set(seam, { autoAlpha: 0 }, start);            // the single seam becomes the two wipe edges
  const wipe = (el: HTMLElement | null) => {
    if (!el) return;
    tl.set(el, { visibility: 'visible' }, start);
    // 52%: the bar's edge travels just past the screen edge, so it fully leaves
    tl.fromTo(el, { width: '0%' }, { width: '52%', ease: 'power2.inOut', duration: dur }, start);
  };
  wipe(wipeL);
  wipe(wipeR);
}
