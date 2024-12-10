import db from '$lib/db';
import { SimpleCommand } from '@helper/db';
import { createSubcommand } from '$lib/features/bot/utils';
import { bot } from '$lib/features/bot/state/bot-state';

const simpleCmds = new SimpleCommand(db);

export const subcommandCreate = createSubcommand({
	name: 'create',
	command: (subcommand) =>
		subcommand
			.setDescription('Create a custom command')
			.addStringOption((option) =>
				option
					.setName('name')
					.setRequired(true)
					.setDescription('The text that triggers the command'),
			)
			.addStringOption((option) =>
				option
					.setName('response')
					.setRequired(true)
					.setDescription('The text to respond with'),
			)
			.addStringOption((option) =>
				option
					.setName('description')
					.setDescription('Describe the command')
					.setRequired(false),
			),

	do: async (interaction) => {
		const guild = interaction.guild;

		if (!guild) {
			interaction.reply(
				'This command can only be used within a discord server',
			);
			return;
		}

		const member = await guild.members.fetch({
			user: interaction.user.id,
		});

		const trigger = interaction.options.getString('name', true);
		const response = interaction.options.getString('response', true);
		const description =
			interaction.options.getString('description', false) ?? undefined;

		simpleCmds.create({
			creatorId: member.id,
			guildId: guild.id,
			response,
			trigger,
			description,
		});

		await bot
			.refreshSimpleCommands(interaction.guildId ?? undefined)
			.catch(() => bot.refreshSimpleCommands());
		interaction.reply({
			content: '**Custom command created:**',
			ephemeral: true,
			embeds: [
				{
					title: trigger,
					description: description,
					author: {
						name: member.user.username,
						icon_url: member.user.displayAvatarURL(),
					},
					fields: [
						{
							name: 'Response',
							value: response,
						},
					],
				},
			],
		});
	},
});
