/* src/lib/scenes/stage.ts
 *
 * REUSABLE SCENE-STAGE ENGINE — the generalised, proppable version of about-v3's "in-situ" stage.
 * A single pinned frame holds a deck of full-viewport LAYERS stacked on top of each other; scroll
 * drives ONE master timeline that cross-fades from one layer to the next IN PLACE — no vertical or
 * horizontal translation of content, so the page never looks like it's scrolling until the stage
 * releases into the footer at the end of the track.
 *
 * This is the shared core behind <SceneStage>/<SceneLayer>. about-v3.astro keeps its own bespoke
 * script (the fog / void / portal intro is about-specific) and is the BLUEPRINT this generalises —
 * do not couple the two; port pages onto THIS engine.
 *
 * Markup contract (emitted by the .astro components):
 *   <div data-scene-stage style="height:<trackVh>vh">        // the scroll track = scrub distance
 *     <div data-scene-pin>                                    // position: sticky stage
 *       [<div data-scene-bar><span data-scene-bar-label/></div>]   // optional persistent solaris bar
 *       <div data-scene-layer data-label data-hold data-builder ...>…</div>  // layer 0 (visible at rest)
 *       <div data-scene-layer …>…</div>                        // layer 1..n (cross-faded in)
 *     </div>
 *   </div>
 *
 * Per-layer data attributes (all optional except the layer marker):
 *   data-label      — persistent-bar label shown while this layer is active (scrambles in)
 *   data-hold       — timeline units to dwell on this layer after it arrives (default 1)
 *   data-builder    — id of a GSAP choreography to nest here (see BUILDERS below), e.g. "philosophy"
 *   data-bar-bg / data-bar-text / data-bar-glow — override the bar's look for this layer
 *
 * Cross-fades use autoAlpha (opacity + visibility) so a faded-out layer goes visibility:hidden and
 * stops intercepting the pointer — the VISIBLE layer's own cursor/theme wins (the about-v3 lesson).
 *
 * Desktop only. On mobile the layers flatten to a normal vertical stack via the components' CSS and
 * this engine early-returns (no GSAP), matching about-v3.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleIn } from '../scene-kit';
import { buildPhilosophyScene } from './philosophy';

gsap.registerPlugin(ScrollTrigger);

type BarCfg = { name: string; bg?: string; text?: string; glow?: string };
type Builder = (tl: gsap.core.Timeline, stage: HTMLElement) => void;

/** GSAP scene choreographies addressable from a layer via data-builder="<id>".
 *  Add extracted scenes here as they're generalised (each takes (timeline, layerEl)). */
const BUILDERS: Record<string, Builder> = {
  philosophy: buildPhilosophyScene,
};

/** How long (timeline units) each layer→layer cross-fade lasts. 1 unit ≈ 1 viewport of scroll. */
const CROSS = 0.9;

export function initSceneStages(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLElement>('[data-scene-stage]').forEach(initOne);
}

function initOne(track: HTMLElement): void {
  if (track.dataset.init === '1') return;
  const pin = track.querySelector<HTMLElement>('[data-scene-pin]');
  if (!pin) return;
  // Desktop only — mobile flattens via CSS and runs no GSAP (about-v3 parity).
  if (!window.matchMedia('(min-width: 768px)').matches) return;
  track.dataset.init = '1';

  const layers = Array.from(pin.querySelectorAll<HTMLElement>('[data-scene-layer]'));
  if (layers.length < 2) return; // nothing to cross-fade

  // ── Persistent bar (optional) ──
  const bar = pin.querySelector<HTMLElement>('[data-scene-bar]');
  const label = bar?.querySelector<HTMLElement>('[data-scene-bar-label]') ?? null;
  const DEFAULT_BG = 'linear-gradient(90deg, var(--solaris-from) 0%, var(--solaris-mid) 55%, var(--solaris-to) 100%)';
  const DEFAULT_GLOW = 'var(--solaris-glow)';
  let current = '';
  const setBar = (s: BarCfg) => {
    if (!bar || !label || !s.name || s.name === current) return;
    current = s.name;
    bar.style.opacity = '1';        // reveal the whole bar (hidden over the hero / void)
    label.style.opacity = '1';
    label.style.color = s.text ?? '';
    bar.style.background = s.bg ?? DEFAULT_BG;
    bar.style.boxShadow = s.glow ?? DEFAULT_GLOW;
    scrambleIn(label, s.name, { duration: 650 });
  };
  const clearBar = () => { if (bar && label) { current = ''; bar.style.opacity = '0'; label.style.opacity = '0'; } };
  const cfgOf = (el: HTMLElement): BarCfg => ({
    name: el.dataset.label || '',
    bg: el.dataset.barBg || undefined,
    text: el.dataset.barText || undefined,
    glow: el.dataset.barGlow || undefined,
  });
  const holdOf = (el: HTMLElement) => parseFloat(el.dataset.hold || '1');

  // ── Optional "enter the void" intro (data-void on the stage). The hero holds while its copy
  //    recedes (useHeroSquish, anchored to the pin's #hero-sticky), the binary rain (#grid-bg) rushes
  //    toward the screen (accelerating zoom), a soft portal blooms from centre, and a beige fog takes
  //    over — then the first content layer fades in THROUGH the fog. Verbatim tweens from about-v3. ──
  const isVoid = track.hasAttribute('data-void');
  const fog = pin.querySelector<HTMLElement>('[data-scene-fog]');
  const portal = pin.querySelector<HTMLElement>('[data-scene-portal]');
  const gridBg = document.getElementById('grid-bg');
  const V = { heroHold: 0.8, fogStart: 0.8, fogDur: 1.0, portalStart: 0.5, voidScale: 3.0 };
  const voidReady = isVoid && !!fog && !!portal;
  if (voidReady) {
    gsap.set(fog!, { opacity: 0 });
    gsap.set(portal!, { opacity: 0, scale: 0.3, transformOrigin: '50% 45%' });
  }

  // ── Initial state: first layer visible, the rest hidden (autoAlpha → visibility:hidden). ──
  layers.forEach((l, i) => { if (i > 0) gsap.set(l, { autoAlpha: 0 }); });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track, start: 'top top', end: 'bottom bottom',
      scrub: 0.6, invalidateOnRefresh: true,
    },
  });

  // Direction-aware bar label at a boundary: scrolling DOWN shows the layer we're entering; scrolling
  // UP shows the layer we're re-entering from its end — so the label always names the CURRENT layer.
  const boundary = (pos: number | string, down: BarCfg | null, up: BarCfg | null) => tl.call(() => {
    const dir = tl.scrollTrigger ? tl.scrollTrigger.direction : 1;
    const cfg = dir === 1 ? down : up;
    if (cfg && cfg.name) setBar(cfg); else clearBar();
  }, [], pos);

  // Layer 0 (the hero) sets the bar first — usually no label, so the bar stays hidden over the hero.
  boundary(0.001, cfgOf(layers[0]), null);
  if (!voidReady) tl.to({}, { duration: holdOf(layers[0]) });

  for (let i = 1; i < layers.length; i++) {
    const prev = layers[i - 1];
    const cur = layers[i];

    if (i === 1 && voidReady) {
      // First transition IS the void intro (hero → first content, through the fog).
      tl.addLabel('void');
      tl.to({}, { duration: V.heroHold }, 'void');                                              // hero-hold runway (squish rides this)
      if (gridBg) tl.fromTo(gridBg, { scale: 1 }, { scale: V.voidScale, ease: 'power2.in', duration: V.fogStart + V.fogDur }, 'void');
      tl.fromTo(portal!, { opacity: 0, scale: 0.3 }, { opacity: 0.7, scale: 2.0, ease: 'power2.in', duration: V.fogDur + 0.3 }, 'void+=' + V.portalStart);
      tl.to(portal!, { opacity: 0, ease: 'power1.out', duration: 0.5 }, 'void+=' + (V.fogStart + V.fogDur));
      tl.to(fog!, { opacity: 1, ease: 'none', duration: V.fogDur }, 'void+=' + V.fogStart);
      tl.to(cur, { autoAlpha: 1, ease: 'none', duration: 0.9 }, 'void+=' + (V.fogStart + V.fogDur));
      boundary('void+=' + (V.fogStart + V.fogDur), cfgOf(cur), null);                           // up → clear (back into the void/hero)
    } else {
      const at = 'layer' + i;
      tl.addLabel(at, '>');
      tl.to(prev, { autoAlpha: 0, ease: 'none', duration: CROSS }, at)
        .to(cur, { autoAlpha: 1, ease: 'none', duration: CROSS }, at);
      boundary(at, cfgOf(cur), cfgOf(prev));
    }

    // Optional nested GSAP choreography (e.g. philosophy) — added DIRECTLY to the master timeline so
    // it stays scrubbed by scroll (a separate gsap.timeline() would auto-play on its own clock).
    const b = cur.dataset.builder;
    if (b && BUILDERS[b]) BUILDERS[b](tl, cur);

    tl.to({}, { duration: holdOf(cur) }); // dwell on this layer
  }
  // End of track → the pin releases and the stage scrolls up into the footer (vertical scroll is
  // fine from here — it's the intended hand-off).

  // Re-measure after font swap settles metrics (returns2 / about-v3 lesson).
  const fonts = (document as any).fonts;
  if (fonts?.ready) fonts.ready.then(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', initSceneStages);
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') initSceneStages();
  else window.addEventListener('load', initSceneStages);
}
