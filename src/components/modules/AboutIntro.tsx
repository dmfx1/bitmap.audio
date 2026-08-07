/* src/components/modules/AboutIntro.tsx */
import React, { useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ScrambleHeading from './ScrambleHeading';
import { useHeroSquish } from '../../hooks/use-hero-squish';
import { useIntroGate } from '../../hooks/use-intro-gate';

export default function AboutIntro() {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  useHeroSquish(heroRef, started);
  const [showContent, setShowContent] = useState(false);

  return (
    <div ref={heroRef} data-has-hero className="relative w-full min-h-svh flex flex-col justify-center overflow-hidden">
      <div className="container-page relative z-10 md:mb-24">
        {started && (
          <>
            <a
              href="/home"
              className="group inline-flex items-center text-lg pb-4 md:pb-0 font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12"
            >
              <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
              RTN:HOME
            </a>
            <p className="text-eyebrow text-accent text-base font-bold animate-fade-in mb-4">About Us</p>

            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={"Two minds,\none sonic vision"}
                onComplete={() => setTimeout(() => {
                  setShowContent(true);
                  setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                }, 200)}
              />
            </div>

            <div data-hero-pull="sub" className="hero-copy">
              <p className={`text-foreground/90 text-xl font-mono transition-all duration-1000
                ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                bitmap.audio are two audio specialists bridging the gap between machine states and human perception.
              </p>
              <p className={`text-foreground/90 text-xl font-mono transition-all duration-1000
                ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <br/>
                We deconstruct brand identity into its smallest possible components <i>[the "bit"]</i> and re-engineer them across a
                functional sonic framework <i>[the "map"]</i> to build trust and alleviate friction in digital experiences.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
