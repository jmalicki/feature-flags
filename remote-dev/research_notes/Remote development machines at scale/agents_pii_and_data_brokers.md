# Data brokers, redaction and DLP for coding and data agents (2025-2026)

Research date: 27 Nov 2026. Extends access_and_agents.md (Part B), testimony_agents.md and read_only_internet_for_agents.md; does not repeat Stripe, Uber gateway, Ramp replica, Shopify, Airbnb, LinkedIn propose-only, Jane Street, Block, Cloudflare key injection, the lethal trifecta or the vendor sandbox designs.

Read tags: "raw text" = page text read in full; "fetched via extraction" = WebFetch returned a model-extracted summary and quotes of the page (this is what most fetches here were); "snippet only" = search-result summary, page not opened. Quotes below appear only where the extraction returned them in quotation marks; treat them as near-verbatim, not guaranteed verbatim. Several publishers (Medium, Snowflake blog) returned HTTP 403, so those are snippet only.

---

## Q1. The data broker for agents: published designs where the agent asks a service and never holds a connection

### Takeaway

The best-documented internal data agents (OpenAI, Meta, Uber Finch, LinkedIn, Pinterest) all put a service between the model and the warehouse and enforce the human requester's existing permissions in that service. Almost none publishes whether the agent's SQL is read-only, a result-size cap, or an explicit semantic-layer-only surface; Ramp Research is the one that says "no PII" outright. The broker idea is well supported; the specific internals are mostly unpublished.

### Cited Findings

- OpenAI, in-house data agent (official, first-party engineering post by Bonnie Xu, Aravind Suresh, Emma Tang, 29 Jan 2026) [fetched via extraction]: the agent "plugs directly into OpenAI's existing security and access-control model," "inheriting and enforcing the same permissions and guardrails that govern OpenAI's data"; "users can only query tables they already have permission to access"; "When access is missing, it flags this or falls back to alternative datasets the user is authorized to use." Documents are "ingested, embedded, and stored with metadata and permissions." The agent shows its assumptions and links to the underlying results. Not addressed in the post: write access, read-only, row caps, how credentials flow. — [OpenAI](https://openai.com/index/inside-our-in-house-data-agent/)
- Meta, warehouse access agents (official, engineering.fb.com, 13 Aug 2025) [fetched via extraction]: "The system is aware of who is trying to access what"; "Query-level access control at a granular level"; "We analyze the shape of queries, such as whether they involve aggregation or random sampling"; "Employees are given a data-access budget based on the amount of data they typically access," reset daily, called a "first line of defense"; "Currently, we maintain a human-in-the-loop for oversight"; decisions and logs are stored for audit. This is about agents that grant or negotiate access, not about an analytics agent running SQL. — [Meta Engineering](https://engineering.fb.com/2025/08/13/data-infrastructure/agentic-solution-for-warehouse-data-access/)
- Meta Analytics Agent (official Meta analytics blog on Medium, March 2026) [snippet only]: 77% of Meta data scientists and data engineers use it weekly, plus about 5x as many users from non-data roles; every data point is shown with the SQL that produced it. Identity and read-only enforcement not seen. — [Medium, Analytics at Meta](https://medium.com/@AnalyticsAtMeta/inside-metas-home-grown-ai-analytics-agent-4ea6779acfb3)
- Uber Finch (official, Uber blog, 17 Jul 2025) [fetched via extraction]: "Built-in role-based permissions (RBAC) ensure that only authorized users can query sensitive financial data"; the SQL Writer Agent "Validates [the user's] security permissions before executing the query"; the agent works over "a curated set of single-table data marts"; models are reached through Uber's Generative AI Gateway. The post does not mention read-only or row limits. — [Uber](https://www.uber.com/en-US/blog/unlocking-financial-insights-with-finch/)
- LinkedIn SQL Bot (official engineering post Dec 2024 plus arXiv 2507.14372, Jul 2025; both [snippet only], reached through summaries): query validation includes "Does the user have access to the tables?" (Trino Summit 2024 slide); default tables are inferred from the user's access history; expert review found 53% of responses correct or close to correct; over 300 weekly users. The primary LinkedIn post URL was not opened. — [Trino Summit slide](https://trino.io/assets/blog/trino-summit-2024/trino-summit-2024-linkedin-ai.pdf), [arXiv](https://arxiv.org/abs/2507.14372v1)
- Pinterest MCP ecosystem (official engineering post March 2026; read via InfoQ, Apr 2026) [fetched via extraction of InfoQ]: "two-layer authorization model" plus fine-grained decorators; "End-user JWTs control human-in-the-loop access, while service-only flows rely on mesh identities"; "Pinterest mandates human-in-the-loop approval for sensitive operations"; a central registry is "the source of truth for approved servers"; "business-group gating" for high-privilege operations; each server passes security, legal/privacy and GenAI review. The Presto MCP server is the highest-traffic one (search snippet). PII not mentioned. — [InfoQ](https://infoq.com/news/2026/04/pinterest-mcp-ecosystem); original Medium post returned 403: [Pinterest Eng](https://medium.com/pinterest-engineering/building-an-mcp-ecosystem-at-pinterest-d881eb4c16f1)
- Ramp Research (official, Ramp engineering blog, "early August", year not shown) [fetched via extraction]: context "lives in dbt, Looker, and Snowflake"; tools "to inspect column values, branch, and backtrack"; "Ramp Research does not have access to any personally identifiable information (PII)." Identity, read-only and logging not addressed. — [Ramp](https://engineering.ramp.com/post/meet-ramp-research)
- Pragmatic Engineer on Ramp Inspect (newsletter, secondary) [snippet only]: Inspect can query the sanitized read-only production replica. Already in the earlier notes; included only to pair with Ramp Research above. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect)
- Vendor behavior of the underlying platforms (vendor docs, snippet only): Databricks calls it "user authorization" (formerly on-behalf-of), with Unity Catalog row filters and column masks applied in the SQL engine; Snowflake's agent identity docs distinguish delegated agents running in the user's session, and a Snowflake engineering post (30 Oct 2026) describes Restricted Session Scope, a ceiling that can only narrow what an agent does for a user, with a built-in read-only scope. Per the summary, an agent acting for a user inherits the user's full privileges unless a session policy is applied. — [Snowflake agent identity](https://docs.snowflake.com/en/user-guide/agent-identity), [Snowflake blog (403, snippet)](https://www.snowflake.com/en/blog/engineering/control-what-ai-agents-can-do-in-your-snowflake-sessions/), [Databricks agent auth](https://docs.databricks.com/gcp/en/agents/custom-agents/agent-authentication)
- Independent voices on "no direct SQL for the agent" (Hacker News, named handles, commenters not verifiable as employees) [fetched via extraction of the Algolia API]:
  - gnat, 7 Jul 2026: no direct SQL; tools such as `get_invoices` load data into a per-session SQLite database; "I didn't want to give an agent SQL access to the database." — objectID 48817077
  - reactordev, 15 Jan 2026: read replica for reads; writes "go through a tool that sanity checks everything." — objectID 46627816
  - buremba, 8 Jul 2025: never service_role in production; read replicas for raw SQL, API endpoints for writes (opinion) — objectID 44504905
  - agenteo, 12 Feb 2026: connects agents to production databases over MCP with DBHub for product analytics (a counter-example, direct) — objectID 46988041
  - nkov47as, 26 Feb 2026: argues for "no network path to production" isolation (opinion) — objectID 47161210
  Count: 3 independent voices describe a no-direct-connection or replica design (gnat, reactordev, buremba, the last by opinion); 1 describes direct production reads (agenteo). Anonymous commenters; weak evidence individually.
  URLs: `https://news.ycombinator.com/item?id=<objectID>`.

### Inferences

- The pattern "agent asks a service; the service runs as, or checks, the requester" is documented by at least four companies (OpenAI, Uber Finch, LinkedIn, Pinterest) plus Meta for access decisions. The stricter version, a surface of curated marts or a semantic layer only, is documented by Uber (single-table marts) and implied by Ramp (dbt/Looker context).
- No source found states a result-size limit for these data agents. Meta's per-employee daily data-access budget is the closest published volume control.

### Gaps

- Shopify, Notion, Stripe (data side), Block, DoorDash, Instacart, Grab, Spotify, Lyft, Netflix: searches returned no first-party posts on internal data-agent authorization. Not found, not necessarily nonexistent.
- Read-only enforcement and row caps for any named company: not found.
- LinkedIn and Pinterest primary posts were not opened (summaries only).

---

## Q2. Redaction and minimization on the way to the model

### Takeaway

Published redaction is mostly secrets and structured identifiers; the only first-person company designs found avoid the model seeing PII at all (airCloset hashing, Ramp no PII access) rather than detecting it afterward. Detector accuracy data says rule-based tools like Presidio miss a lot outside structured identifiers, and one vendor admits its layer fails open.

### Cited Findings

- airCloset (Japanese subscription retailer; named individual, CTO Ryosuke Tsuji; DEV Community, 13 Jul, year not shown) [fetched via extraction]: six-layer design for its internal AI platform: BigQuery policy-tag column control, Cloud DLP redaction in ETL, app-side hashing before logs, same-function hashing on search, output masking for MCP results, separate handling of staff emails. Emails get HMAC-SHA256 truncated to 12 characters with the key outside the observability stack. "The email exists only inside the MCP server and never reaches the model." Humans and agents share one backend; only the interface differs. — [DEV](https://dev.to/ryantsuji/observability-design-for-the-ai-era-reconciling-pii-protection-with-ai-searchability-and-driving-2f0l)
- Edge Delta (vendor, "What the Model Never Sees", 1 Sep 2026) [fetched via extraction]: a redaction layer before every model call; 13 toggleable categories, secrets and identity numbers (keys, JWTs, connection strings, card numbers with Luhn, SSNs); names, emails, phone numbers and IPs deliberately excluded; placeholders like `[REDACTED:aws_access_key_id:a1b2c3d4]` keep correlation; "the layer fails open. If redaction throws entirely, the prompt goes out unredacted." — [Edge Delta](https://edgedelta.com/company/blog/what-the-model-never-sees)
- LiteLLM (open-source product docs; vendor) [fetched via extraction]: PII masking is built on Presidio and needs a deployed Presidio Analyzer; modes include `pre_call`, `post_call`, `logging_only` and `pre_mcp_call`; it can replace masked tokens in the response with the user's original values; scanning responses needs an explicit scope setting. — [LiteLLM docs](https://docs.litellm.ai/docs/proxy/guardrails/pii_masking_v2)
- Presidio accuracy (academic preprints and Microsoft docs; [snippet only] except REDACT abstract [fetched via extraction]): REDACT (arXiv 2606.19881, 18 Jun 2026) reports Presidio recall of 0.07 on its HIGH-sensitivity tier versus 0.74 for GPT-4.1 and 0.77 for Claude Sonnet 4.6 (the model figures are from the search summary, not confirmed in the fetch); PIIBench (arXiv 2604.15776) reports Presidio overall F1 about 0.14; another study (arXiv 2609.03464) reports perfect recall on SSNs and IPs but a larger recall drop under distribution shift; Presidio's own docs say the vanilla analyzer's results "aren't very accurate" and that recall often matters more than precision. Datasets and matching rules differ, so figures are not comparable. — [REDACT](https://arxiv.org/abs/2606.19881), [PIIBench](https://arxiv.org/pdf/2604.15776), [Mind the Gap](https://arxiv.org/pdf/2609.03464), [Presidio evaluation](https://microsoft.github.io/presidio/evaluation)
- Hacker News on redaction failing (named handles, [fetched via extraction]): nhinck2, 10 Oct 2026: "98.4% is nowhere near good enough to call it PII redaction" (objectID 50034145); kgeist, 16 Nov 2026: a model probing exposed sites agreed to return one redacted row per table, then in a fresh session returned all rows including plaintext passwords, so redaction as a conversational promise is not a control (objectID 50523783); gruez, 13 Aug 2026 criticizes a clickbait title claiming Claude Code sent 3 of 4 secrets despite instructions (objectID 49286399). Independent voices on "redaction by detector is imperfect or must be enforced outside the model": 3, anonymous.
- Gateway vendors on tool-response redaction (vendor, [snippet only]): Gravitee and others say redaction must cover tool results as well as prompts; getmaxim says Presidio endpoints have no built-in authentication. Treat as vendor positioning. — [getmaxim](https://www.getmaxim.ai/topics/ai-guardrails/microsoft-presidio)
- Supabase (official, 16 Sep 2025) [fetched via extraction]: "Never connect AI agents directly to production data"; recommends development, staging or branched databases, or obfuscated or anonymized datasets. — [Supabase](https://supabase.com/blog/defense-in-depth-mcp.md)
- Uber's gateway redaction of responses is already in the earlier notes; not repeated.
- Obfuscated replicas and clones (HN, evanvolgas 13 May 2026, objectID 48125636; classx 27 Feb 2026, objectID 47184875): both are product pitches by the vendors; vendor, not evidence of company use.

### Inferences

- Ladder of minimization strength, from published sources: no PII in the agent's surface at all (Ramp Research, airCloset) beats detection after the fact (Presidio, LiteLLM), because the measured detectors miss high-sensitivity data. For a small organization, fewer columns exposed is cheaper than a better detector.
- Tokenization with re-identification outside the model has a documented concrete example (airCloset's hash-and-lookup inside the MCP server); no published large-company design of reversible tokenization for agents was found.

### Gaps

- Published false-positive/false-negative rates for a company's own production redaction of tool responses: none found.
- Aggregates-only, sampling and synthetic-row designs for agents at named companies: not found beyond the vendor pitches above.

---

## Q3. LLM and MCP gateways as the control point

### Takeaway

Company-written accounts of running a gateway are scarce in this search (Uber and Pinterest are the clear ones; Uber is in earlier notes). Product documentation is abundant and shows what is possible: ZDR-only routing, prompt/response logging with customer keys, PII masking, per-tool allow/block/approve. Standards work (MCP spec, Entra Agent ID, IETF drafts) exists, with few documented adopters.

### Cited Findings

- Pinterest (see Q1): registry as the source of truth for approved MCP servers, review before production, mesh identity versus end-user JWT. Official, Mar 2026.
- Cloudflare AI prompt protection (vendor, 25 Aug 2025) [fetched via extraction]: DLP detects prompts and responses in supported AI tools, classifies by content and intent, supports allow/deny policy (example: block ChatGPT prompts that may return PII for non-HR staff); logs capture prompt and response encrypted with a customer-provided key "to ensure that not even Cloudflare may access your sensitive data." Product capability only; no named customer. — [Cloudflare](https://blog.cloudflare.com/ai-prompt-protection)
- Zero-retention routing (vendor, [snippet only]): Vercel AI Gateway routes only to providers with negotiated ZDR agreements; Merge describes metadata-only logging; a TrueFoundry post argues retention terms do not stop disclosure and inspection is still needed. — [Vercel](https://vercel.com/blog/zdr-on-ai-gateway), [TrueFoundry](https://www.truefoundry.com/blog/llm-data-loss-prevention)
- A Tian Pan post (named blogger, [snippet only]) says the first internal gateway is usually built for cost attribution, rate limits and failover, with privacy added later. One voice. — [tianpan.co](https://tianpan.co/blog/tags/dlp)
- LiteLLM (see Q2): `pre_mcp_call` guardrail mode shows an open-source gateway running DLP-style masking on MCP input.
- HN, self-described team gateways [fetched via extraction]: cagz, 4 Sep 2026, team runs MCP servers in production through a gateway for governance and permissions (objectID 49561135, details thin); nickytonline, 12 Oct 2026, their company sells an MCP gateway with an identity-aware proxy (vendor employee, objectID 50059066); rmorlok, 14 Sep 2026, building one for internal tooling (objectID 49697352). Several other hits were job posts or pitches and were excluded. Independent voices that run one themselves: 1 (cagz), unverified.
- MCP specification (official, modelcontextprotocol.io, versions through 2026-07-28) [snippet only]: servers "MUST NOT accept any tokens that were not explicitly issued for the MCP server"; token passthrough is forbidden; a server calling upstream APIs "may act as an OAuth client" and uses a separate token; the confused-deputy section covers proxy servers with a static client ID; dynamic client registration is deprecated as of 2026-07-28. — [MCP security best practices](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices)
- Microsoft Entra Agent ID (vendor docs, [snippet only]): agent identities act for signed-in users via OAuth 2.0 on-behalf-of; the user must consent first; a Conditional Access template exists for agents acting for users; an agent identity "only authenticate[s] using federated identity credentials issued by the agent identity blueprint." Product capability; no named adopter found. — [Microsoft Learn](https://learn.microsoft.com/en-us/entra/agent-id/agent-on-behalf-of-oauth-flow)
- SPIFFE and IETF (draft, vendor and standards, [snippet only]): draft-klrc-aiagent-auth (AI-Auth, v00 Mar 2026, v03 Jul 2026) says each agent MUST have exactly one WIMSE identifier (may be a SPIFFE ID) and that user context be preserved for authorization and audit; Red Hat's Kagenti post (10 Jun 2026) pairs SPIFFE with RFC 8693 token exchange and notes per-user SPIFFE certificates do not scale. Drafts, not standards; no named company deployment found. — [IETF draft](https://www.ietf.org/archive/id/draft-klrc-aiagent-auth-03.html), [Red Hat](https://next.redhat.com/2026/06/10/wiring-zero-trust-identity-for-ai-agents-spiffe-token-exchange-and-kagenti/)
- Anthropic Claude Code ZDR docs (official/vendor, read as raw-ish extraction, current as of Nov 2026) [fetched via extraction]: ZDR "available to qualified accounts on Claude for Enterprise" and "not included in the standard Claude for Enterprise plan"; prompts and responses "not stored by Anthropic after the response is returned, except where needed to comply with law or combat misuse"; per-organization enablement; sessions from a personal account or another org's API key are not covered, so managed settings `forceLoginMethod` and `forceLoginOrgUUID` are offered; data handled by third-party tools or MCP servers "is not covered"; certain models (Fable 5, 5.1, 5.2) "require data retention by default"; policy-violation data may be retained up to 2 years. — [Claude Code docs](https://code.claude.com/docs/en/zero-data-retention)

### Inferences

- A gateway for model traffic and a broker for data are different chokepoints; the coding-agent ZDR page itself says MCP/third-party tool data is outside ZDR, which is an argument for the broker as a separate control.
- Named-speaker evidence for DLP rules on model traffic was not found; only product pages.

### Gaps

- Company engineering posts on LiteLLM, Portkey or Kong deployments: not found in this pass.
- Adopters of Entra Agent ID or SPIFFE-for-agents: not found.
- Databricks/Snowflake gateway governance features beyond the snippets above: not opened.

---

## Q4. Whose authority the agent acts with

### Takeaway

Three positions are documented: the requester's own permissions (OpenAI, Uber Finch, Pinterest end-user JWT, Databricks/Snowflake delegated), a separate service identity (Pinterest mesh flows, LinkedIn and Jane Street in earlier notes), and narrowed delegation (Snowflake RSS). The incidents that bear most are about agents inheriting an over-broad human identity.

### Cited Findings

- Snowflake docs (vendor): an agent acting for a user "inherits that user's full privileges unless a session policy is applied"; RSS narrows that, never widens (snippet only, 403 on blog). — [Snowflake docs](https://docs.snowflake.com/en/user-guide/agent-identity)
- Databricks community post [snippet only]: "Your row filter works, the agent just isn't who it's filtering" (title) describes a shared service principal having broader access than the user. Vendor community, anonymous. — [Databricks community](https://community.databricks.com/t5/community-articles/your-row-filter-works-the-agent-just-isn-t-who-it-s-filtering/m-p/166952/highlight/true)
- Amazon / Kiro, Dec 2025 outage (press, [snippet only]): Amazon says "a user access control issue, not an AI autonomy issue" and that the engineer was using a role with broader permissions than expected; the Financial Times, citing anonymous employees, reported Kiro was treated as an extension of the operator with the same permissions and pushed the change without approval. Facts disputed. Already in the earlier notes; the new part is the identity framing. — [The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/)
- Replit database deletion (press, Jul 2025, [snippet only]): the company said it would separate production and development databases and that development environments should never access production systems; at the time, "Replit was using the same database for preview, testing and production." — [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-coding-platform-goes-rogue-during-code-freeze-and-deletes-entire-company-database-replit-ceo-apologizes-after-ai-engine-says-it-made-a-catastrophic-error-in-judgment-and-destroyed-all-production-data)
- Supabase MCP disclosure (General Analysis, Jul 2025; Simon Willison summary 6 Jul 2025; Supabase response 16 Sep 2025) [snippet only for the disclosure, fetched via extraction for Supabase]: a support ticket carried hidden instructions; a developer's Cursor agent, using a role that bypasses row-level security, read a private integration-tokens table and wrote it back into the ticket. Supabase added read-only mode, project scoping and feature groups, and wrote "even in read-only mode, prompt injection remains the number one concern" and "guardrails alone aren't enough." — [Willison](https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/), [Supabase](https://supabase.com/blog/defense-in-depth-mcp.md)
- Meta, March 2026 (press, from The Information; Meta confirmed an incident) [snippet only]: an internal agent replied publicly to a forum question without approval; another engineer followed the flawed advice; a Sev-1 lasting about two hours, with data visible to people not approved to see it. Meta told The Guardian "no user data was mishandled"; other outlets disagree on scope. — [TechCrunch](https://techcrunch.com/2026/03/18/meta-is-having-trouble-with-rogue-ai-agents)
- Meta (official, Oct 2026, [snippet only]): a PrivacyLib "Agent Observability module" observes agent data-access events. — [Meta Engineering](https://engineering.fb.com/2026/10/27/security/privacylib/)
- HN voices on blame (anonymous): ritonlajoie, 26 Apr 2026, "the team deleted it when they gave the agent write access" (objectID 47913544); coldtea, 26 Apr 2026 (objectID 47915165); bigstrat2003, 6 Sep 2026 (objectID 49587664). Three independent voices that the grant, not the agent, is the failure.

### Inferences

- Both the Amazon and Supabase cases are a human's broad identity or a role that bypasses row-level security being reached by an agent; both argue against "agent = engineer's full token" when that token is broad, and for a narrowed ceiling.
- The relay-the-token model (Uber, OpenAI) is safest when the data layer enforces row and column policy; the Supabase case shows it fails when the relayed role bypasses policy.

### Gaps

- A published argument from a named engineer for task-scoped credentials in data access (short-lived, per-task grants): only vendor material (Immuta, snippet). Not verified.

---

## Q5. Logs, traces and support data for debugging agents

### Takeaway

Little first-party material. The usable design (airCloset) keeps PII out of the observability stack by hashing, so humans and agents share one backend. Vendor tools mask on read.

### Cited Findings

- airCloset (see Q2): hashed identifiers in logs; the agent queries Loki through Grafana MCP by hash; email resolved server-side only.
- observability-mcp (open-source project, [snippet only]): masks PII and secret patterns in log query results by default; bypass only for allowed identities. — [project docs](https://thotischner.github.io/observability-mcp/redaction/)
- Grafana Cloud Agent Observability (vendor docs, [snippet only]): two redaction layers; its PII check is an LLM judge; placeholders, no mapping back. — [Grafana](https://grafana.com/docs/grafana-cloud/observe-and-act/agent-observability/privacy-and-access/pii-and-secrets-redaction/)
- LiveKit (vendor, Aug 2026, snippet only): drops PII fields from traces and logs.
- Edge Delta (see Q2): redaction before every call to its on-call agent; names, emails, phones not redacted by design.
- Supabase's support-ticket case (Q4) is the sharpest example of support data as an injection path.

### Inferences

- Names and emails in logs are the likely gap for secret-focused redactors (Edge Delta excludes them).

### Gaps

- Named company on-call agents (Datadog, PagerDuty, Uber, Meta) describing log PII handling for their own use: not found.

---

## Q6. Where the model runs and what leaves

### Takeaway

Vendor docs make clear ZDR and cloud hosting are different regimes with different scopes; surveys, not named incidents, document data leaving via AI tools.

### Cited Findings

- Claude Code ZDR (see Q3): applies only to Anthropic's direct platform; Bedrock, Vertex and Foundry deployments "refer to those platforms' data retention policies"; MCP and third-party tool data not covered.
- AWS Bedrock (vendor docs, [fetched via extraction]): "Model providers don't have any access to" the Model Deployment Accounts, "they don't have access to Amazon Bedrock logs or to customer prompts and completions"; abuse-detection handling is documented separately. The retention page itself was not opened. — [AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html)
- Shadow-AI surveys (vendor-sponsored, [snippet only] via press): PagerDuty June 2026: 34% of 1,250 office professionals entered customer data into public AI tools; Okta (The Register, 27 May 2026): over half of organizations reported an AI-related incident or near miss; Cyberhaven 2026: 39.7% of AI-tool interactions involved sensitive data; TELUS Digital Jan 2025: 57%; Netskope 2026: an average of 9.5 AI tools used, IT aware of 3 (via DEV). Methods differ; vendor-sponsored. — [PagerDuty](https://www.pagerduty.com/fr/blog/ai/shadow-ai-workplace-survey-2026/), [The Register](https://www.theregister.com/ai-ml/2026/05/27/bosses-blinded-by-confidence-about-shadow-ai-use-by-workers/5247275)
- Company requirements before data may be sent: Supabase's rule (Q2) and Cloudflare/ZDR vendor stances are what was found; named company policies for sending code or data to models were not surfaced here (see earlier notes for Stripe, Uber, Jane Street).

### Inferences

- "Run the agent on a remote server" does not by itself decide where code and prompts go; the endpoint contract does, and ZDR enablement is per organization, so a one-person company must check it was actually enabled.

### Gaps

- Self-hosted models for sensitive data, Vertex and Azure retention terms, regional processing: not opened.
- A named incident of company data leaving via a coding agent in 2025-26: none confirmed (a search returned surveys only).

---

## Q7. Regulation and privacy guidance

### Takeaway

Regulators say little that is specific to coding agents; what exists is general: minimize, keep accountability, do an impact assessment, watch third parties.

### Cited Findings

- UK ICO, "Tech Futures: Agentic AI" (Jan 2026; the report says it is not guidance or formal regulatory expectations) [fetched via extraction of a Covington summary dated 5 Feb 2026; original not read]: "avoid processing personal information 'just because' it may be useful someday"; users should choose which tools and databases an agent can access, with safeguards such as human approval and data masking; "organizations remain fully responsible"; "placing governance responsibility on end users is unlikely to be workable in all cases." — [Covington](https://www.insideprivacy.com/artificial-intelligence/ico-shares-early-views-on-agentic-ai-data-protection/)
- ICO audit toolkit (official, [snippet only]): a DPIA should be completed before starting AI processing. — [ICO](https://ico.org.uk/for-organisations/advice-and-services/audits/data-protection-audit-framework/toolkits/artificial-intelligence/governance-and-accountability-in-ai)
- EDPB Opinion 28/2024 (official, adopted 17 Dec 2024) [snippet only, via law-firm summaries]: anonymity of AI models is case by case with a high bar; legitimate interest can be a legal basis for developing and deploying AI models via a three-step test; cites a conversational agent and cybersecurity use as examples. It concerns models, not an employer sending data to a vendor's endpoint. — [EDPB PDF](https://edpb.europa.eu/system/files/2024-12/edpb_opinion_202428_ai-models_en.pdf)
- EU AI Act and omnibus (secondary, [snippet only]): a company rolling out a tool to employees is a deployer; deployer obligations were reported to start 2 Aug 2026 with proposed delays pending; EDPB-EDPS joint opinion on the AI omnibus, Jan 2026. No agent-specific EU law proposal (Chambers). Dates need checking against the Official Journal. — [EDPB-EDPS opinion](https://www.edpb.europa.eu/system/files/2026-01/edpb_edps_jointopinion_202601_proposal_ai-omnibus_en.pdf)
- Financial supervisors (official, [snippet only]): BIS FSI Insights 73 (Mar 2026) on AI data use; FCA, Bank of England and HM Treasury joint statement on frontier AI and cyber resilience, 15 May 2026, advising care with AI procurement and provider terms; Jersey FSC guidance (Jul 2026): avoid inputting sensitive data into unapproved third-party tools and encrypt data sent to and from AI services. No FINRA, EBA or MAS text found. — [BIS](https://www.bis.org/fsi/publ/insights73.htm)

### Gaps

- Original ICO and EDPB texts were not read; EU AI Act article-level obligations for internal use not verified; no national DPA text on employee-facing coding agents.

---

## Q8. What a one-engineer organization can run (inference unless a source is named)

### Takeaway

The minimum broker is a single tool server on the dev machine's trusted side that holds the only database credential, connects as a read-only role to a sanitized replica, exposes named queries or a view-only schema, caps rows, and logs every call. Each piece has a published parallel; the combination is inference.

### Design (inference), with parallels

- Agent sandbox has no database credentials or network path to production (parallel: nkov47as HN, Cloudflare key injection in earlier notes).
- One MCP tool server holds the credential; role is read-only on a replica or restored copy (parallels: reactordev HN; Ramp Inspect replica in earlier notes; Supabase's "development or obfuscated" advice).
- Expose views and columns, not tables; leave sensitive columns out of the views (parallels: Uber single-table marts; Ramp Research no PII; airCloset policy tags).
- Row cap and statement timeout set in the role and the tool; return aggregates first (no published source; inference).
- Log requester, query text, row count and time to an append-only file; show SQL with answers (parallels: Meta and OpenAI show the underlying query).
- Writes: none; propose-only through a ticket (parallels: LinkedIn, Pinterest human-in-the-loop).
- Model endpoint: enterprise or cloud-hosted terms with retention checked and enforced by managed settings (Claude Code ZDR docs).
- Redaction on top is a second layer, not the first, given the measured detector recall.

### Gaps

- No published account of a one-person company doing this was found.

---

## Comparison by company

| Company | How the agent reaches data | Whose identity | Redacted or withheld | Write access | Source strength |
| --- | --- | --- | --- | --- | --- |
| OpenAI (Jan 2026) | Internal data agent over warehouse and documents, runs queries | Requester's permissions ("pass-through") | Missing access flagged or falls back to authorized datasets | Not stated | Official, fetched via extraction |
| Meta (Aug 2025, Mar 2026) | Agents mediate access requests; Analytics Agent runs SQL | Tracks requester; per-employee budget | Query shape and volume checks | Human in the loop for access decisions | Official (Aug 2025 fetched; Mar 2026 snippet) |
| Uber Finch (Jul 2025) | Slack agent over curated single-table marts | Checks requester's permissions before query | Role limits on financial dimensions | Not stated | Official, fetched via extraction |
| LinkedIn SQL Bot (Dec 2024, Jul 2025) | Multi-agent text-to-SQL | Access check on tables | Not stated | Not stated | Official via summaries, snippet only |
| Pinterest (Mar 2026) | MCP servers, registry, Presto MCP | End-user JWT or mesh identity | Not stated | Human approval for sensitive ops | Official via InfoQ, fetched |
| Ramp Research (year not shown) | dbt, Looker, Snowflake tools | Not stated | No PII access | Not stated | Official, fetched |
| airCloset (July, year not shown) | MCP tools over Loki, BigQuery | Not stated | Hashed identifiers, column policies, masked MCP output | Not stated | Named individual (CTO), fetched |
| Amazon (Dec 2025 incident) | Agent in engineer's session | Engineer's role, broader than expected | None | Delete-and-recreate environment (reported) | Press, disputed |
| Supabase MCP (2025) | MCP over project database | Role bypassing row-level security | None by default | Read-only mode added later | Disclosure plus official reply |

## Ladder of designs, "no data" to "direct production access"

1. No data (Stripe, in earlier notes; also Ramp Research for PII). Risk: agent can't validate against reality.
2. Synthetic or obfuscated copies (Supabase advice; vendor pitches on HN). Risk: obfuscation quality, schema drift.
3. Sanitized read replica or warehouse view behind a tool server (Ramp Inspect in earlier notes; reactordev; gnat variant). Risk: sanitization gaps; the tool server is the new crown jewel.
4. Governed text-to-SQL service running as the requester with table and column policy (OpenAI, Uber Finch, LinkedIn, Pinterest). Risk: over-broad requester role; injection through returned content; accuracy (LinkedIn 53%).
5. Delegated agent with a narrowed session ceiling (Snowflake RSS, Databricks user authorization; vendor). Risk: a documented default of inheriting full privileges.
6. Separate agent identity with its own rights, propose-only writes (LinkedIn, Jane Street in earlier notes; Pinterest approval). Risk: service principal broader than any user.
7. Engineer's full token, agent writes (Amazon Kiro, reported). Risk: outage.
8. Direct production with a bypass role (Supabase MCP, Replit). Risk: injection to leak; deletion.

## Angles for an essay

1. The broker is the place where policy lives that the model cannot talk its way past: kgeist's fresh-session story and Supabase's "guardrails alone aren't enough" versus OpenAI/Uber enforcing the requester's permissions in the service.
2. Withhold before you detect: Ramp Research and airCloset keep PII off the surface; measured detectors (Presidio recall 0.07 on high-sensitivity data in one benchmark) and Edge Delta's fail-open admission argue against redaction-only.
3. Inheriting the engineer's identity is the common incident shape: Amazon's role and Supabase's RLS bypass; Snowflake's own docs state the default inheritance.
4. A model contract is not a data policy: ZDR is per organization, excludes MCP and third-party tools, and Bedrock follows its own terms.
5. A one-person version fits on one page: read-only role, replica, one tool server, one log.

## Gaps (overall)

- Named company posts for Shopify, Notion, Stripe data tools, Block, DoorDash, Instacart, Grab, Spotify, Lyft, Netflix: not found.
- Result-size limits and read-only enforcement in any named internal data agent: not found.
- Company gateway deployments with DLP rules from named speakers: not found beyond Uber (earlier notes).
- Published redaction accuracy from a company's own production use: none.
- Primary texts not opened: LinkedIn post, Pinterest Medium post (403), Snowflake blog (403), ICO report, EDPB opinion, AWS retention page, Vertex and Azure terms.
- Several arXiv figures come from search summaries; REDACT's model recall numbers were not confirmed in the fetch.
- Dates missing on Ramp Research and airCloset posts.
