import crunchyroll from "./crunchyroll"

(async () => {
    const progress = (progress) => {
        if (progress.percent > 10) return "stop"
    }
    const output = await crunchyroll.episode.get("gabriel dropout 2", {preferDub: true, language: "jaJP"})
    console.log(output)
})()
