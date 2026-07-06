/* src/components/modules/GrainGradientBg.tsx */
import React, { useEffect, useRef, useState } from 'react';
import { GrainGradient } from '@paper-design/shaders-react';

/**
 * Mobile-only ambient background wash — plugged into Section.astro via the
 * `grainBg` prop.
 *
 * Why mobile-only: the sticky hero wrapper on every page is `md:sticky`, not
 * `sticky` — on mobile it's a normal block that scrolls fully away, so the
 * frosted-glass sections below it (`!bg-background/50 backdrop-blur-xl`)
 * have nothing bleeding through behind them like they do on desktop (where
 * the hero image is still sitting underneath, sticky, showing through the
 * glass). This fills that gap with a slow-moving colour wash instead.
 *
 * Desktop never mounts the shader at all — `isMobile` is checked reactively
 * via matchMedia (same pattern as useMobileCenterIndex) and the component
 * returns null when false, so no WebGL canvas or rAF animation loop ever
 * spins up somewhere it would never be seen.
 *
 * client:idle, not client:visible or client:load: this component's own
 * initial render is `null` (SSR default is "not mobile"). An empty island has
 * no real size for client:visible's IntersectionObserver to key off, which
 * made the first version unreliable. client:load fixed that but caused a
 * new problem — with grainBg on 2-3 sections per page, that's 2-3 WebGL
 * shader islands all hydrating immediately at page load, fighting the main
 * thread against the hero's own client:load animation (visible jank/stutter
 * reported on /about). client:idle defers to the browser's idle callback
 * (after initial paint) regardless of the island's render output, so it
 * hydrates reliably without competing with page-load-critical work.
 *
 * Colour: dom wants a bright accent orange + a cool teal, not the site's
 * pale --primary token (200 80% 90% renders almost white against the dark
 * background, easy to lose entirely under noise/softness). Using the more
 * saturated cyan/teal and amber tones already established elsewhere in
 * global.css for glow/peak effects (--gradient-glow's 185/100%/50% teal,
 * --accent-peak's 35/100%/60% bright orange) rather than inventing new hues.
 *
 * Colour format note: GrainGradient's `colors`/`colorBack` props are parsed
 * in plain JS (hex / rgb() / comma-form hsl()), not through the browser's
 * CSS engine — `hsl(var(--x))` will not resolve here. These are hardcoded
 * literal strings; if the underlying tokens change in global.css, update
 * them here too:
 *   teal (from --gradient-glow):  185 100% 50%  → hsl(185, 100%, 50%)
 *   orange (--accent-peak):        35 100% 60%  → hsl(35, 100%, 60%)
 *   background (--background):    180  20%  9%  → hsl(180, 20%, 9%)
 *
 * Performance: a WebGL canvas keeps re-rendering every animation frame for as
 * long as it's mounted with a non-zero `speed` — ShaderMount has no built-in
 * awareness of whether its own canvas is actually scrolled into view. With
 * grainBg on 2-3 sections per page, that's 2-3 canvases all rendering forever
 * in the background even once the user has scrolled past them, unless
 * something explicitly pauses them. Two levers are used here to keep this
 * cheap even with noise/softness/speed turned up:
 *   1. An IntersectionObserver drives `speed` to 0 (fully halts the render
 *      loop — see the `currentSpeed !== 0` check in the shader library's
 *      own render loop) whenever the section scrolls out of view, and
 *      restores it when back on screen. Same "pause what's not visible"
 *      principle already used for ConceptGrid's video previews.
 *   2. `maxPixelCount` caps the canvas's actual render resolution well below
 *      what a 3x-DPR phone would otherwise render at by default. This is a
 *      soft, blurred-through ambient wash, not a sharp foreground graphic —
 *      full retina resolution buys nothing visible here, only extra
 *      fragment-shader cost per frame. Lower this further if still slow,
 *      raise it if the grain looks blocky.
 */
export default function GrainGradientBg() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isMobile || !wrapperRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px 0px' } // start/stop slightly before the section is actually on screen, avoids a visible pop-in
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  if (!isMobile) return null;

  // Configured animation speed — set to 0 whenever scrolled out of view so
  // the WebGL render loop fully stops instead of running forever off-screen.
  const speed = isVisible ? 1 : 0;

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.5 }}
    >
      <GrainGradient
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}
        colors={['hsl(185, 100%, 50%)', 'hsl(35, 100%, 60%)']}
        colorBack="hsl(180, 20%, 9%)"
        softness={1}
        intensity={0.5}
        noise={1}
        shape="wave"
        speed={speed}
        maxPixelCount={1280 * 720}
      />
    </div>
  );
}
