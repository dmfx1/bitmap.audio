/* src/hooks/useBinaryScramble.ts */
import { useState, useEffect } from 'react';

/**
 * High-speed binary scramble hook.
 * Swaps characters for 0s and 1s before locking into the final text.
 */
export const useBinaryScramble = (text: string, active: boolean, speed = 40) => {
  const [displayValue, setDisplayValue] = useState('');
  const chars = "01"; 

  useEffect(() => {
    if (!active) { setDisplayValue(''); return; }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayValue(
        text.split("").map((_, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= text.length) clearInterval(interval);

      // REDUCED INCREMENT: This makes the "scramble" phase much longer
      iteration += text.length / 15; 
    }, speed);

    return () => clearInterval(interval);
  }, [text, active, speed]);

  return displayValue;
};