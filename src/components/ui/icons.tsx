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

/** * BITMAP_CHEVRON: A pixel-stepped chevron for UI navigation */
export const BitmapChevron = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* The 'stepped' path of the arrow */}
    <rect x="4" y="2" width="2" height="2" fill="currentColor" />
    <rect x="6" y="4" width="2" height="2" fill="currentColor" />
    <rect x="8" y="6" width="2" height="2" fill="currentColor" />
    <rect x="10" y="8" width="2" height="2" fill="currentColor" />
    <rect x="8" y="10" width="2" height="2" fill="currentColor" />
    <rect x="6" y="12" width="2" height="2" fill="currentColor" />
    <rect x="4" y="14" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_MAIL: A technical envelope constructed from 2px blocks */
export const BitmapMail = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={style}>
    <rect x="2" y="4" width="12" height="8" fill="currentColor" opacity="0.2" />
    {/* Frame */}
    <rect x="2" y="4" width="12" height="2" fill="currentColor" />
    <rect x="2" y="10" width="12" height="2" fill="currentColor" />
    <rect x="2" y="6" width="2" height="4" fill="currentColor" />
    <rect x="12" y="6" width="2" height="4" fill="currentColor" />
    {/* V-Shape */}
    <rect x="4" y="6" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    <rect x="6" y="8" width="4" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_MAP: A pixelated location pin */
export const BitmapMap = ({ className, style }: IconProps) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={style}>
    {/* Head */}
    <rect x="6" y="2" width="4" height="2" fill="currentColor" />
    <rect x="4" y="4" width="8" height="2" fill="currentColor" />
    <rect x="4" y="6" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    {/* Center Point */}
    <rect x="7" y="5" width="2" height="2" fill="currentColor" />
    {/* Taper */}
    <rect x="6" y="8" width="4" height="2" fill="currentColor" />
    <rect x="7" y="10" width="2" height="2" fill="currentColor" />
    <rect x="7" y="12" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_INSTAGRAM: Cleaned-up pixel construction */
export const BitmapInstagram = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Rounded-edge square frame built with blocks */}
    <rect x="6" y="4" width="12" height="2" fill="currentColor" />
    <rect x="6" y="18" width="12" height="2" fill="currentColor" />
    <rect x="4" y="6" width="2" height="12" fill="currentColor" />
    <rect x="18" y="6" width="2" height="12" fill="currentColor" />
    {/* Center Lens - clearer 3x3-ish block circle */}
    <rect x="10" y="8" width="4" height="2" fill="currentColor" />
    <rect x="10" y="14" width="4" height="2" fill="currentColor" />
    <rect x="8" y="10" width="2" height="4" fill="currentColor" />
    <rect x="14" y="10" width="2" height="4" fill="currentColor" />
    {/* Top Right Dot */}
    <rect x="15" y="7" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_THREADS: Higher-definition digital spiral */
export const BitmapThreads = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Outer curve */}
    <rect x="8" y="4" width="10" height="2" fill="currentColor" />
    <rect x="6" y="6" width="2" height="10" fill="currentColor" />
    <rect x="8" y="18" width="10" height="2" fill="currentColor" />
    <rect x="18" y="10" width="2" height="8" fill="currentColor" />
    {/* Inner 'a' shape spiral */}
    <rect x="10" y="10" width="4" height="2" fill="currentColor" />
    <rect x="10" y="14" width="6" height="2" fill="currentColor" />
    <rect x="14" y="10" width="2" height="4" fill="currentColor" />
    <rect x="10" y="12" width="2" height="2" fill="currentColor" opacity="0.5" />
  </svg>
);

/** * BITMAP_LINKEDIN: Proportional 'in' letterform */
export const BitmapLinkedin = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* The 'i' */}
    <rect x="5" y="5" width="2" height="2" fill="currentColor" />
    <rect x="5" y="9" width="2" height="10" fill="currentColor" />
    {/* The 'n' - stepped shoulder */}
    <rect x="10" y="9" width="2" height="10" fill="currentColor" />
    <rect x="12" y="9" width="5" height="2" fill="currentColor" />
    <rect x="17" y="11" width="2" height="8" fill="currentColor" />
  </svg>
);

/** * BITMAP_TICK: Stepped border box with padded checkmark */
export const BitmapTick = ({ className, style }: IconProps) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* --- STEPPED BORDER (2px thick) --- */}
    {/* Horizontal Bars (shorter to create gaps at corners) */}
    <rect x="4" y="0" width="16" height="2" fill="currentColor" />
    <rect x="4" y="22" width="16" height="2" fill="currentColor" />
    
    {/* Vertical Bars */}
    <rect x="0" y="4" width="2" height="16" fill="currentColor" />
    <rect x="22" y="4" width="2" height="16" fill="currentColor" />
    
    {/* Corner Steps (Connecting the bars) */}
    <rect x="2" y="2" width="2" height="2" fill="currentColor" />
    <rect x="20" y="2" width="2" height="2" fill="currentColor" />
    <rect x="2" y="20" width="2" height="2" fill="currentColor" />
    <rect x="20" y="20" width="2" height="2" fill="currentColor" />

    {/* --- THE TICK (Centered with padding) --- */}
    {/* Down stroke */}
    <rect x="7" y="12" width="2" height="2" fill="currentColor" />
    <rect x="9" y="14" width="2" height="2" fill="currentColor" />
    
    {/* Up stroke */}
    <rect x="11" y="12" width="2" height="2" fill="currentColor" />
    <rect x="13" y="10" width="2" height="2" fill="currentColor" />
    <rect x="15" y="8" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_MONITOR: CRT-style display with a heavy base */
export const BitmapMonitor = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Screen Bezel Top/Bottom */}
    <rect x="2" y="3" width="20" height="2" fill="currentColor" />
    <rect x="2" y="15" width="20" height="2" fill="currentColor" />
    {/* Screen Bezel Sides */}
    <rect x="2" y="5" width="2" height="10" fill="currentColor" />
    <rect x="20" y="5" width="2" height="10" fill="currentColor" />
    {/* Stand Neck */}
    <rect x="10" y="17" width="4" height="2" fill="currentColor" />
    {/* Stand Base */}
    <rect x="6" y="19" width="12" height="2" fill="currentColor" />
    {/* Optional: Glare/Reflection on screen */}
    <rect x="16" y="6" width="2" height="2" fill="currentColor" opacity="0.5" />
  </svg>
);

/** * BITMAP_SUN: A square core with detached rays */
export const BitmapSun = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* Center Block */}
    <rect x="8" y="8" width="8" height="8" fill="currentColor" />
    {/* Cardinal Rays */}
    <rect x="11" y="2" width="2" height="4" fill="currentColor" />
    <rect x="11" y="18" width="2" height="4" fill="currentColor" />
    <rect x="2" y="11" width="4" height="2" fill="currentColor" />
    <rect x="18" y="11" width="4" height="2" fill="currentColor" />
    {/* Diagonal Rays (Single dots) */}
    <rect x="5" y="5" width="2" height="2" fill="currentColor" />
    <rect x="17" y="5" width="2" height="2" fill="currentColor" />
    <rect x="5" y="17" width="2" height="2" fill="currentColor" />
    <rect x="17" y="17" width="2" height="2" fill="currentColor" />
  </svg>
);

/** * BITMAP_MOON: A stepped crescent shape */
export const BitmapMoon = ({ className, style }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* The main curve constructed of vertical bars */}
    <rect x="6" y="8" width="2" height="8" fill="currentColor" />
    <rect x="8" y="5" width="2" height="3" fill="currentColor" />
    <rect x="8" y="16" width="2" height="3" fill="currentColor" />
    <rect x="10" y="3" width="2" height="2" fill="currentColor" />
    <rect x="10" y="19" width="2" height="2" fill="currentColor" />
    
    {/* The inner cutout illusion */}
    <rect x="12" y="4" width="2" height="16" fill="currentColor" />
    <rect x="14" y="6" width="2" height="12" fill="currentColor" />
    <rect x="16" y="9" width="2" height="6" fill="currentColor" />
  </svg>
);

/** BITMAP_QUESTION: A pixelated question mark */
export const BitmapQuestion = ({ className, style }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Top arc of ? */}
    <rect x="4" y="2" width="6" height="2" fill="currentColor" />
    <rect x="10" y="4" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    <rect x="8"  y="8" width="2" height="2" fill="currentColor" />
    <rect x="6"  y="8" width="2" height="2" fill="currentColor" />
    <rect x="2"  y="4" width="2" height="2" fill="currentColor" />
    {/* Dot */}
    <rect x="6" y="12" width="2" height="2" fill="currentColor" />
  </svg>
);