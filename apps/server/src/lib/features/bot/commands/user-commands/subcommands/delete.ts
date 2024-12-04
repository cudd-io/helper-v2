import db from '$lib/db';
import { SimpleCommand } from '@helper/db';
import { createSubcommand } from '$lib/features/bot/utils';
import { bot } from '$lib/features/bot/state/bot-state';

const simpleCmds = new SimpleCommand(db);

export const subcommandDelete = createSubcommand({
	name: 'delete',
	command: (subcommand) =>
		subcommand
			.setDescription('Delete a custom command')
			.addStringOption((option) =>
				option
					.setName('name')
					.setDescription('The name of the command to delete')
					.setRequired(true),
			),

	do: async (interaction) => {
		const guild = interaction.guild;

		if (!guild) {
			interaction.reply(
				'This command can only be used within a discord server',
			);
			return;
		}

		const trigger = interaction.options.getString('name', true);

		try {
			simpleCmds.delete({
				guildId: guild.id,
				trigger,
			});

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
	},
});
