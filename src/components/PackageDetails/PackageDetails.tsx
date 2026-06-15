import { Badge, Flex, Grid, Link, Separator, Table, Text } from "@radix-ui/themes";
import { ReactNode } from "react";

import {
    config,
    keywords,
    dependencies,
    devDependencies,
    license,
    version,
} from "../../../package.json";
import { BrandMark } from "../BrandMark/BrandMark";
import styles from "./PackageDetails.module.css";
const deps = Object.keys(dependencies);
const devDeps = Object.keys(devDependencies);
const lastModified = config.last_modified;
const lastModifiedDate = new Date(lastModified * 1000).toLocaleDateString();

const tags = keywords.map((k) => (
    <Badge key={k} radius="none" className={styles.tag} size="3">
        {k}
    </Badge>
));

export const PackageDetails = () => {
    const buildTable = (title: string, data: string[]) => (
        <Table.Root size="1">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>{title}</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((item) => (
                    <Table.Row key={item}>
                        <Table.RowHeaderCell>
                            <Text
                                weight="light"
                                className={styles.mono}
                                style={{ color: "var(--grey-11)" }}
                            >
                                {item}
                            </Text>
                        </Table.RowHeaderCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );

    const buildPackageDetail = (title: string, value: string | ReactNode) => (
        <Flex direction="column" className={styles.detail}>
            <Text size="1" weight="light" align={{ initial: "center" }}>
                {title}
            </Text>
            <Text size="1" weight="bold" align={{ initial: "center" }}>
                {value}
            </Text>
        </Flex>
    );

    return (
        <Flex direction="column" px="4" py="4">
            <Flex direction={{ initial: "column" }} align={{ initial: "center" }}>
                {/* package.json [keywords]	*/}
                <Flex
                    gap={{ initial: "4" }}
                    py="4"
                    wrap={{ initial: "wrap", sm: "nowrap" }}
                    justify={{ initial: "center" }}
                >
                    {tags}
                </Flex>

                {/* package.json [META]	*/}
                <Flex
                    direction="column"
                    width="100%"
                    height="5rem"
                    mt="4"
                    align={{ initial: "center" }}
                >
                    <Separator orientation="horizontal" size="4" decorative />
                    <Flex className={styles.packageDetails}>
                        {buildPackageDetail("last modified", lastModifiedDate)}
                        <Separator
                            orientation="vertical"
                            size="4"
                            mx={{ initial: "1" }}
                            decorative
                        />
                        {buildPackageDetail("version", version)}
                        <Separator
                            orientation="vertical"
                            size="4"
                            mx={{ initial: "1" }}
                            decorative
                        />
                        {buildPackageDetail("license", license)}
                        <Separator
                            orientation="vertical"
                            size="4"
                            mx={{ initial: "1" }}
                            decorative
                        />
                        {buildPackageDetail("dependencies", deps.length.toString())}
                    </Flex>
                    <Separator orientation="horizontal" size="4" decorative />
                </Flex>
            </Flex>

            <Flex direction={{ initial: "column" }} mt="4">
                <Separator orientation="horizontal" size="4" decorative />
                <Grid columns="4" gapX="4" className={styles.dependenciesLayout}>
                    <Separator orientation="vertical" size="4" decorative />
                    {buildTable("Dependencies", deps)}
                    {buildTable("Dev-dependencies", devDeps)}
                    <Separator orientation="vertical" size="4" decorative />
                </Grid>
                <Separator orientation="horizontal" size="4" decorative />
            </Flex>

            <Flex
                direction="row-reverse"
                my={{ initial: "6" }}
                mx={{ initial: "4" }}
                wrap="wrap"
                gapX="8"
            >
                <Link href="https://www.nicholaswagner.dev" target="_blank">
                    <BrandMark variant="chonky" height="3rem" />
                </Link>
            </Flex>
        </Flex>
    );

};