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

interface IProps {
  imdb_info: IImdbResponse | undefined
  rezka_movie: IRezkaMovieResponse | undefined
  translation?: ITranslationResponse | undefined
  rezka_cherio_info: IRezkaInfoByIdResponse | undefined
}
export default function Movie({
  rezka_movie,
  imdb_info,
  translation,
  rezka_cherio_info,
}: IProps) {
  return (
    <MovieDetailed
      rezka_movie={rezka_movie}
      imdb_info={imdb_info}
      translation={translation}
      rezka_cherio_info={rezka_cherio_info}
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
  const [detailedInfo] = await setTimeoutAsync(
    async () =>
      await toQuery(() =>
        api.parserRezkaDetailsPost({
          imdb_id: groupMovie?.imdb_info.id || '',
        }),
      ),
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ? 10 * 1000 : 0,
  )

  return {
    props: {
      rezka_movie: groupMovie?.rezka_movie,
      imdb_info: groupMovie?.imdb_info,
      translation: groupMovie?.translation,
      rezka_cherio_info: detailedInfo,
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
