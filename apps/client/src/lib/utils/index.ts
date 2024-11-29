export * from './shadcn';

export const createKey = (path: string, params: Record<string, any> = {}) => [
	...(decodeURI(path).split('/') as string[]).filter((item) => item),
	params,
];
