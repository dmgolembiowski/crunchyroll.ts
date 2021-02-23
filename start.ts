import axios from "axios"
import crunchyroll from "./crunchyroll"

(async () => {
    // const output = await crunchyroll.api.getManga("list_chapter", {page_id: 372172, series_id: 527})
    // const pages = output.pages.map((p) => p.image_url)
    // console.log(pages)
    const result = await crunchyroll.util.parseDuration("F:/Downloads/Anime AzurLane Slow Ahead! 1.mp4")
    console.log(result)
})()
