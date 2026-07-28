/* src/config/brandMotion.ts
 *
 * SINGLE SOURCE OF TRUTH for the brand wordmark motion (nav + intro), site-wide.
 * Tune these to change how long "bitmap.audio" holds before scrambling to the
 * page name, and how fast the scramble in/out runs. Imported by:
 *   - Navigation.tsx      (the persistent nav wordmark)
 *   - IntroSequence.tsx   (the first-visit entry overlay)
 *   - Layout.astro        (resolves the page name from the current route)
 */

export const BRAND_NAME = 'bitmap.audio';

export const BRAND_MOTION = {
  /** Wordmark fade-in on first page load (ms). */
  fadeInMs: 650,
  /** How long "bitmap.audio" is shown before it scrambles to the page name. */
  brandHoldMs: 850,
  /** Duration of the scramble-OUT (current text dissolves into binary). */
  scrambleOutMs: 320,
  /** Duration of the scramble-IN (binary resolves into the new text). */
  scrambleInMs: 440,
  /** Speed at which the wordmark travels from far-left to its resting spot. */
  travelMs: 650,
  /** Snappy fade for the b + nav appearing on arrival, and the overlay clearing. */
  revealMs: 200,
  /** Slow, subtle fade-in for the binary rain AFTER the b/nav appear. */
  rainFadeMs: 3200,
} as const;

/**
 * Route -> page name shown by the wordmark. Return value === BRAND_NAME means
 * "no scramble" (the wordmark just rests as bitmap.audio — e.g. the home page).
 */
const ROUTE_NAMES: Record<string, string> = {
  '/home': 'home',
  '/about': 'about us',
  '/about-v2': 'about us',
  '/contact': 'contact',
  '/faq': 'faq',
  '/returns': 'returns',
  '/returns2': 'returns',
  '/solutions/sonic-branding': 'sonic branding',
  '/solutions/uiux-sound': 'ui/ux sound',
  '/solutions/experiential-audio': 'experiential audio',
};

export function resolvePageName(path: string): string {
  const clean = path.replace(/\/+$/, '') || '/';
  return ROUTE_NAMES[clean] ?? BRAND_NAME;
}
