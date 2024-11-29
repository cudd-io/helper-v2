import { auth } from '$lib/features/auth';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('handle');
	return svelteKitHandler({ event, resolve, auth });
};
