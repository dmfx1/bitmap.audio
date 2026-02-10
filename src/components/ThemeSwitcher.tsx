import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; 
import { BitmapMonitor } from './ui/icons';

const THEMES = [
  { id: 'default', name: 'Solaris (Night)', icon: Moon },
  { id: 'theme-solaris-architect', name: 'Solaris (Architect)', icon: Sun },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1. HELPER: Applies the theme to the DOM (Visuals only, no saving)
  const applyTheme = (themeId: string) => {
    // Remove all theme classes first
    document.body.classList.remove(...THEMES.map(t => t.id));
    
    // Add the new class (unless it's default)
    if (themeId !== 'default') {
      document.body.classList.add(themeId);
    }
    
    setCurrentTheme(themeId);
  };

  // 2. HANDLER: User explicitly clicks a button (Visuals + Save to Storage)
  const handleManualToggle = (themeId: string) => {
    applyTheme(themeId);
    localStorage.setItem('site-theme', themeId); // Persist the user's choice
    setIsOpen(false);
  };

  // 3. INITIALIZATION: Check Storage -> Then Check Time
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme');

    if (savedTheme) {
      // A. User has a preference saved -> Obey it
      applyTheme(savedTheme);
    } else {
      // B. No preference -> Check the Clock
      const hour = new Date().getHours();
      
      // Logic: 07:00 to 19:00 = Light Mode
      const isDayTime = hour >= 7 && hour < 19;
      
      applyTheme(isDayTime ? 'theme-solaris-architect' : 'default');
    }
    
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2 font-mono">
      
      {/* Dropdown Menu */}
      <div className={`
        flex flex-col gap-1 bg-background/90 backdrop-blur-xl border border-border p-1 rounded-lg shadow-2xl 
        transition-all duration-300 origin-bottom-right overflow-hidden
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
      `}>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 text-center">
          Display
        </div>
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleManualToggle(theme.id)} // Use the manual handler
              className={`
                flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider transition-colors rounded-sm w-40 text-left
                ${isActive 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'}
              `}
            >
              <Icon size={14} />
              {theme.name}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />}
            </button>
          )
        })}
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500 shadow-lg
          ${isOpen 
            ? 'bg-foreground text-background border-foreground rotate-90' 
            : 'bg-background/80 backdrop-blur text-muted-foreground border-border hover:border-primary hover:text-primary hover:scale-110'}
        `}
        aria-label="Display Settings"
      >
        <BitmapMonitor className="w-5 h-5" />
      </button>
    </div>
  );
}