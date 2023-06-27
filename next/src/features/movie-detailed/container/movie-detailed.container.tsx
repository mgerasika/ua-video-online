import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IActorResponse,
  IGroupMovieDetailedResponse,
  IGroupMovieResponse,
  IImdbResponse,
  IResolutionItem,
  IRezkaInfoByIdResponse,
  IRezkaMovieActorDto,
  IRezkaMovieResponse,
  ITranslationResponse,
  api,
} from '../../../api/api.generated'
import { useMutation } from '../../../hooks/use-mutation.hook'
import { MovieDetailed } from '../components/movie-detailed.component'
import { useQuery } from '../../../hooks/use-query.hook'
import { Loading } from '../../../general-ui/loading/loading.component'
import axios from 'axios'

interface IProps {
  imdb_info: IImdbResponse | undefined
  rezka_movie_href: string | undefined
  actors: IRezkaMovieActorDto[] | undefined
  translations: ITranslationResponse[] | undefined
}
export const MovieDetailedContainer = ({
  imdb_info,
  rezka_movie_href,
  actors,
  translations,
}: IProps): JSX.Element => {
  const [encodeVideoUrl, setEncodeVideoUrl] = useState<string>()
  const [loading, setLoading] = useState(false)

  const [selectedTranslationId, setSelectedTranslationId] = useState(
    translations?.length ? translations[0].id : '',
  )
  useEffect(() => {
    if (translations?.length) {
      setSelectedTranslationId(translations[0].id)
    }
  }, [translations])

  useEffect(() => {
    setLoading(true)
    axios
      .get(
        `/api/get-stream?imdb_id=${imdb_info?.id}&translation_id=${selectedTranslationId}`,
      )
      .then(data => {
        const items: IRezkaInfoByIdResponse[] = data.data as any
        console.log('cdn_encode_video_urls', items)
        if (items.length) {
          setEncodeVideoUrl(items[0].cdn_encoded_video_url)
        }
        setLoading(false)
      })
  }, [selectedTranslationId])

  return (
    <Loading loading={loading}>
      <MovieDetailed
        actors={actors}
        translations={translations}
        encode_video_url={encodeVideoUrl}
        onTranslationChange={id => setSelectedTranslationId(id)}
        selected_translation_id={selectedTranslationId}
        imdb_info={imdb_info}
      />
    </Loading>
  )
}
