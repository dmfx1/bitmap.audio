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

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') || 'default';
    setTheme(savedTheme);
    setMounted(true); // Prevents hydration mismatch
  }, []);

  const setTheme = (themeId: string) => {
    // 1. Remove all possible theme classes
    document.body.classList.remove(...THEMES.map(t => t.id));
    
    // 2. Add the selected theme class (unless it's default)
    if (themeId !== 'default') {
      document.body.classList.add(themeId);
    }

    // 3. Save state
    setCurrentTheme(themeId);
    localStorage.setItem('site-theme', themeId);
    setIsOpen(false); // Close menu on selection
  };

  // Don't render until mounted to avoid server/client mismatch
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
              onClick={() => setTheme(theme.id)}
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

      {/* Main Toggle Button (Using Bitmap Icon) */}
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