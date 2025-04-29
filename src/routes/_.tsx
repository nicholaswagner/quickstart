import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Container } from "@radix-ui/themes";
import { NavBar } from "../components/ui/NavBar/NavBar";

export const Route = createFileRoute("/_")({
	component: RouteComponent,
});

/**
 *
 * Think of this as the catch-all template wrapper for the app
 * This will add the Navigation, include any child routes, and right now adds the tanstack router devtools
 */

function RouteComponent() {
	return (
		<>
			<Container size="3">
				<NavBar />
				<Outlet />
			</Container>
		</>
	);
}
