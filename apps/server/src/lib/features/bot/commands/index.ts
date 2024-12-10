import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../types';
import { ActivityType, CommandInteraction } from 'discord.js';
import { delay, times } from '../../../utils';
import { createDiceEmbed, rollDice } from '../modules/dice';

import { commands as accountCommands } from './accounts';
import { commands as timeCommands } from './time';
import { commands as userCommands } from './user-commands';

const findWinner = (results: string[]): string => {
	const tally = results.reduce(
		(acc, result) => {
			acc[result] = (acc[result] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
	if (tally['heads'] > tally['tails']) {
		return '`heads`';
	} else if (tally['tails'] > tally['heads']) {
		return '`tails`';
	} else {
		return '`tie`';
	}
};

const pluralize = (word: string, count: number): string => {
	return count !== 1 ? `${word}s` : word;
};

const activityTypes = [
	{
		name: 'Playing',
		value: `${ActivityType.Playing}`,
	},
	{
		name: 'Competing',
		value: `${ActivityType.Competing}`,
	},
	{
		name: 'Listening',
		value: `${ActivityType.Listening}`,
	},
	{
		name: 'Streaming',
		value: `${ActivityType.Streaming}`,
	},
	{
		name: 'Watching',
		value: `${ActivityType.Watching}`,
	},
	{
		name: 'Custom',
		value: `${ActivityType.Custom}`,
	},
];

export const commands: ICommandData[] = [
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
	{
		command: new SlashCommandBuilder()
			.setName('flip')
			.setDescription('Flips a coin')
			.addIntegerOption((option) =>
				option
					.setName('amount')
					.setDescription('Number of coins')
					.setRequired(false),
			)
			.addStringOption((option) =>
				option
					.setName('comment')
					.setDescription('Extra comments to show on the result')
					.setRequired(false),
			),
		async do(interaction) {
			const amount = Math.abs(interaction.options.getInteger('amount') || 1);
			const comments = interaction.options.getString('comment');

			await animateReply('Flipping', interaction, 4);
			const results = rollDice(2, amount).results.map((r) =>
				r === 1 ? 'heads' : 'tails',
			);

			await interaction.editReply({
				content: `${interaction.user.toString()} flipped \`${amount}\` ${pluralize('coin', amount)}`,
				embeds: [
					{
						title: `🪙 Results (\`${amount} ${pluralize('coin', amount)}\`) 🪙`,
						fields: [
							{ name: 'Results', value: `\`${results.join('` · `')}\`` },
							results.length > 1
								? { name: 'Winner', value: findWinner(results) }
								: null,
							comments ? { name: 'Comments', value: `\`${comments}\`` } : null,
						].filter((item) => !!item),
					},
				],
			});
		},
	},
	{
		command: new SlashCommandBuilder()
			.setName('status')
			.setDescription('Set my status message')
			.addStringOption((option) =>
				option
					.setName('message')
					.setDescription('The message to set')
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('type')
					.setDescription('The type of status')
					.addChoices(...activityTypes),
			),
		async do(interaction) {
			const name = interaction.options.getString('message', true);
			const type = parseInt(
				interaction.options.getString('type') || '4',
			) as ActivityType;
			const client = interaction.client;

			client.user?.setActivity({
				type,
				name,
			});

			await interaction.reply({
				content: `Status set to \`${name}\``,
				ephemeral: true,
			});
		},
	},
	...accountCommands,
	...timeCommands,
	...userCommands,
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
