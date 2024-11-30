import { DISCORD_BOT_TOKEN } from '$env/static/private';
import {
	Routes,
	PermissionFlagsBits,
	type APIGuild,
	type APIPartialGuild,
} from 'discord-api-types/v10';
import { auth } from '$lib/features/auth';
import { db } from '$lib/server/db';
import { hasPermission, sleep } from '$lib/utils';
import { getAPIRoute } from '$lib/features/discord/api/queries';
import ky from 'ky';

export const getAuth = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user) {
		throw new Error('Unauthorized');
	}

	const account = await db.query.account.findFirst({
		where: (account, { eq }) => eq(account.userId, session.user.id),
	});

	if (!account) {
		throw new Error('Unauthorized');
	}

	return {
		session,
		account,
	};
};

export const getBotGuilds = async ({ request }: { request: Request }) => {
	const route = Routes.userGuilds();

	const { account } = await getAuth({ request });

	const botGuildsPromise = ky<APIGuild[]>(getAPIRoute(route), {
		headers: {
			Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
		},
	});

	const userGuildsPromise = ky<APIGuild[]>(getAPIRoute(Routes.userGuilds()), {
		headers: {
			Authorization: `Bearer ${account.accessToken}`,
		},
	});

	const [botGuilds, userGuilds] = await Promise.all([
		botGuildsPromise.json(),
		userGuildsPromise.json(),
	]);

	const guilds = botGuilds.filter((guild: APIGuild) => {
		return userGuilds.some((userGuild: APIGuild) => {
			const inGuild = userGuild.id === guild.id;
			const perms = BigInt(parseInt(userGuild.permissions || '0'));
			const hasAdminPerms = hasPermission(perms, PermissionFlagsBits.Administrator);

			return inGuild && hasAdminPerms;
		});
	});

	return guilds;
};

type VerifiedAccessToken =
	| {
			ok: true;
			message: undefined;
	  }
	| {
			ok: false;
			message: string;
	  };

export const verifyAccessToken = async (
	accessToken: string | undefined,
	guildId?: string,
): Promise<VerifiedAccessToken> => {
	if (!accessToken) {
		return { ok: false, message: 'No access token provided' };
	}

	// Check if access token is valid
	const { ok, status, data } = await ky<APIGuild[]>(
		'https://discord.com/api/v10/users/@me/guilds',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	).then(async (res) => {
		const { ok, status } = res;
		return { ok, status, data: await res.json() };
	});

	if (!ok) {
		// if (data.retry_after) {
		// 	console.log(`waiting for ${data.retry_after} seconds to try again`);
		// 	await sleep(data.retry_after * 1000 + 100);
		// 	return verifyAccessToken(accessToken, guildId);
		// }
		return { ok: false, message: 'Invalid access token' };
	}

	// Check if user has access to guild
	if (guildId) {
		const guild: APIGuild | undefined = data.find((guild: APIGuild) => guild.id === guildId);
		if (
			!guild ||
			!hasPermission(BigInt(parseInt(guild.permissions || '0')), PermissionFlagsBits.Administrator)
		) {
			return { ok: false, message: 'User does not have access to guild' };
		}
	}

	return { ok: true, message: undefined };
};
