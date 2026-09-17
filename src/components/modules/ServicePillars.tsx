import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileCenterIndex } from '@/hooks/use-mobile-center-index';
import { useTimedFocus } from '@/hooks/use-timed-focus';
import { usePixelRoam } from '@/hooks/use-pixel-roam';
import { BitmapSonicBranding, BitmapUiUxSound, BitmapExperientialAudio } from '../ui/icons';

// Order puts Sonic Branding in the MIDDLE (it's the flagship — pre-highlighted at rest).
const services = [
  {
    icon: BitmapUiUxSound,
    title: "UI/UX Sound",
    href: "/solutions/uiux-sound",
    desc: "Enhance digital products and systems with audio feedback, enhancing trust and confidence in user experience."
  },
  {
    icon: BitmapSonicBranding,
    title: "Sonic Branding",
    href: "/solutions/sonic-branding",
    desc: "Define your brand's audio identity with comprehensive sonic infrastructure that resonates across your entire network."
  },
  {
    icon: BitmapExperientialAudio,
    title: "Spatial Audio",
    href: "/solutions/immersive-audio",
    desc: "Bring experiences to life. We create spatial audio experiences for AR/VR, installations, and experiential environments."
  },
];
const DEFAULT_INDEX = 1; // Sonic Branding (middle)

export default function ServicePillars() {
  const [internalScan, setInternalScan] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile: highlight follows scroll position (nearest to viewport centre). No timer on mobile —
  // scrolling is the interaction.
  const { isMobile, centerIndex, intensities } = useMobileCenterIndex(containerRef, '[data-mobile-center-item]');

  // Desktop: a TIMED loop cycles the focus with a per-card progress bar; hovering a card takes
  // precedence and pauses the loop (reusable useTimedFocus). Runs only while the section is
  // on screen (internalScan) and not on mobile.
  // Continuous, uniform timed cycle with hover-pause (like the Values loop). Progress bars are
  // written straight to the DOM each frame (barRefs) — no per-frame React re-render, so it's smooth.
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { index, hoverProps } = useTimedFocus(services.length, {
    intervalMs: 4500,
    enabled: internalScan && !isMobile,
    initialIndex: DEFAULT_INDEX, // Sonic Branding (middle) pre-highlighted, and held a beat on arrival
    initialHoldMs: 5000,         // dwell on the middle card first (fills via the DOM — no jank)
    resumeFromNext: true,        // leaving a card resumes from the next card
    onProgress: (idx, p) => {
      const bars = barRefs.current;
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        if (b) b.style.setProperty('--progress', String(i === idx ? p : 0));
      }
    },
  });

  // Autoplay runs only when the section is actually IN FOCUS — centred in the viewport AND, on the
  // scene-stage (home), when its cross-faded scene is the VISIBLE one (opacity > 0.5). Until then the
  // middle card (Sonic Branding) stays instantiated and the timer holds. (setInternalScan only
  // re-renders when the boolean flips, so this stays cheap.)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scene = el.closest('[data-scene]') as HTMLElement | null;
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centred = r.top < vh * 0.6 && r.bottom > vh * 0.4;
      const visible = scene ? parseFloat(getComputedStyle(scene).opacity || '1') > 0.5 : true;
      setInternalScan(centred && visible);
    };
    check();
    const lenis = (window as any).__lenis;
    if (lenis?.on) lenis.on('scroll', check);
    const onScroll = () => requestAnimationFrame(check);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (lenis?.off) lenis.off('scroll', check);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Per-pillar background tint the SECTION gradually fades to when that pillar is active. The starter
  // (Sonic Branding, middle) keeps the beige oat; the others drift to a subtle palette tint that still
  // reads with the dark oat text. (null = revert to the theme beige.) These slots can become imagery later.
  const PILLAR_BG: (string | null)[] = [
    'hsl(20, 0%, 100%)', // UI/UX Sound   — soft cool oat (leans to --primary)
    null,                 // Sonic Branding — beige (starter)
    'hsl(50, 10%, 80%)',  // Spatial Audio  — soft warm sand (leans to --accent)
  ];
  const activeIndex = isMobile ? centerIndex : index;
  // Pillars with a full-bleed scene that reveals when active (null = no imagery for that pillar).
  const PERSPECTIVE_IDS: (string | null)[] = ['#uiux-circuit', null, '#spatial-perspective']; // by pillar index
  useEffect(() => {
    const scene = containerRef.current?.closest('[data-scene]') as HTMLElement | null;
    if (!scene) return;
    scene.style.transition = 'background-color 2s ease';
    scene.style.backgroundColor = PILLAR_BG[activeIndex] ?? ''; // '' → back to the theme-oat beige

    // Reveal only the active pillar's grid; hide the others. The pause + slow focus/draw-in is all
    // CSS (transition delays in the *.astro grids); here we just flip the class. Removing it replays
    // the draw next time the pillar becomes active.
    PERSPECTIVE_IDS.forEach((sel, i) => {
      if (!sel) return;
      const el = scene.querySelector(sel) as HTMLElement | null;
      el?.classList.toggle('is-revealing', activeIndex === i);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-[1440px] mx-auto px-4 md:px-10 transition-all duration-1000 ease-out",
        internalScan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* HEADER AREA */}
      <div className="text-center mb-20 mix-blend-difference">
        <h2 className="text-4xl font-mono text-foreground tracking-tight font-light ">
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
              barRef={(el) => { barRefs.current[i] = el; }}
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
  barRef,
  isMobile,
  intensity,
  hoverProps,
}: {
  service: typeof services[0];
  isActive: boolean;
  barRef: (el: HTMLDivElement | null) => void;
  isMobile: boolean;
  intensity: number;
  hoverProps: React.HTMLAttributes<HTMLElement>;
}) {
  const iconRef = useRef<HTMLSpanElement>(null);
  usePixelRoam(iconRef, isActive); // one pixel roams the icon when this pillar becomes active
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
      <span ref={iconRef} className="inline-block mb-8">
        <service.icon
          className={cn(
            "w-8 h-8 block transition-all duration-500",
            isActive
              ? "text-accent scale-110 drop-shadow-[0_0_8px_hsl(var(--accent)/0.5)]"
              : "text-primary"
          )}
        />
      </span>

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
      <div
        ref={barRef}
        className="bitmap-progress mx-auto mt-12"
        style={isMobile ? ({ ['--progress']: isActive ? 1 : 0 } as React.CSSProperties) : undefined}
      />
    </div>
  );
}
