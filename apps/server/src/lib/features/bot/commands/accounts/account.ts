import db from '$lib/db';
import schema from '$lib/db/schema';
import { ChatInputCommandInteraction } from 'discord.js';

import { DiscordUser } from '@helper/db';

const discordUser = new DiscordUser(db);

export const accountManager = {
	getAccount: async (interaction: ChatInputCommandInteraction) => {
		const guild = interaction.guild;
		return await discordUser.get({
			discordId: interaction.user.id,
			guildId: guild?.id || 'no-guild',
		});
	},

	createAccount: async (
		interaction: ChatInputCommandInteraction,
		account: {
			timezone: string;
			pronouns?: string;
		},
	) => {
		const guild = interaction.guild;
		const member = await guild?.members.fetch({
			user: interaction.user.id,
		});
		return await discordUser.create(
			{
				discordId: interaction.user.id,
				name: interaction.user.displayName,
				guildId: guild?.id || 'no-guild',
				username: interaction.user.username,
				joinedAt: `${member?.joinedTimestamp || Date.now().toString()}`,
				pronouns: account.pronouns,
				timezone: account.timezone,
			},
			true,
		);
	},
};
