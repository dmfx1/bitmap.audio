import React, { useState, useEffect } from 'react';
import { BitmapClose } from '../ui/icons';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  framerateId: string;
  mobileFramerateId?: string | null;
}

// ── TUNE THIS if the Framerate header offset changes ──────────────────────────
// This clips the Framerate page header (black area) from the top of the iframe.
// Value is a fraction of the device screen height (0.0–1.0).
// From testing: ~0.38 works for iPhone 14. Adjust up/down if black space remains.
const FRAMERATE_HEADER_RATIO = 0.7;

export default function VideoModal({ isOpen, onClose, framerateId, mobileFramerateId }: VideoModalProps) {
  const [activeId, setActiveId] = useState(framerateId);
  const [isVertical, setIsVertical] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      if (isMobile && mobileFramerateId) {
        setActiveId(mobileFramerateId);
        setIsVertical(true);
        setHeaderOffset(Math.round(window.innerHeight * FRAMERATE_HEADER_RATIO));
      } else {
        setActiveId(framerateId);
        setIsVertical(false);
        setHeaderOffset(0);
      }
    }
  }, [isOpen, framerateId, mobileFramerateId]);

  if (!isOpen) return null;

  if (isVertical) {
    return (
      // backgroundColor required: without it the wrapper is transparent and the portaled
      // cube (z-1, body-level) shows through during iframe load + Framerate header clipping.
      <div style={{ position: 'fixed', inset: 0, zIndex: 200, overflow: 'hidden', backgroundColor: 'hsl(var(--background))' }}>
        <iframe
          src={`https://framerate.tv/embed/${activeId}`}
          style={{
            position: 'absolute',
            top: -headerOffset,
            left: 0,
            width: '100%',
            height: `calc(100% + ${headerOffset}px)`,
            border: 'none',
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50 }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground hover:text-accent bg-background/80 px-2 py-1"
        >
          <span className="opacity-50 uppercase">[ Decommission ]</span>
          <BitmapClose className="w-5 h-5 text-accent" />
        </button>
      </div>
    );
  }

  // Desktop: constrained aspect-video box
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 lg:p-24">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-6xl aspect-video min-h-[200px] bg-card border border-foreground/10 shadow-2xl animate-fade-in-up">
        <div className="absolute -top-px -left-px w-10 h-10 border-t border-l border-accent z-10" />
        <div className="absolute -bottom-px -right-px w-10 h-10 border-b border-r border-accent z-10" />

        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground hover:text-accent group transition-all z-30"
        >
          <span className="opacity-50 group-hover:opacity-100 uppercase">[ Decommission ]</span>
          <BitmapClose className="w-5 h-5 text-accent" />
        </button>

        <iframe
          src={`https://framerate.tv/embed/${activeId}`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-10" />
      </div>
    </div>
  );
}