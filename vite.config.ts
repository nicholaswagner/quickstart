import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		base: env.VITE_BASE_URL,
		build: {
			outDir: "dist",
		},
		plugins: [
			TanStackRouterVite({ autoCodeSplitting: false }),
			viteReact({ include: /\.(ts|md|json)$/ }),
		],
	};
});
