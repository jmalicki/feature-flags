# Individual testimony on developer machines at other large technology companies (not Google, Meta, Stripe, or AV firms)

Pass of 2026-11-26. About 45 searches and fetches. Companion to `engineer_testimony_specs.md`; items already recorded there are referred to, not repeated.

## How to read these notes

- **Evidence class.** Individual public statements: Hacker News comments, and public GitHub issues and pull requests in which employees describe or dump their dev machine. Each is one person's account. "Voices" below means distinct public handles; I have not verified any employment claim.
- **Read tags.**
  - `raw text` = pulled from the Hacker News Algolia API or the GitHub REST API. Quotes are verbatim as returned (HTML stripped).
  - `fetched via extraction` = WebFetch, which passes the page through a summarising model. Re-check quotes against the page before publishing.
  - `snippet only` = search-result summary; page not read.
- **Where the material came from.** By far the most productive source was public GitHub repositories where employees file issues from their work machine. Three were unusually rich, all 2026:
  - `kirodotdev/KiroCrew` (public, created 2026-07-16; an agent-orchestration tool around Amazon's Kiro CLI). Its PR template has a "Real-machine verification" section, so about 20 authors state their Amazon dev desktop's OS, architecture, vCPU count and RAM. **Caveats:** the PR text is templated and probably agent-drafted, so the numbers are likely read off the machine (good for accuracy, weaker as "testimony"); the authors are heavy agent users, so sizes skew large; I infer Amazon employment from the phrase "Amazon dev desktop" / Amazon Linux, not from a stated employer, and at least one author describes himself as "an outside contributor".
  - `openai/codex` (issues and PRs by handles ending `-openai` mention "Applied devbox").
  - `omnigent-ai/omnigent` (PRs marked "Databricks-internal feature" mention "Arca" and "Arclet" hosts). I could not independently confirm what this organisation is; treat the Databricks attribution as what the PR text says.
- **What failed.** Reddit is blocked to the search tool. Blind and Medium were unreachable in the earlier pass and not retried. lobste.rs search returned nothing usable. General web search returned company marketing, not testimony. Hacker News keyword search is nearly exhausted for these companies: most queries returned zero relevant comments.
- Amazon dev desktop hostnames embed the employee alias; I have left hostnames out.

---

## Code on the laptop or only on the remote machine; any explicit rule; what the laptop is for

### Takeaway

No explicit "no code on the laptop" rule surfaced for any company in this pass. What surfaced is practice: at Amazon the working checkout lives on the dev desktop and the laptop is a client (10+ voices, 2016-2026); at Microsoft one engineer says "pretty much all the developers I know" moved to Dev Box by 2026; at OpenAI and Databricks engineers' PRs treat a Linux devbox/"Arca" host and the laptop as two alternative places to run things.

### Cited Findings

- **Amazon, 2022-07-14, ActorNightly (claims insider knowledge; employer not stated in the comment). raw text.** "Take every single Amazon developer for instance - each of them has a private VM "dev-desktop" for development ... they have a tool that basically rsyncs directories over ssh just so you can develop on your mac". So in 2022 some code was edited on the Mac and synced. — [HN 32091232](https://news.ycombinator.com/item?id=32091232). Agrees with the 2017 statement by the Cloud Desktop creator already in `engineer_testimony_specs.md` (laptop checkout synchronised to the cloud desktop). **2 voices for "laptop editing with sync existed".**
- **Amazon, 2026-10-09, djman-aws. raw text.** "Users move between laptops and dev desktops". — [KiroCrew#18593](https://github.com/kirodotdev/KiroCrew/issues/18593)
- **Amazon, 2026-09-28, swchoi0102. raw text.** "Keeping a git checkout outside `$HOME` is common on Amazon dev desktops, where `/workplace` is the standard work volume." — [KiroCrew#14627](https://github.com/kirodotdev/KiroCrew/issues/14627). Supported by bolichen97's PR, which runs from `/workplace/<user>/KiroCrew` on an "Amazon Linux dev desktop" — [KiroCrew#40690](https://github.com/kirodotdev/KiroCrew/pull/40690), and by a shell prompt showing `~/workplace/helm-charts` on a dev desktop — [aws-observability/helm-charts#368](https://github.com/aws-observability/helm-charts/pull/368). **3 voices that checkouts live on the dev desktop under a `workplace` directory.**
- **Amazon, 2026-11-17, shellraiser. raw text.** Laptop as thin client: "Let the Kiro Crew dashboard run on my local laptop (macOS), while Bots run on **several** remote dev machines (e.g. remote desktops) ... My local machine isn't very powerful." — [KiroCrew#38804](https://github.com/kirodotdev/KiroCrew/issues/38804)
- **Amazon, 2019-2026.** At least nine distinct public handles paste shell prompts from `dev-dsk-…` hosts while working on open-source repositories (cedar, jython, Dip, eks-perf-tests, aws-c-common, hydro-project, sagemaker-hyperpod-cli, opensearch performance-analyzer, helm-charts). The work, including open-source work, is done on the dev desktop. raw text. — e.g. [cedar#1093](https://github.com/cedar-policy/cedar/issues/1093), [awslabs/aws-c-common#1310](https://github.com/awslabs/aws-c-common/pull/1310), [hydro-project/infinity#157](https://github.com/hydro-project/infinity/issues/157)
- **Microsoft, 2026-02-23, locusofself (says "internally at Microsoft"). raw text.** "internally at Microsoft, pretty much all the developers I know have switched to using "Devbox", which means we use a remote desktop client to access our dev machine. A lot of us resisted this at first, but then just kindof came to accept it, and it made it so we have a lot more capable machines to do development on than the laptops that we would have to recycle every couple years." — [HN 47116833](https://news.ycombinator.com/item?id=47116833)
- **Microsoft, 2024-07-19, steelframe (employer not stated in the comment). raw text.** "Microsoft has a commercial offering called Microsoft Dev Box. Engineers at the company use the service." — [HN 41007570](https://news.ycombinator.com/item?id=41007570)
- **Microsoft, 2026-08-26, amunger (files as a VS Code team member). raw text.** "when opening vscode on my dev box since there I can't think of a situation where I wouldn't want to be able to see those sessions from my laptop." — [vscode#332769](https://github.com/microsoft/vscode/issues/332769). And 2026-10-05, niels9001 (PowerToys), repro steps: "Open a Windows Dev Box session. Maximize the Dev Box window." — [PowerToys#51014](https://github.com/microsoft/PowerToys/issues/51014). **4 voices that Microsoft engineers work on a Dev Box reached from a laptop/local PC; 1 voice for "pretty much all".**
- **Microsoft, 2021-02-09, Arainach (ex-Microsoft). raw text.** The older model: "When I was at Microsoft, you still needed a VPN to connect to your dev machine and write code". — [HN 26075761](https://news.ycombinator.com/item?id=26075761)
- **OpenAI, 2026-06-03, starr-openai. raw text.** A build helper is written to "support both local macOS and Linux Applied devbox mirrors", "so other Codex devs can reuse the local and Applied devbox flow". So Codex engineers build both on the Mac and on a devbox. — [openai/codex#26032](https://github.com/openai/codex/pull/26032)
- **Databricks (per PR text), 2026-10-23, dbczumar. raw text.** The app treats "a stopped Arca or current-laptop host" as the two kinds of host an engineer has. — [omnigent#11326](https://github.com/omnigent-ai/omnigent/pull/11326)
- **Uber, 2022-11-03, ameeta-uber. raw text.** A rule-like constraint from the other direction: "I am unable to use my local environment for development and have to use devpod which is quite slow and is affecting productivity." — [uber/h3-java#116](https://github.com/uber/h3-java/issues/116). Contrast the 2022 HN statements in the earlier notes that most Uber developers still built locally.
- **Airbnb, 2023-10-19, alfalfasprout ("at Airbnb", opinions own). raw text.** "We now have an in-house cloud dev environment at Airbnb ... it was a huge improvement over what we had in the past." — [HN 37937401](https://news.ycombinator.com/item?id=37937401)
- **LinkedIn, 2023-10-19, ob ("We at LinkedIn"). raw text.** "We at LinkedIn have been using CDE's (we call them rdev) for quite a while ... local containers on macOS still have performance issues so we mostly use them in the cloud." — [HN 37945230](https://news.ycombinator.com/item?id=37945230)
- **Instacart, 2023-10-19, mdeeks (built the system). raw text.** "We at Instacart use them heavily ... Just connect VSCode to it and start coding. No futzing around getting your local environment to work." — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **Shopify, official post 2026-10-22 (company source, not testimony). fetched via extraction.** Mobile teams were still local in 2026: "Our teams were used to working locally for mobile development." — [shopify.engineering/remote-dev](https://shopify.engineering/remote-dev)

### Inferences

- Amazon moved from "edit on the Mac, rsync to the dev desktop" (2017, 2022) to "checkout on the dev desktop, editor attached over SSH" (2025-26 material). No one states a rule; the tooling changed.
- Mobile work is again the exception (Shopify 2026; Uber has no iOS devpod per the earlier notes).

### Gaps

- No written policy text for any company. Nothing for Apple, Netflix, Lyft, Dropbox, Pinterest, Snap, X, Salesforce, Oracle, Snowflake, Palantir, Datadog, Atlassian, Anthropic, DeepMind, NVIDIA, Tesla, SpaceX, ByteDance, Alibaba, Tencent.

---

## Editor and connection: VS Code remote, JetBrains, ssh+tmux+vim, web IDE, remote desktop; latency

### Takeaway

Two families. Linux fleets (Amazon, Airbnb, Instacart, OpenAI, Databricks, Uber) are reached by SSH with VS Code Remote or a terminal. Microsoft's Windows Dev Box is reached by full remote desktop. Latency complaints in this pass come from Uber only.

### Cited Findings

- **Amazon, 2025-09-17, tantonjt-aws. raw text.** VS Code Remote-SSH to the dev desktop: "Extension is enabled on 'SSH: dev-dsk-…us-west-2.amazon.com'". — [aws-toolkit-vscode#8057](https://github.com/aws/aws-toolkit-vscode/issues/8057). A second user's VS Code system info shows an Apple M4 Pro laptop with 48 GB whose "Connection to 'ssh-remote+dev-dsk-…us-west-2.amazon.com' could not be established" (2026-01-23). — [vscode#289796](https://github.com/microsoft/vscode/issues/289796). **2 voices for VS Code Remote-SSH from a Mac.**
- **Amazon, 2026-10-21, roeykel. raw text.** "a headless Linux host (an Amazon dev desktop, connected over SSH) ... Connecting the desktop app to a remote dev desktop is a common setup." — [KiroCrew#22710](https://github.com/kirodotdev/KiroCrew/issues/22710). Plain zsh prompts (`dev-dsk-… %`) in a dozen issues show terminal use.
- **Amazon, 2025-05-17.** ssh to the dev desktop from a phone via an internal browser (already in the earlier notes, [HN 44017380](https://news.ycombinator.com/item?id=44017380)).
- **Microsoft, 2026-02-23, locusofself. raw text.** "we use a remote desktop client to access our dev machine." — [HN 47116833](https://news.ycombinator.com/item?id=47116833). Consistent with niels9001's "Windows Dev Box client" window — [PowerToys#51014](https://github.com/microsoft/PowerToys/issues/51014). **2 voices for full remote desktop.** A third pattern, VS Code on the dev box with sessions viewed from the laptop through a dev tunnel: amunger — [vscode#332769](https://github.com/microsoft/vscode/issues/332769).
- **Airbnb, 2023-10-19, alfalfasprout. raw text.** "it's easy to use VSCode remotely ... Neovim + LSP's also works perfectly if you prefer that over VSCode (via ssh)". — [HN 37937401](https://news.ycombinator.com/item?id=37937401)
- **Uber, 2023-08-04, debosmit (ex-Uber, devpod contributor, now a vendor founder). raw text.** "enable the popular IDEs to connect to these remote environments - all the dotfiles etc etc were persisted so it literally felt like the local IDE, just way faster." — [HN 37005976](https://news.ycombinator.com/item?id=37005976). Contradicted on speed by ameeta-uber, 2022-11-03: "have to use devpod which is quite slow" — [uber/h3-java#116](https://github.com/uber/h3-java/issues/116), and by the two 2022 HN voices in the earlier notes (input lag; IDE indexing chokes). **3 voices slow vs 1 (a builder) fast.**
- **Unnamed large company, 2023-10-19, paxys. raw text.** "My company switched to 100% remote dev envs a couple years ago. When you cut a branch it spins up a VM and you can connect to it from VS Code (native or browser based) or just plain SSH ... The lag is not noticeable at all." Employer not stated; do not attribute. — [HN 37936660](https://news.ycombinator.com/item?id=37936660)
- **OpenAI, 2026-06-03, starr-openai. raw text.** Devbox reached over SSH: "Applied devbox Bazel dependency proof passed before devbox SSH auth regressed". — [openai/codex#26063](https://github.com/openai/codex/pull/26063)
- **Databricks (per PR text), 2026-10-27, PattaraS. raw text.** "Arca forwards 8021 too, so the redirect reached the box directly" (SSH port forwarding from laptop to the Arca host). — [omnigent#11763](https://github.com/omnigent-ai/omnigent/pull/11763)

### Inferences

- A headless Linux dev machine breaks anything that assumes a desktop session: no speech engine, no `systemd --user` bus, browser sign-in must bounce to the laptop (Amazon and Databricks items below). This is a recurring cost of the SSH model that the remote-desktop model (Microsoft) does not have.

### Gaps

- No latency numbers. No JetBrains Gateway testimony. No web-IDE testimony outside the unnamed company.

---

## Persistent or ephemeral; reserved, leased or on demand; provisioning time; expiry, forced rebuilds, idle reclaim

### Takeaway

Amazon dev desktops are long-lived personal machines ("my own dev desktop"). The newer in-house systems are disposable: Instacart hands out a fresh EC2 machine in about two minutes from a warm pool and hibernates it after hours; one unnamed company creates a VM per branch; Databricks distinguishes a persistent "Arca" (cold boot "takes minutes") from a fresh "Arclet Sandbox".

### Cited Findings

- **Amazon, 2026-11.** Authors call the machine "my own dev desktop", "own computer (dev desktop)", "the author's cloud dev desktop". raw text. — [KiroCrew#39791](https://github.com/kirodotdev/KiroCrew/pull/39791), [#40219](https://github.com/kirodotdev/KiroCrew/pull/40219), [#38079](https://github.com/kirodotdev/KiroCrew/pull/38079). **10+ voices for a persistent, personally owned machine.**
- **Amazon, 2026-11-06, chenmingwei23. raw text.** A gateway process "up about 7 h" on a dev desktop under 60-100 agent sessions; nothing reclaimed it. — [KiroCrew#31349](https://github.com/kirodotdev/KiroCrew/issues/31349)
- **Amazon, 2026-11.** Both Amazon Linux 2 and Amazon Linux 2023 dev desktops are in use in the same week; one author reports an AL2 x86_64 box and an AL2023 aarch64 box of the same size. raw text. — [KiroCrew#39247](https://github.com/kirodotdev/KiroCrew/pull/39247), [#41822](https://github.com/kirodotdev/KiroCrew/pull/41822). Suggests OS migration by getting a new machine, not in-place upgrade (inference).
- **Instacart, 2023-10-19, mdeeks. raw text.** "With Bento Remote get a fresh new fully dedicated EC2 machine in about two minutes from when you run `bento remote create` ... Break something on your Bento Remote? Throw it away and get a new machine. Switching projects? Grab a new machine from the pool that is preconfigured for that project. Your settings travel with you." Requirements were "pre-built images, preserved disks, warm pools, live patching, and being behind our firewall", and "hibernating the EC2 instance after hours when the users laptop is idle." — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **Airbnb, 2023-10-19, alfalfasprout. raw text.** "Spinup time is fast ... it's easy to have multiple environments for different types of projects (Python, Java, Go, etc.)". — [HN 37937401](https://news.ycombinator.com/item?id=37937401)
- **Databricks (per PR text), 2026-11-06, zhengwin. raw text.** "'Connecting to Arca…' with no time limit (cold Arca boots take minutes)." And 2026-10-20, dbczumar: "New Session → Arclet Sandbox" creates "a fresh Arclet". — [omnigent#13018](https://github.com/omnigent-ai/omnigent/pull/13018), [omnigent#11023](https://github.com/omnigent-ai/omnigent/pull/11023). A bot PR title mentions "stale hostname-derived host names after re-provisioning" — [omnigent#12083](https://github.com/omnigent-ai/omnigent/pull/12083).
- **Unnamed EC2-hosted devboxes, 2026-01-15, zinodaur. raw text.** "My job has their own DCs, but inexplicably hosts devboxes in EC2 - an autosuspend feature for cost savings sounds awesome." Implies no auto-suspend there. Employer not stated. — [HN 46640605](https://news.ycombinator.com/item?id=46640605)
- **Uber, 2023-08-04, debosmit. raw text.** "all the dotfiles etc etc were persisted". — [HN 37005976](https://news.ycombinator.com/item?id=37005976)
- **Shopify, official 2026-10-22 (company source). fetched via extraction.** Remote Macs for agents are single-use: "We destroy the Mac when the session ends and prepare a replacement", with "a pool of warm Macs at the ready"; before the pool, first compile and checkout took "over 30 minutes". — [shopify.engineering/remote-dev](https://shopify.engineering/remote-dev)

### Inferences

- Two designs coexist in 2026: the pet (Amazon dev desktop, Microsoft Dev Box, Databricks Arca) and the cattle (Instacart, Airbnb, Databricks Arclet, Shopify's agent Macs). Agent workloads push toward cattle.

### Gaps

- No Amazon expiry, lease or idle-stop rule. No Microsoft Dev Box hibernation or rebuild testimony. No provisioning time for Amazon, Microsoft, OpenAI.

---

## How many machines per engineer

### Takeaway

More than one is normal at Amazon in 2026 for people running agents: three voices describe holding several dev desktops. Airbnb allows several environments per person. No one states a cap.

### Cited Findings

- **Amazon, 2026-11-21, slibenja. raw text.** "On Amazon Cloud Dev Desktops I can request bigger instances, but a single host doesn't scale far enough ... Running several desktops with their own gateways works, but then I'm the scheduler". — [KiroCrew#40267](https://github.com/kirodotdev/KiroCrew/issues/40267)
- **Amazon, 2026-11-17, shellraiser. raw text.** Wants bots on "**several** remote dev machines (e.g. remote desktops)". — [KiroCrew#38804](https://github.com/kirodotdev/KiroCrew/issues/38804)
- **Amazon, 2026-11.** Two authors each report two differently configured dev desktops within a week (AL2 x86_64 and AL2023 aarch64 at 32 vCPU / 247 GB; x86_64 and aarch64 at 32 vCPU / 123 GB). raw text. — [KiroCrew#39247](https://github.com/kirodotdev/KiroCrew/pull/39247) and [#41822](https://github.com/kirodotdev/KiroCrew/pull/41822); [#41394](https://github.com/kirodotdev/KiroCrew/pull/41394) and [#39274](https://github.com/kirodotdev/KiroCrew/pull/39274). **4 voices for more than one dev desktop per engineer.**
- **Uber, 2026-09-19, drametwally. raw text.** A benchmark "Measured on eight two-socket x86 devpods". One engineer had use of eight at once. — [uber/ussi#67](https://github.com/uber/ussi/pull/67)
- **Airbnb, 2023-10-19.** "multiple environments for different types of projects". raw text. — [HN 37937401](https://news.ycombinator.com/item?id=37937401)
- **Instacart, 2023-10-19.** A new machine per project from a pool. raw text. — [HN 37938537](https://news.ycombinator.com/item?id=37938537)

### Gaps

- No stated per-person limit or approval step anywhere.

---

## Size: cores, RAM, and especially disk

### Takeaway

The best new data of the pass: about 19 Amazon dev desktops with stated sizes in November 2026, ranging from 16 vCPU / 30 GiB to 192 vCPU / 740 GB, with 16 vCPU / 61 GB and 32 vCPU / 247 GB the most common. One Amazon dev desktop reports local NVMe "at 77% used (977 GB free)", which implies a volume of roughly 4 TB. Home is a symlink into `/local/home`; work goes in `/workplace`.

### Cited Findings

- **Amazon dev desktop sizes, 2026-11, raw text, one line per distinct handle** (all from "Machine:" lines in KiroCrew PRs; reported RAM is what the OS shows, so slightly under the nominal size):
  - 16 vCPU / 30 GiB, AL2 x86_64 — dimwael, [#42430](https://github.com/kirodotdev/KiroCrew/pull/42430)
  - 16 vCPU / 61 GB, AL2023 x86_64 — DcXiaoBing [#40219](https://github.com/kirodotdev/KiroCrew/pull/40219); tim-finnigan [#42743](https://github.com/kirodotdev/KiroCrew/pull/42743); chasepo [#41790](https://github.com/kirodotdev/KiroCrew/pull/41790). (A fourth, mforzano [#31860](https://github.com/kirodotdev/KiroCrew/pull/31860), has the same size but calls himself "an outside contributor"; not counted as Amazon.)
  - 16 vCPU / 123 GiB, AL2023 x86_64 — dma9527, [#39791](https://github.com/kirodotdev/KiroCrew/pull/39791)
  - 32 vCPU / 61 GB, AL2023 x86_64 ("AWS dev desktop") — junjiequ, [#41435](https://github.com/kirodotdev/KiroCrew/pull/41435)
  - 32 vCPU / 123 GB — bolichen97 (x86_64 and aarch64) [#41394](https://github.com/kirodotdev/KiroCrew/pull/41394); kyleseaman [#41418](https://github.com/kirodotdev/KiroCrew/pull/41418)
  - 32 vCPU / 246-247 GB — CrysisDeu (aarch64 and x86_64) [#41822](https://github.com/kirodotdev/KiroCrew/pull/41822); smeyffret [#43269](https://github.com/kirodotdev/KiroCrew/pull/43269); iamwhatever (aarch64) [#41597](https://github.com/kirodotdev/KiroCrew/pull/41597); buluoray [#42671](https://github.com/kirodotdev/KiroCrew/pull/42671); dodgeblaster ("cloud dev host") [#39785](https://github.com/kirodotdev/KiroCrew/pull/39785)
  - 48 vCPU / 184-186 GiB — rnoack1 [#41476](https://github.com/kirodotdev/KiroCrew/pull/41476); patrigao (AL2) [#42190](https://github.com/kirodotdev/KiroCrew/pull/42190)
  - 64 vCPU / 123 GB — JLargent42, [#40172](https://github.com/kirodotdev/KiroCrew/pull/40172)
  - 128 vCPU / 247 GiB — KiroCrewCaptain (possibly a shared or bot account), [#39356](https://github.com/kirodotdev/KiroCrew/pull/39356)
  - 128 vCPU / 493 GiB — Pearcekieser, [#38079](https://github.com/kirodotdev/KiroCrew/pull/38079)
  - 192 vCPU / 740 GB — unstablebrainiac, [#41615](https://github.com/kirodotdev/KiroCrew/pull/41615)
- **Amazon, self-service sizing, 2026-11-21, slibenja. raw text.** "On Amazon Cloud Dev Desktops I can request bigger instances". — [KiroCrew#40267](https://github.com/kirodotdev/KiroCrew/issues/40267). And shellraiser: "Remote dev machines can be scaled up with more memory and better GPUs." — [KiroCrew#38804](https://github.com/kirodotdev/KiroCrew/issues/38804). With the 2018 HN comment in the earlier notes (pick any EC2 type), **3 voices for self-service upsizing.**
- **Amazon, architecture.** At least three of the 19 are aarch64 (CrysisDeu, bolichen97, iamwhatever). raw text.
- **Amazon disk, 2026-11-06, chenmingwei23. raw text.** "Linux dev desktop, local NVMe at 77% used (977 GB free), and /tmp at 2%. This is not a disk-space issue." — [KiroCrew#31349](https://github.com/kirodotdev/KiroCrew/issues/31349)
- **Amazon disk layout, 2026-09-23, andrewtakeshi. raw text.** "the standard Amazon dev-desktop layout (`/home/<user>` symlinked to `/local/home/<user>`)". — [KiroCrew#13172](https://github.com/kirodotdev/KiroCrew/issues/13172). Confirmed by default50, 2026-10-05, on a "Remote dev desktop": `/home/...` and `/local/home/...` "are the same bind-mounted inode" — [KiroCrew#17141](https://github.com/kirodotdev/KiroCrew/issues/17141); and by a cargo path `/local/home/<user>/infinity/...` on a `dev-dsk` host, 2026-10-17 — [hydro-project/infinity#157](https://github.com/hydro-project/infinity/issues/157). **3 voices: home is on local disk under `/local/home`.**
- **Amazon work volume.** "`/workplace` is the standard work volume" (swchoi0102) — [KiroCrew#14627](https://github.com/kirodotdev/KiroCrew/issues/14627). 2 further voices use it (see first section).
- **Amazon, a disk rule exists, 2026-11-23, JLargent42. raw text.** A test script "builds and removes a throwaway worktree, which this host's disk rule forbids". Unexplained. — [KiroCrew#41288](https://github.com/kirodotdev/KiroCrew/pull/41288)
- **Instacart, 2023-10-19, mdeeks. raw text.** "Our full stack development requirements were VERY high and needed 64GB to even run our largest and most active apps." Disks are "preserved". — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **Uber devpod, 2026-09, drametwally. raw text.** "Debian 12 devpod, `aarch64`, glibc 2.36" and "Debian 12 devpod, `amd64`"; a benchmark "Measured on a devpod ... 24 threads"; another on "eight two-socket x86 devpods" at concurrency up to 192. — [uber/ussi#36](https://github.com/uber/ussi/pull/36), [#71](https://github.com/uber/ussi/pull/71), [#67](https://github.com/uber/ussi/pull/67). The "two-socket" machines read like bare-metal-class hosts, not a default devpod; one voice.
- **Microsoft, 2026-02-23, locusofself. raw text.** Only relative: "a lot more capable machines ... than the laptops". — [HN 47116833](https://news.ycombinator.com/item?id=47116833)
- **Microsoft, the laptop side, 2026-01-23.** An Amazon engineer's client laptop: "Apple M4 Pro (14 x 2400)", "48.00GB". raw text. — [vscode#289796](https://github.com/microsoft/vscode/issues/289796) (listed here because it shows the laptop is not a thin client in hardware terms).

### Inferences

- The RAM figures line up with nominal 32, 64, 128, 192, 256, 512 and 768 GiB machines. These are consistent with standard EC2 shapes, but no author names an instance type; do not print instance names.
- 977 GB free at 77% used implies about 4.2 TB of local NVMe on that machine (arithmetic on one quote; one voice).
- Compared with the single 2018 data point in the earlier notes (4 vCPU / 30.5 GiB), the 2026 floor in this sample is 16 vCPU. The sample is of heavy agent users, so it overstates the typical size; it does show what is obtainable without apparent ceremony.

### Gaps

- No home quota, no EBS versus instance-store statement, no account of what survives a dev desktop rebuild. No disk-full war story. No sizes at all for Microsoft Dev Box, OpenAI devbox, Databricks Arca, LinkedIn rdev, Airbnb.

---

## GPUs: on the dev machine, separate class, reservation or queue; how obtained; which GPUs

### Takeaway

Almost nothing. One Amazon voice says remote dev machines "can be scaled up with ... better GPUs". No GPU model, queue or reservation testimony for any company in scope.

### Cited Findings

- **Amazon, 2026-11-17, shellraiser. raw text.** "Remote dev machines can be scaled up with more memory and better GPUs ... using most of the CPU/GPU/memory". — [KiroCrew#38804](https://github.com/kirodotdev/KiroCrew/issues/38804)
- **Amazon, 2026-08-07, gabrielzpascual. raw text.** An engineer at a `dev-dsk` prompt tests an accelerator on a separate cluster node reached with `kubectl` (a `trn2.3xlarge` Trainium node in a HyperPod cluster), not on the dev desktop itself. — [sagemaker-hyperpod-cli#444](https://github.com/aws/sagemaker-hyperpod-cli/pull/444). A second PR matched the same search and shows `nvidia-smi` output for an `NVIDIA T4G`, but I did not confirm where that was run — [bottlerocket-core-kit#653](https://github.com/bottlerocket-os/bottlerocket-core-kit/pull/653).

### Inferences

- At Amazon the visible pattern is "CPU dev desktop plus a separately launched accelerator instance or cluster", the opposite of Meta's devgpu class in the earlier notes. One confirmed example; weak.

### Gaps

- Everything: OpenAI, Anthropic, DeepMind, NVIDIA, Tesla, Microsoft, ByteDance. A search for `nvidia-smi` output on `dev-dsk` hosts found none.

---

## Root/sudo, package installs, Docker, what is forbidden; patching and reboots

### Takeaway

Amazon engineers have passwordless root on their dev desktop (one explicit statement), but the machine is headless and lacks a per-user systemd session, which blocks some tooling. Unprivileged user namespaces, which agent sandboxes depend on, are a recurring failure point at Amazon and on OpenAI's Applied devboxes.

### Cited Findings

- **Amazon, 2026-09-03, patrigao. raw text.** "Observed live on a dev desktop: `sudo` is broken inside the sandbox (uid remap strips the setuid bit), but `ssh localhost 'sudo -n true'` succeeds, and dev-desktop sudoers grants `(root) NOPASSWD: ALL` — a complete root escape in one line." — [KiroCrew#8283](https://github.com/kirodotdev/KiroCrew/pull/8283)
- **Amazon, 2026-09-16, RohanK6. raw text.** "On a Cloud Dev Desktop (CDD) ... the host has **no `systemd --user` session bus** for the invoking uid, and the suggested remedy (`loginctl enable-linger`) itself fails with `Permission denied`"; "even with elevation the lookup itself fails on this host: `Failed to look up user <user>: No such process`". — [KiroCrew#11352](https://github.com/kirodotdev/KiroCrew/issues/11352). (The failed user lookup suggests accounts come from a directory service rather than local files; inference.)
- **Amazon, 2026-11-20, dma9527. raw text.** 53 tests fail on the dev desktop for "host-specific" reasons including "no user namespace for the design-tweak, terminal and app sandboxes". — [KiroCrew#39791](https://github.com/kirodotdev/KiroCrew/pull/39791)
- **Amazon, 2026-10-21, roeykel. raw text.** Software installs are not assumed: read-aloud fails "unless the user installs a TTS engine on the server, which they may not be allowed to do". — [KiroCrew#22710](https://github.com/kirodotdev/KiroCrew/issues/22710). Mild tension with the NOPASSWD statement: root exists, permission in the policy sense may not.
- **Amazon, 2026-11.** OS versions carry current date stamps ("Amazon Linux 2023.12.20261118", "…20261120", kernel "6.12.115"), so machines are patched within days. raw text. — [KiroCrew#40219](https://github.com/kirodotdev/KiroCrew/pull/40219), [#42743](https://github.com/kirodotdev/KiroCrew/pull/42743). **3 voices show a November 2026 OS build in November 2026.** Amazon Linux 2 desktops also remain in use (4 voices).
- **OpenAI, 2026-06-24 with a 2026-07-06 addendum, issue by legka. raw text.** "A Codex user on Applied devboxes reported that both `apply_patch` and general command execution became blocked after the local Bubblewrap sandbox could not read `/proc/sys/kernel/overflowuid`". The issue concerns "Ubuntu systems with AppArmor unprivileged user namespace restrictions". — [openai/codex#29908](https://github.com/openai/codex/issues/29908)
- **Instacart, 2023-10-19, mdeeks. raw text.** "live patching" was a requirement. — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **Microsoft, 2026-02-23.** Dev Box is a full Windows machine driven by remote desktop; no statement on admin rights. raw text. — [HN 47116833](https://news.ycombinator.com/item?id=47116833)

### Inferences

- **2 companies (Amazon, OpenAI), 2 voices:** the hardening or kernel configuration of the corporate dev machine collides with the user-namespace sandbox that coding agents use. This is a new, 2026-specific friction.

### Gaps

- No Docker statement for any company. No reboot cadence. Nothing on what is forbidden beyond the hints above.

---

## What the machine can reach: internet, package registries, intranet, production services, production data, logs

### Takeaway

Amazon dev desktops reach public package registries and GitHub directly (four voices show it working), and reach AWS services, including Bedrock for model access. Credentials are the real boundary: several systems require the laptop to complete browser sign-in on behalf of the remote host.

### Cited Findings

- **Amazon, public internet from the dev desktop.** `cargo` "Updating crates.io index" on a `dev-dsk` host (2026-10-17) — [hydro-project/infinity#157](https://github.com/hydro-project/infinity/issues/157); `git ls-remote --tags` against `https://github.com/awslabs/aws-c-s3.git` (2026-11-18) — [aws-c-common#1310](https://github.com/awslabs/aws-c-common/pull/1310); downloading and running a jar (2022-06-25) — [jython#191](https://github.com/jython/jython/issues/191); `gh api graphql` expected to work (2026-10-17) — [hydro-project/jj-pr#82](https://github.com/hydro-project/jj-pr/issues/82). raw text. **4 voices.** None shows whether a proxy sits in between.
- **Amazon, AWS services from the dev desktop.** `kubectl` against EKS and HyperPod clusters from `dev-dsk` prompts (2021, 2025, 2026) — [eks-perf-tests#79](https://github.com/awslabs/eks-perf-tests/issues/79), [sagemaker-hyperpod-cli#444](https://github.com/aws/sagemaker-hyperpod-cli/pull/444), [helm-charts#368](https://github.com/aws-observability/helm-charts/pull/368). raw text. 3 voices.
- **Amazon, model access, 2026-11-16, Pearcekieser. raw text.** On a cloud dev desktop, "Its Codex CLI uses the amazon-bedrock model provider". — [KiroCrew#38079](https://github.com/kirodotdev/KiroCrew/pull/38079)
- **Amazon, internal build system on the dev desktop.** "cached Brazil workspaces, warm build caches" as a reason to prefer one host (slibenja) — [KiroCrew#40267](https://github.com/kirodotdev/KiroCrew/issues/40267); "`brazil-build` on npm-based packages failing entirely inside agent sessions" (iamwhatever, 2026-08-03) — [KiroCrew#1339](https://github.com/kirodotdev/KiroCrew/pull/1339). raw text. 2 voices.
- **Amazon, logs, 2025-05-17.** From phone ssh, "im missing the ability to get cloudwatch logs" (earlier notes) — [HN 44017380](https://news.ycombinator.com/item?id=44017380).
- **Uber, 2025-11-07, pankti11. raw text.** Credentials are scoped to dev machines: "ussh isn’t available outside developer machines or Devpods (e.g., production hosts)." — [uber/arcanist#321](https://github.com/uber/arcanist/pull/321)
- **Databricks (per PR text), 2026-11-20, bbqiu. raw text.** "The browser-tab dbcert refresh on an Arca or Arclet only works while Arca Companion on the laptop is connected to the host." And dbczumar, 2026-10-20: the app "could create a fresh Arclet before the laptop had credentials for Companion to copy." Credentials originate on the laptop and are copied to the remote host. — [omnigent#14507](https://github.com/omnigent-ai/omnigent/pull/14507), [omnigent#11023](https://github.com/omnigent-ai/omnigent/pull/11023). **3 voices (bbqiu, dbczumar, dhruv0811 in [#11911](https://github.com/omnigent-ai/omnigent/pull/11911)).**
- **Databricks (per PR text), 2026-10-29, dhruv0811. raw text.** Network scoping by host: "remote sessions retain public browser tools but lose laptop private-network access, including the previous Arca exception." — [omnigent#12076](https://github.com/omnigent-ai/omnigent/pull/12076)
- **Instacart, 2023-10-19.** Machines sit "behind our firewall". raw text. — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **LinkedIn, 2026-02 to 2026-06.** rdev hostnames in public PRs: "`rdev-aks-…-cq4mx.corp.rdev.svc.cluster.local`" described as "Kubernetes pods / self-hosted CI runners", and data jobs "executed on rdev" at `rdev-aks-wus3-14.privatelink.westus3.azmk8s.io`. So rdev runs as pods on Azure Kubernetes Service with a private link, and can launch Airflow/Venice test jobs. raw text. — [linkedin/zookeeper#147](https://github.com/linkedin/zookeeper/pull/147), [linkedin/venice#2678](https://github.com/linkedin/venice/pull/2678). 2 voices.

### Inferences

- The trust anchor is the laptop (hardware-backed login, browser SSO); the dev machine borrows short-lived credentials from it. Stated outright for Databricks, implied for Uber (ussh) and consistent with Amazon's SSH-certificate remarks ("Surface SSH authentication/certificate failures", [KiroCrew#18593](https://github.com/kirodotdev/KiroCrew/issues/18593)).

### Gaps

- No statement on proxies or registry mirrors. Nothing on production data access from dev machines for any company.

---

## AI coding agents in 2025-2026: where they run and what they can reach

### Takeaway

The clearest finding of the pass. At Amazon, OpenAI, Databricks, Microsoft and Shopify, 2026 testimony shows agents running on the engineer's remote dev machine (or a disposable sibling of it), with the laptop reduced to a dashboard. Agent fleets are now what sizes the dev machine: one Amazon engineer runs 60-100 live agent sessions on one dev desktop, others ask for several desktops.

### Cited Findings

- **Amazon, 2026-11-06, chenmingwei23. raw text.** "one conductor session with about 32 directly managed sessions (team-lead "heads"), each running 1-4 worker sessions. That is roughly 60-100 live dashboard sessions" on one "Linux dev desktop". — [KiroCrew#31349](https://github.com/kirodotdev/KiroCrew/issues/31349)
- **Amazon, 2026-11-21, slibenja. raw text.** "Running a conductor with many workers is bounded by compute, memory and CPU, on one host ... parallel worker waves regularly exhaust the agent memory ceiling." — [KiroCrew#40267](https://github.com/kirodotdev/KiroCrew/issues/40267). With shellraiser ("Bots that share a host compete for its resources") — [#38804](https://github.com/kirodotdev/KiroCrew/issues/38804) and roeykel ("Connecting the desktop app to a remote dev desktop is a common setup") — [#22710](https://github.com/kirodotdev/KiroCrew/issues/22710). **4 voices: agents run on the dev desktop, laptop is the UI; 3 voices: one desktop is not enough.**
- **Amazon, sandbox inside the dev desktop, 2026-09-03, patrigao. raw text.** The agent's sandbox on a dev desktop could be escaped with `ssh localhost`, reaching passwordless root: "a complete root escape in one line". — [KiroCrew#8283](https://github.com/kirodotdev/KiroCrew/pull/8283). The sandbox also broke builds: "Multiple users report NPMPM / `brazil-build` on npm-based packages failing entirely inside agent sessions" — [KiroCrew#1339](https://github.com/kirodotdev/KiroCrew/pull/1339).
- **Amazon, 2025-05-17.** "with the gen ai cli tools ... i could skip lugging my laptop around ... when i get a good mcp" for logs (earlier notes) — [HN 44017380](https://news.ycombinator.com/item?id=44017380).
- **OpenAI, 2026-05-29 and 2026-06-03, starr-openai. raw text.** Validation lines such as "devbox: `cargo test -p codex-hooks ...`"; a repo skill "so other Codex devs can reuse the local and Applied devbox flow". And the 2026-07-06 report of "A Codex user on Applied devboxes" hitting sandbox failures. — [openai/codex#25024](https://github.com/openai/codex/pull/25024), [#26032](https://github.com/openai/codex/pull/26032), [#29908](https://github.com/openai/codex/issues/29908). **2 voices that Codex runs on OpenAI's Applied devboxes.** Press corroboration, snippet only: a Pragmatic Engineer piece is summarised as saying research teams used "workarounds to use it on development boxes before official support existed" — [newsletter.pragmaticengineer.com](https://newsletter.pragmaticengineer.com/p/openai-software-factory).
- **Databricks (per PR text), 2026-10 to 2026-11. raw text.** Agent sessions are placed on "Arca", an "Arclet Sandbox", or "This laptop"; "Run on Arca" is listed "above personal hosts"; long tasks are "Arca-hosted". — [omnigent#11023](https://github.com/omnigent-ai/omnigent/pull/11023), [#10868](https://github.com/omnigent-ai/omnigent/pull/10868), [#13950](https://github.com/omnigent-ai/omnigent/issues/13950), [#13018](https://github.com/omnigent-ai/omnigent/pull/13018). **4+ voices.** Reach is scoped: remote sessions "lose laptop private-network access" — [#12076](https://github.com/omnigent-ai/omnigent/pull/12076).
- **Microsoft, 2026-08-26, amunger. raw text.** Agent sessions run in VS Code on the dev box and are watched from the laptop: "Enabling remote connections in the agents window ... when opening vscode on my dev box ... to be able to see those sessions from my laptop." — [vscode#332769](https://github.com/microsoft/vscode/issues/332769)
- **Shopify, official 2026-10-22 (company source). fetched via extraction.** "Just three or four workflows were enough to max out a laptop." "If someone accidentally closed a laptop lid, the work stopped." "Agents connect to these machines over SSH." — [shopify.engineering/remote-dev](https://shopify.engineering/remote-dev)
- **Outside the named companies, 2026-05-21, vikas-faire. raw text.** The same pattern stated plainly by a user at another firm: "My larger repositories do not live locally on my Mac; they live in managed remote development environments because of repo size, dependencies, credentials, and compute requirements ... I can SSH into my DevBox and run Codex CLI manually." — [openai/codex#23907](https://github.com/openai/codex/issues/23907)

### Inferences

- The agent goes where the checkout, build cache and credentials already are, which is the dev machine. The laptop keeps the human-facing parts: dashboard, browser sign-in, screenshots.
- Three placements are visible: the engineer's own persistent machine (Amazon, Microsoft, OpenAI), a fresh sandbox per session (Databricks Arclet, Shopify Macs), and a pool across several machines (requested at Amazon, not yet built).

### Gaps

- No testimony on what internal systems agents may read (wiki, bug tracker, code search, production data, logs) beyond the Amazon CloudWatch remark. Nothing for Anthropic, DeepMind, Meta-style on-demand pools, or any policy text.

---

## What people liked and hated

### Takeaway

Liked: more power than a laptop and no local setup (Microsoft, Airbnb, Instacart, LinkedIn). Hated: slowness and IDE lag (Uber, three voices), the Mac-to-Linux sync tooling (Amazon 2022), and the headless box's missing desktop plumbing (Amazon 2026).

### Cited Findings

- **Microsoft, 2026-02-23, locusofself. raw text.** "A lot of us resisted this at first, but then just kindof came to accept it". — [HN 47116833](https://news.ycombinator.com/item?id=47116833). An outside commenter's reading: "back to the days of using a single shared server for software development in timesharing setup" (pjmlp) — [HN 47120189](https://news.ycombinator.com/item?id=47120189).
- **Instacart, 2023-10-19, mdeeks (builder, so not neutral). raw text.** "hugely successful and likely one of the largest boosts to developer productivity in our history". — [HN 37938537](https://news.ycombinator.com/item?id=37938537)
- **Airbnb, 2023-10-19. raw text.** "a huge improvement over what we had in the past". — [HN 37937401](https://news.ycombinator.com/item?id=37937401)
- **Unnamed company, 2023-10-19, paxys. raw text.** "Given a choice I don't think any dev at my company would go back." — [HN 37936660](https://news.ycombinator.com/item?id=37936660)
- **Unnamed company, the minority view, 2023-10-19, AlotOfReading. raw text.** "it works well enough for maybe 90% of devs at my company ... most of my team are in that 10% and now that 90% of the company have their needs met, we're getting pressure to conform because maintaining all the physical infrastructure for a small group gets expensive." — [HN 37937323](https://news.ycombinator.com/item?id=37937323)
- **Uber, 2022-11-03, ameeta-uber. raw text.** "have to use devpod which is quite slow and is affecting productivity." — [uber/h3-java#116](https://github.com/uber/h3-java/issues/116). Third independent Uber complaint after the two in the earlier notes.
- **Amazon, 2022-07-14, ActorNightly. raw text.** "internal tooling sucks (they have a tool that basically rsyncs directories over ssh just so you can develop on your mac), and causes additional issues due to incompatibility of some JNI native libraries, case sensitivity of the file system". — [HN 32091232](https://news.ycombinator.com/item?id=32091232)
- **Amazon, 2026, headless friction.** No user systemd bus (RohanK6), no speech engine (roeykel), symlinked home breaks path hardening (andrewtakeshi). raw text. — [KiroCrew#11352](https://github.com/kirodotdev/KiroCrew/issues/11352), [#22710](https://github.com/kirodotdev/KiroCrew/issues/22710), [#13172](https://github.com/kirodotdev/KiroCrew/issues/13172)

### Gaps

- No Microsoft Dev Box complaint in the engineer's own words beyond "resisted". No Amazon cost or lag complaint that I could read (the Blind thread in the earlier notes remains unread).

---

## Angles for an essay

### Concrete specs found

| Company | Machine type | Cores / RAM / disk / GPU | Date | Independent sources |
| --- | --- | --- | --- | --- |
| Amazon | dev desktop, AL2 x86_64 | 16 vCPU / 30 GiB | 2026-11 | 1 |
| Amazon | dev desktop, AL2023 x86_64 | 16 vCPU / 61 GB | 2026-11 | 3 (plus 1 outside contributor) |
| Amazon | dev desktop | 16 vCPU / 123 GiB | 2026-11 | 1 |
| Amazon | dev desktop | 32 vCPU / 61 GB | 2026-11 | 1 |
| Amazon | dev desktop, x86_64 and aarch64 | 32 vCPU / 123 GB | 2026-11 | 2 |
| Amazon | dev desktop, x86_64 and aarch64 | 32 vCPU / 246-247 GB | 2026-11 | 5 |
| Amazon | dev desktop | 48 vCPU / 184-186 GiB | 2026-11 | 2 |
| Amazon | dev desktop | 64 vCPU / 123 GB | 2026-11 | 1 |
| Amazon | dev desktop | 128 vCPU / 247 GiB | 2026-11 | 1 (possibly shared account) |
| Amazon | cloud dev desktop | 128 vCPU / 493 GiB | 2026-11 | 1 |
| Amazon | dev desktop | 192 vCPU / 740 GB | 2026-11 | 1 |
| Amazon | dev desktop local NVMe | 977 GB free at 77% used (about 4 TB by arithmetic) | 2026-11 | 1 |
| Amazon | dev desktop filesystem | `/home/<user>` → `/local/home/<user>`; `/workplace` work volume | 2026-09 to 11 | 3 and 3 |
| Amazon | engineer's laptop | Apple M4 Pro, 48 GB | 2026-01 | 1 |
| Instacart | Bento Remote (EC2) | 64 GB needed for largest apps; ~2 min to provision | 2023-10 | 1 |
| Uber | devpod | Debian 12, aarch64 and amd64; one run at 24 threads; "two-socket x86 devpods" | 2026-09 | 1 |
| LinkedIn | rdev | Kubernetes pods on AKS (hostnames), no sizes | 2026-02 to 06 | 2 |
| Microsoft, OpenAI, Databricks, Airbnb | Dev Box, Applied devbox, Arca, in-house CDE | no sizes found | — | 0 |

### Best-corroborated claims (two or more independent people)

| Claim | Company | Voices | Read |
| --- | --- | --- | --- |
| Each engineer has a personal, persistent Linux dev desktop; the laptop is the client | Amazon | 10+ (2016-2026, with earlier notes) | raw text |
| Dev desktop sizes in 2026 run from 16 to 192 vCPU; 32 vCPU / ~256 GB is common among agent users | Amazon | 19 | raw text |
| Home is `/local/home/<user>` on local disk; checkouts go in `/workplace` | Amazon | 3 each | raw text |
| Engineers can upsize the machine themselves | Amazon | 3 (2018, 2026, 2026) | raw text |
| Engineers hold more than one dev desktop | Amazon | 4 | raw text |
| Dev desktop reaches public registries and GitHub directly | Amazon | 4 | raw text |
| Editing on the Mac with rsync-style sync existed (2017, 2022); VS Code Remote-SSH is used now | Amazon | 2 and 2 | raw text |
| Coding agents run on the dev machine, laptop is the dashboard | Amazon 4, Databricks 4+, OpenAI 2, Microsoft 1, Shopify (official) | 11+ across 5 companies | raw text (Shopify: extraction) |
| The agent's user-namespace sandbox fails or is escapable on corporate dev machines | Amazon 2, OpenAI 1 | 3 | raw text |
| Engineers work on Dev Box via remote desktop | Microsoft | 4 (one says "pretty much all") | raw text |
| Devpod is slow / laggy | Uber | 3 (2 in earlier notes + 1) against 1 builder | raw text |
| Remote sign-in must be completed on the laptop and credentials copied to the host | Databricks | 3 | raw text |
| Fresh machine per project or branch from a pool, in minutes | Instacart 1, Airbnb 1, unnamed 1 | 3 across companies | raw text |

### Angles (3-5)

1. **The agent moved in with the checkout.** In 2026 testimony from five companies, agents run on the dev machine, not the laptop. The stated reasons are the engineer's own: the laptop "isn't very powerful", three or four workflows max it out, closing the lid stops the work, and the repo, credentials and build cache are already remote. The laptop is becoming a dashboard and a login token.
2. **Agents, not humans, now size the machine.** A human needed 4 vCPU in 2018. The 2026 Amazon sample starts at 16 and reaches 192 vCPU and 740 GB, and the people at the top still say one host "doesn't scale far enough" for 60-100 concurrent sessions. The next request is a pool of machines with a scheduler, which is a small cluster per engineer.
3. **Root on the box, but the box is not a desktop.** Amazon gives passwordless sudo, yet the machine has no user session bus, no audio, a symlinked home, and restricted user namespaces. The friction in 2026 is less "may I install this" than "this tool assumed a laptop". The same namespace restriction breaks agent sandboxes at Amazon and OpenAI, and at Amazon the sandbox was escapable via `ssh localhost`.
4. **Pets and cattle now coexist.** Amazon dev desktops, Microsoft Dev Boxes and Databricks Arca hosts are long-lived and personal. Instacart, Airbnb, Databricks Arclets and Shopify's agent Macs are created per task and destroyed. Agent work is the main force pushing toward the disposable kind.
5. **Windows went to remote desktop; Linux went to SSH.** Microsoft engineers describe a full remote desktop session and initial resistance; everyone else describes an editor or terminal attached over SSH. The SSH camp pays in missing desktop plumbing; the remote-desktop camp pays in pixels.

### Gaps

- **No testimony found at all** for Apple, Netflix (job-posting snippets only mention a "Dev Spaces" team and a "fledgling internal remote workspace product"), Lyft, Dropbox, Pinterest, Snap, X/Twitter, Salesforce, Oracle, Snowflake, Palantir, Datadog, Atlassian, Anthropic, DeepMind, NVIDIA, Tesla, SpaceX, ByteDance, Alibaba, Tencent, game studios, chip companies.
- **Shopify Spin's fate is unconfirmed.** I found no individual or official statement that Spin was retired or what replaced it. The 2026 official post does not mention Spin and says mobile teams worked locally.
- **GitHub's internal Codespaces use** has only the 2021 official claim and outsider reactions; no employee account of daily use, size or limits.
- **GPUs:** nothing usable outside Meta (earlier notes).
- **Disk:** one free-space figure for Amazon; no quotas, no rebuild survivors, no disk-full episode for any company in scope.
- **Policy text and production-data reach:** none.
- **Microsoft Dev Box sizes, rebuild cadence, CloudBuild and 1ES pools:** no individual testimony found.
- **Source skew.** The Amazon size data comes from one repository of agent enthusiasts in one month, with templated PR text. A second, independent source for typical (non-agent) dev desktop sizes is still missing. Reddit and Blind, where such statements usually live, were unreachable.
- **Attribution risk.** The Databricks attribution rests on PR text in a third-party organisation's repository; the OpenAI "Applied devbox" items rest on handle suffixes. Neither is a stated employer claim.
