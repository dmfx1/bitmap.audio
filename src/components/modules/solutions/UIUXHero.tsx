/* src/components/modules/solutions/SonicHero.tsx */
import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function UIUXHero() {
  return (
    <div className="pt-12 md:pt-20">
      <a href="/home" className="group inline-flex items-center text-sm font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-12">
        <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
        BACK TO HOME
      </a>
      
      <div className="max-w-4xl">
        <p className="text-eyebrow text-sm mb-6">Solutions <span className="text-accent ">/ UI + UX Sound</span></p>
        <h1 className="text-5xl md:text-6xl font-mono text-white leading-[0.9] tracking-tighter mb-12">
          Sound that makes <br />
          <span className="text-accent font-medium animate-pulse">interfaces intuitive</span>
        </h1>
        <p className="text-body-muted text-xl max-w-2xl leading-relaxed">
          Just as your visual identity communicates who you are, your sonic identity creates emotional connections that words and images alone cannot achieve.
        </p>
      </div>
    </div>
  );
}