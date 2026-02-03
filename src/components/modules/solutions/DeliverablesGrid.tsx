/* src/components/modules/solutions/DeliverablesGrid.tsx */
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const items = [
  "Audio Logo / Sonic Mnemonic",
  "Brand Sound Guidelines",
  "Adaptive Audio Assets",
  "Notification & Alert Sounds",
  "Hold Music & Ambience",
  "Podcast & Video Intros/Outros"
];

export default function DeliverablesGrid() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <p className="text-eyebrow text-accent text-xs mb-4">Deliverables</p>
        <h2 className="text-4xl font-mono text-white">What you'll receive</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <div key={i} className="group relative bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm text-white uppercase tracking-wider">{item}</span>
            </div>
            {/* Subtle "data" glow on hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}