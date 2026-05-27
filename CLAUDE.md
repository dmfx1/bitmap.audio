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

The modulo fix has been applied globally (no page gate needed) using tile-aligned values: `% 400` for deep layer, `% 800` for near layer — these match the CSS `background-size` heights exactly, making the loop seamless on any screen size.

**Known remaining issue — `returns.astro` rain at page edges**: The binary rain is only relevant at the left/right edges of the viewport where the GridBackground shows around the inset section panels. The sections themselves cover the GridBackground intentionally — we do not need rain visible through section backgrounds. The remaining issue is whether the rain stays visible at those exposed edges as the user scrolls deep into the 1600vh track. This is to be revisited during the dedicated `returns.astro` pass (Batch 4).

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

### 18. ConceptGrid autoplay — enable on mobile

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
