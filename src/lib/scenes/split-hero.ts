/* src/lib/scenes/split-hero.ts
 *
 * About's split hero EXIT — THE CURTAIN: the solaris seam SPLITS in two and the two edges step outward
 * (left + right), OPENING the hero to reveal the next section (`reveal`) underneath — it's clipped from the
 * centre out in exact step with the edges. No white-out.
 *   start / dur — timeline units (≈ viewports of scroll); steps — hard jumps (bitmappy). Scrubbed both ways.
 */
import { gsap } from 'gsap';

type Timeline = gsap.core.Timeline;

export function buildSplitHeroEntrance(
  tl: Timeline,
  { seam, wipeL, wipeR, reveal }: { seam: HTMLElement | null; wipeL: HTMLElement | null; wipeR: HTMLElement | null; reveal?: HTMLElement | null },
  { start = 0, dur = 1, steps = 16 }: { start?: number; dur?: number; steps?: number } = {},
) {
  if (seam) tl.set(seam, { autoAlpha: 0 }, start);            // the single seam becomes the two wipe edges
  const wipe = (el: HTMLElement | null) => {
    if (!el) return;
    tl.set(el, { visibility: 'visible' }, start);
    // BITMAPPY: hard pixel jumps (steps), not a smooth glide. 50% = the edge ends at the screen edge.
    tl.fromTo(el, { width: '0%' }, { width: '50%', ease: `steps(${steps})`, duration: dur }, start);
    tl.to(el, { autoAlpha: 0, duration: 0.05 }, start + dur);     // edges gone once fully open
    // a little data-glitch flicker on the solaris edge while it travels
    tl.fromTo(el, { '--edge-o': 1 }, { '--edge-o': 1, keyframes: { '0%': { '--edge-o': 1 }, '30%': { '--edge-o': 0.4 }, '35%': { '--edge-o': 1 }, '70%': { '--edge-o': 0.5 }, '75%': { '--edge-o': 1 } }, ease: 'none', duration: dur }, start);
  };
  wipe(wipeL);
  wipe(wipeR);
  if (reveal) {
    // the next section, revealed from the centre out — SAME steps + timing, so its edges ride the bars
    tl.set(reveal, { autoAlpha: 1, pointerEvents: 'none' }, start);
    tl.fromTo(reveal, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: `steps(${steps})`, duration: dur }, start);
    // the header only treats it as "under the logo" once it's mostly open (keeps the logo white over the dark half)
    tl.set(reveal, { pointerEvents: '' }, start + dur * 0.6);
  }
}
