<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { ChevronsUpDown, Plus } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	let { guilds }: { guilds: { name: string; logo: string; plan: string }[] } = $props();
	const sidebar = useSidebar();

	let activeGuild = $state(guilds[0]);

	const getInitials = (title: string) => {
		return title
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');
	};
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
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<Avatar.Image src={activeGuild.logo} alt={activeGuild.name} />
							<Avatar.Fallback class="rounded-lg">
								{getInitials(activeGuild.name)}
							</Avatar.Fallback>
						</Avatar.Root>

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
						<Avatar.Root class="flex size-6 items-center justify-center rounded-sm border">
							<Avatar.Image src={guild.logo} alt={guild.name} />
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
					<div class="bg-background flex size-6 items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add server</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
