export interface YouTubePlayer {
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  getCurrentTime?: () => number;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
}
