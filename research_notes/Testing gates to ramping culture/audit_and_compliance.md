# Audit, regulation and change control: what the rules require and how payments firms and banks passed audit after replacing manual release gates (2010-2025)

Reading-status tags used throughout:

- **[READ]** = I extracted and read the document text myself in this session.
- **[TOOL]** = a fetch tool read the page and returned quotes/paraphrase; I did not see the raw text.
- **[SNIPPET]** = search-result summary only; treat as a lead, not evidence.
- **[NOT READ]** = could not be retrieved; no claims made beyond noting it.

Source classes are kept apart: (1) regulatory/standard text, (2) first-person practitioner accounts, (3) vendor material and advocacy books.

Cross-references: the sibling file `empirical_and_regulated.md` already covers DORA/Accelerate, the FCA "Implementing technology change" review (published 5 Feb 2021, 2019 data), MAS TRM in outline, Capital One's 16 gates, Starling, Monzo's 2022 deploy post and other bank DevOps accounts. `counter_evidence_and_failures.md` covers Knight Capital and TSB. They are cited here only where needed.

---

## 1. What the rules actually say

### Takeaway

Across the texts I read (PCI DSS v4.0, FFIEC DA&M 2024, EBA 2019, DORA and its RTS, MAS TRM 2021, PCAOB AS 2201, PRA SS1/21), none requires a time-based soak, a release train or multi-day environment promotion; all require the same evidence set: recorded change, testing, approval by someone with authority, segregation of duties, separation of production from pre-production, and a fall-back plan. The texts do bite in three places: MAS expects a change advisory board and signed-off test results, MAS and FFIEC expect quality assurance independent of development, and PCI DSS (for manual code review) and the DORA RTS require an approver who is not the author or implementer.

### Cited Findings

**(1) Regulatory and standard text:**

*PCI DSS v4.0, "Requirements and Testing Procedures", March 2022.* **[READ]**, from an Internet Archive capture (31 Mar 2022) of the official PDF; the PCI SSC site itself returned 403 behind its licence click-through. Requirement 6 change control moved from 6.4.x (v3.2.1) to 6.5.x (v4.0). — [PCI DSS v4.0 PDF (official location)](https://www.pcisecuritystandards.org/documents/PCI-DSS-v4_0.pdf)

- 6.5.1: production changes follow "established procedures" that include "Documented change approval by authorized parties" and "Testing to verify that the change does not adversely impact system security."
- 6.5.1 also requires "Procedures to address failures and return to a secure state." (v4.0's wording for back-out.)
- 6.5.1 guidance on who approves: "Changes should be approved by individuals with the appropriate authority and knowledge to understand the impact of the change." No board is named.
- 6.5.1 guidance on testing: "The specific testing to be performed will vary according to the type of change and system component(s) affected." No duration or environment count.
- 6.5.3: "Pre-production environments are separated from production environments and the separation is enforced with access controls."
- 6.5.4: "Roles and functions are separated between production and pre-production environments to provide accountability such that only reviewed and approved changes are deployed."
- 6.5.4 applicability note allows small teams with overlapping roles: "this same goal can be achieved with additional procedural controls that provide accountability."
- 6.5.4 guidance states the purpose: "two people would need to collude in order to hide an activity".
- Glossary, "Separation of Duties": "Practice of dividing steps in a function among multiple individuals, to prevent a single individual from subverting the process."
- 6.2.3: "Code reviews may be performed using either manual or automated processes, or a combination of both."
- 6.2.3.1 (applies when code review is manual): changes are "Reviewed by individuals other than the originating code author" and "Reviewed and approved by management prior to release."
- 6.2.3.1 applicability note defines "management" as someone "formally granted accountability for release control and who is neither the original code author nor the code reviewer". **This cuts against a bare "one peer approval, then deploy" model inside PCI scope when review is manual: the text names three roles (author, reviewer, release-control approver).**
- Term counts in the full text: "canary" 0, "feature flag/toggle" 0, "soak" 0, "advisory board" 0, "pipeline" 0, "CI/CD" 0, "DevOps" 0.
- Limits: this is the March 2022 v4.0 text; v4.0.1 (2024) was not read. A QSA's interpretation, not the text, decides an assessment.

*PCI DSS v3.2.1 (May 2018).* **[NOT READ]** — every retrieval attempt failed (redirect, 403, 429). I cannot quote 6.4.1-6.4.5.4 or 6.3.2 from the document. v4.0's front matter confirms v4.0 is an "Update from PCI DSS v3.2.1" **[READ]**. The mapping 6.4.x to 6.5.x and the v3.2.1 wording ("separation of duties between development/test and production", "back-out procedures") should be checked against the v3.2.1 PDF or the official Summary of Changes before being quoted.

*FFIEC IT Examination Handbook, "Development, Acquisition, and Maintenance" booklet, August 2024.* **[READ]**, from a CCH-hosted PDF copy of the booklet; ithandbook.ffiec.gov returned 403. Section numbers are from the booklet's table of contents; where I infer a section from position I say so. — [FFIEC DA&M booklet, Aug 2024 (CCH copy)](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf)

- Status: examiner guidance. The FDIC says the booklet "does not impose new requirements" **[SNIPPET]** — [FDIC FIL, Aug 2024](https://fdic.gov/news/financial-institution-letters/2024/updated-ffiec-it-examination-handbook-development)
- V.C.1 "DevOps" recognises high-frequency change: "in a DevOps environment, the same number and type of changes can be made daily or even hourly."
- V.C.1 warning: "automation of previously manual activities, combined with frequent and rapid release cycles, may result in perpetuation of errors or invalid code."
- V.C.1 instruction: "Management should assess the risks involved in using a DevOps approach and implement appropriate controls." Listed risks include "Misconfigured process automation" and "Inadequate controls over code implemented in production".
- V.C.2 "DevSecOps" defines CI, continuous delivery and continuous deployment (citing NIST) and describes continuous deployment as when "the entity automates the deployment process, and code is available to users immediately." It is described, not prohibited.
- Canary and blue/green are named, as API-gateway functions (IV.I.1; also footnotes in IV.G Microservices): "Only a limited amount of traffic is initially sent to a new version of a microservice to verify the accuracy of its response and performance."
- Pilot and phased implementation are described as legitimate strategies (implementation discussion, position suggests IV.O.1(c)): piloting's advantages "include minimizing the risks of a comprehensive rollout to the entire user population".
- VII.B Change Management, approval step: "An appropriate level of management, sometimes in collaboration with personnel or a committee, should determine approval of change decisions."
- VII.B on boards: a stakeholder group "can aid the change manager"; "Examples of this type of group include change advisory boards and change control review boards". Described as examples, not mandated.
- VII.B test step: "The team tests the proposed change independently for security, functionality, and any potential adverse effects of the change."
- VII.B: "Testing should be documented so that testing policy and procedure implementation may be audited."
- VII.B implementation step prefers deployment "during off-peak hours or planned system downtime". **This sits awkwardly with daytime continuous deployment.**
- VII.B.3(a) Routine Modifications: "Sometimes referred to as standard changes, routine modifications can be simple or complex but are not considered major".
- VII.B.3(a): "Routine modifications follow repeatable procedures and are often implemented with automation."
- VII.B.3: all change types need "an orderly, adaptable, documented, and measurable process" that will "provide an audit trail for changes."
- VII.B.4(c): "Entity personnel should develop a rollback or back-out plan to reverse a failed deployment."
- Segregation (II.B roles): "code review involves a second individual to review code before it is released to test environments." Overlapping roles are "acceptable if mitigating controls are in place."
- VII.B.2(c) code repository controls, example: segregation "to prevent developer access to the staging and production code repositories" and access to production repositories "only to release management personnel." **Cuts against developer-run deploys unless the pipeline is the release-management actor.**
- Quality management (IV.K by position): "Quality management should be an independent function from development" and "developers should not test and validate systems and components that they developed." **Cuts against "developers own all testing".**
- Term counts: "DevOps" 23, "CI/CD" 14, "pipeline" 23, "canary" 2, "feature flag/toggle" 0, "soak" 0, "peer review" 0.
- Limits: the companion "Architecture, Infrastructure, and Operations" booklet (2021) was **[NOT READ]**.

*EBA Guidelines on ICT and security risk management, EBA/GL/2019/04, final report 29 November 2019.* **[READ]** from the EBA PDF. — [EBA GL/2019/04](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Guidelines/2020/GLs%20on%20ICT%20and%20security%20risk%20management/872936/Final%20draft%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf)

- Section 3.6.3, para 75: a process to ensure all changes are "recorded, tested, assessed, approved, implemented and verified in a controlled manner."
- Para 75 on emergencies: handle them "following procedures that provide adequate safeguards."
- Section 3.6.2, para 72: "implement separate ICT environments to ensure adequate segregation of duties and to mitigate the impact of unverified changes to production systems."
- Para 70: use "test environments that adequately reflect the production environment."
- Feedback table (consultation responses asking for agile-compatible wording): "the EBA does not specify what software development methodology is to be used"; the executive summary was amended to say the guidelines "intend to be technology and methodology agnostic."
- No CAB, no QA-team mandate, no timing requirement. "DevOps" appears only in respondents' comments.

*EU DORA, Regulation (EU) 2022/2554.* Article 9(4)(e) **[TOOL, verbatim pieces returned]** — [EUR-Lex 32022R2554](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554)

- Art. 9(4)(e): change-management policies "based on a risk assessment approach" so that all changes are "recorded, tested, assessed, approved, implemented and verified in a controlled manner".
- Scope of "change" in 9(4)(e): "changes to software, hardware, firmware components, systems or security parameters".

*DORA RTS on ICT risk management, Commission Delegated Regulation (EU) 2024/1774.* **[TOOL: short quotes plus paraphrase]** — [EUR-Lex 32024R1774](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1774)

- Art. 17(1) applies to "all changes to software, hardware, firmware components, systems, or security parameters".
- Art. 17(1)(b) (paraphrase): functions that approve changes must be independent of functions that request and implement them. **A hard segregation rule; whether a same-team peer reviewer is an independent "function" is not settled by the text.**
- Art. 17(1)(c) (paraphrase): defined roles for specification, planning, transition design, controlled testing and quality assurance. Art. 17(1)(e): fall-back procedures. 17(1)(f)-(g): emergency changes with safeguards and after-the-fact approval.
- Art. 16(2): "the level of testing shall be commensurate to the criticality of the business procedures and ICT assets concerned."
- Art. 8(2)(b) (paraphrase): production separated from development/test; testing in production permitted only where instances are identified, reasoned, time-limited and approved. **Relevant to canaries and dark launches: defensible, but as a documented, approved exception.**
- Recital 15: project policies apply "regardless of the ICT project management methodology chosen by the financial entity." No recital mentions agile or DevOps.

*MAS Technology Risk Management Guidelines, January 2021.* **[READ]** from the MAS PDF. (Outline already in `empirical_and_regulated.md` section 4.) — [MAS TRM 2021](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)

- 6.3.1 defines DevSecOps as including "continuous integration, continuous delivery and IT security practices" and says it must align with change and release management.
- 6.3.2: "enforce segregation of duties for the software development, testing and release functions in its DevSecOps processes."
- 7.5.1: changes are "assessed, tested, reviewed and approved before implementation."
- 7.5.3: "Test results should be accepted and signed off before the changes are deployed to the production environment."
- 7.5.4: "A change advisory board, comprising key stakeholders including business and IT management, should be formed to approve and prioritise the changes". **The one text I read that names a CAB as an expectation.**
- 7.5.5: "establish a rollback plan to revert the information asset to the previous state".
- 7.6.1: "no single individual has the ability to develop, compile and move software codes from one environment to another."
- 5.8.2 (project quality management): "Quality assurance should be performed by an independent quality assurance function".
- Term counts: "canary" 0, "feature flag" 0, "phased/progressive" 0, "soak" 0. MAS does **not** address canaries or flags, contrary to the brief's expectation.

*PCAOB AS 2201 (audit of internal control over financial reporting).* **[READ]**, from an Internet Archive capture of the pcaobus.org page (direct fetch returned 403). — [PCAOB AS 2201](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)

- The standard prescribes no change procedure. "change management", "segregation of duties", "advisory board" each appear 0 times.
- .47: "an automated control would generally be expected to be lower risk if relevant information technology general controls are effective".
- .B29: benchmarking is available "If general controls over program changes, access to programs, and computer operations are effective and continue to be tested".
- .B31: an application "is stable (i.e., there are few changes from period to period)" is a factor favouring benchmarking. **Frequent change to financially relevant code reduces the auditor's ability to benchmark automated controls year to year, raising reliance on (and testing of) program-change ITGCs.**

*PRA SS1/21 "Operational resilience: Impact tolerances for important business services" (March 2022 version).* **[READ]** — [PRA SS1/21](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2021/ss121-march-22.pdf)

- Contains no change-management procedure ("change management" 0 occurrences). It regulates outcomes (staying within impact tolerances).
- 6.6: "firms that implement changes to their operations more frequently should undertake more frequent scenario testing".

*SOC 2 Trust Services Criteria CC8.1.* **[SNIPPET]** — secondary sites reproduce the criterion as the entity "authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes" to meet its objectives; the AICPA document itself was not read. — [isms.online CC8.1 explainer](https://www.isms.online/soc-2/controls/change-management-cc8-1-explained/)

*ITIL 4 "standard change".* **[SNIPPET]** — the Axelos Change Enablement practice guide is summarised as defining a standard change as low-risk, pre-authorised, well understood and documented, implementable without additional authorisation. Not read at source. — [search summary; AWS paper below quotes the guide's "change model" definition](https://docs.aws.amazon.com/pdfs/wellarchitected/latest/change-enablement-in-the-cloud/change-enablement-in-the-cloud.pdf)

**(3) Vendor material:**

*AWS, "Change Enablement in the Cloud" (AWS Well-Architected), revision dated 27 June 2024.* **[READ]**; vendor. — [AWS whitepaper PDF](https://docs.aws.amazon.com/pdfs/wellarchitected/latest/change-enablement-in-the-cloud/change-enablement-in-the-cloud.pdf)

- Argues pipeline deployments should be reclassified: with automation in place "large, infrequent, and risky changes are transformed in to small, frequent, and low-risk changes."
- "In an environment of small, frequent changes, standard (automated) changes become the new standard."
- Recommends "automation of change ticket creation from data available in the pipeline".
- Limits: vendor advocacy; cites no regulator or auditor acceptance.

### Inferences

- Requirement-by-requirement answer to "do the rules require what we have?":
  - **Time-based soak / multi-day promotion / release trains:** not required by any text read. "Soak" appears in none of them. The closest timing language is FFIEC's preference for off-peak deployment.
  - **Human approval board:** required as a "should" by MAS 7.5.4 only. FFIEC lists CABs as examples; PCI, EBA, DORA and the DORA RTS require approval by an authorised, independent party without naming a board.
  - **Separate QA function:** MAS 5.8.2 and FFIEC expect independence of quality assurance from development; DORA RTS 17(1)(c) requires defined QA roles. PCI and EBA do not.
  - **What all require:** a record, risk/impact assessment, testing proportionate to risk, approval by someone other than the author, production/pre-production separation, rollback capability, and an audit trail. Each of these can be produced by a pipeline, though the texts never say so in terms.
- The FFIEC booklet's own statement that routine modifications are "sometimes referred to as standard changes" and "often implemented with automation" is the strongest primary-text hook for classifying pipeline deploys as pre-authorised standard changes at a US bank.
- SOX change-management expectations come from auditor practice built on COSO/COBIT, not from AS 2201's text, which is silent on procedure. That supports "it is a convention negotiated with your auditor", but I did not read COSO or COBIT BAI06 and cannot quote them.
- EBA's explicit refusal to prescribe a methodology, after banks complained the draft implied waterfall, is useful evidence that EU supervisors chose outcome-based wording on purpose.

### Gaps

- PCI DSS v3.2.1 text, PCI DSS v4.0.1, COBIT BAI06, COSO, ISO/IEC 27001:2022 A.8.32, the AICPA TSC document, the ITIL 4 practice guide, FCA SYSC, and the FFIEC AIO booklet were not read. No wording from them should be quoted from these notes.
- DORA RTS Article 17 was read through a fetch tool that paraphrased most points; quote it only after checking EUR-Lex.
- No text says whether an automated gate may substitute for a human approver; that remains an assessor/supervisor judgement.

---

## 2. Segregation of duties when developers deploy their own code

### Takeaway

The documented pattern is consistent: the second person is the reviewer, the pipeline is the only path to production and enforces that review, humans lose standing production access, and logs plus break-glass alerts provide the detective control. First-person accounts from banks describe this design but almost never describe the conversation with an external auditor or regulator; the gap the previous pass found is narrowed, not closed.

### Cited Findings

**(2) First-person practitioner accounts:**

- **Etsy (PCI).** Jez Humble, "PCI-DSS and continuous deployment at Etsy", continuousdelivery.com, 11 July 2012, reporting Michael Rembetsy (Etsy Director of Operations Engineering). **[TOOL]**. Second-hand write-up of a first-person talk. Etsy deployed 25-50 times a day outside PCI scope and built a segmented cardholder environment: "we built a whole separate Etsy, essentially". Inside it, developers had no production database access, deploys used "QA pusher" and "production pusher" roles with extra logging, every change had a ticket, and a normal change could still go dev-to-prod in under an hour. Limits: says nothing about the QSA's reaction, compensating controls or the audit outcome; the PCI environment kept role separation rather than abolishing it. — [Humble 2012](https://continuousdelivery.com/2012/07/pci-dss-and-continuous-deployment-at-etsy)
- **Monzo (UK bank).** Chongyang Shi and Dovydas Bartkevicius, "How we secure Monzo's banking platform", 30/31 March 2022. **[TOOL]**. "Our change management policy dictates that we require at least one other person to review a change"; the pipeline was changed to "require review from the owning teams and the PR to be merged before allowing deployments"; "we log all actions by both human users and service accounts"; audit-log components use "append-only permissions"; break-glass access raises "very loud alerts". Limits: names no regulator or auditor; says access reviews are "audited at least once per year" but not that change control was. — [Monzo 2022](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform)
- **Starling (UK bank), 2019.** QCon London panel "Bleeding Edge at Hyperspeed with No Breaks and No Breaches", InfoQ transcript. **[TOOL]**. Jason Maude (Starling): "we use Slack for people to gain permission in a four-eyes manner to initiate a deployment to production", giving "an audit log" without paper sign-off; aim is "finding ways of fulfilling the regulations in a way that does not block you". Ana Calin (Paybase, PCI DSS): certification involved "training the auditor of how containers work"; auditors ask "when was this changed? Show me how it was done", answered from Terraform state and Git. Suhail Patel (Monzo): being able to show "who made what decision where and when" is "pretty important from a regulatory standpoint"; "Sometimes the regulator's impressed". Will Jones (Habito): controls are "exactly all the regulator's asking me to do to a degree". Limits: conversational; no audit report, no named finding. — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)
- **Starling, 2025.** Paul J Moore and Marcus Mak, "How we made everyone a release engineer", 23 October 2025. **[TOOL]**. The release portal records "the metadata related to a release that regulators require banks have" and is "our immutable audit of what software we release to production". Three approvals precede each release: commit approval, technical approval "from a set of nominated individuals", and business approval from engineering leads/directors/executives, which "is here to manage our overall risk as a regulated bank". Releases happen "multiple times per day". **Starling kept named human approvers, including a management tier, and still releases many times daily.** Limits: does not name auditors or describe an examination. — [Starling 2025](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer)
- **Capital One.** Jennifer Brady (technology governance director, former auditor), "Governance in a DevOps Environment", Capital One Tech, 8 August 2018. **[TOOL]**. "The biggest hurdle is often that one person cannot do it all and maintain appropriate segregation of duties." Recommended design: "restrict production access for everyone and allow changes to production only via a 'cleanroom' pipeline"; peer review requires "that the second set of eyes is qualified"; detect changes made "without a change order or ticket"; external auditors and regulators "must be brought into the conversation and given full transparency into development processes." Deployed-multiple-times-a-day products grew from "about twenty" (2016) to "hundreds" (2017). Limits: describes design intent, not how an audit or OCC examination concluded. — [Brady 2018](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/)
- **Banks at DevOps Enterprise Summit London 2017.** João Miranda, InfoQ, 16 June 2017 (journalist's summary of talks). **[TOOL]**. Capital One's pipeline gates include "automated change orders"; BBVA was building "automated approval criteria and behaviour enforcement"; ING's Daniele Romano said with immutable servers "everything is fully audited"; SIX works with compliance and auditors so internal rules do not exceed what law requires; Barclays' Jonathan Smart described early, regular engagement with the control "tribes". Limits: secondary reporting; I could not verify the phrase "minimal viable compliance" attributed to Smart. — [InfoQ 2017](https://www.infoq.com/news/2017/06/does-financial-industry)
- **Google (not a financial firm).** "Binary Authorization for Borg", Google Cloud security documentation (page says last updated September 2026). **[TOOL]**. Code "requires review and approval from at least one engineer other than the author"; enforcement either blocks deployment or continuously verifies; an "emergency response flag" override is logged and notifies the central security team; "Defining or modifying a policy is itself a code change that must undergo review." Value: the clearest published description of code review as a machine-enforced deploy-time control with audited break-glass. Limits: not written for financial audit. — [Google BAB](https://docs.cloud.google.com/docs/security/binary-authorization-for-borg)
- **GitLab (SOX registrant).** Public handbook and docs. **[SNIPPET]** — the change-management policy page now redirects to a login. The handbook describes readiness "to pass a SOX Audit for our IT General Controls"; project settings block approval by the merge-request author and by committers, mapped to an internal control ID (CHG-04). — [GitLab IT Compliance handbook](https://handbook.gitlab.com/handbook/business-technology/it-compliance)
- **Anonymous practitioner.** Hacker News thread "How to Reconcile SOX Segregation of Duties with DevOps?" (2021): a commenter reports SOX compliance where "the dev who wrote it is not the dev who approves it", with many deploys per day. **[SNIPPET]**; unverifiable anecdote. — [HN thread](https://news.ycombinator.com/item?id=26959938)

**(3) Vendor material and advocacy books:**

- **DevOps Audit Defense Toolkit** (James DeLuccia IV, Jeff Gallimore, Gene Kim, Byron Miller; IT Revolution; 22 pages; CC BY-NC-SA). **[SNIPPET]** — the PDF was not read. Summaries say it has peer review stand in for external change approval and treats most small changes as standard, pre-approved changes not needing a CAB. Date uncertainty: a co-author's article dated 25 July 2014 says a first draft was already circulating, while the brief dates v1.0 to 2015; unresolved. Advocacy, built around a hypothetical organisation. — [IT Revolution listing](https://itrevolution.com/product/devops-audit-defense-toolkit); [Gallimore 2014](https://www.excella.com/insights/helping-it-and-audit-work-better-together-the-devops-audit-defense-toolkit)
- **DevOps Automated Governance Reference Architecture** (IT Revolution, 2019; contributors include Tapabrata Pal of Capital One and a PNC engineer). **[SNIPPET]** — proposes pipeline attestations as audit evidence; not read. — [IT Revolution reader](https://reader.itrevolution.com/library/devops-automated-governance-reference-architecture)

### Inferences

- The control mapping that recurs across Monzo, Starling, Capital One, Google and GitLab:
  - authorisation = reviewer other than the author (PCI 6.2.3.1, FFIEC II.B, DORA RTS 17(1)(b));
  - segregation = no human write access to production; the pipeline is the "release management" actor (MAS 7.6.1, FFIEC VII.B.2(c));
  - evidence = immutable logs linking commit, review, test result and deploy (FFIEC VII.B.3 audit trail; MAS 7.5.7);
  - exceptions = break-glass with alerting and after-the-fact review (EBA para 75; DORA RTS 17(1)(f)-(g)).
- The regulated firms did not remove human approval; they moved it to the pull request and, at Starling, kept a management "business approval". An essay claiming banks eliminated approvals would overstate the record.
- Etsy is evidence that a PCI environment can deploy quickly with role separation, not evidence that PCI scope can run the same process as the rest of the site.
- The strongest honest statement: regulated firms publicly describe these designs and continue to operate under PCI, FCA/PRA and OCC supervision, which implies acceptance; none publishes the assessor's or examiner's reasoning.

### Gaps

- **Still no source in which a firm describes a specific regulator examination or external audit of its change process and its outcome.** Closest are the 2019 QCon panel remarks and Capital One's former-auditor article.
- Not found or not searched to conclusion: Stripe, Square/Block, Adyen, Wise, Nubank, Coinbase (only a 2016-era "consensus-based deploys" description surfaced, no SOX link), Robinhood, JPMorgan, Goldman Sachs, Fidelity, Vanguard, American Express, Visa/Mastercard engineering, NAB, Commonwealth Bank, Nationwide, a GitHub SOX post, Intercom/Segment SOC 2 posts. Absence here means "not found in this pass", not "does not exist".
- "Investments Unlimited" (IT Revolution, 2022; fictionalised) was not consulted.
- DevOps Enterprise Summit videos (Capital One, Barclays) sit behind a login; slide-level claims are in the sibling notes.

---

## 3. Feature flags as a controlled change

### Takeaway

No regulator or standard text I read mentions feature flags, and no first-person account from a bank or payments firm describes how flag flips are treated under change control. The scope clauses are broad enough that a production flag change is plainly a "change" (DORA: "security parameters"; PCI: any modification of a system component; FFIEC: "configuration settings"), so the defensible position is to give flag changes their own logged, approved, pre-authorised change type, not to argue they are outside change control.

### Cited Findings

**(1) Regulatory and standard text:**

- DORA Art. 9(4)(e) and RTS Art. 17(1) cover "changes to software, hardware, firmware components, systems or security parameters". **[TOOL]** — [EUR-Lex 32022R2554](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554)
- PCI DSS v4.0 6.5.1 guidance: change procedures apply to "the addition, removal, or modification of any system component—in the production environment." **[READ]** — [PCI DSS v4.0](https://www.pcisecuritystandards.org/documents/PCI-DSS-v4_0.pdf)
- FFIEC DA&M VII.B: the change control process covers changes to "systems or components, adjust configuration settings, and make changes to remediate flaws." **[READ]** — [FFIEC DA&M 2024](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf)
- FFIEC describes canary release as sending limited traffic "to verify the accuracy of its response and performance" before full routing (IV.I.1), i.e. a ramp is a recognised technique in examiner guidance. **[READ]** — same source.
- DORA RTS Art. 8(2)(b) (paraphrase): testing in production only where identified, reasoned, time-limited and approved. **[TOOL]** — [EUR-Lex 32024R1774](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1774)
- Knight Capital (SEC Release 34-70694): the failure involved a repurposed flag and incomplete deployment; see `counter_evidence_and_failures.md`. Cross-reference only.

**(2) First-person practitioner accounts:**

- Monzo requires configuration changes (example: WAF configuration) to "go through peer review" before automatic application; feature flags are not mentioned. **[TOOL]** — [Monzo 2022](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform)
- Google: "Defining or modifying a policy is itself a code change that must undergo review." **[TOOL]** — [Google BAB](https://docs.cloud.google.com/docs/security/binary-authorization-for-borg)

**(3) Vendor material:**

- LaunchDarkly documentation: flag approval requests can create a ServiceNow change request from "an existing ServiceNow standard change template"; the flag change applies only once that request is approved. **[SNIPPET]**; vendor. — [LaunchDarkly ServiceNow approvals](https://launchdarkly.com/docs/integrations/servicenow/approvals)
- Unleash, GrowthBook and similar vendor blogs assert that auditors treat production flag changes as configuration changes needing approval by someone other than the requester and an immutable who/when/old/new log; one concedes SOX "does not prescribe a flag control" and that scoping is a judgement for internal audit. **[SNIPPET]**; vendor marketing, no auditor cited. — [Unleash on SOX and flags](https://www.getunleash.io/blog/how-do-you-manage-sox-change-control-for-feature-flags)

### Inferences

- A workable classification, consistent with the texts: (a) the code that introduces a flag goes through normal reviewed deployment; (b) the ramp plan (stages, metrics, abort criteria) is approved once, as a standard change model; (c) each ramp step is an execution of that pre-approved model, logged automatically; (d) kill-switch use is an emergency change with after-the-fact review. This is my synthesis; no source states it as accepted practice.
- The existence of a vendor integration that files each flag change as a ServiceNow standard change shows demand from regulated customers for exactly this treatment, but is not evidence of regulator acceptance.
- Whether each ramp step needs four-eyes approval is unanswered by any source. DORA RTS 17(1)(b) (independent approval) read literally would apply to the change, which firms could argue is the ramp plan rather than each step.

### Gaps

- No regulator or auditor statement on feature flags, ramp steps or flag-flip approval was found.
- No bank or payments firm's first-person description of flag governance was found.
- LaunchDarkly/Split compliance documents were not read beyond search summaries.

---

## 4. Regulator attitudes and enforcement

### Takeaway

Supervisors consistently identify change as the leading cause of bank IT incidents and respond by demanding stronger change governance and testing, not faster release; the one enforcement remedy found that targets change directly was a six-month freeze. Evidence that supervisors favour small, frequent, automated change exists (the FCA review in the sibling notes; a 2026 Basel report as summarised by the press) but is thinner than evidence that they punish change failure.

### Cited Findings

**(1) Regulator documents:**

- **MAS on DBS, 1 November 2023.** MAS media release. **[TOOL]**. After repeated 2023 outages MAS directed DBS to "suspend all changes to the bank's IT systems" for six months, except those for "security, regulatory compliance and risk management"; it cited shortcomings including "change management" and kept an operational-risk capital multiplier of 1.8 times. Press reports put the additional capital at about S$1.6bn and say the pause ended 30 April 2024 with the multiplier retained **[SNIPPET]**. **Evidence against the thesis in practice: the supervisor's remedy for change-related failure was less change.** — [MAS media release](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs)
- **ECB Banking Supervision, "IT and cybersecurity: no grounds for complacency", Supervision Newsletter, 15 November 2023.** **[TOOL]**. "IT changes and software issues were again identified as the root cause behind critical services downtime"; banks need to strengthen governance and processes around change management. No statistics given; no statement on release frequency. — [ECB newsletter](https://www.bankingsupervision.europa.eu/press/publications/newsletter/2023/html/ssm.nl231115.en.html)
- **Basel Committee, "Information and communication technology (ICT) risk management: range of practices", 2 June 2026** (outside the 2010-2025 window). Landing page **[TOOL]** confirms title and date; the PDF was not read. — [BCBS d611](https://www.bis.org/bcbs/publ/d611.htm). Press summary **[TOOL, secondary]**: 16 jurisdictions surveyed, 12 supplied 2022-2024 incident data; "Change control gaps are the leading cause of non-malicious ICT incidents at banks", cited by eight of 12; test environments often diverge from production; some institutions automate up to 85% of pre-approved, low-risk standard changes; one bank made over five million ICT changes in 2025 while cutting its failure rate. — [The Asian Banker, 3 June 2026](https://www.theasianbanker.com/updates-and-articles/basel-committee-flags-change-management-failures-as-top-cause-of-ict-incidents-at-global-banks)
- **FFIEC DA&M 2024, V.C.1.** Examiner guidance acknowledges DevOps benefits ("more stable operating environments") and risks (errors propagated by automation) in the same paragraph. **[READ]** — [FFIEC DA&M 2024](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf)
- **PRA SS1/21 6.6.** More frequent operational change implies more frequent scenario testing. **[READ]** — [PRA SS1/21](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2021/ss121-march-22.pdf)
- **FCA "Implementing technology change" (2021)** and the Knight and TSB actions: see sibling notes. The FCA's earlier finding that IT change was the most common root cause of reported incidents (Oct 2017-Sep 2018, 20%) surfaced only as **[SNIPPET]**. — [Computer Weekly report](https://www.computerweekly.com/news/252453338/FCA-deeply-concerned-as-no-end-in-sight-for-IT-failures-in-banking)
- **US consent orders.** A search for OCC/Federal Reserve orders citing "change management" found none; Citi (2020), USAA (2019) and City National orders cite broader risk-management, data and IT deficiencies. **[SNIPPET]**; negative result from one search, not a database review. — [Banking Dive on Citi](https://www.bankingdive.com/news/citi-risk-management-data-governance-OCC-fed/586642/)

### Inferences

- An engineering manager should expect a supervisor's prior to be "change is the main source of outages". The argument that lands is therefore about failure rate and blast radius per change (canary, ramp, fast rollback), with evidence, not about speed.
- The Basel summary, if accurate at source, is the first international supervisory document found that reports high-volume automated standard change at large banks approvingly. It must be read in the original before being relied on.
- The DBS freeze shows the cost of getting it wrong under an expectations-based regime: remediation is discretionary and can halt delivery outright.

### Gaps

- No speech by FCA, PRA/Bank of England, OCC, Federal Reserve, MAS or APRA explicitly favouring or warning against continuous delivery was found. APRA CPS 234/CPS 230 and BaFin BAIT were not examined.
- Enforcement remediation terms (testing, staged rollout, rollback) for TSB and Knight are in the sibling notes; no additional enforcement text was read here.
- The BCBS report itself and the DBS independent review are unread.

---

## 5. Where the rules genuinely bite

### Takeaway

Several obligations constrain cadence or ownership regardless of pipeline quality: notice periods for external API changes, independent approval and QA expectations, CAB expectations in Singapore, post-change stress testing for market infrastructures, externally scheduled card-scheme releases, and supervisor-imposed freezes. Flags and ramps help with most of these (ship dark, enable on the mandated date) but do not remove them.

### Cited Findings

**(1) Regulatory and standard text:**

- **PSD2 RTS on SCA and common secure communication, Commission Delegated Regulation (EU) 2018/389, Art. 30(4).** **[TOOL, verbatim pieces]**. Changes to the technical specification of the access interface must be made available "not less than 3 months before the change is implemented", "except for emergency situations", which must be documented for the authority. Art. 30(5) requires a testing facility for third-party providers. — [EUR-Lex 32018R0389](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R0389)
- **DORA RTS Art. 17(2).** Central counterparties and central securities depositories must run "stringent testing by simulating stressed conditions" after significant changes, involving clearing members or other users as appropriate. **[TOOL]** — [EUR-Lex 32024R1774](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1774)
- **DORA RTS Art. 17(1)(b)** (independent approval) and **Art. 8(2)(b)** (production testing only as an approved, time-limited exception). **[TOOL]** — same source.
- **MAS TRM 7.5.3, 7.5.4, 5.8.2**: signed-off test results, a CAB, and an independent QA function. **[READ]** — [MAS TRM 2021](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)
- **PCI DSS v4.0 6.2.3.1**: for manual code review, a release-control approver who is neither author nor reviewer. **6.5.2**: after a "significant change", applicable PCI requirements must be confirmed in place and documentation updated. **[READ]** — [PCI DSS v4.0](https://www.pcisecuritystandards.org/documents/PCI-DSS-v4_0.pdf)
- **FFIEC DA&M**: independent testing, independent quality management, no developer access to production repositories, off-peak deployment preference. **[READ]** — [FFIEC DA&M 2024](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf)
- **PCAOB AS 2201 .B31-.B33**: frequent change to programs containing automated financial controls weakens the benchmarking shortcut, so auditors may re-test those controls more often. **[READ]** — [PCAOB AS 2201](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201)
- **Supervisory freezes**: MAS's six-month pause on DBS non-essential IT change. **[TOOL]** — [MAS media release](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs)

**(3) Industry and vendor material:**

- **Card-scheme release windows.** Visa's "VisaNet Business Enhancements" major releases fall in April and October and carry dated mandates for acquirers and issuers; processors publish per-release certification status (e.g. Marqeta lists certification for the April 2026 release). **[SNIPPET]** from processor documentation, not Visa's rules; nothing found for Mastercard. — [Marqeta card network certifications](https://www.marqeta.com/docs/developer-guides/card-network-certifications); [Visa merchant news digest](https://www.visa.com/en-us/resources/visa-merchant-business-news-digest)
- **FCA review (sibling notes):** larger firms said regulatory changes are hard to split "due to varying specifications and hard deadlines".

### Inferences

- External-interface changes (open-banking APIs, scheme message formats) are calendar-bound by rule; internal behaviour behind a stable interface is not. This is the natural boundary for where ramping applies freely.
- In MAS-supervised entities the realistic design is to keep a CAB that approves change models, pipeline controls and exceptions, and to treat automated test evidence as the "signed off" result. This is an inference; MAS does not say delegation or pre-approval satisfies 7.5.4.
- "Developers test their own code" and "developers deploy their own code" both need an explicit compensating-control story (independent reviewer, automated independent test suites owned or governed outside the team, pipeline as release manager) to sit within FFIEC and MAS wording.

### Gaps

- **SR 11-7 / OCC 2011-12 (model risk management)** could not be retrieved (three URLs returned 404); no claim is made about validation-before-use or model change control. This needs a direct read before the essay discusses pricing or credit models.
- SEC Regulation SCI (systems-change notification for market infrastructure), scheme rulebooks themselves, peak-period change-freeze practices, and client-notification clauses in commercial contracts were not researched.
- No source quantifies how much of a typical bank's change volume falls under these externally timed obligations.
