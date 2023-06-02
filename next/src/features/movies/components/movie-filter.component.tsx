import { useCallback } from 'react'
import { SelectedButton } from '../../../general-ui/selected-button/selected-button.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import 'twin.macro'
import { ERezkaVideoType } from '../../../api/api.generated'
import { SelectButtonList } from '../../../general-ui/select-button-list/select-button-list.component'
import { ALL_LANG } from '../containers/movies.container'

interface IProps {
  allGenres: string[]
  allYears: string[]
  filter: IMovieFilter
  onFilterChange: (filter: IMovieFilter) => void
}
export const MovieFilter = ({
  allGenres,
  filter,
  allYears,
  onFilterChange,
}: IProps) => {
  const handleGenreChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        genres: newValues,
      })
    },
    [filter, onFilterChange],
  )

  const handleVideoTypeChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        video_types: newValues as unknown as ERezkaVideoType[],
      })
    },
    [filter, onFilterChange],
  )

  const handleYearsChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        years: newValues,
      })
    },
    [filter, onFilterChange],
  )

  const handleLanguageChange = useCallback(
    (newValues: string[]) => {
      onFilterChange({
        ...filter,
        languages: newValues,
      })
    },
    [filter, onFilterChange],
  )
  return (
    <div tw="text-white">
      <SelectButtonList
        showAll={false}
        allItems={allYears}
        onChange={handleYearsChange}
        value={filter.years}
      />

      <SelectButtonList
        showAll={false}
        allItems={Object.values(ERezkaVideoType)}
        onChange={handleVideoTypeChange}
        value={filter.video_types}
      />

      <SelectButtonList
        showAll={false}
        allItems={ALL_LANG}
        onChange={handleLanguageChange}
        value={filter.languages}
      />

      <SelectButtonList
        tw="mb-4"
        showAll={false}
        allItems={allGenres}
        onChange={handleGenreChange}
        value={filter.genres}
      />
    </div>
  )
}
