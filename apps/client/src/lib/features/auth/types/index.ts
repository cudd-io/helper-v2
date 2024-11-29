import type { account } from '$lib/server/db/schema';
import type { Session, User } from 'better-auth';
import type { InferSelectModel } from 'drizzle-orm';

export type AuthData = {
	session: {
		session: Session;
		user: User;
	};
	account: InferSelectModel<typeof account>;
};
