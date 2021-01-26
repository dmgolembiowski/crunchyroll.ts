import {assert} from "chai"
import "mocha"
import crunchyroll from "../crunchyroll"

describe("Episode", async function() {
    it("should get an episode", async function() {
        const response = await crunchyroll.episode.get("gabriel dropout 5")
        assert(response?.hasOwnProperty("media_id"))
    })
})
