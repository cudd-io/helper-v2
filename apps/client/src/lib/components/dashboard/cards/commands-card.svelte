<script lang="ts" module>
	const exampleCommands = [
		{
			name: 'ping',
			description: 'Replies with "pong!"',
		},
		{
			name: 'roll',
			description: 'Rolls a dice',
		},
		{
			name: 'warn',
			description: 'Warns a user',
		},
		{
			name: 'ban',
			description: 'Bans a user',
		},
		{
			name: 'help',
			description: 'Lists all available commands',
		},
	];
</script>

<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Edit, ArrowUpRight } from 'lucide-svelte';
	import DashboardLargeCard from '../dashboard-large-card.svelte';
	import { useGetSelectedGuild } from '$lib/hooks/queries.svelte';

	const selectedGuild = useGetSelectedGuild({});
</script>

<DashboardLargeCard title="Commands" description="Recently created commands">
	{#snippet actions()}
		<Button href="/commands" size="sm" class="ml-auto gap-1">
			View All
			<ArrowUpRight class="h-4 w-4" />
		</Button>
	{/snippet}

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Command</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each exampleCommands as command}
				<Table.Row>
					<Table.Cell>
						<div class="font-medium">{command.name}</div>
						<div class="hidden text-sm text-muted-foreground md:inline">
							{command.description}
						</div>
					</Table.Cell>
					<Table.Cell class="text-right">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button variant="ghost" class="h-8 w-8 p-0">
									<Edit class="h-4 w-4" />
									<span class="sr-only">Open</span>
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-40">
								<DropdownMenu.Label>Actions</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Edit</DropdownMenu.Item>
								<DropdownMenu.Item>Copy</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Remove</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<!-- <pre>{JSON.stringify({ selectedGuild: $selectedGuild.data }, null, 2)}</pre> -->
</DashboardLargeCard>
