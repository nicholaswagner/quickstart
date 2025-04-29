import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { LilGuiProvider } from "../components/ui/lil-gui-provider/LilGuiProvider";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const location = useLocation();
	const showGui = location.searchStr.includes("showGui");
	const showDev = location.searchStr.includes("showDev");

	const [enabledDevTools, setEnabledDevTools] = useState<{
		showGui: boolean;
		showDev: boolean;
	}>({ showGui: false, showDev: false });

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const storedState = {
			showGui: Boolean(localStorage.getItem("showGui")),
			showDev: Boolean(localStorage.getItem("showDev")),
		};
		if (enabledDevTools !== storedState) setEnabledDevTools(storedState);
	}, [location.searchStr]);

	let result = <Outlet />;
	if (showGui) {
		result = <LilGuiProvider>{result}</LilGuiProvider>;
	}
	if (showDev) {
		result = (
			<>
				<TanStackRouterDevtools />
				{result}
			</>
		);
	}
	return result;
}
