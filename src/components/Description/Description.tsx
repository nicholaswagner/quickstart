import { Flex, Heading, FlexProps, Em, Link } from "@radix-ui/themes";

import { name } from "../../../package.json";
import { ModifiedAt } from "../ui/ModifiedAt/ModifiedAt";
import styles from "./Description.module.css";

export const Description = (props?: FlexProps) => (
    <Flex
        direction={{ initial: "column" }}
        align={{ initial: "center", sm: "start" }}
        className={styles.noSelect}
        {...props}
    >
        <ModifiedAt />
        <Heading size="9" weight="bold">
            <Em>{name}</Em>
        </Heading>
        <Heading size="4" weight="regular" mt="4">
            <Em>Yet another front-end github template-repo.</Em>
        </Heading>
        <Link href="https://www.nicholaswagner.dev/quickstart" target="_blank">
            nicholaswagner.dev/quickstart
        </Link>
    </Flex>

);