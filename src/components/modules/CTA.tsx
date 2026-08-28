/* src/components/modules/CTA.tsx
 *
 * "Plain CTA" card (à la plain.com): a bordered panel with a bitmap PIXEL motif top-left, a
 * left-aligned headline + subtext, and — instead of a plain button — the on-brand TERMINAL PROMPT
 * action `> command_`. The command is derived from `buttonText` (lowercased + underscored) or set
 * explicitly via `command`.
 */
import React from 'react';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;   // human label; also the terminal command source if `command` unset
  href?: string;
  command?: string;      // explicit terminal command (e.g. "start_project")
}

// Bitmap pixel motif — a small grid of blocks with an accent "bloom" (like plain.com's dot cluster,
// but square = on-brand). 2 = bright accent, 1 = dim accent, 0 = faint.
const MOTIF = [
  '000010000',
  '000111000',
  '001121100',
  '011222110',
  '112222211',
  '011222110',
  '001121100',
  '000111000',
  '000010000',
];

function BitmapMotif() {
  return (
    <div className="grid grid-cols-9 gap-[5px] w-max" aria-hidden="true">
      {MOTIF.flatMap((row, r) =>
        row.split('').map((c, col) => (
          <span
            key={`${r}-${col}`}
            className={
              'w-[6px] h-[6px] ' +
              (c === '2' ? 'bg-accent' : c === '1' ? 'bg-accent/40' : 'bg-foreground/10')
            }
          />
        ))
      )}
    </div>
  );
}

export default function CTA({
  title = "Ready to define your sound?",
  description = "Let's architect a sonic identity that resonates with your audience.",
  buttonText = "start project",
  href = "/contact",
  command,
}: CTAProps) {
  const cmd = (command ?? buttonText).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  return (
    <div className="relative w-full flex justify-center py-8 md:py-12">
      {/* Plain-style card, left-aligned, bitmap sharp edges + terminal action */}
      <div className="relative w-full max-w-xl border border-border bg-background/50 backdrop-blur-sm p-8 md:p-14 text-left">
        <BitmapMotif />

        <h2 className="mt-10 text-3xl md:text-5xl font-mono font-medium text-foreground tracking-tight leading-[1.1] mb-4">
          {title}
        </h2>

        <p className="text-body-muted text-lg md:text-xl max-w-md leading-relaxed mb-10">
          {description}
        </p>

        {/* TERMINAL PROMPT action — ` > command_ ` */}
        <a
          href={href}
          aria-label={buttonText}
          className="group inline-flex items-center gap-3 border border-border bg-background/40 px-6 py-4 font-mono text-base md:text-lg hover:border-accent focus:outline-none focus-visible:border-accent transition-colors duration-300"
        >
          <span className="text-primary group-hover:text-accent transition-colors duration-300">&gt;</span>
          <span className="tracking-wide text-foreground group-hover:text-accent transition-colors duration-300">{cmd}</span>
          <span className="inline-block w-[0.55ch] h-[1.05em] bg-accent align-middle animate-pulse group-hover:animate-none" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
