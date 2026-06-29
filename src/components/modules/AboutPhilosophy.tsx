/* src/components/modules/AboutPhilosophy.tsx */
import React from 'react';

const concepts = [
  { term: "Bit [Information]", def: "Represents the digital pulse, software logic, and the raw binary data of the technology we work with. Every sound we create starts as code, as pure information." },
  { term: "Map [Architecture]", def: "Represents the spatial layout, the UI/UX flow, and the human sensory landscape. We understand that sound exists in space, in context, in relation to human experience." },
  { term: "The Synthesis", def: "We architect the sonic infrastructure that maps digital data to human emotion and feedback. We are the micro engineers linking sonic data and human emotion." }
];

export default function AboutPhilosophy() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      <div className="space-y-6">
        <p className="text-eyebrow text-base"><u className="text-accent">The Bitmap Philosophy</u></p>
        <h2 className="text-3xl font-mono text-foreground leading-tight">
          'In computer science, a bitmap maps individual, micro-level data points across an array to construct a complete visual image.'
        </h2>
      </div>
      <div className="space-y-12">
        {concepts.map((c, i) => (
          <div key={i} className="group space-y-3">
            <h4 className="text-accent font-mono text-lg tracking-widest uppercase flex items-center gap-4">
              {c.term}
              <span className="h-px flex-1 bg-foreground/10 group-hover:bg-accent/30 transition-colors" />
            </h4>
            <p className="text-body-muted text-xl leading-relaxed">
              {c.def}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}