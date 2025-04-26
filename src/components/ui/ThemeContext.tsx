import { Theme, type ThemeProps } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextInterface {
	theme: ThemeMode;
	themeProps: ThemeProps;
	setTheme: (theme: ThemeMode) => void;
	toggleTheme: () => void;
}

const accentColors = [
	"gray",
	"gold",
	"bronze",
	"brown",
	"yellow",
	"amber",
	"orange",
	"tomato",
	"red",
	"ruby",
	"crimson",
	"pink",
	"plum",
	"purple",
	"violet",
	"iris",
	"indigo",
	"blue",
	"cyan",
	"teal",
	"jade",
	"green",
	"grass",
	"lime",
	"mint",
	"sky",
] as const;

const ThemeContext = createContext<ThemeContextInterface | undefined>(
	undefined,
);

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [colorScheme, setColorScheme] = useState<ThemeMode | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("theme") as ThemeMode | null;
		const systemPrefersDark = window.matchMedia?.(
			"(prefers-color-scheme: dark)",
		).matches;

		if (stored) {
			setColorScheme(stored);
		} else {
			const colorScheme = systemPrefersDark ? "dark" : "light";
			setColorScheme(colorScheme);
			localStorage.setItem("theme", colorScheme);
		}
	}, []);

	useEffect(() => {
		if (!colorScheme) return;
		localStorage.setItem("theme", colorScheme);
	}, [colorScheme]);

	const setTheme = (mode: ThemeMode) => {
		setColorScheme(mode);
		localStorage.setItem("theme", mode);
	};

	const toggleTheme = () => {
		setTheme(colorScheme === "light" ? "dark" : "light");
	};

	if (!colorScheme) return null;

	const themeProps: ThemeProps = {
		appearance: colorScheme,
		accentColor:
			accentColors[Math.floor(Math.random() * accentColors.length - 1)],
		grayColor: "auto",
		panelBackground: "translucent",
		scaling: "95%",
		radius: "full",
	};

	return (
		<ThemeContext.Provider
			value={{ theme: colorScheme, themeProps, setTheme, toggleTheme }}
		>
			<Theme
				appearance={colorScheme}
				accentColor={
					accentColors[Math.floor(Math.random() * accentColors.length - 1)]
				}
				grayColor="auto"
				panelBackground="translucent"
				scaling="95%"
				radius="full"
			>
				{children}
			</Theme>
		</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextInterface => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
};
