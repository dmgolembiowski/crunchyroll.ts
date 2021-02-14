import api from "../API"
import {CrunchyrollEpisode, Language, RecentlyWatchedEntry} from "../types"
import {Anime} from "./Anime"

const fields = "media.availability_notes,media.available,media.available_time,media.bif_url,media.class,media.clip,media.created,media.duration,media.media_id,media.collection_id,media.collection_name,media.series_id,media.episode_number,media.name,media.series_name,media.description,media.premium_only,media.premium_available,media.premium_available_time,media.premium_unavailable_time,media.screenshot_image,media.url,media.stream_data,media.free_available,media.free_available_time,media.free_unavailable_time,media.unavailable_time,media.media_type,media.playhead"

export class Episode {
    public static get = async (url: string, options?: {preferSub?: boolean, preferDub?: boolean, language?: Language}) => {
        const mediaId = Number(url.match(/\d{5,}/)?.[0])
        if (mediaId) {
            const response = await api.get("info", {fields, media_id: mediaId})
            if (!response.data) return Promise.reject(`no episode found for ${url}`)
            return response.data as CrunchyrollEpisode
        } else {
            let episodeNum = Number(url.split(" ").reverse().join(" ").match(/\d+/)?.[0])
            if (Number.isNaN(episodeNum)) episodeNum = 1
            const episodes = await Anime.episodes(url.replace(String(episodeNum), ""), options)
            if (!episodes[episodeNum - 1]) return Promise.reject(`no episode found for ${url}`)
            return episodes[episodeNum - 1] as CrunchyrollEpisode
        }
    }

    public static recentlyWatched = async () => {
        const response = await api.get("recently_watched", {media_types: "anime"})
        return response.data as RecentlyWatchedEntry[]
    }
}
