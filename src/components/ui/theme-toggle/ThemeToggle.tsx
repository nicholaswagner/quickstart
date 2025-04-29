import { Moon, Sun } from "lucide-react";
import { Switch } from "radix-ui";
import { forwardRef, useEffect, useRef, useState } from "react";

import { useTheme } from "../ThemeContext/ThemeContext";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = React.ComponentPropsWithoutRef<typeof Switch.Root>;

// Reads the appearance directly from ThemeContext so the switch stays in sync
// no matter what flips it — this toggle, or the lil-gui Theme picker.
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>((props, ref) => {
    const { theme, toggleTheme } = useTheme();
    // const checked = theme === "dark";

    const themeChecked = theme === "dark";
    const [checked, setChecked] = useState(themeChecked);
    const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(undefined);

    useEffect(() => {
        setChecked(themeChecked);
    }, [themeChecked]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCheckedChange = (nextChecked: boolean) => {
        setChecked(nextChecked); // animate immediately
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            toggleTheme(); // change theme later
            timeoutRef.current = undefined;
        }, 400);
    };

    return (
        <Switch.Root
            checked={checked}
            className={styles.Root}
            onCheckedChange={handleCheckedChange}
            ref={ref}
            aria-label="Toggle theme"
            {...props}
        >
            <Switch.Thumb className={styles.Thumb}>
                {checked ? <Moon strokeWidth={2} size={14} /> : <Sun strokeWidth={2} size={14} />}
            </Switch.Thumb>
        </Switch.Root>
    );

});