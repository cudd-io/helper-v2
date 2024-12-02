import { createDBClient } from '@helper/db';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

export const db = createDBClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN,
});
