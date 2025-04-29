import { createFileRoute } from "@tanstack/react-router";
import { FullscreenDemo } from "../../components/page-templates/FullscreenDemo";

export const Route = createFileRoute("/templates/$")({
	component: RouteComponent,
});

function RouteComponent() {
	return <FullscreenDemo />;
}
