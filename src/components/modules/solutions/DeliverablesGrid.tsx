/* src/components/modules/solutions/DeliverablesGrid.tsx */
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { useMobileCenterIndex } from '@/hooks/use-mobile-center-index';
import { BitmapTick } from '../../ui/icons';

interface DeliverablesGridProps {
  eyebrow?: string;
  sectionTitle?: string;
  items: string[];
  className?: string;
}

export default function DeliverablesGrid({
  eyebrow = "Deliverables",
  sectionTitle = "What you'll receive",
  items,
  className
}: DeliverablesGridProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeAutoIndex, setActiveAutoIndex] = useState<number | null>(null);
  const [autoplayActive, setAutoplayActive] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Equalise card heights after render — measures all cards, sets all to the tallest
  useEffect(() => {
    const equalise = () => {
      if (!gridRef.current) return;
      const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('[data-card]'));
      cards.forEach(c => { c.style.height = ''; }); // reset first so we measure natural height
      const max = cards.reduce((m, c) => Math.max(m, c.offsetHeight), 0);
      if (max > 0) cards.forEach(c => { c.style.height = `${max}px`; });
    };
    equalise();
    window.addEventListener('resize', equalise);
    return () => window.removeEventListener('resize', equalise);
  }, [items]);

  // Mobile: highlight follows scroll position (nearest to viewport center),
  // defaulting to the first card until the user actually scrolls. No timer
  // runs in the background on mobile — scrolling is the interaction.
  const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');

  // --- INTERSECTION OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsScanning(true), 200);
        } else {
          setIsScanning(false);
          setActiveAutoIndex(null);
          setAutoplayActive(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- SEQUENTIAL AUTOPLAY LOGIC (Desktop only — mobile is viewport-driven, no timer) ---
  useEffect(() => {
    if (isMobile) return;
    if (!isScanning || items?.length === 0 || !autoplayActive) return;

    let interval: NodeJS.Timeout;

    const startDelay = setTimeout(() => {
      setActiveAutoIndex(0);

      interval = setInterval(() => {
        setActiveAutoIndex((current) => {
          if (current === null || current >= items.length - 1) return 0;
          return current + 1;
        });
      }, 2500); // Slightly faster interval for smaller list items
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [isScanning, autoplayActive, items?.length, isMobile]);

  // --- HAND-OFF LOGIC (Desktop only — no hover/autoplay hand-off to manage on mobile) ---
  const handleUserInteraction = () => {
    if (isMobile) return;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setAutoplayActive(false);
    setActiveAutoIndex(null);
  };

  const handleUserLeave = () => {
    if (isMobile) return;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setAutoplayActive(true);
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full py-12",
        className
      )}
    >
      <div className="text-center mb-16 space-y-4">
        <p className="hiddentext-eyebrow text-accent uppercase tracking-[0.5em] text-base font-medium">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl font-mono text-foreground tracking-tight px-4 font-light">
          {sectionTitle}
        </h2>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
        {items?.map((item, i) => (
          <DeliverableCard
            key={i}
            text={item}
            isScanning={isScanning}
            index={i}
            forcePlay={activeAutoIndex === i}
            isMobile={isMobile}
            isCentered={centerIndex === i}
            intensity={intensities[i] ?? (i === centerIndex ? 1 : 0)}
            onUserInteraction={handleUserInteraction}
            onUserLeave={handleUserLeave}
          />
        ))}
      </div>
    </div>
  );
}

function DeliverableCard({
  text,
  isScanning,
  index,
  forcePlay,
  isMobile,
  isCentered,
  intensity,
  onUserInteraction,
  onUserLeave
}: {
  text: string;
  isScanning: boolean;
  index: number;
  forcePlay: boolean;
  isMobile: boolean;
  isCentered: boolean;
  intensity: number;
  onUserInteraction: () => void;
  onUserLeave: () => void;
}) {
  const scrambledText = useBinaryScramble(text, isScanning, 40);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Desktop: hover or the autoplay timer. Mobile: purely whichever card is
  // nearest viewport center — no timer to fall back to.
  const isActive = isMobile ? isCentered : (forcePlay || isHovered);

  // Fade-in observer
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-card
      data-mobile-center-item
      ref={cardRef}
      onMouseEnter={() => { onUserInteraction(); setIsHovered(true); }}
      onMouseLeave={() => { onUserLeave(); setIsHovered(false); }}
      style={{
        transitionDelay: `${index * 100}ms`,
        ...(isMobile ? {
          // Background tint + scale track scroll continuously (mirrors the
          // Values.tsx/ServicePillars.tsx/ConceptGrid.tsx fix) — border, icon,
          // text colour and the glow sweep below stay a discrete swap on isActive.
          backgroundColor: `hsl(var(--background) / ${(0.4 + intensity * 0.3).toFixed(3)})`,
          transform: `scale(${(1 + intensity * 0.02).toFixed(4)})`,
          transitionDuration: '150ms',
        } : {}),
      }}
      className={cn(
        // Base styling + Mobile behavior
        "mobile-viewport-active relative p-6 overflow-hidden border transition-all duration-500 cursor-default",
        "bg-background/40 backdrop-blur-sm",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",

        // --- ACTIVE STATE --- border/shadow now apply on mobile too (previously
        // md:-only — mobile is no longer left with just the glow ring), driven
        // by isCentered instead of the timer. bg lift + scale stay desktop-only
        // Tailwind classes since mobile gets those continuously via inline style above.
        isActive
          ? cn("border-accent shadow-[0_0_15px_hsl(var(--primary)/0.05)] z-20", !isMobile && "md:bg-foreground/10 md:scale-[1.02]")
          : cn("border-foreground/10 z-10", !isMobile && "md:scale-100")
      )}
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className={cn(
          "shrink-0 mt-0.5 transition-all duration-500",
          isActive ? "md:scale-110 text-accent md:drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]" : "text-accent/50"
        )}>
            <BitmapTick className="w-5 h-5" />
        </div>

        <span className={cn(
          "font-mono text-sm uppercase tracking-wider transition-colors duration-300",
          isActive ? "md:text-accent text-foreground" : "text-foreground"
        )}>
          {scrambledText}
        </span>
      </div>

      {/* Background glow sweep — continuous on mobile (tracks intensity), discrete on desktop */}
      <div
        style={isMobile ? { opacity: intensity * 0.6, transitionDuration: '150ms' } : undefined}
        className={cn(
          "absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-500",
          !isMobile && (isActive ? "opacity-100" : "opacity-0")
        )}
      />

      {/* Tech Corner Accent — now shows on mobile too, driven by isCentered */}
      <div className={cn(
        "absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-700",
        isActive ? "border-accent/50" : "border-transparent"
      )} />
    </div>
  );
}