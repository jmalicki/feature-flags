# Empirical and regulated-industry evidence on replacing heavyweight pre-release controls with small changes, automated evidence and progressive exposure (c. 2010-2022)

Reading-status key used throughout:

- **[FULL]** = I extracted and read the document text myself (PDF converted to text, or raw page HTML). Quotations marked [FULL] were read on the page.
- **[TOOL]** = page read through a fetch tool that returns a model-written extraction. Substance is reliable, but quotations are relayed by the tool and were not re-read by me character by character. Re-check before printing.
- **[SNIPPET]** = only a search-result snippet or abstract was seen. Do not quote; treat as a lead.
- **[NOT READ]** = could not be accessed (paywall, 403, login-gated video). Listed so the writer knows it exists.

Page locators for the State of DevOps reports are PDF page numbers (for the 2019 report these coincide with the printed page numbers).

Items already in the existing dossier (headline performance categories for 2014/2016/2018, ING, Capital One/Bruce 2018, Stripe, Adyen 2018, Monzo 2022) are deliberately not repeated.

---

## 1. DORA / State of DevOps / Accelerate: change approval, culture, trunk-based development, testing, deployment pain, leadership

### Takeaway

Across 2014-2019 the survey programme consistently found that external change approval (CAB or senior-manager sign-off) is associated with worse throughput and no better change-failure rate, while peer review, trunk-based development, test automation, a generative/psychologically safe culture and supportive leadership are associated with better delivery performance. All of it is cross-sectional, self-reported, snowball-sampled survey evidence analysed for "inferential prediction"; none of it is an experiment, and the 2017 and 2018 reports themselves contain cautionary findings about teams that sped up without building quality in.

### Cited Findings

**2014 report - change approval (the original finding):**

- Source: Puppet Labs, IT Revolution Press, ThoughtWorks (authors per the 2019 report's citation: Velasquez [Forsgren], Kim, Kersten, Humble), *2014 State of DevOps Report*, June 2014. [FULL]. Sample: "more than 9,200 survey responses", 110 countries, survey fielded December 2013 (PDF pp. 3, 6). — [2014 State of DevOps Report PDF](https://dora.dev/publications/pdf/state-of-devops-2014.pdf)
- PDF p. 18, "Top 5 predictors of IT performance", first item "Peer-reviewed change approval process": when external approval (e.g. change approval boards) was required to deploy to production, IT performance decreased; when the technical team held itself accountable through peer review, performance increased. External approval had no effect on restore time and a negligible effect on reducing failed changes. Exact quote [FULL]: "external change approval boards had a big negative impact on throughput, with negligible impact on stability." — [2014 report](https://dora.dev/publications/pdf/state-of-devops-2014.pdf)
- PDF p. 16: developers breaking large features into small incremental changes and merging daily into trunk are "strongly correlated with both IT and organizational performance" [FULL]. — [2014 report](https://dora.dev/publications/pdf/state-of-devops-2014.pdf)
- PDF p. 21-23: culture measured with Westrum's typology (pathological / bureaucratic / generative); culture reported as one of the top predictors of organizational performance. The report quotes Westrum that after failures pathological climates scapegoat, bureaucratic ones "seek justice", and generative ones look for the systemic problem. — [2014 report](https://dora.dev/publications/pdf/state-of-devops-2014.pdf)
- PDF pp. 4, 12: job satisfaction reported as the No. 1 predictor of organizational performance. — [2014 report](https://dora.dev/publications/pdf/state-of-devops-2014.pdf)
- Jez Humble's launch post summarises the same finding (external change approval such as a CAB, as opposed to peer review, significantly impacts throughput while doing almost nothing for stability). [TOOL] — [Humble, "The 2014 State of DevOps Report is here", 2014-06](https://continuousdelivery.com/2014/06/the-2014-state-of-devops-report-is-here/)
- Limits: self-selected online survey of people reachable through DevOps-vendor channels; perception measures; correlation/regression only. The 2014 report does not give effect sizes for the approval finding.

**Accelerate (book, 2018) - ch. 7 change approval and ch. 4 test ownership:**

- Source: Forsgren, Humble, Kim, *Accelerate: The Science of Lean Software and DevOps*, IT Revolution, March 2018. **[SNIPPET] - I could not access the book text, so I cannot give verified page numbers or quotations.** Secondary summaries agree that ch. 7 (management practices) reports four approval regimes tested on the 2014 data: (1) all production changes approved by an external body, (2) only high-risk changes approved externally, (3) peer review, (4) no approval process; that external approval was negatively correlated with lead time, deployment frequency and restore time and uncorrelated with change-fail rate; and that the book concludes external approval is "worse than having no change approval process at all" (phrase as relayed by secondary sources, not verified against the book). — [study-notes summary of ch. 7](https://study-notes-dge.pages.dev/engineering-practices/accelerate/chapters/ch07-management-practices); [Octopus (vendor) "Change Advisory Boards Don't Work"](https://octopus.com/blog/change-advisory-boards-dont-work)
- Test ownership (book ch. 4, technical practices; again [SNIPPET]): secondary quotations say that developers primarily creating and maintaining acceptance tests predicts IT performance, and that automated tests primarily created and maintained by QA or an outsourced party are not correlated with IT performance; the book's stated explanation is that code becomes more testable and developers invest more in tests they own. — [gist of Accelerate Appendix A](https://gist.github.com/iftheshoefritz/835ba4b907db87bdafd7f7ed09d8df3a); [dev.to discussion quoting the passage](https://dev.to/jhall/do-your-developers-write-tests-ao5)
- Corroboration that these were actual survey items [FULL, slide text]: Forsgren's LISA 2016 slides (PDF pp. 22-23) list the candidate test-practice items, including "Developers primarily create & maintain acceptance tests", "QA primarily create & maintain acceptance tests", "Primarily created & maintained by outsourced party", and "Test failures are likely to indicate a real defect". The slide text I extracted does not itself show which items were significant. — [Forsgren, LISA16 slides](https://usenix.org/sites/default/files/conference/protected-files/lisa16_slides_forsgren.pdf)
- Limits: the test-ownership result is about who writes automated acceptance tests, not about whether testers should exist. It is one survey year's correlation.

**2015 report - deployment pain, burnout, managers:**

- Source: Puppet Labs & IT Revolution, *2015 State of DevOps Report*. [FULL]. 4,976 completed responses (PDF p. 7). — [2015 report PDF](https://dora.dev/publications/pdf/state-of-devops-2015.pdf)
- PDF p. 26: new "deployment pain" construct. The more painful deployments are, the poorer the IT performance, organizational performance and culture; painful deployments go with higher change-fail rates; deployment pain is predicted by comprehensive test and deployment automation, CI including trunk-based development, and version control of everything. Listed countermeasures begin with "Do smaller deployments more frequently (i.e., decrease batch sizes)" [FULL]. — [2015 report](https://dora.dev/publications/pdf/state-of-devops-2015.pdf)
- PDF p. 5: "where code deployments are most painful, you'll find the poorest IT performance, organizational performance and culture" [FULL]. — [2015 report](https://dora.dev/publications/pdf/state-of-devops-2015.pdf)
- PDF pp. 30-32: burnout most strongly correlated with pathological culture, deployment pain, and ineffective team leaders (among five factors). Advice to managers: foster a blame-free environment, ask teams what makes deployments painful and fix those things, give time to experiment, and give employees authority over decisions affecting their work. — [2015 report](https://dora.dev/publications/pdf/state-of-devops-2015.pdf)
- PDF p. 24: for "large, regulated, slow-moving organizations", the measures most correlated with a generative culture include organizational investment in DevOps, experience/effectiveness of team leaders, continuous delivery practices, and deployment pain. PDF p. 3 key finding: "IT managers play a critical role in any DevOps transformation." — [2015 report](https://dora.dev/publications/pdf/state-of-devops-2015.pdf)

**2016 report - trunk-based development, code freezes, test data, unplanned work:**

- Source: Puppet & DORA, *2016 State of DevOps Report*. [FULL]. — [2016 report PDF](https://dora.dev/publications/pdf/state-of-devops-2016.pdf)
- PDF pp. 30-31: branches/forks with lifetimes under a day, fewer than three active branches, and merging to trunk daily all contribute to higher performance; "Teams that don't have code freeze periods (when people can't merge code or pull requests) also achieve higher performance" [FULL]. The report calls trunk-based development "still controversial". — [2016 report](https://dora.dev/publications/pdf/state-of-devops-2016.pdf)
- PDF p. 29: teams with adequate test data for automated tests, creatable on demand, show better IT performance, lower change-failure rates, less deployment pain and rework. — [2016 report](https://dora.dev/publications/pdf/state-of-devops-2016.pdf)
- PDF pp. 26, 41: unplanned work/rework used as a proxy for quality: high performers 49% new work / 21% unplanned work or rework; low performers 38% / 27%; medium performers reported more rework (32%) than low performers. — [2016 report](https://dora.dev/publications/pdf/state-of-devops-2016.pdf)

**2017 report - transformational leadership, automation of change approval:**

- Source: Forsgren, Humble, Kim, Brown, Kersten (Puppet + DORA), *2017 State of DevOps Report*. [FULL]. — [2017 report PDF](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- PDF pp. 6, 14-16: five dimensions (vision, inspirational communication, intellectual stimulation, supportive leadership, personal recognition; model from Rafferty & Griffin 2004) are "highly correlated with IT performance"; teams whose leaders were in the bottom third were "half as likely to exhibit high IT performance" [FULL]. — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- PDF p. 17: leadership is not sufficient. Teams with leaders in the top 10% showed variation in performance: "leaders cannot achieve DevOps outcomes on their own" [FULL]; success also depends on architecture, technical practices and lean management. PDF p. 18: leaders act "indirectly, by enabling teams to re-architect their systems and implement continuous delivery and lean management practices." — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- PDF p. 13: leaders matter because they hold authority and budget and can "change the incentives of entire groups of engineers, whether they are in development, QA, operations, or information security" (paraphrase close to text). — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- PDF p. 26: high performers reported having automated 33% more configuration management, 27% more testing, 30% more deployments and 27% more of their change approval processes than low performers. — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- PDF pp. 40-41: high performers' branch life and integration typically last hours, low performers' days. — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)

**2018 report - items beyond the headline categories:**

- Source: Forsgren, Humble, Kim (DORA), *Accelerate: State of DevOps 2018*. [FULL]. Nearly 1,900 respondents (PDF p. 5). — [2018 report PDF](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)
- PDF p. 16, "Misguided performers suffer from cautious approach": a cluster that releases infrequently and uses the time for testing and quality checks achieves a better change-fail rate than low performers but reports the longest time to restore service; PDF p. 44 adds this cluster reports the highest use of outsourcing and downtimes of "one to six months". Quote [FULL]: "releasing code infrequently can be an effective strategy" is presented as what such organizations claim, and the report concedes "For the most part, they achieve that goal." — [2018 report](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)
- PDF p. 29: J-curve. Medium performers report more manual work than low performers in testing and change approval (statistically significant; same pattern in 2017 for deployment and change approval). — [2018 report](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)
- PDF p. 53: continuous delivery "significantly contributes to reductions in deployment pain and burnout". — [2018 report](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)

**2019 report - heavyweight change process, clear change process, segregation of duties, psychological safety:**

- Source: Forsgren, Smith, Humble, Frazelle (DORA / Google Cloud), *Accelerate: State of DevOps 2019*. [FULL]. "almost 1,000" respondents; stated 3% margin of error assuming 23 million software professionals (p. 7). — [2019 report PDF](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 6 (executive summary): "Heavyweight change approval processes, such as change approval boards, negatively impact speed and stability." [FULL] — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 50: formal processes requiring approval by an external body such as a CAB or a senior manager for significant changes have a negative impact on software delivery performance; respondents were "2.6 times more likely to be low performers" if their organization had such a process. The authors tested whether more formal approval was associated with lower change-fail rates and "found no evidence to support this hypothesis, consistent with earlier research" (footnote to the 2014 report) [FULL]. — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- pp. 50-51: they also tested, and report support for, the hypothesis that more approvals produce a slower process and larger, less frequent batches with higher change-fail rates. Quote [FULL]: "Organizations often respond to problems with software releases by introducing additional process and more heavyweight approvals. Analysis suggests this approach will make things worse." — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 51 recommendation: move away from external change approval; "shift left" to peer-review approval during development plus automation (continuous testing, CI, monitoring/observability) to detect and correct bad changes early. Sidebar: the CAB's role should move from gatekeeper to "process architect and information beacon", handling cross-team notification/coordination and business trade-off decisions. — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 52, "Clear change process": respondents with a clearly understood approval process were "1.8 times more likely to be in elite performers"; "simply doing a better job of communicating the existing process" helps [FULL]. Also: "change management is consistently one of the biggest constraints" in the authors' work with large organizations, and "only managers have the power to influence and change certain levels of organizational policy." — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- pp. 48-49, segregation of duties: acknowledges regulatory control "particularly in financial services, healthcare, and government"; cites PCI-DSS and NIST RMF as examples (fn. 21); argues the intent (no individual has end-to-end control) can be met by requiring every change to be approved by another team member at code review (or pair programming), recording author and authenticated approval events in version control, optionally with automated thresholds that bound changes. — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 19: "We found no evidence that industry has an impact with the exception of retail", which the authors read as showing "highly regulated industries such as financial services and government" can achieve high performance; enterprises >5,000 employees are lower performers, attributed to "heavyweight process and controls" and tightly coupled architecture [FULL]. Financial services was 12% of respondents (p. 11). — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 25: elite lead time slipped from under an hour (2018) to between an hour and a day (2019); the authors speculate this "may reflect the trend in more heavyweight code review and approval processes". — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- pp. 31, 54: culture measured with Google's Project Aristotle items; "culture of psychological safety is predictive of software delivery performance, organizational performance, and productivity"; the model diagram shows heavyweight change process with a negative path and burnout as an outcome. — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- p. 42: "trunk-based development with frequent check-in to trunk and deployment to production is predictive of performance outcomes." — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- DORA's current capability page restates the 2019 findings and the peer-review-for-segregation-of-duties argument. [TOOL] — [DORA, "Streamlining change approval"](https://dora.dev/capabilities/streamlining-change-approval/)

**Stated methodological limits (2019 p. 77; same text in 2018 p. 72)** [FULL]

- "This study employs a cross-sectional, theory-based design" ("inferential predictive"), used "when purely experimental design is not possible". — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- No master list of the population; snowball sampling via email lists, promotions and social media; "Our sample is likely limited to organizations and teams that are familiar with DevOps, and as such, may be doing some of it." — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- Constructs are Likert-type perception items answered by one respondent about their team; the four key metrics are self-reported bands, not telemetry. (Method description, 2019 p. 77.) — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)

### Inferences

- The reports' "predictive" language is statistical (theory-driven regression/PLS on cross-sectional data), not causal in the experimental sense. An essay should say "associated with" or "predicts in the survey models", and should not claim a CAB causes failures.
- Reverse causation and confounding are live: organizations with fragile, tightly coupled systems may both keep CABs and perform poorly. The 2019 report itself names coupled architecture alongside heavyweight controls for enterprise underperformance (p. 19).
- The most defensible version of the change-approval claim is narrow and has been stable for five years: external approval shows no detectable stability benefit in these surveys and a clear throughput cost. The stronger claim ("makes things worse", 2019 p. 51) rests on a batch-size mechanism the authors hypothesised and report as supported.
- The 2019 report does not say "abolish change management"; it says make the process clear, move approval to peer review plus automation, and repurpose the CAB to coordination. That is a management redesign task, which matches the essay's manager-facing thesis.
- The 2018 "misguided performer" cluster is the closest thing in DORA to the audience's soak-and-release-train posture: slightly better change-fail rate than low performers, worst recovery. It is an honest two-sided data point: caution buys something on failure rate and costs heavily on recovery.
- Wording oddity to avoid repeating: 2019 p. 50 says earlier research "found that heavyweight change approvals process were negatively correlated with change failure rates"; the 2014 text actually says negligible effect on failed changes. Cite the 2014 wording.

### Gaps

- Accelerate book page numbers and verbatim wording for ch. 4 and ch. 7 were not verified (book text not accessible). Everything attributed to the book above is from secondary snippets.
- Forsgren & Humble's peer-reviewed/working papers were not accessed. From background knowledge (unverified in this session) the relevant ones are "The Role of Continuous Delivery in IT and Organizational Performance" and "DevOps: Profiles in ITSM Performance and Contributing Factors" (both Western Decision Sciences Institute 2016, on SSRN). A search did not surface the texts; do not cite specifics from them without retrieval.
- None of the reports publishes coefficients, confidence intervals or raw data for the change-approval findings; the 2.6x and 1.8x figures are odds-style comparisons without published intervals.
- No DORA analysis isolates financial-services respondents for the CAB finding; the "industry does not matter" statement (2019 p. 19) is about overall performance, with financial services only 12% of roughly 1,000 respondents.

---

## 2. Regulatory compatibility: first-person accounts from banks, trading firms, payments and other regulated organizations

### Takeaway

The documented pattern in regulated firms is "automate the evidence and keep four-eyes": peer review, pipeline-enforced gates, restricted production access, automatically generated change records and immutable audit logs replaced manual CAB sign-off, usually after negotiation with internal audit and risk. Honest scorecard: most accounts in 2012-2019 document pipeline automation and control redesign only; explicit canary/flag/progressive-exposure evidence in regulated finance is thin before roughly 2020 (Nubank, Wise, later JPMorgan), and several celebrated examples (LMAX, IG, Starling) retained scheduled releases or human approval steps.

### Cited Findings

**Scorecard: what each account actually documents:**

| Organization | Source type / status | Pipeline automation & control redesign | Canary / flags / progressive exposure | Manual gate retained |
| --- | --- | --- | --- | --- |
| Etsy (PCI-DSS) | Reported conversation, 2012 [TOOL] | Yes | Not in this source | Ticket for every change; separate QA and production "pusher" roles |
| Capital One | First-person posts/slides 2016-2018 [TOOL] | Yes (16 gates; automated change order; clean-room pipeline) | "Feature toggle" and "zero downtime release" named as gates only; no canary | Peer review; break-glass access |
| Barclays | Conference report 2016 [FULL news text] | Control redesign ("control tribes") | Not documented | Not specified |
| Starling Bank | First-person panel 2019 [TOOL]; blog 2025 [TOOL, out of period] | Yes | Not mentioned in either | Four-eyes permission via Slack; later a three-layer approval including business approval |
| Paybase, Habito (FCA-authorized) | First-person panel 2019 [TOOL] | Yes | Rolling updates with health checks (Paybase); canary "not yet" (Habito) | Change control and audit trail |
| LMAX | Secondary description, 2016 [TOOL] | Yes (10,000+ tests per commit) | Not documented | Fortnightly Saturday release outside trading hours |
| IG Group | First-person slides 2015 [TOOL] | Yes | "Dark" environment flip; feature flags listed; no canary | Manual stop in pipeline; regulators' change-control evidence |
| OANDA | Peer-reviewed first-person paper 2016 [FULL] | Yes | Describes staged 1% exposure and dark launches as tools | Release engineering team; white-label bank clients forbade CD |
| Nubank | Foundation case study 2020 [TOOL] | Yes | Canary deployments stated | Not specified |
| Wise | Engineering blog 2022 [SNIPPET] | Yes | Mandatory canary step, automatic rollback | Not specified |
| Nationwide | Trade press [SNIPPET] | Compliance-vetted pipelines | Not documented | Unclear |
| Macquarie | Engineering blog [NOT READ] | Title indicates SoD argument | Unknown | Unknown |
| JPMorgan | Blog 2023 [SNIPPET, out of period] | Yes | Canary testing and feature toggles mentioned | Unknown |
| HSBC, Goldman Sachs, BBVA, Square/Block, PayPal | Nothing usable found | - | - | - |

**Etsy - PCI-DSS with continuous deployment:**

- Source: Jez Humble, "PCI-DSS and continuous deployment at Etsy", continuousdelivery.com, 11 July 2012. Reported from a conversation with Michael Rembetsy (Etsy operations engineering) at DevOpsDays Mountain View; not Etsy's own write-up. [TOOL] — [Humble 2012](https://continuousdelivery.com/2012/07/pci-dss-and-continuous-deployment-at-etsy)
- Evidence: Etsy built a separate, segmented PCI environment for payment systems; the deployment process mirrors the non-PCI one with more logging of who did what when; distinct "QA pusher" and "production pusher" roles; developers have no production database access but work alongside DBAs and get read-only production logs; every change goes through a ticketing system yet a normal change can go from dev to production in under an hour. Quotes as relayed [TOOL]: "we built a whole separate Etsy, essentially"; "Segregation of duties doesn't mean people can't talk to each other." — [Humble 2012](https://continuousdelivery.com/2012/07/pci-dss-and-continuous-deployment-at-etsy)
- Limits: short informal interview; no auditor statement, no mapping to PCI requirements, no outcome data. It shows scope reduction (isolating the regulated system) as the main strategy, which is less available to a firm whose whole estate is regulated.

**Capital One - pipeline gates, automated change orders, governance:**

- Source: Tapabrata "Topo" Pal, "Focusing on the DevOps Pipeline", Capital One Tech. The capitalone.com copy is dated 16 May 2018 [TOOL]; the brief refers to it as a 2017 post (the Medium copy may carry the earlier date; I could not confirm). — [Pal, Capital One Tech](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/); [Medium copy](https://medium.com/capital-one-tech/focusing-on-the-devops-pipeline-topo-pal-833d15edf0bd)
- The 16 gates as listed [TOOL]: source code version control; optimum branching strategy; static analysis; >80% code coverage; vulnerability scan; open source scan; artifact version control; auto provisioning; immutable servers; integration testing; performance testing; build deploy testing automated for every commit; automated rollback; automated change order; zero downtime release; feature toggle. Quote as relayed: "We've worked with our auditors and risk compliance office to understand how the process can be improved and fully automated." — [Pal, Capital One Tech](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/)
- Limits: "feature toggle" and "automated rollback" appear only as gate names; no canary or percentage rollout is described; no incident data.
- Source: Topo Pal, "DevOps at Capital One", DevOps Enterprise Summit San Francisco 2016, slides (IT Revolution on SlideShare). [TOOL, slide text and speaker notes; video not watched]. Slide 25: "Pipeline must have 16 gates". Slide 35 hypotheses: "If everything is source code, no one needs access to production"; a model of ~30 practices can satisfy audit and compliance; emergencies via "Break Glass". Speaker notes (slides 32-38) name the CAB and its pre-approval steps as the delay and describe a release tool that creates and approves a change order automatically; teams' progress against the gates is reported up to the CIO; teams choose which wait times to attack. — [Pal DOES16 slides](https://www.slideshare.net/ITRevolution/does-sfo-2016-topo-pal-devops-at-capital-one)
- Source: Jennifer Brady (technology governance director, ex-audit), "Governance in a DevOps Environment", Capital One Tech, 8 August 2018. [TOOL]. Three-lines-of-defense framing (developers own risk; governance sets and monitors policy; internal audit assures). Named controls: "two sets of eyes" peer review on all changes; least privilege with read-only production by default and time-limited just-in-time write access; logging all change events to detect unauthorized change; a "clean room" pipeline as the only path to production. Reports products deploying multiple times a day rose from about 20 in 2016 to "hundreds" in 2017. Quote as relayed: "Risk cannot be mitigated with typical 'CI/CD' automation alone." — [Brady 2018](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/)
- Limits: company-authored; no regulator or external-auditor confirmation; no canary/flag content.

**Barclays - control redesign:**

- Source: InfoQ news report of Jonathan Smart (head of development services, Barclays) at DevOps Enterprise Summit London, July 2016. [FULL, news text; talk not watched]. Smart described "control tribes" assigned to development epics at the start so security and compliance are built in "while minimizing elapsed time and formal controls", and argued for "descaling" into product teams with fewer handovers; scale given as 40+ countries and 130k employees. — [InfoQ 2016](https://www.infoq.com/news/2016/07/agile-devops-barclays/)
- A TechBeacon write-up (not retrievable: certificate error) is described in search results as saying Barclays was "leaning-out" its control framework and providing tools, shared services and automated tests for control compliance. [SNIPPET] — [TechBeacon](https://techbeacon.com/how-barclays-balances-speed-vs-control-devops)
- Limits: secondary reporting of a talk. The phrases "minimal viable compliance" and "safety teams" attributed to Smart / *Sooner Safer Happier* (2020) could not be verified in any accessible text.

**UK challenger banks and FCA-authorized fintechs - QCon London 2019 panel (transcript on page):**

- Source: "Bleeding Edge at Hyperspeed with No Breaks and No Breaches", QCon London 2019 panel, InfoQ (transcript). Panelists: Jason Maude (Starling), Suhail Patel (Monzo), Ana Calin (Paybase), Will Jones (Habito), Carolyne Quinn (R3). [TOOL; quotes relayed from the transcript]. — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)
- Maude (Starling): safer to "release code early, release code often"; approval is done by ChatOps: "we use Slack for people to gain permission in a four-eyes manner", giving an audit log without paper sign-off; regulation can be fulfilled "in a way that does not block you". — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)
- Calin (Paybase, PCI DSS): "we do deploy multiple times a day"; "Everything is change controlled, everything can be tracked, we have full audit"; relies on Kubernetes rolling updates gated by health checks. — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)
- Jones (Habito): canary rollouts need every change to be forward and backward compatible; Habito "hasn't made that shift yet"; they fail forward because rollbacks break against newer data. — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)
- Limits: conference panel, advocacy by participants, no data. Feature flags were not discussed.
- Starling, later retrospective (outside 2010-2022): Paul J Moore and Marcus Mak, "How we made everyone a release engineer", Starling Technology blog, 23 October 2025. [TOOL]. Multiple production releases a day; three approval layers: commit approval by the author in a prod-like DEMO environment, technical approval by nominated service experts for the batch, and business approval by an engineering lead, director and/or C-suite executive on timing; the portal is described as "our immutable audit of what software we release to production". Canary, gradual rollout and flags are not mentioned. — [Starling 2025](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer)

**LMAX (regulated FX venue):**

- Source: Jim Bird, "Introduction to DevOps for the financial industry", O'Reilly Radar, 13 April 2016 (excerpt of his report *DevOps for Finance*). Secondary description, not LMAX's own. [TOOL]. Quotes as relayed: "Releases to production are scheduled every two weeks, on a Saturday, outside of trading hours."; "more than 10,000 end-to-end tests are run on a test cluster". Operations pulls tagged builds into a separate secure production repository. — [Bird 2016](https://www.oreilly.com/content/introduction-to-devops-for-the-financial-industry/)
- Limits: describes exhaustive pre-release automated testing and a fixed fortnightly release, i.e. continuous delivery without continuous or progressive deployment. No first-person Farley text on regulators was retrieved.

**IG Group (multi-regulator trading firm):**

- Source: David Genn (IG), "Migrating to Continuous Delivery in the World of Financial Trading", JDD Krakow, October 2015, slides with speaker notes. [TOOL; talk not watched]. Slide 17 lists "Regulation / Auditors" as a challenge; notes say regulators want proof of the process controlling change to each environment and that the team must work with that process. Slide 32: deploy to a "dark" environment, automated tests, a manual stop, then "Flip dark to light". Slide 34: "Feature flags". Notes 43: state at the time was "1-3 deploys per week during core hours". Slide 40: "Embrace bureaucracy". — [Genn 2015 slides](https://www.slideshare.net/DavidGenn/continuous-delivery-krakow-jdd-2015)
- Limits: one team's slides; no canary; no outcome data.

**OANDA (FX trading) - see section 3, Savor et al. 2016.** Relevant here: OANDA's bank white-label clients' policies "did not allow continuous deployment", producing releases of thousands of changes and slower fixes for the same code base. [FULL] — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)

**Nubank:**

- Source: CNCF case study "Nubank", published 10 July 2020 (foundation-authored, promotional for Kubernetes). [TOOL]. Claims 700 deployments a week and production deployment time cut from 90 to 15 minutes. Renan Capaverde (director of engineering), as relayed: "With Kubernetes and canary deployments, it's easier to roll back a change because it's also faster to deploy." — [CNCF Nubank case study](https://www.cncf.io/case-studies/nubank/)
- Conflict: the accompanying CNCF blog title says "200 times a week". Use the figures with that caveat. — [CNCF blog 2020](https://www.cncf.io/blog/2020/07/10/how-kubernetes-empowered-nubank-engineers-to-deploy-200-times-a-week/)
- Limits: no description of canary mechanics, regulator interaction (Brazilian central bank) or change-approval design.

**Wise (TransferWise):**

- Source: Wise Engineering, "State of our CI/CD pipeline (Part 2)", Medium, 2022. [SNIPPET only; page returned 403]. Snippet describes an internal deployment tool supporting canary releasing and a managed pipeline template with a "mandatory canary step, default canary config, automatic rollback, safety checks". — [Wise Engineering 2022](https://medium.com/wise-engineering/state-of-our-ci-cd-pipeline-part-2-29bd17515e6f)

**Nationwide Building Society:**

- Trade-press snippets say Nationwide built an automated approval process steering developers to pre-built Jenkins pipelines vetted by compliance, and that internal audit presented at DevOps Enterprise Summit 2020 on passing audit in a DevOps environment. [SNIPPET] — [InfoWorld, "Why FS is turning to DevOps"](https://www.infoworld.com/article/2260670/why-fs-is-turning-to-devops.html)

**Macquarie:**

- "DevOps and Segregation of Duties", Macquarie Engineering Blog (Medium). [NOT READ: 403]. Search snippet only says it argues pipeline automation minimizes human error. — [Macquarie Engineering](https://medium.com/macquarie-engineering-blog/devops-and-segregation-of-duties-ea4a7dcc7217)

**DORA's generic recipe for segregation of duties** (not first-person, but the reference pattern these firms follow): peer approval at code review, recorded with authenticated approval events in version control. [FULL] — [2019 report pp. 48-49](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)

### Inferences

- The recurring control substitution is: (a) four-eyes moved from a board to code review; (b) "who can change production" answered by "only the pipeline", with break-glass for emergencies; (c) the change ticket generated by the pipeline rather than typed by a human; (d) audit evidence produced as a by-product (logs, immutable release records). None of the accounts removes approval; they relocate and automate it.
- In every account where the process is described, audit/risk were engaged as design partners before the gate was removed (Capital One, Barclays, Etsy). That is a management action, not an engineering one.
- For the essay's specific claim (flags, canaries, ramped experiments instead of soak), 2012-2019 regulated-finance sources mostly do not support it directly; they support small batches plus automated gates. Progressive exposure in regulated finance is documented later and more thinly (Nubank 2020, Wise 2022, JPMorgan 2023). The essay should say so rather than imply early bank adoption of ramping.
- LMAX and Starling show that high-frequency or high-automation regulated shops still kept a human or calendar gate. That is useful as a credible intermediate state for a twice-weekly-train audience.

### Gaps

- No regulator-authored or external-auditor-authored confirmation that any named firm's automated controls were accepted for SOX, PCI, FCA/PRA, FFIEC or MAS purposes was found; all acceptance claims are the firms' own.
- Jonathan Smart's "minimal viable compliance" / safety-team material, Nationwide's and Barclays's DOES talks, and other IT Revolution videos are login-gated; not watched, not verified.
- No usable primary sources found for HSBC, Goldman Sachs, BBVA, Square/Block or PayPal on this topic. JPMorgan's relevant post is 2023 (outside the window) and was seen only as a snippet.
- Jez Humble's ACM Queue / CACM article "Continuous Delivery Sounds Great, but Will It Work Here?" (2017/2018), which addresses the "we're regulated" objection, returned 403 and was not read. — [ACM Queue](https://queue.acm.org/detail.cfm?id=3190610)
- Etsy's own "Continuously Deploying Compliance"-style talks were not located.
- No SOX-specific first-person account was retrieved.

---

## 3. Peer-reviewed and industry studies on continuous deployment, experimentation and quality

### Takeaway

The academic literature supports "frequent small releases need not reduce quality" in a small number of well-instrumented cases (Facebook, OANDA, Firefox) and repeatedly identifies management support, architecture, test automation and domain/customer constraints as the binding obstacles. It also shows that progressive exposure is far less common and far less rigorous in ordinary companies than in the famous exemplars: in one survey 63% used no canary/dark-launch/gradual-rollout practice at all, and canary health was typically judged by intuition.

### Cited Findings

**Savor, Douglas, Gentili, Williams, Beck, Stumm, "Continuous Deployment at Facebook and OANDA", ICSE Companion 2016, pp. 21-30.** [FULL, author-hosted PDF; locators are PDF pages of the 10-page paper] — [Savor et al. 2016 PDF](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)

- Definition (p. 1): updates kept small and isolated; released immediately after development and testing; "the decision to deploy is largely left up to the developers (without the use of separate testing teams)"; deployment fully automated.
- Data (pp. 4-5): Facebook commits 2008-mid 2014 and its SEV failure database; OANDA about 80 developers, over 20,000 deployments April 2010-June 2014 from its deployment management system. OANDA kept no failure database; critical failures were inferred by a heuristic (a redeploy within 48 hours).
- Quality (p. 6): at Facebook critical and medium-priority failures grew far more slowly than deployments; "Observation 3: The number of critical issues arising from deployments was almost constant regardless of the number of deployments."
- Trade-off acknowledged (p. 6): during roughly January 2009-July 2010 a productivity surge coincided with "a degradation in quality" measured by hotfixes; later quality efforts cost some productivity.
- Management (p. 6): OANDA's executive team changed twice. After engineering-background management was replaced in mid-2012 by executives inclined to traditional process, "the average number of deployments dropped by 23%", with the engineering team largely unchanged; it recovered under a later CD-supportive team.
- Prerequisites (p. 3): senior-management buy-in ("Without full support, the process can easily be subverted"), especially after a major failure when organizations "gravitate back to more traditional processes"; loosely coupled software; tooling investment.
- Progressive exposure tools named (p. 3): staged exposure to e.g. 1% of clients in one geography, increased as confidence grows and cut to 0% on problems (described under "blue-green deployments"); dark launches; staging/baking.
- Regulated-customer comparison (p. 7): OANDA white-labeled its trading system to several large banks whose "policies did not allow continuous deployment". Result: bugs the bank deemed non-critical went unfixed "for many months", new market-standard functionality arrived late, and each release bundled "thousands of changes", raising anxiety around deployment.
- Management role (pp. 7-8): managers "influence rather than operate within a chain of command" and must be respected technically; management should "systematically" reduce risk by funding tooling and keeping a no-blame culture; developers "should not be penalized for failures" from reasonable risks; objective retrospectives after serious failures are when culture is defined; a CD champion in senior management is "critical, especially for nontechnical management teams".
- Testing (pp. 6, 8-9): neither firm had a test team; both kept release engineering teams, and footnote 2 says a separate release team "is valuable when reliable software is important". Whether to have a separate test team is called "one of the more controversial questions". Both firms used pre-release populations as test systems: Facebook's internal beta and OANDA's virtual-money demo system with real clients.
- Costs (p. 7): tooling teams were about 5% of Facebook engineers and 15% at OANDA; 6-12 weeks of onboarding training; CD is harder for small firms.
- Stated limitations (p. 9): two companies only; "we can only hypothesize the root cause of our observations"; lessons are "fundamentally subjective".
- Limits beyond those stated: authors are insiders; OANDA failure data is a proxy; the bank white-label comparison is anecdotal, not measured; productivity is lines of code.

**Rossi, Shamma, Couder, Stumm et al., "Continuous Deployment of Mobile Software at Facebook (Showcase)", FSE 2016.** [FULL extract] — [Rossi et al. 2016 PDF](https://www.eecg.utoronto.ca/~stumm/Papers/Rossi-FSE-16.pdf)

- Android release cadence went from every 8 weeks to weekly over 4 years. Findings 4-5 (p. 8): shortening the cycle from 4 weeks to 2 (and 1 for Android) did not significantly change the relative number of cherry-picks and launch-blockers, and "does not appear to affect the crash rate".
- Progressive exposure is the mechanism (p. 4): staged Play Store rollout to 20%, then 50%, then 100% over three days with stability checks after each increase; daily alpha and frequent beta builds to external testers; alpha crash rate roughly 10x production (p. 9); Gatekeeper feature flags control feature availability.
- Retained controls: a contracted manual test team of about 100 for new features without automated tests (p. 6); code freeze before branch cut. Also (p. 3): changes pushed on the day of the release cut are of lower quality than those pushed on other days.
- Limits: one company, consumer mobile, normalized (hidden) absolute values, insider authors.

**Schermann, Cito, Leitner, Zdun, Gall, "We're Doing It Live: A Multi-Method Empirical Study on Continuous Experimentation", Information and Software Technology 99 (2018), 41-57.** [FULL extract of the authors' preprint; locators are preprint PDF pages] — [IST preprint PDF](https://www.ifi.uzh.ch/dam/jcr:01d34060-29fb-472e-a116-bd26c3b49f67/IST_preprint.pdf)

- Method (pp. 1, 5-8): 31 interviews with developers/release engineers from 27 companies plus a survey with 187 complete responses; open coding and statistics. Interviewee domains include insurance, e-government and mobile payment alongside web companies.
- Motivation (p. 1): knowledge of experimentation "is currently primarily based on well-known and outspoken industrial leaders", which may reflect "the peculiarities and needs of a few innovation leaders".
- Two kinds of experiment (pp. 12-13): regression-driven (canary, dark launch, gradual rollout, to catch defects and performance regressions) versus business-driven (A/B tests). Regression-driven ones last minutes to days, are run by single teams, and are interpreted "often intuitive and based on experience".
- Adoption (pp. 12-14): "63% of practitioners are not using any variant of regression-driven experimentation"; 23% had adopted A/B testing. Biggest obstacle for non-adopters: a software architecture that does not support it (64% for web products vs 48% others); for startups, too few users. Other reasons listed (p. 13 table): limited users, missing business value, lack of expertise.
- Canary rigor (p. 12): interviewees had no strict rules or thresholds; health assessment was iterative and "primarily based on intuition"; canaries were more often reserved for changes considered critical than applied to all changes. Non-web products used manually administered early-access pilots with friendly customers, typically not systematically monitored.
- Feature toggles (pp. 9-10): the most frequently named implementation technique, but with debt: one company found maintaining and testing 150 toggles infeasible ("state explosion"), had issues when "someone inadvertently flipped a flag and reactivated dead code", and then capped concurrent toggles. Toggle use 45% for web products vs 25% for others.
- Organization (p. 11): developer on call is the main risk-mitigation practice (74% at startups, 45% in larger corporations); traditional borders between development, QA and operations "seem to vanish progressively".
- Stated threats (pp. 6-7): interviewees recruited via personal networks and snowballing; survey self-selection toward people interested in CD; self-reporting may idealize.
- Limits: no outcome measures (incidents, quality); regulated domains not analysed separately; 2015-2016 data.
- Earlier version: Schermann, Cito, Leitner, Zdun, Gall, "An empirical study on principles and practices of continuous delivery and deployment", PeerJ Preprints 4:e1889v1, March 2016 (20 interviews, same 187-response survey). [SNIPPET: abstract only; PDF returned 403]. Abstract's headline: "architectural issues are currently one of the main barriers for CD adoption". — [PeerJ preprint](https://peerj.com/preprints/1889)

**Shahin, Babar, Zhu, "Continuous Integration, Delivery and Deployment: A Systematic Review on Approaches, Tools, Challenges and Practices", IEEE Access 5 (2017).** [FULL extract of arXiv version; locators are arXiv PDF pages] — [arXiv 1703.07019](https://arxiv.org/pdf/1703.07019)

- Method (p. 1): systematic review of 69 peer-reviewed papers, 2004 to 1 June 2016, thematic analysis.
- Challenges synthesized (pp. 13-17): lack of awareness and transparency; lack of suitable tools; cost and investment; "More pressure and workload for team members" (one primary study found moving from six-month to continuous release noticeably increased developer and release-team workload); inability to automate all tests (infrastructure, effort to automate manual tests, hardware dependencies); "Difficulty to change established organizational polices and cultures"; team dependencies; dependencies on legacy applications; customer environment and customer preference.
- Domain and customer constraints (p. 17): "A software system's domain is a significant factor" for continuous deployment; web applications adopt frequent deployment more than telecom and medical systems; one study could not apply continuous deployment to safety-critical systems; customer policy may forbid it (citing Savor's banks).
- Limits: a review of mostly qualitative case studies; 38 of 69 papers did not state an application domain (p. 8); no meta-analysis of outcomes; finance is represented essentially by the OANDA paper.

**Leppänen, Mäkinen, Pagels, Eloranta, Itkonen, Mäntylä, Männistö, "The Highways and Country Roads to Continuous Deployment", IEEE Software 32(2), 2015, pp. 64-72.** [SNIPPET: abstract and secondary characterisation; the lead author's thesis confirms study design] — [abstract record](https://lobakmerak.netlify.app/host-https-ui.adsabs.harvard.edu/abs/2015ISoft..32b..64L); [Leppänen thesis, pp. 17-21](https://trepo.tuni.fi/bitstream/10024/115307/1/lepp_nen_1452.pdf)

- Interviews at 15 (Finnish) ICT companies in 2014. None had a fully automatic deployment pipeline; companies' capability to deploy exceeded what they practiced. Obstacles named in the abstract: domain-imposed restrictions, resistance to change, customer desires, and developers' skill and confidence. Shahin et al. summarise it as showing domain constraints change deployment frequency and method (e.g. calendar-based deployment). — [arXiv 1703.07019, p. 17](https://arxiv.org/pdf/1703.07019)
- Limits: 15 companies in one country; I did not read the article body.

**Claps, Berntsson Svensson, Aurum, "On the journey to continuous deployment: Technical and social challenges along the way", Information and Software Technology 57 (2015), 21-31.** [SNIPPET: abstract] — [Chalmers record](https://research.chalmers.se/en/publication/209079)

- Single-company exploratory case study with semi-structured interviews; identifies 20 adoption challenges, 9 technical and 11 social; mitigations reduced severity but sometimes created new challenges; most challenges were interdependent. The case company is not named in the abstract.
- Limits: one company; individual challenges not verified from full text.

**Olsson, Alahyari, Bosch, "Climbing the 'Stairway to Heaven'", Euromicro SEAA 2012, pp. 392-399.** [SNIPPET: abstract] — [Chalmers record](https://research.chalmers.se/en/publication/168535)

- Multiple-case study, interviews at four software companies, on barriers in moving from agile development toward continuous deployment. Specific barriers not verified from full text.

**Rahman, Querel, Rigby, Adams, "Feature toggles: practitioner practices and a case study", MSR 2016, pp. 201-211.** [SNIPPET: only secondary descriptions] — [bibliographic record](https://bibtex.github.io/MSR-2016-RahmanQRA.html)

- Secondary sources say the Chrome case study found toggles support rapid release and trunk-based development but many toggles are long-lived and create maintenance debt, prompting cleanup campaigns. Schermann et al. cite it for toggle technical debt (IST preprint p. 10). — [IST preprint](https://www.ifi.uzh.ch/dam/jcr:01d34060-29fb-472e-a116-bd26c3b49f67/IST_preprint.pdf)

**Khomh, Dhaliwal, Zou, Adams, "Do Faster Releases Improve Software Quality? An Empirical Case Study of Mozilla Firefox", MSR 2012.** [FULL: abstract and research-question summary, pp. 1-2] — [Khomh et al. 2012 PDF](https://swat.polymtl.ca/~foutsekh/docs/Khomh-MSR-2012.pdf)

- Compares Firefox versions before and after the 2011 move from long cycles to 6-week rapid releases, using crash, bug and uptime data. Abstract [FULL]: with shorter cycles "users do not experience significantly more post-release bugs", "bugs are fixed faster", yet "users experience these bugs earlier during software execution (the program crashes earlier)". Median uptime was significantly lower for rapid-release versions (p. 2).
- Limits: one open-source desktop product; 6-week cycles are slow by CD standards; observational before/after design.

**Mäntylä, Adams, Khomh, Engström, Petersen, "On rapid releases and software testing: a case study and a semi-systematic literature review", Empirical Software Engineering 20(5), 2015, 1384-1425.** [SNIPPET: abstract] — [author PDF](https://mcislab.github.io/publications/2015/emsemika.pdf)

- 312,502 execution runs of 1,547 mostly manual system-level Firefox test cases, 2006-2012. Rapid releases have a narrower test scope enabling deeper investigation of the highest-risk features and regressions; testing becomes more continuous but also more deadline-oriented, with reduced test-suite diversity and a harder time sustaining a large testing community. The review part concludes empirical evidence for claimed advantages and disadvantages of rapid releases is scarce.

### Inferences

- The best quantitative evidence that speed need not cost quality comes from organizations that also had staged exposure, dogfooding/alpha populations, strong tooling investment and supportive management. The evidence is for the bundle, not for frequency alone.
- Both Facebook papers and the OANDA account retained a pre-production or limited-exposure population (internal beta, demo system, alpha/beta channels). That is "soak" reimplemented as exposure to real users under monitoring rather than elapsed time in a test environment; it supports the essay's substitution argument, but also shows nobody credible ships to 100% unobserved.
- Management appears as an independent variable in a natural experiment exactly once (OANDA's executive changes, -23% deployments). It is one firm and uncontrolled, but it is the most direct published evidence that management stance alone moves delivery behaviour.
- Schermann et al. is a corrective for an essay audience: ordinary firms that adopt canaries often run them informally. If canaries replace soak, the essay should call for explicit health criteria and automated analysis, because the literature shows that is where practice is weak.
- The feature-flag hazard (flag debt, accidental reactivation of dead code) is documented in research (Schermann; Rahman) and in a regulated-industry enforcement case (Knight, section 5). Flag lifecycle management must be part of the proposal.
- Across the reviews, obstacles are consistently more organizational and architectural than about test technique: culture/policy change, team dependencies, customer or domain constraints, and incomplete test automation.

### Gaps

- No peer-reviewed study was found that measures incident or defect outcomes before and after replacing a soak period or release train with canary/flag-based ramping in a financial firm.
- Leppänen, Claps, Olsson and Rahman were not read in full; their specific findings on management and testing obstacles should be retrieved before detailed citation.
- Savor et al.'s quality data for OANDA is a redeploy heuristic, so the only trading-firm data point on quality under continuous deployment is weak.
- I found no study of why finance specifically resists; Schermann's sample includes insurance and payments interviewees but does not analyse them separately.

---

## 4. Regulator and industry-body statements relevant to release practice

### Takeaway

The UK FCA's multi-firm review of over one million 2019 production changes found that smaller, more frequent releases and effective agile delivery went with higher change success, that "major" changes failed more than twice as often despite extra scrutiny, and that CABs approved over 90% of what they reviewed. The same review reports a slightly higher change-failure rate at firms describing more of their work as "DevOps" (no firm conclusion, small sample), and MAS's 2021 guidelines still explicitly expect a change advisory board and signed-off test results.

### Cited Findings

**FCA, "Implementing Technology Change" (multi-firm review).** Published 5 February 2021 (page metadata `datePublished` 05/02/2021); the data are for calendar 2019. The brief's "FCA 2019" should be corrected to "published 2021, 2019 data". [FULL: raw page text read] — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)

- Sample and method: 23 firms (8 wholesale, 8 retail, 7 insurance) plus additional firms in workshops; "over 1m production changes implemented in 2019", about 35,000 per firm; supplemented by a qualitative questionnaire, a confidential board questionnaire and industry workshops. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Base rates: 1.6% of technology changes resulted in an incident; "over 13,767 incidents in 2019, of which 14% had customer-facing impact"; on average 80 customer-facing change-related incidents per firm. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Release frequency and agile, exact wording [FULL]: heading "Frequent releases and agile delivery can help firms to reduce the likelihood and impact of change related incidents"; text "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles." and "Firms that made effective use of agile delivery methodologies were also less likely to experience a change incident." — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Major changes: nearly 68,000 major changes produced 2,600 incidents, "an average failure rate of 3.8%, compared to 1.6% from all change types"; "despite the increased oversight" major changes were twice as likely to cause an incident; workshop attendees attributed this to complexity and "the inability to break them down into smaller components". — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- CABs, exact wording [FULL]: "CABs approved over 90% of the major changes they reviewed, and in some firms the CAB had not rejected a single change during 2019. This raises questions over the effectiveness of CABs as an assurance mechanism." Elsewhere: "many CABs perform more of a 'flight control' role rather than an assurance function." The FCA does not recommend abolishing CABs; attendees said members should be carefully selected and subject-matter experts should review changes. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Automation: firms deploying between weekly and multiple times a day used automated deployment (78% mostly or fully automated) and microservices (89% in some capacity); "firms who used microservices, automation and deployed changes more frequently had higher change success rates" (sentence truncated in my extract after "higher chang"; the fetch-tool reading completes it this way). — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Legacy: over 90% of firms rely on legacy technology; lower legacy share went with higher change success, fewer emergency changes and more successful emergency changes. Emergency changes were 3-5% of volume overall but almost 20% at some firms. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Governance: "positive correlation between the longevity of governance arrangements and higher change success rates"; arrangements in place over a year went with fewer change incidents. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- DevOps caveat, exact wording [FULL]: "84% of firms use DevOps methodologies in some form, but only 13% of firms use DevOps processes for all software delivery activities." And: "firms who described a higher proportion of their software development activities as 'DevOps' experienced a slightly higher change failure rate compared with other firms. However, due to the sample size no firm conclusion could be identified". Also: "increased release frequency and automated assurance can present significant operational and regulatory challenges ... this isn't a one-size fits all solution." — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Firms' own view: "wide support for carrying out smaller changes gradually", but larger firms said regulatory changes are hard to break up "due to varying specifications and hard deadlines". Over 30% of development was delivered by third parties. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- Limits: 23 firms; correlations on firms' own ITSM data with inconsistent definitions of "change", "major" and "incident"; no effect sizes or statistical tests published for the frequency/agile findings; it is a review of observations, not rules or guidance. A fetch-tool reading reported an Annex A figure of "nearly 20,000" change-related incidents that I did not reconcile with the 13,767 in the body; use 13,767.
- Uptake by a regulated firm: Starling's 2025 engineering post cites this FCA study as recommending high automation, strong governance and frequent releases. [TOOL] — [Starling 2025](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer)

**Monetary Authority of Singapore, Technology Risk Management Guidelines, January 2021.** [FULL extract; locators are clause numbers] — [MAS TRM Guidelines 2021 PDF](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)

- 6.3.1 recognises DevSecOps as comprising "continuous integration, continuous delivery and IT security practices" and says the FI should align it with its SDLC framework and IT service management processes including change and release management. 6.3.2: enforce segregation of duties for development, testing and release functions in DevSecOps processes.
- 7.5.3 [FULL]: "Test results should be accepted and signed off before the changes are deployed to the production environment."
- 7.5.4 [FULL]: "A change advisory board, comprising key stakeholders including business and IT management, should be formed to approve and prioritise the changes".
- 7.5.5: back up before the change and establish a rollback plan. 7.5.7: log activities during the change process.
- 7.6.1 [FULL]: segregation of duties so that "no single individual has the ability to develop, compile and move software codes from one environment to another."
- Limits: guidelines, not binding rules (law-firm summaries say observance feeds MAS's risk assessment of the institution [SNIPPET] — [Baker McKenzie summary](https://insightplus.bakermckenzie.com/bm/financial-institutions_1/singapore-mas-revises-technology-risk-management-guidelines)). The text does not mention canary releases, feature flags or phased rollout, and does not say whether CAB approval may be delegated, standardised or automated.

**US SEC, In the Matter of Knight Capital Americas LLC, Exchange Act Release No. 70694, 16 October 2013.** [FULL extract; locators are paragraph numbers] — [SEC order PDF](https://www.sec.gov/litigation/admin/2013/34-70694.pdf)

- Regulatory expectation stated through enforcement: the remediation undertaking (PDF p. 14) required review of controls over "deployment of new software and code", order routers, automated pre-trade capital thresholds, and incident response protocols. Details of the incident are in section 5.

### Inferences

- The FCA review is the single most useful source for a finance audience: a conduct regulator, using banks' own change records, reports the same directional findings as DORA (small frequent releases better; big changes worse despite scrutiny; CABs rarely reject). It is correlational and should be presented as such.
- The FCA's DevOps caveat cuts against a simple "more DevOps, fewer incidents" reading. A fair summary: release size/frequency, automation and low legacy correlated with success; self-described DevOps share did not, in a sample too small to conclude.
- The FCA's finding about governance longevity suggests stable, well-understood process helps, consistent with DORA 2019's "clear change process" result. Frequent reorganisation of the change process is itself a risk.
- MAS shows the regulatory text can lag or cut the other way: a Singapore-regulated firm must reconcile peer-review-based approval with an explicit CAB expectation and signed-off test results. The practical route in the first-person accounts is to keep a CAB-like body for policy, standard-change pre-approval and exceptions, and to treat automated test evidence as the sign-off record; that is an inference, not something MAS states.
- No regulator text found says soak periods or release trains are required; equally none endorses canaries or flags by name.

### Gaps

- FFIEC (IT Examination Handbook), PRA (operational resilience, SS1/21) and FCA Handbook (SYSC) wording on change management was not retrieved; no claims about them are made here.
- No PCI DSS or SOX primary text was read; the DORA 2019 report's reading of PCI-DSS segregation of duties (p. 48 fn. 21) is the only characterisation used.
- The FCA review publishes no numbers for the release-frequency correlation, so its strength is unknown.
- MAS's position on automated approvals or standard/pre-approved changes is not stated in the guideline text I read.

---

## 5. Contrary and qualifying evidence: where speed hurt quality, or manual gates were kept

### Takeaway

There is real contrary evidence, though little of it shows that small changes with progressive exposure are less safe than soak and release trains. It shows instead that speed without built-in quality degrades stability (DORA 2017; Facebook 2009-2010), that cautious infrequent release does buy a somewhat lower change-fail rate at the cost of recovery time (DORA 2018), that flags and partial deployments are themselves failure modes when unmanaged (Knight Capital; Schermann), and that regulated firms and at least one regulator's guidance retained human approval steps.

### Cited Findings

- **Speed without quality (DORA 2017, PDF p. 6)** [FULL]: low performers improved deployment frequency and lead time year over year but reported slower recovery and higher failure rates; "pressure to deploy faster and more often causes lower performers to pay insufficient attention to building in quality." This is the authors' interpretation of survey movement, not a tested effect. — [2017 report](https://dora.dev/publications/pdf/state-of-devops-2017.pdf)
- **Cautious release does lower change-fail rate somewhat (DORA 2018, PDF pp. 16, 44)** [FULL]: the "misguided performers" cluster deploys as slowly as or slower than low performers and has a better change-fail rate than low performers, but the longest time to restore and the highest outsourcing. — [2018 report](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)
- **Transition gets worse before better (DORA 2018, PDF p. 29)** [FULL]: medium performers do more manual testing and change approval than low performers (J-curve), i.e. teams part-way through automation accumulate manual controls. — [2018 report](https://dora.dev/publications/pdf/state-of-devops-2018.pdf)
- **Elite lead times lengthened as review/approval grew (DORA 2019, p. 25)** [FULL]: offered as speculation by the authors. — [2019 report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf)
- **FCA: DevOps share and failure rate** [FULL]: firms describing more of their development as DevOps "experienced a slightly higher change failure rate"; no firm conclusion due to sample size; frequent release and automated assurance "can present significant operational and regulatory challenges". — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- **Facebook's own quality dip (Savor et al., p. 6)** [FULL]: a productivity surge in 2009-2010 coincided with "a degradation in quality" (hotfixes), and correcting it cost productivity. The same paper lists drawbacks of CD: resource creep from many small changes, not-invented-here duplication, convergence on local minima, and variable quality between developers (pp. 9-10). — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- **Retained release engineering gate (Savor et al., p. 2 fn. 2)** [FULL]: unlike Etsy and Netflix, Facebook and OANDA kept a release engineering team between developers and production; the authors "have come to believe that having a separate team is valuable when reliable software is important." — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- **Retained manual testing and freeze at Facebook mobile (Rossi et al., pp. 4, 6)** [FULL]: about 100 contracted manual testers; code freeze before branch cut; changes pushed on release-cut day are lower quality (p. 3). — [Rossi et al. 2016](https://www.eecg.utoronto.ca/~stumm/Papers/Rossi-FSE-16.pdf)
- **Rapid release, mixed quality effects (Khomh et al. 2012)** [FULL abstract]: no significant increase in post-release bugs and faster fixes, but crashes occur earlier in execution and median uptime is lower. — [Khomh et al. 2012](https://swat.polymtl.ca/~foutsekh/docs/Khomh-MSR-2012.pdf)
- **Rapid release and testing (Mäntylä et al. 2015)** [SNIPPET]: narrower test scope, reduced test-suite diversity, more deadline-oriented testing. Search summaries of the related Firefox work also say rapid releases fix proportionally fewer reported bugs; I did not verify that wording in a primary text. — [Mäntylä et al. 2015](https://mcislab.github.io/publications/2015/emsemika.pdf)
- **Workload and stress (Shahin et al., p. 14)** [FULL]: several primary studies report more pressure and workload for developers, operations and release teams when moving to frequent releases. — [arXiv 1703.07019](https://arxiv.org/pdf/1703.07019)
- **Domain and customer limits (Shahin et al., p. 17; Savor et al., p. 7)** [FULL]: safety-critical systems and customer policies (banks) prevented continuous deployment in reported cases; customers sometimes dislike frequent updates. — [arXiv 1703.07019](https://arxiv.org/pdf/1703.07019); [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- **Canaries are often informal (Schermann et al., p. 12)** [FULL]: no thresholds, health judged by intuition, 63% not using regression-driven experimentation at all. — [IST preprint](https://www.ifi.uzh.ch/dam/jcr:01d34060-29fb-472e-a116-bd26c3b49f67/IST_preprint.pdf)
- **Feature-flag hazards (Schermann et al., p. 10)** [FULL]: 150 toggles became untestable; a flag was inadvertently flipped and "reactivated dead code". One interviewee refuses toggles because configuration adds complexity. — [IST preprint](https://www.ifi.uzh.ch/dam/jcr:01d34060-29fb-472e-a116-bd26c3b49f67/IST_preprint.pdf)
- **Knight Capital (SEC order, 2013)** [FULL]: paras. 12-16. New Retail Liquidity Program code reused a flag that formerly activated the long-dead "Power Peg" function. Code was deployed "in stages by placing it on a limited number of servers ... on successive days" from 27 July 2012; a technician did not copy the new code to one of eight servers; "Knight did not have a second technician review this deployment"; "Knight had no written procedures that required such a review." On 1 August 2012 orders carrying the repurposed flag hit the eighth server and triggered the old code: over 4 million executions in 154 stocks in 45 minutes and a loss of "over $460 million" (para. 1). Para. 25: the position monitor "relied entirely on human monitoring and did not generate automated alerts" and was not linked to order entry to stop trading at thresholds. — [SEC order](https://www.sec.gov/litigation/admin/2013/34-70694.pdf)
- **Regulated firms kept human approval**: Starling (four-eyes via Slack in 2019; three-layer approval including business sign-off on timing in 2025) [TOOL] — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk); [Starling 2025](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer). LMAX released fortnightly on Saturdays outside trading hours [TOOL] — [Bird 2016](https://www.oreilly.com/content/introduction-to-devops-for-the-financial-industry/). IG deployed 1-3 times a week in core hours with a manual stop in the pipeline [TOOL] — [Genn 2015](https://www.slideshare.net/DavidGenn/continuous-delivery-krakow-jdd-2015). Capital One's governance lead: "Risk cannot be mitigated with typical 'CI/CD' automation alone." [TOOL] — [Brady 2018](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/)
- **Regulatory text expecting a manual gate**: MAS TRM 2021 clauses 7.5.3-7.5.4 (signed-off test results; CAB to approve and prioritise changes) [FULL]. — [MAS TRM Guidelines 2021](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf)
- **Some changes cannot be made small (FCA review)** [FULL]: larger firms said regulatory changes are hard to split because of varying specifications and hard deadlines; several of the highest-impact incidents of the previous ten years were failed legacy migrations. — [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change)
- **TSB 2018 migration (Slaughter and May independent review, published 19 November 2019)** [SNIPPET: press coverage only; the report itself was not read]. Coverage says the review criticised insufficient consideration of a largely single-event ("big bang") migration, inadequate testing (including testing only one of two data centres) and weak supplier oversight; TSB disputed parts of the conclusions. — [IT Pro coverage](https://www.itpro.com/business-strategy/digital-transformation/354155/tsbs-it-disaster-pinned-on-big-bang-approach-to); [TSB statement](https://www.tsb.co.uk/news-releases/slaughter-and-may/)
- **Backward compatibility as a precondition (QCon 2019 panel)** [TOOL]: Habito's engineer said canaries require every change to be forward and backward compatible and that rollbacks often break against newer data, which "probably requires a wider cultural change". — [InfoQ panel](https://www.infoq.com/presentations/panel-release-risk)

### Inferences

- Knight Capital cuts both ways and should be told carefully. It was a staged server-by-server rollout and a repurposed flag that failed; but the proximate failures were a manual, unverified deployment, dead code left behind a live flag, no automated deployment-consistency check, and no automated kill switch tied to exposure limits. It is an argument for automated verification, flag hygiene and automated guardrails, and against treating "staged" or "flagged" as inherently safe. The SEC also faulted the absence of a second-person review, so it is not an argument against four-eyes.
- TSB (if the press characterisation holds) is evidence against big-bang cutover with pre-production-only testing, which is the essay's side of the argument; but it is not evidence for canaries specifically, and it has not been verified from the report.
- The strongest honest concession for the audience: infrequent, heavily tested releases can produce a lower change-fail rate than undisciplined fast release (DORA 2018 misguided cluster; DORA 2017 low performers; Facebook 2009-2010). The case for ramping rests on the combination of small batch, automated checks, limited blast radius and fast recovery, not on frequency by itself.
- Soak periods catch a class of defect (time-dependent, state-accumulating, batch-cycle, end-of-day/month-end) that the literature here does not address at all. Khomh's "crashes earlier / lower uptime" result is a hint that shorter cycles shift some stabilisation onto users. In finance, an essay should explain how ramped exposure spans the relevant business cycles (e.g. holding a canary cohort through an end-of-day run) rather than assert soak is unnecessary.
- Human approval persists in every regulated first-person account. The realistic management target is fewer, better-placed approvals with machine-generated evidence, not zero approvals.

### Gaps

- No study was found that directly compares soak/release-train regimes with canary/flag regimes on incident outcomes in finance or elsewhere.
- No documented case was found of a regulator rejecting or penalising a firm for using canary releases or feature flags as such; equally none approving them.
- The Slaughter and May TSB report itself was not read; all TSB details are from press coverage and TSB disputes them.
- The Firefox "fix proportionally fewer bugs" claim and Mäntylä et al.'s details are from abstracts/snippets only.
- No evidence was gathered on market-infrastructure-specific constraints (exchange certification cycles, conformance testing, client notification periods) that may mandate calendar-based release for trading interfaces; this is a likely objection from the target audience and remains unresearched.
