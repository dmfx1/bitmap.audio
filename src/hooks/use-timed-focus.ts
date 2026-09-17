/* src/hooks/use-timed-focus.ts
 *
 * REUSABLE "timed focus loop" — cycles a highlight through a set of items on a TIMER, with hover
 * taking precedence. Like the Values loop: continuous + hover-pause.
 *
 *   const { index, hoverProps } = useTimedFocus(items.length, { intervalMs: 4500, enabled, onProgress });
 *
 *   index      — the focused item (autoplay cursor or hovered item). Pushed to React state ONLY when
 *                it changes (once per interval), so the section doesn't re-render every frame.
 *   onProgress — (index, progress 0→1) called every animation frame. Write the progress bar straight
 *                to the DOM here (a CSS var), NOT via React state — that's what keeps it smooth.
 *   hoverProps — spread onto each item: {onMouseEnter, onMouseLeave}. Hovering pauses the loop.
 *   enabled    — false pauses/holds (e.g. off-screen or mobile).
 *
 * Options:
 *   initialIndex   — which item is focused at rest (default 0).
 *   initialHoldMs  — a longer dwell on the FIRST item before autoplay advances (default = intervalMs).
 *   resumeFromNext — on mouse-leave of item i, resume from item i+1 (default false).
 */
import { useEffect, useRef, useState } from 'react';

interface Options {
  intervalMs?: number;
  enabled?: boolean;
  initialIndex?: number;
  initialHoldMs?: number;
  resumeFromNext?: boolean;
  onProgress?: (index: number, progress: number) => void;
}

export function useTimedFocus(
  count: number,
  { intervalMs = 4500, enabled = true, initialIndex = 0, initialHoldMs, resumeFromNext = false, onProgress }: Options = {},
) {
  const [index, setIndex] = useState(initialIndex);

  const autoRef = useRef(initialIndex);
  const hoverRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const lastRef = useRef<number | undefined>(undefined);
  const firstRef = useRef(true);
  const initialIndexRef = useRef(initialIndex);
  const shownRef = useRef(initialIndex); // last index pushed to React state
  const enabledRef = useRef(enabled);
  const countRef = useRef(count);
  const intervalRef = useRef(intervalMs);
  const initialHoldRef = useRef(initialHoldMs);
  const resumeNextRef = useRef(resumeFromNext);
  const onProgressRef = useRef(onProgress);
  enabledRef.current = enabled;
  countRef.current = count;
  intervalRef.current = intervalMs;
  initialHoldRef.current = initialHoldMs;
  resumeNextRef.current = resumeFromNext;
  onProgressRef.current = onProgress;

  // Push progress to the DOM every frame (cheap); push index to React state only on change.
  const show = (i: number, p: number) => {
    onProgressRef.current?.(i, p);
    if (shownRef.current !== i) { shownRef.current = i; setIndex(i); }
  };

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const dt = lastRef.current === undefined ? 0 : t - lastRef.current;
      lastRef.current = t;
      const n = countRef.current;
      if (n > 0) {
        if (hoverRef.current !== null) {
          elapsedRef.current = 0;                 // hover: hold this item, bar full
          show(hoverRef.current, 1);
        } else if (enabledRef.current) {
          elapsedRef.current += dt;
          const dwell = firstRef.current && initialHoldRef.current != null ? initialHoldRef.current : intervalRef.current;
          const p = Math.min(1, elapsedRef.current / dwell);
          show(autoRef.current, p);
          if (p >= 1) { firstRef.current = false; autoRef.current = (autoRef.current + 1) % n; elapsedRef.current = 0; }
        } else {
          // OUT OF FOCUS (off-screen / section not active): reset to the initial item so it is
          // re-instantiated (and dwells again) the next time the section comes into focus.
          autoRef.current = initialIndexRef.current;
          elapsedRef.current = 0;
          firstRef.current = true;
          show(initialIndexRef.current, 0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hoverProps = (i: number) => ({
    onMouseEnter: () => { hoverRef.current = i; },
    onMouseLeave: () => {
      if (hoverRef.current !== i) return;
      hoverRef.current = null;
      if (resumeNextRef.current) {
        autoRef.current = (i + 1) % countRef.current; // resume from the next item
        elapsedRef.current = 0;
        firstRef.current = false;
      }
    },
  });

  return { index, hoverProps };
}
