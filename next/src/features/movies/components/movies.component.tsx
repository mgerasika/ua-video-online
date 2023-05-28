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

interface IProps {
  genres: string[]
  filter: IMovieFilter
  onFilterChange: (filter: IMovieFilter) => void
  movies: IGroupMovieResponse[] | undefined
}
export const MoviesComponent = ({ movies, genres, filter, onFilterChange }: IProps): JSX.Element => {
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
    <div tw="mx-auto container">
      <h2 tw="text-white text-[30px] text-center  py-4">HD Online (UA)</h2>

      <MovieFilter genres={genres} filter={filter} onFilterChange={onFilterChange} />
      <div tw="grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-6  justify-items-center">
        {movies?.map(movie => {
          return (
            <MovieCard
              key={movie.imdb_info.en_name}
              movie={movie}
              hasStream={true}
            />
          )
        })}
      </div>
    </div>
  )
}
