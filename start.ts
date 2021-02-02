import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        if (progress.percent > 10) return "stop"
    }
    const output = await crunchyroll.util.downloadEpisode("https://www.crunchyroll.com/anime-azurlane-slow-ahead/episode-3-is-real-life-a-god-tier-game-801707", "./videos", {preferSub: true, resolution: 720}, progress)
    console.log(output)
})()
