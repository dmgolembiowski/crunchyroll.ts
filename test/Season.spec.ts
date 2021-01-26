import {assert} from "chai"
import "mocha"
import crunchyroll from "../crunchyroll"

describe("Season", async function() {
    it("should get a season", async function() {
        const response = await crunchyroll.season.get("sword art online II")
        assert(response.hasOwnProperty("collection_id"))
    })

    it("should search for seasons", async function() {
        const response = await crunchyroll.season.search("sword art online II")
        assert(response[0].hasOwnProperty("collection_id"))
    })
})
