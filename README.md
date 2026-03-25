# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


bitmap.audio | The ROI of Audio
Visuals reach the eyes, but sound hits the nervous system. Competing on screens alone is a losing battle. It's time to weaponize your audio.

🔊 What is bitmap.audio?
bitmap.audio is a forward-thinking sonic branding agency and strategic audio partner. We focus on the measurable, neurological, and financial returns of integrating proprietary sound into a brand's identity.

In a world where 80% of consumers form brand memory via audio cues, we help brands stop "renting from the sea of sameness" and start building owned audio assets that drive behavior, increase task success, and amplify campaign ROI.

The Core Philosophy:
Neurological Speed: Sound reaches the brain 2 to 4 times faster than visual stimuli (8-10ms), establishing recognition before conscious sight.

Echoic Memory: Auditory sensory memory persists 10 to 20 times longer than visual memory, resisting decay and triggering emotional encoding.

Subconscious Trust: Auditory UX cues in high-stakes environments (like banking) increase task success rates by up to 25% by implying physical reality and safety.

Amplified Conversion: Allocating 11% of a media budget to bespoke audio can quadruple (4.0x) total campaign ROI.

🚀 Where We Are Going
Sonic branding drives loyalty, equity, and purchase decisions—yet it remains the exclusive domain of global giants. SMEs make up 90% of businesses worldwide, but most are leaving audio completely untapped. bitmap.audio is positioning itself to bridge this gap. We are transforming sonic branding from a luxury enterprise expense into an accessible, high-ROI strategic asset for SMEs and scaling brands. We are giving them the tools to scale across borders instantly, requiring zero localization overhead while maintaining absolute global brand consistency.

💻 What We Are Developing (The Site)
We are currently building the digital flagship for bitmap.audio. It is designed to be a highly immersive, interactive, and data-driven presentation rather than a standard brochure website.

The Tech Stack
Framework: Astro (Optimized for speed and static delivery)

Styling: Tailwind CSS

Animation Engine: GSAP (GreenSock) + ScrollTrigger

Typography & Visuals: Highly custom font-mono and font-sans pairings, SVG data maps, CSS mix-blend modes, and dynamic GPU-accelerated blurs.

Key Architectural Features
Horizontal Scroll Track: The desktop experience translates vertical mouse wheel scrolling into a cinematic, horizontal scrub across 12 distinct chapters (00 Status to 11 Execution).

Mobile 'Reel' Snapping: The mobile architecture abandons the continuous scrub for a native, app-like horizontal snap. Wide sections allow for internal scrolling, but naturally magnetize to the start of each new section like an Instagram Reel.

Data-Driven Animations: Instead of simple fades, the site uses complex GSAP timelines to natively count numbers (e.g., 1.0x to 4.0x ROI multipliers, 0 to 25% Task Success rings), draw SVG paths, and bloom blurred typography (halo effects) tied directly to the user's scroll depth.

Psychological UX: The UI mirrors the copy. For example, when discussing "Subconscious Trust," the environment dynamically dims to shift focus, forcing the user to concentrate on subtly blurred text, perfectly illustrating the concept of subconscious processing.

🛠 Active Development Notes
Mobile Optimization: Currently refining returns.astro to perfect the custom GSAP snap logic for touch devices.

Performance: Stripping out CSS transitions in favor of native GSAP scrubbing to eliminate layout thrashing and drop-shadow lag. Using GPU-accelerated opacity fades instead of background-color repaints.

Master the Signal.