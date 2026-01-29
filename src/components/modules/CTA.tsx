import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTA() {
  return (
    <div className="w-full flex flex-col items-center text-center py-24">
      {/* HEADER: Large Mono */}
      <h2 className="text-3xl md:text-5xl lg:text-4xl font-mono text-accent animate-pulse mb-8 tracking-tight">
        Ready to define your sound?
      </h2>

      {/* SUBTEXT: Centered and Muted */}
      <p className="text-body-muted text-lg max-w-2xl mb-12">
        Let's architect a sonic identity that resonates with your audience and elevates your digital presence.
      </p>

     {/* THE ELECTRIC BUTTON */}
    <a href="/contact">
    <Button 
        size="xl" 
        className="rounded-none text-black font-mono tracking-widest card-glow transition-all duration-300 morph-accent-fill"
    >
        START THE CONVERSATION <ArrowRight className="w-5 h-5 ml-3" />
    </Button>
    </a>
    </div>
  );
}