export * from './shadcn';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createKey = (path: string, params: Record<string, any> = {}) => [
	...(decodeURI(path).split('/') as string[]).filter((item) => item),
	params,
];

export const hasPermission = (permissions: bigint, permission: bigint) => {
	return (permissions & permission) !== 0n;
};

export const getGuildIcon = (guildId: string, iconId: string) => {
	return `https://cdn.discordapp.com/icons/${guildId}/${iconId}.png`;
};

export const getUserAvatar = (userId: string, avatarId: string) => {
	return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
};
