import crunchyroll from "./crunchyroll"

(async () => {
    /*
    const progress = (progress) => {
        console.log(progress.percent)
    }
    const output = await crunchyroll.util.downloadEpisode("https://www.crunchyroll.com/anime-gataris/episode-9-the-anime-club-forever-snobs-749917", "./videos", {}, progress)*/
    const output = await crunchyroll.anime.get("gabriel dropout")
    console.log(output)
})()
