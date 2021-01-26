import FormData from "form-data"
import api from "./API"
import {Anime, Episode, Queue, Season, Util} from "./entities"
import {Auth, Categories, Locale} from "./types"

export default class Crunchyroll {
    public static api = api
    public static anime = Anime
    public static episode = Episode
    public static util = Util
    public static season = Season
    public static queue = Queue

    public static login = async (username: string, password: string) => {
        const form = new FormData()
        form.append("account", username)
        form.append("password", password)
        form.append("session_id", await api.session())
        const response = await api.post("login", form, {headers: form.getHeaders()})
        api.auth(response.data.auth)
        return response.data as Auth
    }

    public static logout = async () => {
        const form = new FormData()
        form.append("auth", api.auth())
        form.append("session_id", await api.session())
        const response = await api.post("logout", form, {headers: form.getHeaders()})
        return response as {error: boolean, code: string}
    }

    public static locales = async () => {
        const response = await api.get("list_locales")
        return response.data as Locale[]
    }

    public static categories = async () => {
        const response = await api.get("categories", {media_type: "anime"})
        return response.data as Categories
    }
}

module.exports.default = Crunchyroll
export * from "./types"
