import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress, resume) => {
        console.log(progress.percent)
        if (progress.percent > 2) return "pause"
    }
    const output = await crunchyroll.util.downloadEpisode("gabriel dropout 2", "./videos", {}, progress)
    console.log(output)
})()
