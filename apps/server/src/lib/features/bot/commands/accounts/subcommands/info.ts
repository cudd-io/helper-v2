import { SlashCommandSubcommandBuilder } from 'discord.js';
import { ISubcommandData } from '../../../types';
import { AllTimeZoneCodes } from '$lib/utils';
import { createSubcommand } from '$lib/features/bot/utils';
import { accountManager } from '$lib/features/bot/modules/accounts';
import { createAccountEmbed } from '$lib/features/bot/modules/accounts/embeds';

export const subcommandInfo = createSubcommand({
	name: 'info',
	command: (subcommand) =>
		subcommand
			.setDescription('Get your account info')
			.addBooleanOption((option) =>
				option
					.setName('public')
					.setDescription('Allow others to see the response [default: false]')
					.setRequired(false),
			),
	do: async (interaction) => {
		console.log('subcommand: info');
		const isPublic = !!interaction.options.get('public')?.value;
		const ephemeral = !isPublic;
		const account = await accountManager.getAccount(interaction);

		if (!account) {
			await interaction.reply({
				content:
					'You do not have an account. Please register with `/account register`',
				ephemeral: true,
			});
			return;
		}

		const embeds = [await createAccountEmbed(interaction, account, isPublic)];

		await interaction.reply({
			content: '',
			embeds,
			ephemeral,
		});
	},
});
