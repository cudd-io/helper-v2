import type { RequestHandler } from './$types';
import { DISCORD_BOT_TOKEN } from '$env/static/private';
import { Routes, PermissionFlagsBits, type APIGuild } from 'discord-api-types/v10';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/features/auth';
import { db } from '$lib/server/db';
import { hasPermission, sleep } from '$lib/utils';

const getAPIRoute = (route: string) => `https://discord.com/api/v10${route}`;

export const GET: RequestHandler = async ({ fetch, params, request }) => {
	const guildId = params.id;
	const route = Routes.guild(guildId);
	const session = await auth.api.getSession({
		headers: request.headers,
	});

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

	// call the api to check if the user can access the guild
	const { ok, message } = await verifyAccessToken(account.accessToken || '', guildId);

	if (!ok) {
		return new Response(message, { status: 401 });
	}

	const guild = await fetch(getAPIRoute(route), {
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
		},
	}).then((res) => res.json());

	return json(guild);
};

type VerifiedAccessToken =
	| {
			ok: true;
			message: undefined;
	  }
	| {
			ok: false;
			message: string;
	  };

const verifyAccessToken = async (
	accessToken: string | undefined,
	guildId?: string,
): Promise<VerifiedAccessToken> => {
	if (!accessToken) {
		return { ok: false, message: 'No access token provided' };
	}

	// Check if access token is valid
	const { ok, status, data } = await fetch('https://discord.com/api/v10/users/@me/guilds', {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}).then(async (res) => {
		const { ok, status } = res;
		return { ok, status, data: await res.json() };
	});

	if (!ok) {
		if (data.retry_after) {
			console.log(`waiting for ${data.retry_after} seconds to try again`);
			await sleep(data.retry_after * 1000 + 100); // Add 100ms to be safe
			return verifyAccessToken(accessToken, guildId);
		}
		return { ok: false, message: 'Invalid access token' };
	}

	// Check if user has access to guild
	if (guildId) {
		const guild: APIGuild = data.find((guild: APIGuild) => guild.id === guildId);
		if (
			!guild ||
			!hasPermission(BigInt(parseInt(guild.permissions || '0')), PermissionFlagsBits.Administrator)
		) {
			return { ok: false, message: 'User does not have access to guild' };
		}
	}

	return { ok: true, message: undefined };
};
