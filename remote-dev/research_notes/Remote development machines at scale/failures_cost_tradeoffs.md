# Remote development machines: counter-evidence, failures, costs and design trade-offs

Scoping pass, researched 2026-11-26. About 46 searches/fetches.

How to read the tags:

- **[F]** = I fetched the page. Note that the fetch tool returns a small model's extraction of the page, not raw HTML. Quoted strings are as that extraction relayed them; re-check any quote against the page before printing it in the essay.
- **[S]** = search-result snippet only. Not read in full. Treat as a lead, not a fact.
- **[V]** = vendor source with a product to sell. **[1P]** = first-person engineering account.
- Every fact carries the date of the source.

## 1. Reversals and failures: who built remote dev and abandoned or rebuilt it?

### Takeaway

The best-documented failure is architectural, not conceptual: Gitpod spent six years on Kubernetes and left it, and Shopify rebuilt Spin three times in two years. Shopify's later move back to local development is confirmed in one sentence of a conference abstract, but I found no source for why, and by 2026 Shopify was building remote machines again for agents.

### Cited Findings

#### Gitpod leaves Kubernetes (2024-10-31) [F]\[V\]\[1P\]

- Post by Christian Weichel and Alejandro de Brito Fontes, after six years and about 1.5 million users: "we've found that Kubernetes is not the right choice for building development environments." — [Ona/Gitpod](https://ona.com/stories/we-are-leaving-kubernetes)
- CPU: sharing nodes "incurs significant noisy neighbor effects leading to a detrimental user experience"; "Latency becomes immediately apparent to users when their language server starts to lag or their terminal becomes choppy." Process priorities applied to whole process groups, so a compiler in the terminal could still starve the IDE server. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Memory: "Until swap-space became available in Kubernetes 1.22, memory overbooking was near impossible to do." — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Storage: PVCs brought "unpredictable attachment and detachment timing, leading to unpredictable workspace startup times" and "reliability issues leading to workspace failures, particularly during startup". Local SSD tied data to one node. Backups were tar archives to S3. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Startup: "Kubernetes imposes a lower bound for startup time because of all the content operations that need to happen." Workspace images could exceed 10 GB. They tried ghost workspaces, ballast pods, DaemonSet pre-pulls, pre-baked images, lazy pulling and an IPFS-backed registry facade. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Security: giving users root in a container "essentially provides them with root privileges on the node itself." Workarounds included user namespaces with shiftfs, a masked /proc via seccomp notify, custom eBPF device policies for FUSE, and slirp4netns then veth networking. Docker inside the workspace needed a custom runc facade. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- MicroVM experiment (Firecracker, Cloud Hypervisor, QEMU): "Even as lightweight VMs, uVMs introduced more overhead than containers." Firecracker lacked GPU support and virtiofs in mid-2023. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Replacement: Gitpod Flex (October 2024), a control plane "heavily inspired by Kubernetes" without Kubernetes underneath, with the option to run environments on the desktop. — [same](https://ona.com/stories/we-are-leaving-kubernetes)
- Gitpod said Kubernetes remains fine for application workloads; users lost the option to run Classic on any Kubernetes. — [DevClass, 2024-11-06](https://devclass.com/2024/11/06/gitpod-discontinues-journey-of-experiments-failures-and-dead-ends-with-kubernetes) [S]

#### Shopify Spin: three architectures, then a move back to local, then remote again for agents

- 2022-06-09, Don Kelly [F]\[1P\]: the laptop tool `dev` ran a `railgun` VM on xhyve; "Laptops were melting." First cloud attempts failed to get traction: a local Kubernetes cluster ("Not many developers were interested in the idea") and bare GCE VMs with no automation. — [Shopify Engineering](https://shopify.engineering/shopifys-cloud-development-journey)
- Spin iteration 1 (fall 2020): one pod with a host container plus Docker Compose, described as "CI with a shell"; editing in one context and running in another confused early adopters. Iteration 2: one pod per repository in a per-developer namespace. Iteration 3 (Isospin, migration finished January 2022): a single customized Linux image with systemd units, a "laptop in the cloud", after feedback from the CEO. — [same](https://shopify.engineering/shopifys-cloud-development-journey)
- Unresolved in 2022: instances still ran as Kubernetes pods, and relocating pods eroded developer trust (tension between ephemerality and persistence). — [same](https://shopify.engineering/shopifys-cloud-development-journey)
- A Shopify team post reports developers often fell back to local tooling and unknowingly committed changes that broke Spin support. — [Shopify Engineering, SFN team](https://shopify.engineering/sfn-team-cloud-development-spin) [S]
- NixCon 2025 (talk listed 2025-09-05), Josh Heinrichs, abstract: "We moved from cloud development to local development," alongside multirepo to monorepo and Homebrew/Apt to Nix. The abstract gives no reason. — [media.ccc.de](https://app.media.ccc.de/v/nixcon2025-56413-nix-based-development-e) [F]\[1P\]
- 2026-10-22, Shopify "Remote Dev" [F]\[1P\]: for AI agents on mobile, "We set up a fleet of remote Macs"; "Just three or four workflows were enough to max out a laptop." A warm pool of Macs with main checked out and apps built; "We destroy the Mac when the session ends." Android emulators run on a separate Linux VM because macOS lacks nested virtualization. The agent's share went from 6% to 61% of merged mobile PRs. Spin is not mentioned. — [Shopify Engineering](https://shopify.engineering/remote-dev); coverage in [InfoQ, 2026-11-17](https://infoq.com/news/2026/11/shopify-remote-ai-dev/) [F]

#### Vendor exits and pivots (see section 6 for the table)

- JetBrains stopped developing CodeCanvas (announced October 2025; new licences stopped 2025-10-16; instances stop 2026-03-31), judging the current setup too niche for an AI-focused market. — [Neowin](https://www.neowin.net/news/jetbrains-retires-codecanvas-will-be-unusuable-on-march-31-2026/) [S]; JetBrains' own post returned HTTP 403 — [JetBrains blog](https://blog.jetbrains.com/codecanvas/2025/10/jetbrains-is-sunsetting-codecanvas/)
- Daytona made a "hard pivot" from human dev environments to AI agent sandboxes in early 2025 and moved existing customers to competitors. — [Latent Space](https://latent.space/p/daytona) [S]

### Inferences

- The failures cluster in one design: many developers' environments packed as containers onto shared Kubernetes nodes. Every Gitpod complaint (noisy neighbours, root, storage attach time, startup floor) is a consequence of sharing a kernel and a scheduler built for stateless services. Shopify's Isospin and Gitpod Flex both converged on "one machine-like thing per developer".
- Shopify is not a clean "went back to laptops" story. It went cloud (2020-22), local (by 2025), and remote again for agent workloads (2026). The second swing is the interesting one for an essay: what pushed work back off laptops was parallelism, not build speed.

### Gaps

- **Why Shopify left Spin** is not sourced. Apple Silicon speed, cost and Spin reliability are all plausible, and all are guesses. The NixCon 2025 talk recording probably says; I only read the abstract.
- I found no first-person post from any company saying "we returned to laptops because Apple Silicon made them fast enough". Hacker News anecdotes from 2020-21 say M1 machines felt about twice as fast for Node work ([HN](https://news.ycombinator.com/item?id=25804072) [S]), which is not the same claim.
- No sourced account of a self-built platform being shut down for cost.

## 2. Documented downsides

### Takeaway

Network dependence is the barrier developers name most, and platform outages are real and recent: Codespaces failed in all regions for hours in February 2026. Latency is mostly solved by editors that keep a local buffer, and remains painful for those that do not.

### Cited Findings

#### Latency

- Nelson Elhage on Stripe (2024-05-21, written from memory about five years after leaving): "Editing code on the other side of a 200+ms network latency is **painful**." This is given as a reason code and editors stayed on the laptop. — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/) [F]\[1P\]
- Stripe, Soam Vasani, QCon Plus (2022-09-30): with VS Code remote, "There is a local buffer going on, and that buffer is asynchronously synced over SSH to the remote end." With Emacs and TRAMP: "Yes, you see the latency, absolutely. It's quite annoying." IntelliJ support was "still very early." — [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure) [F]\[1P\]
- Uber (2022-12-13) placed Devpod clusters in five regions (Oregon, Virginia, Netherlands, Mumbai, São Paulo) for typing responsiveness, and says early web IDE latency and stability problems caused setbacks. — [Uber Engineering](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]\[1P\]

#### Outages of the platform

- 2026-02-02: "Codespaces creation and resume operations also failed in all regions." Cause: security policies wrongly applied to backend storage accounts at the compute provider blocked VM metadata. Recovery around 00:15 UTC on 02-03; the incident is listed at 5 hours 53 minutes. — [GitHub availability report, February 2026](https://github.blog/news-insights/company-news/github-availability-report-february-2026/) [F]
- 2026-02-12: create/resume failures peaking at a 90% failure rate, starting in UK South and spreading to Europe, Asia and Australia; "US regions were not impacted." Alerts fired at too low a severity. The report's header duration (2 h 3 min) does not match its stated window (00:51–09:35 UTC). — [same](https://github.blog/news-insights/company-news/github-availability-report-february-2026/) [F]
- 2025-09-17: about 250 codespaces stuck in shutdown had their contents irrecoverably lost. — [GitHub status](https://www.githubstatus.com/incidents/gqb335zdyq82) [S; exact incident URL not verified]
- Uber: "here we are limited by the cloud provider availability that's capped at 99.5%." — [Uber Engineering, 2022-12-13](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]

#### File sync

- Stripe: branch switches trigger "the worst case behavior of sync"; the watcher restarts many services; developers juggling three or four branches were "pretty unhappy." Each branch needed its own laptop checkout. — [InfoQ, 2022-09-30](https://www.infoq.com/presentations/stripe-dev-env-infrastructure) [F]
- Stripe: syncing generated code back to the laptop was "somewhat awkward and non-ergonomic and occasionally unreliable." Running a test before sync finished gave stale results until sync barriers were added. — [Made of Bugs, 2024-05-21](https://blog.nelhage.com/post/stripe-dev-environment/) [F]

#### State loss and trust

- Shopify: moving pods erodes developer trust. — [Shopify Engineering, 2022-06-09](https://shopify.engineering/shopifys-cloud-development-journey) [F]
- LinkedIn keeps the home directory on a PVC because the pod may be "moved to another node or is accidentally deleted." — [LinkedIn Engineering, 2021-11-04](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development) [F]

#### Mobile, GUI, macOS

- Uber: no Android emulator or device connection from Devpods. — [Uber Engineering, 2022-12-13](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]
- GitHub has said it has no plans for non-Linux Codespaces. — [GitHub community discussion](https://github.com/orgs/community/discussions/36604) [S]
- Shopify's Linux agent could edit Swift but not build iOS; hence the Mac fleet. — [Shopify Engineering, 2026-10-22](https://shopify.engineering/remote-dev) [F]

#### Remote-heavy work that moved back

- Slack moved webpack builds from the remote dev box to the laptop because one build could eat an instance's memory. — [Slack Engineering, 2020-04-28](https://slack.engineering/development-environments-at-slack) [F]\[1P\]

#### Developer-stated barriers

- Survey of 1,173 developers fielded July 2022 (posted to arXiv 2026-03-06): network dependency 40.1%, performance 32.4%, security 28.7%, cost 24.2%, feature limits 19.3%. Satisfaction did not differ significantly between cloud IDE users and non-users. Recruited largely through a cloud IDE vendor's newsletter. — [arXiv 2603.06050](https://arxiv.org/html/2603.06050v1) [F]
- Zach Lloyd (2022-09-20): the pull for individuals "simply isn't that strong" because git already solved version skew; fears are "Latency, in all possible ways", offline access and losing tools. — [Warp](https://warp.dev/blog/why-is-it-taking-so-long-for-cloud-dev-environments-to-catch-on) [F]\[V, sells a terminal\]

### Inferences

- A remote dev platform is a single point of failure that a laptop fleet is not. A 99.5% ceiling is roughly 44 hours a year for every engineer at once (my arithmetic from Uber's figure, not Uber's claim).
- The latency complaint depends on the editor architecture. Thin-client editors with a local buffer hide it; anything that edits a remote file directly exposes it.

### Gaps

- No measured keystroke-latency numbers from any company.
- No sourced security incident specific to multi-tenant dev containers. My search returned only general container-escape research (runc "Leaky Vessels", Azurescape) — [Unit 42](https://unit42.paloaltonetworks.com/container-escape-techniques/) [S]. Gitpod's own account of root-equals-node-root is the best evidence found.
- Offline work: named as a fear everywhere, no account of real impact.

## 3. Cost

### Takeaway

Published per-engineer numbers are almost all vendor models or list prices. No large company I found publishes what its remote dev fleet costs per engineer; the firms that run them say only that idle shutdown and disk snapshots are how they keep it tolerable.

### Cited Findings

- Codespaces list price (docs read 2026-11-26): $0.18/h for 2 cores, $0.36 for 4, $0.72 for 8, $1.44 for 16, $2.88 for 32; storage $0.07 per GB-month, which accrues while the codespace exists. Billed to the creator or the owning organization; organizations get no free quota; budgets can cap spend, and at the cap users cannot create or resume. — [GitHub Docs](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces) [F]
- Gitpod's cost-versus-UX post models 100 engineers: about $360,000 a year always-on versus about $104,800 at 10 hours per weekday. — [DEV/Gitpod](https://dev.to/gitpod/the-cost-vs-ux-trade-offs-of-designing-and-operating-cdes-4937) [S]\[V; both the dev.to and ona.com URLs returned 404 on fetch\]
- Strong Network's calculator assumes a 4-CPU/16 GB VM at $0.17/h for 8 h x 5 days, against a $1,000–3,000 laptop amortized over two years. — [Strong Network](https://strong.network/cde-impact-calculator) [S]\[V\]
- Uber tracks cost per Devpod against off-the-shelf options, shuts down idle environments, rebalances VMs and snapshots disks to cheap storage on shutdown. No figures. — [Uber Engineering, 2022-12-13](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]
- Stripe moved state to an EBS volume so instances can be switched off, for example at weekends; the volume adds cost. — [InfoQ, 2022-09-30](https://www.infoq.com/presentations/stripe-dev-env-infrastructure) [F]
- Slack: fewer environments per instance means more EC2 to pay for; 550 dev environments at the end of 2019. Backend boxes 8 cores/16 GB, frontend 16 cores/32 GB. — [Slack Engineering, 2020-04-28](https://slack.engineering/development-environments-at-slack) [F]; sizes from [Pragmatic Engineer, 2023-06-27](https://newsletter.pragmaticengineer.com/p/cloud-development-environments) [F, paywalled past the intro]
- The people cost: Stripe's approach needed about 10 full-time engineers on tooling, and Elhage credits "the existence of the team, and its investment in **stability** and **reliability**" over any design choice. — [Made of Bugs, 2024-05-21](https://blog.nelhage.com/post/stripe-dev-environment/) [F]
- Pragmatic Engineer lists CDE downsides as involved setup, high running cost and lock-in risk. — [Pragmatic Engineer, 2023-06-27](https://newsletter.pragmaticengineer.com/p/cloud-development-environments) [F, partial]
- A laptop left idle costs nothing extra; a cloud workstation bills until stopped. — [Fly.io](https://fly.io/learn/cloud-development-environment/) [S]\[V\]

### Inferences

- Worked example from list price only: a 16-core codespace at $1.44/h for 40 h a week, 48 weeks, is about $2,765 a year before storage, roughly the price of a high-end laptop every year. The engineer still needs a laptop. This is my arithmetic, not a published figure.
- The cost case for remote machines therefore rests on things other than hardware: build time saved, onboarding time, and security. Sources asserting hardware savings are vendors.
- Idle shutdown and startup time trade against each other: aggressive auto-stop is cheap and makes every morning a cold start, which is why prebuilds and warm pools exist.

### Gaps

- No utilization figures (share of provisioned hours actually used) from any operator.
- No sourced example of chargeback to teams for dev machines, beyond Codespaces' organization billing and budgets.
- Default idle timeout values were not confirmed for any product.
- Google Cloud Workstations and Dev Box pricing not retrieved.

## 4. Design trade-offs, with examples on each side

### Takeaway

Real deployments sit on both sides of every axis, and several changed sides. The most consistent pattern: the compute is disposable, and what persists is either a home volume or the laptop's checkout.

### Cited Findings

| Axis | One side | Other side |
| --- | --- | --- |
| Pet vs ephemeral | Uber: "Devpods are persistent, therefore engineers do not need to worry about losing their individual setup"; ephemeral listed as future work ([Uber, 2022-12-13](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]) | Stripe: "a single command could destroy your instance and provision a new one"; re-creating the devbox "resolved most problems" ([Made of Bugs, 2024-05-21](https://blog.nelhage.com/post/stripe-dev-environment/) [F]). Slack moved from static long-lived instances, which degraded, to on-demand ([Slack, 2020-04-28](https://slack.engineering/development-environments-at-slack) [F]) |
| Per developer vs per branch/task | Stripe originally one devbox per developer | Stripe target: "A devbox is per branch instead of per developer", plus preview devboxes per pull request ([InfoQ, 2022-09-30](https://www.infoq.com/presentations/stripe-dev-env-infrastructure) [F]). Shopify 2026: "Each River session gets its own environment" ([Shopify, 2026-10-22](https://shopify.engineering/remote-dev) [F]) |
| VM vs container vs pod | Stripe and Slack: EC2 instances. Shopify Isospin: one machine-like image | Uber and LinkedIn: Kubernetes pods ([LinkedIn, 2021-11-04](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development) [F]). Gitpod: left Kubernetes ([Ona, 2024-10-31](https://ona.com/stories/we-are-leaving-kubernetes) [F]) |
| Startup: warm pools and prebuilds | LinkedIn keeps a pool of pre-built pods sized from past demand; setup and build went "from 10-30 minutes to just 10 seconds for most of our products". Stripe: "a number of warm spares were kept". Shopify: warm Macs with apps built; first compile took over 30 minutes without it | Uber without a pool: "it takes 2-3 minutes to create a new Devpod" |
| Where the source of truth lives | Stripe (original) and Slack: laptop checkout, rsync to the box; "By keeping code on the laptop, Stripe allowed developers to continue using any editor they wanted" | LinkedIn and Uber: code on the remote volume, editor over SSH. Stripe was moving here in 2022 with VS Code server |
| Image updates | Uber: Devpods "are updated overnight automatically", with stable/rc/dev channels | Not found: an account of locked images causing pain |
| Dotfiles and personal tools | LinkedIn: a sidecar container installs dotfiles; home directory on a PVC | Laptop-as-source designs avoid the problem because the editor never moves |

### Inferences

- Ephemeral machines were safe at Stripe only because the laptop held the work. Once the source of truth moves to the remote box (needed for agents and for per-branch boxes), persistence has to be rebuilt as volumes or snapshots. The pet-versus-cattle choice is really a choice about where uncommitted work lives.
- Warm pools convert startup latency into idle spend. No source gives the cost of the pool.

### Gaps

- Root/sudo versus locked images: only Gitpod discusses it, and from the platform's side.
- One machine versus several per engineer: only Slack's sizing by role and Stripe's per-branch plan; no numbers on machines per engineer.

## 5. The alternative: keep code on the laptop, move only the heavy work

### Takeaway

The hybrid model is the oldest working design (Stripe, Slack), and its documented weakness is sync. I found little first-person writing that frames remote build execution as a deliberate substitute for remote machines.

### Cited Findings

- Stripe: laptop holds repo, editor and git; the devbox runs tests, services and the Sorbet language server over SSH; rsync plus watchman; commands wait at sync barriers. — [Made of Bugs, 2024-05-21](https://blog.nelhage.com/post/stripe-dev-environment/) [F]
- Slack: `slack sync-dev` wraps fswatch and rsync; frontend assets build locally. — [Slack Engineering, 2020-04-28](https://slack.engineering/development-environments-at-slack) [F]
- Zach Lloyd argues faster builds can come from sharding and caching with Bazel instead, as at Google, and that remote setups do not fix hermeticity because apps depend on external services. — [Warp, 2022-09-20](https://warp.dev/blog/why-is-it-taking-so-long-for-cloud-dev-environments-to-catch-on) [F]
- Bazel remote execution and Buck2 share the open Remote Execution API; Meta marketed Buck2 as "Remote Execution first". — [BuildBuddy](https://www.buildbuddy.io/blog/buck2-review/) [S]\[V\]
- Porting cost: builds must stop depending on host-local tools and paths. — [Bazel docs](https://bazel.build/remote/rules) [S]
- Docker acquired Mutagen on 2023-06-27 and uses it for Docker Desktop synchronized file shares. — [Docker](https://www.docker.com/blog/mutagen-acquisition/) [S]\[V\]
- Shopify's return to local used Nix (devenv) for reproducibility instead of a remote image. — [NixCon 2025](https://app.media.ccc.de/v/nixcon2025-56413-nix-based-development-e) [F]

### Inferences

- There are three separable things a remote machine provides: compute, a reproducible environment, and isolation. Remote execution supplies the first, Nix or dev containers the second, and only a separate machine the third. Agents need the third, which may explain why the hybrid model is losing ground in 2026.

### Gaps

- No first-person account found of a company choosing remote build execution or remote test runners in place of remote dev machines. Searches for Canva, Dropbox, Airbnb and Snowflake returned nothing relevant.
- No account of Mutagen in production at a named company.

## 6. Product landscape

### Takeaway

Between mid-2024 and early 2026 most of the category's named products were closed to new customers, folded into something else, or repositioned around AI agents.

### Cited Findings

| Product | Model | Status through November 2026 |
| --- | --- | --- |
| GitHub Codespaces | Hosted Linux VM per codespace, devcontainer spec, prebuilds, per-core-hour billing | Operating. Linux only ([GitHub discussion](https://github.com/orgs/community/discussions/36604) [S]). Outages in February 2026 ([GitHub](https://github.blog/news-insights/company-news/github-availability-report-february-2026/) [F]) |
| Gitpod / Ona | Was containers on Kubernetes; Flex (October 2024) dropped Kubernetes | Renamed Ona in September 2025 with a pivot to agents ([The Register, 2025-09-03](https://www.theregister.com/2025/09/03/gitpod_rebrands_as_ona/) [S]). Classic pay-as-you-go ended 2025-10-15 ([Gitpod README](https://github.com/gitpod-io/gitpod) [S]) |
| Coder | Self-hosted, Terraform templates, admin-set auto-stop | Operating, per comparison blogs only [S]; not verified |
| Google Cloud Workstations | Managed workstation VMs in the customer's project | Not researched |
| Microsoft Dev Box | Windows cloud PC for developers | No new customers from 2025-11-01; features moving into Windows 365 ([Microsoft Learn](https://learn.microsoft.com/el-gr/Azure/dev-box/dev-box-windows-365-announcement) [S]) |
| AWS Cloud9 | Browser IDE on EC2 | Closed to new customers 2024-07-25 ([AWS docs](https://docs.aws.amazon.com/cloud9/latest/user-guide/history.html) [S]) |
| Amazon CodeCatalyst | Dev Environments within a DevOps suite | Closed to new customers 2025-11-07 ([AWS](https://aws.amazon.com/codecatalyst) [S]) |
| JetBrains CodeCanvas | Self-hosted CDE orchestrator for JetBrains IDEs | Sunset; instances stop 2026-03-31 ([Neowin](https://www.neowin.net/news/jetbrains-retires-codecanvas-will-be-unusuable-on-march-31-2026/) [S]). JetBrains also retired Code With Me in March 2026 ([JetBrains](https://blog.jetbrains.com/platform/2026/03/sunsetting-code-with-me/) [S, title only]) |
| Daytona | Was dev environment manager | Pivoted to agent sandboxes in early 2025; $24M Series A reported 2026-02-06 ([tech.eu](https://tech.eu/2026/02/06/daytona-raises-24m-series-a-to-build-agent-native-compute-infrastructure/) [S]). A LinkedIn snippet mentions a $60M Series B at $1B; unverified |
| DevPod, DevZero, VS Code Remote-SSH/tunnels, Amazon WorkSpaces, JetBrains Gateway | — | Not researched in this pass |
| devcontainer spec | Declarative environment definition | Used by Codespaces, LinkedIn (2021), and adopted by Ona in place of `.gitpod.yml` ([Ona](https://ona.com/stories/migrating-from-classic-to-ona) [S]) |

### Inferences

- The standalone "CDE for humans" product category largely did not survive as such. What survived is the devcontainer spec, the hyperscaler-attached products, and self-built platforms at large companies.

### Gaps

- Status of DevPod (Loft), DevZero, Coder's positioning, Cloud Workstations and JetBrains Gateway needs a dedicated pass. I have recollections about some of these and have left them out because I did not source them.

## 7. Surveys and adoption data

### Takeaway

There is no good current number. The one rigorous-looking study is from 2022 and vendor-recruited; the widely quoted Gartner forecast is known to me only through vendor blogs.

### Cited Findings

- July 2022 survey, n=1,173: 4.3% regular cloud IDE use (95% CI 3.3–5.7%), 16.0% occasional; 44.8% had no plans to adopt. The author bounds true 2022 adoption at roughly 14.6–20.3% and says industry figures of 68–75% count broader cloud tooling. — [arXiv 2603.06050, posted 2026-03-06](https://arxiv.org/html/2603.06050v1) [F]
- Gartner added CDEs to its 2023 Hype Cycle for Emerging Technologies. — [Pragmatic Engineer, 2023-06-27](https://newsletter.pragmaticengineer.com/p/cloud-development-environments) [F]
- Gartner is reported to have forecast that by 2026, 60% of cloud workloads would be built and deployed using CDEs. Seen only on vendor pages, with two different wordings (CDEs versus browser-based IDEs). — [Gitpod blog preview](https://deploy-preview-4059--gitpod-kumquat.netlify.app/blog/gartner-2023-cde-hypecycle) [S]\[V\]
- Gartner, May 2026: by 2027 over 65% of engineering teams using agentic coding will treat IDEs as optional. — [Gartner](https://www.gartner.com/en/newsroom/press-releases/2026-05-20-gartner-says-the-market-for-enterprise-ai-coding-agents-is-entering-a-new-phase-of-expansion-and-competitive-realignment) [S]
- Company-level: "over 60% of Uber software engineers have adopted Devpods" as of November 2022 ([Uber](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) [F]). Slack reported 85% of engineers on cloud environments at a Gitpod-hosted conference ([Gitpod recap](https://deploy-preview-4059--gitpod-kumquat.netlify.app/blog/cde-universe-2023-recap) [S]\[V\]).
- Vendor claims for 2026: Stripe merges over 1,000 agent-authored PRs a week; Ramp's background agent accounts for 57% of merged PRs. Cited by Ona from those companies' materials; not verified by me. — [Ona, 2026-02-13](https://ona.com/stories/the-last-year-of-localhost) [F]\[V\]

### Inferences

- The 2026 deadline of the Gartner forecast has arrived, and the products it described were mostly closed or repositioned in the interval. If the wording can be confirmed, that is a usable essay fact.

### Gaps

- Nothing found in Stack Overflow 2025/2026, JetBrains Developer Ecosystem or DORA that measures remote dev environment use specifically. Not confirmed absent; my one search did not surface it.
- The devops.com survey article returned HTTP 403.

## Angles for an essay

1. **The machine was never the hard part; the team was.** Stripe needed about 10 engineers and Elhage credits reliability investment over design. Gitpod and Shopify each rebuilt the platform repeatedly. Thesis: a remote dev platform is a product with an on-call rota, and most organizations underprice that.
2. **Against, narrowly: do not put developers in pods.** The documented failures are of shared-kernel, Kubernetes-scheduled containers, not of remote machines. VM-per-developer designs (Stripe, Slack, Isospin, Flex) are where everyone ended up.
3. **Against, broadly: the laptop-plus-remote-compute hybrid gets most of the benefit.** Stripe and Slack kept the editor and checkout local for a decade. The counter-evidence is that sync breaks under branch switching, and Stripe itself was moving off it.
4. **Agents, not humans, settled the argument.** Shopify went back to local for humans and then built remote Macs because three or four agent workflows maxed out a laptop. The vendors all pivoted the same way. Thesis: the case for remote machines is now isolation and parallelism, and the old arguments (build speed, onboarding) were never strong enough.
5. **A single point of failure for the whole engineering organization.** Codespaces down in all regions; 250 codespaces lost; Uber's 99.5% ceiling. Thesis: the design question that matters is what an engineer can still do when the platform is down.
6. **Pet versus ephemeral is a question about where uncommitted work lives.** Each design answers it differently (laptop, home volume, snapshot, branch), and the answer determines everything else.

Open questions:

- Why did Shopify leave Spin, and what share of its engineers work locally now?
- What does a remote dev fleet cost per engineer at any named company, and what is its utilization?
- Has any company documented moving from remote machines to remote build execution, or the reverse?
- What do the 2026 Stack Overflow and JetBrains surveys say, if anything?
- For a payments audience: no source here discusses regulated-data constraints on dev environments; that would need its own search.
