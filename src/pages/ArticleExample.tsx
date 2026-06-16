import { Badge, Blockquote, Card, Code, Flex, Heading, Separator, Text } from "@radix-ui/themes";

import { Link } from "../components/ui/Link/Link";
import styles from "./ArticleExample.module.css";

export function ArticleExample() {
	return (
		<Flex direction="column" gap="5" py="6">
			<Heading size="7" className={styles.title}>
				Building with Radix Themes
			</Heading>

			<Flex align="center" gap="3" wrap="wrap">
				<Badge color="blue" variant="soft">Radix UI</Badge>
				<Badge color="green" variant="soft">React</Badge>
				<Badge color="gray" variant="soft">Design Systems</Badge>
			</Flex>

			<Separator size="4" />

			<article className={styles.article}>
				<Heading as="h2" size="5">
					Introduction
				</Heading>

				<Text size="3" color="gray">
					Radix Themes provides a comprehensive set of styled, accessible components
					built on top of Radix Primitives. It gives you a cohesive design system out of
					the box while remaining flexible enough to customize.
				</Text>

				<Heading as="h2" size="5">
					Core Principles
				</Heading>

				<Text as="p" size="3" color="gray">
					The library follows several key principles that make it effective for building
					production applications:
				</Text>

				<ul className={styles.list}>
					<li>
						<Text size="3" color="gray">
							<Code>asChild</Code> composition for semantic HTML
						</Text>
					</li>
					<li>
						<Text size="3" color="gray">
							CSS custom properties for theme tokens
						</Text>
					</li>
					<li>
						<Text size="3" color="gray">
							Built-in dark mode support through the Theme component
						</Text>
					</li>
					<li>
						<Text size="3" color="gray">
							Accessible keyboard navigation and ARIA attributes by default
						</Text>
					</li>
				</ul>

				<Heading as="h2" size="5">
					Getting Started
				</Heading>

				<Text as="p" size="3" color="gray">
					Install the package and import the global stylesheet once at your app root:
				</Text>

				<Card size="1" className={styles.codeBlock}>
					<Code>npm install @radix-ui/themes</Code>
				</Card>

				<Heading as="h2" size="5">
					Theme Configuration
				</Heading>

				<Text as="p" size="3" color="gray">
					Wrap your application with the <Code>Theme</Code> component to provide
					theming context. You can customize the accent color, gray scale, radius,
					and scaling:
				</Text>

				<CodeBlock
					code={`import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme
      accentColor="indigo"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      {/* Your app */}
    </Theme>
  );
}`}
				/>

				<Heading as="h2" size="5">
					Color Scale
				</Heading>

				<Text as="p" size="3" color="gray">
					Radix Colors uses a 12-step scale where lower steps are for backgrounds and
					higher steps are for text. This ensures consistent contrast ratios across
					light and dark modes:
				</Text>

				<Blockquote>
					Steps 1–2 for page backgrounds, steps 9–10 for solid fills, and steps 11–12
					for text. The scale adapts automatically to the active appearance.
				</Blockquote>

				<Heading as="h2" size="5">
					Why It Matters
				</Heading>

				<Text as="p" size="3" color="gray">
					Using a consistent design system reduces cognitive load for both developers
					and users. Instead of debating whether a border should be <Code>#ddd</Code> or{" "}
					<Code>#e0e0e0</Code>, you reach for <Code>var(--gray-6)</Code> and move on.
				</Text>

				<Separator size="4" />

				<Flex justify="end">
					<Link to="/">Back to home</Link>
				</Flex>
			</article>
		</Flex>
	);
}

const CodeBlock = ({ code }: { code: string }) => (
	<Card size="1" className={styles.codeBlock}>
		<pre className={styles.pre}>
			<code>{code}</code>
		</pre>
	</Card>
);
