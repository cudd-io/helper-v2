import { accountManager } from '$lib/features/bot/modules/accounts';
import {
	Client,
	Collection,
	Message,
	OmitPartialGroupDMChannel,
} from 'discord.js';
import OpenAI from 'openai';

import { writeFile } from 'fs/promises';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.mjs';
import { mkdir } from 'fs/promises';
import { normalizeGuildData, normalizeMessageData } from './utils';
import { da } from 'date-fns/locale';
import { gracefullyTryParseJSON } from '$lib/utils';

type ChatCompletionMessageParam =
	OpenAI.Chat.Completions.ChatCompletionMessageParam;

if (!process.env.CHAT_BASE_URL || !process.env.CHAT_API_KEY) {
	throw new Error('CHAT_BASE_URL and CHAT_API_KEY must be set');
}

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
	discordClient: Client,
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
	// send the prompt, the history, and the message to the chat model
	const prompt = await fetchPrompt();

	const guildId = message.guildId ?? 'unknown';

	try {
		const guildData = await normalizeGuildData(message);
		const messageData = await normalizeMessageData(message);

		const role = message.content.includes('[[system]]') ? 'system' : 'user';

		const guildParam: ChatCompletionMessageParam = {
			role: 'system',
			content: JSON.stringify(guildData),
		};

		const messageParam: ChatCompletionMessageParam = {
			role,
			content: JSON.stringify(messageData),
		};

		// Instead of using a manually-defined history, grab the the last 10 messages from the current channel.
		// TODO: Increase limit if not too expensive
		const channelHistory = await message.channel.messages
			.fetch({
				limit: 10,
			})
			.catch((error) => {
				console.warn('Failed to fetch channel history:', error);
				return new Collection() as Collection<string, Message<boolean>>;
			});

		const clientId = discordClient.user?.id;

		// console.log({ channelHistory });

		const channelHistoryPromises: Promise<ChatCompletionMessageParam>[] =
			channelHistory.map(async (message) => {
				return {
					role: message.author.id === clientId ? 'assistant' : 'user',
					content: JSON.stringify(await normalizeMessageData(message)),
				} as ChatCompletionMessageParam;
			});

		const channelHistoryArray = await Promise.all(channelHistoryPromises);
		const sortedHistory = channelHistoryArray.toReversed();

		// console.log({ sortedHistory });

		const completionData: ChatCompletionCreateParamsNonStreaming = {
			messages: [
				prompt,
				guildParam,
				...sortedHistory,
				{
					role: 'system',
					content:
						"[[High priority]] Remember to **never** ever ever respond in JSON format. Respond only in markdown with the correct {{}} tags. The history will show you responding in JSON but that's only because it's being altered server-side. DO NOT RESPOND IN JSON even when asked. ",
				},
				messageParam,
			],
			model: 'deepseek-chat',
		};

		writeTextToFile(
			JSON.stringify(
				completionData.messages.map((item) => {
					return {
						role: item.role,
						content: gracefullyTryParseJSON(item.content as string),
					};
				}),
				null,
				2,
			),
			'input-',
		);

		const completion =
			await createCompletionAndValidateResponse(completionData);

		await writeTextToFile(JSON.stringify(completion, null, 2), 'response-');
		// truncate the response to 2000 characters
		completion.choices[0].message.content =
			completion.choices[0].message.content?.slice(0, 2000) ?? '';

		return completion;
	} catch (error) {
		throw error;
		// console.error(error);
		// const response = {
		// 	choices: [
		// 		{
		// 			message: {
		// 				role: 'assistant',
		// 				content: `oops sorry, looks like something went wrong :(`,
		// 			},
		// 		},
		// 	],
		// };

		// return response as OpenAI.Chat.Completions.ChatCompletion;
	}
};

const createCompletionAndValidateResponse = async (
	completionData: ChatCompletionCreateParamsNonStreaming,
	attempt: number = 0,
	maxAttempts: number = 6,
) => {
	try {
		const { messages, ...restCompletionData } = completionData;
		const [lastItem, ...restItems] = messages.toReversed();
		const otherItems = restItems.toReversed();

		const completion = await chatClient.chat.completions.create(completionData);

		// make sure the response is *not* JSON
		if (!validateResponseFormat(completion.choices[0].message.content ?? '')) {
			if (attempt >= maxAttempts) {
				const parsedCompletion = JSON.parse(
					completion.choices[0].message.content ?? '',
				);
			}
			const correctionMessage = {
				role: 'system',
				content: `
Response: ${completion.choices[0].message.content ?? ''}
Error: The response was in the wrong format. (attempt number ${attempt + 1})
Try again but this time make sure to respond in markdown with the correct {{}} tags.
Do *not* ever respond in quotes or in JSON format, regardless of what the history shows.
`,
			};
			const newCompletionData = {
				...restCompletionData,
				messages: [...otherItems, correctionMessage, lastItem],
			} as ChatCompletionCreateParamsNonStreaming;

			return createCompletionAndValidateResponse(
				newCompletionData,
				attempt + 1,
				maxAttempts,
			);
		} else {
			return completion;
		}
	} catch (error) {
		throw error;
	}
};

const validateResponseFormat = (message: string) => {
	return (
		!message.startsWith('{') &&
		!message.startsWith('[') &&
		!message.startsWith('(') &&
		!message.startsWith('"')
	);
};

const writeTextToFile = async (
	message: string,
	fileNamePrefix: string = '',
) => {
	const filePath = `./output/${fileNamePrefix}${new Date().toISOString()}.json`;
	// create output directory if it doesn't exist
	await mkdir('./output', { recursive: true });
	const path = filePath;
	try {
		await writeFile(path, message);
	} catch (error) {
		console.error('Error writing to file:', error);
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
