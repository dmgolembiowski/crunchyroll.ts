import {ImageSet, Language} from "./index"

export interface CrunchyrollEpisode {
    class: "media"
    media_id: string
    collection_id: string
    series_id: string
    media_type: string
    episode_number: string
    name: string
    description: string
    screenshot_image: ImageSet,
    bif_url: string
    url: string
    clip: boolean
    available: boolean
    premium_available: boolean
    free_available: boolean
    available_time: string
    unavailable_time: string
    premium_available_time: string
    premium_unavailable_time: string
    free_available_time: string
    free_unavailable_time: string
    availability_notes: string
    created: string
    duration: number
    series_name: string
    collection_name: string
    premium_only: boolean
    stream_data: {
      hardsub_lang: Language
      audio_lang: Language
      format: string
      streams: Array<{
          quality: string
          expires: string
          url: string
      }>
    },
    playhead: number
}
