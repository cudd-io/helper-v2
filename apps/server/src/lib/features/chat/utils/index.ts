import { RecursivePartial } from '$lib/types';
import { accountManager } from '$lib/features/bot/modules/accounts';

import {
	APIGuildMember,
	APIUser,
	APIMessage,
	Message,
	Client,
	MessageMentions,
	APIGuildChannel,
	ChannelType,
	APIGuild,
	GuildMember,
	NonThreadGuildBasedChannel,
	DMChannel,
	PartialDMChannel,
	PartialGroupDMChannel,
	GuildBasedChannel,
	TextBasedChannel,
} from 'discord.js';

type NormalizedMessageBase = Omit<APIMessage, 'author' | 'mentions'>;

export type NormalizedMessage = RecursivePartial<NormalizedMessageBase> & {
	author?: RecursivePartial<APIUser> & {
		displayName: string;
		pronouns?: string;
	};

	parentMessage?: NormalizedMessage | string;
	mentions?: MessageMentions<boolean>;
	role: 'user' | 'system' | 'assistant';
};

export type NormalizedGuildChannel = RecursivePartial<
	APIGuildChannel<
		| ChannelType.GuildText
		| ChannelType.GuildNews
		| ChannelType.GuildPublicThread
		| ChannelType.GuildPrivateThread
		| ChannelType.GuildAnnouncement
		| ChannelType.GuildStageVoice
		| ChannelType.GuildVoice
	>
>;

export type NormalizedDMChannel = RecursivePartial<
	APIGuildChannel<ChannelType.DM>
>;

export type NormalizedGuild = {
	currentChannel: NormalizedGuildChannel | NormalizedDMChannel;
	guild?: RecursivePartial<APIGuild>;
	members?: RecursivePartial<APIGuildMember>[];
	channels?: (NormalizedGuildChannel | NormalizedDMChannel)[];
};

export const normalizeMessageData = async (
	message: Message<boolean>,
	depth: number = 0,
	maxDepth: number = 10,
): Promise<NormalizedMessage | undefined | string> => {
	if (depth > maxDepth) {
		console.warn('max depth reached');
		return {
			content: '[[system]] maximum depth reached',
			role: 'system',
		};
	}

	// get the user account
	let account = await accountManager.getAccountFromId(
		message.author.id,
		message.guildId ?? undefined,
	);

	let _parentMessage = undefined;
	if (depth < maxDepth) {
		_parentMessage = message.reference?.messageId
			? await message.channel.messages
					.fetch(message.reference.messageId)
					.catch(() => undefined)
			: undefined;
	}

	const parentMessage = _parentMessage
		? await normalizeMessageData(_parentMessage, depth + 1, maxDepth)
		: undefined;

	// normalize message data to only include the minimal amount of context neccessary for the chat model to work properly
	let role: NormalizedMessage['role'] = 'user';

	if (message.content.includes('[[system]]')) role = 'system';
	if (message.author.id == message.client.user?.id) role = 'assistant';

	// The bot keeps getting confused by json, so all assistant messages are sent as plain text. Should save tokens also
	if (depth === 0 && role === 'assistant') {
		return message.content;
	}

	const normalizedMessage: NormalizedMessage = {
		content: message.content,
		role,
		author: {
			displayName: message.author.displayName,
			id: message.author.id,
			pronouns: account?.pronouns ?? 'they/them',
		},
		id: message.id,
		mentions: message.mentions,
		timestamp: message.createdAt.toLocaleString('en-US'),
		parentMessage,
	};
	return normalizedMessage;
};

// guild and channel data is sent after the prompt but before the message history

export const normalizeGuildData = async (
	message: Message<boolean>,
): Promise<NormalizedGuild | undefined> => {
	const guild = await message.guild?.fetch();
	const channels = await guild?.channels.fetch();

	if (!guild) {
		if (message.channel.type === ChannelType.DM) {
			return {
				currentChannel: normalizeChannelData(message.channel),
			};
		}
		// should probably never happen but if it fails it's really nbd
		return undefined;
	}

	// get members
	const members = await guild.members.fetch();

	const memberData = members.map((member) => normalizeGuildMember(member));
	const channelData = channels?.map((channel) => normalizeChannelData(channel));

	return {
		guild: {
			id: guild.id,
			name: guild.name,
		},
		members: memberData,
		channels: channelData,
		currentChannel: normalizeChannelData(message.channel),
	};
};

export const normalizeGuildMember = (
	member: GuildMember,
): RecursivePartial<APIGuildMember> => {
	return {
		user: {
			id: member.user.id,
			username: member.user.username,
			global_name: member.user.globalName,
			bot: member.user.bot,
		},
		nick: member.nickname || member.user.displayName,
		joined_at: member.joinedTimestamp?.toLocaleString('en-US'),
		roles: member.roles.cache.map((role) => role.name),
	};
};

export const normalizeChannelData = (
	// message: Message<boolean>,
	channel?: GuildBasedChannel | TextBasedChannel | null,
): NormalizedGuildChannel | NormalizedDMChannel => {
	if (!channel) return {};
	if (channel.type === ChannelType.GuildCategory) return {};
	if (channel.type === ChannelType.DM || channel.type === ChannelType.GroupDM) {
		return {
			id: channel.id,
			name: 'DM',
		};
	}

	return {
		id: channel.id,
		name: channel.name ?? '',
	};
};

export const filterMessage = (
	message: Message<boolean>,
	client: Client,
): boolean => {
	if (!message) return false;
	if (message.author.bot && message.author.id !== client.user?.id) return false;
	if (!message.content) return false;
	return true;
};
