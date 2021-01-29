import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress)
        if (progress.percent > 2) return "stop"
    }
    const output = await crunchyroll.util.downloadEpisode("gabriel dropout", "./videos", {}, progress)
    // const output = await crunchyroll.util.downloadThumbnails("kancolle", "./videos")
    console.log(output)
})()
