/* src/components/modules/SoundToggle.tsx */
import React from 'react';
import { useSound } from '../../context/SoundContext';

export default function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        toggleMute();
      }}
      /* Ensure z-index is higher than the cursor glow (9998) */
      className="group fixed bottom-8 right-8 z-[9999] flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] transition-all hover:brightness-125"
    >
      <div className="flex flex-col text-right">
        <span className="text-muted-foreground uppercase">System Audio</span>
        <span className={isMuted ? "text-destructive" : "text-primary"}>
          {isMuted ? "[OFFLINE]" : "[OPERATIONAL]"}
        </span>
      </div>
      
      <div className="flex items-end gap-[2px] h-4 w-4 border border-foreground/10 p-[2px]">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-full bg-current transition-all duration-300 ${isMuted ? 'h-[2px]' : 'animate-pulse h-full'}`}
            style={{ animationDelay: `${i * 0.1}s`, color: isMuted ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}
          />
        ))}
      </div>
    </button>
  );
}