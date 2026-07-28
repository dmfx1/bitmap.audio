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
import { BRAND_NAME, BRAND_MOTION } from "../config/brandMotion";

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
 * Brand lockup: the big `b` tile + the scrambling wordmark, living IN the nav
 * (top-left). The b is instantiated in the corner immediately on load.
 *
 * INTRO (first page load of a session only): a full-screen curtain hides
 * everything (page, rain, the b and the nav controls). Only the wordmark shows —
 * it starts at the FAR LEFT (site padding edge) as "bitmap.audio", scrambles to
 * the page name, then slides right to its resting slot. The INSTANT it arrives,
 * the b, the nav controls and the binary rain all appear together and the curtain
 * clears; the typewriter follows. Because the animated element IS the real nav
 * wordmark, it lands at EXACTLY the right position + size — seamless, no duplicate
 * text. On later loads it just shows the page name (no intro).
 *
 * Hovering scrambles the wordmark to the mark's DESTINATION ("home"), since it
 * links to the Home page. All timing lives in src/config/brandMotion.ts.
 */
const BrandLockup = ({ pageName }: { pageName: string }) => {
  const hasPageName = pageName !== BRAND_NAME;

  // First visit of the session plays the intro; later loads don't.
  // Append ?intro=1 to the URL to force a replay while reviewing.
  const forced =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("intro");
  const firstVisit =
    typeof window === "undefined" ? true : forced || !sessionStorage.getItem(SEEN_KEY);

  const [current, setCurrent] = useState(firstVisit ? BRAND_NAME : pageName);
  const [visible, setVisible] = useState(false);
  const [bGrown, setBGrown] = useState(!firstVisit); // b grows into place during the slide

  const lockRef = useRef<HTMLAnchorElement | null>(null);
  const wordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const rId = requestAnimationFrame(() => setVisible(true));

    if (!firstVisit) {
      signalIntroDone();
      return () => cancelAnimationFrame(rId);
    }
    sessionStorage.setItem(SEEN_KEY, "1");

    // Binary rain starts hidden; it fades in gradually AFTER the b/nav appear.
    const rain = document.querySelector<HTMLElement>(".binary-waterfall");
    if (rain) gsap.set(rain, { opacity: 0 });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Establish "bitmap.audio", then scramble to the page name mid-intro.
    let scrambleId: number | undefined;
    if (hasPageName) {
      scrambleId = window.setTimeout(() => setCurrent(pageName), BRAND_MOTION.brandHoldMs);
    }

    // On arrival: the nav appears and the binary rain begins its slow, subtle
    // fade-in (continues through the typewriter). The b has already grown into
    // place during the slide.
    const reveal = () => {
      window.dispatchEvent(new CustomEvent("brand-arrived"));
      if (rain) {
        gsap.to(rain, {
          opacity: 1,
          duration: BRAND_MOTION.rainFadeMs / 1000,
          ease: "power1.inOut",
        });
      }
    };
    const finish = () => signalIntroDone();

    const word = wordRef.current;
    const lock = lockRef.current;
    let tl: gsap.core.Timeline | undefined;

    const holdS =
      (BRAND_MOTION.brandHoldMs + BRAND_MOTION.scrambleOutMs + BRAND_MOTION.scrambleInMs) / 1000;

    if (word && lock && !reduced && word.offsetParent !== null) {
      // Start the wordmark at the FAR LEFT (the site padding edge = the lock's left,
      // where the b will sit), then slide it right to its resting slot beside the b.
      const dx = lock.getBoundingClientRect().left - word.getBoundingClientRect().left;
      gsap.set(word, { x: dx, transformOrigin: "left center" });

      tl = gsap.timeline({ onComplete: finish });
      tl.to({}, { duration: holdS }) // establish "bitmap.audio" + scramble to page name
        .call(() => setBGrown(true)) // b grows into place...
        .to(word, { x: 0, duration: BRAND_MOTION.travelMs / 1000, ease: "power3.inOut" }) // ...as the text slides right
        .call(reveal) // arrival -> nav appears + rain begins fading in
        .to({}, { duration: BRAND_MOTION.revealMs / 1000 }) // brief beat, then typewriter
        .set(word, { clearProps: "transform" });
    } else {
      // Mobile / reduced motion: no slide (wordmark hidden). Hold, then reveal.
      tl = gsap.timeline({ onComplete: finish });
      tl.to({}, { duration: reduced ? 0.4 : holdS })
        .call(() => setBGrown(true))
        .call(reveal)
        .to({}, { duration: BRAND_MOTION.revealMs / 1000 });
    }

    return () => {
      cancelAnimationFrame(rId);
      if (scrambleId) window.clearTimeout(scrambleId);
      if (tl) tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const display = useScrambleTransition(current, {
    outMs: BRAND_MOTION.scrambleOutMs,
    inMs: BRAND_MOTION.scrambleInMs,
  });

  return (
    <>
      <a
        ref={lockRef}
        href={HOME_HREF}
        aria-label="Home"
        className="group fixed left-4 md:left-8 lg:left-12 top-3 z-[60] mix-blend-difference flex items-center gap-4 select-none"
        /* ONE control for both the b tile size AND the wordmark size, so they are
           always identical in size and vertical level. Fluid via clamp() -> scales
           cleanly on any device. Tune the clamp here. */
        style={{ ['--brandH' as any]: 'clamp(3rem, 6vw, 6.5rem)' }}
        onMouseEnter={() => setCurrent(HOME_NAME)}
        onMouseLeave={() => setCurrent(pageName)}
      >
        {/* The b tile — grows into place (scale) during the slide. NO inner padding
            so it aligns flush to the site left padding. Size = --brandH. */}
        <span
          className="flex items-center justify-center shrink-0 bg-foreground hover:bg-accent border border-background shadow-sm"
          style={{
            height: 'var(--brandH)',
            width: 'var(--brandH)',
            transform: bGrown ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'left center',
            transition: `transform ${BRAND_MOTION.travelMs}ms cubic-bezier(0.65,0,0.35,1), background-color 200ms ease`,
          }}
        >
          <img src="/favicon/logo-b.png" alt="" className="w-full h-full object-contain" loading="eager" />
        </span>

        {/* Wordmark — same size (--brandH) and level as the b. Fades in on load.
            This is the element the intro flies. Hidden on mobile. */}
        <span
          ref={wordRef}
          className="hidden md:block font-mono font-light tracking-tight text-foreground whitespace-nowrap leading-none transition-opacity"
          style={{
            fontSize: 'var(--brandH)',
            opacity: visible ? 1 : 0,
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
  // wordmark arrives (BrandLockup dispatches "brand-arrived").
  const forced =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("intro");
  const firstVisit =
    typeof window === "undefined" ? true : forced || !sessionStorage.getItem(SEEN_KEY);
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
      {/* BRAND LOCKUP lives OUTSIDE the <nav> so it's NOT trapped in the nav's
          z-50 stacking context — that's what lets its mix-blend-difference invert
          against the actual page behind it (rain / sections), keeping it legible
          over anything. It's a fixed top-left element. */}
      <BrandLockup pageName={pageName} />

      <nav className="fixed top-0 left-0 right-0 z-50 pb-8">
        {/* Consistent site padding; transparent bar (no bg/border anymore). */}
        <div className="relative w-full px-4 md:px-8 lg:px-12">

          {/* Right-aligned controls row — hidden during the intro; fades in on arrival. */}
        <div
          className="relative z-50 flex items-center justify-end min-h-[5rem] md:min-h-[6rem] pt-3 transition-opacity"
          style={{
            opacity: controlsVisible ? 1 : 0,
            transitionDuration: `${BRAND_MOTION.revealMs}ms`,
            pointerEvents: controlsVisible ? undefined : "none",
          }}
        >

          {/* DESKTOP NAV — items grouped in their own bg panel (square edges, bitmap-style) */}
          <div className="hidden md:flex items-center gap-6 backdrop-blur-md border border-border/10 rounded-none px-6 py-2.5">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <a href="/home" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/home") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>Home</a>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/about-v2" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/about") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>About</a>
                </NavigationMenuItem>

                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className={cn(
                    "bg-transparent p-0 h-auto font-mono text-base uppercase tracking-wider transition-colors rounded-none",
                    "hover:bg-transparent hover:text-accent focus:bg-transparent focus:text-accent data-[state=open]:text-accent",
                    currentPath.startsWith("/solutions") ? "text-primary" : "text-muted-foreground"
                  )}>
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 bg-background/85 shadow-xl flex flex-col rounded-none">
                      {solutions.map((s) => (
                        <a
                          key={s.href}
                          href={s.href}
                          className="group block px-4 py-3 hover:bg-secondary transition-colors border-b border-border"
                        >
                          <span className="block font-mono text-base text-foreground group-hover:text-accent transition-colors">
                            {s.name}
                          </span>
                          <span className="block text-[12px] uppercase tracking-tight text-muted-foreground mt-1">
                            {s.description}
                          </span>
                          <div className="h-px w-0 bg-accent transition-all group-hover:w-full mt-2" />
                        </a>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <a href="/returns2" className={cn(
                    "font-mono text-base uppercase tracking-wider link-underline transition-colors",
                    isActive("/returns") ? "text-primary hover:text-accent" : "text-muted-foreground hover:text-accent"
                  )}>Why?</a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="outline" size="sm" asChild className="morph-accent-loop">
              <a href="/contact">Contact</a>
            </Button>
          </div>

          {/* DESKTOP HAMBURGER — opens the full overlay menu (afternow-style) */}
          <button
            aria-label="Open menu"
            className="hidden md:flex items-center justify-center h-12 w-12 ml-4 bg-background/70 backdrop-blur-md border border-border/10 rounded-none text-foreground hover:text-accent transition-colors"
            onClick={() => setIsDesktopOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

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

        {/* DESKTOP OVERLAY MENU — full-screen, expanded detail (afternow-style) */}
        {isDesktopOpen && (
          <div className="hidden md:flex fixed inset-0 z-[80] bg-background/97 backdrop-blur-2xl flex-col animate-fade-in">
            <div className="flex items-center justify-end w-full px-8 lg:px-12 pt-3">
              <button
                aria-label="Close menu"
                className="flex items-center justify-center h-12 w-12 border border-border/10 rounded-none text-foreground hover:text-accent transition-colors"
                onClick={() => setIsDesktopOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 w-full max-w-6xl mx-auto px-8 lg:px-12 flex flex-col justify-center gap-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
                {/* Primary links */}
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Home", href: "/home" },
                    { name: "About", href: "/about" },
                    { name: "Why?", href: "/returns2" },
                    { name: "FAQ", href: "/faq" },
                    { name: "Contact", href: "/contact" },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="font-mono text-5xl lg:text-6xl uppercase tracking-tight text-foreground hover:text-accent transition-colors w-fit"
                    >
                      {l.name}
                    </a>
                  ))}
                </div>

                {/* Solutions detail column */}
                <div className="flex flex-col gap-4 min-w-[18rem]">
                  <p className="font-mono text-sm tracking-[0.4em] uppercase text-accent">[ Solutions ]</p>
                  {solutions.map((s) => (
                    <a key={s.href} href={s.href} className="group block">
                      <span className="block font-mono text-xl text-foreground group-hover:text-accent transition-colors">
                        {s.name}
                      </span>
                      <span className="block text-[13px] uppercase tracking-tight text-muted-foreground mt-1">
                        {s.description}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
