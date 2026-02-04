/* src/components/modules/CTA.tsx */
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export default function CTA({ 
  title = "Ready to define your sound?", 
  description = "Let's architect a sonic identity that resonates with your audience.", 
  buttonText = "START THE CONVERSATION",
  href = "/contact"
}: CTAProps) {
  return (
    <div className="w-full flex flex-col items-center text-center py-24">
      {/* HEADER: Solaris Amber Pulse */}
      <h2 className="text-3xl md:text-5xl lg:text-4xl font-mono text-accent animate-pulse mb-8 tracking-tight uppercase">
        {title}
      </h2>

      {/* SUBTEXT: Technical Muted */}
      <p className="text-body-muted text-lg max-w-2xl mb-12">
        {description}
      </p>

      {/* THE ELECTRIC BUTTON: Sharp edges, filled morph */}
      <a href={href}>
        <Button 
          size="xl" 
          className="rounded-none bg-primary text-black font-mono tracking-widest transition-all duration-300 morph-accent-fill px-10 py-8 text-sm"
        >
          {buttonText}
        </Button>
      </a>
    </div>
  );
}