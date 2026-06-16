import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "@radix-ui/themes/styles.css";

import "./main.css";
import { Glow } from "./components/Glow/Glow";
import { ThemeProvider } from "./components/ui/ThemeContext/ThemeContext";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree, basepath: import.meta.env.BASE_URL });

// Shared TanStack Query client. The 30s staleTime means revisiting a page within
// that window serves cached data instantly (no refetch) — see src/pages/QueryExample.
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 30 } },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// non-null assertion: if it's not there we'll know it
const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <Glow />
                    <RouterProvider router={router} />
                </ThemeProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}