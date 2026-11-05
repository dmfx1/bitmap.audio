/* src/lib/scene-kit.ts
 *
 * Reusable authoring helpers for scroll-scrubbed scenes (used by src/lib/scenes/* and src/lib/stage.ts).
 * Everything here is concept-AGNOSTIC — geometry, easings, and the common GSAP moves used to
 * build a scroll-locked "explainer" scene. A new scene imports what it needs and authors its
 * own beats; nothing below is specific to the philosophy scene, so swap colours / sizes / beats
 * freely.
 *
 *   import { steps, centerXY, gridCell, ringPoint, bitmapAppear, crossfadeCaption, tvOut, glow, reduced } from '@/lib/scene-kit';
 *
 *   const el = stage.querySelector('#thing');
 *   bitmapAppear(tl, el, 1, '>');                   // flicker it in
 *   tl.to(el, { ...centerXY(600, 500, 100), ease: steps(7) });
 *
 * The helpers that build motion take the timeline (`tl`) as their first arg and append to it,
 * so they never own a GSAP instance — they just decorate whatever timeline the page passes.
 */
import type { gsap } from 'gsap';
import { prefersReducedMotion } from './motion';
type Timeline = gsap.core.Timeline;

/* ── environment ─────────────────────────────────────────────────────────── */

/** prefers-reduced-motion (SSR-safe). Alias of motion.ts's prefersReducedMotion. */
export const reduced = prefersReducedMotion;

/* ── string sugar ────────────────────────────────────────────────────────── */

/** `"steps(n)"` — the bitmappy / stepped ease used for jolting moves. */
export const steps = (n: number): string => 'steps(' + n + ')';

/** a `drop-shadow` glow filter string. */
export const glow = (blur: number, color: string): string => 'drop-shadow(0 0 ' + blur + 'px ' + color + ')';

/* ── geometry (viewBox units) ────────────────────────────────────────────── */

/** translate that centres a square of `size` so its centre lands on (cx,cy). */
export const centerXY = (cx: number, cy: number, size: number) => ({ x: cx - size / 2, y: cy - size / 2 });

/** centre of a 3×3-style grid cell (col,row ∈ 0..2) given the grid centre + pitch. */
export const gridCell = (col: number, row: number, cx: number, cy: number, pitch: number): [number, number] =>
  [cx - pitch + col * pitch, cy - pitch + row * pitch];

/** point `i` of `count`, evenly spaced on a ring of `radius` around (cx,cy). */
export const ringPoint = (
  i: number, count: number, cx: number, cy: number, radius: number, startAngle = 0,
): [number, number] => {
  const a = startAngle + (i * 2 * Math.PI) / count;
  return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
};

/** centres of a horizontal row of blocks with EQUAL edge-to-edge gaps (widths may differ),
 *  centred on `cx`. */
export function equalGapCenters(sizes: number[], cx: number, gap: number): number[] {
  const total = sizes.reduce((a, b) => a + b, 0) + (sizes.length - 1) * gap;
  const centers: number[] = [];
  let x = cx - total / 2;
  for (let s = 0; s < sizes.length; s++) { centers[s] = x + sizes[s] / 2; x += sizes[s] + gap; }
  return centers;
}

/* ── common GSAP moves (append to a timeline) ────────────────────────────── */

/** nav-style bitmapIn flicker-in: snaps through discrete scale/opacity states. */
export function bitmapAppear(
  tl: Timeline, target: any, finalScale: number, position: string,
  { duration = 0.6, stagger = 0 }: { duration?: number; stagger?: number } = {},
) {
  return tl.to(target, {
    keyframes: {
      opacity: [0, 1, 0.3, 1, 0.55, 1],
      scale: [finalScale * 0.2, finalScale * 0.6, finalScale * 0.25, finalScale * 0.85, finalScale * 0.5, finalScale],
      easeEach: 'steps(1)',
    },
    duration,
    ease: 'none',
    ...(stagger ? { stagger: { each: stagger, from: 'random' } } : {}),
  }, position);
}

/** cross-fade a stack of captions to index `n` (fades the previous one out alongside). */
export function crossfadeCaption(
  tl: Timeline, caps: ArrayLike<Element>, n: number,
  { outDur = 0.3, inDur = 0.4 }: { outDur?: number; inDur?: number } = {},
) {
  if (n > 0) tl.to(caps[n - 1], { opacity: 0, duration: outDur });
  tl.to(caps[n], { opacity: 1, duration: inDur }, n > 0 ? '<' : '>');
}

/** CRT "TV out": squeeze vertically to a bright line, then snap horizontally to nothing.
 *  `cx,cy` is the svg-origin the collapse pivots around. */
export function tvOut(tl: Timeline, target: any, cx: number, cy: number, position = '>') {
  tl.to(target, { scaleY: 0.02, filter: 'brightness(2.6)', svgOrigin: cx + ' ' + cy, duration: 0.3, ease: 'power2.in' }, position);
  tl.to(target, { scaleX: 0, opacity: 0, duration: 0.22, ease: 'power2.in' }, '>');
}

/** a glow flare — grows the drop-shadow, optionally yoyo-ing back to where it was. */
export function glowFlare(
  tl: Timeline, target: any, blur: number, color: string, position = '>',
  { duration = 0.4, yoyo = true }: { duration?: number; yoyo?: boolean } = {},
) {
  return tl.to(target, { filter: glow(blur, color), duration, yoyo, repeat: yoyo ? 1 : 0 }, position);
}

/* ── text ────────────────────────────────────────────────────────────────── */

/** Scramble text in, locking characters left→right over `duration` ms (bitmap 0/1 by default).
 *  Time-based (not scrubbed) — call it once, e.g. from an IntersectionObserver onEnter. */
export function scrambleIn(
  el: HTMLElement, text: string,
  { duration = 700, chars = '01' }: { duration?: number; chars?: string } = {},
): void {
  if (reduced()) { el.textContent = text; return; }
  const total = text.length;
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const locked = Math.floor(p * total);
    let out = '';
    for (let i = 0; i < total; i++) {
      const ch = text[i];
      out += i < locked || ch === ' ' ? ch : chars[(Math.random() * chars.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = text;
  };
  requestAnimationFrame(tick);
}

/** SCRUBBED counterpart of `scrambleIn`: returns `text` at scramble progress `p` (0 = all 0/1,
 *  1 = fully resolved), locking characters left→right. Deterministic per (char, step) so it is
 *  reversible under a scroll scrub — the 0/1s flicker as `p` changes but scrubbing back to the same
 *  `p` gives the same string. Spaces stay spaces (same as scrambleIn) unless keepSpaces:false — then an
 *  unresolved space is a 0/1 too (use when the text hides inside a binary field). Use from a GSAP onUpdate. */
export function scrambleAt(text: string, p: number, { chars = '01', flicker = 40, keepSpaces = true }: { chars?: string; flicker?: number; keepSpaces?: boolean } = {}): string {
  const total = text.length;
  const locked = Math.floor(Math.min(1, Math.max(0, p)) * total);
  const step = Math.floor(p * flicker);
  let out = '';
  for (let i = 0; i < total; i++) {
    const ch = text[i];
    if (i < locked || (keepSpaces && ch === ' ')) { out += ch; continue; }
    const h = Math.imul(i * 374761393 + step * 668265263, 1274126177) >>> 0;
    out += chars[h % chars.length];
  }
  return out;
}
