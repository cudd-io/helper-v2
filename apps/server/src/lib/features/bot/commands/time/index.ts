import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommandData } from '../../types';
import { TZDate } from '@date-fns/tz';
import { AllTimeZoneCodes, getOffset } from '$lib/utils';
import { fuzzySearchArray } from '$lib/utils/search';
import { accountManager } from '$lib/features/bot/modules/accounts';

import * as chrono from 'chrono-node';
import { autocompleteTimezone } from '../../modules/autocomplete';

export const commands: ICommandData[] = [
	{
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
		autocomplete: autocompleteTimezone,
	},
];
