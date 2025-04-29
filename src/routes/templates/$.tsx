import { createFileRoute } from "@tanstack/react-router";
import { RippleField } from "../../components/page-templates/RippleField";

export const Route = createFileRoute("/templates/$")({
	component: RouteComponent,
});

function RouteComponent() {
	const { _splat } = Route.useParams();
	return <RippleField label={_splat} />;
}
