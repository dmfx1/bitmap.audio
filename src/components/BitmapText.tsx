// src/components/BitmapText.tsx
import React from 'react';

const BITMAP_MAP: Record<string, React.ReactNode> = {
  'b': (
    <>
      <rect x="0" y="1" width="1" height="1" /> 
      <rect x="1" y="2" width="1" height="5" /> 
      <rect x="0" y="4" width="4" height="1" /> 
      <rect x="4" y="4" width="1" height="3" /> 
      <rect x="1" y="7" width="3" height="1" />
    </>
  ),
};

export const BitmapIcon = ({ 
  char, 
  className = "w-5 h-5", 
  boldness = "0.2" // Adjustable boldness level
}: { 
  char: string, 
  className?: string, 
  boldness?: string 
}) => (
  <svg 
    viewBox="-1 0.5 7 8" 
    className={`${className} fill-current`} 
    style={{ 
      shapeRendering: 'crispEdges',
      stroke: 'currentColor', // Makes the stroke match the fill color
      strokeWidth: boldness,   // Adds "weight" to the outside of the pixels
      strokeLinejoin: 'round'  // Keeps corners from looking too "spiky"
    }}
  >
    {BITMAP_MAP[char.toLowerCase()]}
  </svg>
);