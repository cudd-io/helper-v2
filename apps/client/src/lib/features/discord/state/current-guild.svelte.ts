import type { APIPartialGuild } from 'discord-api-types/v10';
import { getContext, onMount, setContext } from 'svelte';

const CURRENT_GUILD_KEY = Symbol('CURRENT_GUILD');

export class CurrentGuild {
	guild: APIPartialGuild | null = $state(null);

	constructor() {
		onMount(() => {
			this.guild = JSON.parse(
				localStorage.getItem(String(CURRENT_GUILD_KEY)) || 'null',
			) as APIPartialGuild | null;
		});

		$effect(() => {
			localStorage.setItem(String(CURRENT_GUILD_KEY), JSON.stringify(this.guild));
		});
	}

	set(guild: APIPartialGuild | null) {
		this.guild = guild;
	}
}

export const setCurrentGuild = () => {
	return setContext(CURRENT_GUILD_KEY, new CurrentGuild());
};

export const getCurrentGuild = () => {
	return getContext<ReturnType<typeof setCurrentGuild>>(CURRENT_GUILD_KEY);
};
