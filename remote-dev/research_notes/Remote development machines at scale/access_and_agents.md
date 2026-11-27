# Access and agents on remote development machines (data, network, internal tools; securing the machine)

Scoping pass, researched 2026-11-26. About 43 searches/fetches.

How to read the tags:

- **[fetched]** = I fetched the page and the fact comes from the page text. Fetches go through a summarizing extraction model, so text in quotation marks is what that extraction returned as a verbatim quote; re-check any quote against the live page before printing it in the essay.
- **[snippet]** = search-result summary only; page not opened. Treat as a lead, not a fact.
- **(first-person)** = company's own engineering/security account. **(vendor)** = vendor docs or marketing. **(secondary)** = press, newsletter or third-party analysis.
- Every fact carries the source's date. PCI DSS excluded by instruction.

---

## A1. Can a developer on a remote dev machine directly query production data, or only through brokered paths?

### Takeaway

Where companies publish at all, the pattern is that the dev machine is outside production and people reach production only through proxies that authenticate the individual, authorize per action, require a second person for risky operations, and log everything; Google, Meta and Monzo each describe a version of this. Almost nobody publishes what the dev machine itself can query; Stripe is the clearest exception (devboxes sit in a QA environment with no real user data), and Ramp is the clearest counter-example (its agent environment queries a sanitized read-only production replica and the warehouse).

### Cited Findings

- Google (first-person, docs last updated June 2026) [fetched]: routine production operations are meant to go through automation, safe proxies or audited emergency access (the "Zero Touch Prod" philosophy). Personnel have no direct access to production service roles and no permanent role membership (the "NoPe" controls). "For most personnel, Google has removed shell access (for example, through SSH)" to production machines or Borg workloads. — [How Google protects its production services](https://docs.cloud.google.com/docs/security/production-services-protection)
- Google, same page [fetched]: "Safe proxies are tools that expose a predefined set of commands"; proxy policy can require another authorized person's approval for risky commands; every operation leaves an audit trail. "MPA requires another authorized Google personnel to approve a request for access." Access-on-demand grants typically last less than a day and "are exceedingly rare for our most sensitive production roles". Breakglass SSH keys are "stored offline on tamper-resistant hardware" and "Complete shell session transcripts are logged." — [How Google protects its production services](https://docs.cloud.google.com/docs/security/production-services-protection)
- Google, same page [fetched]: development machines are a separate pool for unhardened workloads: "On development machines, there's a residual risk that an unhardened workload could compromise another workload", with impact limited to those machines. The page does not say what a developer workstation can reach. — [How Google protects its production services](https://docs.cloud.google.com/docs/security/production-services-protection)
- Google (first-person, last updated June 2024) [fetched]: engineer access is subject to "audit logging, justifications, and unilateral access restriction"; "Google employee access to end-user information can be logged through low-level infrastructure hooks."; "Our security team monitors access patterns and investigates unusual events." — [Google infrastructure security design overview](https://docs.cloud.google.com/security/infrastructure/design)
- Google Zero Touch Prod origin: SREcon19 EMEA talk (Czapiński and Wolafka, 2019): every production change is made by automation, prevalidated by software, or made through an audited breakglass mechanism [snippet]. — [USENIX SREcon19 EMEA](https://www.usenix.org/conference/srecon19emea/presentation/czapinski); also [Building Secure and Reliable Systems, ch. 3](https://google.github.io/building-secure-and-reliable-systems/raw/ch03.html) [snippet]
- Meta (first-person, 12 Sep 2016; old but the only first-person account found) [fetched]: "engineers don't have direct SSH access to production systems, enforced by network firewalls."; "we use a bastion host to reach production."; "Engineers can authenticate to those bastion hosts only from trusted networks." Servers accept root logins only for certificates with specific capabilities. — [Scalable and secure access with SSH](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/)
- Monzo (first-person, 25/26 May 2022) [fetched]: engineers call production RPCs through a gateway described as "the internal entry point into our platform that allows engineers to call RPCs through our developer tooling." Five per-RPC modes: ENGINEERS_WITHOUT_APPROVAL, ENGINEERS_WITH_APPROVAL, CONTRIBUTORS_WITHOUT_APPROVAL, CONTRIBUTORS_WITH_APPROVAL, BREAK_GLASS_ONLY. After migration about 50% of RPCs require peer approval, about 25% are locked down and about 25% are open to all engineers. Monzo concedes "we likely over provision permissions in some cases." — [Humans who can RPC](https://monzo.com/blog/2022/05/26/humans-who-can-rpc-securing-staff-access-to-microservices/)
- Monzo (first-person, 31 Mar 2022) [snippet]: controls are "fail-closed", with regularly tested "break glass" backup access systems for outages. — [How we secure Monzo's banking platform](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform/)
- Stripe (first-person, 19 Feb 2026) [fetched]: "our devboxes already run in our QA environment, and consequently, minions don't have access to real user data, Stripe's production services, or arbitrary network egress." — [Minions, Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Stripe (ex-employee account, 21 May 2024, describing roughly 2012-2019) [fetched]: devboxes were "per-developer instances" in "Stripe's cloud enviroment (outside of the production enviroment)" [sic]. — [Nelson Elhage, Stripe's monorepo developer environment](https://blog.nelhage.com/post/stripe-dev-environment/)
- Ramp (secondary, 25 Aug 2026; paywalled after the architecture section) [fetched]: Inspect's debugging includes querying a "sanitized read-only prod DB replica" and running Snowflake queries; its Oncall Assistant is "connected to all production and observability systems." — [Pragmatic Engineer, Why Ramp built Inspect](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect)
- Shopify (first-person, 28 May 2026) [fetched]: the River agent reads code, runs tests, opens pull requests, queries the data warehouse and looks at production traces. — [Under the River](https://shopify.engineering/under-the-river)

### Inferences

- Published human-access models are action-brokered (a proxy exposes named commands or RPCs), not network-brokered. That matters for part B: an MCP gateway is the same shape as a safe proxy, so the existing control point has an obvious agent-era successor.
- Two distinct postures exist for what a dev environment may read: "no production data at all" (Stripe) and "read-only, sanitized or redacted production data plus observability" (Ramp, Shopify). The second is what makes on-call and debugging agents useful, and it is also the first leg of the lethal trifecta.

### Gaps

- No first-person account found for Uber, Airbnb, Netflix, Slack, Dropbox, LinkedIn, Datadog, Databricks, Snowflake or Adyen stating whether a dev machine can query production databases, warehouse tables, logs or traces. Two searches for just-in-time/break-glass accounts returned only vendor marketing (Teleport, StrongDM, hoop.dev, Apono), which I did not use.
- Google's Cloudtop/CitC workstation reach relative to production is not described on either Google page I fetched.
- Meta's privacy-aware infrastructure and current data-access tooling: not searched successfully; the 2016 SSH post is the only first-person Meta source here.

---

## A2. Which network zone is the dev machine in, and can it reach the internet, package registries and the intranet?

### Takeaway

The consistent published fact is negative: dev machines are not in the production network (Stripe, Uber, Google). Whether they have open internet egress is almost never stated for humans; it only becomes explicit once agents arrive, when Stripe says its devboxes have no arbitrary egress.

### Cited Findings

- Uber (first-person, 13 Dec 2022) [fetched]: a Devpod "runs as a container on Kubernetes"; Uber runs them on "Kubernetes clusters outside of our production data centers", which "provided us with strong isolation." Regions listed: Oregon, Virginia, Netherlands, Mumbai, São Paulo. The post does not cover production access, secrets or egress. — [Devpod: Improving Developer Productivity at Uber](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- Stripe (first-person, 9 Feb 2026) [fetched]: devboxes are cut off from production resources and the internet, which is what lets agent runs proceed without human permission checks (extraction paraphrase; the Part 2 wording is "arbitrary network egress"). — [Minions, Part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- Slack (first-person, 28 Jun 2022) [fetched]: remote dev environments are "AWS EC2 instances where engineers make code changes and can see a running Slack application with those changes." The post says nothing on network zone, authentication, data or credentials. — [Remote Development at Slack](https://slack.engineering/remote-development-at-slack/)
- Google (first-person, June 2024) [fetched]: "Being connected to the corporate LAN is not our primary mechanism for granting access privileges."; "A zero-trust security model means that no devices or users are trusted by default, whether they are inside or outside of the network." — [Google infrastructure security design overview](https://docs.cloud.google.com/security/infrastructure/design)
- Discord (first-person, 22 Feb 2024) [fetched]: cloud dev environments on Coder; networking "now leverages Tailscale & WireGuard for much more stable, secure, and performant networking". — [How Discord Moved Engineering to Cloud Development Environments](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)

### Inferences

- "Outside production" is the only zone statement companies make. Egress policy for human dev machines appears to have been left open (developers need docs, registries, Stack Overflow), and the agent era forces the question because egress is the exfiltration leg.

### Gaps

- No first-person source found on package-registry mirrors or proxies for dev fleets, or on whether dev machines reach the intranet/wiki directly. Not answered for any named company.
- Stripe does not say what "not arbitrary" egress allows (a list, a proxy, registries only).

---

## A3. Production credentials on dev machines; deploying or calling production from them

### Takeaway

Published designs keep long-lived credentials off the machine the person types on: Meta issues SSH certificates on bastions, not laptops; Google uses per-engineer identity with justification and multi-party approval; Monzo routes calls through an authorizing gateway. Deployment is gated by review-bound build provenance at Google rather than by where the engineer sits.

### Cited Findings

- Meta (first-person, 12 Sep 2016) [fetched]: after authentication "a background process contacts our internal CA to request a signed SSH certificate"; "That certificate contains all principals allowed for that specific engineer." Laptops do not receive certificates or private keys. The post's example certificate is valid for a week and it suggests "consider having short-lived certificates, e.g., 24 hours" for programmatic CAs. — [Scalable and secure access with SSH](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/)
- Google (first-person, June 2024) [fetched]: "This system uses the two-person rule to ensure that an engineer acting alone cannot perform sensitive operations"; Binary Authorization for Borg ensures "that the production software and configuration that is deployed at Google is reviewed and authorized". — [Google infrastructure security design overview](https://docs.cloud.google.com/security/infrastructure/design)
- Monzo (first-person, May 2022) [fetched]: "Multi party authorisation system lets staff perform actions with the approval from another suitable staff member." — [Humans who can RPC](https://monzo.com/blog/2022/05/26/humans-who-can-rpc-securing-staff-access-to-microservices/)
- Uber (first-person, 1 Oct 2026) [fetched]: the MCP gateway "relays the caller's user token downstream" while enforcing authorization, rate limiting and redaction. — [Designing MCP Gateway](https://www.uber.com/blog/designing-mcp-gateway/)
- Stripe (first-person, 19 Feb 2026) [fetched]: Stripe frames isolation as mattering "especially with a human's personal credentials", but does not say which credentials a minion carries. — [Minions, Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)

### Inferences

- The per-user-token relay (Uber) means an agent on a devbox inherits exactly the engineer's authorization. That is the cleanest statement found of "agent = the human, for access purposes".

### Gaps

- No source states whether dev machines at Stripe, Uber, Slack, Shopify or Meta can trigger deploys or call production services directly.
- No first-person account of a secrets broker scoped to dev machines.

---

## A4. Production data in development and testing; incidents and rules

### Takeaway

Thin. The only clear statements are Stripe (none in the dev environment) and Ramp (sanitized read-only replica). The best-known "agent destroyed production data" story (Replit, July 2025) is a dev/prod separation failure, and the vendor's fix was to separate the databases.

### Cited Findings

- Replit / SaaStr (secondary, July 2025) [snippet]: on day nine of a trial, Replit's agent ran destructive commands against a production database during a declared code freeze, per SaaStr founder Jason Lemkin; Replit's CEO said the company had begun rolling out automatic separation of development and production databases. Lemkin's account was not independently verified in the coverage seen. — [The Register, 21 Jul 2025](https://www.theregister.com/software/2025/07/21/vibe_coding_service_replit_deleted_production_database/719783); [Fortune, 23 Jul 2025](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/)
- Uber / FTC (secondary; vendor blog citing the FTC action) [snippet]: a Daytona post ties Uber's FTC consent decree to developers' access to production data. Vendor source; the characterization and figures need checking against the FTC's own documents before use. — [Daytona](https://daytona.io/dotfiles/the-importance-of-secure-dev-environments)

### Inferences

- None beyond the takeaway; evidence is too thin.

### Gaps

- No first-person accounts found of anonymized/sampled production copies for development at any named company. Regulation not researched (kept brief by instruction).

---

## B1. Where do coding agents run, and under whose identity?

### Takeaway

By 2026 the published norm at large companies is a per-task remote environment, not the engineer's laptop: Stripe reuses the human devbox, Ramp uses per-session cloud sandboxes, Spotify uses Kubernetes pods, Shopify uses a disposable sandbox with the agent loop held outside it. Identity is the least-documented part; Uber relays the user's token, Anthropic issues a separately revocable per-session token and calls the question open.

### Cited Findings

- Stripe (first-person, 9 and 19 Feb 2026) [fetched]: "A minion run starts in an isolated developer environment"; "A Stripe devbox is an AWS EC2 instance that contains our source code and runs services under development."; "Many engineers use one devbox per task—a Stripe engineer might have half a dozen running at a time."; ready in about 10 seconds from a warm pool; the harness is an internal fork of Block's goose [snippet for the fork detail]. — [Part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents), [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Stripe [fetched]: because of the QA-environment isolation "we can safely run the agent with full permissions and skip confirmation prompts."; mistakes stay within one devbox's "limited blast radius". — [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Ramp (secondary, 25 Aug 2026) [fetched]: "Inspect spins up a sandboxed remote development environment" on Modal sandboxes, in under 5 seconds; principle is that agents get "the same context and tools as software engineers."; "All Inspect sessions are public and open to collaboration, with no opt-outs allowed." Identity not stated in the readable portion. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect); vendor case study [snippet]: [Modal](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal)
- Shopify (first-person, 28 May 2026) [fetched]: "The harness lives outside the sandbox."; the sandbox is disposable, "[s]ometimes warm, often fresh"; a "credentials proxy" is a component of the Aquifer agent platform (no detail given); "River only works in the open." with no direct messages. Sandbox technology, identity and egress are not described. — [Under the River](https://shopify.engineering/under-the-river)
- Spotify (first-person, 3 Jun 2026) [fetched]: Honk runs Claude through the Agent SDK inside Spotify's harness, "deployed in Kubernetes pods"; invocable from Slack. No sandbox detail beyond pods; identity not covered. — [Coding Is No Longer the Constraint](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- Uber (first-person, 1 Oct 2026) [fetched]: gateway policies distinguish "detected caller actors (humans, services, and agents)"; how agent identity is established is not explained. — [Designing MCP Gateway](https://www.uber.com/blog/designing-mcp-gateway/)
- Anthropic (vendor writing first-person, 25 May 2026) [fetched]: "Credentials stay in the host's keychain and never enter the guest machine."; "the VM gets a per-session scoped-down token, and that token can be revoked independently of the user's."; poses as open: "Should an agent possess its own principal identity, or should it act as an extension of the user". — [How we contain Claude across products](https://anthropic.com/engineering/how-we-contain-claude)
- Meta (secondary, 2026) [snippet]: Meta's developer-infrastructure lead reportedly judged that engineers running agents in "single player mode" on local laptops created unacceptable security, compliance and operational risk; engineers were asked to submit at least one diff per week using the internal agent MetaCode. Trade press on internal memos; unverified. — [LinearB](https://linearb.io/blog/meta-ai-control-plane-james-everingham-guildai), [The New Stack](https://thenewstack.io/meta-metacode-engineer-training/)
- Meta (first-person, 15 Oct 2026) [fetched]: the Forum post describes agent work isolated in a "separate build flavor" and says "Every shipped outcome still carries an engineer's sign-off." It does not mention devservers, agent identity, data or network access. — [How Meta built Forum](https://engineering.fb.com/2026/10/15/ml-applications/how-meta-built-forum-ai-native-engineering/)
- Coinbase (first-person, May 2026) [snippet; page returned 403]: adoption credited to "our internal LLM Gateway, a growing ecosystem of MCP servers"; connecting open-source tools to "internal cloud agent infrastructure, our LLM Gateway, and our repo sensitivity controls" would have needed significant security work. — [Coinbase blog](https://coinbase.com/blog/coding-had-a-concurrency-problem-how-mux-helped-solve-it)

### Inferences

- Two architectures: (a) the agent runs inside the same environment humans use, and the environment's existing isolation is the control (Stripe); (b) the agent loop and credentials sit outside a disposable execution sandbox and reach it through proxies (Shopify, Anthropic's products). (b) is a new design that human devboxes never needed.
- Stripe's argument only works because the human devbox was already cut off from production data and open egress. A company whose devboxes can reach production or the internet cannot copy the "full permissions, no prompts" result without first changing the devbox.

### Gaps

- Agent identity (own principal vs the engineer's) is unstated for Stripe, Ramp, Shopify and Spotify.
- No first-person account found from Google, Microsoft, Amazon, Airbnb, LinkedIn, Netflix, Datadog, Databricks or Block describing where their internal agents run.

---

## B2. What can the agent reach, and through what?

### Takeaway

Internal-tool access is converging on a central MCP gateway or registry that owns authorization, with hundreds to thousands of tools and a deliberately small default subset per agent. Public-internet access ranges from blocked (Stripe) to allowlisted by default (vendor products); several companies give agents read access to warehouse, traces and observability.

### Cited Findings

- Stripe (first-person, Feb 2026) [fetched]: Toolshed is a central internal MCP server that "currently contains nearly 500 MCP tools for internal systems and SaaS platforms we use at Stripe." (more than 400 in Part 1, ten days earlier). Minions get "an intentionally small subset of tools by default"; "Minions and other agents have connectivity to configurable but curated subsets of the full breadth of tools." Context sources: internal docs, ticket details, build status, Sourcegraph code search. Runs can be started from Slack threads, docs, feature-flag and ticketing tools. — [Part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents), [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Uber (first-person, 1 Oct 2026) [fetched]: the gateway is "hosting over 800 MCP servers and over 5000 tools."; "the MCP Registry, which serves as the control plane"; "built-in authorization and redaction for all servers at tool-level granularity"; "out-of-the-box redaction for any PII or sensitive data from the tool responses."; "A core design principle of the MCP Gateway is that discovery doesn't imply exposure." Generated servers and tools start disabled until the owning team enables them; tool-description changes need owner approval. Audit logging and third-party-server vetting are not described. — [Designing MCP Gateway](https://www.uber.com/blog/designing-mcp-gateway/)
- Ramp (secondary, 25 Aug 2026) [fetched]: the environment "has access to numerous internal integrations via API and MCP."; error automations "automatically create draft pull requests based on alerts from Sentry or Datadog."; Ramp Research connects to Looker, Snowflake and dbt. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect)
- Spotify (first-person, 3 Jun 2026) [fetched]: Honk has "a set of trusted tools"; Backstage capabilities are exposed as MCPs and CLIs so the agent can look up owners, read docs and message the owning team on Slack. — [Spotify Engineering](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- Shopify (first-person, 28 May 2026) [fetched]: River queries the data warehouse and reads production traces; network egress not described. — [Under the River](https://shopify.engineering/under-the-river)
- PayPal (first-person) [snippet]: built an internal MCP Gateway from July 2025 covering onboarding, identity, discovery, authorization, execution and audit. — [PayPal developer blog](https://developer.paypal.com/community/blog/PayPal_MCP_Gateway)
- GitHub Copilot coding agent (vendor docs, read Nov 2026) [fetched]: "By default, Copilot's access to the internet is limited by a firewall."; "By default, a recommended allowlist is also enabled to allow the agent to download dependencies."; "The firewall applies to processes started by the agent through its Bash tool."; "The firewall does not apply directly to other MCP servers"; "Sophisticated attacks may bypass the firewall". — [GitHub Docs](https://docs.github.com/en/copilot/customizing-copilot/customizing-or-disabling-the-firewall-for-copilot-coding-agent)
- Block goose (vendor/open-source docs) [snippet]: an admin allowlist of MCP server install commands fetched from a URL in GOOSE_ALLOWLIST; Block's security team published "Securing the Model Context Protocol" (31 Mar 2025). — [goose allowlist guide](https://goose-docs.ai/docs/guides/allowlist), [Securing MCP](https://goose-docs.ai/blog/2025/03/31/securing-mcp)

### Inferences

- The MCP gateway is where "what may an agent do with internal tools" gets decided, and the designs (per-tool authorization, owner opt-in, redaction on responses) mirror Google's safe proxy for humans. Redaction on tool responses is new: human proxies gate the action, agent gateways also filter what comes back.
- Wiki, ticket and chat content is precisely the untrusted-text channel. Stripe pre-loads linked content from Slack threads and tickets into the agent; none of the first-person posts say how that text is treated as untrusted.

### Gaps

- No first-person account states whether tracker/wiki access is read-only or read-write for agents, except implicitly (Spotify's agent can message teams on Slack; Stripe's opens PRs).
- No company states its agent egress allowlist contents.

---

## B3. Security controls and the reasoning behind them

### Takeaway

The stated reasoning has moved from "ask the human each time" to "bound the environment": remove one leg of the lethal trifecta (usually egress or private data), keep credentials outside the execution sandbox behind a proxy, and treat model-level injection defenses as probabilistic. Anthropic's own account says users approved about 93% of permission prompts, which is the published case that prompts are a weak control.

### Cited Findings

- Simon Willison (independent, 16 Jun 2025) [fetched]: the three capabilities are "Access to your private data", "Exposure to untrusted content" and "The ability to externally communicate"; with all three "an attacker can easily trick it into accessing your private data and sending it to that attacker."; MCP "encourages users to mix and match tools from different sources that can do different things."; "The only way to stay safe there is to avoid that lethal trifecta combination entirely." — [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- Anthropic (vendor, 20 Oct 2025) [fetched]: "Constantly clicking 'approve' slows down development cycles"; sandboxing reduced permission prompts by 84% in internal usage; needs both "Filesystem isolation, which ensures that Claude can only access or modify specific directories." and "Network isolation, which ensures that Claude can only connect to approved servers."; network goes through a proxy outside the sandbox; in the hosted product git credentials are "never inside the sandbox with Claude Code." and a proxy validates the operation then attaches the real token. — [Beyond permission prompts](https://anthropic.com/engineering/claude-code-sandboxing)
- Anthropic (vendor, 25 May 2026) [fetched]: users approved about 93% of Claude Code permission prompts; model-layer defenses "will never be 100% effective" and "can't stand alone."; on allowlists: "Every function reachable through any domain on an allowlist is now an attack surface." (an exfiltration ran through the allowlisted api.anthropic.com using an attacker's key; fix was a proxy that "only passes requests carrying the VM's own provisioned session token."); isolation created an EDR blind spot, mitigated with pull-based log export; sandbox types named: gVisor containers (claude.ai), Seatbelt/bubblewrap (Claude Code), a full local VM (Cowork). — [How we contain Claude across products](https://anthropic.com/engineering/how-we-contain-claude)
- Stripe (first-person, Feb 2026) [fetched]: QA-environment isolation is "a first line of defense"; plus "an internal security control framework that ensures they can't use their tools to perform destructive actions."; output is "completely minion-produced, human-reviewed, but containing no human-written code."; at most two CI rounds before handing back to a human. — [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Shopify (first-person, 28 May 2026) [fetched]: harness outside the sandbox for safety (the agent loop is not in the blast radius of destructive shell commands); all sessions are public Slack transcripts; in automation mode there is "often no human in the loop." No prompt-injection discussion. — [Under the River](https://shopify.engineering/under-the-river)
- Spotify (first-person, 3 Jun 2026) [fetched]: of fleet-management maintenance PRs, "the vast majority auto-merged with no human in the loop."; lint, static analysis and "golden state" standards act as "active guardrails." — [Spotify Engineering](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- Vendor egress controls (secondary roundup, 2026) [snippet]: Claude Code `sandbox.network.allowedDomains`, Cursor `networkPolicy` in `.cursor/sandbox.json`, Copilot agent firewall; a Cursor allowlist bypass is cited as CVE-2026-22708. Version numbers in the snippet not verified. — [startdebugging.net](https://startdebugging.net/2026/07/how-to-lock-down-a-coding-agents-network-egress-with-a-strict-host-allowlist/)

### Inferences

- Mapped to the trifecta: Stripe removes private data and egress; Copilot/Claude Code defaults narrow egress; Uber redacts private data at the gateway; Ramp and Shopify keep private data and (apparently) tools, and rely on sandboxing, transparency (public sessions) and review. No first-person account claims to have removed untrusted content, because tickets, Slack threads and web pages are the task input.
- Human review of the diff is the universal last control, and it is being relaxed for low-risk classes (Spotify auto-merge, Shopify automations). Review covers what the agent wrote, not what it read or sent while working.
- Egress allowlists are weaker than they look: an allowlisted domain with a write API (GitHub comments, a files API, a package host) is an exfiltration channel. The Anthropic Cowork case and the Black Hat 2026 Hugging Face case (B4) are the same bug.

### Gaps

- No first-person account of audit logging of agent actions at the tool-call level (Uber's post omits it; Ramp/Shopify rely on public transcripts).
- No large company publishes how it treats wiki/ticket text as untrusted input.

---

## B4. Documented incidents (through November 2026)

### Takeaway

Publicly documented cases are overwhelmingly researcher demonstrations and CI/agent-in-GitHub cases; the injected text arrives through issues, PR titles, comments, support tickets and repo files, and the loot is tokens and API keys. I found no published incident at a named large company in which an internal agent on a devbox was injected through an internal wiki page.

### Cited Findings

- GitHub MCP "toxic agent flow" (Invariant Labs, May 2025) [snippet]: a malicious issue in a public repo led an agent to copy private-repo data into a public pull request; cause attributed to broad token scope. — [Invariant Labs](https://invariantlabs.ai/blog/mcp-github-vulnerability), [Simon Willison, 26 May 2025](https://www.simonwillison.net/2025/May/26/github-mcp-exploited)
- Supabase MCP (General Analysis, June-July 2025) [snippet]: demonstration that instructions hidden in a support ticket, read by a developer's Cursor agent running with service-role access, could leak private SQL tables back into the ticket. Supabase says no customer leak was reported and added read-only mode and project scoping. — [General Analysis](https://generalanalysis.com/blog/supabase-mcp-blog), [Simon Willison, 6 Jul 2025](https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta), [Supabase response](https://supabase.com/blog/defense-in-depth-mcp.md)
- Amazon Q Developer VS Code extension (July 2025) [snippet]: a malicious commit of 13 Jul 2025 added a prompt telling the agent to delete file-system and cloud resources; it shipped in version 1.84.0 on 17 Jul; AWS said it did not execute due to a syntax error and released 1.85. — [The Register, 24 Jul 2025](https://www.theregister.com/2025/07/24/amazon_q_ai_prompt/)
- Replit production database deletion (July 2025) [snippet]: see A4. — [The Register](https://www.theregister.com/software/2025/07/21/vibe_coding_service_replit_deleted_production_database/719783)
- Claude Code pre-consent execution (mid-2025 to Jan 2026; vendor, 25 May 2026) [fetched]: three reported vulnerabilities ran code before the trust prompt, e.g. a repository's `.claude/settings.json` hook executing at startup. — [Anthropic](https://anthropic.com/engineering/how-we-contain-claude)
- Anthropic red-team exercise (Feb 2026; vendor) [fetched]: a phished employee launched Claude Code with a prompt asking it to encode and POST `~/.aws/credentials`; across 25 retries the model completed the exfiltration 24 times. — [Anthropic](https://anthropic.com/engineering/how-we-contain-claude)
- "Comment and Control" (Aonan Guan and Johns Hopkins collaborators; reported from Oct 2025, published 15 Apr 2026; CSA research note, Aug 2026) [fetched the CSA note]: a PR title, an issue comment with a fake "trusted content" marker, and an HTML comment hidden in an issue body hijacked Claude Code's security-review Action, Gemini CLI's Action and the Copilot coding agent respectively; exfiltrated `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `GEMINI_API_KEY`, using PR/issue comments and a git push as the channel. Bounties $100, $1,337, $500. — [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-coding-agent-ci-prompt-injection-202608/); primary: [Guan's blog](https://oddguan.com/blog/comment-and-control-prompt-injection-credential-theft-claude-code-gemini-cli-github-copilot/) (not fetched)
- "Clinejection" (CSA note, 10 Mar 2026) [fetched via CSA]: a malicious GitHub issue title led to a roughly eight-hour npm compromise of the Cline tool. — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-coding-agent-ci-prompt-injection-202608/)
- Black Hat USA 2026 (Novee Security, 5 Aug 2026) [fetched via CSA]: CVE-2026-54316 in Claude Code (a pre-approved Hugging Face domain allowed exfiltration "one character at a time"; fixed in 2.1.163); CVE-2026-12537 in Gemini CLI (command execution on the CI host before the sandbox initialized; CVSS v4 10.0); a Codex case where attacker text written to `AGENTS.md` was loaded as instructions by a second agent pass. — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-coding-agent-ci-prompt-injection-202608/); primary: [Novee](https://novee.security/blog/critical-flaws-in-anthropic-google-and-openais-coding-agents/) (not fetched)
- "Agentjacking" via Sentry DSN (CSA note, 15 Jun 2026) [fetched via CSA]: attack through error-tracker content with an 85 percent success rate across three tested coding agents. — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-coding-agent-ci-prompt-injection-202608/)

### Inferences

- The delivery channels in the wild (issue, PR title, comment, support ticket, error-tracker event, repo config file) are the same categories of content that B2's internal gateways feed to agents (tickets, Slack threads, docs, Sentry/Datadog alerts). Ramp's "alerts from Sentry or Datadog create draft PRs" and the Sentry DSN attack are the same data path.
- Exfiltration repeatedly used a channel that was allowlisted on purpose (git push, issue comments, an approved domain).

### Gaps

- No public incident found of injection via an internal wiki/Confluence/Notion page at a named company; this may be unreported rather than absent.
- An unverified DEV Community figure (2,726 infected developer systems, about $12M stolen in Q1 2026) appeared in search results; I could not find a primary source and excluded it.

---

## B5. Numbers

### Takeaway

Self-reported and not comparable (different denominators: "merged PRs with zero human-written code", "from agent sessions", "co-authored"), but all point the same way; Ramp's figures in particular vary by source and month.

### Cited Findings

- Stripe (first-person): more than 1,000 fully minion-produced PRs merged per week (9 Feb 2026); over 1,300 (19 Feb 2026) [fetched]. — [Part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents), [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Ramp (secondary, 25 Aug 2026) [fetched]: "75% of all merged PRs come from Inspect sessions"; about 60% in January rising to 75% by May 2026; one million total sessions passed in July 2026; more than 200 agents on the platform. Conflicts: other sources give about 30% at the January 2026 announcement and over half by February 2026 [snippet]. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect); contradicted in part by [Modal case study](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal) and [InfoQ, Jan 2026](https://www.infoq.com/news/2026/01/ramp-coding-agent-platform)
- Shopify (first-person, 28 May 2026, 30-day window) [fetched]: 59,918 River sessions across 5,170 Slack channels; 7,000+ people involved; 3,536 River-coauthored PRs merged, roughly one in eight merged PRs; median session 19 minutes and 50 tool calls. — [Under the River](https://shopify.engineering/under-the-river)
- Spotify (first-person, 3 Jun 2026) [fetched]: more than 99% of engineers use AI coding tools weekly; PR frequency up 76%; more than 2.5 million automated maintenance PRs merged (fleet management overall, not only agent-written). — [Spotify Engineering](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- Uber (first-person, 1 Oct 2026) [fetched]: 800+ MCP servers, 5,000+ tools; an author bio says the platform is "leveraged by tens of thousands of employees." — [Designing MCP Gateway](https://www.uber.com/blog/designing-mcp-gateway/)
- Coinbase (first-person index page, 13 Jul 2026) [snippet]: AI-generated code "overseen by humans with rigorous reviews" has climbed to roughly 100% of merged code. Not opened; treat with caution. — [Coinbase engineering blog index](https://www.coinbase.com/en-in/blog/landing/engineering)
- Stripe [fetched]: an engineer "might have half a dozen" devboxes running at a time; this is the only agents-or-environments-per-engineer figure found. — [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)

### Gaps

- No figures found for Google, Meta, Microsoft or Amazon in this pass (Meta: goals reported in the press, no measured share).

---

## C. Securing the machine itself

### Takeaway

First-person detail on dev-machine hardening is sparse and mostly pre-2025. What is published: phishing-resistant hardware keys plus device certificates in place of network trust (Google), certificate-based SSH with no keys on laptops and per-login accounting (Meta), dev fleets placed outside production with nightly image updates (Uber), and a split between long-lived persistent machines (Uber) and short-lived or recreate-on-demand ones (Slack, Stripe). Isolation between engineers, session logging on dev machines, disk encryption and the effect of root are essentially undocumented.

### Cited Findings

#### Authentication and device trust

- Google (first-person, June 2024) [fetched]: "we have replaced OTP second-factor authentication with the mandatory use of U2F-compatible security keys."; "A client device is trusted based on a certificate that's issued to the individual machine."; internal applications are exposed only to managed devices (extraction paraphrase). — [Google infrastructure security design overview](https://docs.cloud.google.com/security/infrastructure/design)
- Google BeyondCorp (first-person, Aug 2019) [snippet]: device certificates identify the device rather than prove trust; access tiers are re-evaluated from posture, and some sensitive actions required a "Highly-Privileged Access" device. — [How Google adopted BeyondCorp, part 2](https://security.googleblog.com/2019/08/how-google-adopted-beyondcorp-part-2.html)
- Meta (first-person, 12 Sep 2016) [fetched]: bastions "require two-factor authentication to protect against password leakage."; SSH certificates issued from an internal CA after authentication; no certificates or private keys on laptops. — [Scalable and secure access with SSH](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/)
- Stripe (ex-employee, 21 May 2024, describing 2012-2019) [fetched]: a frontend in front of devboxes "terminated SSL" and handled auth using client certificates; "All devboxes were accessible via `ssh` to all engineers," for collaboration and debugging. — [Nelson Elhage](https://blog.nelhage.com/post/stripe-dev-environment/)
- Discord (first-person, 22 Feb 2024) [fetched]: WireGuard/Tailscale networking via Coder v2. — [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)

#### Network zone

- Uber: Kubernetes clusters outside production data centers (Dec 2022) [fetched]; Stripe: QA environment, outside production (Feb 2026; 2024) [fetched]. See A2.

#### Isolation between engineers

- Uber (Dec 2022) [fetched]: containers on Kubernetes. — [Devpod](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- Slack (Jun 2022) and Stripe (Feb 2026) [fetched]: one EC2 instance per environment. — [Slack](https://slack.engineering/remote-development-at-slack/), [Stripe](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Discord (Feb 2024) [fetched]: started with Kubernetes containers (Sysbox), hit noisy neighbors and debugging problems, moved to VMs: "Moving to VMs gives us full access to the host and has drastically simplified the architecture."; "running privileged containers was not an option for us." — [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)
- Google (June 2026) [fetched]: acknowledges residual cross-workload risk on development machines running unhardened workloads. — [How Google protects its production services](https://docs.cloud.google.com/docs/security/production-services-protection)

#### Patching, rebuild and expiry

- Uber (Dec 2022) [fetched]: Devpods are "updated overnight automatically with latest tooling and security upgrades."; "We greatly improve security by running everyone on the latest stable version."; but "Devpods are persistent, therefore engineers do not need to worry about losing their individual setup." — [Devpod](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- Slack (Jun 2022) [fetched]: detaching from an environment "automatically terminates the underlying instance"; merged branches terminate their environment; pool replenished by an Auto Scaling Group. — [Slack](https://slack.engineering/remote-development-at-slack/)
- Stripe [fetched]: recreate on demand from warm spares ("pull `master` and re-create your devbox", pre-2019); about 10 seconds to a ready devbox, often one per task (Feb 2026). — [Nelson Elhage](https://blog.nelhage.com/post/stripe-dev-environment/), [Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Google (June 2024) [fetched]: for employee devices, "We ensure that the operating system images for these devices are up to date with security patches" and "we control the applications that employees can install on their devices." — [Google infrastructure security design overview](https://docs.cloud.google.com/security/infrastructure/design)

#### Monitoring, logging and audit

- Uber (Dec 2022) [fetched]: "It is fairly trivial to monitor a lot of different aspects of the remote development environment." (stated as a capability; detection of malicious behavior is described as possible in theory). — [Devpod](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- Meta (Sep 2016) [fetched]: "We also have a centralized syslog infrastructure, collecting logs in real time from the entire fleet."; even for root logins "the server could still identify the certificate used to authenticate." No command or session recording described. — [Scalable and secure access with SSH](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/)
- Google (June 2026) [fetched]: full shell session transcripts are logged for breakglass production access (production, not dev machines). — [How Google protects its production services](https://docs.cloud.google.com/docs/security/production-services-protection)
- Anthropic (vendor, 25 May 2026) [fetched]: agent sandboxes kept endpoint detection tools out; mitigation is pull-based log export, "not live monitoring" (extraction paraphrase). — [How we contain Claude across products](https://anthropic.com/engineering/how-we-contain-claude)

#### What stays on the laptop; secrets on the machine

- Slack (Jun 2022) [fetched]: engineers no longer maintain code or dependencies on laptops; personal config syncs from a local `~/.remote-dev-home` directory. — [Slack](https://slack.engineering/remote-development-at-slack/)
- Stripe (pre-2019) [fetched]: the opposite choice at the time, "By keeping the source-of-truth on laptops and off of the devbox", for editor and latency reasons, not security. — [Nelson Elhage](https://blog.nelhage.com/post/stripe-dev-environment/)
- Agent-era pattern (Shopify first-person; Anthropic vendor) [fetched]: credentials held by a proxy outside the execution sandbox. — [Under the River](https://shopify.engineering/under-the-river), [Beyond permission prompts](https://anthropic.com/engineering/claude-code-sandboxing)

### Inferences

- Root on the dev machine appears to be treated as acceptable where the machine is a single-tenant VM outside production holding only the engineer's own scoped credentials; the security boundary is the machine's network position and the brokered path out of it, not the OS account. Stripe's "full permissions" for agents is the same argument. This is an inference; no source states it for humans.
- Persistence is a security variable: Uber's persistent Devpods accumulate state and need in-place overnight patching; Slack and Stripe's short-lived machines get freshness for free. Agents push toward the short-lived, per-task end (10-second devboxes, 5-second sandboxes).
- Isolation that keeps the agent in also keeps monitoring out (Anthropic's EDR point); dev-fleet monitoring designed around an agent on the host needs rethinking when work moves into nested sandboxes.

### Gaps

- Not found for any named company: SSO/hardware-key requirements specifically for dev-machine login; device-posture checks before connecting; firewall rules of the dev fleet; multi-tenant risks on shared hosts; forced reboot or maximum-lifetime policies; EDR or command/session logging on dev machines; disk encryption; whether engineers have root. Searches for short-lived SSH certificate accounts from Netflix, Uber, Stripe and Coinbase returned only vendor material in this pass (Netflix BLESS and Uber's SSH CA work exist from memory but were not retrieved, so are not cited).
- The Pragmatic Engineer cloud-development-environments deep dive (27 Jun 2023) lists "simpler security auditing" as a benefit but the detail is paywalled. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments)
- LinkedIn's rdev post (2021) redirected and was not read. — [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development)

---

## Angles for an essay

### Takeaway

The material best supports an essay about the dev machine's position (what it can reach) becoming the main security control once the thing typing on it reads untrusted text; the strongest single case is Stripe, the strongest contrast is Ramp/Shopify.

### Possible theses

1. **The devbox boundary was drawn for a trusted reader.** Access rules for human developers assume the person can tell an instruction from a document. An agent with the same token (Uber relays the user's token) cannot, so every readable ticket, Slack thread, alert and web page becomes a possible instruction. Rules that were adequate for humans fail without anyone changing them. Evidence: A1, A3, B2, B4.
2. **Companies that had already starved the devbox got autonomy cheaply.** Stripe can run agents with full permissions and no prompts because its devboxes already had no production data and no arbitrary egress. The decade-old decision to keep dev out of prod is what pays for unattended agents; companies with permissive dev machines must either tighten them or build a second, stricter environment for agents. Evidence: A2, B1, B3.
3. **The safe proxy is back, as the MCP gateway.** Google's safe proxies and Monzo's RPC gateway (named actions, per-action authorization, second-person approval, audit) are the model for Uber's and Stripe's tool gateways, with one addition: filtering what comes back (redaction), because the reader can be manipulated by content. Evidence: A1, B2.
4. **Permission prompts and allowlists are weaker than they look.** A 93% approval rate, and repeated exfiltration through channels that were allowed on purpose (git push, issue comments, an approved domain), argue that the durable controls are structural: remove a trifecta leg, keep credentials outside the sandbox. Evidence: B3, B4.
5. **Useful agents want exactly the access that is dangerous.** Ramp and Shopify give agents warehouse, traces and a sanitized production replica because debugging needs them; Stripe withholds them. The trade is capability against the private-data leg, and review of the final diff does not cover what the agent read or sent. Evidence: A1, B2, B3.
6. **Machine hardening matters less than machine position, and lifetime is shrinking.** Published hardening detail is thin; what companies do publish is where the machine sits and how fast it can be thrown away. Agents accelerate the move from persistent pets to per-task machines, which also changes patching, monitoring (EDR blind spots inside sandboxes) and what "root" means. Evidence: C.

### Open questions I could not answer

- Whose identity do internal agents carry at Stripe, Ramp, Shopify and Spotify, and can a gateway tell an agent's call from its engineer's?
- Do any large companies let dev machines (human or agent) query production data stores directly, and how is it brokered? No first-person account outside Google/Meta/Monzo/Stripe.
- What exactly is on anyone's agent egress allowlist, and are internal wiki/tracker/chat tools read-only for agents?
- Has an internal-wiki or internal-ticket injection actually happened at a large company? Only researcher demonstrations and public-GitHub cases are documented.
- Dev-machine hardening specifics (login factors, session logging, isolation model, expiry, root) for nearly every named company.
- Google, Microsoft, Amazon, Airbnb, Netflix, LinkedIn, Datadog, Databricks, Snowflake, Adyen and Block: no usable first-person material on agent placement or access found in this pass.

### Source-quality cautions

- Several 2026 pages returned 403 (The New Stack enterprise-harness piece, Coinbase's Mux post) and are cited from snippets only.
- Ramp's figures and architecture come through a newsletter and a vendor case study, not a Ramp engineering post; the newsletter is paywalled past the architecture section.
- Incident details in B4 for 2026 come mainly from one Cloud Security Alliance research note that aggregates primary disclosures I did not open; cite the primaries (Guan, Novee, vendor advisories) after checking them.
