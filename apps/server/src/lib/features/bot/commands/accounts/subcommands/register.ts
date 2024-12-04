import { SlashCommandSubcommandBuilder } from 'discord.js';
import { ISubcommandData } from '../../../types';
import { AllTimeZoneCodes } from '$lib/utils';
import { accountManager } from '$lib/features/bot/modules/accounts';
import { createAccountEmbed } from '$lib/features/bot/modules/accounts/embeds';
import { createSubcommand } from '$lib/features/bot/utils';

export const subcommandRegister = createSubcommand({
	name: 'register',
	command: (subcommand) =>
		subcommand
			.setDescription('Register an account with Helper')
			.addStringOption((option) =>
				option
					.setName('timezone')
					.setDescription('Your timezone')
					.setAutocomplete(true)
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('pronouns')
					.setDescription('Your pronouns')
					.setRequired(false)
					.addChoices(
						{ name: 'she/her', value: 'she/her' },
						{ name: 'he/him', value: 'he/him' },
						{ name: 'they/them', value: 'they/them' },
						{ name: 'any/all', value: 'any/all' },
						{ name: 'ask me', value: 'ask' },
						{ name: 'none', value: 'none' },
						{ name: 'unspecified', value: 'unspecified' },
					),
			),
	do: async (interaction) => {
		console.log('subcommand: register');
		const timezone = interaction.options.get('timezone')?.value as string;
		const pronounsOpt = interaction.options.get('pronouns')?.value;
		const pronouns = pronounsOpt ? (pronounsOpt as string) : undefined;

		if (!AllTimeZoneCodes.includes(timezone)) {
			await interaction.reply({
				content: 'Invalid timezone',
				ephemeral: true,
			});
			return;
		}

		const newAccount = await accountManager.createAccount(interaction, {
			timezone,
			pronouns,
		});

		const embeds = [await createAccountEmbed(interaction, newAccount, false)];

		await interaction.reply({
			content: 'Registered account',
			embeds,
			ephemeral: true,
		});
	},
});
