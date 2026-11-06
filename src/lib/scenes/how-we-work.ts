/* src/lib/scenes/how-we-work.ts
 *
 * Desktop choreography for <HowWeWork>: a scroll-BUILT sequence (all scrubbed, so it reverses).
 * Per card, ALL AT ONCE over one stretch of scroll (one progress value drives everything):
 *   - the pixel icon reveals top→down in steps
 *   - the text scrambles in from binary (scrambleAt)
 *   - the teal "level meter" rises from the bottom in steps; every [data-lit] element gets .is-lit the
 *     moment the teal reaches its middle (deep cards style that as light text)
 *   - at the end the card gets .is-on (solaris border)
 * then the chevron after it fills teal, pixel-row by pixel-row. Finally the footer fades up.
 * Mobile never calls this — the markup is already resolved + static.
 *
 *   buildHowWeWorkScene(tl, scene, opts)   adds the sequence to `tl` at its current end.
 */
import { gsap } from 'gsap';
import { scrambleAt } from '../scene-kit';

export type HowOpts = {
  card?: number;     // [scroll units] per card: icon + scramble + meter together
  chevron?: number;  // [scroll units] per chevron fill
  foot?: number;     // [scroll units] footer fade up
  hold?: number;     // [scroll units] readable hold at the end
};

const METER_STEPS = 8, ICON_STEPS = 6;
const stepped = (p: number, n: number) => Math.floor(Math.min(1, Math.max(0, p)) * n + 1e-6) / n;

export function buildHowWeWorkScene(tl: gsap.core.Timeline, scene: HTMLElement, opts: HowOpts = {}): void {
  const O = { card: 0.45, chevron: 0.2, foot: 0.3, hold: 0.45, ...opts };
  const cards = Array.from(scene.querySelectorAll<HTMLElement>('[data-how-card]'));
  const chevs = Array.from(scene.querySelectorAll<HTMLElement>('[data-how-chev] [data-chev-fill]'));
  const foot = scene.querySelector<HTMLElement>('[data-how-foot]');

  cards.forEach((card, i) => {
    const icon = card.querySelector<HTMLElement>('[data-how-icon]');
    const meter = card.querySelector<HTMLElement>('[data-how-meter]');
    const lit = Array.from(card.querySelectorAll<HTMLElement>('[data-lit]'));
    const els = Array.from(card.querySelectorAll<HTMLElement>('[data-scramble]'));
    const texts = els.map((el) => el.textContent || '');
    const st = { p: 0 };

    // Where each [data-lit] element's middle sits, as a fraction of the card height from the BOTTOM.
    // Measured lazily (layout is final by the time anyone scrolls here) and re-measured on resize.
    let marks: number[] | null = null;
    const measure = () => {
      const r = card.getBoundingClientRect();
      marks = lit.map((el) => {
        const e = el.getBoundingClientRect();
        return r.height ? (r.bottom - (e.top + e.height / 2)) / r.height : 1;
      });
    };
    window.addEventListener('resize', () => { marks = null; }, { passive: true });

    const render = () => {
      const p = st.p;
      els.forEach((el, k) => {
        el.textContent = scrambleAt(texts[k], p);
        el.classList.toggle('is-binary', p < 1);
      });
      const level = stepped(p, METER_STEPS);
      if (meter) meter.style.clipPath = `inset(${((1 - level) * 100).toFixed(2)}% 0 0 0)`;
      if (icon) icon.style.clipPath = `inset(0 0 ${((1 - stepped(p, ICON_STEPS)) * 100).toFixed(2)}% 0)`;
      if (!marks && p > 0) measure();
      lit.forEach((el, k) => el.classList.toggle('is-lit', !!marks && level > 0 && level >= marks[k]));
      card.classList.toggle('is-on', p >= 1);
    };
    render();   // start empty: binary text, no meter, no icon
    tl.to(st, { p: 1, ease: 'none', duration: O.card, onUpdate: render });

    const chev = chevs[i];
    if (chev) {
      tl.fromTo(chev, { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', ease: 'steps(9)', duration: O.chevron, immediateRender: false });
    }
  });

  if (foot) {
    gsap.set(foot, { autoAlpha: 0 });
    tl.to(foot, { autoAlpha: 1, ease: 'none', duration: O.foot });
  }
  tl.to({}, { duration: O.hold });
}
