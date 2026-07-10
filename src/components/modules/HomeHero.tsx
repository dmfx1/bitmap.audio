import React, { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import VideoModal from './VideoModal';
import TypewriterHero from './TypewriterHero';
import ConceptGrid, { type Concept } from './ConceptGrid';
import { useBinaryScramble } from '@/hooks/use-binary-scramble';
import { Button } from '@/components/ui/button';
import { getVideo } from '@/data/videos';

// Videos are referenced by slug — the IDs themselves live in src/data/videos.ts.
const projects: Concept[] = [
  {
    id: 1,
    title: 'SONIC BRANDING',
    desc: 'Sonic branding for digital infrastructure.',
    videoSlug: 'sonic-branding',
    previewVideo: '/video/regency_silent.mp4'
  },
  {
    id: 2,
    title: 'USER EXPERIENCE',
    desc: 'UI/UX sound for digital interfaces + apps.',
    videoSlug: 'user-experience',
    previewVideo: '/video/seon_silent.mp4'
  },
  {
    id: 3,
    title: 'IMMERSIVE AUDIO',
    desc: 'Spatial audio for immersive environments.',
    videoSlug: 'immersive-audio',
    previewVideo: '/video/matchroom_silent.mp4'
  },
];

// ── DESKTOP INTRO TIMING (ms) ───────────────────────────────────────────────
// Full sequence: flicker → flare → primary → fade-out → type
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

// ── MOBILE INTRO TIMING (ms) ────────────────────────────────────────────────
// Simplified sequence: cube glows in grey → b logo fades in →
// cube hits peak colour + logo fades out simultaneously → typing starts.
// Edit all mobile timing here — completely separate from desktop T above.
const T_MOBILE = {
  imgEnter:         50,   // cube begins fading in (greyscale)
  logoFadeIn:       300,  // b logo starts fading in (primary cyan, slow)
  logoFadeInDur:    800,  // ms for logo to reach full opacity
  colorUnlock:      1100, // cube reaches peak colour; logo starts fading out simultaneously
  logoFadeOutDur:   400,  // ms for logo to disappear
  logoDone:         1550, // logo fully gone — typing starts
  imgAmbient:       1650, // MUST fire before contentIn — cube dims to 0.4 opacity BEFORE
                          // content appears, otherwise full-brightness cube bleeds through
                          // the intentionally-transparent mobile cards (bg-card/60).
  contentIn:        2300, // content appears after cube has had 650ms head-start on dimming.
                          // ambient transition is 0.8s so cube is ~80% dimmed by this point.
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
  const [isMobile, setIsMobile] = useState(false);
  // iOS Safari fix: body has opacity-0 animation on page load, making body the containing
  // block for position:fixed children. CSS `top: 50%` then resolves to 50% of body height
  // (page height) rather than 50% of viewport height (screen center). Pixel values from
  // window.innerHeight/2 are always viewport-relative regardless of containing block.
  const [vCenter, setVCenter] = useState({ top: '50%' as string | number, left: '50%' as string | number });

  // ── IMAGE STATE ─────────────────────────────────────────────────────────────
  const [imgVisible, setImgVisible]           = useState(false);  // triggers entrance
  const [imgDimmed, setImgDimmed]             = useState(false);  // desktop: unlocks colour at flare
  const [imgAmbient, setImgAmbient]           = useState(false);  // settles to dim after intro
  const [imgColorUnlock, setImgColorUnlock]   = useState(false);  // MOBILE ONLY: unlocks colour

  // ── DESKTOP LOGO STATE ──────────────────────────────────────────────────────
  const [logoPhase, setLogoPhase] = useState<LogoPhase>('hidden');

  // ── MOBILE LOGO STATE ───────────────────────────────────────────────────────
  // Uses CSS animations (not transitions) — more reliable on iOS Safari portals.
  // 'hidden' = opacity 0, no animation
  // 'fading-in' = mobile-logo-fade-in animation plays
  // 'fading-out' = mobile-logo-fade-out animation plays
  const [mobileLogoPhase, setMobileLogoPhase] = useState<'hidden' | 'fading-in' | 'fading-out'>('hidden');

  const scrambledSubtitle  = useBinaryScramble("SONIC INFRASTRUCTURE", isScanning);
  const scrambledAccess    = useBinaryScramble("ACCESS", isScanning);
  const scrambledHandshake = useBinaryScramble("[INIT_HANDSHAKE]", isScanning);

  useEffect(() => {
    setMounted(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    // Set pixel-based viewport center — see vCenter comment above
    setVCenter({ top: window.innerHeight / 2, left: window.innerWidth / 2 });

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, delay: number) => {
      timers.push(setTimeout(fn, delay));
    };

    if (mobile) {
      // ── MOBILE SEQUENCE ──────────────────────────────────────────────────────
      // 1. Cube fades in (greyscale)
      // 2. B logo animation: fade in slowly
      // 3. Cube hits peak colour (smooth glow); simultaneously logo fades out
      // 4. Logo gone → typing starts
      t(() => setImgVisible(true), T_MOBILE.imgEnter);
      t(() => setMobileLogoPhase('fading-in'), T_MOBILE.logoFadeIn);
      t(() => {
        setImgColorUnlock(true);                   // cube transitions to full colour
        setMobileLogoPhase('fading-out');          // logo starts fading out simultaneously
      }, T_MOBILE.colorUnlock);
      t(() => { setMobileLogoPhase('hidden'); setStep(1); }, T_MOBILE.logoDone);
      t(() => setImgAmbient(true), T_MOBILE.imgAmbient);   // cube dims BEFORE content appears
      t(() => setIsScanning(true), T_MOBILE.contentIn);

    } else {
      // ── DESKTOP SEQUENCE ─────────────────────────────────────────────────────
      // Full flicker → flare (amber) → primary (cyan) → fade-out
      t(() => setImgVisible(true), T.imgEnter);
      t(() => setLogoPhase('flash'), T.logoStart);
      t(() => { setLogoPhase('flare'); setImgDimmed(true); }, T.logoFlare);
      t(() => setLogoPhase('post-flare'), T.logoPostFlare);
      t(() => setLogoPhase('primary'), T.logoPrimary);
      t(() => setLogoPhase('fade-out'), T.logoFadeOut);
      t(() => { setLogoPhase('gone'); setStep(1); }, T.logoDone);
      t(() => setIsScanning(true), T.contentIn);
      t(() => setImgAmbient(true), T.imgAmbient);
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  // ── DERIVED IMAGE STYLES ────────────────────────────────────────────────────
  const imgOpacity = !imgVisible ? 0 : imgAmbient ? 0.4 : imgDimmed ? 0.85 : 1;
  const imgScale   = !imgVisible ? 1.15 : imgDimmed ? 1.17 : 1.2;

  // Grayscale: desktop unlocks at flare (imgDimmed); mobile unlocks at colorUnlock.
  // Desktop: imgAmbient checked FIRST so ambient = slightly grey regardless of imgDimmed.
  // Mobile: imgAmbient does NOT add grayscale — ambient only dims opacity, keeping the cube
  // fully colourful behind the content. This prevents imgAmbient (t=1650ms) from
  // interrupting the colour transition (which takes ~0.8s from colorUnlock at t=1100ms,
  // completing at t=1900ms). Without this, the cube never reaches full colour.
  const imgGrayscale = isMobile
    ? imgColorUnlock ? 0 : 0.8          // mobile: ambient doesn't grey — stays vivid
    : imgAmbient ? 0.4 : imgDimmed ? 0 : 0.8;

  const imgTransition = imgAmbient
    // Mobile ambient: faster (0.8s opacity) — content appears 650ms after ambient fires,
    // so we need the cube to dim quickly. Desktop keeps 1.5s for a more graceful settle.
    ? isMobile
      ? 'opacity 0.8s ease, filter 0.8s ease'
      : 'opacity 1.5s ease, transform 1.5s ease, filter 0.8s ease'
    : imgDimmed
    ? 'opacity 1s ease, transform 2s ease, filter 0.6s ease'
    // Mobile: 1.2s colour glow so it's definitely visible even if iOS is slightly late firing.
    // Desktop (no imgDimmed): instant (0s).
    : isMobile
    ? 'opacity 1.5s ease, transform 3s ease, filter 1.2s ease'
    : 'opacity 1.5s ease, transform 3s ease, filter 0s';

  // ── DESKTOP LOGO STYLES ─────────────────────────────────────────────────────
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
        return { opacity: 0, pointerEvents: 'none' as const };
    }
  };

  // ── FIXED ELEMENTS ──────────────────────────────────────────────────────────
  // Desktop: rendered inline in JSX — position:fixed resolves against viewport correctly.
  // Mobile: portaled to document.body — iOS Safari breaks position:fixed when any ancestor
  // has transform/filter/will-change. Portaling to body bypasses those ancestors.
  // See JSX below for the conditional rendering.

  const ambientGlowElement = (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none',
        opacity: imgVisible ? 1 : 0,
        transition: 'opacity 3s ease',
      }}
    >
      {/* Primary glow — tune /0.XX for intensity */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 100% 100% at center, hsl(var(--primary)/0.12) 0%, transparent 100%)',
      }} />
      {/* Vignette — 100% stops = open atmosphere, not a tight spotlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 100%, hsl(var(--background)) 100%)',
      }} />
    </div>
  );

  const cubeElement = imageSrc ? (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none', overflow: 'hidden',
        opacity: imgOpacity,
        // On mobile: only opacity transitions here. Grayscale is isolated to its own
        // wrapper div below so the filter transition never competes with opacity.
        transition: isMobile
          ? 'opacity 1.5s ease'
          : imgTransition,
      }}
    >
      {/* MOBILE GRAYSCALE WRAPPER — isolates filter transition from all other animated
          properties. On desktop the filter is on the img itself via imgTransition.
          Separation prevents the container's active opacity transition (still running at
          t=1100ms when colorUnlock fires) from interfering with the filter transition.
          A div filter is also more reliably transitioned than an img filter on Android. */}
      {isMobile ? (
        <div style={{
          position: 'absolute', inset: 0,
          filter: `grayscale(${imgGrayscale})`,
          // Isolated transition: only filter, nothing else.
          // 0.8s: colorUnlock(1100ms) + 800ms = full colour at 1900ms, 400ms before contentIn(2300ms).
          transition: 'filter 0.8s ease',
          willChange: 'filter',
        }}>
          <img
            src={imageSrc}
            alt=""
            loading="eager"
            decoding="async"
            style={{
              position: 'absolute',
              top: vCenter.top, left: vCenter.left,
              width: '90vw', height: '90svh',
              objectFit: 'contain',
              transform: `translate(-50%, -50%) scale(${imgScale}) translateZ(0)`,
              transition: 'transform 3s ease',
            }}
          />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt=""
          loading="eager"
          decoding="async"
          style={{
            position: 'absolute',
            top: vCenter.top, left: vCenter.left,
            width: '90vw', height: '90svh',
            objectFit: 'contain',
            transform: `translate(-50%, -50%) scale(${imgScale})`,
            filter: `grayscale(${imgGrayscale})`,
            transition: imgTransition,
          }}
        />
      )}
    </div>
  ) : null;

  // Mobile logo — uses CSS animations (not transitions) for reliable iOS Safari playback.
  // 'hidden': opacity 0, no animation.
  // 'fading-in': mobile-logo-fade-in keyframe (defined in global.css).
  // 'fading-out': mobile-logo-fade-out keyframe.
  const mobileLogoAnimation =
    mobileLogoPhase === 'fading-in'  ? `mobile-logo-fade-in ${T_MOBILE.logoFadeInDur}ms ease forwards` :
    mobileLogoPhase === 'fading-out' ? `mobile-logo-fade-out ${T_MOBILE.logoFadeOutDur}ms ease forwards` :
    'none';

  const mobileLogoElement = (
    <div
      style={{
        position: 'fixed',
        // Use pixel values from vCenter so logo is at viewport centre, not body centre.
        // Same fix as the cube img — inset:0 + flexbox centres in the body on iOS Safari.
        top: vCenter.top, left: vCenter.left,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: mobileLogoPhase === 'hidden' ? 0 : undefined,
        animation: mobileLogoAnimation,
      }}
    >
      <div
        style={{
          width: '8rem', height: '8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'hsl(var(--primary))',
          boxShadow: '0 0 50px hsl(var(--primary) / 0.7)',
        }}
      >
        <img
          src="/images/logo-b.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );

  // Desktop logo — only rendered when phase is active
  const desktopLogoElement = logoPhase !== 'hidden' && logoPhase !== 'gone' ? (
    <div
      style={{
        position: 'fixed',
        top: vCenter.top, left: vCenter.left,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '10rem', height: '10rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...logoContainerStyle(),
        }}
      >
        <img
          src="/images/logo-b.png"
          alt="bitmap.audio logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  ) : null;

  // Resolve the clicked project's slug to its Framerate IDs (desktop + mobile).
  const activeVideo = activeProject?.videoSlug ? getVideo(activeProject.videoSlug) : undefined;

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center">

      {/* FIXED ELEMENTS — all rendered inline (no createPortal).
          Portaling was tried but broke z-index layering: portaled elements become body's last
          DOM child, so even z-1 beats z-200 modals in the React tree when body doesn't form a
          stacking context. Portaling also causes unreliable filter transitions on Android Chrome.

          iOS Safari position:fixed centering fix: all outer containers use `width: 100vw;
          height: 100svh` instead of `inset: 0`. Viewport units (vw/svh) are ALWAYS relative
          to the true viewport regardless of what iOS uses as the containing block (body has
          opacity-0 during the 400ms page-in animation, temporarily making body the containing
          block). With the container always exactly viewport-sized, `top: 50%` on the img
          resolves to 50% of 100svh = screen center, never 50% of body height. */}
      {mounted && (
        <>
          {ambientGlowElement}
          {cubeElement}
          {isMobile ? mobileLogoElement : desktopLogoElement}
        </>
      )}

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
        {/* opacity-100 here — cube bleed was caused by opacity-90 wrapper making
            even bg-background buttons semi-transparent. If you want subtle bleed,
            add bg-background/XX to this wrapper instead of opacity-XX. */}
        <div className={`relative w-full md:w-[33vw] mx-auto ${isScanning ? 'opacity-100' : 'opacity-0'}`}>
          <div className="space-y-8 md:space-y-6">
            <p className="text-base md:text-xl text-foreground max-w-2xl mx-auto font-trial-dm uppercase tracking-[0.2em] min-h-[1.5em]">
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
        framerateId={activeVideo?.desktopId || ""}
        mobileFramerateId={activeVideo?.mobileId}
        theme={activeVideo?.theme}
      />
    </div>
  );
}
