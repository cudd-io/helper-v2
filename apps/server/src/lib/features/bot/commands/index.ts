import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../types';

export const commands: ICommandData[] = [
	{
		command: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!'),
		async do(interaction) {
			await interaction.reply('Pong!');
		},
	},
	{
		command: new SlashCommandBuilder()
			.setName('roll')
			.setDescription('Rolls a dice')
			.addIntegerOption((option) =>
				option
					.setName('sides')
					.setDescription('Number of sides')
					.setRequired(true),
			),

		async do(interaction) {
			const sides = interaction.options.get('sides')?.value as number;
			const result = Math.floor(Math.random() * sides) + 1;
			await interaction.reply(`You rolled a ${result}`);
		},
	},
];
