# Public testimony on dev-machine disk, quotas, home directories, machine counts, reclamation and GPU dev machines (third pass, 26 Nov 2026)

Scope: statements and artefacts that individuals published themselves (GitHub issues and pull requests, public dotfile repositories, Hacker News, conference talks, engineering posts). Not repeated here: anything already in `engineer_testimony_specs.md` or `cloudtop_and_ondemand.md`, except where a new artefact corroborates it.

Read tags: **[raw]** = text read directly from the GitHub or HN API; **[extracted]** = page fetched and passed through an extraction model, so wording should be re-checked before quoting in print; **[snippet]** = search-result snippet only.

Privacy: real usernames inside pasted paths and hostnames are written `<user>`. GitHub and HN handles are public and are kept as the speaker identity.

Method notes that matter for reading the evidence:

- GitHub issue search worked best with org scoping plus one distinctive token (`devgpu`, `dev-dsk`, `/usr/local/google/home`, `rodete`). Searches scoped to `org:facebook`, `org:facebookincubator`, `org:facebookexperimental` returned zero for every query (probably an org restriction on the token used), so Sapling, Buck2 and EdenFS issues were NOT searched; that is a gap, not a negative finding.
- Hacker News (Algolia) was close to exhausted by the earlier passes. Exact-phrase searches for "cloudtop", "devserver", "devvm", "cloud desktop" plus disk, quota, home directory, idle, GPU, lease, wiped returned nothing new.
- Web search for blog testimony on these exact topics (Amazon cloud desktop disk, Meta devgpu reservation, Cloudtop home directory) returned only vendor documentation.

---

## Q1. Local disk size and type; observed `df -h`; where checkout, build outputs and caches live

### Takeaway

For the first time there are measured disks. Two Amazon cloud desktops held by one engineer both have their root filesystem (XFS) on an EBS volume presented as NVMe: 11.7 TiB on a 64-core Arm desk and 2 TiB on a 192-vCPU x86 desk, with no instance-store disk in the recorded stack. A Google gLinux machine shows a single 979 GB LVM root holding the home directory, and a second Google machine (KVM guest, so probably a Cloudtop) reports about 143 GB. At Stripe the stateful part of a devbox was moved onto a persistent EBS volume that is re-attached to a fresh instance.

### Cited Findings

- **Amazon, 2026-09-01. Root disk is EBS, not instance store; sizes 11.7 TiB and 2 TiB.** A public measurement record written on an Amazon dev desktop (hostname pattern `dev-dsk-<user>-2b-<hex>.us-west-2.amazon.com`): "Instance identity: `c7g.16xlarge`", "64 online CPUs, 1 socket, 64 cores", "Filesystem: XFS root on `/dev/nvme0n1p1`", "Parent device: 11.7 TiB `nvme0n1`, model `Amazon Elastic Block Store`". The author adds "the guest's NVMe name and PCIe transport do not establish local flash." Speaker: GitHub `ahrav`, an Amazon employee by hostname. [raw] 1 person, 2 machines. — [systems-snackpack measurement, Arm](https://github.com/ahrav/systems-snackpack/blob/main/topics/053-nvme-blk-mq/measurements/2026-09-01-arm.md); summary in [PR #51](https://github.com/ahrav/systems-snackpack/pull/51) ("Both paths used XFS over guest-visible Amazon Elastic Block Store NVMe devices.")
- **Amazon, 2026-09-01.** Same author's second desk (alias `xxl`, `dev-dsk-<user>-2c-<hex>.us-west-2.amazon.com`): "Instance identity: `c7i.48xlarge`; Intel Xeon Platinum 8488C under KVM", "192 online CPUs, 2 sockets, 48 cores per socket", "Parent device: 2 TiB `nvme0n1`, model `Amazon Elastic Block Store`". [raw] — [systems-snackpack measurement, x86](https://github.com/ahrav/systems-snackpack/blob/main/topics/053-nvme-blk-mq/measurements/2026-09-01-xxl.md)
- **Amazon, 2026-07 to 2026-10. Home is `/local/home/<user>` and `/home` resolves to it.** "they differ literally, /home versus /local/home, which is why the comparison normalizes both" (`ahrav`, 2026-08-10); a second Amazon engineer's fresh desk reports "path '/local/home/\<user>' does not contain ..." (`jjant`, 2026-10-15); a third pastes a prompt `[/workplace/<user>/...] dev-dsk-<user>-2a-<hex> %` (`shinutharol2ext`, 2026-09-24). [raw] 3 independent people for the `/local/home` or `/workplace` layout. — [systems-snackpack#29](https://github.com/ahrav/systems-snackpack/pull/29), [jjant/nix-config#247](https://github.com/jjant/nix-config/pull/247), [aws/tools-for-devops-agent#109](https://github.com/aws/tools-for-devops-agent/pull/109)
- **Google, 2024-11-22. One 979 GB root, 76% full.** A Google engineer pasted `df -h` from a gLinux machine into a systemd bug: `/dev/mapper/glinux_20200923-root  979G  706G  233G  76% /`, `tmpfs 89G ... /dev/shm`, `udev 89G`, `tmpfs 18G /run`; the work is under `/usr/local/google/home/<user>/`. No separate home filesystem appears in the part of the output visible in the issue. Speaker: GitHub `bjackman`. Whether this is a Cloudtop or a desk workstation is not stated. [raw] 1 artefact. — [systemd/mkosi#3223](https://github.com/systemd/mkosi/issues/3223)
- **Google, 2022-07-11. KVM guest with about 143 GB disk.** minikube started with the `none` driver (which reports the host itself) on Google's internal Debian: "minikube v1.26.0 on Debian rodete (kvm/amd64)" and "Running on localhost (CPUs=48, Memory=181315MB, Disk=142997MB)". `kvm` means a virtual machine, which fits a Cloudtop; the disk figure is the filesystem minikube inspected, not necessarily the whole disk. Speaker: GitHub `klaases` (minikube contributor). [raw] 1 artefact. — [kubernetes/minikube#14555](https://github.com/kubernetes/minikube/pull/14555)
- **Google, 2021-04-08. "Half terabyte drive" filled by Bazel roughly weekly.** "Using tons of disk space. I've got a half terabyte drive. That's not nothing. And Bazel was filling it up like ~weekly (?)" The cache was under `/usr/local/google/home/<user>/.cache/bazel`. Speaker: GitHub `GMNGeoffrey` (Google, open-source IREE work, so a Git checkout, not google3). [raw] — [bazelbuild/bazel#12630](https://github.com/bazelbuild/bazel/issues/12630)
- **Stripe, talk recorded 2022-09-30 (Soam Vasani, Stripe developer environments).** "We figured that we want to take out the stateful parts of the devbox" and put them "on a persistent EBS Volume"; "they simply switch back on and we reattach a volume to that user's new instance"; "the volume can grow independently of instance size"; "The EBS Volume adds some cost, but we can also save money by switching devboxes off on weekends"; "The state of source code remains on the volume, which means it's now cost acceptable to give users lots of devboxes." [extracted] official talk, named speaker. — [InfoQ: Stripe dev env infrastructure](https://www.infoq.com/presentations/stripe-dev-env-infrastructure)
- **Stripe, 2024-08-19, outside critic on cost.** "a 1TB ebs volume with equivalent performance to a MacBook will probably cost more than the MacBook every month." Speaker: HN `hamandcheese` (not a Stripe employee by this comment). [raw] — [HN 41294021](https://news.ycombinator.com/item?id=41294021)
- **Meta, 2026-06 to 2026-10. Work lives under `/data/users/<user>/`.** Three more PyTorch contributors show caches and virtualenvs there: `TORCHINDUCTOR_CACHE_DIR=/data/users/<user>/pytorch/...` (`eellison`, 2026-07-20), `/data/users/<user>/pytorch-issue-fixer/state/...` (`jansel`, 2026-06-09), `/data/users/<user>/py313-env4/bin/spin` (`williamwen42`, 2026-10-09). With the two issues in the earlier notes that makes 5 independent people. No `df` output from a Meta machine was found. [raw] — [pytorch#190561](https://github.com/pytorch/pytorch/pull/190561), [pytorch#186849](https://github.com/pytorch/pytorch/pull/186849), [pytorch#200474](https://github.com/pytorch/pytorch/pull/200474)

### Inferences

- Amazon's cloud desktop looks like "EC2 instance + one large EBS root volume", with the volume size chosen independently of the instance type (the 64-core desk has almost six times the disk of the 192-vCPU desk). The 2018 HN comment in the earlier notes (i3.xlarge with 0.95 TB NVMe instance store) describes a different, older shape; both can be true.
- Google gLinux machines keep the home directory on the machine's own root disk (`/usr/local/google/home`, the path itself says "local"), with sizes in the 0.5 to 1 TB range in the two cases with numbers.
- 89 GB tmpfs on the Google machine implies about 178 GB RAM, close to the 181,315 MB in the minikube log: two independent artefacts pointing at a roughly 180 GB RAM shape.

### Gaps

- No `df -h` from a Meta devserver, devvm or devgpu; no size for `/data/users`. `org:pytorch "devgpu" "Mounted on"`, `"/data/users" "No space left on device"`, `devvm disk` all returned nothing relevant.
- No disk type for Google Cloudtop (persistent disk class), no statement of where a google3 user's local caches sit.
- Amazon: no statement of the default disk size for a new cloud desktop, or of how a larger volume is requested. Two machines from one person is thin for a general claim.

---

## Q2. Home directory: local or network; quota; backup or snapshot; what survives reprovisioning; dotfiles

### Takeaway

No home-directory quota figure was found for Google, Meta or Amazon. What the artefacts do show is that engineers at Amazon treat cloud desktops as replaceable and carry their environment in a Git repository (Nix home-manager), and that the published designs at Stripe, Uber and the PyTorch GPU-dev platform all put the home directory or workspace on a persistent network block volume that is snapshotted and re-attached to disposable compute.

### Cited Findings

- **Amazon, 2026-06 to 2026-11. Dotfiles are rebuilt per desk from a public repo.** An Amazon engineer's Nix configuration treats each desk as a host to be activated from scratch: "Auto-detects the host and applies its config ... a cloud desktop is matched by `hostname -s`"; a fresh desk ships a "stock `~/.zshrc`" that is moved aside; setup step "`echo \"trusted-users = $USER\" | sudo tee -a /etc/nix/nix.conf`". When desks were deleted, state on them was gone: "A fresh server needs the previous Atuin server database restored or the account registered again before history sync will work." Speaker: GitHub `jjant`. [raw] 1 person. — [jjant/nix-config README](https://github.com/jjant/nix-config), [#274](https://github.com/jjant/nix-config/pull/274), [#248](https://github.com/jjant/nix-config/pull/248)
- **Stripe, 2022-09-30 (talk).** State that survives is whatever sits on the per-user EBS volume; the instance is replaced: "we reattach a volume to that user's new instance". [extracted] — [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure)
- **Uber, 2022-12-13 (official post).** "Persistent volumes to store engineering work between restarts"; "Devpods are persistent, therefore engineers do not need to worry about losing their individual setup, files"; idle handling keeps the disk: "an automated job periodically checks whether an environment has been used lately", "its container is deleted", "Snapshotting disks of shutdown environments", "we convert it into a low-cost storage option until the environment is started up again". [extracted] official. — [Uber Devpod post](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- **PyTorch gpu-dev (public platform for PyTorch committers, AWS; README 2026-08).** Home is a 100 GB EBS volume restored from snapshot: "Persistent Disk (EBS) - `/home/dev`", "Size: 100GB per disk", "Backed up: Automatic snapshots when reservation ends", "You can have multiple named disks for different projects", `--no-persist` gives "ephemeral `/home/dev`", a sample session prints "Disk restore: 6.2s"; larger files go to "Shared Personal Storage (EFS) - `/shared-personal`" and there is a "20 TB shared EFS mounted at `/shared`"; "Soft-deletes a disk. Snapshots are permanently deleted after 30 days." [raw] public documentation, not individual testimony. — [pytorch/ci-infra gpu-dev README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/README.md), [CLI README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/cli-tools/gpu-dev-cli/README.md)
- **Gitpod (now Ona), 2024-10-31, "We're leaving Kubernetes" (Christian Weichel, Alejandro de Brito Fontes).** The vendor that tried every option reports on each. Local SSD RAID 0: "This offered high IOPS and bandwidth but tied the data to a specific node." Persistent volume claims: "Unpredictable attachment and detachment timing, leading to unpredictable workspace startup times", "Limited number of disks that could be attached to an instance", "AZ locality constraints". Backups of local disks: "Backing up and restoring local disks proved to be an expensive operation ... uploads and downloads uncompressed tar archives to/from S3." Conclusion: "we, once again, identified storage as the crucial element". [extracted] — [Ona: We're leaving Kubernetes](https://ona.com/stories/we-are-leaving-kubernetes)
- **Gitpod, 2022 (GitHub issue).** Attach latency figure: "csi-attacher is taking about 9 seconds to attach PVC to pod" against a 40-second start-up target. [snippet] not re-read. — [gitpod-io/gitpod#8104](https://github.com/gitpod-io/gitpod/issues/8104)
- **FAIR (Meta research cluster), 2022-2023.** Researchers' paths show home on a cluster filesystem `/private/home/<user>/...` on "devfair" machines (`jimmytyyang`, 2023-08-23; `tbmihailov`, 2022-03-31). That is a different environment from product devservers. [raw] 2 people. — [habitat-lab#1531](https://github.com/facebookresearch/habitat-lab/pull/1531), [metaseq#15](https://github.com/facebookresearch/metaseq/issues/15)
- **Intel (for contrast), 2026-08-19.** A classic quota-limited NFS home: "[Errno 122] Disk quota exceeded: /nfs/site/home/\<user>/.vmanager_tokens". Speaker: GitHub `gwaise`. [raw] 1 person. — [adoptium-support#1519](https://github.com/adoptium/adoptium-support/issues/1519)

### Inferences

- Persistent network block volume for home or workspace: **supported by published designs** at Stripe (EBS, re-attached), Uber (Kubernetes persistent volumes, snapshotted when idle), the PyTorch GPU-dev platform (100 GB EBS home restored from snapshot) and by measured artefacts at Amazon (EBS root). Gitpod's write-up is the published counter-experience: network volumes made start-up unpredictable, local SSD made data node-bound. So "persistent network volume + disposable compute" is the common published design, with attach time and I/O performance as its known costs.
- Nothing found says instance-store NVMe is used only for scratch at any named company; the closest is General Motors' CASFS "warms content to local NVMe as it is needed" (see Q3).

### Gaps

- No public statement that Google or Meta home directories are network-mounted, backed up or quota-limited. The only Meta statement remains the 2023 talk's "transparent and automated user backups" (earlier notes).
- Searches tried without result: EBS snapshot pre-warming at Stripe (only third-party pages claim it; the 2022 talk does not mention snapshots or warm pools), Slack, Figma, Datadog, Discord, Notion, Airbnb, LinkedIn remote-dev storage; lazy-loading of snapshot blocks as a dev-environment complaint (only general AWS and research material turned up). Codespaces, Coder and DevZero documentation was not fetched.

---

## Q3. Disk-full episodes and cleanup tooling; large checkouts and datasets

### Takeaway

Disk-full stories are about build caches and repository size, not user files. A Googler's Bazel cache filled a half-terabyte drive about weekly and his cron-job cleanup corrupted builds; Cruise's developer-productivity manager said two clones of the repository exceed a terabyte and engineers kept asking for more disk; the successor team at General Motors built a FUSE filesystem so a terabyte-scale tree mounts without being downloaded.

### Cited Findings

- **Google, 2021-04-08. Home-made cleanup breaks the build.** "`@daily find /usr/local/google/home/<user>/.cache/bazel* -mtime +12 -type f -delete`" then "Bazel kept on using up all of my disk space, so I figured I could empty out old cache entries ... Apparently that's not true" and "I would love to come up with a safe replacement before Bazel fills up my drive again." Speaker: GitHub `GMNGeoffrey`. [raw] — [bazelbuild/bazel#12630](https://github.com/bazelbuild/bazel/issues/12630)
- **Bazel project, 2018 onward.** The long-standing upstream request: "Implement automatic garbage collection for the disk cache" (opened 2018-05-02 by a Bazel maintainer). [raw, title and first lines] Bazel's documentation says size and age limits for the disk cache arrived in Bazel 7.4 [snippet]. — [bazelbuild/bazel#5139](https://github.com/bazelbuild/bazel/issues/5139), [bazel.build remote caching](https://bazel.build/remote/caching)
- **Cruise, 2022-12-09 (Built In sponsored article; speaker given by the fetched page as Sireesha Sura, Software Engineering Manager).** "our repository size has been growing over time, so people have been asking for more disk space so they can clone a repo and work with it. If you have two clones of our repository, that's more than a terabyte of disk space. That space is not cheap. What we can do in the dev prod org is either give people more disk space or reduce the amount of space that the repo is taking." The same article describes "Cruise Shells", customised ephemeral virtual machines on Google Cloud provided to developers daily. [extracted] Note: a search-result summary attributed the quote to a different manager; the fetched page says Sura. Re-check the name before printing. — [Built In](https://builtin.com/brand-studio/inside-tools-keep-engine-humming-cruise)
- **General Motors (team that came from Cruise), 2026-08-18 (EngFlow meetup write-up; speaker Seth Bunce).** "After Google discontinued the remote-build service Cruise had been using", "Seth's team built its own remote-execution system, content-addressable store, and FUSE filesystem"; "CASFS mounts a source tree immediately, then retrieves and warms content to local NVMe as it is needed"; "not because CASFS transfers a terabyte in ten seconds, but because it does not wait for the entire tree to arrive." [extracted] — [EngFlow blog](https://blog.engflow.com/2026/08/18/four-war-stories-and-a-demo-seattle-build-meetup-2026--engflow/)
- **Cruise, 2023-05-12.** Seth Bunce on the Bazel remote-APIs tracker: "I work for Cruise." The issue is a user experience report on multi-level remote caches (existence caching), which confirms Cruise ran its own layered remote cache; it does not discuss developer disk. [raw, opening lines] — [bazelbuild/remote-apis#252](https://github.com/bazelbuild/remote-apis/issues/252)
- **Cruise, 2026-11-07.** A GM engineer's bug report shows a Cruise-patched Bazel still in use: "release 8.8.2-cruise-\<hash>". Speaker: GitHub `khuey-GM`. [raw] — [bazelbuild/bazel#32486](https://github.com/bazelbuild/bazel/issues/32486)
- **Amazon, 2026-06-16.** The engineer who keeps cloud desktops in Nix adds a disk-usage tool to every host: "dust (1.2.4) — more intuitive du; disk usage per directory". Weak, but it is the only Amazon trace of disk housekeeping found. Speaker: `jjant`. [raw] — [jjant/nix-config#39](https://github.com/jjant/nix-config/pull/39)

### Inferences

- The general pattern across Google (CitC/ObjFS, earlier notes), Meta (EdenFS, earlier notes) and GM/Cruise (CASFS) is the same: once the tree and its outputs pass a few hundred GB, companies stop enlarging dev-machine disks and virtualise the checkout and move outputs to a remote cache.

### Gaps

- No Cruise blog post, BazelCon talk transcript, HN or Reddit comment mentioning a disk quota, output-base size or sparse checkout was found. Tried: HN Algolia ("Cruise bazel disk", "Cruise monorepo checkout", "at Cruise" bazel, "Cruise" "remote cache"), GitHub issue search (`org:bazelbuild cruise` with disk terms; "at Cruise" with disk terms), web search for BazelCon talks (only a 2019 title, "Building Self-Driving Cars with Bazel", with no transcript), and "Cruise Shells" (no other public page).
- No disk-full story from a Meta devserver or an Amazon cloud desktop. No dataset-mount description for any company's dev machines (Meta's GenAI post mentions Hammerspace for interactive debugging of cluster jobs, snippet only, not about dev machines).

---

## Q4. Number of machines per engineer; approval; leases; idle detection, reclaim, expiry

### Takeaway

Amazon engineers demonstrably hold several cloud desktops at once and create and delete them themselves: one held five within five weeks (three OS/architecture variants, a 512 GiB "bigmem", a 192-vCPU "bigboy") and then deleted four; another runs an Arm and an x86 desk side by side. Stripe's stated target was "five devboxes" per developer. Published reclaim rules exist for Uber (idle check deletes the container, disk snapshotted) and the PyTorch GPU platform (hard 24-hour reservation, 48 hours with one extension). No cap, approval step or idle rule was found for Google, Meta or Amazon.

### Cited Findings

- **Amazon, 2026-07-02 to 2026-11-20. Five desks, then one.** SSH aliases for three desks ("al2-x86_64, al2-aarch64, al2023-x86_64", 2026-07-02); "New desk `<user>-bigmem` (`dev-dsk-<user>-1a-<hex>.eu-west-1.amazon.com`, m7a.32xlarge, 512 GiB, AL2023 x86_64) ... (the desk is still being created)" (2026-10-15); "Add the 192 vCPU / 1.5 TiB AL2023 desk" (2026-11-18); then "The three `al2`/`al2023` configs and `bigmem` represented cloud desktops that have been deleted" (2026-11-20). Speaker: GitHub `jjant`. Nothing in the repository mentions an approval. [raw] — [nix-config#61](https://github.com/jjant/nix-config/pull/61), [#245](https://github.com/jjant/nix-config/pull/245), [#272](https://github.com/jjant/nix-config/pull/272), [#274](https://github.com/jjant/nix-config/pull/274)
- **Amazon, 2026-07 to 2026-11. Two desks in parallel, addressed by size alias.** "Arm: `dev-dsk-<user>-2b-<hex>.us-west-2.amazon.com`, AArch64" and "x86: `xxl` resolved to `dev-dsk-<user>-2c-<hex>.us-west-2.amazon.com`"; another PR mentions a host alias "xlg". Speaker: GitHub `ahrav`. [raw] — [systems-snackpack#29](https://github.com/ahrav/systems-snackpack/pull/29), [#16](https://github.com/ahrav/systems-snackpack/pull/16)
  - Count for "an Amazon engineer can hold more than one cloud desktop, of different architectures and sizes": 2 independent people, 7 machines.
- **Stripe, 2022-09-30 (talk).** Old model: "one developer gets one devbox, they're long-lived and the developer maintains them." New model: "A devbox is per branch instead of per developer, so a developer can work on as many as they want at the same time"; "a world where one developer might have five devboxes"; "you simply spin up a new devbox and you delete the one that you're done with." [extracted] Corroborates the 2024 HN comment by a Stripe employee in the earlier notes (machine per branch, company-wide maximum age): 2 independent Stripe voices. — [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure)
- **Uber, 2022-12-13 (official).** "Multiple remote environments per user"; "an automated job periodically checks whether an environment has been used lately" and deletes the container; "Devpods are updated overnight automatically ... there are maintenance windows set for the environments during non-work hours". No numeric timeout. [extracted] — [Uber Devpod post](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)
- **PyTorch gpu-dev, 2026 (public docs).** "Maximum duration | 24 hours", "Total max time | 48 hours (24h initial + 24h extension)", "Expiry Warnings: 30 minutes before expiry, 15 minutes before expiry, 5 minutes before expiry. Warnings appear as files in your home directory and via `wall` messages." [raw] — [gpu-dev CLI README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/cli-tools/gpu-dev-cli/README.md)
- **Cruise, 2022-12-09.** "Cruise Shells" are described as ephemeral virtual machines provided to developers each day. [extracted, paraphrase by the extraction model; re-read before quoting] — [Built In](https://builtin.com/brand-studio/inside-tools-keep-engine-humming-cruise)

### Inferences

- At Amazon the cloud desktop behaves like a self-service EC2 instance: the engineer picks architecture, OS generation and size, and deletes it when done. Whether large shapes (1.5 TiB RAM) need approval is unknown.
- Three reclaim styles are now attested: fixed short lease with warnings (PyTorch GPU platform), idle detection that removes compute but keeps disk (Uber), and maximum age (Stripe, earlier notes).

### Gaps

- Still no per-person cap, approval rule, or idle policy for Google Cloudtop, Meta devservers or Amazon cloud desktops. HN searches for "second cloudtop", "cloudtop idle", "devserver idle reclaimed", "devserver wiped" returned nothing relevant.

---

## Q5. GPU dev machines: how obtained, sharing, duration, which GPUs, scarcity

### Takeaway

Every public "devgpu" voice found is a PyTorch or Meta AI-infrastructure contributor; no public statement says who is entitled to one, and none says product engineers get them. The same people contrast "local devgpu" with "on MAST" (the cluster scheduler) and with GPU remote-execution workers chosen by the build tool, so three routes to a GPU coexist. Devgpus are whole multi-GPU hosts, often shared, where a user pins CPUs with `taskset` and picks GPUs with `CUDA_VISIBLE_DEVICES`. Two 2026 artefacts show capacity friction: a reservation "blocked by cancelled capacity" and "internal b200 devgpu broken".

### Cited Findings

- **Meta, 2023-10-18. A "large devgpu" is 8 x H100, held for a period.** "I will try on the large devgpu (8 x H100) that I'm working on" and later "locally on my H100 devgpu". Speaker: `kadeng` (PyTorch contributor). [raw] — [pytorch#110890](https://github.com/pytorch/pytorch/pull/110890)
- **Meta, 2025-12-08.** "what's our default examples to be based on? Local DevGPU with 8 card?" contrasted with a Slurm launch mode. Speaker: `JenniferWang`. [raw] — [meta-pytorch/torchforge#622](https://github.com/meta-pytorch/torchforge/pull/622)
  - With the 8-GPU dumps in the earlier notes (2024, 2026) that is 4 independent artefacts for "a devgpu is commonly an 8-GPU host".
- **Meta, 2026-10-28. Shared devgpu, manual GPU partitioning.** "On a shared devgpu this could place a run on GPUs already in use, making startup appear stuck"; the fix respects `CUDA_VISIBLE_DEVICES=4,5,6,7`. Speaker: `vkuzo`. [raw] With torchtitan#1344 (earlier notes) that is 2 independent people for "devgpus are shared and users split GPUs by convention". — [torchtitan#5647](https://github.com/pytorch/torchtitan/pull/5647)
- **Meta, 2026-11-20. Shared host is busy; CPUs pinned by hand.** "devserver, the same 8 cores (taskset -c 8-15) ... host load average 65-110 on 144 cores during the runs" and "The devserver limits CPUs with taskset". Speaker: `felipemello1`. [raw] — [torchtitan#6281](https://github.com/pytorch/torchtitan/pull/6281)
- **Meta, 2026-11-02. Reservation and capacity.** A PR test plan reads: "A fresh A100 rerun of this last static-only delta was blocked by cancelled capacity ... Reserve an A100 DevGPU and attach it to parent session\<id> for the rerun." The text reads like an agent-written hand-off note, so treat "reserve" as the verb the internal tooling uses, not as a described policy. Speaker: `melvinhe`. [raw] 1 artefact. — [pytorch#203077](https://github.com/pytorch/pytorch/pull/203077)
- **Meta, 2026-04-29. Scarcity of the newest card.** "The only blocker is annoying infra issue (internal b200 devgpu broken, and external cloud one i've only been able to reserve no more than 1 b200 at a time lately, which makes it difficult to test torchtitan changes)." Speaker: `danielvegamyhre` (the "external cloud one" is consistent with the public PyTorch gpu-dev platform below). [raw] — [torchtitan#3150](https://github.com/pytorch/torchtitan/issues/3150)
- **Meta, 2024-04-19. Devgpu versus cluster.** "on mast it requires an additional pkg chardet, which was not asked on local devgpu". Speaker: `wanchaol`. Also a 2026 PR titled "Disaggregated prefill/decode benchmark for MAST and devservers" (`rmahidhar`). [raw] 2 people for "the same team uses both a devgpu and MAST". — [torchtitan#256](https://github.com/pytorch/torchtitan/pull/256), [torchcomms#2546](https://github.com/meta-pytorch/torchcomms/pull/2546)
- **Meta, 2026-09 to 2026-11. A third route: GPU remote execution.** "Device tests ran as their `*_cuda` variants on GPU executors that buck chose, not on the GB300 devgpu" (`qchip`, 2026-11-10); "There is no MI350X GPU RE, so this runs locally on a devgpu via buck run" (`beginner137`, 2026-09-03). The first also names a "GB300 devgpu", the second an AMD MI350X devgpu. [raw] — [pytorch#204194](https://github.com/pytorch/pytorch/pull/204194), [pytorch#195810](https://github.com/pytorch/pytorch/pull/195810)
- **Meta, 2026-11-13.** "an A100 devserver" with "44 CPUs". Speaker: `Gasoonjia`. Close to the "46 CPUs + 1 H100" slices in the earlier notes: sliced GPU devservers exist beside whole 8-GPU hosts. [raw] — [executorch#25018](https://github.com/pytorch/executorch/pull/25018)
- **Meta, 2024-06-10 (official, Steve Dini), notebooks.** Bento notebook users "still have to go through the same process of reserving and provisioning remote compute", "a process that takes time – before the notebook is ready for any code execution". The post does not mention GPUs. [extracted] — [Engineering at Meta: Serverless Jupyter Notebooks](https://engineering.fb.com/2024/06/10/data-infrastructure/serverless-jupyter-notebooks-bento-meta/)
- **Meta FAIR, 2026-11-25.** "GPU execution was not run locally: the FAIR cluster login node has no GPU." Speaker: `lbluque`. Earlier FAIR "devfair" machines did have GPUs ("Tested on devfair (GPU)", `Rebecca-Qian`, 2021-07-07). [raw] — [fairchem#2394](https://github.com/facebookresearch/fairchem/pull/2394), [fairo#555](https://github.com/facebookresearch/fairo/pull/555)
- **PyTorch gpu-dev platform (public, for PyTorch committers on AWS), 2026.** A complete published model of a reservable GPU dev machine: "Devs ask for `1 / 2 / 4 / 8` GPUs of a given type, the platform parks them on a Kubernetes pod with SSH access, and tears it down when the reservation expires"; "auth is via the GitHub public keys of users with commit access"; types "T4, L4, A100, H100, B200"; statuses include "queued"; "`--add-user` | Add secondary user (GitHub username)"; "User: `dev` with passwordless sudo"; "Internet: Full outbound access from pods"; instance table lists `p5.48xlarge` (8 x H100) and `p6-b200.48xlarge` (8 x B200). [raw] — [gpu-dev README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/README.md), [CLI README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/cli-tools/gpu-dev-cli/README.md)

### Inferences

- GPU generation on devgpus now runs M40, V100, A100, H100, B200, GB300, plus AMD MI350X: dev machines track the training fleet, including non-NVIDIA hardware.
- The public gpu-dev platform was built by people adjacent to Meta's PyTorch team and its vocabulary ("devgpu", "reserve", persistent disk) probably mirrors internal practice; that is inference only.

### Gaps

- No public statement of how a Meta devgpu is requested, for how long it is held, or what happens when it sits idle. Searches tried: `org:pytorch devgpu reserve`, `"request a devgpu"`, `"get a devgpu"`, `"don't have a devgpu"`, HN "devgpu", web search for ex-Meta testimony on devgpu or FBLearner/MAST-only access.
- Nothing on GPU dev machines at Google (no Cloudtop with `nvidia-smi` found; `"c.googlers.com" "nvidia-smi"` and `"cloudtop" "nvidia-smi"` returned zero), Amazon (no `dev-dsk` with GPU output), OpenAI, Anthropic, NVIDIA, Tesla, Waymo, Zoox or Aurora. Not searched for lack of budget: `/usr/local/google/home` + `nvidia-smi`, NVIDIA `/home/scratch.<user>` paths in depth.

---

## Q6. Cores and RAM seen in pasted output

### Takeaway

New measured shapes: Amazon cloud desktops from 64 Arm cores up to 192 vCPU with 1.5 TiB RAM; Google machines at 48 CPUs with about 180 GB RAM; Meta shared devservers of 144 cores.

### Cited Findings

- **Amazon:** `c7g.16xlarge` 64 cores (Arm); `c7i.48xlarge` 192 vCPU; `m7a.32xlarge` "512 GiB"; an unnamed type with "192 vCPU / 1.5 TiB". [raw] 2 people. — [systems-snackpack measurements](https://github.com/ahrav/systems-snackpack/tree/main/topics/053-nvme-blk-mq/measurements), [nix-config#245](https://github.com/jjant/nix-config/pull/245), [nix-config#272](https://github.com/jjant/nix-config/pull/272)
- **Google:** "CPUs=48, Memory=181315MB" on a KVM guest (2022); 89 GB `/dev/shm` on a gLinux machine (2024), implying about 178 GB RAM. [raw] 2 people. — [minikube#14555](https://github.com/kubernetes/minikube/pull/14555), [mkosi#3223](https://github.com/systemd/mkosi/issues/3223)
- **Meta:** "144 cores" with load average 65 to 110 (2026); "44 CPUs" on an A100 devserver (2026). [raw] 2 people. — [torchtitan#6281](https://github.com/pytorch/torchtitan/pull/6281), [executorch#25018](https://github.com/pytorch/executorch/pull/25018)
- **Uber (official, 2022):** "up to 48 cores and 96 GB of RAM per environment"; experiments with "90+ cores and hundreds of Gigabytes of RAM"; "multiple environments are placed in one big virtual machine". [extracted] — [Uber Devpod post](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)

### Gaps

- No RAM figure from any Meta machine. No current default (as opposed to chosen) shape for Amazon or Google.

---

## Q7. Sudo and package installation (corroboration)

### Takeaway

Amazon cloud desktops give the engineer `sudo`: two more artefacts show system-level changes made by the owner.

### Cited Findings

- **Amazon, 2026.** Setup on a cloud desktop includes `sudo tee -a /etc/nix/nix.conf` and a multi-user Nix daemon install (`jjant`). [raw] — [jjant/nix-config README](https://github.com/jjant/nix-config)
- **Amazon, 2026-09.** "On Amazon Cloud Desktops the dev-desk FQDN is pinned to 127.0.0.1 in /etc/hosts (intentional: browser SSO over an ssh -L tunnel)" (`bolichen97`), an `/etc/hosts` edit by the user. [raw, search fragment] — [kirodotdev/KiroCrew#12281](https://github.com/kirodotdev/KiroCrew/issues/12281)
- **Google, 2022.** `sudo -E ./out/minikube start --driver=none` run on the rodete KVM guest (`klaases`). [raw] — [minikube#14555](https://github.com/kubernetes/minikube/pull/14555)
- **PyTorch gpu-dev (public).** "User: `dev` with passwordless sudo". [raw] — [CLI README](https://github.com/pytorch/ci-infra/blob/main/gpu-dev/cli-tools/gpu-dev-cli/README.md)

### Gaps

- Nothing new for Meta.

---

## Observed specs (new in this pass)

| Company | Machine / hostname pattern | Cores / RAM / disk / GPU | Date | Artefacts |
| --- | --- | --- | --- | --- |
| Amazon | cloud desktop `dev-dsk-<user>-2b-*`, c7g.16xlarge | 64 Arm cores; 11.7 TiB EBS root (XFS); AL2023 | 2026-09 | 1 person, 1 file + several PRs |
| Amazon | cloud desktop `dev-dsk-<user>-2c-*` ("xxl"), c7i.48xlarge | 192 vCPU; 2 TiB EBS root (XFS) | 2026-09 | same person, 1 file |
| Amazon | cloud desktop "bigmem", m7a.32xlarge | 512 GiB RAM (128 vCPU by instance type, not stated) | 2026-10 | 1 PR |
| Amazon | cloud desktop "bigboy" | 192 vCPU / 1.5 TiB RAM | 2026-11 | 1 PR + README |
| Google | gLinux machine (type unknown) | 979 GB LVM root, 76% used; ~178 GB RAM implied | 2024-11 | 1 issue |
| Google | rodete KVM guest (probably Cloudtop) | 48 CPUs; 181,315 MB RAM; 142,997 MB disk seen | 2022-07 | 1 PR |
| Google | gLinux machine | "half terabyte drive" | 2021-04 | 1 issue |
| Meta | "large devgpu" | 8 x H100 | 2023-10 | 1 PR (4 artefacts for 8-GPU hosts overall) |
| Meta | shared devserver | 144 cores, load 65-110 | 2026-11 | 1 PR |
| Meta | "A100 devserver" | 44 CPUs | 2026-11 | 1 PR |
| Meta | devgpu variants named | B200, GB300, AMD MI350X | 2026 | 3 PRs |
| Uber | Devpod | up to 48 cores / 96 GB | 2022-12 | official post |
| PyTorch (public platform) | gpu-dev pod | 1/2/4/8 x T4, L4, A100, H100, B200; 100 GB EBS home | 2026 | public docs |

## Best-corroborated claims (two or more independent sources)

| Claim | Sources | Count |
| --- | --- | --- |
| Amazon cloud-desktop home is `/local/home/<user>`, workspaces under `/workplace` | ahrav, jjant, shinutharol2ext | 3 people |
| An Amazon engineer can hold several cloud desktops of different architecture and size, self-created and self-deleted | jjant (5 desks), ahrav (2 desks) | 2 people, 7 machines |
| Dev home or workspace on a persistent network block volume attached to disposable compute | Stripe talk, Uber post, PyTorch gpu-dev docs, Amazon measurement files | 4 organisations |
| Meta devgpus are commonly whole 8-GPU hosts | kadeng, JenniferWang, plus two dumps in earlier notes | 4 artefacts |
| Meta devgpus are shared and users partition GPUs/CPUs by hand | vkuzo, felipemello1, plus torchtitan#1344 | 3 people |
| Meta AI-framework engineers use both a devgpu and the MAST cluster | wanchaol, rmahidhar | 2 people |
| Meta work trees and caches live under `/data/users/<user>` | eellison, jansel, williamwen42, plus 2 in earlier notes | 5 people |
| Google gLinux machines of about 48 CPUs and 180 GB RAM | klaases, bjackman (RAM only) | 2 people |
| Bazel caches fill 0.5-1 TB dev disks on Git-hosted Google projects | GMNGeoffrey; flutter/devtools#4111 in earlier notes | 2 people |
| Cruise/GM checkout is terabyte-scale and was answered with a virtual filesystem | Built In 2022, EngFlow 2026 | 2 sources |
| Stripe moved to many short-lived devboxes per developer | Vasani talk 2022; bhuga HN 2024 (earlier notes) | 2 people |

## Angles for an essay

1. **The disk is the part that stays.** Across Stripe, Uber, Amazon and the PyTorch platform the instance is disposable and the volume is the developer's identity: re-attached, snapshotted, grown independently of the CPU. Gitpod's post-mortem gives the price (attach time, IOPS, AZ pinning).
2. **Disk as the real quota.** Nobody complains in public about cores. They complain about a build cache that fills half a terabyte weekly, or a repository where two clones exceed a terabyte. The escape is not a bigger disk but a virtual checkout (CitC, EdenFS, CASFS).
3. **One engineer, a small fleet.** An Amazon engineer cycling through five cloud desktops in five weeks, Stripe aiming at five devboxes per person: the personal machine has become a set of sized, named, deletable hosts, managed from a dotfiles repository.
4. **Three doors to a GPU.** At Meta the same team uses a shared 8-GPU devgpu, GPU remote-execution workers picked by the build, and the cluster scheduler. The devgpu is a commons run on etiquette (`taskset`, `CUDA_VISIBLE_DEVICES`), while the outside world's equivalent is a 24-hour reservation with wall-message warnings.
5. **What leaks and what does not.** Hostnames, instance types and `df` lines leak freely through bug reports; entitlement rules, quotas and reclaim policies never do. The evidence is rich on shape and almost silent on policy.

## Gaps

- **Persistent network volume as the common design:** supported by four published or measured cases (Stripe, Uber, PyTorch gpu-dev, Amazon). Not found: EBS snapshot pre-warming at Stripe in a primary source; storage designs for Slack, Figma, Datadog, Discord, Notion, Airbnb, LinkedIn; a dev-environment complaint about snapshot lazy-loading.
- Still empty: home-directory quotas anywhere; Meta devserver disk sizes; Cloudtop disk class and idle policy; per-person caps and approvals; GPU dev machines at Google, Amazon, OpenAI, Anthropic, NVIDIA and the AV companies.
- Not searched (budget or access): Sapling/Buck2/EdenFS issue trackers (org search returned zero), Reddit, Stack Overflow, Blind, LinkedIn posts, Microsoft Dev Box employee testimony, Qualcomm and NVIDIA path patterns beyond one query each.

## Addendum: Cloudtop mentions harvested from twenty Google-affiliated GitHub organisations

Method: issue search for "cloudtop" in `flutter`, `dart-lang`, `google`, `tensorflow`, `emscripten-core`, `bazelbuild`, `llvm`, `golang`, `kubernetes`, `GoogleChrome`, `jax-ml`, `WebAssembly`, `googleapis`, `GoogleCloudPlatform`, `grpc`, `protocolbuffers`, `angular`, `google-gemini` (about 350 hits; first 60 per org read with comments), filtered for sizes, disk, GPU, lifecycle and root. All [raw]. No disk size, quota, idle rule or home-directory statement appeared in any of them.

- **Cloudtops have no GPU (Q5).** "What happens when we don't support gpu acceleration at all (e.g. cloudtop)" (`stevegolton`, 2026-01-27); "I couldn't reproduce it either in my cloudtop. You see the stereoscopic rendering is broken when you try in a local machine with a physical GPU" (`z3moon`, 2025-07-28); a third engineer names the host CPU, "my gLinux Cloudtop which has AMD EPYC 7B13" and reports missing WebGPU features (`rmahdav`, 2026-10-21). 3 independent people for "the ordinary Cloudtop is a CPU-only VM". — [perfetto#4586](https://github.com/google/perfetto/pull/4586), [filament#8986](https://github.com/google/filament/pull/8986), [webai-compute-benchmark#253](https://github.com/GoogleChrome/webai-compute-benchmark/pull/253)
- **Sizes exist (Q4, Q6).** "The benchmark is passing so far on my large Cloudtop instance." (`zanderso`, 2025-01-10). — [flutter#161306](https://github.com/flutter/flutter/issues/161306)
- **Cloudtop instead of a workstation (Q4).** "I don't have a workstation only cloudtop." (quoted in a reply by `joeleba`, 2020-11-27). — [bazel#12574](https://github.com/bazelbuild/bazel/issues/12574)
- **Where they run.** A trace pasted by a Google engineer carries resource attributes `cloud.account.id` = "google.com:cloudtop-prod", `cloud.platform` = "gcp_compute_engine", zone "us-east1-b" (`alevenberg`, 2024-04-22). Hostname pattern seen in prompts: `<user>-cloudtop` (2 people, 2022 and 2026). — [google-cloud-cpp#13724](https://github.com/googleapis/google-cloud-cpp/issues/13724), [bazelisk#352](https://github.com/bazelbuild/bazelisk/issues/352), [magic-modules#18285](https://github.com/GoogleCloudPlatform/magic-modules/pull/18285)
- **Nested virtualisation is available.** "Nested-virt Cloudtop, 2+2 runs with a crosvm wrapper" versus "Bare-metal workstation" (`zhangxp1998`, 2026-10-15). — [android-cuttlefish#3354](https://github.com/google/android-cuttlefish/pull/3354)
- **Root (Q7).** `sudo go install ...` run at a `<user>-cloudtop` prompt (`dgnemo`, 2022-09-02); and a limit: "There is no `python2` installed on my cloudtop and I wasn't able to install `sudo apt-get install python-pip`" (`KyleJu`, 2021-07-30). 2 people for sudo on Cloudtop, 1 for a package that could not be installed. — [bazelisk#352](https://github.com/bazelbuild/bazelisk/issues/352), [chromium-dashboard#1445](https://github.com/GoogleChrome/chromium-dashboard/issues/1445)
- **A "shared cloudtop" exists.** Benchmark notes mention a "shared cloudtop (load average 32-52)" (2026-11-13). [raw, search fragment only; not opened] — [google-pytorch/torch_tpu#6645](https://github.com/google-pytorch/torch_tpu/pull/6645)

Effect on the tables: add "ordinary Google Cloudtop has no GPU" (3 people) and "Cloudtop users have sudo" (2 people, plus the earlier notes) to the corroborated claims.
