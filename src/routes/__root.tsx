import { Container } from "@radix-ui/themes";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Nav } from "../components/Nav";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Container size="3">
				<Nav />
				<Outlet />
			</Container>
			<TanStackRouterDevtools />
		</>
	);
}
