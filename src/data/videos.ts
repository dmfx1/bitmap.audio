// ─────────────────────────────────────────────────────────────────────────────
// FRAMERATE.TV VIDEO REGISTRY — single source of truth for all site videos.
//
// Add a new video by adding one entry here, keyed by a slug. Components reference
// videos by slug (never by raw ID), so scaling to hundreds of videos means adding
// data to this file — no component changes required.
//
// Each video can carry TWO ids: a 16:9 landscape edit (desktop) and a 9:16 vertical
// edit (mobile). They are genuinely separate edits — a 16:9 auto-cropped to 9:16
// loses too much of the frame — so `mobileId` stays null until a real vertical cut
// exists, at which point mobile visitors automatically get the vertical version.
// ─────────────────────────────────────────────────────────────────────────────

export interface FramerateVideo {
  /** 16:9 landscape video ID — shown on desktop (≥768px). */
  desktopId: string;
  /** 9:16 vertical video ID — shown on mobile (<768px). Null until a vertical edit exists. */
  mobileId?: string | null;
  /**
   * Framerate embed theme. 'minimal' strips the Framerate page header/chrome so the
   * frame is just the video. Override per-video only if a different theme is needed.
   */
  theme?: string;
}

/** Default embed theme. 'minimal' removes the Framerate page header (the black bar). */
export const DEFAULT_THEME = 'minimal';

export interface EmbedOptions {
  /** Framerate embed theme. Defaults to DEFAULT_THEME ('minimal'). */
  theme?: string;
  /** Start playback automatically when the embed loads. */
  autoplay?: boolean;
  /** Loop the video. */
  loop?: boolean;
}

export const videos = {
  'sonic-branding': {
    desktopId: '113dace6-9edc-4ce1-a987-21ffff42fc4c',
    mobileId: '145d48c0-a621-4a9b-a279-2d9dbf7a1418',
  },
  'user-experience': {
    desktopId: '0a0c408e-7230-4a9e-b7b1-372b20567e64',
    mobileId: null, // add mobile vertical ID here when the 9:16 edit exists
  },
  'immersive-audio': {
    desktopId: 'ebaaa7a9-5123-4e4c-bf1a-e97c450de950',
    mobileId: null, // add mobile vertical ID here when the 9:16 edit exists
  },
} satisfies Record<string, FramerateVideo>;

/** Valid video slugs, derived from the registry above. */
export type VideoSlug = keyof typeof videos;

/** Look up a video by slug. Returns undefined for an unknown slug. */
export function getVideo(slug: string): FramerateVideo | undefined {
  return (videos as Record<string, FramerateVideo>)[slug];
}

/**
 * Build a Framerate embed URL. Centralising URL construction means the ?theme=minimal
 * param (and any playback params) can never be forgotten on a new embed.
 *
 * NOTE ON AUTOPLAY: `autoplay` appends `&autoplay=1`. This is the param that removed the
 * poster/play button in testing, but Framerate's exact playback param set (autoplay / mute /
 * loop naming) isn't publicly documented — confirm with Framerate if playback misbehaves.
 * On mobile, browser policy generally only permits autoplay WITH SOUND inside the user
 * gesture that opened the modal (the card tap); otherwise the browser may fall back to muted
 * or paused. It's centralised here so the param can be adjusted in one place.
 */
export function buildEmbedUrl(id: string, options: EmbedOptions = {}): string {
  const { theme = DEFAULT_THEME, autoplay, loop } = options;
  const params = new URLSearchParams();
  if (theme) params.set('theme', theme);
  if (autoplay) params.set('autoplay', '1');
  if (loop) params.set('loop', '1');
  const query = params.toString();
  return `https://framerate.tv/embed/${id}${query ? `?${query}` : ''}`;
}
