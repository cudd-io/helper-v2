import db from '$lib/db';
import { SimpleCommand } from '@helper/db';
import { createSubcommand } from '$lib/features/bot/utils';
import { bot } from '$lib/features/bot/state/bot-state';

const simpleCmds = new SimpleCommand(db);

export const subcommandRefresh = createSubcommand({
	name: 'refresh',
	command: (subcommand) =>
		subcommand.setDescription('Refresh custom commands manually'),

	do: async (interaction) => {
		const guild = interaction.guild;

		if (!guild) {
			interaction.reply(
				'This command can only be used within a discord server',
			);
			return;
		}

		try {
			await bot.refreshSimpleCommands(interaction.guildId ?? undefined);

			interaction.reply({
				content: `Successfully refreshed commands`,
				ephemeral: true,
			});
		} catch (e) {
			const adminId = '866367674980630588';

			interaction.reply({
				content: `Failed to refresh commands. \nPlease notify <@${adminId}> that there's an issue.`,
				ephemeral: true,
			});
		}
	},
});
