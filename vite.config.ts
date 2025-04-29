import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		base: env.VITE_BASE_URL,
		build: {
			outDir: "dist",
		},
		resolve: {tsconfigPaths: true},
		plugins: [
			glsl(),
			tanstackRouter({ autoCodeSplitting: false }),
			viteReact(),
		],
	};
});
