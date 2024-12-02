import { Hono } from 'hono';
import { DiscordBot, initializeBot } from './lib/features/bot';
import { commands } from './lib/features/bot/commands';

const app = new Hono();

app.get('/', (c) =>
	c.json({
		healthy: true,
	}),
);

app.get('/commands/global', (c) => {
	const commandsJSON = commands.map((cmd) => cmd.command.toJSON());
	return c.json(commandsJSON);
});
let bot: DiscordBot;
(async () => {
	bot = await initializeBot();
})();

// Handle graceful shutdown
process.on('SIGINT', async () => {
	await bot.stop();
	process.exit(0);
});

export default app;
