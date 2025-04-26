import GUI from "lil-gui";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./LilGuiProvider.module.css";

interface lilContext {
	gui: GUI | null;
	container: HTMLDivElement | null;
}

export const LilGuiContext = createContext<lilContext | undefined>({
	container: null,
	gui: null,
});

interface LilGuiProviderProps {
	children: ReactNode;
	id?: string;
}

export const LilGuiProvider = ({
	children,
	id = "lil-container",
}: LilGuiProviderProps) => {
	const divRef = useRef<HTMLDivElement | null>(null);
	const guiRef = useRef<GUI | null>(null);
	const [gui, setGui] = useState<GUI | null>(null);

	useEffect(() => {
		if (divRef.current && !guiRef.current) {
			guiRef.current = new GUI({
				container: divRef.current,
				closeFolders: true,
				title: "Style Debugger",
			});
			guiRef.current.close();
			setGui(guiRef.current);
		}
		return () => {
			if (guiRef.current) {
				guiRef.current.destroy();
				guiRef.current = null;
			}
		};
	}, []);

	const context = { gui: guiRef.current, container: divRef.current };

	return (
		<LilGuiContext.Provider value={context}>
			<div className={styles.LilContainer} id={id} ref={divRef} />
			{children}
		</LilGuiContext.Provider>
	);
};

export const useLilGui = (): lilContext => {
	const context = useContext(LilGuiContext);
	if (!context) throw new Error();
	return context;
};
