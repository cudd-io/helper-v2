import { updateSelectedGuild } from '$lib/api/mutations';
import * as queries from '$lib/api/queries';
import { useGetBotGuild } from '$lib/features/discord/hooks/queries.svelte';
import { toReadable } from '$lib/utils/reactive-query-args.svelte';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { APIPartialGuild } from 'discord-api-types/v10';
import { Store } from 'runed';

export const useGetSelectedGuild = (params: Parameters<typeof queries.getSelectedGuild>[0]) =>
	createQuery(toReadable(() => queries.getSelectedGuild(params)));

export const useMutateSelectedGuild = (
	params: Omit<Parameters<typeof updateSelectedGuild>[0], 'queryClient'>,
) => {
	const queryClient = useQueryClient();

	return createMutation(updateSelectedGuild({ queryClient, ...params }));
};
