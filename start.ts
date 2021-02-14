import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        if (progress.percent > 10) return "stop"
    }
    // const output = await crunchyroll.util.downloadEpisode("dragon maid 4", "./videos", {preferSub: true}, progress)
    const output = await crunchyroll.episode.get("konosuba 4", {preferDub: true, language: "enUS"})
    console.log(output)
})()
