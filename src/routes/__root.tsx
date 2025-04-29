import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { LilGuiProvider } from "../components/ui/lil-gui-provider/LilGuiProvider";
import { ThemePicker } from "../components/ui/theme-toggle/ThemePicker";

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

	useEffect(() => {
		const storedState = {
			showGui: Boolean(localStorage.getItem("showGui")),
			showDev: Boolean(localStorage.getItem("showDev")),
		};
		if (enabledDevTools !== storedState) setEnabledDevTools(storedState);
	}, [location.searchStr]);

	let result = <Outlet />;
	if (showGui) {
		result = (
			<LilGuiProvider>
				<ThemePicker />
				{result}
			</LilGuiProvider>
		);
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
