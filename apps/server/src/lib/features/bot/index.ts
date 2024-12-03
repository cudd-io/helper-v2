import {
	Client,
	Events,
	GatewayIntentBits,
	REST,
	Routes,
	type Interaction,
} from 'discord.js';
import { ICommandData } from './types';
import { commands } from './commands';

const testGuildId = process.env.DISCORD_TEST_GUILD_ID;

export class DiscordBot {
	private client: Client;
	private commands: Map<string, ICommandData> = new Map();
	public fetch: REST;

	constructor(private token: string) {
		console.log('creating Discord bot...');
		this.fetch = new REST({ version: '10' }).setToken(token);
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
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
			// Ignore messages from bots
			if (message.author.bot) return;

			// Simple command handling
			if (message.content === '!ping') {
				await message.reply('Pong! 🏓');
			}
		});

		// Handle interactions
		this.client.on(Events.InteractionCreate, async (interaction) => {
			await this.handleInteraction(interaction);
		});
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

			const promises = guilds.map((guild) => {
				console.log('deploying to guild', guild.name);
				return this.fetch.put(
					Routes.applicationGuildCommands(appId, guild.id),
					{
						body: commandsJSON,
					},
				);
			});

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
