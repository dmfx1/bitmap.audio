/* src/components/modules/solutions/SonicAnalysis.tsx */
import React from 'react';

export default function UIUXAnalysis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* THE CHALLENGE */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-accent tracking-[0.4em] uppercase">The Challenge</p>
          <h2 className="text-3xl font-mono text-white leading-tight">Digital products feel silent and disconnected</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p>Most apps and websites operate in silence. Users miss feedback, misunderstand states, and feel disconnected from the interface. Sound bridges this gap.</p>
          <p>Thoughtful audio design reduces cognitive load, confirms actions, and creates a more human-centered digital experience.</p>
        </div>
      </div>

      {/* THE APPROACH */}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-mono text-accent tracking-[0.4em] uppercase">Our Approach</p>
          <h2 className="text-3xl font-mono text-white leading-tight">Functional sound, beautiful execution</h2>
        </div>
        <div className="space-y-6 text-body-muted text-base leading-relaxed">
          <p>We map your product's interaction patterns, identify key feedback moments, and design a cohesive sound system that enhances usability without becoming annoying.</p>
          <p>Every sound is tested for context, repetition tolerance, and emotional impact — ensuring it serves the user, not just the brand.</p>
        </div>
      </div>
    </div>
  );
}