import { Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { useLocation, useRouter } from "@tanstack/react-router";
import { Route, SlidersHorizontal } from "lucide-react";

import styles from "./DevToolsToggle.module.css";
// Visibility of lil-gui / router devtools is driven by the presence of the
// `showGui` / `showDev` flags in the URL (see routes/__root.tsx). We push a
// bare key (e.g. `?showGui`) when on and drop it when off — the value carries
// no meaning, only presence does. The router's object-based `navigate` can't
// emit a bare key (URLSearchParams always writes `key=value`), so we build the
// search string by hand and push it through the router's history, preserving
// any other params and the basepath baked into the current pathname.
type Flag = "showGui" | "showDev";

const isPresent = (searchStr: string, key: Flag) =>
    searchStr
        .replace(/^\?/, "")
        .split("&")
        .some((token) => token === key || token.startsWith(`${key}=`));

export const DevToolsToggle = () => {
    const router = useRouter();
    const { searchStr } = useLocation();

    const showGui = isPresent(searchStr, "showGui");
    const showDev = isPresent(searchStr, "showDev");

    const toggle = (key: Flag) => {
        // Read from the live URL (not the router's `searchStr`, which canonicalizes
        // a bare `showGui` into `showGui=`) so existing flags stay bare.
        const current = window.location.search.replace(/^\?/, "");
        const tokens = current.split("&").filter(Boolean);
        const without = tokens.filter((token) => token !== key && !token.startsWith(`${key}=`));
        // nothing removed => the flag was absent, so add it
        const next = without.length === tokens.length ? [...tokens, key] : without;
        const search = next.length ? `?${next.join("&")}` : "";
        router.history.push(`${window.location.pathname}${search}${window.location.hash}`);
    };

    return (
        <Flex align="center" gap="3">
            <Tooltip content={showGui ? "Hide lil-gui" : "Show lil-gui"}>
                <IconButton
                    size="2"
                    variant={showGui ? "solid" : "soft"}
                    aria-pressed={showGui}
                    aria-label="Toggle lil-gui panel"
                    onClick={() => toggle("showGui")}
                >
                    <SlidersHorizontal size={16} />
                </IconButton>
            </Tooltip>
            <Tooltip
                className={styles.tooltip}
                content={showDev ? "Hide router devtools" : "Show router devtools"}
            >
                <IconButton
                    size="2"
                    variant={showDev ? "solid" : "soft"}
                    aria-pressed={showDev}
                    aria-label="Toggle TanStack Router devtools"
                    onClick={() => toggle("showDev")}
                >
                    <Route size={16} />
                </IconButton>
            </Tooltip>
        </Flex>
    );

};