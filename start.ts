import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress.resolution)
    }
    const output = await crunchyroll.util.downloadEpisode("konosuba 1", "./videos", {preferDub: true}, progress)
    console.log(output)
})()
