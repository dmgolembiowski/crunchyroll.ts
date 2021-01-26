import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress.percent)
    }
    // const output = await crunchyroll.util.downloadEpisode("https://www.crunchyroll.com/anime-azurlane-slow-ahead/episode-3-is-real-life-a-god-tier-game-801707", "./videos", {}, progress)
    const output = await crunchyroll.util.downloadThumbnails("kancolle", "./videos")
    console.log(output)
})()
