<script lang="ts" module>
	import AudioWaveform from 'lucide-svelte/icons/audio-waveform';
	import Bot from 'lucide-svelte/icons/bot';
	import Command from 'lucide-svelte/icons/command';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';

	const data = {
		guilds: [
			{
				name: 'Midnight Oasis',
				logo: GalleryVerticalEnd,
				plan: 'Pro',
			},
			{
				name: `Erika's test server`,
				logo: AudioWaveform,
				plan: 'Free',
			},
			{
				name: 'My Server',
				logo: Command,
				plan: 'Free',
			},
		],
		navMain: [
			{
				title: 'Dashboard',
				url: '#',
				icon: SquareTerminal,
				isActive: true,
			},
			{
				title: 'Commands',
				url: '#',
				icon: Bot,
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import GuildSwitcher from '$lib/components/guild-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { ComponentProps } from 'svelte';
	import { useGetMe } from '$lib/features/discord/hooks/queries.svelte';
	import { page } from '$app/stores';
	import type { APIUser } from 'discord-api-types/v10';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const auth = $page.data.auth;

	const discordUser = useGetMe({
		authToken: auth?.account?.accessToken || '',
	});

	const getUser = (userData?: APIUser) => {
		if ($discordUser.data) {
			return {
				name: $discordUser.data.global_name || '',
				username: `@${$discordUser.data.username}`,
				avatar: `https://cdn.discordapp.com/avatars/${$discordUser.data.id}/${$discordUser.data.avatar}`,
			};
		} else {
			return {
				name: 'loading...',
				username: '',
				avatar: 'https://placewaifu.com/image/64',
			};
		}
	};

	let user = $derived(getUser($discordUser.data));
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<GuildSwitcher guilds={data.guilds} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
