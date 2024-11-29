import type { AuthData } from '$lib/features/auth/types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			auth: AuthData | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
