import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ScrambleHeading from './ScrambleHeading';
import { useHeroSquish } from '../../hooks/use-hero-squish';
import { useIntroGate } from '../../hooks/use-intro-gate';

export default function Hero() {
  const started = useIntroGate();
  const heroRef = useRef<HTMLDivElement>(null);
  useHeroSquish(heroRef, started);
  const [showContent, setShowContent] = useState(false);

  return (
    <div ref={heroRef} data-has-hero className="w-full relative overflow-hidden">
      <div className="container-page relative z-10 py-8 flex flex-col justify-center min-h-svh">
        {started && (
          <div className="flex flex-col space-y-8 md:max-w-[52%]">

            <p className="text-eyebrow text-sm tracking-[0.4em]">Sonic Infrastructure</p>

            <div data-hero-pull="title" className="hero-copy">
              <ScrambleHeading
                text={"Where data meets\nemotion"}
                className="heading-hero md:text-7xl leading-tight font-medium min-h-[2.2em] md:min-h-[2.4em]"
                onComplete={() => setTimeout(() => {
                  setShowContent(true);
                  setTimeout(() => window.dispatchEvent(new CustomEvent('hero-content-ready')), 500);
                }, 200)}
              />
            </div>

            <div data-hero-pull="sub" className={`hero-copy flex flex-col space-y-8
              ${showContent ? 'opacity-100' : 'opacity-0'}`}>

              <p className="text-foreground/90 max-w-lg text-xl">
                We architect sonic experiences that bridge the gap between digital interfaces and human perception.
              </p>

              <div className="w-full max-w-xl">
                <div className="flex items-stretch gap-4 w-full">
                  <a href="/about" className="flex-1">
                    <Button variant="default" size="xl" className="rounded-none w-full text-xs md:text-base">
                      OUR STORY
                    </Button>
                  </a>
                  <a href="/contact" className="flex-1">
                    <Button variant="outline" size="xl" className="morph-accent rounded-none w-full text-xs md:text-base">
                      START A PROJECT
                    </Button>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
