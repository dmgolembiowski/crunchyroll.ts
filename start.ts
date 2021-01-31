import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(crunchyroll.util.formatMS(progress.time))
        console.log(crunchyroll.util.formatMS(progress.duration))
    }
    const output = await crunchyroll.util.downloadEpisode("konosuba 1", "./videos", {preferDub: true}, progress)
    console.log(output)
})()
