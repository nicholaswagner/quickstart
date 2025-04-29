import { Link, Flex, Text, FlexProps, Heading, Separator } from "@radix-ui/themes";

import styles from "./About.module.css";

export const About = (props?: FlexProps) => (
    <Flex
        direction="column"
        align={{ initial: "center", sm: "start" }}
        className={styles.about}
        {...props}
    >
        <Flex
            direction="column"
            p={{ initial: "4" }}
            py="8"
            mx="0"
            className={styles.about}
            align={{ initial: "center" }}
        >
            <Heading size="9" weight="bold" align={{ initial: "center" }}>
                &nbsp;a React & Typescript Github Pages bootstrap&nbsp;
            </Heading>

            <Separator orientation="horizontal" size="3" my="4" />

            <Text size="5" weight="regular" align={{ initial: "center" }}>
                This deploys to{" "}
                <Link href="https://www.nicholaswagner.dev/quickstart" target="_blank">
                    nicholaswagner.dev/quickstart
                </Link>{" "}
                when I push a new git-commit.
            </Text>
            <Text>All the meta details on this page come from the package.json</Text>
        </Flex>
    </Flex>

);