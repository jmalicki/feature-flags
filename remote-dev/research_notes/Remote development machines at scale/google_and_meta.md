# Remote development at Google and Meta (scoping pass, 26 Nov 2026)

How to read the tags on each finding:

- **[PDF read directly]**: I read the page images of the paper myself; quotes are exact.
- **[fetched]**: the full page was fetched, but through a summarising fetch tool. Quoted strings are as that tool returned them and should be re-checked against the page before they are printed in an essay.
- **[snippet]**: search-result snippet only; the page was not opened (or returned 403/402).
- **(ex-employee)**, **(HN comment)**, **(secondary)** mark source type. HN commenters' employment is self-claimed or inferred and unverified.

Source dates are given per finding. Nothing here from an official source is newer than Dec 2023 for Meta or Dec 2022 for Google's virtual desktops; the 2026 material is all ex-employee or forum commentary.

## 1. Is source code on the laptop? Where does the checkout live?

### Takeaway

At Google the main monorepo (google3) is not kept on laptops; the checkout is a cloud-backed FUSE overlay (CitC over Piper) mounted on a remote Linux machine, and several self-described Googlers say local storage of the code is forbidden, though I found no official statement of that policy. At Meta the laptop is officially a MacBook that fronts a Linux server where the code lives in an EdenFS virtual checkout; I found no source saying code is forbidden on Meta laptops.

### Cited Findings

#### Google

- "Most developers access Piper through a system called Clients in the Cloud, or CitC", which is "a cloud-based storage backend and a Linux-only FUSE file system"; "only modified files are stored in their workspace"; "an average workspace has fewer than 10 files" (Potvin and Levenberg, CACM, July 2016; statistics from Jan 2015). [fetched, via a blog that quotes the paper; the ACM page itself returned 403] — [mjtsai.com quoting CACM](https://mjtsai.com/blog/2016/06/30/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)
- Same paper: workspaces live in the cloud so they are available from any machine, and "over 80% of Piper users today use CitC" (2016). [snippet] — [CACM 2016](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)
- "There was a policy that forbade having code from this monorepo on your laptop." (HN comment, user kjgkjhfkjf, self-described former Googler who left mid-2010s; thread dated May 2026). Another commenter (brainwad): "It was a security policy." [fetched] — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- "You aren't even allowed to keep the source code on your local disk" and "If you need to do development locally, you are either doing something very wrong or extremely specialized." (HN comment, compiler-guy, apparent current Googler, May 2026). [fetched] — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- "All the developments are done in a virtual remote file system." (HN comment, summerlight, May 2026). "Cloudtop to run builds, g4 commands, etc., and srcfs / srcfsn to actually write code." (HN comment, honr, May 2026). [fetched] — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- Anonymous Blind posts say source is kept off laptops with exceptions for open-source work, the laptop is used to connect to a desktop or Cloudtop, and mobile development is an exception needing a Mac. [snippet; page returned 402; anonymous] — [Blind](https://www.teamblind.com/post/noogler-laptop-selection-question-szekpi01)
- Chromium OS developer docs: Cider-V can edit google3 code but not Chromium code; most developers on that team connect to remote build machines. (Undated public doc.) [snippet] — [chromium.org Tools used](https://www.chromium.org/chromium-os/developer-library/guides/development/tools-used/)

#### Meta

- "Many developers at Meta have a MacBook, but actually do their coding on a Linux server." (Neil Mitchell, Meta, 15 Nov 2022). [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)
- "most development is done directly on individually-reserved development servers that live within our data centers"; engineers "have Visual Studio Code installed locally on laptops" (Joel Marcey, Facebook, 19 Nov 2019). [fetched] — [Facebook developer blog 2019](https://developers.facebook.com/blog/post/2019/11/19/facebook-microsoft-partnering-remote-development)
- Source control is a Mercurial-derived system (Sapling) with the Mononoke server; files are reached through the EdenFS virtual file system rather than fully written to disk; Watchman detects changes (15 Nov 2022). [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)
- "A more ergonomic alternative is EdenFS, which checks out everything in a few seconds" and fetches file contents on access (Neil Mitchell, 27 Jun 2023). [fetched] — [Meta engineering blog 2023](https://engineering.fb.com/2023/06/27/developer-tools/meta-developer-tools-open-source/)
- "Android app development at Meta was super painful because of the repo size." (HN comment, shaftway, self-described ex-Googler who moved to Meta in 2022; May 2026). [fetched] — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- A LinkedIn post by a former Meta engineer claims mobile engineers had a laptop plus a Mac Pro for builds. [snippet; unverified; exact URL not captured] — surfaced in search alongside [Meta iOS architecture post](https://engineering.fb.com/2023/02/06/ios/facebook-ios-app-architecture/)

### Inferences

- Both companies solved "the repo is too big to clone" with a lazy virtual filesystem, but Google's overlay stores the working copy in a cloud backend (machine-independent), while Meta's public description ties the working copy to a server plus a persistent home drive.
- Google's laptop rule looks like a security policy layered on top of a technical necessity; at Meta the public sources give only the technical reason.

### Gaps

- No official Google document stating the no-code-on-laptop policy; only forum claims.
- Not found: any statement on whether Meta forbids source on laptops, or how Meta mobile (iOS/Android) engineers work. EdenFS runs on macOS, which suggests local checkouts exist, but I have no source.

## 2. Editors and how they connect; adoption numbers

### Takeaway

Google converged on a browser IDE (Cider, then Cider V on a VS Code frontend) whose backend indexes the whole monorepo; an ex-tech-lead reports 80% of main-codebase development in Cider V by 2023, and forum comments say a 2026 push toward an agentic VS Code fork (Jetski/Antigravity). Meta made VS Code the default in 2019, running locally on the laptop and connected to the devserver through custom remote extensions; no Meta adoption number was found.

### Cited Findings

#### Google

- Cider is a web editor begun around 2013 (the author marks the year as uncertain); first used by technical writers; its backend indexes the entire codebase. In 2020 the team adopted the VS Code frontend as Cider V; open beta had 5,000 engineers in 2021; "80% of the development in the main Google codebase happened in Cider V" by 2023; about 100 internal extensions within two years; a team for IntelliJ integration formed around 2015. (Laurent Le Brun, at Google 2011 to 2024, Cider V tech lead; post dated 9 May 2026.) [fetched] (ex-employee, first-person) — [A History of IDEs at Google](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google)
- Same post, reasons: internal tools were already web-based and the company used Chromebooks; the local-IDE assumption of local source and local indexing "starts to break down" at Google's scale. [fetched] — [A History of IDEs at Google](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google)
- "the entire codebase shows up as soon as I open the Cider-V web app"; the Cider-V terminal connects automatically to the author's Cloudtop; "I can code, test and submit the code changes all using a web browser." (Chen Zhe, joined Google 2022, post dated 20 Feb 2026.) [fetched] (ex-employee) — [Google's Developer Infrastructure is Unmatched](https://chen-zhe.github.io/blog/p/googles-developer-infrastructure-is-unmatched)
- Access to virtual desktops: "some employees access their virtual desktop instances via Secure Shell (SSH), while others use Chrome Remote Desktop" (Nick Yeager, Google, 8 Dec 2022). [fetched] — [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future)
- Other editors, from HN (May 2026): "The ssh latency is good enough that I can run X forwarding to launch graphical instances of emacs and gvim." (kccqzy); IntelliJ was "possible, even preferred" (cletus, self-described Googler 2010 to 2017); "Yeah I just use vim and jetski CLI" (jim33442). [fetched] (HN comments) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- Change of direction, from HN (May 2026): "Antigravity is the public version of jetski which is a VScode fork made by the windsurf team." (randomCloud); "the company-wide push was to standardize on Antigravity" (nostrademons, says left 2026); "antigravity IDE is much less seemless compared to Cider-V." (randomgoogler1). Commenters contradict each other on whether the public Antigravity is usable internally. [fetched] (HN comments, conflicting) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)

#### Meta

- "We're making Visual Studio Code the default development environment at Facebook."; it was "used extensively across the company in beta"; Nuclide's open-source releases stopped in 2018 and its features moved into internal VS Code extensions (19 Nov 2019). [fetched] — [Facebook developer blog 2019](https://developers.facebook.com/blog/post/2019/11/19/facebook-microsoft-partnering-remote-development)
- Custom VS Code extensions let local VS Code open files on a remote server; search and similar features are replaced by custom implementations because the repository is too large for the stock ones (15 Nov 2022). [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)
- Devservers are reached by SSH or VS Code remote; OnDemand is reached mainly through VS Code, with a CLI (Henrique Andrade, Meta, QCon New York June 2023, published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)

### Inferences

- The two companies made opposite frontend choices: Google runs the editor UI in the browser against a central backend; Meta runs the editor UI on the laptop and remotes into a per-user machine. Both ended up on VS Code's frontend (Meta 2019, Google 2020).
- Google's 80% figure measures share of development in google3, not share of engineers; aggregator sites restate it as "80% adoption among engineers", which the source does not say.

### Gaps

- No Meta adoption figure for VS Code, vim/emacs, or JetBrains.
- No official Google statement on Jetski/Antigravity internal use; forum only.
- The paywalled Pragmatic Engineer Pulse #157 (18 Dec 2025) covers three internal Meta AI coding tools; body not readable. [fetched, truncated] — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/the-pulse-157-internal-dev-tooling)

## 3. Kinds of remote machine; persistent or ephemeral; reserved or pooled; time to get one

### Takeaway

Google's model is one persistent personal machine: a physical desk workstation or a Cloudtop VM (on Ganeti until the move to Compute Engine that began in 2016), with the working copy separately held in CitC. Meta runs two tiers: reserved devservers (VM or physical, leases from weeks to permanent) and OnDemand containers that are pooled, pre-warmed, and disposed of after about a day and a half.

### Cited Findings

#### Google

- "Over one-fourth of Googlers use internal, data-center-hosted virtual desktops." An instance "can be sized according to the task at hand, has persistent user storage, and can be moved between corporate data centers to follow traveling Googlers." (Fata, Arida, Hahn, Beyer, ACM Queue, May-June 2018.) [PDF read directly] — [From Corp to Cloud: Google's Virtual Desktops](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Previously hosted on Ganeti on the corporate network; the team "began migrating Google's top corporate workload to GCP in early 2016"; "approximately 20,000 virtual desktop users had to be moved". [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Provisioning at launch: after enrolling, "the user still needed to wait several hours before the instance became fully trusted by all systems"; provisioning and testing "took three user interactions over a period of three to five hours", later fixed by folding enrollment into the request. [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- How little state lived on the machines: asked whether they needed their disk, "Much of the time, the answer was no"; "only about 50 percent of users cared enough about preserving their disks to wait 24 hours for the move to complete." [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Cloudtop was "first made ... available to employees in 2017" and is not sold externally (CNBC, 12 Apr 2021). [fetched] (secondary, press) — [CNBC](https://www.cnbc.com/amp/2021/04/12/google-cloudtop-virtual-desktop-tool-for-employees-only.html)
- "most Google employees rely on virtual desktops to get their work done"; "cloud-based desktops can be created instantaneously on-demand and resized on-demand"; before, "it was not uncommon for employees to spend days waiting for IT to deliver new machines or fix physical workstations." (8 Dec 2022.) [fetched] — [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future)
- Physical workstations persist: "I use a workstation specifically to improve latency. Needed to get approval at some point to get a refresh though." and "Yeah, under my desk." (HN comment, wmedrano, May 2026.) [fetched] (HN comment) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)

#### Meta

- "The devserver option consists of a Linux server that is located in one of the Meta data centers."; engineers choose the data center; VMs in several sizes and physical servers for kernel and driver work; leases from "a couple weeks" to permanent; fresh servers ready "in a couple of hours", with pre-provisioned servers kept ahead of demand (Andrade, published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)
- OnDemand containers are "pre-warmed and pre-configured with respect to source control repositories"; "the container instances themselves are ephemeral, lasting a little over a day"; "They live for a day and a half and are then disposed of."; built on Twine; available "at a click of the mouse" (no timing given). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)
- An on-demand devserver is "a remote server that you grab, do some coding with and then release", typically at day's end; it arrives "ready to go, with common tools fetched, caches warmed and other preparations"; continuity comes from "a persistent home drive and a source control server that automatically returns you to where you left off"; the result is "an even faster experience than having a dedicated machine." (15 Nov 2022.) [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)
- In 2019 the description was only of "individually-reserved development servers". [fetched] — [Facebook developer blog 2019](https://developers.facebook.com/blog/post/2019/11/19/facebook-microsoft-partnering-remote-development)
- "Facebook had it better." and "And the instant start cloud dev servers complete with shareable full stack preview links!" (HN comment, exclipy, self-described ex-Googler who moved to Facebook in 2019; May 2026.) [fetched] (HN comment) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)

### Inferences

- Meta's public framing moved from reserved servers (2019) to ephemeral-by-default (2022 to 2023). Google's public framing never became ephemeral: the machine stays a pet, but CitC makes its disk nearly disposable, as the 2018 trade-in data shows.
- The two reach the same property (lose the machine, lose nothing) by different routes: Google by moving the working copy into a cloud filesystem, Meta by a persistent home drive plus source control that restores state.

### Gaps

- No timing figure for OnDemand start-up, and no current provisioning time for Cloudtop beyond "instantaneously" (2022).
- No share of Meta engineers on OnDemand versus devservers.
- No current Cloudtop share: "over one-fourth" (2018) and "most" (2022) are the only data points.

## 4. Several machines? Size? GPUs?

### Takeaway

Public sources give almost no hard specifications for either company. Both describe a menu of sizes with caps, and both mention GPU or ML-oriented flavours.

### Cited Findings

#### Google

- "Instances should be provisioned with enough resources for users to do their work effectively but should also have caps to prevent users from gratuitously creating high-specification/high-cost devices. Users can choose where to build their instances" (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- On migration, "Users were offered large increases in standard CPU, RAM, and disk specs." (2018; no figures). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Machine families named: E2 for day-to-day tasks, N2/N2D for "more demanding machine learning jobs"; the fleet "can be upgraded to new shapes (with more CPU and RAM) with a single config change and a simple reboot" (8 Dec 2022; no core or RAM numbers). [fetched] — [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future)
- The 2018 paper suggests cloud desktop "could automatically request that owners of idle machines delete instances they don't actually need", implying a user can own more than one. [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Heavy compute is elsewhere: unit tests run on shared servers from a button in Cider-V, and code for TPU-backed servers "has to be run remotely" (ex-employee, 20 Feb 2026). [fetched] — [Chen Zhe blog](https://chen-zhe.github.io/blog/p/googles-developer-infrastructure-is-unmatched)

#### Meta

- Devserver VMs come in different CPU, memory and storage sizes; flavours with GPUs, accelerators or particular network hardware exist; a devserver can be shared with teammates and migrated to a bigger one or another region; OnDemand offers several hardware profiles including GPU (published 19 Dec 2023; no figures). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)
- With Buck2 a developer can use "thousands of machines to run compilations in parallel" (27 Jun 2023). [fetched] — [Meta engineering blog 2023](https://engineering.fb.com/2023/06/27/developer-tools/meta-developer-tools-open-source/)

### Inferences

- The dev machine at both companies is an edit-and-orchestrate host; builds and tests fan out to shared remote execution (Blaze/Forge, Buck2 RE), which is why exact core counts matter less than outsiders assume.

### Gaps

- Not found: cores or RAM for any Cloudtop, devserver or OnDemand shape; whether Cloudtops can have GPUs; an explicit statement of how many machines one engineer may hold at either company.

## 5. Root access, installing software, image management

### Takeaway

Google's virtual desktops run gLinux from a centrally built golden image and are centrally inventoried and updated, yet the paper acknowledges engineers customise them heavily. For Meta I found provisioning-system management and no default direct internet access, but nothing on root.

### Cited Findings

#### Google

- "Google uses an internally managed Linux distribution based on Debian, called gLinux, for corporate hosts."; on Cloud the process "starts with an image created by gLinux release tooling"; a user's migrated data was merged "onto a copy of the golden master image" (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- "Hosts must also be able to update packages and configurations driven by the operating system installation and must be able to send logs to a central location"; instances are created on the user's behalf by corporate tooling rather than by users calling Cloud directly (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- "Google employs a great many engineers; if you give an engineer a Linux machine, there's a good chance that the machine will be customized within an inch of its life." (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- "Cloud desktop enforces these policies by default; it encourages users to fix their workflows rather than carry forward bad practices." (on security-policy exceptions, 2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- "the system is so locked down you're going to make a lot of sacrifices." (HN comment, tipsytoad, self-described current Googler, May 2026). [fetched] (HN comment) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)

#### Meta

- "Every devserver is managed by a provisioning system" that applies most updates automatically; devservers "do not have direct access to the Internet" by default; automated backups allow moving to a new devserver; OnDemand offers multiple preconfigured software stacks (published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)

### Inferences

- The customisation quote implies Google engineers had root, or at least wide latitude, on virtual desktops in 2018, but the paper does not say so directly.

### Gaps

- Not found: whether engineers have root or sudo on Cloudtop, Meta devservers or OnDemand; how OnDemand images are built; whether Meta uses Chef on devservers (commonly said, no source here).

## 6. Why they did it; history

### Takeaway

The stated reasons differ by layer. For the checkout and IDE, both cite monorepo scale. For Google's VM move, the stated reasons are operational toil, cost and lead time, with hardware-attack security added in 2022. Meta's stated reasons are speed (pre-warmed caches) and, in the reliability talk, surviving data-center loss. Onboarding and laptop loss are not given as reasons in anything I read.

### Cited Findings

#### Google

- Timeline: CitC in use by most Piper users by 2016 (snippet); Cider from about 2013; IntelliJ integration team about 2015; virtual desktops on Ganeti before 2016; GCP migration from early 2016; Cloudtop available to employees 2017; over one-fourth of Googlers on virtual desktops by 2018; Cider V 2020, beta 2021, 80% of google3 development 2023; "most" employees on virtual desktops Dec 2022. — [CACM 2016](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/) [snippet]; [Le Brun](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google) [fetched]; [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf) [PDF read directly]; [CNBC](https://www.cnbc.com/amp/2021/04/12/google-cloudtop-virtual-desktop-tool-for-employees-only.html) [fetched]; [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future) [fetched]
- Reasons for leaving Ganeti: "Long lead times to expand fleet capacity", "Substantial and ongoing maintenance overhead", difficulty staffing, "Resource waste of underlying hardware, given working hours for a typical Googler are 8-10 hours a day", duplicated virtualisation effort. Goals: "Large reduction in engineering toil", "Improved user experience", "Reduced total cost of platform ownership", "Desire to improve GCP". Result: "a 95 percent drop in pager load". (2018.) [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Security framing: virtual desktops "mitigate the ability for a bad actor to exfiltrate data or otherwise compromise physical desktop hardware"; USB and evil-maid attacks "become worries of the past" (8 Dec 2022). [fetched] — [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future)
- BeyondCorp made it workable: access is granted "usually via a corporate laptop, but now also from appropriately managed and inventoried hosts on GCE" (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- IDE reason: local IDEs assume local source and indexing, which fails at "a billion files" (ex-employee, 9 May 2026). [fetched] — [Le Brun](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google)

#### Meta

- Timeline: Nuclide open-source releases end 2018; VS Code named default with remote development on reserved devservers, Nov 2019; on-demand devservers described as widely used, Nov 2022; devserver plus OnDemand reliability talk, June 2023. — [Facebook developer blog 2019](https://developers.facebook.com/blog/post/2019/11/19/facebook-microsoft-partnering-remote-development) [fetched]; [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/) [fetched]; [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment) [fetched]
- Stated reason for on-demand: warmed caches and pre-fetched tools give "an even faster experience than having a dedicated machine" (2022). [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)
- Scale reason: "thousands of developers" in "repositories with millions of files" (27 Jun 2023). [fetched] — [Meta engineering blog 2023](https://engineering.fb.com/2023/06/27/developer-tools/meta-developer-tools-open-source/)
- Reliability reason: Meta runs "storms" that disconnect a data center and "dark storms" that may "wipe the contents of random devservers"; the developer environment has to be "bulletproof" because engineers need it to fix other outages (published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)

### Inferences

- Security is the reason outsiders most often assume, but in the primary sources it is a late or secondary argument (Google 2022) or absent (Meta). The first-order reasons are repo scale and fleet operations.
- Meta's disaster drills make ephemerality a discipline: if devservers can be wiped at random, nobody can keep irreplaceable state on one.

### Gaps

- Not found: any source giving onboarding speed or laptop loss or theft as a motivation at either company; when Meta devservers first appeared; when OnDemand launched.

## 7. Downsides, complaints, changes of direction

### Takeaway

The recurring complaints are latency (keystroke and filesystem), lock-in to a locked-down environment, and the cost of maintaining forks and bespoke infrastructure. The clearest change of direction is Google's reported 2026 push from Cider V toward Jetski/Antigravity, which rests on forum comments only.

### Cited Findings

#### Google

- Official caveats: a virtual fleet "requires a consistently reliable and performant client internet connection"; users should be near a cloud region; physical workstations remain for USB or direct I/O hardware work and ultra-low-latency graphics (8 Dec 2022). [fetched] — [Google Cloud blog 2022](https://cloud.google.com/blog/topics/developers-practitioners/googles-virtual-desktop-future)
- Perception gap: "subjective feedback on the relative performance of virtual desktops on Cloud versus the corporate network was split (when, in fact, performance on Cloud was superior)"; early rollout had "some completely broken use cases" from applications that assumed corporate-network hostnames or IPs (2018). [PDF read directly] — [From Corp to Cloud](https://storage.googleapis.com/gweb-research2023-media/pubtools/4484.pdf)
- Early Cider "couldn't compete with actual IDEs"; maintaining a monthly-updated VS Code fork is ongoing work; few companies can justify the investment (ex-employee, 9 May 2026). [fetched] — [Le Brun](https://laurent.le-brun.eu/blog/a-history-of-ides-at-google)
- HN (May 2026): "how do you deal with cloudtop latency though? sometimes my neovim is very slow and laggy" (semiinfinitely); "the latency of the filesystem is a different problem." (j2kun); "Even cider-v was rather so-so if you needed to navigate complex c++ code." (galkk); "they'd replaced it with a VSCode clone that truly was just a glorified text editor" (dotwaffle); "Each keystroke would have to roundtrip before appearing on the screen." (achille, on a remote-desktop setup). [fetched] (HN comments) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- Cost scale guess: "piper, citc, kyte, critique, and depserver* represent (wet finger in the wind guess) probably $100M of development effort." (HN comment, aiuto, self-described Googler 2007 to 2025). [fetched] (HN comment, explicitly a guess) — [HN thread 48073979](https://news.ycombinator.com/item?id=48073979)
- Debugging with pdb works only when the code runs on the Cloudtop (ex-employee, 20 Feb 2026). [fetched] — [Chen Zhe blog](https://chen-zhe.github.io/blog/p/googles-developer-infrastructure-is-unmatched)

#### Meta

- Engineers "should never be running a production service on their devserver" because it "can disappear without notice"; physical devservers get no live migration and become unreachable in storms; dependence on internal DNS was a single point of failure that needed a bypass; "Our team is small" (published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)
- Devservers have no direct internet access by default (published 19 Dec 2023). [fetched] — [InfoQ talk](https://www.infoq.com/presentations/meta-production-environment)
- Stock VS Code features had to be replaced because they are too slow on the repository (15 Nov 2022). [fetched] — [Meta developer blog 2022](https://developers.facebook.com/blog/post/2022/11/15/meta-developers-workflow-exploring-tools-used-to-code/)

### Inferences

- Each company's complaint profile follows its architecture: Google's are about remote-filesystem and remote-UI latency and lock-down; Meta's public ones are about machines vanishing and network dependence.

### Gaps

- Almost no engineer complaints about Meta devservers or OnDemand were found; that reflects thin searching, not evidence of satisfaction.
- No official source on Google's Jetski/Antigravity direction or on where AI coding agents run at either company. Search snippets mention a Meta "Muse Code" terminal agent (2026 press), not opened and not about internal infrastructure.

## Angles for an essay

1. **The machine is not the unit; the workspace is.** Google kept pet machines but moved the working copy into CitC, so in the 2018 migration only about half of users cared to keep their disks. Meta made the machine itself disposable (a day and a half) and restores state from a home drive and source control. Two routes to the same property.
2. **Security is the reason people assume, not the reason given.** The primary sources lead with repo scale, fleet toil, cost and speed. Google's hardware-attack argument appears in 2022, six years after the migration began; Meta's posts do not argue security at all. The no-code-on-laptops rule at Google is attested only by forum comments.
3. **Browser IDE versus local IDE with a remote backend.** Both adopted the VS Code frontend within a year of each other (2019, 2020) but split it differently, and the complaints differ accordingly. A good test case for where to cut the client/server line.
4. **Ephemeral beat dedicated on speed.** Meta's claim that a grabbed, pre-warmed machine is faster than your own reserved one inverts the usual intuition, and Meta's random devserver wipes turn that into an enforced habit.
5. **The dev box is a thin orchestrator.** At both companies builds and tests run on shared remote execution, which is why published sources never bother stating cores or RAM. The essay should be wary of framing this as "big machines".
6. **Cost of the model.** A former Cider V lead says few companies can justify it; the Google paper argues the VM layer, at least, transfers to smaller companies with little specialisation. That tension is useful for a general-audience essay.

### Open questions not answered in this pass

- Root or sudo rights on Cloudtop, devservers and OnDemand; how OnDemand images are built.
- Any cores, RAM or GPU figures; how many machines one engineer may hold.
- OnDemand start-up time and share of Meta engineers using it; current Cloudtop versus physical workstation split.
- An official statement of Google's source-on-laptop policy; Meta's policy and its mobile-developer workflow.
- Where coding agents run at each company in 2026, and whether Google is really moving off Cider V.
- Sources worth a second pass: Software Engineering at Google (book) tooling chapters, the full CACM monorepo paper (ACM pages returned 403 here), the paywalled Pragmatic Engineer pieces on Meta (May 2022, Dec 2025), and the Meta Careers podcast "What it's like to write code at Meta" (10 Feb 2026, seen in search results only).
