<script lang="ts">
	import { authClient } from '$lib/features/auth/client';
	import { useGetMe } from '$lib/features/discord/hooks/queries.svelte';
	import { getCurrentGuild } from '$lib/features/discord/state/current-guild.svelte';
	import { Routes } from 'discord-api-types/v10';

	const session = authClient.useSession();

	const { data } = $props();

	const discordUser = useGetMe({
		authToken: data.auth?.account?.accessToken || '',
	});

	const currentGuild = getCurrentGuild();
</script>

<h2 class="text-2xl font-semibold">Settings</h2>

<pre>{JSON.stringify(
		{
			currentGuild: currentGuild.guild,
			// auth: data.auth,
			// route: Routes.user('@me'),
			// discordUser: $discordUser,
		},
		null,
		2,
	)}</pre>
