# Transitions to ssh-able Linux dev servers, staffing, and build versus buy

Research pass run 2026-11-26. About 62 searches, fetches and Hacker News API queries. Extends `other_tech_companies.md` and `failures_cost_tradeoffs.md`; facts already in those files are referenced, not repeated.

## Scope changes received during the pass

- Staffing is the cost that matters most; the target organization has ONE engineer for this. Staffing has its own section (Part 0) and comes first.
- The target organization uses Linux. Windows VDI, Windows 365, Microsoft Dev Box and Citrix migrations are dropped; what had been collected is reduced to a footnote at the end of Part 2.

## Read tags

- **[raw text]**: I read the text itself (Hacker News comments pulled through the Algolia API).
- **[fetched via extraction]**: I fetched the page; the fetch tool returns a small model's extraction, so quoted strings are as the extraction relayed them. Re-check any quote against the live page before printing it.
- **[snippet only]**: seen only in a search-result summary. A lead, not a fact.

**Source types**: official (company engineering post or talk), named individual, anonymous commenter (HN handle, employer self-declared), vendor (has a product to sell), trade press.

---

## Part 0. Staffing: how many people build and run dev machines, and what one engineer can run

### Takeaway

Every public headcount for a self-built platform is four or more engineers (Instacart about 4, Cruise 8, Stripe about 10), serving 600 to 1,000+ engineers. I found no account of a single engineer building a pooled, pre-warmed platform. The single-person accounts that exist are all of one shape: a managed product (Codespaces) or one shared server with manual provisioning, with the person maintaining an image or config file and nothing else.

### Cited Findings

#### Table: every public team-size figure found (this pass plus the existing notes)

| Company (date of fact) | Team size | Engineers served | Ratio | What the team owned | Build or buy | Source type and read tag |
| --- | --- | --- | --- | --- | --- | --- |
| Instacart (built about 2021, stated 2023-10) | "4-ish people", "under a year", "not all of us were full time on it at all times"; afterwards "part time feature and maintenance work" | about 600 (the figure the author uses in his own payback arithmetic; also "hundreds of other developers") | about 1:150 during build; lower after | Bento Remote: EC2 machine per engineer, pre-built images, preserved disks, warm pools, live patching, nightly push to existing machines, hibernation | Built on plain EC2 | Named HN handle, self-declared Instacart, "a system my team built" [raw text] — [HN 37938537](https://news.ycombinator.com/item?id=37938537), [HN 37961161](https://news.ycombinator.com/item?id=37961161), [HN 37965171](https://news.ycombinator.com/item?id=37965171) |
| Cruise (2022-12) | 8 | about 1,000 | 1:125 | Cruise Shells (ephemeral daily GCP VMs) | Built | Trade press, already in `av_and_robotics.md` — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise) |
| Stripe (describing 2012-2019; post 2024-05) | about 10 full-time (the other note says "roughly a dozen") | Not stated for 2019; "on the order of thousands" by 2022 | Not computable | All developer tooling, of which devboxes, sync, and editor support were part | Built on EC2 | Named individual, already in notes — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/) |
| Dropbox (undated; vendor) | 6-person Developer Environments team; 2 of them did the migration in 4 months | about 1,000 | 1:167 | Templates and environment types on top of Coder; replaced an in-house Python provisioning tool | Bought (Coder) after building | Vendor case study quoting a named Dropbox engineer [fetched via extraction] — [Coder](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder) |
| Unnamed B2B SaaS on AWS (2025-12) | Head of Platform + 3 platform engineers | 72 | 1:18 | The whole platform, including per-developer environments of 20-30 microservices on EKS | Built on EKS | Vendor-run interview (Qovery CEO), company unnamed [fetched via extraction] — [Substack](https://romaricphilogene.substack.com/p/argocd-eks-20-services-and-a-dev) |
| Pipedrive (2020-2021) | 4 engineers built the predecessor (local Kubernetes workstation) "in a little less than 3 months"; devbox team size not stated | 300+ (later post) | — | Remote devboxes as pre-provisioned Kubernetes namespaces; start Sept 2021, alpha Nov 2021 | Built on Kubernetes | Official, but [snippet only]; Medium returned 403 — [Pipedrive Engineering](https://medium.com/pipedrive-engineering/say-hello-to-devboxes-fab125cd793a) |
| Slack (2021) | Not stated: "a new team was formed inside the Developer Productivity org" (post); "dedicated folks" in a "Developer Workspaces team" (podcast) | "easily over 400 engineers" on the webapp | — | Pool (Auto Scaling Group), CLI, home-directory sync, lifecycle automation | Built on EC2 | Official [fetched via extraction] — [Slack Engineering](https://slack.engineering/remote-development-at-slack/), [DX podcast](https://getdx.com/podcast/remote-development-at-slack/) |
| Shopify, one application team (2022) | 3 engineers assigned to make one app work on Spin | 150+ engineers on that app | 1:50 for porting alone | Application-side porting, not the platform | — | Official, already in notes — [Shopify Engineering](https://shopify.engineering/sfn-team-cloud-development-spin) |
| DekaBank (go-live 1 April, year not stated; vendor) | Two named architects plus a "FITS team"; no headcount | 100 users in first month; about 700 IT staff | — | Coder on on-premises Kubernetes, base image, GitLab/Argo CD integration | Bought (Coder) | Vendor [fetched via extraction] — [Coder](https://coder.com/success-stories/dekabank) |
| Meta (2023-12) | "Our team is small" (no number) | Not stated | — | Developer environment reliability | Built | Official talk, already in `google_and_meta.md` — [InfoQ](https://www.infoq.com/presentations/meta-production-environment) |
| Plaid (2022-06) | Not stated ("Developer Efficiency Team") | 360+ | — | Devenv CLI and remote devenv | Built on EC2 | Official, read only as third-party summary; original returns 403 — [Plushcap summary](https://www.plushcap.com/content/plaid/blog/scaling-with-devenv) |
| Discord (2024-02) | Not stated ("Internal Developer Experience team") | Not stated | — | Image, dotfiles defaults, diagnostics, docs, training; Coder supplies orchestration and networking | Bought (Coder) | Official [fetched via extraction] — [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments) |

Independent-voice count for "a self-built platform took four or more engineers": 3 (Instacart, Cruise, Stripe), each a single source.

**No team-size figure found for:** Uber Devpod, LinkedIn RDev, GitHub, Shopify Spin (platform team), Airbnb AirDev, Datadog Workspaces, Figma, Notion, Ramp, Brex, Monzo, Canva. Team names exist in job postings for Figma ("Environments & Tools team" building "a remote development environment"), Canva ("Developer Environment" team; postings mention "DevPod and Devbox capabilities") and Airbnb, all [snippet only] — [Figma posting](https://boards.greenhouse.io/figma/jobs/5164947004), [Canva posting](https://jobs.blackbird.vc/companies/canva/jobs/51289121-engineering-manager-developer-environment-au-remote).

#### Accounts of one person (or an unstated very small effort) running remote dev

- Startup on Codespaces, set up by one ex-Googler (2023-10-18): "setup Google Codespaces at the startup I'm working at now" (he corrects this to GitHub Codespaces in a reply). What he reports getting without building: prebuilds ("we already have all of our python, node, go, etc. dependencies preinstalled"), onboarding "in a 15 minute meeting", "far fewer questions about how to do XYZ". What went wrong: "Some of our devs were really passionate that they preferred other IDEs than VsCode"; "Codespaces have downtime occasionally"; "Some folks don't like the 40 seconds to reactivate a codespace after being inactive for more than 30 minutes, so they either write scripts to keep their codespaces alive or just don't use codespaces at all." Adoption was not mandated: "most of our newer employees exclusively use codespaces" and "A few of our older employees who developed locally for years have chosen to continue developing locally". Support load: "most of the questions come from folks who use the local still". Cost: "We do pay a pretty penny for this, but it's a small fraction of our overall cloud spend". Anonymous commenter, company unnamed [raw text] — [HN 37935523](https://news.ycombinator.com/item?id=37935523)
- Agency of about 10 developers on Codespaces (2023-10-18): one person maintains the config: "It still requires maintenance sometimes but at least when I fix the codespace config I know everyone will definitely benefit from the changes." Deliberately not built: they kept docker compose inside the codespace ("less locked in to the platform"; "made the initial migration easier"). Security side effect: "without pulling any client code or secrets or data onto their machine". Cost: "pretty expensive (if you have, say, 10 devs using it all day every day) compared to 'free'", but it let them "move everyone to fairly cheap macbook airs". Anonymous commenter [raw text] — [HN 37935463](https://news.ycombinator.com/item?id=37935463)
- Woovi, Brazilian payments startup (2025-01-20): one bare-metal server with "96 CPUs and 512GB of RAM" that "easily supports 10 developers"; each developer gets an LXC container reached over SSH "using a terminal or any IDE like VSCode or Webstorm". They tried Coder on Docker and on Kubernetes first and dropped both for isolation and performance reasons. Not built at the time of writing: SSH keys were added by hand, and automated key addition, automatic provisioning for new team members and preloaded templates are listed as planned. Who maintains it is not stated. Official, small company [fetched via extraction] — [DEV/Woovi](https://dev.to/woovi/remote-development-at-woovi-25mj)
- A manager who mandated one remote server (2025-01-19): "Eventually I forced everyone to work with a controlled dev environment on a remote server. They can work over ssh with command line tools or VSCode." "I got some grumbling about latency (everyone works remotely from around the world), but that turns out to present much less friction than the almost-daily debugging sessions". Team size not stated. Anonymous commenter [raw text] — [HN 42756034](https://news.ycombinator.com/item?id=42756034)
- Instacart's advice to others after building its own: "Start with the SaaS versions and see." Its reasons for building were specific: Codespaces at the time "couldn't meet our needs for things like pre-built images, preserved disks, warm pools, live patching, and being behind our firewall", and apps "needed 64GB", which "made other 3rd party tools fantastically expensive". [raw text] — [HN 37938537](https://news.ycombinator.com/item?id=37938537)

Independent-voice count for "one person can run a managed or single-server setup for a small team": 4 (two Codespaces users, Woovi, the mandating manager). None gives hours per week.

**What the headcount at the model companies actually paid for** (so a reader can see what a one-person version leaves out)

| Component | Who built it | Source |
| --- | --- | --- |
| Warm pool of ready machines, replenished on each claim | Slack (Auto Scaling Group; saves "about 12 minutes of bootstrap"), Stripe (10-second target), LinkedIn (pool sized by prediction), Instacart ("warm pools") | [Slack](https://slack.engineering/remote-development-at-slack/); Stripe and LinkedIn in `other_tech_companies.md`; [HN 37938537](https://news.ycombinator.com/item?id=37938537) |
| Image pipeline tested on every merge | Instacart: "continuously tested on every merge and verified to function" | [HN 37938537](https://news.ycombinator.com/item?id=37938537) |
| Live patching of existing machines | Instacart: "We push nightly to everyone's existing machines"; "fairly straight forward Ansible and shell scripts" | [HN 37943645](https://news.ycombinator.com/item?id=37943645) |
| Hibernate-and-wake tied to laptop activity | Instacart: "stays up running during the users work hours (~8 hours) and then hibernates"; "We detect activity on their laptop and then wake it when needed" | [HN 37943512](https://news.ycombinator.com/item?id=37943512) |
| Custom laptop-to-server sync with barriers | Stripe (2012-2022), Slack (2020), Plaid (rsync and Watchman) | existing notes; [Plushcap summary](https://www.plushcap.com/content/plaid/blog/scaling-with-devenv) |
| Monorepo warm-up (clone, Bazel cache, type-check cache) | Stripe, Uber | existing notes |
| Multi-region placement for latency | Uber (5 regions), Coder customer firm (added a European region) | existing notes; [Coder](https://coder.com/success-stories/global-investment-firm) |
| Kubernetes operator, CRDs, pod pools | Uber, LinkedIn | existing notes |
| Diagnostics, default dotfiles, training videos, docs | Discord built these even after buying the orchestrator | [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments) |
| Porting each application to run remotely | Shopify: 3 engineers for one app | existing notes |

### Inferences

- A one-engineer version can cover: one base image, a script or Terraform module that creates a VM per engineer, ssh access, a dotfiles hook, a nightly config push, and scheduled stop. Instacart describes its own steady state as "fairly straight forward Ansible and shell scripts" pushed nightly, and its warm pool and hibernation as the "clever things". The one-engineer version leaves out warm pools, per-branch machines, 10-second start, multi-region, and custom sync. Each of those is what the 4-to-10-person teams were paid to build. This split is my reading of the table, not a statement by any source.
- The cheapest design for one engineer is persistent machines (one per engineer, stopped at night), because disposable machines need the pool and prebuild pipeline to be tolerable. Uber, Discord, Woovi and Instacart ("preserved disks") all persist; the per-branch designs (Slack, GitHub, Stripe) are the ones with pools.
- Buying moves the orchestrator off the one engineer's plate but not the image, the docs or the support. Discord and Dropbox both kept a team after buying Coder.
- The unnamed 72-engineer company shows the failure mode for a small team: four platform people, per-developer environments of 20-30 services on Kubernetes, low creation success rate, and the team "keeping it alive". The problem there is running the whole service graph per developer, not the dev machine.

### Gaps

- No source states support tickets per engineer, on-call load, or hours per week for a dev-machine platform at any size.
- No first-person account of a single engineer running plain cloud VMs (EC2 or GCE) for a team of 30-300 with numbers. The closest are Woovi (10 developers, one server) and the two Codespaces accounts.
- No public headcount for Uber, LinkedIn, GitHub, Airbnb, Datadog, Figma, Notion, Ramp, Brex or Monzo. Conference-talk intros and LinkedIn team pages were not searched individually.
- Vendor claims about operational effort (Coder, Ona, Google) were not found as numbers; Dropbox's "two people, four months" is the only one, and it counts migration, not operation.

---

## Part 1. Transition accounts

### Takeaway

The accounts with dates agree on a short path: a small dedicated team, a first usable version in two to eight months, volunteers first, voluntary adoption driven by word of mouth to 60-90%, and local development left available for the remainder. Only Discord set a hard cutoff, and only for backend work. Lyft is a documented move in the opposite direction, from remote boxes back to laptops.

### Cited Findings

**Slack (webapp), 2021-2022** — official [fetched via extraction]: [Slack Engineering, 2022-06-28](https://slack.engineering/remote-development-at-slack/) and [DX podcast with Sylvestor George](https://getdx.com/podcast/remote-development-at-slack/)

- Starting point: laptop checkout rsynced to an EC2 dev environment (see existing notes).
- Team and time: team formed at the start of 2021; minimal workflow to beta users August 2021; general availability October 2021.
- Pilot: volunteers; the podcast reports an "overwhelming response" from people who "came out to volunteer".
- Mandate: none described. The post says "the majority of the team had switched of their own accord". "Convincing engineers to change a workflow they've used for years is a hard sell".
- Curve: 30% during beta; over 90% by end of January 2022. The podcast transcript says "by January 2021", which conflicts with the October 2021 launch; treat as January 2022.
- Holdouts: Emacs users needed support added. Trust is fragile: "if it breaks a couple of times or people don't like it a couple of times, they're hesitant of giving it another shot."
- Measured: onboarding setup from "1.5 hours" to "five minutes" (podcast; the post says about an hour to minutes).
- Scope: remote development "was only for web app"; other repositories stayed as they were.

**Instacart (Bento Remote), about 2021** — named HN handle, self-declared [raw text]: [HN 37938537](https://news.ycombinator.com/item?id=37938537), [HN 37943512](https://news.ycombinator.com/item?id=37943512)

- Starting point: "Bento was actually our first attempt at doing all of this on our local MacBooks. Many users found that their machine would slow to a crawl and heat up."
- Design: "a fresh new fully dedicated EC2 machine in about two minutes from when you run `bento remote create`"; "Just connect VSCode to it and start coding"; "Break something on your Bento Remote? Throw it away and get a new machine"; "Your settings travel with you."
- Root: "The devs have full sudo access. They can install and configure whatever they want." — [HN 37943645](https://news.ycombinator.com/item?id=37943645)
- Containers: "We actually moved away from containers for dev purposes for almost all of our apps... Mainly because they are a bad developer experience."
- Cost control: "We don't use spot because they can be yanked away easily. Savings plans and hibernation are the biggest cost savers." — [HN 37943559](https://news.ycombinator.com/item?id=37943559)
- Result claimed: "likely one of the largest boosts to developer productivity in our history". Payback claimed in "less than four months" on the author's own assumption of one hour saved per engineer per week.
- Adoption share and mandate: not stated.

**Discord, late 2020 to 2024** — official [fetched via extraction]: [Discord, 2024-02-22](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)

- Pilot selection: "champions" from several departments who were enthusiastic about tooling, chosen to cover different daily workflows.
- Opt-in then mandate: aimed for an experience good enough to switch voluntarily, nudged people when their laptops had problems, then set a hard cutoff and deprecated macOS backend development. Apple Silicon problems made them "fast-track" the cutoff.
- Two migrations: Coder v1 on Kubernetes containers (noisy neighbours, lag, no privileged containers), then Coder v2 on VMs in 2023.
- Support: after v2, "we no longer see support tickets and questions about high latency and connection drops."
- Unplanned cost: engineers unfamiliar with the command line needed more onboarding than planned; diagnostics were built only after the migration.
- The post says the effort began "before the pandemic" and also that the Coder engagement began in late 2020; the two do not agree.

**Plaid, about 2020-2022** — official, read only through search summary and a third-party summary; the original returns 403: [Plaid](https://plaid.com/blog/scaling-with-devenv), [Plushcap summary](https://www.plushcap.com/content/plaid/blog/scaling-with-devenv)

- Starting point: engineers ran a Linux VM with Vagrant on work Macs [snippet only].
- First remote version: the existing CLI pointed at a remote Docker daemon on EC2 over HTTPS; the laptop CLI stayed as the client [snippet only]. Later volume mounts, rsync and Watchman.
- Curve: about 1.5 years after rollout, 87% of users exclusively on the remote devenv and 97% of all commands run there (post dated 2022-06-16). 360+ engineers.
- Mandate, team size, holdouts: not available in what I could read.

**Lyft: remote back to laptop, by 2022** — trade press summary of an official series [fetched via extraction]: [InfoQ, 2022-03-28](https://www.infoq.com/news/2022/03/lyft-cloud-local-dev)

- Onebox was "essentially a Devbox environment running on an EC2 instance", preferred at first for capacity.
- Why it was dropped: each environment ran a large slice of the service graph and could require "too many resources to be practical"; setup was slow and unstable, so engineers "would often rely on the outer dev loop's CI tests"; observability "could not keep up with all running environments".
- Replacement: service code run natively on macOS without containers or VMs, one service at a time, with Tilt, and shared staging for the rest.

#### Airbnb (AirDev), 2022 onward

- "A Kubernetes-driven platform for creating on-demand development environments", requested through a CLI; speakers Janusz Kudelka and Cory Mead, DPE Summit 2022. Official talk abstract [fetched via extraction] — [DPE](https://dpe.org/sessions/airbnb-developer-productivity-wins/)
- An Airbnb employee (2023-10-19): "We now have an in-house cloud dev environment at Airbnb... a huge improvement over what we had in the past. Spinup time is fast, it's easy to use VSCode remotely... Neovim + LSP's also works perfectly if you prefer that over VSCode (via ssh)". Also: "You can always develop locally if you're on the plane". Anonymous commenter, 1 voice [raw text] — [HN 37937401](https://news.ycombinator.com/item?id=37937401), [HN 37937414](https://news.ycombinator.com/item?id=37937414)
- A job posting describes the goal of "transitioning all development activities from local laptops to developer workspaces in the cloud", and another mentions environments "for engineers and AI agents" [snippet only] — [posting](https://jobs.generalcatalyst.com/companies/airbnb/jobs/36409594-senior-software-engineer-developer-infrastructure)

**Coder customer: Fortune 500 investment firm (webinar July 2024)** — vendor [fetched via extraction]: [Coder](https://coder.com/success-stories/global-investment-firm)

- Starting point: "local development environments on high-powered MacBooks".
- Pilot: one team with a complex build; then European developers (a European cloud region was added); a western US rollout planned. 300 developers on the platform.
- Onboarding before: "Some teams took up to two weeks to get new developers fully set up."
- Editor: "through their preferred IDEs, such as VS Code". Home: SRE team.

#### Other accounts, thinner

- Pipedrive: local Docker, then local Kubernetes workstation (4 engineers, under 3 months), then remote devboxes (start September 2021, alpha November 2021, later open to all). Devboxes "go to sleep" after hours. Official [snippet only] — [Pipedrive](https://medium.com/pipedrive-engineering/say-hello-to-devboxes-fab125cd793a)
- Stytch (2022-11-16): moved "ALL development into the cloud" with code synced from the laptop; reasons were an hour-long, fifteen-step setup and a bug shipped because Redis was disabled on one laptop. No rollout detail. Official [fetched via extraction] — [Stytch](https://stytch.com/blog/remote-dev-1/)
- Databricks: an internal tool called devbox, "A one-way sync from laptop to an EC2 instance" for running Bazel remotely. [snippet only] — [repo mirror](https://gitee.com/mirrors_databricks/devbox)
- Skydio: homegrown virtual desktop system replaced by Coder "in just a few months"; onboarding from up to a week to under an hour; vendor claims a 90% cut in cloud cost from stopping always-on GPU VMs. Vendor [fetched via extraction] — [Coder, 2025-01-06](https://coder.com/blog/how-coder-enables-innovation-at-leading-tech-companies)
- An unnamed company (2023-10-19): "My company switched to 100% remote dev envs a couple years ago. When you cut a branch it spins up a VM and you can connect to it from VS Code (native or browser based) or just plain SSH... Given a choice I don't think any dev at my company would go back." Anonymous commenter [raw text] — [HN 37936660](https://news.ycombinator.com/item?id=37936660)
- The cost of being in the unserved 10% (2023-10-19): "it works well enough for maybe 90% of devs at my company... most of my team are in that 10% and now that 90% of the company have their needs met, we're getting pressure to conform". Anonymous commenter [raw text] — [HN 37937323](https://news.ycombinator.com/item?id=37937323)

#### Summary table of transition facts (this pass and existing notes)

| Company | Start | Trigger | Time to first usable | Pilot | Mandate | Adoption | Old way retired? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Slack | laptop + rsync to EC2 | 30-minute clone, HHVM load, broken local setups | about 8 months | volunteers | no | 30% in beta, over 90% in about 4 months after GA | no; webapp only |
| Instacart | local orchestration tool on MacBooks | 64 GB needed, laptops overheating | under a year | not stated | not stated | "use them heavily" | not stated |
| Discord | macOS backend dev | Apple Silicon, Homebrew, growth | not stated | champions across departments | yes, hard cutoff for backend | all backend | yes for backend; frontend stays local |
| Plaid | Vagrant on Mac | slow local services | not stated | not stated | not stated | 87% exclusive at about 1.5 years | no |
| Uber | laptop | monorepo size | not stated | not stated | no (inferred) | 60% by Nov 2022 | no |
| GitHub | macOS | 45-minute bootstrap | not stated | not stated | default | "default" for github.com | not stated |
| Stripe | laptop + sync to devbox | sync failures on branch switch | beta in 2022 | not stated | not stated | "most human-written code" by 2026 | 2 ex-employees say code left laptops |
| Shopify | local `dev` | "Laptops were melting" | 3 architectures in 2 years | early adopters | no | never published | reversed: back to local by 2025 |
| Lyft | remote Onebox on EC2 | environment too heavy to launch | — | — | — | — | reversed: remote retired for native laptop dev |
| Coder investment firm (vendor) | MacBooks | build complexity, onboarding of 2 weeks | not stated | one complex-build team | not stated | 300 developers | not stated |

### Inferences

- Voluntary adoption reached 87-90% at Slack and Plaid without a mandate, and the remainder was left alone. Discord is the only sourced mandate. An organization with one engineer cannot afford two supported paths for long; the evidence says the second path shrinks on its own if the remote one is better on day one, and Slack's lead says it does not recover easily if it breaks early.
- Lyft and the 72-engineer company failed on the same thing: reproducing the whole service graph per developer. Slack, Instacart and Stripe ran one application (or a monolith plus shared QA services) per machine. The transition is easier where one machine can run what the engineer works on.
- Time to first usable version is two to eight months for teams of about four. Nothing sourced says how long one engineer takes.

### Gaps

- Before-and-after measurements are almost all setup time. No one publishes time-to-first-commit, support-ticket counts or survey scores for a dev-machine transition (Uber's tooling NPS moving "from negative 50 to positive 8" is for all dev tooling, [snippet only] — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/developer-experience-at-uber)).
- Who paid (central budget or chargeback): not stated anywhere.
- No account found for Figma, Notion, Canva, Atlassian, Palantir (Coder lists a case study titled as cutting build times 78%; not read), Snowflake, Brex, Coinbase, Robinhood, Monzo, Wise, Nubank, Adyen, Datadog. Each got one or two queries and an HN query.
- Plaid's and Pipedrive's posts could not be fetched (403); details rest on summaries.

---

## Part 2. Moving developers from locked-down machines to Linux dev servers: what security asked for

### Takeaway

The published approvals (all vendor-hosted or trade press) share one pattern: the dev server goes in its own network segment with no public address, packages come only through an internal artifact proxy, access is through the corporate identity provider, and the laptop's endpoint controls stop mattering to the build because the build no longer runs there. No source lists session recording or keystroke logging on the dev server as a condition.

### Cited Findings

- DekaBank (ECB-supervised; vendor case study): starting point was "Hardened corporate laptops too slow for software development due to antivirus scanners and enterprise proxies", with builds under Windows Subsystem for Linux taking six to seven minutes and "several dozen distinct laptop and workstation configurations". Conditions met: self-hosted on the bank's own Kubernetes; workspaces in a dedicated network segment reached over HTTPS; packages only through JFrog Artifactory; "Information Security Management team could approve the deployment through standard processes without special audits." Onboarding before: "two to three weeks before they could write and deploy code." Developers use a web IDE or VS Code and IntelliJ running locally. 100 users in the first month. Vendor [fetched via extraction] — [Coder](https://coder.com/success-stories/dekabank)
- DZ BANK on Google Cloud Workstations, National Australia Bank's browser IDE on EC2 with no internet gateway, and the unnamed financial firms are already in `finance_and_security.md`; the conditions there are the same four (private cluster without public IPs, proxied OS packages, scanned artifact server, no local admin needed).
- Coder investment firm (vendor): the stated concern was "storing sensitive code and data on individual laptops"; controls named are a VPN in front, role-based access, identity-provider sync and audit logs. [fetched via extraction] — [Coder](https://coder.com/success-stories/global-investment-firm)
- A security-focused commercial option exists and has named users: "At Niantic we use Strong Network... We like the many security features they offer, like proxying outgoing connections, organization wide controls, importing automatically source code ACLs"; and "We at Broadcom use" the same product for "data loss prevention (IDE, web apps)". Two anonymous commenters, self-declared employers [raw text] — [HN 37941595](https://news.ycombinator.com/item?id=37941595), [HN 37958066](https://news.ycombinator.com/item?id=37958066)
- Small-team version of the same argument (Codespaces agency): engineers work "without pulling any client code or secrets or data onto their machine", and "access to a lot of stuff becomes directly mediated moment to moment by someone's github access (which for us also runs through our sso...)". Anonymous commenter [raw text] — [HN 37935463](https://news.ycombinator.com/item?id=37935463)
- The layered model that practitioners describe at banks (remote desktop first, then ssh to a dev box inside the network): "From there, the developer can SSH / whatever into their development environment - which is hosted 'inside' the corporate network". Anonymous commenter, 2023-02-28 [raw text] — [HN 34966192](https://news.ycombinator.com/item?id=34966192)
- Google's ssh-through-identity-proxy product states the mechanics a reviewer would ask about: "Your VM instance doesn't require an external IP address"; access is an IAM role per project or per VM, with conditions; ingress is allowed only from the proxy's range `35.235.240.0/20`; access requests appear in Cloud Audit Logs. Vendor documentation [fetched via extraction] — [Google Cloud IAP](https://docs.cloud.google.com/iap/docs/using-tcp-forwarding)

Footnote on dropped Windows material: collected before the scope change and not developed. Coder (vendor, 2025-02-03) claims Citrix and VMware price rises after their acquisitions pushed an unnamed Wall Street firm to replace virtual desktops with a Kubernetes-based platform — [Coder](https://coder.com/blog/a-year-of-reckoning-for-virtually-unaffordable-desktop-infrastructure). Microsoft Dev Box, ABN AMRO and Torc's streamed desktops are in the earlier notes.

### Inferences

- For a Linux organization the security case can be stated without reference to virtual desktops: the dev server is a place where the organization, not the endpoint agent, controls egress, package sources and identity. DekaBank's approval "without special audits" suggests that reusing an existing network zone and existing artifact proxy is what makes approval routine.
- "No production data on the dev server" appears as a design fact at Stripe (existing notes), not as an approval condition in any case study I read. Brokered data access is an essay argument that the transition sources do not supply.

### Gaps

- No first-party (non-vendor) account of a security team's written conditions for approving Linux dev servers.
- No source on what auditors asked for after the fact.
- Logging requirements on the dev server itself (shell history, session capture) are not described by anyone.

---

## Part 3. Build versus buy in 2025-2026, and the editor side

### Takeaway

The self-built platforms that publish are plain VMs plus a CLI, an image and a pool (Slack, Stripe, Instacart, Dropbox before Coder). The firms that bought are Discord, Dropbox, DekaBank and Skydio (Coder), small teams on Codespaces, and banks on Google Cloud Workstations. On the editor side, VS Code Remote-SSH is the default everywhere, but its server and extensions are closed and licensed only for Microsoft's client, so Cursor and Windsurf ship their own ssh implementations with their own bugs.

### Cited Findings

#### Who built on plain VMs

- Slack: EC2 instances in an Auto Scaling Group; a CLI (`slack remote-dev -b <branch>`) that reserves a machine, attaches the branch and opens local VS Code; `~/.remote-dev-home` sync; terminate on detach or merge. Official [fetched via extraction] — [Slack](https://slack.engineering/remote-development-at-slack/)
- Instacart: EC2 per engineer, Ansible and shell, nightly push, hibernation; built because the hosted option lacked pre-built images, preserved disks, warm pools, live patching and placement "behind our firewall". [raw text] — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- Stripe, Plaid, Dropbox (before Coder), Cruise (GCP): existing notes.
- Woovi: LXC containers on one owned server; "It is much cheaper to buy server hardware than Macbooks." [fetched via extraction] — [DEV/Woovi](https://dev.to/woovi/remote-development-at-woovi-25mj)

#### Who bought, and what the product supplied

- Coder at Discord supplied VM workspaces and networking that "leverages Tailscale & WireGuard"; Discord supplied the image, accounts, default dotfiles, diagnostics and training. Official [fetched via extraction] — [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments)
- Coder at Dropbox replaced the provisioning tool and its command-line interface; Dropbox writes Terraform templates. Vendor [fetched via extraction] — [Coder](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder)
- A user's description of the Coder-plus-ssh model (2022-10-06): "Using something like Coder to provision workspaces and VS Code, SSH, and Wireguard/Tailscale are an absolute dream." Anonymous commenter [raw text] — [HN 33115484](https://news.ycombinator.com/item?id=33115484)
- Coder in a research lab: "We have a self hosted Coder deployment and use docker to proviosn workspaces on our GPU servers... We persist home directory of a user across all their workspaces". Anonymous commenter [raw text] — [HN 37939196](https://news.ycombinator.com/item?id=37939196)
- Codespaces supplied prebuilds, idle stop (reported as 30 minutes with a 40-second resume), secrets and per-user access through GitHub. Two anonymous commenters [raw text] — [HN 37935523](https://news.ycombinator.com/item?id=37935523), [HN 37935463](https://news.ycombinator.com/item?id=37935463)
- DevPod (open-source client) in use on AWS, with a complaint: "DevPod brings its own SSH implementation that injects itself into your server and munges CRLF... Vim and Emacs aren't even considered." Anonymous commenter, 2023-10-18 [raw text] — [HN 37936115](https://news.ycombinator.com/item?id=37936115)
- Product status table (Codespaces, Ona, Coder, Dev Box, Cloud9, CodeCatalyst, CodeCanvas, Daytona) is in `failures_cost_tradeoffs.md` section 6 and is not repeated.

#### Minimal working version: which pieces have a sourced example

| Piece | Sourced example | Notes |
| --- | --- | --- |
| Plain VM per engineer from one image | Slack, Instacart, Stripe, Dropbox | all on EC2 |
| Small provisioning CLI or service | Slack (`slack remote-dev`), Instacart (`bento remote create`) | Dropbox's own tool became a maintenance burden and was replaced |
| Idle shutdown | Instacart (hibernate outside about 8 work hours), Pipedrive ("go to sleep"), Codespaces (timeout), Uber | Instacart avoids spot instances |
| Dotfiles or home hook | Slack (`~/.remote-dev-home`), LinkedIn (sidecar), Discord (persistent /home, default dotfiles), Instacart ("Your settings travel with you") | |
| Prebuilt snapshots or pools | Slack, GitHub, LinkedIn, Stripe, Instacart | the part that needs a pipeline |
| Root for the engineer | Instacart ("full sudo access"), Discord ("full access to the host") | |
| ssh certificate authority | Meta and Google only (existing `access_and_agents.md`) | no small-company account found |
| ssh through an identity-aware proxy | Google internally (existing notes); Google Cloud IAP as a product | see below |

**VS Code Remote-SSH: architecture and licence** — Microsoft documentation [fetched via extraction]: [VS Code Remote FAQ](https://code.visualstudio.com/docs/remote/faq)

- "The VS Code Server is quickly installed by VS Code when you connect to a remote endpoint." It "can host extensions that interact directly with the remote workspace, machine, and file system." For workspace extensions, "Its Node.js code and child processes still run remotely." The local window keeps the user interface.
- Licence: the VS Code Server "is not intended or licensed for use by other clients." The Remote Development extensions "are not currently open source." "you may not build public products or services on top of the VS Code Server." But you "can use the extensions with your own internal or private services."
- Network: the server download needs outbound HTTPS to `update.code.visualstudio.com` and `vscode.download.prss.microsoft.com`; Remote-SSH tries the download on the remote host first and falls back to downloading locally and copying it over. Marketplace installs need `marketplace.visualstudio.com` and `*.gallerycdn.vsassets.io`; installing from a VSIX file avoids that. This matters for a dev server with restricted egress.

#### Forks

- Cursor: a user in 2025-02 saw the error "Remote-SSH is only supported inMicrosoft versions of Vs Code"; Cursor staff replied that reinstalling from Cursor's marketplace "should get you our version instead of VS Code's." A user in 2024-08: it is "their own implementation and does not rely on the VSCode Remote SSH extension." Related thread titles on the same forum: "Latest Cursor cannot connect to remote Ubuntu server. (VS Code works fine)" (2025-08), "Remote-SSH broken" (2025-01), "Remote SSH Broken" (2025-06). Vendor forum [fetched via extraction] — [Cursor forum](https://forum.cursor.com/t/does-cursor-support-remote-ssh/7620)
- Windsurf ships its own extension, `codeium.windsurf-remote-openssh`; community "open-remote-ssh" extensions exist for other forks; Microsoft's C/C++ extension stopped working in forks in April 2025 under a clause limiting it to Microsoft products. All [snippet only] — [coder/vscode-coder](https://github.com/coder/vscode-coder), [open-remote-ssh](https://github.com/mlhiter/open-remote-ssh)

**JetBrains Gateway** — vendor documentation [snippet only]: [JetBrains troubleshooting](https://www.jetbrains.com/help/idea/remote-development-troubleshooting.html)

- The IDE backend runs on the server and needs its heap raised for average or large projects; a starved backend shows as "Failed to get IDE status in 60 seconds".
- sshd must allow TCP forwarding (`AllowTcpForwarding`); free disk must be at least four times the IDE archive.
- Earlier notes: Stripe called IntelliJ remote support "still very early" in 2022; JetBrains retired CodeCanvas (instances stop 2026-03-31) and Code With Me (March 2026).
- A Codespaces user: other IDEs "aren't as supported as VsCode yet" — [HN 37935523](https://news.ycombinator.com/item?id=37935523)

**ssh through an identity-aware proxy** — vendor documentation [fetched via extraction]: [Google Cloud IAP](https://docs.cloud.google.com/iap/docs/using-tcp-forwarding)

- "You can directly use the ssh command with a `ProxyCommand` option that uses `gcloud` to start the tunnel."
- Limits: "IAP's TCP forwarding feature isn't intended for bulk transfer of data"; "IAP automatically disconnects sessions after one hour of inactivity."
- Google's internal equivalent (a ProxyCommand helper wrapping ssh in WebSockets through the BeyondCorp proxy) is in `cloudtop_and_ondemand.md`.

#### Known pain, with voices

- Idle reconnect: 40 seconds after a 30-minute timeout drove some users to keep-alive scripts or back to local (1 voice) — [HN 37935523](https://news.ycombinator.com/item?id=37935523)
- Bad network: "Constant disconnection meant I eventually gave up on codespaces" at a venue with poor wifi (1 voice) — [HN 37940141](https://news.ycombinator.com/item?id=37940141). Counter-voice: "If your internet is capable enough for a video call it can run a hundred remote IDEs side by side" — [HN 37937303](https://news.ycombinator.com/item?id=37937303)
- Distance: a Gitpod user stopped at a company with staff in Australia and New Zealand "where latency becomes a issue" (1 voice) — [HN 37942185](https://news.ycombinator.com/item?id=37942185); the mandating manager reports "some grumbling about latency".
- Half-remote sync: "every time I end up just abandoning 'cloud dev' and doing things on my laptop" where the design was a VM plus file watcher (1 voice), matching the ex-Stripe account "sometimes the file watcher would miss an update" — [HN 37935865](https://news.ycombinator.com/item?id=37935865), [HN 41291111](https://news.ycombinator.com/item?id=41291111). Independent voices against laptop-to-server sync: 3 with Stripe's 2022 talk.

### Inferences

- With an agent-heavy future in mind, the licence point matters: Microsoft's Remote-SSH works only from Microsoft's VS Code. An organization that standardizes on Cursor or Windsurf depends on those vendors' own ssh extensions, which have a visible bug record. Plain sshd on a plain VM keeps every client usable, including terminal editors and agents in tmux.
- A dev server with no direct internet needs a plan for the VS Code server download and for extensions (local download fallback, VSIX files, or a proxy allowlist of the hosts above). No transition account mentions this; it follows from Microsoft's documentation.
- Dropbox built a provisioning tool, found it costly to extend, and bought. Instacart looked at buying, found it lacking for 64 GB machines behind a firewall, and built. Both say to start from the product and build only for a named gap.

### Gaps

- Pricing and operating effort for Coder, Ona, Google Cloud Workstations and Codespaces at 50-300 engineers: not gathered.
- No small-company account of running an ssh certificate authority for dev machines.
- Port forwarding and extension-host problems: no first-person company account found beyond the vendor documentation; GitHub issues for `vscode-remote-release` were not searched.
- JetBrains Gateway: no engineer testimony read in this pass.

---

## Part 4. Agents as a transition driver, 2025-2026

### Takeaway

The existing notes already hold the strong cases (Stripe, Shopify, Ramp, Spotify, Uber). This pass adds weaker ones pointing the same way and no new counter-case. Where a company already had dev servers, agents moved in; where it did not, the published statements are of intent or come from vendors.

### Cited Findings

- Photoroom (2026-04-22), Head of Backend Marek Zaremba-Pike: local agents share the machine with shell history, ssh config, cloud credentials and browser sessions; "The trust boundary is still your laptop." Running many in parallel: "It is horrendous context switching." Direction stated, not shipped: "remote containers with full permissions inside their environment, but very limited access beyond it." Hundreds of agent-authored PRs had merged through the local workflow. Official, small company [fetched via extraction] — [Photoroom](https://www.photoroom.com/inside-photoroom/the-laptop-is-the-wrong-place-to-run-coding-agents)
- DekaBank plans a twelve-week pilot of a coding agent inside its Coder workspaces, behind a planned AI gateway. Vendor [fetched via extraction] — [Coder](https://coder.com/success-stories/dekabank)
- Coder (2026-02-06), reporting a webinar with unnamed Claude Code team members: "Each agent needs isolation that your laptop wasn't meant to provide"; "The environment does the security work instead of relying on the agent to police itself." No names, numbers or outcomes. Vendor, second-hand [fetched via extraction] — [Coder](https://coder.com/blog/building-for-2026-why-anthropic-engineers-are-running-claude-code-remotely-with-c)
- Brex describes an agent workflow that starts by spinning up a remote developer environment for each migration. Official [snippet only] — [Brex](https://brex.com/journal/building-autonomous-agents-for-technical-tasks)
- Airbnb job posting: cloud development environments "for engineers and AI agents". [snippet only]; the existing `testimony_agents.md` has named speakers placing agents on Airdev workspaces.
- Individuals running agents over ssh on a remote box (2026): "I run multiple Claude Code and OpenCode sessions at the same time — sometimes on my laptop, sometimes on remote devboxes over SSH" — [HN 46974971](https://news.ycombinator.com/item?id=46974971); "Linux dev box is my local big box... Everything runs in a tailscale network, ssh connects all the things" — [HN 49742023](https://news.ycombinator.com/item?id=49742023); a dev box with 96 GB RAM for under $150 a month used as "an always-on server" for agents — [HN 49165702](https://news.ycombinator.com/item?id=49165702). Three anonymous commenters, personal setups [raw text].
- Kept on laptops (existing notes, not re-read): Block (goose on employee machines), Cloudflare (engineer's machine, cloud agents planned), Dashlane, and Jane Street (developers' own development machines under a separate user with an allow-list sandbox).

### Inferences

- The stated reasons are consistent across sources of very different quality: credential exposure on the laptop, interference between parallel agents, and laptop capacity (Shopify's "three or four workflows"). Count of organizations giving at least one of these as a reason to run agents off the laptop: Stripe, Shopify, Ramp, Photoroom (intent), plus Coder's vendor account.
- No source says "we adopted dev servers for humans because of agents." The sourced order is the reverse: servers first for humans (Stripe, Airbnb), agents reuse them; or servers for agents first while humans stay local (Shopify mobile).

### Gaps

- No first-person account from a company of 50-300 engineers that stood up dev servers in 2025-2026 specifically for agents and reported results.
- Cursor's post on development environments for cloud agents was seen only as a mirror title; not read.

---

## Part 5. How standard is the target model?

### Takeaway

Among large technology companies with any public evidence, a remote Linux machine with the editor on the desktop is the most common documented model, and it is documented at most of the largest (Google, Meta, Stripe, Uber, LinkedIn, Airbnb, Slack, GitHub). It is not universal: Shopify and Lyft went back to laptops, and several mid-size firms keep agents and code local. Survey numbers range from 4% to 64% depending on the question and are not usable as a single figure.

### Cited Findings

#### Surveys

- Docker, State of Application Development 2025 (posted 2025-07-10; over 4,500 respondents; fielded fall 2024): "64% of developers say they use non-local environments as their primary development setup, up from just 36% last year." Categories listed: personal remote dev environments or clusters 22% (11% in 2024); other remote dev tools such as Codespaces and Gitpod 12% (8%); ephemeral or preview environments 10% (12%). These sum to 44%, not 64%, and the page says the previous year's sample was more IT-focused. Vendor survey [fetched via extraction] — [Docker](https://www.docker.com/blog/2025-docker-state-of-app-dev/)
- Coder and SlashData, State of Development Environments 2025 (over 550 respondents, Q4 2024): 79% report using fully managed cloud-hosted environments, with about half having limited understanding of them. Vendor survey [snippet only] — [Coder](https://coder.com/blog/insights-and-key-findings-from-the-state-of-development-environments-2025-report)
- The 2022 survey of 1,173 developers (4.3% regular cloud IDE use) is in `failures_cost_tradeoffs.md`.
- Stack Overflow 2025 and JetBrains 2025: no question on where development happens surfaced in search.

#### Statements of prevalence by individuals

- "Plenty of large companies are using them (I'm talking Google/FB/Microsoft and the like). You may not have heard of it because they run these systems in-house vs using a commercial service." Anonymous commenter, 2023-10-19 [raw text] — [HN 37936660](https://news.ycombinator.com/item?id=37936660)
- "For bigger companies with much more complexity, remote devboxes make a ton of sense. You want to manage farms, not individual flower pots." Anonymous commenter [raw text] — [HN 37944193](https://news.ycombinator.com/item?id=37944193)
- Dissent in the same thread: "I've never heard of it from anyone I work with or know directly" — [HN 37935316](https://news.ycombinator.com/item?id=37935316); workstation-class hardware cheaper than cloud for one firm ("They did the cost calculations, buying hardware is cheaper in the long run, including ops") — [HN 37935332](https://news.ycombinator.com/item?id=37935332)

#### Classification of every company with evidence in the notes folder

Models: **L** code and tools on the laptop or desk machine; **H** laptop checkout synced to a remote runner; **R** remote Linux machine holds the checkout, IDE on the desktop over ssh; **B** browser IDE as the main path; **V** streamed remote desktop. Strength: A = official post or talk read; B = several independent individuals or one named speaker; C = one anonymous voice, vendor case study, job posting or snippet.

| Company | Model (date) | Strength | Where in notes |
| --- | --- | --- | --- |
| Google | R plus B (Cloudtop with ssh or Cider; google3 not on laptops) | A + 7 voices | google_and_meta, cloudtop_and_ondemand |
| Meta | R (devserver or OnDemand; VS Code on laptop) | A | google_and_meta |
| Stripe | H (to about 2022) then R (2024-2026) | A + 2 voices | other_tech_companies |
| Slack | H (2020) then R for webapp (2022) | A | other_tech_companies, this file |
| Uber | R (Devpod, 60% in 2022); 1 voice says many still built locally | A + 1 voice | other_tech_companies |
| LinkedIn | R (RDev) | A + 1 voice (2023) | other_tech_companies, this file |
| GitHub | R/B (Codespaces) | A + 1 voice | other_tech_companies |
| Airbnb | R (AirDev; local still possible) | B (talk abstract, 1 voice, postings) | this file, testimony_agents |
| Instacart | R (EC2 per engineer) | B (1 self-declared builder) | this file |
| Discord | R for backend, L for frontend (2024) | A | other_tech_companies |
| Dropbox | R (EC2 per developer via Coder) | C (vendor) | other_tech_companies |
| Plaid | R with laptop CLI client; sync elements (2022) | A, read as summary | this file |
| Rippling | H (Mutagen, 2022) | A | other_tech_companies |
| Databricks | H (one-way sync to EC2) | C (snippet) | this file |
| Stytch | H (2022) | A, thin | this file |
| Amazon | H and R mixed (Cloud Desktop; laptop sync common in 2017; ssh dev desktop in 2025) | B (testimony) | engineer_testimony_specs |
| Cruise | R (ephemeral GCP VMs, 2022) | B (trade press) | av_and_robotics |
| Jane Street | development machine per developer, not the laptop (reading of a transcript, 2026) | B | testimony_finance_firms |
| Woovi | R (LXC on owned server, 2025) | A, small | this file |
| Pipedrive | remote Kubernetes namespaces; checkout location unclear | C (snippet) | this file |
| Canva, Figma, Datadog | remote dev environments exist; model unknown | C (postings) | this file |
| Shopify | R (Spin, 2020-2022) then L (by 2025); remote Macs for agents (2026) | A | failures_cost_tradeoffs |
| Lyft | R (Onebox) then L (by 2022) | A via trade press | this file |
| Fullscript | remote namespaces then L (2026) | A | other_tech_companies |
| comma.ai | L (workstations plus owned cluster) | A | av_and_robotics |
| Block, Cloudflare, Dashlane | L for agents (2025-2026) | B (named authors) | testimony_agents |
| Photoroom | L, moving agents to remote containers (2026, intent) | A, small | this file |
| Large banks (several) | V (7 voices) | B | testimony_finance_firms |
| JPMorgan | V for staff; containers on firm infrastructure for agents | C | testimony_agents |
| National Australia Bank | locked laptop then B on EC2 (2019) | B (trade press) | finance_and_security |
| DZ BANK | B/R (Google Cloud Workstations) | C (vendor-hosted) | finance_and_security |
| DekaBank | hardened laptop then R/B (Coder) | C (vendor) | this file |
| Coder investment firm | L (MacBooks) then R | C (vendor) | this file |
| Niantic, Broadcom | commercial container environment (Strong Network) | C (1 voice each) | this file |
| Microsoft, Torc, ABN AMRO | V (out of scope: Windows or streamed desktop) | — | earlier notes |
| Ramp, Spotify | agents in remote sandboxes or pods; human model unknown | A for agents | gpus_and_agents |

#### Counts from the table

- R as current or last-documented model: 13 (Google, Meta, Stripe, Slack, Uber, LinkedIn, GitHub, Airbnb, Instacart, Discord backend, Dropbox, Cruise, Woovi), of which 8 at strength A. Adding DekaBank, the Coder investment firm and Plaid makes 16.
- Moved from H to R: 2 (Stripe, Slack). Still H when last documented: 3-4 (Rippling, Databricks, Stytch, part of Amazon).
- Moved from R back to L: 2 (Shopify, Lyft), plus Fullscript from remote namespaces.
- L by choice with a published reason: comma.ai, Block, Cloudflare, Dashlane.

### Inferences

- The fair statement for the essay is narrower than "every big tech company does this": among companies that publish, the largest monorepo shops put the checkout on a remote Linux machine and connect an editor over ssh, and the two that had laptop-sync designs abandoned them for it. The evidence is biased toward companies proud of the result; Lyft and Shopify show it is reversible.
- The Docker 64% figure should not be quoted without its caveats (changed sample, categories that do not add up, vendor).

### Gaps

- No neutral survey asks where the checkout lives and how the editor connects.
- For most table rows the evidence is two to five years old; current state at Uber, LinkedIn, GitHub, Slack and Instacart is unverified.
- Apple, Netflix, Microsoft (Linux teams), Oracle, Salesforce (outside Slack), Snowflake, Atlassian: nothing.

---

## Synthesized staged path (for one engineer, Linux, ssh, IDE on the desktop)

Each stage names who did it. Steps with no source are marked as inference.

1. **Pick the application that hurts most and can run on one machine.** Slack did the webapp only; Instacart built for apps needing 64 GB; the Coder investment firm piloted with one complex-build team. Avoid reproducing the whole service graph per developer (Lyft's Onebox and the 72-engineer company both failed there).
2. **Start from a product or the plainest thing, and build only for a named gap.** Instacart: "Start with the SaaS versions and see." One-person accounts are Codespaces (two voices) or a single server with manual provisioning (Woovi). Dropbox's home-built provisioner became the thing it had to replace. If self-hosting, the sourced minimum is: one image, a create command, ssh, sudo for the engineer, a settings hook, nightly configuration push, scheduled stop (Instacart, Slack). *Inference: one persistent VM per engineer, not per branch, because per-branch machines need the pool and prebuild pipeline that teams of four or more built.*
3. **Put the machine where security already has controls.** Dedicated segment, no public address, packages through the existing artifact proxy, access through the identity provider (DekaBank, DZ BANK, NAB). *Inference: decide early how the VS Code server and extensions reach a restricted host, since Microsoft's documentation lists specific download hosts.*
4. **Recruit volunteers across different workflows; fix what they hit before widening.** Slack (volunteers, two months of fixes between prototype and GA), Discord (champions from several departments). Slack's warning: people who see it break twice hesitate to return.
5. **Open it to everyone without a mandate and let onboarding default to it.** Slack reached over 90% in about four months this way; Plaid 87% in about 1.5 years; at the Codespaces startup "most of our newer employees exclusively use codespaces".
6. **Leave local development alone for the remainder, and say so.** Slack, Plaid, Uber, Airbnb and the Codespaces startup all kept it. Discord's hard cutoff applied to backend only, and came with training and documentation. *Inference: with one engineer, do not promise support for local setups; the startup account says most support questions came from the people still local.*
7. **Add cost controls once usage is real.** Hibernation and savings plans (Instacart), sleep after hours (Pipedrive), idle shutdown added after launch (Torc, earlier notes). Slack doubled instance size and cost when frontend builds moved in.
8. **Only then consider pools, prebuilds and per-task machines, and only if agents or branch switching demand it.** This is the step where Stripe, Slack, GitHub, LinkedIn and Instacart spent their headcount. *Inference: for one engineer this is the point to buy (Coder, Codespaces, Ona, Cloud Workstations) instead of build.*
9. **Run agents on the same servers.** Stripe ("What's good for humans is good for agents", existing notes), Airbnb, DekaBank's planned pilot. *Inference: the server's network position and credentials, set in stage 3, become the agent's limits.*

## Best model companies for an organization starting in 2026

- **Instacart (Bento Remote)**: the closest to the target at modest scale. Plain EC2, VS Code over ssh, sudo, Ansible and shell, nightly push, hibernation; about four people, under a year, part-time afterwards. Weakness: one HN voice, 2023, no official post found.
- **Slack**: the best-documented rollout (dates, volunteers, no mandate, 90% in four months, scope limited to one repository). Weakness: per-branch disposable machines need a pool; team size unstated.
- **Discord**: the model for buying. Shows what remains to do after buying (image, dotfiles, diagnostics, training), why VMs beat containers, and how a cutoff was handled.
- **Stripe**: the model for the end state with agents (devbox in a QA zone, no real data, agents on the same machines). Not a model for staffing: about ten engineers and a decade.
- **The Codespaces startup and agency accounts, and Woovi**: the only evidence of what one person runs. Use them for the honest floor: an image or config, prebuilds from the vendor, idle timeout complaints, a few holdouts.
- **DekaBank (vendor)**: the model for getting a regulated security function to approve, by reusing an existing segment and artifact proxy.
- **Lyft and Shopify** as the cautionary pair: what makes a remote environment get abandoned.

## Angles for an essay

1. **The four-person floor, and how to get under it.** Every self-built platform with a published headcount took four or more engineers; every one-person account used a managed product or a single server and skipped pools, per-branch machines and custom sync. The essay can say exactly which features the headcount bought and argue that none is needed on day one.
2. **Nobody mandated it, and it won anyway.** Slack and Plaid reached about 90% voluntarily; the support burden moved to the people who stayed local. The argument for a small organization: make the remote path the default for new hires and stop supporting the other one, without banning it.
3. **The failures were about the service graph, not the machine.** Lyft, the 72-engineer company and Shopify's pods failed on running everything per developer or on Kubernetes pods; the survivors run one application on one VM with shared services behind it.
4. **Plain ssh is the neutral interface.** Microsoft's remote server is licensed only for its own client; Cursor and Windsurf reimplement it; JetBrains needs a heavy backend. A plain VM with sshd serves all of them, terminal editors, and agents in tmux, and passes through an identity-aware proxy with a ProxyCommand.
5. **Security approved the server because it replaced controls on the laptop, not because it added new ones.** DekaBank's laptops were slow because of antivirus and proxies; moving the build to a segment with an artifact proxy got routine approval. The same position later bounds the agents.

## Gaps (overall)

- **Staffing below four**: no numbers for one engineer on plain VMs serving more than about 10 developers; no hours-per-week or ticket counts anywhere.
- **Headcounts missing** for Uber, LinkedIn, GitHub, Airbnb, Slack, Discord, Plaid, Datadog, Figma, Notion, Ramp, Brex, Monzo.
- **Unread primary sources**: Plaid's post (403), Pipedrive's post (403), Lyft's original series (read via InfoQ), Instacart has no official post found, Coder's Palantir case study, Shopify's NixCon talk recording.
- **Measurements**: only setup time is reported before and after; nothing on time to first commit, tickets or satisfaction specific to dev machines.
- **Vendor operating effort and price** at 50-300 engineers: not gathered for Coder, Ona, Cloud Workstations or Codespaces.
- **Security conditions**: no first-party document; no statement on logging or session capture on dev servers.
- **Surveys**: no neutral, current figure for the share of organizations on the target model.
- **Quotes** tagged "fetched via extraction" need checking against the live pages before use. The HN quotes were read as raw text.
