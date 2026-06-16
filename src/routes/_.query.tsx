import { createFileRoute } from "@tanstack/react-router";

import { QueryExample } from "../pages/QueryExample/QueryExample";

type QuerySearch = {
	repo?: string;
};

// Lives under the `_` layout, so it gets the NavBar + Container. Reachable at /query.
// `validateSearch` types the ?repo= param so the page can read/write it safely.
export const Route = createFileRoute("/_/query")({
	component: QueryExample,
	validateSearch: (search: Record<string, unknown>): QuerySearch => {
		const repo = typeof search.repo === "string" ? search.repo.trim() : "";
		return repo ? { repo } : {};
	},
});
