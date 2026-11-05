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
    promise: "Make products feel human:",
    detail: "Sounds for buttons, confirmations and alerts that match your brand and build trust with every touch.",
    mobileFirst: false
  },
  {
    icon: BitmapSonicBranding,
    title: "Sonic Branding",
    href: "/solutions/sonic-branding",
    promise: "Define how your brand sounds:",
    detail: "Sonic logos, brand music and bespoke audio assets for every touchpoint across your channels.",
    mobileFirst: true // stacks first on mobile; stays the centre card on desktop
  },
  {
    icon: BitmapExperientialAudio,
    title: "Immersive Audio",
    href: "/solutions/immersive-audio",
    promise: "Bring people into your world:",
    detail: "Spatial sound for retail, galleries and installations that moves with them through the space.",
    mobileFirst: false
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
    'linear-gradient(to right, hsl(0 0% 100%), hsl(48 20% 90%))',   // UI/UX   : white → oat
    'linear-gradient(to right, hsl(48 20% 90%), hsl(44 14% 80%))',  // Sonic   : oat → spatial
    'linear-gradient(to right, hsl(44 14% 80%), hsl(42 13% 62%))',  // Spatial : spatial → darker
  ];
  const activeIndex = isMobile ? centerIndex : index;

  // Smooth background: gradients can't CSS-transition, so we cross-fade TWO stacked layers (the new
  // gradient fades up on the back layer as the old fades out). A short debounce means sweeping the
  // mouse ACROSS the gap between cards no longer flashes an in-between pillar.
  const bgLayers = useRef<HTMLDivElement[]>([]);
  const bgFront = useRef(0);
  const applyT = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scene = containerRef.current?.closest('[data-scene]') as HTMLElement | null;
    if (!scene || isMobile) return;
    scene.style.backgroundImage = '';   // layers drive the gradient now
    const mk = () => {
      const d = document.createElement('div');
      d.style.cssText = 'position:absolute;inset:0;z-index:-2;opacity:0;transition:opacity 0.8s ease;pointer-events:none';
      scene.prepend(d);
      return d;
    };
    const a = mk(), b = mk();
    bgLayers.current = [a, b];
    bgFront.current = 0;
    return () => { a.remove(); b.remove(); bgLayers.current = []; };
  }, [isMobile]);

  useEffect(() => {
    const scene = containerRef.current?.closest('[data-scene]') as HTMLElement | null;
    if (!scene) return;
    if (isMobile) { bgLayers.current.forEach((l) => (l.style.opacity = '0')); return; }
    window.clearTimeout(applyT.current);
    applyT.current = window.setTimeout(() => {
      const layers = bgLayers.current;
      if (layers.length === 2) {
        const grad = PILLAR_BG[activeIndex] ?? '';
        const back = layers[1 - bgFront.current];
        back.style.backgroundImage = grad;
        back.style.opacity = grad ? '1' : '0';
        layers[bgFront.current].style.opacity = '0';
        bgFront.current = 1 - bgFront.current;
      }
      scene.querySelector('#sonic-waves')?.classList.toggle('is-revealing', internalScan && activeIndex === 1);
      scene.querySelector('#uiux-nodes')?.classList.toggle('is-revealing', internalScan && activeIndex === 0);
      scene.querySelector('#spatial-depth')?.classList.toggle('is-revealing', internalScan && activeIndex === 2);
    }, 160);
    return () => window.clearTimeout(applyT.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, internalScan, isMobile]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "max-w-[1440px] mx-auto px-4 md:px-10 transition-all duration-1000 ease-out",
        internalScan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* GRID AREA */}
      <div data-pillars-grid className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-8">
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
    <div className={cn("flex flex-col", service.mobileFirst && "order-first md:order-none")}>
    <a
      href={service.href}
      data-mobile-center-item
      {...hoverProps}
      style={isMobile ? {
        backgroundColor: `hsl(var(--background) / ${(0.78 + intensity * 0.18).toFixed(3)})`,
        transform: `scale(${(1 + intensity * 0.02).toFixed(4)})`,
        transitionDuration: '150ms',
      } : undefined}
      className={cn(
        "relative flex-1 flex flex-col p-6 md:p-12 pb-14 md:pb-20 transition-all duration-500 overflow-hidden border-[8px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent",
        !isMobile && "bg-card shadow-[0_12px_40px_-12px_rgba(20,20,20,0.22)]",
        isMobile && "backdrop-blur-sm",
        isActive
          ? cn("border-accent shadow-[0_0_40px_hsl(var(--accent)/0.2)] z-20", !isMobile && "scale-[1.06] opacity-100")
          : cn("border-border z-10", !isMobile && "scale-95 opacity-90")
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

      {/* PROMISE (darker, heavier) then DETAIL on its own line — same font/size/leading as before */}
      <p className="font-mono text-lg leading-relaxed">
        <span className="block text-foreground font-light capitalize">{service.promise}</span>
        <span className={cn(
          "block mt-2 font-light transition-colors duration-300",
          isActive ? "text-muted-foreground" : "text-muted-foreground/50"
        )}>{service.detail}</span>
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
