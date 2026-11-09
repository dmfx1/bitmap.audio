/* src/lib/bit-motifs.ts
 *
 * The bitmap pixel motifs, one per philosophy stage (pixel → bits → map → master → stems → result).
 * Shared by PhilosophyScene (mobile captions) and ProcessWords (step icons) — edit them HERE.
 * Raw SVG strings, injected with set:html.
 */
export const MOTIFS = {
  pixel: '<svg viewBox="0 0 72 72"><rect width="72" height="72" fill="#ECEAE0"/></svg>',
  bits: '<svg viewBox="0 0 220 22"><rect x="6" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="30" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="54" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="78" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="100" y="0" width="22" height="22" fill="#FFFFFF"/><rect x="130" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="154" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="178" y="4" width="14" height="14" fill="#ECEAE0"/><rect x="202" y="4" width="14" height="14" fill="#ECEAE0"/></svg>',
  map: '<svg viewBox="0 0 88 88"><rect x="0" y="0" width="26" height="26" fill="#ECEAE0"/><rect x="31" y="0" width="26" height="26" fill="#ECEAE0"/><rect x="62" y="0" width="26" height="26" fill="#ECEAE0"/><rect x="0" y="31" width="26" height="26" fill="#ECEAE0"/><rect x="31" y="31" width="26" height="26" fill="#ECEAE0"/><rect x="62" y="31" width="26" height="26" fill="#ECEAE0"/><rect x="0" y="62" width="26" height="26" fill="#ECEAE0"/><rect x="31" y="62" width="26" height="26" fill="#ECEAE0"/><rect x="62" y="62" width="26" height="26" fill="#ECEAE0"/></svg>',
  master: '<svg viewBox="0 0 76 76"><defs><filter id="pg4" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7"/></filter></defs><rect width="76" height="76" fill="#FF9E1A" filter="url(#pg4)"/><rect width="76" height="76" fill="#FF9E1A"/></svg>',
  stems: '<svg viewBox="23 23 154 154"><g stroke="#FFFFFF" stroke-width="4" stroke-linecap="square"><line x1="100" y1="100" x2="100" y2="34"/><line x1="100" y1="100" x2="147" y2="53"/><line x1="100" y1="100" x2="166" y2="100"/><line x1="100" y1="100" x2="147" y2="147"/><line x1="100" y1="100" x2="100" y2="166"/><line x1="100" y1="100" x2="53" y2="147"/><line x1="100" y1="100" x2="34" y2="100"/><line x1="100" y1="100" x2="53" y2="53"/></g><rect x="89" y="23" width="22" height="22" fill="#FF9E1A"/><rect x="136" y="42" width="22" height="22" fill="#FF9E1A"/><rect x="155" y="89" width="22" height="22" fill="#FF9E1A"/><rect x="136" y="136" width="22" height="22" fill="#FF9E1A"/><rect x="89" y="155" width="22" height="22" fill="#FF9E1A"/><rect x="42" y="136" width="22" height="22" fill="#FF9E1A"/><rect x="23" y="89" width="22" height="22" fill="#FF9E1A"/><rect x="42" y="42" width="22" height="22" fill="#FF9E1A"/><rect x="87" y="87" width="26" height="26" fill="#FFFFFF"/></svg>',
  result: '<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#FF9E1A"/><rect x="8" y="8" width="24" height="24" fill="#ECEAE0"/><rect x="38" y="8" width="24" height="24" fill="#ECEAE0"/><rect x="68" y="8" width="24" height="24" fill="#ECEAE0"/><rect x="8" y="38" width="24" height="24" fill="#ECEAE0"/><rect x="38" y="38" width="24" height="24" fill="#ECEAE0"/><rect x="68" y="38" width="24" height="24" fill="#ECEAE0"/><rect x="8" y="68" width="24" height="24" fill="#ECEAE0"/><rect x="38" y="68" width="24" height="24" fill="#ECEAE0"/><rect x="68" y="68" width="24" height="24" fill="#ECEAE0"/></svg>',
} as const;

export type MotifName = keyof typeof MOTIFS;

/** Philosophy order (index = stage). */
export const PHILOSOPHY_MOTIFS = [MOTIFS.pixel, MOTIFS.bits, MOTIFS.map, MOTIFS.master, MOTIFS.stems, MOTIFS.result];

/** A motif re-inked for use on a light surface: light fills/strokes follow --icon-ink, solaris fills follow
 *  --icon-hi, and 'result's small inner blocks follow --icon-ground (e.g. transparent = cut-outs).
 *  Presentation attributes can't take var(), so colours are rewritten as inline styles. */
export function inkedMotif(name: MotifName): string {
  const light = name === 'result' ? 'var(--icon-ground)' : 'var(--icon-ink)';
  return MOTIFS[name]
    .replace(/fill="#(ECEAE0|FFFFFF)"/g, `style="fill:${light}"`)
    .replace(/stroke="#FFFFFF"/g, 'style="stroke:var(--icon-ink)"')
    .replace(/fill="#FF9E1A"/g, 'style="fill:var(--icon-hi)"');
}
