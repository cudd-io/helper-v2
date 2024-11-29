import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { auth } from '$lib/features/auth';
import type { Session } from 'better-auth';

export const GET: RequestHandler = async ({ request }) => {
	// const session = await auth.api.getSession({
	// 	headers: request.headers,
	// });
	// const user = await db.query.user.findFirst({});
	return new Response();
};
