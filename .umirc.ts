import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/config/:id", component: "config" },
    { path: "/executor/:id", component: "executor" },
    { path: "/result/:id", component: "result" },
    { path: "/history/:id", component: "history" },
    { path: "/test", component: "test2" },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: `http://127.0.0.1:5000`,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
