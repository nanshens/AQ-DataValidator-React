import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/config", component: "config" },
    { path: "/execute", component: "execute" },
    { path: "/result", component: "result" },
  ],
  npmClient: 'pnpm',
});
