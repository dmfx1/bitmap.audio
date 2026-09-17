/* src/lib/scenes/pixel-journey.ts
 *
 * returns2 (Why/ROI) scene engine.
 *
 * PIXEL JOURNEY (the hero pixel + behaviour toolkit + the bitmap-'b' trace) is PAUSED — we're
 * circling back to animation later. That code lives in git history; this module currently builds
 * the three PARALLAX PLACEHOLDER LAYERS that sit behind the (transparent) content, giving the
 * horizontal scroll some depth/texture while there's no scene art:
 *
 *   bg-3  bitmap dot grid            — slowest (furthest back)
 *   bg-2  blurred, sparse large pixels at two depths
 *   bg-1  sharp binary-rain field    — fastest (nearest)
 *
 * Parallax is horizontal (background-position), driven by scroll. Desktop only (returns2 calls this
 * after its isMobile early-return). Also drives the small dev scroll HUD (#pj-hud).
 */
import { gsap } from 'gsap';

export interface JourneyCtx {
  ScrollTrigger: any;
  stage: HTMLElement;                         // the fixed #pixel-journey overlay
  strip: HTMLElement;                         // #horizontal-strip
  track: HTMLElement;                         // #scroll-track
  getScrollPos: (x: number) => number;        // strip-x → document scroll px
  anchorCenter: (sec: HTMLElement) => number; // strip-x at which a section is centred
}

export function buildJourney(ctx: JourneyCtx): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { stage, strip, track, ScrollTrigger } = ctx;
  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const maxScroll = () => track.offsetHeight - vh();
  const fracX = (x: number) => gsap.utils.clamp(0, 1, ctx.getScrollPos(x) / maxScroll());
  const secFrac = (id: string) => {
    const s = strip.querySelector(`[data-slide="${id}"]`) as HTMLElement | null;
    return s ? fracX(ctx.anchorCenter(s)) : null;
  };

  const sticky = stage.parentElement;
  if (!sticky) return;

  // ── PARALLAX PLACEHOLDER LAYERS (behind the transparent content) ───────────────
  const box = document.createElement('div');
  box.id = 'journey-parallax';
  Object.assign(box.style, { position: 'absolute', inset: '0', zIndex: '0', pointerEvents: 'none', overflow: 'hidden' });
  sticky.insertBefore(box, sticky.firstChild);
  strip.style.position = 'relative';
  if (!strip.style.zIndex) strip.style.zIndex = '10';

  const uri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const layer = (z: number, opacity: number, css: string) => {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:${z};opacity:${opacity};` + css;
    box.appendChild(el);
    return el;
  };

  // Blurred large-pixel tile (blur BAKED into the SVG — cheaper than a CSS filter on a scrolling layer).
  const bigTile = (size: number, n: number, s0: number, s1: number, blur: number) => {
    let rects = '';
    for (let i = 0; i < n; i++) {
      const s = Math.round(s0 + Math.random() * (s1 - s0));
      const x = Math.round(Math.random() * (size - s));
      const y = Math.round(Math.random() * (size - s));
      rects += `<rect x='${x}' y='${y}' width='${s}' height='${s}' fill='hsl(0,0%,88%)'/>`;
    }
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><defs><filter id='b' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='${blur}'/></filter></defs><g filter='url(#b)'>${rects}</g></svg>`;
  };

  // bg-3 — FAR BACKGROUND: huge, very blurry, sparse pixels drifting slowly (replaces the grid) to
  // seat the parallax with something deep and soft behind everything.
  const bigFarthest = layer(0, 0.035, `background-image:${uri(bigTile(2400, 2, 320, 560, 30))};background-size:2400px 2400px;`);

  // bg-2 — sparse blurred LARGE pixels across three nearer depths; distinct sizes/blur/rate give
  // clear movement between the depths. All faded well back so the CONTENT stays king.
  const bigFar = layer(1, 0.04, `background-image:${uri(bigTile(1500, 2, 110, 230, 13))};background-size:1500px 1500px;`);
  const bigMid = layer(1, 0.05, `background-image:${uri(bigTile(1050, 2, 70, 150, 8))};background-size:1050px 1050px;`);
  const bigNear = layer(1, 0.06, `background-image:${uri(bigTile(720, 1, 50, 100, 4))};background-size:720px 720px;`);

  // bg-1 — sharp binary field, SPLIT across two layers so the 0s and 1s drift past each other. Each
  // is a sparse, randomly-scattered tile (few streams, well spaced) of ONE digit + the occasional
  // pixel HEART (matching the home-page binary rain). Two layers × two rates = the interplay.
  const binTile = (digit: string, size: number, glyph: number, n: number) => {
    let t = '';
    for (let i = 0; i < n; i++) {
      const x = Math.round(Math.random() * (size - glyph));
      const y = Math.round(glyph + Math.random() * (size - glyph));
      const op = (0.35 + Math.random() * 0.6).toFixed(2);
      t += `<text x='${x}' y='${y}' font-family='monospace' font-size='${glyph}' fill='hsl(0,0%,92%)' fill-opacity='${op}'>${digit}</text>`;
    }
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${t}</svg>`;
  };
  // Binary rain split across FIVE depth bands (far→near: tiny+faint+slow → big+brighter+fast), digits
  // alternating so 0s and 1s drift past each other at every depth — a bitmap "night sky".
  const binCfg = [
    { digit: '1', size: 660, glyph: 9,  n: 15, op: 0.05, rate: 0.10 },
    { digit: '0', size: 620, glyph: 10, n: 16, op: 0.07, rate: 0.20 },
    { digit: '1', size: 580, glyph: 9,  n: 17, op: 0.09, rate: 0.33 }, // layer 3 (back) — smaller
    { digit: '0', size: 540, glyph: 11, n: 16, op: 0.11, rate: 0.48 }, // layer 2 (mid)  — smaller
    { digit: '1', size: 500, glyph: 17, n: 13, op: 0.13, rate: 0.95 }, // layer 1 (front) — quicker
  ];
  const binParts = binCfg.map((c) => ({
    el: layer(2, c.op, `background-image:${uri(binTile(c.digit, c.size, c.glyph, c.n))};background-size:${c.size}px ${c.size}px;`),
    rate: c.rate,
  }));

  // Twinkling pixel-HEARTS starfield (matching the home binary-rain heart) — they PARALLAX-scroll
  // slowly (distant) AND twinkle WITH scroll: each heart's opacity is a function of scroll progress,
  // so they shimmer as you move and hold when you stop. Two identical copies a tile apart wrap seamlessly.
  const HEART_RECTS = "<rect x='3' y='4' width='3' height='3'/><rect x='10' y='4' width='3' height='3'/><rect x='2' y='6' width='12' height='3'/><rect x='4' y='9' width='8' height='2'/><rect x='6' y='11' width='4' height='2'/><rect x='7' y='13' width='2' height='1'/>";
  const heartWrap = document.createElement('div');
  Object.assign(heartWrap.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '2', overflow: 'hidden' });
  box.appendChild(heartWrap);
  const heartRow = document.createElement('div');
  Object.assign(heartRow.style, { position: 'absolute', top: '0', left: '0', height: '100%', willChange: 'transform' });
  heartWrap.appendChild(heartRow);
  const tileW = Math.max(320, window.innerWidth);
  heartRow.style.width = `${tileW * 2}px`;
  const stars = Array.from({ length: 12 }, () => ({
    x: Math.round(Math.random() * tileW), y: (Math.random() * 100).toFixed(1),
    sz: 11 + Math.round(Math.random() * 10),
    base: 0.08 + Math.random() * 0.18, amp: 0.12 + Math.random() * 0.24,
    freq: 30 + Math.random() * 55, phase: Math.random() * Math.PI * 2,
    a: null as unknown as HTMLElement, b: null as unknown as HTMLElement,
  }));
  const mkHeart = (px: number, st: typeof stars[0]) => {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;left:${px}px;top:${st.y}%;width:${st.sz}px;height:${st.sz}px;opacity:0;color:hsl(0,0%,92%);`;
    el.innerHTML = `<svg width='100%' height='100%' viewBox='0 0 16 16' fill='currentColor'>${HEART_RECTS}</svg>`;
    heartRow.appendChild(el);
    return el;
  };
  for (const st of stars) { st.a = mkHeart(st.x, st); st.b = mkHeart(st.x + tileW, st); }

  // ── DEV scroll HUD ── progress `p` (matches beat fractions) + current chapter. Remove for prod.
  const chapters = (((window as any).__SECTIONS__ as Array<{ id: string; label?: string }>) || [])
    .filter((s) => s.label)
    .map((s) => ({ id: s.id, label: s.label as string, frac: secFrac(s.id) ?? 0 }))
    .sort((a, b) => a.frac - b.frac);
  const hud = document.createElement('div');
  hud.id = 'pj-hud';
  Object.assign(hud.style, {
    position: 'fixed', bottom: '12px', left: '12px', zIndex: '100', pointerEvents: 'none',
    font: '600 12px/1.4 monospace', letterSpacing: '0.08em', color: 'hsl(var(--accent))',
    background: 'rgba(0,0,0,0.6)', padding: '5px 9px', borderRadius: '3px', whiteSpace: 'nowrap',
  });
  document.body.appendChild(hud);

  // ── CONTENT PARALLAX ── opt-in per element: tag any bit of copy with data-depth="0.12" and it gets
  // an EXTRA horizontal drift = (its slide's offset from viewport centre) × depth. So a heading and a
  // blurb on the same slide, given different depths, scroll away at different speeds (aligned when the
  // slide is centred). Reads the SLIDE's rect (not the element's) so there's no transform feedback.
  const DEPTH_MULT = 1.9; // global exaggeration of all data-depth content drift (tune here)
  const depthEls = Array.from(strip.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => {
    el.style.willChange = 'transform';
    return { el, slide: (el.closest('[data-slide]') as HTMLElement) || strip, depth: parseFloat(el.dataset.depth || '0') };
  });

  // Driver — horizontal parallax (background-position) + content drift + the HUD, on one trigger.
  const travel = () => strip.scrollWidth - vw();
  ScrollTrigger.create({
    trigger: track, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true,
    onUpdate: (self: any) => {
      const s = self.progress * travel();
      bigFarthest.style.backgroundPositionX = `${-s * 0.03}px`;
      bigFar.style.backgroundPositionX = `${-s * 0.12}px`;
      bigMid.style.backgroundPositionX = `${-s * 0.24}px`;
      bigNear.style.backgroundPositionX = `${-s * 0.42}px`;
      for (const b of binParts) b.el.style.backgroundPositionX = `${-s * b.rate}px`;
      // hearts: slow parallax (wraps at the tile) + twinkle driven by scroll progress
      heartRow.style.transform = `translate3d(${-((s * 0.1) % tileW)}px,0,0)`;
      for (const st of stars) {
        const o = gsap.utils.clamp(0.05, 0.6, st.base + st.amp * Math.sin(self.progress * st.freq + st.phase)).toFixed(3);
        st.a.style.opacity = o; st.b.style.opacity = o;
      }
      for (const d of depthEls) {
        const r = d.slide.getBoundingClientRect();
        const off = (r.left + r.width / 2) - vw() / 2;
        d.el.style.transform = `translate3d(${(off * d.depth * DEPTH_MULT).toFixed(1)}px,0,0)`;
      }
      let cur = chapters[0];
      for (const c of chapters) if (c.frac <= self.progress + 0.0005) cur = c;
      hud.textContent = `p ${self.progress.toFixed(3)}${cur ? `   ${cur.id} ${cur.label}` : ''}`;
    },
  });
}
