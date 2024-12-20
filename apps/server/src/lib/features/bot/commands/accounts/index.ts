import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '$lib/features/bot/types';
import { handleSubcommand } from '$lib/features/bot/utils';
import { autocompleteTimezone } from '$lib/features/bot/modules/autocomplete';
import subcommands from './subcommands';

const command = new SlashCommandBuilder()
	.setName('account')
	.setDescription('Get your account information') as SlashCommandBuilder;

for (let subcommand of subcommands) {
	command.addSubcommand(subcommand.command);
}

const commandData: ICommandData = {
	command,
	async do(interaction) {
		for (let subcommand of subcommands) {
			handleSubcommand(interaction, subcommand);
		}
	},
	autocomplete: autocompleteTimezone,
};

export const commands = [commandData];
