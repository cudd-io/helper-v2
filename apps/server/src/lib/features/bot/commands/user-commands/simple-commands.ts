import { SlashCommandBuilder } from 'discord.js';

import { ICommandData } from '../../types';
import { isSubcommand } from '../../utils';
import db from '$lib/db';
import { SimpleCommand } from '@helper/db';
import { bot } from '../../bot-instance';
import { de } from 'date-fns/locale';

const simpleCmds = new SimpleCommand(db);

export const commands: ICommandData[] = [
	{
		command: new SlashCommandBuilder()
			.setName('custom-command')
			.setDescription('Create a custom command')
			.addSubcommand((subcommand) =>
				subcommand
					.setName('create')
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
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('list')
					.setDescription('List all custom commands')
					.addBooleanOption((option) =>
						option
							.setName('private')
							.setDescription('Only you will see the response')
							.setRequired(false),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('delete')
					.setDescription('Delete a custom command')
					.addStringOption((option) =>
						option
							.setName('name')
							.setDescription('The name of the command to delete')
							.setRequired(true),
					),
			),

		async do(interaction) {
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

			if (isSubcommand(interaction, 'create')) {
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

				await bot.refreshSimpleCommands(guild.id);
				interaction.reply({
					content: 'Custom command created',
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
			}

			if (isSubcommand(interaction, 'list')) {
				const isPrivate = interaction.options.getBoolean('private') ?? false;
				const commands = await simpleCmds.getAll(guild.id);

				const formatDescription = (description: string) => {
					if (!description) {
						return '';
					}

					return `${description}\n`;
				};

				interaction.reply({
					embeds: [
						{
							title: 'Custom commands',
							description: 'List of custom commands',
							fields:
								commands.length > 0
									? commands.map((cmd) => ({
											name: '• ' + cmd.trigger,
											value: `${formatDescription(cmd.description)}**response:** \`${cmd.response}\``,
										}))
									: [
											{
												name: 'No custom commands found',
												value:
													'There are no custom commands in this server yet. Use `/custom-command create` to create one.',
											},
										],
						},
					],
					ephemeral: isPrivate,
				});
			}

			if (isSubcommand(interaction, 'delete')) {
				const trigger = interaction.options.getString('name', true);
				simpleCmds.delete({
					guildId: guild.id,
					trigger,
				});
				try {
					await bot.refreshSimpleCommands(guild.id);
					interaction.reply({
						content: `Successfully deleted command: \`${trigger}\``,
						ephemeral: true,
					});
				} catch (e) {
					const adminId = '866367674980630588';
					interaction.reply({
						content: `Failed to delete command: \`${trigger}\` \nPlease notify <@866367674980630588> that there's an issue.`,
						ephemeral: true,
					});
				}
			}
		},
	},
];
