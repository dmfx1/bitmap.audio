/* src/hooks/use-scramble-transition.ts
 *
 * Scramble text OUT and IN. Whenever `value` changes, the currently displayed
 * text dissolves into binary (0/1) — the OUT phase — then the new value resolves
 * out of the binary — the IN phase. (The older useBinaryScramble only did IN.)
 *
 * Spaces are preserved; every other character flickers between 0/1 until revealed.
 * Frame-driven (requestAnimationFrame); durations come from brandMotion config.
 */
import { useEffect, useRef, useState } from 'react';

function rc(): string {
  return Math.random() < 0.5 ? '0' : '1';
}

function scramble(target: string, reveal: number): string {
  return target
    .split('')
    .map((ch, i) => (ch === ' ' ? ' ' : i < reveal ? ch : rc()))
    .join('');
}

interface Opts {
  outMs?: number;
  inMs?: number;
  /** How often the random 0/1s re-roll (ms). Larger = fewer, chunkier flickers per
      letter (distinct digits) rather than a fast per-frame blur. */
  flickerMs?: number;
}

export function useScrambleTransition(value: string, { outMs = 380, inMs = 620, flickerMs = 55 }: Opts = {}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    const from = prev.current;
    const to = value;
    prev.current = value;

    if (raf.current) cancelAnimationFrame(raf.current);

    // Scrambling IN from nothing (e.g. the intro reveal) has no old text to
    // dissolve — skip the OUT phase so it's a clean, smooth binary -> letters IN.
    const effOut = from.length === 0 ? 0 : outMs;
    const total = effOut + inMs;
    let start: number | undefined;
    let lastFlick = -Infinity;

    const tick = (t: number) => {
      if (start === undefined) start = t;
      const el = t - start;

      if (el >= total) {
        setDisplay(to);
        raf.current = null;
        return;
      }

      // Throttle the re-roll so you see a few distinct 0/1s per letter.
      if (t - lastFlick >= flickerMs) {
        lastFlick = t;
        if (el < effOut) {
          const p = el / effOut; // OUT: reveal of OLD text falls full -> 0
          setDisplay(scramble(from, Math.round((1 - p) * from.length)));
        } else {
          const p = (el - effOut) / inMs; // IN: reveal of NEW text rises 0 -> full
          setDisplay(scramble(to, Math.round(p * to.length)));
        }
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, outMs, inMs, flickerMs]);

  return display;
}
