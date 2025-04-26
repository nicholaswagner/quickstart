import { Moon, Sun } from "lucide-react";
import { Switch } from "radix-ui";
import { forwardRef } from "react";
import { useTheme } from "../ThemeContext";
import styles from "./styles.module.css";

interface ThemeToggleProps
	extends React.ComponentPropsWithoutRef<typeof Switch.Root> {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
	({ checked, onCheckedChange, ...props }, ref) => {
		const { toggleTheme } = useTheme();

		const handleChange = (value: boolean) => {
			if (value !== checked) {
				toggleTheme();
				onCheckedChange(value);
			}
		};

		return (
			<Switch.Root
				checked={checked}
				className={styles.Root}
				onCheckedChange={handleChange}
				ref={ref}
				{...props}
			>
				<Switch.Thumb className={styles.Thumb}>
					{checked ? (
						<Moon strokeWidth={2} size={14} />
					) : (
						<Sun strokeWidth={2} size={14} />
					)}
				</Switch.Thumb>
			</Switch.Root>
		);
	},
);
