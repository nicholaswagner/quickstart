import { createFileRoute } from "@tanstack/react-router";

import { ArticleExample } from "../pages/ArticleExample/ArticleExample";

// Lives under the `_` layout, so it gets the NavBar + Container. Reachable at /article.
export const Route = createFileRoute("/_/article")({
	component: ArticleExample,
});
