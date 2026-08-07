/* src/hooks/use-intro-gate.ts
 *
 * Returns `true` once the nav intro animation has finished (or immediately if it
 * already has). Heroes use this to hold their typewriter/content until the intro
 * sequence — bitmap.audio -> page name + b at the top -> then the hero types — is
 * done, so the whole site animates in the same order.
 *
 * The nav (Navigation.tsx / BrandLockup) sets window.__bitmapIntroDone and fires
 * the `intro-complete` event when the intro lands. A fallback guarantees the hero
 * never gets stuck if the event is missed.
 */
import { useEffect, useState } from 'react';

export function useIntroGate(fallbackMs = 4000) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__bitmapIntroDone) {
      setStarted(true);
      return;
    }
    const onDone = () => setStarted(true);
    window.addEventListener('intro-complete', onDone, { once: true });
    const fallback = window.setTimeout(() => setStarted(true), fallbackMs);
    return () => {
      window.removeEventListener('intro-complete', onDone);
      window.clearTimeout(fallback);
    };
  }, [fallbackMs]);

  return started;
}
