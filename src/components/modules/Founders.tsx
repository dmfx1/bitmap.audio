/* src/components/modules/Founders.tsx */
import React from 'react';

// ── HEADSHOT CONFIG ───────────────────────────────────────────────────────────
// scale:        zoom multiplier — increase to make face appear closer/larger
// position:     CSS object-position (x y) — shifts which part of image is centred
// vignetteAt:   "x% y%" — centre of the radial vignette bright spot (aim for nose)
// ─────────────────────────────────────────────────────────────────────────────

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Build & Implementation",
    bio: "Having spent over a decade working as a music producer and sound designer for advertising and animation, Dom has more recently turned his attention to the world of surround sound for film and object-based audio [Dolby Atmos / Wwise] for immersive experiences. An obsessive systems based thinker exploring new ways of user interaction with sound.",
    image: {
      src: "/images/dom-headshot-01.webp",
      scale: 1.0,
      position: "center 45%", // nose at ~47% of image — 40% pulls it to card centre
      vignetteAt: "50% 50%",
    }
  },
  {
    name: "[nick.granville-fall]",
    role: "Theory & Analytics",
    bio: "Nick specialises in emotional storytelling through sound and has built up a wealth of experience across advertising and immersive installations. He has a deep, theoretical understanding of 'why' sound resonates in the way it does, and is able to dissect the psychology to ensure user expereience is heightened in a meaningful way.",
    image: {
      src: "/images/nick-headshot-01.webp",
      scale: 1.0,
      position: "center 45%", // nose at ~52% of image — 55% pulls it to card centre
      vignetteAt: "50% 50%",
    }
  },
];

export default function Founders() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-foreground/5 w-full">
      {founders.map((f, index) => {
        const formattedId = String(index).padStart(4, '0');
        return (
          <div key={index} data-scene-item className="mobile-viewport-active group relative p-4 md:p-12 md:min-h-[72vh] flex flex-col justify-center overflow-hidden border border-foreground/10">
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-foreground/10 group-hover:border-accent transition-colors" />

            {/* Headshot — per-person config above controls scale, position, vignette centre */}
            {f.image && (
              <div
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                  WebkitMaskImage: `radial-gradient(ellipse 90% 85% at ${f.image.vignetteAt}, black 20%, rgba(0,0,0,0.5) 55%, transparent 80%)`,
                  maskImage: `radial-gradient(ellipse 90% 85% at ${f.image.vignetteAt}, black 20%, rgba(0,0,0,0.5) 55%, transparent 80%)`,
                }}
              >
                <img
                  src={f.image.src}
                  alt=""
                  decoding="async"
                  className="mix-blend-screen opacity-50 brightness-125"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: f.image.position,
                    transform: `scale(${f.image.scale})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            )}

            <div className="relative z-10">
              <span className="font-mono text-[10px] mt-8 md:mt-0 text-accent block mb-6 tracking-widest">{formattedId}</span>
              <h3
                className="text-foreground font-mono text-3xl mb-2 transition-all group-hover:translate-x-2"
                style={{ textShadow: '0 0 20px hsl(var(--background)), 0 0 40px hsl(var(--background))' }}
              >{f.name}</h3>
              <p
                className="text-primary font-mono text-sm uppercase tracking-[0.3em] mb-8 opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ textShadow: '0 0 15px hsl(var(--background)), 0 0 30px hsl(var(--background))' }}
              >{f.role}</p>
              <div className="h-px w-8 bg-foreground/50 mb-8 group-hover:w-full transition-all duration-700" />
              <p
                className="text-foreground font-mono text-2xl mb-12 md:mb-0 leading-relaxed max-w-[90%] group-hover:text-foreground transition-colors"
                style={{ textShadow: '0 0 15px hsl(var(--background)), 0 0 15px hsl(var(--background))' }}
              >{f.bio}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        );
      })}
    </div>
  );
}
