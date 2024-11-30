import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getBotGuilds } from '$lib/server/api';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const guilds = await getBotGuilds({ request });

		return json(guilds);
	} catch (error) {
		if (error instanceof Error && error.message === 'Unauthorized') {
			return new Response('Unauthorized', { status: 401 });
		}
		console.error(error);
		return new Response('An unexpected error occurred', { status: 500 });
	}
};
