import { createKey } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';
import { Routes, type APIUser, type APIGuild } from 'discord-api-types/v10';

export const getAPIRoute = (route: string) => `https://discord.com/api/v10${route}`;

export type BaseQueryParams = {
	fetch?: typeof fetch;
	authToken: string;
};

export const getMe = ({ fetch = globalThis.fetch, authToken }: BaseQueryParams) =>
	queryOptions({
		queryKey: createKey(Routes.user('@me')),
		queryFn: async () => {
			return fetch(getAPIRoute(Routes.user('@me')), {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}).then((res) => res.json() as Promise<APIUser>);
		},
	});

export const getMyGuilds = ({ fetch = globalThis.fetch, authToken }: BaseQueryParams) =>
	queryOptions({
		queryKey: createKey(Routes.userGuilds()),
		queryFn: () => {
			return fetch(getAPIRoute(Routes.userGuilds()), {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}).then((res) => res.json() as Promise<APIGuild[]>);
		},
	});
