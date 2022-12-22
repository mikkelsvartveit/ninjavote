import type { IVoterSession } from "$/types/poll";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const session: Writable<IVoterSession | null> = writable(null);
