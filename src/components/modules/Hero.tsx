import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [phase, setPhase] = useState<'idle' | 'grow' | 'expand' | 'active'>('idle');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('grow'), 600);
    const t2 = setTimeout(() => setPhase('expand'), 1600);
    const t3 = setTimeout(() => setPhase('active'), 3200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <section className="full-width-line-section">
      {/* Container for content constraints */}
      <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-16 py-12 md:py-24 min-h-[60vh]">
        
        {/* TEXT CONTENT */}
        <div className="flex-1 space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <p className="text-eyebrow tracking-[0.4em]">Sonic Architecture</p>
            <h1 className="heading-hero">
              Where data <br /> meets 
              <span className={`text-accent font-medium block md:inline ${phase === 'active' ? 'pulse-sync-active' : ''}`}>
                <br className="" /> emotion
              </span>
            </h1>
          </div>
          <p className="text-body-muted max-w-sm">
            We architect sonic experiences that bridge the gap between digital interfaces and human perception.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="/about">
              <Button variant="default" size="xl" className="rounded-none">
                OUR STORY <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button variant="outline" size="xl" className="morph-accent rounded-none">
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
            
            <div className="status-label">
              {phase === 'active' ? "Activated" : "Syncing"}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}