import { useCallback } from 'react'
import { SelectedButton } from '../../../general-ui/selected-button/selected-button.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import 'twin.macro'

interface IProps {
  genres: string[]
  filter: IMovieFilter
  onFilterChange: (filter: IMovieFilter) => void
}
export const MovieFilter = ({ genres, filter, onFilterChange }: IProps) => {
  const handleGenreChange = useCallback(
    (name: string, selected: boolean) => {
      if (selected) {
        onFilterChange({ ...filter, genres: [...filter.genres, name] })
      } else {
        onFilterChange({
          ...filter,
          genres: [...filter.genres.filter(f => f !== name)],
        })
      }
    },
    [filter, onFilterChange],
  )
  return (
    <div tw="text-white">
      <div tw="float-left">
        {genres.map(genre => {
          return (
            <SelectedButton
              key={genre}
              name={genre}
              title={genre}
              onChange={handleGenreChange}
              selected={filter.genres.includes(genre)}
            />
          )
        })}
      </div>
      <div tw="clear-both mb-4"></div>
    </div>
  )
}
