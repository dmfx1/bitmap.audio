/* src/lib/pixel-veil.ts
 *
 * Dependency-free DOM helpers shared by the scene-stage pages and <CtaScene>:
 *
 *   fillPixelVeil      — fills a .scene-veil with a grid of large cells, each tagged with a random
 *                        reveal order (--o). A page reveals it by tweening `--reveal` 0 → 1
 *                        (styling in global.css: `.scene-veil > i`).
 *   initMobileSceneReveal — MOBILE-only subtle rise/fade of each unstacked .scene in #stage-track
 *                        as it enters (desktop uses the GSAP stage). Progressive enhancement:
 *                        without JS nothing is hidden.
 */

export const VEIL_CELL = 54;

/** Fill `veil` with cols×rows cells covering a `w`×`h` box, in random reveal order. */
export function fillPixelVeil(veil: HTMLElement, w: number, h: number, cell = VEIL_CELL): void {
  const cols = Math.max(1, Math.ceil(w / cell));
  const rows = Math.max(1, Math.ceil(h / cell));
  const n = cols * rows;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
  veil.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  veil.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) { const c = document.createElement('i'); c.style.setProperty('--o', (order[i] / n).toFixed(4)); frag.appendChild(c); }
  veil.replaceChildren(frag);
}

/** MOBILE-only: reveal each unstacked scene of #stage-track as it scrolls into view. */
export function initMobileSceneReveal(): void {
  if (!window.matchMedia('(max-width: 767px)').matches) return;
  const track = document.getElementById('stage-track');
  if (!track || track.dataset.mobInit === '1') return;
  track.dataset.mobInit = '1';
  track.classList.add('mob-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  track.querySelectorAll('.scene').forEach((s) => io.observe(s));
}
