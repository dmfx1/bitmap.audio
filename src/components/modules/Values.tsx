/* src/components/modules/Values.tsx */
import React from 'react';

const values = [
  { 
    id: "01", 
    title: "Precision", 
    desc: "Every frequency is intentional. We engineer our smallest data points with precision to ensure the collective experience is fresh and engaging." 
  },
  { 
    id: "02", 
    title: "Empathy", 
    desc: "We design for humans. Sound should feel intuitive, not intrusive and systems should be collaborative to ensure user frustration is kept to a minimmum." 
  },
  { 
    id: "03", 
    title: "Innovation", 
    desc: "By breaking sounds down to their fundamental compenents, we can push the boundaries of what's possible in sonic design and technology." 
  }
];

export default function Values() {
  return (
    <div className="w-full">
      <div className="text-center mb-16 md:mb-10">
        <p className="text-base font-mono tracking-[0.5em] uppercase text-accent">
          Our Values
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
        {values.map((v) => (
          <div key={v.id} className="group flex flex-col items-center text-center px-4">
            
            <span className="font-mono text-5xl md:text-6xl font-light animate-pulse mb-6 
                           transition-all group-hover:text-foreground 
                           group-hover:drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              {v.id}
            </span>

            <h3 className="text-primary font-mono text-xl md:text-2xl mb-4 tracking-tight">
              {v.title}
            </h3>

            {/* Container limits the width of the full-span tape */}
            <p className="max-w-[280px] w-full text-base font-mono text-justify">
              <span className="">
                {v.desc}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}