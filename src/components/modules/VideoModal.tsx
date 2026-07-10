import React, { useState, useEffect } from 'react';
import { BitmapClose } from '../ui/icons';
import { buildEmbedUrl, DEFAULT_THEME } from '@/data/videos';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  framerateId: string;
  mobileFramerateId?: string | null;
  /** Framerate embed theme. Defaults to 'minimal' (strips the page header). */
  theme?: string;
}

export default function VideoModal({ isOpen, onClose, framerateId, mobileFramerateId, theme = DEFAULT_THEME }: VideoModalProps) {
  const [activeId, setActiveId] = useState(framerateId);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      // Use the vertical (9:16) edit on mobile only when one exists — otherwise fall
      // back to the landscape edit in the desktop layout.
      if (isMobile && mobileFramerateId) {
        setActiveId(mobileFramerateId);
        setIsVertical(true);
      } else {
        setActiveId(framerateId);
        setIsVertical(false);
      }
    }
  }, [isOpen, framerateId, mobileFramerateId]);

  if (!isOpen) return null;

  if (isVertical) {
    // Vertical (9:16) mobile layout — FULL-SCREEN COVER, tap-to-play.
    //
    // Source videos are 1080×1920 (exactly 9:16) and Framerate's Mux player uses
    // object-fit: contain, so a true-9:16 iframe fills with no internal letterbox. The iframe
    // is sized to cover the viewport in both axes via max() (kept a true 9:16); overflow:hidden
    // on the container crops the sliver that spills off the sides on a tall phone (~19.5:9).
    //
    // SOUND: no autoplay here. Mobile browsers block autoplay WITH sound, and the minimal
    // theme hides the unmute control — so muted autoplay would be permanently silent. Instead
    // the poster + play button shows; the user's tap on it is an in-iframe gesture, which lets
    // the video start WITH audio. (Desktop keeps autoplay — see below.)
    //
    // Container and iframe share the 100dvh (dynamic viewport) basis so the iframe matches the
    // container height at every toolbar state — no dark band top/bottom.
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 200,
          backgroundColor: 'hsl(var(--background))',
          overflow: 'hidden',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <iframe
          src={buildEmbedUrl(activeId, { theme })}
          style={{
            width: 'max(100vw, calc(100dvh * 9 / 16))',
            height: 'max(100dvh, calc(100vw * 16 / 9))',
            border: 'none',
            display: 'block',
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

  // Desktop: constrained 16:9 (aspect-video) box.
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
          src={buildEmbedUrl(activeId, { theme, autoplay: true })}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-10" />
      </div>
    </div>
  );
}
