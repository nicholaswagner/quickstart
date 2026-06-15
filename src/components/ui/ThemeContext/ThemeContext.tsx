import { Theme, type ThemeProps } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
    theme: ThemeMode;
    themeProps: ThemeProps;
    accentColor: AccentColor;
    accentColors: readonly AccentColor[];
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    setAccentColor: (accent: AccentColor) => void;
}

export const accentColors = [
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

export type AccentColor = (typeof accentColors)[number];

const randomAccent = (): AccentColor =>
    accentColors[Math.floor(Math.random() * accentColors.length)];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [colorScheme, setColorScheme] = useState<ThemeMode | null>(null);
    const [accentColor, setAccentColor] = useState<AccentColor>(randomAccent);

    useEffect(() => {
        const stored = localStorage.getItem("theme") as ThemeMode | null;
        const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

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
        accentColor,
        grayColor: "auto",
        panelBackground: "translucent",
        scaling: "90%",
        radius: "full",
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: colorScheme,
                themeProps,
                accentColor,
                accentColors,
                setTheme,
                toggleTheme,
                setAccentColor,
            }}
        >
            <Theme {...themeProps}>{children}</Theme>
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;

};