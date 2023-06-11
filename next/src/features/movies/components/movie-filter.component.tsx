import { useCallback, useEffect, useRef, useState } from 'react'
import { SelectedButton } from '../../../general-ui/selected-button/selected-button.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import 'twin.macro'
import { ERezkaVideoType } from '../../../api/api.generated'
import { SelectButtonList } from '../../../general-ui/select-button-list/select-button-list.component'
import { ALL_LANG } from '../containers/movies.container'
import { useIsMounted } from '../../../use-is-mounted.hook'

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
  const [text, setText] = useState(filter.searchText)

  useEffect(() => {
    setText(filter.searchText)
  }, [filter.searchText])

  const isMounted = useIsMounted()
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

  const intervalRef = useRef<any>()
  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value)

      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current)
      }
      intervalRef.current = setTimeout(() => {
        if (isMounted) {
          onFilterChange({
            ...filter,
            searchText: e.target.value,
          })
        }
      }, 800)
    },
    [filter, onFilterChange],
  )
  return (
    <div tw="text-white">
      <div tw="mx-1 my-2">
        <input
          placeholder="enter search text here"
          type="text"
          tw="[border-radius: 6px] w-full text-black outline-none px-2 py-1"
          value={text}
          onChange={handleSearchTextChange}
        />
      </div>
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
        showAll={false}
        allItems={allGenres}
        onChange={handleGenreChange}
        value={filter.genres}
      />
    </div>
  )
}
