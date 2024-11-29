import { db } from '$lib/server/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public';
import * as schema from '$lib/server/db/schema';
import { OAuth2Scopes, Routes, type APIUser } from 'discord-api-types/v10';

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

			// getUserInfo: async (tokens) => {
			// 	// Custom logic to fetch and return user info
			// 	// const userInfo = await fetchUserInfoFromCustomProvider(tokens);
			// 	const userInfo: APIUser = await fetch(Routes.user('@me'), {
			// 		headers: {
			// 			Authorization: `Bearer ${tokens.accessToken}`,
			// 		},
			// 	}).then((res) => res.json());

			// 	console.log({ userInfo });
			// 	return {
			// 		id: userInfo.id,
			// 		email: userInfo.email,
			// 		name: userInfo.username,
			// 		tokens,
			// 		// ... map other fields as needed
			// 	};
			// },
		},
	},
});
