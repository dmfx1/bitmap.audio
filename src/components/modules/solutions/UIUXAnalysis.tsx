/* src/components/modules/solutions/SonicAnalysis.tsx */
import React from 'react';

export default function UIUXAnalysis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* THE CHALLENGE */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-base font-mono text-accent tracking-[0.4em] uppercase">The Challenge</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">Digital products create disconnect</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">Most digital tech either operates in silence or communicates via harsh monophonic alerts and notifications. Users miss feedback, misunderstand states and feel disconnected from the interface.</p>
          <p className="text-xl">Nuanced sound design bridges this gap and reduces the friction between human and machine - building trust and creating a more human-centered digital experience.</p>
        </div>
      </div>

      {/* THE APPROACH */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-base font-mono text-accent tracking-[0.4em] uppercase">Our Approach</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">Functional sound, beautiful execution</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">We map our brand-focussed audio assets to your product's interaction patterns, identify key feedback moments and design a cohesive sound system that enhances usability without becoming annoying.</p>
          <p className="text-xl">Every sound is built from the ground up, tested for repetition tolerance and emotional impact - ensuring it serves the user, not just the brand.</p>
        </div>
      </div>
    </div>
  );
}