/* src/components/modules/solutions/ReelModalHost.tsx — TRIAL (2026-11-12)
 * Opens the shared sound-on VideoModal (FrameRate reel, by slug from data/videos.ts) when the page dispatches
 * `sol-reel-open` — e.g. clicking the silent background reel in SolutionForHero (the afternow pattern). */
import { useEffect, useState } from 'react';
import VideoModal from '../VideoModal';
import { getVideo } from '@/data/videos';

export default function ReelModalHost({ slug, src }: { slug: string; src?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('sol-reel-open', onOpen);
    return () => window.removeEventListener('sol-reel-open', onOpen);
  }, []);
  const video = getVideo(slug);
  if (!video && !src) return null;
  // src (a direct .mp4, e.g. Mux) wins over the FrameRate registry entry
  return <VideoModal isOpen={open} onClose={() => { setOpen(false); window.dispatchEvent(new CustomEvent('sol-reel-close')); }} framerateId={video?.desktopId ?? ''} mobileFramerateId={video?.mobileId} theme={video?.theme} src={src} />;
}
