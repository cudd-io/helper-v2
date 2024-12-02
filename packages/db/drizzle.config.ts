import { config } from 'dotenv';

import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// export default defineConfig({
// 	schema: './src/schema/index.ts',

// 	dbCredentials: {
// 		url: process.env.DATABASE_URL,
// 		authToken: process.env.DATABASE_AUTH_TOKEN,
// 	},

// 	verbose: true,
// 	strict: true,
// 	dialect: 'turso',
// });

config({ path: '.env' });

export default defineConfig({
	schema: './src/schema/index.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		authToken: process.env.DATABASE_AUTH_TOKEN!,
	},
});
