import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        if (progress.percent > 10) return "stop"
    }
    const anime = await  crunchyroll.anime.get("272199")
    const output = await crunchyroll.anime.episodes(anime, {preferSub: true})
    console.log(output)
})()
