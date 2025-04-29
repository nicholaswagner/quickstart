import {
	Badge,
	Flex,
	Grid,
	Heading,
	Link,
	Separator,
	Table,
	Text,
} from "@radix-ui/themes";

import { dependencies, devDependencies, repository } from "../../package.json";

const deps = Object.keys(dependencies);
const devDeps = Object.keys(devDependencies);
const gitRepoUrl = repository.url.slice(4).replace(".git", "");

export const PackageDetails = () => {
	const buildTable = (title: string, data: string[]) => (
		<Table.Root size="1">
			<Table.Header>
				<Table.Row>
					<Table.ColumnHeaderCell>
						<Badge>{title}</Badge>
					</Table.ColumnHeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{data.map((item) => (
					<Table.Row key={item}>
						<Table.RowHeaderCell>
							<Text>{item}</Text>
						</Table.RowHeaderCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);

	return (
		<Grid columns={{ initial: "1", md: "2" }} gap="5">
			<Flex direction="column">
				<Heading size="4" mb="2" align={{ initial: "center", md: "left" }}>
					Yet another{" "}
					<Link href={`${gitRepoUrl}`} target="_blank">
						github-template repo
					</Link>
					.
				</Heading>
				<Text weight="light" size="2" align={{ initial: "center", md: "left" }}>
					There are many like it, but this one is mine.
				</Text>
				<Separator orientation="horizontal" size="4" my="5" />⠀
			</Flex>
			<Flex direction="column">
				<Text mb="5" align={{ initial: "center", md: "left" }}>
					If you're curious, here's what's in the current{" "}
					<Link href={`${gitRepoUrl}/blob/main/package.json`}>
						package.json
					</Link>
				</Text>

				<Grid columns="2" gap="7">
					{buildTable("dependencies", deps)}
					{buildTable("devDependencies", devDeps)}
				</Grid>
			</Flex>
		</Grid>
	);
};
