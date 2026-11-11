/* src/lib/stage.ts
 *
 * Shared building blocks for the SCENE-STAGE pages (home.astro, about.astro). Both pages pin one
 * full-viewport stage and drive a single scrubbed GSAP timeline through stacked scene layers; this
 * module holds the parts they had copy-pasted between them:
 *
 *   createStageTimeline  — the master timeline scrubbed by #stage-track (+ the #dev-hud readout)
 *   createPageBar        — the persistent solaris #page-bar: label scramble + per-scene colours
 *   stageLabels          — direction-aware label changes at scene boundaries / cross-fades
 *   prepareVoid          — initial state for the fog + portal layers
 *   enterTheVoid         — the opening beat: hero hold, binary-rain zoom, portal bloom, beige fog
 *   pushInBar            — the bitmappy "data-load" push-down reveal of the page bar
 *
 * Every helper APPENDS to the timeline it is given; the page still authors its own scenes, holds and
 * timing knobs (`T`). Units are timeline seconds ≈ viewports of scroll. Behaviour is identical to
 * the previous inline copies — only the duplication moved.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleIn } from './scene-kit';

gsap.registerPlugin(ScrollTrigger);

type Timeline = gsap.core.Timeline;

/** One page-bar state: label text + optional background / text colour / glow overrides. */
export type BarCfg = { name: string; bg?: string; text?: string; glow?: string };

const DEFAULT_BG = 'linear-gradient(90deg, var(--solaris-from) 0%, var(--solaris-mid) 55%, var(--solaris-to) 100%)';
const DEFAULT_GLOW = 'var(--solaris-glow)';

/** The master stage timeline, scrubbed across the whole #stage-track. Feeds #dev-hud on update. */
export function createStageTimeline(track: HTMLElement): Timeline {
  const hud = document.getElementById('dev-hud');
  const tl: Timeline = gsap.timeline({
    scrollTrigger: {
      trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: () => {
        if (hud) hud.textContent = `t ${tl.time().toFixed(2)} / ${tl.duration().toFixed(1)}   p ${tl.progress().toFixed(3)}   y ${Math.round(window.scrollY)}`;
      },
    },
  });
  return tl;
}

/** Controller for the persistent solaris #page-bar. */
export function createPageBar(bar: HTMLElement) {
  const label = bar.querySelector<HTMLElement>('[data-page-label]')!;
  // Labels FADE out (and in) rather than snapping, so a cleared label never just vanishes (dom, 2026-11-10).
  label.style.transition = 'color 0.45s ease, opacity 0.35s ease';
  let current = '';
  const setBar = (s: BarCfg) => {
    if (s.name === current) return;
    current = s.name;
    label.style.opacity = '1';
    label.style.color = s.text ?? '';
    bar.style.background = s.bg ?? DEFAULT_BG;
    bar.style.boxShadow = s.glow ?? DEFAULT_GLOW;
    scrambleIn(label, s.name, { duration: 650 });
  };
  const clearBar = () => { current = ''; label.style.opacity = '0'; };
  return { setBar, clearBar };
}

/**
 * Direction-aware page-bar label changes, placed at timeline positions.
 * `crossDur` is the page's scene cross-fade duration (T.crossDur).
 */
export function stageLabels(tl: Timeline, pageBar: ReturnType<typeof createPageBar>, crossDur: number) {
  const { setBar, clearBar } = pageBar;
  const dir = () => (tl.scrollTrigger ? tl.scrollTrigger.direction : 1);

  /** At a scene boundary: scrolling DOWN sets `down`, scrolling UP sets `up` (null clears). */
  const boundary = (pos: number | string, down: BarCfg | null, up: BarCfg | null) => tl.call(() => {
    const cfg = dir() === 1 ? down : up;
    if (cfg) setBar(cfg); else clearBar();
  }, [], pos);

  /** A label change scoped to ONE scroll direction, at a specific position. */
  const atDir = (pos: number | string, d: 1 | -1, cfg: BarCfg | null) => tl.call(() => {
    if (dir() !== d) return;
    if (cfg) setBar(cfg); else clearBar();
  }, [], pos);

  // Incoming scene starts fading in once the outgoing is ~60% gone (OV); the DOWN label waits until
  // the incoming scene is in focus (buffered past the crossover).
  const OV = crossDur * 0.6;
  const DOWN_BUF = (OV + crossDur * 0.6).toFixed(3);

  /**
   * Cross-fade label. DOWN: the old label leaves WITH its scene (clears once the scene is ~60% gone), then the
   * new label scrambles in only once the incoming scene is in focus — never over the old scene.
   * UP: mirror — clear as the scene leaves, restore the previous label snappily once it's back.
   */
  const crossLabel = (start: string, downCfg: BarCfg, upCfg: BarCfg) => {
    // DOWN: the old label stays until its scene is ~60% gone (was: cleared the moment the fade began).
    atDir(start + '+=' + OV.toFixed(3), 1, null);
    atDir(start + '+=' + DOWN_BUF, 1, downCfg);
    atDir(start + '+=' + DOWN_BUF, -1, null);
    atDir(start + '+=0.2', -1, upCfg);
  };

  return { boundary, atDir, crossLabel };
}

/** Timing knobs used by the opening "enter the void" beat. */
export type VoidTiming = { heroHold: number; fogStart: number; fogDur: number; portalStart: number; voidScale: number };

/** Initial (pre-timeline) state of the fog + portal layers. */
export function prepareVoid(fog: HTMLElement, portal: HTMLElement) {
  gsap.set(fog, { opacity: 0 });                                            // solid beige, uniform coverage
  gsap.set(portal, { opacity: 0, scale: 0.3, transformOrigin: '50% 45%' }); // soft bloom from the void centre
}

/**
 * ENTER THE VOID — hero holds while its copy recedes (useHeroSquish), the fixed binary rain rushes
 * toward the screen (accelerating zoom), a soft warm portal blooms early and dissipates, and the
 * solid beige fog takes over. The first scene should fade in at `T.fogStart + T.fogDur`.
 */
export function enterTheVoid(
  tl: Timeline,
  { fog, portal, gridBg }: { fog: HTMLElement; portal: HTMLElement; gridBg: HTMLElement | null },
  T: VoidTiming,
) {
  tl.to({}, { duration: T.heroHold });
  if (gridBg) tl.fromTo(gridBg, { scale: 1 }, { scale: T.voidScale, ease: 'power2.in', duration: T.fogStart + T.fogDur }, 0);
  tl.fromTo(portal, { opacity: 0, scale: 0.3 }, { opacity: 0.7, scale: 2.0, ease: 'power2.in', duration: T.fogDur + 0.3 }, T.portalStart);
  tl.to(portal, { opacity: 0, ease: 'power1.out', duration: 0.5 }, T.fogStart + T.fogDur);
  tl.to(fog, { opacity: 1, ease: 'none', duration: T.fogDur }, T.fogStart);
}

/** SOLARIS BAR — bitmappy "data-load" push-down (stepped clip reveal + brief flicker) at `at`. */
export function pushInBar(tl: Timeline, bar: HTMLElement, at: number) {
  tl.fromTo(bar,
    { clipPath: 'inset(0 0 100% 0)', opacity: 0.35 },
    { clipPath: 'inset(0 0 0% 0)', opacity: 1, ease: 'steps(6)', duration: 0.14 },
    at);
}

/**
 * ONE-WAY SCENE (desktop stage) — a scene you only see on the way DOWN.
 * Scrolling back UP into its stretch of the timeline (entering from its END side), the scene is hidden and
 * `hold` (usually the scene before it) is held on screen instead, until you leave the stretch. Entering from
 * the START side (scrolling down) plays it normally. Decided by the side you enter from, so a small wobble
 * in scroll direction mid-stretch doesn't flicker it on/off.
 * Works with CSS classes that beat GSAP's inline styles: `.stage-skip` / `.stage-hold` (global.css).
 *   oneWayScene(tl, { scene: scLines, from: 'linesIn', to: 'philIn', hold: [scServices, bar],
 *                     onSkip: () => pageBar.setBar(SERVICES) });
 */
const oneWayRegistry = new WeakMap<Timeline, Array<() => void>>();
// Several one-way scenes can HOLD the same element (e.g. two skipped scenes in a row both holding "What we
// do") — count holders so one scene releasing doesn't drop another's hold.
const hold = (el: HTMLElement, on: boolean) => {
  const n = Math.max(0, (parseInt(el.dataset.holdN || '0', 10) || 0) + (on ? 1 : -1));
  el.dataset.holdN = String(n);
  el.classList.toggle('stage-hold', n > 0);
};
export function oneWayScene(
  tl: Timeline,
  o: { scene: HTMLElement; from: string | number; to: string | number; hold?: HTMLElement[]; onSkip?: () => void; onRelease?: () => void },
) {
  // positions: a number, a label, or "label+=n" / "label-=n"
  const at = (p: string | number) => {
    if (typeof p === 'number') return p;
    const m = p.match(/^(.+?)([+-]=)([\d.]+)$/);
    if (!m) return tl.labels[p];
    const base = tl.labels[m[1]];
    return base === undefined ? undefined : base + (m[2] === '+=' ? 1 : -1) * parseFloat(m[3]);
  };
  let prevT = tl.time();
  let skipping = false;
  const set = (on: boolean) => {
    if (on === skipping) return;
    skipping = on;
    o.scene.classList.toggle('stage-skip', on);
    (o.hold || []).forEach((el) => hold(el, on));
    if (!on) o.onRelease?.();
  };
  const check = () => {
    const a = at(o.from), b = at(o.to), t = tl.time();
    if (a === undefined || b === undefined) return;
    const inside = t > a && t < b;
    if (!inside) set(false);
    else if (!(prevT > a && prevT < b)) set(prevT >= b);   // just entered: from the END side → skip
    // while skipping, re-assert the held state every update — the timeline's own label callbacks inside this
    // stretch would otherwise put the skipped scene's bar label back
    if (skipping) o.onSkip?.();
    prevT = t;
  };
  let list = oneWayRegistry.get(tl);
  if (!list) {
    list = [];
    oneWayRegistry.set(tl, list);
    const fns = list;
    tl.eventCallback('onUpdate', () => fns.forEach((f) => f()));
  }
  list.push(check);
}
