import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress.resolution)
    }
    const season = await crunchyroll.season.get("konosuba", {preferSub: true})
    const output = await crunchyroll.anime.episodes(season)
    console.log(output.map((e) => e.collection_name))
})()
