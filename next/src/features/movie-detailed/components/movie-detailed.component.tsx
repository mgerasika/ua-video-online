import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IGroupMovieResponse,
  IResolutionItem,
  IRezkaInfoByIdResponse,
  api,
} from '../../../api/api.generated'
import { VideoPlayer } from './video-player.component'
import { useEncodeUrl } from '../../../hooks/use-encode-url.hook'
import { convertRawUrlToObject } from '../../../utils/convert-raw-url-to-object.util'
import { Loading } from '../../loading/loading.component'
import { useMutation } from '../../../utils/use-mutation.hook'

interface IProps {
  rezka_cherio_info: IRezkaInfoByIdResponse
  movie: IGroupMovieResponse | undefined
}
export const MovieDetailed = ({
  movie,
  rezka_cherio_info,
}: IProps): JSX.Element => {
  const [resolutionItems, setResolutionItems] = useState<IResolutionItem[]>()
  const encodeFn = useEncodeUrl()

  const handleEncodeFinish = useCallback((rawUrl: string) => {
    const resolutions = convertRawUrlToObject(rawUrl || '')
    setResolutionItems(resolutions)
  }, [])

  useEffect(() => {
    encodeFn({
      encoded_video_url: rezka_cherio_info.cdn_encoded_video_url,
      callback: handleEncodeFinish,
    })
  }, [rezka_cherio_info])

  const streamUrl = useMemo(() => {
    if (resolutionItems?.length) {
      const resolution =
        resolutionItems.find(res => res.resolution.includes('1280')) ||
        resolutionItems[resolutionItems.length - 1]

      return resolution.streams[0]
    }
    return ''
  }, [resolutionItems])

  const {
    execute,
    data: newCypressStream,
    loading,
  } = useMutation(() =>
    api.parserCypressStreamsPost({ href: movie?.rezka_movie.href || '' }, {}),
  )

  useEffect(() => {
    if (newCypressStream) {
      const translation = newCypressStream.translations.find(f =>
        f.translation.includes('Укр'),
      )

      if (translation) {
        encodeFn({
          encoded_video_url: translation.encoded_video_url,
          callback: handleEncodeFinish,
        })
      }
    }
    // If client fn doesn't work - use server x
    // const translations = data.data.translations.find(f =>
    //   f.translation.includes('Укра'),
    // )
    // if (translations) {
    //   setResolutionItems(translations?.resolutions)
    // }
  }, [newCypressStream])
  const handleReload = useCallback(() => {
    execute()
  }, [])
  return (
    <Loading loading={loading}>
      <div tw="container min-h-screen mx-auto lg:px-32">
        <div tw="flex py-4">
          <Link href="/" tw="cursor-pointer text-white pl-4 pt-3 absolute">
            Back
          </Link>
          <h3 tw="text-white w-full text-center [font-size:30px] ">
            {movie?.imdb_info.en_name}
          </h3>
        </div>
        <div tw="flex flex-col lg:flex-row">
          <div tw="relative order-2 lg:order-1 mx-auto">
            {streamUrl ? (
              <>
                <VideoPlayer
                  imgSrc={movie?.imdb_info.poster || ''}
                  url={streamUrl}
                />
                <button
                  onClick={handleReload}
                  tw="text-white border-solid border-white p-2 mx-2 [border-width: 1px]"
                >
                  Reload stream (about ~15seconds)
                </button>
              </>
            ) : (
              <img
                src={movie?.imdb_info.poster || ''}
                tw="min-w-[300px] w-[300px] h-[429px] [object-fit: cover]"
                alt=""
              />
            )}

            <p tw="text-white [font-size: larger] top-2 left-2 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
              {movie?.imdb_info.imdb_rating}
            </p>
          </div>
        </div>
      </div>
    </Loading>
  )
}
