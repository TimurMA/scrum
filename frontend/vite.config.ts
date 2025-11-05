import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      include: ["buffer"],
      globals: {
        Buffer: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@composables": path.resolve(__dirname, "./src/composables"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@views": path.resolve(__dirname, "./src/views"),
    },
  },
});
