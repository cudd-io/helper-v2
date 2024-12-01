<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import '../styles/index.css';
	import { writable } from 'svelte/store';
	import { SvelteFlow, Controls, Background, MiniMap, type NodeTypes } from '@xyflow/svelte';

	const nodes = writable([
		{
			id: '1',
			data: { label: 'Hello' },
			position: { x: 0, y: 0 },
		},
		{
			id: '2',
			data: { label: 'World' },
			position: { x: 200, y: 0 },
		},
		{
			id: '3',
			type: 'custom',
			data: { label: 'World' },
			position: { x: 100, y: 150 },
		},
	]);

	const edges = writable([
		{
			id: '1-3',
			source: '1',
			target: '3',
		},
		{
			id: '2-3',
			source: '2',
			target: '3',
		},
	]);
</script>

<div class="h-full flex-1">
	<SvelteFlow {nodes} {edges} fitView>
		<Controls />
		<Background />
		<MiniMap />
	</SvelteFlow>
</div>
