/* src/components/modules/solutions/SonicAnalysis.tsx */
import React from 'react';

export default function ImmersiveAnalysis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* THE CHALLENGE */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-mono text-accent tracking-[0.4em] uppercase">The Challenge</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">Flat audio breaks immersion</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">Traditional stereo audio exists on a flat plane. In immersive environments, sound needs to exist in three dimensions, responding to movement, orientation, and space.</p>
          <p className="text-xl">Poorly implemented spatial audio destroys presence. Great spatial audio is the foundation of believable virtual worlds.</p>
        </div>
      </div>

      {/* THE APPROACH */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-mono text-accent tracking-[0.4em] uppercase">Our Approach</p>
          <h2 className="text-3xl font-mono text-foreground leading-tight">Engineering presence through sound.</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p className="text-xl">We combine artistic vision with technical expertise in spatial audio formats, game engines, and audio middleware to create experiences that feel real.</p>
          <p className="text-xl">Whether it's a VR experience, AR application, or a physical installation, we architect sound that responds to space and movement naturally.</p>
        </div>
      </div>
    </div>
  );
}