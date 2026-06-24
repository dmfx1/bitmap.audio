# CLAUDE.md — bitmap.audio Development Context

## What This Project Is

bitmap.audio is a sonic branding agency and experiential audio service website. It is NOT a standard marketing site. It is a cinematic, scroll-driven experience designed to demonstrate neurological and psychological principles of audio through its own UX. Every animation is intentional and copy-adjacent — the UI illustrates what the copy is saying.

**Do not simplify, genericize, or "clean up" animations without explicit instruction. The complexity is the feature.**

---

## ⚠️ Critical Rules — Read Before Making Any Change

### Hero Image Conventions (Hero.tsx, AboutIntro.tsx, UIUXHero.tsx, SonicHero.tsx, ImmersiveHero.tsx)

All hero images across the site follow these non-negotiable rules. Do not deviate without explicit instruction.

**No opacity reduction, no grayscale, no mix-blend-mode on hero images.** Images are full colour and full brightness. The left-edge fade is handled exclusively by CSS `maskImage` on the container.

**Left-edge fade pattern — always use CSS mask, never a gradient overlay div:**
```tsx
<div
  className="absolute inset-y-0 right-0 w-full md:w-[58%] pointer-events-none z-0"
  style={{
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
    maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
  }}
>
  <img className="w-full h-full object-cover object-center" ... />
  {/* Bottom fade — dissolves the image into background before the hard bottom edge */}
  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
</div>
```

**Bottom-edge rule — the hard bottom clip of the image must never be visible:**
- Add a gradient overlay div (`bg-gradient-to-t from-background to-transparent`) covering the bottom third of the image container. This fades the image into the background colour before it clips.
- Do NOT use `height: 115%` or `overflow-x-hidden` on the root — those change page layout and scroll behaviour. The fade overlay achieves the same visual result without touching layout.
- Root component div keeps `overflow-hidden` (not `overflow-x-hidden`).
- Image uses `object-cover object-center` — do not change this to `object-top`.

**Horizontal flip:** `style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}` on the `<img>` only, never on the container. The mask stays fixed on the left edge regardless of flip.

**JSX comment placement rule — critical:** Never place a `{/* comment */}` immediately before the root JSX element inside `return ()`. A JSX comment counts as a JSX expression — two expressions at the top level of a `return` is a parse error (`Expected ")" but found "className"`). Place comments INSIDE the root element as the first child instead:
```tsx
// WRONG — parse error:
return (
  {/* my comment */}
  <div className="...">

// CORRECT:
return (
  <div className="...">
    {/* my comment */}
```

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

The modulo fix has been applied globally (no page gate needed) using tile-aligned values: `% 400` for deep layer, `% 800` for near layer — these match the CSS `background-size` heights exactly, making the loop seamless on any screen size.

**Binary rain on returns/returns2**: The rain is now **disabled on both `/returns` and `/returns2`** via `Layout.astro`: `showRain={!isLandingPage && !isReturnsPage}`. Both pages are full-width layouts — there are no exposed GridBackground edges where rain would be visible. The `isReturnsPage` check in `Layout.astro` covers both paths. Do not re-enable rain on these pages.

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

- `returns2.astro` — CSS Grid layout rebuild complete (Section E done). Awaiting visual review from dom before merging to `returns.astro`. See Section E below for full spec.
- `returns2.astro` — GSAP animations are identical to `returns.astro` and calibrated to the 1600vh horizontal scroll track — do not recalibrate unless specifically asked
- `returns.astro` — Mobile snap logic (each slide should behave like an Instagram reel: snap-to-full-viewport, text-first layout, no horizontal overflow)
- `returns.astro` — Performance pass: replacing remaining CSS transitions with GSAP scrubbing; lag on scroll is a known live issue
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

---

## Mobile Optimisation Brief

> Work through each section in order. Touch layout files before page-level files. Verify at 375px, 390px, and 430px after each change.

---

### 1. Fix padding — two specific files, nothing else

**The problem:** `px-4 py-8 md:px-8 lg:px-16` was added to the outer page wrapper in `Layout.astro`. This is the wrong location — it pushes the entire page content away from the viewport edges, making the background grid visible as coloured borders around all content. Content padding belongs inside `Section.astro`, not the outer wrapper.

#### Fix A — `src/layouts/Layout.astro`

Find this element (the non-full-bleed wrapper, approximately line 34):
```html
<div class="w-full max-w-[1400px] bg-background/95 min-h-svh shadow-2xl relative z-10 px-4 py-8 md:px-8 lg:px-16">
```
Remove only the padding classes. The result must be:
```html
<div class="w-full max-w-[1400px] bg-background/95 min-h-svh shadow-2xl relative z-10">
```
Do not change any other classes on this element.

#### Fix B — `src/components/Section.astro`

Find the inner content div (approximately line 30):
```html
<div class:list={[
  "w-full px-6 md:px-12 relative z-10",
  !isFullWidth && "max-w-7xl"
]}>
```
Change `px-6 md:px-12` to `px-4 md:px-8 lg:px-12`:
```html
<div class:list={[
  "w-full px-4 md:px-8 lg:px-12 relative z-10",
  !isFullWidth && "max-w-7xl"
]}>
```
This is now the single source of horizontal content padding on mobile. Do not add padding anywhere else.

---

### 2. Nav not sticking on mobile — investigation + fix

**The nav already has `fixed top-0 left-0 right-0 z-50` in `Navigation.tsx`. If it still isn't sticking on mobile, the root cause is a CSS stacking context problem, not a missing class.**

`position: fixed` silently breaks when any ancestor element has `transform`, `filter`, `will-change: transform`, or `backdrop-filter` applied — that ancestor becomes the containing block instead of the viewport.

**Steps:**

1. Open `src/components/Navigation.tsx` and confirm the outermost `<nav>` element has:
   ```
   className="fixed top-0 left-0 right-0 z-50 bg-background ..."
   ```
   It should already be there. If it says `sticky` instead of `fixed`, change it to `fixed`.

2. Check the `<body>` tag in `src/layouts/Layout.astro` — it has `opacity-0 animate-page-in`. Open `src/styles/global.css` and find the `@keyframes` for `animate-page-in`. If those keyframes include `transform: translateY(...)` or similar, the body animation is breaking fixed positioning during the page load animation. The fix is to animate only `opacity`, not `transform`:
   ```css
   @keyframes pageIn {
     from { opacity: 0; }
     to   { opacity: 1; }
   }
   ```

3. Check `src/context/SoundContext.tsx` and any wrapper components rendered in `Layout.astro` — if any render a `<div>` with `transform`, `filter`, or `will-change`, that breaks fixed children. Remove those properties or restructure so the `<Navigation>` component renders outside any transformed wrapper.

4. As a definitive test: temporarily add `style="position:fixed;top:0;left:0;right:0;z-index:999;background:red"` inline to the nav in the browser DevTools. If it sticks with that inline style but not with the Tailwind class, the issue is class specificity or a CSS reset overriding it.

5. Ensure the `<main>` content below the nav has `padding-top` equal to the nav height (64px / `pt-16`) so content doesn't start behind the fixed nav.

---

### 3. Sticky scroll-over on mobile — full viewport hero

**Goal:** Reinstate the sticky scroll-over pattern on mobile, matching the desktop experience. The hero fills the full visible viewport (`100svh`) and the content sections scroll up over it. This works now that hero components have been properly sized and the founders module extracted from AboutIntro.

**Why `svh` not `vh`:** Use `h-svh` (small viewport height = `100svh`) not `h-screen` (`100vh`). On Brave and Safari, `100vh` includes the browser chrome (address bar) which causes the hero to be taller than the visible area and clips content. `100svh` always equals exactly the visible viewport.

Apply to these six files:
- `src/pages/home.astro`
- `src/pages/about.astro`
- `src/pages/solutions/sonic-branding.astro`
- `src/pages/solutions/uiux-sound.astro`
- `src/pages/solutions/immersive-audio.astro`
- `src/pages/contact.astro`

In each file, set the sticky hero wrapper so mobile gets `h-svh` and desktop keeps its defined partial height (`85vh` for home/about, `66vh` for solutions/contact):

**`src/pages/home.astro` and `src/pages/about.astro`:**
```html
<div class="sticky top-0 z-[1] h-svh md:h-[85vh]">
  <div class="h-full pt-16 pb-8">
```

**`src/pages/solutions/*.astro` and `src/pages/contact.astro`:**
```html
<div class="sticky top-0 z-[1] h-svh md:h-[66vh]">
  <div class="h-full pt-16 pb-8">
```

The scroll-over content wrapper should have no `md:` prefix — it works the same on both mobile and desktop:
```html
<div class="relative z-10 bg-background">
```

**Do not apply this to `returns.astro`** — that page has its own separate scroll architecture.

**After implementing, test on iPhone SE (375px) first** — it's the tightest viewport. If any hero content is clipped at 375px, increase the inner wrapper `pb-8` or reduce internal component padding rather than changing the `h-svh` value.

#### 3a — About page: text too close to top on mobile

**Why home works but about doesn't:** `Hero.tsx` (home) has an inner `py-8` wrapper that adds 32px of breathing room below the nav clearance. `AboutIntro.tsx` has `py-0` on its root — so on mobile the only top spacing is the `pt-16` nav clearance from the sticky wrapper, and content starts immediately after. It feels cramped.

**The fix:** In `src/pages/about.astro`, use `pt-20` instead of `pt-16` on the inner wrapper:
```html
<div class="h-full pt-20 pb-8">
```
`pt-20` = 80px, giving 16px of visual breathing room above the hero text after the nav.

#### 3b — Solutions pages: "BACK TO HOME" pushes content too far down on mobile

#### 3a — About page: text too close to top on mobile

**Why home works but about doesn't:** `Hero.tsx` (home) has an inner `py-8` wrapper that adds 32px of breathing room below the nav clearance. `AboutIntro.tsx` has `py-0` on its root — so on mobile the only top spacing is the `pt-16` nav clearance from the sticky wrapper, and content starts immediately after. It feels cramped.

**The fix:** In `src/pages/about.astro`, change the inner sticky wrapper from:
```html
<div class="pt-16 pb-12 md:h-full md:pb-24">
```
to:
```html
<div class="pt-20 pb-12 md:h-full md:pb-24">
```
`pt-20` = 80px, giving 16px of visual breathing room above the hero text after the nav. Do not touch `AboutIntro.tsx` itself.

#### 3b — Solutions pages: "BACK TO HOME" pushes content too far down on mobile

**The problem:** In `SonicHero.tsx`, `UIUXHero.tsx`, and `ImmersiveHero.tsx`, the "BACK TO HOME" back-link has `mb-12` (48px) below it. Combined with the hero root's `py-24` on mobile, the headline ends up far below the fold.

After section 9 removes the hero root's mobile `py-24`, the `mb-12` on the back-link is the remaining offender.

**The fix:** In each of the three solution hero files, find the back-link:
```tsx
<a href="/home" className="group inline-flex items-center text-xs font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-12">
```
Change `mb-12` to `mb-4 md:mb-12`:
```tsx
<a href="/home" className="group inline-flex items-center text-xs font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12">
```
This tightens the gap on mobile while preserving the desktop spacing exactly.

Apply to:
- `src/components/modules/solutions/SonicHero.tsx`
- `src/components/modules/solutions/UIUXHero.tsx`
- `src/components/modules/solutions/ImmersiveHero.tsx`

---

### 4. Hero content sitting at device edge — fix all hero components

**The problem:** Every hero component except `Hero.tsx` (home page) uses `pl-0 md:pl-12` on its inner text wrapper. On mobile `pl-0` means zero left padding — content sits flush against the device edge.

**The fix:** Change `pl-0` to `pl-4` in all five files:

- `src/components/modules/AboutIntro.tsx` — line ~56
- `src/components/modules/ContactHero.tsx` — line ~86
- `src/components/modules/solutions/SonicHero.tsx` — line ~83
- `src/components/modules/solutions/UIUXHero.tsx` — line ~86
- `src/components/modules/solutions/ImmersiveHero.tsx` — line ~86

In each, find:
```tsx
<div className="w-full md:max-w-4xl pl-0 md:pl-12 relative z-10 ...">
```
Change `pl-0` to `pl-4`:
```tsx
<div className="w-full md:max-w-4xl pl-4 md:pl-12 relative z-10 ...">
```
Do not change any other classes on these elements.

---

### 5. Home page CTA buttons — equal width on mobile

**The problem:** In `src/components/modules/Hero.tsx`, the two CTA buttons ("OUR STORY" and "START A PROJECT") have content-driven widths. "START A PROJECT" is wider because it has more words, making the pair look unbalanced on mobile.

**The fix:** Make the button container full-width and give each button equal flex share.

Find the button wrapper in `Hero.tsx`:
```tsx
<div className="flex items-center gap-6">
  <a href="/about">
    <Button variant="default" size="xl" className="rounded-none px-4 py-2 text-xs md:px-8 md:text-base">
      OUR STORY
    </Button>
  </a>
  <Button variant="outline" size="xl" className="morph-accent rounded-none px-4 py-2 text-xs md:px-8 md:text-base">
    <a href="/contact">Start A Project</a>
  </Button>
</div>
```
Replace with:
```tsx
<div className="flex items-stretch gap-4 w-full max-w-sm">
  <a href="/about" className="flex-1">
    <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-base">
      OUR STORY
    </Button>
  </a>
  <a href="/contact" className="flex-1">
    <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-base">
      START A PROJECT
    </Button>
  </a>
</div>
```
Note: the second button's `<a>` was previously nested inside the button — move it outside so both buttons have consistent structure (link wraps button, not button wraps link).

---

### 6. Section reveal gaps on mobile — pre-trigger IntersectionObserver

**The problem:** Sections below the hero use `reveal-on-scroll opacity-0 translate-y-6` and are invisible until the IntersectionObserver fires. On mobile, the observer fires late — the user sees a gap of visible hero background before the next section appears, creating a flicker or jarring jump.

**The fix:** In `src/components/Section.astro`, add a `rootMargin` to the IntersectionObserver so sections begin revealing before they fully enter the viewport:

Find the observer (approximately line 66):
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target as HTMLElement;
      target.style.opacity = "1";
      target.style.transform = "translateY(0)";
      observer.unobserve(target);
    }
  });
}, { threshold: 0.05 });
```
Change to:
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target as HTMLElement;
      target.style.opacity = "1";
      target.style.transform = "translateY(0)";
      target.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      observer.unobserve(target);
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px 150px 0px" });
```
The `rootMargin: "0px 0px 150px 0px"` makes the observer fire when a section is still 150px below the visible viewport — sections will be mid-transition by the time the user scrolls to them, eliminating the gap/flash.

---

### 7. Body / paragraph font size increase on mobile

**Goal:** All body-level text needs to be at minimum 16px on mobile. The canonical example is the `<p>` under **Solutions → Sonic Branding** beginning "Your audience encounters thousands…"

1. Open `src/styles/global.css` and find the `@layer base` block.
2. Ensure paragraph text is at least `text-base` (16px):
   ```css
   @layer base {
     p, li, td, label {
       @apply text-base;
     }
   }
   ```
3. Audit `src/pages/solutions/*.astro`, `src/pages/home.astro`, `src/pages/about.astro`, `src/pages/contact.astro` — replace any `text-sm` or `text-xs` on body/description copy with `text-base`. Do **not** change headline sizes.

---

---

### 8. FAQ page — hero spacing, index sidebar, and font sizes

All three issues are in `src/pages/faq.astro` and `src/components/modules/FAQContent.tsx`.

#### 8a — Hero section spacing

**The problem:** The FAQ hero uses `py-52` (208px top + bottom padding) which is fine on desktop but creates a massive empty gap on mobile. It also uses `flex items-end` which pushes the text to the bottom of that tall space.

In `src/pages/faq.astro`, find:
```html
<Section id="faq-hero" delay="0.1s" className="py-52 min-h-[40vh] flex items-end">
```
Change to:
```html
<Section id="faq-hero" delay="0.1s" className="pt-8 pb-12 md:py-52 min-h-[40vh] flex items-start md:items-end">
```
This matches the `pt-16 pb-12` rhythm used by other page heroes on mobile, and preserves the desktop layout exactly.

Also in the same file, increase the description paragraph font size from `text-sm` to `text-base` on mobile:
```html
<p class="text-muted-foreground font-mono text-sm max-w-xl ...">
```
Change to:
```html
<p class="text-muted-foreground font-mono text-sm md:text-sm text-base max-w-xl ...">
```
Actually replace `text-sm` with `text-base md:text-sm` so it's larger on mobile and reverts to small on desktop where the design intent was tight/technical. Also bump the question buttons in `FAQContent.tsx` from `text-xs md:text-sm` to `text-sm md:text-sm` and the answer paragraphs from `text-sm` to `text-base`.

#### 8b — Index sidebar: condense spacing on mobile + background colour

**The problem:** The `<aside>` in `FAQContent.tsx` is `sticky top-32` but has no background colour — when the user scrolls, page content bleeds through behind it. On mobile it also takes up too much vertical space before the questions begin.

In `src/components/modules/FAQContent.tsx`, find the `<aside>` element:
```tsx
<aside className="md:w-1/5 sticky top-32 h-fit space-y-4">
  <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-[10px] font-medium mb-8">
    Index
  </p>
  {faqs.map((section) => (
    <a ...>{`// ${section.category}`}</a>
  ))}
</aside>
```
Replace with:
```tsx
<aside className="md:w-1/5 sticky top-16 md:top-32 h-fit space-y-2 md:space-y-4 bg-background md:bg-transparent py-3 md:py-0 -mx-4 px-4 md:mx-0 md:px-0 z-10">
  <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-[10px] font-medium mb-3 md:mb-8">
    Index
  </p>
  {faqs.map((section) => (
    <a ...>{`// ${section.category}`}</a>
  ))}
</aside>
```

Key changes:
- `top-16` on mobile (accounts for fixed nav height) instead of `top-32`
- `space-y-2` on mobile instead of `space-y-4` — condenses the index links
- `bg-background` on mobile, transparent on desktop — blocks body text from bleeding through on scroll
- `mb-3` on mobile instead of `mb-8` — less gap between "Index" label and the links
- `-mx-4 px-4` extends the background flush to the viewport edges on mobile so it fully covers scrolling content beneath

#### 8c — FAQ text sizes on mobile

In `src/components/modules/FAQContent.tsx`:

1. Question buttons — find `text-xs md:text-sm`, change to `text-sm md:text-sm`
2. Answer paragraphs — find `text-sm text-muted-foreground font-mono`, change to `text-base md:text-sm text-muted-foreground font-mono`
3. Category headings (`// Process`, `// Technical`) — find `text-[10px]`, change to `text-xs md:text-[10px]`

---

---

### 9. Consistent section vertical spacing — single source of truth

**The problem:** `Section.astro` sets `py-12 md:py-32` as the outer section spacing, but almost every component rendered inside a Section adds its own `py-*` on its root wrapper — creating double-padding. The effective vertical space varies section-by-section depending on what component lives inside it, making the page feel rhythmically inconsistent on mobile.

**The principle:** `Section.astro` is the only element allowed to add vertical space between sections. Components rendered inside a Section must have `py-0` (or no `py-*` at all) on their outermost wrapper. Internal `py-*` between sub-elements *within* a component is fine to keep.

#### Step 1 — Set the standard in `src/components/Section.astro`

Find the section class list (approximately line 31):
```
"relative py-12 md:py-32 flex justify-center w-full ..."
```
Change to:
```
"relative py-16 md:py-24 flex justify-center w-full ..."
```
`py-16` (64px) on mobile and `py-24` (96px) on desktop gives generous, consistent breathing room. Do not use different values on individual pages — this single line controls all sections site-wide.

#### Step 2 — Remove conflicting outer padding from component wrappers

Each file below has a root `<div>` with `py-*` that doubles the Section padding. Change each to remove the outer vertical padding only. Do not touch any internal spacing (padding between sub-elements inside the component).

**`src/components/modules/CTA.tsx`**
Find: `<div className="w-full flex flex-col items-center text-center py-24">`
Change to: `<div className="w-full flex flex-col items-center text-center">`

**`src/components/modules/Philosophy.tsx`**
Find the root wrapper with `py-12`
Change: remove `py-12` from the root div only

**`src/components/modules/AboutPhilosophy.tsx`**
Find the root wrapper with `py-12`
Change: remove `py-12` from the root div only

**`src/components/modules/Values.tsx`**
Find: `<div className="w-full py-12 md:py-20">`
Change to: `<div className="w-full">`

**`src/components/modules/SocialsGrid.tsx`**
Find: `<div className="w-full py-12 flex flex-col items-center justify-center space-y-8 animate-fade-in-up">`
Change to: `<div className="w-full flex flex-col items-center justify-center space-y-8 animate-fade-in-up">`

**`src/components/modules/FAQContent.tsx`**
Find: `<div className="flex flex-col md:flex-row gap-16 py-10 max-w-6xl mx-auto ...">` 
Change: remove `py-10` from this wrapper only

#### Step 3 — Hero components: remove mobile outer padding (Section handles it)

Hero components are placed inside a sticky height-constrained wrapper on desktop, so their `py-24 md:py-36` provides internal spacing in that context. With the sticky pattern removed on mobile (see section 3), the hero renders as a normal block and Section.astro handles outer spacing. Remove the mobile `py-24` from hero root wrappers but keep the desktop value:

**`src/components/modules/solutions/SonicHero.tsx`**
Find: `<div className="relative w-full py-24 md:py-36 min-h-[50vh] flex flex-col overflow-visible">`
Change to: `<div className="relative w-full md:py-36 min-h-[50vh] flex flex-col overflow-visible">`

**`src/components/modules/solutions/UIUXHero.tsx`** — same change as above

**`src/components/modules/solutions/ImmersiveHero.tsx`** — same change as above

**`src/components/modules/ContactHero.tsx`**
Find: `<div className="relative w-full py-24 md:py-36 min-h-[50vh] flex flex-col overflow-visible">`
Change to: `<div className="relative w-full md:py-36 min-h-[50vh] flex flex-col overflow-visible">`

**`src/components/modules/AboutIntro.tsx`**
Find: `<div className="relative w-full py-0 md:py-36 min-h-svh flex flex-col overflow-visible">`
Change to: `<div className="relative w-full md:py-36 min-h-svh flex flex-col overflow-visible">`
(Already `py-0` on mobile, just make it explicit there is no mobile py.)

#### Step 4 — Remove page-level Section className padding overrides

These per-page overrides fight the standard set in Section.astro and must be removed or corrected:

**`src/pages/contact.astro`** — the `ConceptGrid` Section has `className="py-0"`. Remove `py-0` so it uses the standard Section spacing.

**`src/pages/faq.astro`** — the `faq-list` Section has `className="pt-0"`. Remove `pt-0`.

**`src/components/modules/HomeHero.tsx`** — has a `className="py-0 md:py-12"` on an internal element. Review whether this is an internal layout element (keep) or an outer Section-level wrapper (remove).

---

### 10. Mobile tap feedback — visual response on link/button press

**The problem:** On mobile, there is no visual feedback when a user taps a link or button. The browser can take 100–300ms to respond and the user has no indication the tap registered.

**Fix A — Remove tap delay globally.** In `src/styles/global.css`, add to the `body` or a global selector:
```css
a, button, [role="button"] {
  touch-action: manipulation; /* removes 300ms tap delay on iOS */
}
```

**Fix B — Add active state flash.** In `src/styles/global.css`, add:
```css
@media (hover: none) {
  a:active,
  button:active,
  [role="button"]:active {
    opacity: 0.6;
    transform: scale(0.97);
    transition: opacity 0.05s, transform 0.05s;
  }
}
```
The `hover: none` media query ensures this only applies on touch devices — desktop hover states are unaffected.

**Fix C — Nav links specifically.** The mobile nav links in `src/components/Navigation.tsx` should also get `active:opacity-60` Tailwind classes so they flash immediately on tap:
```tsx
// Add active:opacity-60 to every mobile nav <a> element, e.g.:
<a href="/home" className="... active:opacity-60">Home</a>
```
Apply to all mobile nav links including the pinned Contact button.

---

### 11. FAQ hero — add bitmap-style question mark icon

**The problem:** The FAQ hero section has no background icon/constellation like other pages (About has the founders sketch, Solutions have icon constellations). It feels sparse.

**No `BitmapQuestion` icon exists yet — create one first**, then use it in the FAQ hero.

#### Step 1 — Add `BitmapQuestion` to `src/components/ui/icons.tsx`

Following the exact same pixel-rect pattern as all other icons in the file (2px `<rect>` blocks on a 16×16 grid, `fill="currentColor"`), add this icon at the end of the file:

```tsx
/** BITMAP_QUESTION: A pixelated question mark */
export const BitmapQuestion = ({ className, style }: IconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Top arc of ? */}
    <rect x="4" y="2" width="6" height="2" fill="currentColor" />
    <rect x="10" y="4" width="2" height="2" fill="currentColor" />
    <rect x="10" y="6" width="2" height="2" fill="currentColor" />
    <rect x="8"  y="8" width="2" height="2" fill="currentColor" />
    {/* Stem */}
    <rect x="6"  y="8" width="2" height="2" fill="currentColor" />
    {/* Gap */}
    {/* Dot */}
    <rect x="6" y="12" width="2" height="2" fill="currentColor" />
    {/* Left side of arc */}
    <rect x="2" y="4" width="2" height="2" fill="currentColor" />
  </svg>
);
```

#### Step 2 — Use it in `src/pages/faq.astro`

Import and place two or three `BitmapQuestion` icons as a background constellation behind the hero text, matching the visual language of the other hero pages. Position them with `absolute` placement, low opacity (`text-primary/20`, `text-accent/30`), and varied sizes. Example:

```astro
---
import { BitmapQuestion } from '../components/ui/icons';
---

<Section id="faq-hero" ...>
  {/* Background icon constellation */}
  <div class="absolute right-4 top-4 pointer-events-none select-none" aria-hidden="true">
    <BitmapQuestion class="w-32 h-32 text-primary/10 rotate-12" />
  </div>
  <div class="absolute right-16 top-16 pointer-events-none select-none" aria-hidden="true">
    <BitmapQuestion class="w-16 h-16 text-accent/20 -rotate-6" />
  </div>

  <div class="max-w-3xl relative z-10">
    ... existing hero content unchanged ...
  </div>
</Section>
```

Keep `relative z-10` on the text wrapper so it sits above the icons. Do not change any copy or sizing of the existing hero text.

---

### 13. Desktop hero height — reveal section divider below fold

**Goal:** On every page (except `returns.astro`) the sticky hero container should be 90vh on desktop, not 100vh. This lets the border-top of the first section peek just below the fold, signalling to the user that there is more content below.

**The change is one class, applied consistently across all pages that use the sticky hero pattern.**

In each of these files:
- `src/pages/home.astro`
- `src/pages/about.astro`
- `src/pages/solutions/sonic-branding.astro`
- `src/pages/solutions/uiux-sound.astro`
- `src/pages/solutions/immersive-audio.astro`
- `src/pages/contact.astro`

Find the sticky hero wrapper:
```html
<div class="md:sticky md:top-0 md:z-[1] md:h-svh">
```
Change `md:h-svh` to `md:h-[90vh]`:
```html
<div class="md:sticky md:top-0 md:z-[1] md:h-[90vh]">
```

Do not change the mobile classes. Do not touch `returns.astro`.

> If 90vh feels like too much peek, try `md:h-[85vh]` — but pick one value and use it identically across all pages.

---

### 14. Extract Founders module from AboutIntro — make About hero consistent

**The problem:** `AboutIntro.tsx` contains both the hero text (typewriter headline + subheading) AND the founders grid (two team member cards). This means the About sticky hero container holds far more content than any other hero, making consistent height impossible. The founders grid needs to become its own Section so the About hero matches every other page.

#### Step 1 — Create `src/components/modules/Founders.tsx`

Extract the founders grid from `AboutIntro.tsx` into a new standalone component. The founders data array and the card rendering logic move here wholesale. The `showContent` opacity fade that was tied to the TypewriterHero's `onComplete` is no longer needed — Section.astro's `reveal-on-scroll` handles the section-level entrance. Cards should render at full opacity.

The new component should look like this (extract from `AboutIntro.tsx`):

```tsx
/* src/components/modules/Founders.tsx */
import React from 'react';

const founders = [
  {
    name: "[dom.storrs-fox]",
    role: "Sound Designer & Technologist",
    bio: "Deep expertise in digital audio systems, software integration, and the technical architecture of sound."
  },
  {
    name: "[nick.granville-fall]",
    role: "Composer & Spatial Audio Designer",
    bio: "Specializes in emotional storytelling through sound and the architecture of immersive audio experiences."
  }
];

export default function Founders() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-px bg-foreground/5 w-full">
      {founders.map((f, index) => {
        const formattedId = String(index).padStart(4, '0');
        return (
          <div key={index} className="mobile-viewport-active group relative bg-background/50 p-4 md:p-12 overflow-hidden border border-foreground/10">
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-foreground/10 group-hover:border-accent transition-colors" />
            <div className="relative z-10">
              <span className="font-mono text-[10px] mt-8 md:mt-0 text-accent block mb-6 tracking-widest">{formattedId}</span>
              <h3 className="text-foreground font-mono text-2xl mb-2 transition-all group-hover:translate-x-2">{f.name}</h3>
              <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-8 opacity-80 group-hover:opacity-100 transition-opacity">{f.role}</p>
              <div className="h-px w-8 bg-foreground/50 mb-8 group-hover:w-full transition-all duration-700" />
              <p className="text-muted-foreground text-base mb-12 md:mb-0 leading-relaxed max-w-sm group-hover:text-foreground transition-colors">{f.bio}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2000ms] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-700 group-hover:w-full shadow-[0_0_15px_rgba(255,165,0,0.6)]" />
          </div>
        );
      })}
    </div>
  );
}
```

#### Step 2 — Strip founders grid from `AboutIntro.tsx`

Remove everything from the `{/* 3. FOUNDERS MODULE */}` comment to the end of the JSX. The component should now end after the hero text block (the `<p>` with the `bitmap.audio is the collaboration...` copy). The `showContent` state and its opacity classes on the description paragraph can stay — they are still used for the typewriter reveal.

Also remove the `founders` data array from the top of the file since it moves to `Founders.tsx`.

#### Step 3 — Update `src/pages/about.astro`

Import the new `Founders` component and add it as a dedicated Section immediately after the sticky hero wrapper, before the existing philosophy section:

```astro
---
import AboutIntro from '../components/modules/AboutIntro.tsx';
import Founders from '../components/modules/Founders.tsx';
import AboutPhilosophy from '../components/modules/AboutPhilosophy.tsx';
import Values from '../components/modules/Values.tsx';
import CTA from '../components/modules/CTA.tsx';
---

<Layout title="bitmap.audio | about">
  <div class="md:sticky md:top-0 md:z-[1] md:h-[90vh]">
    <div class="pt-20 pb-12 md:h-full md:pb-24">
      <AboutIntro client:load />
    </div>
  </div>

  <div class="md:relative md:z-10 bg-background">
    <Section id="founders" delay="0.2s">
      <Founders client:visible />
    </Section>

    <Section id="philosophy" delay="0.3s">
      <AboutPhilosophy client:visible />
    </Section>
    ...
  </div>
</Layout>
```

---

### 15. Footer width — match page section width

**The problem:** The footer uses `container mx-auto px-6` which resolves to a different max-width than the page sections (`max-w-7xl`). On wide screens the footer is noticeably wider than the content above it, making the last scroll feel inconsistent.

**The fix:** In `src/components/Footer.astro`, find the inner wrapper:
```html
<div class="container mx-auto px-6 py-12">
```
Change to:
```html
<div class="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
```
This matches exactly the inner content div in `Section.astro`, so the footer columns will align with page section content at every breakpoint.

Also update the bottom copyright bar if it has its own container — apply the same `max-w-7xl mx-auto` to it.

---

### 16. Consistent section vertical padding — complete pass

**Goal:** Every non-hero section site-wide should have identical vertical breathing room. The baseline is already set in `Section.astro` as `py-16 md:py-24`. The problem is several components add their own outer `py-*` on top of that, making some sections feel taller than others.

`ServicePillars.tsx` is the one remaining offender not covered in section 9. In `src/components/modules/ServicePillars.tsx`, find the outer container:
```tsx
className={cn(
  "max-w-[1440px] mx-auto py-12 md:py-24 px-4 md:px-10 transition-all ...",
)}
```
Remove `py-12 md:py-24` from this element only. The `px-4 md:px-10` and other classes stay. Section.astro handles the outer vertical spacing.

---

### 17. ConceptGrid card hover — fix section height expanding

**The problem:** When cards in `ConceptGrid` are hovered or auto-highlighted (e.g. the "Applications" section on the UI/UX Sound page), the entire section expands and contracts. This doesn't happen on the homepage "What We Do" (`ServicePillars`) cards.

**Root cause:** `ConceptGrid` card wrappers use `h-full` on both the outer wrapper div and the inner card div. The grid row auto-sizes to content. When a card becomes active, the description text switches to the `label-tape` CSS class which adds pseudo-element padding — the card grows, the grid row grows, the section expands. `ServicePillars` avoids this by using a static `flex flex-col` layout with no `h-full` dependencies and a fixed `min-h` on the description.

**The fix:** In `src/components/modules/ConceptGrid.tsx`, make two changes to the card structure:

**Change 1 — Card wrapper div** (the `ConceptCard` component's outermost div):
```tsx
// Find:
<div className={cn("relative w-full h-full min-h-[200px]", ...)}>
// Change to:
<div className={cn("relative w-full min-h-[200px]", ...)}>
```
Remove `h-full` — the wrapper should size to its content, not stretch to fill.

**Change 2 — Description container** (inside the card):
```tsx
// Find:
<div className="mt-4 pb-4 min-h-[80px] flex flex-col justify-start">
// Change to:
<div className="mt-4 pb-4 h-[80px] overflow-hidden flex flex-col justify-start">
```
Change `min-h-[80px]` to a fixed `h-[80px] overflow-hidden`. This hard-caps the description area so no text reflow or `label-tape` pseudo-element can cause the card to grow. Adjust the fixed height value if descriptions are longer — check all `ConceptGrid` usages site-wide (UI/UX Applications, Contact page, Sonic Branding if used there) and set a value that comfortably fits the longest description without clipping.

**Change 3 — Scale value:**
The active card currently uses `md:scale-[1.05]`. Match `ServicePillars`'s subtler `scale-[1.02]` to reduce the visual jump:
```tsx
// Find:
shouldBePlaying ? "border-accent md:scale-[1.05] z-50 shadow-2xl" : ...
// Change to:
shouldBePlaying ? "border-accent md:scale-[1.02] z-50 shadow-2xl" : ...
```

After these changes, hover/autoplay should animate border, shadow, and text colour only — the section height stays completely rigid, matching `ServicePillars` behaviour exactly.

---

### 18. ServicePillars "LEARN MORE" — fixed bottom position + larger text

**The problem:** The "LEARN MORE" button uses `mt-auto` to push to the bottom of the flex container. On desktop this works because grid rows equalise card heights. On mobile (single column) each card is its own height — cards with longer descriptions push LEARN MORE further down, creating inconsistent spacing.

**The goal:** LEARN MORE should always sit at the exact same distance from the bottom edge as the icon sits from the top edge. The card uses `p-6 md:p-12` padding, so the icon is always 24px (mobile) / 48px (desktop) from the top. LEARN MORE should be the same distance from the bottom.

**The fix in `src/components/modules/ServicePillars.tsx`:**

**Change 1 — Card `<a>` — add extra bottom padding to reserve space for the absolute button:**
```tsx
// Find:
"relative flex flex-col p-6 md:p-12 transition-all duration-500 ..."
// Change to:
"relative flex flex-col p-6 md:p-12 pb-14 md:pb-20 transition-all duration-500 ..."
```

**Change 2 — Description `<p>` — remove `mb-10 min-h-[60px]`:**
```tsx
// Find:
<p className="font-sans text-muted-foreground mb-10 min-h-[60px] font-light leading-relaxed">
// Change to:
<p className="font-sans text-muted-foreground font-light leading-relaxed">
```

**Change 3 — LEARN MORE container — switch from `mt-auto` to `absolute` pinned to bottom:**
```tsx
// Find:
<div className="mt-auto pt-4">
  <span className={cn("inline-flex items-center gap-3 text-[10px] font-mono ...")}>
    LEARN MORE
    <ArrowRight className="w-3 h-3 ..." />
  </span>
</div>
// Replace with:
<div className="absolute bottom-6 md:bottom-12 left-6 md:left-12">
  <span className={cn("inline-flex items-center gap-3 text-sm font-mono ...")}>
    LEARN MORE
    <ArrowRight className="w-4 h-4 ..." />
  </span>
</div>
```

Key changes: `mt-auto` → `absolute bottom-6 md:bottom-12 left-6 md:left-12` (mirrors card padding exactly), `text-[10px]` → `text-sm`, `w-3 h-3` → `w-4 h-4` on the arrow.

**This fix has already been applied directly to the file** — do not re-apply. Document only.

---

### 19. ConceptGrid autoplay — enable on mobile

**The problem:** Both the auto-highlighting cycle and the background video playback are disabled on mobile. The root cause is a single early-return guard at the top of the autoplay `useEffect` in `src/components/modules/ConceptGrid.tsx`:

```ts
// Find and DELETE this line (approximately line 60):
if (typeof window !== 'undefined' && window.innerWidth < 768) return;
```

**The fix:** Delete that line entirely. Do not replace it with anything.

With the guard removed:
- The autoplay cycle runs on mobile exactly as on desktop — cycling through cards every 3.5s
- `forcePlay` becomes true for the active card, triggering highlight styles and video playback
- Touch devices don't fire `isHovered`, but `forcePlay` from the cycle covers that

**Why it was there:** Battery/data concern for mobile autoplay video. For bitmap.audio this is not a concern — the videos are muted, short, looping, and demonstrating the product is the whole point.

**Do not re-add this guard** — the absence is intentional.

---

### 19. ConceptGrid preview video — fix blend mode so videos are visible

**The problem:** The preview video overlay in `ConceptGrid.tsx` uses `mix-blend-overlay` with `opacity-40`. On the site's near-black card backgrounds (`bg-card/60`), `mix-blend-overlay` multiplies two dark surfaces together, producing a result that's effectively invisible. The videos are technically playing but cannot be seen.

**The fix:** In `src/components/modules/ConceptGrid.tsx`, find the video container div inside `ProjectCard` (approximately line 234):

```tsx
// Find:
<div className={cn(
  "absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none mix-blend-overlay", 
  shouldBePlaying ? "opacity-40" : "opacity-0"
)}>
```

Change to:
```tsx
// Change to:
<div className={cn(
  "absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none mix-blend-screen", 
  shouldBePlaying ? "opacity-30" : "opacity-0"
)}>
```

Key changes:
- `mix-blend-overlay` → `mix-blend-screen`: Screen mode brightens composites — it shows video detail on dark backgrounds. This is consistent with how other cinematic layers on the site work (tiger image, listening woman, ROI ghost counter all use `mix-blend-screen`).
- `opacity-40` → `opacity-30`: Screen mode is more visually prominent than overlay on dark backgrounds, so dial opacity back slightly to keep it subtle and non-distracting.

The video already has `grayscale contrast-125` on it, which ensures it reads as a monochrome film grain effect rather than colour video — keep those classes unchanged.

**Note on autoplay behaviour:** The mobile autoplay guard has been intentionally removed (see section 18). Videos now play on both mobile and desktop via the autoplay cycle. Do not re-add the `window.innerWidth < 768` guard.

---

### 19. Audit checklist (run after all changes)

Verify at **375px** (iPhone SE) and **390px** (iPhone 14) in Chrome DevTools, Brave, and Safari:

- [ ] No visible coloured borders or gaps at the left/right page edges
- [ ] Hero content on every page has `~16px` left padding — text is not flush against the screen edge
- [ ] FAQ hero top spacing matches other pages on mobile
- [ ] FAQ index sidebar has solid background — no text bleeding through on scroll
- [ ] FAQ index links are condensed on mobile
- [ ] Nav stays fixed at the top while scrolling on mobile in all three browsers
- [ ] On mobile, hero and sections stack normally — no content hidden behind a scrolling section
- [ ] On desktop, sticky scroll-over effect is preserved on all applicable pages
- [ ] "OUR STORY" and "START A PROJECT" buttons are equal width on mobile
- [ ] Sections below the hero appear smoothly with no gap/flash of background
- [ ] Paragraph text is at least 16px everywhere across all pages including FAQ
- [ ] No horizontal scroll at any breakpoint
- [ ] Portrait and landscape both tested

---

## Next Session — Priority Work Items

Work through these in order. Each is a separate task — complete and verify one before starting the next.

---

### A. `returns.astro` — slide layout system rebuild (PRIORITY NEXT SESSION)

Every slide on `returns.astro` needs its internal layout converted from the current ad-hoc `md:pl-48 / md:pl-72 / absolute` positioning to a **CSS Grid fractional column system**. This is the agreed approach. Do not start implementing until you have read and understood the full brief below.

---

#### A1 — Why: the current approach is broken

Every desktop slide currently positions its content using combinations of:
- `md:pl-48`, `md:pl-72`, `md:px-48` — large arbitrary padding values
- Nested padding: outer `md:pl-72` + inner `pl-8` stacking invisibly
- `absolute` positioning on imagery — the image is outside layout flow entirely

These break when:
- Slide width changes (padding is pixel-based, not proportional)
- Window is resized between mobile (~768px) and desktop (>1280px) — there is a gap where neither layout is clean
- Any slide gets refactored — the stacking context is implicit and fragile

#### A2 — The replacement system: CSS Grid with fractional columns

Every desktop slide layout must use CSS Grid with equal fractional columns (`1fr`). This maps directly to design language: thirds (`grid-cols-3`), fifths (`grid-cols-5`), sixths (`grid-cols-6`).

Key properties:
- `1fr` columns always divide equally regardless of total slide width — changing `w-[100vw]` to `w-[150vw]` doesn't change where "1/3" is
- Overlapping content (image behind text) uses `row-start-1` on both elements — no `absolute` positioning needed
- No padding values for positioning — content placement is declared entirely in `grid-column` / `grid-row`

**Standard template for a text + image slide:**
```html
<section class="w-[Xvw] grid grid-cols-3 items-center h-full ...">
  <!-- col 1: left breathing room (empty) -->
  <div class="col-start-1 row-start-1"></div>

  <!-- col 2: text block — starts at 1/3 mark -->
  <div class="col-start-2 row-start-1 z-10">
    ...text content...
  </div>

  <!-- col 2–3: image — overlaps with text column, sits behind -->
  <div class="col-start-2 col-span-2 row-start-1 z-0">
    ...image...
  </div>
</section>
```

For fifths instead of thirds, use `grid-cols-5` — more control, same principle.

**For centred content (stat interstitials like 8-10ms, 20x):**
```html
<section class="w-[66vw] grid grid-cols-3 items-center justify-items-center h-full ...">
  <div class="col-start-2 row-start-1">...stat...</div>
</section>
```

#### A3 — Slide-by-slide plan

Work through each numbered slide below in order. Each entry states the intended width and grid layout. After each slide, verify visually at 1440px before moving to the next.

| Slide | Width | Grid | Layout intent |
|-------|-------|------|---------------|
| 00 Status | `w-screen` | `grid-cols-3` | Text left-of-centre, col 1 empty |
| 0.5 Woman Image | `w-[50vw]` | No grid needed | Image fills full panel |
| 01 Context | `w-[50vw]` | `grid-cols-2` | Text right half, train behind |
| 02 Architecture | `w-[150vw]` | `grid-cols-3` | Col 1 empty, col 2 text, col 2–3 SVG (overlapping) |
| 03 Neurology Processing | `w-[150vw]` | `grid-cols-3` | Col 1 empty, col 2 text, col 2–3 tiger (overlapping, behind) |
| 3.5 Brain Speed Stat | `w-[66vw]` | `grid-cols-3` | Stat centred, col 2 |
| 04 Neurology Memory | `w-screen` | `grid-cols-3` | Text col 2, centred |
| 4.5 Memory Stat | `w-[66vw]` | `grid-cols-3` | Stat centred, col 2 |
| 05 Metrics | `w-screen` | `grid-cols-3` | Text + cards col 1–2, space right |
| 06 Conversion text | `w-[50vw]` | `grid-cols-2` | Text fills col 1–2 |
| 6.5 ROI Counter | `w-[66vw]` | `grid-cols-3` | Counter centred, col 2 |
| 07 Credibility | `w-screen` | `grid-cols-3` | Text col 1–2 |
| 7.5 Task Success Ring | `w-screen` | `grid-cols-3` | Ring centred, col 2 |
| 09 Perception | `w-screen` | `grid-cols-3` | Text col 2 |
| 8.5 SME | `w-[66vw]` | `grid-cols-3` | Text centred, col 2 |
| 10 Culture | `w-[66vw]` | `grid-cols-3` | Text col 1–2 |
| 11 Asset Ownership | `w-screen` | `grid-cols-3` | Text col 1–2 |
| 12 Belief | `w-[66vw]` | `grid-cols-1` | Text fills full panel |
| 13 Execution | `w-screen` | `grid-cols-3` | Text col 2–3, CTA anchored right |

These widths and layouts are starting points — dom will adjust widths manually using the `#region` labels added in the previous session.

#### A4 — Mobile cleanup at the same time

Currently every slide duplicates its content in two versions: `hidden md:flex` (desktop) and `md:hidden` (mobile). This works but the mobile versions have accumulated their own padding mess.

Mobile rule: every mobile section uses a single clean template:
```html
<div class="md:hidden flex flex-col justify-center gap-6 px-6 pt-16 pb-8 h-full relative z-10">
  <span class="text-eyebrow ...">[ Label ]</span>
  <h2 class="font-mono ...">Headline</h2>
  <p class="font-sans text-base ...">Body copy.</p>
</div>
```

- `px-6` for horizontal breathing room
- `pt-16` to clear the fixed nav
- `gap-6` between elements — no `mb-*` on individual children
- Background imagery: always `absolute inset-0 z-0 opacity-30 pointer-events-none`, never affecting layout

#### A5 — The intermediate-viewport problem

Between ~768px and ~1100px (iPad landscape, small laptops), the 150vw slides are extremely wide but the mobile layout hasn't triggered. The site currently looks broken in this range.

The fix: raise the desktop layout breakpoint from `md:` (768px) to `lg:` (1024px) across all returns.astro slides. This means:
- `md:hidden` → `lg:hidden` on mobile content blocks
- `hidden md:flex/block` → `hidden lg:flex/block` on desktop content blocks
- The mobile snap-scroll CSS in `<style is:global>` currently targets `html.is-mobile-snap` (set when `window.innerWidth < 768`) — change the JS check to `< 1024`

Do NOT change this breakpoint on other pages — it is specific to returns.astro.

---

#### A6 — What was already done (do not redo)

- Slide 02 (Architecture) has been partially rebuilt with the flex-row zone system (not yet grid). It needs converting to the grid system above but the mobile dual-content structure is already correct.
- All slides have `<!-- #region SLIDE-XX -->` / `<!-- #endregion -->` folding markers for VS Code — do not remove these.
- `id="roi-section"` and `id="success-section"` are GSAP animation anchors — never remove or rename them.
- The end screen (`#end-screen`) and its logo pulse animation are complete — do not touch.

---

### B. Remove footer from `returns.astro` — end with a "go home" option

**Status: DONE — do not re-implement.**

The footer has been removed from `returns.astro`. An end-of-journey screen now sits in normal document flow immediately after the 1600vh scroll track. It is not a horizontal strip section — it is a plain `<div id="end-screen">` that appears when the user has scrolled through all slides.

**What was built:**
- `h-svh` container, `bg-background`, vertically centred
- Inline SVG `#end-logo` — the bitmap `b` mark in `hsl(var(--primary))`
- `bitmap.audio` label in `text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground`
- Two links: `← Return to Site` (→ `/home`, accent colour) and `Start a Project` (→ `/contact`, muted primary)
- GSAP ScrollTrigger animation on `#end-logo`: shifts `fill` and `stroke` from `--primary` (cyan) → `--accent` (amber) → back to `--primary` as the screen scrolls into view (`scrub: 0.5`). The background is untouched — only the `b` glyph changes colour.

**Do not add the footer back. Do not add a background flare or radial gradient — the logo colour shift is the only effect.**

On mobile (snap-scroll mode), the end screen is the final snap slide — it renders as-is with no GSAP (mobile branch returns early before the ScrollTrigger is set up).

---

### C. Performance review — full site

**Goal:** Identify and fix the sources of sluggishness across the site. The site currently feels slow to respond on scroll and interaction. Work through these in order of likely impact.

#### C1 — Audit bundle size and unused JS

1. Run `npm run build` and check the output for large chunks. Any JS chunk over 100kb (gzipped) should be investigated.
2. Check for any libraries imported globally that could be lazy-loaded (e.g. GSAP should only load on pages that use it — `returns.astro`).
3. Verify Astro's `client:load` vs `client:visible` vs `client:idle` directives are used correctly across all pages:
   - `client:load` — only for components needed immediately on page paint (Navigation, HomeHero)
   - `client:visible` — for components below the fold (CTA, most Section content)
   - `client:idle` — for non-critical components that can wait (SocialsGrid, FAQ index)
   - Audit `src/pages/*.astro` and `src/pages/solutions/*.astro` — replace any unnecessary `client:load` with `client:visible`

#### C2 — GSAP and ScrollTrigger loading

1. GSAP is currently likely imported on every page via a shared bundle. Confirm it is only initialised on `returns.astro`. On all other pages, GSAP should not be in the critical path.
2. In `returns.astro`, ensure `ScrollTrigger.refresh()` is called after the page fully loads (not just DOM ready) — premature refresh causes incorrect trigger positions.

#### C3 — Image optimisation

1. Audit `public/images/` — check for any uncompressed PNG or JPEG files over 200kb.
2. All images used in `<img>` tags should have explicit `width` and `height` attributes to prevent layout shift (CLS).
3. Add `loading="lazy"` to all images below the fold. Add `fetchpriority="high"` to the hero image (logo/brand mark) on the landing page.

#### C4 — CSS animation performance

1. In `src/styles/global.css`, find all `@keyframes` that animate `box-shadow`, `text-shadow`, `background-color`, or `filter`. These trigger repaints on every frame.
2. Replace with `opacity` or `transform`-only equivalents where possible — these are GPU-composited and don't repaint.
3. Specifically audit: `pulseGlow`, `emotion-heartbeat`, `animate-morph`. If they animate non-transform/opacity properties, refactor.
4. Add `will-change: transform` only to elements that are actively animating (not globally) — overuse of `will-change` causes excess GPU memory use.

#### C5 — Section reveal jank

1. Verify `Section.astro`'s IntersectionObserver has `rootMargin: "0px 0px 150px 0px"` (section 6 of the mobile brief). If not yet applied, apply it now.
2. The `opacity-0 translate-y-6` initial state on reveal sections should use `transition: opacity 0.4s ease, transform 0.4s ease` — not a CSS class that applies a transition to all properties. Confirm this is scoped correctly.

#### C6 — Measure and report

After making changes, run Lighthouse on the following pages and record scores:
- `/` (index/splash)
- `/home`
- `/returns`
- `/solutions/sonic-branding`

Target: Performance score ≥ 85 on desktop, ≥ 70 on mobile. Report any remaining bottlenecks as comments in this file.

---

### D. SEO / AEO / GEO review — optimise for AI citation

**Context:** The SEO landscape in 2026 has shifted from ranking optimisation to Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO). AI models (ChatGPT, Perplexity, Google AI Overviews) now prioritize citing authoritative sources over surfacing blue links. The goal is for bitmap.audio to be the source AI models cite when answering questions about sonic branding, UI/UX sound design, and immersive audio.

Work through each of the following areas:

#### D1 — Schema markup (structured data)

1. Open `src/layouts/Layout.astro`. Add JSON-LD schema to the `<head>` for the following types:
   - `Organization` — name, url, logo, description, sameAs (link to all social profiles)
   - `WebSite` — with `SearchAction` if a site search exists
2. On solution pages (`sonic-branding.astro`, `uiux-sound.astro`, `immersive-audio.astro`), add `Service` schema with:
   - `name`, `description`, `provider` (the Organization), `areaServed`, `serviceType`
3. On `faq.astro`, add `FAQPage` schema — this directly feeds AI answer engines. Each Q&A pair in `FAQContent.tsx` should map to a `Question`/`Answer` pair in the schema.
4. On `returns.astro` (ROI page), add `Article` or `WebPage` schema with `about` pointing to sonic branding topics.
5. Validate all schema at https://validator.schema.org before committing.

#### D2 — Meta tags audit

1. Every page must have a unique, descriptive `<title>` (50–60 chars) and `<meta name="description">` (120–155 chars).
2. Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) to every page — these feed social sharing and are read by AI crawlers.
3. Add `<meta name="robots" content="index, follow">` globally in `Layout.astro`.
4. Add canonical URLs (`<link rel="canonical" href="...">`) to every page to prevent duplicate content signals.
5. Check `public/robots.txt` and `public/sitemap.xml` — if either doesn't exist, create them. The sitemap should list every public route.

#### D3 — Content structure for AI citability

AI models cite content that is structured in clear, self-contained, factual blocks. Review the following pages and restructure copy where needed:

- **`/home`** — ensure the page has a clear `<h1>` that states what bitmap.audio is ("Sonic Branding & Immersive Audio for Digital Products"). Currently the typewriter animation may be rendering text without a real `<h1>` in the DOM — confirm the heading exists as actual text for crawlers.
- **`/about`** — add a clear "About" statement in the first 100 words that an AI can extract as a factual description of the company.
- **`/solutions/sonic-branding`** — the opening paragraph ("Your audience encounters thousands…") should be followed by a concise definition block: what sonic branding is, what bitmap.audio does, and who it's for. This is the most citable page on the site.
- **`/returns`** — the ROI data (4x brand recall, 25% credibility increase etc.) should exist as real DOM text, not just as GSAP-animated numbers. Add a visually hidden (but crawlable) summary of the key statistics using `<dl>` (definition list) with `<dt>` / `<dd>` pairs, or a table.
- **`/faq`** — FAQs are the highest-value AEO asset on the site. Ensure every question and answer is in the DOM as real text (not generated by JS at runtime in a way that prevents crawling). Verify by viewing page source — the FAQ content should be visible in the raw HTML.

#### D4 — E-E-A-T signals

1. **Author/team attribution:** Add the founders' names and roles to the About page in a way that's clearly structured and crawlable (e.g. a `<section>` with `itemprop="author"` or `Person` schema markup for each founder).
2. **External citations:** Identify 2–3 statistics cited on the returns/ROI page (brand recall lift, emotional response figures) and link them to their original sources. AI models prioritize pages that cite primary research.
3. **`llms.txt` file:** Create `public/llms.txt` — a plain-text file (similar to `robots.txt`) that tells AI crawlers what bitmap.audio is, what it does, and what it wants to be cited for. Format:
   ```
   # bitmap.audio
   bitmap.audio is a sonic branding and immersive audio agency.
   We design sound identities, UI/UX audio, and spatial audio experiences for digital products and brands.
   
   ## Services
   - Sonic Branding: audio logos, brand sound systems, sonic identity
   - UI/UX Sound: interface sounds, app audio, digital product sound design
   - Immersive Audio: AR/VR spatial audio, installation sound, 360° experiences
   
   ## Founded by
   - Dom Storrs-Fox: Sound Designer & Technologist
   - Nick Granville-Fall: Composer & Spatial Audio Designer
   ```
4. **Page speed as trust signal:** Fast pages are ranked higher and cited more by AI models — ensure the performance work in section C is completed before this step.

---

## F. `returns2.astro` — Align desktop grid to the nav container, switch to 12-column grid

**Context:** Section E's grid rebuild is functionally complete, but each slide's `grid-cols-3` divides the slide's own `w-[Xvw]` width — which has no relationship to where the nav logo sits. The nav (`src/components/Navigation.tsx`) uses `container mx-auto px-6`, and `tailwind.config` defines `container: { center: true, padding: "2rem", screens: { "2xl": "1440px" } }` (note `px-6` = 1.5rem overrides the container's own padding). Practically this means:

- Below 1440px viewport width: the nav container is 100% width with 24px padding each side → logo sits 24px from the left edge.
- At/above 1440px: the nav container caps at 1440px and centres, so the logo sits at `(viewport - 1440)/2 + 24px` from the left edge.

This is a single, fluid, well-defined rule with one breakpoint (1440px). The slide grids currently follow a completely different rule (fractions of `w-[Xvw]`), so as the window is resized the slide content and the nav drift relative to each other — this is the "everything gets way off kilter on resize" problem dom observed.

**The fix, applied per slide:**

1. Inside the slide `<section>`, wrap the existing grid content in a new div with classes: `md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full`
   - `md:pl-24` = 96px left padding, matching the sidebar width — prevents content from appearing behind `#sidebar-track`
   - `md:pr-6` = 24px right padding, matching the nav container's right inset
   - Note: this means text does NOT align with the nav logo (which sits at 24px); it aligns with the sidebar's right edge. This is intentional — sidebar clearance takes priority over nav alignment on the returns page.
2. On the `<section>` itself, remove `md:grid md:grid-cols-3` (or `-cols-2` / `-cols-1`) — the section becomes a plain flex/block wrapper on desktop (`md:flex md:items-center` is enough, or nothing extra if it's already centring).
3. Change every `md:col-start-N` / `md:col-span-N` from the old 3-column system to the new 12-column system. Use this conversion as a starting point, then adjust visually:
   - old `col-start-2` of 3 (centre third) → roughly `col-start-3 col-span-7` in 12 (leaves a ~2-column gutter on the left that roughly matches the nav's left margin at common widths — but see step 4)
   - old `col-start-1 col-span-2` of 3 → `col-start-1 col-span-9` in 12
   - old `col-start-2 col-span-2` of 3 → `col-start-3 col-span-9` in 12 (used for overlap/image spans — pair with `row-start-1`)
   - old single `grid-cols-1` (full width) → keep as `col-start-1 col-span-12`
4. **Primary alignment goal:** the text block's left edge should land flush with the container's left edge — i.e. `col-start-1` for the text column in most slides, with `col-span-6` to `col-span-8` depending on how much of the row the text should occupy. Do not default to `col-start-2`/`col-start-3` out of habit — start from `col-start-1` and only shift right if an image needs to occupy the columns before it (per the overlap pattern in section E5).
5. Remove any now-redundant `pl-8` / `pl-4` desktop padding on the text wrapper — `pl-24` from the container already provides the left inset (96px, clearing the sidebar). Keep these paddings for mobile (`pl-8` with no `md:` prefix becomes `pl-8 md:pl-0`, or similar).
6. For slides with full-bleed background imagery (SLIDE-02 Architecture SVG, SLIDE-03 tiger, SLIDE-0.5 woman/train image, SLIDE-01 Context) — the image element stays OUTSIDE the `container` wrapper (sibling to it, still inside the `<section>`), positioned with `absolute inset-0` or its own full-width grid as it is now. Only the TEXT content goes inside the `container` wrapper. This keeps images full-bleed while text aligns to the nav.

---

### F1 — Sidebar overlap check

**RESOLVED.** `#sidebar-track` is `w-24` (96px). With the container using `md:px-6` (24px), text would start behind the sidebar on all desktop widths. Dom's decision: use `md:pl-24 md:pr-6` on the container wrapper (sidebar-width clearance on the left, nav-matched padding on the right). Applied consistently across all slides.

**Note — sidebar at smaller screens:** The sidebar currently shows at all desktop breakpoints (`md:` / 768px+). At iPad/small laptop sizes (~768–1100px) the sidebar is 96px wide on a potentially cramped viewport. This was flagged as worth revisiting — consider hiding `#sidebar-track` below `lg:` (1024px) in a future pass. Do not implement this now; it is a separate task.

---

### F2 — Work order

**SLIDE-00 confirmed.** Container/12-col conversion applied. Sidebar clearance resolved (F1). Proceed slide by slide in the order from section E5's table, applying the same `md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full` pattern to each slide. One slide at a time — do not batch.

---

---

## G. Nav clearance for the `#sidebar-track` on `/returns2` (and later `/returns`) only

**Context:** On every other page, `Navigation.tsx`'s `container mx-auto px-6` behaves perfectly — it tracks viewport width fluidly and stops growing past the 1440px container breakpoint, same as dom described. The ROI pages are different: they have a `#sidebar-track` (`w-24` = 96px, `hidden md:flex`, fixed to the left viewport edge) that nothing else on the site has. Below the 1440px breakpoint, the nav container's left edge sits at 24px from the viewport edge — directly underneath that 96px sidebar.

**Goal:** On `/returns` and `/returns2` only, shift the nav's container 96px to the right at `md:` and above, so the logo clears the sidebar. All other pages must be completely unaffected.

### G1/G2 — Derive the flag inside `Navigation.tsx` from `currentPath` (no new prop needed)

`Navigation.tsx` already receives `currentPath` as a prop (`const Navigation = ({ currentPath }: { currentPath: string }) => {`). No change to `Layout.astro` or the render call is needed — just derive the flag locally inside `Navigation.tsx`:

```tsx
const isReturnsPage = currentPath === "/returns" || currentPath === "/returns/" || currentPath === "/returns2" || currentPath === "/returns2/";
```

(This mirrors the existing `isReturnsPage` check already present in `Layout.astro` — keep the same set of path variants for consistency.)

On the `<div className="container mx-auto px-6">` wrapper (inside `<nav>`, around line 36), conditionally add `md:pl-24` when `isReturnsPage` is true. Use `cn()`:

```tsx
<div className={cn("container mx-auto px-6", isReturnsPage && "md:pl-24")}>
```

- Do not change `px-6` itself, and do not add `md:pl-24` unconditionally — it must only apply on `/returns` and `/returns2`.
- The `md:` prefix matters: `#sidebar-track` is `hidden md:flex`, so the nav offset should only kick in at the same breakpoint where the sidebar appears.

### G3 — Match the offset in the slide-content container (section F)

The container wrapper introduced in section F for each slide's text content must use the **same** extra offset, so slide text continues to align with the now-shifted logo. SLIDE-00 has already been converted using this pattern:

```
md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full
```

(`pl-24` clears the 96px sidebar, `pr-6` matches the nav's right padding.) Apply this same pattern to each remaining slide as part of the section F conversion. This makes F1's sidebar-overlap concern moot: the 96px clearance is now baked into both the nav and the slide content consistently, so no separate investigation is needed there.

### G4 — Verify

1. Confirm `/home`, `/about`, `/solutions/*`, `/contact`, `/faq` are pixel-identical to before — the nav must not shift on any page except `/returns2` (and eventually `/returns`).
2. On `/returns2`, confirm the logo now sits 96px further right than before at viewport widths below 1440px, clear of `#sidebar-track`.
3. Confirm SLIDE-00's heading (once F is applied with `md:pl-24`) aligns with the logo's new position at 1024px, 1280px, 1440px, and 1920px.
4. Resize continuously between these widths — both nav and slide content should move together with no relative jank.

### G5 — What NOT to touch

- Do not modify `#sidebar-track` itself (width, position, z-index)
- Do not add `offsetForSidebar` logic to any other component
- Do not change nav behaviour on any page other than `/returns2` (and `/returns` once merged)
- `returns.astro` itself stays untouched for now — this groundwork (G1/G2) is shared infrastructure, but G3's container change only applies to `returns2.astro`

---

### F4 — Normalization pass: SLIDE-03 leftover grid class

**SLIDE-03** — the `<section>` element still carries a bare `grid grid-cols-1` class (no `md:` prefix), left over from the old per-section E5 grid system. No other slide's `<section>` has this. Remove `grid grid-cols-1` from SLIDE-03's section class list entirely — the inner `md:container ... md:grid md:grid-cols-12` wrapper already handles desktop layout, and the section itself doesn't need to be a grid container on mobile either.

Verify the slide still renders correctly on mobile and desktop after this edit.

---

### F5 — Fix `container mx-auto` centering on `w-[150vw]` slides (SLIDE-02, SLIDE-03, SLIDE-05)

**STATUS: RESOLVED — already applied manually by dom, do not re-execute.** Current state of `returns2.astro` (post manual edits):
- SLIDE-02 is now `w-[100vw]` and keeps `md:container md:mx-auto ...` — per this section's own rule, `container mx-auto` behaves correctly at ≤100vw, so no change needed.
- SLIDE-03 (`w-[200vw]`) and SLIDE-05/metrics (`w-[150vw]`) both already use `md:pl-24 md:pr-6 md:grid md:grid-cols-12 ...` with no `container`/`mx-auto` — matches this section's target end-state.
- SLIDE-10 and SLIDE-11 (`w-[125vw]` each) also already use the no-`container` pattern.

The problem description below is kept for reference only.

**The problem:** Tailwind's `container` class is `width: 100%` with `max-width: 1440px` applied via a *viewport*-width media query, and `mx-auto` centers that box within its parent. For sections that are `w-screen` or narrower, `container` simply fills the section edge-to-edge (mx-auto does nothing), so `col-start-1` lands flush at the section's left edge — which is the desired behaviour.

For `w-[150vw]` sections, the section itself is always 1.5× the viewport width — e.g. at a 1440px viewport the section is 2160px wide. `container` hits its 1440px cap and stops growing, but `mx-auto` still centers that 1440px box inside the 2160px+ section, leaving roughly equal empty margins on both sides. `col-start-1` then starts ~360px+ in from the section's true left edge instead of flush with it — which is why content on SLIDE-05 (and the same applies to SLIDE-02 and SLIDE-03) appears shifted toward the centre of the 150vw slide rather than aligned with the nav logo / sidebar clearance.

**The fix:** On these three slides only — **SLIDE-02**, **SLIDE-03**, **SLIDE-05** — remove `container` and `mx-auto` from the slide-content wrapper, keeping everything else identical:

```
md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full
```
becomes:
```
md:w-full md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center
```

(For SLIDE-02, if its wrapper also has `md:h-full`, keep that.)

This makes the grid fill the section's full width with `pl-24`/`pr-6` providing the same sidebar/nav-matched insets as before, so `col-start-1` starts exactly at the section's left edge (offset by the 96px sidebar clearance) instead of being centred inside the oversized 150vw box.

**Do not apply this change to any other slide** — all other sections are `w-screen` or `w-[Xvw]` ≤ 100vw, where `container mx-auto` already behaves correctly (fills the section, no centering offset). Verify SLIDE-02, SLIDE-03, and SLIDE-05 visually at 1024px, 1280px, 1440px, and 1920px after this change — content should now sit flush at the left edge (plus the 96px sidebar clearance) at every width, with no centred gap.

---

### F3 — What NOT to touch (same as E8)

- The `<script>` block — GSAP, ScrollTrigger, `scrollAt()`, sidebar logic, mobile detection
- `#end-screen`, `#scroll-track`, `#sidebar-track`, `#horizontal-strip` IDs and structural roles
- Mobile content blocks (everything without `md:`)
- Section `w-[Xvw]` widths
- `data-section` / `data-sidebar` attributes
- Any colour, typography, blend-mode, or animation classes
- `returns.astro` itself — this work stays on `returns2.astro`

---

## E. `returns.astro` — CSS Grid Layout Overhaul (returns2.astro testbed)

**Context:** The current `returns.astro` slide layout uses ad-hoc `md:pl-48`, `md:pl-72`, `md:px-48` padding values and `absolute` positioned imagery to place content. This breaks at non-standard viewport widths and is fragile to edit. The replacement is a CSS Grid fractional column system where `1fr` columns divide the slide proportionally regardless of total slide width.

**This task works on a duplicate page `returns2.astro` only — do not touch `returns.astro`.**

---

### E1 — Step 1: Duplicate the file

Copy `src/pages/returns.astro` to `src/pages/returns2.astro` exactly. No other changes at this step. Verify the new page renders at `/returns2` before proceeding.

---

### E2 — Step 2: Scope of work — desktop only

All changes in this task apply to desktop layout only (the `hidden lg:flex` / `hidden lg:block` / `lg:` prefixed content blocks). The mobile content blocks (`lg:hidden`) are left completely untouched. Do not modify any mobile layout, mobile classes, or mobile snap-scroll behaviour.

---

### E3 — Step 3: Audit for recurring patterns before touching anything

Before making any edits, read through every slide in `returns2.astro` and identify:

1. **Recurring wrapper divs** — any `<div>` that exists purely to push another element horizontally (e.g. a spacer div with only `w-[X]` or `ml-[X]`). List them.
2. **Duplicate class patterns** — any set of classes that appears on 3+ slide wrappers and could be extracted to a shared parent via a CSS `> *` selector or a Tailwind component class. List them.
3. **Padding used for positioning** — any `pl-*`, `pr-*`, `px-*`, `ml-*`, `mr-*` applied to a slide's content div for the sole purpose of moving it away from the slide edge (rather than creating visual breathing room between sub-elements). List these by slide.

Write the audit findings as a comment block at the top of `returns2.astro` (below the frontmatter), like:

```astro
{/*
  LAYOUT AUDIT — returns2.astro
  Spacer divs found: [list]
  Duplicate wrapper patterns: [list]
  Positioning-padding found: [list by slide]
*/}
```

Do not make any edits yet — audit only.

---

### E4 — Step 4: Strip positioning padding and spacer divs

Working one slide at a time (use the `#region SLIDE-XX` markers), remove:

1. All `<div>` elements whose sole purpose is horizontal spacing (no content, no meaningful class other than `w-[X]`, `flex-shrink-0`, or similar spacer patterns).
2. All `pl-*`, `ml-*`, `pr-*`, `mr-*` classes on slide content wrappers that were positioning the block rather than providing internal breathing room.

**Do not remove:**
- Padding between sub-elements inside a content block (e.g. `mb-4` between a heading and a paragraph, `gap-4` between stat items)
- Any styling classes (colours, typography, opacity, animation classes, blend modes, filters)
- Any GSAP animation IDs (`id="roi-section"`, `id="success-section"`, etc.)
- The `#region` / `#endregion` folding markers

After stripping each slide, the content will likely be positioned at the left edge of the slide. That is correct — the grid will position it in the next step.

---

### E5 — Step 5: Build the CSS Grid system

#### The rule

Every desktop slide layout must use `display: grid` with fractional columns. No `absolute` positioning for layout (only for decorative/background elements). No padding for positioning.

#### Column conventions

- **Thirds** (`grid-cols-3`): standard for most content slides — left empty col, centre text col, right image col
- **Fifths** (`grid-cols-5`): for slides needing finer control (e.g. text at 2/5 with image spanning 3/5)
- **Sixths** (`grid-cols-6`): for very precise layout (e.g. text at 2/6, breathing room at 1/6 each side)
- **Single column** (`grid-cols-1`): for full-width text slides (e.g. Belief, Execution CTA)

#### Overlap pattern (text in front of image)

To place an image behind text without `absolute` positioning:

```html
<div class="grid grid-cols-3 h-full items-center">
  <!-- text block: col 2, row 1, sits on top -->
  <div class="col-start-2 row-start-1 z-10 relative">
    ...text...
  </div>
  <!-- image: col 2–3, row 1, sits behind -->
  <div class="col-start-2 col-span-2 row-start-1 z-0">
    ...image...
  </div>
</div>
```

Both elements share `row-start-1`. The `z-10` / `z-0` controls stacking.

#### Slide-by-slide grid plan

Implement each slide using this plan. The section widths (`w-[Xvw]`) are **kept exactly as they currently are** — do not change them.

| Slide region | Grid | Text placement | Image/graphic placement |
|---|---|---|---|
| SLIDE-00 Status | `grid-cols-3` | `col-start-2` | — |
| SLIDE-01 Context (woman image) | `grid-cols-2` | `col-start-2` | `col-start-1 col-span-2 row-start-1 z-0` (behind) |
| SLIDE-02 Architecture | `grid-cols-3` | `col-start-2 row-start-1 z-10` | `col-start-2 col-span-2 row-start-1 z-0` |
| SLIDE-03 Neurology / tiger | `grid-cols-3` | `col-start-2 row-start-1 z-10` | `col-start-2 col-span-2 row-start-1 z-0` |
| SLIDE-03.5 Brain speed stat | `grid-cols-3` | `col-start-2` | — |
| SLIDE-04 Neurology Memory | `grid-cols-3` | `col-start-2` | — |
| SLIDE-04.5 Memory stat | `grid-cols-3` | `col-start-2` | — |
| SLIDE-05 Metrics | `grid-cols-3` | `col-start-1 col-span-2` | — |
| SLIDE-06 Conversion text | `grid-cols-2` | `col-start-1 col-span-2` | — |
| SLIDE-06.5 ROI Counter | `grid-cols-3` | `col-start-2` | — |
| SLIDE-07 Credibility | `grid-cols-3` | `col-start-1 col-span-2` | — |
| SLIDE-07.5 Task success ring | `grid-cols-3` | `col-start-2` | — |
| SLIDE-09 Perception | `grid-cols-3` | `col-start-2` | — |
| SLIDE-08.5 SME | `grid-cols-3` | `col-start-2` | — |
| SLIDE-10 Culture | `grid-cols-3` | `col-start-1 col-span-2` | — |
| SLIDE-11 Asset Ownership | `grid-cols-3` | `col-start-1 col-span-2` | — |
| SLIDE-12 Belief | `grid-cols-1` | full width | — |
| SLIDE-13 Execution | `grid-cols-3` | `col-start-2 col-span-2` | — |

These are starting positions — dom will adjust column assignments after reviewing visually.

#### Grid wrapper pattern per slide

Replace each slide's outer desktop content wrapper (the `hidden lg:flex ...` div) with this pattern:

```html
<div class="hidden lg:grid grid-cols-3 h-full w-full items-center px-0">
  <!-- col 1: breathing room (empty) — or used for imagery -->
  <!-- col 2: primary text content -->
  <!-- col 3: secondary content or imagery -->
</div>
```

The `items-center` vertically centres all grid children. Do not add horizontal padding to the grid wrapper itself — padding goes inside individual cell divs only.

---

### E6 — Step 6: Internal cell padding

Once content is grid-positioned, add internal breathing room inside each cell:

- Text cells: `px-8 lg:px-12` for comfortable reading margins within the column
- Stat/counter cells (centred): `flex flex-col items-center text-center`
- Image cells: no padding — let images fill their column

This `px-8` is content breathing room, not positioning. It is always acceptable inside a cell.

---

### E7 — Step 7: Work slide by slide — do not batch

Implement one slide at a time. After each slide:
1. Confirm all GSAP IDs on that slide are preserved
2. Confirm `#region` / `#endregion` markers are preserved
3. Confirm no styling classes were removed
4. Move to the next slide

Do not implement all slides in one pass. If a slide's layout is ambiguous from the plan above, leave a `<!-- TODO: verify layout with dom -->` comment and move on.

---

### E8 — What NOT to touch

- The `<script>` block — all GSAP animations, ScrollTrigger setup, `scrollAt()` helper, sidebar logic, mobile detection. Touch nothing after the closing `</Layout>` tag's content div.
- The `#end-screen` div and its logo animation
- The `#scroll-track`, `#sidebar-track`, `#horizontal-strip` IDs and their structural roles
- Mobile content blocks (`lg:hidden` sections)
- Section `w-[Xvw]` widths
- Any `data-section` attributes
- All animation classes, colour classes, typography classes, blend mode classes

---

### E9 — After all slides are done

Add a comment at the bottom of the layout section (above `</Layout>`):

```astro
{/* returns2.astro — Grid layout rebuild complete. All slides use CSS Grid fractional columns. Review with dom before merging back to returns.astro. */}
```

Then stop. Do not merge back to `returns.astro` — dom will review `returns2.astro` first.

---

### E — Current State (as of 2026-05-28) — COMPLETED

**`returns2.astro` is live at `/returns2`.** All E1–E9 steps are done. Key facts for future edits:

**Layout.astro changes made:**
- `/returns2` is added to `isReturnsPage` — it gets the full-bleed wrapper (no `max-w-[1400px]`), no footer
- `showRain={!isLandingPage && !isReturnsPage}` — binary rain is disabled on both `/returns` and `/returns2`
- Do not revert either of these changes

**GSAP animations:**
- The `<script>` block in `returns2.astro` is an exact copy of `returns.astro`'s script
- All animations are calibrated to the 1600vh horizontal scroll track — `scrollAt()` fractions are correct
- `metricsSection.offsetLeft`, `roiSection.offsetLeft`, `successSection.offsetLeft` depend on section widths remaining unchanged — do not change any section `w-[Xvw]` values without recalibrating these

**Critical rule for grid edits:**
- The CSS Grid controls element **position and spacing only** — it must not change the **size** of individual elements
- Always preserve explicit size classes (`w-[Xvw]`, `h-[Xvh]`, `w-[Xpx]`) on elements within grid cells
- Example: SLIDE-02 Zone 3 SVG container retains `w-[80vw]` even though it sits in a `col-span-2` (100vw) grid cell — the element is 80vw, the cell is 100vw, and that is intentional
- Removing a `w-[Xvw]` from an element inside a grid cell causes it to stretch to fill the cell — that is a size change, not a spacing change

**Audit comment** is at the top of `returns2.astro` listing all positioning padding and spacer divs that were removed. Read it before making further changes.

---

## H. returns2.astro — Sidebar fixes + GSAP timing recalibration

**Status: PLANNED — review with dom before VS Code executes. Do one sub-section at a time, verify visually, then move on.**

---

### H1 — Remove sidebar entry 08 entirely (Success Ring slide gets no sidebar indicator)

**Decision changed from earlier draft:** dom wants the "08" sidebar entry removed completely (not relabelled) — it sits too close to "09 Perception" and looks bad. The Success Ring slide (SLIDE-7.5, `id="success-section"`, currently `data-sidebar="8"`) will simply have no `<aside>` indicator in `#sidebar-track`. The slide itself, its GSAP animations, and `id="success-section"` are untouched — only its sidebar entry disappears.

**Step 1 — Remove the array entry.** In the `sections` array at the top of `returns2.astro`, delete the `{ id: "08", label: "Credibility.Trust" }` entry entirely (do not replace it with anything).

**Step 2 — Renumber subsequent entries' display `id`s** so the sidebar numbering stays sequential (00–12, no gap):
```ts
{ id: "09", label: "Perception" },        →  { id: "08", label: "Perception" },
{ id: "10", label: "Culture" },           →  { id: "09", label: "Culture" },
{ id: "11", label: "Asset.Ownership" },   →  { id: "10", label: "Asset.Ownership" },
{ id: "12", label: "Belief" },            →  { id: "11", label: "Belief" },
{ id: "13", label: "Execution" },         →  { id: "12", label: "Execution" },
```
(`label` strings stay the same — only the `id` digits shift down by one.)

**Step 3 — Remove `data-sidebar="8"` from the success-section element.** Find:
```html
<section id="success-section" data-sidebar="8" class="hidden md:flex md:items-center w-[75vw] ...">
```
Change to:
```html
<section id="success-section" class="hidden md:flex md:items-center w-[75vw] ...">
```
Keep `id="success-section"` — it's a GSAP anchor, do not remove it.

**Why this is safe — no other `data-sidebar` values need to change:** The sidebar script builds `sidebarAsides` from the `sections` array (now 13 entries, in order) and `sidebarSections` from `document.querySelectorAll('[data-sidebar]')` sorted numerically by their `data-sidebar` value. After step 3, the sorted `data-sidebar` values are `0,1,2,3,4,5,6,7,9,10,11,12,13` — 13 elements — which now lines up positionally (index-for-index) with the 13-entry `sections` array. The mapping between asides and sections is purely positional (`sidebarAsides[i]` ↔ `sidebarSections[i]`), so the numeric gap at `8` in the DOM's `data-sidebar` attributes is harmless and **no other section's `data-sidebar="N"` attribute needs to be changed**.

**Step 4 — Update H3 below**: the "SLIDE-success/08" row in H3's anchor list (originally low-priority) is now moot — skip it, there is no sidebar entry/aside for this slide anymore.

Do this step first — trivial, low risk, but do it before H2/H3 since H3's slide list assumes the post-removal numbering doesn't affect anchor attributes (it doesn't — anchors are independent of `data-sidebar` values).

---

### H2 — Sidebar centering should track the content anchor, not the slide's geometric center

**The problem:** The indicator/aside-height calculation in the `<script>` block does:
```js
const centerH = sec.offsetLeft + sec.offsetWidth / 2 - window.innerWidth / 2;
```
This assumes the slide's *visual content* is centered within the slide's own box (`offsetWidth`). That was roughly true under the old layout, but with the new grid system several slides place their text well off the section's geometric center — e.g. SLIDE-11 is `w-[125vw]` with its text at `md:col-start-4 md:col-span-8` of 12, which centers the text around ~58% of the section's width, not 50%. The result: the sidebar indicator for "11" reaches its vertical mid-point at a scroll position where the section is geometrically centered, but the actual text content is already past centre — sidebar and content drift apart.

**The fix:** Add a `data-sidebar-anchor` attribute to the actual text/content wrapper div inside each `[data-sidebar]` section — the element that should be horizontally centered in the viewport when that sidebar item is "active". Then update the centering calculation to prefer the anchor:

```js
const sectionScrollPos = sidebarSections.map(sec => {
  const anchor = sec.querySelector('[data-sidebar-anchor]') as HTMLElement | null;
  const centerH = anchor
    ? sec.offsetLeft + anchor.offsetLeft + anchor.offsetWidth / 2 - window.innerWidth / 2
    : sec.offsetLeft + sec.offsetWidth / 2 - window.innerWidth / 2;
  return Math.max(0, (centerH / totalH) * totalV);
});
```

This relies on `anchor.offsetLeft` being relative to the section itself — true as long as the section element has `position: relative` (or `absolute`/`fixed`), which all `[data-sidebar]` sections already do (`relative` or `group relative` is present on every one). No structural change needed beyond adding the attribute.

`data-sidebar-anchor` has no effect on mobile (the sidebar/indicator code returns early when `isMobile` is true), so it's safe to add unconditionally to the desktop content wrapper in each slide.

---

### H3 — Add `data-sidebar-anchor` slide by slide

Add `data-sidebar-anchor` to the **outer text/content wrapper div** (the one with the `md:col-start-*` classes) in each of these slides. One slide at a time, verify the sidebar `aside` heights and indicator-line timing still look correct after each addition before moving to the next. **Start with SLIDE-11** (the one dom flagged), then SLIDE-03 (largest width change, 150vw→200vw), then the rest in numeric order:

- **SLIDE-11** (`data-sidebar="11"`, `w-[125vw]`) — the div `pl-8 md:pl-0 py-2 z-10 ... md:col-start-4 md:col-span-8 md:row-start-1`. **Priority — this is the one dom called out.**
- **SLIDE-03** (`data-sidebar="3"`, `w-[200vw]`) — the div `flex flex-col items-end ... md:col-start-3 md:col-span-4`.
- **SLIDE-00** (`data-sidebar="0"`, `w-[75vw]`) — the div `relative z-10 pl-8 md:pl-0 py-2 md:col-start-3 md:col-span-9`.
- **SLIDE-01** (`data-sidebar="1"`, `w-screen md:w-[66vw]`) — the div `w-full flex justify-center ... md:col-start-1 md:col-span-7`.
- **SLIDE-02** (`data-sidebar="2"`, `w-[100vw]`) — the div `hidden md:flex flex-col justify-center md:col-start-2 md:col-span-6 md:row-start-1 md:z-10`.
- **SLIDE-04** (`data-sidebar="4"`, `w-screen`) — the div `pl-8 md:pl-0 py-2 max-w-4xl ... md:col-start-3 md:col-span-8`.
- **SLIDE-05** (`data-sidebar="5"`, `w-[150vw]`) — the div `w-full max-w-5xl border-l-2 border-accent pl-8 py-2 md:col-start-3 md:col-span-9 md:row-start-1`.
- **SLIDE-06** (`data-sidebar="6"`, `w-screen md:w-[75vw]`) — the div `flex flex-col justify-center ... md:col-start-3 md:col-span-7 md:row-start-1`.
- **SLIDE-07** (`data-sidebar="7"`, `w-[75vw]`) — the div `flex flex-col justify-center ... md:col-start-4 md:col-span-8 md:row-start-1`.
- **SLIDE-success** (`id="success-section"`, no `data-sidebar` after H1, `w-[75vw]`) — no sidebar entry/aside anymore (removed in H1) — skip, anchor not needed.
- **SLIDE-09** (`data-sidebar="9"`, `w-screen`) — the div `pl-8 md:pl-0 py-2 max-w-4xl ... md:col-start-5 md:col-span-7 md:row-start-1`.
- **SLIDE-10** (`data-sidebar="10"`, `w-screen md:w-[125vw]`) — the div `relative z-10 pl-8 md:pl-0 py-2 md:col-start-4 md:col-span-6 md:row-start-1`.
- **SLIDE-12** (`data-sidebar="12"`, `w-screen md:w-[75vw]`) — the div `flex flex-col justify-center ... md:col-start-3 md:col-span-8 md:row-start-1`.
- **SLIDE-13** (`data-sidebar="13"`, `w-screen`) — the div `md:col-start-1 md:col-span-12 md:row-start-1 flex flex-col items-end justify-center`. Note: content inside is right-aligned (`items-end`), so the visual "centre of mass" of the text isn't necessarily the centre of this div — flag with `<!-- TODO: verify anchor against actual text position with dom -->` and check visually.

Do not change any `md:col-start-*` / `md:col-span-*` values as part of this — H3 only adds the `data-sidebar-anchor` attribute to existing elements.

---

### H4 — GSAP timing recalibration: snap animations to "enters right → resolved by mid-screen"

**The problem:** Several slide widths changed significantly from the original calibration (SLIDE-02: 150vw → 100vw, SLIDE-03: 150vw → 200vw, SLIDE-05: w-screen → 150vw, SLIDE-10: 66vw → 125vw, SLIDE-11: w-screen → 125vw). The animations below still use hardcoded `scrollAt(fraction)` values calibrated to the *old* total-track-width — they're now mistimed, generally firing too late relative to when their slide is on screen. This matches dom's observation that "most animations happen too long after the mid of screen."

**General rule going forward:** express each animation's trigger relative to its *own section's* position via `getScrollPos()`, not as a fraction of total track height — this makes timings self-correcting if widths change again later.

```js
const getScrollPos = (horizontalPos: number) => {
  const totalHorizontal = strip.scrollWidth - window.innerWidth;
  const totalVertical = track.offsetHeight - window.innerHeight;
  return (horizontalPos / totalHorizontal) * totalVertical;
};
```
This helper is currently redefined three separate times (inside the metrics, ROI, and success blocks). Hoist a single copy to just below where `scrollAt` is defined, near the top of `initStickyScroll`, and delete the three duplicates, reusing the shared one everywhere.

**Timing rule of thumb** (some variation per animation is fine):
- **Start**: roughly `section.offsetLeft - window.innerWidth * 0.9` — i.e. the section's left edge is just entering from the right edge of the viewport.
- **End**: roughly when the section's content anchor (the same `[data-sidebar-anchor]` element from H2/H3, where present) reaches the centre of the viewport: `section.offsetLeft + anchor.offsetLeft + anchor.offsetWidth / 2 - window.innerWidth / 2`. For slides with no meaningful anchor, `section.offsetLeft + window.innerWidth * 0.1` to `* 0.3` is a reasonable approximation.

**Animations to retime, in this order:**

1. **Train fade layer** (SLIDE-01, `#train-fade-layer`) — currently `scrollAt(0.07)` → `scrollAt(0.12)`. Add `const slide01 = document.querySelector('[data-sidebar="1"]') as HTMLElement;` and retime relative to `slide01.offsetLeft`.
2. **Data map nodes + paths** (SLIDE-02, `.data-node` / `.data-path`) — currently `scrollAt(0.11/0.13)` (nodes) and `scrollAt(0.12/0.17)` (paths). SLIDE-02 shrank from 150vw to 100vw — add `const slide02 = document.querySelector('[data-sidebar="2"]') as HTMLElement;` and retime relative to `slide02.offsetLeft`.
3. **Tiger focus layer** (SLIDE-03, `#tiger-focus-layer`) — currently `scrollAt(0.18/0.27)`. SLIDE-03 grew from 150vw to 200vw — add `const slide03 = document.querySelector('[data-sidebar="3"]') as HTMLElement;` and retime relative to `slide03.offsetLeft`, ending near its anchor centre.
4. **Visuals-fade / sound-grow text + vibration** (SLIDE-04, `#visuals-fade-text` / `#sound-grow-text`) — currently `scrollAt(0.27/0.32)`, `scrollAt(0.275/0.35)`, and the vibration `toggleActions` window `scrollAt(0.3/0.6)`. Add `const slide04 = document.querySelector('[data-sidebar="4"]') as HTMLElement;` and retime all three relative to `slide04.offsetLeft`.

Leave the metrics/ROI/success animations (`pressureLine`, stat-card fan, `roiTl`, success ring/counter) as-is for now — they already use the `getScrollPos(section.offsetLeft ± ...)` pattern and are self-correcting; only consolidate their duplicated `getScrollPos` definitions per the hoist above.

---

### H5 — Work order & guardrails

1. **H1** first (sidebar label) — trivial, zero risk.
2. **H2** (anchor-based centering mechanism in the script) + **H3** (add `data-sidebar-anchor` attributes), slide by slide, **SLIDE-11 first** as called out by dom, then SLIDE-03, then the rest in the order listed in H3. Verify sidebar `aside` heights and indicator-line timing after each slide.
3. **H4** last, one animation at a time in the order listed (train fade → data map → tiger focus → visuals/sound text). Verify each against the "enters right → resolved by mid-screen" rule before moving to the next.

**Do not, as part of this work:**
- Change any `w-[Xvw]` / `w-screen` section widths — H4 adapts to current widths, not the other way round.
- Remove or rename `id="roi-section"`, `id="success-section"`, `id="metrics-section"`, `#pressure-line`, `#tiger-focus-layer`, `#train-fade-layer`, `.data-node`, `.data-path`, `#visuals-fade-text`, `#sound-grow-text`.
- Touch the `isMobile` early-return branch or any `lg:hidden`/mobile content.
- Touch `#end-screen` logic.
- Change `md:col-start-*` / `md:col-span-*` grid placements — H3 only adds attributes.

---

### H6 — Sidebar track ends short of the page bottom (gap below "Execution")

**The problem:** `#sidebar-track` is `absolute left-0 top-0 w-24 h-full` — its height equals `#scroll-track`'s full height (`track.offsetHeight`). But the asides' heights are computed in the resize loop (around line ~921) purely from `sectionScrollPos`, which represents where each section's content is *centered* — not where the strip finishes scrolling. The last aside's height is sized so its center aligns with the last section's centered scroll position, which is always less than the track's full scrollable height (`totalV`). The sum of all aside heights (`cumTop`) therefore ends up shorter than `sidebarEl.offsetHeight`, leaving a visible gap of plain background below the final "12 / Execution" aside (visible in dom's screenshot).

**The fix:** After the existing resize loop that computes `cumTop`, stretch the last aside to fill any remaining space so the asides collectively reach exactly to the bottom of `#sidebar-track`. This is purely a height/visual fix — it does not change `sectionScrollPos`, indicator timing, or any centering math.

Find the resize loop (around line 921):
```js
let cumTop = 0;
sidebarAsides.forEach((aside, i) => {
  if (i >= sectionScrollPos.length) return;
  const targetDocCenter = sectionScrollPos[i] + window.innerHeight / 2;
  const height = Math.max(window.innerHeight * 0.5, 2 * (targetDocCenter - cumTop));
  aside.style.height = `${height}px`;
  cumTop += height;
});
```

Immediately after this loop, add:
```js
// Stretch the last aside so #sidebar-track's bottom aligns with #scroll-track's
// bottom — otherwise a gap of bare background appears below the final aside.
if (sidebarAsides.length) {
  const last = sidebarAsides[sidebarAsides.length - 1];
  const lastHeight = parseFloat(last.style.height);
  const remaining = sidebarEl.offsetHeight - (cumTop - lastHeight);
  if (remaining > lastHeight) {
    last.style.height = `${remaining}px`;
  }
}
```

This only ever *extends* the last aside (never shrinks it below its computed minimum), so the "12 / Execution" label and indicator line keep their existing vertical centering — there's just more empty space below them, closing the gap to the true bottom of the page.

**Risk: low, independent of H1–H5** — this can be applied at any point in the work order (before or after the others) since it only touches the trailing whitespace of the last aside. Verify after applying: scroll to the very bottom of `/returns2` and confirm `#sidebar-track`'s background extends flush to the bottom of `#end-screen`, with no gap or seam.

---

## I. NEXT SESSION — Centralised, responsive animation-timing variables (returns2.astro)

**Status: BOOKMARKED — not yet planned in detail. Pick up next session.**

**Context:** H1–H5 are done; H6 is queued/in progress (VS Code hit its limit mid-session). This is a separate, follow-on task for next session.

**The ask (from dom):** Create a set of variables/config that controls the timing of `returns2.astro`'s scroll-driven GSAP animations (start/end trigger points, durations, etc.) so dom can tune how each animation behaves from one place, rather than hunting through the `<script>` block.

Requirements to plan for:
- A single source of truth for per-animation timing (e.g. a `TIMING` config object near the top of the `<script>` block, or CSS custom properties consumed by the GSAP setup) — covers things like train fade, data-map draw, tiger focus, visuals-fade/sound-grow, pressure line, ROI counter, success ring, etc.
- Must remain **responsive across screen sizes** — not just a static fraction. As the viewport width changes (and therefore `strip.scrollWidth`, `totalH`, `totalV`, and each section's `offsetLeft`/`offsetWidth` change), the timing values need to recompute via the existing `getScrollPos()` / `scrollAt()` style math rather than being hardcoded pixels.
- Needs to account for breakpoints — i.e. the "do the maths" should re-run (or be recalculated) on resize, consistent with how `ScrollTrigger.refresh()` / the existing resize-driven sidebar recalculation already works.
- Should integrate with Tailwind where sensible (dom specifically asked about a "variable... inside Tailwind") — likely as CSS custom properties (`--anim-*` in `:root` or per-breakpoint via Tailwind's `theme.extend`) that the GSAP script reads, OR a typed JS/TS config object that's the single source of truth and Tailwind/CSS just reflects. Evaluate both approaches next session and recommend one.
- Scope: `returns2.astro` only (not `returns.astro`), consistent with all prior work in this file.

**Do not start implementing yet** — next session should begin by reviewing H6's completion status, then scope out this config system with dom before writing it into this file for VS Code.

---

### H7 — Extend sidebar into `#end-screen` with a "13 / Initiate" entry

**Goal:** The sidebar indicator continues visually into the final logo slide (`#end-screen`), giving it its own label and animated indicator line — so the sidebar runs the full height of the page with no gap.

**Why a separate element:** `#sidebar-track` is `absolute` inside `#scroll-track` and cannot physically extend into `#end-screen` (a sibling in document flow). Instead, add a visually identical sidebar strip *inside* `#end-screen` — same classes, same structure, seamlessly continuing the visual column.

#### Step 1 — Ensure `#end-screen` has `relative` positioning

Find:
```html
<div id="end-screen" class="h-svh bg-background ...">
```
Add `relative` to its class list if not already present:
```html
<div id="end-screen" class="relative h-svh bg-background ...">
```

#### Step 2 — Add sidebar strip inside `#end-screen`

As the **first child** of `#end-screen`, add:
```html
<div class="absolute left-0 top-0 w-24 h-full z-50 pointer-events-none hidden md:flex flex-col items-center justify-center gap-8 border-r border-border/20 bg-background/80 backdrop-blur-md shadow-[20px_0_40px_-15px_rgba(0,0,0,0.5)]">
  <span class="font-mono text-muted-foreground text-[10px] tracking-widest rotate-180 [writing-mode:vertical-lr] uppercase">Initiate</span>
  <div class="h-48 w-[1px] bg-border/30 relative">
    <div id="end-indicator-line" class="absolute top-0 w-[3px] -left-[1px] bg-accent shadow-[0_0_15px_hsl(var(--accent))] origin-top scale-y-0"></div>
  </div>
  <span class="font-mono text-accent text-[10px]">13</span>
</div>
```

The label "Initiate" and number "13" match the existing aside pattern exactly. Adjust the label text if dom prefers something else (e.g. "Build." or "Begin.").

#### Step 3 — Animate the indicator line via a vertical ScrollTrigger

In the `<script>` block, after the existing horizontal-strip GSAP setup, add:

```js
// End-screen sidebar indicator — normal vertical scroll trigger, independent of strip
const endScreen = document.getElementById('end-screen');
const endIndicator = document.getElementById('end-indicator-line');
if (endScreen && endIndicator) {
  gsap.to(endIndicator, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: endScreen,
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    }
  });
}
```

This triggers as the user scrolls vertically through `#end-screen` — completely separate from the horizontal strip ScrollTrigger, no interference with any existing animation.

**Do not touch:** `#end-logo`, the logo colour-shift animation, or the two CTA links inside `#end-screen`.

---

## I. NEXT SESSION — Centralised, responsive animation-timing variables (returns2.astro)

**Status: PARTIALLY DONE — read current state before writing any code.**

**Current state of `returns2.astro` (as of last VS Code run):**
- `getScrollPos` — hoisted to top of `initStickyScroll` ✓
- `slide01`–`slide04` element refs — added ✓
- All animations wired — using `TIMING.x.y` references ✓
- `TIMING` object — exists at top of `<script>` block (above `initStickyScroll`) ✓
- `sections` array in frontmatter — **still plain, no `width`, no `anim`** ✗
- `define:vars` bridge — **not added** ✗
- `applyWidths()` — **not added** ✗
- `COUNTERS` — **not added** ✗
- Hardcoded `w-[Xvw]` classes on section elements — **still present** ✗

**What VS Code must do now (Option B — full conversion):**
Steps I1 → I5 below. Do them in order. Do NOT redo the already-completed work (getScrollPos, slide refs, animation wiring structure).

**Approach:** Timing values live in the existing `sections` array at the top of the frontmatter (one place, easy to find), passed to the client script via a small `define:vars` bridge. The `TIMING` object in the script block gets removed and replaced by this frontmatter-driven approach.

**Why not CSS custom properties / Tailwind:** Scroll trigger positions are computed at runtime from live DOM measurements — CSS variables can't express them.

---

### I1 — Expand `sections` array to include width + timing + other tunables (frontmatter)

Replace the existing `sections` array at the top of `returns2.astro` with this expanded version. Every property dom might want to tweak without going deep into code lives here. The existing `sections.map(...)` HTML loop only reads `sec.id` and `sec.label` — all extra properties are ignored by it, so nothing in the sidebar rendering changes.

```ts
// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE CONFIG — edit widths, animation timings, and key values here.
// Do not edit anywhere else for these values.
//
// width:      desktop slide width (vw string). Mobile is always "100vw".
//             Changing this here automatically updates layout + GSAP timing.
//
// anim:       scroll-driven animation timing, as viewport-width multipliers
//             relative to each slide's left edge.
//             Negative = before slide enters screen (-0.9 = 90vw ahead of entry).
//             Positive = after slide left edge has passed viewport left edge.
//             Rule: start ≈ -0.9 (just entering right), end ≈ -0.2 to 0 (at mid-screen).
//             scrub: how elastic the animation feels on scroll (0.1 = snappy, 1 = laggy).
//
// counter:    for animated number values (ROI, success ring) — change the numbers here.
// ═══════════════════════════════════════════════════════════════════════════════
const sections = [
  { id: "00", label: "Status",               width: "75vw"  },
  { id: "01", label: "Context",              width: "66vw",  anim: {
    trainFade:   { start: -0.9,  end: -0.3,  scrub: 0.5 },
  }},
  { id: "02", label: "Architecture",         width: "100vw", anim: {
    nodes:       { start: -0.85, end: -0.55, scrub: 0.5 },
    paths:       { start: -0.75, end: -0.35, scrub: 0.5 },
  }},
  { id: "03", label: "Neurology.Processing", width: "200vw", anim: {
    tigerFocus:  { start: -0.8,  end:  0.1,  scrub: 0.5 },
  }},
  { id: "04", label: "Neurology.Memory",     width: "100vw", anim: {
    visualsFade: { start: -0.85, end: -0.2,  scrub: 0.5 },
    soundGrow:   { start: -0.8,  end: -0.1,  scrub: 0.5 },
    vibration:   { start: -0.5,  end:  1.0,  scrub: 0.5 },
  }},
  { id: "05", label: "Metrics",              width: "150vw" },
  { id: "06", label: "Conversion",           width: "75vw"  },
  { id: "07", label: "Credibility",          width: "75vw"  },
  { id: "08", label: "Perception",           width: "100vw" },
  { id: "09", label: "Culture",              width: "125vw" },
  { id: "10", label: "Asset.Ownership",      width: "125vw" },
  { id: "11", label: "Belief",               width: "75vw"  },
  { id: "12", label: "Execution",            width: "100vw" },
];

// Separate tunables for counter animations (not tied to a sidebar entry)
const COUNTERS = {
  roi:     { from: 1.0, to: 4.0, decimals: 1 },  // ROI counter: "1.0x → 4.0x"
  success: { to: 25 },                             // Success ring target: 25%
};
// ═══════════════════════════════════════════════════════════════════════════════
```

**Widths for interstitial slides** (no `data-sidebar`, desktop-only: SLIDE-0.5 woman image, SLIDE-3.5 brain speed, SLIDE-4.5 memory stat, SLIDE-6.5 ROI counter, SLIDE-7.5 success ring, SLIDE-8.5 SME) are left hardcoded in the template — these are less likely to need tweaking and are not driven by the sections array.

---

### I2 — Bridge frontmatter to client script

Astro frontmatter runs server-side; the `<script>` block is client-side. Add this inline script immediately before the existing `<script>` tag to pass both `sections` and `COUNTERS` across:

```astro
<script define:vars={{ sections, COUNTERS }} is:inline>
  window.__SECTIONS__ = sections;
  window.__COUNTERS__ = COUNTERS;
</script>
```

Do not modify the existing `<script>` tag itself.

### I2b — Remove hardcoded width classes from section elements (template only)

**This is a template-only change — no script edits here. All script additions are in I3.**

In the `returns2.astro` template, find every `<section data-sidebar="N" ...>` element and remove its hardcoded `md:w-[Xvw]` or `w-[Xvw]` Tailwind width class. Widths will be applied at runtime by `applyWidths()` (added in I3).

- Keep `w-screen` as the mobile baseline (or remove the width class entirely — `applyWidths()` sets `100vw` on mobile anyway).
- Do NOT remove widths from interstitial slides (those without `data-sidebar`) — they have no entry in `sections` config and must keep their hardcoded Tailwind widths.
- Do not change any other classes on these elements.

---

### I3 — Remove `TIMING` object, add `sectionConfig` + `anim()` helper

**First: delete the entire `TIMING` block** from the top of the `<script>` block (the `const TIMING = { ... } as const;` block and its surrounding comments — approximately 15 lines). This is replaced by the frontmatter-driven `sections` config.

**Then:** Near the top of `initStickyScroll`, immediately after `if (!strip || !track) return;` and before `const isMobile`, add:

```ts
// Read config from frontmatter (bridged via window.__SECTIONS__ / window.__COUNTERS__)
const sectionConfig = (window as any).__SECTIONS__ as Array<{
  id: string; label: string; width?: string;
  anim?: Record<string, { start: number; end: number; scrub?: number }>;
}>;
const counters = (window as any).__COUNTERS__ as { roi: { from: number; to: number; decimals: number }; success: { to: number } };

// Helper: get a single animation timing entry by slide id + key
const anim = (id: string, key: string) =>
  sectionConfig?.find(s => s.id === id)?.anim?.[key] ?? null;

// Apply desktop slide widths from config (mobile always 100vw)
const applyWidths = () => {
  sectionConfig?.forEach(sec => {
    if (!sec.width) return;
    const el = strip.querySelector(`[data-sidebar="${sec.id}"]`) as HTMLElement | null;
    if (!el) return;
    el.style.width = window.innerWidth >= 768 ? sec.width : '100vw';
  });
};
applyWidths();
window.addEventListener('resize', () => { applyWidths(); ScrollTrigger.refresh(); });
```

**Note:** `getScrollPos` and `slide01`–`slide04` are already in the file from the previous run — do NOT add them again.

**Note:** `applyWidths` must be placed BEFORE the `const isMobile` check so widths are set on both mobile and desktop.

---

### I4 — Wire timing into each animation

Replace each stale `scrollAt(fraction)` trigger. The `anim(id, key)` helper returns `{ start, end }` or `null` (falls back gracefully if the entry is missing from sections).

**Train fade** (`#train-fade-layer`, SLIDE-01):
```ts
const t01 = anim("01", "trainFade");
// in ScrollTrigger:
start: () => `${getScrollPos(slide01.offsetLeft + (t01?.start ?? -0.9) * window.innerWidth)}px top`,
end:   () => `${getScrollPos(slide01.offsetLeft + (t01?.end   ?? -0.3) * window.innerWidth)}px top`,
```

**Data map nodes** (`.data-node`, SLIDE-02):
```ts
const t02n = anim("02", "nodes");
start: getScrollPos(slide02.offsetLeft + (t02n?.start ?? -0.85) * window.innerWidth),
end:   getScrollPos(slide02.offsetLeft + (t02n?.end   ?? -0.55) * window.innerWidth),
```

**Data map paths** (`.data-path`, SLIDE-02):
```ts
const t02p = anim("02", "paths");
start: getScrollPos(slide02.offsetLeft + (t02p?.start ?? -0.75) * window.innerWidth),
end:   getScrollPos(slide02.offsetLeft + (t02p?.end   ?? -0.35) * window.innerWidth),
```

**Tiger focus** (`#tiger-focus-layer`, SLIDE-03):
```ts
const t03 = anim("03", "tigerFocus");
start: getScrollPos(slide03.offsetLeft + (t03?.start ?? -0.8) * window.innerWidth),
end:   getScrollPos(slide03.offsetLeft + (t03?.end   ??  0.1) * window.innerWidth),
```

**Visuals-fade text** (`#visuals-fade-text`, SLIDE-04):
```ts
const t04v = anim("04", "visualsFade");
start: getScrollPos(slide04.offsetLeft + (t04v?.start ?? -0.85) * window.innerWidth),
end:   getScrollPos(slide04.offsetLeft + (t04v?.end   ?? -0.2)  * window.innerWidth),
```

**Sound-grow text** (`#sound-grow-text`, SLIDE-04):
```ts
const t04s = anim("04", "soundGrow");
start: getScrollPos(slide04.offsetLeft + (t04s?.start ?? -0.8)  * window.innerWidth),
end:   getScrollPos(slide04.offsetLeft + (t04s?.end   ?? -0.1)  * window.innerWidth),
```

**Sound-grow vibration** (`toggleActions` trigger, SLIDE-04):
```ts
const t04vib = anim("04", "vibration");
start: getScrollPos(slide04.offsetLeft + (t04vib?.start ?? -0.5) * window.innerWidth),
end:   getScrollPos(slide04.offsetLeft + (t04vib?.end   ??  1.0) * window.innerWidth),
```

The `?? fallback` values mean removing an `anim` entry from `sections` never breaks the animation — it just reverts to the hardcoded default.

---

### I5 — Work order

1. Replace `sections` array with expanded version including `width`, `anim`, and add `COUNTERS` — frontmatter only (I1).
2. Add `define:vars` bridge inline script immediately before the `<script lang="ts">` tag (I2).
3. Remove hardcoded `md:w-[Xvw]` classes from every `<section data-sidebar="N">` element in the template (I2b). Do NOT touch interstitial slides.
4. In the `<script>` block: delete the `TIMING` object; add `sectionConfig`, `counters`, `anim()`, `applyWidths()`, and the resize listener — all immediately after `if (!strip || !track) return;`, before `const isMobile`. Do NOT re-add `getScrollPos` or `slide01`–`slide04` — they are already there (I3).
5. Replace all `TIMING.x.y` references with `anim("id","key")?.[field] ?? fallback` calls, one animation at a time (I4). Verify each against "enters right → resolved by mid-screen" rule.
6. Wire `counters.roi.from`/`counters.roi.to` into the ROI counter animation start/end values, and `counters.success.to` into the success ring target. Verify both animate correctly.
6. Wire `counters.roi.from/to` into the ROI counter animation (find `val: 0` start and `val: 100`/`4.0` end in `roiTl` and replace with `counters.roi.from` / `counters.roi.to`). Wire `counters.success.to` into the success ring/counter target value.
7. Resize window across breakpoints — widths, timings, and counter values should all stay correct.

**Do not touch:** metrics `pressureLine`, stat-card fan positioning logic — these use `innerWidth` offsets that are already section-relative and work correctly.

---

## J. Extended animation config — slides 05–13, word highlights, strip end

**All work on `returns2.astro` only. Follow the workflow: read CLAUDE.md → execute → verify — do not batch J steps.**

---

### J0 — Fix `applyWidths` selector bug (do this before any J1+ work)

**The problem:** `applyWidths()` queries `[data-sidebar="${sec.id}"]` where `sec.id` is zero-padded (e.g. `"05"`). But the DOM attributes are unpadded (`data-sidebar="5"`). Worse, after H1 removed the old entry 08, sections array positions 8–12 (ids `"08"`–`"12"`) correspond to DOM data-sidebar values `9`–`13` — not 8–12. So `applyWidths` silently does nothing for 5 of the 13 slides.

**The fix:** In `initStickyScroll`, move the `sidebarSections` definition to BEFORE `applyWidths` (currently it appears after, in the sidebar block). Then rewrite `applyWidths` to use positional index rather than id matching:

Find the existing `applyWidths` function (added in Section I) and replace it entirely:

```ts
// sidebarSections must be defined before applyWidths so positional matching works.
// Move this definition up from the sidebar block if it's currently defined later.
const sidebarSections = (Array.from(strip.querySelectorAll('[data-sidebar]')) as HTMLElement[])
  .sort((a, b) => parseInt(a.dataset.sidebar!) - parseInt(b.dataset.sidebar!));

const applyWidths = () => {
  sectionConfig?.forEach((sec, i) => {
    if (!sec.width) return;
    const el = sidebarSections[i] as HTMLElement | null;
    if (!el) return;
    el.style.width = window.innerWidth >= 768 ? sec.width : '100vw';
  });
};
applyWidths();
window.addEventListener('resize', () => { applyWidths(); ScrollTrigger.refresh(); });
```

Then find the existing `sidebarSections` definition in the sidebar block (around line 976) and remove it — it is now defined above and should not be re-declared.

---

### J1 — Expand `sections` array in frontmatter (slides 05 and 06)

In the frontmatter `sections` array, replace the existing entries for `"05"` and `"06"` with these expanded versions (add the `anim` field, keep everything else the same):

```ts
{ id: "05", label: "Metrics", width: "150vw", anim: {
  // pressureLine: the horizontal bar that draws across the section as it enters
  pressureLine: { start: -0.4, end: -0.1, scrub: 0.5 },
  // statCards: how far apart the cards fan (px between each card)
  // start/end: when the fan begins and fully opens
  statCards: { start: -0.2, end: -0.5, scrub: 1, cardSpacing: 300 },
}},
{ id: "06", label: "Conversion", width: "75vw", anim: {
  // roiGrow: the "ROI." word in SLIDE-06 grows with scroll as the slide enters
  roiGrow: { start: -0.8, end: 0.3, scrub: 0.5 },
}},
```

Note on `statCards.end`: the negative value means "before the section's left edge is centred" which, combined with the dynamic `maxDealDistance` calculation, gives you a start point. The actual end scroll position is computed dynamically in the script from the physical card spread — the `end` multiplier here only affects the starting trigger point. See J5.

---

### J2 — Expand `COUNTERS` to include timing

Replace the existing `COUNTERS` object in frontmatter with:

```ts
const COUNTERS = {
  roi: {
    from: 1.0, to: 4.0, decimals: 1,
    // timing: scroll window relative to roi-section's left edge (vw multipliers)
    // negative = before the section enters screen; positive = after section left edge passes viewport left
    start: -0.3,   // counter starts when roi-section is 30% of a vw before its left edge
    end: 0.6,      // counter finishes when roi-section has scrolled 60% of a vw past screen left
    scrub: 1,      // 1 = smooth elastic follow; true = exact 1:1
  },
  success: {
    to: 25,
    start: 0.25,   // ring starts filling when section is 25% of a vw past screen left
    end: 0.95,     // ring reaches target at 95% of a vw past screen left
    scrub: 1,
  },
};
```

---

### J3 — Add `HIGHLIGHTS` config for word colour animations

Add below `COUNTERS` in frontmatter:

```ts
// Word highlight config — words that shift colour AND scale subtly as the slide scrolls in.
// 'words' must match the id="" values added to <span> elements in the template (without "hl-" prefix).
// start/end: vw multipliers relative to the slide's left edge (same convention as anim entries).
// scale: subtle grow multiplier. 1.05 = 5% larger at peak. Keep between 1.03–1.1.
// scaleOnly: if true, animate scale only (no colour change) — for words already in accent colour.
const HIGHLIGHTS = {
  // SLIDE-8.5 (SME/Untapped) — 5 targets, staggered by index
  untapped: {
    words: ["untapped", "opportunity-heading", "loyalty", "purchasing", "opportunity-cta"],
    start: -0.85, end: 0.3, scrub: 0.5,
    scale: 1.05,
    // "opportunity-cta" is already text-accent — mark it scale-only
    scaleOnly: ["opportunity-cta"],
  },
  // SLIDE-12 (Belief) — "Believe" and "power" shift to primary on accent background
  belief: {
    words: ["believe", "power"],
    start: -0.8, end: -0.2, scrub: 0.5,
    scale: 1.05,
    scaleOnly: [],
  },
};
```

---

### J4 — Add `CONFIG` for strip end offset

Add below `HIGHLIGHTS` in frontmatter:

```ts
// Global config — tune values that affect the overall scroll experience.
const CONFIG = {
  // stripEndOffset (pixels): how many px short of full horizontal travel the strip parks.
  // Goal: SLIDE-13 "Master the Signal." heading is centred in viewport when vertical scroll takes over.
  // Start at 0 and increase in increments of 100px until the heading feels centred.
  // Typical range: 200–600px depending on how much of SLIDE-13 you want in view.
  stripEndOffset: 0,
};
```

---

### J4b — Update the `define:vars` bridge to pass HIGHLIGHTS and CONFIG

Find the existing inline bridge script (added in Section I2):
```astro
<script define:vars={{ sections, COUNTERS }} is:inline>
  window.__SECTIONS__ = sections;
  window.__COUNTERS__ = COUNTERS;
</script>
```
Replace with:
```astro
<script define:vars={{ sections, COUNTERS, HIGHLIGHTS, CONFIG }} is:inline>
  window.__SECTIONS__ = sections;
  window.__COUNTERS__ = COUNTERS;
  window.__HIGHLIGHTS__ = HIGHLIGHTS;
  window.__CONFIG__ = CONFIG;
</script>
```

---

### J4c — Add `stripTravel` to script and wire CONFIG

In the main `<script>` block, immediately after `const config = (window as any).__CONFIG__` (add this line if not present), compute `stripTravel` and use it everywhere `strip.scrollWidth - window.innerWidth` currently appears:

**Step 1 — Read config and compute stripTravel.** Add these lines immediately after `if (!strip || !track) return;`:

```ts
const config = (window as any).__CONFIG__ as { stripEndOffset: number };
const highlights = (window as any).__HIGHLIGHTS__;
```

**Step 2 — Update `getScrollPos`.** Find the existing `getScrollPos` function and update the `totalHorizontal` line:
```ts
const getScrollPos = (horizontalPos: number) => {
  const totalHorizontal = strip.scrollWidth - window.innerWidth - (config?.stripEndOffset ?? 0);
  const totalVertical = track.offsetHeight - window.innerHeight;
  return (horizontalPos / totalHorizontal) * totalVertical;
};
```

**Step 3 — Update the strip x-animation.** Find:
```ts
gsap.to(strip, {
  x: () => -(strip.scrollWidth - window.innerWidth),
```
Change to:
```ts
gsap.to(strip, {
  x: () => -(strip.scrollWidth - window.innerWidth - (config?.stripEndOffset ?? 0)),
```

Also update the `totalH` variable in the sidebar block if it uses the same expression:
```ts
const totalH = strip.scrollWidth - window.innerWidth - (config?.stripEndOffset ?? 0);
```

---

### J5 — Wire metrics timing to `anim()` config

In the script, find the metrics animation block (`if (metricsSection && pressureLine && statCards.length > 0)`).

**Add a slide reference before the block:**
```ts
const slide05 = document.querySelector('[data-sidebar="5"]') as HTMLElement;
const t05pl = anim("05", "pressureLine");
const t05sc = anim("05", "statCards");
```

**Update pressureLine trigger** (currently uses hardcoded `-0.4` and `-0.1`):
```ts
start: () => `${getScrollPos(metricsSection.offsetLeft + (t05pl?.start ?? -0.4) * window.innerWidth)}px top`,
end:   () => `${getScrollPos(metricsSection.offsetLeft + (t05pl?.end   ?? -0.1) * window.innerWidth)}px top`,
scrub: t05pl?.scrub ?? true,
```

**Update statCards timeline trigger** (currently uses hardcoded `-0.2` for start):
```ts
start: () => `${getScrollPos(metricsSection.offsetLeft + (t05sc?.start ?? -0.2) * window.innerWidth)}px top`,
// end stays dynamic — it's computed from maxDealDistance, keep as-is
```

**Update cardOffset** — replace the hardcoded `300`:
```ts
const cardOffset = (t05sc as any)?.cardSpacing ?? 300;
```

---

### J6 — Add SLIDE-06 ROI text growth animation

The `#roi-word` element in SLIDE-06 currently scales as part of `roiTl` (which triggers on SLIDE-6.5's position). Add a separate, independent animation that drives scale from SLIDE-06's own scroll position, so the word starts growing as SLIDE-06 enters:

**Add a slide reference (after slide04, alongside slide05):**
```ts
const slide06 = document.querySelector('[data-sidebar="6"]') as HTMLElement;
const t06r = anim("06", "roiGrow");
```

**Add animation block after the train fade or data-map animations:**
```ts
// SLIDE-06: "ROI." word grows as the Conversion slide enters
const roiWordEl = document.getElementById('roi-word');
if (slide06 && roiWordEl) {
  gsap.fromTo(roiWordEl,
    { scale: 0.4, opacity: 0.3 },
    {
      scale: 1, opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: track,
        start: () => `${getScrollPos(slide06.offsetLeft + (t06r?.start ?? -0.8) * window.innerWidth)}px top`,
        end:   () => `${getScrollPos(slide06.offsetLeft + (t06r?.end   ??  0.3) * window.innerWidth)}px top`,
        scrub: t06r?.scrub ?? 0.5,
      }
    }
  );
}
```

Note: this animation resolves `scale: 1, opacity: 1` — meaning when SLIDE-6.5 fires `roiTl` and also animates `roi-word`, the two will co-exist. The SLIDE-06 animation completes first (arrives at 1.0/1.0) and then roiTl can re-scale it from 0.5→1.0 again as the counter fires. If this double-fires looks wrong, set `overwrite: "auto"` on the roiTl.fromTo for roiWord.

---

### J7 — Wire COUNTERS timing into ROI counter and success ring

**ROI counter (`roiTl`):** Find:
```ts
start: () => `${getScrollPos(roiSection.offsetLeft - window.innerWidth * 0.3)}px top`,
end: () => `${getScrollPos(roiSection.offsetLeft + window.innerWidth * 0.6)}px top`,
scrub: 1,
```
Replace with:
```ts
start: () => `${getScrollPos(roiSection.offsetLeft + counters.roi.start * window.innerWidth)}px top`,
end:   () => `${getScrollPos(roiSection.offsetLeft + counters.roi.end   * window.innerWidth)}px top`,
scrub: counters.roi.scrub ?? 1,
```

**Success ring/counter:** Find:
```ts
const startTrigger = () => `${getScrollPos(successSection.offsetLeft + window.innerWidth * 0.25)}px top`;
const endTrigger = () => `${getScrollPos(successSection.offsetLeft + window.innerWidth * 0.95)}px top`;
```
Replace with:
```ts
const startTrigger = () => `${getScrollPos(successSection.offsetLeft + counters.success.start * window.innerWidth)}px top`;
const endTrigger   = () => `${getScrollPos(successSection.offsetLeft + counters.success.end   * window.innerWidth)}px top`;
```
And update the `scrub` on both the ring and counter ScrollTriggers to `counters.success.scrub ?? 1`.

---

### J8 — Template: add ids for word highlight targets

**SLIDE-8.5 (SME/Untapped):** `id="slide-sme"` is already on the section element (added in an earlier run). Make the following span changes inside it. Every span that will be scaled must also have `inline-block` — inline elements can't be scaled with GSAP.

**Heading line** — currently:
```html
An <span id="hl-untapped">untapped</span> opportunity for SME's
```
Change to:
```html
An&nbsp;<span id="hl-untapped" class="inline-block">untapped</span>&nbsp;<span id="hl-opportunity-heading" class="inline-block">opportunity</span>&nbsp;for SME's
```

**Why `&nbsp;`:** The `h3` has `class="flex items-start"`. Flex containers collapse whitespace between child nodes — regular space characters between "An", the span, and "opportunity" vanish, merging the words. `&nbsp;` (non-breaking space) is a real character, not whitespace, so flex preserves it. This is the only heading change; do not alter any other text or classes.

**"loyalty"** — currently:
```html
<span class="text-foreground text-lg">loyalty </span>
```
Change to:
```html
<span id="hl-loyalty" class="text-foreground text-lg inline-block">loyalty</span>
```

**"purchasing decisions"** — currently:
```html
<span class="text-foreground text-lg">purchasing decisions</span>
```
Change to:
```html
<span id="hl-purchasing" class="text-foreground text-lg inline-block">purchasing decisions</span>
```

**"That's an opportunity."** — currently:
```html
<span class="text-accent text-sm">That's an opportunity.</span>
```
Change to:
```html
<span id="hl-opportunity-cta" class="text-accent text-sm inline-block">That's an opportunity.</span>
```
Note: this span is already `text-accent` — the GSAP animation will scale it only, not change its colour.

**SLIDE-12 (Belief, `data-sidebar="12"`):** The existing spans already have `class="text-background/50"`. Add `id` and `inline-block`:
```html
<!-- Find: -->
<span class="text-background/50">Believe</span>
<!-- Change to: -->
<span id="hl-believe" class="text-background/50 inline-block">Believe</span>

<!-- Find: -->
<span class="text-background/50">power</span>
<!-- Change to: -->
<span id="hl-power" class="text-background/50 inline-block">power</span>
```

---

### J9 — Add word highlight GSAP animations (colour + subtle scale)

After all existing animations, add the word highlight animations. Each targeted word grows subtly and shifts colour as its slide scrolls into view. Words stagger slightly so they reveal in sequence rather than all at once.

```ts
// WORD HIGHLIGHTS — subtle scale + colour shift as each word's slide scrolls into view
if (highlights) {

  const animateWords = (
    slideEl: HTMLElement | null,
    cfg: {
      words: string[];
      start: number;
      end: number;
      scrub: number;
      scale?: number;
      scaleOnly?: string[];
    },
    fromColour: string,
    toColour: string
  ) => {
    if (!slideEl) return;
    const peakScale = cfg.scale ?? 1.05;
    const scaleOnlyIds = cfg.scaleOnly ?? [];

    cfg.words.forEach((word, i) => {
      const el = document.getElementById(`hl-${word}`);
      if (!el) return;

      // Stagger: each subsequent word starts slightly later in the scroll window
      const stagger = i * 0.07 * window.innerWidth;
      const isScaleOnly = scaleOnlyIds.includes(word);

      // Scale + colour (or scale-only for words already in the target colour)
      gsap.fromTo(el,
        {
          scale: 1,
          ...(isScaleOnly ? {} : { color: fromColour }),
        },
        {
          scale: peakScale,
          ease: "power1.out",
          ...(isScaleOnly ? {} : { color: toColour }),
          scrollTrigger: {
            trigger: track,
            start: () => `${getScrollPos(slideEl.offsetLeft + cfg.start * window.innerWidth + stagger)}px top`,
            end:   () => `${getScrollPos(slideEl.offsetLeft + cfg.end   * window.innerWidth + stagger)}px top`,
            scrub: cfg.scrub ?? 0.5,
          }
        }
      );
    });
  };

  // SLIDE-8.5 (SME/Untapped) — 5 words, staggered
  const slideSme = document.getElementById('slide-sme') as HTMLElement | null;
  if (highlights.untapped) {
    animateWords(
      slideSme,
      highlights.untapped,
      'hsl(var(--foreground) / 0.5)',   // from: muted
      'hsl(var(--accent))'              // to: accent amber
    );
  }

  // SLIDE-12 (Belief) — bg-accent background, so use background/50 → primary
  const slide12 = document.querySelector('[data-sidebar="12"]') as HTMLElement | null;
  if (highlights.belief) {
    animateWords(
      slide12,
      highlights.belief,
      'hsl(var(--background) / 0.5)',   // from: faded (matches existing text-background/50 class)
      'hsl(var(--primary))'             // to: cyan — readable on amber background
    );
  }
}
```

**Note on `ease: "power1.out"`:** With `scrub` enabled, easing on scrubbed animations is effectively ignored (scrub overrides the playhead). The ease only affects how the animation plays when `scrub: false`. It's included here for completeness but won't change the scrubbed behaviour. If the effect feels too abrupt, widen the `start`/`end` gap in HIGHLIGHTS config rather than changing the ease.

**Note on `"That's an opportunity."` (id `hl-opportunity-cta`):** Listed in `scaleOnly` in the HIGHLIGHTS config, so it will scale 1→1.05 only — no colour change since it's already `text-accent`. This gives it a subtle "landing" feel without fighting its existing style.

---

### J10 — Work order

1. **J0** — Fix `applyWidths` selector (move `sidebarSections` definition up, switch to positional index). Remove the now-duplicate `sidebarSections` definition from the sidebar block. Verify slide widths still apply correctly at 1440px.
2. **J1** — Add `anim` entries to sections `"05"` and `"06"` in frontmatter.
3. **J2** — Expand `COUNTERS` with `start`, `end`, `scrub` for both roi and success.
4. **J3** — Add `HIGHLIGHTS` config to frontmatter.
5. **J4** — Add `CONFIG` with `stripEndOffset: 0` to frontmatter.
6. **J4b** — Update `define:vars` bridge to pass HIGHLIGHTS and CONFIG.
7. **J4c** — Add `config` and `highlights` vars to script; update `getScrollPos` to use `stripEndOffset`; update strip x-animation; update `totalH` in sidebar block.
8. **J5** — Add `slide05`, `t05pl`, `t05sc` refs; update pressureLine trigger; update statCards start trigger; replace hardcoded `300` with `t05sc?.cardSpacing ?? 300`.
9. **J6** — Add `slide06`, `t06r` refs; add roiGrow animation for `#roi-word`.
10. **J7** — Wire `counters.roi.start/end/scrub` into roiTl ScrollTrigger; wire `counters.success.start/end/scrub` into success ring/counter triggers.
11. **J8** — Add `id="slide-sme"` to SLIDE-8.5 section; add `id="hl-untapped"` around "untapped" in heading; add `id="hl-believe"` and `id="hl-power"` to existing spans in SLIDE-12.
12. **J9** — Add `animateWords` helper and both word-highlight animation calls after all existing animations.

**Do not touch:** the `roiTl` counter value targets (`.roi.from`/`.roi.to` already wired from I5), success ring's `counters.success.to` target, mobile content blocks, any GSAP easing values, colours, typography, or `returns.astro`.

---

## J11 — Fix incomplete J3/J8 implementation: wire up all 5 highlight words

**What VS Code did:** Only `"untapped"` was added to `HIGHLIGHTS.untapped.words`, and only the heading's `hl-untapped` span was touched. The other four highlight targets — `loyalty`, `purchasing decisions`, `That's an opportunity`, and the second heading word `opportunity` — have no `id` attributes and are absent from the config. The `animateWords` helper is already in place in the script and will handle all words automatically once they have IDs and are listed in the config. Two changes needed: frontmatter config and template spans.

---

### J11a — Fix `HIGHLIGHTS` frontmatter config

Find in frontmatter (the `untapped` block only has one word currently):
```ts
const HIGHLIGHTS = {
  untapped: {
    words: ["untapped"],
    start: -0.8, end: -0.1, scrub: 0.5,
  },
```
Replace the entire `untapped` entry with:
```ts
const HIGHLIGHTS = {
  untapped: {
    words: ["untapped", "opportunity-heading", "loyalty", "purchasing", "opportunity-cta"],
    start: -0.85, end: 0.3, scrub: 0.5,
    scale: 1.05,
    scaleOnly: ["opportunity-cta"],  // already text-accent — scale only, no colour change
  },
```
Keep the `belief` entry unchanged.

---

### J11b — Fix heading in SLIDE-8.5 (add `&nbsp;` + second span)

Find (line ~690 in the template):
```html
An <span id="hl-untapped">untapped</span> opportunity for SME's
```
Replace with:
```html
An&nbsp;<span id="hl-untapped" class="inline-block">untapped</span>&nbsp;<span id="hl-opportunity-heading" class="inline-block">opportunity</span>&nbsp;for SME's
```

**Critical:** Use `&nbsp;` (the literal entity string, not a regular space) between "An" and the first span, between the two spans, and between the second span and "for". The `h3` is `flex items-start` — regular space characters between flex children are collapsed to zero. `&nbsp;` is a real character and is preserved. Do not use regular spaces or the words will concatenate again.

Also add `class="inline-block"` to the existing `hl-untapped` span (it currently has no classes). The `id` is already there — just add the class.

---

### J11c — Add `id` and `inline-block` to body copy spans in SLIDE-8.5

In the body copy of SLIDE-8.5 (line ~693), there is a single long `<span>` containing the paragraph text. Inside it, find and update these three child spans:

**"loyalty"** — find:
```html
<span class="text-foreground text-lg">loyalty </span>
```
Change to:
```html
<span id="hl-loyalty" class="text-foreground text-lg inline-block">loyalty</span>
```
(Remove the trailing space inside the span text — it's now outside the element.)

**"purchasing decisions"** — find:
```html
<span class="text-foreground text-lg">purchasing decisions</span>
```
Change to:
```html
<span id="hl-purchasing" class="text-foreground text-lg inline-block">purchasing decisions</span>
```

**"That's an opportunity."** — find:
```html
<span class="text-accent text-sm">That's an opportunity.</span>
```
Change to:
```html
<span id="hl-opportunity-cta" class="text-accent text-sm inline-block">That's an opportunity.</span>
```

Do not touch any other text, classes, or elements in this line.

---

### J11d — Update `animateWords` call to pass `scale` and `scaleOnly`

The `animateWords` function signature in the script currently reads:
```ts
const animateWords = (
  slideEl: HTMLElement | null,
  cfg: { words: string[]; start: number; end: number; scrub: number },
```
This is missing `scale` and `scaleOnly` from the type. Update to:
```ts
const animateWords = (
  slideEl: HTMLElement | null,
  cfg: { words: string[]; start: number; end: number; scrub: number; scale?: number; scaleOnly?: string[] },
```
And inside the function body, where `gsap.fromTo` is called, replace the hardcoded `scale: 1.05` with:
```ts
const peakScale = cfg.scale ?? 1.05;
const scaleOnlyIds = cfg.scaleOnly ?? [];
```
Then in the `fromTo`:
- `from`: `{ scale: 1, ...(scaleOnlyIds.includes(word) ? {} : { color: fromColour }) }`
- `to`: `{ scale: peakScale, ...(scaleOnlyIds.includes(word) ? {} : { color: toColour }), ... }`

If the `animateWords` function body already contains `peakScale` and `scaleOnlyIds` logic from J9, skip this step — just update the type signature.

---

### J11 Work order

1. **J11a** — Update `HIGHLIGHTS.untapped.words` to include all 5 words, add `scale` and `scaleOnly` properties.
2. **J11b** — Replace heading line with `&nbsp;` entities and `hl-opportunity-heading` span. Add `class="inline-block"` to existing `hl-untapped`.
3. **J11c** — Add `id` + `inline-block` to the three body copy spans.
4. **J11d** — Update `animateWords` type + body to handle `scale`/`scaleOnly` if not already present.

Verify at `/returns2`: scroll to SLIDE-8.5 and confirm "untapped", "opportunity", "loyalty", "purchasing decisions", and "That's an opportunity." all shift colour (except the last which is already accent and only scales). The heading must read `An untapped opportunity for SME's` with spaces between all words.

---

## K. Scroll smoothness + counter accuracy fixes

**Priority — fix these before tuning any J-section timing values. All work on `returns2.astro` only.**

---

### K1 — Counter scrub must be `true`, not a number

**The problem:** Both counters (`roi` and `success`) are configured with `scrub: 1` in `COUNTERS`. A numeric scrub means the animation permanently lags behind scroll by that many seconds. When the user's scroll position reaches the `end` trigger, the counter is still catching up. If the user has scrolled past it, the counter freezes wherever it is and never resolves to its target (`4.0x`, `25%`). This is visible in the screenshots — counter stops at `3.7x` and `24%`.

**The fix:** In `COUNTERS` in the frontmatter, change `scrub` to `true` for both counters:

```ts
const COUNTERS = {
  roi: {
    from: 1.0, to: 4.0, decimals: 1,
    start: -0.3, end: 0.6,
    scrub: true,   // ← was 1, must be true. Numbers cause lag; true = exact 1:1, always reaches target.
  },
  success: {
    to: 25,
    start: 0.25, end: 0.95,
    scrub: true,   // ← was 1, must be true.
  },
};
```

**Rule for future:** `scrub: true` (or `scrub: 1`) is for visual animations where lag feels natural. For any animation that drives a number display (counter, percentage, progress ring fill), always use `scrub: true` so the displayed value is always exactly where the scroll says it should be. The user can scroll slowly through the section and watch the number count precisely.

---

### K2 — Add `will-change: transform` to `#horizontal-strip`

**The problem:** The browser is not GPU-compositing the horizontal strip's translation. Without `will-change: transform`, the browser repaints the entire strip on every scroll event, causing jank — especially with the many GSAP-animated children inside it.

**The fix:** In the template, find `#horizontal-strip`:
```html
<div id="horizontal-strip" class="flex h-full">
```
Add `will-change: transform` via an inline style or Tailwind's `[will-change:transform]`:
```html
<div id="horizontal-strip" class="flex h-full [will-change:transform]">
```

---

### K3 — Add `invalidateOnRefresh: true` to all dynamic ScrollTriggers

**The problem:** Every ScrollTrigger that uses `start: () => ...` or `end: () => ...` (i.e. a function, not a string) must have `invalidateOnRefresh: true`. Without it, GSAP evaluates the function once on init and caches the result. If `strip.scrollWidth` changes after init (images finish loading, fonts render, etc.), the cached pixel values are wrong and the strip snaps or jerks when ScrollTrigger finally recalculates.

**The fix:** Add `invalidateOnRefresh: true` to every ScrollTrigger block that has a function-based `start` or `end`. This includes all of the following animation blocks in `returns2.astro`:
- The main strip `x` animation (the master horizontal scroll driver)
- `#train-fade-layer` ScrollTrigger
- `.data-node` ScrollTrigger
- `.data-path` ScrollTrigger
- `#tiger-focus-layer` ScrollTrigger
- `#visuals-fade-text` ScrollTrigger
- `#sound-grow-text` ScrollTrigger
- Sound vibration `toggleActions` ScrollTrigger
- `pressureLine` ScrollTrigger
- `cardTimeline` ScrollTrigger
- `roiTl` ScrollTrigger
- Success ring ScrollTrigger
- Success counter ScrollTrigger
- `#roi-word` roiGrow ScrollTrigger (if added in J6)

In each, add `invalidateOnRefresh: true` alongside the other ScrollTrigger properties:
```ts
scrollTrigger: {
  trigger: track,
  start: () => `...`,
  end: () => `...`,
  scrub: ...,
  invalidateOnRefresh: true,  // ← add this line
}
```

Do not add it to ScrollTriggers with static string `start`/`end` values (e.g. the end-screen logo animation, the end-screen indicator line) — `invalidateOnRefresh` only matters for function-based triggers.

---

### K4 — Debounce the resize listener

**The problem:** The current resize listener calls `applyWidths()` and `ScrollTrigger.refresh()` synchronously on every `resize` event. Window resize fires continuously while dragging — this triggers dozens of full GSAP recalculations per second during a resize, locking up the main thread.

**The fix:** Wrap the resize listener in a debounce:

Find:
```ts
window.addEventListener('resize', () => { applyWidths(); ScrollTrigger.refresh(); });
```
Replace with:
```ts
let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    applyWidths();
    ScrollTrigger.refresh();
  }, 150);
});
```

150ms debounce means the recalculation fires 150ms after the resize stops — invisible to the user, but prevents the main-thread lockup.

---

### K5 — Work order

1. **K1** — Change `scrub: true` in COUNTERS frontmatter (one-line change). Verify counters reach exactly `4.0x` and `25%` when their end trigger is passed.
2. **K2** — Add `[will-change:transform]` to `#horizontal-strip` in the template. Hard refresh and check scroll smoothness.
3. **K3** — Add `invalidateOnRefresh: true` to every function-based ScrollTrigger, working through the list above in order. This is mechanical — do not change any other properties.
4. **K4** — Replace the resize listener with the debounced version.

Verify after each step — K1 and K2 have the biggest impact and can be confirmed quickly.

---

## L. global.css — Remove dead multi-theme CSS

**Context:** The site is dark-only. A multi-theme system (solaris-architect, mono-light, palette-retro, tech-solaris, retro-camp, jade-architect) was built and then abandoned. None of these theme class names are applied anywhere in the codebase — no component, layout, or page ever adds them to the DOM. The CSS is dead weight.

**File:** `src/styles/global.css` only. No other files need changing.

---

### L1 — Delete `.theme-solaris-architect header` block

Find and delete this entire block (approximately lines 196–209):

```css
.theme-solaris-architect header {
  /* 1. Make the paint slightly more transparent so the filter is visible */
  background-color: hsl(var(--background) / 0.65) !important;
  
  /* 2. THE MAGIC COMBINATION:
     - blur(12px): The frosted glass look you like.
     - brightness(2): Forces dark sections (Sepia) to appear bright/washed out behind the glass.
     - saturate(0.5): Desaturates the brown slightly to reduce visual noise.
  */
  backdrop-filter: blur(12px) brightness(2) saturate(0.5);
  
  /* Smooth transition for when you switch themes */
  transition: all 0.5s ease;
}
```

Delete the entire block. Do not touch `.section-inverted` or anything before/after it.

---

### L2 — Delete `.theme-solaris-architect &` nested block inside `.section-inverted`

Inside the `.section-inverted { }` block, find and delete only the nested theme override (approximately lines 220–240):

```css
.theme-solaris-architect & {
  --background: 40 19% 14%; 
  --foreground: 51 29% 92%;
  --muted-foreground: 40 10% 70%;
  --card: 40 20% 18%;
  --card-foreground: 51 29% 92%;
  --border: 40 10% 30%;
  --grid-color: 40 10% 25%;

  background-color: hsl(var(--background));
  color: hsl(var(--foreground));

  /* Architect Inverted Cursors */
  --cursor-dot: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Crect fill='%23FF9F1C' x='6' y='6' width='4' height='4'/%3E%3C/svg%3E") 8 8, auto;
  --cursor-link: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2020/svg' width='32' height='32' viewBox='0 0 16 16'%3E%3Cpath fill='%23F2EFE9' d='M2 7h6v2H2V7zm6-2h2v6H8V5zm2 2h2v2h-2V7zm-2-4h2v2H8V3zm0 8h2v2H8v-2z'/%3E%3C/svg%3E") 16 16, pointer;
  
  /* 2. ALSO RE-APPLY for links inside the section */
  a, button, [role="button"], .concept-card, .cursor-pointer {
    cursor: var(--cursor-link) !important;
  }
}
```

Keep the rest of `.section-inverted` intact — the base background, foreground, cursor variables, and the `h2, h3 / .text-eyebrow` overrides below it all stay.

---

### L3 — Delete the 6-selector binary-layer theme inversion block

Find and delete this entire block (approximately lines 293–302):

```css
/* This block forces the color inversion for light themes */
/* Note: We target the layer inside the theme class */
.theme-mono-light .binary-layer,
.theme-palette-retro .binary-layer,
.theme-tech-solaris .binary-layer,
.theme-retro-camp .binary-layer,
.theme-jade-architect .binary-layer,
.theme-solaris-architect .binary-layer {
  filter: invert(1); 
}
```

Delete the entire block including the comments. The `.binary-layer` class itself and the `.binary-waterfall` container above it are still needed — only this theme-specific rule targeting those layers is deleted.

---

### L4 — Consolidate duplicate `.section-inverted` heading overrides

The heading/eyebrow colour overrides for `.section-inverted` appear twice in the file — once inside the `.section-inverted { }` block and again as standalone rules later (approximately lines 450–466):

```css
/* --- INVERTED SECTION OVERRIDES --- */
/* 1. Force main headings to be Primary (Teal) */
.section-inverted h2,
.section-inverted h3 {
  color: hsl(var(--primary)) !important;
}

/* 2. Force ConceptGrid card titles to be Primary */
.section-inverted .concept-card h3 {
  color: hsl(var(--primary)) !important;
}

/* 3. Optional: Make the small eyebrow text white/primary to stand out */
.section-inverted .text-eyebrow {
  color: hsl(var(--primary)) !important;
  opacity: 1;
}
```

Delete this second occurrence (the standalone block at ~lines 450–466). The identical rules already exist inside the `.section-inverted { }` block earlier in the file, so removing the duplicate changes nothing visually.

---

### L5 — Work order and verification

1. **L1** — Delete `.theme-solaris-architect header` block.
2. **L2** — Delete `.theme-solaris-architect &` nested block inside `.section-inverted`.
3. **L3** — Delete the 6-selector `.theme-*-* .binary-layer` inversion block.
4. **L4** — Delete the duplicate `.section-inverted` heading overrides (second occurrence only).

After all four deletions, verify:
- `/home`, `/about`, `/solutions/*`, `/contact`, `/faq` — visually unchanged (dark theme intact)
- `/404` — page still renders correctly with its amber cursor and teal heading overrides (these come from the `.section-inverted` base block which was not touched)
- No other pages or routes should look different

**Do not touch:** `:root { }` variable block, `.binary-layer` or `.binary-waterfall` CSS, any keyframe animations, any Tailwind layer blocks, or any other component classes.

---

## M. Image optimisation — swap PNG → WebP across all files

**Context:** All site images were served as raw PNGs from `public/images/`. WebP versions have already been generated and saved alongside the originals in `public/images/` — they are ready to use right now. No file copying or conversion needed.

**Weight reduction achieved (pre-calculated):**
- `listening.woman2.emptyHands`: 244KB → 71KB (71% smaller)
- `listening.woman2.emptyBook`: 332KB → 109KB (67% smaller)
- `listening.woman2`: 255KB → 74KB (71% smaller)
- `listening.woman2.train`: 341KB → 71KB (79% smaller)
- `stalking.sabretooth`: 196KB → 35KB (82% smaller)
- `bitmap.b.data.map`: 498KB → 60KB (88% smaller)
- `dom-nick-about-sketch`: 488KB → 132KB (73% smaller, resized 2048→1200px)
- `dstorrs.headshot`: 211KB → 23KB (89% smaller)
- `dstorrs.headshot2`: 349KB → 12KB (96% smaller)
- `dstorrs.headshot3`: 939KB → 33KB (96% smaller)

**Total for returns2.astro images alone: 1.8MB → ~420KB (78% reduction)**

The PNG originals are kept in place — do not delete them. Only update the `src` paths in the files listed below.

---

### M1 — `src/pages/returns2.astro`

Make these six path changes. Each is a simple `.png` → `.webp` extension swap. Do not change any other attributes (`id`, `class`, `alt`, etc.) on these elements. Also add `decoding="async"` to every one of these `<img>` tags — it allows the browser to decode image data off the main thread, reducing jank.

**1. Mobile woman background (SLIDE-00 mobile):**
```
src="/images/listening.woman2.emptyBook.png"
```
→
```
src="/images/listening.woman2.emptyBook.webp" decoding="async"
```

**2. Base hands layer (GSAP target `id="base-hands-layer"`):**
```
src="/images/listening.woman2.emptyHands.png"
```
→
```
src="/images/listening.woman2.emptyHands.webp" decoding="async"
```

**3. Book fade layer (GSAP target `id="book-fade-layer"`):**
```
src="/images/listening.woman2.emptyBook.png"
```
→
```
src="/images/listening.woman2.emptyBook.webp" decoding="async"
```

**4. Phone fade layer (GSAP target `id="phone-fade-layer"`):**
```
src="/images/listening.woman2.png"
```
→
```
src="/images/listening.woman2.webp" decoding="async"
```

**5. Train fade layer (`id="train-fade-layer"` img):**
```
src="/images/listening.woman2.train.png"
```
→
```
src="/images/listening.woman2.train.webp" decoding="async"
```

**6. Tiger — both occurrences** (mobile background + GSAP target `id="tiger-focus-layer"`). There are two `<img>` tags referencing this file — update both:
```
src="/images/stalking.sabretooth.png"
```
→
```
src="/images/stalking.sabretooth.webp" decoding="async"
```

---

### M2 — `src/pages/returns.astro`

Apply the identical six changes from M1 to `returns.astro`. The file references the same images in the same structure. This is path-only — do not change any layout, classes, or animation logic.

---

### M3 — `src/components/modules/AboutIntro.tsx`

Find:
```tsx
src="/images/dom-nick-about-sketch.png"
```
Change to:
```tsx
src="/images/dom-nick-about-sketch.webp"
```
Add `decoding="async"` to the same `<img>` element.

---

### M4 — `src/components/modules/Founders.tsx` (if headshot images are used)

If `Founders.tsx` references any of `dstorrs.headshot.png`, `dstorrs.headshot2.png`, or `dstorrs.headshot3.png`, update each to `.webp`. Add `decoding="async"` to each.

---

### M5 — Work order

1. **M1** — Update `returns2.astro` (6 path changes + `decoding="async"`). Verify at `/returns2` — all images must display identically to before.
2. **M2** — Update `returns.astro` (same 6 changes). Verify at `/returns`.
3. **M3** — Update `AboutIntro.tsx`. Verify `/about` hero sketch renders correctly.
4. **M4** — Update `Founders.tsx` headshots if applicable.

---

## N. Proper Astro image optimisation — hero images via `getImage()`

**Context:** Three hero images are in `src/assets/images/` as full-res PNGs:
- `hero-data-meets-emotion-07.png` → used by `Hero.tsx` (home page)
- `hero-about-two-minds-03.png` → used by `AboutIntro.tsx` (about page)
- `hero-uiux-transparent-02.png` → used by `UIUXHero.tsx` (UI/UX sound page)

These are currently served as pre-converted WebP from `public/images/heroes/` — good file size, but no `srcset`, no responsive sizes, no Astro-managed CLS prevention. This section migrates to the proper `getImage()` pattern so Astro handles everything at build time.

**Pattern:** React `.tsx` components cannot import from `src/assets/` directly. The parent `.astro` page calls `getImage()` (server-side at build time), then passes the resulting URL string as a prop to the React component. The component just renders `<img src={imageSrc} />` — no Astro-specific imports needed.

---

### N1 — Update `Hero.tsx` to accept `imageSrc` prop

In `src/components/modules/Hero.tsx`, update the `HeroProps` interface and component signature:

```tsx
// Before:
interface HeroProps {
  heroFlipped?: boolean;
}
export default function Hero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT }: HeroProps) {

// After:
interface HeroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}
export default function Hero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: HeroProps) {
```

In the JSX, update the `<img>` `src` attribute:
```tsx
// Before:
src="/images/heroes/hero-data-meets-emotion-07.webp"

// After:
src={imageSrc ?? "/images/heroes/hero-data-meets-emotion-07.webp"}
```

The fallback to the `/images/heroes/` WebP ensures the image still shows in local dev before the build step runs.

---

### N2 — Update `AboutIntro.tsx` to accept `imageSrc` prop

In `src/components/modules/AboutIntro.tsx`, update `AboutIntroProps` and the component signature:

```tsx
// Before:
interface AboutIntroProps {
  heroFlipped?: boolean;
}
export default function AboutIntro({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT }: AboutIntroProps) {

// After:
interface AboutIntroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}
export default function AboutIntro({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: AboutIntroProps) {
```

Update the hero image `<img>` `src`:
```tsx
src={imageSrc ?? "/images/heroes/hero-about-two-minds-03.webp"}
```

Do not touch the sketch `<img>` src — that stays as `/images/dom-nick-about-sketch.webp`.

---

### N3 — Update `UIUXHero.tsx` to accept `imageSrc` prop

In `src/components/modules/solutions/UIUXHero.tsx`, update `UIUXHeroProps`:

```tsx
// Before:
interface UIUXHeroProps {
  heroFlipped?: boolean;
}
export default function UIUXHero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT }: UIUXHeroProps) {

// After:
interface UIUXHeroProps {
  heroFlipped?: boolean;
  imageSrc?: string;
}
export default function UIUXHero({ heroFlipped = HERO_IMAGE_FLIPPED_DEFAULT, imageSrc }: UIUXHeroProps) {
```

Update the hero image `<img>` `src`:
```tsx
src={imageSrc ?? "/images/heroes/hero-uiux-transparent-02.webp"}
```

---

### N4 — Update `src/pages/home.astro` to pass optimised image URL

In `src/pages/home.astro`, add the `getImage()` import and call, then pass the result as a prop:

```astro
---
import { getImage } from 'astro:assets';
import heroDataMeetsEmotion from '../assets/images/hero-data-meets-emotion-07.png';
import Hero from '../components/modules/Hero.tsx';
// ... other existing imports ...

// Optimise hero image at build time — Astro generates WebP + correct dimensions
const heroImage = await getImage({
  src: heroDataMeetsEmotion,
  format: 'webp',
  width: 1200,
  quality: 85,
});
---
```

Pass the URL to the component. Find the `<Hero` render call and add `imageSrc`:
```astro
<Hero client:load imageSrc={heroImage.src} />
```

---

### N5 — Update `src/pages/about.astro` to pass optimised image URL

```astro
---
import { getImage } from 'astro:assets';
import heroAboutTwoMinds from '../assets/images/hero-about-two-minds-03.png';
import AboutIntro from '../components/modules/AboutIntro.tsx';
// ... other existing imports ...

const heroImage = await getImage({
  src: heroAboutTwoMinds,
  format: 'webp',
  width: 1200,
  quality: 85,
});
---
```

Pass to the component:
```astro
<AboutIntro client:load imageSrc={heroImage.src} />
```

---

### N6 — Update `src/pages/solutions/uiux-sound.astro` to pass optimised image URL

```astro
---
import { getImage } from 'astro:assets';
import heroUiux from '../../assets/images/hero-uiux-transparent-02.png';
import UIUXHero from '../../components/modules/solutions/UIUXHero.tsx';
// ... other existing imports ...

const heroImage = await getImage({
  src: heroUiux,
  format: 'webp',
  width: 1400,
  quality: 85,
});
---
```

Pass to the component:
```astro
<UIUXHero client:load imageSrc={heroImage.src} />
```

Note: `hero-uiux-transparent-02.png` has an RGBA channel (transparency). `getImage()` with `format: 'webp'` preserves transparency. Do not use `format: 'jpeg'` — it discards the alpha channel.

---

### N7 — Verify after all changes

1. Run `npm run build` and check the output for the three hero image paths — they should now be `/\_astro/hero-*.HASH.webp` (Astro-hashed filenames), not `/images/heroes/`.
2. Check that `home`, `/about`, and `/solutions/uiux-sound` still display their hero images correctly.
3. If any hero shows as a broken image, check that the prop name (`imageSrc`) is passed correctly and that the fallback URL in the component is still pointing to a valid `/images/heroes/*.webp` file.
4. The `public/images/heroes/` WebP files can be deleted once the build is verified — they are no longer needed. Do not delete them until the build is confirmed working.

---

### N8 — What NOT to touch

- `returns2.astro` and `returns.astro` — the images there are already at good WebP sizes from section M. They use `public/` paths which is fine for their use case (GSAP targets).
- `dom-nick-about-sketch.webp` — this is already in `public/images/` and served statically. No change needed.
- Any image that isn't one of the three hero images listed above.

**Do not:** delete the `.png` originals, change any `id` attributes on GSAP-targeted images, modify any class names, or touch any other files.

---

## O. Hero image fixes — revert bad overflow changes, add bottom fade

**Context:** A previous Cowork session made incorrect changes to the three hero components trying to prevent the hard bottom edge of images from showing. The approach used (`height: '115%'`, `overflow-x-hidden`) was wrong — it altered page layout and created scroll issues. This section corrects those changes and implements the right approach: a gradient overlay div that fades the image into the background colour at the bottom.

**Apply to all three files in order. Do not touch any other properties.**

---

### O1 — `src/components/modules/Hero.tsx`

**Step 1** — Revert the root div overflow class. Find:
```tsx
<div className="w-full relative overflow-x-hidden">
```
Change to:
```tsx
<div className="w-full relative overflow-hidden">
```

**Step 2** — Revert the image container. Find:
```tsx
      <div
        className="absolute top-0 right-0 w-full md:w-[58%] pointer-events-none z-0"
        style={{
          height: '115%',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-data-meets-emotion-07.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-top"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
      </div>
```
Replace with:
```tsx
      <div
        className="absolute inset-y-0 right-0 w-full md:w-[58%] pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-data-meets-emotion-07.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-center"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </div>
```

---

### O2 — `src/components/modules/AboutIntro.tsx`

**Step 1** — Revert the root div overflow class. Find:
```tsx
<div className="relative w-full md:py-32 min-h-svh flex flex-col overflow-x-hidden">
```
Change to:
```tsx
<div className="relative w-full md:py-32 min-h-svh flex flex-col overflow-hidden">
```

**Step 2** — Revert the image container. Find:
```tsx
      <div
        className="absolute right-0 top-0 w-full md:w-[65%] pointer-events-none z-0"
        style={{
          height: '115%',
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-about-two-minds-03.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-top"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
      </div>
```
Replace with:
```tsx
      <div
        className="absolute right-0 top-0 w-full md:w-[65%] h-full pointer-events-none z-0"
        style={{
          clipPath: `inset(0 ${100 - revealProgress}% 0 0)`,
          transition: 'clip-path 0.1s linear',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
        }}
      >
        <img
          src={imageSrc ?? "/images/heroes/hero-about-two-minds-03.webp"}
          alt=""
          decoding="async"
          loading="eager"
          className="w-full h-full object-cover object-center"
          style={{ transform: heroFlipped ? 'scaleX(-1)' : 'none' }}
        />
        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </div>
```

---

### O3 — `src/components/modules/solutions/UIUXHero.tsx`

**Step 1** — Revert the root div overflow class. Find:
```tsx
<div className="relative w-full md:py-32 min-h-[50vh] flex flex-col overflow-x-hidden">
```
Change to:
```tsx
<div className="relative w-full md:py-32 min-h-[50vh] flex flex-col overflow-hidden">
```

**Step 2** — Revert the image container height. Find:
```tsx
        className="absolute right-0 md:right-[-5%] top-0 w-full md:w-[65%] pointer-events-none z-0"
        style={{
          height: '115%',
```
Change to:
```tsx
        className="absolute right-0 md:right-[-5%] top-0 w-full md:w-[65%] h-full pointer-events-none z-0"
        style={{
```
(Remove the `height: '115%',` line entirely from the style object.)

**Step 3** — Change `object-top` back to `object-center` on the hero image. Find:
```tsx
          className="absolute inset-0 w-full h-full object-cover object-top"
```
Change to:
```tsx
          className="absolute inset-0 w-full h-full object-cover object-center"
```

**Step 4** — Add the bottom fade div immediately after the `<img>` close tag and before the icon constellation div:
```tsx
        {/* Bottom fade — dissolves image into background before the hard clip edge */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
```

---

### O4 — Work order

1. O1 (Hero.tsx) — two edits. Verify `/home` renders, no scroll change.
2. O2 (AboutIntro.tsx) — two edits. Verify `/about` renders, no scroll change.
3. O3 (UIUXHero.tsx) — four edits. Verify `/solutions/uiux-sound` renders, no scroll change.

**Do not touch** any other properties on these elements. Do not touch `SonicHero.tsx` or `ImmersiveHero.tsx` — they did not have the bad changes applied.

---

## P. Visualizer width alignment — match button edges exactly

**File:** `src/components/modules/Hero.tsx` only.

**The problem:** The visualizer (`hidden md:flex flex-col w-full`) fills the full `md:max-w-[52%]` column width. The CTA buttons (`flex items-stretch gap-4 w-full max-w-xl`) are capped at `max-w-xl` (36rem). On desktop the visualizer is therefore wider than the buttons — its left and right edges don't align.

**The goal:** The visualizer's left edge aligns with "OUR STORY" button's left edge, and its right edge aligns with "START A PROJECT" button's right edge.

**The fix:** Wrap the CTA buttons div and the visualizer div in a shared outer container with `max-w-xl`. Both children then fill `w-full` within that container and share identical left/right edges.

In `src/components/modules/Hero.tsx`, find the CTA buttons + visualizer block:

```tsx
          {/* CTA BUTTONS */}
          <div className="flex items-stretch gap-4 w-full max-w-xl">
            <a href="/about" className="flex-1">
              <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-base">
                OUR STORY
              </Button>
            </a>
            <a href="/contact" className="flex-1">
              <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-base">
                START A PROJECT
              </Button>
            </a>
          </div>

          {/* VISUALIZER — desktop only, fills column width */}
          <div className="hidden md:flex flex-col w-full">
```

Replace with:

```tsx
          {/* SHARED WIDTH CONTAINER — constrains both buttons and visualizer to the same max width */}
          <div className="w-full max-w-xl">

            {/* CTA BUTTONS */}
            <div className="flex items-stretch gap-4 w-full">
              <a href="/about" className="flex-1">
                <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-base">
                  OUR STORY
                </Button>
              </a>
              <a href="/contact" className="flex-1">
                <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-base">
                  START A PROJECT
                </Button>
              </a>
            </div>

            {/* VISUALIZER — desktop only, fills shared container width */}
            <div className="hidden md:flex flex-col w-full mt-8">
```

Also close the new outer container div after the visualizer block closes. Find the closing `</div>` of the visualizer section and add another `</div>` after it to close the shared container:

```tsx
            </div>

          </div>
          {/* END SHARED WIDTH CONTAINER */}
```

Key changes:
- `max-w-xl` moves from the buttons div to a new outer wrapper
- Buttons div loses `max-w-xl` (inherited from wrapper) — keeps `w-full`
- Visualizer gains `mt-8` for spacing above it — was previously `space-y-8` on the parent handling this gap, but now it's inside the shared container which doesn't have `space-y-8`
- Visualizer `w-full` fills the shared `max-w-xl` container exactly

Do not change any other classes on buttons, the visualizer stage div, bar elements, or status label.


---

## Q. Landing page (`index.astro`) + `HomeHero.tsx` — Current state and next task

### Q1 — What was done (do not redo or revert any of this)

The landing page (`/`) and `HomeHero.tsx` were significantly reworked. **We are happy with the current state.** Do not change anything below unless explicitly asked.

**`src/pages/index.astro`**
- Points to `/images/home-hero-cube-transparent.png` as `heroSrc` — the PNG with background removed. Do not change this.
- Passes `heroSrc` to `<HomeHero client:load imageSrc={heroSrc} />`
- `showGrid={false}` is passed via Layout — no background grid on the landing page
- `hideHeader={true}` — nav is hidden on the landing page

**`src/components/modules/HomeHero.tsx`**

The component has a full intro animation sequence controlled by the `T = { }` timing constants block at the top of the file. These are the only values that should be adjusted to tune animation feel.

Key architecture decisions made and settled:
- **Image is NOT portaled** — rendered as a plain `fixed inset-0 z-[1]` div directly in the JSX (not via `createPortal`). This keeps it inside the Layout stacking context so content can sit above it.
- **Logo flash IS portaled** — `createPortal(logoPortal, document.body)` at `z-[100]` so it beats the Layout `z-10` wrapper during the intro flash.
- **Content wrappers use `z-[2]`** — the main content div and concept grid div both have `relative z-[2]` so they sit above the `z-[1]` image.
- **Image sizing** — the img uses `absolute top-1/2 left-1/2 w-[90vw] h-[90vh] object-contain` with `transform: translate(-50%, -50%) scale(${imgScale})`. The `translate(-50%, -50%)` and `scale()` are combined in the inline style — do NOT add Tailwind translate classes (`-translate-x-1/2` etc.) as they conflict with the inline transform.
- **No opacity fade on content** — subtitle, buttons, and concept grid use `opacity-0`/`opacity-100` Tailwind classes toggled by `isScanning` state (instant snap, no transition). They stay in the DOM always to prevent layout shift.
- **Grayscale** — image starts fully grey (`filter: grayscale(1)`), transitions to full colour at the flare peak, settles to slight grey at ambient (`grayscale(0.4)`).
- **Logo sequence** — flash → flare (amber) → post-flare → primary (cyan) → fade-out (clean, no flicker). The `'flicker'` phase was removed.
- **Ambient timing** — `T.imgAmbient: 2000` (fires just as typing starts at `T.logoDone: 1960`). Ambient transition is `1.5s ease` — quick enough to clear before content is read.
- **Button** — outline button uses `bg-background` (solid, not `bg-background/50`).

**`src/layouts/Layout.astro`**
- Landing page (`isLandingPage`) uses the full-bleed path — no `max-w-[1400px]` wrapper, no `z-10` on the content. This is correct and intentional.
- `showGrid={!isLandingPage}` — grid hidden on landing page only.

**`src/components/GridBackground.astro`**
- `showGrid` prop added with default `true`. When `false`, the bitmap-grid div is not rendered.

---

### Q2 — Next task: CSS 3D tilt on the cube image (mouse-responsive rotation)

**Goal:** The cube image responds to mouse position by rotating subtly in 3D, using the orange corner (which sits approximately at the visual centre of the image on screen) as the pivot point.

**Approach: CSS 3D transforms + mouse tracking in `HomeHero.tsx`**

No new libraries needed. Add mouse tracking to the existing component and combine the rotation into the existing inline transform on the image.

**Implementation plan:**

#### Step 1 — Add mouse tracking state

```tsx
const [mouseX, setMouseX] = useState(0); // -1 to 1 (left to right)
const [mouseY, setMouseY] = useState(0); // -1 to 1 (top to bottom)
```

#### Step 2 — Add mouse move listener in `useEffect`

Add inside the existing `useEffect` (alongside the timers):

```tsx
const handleMouseMove = (e: MouseEvent) => {
  // Normalise to -1 → 1 relative to viewport centre
  setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
  setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
};
window.addEventListener('mousemove', handleMouseMove);

// Add to cleanup:
return () => {
  timers.forEach(clearTimeout);
  window.removeEventListener('mousemove', handleMouseMove);
};
```

#### Step 3 — Derive rotation values

```tsx
// ── MOUSE TILT ───────────────────────────────────────────────────────────────
// MAX_TILT: maximum degrees of rotation. Keep subtle (6–12°). Tune here.
const MAX_TILT = 8;
const tiltX = mouseY * -MAX_TILT; // mouse up → cube tilts toward viewer (rotateX positive)
const tiltY = mouseX * MAX_TILT;  // mouse right → cube rotates right (rotateY positive)
```

#### Step 4 — Wire into the image transform

The image already has an inline `style` with `transform`. Add the rotations alongside the existing translate and scale:

```tsx
style={{
  transform: `translate(-50%, -50%) scale(${imgScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
  filter: `grayscale(${imgGrayscale})`,
  transition: imgAmbient
    ? 'opacity 1.5s ease, transform 1.5s ease, filter 0.8s ease'
    : imgTransition,
}}
```

**Important:** Once ambient is reached, the `transform` transition (`1.5s`) will lag behind fast mouse movements. Switch to a separate CSS transition for the tilt only, or add a shorter transition override post-ambient. A clean approach: use a separate `transitionProperty` and `transitionDuration` once ambient:

```tsx
const tiltTransition = imgAmbient
  ? 'opacity 1.5s ease, filter 0.8s ease, transform 0.12s ease-out'  // snappy tilt after ambient
  : imgTransition; // during intro, use the existing slow transition
```

Then use `tiltTransition` instead of `imgTransition` on both the wrapper div and the img element.

#### Step 5 — Add perspective to the container

The container div (`fixed inset-0 z-[1]`) needs a `perspective` so the 3D rotation has depth:

```tsx
<div
  className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
  style={{
    opacity: imgOpacity,
    transition: imgTransition,
    perspective: '1200px',        // ← add this
    perspectiveOrigin: '50% 50%', // ← centre of viewport = approximately the orange corner
  }}
>
```

Adjust `perspective` value: lower = more dramatic distortion, higher = subtler. `800px`–`1400px` is a good range.

**Tuning notes:**
- `MAX_TILT` (step 3): `6–10°` is the sweet spot. Below 6 is imperceptible, above 12 looks unstable.
- `perspective` (step 5): `1200px` is a good start. Lower for more drama.
- `perspectiveOrigin`: `50% 50%` centres on the viewport middle. If the orange corner is slightly off-centre on your screen, adjust (e.g. `48% 52%`).
- The tilt transition `0.12s ease-out` (step 4) controls how snappily the cube follows the mouse. `0.08s`–`0.15s` feels responsive without jitter.

**Do not touch:**
- The `T` timing constants
- Any opacity, grayscale, or scale values
- The logo portal or its z-index
- The `z-[1]` / `z-[2]` stacking setup
- `src/pages/index.astro` or `Layout.astro`

---

### Q3 — Ambient glow layers (DONE — do not change)

Two `fixed z-[1]` overlay divs sit between the background and the cube image, added directly in `HomeHero.tsx` just before the image div. Both fade in with the image (`opacity 3s ease` triggered by `imgVisible`).

```tsx
{/* AMBIENT GLOW — fixed layers behind the cube for depth */}
<div
  className="fixed inset-0 z-[1] pointer-events-none"
  style={{ opacity: imgVisible ? 1 : 0, transition: 'opacity 3s ease' }}
>
  {/* Primary glow — full-screen subtle cyan atmosphere */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_center,hsl(var(--primary)/0.07)_0%,transparent_100%)]" />
  {/* Vignette — minimal edge darkening */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_100%,hsl(var(--background))_100%)]" />
</div>
```

**What the 100% stops do:** Both stops at 100% means the vignette only darkens at the very edge — effectively an open glowing atmosphere rather than a framed spotlight. The glow's `transparent 100%` spreads the cyan across the entire void. The cube floats in a softly charged open space. This is intentional — do not revert to tighter stop values.

**Tune here:**
- Glow intensity: the `0.07` alpha on `hsl(var(--primary)/0.07)` — increase for more visible cyan wash
- Ellipse shape: `ellipse_100%_100%` — can be made asymmetric (e.g. `ellipse_80%_60%`) for a wider-than-tall glow

**What was removed:** The old `index.astro` had an `absolute` vignette div that no longer worked once the image moved to `fixed`. Do not add it back to `index.astro`.

### Q2 — CSS 3D tilt (DECIDED AGAINST — do not implement)

The mouse-responsive 3D rotation on the cube was implemented and then reverted — it didn't look good. The implementation spec remains in Q2 above for reference only. Do not re-implement without explicit instruction.

---

## R. New hero images — Sonic Branding + Immersive Audio

Two new images have been added to `src/assets/images/`:
- `hero-sonic-branding-transparent-03.png` — for the Sonic Branding solution page
- `hero-immersive-audio-01.png` — for the Immersive Audio solution page

Wire them using the exact same `getImage()` + prop pattern established in section N for UIUXHero.

---

### R1 — Add `imageSrc` prop to `SonicHero.tsx`

**File:** `src/components/modules/solutions/SonicHero.tsx`

The component currently has no `imageSrc` prop. Add it following the UIUXHero pattern exactly.

**Step 1 — Add the prop interface.** Find:
```tsx
export default function SonicHero() {
```
Replace with:
```tsx
interface SonicHeroProps {
  imageSrc?: string;
}

export default function SonicHero({ imageSrc }: SonicHeroProps) {
```

**Step 2 — Wire `imageSrc` into the image tag.** Inside the component, find the background reveal area. SonicHero currently renders icon constellations but no `<img>`. Add an `<img>` as the first child inside the reveal container div (before the constellation div), following the same pattern as UIUXHero:

Find the reveal container — it's the `absolute` div with `clipPath` and `maskImage` styles (approximately line 48). Inside it, before the constellation div, add:

```tsx
{/* HERO IMAGE — full colour, mask handles left-edge fade */}
{imageSrc && (
  <img
    src={imageSrc}
    alt=""
    decoding="async"
    loading="eager"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />
)}

{/* Bottom fade */}
{imageSrc && (
  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
)}
```

The icon constellation stays — it floats in front of the hero image when both are present. When no `imageSrc` is passed, the component renders constellation-only as before.

---

### R2 — Add `imageSrc` prop to `ImmersiveHero.tsx`

**File:** `src/components/modules/solutions/ImmersiveHero.tsx`

Apply the identical changes as R1 — same prop interface, same `<img>` + bottom-fade insertion inside the reveal container.

---

### R3 — Update `sonic-branding.astro`

**File:** `src/pages/solutions/sonic-branding.astro`

Add `getImage()` import and call, then pass the result to `SonicHero`:

```astro
---
import { getImage } from 'astro:assets';
import Layout from '../../layouts/Layout.astro';
import Section from '../../components/Section.astro';
import SonicHero from '../../components/modules/solutions/SonicHero.tsx';
import SonicAnalysis from '../../components/modules/solutions/SonicAnalysis.tsx';
import DeliverablesGrid from '../../components/modules/solutions/DeliverablesGrid.tsx';
import CTA from '../../components/modules/CTA.tsx';
import heroSonic from '../../assets/images/hero-sonic-branding-transparent-03.png';

const heroImage = await getImage({
  src: heroSonic,
  format: 'webp',
  width: 1400,
  quality: 85,
});

const sonicDeliverables = [ ...existing array unchanged... ];
---
```

Then on the `<SonicHero>` render call:
```astro
<SonicHero client:load imageSrc={heroImage.src} />
```

---

### R4 — Update `immersive-audio.astro`

**File:** `src/pages/solutions/immersive-audio.astro`

Same pattern as R3:

```astro
import { getImage } from 'astro:assets';
import heroImmersive from '../../assets/images/hero-immersive-audio-01.png';

const heroImage = await getImage({
  src: heroImmersive,
  format: 'webp',
  width: 1400,
  quality: 85,
});
```

Then:
```astro
<ImmersiveHero client:load imageSrc={heroImage.src} />
```

---

## S. Hero image direction — make solution/about heroes feel more like the landing page

**The vision:** The landing page cube image is beautiful because it fills the entire viewport, the text sits on top of it, and the two feel like one unified composition rather than "text on left, image on right." The solution page heroes currently constrain images to the right ~65% with a left-edge mask. The goal is to make them feel more immersive — bigger images, more visual tension between image and text.

**Two approaches to try, in order:**

### S1 — Wider image, text overlay (closer to landing page feel)

Instead of `md:w-[65%]` on the image container, push it to `md:w-[85%]` or `md:w-full`. The text (`pl-4 md:pl-12`) already sits above the image via `z-10` — a wider image simply puts more of it behind the text, creating a more immersive overlap. The left-edge mask gradient handles the fade so text stays readable.

In UIUXHero, SonicHero, ImmersiveHero — find:
```tsx
className="absolute right-0 md:right-[-5%] top-0 w-full md:w-[65%] h-full pointer-events-none z-0"
```
Try:
```tsx
className="absolute right-0 md:right-[-5%] top-0 w-full md:w-[85%] h-full pointer-events-none z-0"
```
Widen the mask fade range if text legibility drops — change `22%` in the `maskImage` gradient to `30–35%`.

Apply to all three solution heroes. Verify text is readable at 1440px. Do not change anything else.

### S2 — Full-bleed image, wider mask (maximum drama)

Push to `md:w-full` and widen the mask to `35%`. The image fills the entire hero width, the text floats over the left third. This is closest to the landing page feel within the existing sticky hero architecture.

**Do not attempt S1/S2 until R1–R4 are done and verified** — the new images need to be wired in first so there's something to see. Start with S1 and review before trying S2.
