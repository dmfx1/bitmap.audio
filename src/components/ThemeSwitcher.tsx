/* src/components/ThemeSwitcher.tsx */
import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react'; // Or use a bitmap icon if you prefer!

const THEMES = [
  { id: 'default', name: 'Default (Cyan)' },
  { id: 'theme-solaris-day', name: 'Solaris (day)' },
  { id: 'theme-mono', name: 'Mono (Light)' },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('site-theme') || 'default';
    setTheme(savedTheme);
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
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-mono">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:scale-110 transition-transform"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-black/90 border border-primary/30 p-2 min-w-[160px] rounded backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-2 text-center">
            Select Theme
          </div>
          <div className="space-y-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`w-full text-left px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
                  currentTheme === theme.id 
                    ? 'bg-primary text-black font-bold' 
                    : 'text-foreground hover:bg-foreground/10'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}