/**
 * YouTube Player Types
 *
 * Type definitions for YouTube IFrame API player
 */

/**
 * YouTube IFrame Player interface
 * Represents the player object returned by the YouTube IFrame API
 *
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
export interface YouTubePlayer {
  /**
   * Checks if the player is muted
   * @returns true if muted, false otherwise
   */
  isMuted: () => boolean;

  /**
   * Mutes the player
   */
  mute: () => void;

  /**
   * Unmutes the player
   */
  unMute: () => void;

  /**
   * Plays the video
   */
  playVideo?: () => void;

  /**
   * Pauses the video
   */
  pauseVideo?: () => void;

  /**
   * Gets the current playback time
   */
  getCurrentTime?: () => number;

  /**
   * Seeks to a specific time
   */
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
}
