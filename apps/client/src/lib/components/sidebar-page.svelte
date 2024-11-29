<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface IBreadcrumb {
		href?: string;
		name: string;
	}

	export interface SidebarPageProps {
		children: Snippet;
		breadcrumbs: IBreadcrumb[];
		activePage?: string;
	}
</script>

<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/';
	import { Separator } from '$lib/components/ui/separator/';
	import * as Sidebar from '$lib/components/ui/sidebar/';

	const {
		children,
		breadcrumbs = [
			{
				name: 'Home',
				href: '/',
			},
			{
				name: 'Dashboard',
				href: '/dashboard',
			},
		],
	}: SidebarPageProps = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each breadcrumbs as breadcrumb, index}
							{#if breadcrumb.href && index < breadcrumbs.length - 1}
								<Breadcrumb.Item>
									<Breadcrumb.Link href={breadcrumb.href}>{breadcrumb.name}</Breadcrumb.Link>
								</Breadcrumb.Item>
							{:else}
								<Breadcrumb.Item>
									<Breadcrumb.Page>{breadcrumb.name}</Breadcrumb.Page>
								</Breadcrumb.Item>
							{/if}
							{#if index < breadcrumbs.length - 1}
								<Breadcrumb.Separator />
							{/if}
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
