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


---

> **📦 Archive:** All completed session logs — the mobile-optimisation brief and sections **A–AC** (hero images, icons, grain gradient, flowing image slides, etc.) — live in **`CLAUDE.archive.md`** (the full original file, unabridged). This keeps CLAUDE.md lean and cheap to load every turn. Open the archive on demand if you need the history of how something was built. The section below (**AD**) is the only active / in-progress work.

---

## AD. returns2.astro — Control-surface refactor (2026-07-14 plan)

**Goal (dom):** one simple "interface" at the top of `returns2.astro` that controls: slide width, content position within a slide, edge-fade length on BOTH image AND text slides, background colours derived from images, easy image swapping, the GSAP vividness ramp, and whether an image lives on its own slide or behind text. Kill the Opus/Gemini config drift. Page must pop; mobile snap must be untouched.

**Decisions made with dom:** ~~build-time colour extraction with sharp~~ → SCRAPPED, journey stays manual + transparent images (see AD5) · full restructure (not incremental patching) · SLIDE-12 goes `md:bg-transparent` and the JOURNEY checkpoint carries the amber.

**Execute one step at a time. Verify after each. Never touch: the `is-mobile-snap` CSS block, the `isMobile` early-return in the script, `bg-* md:bg-transparent` patterns on text slides (mobile needs the opaque bg), GSAP anchor ids (`roi-section`, `success-section`, `metrics-section`), `data-sidebar` / `data-sidebar-anchor` attributes, or `returns.astro`.**

### AD1 — Step 1: Purge — DONE (2026-07-14)

Removed from `returns2.astro` (1780 → 1665 lines):
- Dead GSAP blocks + selectors: `#train-fade-layer`, `#tiger-focus-layer`, `#parallax-grid`, `.ghost-counter` (elements no longer exist in markup — the blocks were no-ops), plus their `slide01`/`slide03` refs and the `trainFade`/`tigerFocus` `anim` entries in `sections`.
- Unused `IMG_RAMP` const (shadowed by hardcoded fallbacks in `imgSlideTrigger`) and dead `IMG_DEFAULTS.edgeMask` (ImageSlide only reads `customMask`).
- **Bug fix:** slide "1.5" used `imgFade: "flow-xlong"` — wrong prop name, silently ignored. Now `fade: "flow-xlong"` (the actual ImageSlide prop). Slide 1.5's mask changes from `flow` to `flow-xlong` — this is the intended look finally applying.
- Stale comments: LAYOUT AUDIT block, duplicated JOURNEY header + stale "TEST scope" note, duplicated image-slides comment header, "3-STEP STAGGERED FADE" note, "Grid rebuild complete" footer note, SLIDE-0.5/00/02 stale image descriptions, and ALL width claims in header/`#region` comments (they contradicted the config — widths live ONLY in frontmatter config now; comments no longer state widths).

Verify done: no leftover refs (grep clean), `<section>` open/close balanced 27/27, 18 `<ImageSlide>` instances intact.

### AD2 — Step 2: Unify config (single SLIDES array)

**STATUS (2026-07-14): 2a + 2b DONE + verified on dev server by dom (widths, sidebar, mobile snap all correct). AD3 is next.**
- 2a DONE: `SLIDES` single-source-of-truth array added (DOM order, `type:"text"|"image"|"behind"`). `sections`, `imgSlide`, `BACKGROUNDS` now DERIVED from it (byte-identical to old config — no template consumers changed). `define:vars` now also passes whole `SLIDES` (`window.__SLIDES__`); `__SECTIONS__` still derived for the script. `IMG_DEFAULTS` kept as a named const above `SLIDES`.
- 2b DONE: every desktop section now has `data-slide="{id}"` — 13 text (mapped across the data-sidebar gap: ds9→"08" … ds13→"12"), 6 interstitial/spacer ("3.5","4.5","6.5","7.5","8.5","spacer"), and all image/gradient slides via a new `id` prop on `ImageSlide.astro` → `data-slide`. `applyWidths` rewritten to match by EXACT `data-slide` string (robust to the gap) instead of positional `sidebarSections[i]`. `sidebarSections` still used by sidebar centering (untouched).
- ⚠️ DEVIATION from brief: hardcoded `w-screen`/`w-[Xvw]` classes were KEPT, not removed. Reason: on these sections `w-screen`(=100vw) is the mobile snap width AND the pre-hydration fallback; `applyWidths` (inline style, from config) overrides it on desktop and is authoritative, so widths still come only from config — but removing the class would regress to a content-width collapse before JS runs (FOUC) on this giant horizontal strip. If dom wants them literally stripped, that's a quick follow-up.
- ⚠️ GOTCHA (kept for reference): config id ≠ DOM `data-sidebar` after slide 07 (no `data-sidebar="8"`; config `"08"` Perception → DOM `data-sidebar="9"`). Never do numeric id→data-sidebar lookup — use exact `data-slide` string match (now done).
- Interstitial stat widths (66vw/75vw/w-screen) are addressable via `data-slide` but still hardcoded (not yet in `SLIDES` — they're GSAP-calibration-locked). Folding them into config is a future step.

Merge `sections` + `IMAGE_SLIDES` + `IMG_DEFAULTS` + `BACKGROUNDS` into ONE ordered `SLIDES` array where array order = DOM order. Every entry: `{ id, type: "text" | "image", label?, width, ... }`. Image entries keep `img`/`gradient`, `imgWidth`, `imgX`, `objectPos`, `z`, `opacity`, `blend`, `fade`, `customMask`, `ramp`, and gain `place: "own" | "behind"` (behind = renders inside the PREVIOUS text slide at z-0, replacing the `BACKGROUNDS` map used by SLIDE-13/3.5).
- Widths come ONLY from config: remove hardcoded `w-screen`/`w-[Xvw]` classes from desktop sections; `applyWidths` switches from positional `sidebarSections[i]` mapping to id-based lookup (`data-sidebar` matches numeric part of config id). Interstitial/no-sidebar slides (3.5, 4.5, 6.5, 7.5, 8.5, spacer) get `data-slide` attributes so they're addressable too.
- Keep the `define:vars` bridge; pass the whole `SLIDES` array.
- Verify: every slide width identical to before, sidebar tracking unchanged, mobile snap unchanged (mobile forces 100vw via existing CSS).

### AD3 — Step 3: Content positioning from config

**STATUS (2026-07-15): DONE — awaiting dev-server verify.** All 13 text slides now carry `content: { col: [start, span] }` in SLIDES. Frontmatter helper `gridStyle(id)` (+ `slideById` lookup) emits inline `grid-column: N / span M` (CSS-equivalent to the old `md:col-start-N md:col-span-N`), applied via `style={gridStyle("id")}` on each text content wrapper. `md:row-start-1` and all other classes preserved; mobile untouched (inline grid-column is inert — the wrapper's parent is only a grid at `md:`+). `align` supported (→ `justify-self`) but unused so far. The 5 interstitial wrappers (3.5/4.5/6.5/7.5/8.5) keep their hardcoded col classes — AD3 is text-slides only.

Add `content: { col: [start, span], align?: "start" | "center" | "end" }` to text-slide entries. Template reads it into the existing 12-col grid wrapper (`md:col-start-N md:col-span-N` become inline `style="grid-column: N / span N"` on desktop, since Tailwind can't JIT dynamic classes from config). Mobile classes untouched.

### AD4 — Step 4: Universal edge fades (kills hard edges)

**STATUS (2026-07-15): DONE — awaiting dev-server verify.** `ImageSlide.astro` now resolves `fade` via `fadeToMask()` which accepts EITHER a preset name (sugar — byte-identical masks, no image regression) OR `{ left, right }` fractions (0–0.5) of slide width. The mask is now also applied to gradient panels via `ImageSlide` (kept for any future gradient slides). NOTE (2026-07-15): the two gradient colour-transfer panels 11.5/12.5 were later REMOVED — they were a second colour source competing with the JOURNEY and bled accent across the Belief/Execution seams. They're now transparent spacer `<section>`s (`data-slide="11.5"/"12.5"`, `width:100vw`, `hidden md:flex`) so the journey's amber ramp shows through with no baked gradient. Colour there now comes solely from JOURNEY. Belief section (data-sidebar="12"/data-slide="11") switched `bg-accent` → `bg-accent md:bg-transparent` so the JOURNEY `#FFA61A` at "12" carries the amber on desktop (mobile keeps opaque amber for snap). `Slide.fade` type broadened to `string | {left,right}`.
- ⚠️ DEVIATION: text-slide content wrappers are NOT masked (brief listed them). Reason: after the Belief fix, ALL text slides are `md:bg-transparent` on desktop → they have no hard edge to kill, and masking a text wrapper would fade the actual copy near its column edges (clips headings). Goal ("zero hard vertical edges") is met via image masks + gradient-panel masks + Belief. If dom wants text edge-fades regardless, `fade`/`gridStyle` plumbing can extend to `content` — quick follow-up.


- Add `fade: { left: 0–0.5, right: 0–0.5 }` (fractions of slide width) to EVERY slide. Generates a `mask-image` linear-gradient applied to: image wrapper (replacing the named-preset system — presets become sugar that expands to left/right values) AND text slides' content wrapper on desktop.
- SLIDE-12: add `md:bg-transparent` (only text slide missing it) — the JOURNEY `#FFA61A` checkpoint at "12" carries the amber.
- Gradient panels 11.5/12.5: render with soft edge masks instead of opaque full-bleed `bg-gradient-to-r`.
- Verify: full desktop scroll-through with zero hard vertical edges; mobile unchanged (masks are `md:`-scoped / applied in the desktop-only code path).

### AD5 — Colour journey: MANUAL (auto-detection SCRAPPED, 2026-07-15)

**Decision (dom):** Auto colour-extraction from images is scrapped — too fragile on dark photos (near-black/brown edges, needs saturation/brightness boosting and dark-colour rejection) for little payoff. The background journey stays **user-defined / manual**. NO `sharp` script, NO `npm run colors`, NO `returns-edge-colors.json`, NO `bg:"auto"`.

Blend images into the journey two ways:
- **Photos** (no clean subject to cut out): add a manual `JOURNEY` checkpoint in a hand-picked colour, and lengthen that image's AD4 edge-fade (`fade: { left, right }`, up to ~0.5) so the photo smudges into the background instead of showing a hard edge. Rule for any hand-picked colour: bright or brand-ish only — no browns/blacks/dark muddy tones; white is fine.
- **Illustrations / graphics** (clean subject): export with a **transparent background** so the user-defined journey shows straight through — seamless by construction, no colour-matching. Prefer this wherever possible.
- dom is thinning the image set (fewer images); the gradient/journey drift alone already reads well, so not every slide needs an image.

**Mechanism in place:** the JOURNEY resolver now anchors a checkpoint to EITHER a text slide (`data-sidebar`) OR an image slide (`data-slide`) — see `findSec()` in the journey GSAP block. So `{ at: "5.5", color: "#hex" }` pins to image slide 5.5.
- Live example currently in the file: `{ at: "5.5", color: "#52958E" }` (teal for `recall-under-pressure`) + a long `fade: { left: 0.45, right: 0.45 }` on that image. Adjust/remove as the image set changes.

**Optional (not built):** a `bg: "#hex"` sugar on image slides that injects a manual checkpoint so the colour sits next to the image in SLIDES rather than in the separate JOURNEY array. Only worth doing if the manual JOURNEY list gets unwieldy.

### ⚠️ GOTCHA — Function-based tween values need `invalidateOnRefresh` (2026-07-20)

Symptom: on a fresh reload, scrolling to the end left SLIDE-13 ("Master the Signal") parked half off-screen — then after a pause or some erratic scrolling it would suddenly snap to the correct framing.

Cause: the main strip tween used a function value, `x: () => -(strip.scrollWidth - innerWidth - endOffset())`, but its ScrollTrigger was missing `invalidateOnRefresh: true`. GSAP evaluates function-based values **once at setup and caches them**. At that moment `strip.scrollWidth` is not final — sections carry `content-visibility: auto` so off-screen ones aren't laid out, and fonts/images are still settling. The strip locked to a too-short travel distance; the eventual auto-refresh (on `load` / resize) recomputed start/end and produced the visible snap.

Rule: **any tween with a function-based value driven by a measurement must set `invalidateOnRefresh: true`.** Every other trigger in `returns2.astro` already had it. A `document.fonts.ready → ScrollTrigger.refresh()` also runs after init to settle metrics after font swap.

Related: `CONFIG.stripEndOffset` is now a **fraction of viewport width**, not px — a px offset framed the final slide differently on every display size.

### ⚠️ GOTCHA — The strip's `scrub` must be `true`, and the blur-in must match it (2026-07-20)

Symptom: heavy stutter at the horizontal→vertical handover at the end of the track, and again scrolling back into the horizontal.

Cause: the strip tween had `scrub: 1`. A numeric scrub makes the strip *lag* the scroll and ease toward its target. At the end of the track the page hands over to normal vertical scroll while the strip is still catching up — the two disagree, which reads as stutter, and reversing direction restarts the catch-up. `scrub: true` locks the strip 1:1 to scroll position, so the handover is seamless both ways. (`scrub: 1` had originally been chosen to smooth discrete mouse-wheel steps — the wrong layer to fix that at. Smooth the INPUT via `ScrollTrigger.normalizeScroll` if wheel steppiness needs solving; do not reintroduce lag on the strip.)

**Coupling:** the Belief/Subconscious blur-in tween must use the SAME scrub as the strip. It's keyed to the slide reaching viewport centre, so if the strip is 1:1 and the blur lags, the text resolves *after* it has passed centre. Both are now `scrub: true`. Change them together, never one alone.

### ⚠️ MOBILE — returns2 scrolls an INNER container, not the document (2026-07-20)

Supersedes the old "`html` is the snap scroller" setup. **Mobile only** — everything is scoped to `html.is-mobile-snap`, which is added solely when `innerWidth < 768`. Desktop is untouched.

Symptoms this fixed: (a) the top of the next slide peeking below the current one, (b) the snap overshooting when swiping back up, worst nearest the top.

Cause: with `html` as the scroller, scrolling up re-shows the mobile address bar, which shrinks `dvh`. Every `100dvh` section shrinks simultaneously, the scroll height above the user collapses, and the browser re-snaps to compensate. It compounds the further up you go.

Fix: `#scroll-track > .sticky` is now the scroll container (`height:100svh; overflow-y:auto; scroll-snap-type:y mandatory; overscroll-behavior-y:contain`), `html`/`body` are `overflow:hidden`, and sections are `100svh`. Because the document never scrolls, the browser chrome never retracts, so `svh` IS the true viewport for the whole session.

**Rules:**
- **Never use `dvh` anywhere in the mobile snap path.** A dynamic height on the container or the sections reintroduces the exact reflow this removes. `svh`/`lvh` are static; `dvh` is not.
- Sections must be `100svh`, **not `100%`** — `#horizontal-strip` is `height:auto`, so a percentage collapses.
- `scroll-snap-type` belongs on the container ONLY. Leaving it on `html` too makes two scrollers fight.
- Full-bleed mobile background images use `absolute inset-0`, never `w-[100vw] h-[100vh]` — plain `vh` is the large viewport and overflows a `svh` section by one address-bar height.
- `#end-screen` lives outside `#scroll-track`, so the mobile branch **moves it into the scroller** (idempotent) or it becomes unreachable. Desktop leaves it in normal flow.

Cleared as safe before the change: no scroll listener on this page reads document scroll — `Layout.astro`'s glow targets `.mobile-viewport-active` (zero on returns2), GridBackground's rain layers don't exist here (gated off for returns pages), and the mobile branch early-returns before any GSAP.

### ⚠️ GOTCHA — Image "free roam" & `content-visibility` (2026-07-15)

Images can be shifted off their own slide (`imgX`, `imgWidth > 100%`) to overlap/roam over neighbouring slides, with the edge `fade` dissolving them onto the transparent slides + journey behind. This was BROKEN for a long time (shifted images hard-cut at their slide's left edge) and it wasted a whole session chasing z-index / masks / blend — none of which were the cause.

**Root cause:** `global.css` has `section { content-visibility: auto }` (a perf optimisation that skips off-screen slides). `content-visibility: auto` applies implicit **`contain: paint`**, which clips each section's content to its own box REGARDLESS of `overflow: visible`. So every image was boxed to its slide and couldn't spill.

**Fix (in `ImageSlide.astro`):** the `<section>` inline style includes `content-visibility:visible;` to override the global rule. Now image slides render unclipped and images roam. Tradeoff: those ~10 image sections always render (no off-screen skip); text slides keep the optimisation. Mobile unaffected (image slides are `hidden md:flex`). For roam to paint OVER a neighbour, the image slide also needs a higher `z` than the text slides — `IMG_DEFAULTS.z` is `30` (text is z-10/z-20); the sidebar stays on top at z-50.

Debugging note: the only reliable way to inspect this page in Chrome is REAL wheel scrolling — `window.scrollTo`/`scrollTop` are JS-locked (GSAP normalizeScroll), so scripted scroll stays at 0.

### AD6 — Step 6: Vividness ramp (GSAP)

**STATUS (2026-07-15): DONE — awaiting dev-server verify.** `CONFIG` gained `vividFrom {saturate:0.4,brightness:0.85}`, `vividTo {1,1}`, `vividWindow:0.9`. `Slide` type gained `vivid?: boolean`; `vivid:true` set on the 9 photo image slides (NOT gradient panels 11.5/12.5, NOT the focus slide 3.25 which already animates its own blur filter). GSAP loop lives after the journey block in the desktop-only path: for each vivid slide it reads `window.__SLIDES__`, finds the section by `data-slide`, and scrubs `filter: saturate()/brightness()` on the `<img>` only (scoped repaint, `will-change:filter`) via a timeline dull→full→dull, keyed to `anchorCenter(sec) ± vividWindow*vw` through `getScrollPos()`. Full colour lands at centre. Perf: filter is on the img, not the section; test scroll in DevTools perf as noted below.



- One generalised loop: every slide with `vivid: true` gets `filter: saturate(S) brightness(B)` scrubbed from `{saturate: 0.4, brightness: 0.85}` → `{1, 1}` as the slide's anchor approaches viewport centre, and optionally back down as it exits. Curve constants live in the top-level `CONFIG` (`vividFrom`, `vividTo`, `vividWindow`).
- Desktop only (inside the post-`isMobile` path). Watch perf: filter animations repaint — apply only to the slide's content/image wrapper, not the whole section; keep `will-change` scoped.
- Verify: slides visibly "come alive" at centre; no scroll jank (test with DevTools performance).

### AD7 — Step 7: Mobile regression pass

**STATUS (2026-07-15): code-audited clean; on-device verify still pending.** Confirmed none of AD2–AD6 leaks into mobile: `isMobile` early-return still disables all GSAP (journey + vivid ramp included); `is-mobile-snap` CSS intact; image slides `hidden md:flex` (masks/vivid never render); Belief `bg-accent md:bg-transparent` keeps opaque amber on mobile; `#journey-bg` is `hidden md:block`; AD3 inline `grid-column` is inert on mobile (parent only a grid at `md:`+); `applyWidths` forces 100vw on mobile.

**DEV control added — "Journey only" switch:** a fixed top-right checkbox (desktop only) toggles `html.journey-only`, which fades `#horizontal-strip` to `opacity:0` so only `#journey-bg` shows — for tuning the colour flow. Sidebar stays for orientation. Markup + `is:global` style + `is:inline` script sit right after the `#journey-bg` div. Remove/comment out before production.



375/390/430px: snap intact, one slide per viewport, opaque per-slide backgrounds intact, no horizontal overflow, no GSAP running (early-return path), images/masks not applied on mobile. Then desktop re-check at 1024/1280/1440/1920.
