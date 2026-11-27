# Engineer testimony on remote development machines: specs, GPUs, disk, root, leases, laptops

Scoping pass, 2026-11-26. About 35 searches/fetches.

## How to read these notes

- **Evidence class.** Almost everything here is individual testimony (HN comments, public GitHub issues). It is weak evidence. Where two independent mentions agree I say so; otherwise treat as one person's account.
- **How each item was read.**
  - `API` = raw text pulled from the Hacker News Algolia API or the GitHub REST API (HTML stripped, otherwise verbatim). Quotes are exact as returned.
  - `WF` = WebFetch, which passes the page through an extraction model. Quotes marked WF **must be re-checked against the page** before publication.
  - `snippet` = search-result summary only; page not read.
- **Who said it.** Handle plus the employer the person claims on the page. I have not verified any employment claim.
- **Method note.** The most productive source was not blogs but (a) HN comment threads and (b) public GitHub issues in which employees paste environment dumps from their dev machines (`collect_env`, `nvidia-smi`, hostnames such as `devgpuNNN.<dc>.facebook.com`). General web search returned almost nothing; Blind (HTTP 402) and Medium (HTTP 403) could not be fetched.
- AV companies skipped, per brief.

---

## GPUs: on the personal dev machine, a separate machine type, a reservation or queue?

### Takeaway

Meta is the only company where I found concrete evidence: there is a distinct GPU devserver class with hostnames `devgpuNNN`, and public PyTorch issues let you watch its GPU generation change from Tesla M40 (2018) through V100, A100, H100 to B200 (2026). Engineers speak of "my devgpu" (personal) and also of a "shared devgpu". I found nothing on GPU dev machines at Google, Amazon, Stripe, Microsoft or the finance firms.

### Cited Findings

- **Meta, 2018-12-19.** A PyTorch issue's environment block shows `GPU 0: Tesla M40`, `GPU 1: Tesla M40`, `OS: CentOS Linux 7 (Core)`, with the note "(this is conda workflow on a devgpu)". Issue author is a PyTorch maintainer; read via API. — [pytorch/pytorch#15401](https://github.com/pytorch/pytorch/issues/15401)
- **Meta, 2020-11-18.** "Some how changing the scalar value still affects timing on my machine (fb devgpu)"; the same issue reports "GPU models and configuration: V100". API. — [pytorch/pytorch#48163](https://github.com/pytorch/pytorch/issues/48163)
- **Meta, 2023-01-18.** "This is on a fairly normal source build of PyTorch on a Meta A100 devgpu. NVIDIA PG509-210, driver and runtime is CUDA 11.4". A 2024-09-17 comment in the same issue: "with a A100 devgpu". API. — [pytorch/pytorch#92582](https://github.com/pytorch/pytorch/issues/92582)
- **Meta, 2024-01-22.** "haven't been able to repro the regression locally on A100 devgpus." API. — [pytorch/pytorch#118010](https://github.com/pytorch/pytorch/issues/118010)
- **Meta, 2024-12-18.** Environment block from a self-described "my devgpu": `OS: CentOS Stream 9 (x86_64)`, `GPU 0: NVIDIA H100`, `CPU(s): 46`, `Model name: AMD EPYC 9654 96-Core Processor`. Follow-up 2025-01-21: "Tried on another devserver, couldn't repro, closing." API. — [pytorch/pytorch#143524](https://github.com/pytorch/pytorch/issues/143524)
- **Meta, 2025-09-04.** "This is on an H100 devgpu ... `min(32, len(os.sched_getaffinity(0)))` ... which for me returns 384". The same thread contains a `collect_env` block for host `devgpu034` with `GPU 0: NVIDIA H100` and `CPU(s): 46`, and a colleague's reply "Weird. I can't repro even on your devserver...". Which participant owns which machine was not untangled. API. — [pytorch/pytorch#162199](https://github.com/pytorch/pytorch/issues/162199)
- **Meta, 2026-05-05.** A self-identified Meta engineer ("in my devserver at meta") posts a hardware dump: host `devgpu011.ldc3.facebook.com`, CentOS Stream 9, kernel `6.13.2-0_fbk12`, two lines of `NVIDIA H100, 580.82.07, 97871 MiB`, "4x Mellanox ConnectX-7". A maintainer replies "I tried this on my devgpu with (seemingly) identical specs" and "the best way for me to deal with this would be to get access to your devgpu. Would that be possible?" API. Note: 97,871 MiB is not the usual 80 GB H100 figure; recorded as posted. — [meta-pytorch/monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- **Meta, 2026-02-20 and 2026-03-10.** Repro steps begin "On B200 devgpu, run: `torchrun --nproc_per_node=4 ...`" (implying at least four GPUs visible). API. — [pytorch/ao#3926](https://github.com/pytorch/ao/issues/3926), [pytorch/pytorch#177059](https://github.com/pytorch/pytorch/issues/177059)
- **Meta, 2026-10-02.** Not everyone has the newest card: "I couldn't run it, since NVFP4 needs B200 and this devgpu has H100s". API. — [pytorch/pytorch#199505](https://github.com/pytorch/pytorch/issues/199505)
- **Meta, 2025-06-26. Shared GPU machines exist.** "perhaps was run on a shared devgpu where someone else was using GPU memory as well" and the reply "it could be due to I ran them on a shared devgpu." API. — [pytorch/torchtitan#1344](https://github.com/pytorch/torchtitan/issues/1344)
- **Meta, 2024-10-28.** Dev GPUs are not benchmark-grade: "I think the time variability from run to run is expected when running on a devgpu." API. — [pytorch/benchmark#2527](https://github.com/pytorch/benchmark/issues/2527)
- **Meta, 2019-06-12.** A second fleet name appears: "100% reproducible on devgpu and devfair." API. — [pytorch/pytorch#21700](https://github.com/pytorch/pytorch/issues/21700)
- **Meta, official talk, 2023-12-19.** Henrique Andrade (QCon): GPU devservers are a requested flavor: "if an ML engineer is working on software that requires access to a GPU". No models or counts. WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Meta, 2024-11-06.** Anonymous commenter (claims past Facebook): "Three years later, otoh you couldn't find a devserver without tripping over an NN along the way." (about circa 2016). API. — [HN 42066977](https://news.ycombinator.com/item?id=42066977)

### Inferences

- Meta's GPU dev machine is a separate class with its own hostname prefix, not a GPU bolted on to every devserver. The fleet's GPU generation tracks the training fleet with a lag: M40 (2018), V100 (2020), A100 (2023-24), H100 (2024-26), B200 (2026).
- The "46 CPUs + 1 H100" shape on an EPYC 9654 host reads like a VM slice of a larger GPU server; the "384" affinity count and the 2-H100 / 4-NIC box read like larger or bare-metal allocations. This is inference from two dumps, not a stated fact.
- Both personal ("my devgpu") and shared devgpus exist. Colleagues can be given access to each other's machine for debugging.

### Gaps

- No evidence of how a devgpu is obtained: reservation, queue, approval, quota per team, or expiry. No complaints about scarcity found.
- Nothing on GPUs for Google Cloudtop, Amazon Cloud Desktop, Stripe devboxes, Microsoft Dev Box (internal use), OpenAI, Anthropic, DeepMind, NVIDIA, or the finance firms.
- Issues with Ubuntu / RTX environment blocks that merely mention "devgpu" in another comment were excluded as probably external reporters.

---

## Size: cores and RAM of standard and large dev machines; can engineers pick a bigger one?

### Takeaway

Self-service sizing is attested at Amazon (pick your own EC2 type; one engineer on a 4-vCPU i3.xlarge in 2018) and Stripe ("a range of options", none below a high-end laptop, 2024). Single data points put a Google Cloudtop at 96 hardware threads (2021) and a Meta devserver at "~50-100 cores" (2025).

### Cited Findings

- **Amazon, 2018-03-11.** Throwaway account claiming Amazon: "Most amazon employees now use ec2 instances as their development environment so using a x1e.32xlarge with 128 vCPU's ... 3,904 GiB of memory ... is possible. Granted, I don't know anyone that uses that much and you would probably get asked by management for using a dev desktop that big but you can if you need to. I myself use just a i3.xlarge with 4 vCPU's, 30.5 or memory ... and 1 x 0.95 NVMe SSD." API. — [HN 16561995](https://news.ycombinator.com/item?id=16561995)
- **Amazon, undated Blind thread (snippet only, page returned HTTP 402).** Search summary reports one commenter on an "i3.xl" who says you upgrade the cloud desktop yourself and managers do not notice, and others calling cloud dev desktop input lag unusable. Unverified; agrees with the HN item above on i3.xlarge and self-service. — [Blind: amazon machine configuration](https://www.teamblind.com/post/amazon-machine-configuration-hqvtcabb)
- **Amazon, 2016-09-18.** Self-identified Amazon employee: "an i7 13" Retina MacBook Pro as well as a cloud desktop (courtesy of AWS) with scaling hardware as I need it for development." API. — [HN 12524546](https://news.ycombinator.com/item?id=12524546)
- **Amazon, 2011-12-27/28 (the before picture).** Two self-identified (ex-)Amazon engineers independently describe the physical dev desktop: "I got a 140GB drive in my dev desktop ... They only give us 4GB [RAM]" and "my dev desktop had a 140GB drive, with 4GB RAM, and a Celeron CPU. A full build of my code base took 15 minutes". API. — [HN 3397769](https://news.ycombinator.com/item?id=3397769), [HN 3398001](https://news.ycombinator.com/item?id=3398001)
- **Google, 2021-01-29.** A Google engineer filing an Emscripten feature request: LLVM thread pools "try to spawn 96 workers on my CloudTop". API. — [emscripten#13372](https://github.com/emscripten-core/emscripten/issues/13372)
- **Google (physical workstation), 2021-11-29.** Self-described former Chromium developer: "a 'specialist' dev workstation, an HP Z840 dual 18 core Xeon with 256GB of RAM. And that's a model from many years ago now, the newer specialist workstations are even heftier. To work on chrome @ Google you absolutely need one." API. — [HN 29386161](https://news.ycombinator.com/item?id=29386161)
- **Google, 2026-05-13.** Hardware refresh is gated: "I use a workstation specifically to improve latency. Needed to get approval at some point to get a refresh though." API. — [HN 48125403](https://news.ycombinator.com/item?id=48125403)
- **Meta (not named, strongly implied), 2025-05-28.** "most development was done either on your development server running a datacenter (think ~50-100 cores) - or on an 'on demand' machine that was like a short lived container". API. — [HN 44112625](https://news.ycombinator.com/item?id=44112625)
- **Meta, 2024-12 and 2025-09.** GPU devservers show `CPU(s): 46` on AMD EPYC 9654 (see GPU section). — [pytorch/pytorch#143524](https://github.com/pytorch/pytorch/issues/143524)
- **Meta, official talk, 2023-12-19.** "We offer different flavors of devservers, from VMs, which can have different sizes"; physical servers for "low-level kernel development, native device drivers". No numbers. WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Stripe, 2024-08-19.** bhuga ("I work on this at Stripe"), asked the instance size: "We have a range of options devs can choose, but I don't think any of them are smaller than a high-end laptop." API. — [HN 41292159](https://news.ycombinator.com/item?id=41292159)
- **Microsoft, official, 2023-05-23.** "over 9,500 Microsoft engineers are using Dev Box"; no VM sizes given. Search summary of a 2024-12 post gives "almost 45,000 Microsoft developers" (snippet). WF, re-check. — [Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/dev-box-for-microsoft-engineers/)
- **Cost counter-argument, 2024-08-19.** Non-employee: "a 1TB ebs volume with equivalent performance to a MacBook will probably cost more than the MacBook every month." API. — [HN 41294021](https://news.ycombinator.com/item?id=41294021)

### Inferences

- Amazon's model is "choose an EC2 instance type, social pressure is the limit". Stripe's is a menu. Google's physical refresh needs approval. These are three different rationing mechanisms: social, catalogue, and approval.
- Typical machine is much smaller than the maximum allowed. The one Amazon data point is 4 vCPU / 30.5 GB.

### Gaps

- No RAM figure for a Cloudtop or a standard Meta devserver. No size tiers named for any company. No current (2024-26) Amazon figure.
- Nothing for LinkedIn, Uber, Airbnb, Dropbox, Netflix, Databricks, Snowflake, Palantir, OpenAI, Anthropic, finance firms.

---

## Disk: local disk, home quotas, network homes, disk-full episodes, wipes, backups, where caches live

### Takeaway

The weakest area. The only concrete numbers are an Amazon i3.xlarge's 0.95 TB NVMe (2018) and a Googler filling a Cloudtop with 150 GB of test debris (2022). Google's source lives on a network filesystem (CitC), so the working tree takes no local disk; Meta says devserver contents can be wiped at random in drills and that user backups are automatic.

### Cited Findings

- **Google, 2022-05-17/20.** A Flutter DevTools engineer: "realized that my cloudtop was running out of memory ... `test/fixtures` had grown to 34GB"; later "There is still 150GB of bloat on the file system" and "I have accumulated 119GB of /tmp flutter files". (This is an open-source checkout on local disk, not google3.) API. — [flutter/devtools#4111](https://github.com/flutter/devtools/issues/4111)
- **Google, 2023-08-08.** Googler working on jj: "we do all development inside a FUSE-mounted virtual FS called 'client in the cloud' (CitC), so working anywhere inside our giant monorepo doesn't take any disk space (except caching)." API. — [HN 37043602](https://news.ycombinator.com/item?id=37043602)
- **Google, 2026-05-13.** The network filesystem has a cost: "sometimes my neovim is very slow and laggy because of the remote connection / network file system". API. — [HN 48125361](https://news.ycombinator.com/item?id=48125361)
- **Google, 2022-10-06.** Affection for it: "a magically disk that acts like it is infinitely sized and everywhere all at once with low latency and versioned by the second." API. — [HN 33112821](https://news.ycombinator.com/item?id=33112821)
- **Google, 2026-11-06.** Reprovision cost: "I can provision a new cloudtop and download a clean copy of my repo in around an hour ... about 15 minutes to de-provision the old cloudtop and provision a new one. After that I'd kick off 45 minutes of git cloning ... I've had to do this twice ... both were due to bad updates my cloudtops got." (A git-based team, not google3.) API. — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- **Meta, official talk, 2023-12-19.** Disaster drills include "tooling to potentially wipe the contents of random devservers"; "transparent and automated user backups"; "they should never be running a production service on their devserver". WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Meta, 2024-12 and 2025-09 (incidental).** Shell prompts and paths in public issues show work living under `~/local/...` and `/data/users/<user>/...` rather than directly in home. API. — [pytorch/pytorch#162199](https://github.com/pytorch/pytorch/issues/162199), [pytorch/pytorch#143524](https://github.com/pytorch/pytorch/issues/143524)
- **Amazon, 2018-03-11.** "1 x 0.95 NVMe SSD" on the commenter's i3.xlarge dev desktop. API. — [HN 16561995](https://news.ycombinator.com/item?id=16561995)
- **Stripe, 2024-08-20.** State that is expensive to rebuild is test data, not code: "many developers need to set up complex test data ... These devs tend to re-use their servers until our company-wide max age." API. — [HN 41300606](https://news.ycombinator.com/item?id=41300606)

### Inferences

- The `~/local` and `/data/users` paths at Meta suggest a small (possibly network or backed-up) home plus large local scratch, a classic split. This is inferred from path names only.
- Instance-store NVMe on an Amazon i3 is ephemeral by EC2 design, which would mean a stop/start loses it; the commenter does not say how that is handled.

### Gaps

- No home-directory quota figure for any company. No statement of NFS-mounted homes. No disk-full war story from Meta or Amazon. No account of what survives a Cloudtop or devserver reprovision beyond the Meta talk's "automated user backups".

---

## Root and software: sudo, package installs, Docker, VMs, patching, reboots, expiry

### Takeaway

Root is normal: sudo on Google's gLinux (a named Google kernel engineer, 2020), `yum install` on Meta devgpus (2018), and Stripe developers who "edit stuff in /etc". What is controlled is the base image, the update channel and the lifetime. Stripe enforces a company-wide maximum host age; Google forbade desktop hypervisors on workstations.

### Cited Findings

- **Google, 2020-04-08.** tytso (well-known Google Linux kernel engineer): "you can use 'sudo' to get root access on gLinux desktops and servers." API. — [HN 22817963](https://news.ycombinator.com/item?id=22817963)
- **Google, 2022-12-22.** Googler maintaining a Rust course: "the course suggests using apt since that's an easy security-approved way to install things on our computers". API. — [HN 34092187](https://news.ycombinator.com/item?id=34092187)
- **Google, 2023-07-19.** Ex-Googler galkk: "Googlers by default, though, aren't allowed to run vms (VMware/virtualbox style) on their desktops/workstations." and "Think about cloudtop as about just box where you ssh." API. — [HN 36781022](https://news.ycombinator.com/item?id=36781022), [HN 36781488](https://news.ycombinator.com/item?id=36781488)
- **Google, 2026-06-08.** Self-described former endpoint-security engineer on gLinux's weakness: "no boundary between user and root, everything can trivially escalate privs". API. — [HN 48448278](https://news.ycombinator.com/item?id=48448278)
- **Google, 2026-11-06.** Fleet updates can break machines: both of one engineer's Cloudtop rebuilds "were due to bad updates my cloudtops got." API. — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- **Meta, 2018-02-17.** "gcc 4.8.5 ... This is the default devgpu GCC. You have to `yum install libasan` to get the shared library". Implies package installation with root. API. — [pytorch/pytorch#5283](https://github.com/pytorch/pytorch/issues/5283)
- **Meta, 2018 to 2026.** OS on dev machines moved from "CentOS Linux 7 (Core)" (2018) to "CentOS Stream 9" with an `fbk` kernel (2024-26). Engineers run conda environments on them. API. — [pytorch/pytorch#15401](https://github.com/pytorch/pytorch/issues/15401), [monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- **Meta, 2024-11-16.** Things appear on the box that the owner did not install: "i had a `fr_trace` in /usr/local/bin/fr_trace on my devserver. not sure how it got there". API. — [pytorch/pytorch#140879](https://github.com/pytorch/pytorch/issues/140879)
- **Meta, official talk, 2023-12-19.** "these updates are, for the most part, automatically deployed"; "most common maintenance operations are touchless from a server's owner's standpoint"; "When a live migration is taking place, an engineer doesn't even have to power down their VM." WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Meta, 2021-02-23.** Ex-Facebook engineer reissbaker: "tools engineers can SSH directly into your instance and see what the problem is, fix it, and also ship preemptive fixes to everyone else." API. — [HN 26243011](https://news.ycombinator.com/item?id=26243011)
- **Stripe, 2024-08-19.** bhuga: "Folks will edit stuff in /etc, add dotfiles, add little cron jobs, build weird little SSH tunnels, whatever." On the managed alternative: "the dev servers update constantly. There's a dozen moving parts on them and most of them deploy several times a day without downtime. There's a maximum host lifetime and well-documented hooks for how to customize a server when it's created". API. — [HN 41292159](https://news.ycombinator.com/item?id=41292159)
- **Stripe, 2024-08-19.** Broken customisation is detected, not prevented: "If someone configures their host until that dev runner breaks, it fails a healthcheck and that's obvious to me in a support role." Trade-off admitted: "it's harder to add something to our servers than to test out a new kind of database on your local VM". API. — [HN 41293396](https://news.ycombinator.com/item?id=41293396)
- **Stripe, 2024-08-19.** Why not laptops: "the laptops skew across literally years of versions of dev tools"; "laptops still pop up with the old version as folks turn them back on after a very long time". API. — [HN 41291251](https://news.ycombinator.com/item?id=41291251), [HN 41294105](https://news.ycombinator.com/item?id=41294105)
- **Finance / locked-down contrast, 2022-10-06.** Anonymous: "you can be trusted to invest or trade $X mln dollars ... but God forbid you try to install VSCode or MobaXTerm on your own." No firm named. API. — [HN 33106858](https://news.ycombinator.com/item?id=33106858)

### Inferences

- The pattern is "root, but perishable". Engineers can change anything; the platform team's lever is that the machine will be updated underneath them and eventually replaced, with documented hooks as the sanctioned way to persist customisation.
- Stripe's point that a managed server can be updated continuously while a local VM is frozen at creation is an argument the official posts do not make this plainly.

### Gaps

- No statement on Docker or kernel modules for any company (one Meta dump shows `nvidia_peermem` loaded, which says nothing about who loaded it). No reboot cadence. No Cloudtop or Meta devserver maximum age. Stripe's maximum age figure is not given.

---

## How many machines an engineer may hold; reservation, lease, renewal; reclaiming idle machines

### Takeaway

Three lifetimes are attested: Meta's permanent or short-lease devservers plus OnDemand containers that die after about a day and a half; Stripe's servers with a company-wide maximum age, which some engineers create several times a day; and Google's standing Cloudtop, one per software engineer by one account. Numeric caps on machines per person were not found anywhere.

### Cited Findings

- **Meta, official talk, 2023-12-19.** Devservers: "they might request it temporarily with a short-term lease, or they might be permanent." OnDemand: "the container instances themselves are ephemeral, lasting a little over a day." / "They live for a day and a half and are then disposed of." WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Meta, 2021-02-23.** reissbaker (ex-Facebook): "in FB's case, it took seconds to get one of the 'OnDemand' servers." API. — [HN 26243011](https://news.ycombinator.com/item?id=26243011)
- **Meta, 2025-05-28.** OnDemand described as "a short lived container that generally stayed up to date with known good commits every few hours." API. — [HN 44112625](https://news.ycombinator.com/item?id=44112625)
- **Meta, 2025-01-21 and 2026-05.** Engineers have access to more than one: "Tried on another devserver, couldn't repro"; "I tried this on my devgpu with (seemingly) identical specs". API. — [pytorch/pytorch#143524](https://github.com/pytorch/pytorch/issues/143524), [monarch#3759](https://github.com/meta-pytorch/monarch/issues/3759)
- **Stripe, 2024-08-20.** bhuga: some developers "tend to re-use their servers until our company-wide max age. Others, to be fair, spin up a new machine for every branch, multiple times per day". Also: code living on the server "has opened up a lot of use cases where devs can have multiple branches in flight at once." API. — [HN 41300606](https://news.ycombinator.com/item?id=41300606), [HN 41291828](https://news.ycombinator.com/item?id=41291828)
- **Google, 2023-07-19.** amf12: "Every Software role employee at Google has two computers, a laptop and a cloudtop." Another Googler (2022-09-04): "You at least have a laptop and a workstation. Possibly several of each." A third (2022-07-13): "a gLinux Desktop, a gLinux Cloud VM, and a macOS laptop." API. — [HN 36782271](https://news.ycombinator.com/item?id=36782271), [HN 32717013](https://news.ycombinator.com/item?id=32717013), [HN 32078696](https://news.ycombinator.com/item?id=32078696)
- **Google, 2023-07-19.** Workstations are being given up: "I don't even have a workstation anymore. Just ssh into the cloud box to build and run code." API. — [HN 36781258](https://news.ycombinator.com/item?id=36781258)
- **Microsoft, official, 2023-05-23.** Teams get Dev Box projects by pull request to an infrastructure-as-code repo; per-engineer limits not stated. WF, re-check. — [Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/dev-box-for-microsoft-engineers/)

### Inferences

- "Machine per branch" at Stripe and day-and-a-half containers at Meta show the unit of allocation drifting from "my machine" toward "my task", which matters for coding agents. The Google 2026 comment about containing an agent's damage to one Cloudtop points the same way.

### Gaps

- No per-person cap, no renewal step, no idle-reclaim policy, no account of a machine being taken away, for any company. No Amazon lease facts.

---

## Code on the laptop: rules for or against; what the laptop is for

### Takeaway

The best-supported finding of the pass. Multiple independent Googlers say google3 source may not be on a laptop, with Android, Chromium and iOS work as exceptions. Two Stripe engineers independently say code moved off laptops between 2019 and 2024. Amazon is the outlier: as of 2017 its Cloud Desktop creator said a lot of development happened on the laptop and synced.

### Cited Findings

- **Google, 2026-05-13.** compiler-guy: "Very little development in Google3 happens locally. You aren't even allowed to keep the source code on your local disk, and this is true no matter what OS it runs. (Android and Chromium are different though.)" API. — [HN 48124944](https://news.ycombinator.com/item?id=48124944)
- **Google, 2022-09-04.** rwiggins ("I work at Google"): "I believe there is no code at all stored on laptops, barring some exceptions." and "CitC workspaces aren't mounted on laptops, so no MacOS support. I think sshfs is permitted". API. — [HN 32717013](https://news.ycombinator.com/item?id=32717013), [HN 32721894](https://news.ycombinator.com/item?id=32721894)
- **Google, 2022-08-01.** readams: "Lots of people have Mac laptops but you can't use them for anything but remote into a gLinux desktop or virtual machine to do development ... Basically, at Google, a laptop is just a web browser." API. — [HN 32306501](https://news.ycombinator.com/item?id=32306501)
- **Google, 2022-06-09 and 2022-06-27.** Reasons and exceptions: "I believe that there are also a bunch of IP reasons for this policy, but from a practical perspective doing everything with citc and blaze is really the only option." / "Google lets iOS and Android app developers work off laptop". API. — [HN 31681993](https://news.ycombinator.com/item?id=31681993), [HN 31895078](https://news.ycombinator.com/item?id=31895078)
- **Google, 2026-05-13 to 15.** Laptop mix: "I do most of my development on a MacBook air and a Chromebook. The ~only thing I do from my local machine is ssh into a beefy workstation and use chrome." / "Ubuntu/gLinux laptops have been getting phased out for a while. It's 1. Mac 2. Chromebook 3. gLinux probably". API. — [HN 48124972](https://news.ycombinator.com/item?id=48124972), [HN 48146031](https://news.ycombinator.com/item?id=48146031)
- **Google, 2023-04-05.** Ex-Googler: tried "reproducing the remote dev experience on a $500 or so Chinese barebones laptop and was satisfied in general with it. Google Meet for some reason was really laggy though". API. — [HN 35452043](https://news.ycombinator.com/item?id=35452043)
- **Stripe, 2024-08-19.** nkohari ("4.5 years at Stripe, and left in March"): "code is no longer kept on developer machines ... the old devbox system was superseded by 'remote devboxes', which also host the code." Reason given: sync bugs, "sometimes the file watcher would miss an update and the code on your remote machine would be broken in strange ways". API. — [HN 41291111](https://news.ycombinator.com/item?id=41291111)
- **Stripe, 2024-08-19.** bhuga (current): "Code is off of laptops and lives entirely on the dev server in many (but not all) cases." And: "a guiding principle for us been that the less that's on the laptop, the more control we have". API. — [HN 41291828](https://news.ycombinator.com/item?id=41291828), [HN 41294105](https://news.ycombinator.com/item?id=41294105)
- **Meta, 2021-02-23.** reissbaker: the editor "ran locally, but it used remote code checkouts"; "local checkouts are extremely uncommon"; the security case is stated as theft and insider leak. Mobile is the exception per another commenter (2023-06-28): iOS and Android "are all built locally. It's why iOS/Android engineers have big, chunky machines". API. — [HN 26243011](https://news.ycombinator.com/item?id=26243011), [HN 36510954](https://news.ycombinator.com/item?id=36510954)
- **"FAANG", 2025-08-25.** zem: "in the faang jobs I've had you could not even check code out onto your laptop. it had to live on the dev desktop or virtual machine, and be edited remotely." Companies not named. API. — [HN 45019183](https://news.ycombinator.com/item?id=45019183)
- **Amazon, 2017-10-03.** jcrites (profile, as quoted by another commenter, says "Creator of Cloud Desktop"): "a lot of development takes place on a person's local laptop, synchronizing between that and the cloud desktop (such as with Git and other tools)." API. — [HN 15391051](https://news.ycombinator.com/item?id=15391051); profile quote at [HN 19499577](https://news.ycombinator.com/item?id=19499577)
- **Amazon, 2020-05-14.** "laptop + cloud desktop that runs Amazon Linux is the standard set up now." API. — [HN 23175064](https://news.ycombinator.com/item?id=23175064)
- **LinkedIn (probable; employer not stated in the comment), 2023-11-23.** The laptop still carries the load: "64-128GB is my current minimum due to 30+GB used by docker and a poor rdev story." Reply: "I'm glad we've got a good RDEV story". API. — [HN 38387846](https://news.ycombinator.com/item?id=38387846)

### Inferences

- "No code on the laptop" comes in three strengths: a rule (Google google3), an engineering outcome later embraced as policy (Stripe, driven by sync pain), and a default with mobile exceptions (Meta). Amazon in 2017 allowed both.
- Mobile and client platform work is the standing exception at every company that mentions exceptions.

### Gaps

- No current Amazon statement on laptop checkouts. No written policy text for any company. Nothing for Uber, Airbnb, Netflix, Apple, finance firms.

---

## Editor and connection in daily practice; latency; planes and bad links

### Takeaway

At Google the common pattern by 2023 was ssh plus VS Code remote (or the web IDE), with full remote desktop a rarity; latency complaints cluster around distant offices, buses and holiday homes. At Uber, an engineer says most developers built locally anyway because of input lag.

### Cited Findings

- **Google, 2023-02-26 and 2023-07-19.** "the vast majority of people use their cloudtop over ssh and a remote vscode connection. I only ever use a remote gui for a few minutes every X weeks"; "I use regular terminal SSH+VS Code remote ... in an ultra rare case I need it (happens only about once per year at most), I can just RDP using chrome remote desktop". API. — [HN 34943528](https://news.ycombinator.com/item?id=34943528), [HN 36782739](https://news.ycombinator.com/item?id=36782739)
- **Google, 2023-07-22.** The opposite habit also exists: "They have a chromebook and RDP onto their cloudtop and never close it." API. — [HN 36830177](https://news.ycombinator.com/item?id=36830177)
- **Google, 2020-07-15 and 2022-10-06.** "I ssh from a ChromeOS laptop to a glinux workstation with tmux"; "go home and gmosh into a cloudtop that uses the same network mounted filesystem." (gmosh: an internal mosh wrapper, by the name.) API. — [HN 23849753](https://news.ycombinator.com/item?id=23849753), [HN 33112696](https://news.ycombinator.com/item?id=33112696)
- **Google, 2026-05-13/14. Latency.** "Almost everything was incredibly slow due to that latency [Sydney office], not just chromoting but also just accessing most sites through beyondcorp." / an ex-Googler (2017-2023) "commuting 2-3hrs/day SF<>MTV on the gBus" built a split IntelliJ "out of raw frustration over latency" / "I rented a vacation home in South Lake Tahoe ... It was only then that I realized it had terrible latency." API. — [HN 48130338](https://news.ycombinator.com/item?id=48130338), [HN 48128934](https://news.ycombinator.com/item?id=48128934), [HN 48135152](https://news.ycombinator.com/item?id=48135152)
- **Stripe, 2024-08-19.** "Engineers use VSCode remote development via SSH. It works shockingly well for a codebase the size of Stripe's." Platform view: "most developers are not as idiosyncratic in their editor choices as is commonly believed, and most want a pre-configured setup". API. — [HN 41291111](https://news.ycombinator.com/item?id=41291111), [HN 41291828](https://news.ycombinator.com/item?id=41291828)
- **Meta, official talk, 2023-12-19.** "they can SSH directly into the box" or "use VS Code and connect to the devserver remotely"; engineers choose the data center. WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Uber, 2022-12-19.** ValleZ: "Most developers in Uber use local builds anyway because of input lag. Dev pods were mostly good to prevent laptop from working at 100% fan volume". Account "employeedeuber": "The biggest services/apps at Uber are not developed in devpods ... IntelliSense and other syntax, highlighting, chokes." A self-identified former Uber developer-tools engineer confirms there is no iOS devpod. API. — [HN 34046771](https://news.ycombinator.com/item?id=34046771), [HN 34048691](https://news.ycombinator.com/item?id=34048691), [HN 34051764](https://news.ycombinator.com/item?id=34051764)
- **Amazon, 2017-10-03 and 2025-05-17.** jcrites: "I use machines hosted in Portland from my location in Seattle and the latency is low enough that remote UIs feel close to native." A current employee: "ive made a couple code changes phone-only now, using the amazon internal browser that has ssh access to my dev desktop." API. — [HN 15391051](https://news.ycombinator.com/item?id=15391051), [HN 44017380](https://news.ycombinator.com/item?id=44017380)
- **General reaction to thin clients, 2023-02-25.** "All thin client/remote desktop solutions that I have used are laggy enough to piss off a programmer, while fast enough to fool a manager." (Non-employee, reacting to news of Cloudtop.) API. — [HN 34933249](https://news.ycombinator.com/item?id=34933249)

### Inferences

- The press framed Cloudtop as a "virtual desktop"; the people using it describe an ssh target. That gap between the outside description and the daily reality is worth a paragraph.
- Latency complaints are geographic and situational, not general. Terminal users in the same metro as the data center report none.

### Gaps

- No testimony about planes or fully offline work. No Eternal Terminal mention. No JetBrains-at-scale account beyond the one ex-Googler hack.

---

## What the dev machine can reach: internet, registries, production data

### Takeaway

Meta devservers have no direct internet access (official talk). A Googler says a Cloudtop does not need internet for google3 work. Stripe's dev servers sit in a QA environment with QA services and Bazel caches.

### Cited Findings

- **Meta, official talk, 2023-12-19.** "the devservers have default access to internal resources, but they do not have direct access to the Internet." WF, re-check. — [InfoQ transcript](https://www.infoq.com/presentations/meta-production-environment)
- **Google, 2023-07-19.** On the internet-restriction pilot: "I suspect it affects the instance you ssh into and not the laptop ... The VM does not require 'internet' access for the work done." / "Eliminating general access to the internet on my cloud machine wouldn't affect me at all." API. — [HN 36782271](https://news.ycombinator.com/item?id=36782271), [HN 36781258](https://news.ycombinator.com/item?id=36781258)
- **Google, 2026-11-06.** Credential scope: "Cloudtops only have access to credentials for my personal instances ... Any deployment to staging/prod is done with other tooling". API. — [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- **Stripe, 2024-08-19.** "Servers in our QA environment can interact with QA services in a way that is hard for a laptop to do ... such as bazel caches." API. — [HN 41291251](https://news.ycombinator.com/item?id=41291251)
- **Meta, 2021-02-23.** "Remote servers can more conveniently integrate securely with remote services than laptops or desktops." API. — [HN 26243011](https://news.ycombinator.com/item?id=26243011)
- **Amazon, 2025-05-17.** From a phone ssh session to the dev desktop: "im missing the ability to get cloudwatch logs and the like". API. — [HN 44017380](https://news.ycombinator.com/item?id=44017380)

### Inferences

- The dev machine is placed inside the corporate or QA network and the internet is what gets cut, the reverse of a laptop. That only works when third-party code is already vendored or mirrored.

### Gaps

- No testimony on how packages are fetched from a no-internet devserver (proxy, mirror), on access to production data or logs, or on any Amazon network rules.

---

## Complaints and affection

### Takeaway

Affection attaches to the filesystem and the disposability, not the hardware. Complaints are latency, IDE indexing choking on big repos, sync bugs in half-remote designs, and bad fleet updates.

### Cited Findings

- **Affection, Google 2022-10-06.** "I thought network filesystems were a terrible idea until I used citc + piper". API. — [HN 33112821](https://news.ycombinator.com/item?id=33112821)
- **Affection, Google 2026-05-13.** "I held out for a long time--there were a lot of growing pains in the early days. But eventually it got really, really good." API. — [HN 48124944](https://news.ycombinator.com/item?id=48124944)
- **Affection, Meta 2021-02-23.** "Overall I'm a big fan of running your code on remote devservers rather than on local machines once you get to scale." API. — [HN 26243011](https://news.ycombinator.com/item?id=26243011)
- **Affection, Stripe 2024-08-19.** Dev boxes "can be replaced easily, which can be helpful if you ever suspect something is wrong with the box itself"; "The slowest part was always CI." API. — [HN 41291616](https://news.ycombinator.com/item?id=41291616)
- **Affection, Microsoft official 2023-05-23.** Quoted engineer: "Dev Box finally made me give up my physical machine." Survey: "overall satisfaction numbers topped 80%". WF, re-check; company-selected quotes. — [Engineering@Microsoft](https://devblogs.microsoft.com/engineering-at-microsoft/dev-box-for-microsoft-engineers/)
- **Complaint, Stripe 2024-08-19.** The half-remote design: sync was "a fairly constant source of headaches". API. — [HN 41291111](https://news.ycombinator.com/item?id=41291111)
- **Complaint, Uber 2022-12-19.** Input lag drove people back to local builds. API. — [HN 34046771](https://news.ycombinator.com/item?id=34046771)
- **Complaint, Google 2026.** Network-filesystem lag in neovim; Sydney latency; bad updates forcing rebuilds. API. — [HN 48125361](https://news.ycombinator.com/item?id=48125361), [HN 48130338](https://news.ycombinator.com/item?id=48130338), [HN 50397671](https://news.ycombinator.com/item?id=50397671)
- **Complaint, Meta.** Dev GPUs give noisy timings and are sometimes shared. API. — [pytorch/benchmark#2527](https://github.com/pytorch/benchmark/issues/2527), [torchtitan#1344](https://github.com/pytorch/torchtitan/issues/1344)
- **Blind, Uber devpod thread (snippet only, HTTP 402).** Search summary says a commenter misses their former remote dev environment and finds local development worse. Unverified. — [Blind](https://www.teamblind.com/post/critique-of-uber-devpod-remote-development-project-dqoygeum)

### Gaps

- No first-person "what I miss after leaving" essay was found for any company. The affection evidence is scattered comments.

---

## Angles for an essay

### Patterns this testimony supports that the official posts did not show

1. **Root, but perishable.** Engineers get sudo and do edit `/etc`. Control is exercised through continuous updates, healthchecks, a maximum host age and documented creation hooks, not through permissions. Best source: Stripe's bhuga thread; supported by tytso on gLinux sudo and Meta's "wipe random devservers" drills.
2. **"No code on the laptop" has three origins.** A rule at Google, a consequence of sync pain at Stripe, a default at Meta. Mobile work is the universal exception. Amazon's 2017 position was mixed. The official posts present it as a design choice; the testimony shows Stripe arrived there because file sync kept breaking.
3. **The GPU dev machine is its own class and ages in public.** Meta's `devgpu` hosts show M40 to V100 to A100 to H100 to B200 across 2018-2026 in public bug reports, with personal and shared variants and visible unevenness (one engineer on H100 cannot reproduce a B200 bug).
4. **Three ways to ration size.** Amazon: pick any EC2 type and risk a question from your manager. Stripe: a menu, floor at a high-end laptop. Google: approval for a hardware refresh. Nobody describes a hard technical cap.
5. **The unit is shrinking from "my machine" to "my task".** Day-and-a-half OnDemand containers at Meta, machine-per-branch at Stripe, a Cloudtop treated in 2026 as the blast radius for a coding agent.
6. **Outsiders hear "virtual desktop"; insiders describe an ssh target.** The thin-client horror in the 2023 press coverage does not match Googlers' accounts of ssh plus VS Code remote, with remote desktop used "once per year". Latency complaints are real but geographic.

### Concrete specs found

| Company | Machine type | Cores / RAM / disk / GPU | Date | Source strength |
| --- | --- | --- | --- | --- |
| Meta | devgpu | 2x Tesla M40; CentOS 7 | 2018-12 | Single public issue, env dump (API). Medium |
| Meta | devgpu | V100 (count not given) | 2020-11 | Single public issue (API). Weak-medium |
| Meta | devgpu | A100 (NVIDIA PG509-210) | 2023-01, 2024-01, 2024-09 | Three mentions, two issues (API). Medium |
| Meta | devgpu | 46 CPUs (AMD EPYC 9654), 1x H100; CentOS Stream 9 | 2024-12, 2025-09 | Two env dumps in two issues (API). Medium |
| Meta | devgpu | 384 CPUs visible to affinity mask, H100 | 2025-09 | One statement (API). Weak |
| Meta | devgpu011.ldc3 | 2x H100 (97,871 MiB each as posted), 4x ConnectX-7 | 2026-05 | One detailed dump, self-identified employee (API). Medium; memory figure odd |
| Meta | devgpu | B200, at least 4 GPUs implied | 2026-02, 2026-03 | Two issues (API). Weak-medium |
| Meta (implied) | devserver | "~50-100 cores" | 2025-05 | One HN comment, employer implied (API). Weak |
| Meta | OnDemand container | Lifetime "a day and a half" | 2023-12 | Official talk (WF, re-check). Strong once re-checked |
| Google | Cloudtop | 96 hardware threads | 2021-01 | One public issue by a Google engineer (API). Weak-medium |
| Google | Cloudtop | 150 GB+ of local disk consumed | 2022-05 | One public issue (API). Weak; lower bound only |
| Google | Specialist physical workstation (Chrome) | HP Z840, 2x 18-core Xeon, 256 GB | 2021-11 (older model) | One HN comment (API). Weak |
| Amazon | Cloud dev desktop, typical | i3.xlarge: 4 vCPU, 30.5 GB, 0.95 TB NVMe | 2018-03 | One HN throwaway (API) + Blind snippet agreeing. Weak-medium |
| Amazon | Cloud dev desktop, maximum possible | x1e.32xlarge: 128 vCPU, 3,904 GiB | 2018-03 | Same single comment (API). Weak |
| Amazon | Physical dev desktop (pre-cloud) | Celeron, 4 GB, 140 GB | 2011-12 | Two independent HN comments (API). Medium |
| Stripe | Remote devbox | "none smaller than a high-end laptop"; range of options | 2024-08 | Current employee on HN (API). Medium; no numbers |
| Microsoft | Dev Box (internal) | No sizes; 9,500 engineers (2023), ~45,000 (2024, snippet) | 2023-05, 2024-12 | Official (WF / snippet). Re-check |

### Open questions

- **GPU access process.** How does a Meta engineer get a devgpu: request, team quota, lease, expiry? Is anything similar offered at Google, Amazon, OpenAI, Anthropic, NVIDIA?
- **Disk.** Home quota sizes; whether home is network-mounted; what survives reprovision; where build caches live. Essentially unanswered for every company.
- **Numbers for the standard machine.** RAM of a Cloudtop; cores/RAM tiers of a Meta devserver VM; Stripe's instance menu; Amazon's current default.
- **Lifetimes.** Stripe's maximum host age in days; whether Cloudtops or permanent Meta devservers expire; idle reclaim anywhere.
- **Caps.** How many machines one engineer may hold.
- **Network.** How a no-internet devserver fetches third-party packages; what production data a dev machine can read.
- **Not covered at all in this pass:** Apple, Netflix, Airbnb, Dropbox, Pinterest, Snap, X, Databricks, Snowflake, Palantir, OpenAI, Anthropic, DeepMind, NVIDIA, Two Sigma, Jane Street, Citadel, Bloomberg, Block, Coinbase, Robinhood. HN searches on their likely terms returned nothing usable; LinkedIn yielded one probable comment.
- **Next sources to try.** Public GitHub issues are the richest vein and were only mined for Meta: repeat for Google (`cloudtop`, `c.googlers.com`), Amazon (`dev-dsk` hostnames), and for `devvm` CPU-only hosts. Blind and Reddit need a browser. Podcast transcripts and job postings were not reached.
- **Re-check before use.** Every WF item (InfoQ talk, Microsoft post); attribution within pytorch#162199; the 97,871 MiB H100 figure; the LinkedIn attribution of the "rdev" comments.
