import adapter from "@sveltejs/adapter-auto";
import { dirname, join } from "path";
import preprocess from "svelte-preprocess";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      prependData: `@use "${join(__dirname, "src/lib/style/variables")}" as *;`,
    },
  }),

  kit: {
    adapter: adapter(),
  },
};

export default config;
