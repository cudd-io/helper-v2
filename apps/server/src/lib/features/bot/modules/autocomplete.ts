import { AllTimeZoneCodes } from '$lib/utils';
import { fuzzySearchArray } from '$lib/utils/search';
import { AutocompleteInteraction } from 'discord.js';

export async function autocompleteTimezone(
	interaction: AutocompleteInteraction,
) {
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
}
