<div align="left">
  <p>
    <a href="https://tenpi.github.io/crunchyroll.ts/"><img src="https://raw.githubusercontent.com/Tenpi/crunchyroll.ts/master/assets/crunchyroll.tslogo.png" width="600" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/crunchyroll.ts/"><img src="https://nodei.co/npm/crunchyroll.ts.png" /></a>
  </p>
</div>

### About
This is a Crunchyroll API wrapper that lets you search for anime/episodes, manage your queue, and download episodes in Node.js. In order to download episodes you are required to have [**ffmpeg**](https://ffmpeg.org/) installed.

### Insall
```ts
npm install crunchyroll.ts
```

#### Searching for anime, seasons, and episodes
```ts
import crunchyroll from "crunchyroll.ts"

async function useAPI() {
    /*Logging in is optional, only required if you want to edit your queue or view your recently watched episodes.*/
    const auth = await crunchyroll.login(username, password)

    /*You can provide either a link or query for most of the endpoints. Note that there is a distinction between an Anime Series and an Anime Season.*/
    const anime = await crunchyroll.anime.get("gabriel dropout")
    const animeLink = await crunchyroll.anime.get("https://www.crunchyroll.com/anime-gataris/")

    /*For example, SAO 2 is a season of the SAO series so you have to use season.get. Set preferSub or preferDub to only get subbed and dubbed anime respectively (if you set both, you will get both).*/
    const season = await crunchyroll.season.get("sword art online II", {preferDub: true})

    /*Both anime and season have searching methods.*/
    const animeSearch = await crunchyroll.anime.search("anime")
    const seasonSearch = await crunchyroll.season.search("my hero academia")

    /*When getting an episode, if you specify a number it will get the nth episode, otherwise it will get the first one.
    Here it will try to get the 5th episode.*/
    const episode = await crunchyroll.episode.get("sword art online 5", {preferSub: true})

    /*Or you can just pass in a link.*/
    const episodeLink = await crunchyroll.episode.get("https://www.crunchyroll.com/himouto-umaru-chan/episode-11-umarus-days-682821")

    /*If you have trouble getting an anime, you can also pass in an id. You can find it by inspecting the page source and looking for the group_id.*/
    const getByID = await crunchyroll.anime.get("277840")
}
useAPI()
```
#### Downloading anime and episodes
```ts
async function useAPI() {
    /*Downloads an episode. If you set the resolution it will try to find it, otherwise it will get a lower one. The quality is from 0-51 where lower is better. You can also set preferSub or preferDub to ensure that you get the one you want.*/
    const video = await crunchyroll.util.downloadEpisode("laid back camp 2", "./videos", {resolution: 720, quality: 16, preferSub: true}, videoProgress)

    /*Skip the video conversion and just return the m3u8 link. It is still playable on the VLC player.*/
    const m3u8 = await crunchyroll.util.downloadEpisode("log horizon 1", "./videos", {skipConversion: true})

    /*Set audioOnly to true if you just want to download the audio of the episode.*/
    const audio = await crunchyroll.util.downloadEpisode("https://www.crunchyroll.com/konosuba-gods-blessing-on-this-wonderful-world/episode-10-gods-blessing-on-this-wonderful-party-727607", 
    "./audio", {audioOnly: true}, videoProgress)

    /*You can also download a whole anime series or season (but it will take awhile...)*/
    const season = await crunchyroll.util.downloadAnime("konosuba", "./videos", {preferSub: true}, totalProgress, videoProgress)

    /*Use this to download all the video thumbnails (from the bif file).*/
    const thumbnails = await crunchyroll.util.downloadThumbnails("kancolle", "./images")

    /*Pass callback functions to track video progress and total progress. Return pause to pause, stop to stop nicely, and
    kill to stop immediately. Call the passed resume function to resume if paused.*/
    const videoProgress = (progress: FFmpegProgress, resume: () => boolean) => {
        console.log(`Time Marker: ${progress.timemark} Percent: ${progress.percent.toFixed(2)}`)
        if (progress.percent > 20) return "stop"
    }
    /*Return true in this callback to stop downloading episodes.*/
    const totalProgress = (current: number, total: number) => {
        console.log(`Current Episode: ${current} Total Episodes: ${total}`)
        if (current === 3) return true
    }
}
```

#### Editing and viewing your queue and recently watched
```ts
async function useAPI() {
  /*Don't forget to login (covered before). You can add and remove anime series from your queue very simply.*/
  await crunchyroll.queue.add("gabriel dropout")
  await crunchyroll.queue.remove("gabriel dropout")

  /*Display all the anime series in your queue. It even remembers the last episode you watched (if you watched any?)*/
  const queue = await crunchyroll.queue.show()

  /*And display recently watched episodes.*/
  const recentlyWatched = await crunchyroll.episode.recentlyWatched()
}
```

#### Common Types

<details>
<summary>CrunchyrollAnime</summary>

```ts
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
```
</details>

<details>
<summary>CrunchyrollSeason</summary>

```ts
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
    landscape_image: ImageSet
    portrait_image: ImageSet
    availability_notes: string
    created: string
}
```
</details>

<details>
<summary>CrunchyrollEpisode</summary>

```ts
export interface CrunchyrollEpisode {
    class: "media"
    media_id: string
    collection_id: string
    series_id: string
    media_type: string
    episode_number: string
    name: string
    description: string
    screenshot_image: ImageSet,
    bif_url: string
    url: string
    clip: boolean
    available: boolean
    premium_available: boolean
    free_available: boolean
    available_time: string
    unavailable_time: string
    premium_available_time: string
    premium_unavailable_time: string
    free_available_time: string
    free_unavailable_time: string
    availability_notes: string
    created: string
    duration: number
    series_name: string
    collection_name: string
    premium_only: boolean
    stream_data: {
      hardsub_lang: Language
      audio_lang: Language
      format: string
      streams: Array<{
          quality: string
          expires: string
          url: string
      }>
    },
    playhead: number
}
```
</details>