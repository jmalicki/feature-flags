# Data loss prevention for developers: Linux dev servers reached by ssh

Scope: extends `security_tooling_beyondcorp.md` (Part 3) and `laptop_as_security_risk.md`; does not repeat BeyondCorp, Chrome data controls, Ding/Levandowski/Zhang, "bytes at rest, not bytes in view", Meta fwdproxy, TLS-proxy breakage of dev tools, or the Slack/Dropbox/Cloudflare/Microsoft token thefts. Windows/VDI excluded (one-line contrast only). PCI excluded. Date of research: 2026-11-27.

Read tags: **raw** = raw text read; **extracted** = fetched via extraction (a small model summarised the page, so quotes are as the extractor returned them); **snippet** = search-result snippet only. Source types: official / named individual / anonymous commenter / vendor / court filing. Voice counts are independent commenters I found in this pass only.

Method note: roughly 50 searches and fetches. The two court complaints (Intel v. Luo; X.AI v. OpenAI) were downloaded as PDFs and read as raw text with pdftotext. Most other items are extraction or snippet; each is tagged.

---

## Q1. Channels out of a Linux dev server and what closes each

### Takeaway

Every channel has a published control, but most controls are one of three kinds: a network allowlist (closes HTTP(S), DNS-to-resolver, git remotes, package publish, cloud CLI, paste and AI sites in one place), sshd options (close forwards, tunnels, sftp), or logging (all the rest). Two public facts matter most. First, OpenSSH's own manual says forwarding restrictions do not help while the user has a shell. Second, I found no public source saying any named company ships a terminal that blocks `cat`, OSC 52 or scrollback; the screen channel is only closed by Google's browser-hosted Cloud Workstations (vendor claim), not by ssh.

### Cited Findings

#### Outbound network (HTTP(S), DNS, raw sockets)

- Stripe's Smokescreen README: "a HTTP CONNECT proxy" restricting destinations by hostname allow-list and requiring publicly routable resolved IPs; per-client ACLs with modes `Open`, `Report`, `Enforce`; "proxies most traffic from Stripe to the external world (e.g., webhooks)"; "Stripe uses v2 internally." Limitation stated by the README: ACLs check hostnames as written, and "A denied host's IP can still be reached directly, so the docs recommend allow lists". Official (company open-source repo), undated README, extracted. <https://raw.githubusercontent.com/stripe/smokescreen/master/README.md> . Note: this is evidence of Stripe running an egress proxy for production services; it does not say devboxes use it (the Stripe devbox talk, below, is silent on network).
- Claude Code sandbox docs (official, Anthropic, accessed 2026-11-27, extracted): on Linux "the command runs in a separate network namespace that has no connection to your network"; a proxy outside the sandbox "checks the hostname of each connection against your allowed and denied domains"; "The built-in proxy enforces the allowlist based on the requested hostname and, by default, does not terminate or inspect TLS traffic"; "UDP, HTTP/3 over QUIC, and ICMP tools such as `ping` can't leave the sandbox"; tools that ignore proxy variables "can't connect at all". The extracted text did not cover domain fronting or DNS tunnelling (the page's security-limitations section was cut off). <https://code.claude.com/docs/en/sandboxing>
- DNS as a covert channel through a hostname allowlist: DZone article describes an injected agent requesting a subdomain on an attacker domain that embeds a key, so "the lookup alone" leaks it; Mindgard disclosed the same class in Cline (ping needing no approval). Vendor/blog, snippet only. <https://dzone.com/articles/ways-your-ai-coding-agent-exfiltrates-secrets> ; <https://mindgard.ai/disclosures/cline-bot-ai-coding-agent-data-exfiltration-via-prompt-injection-and-dns> . A Cloud Security Alliance research note (Aug 2026, snippet only) describes a pre-approved Hugging Face domain used to carry a key out one character at a time via a download counter. <https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/08/CSA_research_note_ai_coding_agent_ci_prompt_injection_20260807-csa-styled.pdf> . Simon Willison's blog (named individual, snippet) reports a Claude Cowork default allowlist that included Anthropic's own API domain, abused by uploading files with an attacker's key. <https://simonwillison.net/tags/exfiltration-attacks> . So: an allowlist is only as tight as its least-trusted allowed host (3 independent sources on allowlisted-host abuse).
- Zscaler workload egress (vendor, snippet): server egress can be steered to its exchange by IPsec, GRE or Cloud Connectors; help-center advice is one DLP rule that blocks outbound source code plus one that allows it to an authorised URL category. Capability, not evidence a named company does it for dev servers. <https://help.zscaler.com/unified/configuring-dlp-policy-rules-content-inspection>

#### git push to external remotes

- GitHub docs (official, extracted): with Enterprise Managed Users a corporate proxy can inject `sec-GitHub-allowed-enterprise: ENTERPRISE-ID` into traffic to `github.com/*`, `api.github.com/*`, `*.githubcopilot.com`, so users cannot authenticate with accounts outside the enterprise. Stated holes: "You cannot use the enterprise header to restrict Git activity over SSH" (block port 22 and `ssh.github.com` instead); anonymous public reads are not blocked; installation tokens only have writes blocked; "This feature requires an external firewall or proxy," and GitHub Support cannot help set it up. <https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-access-to-githubcom-using-a-corporate-proxy> . This is the only published "repo-origin" control I found that is enforced off-host.
- Local `pre-push` hook receives remote name and URL and can abort (git docs, snippet). It lives in `.git/hooks`, so the user can skip or edit it. A server-side pre-receive hook only helps where you run the server. I found no public account of a company relying on pre-push allowlists for DLP (gap).
- Code42 Incydr (vendor): monitors git push/pull to detect corporate-repo code going to personal repos, claimed for "Windows, Mac, Linux and VDI". Capability only. <https://www.helpnetsecurity.com/2022/09/22/code42-incydr-updates/> (snippet)

**ssh server options (forwards, tunnels, sftp, ForceCommand)** (official OpenBSD sshd_config man page, extracted, <https://man.openbsd.org/sshd_config>)

- `AllowTcpForwarding`: "Note that disabling TCP forwarding does not improve security unless users are also denied shell access". Same caveat for `AllowStreamLocalForwarding`.
- `PermitTunnel` default `no`; `GatewayPorts` default binds remote forwards to loopback.
- `ForceCommand`: "This directive does not limit other kinds of access that a client may request via their connection".
- `DisableForwarding`: "Disables all forwarding features, including X11, ssh-agent(1), TCP and StreamLocal" and "overrides all other forwarding-related options". `PermitOpen none` prohibits all forwarding requests.
- `Subsystem sftp`: sftp is a subsystem you can omit or replace; it does not stop `cat` or `scp` over a shell.
- Consequence: forwards and sftp can be closed for a user who gets only a restricted command; an ordinary developer with a shell can always stream bytes back over the ssh channel itself (this is the terminal channel, not a forward).
- Editor remoting: VS Code Remote-SSH docs (official, extracted) say the extension uses an SSH tunnel with temporary and permanent forwards, and that the page "doesn't describe any administrator policy or control for disabling SSH remote features." VS Code enterprise policies on Linux are via `/etc/vscode/policy.json` from version 1.106 (snippet) but I found no policy that blocks Remote-SSH downloads. Dev Tunnels group policy exists but covers Tunnels, not Remote-SSH, and Windows only (snippet). <https://code.visualstudio.com/docs/remote/ssh> ; <https://learn.microsoft.com/azure/developer/dev-tunnels/policies> . The editor on the laptop receives file contents by design; the only lever is sshd (and the laptop's own policy).

#### Bastion session recording, eBPF, auditd

- Teleport docs (vendor, snippet): standard recording captures "the entire stream of bytes from the PTY", independent of host self-reporting; the base64-piped `curl` example shows a command that never appears in the byte stream, which is why Enhanced Session Recording with eBPF exists (`session.command` events; amd64/arm64; needs kernel support). Teleport's own blog concedes root can disable eBPF recording and that it is "not a substitute for a Linux Security Module". Teleport can forward to auditd. <https://goteleport.com/docs/enroll-resources/server-access/guides/bpf-session-recording/> ; <https://goteleport.com/blog/enhanced-session-recording/> . Product capability; no named customer in my results.
- Doyensec, "On Bypassing eBPF Security Monitoring" (vendor/consultancy blog, 2022-10-11, snippet): eBPF monitors can be bypassed. <https://blog.doyensec.com/2022/10/11/ebpf-bypass-security-monitoring.html>
- Falco vs Tetragon: a training module says Falco alerts after the syscall while Tetragon can also block (third-party, snippet); Splunk's Tetragon work is a simulation, not an incident. No published case of either catching exfiltration from a dev server (gap).

#### clipboard over terminal (OSC 52), tmux/screen scrollback

- Several project docs (snippet): reading the clipboard via OSC 52 is the sensitive direction and is deny-by-default in some tools; Alacritty supports set but not read; any program that can print to the terminal can attempt a write; tmux `set-clipboard on/external` controls pass-through. <https://github.com/tmux/tmux/wiki/Clipboard> . This is an inbound-to-laptop hazard (malicious server output overwriting the laptop clipboard), not a bulk exfiltration route. I found no source treating OSC 52 or scrollback as a DLP channel (gap). The channel that matters is plain: text on screen and in the local terminal's scrollback, which is "bytes in view".

#### Cloud CLI uploads, paste sites, AI chat sites, email

- All are HTTPS to a named host; the only published closer is an allowlist or SWG category (Zscaler snippet above). No company-specific account found. The xAI complaint (Q4) shows the live pattern: code to a "personal cloud account".

#### Screen

- Google Cloud Workstations product page (vendor/official product page, snippet): "prevention of code exfiltration on download, copy, paste, print, and more" and an option to enforce "no source code on local devices". This is browser-hosted, not ssh. <https://cloud.google.com/workstations> . Verily's perimeter docs (snippet) note that data can still move from in-perimeter cloud app to the local machine, so a perimeter alone does not close download. <https://support.workbench.verily.com/docs/guides/governance/perimeter_policy/>

### Inferences

- A dev server with allowlisted egress and `DisableForwarding` closes the machine-to-internet channels; what remains is the human path: terminal output and editor file sync to the laptop.
- The laptop therefore still matters for the "bytes in view" channel, but it receives only what the user opens; a bulk `rsync` to the laptop is a logged ssh data flow that can be rate-flagged.

### Gaps

- No public company statement of using pre-push remote allowlists, signed-commit or repo-origin policy as DLP.
- No public control for VS Code Remote file download; no source on tmux/screen scrollback as a leak.
- Cloud Workstations copy/paste blocking: not tied in what I read to VPC-SC vs a separate setting.

---

## Q2. DLP products and techniques as developers experience them

### Takeaway

Endpoint DLP agents are mostly Windows and macOS products; Netskope and Microsoft Purview publicly list endpoint DLP on Windows and macOS only. Linux coverage exists in a few vendor products (Cyberhaven, Code42 Incydr, claims only). Network DLP (Zscaler, Netskope) works for Linux servers only by steering egress through it. Developer testimony is consistently negative on speed and breakage, with few reported false positives.

### Cited Findings

- Netskope docs (vendor, snippet): "Endpoint DLP is supported on devices running Windows 11"; macOS 14, 15, 26; the Linux client service list shows Internet Security and SD-WAN only; Linux client is for desktop distros (Ubuntu 22.04/24.04, Mint, RHEL 9.x). <https://docs.netskope.com/en/netskope-client-supported-os-and-platform> . Whether Linux servers are supported was not stated.
- Microsoft Purview Endpoint DLP (vendor): FAQ lists Windows 10 1809+ and macOS; says Linux "being evaluated" (undated post). A competitor (Netwrix, vendor, hostile) quotes a Feb 2025 Microsoft Q&A saying Linux is unsupported. <https://techcommunity.microsoft.com/blog/microsoft-security-blog/common-questions-on-microsoft-purview-data-loss-prevention-for-endpoints/3732610> (snippet). Treat as likely, not confirmed from a current Microsoft page.
- Cyberhaven (vendor, snippet): "We support Windows, macOS, and Linux"; lineage built from endpoint telemetry, browser plugins and APIs; 2026 products target agentic coding tools. <https://www.cyberhaven.com/how-it-works/> . No named customer running it on dev servers.
- Code42 Incydr (vendor, snippet): git push detection "available for Windows, Mac, Linux and VDI"; now sold under Mimecast. <https://university.code42.com/use-cases/source-code-leaks/>
- Zscaler (vendor, snippet): source code DLP dictionaries; a 2020 guide notes `#`, `!`, `$` cannot be base tokens, making Perl detection awkward. <https://www.scribd.com/document/688549642/Source-Code-DLP> (Scribd copy, likely dated).
- Honeytokens: GitGuardian (vendor) reports the repo and file where a planted token is found and alerts when triggered; Thinkst canarytokens (vendor/open source) mint AWS-key canaries; a conference deck lists "code and CI environments" as placement. <https://blog.gitguardian.com/gitguardian-honeytoken/> ; <https://conf42.github.io/static/slides/Dwayne%20McDaniel%20-%20Conf42%20DevSecOps%202023.pdf> (snippets). Grafana Labs published an account of using canary tokens internally (company engineering blog, 2025-08-25, snippet): <https://grafana.com/blog/2025/08/25/canary-tokens-learn-all-about-the-unsung-heroes-of-security-at-grafana-labs> . I found no public case where a honeytoken in a repo caught an insider; they detect use of a leaked credential, which is after the copy.
- Fingerprinting/watermarking of source: no public named-company use found (gap). Gravitee (vendor) lists fingerprinting of "source-code fragments" among LLM-DLP features.

#### Developer testimony (HN comments via Algolia, tag=comment; all anonymous, read via extraction)

- Slowness and breakage of security stacks (endpoint agents, DLP): mberning 2022-08-22 (id 32550041, workstation "barely functions", Homebrew install flagged for justification); GordonS 2020-09-26 (24599296, AV+endpoint+DLP "combined use half of your CPU"); marcusb 2025-05-16 (44006260, seven endpoint tools incl. DLP on one customer); happymellon 2023-02-21 (34879133, "SentinalOne, Netskope, Qualys all installed and all 'realtime scanning'. And it's slow."); kodah 2022-04-08 (30959926, Netskope "take over your root trust chain"). 5 independent voices on cost/invasiveness.
- Efficacy limits: parliament32 2025-12-11 (46234801) "Endpoint DLP helps but it's not even close to bulletproof" and reports protected test strings sent from VS Code's integrated browser without triggering DLP; jessaustin 2013-09-20 (6418345) has not seen endpoint DLP "be of particular value"; sekinfo 2026-10-13 (50080013) says inspection with a corporate MITM key is risky. 3 voices.
- Zscaler breaking git and package tools (already in prior notes as four voices): throwawaaarrgh 2021-05-28 (27318772), llm_trw 2024-08-01 (41130193, "git, apt, pip, cabal and ctan all had different ideas", built from source over a week as workaround), TeMPOraL 2024-07-21 (41028557, "git operations take 20x as long"), brewmarche 2023-10-05 (37777837). Not repeated further.
- The prior note's absence of reported false positives holds: across the endpoint-DLP search I found no comment reporting a specific DLP false positive on source code. Workarounds reported are non-DLP-specific (build from source, WSL1 per brewmarche 2025-05-19, 44033599).

### Inferences

- The tools with a Linux story are the network ones, applied by routing. Endpoint DLP on Linux servers is, in public documentation, mostly vendor claim.
- A remote dev server lets an organisation skip the endpoint agent on the machine holding the code and rely on network egress plus audit, avoiding the slowness testimony above.

### Gaps

- No independent measurement of Linux DLP agent overhead. No named company using Cyberhaven/Incydr on Linux dev servers. No false-positive testimony.

---

## Q3. Secrets and PII scanning in the development path

### Takeaway

Push-time blocking exists and has published rates. GitHub says push protection stops about 30% of newly detected secrets before they enter history, so 70% are found after exposure; developer override of blocks fell from 6.63% to 3.93% over two years. Independent tests show scanners are noisy.

### Cited Findings

- GitHub blog, "Secret protection must scale with software", 2026-10-07 (official, extracted): public pushes ~202M (Q2 2024) to 574M (Q2 2026); 0.47% of public pushes carried secrets in Q2 2026; "A secret was blocked by push protection at least once every second" in the past month; "push protection stops about 30% of newly detected secrets before they enter history. The remaining 70% are found after the credential is already exposed"; share of push-path blocks overridden by developers "fell linearly from 6.63% to 3.93%"; mean time to manually revoke ~40 days, about one in five over 90 days; no false-positive rate given. <https://github.blog/news-insights/product-news/secret-protection-must-scale-with-software/>
- GitGuardian State of Secrets Sprawl 2026 (vendor report, 2025 data, extracted): 28.65 million new hardcoded secrets in public GitHub commits in 2025, +34%; validity still above 64% when the 2022 data was retested in January 2026 (about 70% in the 2025 report); internal repos "roughly 6x more likely" than public to hold secrets; "About 28% of incidents originate entirely outside repositories" (Slack, Jira, Confluence) and are 13 points more likely critical; Claude Code-assisted commits showed a 3.2% leak rate vs 1.5% baseline. <https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/>
- Basak et al., arXiv 2307.00714 (academic, July 2023, snippet): on SecretBench, GitHub's scanner precision 75%, Gitleaks 46%, a commercial tool 25%; recall Gitleaks 88%, SpectralOps 67%, TruffleHog 52%. Other papers report different numbers (IssueGuard: TruffleHog 55.39% precision, 93.94% recall; Gitleaks 49.10% / 90.20%; AssetHarvester: baseline tools under 50% precision and 41% recall; a 2026 paper finds between-tool differences not significant). <https://arxiv.org/abs/2307.00714>
- Scanning logs, tickets, wikis for PII: I found no published effectiveness number. GitGuardian's 28% outside-repos figure is the only quantitative evidence that those channels matter.

### Inferences

- Push protection is a speed bump with a bypass, not a gate: tens of thousands of overrides at GitHub scale are visible only to admins.
- Secrets leaving as text in a terminal never touch a push hook; they need egress control and short-lived credentials.

### Gaps

- No independent bypass rates. No data on PII scanning in tickets/chat. detect-secrets effectiveness not found.

---

## Q4. Detection after the fact: what was caught, and how

### Takeaway

Across these cases prevention missed or only partly fired, and detection came from logs, a tip, or forensic review of a device, usually after resignation. The cleanest new example: Intel's DLP blocked a USB hard drive and did not block a NAS device.

### Cited Findings (court filings read as raw text are first)

- **Intel v. Luo**, W.D. Wash. No. 2:25-cv-02159-KKE, filed 2025-10-31 (court filing, raw): terminated effective July 31, 2025. "On July 23, 2025 Luo connected an external hard drive to his Intel laptop. Luo attempted to download a file onto that hard drive but was blocked by Intel's Data Loss Prevention controls." "On July 28, 2025, Luo connected a NAS device to his Intel laptop. Between July 28, 2025 and July 31 2025, Luo downloaded and transferred nearly 18,000 files". "Luo's data transfers were detected by Intel and triggered an investigation." Defendant did not respond to contact or return the NAS. <https://storage.courtlistener.com/recap/gov.uscourts.wawd.354479/gov.uscourts.wawd.354479.1.0.pdf> . (Allegations; pleading does not say why the NAS was not blocked.)
- **X.AI v. OpenAI**, N.D. Cal. No. 3:25-cv-08133, filed 2025-09-24 (court filing, raw): alleges Li "uploaded the entire xAI source code base to a personal cloud account" on July 25 and "deleted his browser history and system logs to hide evidence"; that Fraiture copied source code to a personal device with AirDrop, and "xAI's records show that he used the AirDrop feature to transfer, or attempt to transfer, xAI Confidential Information at least five times on July 31"; Li confessed "after being confronted with xAI's logs". The complaint does not say how xAI first noticed. <https://storage.courtlistener.com/recap/gov.uscourts.cand.456862/gov.uscourts.cand.456862.1.0.pdf> . Separate suit against Li alone: N.D. Cal. 3:25-cv-07292, filed 2025-08-28 (reported, snippet only). Note: both are allegations; no ruling found (one law-firm summary, snippet, says the court found some allegations against other employees insufficient).
- **Apple v. Liu** (Santa Clara Superior Court, filed 2025-06-24; NBC, snippet): alleges he used company credentials three days before leaving to download thousands of documents and upload to personal cloud storage, before joining Snap. <https://www.nbcnews.com/business/business-news/apple-sues-former-vision-employee-allegedly-stealing-thousands-documen-rcna216316> . "Apple v. Chen" and "Lancaster": Lancaster was a press-leak case settled in 2022 (snippet); I could not confirm a "Chen" matter, no AirDrop claim there.
- **Apple v. OpenAI** (N.D. Cal., about 2026-07-10; TechCrunch 2026-07-13, extracted): alleges a former employee kept an Apple laptop and exploited "a rare, previously unknown authentication bug" to reach network storage after leaving; Apple cited "a check of its server logs" to show only he used the bug; the article does not say who or what detected it. <https://techcrunch.com/2026/07/13/apple-says-former-employee-exploited-rare-bug-to-download-confidential-files-after-leaving-for-openai>
- **X Corp. v. Yao Yue** (N.D. Cal., Dec 2025; Expert Institute/Law360 summary, snippet): a former supervisor raised concerns in October 2024, forensic review of account activity followed and identified a large source-code download. Detection by a human tip then forensics. (The Expert Institute page returned 403; relies on the search summary.)
- **Tesla v. Khatilov**, N.D. Cal. 4:21-cv-00528, Jan 2021 (reported, snippet): Tesla says its security team detected downloads to a personal Dropbox on January 6, about nine days after his December 28 start; counts differ (6,000+ scripts vs 26,000 files). He says it was a mistake. <https://www.cnbc.com/2021/01/22/tesla-sues-former-employee-for-allegedly-stealing-software-code.html> . **Tesla v. Tripp** (D. Nev., June 2018, snippet): Tesla alleged code that exported data off its network; Tripp calls himself a whistleblower; no outcome found.
- **Twitter source code leak**, March 2023 (CNBC, extracted): Twitter sought a subpoena to unmask GitHub user "FreeSpeechEnthusiast"; article does not say how it was discovered; NYT-reported internal view that the people had left in 2022 (snippet). Detection route: public post and DMCA, not internal monitoring. <https://www.cnbc.com/2023/03/26/twitter-source-code-leaked-online-court-filings-show-.html>
- **Samsung**, May 2023 (Register, extracted; Bloomberg, snippet): memo says an engineer pasted code into ChatGPT; ban with threat of termination. The "4%" figure often attached to this story did not appear on the Register page; the 4.2% figure is Cyberhaven's customer data (vendor), not Samsung's. <https://www.theregister.com/2023/05/02/samsung_generative_ai_ban/>
- **Yandex**, Jan 2023 (snippet): ~45 GB posted on a hacking forum; Yandex said its security service found fragments from an internal repository and blamed a former employee. Detection came from the public posting. <https://www.bleepingcomputer.com/news/security/yandex-denies-hack-blames-source-code-leak-on-former-employee/>
- **New York Times**, 2024 (snippet): ~270 GB posted on 4chan; the leaker said an exposed GitHub token was used; NYT said theft occurred in January 2024 and cited "continuous monitoring for anomalous activity". Five months between theft and publication. <https://www.theregister.com/2024/06/07/4chan_nyt_code/>
- **Meta** (TheNextWeb, extracted; Malwarebytes snippet), April 2026: an employee allegedly wrote a script to download private photos while evading internal checks; the article does not say how it was found; employee dismissed and referred to law enforcement. Meta's 2022 contractor case: internal probe, no detail on mechanism. <https://thenextweb.com/news/meta-engineer-facebook-private-photos-investigation>
- **Bulk-clone detection exists as published rules**: GitHub audit log records `git.clone` events (clone, fetch, pull), retained for seven days unless streamed; Elastic prebuilt rule "GitHub Exfiltration via High Number of Repository Clones by User"; Datadog rule for clones via personal access tokens. Official/vendor, snippet. <https://www.elastic.co/guide/en/security/current/prebuilt-rule-8-19-13-github-exfiltration-via-high-number-of-repository-clones-by-user.html> . No company-specific account of one catching an insider found.
- Meta job postings (official recruiting pages, snippet) describe an "Insider Trust" detection team building "behavior-based detections and anomaly detection". Capability evidence only. <https://metacareers.com/jobs/902172901895274>
- GitLab handbook (official, snippet): SentinelOne EDR on laptops; monitoring is "not a 'big brother' monitoring approach, it's for having as much forensic breadcrumb trail data as possible". <https://handbook.gitlab.com/handbook/security/corporate/end-user-services/laptop-management/laptop-security/management>

**Anonymous testimony on detection vs prevention (HN, extracted):** Consultant32452 2019-06-13 (20171111): "I've never worked at a place where I couldn't trivially exfiltrate real user data and source code without being traced"; jeffbee 2024-03-07 (39629674): "The opsec of the people who eventually get indicted is always terrible"; nexuist 2021-12-16 (29573538): devs unlikely allowed to take work MacBooks with iOS source home; emilburzo 2026-06-04 (48394914): in a sandboxed VM "there's (by design) nothing to exfiltrate besides the source code itself." 4 voices, mixed.

### Inferences

- The recurring shape: copy to personal storage near departure; detection via logs plus a human trigger; the company then sues to get the device. A remote server turns "personal cloud account" into a network-egress question and removes AirDrop, USB and NAS as routes.
- The Intel NAS case is direct evidence that device-class blocking leaks to the next device class.

### Gaps

- Complaints rarely say how detection began. Khatilov complaint text not read directly (Scribd/news only). Intel 2025 case is Luo (not Gupta; Gupta was a 2020 Intel/Microsoft matter, not used). No Tesla complaint text. Cases "through November 2026" beyond those above not found.

---

## Q5. First-person accounts of how leading companies approach developer DLP

### Takeaway

Public first-person material is thin. The clearest stances: Google's book says insider risk is "unavoidable" and prescribes least privilege plus audit; Netflix's engineers describe auditing after the fact and "context, not control"; Meta, Microsoft, Amazon, Dropbox, Stripe, Block, Coinbase, trading firms gave no public first-person DLP statement that I found.

### Cited Findings

- **Google** (official, Building Secure and Reliable Systems, ch. 2, extracted): "Because of the dynamics of employment relationships, this risk is unavoidable."; mitigation = least privilege "both in terms of scope and duration of access" and "Reviewing all access logs and justifications to make sure they're appropriate". <https://google.github.io/building-secure-and-reliable-systems/raw/ch02.html> . Chapter 5 covers least privilege (snippet).
- **Google Cloud Workstations** (official product page, snippet): "no source code on local devices" option. Product, not an internal-use statement.
- **Netflix**: Bryan Payne (named individual, Medium; Netflix product security) frames security as supplying "the context (i.e., relevant information)" so teams decide; "Over time, people stop wanting to talk to these security teams, find ways to creatively avoid them" (search summary quoting the post; Medium returned 403 to fetch, so snippet only). <https://medium.com/@bdpsecurity/netflix-culture-meets-product-security-599ceecd615d> . Russell Lewis, Netflix Platform Security (O'Reilly talk, 2016-07-19; the profile page lists the title only, the "audit and alert after the fact" wording came from the search summary, snippet): bastion design to "audit and automatically alert after the fact rather than slowing down engineers before granting access". <https://oreilly.com/people/russell-lewis> . Jesse Kriss on Stethoscope (named individual, snippet): no invisible software with admin rights pushing central policy. <https://duo.com/decipher/inside-the-development-of-netflix-stethoscope> . Netflix has no stated DLP product for developers in anything I found; the "detection focus" for exfiltration is inferred from these.
- **Stripe**: Smokescreen runs "most traffic from Stripe to the external world" (official, extracted); Soam Vasani, Stripe, QCon Plus 2022-09-30 (named individual, extracted): devboxes "are all isolated from each other", authoritative code copy lives on the devbox; network isolation and internet access "not discussed". <https://www.infoq.com/presentations/stripe-dev-env-infrastructure>
- **GitLab** (official handbook, snippet): EDR plus forensic breadcrumbs (see Q4); no source-code DLP statement; product vision page defines endpoint DLP only as a category.
- **Dropbox** (snippet): searches returned a 2019 threat-detection post and the "security at scale" post but no insider or source-code content. **Block**: Data Safety Levels framework (classification, not exfiltration). **Coinbase**: only job postings for DLP engineers. **Microsoft, Amazon, Apple (as employer), trading firms**: nothing found.
- **Prevention is impractical; detection plus least privilege**: Google's "unavoidable"; Netflix audit-after-the-fact; Consultant32452 (HN) trivial to exfiltrate untraced; jeffbee (HN) indicted people have poor opsec (detection works on the careless). 2 official-ish first-person sources, 2 anonymous commenters. No named executive explicitly says "prevention on developer machines is impractical".

### Inferences

- The honest public position among organisations that speak is "bound the access, log everything, expect to detect rather than stop".

### Gaps

- Meta, Microsoft, Amazon, Dropbox, Slack, Block, Coinbase, Apple, trading firms: no first-person DLP account found. Netflix text mostly via snippets.

---

## Q6. AI-era DLP

### Takeaway

Published incidents are few and mostly prompt injection or pasting. Controls named by vendors are gateways and allowlists; the only independent evidence is that allowlists get abused through allowed hosts. Moving the agent onto the server puts agent traffic behind the same egress proxy as everything else.

### Cited Findings

- Claude Code docs (official, extracted): sandbox with filesystem and network isolation; proxy domain allowlist; managed settings to enforce standards; OpenTelemetry usage monitoring; in Anthropic-hosted cloud sessions GitHub credentials "never enter the session VM", traffic goes "through an Anthropic proxy that attaches the GitHub credential on the server side", network access "limited by default", all operations audit-logged; self-hosted environments leave "isolation, network egress, and git credentials" to the deployment. "no system is completely immune". <https://code.claude.com/docs/en/security> ; <https://code.claude.com/docs/en/sandboxing>
- Samsung (above): ban plus threat of termination; reported as building in-house tools.
- Cyberhaven (vendor, snippet): 4.2% of 1.6 million workers at its client companies were blocked from putting data into ChatGPT (2023); source code 18.7% of sensitive data going to AI in one summary, 12.7% in a 2024 report; sources disagree. <https://cyberhaven.com/blog/4-2-of-workers-have-pasted-company-data-into-chatgpt>
- Cloudflare AI Gateway DLP docs (vendor, snippet): scans prompts and responses; buffers streamed responses before inspection; no per-request bypass. Gravitee (vendor) notes gateway DLP "cannot govern traffic that bypasses the gateway." No independent enterprise case study found. <https://developers.cloudflare.com/ai-gateway/features/dlp>
- GitGuardian: Claude Code-assisted commits 3.2% leak rate vs 1.5% baseline (vendor report, extracted).
- Incidents: CVE-2025-55284 Claude Code DNS-based key exfiltration, patched June 2025 (snippet, CVE number not verified); Cline DNS exfil (Mindgard); allowlist abuse (CSA, Willison). 3 independent disclosures of agent exfiltration through DNS or allowed hosts.
- xAI alleges the stolen code went to a personal cloud account "connected to ChatGPT" (law-firm summary, snippet; not in the complaint text I read, which says only "personal cloud account"). Do not cite as an AI-tool leak without checking.
- Zero-retention enterprise endpoints: I did not fetch a vendor ZDR doc; the Register notes OpenAI's API retained data for abuse monitoring up to 30 days as of 2023 (extracted).

### Inferences

- A model API is itself an egress destination; an allowlist that permits it permits uploads of anything the agent can read. Zero retention reduces provider-side exposure, not egress.

### Gaps

- No ZDR contract terms read; no public enterprise LLM gateway deployment with outcomes; no published incident of source code leaking via an agent on a server.

---

## Q7. Minimum set for one engineer on a small fleet of Linux dev servers

### Takeaway

Ranked by coverage per effort, using only items with public documentation: (1) default-deny egress with an allowlist proxy; (2) sshd `DisableForwarding`, no sftp for developer users where editor remoting allows, per-user keys or certificates; (3) git host restricted to the company enterprise plus push protection; (4) stream git audit logs and ssh/auditd logs off-host, with a bulk-clone alert; (5) short-lived credentials and canary tokens. Nothing here closes terminal/editor file reads.

### Cited Findings

- Allowlist proxy: Smokescreen (open source, Stripe) or the sandbox proxy pattern; GitHub EMU header on the proxy; block port 22 to github.com (all GitHub docs, extracted).
- sshd: `DisableForwarding`, `PermitOpen none`, `PermitTunnel no` (man page, extracted); caveat that this does not help against shell users, which is why egress is first.
- Logs: GitHub audit streaming plus Elastic or Datadog clone rules (snippet); Teleport or auditd for session capture (vendor, snippet; eBPF recording can be disabled by root).
- Secrets: push protection (GitHub; ~30% stopped before history, extracted); honeytokens (Thinkst/GitGuardian, vendor).
- Skip: endpoint DLP agents on the server (no Linux server story documented for Netskope or Purview; developer testimony of slowness, Q2).

### Inferences

- The one-engineer plan gets the machine-to-internet channels closed and everything else logged; the remaining risk is a human reading or syncing files, which court cases show is caught afterwards.

### Gaps

- No public sizing or time estimate for this stack; effort estimates in the table are mine.

---

## Summary table: exit channels from a Linux dev server

| Channel | Control | Who documents it | What still leaks | Effort |
| --- | --- | --- | --- | --- |
| HTTP(S) out | Default-deny egress plus hostname allowlist proxy | Stripe Smokescreen (official); Claude Code sandbox (official); Zscaler (vendor) | Allowed hosts (GitHub, model APIs, Hugging Face) as carriers; IP-direct if not blocked | Medium |
| DNS | Resolver-only egress, log or filter queries | Dzone, Mindgard, CSA (blogs/vendor) on the attack | Subdomain-encoded data to attacker nameserver | Low to medium |
| Raw sockets, UDP | Network namespace or firewall deny | Claude Code docs (official) | Nothing if firewall is default-deny | Low |
| git push external | GitHub EMU header via proxy; block port 22; push protection | GitHub docs (official) | SSH git unless port blocked; anonymous reads; installation token reads | Medium |
| Package publish | Egress allowlist (registries excluded) | No dedicated source found | Publish via allowed internal registry | Low |
| scp/sftp/rsync to laptop | sshd subsystem removal; log flows | OpenBSD man page (official) | `cat` over the shell; editor sync | Low |
| ssh forwards, tunnels | `DisableForwarding`, `PermitOpen none`, `PermitTunnel no` | OpenBSD man page (official) | Man page: no gain while users have a shell | Low |
| VS Code Remote download | Only sshd and laptop policy | VS Code docs (official): no admin control | File contents to laptop by design | n/a |
| OSC 52 / scrollback | Terminal settings (read deny) | tmux wiki, project docs (snippet) | Anything displayed | n/a |
| Cloud CLI, paste, AI sites, email | Same egress allowlist | Zscaler (vendor) | Allowed AI endpoints | Included in egress |
| Screen | Browser-hosted workstation controls | Google Cloud Workstations (vendor/official product page) | Photographs; not an ssh feature | High, product change |
| Everything above, after the fact | Off-host logs, bulk-clone rule, session recording | GitHub, Elastic, Teleport (official/vendor) | Root can disable local logging; logs help only if reviewed | Medium |

## Prevent vs detect

- **Prevent (if default-deny is real):** egress allowlist and DNS control; network namespaces; sshd forwarding and tunnel options (only with restricted shells); GitHub enterprise header on the proxy plus block of port 22; push protection (partly, with bypass); short-lived credentials.
- **Detect only:** ssh/PTY recording and auditd/eBPF logging; GitHub `git.clone` bulk rules; honeytokens (fire on use); EDR/forensic logging (GitLab); insider-trust anomaly teams (Meta postings); endpoint DLP alerts on Linux where they exist (vendor claims).
- **Both, depending on config:** proxy DLP (Zscaler/Netskope) can block or log; Tetragon blocks, Falco alerts (third-party tutorial).

## Angles for an essay

1. **The USB that was blocked and the NAS that was not.** Intel's own complaint says DLP blocked an external hard drive on July 23 and 18,000 files went to a NAS five days later. Device-by-device blocking on a laptop is a list of things the vendor thought of. One default-deny egress rule on a server is a list of things you allow.
2. **Two controls, one admission.** OpenSSH's manual says closing forwarding "does not improve security unless users are also denied shell access"; Google's book says insider risk is "unavoidable". Honest remote-dev security is egress control plus logs plus least privilege, not a sealed terminal.
3. **The cases are all detection stories.** xAI, Apple, Tesla, Intel, X: logs and forensics found it afterwards, often via a tip. Putting code and logs on a server the company controls makes the evidence complete and the personal-cloud route a network question. Pair with the xAI line that Li deleted "system logs" on his own laptop.
4. **AI agents make egress policy the whole game.** Agent exfiltration in public disclosures goes through DNS and allowed hosts; the cure is the same allowlist, applied where the agent runs. A server gives one place to put it; a laptop gives hundreds.
5. **Why not buy an agent?** Netskope and Purview list endpoint DLP for Windows and macOS only; developers on HN describe seven-agent stacks and git at "20x as long". For Linux servers the buy option barely exists, and the build option is a proxy and some config.

## Overall gaps

- No first-person DLP statements from Meta, Microsoft, Amazon, Dropbox, Slack, Block, Coinbase, Apple, or trading firms; Netflix quotes are mostly via snippet.
- No public case of Cyberhaven/Incydr/Nightfall deployed on Linux dev servers; no independent efficacy data for vendor DLP.
- No source on OSC 52, tmux or terminal scrollback as an exfiltration route; no VS Code Remote file-download policy.
- No dev-server-specific eBPF/auditd detection case; no honeytoken-caught-insider case.
- Watermarking/fingerprinting of source: nothing found.
- Cases not read as raw text: Tesla v. Khatilov, X v. Yue, Apple v. Liu, Apple v. OpenAI, Twitter, NYT, Yandex (news only). Several detection mechanisms are unstated in filings.
- Zero-retention terms not read; LLM-gateway efficacy has no independent source.
- HN voice counts come from one Algolia pull per query; not exhaustive.
