import React, { useState, useEffect } from 'react';
import VideoModal from './VideoModal';
import TypewriterHero from './TypewriterHero';
import ConceptGrid from './ConceptGrid'; 
import { useBinaryScramble } from '@/hooks/use-binary-scramble'; 
import { Button } from '@/components/ui/button';

const projects = [
  { id: 1, title: 'SONIC BRANDING', desc: 'Sonic branding architecture for digital infrastructure.', vimeoId: '836174895', previewVideo: '/video/regency_silent.mp4' },
  { id: 2, title: 'UI / UX SOUND', desc: 'UI/UX Sound Design for high-fidelity digital interfaces.', vimeoId: '708117517', previewVideo: '/video/seon_silent.mp4' },
  { id: 3, title: 'IMMERSIVE', desc: 'Spatial audio mapping for immersive brand environments.', vimeoId: '1108099090', previewVideo: '/video/matchroom_silent.mp4' },
];

export default function HomeHero() {
  const [selectedVimeoId, setSelectedVimeoId] = useState<string | null>(null);
  
  // Step 0: Power Up (Center Screen)
  // Step 1: Layout shift (Logo moves to top)
  // Step 2: Content reveal
  const [step, setStep] = useState(0); 
  const [isScanning, setIsScanning] = useState(false);

  const scrambledSubtitle = useBinaryScramble("Sonic Branding & Immersive Audio", isScanning);
  const scrambledAccess = useBinaryScramble("ACCESS", isScanning);
  const scrambledHandshake = useBinaryScramble("[INIT_HANDSHAKE]", isScanning);

  useEffect(() => {
    // This timer matches your CSS animation-duration (1.5s)
    const timer = setTimeout(() => {
      setStep(1);
      setTimeout(() => setIsScanning(true), 800);
    }, 1600); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center">
      
      {/* --- RESTORED: THE INTRO SEQUENCE (Step 0) --- */}
      {/* This puts the B in the absolute center for the first 1.6 seconds */}
      {step === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="w-24 h-24 bg-primary flex items-center justify-center shadow-[0_0_66px_hsl(var(--primary)/0.5)] animate-power-up">
              <span className="text-black font-mono text-4xl font-bold">b.</span>
           </div>
        </div>
      )}

      <div className="flex flex-col items-center mb-12">
        <div className="h-12 mb-12">
          {/* Once we hit Step 1, the big center B is gone, and this small top B fades in */}
          {step >= 1 && (
            <div className="morph-accent-fill w-12 h-12 bg-primary flex items-center justify-center shadow-[0_0_66px_hsl(var(--primary)/0.5)] animate-fade-in">
              <span className="text-black font-mono text-lg font-bold">b.</span>
            </div>
          )}
        </div>
        
        <div className="min-h-[1.5em]">
          {step >= 1 && (
            <TypewriterHero 
              text="bitmap.audio" 
              isBrand={true} 
              speed={60} 
              className="font-mono text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tighter" 
              onComplete={() => setStep(2)} 
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full transition-opacity duration-1000" style={{ opacity: isScanning ? 1 : 0 }}>
        <div className="space-y-12">
          <p className="text-lg md:text-sm text-muted-foreground max-w-2xl mx-auto font-mono uppercase tracking-[0.2em] min-h-[1.5em]">
            {scrambledSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/home">
              <Button size="xl" className="rounded-none font-mono min-w-[220px]">
                {scrambledAccess}
              </Button>
            </a>
            <a href="/contact">
              <Button variant="outline" size="xl" className="animate-morph rounded-none font-mono min-w-[220px]">
                {scrambledHandshake}
              </Button>
            </a>
          </div>
        </div>
        <ConceptGrid items={projects} isScanning={isScanning} onProjectClick={(vimeoId) => setSelectedVimeoId(vimeoId)} />
      </div>

      <VideoModal isOpen={!!selectedVimeoId} onClose={() => setSelectedVimeoId(null)} vimeoId={selectedVimeoId || "1108099090"} />
    </div>
  );
}