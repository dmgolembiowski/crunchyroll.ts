import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress, resume) => {
        console.log(progress.id)
        if (progress.percent > 2) return "stop"
    }
    crunchyroll.util.downloadEpisode("gabriel dropout 2", "./videos", {id: 1}, progress)
    crunchyroll.util.downloadEpisode("gabriel dropout 3", "./videos", {id: 2}, progress)
})()
