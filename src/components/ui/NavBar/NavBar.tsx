import { Flex, Link } from "@radix-ui/themes";

import { BrandMark } from "../../BrandMark/BrandMark";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { DevToolsToggle } from "../DevToolsToggle/DevToolsToggle";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import styles from "./NavBar.module.css";

export const NavBar = () => (
    <Flex direction="row" justify="between" align="center" gapX="6" px={{ initial: "4" }} mt="4">
        <Flex align="center" gap="6">
            <Link href="https://www.nicholaswagner.dev" target="_blank">
                <BrandMark variant="chonky" className={styles.brand} />
            </Link>

            <Breadcrumbs />
        </Flex>

        <Flex align="center" gap="4">
            <DevToolsToggle />
            <ThemeToggle />
        </Flex>
    </Flex>

);