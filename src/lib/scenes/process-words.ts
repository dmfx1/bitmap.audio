/* src/lib/scenes/process-words.ts
 *
 * Desktop choreography for <ProcessWords> (all scrubbed, so it reverses):
 *   in      — number / title / line scramble in from binary to step 0
 *   swaps   — after a hold, each scrambles OUT to binary and INTO the next step (scrambleSwap)
 *   foot    — after the last step, the footer fades up
 * Mobile never calls this (the static stacked list shows instead).
 *
 *   buildProcessWordsScene(tl, scene, opts)   adds the sequence to `tl` at its current end.
 */
import { gsap } from 'gsap';
import { scrambleAt, scrambleSwap } from '../scene-kit';

export type ProcessWordsOpts = {
  in?: number;    // [scroll units] first step scrambles in
  hold?: number;  // [scroll units] readable hold on each step
  swap?: number;  // [scroll units] scramble out → into the next step
  foot?: number;  // [scroll units] footer fade up
  end?: number;   // [scroll units] final hold
};
type Step = { n: string; name: string; line: string };

export function buildProcessWordsScene(tl: gsap.core.Timeline, scene: HTMLElement, opts: ProcessWordsOpts = {}): void {
  const O = { in: 0.4, hold: 0.5, swap: 0.45, foot: 0.3, end: 0.45, ...opts };
  const root = scene.querySelector<HTMLElement>('[data-pw]');
  if (!root) return;
  const steps: Step[] = JSON.parse(root.dataset.steps || '[]');
  if (!steps.length) return;
  const nEl = root.querySelector<HTMLElement>('[data-pw-n]')!;
  const tEl = root.querySelector<HTMLElement>('[data-pw-title]')!;
  const lEl = root.querySelector<HTMLElement>('[data-pw-line]')!;
  const foot = scene.querySelector<HTMLElement>('[data-pw-foot]');
  const parts: [HTMLElement, keyof Step][] = [[nEl, 'n'], [tEl, 'name'], [lEl, 'line']];

  // IN: binary → step 0
  const a = { p: 0 };
  const renderIn = () => parts.forEach(([el, k]) => {
    el.textContent = scrambleAt(steps[0][k], a.p);
    el.classList.toggle('is-binary', a.p < 1);
  });
  renderIn();
  tl.to(a, { p: 1, ease: 'none', duration: O.in, onUpdate: renderIn });
  tl.to({}, { duration: O.hold });

  // SWAPS: step i → step i+1
  for (let i = 0; i < steps.length - 1; i++) {
    const s = { p: 0 };
    const from = steps[i], to = steps[i + 1];
    const render = () => parts.forEach(([el, k]) => {
      el.textContent = scrambleSwap(from[k], to[k], s.p);
      el.classList.toggle('is-binary', s.p > 0 && s.p < 1);
    });
    tl.to(s, { p: 1, ease: 'none', duration: O.swap, onUpdate: render });
    tl.to({}, { duration: O.hold });
  }

  if (foot) {
    gsap.set(foot, { autoAlpha: 0 });
    tl.to(foot, { autoAlpha: 1, ease: 'none', duration: O.foot });
  }
  tl.to({}, { duration: O.end });
}
