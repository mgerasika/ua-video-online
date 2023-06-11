import React, { useEffect, useMemo, useRef } from 'react'
import { MovieCard } from './movie-card.component'
import {
  IGroupMovieResponse,
  ISearchRezkaMovieResponse,
} from '../../../api/api.generated'
import 'twin.macro'
import { useIsMounted } from '../../../use-is-mounted.hook'
import { MovieFilter } from './movie-filter.component'
import { IMovieFilter } from '../../../interfaces/movie-filter.interface'
import { Layout } from '../../../general-ui/layout/layout.component'

interface IProps {
  allCount: number
  filteredCount: number
  allYears: string[]
  allGenres: string[]
  filter: IMovieFilter
  onFilterChange: (filter: IMovieFilter) => void
  movies: IGroupMovieResponse[] | undefined
}
export const MoviesComponent = ({
  filteredCount,
  allCount,
  movies,
  allGenres,
  allYears,
  filter,
  onFilterChange,
}: IProps): JSX.Element => {
  useEffect(() => {
    let interval = 0
    const handleScroll = () => {
      interval = window.setTimeout(() => {
        window.sessionStorage.setItem('scrollTop', window.scrollY + '')
      }, 500)
    }

    window.addEventListener('scroll', handleScroll)

    return (): void => {
      window.clearTimeout(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const interval = setTimeout(() => {
      const position = window.sessionStorage.getItem('scrollTop')
      if (position) {
        window.scrollTo({ left: 0, top: +position || 0 })
      }
    })
    return () => window.clearInterval(interval)
  }, [400])

  return (
    <Layout showBack={false}>
      <MovieFilter
        allGenres={allGenres}
        allYears={allYears}
        filter={filter}
        onFilterChange={onFilterChange}
      />
      <div tw="text-left text-white pb-1 px-1">
        {filteredCount === allCount ? (
          <> {allCount}</>
        ) : (
          <>
            {filteredCount} / {allCount}
          </>
        )}
      </div>
      <div tw="grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-12  justify-items-center">
        {movies?.map(movie => {
          return <MovieCard key={movie.imdb_id} movie={movie} />
        })}
      </div>
    </Layout>
  )
}
