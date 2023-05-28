import { useCallback, useEffect } from 'react'
import { cookieUtils } from '../utils/cookie-utils'

interface IProps {
  encoded_video_url: string
  callback: (url: string) => void
}
export function useEncodeUrl(): (props: IProps) => void {
  const fn = useCallback(({ encoded_video_url, callback }: IProps) => {
    let interval: unknown
    const fn = () => {
      if (
        (window as any).o &&
        (window as any).o.FGeRtNzK &&
        (window as any).o.is_ready
      ) {
        const url = (window as any).o.FGeRtNzK(encoded_video_url) as string
        callback(url)
      } else {
        interval = setTimeout(() => {
          fn()
        }, 0)
      }
    }
    fn()
    return () => clearTimeout(interval as any)
  }, [])
  return fn
}
