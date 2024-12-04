import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

async function clearDeployedCommands() {
	await client.login(process.env.DISCORD_BOT_TOKEN!);
	const rest = new REST({ version: '10' }).setToken(
		process.env.DISCORD_BOT_TOKEN!,
	);
	console.log(
		'clearing deployed commands',
		process.env.DISCORD_CLIENT_ID,
		process.env.DISCORD_TOKEN,
	);

	console.log('clearing global commands');
	// clear all global commands
	await rest.put(
		Routes.applicationCommands(process.env.PUBLIC_DISCORD_CLIENT_ID!),
		{
			body: [],
		},
	);
	console.log('clearing guild commands:');
	// clear all guild commands
	const guilds = await client.guilds.fetch();
	for (const guild of guilds.values()) {
		console.log('    clearing guild:', guild.name);
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.PUBLIC_DISCORD_CLIENT_ID!,
				guild.id,
			),
			{
				body: [],
			},
		);
	}

	console.log('done');
}

clearDeployedCommands();
