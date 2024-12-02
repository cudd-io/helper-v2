import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	type CommandInteraction,
	type SlashCommandBuilder,
	type SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface ICommandData {
	command:
		| SlashCommandBuilder
		| SlashCommandOptionsOnlyBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandSubcommandBuilder;
	do: (interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export * from './actions';
export * from './inputs';
export * from './conditions';
