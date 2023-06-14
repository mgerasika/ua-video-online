import {
  IActorResponse,
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
import { IS_BUILD_TIME } from '../../constants/is-build-time.constant'
import { ActorContainer } from '../../features/actor/containers/actor.container'

interface IProps {
  actor: IActorResponse | undefined
  movies: IGroupMovieResponse[]
}
export default function Actor({ movies, actor }: IProps) {
  return <ActorContainer allMovies={movies} actor={actor} />
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
}> {
  const actor = await api.actorIdGet(params.id)
  const movies = await api.groupMovieV2Get({ actor_id: params.id })
  return {
    props: {
      actor: actor.data,
      movies: movies.data || [],
    },
  }
}

export async function getStaticPaths() {
  const response = await api.actorGet({})
  return {
    paths: response.data.map(actor => {
      return {
        params: { id: actor.id },
      }
    }),
    fallback: false,
  }
}
