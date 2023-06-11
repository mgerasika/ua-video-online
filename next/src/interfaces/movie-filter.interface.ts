import { ERezkaVideoType } from '../api/api.generated'

export interface IMovieFilter {
  genres: string[]
  years: string[]
  languages: string[]
  video_types: ERezkaVideoType[]
  searchText: string
}
