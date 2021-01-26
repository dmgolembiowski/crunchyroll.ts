import {assert} from "chai"
import "mocha"
import crunchyroll from "../crunchyroll"

describe("Anime", async function() {
    it("should get an anime", async function() {
        const response = await crunchyroll.anime.get("gabriel dropout")
        assert(response?.hasOwnProperty("series_id"))
    })

    it("should search for anime", async function() {
        const response = await crunchyroll.anime.search("gabriel dropout")
        assert(response[0].hasOwnProperty("series_id"))
    })

    it("should get episodes", async function() {
        const response = await crunchyroll.anime.episodes("gabriel dropout")
        assert(response[0].hasOwnProperty("media_id"))
    })
})
