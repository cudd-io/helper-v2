import db from '$lib/db';
import { delay } from '$lib/utils';
import { SimpleCommand, SimpleCommandModel } from '@helper/db';

import {
	ChannelType,
	Client,
	Events,
	GatewayIntentBits,
	Message,
	OmitPartialGroupDMChannel,
	Partials,
	REST,
	Routes,
	type Interaction,
} from 'discord.js';
import { handleMessage } from '../chat';
import { commands } from './commands';
import { ICommandData } from './types';

export class DiscordBot {
	public client: Client;
	private commands: Map<string, ICommandData> = new Map();
	public fetch: REST;
	private simpleCommands: Map<string, SimpleCommandModel> = new Map();

	constructor(private token: string) {
		console.log('creating Discord bot...');
		this.fetch = new REST({ version: '10' }).setToken(token);
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
			],
			partials: [
				Partials.Channel,
				Partials.Message,
				Partials.Reaction,
				Partials.User,
				Partials.GuildMember,
			],
		});

		this.setupEventHandlers();
	}

	private setupEventHandlers() {
		// When the bot is ready
		this.client.on(Events.ClientReady, () => {
			console.log(`Logged in as ${this.client.user?.tag}!`);
		});

		// Handle incoming messages
		this.client.on(Events.MessageCreate, async (message) => {
			// console.log('message create', message);
			// Ignore messages from bots
			if (message.author.bot) return;
			if (!this.client.user) return console.warn('Bot user not set.');

			// Simple command handling
			for (const simpleCommand of this.simpleCommands.values()) {
				if (
					message.content.toLowerCase() ===
						simpleCommand.trigger.toLowerCase() &&
					message.guildId === simpleCommand.guildId
				) {
					if (message.channel.type == ChannelType.DM) {
						return await message.author.send(simpleCommand.response);
					}
					return await message.reply(simpleCommand.response);
				}
			}
			// When helper is mentioned or sent a DM, treat it as a chat interaction
			if (
				message.mentions.has(this.client.user) ||
				message.channel.type === ChannelType.DM
			) {
				// for now, reply with the same message for testing
				// await message.reply(message.content);
				await this.handleChatInteraction(message);
			}
		});

		// Handle interactions
		this.client.on(Events.InteractionCreate, async (interaction) => {
			await this.handleInteraction(interaction);
		});
	}

	private async handleChatInteraction(
		message: OmitPartialGroupDMChannel<Message<boolean>>,
	) {
		await message.channel.sendTyping();

		const interval = setInterval(() => {
			// send typing every 11 seconds until the response is received
			message.channel.sendTyping();
		}, 11000);

		const response = await handleMessage(message, this.client);
		clearInterval(interval);

		if (response.choices[0]?.message?.content) {
			const messageContent = response.choices[0].message.content;
			// split the message into separate messages by {{break}}
			const messageChunks = messageContent.split('{{break}}');

			if (message.channel.type !== ChannelType.DM) {
				await message.reply(messageChunks[0]);
			} else {
				await message.author.send(messageChunks[0]);
			}

			for (const [index, chunk] of messageChunks.entries()) {
				if (index === 0) continue;
				// send typing for the next message until it's sent
				await message.channel.sendTyping();

				// get the delay time for the next message from {{delay:x}} in the message. If it's not found, set the delay to 500ms
				const delayTime = chunk.match(/\{\{delay:(\d+)\}\}/)?.[1] ?? null;
				const messageContent = chunk.replace(/\{\{delay:(\d+)\}\}/g, '');

				await delay(Number(delayTime ?? 500));

				if (message.channel.type !== ChannelType.DM) {
					await message.channel?.send(messageContent);
				} else {
					await message.author.send(messageContent);
				}
			}
		} else {
			if (message.channel.type !== ChannelType.DM) {
				message.reply('oof looks like something went wrong? sorry about that');
			} else {
				message.author.send(
					'oof looks like something went wrong? sorry about that',
				);
			}
		}
	}

	public async start() {
		try {
			await this.client.login(this.token);
		} catch (error) {
			console.error('Failed to start Discord bot:', error);
			throw error;
		}
	}

	public async stop() {
		console.log('Doing cleanup...');
		await this.cleanup();
		await this.client.destroy();
		console.log('Discord bot stopped');
	}

	public async refreshSimpleCommands(guildId?: string) {
		console.log('refreshing simple commands', guildId);
		const simpleCmdCtrl = new SimpleCommand(db);

		const commandsArray = await simpleCmdCtrl.getAll(guildId);

		if (guildId) {
			this.simpleCommands.forEach((cmd, key) => {
				if (key.startsWith(`${guildId}`)) {
					this.simpleCommands.delete(key);
				}
			});
		} else {
			this.simpleCommands.clear();
		}

		console.log(commandsArray);
		for (let cmd of commandsArray) {
			const key = `${cmd.guildId}:${cmd.trigger}`;
			this.simpleCommands.set(key, cmd);
		}
	}

	public registerCommands(commands: ICommandData[]) {
		for (const command of commands) {
			this.commands.set(command.command.name, command);
		}
	}

	public async handleInteraction(interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			const command = this.commands.get(interaction.commandName);
			if (command) {
				await command.do(interaction);
			}
		}

		if (interaction.isAutocomplete()) {
			const command = this.commands.get(interaction.commandName);
			if (command && command.autocomplete) {
				await command.autocomplete(interaction);
			} else {
				console.log('no autocomplete command found', interaction.commandName);
			}
		}
	}

	public async deployCommands() {
		try {
			console.log('Started refreshing application (/) commands.');

			if (!this.client.application) {
				throw new Error('Application not ready');
			}

			const guilds = await this.getAllGuildIds();

			const commandsJSON = Array.from(this.commands.values()).map((cmd) =>
				cmd.command.toJSON(),
			);

			const appId = this.client.application.id;

			const deployCommandPromises = guilds.map((guild) => {
				console.log('deploying to guild', guild.name);
				return this.fetch
					.put(Routes.applicationGuildCommands(appId, guild.id), {
						body: commandsJSON,
					})
					.then(() => console.log('commands deployed to guild', guild.name))
					.catch(() =>
						console.warn('failed to deploy commands to guild', guild.name),
					);
			});

			const promises = [...deployCommandPromises, this.refreshSimpleCommands()];
			await Promise.all(promises);
			console.log('Successfully reloaded application (/) commands.');
			return;
		} catch (error) {
			console.error('Error deploying commands:', error);
			throw error;
		}
	}

	public async cleanup() {
		if (!this.client.application) {
			throw new Error('Application not ready');
		}

		const guilds = await this.getAllGuildIds();
		const appId = this.client.application.id;

		const promises = guilds.map((guild) => {
			console.log('removing commands for guild', guild.name);
			return this.fetch.put(Routes.applicationGuildCommands(appId, guild.id), {
				body: [],
			});
		});

		return Promise.all(promises);
	}

	public async getAllGuildIds() {
		if (!this.client.application) {
			throw new Error('Application not ready');
		}

		const guilds = await this.client.guilds.fetch();

		return guilds;
	}
}

export const initializeBot = async () => {
	const bot = new DiscordBot(process.env.DISCORD_BOT_TOKEN!);
	await bot.start();
	bot.registerCommands(commands);
	await bot.deployCommands();
	console.log('bot initialized');

	return bot;
};
