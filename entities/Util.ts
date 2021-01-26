import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import {CrunchyrollAnime, CrunchyrollEpisode, CrunchyrollSeason, FFmpegProgress} from "../types"
import {Anime} from "./Anime"
import {Episode} from "./Episode"

export interface DownloadOptions {
  resolution?: number
  quality?: number
  skipConversion?: boolean
  audioOnly?: boolean
  preferSub?: boolean
  preferDub?: boolean
  ffmpegPath?: string
}

export class Util {
    private static readonly parsem3u8 = (manifest: any) => {
      const m3u8Parser = require("m3u8-parser")
      const parser = new m3u8Parser.Parser()
      parser.push(manifest)
      parser.end()
      return parser.manifest
    }

    public static parseAnime = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason) => {
      let anime = null as unknown as CrunchyrollAnime
      if (animeResolvable.hasOwnProperty("series_id")) {
          anime = animeResolvable as CrunchyrollAnime
      } else {
          const phrases = (animeResolvable as string).split(/ +/g)
          while (!anime) {
              if (!phrases.length) return Promise.reject(`no results found for ${animeResolvable}`)
              try {
                  anime = await Anime.get(phrases.join(" ")) as CrunchyrollAnime
              } catch {
                  phrases.pop()
              }
          }
      }
      return anime
    }

    public static downloadEpisode = async (episodeResolvable: string | CrunchyrollEpisode, dest?: string, options?: DownloadOptions, videoProgress?: (progress: FFmpegProgress) => void) => {
      if (!options) options = {}
      if (options.ffmpegPath) ffmpeg.setFfmpegPath(options.ffmpegPath)
      if (!dest) dest = "./"
      let episode = null as CrunchyrollEpisode | null
      if (episodeResolvable.hasOwnProperty("url")) {
          episode = episodeResolvable as CrunchyrollEpisode
      } else {
          episode = await Episode.get(episodeResolvable as string, {preferSub: options.preferSub, preferDub: options.preferDub})
      }
      const folder = path.extname(dest) ? path.dirname(dest) : dest
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
      if (!path.extname(dest)) dest += `/${episode.collection_name.replace(/-/g, " ")} ${episode.episode_number}.${options.audioOnly ? "mp3" : "mp4"}`
      const stream = episode.stream_data.streams[0].url
      const manifest = await axios.get(stream).then((r) => r.data)
      const m3u8 = Util.parsem3u8(manifest)
      let playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === options?.resolution || 1080)
      if (!playlist) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 720)
      if (!playlist) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 480)
      if (options.skipConversion) return playlist.uri as string
      let ffmpegArgs = ["-acodec", "copy", "-vcodec", "copy", "-crf", `${options?.quality || 16}`, "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
      if (options.audioOnly) ffmpegArgs = []
      await new Promise<void>((resolve) => {
          ffmpeg(playlist.uri).outputOptions(ffmpegArgs).save(dest)
          .on("progress", (progress: FFmpegProgress) => {if (videoProgress) videoProgress(progress)})
          .on("end", () => resolve())
          .on("error", (err: any) => Promise.reject(err))
      })
      return dest as string
    }

    public static downloadAnime = async (animeResolvable: string | CrunchyrollAnime | CrunchyrollSeason, destFolder?: string, options?: DownloadOptions, totalProgress?: (current: number, total: number) => boolean | void, videoProgress?: (progress: FFmpegProgress) => void) => {
      if (!options) options = {}
      const episodes = await Anime.episodes(animeResolvable, {preferSub: options.preferSub, preferDub: options.preferDub})
      const resultArray: string[] = []
      for (let i = 0; i < episodes.length; i++) {
        const result = await Util.downloadEpisode(episodes[i], destFolder, options, videoProgress)
        resultArray.push(result)
        const stop = totalProgress ? totalProgress(i + 1, episodes.length) : false
        if (stop) break
      }
      return resultArray
    }
}
