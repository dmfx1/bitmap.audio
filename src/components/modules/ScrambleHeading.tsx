/* src/components/modules/ScrambleHeading.tsx
 *
 * Hero title reveal — the SCRAMBLE alternative to TypewriterHero.
 *
 * Instead of typing left-to-right, the whole title fades in FAST as binary 0/1s
 * (once the intro has handed off), then every character switches from 0/1 to its
 * final letter in a quick RANDOM order (not sequential) — the "client terminal"
 * flip. Drop-in compatible with TypewriterHero's props so heroes can swap one line.
 *
 * Spaces + newlines are preserved (word/line shape holds during the scramble).
 * Reduced-motion → instant final text. Timing borrows brandMotion.flickerMs so the
 * 0/1 flicker matches the wordmark + intro.
 */
import React, { useEffect, useRef, useState } from 'react';
import { BRAND_MOTION } from '../../config/brandMotion';

interface ScrambleHeadingProps {
  text: string;
  onComplete?: () => void;
  className?: string;
  isBrand?: boolean;
  /** Window over which characters randomly resolve (ms). */
  resolveMs?: number;
  /** Brief hold showing pure binary before the resolve begins (ms). */
  startDelayMs?: number;
  /** 0/1 re-roll cadence (ms). */
  flickerMs?: number;
}

const rc = () => (Math.random() < 0.5 ? '0' : '1');

export default function ScrambleHeading({
  text,
  onComplete,
  className,
  isBrand,
  resolveMs = 360,
  startDelayMs = 110,
  flickerMs = BRAND_MOTION.flickerMs,
}: ScrambleHeadingProps) {
  const [display, setDisplay] = useState('');
  const [shown, setShown] = useState(false); // drives the quick opacity fade-in
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDisplay(text);
      setShown(true);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    // Per-character reveal time: spaces/newlines never scramble; the rest resolve at
    // a RANDOM point in [startDelay, startDelay + resolveMs].
    const revealAt = text.split('').map((ch) =>
      ch === ' ' || ch === '\n' ? -1 : startDelayMs + Math.random() * resolveMs
    );

    // Seed as full-length binary immediately, then fade in fast.
    setDisplay(text.split('').map((ch) => (ch === ' ' || ch === '\n' ? ch : rc())).join(''));
    const showRaf = requestAnimationFrame(() => setShown(true));

    let start: number | undefined;
    let lastFlick = -Infinity;
    const total = startDelayMs + resolveMs;

    const tick = (t: number) => {
      if (start === undefined) start = t;
      const el = t - start;

      if (t - lastFlick >= flickerMs) {
        lastFlick = t;
        setDisplay(
          text
            .split('')
            .map((ch, i) => (revealAt[i] < 0 ? ch : el >= revealAt[i] ? ch : rc()))
            .join('')
        );
      }

      if (el >= total) {
        setDisplay(text);
        if (!doneRef.current) {
          doneRef.current = true;
          setDone(true);
          onCompleteRef.current?.();
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(showRaf);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, resolveMs, startDelayMs, flickerMs]);

  // Same line/accent rendering as TypewriterHero (first line plain or brand ".";
  // every line after a \n is accent).
  const renderText = () => {
    const lines = display.split('\n');
    return lines.map((line, i) => {
      const isFirstLine = i === 0;
      let lineContent: React.ReactNode = line;

      if (isFirstLine && isBrand && line.includes('.')) {
        const dotIndex = line.indexOf('.');
        lineContent = (
          <>
            {line.slice(0, dotIndex)}
            <span className="text-accent font-medium">{line.slice(dotIndex)}</span>
          </>
        );
      } else if (!isFirstLine) {
        lineContent = <span className="text-accent font-medium">{line}</span>;
      }

      return (
        <React.Fragment key={i}>
          {lineContent}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <h1
      className={className || 'heading-hero mb-8 leading-tight font-medium min-h-[2.2em] md:min-h-[2.4em]'}
      style={{ opacity: shown ? 1 : 0, transition: 'opacity 180ms ease-out' }}
    >
      {renderText()}
      {done && (
        <span className="inline-block w-[0.5ch] h-[0.9em] bg-accent brightness-125 ml-1 animate-pulse align-middle" />
      )}
    </h1>
  );
}
