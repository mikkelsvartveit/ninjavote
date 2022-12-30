import type { IPoll } from "$lib/types/poll";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const poll: Writable<IPoll | null> = writable(null);
