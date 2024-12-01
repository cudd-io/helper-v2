<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { ArrowUpRight, Loader, RefreshCw } from 'lucide-svelte';
	import DashboardLargeCard from '../dashboard-large-card.svelte';
	import { cn, getDateTime, getInitials, getUserAvatar } from '$lib/utils';
	import { createQuery, queryOptions, useQueryClient } from '@tanstack/svelte-query';
	import { getGuildMembers } from '$lib/features/discord/api/queries';
	import { useGetSelectedGuild } from '$lib/hooks/queries.svelte';
	import { toReadable } from '$lib/utils/reactive-query-args.svelte';
	import { PaginatedArray } from '$lib/utils/pagination';
	import * as Pagination from '$lib/components/ui/pagination';
	import { MediaQuery } from 'runed';

	const isDesktop = new MediaQuery('(min-width: 768px)');

	let page = $state(1);
	let perPage = $state(8);

	const selectedGuild = useGetSelectedGuild({});

	const currentGuild = $derived($selectedGuild.data);

	const members = createQuery(
		toReadable(() =>
			queryOptions({
				...getGuildMembers({ guildId: currentGuild?.id || '' }),
				enabled: !!currentGuild?.id,
			}),
		),
	);

	const sortMembers = () => {
		if ($members.data && !$members.isLoading && !$members.isPending) {
			return $members.data.toSorted((a, b) => {
				return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime();
			});
		}

		return [];
	};

	const sortedMembers = $derived(sortMembers());

	const paginatedMembers = $derived(
		new PaginatedArray(sortedMembers, {
			pageSize: perPage,
		}),
	);

	const count = $derived(sortedMembers.length);

	const queryClient = useQueryClient();

	const refreshMembers = () => {
		queryClient.invalidateQueries({
			queryKey: getGuildMembers({
				guildId: currentGuild?.id || '',
			}).queryKey,
		});
	};

	const siblingCount = $derived(isDesktop.matches ? 1 : 0);
</script>

<DashboardLargeCard
	title="Members"
	description="Recently joined members"
	class={cn('flex flex-col gap-4 transition-opacity duration-500', {
		'opacity-55': $members.isFetching,
	})}
>
	{#snippet actions()}
		<Button href="/members" size="sm" class="ml-auto gap-1">
			View All
			<ArrowUpRight class="size-4" />
		</Button>
		<Button
			onclick={refreshMembers}
			size="icon"
			variant="ghost"
			class="gap-1"
			disabled={$members.isFetching}
		>
			<RefreshCw
				class={cn('size-4', {
					'animate-spin': $members.isFetching,
				})}
			/>
		</Button>
	{/snippet}

	{#each paginatedMembers.getItems(page) as member}
		{@const user = member.user}
		{@const joinedAt = getDateTime(member.joined_at)}
		<div class="flex items-center gap-4">
			<Avatar.Root
				class={cn('hidden h-9 w-9 border-2 border-gray-200 sm:flex', {
					// 'border-green-500': member,
				})}
			>
				<Avatar.Image
					src={getUserAvatar(user.id, member.avatar || user.avatar || '')}
					alt="Avatar"
				/>
				<Avatar.Fallback>{getInitials(user.username)}</Avatar.Fallback>
			</Avatar.Root>

			<div class="grid gap-1">
				<p class="text-sm font-medium leading-none">
					{member.nick || user.global_name || user.username}
				</p>
				<p class="text-xs text-muted-foreground">@{user.username}</p>
				<!-- <p>{}</p> -->
			</div>
			<div class="ml-auto grid gap-1 text-right font-medium">
				<p class="text-sm leading-none">{joinedAt.dateString}</p>
				<p class="text-xs text-muted-foreground">{joinedAt.timeString}</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<Loader class="h-6 w-6 animate-spin duration-1000" />
		</div>
	{/each}

	<Pagination.Root {count} {perPage} {siblingCount} bind:page>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>

	<!-- <pre>{JSON.stringify(currentGuild, null, 2)}</pre> -->
</DashboardLargeCard>
