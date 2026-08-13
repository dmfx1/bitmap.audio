/* src/hooks/use-scroll-focus.ts
 *
 * REUSABLE "scroll → focus index" hook — the FocusColumns idea, decoupled from any design.
 *
 * Given a section's ref and how many items it holds, it returns the index of the item that
 * should be IN FOCUS based on where the section sits in the viewport: as you scroll through the
 * section, the active index advances 0 → count-1. The consuming component decides what "focused"
 * looks like (zoom, highlight, colour…) — this hook only says WHICH one, so the same scroll
 * behaviour can drive completely different designs (Values columns, ServicePillars cards, …).
 *
 * Not sticky/pinned — the highlight tracks the section as it passes, so it stays snappy and adds
 * no extra scroll length. Pass `enabled = false` (e.g. on mobile, where a viewport-centre hook
 * already drives it) to switch it off.
 */
import { useEffect, useState } from 'react';

export function useScrollFocus(
  ref: React.RefObject<HTMLElement | null>,
  count: number,
  enabled = true,
): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || count <= 0) return;
    const inner = ref.current;
    if (!inner) return;
    // Prefer a FocusScroll ancestor (the section LOCKS/sticks, then scrubs). If there isn't one,
    // fall back to tracking this element as it passes through the viewport (non-sticky).
    const scroller = inner.closest('[data-focus-scroll]') as HTMLElement | null;
    const el = scroller ?? inner;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let progress: number;
      if (scroller) {
        // Locked range: 0 the instant the section sticks (top at 0), 1 when its bottom reaches
        // the viewport bottom (about to release). Item 0 is in focus the moment it locks.
        const range = rect.height - vh;
        const raw = range > 0 ? -rect.top / range : 0;
        // Only the first `cycleFraction` of the locked range cycles the items; the rest is the
        // tail hold, so dividing by it makes progress reach 1 early and the last item lingers.
        const cf = parseFloat(scroller.dataset.focusCycle || '1') || 1;
        progress = Math.max(0, raw) / cf;
      } else {
        // 0 when the section's TOP is at the viewport centre, 1 when its BOTTOM is.
        progress = (vh / 2 - rect.top) / (rect.height || 1);
      }
      const p = Math.max(0, Math.min(0.9999, progress));
      setIndex(Math.min(count - 1, Math.floor(p * count)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, count, enabled]);

  return index;
}
