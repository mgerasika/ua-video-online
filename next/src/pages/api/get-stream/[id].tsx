import { useRouter } from 'next/router'
import { api, apiFirebase } from '../../../api/api.generated'
import { useMutation } from '../../../hooks/use-mutation.hook'
import { NextApiRequest, NextApiResponse } from 'next'
import cacheData from 'memory-cache'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.url?.split('/').pop()
  console.log('id', id)

  const value = cacheData.get(id)
  if (value) {
    console.log('get data from cache')
    res.status(200).json(value)
  } else {
    console.log('save to cache')
    const response = await apiFirebase.parserRezkaDetailsPost({
      imdb_id: id || '',
    })

    const hours = 18
    const cacheInSeconds = hours * 60 * 60
    cacheData.put(id, response.data, cacheInSeconds * 1000)

    res.setHeader('Cache-Control', 's-maxage=' + cacheInSeconds)
    res.status(200).json(response.data)
  }
}
