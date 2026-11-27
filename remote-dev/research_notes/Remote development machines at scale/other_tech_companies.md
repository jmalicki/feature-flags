# Remote development machines at companies other than Google and Meta

Scoping pass, run 2026-11-26. About 40 searches and fetches.

## How to read the tags

- **[fetched]**: I fetched the page itself. The fetch tool returns a model-written extraction of the page, not raw HTML, so quoted strings are the tool's reported quotations. Re-check any quote against the live page before it goes into the essay verbatim.
- **[snippet]**: seen only in a search-result summary. Treat as a lead, not a fact.
- Dates in parentheses are the publication date of the source, which is the "as of" date for the fact. Most primary sources are from 2021-2024; only Stripe and Shopify have 2026 primary material.

## Source quality at a glance

| Tier | Companies |
| --- | --- |
| Primary source fetched, rich detail | Uber, Stripe (three sources spanning 2019-2026), Slack (two posts, 2020 and 2022), Shopify (three posts), LinkedIn, GitHub, Discord (not on the original list) |
| Primary or vendor source fetched, thin detail | Microsoft, Dropbox (vendor case study), Rippling (not on the list) |
| Lead found, not read | Plaid (403 on fetch), Datadog (job posting only), Netflix (artist workstations talk), Pipedrive (paywalled) |
| Nothing found in this pass | Lyft, Airbnb, Canva, Pinterest, Spotify, Twitter/X, Databricks, Snowflake, Palantir, Atlassian, Amazon, Notion, Figma, Block, Brex, Coinbase, Monzo, Adyen |

---

## Uber (Devpod)

### Takeaway

Persistent containers on Kubernetes, with the monorepo pre-cloned inside and nightly image refresh. 60% adoption by November 2022. The post is candid about IDE latency and cost.

### Cited Findings

All from the Uber Engineering post "Devpod: Improving Developer Productivity at Uber with Remote Development" (2022-12-13) **[fetched]**: [Uber blog](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)

- **Code location:** Devpods come with the monorepo pre-cloned. The post does not state whether laptop development is still permitted. A listed future goal is letting engineers "continue working locally" if the remote environment fails, which implies local work was still possible.
- **Editors:** VS Code Remote and VS Code in the browser; JetBrains IDEs over SSH via JetBrains Gateway; JetBrains Projector (web) listed as deprecated; Vim and Emacs in a terminal.
- **Machine model:** "It runs as a container on Kubernetes." Several environments can share one large VM. A Devpod Operator with Custom Resource Definitions manages them.
- **Persistence:** "Devpods are persistent, therefore engineers do not need to worry about losing their individual setup."
- **Time to ready:** "Currently it takes 2-3 minutes to create a new Devpod." Stated goal: under 3 seconds via pre-provisioned pools.
- **Size:** "up to 48 cores and 96 GB of RAM per environment." Disk size not stated. GPUs not mentioned.
- **Count per engineer:** "Multiple remote environments per user."
- **Image currency:** release channels. Stable is the default; rc is the next stable; dev is "updated nightly to latest successful build"; engineers can pick "none" to opt out of automated updates. Images update overnight.
- **Idle handling:** an automated job deletes the container of inactive environments; disks of shut-down environments become low-cost snapshots until restart; underused VMs are consolidated and shut down.
- **Reasons:** monorepo builds were larger and slower on laptops; several GB of changing artifacts had to be downloaded or built locally; setup could take hours; security (latest stable version, off-hours patching).
- **Results:** p95 `git status` on the largest monorepo (over 70 million lines) "consistently below 4 seconds." Go builds about 2.5x faster than laptops for longer builds and 1.8x for average builds. "over 60% of Uber software engineers have adopted Devpods" as of November 2022.
- **Downsides stated:** early "latency issues with the popular web-based IDEs," later stability problems; language-server gaps; balancing performance and cost; cloud provider availability "capped at 99.5%"; no Android emulator support; moving files between laptop and Devpod is manual.
- Uber "runs its Devpods out of 5 data centers" to keep them close to developers (Pragmatic Engineer, 2023-09-05) **[fetched, free preview only]**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)
- Uber offers "six different development environment 'flavors'" (Pragmatic Engineer, 2023-06-27) **[fetched, free preview only]**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments)

### Inferences

- Uber chose persistence and containers, the opposite of Slack and Stripe on both axes, and paid for it with idle-reclamation machinery (snapshots, consolidation).

### Gaps

- Root access, dotfiles and personal software: not covered in the post.
- Nothing newer than 2023 found. Current adoption, whether the 3-second pool shipped, and any agent use are unknown.
- Author list conflict: the search summary named Aistis Jokubauskas, Serdar Badem and Ali-Reza Adl-Tabatabai; the fetch reported Matas Antanas Strukčinskas, Serdar Badem and Aistis Jokubauskas. Check the byline.

---

## Stripe (devboxes)

### Takeaway

The best-documented arc. Around 2019 the source of truth was deliberately the laptop, synced to one devbox per engineer. By 2022 Stripe was moving the source of truth to the devbox. By 2026 an engineer may run half a dozen pooled, 10-second devboxes, and the same machines host unattended coding agents.

### Cited Findings

**Circa 2019** — Nelson Elhage, "Stripe's monorepo developer environment" (2024-05-21, describing 2012-2019) **[fetched]**: [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/)

- Code ran on a per-developer cloud instance, but git checkouts and editors stayed on the laptop. Reasons given: editor flexibility, latency for globally distributed developers, and keeping the execution environment disposable.
- Sync began as an ad hoc "file-watcher with `rsync`," later hardened by the developer-productivity team, installed as a `launchd` service and moved to watchman. Test commands waited on a "sync barrier" so they never ran against stale code.
- Devboxes were ephemeral: one command destroyed and re-provisioned. "a number of warm spares were kept." Provisioned through standard configuration management (Puppet mentioned).
- One per engineer. All devboxes were reachable over ssh by all engineers.
- By 2019 the team had chosen to invest in VS Code, running the Sorbet language server on the devbox over SSH.
- "pull `master` and re-create your devbox" became first-line debugging advice.
- Downsides: sync makes "code that acts on code" (migrations, linters, code generation) hard; the sync-back workaround was "somewhat awkward and non-ergonomic and occasionally unreliable." The model depended on a developer-productivity team of roughly a dozen engineers.
- Author caveat: "I make no claim this document represents the developer experience at Stripe as of today."

**2022** — Soam Vasani, "Building and Scaling Developer Environments at Stripe," QCon Plus (recorded 2022-09-30) **[fetched]**: [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure)

- Each devbox is an EC2 instance. "It has a full copy of the source code that's rsynced from the laptop."
- Remote development (source of truth on the devbox, VS Code remote) was in early beta at the time of the talk.
- Originally one devbox per developer; the goal was per-branch devboxes. "Stateless devboxes" put state on EBS volumes so instances could be switched off. The speaker said this had "not a whole lot of user facing value" but kept the budget in limits.
- Preview devboxes that follow pull requests were "very popular with frontend and full stack teams."
- Scale: "on the order of thousands of engineers"; "millions of lines of code," mostly Ruby.
- Downsides: branch switching "triggers the worst case behavior of sync" and restarts many services; heavy multitaskers were "pretty unhappy with these interruptions." Emacs over TRAMP: "you see the latency, absolutely. It's quite annoying." Running the full service graph per developer is impractical.

**2026** — Alistair Gray, "Minions: Stripe's one-shot, end-to-end coding agents, Part 2" (2026-02-19) **[fetched]**: [Stripe Dev Blog](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)

- "A Stripe devbox is an AWS EC2 instance that contains our source code and runs services under development."
- "devboxes are 'cattle, not pets': they're standardized and easy to replace, rather than bespoke and long-lived."
- "we proactively provision and warm up a pool of devboxes so they are ready when a developer wants them." "we aim for it to be ready within 10 seconds."
- Warm-up includes "cloning gigantic git repositories, warming Bazel and type checking caches," and a checkout at recent master.
- "Many engineers use one devbox per task," and "a Stripe engineer might have half a dozen running at a time."
- "Most human-written Stripe code is already produced within an IDE that's remotely connected to a devbox via SSH."
- Agents run "on the same standard developer environment that Stripe engineers use: the devbox." "What's good for humans is good for agents."
- Isolation: mistakes "are confined to the limited blast radius of one devbox." Devboxes run in the QA environment, so agents "don't have access to real user data, Stripe's production services, or arbitrary network egress."
- "Over 1,300 Stripe pull requests (up from 1,000 as of Part 1) merged each week are completely minion-produced."

### Inferences

- Stripe reversed its own 2019 position. The laptop-as-source-of-truth design was chosen partly for latency and editor freedom; VS Code Remote-SSH removed both objections, and the sync pain on branch switches pushed the other way.
- The 2026 design (pool, 10-second start, one per task, cattle) is the same shape Slack and GitHub reached in 2021-2022.
- The security framing in 2026 is about containing agents, not protecting source code.

### Gaps

- Instance sizes, GPUs, root access, dotfiles, expiry policy: not found.
- Whether laptop checkouts are still permitted in 2026: not stated.
- Minions Part 1 was not fetched: [Part 1](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents).

---

## Slack

### Takeaway

Slack moved from rsync-from-laptop (2020) to fully remote, ephemeral, one-EC2-instance-per-branch environments (2021-2022), reaching over 90% of webapp engineers in about four months after general availability.

### Cited Findings

**2020** — Michael Deng, "Development Environments at Slack" (2020-04-28) **[fetched]**: [Slack Engineering](https://slack.engineering/development-environments-at-slack)

- Dev environments were EC2 instances; code was edited on the laptop and pushed by `slack sync-dev`, wrapping fswatch and rsync.
- 1 shared dev environment in 2014; 550 by the end of 2019; then a move to on-demand provisioning in 2020.
- Reversal inside the story: webpack builds ran remotely from 2017, grew until "One build would consume the memory of the entire instance," and were moved to laptops.
- Long-lived instances degraded and drifted from production.

**2022** — Sylvestor George, "Remote Development at Slack" (2022-06-28) **[fetched]**: [Slack Engineering](https://slack.engineering/remote-development-at-slack/)

- The remote workflow "eliminates the need to clone the webapp repository locally." Engineers "would no longer have to maintain code or dependencies on their local laptops." The post does not say local development was banned.
- Editor: VS Code with Remote-SSH and a vscode-server on the instance; Vim and Emacs possible.
- Ephemeral: detaching terminates the instance; merged branches are detached and terminated automatically. An AWS Auto Scaling Group keeps a pool ready. Ready "in under 90 seconds."
- One environment per branch; several in parallel.
- Size: started at c5.2xlarge (8 cores, 16 GB), moved to c5.4xlarge (16 cores, 32 GB) once frontend builds ran remotely. This "doubled the cost of our development environments."
- Personalisation: a `~/.remote-dev-home` directory syncs shell profiles, aliases, git config and VS Code settings.
- Reasons: a fresh clone "takes nearly 30 minutes"; HHVM made laptops loud and resource-hungry; Homebrew, Docker and HHVM updates broke local setups.
- Timeline: minimal workflow August 2021; general availability October 2021; 30% fully switched during beta; over 90% by end of January 2022. New-hire setup fell from about an hour to minutes.

**Later** — Daytona repost of the author's later write-up says Slack still supports local development for edge cases **[snippet]**: [Daytona](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack)

### Inferences

- The frontend build moved remote (2017), back to laptops, then remote again (2021) once instances were doubled in size. The deciding variable was machine size, not architecture.

### Gaps

- Root access, image build process, pool size: not stated. Nothing after 2022 found from Slack itself.

---

## Shopify (Spin, then Remote Dev for agents)

### Takeaway

Shopify documents the most failed attempts: local Kubernetes, hand-rolled GCE VMs, two Spin architectures, then "Isospin." Its own posts never report adoption numbers. I found no primary source on what happened to Spin after 2022, and the one 2026 post describes laptops as the default place mobile work was happening.

### Cited Findings

Don Kelly, "The Journey to Cloud Development: How Shopify Went All-in on Spin" (2022-06-09) **[fetched]**: [Shopify Engineering](https://shopify.engineering/shopifys-cloud-development-journey)

- Baseline was local `dev` plus `railgun` (services in a lightweight xhyve VM). "Laptops were melting."
- Abandoned: a local Kubernetes cluster "failed to gain organic traction amongst the larger developer community." A Linux port of `dev` for GCE VMs began in early 2020, was paused, then dropped.
- Spin v1 (fall 2020): Kubernetes pods with a host container and Docker Compose; early adopters found it "awkward." Then one pod per repository, reached over SSH or VS Code remote.
- Isospin: a custom Linux distribution orchestrated by `systemd`, with repositories cloned on boot. Migration from the older Spin finished January 2022.
- Code lives in the instance. One namespace per developer.
- Kubernetes pods create "an uneasy tension between ephemerality and persistence," which can "degrade the trust of developers if pods are relocated."
- No adoption, build-time or size numbers are given.

Jen Spinney, "Spin Cycle" (2022-08-04) **[fetched]**: [Shopify Engineering](https://shopify.engineering/sfn-team-cloud-development-spin)

- Because most developers kept using the old local tooling, they "would often unknowingly commit changes that broke some functionality we'd just enabled for Spin." The post names this a "Spiral of Struggle."
- "over 150 SFN engineers deploying to production over 30 times a day"; three engineers were assigned to get the app working on Spin. No mandate is described.

"We gave AI agents a mobile dev environment" (2026-10-22) **[fetched]**: [Shopify Engineering](https://shopify.engineering/remote-dev)

- "We built Remote Dev so AI agents can build and test apps in parallel, without maxing out developers' laptops." Spin is not mentioned anywhere in the post.
- "We set up a fleet of remote Macs with our development environment and iOS simulators." Android emulators run on "a separate Linux VM with nested virtualization enabled."
- Warm pool; "We destroy the Mac when the session ends and prepare a replacement." Agents connect over SSH.
- "Just three or four workflows were enough to max out a laptop." "If someone accidentally closed a laptop lid, the work stopped."
- Before: "Initial app compilation and main checkout were loooooooong, taking over 30 minutes." After: "just a few minutes."
- The agent's share of merged mobile pull requests went from 6% to 61%.

Related, different company: Fullscript abandoned per-developer EKS namespaces for local Docker Compose (2026-03-05), citing complexity, cost and "AWS auth sessions expire, for example, and this interrupts flow state." It borrowed Shopify's `dev.yml` approach and Shopify's Shadowenv **[fetched]**: [Fullscript Builders](https://builders.fullscript.com/posts/local-first-dev-environments-at-medium-scale)

### Inferences

- The 2026 post's premise (agents maxing out developers' laptops) implies Shopify mobile engineers were working locally in 2026. It says nothing about web/backend.
- Shopify's remote machines returned in 2026 for agents first, not for humans.

### Gaps

- **Spin's fate is unsourced.** Three differently worded searches found no deprecation notice. My own recollection is that Shopify wound Spin down and returned to laptop development around 2024-2025, but I could not find a citable source, so treat that as unverified. Places to look next: Shopify engineers' posts on X, podcast interviews with Shopify developer-infrastructure leads, Hacker News threads.
- Sizes, root access, time to ready for Spin: not stated.

---

## LinkedIn (RDev)

### Takeaway

Kubernetes pods from a pre-built pool, persistent home volume, the same container image for development and CI, in LinkedIn's own data centres.

### Cited Findings

Shivani Pai Kasturi and Swati Gambhir, "Building in the cloud with remote development" (2021-11-04) **[fetched]**: [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development)

- RDevs are "created on powerful hardware in our private cloud." The product is checked out into the RDev's home volume.
- Each RDev is a Kubernetes Pod "composed of three immutable containers": rdev-init-workspace, rdev-sshd, rdev-sidecar. The main container image comes from the product's `devcontainer.json`.
- Editors: "integrated these RDevs with developers' favorite IDEs that use remote SSH capabilities"; a Python CLI also connects.
- Persistent home directory on a Persistent Volume Claim, surviving pod moves.
- Pre-built pool (RdevPool over a CloneSet), sized by prediction from past usage. Pre-building means "spinning up a container, checking out the product, setting up the environment," then building and running the app.
- Build and setup time fell "from 10-30 minutes to just 10 seconds for most of our products."
- A sidecar handles "checking out and installing dotfiles."
- An updater service rebuilds images when internal RPMs change.
- Reasons: "laptops typically have fewer CPU cores," thermal throttling, setup problems, and local-versus-CI inconsistency.
- LinkedIn measured that "video calls added a 2-4x increase in latency to a developer laptop" (Pragmatic Engineer, 2023-09-05) **[fetched, free preview]**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)
- A 2022 DPE Summit talk with slides exists **[snippet]**: [DPE](https://dpe.org/sessions/building-in-the-cloud-with-remote-development/)

### Gaps

- Adoption numbers, sizes, per-engineer count, expiry, root access, whether local work is permitted: not stated. Nothing after 2022 found.

---

## GitHub (Codespaces for github.com)

### Takeaway

The cleanest "10 seconds from a prebuilt pool" story, and one codespace per branch, as early as 2021. It is also a product launch post.

### Cited Findings

Cory Wilkerson, "GitHub's Engineering Team has moved to Codespaces" (2021-08-11) **[fetched]**: [GitHub Blog](https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/)

- GitHub "left our macOS model behind"; Codespaces became "the default development environment for GitHub.com." Whether local setups remained supported is not stated.
- VS Code is "the primary tool GitHub.com engineers use to interface with codespaces." Vim and Emacs users connect over SSH to sshd in the prebuilt image.
- VMs went from 8 cores and 16 GB to 32 cores and 64 GB by a single configuration change.
- Time to ready: about 45 minutes originally; shallow clone cut the clone from 20 minutes to 90 seconds and the total to about 5 minutes; prebuilds brought it to about 10 seconds.
- Prebuilds are "pools of codespaces, fully cloned and bootstrapped, waiting to be connected with a developer."
- "roughly a 1:1 mapping between branches and codespaces."
- "Visual Studio Code extensions, settings sync, and dotfiles repos bring our environment to our compute."
- "I was a Codespaces skeptic before this started and now I am not."
- About 600 engineers, per a Changelog interview **[snippet]**: [Changelog #459](https://changelog.com/podcast/459)

### Gaps

- No cost data and no update since 2021 found. Root access not discussed.

---

## Discord (not on the original list; strong source)

### Takeaway

A vendor-based (Coder) migration with a hard cutover, and a documented reversal from Kubernetes containers to plain VMs.

### Cited Findings

Denbeigh Stevens, "How Discord Moved Engineering to Cloud Development Environments" (2024-02-22) **[fetched]**: [Discord blog](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)

- "we transitioned all backend and infrastructure development to a Linux-based Cloud Development Environment." The team chose to "deprecate MacOS-based backend development." Many engineers still do frontend work on the laptop, which creates a "split-brain" repository problem.
- Trigger: Apple Silicon. The backend stack had problems on M1 hardware, which accelerated the timeline. Also Homebrew breakage and engineering having "more than tripled in size."
- v1: Kubernetes containers with Sysbox over SSH, found hard to debug; privileged containers were not allowed. v2 (Coder v2, 2023): the platform "gives us the power to deliver VMs to developers," with networking that "leverages Tailscale & WireGuard."
- "We chose to mount and preserve the /home directory across restarts." Home holds repos, dotfiles and personal tools. VMs give "full access to the host." Default dotfiles were supplied for engineers less used to a shell.
- Editor: VS Code remote extension.
- Downsides: substantial SSH latency on unstable networks in v1; input lag; onboarding difficulty for less CLI-fluent engineers.

### Gaps

- Sizes, per-engineer count, time to ready, auto-shutdown, adoption numbers: not stated.

---

## Microsoft (Dev Box / 1ES)

### Takeaway

Scale numbers but little mechanism. A Windows cloud-PC model, different in kind from the SSH-to-Linux pattern elsewhere.

### Cited Findings

Josh Zimmerman, "Microsoft Dev Box for Microsoft engineers" (2023-05-23) **[fetched]**: [Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/dev-box-for-microsoft-engineers/)

- "over 9,500 Microsoft engineers are using Dev Box." Pilot began January 2022 in an Office 365 organisation.
- Before: setups took "several hours or days"; developers spent 3+ hours a week keeping source and build artifacts current; a clean local build could take about 40 minutes; 50% of developers contribute to more than one repository a month.
- Teams define a "ready-to-code" image through infrastructure-as-code; developers start coding "within just a few minutes."
- Survey: satisfaction above 80%; over 65% said Dev Box was their primary development environment.
- "Dev Box finally made me give up my physical machine."

### Gaps

- Connection method, sizes, persistence, admin rights: not stated in the post. Nothing newer fetched.

---

## Dropbox

### Takeaway

Only a vendor case study. An in-house provisioning tool was replaced by Coder for about 1,000 developers.

### Cited Findings

Coder success story based on an interview with Matt Kulka of Dropbox (no date on page) **[fetched; vendor marketing]**: [Coder](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder)

- "Each developer gets their own EC2 instance." Linux and Windows flavours; four types including an ML type with GPUs.
- Previous in-house tool "used a monolithic design in Python" and was "command-line driven."
- Most developers use JetBrains or VS Code.
- About 1,000 developers migrated in 4 months by two people; a six-person Developer Environments team; cloud cost down 30%; some project startup times from about an hour to 15 minutes.

### Gaps

- No Dropbox-authored engineering post found. No sizes.

---

## Rippling and Plaid (not or barely on the list)

### Cited Findings

- Rippling (2022-03-04): code is written locally in PyCharm and synced with Mutagen to a per-developer EC2 instance. "As they write code, we sync it with the remote EC2 servers." Browser IDEs were rejected. Repo of 1.91M lines. No adoption figures **[fetched]**: [Rippling](https://rippling.com/blog/how-we-used-the-cloud-to-supercharge-remote-development)
- Plaid: moved from local Vagrant VMs to a remote EC2 instance; 87% of users exclusively on the remote environment about 1.5 years after rollout **[snippet; fetch returned 403]**: [Plaid](https://plaid.com/blog/scaling-with-devenv)

---

## Datadog, Netflix, Pipedrive (leads only)

- Datadog has an internal "Workspaces" team providing "the internal Development Environment platform that engineers at Datadog use"; a third-party note mentions a `workspaces` CLI creating Datadog-hosted VMs. Job posting and personal notes only **[snippet]**: [job posting](https://echojobs.io/job/datadog-manager-engineering-i-workspaces-raa7s)
- Netflix has published on remote workstations, but for visual-effects artists, not software engineers **[snippet]**: [InfoQ](https://www.infoq.com/presentations/netflix-studio)
- Pipedrive (about 250 engineers) "first moved to a local Docker Desktop-based environment" and then "built their custom Devboxes which run on Kubernetes" (2023-06-27) **[fetched, free preview]**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments)

## Not found in this pass

Lyft, Airbnb, Canva, Pinterest, Spotify, Twitter/X, Databricks, Snowflake, Palantir, Atlassian, Amazon, Notion, Figma, Block, Brex, Coinbase, Monzo, Adyen. Combined-name searches returned vendor marketing. This is weak evidence of absence: each got at most one grouped query. Canva's only relevant posts (2015) argue for a complete local environment: [Canva](https://canva.dev/blog/engineering/functional-completeness-and-local-hermeticity) **[snippet]**.

---

## Angles for an essay

### Comparison table (best-sourced companies)

| | Uber (2022) | Stripe (2026) | Slack (2022) | LinkedIn (2021) | GitHub (2021) | Discord (2024) | Shopify Spin (2022) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Unit | Container on K8s | EC2 VM | EC2 VM | K8s pod | VM (Codespace) | VM (was K8s container) | systemd Linux instance (was K8s pods) |
| Source of truth | Remote | Remote (laptop until about 2022) | Remote (laptop until 2021) | Remote | Remote | Remote for backend; laptop for much frontend | Remote |
| Lifetime | Persistent | Disposable | Disposable, dies on merge | Persistent home volume | Disposable | Persistent /home | "uneasy tension" |
| Pool / time to ready | No pool yet; 2-3 min | Warm pool; 10 s target | Warm pool; under 90 s | Pre-built pool; 10 s | Prebuilt pool; 10 s | Not stated | Not stated |
| Per engineer | Multiple | About one per task, up to half a dozen | One per branch | Not stated | One per branch | Not stated | One namespace |
| Size | Up to 48 cores / 96 GB | Not stated | 16 cores / 32 GB | Not stated | 32 cores / 64 GB | Not stated | Not stated |
| Main editor path | VS Code remote, JetBrains Gateway | IDE over SSH | VS Code Remote-SSH | IDE over SSH | VS Code, SSH | VS Code remote | SSH, VS Code remote |
| Adoption | 60% (Nov 2022) | "Most human-written code" | Over 90% of webapp engineers (Jan 2022) | Not stated | Default for github.com | All backend (hard cutover) | Not stated |
| Built or bought | Built | Built | Built | Built | Own product | Bought (Coder) | Built |

### Possible theses

1. **The sync era ended.** Stripe, Slack and Rippling all began with code on the laptop and rsync/Mutagen to a remote runner. Stripe and Slack both moved the checkout to the remote machine once VS Code Remote-SSH (open-sourced server in 2021) removed the latency and editor-choice objections. Stripe's 2019 rationale and its 2026 practice are direct opposites, in its own words.
2. **Convergence on "one disposable machine per branch or task, from a warm pool, in about 10 seconds."** GitHub (2021), Slack (2022), LinkedIn (2021) and Stripe (2026) independently land on the same shape. Uber is the outlier with persistent multi-tenant containers, and names the 3-second pool as its goal.
3. **Kubernetes pods are a poor fit for a developer's machine.** Shopify (pods to a systemd instance) and Discord (Sysbox containers to VMs) both backed out, citing debugging difficulty, privilege limits and the persistence problem. Uber and LinkedIn stayed on Kubernetes and added persistent volumes and operators to compensate.
4. **Agents are the second justification, and they arrive on the same machines.** Stripe: "What's good for humans is good for agents." Shopify brought remote machines back in 2026 for agents because three or four parallel workflows maxed out a laptop. Disposable per-task machines designed for humans in 2021-2022 turn out to be the sandbox agents need.
5. **Partial adoption is the failure mode.** Shopify's "Spiral of Struggle" (local users unknowingly break the remote path) contrasts with Discord's hard cutover and Slack's 90% in four months. Running both paths indefinitely looks like the unstable state.
6. **The stated reasons are mundane.** Almost every post cites laptop heat or fan noise, Homebrew breakage, 30-45 minute bootstrap, and video calls competing for CPU. Security appears rarely before 2026, and then as agent containment.

### Open questions

- What actually happened to Shopify Spin? No primary source found. This is the most valuable reversal story if it can be sourced.
- Did Apple Silicon (2020 onward) weaken the build-speed argument? Only Discord discusses it, and there it was a push toward remote (backend stack incompatibility), not away.
- Cost per engineer: Slack says cost doubled, Dropbox's vendor claims 30% saved, no one gives a figure.
- Root access and personal software are almost never discussed. Only Discord ("full access to the host") addresses it.
- Whether laptop checkouts are forbidden anywhere: no source in this pass states a prohibition on source code on laptops. Discord deprecated macOS backend development, which is the closest.
- Current (2025-2026) state at Uber, Slack, LinkedIn and GitHub: every primary source is two to five years old.
- GPUs: only Dropbox's vendor story mentions a GPU environment type.
