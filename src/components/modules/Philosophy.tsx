import React, { useEffect, useRef, useState } from 'react';

export default function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleText, setVisibleText] = useState("");
  const fullQuote = '"In computer science, a bitmap is a data structure that represents a spatially mapped array of bits."';

  useEffect(() => {
  let ticking = false;

  const updateText = () => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // --- INSERT CODE HERE (Number 3.) ---
    // startTrigger: When the section is 85% down the screen, start typing.
    const startTrigger = viewportHeight * 0.85; 
    
    // endTrigger: When the section hits 45% (near the middle), be 100% finished.
    // This provides the 'smooth' finish you're looking for.
    const endTrigger = viewportHeight * 0.45;   
    
    const progress = Math.min(Math.max((startTrigger - rect.top) / (startTrigger - endTrigger), 0), 1);
    // ------------------------------------

    const charCount = Math.floor(fullQuote.length * progress);
    setVisibleText(fullQuote.slice(0, charCount));
    ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
        window.requestAnimationFrame(updateText);
        ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
    }, []);

  return (
    <div ref={sectionRef} className="flex flex-col items-center text-center py-12">
      <p className="text-eyebrow text-accent text-xs mb-8">Our Philosophy</p>
      
      <div className="max-w-4xl min-h-[160px] md:min-h-[200px]">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-mono text-foreground leading-tight">
          {visibleText}
          <span className="inline-block w-[0.5ch] h-[0.9em] bg-accent brightness-125 ml-2 animate-pulse align-middle" />
        </h2>
      </div>

      <p className="text-body-muted text-lg max-w-2xl mt-8 opacity-60">
        We translate this concept to sound — mapping digital information to human emotion.
      </p>
    </div>
  );
}