import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { css } from 'twin.macro'
import Link from 'next/link'
import { IImdbResponse, IResolutionItem, api } from '../../../api/api.generated'
import { VideoPlayer } from './video-player.component'
import { useEncodeUrl } from '../../../hooks/use-encode-url.hook'
import { convertRawUrlToObject } from '../../../utils/convert-raw-url-to-object.util'
import { StatusTag } from '../../../general-ui/status-tag/status-tag.component'
import { Layout } from '../../../general-ui/layout/layout.component'
import { SelectedButton } from '../../../general-ui/selected-button/selected-button.component'
import { ALL_LANG } from '../../movies/containers/movies.container'

export interface IVideoUrl {
  encode_video_url: string | undefined
  label: string
}
interface IProps {
  video_urls: IVideoUrl[]
  imdb_info: IImdbResponse | undefined
  onReloadV1: () => void
  onReloadV2: () => void
}
export const MovieDetailed = ({
  imdb_info,
  video_urls,
  onReloadV1,
  onReloadV2,
}: IProps): JSX.Element => {
  const [playing, setPlaying] = useState(false)
  const [resolutionItems, setResolutionItems] = useState<IResolutionItem[]>()
  const encodeFn = useEncodeUrl()

  const handleEncodeFinish = useCallback((rawUrl: string) => {
    const resolutions = convertRawUrlToObject(rawUrl || '')
    setResolutionItems(resolutions)
  }, [])

  const [selectedVideoUrl, setSelectedVideoUrl] = useState<IVideoUrl>()

  useEffect(() => {
    if (video_urls.length) {
      setSelectedVideoUrl(video_urls[0])
    }
  }, [video_urls])

  useEffect(() => {
    console.log('encode_video_url', selectedVideoUrl)
    encodeFn({
      encoded_video_url: selectedVideoUrl?.encode_video_url || '',
      callback: handleEncodeFinish,
    })
  }, [selectedVideoUrl])

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
    <Layout>
      <div tw="flex flex-1 flex-col lg:flex-row">
        <div tw="relative lg:w-1/3">
          <h3 tw="text-white w-full  [font-size:30px] px-4 lg:hidden">
            {imdb_info?.en_name}
          </h3>
          <VideoPlayer
            onPlay={() => setPlaying(true)}
            imgSrc={imdb_info?.poster || ''}
            url={streamUrl || ' '}
          />
          {/* <img
              src={imdb_info?.poster || ''}
              tw="min-w-[300px] w-[300px] min-h-[429px] h-full [object-fit: cover]"
              alt=""
            /> */}

          <div tw="px-4 pt-4 lg:p-0">
            {video_urls.map((obj, index) => {
              return (
                <div
                  key={obj.encode_video_url}
                  tw="mr-2 my-1 float-left cursor-pointer"
                >
                  <SelectedButton
                    tw="float-left"
                    selected={
                      obj.encode_video_url ===
                      selectedVideoUrl?.encode_video_url
                    }
                    name={obj.label}
                    title={
                      obj.label.toLowerCase().includes('оригинал')
                        ? ALL_LANG[0]
                        : ALL_LANG[1] + ` #${index + 1}`
                    }
                    onChange={() => setSelectedVideoUrl(obj)}
                  />
                  <div tw="clear-both"></div>
                </div>
              )
            })}
          </div>
        </div>
        <div tw="px-4 lg:py-2 lg:w-2/3">
          <h3 tw="text-white w-full text-left [font-size:30px] hidden lg:block">
            {imdb_info?.en_name}&nbsp;{imdb_info?.year}
          </h3>

          <div tw=" text-white">
            <div>
              <StatusTag tw="mr-2 my-1 float-left">
                Imdb {imdb_info?.imdb_rating}
              </StatusTag>
              <StatusTag tw="mr-2 my-1 float-left">{imdb_info?.year}</StatusTag>
              {imdb_info?.jsonObj.Genre.split(',')
                .map(genre => genre.trim())
                .map(genre => (
                  <StatusTag key={genre} tw="mr-2 my-1 float-left">
                    {genre}
                  </StatusTag>
                ))}
              <div tw="clear-both"></div>
            </div>
            <p css={styles.line}>
              <span css={styles.label}> Actors:</span>{' '}
              <span css={styles.value}> {imdb_info?.jsonObj.Actors}</span>
            </p>
            <p css={styles.line}>
              <span css={styles.label}>Director:</span>{' '}
              <span css={styles.value}> {imdb_info?.jsonObj.Director}</span>
            </p>
            <p css={styles.line}>
              <span css={styles.label}>Country:</span>{' '}
              <span css={styles.value}> {imdb_info?.jsonObj.Country}</span>
            </p>
            <p css={styles.line}>
              <span css={styles.label}> Runtime: </span>{' '}
              <span css={styles.value}> {imdb_info?.jsonObj.Runtime}</span>
            </p>
            <p css={styles.line}>
              <span css={styles.label}> Plot:</span>{' '}
              <span css={styles.value}> {imdb_info?.jsonObj.Plot}</span>
            </p>

            <p tw="pt-8  font-light text-sm">
              P.S. If you have any problems with stream, you can reload it on
              client side with &nbsp;
              <ul>
                <li>
                  <a
                    onClick={onReloadV2}
                    tw="cursor-pointer font-light text-sm"
                  >
                    - method 1 (about ~2 seconds, start cherio parser on BE)
                  </a>
                </li>
                <li>
                  <a
                    onClick={onReloadV1}
                    tw="cursor-pointer font-light text-sm"
                  >
                    - method 2 (about ~15seconds, start cypress browser on BE)
                  </a>
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const styles = {
  translation: (selected: boolean) => [
    selected
      ? css`
          text-decoration: underline;
        `
      : css``,
  ],
  line: css`
    padding-bottom: 8px;
  `,
  label: css``,
  value: css`
    font-weight: 300;
  `,
}
