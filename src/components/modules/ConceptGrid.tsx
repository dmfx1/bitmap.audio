import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { BitmapMail, BitmapMap, BitmapArrow, BitmapChevron, BitmapNode, BitmapTick } from '../ui/icons'; 

const ICON_MAP: Record<string, React.ElementType> = {
  mail: BitmapMail,
  map: BitmapMap,
  arrow: BitmapArrow,
  chevron: BitmapChevron,
  node: BitmapNode,
  tick: BitmapTick,
};

export interface Concept {
  id: number; 
  title: string;    
  subtitle?: string; 
  desc: string;
  icon?: string;
  vimeoId?: string;
  mobileVimeoId?: string | null; 
  previewVideo?: string;
  previewVideoMp4?: string;
}

interface ConceptGridProps {
  eyebrow?: string;
  sectionTitle?: string;
  items: Concept[];
  className?: string;
  isScanning?: boolean; 
  onProjectClick?: (item: Concept) => void;
}

export default function ConceptGrid({ 
  eyebrow, 
  sectionTitle, 
  items = [], 
  className, 
  isScanning: propIsScanning, 
  onProjectClick 
}: ConceptGridProps) {
  const [internalScan, setInternalScan] = useState(false);
  const [activeAutoIndex, setActiveAutoIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeScan = propIsScanning ?? internalScan;

  // --- SEQUENTIAL AUTOPLAY LOGIC ---
  useEffect(() => {
    if (!activeScan || items.length === 0) return;

    let interval: NodeJS.Timeout;

    // 1. Initial Delay (Wait 5s before starting the sequence)
    const startDelay = setTimeout(() => {
      setActiveAutoIndex(0); // Start on the first (left) thumbnail

      // 2. Start the rotation ONLY after the first one has played
      interval = setInterval(() => {
        setActiveAutoIndex((current) => {
          if (current === null || current >= items.length - 1) return 0;
          return current + 1;
        });
      }, 3500); // Duration each card stays active
    }, 2500); // Initial entrance delay

    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [activeScan, items.length]);

  const getGridConfig = () => {
    const count = items.length;
    if (count === 1) return "md:grid-cols-1 max-w-2xl"; 
    if (count === 2) return "md:grid-cols-2 max-w-5xl"; 
    return "md:grid-cols-3 max-w-6xl"; 
  };

  useEffect(() => {
    if (propIsScanning !== undefined) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInternalScan(true), 800);
        } else {
          setInternalScan(false);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [propIsScanning]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "w-full py-12 transition-all duration-1000 ease-out", 
        activeScan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4", 
        className
      )}
    >
      {(eyebrow || sectionTitle) && (
        <div className="text-center mb-16 space-y-4">
          {eyebrow && (
            <p className="text-accent uppercase tracking-[0.5em] text-[10px] font-mono">
              {eyebrow}
            </p>
          )}
          {sectionTitle && (
            <h2 className="text-3xl md:text-4xl font-mono text-foreground tracking-tight px-4 font-light">
              {sectionTitle}
            </h2>
          )}
        </div>
      )}

      <div className={cn(
        "grid grid-cols-1 gap-6 md:gap-8 mx-auto w-full text-left p-4",
        getGridConfig()
      )}>
        {items.map((item, index) => (
          <ProjectCard 
            key={item.id || index} 
            item={item} 
            isScanning={activeScan} 
            forcePlay={activeAutoIndex === index}
            // If user interacts with a card, kill the auto-sequence
            onUserInteraction={() => setActiveAutoIndex(null)}
            onClick={item.vimeoId && onProjectClick ? () => onProjectClick(item) : undefined} 
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ 
    item, 
    onClick, 
    isScanning, 
    forcePlay, 
    onUserInteraction 
  }: { 
    item: Concept; 
    onClick?: () => void; 
    isScanning: boolean; 
    forcePlay: boolean; 
    onUserInteraction: () => void;
  }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const Icon = item.icon ? ICON_MAP[item.icon] : null;

  const scrambledTitle = useBinaryScramble(item.title, isScanning, 40);
  const scrambledDesc = useBinaryScramble(item.desc, isScanning, 60);

  const shouldBePlaying = isHovered || forcePlay;

  useEffect(() => {
    if (shouldBePlaying) {
      videoRef.current?.play().catch(() => {});
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [shouldBePlaying]);

  const hasVideo = item.previewVideo || item.previewVideoMp4;

  return (
    <div className="relative w-full h-full min-h-[200px]">
      <div 
        onMouseEnter={() => { onUserInteraction(); setIsHovered(true); }} 
        onMouseLeave={() => setIsHovered(false)} 
        onClick={onClick} 
        className={cn(
          // ADDED: 'cursor-pointer' to trigger the button's cursor logic
          // ADDED: 'transition-transform' to match button feel
          "absolute inset-0 group p-8 md:p-10 border transition-all duration-500 ease-out overflow-hidden flex flex-col justify-between cursor-pointer",
          "bg-card/90 backdrop-blur-md shadow-lg",
          shouldBePlaying ? "border-accent scale-[1.05] z-50 shadow-2xl" : "border-muted-foreground z-10 scale-100",
        )}
      >
        {/* --- THE CORNER ACCENT: ICON SWAP --- */}
        <div className={cn(
          "absolute top-1 right-1 w-8 h-8 transition-all duration-500 flex items-center justify-center",
          "border-t-2 border-r-2",
          shouldBePlaying ? "border-accent" : "border-muted-foreground/20"
        )}>
          <div className="flex items-center justify-center w-full h-full ">
            {shouldBePlaying ? (
              /* Active State: Chevron */
              <BitmapNode 
                className="w-6 h-6 text-accent" 
              />
            ) : (
              /* Idle State: Node */
              <BitmapNode 
                className="w-2 h-2 text-muted-foreground opacity-30" 
              />
            )}
          </div>
        </div>

        {/* Video Preview */}
        {hasVideo && (
          <div className={cn(
            "absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none mix-blend-overlay", 
            shouldBePlaying ? "opacity-40" : "opacity-0"
          )}>
            <video 
              ref={videoRef} 
              muted loop playsInline 
              src={item.previewVideoMp4 || item.previewVideo} 
              className="w-full h-full object-cover grayscale contrast-125" 
            />
          </div>
        )}

        <div className="relative z-10 pointer-events-none flex flex-col h-full justify-between">
          <div>
            {Icon && (
              <div className={cn("mb-6 transition-all duration-500", shouldBePlaying ? "text-accent" : "text-primary")}>
                <Icon className="w-8 h-8" />
              </div>
            )}
            <h3 className={cn(
              "font-mono text-base uppercase tracking-[0.2em] mb-3 transition-colors duration-300 px-1 -mx-1", 
              shouldBePlaying ? "text-accent bg-primary/10" : "text-primary"
            )}>
              {scrambledTitle}
            </h3>
          </div>
          
          <div className="mt-4">
            <p className={cn(
              "font-mono transition-all duration-500 px-2 -mx-2",
              shouldBePlaying 
                ? "label-tape [--tape-opacity:0.75] text-background" 
                : "text-foreground text-sm leading-relaxed font-light"
            )}>
              {scrambledDesc}
            </p>
          </div>

          {forcePlay && !isHovered && (
            <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-full animate-progress-reveal origin-left" />
          )}
        </div>
      </div>
    </div>
  );
}