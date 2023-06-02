import React, { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { css } from 'twin.macro'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface IProps {
  imgSrc: string
  url: string
  onPlay?: () => void
  onPause?: () => void
}
export const VideoPlayer = ({ imgSrc, url, onPlay, onPause }: IProps) => {
  const [playing, setPlaying] = useState(false)
  const handlePlay = useCallback(() => {
    setPlaying(true)
    onPlay && onPlay()
  }, [])

  const handlePause = useCallback(() => {
    setPlaying(false)
    onPause && onPause()
  }, [onPlay, onPause])

  return (
    <ReactPlayer
      playing={playing}
      onPlay={handlePlay}
      onClickPreview={() => setPlaying(true)}
      onPause={handlePause}
      light={<img src={imgSrc} alt="Thumbnail" />}
      css={styles.root}
      url={url}
      width="100%"
      height="100%"
      controls
    />
  )
}

const styles = {
  root: css`
    .react-player__preview {
    }
  `,
}
