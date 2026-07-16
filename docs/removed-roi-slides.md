# Removed: ROI slides (returns2.astro) — 2026-07-16

Binned the "Amplified ROI" cluster to shorten the run into the white Credibility
background. A blank `data-slide="6.5"` spacer (`width:180vw`) was left in place so the
colour journey has a long, smooth transition to white. To restore, paste the pieces
below back and delete the spacer. (Also recoverable from git commit `e5f451e`.)

Removed: **06** (Amplified ROI text), **6.25** (amplified-roi image), **6.5** (4.0x ROI counter).

---

## 1. SLIDES config entries (were between `5.5` and `07`)

```astro
  { id: "06",   type: "text",  label: "Conversion",           width: "75vw", content: { col: [3, 7] },  anim: {
      roiGrow: { start: -0.8, end: 0.3, scrub: 1 },
  }},
  { id: "6.25", type: "image", img: "amplified-roi", vivid: true },
```

Also still in the file but now unused (left in place): `COUNTERS.roi` (the 1.0→4.0 counter
config) and the guarded GSAP blocks for `#roi-section` / `#roi-word` (they self-skip when the
markup is absent). The JOURNEY checkpoint that was `{ at: "6", color: "#121C1C" }` was
re-anchored to the spacer as `{ at: "6.5", color: "#121C1C" }`.

## 2. Markup (was between SLIDE-5.5 and SLIDE-07)

```html
          <!-- #region SLIDE-06 | Conversion Text -->
          <section data-sidebar="6" data-slide="06" class="w-screen h-full flex-shrink-0 flex flex-col justify-center  bg-background md:bg-transparent relative z-10 mobile:pl-0">
            <div class="md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full">
            <div data-sidebar-anchor class="flex flex-col justify-center mobile:pl-4 mobile:pr-4 relative z-10 md:row-start-1" style={gridStyle("06")}>
              <div class="pl-6 mobile:pl-4 py-2">
                <span class="text-eyebrow text-sm mb-8 mobile:mb-3 block">[ Capital // Conversion ]</span>
                <h2 class="font-mono text-5xl mobile:text-5xl md:text-6xl leading-[1.1] mb-8 mobile:mb-4 uppercase flex flex-col items-start">
                  <span>Amplified</span>
                  <span id="roi-word" class="text-accent md:text-8xl mobile:text-5xl inline-block origin-top-left leading-none mt-2">ROI.</span>
                </h2>
                <p class="font-sans text-xl mobile:text-xl text-muted-foreground leading-relaxed mb-6 mobile:mb-3">
                  Bespoke sonic assets don't just increase views - they drive behaviour. We see a significant lift in both purchase intent and pricing power.
                </p>
                <div class="border-l-2 border-accent pl-6 mt-4 mobile:hidden">
                  <p class="font-sans text-xl text-foreground leading-relaxed">
                    Allocating 11% of a media budget to audio paired with high "Creative Fluency" can <strong>quadruple</strong> the total campaign ROI.
                  </p>
                </div>
              </div>
            </div>
            </div><!-- /container -->
          </section>
          <!-- #endregion SLIDE-06 -->

          <!-- #region SLIDE-6.25 | Image · Amplified ROI | DESKTOP ONLY -->
          <ImageSlide {...imgSlide["6.25"]} />
          <!-- #endregion SLIDE-6.25 -->

          <!-- #region SLIDE-6.5 | ROI Counter | DESKTOP ONLY + MOBILE VARIANT -->
          <section id="roi-section" data-slide="6.5" class="hidden md:flex md:items-center w-[75vw] h-full flex-shrink-0  bg-primary/10 md:bg-transparent relative group z-10">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="roi-wave absolute w-[10vw] h-[10vw] rounded-full border border-primary/40"></div>
              <div class="roi-wave absolute w-[10vw] h-[10vw] rounded-full border border-primary/20"></div>
              <div class="roi-wave absolute w-[10vw] h-[10vw] rounded-full border border-primary/10"></div>
            </div>
            <div class="md:container md:mx-auto md:pl-24 md:pr-6 md:grid md:grid-cols-12 md:items-center md:w-full">
              <div class="md:col-start-1 md:col-span-12 flex flex-col items-center justify-center">
                <div id="roi-text-wrapper" class="relative flex items-center justify-center h-[20vw] w-full mt-12">
                  <h3 class="roi-ghost absolute font-mono text-[24vw] leading-none text-primary/20 blur-[24px] font-bold tracking-tighter mix-blend-screen">4.0x</h3>
                  <h3 class="roi-ghost absolute font-mono text-[21vw] leading-none text-primary/50 blur-[12px] font-bold tracking-tighter mix-blend-screen">4.0x</h3>
                  <h3 class="relative z-10 font-mono text-[18vw] leading-none text-primary font-bold tracking-tighter drop-shadow-[0_0_40px_hsl(var(--primary)/0.6)]">
                    <span id="roi-counter">1.0</span><span class="text-[8vw] text-foreground ml-2">x</span>
                  </h3>
                </div>
                <span class="font-mono text-foreground tracking-[0.5em] uppercase mt-4 z-10 relative">Total ROI Multiplier</span>
              </div>
            </div>
          </section>

          <!-- Mobile ROI multiplier slide -->
          <section class="md:hidden w-screen h-full flex-shrink-0 flex flex-col items-center justify-center bg-primary/10  relative z-10">
            <div class="relative flex items-center justify-center">
              <h3 class="absolute font-mono text-[32vw] leading-none text-primary/20 blur-[20px] font-bold tracking-tighter mix-blend-screen">4.0x</h3>
              <h3 class="absolute font-mono text-[28vw] leading-none text-primary/40 blur-[10px] font-bold tracking-tighter mix-blend-screen">4.0x</h3>
              <h3 class="relative z-10 font-mono text-[24vw] leading-none text-primary font-bold tracking-tighter drop-shadow-[0_0_40px_hsl(var(--primary)/0.6)]">
                4.0<span class="text-[12vw] text-foreground ml-2">x</span>
              </h3>
            </div>
            <span class="font-mono text-foreground/60 tracking-[0.5em] uppercase text-xs mt-8">Total ROI Multiplier</span>
          </section>
          <!-- #endregion SLIDE-6.5 -->
```

## To restore
1. Paste the two SLIDES entries back between `5.5` and `07`.
2. Paste the markup back in place of the blank spacer (`<section data-slide="6.5" ... bg-transparent ...>`), and delete that spacer.
3. Change the JOURNEY checkpoint `{ at: "6.5", color: "#121C1C" }` back to `{ at: "6", color: "#121C1C" }`.
