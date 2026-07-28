/* src/components/modules/CornerMark.tsx
 *
 * Persistent brand anchor, pinned top-left OUTSIDE the nav bar. It is the bitmap
 * `b` mark — large, on a beige/white tile with a border — with the page text set
 * beside it. Reads as "about us"; hovering scrambles the text back to
 * "bitmap.audio" (the mark links home).
 *
 * The `b` asset is public/favicon/logo-b.png (a clean-named copy of
 * "bitmap.audio logo 4 (b) 500px.png").
 *
 * Appears once the intro hands off (window.__bitmapIntroDone / `intro-complete`).
 * The intro itself performs the bitmap.audio -> page-name scramble; here the text
 * only scrambles on hover.
 */
import React, { useEffect, useState } from 'react';
import { useBinaryScramble } from '../../hooks/use-binary-scramble';

interface CornerMarkProps {
  /** Resolved page name, e.g. "about us". */
  pageName: string;
  href?: string;
}

const BRAND = 'bitmap.audio';

export default function CornerMark({ pageName, href = '/' }: CornerMarkProps) {
  const [started, setStarted] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__bitmapIntroDone) {
      setStarted(true);
      return;
    }
    const onDone = () => setStarted(true);
    window.addEventListener('intro-complete', onDone, { once: true });
    return () => window.removeEventListener('intro-complete', onDone);
  }, []);

  // Only scramble on hover; resting state is the static page name.
  const target = hovering ? BRAND : pageName;
  const scrambled = useBinaryScramble(target, hovering, 45);
  const display = hovering ? scrambled || BRAND : pageName;

  return (
    <a
      href={href}
      aria-label="bitmap.audio — home"
      className={`group fixed top-3 left-4 md:left-6 z-[60] text-6xl flex items-center gap-4 select-none transition-opacity duration-500 ${
        started ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* The b tile — beige/white background + border, extra large. */}
      <span className="flex items-center justify-center bg-foreground border border-black/25 shadow-sm h-16 w-16 md:h-24 md:w-24 p-2 md:p-3">
        <img
          src="/favicon/logo-b.png"
          alt="bitmap.audio"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </span>

      {/* Page text beside the mark. */}
      <span className="font-mono text-xl md:text-3xl font-light tracking-tight text-foreground whitespace-nowrap">
        {display}
        <span className="text-accent opacity-70">_</span>
      </span>
    </a>
  );
}
