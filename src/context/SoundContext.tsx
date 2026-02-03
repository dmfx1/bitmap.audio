/* src/context/SoundContext.tsx */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// 1. Create the Context
const SoundContext = createContext({
  isMuted: true,
  toggleMute: () => {},
});

// 2. Export the Provider as the default or primary export
export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('bitmap-audio-muted');
    if (saved !== null) {
      setIsMuted(JSON.parse(saved));
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem('bitmap-audio-muted', JSON.stringify(newState));
      return newState;
    });
  };

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isMuted, toggleMute }), [isMuted]);

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

// 3. Export the Hook separately
export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}