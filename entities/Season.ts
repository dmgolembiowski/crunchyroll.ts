import api from "../API"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason} from "../types"
import {Anime} from "./Anime"
import {Episode} from "./Episode"
import {Util} from "./Util"

export class Season {
    public static get = async (seasonResolveable: string | CrunchyrollAnime, options?: {preferSub?: boolean, preferDub?: boolean}) => {
        let name = seasonResolveable.hasOwnProperty("series_id") ? (seasonResolveable as CrunchyrollAnime).name : seasonResolveable as string
        if (name.includes("crunchyroll.com")) name = name.replace(/https?:\/\/www.crunchyroll.com\//, "").replace(/-/g, " ").replace(/\//g, "")
        const seasons = await Season.search(name, options)
        const season = seasons.find((s) => s.name.toLowerCase().includes(name.trim().toLowerCase()))
        if (!season) return Promise.reject(`no season found for ${name}`)
        return season as CrunchyrollSeason
    }

    public static search = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason, options?: {preferSub?: boolean, preferDub?: boolean}) => {
        if (!options) options = {}
        const anime = await Util.parseAnime(animeResolvable)
        const response = await api.get("list_collections", {series_id: anime.series_id})
        if (!response.data[0]) return Promise.reject(`no season results found for ${animeResolvable}`)
        const subs: CrunchyrollSeason[] = []
        const dubs: CrunchyrollSeason[] = []
        for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].name.toLowerCase().includes("dub")) {
                dubs.push(response.data[i])
            } else {
                subs.push(response.data[i])
            }
        }
        if (options.preferDub) return dubs as CrunchyrollSeason[]
        if (options.preferSub) return subs as CrunchyrollSeason[]
        return response.data as CrunchyrollSeason[]
    }
}
