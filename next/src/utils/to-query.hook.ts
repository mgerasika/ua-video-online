import { useEffect, useState } from 'react'

type IReturn<T> = [T | undefined, any]
export async function toQuery<T>(
  callback: () => Promise<{ data: T }>,
): Promise<IReturn<T>> {
  try {
    const data = await callback()
    return [data.data, undefined]
  } catch (ex) {
    return [, ex]
  }
}
