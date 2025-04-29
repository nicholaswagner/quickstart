import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import tsconfigPaths from "vite-tsconfig-paths";

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		base: env.VITE_BASE_URL,
		build: {
			outDir: "dist",
		},
		plugins: [
			tsconfigPaths(),
			glsl(),
			TanStackRouterVite({ autoCodeSplitting: false }),
			viteReact({ include: /\.(ts|md|json)$/ }),
		],
	};
});
