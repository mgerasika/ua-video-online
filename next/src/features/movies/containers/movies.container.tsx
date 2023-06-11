import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  ERezkaVideoType,
  IGroupMovieResponse,
} from '../../../api/api.generated'
import 'twin.macro'
import { MoviesComponent } from '../components/movies.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import { useScrollEnd } from '../../../use-scroll-end.hook'
import { useLocalStorageState } from '../../../hooks/use-local-storage-state.hook'

const PAGE_SIZE = 20

interface IProps {
  allMovies: IGroupMovieResponse[]
  allGenres: string[]
  allYears: string[]
}
export const ALL_LANG = ['audio original', 'audio ukrainian']
export const MoviesContainer = ({
  allMovies,
  allGenres,
  allYears,
}: IProps): JSX.Element => {
  const [filter, setFilter] = useLocalStorageState<IMovieFilter>('filter-v3', {
    genres: [],
    years: [],
    video_types: [],
    languages: [],
    searchText: '',
  })

  const [page, setPage] = useState(0)

  const filteredMovies = useMemo<IGroupMovieResponse[]>(() => {
    let res = [...allMovies]

    if (filter.searchText) {
      const search = filter.searchText.toLowerCase()
      res = res.filter(
        movie =>
          movie.name.toLowerCase().includes(search) ||
          movie.ua_name.toLowerCase().includes(search),
      )
    }
    if (filter?.video_types.length) {
      res = res.filter(movie => filter.video_types.includes(movie.video_type))
    }
    if (filter?.genres.length) {
      res = res.filter(movie =>
        filter.genres.some(filterGenre => movie.genre.includes(filterGenre)),
      )
    }

    if (filter?.languages.length) {
      res = res.filter(movie => {
        if (movie.has_en && filter.languages.includes(ALL_LANG[0])) {
          return true
        }
        if (movie.has_ua && filter.languages.includes(ALL_LANG[1])) {
          return true
        }
      })
    }

    if (filter?.years.length) {
      const YEAR_PAIRS = filter.years.map(year => {
        const yearPair = year.split('-')
        return {
          from: +yearPair[0],
          to: +yearPair[yearPair.length - 1],
        }
      })
      res = res.filter(movie => {
        return YEAR_PAIRS.some(
          yearPair =>
            +movie.year >= yearPair.from && +movie.year <= yearPair.to,
        )
      })
    }
    return res
  }, [allMovies, filter])

  const movies = useMemo(() => {
    return filteredMovies?.slice(
      0,
      Math.min(filteredMovies.length, PAGE_SIZE * (page + 1)),
    )
  }, [page, filteredMovies])

  const hasNext = useMemo(() => {
    return PAGE_SIZE * (page + 1) < filteredMovies.length
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
        allCount={allMovies.length}
        filteredCount={filteredMovies.length}
        allGenres={allGenres}
        allYears={allYears}
        movies={movies}
        filter={filter}
        onFilterChange={settings => {
          setPage(0)
          sessionStorage.setItem('page', 0 + '')
          setFilter(settings)
        }}
      />
      <div tw="p-6 text-center text-2xl">
        {hasNext ? (
          <div onClick={handleScrollEnd} tw="text-white ">
            Next
          </div>
        ) : null}
      </div>
    </>
  )
}
