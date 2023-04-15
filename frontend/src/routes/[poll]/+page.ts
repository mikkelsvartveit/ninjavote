import { env } from "$env/dynamic/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  if (!env.PUBLIC_API_URL) {
    throw new Error("Environment variable API_URL is not defined");
  }

  const apiUrl = env.PUBLIC_API_URL;
  const pollId = params.poll;
  const pollUrl = `${apiUrl}/polls/${pollId}`;

  let poll = null;

  const response = await fetch(pollUrl);

  if (response.ok) {
    poll = await response.json();
  }

  return { poll };
};
