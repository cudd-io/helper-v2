import db from '$lib/db';
import schema from '$lib/db/schema';
import { ChatInputCommandInteraction } from 'discord.js';

import { DiscordUser } from '@helper/db';

const discordUser = new DiscordUser(db);

export const accountManager = {
	getAccount: async (interaction: ChatInputCommandInteraction) => {
		return await discordUser.get(interaction.user.id);
	},

	createAccount: async (interaction: ChatInputCommandInteraction) => {
		const account = await discordUser.create({
			discordId: interaction.user.id,
			name: interaction.user.username,
			username: interaction.user.username,
			joinedAt: '',
			pronouns: '',
			timezone: '',
		});
		// const account = await db.insert(schema.discordUser).values({
		// 	discordId: interaction.user.id,
		// 	name: interaction.user.username,
		// 	username: interaction.user.username,
		// });
		// return account;
	},
};
