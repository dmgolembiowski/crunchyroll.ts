import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason} from "./index"
export type Language = "enUS" | "enGB" | "esLA" | "esES" | "ptBR" | "ptPT" | "frFR" | "deDE" | "itIT" | "ruRU"

export interface ImageSet {
  thumb_url: string
  small_url: string
  medium_url: string
  large_url: string
  full_url: string
  wide_url: string
  widestar_url: string
  fwide_url: string
  fwidestar_url: string
  width: string
  height: string
}

export interface DownloadOptions {
  resolution?: number
  quality?: number
  skipConversion?: boolean
  audioOnly?: boolean
  preferSub?: boolean
  preferDub?: boolean
  ffmpegPath?: string
  ffprobePath?: string
}

export interface FFmpegProgress {
    bitrate: number
    bytes: number
    fps: number
    frames: number
    framesDropped: number
    framesDuped: number
    speed: number
    time: number
    percent: number
}

export interface Locale {
  class: string
  locale_id: Language
  label: string
}

export interface Auth {
  user: {
    class: "user"
    user_id: string
    etp_guid: string
    username: string
    email: string
    first_name: string
    last_name: string
    premium: string
    is_publisher: boolean
    access_type: string | null
    created: string
  },
  auth: string
  expires: string
}

export interface QueueEntry {
  queue_entry_id: string
  ordering: string
  series: CrunchyrollAnime
  playhead: string
  last_watched_media: CrunchyrollEpisode | null
  last_watched_media_playhead: number | null
  most_likely_media: CrunchyrollEpisode | null
  most_likely_media_playhead: number | null
}

export interface RecentlyWatchedEntry {
  playhead: string
  timestamp: string
  media: CrunchyrollEpisode
  collection: CrunchyrollSeason
  series: CrunchyrollAnime
}

export interface Categories {
  genre: Array<{
    tag: string
    label: string
  }>
  season: Array<{
    tag: string
    label: string
  }>
}
