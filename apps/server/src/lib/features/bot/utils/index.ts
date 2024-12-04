import { ChatInputCommandInteraction } from 'discord.js';

export const isSubcommand = (
	interaction: ChatInputCommandInteraction,
	subcommandName: string,
) => {
	return interaction.options.getSubcommand() === subcommandName;
};
