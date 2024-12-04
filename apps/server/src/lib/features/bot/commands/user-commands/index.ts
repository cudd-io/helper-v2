import { SlashCommandBuilder } from 'discord.js';

import db from '$lib/db';
import { ICommandData } from '$lib/features/bot/types';
import { handleSubcommand } from '$lib/features/bot/utils';
import { SimpleCommand } from '@helper/db';
import subcommands from './subcommands';

const simpleCmds = new SimpleCommand(db);

const command = new SlashCommandBuilder()
	.setName('custom-command')
	.setDescription('Create a custom command');

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
};

export const commands = [commandData];
