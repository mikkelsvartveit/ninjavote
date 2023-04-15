import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (() => {
  const generateId = () => {
    // Generate alphanumeric id of length 8
    return Math.random().toString(36).substring(2, 10);
  };

  throw redirect(307, `/${generateId()}`);
}) satisfies PageServerLoad;
