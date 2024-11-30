<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import SidebarPage from '$lib/components/sidebar/sidebar-page.svelte';
	import { authClient } from '$lib/features/auth/client';
	import { Button } from '$lib/components/ui/button';
	import { setCurrentGuild } from '$lib/features/discord/state/current-guild.svelte';

	let { children, data } = $props();

	const auth = $derived(data.auth);

	setCurrentGuild();
</script>

<QueryClientProvider client={data.queryClient}>
	{#if auth?.session}
		<SidebarPage
			breadcrumbs={[
				{ name: 'Home', href: '/' },
				{ name: 'Dashboard', href: '/dashboard' },
			]}
		>
			{@render children()}
		</SidebarPage>
	{:else}
		<Button
			onclick={async () => {
				await authClient.signIn.social({
					provider: 'discord',
				});
			}}
		>
			Continue with Discord
		</Button>
	{/if}
	<SvelteQueryDevtools position="bottom" />
</QueryClientProvider>

<ModeWatcher />
