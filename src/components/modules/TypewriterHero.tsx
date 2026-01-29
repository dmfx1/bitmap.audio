/* src/components/modules/TypewriterHero.tsx */
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  onComplete?: () => void;
}

export default function TypewriterHero({ onComplete }: TypewriterProps) {
  const [text, setText] = useState("");
  const fullText = "Two minds, one sonic vision";
  const index = useRef(0);
  const lastUpdate = useRef(0);
  const hasStarted = useRef(false);
  const isPaused = useRef(false);

  useEffect(() => {
    let rafId: number;

    const type = (time: number) => {
      if (!hasStarted.current) {
        lastUpdate.current = time + 500; 
        hasStarted.current = true;
      }

      const deltaTime = time - lastUpdate.current;
      const currentSpeed = isPaused.current ? 500 : 50;

      if (deltaTime >= currentSpeed && index.current <= fullText.length) {
        const nextChar = fullText[index.current];
        setText(fullText.slice(0, index.current + 1));
        isPaused.current = nextChar === ',';
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
  }, [onComplete]);

  const line1 = text.slice(0, 10);
  const line2 = text.slice(10);

  return (
    /* STABILIZER: min-h-[2.2em] md:min-h-[2.4em] prevents the description from jumping */
    <h1 className="heading-hero mb-8 leading-tight font-medium min-h-[2.2em] md:min-h-[2.4em]">
      {line1}
      {text.length > 10 && <br />}
      {line2}
      <span className="inline-block w-[0.5ch] h-[0.9em] bg-accent brightness-125 ml-1 animate-pulse align-middle" />
    </h1>
  );
}