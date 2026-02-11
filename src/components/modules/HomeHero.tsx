import React, { useState, useEffect } from 'react';
import VideoModal from './VideoModal';
import TypewriterHero from './TypewriterHero';
import ConceptGrid, { type Concept } from './ConceptGrid'; 
import { useBinaryScramble } from '@/hooks/use-binary-scramble'; 
import { Button } from '@/components/ui/button';

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

      {/* =========================================================================
          MOBILE WRAPPER (Updated)
          1. min-h-[60svh]: Reduced from 85vh. This centers content in the top ~60% 
             of the screen, pulling the grid up.
          2. justify-center: Vertically centers the logo/buttons in that 60% space.
      ========================================================================= */}
      <div className="flex flex-col w-full min-h-[60svh] justify-center md:min-h-0 md:justify-start">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="h-12 mb-8 md:mb-12">
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
                className="font-mono text-5xl md:text-6xl lg:text-7xl font-light text-foreground tracking-tighter" 
                onComplete={() => setStep(2)} 
              />
            )}
          </div>
        </div>

        {/* --- BUTTONS & SUBTITLE --- */}
        <div className="w-full transition-opacity duration-1000" style={{ opacity: isScanning ? 1 : 0 }}>
          <div className="space-y-8 md:space-y-12">
            <p className="text-xs md:text-sm text-foreground max-w-2xl mx-auto font-mono uppercase tracking-[0.2em] min-h-[1.5em]">
              {scrambledSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mx-auto w-full p-4 max-w-3xl">
              <a href="/home" className="w-full">
                <Button 
                  size="xl" 
                  className="w-full rounded-none font-mono text-lg tracking-widest h-14"
                >
                  {scrambledAccess}
                </Button>
              </a>
              
              <a href="/contact" className="w-full">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full animate-morph bg-background/50 rounded-none font-mono text-lg tracking-widest h-14"
                >
                  {scrambledHandshake}
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* --- GRID SECTION --- 
          1. We pass 'py-4 md:py-12' to drastically reduce the top gap on mobile.
      */}
      <div className="w-full transition-opacity duration-1000" style={{ opacity: isScanning ? 1 : 0 }}>
        <ConceptGrid 
          items={projects} 
          isScanning={isScanning}
          // TIGHTER GAP: py-4 on mobile (was py-12 default)
          className="py-0 md:py-12" 
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