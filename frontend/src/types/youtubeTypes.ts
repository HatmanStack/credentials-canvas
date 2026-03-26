export interface YouTubePlayer {
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  getCurrentTime?: () => number;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  destroy?: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | null,
        config: { videoId: string }
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}
