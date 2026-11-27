# Evidence ledger C: failure modes, staffing and cost, prevalence, transition (S7-S10)

Built 2026-11-27 from the research notes, with every source re-opened unless stated. Downloads and scripts are in `/private/tmp/claude-501/-Users-josephmalicki-src-feature-flags/8d351235-ecd7-496b-8220-9302a2c6049e/scratchpad/ledger_c/`.

## Status codes

- **VERIFIED-RAW**: I fetched the page with curl (or the Hacker News Algolia API, or the GitHub API), stripped the HTML and found the words. Quotations appear only on these entries and are copied from that text.
- **VERIFIED-RAW (Wayback)**: same, but from a web.archive.org capture because the live page returned 403 or 404.
- **RAW-PER-NOTE**: the note tags it as raw text and I did not re-open it. Paraphrase only unless the note's quotation is reused as given there.
- **SNIPPET**: search result only. **UNVERIFIED**: could not open; reason given.
- No entry needed the WebFetch fallback, so VERIFIED-EXTRACT is unused.

**Source types**: official (company post or talk), named individual, N commenters (anonymous handles, employer self-declared), vendor, press. Vendor material is marked **[V]**. Windows desktops and PCI DSS are excluded.

---

## S7. Failure modes

### 7.1 The platform as a single point of failure

1. GitHub Actions hosted runners and Codespaces were unavailable on February 2, 2026 from 18:35 to 22:20 UTC; Codespaces recovered fully at 00:15 UTC on February 3; the incident is listed at 5 hours 53 minutes. Cause: a loss of telemetry led to security policies being wrongly applied to storage accounts at the compute provider, which blocked VM metadata. GitHub, report for February 2026. [GitHub availability report](https://github.blog/news-insights/company-news/github-availability-report-february-2026/). Official. VERIFIED-RAW. "Codespaces creation and resume operations also failed in all regions."
2. On February 12, 2026, between 00:51 and 09:35 UTC, creating or resuming a codespace failed at up to a 90% rate across Europe, Asia and Australia, starting in UK South; the alerts fired at too low a severity. Same report. Official. VERIFIED-RAW. "US regions were not impacted." Caveat: the entry's header says "lasting 2 hours and 3 minutes", which does not match the stated window of nearly nine hours; cite the window.
3. Uber says its Devpod availability is bounded by its cloud provider. Uber, 2022-12-13. [Uber Engineering](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/). Official. VERIFIED-RAW. "Unfortunately, here we are limited by the cloud provider availability that’s capped at 99.5%." Caveat: 0.5% of a year is about 44 hours; that arithmetic is ours, not Uber's.
4. Uber lists as future work the ability to keep working locally when the remote environment fails. Same post. Official. VERIFIED-RAW. "if anything goes wrong with the remote environment, they are not blocked and can seamlessly continue working locally." Caveat: a stated goal in 2022, not a shipped feature.
5. Meta's disaster exercises include ones that may wipe random devservers. Meta, talk published 2023-12-19. [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment). Official talk. VERIFIED-RAW. "We also have \"dark storms\" which, during a typical exercise, will employ tooling to potentially wipe the contents of random devservers."
6. Meta tells engineers a devserver "can disappear without notice" and must never host a production service; the same talk says the developer environment has to stay up during other outages because engineers fix incidents from it. Same source. Official. VERIFIED-RAW. "Therefore, our services have to be bulletproof to enable our engineers to work through outages that might be affecting other parts of Meta's computational infrastructure." The talk also mentions automated, transparent backups and live migration of VM-based devservers.
7. A startup's Codespaces administrator reports occasional downtime; most people fall back to a local copy of the same devcontainer, and some stay local permanently because of it. 2023-10-18. [HN 37935523](https://news.ycombinator.com/item?id=37935523). 1 commenter, company unnamed. VERIFIED-RAW. "Codespaces have downtime occasionally (as did Cider at Google)."
8. LinkedIn keeps the home directory on a persistent volume because the pod may be moved "to another node or is accidentally deleted". LinkedIn, 2021-11-04. [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development). Official. VERIFIED-RAW.

### 7.2 Developer machines as Kubernetes pods

1. Gitpod concluded after six years and 1.5 million users that Kubernetes was the wrong base for development environments. Gitpod (now Ona), 2024-10-31, by Christian Weichel and Alejandro de Brito Fontes. [Ona](https://ona.com/stories/we-are-leaving-kubernetes). **[V]**, first-person engineering account. VERIFIED-RAW. "In that time, we’ve found that Kubernetes is not the right choice for building development environments."
2. Gitpod: sharing nodes between environments "incurs significant noisy neighbor effects leading to a detrimental user experience". Same source. **[V]**. VERIFIED-RAW. "Latency becomes immediately apparent to users when their language server starts to lag or their terminal becomes choppy."
3. Gitpod: root in a container on a shared node is root on the node. Same source. **[V]**. VERIFIED-RAW. "Giving users root access essentially provides them with root privileges on the node itself, granting access to the development environment platform and other development environments that are running on that node".
4. Gitpod: startup has a floor on Kubernetes, and hot standby was judged "prohibitively expensive". Same source. **[V]**. VERIFIED-RAW. "The reality is that Kubernetes imposes a lower bound for startup time because of all the content operations that need to happen". Memory: "Until swap-space became available in Kubernetes 1.22, memory overbooking was near impossible to do".
5. Shopify built three versions of Spin between fall 2020 and January 2022: one pod with Docker Compose ("CI with a shell"), a pod per repository, then Isospin, a single Linux image run by systemd, adopted after the CEO said developers had to understand too much of the implementation. Shopify, 2022-06-09. [Shopify Engineering](https://shopify.engineering/shopifys-cloud-development-journey). Official. VERIFIED-RAW. Starting point: "Laptops were melting."
6. Shopify in 2022 still ran Spin instances as pods and named the cost. Same source. Official. VERIFIED-RAW. "We still run instances as Kubernetes pods. This builds an uneasy tension between ephemerality and persistence that tends to degrade the trust of developers if pods are relocated."
7. Discord's first version (Coder v1, Sysbox containers on Kubernetes) had "noisy neighbors, lag spikes, and higher-than-expected latency" and could not run privileged containers; in 2023 it moved to VMs under Coder v2. Discord, 2024-02-22. [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments). Official. VERIFIED-RAW. "We learned that emulating a development machine in a container running in Kubernetes is challenging." and "Moving to VMs gives us full access to the host and has drastically simplified the architecture".
8. Woovi tried Coder on Docker inside one LXC container and then on a Kubernetes staging cluster, dropped both for performance and isolation, and settled on one LXC container per developer on an owned server. Woovi, 2025-01-20. [DEV/Woovi](https://dev.to/woovi/remote-development-at-woovi-25mj). Official, small company. VERIFIED-RAW (paraphrase).
9. Instacart "moved away from containers for dev purposes for almost all of our apps" and runs each engineer on a dedicated EC2 machine. 2023-10-19. [HN 37943512](https://news.ycombinator.com/item?id=37943512). 1 named handle, self-declared builder. VERIFIED-RAW. "Mainly because they are a bad developer experience."
10. Counter-cases that stayed on Kubernetes: Uber ("It runs as a container on Kubernetes", with a custom operator and volume snapshots) and LinkedIn (a pod of three containers with a persistent home volume and a pre-built pool). Sources in 3 and 8. Official. VERIFIED-RAW (paraphrase). Both compensate with persistent volumes.

### 7.3 Partial adoption and the cost of two ways to develop

 1. At Shopify, a three-engineer team porting one application (150+ engineers) to Spin found that colleagues on the old local tooling kept breaking it. Shopify, 2022-08-04. [Shopify Engineering](https://shopify.engineering/sfn-team-cloud-development-spin). Official. VERIFIED-RAW. "Since it was easier for most developers to use our old tooling instead of Spin while we were getting the kinks worked out, developers would often unknowingly commit changes that broke some functionality we’d just enabled for Spin." The post names the two feedback loops "Loop of Happy Equilibrium and Spiral of Struggle".
 2. Fullscript refused to keep both a cloud and a local path. Fullscript, 2026-03-05, Ryan Brushett. [Fullscript Builders](https://builders.fullscript.com/posts/local-first-dev-environments-at-medium-scale). Official. VERIFIED-RAW. "two standards is really no standard at all."
 3. Discord: many engineers do frontend work on the laptop and backend work on the remote machine, which "necessitates a \"split-brain\" repository or code syncing between the laptop and remote machine". Source in 15. Official. VERIFIED-RAW.
 4. Where remote is the default and local is tolerated, the support load moves to the local users. Source in 7. 1 commenter. VERIFIED-RAW. "most of the questions come from folks who use the local still".
 5. The unserved minority feels pressure once the majority has moved. 2023-10-19. [HN 37937323](https://news.ycombinator.com/item?id=37937323). 1 commenter, employer unnamed. VERIFIED-RAW. "now that 90% of the company have their needs met, we're getting pressure to conform because maintaining all the physical infrastructure for a small group gets expensive."

### 7.4 Laptop sync as a halfway house

 1. Stripe (2022): with the checkout on the laptop and rsync to the devbox, switching branches is the worst case, and a file watcher then restarts many services. Soam Vasani, QCon Plus, 2022-09-30. [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure). Official talk. VERIFIED-RAW. "That triggers the worst case behavior of sync, because you have to sync a whole lot of files across the network to get up and running." and "these people are pretty unhappy with these interruptions." Stated direction: "We wanted to eliminate the idea of rsyncing completely".
 2. Stripe (about 2019): code that writes code needed a sync-back path that "remained somewhat awkward and non-ergonomic and occasionally unreliable". Nelson Elhage, 2024-05-21. [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/). Named individual, written from memory about five years after leaving. VERIFIED-RAW.
 3. Two Stripe engineers say the checkout later moved to the devbox. 2024-08-19. [HN 41291111](https://news.ycombinator.com/item?id=41291111), [HN 41291251](https://news.ycombinator.com/item?id=41291251). 2 commenters (one ex-Stripe, one "I work on this at Stripe"). VERIFIED-RAW. "sometimes the file watcher would miss an update and the code on your remote machine would be broken in strange ways" and "Engineers use VSCode remote development via SSH."
 4. Stripe by 2026: "Most human-written Stripe code is already produced within an IDE that’s remotely connected to a devbox via SSH." Stripe, 2026-02-19. [Stripe Dev Blog](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2). Official. VERIFIED-RAW.
 5. Slack (2020): code edited on the laptop and pushed to an EC2 dev environment by `slack sync-dev`, "a wrapper around two well-known utilities — fswatch (detects changes) and rsync (transfers changes)". [Slack Engineering, 2020-04-28](https://slack.engineering/development-environments-at-slack). Official. VERIFIED-RAW. By 2022 the new workflow "even eliminates the need to clone the webapp repository locally" ([Slack Engineering, 2022-06-28](https://slack.engineering/remote-development-at-slack/), VERIFIED-RAW).
 6. An unaffiliated engineer on the VM-plus-file-watcher design: "every time I end up just abandoning \"cloud dev\" and doing things on my laptop." 2023-10-18. [HN 37935865](https://news.ycombinator.com/item?id=37935865). 1 commenter. VERIFIED-RAW. Independent voices against laptop-to-server sync: 4 (Stripe talk, nkohari, this commenter, and an Amazon-knowledgeable commenter on its rsync tool, [HN 32091232](https://news.ycombinator.com/item?id=32091232), RAW-PER-NOTE).
 7. Still on laptop sync when last documented: Rippling (PyCharm local, Mutagen to a per-developer EC2 instance, 2022-03-04, [Rippling](https://rippling.com/blog/how-we-used-the-cloud-to-supercharge-remote-development)), Plaid (rsync and Watchman from the laptop to a per-engineer EC2 instance, 2022-06-16, entry 83), Pipedrive (file sync into a remote Kubernetes namespace, 2022-04-26, entry 96). Official. VERIFIED-RAW (Plaid and Pipedrive via Wayback).

### 7.5 Editor latency and network dependence

 1. Stripe kept editors on the laptop around 2019 partly for latency. Source in 25. Named individual. VERIFIED-RAW. "Editing code on the other side of a 200+ms network latency is painful."
 2. Stripe (2022): the editor's architecture decides whether latency is felt. Source in 24. Official talk. VERIFIED-RAW. On VS Code: "There is a local buffer going on, and that buffer is asynchronously synced over SSH to the remote end". On Emacs with TRAMP: "There, yes, you see the latency, absolutely. It's quite annoying." On JetBrains: "it's still very early for them."
 3. Uber put Devpods in five regions (Oregon, Virginia, Netherlands, Mumbai, São Paulo) because otherwise "typing will feel sluggish", and says early web IDE latency "created setbacks for us". Source in 3. Official. VERIFIED-RAW.
 4. Three Uber voices call Devpod slow against one builder who calls it faster than local. 2022. [HN 34046771](https://news.ycombinator.com/item?id=34046771), [HN 34048691](https://news.ycombinator.com/item?id=34048691), [uber/h3-java#116](https://github.com/uber/h3-java/issues/116); builder: [HN 37005976](https://news.ycombinator.com/item?id=37005976). 3 commenters + 1. VERIFIED-RAW. "Most developers in Uber use local builds anyway because of input lag." / "The biggest services/apps at Uber are not developed in devpods." / "have to use devpod which is quite slow and is affecting productivity." Caveat: these sit beside Uber's own "over 60%" adoption figure from the same month; employment is self-declared.
 5. Google voices place latency complaints at distance or on bad links, and report none over ssh nearby. 2026-05. [HN 48125361](https://news.ycombinator.com/item?id=48125361), [HN 48130338](https://news.ycombinator.com/item?id=48130338), [HN 48128934](https://news.ycombinator.com/item?id=48128934), [HN 48135152](https://news.ycombinator.com/item?id=48135152). 4 commenters, self-declared. VERIFIED-RAW. "sometimes my neovim is very slow and laggy because of the remote connection / network file system" / "I was working out of the Sydney office. Almost everything was incredibly slow due to that latency" / "The ssh latency is good enough that I can run X forwarding to launch graphical instances of emacs and gvim."
 6. Google's own caveat for a virtual fleet: it "requires a consistently reliable and performant client internet connection", and remote employees should be near a cloud region. Google Cloud, 2022-12-08. [Google Cloud blog](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future). Official. VERIFIED-RAW.
 7. In a July 2022 survey with 1,173 complete responses, 40.1% named network dependency as the main barrier to cloud IDEs and 4.3% used one regularly; 44.8% had no plans to adopt. Posted to arXiv 2026-03. [arXiv 2603.06050](https://arxiv.org/html/2603.06050v1). Academic paper. VERIFIED-RAW. Caveat: "The survey was distributed primarily via the Codeanywhere newsletter", a cloud IDE vendor; it asks about cloud IDEs, not ssh to a server.
 8. Other single voices on network dependence: a manager who mandated one remote server "got some grumbling about latency (everyone works remotely from around the world)" and judged it less friction than environment drift ([HN 42756034](https://news.ycombinator.com/item?id=42756034)); a Gitpod user stopped at a company with staff in Australia and New Zealand ([HN 37942185](https://news.ycombinator.com/item?id=37942185)); a Codespaces user gave up at a venue with bad wifi, "Constant disconnection meant I eventually gave up on codespaces" ([HN 37940141](https://news.ycombinator.com/item?id=37940141)). 3 commenters. VERIFIED-RAW.
 9. Discord after moving to VMs: "we no longer see support tickets and questions about high latency and connection drops." Source in 15. Official. VERIFIED-RAW.

### 7.6 Cost of always-on machines and idle stop

 1. Vendor model: an 8-core, 16 GB VM at about $300 a month is $360,000 a year for 100 engineers always on, and about $104,800 if each runs 10 hours per weekday. Gitpod, 2023-12-12. [DEV/Gitpod, Wayback](https://web.archive.org/web/20240406223939/https://dev.to/gitpod/the-cost-vs-ux-trade-offs-of-designing-and-operating-cdes-4937). **[V]**. VERIFIED-RAW (Wayback; live URL is 404). The post adds that shutdown makes engineers wait for a VM at the start of each day.
 2. Instacart stops paying for compute outside working hours. 2023-10-19. [HN 37943512](https://news.ycombinator.com/item?id=37943512), [HN 37943559](https://news.ycombinator.com/item?id=37943559). 1 named handle. VERIFIED-RAW. "It stays up running during the users work hours (~8 hours) and then hibernates (the machine is off but memory persisted) which reduces EC2 costs (minus EBS) to zero. We detect activity on their laptop and then wake it when needed." and "We don’t use spot because they can be yanked away easily. Savings plans and hibernation are the biggest cost savers."
 3. Uber deletes the container of an inactive Devpod, snapshots its disk, and rebalances VMs; it tracks "the cost per Devpod" against off-the-shelf options. No figures. Source in 3. Official. VERIFIED-RAW.
 4. Stripe moved devbox state to EBS volumes so instances can be switched off. Source in 24. Official talk. VERIFIED-RAW. "we can also save money by switching devboxes off on weekends" and "there's not a whole lot of user facing value, but it allows us to keep our budget within limits."
 5. Idle stop has a user cost: a 30-minute timeout with a 40-second resume led some users to keep-alive scripts or back to local. Source in 7. 1 commenter. VERIFIED-RAW. "Some folks don't like the 40 seconds to reactivate a codespace after being inactive for more than 30 minutes".
 6. Skydio's shutdown of idle VMs and GPUs under Coder "reduced cloud computing expenses by 90%". Coder, 2025-01-06. [Coder](https://coder.com/blog/how-coder-enables-innovation-at-leading-tech-companies). **[V]**. VERIFIED-RAW. Caveat: vendor claim about a previous always-on virtual desktop system.

### 7.7 Reversals and holdouts: what each source says

| Company | What the source says | What it does not say | Source, type, status |
| --- | --- | --- | --- |
| Shopify | NixCon 2025 abstract (talk 2025-09-05): "Over the past year at Shopify we've undergone a lot of changes internally. We moved from cloud development to local development, multirepo to monorepo, and Homebrew / Apt to Nix. Today, the majority of development is being done inside Nix-based environments." | No reason given; Spin is not named; no share of engineers. | [media.ccc.de](https://app.media.ccc.de/v/nixcon2025-56413-nix-based-development-e). Official talk abstract, speaker Josh Heinrichs. VERIFIED-RAW (abstract only; recording not heard) |
| Shopify, 2026 | For mobile agents it built "a fleet of remote Macs"; "Just three or four workflows were enough to max out a laptop"; "We destroy the Mac when the session ends and prepare a replacement." Mobile teams "were used to working locally". | Nothing about web or backend engineers' machines; Spin is not mentioned. | [Shopify Engineering, 2026-10-22](https://shopify.engineering/remote-dev). Official. VERIFIED-RAW |
| Lyft | Onebox "was essentially a Devbox environment running on an EC2 instance"; an instance "could require too many resources to be practical"; engineers fell back on CI; Lyft moved "the development environment back to the engineer's laptop", running one service natively on macOS. | The failure was the size of the per-developer service graph, not remoteness. | [InfoQ, 2022-03-28](https://www.infoq.com/news/2022/03/lyft-cloud-local-dev). Press summary of an official series. VERIFIED-RAW (InfoQ only; Lyft's posts not opened) |
| Fullscript | Replaced a local Kubernetes setup and per-developer EKS namespaces with local Docker Compose over about three months. "AWS auth sessions expire, for example, and this interrupts flow state." "It was also expensive, and AWS account limits are real." | The remote design was namespaces of services with code sync, not an ssh machine. | [Fullscript Builders, 2026-03-05](https://builders.fullscript.com/posts/local-first-dev-environments-at-medium-scale). Official. VERIFIED-RAW |
| comma.ai | "All our code is in a monorepo that we have cloned on our workstations. This monorepo is kept small (<3GB)". Compute is an owned data center. | Whether workstations are desk machines; nothing about remote dev having been tried. | [comma.ai, 2026-02-03](https://blog.comma.ai/datacenter/). Official. VERIFIED-RAW |
| Block | goose is "Available as both a CLI and desktop app"; "OAuth flows are implemented directly within locally run MCP servers, a practical but temporary solution." | No statement that remote machines were rejected. | [goose blog, 2025-04-21](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise). Official, named author. VERIFIED-RAW |
| Cloudflare | Agent clients run on engineers' machines behind a gateway: "No API keys exist on user machines." Planned: background agents "with the same tools available locally (MCP portal, git, test runners) but running entirely in the cloud." | Local is the current state; cloud agents are the stated next step. | [Cloudflare, 2026-04-20](https://blog.cloudflare.com/internal-ai-engineering-stack/). Official. VERIFIED-RAW |
| Dashlane | Agents run in Dev Containers: "They are sandboxed environments that run inside a container on the developer's machine." 80% of engineers adopted within three months. | No comparison with remote machines. | [Dashlane, 2026-04-22](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team). Official. VERIFIED-RAW |
| Slack (partial reversal inside one company) | Webpack builds moved off shared dev instances to laptops ("One build would consume the memory of the entire instance"), then back to remote in 2021 on doubled instances. | | Entries 28 and 67. Official. VERIFIED-RAW |

### 7.8 Closing and pivoting of dev-environment products

| Product | What happened | Source, status |
| --- | --- | --- |
| Gitpod | Left Kubernetes for Gitpod Flex in October 2024; rebranded as Ona in September 2025 and "is now pitching itself as an AI agent platform"; the repository says "We no longer recommend this version of Gitpod". | [Ona](https://ona.com/stories/we-are-leaving-kubernetes) **[V]**; [The Register, 2025-09-03](https://www.theregister.com/2025/09/03/gitpod_rebrands_as_ona/) press; [Gitpod README](https://github.com/gitpod-io/gitpod). VERIFIED-RAW. The README also says Gitpod Classic pay-as-you-go "did sunset on October 15th" 2025 |
| JetBrains CodeCanvas | Development discontinued; no new licenses from October 16, 2025; instances stop after March 31, 2026. "we have concluded that the current CDE setup of CodeCanvas is too niche, if not obsolete, in the increasingly AI-enabled tech industry of today." | [JetBrains blog](https://blog.jetbrains.com/codecanvas/2025/10/jetbrains-is-sunsetting-codecanvas/) **[V]**. VERIFIED-RAW (the note had only a press snippet) |
| AWS Cloud9 | "AWS Cloud9 is no longer available to new customers", dated July 25, 2024. | [AWS docs](https://docs.aws.amazon.com/cloud9/latest/user-guide/history.html) **[V]**. VERIFIED-RAW |
| Amazon CodeCatalyst | "will no longer be open to new customers starting on 11/7/2025". | [AWS](https://aws.amazon.com/codecatalyst) **[V]**. VERIFIED-RAW |
| Daytona | A podcast page describes "Daytona’s hard pivot from human dev environments to AI sandboxes". | [Latent Space](https://latent.space/p/daytona). Press/podcast. VERIFIED-RAW for the phrase; date of the pivot and funding figures not checked |
| GitHub Codespaces, Coder | Operating; Coder publishes case studies through 2026. | Entries 1, 60, 86 |

### Not established (S7)

- Why Shopify moved back to local development. The abstract gives no reason; Apple Silicon, cost and Spin reliability are guesses.
- That any company returned to laptops because Apple Silicon made them fast enough. Discord cites Apple Silicon as a reason to move to remote.
- The loss of about 250 codespaces on 2025-09-17. The note's link opens an April 2024 incident (about 7% of new codespaces never became available), and GitHub's September 2025 availability report does not mention Codespaces. Do not use.
- Any measured keystroke latency, any utilization figure, any per-engineer fleet cost from an operator, any chargeback scheme.
- A security incident specific to multi-tenant dev containers. Gitpod's root-on-the-node account is a design statement.
- That Block, Cloudflare or Dashlane rejected remote machines; each describes where agents run today.
- That the Uber complaints represent most Uber engineers; they are three self-declared voices against a published 60% adoption figure.
- That the product category "failed"; the sources show closures and repositioning toward agents, with Codespaces and Coder still operating.

---

## S8. Staffing and cost

### 8.1 Staffing table (every public team-size figure found)

| Company (date of fact) | Team | Engineers served | What it built or ran | Source, type, status |
| --- | --- | --- | --- | --- |
| Instacart (built about 2021; stated 2023-10) | "It took 4-ish people to build it in under a year"; "not all of us were full time on it at all times"; since then "part time feature and maintenance work" | "hundreds of other developers"; 600 is the figure in the author's own payback arithmetic | Bento Remote: a dedicated EC2 machine per engineer, pre-built images, pool, nightly push, hibernation | [HN 37961161](https://news.ycombinator.com/item?id=37961161), [HN 37965171](https://news.ycombinator.com/item?id=37965171). 1 named handle, "a system my team built". VERIFIED-RAW. No official post exists |
| Slack (2021) | "In 2021, we formed a new team called dev infrastructure with 2 engineers where I worked on the remote development project." | "easily over 400 engineers" working in the webapp | Pool in an Auto Scaling Group, CLI, home-directory sync, per-branch instances | [Daytona-hosted article by Sylvestor George, 2024-08-21](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack) (named Slack engineer on a vendor site) and [DX podcast](https://getdx.com/podcast/remote-development-at-slack/). VERIFIED-RAW. Caveat: the 2022 Slack post says only "a new team was formed"; the size at launch beyond the founding two is not stated |
| Cruise (2022-12-09) | manager "whose team of eight manages the tool" | "about 1,000 engineers using Cruise Shells" | Cruise Shells: ephemeral GCP VMs allocated each day and killed each evening | [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise). Press, quoting a named manager. VERIFIED-RAW |
| Stripe (2012-2019; written 2024-05) | "devprod grew from less than one FTE into a team of perhaps a dozen engineers"; the organization "could afford 10 FTEs on tooling" | Engineering "grew from a few hundred to over a thousand" | All developer tooling, of which devboxes and sync were part | [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/). Named individual, from memory. VERIFIED-RAW. Both "a dozen" and "10 FTEs" are in the source |
| Dropbox (undated) | Matt Kulka "and the five other members of the Dropbox Developer Environments team"; "Only 2 people migrated 1000 developers to Coder in just 4 months." | "About 1000 developers" | Templates on Coder over per-developer EC2; replaced an in-house Python provisioner | [Coder](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder). **[V]** case study. VERIFIED-RAW |
| Unnamed B2B SaaS on AWS (2025-12-25) | "Head of Platform + 3 platform engineers" | 72 engineers | Whole platform, including per-developer environments of 20-30 microservices on EKS; "Success rate of environment creation is low" | [Substack, Romaric Philogene](https://romaricphilogene.substack.com/p/argocd-eks-20-services-and-a-dev). **[V]** (author is CEO of Qovery), company unnamed. VERIFIED-RAW |
| Shopify, one application (2022) | "a team of three engineers to get us up and running on Spin" | "over 150 SFN engineers" | Porting one application, not the platform | Entry 19. Official. VERIFIED-RAW |
| Meta (2023-12) | "Our team is small. We don't have the bandwidth to handhold every single developer" | Not stated | Developer environment reliability | Entry 5 source. Official talk. VERIFIED-RAW. No number |
| Plaid (2022-06), Discord (2024-02) | Not stated ("Developer Efficiency Team"; team unnamed) | Plaid "360+ engineers" | | Entries 83, 15. VERIFIED-RAW |

Independent sources for "a self-built pooled platform took about four or more engineers": Instacart, Cruise, Stripe. Slack's founding team of two is the only lower figure, and it rests on one named author.

### 8.2 What the headcount bought

 1. Warm pools: Slack keeps "A set number of development environments" ready in an AWS Auto Scaling Group and delivers one "in under 90 seconds"; Stripe aims for 10 seconds, "we proactively provision and warm up a pool of devboxes"; LinkedIn cut setup and build "from 10-30 minutes to just 10 seconds for most of our products"; GitHub went from 45 minutes to about 10 seconds with prebuilt pools. Entries 28, 27, 8; [GitHub, 2021-08-11](https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/). Official. VERIFIED-RAW.
 2. Without a pool: "Currently it takes 2-3 minutes to create a new Devpod." Uber, source in 3. Official. VERIFIED-RAW. Instacart: "a fresh new fully dedicated EC2 machine in about two minutes" ([HN 37938537](https://news.ycombinator.com/item?id=37938537), VERIFIED-RAW).
 3. Image tested on every merge, and live patching: Instacart. [HN 37938537](https://news.ycombinator.com/item?id=37938537), [HN 37943645](https://news.ycombinator.com/item?id=37943645). 1 named handle. VERIFIED-RAW. "It is continuously tested on every merge and verified to function." and "It is all fairly straight forward Ansible and shell scripts. We push nightly to everyone's existing machines."
 4. Hibernation tied to laptop activity: Instacart, entry 41. Overnight image updates with stable, rc, dev and none channels: Uber, source in 3. VERIFIED-RAW.
 5. Custom laptop-to-server sync with barriers: Stripe (rsync, then watchman), Slack 2020, Plaid. Entries 24-30. VERIFIED-RAW.
 6. Multi-region placement: Uber's five regions (entry 33); a Coder customer added a workspace proxy "in an AWS European region" to cut latency ([Coder](https://coder.com/success-stories/global-investment-firm), **[V]**, VERIFIED-RAW).
 7. Work that remains after buying the orchestrator: Discord "added documentation, training materials, recorded videos, and created rich default dotfiles" and says this last-mile work "still felt insufficient to meet everyone's needs". Source in 15. Official. VERIFIED-RAW.
 8. Elhage's judgment on what mattered at Stripe: "I think the existence of the team, and its investment in stability and reliability of developer tooling ... were the major drivers in any success of the Stripe developer experience." Source in 25. Named individual. VERIFIED-RAW (the ellipsis replaces a parenthesis).

### 8.3 One- or two-person operation

 1. A startup on GitHub Codespaces, set up by one engineer: prebuilds, onboarding "in a 15 minute meeting", "most of our newer employees exclusively use codespaces", a few long-tenured engineers stay local. Source in 7. 1 commenter. VERIFIED-RAW. Caveat: he wrote "Google Codespaces"; a reply corrects it to GitHub.
 2. An agency of about ten developers on Codespaces with one person maintaining the configuration. 2023-10-18. [HN 37935463](https://news.ycombinator.com/item?id=37935463). 1 commenter. VERIFIED-RAW. "when I fix the codespace config I know everyone will definitely benefit from the changes." Cost: "pretty expensive (if you have, say, 10 devs using it all day every day) compared to \"free\""; it let them "move everyone to fairly cheap macbook airs".
 3. Woovi: one owned server with "96 CPUs and 512GB of RAM, easily supports 10 developers"; ssh "using a terminal or any IDE like VSCode or Webstorm"; ssh keys added by hand, with automation listed as future work. Source in 16. Official, small company. VERIFIED-RAW. Who maintains it is not stated.
 4. A manager who mandated one remote server: "Eventually I forced everyone to work with a controlled dev environment on a remote server. They can work over ssh with command line tools or VSCode." [HN 42756034](https://news.ycombinator.com/item?id=42756034). 1 commenter, team size unstated. VERIFIED-RAW.
 5. Slack's project began with two engineers (staffing table). Count of accounts of one or two people running remote development: 5, of which two use a hosted product, two use a single server, and one (Slack) is a pooled platform whose later team size is unknown. None gives hours per week.

### 8.4 The advice to start with a hosted product

 1. Instacart, after building its own: "So I highly recommend everyone at least take a look and evaluate if you have the need. Start with the SaaS versions and see." It built because Codespaces "really couldn't meet our needs for things like pre-built images, preserved disks, warm pools, live patching, and being behind our firewall", and because its apps "needed 64GB", which "made other 3rd party tools fantastically expensive". [HN 37938537](https://news.ycombinator.com/item?id=37938537). 1 named handle. VERIFIED-RAW.
 2. Dropbox built a provisioner, found that it "used a monolithic design in Python, so extending it to support new environments was time-consuming", and bought. Coder case study, staffing table. **[V]**. VERIFIED-RAW.
 3. Uber frames the same choice from the other side: "to justify building an in-house solution, we continuously track and improve the cost per Devpod". Source in 3. Official. VERIFIED-RAW.

### 8.5 Per-engineer machine cost models

 1. Codespaces list price (read 2026-11-27): $0.18 an hour for 2 cores, $0.36 for 4, $0.72 for 8, $1.44 for 16, $2.88 for 32; storage $0.07 per GB-month. [GitHub Docs](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces). **[V]** price list. VERIFIED-RAW. Any annual figure built from it is our arithmetic.
 2. Gitpod's 100-engineer model: entry 40. **[V]**.
 3. Instacart's payback claim, on the author's own assumptions: "$120/hr *1 hour saved per week* 4 weeks * 600 engineers. We paid it back in less than four months, conservatively." [HN 37965171](https://news.ycombinator.com/item?id=37965171). 1 named handle. VERIFIED-RAW.
 4. Woovi: "It is much cheaper to buy server hardware than Macbooks." Source in 16. Official, small. VERIFIED-RAW. No numbers.
 5. Dropbox reports a "30% reduction in cloud computing costs" after moving to Coder. Staffing table source. **[V]**. VERIFIED-RAW.

### 8.6 Slack's instance cost doubling

 1. Slack moved from C5.2xlarge to "C5.4xlarge (16 core, 32 GB RAM) with a single configuration change" once frontend builds ran remotely. [Slack Engineering, 2022-06-28](https://slack.engineering/remote-development-at-slack/). Official. VERIFIED-RAW. "While this doubled the cost of our development environments, it was justified by the increased efficiency of our engineering team."
 2. GitHub did the same in one step: "So we moved to 32 core, 64 GB RAM VMs. By changing a single line of configuration, we upgraded every engineer’s machine." Source in 46. Official (and a product launch post). VERIFIED-RAW.

### Not established (S8)

- That one engineer can build or run a pooled, pre-warmed platform. No source describes it.
- Hours per week, tickets or on-call load for a dev-machine platform at any size.
- Team sizes at Uber, LinkedIn, GitHub, Airbnb, Discord, Plaid, Meta. "Our team is small" has no number.
- That Slack ran its platform with two engineers; two is the size at formation in 2021.
- Instacart's 600 engineers as a headcount; it is an assumption in a payback sum.
- Any per-engineer fleet cost from a company that runs one. All dollar figures are vendor models, list prices or one builder's estimate.
- Pipedrive's "4 engineers in under 3 months" (not in the post I read; UNVERIFIED) and DekaBank's team size.

---

## S9. Prevalence

### 9.1 Classification table

Models: **R** remote Linux machine holds the checkout, editor on the desktop over ssh. **B** browser editor as the main path. **H** laptop checkout synced to a remote runner. **L-back** returned to laptops. **L** laptop or desk machine by choice. Strength: **A** official post or talk read in raw text; **B** several independent individuals, or a named speaker; **C** one voice, vendor case study, press or snippet. "One voice" marks a classification resting on a single person.

| Company | Model (date) | Strength | Evidence and status |
| --- | --- | --- | --- |
| Stripe | H to about 2022, then R (2024-2026) | A + 2 voices | Entries 24-27. VERIFIED-RAW |
| Slack | H (2020), then R for the webapp (2021-2022); local kept "for edge cases or personal preference" (2024) | A | Entries 28, 67, 76. VERIFIED-RAW |
| Uber | R on Kubernetes; VS Code remote, JetBrains Gateway, Vim and Emacs; 60% (Nov 2022) | A, with 3 dissenting voices on speed | Entries 3, 33, 34. VERIFIED-RAW |
| LinkedIn | R (RDev pods, "IDEs that use remote SSH capabilities") | A + 1 voice (2023) | Entry 8; [HN 37945230](https://news.ycombinator.com/item?id=37945230). VERIFIED-RAW |
| GitHub | R/B (Codespaces; VS Code primary, ssh for Vim and Emacs) for "the majority of GitHub.com development" (2021) | A (product launch post) | Entry 46 source. VERIFIED-RAW |
| Discord | R for backend and infrastructure (VMs, VS Code remote); L for much frontend (2024) | A | Entry 15. VERIFIED-RAW |
| Meta | R (devservers; talk confirms devservers, drills, backups) | A | Entry 5 for the devserver facts; editor path per `google_and_meta.md`, not re-opened here |
| Google | R plus B (Cloudtop by ssh, or the browser editor) | A + several voices | Entries 35, 36; architecture per `google_and_meta.md`, not re-opened here |
| Instacart | R (EC2 per engineer, "Just connect VSCode to it") | C, **one voice** (self-declared builder) | [HN 37938537](https://news.ycombinator.com/item?id=37938537). VERIFIED-RAW |
| Airbnb | R (in-house; VS Code remote, Neovim over ssh; "You can always develop locally if you're on the plane") | B-: talk abstract + **one voice** | [DPE Summit abstract](https://dpe.org/sessions/airbnb-developer-productivity-wins/), [HN 37937401](https://news.ycombinator.com/item?id=37937401), [HN 37937414](https://news.ycombinator.com/item?id=37937414). VERIFIED-RAW. The abstract says only "a Kubernetes-driven platform for creating on-demand development environments called AirDev" |
| Dropbox | R (EC2 per developer via Coder; "most developers use JetBrains or Visual Studio Code") | C, vendor only | Staffing table. **[V]** VERIFIED-RAW |
| Cruise | R, ephemeral daily GCP VMs (2022); editor path not stated | C, press | Staffing table. VERIFIED-RAW |
| Woovi | R (LXC on an owned server, ssh, 10 developers, 2025) | A, small | Entry 56. VERIFIED-RAW |
| Amazon | H in 2017 and 2022, R in 2025-2026 (dev desktop, VS Code Remote-SSH) | B, testimony only | `testimony_other_tech.md`. RAW-PER-NOTE; employment inferred for several voices |
| Jane Street | A development machine per developer; location not stated | B, named speakers on the firm's podcast | [Signals and Threads, 2026-10-16](https://signalsandthreads.com/the-changing-craft-of-programming/). VERIFIED-RAW for "the hosts are roughly all of the developer machines at the firm"; R is a reading, not a statement |
| DekaBank | Hardened laptop, then R/B (Coder; web IDE or local VS Code and IntelliJ) | C, vendor only | Entry 86. **[V]** VERIFIED-RAW |
| Fortune 500 investment firm (unnamed) | L (MacBooks), then R (Coder, 300 developers) | C, vendor only, unnamed | Entry 51 source. **[V]** VERIFIED-RAW |
| Unnamed company | R, a VM per branch, "VS Code (native or browser based) or just plain SSH" | C, **one voice**, employer unnamed | [HN 37936660](https://news.ycombinator.com/item?id=37936660). VERIFIED-RAW |
| Plaid | H (laptop CLI, rsync and Watchman to a per-engineer EC2 Docker host, 2022); 87% exclusive | A | Entry 83. VERIFIED-RAW (Wayback). The notes had this as R |
| Rippling | H (Mutagen to EC2, 2022) | A | Entry 30. VERIFIED-RAW |
| Stytch | H ("ALL development into the cloud" with code synced from the laptop, 2022) | A, thin | [Stytch](https://stytch.com/blog/remote-dev-1/). VERIFIED-RAW for the phrase |
| Pipedrive | H (file sync into a remote Kubernetes namespace, 2022) | A | Entry 96. VERIFIED-RAW (Wayback) |
| Databricks | H or R, unclear | C, snippet and inferred attribution | Notes only. SNIPPET. Leave out of the table or mark unknown |
| Shopify | R (Spin, 2020-2022), L-back (stated 2025), remote Macs for mobile agents (2026) | A | S7.7. VERIFIED-RAW |
| Lyft | R (Onebox on EC2), L-back by 2022 | B, press summary of official series | S7.7. VERIFIED-RAW |
| Fullscript | Remote namespaces, L-back (2026) | A | S7.7. VERIFIED-RAW |
| comma.ai | L (workstations plus owned cluster, 2026) | A | S7.7. VERIFIED-RAW |
| Block, Cloudflare, Dashlane | L for agents (2025-2026); human dev model not described | A for where agents run | S7.7. VERIFIED-RAW |
| Photoroom | L, with a stated intent to move agents to "remote containers" (2026) | A, small, intent only | [Photoroom, 2026-04-22](https://www.photoroom.com/inside-photoroom/the-laptop-is-the-wrong-place-to-run-coding-agents). VERIFIED-RAW |

### 9.2 Counts and statements

 1. R as current or last-documented model: Stripe, Slack, Uber, LinkedIn, GitHub, Discord (backend), Meta, Google, Instacart, Airbnb, Dropbox, Cruise, Woovi, Amazon: 14. At strength A read in raw text: 9 (the first eight plus Woovi), with Meta's and Google's editor path resting on another note.
 2. Moved from H to R: Stripe, Slack, and Amazon by testimony. Still H when last documented (2022): Plaid, Rippling, Stytch, Pipedrive.
 3. Returned to laptops: Shopify, Lyft, Fullscript. Laptop by choice with a published description: comma.ai, and for agents Block, Cloudflare, Dashlane.
 4. Vendor survey: "64% of developers say they use non-local environments as their primary development setup, up from just 36% last year." The listed categories are ephemeral or preview environments 10%, personal remote dev environments or clusters 22%, other remote dev tools 12%. Docker, 2025. [Docker](https://www.docker.com/blog/2025-docker-state-of-app-dev/). **[V]**. VERIFIED-RAW. Caveat: the categories sum to 44%; the page says this year's base is "broader, more diverse" than "our previous more IT-focused surveys".
 5. One commenter's statement of prevalence: "Plenty of large companies are using them (I'm talking Google/FB/Microsoft and the like). You may not have heard of it because they run these systems in-house vs using a commercial service." [HN 37936660](https://news.ycombinator.com/item?id=37936660). 1 commenter. VERIFIED-RAW.

### Not established (S9)

- A neutral, current figure for the share of organizations on the target model. The 2022 survey (4.3%) asks about cloud IDEs and was vendor-recruited; the Docker figure is vendor data with categories that do not sum.
- "Every large technology company does this." The supportable statement is that most large companies with public evidence document a remote Linux machine with the editor attached over ssh.
- Current (2025-2026) state at Uber, LinkedIn, GitHub, Slack, Instacart, Cruise: every primary source is two to five years old. Cruise's source predates its 2023-2024 changes.
- Instacart, Airbnb and the per-branch VM company each rest on one voice; Dropbox, DekaBank and the investment firm on vendor case studies alone.
- That Plaid, Rippling, Stytch or Pipedrive later moved the checkout to the server.
- Anything about Apple, Netflix, Snowflake, Atlassian, Figma, Canva, Datadog (job postings only, not opened).

---

## S10. Transition

### 10.1 Staged path, with the company behind each stage

| Stage | Who did it | Source and status |
| --- | --- | --- |
| 1. One application that runs on one machine | Slack: "our remote development environments was only for web app" (podcast). Instacart built for apps that "needed 64GB". The Coder investment firm piloted with "a team that worked on one of the most complex build environments". Counter-cases Lyft and the 72-engineer company ran the whole service graph per developer. | Entries 76, 59, 51, S7.7, staffing table. VERIFIED-RAW |
| 2. A product, or plain machines | Product: two Codespaces accounts; Discord, Dropbox and DekaBank on Coder. Plain machines: Slack and Instacart on EC2 with a small CLI (`slack remote-dev`, `bento remote create`); Woovi on one server. Advice: "Start with the SaaS versions and see." | Entries 54-56, 59, 60. VERIFIED-RAW |
| 3. An existing network segment behind the package proxy and identity provider | DekaBank: workspaces in "a dedicated network segment"; "dependencies can only be fetched through JFrog Artifactory"; approval "through standard processes without special audits". Instacart: "behind our firewall". Small-team version: access "directly mediated moment to moment by someone's github access (which for us also runs through our sso, cloudflare zt etc)". | Entry 86 **[V]**; [HN 37938537](https://news.ycombinator.com/item?id=37938537); [HN 37935463](https://news.ycombinator.com/item?id=37935463). VERIFIED-RAW |
| 4. Volunteers | Slack: "People came out to volunteer, to try the prototype"; prototype in August 2021, "we took two months to make things better" before GA. Discord: "we identified and recruited \"champions\" from various departments who were enthusiastic about tooling." | Entries 76, 15. VERIFIED-RAW |
| 5. Open to all, default for new hires | Slack: "before long the majority of the team had switched of their own accord." Uber: "organic adoption". Codespaces startup: "most of our newer employees exclusively use codespaces". GitHub: "Codespaces are now the default development environment for GitHub.com." | Entries 67, 3, 54, 46. VERIFIED-RAW |
| 6. Leave local development alone | Slack (2024): "we still support local development for edge cases or personal preference." Airbnb voice: "You can always develop locally". Codespaces startup: a few long-tenured engineers stay local. Only Discord set a "Hard cutoff", for backend. | Entries 76, 54, 15; [HN 37937414](https://news.ycombinator.com/item?id=37937414). VERIFIED-RAW |
| 7. Idle stop | Instacart hibernation; Uber inactive-environment shutdown; Stripe weekend switch-off; Codespaces timeout. | Entries 41-44. VERIFIED-RAW |
| 8. Agents on the same servers | Stripe: agents run on "the same standard developer environment that Stripe engineers use: the devbox"; "What’s good for humans is good for agents"; devboxes run in the QA environment, so agents "don’t have access to real user data, Stripe’s production services, or arbitrary network egress." DekaBank plans a twelve-week pilot of a coding agent in its workspaces (planned, not done). | Entry 27; entry 86 **[V]**. VERIFIED-RAW |

The order is assembled here from separate accounts; no single source describes all eight stages.

### 10.2 Adoption curves with dates

 1. Slack: team formed at the beginning of 2021; "We released a minimal remote development workflow in August 2021"; "While in beta, 30% of webapp engineers had completely switched"; "It was released for General Availability in October 2021 and by the end of January 2022 over 90% of our engineers had completely switched to the remote development workflow." [Slack Engineering, 2022-06-28](https://slack.engineering/remote-development-at-slack/). Official. VERIFIED-RAW. The post never says "four months"; October to end of January is three to four months.
 2. Slack, podcast version: "from general release happening in October within three months, we saw over 90% of backend engineers completely being switched". [DX podcast](https://getdx.com/podcast/remote-development-at-slack/). Named individual. VERIFIED-RAW. Caveat: the transcript says "by January 2021", a slip for 2022.
 3. Slack, later account by the same engineer: "Within a year of implementation, we achieved an adoption rate of 80-85%, which has remained steady since then." [Daytona-hosted article, 2024-08-21](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack). Named individual on a vendor site. VERIFIED-RAW. This conflicts with "over 90%"; the populations may differ (webapp or backend engineers against all engineers). State both or use "over 80%".
 4. Slack onboarding: setup "from about an hour to mere minutes" (post); "1.5 hours" to "five minutes" (podcast). Entries 74, 75. VERIFIED-RAW.
 5. Uber: "As of November 2022, over 60% of Uber software engineers have adopted Devpods." Source in 3. Official. VERIFIED-RAW. Start date of the program is not given.
 6. Plaid: "After beta testing, the new 'Remote Devenv' was rolled out over several quarters. As of now (~1.5 years after initial development/rollout) 87% of users exclusively use the Remote Devenv and 97% of all commands are run on the Remote Devenv." Plaid, 2022-06-16. Entry 83. Official. VERIFIED-RAW (Wayback).
 7. GitHub: bootstrap went from 45 minutes to 5 minutes to about 10 seconds; by August 2021 Codespaces was used "for the majority of GitHub.com development". Source in 46. Official. VERIFIED-RAW. A podcast page says "600 of their 1,000 engineers using it daily" ([Changelog #459](https://changelog.com/podcast/459), press, VERIFIED-RAW). No start date for the internal rollout.
 8. Discord: Coder engagement "began in late 2020"; move to VMs "In 2023"; post published 2024-02-22. No percentages. Source in 15. Official. VERIFIED-RAW. Caveat: the post also says "we embarked on this journey before the pandemic began", which does not fit late 2020.
 9. Instacart: built in under a year about 2021; adoption share not stated ("We at Instacart use them heavily"). Entry 59. VERIFIED-RAW.
10. Plaid source details: [Plaid, 2022-06-16, Wayback capture](https://web.archive.org/web/20240229162844/https://plaid.com/blog/scaling-with-devenv/) (live page returns 403). "Each engineer was provisioned an EC2 instance with a running Docker Daemon. The Devenv CLI running on a user's laptop acted as the client"; code reaches it by "local watching to rsync code from a developer's laptop to the remote instance on file changes (using Watchman)". Before remote, Plaid used Docker Compose on Docker for Mac (Vagrant was dropped by early 2017).

### 10.3 What blocked holdouts and how each was answered

| Blocker | Who reported it | Answer given | Source, status |
| --- | --- | --- | --- |
| Other editors (Emacs, Vim) | Slack volunteers; GitHub | Slack added support and a synced `~/.remote-dev-home`; GitHub: "asking our Vim and Emacs users to commit to a graphical editor is less great", so sshd went into the prebuilt image | Entries 74, 75, 46. VERIFIED-RAW |
| JetBrains users | Codespaces startup: other IDEs "aren't as supported as VsCode yet"; Stripe 2022 | Uber supports "JetBrains IDEs via ssh using JetBrains Gateway"; no answer at the startup | Entries 7, 32, 3. VERIFIED-RAW |
| Lost trust after early breakage | Slack: "if it breaks a couple of times or people don’t like it a couple of times, they’re hesitant of giving it another shot." | Prototype with volunteers before general release | Entry 75. VERIFIED-RAW |
| Latency and dropped connections | Discord v1; Uber voices; distant users | Discord moved to VMs and a new network stack; Uber added regions; unresolved for the Uber voices | Entries 15, 33, 34, 39 |
| Idle timeout and cold resume | Codespaces startup | None; users wrote keep-alive scripts or stayed local | Entry 44. VERIFIED-RAW |
| Little command-line experience | Discord | Default dotfiles, docs, videos; judged insufficient | Entry 52. VERIFIED-RAW |
| Frontend loops, mobile, emulators | Discord (frontend stays local); Uber ("we do not have an Android emulator"); Shopify (remote Macs) | Left local, or a separate machine class | Entries 21, 3, S7.7. VERIFIED-RAW |
| Work that cannot run in the cloud | The "10%" team | None reported | Entry 23. VERIFIED-RAW |
| Resistance to change in general | Discord: "there will always be some who resist change" | Nudges "when their MacBooks had issues", then the cutoff, accelerated by Apple Silicon | Entry 15. VERIFIED-RAW |

### 10.4 Editor facts

 1. VS Code Remote-SSH installs a server on the remote machine and keeps the interface local. Microsoft documentation, read 2026-11-27. [VS Code Remote FAQ](https://code.visualstudio.com/docs/remote/faq). **[V]** documentation. VERIFIED-RAW. "The VS Code Server is quickly installed by VS Code when you connect to a remote endpoint and can host extensions that interact directly with the remote workspace, machine, and file system."
 2. Licence: the VS Code Server "is not intended or licensed for use by other clients." The Remote Development extensions "are not currently open source." Use is allowed for private infrastructure: "You can use the extensions with your own internal or private services. You cannot build a public or commercial service on top of the VS Code Remote Development extensions or their related components (for example VS Code Server)." Same page. **[V]**. VERIFIED-RAW.
 3. DekaBank case study (for stage 3 and the agent pilot): [Coder](https://coder.com/success-stories/dekabank). **[V]**. VERIFIED-RAW. Starting point "Hardened corporate laptops too slow for software development due to antivirus scanners and enterprise proxies"; onboarding "took two to three weeks"; "100 users onboarded within the first month of go-live"; about 700 IT staff. Go-live "on 1 April", year not stated.
 4. Server download on a restricted host: "Installation of VS Code Server requires that your local machine have outbound HTTPS (port 443) connectivity to: update.code.visualstudio.com vscode.download.prss.microsoft.com"; "By default, the Remote - SSH will attempt to download on the remote host, and fail back to downloading VS Code Server locally and transferring it remotely once a connection is established." The setting `remote.SSH.localServerDownload` forces either behavior. Extensions need `marketplace.visualstudio.com` and `*.gallerycdn.vsassets.io`, or can be installed "manually without an internet connection using the Extensions: Install from VSIX... command". Source in 84. **[V]**. VERIFIED-RAW (the two hostnames are separate list items on the page).
 5. Cursor ships its own ssh extension. Cursor forum, 2024-08 to 2025-02. [Cursor forum](https://forum.cursor.com/t/does-cursor-support-remote-ssh/7620). Vendor forum: 2 users and 1 staff member. VERIFIED-RAW (Discourse JSON). User, 2024-08-16: "Note its their own implementation and does not rely on the VSCode Remote SSH extension." Staff, 2025-02-16: "Try removing and reinstalling the Remote-SSH extension from the Cursor marketplace - this should get you our version instead of VS Code’s." The error a user hit with Microsoft's extension is garbled in the post; paraphrase it as "Remote-SSH is only supported in Microsoft versions of VS Code".
 6. Windsurf's documentation says the same of its editor. [Windsurf docs](https://docs.windsurf.com/windsurf/advanced), read 2026-11-27. **[V]**. VERIFIED-RAW. "The usual SSH support in VSCode is licensed by Microsoft, so we have implemented our own just for Devin Desktop." Listed caveats: "We currently only support SSHing into Linux-based remote hosts." and "We don’t have all the features of the Microsoft SSH extension right now." Caveat: the page now calls the product "Devin Desktop"; the extension identifier in the notes was not found and should not be printed.
 7. JetBrains Gateway runs the IDE backend on the server: "The remote host is a physical or virtual machine hosting the source code and running a backend IDE." [JetBrains overview](https://www.jetbrains.com/help/idea/remote-development-overview.html). **[V]**. VERIFIED-RAW.
 8. JetBrains Gateway's requirements on the server: "JetBrains Gateway requires AllowTcpForwarding to forward the IDE connection through SSH."; free space "must be at least 4xIDE.tar.gz in size"; a starved backend shows as "Failed to get IDE status in 60 seconds. Probably IDE backend is stuck", fixed by raising `-Xmx`. [JetBrains troubleshooting](https://www.jetbrains.com/help/idea/remote-development-troubleshooting.html). **[V]**. VERIFIED-RAW.
 9. ssh through an identity-aware proxy, as one vendor documents it: VMs need no external address; "You can directly use the ssh command with a ProxyCommand option that uses gcloud to start the tunnel."; ingress only from 35.235.240.0/20; "IAP automatically disconnects sessions after one hour of inactivity." [Google Cloud IAP](https://docs.cloud.google.com/iap/docs/using-tcp-forwarding). **[V]**. VERIFIED-RAW.
10. Root for the engineer on the dev machine: Instacart ("The devs have full sudo access. They can install and configure whatever they want.", [HN 37943645](https://news.ycombinator.com/item?id=37943645)); Discord ("full access to the host"); Woovi's ssh config logs in as root. VERIFIED-RAW.
11. Settings that follow the engineer: Slack's `~/.remote-dev-home`; Discord "chose to mount and preserve the /home directory across restarts"; GitHub: "Visual Studio Code extensions, settings sync, and dotfiles repos"; Instacart: "Your settings travel with you." Entries 74, 15, 46, 59. VERIFIED-RAW.
12. Security posture others describe for the server, usable in stage 3: Uber says devpods let it run "everyone on the latest stable version", patch "during non-work hours" and scan disks off-hours; a Stripe engineer says "I can safely say the oldest version of software that's in my cloud; the laptops skew across literally years of versions". Source in 3; [HN 41291251](https://news.ycombinator.com/item?id=41291251). VERIFIED-RAW.
13. Pipedrive source details: [Pipedrive Engineering, 2022-04-26, Wayback capture](https://web.archive.org/web/20230108175036/https://medium.com/pipedrive-engineering/say-hello-to-devboxes-fab125cd793a). "In September 2021, we started implementing the interface of the remote development environment in Kubernetes"; "In November 2021, we released devboxes for alpha testers. Today, the platform is available to all Pipedrive engineers."; "a devbox is just a namespace in a remote Kubernetes cluster"; file updates are synced from the laptop by the Devbox CLI. Official. VERIFIED-RAW (Wayback).

### Not established (S10)

- How long one engineer takes to reach a usable first version. All dated accounts are teams.
- That Slack and Plaid reached their figures "without a mandate" as a stated policy. Slack says engineers switched "of their own accord"; Plaid's post does not address mandates.
- That Uber left local development available by policy; it is inferred from a future-work item.
- Any before-and-after measure other than setup time.
- A first-party security team's written conditions for approving Linux dev servers. DekaBank's is a vendor case study; no source mentions session recording.
- That any transition account discusses the VS Code server download on a restricted host. That point comes from Microsoft's documentation alone.
- That Microsoft's C/C++ extension stopped working in forks in April 2025 (SNIPPET; the page I opened did not show it). That Cursor's or Windsurf's ssh extensions are unreliable in general: the evidence is forum thread titles and the vendors' own caveats.
- JetBrains Gateway testimony from engineers: none read.
- That agents were the reason any company adopted dev servers for people. Stripe's order is servers first, agents later.
- Torc's idle shutdown and National Australia Bank or DZ BANK conditions: not re-opened here (remote desktops or other ledgers' scope).

---

## Corrections to the notes

1. **250 codespaces lost (failures note, section 2).** The cited status URL is an April 2024 incident about 7% of new codespaces; the September 2025 availability report has no Codespaces entry. Claim unverified; remove.
2. **Stripe tooling team.** The source has both figures: devprod "grew from less than one FTE into a team of perhaps a dozen engineers", and the organization "could afford 10 FTEs on tooling". Engineers served is stated (a few hundred to over a thousand), where the staffing table says "Not stated".
3. **Slack 90%.** The post says GA in October 2021 and over 90% "by the end of January 2022"; "four months" is the notes' gloss, and the podcast says "within three months". A 2024 article by the same engineer says 80-85% within a year, steady since.
4. **Slack team size.** The notes say not stated. The 2024 article says the team was formed in 2021 "with 2 engineers".
5. **Shopify NixCon abstract.** Wording confirmed, and it adds "Over the past year", which dates the move to roughly 2024-2025, and "Today, the majority of development is being done inside Nix-based environments." Talk date 2025-09-05; published 2025-09-20.
6. **Plaid.** Readable through the Wayback Machine. It is a laptop-sync hybrid (model H), not R. The state before remote was Docker Compose on Docker for Mac; Vagrant ended by early 2017. Rollout took "several quarters".
7. **Pipedrive.** Readable through the Wayback Machine (2022-04-26). It is file sync into a remote Kubernetes namespace. "4 engineers in under 3 months" and "go to sleep" after hours are not in this post.
8. **VS Code licence quotation.** "you may not build public products or services on top of the VS Code Server" is not on the page. The page says "You cannot build a public or commercial service on top of the VS Code Remote Development extensions or their related components (for example VS Code Server)." The connectivity sentence says "your local machine", not the remote host.
9. **Uber byline.** The page lists four authors: Matas Antanas Strukčinskas, Serdar Badem, Aistis Jokubauskas and Ali-Reza Adl-Tabatabai. Both lists in the notes were partial.
10. **Fullscript.** The cost reason reads "It was also expensive, and AWS account limits are real"; it replaced both a local Kubernetes setup and the cloud one.
11. **Gitpod cost model.** Recovered from the Wayback Machine (dated 2023-12-12): the $360,000 assumes an 8-core, 16 GB VM at about $300 a month.
12. **2022 survey.** The recruiting vendor is named: Codeanywhere.
13. **CodeCanvas.** JetBrains' own post is readable (the notes had a press snippet and a 403). **Code With Me** was not retired in March 2026: the post says 2026.1 is the last supporting release and final shutdown is Q1 2027.
14. **Windsurf.** The extension identifier `codeium.windsurf-remote-openssh` was not found; the documentation states the licence reason directly and now names the product "Devin Desktop".
15. **Discord.** "Diagnostics were built only after the migration" was not found in the page text; the supported statement is about documentation, training and default dotfiles. Publication date 2024-02-22 confirmed on the page (the page's metadata carries a 2025 date).
16. **Meta.** "Our team is small" and the dark-storm wording are confirmed in raw text. On DNS the talk says "we have tooling in place to survive internal DNS failures" with a tool for "bypassing DNS lookups"; the phrase "single point of failure" in `google_and_meta.md` is the note's gloss.
17. **Read tags upgraded.** Every source the notes tag "fetched via extraction" and that appears in this ledger was re-read as raw text, so the quotations given here are safe to print; quotations in the notes that do not appear here remain unchecked.
