import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        if (progress.percent > 10) return "stop"
    }
    const output = await crunchyroll.util.downloadEpisode("dragon maid 4", "./videos", {preferSub: true}, progress)
    console.log(output)
})()
