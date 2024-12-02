import {
	type CommandInteraction,
	type SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface ICommandData {
	command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	do: (interaction: CommandInteraction) => Promise<void>;
}

export * from './actions';
export * from './inputs';
export * from './conditions';
