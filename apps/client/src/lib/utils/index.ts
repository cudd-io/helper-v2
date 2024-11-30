export * from './shadcn';
export * from './datetime';

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

export const camelToSpace = (str: string) => {
	const result = str.replace(/([A-Z])/g, ' $1');
	return result.toLowerCase();
};

export const snakeToSpace = (str: string) => {
	return str.split('_').join(' ').toLowerCase();
};

export const stripSpecialChars = (str: string) => {
	return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

// const getInitials = (title: string) => {
// 	return stripSpecialChars(title).charAt(0).toUpperCase();
// };

export const getInitials = (str: string, maxChars = 3) => {
	const normalized = stripSpecialChars(camelToSpace(snakeToSpace(str))).toUpperCase();
	return normalized
		.split(' ')
		.map((n) => n[0])
		.join('')
		.slice(0, maxChars);
};
