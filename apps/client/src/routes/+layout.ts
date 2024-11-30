import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';
import { getBotGuilds, getMe } from '$lib/features/discord/api/queries';
import { minutes } from '$lib/utils';
import { getSelectedGuild } from '$lib/api/queries';

export const load = (async ({ data, fetch }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				networkMode: 'offlineFirst',
				staleTime: minutes(5),
				gcTime: minutes(10),
			},
		},
	});

	const prefetchPromises = [
		queryClient.prefetchQuery({
			...getMe({ authToken: data.auth?.account?.accessToken || '', fetch }),
		}),

		queryClient.prefetchQuery({
			...getSelectedGuild({ fetch }),
		}),

		queryClient.prefetchQuery({
			...getBotGuilds({ fetch }),
		}),
	];

	await Promise.all(prefetchPromises);

	return { queryClient, ...data };
}) satisfies LayoutLoad;
