import { DiscordUserModel } from '@helper/db/types';
import { formatDistance, formatRelative } from 'date-fns';
import { toDate } from 'date-fns';
import { APIEmbedField, CommandInteraction, EmbedBuilder } from 'discord.js';

export const createAccountEmbed = async (
	interaction: CommandInteraction,
	discordUserData: DiscordUserModel,
	isPublic: boolean = false,
) => {
	const cachedMember = interaction.guild?.members.cache.get(
		interaction.user.id,
	);

	const pronounsField: APIEmbedField = {
		name: 'Pronouns',
		value: discordUserData.pronouns,
		inline: true,
	};

	const timezoneField: APIEmbedField = {
		name: 'Timezone',
		value: discordUserData.timezone,
		inline: true,
	};

	const fields: APIEmbedField[] = isPublic
		? [pronounsField]
		: [pronounsField, timezoneField];

	const member =
		cachedMember ||
		(await interaction.guild?.members.fetch(interaction.user.id));

	const defaultColor = '#858dff';

	const joinDate = toDate(parseInt(discordUserData.joinedAt));

	const today = toDate(Date.now());

	const timeSinceJoined = formatDistance(joinDate, today, {
		addSuffix: true,
	});

	const embed = new EmbedBuilder()
		.setAuthor({
			name: 'Helper',
			url: 'https://erika.cafe',
			iconURL:
				'https://cdn.discordapp.com/app-icons/1272714442156675152/11dda664757f02ad46be1f1fcb975140.png?size=512',
		})
		.setTitle(discordUserData.name)
		.addFields(...fields)
		.setThumbnail(
			member?.displayAvatarURL({ size: 512 }) ||
				member?.user.avatarURL({ size: 512 }) ||
				'https://placehold.co/512',
		)
		.setColor(defaultColor)
		.setFooter({
			text: `@${member?.user.username || discordUserData.username} • joined ${timeSinceJoined} `,
		});

	return embed;
};
