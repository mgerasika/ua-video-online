import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IGroupMovieDetailedResponse,
  IGroupMovieResponse,
  IImdbResponse,
  IResolutionItem,
  IRezkaInfoByIdResponse,
  IRezkaMovieResponse,
  ITranslationResponse,
  api,
} from '../../../api/api.generated'
import { useMutation } from '../../../hooks/use-mutation.hook'
import {
  IVideoUrl,
  MovieDetailed,
} from '../components/movie-detailed.component'
import { useQuery } from '../../../hooks/use-query.hook'
import { Loading } from '../../../general-ui/loading/loading.component'
import axios from 'axios'

interface IProps {
  imdb_info: IImdbResponse | undefined
  rezka_movie_href: string | undefined
}
export const MovieDetailedContainer = ({
  imdb_info,
  rezka_movie_href,
}: IProps): JSX.Element => {
  const [encodeUrls, setEncodeUrls] = useState<IVideoUrl[]>()
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

  const handleReloadV1 = useCallback(() => {
    parseCypressExecute()
  }, [])

  const handleReloadV2 = useCallback(() => {
    rezkaDetailsExecute()
  }, [])

  useEffect(() => {
    axios.get('/api/get-stream/' + imdb_info?.id).then(data => {
      const cdn_encode_video_urls: IRezkaInfoByIdResponse[] = data.data as any
      console.log('cdn_encode_video_urls', cdn_encode_video_urls)
      if (cdn_encode_video_urls.length) {
        setEncodeUrls(
          cdn_encode_video_urls.map(obj => {
            return {
              encode_video_url: obj.cdn_encoded_video_url,
              label: obj.translation_name,
            }
          }),
        )
      }
    })
  }, [])

  useEffect(() => {
    if (parseCypressData?.translations.length) {
      setEncodeUrls(
        parseCypressData.translations.map(obj => {
          return {
            encode_video_url: obj.encoded_video_url,
            label: obj.translation,
          }
        }),
      )
    }
  }, [parseCypressData])

  useEffect(() => {
    if (rezkaDetailsExecuteData?.length) {
      setEncodeUrls(
        rezkaDetailsExecuteData.map(obj => {
          return {
            encode_video_url: obj.cdn_encoded_video_url,
            label: obj.translation_name,
          }
        }),
      )
    }
  }, [rezkaDetailsExecuteData])
  return (
    <Loading loading={parseCypressLoading || rezkaDetailsLoading}>
      <MovieDetailed
        onReloadV1={handleReloadV1}
        onReloadV2={handleReloadV2}
        video_urls={encodeUrls || []}
        imdb_info={imdb_info}
      />
    </Loading>
  )
}
