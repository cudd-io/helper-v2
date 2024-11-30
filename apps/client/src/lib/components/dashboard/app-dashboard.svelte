<script lang="ts">
	import {
		Edit,
		Users,
		Menu,
		DollarSign,
		CreditCard,
		ArrowUpRight,
		Activity,
		Loader2,
	} from 'lucide-svelte';

	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';

	import { useGetBotGuild } from '$lib/features/discord/hooks/queries.svelte';
	import DashboardInfoCard from './dashboard-info-card.svelte';
	import DashboardLargeCard from './dashboard-large-card.svelte';
	import CommandsCard from './cards/commands-card.svelte';
	import MembersCard from './cards/members-card.svelte';
	import { useGetSelectedGuild } from '$lib/hooks/queries.svelte';
	import { createQuery, queryOptions } from '@tanstack/svelte-query';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { getBotGuild } from '$lib/features/discord/api/queries';

	const selectedGuild = useGetSelectedGuild({});
	const currentGuild = $derived($selectedGuild.data);

	const guild = createQuery(
		toReadable(() =>
			queryOptions({
				...getBotGuild({
					guildId: currentGuild?.id || '',
				}),
				enabled: !!currentGuild?.id,
			}),
		),
	);

	const guildData = $derived($guild.data);
</script>

{#if $guild.data && !$guild.isLoading}
	<main class="flex flex-1 flex-col gap-2 p-1 md:gap-4">
		<div class="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
			<DashboardInfoCard title="Boost Level">
				<div class="text-2xl font-bold">Lv. {guildData?.premium_tier}</div>
				<p class="text-xs text-muted-foreground">
					{guildData?.premium_subscription_count} server boosts
				</p>
			</DashboardInfoCard>

			<DashboardInfoCard icon={Users} title="Members">
				<div class="text-2xl font-bold">{guildData?.approximate_member_count} members</div>
				<p class="text-xs text-muted-foreground">+180.1% from last month</p>
			</DashboardInfoCard>

			<DashboardInfoCard icon={Activity} title="Active Now">
				<div class="text-2xl font-bold">12 active</div>
				<p class="text-xs text-muted-foreground">10 idle</p>
			</DashboardInfoCard>
		</div>
		<div class="grid gap-2 md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
			<CommandsCard />
			<MembersCard />
		</div>
	</main>
{:else}
	<div class="flex flex-1 items-center justify-center">
		<Loader2 class="mr-2 size-16 animate-spin" />
		<span class="sr-only">Loading</span>
	</div>
{/if}
