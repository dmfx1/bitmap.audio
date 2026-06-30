/* src/components/modules/solutions/SonicAnalysis.tsx */
import React from 'react';

export default function SonicAnalysis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* THE CHALLENGE */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-base font-mono text-accent tracking-[0.4em] uppercase">The Challenge</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">In a world of visual noise, sound cuts through.</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">Your audience encounters thousands of visual messages daily. But sound operates differently - it bypasses rational filters and connects directly to emotion and memory.</p>
          <p className="text-xl">A thoughtfully crafted sonic brand becomes instantly recognizable, consistently memorable, and emotionally resonant across every touchpoint.</p>
        </div>
      </div>

      {/* THE APPROACH */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-base font-mono text-accent tracking-[0.4em] uppercase">Our Approach</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">From brand essence to sonic expression.</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">We begin by understanding your brand's core values and how you want them to communicate. We design for each of them and build them into a collective expression.</p>
          <p className="text-xl">The result is a comprehensive asset library that scales from a two-second notification sound to a full musical composition - providing broad utilisation across your branding network.</p>
        </div>
      </div>
    </div>
  );
}