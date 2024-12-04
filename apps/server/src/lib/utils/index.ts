export * from './time';

type MapFunction = (value?: any, index?: number, array?: any[]) => any;

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const times = (n: number, mapFunction: MapFunction) =>
	[...new Array(n)].map(mapFunction);

export const wrapText = (text: string, approximateLineLength: number = 30) => {
	const words = text.split(' ');
	const lines = words
		.reduce(
			(lines: string[][], word) => {
				const lastLine = lines[lines.length - 1];
				if (
					lastLine &&
					lastLine.join(' ').length + word.length + 1 <= approximateLineLength
				) {
					lastLine.push(word);
				} else {
					lines.push([word]);
				}
				return lines;
			},
			[[]],
		)
		.map((line) => line.join(' '));
	return lines.join('\n');
};
