import {ImageSet} from "./index"

export interface CrunchyrollAnime {
    class: "series"
    series_id: string
    url: string
    name: string
    media_type: string
    landscape_image: ImageSet
    portrait_image: ImageSet
    description: string
    in_queue: boolean
    rating: number
    media_count: number
    collection_count: number
    publisher_name: string
    year: string | null
    genres: string[]
}
