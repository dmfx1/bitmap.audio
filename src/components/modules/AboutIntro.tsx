/* src/components/modules/AboutIntro.tsx */
import React, { useState } from 'react';
import TypewriterHero from './TypewriterHero';

export default function AboutIntro() {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-36 pr-24 min-h-[50vh]">
      <p className="text-eyebrow text-accent font-bold animate-fade-in">About Us</p>
      
      {/* Typewriter reserves its own height now */}
      <TypewriterHero onComplete={() => setTimeout(() => setShowDescription(true), 150)} />

      <p 
        className={`text-body-muted text-lg max-w-[66%] transition-all duration-1000 ease-out
          ${showDescription 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-2 pointer-events-none'}`}
      >
        bitmap.audio is the collaboration of two audio specialists who share a passion for the intersection of technology and human experience.
      </p>
    </div>
  );
}