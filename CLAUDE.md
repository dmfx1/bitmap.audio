# CLAUDE.md — bitmap.audio Development Context

## What This Project Is

bitmap.audio is a sonic branding agency and experiential audio service website. It is NOT a standard marketing site. It is a cinematic, scroll-driven experience designed to demonstrate neurological and psychological principles of audio through its own UX. Every animation is intentional and copy-adjacent — the UI illustrates what the copy is saying.

**Do not simplify, genericize, or "clean up" animations without explicit instruction. The complexity is the feature.**

---

## Tech Stack

- **Framework**: Astro 5 (static output, no SSR)
- **Components**: React (TSX) for interactive modules, `.astro` for layout/pages
- **Styling**: Tailwind CSS v3 + CSS custom properties (HSL variables)
- **Animation**: GSAP 3.14 + ScrollTrigger (primary engine for all scroll-driven effects)
- **UI Primitives**: Radix UI / shadcn (in `src/components/ui/`)
- **Utilities**: `cn()` via clsx + tailwind-merge (`src/lib/utils.ts`)

---

## Global Conventions

### GSAP Initialization Pattern

Always initialize like this — the double-guard handles Astro's view transitions:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function init() { /* setup animations */ }

document.addEventListener('astro:page-load', init);
if (document.readyState === 'complete') init();
else window.addEventListener('load', init);
```

### ScrollTrigger Config Standards

- `scrub: 0.5` — default for scroll-driven animations (smooth 0.5s lag)
- `scrub: true` — for 1:1 precise counter/progress animations
- `scrub: 0.1` — for parallax background layers (lighter, faster response)
- `markers: false` — always off in production
- `toggleActions: "play pause resume pause"` — for looping/vibration effects tied to section visibility

### Animation Easing Conventions

- `ease: "none"` — for anything synchronized to scroll (counters, progress rings, strip movement)
- `ease: "power1.inOut"` — soft entry/exit (SVG path drawing)
- `ease: "power2.out"` — image focus/reveal
- `ease: "power3.out"` — ghost/glow scale-down effects

### Performance Rules

**Always use GSAP for animated properties — never CSS transitions on the same properties.**
Mixing CSS transitions with GSAP scrubbing causes layout thrashing and lag, especially on `filter`, `transform`, and `opacity`.

- Use `will-change: transform` on elements that will be animated
- Use `opacity` transitions (GPU-composited) instead of `background-color` repaints
- Parallax layers: animate `y` only, never `top`/`margin`
- For blur animations: use GSAP `filter: "blur(Xpx)"` syntax, not CSS transition on `filter`

### Tailwind + CSS Variables

All theme colors are HSL CSS variables defined in `src/styles/global.css`. Reference them like this:

```html
<!-- In class strings -->
<div class="text-primary bg-accent/20 border-accent">

<!-- Drop shadows / glows -->
<h2 class="drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">

<!-- In GSAP: use raw CSS strings -->
gsap.to(el, { boxShadow: "0 0 20px hsl(var(--primary)/0.5)" })
```

Key variables: `--primary` (cyan), `--accent` (amber), `--background`, `--foreground`, `--grid-color`

### Mix-Blend-Mode Usage

- `mix-blend-screen` — for image overlays on dark backgrounds (brightens composite, creates glow)
- Used on: listening woman illustration, train image, tiger image, ROI ghost counter text
- Apply via Tailwind `mix-blend-screen` class, not inline style

### Component Architecture

- **Page-level logic** lives in `.astro` files (including `<script>` blocks with GSAP)
- **Interactive/stateful UI** lives in `.tsx` React components
- **Layout wrappers** use `Section.astro` with `reveal-on-scroll` (IntersectionObserver-based, no GSAP)
- **`Section.astro` reveal pattern is CSS-only** — do not add GSAP to standard section reveals

### Binary Scramble / Typewriter Effects

- Use the `useBinaryScramble` hook (`src/hooks/use-binary-scramble.ts`) for 0/1 randomization effects
- Characters cycle through `"01"` only, then lock in sequence
- Do not replicate this logic inline — always use the hook

### The `cn()` Utility

Always use `cn()` for conditional class merging:
```ts
import { cn } from "@/lib/utils";
cn("px-4 py-2", isActive && "bg-primary", "hover:text-accent")
```

---

## Mobile Breakpoints

- `< 768px` — mobile (defined as `window.innerWidth < 768`)
- Tailwind breakpoint: `md:` for 768px+
- **Returns.astro** completely disables GSAP on mobile (see below)
- All other pages use CSS-only IntersectionObserver reveals on mobile

---

## Page-Specific Notes

### `returns.astro` — THE SPECIAL CASE

This page has a fundamentally different architecture from every other page. Do not apply patterns from other pages here.

**What it is**: A sticky horizontal scroll experience. The page is `1600vh` tall. Vertical scroll is converted into horizontal movement of a `#horizontal-strip` containing 12 full-viewport sections side by side.

**Core HTML structure**:
```html
<div id="scroll-track" style="height: 1600vh">        <!-- Vertical scroll track -->
  <div id="sidebar-track">                            <!-- 12 fixed sidebar indicators -->
    <aside data-section="0">...</aside>               <!-- One per chapter -->
  </div>
  <div class="sticky top-0 overflow-hidden h-screen"> <!-- Viewport viewport container -->
    <div id="horizontal-strip">                       <!-- All 12 sections wide -->
      <section data-section="0">...</section>         <!-- 00 Status → 11 Execution -->
    </div>
  </div>
</div>
```

**The `scrollAt()` helper**: All animation timing is expressed as a fraction (0.0–1.0) of total scroll distance, mapped to pixel positions via this function. When adding new animations to returns.astro, always use `scrollAt(fraction)` for start/end triggers — never hardcode pixel values.

**Mobile behavior**: `isMobile = window.innerWidth < 768` — when true, ALL GSAP animations are disabled. The page falls back to vertical snap scroll (CSS scroll-snap). Do not add GSAP logic inside the mobile branch.

**Sidebar indicators**: Each sidebar `<aside>` height is computed dynamically so its vertical center aligns with the viewport center when that section's horizontal center is on screen. This is a calculated layout — do not set sidebar heights manually in CSS.

**The 12 Chapters (data-section 0–11)**:
- 00 Status — problem framing
- 01 Context — listening woman image sequence (phone→book fade)
- 02 Architecture — SVG data map path drawing
- 03 Neurology — tiger blur-to-focus
- 04 Signal — "Visuals Fade" + "Sound Echoes" vibration
- 05 Metrics — pressure line + stat card fan
- 06 Returns — ROI counter (1.0x→4.0x) with ghost halos
- 07 Credibility — success ring SVG progress (0→25%)
- 08–11 — (remaining chapters)

**Existing animation patterns in returns.astro — reuse these, don't reinvent**:

*Number counter*:
```js
const obj = { val: 0 };
gsap.to(obj, {
  val: 100,
  ease: "none",
  onUpdate: () => { el.innerText = obj.val.toFixed(1); },
  scrollTrigger: { trigger: track, start: ..., end: ..., scrub: true }
});
```

*SVG circle progress ring*:
```js
// stroke-dasharray = circumference (e.g. 282.7 for r=45 circle)
gsap.fromTo(ring, { strokeDashoffset: 282.7 }, { strokeDashoffset: 0, ease: "none", ... });
```

*SVG path drawing*:
```js
const length = path.getTotalLength();
gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
gsap.to(path, { strokeDashoffset: 0, ease: "power1.inOut", ... });
```

*Blur-to-focus*:
```js
gsap.fromTo(el, { opacity: 0, filter: "blur(30px)" }, { opacity: 0.8, filter: "blur(0px)", ... });
```

*Ghost halo text*: Use 2–3 stacked copies with increasing `blur-[Xpx]` and `mix-blend-screen`. Animate scale from ~2–3 down to 1 as the primary counter counts up.

---

### Other Pages

- `index.astro` — Splash/landing. TypewriterHero + BitmapTypewriter + ConceptGrid. CSS-driven, minimal GSAP.
- `home.astro` — Standard vertical scroll. Section.astro reveals only. No GSAP.
- `about.astro` — Standard vertical scroll. Section.astro + AboutIntro typewriter. No GSAP.
- `contact.astro` — Standard vertical scroll. Pure CSS. No GSAP.
- `solutions/*.astro` — Standard vertical scroll. Hero + Analysis + DeliverablesGrid. No GSAP.

---

## What NOT To Do

- **Do not add CSS transitions to properties that GSAP is animating** — pick one engine per property
- **Do not use `background-color` repaints for transitions** — use `opacity` on an overlay instead
- **Do not hardcode pixel values in returns.astro scroll triggers** — always use `scrollAt(fraction)`
- **Do not add GSAP to `Section.astro`** — it uses IntersectionObserver intentionally
- **Do not modify sidebar heights in returns.astro via CSS** — they are computed dynamically
- **Do not simplify the layered image sequences** (phone→book, tiger blur) — the overlap timing is intentional
- **Do not use `localStorage` for animation state** — SoundContext already handles persisted state
- **Do not add new Radix/shadcn primitives** without checking `src/components/ui/` first — most are already installed

---

## Current Active Work

- `returns.astro` — Mobile GSAP snap logic refinement (touch device snap behavior)
- `returns.astro` — Performance pass: replacing remaining CSS transitions with GSAP scrubbing to eliminate layout thrashing and drop-shadow lag on scroll

---

## File Locations

```
src/pages/          — Route pages (.astro)
src/components/     — Reusable components
  modules/          — Complex interactive React components
  ui/               — Radix/shadcn primitives (don't modify unless necessary)
src/layouts/        — Layout.astro (global shell)
src/hooks/          — Custom React hooks
src/context/        — SoundContext (global mute state)
src/lib/utils.ts    — cn() utility
src/styles/global.css — CSS variables, keyframes, base styles (1000+ lines)
public/             — Static assets
```
