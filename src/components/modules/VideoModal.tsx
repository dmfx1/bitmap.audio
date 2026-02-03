/* src/components/modules/VideoModal.tsx */
import React from 'react';
import { BitmapClose } from '../ui/icons';

export default function VideoModal({ isOpen, onClose, vimeoId }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 lg:p-24">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl animate-fade-in" onClick={onClose} />

      {/* DOUBLE-LOCK CONTAINER: aspect-ratio + min-height */}
      <div className="relative w-full max-w-6xl bg-black border border-white/10 shadow-2xl animate-fade-in-up aspect-video min-h-[200px]">
        
        {/* CORNER BRACKETS */}
        <div className="absolute -top-px -left-px w-10 h-10 border-t border-l border-accent z-10" />
        <div className="absolute -bottom-px -right-px w-10 h-10 border-b border-r border-accent z-10" />

        <button onClick={onClose} className="absolute -top-12 right-0 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground hover:text-accent group transition-all">
          <span className="opacity-50 group-hover:opacity-100 uppercase">[ Terminate_Stream ]</span>
          <BitmapClose className="w-5 h-5 text-accent" />
        </button>

        {/* FORCED FILL: absolute inset-0 on the iframe itself */}
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=ffb400&title=0&byline=0&portrait=0&dnt=1`}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Bitmappy Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-20 opacity-10" />
      </div>
    </div>
  );
}