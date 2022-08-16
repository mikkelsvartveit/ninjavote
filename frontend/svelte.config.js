import adapter from "@sveltejs/adapter-static";
import path from "path";
import preprocess from "svelte-preprocess";
import makeAttractionsImporter from "attractions/importer.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      importer: makeAttractionsImporter({
        themeFile: "./src/style/attractions-theme.scss",
      }),
    },
  }),

  kit: {
    adapter: adapter(),
    vite: {
      resolve: {
        alias: {
          "xmlhttprequest-ssl":
            "./node_modules/engine.io-client/lib/xmlhttprequest.js",
          $: "./src",
        },
      },
    },
  },
};

export default config;
