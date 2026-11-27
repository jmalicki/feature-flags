# Appendix

*Reference tables for [Moving development off the laptop](essay.md).*

## Structure of the appendix

*Moving development off the laptop:* [Essay](essay.md) · [Appendix](appendix.md)

- [Machine sizes seen in public](#machine-sizes-seen-in-public) lists each report of a development machine's size behind the benchmark in the essay.
- [Channels out of a development server](#channels-out-of-a-development-server) lists each way data can leave a Linux server reached by ssh, and what narrows it.
- [From a Google laptop to production](#from-a-google-laptop-to-production) follows one engineer's request through BeyondCorp, step by step, with the source for each step.
- [Strength of the evidence by claim](#strength-of-the-evidence-by-claim) says how the evidence is graded and grades each claim the essay makes.

## Machine sizes seen in public

No company publishes a default machine size. Each row is either a company's chosen example or a machine whose owner pasted its details into a public bug report or repository. The rows for Amazon come from public reports that name an Amazon development desktop; none states an employer. Those from 2026 are from heavy users of coding agents and overstate the typical size, and the GPU rows come from contributors to machine-learning frameworks.

| Company | Machine | Cores, memory, disk | Date | Basis |
| --- | --- | --- | --- | --- |
| Slack | Remote development instance | 8 cores and 16 GB, raised to 16 cores and 32 GB at double the cost | 2022 | [Company post](https://slack.engineering/remote-development-at-slack/) |
| GitHub | Environment for github.com | 32 cores, 64 GB | 2021 | [Company post](https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/) |
| Uber | Remote environment | Up to 48 cores, 96 GB | 2022 | [Company post](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/) |
| Stripe | Devbox | A menu, none "smaller than a high-end laptop" | 2024 | [One engineer who works on the system](https://news.ycombinator.com/item?id=41292159) |
| Amazon | Development desktop | 4 vCPUs, 30.5 GB, 0.95 TB local disk | 2018 | [One commenter](https://news.ycombinator.com/item?id=16561995) |
| Amazon | Development desktops | 16 vCPUs and 30 GiB; 16 and 61 GB; 32 and 247 GB; 128 and 493 GiB; 192 and 740 GB | November 2026 | Five public reports by different authors ([1](https://github.com/kirodotdev/KiroCrew/pull/42430), [2](https://github.com/kirodotdev/KiroCrew/pull/40219), [3](https://github.com/kirodotdev/KiroCrew/pull/41822), [4](https://github.com/kirodotdev/KiroCrew/pull/38079), [5](https://github.com/kirodotdev/KiroCrew/pull/41615)) |
| Amazon | Two desktops held by one engineer | 64 Arm cores with an 11.7 TiB network volume; 192 vCPUs with a 2 TiB network volume | September 2026 | [Public measurement records](https://github.com/ahrav/systems-snackpack/tree/main/topics/053-nvme-blk-mq/measurements) |
| Amazon | Two desktops held by one engineer | One with 512 GiB of memory; one with 192 vCPUs and 1.5 TiB | October and November 2026 | Public configuration changes ([1](https://github.com/jjant/nix-config/pull/245), [2](https://github.com/jjant/nix-config/pull/272)) |
| Google | Cloudtop | 96 hardware threads | January 2021 | [Bug report](https://github.com/emscripten-core/emscripten/issues/13372) |
| Google | Virtual machine running Google's Linux, probably a Cloudtop | 48 CPUs, 181 GB | July 2022 | [Bug report](https://github.com/kubernetes/minikube/pull/14555) |
| Google | Machine running Google's Linux | 979 GB root disk, 76% used | November 2024 | [Bug report](https://github.com/systemd/mkosi/issues/3223) |
| Google | Specialist desk workstation, an older model | Two 18-core processors, 256 GB | 2021 | [One commenter](https://news.ycombinator.com/item?id=29386161) |
| Meta | Development server | "~50-100 cores" | Described in 2025, in the past tense | [One commenter, employer implied](https://news.ycombinator.com/item?id=44112625) |
| Meta | GPU development machine | 192 CPUs, 8 GPUs | October 2024 | [Bug report](https://github.com/pytorch/pytorch/issues/139129) |
| Meta | GPU development machine | 384 logical CPUs, 8 H100 GPUs | May 2026 | [Bug report](https://github.com/meta-pytorch/monarch/issues/3759) |
| Meta | Slices of GPU development machines | 46 CPUs with 1 H100 GPU; 44 CPUs on another | December 2024; November 2026 | Bug reports ([1](https://github.com/pytorch/pytorch/issues/143524), [2](https://github.com/pytorch/executorch/pull/25018)) |
| Instacart | Remote machine | 64 GB needed for the largest applications | 2023 | [The system's builder](https://news.ycombinator.com/item?id=37938537) |
| Woovi | One shared server for 10 developers | 96 CPUs, 512 GB | 2025 | [Company post](https://dev.to/woovi/remote-development-at-woovi-25mj) |

Size is rationed in different ways. Google's 2018 paper says instances should have caps ["to prevent users from gratuitously creating high-specification/high-cost devices"](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf). A commenter wrote of Amazon in 2018 that a very large instance type would bring a question from management, and a report from an Amazon development desktop in 2026 says ["I can request bigger instances"](https://github.com/kirodotdev/KiroCrew/issues/40267). No company publishes a cap or an approval step. Agents add load: one report describes [60 to 100 live agent sessions on a single development desktop](https://github.com/kirodotdev/KiroCrew/issues/31349).

## Channels out of a development server

The first five rows can be closed or narrowed at the server's network boundary. The next six are exits the design keeps open on purpose, each through a service the engineer does not administer. The last four cannot be closed while an engineer has a shell and an editor, and are covered by limiting what each person can read and by logs kept off the server.

| Channel | Control | What still leaks | Source |
| --- | --- | --- | --- |
| Web requests | Outbound traffic denied by default, with a proxy that allows named hosts | Any allowed host that accepts writes | [Claude Code sandbox documentation](https://code.claude.com/docs/en/sandboxing); an open-source example of such a proxy is [Stripe's](https://github.com/stripe/smokescreen), which Stripe describes for production traffic |
| DNS | Names resolved only by an internal resolver or by the proxy | Data encoded in looked-up names, if the resolver forwards them | [A 2025 disclosure](https://embracethered.com/blog/posts/2025/claude-code-exfiltration-via-dns-requests/) |
| Other protocols | A firewall or network namespace that denies them, enforced outside the machine where the user has root | Nothing while the default holds | [Claude Code sandbox documentation](https://code.claude.com/docs/en/sandboxing) |
| `git push` to an outside account | Pushes allowed only to the organization's own code host. Where that host is a shared public service, the proxy intercepts traffic to it and adds GitHub's enterprise header, and ssh to the host is blocked because the header does not cover it | Anonymous reads of public repositories | [GitHub documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-access-to-githubcom-using-a-corporate-proxy) |
| Publishing a package | The package proxy accepts no uploads to public registries | Publishing to a registry that is allowed | The author's inference |
| The package proxy | It fetches from public registries itself and serves the result | Requests for package names of the requester's choosing; a malicious package reaches every server | [DZ BANK, co-written with its vendor](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations) |
| The hosted search and fetch tool | Runs outside the server; searches an index or fetches only known addresses; queries logged | The wording of a query and the choice of page | [OpenAI documentation](https://learn.chatgpt.com/docs/web-search.md); [OpenAI on link safety](https://openai.com/index/ai-agent-link-safety/) |
| The gateway's tools that write | Each tool authorized separately and disabled until enabled | Tracker comments and chat posts that others, or outside systems, read | [Uber](https://www.uber.com/blog/designing-mcp-gateway/) |
| The model endpoint | A proxy the organization runs that holds the key; contract terms | Anything the agent can read | [Anthropic](https://www.anthropic.com/engineering/how-we-contain-claude); [Claude Code documentation](https://code.claude.com/docs/en/claude-code-on-the-web); [Cloudflare](https://blog.cloudflare.com/internal-ai-engineering-stack/) |
| The editor's downloads | The server component downloaded by the laptop and transferred; extensions installed from approved files | A malicious extension runs beside the code | [VS Code documentation](https://code.visualstudio.com/docs/remote/faq) |
| An agent's pull request, and the pipeline behind it | Review by a person before the pipeline uses deployment credentials | Anything the agent read and chose to write | [A 2025 demonstration](https://invariantlabs.ai/blog/mcp-github-vulnerability) |
| ssh port forwards and tunnels | `DisableForwarding` in the ssh server | The manual says this adds nothing while the user has a shell | [sshd_config](https://man.openbsd.org/sshd_config) |
| Copying files to the laptop over ssh | None; connections can be logged | Anything the user can read | [sshd_config](https://man.openbsd.org/sshd_config) |
| The editor's connection | None known to the author | File contents reach the laptop by design | [VS Code documentation](https://code.visualstudio.com/docs/remote/faq) |
| The screen | None over ssh | Anything displayed | |

GitHub reports that scanning at push time ["stops about 30% of newly detected secrets before they enter repository history"](https://github.blog/news-insights/product-news/secret-protection-must-scale-with-software/), which gives the size of what such a control leaves. Products that inspect data on the machine itself may not cover Linux servers: [one large vendor's documentation](https://docs.netskope.com/en/netskope-client-supported-os-and-platform) lists that feature for Windows and macOS.

Two facts about the editor bear on a closed server. Microsoft's documentation says the server component of VS Code ["is not intended or licensed for use by other clients"](https://code.visualstudio.com/docs/remote/faq), and [one editor derived from VS Code](https://docs.windsurf.com/windsurf/advanced) says it ships its own ssh support for that reason. The same Microsoft page lists the hosts from which the component is downloaded, by the server first and by the laptop if the server cannot reach them, and the hosts that serve extensions.

## From a Google laptop to production

The steps below are assembled from Google's published papers and book, with two steps that rest on engineers' public comments. How the ssh certificate and the production credential are issued has no public source.

| Step | What happens | Source |
| --- | --- | --- |
| 1 | The laptop was entered in an inventory when it was received and imaged, and holds a device certificate. | [2018 paper](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf); [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf) |
| 2 | It joins a network that grants nothing beyond the internet and basic services. There is no VPN step. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf) |
| 3 | A service has already computed the laptop's trust tier from its inventory record. There are three tiers, and the more a device is trusted, the shorter-lived its credentials. | [2016 paper](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf); [2019 post](https://security.googleblog.com/2019/09/how-google-adopted-beyondcorp-part-3.html) |
| 4 | The engineer's first request presents the device certificate and is redirected to single sign-on, which takes a password and a touch of a security key. One commenter puts this at about once a day and another at a 20-hour session limit. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf); [design overview](https://docs.cloud.google.com/docs/security/infrastructure/design); [first commenter](https://news.ycombinator.com/item?id=26337648); [second commenter](https://news.ycombinator.com/item?id=37180051) |
| 5 | Every later request is authorized again, by user, group, device and tier. The proxy removes the user's credential before passing the request on. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf); [access proxy paper](https://www.usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf) |
| 6 | ssh to the development machine goes through the same proxy, wrapped in WebSockets by a local helper. | [Access proxy paper](https://www.usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf) |
| 7 | The development machine is itself an inventoried device with its own certificate, obtained at first boot. | [2018 article](https://queue.acm.org/detail.cfm?id=3264508) |
| 8 | The engineer works in a shell or a remote editor. The source tree stays on the server side. | Engineers' public comments, [for example](https://news.ycombinator.com/item?id=33112061) |
| 9 | Production credentials come from a separate step and expire. | [Two](https://news.ycombinator.com/item?id=46541516) [commenters](https://news.ycombinator.com/item?id=47529568) |
| 10 | A production command goes to a proxy that checks policy, may require a second person, runs the command and records it. Most staff have no shell on production machines. | [Google's security book, chapter 3](https://google.github.io/building-secure-and-reliable-systems/raw/ch03.html); [production services page](https://docs.cloud.google.com/docs/security/production-services-protection) |
| 11 | Emergency access is available from specific locations, with keys kept offline and sessions recorded. | [Production services page](https://docs.cloud.google.com/docs/security/production-services-protection); [chapter 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) |

Google's book names a weakness of step 10: the people who approve each other's commands ["use the same centrally managed workstations."](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)

## Strength of the evidence by claim

A claim is graded strong when companies state it in their own posts, papers or talks, or when a regulator or a court filing does. It is graded moderate when it rests on several independent individuals, on bug reports that show a machine's configuration, or on companies' own measurements. It is graded weak when it rests on one or two voices, on vendors' material, or on research demonstrations. Employers named in public forums are self-declared. A complaint in a court filing is an allegation.

| Claim | Strength | Rests on |
| --- | --- | --- |
| Leading companies develop on remote Linux machines | Strong | Nine companies' own posts and talks; five more by individuals, vendors or press. Several of the posts are two to five years old |
| The editor runs on the laptop and attaches over ssh | Strong | Meta, Stripe, Slack, Uber, LinkedIn, Discord; GitHub's main path is its own remote editor, with ssh for terminal editors |
| The checkout belongs on the server; syncing from the laptop fails | Strong | Stripe's and Slack's accounts of giving it up; eleven engineers on Google's rule. Four companies still synced when last described |
| Unattended agents run on remote machines of their own | Moderate | Stripe, LinkedIn, Ramp, Airbnb |
| Attended agents run on the engineer's development server | Weak to moderate | Five engineers; Jane Street, which does not say where the machine sits; one Google engineer. Cloudflare, Block and Dashlane run agents on the engineer's own machine |
| A separate identity for agents | Weak | LinkedIn, and a Microsoft pilot |
| Agents reach internal tools through tool servers | Strong | Eight engineers; Uber, Stripe and Cloudflare publish a gateway or central server; Block's tool servers run on the engineer's machine |
| Production data is reached through a broker, or kept out | Moderate to strong | Stripe, Google, GitLab, Monzo, Meta, LinkedIn, Envoy |
| Real personal data stays out of development | Moderate to strong | A regulator's decision, [an EU standard for financial entities](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401774), Imperva's post-mortem |
| Hardware keys and short-lived certificates answer phishing and stolen keys | Strong | [Google](https://docs.cloud.google.com/docs/security/infrastructure/design), with [a spokesperson's 2018 statement](https://krebsonsecurity.com/2018/07/google-security-keys-neutralized-employee-phishing/); Meta; [Netflix](https://github.com/Netflix/bless); a regulator's report; [US guidance on a jump host](https://www.cisa.gov/sites/default/files/publications/ESF_SECURING_THE_SOFTWARE_SUPPLY_CHAIN_DEVELOPERS.PDF) |
| No access control answers code already running on the laptop | Strong | CircleCI's report; a former Google security engineer; the Security Alliance |
| Engineers have root on these machines | Moderate | Individuals and bug reports at Google, Amazon, Stripe and Instacart, with one dissent at Google; no company states a policy |
| Typical machine sizes | Moderate | Company posts and public reports, skewed toward heavy users |
| Remote development is faster | Moderate | Companies' own measurements, mostly from 2021 and 2022 |
| A development server is safer than a laptop | Argued; not measured | How the published attacks worked; advice from Microsoft and the Security Alliance. No source shows a breach that a server prevented, and no breached company responded by moving development |
| The design against each attacker | The author's analysis | The mechanisms and incidents cited in the essay; no published test |
| A transition can follow a known path | Moderate | Slack, Discord, Instacart, GitHub, each for some stages |
| One engineer can run phase one | Weak | Four small-scale accounts; every pooled platform with a known team had more |
| An agent can read the public web safely | Weak | Vendor documentation and security research; no company's own account |
| A sandbox can contain an agent on a machine where the engineer has root | Weak | One company's account that it works; two reports of sandboxes breaking |
| Cost per engineer | Arithmetic only | One hosted product's list price and one vendor's model; no operator publishes a figure |

Some links point to copies because the original refuses automated readers or was read that way. The sentence from Google's 2016 paper is quoted from a third party's page that reproduces it. Verizon's 2024 report is linked at a copy hosted by an industry association. The New York regulator's report, the Federal Trade Commission's press release and the 2018 article on Google's virtual desktops were read from archived copies of the pages linked. The statements by Binance, Facebook and Meta are paraphrased, apart from single words, because those pages were read through a reader service.
