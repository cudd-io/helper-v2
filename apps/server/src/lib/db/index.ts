import { createDBClient } from '@helper/db';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!process.env.DATABASE_AUTH_TOKEN)
	throw new Error('DATABASE_AUTH_TOKEN is not set');

export const db = createDBClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN,
});

export default db;
