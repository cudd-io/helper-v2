import { Input } from './inputs';

export type CommandCondition<T extends Input[]> = {
	name: string;
	description: string;
	inputs: T;
};
