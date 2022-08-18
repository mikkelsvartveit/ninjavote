import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";
import makeAttractionsImporter from "attractions/importer.js";
import path from "path";
const __dirname = path.resolve();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    scss: {
      importer: makeAttractionsImporter({
        themeFile: path.join(__dirname, "./src/style/attractions-theme.scss"),
      }),
      includePaths: [path.join(__dirname, "./src/style")],
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

  experimental: {
    inspector: true,
  },
};

export default config;
