import { createQuery } from '@tanstack/svelte-query';
import { toReadable } from '$lib/utils/reactive-query-args.svelte';
import type { BaseQueryParams } from '$lib/types';

import {
	getMe,
	getMyGuilds,
	type DiscordQueryParams,
	type GetBotGuildsQueryParams,
	getBotGuild,
	getBotGuilds,
	getGuildMembers,
} from '../api/queries';

export const useGetMe = (params: DiscordQueryParams) =>
	createQuery(toReadable(() => getMe(params)));
export const useGetMyGuilds = (params: DiscordQueryParams) =>
	createQuery(toReadable(() => getMyGuilds(params)));

export const useGetBotGuild = (params: GetBotGuildsQueryParams) =>
	createQuery(toReadable(() => getBotGuild(params)));

export const useGetBotGuilds = (params: BaseQueryParams) =>
	createQuery(toReadable(() => getBotGuilds(params)));

export const useGetGuildMembers = (params: GetBotGuildsQueryParams) =>
	createQuery(toReadable(() => getGuildMembers(params)));
