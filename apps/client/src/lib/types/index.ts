import type { QueryClient } from '@tanstack/svelte-query';

type QueryOptions = {
	enabled?: boolean;
	staleTime?: number;
};

export type BaseQueryParams = {
	fetch?: typeof fetch;
	options?: Partial<QueryOptions>;
};

export type BaseMutationParams = {
	options?: Partial<QueryOptions>;
	queryClient: QueryClient;
};
