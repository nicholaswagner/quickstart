import { Badge, Button, Card, Code, Flex, Grid, Heading, Link, Separator, Spinner, Text, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

// Shape of the bits we use from GitHub's GET /repos/{owner}/{repo} response.
type Repo = {
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	subscribers_count: number;
	open_issues_count: number;
};

const DEFAULT_REPO = "TanStack/query";
const routeApi = getRouteApi("/_/query");

async function fetchRepo(repo: string): Promise<Repo> {
	const res = await fetch(`https://api.github.com/repos/${repo}`);
	// React Query treats a thrown error as the error state — so surface bad responses.
	if (!res.ok) throw new Error(`GitHub API responded ${res.status} ${res.statusText}`);
	return res.json();
}

// Simple TanStack Query example: fetches a GitHub repo (driven by the ?repo= URL
// param, defaulting to TanStack/query), with loading / error / success states, a
// manual refetch, and a background-fetch indicator. Because the queryKey tracks
// the URL param, each repo is cached independently and the page is shareable.
export const QueryExample = () => {
	const { repo } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const activeRepo = repo ?? DEFAULT_REPO;

	// keep the input in sync with the URL (handles back/forward and shared links)
	const [input, setInput] = useState(activeRepo);
	useEffect(() => setInput(activeRepo), [activeRepo]);

	const { data, isPending, isError, error, isFetching, refetch, dataUpdatedAt } = useQuery({
		queryKey: ["repo", activeRepo],
		queryFn: () => fetchRepo(activeRepo),
	});

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		const next = input.trim();
		// write the repo to the URL; drop the param when it's empty or the default
		navigate({ search: next && next !== DEFAULT_REPO ? { repo: next } : {} });
	};

	return (
		<Flex direction="column" gap="4" py="6" px={{ initial: "4" }}>
			<Flex align="center" justify="between" wrap="wrap" gap="3">
				<Heading size="6">TanStack Query — simple example</Heading>
				<Button onClick={() => refetch()} disabled={isFetching} variant="soft">
					<Spinner loading={isFetching} />
					Refetch
				</Button>
			</Flex>

			<Text size="2" color="gray">
				Fetches a GitHub repo with <Code>useQuery</Code>, keyed off the <Code>?repo=</Code>
				URL param (default <Code>{DEFAULT_REPO}</Code>). Try another <Code>owner/repo</Code>
				below — the URL updates, so the result is shareable and each repo is cached.
			</Text>

			<form onSubmit={handleSubmit}>
				<Flex gap="2" align="center">
					<TextField.Root
						value={input}
						onChange={(event) => setInput(event.target.value)}
						placeholder="owner/repo (e.g. facebook/react)"
						aria-label="GitHub repository"
						style={{ flex: 1 }}
					/>
					<Button type="submit">Load</Button>
				</Flex>
			</form>

			<Separator size="4" />

			{isPending && (
				<Flex align="center" gap="2">
					<Spinner />
					<Text color="gray">Loading repository…</Text>
				</Flex>
			)}

			{isError && (
				<Card>
					<Flex direction="column" gap="1">
						<Text weight="bold" color="red">
							Couldn’t load the repo
						</Text>
						<Text size="2" color="gray">
							{error.message}
						</Text>
						<Text size="1" color="gray">
							GitHub limits unauthenticated requests to 60/hour — if you hit that, this
							is the error state doing its job.
						</Text>
					</Flex>
				</Card>
			)}

			{data && (
				<Card size="3">
					<Flex direction="column" gap="3">
						<Flex align="center" gap="2" wrap="wrap">
							<Link href={data.html_url} target="_blank" size="5" weight="bold">
								{data.full_name}
							</Link>
							{isFetching && (
								<Badge color="amber" variant="soft">
									updating
								</Badge>
							)}
						</Flex>

						{data.description && <Text color="gray">{data.description}</Text>}

						<Grid columns={{ initial: "2", sm: "4" }} gap="3">
							<Stat label="Stars" value={data.stargazers_count} />
							<Stat label="Forks" value={data.forks_count} />
							<Stat label="Watchers" value={data.subscribers_count} />
							<Stat label="Open issues" value={data.open_issues_count} />
						</Grid>

						<Text size="1" color="gray">
							Last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
						</Text>
					</Flex>
				</Card>
			)}
		</Flex>
	);
};

const Stat = ({ label, value }: { label: string; value: number }) => (
	<Flex direction="column">
		<Text size="6" weight="bold">
			{value.toLocaleString()}
		</Text>
		<Text size="1" color="gray">
			{label}
		</Text>
	</Flex>
);
