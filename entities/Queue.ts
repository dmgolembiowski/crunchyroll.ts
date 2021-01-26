import FormData from "form-data"
import api from "../API"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason, QueueEntry} from "../types"
import {Anime} from "./Anime"
import {Util} from "./Util"

const fields = "media.availability_notes,media.available,media.available_time,media.bif_url,media.class,media.clip,media.created,media.duration,media.media_id,media.collection_id,media.collection_name,media.series_id,media.episode_number,media.name,media.series_name,media.description,media.premium_only,media.premium_available,media.premium_available_time,media.premium_unavailable_time,media.screenshot_image,media.url,media.stream_data,media.free_available,media.free_available_time,media.free_unavailable_time,media.unavailable_time,media.media_type,media.playhead"

export class Queue {
    public static add = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason) => {
        const anime = await Util.parseAnime(animeResolvable)
        const form = new FormData()
        form.append("series_id", anime.series_id)
        form.append("session_id", await api.session())
        const response = await api.post("add_to_queue", form, {headers: form.getHeaders()})
        return response.data as QueueEntry
    }

    public static remove = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason) => {
        const anime = await Util.parseAnime(animeResolvable)
        const form = new FormData()
        form.append("series_id", anime.series_id)
        form.append("session_id", await api.session())
        const response = await api.post("remove_from_queue", form, {headers: form.getHeaders()})
        return response  as {data: boolean, error: boolean, code: string}
    }

    public static show = async () => {
        const response = await api.get("queue", {media_types: "anime", fields})
        if (!response.data) return Promise.reject("nothing in queue")
        return response.data as QueueEntry[]
    }
}
