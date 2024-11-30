<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface Props {
		icon?: any;
		title: string;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	const { title, children, ...props }: Props = $props();
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title class="text-sm font-medium">{title}</Card.Title>
		{#if props.icon}
			<props.icon class="h-4 w-4 text-muted-foreground" />
		{/if}
	</Card.Header>
	<Card.Content>
		{@render children?.()}
	</Card.Content>
</Card.Root>
