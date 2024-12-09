import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../schema';
import { NewGlobalSettingsModel } from '../types';

type LibSQLDB = LibSQLDatabase<typeof schema>;

export class GlobalSettings<DB extends LibSQLDB> {
	public db: DB;
	public clientId: string;

	constructor(db: DB, clientId: string) {
		this.db = db;
		this.clientId = clientId;
	}

	public async get() {
		const settings = await this.db.query.globalSettings.findFirst({
			where: (globalSettings, { eq }) =>
				eq(globalSettings.clientId, this.clientId),
		});

		return settings;
	}

	public async update(settings: NewGlobalSettingsModel) {
		const acc = await this.db
			.insert(schema.globalSettings)
			.values(settings)
			.onConflictDoUpdate({
				target: schema.globalSettings.clientId,
				set: {
					...settings,
				},
			})
			.returning();

		return acc[0];
	}
}
