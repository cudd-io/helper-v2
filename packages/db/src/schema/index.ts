import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export * from './auth-schema';

export const discordUser = sqliteTable('discord_user', {
	id: text('id').primaryKey(),
	discordId: text('discordId').notNull().unique(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	pronouns: text('pronouns').notNull().default('she/her'),
	timezone: text('timezone').notNull().default('America/New_York'),
	joinedAt: text('joinedAt').notNull(),
});
