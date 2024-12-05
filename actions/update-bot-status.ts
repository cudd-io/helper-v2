import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

async function updateBotStatus(text: string) {
	console.log('Updating bot status...');
	await client.login(process.env.DISCORD_BOT_TOKEN!);

	client.once('ready', async () => {
		console.log('logged in as', client.user?.username);
		client.user?.setActivity({
			type: ActivityType.Custom,
			name: text,
		});
	});

	client.on('error', (error) => {
		console.error(error);
	});

	client.on('warn', (message) => {
		console.warn(message);
	});
}

(async () => {
	try {
		await updateBotStatus('v2 is here! 😊').then(() => {
			console.log('Updated bot status');
			// process.exit(0);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
