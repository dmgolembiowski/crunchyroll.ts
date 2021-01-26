import axios from "axios"
import * as uuid from "uuid"

const baseUrl = "https://api.crunchyroll.com/"

export default class API {
    private static readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"}
    private static sessionID = ""
    private static authToken = ""

    public static auth = (authToken?: string) => {
        if (authToken) API.authToken = authToken
        return API.authToken
    }

    public static session = async () => {
        if (API.sessionID) return API.sessionID
        const response = await API.getNoAuth("start_session", {access_token: "WveH9VkPLrXvuNm", device_type: "com.crunchyroll.crunchyroid", device_id: uuid.v4()}).then((r) => r.data)
        API.sessionID = response.session_id
        return API.sessionID
    }

    public static getNoAuth = async (path: string, params?: any) => {
        const url = `${baseUrl}${path}.0.json`
        return axios.get(url, {headers: API.headers, params}).then((r) => r.data)
    }

    public static get = async (path: string, params?: any) => {
        const url = `${baseUrl}${path}.0.json`
        return axios.get(url, {headers: API.headers, params: {...params, session_id: await API.session(), locale: "enUS"}}).then((r) => r.data)
    }

    public static post = async (path: string, data: any, params?: any) => {
        const url = `${baseUrl}${path}.0.json`
        return axios.post(url, data, params).then((r) => r.data)
    }
}
