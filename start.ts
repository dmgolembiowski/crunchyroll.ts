import axios from "axios"
import crunchyroll from "./crunchyroll"

(async () => {
    // const output = await crunchyroll.api.getManga("list_chapter", {page_id: 372172, series_id: 527})
    // const pages = output.pages.map((p) => p.image_url)
    // console.log(pages)
    const episode = await crunchyroll.episode.get("gabriel dropout 1")
    const result = crunchyroll.util.parseDest(episode, "mp4", "./videos", "{episodeTitle}")
    console.log(result)
})()
