/* src/hooks/useAudio.ts */
import { useSound } from '@/context/SoundContext';

export const useAudio = () => {
  const { isMuted } = useSound();

  const playSound = (file: string, volume: number = 0.4) => {
    // 1. Silent check: If system is offline, exit immediately
    if (isMuted) return;

    // 2. Play logic
    const audio = new Audio(`/audio/${file}`);
    audio.volume = volume;
    audio.play().catch((err) => {
      console.warn("Audio blocked by browser. Interaction required.", err);
    });
  };

  return { playSound };
};