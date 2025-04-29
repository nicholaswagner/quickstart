// pre-commit hook logic (TypeScript).
//
// Run by the shim that scripts/install-hooks.ts writes into
// .git/hooks/pre-commit, as `node <this file>`. Node strips the types at
// runtime (Node >= 22.18) — no build step.
//
// Stamps package.json's `config.last_modified` with the current Unix time
// (seconds since epoch) and stages it, so the value is part of THIS commit.
//
// Note: this stages all of package.json — unstaged edits there get included.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

try {
	const root = execSync("git rev-parse --show-toplevel", {
		encoding: "utf8",
	}).trim();
	const file = `${root}/package.json`;

	const pkg = JSON.parse(readFileSync(file, "utf8"));
	pkg.config ??= {};
	pkg.config.last_modified = Math.floor(Date.now() / 1000);

	writeFileSync(file, `${JSON.stringify(pkg, null, "\t")}\n`);
	execSync(`git add "${file}"`, { stdio: "ignore" });
} catch (error) {
	// non-fatal: log and leave package.json untouched, never block the commit
	console.error(
		"pre-commit: could not stamp package.json:",
		(error as Error).message,
	);
}
