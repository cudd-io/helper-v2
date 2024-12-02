export type InputNumber = {
	type: 'number';
	value: number;
};

export type InputString = {
	type: 'string';
	value: string;
};

export type InputBoolean = {
	name: 'boolean';
	value: boolean;
};

export type InputTypes = InputBoolean | InputString | InputNumber;

export type Input<T = InputTypes> = T & {
	name: string;
	description: string;
};
