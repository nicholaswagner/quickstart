# AGENTS.md

Source-of-truth guidance for AI agents working in this repo. If this file and
`README.md` ever disagree about process, this file wins.

## What this is

A personal GitHub-template / starter repo (also the basis for
`nicholaswagner.dev`). It's a Vite single-page app deployed to GitHub Pages.

## Stack

- **Build:** Vite 6
- **UI:** React 19 + `@radix-ui/themes` (+ `@radix-ui/colors`) for base
  components and theming
- **Routing:** TanStack Router, file-based. `src/routeTree.gen.ts` is
  **generated** — never edit it by hand. Routing uses `basepath` from
  `import.meta.env.BASE_URL` so the same build works behind a user-page or a
  repo-page on the same TLD.
- **3D / shiny:** `three` + `@react-three/fiber` + `@react-three/drei`
- **Tweak UI:** `lil-gui`
- **Icons:** `lucide-react`
- **Lint + format:** none. Biome was removed; there is currently no linter or
  formatter wired up. `.editorconfig` (tabs) is the only formatting hint.
- **TypeScript:** project references (`tsconfig.app.json`, `tsconfig.node.json`).
- **Styling:** CSS Modules (a vanilla-extract vs. modules decision is still open
  per the README).

## Scripts

- `npm run dev` — Vite dev server
- `npm run check` — `tsc --noEmit` typecheck
- `npm run build` — typecheck + Vite build
- `npm run build:gh-pages` — build, then copy `dist/index.html` to
  `dist/404.html` for SPA fallback on GitHub Pages
- `npm run preview` — preview the production build

Deployment to GitHub Pages is automated via a GitHub Actions workflow
(`.github/`).

## Dependency / supply-chain policy

A committed `.npmrc` sets **`min-release-age=7`**: npm refuses any package
version published less than 7 days old, so freshly-published malicious releases
age out before they can be installed. Consequences for agents:

- **Use npm >= 11.10.0** (the cooldown is silently ignored by older npm, e.g.
  the node-v11/npm-6 binary that an un-nvm'd shell may default to). This is
  pinned two ways: `.nvmrc` (node `24`, which bundles npm 11.17.x) and the
  `engines` field in `package.json` (`node >=22`, `npm >=11.10.0`). Run
  `nvm use` before working here. Note node 22 bundles npm 11.2 — too old for
  the cooldown — so npm 11.10+ is the binding requirement, hence `.nvmrc` = 24.
- When adding or updating deps, expect npm to resolve to the newest version
  that is **at least 7 days old**, not strictly the latest. This is intended —
  don't override it with `--before` hacks or by lowering the age to "get the
  latest."

## Conventions

- Follow `.editorconfig` (tabs) and match the surrounding code's style.
- Treat `routeTree.gen.ts` as build output.
- Keep `homepage` / `repository` in `package.json` accurate — the breadcrumbs
  and base-path logic lean on them.
