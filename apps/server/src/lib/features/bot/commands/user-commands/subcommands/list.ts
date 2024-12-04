import db from '$lib/db';
import { SimpleCommand } from '@helper/db';
import { createSubcommand } from '$lib/features/bot/utils';

const simpleCmds = new SimpleCommand(db);

export const subcommandList = createSubcommand({
	name: 'list',
	command: (subcommand) =>
		subcommand
			.setDescription('List all custom commands')
			.addBooleanOption((option) =>
				option
					.setName('private')
					.setDescription('Only you will see the response')
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
	},
});
