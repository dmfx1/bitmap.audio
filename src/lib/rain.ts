/* src/lib/rain.ts — ONE binary rain, dark or oat.
 *
 * Same structure as the page rain in GridBackground.astro: a .binary-waterfall container (centre-dim mask)
 * holding two parallax layers — .layer-deep (small, 0.1× scroll) and .layer-near (large, 0.3× scroll).
 * The tone only changes colour: .rain--oat inverts the white glyphs to dark ink.
 * MOTION is NOT here: GridBackground's scroll loop moves EVERY .layer-deep / .layer-near on the page with
 * transforms (GPU, no repaint), so any rain built with this stays in step with the page rain.
 *
 *   mountRain(el, 'oat')                      — add a rain to one element (first child, behind its content)
 *   mountSceneRain(root)                      — every .scene in root (except .no-rain), tone from .theme-oat
 *   <Rain tone="oat" /> (Rain.astro)          — the same markup, server-rendered
 */
export type RainTone = 'dark' | 'oat';

export function rainElement(tone: RainTone): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = `binary-waterfall rain rain--${tone}`;
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<div class="binary-layer layer-deep"></div><div class="binary-layer layer-near"></div>';
  return wrap;
}

export function mountRain(el: HTMLElement, tone: RainTone) {
  if (el.querySelector(':scope > .rain')) return;
  el.classList.add('has-rain');
  el.prepend(rainElement(tone));
}

export function mountSceneRain(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-rain-all] .scene:not(.no-rain)').forEach((s) =>
    mountRain(s, s.classList.contains('theme-oat') ? 'oat' : 'dark'));
}
