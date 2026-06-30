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
    <div className="relative w-full flex flex-col items-center text-center">

      {/* HEADER: Solaris Amber Pulse */}
      <h2 className="relative z-10 text-3xl md:text-4xl max-w-xl font-mono text-accent animate-pulse mb-8 tracking-tight">
        {title}
      </h2>

      {/* SUBTEXT: Technical Muted */}
      <p className="relative z-10 text-body-muted text-lg max-w-xl mb-12">
        {description}
      </p>

      {/* THE ELECTRIC BUTTON: Sharp edges, filled morph */}
      <a href={href} className="relative z-10">
        <Button 
          size="xl"
          className="rounded-none bg-primary text-primary-foreground font-mono tracking-widest transition-all duration-300 morph-accent-fill px-6 py-4 text-sm md:px-10 md:py-8 md:text-sm"
        >
          {buttonText}
        </Button>
      </a>
    </div>
  );
}