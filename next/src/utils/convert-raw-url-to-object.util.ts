import { IResolutionItem } from '../api/api.generated'
import { useIsBrowser } from '../use-is-browser.hook'

export function convertRawUrlToObject(
  rawUrl: string,
): IResolutionItem[] | undefined {
  const res = rawUrl.split(',').map(row => {
    const idx = row.indexOf(']')
    const resolution = {
      resolution: row
        .substring(0, idx + 1)
        .replace(/[\[\] ]/g, '')
        .replace('1080pUltra', '1280p'),
      streams: row
        .substring(idx + 1)
        .split(' or ')
        .map(x => x.trim()),
    }
    return resolution
  })
  return res
}
