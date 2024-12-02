import { Interaction } from 'discord.js';
import { CommandCondition } from '../types/conditions';
import { Input } from '../types';

export type ConditionProcedure<T extends Input[]> = (
	interaction: Interaction,
	inputs: T,
) => Promise<boolean>;

export const createCondition = <T extends Input[]>(
	action: CommandCondition<T>,
	fn: ConditionProcedure<T>,
) => {
	return { action, fn };
};
