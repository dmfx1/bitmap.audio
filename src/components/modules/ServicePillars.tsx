import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileCenterIndex } from '@/hooks/use-mobile-center-index';
import { useTimedFocus } from '@/hooks/use-timed-focus';
import { BitmapSonicBranding, BitmapUiUxSound, BitmapExperientialAudio } from '../ui/icons';

const services = [
  {
    icon: BitmapSonicBranding,
    title: "Sonic Branding",
    href: "/solutions/sonic-branding",
    desc: "Define your brand's audio identity with comprehensive sonic infrastructure that resonates across your entire network."
  },
  {
    icon: BitmapUiUxSound,
    title: "UI/UX Sound",
    href: "/solutions/uiux-sound",
    desc: "Enhance digital products and systems with audio feedback, enhancing trust and confidence in user experience."
  },
  {
    icon: BitmapExperientialAudio,
    title: "Spatial Audio",
    href: "/solutions/immersive-audio",
    desc: "Bring experiences to life. We create spatial audio experiences for AR/VR, installations, and experiential environments."
  },
];

export default function ServicePillars() {
  const [internalScan, setInternalScan] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile: highlight follows scroll position (nearest to viewport centre). No timer on mobile —
  // scrolling is the interaction.
  const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');

  // Desktop: a TIMED loop cycles the focus with a per-card progress bar; hovering a card takes
  // precedence and pauses the loop (reusable useTimedFocus). Runs only while the section is
  // on screen (internalScan) and not on mobile.
  const { index, progress, hoverProps } = useTimedFocus(services.length, {
    intervalMs: 4500,
    enabled: internalScan && !isMobile,
  });

  // Reveal on enter + gate the loop to on-screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInternalScan(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-[1440px] mx-auto px-4 md:px-10 transition-all duration-1000 ease-out",
        internalScan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* HEADER AREA */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-mono text-foreground tracking-tight font-light">
          Three pillars of sonic design
        </h2>
      </div>

      {/* GRID AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => {
          const active = isMobile ? centerIndex === i : index === i;
          return (
            <ServiceCard
              key={i}
              service={s}
              isActive={active}
              // The active card's progress bar fills with the timer (full on mobile / hover).
              progress={active ? (isMobile ? 1 : progress) : 0}
              isMobile={isMobile}
              intensity={intensities[i] ?? (i === centerIndex ? 1 : 0)}
              hoverProps={isMobile ? {} : hoverProps(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

// --- EXTRACTED CARD COMPONENT ---
function ServiceCard({
  service,
  isActive,
  progress,
  isMobile,
  intensity,
  hoverProps,
}: {
  service: typeof services[0];
  isActive: boolean;
  progress: number;
  isMobile: boolean;
  intensity: number;
  hoverProps: React.HTMLAttributes<HTMLElement>;
}) {
  return (
    <div className="flex flex-col">
    <a
      href={service.href}
      data-mobile-center-item
      {...hoverProps}
      style={isMobile ? {
        backgroundColor: `hsl(var(--background) / ${(0.4 + intensity * 0.4).toFixed(3)})`,
        transform: `scale(${(1 + intensity * 0.02).toFixed(4)})`,
        transitionDuration: '150ms',
      } : undefined}
      className={cn(
        "relative flex flex-col p-6 md:p-12 pb-14 md:pb-20 transition-all duration-500 overflow-hidden border-[8px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent",
        !isMobile && "bg-background/40 backdrop-blur-sm",
        isMobile && "backdrop-blur-sm",
        isActive
          ? cn("border-accent shadow-[0_0_40px_hsl(var(--accent)/0.2)] z-20", !isMobile && "bg-background/80 scale-[1.06] opacity-100")
          : cn("border-border z-10", !isMobile && "scale-95 opacity-60")
      )}
    >
      {/* ICON */}
      <service.icon
        className={cn(
          "w-8 h-8 mb-8 transition-all duration-500",
          isActive
            ? "text-accent scale-110 drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]"
            : "text-primary"
        )}
      />

      {/* TEXT */}
      <h3 className={cn(
        "font-mono text-xl mb-4 tracking-tight transition-all duration-300",
        isActive ? "text-accent font-bold" : "text-foreground font-medium"
      )}>
        {service.title}
      </h3>

      <p className="font-mono text-muted-foreground text-lg font-light leading-relaxed">
        {service.desc}
      </p>

      {/* LEARN MORE — pinned at fixed distance from bottom, matching icon distance from top */}
      <div className="absolute bottom-6 md:bottom-10 left-6 md:left-12">
        <span
          className={cn(
            "inline-flex items-center gap-3 text-sm font-mono tracking-[0.2em] uppercase transition-colors",
            isActive ? "text-accent" : "text-primary"
          )}
        >
          LEARN MORE
          <ArrowRight className={cn(
            "w-4 h-4 transition-transform duration-300",
            isActive ? "translate-x-2" : "translate-x-0"
          )} />
        </span>
      </div>
    </a>

      {/* PROGRESS BAR — UNDER (outside) the card block: a scaleX fill driven by the autoplay timer
          for the active card (full while hovered). */}
      <div className="bitmap-progress mx-auto mt-12" style={{ ['--progress']: progress } as React.CSSProperties} />
    </div>
  );
}
