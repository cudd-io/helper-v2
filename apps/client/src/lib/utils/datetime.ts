export type DateTime = {
	dateObject: Date;
	dateString: string;
	timeString: string;
	timestamp: number;
};

export const getDateTime = (timestamp: string | number) => {
	const date = new Date(timestamp);
	const dateString = date.toLocaleDateString();
	const timeString = date.toLocaleTimeString();
	return { dateObject: date, dateString, timeString, timestamp: date.getTime() };
};

export const seconds = (n: number) => n * 1000;
export const minutes = (n: number) => seconds(n) * 60;
export const hours = (n: number) => minutes(n) * 60;
export const days = (n: number) => hours(n) * 24;
export const weeks = (n: number) => days(n) * 7;
