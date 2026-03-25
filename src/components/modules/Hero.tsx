import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [phase, setPhase] = useState<'idle' | 'grow' | 'expand' | 'active'>('idle');
  // Individual states for precise text control
  const [activeText, setActiveText] = useState<'syncing' | 'connection' | 'activated' | null>(null);

  useEffect(() => {
    // 1. MECHANICAL: Start growing the center line
    const tGrow = setTimeout(() => setPhase('grow'), 600);
    
    // 2. TEXT: "Syncing" appears once the line is roughly half-way up (~400ms after grow starts)
    const tSyncText = setTimeout(() => setActiveText('syncing'), 600);
    
    // 3. MECHANICAL: Expansion begins
    const tExpand = setTimeout(() => setPhase('expand'), 1800);
    
    // 4. TEXT: "Connection" appears only AFTER the breakout is well underway
    const tConnText = setTimeout(() => setActiveText('connection'), 2400);
    
    // 5. MECHANICAL: Wave activates
    const tActive = setTimeout(() => setPhase('active'), 3400);
    
    // 6. TEXT: "Activated" appears as a final confirmation after the wave stabilizes
    const tActiveText = setTimeout(() => setActiveText('activated'), 3600);

    return () => {
      [tGrow, tSyncText, tExpand, tConnText, tActive, tActiveText].forEach(clearTimeout);
    };
  }, []);

  return (
      <div className="w-full"> {/* Changed from section to div */}
        <div className="mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-16 min-h-[80vh]">
          
          {/* TEXT CONTENT */}
          <div className="flex-1 space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <p className="text-eyebrow tracking-[0.4em]">Sonic Architecture</p>
              <h1 className="heading-hero">
                Where data <br /> meets 
                <span className={`text-accent font-medium block md:inline ${phase === 'active' ? 'pulse-sync-active' : ''}`}>
                  <br className="hidden md:block" /> emotion
                </span>
              </h1>
            </div>
            <p className="text-body-muted max-w-sm">
              We architect sonic experiences that bridge the gap between digital interfaces and human perception.
            </p>
            
            <div className="flex items-center gap-6">
              <a href="/about">
                <Button variant="default" size="xl" className="rounded-none px-4 py-2 text-xs md:px-8 md:text-base">
                  OUR STORY
                </Button>
              </a>
              <Button variant="outline" size="xl" className="morph-accent rounded-none px-4 py-2 text-xs md:px-8 md:text-base">
                <a href="/contact">Start A Project</a>
              </Button>
            </div>
          </div>

          {/* VISUALIZER SECTION */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`visualizer-stage phase-${phase}`}>
              <div className="relative w-full h-[40px] flex items-center justify-center">
                {[...Array(36)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bar-element" 
                    style={{ '--i': i } as React.CSSProperties} 
                  />
                ))}
              </div>
              
              {/* The label uses activeText for content and a long duration for smooth transitions */}
              <div className={`status-label transition-all duration-1000 ${activeText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                {activeText === 'activated' ? "Activated" : 
                activeText === 'connection' ? "Connecting" : 
                activeText === 'syncing' ? "Syncing" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}