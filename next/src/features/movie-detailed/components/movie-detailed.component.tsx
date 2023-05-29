import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import { IImdbResponse, IResolutionItem, api } from '../../../api/api.generated'
import { VideoPlayer } from './video-player.component'
import { useEncodeUrl } from '../../../hooks/use-encode-url.hook'
import { convertRawUrlToObject } from '../../../utils/convert-raw-url-to-object.util'

interface IProps {
  encode_video_url: string | undefined
  imdb_info: IImdbResponse | undefined
  onReloadV1: () => void
  onReloadV2: () => void
}
export const MovieDetailed = ({
  imdb_info,
  encode_video_url,
  onReloadV1,
  onReloadV2,
}: IProps): JSX.Element => {
  const [resolutionItems, setResolutionItems] = useState<IResolutionItem[]>()
  const encodeFn = useEncodeUrl()

  const handleEncodeFinish = useCallback((rawUrl: string) => {
    const resolutions = convertRawUrlToObject(rawUrl || '')
    setResolutionItems(resolutions)
  }, [])

  useEffect(() => {
    console.log('encode_video_url', encode_video_url)
    encodeFn({
      encoded_video_url: encode_video_url || '',
      callback: handleEncodeFinish,
    })
  }, [encode_video_url])

  const streamUrl = useMemo(() => {
    if (resolutionItems?.length) {
      const resolution =
        resolutionItems.find(res => res.resolution.includes('1280')) ||
        resolutionItems[resolutionItems.length - 1]

      return resolution.streams[0]
    }
    return ''
  }, [resolutionItems])

  return (
    <div tw="container min-h-screen mx-auto lg:px-32">
      <div tw="flex py-4">
        <Link href="/" tw="cursor-pointer text-white pl-4 pt-3 absolute">
          Back
        </Link>
        <h3 tw="text-white w-full text-center [font-size:30px] ">
          {imdb_info?.en_name}&nbsp;{imdb_info?.year}
        </h3>
      </div>
      <div tw="flex flex-col lg:flex-row">
        <div tw="relative order-2 lg:order-1 mx-auto">
          {streamUrl ? (
            <>
              <VideoPlayer imgSrc={imdb_info?.poster || ''} url={streamUrl} />
              <button
                onClick={onReloadV1}
                tw="text-white border-solid border-white p-2 m-2 [border-width: 1px] "
              >
                Reload stream (about ~15seconds)
              </button>
              <button
                onClick={onReloadV2}
                tw="text-white border-solid border-white p-2 m-2 [border-width: 1px] "
              >
                Reload stream (about ~2seconds)
              </button>
            </>
          ) : (
            <img
              src={imdb_info?.poster || ''}
              tw="min-w-[300px] w-[300px] h-[429px] [object-fit: cover]"
              alt=""
            />
          )}

          <p tw="text-white [font-size: larger] top-4 left-4 absolute bg-black px-2 py-1 border-solid border-white [border-width: 1px]">
            {imdb_info?.imdb_rating}
          </p>
        </div>
      </div>
    </div>
  )
}
