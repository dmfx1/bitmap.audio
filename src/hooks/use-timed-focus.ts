/* src/hooks/use-timed-focus.ts
 *
 * REUSABLE "timed focus loop" — the shared logic for any section that cycles a highlight through a
 * set of items on a TIMER (not on scroll), with a progress value per item and hover taking
 * precedence. Drop it into any React section so the interaction stays consistent site-wide.
 *
 *   const { index, progress, hoverProps } = useTimedFocus(items.length, { intervalMs: 4500, enabled });
 *
 *   index      — the item in focus (autoplay cursor, or the hovered item).
 *   progress   — 0→1 fill of the current item's timer (drive the progress bar off this). Full (1)
 *                while hovering (countdown paused).
 *   hoverProps — spread onto each item: {onMouseEnter, onMouseLeave}. Hovering pauses the loop.
 *   enabled    — false pauses the timer (e.g. off-screen, or on mobile). Progress is PRESERVED when
 *                it flips back true — the timer resumes where it left off, it does NOT restart.
 *
 * Uses ONE persistent rAF loop reading live values from refs + an elapsed accumulator, so
 * re-renders / enabled + hover changes never reset the fill mid-way (that was the "fills halfway"
 * bug from restarting the loop on every dependency change).
 */
import { useEffect, useRef, useState } from 'react';

interface Options { intervalMs?: number; enabled?: boolean }

export function useTimedFocus(count: number, { intervalMs = 4500, enabled = true }: Options = {}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const autoRef = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | undefined>(undefined);
  const enabledRef = useRef(enabled);
  const countRef = useRef(count);
  const intervalRef = useRef(intervalMs);
  enabledRef.current = enabled;
  countRef.current = count;
  intervalRef.current = intervalMs;

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const dt = lastRef.current === undefined ? 0 : t - lastRef.current;
      lastRef.current = t;
      const n = countRef.current;
      if (n > 0) {
        if (hoverRef.current !== null) {
          elapsedRef.current = 0;                 // paused on hover, bar full, resumes fresh
          setIndex(hoverRef.current);
          setProgress(1);
        } else if (enabledRef.current) {
          elapsedRef.current += dt;               // only accrue while enabled → off-screen pauses
          const p = Math.min(1, elapsedRef.current / intervalRef.current);
          setIndex(autoRef.current);
          setProgress(p);
          if (p >= 1) { autoRef.current = (autoRef.current + 1) % n; elapsedRef.current = 0; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hoverProps = (i: number) => ({
    onMouseEnter: () => { hoverRef.current = i; },
    onMouseLeave: () => { hoverRef.current = hoverRef.current === i ? null : hoverRef.current; },
  });

  return { index, progress, hoverProps };
}
