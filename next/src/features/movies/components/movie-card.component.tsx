import 'twin.macro'
import {
  IGroupMovieResponse,
  IImdbResponse,
  IRezkaMovieResponse,
  ITranslationResponse,
} from '../../../api/api.generated'
import Link from 'next/link'
import { StatusTag } from '../../../general-ui/status-tag/status-tag.component'
import { ALL_LANG } from '../containers/movies.container'

interface IProps {
  movie: IGroupMovieResponse
}
export const MovieCard = ({ movie }: IProps): JSX.Element => {
  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
    <Link
      tw="w-full flex flex-col items-center cursor-pointer"
      href={'/movie/' + movie.imdb_id}
    >
      <div tw="w-[280px] transition duration-200 ease-in transform hover:scale-110">
        <div tw="relative">
          <img
            src={movie.poster || ''}
            tw="w-full h-[429px] [object-fit: cover] [border-radius: 6px]"
            alt=""
          />
          <StatusTag tw="top-1 left-1 absolute">Imdb {movie.rate}</StatusTag>
        </div>

        <div tw="bottom-0 left-0 mt-1">
          <StatusTag tw="mr-2 my-1 float-left">{movie.year}</StatusTag>
          {movie.genre
            .split(',')
            .map(genre => genre.trim())
            .map(genre => (
              <StatusTag key={genre} tw="mr-2 my-1 float-left">
                {genre}
              </StatusTag>
            ))}
          {movie.has_en && (
            <StatusTag tw="mr-2 my-1 float-left">{ALL_LANG[0]}</StatusTag>
          )}
          {movie.has_ua && (
            <StatusTag tw="mr-2 my-1 float-left">{ALL_LANG[1]}</StatusTag>
          )}
        </div>
        {/* <p tw="clear-both text-white [font-size: larger] pt-2 text-center">
          {imdb_info.en_name}
        </p> */}
      </div>
    </Link>
  )
}
