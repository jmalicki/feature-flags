# GPUs and coding agents as newer pressures on where development happens

Scoping pass, researched 2026-11-26. About 40 searches and fetches.

How to read the tags:

- **[fetched]**: I fetched the page. The text came back through a fetch tool that summarizes the page with a small model, so quoted strings are what that tool reported as verbatim. Re-check any quote against the page before it goes into the essay.
- **[snippet]**: search-result summary only; the page was not fetched. Treat as a lead, not a fact.
- **(vendor)**: the source sells the thing it describes.

Dates are publication dates unless stated.

## A1. How large companies give engineers and researchers interactive GPU access for development

### Takeaway

Public first-person accounts are thin and almost all concern batch training; the few that mention development describe a small, deliberately limited interactive lane carved out of a shared, queued cluster (Shopify, Runway, OpenAI in 2016), not a GPU bolted to each engineer's dev machine. I found nothing first-person from Meta, Google, Microsoft, Anthropic, Netflix, Airbnb, LinkedIn, Pinterest, Stripe, Databricks or Two Sigma on interactive GPU development.

### Cited Findings

- Shopify (Jan 26, 2026, Javier Moreno): a dev environment is an ordinary cluster job with one label. "Add one label to your YAML, `ml.shopify.io/dev: "true"`, and the system treats it differently." It gets the interactive priority class and is exempt from the GPU reaper. [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify: the user experience is a devbox reached by ssh: `sky launch -c devbox dev.yaml`, then `ssh devbox`; `sky down devbox` ends it, and `autostop` can be set. Jupyter is run "with port forwarding". [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify: "We run clusters on Nebius and GCP." Nebius has "H200s with InfiniBand interconnect"; GCP L4 GPUs are used "for development". [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify, older platform (Merlin, 2022): users prototype in a centrally hosted JupyterHub and connect to per-use-case "Merlin Workspaces" on Ray through the Ray Client API. [snippet] — [Shopify Engineering](https://shopify.engineering/merlin-shopify-machine-learning-platform)
- Runway (Apr 27, 2026, Matt Kafonek and Brannon Dorsey): alongside reserved team queues and a shared opportunistic queue, there are special-purpose queues including "local development so engineers can iterate against real GPUs without competing with training runs." The post does not describe how the dev queue is used. [fetched] — [Runway](https://runway.com/news/no-idle-gpus-managing-research-compute-at-runway)
- OpenAI (Aug 29, 2016; old, but a rare first-person account): "We provide a cluster of SSH nodes (both with and without GPUs) for ad-hoc experimentation." Also: "We also run our own physical servers, primarily running Titan X GPUs." [fetched] — [OpenAI](https://openai.com/index/infrastructure-for-deep-learning)
- Uber (Ray Summit 2023 session abstract): Michelangelo established "a scalable and interactive development environment capable of utilizing hundreds of A100 GPUs on Ray". [snippet] — [Ray Summit 2023](https://raysummit23.anyscale.com/agenda/sessions/317)
- Uber (Apr 3, 2025): the Ray-on-Kubernetes post covers resource pools and idle detection that terminates idle Ray clusters to free GPUs, but says nothing about interactive development or notebooks. [fetched] — [Uber Engineering](https://www.uber.com/blog/ubers-journey-to-ray-on-kubernetes-ray-setup)
- Lyft: LyftLearn offers hosted Jupyter or RStudio notebooks on Kubernetes, with a dedicated cluster "optimized for interactive development and long-running jobs". No GPU detail found. [snippet, third-party summary] — [ZenML database](https://www.zenml.io/mlops-database/lyft-lyftlearn-kubernetes-based-ml-model-training-platform-lyftlearn-for-containerized-training-hyperparameter-tuning-an)
- Netflix: only older slide material describing a lifecycle that starts on a cloud workstation with notebooks and moves to workflows; nothing current or GPU-specific. [snippet] — [SlideShare deck](https://es.slideshare.net/BillLiu31/metaflow-the-ml-infrastructure-at-netflix)

### Inferences

- The two recent first-person accounts (Shopify, Runway) both treat interactive GPU work as a scheduling class inside the training cluster, not as a property of the engineer's ordinary dev machine. That suggests GPU development forms a second remote-dev system beside the CPU devbox fleet, owned by the ML platform team and governed by cluster scheduling rules.
- The scarcity of public accounts is itself a finding: companies publish about training clusters and about CPU devboxes, and the interactive GPU case falls between the two.

### Gaps

- No first-person source found for Meta, Google, Microsoft, NVIDIA (dev access specifically), Anthropic, Netflix, Airbnb, LinkedIn, Pinterest, Spotify, Stripe, Databricks or Two Sigma. Two searches for Meta devserver GPU access returned only training-cluster material.
- Whether any large company attaches a GPU permanently to a personal dev machine: no source either way.

## A2. Attached, reserved, pooled or notebook? Quotas, idle reclamation, preemption, utilization

### Takeaway

Where it is described, interactive GPU capacity is drawn from a shared pool under quota and priority, capped small, and policed by idle reapers. The best number on why: in one production notebook trace, reserved GPUs sat idle over 81% of the time.

### Cited Findings

- Shopify: the GPU reaper is "a service that terminates jobs running below 20% GPU utilization for extended periods." Dev environments are exempt. [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify: dev environments are capped: "They're limited to one GPU, because if you need eight, you're probably not debugging anymore." [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify: priority classes are "emergency, interactive, automated-low-priority, lowest"; "Emergency jobs can kick out batch work"; quota groups map to Kueue queues. No quota numbers given. Volumes are cleaned up after seven days of disuse. [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Runway: reserved ClusterQueues have a nominal quota and "`borrowingLimit: 0`"; the default queue is "the shared, opportunistic pool" that borrows unused reserved quota and is preempted when owners need it back. Preemption is slow: "there can be a 20–30 minute gap between "preemption initiated" and "reserved job running,"". [fetched] — [Runway](https://runway.com/news/no-idle-gpus-managing-research-compute-at-runway)
- Runway: "We increased GPU utilization by over 20 percentage points"; "In practice our utilization is ~2x industry norms." No absolute utilization figure. [fetched] — [Runway](https://runway.com/news/no-idle-gpus-managing-research-compute-at-runway)
- NVIDIA (Nov 25, 2025; first-person about its own fleet): idle defined as "A workload was considered idle when a full hour of continuous GPU inactivity was detected." Waste patterns listed include "Unattended interactive sessions" and CPU-only jobs on GPU nodes. Result: "GPU waste was reduced from roughly 5.5 % to about 1%." Fleet size not stated. [fetched] — [NVIDIA Developer Blog](https://developer.nvidia.com/blog/making-gpu-clusters-more-efficient-with-nvidia-data-center-monitoring/)
- NotebookOS paper (arXiv v2 Oct 2, 2025; ASPLOS '26), using a trace from an internal Adobe research cluster: "reserved GPU resources were idle over 81% of the time"; "only about 15% of all reserved GPUs are actively utilized"; 74-75% of sessions used their GPUs at most 5% of the session lifetime. The cluster is described as roughly 12k V100 GPUs costing about $18.3 million a month. Academic paper, not an Adobe engineering account. [fetched, first 100k characters of the page] — [arXiv 2503.20591](https://arxiv.org/html/2503.20591v2)
- Uber: idle detection terminates idle Ray clusters to free GPU resources. [fetched] — [Uber Engineering](https://www.uber.com/blog/ubers-journey-to-ray-on-kubernetes-ray-setup)
- Red Hat (Aug 31, 2026, vendor): notes most platform idle cullers watch UI or session activity rather than GPU engine utilization, and proposes culling on DCGM metrics. [snippet] — [Red Hat Developer](https://developers.redhat.com/articles/2026/08/31/stop-wasting-gpu-allocation-in-kubernetes-with-gpu-pruner)

### Inferences

- The economics invert the CPU devbox argument. A CPU devbox that idles overnight is cheap enough to tolerate; an idle GPU is not, so GPU development is where "persistent personal machine" breaks first and where reclamation is enforced by machine rather than by policy.
- Shopify exempts dev from the utilization reaper but caps it at one small GPU. That is one coherent answer to the idle problem: accept idleness, bound its cost. The NotebookOS design (bind a GPU only while a cell executes) is the opposite answer.

### Gaps

- No published time-slot reservation system (book a GPU for a window) found at any company.
- No company publishes interactive-versus-batch share of GPU hours, or per-person interactive quotas.
- NVIDIA's reaper default threshold is not stated in the article body.

## A3. Published sizes of GPU dev machines

### Takeaway

Almost nothing is published. The only concrete spec is Shopify's: one GPU per dev environment, L4 class.

### Cited Findings

- Shopify: dev environments are limited to one GPU; L4s on GCP are used for development, while training uses H200s (example request `accelerators: H200:8`). [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- OpenAI (2016): the interactive phase of an experiment ran "on a single Titan X" before scaling to 60 and then "nearly 1600 AWS GPUs". [fetched] — [OpenAI](https://openai.com/index/infrastructure-for-deep-learning)
- Uber (2023 abstract): interactive environment "capable of utilizing hundreds of A100 GPUs on Ray"; this is a cluster ceiling, not a per-person machine. [snippet] — [Ray Summit 2023](https://raysummit23.anyscale.com/agenda/sessions/317)

### Inferences

- The consistent pattern across a decade (OpenAI 2016, Shopify 2026) is one modest GPU for the interactive phase, with scale-out handled by submitting to the cluster.

### Gaps

- No published cores/RAM/GPU specification for a GPU dev machine at Meta, Google, Microsoft or any other large company was found.

## A4. Notebooks versus ssh/IDE on a devbox; how code moves from interactive work to cluster jobs

### Takeaway

Both exist. Older platforms (Shopify Merlin, LyftLearn, Netflix) center on hosted notebooks; the most recent account (Shopify 2026) is ssh to a devbox defined by the same YAML as a batch job, which makes the move to the cluster a matter of changing a label and resource request.

### Cited Findings

- Shopify 2026: dev and batch share one job format (SkyPilot YAML); the dev label is the difference. The post does not explicitly describe promoting code from dev to cluster. [fetched] — [Shopify Engineering](https://shopify.engineering/skypilot)
- Shopify 2022 (Merlin): prototype in JupyterHub against a Ray workspace, then move to production through Airflow or Oozie; CI builds a Docker image from project code. [snippet] — [Shopify Engineering](https://shopify.engineering/merlin-shopify-machine-learning-platform)
- OpenAI 2016: "Ideally, you can just SSH into a machine, run a script in screen, and get a result in less than an hour." Containers slow iteration: "building a new Docker container can add precious extra seconds to a researcher's iteration cycle", so they built tooling to ship code from a laptop into a standard image. [fetched] — [OpenAI](https://openai.com/index/infrastructure-for-deep-learning)
- Uber: a third-party summary of a 2025 talk says Jupyter notebooks run inside Ray clusters and are exposed to users. [snippet, third-party] — [ZenML database](https://www.zenml.io/mlops-database/uber-michelangelo-modernization-ray-on-kubernetes-ray-based-distributed-training-on-kubernetes-for-michelangelo-using-de)
- Uber: its own blog says of the first-generation platform that collaboration in the "Michelangelo 1.0 UI and Jupyter Notebook was difficult". [snippet] — [Uber Engineering](https://www.uber.com/blog/from-predictive-to-generative-ai)

### Inferences

- Making the interactive session the same object as the batch job (same image, same spec, different priority class) is the ML analogue of making the devbox match CI. It removes the "works in my notebook" gap.

### Gaps

- No source compares notebook and ssh/IDE usage shares for ML work at any company.

## B1. Published accounts of companies running coding agents in remote environments rather than on laptops

### Takeaway

By late 2026 there is a consistent body of first-person accounts (Stripe, Ramp, Spotify, Uber, Cursor, Google) saying agents run in remote, isolated, pre-warmed environments, one per task, and that companies with existing devbox fleets reused them for agents. Stripe's is the clearest: devboxes built for humans turned out to be what agents needed.

### Cited Findings

- Stripe (Feb 9, 2026, Alistair Gray): a minion run starts in "an isolated developer environment", "the same type of machine that Stripe engineers write code on." "Devboxes are pre-warmed so one can be spun up in 10 seconds, with Stripe code and services pre-loaded." "They're isolated from production resources and the internet, so we can run minions on devboxes without human permission checks." "This also gives parallelization without the overhead of something like git worktrees". [fetched] — [Stripe Dev Blog, part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- Stripe (Feb 19, 2026): "A Stripe devbox is an AWS EC2 instance that contains our source code and runs services under development." "In DevOps terminology, devboxes are “cattle, not pets”: they’re standardized and easy to replace". "we proactively provision and warm up a pool of devboxes so they are ready when a developer wants them"; warming "includes cloning gigantic git repositories, warming Bazel and type checking caches". Agents require "a cloud developer environment that’s parallelizable, predictable, and isolated." [fetched] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Stripe: devboxes predate agents ("We built out devboxes for the needs of human engineers, long before LLM coding agents existed"); the harness is a late-2024 internal fork of Block's goose. [snippet, quoting the Stripe posts] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Ramp (Ramp's own post; date not shown on fetched page, third-party coverage places it in January 2026): "Each session runs in a sandboxed VM on Modal with everything an engineer would have locally". Sessions are "strictly better than local: same intelligence, more power, and unlimited concurrency." Images are rebuilt on a schedule: "We build these images every 30 minutes." Warming starts "as soon as a user starts to type their prompt." [fetched] — [Ramp Builders](https://builders.ramp.com/post/why-we-built-our-background-agent)
- Ramp via Modal (Feb 19, 2026, Modal product marketing; vendor): the sandbox holds Postgres, Redis, Temporal, RabbitMQ, a VS Code server, a web terminal and a VNC stack with Chromium; supports "hundreds of concurrent sessions"; Ramp's Rahul Sengottuvelu is quoted calling it "effectively hundreds of computers that they can work on simultaneously." [fetched] — [Modal](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal)
- Spotify (Dec 9, 2025, Max Charas and Marc Bruggmann): "The agent runs in a container with limited permissions, few binaries, and virtually no access to surrounding systems." "It's highly sandboxed." It "can see the relevant codebase, use tools to edit files, and execute verifiers as tools." [fetched] — [Spotify Engineering, part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)
- Spotify (Nov 6, 2025): tasks start from Slack and GitHub Enterprise; the stated benefit includes people proposing changes "without cloning and building repos on their laptops." [fetched] — [Spotify Engineering, part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
- Uber (talk recorded May 7, 2026, Nikhil Ramakrishnan): Minion is "a platform aimed at backgrounding toil tasks", traced "from an early container prototype to DevPod, then to Minion", built on "Years of investment in remote dev environments, cloud compute, CI infrastructure"; agents need "reproducible environments, trusted checks, migration primitives, and review workflows." [fetched, session abstract only] — [Background Agents Summit](https://background-agents.com/summit/sessions/nikhil-ramakrishnan/)
- Uber: search summaries of talk coverage say adapting DevPods for agents added requirements for long runtimes, isolation, rapid startup, many concurrent environments, and pre-provisioned Kubernetes "balloon pods", plus a "mega DevPod" holding all repositories. Not confirmed on any page I fetched. [snippet] — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development) (Minion section is paywalled)
- Cursor (Jul 30, 2026, Mathew Hogan and Arvind Saripalli; vendor writing about its own internal use): "the development environment is a product in its own right, only one whose users are agents." With their own computers, "agents could now test their changes end-to-end, and prove the correctness of their work to the user." Cloud VMs are Linux while most developers are on Macs, so setup scripts had to be adapted for Ubuntu. [fetched] — [Cursor](https://cursor.com/blog/cloud-agent-environment)
- Cursor (Mar 25, 2026, vendor): cloud agents "run in isolated virtual machines, each with a terminal, browser, and full desktop." Self-hosting exists because some customers "cannot let code, secrets, or build artifacts leave their environment". Brex, Money Forward and Notion are named as users; Money Forward is building a workflow for "nearly 1,000 engineers to create pull requests directly from Slack." [fetched] — [Cursor](https://cursor.com/blog/self-hosted-cloud-agents)
- Google (Oct 22, 2026, Ramanathan Venkatapathy and Rohit Jnagal; product announcement, but describes internal infrastructure): "Giving a model hands with which to interact with the digital world means giving every agent its own computer". "We needed both the isolation of a VM and the speed and density of a container. We also needed a system that knows when an agent is working and when it is waiting." The platform powers "Gemini, Gemini platform, Antigravity, and our internal model evaluation and reinforcement learning pipelines". [fetched] — [Google Cloud Blog](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)
- Anthropic (Oct 20, 2025): "Claude Code on the web executes each Claude Code session in an isolated sandbox." [fetched] — [Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)
- Ona, formerly Gitpod (Sep 2, 2025, Johannes Landgraf; vendor): the cloud-dev-environment company rebranded around agents; each agent gets an "ephemeral environment with full OS-level isolation." CEO quote in press coverage: "IDEs defined the last era. Agents define the next." [first part fetched; CEO quote snippet] — [Ona](https://ona.com/stories/gitpod-is-now-ona); [The Register](https://www.theregister.com/2025/09/03/gitpod_rebrands_as_ona/)
- GitHub Copilot coding agent: runs in a sandbox on GitHub Actions with firewalled internet access. [snippet] — [GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall)
- Meta: an At Scale talk (Jul 1, 2026, David Pariag) abstract mentions "a journey to safely enable agentic access to Meta's systems" and "deploying guardrails to prevent destructive actions"; nothing about where agents run. [fetched, abstract only] — [At Scale](https://atscaleconference.com/videos/our-journey-to-safely-unleash-agents-at-meta-scale/)

### Inferences

- Companies that already had remote devboxes (Stripe, Uber) reused them; companies that did not (Ramp) rented sandboxes; tool vendors (Cursor, Google, Anthropic, Ona) built the environment as the product. All three paths end at the same shape.
- The stated reason is rarely compute. It is isolation that removes permission prompts, plus parallelism a laptop cannot give. Stripe says so directly.
- Spotify is the outlier in shape: a stripped container with few binaries, not a full dev environment. Its agent does narrow migrations checked by verifiers. So "what the agent needs" depends on task breadth: full-stack tasks want a human-grade environment, fleet migrations want a minimal one.

### Gaps

- No first-person account found for Shopify, Block (goose's runtime environment), Meta (where agents run) or Devin's internals in this pass.
- Uber's agent-specific DevPod requirements rest on search snippets and a paywalled article.
- No source describes agents failing or being worse in remote environments; the sample is self-selected success stories.

## B2. Does agent use change the design answers (ephemeral vs persistent, count per engineer, root, egress, credentials)?

### Takeaway

Yes, and in one direction: toward ephemeral, one-per-task, many-per-engineer environments with full permissions inside and tight limits at the boundary (restricted egress, no real credentials in the box). The most repeated idea is that isolation is what buys autonomy.

### Cited Findings

- Ephemeral and per task. Stripe: "Many engineers use one devbox per task—a Stripe engineer might have half a dozen running at a time." "Humans should be able to give many agents logically separate work." [fetched] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Permissions inside. Stripe: "the quarantined devbox environment means that the agent doesn’t need confirmation prompts"; "so we can safely run the agent with full permissions and skip confirmation prompts"; "any mistakes an agent might make are confined to the limited blast radius of one devbox". [fetched] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Egress and data. Stripe: "minions don’t have access to real user data, Stripe’s production services, or arbitrary network egress." The post also raises concern about agents acting "with a human’s personal credentials." [fetched] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Anthropic (Oct 20, 2025): effective sandboxing "requires _both_ filesystem and network isolation"; internally, sandboxing "safely reduces permission prompts by 84%." For the web product, "sensitive credentials (such as git credentials or signing keys) are never inside the sandbox with Claude Code"; a proxy validates each git operation (for example that a push goes only to the configured branch) before attaching the real token. [fetched] — [Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)
- Google (Oct 22, 2026): "Guest environments hold zero persistent secrets, OAuth refresh tokens, or cloud service account keys in memory or on disk, and have no access to the cloud instance's metadata server." "Assume an attacker controls everything inside the sandbox, and make sure they find nothing there to use." Network: "MicroVMs lack standard virtual network interfaces, default IP gateways, or direct VPC access"; all traffic crosses a brokered gateway with allowlist policy. [fetched] — [Google Cloud Blog](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)
- Root. Google: "Autonomous coding agents need real computers — complete with root privileges, custom compilers, test runners, and persistent git workspaces." [fetched] — [Google Cloud Blog](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)
- Persistence is not settled. Google describes agent workspaces as "Persistent, full-featured Linux computers with root access ... that stay with a developer or coding agent across days or weeks of multi-step refactoring", made cheap by suspending idle sandboxes through "a fast checkpoint-and-restore model" so they consume "zero active resources", with "cloning, snapshot/forking, rewind and rollback". It also observes that "only a small portion of open sessions were running code." [fetched] — [Google Cloud Blog](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)
- OpenAI Codex cloud (docs, undated): "By default, Codex blocks internet access during the agent phase." "Setup scripts still run with internet access so you can install dependencies." Named risks: "Prompt injection from untrusted web content", "Code or secret exfiltration", "Downloading malware or vulnerable dependencies". Access can be opened with a domain allowlist and limited to `GET`, `HEAD`, `OPTIONS`. [fetched] — [OpenAI Codex docs](https://learn.chatgpt.com/docs/cloud/internet-access)
- GitHub Copilot cloud agent (docs, undated): "Copilot cloud agent only has the ability to push to a single branch."; a firewall "restricts Copilot cloud agent's access to the internet"; "By default, workflows are not triggered until Copilot cloud agent's code is reviewed". [fetched] — [GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)
- Cursor (Jul 30, 2026): security features include "network egress restrictions", scoped and proxied git remote access, and "secret redaction in tool results, which prevents the agent from reading secret values even if it tries". [fetched] — [Cursor](https://cursor.com/blog/cloud-agent-environment)
- Ramp: a fresh GitHub App installation token is generated per clone; pull requests are opened with the user's own GitHub token so that users cannot approve their own changes. Sessions are multiplayer: "any number of people can work in one session together". [fetched] — [Ramp Builders](https://builders.ramp.com/post/why-we-built-our-background-agent)
- Freshness replaces persistence. Ramp: "This ensures that at most, the repository is 30 minutes out of date." [fetched] — [Ramp Builders](https://builders.ramp.com/post/why-we-built-our-background-agent)

### Inferences

- The human-era trade (trust the engineer, so give a persistent machine with credentials and network) flips for agents: distrust the occupant, so give root inside and nothing valuable to reach. The pattern "full permissions inside, brokered identity outside" appears independently at Stripe, Anthropic, Google, Cursor and OpenAI.
- The setup-phase/agent-phase split (network on while building the image, off while the agent runs) is a new design element with no clear human-devbox equivalent. It pushes dependency resolution into image build, which is the same pressure that pre-warmed devbox pools already created.
- Ephemeral versus persistent is being dissolved by snapshots and suspend/resume rather than decided: Ramp and Stripe get freshness from pre-built images; Google gets continuity from checkpointing. Both make the environment cheap to hold and cheap to discard.
- Laptop-local agents with sandboxing (Anthropic's 84% figure is for local sandboxing) are the counter-case: isolation can be had without a remote machine. What the laptop cannot supply is parallelism and running while the lid is closed.

### Gaps

- No source states whether human engineers at these companies lost or kept broader access on their own devboxes as agents arrived (for example, whether Stripe tightened egress for human devboxes too).
- No published incident reports of agent-caused damage or exfiltration from a dev environment that motivated these controls.
- The Codex and GitHub docs pages are undated; behavior may have changed.

## B3. Numbers: environments per engineer, startup targets, share of changes written by agents

### Takeaway

Startup targets cluster at seconds (Stripe 10 seconds; Ramp "a few seconds"); environments per engineer is stated once (Stripe, about half a dozen); agent share of merged PRs is reported from about 11% (Uber) to over half (Ramp, Cursor, Ona), all self-reported and defined differently.

### Cited Findings

- Stripe startup: "we aim for it to be ready within 10 seconds." [fetched] — [Stripe Dev Blog, part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Stripe per engineer: "a Stripe engineer might have half a dozen running at a time"; "We frequently see engineers spinning up multiple minions in parallel". [fetched] — [part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2); [part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- Stripe volume: "Over a thousand pull requests merged each week at Stripe are completely minion-produced" (Feb 9, 2026); "Over 1,300 Stripe pull requests (up from 1,000 as of Part 1) merged each week" (Feb 19, 2026). No denominator given. CI is limited to "at most two rounds"; tests number "over three million"; Toolshed has "nearly 500 MCP tools". [fetched] — [part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents); [part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- Ramp share: "~30% of all pull requests merged to our frontend and backend repos are written by Inspect" (Ramp's post, about January 2026). [fetched] — [Ramp Builders](https://builders.ramp.com/post/why-we-built-our-background-agent); later reported as "Roughly half of all merged pull requests" (Feb 19, 2026, vendor post whose intro says "over half") [fetched] — [Modal](https://modal.com/blog/how-ramp-built-a-full-context-background-coding-agent-on-modal). The two differ by date; a third-party summary also cites about 40%. [snippet]
- Ramp concurrency and startup: "There's no limit to how many sessions you can have running concurrently"; "session speed should only be limited by model-provider time-to-first-token." [fetched] — [Ramp Builders](https://builders.ramp.com/post/why-we-built-our-background-agent)
- Cursor share (own monorepo): in December (2025), "roughly one in ten PRs merged to the Cursor monorepo"; by Jul 30, 2026, "they write more than half." [fetched] — [Cursor](https://cursor.com/blog/cloud-agent-environment). Other figures seen only in search summaries: 35% at a Feb 24, 2026 launch and "more than 60%" in a later undated Cursor post. [snippet] — [DevOps.com](https://devops.com/cursor-cloud-agents-get-their-own-computers-and-35-of-internal-prs-to-prove-it); [Cursor](https://cursor.com/blog/self-hosted-machines)
- Uber share: "11% of pull requests opened by agents" (Pragmatic Engineer, figures updated March 2026) [fetched, free portion]; the summit page says Minion is "behind 11% of merged PRs" [fetched]. Opened versus merged is unresolved. Also: "84% of devs at Uber are agentic coding users"; "AI-related costs are up 6x since 2024"; Uber "employs almost 3,000 people in the tech function." — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development); [Background Agents Summit](https://background-agents.com/summit/sessions/nikhil-ramakrishnan/)
- Spotify: "more than 1,500 pull requests that teams across Spotify have merged into our production codebase" from the agent (Nov 6, 2025). Separately, "Since mid-2024, around half of Spotify's pull requests have been automated by this system", which refers to the wider Fleet Management system, not the LLM agent alone. [fetched] — [Spotify Engineering, part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
- Spotify quality gate: an LLM judge vetoes "about a quarter" of agent sessions, and the agent course-corrects "half the time". [fetched] — [Spotify Engineering, part 3](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)
- Ona (vendor, self-reported, Sep 2, 2025): "Last week Ona co-authored 60% of our PRs merged on main and contributed 72% of lines of code merged." [fetched] — [Ona](https://ona.com/stories/gitpod-is-now-ona)
- Meta: a profile of a former Meta developer-infrastructure leader claims agents "eventually submitted 50% of all code changes". Secondary, unverified. [snippet] — [LinearB](https://linearb.io/blog/meta-ai-control-plane-james-everingham-guildai)

### Inferences

- Share-of-PR figures are not comparable: "written by", "started by", "co-authored", "opened" and "merged" are all in use, and Spotify's half includes non-LLM automation. An essay should quote them with their exact wording or not at all.
- The 10-second target matters more for agents than for people. A human creates a devbox a few times a week; an engineer running half a dozen agent tasks at once creates them many times a day, so pool warming moves from convenience to capacity planning.

### Gaps

- No company publishes total agent environments created per day, peak concurrency per engineer, or the cost of the warm pool.
- No startup-time number from Cursor, Google, Uber or Spotify.
- Stripe gives PR counts without a share of all PRs.

## Angles for an essay

1. **The devbox was built for people and turned out to be for agents.** Stripe states it outright; Uber's Minion sits on DevPods. Companies that had already paid for standardized, pre-warmed, replaceable remote machines got agents nearly for free, and those that had not (Ramp) had to rent the equivalent. The earlier investment looks different in hindsight.
2. **Isolation is what buys autonomy.** The argument for remote agent environments is mostly not compute. A quarantined box lets the agent run with full permissions and no prompts (Stripe; Anthropic's 84% fewer prompts). Remote development becomes a security boundary first and a convenience second.
3. **The trust model inverts: root inside, nothing to steal.** Human devboxes trusted the occupant and carried credentials. Agent environments give root and withhold identity, with credentials brokered at a proxy (Anthropic, Google, Cursor) and egress closed by default (Stripe, OpenAI). Open question for the essay: do these controls flow back to human devboxes?
4. **One per task, many per engineer makes creation time the governing metric.** "Half a dozen at a time" and ten seconds to ready turn warm pools, snapshot cadence (Ramp's 30 minutes) and cache warming into the main engineering problem. Ephemeral versus persistent is being dissolved by snapshot, fork and suspend (Google) rather than argued out.
5. **GPUs pull the other way.** Agents make environments cheap, numerous and disposable. GPU development makes them scarce, queued, capped at one device and reaped when idle (Shopify, NVIDIA, the 81% idle figure). A company now runs two remote-dev systems with opposite economics, and the essay could use the contrast to show that "remote dev machine" is not one design.
6. **The environment is becoming a product whose user is not a person.** Cursor says so in those words; Gitpod renamed itself around it. This shifts who the platform team serves and what "developer experience" measures.

Open questions:

- Is the remote, ephemeral, many-per-engineer environment now the default design, or only the default for background agents while interactive human work stays on a persistent box or a laptop? No source gives the split of human versus agent hours on devboxes.
- Local sandboxing is a credible alternative for isolation. How much of the remote case rests on parallelism and unattended running alone?
- All share-of-PR numbers are self-reported and inconsistently defined. Is there any independent measurement?
- Spotify's minimal container versus Stripe's full devbox: does task breadth decide the environment, and where is the line?
- What do warm pools and per-task environments cost? Uber's "AI-related costs are up 6x since 2024" is the only cost signal found, and it is not broken down.
- For GPUs: does anyone give agents GPU dev environments, and how would idle reaping interact with an agent that waits on a model most of the time? Nothing found.
