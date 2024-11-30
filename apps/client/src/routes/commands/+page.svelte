<script lang="ts">
	import { authClient } from '$lib/features/auth/client';
	import { useGetMe } from '$lib/features/discord/hooks/queries.svelte';
	import { getCurrentGuild } from '$lib/features/discord/state/current-guild.svelte';
	import { useGetSelectedGuild } from '$lib/hooks/queries.svelte';
	import { Routes } from 'discord-api-types/v10';

	const session = authClient.useSession();

	const { data } = $props();

	const discordUser = useGetMe({
		authToken: data.auth?.account?.accessToken || '',
	});

	// const currentGuild = getCurrentGuild();
	const selectedGuild = useGetSelectedGuild({});

	const currentGuild = $derived($selectedGuild.data);
</script>

<h2 class="text-2xl font-semibold">Commands</h2>

<pre>{JSON.stringify(
		{
			currentGuild,
			// auth: data.auth,
			// route: Routes.user('@me'),
			// discordUser: $discordUser,
		},
		null,
		2,
	)}</pre>
