import { Hono } from 'hono';
import { DiscordBot, initializeBot } from './lib/features/bot';

const app = new Hono();

app.get('/', (c) =>
	c.json({
		healthy: true,
	}),
);

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
