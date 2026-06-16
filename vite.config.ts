import { readFileSync } from "node:fs";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

// GitHub Pages serves this project at https://www.nicholaswagner.dev/<name>/, so
// the production base path is the repo name pulled from package.json — the single
// source of truth. Dev keeps "/" for a clean local URL. `base` also feeds
// import.meta.env.BASE_URL, which the router uses as its basepath (see main.tsx).
const { name } = JSON.parse(
	readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as { name: string };

export default defineConfig(({ mode }) => ({
	base: mode === "production" ? `/${name}/` : "/",
	build: {
		outDir: "dist",
	},
	resolve: { tsconfigPaths: true },
	plugins: [glsl(), tanstackRouter({ autoCodeSplitting: false }), viteReact()],
}));
