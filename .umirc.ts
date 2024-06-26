import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/config/:id", component: "config" },
    { path: "/execute", component: "execute" },
    { path: "/result", component: "result" },
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
