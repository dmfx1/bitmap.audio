# returns2.astro — Interface Guide

Everything that controls the ROI scroll experience now lives in **one place**: the config block at the top of `src/pages/returns2.astro` (between the `---` fences). You should almost never need to touch the markup below it.

There are four config objects, top to bottom:

| Object | Controls |
|---|---|
| `IMG_DEFAULTS` | Default look for every image slide |
| `SLIDES` | **The main one** — every slide, in scroll order |
| `CONFIG` | Global scroll + vividness settings |
| `JOURNEY` | The background colour flow |

---

## 1. `SLIDES` — the master list

One array, in the order slides appear as you scroll. Every entry has an `id` and a `type`:

```ts
{ id: "06", type: "text",  label: "Conversion", width: "75vw", content: { col: [3, 7] } }
{ id: "6.25", type: "image", img: "amplified-roi" }
{ id: "3.5", type: "behind", img: "brain-processing-speed", width: "100%", opacity: 25 }
```

- **`type: "text"`** — a content slide (has a sidebar entry).
- **`type: "image"`** — an in-between image or gradient panel.
- **`type: "behind"`** — a background image that sits *inside* a text slide, behind the copy.

> Keep entries in scroll order. The `id` is just a label — for text slides it's the sidebar number (`00`–`12`); image slides use `.25` / `.5` (e.g. `6.25` sits after slide `06`).

### Text slide fields

| Field | What it does | Example |
|---|---|---|
| `label` | Sidebar text | `"Metrics"` |
| `width` | How wide the slide is (how long it takes to scroll past) | `"150vw"` |
| `content.col` | Where the text sits on the 12-column grid: `[startColumn, howManyColumns]` | `[3, 8]` = start at col 3, span 8 |
| `anim` | Scroll-animation timings (leave as-is unless you know them) | — |

### Image slide fields

| Field | What it does | Example |
|---|---|---|
| `img` | Filename in `public/images/returns/` (no path/extension) | `"amplified-roi"` |
| `gradient` | Instead of an image — a colour panel | `"from-accent to-background"` |
| `width` | Scroll footprint | `"100vw"` |
| `imgWidth` | How wide the picture renders (`>100%` spills over neighbours) | `"150%"` |
| `imgX` | Nudge sideways | `"-20vw"` |
| `fade` | Edge softness — **see §2** | `{ left: 0.45, right: 0.45 }` |
| `vivid` | `true` = image dims/desaturates off-centre, comes alive at centre | `true` |
| `opacity` | 0–100 | `90` |
| `z` | Stack order vs neighbours | `0` |

---

## 2. Fades — the "smudge" control

`fade` softens an image's left/right edges so it dissolves into the background instead of showing a hard edge.

Two ways to set it:

```ts
fade: "flow"                        // preset (short, ~22% each side)
fade: { left: 0.45, right: 0.45 }   // custom: fraction (0–0.5) of the slide to fade in from each edge
```

**Bigger numbers = longer, smudgier fade.** `0.5` = fades all the way to the middle. Use a long fade on a dark photo so it melts into a matching background colour.

Presets: `flow` (0.22), `flow-long` (0.38), `flow-xlong` (0.46), `in-left`, `in-right`, `radial`.

### `reveal` — for `type: "behind"` images only

Behind images sit inside a text slide, so they use `reveal` instead of `fade`. It dissolves them out of the background colour as the slide crosses centre, and back into it on the way out:

```ts
reveal: { window: 1.5, hold: 0.65, blur: 25 }
```

| Field | What it does |
|---|---|
| `window` | How far out the dissolve starts, in screen-widths each side of centre |
| `hold` | Fraction of that span the image sits **fully sharp** (0.65 = 65%) |
| `blur` | How blurry it is at its softest |

**`hold` is the one that matters.** Set it too low and the image is blurry the entire time it's on screen — it only snaps into focus for a split second at dead centre. Keep it at `0.6`+ and just widen `window` if you want a longer, lazier dissolve.

Needs `data-behind-layer` on the image wrapper in the markup.

---

## 3. `JOURNEY` — the background colour flow

The background drifts through a series of colours as you scroll — a smooth journey, not hard cuts. Each checkpoint pins to a slide:

```ts
{ at: "5",   color: "#111A1B" },   // pins to text slide 5
{ at: "5.5", color: "#52958E" },   // pins to image slide 5.5
```

- `at` = a slide `id` (works for both text and image slides).
- `color` = any hex. The background eases from one checkpoint to the next.

**Rule of thumb:** use **bright or brand colours only** — no browns, blacks, or muddy dark tones (white is fine). Dark colours read as "off" against the slides.

**To make an image blend into the journey**, you have two options:
1. **Photos:** add a checkpoint in a colour picked from the image, and give that image a long `fade` (§2) so it smudges into it.
2. **Illustrations/graphics:** export them with a **transparent background** — the journey then shows straight through, and it's seamless automatically. Prefer this whenever the image has a clean subject.

You don't need an image on every slide — the colour drift alone looks good.

---

## 4. `CONFIG` — global settings

```ts
stripEndOffset: 0.22,                             // where the strip stops, as a FRACTION of screen width
vividFrom: { saturate: 0.4, brightness: 0.85 },   // how dull an off-centre "vivid" image looks
vividTo:   { saturate: 1,   brightness: 1 },       // full colour at centre
vividWindow: 0.9,                                  // how far from centre the ramp runs
```

Lower `vividFrom` numbers = more dramatic "come alive" effect. If scrolling feels heavy, raise them toward 1 or reduce how many slides have `vivid: true`.

**`stripEndOffset` is a fraction, not pixels.** `0.22` means the strip parks 22% of a screen-width short of full travel, so the final slide is framed identically on every display size. Tune in steps of `0.05`. Never put a px value here — that's device-dependent and was the old behaviour.

---

## 5. "Journey only" switch

Top-right of the page (desktop) there's a **Journey only** toggle. Flip it on to hide all text and imagery so you can focus purely on the background colour flow while tuning `JOURNEY`. (It's a dev aid — remove it before the site goes live.)

---

## Common tasks

**Change how wide/long a slide is** → edit its `width` in `SLIDES`.

**Move a slide's text** → edit `content.col` (`[start, span]` on a 12-col grid).

**Swap an image** → change its `img` filename (drop the new file in `public/images/returns/`).

**Make an image blend in** → add a `JOURNEY` colour + a long `fade`, or use a transparent-background image.

**Add a background colour moment** → add a `{ at, color }` to `JOURNEY` (bright/brand colours only).

**Remove a slide** → delete its line from `SLIDES` (and any matching `JOURNEY` checkpoint).

**Tune the "come alive" effect** → `CONFIG.vividFrom` / `vividWindow`, or add/remove `vivid: true`.

> Mobile is a separate, simpler experience (vertical snap, no animations). Nothing in this config affects it — safe to experiment on desktop.
