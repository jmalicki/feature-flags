# AV and robotics companies: engineers' development machines

Scoping pass run 2026-11-26. About 38 searches and fetches.

## How to read the tags

- **[FETCHED]**: the page was fetched and read through an extraction model. Quoted text is what the extractor returned; every quote needs re-checking against the live page before it is published.
- **[SNIPPET]**: seen only in a search-result summary. Treat as a lead, not a fact. Wording may be paraphrased by the search tool.
- **[VENDOR]**: published by a cloud or tooling vendor about a customer. Positive framing only; no downsides reported.
- **[JOB]**: job posting. Indicates what exists, not how it works.

**Overall result.** The public record is thin. Only three AV companies have a sourced description of the engineer's dev machine: Cruise (ephemeral daily GCP VMs, 2022), Torc (per-engineer EC2 GPU desktops over Amazon DCV, 2025), and comma.ai (local workstations plus an owned datacenter, 2026). For Waymo, Zoox, Aurora, Wayve, Nuro, Motional, Tesla, Woven, Applied Intuition, Uber ATG, Lyft Level 5, Argo, Mobileye, Waabi, Boston Dynamics, Figure and Anduril, I found build-system and training-cluster material but nothing on the dev machine itself. No source anywhere gave a GPU model, core count or RAM size for a dev machine.

## 1. Where do engineers develop, and did companies move from physical workstations to cloud machines?

### Takeaway

Cruise (2022) and Torc (2025) both put engineers on self-service cloud VMs, while comma.ai (2026) keeps code on local workstations and sends work to an owned cluster. The claim that Cruise moved from physical desk-side workstations to GCP is only weakly supported by what I read: the source says engineers no longer ask IT for hardware, not that desk machines were retired.

### Cited Findings

#### Cruise (history; robotaxi program wound down December 2024)

- An internal tool called "Cruise Shells" "allocates developers' customized, ephemeral pre-configured virtual machines through the Google Cloud Platform each day." Dated 2022-12-09. [FETCHED] — [Built In, "Inside the Tools that Keep the Engine Humming at Cruise"](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Scale: "about 1,000 engineers using Cruise Shells," attributed to Sireesha Sura, Software Engineering Manager, whose team of eight ran the tool. Cruise then had "nearly 3,000 employees," two-thirds engineers. 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- On hardware procurement: engineers pick a machine "instead of asking IT to procure new hardware for you." This is the only text I read bearing on a move away from physical machines. 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Cruise had a role titled "Staff Software Engineer, Developer Environments." Fetch failed (HTTP 429); title only, undated. [SNIPPET]\[JOB\] — [echojobs](https://echojobs.io/job/cruise-staff-software-engineer-developer-environments-rxt3o)
- Context on Cruise's GCP footprint: a Cloud Next 2019 session reported about 200,000 compute hours a day on GCP, and a 2022 write-up described a GKE and Compute Engine platform. These are about simulation and CI, not dev machines. [SNIPPET] — [VentureBeat, 2019-04-20](https://venturebeat.com/2019/04/20/gms-cruise-is-preparing-for-a-self-driving-future-in-the-cloud/); [Google Cloud blog](https://cloud.google.com/blog/products/containers-kubernetes/how-cruise-tests-its-avs-on-a-google-cloud-platform)

#### Torc Robotics (Daimler Truck subsidiary, autonomous trucks)

- Torc built an in-house VDI called the "VDI Ranch" on Amazon EC2 with Amazon DCV as the remote-desktop layer, serving "nearly 300 developers and engineers." Torc's repost is dated 2025-11-05; the AWS page is undated. [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/); [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- Stated reason: "We cannot provide laptops or even desktops with the kind of GPU power that we get from Amazon EC2 instances." [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/)
- Other stated reasons (paraphrased by the extractor): a distributed workforce, a governed standard environment that protects intellectual property, flexible GPU access for ML research and training, and avoiding a centralized environment with single points of failure. [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/)
- Contractors use Amazon WorkSpaces rather than the VDI Ranch. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- The prior state is described as a ticket and a wait of "several days," not as physical workstations. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)

#### comma.ai

- "All our code is in a monorepo that we have cloned on our workstations." Post by Harald Schäfer (CTO), dated 2026-02-03. The post does not say whether workstations are desk-side machines or whether they have GPUs. [FETCHED] — [comma.ai blog, "Owning a $5M data center"](https://blog.comma.ai/datacenter/)
- Compute lives in an owned datacenter: "600 GPUs in 75 TinyBox Pro machines," each with "2 CPUs and 8 GPUs," which "work as both training machines and general compute workers." 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)

#### Waymo

- "most of the tooling used for simulation requires engineers to be on powerful machines at their work stations"; Waymo says it instead builds tools for "more flexibility and fast development from anywhere," including "web versions of the most commonly used applications" and software that "provides secured remote access to our engineers." Dated 2020-04-28. No machine detail. [FETCHED] — [Waymo blog, "Off road, but not offline"](https://waymo.com/blog/2020/04/off-road-but-not-offline--simulation27/)
- A 2026 posting for an onboard developer platform role describes cutting the "inner loop" by 10X for 500+ onboard engineers and running simulation in cloud datacenters across CPU, GPU and TPU. [SNIPPET]\[JOB\] — [zerogtalent mirror](https://zerogtalent.com/frontier-jobs/waymo/onboard-developer-platform-software-engineer-7461052)

#### Voyage (acquired by Cruise in 2021; history)

- "every engineer has access to powerful, GPU-powered remote compute clusters they can use to experiment, train or visualize," alongside heavy AWS use for data storage. The original domain no longer resolves, so this was not fetched; Axios coverage of the remote-hiring push is dated 2019-09-13. [SNIPPET] — [Voyage post, dead link](https://news.voyage.auto/building-self-driving-cars-by-embracing-remote-engineering-61e504c9eb71); [Axios, 2019-09-13](https://www.axios.com/2019/09/13/self-driving-cars-software-engineers-remote-work)

#### Toyota (parent company manufacturing groups, not Woven)

- Toyota's Vehicle Manufacturing Technology Development Department moved from on-premises VMs to Google Cloud Workstations; GPU support and fit with Kubernetes were "the deciding factors" (translated from Japanese). Dated 2024-08-13. This is factory and AI application development, not AV. [FETCHED]\[VENDOR\] — [Google Cloud Japan blog](https://cloud.google.com/blog/ja/products/application-development/toyota-revamps-ai-development-environment-with-cloud-workstations)

#### Woven by Toyota

- A build-infrastructure posting lists Bazel, an Ubuntu developer build environment, and management of "a workstation development environment including base OS image, repository and build tools, docker containers." Undated. [SNIPPET]\[JOB\] — [Woven careers](https://woven.toyota/jp/careers/detail/7cc58c27-0c12-460e-8293-f40150f520f9/)

#### Zoox

- "maintaining and evolving our Bazel-based build system in a large, multi-language monorepo used by hundreds of engineers," with "a remote build farm and cache" and "our vendor Engflow" for remote execution. Posting undated, live 2026-11. Nothing on dev machines. [FETCHED]\[JOB\] — [Zoox on Lever](https://jobs.lever.co/zoox/909ee174-0c55-4bcb-9891-48569bcd7651)

#### Lyft and Uber (parent-company tools; not confirmed for Level 5 or ATG)

- Lyft's Devbox ran a local VM and became Onebox on an EC2 instance. 2022. [SNIPPET] — [InfoQ, 2022-03](https://www.infoq.com/news/2022/03/lyft-cloud-local-dev)
- Uber's Devpod is a container on Kubernetes for monorepo development. 2022-12-13. No link to ATG, which was sold to Aurora in 2020. [SNIPPET] — [Uber blog](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)

#### Individual testimony

- A Hacker News commenter says big tech companies are moving staff to VDI, "the only exception being people who need a local GPU." Anonymous, not AV-specific, date not captured. [SNIPPET] — [HN item 45002357](https://news.ycombinator.com/item?id=45002357)

### Inferences

- Two of the three documented AV setups are cloud VMs, and both justify it with hardware variety and GPU access rather than with laptop performance, which is the usual web-company argument.
- comma.ai is the counter-example: small monorepo, local checkout, owned GPUs. Its design depends on the repo being small.

### Gaps

- Not found: any source confirming Cruise retired desk-side GPU workstations, or dating the move. The essay should not assert this without a better source.
- Not found: dev-machine descriptions for Waymo, Zoox, Aurora, Nuro, Motional, Tesla Autopilot, Argo AI, Uber ATG, Lyft Level 5, Mobileye, Waabi, Applied Intuition, Boston Dynamics, Figure, Anduril.
- The Aurora PlatformCon talk "Improving developer velocity in safety-critical applications" exists but its page returned 404; content unread. — [PlatformCon](https://platformcon.com/talks/improving-developer-velocity-in-safety-critical-applications)

## 2. GPUs on the dev machine

### Takeaway

No source names a GPU model or count on an engineer's dev machine. What is documented is the access model: Cruise let engineers pick GPU or CPU per day, Torc gives GPU EC2 desktops on demand, and Wayve and comma.ai schedule GPUs from a shared pool.

### Cited Findings

- Cruise: engineers could choose hardware per session; the article's example is "Today I want a GPU instead of a CPU." 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Torc: GPU and CPU EC2 instances that developers "spin up and down as needed"; instance families not named. 2025-11-05. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- comma.ai: the same 75 eight-GPU machines serve training and general compute. "Slurm will schedule any idle machine to be an active miniray worker." Training is launched with a one-line shell command; the post does not say from which machine. 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- Wayve: moved GPU allocation "from spreadsheets to Run:ai," with utilization going from under 45% to over 80%. The case-study page returned HTTP 410, so this is unread and undated. [SNIPPET]\[VENDOR\] — [IoT ONE case study](https://iotone.com/case-study/autonomous-vehicle-company-wayve-ends-gpu-scheduling-lsquo-horror-rsquo/c8575)
- Wayve: ML workflows run on AzureML and Azure Kubernetes Service; a CoreWeave agreement was reported in November 2026. Training, not dev machines. [SNIPPET] — [Microsoft feature](https://news.microsoft.com/source/emea/features/ai-that-drives-change-wayve-rewrites-self-driving-playbook-with-deep-learning-in-azure/); [DCD](https://datacenterdynamics.com/en/news/coreweave-signs-multi-year-cloud-agreement-with-wayve)
- Tesla: 2021 coverage describes a 720-node cluster of 8x A100 (5,760 GPUs) for training. Nothing on per-engineer machines. [SNIPPET] — [NVIDIA blog, 2021](https://blogs.nvidia.com/blog/tesla-av-training-supercomputer-nvidia-a100-gpus)
- Coder (vendor) says "Training perception models with multicamera inputs can easily exceed the limits of even high-end GPU memory" and names Wayve as a customer through a platform engineer's testimonial. 2025-09-08. [FETCHED]\[VENDOR\] — [Coder blog](https://coder.com/blog/why-cloud-development-environments-are-critical-for-autonomous-driving-pioneers)

### Inferences

- Where sourced, the interactive GPU is requested per session or drawn from a scheduler, not owned permanently by one engineer. The spreadsheet at Wayve suggests static per-person allocation was the earlier state there, but I did not read the page.

### Gaps

- Not found: GPU model, GPU count, dedicated versus shared, or reservation rules for any company's dev machines.
- Not found: any statement of how interactive GPU use is separated from the training cluster or from simulation, apart from comma.ai using one pool for everything.

## 3. Machine sizes and disk

### Takeaway

One hard number: at Cruise, two clones of the repository took more than a terabyte. comma.ai is the opposite extreme with a monorepo under 3 GB and about 4 PB of shared storage read over the network. No cores or RAM figures were found for anyone.

### Cited Findings

- Cruise: two clones of the repository use "more than a terabyte of disk space." 2022-12-09. The extractor did not say whether this covers build outputs; re-read the passage. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Cruise: some engineers wanted "five in parallel, with five different configurations." 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- comma.ai: monorepo "kept small (<3GB)." 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- comma.ai: the "local monorepo is cached on a shared NFS drive including all the local changes," so cluster jobs run the engineer's working copy; package sync with uv "takes only ~2s." 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- comma.ai storage: "~4PB" of SSD in total; "The main array is 3PB of non-redundant storage hosting our driving data we train on"; "We can read from this array at ~1TB/s, which means we can train directly on the raw data without caching"; a "~300TB non-redundant array" for intermediate results. Storage software is minikeyvalue. 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- comma.ai cost: "I estimate we've spent ~5M on our data center" against "25M+ had we done the same things in the cloud"; "$540,112 on power in 2025." Author's own estimate. 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- AWS reference sample for robotics dev stations (not a company's setup): "EBS volumes (roughly 80/250/100 GB per AMI)," with ROS 2 Jazzy and Isaac Sim preloaded on the GPU image. Undated, live 2026. [FETCHED]\[VENDOR\] — [aws-samples repo](https://github.com/aws-samples/sample-remote-aws-development-station)
- Scale of sensor data, secondhand: Coder cites an NVIDIA post for "over 1.6 petabytes of sensor data daily from just 50 vehicles." 2025-09-08. Not traced to the original. [FETCHED]\[VENDOR\] — [Coder blog](https://coder.com/blog/why-cloud-development-environments-are-critical-for-autonomous-driving-pioneers)

### Inferences

- A half-terabyte working copy makes a daily fresh VM expensive to fill unless the checkout is snapshotted or lazily mounted. The Cruise article does not explain how this was done.

### Gaps

- Not found: cores, RAM, disk quota, Bazel cache size, disk-full incidents or cleanup policy at any company.
- Not found: how drive logs, ROS bags or maps are mounted on a dev machine (FUSE, NFS, object store, local NVMe) outside comma.ai.

## 4. Persistent versus ephemeral, count per engineer, provisioning time, cost controls

### Takeaway

Cruise's VMs were ephemeral by design and destroyed nightly. Torc's instances are replaceable with user data preserved, provisioned in under five minutes, with idle shutdown added later.

### Cited Findings

- Cruise: "when developers are done each evening, Cruise kills the VM," and the next day starts with a new environment. 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Cruise: "what might otherwise be a four-hour update can be done instantaneously." 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Cruise: Shells is "like a buffet for engineers, who can order features a la cart." 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Torc: access in "under 5 minutes," against a ticket and "several days" before. [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/)
- Torc: a "Replace Instance" option swaps a faulty instance while keeping data and settings; the repost frames servers as cattle, not pets (extractor's paraphrase; check wording). 2025-11-05. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- Torc: recently deployed automatic shutdown of unused instances and a VDI-specific compute optimizer in FinOps dashboards for rightsizing; savings are expected, not reported. 2025-11-05. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- Toyota: environment setup that "used to take several weeks is now completed in a few minutes" (translated). 2024-08-13. [FETCHED]\[VENDOR\] — [Google Cloud Japan blog](https://cloud.google.com/blog/ja/products/application-development/toyota-revamps-ai-development-environment-with-cloud-workstations)
- AWS sample: "agent-aware auto-stop turns machines off only when truly idle," using signals from DCV, SSM, the browser IDE, CPU and others. Reference design only. [FETCHED]\[VENDOR\] — [aws-samples repo](https://github.com/aws-samples/sample-remote-aws-development-station)

### Inferences

- Cruise is evidence against the simple thesis that heavy GPU and data workloads force persistent machines: a company with a half-terabyte checkout chose nightly teardown.

### Gaps

- Not found: how Cruise made a daily fresh VM usable with that checkout size; whether engineers could opt out of the nightly kill.
- Not found: per-engineer cost, budgets or machine counts anywhere.

## 5. Editor, connection and remote GUI

### Takeaway

Two approaches to visualization are documented: move the tool into the browser (Cruise Webviz, Waymo web tools) or stream a full GPU desktop (Torc with Amazon DCV). No source says which editor engineers use.

### Cited Findings

- Cruise: Webviz, a browser-based visualization tool for AV data, "is at the core of AV development and is used daily by the entire engineering organization." Cruise open-sourced it in 2019. [SNIPPET] — [Cruise job posting mirror](https://startup.jobs/senior-software-engineer-webviz-cruise-automation-3878369); [VentureBeat on the open-sourcing](https://venturebeat.com/ai/cruise-open-sources-webview-a-tool-for-robotics-data-analysis)
- Cruise: Chris Hasson, Senior Software Engineer, describes an in-browser code editor in Webviz (the Playground) so teams can modify the tool themselves. 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Waymo: "having web versions of the most commonly used applications has allowed us to ensure that our engineers are productive while working from home." 2020-04-28. [FETCHED] — [Waymo blog](https://waymo.com/blog/2020/04/off-road-but-not-offline--simulation27/)
- Torc: Amazon DCV delivers "high-performance remote desktop and application streaming"; engineers keep their preferred operating system on the client. 2025-11-05. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)
- AWS sample: each environment offers a DCV desktop, a code-server browser IDE and SSH over SSM. Reference design only. [FETCHED]\[VENDOR\] — [aws-samples repo](https://github.com/aws-samples/sample-remote-aws-development-station)
- Game and VFX comparison: AWS's game production guidance pairs GPU virtual workstations over DCV with Perforce; named examples are small (Blinkmoon, 20+ developers) or VFX studios. All vendor-authored. [SNIPPET]\[VENDOR\] — [AWS guidance](https://aws.amazon.com/solutions/guidance/game-production-environment-on-aws); [AWS for Games blog](https://aws.amazon.com/blogs/gametech/how-indie-studio-blinkmoon-builds-games-entirely-in-the-cloud)

### Inferences

- Web-based visualization removes the main reason an AV engineer would need a GPU and a display on the dev machine; that may be what made Cruise's headless ephemeral VMs workable.

### Gaps

- Not found: VS Code Remote, CLion or JetBrains Gateway usage at any AV company.
- Not found: how RViz or a 3D simulator is run interactively from a remote machine at Cruise, Waymo, Zoox or Aurora.

## 6. Root, Docker and image management

### Takeaway

Almost nothing sourced. Cruise engineers chose features from a menu, Torc machines are standardized and governed, and comma.ai uses PXE boot and Salt for servers with uv for Python packages.

### Cited Findings

- Cruise: pre-configured VMs with selectable features ("buffet"). 2022-12-09. [FETCHED] — [Built In](https://builtin.com/articles/inside-tools-keep-engine-humming-cruise)
- Torc: "automated governance and security controls" and integration with a third-party identity provider. Root access not mentioned. [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/)
- comma.ai: "All servers get ubuntu installed with pxeboot and are managed by salt"; "UV on the worker/trainer syncs the packages specified in the monorepo before starting any work." 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- Toyota: environments defined by container image (translated). 2024-08-13. [FETCHED]\[VENDOR\] — [Google Cloud Japan blog](https://cloud.google.com/blog/ja/products/application-development/toyota-revamps-ai-development-environment-with-cloud-workstations)
- Anduril: Daniel Fullmer gave a Foxglove Actuate talk on NixOS for embedded robotics. This concerns robot images, not dev machines; talk not viewed. [SNIPPET] — [Foxglove Actuate](https://actuate.foxglove.dev/recordings/building-with-nix-for-embedded-systems)
- Woven: posting mentions a base OS image and Docker containers for workstations. [SNIPPET]\[JOB\] — [Woven careers](https://woven.toyota/jp/careers/detail/7cc58c27-0c12-460e-8293-f40150f520f9/)

### Gaps

- Not found: sudo policy, Docker-in-VM arrangements, or hermetic toolchain details for dev machines at any company.

## 7. Access to drive logs, fleet data and maps from the dev machine

### Takeaway

Only comma.ai describes this: training reads raw driving data directly from a 3 PB non-redundant array. No AV company source covered access control or privacy handling on dev machines.

### Cited Findings

- comma.ai: see the storage figures in section 3. — [comma.ai blog](https://blog.comma.ai/datacenter/)
- Torc: protecting intellectual property is a stated reason for keeping work inside the VDI. [FETCHED]\[VENDOR\] — [AWS case study](https://aws.amazon.com/solutions/case-studies/torc-case-study/)
- Voyage: "extensive use of AWS for data storage and propagation." About 2019. [SNIPPET] — [Voyage post, dead link](https://news.voyage.auto/building-self-driving-cars-by-embracing-remote-engineering-61e504c9eb71)

### Gaps

- Not found: how logs or maps are mounted, any quotas, any privacy controls (face or plate blurring, access tiers) tied to dev machines.

## 8. Hardware-in-the-loop and bench access

### Takeaway

Not found from a primary source.

### Cited Findings

- Coder (vendor) asserts that "Autonomous vehicle companies are using Coder to accelerate hardware-in-the-loop (HIL) simulations and test track engineering," naming no companies. 2025-09-08. [FETCHED]\[VENDOR\] — [Coder blog](https://coder.com/blog/why-cloud-development-environments-are-critical-for-autonomous-driving-pioneers)
- Aurora has a "Manager, HIL Platform Engineering" role. Title only. [SNIPPET]\[JOB\] — [CareerBuilder](https://www.careerbuilder.com/job-details/manager-hil-platform-engineering-mountain-view-ca--747cfe05-922d-4dec-8270-c391ea51bdad)

### Gaps

- Not found: how engineers reach HIL rigs or vehicle benches from a remote machine.

## 9. Stated downsides and reversals

### Takeaway

No AV company source reports a downside or a reversal of a cloud dev-machine program. The only dissent is comma.ai's argument against cloud compute in general.

### Cited Findings

- comma.ai argues for owning compute on cost (about $5M against an estimated $25M+ in cloud) and on engineering culture. 2026-02-03. [FETCHED] — [comma.ai blog](https://blog.comma.ai/datacenter/)
- Torc added idle shutdown and rightsizing after launch, which implies idle GPU instances were a cost problem; the case study does not say so directly. [FETCHED]\[VENDOR\] — [Torc repost](https://torc.ai/torc-amazon-dcv-vdi-ranch/)

### Gaps

- All cloud-VM sources here are vendor case studies or recruiting pieces. None is a critical account. Latency, disk-fill time, GPU scarcity and nightly-kill friction are plausible complaints but unsourced.

## Angles for an essay

### Possible theses

1. **The expected split does not show up cleanly.** The hypothesis was that GPU and data-heavy work pushes toward large persistent machines. The best-sourced AV example, Cruise, ran ephemeral VMs killed every night despite a checkout of roughly half a terabyte. The evidence is one recruiting article, so present it as a counter-example and not as a trend.
2. **Hardware variety, not laptop weakness, is the stated driver.** Cruise ("Today I want a GPU instead of a CPU") and Torc ("We cannot provide laptops or even desktops with the kind of GPU power") both argue from access to hardware that cannot sit on a desk. Web companies usually argue from build speed and onboarding.
3. **Visualization decides the architecture.** Companies that rewrote their tools for the browser (Cruise Webviz, Waymo) can use headless VMs. Those that kept desktop tools need a streamed GPU desktop (Torc with DCV, the game and VFX studios). This is an inference from three data points.
4. **Small repo, owned iron.** comma.ai keeps a sub-3 GB monorepo on local workstations, mirrors the working copy to NFS, and reads 3 PB of raw data at about 1 TB/s from a cluster it owns. It shows the remote-dev-machine problem can be avoided when the repo is small and the data lives next to the compute.
5. **The silence is itself a finding.** Waymo, Zoox, Aurora and Tesla publish about simulation, training clusters and build systems but not about the engineer's machine. Web companies treat the devbox as a recruiting and engineering-brand topic; AV companies do not.

### Comparison of the best-sourced companies

| | Cruise (2022) | Torc (2025) | comma.ai (2026) |
| --- | --- | --- | --- |
| Where code is edited | GCP VM ("Cruise Shells") | EC2 instance, DCV desktop | Local workstation |
| Lifetime | Killed each evening | Replaceable; user data kept | Not stated |
| GPU | Selectable per session; model not stated | GPU EC2 on demand; type not stated | 600 GPUs in a shared owned cluster |
| Disk fact | Two clones exceed 1 TB | Not stated | Monorepo under 3 GB; about 4 PB shared |
| Provisioning | "instantaneously" against a four-hour update | Under 5 minutes against several days | Not applicable |
| Users | About 1,000 engineers | Nearly 300 | Not stated |
| Cost controls | Nightly kill | Idle shutdown, rightsizing dashboards | Owns hardware |
| Visualization | Webviz in the browser | Streamed desktop | Not stated |
| Source type | Recruiting article | Vendor case study | CTO blog post |

### Open questions

- Did Cruise actually replace desk-side GPU workstations, and when? Former Cruise engineers' talks or posts (BazelCon, personal blogs, Hacker News) would be the place to look; my Hacker News search was a single query and found nothing AV-specific.
- How did Cruise fill a fresh VM with a half-terabyte checkout every morning?
- What does Waymo use, given Google's Cloudtop and CitC are well documented for Google itself? No source ties them to Waymo.
- What GPU and how much disk does a Torc VDI instance have? The AWS case study omits it.
- Is there any published reversal, where a GPU-heavy team went back to desk-side machines for cost or latency reasons?
- Chip and game companies were barely covered in this pass: one search, vendor material only. They need a separate pass if the essay wants the comparison.
