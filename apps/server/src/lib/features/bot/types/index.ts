import type {
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface ICommandData {
	command: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	do: (interaction: CommandInteraction) => Promise<void>;
}
