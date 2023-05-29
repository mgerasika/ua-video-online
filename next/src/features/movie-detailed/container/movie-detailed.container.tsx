import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IGroupMovieResponse,
  IImdbResponse,
  IResolutionItem,
  IRezkaInfoByIdResponse,
  IRezkaMovieResponse,
  ITranslationResponse,
  api,
} from '../../../api/api.generated'
import { Loading } from '../../loading/loading.component'
import { useMutation } from '../../../hooks/use-mutation.hook'
import { MovieDetailed } from '../components/movie-detailed.component'

interface IProps {
  cdn_encode_video_url: string | undefined
  imdb_info: IImdbResponse | undefined
  rezka_movie_href: string | undefined
}
export const MovieDetailedContainer = ({
  imdb_info,
  rezka_movie_href,
  cdn_encode_video_url,
}: IProps): JSX.Element => {
  const [encodeUrl, setEncodeUrl] = useState(cdn_encode_video_url)
  const {
    execute: parseCypressExecute,
    data: parseCypressData,
    loading: parseCypressLoading,
  } = useMutation(() =>
    api.parserCypressStreamsPost({ href: rezka_movie_href || '' }, {}),
  )

  const {
    execute: rezkaDetailsExecute,
    data: rezkaDetailsExecuteData,
    loading: rezkaDetailsLoading,
  } = useMutation(() =>
    api.parserRezkaDetailsPost({ imdb_id: imdb_info?.id || '' }),
  )

  useEffect(() => {
    if (!cdn_encode_video_url) {
      rezkaDetailsExecute()
    }
  }, [cdn_encode_video_url, rezkaDetailsExecute])

  const handleReloadV1 = useCallback(() => {
    parseCypressExecute()
  }, [])

  const handleReloadV2 = useCallback(() => {
    rezkaDetailsExecute()
  }, [])

  useEffect(() => {
    if (parseCypressData) {
      const translation = parseCypressData.translations.find(f =>
        f.translation.includes('Укр'),
      )

      if (translation) {
        setEncodeUrl(translation.encoded_video_url)
      }
    }

    if (rezkaDetailsExecuteData) {
      setEncodeUrl(rezkaDetailsExecuteData.cdn_encoded_video_url)
    }
  }, [parseCypressData, rezkaDetailsExecuteData])
  return (
    <Loading loading={parseCypressLoading || rezkaDetailsLoading}>
      <MovieDetailed
        onReloadV1={handleReloadV1}
        onReloadV2={handleReloadV2}
        encode_video_url={encodeUrl}
        imdb_info={imdb_info}
      />
    </Loading>
  )
}
