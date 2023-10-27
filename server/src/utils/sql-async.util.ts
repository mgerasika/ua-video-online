const { Pool } = require('pg');
import { ENV } from '@server/env';
import { IQueryReturn } from './to-query.util';
// create a new PostgreSQL pool with your database configuration
let _pool: typeof Pool | undefined = undefined;

const getPool = (): typeof Pool => {
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: ENV.user,
        host: ENV.db_host,
        database: ENV.database,
        password: ENV.password,
        port: ENV.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};

class ClientAdapter {
	_original = {} as any;
	constructor(client: any) {
		this._original = client;
	}

	query(sql: string) {
		console.log('sql=' + sql)
		return this._original.query(sql);
	}
}

export async function sqlAsync<T>(callback: (client: any) => Promise<T>): Promise<IQueryReturn<T>> {
    let client;
    try {
        client = await getPool().connect();
        const data = (await callback(new ClientAdapter(client))) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, ex as Error];
    }
}
