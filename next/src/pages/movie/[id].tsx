import {
  IActorResponse,
  IGroupMovieResponse,
  IImdbResponse,
  IRezkaInfoByIdResponse,
  IRezkaMovieActorDto,
  IRezkaMovieResponse,
  ITranslationResponse,
  api,
} from '../../api/api.generated'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'
import { setTimeoutAsync } from '../../utils/set-timeout.util'
import { toQuery } from '../../utils/to-query.hook'
import { MovieDetailedContainer } from '../../features/movie-detailed/container/movie-detailed.container'
import { IS_BUILD_TIME } from '../../constants/is-build-time.constant'

interface IProps {
  imdb_info: IImdbResponse | undefined
  rezka_movie_href: string | undefined
  actors: IRezkaMovieActorDto[] | undefined
}
export default function Movie({ imdb_info, rezka_movie_href, actors }: IProps) {
  return (
    <MovieDetailedContainer
      actors={actors}
      rezka_movie_href={rezka_movie_href}
      imdb_info={imdb_info}
    />
  )
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
}> {
  const [groupMovie] = await toQuery(() => api.groupMovieIdGet(params.id))

  return {
    props: {
      rezka_movie_href: groupMovie?.rezka_movie_href,
      imdb_info: groupMovie?.imdb_info,
      actors: groupMovie?.actors || [],
    },
  }
}

export async function getStaticPaths() {
  const response = await api.groupMovieGet()
  return {
    paths: response.data.map(groupMovie => {
      return {
        params: { id: groupMovie.imdb_id },
      }
    }),
    fallback: false,
  }
}
