import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from 'discord.js';
import { ISubcommandData } from '../types';

export const isSubcommand = (
	interaction: ChatInputCommandInteraction,
	subcommandName: string,
) => {
	return interaction.options.getSubcommand() === subcommandName;
};

export const handleSubcommand = async (
	interaction: ChatInputCommandInteraction,
	subcommand: ISubcommandData,
) => {
	console.log('handleSubcommand:', subcommand.name);
	if (isSubcommand(interaction, subcommand.name)) {
		return await subcommand.do(interaction);
	}
	return;
};

export const createSubcommand = (subcommand: ISubcommandData) => ({
	name: subcommand.name,
	command: (cmd: SlashCommandSubcommandBuilder) =>
		subcommand.command(cmd.setName(subcommand.name)),
	do: subcommand.do,
});
