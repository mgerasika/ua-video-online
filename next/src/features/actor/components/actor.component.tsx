import React, { useEffect, useMemo, useRef } from 'react'
import {
  IActorResponse,
  IGroupMovieResponse,
  ISearchRezkaMovieResponse,
} from '../../../api/api.generated'
import 'twin.macro'
import { Layout } from '../../../general-ui/layout/layout.component'
import { MovieCard } from '../../movies/components/movie-card.component'

interface IProps {
  actor: IActorResponse | undefined
  movies: IGroupMovieResponse[] | undefined
}
export const ActorComponent = ({ actor, movies }: IProps): JSX.Element => {
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
      <div tw="text-white text-2xl pb-2"> {actor?.name}</div>
      <div tw="grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-12  justify-items-center">
        {movies?.map(movie => {
          return <MovieCard key={movie.imdb_id} movie={movie} />
        })}
      </div>
    </Layout>
  )
}
