# bitmap.audio: architecture map and refactor (2026-11-04)

Branch: `refactor/cleanup` (off `main` @ `baec50a`). Behaviour is unchanged. Everything below was checked against a build of `main` (see **Verification**).

---

## 1. Architecture summary

**Stack:** Astro 5 (static, 10 routes) · React 19 islands · Tailwind 3 + HSL CSS variables · GSAP 3.14 + ScrollTrigger · Lenis smooth scroll.

```
src/pages/*.astro ──► src/layouts/Layout.astro (global shell, every page except "/")
                         ├─ <head>: intro-gate inline script, SEO/OG/JSON-LD, fonts
                         ├─ GridBackground.astro      fixed binary rain (#grid-bg) / grid on returns
                         ├─ Navigation.tsx (client:load) brand wordmark intro + scramble, nav, mobile menu
                         ├─ #nav-top-cover / #header-bar / #dock-title   header "squish" chrome
                         ├─ <slot/> page content
                         ├─ Footer.astro + page-bottom runway
                         ├─ cursor glow + bit cursor, scroll fader, #dev-hud
                         ├─ inline scripts → ONE shared scroll scheduler (window.__bmOnScroll)
                         │     fader · nav contrast · nav cover · mobile glow · section docking · header squish
                         └─ lib/smooth-scroll.ts  Lenis ⇄ GSAP ticker (off on /returns via data-smooth="off")
```

There are **three page architectures**:

| Pattern | Pages | How scroll works |
|---|---|---|
| **Scene stage** | `home`, `about` | `#stage-track` (1300–1400vh) + sticky `.stage-pin`. One scrubbed GSAP master timeline cross-fades stacked full-screen `.scene` layers. Shared helpers in `lib/stage.ts`. Mobile: scenes unstack to normal scroll with an IntersectionObserver reveal (`lib/pixel-veil.ts`). |
| **Vertical lock** | `solutions/*`, `contact`, `faq`, `404` | Sticky hero (`#hero-sticky`) the beige `.theme-oat` body rises over. `Solaris` section bars dock into the header (Layout docking script). `FocusScroll` locks each section. `[data-fly]` boxes fly in via the Layout IntersectionObserver. |
| **Horizontal strip** | `returns` | 2,500-line self-contained page: 1600vh track → `#horizontal-strip`, `SLIDES` config, colour JOURNEY, `ImageSlide`. Owns its own scroll (`normalizeScroll`). Protected: not touched here. |

**Data flow.** All content is hard-coded in pages/components (no CMS). Route → page name lives in `config/brandMotion.ts` (`resolvePageName`) → `Navigation` wordmark. Video slugs come from `data/videos.ts` → `PlayReelButton` → `VideoModal`. Cross-component signals are DOM-level, not React: `html.intro-play` (session intro gate), the `hero-content-ready` CustomEvent, CSS vars written by scripts (`--brand-scale`, `--nav-scale`, `--header-solid`, `--dock`, `--phil-progress`, `--reveal`), and `html.nav-over-oat` / `nav-docked`. Islands never share React state. That is why context providers can't work here (see P1).

---

## 2. Problem list

Severity: 🔴 high · 🟠 medium · 🟡 low. ✅ = fixed on this branch.

### Structural
- ✅🔴 **P1: Dead page-wide React islands.** `Layout.astro` wrapped the whole page in `<SoundProvider client:load>` and `<TooltipProvider client:load>`. In Astro, context cannot cross island boundaries, nothing calls `useSound()`, and no tooltip exists. Both hydrated on every page for nothing and pulled in the 34 KB Radix tooltip chunk.
- ✅🟠 **P2: Dead branches in Layout.** `isLandingPage` was always false (`/` is a standalone redirect that never uses Layout), so `!isLandingPage && !isReturnsPage` repeated six times. The `isFullBleed` branch duplicated the footer and runway markup.
- ✅🟡 **P3: No-op link interceptor** ("THE LATERAL FIX"). It `preventDefault`ed internal links and then set `location.href`, which is exactly what the browser does anyway. It only bound links present at parse time, so not the React nav.
- ✅🟡 **P4: Unreachable module.** `lib/scene.ts` (the pinned-scene framework) wasn't imported anywhere.
- 🟠 **P5: `DeliverablesGrid` is orphaned.** CLAUDE.md calls it the shared "What you'll receive" section for all three solutions pages, but no page renders it. `sonic-branding` imported it with an unused `sonicDeliverables` array (import removed). Decide whether it comes back.
- 🟡 **P6: CLAUDE.md has drifted from the code.** It describes `about-v3`, `returns2`, `index` splash, "home: no GSAP", etc. At 59 KB plus a 300 KB archive it's expensive context for every agent session. Worth a trim.

### Duplicate code
- ✅🔴 **D1: Three identical solution heroes** (`SonicHero`/`UIUXHero`/`ImmersiveHero`, ~60 lines each, differing only in copy and reel slug) → `SolutionHero.tsx` with props. Copy now lives on each page.
- ✅🟠 **D2: Three identical analysis blocks** (`*Analysis.tsx`) → `SolutionAnalysis.astro`. These were also hydrated islands with no interactivity, now zero JS.
- ✅🔴 **D3: Scene-stage engine copy-pasted between `home` and `about`.** Page bar, `setBar`/`clearBar`, `boundary`/`atDir`/`crossLabel`, master timeline + HUD, the enter-the-void beat and the bar push are now in `lib/stage.ts`.
- ✅🟠 **D4: Pixel-veil builder ×2** (`CtaScene`, `about`) and **mobile scene reveal ×2** (`home`, `about`) → `lib/pixel-veil.ts`.
- ✅🟡 **D5: Reduced-motion check ×2** (`motion.ts`, `scene-kit.ts`). `scene-kit.reduced` now aliases `prefersReducedMotion`.
- 🟠 **D6: Stage CSS duplicated** in `home.astro`/`about.astro` scoped styles (`.stage-pin`, `.scene`, `.scene-body`, fog, portal, `#page-bar`, mobile unstack). Not moved yet: scoped → global changes specificity against global `.scene` rules, so it needs its own visual pass.
- 🟠 **D7: Binary-scramble logic ×6** (`use-binary-scramble`, `use-scramble-transition`, `ScrambleHeading`, `Clients`, `Founders`, `scene-kit.scrambleIn`, plus `Navigation`). Each has deliberately different timing, so a merge needs dom's eye on feel.
- 🟡 **D8: About renders its own CTA markup and `.cta-head`/`.cta-link` styles** instead of `<CtaScene>`.

### Performance
- ✅🔴 **F1: ~40 unused npm dependencies** (27 Radix primitives, recharts, react-hook-form, zod, date-fns, embla, vaul, sonner, cmdk, next-themes, `@tailwindcss/vite` (Tailwind v4 next to v3), `@fontsource/source-code-pro`, …). 126 packages removed from `node_modules`. None reached the bundle, but they slow installs and enlarge the audit surface.
- ✅🔴 **F2: Six scroll listeners, one rAF per scroll event each.** A busy frame ran every handler several times. Now a single rAF-throttled scheduler, one pass per frame. The cursor follower is throttled the same way.
- ✅🟠 **F3: Render-blocking font chain.** Google Fonts came through `@import` inside the bundled CSS (HTML → CSS → fonts CSS → fonts). Now `preconnect` + `<link>` in `<head>`, with the same families and weights.
- ✅🟠 **F4: About values loop called `getComputedStyle` every frame** forever (a forced style recalc during GSAP scrubbing). It now reads GSAP's inline opacity.
- 🟠 **F5: GSAP + ScrollTrigger parsed on mobile** for home/about even though the stage bails below 768px. Parked by dom on 2026-11-03 (see project follow-ups).
- 🟠 **F6: `returns.astro` is 162 KB / 2,500 lines in one file.** Known scroll lag (CLAUDE.md). Protected, so untouched.
- 🟡 **F7: 15 MB of unreferenced source PNGs** in `src/assets/images/*-headshot-01.png`. The site uses the `public/*.webp`. No runtime cost, but they bloat the repo (`.git` is 205 MB).

### Technical debt / latent bugs (not fixed: fixing would change behaviour)
- 🔴 **B1: About page ships prototype SEO:** `title="About v3 (scene stage) | bitmap.audio"`, `description="Scene-stage prototype."`. Fold into the copy rewrite.
- 🟠 **B2: `duration-[2000ms]` in `Founders.tsx` is ambiguous** (Tailwind build warning), so the class isn't generated and the shimmer runs at the default 150 ms. Use `[transition-duration:2000ms]` if 2 s was intended.
- 🟠 **B3: `returns` `animateWords` passes `hsl(var(--…))` to GSAP colour tweens** and throws on every refresh (already in CLAUDE.md).
- 🟡 **B4: `sitemap.xml` lists `/`,** which is a `noindex` meta-refresh to `/home`.
- 🟡 **B5: Two console errors on every page** in both builds (pre-existing; seen in headless).
- 🟡 **B6: `tailwind.config.ts` uses `require()`** inside an ESM TS file (works via jiti; `import` is cleaner).

---

## 3. What changed on this branch

| File | Change |
|---|---|
| `package.json` / lock | −40 unused deps |
| `layouts/Layout.astro` | P1, P2, P3, F2, F3 |
| `styles/global.css` | font `@import` removed (moved to `<head>`) |
| `lib/stage.ts` **(new)** | D3 shared scene-stage helpers |
| `lib/pixel-veil.ts` **(new)** | D4 veil + mobile reveal |
| `pages/home.astro`, `pages/about.astro` | use `lib/stage` + `lib/pixel-veil`; F4 |
| `components/modules/CtaScene.astro` | uses `fillPixelVeil` |
| `modules/solutions/SolutionHero.tsx` **(new)** | D1 |
| `modules/solutions/SolutionAnalysis.astro` **(new)** | D2 (static, no JS) |
| `pages/solutions/*.astro` | page copy objects; dead imports removed |
| `lib/scene-kit.ts` | D5; doc comment no longer references scene.ts |
| **deleted** | `context/SoundContext.tsx`, `ui/tooltip.tsx`, `lib/scene.ts`, 6 × `solutions/*Hero/*Analysis.tsx` |
| `CLAUDE.md` | file map + stale rules updated |

### Impact (gzipped JS per page, main → branch)

| Page | JS | Hydrated islands |
|---|---|---|
| home | 159.7 → 147.2 KB | 6 → 4 |
| about | 161.2 → 148.3 KB | 6 → 4 |
| sonic-branding | 154.9 → 140.9 KB | 5 → 2 |
| uiux-sound / immersive | 158.4 → 144.3 KB | 6 → 3 |
| contact / faq / 404 / returns | ≈ −13.7 KB each | −2 each |

## 4. Verification
- `npm run build` ✅ (10 pages, no new warnings).
- Both builds served side by side and scripted with Playwright: 9 pages × desktop 1440 + mobile 390 × 6 scroll stops = 108 screenshot pairs. Page heights match (FAQ desktop is 1 px taller: whitespace between block elements in Astro output). Console errors are the same set. Stage timeline totals are identical (home 11.3, about 36.0), and settled timeline positions and page-bar labels match at every stop. Remaining pixel differences are random scramble digits / binary rain and scrub catch-up in the first ~1 s.
- Solutions hero + analysis DOM: same text and classes. The only difference is inter-element whitespace.
- **Still worth a manual pass in `npm run dev`:** real wheel scroll through home + about (scripted scroll can't fully reproduce Lenis), the nav intro, and the sticky docking bars.

---

## 5. Refactoring plan (next phases)

Ordered by value ÷ risk. Each phase is its own branch and ends with `npm run build` plus a visual pass.

1. **Quick wins (≈1 h).** B1 about title/meta (with copy lock), B2 `duration-[2000ms]`, B4 sitemap, delete or move the F7 PNGs out of the repo, decide on P5 `DeliverablesGrid`.
2. **Mobile GSAP lazy-load (F5).** Dynamic `import('gsap')` inside the desktop branch on home/about. Lighthouse before/after. (Parked until the copy is final.)
3. **Stage CSS → shared stylesheet (D6).** Extract `.stage-pin/.scene/.scene-body/.stage-fog/.stage-portal/#page-bar` + mobile unstack into `styles/stage.css`, scoped under `#stage-track` so specificity stays ≥ the scoped originals. Then extract a `<SceneStage>` Astro component (track + pin + fog + portal + page bar) so a new stage page is ~20 lines.
4. **About CTA → `<CtaScene>` (D8)**, removing the duplicate CTA styles.
5. **Scramble primitive (D7).** A single `lib/binary.ts` (`randomBit`, `scrambleString(text, revealMask)`), with each hook keeping its own timing. Needs dom's sign-off on feel.
6. **Layout inline scripts → modules.** The six inline scripts become small typed modules under `src/lib/chrome/*` on the shared scheduler (keep the `<head>` intro gate inline: it must run before paint).
7. **`returns.astro` split (F6, with dom).** Move `SLIDES`/`JOURNEY`/`CONFIG` to `src/data/returns.ts`, GSAP to `src/lib/returns/*.ts`, and slide markup to components. Do the perf pass (CSS transitions → GSAP) at the same time.
8. **Audio interactivity (future — the core of the business).** Not scheduled yet. When it starts: add a shared sound store (nanostores, persisted mute + "audio unlocked" flag) that every island can read; convert any static component that gets sound (e.g. `SolutionAnalysis.astro`) back to a `.tsx` island with the same props; one clear sound on/off control, default muted until a user gesture.
9. **Docs diet (P6).** Cut CLAUDE.md to current conventions (≈10 KB) and move session logs to the archive.
