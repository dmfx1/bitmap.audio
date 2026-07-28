/* src/components/modules/SonicVisual.tsx
 *
 * Generative audio-motion visual — replaces AI hero imagery on the v2 redesign.
 * A layered oscilloscope: several sine waves scrolling at different rates plus a
 * reactive "spectrum" floor, drawn on a <canvas> with a requestAnimationFrame loop.
 *
 * Colours are pulled live from the brand HSL CSS variables (--primary cyan,
 * --accent amber, --foreground) so it always tracks the theme.
 *
 * Respects prefers-reduced-motion (renders a single static frame, no loop).
 * GSAP is used only for the entrance fade so it slots into the site's animation
 * engine conventions; the continuous motion is rAF/canvas (cheaper than tweening
 * hundreds of points per frame through GSAP).
 */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SonicVisualProps {
  className?: string;
  /** Master motion intensity 0–1. */
  intensity?: number;
}

// Read an HSL tri:  "180 84% 60%"  ->  "hsl(180 84% 60% / a)"
function cssHsl(varName: string, alpha = 1): string {
  if (typeof window === 'undefined') return `hsl(0 0% 100% / ${alpha})`;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return raw ? `hsl(${raw} / ${alpha})` : `hsl(0 0% 100% / ${alpha})`;
}

export default function SonicVisual({ className = '', intensity = 1 }: SonicVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Wave layer config — {colour var, alpha, amplitude px, wavelength, speed, phase}
    const layers = [
      { v: '--primary', a: 0.9, amp: 46, wl: 260, sp: 0.9, ph: 0, w: 1.5 },
      { v: '--primary', a: 0.35, amp: 70, wl: 190, sp: -0.6, ph: 1.6, w: 1 },
      { v: '--accent', a: 0.8, amp: 30, wl: 340, sp: 1.4, ph: 3.1, w: 1.5 },
      { v: '--accent', a: 0.22, amp: 96, wl: 150, sp: -1.1, ph: 0.7, w: 1 },
    ];

    const drawWave = (t: number, cfg: typeof layers[number]) => {
      const midY = height / 2;
      // Envelope so waves taper toward the left edge (where they meet the text).
      ctx.beginPath();
      ctx.lineWidth = cfg.w;
      ctx.strokeStyle = cssHsl(cfg.v, cfg.a);
      ctx.shadowColor = cssHsl(cfg.v, cfg.a * 0.7);
      ctx.shadowBlur = 12;
      const step = 4;
      for (let x = 0; x <= width; x += step) {
        const edgeFade = Math.min(1, x / (width * 0.55)); // fade in from left
        const breathe = 0.6 + 0.4 * Math.sin(t * 0.0006 + cfg.ph);
        const y =
          midY +
          Math.sin(x / cfg.wl + t * 0.001 * cfg.sp + cfg.ph) *
            cfg.amp *
            edgeFade *
            breathe *
            intensity;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Vertical "bit column" spectrum bars along the baseline — the bitmap motif.
    const drawSpectrum = (t: number) => {
      const cols = 46;
      const gap = width / cols;
      const baseY = height * 0.9;
      for (let i = 0; i < cols; i++) {
        const x = i * gap + gap * 0.25;
        const edgeFade = Math.min(1, (i / cols) / 0.5);
        const h =
          (6 +
            Math.abs(Math.sin(i * 0.6 + t * 0.0022)) * 54 *
              (0.4 + 0.6 * Math.sin(i * 0.3 + t * 0.0011))) *
          edgeFade *
          intensity;
        ctx.fillStyle = cssHsl(i % 7 === 0 ? '--accent' : '--primary', 0.28 * edgeFade + 0.06);
        ctx.fillRect(x, baseY - h, Math.max(1.5, gap * 0.4), h);
      }
    };

    let raf = 0;
    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      drawSpectrum(t);
      for (const cfg of layers) drawWave(t, cfg);
      if (!reduced) raf = requestAnimationFrame(render);
    };

    resize();
    render(reduced ? 1200 : performance.now());

    // Entrance fade via GSAP (site animation-engine convention).
    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize());
      ro.observe(root);
    } else {
      window.addEventListener('resize', resize);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full ${className}`}
      aria-hidden="true"
      style={{ willChange: 'opacity' }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
