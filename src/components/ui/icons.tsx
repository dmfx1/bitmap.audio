/* src/components/ui/Icons.tsx */
import React from 'react';

interface IconProps {
  className?: string;
}

/** * BITMAP_PLAY: Constructed from 2px data blocks 
 * Represents the reconstruction of an audio signal
 */
export const BitmapPlay = ({ className }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="2" width="2" height="12" fill="currentColor" />
    <rect x="4" y="4" width="2" height="8" fill="currentColor" />
    <rect x="6" y="6" width="2" height="4" fill="currentColor" />
    <rect x="8" y="7" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_ARROW: A stepped directional vector 
 * Designed to feel like a low-bit depth UI element
 */
export const BitmapArrow = ({ className }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="7" width="6" height="2" fill="currentColor" />
    <rect x="8" y="5" width="2" height="6" fill="currentColor" />
    <rect x="10" y="7" width="2" height="2" fill="currentColor" />
    <rect x="8" y="3" width="2" height="2" fill="currentColor" />
    <rect x="8" y="11" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_CLOSE: An 'X' built from 2x2 data blocks */
export const BitmapClose = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
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
    <rect x="6" y="16" width="2" height="2" fill="currentColor" /> {/* Center handle */}
    <rect x="12" y="10" width="2" height="2" fill="currentColor" />
  </svg>
);