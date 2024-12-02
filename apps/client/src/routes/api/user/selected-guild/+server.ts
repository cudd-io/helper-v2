import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { getAuth } from '$lib/server/api';
import { json, text } from '@sveltejs/kit';
import { user } from '$lib/server/db/schema';
import { eq } from '@helper/db';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const { session } = await getAuth({ request });
		const { id } = session.user;

		const user = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.id, id),
		});

		if (!user?.selectedGuild) {
			return json(null);
		}

		return json({ guild: user.selectedGuild });
	} catch (e) {
		if (e instanceof Error && e.message.toLowerCase().includes('unauthorized')) {
			return new Response(null, { status: 401 });
		}
		return new Response(null, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	console.log('POST /api/user/selected-guild');
	try {
		const { session } = await getAuth({ request });
		const id = session.user.id;

		const { guild }: { guild?: string } = await request.json();

		console.log('selectedGuild', guild);

		if (!guild) {
			return new Response(null, { status: 400 });
		}
		await db.update(user).set({ selectedGuild: guild }).where(eq(user.id, id));
		return json({ guild });
	} catch (e) {
		if (e instanceof Error && e.message.toLowerCase().includes('unauthorized')) {
			return new Response(null, { status: 401 });
		}
		console.warn(e);
		return new Response(null, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const { session } = await getAuth({ request });
		const id = session.user.id;

		await db.update(user).set({ selectedGuild: null }).where(eq(user.id, id));

		return new Response(null, { status: 200 });
	} catch (e) {
		if (e instanceof Error && e.message.toLowerCase().includes('unauthorized')) {
			return new Response(null, { status: 401 });
		}
		return new Response(null, { status: 500 });
	}
};
