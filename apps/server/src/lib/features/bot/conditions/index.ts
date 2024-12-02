import { createCondition } from './create-condition';

export const conditions = {
	messageIncludes: createCondition(
		{
			name: 'messageIncludes',
			description: 'The message includes the specified text',
			inputs: [
				{
					name: 'text',
					description: 'The text to check for',
					type: 'string',
					value: '',
				},
			],
		},
		async (interaction) => {
			// if (interaction.is) {
			// }
			return false;
		},
	),
};
