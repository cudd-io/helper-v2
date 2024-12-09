import { Hono } from 'hono';
import { commands } from './lib/features/bot/commands';
import { DiscordBot, initializeBot } from './lib/features/bot/bot';
import { bot } from '$lib/features/bot/state/bot-state';
import { Client, GatewayIntentBits, OAuth2Scopes } from 'discord.js';

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

// app.get('/commands/simple', (c) => {
// 	// const commandsJSON = commands.map((cmd) => cmd.command.toJSON());
// 	// return c.json(commandsJSON);
// 	return c.json(commands);
// });

app.get('/invite', async (c) => {
	const client = bot.client;
	const { redirect } = c.req.query();

	const shouldRedirect = !!redirect;

	const invite = client.generateInvite({
		scopes: [
			OAuth2Scopes.Bot,
			OAuth2Scopes.ApplicationsCommands,
			OAuth2Scopes.ApplicationCommandsPermissionsUpdate,
			OAuth2Scopes.MessagesRead,
			OAuth2Scopes.GuildsMembersRead,
		],
		permissions: ['Administrator'],
	});

	if (shouldRedirect) {
		return c.redirect(invite);
	}

	return c.json({
		invite,
	});
});

export default app;
