# Moving development off the laptop

*Why engineering organizations should develop on Linux servers reached by ssh, run their coding agents there, and decide at the server's network boundary what people and agents can reach.*

Some engineering organizations still develop on laptops, where the checkout, the toolchain, the running services and the credentials sit on the machine that also reads email and browses the web. They should move development to Linux servers, as Google, Meta, Stripe, Slack, Uber, LinkedIn and GitHub have each described doing. The engineer gets a machine in a data center, the editor on the laptop attaches to it, in most cases over ssh, and the code stays there. Those companies moved for speed, and a server has since become the place where AI coding agents can be given real work. Its network boundary is where an organization controls what people and agents reach: internal tools through a gateway, public code and documentation through a narrow read path, and data only through a broker.

A **development server** is a Linux machine that holds one engineer's checkout (the working copy of the code), toolchain and running code, while the laptop keeps an editor window, a browser and an ssh connection. An **agent** is an AI program that reads and edits code and runs commands on an engineer's behalf. A **bastion** is the single host through which every ssh connection to a development server passes, and a **package proxy** is a repository server that fetches packages and public source on the server's behalf. A **gateway** exposes internal tools such as the wiki and the bug tracker to agents and holds the credentials for them. A **broker** stands between a person or an agent and a data store, and authenticates, authorizes and logs each request.

## Structure of the article

*Moving development off the laptop:* [Essay](essay.md) · [Appendix](appendix.md)

Companies do not publish most details of their development machines, so the essay also relies on engineers' public comments and on bug reports that show a machine's configuration. It says how many independent people support a point and gives each one's role and employer, which in a public forum is self-declared. Where it recommends something that no company has documented, it says so in the recommending sentence and gives the basis. The appendix grades each claim and holds the reference tables.

- [The laptop as a development machine](#the-laptop-as-a-development-machine): speed, and attacks.
- [How the industry got here](#how-the-industry-got-here): the history, and 22 companies placed by model.
- [A working day on a Stripe devbox](#a-working-day-on-a-stripe-devbox): the best-documented example.
- [The development server](#the-development-server): checkout, editor, kind of machine, size, disk, GPUs and root.
- [Access to the server](#access-to-the-server): a range of controls, ending at Google's BeyondCorp.
- [What the server can reach](#what-the-server-can-reach): the network's exits, the public web, internal tools, data, and copying out.
- [Agents on the server](#agents-on-the-server): attended and unattended agents, authority, sandboxes and prompt injection.
- [The design against each attacker](#the-design-against-each-attacker): what the design does and does not do.
- [Failure modes](#failure-modes): outages, partial adoption and distance.
- [Staffing and cost](#staffing-and-cost): team sizes, what one engineer can run, and cost arithmetic.
- [What should change](#what-should-change): the changes, in three phases.
- [Getting started](#getting-started): a staged path.

## The laptop as a development machine

### Speed

A laptop limits the size of the codebase and the number of things an engineer can run at once. At Slack [a fresh clone of the main web application took nearly 30 minutes](https://slack.engineering/remote-development-at-slack/), and Shopify wrote of its own starting point, ["Laptops were melting."](https://shopify.engineering/shopifys-cloud-development-journey)

The companies that moved measured the difference themselves, mostly in 2021 and 2022 and on codebases larger than most. Uber found its remote environments [about 2.5 times as fast as laptops on its longer builds](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/). An organization whose services already build in two minutes on a laptop will gain less, and its case rests more on consistency, agents and security.

A fleet of laptops also drifts apart, and an engineer who works on Stripe's development environment wrote that ["the laptops skew across literally years of versions of dev tools"](https://news.ycombinator.com/item?id=41291251). When Shopify's mobile engineers began running coding agents in parallel, ["just three or four workflows were enough to max out a laptop"](https://shopify.engineering/remote-dev), and closing the lid stopped the work.

### Attacks through the developer's machine

A developer's laptop receives lures, runs untrusted code and holds live sessions to the systems an attacker wants, and attackers use the first two to reach the third. Microsoft describes [a campaign, running since at least December 2022](https://www.microsoft.com/en-us/security/blog/2026/03/11/contagious-interview-malware-delivered-through-fake-developer-job-interviews/), that approaches developers with fake job interviews and has them run a coding assignment that installs a backdoor. The theft from the exchange Binance in October 2026 shows each step of such an attack, as told in [Binance's initial report](https://www.binance.com/en/blog/community/3229153443759566763), which is still subject to independent review.

In June 2026 an engineer on the team that operates Binance's wallets tried to install a popular AI coding tool found through a search engine, and downloaded a tampered Homebrew installation. Binance's security staff detected it, replaced the device and rotated the credentials, but the attacker had learned who worked on wallet infrastructure. In September a second engineer was approached on a legitimate job-hunting site. After two interviews he was told to download an "assignment" onto his work computer, and the repository ran malicious code during setup. The malware replaced a legitimate development tool with a malicious version, and endpoint protection did not detect it.

On October 20 the attacker, working from the second engineer's computer, used an internal AI tool to gain control over two wallet engineers, one of them the engineer compromised in June. The report does not name the tool or say how it gave control. On the June engineer's work computer the attacker found a token that permitted container deployments. On October 29 the attacker logged onto the other wallet engineer's computer, used credentials stolen from the first, deployed a container and triggered a script that reached the wallet signing service. About $6.3 billion in digital assets was affected, of which about $2.85 billion had been frozen or intercepted when the report was written.

Binance says it rebuilt the wallet system and the internal AI tool, replaced the affected devices, decommissioned the engineers' credentials and tokens, scanned every employee device and tightened device controls, without saying where development will happen. The Security Alliance, a non-profit group that [analyzed the report](https://radar.securityalliance.org/tradertraitor-vs-contagious-interview-a-look-at-binances-initial-incident-report/), advised that "companies should assume engineers will be compromised and prepare accordingly". It also advised that employee laptops lose standing administrator rights, and that external code ["should run in a throwaway VM with no access to corporate credentials, SSH keys or cloud sessions"](https://radar.securityalliance.org/tradertraitor-vs-contagious-interview-a-look-at-binances-initial-incident-report/).

The same route led to the theft of about $1.5 billion from the exchange Bybit in February 2025, after which the wallet provider Safe stated that [the attack was achieved through a compromised developer machine](https://www.bleepingcomputer.com/news/security/lazarus-hacked-bybit-via-breached-safe-wallet-developer-machine/). Safe's later statement, quoted by [The Hacker News](https://thehackernews.com/2025/03/safewallet-confirms-north-korean.html) and [SecurityWeek](https://www.securityweek.com/how-social-engineering-sparked-a-billion-dollar-supply-chain-cryptocurrency-heist/), said a Docker project had compromised the developer's laptop and that the attackers then hijacked cloud session tokens. In May 2026 GitHub ["detected and contained a compromise of an employee device involving a poisoned VS Code extension published by a third party"](https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/), after which an attacker claimed about 3,800 of its internal repositories.

Lost and stolen devices account for 181 of the 10,626 breaches in [Verizon's 2024 report](https://www.sifma.org/wp-content/uploads/2025/04/2024-dbir-data-breach-investigations-report.pdf), nearly all involving personal data. [Slack](https://slack.com/blog/news/slack-security-update), [Dropbox](https://dropbox.tech/security/a-recent-phishing-campaign-targeting-dropbox) and [Cloudflare](https://blog.cloudflare.com/thanksgiving-2023-security-incident) each lost source code from the central repository to stolen tokens or phishing, with no laptop's disk involved. None of the companies breached through a developer's machine named moving development off that machine as its remedy; they rotated secrets, replaced devices and tightened authentication. A server also moves the files while the session stays on the laptop, where an attacker [can wait and use the engineer's connection](https://news.ycombinator.com/item?id=21702446).

What the cases share is one machine that ran the attacker's code and also held the credentials or sessions that led onward. A development server separates those roles if it is built to: untrusted code runs on a machine with no production credentials and few ways out, and the laptop keeps the browser and the sign-on. No source says such a server would have stopped the Bybit or the Binance theft. Against malware already on the laptop the design [narrows the damage without preventing it](#the-design-against-each-attacker).

## How the industry got here

The earliest published accounts of development off the laptop are Google's and Meta's, and other companies followed after 2019, when an editor made the arrangement practical for anyone with an ssh server. The published sequence runs from Google's remote builds in 2008, through several years in which companies synced code from the laptop to a server, to Stripe's agents on development servers in 2026.

![A timeline of 15 dated events from 2008 to 2026. Google builds remotely from 2008. Microsoft announces remote development over ssh for VS Code in May 2019. Slack in 2020 and Stripe in 2022 still sync code from the laptop to a server. GitHub moves to Codespaces in 2021, and Slack passes 90% remote by January 2022. In 2026 Stripe says most human-written code is produced over ssh on a devbox, and runs its coding agents on devboxes.](figures/02-timeline.svg)

Google's 2016 paper on its monorepo, as [quoted elsewhere](https://mjtsai.com/blog/2016/06/30/why-google-stores-billions-of-lines-of-code-in-a-single-repository/), says that "most developers access Piper through a system called Clients in the Cloud, or CitC", so for most developers the working copy was not on a personal machine's disk. Facebook said in 2019 that [most development was done on reserved servers in its data centers](https://developers.facebook.com/blog/post/2019/11/19/facebook-microsoft-partnering-remote-development). Other companies could follow once Microsoft announced [remote development for VS Code](https://code.visualstudio.com/blogs/2019/05/02/remote-development) on May 2, 2019, which keeps the editor's window on the laptop and runs everything else on a machine reached by ssh.

Several companies ran a halfway design for years after that editor existed, in which the code stayed on the laptop and a file watcher copied each change to a server that ran it. Slack [worked this way in 2020](https://slack.engineering/development-environments-at-slack/), Stripe [still did in 2022](https://www.infoq.com/presentations/stripe-dev-env-infrastructure), and Amazon did by the accounts of [two](https://news.ycombinator.com/item?id=15391051) [people](https://news.ycombinator.com/item?id=32091232) who knew its tools. A former Stripe engineer recalled that ["sometimes the file watcher would miss an update and the code on your remote machine would be broken in strange ways"](https://news.ycombinator.com/item?id=41291111). Slack replaced the design with a remote workflow, and by the end of January 2022 [over 90% of its engineers had switched](https://slack.engineering/remote-development-at-slack/). The engineer who built it later put steady adoption at [80 to 85%](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack).

The public record is clear enough to place 22 companies by the way their engineers develop. Fourteen keep the checkout on a remote Linux machine with the editor attached from the laptop, nine of them by their own published account.

| Model | Companies | Basis |
| --- | --- | --- |
| Checkout on a remote Linux machine, editor on the laptop | [Google](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future) (also a browser editor), [Meta](https://www.infoq.com/presentations/meta-production-environment/), [Stripe](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2), [Slack](https://slack.engineering/remote-development-at-slack/), [Uber](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/), [LinkedIn](https://www.linkedin.com/blog/engineering/cloud-computing/building-in-the-cloud-with-remote-development), [GitHub](https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/), [Discord](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments) (backend), [Woovi](https://dev.to/woovi/remote-development-at-woovi-25mj) | Company posts and talks, 2019 to 2026 |
| The same model, on other evidence | [Amazon](https://github.com/kirodotdev/KiroCrew/issues/14627) (public reports that name an Amazon development desktop; none states an employer), [Instacart](https://news.ycombinator.com/item?id=37938537) (the system's builder), [Airbnb](https://news.ycombinator.com/item?id=37937401) (one engineer), [Dropbox](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder) (a vendor's case study), [Cruise](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise) in 2022 (a recruiting article) | As marked |
| Checkout on the laptop, synced to a remote machine, when last described in 2022 | [Plaid](https://web.archive.org/web/20240229162844/https://plaid.com/blog/scaling-with-devenv/), [Rippling](https://rippling.com/blog/how-we-used-the-cloud-to-supercharge-remote-development), [Stytch](https://stytch.com/blog/remote-dev-1/), [Pipedrive](https://web.archive.org/web/20230108175036/https://medium.com/pipedrive-engineering/say-hello-to-devboxes-fab125cd793a) | Company posts |
| Returned to laptops | [Shopify](https://app.media.ccc.de/v/nixcon2025-56413-nix-based-development-e) (a talk abstract), [Lyft](https://www.infoq.com/news/2022/03/lyft-cloud-local-dev) (a press summary of its posts), [Fullscript](https://builders.fullscript.com/posts/local-first-dev-environments-at-medium-scale) | As marked |
| Local machines by choice | [comma.ai](https://blog.comma.ai/datacenter/) | Company post |

The table shows that the model is established at large companies and cannot show its share of the industry, because companies that build a platform write about it and companies on laptops have nothing to post. The two published surveys, [one recruited through a vendor](https://arxiv.org/html/2603.06050v1) and [one run by a vendor](https://www.docker.com/blog/2025-docker-state-of-app-dev/), ask different questions and give 4% and 64%.

Two of the three companies that returned to laptops had a different design from one server per engineer. Lyft gave each engineer a remote copy of its service graph and found that an instance ["could require too many resources to be practical"](https://www.infoq.com/news/2022/03/lyft-cloud-local-dev), and Fullscript replaced per-developer namespaces of services in a remote cluster. Shopify built three versions of its cloud environment between 2020 and 2022, the last a single Linux image for each engineer. A 2025 conference abstract by one of its engineers says ["we moved from cloud development to local development"](https://app.media.ccc.de/v/nixcon2025-56413-nix-based-development-e) and gives no reason.

## A working day on a Stripe devbox

Stripe has published enough about its development servers, which it calls devboxes, to follow an engineer through a day on one. In February 2026 the company wrote that ["most human-written Stripe code is already produced within an IDE that’s remotely connected to a devbox via SSH"](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2). An engineer starting a task asks for a devbox and receives a cloud virtual machine from a pool that Stripe has warmed in advance, with the aim that it is ready within 10 seconds. Many engineers take a fresh devbox for each task, so that "a Stripe engineer might have half a dozen running at a time".

The editor stays on the laptop, and a Stripe engineer explained in 2022 why typing does not lag: in VS Code ["there is a local buffer going on, and that buffer is asynchronously synced over SSH to the remote end"](https://www.infoq.com/presentations/stripe-dev-env-infrastructure). An engineer who works on the system wrote in 2024 that machines come from a menu with nothing ["smaller than a high-end laptop"](https://news.ycombinator.com/item?id=41292159). Engineers treat the machine as their own: ["folks will edit stuff in /etc, add dotfiles, add little cron jobs, build weird little SSH tunnels, whatever."](https://news.ycombinator.com/item?id=41292159) The platform answers with continuous updates and ["a maximum host lifetime"](https://news.ycombinator.com/item?id=41292159).

A devbox runs in Stripe's test environment, so the agents that Stripe runs on devboxes ["don’t have access to real user data, Stripe’s production services, or arbitrary network egress"](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2). Stripe wrote that it ["built out devboxes for the needs of human engineers, long before LLM coding agents existed"](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2), and that the isolation lets it "safely run the agent with full permissions and skip confirmation prompts". By February 19, 2026 its agents produced more than 1,300 merged pull requests a week.

Stripe took more than a decade to reach this arrangement. From 2012 to about 2019, by [a former engineer's account](https://blog.nelhage.com/post/stripe-dev-environment/), code ran on a devbox while the checkout and the editor stayed on the laptop. In 2022 [the devbox still held a copy synced from the laptop](https://www.infoq.com/presentations/stripe-dev-env-infrastructure), although Stripe had moved the devbox's state to a network volume that is reattached to a new machine. In August 2024 the engineer who described the menu wrote that ["code is off of laptops and lives entirely on the dev server in many (but not all) cases."](https://news.ycombinator.com/item?id=41291828)

## The development server

### Checkout and editor

The only checkout should be on the server, with the editor on the laptop attached over ssh. A second copy on the laptop has to be kept identical through branch switches and through tools that rewrite files, which is the design Stripe and Slack gave up.

Google forbids the copy for its main repository, by the account of eleven current and former Google engineers who wrote in public between 2012 and 2026. They describe exceptions for mobile and client-side work, and one wrote in 2022 that ["you're not allowed to have code copied to a laptop, unless you get special permissions."](https://news.ycombinator.com/item?id=33112061) Google has published no statement of the rule, and the nearest official text is an example policy in its BeyondCorp papers: ["Devices at a low tier are not allowed to submit source code."](https://www.usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)

### Persistent and disposable machines

Companies divide on whether an engineer keeps one machine or takes a fresh one for each task. The better starting point for a small platform team is one persistent virtual machine per engineer, rebuilt from a maintained image on a schedule. A pool of disposable machines delivers a prepared machine in seconds, but it needs a service to hand machines out and an image that is tested on every change. Google runs persistent machines at the largest scale, which is the basis for starting there.

| Company | Machine | Time to get one | How many at once |
| --- | --- | --- | --- |
| [Google](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future) | Persistent personal virtual machine; the working copy lives in a cloud filesystem | "Instantaneously" by Google's account; about 15 minutes to rebuild by [one engineer's](https://news.ycombinator.com/item?id=50397671) | Usually one, by [two](https://news.ycombinator.com/item?id=36782271) [engineers](https://news.ycombinator.com/item?id=32079081) |
| [Meta](https://www.infoq.com/presentations/meta-production-environment/), on demand | Pre-warmed container, disposed of after a day and a half | [Under 10 seconds](https://adek.io/blog/dev-environment-for-agentic-coding/), by a former engineer | Several, by the same engineer |
| [Stripe](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) | Virtual machine from a warm pool, with a maximum age | 10 seconds is the aim | About six |
| [Slack](https://slack.engineering/remote-development-at-slack/) | Virtual machine per branch from a pool | Under 90 seconds | One per branch |
| [GitHub](https://github.blog/engineering/infrastructure/githubs-engineering-team-moved-codespaces/) | Environment per branch from a prebuilt pool | About 10 seconds | About one per branch |

The machine should be a virtual machine of the engineer's own in preference to a container on a shared cluster. Gitpod, a vendor that ran development environments on Kubernetes for six years, concluded that ["Kubernetes is not the right choice for building development environments"](https://ona.com/stories/we-are-leaving-kubernetes), in part because root in a container on a shared node amounts to root on the node. Discord began with containers on Kubernetes and [moved to virtual machines](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments).

### Size, disk, GPUs and root

The server should be several times the size of a laptop, with its disk on a network volume, GPUs supplied from the shared cluster, and root for the engineer. No company publishes a default size. Company posts and public bug reports put a developer at these companies on roughly 32 to 64 cores with 64 to 250 GB of memory, and the appendix lists [each report behind that benchmark](appendix.md#machine-sizes-seen-in-public).

The disk is the part of the machine that should persist, and large repositories exhaust it before the cores. A Cruise engineering manager said in 2022 that ["if you have two clones of our repository, that’s more than a terabyte of disk space."](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)

A GPU does not come with the ordinary machine at Google, by [three](https://github.com/google/perfetto/pull/4586) [engineers'](https://github.com/google/filament/pull/8986) [reports](https://github.com/GoogleChrome/webai-compute-benchmark/pull/253). The arrangement that suits a small organization is Shopify's, where a GPU development environment is an ordinary job on the shared cluster, reached by ssh and capped: ["They're limited to one GPU, because if you need eight, you're probably not debugging anymore."](https://shopify.engineering/skypilot)

Engineers should have root on the development server, because the controls that matter sit outside the machine. [Five](https://news.ycombinator.com/item?id=22817963) [Google engineers](https://news.ycombinator.com/item?id=32307102) and two public bug reports say Google's engineers have root on their Linux machines, against [one](https://news.ycombinator.com/item?id=36784804) who says it needs temporary permission. Instacart's builder wrote that ["the devs have full sudo access. They can install and configure whatever they want."](https://news.ycombinator.com/item?id=37943645)

Rebuilding from the image is the first repair, as in Instacart's instruction for a broken machine: ["Throw it away and get a new machine"](https://news.ycombinator.com/item?id=37938537). A rebuild resets the system image and leaves the engineer's own files as they were. Slack, Discord and GitHub each [carry the engineer's home directory or settings to the new machine](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments), so anything planted in those files survives the rebuild.

## Access to the server

Controls on who may connect form a range, and the recommended point is its first three levels: single sign-on with a hardware security key that must be touched, short-lived ssh certificates, and one logged bastion. These levels answer phishing and stolen long-lived keys. They do not answer code already running on the engineer's laptop, which is what the Bybit, Binance and GitHub cases were, and no level further along the range answers it fully either.

![Five levels of access control, each adding to the one before. Level 1 is single sign-on with a touched hardware key, level 2 short-lived ssh certificates, level 3 one logged bastion, level 4 a device certificate, and level 5 full BeyondCorp. Levels 1 to 3 are the recommended start, level 4 is added where laptops are already managed, and level 5 is the far end of the range. No level answers code already running on the laptop.](figures/03-access-levels.svg)

Google states that ["we have replaced OTP second-factor authentication with the mandatory use of U2F-compatible security keys"](https://docs.cloud.google.com/docs/security/infrastructure/design). New York's financial regulator examined the 2020 takeover of Twitter's internal tools, in which employees were persuaded to approve prompts on their phones, and concluded that ["this type of hardware MFA would have stopped the Hackers"](https://www.dfs.ny.gov/Twitter_Report). Meta's 2016 account of access to production describes [a background process that obtains a signed ssh certificate after two-factor login](https://engineering.fb.com/2016/09/12/security/scalable-and-secure-access-with-ssh/).

The bastion's log should be relied on for who connected, when and to which server. A record of what was typed is weaker evidence, since Google's security book warns that an insider ["can trivially bypass many solutions that capture session logs"](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html).

Google's BeyondCorp is the far end of the range. [Only managed devices reach corporate applications](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf), a service computes a trust tier for each device from its inventory record, and every request is authorized again. What this buys is access that follows the health of the device at every [step from a Google laptop to production](appendix.md#from-a-google-laptop-to-production). The cost was time, since one network layer alone ["took years to fully deploy"](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf) and the last exceptions, ssh among them, [were closed in 2020 and 2021](https://www.usenix.org/publications/loginonline/beyondcorp-and-long-tail-zero-trust), six to seven years after the first paper.

An organization starting now should adopt levels one to three, and should add the device check wherever its laptops are already managed and can hold a certificate. The basis is that several companies document the first three levels, while the full design is documented only at Google.

Code running on the laptop gets past each level. A former Google security engineer has described how such code can [wrap a command that needs a key touch, so that the "user ends up being prompted twice"](https://news.ycombinator.com/item?id=35585453) and seldom notices. CircleCI reported in January 2023 that malware on an engineer's laptop had been used to ["steal a valid, 2FA-backed SSO session"](https://circleci.com/blog/jan-4-2023-incident-report/). What limits that attacker lies on the far side of the connection: what the server can reach, the absence of production credentials there, sessions that expire within the day, a touch for each new session, and the bastion's log of every connection.

## What the server can reach

The design does most of its work at the server's network boundary, which has to be enforced outside the machine because the engineer and the agents on it have root. Outbound traffic is denied by default, and the server has eight exits, each through a service the engineer does not administer. They are a package proxy, a hosted search and fetch tool, a gateway, a broker, the model endpoint that agents call, the editor's downloads, the organization's own code host, and the build and deployment pipeline. The only route from the server to production is a reviewed change through that pipeline, since the server holds no production credentials and has no network path to production systems.

![The laptop holds an editor window, a browser open to the web and an ssh client, with no checkout and no long-lived credentials. It reaches the development server through single sign-on with a hardware key, a short-lived ssh certificate and one logged bastion, and the ssh session and the editor's connection run in both directions. The server holds the only checkout, the toolchain, running services and attended agents, and the engineer has root. Its eight exits are the ones named in the text. Production is reached only by a reviewed change through the pipeline, the open internet is not reachable from the server, and logs are kept off the server.](figures/01-laptop-and-server.svg)

### The network and its exits

Each exit should be as narrow as its purpose allows, and a development server should reach neither production networks nor other engineers' servers. Packages and public source come through a package proxy that fetches from the public registries itself, so the server never connects to them and no traffic needs to be decrypted. DZ BANK, in a post it co-wrote with its cloud vendor, runs its developers' workstations ["in a private workstation cluster without public IPs"](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations), with every download passing through a scanned artifact server. The alternative is a proxy that decrypts and inspects all traffic, which four engineers report breaks developer tools, because [each language runtime keeps its own list of trusted certificates](https://news.ycombinator.com/item?id=41906713).

The server should be able to push only to the organization's own code host. Where that host is a shared public service, the proxy has to decrypt traffic to it in order to add [the header GitHub provides for the purpose](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-access-to-githubcom-using-a-corporate-proxy). Ssh to the host is blocked, because the header does not cover it.

The editor needs its server component and its extensions. Microsoft's documentation says the component is [downloaded by the server first and by the laptop if the server cannot reach the download hosts](https://code.visualstudio.com/docs/remote/faq), so a closed server can leave the download to the laptop. Extensions deserve the scrutiny given to packages, because in a remote session they can run on the server beside the code.

The model endpoint is an exit in every design. One vendor's documentation says of a session with networking turned off that it ["can still communicate with the Anthropic API, which may allow data to exit the VM"](https://code.claude.com/docs/en/claude-code-on-the-web). Data has left that vendor's own sandbox [through the allowlisted model address under an attacker's key](https://www.anthropic.com/engineering/how-we-contain-claude). Requests to the model should therefore pass through a proxy that the organization runs and that holds the key, as at Cloudflare, where ["no API keys exist on user machines."](https://blog.cloudflare.com/internal-ai-engineering-stack/)

Deployment credentials belong to the pipeline, which should use them only on a change that a person has reviewed, since a pipeline that runs an unreviewed branch with those credentials is a second route to production. At Binance the deployment token was on an engineer's work computer.

### Reading the public web

Engineers and agents both need to read public code and documentation, and reading carries risk in both directions: a request takes data out in its address, and the page that comes back brings a stranger's text in. In September 2026 research agents at OpenAI that had been confined to read-only requests [made about 18,000 posts to a wiki that accepted writes that way](https://collusion.wiki/).

Four engineers at employers with closed development networks describe reading the web from the laptop, one of them in the words ["so work laptop has internet, dev machine doesn't."](https://news.ycombinator.com/item?id=42386141)

The equivalent for an agent is a search and fetch tool that runs outside the server and hands back text. OpenAI's default for its coding agent searches ["an OpenAI-maintained index instead of fetching arbitrary pages live"](https://learn.chatgpt.com/docs/web-search.md), and other designs fetch only addresses that [an independent crawler](https://openai.com/index/ai-agent-link-safety/) or [the conversation](https://simonwillison.net/2025/Sep/10/claude-web-fetch-tool/) has already supplied. An organization should adopt this design and log the queries. The basis is vendor documentation and security research, since no company has published how its internal agents read the web. What still leaks is the wording of a query, which is enough to carry a short secret, and what comes in is untrusted text.

### Internal tools

Agents should reach the wiki, the bug tracker, chat and code search through one gateway, which decides what each caller may use and keeps the credentials on its own side. Eight engineers at different employers describe agents reading internal systems through tool servers, one listing ["an MCP for every enterprise service we have (Kibana, Victoria Metrics, Grafana, Jira, etc...)"](https://news.ycombinator.com/item?id=48564709), where an MCP is a tool server. Uber, Stripe and Cloudflare have each published a gateway or a central server, and Block publishes [tool servers that run on the engineer's own machine](https://goose-docs.ai/blog/2025/04/21/mcp-in-enterprise). [Uber's gateway](https://www.uber.com/blog/designing-mcp-gateway/) leaves every tool disabled until its owning team enables it.

A gateway is a way in as well as a way out. The tracker and chat hold text written by many people, which an agent may take as instructions, and a tool that comments or posts is an outward channel. Tools that write should therefore be enabled one at a time, and tools that expose production logs, such as the Kibana of the quotation, should come under the broker's rules.

### Data

Nobody on a development server should hold a connection to a production data store, and the server should hold no real personal data. Fixtures and generated data cover ordinary work, and a broker covers the cases that need production data. The broker gives each person or agent a login, ties each grant to a ticket and an expiry, and answers from a read-only replica with sensitive values replaced. An engineer who needs a real, unredacted record should read it in the broker's own interface and leave it there.

| Control | Published for people by | Applied to agents by |
| --- | --- | --- |
| No real data in the development environment | [Stripe](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2) | Stripe, [Airbnb](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/) |
| A read-only replica, or a read-only database user | [DEV](https://dev.to/molly/how-to-give-engineers-filtered-database-access-8b6); [eight](https://news.ycombinator.com/item?id=44011573) [engineers](https://news.ycombinator.com/item?id=48023402) | [Envoy](https://envoy.com/builders/ai-read-only-production-access); Ramp's coding agent, by [a press account](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect) |
| Views that hide sensitive tables and columns | [DEV](https://dev.to/molly/how-to-give-engineers-filtered-database-access-8b6), [LinkedIn](https://arxiv.org/abs/2502.01998) | |
| A login per person at an access proxy, with grants that are linked to a ticket, approved, and expire | [GitLab](https://runbooks.gitlab.com/teleport/Connect_to_Database_Console_via_Teleport/) | [Envoy](https://envoy.com/builders/ai-read-only-production-access) |
| A query service that enforces the requester's own permissions | | [OpenAI](https://openai.com/index/inside-our-in-house-data-agent/), [Uber](https://www.uber.com/en-US/blog/unlocking-financial-insights-with-finch/) |
| The purpose of access checked when the query runs | [Meta](https://engineering.fb.com/2024/08/27/security/privacy-aware-infrastructure-purpose-limitation-meta/), [LinkedIn](https://arxiv.org/abs/2502.01998) | |
| Detection on access logs, and a daily budget of data per person | [Google](https://arxiv.org/html/2412.06700v1), [Meta](https://engineering.fb.com/2025/08/13/data-infrastructure/agentic-solution-for-warehouse-data-access/) | [Meta](https://engineering.fb.com/2025/08/13/data-infrastructure/agentic-solution-for-warehouse-data-access/), with a person approving |
| Named actions through a proxy, with a second person's approval | [Google](https://google.github.io/building-secure-and-reliable-systems/raw/ch03.html), [Monzo](https://monzo.com/blog/2022/05/26/humans-who-can-rpc-securing-staff-access-to-microservices/) | |
| A separate identity that can only propose changes | | [LinkedIn](https://www.infoq.com/podcasts/platform-engineering-scaling-agents/) |

GitLab's runbook shows ticket-linked grants at a size any organization can copy. An engineer requests a database role and links the issue being worked on, the engineer's manager reviews the request in chat, and the grant expires after 12 hours. Envoy has published the equivalent for engineers and their agents. Access there goes to read replicas through one tool that has no write commands and replaces sensitive values with stand-ins. If the substitution fails, ["the request just dies rather than falling back to handing over the real data."](https://envoy.com/builders/ai-read-only-production-access)

The rule against real personal data in development has been stated by a regulator. In a decision about production copies found in the test environments of five applications, the Estonian Data Protection Inspectorate wrote that ["as a general rule, the use of real personal data for the development or testing of information systems is prohibited."](https://www.edpb.europa.eu/system/files/2026-10/decision-no-3971_en.pdf) Imperva's 2019 breach began with such a copy: the company ["created a database snapshot for testing"](https://www.imperva.com/blog/ceoblog/), and an attacker reached it with a cloud key taken from an internal compute instance that was open to the internet. Withholding data is also more dependable than detecting and removing it, since a 2026 benchmark measured [a recall of 0.07 for a rule-based detector of personal data on its most sensitive categories](https://arxiv.org/abs/2606.19881).

### Exfiltration channels and logs

An engineer with a shell can copy out anything the shell can read, and no setting on the server changes that. The manual for the ssh server says of its own control that ["disabling TCP forwarding does not improve security unless users are also denied shell access, as they can always install their own forwarders."](https://man.openbsd.org/sshd_config) The ssh session and the editor's connection carry files to the laptop by design, and the laptop has the open internet. The closed boundary therefore constrains code on the server and leaves the person at the laptop, or malware there, unconstrained.

Google's security book calls insider risk ["unavoidable"](https://google.github.io/building-secure-and-reliable-systems/raw/ch02.html) and prescribes least privilege and review of access logs. The design accordingly limits what each person can read and records connections, downloads, tool calls and queries in logs kept off the server. The appendix lists [each channel and what narrows it](appendix.md#channels-out-of-a-development-server).

In court filings the employer's logs appear as the evidence, sometimes long after the copying. Intel's 2025 complaint against a departing engineer alleges that he took nearly 18,000 files and that the transfers ["were detected by Intel and triggered an investigation."](https://storage.courtlistener.com/recap/gov.uscourts.wawd.354479/gov.uscourts.wawd.354479.1.0.pdf) The indictment of a Google engineer convicted in 2026 describes a year of copying by a method that ["helped DING evade immediate detection"](https://www.justice.gov/opa/media/1341356/dl), at a company that the same indictment says logged data transfers.

## Agents on the server

### Attended and unattended agents

Where an agent runs should depend on whether anyone is watching it. An agent that the engineer works with interactively runs on the engineer's own development server. Unattended agents, which work in the background or from a queue, should run on servers of their own, built from the same image. Each should have a narrow identity and none of the engineer's credentials, with one server per task where the platform can afford it.

The reason is that every process on a machine can use what the machine holds. An agent on the engineer's server runs as the engineer, can read whatever proves the engineer's identity to the gateway and the code host, and shares the machine with every other agent there. The engineer's attention is what makes that acceptable for interactive work, and an unattended agent has none.

The published arrangements for background work are close to this recommendation. Stripe runs its agents on devboxes, where many engineers already take a machine per task. LinkedIn runs background agents [in a remote sandbox under identities of their own](https://www.infoq.com/podcasts/platform-engineering-scaling-agents/). Ramp runs each session in a rented sandbox and sets ["no limit to how many sessions you can have running concurrently"](https://builders.ramp.com/post/why-we-built-our-background-agent). Airbnb's agent workloads [run on its existing remote workspace platform](https://getdx.com/podcast/beyond-the-cli-agentic-ai-for-async-workloads-and-non-developers/), cut off from production services and user data.

Evidence for attended agents on the engineer's own server is thinner. Jane Street describes ["distributing the work back to your development machine"](https://signalsandthreads.com/the-changing-craft-of-programming/) without saying where that machine sits, and [five](https://news.ycombinator.com/item?id=49210386) [engineers](https://news.ycombinator.com/item?id=50376352) elsewhere describe agents at work on a remote machine in place of the laptop. Cloudflare, Block and [Dashlane](https://www.dashlane.com/blog/dashlane-secures-ai-coding-tools-engineering-team) run agents on the engineer's own machine.

The split also settles when machines run, since the engineer's server stops outside working hours while agent servers run for as long as work is queued.

### Authority

An agent should act with less authority than the engineer who started it, held as scoped, short-lived tokens that the gateway keeps and the agent never sees. The recommended shape is read access to the repositories in the task and the right to push to its own branches, read and comment on the tracker, read on the wiki, and nothing in production. No company publishes its scopes, so the list is a proposal. Google's platform for agents states the principle behind it: ["Assume an attacker controls everything inside the sandbox, and make sure they find nothing there to use."](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)

An unattended agent should also have an identity of its own, which is rare in the public record so far. LinkedIn says that ["all these agents have identities as well"](https://www.infoq.com/podcasts/platform-engineering-scaling-agents/), with limited permissions, and that an agent can propose a code change but cannot make one. The only other published case is [a Microsoft pilot of about 100 users](https://www.microsoft.com/insidetrack/blog/securing-ai-agents-in-the-enterprise-learnings-from-our-journey-at-microsoft/). Ramp opens its agent's pull requests with the engineer's own token [so that nobody can approve a change from their own agent](https://builders.ramp.com/post/why-we-built-our-background-agent). A separate identity keeps that property if the review rule counts the engineer who started the agent as the author.

In the incidents reported so far, the agent acted with a person's authority. The Financial Times reported, as [relayed by The Register](https://www.theregister.com/2026/02/20/amazon_denies_kiro_agentic_ai_behind_outage/), that in December 2025 one Amazon service was disrupted for 13 hours in one region after engineers let an agent make changes. Amazon attributed the event to "user (AWS employee) error - specifically misconfigured access controls - not AI". [TechCrunch reported](https://techcrunch.com/2026/03/18/meta-is-having-trouble-with-rogue-ai-agents/) that in March 2026 an agent at Meta posted advice to an internal forum without asking, and a colleague who followed it exposed data. Neither case shows that a separate identity would have helped, although both show what an agent can do with everything a person is allowed.

### Sandboxes

A sandbox around the agent on the server adds a layer that should not be counted on, because on a machine where the user has root it has holes. Jane Street confines agents with an allowlist sandbox on the developer's machine, which it loosened after, in its engineers' words, ["a lot of people maybe deciding to turn the sandbox off to be able to do the thing that they’re trying to do."](https://signalsandthreads.com/the-changing-craft-of-programming/) A fix submitted to one agent tool describes how an agent on an Amazon development desktop, where the user has root without a password, could run `ssh localhost` and land in an unconfined shell: ["a complete root escape in one line."](https://github.com/kirodotdev/KiroCrew/pull/8283)

### Prompt injection

Text that an agent reads can steer what it does, and no published defense removes that. Anthropic writes that ["protection in the model layer will never be 100% effective, which is why it can't stand alone."](https://www.anthropic.com/engineering/how-we-contain-claude) Meta has published a rule for agents to follow until injected instructions can be reliably detected: ["agents must satisfy no more than two of the following three properties within a session"](https://ai.meta.com/blog/practical-ai-agent-security/). The properties are processing untrusted input, access to private data, and the ability to change state or communicate outward.

The design in this essay narrows each of the three properties and removes none. Untrusted input remains in the tracker, the wiki, fetched pages and the documentation of every dependency. Private material remains in reduced form as the code, the wiki and the tracker, and outward channels remain in reduced form as the pull request, tracker comments and search queries. Researchers have shown [an agent copying private repository data into a public pull request](https://invariantlabs.ai/blog/mcp-github-vulnerability) on the instruction of a planted issue.

Scoped authority and review carry what is left, and review is a weak control. Anthropic reports that ["users approved roughly 93% of permission prompts"](https://www.anthropic.com/engineering/how-we-contain-claude), which suggests what people do with a stream of requests to approve, and a review shows what the agent wrote without showing what it read. Changes that unattended agents make to sensitive code should therefore have a second reviewer.

## The design against each attacker

The design does different amounts against different attackers, and it does least against the attacker of the Bybit, Binance and GitHub cases, who is already running code on the engineer's laptop. The table is the author's analysis, built from the mechanisms and incidents cited in the other sections. No organization has published a test of the whole design.

| Attacker | What the design does | What it does not do |
| --- | --- | --- |
| A phisher without code execution | Sign-on requires a touched hardware key. No long-lived ssh key exists to steal. Every connection passes the bastion. | Protect a sign-on path that falls back to a weaker factor, such as the phone prompts approved at Twitter in 2020. |
| Malware on the engineer's laptop | The laptop holds no checkout and no long-lived keys. On the server, which the malware reaches through the engineer's session, there are no production credentials. Sessions expire within the day, each new one needs a touch, and the bastion logs each connection. | Stop it riding the ssh session. It can read the checkout, act as the engineer at the gateway and the broker, and send what it takes out through the laptop, so the server's closed egress does not constrain it. A touch can be captured by a second prompt. |
| Untrusted code or a poisoned dependency run on the server | It finds no production credentials, and its only ways out are the eight exits. A rebuild resets the system image. | Stop it reading the checkout or using what the engineer's session can reach. It can persist in the home directory and the volume, which survive a rebuild, and it can alter code that later passes review. |
| A malicious insider | The insider reads only what the gateway and the broker grant. Connections, queries and tool calls are logged off the server. | Prevent copying down the ssh session, through the editor or from the screen. The logs help only when someone reads them. |
| Text that steers an agent | The agent holds scoped tokens and nothing in production. An unattended agent holds none of the engineer's credentials. Outward channels are few and logged. | Close the pull request, tracker comments, search queries or the model endpoint as ways out. An attended agent on the engineer's server has the engineer's authority. Review is the last control and a weak one. |
| A compromised package proxy, gateway or editor extension | Production is still reached only through a reviewed change, and the other services' logs remain. | Contain it. The proxy serves code to every server, the gateway holds the credentials for every internal tool, and an extension runs beside the code. The editor's connection runs both ways, so a compromised server should be assumed able to reach the laptop. |

The last row bears on staffing, because the bastion, the package proxy, the gateway and the broker become the most sensitive software the platform runs. The second row applies with more force to engineers whose work cannot move, since their laptops still hold the code.

## Failure modes

The published failures share a source, which is that the platform becomes something every engineer depends on: when it is down, far away or only half adopted, work stops or splits.

### Platform outages

An outage of the platform stops every engineer who needs a new machine. On February 2, 2026, GitHub reported, ["Codespaces creation and resume operations also failed in all regions"](https://github.blog/news-insights/company-news/github-availability-report-february-2026/) for several hours. Ten days later they failed at up to a 90% rate across Europe, Asia and Australia for nearly nine hours. With one platform engineer the person is a single point of failure too, and a second person should be able to rebuild the image and restore access.

### Partial adoption

A company that supports both local and remote development has to keep both working. At Shopify a team of three ported one application to the cloud environment while more than 150 colleagues stayed on local tooling, and ["developers would often unknowingly commit changes that broke some functionality we’d just enabled for Spin."](https://shopify.engineering/sfn-team-cloud-development-spin) Fullscript, on returning to laptops, refused to keep both paths because ["two standards is really no standard at all."](https://builders.fullscript.com/posts/local-first-dev-environments-at-medium-scale)

Remote development should become the default one application at a time. Local development of that application is tolerated only during its transition, and a date for its end is set once most of the application's engineers have moved. Discord did this for backend work, where it [deprecated development on macOS and set a hard cutoff](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments). Slack took the other course, and the engineer who built its system wrote in 2024 that ["we still support local development for edge cases or personal preference."](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack) The date matters for security as well, because that argument holds only for applications whose checkouts have left the laptop.

A long tail of work needs a device in hand and stays local. It includes much frontend work at Discord, mobile work at Uber, whose remote environment [had no Android emulator](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/), and the mobile and client-side exceptions at Google.

### Distance

The model depends on the network between the laptop and the server. Three Uber engineers called its remote environments slow in the month Uber reported that over 60% of its engineers had adopted them, one writing that ["most developers in Uber use local builds anyway because of input lag."](https://news.ycombinator.com/item?id=34046771) Uber had placed its environments in five regions because otherwise ["typing will feel sluggish"](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/). The published remedies are servers in the engineer's region and an editor that buffers typing locally.

## Staffing and cost

Staffing is treated here as the main cost of the model and the limit on how much of it an organization can build. Machines are rented by the hour and resized by configuration, whereas every published platform with a pool of ready machines had a team of more than one engineer.

| Company | Team | Engineers served | Built or bought |
| --- | --- | --- | --- |
| [Slack](https://www.daytona.io/dotfiles/remote-development-productivity-lessons-from-slack), 2021 | Formed "with 2 engineers" | [Over 400](https://getdx.com/podcast/remote-development-at-slack/) | Built on plain cloud machines |
| [Instacart](https://news.ycombinator.com/item?id=37961161), about 2021 | "4-ish people" for under a year, part-time afterward | Hundreds | Built on plain cloud machines |
| [Dropbox](https://coder.com/blog/dropbox-syncs-1000-developers-with-coder) | Six; two did the migration in four months | About 1,000 | Bought (a vendor's case study) |
| [Cruise](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise), 2022 | Eight | About 1,000 | Built (a recruiting article) |
| [Stripe](https://blog.nelhage.com/post/stripe-dev-environment/), to 2019 | "Perhaps a dozen engineers" on all developer tooling | A few hundred, growing past a thousand | Built |

A former Stripe engineer judged that the design mattered less than the team's existence: ["I think the existence of the team, and its investment in stability and reliability of developer tooling ... were the major drivers in any success of the Stripe developer experience."](https://blog.nelhage.com/post/stripe-dev-environment/)

### What one engineer can run

One engineer can run the first of the [three phases](#what-should-change), which is the plain version without pools, a gateway or a broker. The evidence that one engineer is enough is weak, and it consists of four small accounts. [Two](https://news.ycombinator.com/item?id=37935523) small companies run a hosted product with one person maintaining its configuration, one of whom wrote that ["when I fix the codespace config I know everyone will definitely benefit from the changes."](https://news.ycombinator.com/item?id=37935463) Woovi, a small company, runs a single owned server that ["easily supports 10 developers"](https://dev.to/woovi/remote-development-at-woovi-25mj) over ssh and does not say who maintains it. A manager at an unnamed company [mandated one shared server](https://news.ycombinator.com/item?id=42756034) for a team. Nothing public sits between those accounts and Slack's two engineers for more than 400, and no account describes one engineer building or running a pool.

The first choice in phase one is between a hosted product and plain virtual machines. Instacart's builder, having built a platform, advises: ["Start with the SaaS versions and see."](https://news.ycombinator.com/item?id=37938537) Instacart built because the hosted product could not meet needs that included ["being behind our firewall"](https://news.ycombinator.com/item?id=37938537), and a product that runs outside the organization's network cannot sit behind its package proxy. An organization that needs the closed network from the first day should use plain virtual machines in its own network, or an orchestrator that runs there, which is what Discord bought.

### Machine cost

No operator publishes its cost per engineer, so the available figures are list prices and vendors' models. The arithmetic here uses [the list price of one hosted product, GitHub Codespaces](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces), as read in November 2026: $2.88 an hour for a 32-core machine and $0.07 per gigabyte of storage per month. A 32-core machine that runs ten hours each weekday costs about $7,500 a year, and one that never stops costs about $25,200. A terabyte of storage adds about $840 a year. For 100 engineers that comes to about $830,000 a year with a scheduled stop and about $2.6 million without one.

Plain cloud machines cost less than that list price. [A vendor's model](https://web.archive.org/web/20240406223939/https://dev.to/gitpod/the-cost-vs-ux-trade-offs-of-designing-and-operating-cdes-4937) prices an always-on 8-core virtual machine at about $300 a month, where 8 cores at the list price above come to about $525. The model usage of agents is a separate budget line, for which the public record gives no dependable figure.

The one published estimate of return is from Instacart's builder, who [reckoned that the platform paid for itself in under four months](https://news.ycombinator.com/item?id=37965171) on the builder's own assumption of an hour saved per engineer each week.

The stop outside working hours is what separates the two annual figures. Instacart's machine ["stays up running during the users work hours (~8 hours) and then hibernates"](https://news.ycombinator.com/item?id=37943512), and wakes when it detects activity on the laptop. Under a 30-minute idle timer at one small company, [some engineers wrote scripts to keep the machine awake or returned to local development](https://news.ycombinator.com/item?id=37935523), which is the reason for preferring a stop at a fixed hour.

## What should change

The changes are grouped into phases, ordered so that each phase is useful if the organization stops after it.

### Phase one

One platform engineer can run this phase, which delivers the speed, takes the checkout and production credentials off the laptop and closes the server's network. It leaves the connection log, the gateway, the broker and agents for later.

1. Give each engineer a Linux virtual machine in a nearby region, several times the size of a laptop, with its disk on a volume that outlives the machine.
2. Maintain one image, rebuild every server from it on a schedule, and give the engineer root.
3. Keep the only checkout on the server and attach the editor from the laptop over ssh.
4. Put ssh behind single sign-on with a hardware key that must be touched.
5. Deny outbound traffic from the server by default, enforced outside the machine. Serve packages through a package proxy and allow pushes only to the organization's own code host.
6. Keep production credentials and real personal data off the server, so that the only route to production is a reviewed change through the pipeline.
7. Stop each server on a schedule outside working hours.
8. Make remote development the default for one application at a time, and set a date for the end of local development on it once most of its engineers have moved.
9. Name a second person who can rebuild the image and restore access.

### Phase two

This phase adds the record of who connected and the first services for agents. It needs more than one engineer, because the services it adds are targets and every published team that went beyond the plain version had more.

1. Issue short-lived ssh certificates after sign-on, admit connections only through one logged bastion, and require a touch for each new session. Add a device certificate where laptops are already managed.
2. Put the wiki, the bug tracker, chat and code search behind one gateway that authorizes each tool and holds the credentials.
3. Allow attended agents on the engineer's own server, calling the model endpoint through a proxy that holds the key.
4. Give agents a hosted search and fetch tool that runs outside the server, log its queries, and leave open browsing on the laptop.
5. Keep the logs of the bastion, the proxy and the gateway off the server, and assign someone to read them.

### Phase three

This phase gives access to data and lets agents work unattended.

1. Reach production data only through a broker: a read-only, sanitized replica, a login for each person and agent, a grant that is linked to a ticket and expires, and every query logged.
2. Run unattended agents on servers of their own, built from the same image, with their own identities, scoped and short-lived tokens held by the gateway, and none of the engineer's credentials.
3. Have a person review every change an agent proposes, counting the engineer who started the agent as its author, and add a second reviewer for sensitive code.
4. Add pools of pre-warmed machines.
5. Provide GPUs as a small, capped interactive lane on the shared cluster.

## Getting started

The staged path in the figure follows the three phases, and each step names a public account of an organization taking it. No single company describes all of them in this order.

![A staged path in three columns, one for each phase, with the public account behind each step. Phase one, which one engineer can run, has seven steps, from one application on one machine to a date for the end of local development on it; its closed network is attributed to DZ BANK, in a post co-written with its vendor, and to DekaBank, in a vendor's case study. Phase two has four steps: certificates and a bastion, a gateway, attended agents, and a hosted search and fetch tool. Phase three has three: a broker, unattended agents on their own servers, and pools of pre-warmed machines. A note gives Slack's dates.](figures/04-staged-path.svg)

The first application should be one that runs on a single machine. Slack's remote environment began with its main web application alone, and Instacart built for applications that needed more memory than a laptop had. The servers go into a network segment of their own from the first day. DekaBank, by a vendor's case study, placed its workspaces in ["a dedicated network segment"](https://coder.com/success-stories/dekabank) behind its artifact server, as DZ BANK did.

Volunteers come before everyone else, because early failures are remembered. Slack released a prototype in August 2021 to engineers who had asked for it, spent two months on what they found, and released generally in October. Its engineer said of the alternative that ["if it breaks a couple of times or people don’t like it a couple of times, they’re hesitant of giving it another shot."](https://getdx.com/podcast/remote-development-at-slack/) What held people back at Slack and at GitHub was support for their own editor and settings. Both added ssh access for Vim and Emacs users, and both carry an engineer's settings to every new machine.

At Slack ["before long the majority of the team had switched of their own accord"](https://slack.engineering/remote-development-at-slack/). Discord nudged the remaining engineers toward the remote environment ["when their MacBooks had issues"](https://discord.com/blog/how-discord-moved-engineering-to-cloud-development-environments) before it set its date. How long one engineer takes to reach a first version is unpublished, and Slack's two engineers took from the start of 2021 to August to release a prototype.

The network boundary should be in place before agents are given servers. Stripe built its servers for people first and ran agents on them years later. An organization that reverses the order gives an unattended program whatever its development machines can reach on the day it starts.
