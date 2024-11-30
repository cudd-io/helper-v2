import type { BaseMutationParams } from '$lib/types';
import type { APIPartialGuild } from 'discord-api-types/v10';
import { getSelectedGuild } from './queries';

export const updateSelectedGuild = ({ options, queryClient }: BaseMutationParams) => ({
	mutationFn: async (guild: APIPartialGuild | null) => {
		return fetch('/api/user/selected-guild', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ guild: btoa(JSON.stringify(guild)) }),
		}).then((res) => res.json());
	},
	mutationKey: ['updateSelectedGuild'],
	onSettled: async () => {
		return await queryClient.invalidateQueries({ queryKey: getSelectedGuild({}).queryKey });
	},

	onMutate: async (newGuild: APIPartialGuild) => {
		const queryKey = getSelectedGuild({}).queryKey;

		await queryClient.cancelQueries({ queryKey });

		const previousGuild = queryClient.getQueryData(queryKey);

		queryClient.setQueryData(queryKey, newGuild);

		// Return a context object with the snapshotted value
		return { previousGuild };
	},

	...options,
});
