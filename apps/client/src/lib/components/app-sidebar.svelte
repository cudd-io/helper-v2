<script lang="ts" module>
	import Bot from 'lucide-svelte/icons/bot';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard';

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/',
				icon: LayoutDashboard,
				isActive: true,
			},
			{
				title: 'Commands',
				url: '/commands',
				icon: Bot,
			},
			{
				title: 'Settings',
				url: '/settings',
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
	import { useGetBotGuilds, useGetMe } from '$lib/features/discord/hooks/queries.svelte';
	import { page } from '$app/stores';
	import type { APIGuild, APIUser } from 'discord-api-types/v10';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const auth = $page.data.auth;

	const discordUser = useGetMe({
		authToken: auth?.account?.accessToken || '',
	});

	const botGuilds = useGetBotGuilds({});

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

	const getGuilds = (guildsData?: APIGuild[]) => {
		if ($botGuilds.data) {
			return $botGuilds.data.map((guild, i) => ({
				name: guild.name,
				logo: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`,
				plan: guild.premium_tier === 0 ? 'Free' : 'Pro', // Obviously Helper doesn't have a pro tier, this is just a placeholder for now
			}));
		} else {
			return [
				{
					name: 'loading...',
					logo: `https://placewaifu.com/image/64?index=${999}`,
					plan: 'Free',
				},
			];
		}
	};

	let user = $derived(getUser($discordUser.data));
	let guilds = $derived(getGuilds($botGuilds.data));
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<GuildSwitcher {guilds} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
