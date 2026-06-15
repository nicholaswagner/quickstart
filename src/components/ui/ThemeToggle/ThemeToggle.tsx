import { Moon, Sun } from "lucide-react";
import { Switch } from "radix-ui";
import { forwardRef, useEffect, useState } from "react";

import { useToggleSound } from "../../../utils/useToggleSound";
import { useTheme } from "../ThemeContext/ThemeContext";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = React.ComponentPropsWithoutRef<typeof Switch.Root>;

// Reads the appearance directly from ThemeContext so the switch stays in sync
// no matter what flips it — this toggle, or the lil-gui Theme picker.
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>((props, ref) => {
    const { theme, setTheme } = useTheme();
    const playClick = useToggleSound();

    const themeChecked = theme === "dark";
    const [checked, setChecked] = useState(themeChecked);

    useEffect(() => {
        setChecked(themeChecked);
    }, [themeChecked]);

    const handleCheckedChange = (nextChecked: boolean) => {
        setChecked(nextChecked); // animate immediately
        setTheme(nextChecked ? "dark" : "light"); // flip the theme right away
        // play on press; the sound's own `offset` config delays it if you want
        playClick(nextChecked);
    };

    return (
        <Switch.Root
            checked={checked}
            className={styles.root}
            onCheckedChange={handleCheckedChange}
            ref={ref}
            aria-label="Toggle theme"
            {...props}
        >
            <Switch.Thumb className={styles.thumb}>
                {checked ? <Moon strokeWidth={2} size={14} /> : <Sun strokeWidth={2} size={14} />}
            </Switch.Thumb>
        </Switch.Root>
    );

});