import axios from "axios"
import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress.percent)
        if (progress.percent > 2) return "stop"
    }
    // const output = await crunchyroll.api.getManga("list_chapter", {page_id: 372172, series_id: 527})
    // const pages = output.pages.map((p) => p.image_url)
    // console.log(pages)
    const result = await crunchyroll.util.downloadEpisode("gabriel dropout 1", "./videos", {ffprobePath: "ffprobe"}, progress)
    console.log(result)
})()
