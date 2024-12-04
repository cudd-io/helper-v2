export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => seconds(n * 60);
export const hours = (n: number) => minutes(n * 60);
export const days = (n: number) => hours(n * 24);

export const AllTimeZoneCodes = Intl.supportedValuesOf('timeZone');

export const getOffset = (timeZone = 'UTC', date = new Date()) => {
	const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
	const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
	return (tzDate.getTime() - utcDate.getTime()) / 6e4;
};
