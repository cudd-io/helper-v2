import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export * from './auth-schema';

export const discordUser = sqliteTable(
	'discord_user',
	{
		discordId: text('discordId').notNull(),
		guildId: text('guildId').notNull(),
		name: text('name').notNull(),
		username: text('username').notNull(),
		pronouns: text('pronouns').notNull().default('she/her'),
		timezone: text('timezone').notNull().default('America/New_York'),
		joinedAt: text('joinedAt').notNull(),
	},
	(table) => ({
		pk: primaryKey({
			name: 'user_to_guild',
			columns: [table.discordId, table.guildId],
		}),
	}),
);
