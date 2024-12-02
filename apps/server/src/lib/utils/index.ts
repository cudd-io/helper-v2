export * from './time';

type MapFunction = (value?: any, index?: number, array?: any[]) => any;

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const times = (n: number, mapFunction: MapFunction) =>
	[...new Array(n)].map(mapFunction);
