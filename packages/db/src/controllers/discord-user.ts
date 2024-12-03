import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../schema';
import { NewDiscordUserModel } from '../types';
import { and, eq } from 'drizzle-orm';

type LibSQLDB = LibSQLDatabase<typeof schema>;

type CompositeKey = {
	discordId: string;
	guildId: string;
};
export class DiscordUser<DB extends LibSQLDB> {
	public db: DB;

	constructor(db: DB) {
		this.db = db;
	}

	public async get({ discordId, guildId }: CompositeKey) {
		const user = await this.db.query.discordUser.findFirst({
			where: (discordUser, { eq, and }) =>
				and(
					eq(discordUser.discordId, discordId),
					eq(discordUser.guildId, guildId),
				),
		});

		return user;
	}

	public async create(discordUser: NewDiscordUserModel, upsert = false) {
		if (!upsert) {
			const acc = await this.db
				.insert(schema.discordUser)
				.values(discordUser)
				.returning();

			return acc[0];
		}

		const acc = await this.db
			.insert(schema.discordUser)
			.values(discordUser)
			.onConflictDoUpdate({
				target: [schema.discordUser.discordId, schema.discordUser.guildId],
				set: {
					...discordUser,
				},
			})
			.returning();

		return acc[0];
	}

	public async update(
		{ discordId, guildId }: CompositeKey,
		discordUserData: Partial<NewDiscordUserModel>,
	) {
		const user = await this.db
			.update(schema.discordUser)
			.set(discordUserData)
			.where(
				and(
					eq(schema.discordUser.discordId, discordId),
					eq(schema.discordUser.guildId, guildId),
				),
			)
			.returning();

		return user[0];
	}

	public async delete(discordId: string) {
		await this.db
			.delete(schema.discordUser)
			.where(eq(schema.discordUser.discordId, discordId));
	}
}
