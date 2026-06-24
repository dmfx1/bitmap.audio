import React, { useState, useMemo } from 'react';
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

interface SonicHeroProps {
  imageSrc?: string;
}

export default function SonicHero({ imageSrc }: SonicHeroProps) {
  const [showContent, setShowContent] = useState(false);

  const constellation = useMemo(() => {
    const slots = [
      // The "Hero" icon - now higher opacity (30%) and positioned more centrally under text
      { size: 'w-32 h-32', color: 'text-foreground/30', t: [45, 55], r: [35, 50], delay: '0s' },
      // Support icons - spread out
      { size: 'w-24 h-24', color: 'text-primary/40', t: [10, 25], r: [5, 20], delay: '0.2s' },
      { size: 'w-16 h-16', color: 'text-accent/60', t: [60, 80], r: [15, 30], delay: '0.4s' },
    ];

    return slots.map((slot) => ({
      ...slot,
      Component: ICON_POOL[Math.floor(Math.random() * ICON_POOL.length)],
      top: `${Math.floor(Math.random() * (slot.t[1] - slot.t[0]) + slot.t[0])}%`,
      right: `${Math.floor(Math.random() * (slot.r[1] - slot.r[0]) + slot.r[0])}%`,
      rotation: Math.floor(Math.random() * 60 - 30),
    }));
  }, []);

  return (
    <div className="relative w-full md:py-32 min-h-[50vh] md:h-full flex flex-col overflow-hidden">

      {/* 1. ICON CONSTELLATION + HERO IMAGE */}
      <div
        className="absolute right-0 top-0 w-full md:w-[85%] h-full pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
        }}
      >
        {/* HERO IMAGE — full colour, mask handles left-edge fade */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            decoding="async"
            loading="eager"
            className="absolute left-20 inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Bottom fade */}
        {imageSrc && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        )}

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
           
           <div className="absolute top-[30%] right-0 w-full h-px bg-foreground/5" />
           <div className="absolute top-0 right-[45%] w-px h-full bg-foreground/5" />
        </div>

      </div>

      <div className="w-full md:max-w-4xl pl-4 md:pl-12 relative z-10">
        <a href="/home" className="group inline-flex items-center text-lg pb-4 md:pb-0 font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12">
          <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
          RTN:HOME
        </a>

        <p className="text-eyebrow text-accent text-sm font-bold animate-fade-in mb-4">
          Solutions <span className="opacity-50">/</span> Sonic Branding
        </p>
        
        <TypewriterHero 
          text={"Define your brand's\naudio DNA"} 
          onComplete={() => setTimeout(() => setShowContent(true), 200)} 
        />
        
        <p className={`text-body-muted text-lg bg-background/50 max-w-full md:max-w-[65%] transition-all duration-1000 mt-8
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Just as your visual identity communicates who you are, your sonic identity creates emotional connections that words and images alone cannot achieve.
        </p>
      </div>
    </div>
  );
}