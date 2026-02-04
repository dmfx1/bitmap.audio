/* src/components/ui/icons.tsx */
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/** * BITMAP_PLAY: Constructed from 2px data blocks 
 */
export const BitmapPlay = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="2" y="2" width="2" height="12" fill="currentColor" />
    <rect x="4" y="4" width="2" height="8" fill="currentColor" />
    <rect x="6" y="6" width="2" height="4" fill="currentColor" />
    <rect x="8" y="7" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_ARROW: A stepped directional vector 
 */
export const BitmapArrow = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="2" y="7" width="6" height="2" fill="currentColor" />
    <rect x="8" y="5" width="2" height="6" fill="currentColor" />
    <rect x="10" y="7" width="2" height="2" fill="currentColor" />
    <rect x="8" y="3" width="2" height="2" fill="currentColor" />
    <rect x="8" y="11" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_CLOSE: An 'X' built from 2x2 data blocks 
 */
export const BitmapClose = ({ className, style }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="6" y="6" width="2" height="2" fill="currentColor" />
    <rect x="8" y="8" width="2" height="2" fill="currentColor" />
    <rect x="10" y="10" width="2" height="2" fill="currentColor" />
    <rect x="12" y="12" width="2" height="2" fill="currentColor" />
    <rect x="14" y="14" width="2" height="2" fill="currentColor" />
    <rect x="16" y="16" width="2" height="2" fill="currentColor" />
    <rect x="16" y="6" width="2" height="2" fill="currentColor" />
    <rect x="14" y="8" width="2" height="2" fill="currentColor" />
    <rect x="10" y="14" width="2" height="2" fill="currentColor" />
    <rect x="8" y="16" width="2" height="2" fill="currentColor" />
    <rect x="6" y="16" width="2" height="2" fill="currentColor" />
    <rect x="12" y="10" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_HEART: A 16x16 pixel-grid heart 
 */
export const BitmapHeart = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="3" y="4" width="3" height="3" fill="currentColor" />
    <rect x="10" y="4" width="3" height="3" fill="currentColor" />
    <rect x="2" y="6" width="12" height="3" fill="currentColor" />
    <rect x="4" y="9" width="8" height="2" fill="currentColor" />
    <rect x="6" y="11" width="4" height="2" fill="currentColor" />
    <rect x="7" y="13" width="2" height="1" fill="currentColor" />
  </svg>
);

/** * BITMAP_WAVE: Represents a digital signal pulse 
 */
export const BitmapWave = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="2" y="7" width="2" height="2" fill="currentColor" />
    <rect x="4" y="4" width="2" height="8" fill="currentColor" />
    <rect x="6" y="2" width="2" height="12" fill="currentColor" />
    <rect x="8" y="5" width="2" height="6" fill="currentColor" />
    <rect x="10" y="8" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_NODE: A technical connection point 
 */
export const BitmapNode = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="6" y="6" width="4" height="4" fill="currentColor" />
    <rect x="7" y="2" width="2" height="4" fill="currentColor" />
    <rect x="7" y="10" width="2" height="4" fill="currentColor" />
    <rect x="2" y="7" width="4" height="2" fill="currentColor" />
    <rect x="10" y="7" width="4" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_METER: Representing signal levels 
 */
export const BitmapMeter = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect x="2" y="10" width="2" height="4" fill="currentColor" />
    <rect x="5" y="7" width="2" height="7" fill="currentColor" />
    <rect x="8" y="4" width="2" height="10" fill="currentColor" />
    <rect x="11" y="2" width="2" height="12" fill="currentColor" />
  </svg>
);