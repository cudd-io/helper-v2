import { DiscordBot, initializeBot } from '../bot';

export let bot: DiscordBot;

(async () => {
	bot = await initializeBot();
})();
