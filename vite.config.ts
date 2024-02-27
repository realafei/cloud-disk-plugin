import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monkey, { cdn } from "vite-plugin-monkey";

export default defineConfig({
  server: {
    port: 10086,
  },
  preview: {
    port: 10010,
  },
  plugins: [
    vue(),
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "网盘文件批量重命名",
        icon: "data:image/png;base64,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",
        grant: "none",
        match: "https://pan.baidu.com/disk/main*",
        license: 'MIT',
        namespace: "cloud-disk-plugin",
        description: "网盘文件批量重命名，支持百度网盘",
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr("Vue", "dist/vue.global.prod.js"),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
