/* src/components/modules/FAQContent.tsx */
import React, { useState } from 'react';
import { BitmapChevron } from '../ui/icons';
import { cn } from "@/lib/utils";

const faqs = [
  {
    category: "Process",
    id: "process",
    questions: [
      { q: "How do we start a project?", a: "Every project begins with a 'Sonic Audit'. We map your existing touchpoints and identify opportunities for sonic infrastructure improvements. Once the blueprint is approved, we move to synthesis." },
      { q: "What is the typical timeline?", a: "A standard sonic branding package typically requires a 4-6 week sprint from audit to delivery." }
    ]
  },
  {
    category: "Technical",
    id: "definitions",
    questions: [
      { q: "What is 'Sonic UI'?", a: "Sonic UI refers to the functional audio cues within a digital interface. It is the sound of a successful transaction, a notification, or a data-upload completion—designed to reduce cognitive load." },
      { q: "Do you provide spatial audio?", a: "Yes. We engineer immersive assets specifically for Atmos, Binaural, and VR/AR environments using object-based audio mapping." }
    ]
  }
];

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<string | null>("process-0");

  return (
    <div className="flex flex-col md:flex-row gap-16 max-w-6xl mx-auto px-2 md:px-6">
      <aside className="md:w-1/5 sticky top-16 md:top-32 h-fit space-y-2 md:space-y-4 bg-background md:bg-transparent py-3 md:py-0 -mx-4 px-4 md:mx-0 md:px-0 z-10">
        <p className="text-eyebrow text-accent uppercase tracking-[0.5em] text-2xl font-medium mb-3 md:mb-8">
          Index
        </p>
        {faqs.map((section) => (
          <a 
            key={section.id} 
            href={`#${section.id}`}
            className="block font-mono text-lg uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          >
            {`// ${section.category}`}
          </a>
        ))}
      </aside>

      <div className="md:w-4/5 flex-1 space-y-16">
        {/* Added 'index' here to the map function */}
        {faqs.map((section, index) => (
          <section 
            key={section.id} 
            id={section.id} 
            className={cn(
              "scroll-mt-32",
              /* THE FIX: Only adds mt-24 to categories after the first one */
              index !== 0 && "mt-12"
            )}
          >
            <h3 className="font-mono text-lg text-foreground/40 mb-4 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="text-accent">/</span> {section.category}
            </h3>
            
            <div className="border-b border-foreground/10">
              {section.questions.map((item, idx) => {
                const id = `${section.id}-${idx}`;
                const isOpen = openIndex === id;
                
                return (
                  <div key={id} className="border-t border-foreground/10 block w-full">
                    <h2 id={`heading-${id}`} className="block w-full">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className={cn(
                          "flex items-center justify-between w-full text-left font-mono text-lg tracking-wider transition-all duration-200 group focus:outline-none",
                          isOpen ? "pt-8 pb-4 text-accent" : "py-2 text-foreground hover:text-primary"
                        )}
                      >
                        <span>{item.q}</span>
                        <BitmapChevron 
                          className={cn(
                            "w-3 h-3 transition-transform duration-300 shrink-0",
                            isOpen ? "rotate-90 text-accent" : "text-foreground"
                          )} 
                        />
                      </button>
                    </h2>
                    
                    <div className={isOpen ? "block" : "hidden"}>
                      <div className="pb-10 pt-2 px-4">
                        <p className="text-lg text-muted-foreground font-mono leading-relaxed max-w-2xl border-l border-accent/30 pl-6 py-2">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}