import { Badge, Blockquote, Card, Code, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

import { Link } from "../../components/ui/Link/Link";
import styles from "./ArticleExample.module.css";

// --- small building blocks (keep the body DRY) ---

const Prose = ({ children }: { children: ReactNode }) => (
	<Text as="p" size="3" color="gray">
		{children}
	</Text>
);

const CodeBlock = ({ code }: { code: string }) => (
	<Card size="1">
		<pre className={styles.pre}>
			<code>{code}</code>
		</pre>
	</Card>
);

// Sections live in one place so the table of contents and the headings stay in
// sync (and anchor ids never drift).
const SECTIONS = [
	{ id: "structure", title: "Structure is hard for small models" },
	{ id: "cloud", title: "What the cloud hides" },
	{ id: "lever", title: "The local lever: constrain the sampler" },
	{ id: "scope", title: "Tighten the grammar to the step" },
	{ id: "semantics", title: "Structure is not semantics" },
	{ id: "takeaway", title: "Takeaway" },
] as const;

const SectionHeading = ({ id, title }: { id: string; title: string }) => (
	<Heading as="h2" size="5" id={id}>
		{title}
	</Heading>
);

// String.raw so backslashes in the grammar/code survive verbatim.
const GRAMMAR = String.raw`# tool-call.gbnf — the model may only emit a valid call to one of two tools
root   ::= "{" ws "\"tool\":" ws tool "," ws "\"args\":" ws object ws "}"
tool   ::= "\"search\"" | "\"read_file\""
object ::= "{" ws (pair ("," ws pair)*)? ws "}"
pair   ::= string ":" ws value
value  ::= string | number
string ::= "\"" ([^"\\] | "\\" .)* "\""
number ::= "-"? [0-9]+ ("." [0-9]+)?
ws     ::= [ \t\n]*`;

const PYTHON = String.raw`from llama_cpp import Llama, LlamaGrammar

llm = Llama(model_path="qwen2.5-7b-instruct-q4.gguf", n_ctx=8192)
grammar = LlamaGrammar.from_file("tool-call.gbnf")

out = llm.create_completion(
    prompt=agent_prompt,
    grammar=grammar,      # decoding is masked to the grammar
    temperature=0.2,
    max_tokens=256,
)

call = json.loads(out["choices"][0]["text"])  # guaranteed to parse`;

export const ArticleExample = () => (
	<Flex direction="column" gap="5" py="6" className={styles.page}>
		<Heading size="7" className={styles.title}>
			Constrained decoding: the local agent&rsquo;s quiet superpower
		</Heading>

		<Text size="2" color="gray">
			Nicholas Wagner · June 16, 2026 · 6 min read
		</Text>

		<Flex align="center" gap="3" wrap="wrap">
			<Badge color="iris" variant="soft">
				Local LLMs
			</Badge>
			<Badge color="green" variant="soft">
				Agents
			</Badge>
			<Badge color="gray" variant="soft">
				llama.cpp
			</Badge>
		</Flex>

		<Separator size="4" />

		<article className={styles.article}>
			<Prose>
				When you wire an agent against a hosted model, the provider does a lot of
				invisible work to make tool calls come back as valid JSON. Run the same loop
				against a 7B model on your own GPU and the illusion breaks: it invents tool
				names, drops a closing brace, or wraps the call in a chatty preamble. The fix
				isn&rsquo;t a bigger prompt — it&rsquo;s giving up the assumption that you can only
				influence the model through text.
			</Prose>

			<SectionHeading {...SECTIONS[0]} />
			<Prose>
				An agent loop lives or dies on one thing: every turn, the model must emit
				something your code can parse and dispatch. Large hosted models are reliable
				enough that you can paper over the occasional malformed call with a retry.
				Small local models fail often enough that retries dominate your latency budget —
				and some failures, like a hallucinated tool name, can&rsquo;t be retried away,
				because the model is confidently wrong.
			</Prose>

			<SectionHeading {...SECTIONS[1]} />
			<Prose>
				Hosted tool-calling APIs aren&rsquo;t just prompting the model nicely. Under the
				hood they constrain decoding to a schema, validate, and often re-ask — all
				server-side. You send a tool definition; you get back well-formed arguments.
				That convenience also hides the mechanism, so it&rsquo;s easy to assume
				&ldquo;tool calling&rdquo; is a model capability rather than a sampling-time
				guarantee.
			</Prose>

			<SectionHeading {...SECTIONS[2]} />
			<Prose>
				Running locally, you own the token sampler — and that&rsquo;s the whole game.
				With llama.cpp you can attach a <Code>GBNF</Code> grammar that masks the logits
				at every step, so only tokens that keep the output valid are even eligible.
				Malformed JSON becomes structurally impossible, not merely unlikely:
			</Prose>

			<CodeBlock code={GRAMMAR} />

			<Prose>
				Bind that grammar to a completion and the model can only return one of your two
				tools with a JSON object of arguments — no preamble, no markdown fence, no third
				tool it wishes existed:
			</Prose>

			<CodeBlock code={PYTHON} />

			<SectionHeading {...SECTIONS[3]} />
			<Prose>
				The temptation is to write one grammar for &ldquo;a tool call&rdquo; and reuse it
				forever. You get far more mileage by narrowing the grammar to what&rsquo;s valid{" "}
				<em>right now</em>. If a tool takes an enum, encode the enum as literal
				alternatives; if the model just listed three files, constrain the next path to
				exactly those three. The tighter the grammar, the less room a small model has to
				wander. On Ollama the same idea shows up as the <Code>format</Code> parameter,
				which accepts a JSON schema instead of hand-written GBNF.
			</Prose>

			<SectionHeading {...SECTIONS[4]} />
			<Prose>
				Here&rsquo;s the catch worth internalizing: a grammar guarantees the{" "}
				<em>shape</em> of the answer, never its correctness. The model can still emit{" "}
				<Code>{`{"tool":"read_file","args":{"path":"/etc/shadow"}}`}</Code> — perfectly
				valid, possibly wrong or unsafe. Constrained decoding moves the failure mode from
				&ldquo;my parser threw&rdquo; to &ldquo;the model chose badly,&rdquo; which is the
				failure you actually want, because it&rsquo;s catchable in code.
			</Prose>

			<Blockquote>
				Constrain the structure with the sampler; constrain the meaning with your code.
				The grammar gets you a call you can trust to <em>parse</em> — not one you can
				trust to be <em>right</em>.
			</Blockquote>

			<SectionHeading {...SECTIONS[5]} />
			<Prose>
				The nuance that separates local agent workflows from cloud ones isn&rsquo;t model
				size — it&rsquo;s access. You can reach into the sampler. Treat constrained
				decoding as a first-class part of the loop, scope each grammar to the current
				step, and keep a real validation layer after parsing. A 7B model with a tight
				grammar will out-agent a much larger model you can only reach through prose.
			</Prose>

			<Separator size="4" />

			<Flex justify="end">
				<Link to="/">Back to home</Link>
			</Flex>
		</article>
	</Flex>
);
