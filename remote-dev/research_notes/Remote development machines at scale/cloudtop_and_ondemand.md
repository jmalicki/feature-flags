# Google Cloudtop and Meta OnDemand / devservers: second pass (26 Nov 2026)

This pass adds to `google_and_meta.md` and does not repeat it. Read tags:

- **[PDF read directly]**: I read the paper's pages myself; quotes are exact.
- **[raw API text]**: comment or issue text pulled as raw JSON from the Hacker News (Algolia) API or the GitHub API and read directly. Quotes are exact apart from stripped HTML. No extraction model was involved.
- **[fetched]**: full page fetched through a summarising fetch tool. Quoted strings are as that tool returned them, often cut to short fragments, and must be re-checked against the page before printing.
- **[snippet]**: search-result summary only; page not opened or returned 403.
- Source type is given per finding: **official**, **named ex-employee**, **anonymous commenter** (HN handles; employment is self-claimed and unverified), **public artefact** (a GitHub issue filed from a company machine), **press**, **secondary**.

Headline on coverage: neither company publishes machine shapes, quotas, root policy, or where agents run. Almost everything below on those points is commenter testimony or inferred from public artefacts. "Not found" means I searched and found no source.

One correction to the first pass: it describes HN user shaftway as an ex-Googler who moved to Meta in 2022. In a comment of 25 Jun 2026 the same handle writes "I'm also currently at Google" [raw API text], and on 6 Nov 2026 describes using a Cloudtop. Treat that handle's employer as unclear.

---

## Part A. Google Cloudtop

### A1. Machine shapes, bigger machines, GPUs, where ML development happens

#### Takeaway

Not found: any core, RAM or disk figure for a standard or large Cloudtop, the approval path for a bigger one, or whether a Cloudtop can carry a GPU or TPU. The only public facts remain the first pass's (E2 and N2/N2D families, caps, resize by reboot).

#### Cited Findings

- An anonymous commenter describes the user-visible benefit as "More compute (I can attach more CPU + more RAM flexibly)" (aleksiy123, self-described Googler, 6 Oct 2022). [raw API text] (anonymous commenter) — [HN 33109828](https://news.ycombinator.com/item?id=33109828)
- A commenter who developed on a cloud VM "for the last few years" calls it "a highly capable machine with large L2/L3 cache, a lot of RAM, many CPUs" and says Chrome Remote Desktop is "generally an order of magnitude better" than Citrix (leoh, 6 Oct 2022; employer not stated in the comment). [raw API text] (anonymous commenter) — [HN 33109372](https://news.ycombinator.com/item?id=33109372)
- Physical workstations needed GPUs in at least some roles: when Google evaluated ChromeOS as a workstation OS, one blocker was that "A bunch of people needed to do work that required more direct GPU access (either very resource intensive rendering, or GPU-offloaded ML models and the like), which meant gLinux would have to be supported anyway" (mjg59, Matthew Garrett, named ex-Google security engineer, 13 Jul 2022; he says this was "a few years back"). [raw API text] (named ex-employee) — [HN 32079969](https://news.ycombinator.com/item?id=32079969)
- Purchases above a threshold need senior sign-off in general: "employees will need director "or above" approval if they need an accessory that costs more than $1,000 and isn't available internally" (CNBC, Jennifer Elias, 3 Apr 2023, from internal documents). This is about accessories, not Cloudtop sizes. [fetched] (press) — [CNBC 2023-04-03](https://www.cnbc.com/2023/04/03/google-to-cut-down-on-employee-laptops-services-and-staplers-to-save.html)

#### Inferences

- The silence on shapes is itself informative: with Blaze/Forge doing the heavy work (A2), engineers discussing Cloudtop in public talk about latency and lock-down, almost never about cores.

#### Gaps

- Not found: standard/large shapes, the request and approval process, GPUs or TPUs on Cloudtop, and where interactive ML work runs (internal Colab, notebooks, Borg). The first pass's Chen Zhe line that TPU code "has to be run remotely" is still the only data point.

### A2. Disk, home directory, what survives a rebuild, where build outputs go

#### Takeaway

The working copy and build outputs both live off the machine: source in Piper/CitC, build outputs in ObjFS (Bigtable-backed, mounted through FUSE), builds on Forge. What sits on a Cloudtop's own disk is therefore mostly personal state. Disk sizes and home-directory backup policy were not found.

#### Cited Findings

- "Google's remote cache is called ObjFS." It "consists of a backend that stores build outputs in Bigtables distributed throughout our fleet of production machines"; a FUSE daemon "allows engineers to browse build outputs as if they were normal files stored on the workstation"; "Google's remote execution system is called Forge."; "Since 2008, Google has been using a distributed build system that employs both remote caching and remote execution" (Software Engineering at Google, ch. 18, 2020). [fetched] (official, book) — [SWE book ch. 18](https://abseil.io/resources/swe-book/html/ch18.html)
- Version-control chapter: "centrality and in-the-cloud storage for the codebase seem to be critical to scaling"; "The only need for locality for most files occurs when building"; creating a new client at trunk and committing takes "perhaps 15 seconds total". The chapter does not name CitC. (Software Engineering at Google, ch. 16, 2020.) [fetched] (official, book) — [SWE book ch. 16](https://abseil.io/resources/swe-book/html/ch16.html)
- Workspace follows the engineer between machines: "With CitC, I can build/write code from my work machine at the office and then go home and gmosh into a cloudtop that uses the same network mounted filesystem." (cbHXBY1D, 6 Oct 2022). [raw API text] (anonymous commenter) — [HN 33112696](https://news.ycombinator.com/item?id=33112696)
- "You have root directory /google/ and magic happens there. Look up articles about srcfs, objfs, piper, forge." and "When I compile at Google even using local build everything just works." (galkk, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36781550](https://news.ycombinator.com/item?id=36781550)
- "Google engineers weren't doing local builds anyway (unless they intentionally inflicted those upon themselves) because of Forge. The Forge builders already had 10000 CPU cores in 2010" (jeffbee, self-described ex-Googler, 19 Dec 2022, citing a talk video). [raw API text] (anonymous commenter) — [HN 34047296](https://news.ycombinator.com/item?id=34047296)
- Rebuild experience for non-google3 work: "I can provision a new cloudtop and download a clean copy of my repo in around an hour"; "It would take about 15 minutes to de-provision the old cloudtop and provision a new one. After that I'd kick off 45 minutes of git cloning"; "I've had to do this twice, but neither time was due to AI, both were due to bad updates my cloudtops got." (shaftway, 6 Nov 2026; the git cloning shows this is a Git-hosted project, not google3.) [raw API text] (anonymous commenter) — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- If you break the OS install, "IT will offer to reimage your machine and you'll be responsible for making sure you correctly managed your bac[kups]" (vlovich123, 1 Aug 2022; comment truncated in my read). [raw API text] (anonymous commenter) — [HN 32306192](https://news.ycombinator.com/item?id=32306192)

#### Inferences

- For google3 work a destroyed Cloudtop costs dotfiles and local tooling, not code or build cache. For Git-hosted Google projects (Android, Chrome, some Cloud work) the Cloudtop behaves like any cloud VM and a rebuild costs about an hour of cloning.
- "Bad updates" forcing two rebuilds is the first complaint I found that ties Cloudtop loss to the weekly gLinux release train (A3).

#### Gaps

- Not found: local disk size, whether the home directory is network-mounted or backed up, disk-full complaints.

### A3. Root, installs, lock-down, patch cadence, idle reclamation

#### Takeaway

Engineers have historically had root on gLinux machines, attested by several commenters across 2022 to 2023, with defensive scripts and audit systems undoing or flagging some changes. Local virtual machines were not allowed. In July 2023 Google piloted desktops with no internet and, for some participants, no root. gLinux ships weekly with a 1% canary held for a couple of days.

#### Cited Findings

- Root, by testimony: "I have root on my Google machine right this second." (compiler-guy, 1 Aug 2022) — [HN 32308955](https://news.ycombinator.com/item?id=32308955). "Engineers always had root on their desktop and laptops." (lokar, 19 Jul 2023) — [HN 36781018](https://news.ycombinator.com/item?id=36781018). "You have root and can run anything you want*, but you have to go out of your way to configure anything differently than others" (mattnewton, 1 Aug 2022) — [HN 32307102](https://news.ycombinator.com/item?id=32307102). "It depends on your role, but many roles have root on their machines. You can of course do just about anything from there, however some things may get undone by periodic scripts if they're defensive" (raggi, 1 Aug 2022) — [HN 32308684](https://news.ycombinator.com/item?id=32308684). All [raw API text] (anonymous commenters).
- Contradicting testimony: "Xoogler here. You have to get permission to get root access and it's only temporary." (footlose_3815, 19 Jul 2023; role and period not stated). [raw API text] (anonymous commenter) — [HN 36784804](https://news.ycombinator.com/item?id=36784804)
- Binary allow-listing: "a tool called "Santa" keeps a naughty and nice list of runnable programs but all it took to get a program added to the nice list is any other googler vouching for it in an automated web tool." (mattnewton, 1 Aug 2022. Santa is Google's open-source macOS allow-listing tool; the commenter does not say which OS he means.) [raw API text] — [HN 32307102](https://news.ycombinator.com/item?id=32307102)
- Auditing: "I once received outreach because a service I had started on the machine had retained an outgoing port to a third party service provider for an extended period of time." (raggi, 1 Aug 2022). [raw API text] — [HN 32308684](https://news.ycombinator.com/item?id=32308684)
- No local VMs: "Googlers by default, though, aren't allowed to run vms (VMware/virtualbox style) on their desktops/workstations." and "Think about cloudtop as about just box where you ssh." (galkk, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36781022](https://news.ycombinator.com/item?id=36781022), [HN 36781488](https://news.ycombinator.com/item?id=36781488)
- 2023 pilot: "Google on Wednesday is starting a new pilot program where some employees will be restricted to internet-free desktop PCs"; "The company originally selected more than 2,500 employees to participate"; "some employees will have no root access, meaning they won't be able to run administrative commands"; "Some workers who need the internet to do their job will get exceptions"; reason given in internal materials: "Googlers are frequent targets of attacks" (CNBC, Jennifer Elias, 18 Jul 2023). [fetched] (press, from internal materials) — [CNBC 2023-07-18](https://www.cnbc.com/2023/07/18/google-restricting-internet-access-to-some-employees-for-security.html)
- An HN quotation of the same CNBC article adds that internet is disabled "with the exception of internal web-based tools and Google-owned websites like Google Drive and Gmail". [raw API text of a comment quoting the article] — [HN 36825184](https://news.ycombinator.com/item?id=36825184)
- Reaction from a self-described Cloudtop-only engineer: "A huge number of people now do most of their dev work on cloud machines. I'm one of them. I don't even have a workstation anymore. Just ssh into the cloud box to build and run code. Eliminating general access to the internet on my cloud machine wouldn't affect me at all." (UncleMeat, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36781258](https://news.ycombinator.com/item?id=36781258)
- gLinux Rodete: "we designed gLinux Rodete (Rolling Debian Testing)"; "weekly releases were a sweet spot between moving quickly and allowing for proper release qualification"; each release goes to "a dedicated testing fleet and a 1% fleet wide canary. The canary is held intentionally over the course of a couple days"; the corporate fleet is "hundreds of thousands of devices across multiple platforms"; the Goobuntu-era fleet was "over 100.000 devices"; in that era upgrade enforcement used "nagging messages on their UI, mails, scheduled reboots and even shutting down the machines" (Kordian Bruck and Margarita Manterola, Google, 12 Jul 2022). The post does not mention root, reboots under Rodete, or cloud VMs. [fetched] (official) — [Google Cloud blog 2022-07-12](https://cloud.google.com/blog/topics/developers-practitioners/how-google-got-to-rolling-linux-releases-for-desktops)
- "there's not much difference between Google's gLinux and Debian testing. Notably, our security, provisioning, and tooling is installed, and that's about it." (qmarchi, self-described Googler "not in CorpEng", 13 Jul 2022). [raw API text] (anonymous commenter) — [HN 32078722](https://news.ycombinator.com/item?id=32078722)
- A security engineer's view of the gap: on Linux there is "no boundary between user and root, everything can trivially escalate privs"; "Linux laptops have had one foot in the grave for a while now"; "Google historically made gLinux work only with enormous investments in customised distros and D&R." (bjackman, says he "worked at Google on post-Aurora endpoints security", 8 Jun 2026). [raw API text] (anonymous commenter) — [HN 48448278](https://news.ycombinator.com/item?id=48448278)

#### Inferences

- Google's control model for dev machines has been detect-and-revert plus device trust tiers, not denial of root. The 2023 pilot is the first public sign of a move toward removing root for some populations.
- The "permission, and only temporary" testimony may describe a specific role or the post-pilot population; I cannot reconcile it with the others from the sources.

#### Gaps

- Not found: apt or Docker policy on Cloudtop, reboot or patch deadlines under Rodete, idle-instance expiry or reclamation (the 2018 paper only proposed asking owners of idle machines to delete them). No DebConf talk on gLinux surfaced in two searches.

### A4. How many, and the Cloudtop / workstation / laptop mix over time

#### Takeaway

The stable pattern is two machines: a laptop of the engineer's choice plus one Linux machine (desk workstation or Cloudtop) that holds google3 access. In April 2023 Google made Cloudtop "the default desktop" as a cost measure. Shares after the 2018 "over one-fourth" and 2022 "most" figures were not found.

#### Cited Findings

- "folks usually get 2 machines: a laptop you pick the OS and the workstation (or cloudtop) which is Linux unless there's a special need like chrome eng. Lots of folks do stuff like use Chrome OS + cider + cloudtop though." (esprehn, 13 Jul 2022). [raw API text] (anonymous commenter) — [HN 32079081](https://news.ycombinator.com/item?id=32079081)
- "Every Software role employee at Google has two computers, a laptop and a cloudtop." (amf12, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36782271](https://news.ycombinator.com/item?id=36782271)
- Holding both kinds at once: "Googler that has a gLinux Desktop, a gLinux Cloud VM, and a macOS laptop." (qmarchi, 13 Jul 2022) — [HN 32078696](https://news.ycombinator.com/item?id=32078696). "Currently running gLinux on the workstation and cloudtop." (vinkelhake, 13 Jul 2022) — [HN 32079463](https://news.ycombinator.com/item?id=32079463). Plural "my cloudtops" (shaftway, 6 Nov 2026) — [HN 50397671](https://news.ycombinator.com/item?id=50397671). All [raw API text] (anonymous commenters).
- April 2023 cost memo: CloudTop "will be "the default desktop" for Googlers"; "Google is pausing refreshes for laptops, desktop PCs and monitors"; "Google employees who are not in engineering roles but require a new laptop will receive a Chromebook by default"; the stated security reason for Chromebooks is that it "provides the best opportunity across all of our managed devices to prevent external compromise"; Cloud employees and partners "are expected to transition to relying on CloudTop for their workstations" (CNBC, Jennifer Elias, 3 Apr 2023). [fetched] (press, from internal documents) — [CNBC 2023-04-03](https://www.cnbc.com/2023/04/03/google-to-cut-down-on-employee-laptops-services-and-staplers-to-save.html)
- Desk-sharing context (Feb 2023), as quoted by a commenter from the Ars Technica article: "Google has an internal-only virtual desktop tool for thin clients called "CloudTop" that it would like employees to transition to". Ars Technica itself could not be fetched. [raw API text of a comment quoting the article] (press, second-hand) — [HN 34933249](https://news.ycombinator.com/item?id=34933249)
- ChromeOS as the only client: "more and more engineers these days are able to do 100% of their job on a ChromeOS machine, including dealing with google3 stuff" (Morgawr, self-described Googler and ChromeOS engineer, 13 Jul 2022). [raw API text] (anonymous commenter) — [HN 32080005](https://news.ycombinator.com/item?id=32080005)
- Historically gLinux machines "were, traditionally, the only devices that had access to the main source repository" (mjg59, 13 Jul 2022). [raw API text] (named ex-employee) — [HN 32079962](https://news.ycombinator.com/item?id=32079962)

#### Inferences

- The shift to Cloudtop after 2023 was driven by cost and desk sharing (no fixed desk means no machine under it), on top of the earlier operational case. Security is given as the reason for Chromebooks, not for Cloudtop.

#### Gaps

- Not found: a per-engineer Cloudtop quota, or any share figure after Dec 2022.

### A5. Connection: SSH, remote desktop, device certificates, latency

#### Takeaway

SSH to corp machines is tunnelled through the BeyondCorp Access Proxy with a ProxyCommand helper that wraps bytes in WebSockets; device identity comes from an X.509 machine certificate at the TLS layer, user identity from SSH certificates. Chrome Remote Desktop is the standard remote-desktop tool. By testimony most engineers use SSH plus a remote editor and rarely the GUI.

#### Cited Findings

- "Wrapping SSH traffic in HTTP over TLS is easy thanks to the existing ProxyCommand facility. We developed a local proxy which looks a lot like Corkscrew, except the bytes are wrapped into WebSockets." (Cittadini, Spear, Beyer, Saltonstall, ;login: Winter 2016.) [PDF read directly] (official) — [BeyondCorp Part III: The Access Proxy](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- "Desktops and laptops use an X.509 machine certificate and a corresponding private key stored in the system certificate store."; "the client and server can use SSH certificates to perform user authentication, but SSH doesn't natively support device authentication"; "While we use the TLS client certificate to authenticate the device, we might use the username and password to authenticate the user." [PDF read directly] (official) — [BeyondCorp Part III](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- "Chrome Remote Desktop, which is publicly available in the Chrome code base [5], is the predominant remote desktop solution at Google."; remote-desktop protocols "are especially sensitive to the additional latency imposed by being routed through the AP", so only session authorisation goes through the proxy: "the extra latency of going through the AP is only paid once per remote desktop session". [PDF read directly] (official) — [BeyondCorp Part III](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- Planned change in 2016: migrate desktops and laptops off certificates to "a Device-User-Session-ID (DUSI) that's shared across all browsers and tools using a common OAuth token-granting daemon". Whether this shipped was not found. [PDF read directly] (official) — [BeyondCorp Part III](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- "I'm under the impression that the vast majority of people use their cloudtop over ssh and a remote vscode connection. I only ever use a remote gui for a few minutes every X weeks to do chrome-based auth for an nonstandard workflow." (cosentiyes, 26 Feb 2023). [raw API text] (anonymous commenter) — [HN 34943528](https://news.ycombinator.com/item?id=34943528)
- "I use regular terminal SSH+VS Code remote machine feature... in an ultra rare case I need it (happens only about once per year at most), I can just RDP using chrome remote desktop, and it works pretty well." (filoleg, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36782739](https://news.ycombinator.com/item?id=36782739)
- The opposite habit: "They have a chromebook and RDP onto their cloudtop and never close it." (jppittma, 22 Jul 2023). [raw API text] (anonymous commenter) — [HN 36830177](https://news.ycombinator.com/item?id=36830177)
- Web development on the VM: "Tools or web services run on the VM and you just access it directly through the proxy on your local browser." (aleksiy123, 6 Oct 2022). [raw API text] (anonymous commenter) — [HN 33111773](https://news.ycombinator.com/item?id=33111773)
- `gmosh` is named as the way into a Cloudtop from home (cbHXBY1D, 6 Oct 2022). [raw API text] — [HN 33112696](https://news.ycombinator.com/item?id=33112696)
- Security keys as part of the picture: BeyondCorp "adds lots of hurdles (e.g. requiring pressing a security key, pervasive monitoring), but doesn't render a hacked employee workstation harmless" (advisedwang, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36782520](https://news.ycombinator.com/item?id=36782520)

#### Gaps

- Not found: an official description of the SSH certificate lifetime, the security-key touch requirement, or measured latency. Latency complaints are in the first pass.

### A6. What a Cloudtop can reach: internet, production, user data

#### Takeaway

Public Google writing describes the direction (remove direct human access to production; reach it through proxies and tooling; never allow unilateral access to user data) without saying what a Cloudtop specifically can reach. The 2023 pilot shows general internet access from desktops was the default until then.

#### Cited Findings

- Zero Touch Production aims "to make Google safer and reduce outages by removing direct human access to production roles"; "Instead, humans have indirect access to production through tooling and automation"; "you can only allow RPCs to be originated from fully managed desktop workstations"; "you should always safeguard against unilateral access to user data." (Building Secure and Reliable Systems, ch. 5, 2020.) [fetched] (official, book) — [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)
- Trust tiers gate source submission: an example global ACL rule is "Devices at a low tier are not allowed to submit source code." (;login: Winter 2016.) [PDF read directly] (official) — [BeyondCorp Part III](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- "software companies like Google also lock user private data like crazy. But you can have root access (or at least you could when I worked there), cause for 99% of development, you couldn't touch actual user data anyway." (greiskul, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36782525](https://news.ycombinator.com/item?id=36782525)
- On production hosts (not workstations), "pure root access was revoked for everyone YEARS ago and replaced w/user and admin role accounts" (incomplete, says he worked there 2003 to 2011, 19 Jul 2023). [raw API text] (anonymous commenter) — [HN 36780956](https://news.ycombinator.com/item?id=36780956)
- In an agent-era setup: "Cloudtops only have access to credentials for my personal instances... Any deployment to staging/prod is done with other tooling that doesn't run through AI, and only looks at checked-in code." (shaftway, 6 Nov 2026). [raw API text] (anonymous commenter) — [HN 50397671](https://news.ycombinator.com/item?id=50397671)

#### Gaps

- Not found: whether a Cloudtop can open connections to production jobs directly, how logs and production data are reached from it, and whether the 2023 no-internet pilot became policy.

### A7. The rule that google3 source must not be on laptops

#### Takeaway

No official statement of the rule was found. It is now attested by at least seven independent commenters across 2022 to 2026 with consistent wording: policy, security-motivated, with exceptions for client and mobile work. The nearest official text is the BeyondCorp trust-tier rule on submitting source.

#### Cited Findings

- "Google3 monorepo source isn't, by policy, supposed to leave the corp network workstations, and can't even be on your corporate provided laptop (except for some edge cases in mobile apps dev). Even during full COVID lockdown WFH we had to remote into our machines." (cmrdporcupine, self-described ex-Googler, 29 Jun 2024). [raw API text] (anonymous commenter) — [HN 40827583](https://news.ycombinator.com/item?id=40827583)
- "You're not allowed to have code copied to a laptop, unless you get special permissions. Only teams that work on client code like desktop apps are likely to be given access. So this means to even look at code, you have to be connected to the network (via Chrome or a Fuse-based VFS.)" (pradn, 6 Oct 2022). [raw API text] (anonymous commenter) — [HN 33112061](https://news.ycombinator.com/item?id=33112061)
- "The workstations are the coding machines. You're not allowed to have google code on your laptop." (jppittma, 22 Jul 2023). [raw API text] (anonymous commenter) — [HN 36830394](https://news.ycombinator.com/item?id=36830394)
- "I believe gLinux can be installed on trusted machines that you connect over SSH as well as client laptops (where you can't checkout code etc)." (alpb, 13 Jul 2022). [raw API text] (anonymous commenter) — [HN 32079674](https://news.ycombinator.com/item?id=32079674)
- An outsider's summary: "Google doesn't let devs store IP on their workstations except in very rare circumstances (per this thread and the BeyondCorp papers)" (easton, 2 Aug 2022). I did not find that statement in the BeyondCorp paper I read. [raw API text] (anonymous commenter, not an employee) — [HN 32313812](https://news.ycombinator.com/item?id=32313812)
- The pitch as one commenter puts it: "no code (or IP) on local machines that can be stolen" and "no downtime if laptop breaks… IT desk can keep a stack of chrome books ready for backup" (vineyardmike, 6 Oct 2022; describing the model generally). [raw API text] (anonymous commenter) — [HN 33112778](https://news.ycombinator.com/item?id=33112778)
- Cost of the rule for hardware work: "I worked on embedded stuff and had to compile on my office workstation, scp the binaries home, and flash my device, and repeat. Super slow cycle." (cmrdporcupine, 29 Jun 2024). [raw API text] — [HN 40827583](https://news.ycombinator.com/item?id=40827583)

#### Gaps

- Not found: any Google-authored public sentence stating the rule.

### A8. 2025 to 2026: where coding agents run

#### Takeaway

Reporting agrees that Google engineers use Jetski (an internal build of Antigravity with monorepo support), agentic features in Cider, and an asynchronous background agent reported as "Agent Smith"; Gemini CLI was recommended internally before Jetski. No source says whether these agents execute on the engineer's Cloudtop, in a CitC workspace on shared infrastructure, or elsewhere. One commenter runs an agent "in a web service" on his Cloudtop and treats the Cloudtop as the blast radius.

#### Cited Findings

- "Devs at Google can use Jetski (an internal vesion of Anrigravity, supports eg monorepo, docs search etc. Built by the Antigravity team) and Cider (lots of agentic features) They are disallowed to use Antigravity for work" (Gergely Orosz on X; post text as shown in search results; date not shown, the post follows Antigravity's Nov 2025 launch). [snippet] (press/newsletter author) — [X post](https://x.com/GergelyOrosz/status/1991512105313525784)
- A reverse-engineering blog reports the app "connects to Google's internal infrastructure (jetski-server.corp.goog)" (Alok Bishoyi; as summarised in search results; page not opened). [snippet] (outside analysis) — [alokbishoyi.com](https://alokbishoyi.com/blogposts/reverse-engineering-browser-automation.html)
- "All I know is internally they were recommending people use Gemini CLI until they switched to recommending Jetski/Windsurf CLI."; "the internal Gemini CLI didn't come with whatever it needed to deal with Google's internal tooling, and Jetski did."; "Gemini CLI takes like 30-60s to start up" (jim33442, 22 May 2026). [raw API text] (anonymous commenter) — [HN 48230295](https://news.ycombinator.com/item?id=48230295), [HN 48230949](https://news.ycombinator.com/item?id=48230949)
- Agent Smith, second-hand: "an internal agentic coding platform built on Google's existing Antigravity infrastructure"; "The system works asynchronously — engineers give it instructions, it works in the background"; "they can check progress from their phones". The profile states "every claim in this profile rests on secondhand reporting" (Business Insider and others), and its author sells a competing product. (Ry Walker, undated, mid-2026.) [fetched] (secondary, low weight) — [rywalker.com](https://rywalker.com/research/google-agent-smith)
- Search summaries of April 2026 press (Bloomberg via The Star) say Google is uniting internal coding tools under Antigravity and that engineers hit capacity limits on internal AI coding tools. Not opened. [snippet] (press) — [The Star 2026-04-23](https://www.thestar.com.my/tech/tech-news/2026/04/23/googles-internal-politics-leave-it-playing-catch-up-on-ai-coding)
- Agent on a Cloudtop as containment: "The agent runs in a web service on that machine, which is how I interact with it... If my AI went completely haywire, it could hose my personal instances and a single cloudtop." (shaftway, 6 Nov 2026; Git-hosted project). [raw API text] (anonymous commenter) — [HN 50397671](https://news.ycombinator.com/item?id=50397671)

#### Inferences

- A background agent that an engineer checks from a phone cannot depend on the engineer's SSH session, and CitC workspaces are machine-independent by design, so the architecture permits agents to run away from the Cloudtop. That is an inference; no source confirms it.

#### Gaps

- Not found: "Agent Compute Engine" or any named agent runtime, and any statement placing Jetski's or Cider's agent execution on Cloudtop versus shared infrastructure.

---

## Part B. Meta OnDemand and devservers

### B1. When OnDemand started; share; start-up time; lifetime; what persists; pre-warming; which stacks

#### Takeaway

OnDemand was already "transitioning" in for web work by about 2021, was first acknowledged publicly in Nov 2022, and by mid-2023 Meta said the majority of its developers used the containers. One ex-engineer reports start-up under 10 seconds. Persistence is by synced dotfiles, persisted environment modifications, and commits uploaded to the server; the container itself lasts about a day and a half.

#### Cited Findings

- Share: "the majority of our developers tend to use these development containerized environments" (Henrique Andrade, Meta production engineer, QCon New York June 2023, published 19 Dec 2023). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- Start-up and warm state: "Velocity is there - spinning up a new host took less than 10 seconds."; "You spin up new dev machine, the repository is cloned, checked out on the latest stable and warm version (for build caches)" (Adrian Zgorzałek, says "While working at Meta, I had access to `OnDemand`"; post dated 5 May 2026; his Meta dates are not given). [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)
- Persistence: "Dotfiles would be automatically mounted and making any change to it would sync them across my devboxes"; "Dev environment modifications would persist across sessions and would be applied to the new boxes." [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)
- Recovery by replacement: "it was often faster to commit change to a global pool of ephemeral commits, get a new machine and pull the commit." [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)
- The mechanism behind that: the Sapling server "enables Commit Cloud, where all commits in your organization are uploaded as soon as they are made," so "sharing code is as simple as sending your colleague a commit hash and having them run sl goto HASH." (Durham Goode and Michael Bolin, Meta, 15 Nov 2022). [fetched] (official) — [Meta engineering blog](https://engineering.fb.com/2022/11/15/open-source/sapling-source-control-scalable/)
- Several at once: "I could have few of these running, be able to test multiple features without doing any branch check-outs" with `adek-1.ondemand.com` and `adek-2.ondemand.com` open side by side. [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)
- History, origin claim: "I was leading Facebook's (now Meta) Developer Products team... We ran back then a similar project that I coined "Developer On-Demand" to tackle that same problem space." (ronef, Ron Efroni, later founder of Flox; 19 Aug 2024; no year given). [raw API text] (named ex-employee) — [HN 41294913](https://news.ycombinator.com/item?id=41294913)
- History, transition: "Typically, things are built on a devserver (although this was transitioning to on-demand VMs...)" (cletus, self-described ex-Facebook; 28 Jun 2023, describing "as of 2 years ago"). [raw API text] (anonymous commenter) — [HN 36510954](https://news.ycombinator.com/item?id=36510954)
- Public silence until late 2022: "I don't think it's been discussed externally yet. It's called on-demand" (nsenifty, 19 Dec 2022, pointing at the Nov 2022 developer blog). "We already have something like this at Meta... All our dev environments are remote" (prakashn27, 19 Dec 2022). [raw API text] (anonymous commenters) — [HN 34048215](https://news.ycombinator.com/item?id=34048215), [HN 34046881](https://news.ycombinator.com/item?id=34046881)
- Older baseline: "every engineer there has a dev server running a copy of Facebook." (jmcohen, 13 May 2015). [raw API text] (anonymous commenter) — [HN 9536598](https://news.ycombinator.com/item?id=9536598)
- Link to CI: "OnDemand: internal development environments (dev boxes), linked with Sandcastle." (show notes, Pragmatic Engineer podcast with Tomas Reimers, ex-Meta, 2 Apr 2025; unattributed summary line). [fetched] (secondary) — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/stacked-diffs-and-tooling-at-meta)
- Stacks: OnDemand offers environments for different work, including "if an engineer is doing iOS development or Android development" (Andrade, 2023; the fetch returned only this fragment). Web: "things aren't built locally but on dev servers or on-demand instances that all run services that take care of any build jobs in the background" (phyrex, 22 Apr 2024). [fetched] / [raw API text] — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/), [HN 40110809](https://news.ycombinator.com/item?id=40110809)
- Mobile on laptops: "Eden definitely works better on a dev server and sucks on a laptop, especially arm based mac's (it's slowly getting better but still requires occasional reboots)." (roland35, 29 Jun 2023). Disputed history: cletus says iOS and Android "are all built locally. It's why iOS/Android engineers have big, chunky machines like the iMac Pro or the trash can"; ahahahahah replies "ios and Android have had the remote artifact caching... since many years ago. Android has had remote execution for years". [raw API text] (anonymous commenters, in conflict) — [HN 36516345](https://news.ycombinator.com/item?id=36516345), [HN 36510954](https://news.ycombinator.com/item?id=36510954), [HN 36512220](https://news.ycombinator.com/item?id=36512220)
- Laptop limits, official voice: "Apple doesn't give us laptops with larger than a one terabyte drive." (Pascal, host, Meta careers podcast "What it's like to write code at Meta", published 10 Feb 2026; the fetch tool reports the episode was recorded in August 2023, which needs checking). The episode says nothing about devservers or OnDemand. [fetched] (official, podcast) — [Meta careers podcast](https://www.metacareers.com/podcast/what-its-like-to-write-code-at-meta/)

#### Inferences

- "Pre-warming" in practice means a pool of containers already checked out at a recent stable commit with build caches populated, so claiming one is an assignment, not a build. That reading fits "less than 10 seconds" and the official "pre-warmed and pre-configured with respect to source control repositories", but no source describes the pool mechanics.
- Commit Cloud is what lets Meta make the machine disposable: unpushed work is already on the server.

#### Gaps

- Not found: a launch year for OnDemand, an official start-up time, whether uncommitted (not yet committed) changes survive container expiry, whether a Mac-based OnDemand exists.

### B2. Devserver, devvm and devgpu shapes; getting a devgpu; sharing

#### Takeaway

No official shapes exist in public, but GitHub issues filed from Meta machines show devgpus that are whole multi-GPU servers: one with 192 logical CPUs and eight GPUs (2024), one with eight H100s (2026), and a "B200 devgpu" (2026). How a devgpu is obtained was not found.

#### Cited Findings

- `devgpu009.cln1`, Oct 2024: `collect_env.py` output shows "OS: CentOS Stream 9 (x86_64)", "GPU 0: NVIDIA PG509-210" through GPU 7, "CPU(s): 192", "Model name: Intel(R) Xeon(R) Platinum 8339HC CPU @ 1.80GHz", "Core(s) per socket: 24", "Socket(s): 4", "Thread(s) per core: 2" (issue by shuqiangzhang, 28 Oct 2024). [raw API text] (public artefact) — [pytorch/pytorch#139129](https://github.com/pytorch/pytorch/issues/139129)
- `devgpu011.ldc3.facebook.com`, May 2026: "**Host:** Meta devserver (`devgpu011.ldc3.facebook.com`)", "**Distro:** CentOS Stream 9", "**GPUs:** NVIDIA H100, driver `580.82.07`", `nvidia-smi` lines "NVIDIA H100, 580.82.07, 97871 MiB", and a topology table listing GPU0 to GPU7 (issue by felipemello1, 5 May 2026). [raw API text] (public artefact) — [meta-pytorch/monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- Same issue, on per-person ownership: a colleague writes "I tried this on my devgpu with (seemingly) identical specs" and "the best way for me to deal with this would be to get access to your devgpu. Would that be possible?" [raw API text] (public artefact) — [meta-pytorch/monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- "On B200 devgpu, run: `torchrun --nproc_per_node=4 ...`" (danielvegamyhre, 20 Feb 2026). [raw API text] (public artefact) — [pytorch/ao#3926](https://github.com/pytorch/ao/issues/3926)
- Devgpus are not quiet machines: "I think the time variability from run to run is expected when running on a devgpu. TorchBench servers have some special settings to reduce the variability." (jerryzh168 and reply, Oct 2024). [raw API text] (public artefact) — [pytorch/benchmark#2527](https://github.com/pytorch/benchmark/issues/2527)
- "devvm" is ordinary vocabulary: "when I ran the test under fbcode on my devvm I didn't see the failure" (NicolasHug, 21 Oct 2021) — [pytorch/vision#4683](https://github.com/pytorch/vision/issues/4683); "this is for a linux machine (devvm)" (dhruvbird, 3 Aug 2021) — [pytorch/pytorch#62630](https://github.com/pytorch/pytorch/issues/62630). [raw API text] (public artefacts)
- Official, without figures: "We offer different flavors of devservers, from VMs, which can have different sizes"; "if an ML engineer is working on software that requires access to a GPU"; "Devservers can also be shared."; "they might request it temporarily with a short-term lease, or they might be permanent." (Andrade, 2023). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- ML pervasiveness by 2016: "you couldn't find a devserver without tripping over an NN along the way." (disgruntledphd2, 6 Nov 2024). [raw API text] (anonymous commenter) — [HN 42066977](https://news.ycombinator.com/item?id=42066977)

#### Inferences

- A 4-socket, 192-thread host with eight GPUs is a full training-class server used as one person's interactive machine, not a slice. (The issue does not name the GPU model behind board ID PG509-210, and I have not verified it.)
- GitHub issues filed from company machines are an under-used public source: hostnames encode machine class (`devgpu`, `devvm`) and data-centre code (`cln1`, `ldc3`), and environment dumps give exact hardware.

#### Gaps

- Not found: devvm sizes (cores, RAM, disk), how a devgpu is requested (reservation, quota, team allocation), lease length, reclamation rules, the number of devservers one engineer may hold.

### B3. Root, package installs, Chef, internet access, Docker

#### Takeaway

Devservers run CentOS Stream 9 on Meta's own kernel build, are managed by a provisioning system, and reach the internet only through a forward proxy named `fwdproxy` on port 8080; ML engineers work in per-user conda environments in their home directory. Root, sudo and Docker policy were not found.

#### Cited Findings

- Proxy in use on a devgpu: a pasted `wget` session shows "Resolving fwdproxy (fwdproxy)... 2401:db00:31ff:ff2f:face:b00c:0:1e10" and "Connecting to fwdproxy (fwdproxy)|...|:8080... connected." before a public file downloads (28 Oct 2024). [raw API text] (public artefact) — [pytorch/pytorch#139129](https://github.com/pytorch/pytorch/issues/139129)
- Official statement of the default: "the devservers have default access to internal resources, but they do not have direct access to the Internet" (Andrade, 2023). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- Conda in home: paths such as "/home/sqzhang/.conda/envs/sqzhang_1/lib/python3.12/site-packages/torch/..." and "Python version: 3.12.0 | packaged by Anaconda, Inc." (28 Oct 2024). [raw API text] (public artefact) — [pytorch/pytorch#139129](https://github.com/pytorch/pytorch/issues/139129)
- OS and kernel: "CentOS Stream 9"; "Linux devgpu011.ldc3.facebook.com 6.13.2-0_fbk12_0_g0b66b3635210 ... x86_64 GNU/Linux" (5 May 2026). [raw API text] (public artefact) — [meta-pytorch/monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- "Every devserver is managed by a provisioning system."; "The general provisioning framework supports the customization of a server's provisioning steps" (Andrade, 2023). The talk does not mention Chef, root or sudo. [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- Chef is attested for laptops, not devservers: "developers's checked out repos on their laptops can be silently upgraded since the machines are well managed with Chef" (ak67, 29 Jun 2023). [raw API text] (anonymous commenter) — [HN 36517271](https://news.ycombinator.com/item?id=36517271)
- Network: Facebook went IPv6-only internally; for the few IPv4-only things "you could get a dual-stack dev server." (adamsb6, self-described ex-Facebook, 22 Sep 2023). [raw API text] (anonymous commenter) — [HN 37617211](https://news.ycombinator.com/item?id=37617211)

#### Gaps

- Not found: root or sudo on devservers or OnDemand, dnf/yum or "feature install" policy, Docker, whether Chef manages devservers (plausible given Meta's public Chef use, but unsourced here).

### B4. Editor connection, shareable sandboxes, terminals

#### Takeaway

OnDemand is reached mainly through VS Code; each OnDemand instance serves a full copy of the site at a per-user hostname, which is what makes sandboxes shareable and lets one engineer keep several features open in browser tabs.

#### Cited Findings

- "you can hit `facebook.com` through an alias like `adek-{N}.ondemand.com` and have a complete sandbox ready to debug, code, test end to end." (Zgorzałek, 5 May 2026; two fragments joined by me, check the page). [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)
- "This sandbox replicates the prod environment for Meta products available to large surfaces." ... "which they can use to test their code changes, locally." (Andrade, 2023; fragments). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- "On Demand containers are primarily accessible via the VS Code IDE"; for devservers "an engineer has remote terminal access, so they can SSH directly into the box". The talk does not mention mosh, Eternal Terminal or tmux. [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- The inner loop for web: "You type a line of code, hit refresh and you see it, running fully in the context of everything else your dev server does." (AnotherGoodName, says "i've worked at Meta and Google amongst others", 29 Jan 2026). [raw API text] (anonymous commenter) — [HN 46813142](https://news.ycombinator.com/item?id=46813142)
- Nuclide era: "Nuclide ran locally, but it used remote code checkouts, and your code ran on the remote, not on your local machine." (reissbaker, self-described ex-Facebook, 23 Feb 2021). [raw API text] (anonymous commenter) — [HN 26243011](https://news.ycombinator.com/item?id=26243011)

#### Gaps

- Not found: a browser-hosted VS Code for OnDemand (the first pass's HN comment about "shareable full stack preview links" is still the only hint), Meta's internal VS Code distribution name, terminal tooling (mosh, et, tmux).

### B5. What a devserver or OnDemand can reach

#### Takeaway

Officially, devservers sit inside the production environment and network with default access to internal resources and no direct internet. Controls on reaching production data from them were not found.

#### Cited Findings

- "The interesting thing about devservers is that they run in the production environment and network." ... "that gives them access to everything that powers the Meta infrastructure" (Andrade, 2023; fragments). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- "they should never be running a production service on their devserver"; live migration means "an engineer doesn't even have to power down their VM"; on decommissioning the system will "indicate to the users that they have to move over to a different devserver"; "DR exercises occur without prior notice" (Andrade, 2023; fragments). [fetched] (official, talk) — [InfoQ](https://www.infoq.com/presentations/meta-production-environment/)
- A data-engineering agent (DEmate) is described by Meta's analytics team as running long test jobs in the background and syncing with "Devmate and Claude Code" (Analytics at Meta on Medium; as summarised in search results; page returned 403). [snippet] (official blog, unread) — [Medium](https://medium.com/@AnalyticsAtMeta/how-we-built-demate-taming-llms-for-data-engineering-at-meta-d134e69637c5)

#### Inferences

- This is the sharpest structural contrast with Google: Meta's dev machine is a production-network citizen, where Google's public writing describes workstations as clients that reach production through proxies.

#### Gaps

- Not found: how Hive, Presto or Scuba data and logs are reached from a devserver, and the privacy or permission checks on that access.

### B6. 2025 to 2026: where Meta's coding agents run

#### Takeaway

Reporting covers what the agents are (Devmate from 2025, then MetaCode and the Muse Code product in 2026) and how much code they submit, but no source says whether they execute on an engineer's devserver, in OnDemand containers, or on separate infrastructure. An ex-engineer's own design note treats the OnDemand pattern as the model for agent sandboxes.

#### Cited Findings

- Devmate "eventually became DevMate" after agentic work moved toward source control; "its agents were submitting roughly 50% of all diffs at Meta" (article narration, not a direct quote); Dev Infra is described as a 1,000-person organisation serving about 40,000 engineers (Guild.ai article recounting James Everingham, ex-Meta, 11 Mar 2026; the publisher is his company). [fetched] (named ex-employee via own company's blog) — [guild.ai](https://www.guild.ai/blog/news/james-everingham-agent-control-plane-guild)
- Search summaries only: Devmate launched internally in March 2025 on models including Claude (Business Insider Japan); engineers asked to submit a diff a week with MetaCode, with 7,000 weekly active users (The New Stack, 2026); Muse Code is a terminal agent with persistent background agents (VentureBeat, InfoWorld, 2026). None opened. [snippet] (press) — [Business Insider JP](https://www.businessinsider.jp/article/2506-meta-anthropic-ai-llama-coding-efficiency/), [The New Stack](https://thenewstack.io/meta-metacode-engineer-training/), [VentureBeat](https://venturebeat.com/orchestration/meta-enters-the-ai-coding-wars-with-muse-spark-1-2-and-muse-code-with-persistent-async-background-agents)
- OnDemand as the template: after describing OnDemand, the author writes "I wanted something like that." and sets the goal of "running agent in a disposable sandbox with a full dev environment to be able to replicate problems" (Zgorzałek, 5 May 2026, describing his own post-Meta setup). [fetched] (named ex-employee) — [adek.io](https://adek.io/blog/dev-environment-for-agentic-coding/)

#### Gaps

- Not found: any statement on where Devmate, MetaCode or background agents execute. The paywalled Pragmatic Engineer Pulse #157 (Dec 2025) remains the likeliest source.

---

## Side by side

| Question | Google Cloudtop | Meta devserver (devvm, devgpu) | Meta OnDemand |
| --- | --- | --- | --- |
| What it is | Persistent personal gLinux VM on Compute Engine | Reserved Linux VM or physical host in a Meta data centre | Pooled, pre-warmed container on Twine |
| Since | Ganeti VMs before 2016; Cloudtop name 2017; "default desktop" Apr 2023 | "every engineer has a dev server" by 2015 | Transitioning in about 2021; first public mention Nov 2022 |
| Share | Over 1/4 (2018); "most" (2022); later not found | Minority by 2023 (implied) | "the majority of our developers" (2023) |
| Shapes | Not found (E2, N2/N2D families only) | devvm not found; devgpu seen with 192 CPUs + 8 GPUs (2024), 8x H100 (2026), "B200 devgpu" (2026) | Not found ("hardware profiles incl. GPU") |
| Getting a bigger one / a GPU | Not found | Not found | Not found |
| Time to get one | "instantaneously" (official, 2022); about 15 min to reprovision (commenter, 2026) | "a couple of hours" if not pre-provisioned | "less than 10 seconds" (ex-engineer) |
| Lifetime | Indefinite; idle reclamation not found | Short lease to permanent | About a day and a half |
| What persists | Source in CitC, outputs in ObjFS; local disk is personal state | Automated backups support migration | Synced dotfiles, persisted env modifications, commits in Commit Cloud |
| How many per engineer | One plus a desk workstation is attested; quota not found | Not found | "few of these running" at once |
| OS and patching | gLinux Rodete (Debian testing), weekly release, 1% canary | CentOS Stream 9, Meta kernel, provisioning system | Preconfigured stacks; details not found |
| Root | Yes by most testimony; no-root pilot for some, Jul 2023 | Not found | Not found |
| Docker / VMs | Local VMs not allowed; Docker not found | Not found | Not found |
| Internet | Default yes until 2023 pilot; outcome not found | No direct access; `fwdproxy:8080` | Not found (presumably same) |
| Connection | SSH via Access Proxy (WebSocket ProxyCommand, machine cert), Chrome Remote Desktop, Cider-V terminal, gmosh | SSH; VS Code remote | Primarily VS Code; per-user site alias in browser |
| Reach into production | Via proxies and tooling (Zero Touch Prod); specifics not found | "run in the production environment and network" | Sandbox "replicates the prod environment" |
| Production data controls | "safeguard against unilateral access to user data" (book); specifics not found | Not found | Not found |
| Code on laptop | Forbidden by policy per seven commenters; no official text | No rule found; EdenFS runs on Macs, poorly | n/a |
| Where agents run (2026) | Not found (one commenter: agent as a web service on the Cloudtop) | Not found | Not found |

## Angles for an essay

1. **Seconds, minutes, hours.** The three products sit an order of magnitude apart on time-to-replace: OnDemand under 10 seconds, a Cloudtop about 15 minutes, a fresh devserver a couple of hours. The time-to-replace number predicts behaviour better than the persistent/ephemeral label: at 10 seconds an engineer throws a broken machine away and pulls the commit; at an hour they repair it.
2. **A machine becomes disposable when commits leave it automatically.** Google did it with a network filesystem for the working copy; Meta did it with Commit Cloud uploading every commit as it is made. The essay can state the general rule without either product: nothing irreplaceable may exist only on the dev machine.
3. **Root was never the control.** Google engineers kept root for years while the real controls were device trust tiers, audit, revert scripts and keeping source off laptops. The July 2023 no-internet, no-root pilot marks a change of mind, and it arrived for security reasons seven years after the Cloud migration.
4. **Inside or outside the production network.** Meta's devserver is a production-network machine with no internet; Google's Cloudtop is a corporate client that reaches production through proxies and, until 2023, had the internet. Same remote-dev idea, opposite answers to "what can this box reach", which is the question that matters most once an autonomous agent is the thing typing.
5. **The agent question exposes what the dev box is for.** No public source says where either company's agents execute, but the one practitioner account (a Cloudtop as the blast radius, credentials scoped to personal instances, deploys only from checked-in code) and the ex-Meta engineer who rebuilt OnDemand for his agents both treat the remote dev machine as a sandbox first and a workstation second.

## Remaining gaps

- **Shapes and quotas at both companies.** Nothing public for Cloudtop or devvm; devgpu facts come only from three GitHub issues. Approval paths and per-person limits not found anywhere.
- **Root and package policy at Meta**, and Docker at both.
- **OnDemand launch year**, pool mechanics, behaviour of uncommitted changes at expiry, and any Mac-based OnDemand.
- **Outcome of Google's 2023 no-internet pilot**, and Cloudtop idle reclamation.
- **Official statement of Google's source-on-laptop rule.** Seven commenters, zero Google documents.
- **Where agents run** at either company. Jetski, Cider agents, Agent Smith, Devmate and MetaCode are all described by function only.
- **Production data access from dev machines** at both companies.
- **Sources not reached:** Ars Technica (Feb 2023, fetch blocked), Matthew Garrett's "Cloud desktops aren't as good as you'd think" (403), the Analytics at Meta DEmate post (403), a levelup.gitconnected piece on Google's internal tools (403), X posts by Gergely Orosz (snippets only), Pragmatic Engineer paid issues, and any gLinux DebConf talk (two searches, nothing). The BeyondCorp "Design to Deployment" paper (;login: Spring 2016) was not read and may say more about source-code access by trust tier.
- **Re-check before printing:** every [fetched] quote, especially the InfoQ and adek.io fragments, which the fetch tool cut to short pieces; and the recording date of the Meta careers podcast episode.
