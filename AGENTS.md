# AGENTS.md — bitmap.audio Rules & Constraints

> **Read this before doing anything in this repo.** These are the operating
> rules for any AI agent (Claude, Copilot, etc.) working on bitmap.audio.
> Project-specific conventions (motion, hero images, GSAP, mobile) live in
> **`CLAUDE.md`** and **`MOTION-CHEATSHEET.md`** — follow those in addition to
> the rules below. On any conflict, the explicit instruction dom gives in chat wins.

## Stack & Architecture
- **Framework:** Astro (v5). React (`.tsx`) islands for interactive modules,
  `.astro` for pages/layout. Styling is Tailwind v3 + HSL CSS variables. Motion
  is GSAP + ScrollTrigger. See `CLAUDE.md` for the full stack and conventions.
- **Rendering Strategy:** Default to Static Site Generation (SSG) for maximum
  SEO performance and speed. Only configure Server-Side Rendering (SSR) via
  `output: 'server'` for specific routes that require live user data.

## Operational Directives
- **Plan First:** Before writing code, research the codebase, map out the files
  you intend to change, and present a numbered plan. Wait for my approval.
- **Do Not Guess:** If a requirement is ambiguous or a required dependency is
  missing, STOP and ask me a clarifying question.
- **Troubleshooting Loop:** If a build or test fails, do not blindly rewrite
  code. Read the error, log your hypothesis about the root cause, and run
  targeted diagnostic commands before attempting a fix.
- **Verification:** Never claim a task is done without successfully running
  `npm run build`.
