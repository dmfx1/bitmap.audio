/* src/lib/scenes/binary-field.ts
 *
 * "Listening between the lines" — the binary field used by <BinaryField>.
 *
 *   initBinaryField()            builds the digits for every [data-bin-field] (ALL widths — on mobile the
 *                                field is static, fully revealed + the phrase resolved). Call once on load,
 *                                BEFORE the page builds its timeline.
 *   createBinaryFieldScene(el)   desktop controller for the field inside `el`:
 *                                  cascade()   TRIGGERED: columns pour down from the top at random speeds
 *                                  fadeAway()  TRIGGERED: the whole field fades (no movement)
 *                                  decode(tl, duration)  SCRUBBED: adds the phrase scramble to `tl`
 *                                The page decides WHEN (and in which scroll direction) to call each.
 *
 * The field is built a little larger than the SCREEN (not the window), for the smallest font the CSS
 * clamp allows, and centred — so it covers any resize without rebuilding and the phrase stays centred.
 * Scramble text comes from scrambleAt() (scroll-reversible counterpart of scrambleIn) in scene-kit.ts.
 */
import { gsap } from 'gsap';
import { scrambleAt } from '../scene-kit';

type FieldData = { cols: HTMLElement[]; phrase: HTMLElement[]; text: string; rows: number };
const built = new WeakMap<HTMLElement, FieldData>();

export function initBinaryField(): void {
  document.querySelectorAll<HTMLElement>('[data-bin-field]').forEach((field) => {
    if (built.has(field)) return;
    const text = field.dataset.phrase || 'listening between the lines';
    const accentRatio = parseFloat(field.dataset.accentRatio ?? '0.04') || 0;
    const mobile = !window.matchMedia('(min-width: 768px)').matches;
    // Measure one digit at the SMALLEST size the CSS clamp allows, so the grid always covers the screen.
    const probe = document.createElement('span');
    probe.textContent = '0';
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;line-height:1.2;font-size:' + (mobile ? '12px' : '3rem');
    field.appendChild(probe);
    const cw = probe.getBoundingClientRect().width || 14;
    const lh = probe.getBoundingClientRect().height || (cw / 0.6) * 1.2;
    probe.remove();
    const W = Math.max(window.screen?.width || 0, window.innerWidth) + 4 * cw;
    const H = Math.max(window.screen?.height || 0, window.innerHeight) + 2 * lh;
    let cols = Math.ceil(W / cw); if ((cols - text.length) % 2) cols++;   // even margins either side
    let rows = Math.ceil(H / lh); if (rows % 2 === 0) rows++;               // a true centre row
    const midRow = (rows - 1) / 2, startCol = (cols - text.length) / 2;
    const phrase: HTMLElement[] = [];
    const colEls: HTMLElement[] = [];
    const bit = () => (Math.random() > 0.5 ? '1' : '0');
    const frag = document.createDocumentFragment();
    for (let c = 0; c < cols; c++) {
      const col = document.createElement('div');
      col.className = 'bin-col';
      for (let r = 0; r < rows; r++) {
        if (r > 0) col.appendChild(document.createTextNode('\n'));
        const pi = c - startCol;
        if (r === midRow && pi >= 0 && pi < text.length) {
          const s = document.createElement('span');
          s.className = 'ph' + (mobile ? ' on' : '');
          s.textContent = mobile ? text[pi] : bit();
          phrase[pi] = s; col.appendChild(s);
        } else if (Math.random() < accentRatio) {
          const s = document.createElement('span');
          s.className = 'acc'; s.textContent = bit();
          col.appendChild(s);
        } else {
          col.appendChild(document.createTextNode(bit()));
        }
      }
      colEls.push(col); frag.appendChild(col);
    }
    field.appendChild(frag);
    built.set(field, { cols: colEls, phrase, text, rows });
  });
}

export type BinaryFieldOpts = {
  cascadeMin?: number;     // [s] fastest column
  cascadeMax?: number;     // [s] slowest column
  cascadeStagger?: number; // [s] max random start delay per column
  fadeOut?: number;        // [s] field fades away
};

export function createBinaryFieldScene(scene: HTMLElement, opts: BinaryFieldOpts = {}) {
  const O = { cascadeMin: 0.55, cascadeMax: 1.3, cascadeStagger: 0.35, fadeOut: 0.6, ...opts };
  const field = scene.querySelector<HTMLElement>('[data-bin-field]');
  const F = field ? built.get(field) : undefined;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sc = { p: 0 };
  let fieldReady = false;   // the phrase stays binary until the cascade has filled the screen

  const render = () => {
    if (!F || !field) return;
    const eff = fieldReady ? sc.p : 0;
    const str = scrambleAt(F.text, eff, { keepSpaces: false });
    const locked = Math.floor(Math.min(1, Math.max(0, eff)) * F.text.length);
    F.phrase.forEach((el, i) => { el.textContent = str[i]; el.classList.toggle('on', i < locked); });
    // the surrounding digits recede as the phrase resolves
    field.style.setProperty('--digit-a', (0.55 - 0.3 * eff).toFixed(3));
    field.style.setProperty('--acc-a', (1 - 0.4 * eff).toFixed(3));
  };

  const cascade = () => {
    if (!F || !field) return;
    fieldReady = false; render();
    gsap.killTweensOf([field, ...F.cols]);
    gsap.set(field, { opacity: 1 });
    let longest = 0;
    F.cols.forEach((c) => {
      const dur = reduce ? 0 : gsap.utils.random(O.cascadeMin, O.cascadeMax);
      const delay = reduce ? 0 : gsap.utils.random(0, O.cascadeStagger);
      longest = Math.max(longest, dur + delay);
      gsap.fromTo(c, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: dur, delay, ease: 'steps(' + F.rows + ')' });
    });
    gsap.delayedCall(longest, () => { fieldReady = true; render(); });
  };

  const fadeAway = () => {
    if (!F || !field) return;
    gsap.killTweensOf([field, ...F.cols]);
    gsap.to(field, { opacity: 0, duration: reduce ? 0 : O.fadeOut, ease: 'power1.out' });
  };

  /** Adds the scrubbed phrase scramble (binary → words, left → right) to `tl` at its current end. */
  const decode = (tl: gsap.core.Timeline, duration: number) =>
    tl.to(sc, { p: 1, ease: 'none', duration, onUpdate: render });

  render();
  return { cascade, fadeAway, decode };
}
