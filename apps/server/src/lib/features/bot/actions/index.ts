import { createAction } from './create-action';

const actions = {
	reply: createAction(
		{
			name: 'reply',
			description: 'Replies with a message',
			inputs: [
				{
					name: 'message',
					description: 'The message to reply with',
					type: 'string',
					value: '',
				},
			],
		},
		async (interaction, inputs) => {
			const message = inputs.find((input) => input.name === 'message');
			if (!message) {
				throw new Error('No message provided');
			}
			if (!interaction.isRepliable()) {
				throw new Error('Interaction is not repliable');
			}

			await interaction.reply(message.value);
		},
	),

	editReply: createAction(
		{
			name: 'editReply',
			description: 'Edits the reply',
			inputs: [
				{
					name: 'message',
					description: 'The new message',
					type: 'string',
					value: '',
				},
			],
		},
		async (interaction, inputs) => {
			const message = inputs.find((input) => input.name === 'message');
			if (!message) {
				throw new Error('No message provided');
			}

			if (!interaction.isRepliable()) {
				throw new Error('Interaction is not repliable');
			}

			await interaction.editReply(message.value);
		},
	),
};

export default actions;
