/* src/components/modules/solutions/DeliverablesGrid.tsx */
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { BitmapTick } from '../../ui/icons'; // <--- ADDED

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsScanning(true), 800);
        } else {
          setIsScanning(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full py-12 transition-all duration-1000 ease-out",
        isScanning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <div className="text-center mb-16 space-y-4">
        <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-xs font-medium">
          {eyebrow}
        </p>
        <h2 className="text-3xl md:text-4xl font-mono text-foreground tracking-tight px-4 font-light">
          {sectionTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
        {items?.map((item, i) => (
          <DeliverableCard key={i} text={item} isScanning={isScanning} />
        ))}
      </div>
    </div>
  );
}

function DeliverableCard({ text, isScanning }: { text: string; isScanning: boolean }) {
  const scrambledText = useBinaryScramble(text, isScanning, 40);

  return (
    <div className="group relative bg-foreground/5 border border-foreground/10 p-6 hover:border-primary/40 hover:bg-foreground/10 transition-all duration-500 overflow-hidden">
      <div className="flex items-center gap-4 relative z-10">
        {/* REPLACED ICON HERE */}
        <div className="text-accent shrink-0 transition-transform duration-500 group-hover:scale-110">
            <BitmapTick className="w-5 h-5" /> 
        </div>
        
        <span className="font-mono text-sm text-foreground uppercase tracking-wider">
          {scrambledText}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-transparent 
                    group-hover:border-primary/30 transition-all duration-700"></div>
    </div>
  );
}