import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        console.log(progress.resolution)
    }
    const output = await crunchyroll.episode.get("himouto umaru chan 4")
    console.log(output)
})()
