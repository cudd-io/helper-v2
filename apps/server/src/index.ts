import './lib/features/bot/state/bot-state';
import app from './api';

// Handle graceful shutdown
process.on('SIGINT', async () => {
	// await bot.stop();
	process.exit(0);
});

export default app;
