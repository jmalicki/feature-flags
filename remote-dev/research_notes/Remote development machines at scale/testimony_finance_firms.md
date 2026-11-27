# Public testimony by individuals: developer machines at financial, trading and payments firms

Scope and method. About 40 searches and fetches on 2026-11-26. Sources are statements by individuals, not company posts. Read tags:

- **raw text** = full comment text pulled from the Hacker News Algolia API, or full transcript HTML downloaded from signalsandthreads.com and read locally. Verbatim quotes come only from these.
- **fragment** = a 300-character window of the raw API text; the rest of the comment was not read.
- **snippet only** = a search engine's summary of a page I could not open (Blind returns HTTP 402; Reddit is blocked to both search and fetch).

"Voices" counts independent people making the same claim in the first person. Second-hand reports and general assertions are listed but not counted. Most speakers do not name their employer; "a bank" is the norm. Nothing here is verified beyond what the speaker claims about themselves. Stripe testimony is already in `engineer_testimony_specs.md` and is only pointed to here.

What the search could not reach matters as much as what it found: see the gaps at the end. Reddit, Blind and Glassdoor hold most of this kind of testimony and none could be read.

## 1. Where code lives and where it is edited

### Takeaway

Seven independent people describe bank or bank-contractor development happening inside a remote Windows desktop (Citrix or similar), with the device on the desk acting as a terminal. Trading firms look different in the little testimony found: Jane Street speakers describe each developer having a development machine that runs their work, and Stripe engineers describe code living on a remote devbox reached over SSH.

### Cited Findings

#### Banks: remote Windows desktop as the place of work (7 first-person voices)

- Unnamed "bulge bracket bank", MrApathy (says SWE there), 2021-07-09: "I work for a bulge bracket bank and have been on a VDI for the past five years, currently on my third desktop. This is extremely common in finance, most developers are running on VDI's since it's much easier to manage and lock down." [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- Unnamed "Tier 1 bank", user5994461 (former bank developer), 2020-08-04: "The bank was using remote desktops over Citrix from HP workstations (thin clients). It worked really really well, including copy/paste. If not for the initial login and citrix log, I don't think it would be possible for a developer to figure out he is working on a remote desktop." [raw text] — [HN 24049951](https://news.ycombinator.com/item?id=24049951)
- JPMorgan, ericmay (says he worked there, in "Digital"), 2023-05-16: "as if JPM issues corporate laptops - most employees use the stupid VDI". Follow-up: "I know they don't issue corporate laptops to most employees. I had a Mac because I worked in Digital but that was the exception, not the rule." He is speaking of employees generally, not only developers. Another commenter (blitzar) challenged the claim in-thread without offering first-hand knowledge. [raw text] — [HN 35960375](https://news.ycombinator.com/item?id=35960375), [HN 35960790](https://news.ycombinator.com/item?id=35960790)
- JPMorgan (implied by thread), phire0, 2023-05-25: "As an employee, I can confirm I have seen my webcam light up when logging onto Citrix from my desktop, and every time I access it via the web, Chrome asks for permission to use the webcam." Role not stated. [raw text] — [HN 36070021](https://news.ycombinator.com/item?id=36070021)
- Unnamed bank, dhosek, 2021-03-08: "I have to use Windows 7 daily at my current job at a bank (connecting via VDI)." Role not stated. [raw text] — [HN 26382366](https://news.ycombinator.com/item?id=26382366)
- Bank of America as client, debarshri (says he worked at Tata Consultancy Services), 2023-07-22, describing 2010: "The employees of TCS would connect over teamviewer into a VDI that would have access to the actual server where they would code." [raw text] — [HN 36824910](https://news.ycombinator.com/item?id=36824910)
- "Fintech companies (including ones that either belong to or own a bank)", jesus_666, 2025-07-08, describes two playbooks: powerful laptops loaded with security suites, or "a tech stack that's either 100% Azure or 99% Azure with the remaining 1% being Citrix. You can dial in with anything that can run a Citrix client or a browser modern enough to run the AVD web client." [raw text] — [HN 44498150](https://news.ycombinator.com/item?id=44498150)
- Not counted (role unknown, fragment): sithadmin, 2021-05-28: "these banks are nearly entirely reliant on VDI for most employees. Most work cannot be done without connecting to a Citrix or Horizon ses[sion]". [fragment] — [HN 27315060](https://news.ycombinator.com/item?id=27315060)
- Not counted (general assertion): easton, 2020-09-01, on Codespaces: "It's the same rationale as having Citrix for developers in big banks, so they don't have anything on their local machine." [raw text] — [HN 24340478](https://news.ycombinator.com/item?id=24340478)
- Not counted: a Blind post is summarised by search as saying banks issue no work laptop and developers use Citrix to reach a remote computer. [snippet only] — [Blind](https://www.teamblind.com/post/how-to-copypaste-code-from-vdi-ih4fgmeg)

#### Banks: desktops or Windows-only policy, code kept on premises (2 voices)

- Unnamed bank, Cthulhu_, 2020-12-01: "we worked on desktop PC's at a bank, because they were very reluctant about developers taking code outside of their premises... They slackened that policy off a bit after risk analysis and making full disk encryption mandatory at least." [raw text] — [HN 25264576](https://news.ycombinator.com/item?id=25264576)
- Unnamed bank, jrockway (former employee), 2013-10-05: "The company had a policy of only allowing developers to develop on Windows machines, but this team needed to deploy to Solaris." [raw text] — [HN 6498962](https://news.ycombinator.com/item?id=6498962)

#### Fintech moving from laptop to VM (1 voice)

- Employer unnamed; the mention of DORA implies an EU financial entity. krawat3, 2026-11-09: "6 years ago I just got a MacBook with admin rights and that was it. Then, as regulations such as DORA started to take effect, I lost my admin account. Then this year we were acquired by a large org and now I am doing coding inside a VM." [raw text] — [HN 50422457](https://news.ycombinator.com/item?id=50422457)

#### Jane Street: a development machine per developer (2 named speakers, company podcast)

- John Crepezzi (Jane Street engineer) and Ron Minsky, Signals and Threads episode 31, 2026-10-16. Crepezzi: "there's a central orchestrator that takes in all of the prompts and is able to distribute work onto any of the host It's connected to it, where the hosts are roughly all of the developer machines at the firm plus a bunch of build boxes." And: "the work that it's actually doing, it's like running as you on your computer. It's not like we have a bunch of AI build boxes out there. It's just actually distributing the work back to your development machine." Whether that machine sits under a desk or in a datacenter is not stated. [raw text] — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)

#### Stripe: code on a remote devbox (2 voices, see other notes)

- nkohari (ex-Stripe) and bhuga (Stripe), 2024-08-19: code "is no longer kept on developer machines"; engineers use VS Code over SSH. Fully recorded in `engineer_testimony_specs.md`. [raw text] — [HN 41291111](https://news.ycombinator.com/item?id=41291111), [HN 41291251](https://news.ycombinator.com/item?id=41291251)

#### Asset managers and hedge funds (1 non-developer voice, 1 second-hand)

- dnadler (portfolio management and research side), 2020-03-05: at "2 very large asset managers, and one pretty large hedge fund... I can remotely log in to my computer through Citrix." This is Citrix as remote access to an office PC, not as the primary desktop. [raw text] — [HN 22499590](https://news.ycombinator.com/item?id=22499590)
- Second-hand, not counted: PaulHoule, 2019-11-19, says Bridgewater "has switched to desktop virtualization" partly because they "don't want employees walking out" with laptops. He does not claim to have worked there. [raw text] — [HN 21573557](https://news.ycombinator.com/item?id=21573557)

#### Bloomberg (snippet only)

- A Blind thread titled "Bloomberg laptop" is summarised by search as: engineers choose a Windows or Mac laptop, about a third choose MacBooks, Docker on either, WSL on Windows. Old, anonymous, unread. [snippet only] — [Blind](https://www.teamblind.com/post/bloomberg-laptop-gfscgkww)

### Inferences

- The bank pattern in testimony is a remote *Windows* desktop. Nobody in the testimony found describes a bank giving developers a Linux dev box as the primary environment; the nearest is debarshri's "VDI that would have access to the actual server where they would code", which is a remote desktop in front of a server.
- Jane Street's "your development machine" phrasing and its orchestrator treating developer machines as addressable hosts imply long-lived, network-reachable machines, one per developer. That is a reading of the transcript, not a statement in it.

### Gaps

- Whether source code is permitted on laptops: no first-person statement for any named bank or trading firm apart from the JPMorgan "most employees have no laptop" claim.
- No testimony found for Two Sigma, Citadel, HRT, Jump, DE Shaw, DRW, Optiver, IMC, Goldman Sachs (developers), Morgan Stanley, Citi, Barclays, UBS, Deutsche Bank, HSBC, ING, Capital One, Fidelity, BlackRock, Block, PayPal, Adyen, Plaid, Coinbase, Robinhood, Revolut, Monzo, Wise, Klarna, Nubank, Visa, Mastercard, Brex, Ramp, Affirm or Chime. HN full-text search returned nothing usable for any of them.

## 2. Root, admin rights and installing software

### Takeaway

No admin rights on the bank machine is the best-corroborated claim in this pass (5 first-person voices, plus one fintech). Software comes from an internal approved catalogue and packages through an internal proxy (3 voices). The one hedge-fund developer who addresses it describes the opposite: root everywhere.

### Cited Findings

#### No local admin at banks (5 voices; 6 with the fintech)

- badpun (bank developer), 2018-11-15: "probably over 50% of my work as a developer in bank was about dealing with security", including "Finding workarounds to not having admin rights on my laptop". [raw text] — [HN 18462953](https://news.ycombinator.com/item?id=18462953)
- teh_klev ("major UK bank", "twice in my career"), 2016-10-17: "there may be a handful of very specific developers who get full admin rights over their machines... but these machines are often sandboxed. In many cases you're stuck as a 'Power User' or whatever group policy the IT department deems sufficient for you to run Visual Studio (or IntelliJ etc)." [raw text] — [HN 12726406](https://news.ycombinator.com/item?id=12726406)
- user5994461, 2019-03-24: "I worked in bank for a while without admin. In many years, the only tool that needed admin rights to run was the Visual Studio C++ Debugger." [raw text] — [HN 19476741](https://news.ycombinator.com/item?id=19476741)
- gpm (bank intern), 2022-09-01: "They locked down developers laptops to the point of being unusable. Except all the developers just got permission to install virtual box, and ran another OS inside virtual box that they could and did do whatever they wanted to." [raw text] — [HN 32683476](https://news.ycombinator.com/item?id=32683476)
- MrApathy (bulge bracket bank), 2021-07-09, lists "Heavily locked down" among complaints about the VDI. [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- krawat3 (probable EU fintech), 2026-11-09: lost the admin account as DORA took effect; "I cannot use unapproved software on my work machine". [raw text] — [HN 50422457](https://news.ycombinator.com/item?id=50422457), [HN 50422528](https://news.ycombinator.com/item?id=50422528)
- General assertion, not counted: oldsecondhand, 2025-07-08: "In places where security matters (e.g. fintech jobs), they just lock down your PC (no admin rights), encrypt the storage". [raw text] — [HN 44496902](https://news.ycombinator.com/item?id=44496902)
- Not counted: a Blind thread is summarised by search as a commenter calling "no admin rights and needing 3 approvals to install well known OSS" normal at a bank. [snippet only] — [Blind](https://www.teamblind.com/post/first-week-as-swe-at-fintech-tfrmwbrv)

#### Approved-software catalogue (1 voice, 1 general assertion)

- MrApathy: "Software request and installation fully automated, quite easy to get the applications I need with the caveat that the software is approved and packaged internally. I can select from a list of approved IDE's, for example, but if I want to use something less common, next to impossible to get it approved (tons of paperwork & reviews)." [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- ayewo, 2023-03-17 (no claimed employer): banks "typically hand out computers that are locked down to their employees, including developers. So any engineer that wants to install the GitHub Copilot extension or indeed any non-approved third party extension from the VSCode Marketplace will first have a word with the folks in IT." [raw text] — [HN 35197368](https://news.ycombinator.com/item?id=35197368)

#### Package proxies and blocked repositories (3 voices)

- jamaicahest ("worked with several banks as a devops consultant"), 2022-01-11: "helped implement self-hosted proxy repositories for NPM, NuGet, etc... Developers are then blocked from downloading from any other repository than these proxies." Stated motive: reproducing code "X years into the past, as can be required of banks by financial regulators". [raw text] — [HN 29889215](https://news.ycombinator.com/item?id=29889215)
- badpun: "Finding workarounds to bank's firewall (a lot of package repos were blacklisted)". [raw text] — [HN 18462953](https://news.ycombinator.com/item?id=18462953)
- geofft (works on infrastructure at a hedge fund), 2018-05-18: "all internet access goes through a proxy... We're not able to `docker pull` very easily because of the proxy, but if we generate our own images they work fine." [raw text] — [HN 17101261](https://news.ycombinator.com/item?id=17101261)

#### WSL (1 voice)

- MithrilTuxedo ("the enterprise bank I work for"), 2022-02-05: the bank "needs a business justification to spend resources to figure out if there's a business justification for allowing the installation of WSL. I asked in 2019." [raw text] — [HN 30224308](https://news.ycombinator.com/item?id=30224308)

#### Hedge funds: root (1 voice)

- twic (hedge fund developer), 2017-11-18: "The security varies a lot. At one hedge fund I interviewed at, security was almost MI5-like - no phones in the office, no direct internet access, etc. At the place I ended up working, it's rootapalooza. Not in prod, obviously - there it's sudo-a-gogo." [raw text] — [HN 15730859](https://news.ycombinator.com/item?id=15730859)

#### Jane Street: trust plus access control (named speaker)

- Ron Minsky, 2026-10-16: "we give people a lot of trust and we give them a lot of access to do things, but there's still an access control system." Root or sudo is not mentioned. [raw text] — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)

### Inferences

- Two voices (gpm, and indirectly teh_klev's "sandboxed" admin machines) describe the same escape valve: admin inside a contained machine, none on the managed one. gpm's bank reached it through VirtualBox on the laptop. This is the laptop-era version of "root on a disposable remote box".
- Proxy-only package access is described for both banks and a hedge fund, so the network control is not specific to the locked-down-desktop firms.

### Gaps

- Sudo on a remote Linux dev box at a bank: no testimony. Docker policy at banks: none (the only Docker remark is the hedge-fund proxy one).
- No statement on root at Jane Street, Two Sigma, Citadel or HRT.

## 3. Size, disk, GPUs

### Takeaway

One bank developer gives VDI specs across three generations. Jane Street speakers give the only GPU figures, for a shared batch cluster rather than dev machines.

### Cited Findings

- MrApathy (bulge bracket bank), 2021: "First generation was terrible, 8GB RAM made life difficult... Current VDI is actually based on Windows Server 2016, not Windows 10. Performance is respectable, I've got 64 GB RAM and 4 virtual cores, but business users get less powerful desktops... In my firm job title dictates what you get, so as a SWE I get better hardware than people on the business side, including those who may be doing data-heavy work in R/Python." [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- Jane Street, Jacob Baskin, Signals and Threads episode 28, 2026-06-24, on the shared compute grid ("the hive"): "we have hundreds of thousands of CPU cores and over 10,000 GPUs running on the hive." Demand growth comes from "training neural networks and processing the feature data". Allocation: "People bid in dollars per CPU hour or dollars per GPU hour for how much they want to run their code on the system and we run a second price auction." GPUs are "in multiple data centers". [raw text] — [Signals and Threads](https://signalsandthreads.com/building-a-data-warehouse-from-scratch/)
- Ron Minsky, 2026-10-16: "We've recently started doing a lot more GPU programming." [raw text] — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)
- MithrilTuxedo (bank), 2022: "On a brand new developer workstation, the git-prompt invocation in PS1 takes over a second to complete." [raw text] — [HN 30224308](https://news.ycombinator.com/item?id=30224308)

### Inferences

- At the one bank with numbers, the VDI was sized by job title, and memory grew eightfold across generations while core count stayed low (4 virtual cores). That is a desktop sized for an IDE, not for builds.
- Jane Street's GPU access for researchers runs through a priced batch queue. Nothing found says dev machines carry GPUs.

### Gaps

- No dev-box specs for any trading firm or fintech other than Stripe (other notes). No testimony on interactive GPU access for quants. No disk sizes anywhere.

## 4. How many machines, persistent or ephemeral, provisioning time

### Takeaway

Almost nothing. The one bank account describes a single persistent virtual desktop per developer, replaced every couple of years, with forced weekly reboots.

### Cited Findings

- MrApathy: "on a VDI for the past five years, currently on my third desktop"; "due to forced weekend reboots I have to redo my settings every Monday morning"; "Machine loses settings since not everything was set up correctly." [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- Jane Street: agent work is distributed to "your development machine" (singular) and to "a bunch of build boxes". [raw text] — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)
- Unspecified former employer (not stated to be finance), mountainofdeath, 2023-05-16: browsing ran on Citrix servers where "The account you used was ephemeral and wiped after 4 hours of inactivity". Listed as a design example only. [raw text] — [HN 35963066](https://news.ycombinator.com/item?id=35963066)

### Gaps

- No provisioning times, no machine counts, no ephemeral-environment testimony from any finance firm in this pass (Stripe's is in other notes).

## 5. What the dev machine can reach

### Takeaway

Internet through a proxy, with package sites partly blocked, is described at banks and at a hedge fund (3 voices, same as section 2). Hedge funds range from no direct internet to open. Activity on the remote desktop is assumed to be monitored. Copy-paste restrictions were asserted in vendor material in the earlier notes; the one first-person bank account here says copy-paste worked.

### Cited Findings

- Proxy and blocked repositories: badpun, jamaicahest, geofft (section 2). [raw text]
- twic: one hedge fund with "no phones in the office, no direct internet access". [raw text] — [HN 15730859](https://news.ycombinator.com/item?id=15730859)
- Second-hand, not counted: a Blind post is summarised by search as saying a friend at a quant firm codes on a machine with no internet connection and uses a second computer to look things up. [snippet only] — [Blind](https://www.teamblind.com/post/quant-research-remote-7bg20dpg)
- lozenge ("I work at a bank"), 2023-07-22: "I know our security is higher than most, but I'd be shocked if usb drives are allowed in the Google offices." Implies USB storage is blocked at the bank. [raw text] — [HN 36824408](https://news.ycombinator.com/item?id=36824408)
- user5994461: Citrix desktop "worked really really well, including copy/paste." [raw text] — [HN 24049951](https://news.ycombinator.com/item?id=24049951)
- ericmay (ex-JPMorgan): "Using swear words in chat apps like Symphony would get flagged to HR." [raw text] — [HN 35960790](https://news.ycombinator.com/item?id=35960790)
- tyingq (no claimed employer), same thread: JPMorgan monitoring is "extrapolated from some real things, like non-trivial analysis of badge scans, fairly deep tracking of Citrix, Teams, O365 activity". Not first-hand. [raw text] — [HN 35960271](https://news.ycombinator.com/item?id=35960271)
- ayewo (no claimed employer), 2023: "corporate firewalls that block all traffic to openai.com, its subdomains and the IP ranges used by GitHub Copilot." A description of how it could be enforced, not a report. [raw text] — [HN 35197368](https://news.ycombinator.com/item?id=35197368)
- badpun: "Having to deploy the app into dozens of separate unix accounts, because, according to security 'no one account should have access to all this data'". [raw text] — [HN 18462953](https://news.ycombinator.com/item?id=18462953)
- Jane Street, Ron Minsky, 2026: research work means "hitting various kinds of big data systems that you do not have nicely captured and simulated inside of your build process", which is why a network-off sandbox suited engineering but not research. [raw text] — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)

### Inferences

- Jane Street's remark implies development and research machines reach live internal data systems directly. Banks, by badpun's account, split data access across many accounts.

### Gaps

- No first-person testimony on access to production data, market data or logs from a dev machine at a bank. Nothing on Stack Overflow or GitHub being blocked. No named DLP tooling.

## 6. AI coding tools, 2025-2026

### Takeaway

The only detailed account is Jane Street's, from named engineers: its own agent tooling plus Claude Code and Codex, agents running on developers' own machines under a separate "AI user" inside an allow-list sandbox. For banks there is one first-person voice (Copilot with a monthly credit cap, nothing unapproved) and press snippets.

### Cited Findings

**Jane Street (John Crepezzi, Ron Minsky; 2026-10-16) [raw text]** — [Signals and Threads](https://signalsandthreads.com/the-changing-craft-of-programming/)

- Third-party tools are allowed alongside internal ones. Minsky: "we actually use third-party tools. So Claude Code and Codex are things that we use inside of our world." Crepezzi: "we give them access to all the tools. And then we try as hard as we can to make ours as good as it can be."
- Agents run on the developer's machine, not on a separate fleet (quotes in section 1). Minsky qualifies: "maybe not running exactly as you, maybe it's running as your AI user."
- Sandbox: "we quickly moved to an allow-list sandbox... through a combination of tools like bwrap, which is Bubblewrap... We also use tools like Pasta... for network connections. So we can basically say turn off all the ability to connect to other places and only allow these ones."
- Why the sandbox was loosened: "what we saw as a result is a lot of people maybe deciding to turn the sandbox off to be able to do the thing that they're trying to do." Current rule: "if something is allowed by the sandbox, we'll just allow it. And then if something is denied by the sandbox, we'll go ask an LLM classifier whether or not it is safe to execute", which may also "ask the human for confirmation."
- Central control: the firm's chat tool has everyone "go through a central set of credentials that we maintain in our service"; the orchestrator exists "so that we can orchestrate with whatever model we want, with whatever internal tools we want, and keep control of our data."
- Uptake: "something like 45% of the total released features, PRs that get made at the firm start with this flow, this kind of asynchronous flow involving an LLM", started mostly from Slack.
- Third-party sandboxes do not line up: "A lot of the tools have their own sandboxing. And if we want sandboxing that's consistent across all of them, kind of hard to use the sandboxing that they provide".

#### Banks and fintech

- krawat3 (probable EU fintech), 2026-11-09: "5000AI credits ($50) per month on GitHub copilot at work... I cannot use unapproved software on my work machine so I won't use Claude at work". [raw text] — [HN 50422528](https://news.ycombinator.com/item?id=50422528)
- Goldman Sachs: an HN story dated 2026-11-08 is titled "Goldman Sachs is pulling Claude Code from its bankers and traders". I read the comments, not the article. One commenter (123a-ahhg, no claimed employer): "Programmers are still allowed." A search summary of press says Goldman's developers keep a coding assistant. [raw text for the HN title and comment; snippet only for the press] — [HN 50415628](https://news.ycombinator.com/item?id=50415628), [HN 50416265](https://news.ycombinator.com/item?id=50416265)
- Press, snippets only, company-sourced and not testimony: Citi rolling agentic AI out to 40,000 developers; Barclays expecting Claude Code to reach half its developers by end of 2026; JPMorgan tying AI use to engineers' performance reviews. — [American Banker](https://www.americanbanker.com/news/citi-is-rolling-out-agentic-ai-to-its-40-000-developers?linkId=840943262), [The Asian Banker](https://www.theasianbanker.com/updates-and-articles/barclays-expands-anthropic-s-claude-code-to-support-software-development-and-legacy-modernisation), [American Banker](https://www.americanbanker.com/news/pressure-fomo-some-big-banks-are-rolling-ai-out-too-fast)
- Pattern claim, no employer given: siliconc0w, 2026-11-08: "security teams say no, it gets escalated, it's allowed, then 1% of the time the model yeets data where it's not supposed to... it's locked back down." [raw text] — [HN 50416720](https://news.ycombinator.com/item?id=50416720)

### Inferences

- Jane Street's account is the clearest public case of a finance firm running agents on existing developer machines and solving containment in software (separate user, filesystem and network allow-lists, a classifier for exceptions) instead of giving agents their own machines.
- The stated failure of the strict sandbox (people turned it off) is the same dynamic gpm described at a bank with VirtualBox: a control too tight to work under gets bypassed with permission.

### Gaps

- No first-person bank developer saying which agentic tools run inside a VDI or what they can reach (wiki, Jira, internet). No testimony for any other trading firm.

## 7. Contractors and offshore developers

### Takeaway

One first-person account (TCS for Bank of America, 2010) describes a chain of remote hops; one disputed second-hand account says JPMorgan ships managed laptops to outside-firm contractors.

### Cited Findings

- debarshri (TCS, client Bank of America), describing 2010: TCS staff "would connect over teamviewer into a VDI that would have access to the actual server where they would code. It used to be a hub model i.e. the VDI was somewhere is east or west cost and employees were in india, experience was crappy as the customer was getting billed per hour, no one cared." [raw text] — [HN 36824910](https://news.ycombinator.com/item?id=36824910)
- Second-hand and disputed in-thread: indrora, 2023-05-16, says a friend at an outside firm working with JPMorgan received a "JPMC laptop shipped to her via her company's address". Other commenters called parts of the story implausible. [raw text] — [HN 35964352](https://news.ycombinator.com/item?id=35964352)
- Spooky23 (runs VDI, sector not stated), 2016-04-21: "We deploy 2 cpu and 4 GB for office 2016 VDI users. That's tight for a developer. Unless you're offshore and your wasted time is not as valuable, that's a poor VDI use case". [raw text] — [HN 11542268](https://news.ycombinator.com/item?id=11542268)

### Inferences

- debarshri's "billed per hour, no one cared" names an incentive: when the supplier bills time, slow remote desktops cost the client, and nobody on the supplier side is motivated to complain.

### Gaps

- One voice only. Nothing from 2020 onwards, nothing from the offshore developers themselves in volume (that testimony sits on Reddit and Blind).

## 8. Productivity cost, and firms described as good

### Takeaway

The testimony splits on the remote desktop itself (two bank developers call it respectable or very good) and agrees on the lockdown around it (five voices describe time lost to missing admin rights, approvals or slow tools).

### Cited Findings

- Cost: badpun, "over 50% of my work as a developer in bank was about dealing with security". [raw text] — [HN 18462953](https://news.ycombinator.com/item?id=18462953)
- Cost: gpm, laptops locked "to the point of being unusable"; VirtualBox "was also the only way anything got done." [raw text] — [HN 32683476](https://news.ycombinator.com/item?id=32683476)
- Cost: MithrilTuxedo, git prompt "takes over a second"; "like Git Bash has heavy objects strapped to it". [raw text] — [HN 30224308](https://news.ycombinator.com/item?id=30224308)
- Cost: jesus_666, fintech laptops with "so many security suites that Visual Studio takes three minutes to launch." [raw text] — [HN 44498150](https://news.ycombinator.com/item?id=44498150)
- Cost: MrApathy, unusual tools "next to impossible to get... approved (tons of paperwork & reviews)". [raw text] — [HN 27779392](https://news.ycombinator.com/item?id=27779392)
- Favourable: MrApathy, "Performance is respectable"; "Can log in from anywhere. No machine to lug around." [raw text]
- Favourable: user5994461, Citrix "worked really really well". [raw text] — [HN 24049951](https://news.ycombinator.com/item?id=24049951)
- Resignation: krawat3, "A few years ago I would complain, but in this market I won't." [raw text] — [HN 50422457](https://news.ycombinator.com/item?id=50422457)
- Stripe as a good example: nkohari, remote devboxes work "shockingly well for a codebase the size of Stripe's"; hibikir (ex-Stripe) credits "the capabilities of your tooling team". [raw text] — [HN 41291111](https://news.ycombinator.com/item?id=41291111), [HN 41293537](https://news.ycombinator.com/item?id=41293537)
- Jane Street as a good example is self-described here (its own engineers on its own podcast); no outside testimony about its dev machines was found.

### Inferences

- The complaints are about what developers may install and how slow the security stack makes tools, more than about pixels and latency. That differs from the vendor framing in the earlier notes, where latency is "the number one complaint".

### Gaps

- No numbers beyond badpun's "over 50%", which is one person's estimate.

## Best-corroborated claims (two or more independent first-person voices)

| Claim | Voices | Who | Years |
| --- | --- | --- | --- |
| Bank and bank-contractor staff work inside a remote Windows desktop (Citrix or similar); the desk device is a terminal | 7 | MrApathy, user5994461, ericmay, phire0, dhosek, debarshri, jesus_666 | 2010-2025 |
| Bank developers have no local admin rights | 5 (6 with a fintech) | badpun, teh_klev, user5994461, gpm, MrApathy, krawat3 | 2016-2026 |
| Lockdown and security tooling cost real working time | 5 | badpun, gpm, MithrilTuxedo, jesus_666, MrApathy | 2018-2025 |
| Packages and internet go through an internal proxy; outside repositories are blocked or awkward | 3 | jamaicahest (several banks), badpun (bank), geofft (hedge fund) | 2018-2022 |
| The bank remote desktop itself performs acceptably or well | 2 | MrApathy, user5994461 | 2020-2021 |
| Banks kept developers on fixed desktops or a mandated OS to keep code on premises | 2 | Cthulhu_, jrockway | 2013-2020 |
| JPMorgan staff reach work through Citrix or VDI | 2 | ericmay, phire0 | 2023 |
| Jane Street runs coding agents on developers' own machines under an allow-list sandbox, and permits Claude Code and Codex | 2 named speakers, one source | Crepezzi, Minsky | 2026 |
| Stripe keeps code on remote devboxes, off laptops | 2 | nkohari, bhuga | 2024 |
| Admin is granted inside a contained machine when denied on the managed one | 2 | gpm (VirtualBox), teh_klev ("often sandboxed") | 2016-2022 |

Single-voice claims worth carrying with that caveat: hedge-fund security ranges from no internet to "rootapalooza" (twic); VDI of 64 GB and 4 virtual cores for bank SWEs, sized by job title (MrApathy); WSL not approved at a bank three years after asking (MithrilTuxedo); offshore staff reaching a client VDI through TeamViewer (debarshri); admin rights withdrawn as DORA took effect, then coding moved into a VM after acquisition (krawat3).

## Angles for an essay

1. **The remote desktop was not the complaint; the lockdown was.** Two bank developers praise the Citrix desktop itself while five describe time lost to missing admin rights, approvals and slow security tooling. An essay can separate "where the machine is" from "what you may do on it", which vendor material conflates.
2. **Banks moved the Windows desktop to the datacenter; Stripe and Jane Street gave developers a real machine there.** Both are "remote". The bank testimony is uniformly a Windows desktop with an approved-software list; the Stripe and Jane Street accounts are a Linux machine the developer drives from an editor. Same location, opposite experience.
3. **The escape valve has always been a contained machine with root.** gpm's bank let every developer run VirtualBox; teh_klev's banks sandboxed the few admin machines; Jane Street's strict agent sandbox was being switched off until it was loosened. Controls too tight to work under get bypassed with permission, so the design question is where to put the permissive box.
4. **Agents on the developer's own machine, contained in software.** Jane Street's public account (separate AI user, bwrap and pasta allow-lists, a classifier for denied actions, 45% of features started asynchronously) is a counter-example to "agents need their own remote machines", from a firm whose developers already have long-lived dev machines.
5. **Regulation as the stated trigger.** One 2026 voice ties loss of admin rights to DORA and the move into a VM to an acquisition; a bank consultant ties package proxies to regulators' reproducibility demands. Thin, but it is individuals naming the cause, which the earlier pass could not find in the regulatory texts.

## Gaps

- **Reddit, Blind and Glassdoor could not be read.** Reddit is blocked to search and fetch; Blind returns HTTP 402; the Reddit archive API refused. Most testimony of this kind lives there. Blind thread titles surfaced by search ("how to copypaste code from vdi", "Bloomberg laptop", "quant research remote", "first week as swe at fintech") suggest the material exists.
- **Named-firm coverage is very thin.** First-person testimony naming the firm exists only for JPMorgan (2), Bank of America via TCS (1), Jane Street (3 named speakers) and Stripe. Nothing for the other firms on the list. HN full-text search is strict (all terms must match) and people rarely name their bank.
- **Not answered:** whether source code may sit on laptops at any named bank or fund; sudo on bank Linux dev boxes; Docker policy; dev-box specs at trading firms; provisioning times; interactive GPU access for quants; production-data and market-data reach; named DLP tools; which agentic tools run inside bank VDIs.
- **Dates skew old.** Most bank testimony is 2016-2023. Only krawat3 and the Jane Street episodes are from 2026.
- **Selection effects.** HN commenters who mention their bank's desktop are mostly complaining, and the two favourable accounts suggest the unhappy sample overstates the average.
- **Not attempted:** conference talks, GitHub issues with pasted environment details, and the remaining Signals and Threads episodes beyond the eleven downloaded and keyword-searched.
