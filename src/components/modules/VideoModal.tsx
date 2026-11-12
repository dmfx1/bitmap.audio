import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { buildEmbedUrl, DEFAULT_THEME } from '@/data/videos';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  framerateId: string;
  mobileFramerateId?: string | null;
  /** Framerate embed theme. Defaults to 'minimal' (strips the page header). */
  theme?: string;
  /** A direct video file (e.g. a Mux .mp4). When set, the modal plays it in a native <video> (with sound,
   *  controls) in the desktop-style box on every screen, instead of the FrameRate iframe. (2026-11-12) */
  src?: string;
}

export default function VideoModal({ isOpen, onClose, framerateId, mobileFramerateId, theme = DEFAULT_THEME, src }: VideoModalProps) {
  const [activeId, setActiveId] = useState(framerateId);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      // Use the vertical (9:16) edit on mobile only when one exists — otherwise fall
      // back to the landscape edit in the desktop layout.
      if (isMobile && mobileFramerateId && !src) {
        setActiveId(mobileFramerateId);
        setIsVertical(true);
      } else {
        setActiveId(framerateId);
        setIsVertical(false);
      }
    }
  }, [isOpen, framerateId, mobileFramerateId]);

  if (!isOpen || typeof document === 'undefined') return null;

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
    return createPortal(
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
          aria-label="Close"
          className="group flex items-center gap-3 text-foreground hover:opacity-80 bg-background/80 px-3 py-2"
        >
          <span style={{ fontFamily: 'var(--font-departure)', fontSize: '1rem', letterSpacing: '0.04em', WebkitTextStroke: '0.04em currentColor' }}>[ close ]</span>
          <span style={{ fontFamily: 'var(--font-departure)', fontSize: '2rem', lineHeight: 1, WebkitTextStroke: '0.05em currentColor' }}>X</span>
        </button>
      </div>,
      document.body,
    );
  }

  // Desktop: a big 16:9 box filling ~85% of the viewport (bounded by 85vw AND 85svh so it stays
  // 16:9 and never overflows on short/wide screens), centred over a blurred backdrop.
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl animate-fade-in" onClick={onClose} />

      <div
        className="relative aspect-video min-h-[200px] bg-card border border-foreground/10 shadow-2xl animate-fade-in-up"
        style={{ width: 'min(85vw, calc(85svh * 16 / 9))' }}
      >

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-16 right-0 flex items-center gap-4 text-foreground hover:opacity-80 group transition-opacity z-30"
        >
          {/* 2026-11-12: bitmap close — [ close ] + a big Departure Mono X (was [ Decommission ] + icon, corner marks removed) */}
          <span style={{ fontFamily: 'var(--font-departure)', fontSize: '1.15rem', letterSpacing: '0.04em', WebkitTextStroke: '0.04em currentColor' }}>[ close ]</span>
          <span style={{ fontFamily: 'var(--font-departure)', fontSize: '2.75rem', lineHeight: 1, WebkitTextStroke: '0.05em currentColor' }}>X</span>
        </button>

        {src ? (
          <video src={src} className="absolute inset-0 w-full h-full bg-black" autoPlay controls playsInline />
        ) : (
          <iframe
            src={buildEmbedUrl(activeId, { theme, autoplay: true })}
            className="absolute inset-0 w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-10" />
      </div>
    </div>,
    document.body,
  );
}
