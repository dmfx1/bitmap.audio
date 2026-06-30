/* src/components/modules/SocialsGrid.tsx */
import React from 'react';
import { cn } from "@/lib/utils";
import { BitmapInstagram, BitmapLinkedin, BitmapThreads } from '../ui/icons';

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/bitmap.audio', icon: BitmapInstagram },
  { name: 'Threads', href: 'https://threads.net/@bitmap.audio', icon: BitmapThreads },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/bitmapaudio', icon: BitmapLinkedin },
];

export default function SocialsGrid() {
  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 min-h-[80svh] animate-fade-in-up">
      <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-base font-medium">
        Follow Our Work
      </p>

      <div className="flex gap-4">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "w-16 h-16 flex items-center justify-center border border-foreground/50 bg-card/20 backdrop-blur-sm",
                "transition-all duration-500 ease-out hover:border-primary/50 hover:bg-card/40 hover:scale-105 group relative"
              )}
            >
              {/* Subtle Tech Accents to match the Icon style */}
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-foreground/20 group-hover:bg-primary" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-foreground/20 group-hover:bg-primary" />
              
              <Icon
              className="w-6 h-6 text-foreground group-hover:text-primary transition-colors duration-500" 
              style={{ imageRendering: 'pixelated' }} // CSS hint to keep edges sharp
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}