import type { BaseQueryParams } from '$lib/types';
import { createKey } from '$lib/utils';
import { queryOptions } from '@tanstack/svelte-query';
import {
	Routes,
	type APIUser,
	type APIGuild,
	type APIPartialGuild,
	type APIGuildMember,
} from 'discord-api-types/v10';

export const getAPIRoute = (route: string) => `https://discord.com/api/v10${route}`;

export type DiscordQueryParams = BaseQueryParams & {
	authToken: string;
};

export const getMe = ({ fetch = globalThis.fetch, authToken, options }: DiscordQueryParams) =>
	queryOptions({
		queryKey: createKey(Routes.user('@me')),
		queryFn: async () => {
			return fetch(getAPIRoute(Routes.user('@me')), {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}).then((res) => res.json() as Promise<APIUser>);
		},
		...options,
	});

export const getMyGuilds = ({ fetch = globalThis.fetch, authToken, options }: DiscordQueryParams) =>
	queryOptions({
		queryKey: createKey(Routes.userGuilds()),
		queryFn: () => {
			return fetch(getAPIRoute(Routes.userGuilds()), {
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}).then((res) => res.json() as Promise<APIGuild[]>);
		},
		...options,
	});

export type GetBotGuildsQueryParams = BaseQueryParams & {
	guildId: string;
};

export const getBotGuild = ({
	fetch = globalThis.fetch,
	guildId,
	options,
}: GetBotGuildsQueryParams) =>
	queryOptions({
		queryKey: createKey(`/api/bot/guilds/${guildId}`),
		queryFn: () => {
			return fetch(`/api/bot/guilds/${guildId}`).then((res) => res.json() as Promise<APIGuild>);
		},
		...options,
	});

export const getBotGuilds = ({ fetch = globalThis.fetch, options }: BaseQueryParams) =>
	queryOptions({
		queryKey: createKey('/api/bot/guilds'),
		queryFn: () => {
			return fetch('/api/bot/guilds').then((res) => res.json() as Promise<APIPartialGuild[]>);
		},
		...options,
	});

export const getGuildMembers = ({
	fetch = globalThis.fetch,
	guildId,
	options,
}: GetBotGuildsQueryParams) =>
	queryOptions({
		queryKey: createKey(`/api/bot/guilds/${guildId}/members`),
		queryFn: () => {
			return fetch(`/api/bot/guilds/${guildId}/members`).then(
				(res) => res.json() as Promise<APIGuildMember[]>,
			);
		},
		...options,
	});
