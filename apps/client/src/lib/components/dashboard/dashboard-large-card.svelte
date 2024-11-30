<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface Props {
		icon?: any;
		title: string;
		description: string;
		children?: Snippet;
		actions?: Snippet;
		class?: string;
	}
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	const {
		title,
		children,
		actions,
		description,
		class: className = '',
		...props
	}: Props = $props();
</script>

<Card.Root class="xl:col-span-2">
	<Card.Header class="flex flex-row items-center">
		<div class="grid gap-2">
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</div>
		{#if props.icon}
			<props.icon class="size-4" />
		{/if}

		<div class="ml-auto flex justify-end gap-2">
			{@render actions?.()}
		</div>
	</Card.Header>
	<Card.Content class={cn(className)}>
		{@render children?.()}
	</Card.Content>
</Card.Root>
