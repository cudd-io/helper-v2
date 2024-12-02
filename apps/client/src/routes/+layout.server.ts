import { auth } from '$lib/features/auth';
import { db } from '$lib/server/db';
import type { Session, User } from 'better-auth';
import type { LayoutServerLoad } from './$types';
import { account } from '$lib/server/db/schema';

import type { AuthData } from '$lib/features/auth/types';

const fetchAuthData = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user) return null;

	// While better-auth supports multiple providers and accounts,
	// we're only using Discord and a single account per user so findFirst is fine here
	const account = await db.query.account.findFirst({
		where: (account, { eq }) => eq(account.userId, session.user.id),
	});

	console.log({
		account,
		session,
	});

	return {
		session,
		account,
	} as AuthData;
};

export const load = (async ({ request }) => {
	return {
		auth: await fetchAuthData({ request }),
	};
}) satisfies LayoutServerLoad;
