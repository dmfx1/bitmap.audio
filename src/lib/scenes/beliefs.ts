/* src/lib/scenes/beliefs.ts
 *
 * Focus cycle for <Beliefs> (desktop): while the scene is visible, each column in turn scales up and its
 * number + title go solaris while its bitmap loading bar fills; hover takes over. Same feel as the old
 * About "values" columns (moved here from about.astro, 2026-11-09). Not scroll-scrubbed — it runs on its
 * own clock and only advances while the scene is showing.
 */
import { gsap } from 'gsap';

export function initBeliefsFocus(scene: HTMLElement, opts: { scale?: number; dull?: number; interval?: number } = {}) {
  const { scale = 1.18, dull = 0.28, interval = 4500 } = opts;
  const readToken = (name: string, el: Element) => {
    const raw = getComputedStyle(el).getPropertyValue(name).trim();
    return !raw ? '' : (/^#|^rgb|^hsl/.test(raw) ? raw : `hsl(${raw.split(/\s+/).join(', ')})`);
  };
  const cols = Array.from(scene.querySelectorAll<HTMLElement>('[data-vcol]'));
  if (!cols.length) return;
  const hi = cols.map((c) => c.querySelectorAll<HTMLElement>('[data-vhi]'));
  const bars = cols.map((c) => c.querySelector<HTMLElement>('[data-vprogress]'));
  const accent = readToken('--accent', scene);
  const ink = readToken('--foreground', scene);
  const DUR = 0.4;
  gsap.set(cols, { transformOrigin: '50% 50%' });
  const focus = (a: number) => {
    cols.forEach((col, i) => {
      gsap.to(col, { scale: i === a ? scale : 1, opacity: i === a ? 1 : dull, duration: DUR, ease: 'power2.out' });
      gsap.to(hi[i], { color: i === a ? accent : ink, duration: DUR });
    });
  };
  const setProg = (idx: number, p: number) => bars.forEach((b, i) => { if (b) b.style.setProperty('--progress', String(i === idx ? p : 0)); });
  focus(0); setProg(0, 0);
  let active = 0, hover: number | null = null, elapsed = 0, last: number | undefined;
  // Read the inline opacity GSAP writes (autoAlpha) rather than getComputedStyle every frame.
  const visible = () => {
    const o = scene.style.opacity;
    return parseFloat(o !== '' ? o : getComputedStyle(scene).opacity) > 0.5;
  };
  const step = (t: number) => {
    const dt = last === undefined ? 0 : t - last; last = t;
    if (hover !== null) { elapsed = 0; setProg(hover, 1); }
    else if (visible()) {
      elapsed += dt;
      const p = Math.min(1, elapsed / interval);
      setProg(active, p);
      if (p >= 1) { active = (active + 1) % cols.length; focus(active); elapsed = 0; }
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  cols.forEach((col, i) => {
    col.addEventListener('mouseenter', () => { hover = i; focus(i); });
    col.addEventListener('mouseleave', () => { hover = null; focus(active); });
  });
}
