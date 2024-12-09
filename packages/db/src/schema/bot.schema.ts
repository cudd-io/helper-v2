import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

// global bot settings
export const globalSettings = sqliteTable('global_settings', {
	clientId: text('clientId').notNull().unique(),
	status: text('status'),
	statusType: text('statusType'),
});

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

export const simpleCommand = sqliteTable(
	'simple_command',
	{
		description: text('description').notNull().default(''),
		creatorId: text('creator').notNull(),
		trigger: text('trigger').notNull(),
		guildId: text('guildId').notNull(),
		response: text('response').notNull(),
	},
	(table) => ({
		pk: primaryKey({
			name: 'command_to_guild',
			columns: [table.guildId, table.trigger],
		}),
	}),
);
