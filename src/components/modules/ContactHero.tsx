import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import TypewriterHero from './TypewriterHero';

interface ContactHeroProps {
  imageSrc?: string;
}

export default function ContactHero({ imageSrc }: ContactHeroProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="relative w-full md:py-32 min-h-[50vh] md:h-full flex flex-col overflow-hidden">

      {/* 1. BACKGROUND — hero image + icon constellation */}
      <div
        className="absolute right-0 top-0 w-full md:w-[85%] h-full pointer-events-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
        }}
      >
        {/* HERO IMAGE */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            decoding="async"
            loading="eager"
            className="absolute inset-0 w-full h-full object-fill object-center"
          />
        )}

        {/* Bottom fade */}
        {imageSrc && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        )}

      </div>

      {/* 2. HERO CONTENT */}
      <div className="w-full md:max-w-4xl pl-4 md:pl-12 relative z-10">
        
        <a 
          href="/home" 
          className="group inline-flex items-center text-lg pb-4 md:pb-0 font-mono tracking-widest text-primary/60 hover:text-primary transition-colors mb-4 md:mb-12"
        >
          <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
          RTN:HOME
        </a>

        <p className="text-eyebrow text-accent text-base font-bold animate-fade-in mb-4">
          CONTACT <span className="opacity-50">/</span>
        </p>

        <TypewriterHero
          text={"Let's start a\nconversation"}
          onComplete={() => setTimeout(() => setShowContent(true), 200)}
        />

        <p className={`text-body-muted text-lg bg-background/50 max-w-full md:max-w-[65%] transition-all duration-1000 mt-8
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Have a project in mind? We'd love to hear about it. Get in touch and let's explore how we can architect your sonic vision together.
        </p>
      </div>
    </div>
  );
}
