import api from "../API"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason} from "../types"
import {Episode} from "./Episode"
import {Season} from "./Season"
import {Util} from "./Util"

const fields = "series.class,series.collection_count,series.description,series.genres,series.in_queue,series.landscape_image,series.media_count,series.media_type,series.name,series.portrait_image,series.publisher_name,series.rating,series.series_id,series.url,series.year"

export class Anime {
    private static readonly detail = async (anime: CrunchyrollAnime | number) => {
        const id = anime.hasOwnProperty("series_id") ? (anime as CrunchyrollAnime).series_id : anime
        const response = await api.get("info", {fields, series_id: id})
        return response.data as CrunchyrollAnime
    }

    private static readonly id = async (query: string) => {
        const seriesId = Number(query.match(/\d{5,}/)?.[0])
        if (seriesId) return Anime.detail(seriesId)
        let id = 0
        if (/kiniro mosaic/i.test(query)) id = 255553
        if (/dragon maid/i.test(query)) id = 272199
        if (/laid back camp/i.test(query)) id = 275163
        if (/himouto umaru chan/i.test(query)) id = 266785
        if (/food wars shokugeki no soma/i.test(query)) id = 265649
        if (/one punch man/i.test(query)) id = 277822
        if (/rent a girlfriend/i.test(query)) id = 279577
        if (/masamune kuns revenge/i.test(query)) id = 272171
        if (/didnt i say to make my abilities average in the next life/i.test(query)) id = 278628
        if (/anime azurlane slow ahead/i.test(query)) id = 280540
        if (/princess connect re dive/i.test(query)) id = 279204
        if (/saekano how to raise a boring girlfriend/i.test(query)) id = 264423
        if (/aho girl/i.test(query)) id = 273665
        if (id) return Anime.detail(id)
        return null
    }

    public static get = async (animeResolvable: string | CrunchyrollSeason) => {
        if (animeResolvable.hasOwnProperty("collection_id")) return Util.parseAnime(animeResolvable)
        let name = animeResolvable as string
        if (name.includes("crunchyroll.com")) name = name.replace(/https?:\/\/www.crunchyroll.com\//, "").replace(/-/g, " ").replace(/\//g, "")
        const idSearch = await Anime.id(name)
        if (idSearch) return idSearch
        const search = await Anime.search(name)
        if (!search[0]) return Promise.reject(`no anime found for ${name} (is it a season?)`)
        const anime = await Anime.detail(search[0])
        return anime as CrunchyrollAnime
    }

    public static search = async (query: string, options?: {sort?: "featured" | "newest" | "popular" | "updated", tagSearch?: boolean}) => {
        if (!options) options = {}
        let filter = options.tagSearch ? `tag:${query.trim()}` : `prefix:${query.trim()}`
        if (options.sort) filter += `,${options.sort}`
        const response = await api.get("list_series", {media_type: "anime", filter})
        if (!response.data[0]) {
            if (!options.tagSearch) return Anime.search(query, {tagSearch: true})
            return Promise.reject(`no anime results found for ${query} (is it a season?)`)
        }
        const animeSearch = await Promise.all(response.data.map((a: CrunchyrollAnime) => Anime.detail(a)))
        return animeSearch as CrunchyrollAnime[]
    }

    public static episodes = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason, options?: {preferSub?: boolean, preferDub?: boolean}) => {
        const params = {} as any
        let anime = null as unknown as CrunchyrollSeason
        if (animeResolvable.hasOwnProperty("collection_id")) {
            params.collection_id = (animeResolvable as CrunchyrollSeason).collection_id
            params.series_id = undefined
        } else if (animeResolvable.hasOwnProperty("series_id")) {
            params.series_id = (animeResolvable as CrunchyrollAnime).series_id
            anime = animeResolvable as CrunchyrollSeason
        } else {
            let name = animeResolvable as string
            if (name.includes("crunchyroll.com")) name = name.replace(/https?:\/\/www.crunchyroll.com\//, "").replace(/-/g, " ").replace(/\//g, "")
            const idSearch = await Anime.id(name) as unknown as CrunchyrollAnime
            anime = idSearch ? await Season.get(idSearch, options) : await Season.get(name, options) as CrunchyrollSeason
            if (anime.collection_id) params.collection_id = anime.collection_id
            if (!anime.collection_id && anime.series_id) params.series_id = anime.series_id
        }
        const response = await api.get("list_media", params)
        let episodes: CrunchyrollEpisode[] = response.data
        if (!episodes[0]) return Promise.reject(`no episodes found for ${anime.name}`)
        episodes = await Promise.all(episodes.map((e) => Episode.get(e.media_id)))
        return episodes as CrunchyrollEpisode[]
    }
}
