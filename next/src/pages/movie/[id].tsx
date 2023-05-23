import {
  IGroupMovieResponse,
  IStreamResponse,
  api,
} from '../../api/api.generated'
import { MovieDetailed } from '../../features/movie-detailed/components/movie-detailed.component'
import { setTimeoutAsync } from '../../utils/set-timeout.util'

interface IProps {
  movie: IGroupMovieResponse
  encoded_video_url: string
}
export default function Movie({ movie, encoded_video_url }: IProps) {
  return <MovieDetailed movie={movie} encoded_video_url={encoded_video_url} />
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
      encoded_video_url: detailedInfo.data.cdn_encoded_video_url,
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
