import type { BaseQueryParams } from '$lib/types';
import { createKey } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';
import type { APIPartialGuild } from 'discord-api-types/v10';

export const getSelectedGuild = ({ fetch = globalThis.fetch, options }: BaseQueryParams) =>
	queryOptions({
		queryKey: createKey('/api/user/selected-guild'),
		queryFn: async () => {
			const { guild: encodedGuild } = await fetch('/api/user/selected-guild').then(
				(res) => res.json() as Promise<{ guild: string }>,
			);
			const decoded = atob(encodedGuild);
			return JSON.parse(decoded) as APIPartialGuild;
		},

		...options,
	});
