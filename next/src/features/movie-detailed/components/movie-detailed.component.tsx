import React, { useMemo, useState } from 'react'
import 'twin.macro'
import Link from 'next/link'
import {
  IGroupMovieResponse,
  IResolutionItem,
  IStreamResponse,
} from '../../../api/api.generated'
import { VideoPlayer } from './video-player.component'
import { useEncodeUrl } from '../../../hooks/use-encode-url.hook'
import { convertRawUrlToObject } from '../../../utils/convert-raw-url-to-object.util'

interface IProps {
  encoded_video_url: string
  movie: IGroupMovieResponse | undefined
}
export const MovieDetailed = ({
  movie,
  encoded_video_url,
}: IProps): JSX.Element => {
  const [resolutionItems, setResolutionItems] = useState<IResolutionItem[]>()
  useEncodeUrl(encoded_video_url, rawUrl => {
    const data = convertRawUrlToObject(rawUrl || '')
    setResolutionItems(data)

    console.log('encoded_video_url', encoded_video_url)
    console.log('raw', rawUrl)
    console.log('resolutionItems', data)
  })

  const url = useMemo(() => {
    if (resolutionItems?.length) {
      return resolutionItems[resolutionItems.length - 1].streams[0]
    }
    return ''
  }, [resolutionItems])

  return (
    //   bg-black relative transition duration-200 ease-in transform hover:scale-110
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
          {url ? (
            <VideoPlayer imgSrc={movie?.imdb_info.poster || ''} url={url} />
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
  )
}
