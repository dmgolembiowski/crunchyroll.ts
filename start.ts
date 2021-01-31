import crunchyroll from "./crunchyroll"

(async () => {
    const output = await crunchyroll.anime.episodes("konosuba", {preferDub: true})
    console.log(output[0])
})()
