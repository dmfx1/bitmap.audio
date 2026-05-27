import React, { useState, useRef, useEffect } from 'react';
import { Radio, Layers, Headphones, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  { 
    icon: Radio, 
    title: "Sonic Branding", 
    href: "/solutions/sonic-branding",
    desc: "Define your brand's audio identity with comprehensive sonic infrastructure that resonates across your entire network."
  },
  { 
    icon: Layers, 
    title: "UI/UX Sound", 
    href: "/solutions/uiux-sound",
    desc: "Enhance digital products and systems with audio feedback and interface sounds, enhancing trust and confidence in user experience."
  },
  { 
    icon: Headphones, 
    title: "Experiential Audio", 
    href: "/solutions/immersive-audio",
    desc: "Create spatial audio experiences for AR/VR, installations, and experiential environments."
  },
];

export default function ServicePillars() {
  const [internalScan, setInternalScan] = useState(false);
  const [activeAutoIndex, setActiveAutoIndex] = useState<number | null>(null);
  
  // NEW: State to track if the system should keep auto-playing
  const [autoplayActive, setAutoplayActive] = useState(true); 
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // --- SEQUENTIAL AUTOPLAY LOGIC ---
  useEffect(() => {
    // NEW: If autoplayActive is false, we instantly return and kill the interval
    if (!internalScan || services.length === 0 || !autoplayActive) return;

    let interval: NodeJS.Timeout;

    const startDelay = setTimeout(() => {
      setActiveAutoIndex(0);

      interval = setInterval(() => {
        setActiveAutoIndex((current) => {
          if (current === null || current >= services.length - 1) return 0;
          return current + 1;
        });
      }, 3500);
    }, 2000); 

    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [internalScan, autoplayActive]); // Added autoplayActive to dependencies

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
        <p className="font-mono text-accent text-sm tracking-[0.2em] uppercase mb-4">
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
            forcePlay={activeAutoIndex === i}
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
  onUserInteraction,
  onUserLeave // <--- Accept the new prop
}: { 
  service: typeof services[0]; 
  forcePlay: boolean; 
  onUserInteraction: () => void;
  onUserLeave: () => void; // <--- Add to type definition
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = forcePlay || isHovered;

  return (
    <a 
      href={service.href} // The whole card is now the link
      onMouseEnter={() => { onUserInteraction(); setIsHovered(true); }}
      onMouseLeave={() => { onUserLeave(); setIsHovered(false); }} // Fire the resume timer
      className={cn(
        "relative flex flex-col p-6 md:p-12 pb-14 md:pb-20 transition-all duration-500 overflow-hidden border cursor-pointer block focus:outline-none focus:ring-1 focus:ring-accent",
        "bg-background/40 backdrop-blur-sm",
        isActive
          ? "border-accent bg-background/80 shadow-[0_0_30px_hsl(var(--primary)/0.1)] scale-[1.02] z-20"
          : "border-border/20 z-10 scale-100"
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
        "font-mono text-xl font-medium mb-4 tracking-tight transition-colors duration-300",
        isActive ? "text-accent" : "text-foreground"
      )}>
        {service.title}
      </h3>
      
      <p className="font-sans text-muted-foreground font-light leading-relaxed">
        {service.desc}
      </p>

      {/* LEARN MORE — pinned at fixed distance from bottom, matching icon distance from top */}
      <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12">
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