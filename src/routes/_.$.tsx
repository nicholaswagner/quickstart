import { Separator } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { PackageDetails } from "../components/PackageDetails";
import { Snark } from "../components/Snark/Snark";

export const Route = createFileRoute("/_/$")({
	component: RouteComponent,
});

/**
 *
 * Think of this as the catch-all 'homepage' template that uses the catch-all layout template.
 */

function RouteComponent() {
	return (
		<>
			<Snark />
			<Separator orientation="horizontal" size="4" my="5" />
			<PackageDetails />
		</>
	);
}
