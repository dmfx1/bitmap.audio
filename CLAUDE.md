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

### 1. Global layout padding — consistent in one place

**Goal:** Every mobile page should have `px-4 py-8` as its base container padding, defined once in the layout.

1. Open `src/layouts/Layout.astro` (the root layout wrapper).
2. Locate the `<main>` or outer `<div>` that wraps the page slot.
3. Add responsive padding so mobile gets `px-4 py-8` and larger screens scale up:
   ```
   class="px-4 py-8 md:px-8 lg:px-16"
   ```
4. Remove any hard-coded `px-*` / `py-*` / `p-*` padding from individual page components that duplicates or conflicts with the layout-level padding — pages should rely on the layout for outer spacing.
5. Double-check every page after — none should feel too tight or too wide on a 375px viewport.

---

### 2. Sticky / fixed header on scroll

**Goal:** The site header remains visible as the user scrolls on mobile.

1. Open `src/components/Navigation.tsx`.
2. Add `sticky top-0 z-50` to the header's outermost element, or the CSS equivalent:
   ```css
   position: sticky;
   top: 0;
   z-index: 50;
   ```
3. Ensure the header has a solid background so content doesn't bleed through on scroll. If it uses a transparent/glass style, add the brand background colour as a solid fallback for mobile.
4. Cap header height at ~56–64px on mobile — it must not eat too much vertical space.
5. **Brave quirk:** `position: sticky` can fail inside overflow containers in Brave. If sticky doesn't hold in Brave testing, switch to `position: fixed` and add a matching `padding-top` on `<main>` equal to the header height.

---

### 3. Body / paragraph font size increase on mobile

**Goal:** All body-level text (paragraphs, descriptions, list items, captions) needs to be one step larger on mobile. The canonical example is the `<p>` under **Solutions → Sonic Branding** beginning "Your audience encounters thousands…" — every similar block site-wide needs the same treatment.

1. Open `src/styles/global.css` and find the `@layer base` block (or `body`, `p` selectors).
2. Bump paragraph text to **minimum 16px (1rem)** on mobile. If already 16px, bump to 17–18px:
   ```css
   @layer base {
     p, li, td, label {
       @apply text-base;   /* 16px minimum on mobile */
     }
   }
   ```
3. For **section description text** (copy beneath hero headlines, beneath solution headings) — replace any `text-sm` or `text-xs` instances with `text-base` at mobile breakpoints.
4. Audit these pages specifically:
   - `src/pages/solutions/sonic-branding.astro` — opening paragraph
   - All other `src/pages/solutions/*.astro` pages
   - `src/pages/home.astro` — descriptive paragraphs below hero/feature blocks
   - `src/pages/about.astro` and `src/pages/contact.astro` body copy
5. Do **not** change headline sizes (`h1`–`h3`) — only body/description copy.

---

### 4. Navigation dropdown — larger tap targets + Solutions always open on mobile

**Goal:** The nav must be finger-friendly. The Solutions submenu should be expanded by default on mobile.

#### 4a — Tap target sizes

1. Open `src/components/Navigation.tsx`.
2. All nav links and dropdown items must be at least **44×44px** (Apple HIG / WCAG standard):
   ```
   className="min-h-[44px] px-4 flex items-center"
   ```
   Apply to every `<a>` and `<button>` inside the mobile nav.
3. Nav item font size on mobile must be at least `text-base` (16px).
4. Add sufficient padding between items — `gap-1` or `space-y-1` minimum so nothing feels cramped.

#### 4b — Solutions dropdown: always open on mobile

1. Find the `isSolutionsOpen` state and its toggle in `Navigation.tsx`.
2. Initialise it to `true` when the viewport is mobile:
   ```tsx
   const [isSolutionsOpen, setIsSolutionsOpen] = useState(
     typeof window !== 'undefined' && window.innerWidth < 768
   );
   ```
3. On desktop, preserve the existing click/hover toggle behaviour unchanged.
4. Style the always-open submenu on mobile: indent slightly with `pl-4` so it reads as a submenu visually.

> **Note:** The existing behaviour (collapsed by default, resets on menu close) is documented in this file under "Navigation". The change above overrides initial state on mobile only — the close-reset logic can remain for desktop.

---

### 5. Hero section bottom padding — cross-browser consistency

**Goal:** Hero sections on every page must not clip content or allow the section below to overlap, on any browser (Brave, Safari, Chrome, Firefox).

The problem is usually one of:
- `min-h-screen` / `100vh` cutting off content when Brave/Safari show/hide their address bar (dynamic toolbar)
- Missing explicit `padding-bottom`
- A negative `mt-*` on the following section pulling it over the hero

**Fix 1 — Dynamic viewport height.** Replace `h-screen` / `min-h-screen` with:
```
className="min-h-svh"   /* Tailwind v3.4+ — uses 100svh */
```
If Tailwind doesn't support `svh`, add to `global.css`:
```css
.hero {
  min-height: 100svh; /* small viewport height — excludes browser chrome */
}
```
Or use the JS `--vh` workaround if `svh` isn't available:
```css
.hero { min-height: calc(var(--vh, 1vh) * 100); }
```
```js
const setVh = () =>
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
window.addEventListener('resize', setVh);
setVh();
```

**Fix 2 — Explicit bottom padding.** Every hero section needs:
```
className="... pb-16 md:pb-24"
```

**Fix 3 — Remove negative margins on next section.** Check the element immediately after each hero for `-mt-*` or absolute `top-*` positioning that causes overlap. Convert to a positive margin or remove.

Apply to every page with a hero: `home.astro`, `index.astro`, `about.astro`, `contact.astro`, `solutions/*.astro`.

---

### 6. Audit checklist (run after all changes)

Verify at **375px** (iPhone SE) and **390px** (iPhone 14) in Chrome DevTools, Brave, and Safari:

- [ ] All pages have consistent `px-4 py-8` outer padding
- [ ] Header sticks to top while scrolling in all three browsers
- [ ] Paragraph text is at least 16px everywhere
- [ ] Nav items are easily tappable (≥44px height)
- [ ] Solutions submenu is pre-expanded in mobile nav
- [ ] Hero text is never clipped; the section below never overlaps
- [ ] No horizontal scroll at any breakpoint
- [ ] Portrait and landscape both tested
