import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    port: 3000,
    proxy: {
      "/socket.io": "http://localhost:3030",
    },
  },
};

export default config;
