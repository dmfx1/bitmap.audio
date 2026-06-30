import React, { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import VideoModal from './VideoModal';
import TypewriterHero from './TypewriterHero';
import ConceptGrid, { type Concept } from './ConceptGrid';
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { Button } from '@/components/ui/button';

const projects: Concept[] = [
  {
    id: 1,
    title: 'SONIC BRANDING',
    desc: 'Sonic branding for digital infrastructure.',
    vimeoId: '836174895',
    mobileVimeoId: '1163955176',
    previewVideo: '/video/regency_silent.mp4'
  },
  {
    id: 2,
    title: 'USER EXPERIENCE',
    desc: 'UI/UX sound for digital interfaces + apps.',
    vimeoId: '708117517',
    mobileVimeoId: '1163955194',
    previewVideo: '/video/seon_silent.mp4'
  },
  {
    id: 3,
    title: 'IMMERSIVE AUDIO',
    desc: 'Spatial audio for immersive environments.',
    vimeoId: '1108099090',
    mobileVimeoId: '1163955124',
    previewVideo: '/video/matchroom_silent.mp4'
  },
];

// ── INTRO ANIMATION TIMING (ms) ────────────────────────────────────────────
// Adjust these to tune the feel of the intro sequence.
const T = {
  imgEnter:        50,   // delay before image begins entering
  logoStart:       550,  // b logo flash begins
  logoFlash:       450,  // duration of flash-in animation
  logoFlare:       1050, // flare fires — image also goes to full colour here
  logoFlareDur:    150,  // how long the brightness flare lasts
  logoPostFlare:   1380, // flare rolls back to normal accent
  logoPrimary:     1550, // switches to primary cyan
  logoPrimaryHold: 200,  // holds briefly before disappearing
  logoFadeOut:     1750, // clean fade-out begins (no flicker)
  logoFadeOutDur:  200,  // duration of clean fade
  logoDone:        1960, // logo gone, typing starts
  contentIn:       2400, // buttons + grid scramble in
  imgAmbient:      3000, // image settles to ambient opacity
};

type LogoPhase = 'hidden' | 'flash' | 'flare' | 'post-flare' | 'primary' | 'fade-out' | 'gone';

interface HomeHeroProps {
  imageSrc?: string;
}

export default function HomeHero({ imageSrc }: HomeHeroProps) {
  const [activeProject, setActiveProject] = useState<Concept | null>(null);
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ── IMAGE STATE ─────────────────────────────────────────────────────────────
  const [imgVisible, setImgVisible]   = useState(false);  // triggers entrance transition
  const [imgDimmed, setImgDimmed]     = useState(false);  // dims + scales during flare
  const [imgAmbient, setImgAmbient]   = useState(false);  // drops to near-invisible after intro

  // ── LOGO STATE ──────────────────────────────────────────────────────────────
  const [logoPhase, setLogoPhase] = useState<LogoPhase>('hidden');

  const scrambledSubtitle  = useBinaryScramble("SONIC INFRASTRUCTURE", isScanning);
  const scrambledAccess    = useBinaryScramble("ACCESS", isScanning);
  const scrambledHandshake = useBinaryScramble("[INIT_HANDSHAKE]", isScanning);

  useEffect(() => {
    setMounted(true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, delay: number) => {
      const id = setTimeout(fn, delay);
      timers.push(id);
    };

    // Image fades in with a very gentle scale-up
    t(() => setImgVisible(true), T.imgEnter);

    // ── B LOGO SEQUENCE ──────────────────────────────────────────────────────
    // 1. Flash in (rapid flicker, primary colour)
    t(() => setLogoPhase('flash'),      T.logoStart);
    // 2. Flare: switches to accent, brightness boosted 25%
    //    Image simultaneously begins dimming + scaling back
    t(() => { setLogoPhase('flare');  setImgDimmed(true); }, T.logoFlare);
    // 3. Flare rolls back to normal accent
    t(() => setLogoPhase('post-flare'), T.logoPostFlare);
    // 4. Returns to primary, holds briefly
    t(() => setLogoPhase('primary'),    T.logoPrimary);
    // 5. Clean fade out — no flicker
    t(() => setLogoPhase('fade-out'),   T.logoFadeOut);
    // 6. Gone — typing begins
    t(() => { setLogoPhase('gone'); setStep(1); }, T.logoDone);

    // Image drops to ambient after the intro clears
    t(() => setImgAmbient(true), T.imgAmbient);

    // Content scrambles in after typing completes
    t(() => setIsScanning(true), T.contentIn);

    return () => timers.forEach(clearTimeout);
  }, []);

  // ── DERIVED IMAGE STYLES ────────────────────────────────────────────────────
  // opacity:   0 → 1 (enter) → 0.5 (dimmed during flare) → 0.08 (ambient)
  // scale:  1.0 → 1.06 (enter) → 0.88 (dimmed, stays there)
  const imgOpacity   = !imgVisible ? 0 : imgAmbient ? 0.4 : imgDimmed ? 0.85 : 1;
  const imgScale     = !imgVisible ? 1.15 : imgDimmed ? 1.17 : 1.2;
  // ↑ TUNE HERE — imgScale: hidden / during-flare / resting. imgOpacity same order.
  // Greyscale: starts fully grey, goes full colour at flare peak, pulls back to slight grey at rest
  const imgGrayscale = imgDimmed ? 0 : imgAmbient ? 0.4 : 0.8; // 0=full colour, 1=full grey
  const imgTransition = imgAmbient
    ? 'opacity 1.5s ease, transform 1.5s ease, filter 0.8s ease'
    : imgDimmed
    ? 'opacity 1s ease, transform 2s ease, filter 0.6s ease'  // ← colour unlocks here
    : 'opacity 1.5s ease, transform 3s ease, filter 0s';      // ← instant grey on load

  // ── DERIVED LOGO STYLES ─────────────────────────────────────────────────────
  const logoContainerStyle = (): CSSProperties => {
    switch (logoPhase) {
      case 'flash':
        return {
          backgroundColor: 'hsl(var(--primary))',
          boxShadow: '0 0 40px hsl(var(--primary) / 0.6)',
          animation: `logo-flash-in ${T.logoFlash}ms ease-out forwards`,
        };
      case 'flare':
        return {
          backgroundColor: 'hsl(var(--accent))',
          boxShadow: '0 0 80px hsl(var(--accent) / 0.9), 0 0 140px hsl(var(--accent) / 0.4)',
          filter: 'brightness(1.25)',
          transition: 'all 0.1s ease',
        };
      case 'post-flare':
        return {
          backgroundColor: 'hsl(var(--accent))',
          boxShadow: '0 0 50px hsl(var(--accent) / 0.6)',
          filter: 'brightness(1)',
          transition: 'all 0.14s ease',
        };
      case 'primary':
        return {
          backgroundColor: 'hsl(var(--primary))',
          boxShadow: '0 0 50px hsl(var(--primary) / 0.7)',
          filter: 'brightness(1)',
          transition: 'background-color 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease',
        };
      case 'fade-out':
        return {
          backgroundColor: 'hsl(var(--primary))',
          boxShadow: '0 0 20px hsl(var(--primary) / 0.2)',
          opacity: 0,
          transition: `opacity ${T.logoFadeOutDur}ms ease`,
        };
      case 'gone':
      case 'hidden':
      default:
        return { opacity: 0, pointerEvents: 'none' };
    }
  };

  // ── LOGO PORTAL (body-level so it beats Layout's z-10 during intro flash) ──
  const logoPortal = logoPhase !== 'hidden' && logoPhase !== 'gone' ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div
        className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
        style={logoContainerStyle()}
      >
        <img
          src="/images/logo-b.png"
          alt="bitmap.audio logo"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  ) : null;

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center">

      {/* AMBIENT GLOW — fixed layers behind the cube for depth */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{ opacity: imgVisible ? 1 : 0, transition: 'opacity 3s ease' }}
      >
        {/* Subtle primary glow at centre — gives the cube a light source */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_center,hsl(var(--primary)/0.07)_0%,transparent_100%)]" />
        {/* Vignette — background closes in from edges, frames the cube */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_100%,hsl(var(--background))_100%)]" />
      </div>

      {/* IMAGE — fixed but NOT portaled, so it shares the Layout z-10 stacking context */}
      {imageSrc && (
        <div
          className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
          style={{ opacity: imgOpacity, transition: imgTransition }}
        >
          <img
            src={imageSrc}
            alt=""
            loading="eager"
            decoding="async"
            className="absolute top-1/2 left-1/2 w-[90vw] h-[90vh] object-contain"
            style={{ transform: `translate(-50%, -50%) scale(${imgScale})`, filter: `grayscale(${imgGrayscale})`, transition: imgTransition }}
          />
        </div>
      )}

      {/* LOGO FLASH — portaled to body so it beats Layout's z-10 box */}
      {mounted && typeof document !== 'undefined' && createPortal(logoPortal, document.body)}

      <div className="relative z-[2] flex flex-col w-full my-[5vh] min-h-[50svh] md:min-h-[0svh] justify-center md:justify-start">

        {/* HEADER — appears after intro */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="h-12 mb-8 md:mb-12">
            {step >= 1 && (
              <div className="w-12 h-12 flex bg-primary items-center justify-center animate-fade-in">
                <img
                  src="/images/logo-b.png"
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="min-h-[1.5em]">
            {step >= 1 && (
              <TypewriterHero
                text="bitmap.audio"
                isBrand={true}
                speed={60}
                className="font-trial-dm text-5xl md:text-6xl lg:text-[5rem] font-light text-foreground tracking-tighter"
                onComplete={() => setStep(2)}
              />
            )}
          </div>
        </div>

        {/* SUBTITLE + BUTTONS */}
        <div className={`relative w-full md:w-[33vw] mx-auto ${isScanning ? 'opacity-100' : 'opacity-0'}`}>
          <div className="opacity-90 space-y-8 md:space-y-6">
            <p className="text-xs md:text-xl text-foreground max-w-2xl mx-auto font-trial-dm uppercase tracking-[0.2em] min-h-[1.5em]">
              {scrambledSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mx-auto w-full p-0 md:p-4 max-w-3xl">
              <a href="/home" className="w-full">
                <Button
                  size="xl"
                  className="w-full hover:bg-background/90 rounded-none font-mono text-lg tracking-widest h-14 hover:text-accent hover:border-accent transition-colors"
                >
                  {scrambledAccess}
                </Button>
              </a>
              <a href="/contact" className="w-full">
                <Button
                  variant="outline"
                  size="xl"
                  className="w-full animate-morph bg-background rounded-none font-mono text-lg tracking-widest h-14 hover:text-accent hover:border-primary transition-colors"
                >
                  {scrambledHandshake}
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* CONCEPT GRID */}
      <div className={`relative z-[2] w-full md:w-5/6 ${isScanning ? 'opacity-100' : 'opacity-0'}`}>
        <ConceptGrid
          items={projects}
          isScanning={isScanning}
          className="py-0 md:py-12"
          onProjectClick={(project) => setActiveProject(project)}
        />
      </div>

      <VideoModal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        vimeoId={activeProject?.vimeoId || ""}
        mobileVimeoId={activeProject?.mobileVimeoId}
      />
    </div>
  );
}
