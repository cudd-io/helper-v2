import { CommandInteraction, Interaction } from 'discord.js';
import { Input, CommandAction } from '../types';

export type ActionProcedure<T extends Input[]> = (
	interaction: Interaction,
	inputs: T,
) => Promise<void>;

export const createAction = <T extends Input[]>(
	action: CommandAction<T>,
	fn: ActionProcedure<T>,
) => {
	return { action, fn };
};
