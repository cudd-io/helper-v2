import { toReadable } from '$lib/utils/reactive-query-args.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { getMe, getMyGuilds, type BaseQueryParams } from '../api/queries';

export const useGetMe = (params: BaseQueryParams) => createQuery(toReadable(() => getMe(params)));
export const useGetMyGuilds = (params: BaseQueryParams) =>
	createQuery(toReadable(() => getMyGuilds(params)));
