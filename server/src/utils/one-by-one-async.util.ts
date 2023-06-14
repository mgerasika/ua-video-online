export async function oneByOneAsync<T>(
    items: T[],
    fn: (item: T, idx: number) => Promise<void>,
    settings?: { timeout: number },
) {
    const fns = items.map((item, idx) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        fn(item, idx).then(resolve).catch(reject);
                    } catch (ex) {
                        console.log('catch inside one by one', ex);
                        reject(ex);
                    }
                }, settings?.timeout);
            });
        };
    });

    return await fns.reduce((acc, fn: any) => {
        return acc.then(fn);
    }, Promise.resolve());
}
