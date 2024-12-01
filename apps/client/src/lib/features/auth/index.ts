import { db } from '$lib/server/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public';
import * as schema from '@helper/db/schema';
import { OAuth2Scopes } from 'discord-api-types/v10';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),

	trustedOrigins: ['http://localhost:5173', PUBLIC_BASE_URL],
	baseURL: PUBLIC_BASE_URL || 'http://localhost:5173',
	socialProviders: {
		discord: {
			clientId: PUBLIC_DISCORD_CLIENT_ID!,
			clientSecret: DISCORD_CLIENT_SECRET!,
			scope: [
				OAuth2Scopes.Identify,
				OAuth2Scopes.Email,
				OAuth2Scopes.GuildsMembersRead,
				OAuth2Scopes.Guilds,
			],
		},
	},
});
