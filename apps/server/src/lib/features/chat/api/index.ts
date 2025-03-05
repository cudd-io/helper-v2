import { accountManager } from '$lib/features/bot/modules/accounts';
import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import OpenAI from 'openai';

type ChatCompletionMessageParam =
	OpenAI.Chat.Completions.ChatCompletionMessageParam;

if (!process.env.CHAT_BASE_URL || !process.env.CHAT_API_KEY) {
	throw new Error('CHAT_BASE_URL and CHAT_API_KEY must be set');
}

export const MESSAGE_HISTORY_LIMIT = 100;

// message history saved only in memory. I may add some longer-term memory for helper later, but this should be fine for now.
export const messageHistory: {
	[guildId: string]: ChatCompletionMessageParam[];
} = {};

export const chatClient = new OpenAI({
	apiKey: process.env.CHAT_API_KEY,
	baseURL: process.env.CHAT_BASE_URL,
});

export const fetchPrompt = async (): Promise<ChatCompletionMessageParam> => {
	const PROMPT_URL = `${process.env.PROMPT_URL}`;
	if (!PROMPT_URL) {
		throw new Error('PROMPT_URL must be set');
	}

	const response = await fetch(PROMPT_URL);
	if (!response.ok) {
		throw new Error('Failed to fetch prompt');
	}

	const prompt = await response.text();
	return {
		role: 'system',
		content: prompt,
	};
};

export const chatModel = process.env.CHAT_MODEL || 'deepseek-chat';

export const handleMessage = async (
	message: OmitPartialGroupDMChannel<Message<boolean>>,
	guildId: string,
) => {
	// send the prompt, the history, and the message to the chat model
	const prompt = await fetchPrompt();
	const history = messageHistory[guildId] || [];

	// set typing
	await message.channel.sendTyping();

	try {
		// get user account
		const account = await accountManager
			.getAccountFromId(message.author.id, guildId)
			.catch(() => undefined);

		let pronouns = 'they/them'; // default to "they/them" pronouns

		if (account?.pronouns) {
			pronouns = account.pronouns;
		}

		const guildMembers =
			message.guild?.members.cache ?? (await message.guild?.members.fetch());

		console.log({ guildMembers });

		const membersPromises = guildMembers?.map(async (member) => {
			const memberAccount = await accountManager.getAccountFromId(
				member.id,
				guildId,
			);
			const memberData: any = member.toJSON(); // TODO: Properly set type
			return {
				...memberData,
				presence: member.presence?.toJSON(),
				account: {
					...memberAccount,
					pronouns: memberAccount?.pronouns ?? 'they/them',
				},
			};
		});

		const members = await Promise.all(membersPromises ?? []);

		const messageContent = JSON.stringify({
			sender: { ...message.author, pronouns },
			preferredName: message.author.displayName,
			// pronouns: message.author.pronouns,
			message: message.content,
			metadata: {
				guildId,
				members,
				channel: message.channel,
				timestamp: message.createdAt,
				mentions: message.mentions,
			},
		});

		const messageParam: ChatCompletionMessageParam = {
			role: 'user',
			content: messageContent,
		};

		// add the new message to the end of the history
		messageHistory[guildId] = [...history, messageParam];

		const completion = await chatClient.chat.completions.create({
			messages: [prompt, ...messageHistory[guildId]],
			model: 'deepseek-chat',
		});

		const completionMessage = completion.choices[0].message;

		messageHistory[guildId] = [...history, completionMessage];

		if (messageHistory[guildId].length > MESSAGE_HISTORY_LIMIT) {
			messageHistory[guildId].splice(
				0,
				messageHistory[guildId].length - MESSAGE_HISTORY_LIMIT,
			);
		}

		return completion;
	} catch (error) {
		console.error(error);
		const response = {
			choices: [
				{
					message: {
						role: 'assistant',
						message: `oops sorry, looks like something went wrong :(`,
					},
				},
			],
		};

		return response;
	}
};

// export const handleMessageReaction = async (
// 	reaction: Message<boolean>,
// 	user: User,
// 	guildId: string,
// ) => {
// 	console.log('handleMessageReaction');
// 	console.log({ reaction, user, guildId });
// };

// export const handleMessageDelete = async (
// 	message: Message<boolean>,
// 	guildId: string,
// ) => {
// 	console.log('handleMessageDelete');
// 	console.log({ message, guildId });
//   }
// };
