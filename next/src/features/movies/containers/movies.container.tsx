import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  IGroupMovieResponse,
  IImdbResponse,
  ISearchRezkaMovieResponse,
} from '../../../api/api.generated'
import 'twin.macro'
import { useIsMounted } from '../../../use-is-mounted.hook'
import { MoviesComponent } from '../components/movies.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import { useScrollEnd } from '../../../use-scroll-end.hook'

const PAGE_SIZE = 5

interface IProps {
  allMovies: IGroupMovieResponse[]
  genres: string[]
}
export const MoviesContainer = ({ allMovies, genres }: IProps): JSX.Element => {
  const [filter, setFilter] = useState<IMovieFilter>({ genres: [] })

  const [page, setPage] = useState(0)

  const filteredMovies = useMemo<IGroupMovieResponse[]>(() => {
    let res = [...allMovies]
    if (filter.genres.length) {
      res = res.filter(movie =>
        filter.genres.some(filterGenre =>
          movie.imdb_info.jsonObj.Genre.includes(filterGenre),
        ),
      )
    }
    return res
  }, [allMovies, filter])

  const movies = useMemo(() => {
    return filteredMovies?.slice(
      0,
      Math.min(filteredMovies.length, PAGE_SIZE * (page + 1)),
    )
  }, [page, filteredMovies])

  const handleScrollEnd = useCallback(() => {
    setPage(prev => {
      const newVal = prev + 1
      sessionStorage.setItem('page', newVal + '')
      return newVal
    })
  }, [page])

  useEffect(() => {
    const newPage = sessionStorage.getItem('page')
    if (newPage) {
      setPage(+newPage)
    }
  }, [])

  useScrollEnd({
    onScrollEnd: handleScrollEnd,
  })

  return (
    <>
      <MoviesComponent
        genres={genres}
        movies={movies}
        filter={filter}
        onFilterChange={setFilter}
      />
      <div tw="p-6 text-center text-2xl">
        <div onClick={handleScrollEnd} tw="text-white ">
          Next
        </div>
      </div>
    </>
  )
}
