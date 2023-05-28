import {
  IGroupMovieResponse,
  IRezkaInfoByIdResponse,
  api,
} from '../../api/api.generated'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'
import { setTimeoutAsync } from '../../utils/set-timeout.util'

interface IProps {
  movie: IGroupMovieResponse
  rezka_cherio_info: IRezkaInfoByIdResponse
}
export default function Movie({ movie, rezka_cherio_info }: IProps) {
  return <MovieDetailed movie={movie} rezka_cherio_info={rezka_cherio_info} />
}

export async function getStaticProps({
  params,
}: {
  params: { id: string }
}): Promise<{
  props: IProps
  revalidate: number
}> {
  const groupMovie = await api.groupMovieIdGet(params.id, {})
  const detailedInfo = await setTimeoutAsync(
    async () =>
      await api.parserRezkaDetailsPost({
        imdb_id: groupMovie.data.imdb_info.id,
      }),
    0,
  )

  return {
    props: {
      movie: groupMovie.data,
      rezka_cherio_info: detailedInfo.data,
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
