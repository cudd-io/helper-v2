import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../../types';
import { TZDate } from '@date-fns/tz';
import { AllTimeZoneCodes, getOffset } from '$lib/utils';
import { fuzzySearchArray } from '$lib/utils/search';
import { accountManager } from './account';
import { createAccountEmbed } from './embeds';
import * as chrono from 'chrono-node';

const markdownJSON = (obj: any) => {
	return '```json\n' + JSON.stringify(obj, null, 2) + '\n```';
};

export const commands: ICommandData[] = [
	{
		command: new SlashCommandBuilder()
			.setName('account')
			.setDescription('Get your account information')
			.addSubcommand((subcommand) =>
				subcommand
					.setName('info')
					.setDescription('Get your account info')
					.addBooleanOption((option) =>
						option
							.setName('public')
							.setDescription(
								'Allow others to see the response [default: false]',
							)
							.setRequired(false),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName('register')
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
			),
		async do(interaction) {
			if (interaction.options.getSubcommand() === 'info') {
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

				const embeds = [
					await createAccountEmbed(interaction, account, isPublic),
				];

				await interaction.reply({
					content: '',
					embeds,
					ephemeral,
				});
			}

			if (interaction.options.getSubcommand() === 'register') {
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

				const embeds = [
					await createAccountEmbed(interaction, newAccount, false),
				];

				await interaction.reply({
					content: 'Registered account',
					embeds,
					ephemeral: true,
				});
			}
		},
		async autocomplete(interaction) {
			const focusedValueFull = interaction.options.getFocused(true);
			if (focusedValueFull.name !== 'timezone') {
				console.log('focusedvalue', focusedValueFull);
				return;
			}
			const focusedValue = focusedValueFull.value as string;
			const choices = AllTimeZoneCodes;

			const filtered = fuzzySearchArray(choices, focusedValue, 5);

			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice })),
			);
		},
	},
	{
		async do(interaction) {
			const time = interaction.options.getString('time', true);
			const account = await accountManager.getAccount(interaction);
			const format = interaction.options.getString('format') || 'f';
			const timezone = interaction.options.getString('timezone');

			if (!account && !timezone) {
				await interaction.reply({
					content:
						'You do not have an account. Please register with `/account register` or manually provide a timezone',
					ephemeral: true,
				});
				return;
			}

			const timezoneToUse = timezone || account?.timezone || 'UTC';

			const date = chrono.parseDate(time, {
				instant: TZDate.tz(timezoneToUse),
				timezone: getOffset(timezoneToUse),
			});

			if (!date) {
				await interaction.reply({
					content:
						'Invalid date/time. Please check your formatting and try again',
					ephemeral: true,
				});
				return;
			}

			const timestamp = Math.floor(date.getTime() / 1000);
			const discordTs = `<t:${timestamp}:${format}>`;

			await interaction.reply(discordTs);
		},
		command: new SlashCommandBuilder()
			.setName('time')
			.setDescription('Return a timestamp from the provided time in plain text')
			.addStringOption((option) =>
				option
					.setName('time')
					.setDescription('The time to convert')
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('format')
					.setDescription('The format to use')
					.setRequired(false)
					.addChoices(
						{ name: 'Time Short: 4:20 PM', value: 't' },
						{ name: 'Time Long: 4:20:00 PM', value: 'T' },
						{ name: 'Date Short: 4/20/24', value: 'd' },
						{ name: 'Date Long: April 20, 2024', value: 'D' },
						{ name: 'Full Short: April 20, 2024 at 4:20 PM', value: 'f' },
						{
							name: 'Full Long',
							value: 'F',
						},
					),
			)
			.addStringOption((option) =>
				option
					.setName('timezone')
					.setDescription('The timezone to use')
					.setRequired(false)
					.setAutocomplete(true),
			),
		async autocomplete(interaction) {
			const focusedValueFull = interaction.options.getFocused(true);
			if (focusedValueFull.name !== 'timezone') {
				console.log('focusedvalue', focusedValueFull);
				return;
			}
			const focusedValue = focusedValueFull.value as string;
			const choices = AllTimeZoneCodes;

			const filtered = fuzzySearchArray(choices, focusedValue, 5);

			await interaction.respond(
				filtered.map((choice) => ({ name: choice, value: choice })),
			);
		},
	},
];
