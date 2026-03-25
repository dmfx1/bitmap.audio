# CLAUDE.md — bitmap.audio Development Context

## What This Project Is

bitmap.audio is a sonic branding agency and experiential audio service website. It is NOT a standard marketing site. It is a cinematic, scroll-driven experience designed to demonstrate neurological and psychological principles of audio through its own UX. Every animation is intentional and copy-adjacent — the UI illustrates what the copy is saying.

**Do not simplify, genericize, or "clean up" animations without explicit instruction. The complexity is the feature.**

---

## ⚠️ Critical Rules — Read Before Making Any Change

### Do Not Assume Stylistic Intent

Only make changes that were **explicitly requested** in the task. Do not:
- Change colours, typography, or visual style beyond what was asked
- "Improve" or "enhance" components that weren't mentioned in the task
- Restyle headings, labels, or decorative elements as a side effect of spacing fixes
- Add new visual treatments (glows, gradients, shadows) that weren't specified

Spacing and padding consistency across breakpoints is the one area where judgment is acceptable — but use the existing scale from `global.css` and Tailwind's spacing system. Do not invent new values.

### Mobile Is a First-Class Experience

This site is actively being optimised for mobile. When working on any component:
- Test mentally against `< 768px` viewport width
- Prefer fluid/responsive sizing (`clamp()`, percentages, `vw` units) over hard breakpoints where possible
- Tailwind `md:` breakpoints are the 768px boundary — use them consistently
- Text should never overflow the viewport width on mobile
- Padding on mobile should feel generous but not wasteful — content should breathe
- Touch interactions replace hover interactions on mobile — any hover-only effect needs a viewport/IntersectionObserver equivalent for mobile

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

## GridBackground Component (`src/components/GridBackground.astro`)

This is a `position: fixed; inset: 0` layer used on every page. It has four layers stacked inside it:

1. **Bitmap grid** (`.bitmap-grid`) — the dot/line grid pattern, always visible
2. **Binary waterfall** (`.binary-waterfall`) — two parallax rain layers, conditional via `showRain` prop
3. **Fog gradient** — `bg-gradient-to-b`, controlled by `--fog-strength` CSS variable
4. **Vignette mask** — radial gradient, controlled by `--vignette-strength` CSS variable

### Binary Rain Parallax

The two rain layers (`#layer-deep`, `#layer-near`) use vanilla JS scroll parallax — NOT GSAP:

```js
window.addEventListener('scroll', () => {
  window.requestAnimationFrame(() => {
    deepLayer.style.transform = `translateY(${scrollY * 0.1}px)`;
    nearLayer.style.transform = `translateY(${scrollY * 0.3}px)`;
  });
}, { passive: true });
```

**Known issue on `returns.astro`**: The page is 1600vh tall, meaning `scrollY` can reach ~25,000px. At `* 0.3`, the near layer translates ~7,500px downward — far beyond the height of the rain content itself, causing the rain to visually disappear mid-page. The fix is to loop the translateY using modulo so the layer tiles infinitely rather than running off. The correct pattern:

```js
const rainHeight = nearLayer.offsetHeight; // or a fixed tile height e.g. window.innerHeight
deepLayer.style.transform = `translateY(${(scrollY * 0.1) % rainHeight}px)`;
nearLayer.style.transform = `translateY(${(scrollY * 0.3) % rainHeight}px)`;
```

This fix should only be applied to the `returns.astro` context (or gated on page-specific logic) to avoid changing behaviour on shorter pages.

---

## Reusable Animation Patterns (CSS-based, no GSAP)

These classes exist in `global.css` and should be reused rather than reinvented:

### `animate-pulse-glow`
A 3s infinite cyan box-shadow pulse. Use on card elements to signal interactivity:
```css
/* Pulses: box-shadow 0 0 20px → 40px hsl(--primary) */
.animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
```

### `pulse-sync-active` / `emotion-heartbeat`
An accent (amber) brightness + text-shadow pulse. Used for text elements to signal energy/focus:
```css
/* Pulses: filter brightness(1) → brightness(1.5) + accent text-shadow */
.pulse-sync-active { animation: emotion-heartbeat var(--animation-speed) ease-in-out infinite; }
```

### When to trigger on mobile (IntersectionObserver pattern)
On desktop these effects are triggered by `hover`. On mobile, use IntersectionObserver to add the class when the element enters the viewport, and remove it after a short timeout:

```ts
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    el.classList.add('animate-pulse-glow');
    setTimeout(() => el.classList.remove('animate-pulse-glow'), 3000); // one cycle
  }
}, { threshold: 0.5 });
observer.observe(el);
```

Apply this pattern for: About page employee cards, any card-based content on mobile.

---

## `DeliverablesGrid.tsx` — Standard "What You'll Receive" Section

`src/components/modules/solutions/DeliverablesGrid.tsx` is the shared component used across all three solutions pages (sonic-branding, uiux-sound, immersive-audio). It must stay consistent across all three — do not create page-specific variants.

**Current behaviour**: IntersectionObserver at the container level triggers binary scramble on all cards simultaneously when the section enters viewport (0.1 threshold, 800ms delay).

**Required enhancement**: Cards should animate in with a staggered swipe-up entry (not all at once). Use per-card IntersectionObserver with index-based delay:

```ts
// Staggered entry pattern for DeliverableCard
const cardObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible'); // triggers CSS transition
    cardObserver.unobserve(entry.target);
  }
}, { threshold: 0.2 });
```

With CSS:
```css
.deliverable-card { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.deliverable-card.is-visible { opacity: 1; transform: translateY(0); }
/* Stagger via transition-delay applied inline: style={{ transitionDelay: `${index * 100}ms` }} */
```

On mobile, additionally trigger `animate-pulse-glow` briefly on each card as it enters, to draw the user's attention. Remove after one pulse cycle (~3s).

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
  <div class="sticky top-0 overflow-hidden h-screen"> <!-- Viewport container -->
    <div id="horizontal-strip">                       <!-- All 12 sections wide -->
      <section data-section="0">...</section>         <!-- 00 Status → 11 Execution -->
    </div>
  </div>
</div>
```

**The `scrollAt()` helper**: All animation timing is expressed as a fraction (0.0–1.0) of total scroll distance, mapped to pixel positions via this function. When adding new animations to returns.astro, always use `scrollAt(fraction)` for start/end triggers — never hardcode pixel values.

**Mobile behavior**: `isMobile = window.innerWidth < 768` — when true, ALL GSAP animations are disabled. The page falls back to vertical snap scroll (CSS scroll-snap). Do not add GSAP logic inside the mobile branch.

**Mobile layout requirements for each slide**:
- Text content must appear first (top), imagery second (below) — never side by side on mobile
- All text must fit within the device viewport width — no horizontal overflow
- Each slide should be self-contained: a user should be able to read a complete thought before scrolling to the next slide
- Slides snap to full viewport height (100svh) on mobile

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
- `faq.astro` — Standard vertical scroll. Sticky header tabs (desktop). No GSAP.

### Navigation (`src/components/Navigation.tsx`)

Mobile hamburger menu current behaviour (do not revert):
- Solutions dropdown is **collapsed by default** — toggled by tapping, with a rotating chevron indicator
- Mobile overlay fills **full viewport height** (`min-h-[calc(100dvh-4rem)]`)
- ROI/Returns page is linked in mobile menu as "ROI" pointing to `/returns`
- When the hamburger closes, Solutions dropdown also resets to closed (`isSolutionsOpen` resets on menu close)

### Concept Cards (`src/components/modules/ConceptGrid.tsx`)

- Card background on mobile is `bg-card/60`, on desktop `md:bg-card/90` — mobile is intentionally less opaque for legibility
- Do not increase mobile opacity back toward 90 without explicit instruction

---

## What NOT To Do

- **Do not assume stylistic changes** — only change what was explicitly asked for
- **Do not add CSS transitions to properties that GSAP is animating** — pick one engine per property
- **Do not use `background-color` repaints for transitions** — use `opacity` on an overlay instead
- **Do not hardcode pixel values in returns.astro scroll triggers** — always use `scrollAt(fraction)`
- **Do not add GSAP to `Section.astro`** — it uses IntersectionObserver intentionally
- **Do not modify sidebar heights in returns.astro via CSS** — they are computed dynamically
- **Do not simplify the layered image sequences** (phone→book, tiger blur) — the overlap timing is intentional
- **Do not use `localStorage` for animation state** — SoundContext already handles persisted state
- **Do not add new Radix/shadcn primitives** without checking `src/components/ui/` first — most are already installed
- **Do not create page-specific variants of `DeliverablesGrid`** — it is a shared component, modify once

---

## Current Active Work

- `returns.astro` — Mobile snap logic (each slide should behave like an Instagram reel: snap-to-full-viewport, text-first layout, no horizontal overflow)
- `returns.astro` — Performance pass: replacing remaining CSS transitions with GSAP scrubbing; lag on scroll is a known live issue
- `GridBackground.astro` — Binary rain loop fix for returns.astro (rain disappears mid-page due to translateY overflow on 1600vh track)
- `DeliverablesGrid.tsx` — Staggered card swipe-in animation + mobile viewport-triggered pulse-glow
- Global — Padding and spacing consistency pass across all pages for mobile

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
