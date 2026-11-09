/* src/lib/scenes/process-words.ts
 *
 * Desktop choreography for <ProcessWords> (all scrubbed, so it reverses):
 *   step 00 is already showing when the section arrives (resolved text + its background)
 *   swaps — after a hold, number / title / line scramble OUT to binary and INTO the next step
 *           (scrambleSwap), the pixel icon wipes out and the next wipes in, and the section background
 *           cross-fades to that step's gradient
 *   foot  — after the last step, the footer fades up
 * Backgrounds: one full-scene layer per step (gradients can't tween), prepended to the scene like
 * ServicePillars' "What we do" layers — but scrubbed here, not timed.
 * Mobile never calls this (the static stacked list shows instead).
 *
 *   buildProcessWordsScene(tl, scene, opts)   adds the sequence to `tl` at its current end.
 */
import { gsap } from 'gsap';
import { scrambleSwap } from '../scene-kit';

export type ProcessWordsOpts = {
  hold?: number;  // [scroll units] readable hold on each step
  swap?: number;  // [scroll units] scramble out → into the next step (+ background change)
  foot?: number;  // [scroll units] footer fade up
  end?: number;   // [scroll units] final hold
};
type Step = { n: string; name: string; line: string };

export function buildProcessWordsScene(tl: gsap.core.Timeline, scene: HTMLElement, opts: ProcessWordsOpts = {}): void {
  const O = { hold: 0.5, swap: 0.45, foot: 0.3, end: 0.45, ...opts };
  const root = scene.querySelector<HTMLElement>('[data-pw]');
  if (!root) return;
  const steps: Step[] = JSON.parse(root.dataset.steps || '[]');
  const bgs: string[] = JSON.parse(root.dataset.bgs || '[]');
  if (!steps.length) return;
  const nEl = root.querySelector<HTMLElement>('[data-pw-n]')!;
  const tEl = root.querySelector<HTMLElement>('[data-pw-title]')!;
  const lEl = root.querySelector<HTMLElement>('[data-pw-line]')!;
  const foot = scene.querySelector<HTMLElement>('[data-pw-foot]');
  const iconEl = root.querySelector<HTMLElement>('[data-pw-icon]');
  const icons: string[] = JSON.parse(root.dataset.icons || '[]');
  const iconNames: string[] = JSON.parse(root.dataset.iconNames || '[]');
  let shownIcon = 0;
  const ICON_STEPS = 6;
  const stepped = (q: number) => Math.floor(Math.min(1, Math.max(0, q)) * ICON_STEPS + 1e-6) / ICON_STEPS;
  const parts: [HTMLElement, keyof Step][] = [[nEl, 'n'], [tEl, 'name'], [lEl, 'line']];

  // Background layers — layer 0 visible from the start (step 00), the rest fade in over it in turn.
  const layers = bgs.map((bg, i) => {
    const d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = `position:absolute;inset:0;z-index:-2;pointer-events:none;background-image:${bg};opacity:${i === 0 ? 1 : 0}`;
    return d;
  });
  // prepend in reverse so layer 0 sits at the back and later steps stack on top
  [...layers].reverse().forEach((d) => scene.prepend(d));

  tl.to({}, { duration: O.hold });   // step 00 — already showing

  for (let i = 0; i < steps.length - 1; i++) {
    const s = { p: 0 };
    const from = steps[i], to = steps[i + 1];
    const render = () => {
      parts.forEach(([el, k]) => {
        el.textContent = scrambleSwap(from[k], to[k], s.p);
        el.classList.toggle('is-binary', s.p > 0 && s.p < 1);
      });
      // icon: wipes OUT over the first half, the next one wipes IN (top → down) over the second, in pixel steps
      if (iconEl) {
        const want = s.p < 0.5 ? i : i + 1;
        if (want !== shownIcon) {
          iconEl.innerHTML = icons[want] || '';
          iconNames.forEach((nm) => nm && iconEl.classList.remove('pw__icon--' + nm));   // sizing follows the icon
          if (iconNames[want]) iconEl.classList.add('pw__icon--' + iconNames[want]);
          shownIcon = want;
        }
        const vis = s.p < 0.5 ? stepped(1 - s.p * 2) : stepped(s.p * 2 - 1);
        iconEl.style.clipPath = `inset(0 0 ${((1 - vis) * 100).toFixed(2)}% 0)`;
      }
    };
    tl.to(s, { p: 1, ease: 'none', duration: O.swap, onUpdate: render });
    if (layers[i + 1]) tl.to(layers[i + 1], { opacity: 1, ease: 'none', duration: O.swap }, '<');
    tl.to({}, { duration: O.hold });
  }

  if (foot) {
    gsap.set(foot, { autoAlpha: 0 });
    tl.to(foot, { autoAlpha: 1, ease: 'none', duration: O.foot });
  }
  tl.to({}, { duration: O.end });
}
