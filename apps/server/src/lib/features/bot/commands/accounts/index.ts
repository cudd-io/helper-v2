import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../../types';
import { TZDate } from '@date-fns/tz';
import { AllTimeZoneCodes } from '$lib/utils';
import { fuzzySearchArray } from '$lib/utils/search';
import db from '$lib/db';

const getAccount = async (discordId: string) => {
	const account = await db.query.discordUser.findFirst({
		where: (discordUser, { eq }) => eq(discordUser.discordId, discordId),
	});

	return account;
};

export const commands: ICommandData[] = [
	{
		command: new SlashCommandBuilder()
			.setName('account')
			.setDescription('Get your account information')
			.addSubcommand((subcommand) =>
				subcommand.setName('info').setDescription('Get your account info'),
			),

		async do(interaction) {
			if (interaction.options.getSubcommand() === 'info') {
			}
		},
	},
	{
		command: new SlashCommandBuilder()
			.setName('register')
			.setDescription('Register an account with Helper')
			.addStringOption((option) =>
				option
					.setName('timezone')
					.setDescription('Your timezone')
					.setAutocomplete(true)
					.setRequired(true),
			),
		async do(interaction) {
			const timezone = interaction.options.get('timezone')?.value as string;

			if (!AllTimeZoneCodes.includes(timezone)) {
				await interaction.reply({
					content: 'Invalid timezone',
					ephemeral: true,
				});
				return;
			}
			await interaction.reply({
				content: 'Registered account',
				ephemeral: true,
			});
		},

		async autocomplete(interaction) {
			const focusedValue = interaction.options.getFocused();
			const choices = AllTimeZoneCodes;

			const filtered = fuzzySearchArray(choices, focusedValue);

			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice })),
			);
		},
	},
];
