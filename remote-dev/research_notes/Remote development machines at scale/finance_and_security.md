# Remote development machines in finance and other security-sensitive organizations (scoping pass)

Research date: 2026-11-26. Quick scoping pass, about 45 searches and fetches.

How to read the tags on each finding:

- **[fetched]**: I fetched the page. Quoted text was returned by the fetch tool's extraction of that page, which I did not see in raw form; re-check any quote before publishing it verbatim.
- **[read PDF]**: I downloaded the PDF and read the text directly (NIST SP 800-218, MAS TRM). These quotes are the most reliable in the file.
- **[snippet]**: search-result summary only. Treat as a lead, not a fact.
- **VENDOR**: published by a company selling the thing described. Customer numbers in these are self-reported.

PCI DSS is excluded by instruction.

## 1. Published accounts of developer environments at financial and payments firms

### Takeaway

First-party engineering accounts exist for the fintechs (Stripe, Plaid) and say the move to remote machines was for production fidelity and productivity, not security; for the large banks and trading firms I found almost nothing first-party, only vendor case studies of mid-size European banks and one trade-press interview (NAB). I found no public account from Goldman Sachs, JPMorgan, Capital One, Morgan Stanley, Citi, Jane Street, Two Sigma, Citadel or Bloomberg of where their developers' code lives.

### Cited Findings

#### Stripe (payments)

- Former Stripe engineer Nelson Elhage (at Stripe 2012 to 2019; post dated 2024-05-21) describes per-developer cloud instances called devboxes on which code ran, including tests, while git checkouts and editors stayed on the laptop with a sync process copying changes. So source code was on laptops by design. [fetched] — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/)
- Stated reasons for keeping source local: editor choice ("any editor they wanted"), latency ("200+ms network latency" for engineers far from US infrastructure), and making the devbox easier to treat as "ephemeral and transient". The post gives no security rationale for the design. [fetched] — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/)
- Devboxes were disposable: "a single command could destroy your instance and provision a new one", with warm spares. All devboxes were reachable over SSH by all engineers. The post does not say whether developers had root. Author caveat: nearly five years since he left; he does not claim it describes Stripe today. [fetched] — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/)
- A later Stripe talk (QCon, covered 2022) says devboxes predict production problems better than laptops because the OS matches and they carry configuration, feature flags and secrets; by then Stripe ran a VS Code server on the devbox. [snippet] — [InfoQ](https://www.infoq.com/presentations/stripe-dev-env-infrastructure), [DevClass 2022-04-06](https://devclass.com/2022/04/06/why-stripe-embraced-remote-coding-and-fixed-ruby-with-sorbet/)

#### Plaid (fintech)

- Plaid's engineering blog describes a "Remote Devenv"; about 1.5 years after rollout 87% of users used it exclusively. The post is dated 2022 per the search result. Page returned HTTP 403 on fetch, so rationale is unverified. [snippet] — [Plaid engineering](https://engineering.plaid.com/scaling-plaids-internal-developer-experience-with-a-remote-development-environment-23c97e0659fa)

#### National Australia Bank (trade press, 2019-05-03)

- Lupco Trpeski, senior automation and DevOps consultant at NAB, speaking at AWS Summit Sydney: "we only had Windows laptops - so there was no tooling" and "It was really hard to actually get anything installed on your laptop." Developers had no local admin rights and used Cygwin or Babun because those installed without them. [fetched] — [iTnews](https://www.itnews.com.au/news/nabs-cloud-devs-get-free-from-locked-down-it-524522)
- NAB ran a self-built Cloud9 web IDE on EC2 inside its AWS environment: "Running Cloud9 as an IDE in our AWS environment allowed us to do more than what we could do on our laptops." It also replaced the security team's dedicated bastion host. Accounts had no internet gateways. This is the clearest published instance of a bank giving developers more capability on a remote machine than on the laptop. [fetched] — [iTnews](https://www.itnews.com.au/news/nabs-cloud-devs-get-free-from-locked-down-it-524522)
- Same article: a "Mac@NAB" project relaxed the Windows-only rule and allowed Docker locally: "It was the first time we were able to do that." On the bank's posture: "It is so secure because it's what people expect of us [as a bank]". [fetched] — [iTnews](https://www.itnews.com.au/news/nabs-cloud-devs-get-free-from-locked-down-it-524522)

#### DZ BANK (Google Cloud Workstations; co-authored by the bank and NTT DATA, published on Google's blog 2024-05-29; VENDOR-hosted)

- "We run our workstations in a private workstation cluster without public IPs inside of a Shared VPC network". Package and tool downloads go through an artifact server "regularly scanned by the cybersecurity team"; OS package repositories are proxied "(i.e., no internet access)". [fetched] — [Google Cloud blog](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations)
- Stated motive includes control: "We wanted to have control over what tools developers use and be able to continuously scan them for any possible vulnerabilities." Onboarding "takes only one day vs. one week, pre Cloud Workstations". The post does not say what developers used before, does not mention root or sudo, and names no regulation. [fetched] — [Google Cloud blog](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations)

#### DekaBank (Coder; VENDOR case study, undated, cites figures "as at 30/06/2026")

- Prior state was laptops, not VDI: "Hardened corporate laptops too slow for software development due to antivirus scanners and enterprise proxies." Coder runs "entirely on-premises across multiple data centres in Germany". Workspaces sit in a dedicated network segment and dependencies "can only be fetched through JFrog Artifactory". About 700 IT staff; 100 users onboarded in the first month. Described as "ECB-regulated, systemically critical institution"; DORA and BaFin are not cited. Root rights not addressed. [fetched] — [Coder](https://coder.com/success-stories/dekabank)
- Same page: a planned twelve-week pilot of an AI coding agent inside these workspaces, with board approval to scale contingent on results. [fetched] — [Coder](https://coder.com/success-stories/dekabank)

#### ABN AMRO (Microsoft Windows 365; VENDOR customer story, page shows 1/26/2026, not labelled as publication date)

- The bank replaced an "outdated virtual desktop infrastructure" for "3,500 developers based in India" with Cloud PCs. Complaint about the old VDI: "high network latency were impacting critical development work". Reported 37% latency reduction; measurement method not described. The page does not say whether these are employees or contractors, nor anything about admin rights. Note this is VDI replaced by another virtual desktop, not by a cloud development environment. [fetched] — [Microsoft](https://www.microsoft.com/en/customers/story/25993-abn-amro-bank-windows-365)

#### Other vendor material

- Coder (2025-01-27) names no financial customers; refers to "A major U.S.-based investment firm" and "Another top 10 investment firm". VENDOR. [fetched] — [Coder blog](https://coder.com/blog/coder-supports-financial-institutions-in-secure-compliant-development)
- Coder (2024-08-02) on an unnamed global financial services firm: prior setup was "a local workstation"; "Onboarding is down to hours instead of days." No developer count, no security rationale given. VENDOR. [fetched] — [Coder blog](https://coder.com/blog/a-global-financial-services-company-brings-value-with-coder)
- Julius Baer has a "DevCloud" on Azure (Microsoft customer story and the bank's own article). VENDOR and first-party leads, not fetched. [snippet] — [Julius Baer](https://www.juliusbaer.com/en/insights/company-insights/behind-the-scenes/julius-baers-software-development-cloud-key-to-its-agile-transformation/)

#### Industry context

- The Pragmatic Engineer (Gergely Orosz, 2023-09-05) says VDIs have been popular in "industries where the benefits heavily outweigh the downsides, such as finance and banking", and cites a book's account of Bank of Tokyo Mitsubishi deploying 50,000 virtual desktops. It expects cloud development environments to be proposed "by engineers at companies already using VDIs". Partly paywalled. [fetched] — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)

### Inferences

- The public record splits by firm type. Fintechs that publish (Stripe, Plaid) run code remotely for fidelity and speed and, at least in Stripe's 2012 to 2019 design, were content to leave source on laptops. Banks that appear in case studies frame the remote machine as a control point (no public IP, proxied packages, scanned tools) with onboarding time as the headline benefit.
- Two different starting points lead to remote machines: locked-down laptops (NAB, DekaBank) and legacy VDI (ABN AMRO). The essay should not assume "bank equals VDI".

### Gaps

- No first-party account found for Goldman Sachs, JPMorgan, Capital One, Morgan Stanley, Citi, ING, Monzo, Starling, Nubank, Adyen, Block, PayPal, Coinbase, Wise, Klarna, Visa, Mastercard, Jane Street, Two Sigma, Citadel or Bloomberg. One search each across grouped names; a per-firm pass (engineering blogs, conference talks, job postings, Blind) is needed before claiming absence.
- Stripe's current setup (2025 to 2026) not confirmed; whether source still lives on laptops there is unknown.
- Plaid post not read.

## 2. The security argument: incidents and what remote machines change

### Takeaway

The cited incidents mostly turn on stolen sessions and credentials from an engineer's endpoint, and two of the four best-known ones began on a personal or home device, which a remote dev machine does not obviously fix. The firms' own remediations were about access (step-up authentication, shorter-lived permissions, session binding), not about relocating the code.

### Cited Findings

- **CircleCI, Dec 2022 to Jan 2023.** Malware on an engineer's laptop, compromised 2022-12-16, was used "in order to steal a valid, 2FA-backed SSO session." "The malware was not detected by our antivirus software." The engineer "had privileges to generate production access tokens as part of the employee's regular duties"; the attacker exfiltrated "customer environment variables, tokens, and keys" and "extracted encryption keys from a running process". Remediation: production access cut for nearly all employees, "additional step-up authentication steps and controls", and more ephemeral permissions. [fetched] — [CircleCI incident report](https://circleci.com/blog/jan-4-2023-incident-report)
- **LastPass, 2022.** Two linked incidents. In August 2022 attackers reached the cloud development environment via a compromised software engineer's laptop and took source code. Later a DevOps engineer's home computer was compromised through a remote-code-execution flaw in third-party media software and a keylogger captured the master password to the corporate vault after MFA. The media software is widely reported as Plex but LastPass did not name it. [snippet] — [SecurityWeek](https://www.securityweek.com/lastpass-says-devops-engineer-home-computer-hacked/), [TechTarget](https://www.techtarget.com/cybersecurity/news/365532032/LastPass-breach-tied-to-hack-of-engineers-home-computer)
- **Uber, Sept 2022.** Uber says an external contractor's credentials were exposed "after the contractor's personal device had been infected with malware"; the attacker then spammed two-factor prompts until "the contractor accepted one, and the attacker successfully logged in." Uber says it found no changes to its codebase; internal Slack messages and a finance invoice tool were accessed. [fetched] — [Uber security update](https://www.uber.com/newsroom/security-update/)
- **Okta, Sept to Oct 2023** (root cause published 2023-11-03). "an employee had signed-in to their personal Google profile on the Chrome browser of their Okta-managed laptop" and "The username and password of the service account had been saved into the employee's personal Google account." Remediation included blocking personal Google profiles in Chrome on managed laptops and binding admin sessions to network location. Not a developer-environment incident; it is a managed-laptop hygiene incident. [fetched] — [Okta Security](https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/)
- **Safe{Wallet} / Bybit, Feb 2025** (payments-adjacent, the largest case). Safe's review concluded the attack "was achieved through a compromised Safe{Wallet} developer machine resulting in the proposal of a disguised malicious transaction." Bybit lost "over 400,000 ETH and stETH worth more than $1.5 billion". Attributed to Lazarus. [fetched] — [BleepingComputer 2025-02-26](https://www.bleepingcomputer.com/news/security/lazarus-hacked-bybit-via-a-breached-safe-wallet-developer-machine/)
- Further detail on Safe: a developer's macOS workstation was compromised on 2025-02-04 after interacting with a malicious Docker project, and AWS session tokens were hijacked to bypass MFA; Mandiant tracks the actor as UNC4899. [snippet] — [SecurityWeek](https://www.securityweek.com/how-social-engineering-sparked-a-billion-dollar-supply-chain-cryptocurrency-heist/), [The Hacker News](https://thehackernews.com/2025/03/safewallet-confirms-north-korean.html)
- **Shai-Hulud npm worm, Sept 2025, second wave Nov 2025.** Self-replicating packages ran on developer machines and CI, used TruffleHog to find secrets, and harvested GitHub tokens, cloud keys and npm tokens stored locally. Kroll reports over 700 packages in the first campaign. [snippet] — [Krebs on Security 2025-09-16](https://krebsonsecurity.com/2025/09/self-replicating-worm-hits-180-software-packages/), [Kroll](https://www.kroll.com/en/publications/cyber/shai-hulud-returns-with-mass-credential-theft)
- The general claim for remote machines: "CDEs can offer an additional layer of protection to reduce the risk of source code leaking outside of the network" and, of VDI, "source code doesn't move onto a developer's laptop". [fetched] — [Pragmatic Engineer 2023-09-05](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)
- Uber's Devpod post lists security as one of three primary advantages of remote development alongside performance and near-zero setup, but motivates the project by monorepo performance on laptops. [snippet] — [Uber engineering](https://www.uber.com/en-US/blog/devpod-improving-developer-productivity-at-uber/)

### Inferences

- What a remote dev machine plausibly adds: no source or long-lived secrets at rest on a device that can be lost; a network position the firm controls (egress filtering, package proxy, no public IP, as at DZ BANK and DekaBank); central logging; fast rebuild after suspected compromise.
- What it does not add: the laptop still holds the browser session and the keys to reach the remote machine. CircleCI, Safe and Uber were session or credential thefts; an attacker with the engineer's session can drive the remote machine too. A malicious dependency (Shai-Hulud, the Safe Docker project) executes wherever the build runs, so moving the build moves the blast radius rather than removing it; the gain depends on what credentials and network reach the remote box has.
- What it can remove: Stripe's all-engineers-can-SSH-to-any-devbox convenience (2012 to 2019) is a trust model a bank would not accept; remote machines concentrate source and credentials in one fleet, which is a new target.
- None of the four incident write-ups I read lists "move development off laptops" as a remediation. That absence is worth stating in the essay, with the caveat that I read four reports.

### Gaps

- No incident found where a stolen or lost laptop, as opposed to malware on one, led to a published source-code breach at a financial firm. Not searched specifically.
- LastPass primary statement not fetched; details above are from press snippets.
- No measured evidence (from any party) that firms using remote dev machines have fewer endpoint-origin incidents.
- Insider source-code theft cases at trading firms (several prosecutions exist) were not searched; they would bear on the exfiltration argument.

## 3. What regulators and standards actually say about developer endpoints

### Takeaway

None of the texts I read mentions developer laptops, virtual desktops or cloud development environments. They require outcomes (authorised software only, data-leak prevention, separated environments, need-to-use privileged access, source-code integrity) and leave the mechanism to the firm. NIST SSDF is the only one that names "development endpoints", and it is guidance with examples, not a mandate.

### Cited Findings

- **NIST SP 800-218, SSDF v1.1 (Feb 2022).** Task PO.5.2: "Secure and harden development endpoints (i.e., endpoints for software designers, developers, testers, builders, etc.) to perform development-related tasks using a risk-based approach." [read PDF] — [NIST SP 800-218](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf)
- SSDF PO.5.2 notional examples include: "Configure each development endpoint and the development resources to provide the least functionality needed by users and services and to enforce the principle of least privilege"; "Continuously monitor the security posture of all development endpoints, including monitoring and auditing all use of privileged access"; and "Provide dedicated development endpoints on non-production networks for performing all development-related tasks. Provide separate endpoints on production networks for all other tasks." These are labelled examples, not requirements. [read PDF] — [NIST SP 800-218](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf)
- SSDF PO.5.1 examples include restricting connections for each development environment, "including minimizing access to the internet to only what is necessary." [read PDF] — [NIST SP 800-218](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf)
- **EU DORA RTS on ICT risk management, Commission Delegated Regulation (EU) 2024/1774.** Art. 11(2)(c): measures so that "only authorised software is installed in ICT systems and endpoint devices". Art. 11(2)(f) covers "portable endpoint devices and private non-portable endpoint devices", including remote management and security mechanisms users cannot disable. Art. 11(2)(i): measures "to prevent data loss and leakage for systems and endpoint devices". Art. 11(2)(j): teleworking and private devices must not adversely affect ICT security. [fetched, first 100,000 of 125,550 characters] — [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401774)
- Same RTS: Art. 8(2)(b) requires separation of production from development and testing environments; Art. 16(5)(a): "non-production environments only store anonymised, pseudonymised, or randomised production data"; Art. 16(7): "the implementation of controls to protect the integrity of the source code"; Art. 21(e)(ii): "assignment of privileged, emergency, and administrator access on a need-to-use or an ad-hoc basis for all ICT systems". The text read does not mention developer workstations, laptops or virtual desktops. Note Art. 16(7) concerns integrity of source code, not its confidentiality or location. [fetched, partial as above] — [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401774)
- **MAS Technology Risk Management Guidelines (January 2021; guidelines, "should" language).** 11.3.6: "Security measures, such as application white-listing, should be implemented to ensure only authorised software is allowed to be installed on the FI's systems." 9.3.2: "The FI should ensure remote access to the FI's information assets is only allowed from devices that have been secured according to the FI's security standards." [read PDF] — [MAS TRM Guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)
- MAS TRM 9.2.1: "Access to privileged accounts should only be granted on a need-to-use basis; activities of these accounts should be logged and reviewed". 11.1.3: "confidential data stored in systems and endpoint devices should be encrypted and protected by strong access controls." 11.1.6: "The use of sensitive production data in non-production environments should be restricted." 11.2.6: the FI "should consider isolating internet web browsing activities from its endpoint devices through the use of physical or logical controls". 6.3.2 asks for segregation of duties in DevSecOps. A keyword search of the PDF found no occurrence of "virtual desktop", and "laptop" only in a glossary example. [read PDF] — [MAS TRM Guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)
- **Vendor framing for contrast.** Coder says institutions must "comply with regulations like GDPR and DORA" and that its product helps with "providing the documentation required for audits and incident response", without stating what either text requires. VENDOR. [fetched] — [Coder blog 2025-01-27](https://coder.com/blog/coder-supports-financial-institutions-in-secure-compliant-development)
- **SOC 2.** Secondary sources describe SOC 2 as letting each organisation define its own controls, with full-disk encryption on laptops the common auditor expectation. No AICPA text read. [snippet] — [Sourcegraph](https://sourcegraph.com/blog/soc-2-compliance-for-developers-a-complete-guide), [SimpleMDM](https://simplemdm.com/blog/soc-2-iso-27001-with-apple-mdm/)

### Inferences

- "Only authorised software" (DORA RTS 11(2)(c), MAS 11.3.6) is the rule that makes a bank laptop hostile to development, and it is written against "ICT systems and endpoint devices" generally. Whether a disposable, network-fenced development VM can be scoped so that a developer installing packages inside it satisfies that rule is the legal hinge of the "more freedom on a remote box" thesis. I found no regulator or auditor statement on that scoping. It is an interpretation firms make, not something the text grants.
- SSDF's "dedicated development endpoints on non-production networks" is the closest any standard comes to describing a remote dev machine, and it is an example.
- MAS 11.2.6 (isolate web browsing from endpoints) is a text that pushes toward remote or virtualised browsing, which is one historical reason Singapore bank staff work through virtual desktops; that link is my inference, not sourced.

### Gaps

- FFIEC handbooks, EBA ICT guidelines (largely superseded by DORA for in-scope entities), SLSA and the DORA Level 1 text were not read. SLSA's stance on developer workstations is unverified; do not assert it.
- The last fifth of the DORA RTS (after Art. 28(3), the simplified framework) was not read.
- No supervisory finding, enforcement action or audit report read that cites developer workstations.

## 4. Outsourced, contractor and offshore developers

### Takeaway

Keeping code in the client's data centre while offshore staff work through a remote desktop is at least 17 years old as a documented payments-industry practice, and avoiding laptop shipping is an explicit motive in vendor material. The practitioners' objection (Thoughtworks, 2015) is equally old.

### Cited Findings

- VocaLink (UK payments infrastructure), 2009-06-17. IT director Nick Masterson-Jones on developers at offshore suppliers Perot Systems and Wipro using virtual desktops: "We wanted the developers in India to be able to write code as if was being written here in the UK", "You can't copy-and-paste code out of the virtual machine", "Now nothing leaves our data centre." [fetched] — [Information Age](https://information-age.com/?p=24998)
- Thoughtworks Technology Radar put "Citrix for development" on Hold in Jan, May and Nov 2015: the practice keeps assets on the organisation's servers but "absolutely cripples developer productivity." It recommended a secured offshore clean room or a hosted IDE, and argued for fixing the underlying security concerns so remote teams can hold source locally. [fetched] — [Thoughtworks Radar](https://www.thoughtworks.com/en-gb/radar/tools/citrix-for-development)
- Wipro case study (Feb 2021), a UK bank: "The client did not have VDI solutions and shipping physical laptops to the offshore team was a cumbersome task." Over 1,000 users on Azure virtual desktops; the users described are offshore testers, not developers. VENDOR. [fetched] — [Wipro](https://www.wipro.com/infrastructure/case-study/a-leading-uk-bank-enables-remote-work-solution-for-all-contract-employees/)
- ABN AMRO's 3,500 India-based developers work on virtual desktops (see section 1). VENDOR. [fetched] — [Microsoft](https://www.microsoft.com/en/customers/story/25993-abn-amro-bank-windows-365)
- Island and Coder (2024-12-18, updated 2025-06-17) pitch a managed browser plus cloud development environment so that "third-party contractors can access dev envs securely on commodity hardware", with copy-out, downloads and screenshots restricted in the browser. VENDOR. [fetched] — [Island](https://www.island.io/blog/coder-island-vdi-devs)
- North Korean remote IT worker schemes: in June 2025 the US DOJ announced searches of suspected "laptop farms" where US-based facilitators hosted company-issued laptops for remote operators; reporting cites over 100 US companies affected. [snippet] — [US DOJ](https://www.justice.gov/opa/pr/justice-department-announces-coordinated-nationwide-actions-combat-north-korean-remote), [TechCrunch 2025-06-30](https://techcrunch.com/2025/06/30/us-government-takes-down-major-north-korean-remote-it-workers-operation)
- The Pragmatic Engineer notes remote hiring raises the risk that someone other than the hired person accesses the codebase. [fetched] — [Pragmatic Engineer 2023-09-05](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)

### Inferences

- Shipping a managed laptop is itself the attack surface in the laptop-farm schemes: the device proves nothing about who is typing. A remote machine does not prove it either, but it removes the reason to ship hardware and puts all activity where the firm logs it.
- Uber 2022 began on a contractor's personal device. Contractor endpoints are the weakest-controlled endpoints, which is where "nothing on the endpoint" has the strongest case.

### Gaps

- No bank's actual contractor policy read. No source from Infosys, TCS, Wipro, Cognizant or Accenture describing standard client terms on code location.
- Data-residency and export-control motives for offshore VDI not researched.

## 5. Developer-experience complaints about VDI, and what is offered instead

### Takeaway

Latency and inability to install tools are the recurring complaints, and they appear in independent sources (Thoughtworks 2015, Pragmatic Engineer 2023, NAB 2019) as well as vendor ones. Cloud development environments are marketed as the replacement almost entirely by their vendors; the one bank VDI replacement I found went to a newer virtual desktop.

### Cited Findings

- Pragmatic Engineer (2023-09-05): "Working through a virtual machine can feel sluggish"; installing custom tools is "much more time and effort"; cloud development environments "only make sense when latency is low". [fetched] — [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/cloud-development-environments-why-now)
- Ona, formerly Gitpod (2024-02-22): latency is "the number one complaint from VDI users"; VDIs are "a general-purpose security solution that have never been tailored to software development practices"; an unnamed developer: "It's anti-developer. Period. Full stop." The piece concedes that where VDI is mandated the two are combined rather than VDI removed. No customers named. VENDOR. [fetched] — [Ona](https://ona.com/stories/writing-software-with-chopsticks-an-intro-to-vdi)
- Island and Coder: developers "often complain about a laggy or unresponsive experience when typing into text editors"; VDI "was never built to support a software development workflow"; VDI's benefit was that "all company source code was locked down to centrally managed machines." VENDOR. [fetched] — [Island](https://www.island.io/blog/coder-island-vdi-devs)
- Coder claims its platform "eliminates the management overhead, high costs, and poor developer experience of VDI"; no comparison data. VENDOR. [fetched] — [Coder blog 2025-01-27](https://coder.com/blog/coder-supports-financial-institutions-in-secure-compliant-development)
- Stripe kept editors local partly because editing over "200+ms network latency" was painful. This is the non-vendor statement of the design constraint: stream text and commands, not pixels, and keep the editor near the developer. [fetched] — [Made of Bugs](https://blog.nelhage.com/post/stripe-dev-environment/)
- Locked-down laptops draw the same complaints as VDI: DekaBank's "Hardened corporate laptops too slow for software development due to antivirus scanners and enterprise proxies" (VENDOR) and NAB's "It was really hard to actually get anything installed on your laptop." [fetched] — [Coder](https://coder.com/success-stories/dekabank), [iTnews](https://www.itnews.com.au/news/nabs-cloud-devs-get-free-from-locked-down-it-524522)
- An anonymous Blind thread about coding on "the VDI at work especially at the big banks" exists; a reply says to assume everything on VDI is tracked. Anecdotal. [snippet] — [Blind](https://www.teamblind.com/post/leetcoding-on-work-virtual-desktop-bqk1kmxh)

### Inferences

- The real distinction is pixel streaming of a whole Windows desktop versus a local editor talking to a remote Linux machine over SSH or an IDE protocol. "VDI versus CDE" as vendors frame it bundles that technical difference with a sales pitch.
- A cloud development environment reached through a locked-down browser with copy and download disabled (the Island model) reintroduces the VDI restrictions at a different layer. Whether that feels better to developers is asserted, not shown.

### Gaps

- No survey data or named-bank developer testimony on VDI. No before-and-after from a bank that replaced developer VDI with a cloud development environment.
- No source on banks that run both (a virtual desktop as the client, a Linux dev machine behind it), which practitioners describe informally as common.

## 6. Root, sudo and software installation on these machines

### Takeaway

The rules exist (authorised software only; privileged access on a need-to-use basis) and the bank anecdotes confirm no local admin on laptops, but I found no financial firm stating in public whether developers get root on their remote machines. That root-on-a-disposable-box is the design norm is documented only by sandbox and tooling vendors.

### Cited Findings

- NAB developers had no local admin on Windows laptops and used tools that installed without it (2019). [fetched] — [iTnews](https://www.itnews.com.au/news/nabs-cloud-devs-get-free-from-locked-down-it-524522)
- DORA RTS Art. 11(2)(c) and Art. 21(e)(ii), MAS TRM 11.3.6 and 9.2.1, and SSDF PO.5.2 examples 2 and 3 (least privilege; "monitoring and auditing all use of privileged access" on development endpoints) are the governing texts; see section 3. [fetched / read PDF] — [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401774), [MAS](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf), [NIST](https://nvlpubs.nist.gov/nistpubs/specialpublications/nist.sp.800-218.pdf)
- DZ BANK and DekaBank both control installation at the network rather than the account: all packages come through a scanned artifact server or Artifactory, with no direct internet. Neither says whether the developer is root. [fetched] — [Google Cloud blog](https://cloud.google.com/blog/products/application-modernization/dz-bank-improves-developer-productivity-with-cloud-workstations), [Coder](https://coder.com/success-stories/dekabank)
- Sandbox vendors state the pattern explicitly: passwordless root inside a per-workspace microVM, with the hypervisor as the boundary and credentials injected from outside the guest. VENDOR, and not finance-specific. [snippet] — [Docker](https://www.docker.com/blog/why-microvms-the-architecture-behind-docker-sandboxes/), [Chainguard](https://www.chainguard.dev/unchained/introducing-chainguard-workspaces)
- On laptops, the mainstream alternative is temporary elevation tools (Microsoft Endpoint Privilege Management, SAP Privileges on macOS). [snippet] — [Kandji](https://blog.kandji.io/local-it-admin-accounts)

### Inferences

- The two bank case studies suggest the control has moved from "what may the user install" to "what can the machine reach". That is the mechanism by which a remote box could carry root without breaching an authorised-software rule: the allow-list is enforced at the package proxy. This is my reading; neither bank says it.
- SSDF example 3 implies that if root is granted, its use should be logged, which is easier on a fleet the firm runs than on laptops.

### Gaps

- No financial firm's statement on root or sudo for developers on remote machines. This is the single most important missing fact for the "more freedom" thesis.
- Nothing found on how auditors treat root on ephemeral dev VMs.

## Angles for an essay

1. **The remote machine as a trade, not a lockdown.** A firm that cannot give developers admin on a laptop can move the boundary to the network (package proxy, no egress, disposable VM) and hand back root inside it. NAB 2019 is the only on-record example ("allowed us to do more than what we could do on our laptops"); DZ BANK and DekaBank show the network-side half. Weak point: nobody in finance has said "we give root" in public.
2. **Fintechs and banks arrived at the same architecture for opposite reasons.** Stripe and Plaid went remote for production fidelity and speed, and Stripe left source on laptops. Banks frame it as control. The essay can argue the productivity case is the durable one and security is the permission slip.
3. **The incidents do not say what vendors say they say.** CircleCI, Uber, LastPass, Okta and Safe were session, credential and personal-device failures; the published fixes were about access lifetime and step-up authentication. A remote dev machine narrows what a compromised endpoint holds but the laptop remains the key to it. An honest security section says what moves and what stays.
4. **Regulation requires outcomes, and VDI was one firm-level answer that hardened into habit.** DORA's RTS, MAS TRM and SSDF never mention virtual desktops or laptops. "The regulator requires VDI" is not in any text read here. The opening this leaves for a different mechanism is real but unendorsed.
5. **VDI for offshore developers is a 2009 solution still in service.** VocaLink 2009, Thoughtworks' 2015 Hold, ABN AMRO's 3,500 developers in 2026. The laptop-farm cases add a new reason not to ship hardware. Payments examples (VocaLink, Safe/Bybit) fit the essay's quiet audience without naming it.
6. **Pixels versus text.** The complaint about VDI is about streaming a desktop; Stripe's local-editor design is the counter-example. A cloud environment behind a copy-disabled browser may reproduce the grievance.

### Open questions not answered

- Do Goldman Sachs, JPMorgan, Capital One, Citi, Jane Street, Two Sigma, Citadel, Bloomberg, Adyen, Block, Coinbase, Monzo or Nubank keep source on laptops? No public statement found either way in this pass.
- Does any regulated firm publicly grant developers root on remote machines, and how do its auditors scope "authorised software" there?
- Is there any measured security outcome from moving development off laptops?
- What do FFIEC, the EBA guidelines and SLSA say (unread)?
- What is Stripe's arrangement today, and has AI-agent use (as in DekaBank's planned pilot) become the stated reason for remote machines in finance during 2026?
