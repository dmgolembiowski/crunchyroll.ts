import {ImageSet} from "./index"

export interface CrunchyrollSeason {
    class: "collection"
    collection_id: string
    etp_guid: string
    series_id: string
    series_etp_guid: string
    name: string
    description: string
    media_type: string
    season: string
    complete: boolean
    landscape_image?: ImageSet
    portrait_image?: ImageSet
    availability_notes: string
    created: string
}
