import { IQueryReturn, toQueryPromise } from '@server/utils/to-query.util';
const cypress = require('cypress');

interface IProps {
    href: string;
    spec: string;
}

export async function runCypressAsync<T>({ href, spec }: IProps): Promise<IQueryReturn<T>> {
    return toQueryPromise<T>((resolve, reject) => {
        cypress
            .run({
                env: {
                    CYPRESS_NO_COMMAND_LOG: 1,
                    URL: href,
                },
                browser: 'chrome',
                configFile: 'cypress.json',
                quiet: true,
                spec: spec,
            })
            .then((results: any) => {
                try {
                    resolve(JSON.parse(results.runs[0].tests[0].attempts[0].error.message));
                } catch (ex) {
                    reject('error when try got error from test ' + JSON.stringify(results, null, 2));
                }
            })
            .catch((err: any) => {
                reject('error when execute test ' + err);
            });
    });
}
