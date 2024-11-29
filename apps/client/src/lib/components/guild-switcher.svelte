<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { ChevronsUpDown, Plus } from 'lucide-svelte';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { guilds }: { guilds: { name: string; logo: any; plan: string }[] } = $props();
	const sidebar = useSidebar();

	let activeGuild = $state(guilds[0]);
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
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<activeGuild.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{activeGuild.name}
							</span>
							<span class="truncate text-xs">{activeGuild.plan}</span>
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
				<DropdownMenu.Label class="text-muted-foreground text-xs">Servers</DropdownMenu.Label>
				{#each guilds as guild, index (guild.name)}
					<DropdownMenu.Item onSelect={() => (activeGuild = guild)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-sm border">
							<guild.logo class="size-4 shrink-0" />
						</div>
						{guild.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="bg-background flex size-6 items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add server</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
