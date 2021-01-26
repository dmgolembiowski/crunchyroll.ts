import api from "../API"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason} from "../types"
import {Episode} from "./Episode"
import {Season} from "./Season"

const fields = "series.class,series.collection_count,series.description,series.genres,series.in_queue,series.landscape_image,series.media_count,series.media_type,series.name,series.portrait_image,series.publisher_name,series.rating,series.series_id,series.url,series.year"

export class Anime {
    private static readonly detail = async (anime: CrunchyrollAnime) => {
        const response = await api.get("info", {fields, series_id: anime.series_id})
        return response.data as CrunchyrollAnime
    }

    public static get = async (animeResolvable: string) => {
        let name = animeResolvable
        if (animeResolvable.includes("crunchyroll.com")) name = animeResolvable.replace(/https?:\/\/www.crunchyroll.com\//, "").replace(/-/g, " ")
        const search = await Anime.search(name)
        if (!search[0]) return Promise.reject(`no result found for ${animeResolvable} (is it a season?)`)
        const anime = await Anime.detail(search[0])
        return anime as CrunchyrollAnime
    }

    public static search = async (query: string, options?: {sort?: "featured" | "newest" | "popular" | "updated"}) => {
        if (!options) options = {}
        let filter = `prefix:${query.trim()}`
        if (options.sort) filter += `,${options.sort}`
        const response = await api.get("list_series", {media_type: "anime", filter})
        if (!response.data[0]) return Promise.reject(`no result found for ${query} (is it a season?)`)
        const animeSearch = await Promise.all(response.data.map((a: CrunchyrollAnime) => Anime.detail(a)))
        return animeSearch as CrunchyrollAnime[]
    }

    public static episodes = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason, options?: {preferSub?: boolean, preferDub?: boolean}) => {
        const params = {} as any
        let anime = null as unknown as CrunchyrollSeason
        if (animeResolvable.hasOwnProperty("series_id")) {
            params.series_id = (animeResolvable as CrunchyrollAnime).series_id
            anime = animeResolvable as CrunchyrollSeason
        } else if (animeResolvable.hasOwnProperty("collection_id")) {
            params.collection_id = (animeResolvable as CrunchyrollSeason).collection_id
            params.series_id = undefined
        } else {
            anime = await Season.get(animeResolvable as string, options) as CrunchyrollSeason
            if (anime.collection_id) params.collection_id = anime.collection_id
            if (!anime.collection_id && anime.series_id) params.series_id = anime.series_id
        }
        const response = await api.get("list_media", params)
        const episodes: CrunchyrollEpisode[] = []
        for (let i = 0; i < response.data.length; i++) {
            episodes.push(await Episode.get(response.data[i].media_id))
        }
        if (!episodes[0]) return Promise.reject(`no episodes found for ${anime.name}`)
        return episodes as CrunchyrollEpisode[]
    }
}
