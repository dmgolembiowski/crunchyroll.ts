import axios from "axios"
import {ffmpeg, setFFmpegPath, setFFprobePath} from "eloquent-ffmpeg"
import fs from "fs"
import path from "path"
import which from "which"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason, DownloadOptions, FFmpegProgress} from "../types"
import {Anime} from "./Anime"
import {Episode} from "./Episode"
export class Util {
    private static readonly parsem3u8 = (manifest: any) => {
      const m3u8Parser = require("m3u8-parser")
      const parser = new m3u8Parser.Parser()
      parser.push(manifest)
      parser.end()
      return parser.manifest
    }

    public static formatMS = (ms: number) => {
      const sec = ms / 1000
      const hours = parseInt(String(Math.floor(sec / 3600)), 10)
      const minutes = parseInt(String(Math.floor(sec / 60) % 60), 10)
      const seconds = parseInt(String(sec % 60), 10)
      const str = [hours, minutes, seconds]
          .map((v) => v < 10 ? "0" + v : v)
          .filter((v, i) => v !== "00" || i > 0)
          .join(":")
      return str.startsWith("0") ? str.slice(1) : str
    }

    public static parseAnime = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason) => {
      let anime = null as unknown as CrunchyrollAnime
      if (animeResolvable.hasOwnProperty("series_id") && !animeResolvable.hasOwnProperty("collection_id")) {
          anime = animeResolvable as CrunchyrollAnime
      } else {
          const phrases = animeResolvable.hasOwnProperty("collection_id") ? (animeResolvable as CrunchyrollSeason).name.split(/ +/g) : (animeResolvable as string).split(/ +/g)
          while (!anime) {
              if (!phrases.length) return Promise.reject(`no anime found for ${animeResolvable}`)
              try {
                  anime = await Anime.get(phrases.join(" ")) as CrunchyrollAnime
              } catch {
                  phrases.pop()
              }
          }
      }
      return anime
    }

    private static readonly findQuality = async (episode: CrunchyrollEpisode, quality?: number) => {
      if (!quality) quality = 1080
      const found: any[] = []
      for (let i = 0; i < episode.stream_data.streams.length; i++) {
        const stream = episode.stream_data.streams[i].url
        const manifest = await axios.get(stream).then((r) => r.data)
        const m3u8 = Util.parsem3u8(manifest)
        let playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === quality)
        if (!playlist && quality >= 720) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 720)
        if (!playlist && quality >= 480) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 480)
        if (!playlist && quality >= 360) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 360)
        if (!playlist && quality >= 240) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 240)
        if (playlist) found.push(playlist)
      }
      if (!found[0]) return null
      return found.reduce((prev, curr) => curr.attributes.RESOLUTION.height > prev.attributes.RESOLUTION.height ? curr : prev)
    }

    public static parseDest = (episode: CrunchyrollEpisode, format: string, dest?: string) => {
      if (!dest) dest = "./"
      if (!path.isAbsolute(dest)) {
        const local = __dirname.includes("node_modules") ? path.join(__dirname, "../../../../") : path.join(__dirname, "../../")
        dest = path.join(local, dest)
      }
      if (format === "png") {
        return `${dest}/${episode.collection_name.replace(/-/g, " ").replace(/:/g, "")} ${episode.episode_number}`
      }
      if (!path.extname(dest)) dest += `/${episode.collection_name.replace(/-/g, " ").replace(/:/g, "")} ${episode.episode_number}.${format}`
      return dest
    }

    public static downloadEpisode = async (episodeResolvable: string | CrunchyrollEpisode, dest?: string, options?: DownloadOptions, videoProgress?: (progress: FFmpegProgress, resume: () => any) => void | "pause" | "stop" | "kill") => {
      if (!options) options = {}
      if (options.ffmpegPath) {
        setFFmpegPath(options.ffmpegPath)
      } else {
        setFFmpegPath(which.sync("ffmpeg"))
      }
      if (options.ffprobePath) {
        setFFprobePath(options.ffprobePath)
      } else {
        setFFprobePath(which.sync("ffprobe"))
      }
      let episode = null as CrunchyrollEpisode | null
      if (episodeResolvable.hasOwnProperty("url")) {
          episode = episodeResolvable as CrunchyrollEpisode
      } else {
          episode = await Episode.get(episodeResolvable as string, {preferSub: options.preferSub, preferDub: options.preferDub})
      }
      let format = "mp4"
      if (options.audioOnly) format = "mp3"
      if (options.skipConversion) format = "m3u8"
      dest = Util.parseDest(episode, format, dest)
      const folder = path.dirname(dest)
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
      const playlist = await Util.findQuality(episode, options.resolution)
      if (!playlist) return Promise.reject("can't download this episode (is it premium only?)")
      const resolution = playlist.attributes.RESOLUTION.height
      if (options.skipConversion) return playlist.uri as string
      let ffmpegArgs = ["-acodec", "copy", "-vcodec", "copy", "-crf", `${options?.quality || 16}`, "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
      if (options.audioOnly) ffmpegArgs = []
      const video = ffmpeg()
      const input = video.input(playlist.uri)
      const info = await input.probe()
      video.output(dest).args(...ffmpegArgs)
      const process = await video.spawn()
      let killed = false
      if (videoProgress) {
        for await (const progress of process.progress()) {
          const percent = progress.time / info.duration * 100
          const result = videoProgress({...progress, percent, resolution, duration: info.duration}, () => process.resume())
          if (result === "pause") {
            process.pause()
          } else if (result === "kill") {
            killed = true
            process.kill("SIGKILL")
          } else if (result === "stop") {
            await process.abort().catch(() => null)
          }
        }
      }
      try {
        await process.complete()
      } catch (err) {
        if (!killed) return Promise.reject(err)
      }
      return dest as string
    }

    public static downloadAnime = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason, destFolder?: string, options?: DownloadOptions, totalProgress?: (current: number, total: number) => boolean | void, videoProgress?: (progress: FFmpegProgress, resume: () => boolean) => void | "pause" | "stop" | "kill") => {
      if (!options) options = {}
      const episodes = await Anime.episodes(animeResolvable, {preferSub: options.preferSub, preferDub: options.preferDub})
      const resultArray: string[] = []
      for (let i = 0; i < episodes.length; i++) {
        try {
          const result = await Util.downloadEpisode(episodes[i], destFolder, options, videoProgress)
          resultArray.push(result)
          const stop = totalProgress ? totalProgress(i + 1, episodes.length) : false
          if (stop) break
        } catch {
          continue
        }
      }
      return resultArray
    }

    public static downloadThumbnails = async (episodeResolvable: string | CrunchyrollEpisode, dest?: string, options?: {ffmpegPath?: string}) => {
      if (!options) options = {}
      if (options.ffmpegPath) {
        setFFmpegPath(options.ffmpegPath)
      } else {
        setFFmpegPath(which.sync("ffmpeg"))
      }
      let episode = null as unknown as CrunchyrollEpisode
      if (episodeResolvable.hasOwnProperty("url")) {
          episode = episodeResolvable as CrunchyrollEpisode
      } else {
          episode = await Episode.get(episodeResolvable as string)
      }
      const folder = Util.parseDest(episode, "png", dest)
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
      const video = ffmpeg()
      video.input(episode.bif_url)
      video.output(`${folder}/thumb%d.png`)
      const process = await video.spawn()
      await process.complete()
      return folder as string
    }
}
