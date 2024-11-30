import type { RequestHandler } from './$types';
import { DISCORD_BOT_TOKEN } from '$env/static/private';
import { Routes, PermissionFlagsBits, type APIGuild } from 'discord-api-types/v10';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/features/auth';
import { db } from '$lib/server/db';
import { hasPermission, sleep } from '$lib/utils';
import ky from 'ky';

const getAPIRoute = (route: string) => `https://discord.com/api/v10${route}`;

export const GET: RequestHandler = async ({ params, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	const route = Routes.userGuilds();

	if (!session?.user) {
		return new Response(null, {
			status: 401,
		});
	}

	const account = await db.query.account.findFirst({
		where: (account, { eq }) => eq(account.userId, session.user.id),
	});

	if (!account) {
		return new Response(null, {
			status: 401,
		});
	}

	const botGuildsPromise = ky<APIGuild[]>(getAPIRoute(route), {
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
		},
	});

	const userGuildsPromise = ky<APIGuild[]>(getAPIRoute(Routes.userGuilds()), {
		headers: {
			Authorization: `Bearer ${account.accessToken}`,
		},
	});

	const [botGuilds, userGuilds] = await Promise.all([
		botGuildsPromise.json(),
		userGuildsPromise.json(),
	]);

	const guilds = botGuilds.filter((guild: APIGuild) => {
		return userGuilds.some((userGuild: APIGuild) => {
			const inGuild = userGuild.id === guild.id;
			const perms = BigInt(parseInt(userGuild.permissions || '0'));
			const hasAdminPerms = hasPermission(perms, PermissionFlagsBits.Administrator);

			return inGuild && hasAdminPerms;
		});
	});

	return json(guilds);
};
