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
  return (
	  <Layout showBack={true} title={ <>{actor?.name}</>}>
      <div tw="hidden">
        {[1, 2, 3].map(idx => {
          return (
            <img
              key={idx}
              src={`https://ua-video-online-cdn.web.app/${actor?.id}_${idx}.jpg`}
              tw="min-w-[150px] w-[33%] max-h-[229px] h-full [object-fit: cover] mb-4"
              alt=""
            />
          )
        })}
      </div>

      <div tw="grid 2xl:grid-cols-5 md:grid-cols-2 lg:grid-cols-3 grid-cols-1  gap-x-6 gap-y-12  justify-items-center">
        {movies?.map(movie => {
          return <MovieCard key={movie.imdb_id} movie={movie} />
        })}
      </div>
    </Layout>
  )
}
