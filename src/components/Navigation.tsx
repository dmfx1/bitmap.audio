import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useScrambleTransition } from "../hooks/use-scramble-transition";
import { BRAND_NAME, BRAND_MOTION, scrambleInMsFor } from "../config/brandMotion";

const solutions = [
  { name: "Sonic Branding", href: "/solutions/sonic-branding", description: "Brand identity through sound" },
  { name: "UI/UX Sound", href: "/solutions/uiux-sound", description: "Sonic interfaces for technology" },
  { name: "Experiential Audio", href: "/solutions/experiential-audio", description: "Immersive spatial installations" },
];

const SEEN_KEY = "bitmap_intro_seen";
// The brand mark links to the Home PAGE (/home) — NOT the landing page (/).
const HOME_HREF = "/home";
const HOME_NAME = "home";

function signalIntroDone() {
  if (typeof window === "undefined") return;
  (window as any).__bitmapIntroDone = true;
  window.dispatchEvent(new CustomEvent("intro-complete"));
}

/**
 * Brand lockup: the persistent `b` mark + scrambling page-name wordmark, living IN
 * the nav (top-left) as the FINAL resting state, plus the Phase-1 entry intro.
 *
 * INTRO (every load while we tune it — see brandMotion + MOTION-PLAN §3):
 *   1. A centred stage shows the `b` on the LEFT and `bitmap.audio` on the RIGHT
 *      (full-width, aligned to the page gutters). bitmap.audio scrambles IN.
 *   2. Hold, then the WHOLE stage LIFTS upward to the top bar as one unit — the b
 *      travels to top-left, bitmap.audio to top-right (reads as the page moving up).
 *   3. On arrival the real nav `b` glitch-grows in (`animate-bitmap-in`) and the
 *      centre b hands off to it; the binary rain begins.
 *   4. The top-right `bitmap.audio` CRT-powers-off — squeezes vertically to a bright
 *      line, then snaps to nothing (on-brand glitch). The nav controls fade into the
 *      vacated top-right, and the page-name scrambles IN beside the b (top-left).
 *   5. intro-complete fires → the hero starts.
 *
 * Hovering scrambles the resting wordmark to the mark's DESTINATION ("home"), since
 * it links to the Home page. All timing lives in src/config/brandMotion.ts.
 */
const BrandLockup = ({ pageName }: { pageName: string }) => {
  // Intro plays on EVERY page load (each nav click is a full reload). To go back
  // to once-per-session, restore: typeof window === 'undefined' ? true : !sessionStorage.getItem(SEEN_KEY)
  const firstVisit = true;

  // Resting nav wordmark: starts EMPTY on first visit, scrambles to the page name at
  // the end of the intro; on later loads it just shows the page name.
  const [current, setCurrent] = useState(firstVisit ? "" : pageName);
  const [bGrown, setBGrown] = useState(!firstVisit);            // nav b grows/flickers in
  const [wordVisible, setWordVisible] = useState(!firstVisit);  // nav wordmark opacity

  // Centre intro stage.
  const [centerVisible, setCenterVisible] = useState(false);    // stage opacity
  const [centerBHidden, setCenterBHidden] = useState(false);    // centre b fades at handoff
  const [centerTarget, setCenterTarget] = useState("");         // scrambles IN to bitmap.audio
  const stageRef = useRef<HTMLDivElement | null>(null);         // the lifted container
  const wordRef = useRef<HTMLSpanElement | null>(null);         // bitmap.audio (CRT target)

  // bitmap.audio scrambles IN at the centre (empty -> BRAND_NAME).
  const centerDisplay = useScrambleTransition(centerTarget, {
    outMs: 0,
    inMs: BRAND_MOTION.scrambleInMs,
    flickerMs: BRAND_MOTION.flickerMs,
  });

  useEffect(() => {
    if (!firstVisit) {
      signalIntroDone();
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");

    // Binary rain starts hidden; it fades in gradually once the top brand assembles.
    const rain = document.querySelector<HTMLElement>(".binary-waterfall");
    if (rain) gsap.set(rain, { opacity: 0 });
    const startRain = () => {
      if (rain) gsap.to(rain, { opacity: 1, duration: BRAND_MOTION.rainFadeMs / 1000, ease: "power1.inOut" });
    };
    const revealControls = () => window.dispatchEvent(new CustomEvent("brand-arrived"));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBGrown(true);
      setWordVisible(true);
      setCurrent(pageName);
      startRain();
      revealControls();
      signalIntroDone();
      return;
    }

    const { introHoldMs, liftMs, crtMs, scrambleInMs, fadeInMs } = BRAND_MOTION;

    // Stage begins centred (top:50%, -50% Y) and hidden; scramble bitmap.audio IN.
    if (stageRef.current) gsap.set(stageRef.current, { top: "50%", yPercent: -50 });
    const raf = requestAnimationFrame(() => {
      setCenterVisible(true);
      setCenterTarget(BRAND_NAME);
    });

    const tl = gsap.timeline({ delay: fadeInMs / 1000 });

    // 1/2. Hold on bitmap.audio at centre.
    tl.to({}, { duration: introHoldMs / 1000 });

    // 2. LIFT the whole stage to the top bar (b → top-left, wordmark → top-right).
    tl.to(stageRef.current, { top: "2rem", yPercent: 0, duration: liftMs / 1000, ease: "power3.inOut" });

    // 3. Arrive: nav b glitch-grows in, centre b hands off (fades), rain begins.
    tl.add(() => {
      setBGrown(true);
      setCenterBHidden(true);
      startRain();
    });

    // 4. CRT power-off the bitmap.audio wordmark: squeeze to a bright line at the
    //    wordmark's vertical centre (where the nav sits), then snap.
    tl.to(wordRef.current, {
      scaleY: 0.03,
      filter: "brightness(2.4)",
      transformOrigin: "center center",
      duration: (crtMs * 0.55) / 1000,
      ease: "power2.in",
    }, ">")
      .to(wordRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: (crtMs * 0.45) / 1000,
        ease: "power2.in",
      }, ">");

    // 4b. Nav controls fade into the vacated top-right; page name scrambles in by the b.
    tl.add(() => {
      revealControls();
      setCenterVisible(false);
      setWordVisible(true);
      setCurrent(pageName);
    });

    // 5. Done → hero, once the page-name scramble resolves.
    tl.add(() => signalIntroDone(), `+=${(scrambleInMs + 150) / 1000}`);

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = useScrambleTransition(current, {
    outMs: BRAND_MOTION.scrambleOutMs,
    // Adaptive: shorter page titles resolve a little slower so they don't flash by.
    // (Scrambling IN from empty auto-skips the OUT phase — see use-scramble-transition.)
    inMs: scrambleInMsFor((current || pageName).length),
    flickerMs: BRAND_MOTION.flickerMs,
  });

  return (
    <>
      {/* CENTRE intro STAGE — b on the LEFT, bitmap.audio on the RIGHT, full-width and
          gutter-aligned. Lifts to the top bar as one unit (GSAP on stageRef), then the
          b hands off to the nav b and bitmap.audio CRT-powers-off. Sits over the live
          page (no opaque curtain, so the vignette/rain shows through). */}
      {firstVisit && (
        <div
          ref={stageRef}
          aria-hidden="true"
          className="fixed inset-x-0 z-[70] pointer-events-none transition-opacity duration-300"
          /* NOTE: `top` is owned entirely by GSAP (set to 50% then animated to 2rem),
             so it is NOT set here — a React inline `top` would be re-applied on every
             re-render and clobber GSAP's docked position, snapping the b back to centre. */
          style={{
            opacity: centerVisible ? 1 : 0,
            ['--brandH' as any]: 'clamp(3rem, 6vw, 6.5rem)',
          }}
        >
          <div className="container-page flex items-center justify-between gap-6">
            {/* b — LEFT. Glitch-assembles in (bitmapIn) at the SAME moment bitmap.audio
                scrambles in, so the b only does its stepped reveal ONCE (here) — it then
                stays full-size through the lift + dock (no second glitch at the top). */}
            <img
              src="/images/brand/logo-b.svg"
              alt=""
              className={`object-contain shrink-0 ${
                centerVisible && !centerBHidden ? 'animate-bitmap-in' : ''
              }`}
              style={{
                height: 'var(--brandH)',
                width: 'var(--brandH)',
                opacity: centerBHidden ? 0 : 1,
                ['--bitmap-in-dur' as any]: `${BRAND_MOTION.scrambleInMs}ms`,
              }}
            />
            {/* bitmap.audio — RIGHT (desktop only; mobile header has no wordmark). */}
            <span
              ref={wordRef}
              /* leading-none matches the nav wordmark so this span's line-box == the b's
                 height; otherwise its taller line-box inflates the flex row and items-center
                 pushes the b down ~26px, so the centre b wouldn't land on the nav b. */
              className="hidden md:inline-block font-mono font-light tracking-tight leading-none text-foreground whitespace-nowrap will-change-transform"
              style={{ fontSize: 'clamp(2rem, 6vw, 6.5rem)' }}
            >
              {centerDisplay || BRAND_NAME}
              <span className="text-accent opacity-70">_</span>
            </span>
          </div>
        </div>
      )}

      <a
        href={HOME_HREF}
        aria-label="Home"
        className="group fixed top-8 z-[60] flex items-center gap-8 select-none"
        /* --brandH: one control for both b + wordmark size. left: aligned to the
           .container-page content edge. transform: the scroll "squash" (--nav-scale). */
        style={{
          ['--brandH' as any]: 'clamp(3rem, 6vw, 6.5rem)',
          left: 'var(--page-gutter)',
          /* Brand squishes MORE than the nav (--brand-scale, its own knob). top-left origin:
             it shrinks toward the top-left corner, keeping the SAME distance from the top and
             left as at full size (rather than shrinking down toward the bottom-left). */
          transform: 'scale(var(--brand-scale, 1))',
          transformOrigin: 'top left',
          /* No transform transition: the squish is scroll-linked and Lenis already
             smooths scroll — a transition here would lag the squish behind the scroll. */
        }}
        onMouseEnter={() => setCurrent(HOME_NAME)}
        onMouseLeave={() => setCurrent(pageName)}
      >
        {/* The b mark (SVG, white b + amber underline). The glitchy bitmapIn reveal now
            happens ONCE on the centre b at the start; here the resting b simply CROSS-FADES
            in as the lifted centre b hands off (same size + position → seamless, no second
            glitch). Default SVG normally, invert SVG on hover. */}
        <span
          className="relative flex items-center justify-center shrink-0"
          /* No opacity transition: the resting b swaps in INSTANTLY (single frame) as the
             lifted centre b hides at the exact same spot — no crossfade dip, so the b just
             appears to already be where it belongs. */
          style={{
            height: 'var(--brandH)',
            width: 'var(--brandH)',
            transformOrigin: 'left center',
            opacity: firstVisit && !bGrown ? 0 : 1,
          }}
        >
          <img
            src="/images/brand/logo-b.svg"
            alt=""
            className="w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-0"
            loading="eager"
          />
          <img
            src="/images/brand/logo-b-invert.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            loading="eager"
          />
        </span>

        {/* Wordmark (page title) — scrambles IN beside the b at the end of the intro.
            Same size (--brandH) + level as the b. Hidden on mobile. */}
        <span
          className="hidden md:block font-mono font-light tracking-tight text-foreground whitespace-nowrap leading-none transition-opacity"
          style={{
            fontSize: 'var(--brandH)',
            opacity: wordVisible ? 1 : 0,
            transitionDuration: `${BRAND_MOTION.fadeInMs}ms`,
          }}
        >
          {display}
          <span className="text-accent opacity-70">_</span>
        </span>
      </a>
    </>
  );
};

const Navigation = ({ currentPath, pageName = BRAND_NAME }: { currentPath: string; pageName?: string }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const isActive = (path: string) => currentPath === path;

  // The nav controls are hidden during the intro and appear the instant the brand
  // wordmark arrives (BrandLockup dispatches "brand-arrived"). Intro plays every load.
  const firstVisit = true;
  const [controlsVisible, setControlsVisible] = useState(!firstVisit);
  useEffect(() => {
    if (!firstVisit) return;
    const onArrived = () => setControlsVisible(true);
    window.addEventListener("brand-arrived", onArrived, { once: true });
    const fallback = window.setTimeout(() => setControlsVisible(true), 6000);
    return () => {
      window.removeEventListener("brand-arrived", onArrived);
      window.clearTimeout(fallback);
    };
  }, [firstVisit]);

  return (
    <>
      {/* BRAND LOCKUP is a fixed top-left element rendered OUTSIDE the <nav> so the
          oversized b can overhang below the bar and be positioned independently. */}
      <BrandLockup pageName={pageName} />

      <nav className="fixed top-8 left-0 right-0 z-50">
        {/* Nav content uses the same .container-page as sections, so the controls
            align with page content (incl. centring on ultra-wide). Top edge = top-8
            (p-8) to match the brand + the page gutter. */}
        <div className="relative container-page">

          {/* Right-aligned controls row — hidden during the intro; fades in on arrival.
              Also squashes with the brand on scroll (scale via --nav-scale). */}
        <div
          className="relative z-50 flex items-end justify-end"
          /* items-end + min-height --brandH: bottom-align the controls box with the
             BOTTOM of the page-title lettering (same --brandH as the brand), so the
             nav reads as emerging from the CRT line where bitmap.audio powers off. */
          style={{
            minHeight: 'var(--brandH)',
            opacity: controlsVisible ? 1 : 0,
            /* Nav squishes LESS than the brand (--nav-scale), from its top-right corner (right
               distance preserved). --nav-lift raises it as it shrinks so its TOP meets the title
               TOP (the gutter line) when fully squished, while staying bottom-aligned at full. */
            transform: 'translateY(var(--nav-lift, 0px)) scale(var(--nav-scale, 1))',
            transformOrigin: 'top right',
            /* Only the intro opacity fade transitions; the squish transform is scroll-linked
               (no transition) so it tracks the scroll tightly instead of lagging. */
            transition: `opacity ${BRAND_MOTION.revealMs}ms ease`,
            pointerEvents: controlsVisible ? undefined : "none",
          }}
        >

          {/* DESKTOP NAV — items grouped in their own bg panel (square edges, bitmap-style) */}
          <div className="hidden md:flex items-center gap-6 backdrop-blur-md border border-border/10 rounded-none p-4">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">

                <NavigationMenuItem>
                  <a href="/about-v2?intro=1" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-accent underline underline-offset-8 decoration-accent" : "text-muted-foreground hover:text-accent"
                  )}>About</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/solutions/sonic-branding?intro=1" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-accent underline underline-offset-8 decoration-accent" : "text-muted-foreground hover:text-accent"
                  )}>Branding</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/solutions/uiux-sound?intro=1" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-accent underline underline-offset-8 decoration-accent" : "text-muted-foreground hover:text-accent"
                  )}>UI/UX</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/solutions/experiential-audio?intro=1" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-accent underline underline-offset-8 decoration-accent" : "text-muted-foreground hover:text-accent"
                  )}>Experience</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/returns2" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/returns") ? "text-accent underline underline-offset-8 decoration-accent" : "text-muted-foreground hover:text-accent"
                  )}>Why?</a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="outline" size="sm" asChild className="morph-accent-loop">
              <a href="/contact">Contact</a>
            </Button>
          </div>

          

          {/* MOBILE TOGGLE — sits in its own tile so it reads on the transparent bar */}
          <button
            className="md:hidden flex items-center justify-center h-12 w-12 bg-background/70 backdrop-blur-md border border-border/10 rounded-none text-foreground"
            onClick={() => {
              const next = !isMobileOpen;
              setIsMobileOpen(next);
              if (!next) setIsSolutionsOpen(false);
            }}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        

        {/* MOBILE MENU */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-border animate-fade-in min-h-[calc(100dvh-4rem)] pb-8 bg-background/95 backdrop-blur-md -mx-4 px-4">
            <div className="flex flex-col gap-1 pt-6 pb-24">
              <a href="/home" className="font-mono text-base uppercase tracking-wider text-muted-foreground hover:text-primary active:opacity-60 min-h-[44px] flex items-center">Home</a>
              <a href="/about" className="font-mono text-base uppercase tracking-wider text-muted-foreground hover:text-primary active:opacity-60 min-h-[44px] flex items-center">About</a>
              <a href="/returns2" className="font-mono text-base uppercase tracking-wider text-muted-foreground hover:text-primary active:opacity-60 min-h-[44px] flex items-center">Why?</a>
              <div className="pt-2 pb-2 border-t border-b border-border">
                <button
                  className="w-full flex items-center justify-between font-mono text-base uppercase tracking-wider text-accent min-h-[44px]"
                  onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                >
                  Solutions
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isSolutionsOpen && "rotate-180")} />
                </button>
                {isSolutionsOpen && (
                  <div className="mt-1 flex flex-col gap-1 pl-4">
                    {solutions.map((s) => (
                      <a key={s.href} href={s.href} className="font-mono text-base text-foreground hover:text-primary active:opacity-60 min-h-[44px] flex items-center">{s.name}</a>
                    ))}
                  </div>
                )}
              </div>
              <a href="/faq" className="font-mono text-base uppercase tracking-wider text-muted-foreground hover:text-primary active:opacity-60 min-h-[44px] flex items-center">FAQ</a>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border/20 z-50">
              <a
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center justify-center w-full min-h-[52px]",
                  "font-mono text-sm uppercase tracking-widest font-bold",
                  "bg-accent text-background",
                  "shadow-[0_0_24px_hsl(var(--accent)/0.6)]",
                  "transition-all duration-300",
                  "hover:shadow-[0_0_40px_hsl(var(--accent)/0.9)] hover:brightness-110",
                  "active:brightness-90"
                )}
              >
                Start A Project
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navigation;
