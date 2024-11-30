import type { RequestHandler } from './$types';
import { DISCORD_BOT_TOKEN } from '$env/static/private';
import { Routes } from 'discord-api-types/v10';
import { json } from '@sveltejs/kit';
import { getAuth, verifyAccessToken } from '$lib/server/api';
import { getAPIRoute } from '$lib/features/discord/api/queries';
import ky from 'ky';

export const GET: RequestHandler = async ({ fetch, params, request, url }) => {
	const guildId = params.id;

	const limit = parseInt(url.searchParams.get('limit') || '1000');
	const after = url.searchParams.get('after') || '0';

	const route = Routes.guildMembers(guildId);

	const { account } = await getAuth({ request });
	const { ok, message } = await verifyAccessToken(account.accessToken || '', guildId);

	if (!ok) {
		return new Response(message, { status: 401 });
	}

	const guild = await ky(getAPIRoute(route), {
		searchParams: {
			limit,
			after,
		},
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
		},
	}).then((res) => res.json());

	return json(guild);
};
