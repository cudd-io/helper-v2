import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../schema';
import { NewDiscordUserModel } from '../types';
import { eq } from 'drizzle-orm';

type LibSQLDB = LibSQLDatabase<typeof schema>;

export class DiscordUser<DB extends LibSQLDB> {
	public db: DB;

	constructor(db: DB) {
		this.db = db;
	}

	public async get(discordId: string) {
		const user = await this.db.query.discordUser.findFirst({
			where: (discordUser, { eq }) => eq(discordUser.discordId, discordId),
		});

		return user;
	}

	public async create(discordUser: NewDiscordUserModel) {
		const user = await this.db.insert(schema.discordUser).values(discordUser);

		return user;
	}

	public async update(
		discordId: string,
		discordUserData: Partial<NewDiscordUserModel>,
	) {
		const user = await this.db
			.update(schema.discordUser)
			.set(discordUserData)
			.where(eq(schema.discordUser.discordId, discordId))
			.returning();

		return user;
	}

	public async delete(discordId: string) {
		await this.db
			.delete(schema.discordUser)
			.where(eq(schema.discordUser.discordId, discordId));
	}
}
