import * as schema from '../schema';
import { NewSimpleCommandModel } from '../types';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { and, eq } from 'drizzle-orm';

type LibSQLDB = LibSQLDatabase<typeof schema>;

type CompositeKey = {
	trigger: string;
	guildId: string;
};

export class SimpleCommand<DB extends LibSQLDB> {
	public db: DB;

	constructor(db: DB) {
		this.db = db;
	}

	public async get({ trigger, guildId }: CompositeKey) {
		const command = await this.db.query.simpleCommand.findFirst({
			where: (simpleCommand, { eq, and }) =>
				and(
					eq(simpleCommand.trigger, trigger),
					eq(simpleCommand.guildId, guildId),
				),
		});

		return command;
	}

	public async getAll(guildId?: string) {
		if (guildId) {
			return this.db.query.simpleCommand.findMany({
				where: eq(schema.simpleCommand.guildId, guildId),
			});
		}

		return this.db.query.simpleCommand.findMany();
	}

	public async create(simpleCommand: NewSimpleCommandModel, upsert = false) {
		if (!upsert) {
			const cmd = await this.db
				.insert(schema.simpleCommand)
				.values(simpleCommand)
				.returning();

			return cmd[0];
		}

		const cmd = await this.db
			.insert(schema.simpleCommand)
			.values(simpleCommand)
			.onConflictDoUpdate({
				target: [schema.simpleCommand.trigger, schema.simpleCommand.guildId],
				set: {
					...simpleCommand,
				},
			})
			.returning();

		return cmd[0];
	}

	public async update(
		{ trigger, guildId }: CompositeKey,
		simpleCommandData: Partial<NewSimpleCommandModel>,
	) {
		const command = await this.db
			.update(schema.simpleCommand)
			.set(simpleCommandData)
			.where(
				and(
					eq(schema.simpleCommand.trigger, trigger),
					eq(schema.simpleCommand.guildId, guildId),
				),
			)
			.returning();

		return command[0];
	}

	public async delete(pk: CompositeKey) {
		await this.db
			.delete(schema.simpleCommand)
			.where(
				and(
					eq(schema.simpleCommand.trigger, pk.trigger),
					eq(schema.simpleCommand.guildId, pk.guildId),
				),
			);
	}
}
