import { createFileRoute } from "@tanstack/react-router";

import { About } from "../components/About/About";
import { Description } from "../components/Description/Description";
import { PackageDetails } from "../components/PackageDetails/PackageDetails";

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
            <Description mx={{ initial: "4" }} mt={{ initial: "9" }} />
            <About mt={{ initial: "9" }} />
            <PackageDetails />
        </>
    );

}