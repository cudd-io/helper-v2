<script lang="ts">
	import { Routes } from 'discord-api-types/v10';
	import { authClient } from '$lib/features/auth/client';
	import { useGetMe } from '$lib/features/discord/hooks/queries.svelte';
	import { getCurrentGuild } from '$lib/features/discord/state/current-guild.svelte';
	import AppDashboard from '$lib/components/dashboard/app-dashboard.svelte';

	const session = authClient.useSession();

	const { data } = $props();

	const discordUser = useGetMe({
		authToken: data.auth?.account?.accessToken || '',
	});

	const currentGuild = getCurrentGuild();
</script>

<AppDashboard />
<!-- <h2 class="text-2xl font-semibold">Dashboard</h2>

<pre>{JSON.stringify(
		{
			currentGuild: currentGuild.guild,
			// auth: data.auth,
			// route: Routes.user('@me'),
			// discordUser: $discordUser,
		},
		null,
		2,
	)}</pre> -->
