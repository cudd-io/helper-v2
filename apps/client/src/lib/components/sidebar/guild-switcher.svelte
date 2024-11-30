<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { ChevronsUpDown, Plus } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { getCurrentGuild } from '$lib/features/discord/state/current-guild.svelte';
	import type { APIPartialGuild } from 'discord-api-types/v10';
	import { getInitials } from '$lib/utils';
	import { useGetSelectedGuild, useMutateSelectedGuild } from '$lib/hooks/queries.svelte';
	import { untrack } from 'svelte';
	import { watch } from 'runed';

	let { guilds }: { guilds: APIPartialGuild[] } = $props();
	const sidebar = useSidebar();

	// Guild state from database
	const selectedGuild = useGetSelectedGuild({});
	const mutateSelectedGuild = useMutateSelectedGuild({});

	const currentGuild = $derived($selectedGuild.data);

	const setActiveGuild = (guild: APIPartialGuild) => {
		$mutateSelectedGuild.mutate(guild);
	};

	const getGuildImage = (guild?: APIPartialGuild) => {
		if (!guild?.icon) {
			return '';
		}
		return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
	};

	$inspect({ guilds, currentGuild, $selectedGuild });
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root
							class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
						>
							<Avatar.Image
								src={getGuildImage(currentGuild ?? undefined)}
								alt={currentGuild?.name}
							/>
							<Avatar.Fallback
								class="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								{getInitials(currentGuild?.name ?? '...')}
							</Avatar.Fallback>
						</Avatar.Root>

						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{currentGuild?.name ?? 'Select a server'}
							</span>
							{#if currentGuild}
								<span class="truncate text-xs">{currentGuild?.splash ? 'Pro' : 'Free'}</span>
							{/if}
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-xs text-muted-foreground">Servers</DropdownMenu.Label>
				{#each guilds as guild, index (guild.name)}
					<DropdownMenu.Item
						disabled={guild.id === currentGuild?.id || $selectedGuild.isFetching}
						onSelect={() => setActiveGuild(guild)}
						class="gap-2 p-2"
					>
						<Avatar.Root class="flex size-6 items-center justify-center rounded-lg border">
							<Avatar.Image src={getGuildImage(guild)} alt={guild.name} />
							<Avatar.Fallback class="rounded-lg">
								{getInitials(guild.name)}
							</Avatar.Fallback>
						</Avatar.Root>

						{guild.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="flex size-6 items-center justify-center rounded-md border bg-background">
						<Plus class="size-4" />
					</div>
					<div class="font-medium text-muted-foreground">Add server</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
