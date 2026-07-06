/* src/components/modules/Values.tsx */
import React, { useState, useEffect, useRef } from 'react';
import { useMobileCenterIndex } from '@/hooks/use-mobile-center-index';

const values = [
  {
    id: "01",
    title: "Precision",
    desc: "Every frequency is intentional. We engineer our smallest data points with precision to ensure the collective experience is fresh and engaging."
  },
  {
    id: "02",
    title: "Empathy",
    desc: "We design for humans. Sound should feel intuitive, not intrusive and systems should be collaborative to ensure user interaction is seamless and enjoyable."
  },
  {
    id: "03",
    title: "Innovation",
    desc: "By breaking sounds down to their fundamental components, we build sonic systems that remain adaptable across your organisation and allow scope for future development."
  }
];

const CYCLE_MS = 10000;

export default function Values() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mobile: highlight follows scroll position (nearest to viewport center),
  // defaulting to the first item until the user actually scrolls. No timer
  // runs in the background on mobile — scrolling is the interaction.
  const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');

  const stopCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startCycle = () => {
    if (isMobile) return; // desktop-only ambient cycle
    stopCycle();
    intervalRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % values.length);
    }, CYCLE_MS);
  };

  // Start cycle when section enters viewport, pause when it leaves (desktop only)
  useEffect(() => {
    if (isMobile) { stopCycle(); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCycle();
        } else {
          stopCycle();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      stopCycle();
    };
  }, [isMobile]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    startCycle();
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    stopCycle(); // pause while user is reading
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    startCycle(); // resume from current activeIndex
  };

  // Desktop: hover takes precedence over the auto-cycle for display.
  // Mobile: viewport-centered item wins, always (no timer to fall back to).
  const displayIndex = isMobile ? centerIndex : (hoveredIndex ?? activeIndex);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="text-center mb-16 md:mb-10">
        <p className="text-base font-mono tracking-[0.5em] uppercase text-accent">
          Our Values
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
        {values.map((v, i) => {
          const isActive = i === displayIndex;
          // Mobile: opacity tracks scroll continuously (proximity to viewport
          // center) instead of snapping between two fixed values — reads as a
          // fade as the spotlight moves, not a switch. Desktop keeps the
          // discrete opacity-100/opacity-25 Tailwind classes driven by isActive.
          const intensity = intensities[i] ?? (i === centerIndex ? 1 : 0);
          const mobileOpacity = 0.25 + intensity * 0.75;
          return (
            <div
              key={v.id}
              data-mobile-center-item
              onClick={() => handleClick(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              style={isMobile ? { opacity: mobileOpacity, transitionDuration: '150ms' } : undefined}
              className={`flex flex-col items-center text-center px-4 cursor-pointer transition-all duration-700 ${
                isActive ? 'opacity-100' : 'opacity-25 hover:opacity-50'
              }`}
            >
              <span className={`font-mono text-5xl md:text-6xl font-light mb-6 transition-all duration-700 ${
                isActive
                  ? 'text-foreground drop-shadow-[0_0_15px_rgba(0,229,255,0.4)] values-slow-pulse'
                  : 'text-foreground'
              }`}>
                {v.id}
              </span>

              <h3 className={`font-mono text-xl md:text-2xl mb-4 tracking-tight transition-all duration-700 ${
                isActive ? 'text-primary' : 'text-foreground'
              }`}>
                {v.title}
              </h3>

              <p className="max-w-[280px] w-full text-base font-mono text-justify">
                {v.desc}
              </p>

              {/* Progress bar — animated fill on desktop (tracks CYCLE_MS timer, pauses on hover).
                  On mobile there's no timer to animate against, so the active item just shows
                  a static solid bar (same look as the desktop paused/hover state). */}
              <div className="mt-6 w-12 h-px bg-foreground/10 relative overflow-hidden">
                {isActive && !isMobile && hoveredIndex === null && (
                  <div
                    key={`${v.id}-${activeIndex}`}
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ animation: `fillBar ${CYCLE_MS}ms linear forwards` }}
                  />
                )}
                {isActive && (isMobile || hoveredIndex !== null) && (
                  <div className="absolute inset-y-0 left-0 bg-accent w-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .values-slow-pulse {
          animation: valuesPulse 4s ease-in-out infinite;
        }
        @keyframes valuesPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
