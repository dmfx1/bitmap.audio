/* src/components/modules/solutions/DeliverablesGrid.tsx */
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
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
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // --- SEQUENTIAL AUTOPLAY LOGIC (Desktop Visuals Only) ---
  useEffect(() => {
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
  }, [isScanning, autoplayActive, items?.length]);

  // --- HAND-OFF LOGIC ---
  const handleUserInteraction = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setAutoplayActive(false); 
    setActiveAutoIndex(null); 
  };

  const handleUserLeave = () => {
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
        <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-base font-medium">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl font-mono text-foreground tracking-tight px-4 font-light">
          {sectionTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
        {items?.map((item, i) => (
          <DeliverableCard 
            key={i} 
            text={item} 
            isScanning={isScanning} 
            index={i} 
            forcePlay={activeAutoIndex === i}
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
  onUserInteraction,
  onUserLeave
}: { 
  text: string; 
  isScanning: boolean; 
  index: number;
  forcePlay: boolean;
  onUserInteraction: () => void;
  onUserLeave: () => void;
}) {
  const scrambledText = useBinaryScramble(text, isScanning, 40);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Active state logic
  const isActive = forcePlay || isHovered;

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
      ref={cardRef}
      onMouseEnter={() => { onUserInteraction(); setIsHovered(true); }}
      onMouseLeave={() => { onUserLeave(); setIsHovered(false); }}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={cn(
        // Base styling + Mobile behavior
        "mobile-viewport-active relative p-6 overflow-hidden transition-all duration-500 cursor-default",
        "bg-background/40 md:border backdrop-blur-sm",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        
        // --- DESKTOP ACTIVE STATES (`md:`) ---
        // We use md: to ensure this doesn't fight your mobile viewport logic
        isActive 
          ? "md:border-accent md:bg-foreground/10 md:shadow-[0_0_15px_hsl(var(--primary)/0.05)] md:scale-[1.02] z-20" 
          : "md:border-foreground/10 z-10 md:scale-100"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "shrink-0 transition-all duration-500",
          // The tick icon reacts to the active state
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

      {/* Background glow sweep */}
      <div className={cn(
        "absolute inset-0 bg-primary/5 pointer-events-none transition-opacity duration-500",
        isActive ? "md:opacity-100 opacity-0" : "opacity-0"
      )} />

      {/* Tech Corner Accent */}
      <div className={cn(
        "absolute top-0 right-0 w-3 h-3 border-t border-r transition-all duration-700",
        isActive ? "md:border-accent/50 border-transparent" : "border-transparent"
      )} />
    </div>
  );
}