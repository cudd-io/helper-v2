import type { AccountModel } from '@helper/db/types';
import type { Session, User } from 'better-auth';

export type AuthData = {
	session: {
		session: Session;
		user: User;
	};
	account: AccountModel;
};

let acc: AccountModel;
