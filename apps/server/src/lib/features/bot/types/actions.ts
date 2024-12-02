import { Input } from './inputs';

export type CommandAction<T extends Input[]> = {
	name: string;
	description: string;
	inputs: T;
};
