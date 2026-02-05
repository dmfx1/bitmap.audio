import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from '../TypewriterHero';
import * as Icons from '../../ui/icons';

const ICON_POOL = [
  Icons.BitmapPlay, 
  Icons.BitmapArrow, 
  Icons.BitmapHeart, 
  Icons.BitmapWave, 
  Icons.BitmapNode, 
  Icons.BitmapMeter,
  Icons.BitmapChevron
];

export default function ImmersiveHero() {
  const [showContent, setShowContent] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  // Structural randomization to match the "Two Minds" / SonicHero layout
  const constellation = useMemo(() => {
    const slots = [
      // Hero Icon: Central under text
      { size: 'w-32 h-32', color: 'text-foreground/30', t: [45, 55], r: [40, 55], delay: '0s' },
      // Support icons: Dispersed
      { size: 'w-24 h-24', color: 'text-primary/40', t: [10, 25], r: [5, 20], delay: '0.2s' },
      { size: 'w-16 h-16', color: 'text-accent/60', t: [65, 80], r: [10, 30], delay: '0.4s' },
    ];

    return slots.map((slot) => ({
      ...slot,
      Component: ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)],
      top: `${Math.floor(Math.random() * (slot.t[1] - slot.t[0]) + slot.t[0])}%`,
      right: `${Math.floor(Math.random() * (slot.r[1] - slot.r[0]) + slot.r[0])}%`,
      rotation: Math.floor(Math.random() * 60 - 30),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 20); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-24 md:py-36 min-h-[50vh] flex flex-col overflow-visible">
      
      {/* 1. BACKGROUND CONSTELLATION */}
      <div 
        className="absolute right-0 md:right-[-5%] top-[5%] w-[350px] md:w-[750px] h-[550px] pointer-events-none z-0"
        style={{
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear'
        }}
      >
        <div className="relative w-full h-full grayscale brightness-200 contrast-125">
           {constellation.map((icon, idx) => (
             <icon.Component 
               key={idx}
               className={`absolute ${icon.size} ${icon.color} animate-pulse`}
               style={{
                 top: icon.top,
                 right: icon.right,
                 transform: `rotate(${icon.rotation}deg)`,
                 animationDelay: icon.delay
               }}
             />
           ))}
           
           {/* Technical Wireframe Accents */}
           <div className="absolute top-[30%] right-0 w-full h-px bg-foreground/5" />
           <div className="absolute top-0 right-[45%] w-px h-full bg-foreground/5" />
        </div>

        {/* SCANNING LINE: Clears at 100% */}
        {revealProgress < 100 && (
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-accent/50 shadow-[0_0_15px_hsl(var(--accent))]"
            style={{ left: `${revealProgress}%` }}
          />
        )}
      </div>

      {/* 2. HERO CONTENT */}
      <div className="w-full md:max-w-4xl pl-0 md:pl-12 relative z-10">
        <a 
          href="/home" 
          className="group inline-flex items-center text-xs font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-12"
        >
          <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </a>

        <p className="text-eyebrow text-accent font-bold animate-fade-in mb-4">
          Solutions <span className="opacity-50">/</span> Immersive Sound
        </p>
        
        <TypewriterHero 
          text={"Sound that exists\nin space"} 
          onComplete={() => setTimeout(() => setShowContent(true), 200)} 
        />
        
        <p className={`text-body-muted text-lg bg-background/50 max-w-[65%] transition-all duration-1000 mt-8 
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            We design spatial audio experiences for virtual reality, augmented reality, and physical installations that transport audiences into new dimensions of perception.
        </p>
      </div>
    </div>
  );
}