import React, { useEffect, useRef, useState } from 'react';

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleText, setVisibleText] = useState("");
  const [sub, setSub] = useState(0); // 0→1 reveal of the "At bitmap.audio…" line, AFTER the quote types
  const fullQuote = 'In computer science, a bitmap maps individual, micro-level data points across an array to construct a complete visual image.';

  useEffect(() => {
  let ticking = false;

  const updateText = () => {
    if (!sectionRef.current) return;
    const vh = window.innerHeight;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    // Prefer the FocusScroll LOCK: nothing types until the section is locked in place (its top
    // reaches 0) — you just see the pulsing cursor — then the quote types out across the locked
    // scroll range. Off desktop / with no lock, fall back to typing as it passes through view.
    // Scene-stage drive: if an ancestor scene exposes --phil-progress (0..1, set by the master
    // timeline), type from that — so the scroll-typewriter still works when the scene is pinned and
    // cross-faded in place (no scroll-through). Falls back to the FocusScroll lock / viewport logic.
    const scene = sectionRef.current.closest('[data-scene]') as HTMLElement | null;
    const scroller = sectionRef.current.closest('[data-focus-scroll]') as HTMLElement | null;
    let progress = 0;
    if (scene && desktop) {
      // Desktop scene-stage: type ONLY from --phil-progress (0 until the master timeline sets it).
      // Do NOT fall back to the viewport math here — the scene is pinned (rect.top ≈ 0), which would
      // read as fully-typed on the first frame, causing a flash of the full quote then a reset.
      // (Mobile flattens the stage with no GSAP, so it drops through to the viewport logic below.)
      const driven = getComputedStyle(scene).getPropertyValue('--phil-progress').trim();
      progress = driven !== '' && !Number.isNaN(parseFloat(driven)) ? Math.min(Math.max(parseFloat(driven), 0), 1) : 0;
    } else if (scroller && desktop) {
      const rect = scroller.getBoundingClientRect();
      const range = rect.height - vh;
      progress = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
    } else {
      const rect = sectionRef.current.getBoundingClientRect();
      const startTrigger = vh * 0.75;
      const endTrigger = vh * 0.45;
      progress = Math.min(Math.max((startTrigger - rect.top) / (startTrigger - endTrigger), 0), 1);
    }

    // Quote finishes typing by 75% of the scroll; the sub-line then fades up over the last 20%.
    const typed = Math.min(progress / 0.75, 1);
    setVisibleText(fullQuote.slice(0, Math.floor(fullQuote.length * typed)));
    setSub(Math.min(Math.max((progress - 0.8) / 0.2, 0), 1));
    ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
        window.requestAnimationFrame(updateText);
        ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
    }, []);

  return (
    <div ref={sectionRef} className="flex flex-col items-center text-center">
      
      <div className="max-w-7xl min-h-[160px] md:min-h-[200px]">
        <h2 className="text-2xl md:text-4xl lg:text-7xl font-mono font-bold text-foreground/60 text-justify md:text-center">
          {visibleText}
          <span className="inline-block w-[0.5ch] h-[0.9em] bg-accent brightness-125 ml-2 animate-pulse align-middle" />
        </h2>
      </div>

      <p
        className="font-mono text-body-muted text-justify md:text-center text-xl max-w-2xl mt-16"
        style={{ opacity: sub, transform: `translateY(${(1 - sub) * 14}px)`, willChange: 'opacity, transform' }}
      >
        At <span className="text-accent/75 font-bold">bitmap.audio</span>, we apply the same strutural logic to sound.
      </p>
    </div>
  );
}