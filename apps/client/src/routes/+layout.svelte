<script lang="ts">
	import '../app.css';
	import SidebarPage from '$lib/components/sidebar-page.svelte';
	import { authClient } from '$lib/features/auth/client';
	import { Button } from '$lib/components/ui/button';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children, data } = $props();

	const auth = $derived(data.auth);
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
	<SvelteQueryDevtools />
</QueryClientProvider>
