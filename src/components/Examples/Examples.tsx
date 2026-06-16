import { Card, Flex, FlexProps, Grid, Heading, Text } from "@radix-ui/themes";
import { Link as RouterLink } from "@tanstack/react-router";
import { ArrowUpRight, Database, Waves } from "lucide-react";
import type { ReactNode } from "react";

import styles from "./Examples.module.css";

// Inner content shared by every example card.
const CardBody = ({
	icon,
	title,
	description,
}: {
	icon: ReactNode;
	title: string;
	description: string;
}) => (
	<Flex direction="column" gap="2">
		<Flex align="center" justify="between">
			<Flex align="center" gap="2">
				{icon}
				<Text weight="bold">{title}</Text>
			</Flex>
			<ArrowUpRight size={16} className={styles.arrow} />
		</Flex>
		<Text size="2" color="gray">
			{description}
		</Text>
	</Flex>
);

// Each router <Link> is a block-level wrapper around a <Card>, so the whole card
// is clickable and basepath + client-side navigation are handled for us.
export const Examples = (props?: FlexProps) => (
	<Flex direction="column" gap="4" {...props}>
		<Heading size="5" weight="bold">
			Examples
		</Heading>
		<Grid columns={{ initial: "1", sm: "2" }} gap="4">
			<RouterLink to="/query" className={styles.cardLink}>
				<Card size="2" className={styles.card}>
					<CardBody
						icon={<Database size={18} />}
						title="TanStack Query"
						description="Live data fetching with caching, loading & error states."
					/>
				</Card>
			</RouterLink>

			<RouterLink
				to="/templates/$"
				params={{ _splat: "fullscreen-demo" }}
				className={styles.cardLink}
			>
				<Card size="2" className={styles.card}>
					<CardBody
						icon={<Waves size={18} />}
						title="Fullscreen demo"
						description="A pointer-reactive ASCII ripple field — a fullscreen page template."
					/>
				</Card>
			</RouterLink>
		</Grid>
	</Flex>
);
