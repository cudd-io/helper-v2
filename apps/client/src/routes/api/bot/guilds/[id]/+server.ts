import type { RequestHandler } from './$types';
import { DISCORD_BOT_TOKEN } from '$env/static/private';
import { type APIGuild, Routes } from 'discord-api-types/v10';
import { json } from '@sveltejs/kit';
import { getAuth, verifyAccessToken } from '$lib/server/api';
import { getAPIRoute } from '$lib/features/discord/api/queries';
import ky from 'ky';

export const GET: RequestHandler = async ({ params, request }) => {
	const guildId = params.id;
	const route = Routes.guild(guildId);

	const { account } = await getAuth({ request });
	const { ok, message } = await verifyAccessToken(account.accessToken || '', guildId);

	if (!ok) {
		return new Response(message, { status: 401 });
	}

	const guild = await ky<APIGuild>(getAPIRoute(route), {
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
		},
		searchParams: {
			with_counts: true,
		},
	}).then((res) => res.json());

	return json(guild);
};
