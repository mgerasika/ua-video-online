import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  IActorResponse,
  IGroupMovieResponse,
} from '../../../api/api.generated'
import 'twin.macro'
import { ActorComponent } from '../components/actor.component'
import { useScrollEnd } from '../../../use-scroll-end.hook'

const PAGE_SIZE = 20

interface IProps {
  actor: IActorResponse | undefined
  allMovies: IGroupMovieResponse[]
}
export const ActorContainer = ({ allMovies, actor }: IProps): JSX.Element => {
  const [page, setPage] = useState(0)

  const movies = useMemo(() => {
    return allMovies?.slice(
      0,
      Math.min(allMovies.length, PAGE_SIZE * (page + 1)),
    )
  }, [page, allMovies])

  const hasNext = useMemo(() => {
    return PAGE_SIZE * (page + 1) < allMovies.length
  }, [page, allMovies])

  const handleScrollEnd = useCallback(() => {
    setPage(prev => {
      const newVal = prev + 1
      sessionStorage.setItem('page-actor-' + actor?.id, newVal + '')
      return newVal
    })
  }, [page])

  useEffect(() => {
    const newPage = sessionStorage.getItem('page-actor-' + actor?.id)
    if (newPage) {
      setPage(+newPage)
    }
  }, [])

  useScrollEnd({
    onScrollEnd: handleScrollEnd,
  })

  return (
    <>
      <ActorComponent movies={movies} actor={actor} />
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
