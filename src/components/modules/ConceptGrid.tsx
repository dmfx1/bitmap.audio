import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { BitmapMail, BitmapMap } from '../ui/icons'; 

const ICON_MAP: Record<string, React.ElementType> = {
  mail: BitmapMail,
  map: BitmapMap,
};

// FIXED: 'id' is now required (removed the ?)
// FIXED: 'mobileVimeoId' explicitly allows null
export interface Concept {
  id: number; 
  title: string;    
  subtitle?: string; 
  desc: string;
  icon?: string;
  vimeoId?: string;
  mobileVimeoId?: string | null; 
  previewVideoWebm?: string;
  previewVideoMp4?: string;
  previewVideo?: string; 
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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeScan = propIsScanning ?? internalScan;

  const getGridConfig = () => {
    const count = items.length;
    if (count === 1) return "md:grid-cols-1 max-w-2xl"; 
    if (count === 2) return "md:grid-cols-2 max-w-5xl"; 
    if (count === 3) return "md:grid-cols-3 max-w-6xl"; 
    return "md:grid-cols-2 max-w-6xl"; 
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
            <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-[10px] font-medium">
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
            key={index} 
            item={item} 
            isScanning={activeScan} 
            onClick={item.vimeoId && onProjectClick ? () => onProjectClick(item) : undefined} 
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ item, onClick, isScanning }: { item: Concept; onClick?: () => void; isScanning: boolean; }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const Icon = item.icon ? ICON_MAP[item.icon] : null;

  const scrambledTitle = useBinaryScramble(item.title, isScanning, 40);
  const scrambledSubtitle = useBinaryScramble(item.subtitle || "", isScanning, 50);
  const scrambledDesc = useBinaryScramble(item.desc, isScanning, 60);

  const handleMouseEnter = () => {
    if (!onClick) return;
    setIsHovered(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  const hasVideo = item.previewVideo || item.previewVideoMp4;

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={onClick} 
      className={cn(
        "concept-card group relative p-8 md:p-10 border transition-all duration-500 ease-out overflow-hidden z-10",
        "bg-card/90 backdrop-blur-md border-muted-foreground shadow-lg",
        onClick ? [
          "cursor-none",
          "hover:scale-[1.03]", 
          "hover:-translate-y-2", 
          "hover:border-accent", 
          "hover:bg-card/95", 
          "hover:shadow-[0_20px_80px_-10px_hsl(var(--accent)/0.3)]", 
          "hover:z-50" 
        ] : "cursor-default"
      )}
    >
      <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-foreground group-hover:border-accent transition-colors duration-300 z-20" />

      {hasVideo && (
        <div className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none mix-blend-overlay", 
          isHovered ? "opacity-40" : "opacity-0"
        )}>
          <video 
            ref={videoRef} 
            muted loop playsInline 
            src={item.previewVideoMp4 || item.previewVideo} 
            className="w-full h-full object-cover grayscale contrast-125" 
          />
        </div>
      )}

      <div className="relative z-10 pointer-events-none flex flex-col h-full justify-top">
        <div>
          {Icon && (
            <div className="mb-6 text-primary/70 group-hover:text-accent transition-colors duration-500 group-hover:scale-110 origin-left transform">
              <Icon className="w-8 h-8" />
            </div>
          )}

          <h3 className="text-primary font-mono text-base uppercase tracking-[0.2em] mb-3 min-h-[1em] group-hover:text-accent transition-colors duration-300">
            {scrambledTitle}
          </h3>

          {item.subtitle && (
            <p className="text-foreground font-mono text-xl tracking-tight mb-4">
              {scrambledSubtitle}
            </p>
          )}
        </div>
        
        <p className="text-sm text-foreground font-mono leading-relaxed font-light group-hover:text-foreground transition-colors duration-500 mt-4">
          {scrambledDesc}
        </p>
      </div>
    </div>
  );
}