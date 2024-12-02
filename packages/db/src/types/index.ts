import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
	account,
	session,
	user,
	verification,
	discordUser,
} from '../schema';

export type AccountModel = InferSelectModel<typeof account>;
export type SessionModel = InferSelectModel<typeof session>;
export type UserModel = InferSelectModel<typeof user>;
export type VerificationModel = InferSelectModel<typeof verification>;
export type DiscordUserModel = InferSelectModel<typeof discordUser>;

export type NewDiscordUserModel = InferInsertModel<typeof discordUser>;
export type NewAccountModel = InferInsertModel<typeof account>;
export type NewSessionModel = InferInsertModel<typeof session>;
export type NewUserModel = InferInsertModel<typeof user>;
export type NewVerificationModel = InferInsertModel<typeof verification>;
