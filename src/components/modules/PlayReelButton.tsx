import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import VideoModal from './VideoModal';
import { getVideo } from '@/data/videos';

/* Reusable "play reel" CTA — opens the shared VideoModal for a given video slug (see
 * src/data/videos.ts). Drop into any hero. The modal is self-contained (its own open state). */
interface Props {
  slug: string;
  label?: string;
  className?: string;
}

export default function PlayReelButton({ slug, label = 'PLAY REEL', className }: Props) {
  const [open, setOpen] = useState(false);
  const video = getVideo(slug);
  if (!video) return null;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="outline"
        size="xl"
        className={cn('rounded-none w-full text-xs md:text-xl', className)}
      >
        {label}
      </Button>

      <VideoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        framerateId={video.desktopId}
        mobileFramerateId={video.mobileId}
        theme={video.theme}
      />
    </>
  );
}
