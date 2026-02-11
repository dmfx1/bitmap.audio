import React, { useState, useEffect } from 'react';
import VideoModal from './VideoModal';
import TypewriterHero from './TypewriterHero';
import ConceptGrid, { type Concept } from './ConceptGrid'; 
import { useBinaryScramble } from '@/hooks/use-binary-scramble'; 
import { Button } from '@/components/ui/button';

// Explicitly type the array using the exported interface from ConceptGrid
const projects: Concept[] = [
  { 
    id: 1, 
    title: 'SONIC BRANDING', 
    desc: 'Sonic branding architecture for digital infrastructure.', 
    vimeoId: '836174895',
    mobileVimeoId: '1163955176', 
    previewVideo: '/video/regency_silent.mp4' 
  },
  { 
    id: 2, 
    title: 'UI / UX SOUND', 
    desc: 'UI/UX Sound Design for high-fidelity digital interfaces.', 
    vimeoId: '708117517', 
    mobileVimeoId: '1163955194', 
    previewVideo: '/video/seon_silent.mp4' 
  },
  { 
    id: 3, 
    title: 'IMMERSIVE', 
    desc: 'Spatial audio mapping for immersive brand environments.', 
    vimeoId: '1108099090', 
    mobileVimeoId: '1163955124', 
    previewVideo: '/video/matchroom_silent.mp4' 
  },
];

export default function HomeHero() {
  // Explicitly type the state so it accepts the full object
  const [activeProject, setActiveProject] = useState<Concept | null>(null);
  
  const [step, setStep] = useState(0); 
  const [isScanning, setIsScanning] = useState(false);

  const scrambledSubtitle = useBinaryScramble("Sonic Branding & Immersive Audio", isScanning);
  const scrambledAccess = useBinaryScramble("ACCESS", isScanning);
  const scrambledHandshake = useBinaryScramble("[INIT_HANDSHAKE]", isScanning);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(1);
      setTimeout(() => setIsScanning(true), 800);
    }, 1600); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center">
      
      {/* --- INTRO SEQUENCE --- */}
      {step === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
           <div className="w-24 h-24 bg-primary flex items-center justify-center shadow-[0_0_66px_hsl(var(--primary)/0.5)] animate-power-up">
              <span className="text-primary-foreground font-mono text-4xl font-bold">b.</span>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col items-center mb-12">
        <div className="h-12 mb-12">
          {step >= 1 && (
            <div className="morph-accent-fill w-12 h-12 bg-primary flex items-center justify-center shadow-[0_0_66px_hsl(var(--primary)/0.5)] animate-fade-in">
              <span className="text-background font-mono text-lg font-bold">b.</span>
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

      {/* --- CONTENT --- */}
      <div className="relative w-full transition-opacity duration-1000" style={{ opacity: isScanning ? 1 : 0 }}>
        
        <div className="space-y-12">
          <p className="text-lg md:text-sm text-foreground max-w-2xl mx-auto font-mono uppercase tracking-[0.2em] min-h-[1.5em]">
            {scrambledSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mx-auto w-full p-4 max-w-3xl">
            <a href="/home" className="w-full">
              <Button 
                size="xl" 
                className="w-full rounded-none font-mono text-lg tracking-widest h-14 md:h-16"
              >
                {scrambledAccess}
              </Button>
            </a>
            
            <a href="/contact" className="w-full">
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full animate-morph bg-background/50 rounded-none font-mono text-lg tracking-widest h-14 md:h-16"
              >
                {scrambledHandshake}
              </Button>
            </a>
          </div>
        </div>

        <ConceptGrid 
          items={projects} 
          isScanning={isScanning} 
          onProjectClick={(project) => setActiveProject(project)} 
        />
      </div>

      <VideoModal 
        isOpen={!!activeProject} 
        onClose={() => setActiveProject(null)} 
        vimeoId={activeProject?.vimeoId || ""}
        mobileVimeoId={activeProject?.mobileVimeoId} 
      />
    </div>
  );
}