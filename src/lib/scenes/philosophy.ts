/* src/lib/scenes/philosophy.ts
 *
 * THE PHILOSOPHY SCENE choreography, extracted verbatim from PhilosophyScene.astro so it can be
 * reused two ways WITHOUT changing a single beat:
 *   • about-v2 / PhilosophyScene.astro — via registerScene('bitmap-philosophy', buildPhilosophyScene),
 *     which pins the section and scrubs this timeline (scene.ts).
 *   • about-v3 (scene stage) — imported directly and added as a NESTED timeline into the master
 *     stage timeline, so it plays IN PLACE (no separate pin, no vertical scroll).
 *
 * The builder only ADDS tweens/sets to the timeline it's given + reads elements from `stage`. It has
 * no knowledge of how it's pinned/scrubbed — that's the caller's job. See the original header in
 * PhilosophyScene.astro for the stage-by-stage description.
 */
import { gsap } from 'gsap';
import {
  steps, glow, reduced, centerXY, ringPoint, equalGapCenters,
  gridCell as kitGridCell, bitmapAppear as kitBitmapAppear, crossfadeCaption, tvOut,
} from '../scene-kit';

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG — author the whole scene from here. Colours are on-brand hex.
   ───────────────────────────────────────────────────────────────────────────── */
const CONFIG = {
  colors: {
    void: '#1B2222',       // brand --background "The Void" (dark bg finishing point)
    beige: '#ECEAE0',      // journey light start (theme-oat) — entry
    inkOnLight: '#241F1A', // block on the light bg (≈ --content-foreground) — Stage 1
    foreground: '#F2F2F2', // block on the Void (≈ --foreground) — white bits, Stage 2→3
    bit: '#333F3E',        // dim / recessed (Stage 5 master)
    accent: '#FF9E1A',     // brand --accent / Solaris (Stage 4+)
    glow: 'rgba(255, 158, 26, 0.65)',
  },
  tile: 100,
  heroScale: 2.8,
  revealSteps: 6,
  lineupCentral: 1.3,
  gridGap: 20,
  lineupGap: 30,
  unifyGrow: 1.12,
  orbitRadius: 320,
  orbitSub: 1.4,
  orbitMain: 0.8,
  orbitSpins: 90,
  orbitSteps: 8,
  tetherWidth: 11,
  finalScale: 1.15,
  moveSteps: 7,
  mapSeg: 0.4,
  mapCascade: 0.09,
  glowPulse: 30,
  glowBig: 64,
  hold: 0.85,
};

const SUB_CELLS: Array<[number, number]> = [
  [2, 0], [1, 0], [0, 0], [0, 1],
  [2, 1], [2, 2], [1, 2], [0, 2],
];
const SLOTS = [0, 1, 2, 3, 5, 6, 7, 8];
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Adds the full 6-stage philosophy choreography to `tl`, reading elements from `stage`. */
export function buildPhilosophyScene(tl: gsap.core.Timeline, stage: HTMLElement): void {
  const bitGroup = stage.querySelector<SVGGElement>('#bit-group');
  const subGroup = stage.querySelector<SVGGElement>('#sub-group');
  const caps = stage.querySelectorAll<HTMLElement>('.scene-cap');
  if (!bitGroup || !subGroup || !caps.length) return;
  const philInner = stage.querySelector<HTMLElement>('.phil-inner');

  const { tile, colors } = CONFIG;
  const H = tile / 2;
  const CX = 600, CY = 500;
  const GP = tile + CONFIG.gridGap;
  const moveEase = steps(CONFIG.moveSteps);

  const toXY = (cx: number, cy: number) => centerXY(cx, cy, tile);
  const gridCell = (col: number, row: number): [number, number] => kitGridCell(col, row, CX, CY, GP);
  const lineupScale = (slot: number) => (slot === 4 ? CONFIG.lineupCentral : 1);
  const lineupCenters = equalGapCenters(Array.from({ length: 9 }, (_, s) => tile * lineupScale(s)), CX, CONFIG.lineupGap);
  const lineupPos = (i: number): [number, number] => [lineupCenters[SLOTS[i]], CY];
  const ringPos = (i: number): [number, number] => ringPoint(i, 8, CX, CY, CONFIG.orbitRadius);
  const subGrid = SUB_CELLS.map(([c, r]) => gridCell(c, r));
  const pitchFinal = tile * CONFIG.finalScale + CONFIG.gridGap;
  const subGridFinal = SUB_CELLS.map(([c, r]) => [CX - pitchFinal + c * pitchFinal, CY - pitchFinal + r * pitchFinal] as [number, number]);
  const gridClosed = SUB_CELLS.map(([c, r]) => [CX - tile + c * tile, CY - tile + r * tile] as [number, number]);

  const mkRect = (id?: string) => {
    const rc = document.createElementNS(SVG_NS, 'rect');
    if (id) rc.setAttribute('id', id);
    rc.setAttribute('class', id ? 'bit main-bit' : 'bit sub-bit');
    rc.setAttribute('width', String(tile));
    rc.setAttribute('height', String(tile));
    rc.setAttribute('fill', colors.inkOnLight);
    rc.setAttribute('shape-rendering', 'crispEdges');
    return rc;
  };
  const mainBit = mkRect('main-bit');
  bitGroup.insertBefore(mainBit, subGroup);
  const subBits: SVGRectElement[] = SUB_CELLS.map(() => {
    const rc = mkRect();
    subGroup.appendChild(rc);
    return rc;
  });

  const tetherG = document.createElementNS(SVG_NS, 'g');
  subGroup.insertBefore(tetherG, subGroup.firstChild);
  const tethers: SVGLineElement[] = subBits.map(() => {
    const ln = document.createElementNS(SVG_NS, 'line');
    ln.setAttribute('x1', String(CX)); ln.setAttribute('y1', String(CY));
    ln.setAttribute('x2', String(CX)); ln.setAttribute('y2', String(CY));
    ln.setAttribute('stroke', colors.foreground);
    ln.setAttribute('stroke-width', String(CONFIG.tetherWidth));
    ln.setAttribute('stroke-linecap', 'round');
    tetherG.appendChild(ln);
    return ln;
  });

  const backHalf = pitchFinal + (tile * CONFIG.finalScale) / 2 + CONFIG.gridGap;
  const backing = document.createElementNS(SVG_NS, 'rect');
  backing.setAttribute('x', String(CX - backHalf));
  backing.setAttribute('y', String(CY - backHalf));
  backing.setAttribute('width', String(2 * backHalf));
  backing.setAttribute('height', String(2 * backHalf));
  backing.setAttribute('fill', colors.accent);
  backing.setAttribute('shape-rendering', 'crispEdges');
  bitGroup.insertBefore(backing, bitGroup.firstChild);

  const bitmapAppear = (target: any, finalScale: number, pos: string, dur = 0.6, stagger = 0) =>
    kitBitmapAppear(tl, target, finalScale, pos, { duration: dur, stagger });

  gsap.set(philInner, { backgroundColor: colors.beige });
  gsap.set(bitGroup, { filter: glow(0, colors.glow) });
  gsap.set(subGroup, { rotation: 0, svgOrigin: CX + ' ' + CY });
  gsap.set(tetherG, { opacity: 0, filter: glow(8, 'rgba(242, 242, 242, 0.45)') });
  gsap.set(backing, { opacity: 0, transformOrigin: '50% 50%' });
  gsap.set([mainBit, ...subBits], { transformOrigin: '50% 50%' });
  gsap.set(mainBit, { ...toXY(CX, CY), scale: 0, opacity: 0, fill: colors.inkOnLight });
  subBits.forEach((b, i) => gsap.set(b, { ...toXY(lineupPos(i)[0], lineupPos(i)[1]), scale: 0, opacity: 0, fill: colors.inkOnLight }));
  gsap.set(caps, { opacity: 0 });
  gsap.set(caps[0], { opacity: 1 });

  const toCap = (n: number) => crossfadeCaption(tl, caps, n);

  /* STAGE 1 — PIXELATE REVEAL */
  tl.to(mainBit, { opacity: 1, scale: CONFIG.heroScale, duration: 0.8, ease: 'steps(' + CONFIG.revealSteps + ')' }, '>');
  tl.to({}, { duration: CONFIG.hold });

  /* STAGE 2 — LINE-UP + LIGHTS FLICKER */
  toCap(1);
  tl.to([mainBit, ...subBits], { fill: colors.foreground, duration: 0.1 }, '<');
  tl.to(mainBit, { ...toXY(lineupCenters[4], CY), scale: CONFIG.lineupCentral, duration: 0.5, ease: moveEase }, '<');
  bitmapAppear(subBits, 1, '<', 0.5, 0.06);
  tl.to(philInner, {
    keyframes: {
      backgroundColor: [colors.beige, colors.void, colors.beige, colors.void, colors.beige, colors.void, colors.beige, colors.void, colors.void],
      easeEach: 'steps(1)',
    },
    duration: 0.9,
    ease: 'none',
  }, '<');
  tl.to({}, { duration: CONFIG.hold });

  /* STAGE 3 — MAP TOGETHER (SNAKE) */
  toCap(2);
  tl.addLabel('map');
  const { mapSeg, mapCascade } = CONFIG;
  tl.to(mainBit, { ...toXY(CX, CY), scale: 1, duration: mapSeg, ease: moveEase }, 'map');
  const leftOrder = [3, 2, 1, 0];
  const rightOrder = [4, 5, 6, 7];
  leftOrder.forEach((idx, k) => {
    const [gx, gy] = subGrid[idx];
    const t = k * mapCascade;
    tl.to(subBits[idx], { y: gy - H, duration: mapSeg, ease: moveEase }, 'map+=' + t);
    tl.to(subBits[idx], { x: gx - H, scale: 1, duration: mapSeg, ease: moveEase }, 'map+=' + (t + mapSeg));
  });
  rightOrder.forEach((idx, k) => {
    const [gx, gy] = subGrid[idx];
    const t = k * mapCascade;
    tl.to(subBits[idx], { x: gx - H, duration: mapSeg, ease: moveEase }, 'map+=' + t);
    tl.to(subBits[idx], { y: gy - H, scale: 1, duration: mapSeg, ease: moveEase }, 'map+=' + (t + mapSeg));
  });
  tl.to({}, { duration: CONFIG.hold });
  tl.to(bitGroup, { filter: glow(CONFIG.glowBig, 'rgba(242,242,242,0.95)'), duration: 0.7 }, '>');

  /* STAGE 4 — MASTER ASSET */
  toCap(3);
  tl.addLabel('unify');
  subBits.forEach((b, i) =>
    tl.to(b, { ...toXY(gridClosed[i][0], gridClosed[i][1]), duration: CONFIG.mapSeg, ease: moveEase }, 'unify+=' + i * CONFIG.mapCascade)
  );
  tl.to([mainBit, ...subBits], { fill: colors.accent, duration: 0.5 }, 'unify');
  tl.to(bitGroup, { filter: glow(CONFIG.glowBig, colors.glow), duration: 0.5 }, 'unify');
  tl.addLabel('uflare', 'unify+=' + (CONFIG.mapSeg + subBits.length * CONFIG.mapCascade));
  tl.to(bitGroup, { scale: CONFIG.unifyGrow, svgOrigin: CX + ' ' + CY, duration: 0.5, ease: moveEase }, 'uflare');
  tl.to(bitGroup, { filter: glow(0, colors.glow), duration: 0.5 }, '>');
  tl.to({}, { duration: CONFIG.hold });

  /* STAGE 5 — MODULAR STEMS */
  toCap(4);
  tl.addLabel('separate');
  subBits.forEach((b, i) =>
    tl.to(b, { ...toXY(subGrid[i][0], subGrid[i][1]), duration: CONFIG.mapSeg, ease: moveEase }, 'separate+=' + i * CONFIG.mapCascade)
  );
  tl.addLabel('stems', 'separate+=' + (CONFIG.mapSeg + subBits.length * CONFIG.mapCascade));
  tl.to(mainBit, { scale: CONFIG.orbitMain, fill: colors.foreground, duration: 0.5, ease: moveEase }, 'stems');
  subBits.forEach((b, i) =>
    tl.to(b, { ...toXY(ringPos(i)[0], ringPos(i)[1]), scale: CONFIG.orbitSub, duration: 0.55, ease: moveEase }, 'stems+=' + i * CONFIG.mapCascade)
  );
  tl.addLabel('branches', 'stems+=' + (0.55 + subBits.length * CONFIG.mapCascade));
  tl.to(tetherG, { opacity: 1, duration: 0.2 }, 'branches');
  tethers.forEach((ln, i) =>
    tl.to(ln, { attr: { x2: ringPos(i)[0], y2: ringPos(i)[1] }, duration: 0.4, ease: moveEase }, 'branches')
  );
  tl.to({}, { duration: CONFIG.hold * 0.5 });
  tl.to(subGroup, { rotation: CONFIG.orbitSpins, svgOrigin: CX + ' ' + CY, duration: 2.2, ease: 'none' }, '>');
  tl.to(subBits, { rotation: -CONFIG.orbitSpins, transformOrigin: '50% 50%', duration: 2.2, ease: 'none' }, '<');
  tl.to({}, { duration: CONFIG.hold * 0.5 });

  /* STAGE 6 — TOTAL CONTROL */
  tl.addLabel('retract');
  tethers.forEach((ln) =>
    tl.to(ln, { attr: { x2: CX, y2: CY }, duration: 0.4, ease: moveEase }, 'retract')
  );
  tl.to(tetherG, { opacity: 0, duration: 0.2 }, '>');
  tl.addLabel('reform');
  tl.to(mainBit, { ...toXY(CX, CY), scale: CONFIG.finalScale, fill: colors.foreground, duration: CONFIG.mapSeg, ease: moveEase }, 'reform');
  subBits.forEach((b, i) => {
    const [gx, gy] = subGridFinal[i];
    const t = i * CONFIG.mapCascade;
    tl.to(b, { x: gx - H, fill: colors.foreground, duration: CONFIG.mapSeg, ease: moveEase }, 'reform+=' + t);
    tl.to(b, { y: gy - H, scale: CONFIG.finalScale, duration: CONFIG.mapSeg, ease: moveEase }, 'reform+=' + (t + CONFIG.mapSeg));
  });
  tl.addLabel('control', 'reform+=' + (2 * CONFIG.mapSeg + subBits.length * CONFIG.mapCascade));
  tl.to(caps[4], { opacity: 0, duration: 0.3 }, 'control');
  tl.to(caps[5], { opacity: 1, duration: 0.4 }, 'control');
  tl.to(bitGroup, { filter: glow(CONFIG.glowBig, colors.glow), duration: 0.3, yoyo: true, repeat: 1 }, 'control');
  tl.fromTo(backing, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.4, ease: moveEase }, 'control');
  tl.to({}, { duration: CONFIG.hold });

  if (!reduced()) {
    tl.to(caps[5], { opacity: 0, duration: 0.2 }, '>');
    tvOut(tl, bitGroup, CX, CY, '<');
  }

  tl.to({}, { duration: 1.6 });
}
