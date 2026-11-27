# Appendix

*Reference tables for [Moving development off the laptop](essay.md).*

## Contents

- [Machine sizes seen in public](#machine-sizes-seen-in-public)
- [Channels out of a development server](#channels-out-of-a-development-server)
- [Source access and personal data](#source-access-and-personal-data)
- [From a Google laptop to production](#from-a-google-laptop-to-production)
- [Strength of the evidence by claim](#strength-of-the-evidence-by-claim)

## Machine sizes seen in public

Slack gives the size of the instance it upgraded. Uber gives an upper limit. A bug report can establish what one person was running when a build failed. None of these sources gives a distribution of machine sizes across a company. The Amazon entries identify development desktops from the reports themselves. The 2026 agent workloads and specialist GPU machines are especially poor guides to what an engineer would receive on joining.

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

Google’s virtual-desktop team recommended spending caps on instance sizes. One Amazon development-desktop user reported being able to request a larger instance. Neither source gives the approval threshold. [Google paper](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf) · [Developer report](https://github.com/kirodotdev/KiroCrew/issues/40267)

## Channels out of a development server

The network policy belongs outside a machine on which an engineer has root. That policy can decide which services the machine may contact. Each permitted service still needs a rule for what an engineer or agent may send through it.

| Connection | Proposed control | Remaining exposure |
| --- | --- | --- |
| Internet and DNS | Route web traffic through an allowlisted proxy and name lookups through a controlled resolver. Deny other outbound connections. | An approved host can receive uploads. The resolver can forward a caller’s query. [Stripe’s production proxy](https://github.com/stripe/smokescreen) |
| Source host | Restrict pushes to approved repositories. Check each supported transport when the enterprise shares its hosting provider with personal accounts. | A hostname alone identifies the provider. The repository and account determine who receives a push. [GitHub corporate proxy documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-access-to-githubcom-using-a-corporate-proxy) |
| Dependencies and editor extensions | Fetch packages through a mirror and install approved editor components. | The mirror handles requested package names. Dependencies and extensions can execute beside the checkout. [DZ BANK and its vendor](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations) · [VS Code remote FAQ](https://code.visualstudio.com/docs/remote/faq) |
| Web search and model calls | Run search outside the workspace and route model calls to an approved provider. Limit the files available when building a prompt. | A search provider receives the query. A model provider receives whatever code or tool output is included in the request. [OpenAI on link safety](https://openai.com/index/ai-agent-link-safety/) · [Guardsquare engineering account](https://www.guardsquare.com/blog/llms-for-software-development) |
| Internal tools and pull requests | Authorize write operations separately. Give the publishing service its own credential and require review before privileged CI jobs run. | Readers of a posted comment or a proposed patch can see its contents. Spotify’s agent can prepare a change while its service controls publication. [Uber’s tool gateway](https://www.uber.com/blog/designing-mcp-gateway/) · [Spotify’s agent workflow](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) |
| Interactive shell and editor | Scope repository reads to the work. Use a managed client when the task requires transfer or clipboard restrictions. | The engineer can see the code being edited. An SSH login record establishes a connection and gives no inventory of the text the engineer saw or saved. [OpenSSH server manual](https://man.openbsd.org/sshd_config) · [VS Code remote FAQ](https://code.visualstudio.com/docs/remote/faq) |

## Source access and personal data

An investigation needs to establish who could read the material, which account accessed it, and where a copy went. Different systems hold those records.

| Operational question | Evidence and consequence for a development environment |
| --- | --- |
| What happens when someone leaves? | CrowdSec ended a departing developer’s infrastructure access and kept repository access open for handover. The company attributed the subsequent copying of private repositories to account compromise. A handover needs a named owner and an expiry at the code host as well as the development host. [CrowdSec postmortem](https://www.crowdsec.net/blog/tanstack-supply-chain-attack-analysis) |
| Who handles a data loss prevention (DLP) alert? | Symantec describes an initial configuration that generated roughly 10,000 DLP events a day for six people. That count covered its DLP program broadly. Before relying on an alert, assign someone to investigate it and test the volume against the time they have. [Symantec’s account of using its own product, pp. 2–4](https://docs.broadcom.com/doc/customerone-source-code-security-the-symantec-way-en) |
| Does a Linux DLP product cover the actual session? | Fortra lists support for Linux servers. Netwrix says its clipboard monitor requires a desktop session and its notifier. An evaluation should exercise the shell, editor and client the team uses. [Fortra datasheet](https://static.fortra.com/digital-guardian/pdfs/datasheets/fta-dg-linux-ds.pdf#page=2) · [Netwrix policy documentation](https://docs.netwrix.com/docs/endpointprotector/admin/cap_module/cappolicies) |
| Who can see the data before masking? | FINRA’s pipeline held original records in a controlled staging account. Development and QA accounts received the masked output. Access to staging, including the pipeline’s own identity, needs a separate review. [FINRA presentation](https://d1.awsstatic.com/events/reinvent/2019/How_FINRA_builds_serverless_data-masking_pipelines_across_accounts_SEC338.pdf) |
| What if a performance test needs production-scale data? | GitLab runs database migration tests against a restricted, expiring thin clone and returns results to the merge request. A team adopting that approach has to control both direct database access and the values it publishes in test output. [GitLab operational guide](https://docs.gitlab.com/development/database/database_migration_pipeline/) · [Design alternatives](https://handbook.gitlab.com/handbook/engineering/architecture/design-documents/database_testing/#alternative-approaches) |
| What can investigators reconstruct? | GitHub Enterprise Cloud documents seven days of Git events through its audit API and export. A team that needs a longer window can stream events to its own storage. A clone event identifies the account and repository. Following the copy after that requires other evidence. [GitHub audit access](https://docs.github.com/en/enterprise-cloud%40latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise/accessing-the-audit-log-for-your-enterprise) |

The research notes give the circumstances of each incident, the source for each control and the limits of what the organization disclosed. [Data loss and insider access](research/data_loss_deep_dive.md)

## From a Google laptop to production

Google documented device inventory, access decisions and production controls in separate publications. The table joins them to show where authority changes. The exact credential handoff between a development machine and production is unpublished in these accounts.

| Step | What happens | Source |
| --- | --- | --- |
| 1 | The laptop was entered in an inventory when it was received and imaged, and holds a device certificate. | [2018 paper](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf); [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf) |
| 2 | It joins a network that grants nothing beyond the internet and basic services. There is no VPN step. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf) |
| 3 | A service has already computed the laptop's trust tier from its inventory record. There are three tiers, and the more a device is trusted, the shorter-lived its credentials. | [2016 paper](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf); [2019 post](https://security.googleblog.com/2019/09/how-google-adopted-beyondcorp-part-3.html) |
| 4 | The engineer's first request presents the device certificate and is redirected to single sign-on, which takes a password and a touch of a security key. One commenter puts this at about once a day and another at a 20-hour session limit. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf); [design overview](https://docs.cloud.google.com/docs/security/infrastructure/design); [first commenter](https://news.ycombinator.com/item?id=26337648); [second commenter](https://news.ycombinator.com/item?id=37180051) |
| 5 | Every later request is authorized again, by user, group, device and tier. The proxy removes the user's credential before passing the request on. | [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf); [access proxy paper](https://www.usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf) |
| 6 | ssh to the development machine goes through the same proxy, wrapped in WebSockets by a local helper. | [Access proxy paper](https://www.usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf) |
| 7 | The development machine is itself an inventoried device with its own certificate, obtained at first boot. | [2018 article](https://queue.acm.org/detail.cfm?id=3264508) |
| 8 | The engineer works in a shell or a remote editor. The working copy lives on the development machine. | Engineers' public comments, [for example](https://news.ycombinator.com/item?id=33112061) |
| 9 | Production credentials come from a separate step and expire. | [Two](https://news.ycombinator.com/item?id=46541516) [commenters](https://news.ycombinator.com/item?id=47529568) |
| 10 | A production command goes to a proxy that checks policy, may require a second person, runs the command and records it. Most staff have no shell on production machines. | [Google's security book, chapter 3](https://google.github.io/building-secure-and-reliable-systems/raw/ch03.html); [production services page](https://docs.cloud.google.com/docs/security/production-services-protection) |
| 11 | Emergency access is available from specific locations, with keys kept offline and sessions recorded. | [Production services page](https://docs.cloud.google.com/docs/security/production-services-protection); [chapter 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html) |

Google points out that two-person approval still has a shared dependency. Both approvers use centrally managed workstations. [Google’s security book, chapter 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)

## Strength of the evidence by claim

| Question | What the evidence supports | What remains open |
| --- | --- | --- |
| How long have engineers worked this way? | Day-one instructions, troubleshooting posts, personal blogs and conference slides place everyday editing, builds or tests on development hosts during 2005–2015. Some identify only one engineer or one stage of a build. [Historical accounts and their scope](research/history_deep_dive.md) | How prevalent each arrangement was. The same period includes local checkouts, synchronized trees and local builds. |
| Where do the checkout and editor belong? | Stripe and Slack describe why they gave up synchronizing laptop checkouts. Other teams used synchronization successfully enough to keep it when they wrote about it. [Workflow evidence](research/ledger_a_server.md) | Whether remote editing meets the latency, offline or hardware needs of a particular team. |
| Will a development server make the team faster? | Company accounts document gains for particular repositories, machine sizes and tasks. [Performance and machine reports](research/ledger_a_server.md) | A typical speedup, machine size or monthly bill. The first pilot can measure the team’s own edit and test cycle. |
| Does the move reduce theft or disclosure? | Incidents identify actual losses of code and personal data. Operating accounts document repository permissions, de-identification, controls on exports and independent logging. [Incident and control catalog](research/data_loss_deep_dive.md) | The change in loss rate attributable to moving the checkout. Endpoint controls, data permissions and operations differ across deployments. |
| Whose authority does an agent use? | LinkedIn describes giving an agent its own identity. Postman records the developer, agent and run for brokered API calls. Spotify gives a service the credential to publish an agent’s proposed changes. [Identity evidence](research/ledger_b_access_data_agents.md) · [Postman’s broker](https://blog.postman.com/how-postman-governs-ai-agent-access-to-42-production-systems/) · [Spotify’s publisher](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3) | A tool log alone leaves open how the caller proved its identity. A separate publisher controls only actions that go through it. |
| What can one platform engineer operate? | Small teams describe running persistent development machines. Larger deployments document the work of pooling hosts, maintaining images and responding to outages. [Staffing and operations accounts](research/ledger_c_failures_staffing_transition.md) | Whether one person can cover a particular team’s support hours, recovery targets and security monitoring. |

[Return to the essay](essay.md)
