import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../types';
import { CommandInteraction } from 'discord.js';
import { delay, times } from '../../../utils';
import { createDiceEmbed, rollDice } from '../components/dice';

import { commands as accountCommands } from './accounts';
import { commands as simpleCommands } from './user-commands/simple-commands';

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
					.setRequired(false),
			)
			.addIntegerOption((option) =>
				option
					.setName('amount')
					.setDescription('Number of dice')
					.setRequired(false),
			)
			.addIntegerOption((option) =>
				option
					.setName('delay')
					.setDescription('Delay for extra suspense!')
					.setRequired(false),
			)
			.addStringOption((option) =>
				option
					.setName('comment')
					.setDescription('Extra comments to show on the result')
					.setRequired(false),
			),

		async do(interaction) {
			const amount = (interaction.options.get('amount')?.value as number) || 1;
			const sides = (interaction.options.get('sides')?.value as number) || 6;
			const delayTime =
				(interaction.options.get('delay')?.value as number) || 500;
			const comment = interaction.options.get('comment')?.value as string;

			await animateReply('Rolling', interaction, 4, delayTime);
			const results = rollDice(sides, amount);
			await interaction.editReply({
				content: `${interaction.user.toString()} rolled \`${amount}\` \`D${sides}\``,
				embeds: [createDiceEmbed(sides, amount, results, comment)],
			});
		},
	},
	...accountCommands,
	...simpleCommands,
];

const animateReply = async (
	text: string,
	interaction: CommandInteraction,
	ticks = 4,
	delayTime = 500,
) => {
	await interaction.reply(`${text}`);

	for (let currentTick = 1; currentTick < ticks; currentTick++) {
		let dots = times(currentTick, () => '·').join(' ');
		await interaction.editReply(`${text} ${dots}`);
		await delay(delayTime);
	}
	Promise.resolve();
};
