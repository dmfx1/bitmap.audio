import React, { useState, useEffect } from 'react';

const BITMAP_MAP: Record<string, React.ReactNode> = {
  'b': (
    <svg viewBox="-1 0 7 8" className="inline-block h-[0.9em] w-auto fill-current align-baseline translate-y-[-0.05em]" style={{ shapeRendering: 'crispEdges' }}>
      <rect x="0" y="0" width="1" height="1" /> 
      <rect x="1" y="1" width="1" height="6" /> 
      <rect x="-1" y="3" width="6" height="1" /> 
      <rect x="4" y="4" width="1" height="2" /> 
      <rect x="2" y="6" width="2" height="1" />
    </svg>
  ),
  '.': (
    <svg viewBox="0 0 1 1" className="inline-block h-[0.18em] w-auto fill-current mx-[0.05em] align-baseline translate-y-[-0.1em]" style={{ shapeRendering: 'crispEdges' }}>
      <rect x="0" y="0" width="1" height="1" />
    </svg>
  ),
};

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const BitmapTypewriter: React.FC<Props> = ({ text, speed = 60, className = "", onComplete }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return (
    <div className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      {text.slice(0, index).split('').map((char, i) => (
        <React.Fragment key={i}>
          {BITMAP_MAP[char.toLowerCase()] ? (
            <span className="inline-flex items-baseline leading-none mr-[0.05em]">
              {BITMAP_MAP[char.toLowerCase()]}
            </span>
          ) : (
            <span>{char}</span>
          )}
        </React.Fragment>
      ))}
      {/* Optional: Add a flickering cursor here if needed */}
    </div>
  );
};