export async function setTimeoutAsync<T = any>(
  callback: () => Promise<T>,
  interval: number,
) {
  return new Promise<T>((resolve, reject) => {
    setTimeout((): void => {
      callback().then(resolve).catch(reject)
    }, interval)
  })
}
