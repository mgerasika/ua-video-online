import tw from 'twin.macro'
import {
  IGroupMovieResponse,
  IImdbResponse,
  ISearchRezkaMovieResponse,
  api,
} from '../api/api.generated'
import { MoviesComponent } from '../features/movies/components/movies.component'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollEnd } from '../use-scroll-end.hook'
import { MoviesContainer } from '../features/movies/containers/movies.container'

interface IProps {
  allMovies: IGroupMovieResponse[]
  genres: string[]
}

const App = ({ allMovies, genres }: IProps) => {
  return (
    <div>
      <MoviesContainer allMovies={allMovies} genres={genres} />
    </div>
  )
}

export async function getStaticProps(): Promise<{
  props: Omit<IProps, 'page'>
}> {
  const movies = await api.groupMovieGet()
  const imdbInfos = movies.data.map(movie => movie.imdb_info)
  return {
    props: {
      genres: imdbInfos
        .map(imdb => imdb.jsonObj.Genre)
        .join(',')
        .split(',')
        .map(f => f.trim())
        .reduce((acc: string[], it: string) => {
          if (!acc.includes(it)) {
            acc.push(it)
          }
          return acc
        }, []),
      allMovies: movies.data || [],
    },
  }
}

export default App
