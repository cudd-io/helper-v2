import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

type DBClientOptions = {
	url: string;
	authToken: string;
	logger?: boolean;
};

export const createDBClient = (opts: DBClientOptions) => {
	const client = createClient({
		url: opts.url,
		authToken: opts.authToken,
	});

	const db = drizzle(client, {
		schema,
		logger: opts.logger || false,
	});

	return db;
};

export { schema };
export * from './types';
export * from './controllers';

export { and, eq, or, not } from 'drizzle-orm';
export { drizzle } from 'drizzle-orm/libsql';
export { createClient } from '@libsql/client';
