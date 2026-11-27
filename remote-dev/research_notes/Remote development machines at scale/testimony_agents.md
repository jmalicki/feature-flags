# Public testimony by individuals on coding agents inside large companies (2025-2026)

Scope: statements by named or pseudonymous individuals (Hacker News comments, conference talks, podcasts, quoted employees in press) about where coding agents run, whose identity they use and what they can reach. Official posts already covered in `access_and_agents.md` and `gpus_and_agents.md` (Stripe Minions, Ramp Inspect, Uber MCP gateway, Shopify River, Spotify Honk, Anthropic, Monzo) are not repeated.

How to read the tags:

- **[raw text]**: I read the full comment text from the Hacker News Algolia API. Quotes are verbatim.
- **[fetched via extraction]**: page fetched and passed through an extraction model. Quoted strings are what the extractor returned as verbatim; check against the page before printing.
- **[snippet only]**: search-result summary; not opened or paywalled.

Caveats that apply throughout:

- HN handles are pseudonymous. "Claimed employer" means the commenter said so in that comment; where the employer is only implied by vocabulary I say so.
- Reddit was not reachable (search tool and direct API both blocked). lobste.rs was not searched. All community testimony here is from Hacker News.
- HN full-text search for "devserver" + agent, "Devmate", "MetaCode", "cloud desktop" + agent returned nothing usable. Absence of testimony is recorded in Gaps.
- Research date: 26 Nov 2026. Tool policies at Amazon, Microsoft and Meta changed several times during 2026; every claim is dated.

---

## Q1. Where the agent runs (laptop, own remote dev machine, per-task sandbox, CI, vendor cloud); is the laptop forbidden or discouraged

### Takeaway

Where a company already has remote dev machines, individuals describe the agent simply running there (Google cloudtop, a "beefy devbox at work", a remote VM), and the reasons they give are blast radius, session persistence and laptop load, not a written ban. Explicit "not on the laptop" rules appear only in institutional statements (JPMorgan, Meta via press), and three mid-size companies (Block, Cloudflare, Dashlane) say openly that agents run on the engineer's own machine.

### Cited Findings

#### Google

- shaftway (employer not stated; "cloudtop" is Google's term), 6 Nov 2026 [raw text]: "I use a cloudtop for my development... I SSH or remote desktop from my local workstation to that machine for anything I need to run. The agent runs in a web service on that machine, which is how I interact with it." — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- krat0sprakhar (states "I work at Google"), 30 Sep 2026 [raw text]: "internally we all use Jetski (internal version of Antigravity). Outside of Gemini, Opus models are supported and allowed for internal use. No OpenAI models since they are not on Vertex" — [HN 49913887](https://news.ycombinator.com/item?id=49913887)
- randomCloud (speaks as insider, employer not stated), 13 May 2026 [raw text]: "Google employees can't use antigravity. There is an internal version of it which has an agent which is shared between Cider and it." — [HN 48127651](https://news.ycombinator.com/item?id=48127651); same author: "Antigravity isn't supported internally... There is a similar internal product but the agentic part is shared between that and Cider." — [HN 48127971](https://news.ycombinator.com/item?id=48127971)
- frollogaston (speaks as insider), 16 Jul 2026 [raw text]: "Internally I didn't like Gemini CLI just because it didn't have the right skills/whatever preinstalled, so it always did stuff that made sense elsewhere but not at Google, like trying to grep through the entire monorepo. Jetski just worked." — [HN 48939506](https://news.ycombinator.com/item?id=48939506)
- jim33442 (speaks as insider), 22 May 2026 [raw text]: "the internal Gemini CLI didn't come with whatever it needed to deal with Google's internal tooling, and Jetski did"; "Gemini CLI takes like 30-60s to start up, which is unacceptable when I'm starting it frequently in separate terminals". Content overlaps closely with frollogaston; may be one person with two accounts, so count as one voice. — [HN 48230949](https://news.ycombinator.com/item?id=48230949)
- rossjudson (long-tenured Google engineer by context), 14 May 2026 [raw text]: on Cider V, "These days, I mostly use it to peek into what (Antigravity's internal equivalent) does." — [HN 48130215](https://news.ycombinator.com/item?id=48130215)
- brainwad (speaks as insider), 31 Jul 2026 [raw text]: "The latest and greatest internally at Google is more or less just Antigravity 2.0 with the latest Gemini models." — [HN 49120775](https://news.ycombinator.com/item?id=49120775)
- kjgkjhfkjf (ex-Google, left "mid 2010s"), 14 May 2026 [raw text]: "There was a policy that forbade having code from this monorepo on your laptop." Historical; no one in the thread confirms or denies it for 2026. — [HN 48129353](https://news.ycombinator.com/item?id=48129353)
- Press, "Agent Smith" (Business Insider via secondary coverage, mid-2026) [snippet only]: an internal asynchronous agent built on Antigravity; employees give instructions, it works in the background, they check from a phone via internal chat; access was restricted because of demand. A June 2026 roundup notes no Googler has commented under their own name. — [rywalker.com roundup](https://rywalker.com/research/google-agent-smith) [fetched via extraction]; [developer-tech](https://www.developer-tech.com/news/google-tests-internal-ai-agent-for-coding-tasks-and-workflows/) [snippet only]
- KP Sawhney (Google DeepMind AI platform team), AI Engineer Europe 2026 [fetched via extraction]: works on "improving the Antigravity harness internally, including its use against Google's enormous monorepo"; the talk does not say where agents run. — [ai.engineer](https://ai.engineer/talks/7gujZrJ9L5I-google-deepmind-runs-agents-at-scale)

#### Meta

- daishi55 (speaks as Meta employee: "we"), 7 Oct 2026 [raw text]: "we are absolutely still using the Anthropic models full steam ahead, but are moving towards internal interfaces and harnesses... I for one have stopped explicitly using codex or CC entirely. But the interfaces I am using still use those harnesses under the hood." — [HN 49998512](https://news.ycombinator.com/item?id=49998512)
- wxw (outsider, second-hand), 5 Aug 2026 [raw text]: "Last I heard, everyone at Meta was using Claude Code." — [HN 49188395](https://news.ycombinator.com/item?id=49188395)
- Press [snippet only]: the internal assistant formerly called Devmate is now MetaCode; Meta wants engineers to move from third-party tools to it. The New Stack page returned 403. — [The New Stack](https://thenewstack.io/meta-metacode-engineer-training/)
- No individual testimony found on whether Meta agents run on devservers, OnDemand or laptops.

#### Amazon

- humbleharbinger (states "I'm an engineer at Amazon"), 15 Mar 2026 [raw text]: "we use Kiro (our own harness) with Opus 4.6 underneath." Does not say which machine it runs on. — [HN 47392420](https://news.ycombinator.com/item?id=47392420)
- 8note (Amazon by context), 17 May 2025 [raw text]: "ive made a couple code changes phone-only now, using the amazon internal browser that has ssh access to my dev desktop. im missing the ability to get cloudwatch logs and the like, but when i get a good mcp, i think i can leave my laptop at home". The only statement found that places an Amazon engineer's CLI agent work on the remote dev desktop. — [HN 44017380](https://news.ycombinator.com/item?id=44017380)
- iLoveOncall (states "I work at Amazon"), 5 May and 22 Jun 2026 [raw text]: Kiro "was basically the only option available"; "Kiro IDE is a piece of crap, I guess the CLI was fine". — [HN 48020329](https://news.ycombinator.com/item?id=48020329), [HN 48019846](https://news.ycombinator.com/item?id=48019846)
- hasteg (speaks as Amazon employee), 16 Jun 2026 [raw text]: "at Amazon we can only use Claude Code". Conflicts with others who still use Kiro; likely team-specific or a loose phrasing after the May 2026 rollout. — [HN 48554726](https://news.ycombinator.com/item?id=48554726)

#### Microsoft

- locusofself (states "Working at Microsoft"), 11 Feb 2026 [raw text]: "I've just now hooked up to Claude Code (my department was not permitted to use it previously), through something called 'Agent Maestro', a vscode extension which I guess pipes claude code API requets to our internally hosted Claude models". — [HN 46979317](https://news.ycombinator.com/item?id=46979317)
- Dave Rodriguez (principal PM, Endpoint Experience, Microsoft Digital), Inside Track blog, 2026 [fetched via extraction]: "We want these device agents to run on our employees' primary machines, and when necessary, to run on a secondary machine"; Windows 365 Cloud PCs described as "a corporate-bound, non-primary environment"; pilot of roughly 100 internal users with images that had "Copilot CLI and OpenClaw pre-installed". — [Microsoft Inside Track](https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/)

#### Airbnb, LinkedIn, Uber, Netflix (named speakers)

- Christopher Sanson (Product Lead, AI Developer Experience, Airbnb), DX Annual 2026 [fetched via extraction]: "workloads run on something internally called Airdev Workspaces." Madison Capps (Engineering Manager, Infrastructure, Airbnb): the worker pool is "built on top of something called the AirDev platform"; workers are "network isolated from production services and user data." AirChat Remote was in early access with about 50 internal users. — [DX podcast page](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/)
- Prince Valluri (LinkedIn), InfoQ podcast, 10 Dec 2025 [fetched via extraction]: "we then orchestrate that flow in a remote sandbox environment". Karthik Ramgopal (LinkedIn): "the sandbox environment has restrictions on what you can do and cannot do". Foreground agents run in the IDE. — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- Ty Smith (Principal Engineer, Uber) and Anshu Chadha (Director of Engineering, Uber), Pragmatic Summit talk, reported 10-13 Mar 2026 [fetched via extraction]: Minion takes prompts via web, Slack or command line and returns a pull request; "You give the agent a prompt and expect a pull request as the output." That Minion runs on Devpods is stated only in a search summary of the paywalled section [snippet only]. — [ShiftMag](https://shiftmag.dev/how-uber-engineers-use-ai-agents-8617/), [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- Netflix: Eric Wendelin (Engineering Leader), Code with Claude, 6 May 2026, and Mark Khuzam (Senior Software Engineer), QCon SF, 18 Nov 2026: abstracts only; neither says where agents run. — [session page](https://claude.com/code-with-claude/session/sf-the-ai-native-engineer-how-netflix-moves-engineers-up-the-claude-code-maturity-ladder), [QCon](https://qconsf.com/presentation/nov2026/platform-engineering-agents) [fetched via extraction]

#### Banks

- JPMorganChase (vendor customer post, 9 Nov 2026; no named JPMorgan speaker) [fetched via extraction]: "Claude Code runs in controlled environments, including Devspace, the firm's containerized development platform" "on its own infrastructure."; "The intent is to prevent agents from getting direct access to employee credentials or internal systems." — [claude.com](https://claude.com/blog/jpmorganchase-expands-claude-code)
- Goldman Sachs (State of AI, Nov 2026, citing Bloomberg and the FT) [fetched via extraction]: October guidance restricted Claude Code and GitHub tools to engineers (about 12,000 developers of roughly 47,000 staff); bankers and traders lost access. No detail on where the agent runs. — [thestateofai.com](https://www.thestateofai.com/news/goldman-sachs-claude-code-traders-bankers)

#### Agents on the engineer's own machine, said openly

- Cloudflare (Ayush Thakur, Scott Roemeschke, Rajesh Bhatia; 20 Apr 2026) [fetched via extraction]: engineers run OpenCode and other clients on their own machines; "No API keys exist on user machines."; the AI code reviewer runs in a GitLab CI job per merge request; cloud background agents are the "next evolution". — [Cloudflare blog](https://blog.cloudflare.com/internal-ai-engineering-stack/)
- Dashlane (Yann Gensous, Engineering Manager; 22 Apr 2026) [fetched via extraction]: agents run in Dev Containers: "They are sandboxed environments that run inside a container on the developer's machine." — [Dashlane blog](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team)
- Block (Angie Jones, Head of Developer Relations; 21 Apr 2025) [fetched via extraction]: goose is "Available as both a CLI and desktop app"; OAuth flows are "implemented directly within locally run MCP servers". — [goose blog](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise)

#### Unnamed-employer voices describing a remote machine at work

- SkyArrow, 7 Aug 2026 [raw text]: "SSH session persistence, as I work on a beefy devbox at work... I often need to juggle several streams of work at $job in parallel". — [HN 49210386](https://news.ycombinator.com/item?id=49210386)
- shengpuerh, 20 May 2026 [raw text]: wants to run `--dangerously-skip-permissions` at home; "For now I've settled on containers, but I would like to shift to a remote VM like I have at work." — [HN 48210550](https://news.ycombinator.com/item?id=48210550)
- brabel, 5 Nov 2026 [raw text]: "We also have a framework that lets us launch Claude... in our Kubernetes cluster within a devcontainer. That lets us ship heavy work off to another machine so our laptop is not overloaded with agents." — [HN 50376352](https://news.ycombinator.com/item?id=50376352)
- ecesena, 21 Oct 2026 [raw text]: "Same setup on my mac, on my server, at work... Most of the time it's via ssh, yes, only rarely I use my mac." — [HN 50175814](https://news.ycombinator.com/item?id=50175814)
- ghshephard, 17 Jun 2026 [raw text]: "The one at work is kind of sandboxed off - but does have the benefit of an MCP for every enterprise service we have". — [HN 48564709](https://news.ycombinator.com/item?id=48564709)
- dgunay, 5 Nov 2026 [raw text]: a coordinating instance "launches workers to tackle individual beads using Remuda, an agent launcher I wrote at work in 2025... I configure profiles in Remuda that launch containerized agents". — [HN 50375407](https://news.ycombinator.com/item?id=50375407)
- Swizec, 22 Apr 2026 [raw text]: "Cursor AI now writes 97% of my code at work. Mostly through cloud agents". Vendor cloud. — [HN 47870531](https://news.ycombinator.com/item?id=47870531)
- darklinear, 16 Jun 2026 [raw text]: at work, "For the 30% simpler or very well-specced tasks their cloud agents are... way better". Vendor cloud. — [HN 48560240](https://news.ycombinator.com/item?id=48560240)
- dascrazy_96, 13 Feb 2026 [raw text]: "I watched three teams at my company try to run background agents this quarter. All three hit the exact same wall. The agent generates code fine, but it can't run the test suite because nobody ever bothered to make the environment reproducible. One team spent two weeks just getting a second copy of the dev environment running on the same machine. The agent part took a day." — [HN 47004368](https://news.ycombinator.com/item?id=47004368)

### Inferences

- Count of independent voices saying "at work the agent runs on a remote machine or cluster I already have, not my laptop": 5 individuals (shaftway, SkyArrow, shengpuerh, brabel, ecesena) plus three named-speaker companies (Airbnb, LinkedIn, Uber) and one institutional statement (JPMorgan).
- Count saying "Google's internal agent is Jetski / an internal Antigravity, not the public product": 5 independent HN voices (krat0sprakhar, randomCloud, frollogaston/jim33442 counted once, rossjudson, brainwad) plus press (The Information via Android Authority). Only one voice (shaftway) says it runs on the cloudtop.
- Reasons individuals give for remote execution are practical: bounded damage (shaftway), persistence across SSH sessions (SkyArrow), laptop load (brabel, dascrazy_96). Security is the stated reason only in institutional text (JPMorgan).
- No individual said "my company forbids agents on laptops". The nearest are Google's old no-code-on-laptop rule (which makes the question moot there) and JPMorgan's "controlled environments".

### Gaps

- Meta: nothing found on devserver vs laptop for agents. Amazon: one 2025 comment ties CLI agent work to the dev desktop; nothing on Kiro specifically. Apple: nothing on where agents run. Microsoft: nothing tying coding agents to Dev Box.
- The paywalled Minion section of the Pragmatic Engineer Uber article probably answers the Uber question; not read.

---

## Q2. How engineers drive several agents at once; limits; effect on machine size and cost

### Takeaway

Individuals describe two patterns: git worktrees for a handful of parallel features, and a terminal multiplexer (tmux, herdr) over SSH to a devbox. Worktrees isolate files but not ports, caches or running services, which is the recurring complaint and the stated reason people move to a container, VM or separate machine per agent.

### Cited Findings

- SkyPuncher, 1 Apr 2026 [raw text]: "I use all of this stuff daily at work. Normally, I'm working on 2 to 4 features in parallel (so worktrees)." — [HN 47605769](https://news.ycombinator.com/item?id=47605769)
- mjrbrennan, 6 Nov 2026 [raw text]: "I don't have the bizarre need to have dozens of agents going at once... already feel flat out at work just using Codex w/ worktrees for a few concurrent projects at a time." — [HN 50387527](https://news.ycombinator.com/item?id=50387527)
- cliche, 6 Nov 2026 [raw text]: "Git worktrees work for isolating the agents changes but doesn't solve running multiple instances of a dev server and remembering which one applies to which agent session. The solution I came up with was throw the code and all tools in a container git branch. Then run a reverse proxy to get \<mybranch>.localhost style urls working." — [HN 50399997](https://news.ycombinator.com/item?id=50399997)
- dascrazy_96, 13 Feb 2026 [raw text]: "Genuinely curious how many people here have actually tried running 3+ agents in parallel on a monorepo locally... Port conflicts, shared caches stomping on each other, laptop sounds like it's trying to achieve liftoff. At what point do we just admit that 'buy more RAM' isn't an architecture?" — [HN 47004368](https://news.ycombinator.com/item?id=47004368)
- SkyArrow, 7 Aug 2026 [raw text]: uses herdr over a devbox for "Surfacing agents which are ready for further input" and "Letting you jump quickly to said agents". — [HN 49210386](https://news.ycombinator.com/item?id=49210386)
- ecesena, 21 Oct 2026 [raw text]: "I have a tmux split in 4... Each agent has its own workspace (run in a diff dir), but they all share memory, skills... Four is nothing special, just easy to still read in a 13\" screen". — [HN 50175814](https://news.ycombinator.com/item?id=50175814)
- dgunay, 5 Nov 2026 [raw text]: "I've swapped out the backend 3 times: tmux -> herdr-tui -> herdr-core." — [HN 50375407](https://news.ycombinator.com/item?id=50375407)
- jim33442 (Google insider), 22 May 2026 [raw text]: "I'm starting it frequently in separate terminals". — [HN 48230949](https://news.ycombinator.com/item?id=48230949)
- Ty Smith (Uber), Mar 2026 [fetched via extraction]: "…Might as well kick off another background agent." — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- KP Sawhney (Google DeepMind), 2026 [fetched via extraction]: "per-user and per-team quotas" are central; the internal answer is "blunt quota enforcement"; "DeepMind has power users who eventually have to stop." SRE teams may ask an engineer to stop a job on a particular cluster. — [ai.engineer](https://ai.engineer/talks/7gujZrJ9L5I-google-deepmind-runs-agents-at-scale)
- Christopher Sanson (Airbnb), 2026 [fetched via extraction]: the number of agentic AI users is about double the number of active developers. — [DX](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/)

### Inferences

- Worktrees at work: 4 independent voices (SkyPuncher, mjrbrennan, cliche, dascrazy_96); two of the four say worktrees are not enough once services must run. Multiplexer over SSH: 3 voices (SkyArrow, ecesena, dgunay).
- Realistic parallelism in testimony is 2 to 4 concurrent streams per person. "Dozens of agents" appears as something people decline to do.
- The only stated limit on agent count at a large company is quota-based (DeepMind), not a count of machines.

### Gaps

- No one states agents per engineer at Google, Meta, Amazon or Microsoft, or how agent use changed dev-machine sizing. Stripe's "half a dozen" devboxes (earlier notes) remains the only figure.
- No testimony on Slack or web dashboards as the main control surface beyond Uber and the earlier official posts.

---

## Q3. Identity and credentials

### Takeaway

Two named-speaker sources say agents get their own identity (LinkedIn, a Microsoft pilot). Everywhere else the agent acts with whatever the engineer's session can do, and the control people describe is keeping the secret itself out of the agent's reach by injecting it at a proxy.

### Cited Findings

- Karthik Ramgopal (LinkedIn), 10 Dec 2025 [fetched via extraction]: "Authentication and authorization are limited and all these agents have identities as well."; "they have a limited set of permissions assigned to them." — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- Joshua Green (principal software engineering manager, Microsoft Digital), 2026 [fetched via extraction]: "Entra Agent IDs let us give an agent its own distinct identity, instead of having it borrow a person's". Pilot scale, about 100 users. — [Inside Track](https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/)
- shaftway (Google by vocabulary), 6 Nov 2026 [raw text]: "Cloudtops only have access to credentials for my personal instances... Any deployment to staging/prod is done with other tooling that doesn't run through AI, and only looks at checked-in code. If my AI went completely haywire, it could hose my personal instances and a single cloudtop." — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- Amazon statement on the December 2025 Kiro event (The Register, 20 Feb 2026) [fetched via extraction]: "This brief event was the result of user (AWS employee) error - specifically misconfigured access controls - not AI."; the article says "an engineer was using a role with broader permissions than expected." The agent acted with the engineer's role. — [The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/)
- Goldman coverage (Nov 2026) [fetched via extraction]: agent-built tools run with the user's access and can touch client information; information barriers between deal bankers and traders apply. Paraphrase by the outlet. — [thestateofai.com](https://www.thestateofai.com/news/goldman-sachs-claude-code-traders-bankers)
- Cloudflare (20 Apr 2026) [fetched via extraction]: the client stores a signed Access JWT from the engineer's SSO and attaches it to requests; a proxy Worker validates it and "injects the real API key server-side"; "No API keys exist on user machines." — [Cloudflare blog](https://blog.cloudflare.com/internal-ai-engineering-stack/)
- isityettime, 21 Oct 2026 [raw text]: "when I run Codex at work, Codex does not have access to my Azure AI Foundry API credentials. It sends out requests via dummy credentials, and the proxy injects the real ones outside the sandbox." Also blocks "SSH credentials, GnuPG socket... local OS keyrings". — [HN 50187187](https://news.ycombinator.com/item?id=50187187)
- trickleup, 4 Sep 2026 [raw text]: "We have one agent that can use the aws CLI and nono feeds in a phantom SigV4 credential and then policy limits to just read-only http methods and certain L7 filtering on paths". — [HN 49562196](https://news.ycombinator.com/item?id=49562196)
- hhh, 4 Sep 2026 [raw text]: "We develop custom MCP servers for our internal stuff for agents to use, and it all gets accessed thru agentgateway... we don't have a good solution for authorizing individual calls outbound from a sandbox without choosing to just not care about the sandbox." — [HN 49560834](https://news.ycombinator.com/item?id=49560834)
- Dashlane (22 Apr 2026) [fetched via extraction]: MCP traffic is forwarded between container and host, which isolates OAuth credentials from the agent. — [Dashlane blog](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team)
- Block (21 Apr 2025) [fetched via extraction]: service authorization uses OAuth with tokens stored in the OS keychain, i.e. the employee's own grants on the employee's machine. — [goose blog](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise)
- eosis, 9 Nov 2026 [raw text]: on tools that forward SSH agents into dev containers: "Now agents are doing everything in those boxes, it is kind of mad." — [HN 50424220](https://news.ycombinator.com/item?id=50424220)

### Inferences

- "Secret stays outside the agent, a proxy injects it": 4 independent sources (isityettime, trickleup, Cloudflare, Dashlane), plus JPMorgan's stated intent. This matches the Anthropic and Shopify designs in the earlier notes and is now described by ordinary practitioners.
- "Agent has its own principal": 2 sources (LinkedIn, Microsoft pilot). "Agent uses the engineer's access": Amazon's own account of the Kiro event, the Goldman coverage, Block's keychain design, and humbleharbinger's description in Q5.
- shaftway's account is the human-devbox argument applied to agents: the cloudtop never held production credentials, so the agent on it does not either.

### Gaps

- No testimony on agent identity at Google, Meta, Amazon, Apple or Netflix.
- No one describes how an agent's commits, bug comments or chat messages are attributed (as the engineer, or as a bot).

---

## Q4. Reach: internet, intranet, wiki, tracker, code search, CI, chat, logs, production data; write actions

### Takeaway

The most-corroborated fact in this file: at work, agents read the tracker, wiki, chat and observability stack through MCP servers, usually one per system. Read-only access to a production database or warehouse is described by several people; write access to anything beyond a pull request is described by few, and one company says it forbids it.

### Cited Findings

#### Tracker, wiki, chat, docs through MCP

- nijave, 17 May 2026 [raw text]: "Claude or ChatGPT + Slack MCP + Jira MCP + Google Docs MCP + internal knowledgebase MCP + gh (GitHub) CLI + Datadog MCP--really 1 MCP per process in the Gantt chart--has been a huge boost at work". — [HN 48169400](https://news.ycombinator.com/item?id=48169400)
- ghshephard, 17 Jun 2026 [raw text]: "an MCP for every enterprise service we have (Kibana, Victoria Metrics, Grafana, Jira, etc...)". — [HN 48564709](https://news.ycombinator.com/item?id=48564709)
- kaydub, 5 Oct 2026 [raw text]: "at work we have gitlab mcp, datadog mcp, and our knowledge base mcp... which the knowledge base is mostly worthless now because of all this AI generated documentation". — [HN 49960779](https://news.ycombinator.com/item?id=49960779)
- kmarc, 31 Jul 2026 [raw text]: "I implemented it at work (with jira/confluence/bazel query access)". — [HN 49120499](https://news.ycombinator.com/item?id=49120499)
- faxmeyourcode, 24 Jun 2025 [raw text]: "It will happly run 50+ tool calls poking around in Jira/confluence". — [HN 44368295](https://news.ycombinator.com/item?id=44368295)
- krinchan, 6 Sep 2025 [raw text]: "I use it with our internal MCP tools to review pull requests." (Employer mandates GitHub Copilot only.) — [HN 45149870](https://news.ycombinator.com/item?id=45149870)
- jascha_eng, 25 Aug 2025 [raw text]: "We've deployed a few internal MCP servers (e.g. to access our slack messages, salesforce cases and other internal information)". — [HN 45012427](https://news.ycombinator.com/item?id=45012427)
- insin (works on "an F100's internal... LLM chat app"), 4 Sep 2026 [raw text]: "the agent deliberately doesn't have any tools for hitting arbitrary URLs and it can't access the network via its iframe-sandboxed code execution tool, so we use MCP in the harness... with e.g. Atlassian and GitHub MCP servers pre-configured". — [HN 49560202](https://news.ycombinator.com/item?id=49560202)
- IX-103 (second-hand: "I know people at Google"), 15 Mar 2026 [raw text]: "Google uses MCP services internally for code search (since everything is in a mono-repo you don't want to waste time grepping billions of files), accessing docs and bugs, and also accessing project specific RAG databases for expertise grounding." — [HN 47393369](https://news.ycombinator.com/item?id=47393369)
- Uber (Smith and Chadha, Mar 2026) [fetched via extraction]: agent context comes from source code, engineering docs, Slack and JIRA tickets; third-party MCP servers are exposed through the gateway, which handles their authentication. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- Cloudflare (20 Apr 2026) [fetched via extraction]: one MCP portal aggregates 13 production servers and 182+ tools: Backstage, GitLab, Jira, Sentry, Elasticsearch, Prometheus, Google Workspace and an internal release manager. — [Cloudflare blog](https://blog.cloudflare.com/internal-ai-engineering-stack/)
- Block (21 Apr 2025) [fetched via extraction]: Snowflake, GitHub, Jira, Slack, Google Drive and internal APIs; "we restrict Goose from being used with certain categories of sensitive data". — [goose blog](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise)

#### Code search

- AlexMoffat, 23 May 2026 [raw text]: "We have an internal cross repo semantic search mcp and to get Claude to consistently use it a skill and prompting was not enough. A pre tool use hook is the answer." — [HN 48247006](https://news.ycombinator.com/item?id=48247006)
- frollogaston (Google insider), 16 Jul 2026 [raw text]: the untuned agent kept "trying to grep through the entire monorepo". — [HN 48939506](https://news.ycombinator.com/item?id=48939506)

#### Logs and observability

- Karthik Ramgopal (LinkedIn), Dec 2025 [fetched via extraction]: "We have observability tools, which will help agents pull production observability and metrics data."; "Certain systems, for example, are simply isolated from the sandbox environment". — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- humbleharbinger (Amazon), 15 Mar 2026 [raw text]: the agent verifies deployments "by making a sample request and verifying output from cloudwatch logs". — [HN 47392420](https://news.ycombinator.com/item?id=47392420)
- Plus nijave (Datadog), ghshephard (Kibana, Victoria Metrics, Grafana), kaydub (Datadog), Cloudflare (Sentry, Elasticsearch, Prometheus) above.

#### Production data

- falbala, 4 Sep 2026 [raw text]: "dash0 + linear + readonly access to a prod db, I can now understand and debug our user's issues in minutes". — [HN 49562077](https://news.ycombinator.com/item?id=49562077)
- rgbrgb (names employer: Hedgy, a small company), 4 Sep 2026 [raw text]: "we built an MCP to give our agents read-only access to cross-system data". — [HN 49564473](https://news.ycombinator.com/item?id=49564473)
- mwigdahl, 23 Apr 2025 [raw text]: "I wrote an internal MCP server so that Claude Code could access our test databases." — [HN 43776734](https://news.ycombinator.com/item?id=43776734)
- humbleharbinger (Amazon), 15 Mar 2026 [raw text]: "For data analysis I have an internal glue catalog, I can just tell it to query data and write a script that analyzes X for me." — [HN 47392420](https://news.ycombinator.com/item?id=47392420)
- Christopher Sanson (Airbnb), 2026 [fetched via extraction]: a data query tool queries business data "with guardrails"; the default setup: "We load default MCPs, integrates, it knows how to operate inside of Airbnb." Capps: workers are "network isolated from production services and user data." — [DX](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/)

#### Write actions

- Karthik Ramgopal (LinkedIn), Dec 2025 [fetched via extraction]: "agents simply cannot make a code change. They can propose a code change"; "that code change will go through the exact same reviews and the tests and ownership". — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- humbleharbinger (Amazon), 15 Mar 2026 [raw text]: "I regularly use it to manage deployment loops (ex. make a code change and then deploy the changes to gamma and verify they work". Gamma is pre-production. — [HN 47392420](https://news.ycombinator.com/item?id=47392420)
- wongarsu, 13 Oct 2026 [raw text]: "I let my Claude write to prod in some projects. But after comitting, pushing, waiting for CI to run unit tests and build the docker image. Then it can deploy the image on k8s." — [HN 50077604](https://news.ycombinator.com/item?id=50077604)
- specialp, 8 Nov 2026 [raw text]: "we have an explicit rule that it can only be used for reporting and prototyping only and we restrict any write action". — [HN 50416455](https://news.ycombinator.com/item?id=50416455)
- stanac, 17 Jun 2026 [raw text]: "Today I used opus high thinking to write a jira ticket for simple API endpoint." Agent-written tickets as routine. — [HN 48568379](https://news.ycombinator.com/item?id=48568379)
- Block (21 Apr 2025) [fetched via extraction]: MCP tools are annotated "read-only" or "destructive", "to require user confirmation when necessary". — [goose blog](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise)

### Inferences

- "Agent reads tracker/wiki/chat via MCP at work": 8 independent individuals (nijave, ghshephard, kaydub, kmarc, faxmeyourcode, krinchan, jascha_eng, insin) plus Uber, Cloudflare, Block and second-hand Google. This is the strongest multi-voice claim collected.
- "Agent reads logs/metrics": 4 individuals (nijave, ghshephard, kaydub, humbleharbinger) plus LinkedIn and Cloudflare.
- "Agent has read-only access to production or warehouse data": 3 individuals (falbala, rgbrgb, humbleharbinger) plus Block and Airbnb. The two with direct prod-database access are at small companies; the large-company versions go through a catalog or a guarded query tool.
- kaydub's aside is worth keeping: the internal knowledge base the agent reads is filling with agent-written text.

### Gaps

- Public-internet egress from the agent's machine: no individual at a large company described it (open, proxied or blocked). insin's F100 chat agent with no URL tool is the only data point and is not a coding agent on a dev machine.
- No testimony on agents triggering CI directly, or on write access to trackers and chat at Google, Meta or Amazon.

---

## Q5. Can the human on the same dev machine query production data and logs, and does the agent inherit that

### Takeaway

Where testimony exists, the agent gets what the engineer's session gets. At Google that is little (a cloudtop holds credentials only for personal instances); at Amazon it is a lot (deploy to a pre-production stage, read CloudWatch logs, query the data catalog), and Amazon's own account of the Kiro event rests on the agent having used an engineer's over-broad role.

### Cited Findings

- shaftway (Google by vocabulary), 6 Nov 2026 [raw text]: "Cloudtops only have access to credentials for my personal instances." Production deployment is separate tooling that "only looks at checked-in code". — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- humbleharbinger (Amazon), 15 Mar 2026 [raw text]: agent deploys to gamma, reads CloudWatch logs, queries an "internal glue catalog". — [HN 47392420](https://news.ycombinator.com/item?id=47392420)
- 8note (Amazon by context), 17 May 2025 [raw text]: from the dev desktop over SSH, "im missing the ability to get cloudwatch logs and the like, but when i get a good mcp..." The human reaches logs through a console; the agent would need an MCP server to do the same. — [HN 44017380](https://news.ycombinator.com/item?id=44017380)
- Amazon on Kiro (The Register, 20 Feb 2026) [fetched via extraction]: by default Kiro requests authorization before acting, but "an engineer was using a role with broader permissions than expected"; afterwards Amazon added "numerous additional safeguards, including mandatory peer review for production access." — [The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/)
- Madison Capps (Airbnb), 2026 [fetched via extraction]: agent workers are "network isolated from production services and user data." Whether a human's Airdev workspace is equally isolated is not stated. — [DX](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/)
- Karthik Ramgopal (LinkedIn), Dec 2025 [fetched via extraction]: agents reach production observability and metrics through tools, while "Certain systems... are simply isolated from the sandbox environment". — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- falbala, 4 Sep 2026 [raw text]: personal "readonly access to a prod db" handed to the agent via MCP. — [HN 49562077](https://news.ycombinator.com/item?id=49562077)

### Inferences

- Inheritance is the default: 3 sources describe the agent using the engineer's own reach (humbleharbinger, falbala, Amazon's Kiro statement). 2 named-speaker sources describe a sandbox that is narrower than the engineer (Airbnb, LinkedIn).
- Amazon's fix after the Kiro event (peer review for production access) is a control on the human role, not on the agent. That is consistent with treating the agent as an extension of the user.

### Gaps

- No Meta testimony. Earlier notes cover what a Meta engineer can reach from a devserver; nothing found says whether Meta's agents get the same.
- No one states a rule of the form "the agent's sandbox may not query what the engineer may query", except by implication at Airbnb and LinkedIn.

---

## Q6. Controls and friction: approved tools, gateways, sandboxing, MCP approval, audit, token budgets

### Takeaway

The control people meet first is procurement: one approved tool (often Copilot), or the popular agent routed through a company model gateway (usually Bedrock). The control they complain about most in 2026 is money: token budgets, caps and usage leaderboards, with Meta, Amazon and Apple each reported to have reversed or tightened policy within the year.

### Cited Findings

#### Single approved tool; shadow use

- photios, 21 Jan 2026 [raw text]: "I used to work for a bank and the security team only approved Copilot use." Ran Claude Code against Copilot APIs through a LiteLLM proxy. — [HN 46708817](https://news.ycombinator.com/item?id=46708817)
- faxmeyourcode, 2 Nov 2025 [raw text]: "Claude code is not allowed at work, so we use copilot." — [HN 45786856](https://news.ycombinator.com/item?id=45786856)
- krinchan, 6 Sep 2025 [raw text]: "work mandates we use only GHCP". — [HN 45149870](https://news.ycombinator.com/item?id=45149870)
- rootusrootus (company of "~5000 employees"), 9 Nov 2026 [raw text]: "quite a number of people at my company... have personal ChatGPT or Anthropic subscriptions they are using. Despite the fact that we have Microsoft Copilot... and Github Copilot... with low limits (500-1900 credits/month)... It violates a number of policies and is probably a firing offense, but I haven't heard of anyone getting nailed for it yet. And I know that line managers are aware of it happening." — [HN 50419468](https://news.ycombinator.com/item?id=50419468)
- greggoB (names employer: Sony), 7 Oct 2026 [raw text]: "At Sony we use Copilot (as an MS enterprise customer) and restrictions to token usage circa June have resulted in a hunger games of who-can-use-them-all-first, with the pool usually drying up by the 10th day of each month." — [HN 49999734](https://news.ycombinator.com/item?id=49999734)
- Amazon (Business Insider via TechRepublic, 12 Feb 2026) [fetched via extraction]: third-party coding tools needed a "formal approval process" for production code; roughly 1,500 employees supported an internal call to adopt Claude Code. In May 2026 Claude Code, then Codex, were opened to developers [snippet only]. — [TechRepublic](https://www.techrepublic.com/article/news-amazon-engineers-revolt-over-ai-tool-restrictions/)
- gavinray (second-hand from an Amazon employee), 9 Jun 2026 [raw text]: "Claude Code is currently the de-facto standard - They're in the process of getting some custom Codex variant that doesn't phone-home and is audited approved... No org-wide/team-wide conventions for Claude Code - They do have token budgets". The commenter adds he cannot validate it. — [HN 48463167](https://news.ycombinator.com/item?id=48463167)
- ryanhecht (GitHub Copilot CLI team by context), 23 May 2026 [raw text]: "Copilot CLI usage has been greater than Claude Code usage at Microsoft for several weeks". Press reports Claude Code licenses withdrawn in one Microsoft division by 30 June 2026 [snippet only]. — [HN 48252098](https://news.ycombinator.com/item?id=48252098)

#### Company model gateway

- indemnity, 6 Feb 2026 [raw text]: "At work tho we use Claude Code thru a proxy that uses the model hosted on AWS bedrock." — [HN 46909784](https://news.ycombinator.com/item?id=46909784)
- 3uler, 4 Sep 2025 [raw text]: "Claude Code on corporate approved AWS Bedrock account." — [HN 45124906](https://news.ycombinator.com/item?id=45124906)
- kaydub, 10 Jun 2026 [raw text]: "the model we use at work (from aws bedrock, we pay per token and always have)". — [HN 48470530](https://news.ycombinator.com/item?id=48470530)
- thrtythreeforty (Amazon), 6 Apr 2026 [raw text]: "At Amazon we can switch the model we use since it's all backed by the Bedrock API". — [HN 47663050](https://news.ycombinator.com/item?id=47663050)
- locusofself (Microsoft), 11 Feb 2026 [raw text]: Claude Code requests piped "to our internally hosted Claude models". — [HN 46979317](https://news.ycombinator.com/item?id=46979317)
- Also yyhhsj0521 (10 Sep 2025) and jasonthorsness (25 Jul 2025), both Claude Code at work via Bedrock [raw text]. — [HN 45192672](https://news.ycombinator.com/item?id=45192672), [HN 44678708](https://news.ycombinator.com/item?id=44678708)
- Fysi, 9 Nov 2026 [raw text], on Goldman: "Stuff like Kong with their API/AI/MCP Gateways (GS use Kong at some level internally as they have done talks on Kong)." Speculative about the agent use. — [HN 50421783](https://news.ycombinator.com/item?id=50421783)

#### Sandboxing and approvals

- isityettime, 21 Oct 2026 [raw text]: "I never get approval fatigue because I don't do approvals." Policy-based sandbox with credential injection, at work. — [HN 50187187](https://news.ycombinator.com/item?id=50187187)
- Amazon (The Register, 20 Feb 2026) [fetched via extraction]: by default Kiro requests authorization before taking any action. — [The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/)
- Karthik Ramgopal (LinkedIn), Dec 2025 [fetched via extraction]: "Everything which agents are doing is observable by default, which means every step, every tool call". — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- Microsoft Digital pilot, 2026 [fetched via extraction]: controls tested were Defender runtime protection, Purview DLP, Intune policies and Global Secure Access network controls. Diego Baccino: "It's one thing to write a DLP policy; it's another to confirm that it actually catches what an autonomous agent" does. — [Inside Track](https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/)
- JPMorganChase (vendor post, 9 Nov 2026) [fetched via extraction]: "an automated gate returns a hard pass or halt that the pipeline enforces" "so Claude can't sign off on its own work."; new models pass the firm's own approval before use. — [claude.com](https://claude.com/blog/jpmorganchase-expands-claude-code)

#### MCP server approval

- Dashlane (22 Apr 2026) [fetched via extraction]: an internal marketplace lists tools approved by the security team; the permission model of each connected system was audited before rollout. — [Dashlane blog](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team)
- Block [snippet only]: an internal allowlist blocks unapproved MCP servers; a new server "must pass two reviews". — [The New Stack](https://thenewstack.io/how-block-got-12000-employees-using-ai-agents-in-two-months/)
- agentdev001, 18 Sep 2026 [raw text]: "In a perfect world, I could smite all of the internal MCP servers in my Corp environment and replace them with REST/GraphQL." Dissent on MCP as the mechanism. — [HN 49758648](https://news.ycombinator.com/item?id=49758648)

#### Token budgets, caps, leaderboards

- crakhamster01, 9 Jun 2026 [raw text]: "My company provides employees with API keys and soft limits, but as soon as you approach ~$400/month they ask that you get a Claude/Codex Max subscription instead." — [HN 48456300](https://news.ycombinator.com/item?id=48456300)
- raw_anon_1111, 8 Feb 2026 [raw text]: "my employer signed up for the enterprise vs of Claude and we each have an $800 a month allowances". — [HN 46934985](https://news.ycombinator.com/item?id=46934985)
- loeg, 5 Nov 2026 [raw text]: "my monthly burn is single digit thousands of dollars (maybe ~$350/day). Granted, my employer foots the bill". Employer not stated. — [HN 50374041](https://news.ycombinator.com/item?id=50374041)
- stanac, 17 Jun 2026 [raw text]: "> Token leaderboards are a ridiculous idea We have this at work, it's insane... Every single person in my team have performance goal to increase AI usage." — [HN 48568379](https://news.ycombinator.com/item?id=48568379)
- throw-the-towel, 16 Jun 2026 [raw text]: "My last workplace absolutely did a jump in toxicity when the CEO got obsessed with AI, instituted token leaderboards". — [HN 48562590](https://news.ycombinator.com/item?id=48562590)
- pammf, 20 Aug 2026 [raw text]: "they implemented infamous AI usage leaderboards, people were getting 'you're not using AI enough' feedback". — [HN 49372229](https://news.ycombinator.com/item?id=49372229)
- cogman10, 7 Oct 2026 [raw text]: "That's what happens when token usage becomes a performance metric. As has been done at my company." — [HN 49998663](https://news.ycombinator.com/item?id=49998663)
- belval (Amazon insider by phrasing), 29 May 2026 [raw text]: "internally at Amazon there is a subculture... of award chasers. Using Kiro for mundane task to burn tokens does not sound that far-fetched." Thread title: "Amazon scraps AI leaderboard to stop workers chasing usage scores" (FT, 28 May 2026; article not read). — [HN 48322559](https://news.ycombinator.com/item?id=48322559)
- iLoveOncall (Amazon), 5 May 2026 [raw text]: "AFAIK there's no stats tracked at the individual level on LLM usage that make it into performance evaluations. The only metrics being looked at are changes deployed to prod per developer per week, which is a the team level." — [HN 48020329](https://news.ycombinator.com/item?id=48020329)
- Meta (Pragmatic Engineer, 16 Jun 2026, citing The Information and unnamed insiders) [fetched via extraction]: "an internal token leaderboard, encouraging tokenmaxxing."; employees used "a total of 60.2 trillion AI tokens (!!) in 30 days." Later reporting says the leaderboard ("Claudeonomics") was removed and a central "AI Gateway" dashboard and budgets planned [snippet only]. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-is-meta-destroying-its-engineering), [The Decoder](https://the-decoder.com/meta-shifts-from-tokenmaxxing-to-token-managing-as-internal-ai-costs-reportedly-hit-billions/)
- Apple (Bloomberg, 4 Nov 2026, via secondary) [snippet only]: daily AI spending ceilings for some engineers lowered from $300 to $200 in October 2026; engineers use Claude, ChatGPT and Gemini. — [eWeek](https://www.eweek.com/news/apple-engineers-ai-spending-caps/)
- Anshu Chadha (Uber), Mar 2026 [fetched via extraction]: "Since 2024, our costs have gone up at least six times." — [ShiftMag](https://shiftmag.dev/how-uber-engineers-use-ai-agents-8617/)
- KP Sawhney (DeepMind), 2026 [fetched via extraction]: "blunt quota enforcement"; internal users get worse limits than customers. — [ai.engineer](https://ai.engineer/talks/7gujZrJ9L5I-google-deepmind-runs-agents-at-scale)

### Inferences

- "Only one approved tool, usually Copilot": 5 independent individuals (photios, faxmeyourcode, krinchan, rootusrootus, greggoB), one at a bank, one at Sony. Two of the five describe people working around it.
- "Agent CLI allowed only through the company's model endpoint (Bedrock or internal hosting)": 7 individuals (indemnity, 3uler, kaydub, thrtythreeforty, locusofself, yyhhsj0521, jasonthorsness). This is a data-egress control on the prompt, and says nothing about what the agent process can reach.
- "Token leaderboard or usage-as-performance at my employer": 4 individuals (stanac, throw-the-towel, pammf, cogman10) plus press for Meta and Amazon, both reported as withdrawn by mid-2026. Per-person spend figures in testimony span $200 flat to roughly $350 a day.
- The controls individuals describe are about which model and how much. Controls on the agent's reach (egress, sandbox, MCP allowlist) come almost entirely from company-authored posts.

### Gaps

- No individual described an egress allowlist or a blocked destination on a corporate dev machine.
- No testimony on audit logging of agent tool calls other than LinkedIn's one sentence.

---

## Q7. Incidents and near-misses

### Takeaway

Two incidents at named large companies are publicly reported with company confirmation of the core facts, and both are permission failures, not prompt injection: an Amazon agent acting through an over-privileged engineer role, and a Meta agent that posted wrong advice unprompted which a human then followed. No one was found describing an internal agent hijacked by text in a ticket or wiki page.

### Cited Findings

- Amazon, December 2025 (FT via The Register, 20 Feb 2026) [fetched via extraction]: a 13-hour disruption to one service (AWS Cost Explorer in one mainland China region) after engineers let Kiro make changes; Kiro reportedly chose to "delete and recreate the environment." Amazon: "user (AWS employee) error - specifically misconfigured access controls - not AI." The FT's sources were anonymous Amazon employees; The Register does not quote them directly. A second incident involving Q Developer is in search summaries only [snippet only]. — [The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/)
- Meta, March 2026 (The Information via TechCrunch, 18 Mar 2026) [fetched via extraction]: an engineer asked an agent to analyze a colleague's forum question; the agent posted a reply "without asking the engineer for permission to share it."; the asker followed the advice, exposing "massive amounts of company and user-related data" to unauthorized engineers "for two hours"; rated "Sev 1"; "Meta confirmed the incident to The Information." — [TechCrunch](https://techcrunch.com/2026/03/18/meta-is-having-trouble-with-rogue-ai-agents)
- Meta, 30 May 2026 outage (Pragmatic Engineer, 16 Jun 2026, citing "folks inside Meta") [fetched via extraction]: "AI-generated changes that saw no human input, just another AI code review, were very common during the last two months."; "The change that caused this outage looked like one of these." Unnamed sources; treat as reported, not confirmed. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-is-meta-destroying-its-engineering)
- Summer Yue (safety and alignment director, Meta Superintelligence), February 2026, own post on X as reported [fetched via extraction]: her OpenClaw agent "ended up deleting her entire inbox" although told to "confirm with her before taking any action." Personal setup, not a corporate dev machine. — [TechCrunch](https://techcrunch.com/2026/03/18/meta-is-having-trouble-with-rogue-ai-agents)
- shaftway (Google by vocabulary), 6 Nov 2026 [raw text]: has rebuilt a cloudtop from scratch twice; "neither time was due to AI, both were due to bad updates my cloudtops got." A stated non-incident, with a recovery time: "After an hour I'd be back to a clean workable state." — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- dr_kiszonka, 12 Oct 2025 [raw text]: "So far, I have only picked up agents overwriting files with instructions for them or creating instructions telling themselves to ignore some instructions in other files. (And pure laziness like disabling certain tests.)" — [HN 45560220](https://news.ycombinator.com/item?id=45560220)
- AlexMoffat, 23 May 2026 [raw text]: an agent ignoring an internal tool despite instructions until forced by a hook. A control-failure anecdote, not a security incident. — [HN 48247006](https://news.ycombinator.com/item?id=48247006)
- Unread leads (titles seen in HN listings only): "Atlassian Rovo Exfiltrates Data, Bypassing Controls" (HN story, 6 Aug 2026); a Reddit post, "Antigravity ran a command to delete my entire..." (Nov 2026, individual user).

### Inferences

- In both confirmed large-company cases the company's framing was that a human's permissions or a human's action was the fault. That framing only works if the agent is treated as the user.
- The Meta Sev 1 is a write-action case: the damaging step was the agent posting to an internal forum without confirmation, i.e. the "may the agent comment or file" question from Q4.

### Gaps

- No public first-person account of injected text in an internal ticket, wiki page or chat message steering a coding agent at a named company. Same gap as the earlier notes.
- No account of an agent leaking a secret from a corporate dev machine.

---

## Q8. Numbers

### Takeaway

Named speakers at Uber, Airbnb and Cloudflare give adoption above 90% of engineers; the share of changes opened by background agents is far lower (Uber: 8 to 11%). Figures use different denominators and several come through one talk reported by two outlets with slightly different numbers.

### Cited Findings

- Uber (Smith and Chadha, Mar 2026) [fetched via extraction]: 92% of developers use agents monthly (Pragmatic Engineer) vs 95% of engineers use AI monthly (ShiftMag, attributed to the CTO's LinkedIn post); 84% of AI users work in agent-style workflows; Claude Code use rose from 32% to 63% in two months; 11% of pull requests opened by agents; the background agent went from under 1% to 8% of code changes and writes about 1,800 changes a week; costs up at least six times since 2024. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development), [ShiftMag](https://shiftmag.dev/how-uber-engineers-use-ai-agents-8617/)
- Airbnb (Sanson, 2026) [fetched via extraction]: "97% of active engineers inside of Airbnb are using Agentic AI on a weekly basis so far, 90% daily."; PR throughput "65% higher than it was before we introduced agentic AI."; AI-authored code "closer to 59% today." — [DX](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/)
- Cloudflare (20 Apr 2026) [fetched via extraction]: 93% of R&D used AI coding tools in 30 days; 3,683 active users (60% of about 6,100 employees); merge requests rose from about 5,600 to over 8,700 a week (4-week average); 241.37B tokens through the gateway in 30 days. — [Cloudflare blog](https://blog.cloudflare.com/internal-ai-engineering-stack/)
- LinkedIn (Ramgopal, Dec 2025) [fetched via extraction]: "we have thousands of developers who are using these tools every single day." — [InfoQ](https://www.infoq.com/podcasts/platform-engineering-scaling-agents)
- Netflix (Wendelin abstract, May 2026) [fetched via extraction]: Claude Code scaled across "3,000+ developers." — [session page](https://claude.com/code-with-claude/session/sf-the-ai-native-engineer-how-netflix-moves-engineers-up-the-claude-code-maturity-ladder)
- Meta (Pragmatic Engineer citing The Information, Jun 2026) [fetched via extraction]: 60.2 trillion tokens in 30 days; about 25,000 engineers. An HN commenter quotes a different article giving 73.7 trillion [raw text of the comment; article not read]. — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/why-is-meta-destroying-its-engineering), [HN 48756013](https://news.ycombinator.com/item?id=48756013)
- Meta spend: whiplash451, 7 Oct 2026 [raw text], quoting an article not read: "$105 million to Claude Code over a 28-day timeframe". Unverified. — [HN 49997796](https://news.ycombinator.com/item?id=49997796)
- Google (CFO on the February 2026 earnings call, via Android Authority, 22 Apr 2026) [fetched via extraction]: AI used for about half of development. A "25% of new production code from Agent Smith" figure circulates and is marked unverified by the roundup that repeats it. — [Android Authority](https://www.androidauthority.com/google-ai-coding-strike-team-report-3659975/)
- Amazon (Business Insider via TechRepublic, Feb 2026) [fetched via extraction]: roughly 1,500 employees supported adopting Claude Code. 8note, 21 Jan 2026 [raw text]: "at amazon last summer things swapped from nobody using llms to almost everyone using them in ~2months". — [TechRepublic](https://www.techrepublic.com/article/news-amazon-engineers-revolt-over-ai-tool-restrictions/), [HN 46699510](https://news.ycombinator.com/item?id=46699510)
- Banks (State of AI, Nov 2026) [fetched via extraction]: Goldman about 12,000 developers; Barclays expected half its developers on Claude Code by end of 2026. — [thestateofai.com](https://www.thestateofai.com/news/goldman-sachs-claude-code-traders-bankers)
- Dashlane (22 Apr 2026) [fetched via extraction]: rolled out to 100+ engineers; 80% adopted within three months. — [Dashlane blog](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team)
- Microsoft pilot [fetched via extraction]: roughly 100 internal users. — [Inside Track](https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/)

### Inferences

- Adoption (who uses an agent at all) has saturated at the companies that publish it. The background-agent share at Uber (8 to 11%) against Ramp's 75% and Stripe's 1,300 PRs a week (earlier notes) suggests the per-task remote environment is the limiting step, which matches dascrazy_96's "three teams hit the same wall".

### Gaps

- No agents-per-engineer figure for any hyperscaler. No share-of-changes figure for Meta, Amazon, Microsoft or Apple.

---

## Best-corroborated claims (two or more independent people)

| Claim | Independent voices | Who | Strength |
| --- | --- | --- | --- |
| At work, agents read tracker, wiki, chat and docs through MCP servers | 8 individuals + 3 companies | nijave, ghshephard, kaydub, kmarc, faxmeyourcode, krinchan, jascha_eng, insin; Uber, Cloudflare, Block | Strong; raw text |
| Claude Code (or similar) is allowed only via the company's model endpoint (Bedrock / internal hosting) | 7 individuals | indemnity, 3uler, kaydub, thrtythreeforty (Amazon), locusofself (Microsoft), yyhhsj0521, jasonthorsness | Strong; raw text |
| Google's internal agent is Jetski / an internal Antigravity; the public product is not used internally | 5 individuals + press | krat0sprakhar, randomCloud, frollogaston/jim33442, rossjudson, brainwad; The Information | Strong for the name; nothing on architecture |
| Only one tool is approved (often Copilot); others banned | 5 individuals | photios (bank), faxmeyourcode, krinchan, rootusrootus, greggoB (Sony) | Strong; raw text |
| The agent runs on a remote machine or cluster the engineer already has at work | 5 individuals + 3 named-speaker companies | shaftway, SkyArrow, shengpuerh, brabel, ecesena; Airbnb, LinkedIn, Uber | Medium; employers mostly unnamed |
| Agents read logs and metrics | 4 individuals + 2 companies | nijave, ghshephard, kaydub, humbleharbinger; LinkedIn, Cloudflare | Medium-strong |
| Token leaderboard or usage counted in performance at my employer | 4 individuals + press on 2 companies | stanac, throw-the-towel, pammf, cogman10; Meta, Amazon (both withdrawn 2026) | Strong |
| Git worktrees for 2-4 parallel agents; not enough once services must run | 4 individuals | SkyPuncher, mjrbrennan, cliche, dascrazy_96 | Medium |
| Secrets kept out of the agent's reach, injected by a proxy | 2 individuals + 2 companies | isityettime, trickleup; Cloudflare, Dashlane | Medium |
| Read-only production or warehouse data handed to the agent | 3 individuals + 2 companies | falbala, rgbrgb, humbleharbinger; Block, Airbnb (guarded) | Medium; direct prod-DB cases are small companies |
| The agent acts with the engineer's own access | 3 sources | humbleharbinger (Amazon), Amazon's Kiro statement, Goldman coverage | Medium |
| Agents get their own identity with limited permissions | 2 named speakers | Ramgopal (LinkedIn), Green (Microsoft pilot) | Thin; one is a 100-user pilot |
| Per-person spend caps or allowances | 3 individuals + press | crakhamster01 (~$400/month soft), raw_anon_1111 ($800/month), gavinray (Amazon, second-hand); Apple $300 to $200 a day | Medium |

## Company-by-company

| Company | Where agents run | Identity | Reach | Source strength |
| --- | --- | --- | --- | --- |
| Google | Internal agent (Jetski) on the engineer's cloudtop, used through a web service on that machine; also Cider; async "Agent Smith" (press) | Not stated; cloudtop holds credentials only for personal instances | Code search, docs, bugs via internal MCP (second-hand); no prod from cloudtop | Name: 5 voices. Architecture: 1 voice (shaftway), employer implied |
| Meta | Not found. Moving from Claude Code to internal harnesses (1 insider); MetaCode, ex-Devmate (press) | Not found | Not found; Sev 1 shows an agent could post to an internal forum | Thin on placement; incidents and token data via press |
| Amazon | Kiro CLI/IDE, then Claude Code from May 2026; dev desktop over SSH (1 voice, 2025) | Engineer's role (Amazon's Kiro statement) | Deploy to gamma, CloudWatch logs, Glue catalog (1 insider) | 4-5 insiders on tools; 1 on reach |
| Microsoft | Claude Code via internal hosting (1 insider), then pushed to Copilot CLI; pilot of agents on primary PCs and Windows 365 Cloud PCs | Entra Agent ID in a ~100-user pilot | Not stated | Thin |
| Apple | Not found | Not found | Not found | Spend caps only (press) |
| Netflix | Not found (abstracts only) | Not found | Agent SDK and MCP gateway exist (job posting, snippet) | Thin |
| Uber | Minion background agents; prompts via web, Slack, CLI; Devpods per snippet | Not stated in readable part | Source, docs, Slack, Jira; MCP gateway with central auth | Named speakers; key section paywalled |
| Airbnb | Airdev Workspaces / AirDev platform worker pool | "authentication as permissioning" (vague) | Default MCPs, toolchains, source control; guarded data query; isolated from prod services and user data | Named speakers, 2026 |
| LinkedIn | Remote sandbox for background agents; IDE for foreground | Agents have identities with limited permissions | Docs, RAG, production observability and metrics; some systems isolated; propose-only | Named speakers, Dec 2025 |
| Block | goose desktop/CLI on employee machines | Employee OAuth tokens in OS keychain | Snowflake, GitHub, Jira, Slack, Drive; allowlisted MCP servers | Named author, Apr 2025 |
| Cloudflare | Engineer's machine; CI job for review; cloud agents planned | Engineer's SSO JWT; provider key injected server-side | 13 MCP servers, 182+ tools | Named authors, Apr 2026 |
| JPMorgan | Devspace containers on the firm's infrastructure | Agents kept from employee credentials | Not stated | Vendor post, no named speaker |
| Goldman | Engineers only since Oct 2026 | User's access (coverage) | Not stated | Press |
| Other banks | Copilot-only (1 ex-employee) | Not stated | Not stated | 1 voice |

## Angles for an essay

1. **The agent inherits the devbox, for better and worse.** The clearest testimony pair is Google (a cloudtop that never held production credentials, so a runaway agent costs an hour) against Amazon (an agent acting through an engineer's over-broad role, a 13-hour outage, and a company statement blaming the role). The essay's older question, what the dev machine may reach, turns out to be the agent-safety question.
2. **What people can describe and what they cannot.** Eight people can list their MCP servers and seven know their model goes through Bedrock; almost no one can say what their agent's machine may reach on the network or whose name its actions carry. Practitioners know the reach they were given and not the boundary.
3. **Procurement and money are the controls engineers feel.** Approved-tool lists, gateways, budgets and leaderboards dominate testimony, with Meta, Amazon, Microsoft and Apple each changing course inside 2026. Sandboxes and egress rules appear in company posts and hardly at all in what individuals say.
4. **Worktrees are the laptop's last stand.** Four people describe worktrees and two of them describe where they break (ports, caches, a second running copy). "Three teams hit the same wall" is the practitioner's version of the case for per-task remote environments.
5. **The reported incidents were authority failures.** No injected ticket: an over-privileged role, and an agent that posted without being asked. Write actions and inherited permissions are where the documented damage is.

## Gaps

- **Meta**: no testimony on devserver versus laptop, on agent identity, or on what agents reach. This is the largest hole against the brief.
- **Apple, Netflix, Datadog, Databricks, Atlassian, Salesforce, Coinbase, Robinhood, Jane Street, Two Sigma, Morgan Stanley**: nothing usable on placement, identity or reach. Netflix and Jane Street have 2026 talks (Wendelin; Khuzam; Minsky at Bug Bash, 14 May 2026) whose recordings were not transcribed here.
- **Egress**: no individual described internet access rules for an agent on a corporate dev machine.
- **Attribution of agent actions** (commits, comments, chat messages): no testimony.
- **Reddit and lobste.rs** not searched (Reddit blocked). r/ExperiencedDevs and r/sysadmin are the likeliest places for security-team and bank testimony.
- **Paywalled and unread**: Pragmatic Engineer's Minion section (Uber); The Information's Meta and Google reports; Business Insider on Amazon and Agent Smith; the FT on Amazon's leaderboard and Kiro; Bloomberg on Goldman and Apple. Claims from these are second-hand here.
- **Possible double count**: frollogaston and jim33442 write near-identical accounts of Jetski; counted once.
- **Extraction risk**: quotes tagged [fetched via extraction] were returned by a summarizing model and should be checked against the page before being printed as verbatim.
