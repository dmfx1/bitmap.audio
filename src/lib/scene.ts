/* src/lib/scene.ts
 *
 * REUSABLE SCROLL SCENE framework — the gsap.com "animate anything" pattern, generalised.
 * A [data-scene] section becomes a pinned, scroll-scrubbed timeline of "beats" on desktop;
 * on mobile the SAME timeline autoplays once when it enters view (no endless thumb-scroll).
 *
 *   Desktop:  the stage RISES into centre on ordinary scroll (the "lead-in" runway), then
 *             LOCKS and scrubs the master timeline, then UNPINS and the stage scrolls up and
 *             away into the next section on ordinary scroll (no reserved trailing frame).
 *   Mobile:   no pin — an onEnter trigger plays the timeline over autoplayMs.
 *   Reduced:  jump straight to the final state.
 *
 * PIN MODEL (why it's shaped this way — see MOTION-PLAN.md open items #1/#2):
 *   A viewport-tall stage pinned at `top top` engages the pin at the *exact instant* the
 *   stage fills the screen, so the first beat scrubs from the moment of lock — it "slams"
 *   in — and after the scrub the pinned stage sits as a STATIC final frame for a whole
 *   viewport (the "dead space" / lingering last scene). The fix is runway, not a patch:
 *     • Lead-in  — `.scene` carries `padding-top: var(--scene-lead)` so there is REAL
 *                  ordinary scroll before the pin; the resting first beat (authored as the
 *                  timeline's initial state, e.g. bit + first caption already visible) rides
 *                  UP with the scroll until the stage is centred, THEN the pin engages.
 *     • Pin      — `start:'center center'`: lock when the stage is centred in the viewport.
 *     • Lead-out — NO bottom padding: the moment the pin releases, the resolved stage is
 *                  flush against the next section, so it scrolls up and away naturally
 *                  instead of being held as a reserved trailing frame.
 *   Tune the lead-in per scene with `--scene-lead` (CSS) or globally via SCENE.leadVh.
 *
 * Authoring — register a builder that adds tweens to the master timeline. Author the FIRST
 * beat as the timeline's initial state (gsap.set), so it is visible during the lead-in rise;
 * the scrubbed beats are the CHANGES between scenes.
 *
 *   import { registerScene } from '@/lib/scene';
 *   registerScene('bitmap-philosophy', (tl, stage) => {
 *     gsap.set(stage.querySelector('#bit-0'), { scale: 1, opacity: 1 }); // resting beat 1
 *     tl.to(stage.querySelector('#bit-0'), { backgroundColor: '#4FC3D9', duration: 1 });
 *     // …one segment per beat; durations are RELATIVE (scrub maps them across the pin,
 *     //   autoplay maps the total to autoplayMs).
 *   });
 *
 * Markup:
 *   <section data-scene="bitmap-philosophy" data-scroll="3" class="scene">
 *     <div class="scene-stage"> …animated layers… </div>
 *   </section>
 *
 * Tune everything site-wide via SCENE below.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SCENE = {
  /** Desktop: total PINNED SCROLL to play the whole scene, in viewport multiples.
   *  1 = you scroll one screen-height (while locked) to play it. Per-scene override
   *  with data-scroll="1.5". Keep it modest — the stage itself is only one viewport. */
  scrollVh: 1,
  /** Desktop: OPTIONAL lead-in runway, in viewport multiples — extra ordinary scroll BEFORE
   *  the pin. Default 0: the viewport-tall stage already provides the rise (it scrolls up from
   *  the bottom into centre before the pin engages), so no empty gap is needed. Only add lead
   *  if a scene needs breathing room from the previous section. Per-scene: CSS `--scene-lead`. */
  leadVh: 1,
  /** Mobile: total time (ms) the whole scene autoplays over, once, on enter. */
  autoplayMs: 3800,
  /** Mobile: how far into view (from the top) before autoplay fires. */
  mobileStart: 'top 75%',
} as const;

type SceneBuilder = (tl: gsap.core.Timeline, stage: HTMLElement) => void;
const builders: Record<string, SceneBuilder> = {};

/** Register a scene's choreography by id (matches data-scene="id"). */
export function registerScene(id: string, build: SceneBuilder): void {
  builders[id] = build;
  if (typeof document === 'undefined') return;
  // Drive init straight off registration — do NOT gate on __scenesReady. The old gate
  // deadlocked: if the module's load/readyState path missed (a race), initScenes never
  // ran, __scenesReady stayed false, and this branch never fired → nothing ever built.
  // initScenes is idempotent (per-section sceneInit guard), so calling it here AND on the
  // lifecycle events below is safe. The section markup is already in the DOM by the time a
  // component's own <script> runs, so we can build immediately once the doc is parsed.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScenes, { once: true });
  } else {
    initScenes();
  }
}

function initScenes(): void {
  if (typeof window === 'undefined') return;
  (document as any).__scenesReady = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 768px)').matches;

  document.querySelectorAll<HTMLElement>('[data-scene]').forEach((section) => {
    if (section.dataset.sceneInit === '1') return;
    const id = section.dataset.scene || '';
    const build = builders[id];
    if (!build) return; // builder not registered yet — will run when it registers
    section.dataset.sceneInit = '1';

    const stage = section.querySelector<HTMLElement>('.scene-stage') || section;
    const scrollVh = parseFloat(section.dataset.scroll || String(SCENE.scrollVh));

    // Lead-in runway (ordinary scroll before the pin). CSS owns the default via
    // `.scene { padding-top: var(--scene-lead) }`; mirror it to the var so a per-scene
    // data-scroll page can also set `--scene-lead` and keep both in sync. If the page
    // already set --scene-lead in CSS we leave it alone.
    if (!section.style.getPropertyValue('--scene-lead')) {
      section.style.setProperty('--scene-lead', SCENE.leadVh * 100 + 'svh');
    }

    const tl = gsap.timeline({ paused: true });
    build(tl, stage);

    // reduced-motion + mobile keep the RESOLVED end state (no exit appended below), so the
    // scene reads as a finished static frame with no motion / no pin trailing to clean up.
    if (reduced) { tl.progress(1); return; }

    if (desktop) {
      // Desktop only: the pin reserves a trailing viewport, so a resolved bit would sit there
      // as a static block after the scrub. Append an EXIT that lifts + fades the scene content
      // right before the pin releases → the stage empties to plain background and scrolls
      // seamlessly into the next section (no leftover bit, no lingering caption). Author can
      // mark the wrapper with [data-scene-content]; falls back to the stage's first child.
      const content =
        stage.querySelector<HTMLElement>('[data-scene-content]') ||
        (stage.firstElementChild as HTMLElement | null);
      // A scene marked data-scene-hold KEEPS its final frame (no fade) so the NEXT section can
      // slide OVER the top of it — the founders-peel-over-sticky-hero effect. Otherwise the content
      // lifts + fades so the blank trailing scrolls away cleanly.
      if (content && section.dataset.sceneHold !== '1') {
        tl.to(content, { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power1.in' });
      }

      ScrollTrigger.create({
        trigger: stage,
        // The viewport-tall stage scrolls up from the bottom into the centre on ordinary
        // scroll; the pin engages only once it is CENTRED (so the first beat has already
        // risen into place — no slam), then scrubs the timeline over `scrollVh` viewport(s).
        start: 'center center',
        end: '+=' + Math.round(scrollVh * 100) + '%',
        pin: stage,
        pinSpacing: true,
        scrub: 0.75,         // Was 'true'. Adding dampening (0.5 to 1.0) smooths out mouse wheel notches
        anticipatePin: 1,   // Smooths out the 1-frame position pop when the pin engages
        animation: tl,
        invalidateOnRefresh: true,
      });
    } else {
      // Mobile: scale the timeline so its full run lasts autoplayMs, play once on enter.
      const dur = tl.duration() || 1;
      tl.timeScale(dur / (SCENE.autoplayMs / 1000));
      ScrollTrigger.create({
        trigger: section,
        start: SCENE.mobileStart,
        once: true,
        onEnter: () => tl.play(),
      });
    }
  });
}

function refreshScenes(): void {
  if (typeof window === 'undefined') return;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener('astro:page-load', () => { initScenes(); refreshScenes(); });
if (document.readyState === 'complete') { initScenes(); refreshScenes(); }
else window.addEventListener('load', () => { initScenes(); refreshScenes(); });
// Fonts change metrics after swap → re-measure once ready (returns2 lesson).
if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
  (document as any).fonts.ready.then(() => ScrollTrigger.refresh());
}
