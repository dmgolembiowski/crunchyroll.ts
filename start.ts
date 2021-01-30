import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress, resume) => {
        console.log(progress.percent)
        if (progress.percent > 2) return "kill"
    }
    crunchyroll.util.downloadEpisode("gabriel dropout 2", "./videos", {}, progress)
    // crunchyroll.util.downloadEpisode("gabriel dropout 3", "./videos", {}, progress)
})()
