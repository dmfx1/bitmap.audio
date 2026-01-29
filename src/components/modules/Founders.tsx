/* src/components/modules/Founders.tsx */
import React from 'react';

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Sound Designer & Technologist",
    bio: "With a background in [Background], [Name] brings deep expertise in digital audio systems, software integration, and the technical architecture of sound."
  },
  {
    name: "[nick.granville-fall]",
    role: "Composer & Spatial Audio Designer",
    bio: "Coming from [Background], [Name] specializes in emotional storytelling through sound and the architecture of immersive audio experiences."
  }
];

export default function Founders() {
  return (
    /* Grid gap matches your technical spacing */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 py-12 bg-border/20 w-full min-h-[50vh]">
      {founders.map((f, index) => {
        // Automatically formats index 0 to "0000", index 1 to "0001"
        const formattedId = String(index).padStart(4, '0');

        return (
          <div 
            key={index} 
            className="group relative bg-primary p-12 transition-all duration-500 hover:bg-primary/10"
          >
            {/* ID: Zero-padded for visual stability */}
            <span className="font-mono text-xs text-background/60 block mb-6 transition-colors group-hover:text-background">
              {formattedId}
            </span>

            {/* NAME: Dims to muted-foreground on hover */}
            <h3 className="text-black font-mono font-bold text-2xl mb-2 transition-colors duration-300 group-hover:text-muted-foreground">
              {f.name}
            </h3>

            {/* ROLE: High-contrast Solaris Amber */}
            <p className="text-accent font-mono text-xs font-bold uppercase tracking-widest mb-8">
              {f.role}
            </p>

            {/* BIO: Ensures legibility with darkened muted text */}
            <p className="text-black/70 text-sm leading-relaxed max-w-sm group-hover:text-muted-foreground transition-colors">
              {f.bio}
            </p>
            
            {/* ELECTRIFIED FOOTER: Ignites on hover */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        );
      })}
    </div>
  );
}