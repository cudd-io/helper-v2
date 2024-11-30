<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';

	let {
		items,
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Dashboard</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet tooltipContent()}
						{mainItem.title}
					{/snippet}
					{#snippet child({ props })}
						<a href={mainItem.url} {...props}>
							{#if mainItem.icon}
								<mainItem.icon />
							{/if}
							<span>{mainItem.title}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
