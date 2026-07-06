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

/**
 * The three ServicePillars icons below are sourced from
 * src/assets/icons/icon-sonic-branding.svg, icon-uiux-sound.svg, and
 * icon-experiential-audio.svg — higher-fidelity versions of the same
 * "constructed from data blocks" bitmap language as the icons above (each is
 * a field of transformed 28x28 unit squares on a 700x700 canvas, exported
 * from the design file as-is). `fill="currentColor"` is set once on the root
 * <svg> rather than per-rect — none of the nested <g>/<rect> elements
 * override fill, so it cascades to every block automatically. This is what
 * lets them inherit text-accent/text-primary and transition with
 * ServicePillars' active state exactly like the hand-built icons above.
 */

/** BITMAP_SONIC_BRANDING: Service icon for Sonic Branding */
export const BitmapSonicBranding = ({ className, style }: IconProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 700 700"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g transform="matrix(1,0,0,1,-150,-150)">
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2790.01,1962.51)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2508.43,1962.84)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2414.58,2150.54)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1320.45,-1056.69)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1414.3,-1150.54)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2320.73,1868.99)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2226.58,1962.51)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2414.58,1775.14)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2320.73,2056.69)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1320.45,-868.991)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1414.3,-775.14)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
    </g>
  </svg>
);

/** BITMAP_UIUX_SOUND: Service icon for UI/UX Sound */
export const BitmapUiUxSound = ({ className, style }: IconProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 700 700"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g transform="matrix(1,0,0,1,-150,-150)">
      <g transform="matrix(-6.14977e-16,-3.34778,3.34778,-6.14977e-16,-1105.34,2697.12)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-6.14977e-16,-3.34778,3.34778,-6.14977e-16,-1199.19,2602.15)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(1.02496e-15,3.34778,-3.34778,1.02496e-15,2105.34,-1603.27)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(1.02496e-15,3.34778,-3.34778,1.02496e-15,2199.19,-1509.42)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2461.37,1962.84)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2555.22,1774.01)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1461.37,-868.991)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2366.39,1867.87)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1366.39,-774.015)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
    </g>
  </svg>
);

/**
 * The seven icons below are for the "Applications" ConceptGrids on
 * uiux-sound.astro (Mobile Apps, Web Applications, Hardware Products) and
 * experiential-audio.astro (Virtual Reality, Augmented Reality, Physical
 * Space, Generative Audio).
 *
 * Second pass — the first pass (varying rect sizes, opacity-shaded accents,
 * compound multi-part scenes like chrome bars + page lines + traffic-light
 * dots) read as "too much detail" against the reference ServicePillars icons,
 * which are built from a single repeated block size with zero opacity
 * variation. Rebuilt here using that same discipline: every block in a given
 * icon is the same size, fill="currentColor" at full opacity throughout, and
 * each shape is a sparse, abstract arrangement rather than a literal
 * illustration — matching BitmapTick's stepped-border technique used
 * elsewhere in this file. Black on transparent (fill="currentColor" defaults
 * to black text colour).
 */

/** BITMAP_MOBILE_APPS: A stepped phone-body outline, single block size, no opacity */
export const BitmapMobileApps = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="5" y="0" width="6" height="2" fill="currentColor" />
    <rect x="5" y="14" width="6" height="2" fill="currentColor" />
    <rect x="3" y="2" width="2" height="12" fill="currentColor" />
    <rect x="11" y="2" width="2" height="12" fill="currentColor" />
    <rect x="3" y="0" width="2" height="2" fill="currentColor" />
    <rect x="11" y="0" width="2" height="2" fill="currentColor" />
    <rect x="3" y="14" width="2" height="2" fill="currentColor" />
    <rect x="11" y="14" width="2" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_WEB_APPLICATIONS: A stepped window frame + single divider bar */
export const BitmapWebApplications = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="3" y="1" width="10" height="2" fill="currentColor" />
    <rect x="3" y="13" width="10" height="2" fill="currentColor" />
    <rect x="1" y="3" width="2" height="10" fill="currentColor" />
    <rect x="13" y="3" width="2" height="10" fill="currentColor" />
    <rect x="1" y="1" width="2" height="2" fill="currentColor" />
    <rect x="13" y="1" width="2" height="2" fill="currentColor" />
    <rect x="1" y="13" width="2" height="2" fill="currentColor" />
    <rect x="13" y="13" width="2" height="2" fill="currentColor" />
    <rect x="3" y="4" width="10" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_HARDWARE_PRODUCTS: A chip body with four pin blocks, single block size, no opacity */
export const BitmapHardwareProducts = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="4" y="4" width="8" height="8" fill="currentColor" />
    <rect x="5" y="1" width="2" height="3" fill="currentColor" />
    <rect x="9" y="1" width="2" height="3" fill="currentColor" />
    <rect x="5" y="12" width="2" height="3" fill="currentColor" />
    <rect x="9" y="12" width="2" height="3" fill="currentColor" />
    <rect x="1" y="5" width="3" height="2" fill="currentColor" />
    <rect x="1" y="9" width="3" height="2" fill="currentColor" />
    <rect x="12" y="5" width="3" height="2" fill="currentColor" />
    <rect x="12" y="9" width="3" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_VIRTUAL_REALITY: A headset band + strap nubs, flat blocks only */
export const BitmapVirtualReality = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="1" y="5" width="14" height="6" fill="currentColor" />
    <rect x="3" y="4" width="10" height="1" fill="currentColor" />
    <rect x="3" y="11" width="10" height="1" fill="currentColor" />
    <rect x="0" y="7" width="1" height="2" fill="currentColor" />
    <rect x="15" y="7" width="1" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_AUGMENTED_REALITY: Scan-frame corner brackets + a single solid centre marker */
export const BitmapAugmentedReality = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="1" y="1" width="4" height="2" fill="currentColor" />
    <rect x="1" y="1" width="2" height="4" fill="currentColor" />
    <rect x="11" y="1" width="4" height="2" fill="currentColor" />
    <rect x="13" y="1" width="2" height="4" fill="currentColor" />
    <rect x="1" y="13" width="4" height="2" fill="currentColor" />
    <rect x="1" y="11" width="2" height="4" fill="currentColor" />
    <rect x="11" y="13" width="4" height="2" fill="currentColor" />
    <rect x="13" y="11" width="2" height="4" fill="currentColor" />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_PHYSICAL_SPACE: An open room outline + single position marker */
export const BitmapPhysicalSpace = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="2" y="12" width="12" height="2" fill="currentColor" />
    <rect x="2" y="2" width="2" height="12" fill="currentColor" />
    <rect x="12" y="2" width="2" height="12" fill="currentColor" />
    <rect x="2" y="2" width="4" height="2" fill="currentColor" />
    <rect x="10" y="2" width="4" height="2" fill="currentColor" />
    <rect x="7" y="7" width="2" height="2" fill="currentColor" />
  </svg>
);

/** BITMAP_GENERATIVE_AUDIO: Uniform-width bars of varying height — irregular, vs. BitmapWave's regular pulse */
export const BitmapGenerativeAudio = ({ className, style }: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="1" y="10" width="2" height="4" fill="currentColor" />
    <rect x="3" y="6" width="2" height="8" fill="currentColor" />
    <rect x="5" y="9" width="2" height="5" fill="currentColor" />
    <rect x="7" y="2" width="2" height="12" fill="currentColor" />
    <rect x="9" y="7" width="2" height="7" fill="currentColor" />
    <rect x="11" y="4" width="2" height="10" fill="currentColor" />
    <rect x="13" y="11" width="2" height="3" fill="currentColor" />
  </svg>
);

/** BITMAP_EXPERIENTIAL_AUDIO: Service icon for Experiential Audio */
export const BitmapExperientialAudio = ({ className, style }: IconProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 700 700"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <g transform="matrix(1,0,0,1,-150,-150)">
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2414.44,2056.86)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2320.59,1963.34)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2508.29,1775.64)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2508.29,2150.04)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1414.44,-1056.19)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(-3.34778,4.09984e-16,-4.09984e-16,-3.34778,2414.44,1869.49)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1320.59,-962.343)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1508.01,-962.809)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
      <g transform="matrix(3.34778,-8.19969e-16,8.19969e-16,3.34778,-1414.44,-868.701)">
        <rect x="585.872" y="422.942" width="28.034" height="28.034" />
      </g>
    </g>
  </svg>
);