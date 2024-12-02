import Fuse, { type FuseOptionKey } from 'fuse.js';

export function fuzzySearch<T>(
	array: T[],
	keys: FuseOptionKey<T>[],
	search: string,
): T[] {
	if (!search) return array;
	const fuse = new Fuse(array, {
		keys: keys,
		isCaseSensitive: false,
		includeScore: true,
		minMatchCharLength: 3,
		useExtendedSearch: true,
	});

	return fuse.search(search).map((result) => result.item);
}

export function fuzzySearchArray(
	array: string[],
	search: string,
	maxResults = 15,
): string[] {
	if (!search || search.length < 2) return array.slice(0, maxResults);

	const fuse = new Fuse(array, {
		isCaseSensitive: false,
		includeScore: true,
		minMatchCharLength: 2,
		useExtendedSearch: true,
	});

	return fuse
		.search(search)
		.map((result) => result.item)
		.slice(0, maxResults);
}
