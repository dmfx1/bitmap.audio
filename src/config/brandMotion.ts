/* src/config/brandMotion.ts
 *
 * SINGLE SOURCE OF TRUTH for the brand wordmark motion (nav + intro), site-wide.
 * Tune these to change how long "bitmap.audio" holds before scrambling to the
 * page name, and how fast the scramble in/out runs. Imported by:
 *   - Navigation.tsx      (BrandLockup — the persistent nav wordmark AND the
 *                          single-source-of-truth entry intro; IntroSequence.tsx
 *                          was the old overlay POC and has been retired)
 *   - Layout.astro        (resolves the page name from the current route)
 */

export const BRAND_NAME = 'bitmap.audio';

export const BRAND_MOTION = {
  /** Wordmark fade-in on first page load (ms). */
  fadeInMs: 650,
  /** How long "bitmap.audio" is shown before it scrambles to the page name. */
  brandHoldMs: 850,
  /** Duration of the scramble-OUT (bitmap.audio dissolves into binary). */
  scrambleOutMs: 420,
  /** Duration of the scramble-IN (binary resolves into the page name). The chunky
      flicker (a few 0/1s per letter) comes from flickerMs, not a long duration. */
  scrambleInMs: 520,
  /** How often the 0/1s re-roll during ANY scramble (ms). Bigger = fewer, chunkier
      binary digits per letter. Shared by the wordmark, the bitmap.audio dissolve,
      and the typewriter cursor. */
  flickerMs: 55,
  /** Speed at which the wordmark travels from far-left to its resting spot. */
  travelMs: 650,
  /** Snappy fade for the b + nav appearing on arrival, and the overlay clearing. */
  revealMs: 200,
  /** Slow, subtle fade-in for the binary rain AFTER the b/nav appear. */
  rainFadeMs: 3200,

  /* ── Entry intro: centred logo flicker-assembles, holds, then flicker-scales OUT in
     place; the resting nav then simply APPEARS at the top (no slide, no CRT). ── */
  /** How long the centred b + bitmap.audio hold after assembling, before flickering out. */
  introHoldMs: 20,
  /** Flicker-scale-OUT of the centred logo (mirrors bitmap-in). */
  flickerOutMs: 340,
  /** Flicker-OUT on mobile — quicker than desktop so it doesn't feel laggy. */
  flickerOutMsMobile: 260,
} as const;

/**
 * Route -> page name shown by the wordmark. Return value === BRAND_NAME means
 * "no scramble" (the wordmark just rests as bitmap.audio — e.g. the home page).
 */
const ROUTE_NAMES: Record<string, string> = {
  '/home': 'home',
  '/about': 'about us',
  '/about-v2': 'about us',
  '/about-v3': 'about',
  '/contact': 'contact',
  '/faq': 'faq',
  '/returns': 'returns',
  '/returns2': 'returns',
  '/solutions/sonic-branding': 'sonic branding',
  '/solutions/uiux-sound': 'ui/ux sound',
  '/solutions/spatial-audio': 'spatial audio',
};

export function resolvePageName(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
  return ROUTE_NAMES[clean] ?? BRAND_NAME;
}

/**
 * Adaptive scramble-IN duration for the page-title wordmark. `bitmap.audio` (the
 * reference length) resolves at scrambleInMs; SHORTER titles resolve a little
 * SLOWER so they don't flash by — the reveal is always left-to-right regardless.
 */
export function scrambleInMsFor(len: number): number {
  const REF = BRAND_NAME.length;          // 12 = 'bitmap.audio'
  const base = BRAND_MOTION.scrambleInMs; // duration at the reference length
  const perShortChar = 42;                // each char shorter than REF adds this
  const ms = base + Math.max(0, REF - len) * perShortChar;
  return Math.min(ms, base + 9 * perShortChar); // cap (~898ms) so it never drags
}
