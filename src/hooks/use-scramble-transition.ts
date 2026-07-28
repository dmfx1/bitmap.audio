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
}

export function useScrambleTransition(value: string, { outMs = 380, inMs = 620 }: Opts = {}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    const from = prev.current;
    const to = value;
    prev.current = value;

    if (raf.current) cancelAnimationFrame(raf.current);

    const total = outMs + inMs;
    let start: number | undefined;

    const tick = (t: number) => {
      if (start === undefined) start = t;
      const el = t - start;

      if (el < outMs) {
        // OUT: reveal count of the OLD text falls from full -> 0.
        const p = el / outMs;
        setDisplay(scramble(from, Math.round((1 - p) * from.length)));
        raf.current = requestAnimationFrame(tick);
      } else if (el < total) {
        // IN: reveal count of the NEW text rises 0 -> full.
        const p = (el - outMs) / inMs;
        setDisplay(scramble(to, Math.round(p * to.length)));
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, outMs, inMs]);

  return display;
}
