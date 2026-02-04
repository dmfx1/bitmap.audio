/* src/components/modules/ConceptGrid.tsx */
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';

interface Concept {
  id?: number;
  title: string;
  desc: string;
  vimeoId?: string;
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
  onProjectClick?: (vimeoId: string) => void;
}

export default function ConceptGrid({ 
  eyebrow, 
  sectionTitle, 
  items, 
  className, 
  isScanning: propIsScanning, 
  onProjectClick 
}: ConceptGridProps) {
  const [internalScan, setInternalScan] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine visibility state
  const activeScan = propIsScanning ?? internalScan;

  useEffect(() => {
    // Only apply scroll-based logic if not controlled by HomeHero
    if (propIsScanning !== undefined) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Maintain the 800ms delay for sub-pages
          setTimeout(() => setInternalScan(true), 800);
        } else {
          // Reset when leaving viewport
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
            <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-xs">
              {eyebrow}
            </p>
          )}
          {sectionTitle && (
            <h2 className="text-3xl md:text-4xl font-mono text-white tracking-tight px-4">
              {sectionTitle}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full text-left p-4">
        {items.map((item, index) => (
          <ProjectCard 
            key={index} 
            item={item} 
            isScanning={activeScan} 
            onClick={item.vimeoId && onProjectClick ? () => onProjectClick(item.vimeoId!) : undefined} 
          />
        ))}
      </div>
    </div>
  );
}

/* Internal Sub-component */
function ProjectCard({ item, onClick, isScanning }: { item: Concept; onClick?: () => void; isScanning: boolean; }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrambledTitle = useBinaryScramble(item.title, isScanning, 45);
  const scrambledDesc = useBinaryScramble(item.desc, isScanning, 55);

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
        "concept-card group relative p-8 border border-primary/20 bg-card/30 backdrop-blur-sm transition-all duration-500 ease-out overflow-hidden",
        onClick ? "cursor-none hover:border-primary/80 hover:bg-card/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]" : "cursor-default"
      )}
    >
      {hasVideo && (
        <div className={cn("absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none", isHovered ? "opacity-30" : "opacity-0")}>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            src={item.previewVideoMp4 || item.previewVideo} 
            className="w-full h-full object-cover grayscale brightness-125 contrast-125"
          >
            {item.previewVideoWebm && <source src={item.previewVideoWebm} type="video/webm" />}
            {item.previewVideoMp4 && <source src={item.previewVideoMp4} type="video/mp4" />}
          </video>
          <div className="absolute inset-0 bitmap-grid opacity-30" />
        </div>
      )}

      <div className="relative z-10 pointer-events-none">
        <h3 className="text-accent font-mono text-xs uppercase tracking-[0.3em] mb-4 min-h-[1em]
                   group-hover:text-accent group-hover:brightness-125 group-hover:tracking-[0.4em] transition-all duration-500">
          {scrambledTitle}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed min-h-[4em] group-hover:text-foreground transition-colors duration-500">
          {scrambledDesc}
        </p>

        {onClick && (
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-transparent 
                      group-hover:border-primary/50 transition-all duration-700 delay-100"></div>
        )}
      </div>
    </div>
  );
}