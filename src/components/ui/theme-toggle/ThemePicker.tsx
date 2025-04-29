import { useEffect } from "react";
import { useLilGui } from "../lil-gui-provider/LilGuiProvider";
import { type AccentColor, useTheme } from "../ThemeContext/ThemeContext";

// Registers a "Theme" folder in lil-gui (shown when `?showGui` is active) so the
// current theme can be picked from the accent-color list and toggled
// light/dark. Mounted inside LilGuiProvider in routes/__root.tsx.
export const ThemePicker = () => {
	const { gui } = useLilGui();
	const { theme, accentColor, accentColors, setTheme, setAccentColor } =
		useTheme();

	// deps intentionally limited to `gui`: lil-gui owns the control state once
	// created, and the gui instance is stable for the provider's lifetime.
	useEffect(() => {
		if (!gui) return;

		gui.title("Debug Controls");
		const settings = { accent: accentColor, appearance: theme };
		const folder = gui.addFolder("Theme");

		folder
			.add(settings, "accent", [...accentColors])
			.name("Accent")
			.onChange((value: AccentColor) => setAccentColor(value));

		folder
			.add(settings, "appearance", ["light", "dark"])
			.name("Appearance")
			.onChange((value: "light" | "dark") => setTheme(value));

		gui.open();
		folder.open();


		return () => {
			folder.destroy();
		};
	}, [gui]);

	return null;
};
