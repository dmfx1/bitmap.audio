/* src/hooks/use-mobile-center-index.ts */
import { useEffect, useRef, useState } from 'react';

/**
 * Tracks which child of a container is closest to the vertical center of the
 * viewport, on mobile only (<768px, matching the site's breakpoint convention).
 *
 * Design rules:
 * - Defaults to index 0 (the first item) and NEVER recalculates on mount —
 *   only real scroll/resize events move it. On mobile, the first item in a
 *   stack is always the default highlight until the user actually scrolls.
 * - isMobile is tracked reactively (matchMedia), so resizing/rotating across
 *   the breakpoint switches modes correctly without a page reload.
 * - Also returns `intensities` — a continuous 0-1 proximity value per item
 *   (same linear falloff formula as Layout.astro's --glow-intensity mechanism:
 *   1 - distance / (viewportHeight * 0.5), floored at 0). Use this to drive a
 *   smooth crossfade (opacity/scale) instead of a hard on/off switch — the
 *   discrete `centerIndex` is still there for anything that needs a single
 *   definitive "winner" (e.g. gating a video play/pause call).
 * - `intensities` is empty until the first scroll/resize measurement — fall
 *   back to `intensities[i] ?? (i === centerIndex ? 1 : 0)` in consumers so
 *   the pre-scroll default (item 0 fully highlighted) still holds.
 *
 * Usage:
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');
 *   const displayIndex = isMobile ? centerIndex : (hoveredIndex ?? activeIndex);
 *   const intensity = intensities[i] ?? (i === centerIndex ? 1 : 0);
 */
export function useMobileCenterIndex(
  containerRef: React.RefObject<HTMLElement | null>,
  itemSelector: string
): { isMobile: boolean; centerIndex: number; intensities: number[] } {
  const [isMobile, setIsMobile] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const [intensities, setIntensities] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);

  // Reactive mobile detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Scroll/resize-driven center tracking — only while mobile
  useEffect(() => {
    if (!isMobile) return;

    const update = () => {
      const container = containerRef.current;
      if (!container) return;

      const items = container.querySelectorAll<HTMLElement>(itemSelector);
      if (items.length === 0) return;

      // Prefer visualViewport height where available — on mobile, the address
      // bar showing/hiding changes window.innerHeight without always firing a
      // resize event, so visualViewport is the more reliable "what's actually
      // visible right now" figure.
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const maxDistance = viewportHeight * 0.5;
      let closestIndex = 0;
      let closestDistance = Infinity;
      const nextIntensities: number[] = [];

      items.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elCenter - viewportCenter);
        nextIntensities.push(Math.max(0, 1 - distance / maxDistance));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      // Last-item bottom-of-page fix: if a grid's last card is the tail end of
      // the page (e.g. no footer/section after it), the page can run out of
      // scroll room before that card's midpoint ever reaches true viewport
      // center. Turns out the middle card can legitimately stay the closer-to-
      // center one by raw distance *forever* in that situation (there's simply
      // no scroll position where the last card's own center gets nearer than
      // the previous card's) — so gating this on "last card already winning"
      // doesn't fire. Once the page truly can't scroll any further, the last
      // card is what the user has arrived at, full stop — force it active
      // unconditionally, not just when the distance math already favoured it.
      // Guarded by the last item actually being on-screen, so this doesn't
      // hijack some other unrelated grid further up a page that also happens
      // to render while global scroll is at the bottom.
      const lastIndex = items.length - 1;
      const maxScrollY = document.documentElement.scrollHeight - viewportHeight;
      const atPageBottom = window.scrollY >= maxScrollY - 32;
      if (atPageBottom) {
        const lastRect = items[lastIndex].getBoundingClientRect();
        const lastItemOnScreen = lastRect.bottom > 0 && lastRect.top < viewportHeight;
        if (lastItemOnScreen) {
          closestIndex = lastIndex;
          nextIntensities[lastIndex] = 1;
        }
      }

      setCenterIndex(prev => (prev === closestIndex ? prev : closestIndex));
      setIntensities(nextIntensities);
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    // Trailing settle re-check: mobile momentum/rubber-band scrolling can stop
    // firing 'scroll' events slightly before the page's true final rest
    // position (or the address bar finishes collapsing a moment after scroll
    // events stop), so the very last computed frame can be marginally off.
    // Re-measure ~200ms after the last scroll event to catch the settled state.
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScrollSettle = () => {
      onScroll();
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(update, 200);
    };

    // Deliberately NOT calling update() here — default stays index 0 (and an
    // empty intensities array, which consumers treat as "item 0 = full") until
    // the user actually scrolls or resizes.
    window.addEventListener('scroll', onScrollSettle, { passive: true });
    window.addEventListener('resize', onScrollSettle, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollSettle);
      window.removeEventListener('resize', onScrollSettle);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [isMobile, containerRef, itemSelector]);

  // Reset to default (index 0, no measurements) when leaving mobile, so
  // switching back later is clean
  useEffect(() => {
    if (!isMobile) {
      setCenterIndex(0);
      setIntensities([]);
    }
  }, [isMobile]);

  return { isMobile, centerIndex, intensities };
}
