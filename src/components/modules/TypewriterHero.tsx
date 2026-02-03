/* src/components/modules/TypewriterHero.tsx */
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  onComplete?: () => void;
  className?: string;
  isBrand?: boolean; 
  speed?: number; 
}

export default function TypewriterHero({ 
  text: fullText, 
  onComplete, 
  className, 
  isBrand, 
  speed = 60 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);
  const lastUpdate = useRef(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    let rafId: number;
    const type = (time: number) => {
      if (!hasStarted.current) {
        lastUpdate.current = time; 
        hasStarted.current = true;
      }
      const deltaTime = time - lastUpdate.current;
      if (deltaTime >= speed && index.current <= fullText.length) {
        setDisplayedText(fullText.slice(0, index.current + 1));
        index.current++;
        lastUpdate.current = time;
      }
      if (index.current <= fullText.length) {
        rafId = requestAnimationFrame(type);
      } else if (onComplete) {
        onComplete();
      }
    };
    rafId = requestAnimationFrame(type);
    return () => cancelAnimationFrame(rafId);
  }, [fullText, speed, onComplete]);

  const renderText = () => {
    // 1. Handle Brand Logic (Solaris dot/suffix)
    if (isBrand && displayedText.includes('.')) {
      const dotIndex = displayedText.indexOf('.');
      const main = displayedText.slice(0, dotIndex);
      const suffix = displayedText.slice(dotIndex);
      return (
        <>
          {main}<span className="text-accent font-medium">{suffix}</span>
        </>
      );
    }

    // 2. Handle Multi-line Logic (recognizes \n)
    const lines = displayedText.split('\n');
    return lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <h1 className={className || "heading-hero mb-8 leading-tight font-medium min-h-[2.2em] md:min-h-[2.4em]"}>
      {renderText()}
      <span className="inline-block w-[0.5ch] h-[0.9em] bg-accent brightness-125 ml-1 animate-pulse align-middle" />
    </h1>
  );
}