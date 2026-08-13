import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileCenterIndex } from '@/hooks/use-mobile-center-index';
import { useScrollFocus } from '@/hooks/use-scroll-focus';
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
    desc: "Enhance digital products and systems with audio feedback and interface sounds, enhancing trust and confidence in user experience."
  },
  {
    icon: BitmapExperientialAudio,
    title: "Experiential Audio",
    href: "/solutions/immersive-audio",
    desc: "Bring experiences to life. We create spatial audio experiences for AR/VR, installations, and experiential environments."
  },
];

export default function ServicePillars() {
  const [internalScan, setInternalScan] = useState(false);
  const [activeAutoIndex, setActiveAutoIndex] = useState<number | null>(0);
  
  // NEW: State to track if the system should keep auto-playing
  const [autoplayActive, setAutoplayActive] = useState(true); 
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile: highlight follows scroll position (nearest to viewport center),
  // defaulting to the first card until the user actually scrolls. No timer
  // runs in the background on mobile — scrolling is the interaction.
  const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');

  // Desktop: which pillar is in focus is driven by SCROLL position (reusable useScrollFocus —
  // the same "scroll cycles the highlight" idea as the Values focus columns, applied to this
  // design). Replaces the old autoplay timer. Mobile keeps its viewport-centre driver above.
  const scrollIndex = useScrollFocus(containerRef, services.length, !isMobile);

  // --- INTERSECTION OBSERVER ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInternalScan(true), 400);
        } else {
          setInternalScan(false);
          setActiveAutoIndex(null);
          setAutoplayActive(true); // Reset autoplay if they scroll completely away and come back
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Desktop focus is now scroll-driven (scrollIndex above) — no autoplay timer.

  // REPLACE your old handleUserInteraction with these two functions
  const handleUserInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current); // Kill the resume countdown
    setAutoplayActive(false); // Stop the scanner
    setActiveAutoIndex(null); // Clear the highlight
  };

  const handleUserLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // Start a countdown to resume the scanner after 2.5 seconds of inactivity
    resumeTimerRef.current = setTimeout(() => {
      setAutoplayActive(true);
    }, 2500); 
  };

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
        <p className="font-mono text-accent text-base tracking-[0.2em] uppercase mb-4">
          What We Do
        </p>
        <h2 className="text-4xl font-mono text-foreground tracking-tight font-light">
          Three pillars of sonic design
        </h2>
      </div>

      {/* GRID AREA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <ServiceCard
            key={i}
            service={s}
            forcePlay={scrollIndex === i}
            isMobile={isMobile}
            isCentered={centerIndex === i}
            intensity={intensities[i] ?? (i === centerIndex ? 1 : 0)}
            onUserInteraction={handleUserInteraction} // Passed down to the cards
            onUserLeave={handleUserLeave} // <--- Pass the new prop here
          />
        ))}
      </div>
    </div>
  );
}

// --- EXTRACTED CARD COMPONENT ---
function ServiceCard({
  service,
  forcePlay,
  isMobile,
  isCentered,
  intensity,
  onUserInteraction,
  onUserLeave // <--- Accept the new prop
}: {
  service: typeof services[0];
  forcePlay: boolean;
  isMobile: boolean;
  isCentered: boolean;
  intensity: number;
  onUserInteraction: () => void;
  onUserLeave: () => void; // <--- Add to type definition
}) {
  const [isHovered, setIsHovered] = useState(false);
  // Desktop: hover or the autoplay timer. Mobile: purely whichever card is
  // nearest viewport center — no timer to fall back to.
  const isActive = isMobile ? isCentered : (forcePlay || isHovered);

  return (
    <a
      href={service.href} // The whole card is now the link
      data-mobile-center-item
      onMouseEnter={() => { onUserInteraction(); setIsHovered(true); }}
      onMouseLeave={() => { onUserLeave(); setIsHovered(false); }} // Fire the resume timer
      style={isMobile ? {
        // Background/scale track scroll continuously so the highlight reads as
        // a fade as the spotlight moves, not a switch — mirrors the Values.tsx
        // fix. Border/icon/text colour below stay a discrete swap on isActive.
        backgroundColor: `hsl(var(--background) / ${(0.4 + intensity * 0.4).toFixed(3)})`,
        transform: `scale(${(1 + intensity * 0.02).toFixed(4)})`,
        transitionDuration: '150ms',
      } : undefined}
      className={cn(
        "relative flex flex-col p-6 md:p-12 pb-14 md:pb-20 transition-all duration-500 overflow-hidden border cursor-pointer block focus:outline-none focus:ring-1 focus:ring-accent",
        !isMobile && "bg-background/40 backdrop-blur-sm",
        isMobile && "backdrop-blur-sm",
        isActive
          ? cn("border-accent shadow-[0_0_40px_hsl(var(--accent)/0.2)] z-20", !isMobile && "bg-background/80 scale-[1.06] opacity-100")
          : cn("border-border/20 z-10", !isMobile && "scale-95 opacity-60")
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
      
      <p className="font-sans text-muted-foreground text-lg font-light leading-relaxed">
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

      {/* ELECTRIFIED FOOTER LINE */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-[3px] bg-accent transition-all duration-500 shadow-[0_0_15px_hsl(var(--accent)/0.6)]",
          isActive ? "w-full brightness-150" : "w-0"
        )} 
      />
    </a>
  );
}