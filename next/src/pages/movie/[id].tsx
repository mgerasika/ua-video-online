import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import {
  IGroupMovieResponse,
  IImdbResponse,
  IRezkaInfoByIdResponse,
  IRezkaMovieResponse,
  ITranslationResponse,
  api,
} from '../../api/api.generated'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'
import { setTimeoutAsync } from '../../utils/set-timeout.util'
import { toQuery } from '../../utils/to-query.hook'
import { MovieDetailedContainer } from '../../features/movie-detailed/container/movie-detailed.container'

interface IProps {
  cdn_encode_video_url: string | undefined
  imdb_info: IImdbResponse | undefined
  rezka_movie_href: string | undefined
}
export default function Movie({
  cdn_encode_video_url,
  imdb_info,
  rezka_movie_href,
}: IProps) {
  return (
    <MovieDetailedContainer
      rezka_movie_href={rezka_movie_href}
      imdb_info={imdb_info}
      cdn_encode_video_url={cdn_encode_video_url}
    />
  )
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
  revalidate: number
}> {
  const [groupMovie] = await toQuery(() => api.groupMovieIdGet(params.id, {}))
  const [detailedInfo] =
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
      ? await Promise.resolve([
          { cdn_encoded_video_url: '' } as IRezkaInfoByIdResponse,
        ])
      : await toQuery(() =>
          api.parserRezkaDetailsPost({
            imdb_id: groupMovie?.imdb_info.id || '',
          }),
        )

  return {
    props: {
      rezka_movie_href: groupMovie?.rezka_movie.href,
      imdb_info: groupMovie?.imdb_info,
      cdn_encode_video_url: detailedInfo?.cdn_encoded_video_url,
    },
    revalidate: 60 * 60 * 12, // in seconds
  }
}

export async function getStaticPaths() {
  const response = await api.groupMovieGet()
  return {
    paths: response.data.map(groupMovie => {
      return {
        params: { id: groupMovie.imdb_info.id },
      }
    }),
    fallback: false,
  }
}
