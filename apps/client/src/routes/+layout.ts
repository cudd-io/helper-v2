import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
import { getMe } from '$lib/features/discord/api/queries';

export const load = (async ({ data, fetch }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				networkMode: 'offlineFirst',
			},
		},
	});

	queryClient.prefetchQuery({
		...getMe({ authToken: data.auth?.account?.accessToken || '', fetch }),
	});

	return { queryClient, ...data };
}) satisfies LayoutLoad;
