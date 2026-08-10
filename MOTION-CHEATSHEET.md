# bitmap.audio — Motion Tuning Cheat Sheet

Quick reference for every scroll/intro motion knob and where it lives. All values are the
current defaults. Companion to `CLAUDE.md` (conventions) and the `MOTION-PLAN.md` (roadmap).

> Mental model: almost everything is **scroll-linked** (scrubbed to scroll position, no
> time-based duration), so "speed" = the **scroll distance** an effect is spread over.
> Bigger distance = slower/gentler; smaller = faster/snappier.

---

## 1. Entry intro (the b + bitmap.audio choreography)

**File:** `src/config/brandMotion.ts` → `BRAND_MOTION` (all in ms)

| Knob | Default | What it does |
|---|---|---|
| `fadeInMs` | 650 | Centre `bitmap.audio` fade-in before it holds |
| `introHoldMs` | 700 | How long the centred b + wordmark hold before lifting |
| `liftMs` | 900 | Speed of the whole-stage lift to the top bar |
| `crtMs` | 360 | CRT power-off of `bitmap.audio` (vertical squeeze + snap) |
| `scrambleInMs` / `scrambleOutMs` | 520 / 420 | Scramble resolve / dissolve durations |
| `flickerMs` | 55 | How often the 0/1s re-roll (bigger = chunkier) |
| `rainFadeMs` | 3200 | Binary rain fade-in after the brand assembles |

- **Adaptive title speed** (shorter titles resolve a touch slower): `scrambleInMsFor()` →
  `perShortChar` (42) in the same file.
- **Page titles per route:** `ROUTE_NAMES` map in the same file.
- **Replay policy:** `firstVisit` in `Navigation.tsx` (currently always `true` = replays every
  load; flip to session-based later).

---

## 2. Header / nav squish on scroll

**File:** `src/layouts/Layout.astro` → the `<script>` near the bottom

| Knob | Default | What it does |
|---|---|---|
| `HEADER_START` | 220 | **px scrolled before the header reacts** — so the hero text pulls FIRST, header follows. Bigger = text leads more. |
| `SQUISH_DIST` | 200 | **Squish speed** — px the squish is spread over (smaller = faster/snappier). |
| `SOLID_DIST` | 160 | px the glass bar takes to fade in |
| `BRAND_MIN` | 0.72 | How small the **brand/title** shrinks |
| `NAV_MIN` | 0.86 | How small the **nav** shrinks (less than the brand) |

- **Scale anchors** (which corner each shrinks toward): `Navigation.tsx` — brand `transformOrigin: 'top left'`, nav row `'top right'`.
- **Nav rises to meet the title top when squished:** the `--nav-lift` line in the same script (auto-derived from `brandH`/`panelH`).
- No CSS transition on the transform → it tracks scroll 1:1 (tight, no lag).

**Header bar (glass):** `src/layouts/Layout.astro` → the `#header-bar` div — `blur(14px)`,
`hsl(var(--background) / 0.5)` tint, height `calc(gutter + brandH)`. Uses `--background` so it
adapts to the section theme (dark → beige later).

---

## 3. Hero text "pull into the glare" (subtitle + blurb)

**File:** `src/hooks/use-hero-squish.ts` → `HERO_SQUISH`

| Knob | Default | What it does |
|---|---|---|
| `end` | `'+=80%'` | **Pull speed** — scroll it's spread over. Bigger = slower/more gradual. |
| `titlePull` | 0.5 | How far the subtitle travels toward centre (slow) |
| `subPull` | 1.0 | How far the blurb travels (faster / further → sucked in quicker) |
| `shrink` | 0.55 | How much a fully-pulled layer scales down (× its pull) |

- **Which elements pull:** wrappers marked `data-hero-pull="title"` / `="sub"` in each hero.
- **Stacking:** subtitle sits above the blurb — `[data-hero-pull]` z-index rules in `global.css`.
- Desktop only; reduced-motion skips it.

---

## 4. The runway (how long the hero holds before content covers)

**File:** `src/styles/global.css` → `--hero-runway`

| Knob | Default | What it does |
|---|---|---|
| `--hero-runway` | 85svh | Transparent scroll distance after each hero. The hero stays pinned and the pull plays out over this before the next section rises to cover it. |

**⚠️ Coupling:** keep `--hero-runway` ≈ `HERO_SQUISH.end` (85svh ↔ 80%). To make the pull
genuinely slower AND still finish before content arrives, raise **both** together
(e.g. `end: '+=120%'` + `--hero-runway: 120svh`).

---

## 5. Hero copy width

**File:** `src/styles/global.css`

| Knob | Default | What it does |
|---|---|---|
| `--hero-copy-max` | 64rem | Max width of all hero copy (title + body), site-wide |

Applied via the `.hero-copy` class on the title/body wrappers — change the var, not per h/p.

---

## 6. Hero title scramble (the reveal)

**File:** `src/components/modules/ScrambleHeading.tsx` (props / defaults)

| Knob | Default | What it does |
|---|---|---|
| `resolveMs` | 360 | Window over which all chars flip 0/1 → letters (random) |
| `startDelayMs` | 110 | Brief pure-binary hold before the resolve |
| `flickerMs` | `BRAND_MOTION.flickerMs` | 0/1 re-roll cadence |

---

## 6b. Colour world — dark hero → beige content + solaris beam

**File:** `src/styles/global.css` → `:root` (LAYER 5 block). All editable in one place.

| Knob | Default | What it does |
|---|---|---|
| `--content-background` | `48 20% 90%` | The beige ("Cool Oat") page background for post-hero sections |
| `--content-foreground` | `48 10% 13%` | Text colour in the beige world |
| `--content-accent` | `28 90% 45%` | Orange, deepened for contrast on cream |
| `--content-card` / `-border` / `-muted` / `-muted-foreground` / `-primary` | — | Rest of the beige palette |
| `--solaris-height` | `8px` | **Beam thickness** — make it bigger here |
| `--solaris-from` / `-mid` / `-to` | `#FF9E1A` / `#FFC24A` / `#FFEEB8` | Beam gradient stops (accent → hot) |
| `--solaris-glow` | `0 0 24px rgba(255,180,60,.5)` | Beam glow |
| `--solaris-text` | `180 10% 12%` | Label colour when text sits on the beam |

- **The beige world** is applied via the `.theme-oat` class on each page's post-hero content
  wrapper (maps the shadcn tokens → `--content-*`).
- **The beam** is a component: `<Solaris />` or `<Solaris text="THE WORK" />` (`src/components/Solaris.astro`).
- Placement per page: after `.hero-runway`, before the `.theme-oat` content wrapper.

---

## 6c. About horizontal scroll (trial)

The founders slide in from the right, led by the vertical solaris beam, over the frozen-rain
dark hero. About-only for now.

| Knob | Where | What it does |
|---|---|---|
| `end: '+=120%'` | `about-v2.astro` → the horizontal-scroll `<script>` | How long the horizontal scroll lasts (bigger = slower / more travel) |
| `start: 'top top'` | same `<script>` (ScrollTrigger) | When the horizontal begins |
| **lead-in** | delete/keep the `.hero-runway` div on the page | Runway present = ~1 viewport of hold before the horizontal; removed = starts right after the hero pull (current state on About) |
| `--solaris-height` | `:root` (global.css) | Beam thickness (96px) |
| `--solaris-from/-mid/-to` | `:root` | Beam gradient (runs the length of the beam) |
| rain freeze | automatic | `data-rain-frozen` toggles on `<html>` while the scroll is pinned (see `GridBackground.astro`) |

> To make the horizontal start *sooner*: it already follows the hero pull immediately (runway
> removed). To start it *during* the pull (scroll 0), the founders would need to overlay the
> hero rather than be the next section — a small restructure, not yet done.

---

## 7. Global spacing / foundation

**File:** `src/styles/global.css`

| Knob | Default | What it does |
|---|---|---|
| `--page-gutter` | 2rem | The single gutter (side + top) for every section, nav, hero |
| `--brandH` | `clamp(3rem, 6vw, 6.5rem)` | Brand mark + page-title lettering size (nav bottom-aligns to it) |

**Smooth scroll:** `src/lib/smooth-scroll.ts` (Lenis `duration` / `easing`; gated off on
returns pages via `<html data-smooth="off">`). Shared ease: `src/lib/motion.ts` → `EASE`.

---

## Common "I want to…" recipes

- **Text should lead the header more** → raise `HEADER_START` (Layout.astro).
- **Header squish quicker / slower** → lower / raise `SQUISH_DIST` (Layout.astro).
- **Text pulls in slower** → raise `HERO_SQUISH.end` AND `--hero-runway` together.
- **Hero holds longer before content covers** → raise `--hero-runway`.
- **Blurb goes further into the void than the title** → raise `subPull` (already 1.0 vs 0.5).
- **Narrower/wider hero text** → `--hero-copy-max`.
- **Whole intro faster/slower** → the ms values in `BRAND_MOTION`.
