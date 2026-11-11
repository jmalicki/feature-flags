# Management arguments, frameworks and leadership practices behind the move from testing gates and release trains to flags, canaries and ramps (c. 2006-2022)

Conventions used in every finding:

- Evidence type: **[PRIMARY]** practitioner testimony or an official record; **[RESEARCH]** survey or peer-reviewed research; **[SECONDARY]** synthesis or advocacy book, trade press, or summary.
- Verification level: **(read)** = I read the full text (a locally saved copy of the page or PDF); **(fetch)** = the page was retrieved and quotes were extracted by a fetch tool, which is reliable but one step removed; **(snippet)** = only a search snippet or third-party summary was seen; **(not read)** = the text could not be accessed, so only its existence or chapter title is confirmed.
- Every quotation is under 25 words. Quotations marked (read) were checked against the text. Quotations marked (fetch) were returned verbatim by the fetch tool and not independently re-checked.
- "Limits" states what the source does not establish.

## 1. Batch size and risk: Humble & Farley, Reinertsen, Ries, Allspaw, Humble on CABs

### Takeaway

The core persuasion move, repeated from 2009 onward, was to reframe "change causes outages, so change less" as "change causes outages, so make each change smaller, more frequent and faster to reverse", backed by practitioner data (Flickr, Etsy) and later by survey data. The canonical book (Humble & Farley 2010) could not be read in full text here, so its wording is confirmed only through the authors' own website and Fowler's 2011 note. The 2013 "Risk management theatre" post does not mention CABs by name; Humble's 2010 ITIL post is the one that addresses CABs, and it argues for keeping them in lightweight form.

### Cited Findings

**Allspaw & Hammond, "10+ Deploys Per Day: Dev and Ops Cooperation at Flickr", Velocity conference, June 2009** [PRIMARY] (read: slide text extracted from the PDF deck; slides only, no speaker narration)

- Locator: slide deck, sections "Dev versus Ops", "Tools" (items 1-6), "Culture" (items 1-4).
- Evidence: States the incentive conflict as the traditional view that dev adds features and ops keeps the site stable, then rejects it: ops' job is "to enable the business (this is dev's job too)". Concedes the opposing premise directly: "But change is the root cause of most outages!" and poses the choice as "Discourage change in the interests of stability or Allow change to happen as often as it needs to". The proposed resolution is "Lowering risk of change through tools and culture". Six tools: automated infrastructure, shared version control, one-step build and deploy, feature flags ("aka branching in code", "Always ship trunk"), shared metrics, IRC/IM robots. Flags are listed with "Private betas", "Bucket testing", "Dark launches" and "Free contingency switches". Four culture items: respect, trust, healthy attitude about failure, avoiding blame. Asks developers to tell ops "what are the risks?" and "what are the contingencies?" for each change.
- Quote (read): "If you think you can prevent failure then you aren't developing your ability to respond"
- Limits: A conference deck from one consumer photo site. No incident data is given in the slides. It asserts rather than demonstrates that small frequent changes are safer.
- Source: [slides on SlideShare](https://www.slideshare.net/slideshow/10-deploys-per-day-dev-and-ops-cooperation-at-flickr/1628368)

**John Allspaw, "MTTR is more important than MTBF (for most types of F)", Kitchen Soap blog, 7 November 2010, with a 2017 author update** [PRIMARY] (fetch)

- Locator: whole post; the scope caveats are in the body and the 2017 update is appended.
- Evidence: Argues web operations architectures should be optimised for recovery time over failure avoidance, using a Jeep versus Rolls-Royce comparison. Cites dark launching, percentage rollouts and feature flags as practices consistent with this. The post does not discuss change approval or change size; those are in his Velocity 2010 talk (next item).
- Quotes (fetch): "Being able to recover quickly from failure is more important than having failures less often." / "some types of failures shouldn't ever happen, and not all failures/degradations/outages are the same." / "What I'm definitely not saying is that failure should be an acceptable condition."
- Limits stated by the author: the argument excludes failures that must never happen (his example is accidental data loss). The 2017 update retracts the mean-based framing: "Because taking the statistical mean of TTR or TBF makes absolutely no sense, whatsoever." For a finance audience this caveat is load-bearing: irreversible errors (a wrong payment, a wrong trade) are the "types of F" the post exempts.
- Source: [kitchensoap.com](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)

**John Allspaw, "Ops Meta-Metrics: The Currency You Pay For Change", Velocity 2010 (June 2010)** [PRIMARY] (fetch of slide transcript)

- Locator: slide deck; change-type table for Q2 2010.
- Evidence: Proposes tracking change type, frequency, size and result, plus incident severity (SEV1-4), time to detect and time to resolve, so that an organisation can build evidence-based confidence in change. Contrasts "Huge changesets (high TTR) deployed rarely" with "Tiny changesets deployed often (low TTR)". Illustrative table for Etsy Q2 2010: app code 420 successes / 5 failures; config 404 / 3; DB schema 15 / 1.
- Quotes (fetch): "But because humans will irrationally make a permanent connection between the two." (on changes and incidents) / "Maybe you're changing too much at once?"
- Limits: The deck itself carries the caveat "Graphs and numbers in this presentation are sort of made up." The figures must not be cited as measured Etsy data. What the talk establishes is the managerial practice (keep a change log and an incident log and correlate them), not an empirical result.
- Source: [SlideShare transcript](https://www.slideshare.net/slideshow/ops-metametrics-the-currency-you-pay-for-change-4608108/4608108); [author's post linking the slides](https://www.kitchensoap.com/2010/06/24/ops-meta-metrics-velocity-2010-slides/)

**Eric Ries, "Work in small batches", Lessons Learned blog, 20 February 2009** [PRIMARY/advocacy] (fetch)

- Locator: whole post; five listed benefits.
- Evidence: Lists benefits: faster feedback, localised problems, reduced risk, fewer integration conflicts, lower overhead through practice.
- Quotes (fetch): "Small batches mean problems are instantly localized." / "Small batches reduce risk." / "organizations get better at those things that they do very often."
- Limits: Startup-context assertion with no data. Says nothing about regulated or high-consequence systems.
- Source: [startuplessonslearned.com](https://www.startuplessonslearned.com/2009/02/work-in-small-batches.html)

**Martin Fowler, "Frequency Reduces Difficulty", bliki, 28 July 2011** [SECONDARY, by a close collaborator of the CD authors] (fetch)

- Locator: whole entry.
- Evidence: Gives three mechanisms for "if it hurts, do it more often": smaller pieces are easier, feedback is faster, and practice enables automation.
- Quotes (fetch): "if it hurts, do it more often" / "It did hurt, so you did it more often, and now it no longer hurts."
- Limits: An explanatory note, not evidence. The 2010 book's own wording of the principle (commonly cited as "If it hurts, do it more frequently, and bring the pain forward", ch. 1) was **not read** and should be checked against the book before quoting.
- Source: [martinfowler.com](https://martinfowler.com/bliki/FrequencyReducesDifficulty.html)

**Jez Humble & David Farley, "Continuous Delivery" (Addison-Wesley, July 2010)** [SECONDARY synthesis by practitioners] (not read in full; companion site and sample chapter fetched)

- Publication date and ch. 15 title "Managing Continuous Delivery", opening with a maturity model for configuration and release management, confirmed by the publisher listing (snippet): [O'Reilly listing, ch. 15](https://www.oreilly.com/library/view/continuous-delivery-reliable/9780321670250/ch15.xhtml).
- Ch. 5 sample ("Anatomy of the Deployment Pipeline", introduction only, fetch): frames the pipeline as a pull system in which testers and operations self-serve builds. Quotes (fetch): "What we end up with is (in lean parlance) a pull system." / "Testing teams deploy builds into testing environments themselves, at the push of a button." Manual testing is not abolished in this model; the complaint is waiting: "Testers waiting for 'good' builds of the software". [InformIT sample chapter](https://www.informit.com/articles/article.aspx?p=1621865)
- Authors' companion site, principles page (fetch): five principles: build quality in; work in small batches; computers perform repetitive tasks, people solve problems; relentlessly pursue continuous improvement; everyone is responsible. Quotes (fetch): "The reason we work in large batches is because of the large fixed cost of handing off changes." / "Cease dependence on inspection to achieve quality." (Deming, as quoted there). [continuousdelivery.com/principles](https://continuousdelivery.com/principles/)
- Authors' companion site, patterns page (fetch): four principles of low-risk releases: incremental, decouple deployment and release, reduce batch size, optimise for resilience. Quotes (fetch): "Two commonly-used patterns that enable this goal are dark launching and feature toggles" / "Counterintuitively, deploying to production more frequently actually reduces the risk of release". [continuousdelivery.com/implementing/patterns](https://continuousdelivery.com/implementing/patterns/)
- Canary releasing: Danilo Sato's bliki entry (25 June 2014, fetch) confirms "Canary release is described by Jez Humble and Dave Farley in the book Continuous Delivery" and records the costs: "you have to manage multiple versions of your software at once", plus care needed for database changes. [martinfowler.com/bliki/CanaryRelease.html](https://martinfowler.com/bliki/CanaryRelease.html)
- Limits: I could not read ch. 10 (canary, blue-green), ch. 14 (branching versus toggles) or ch. 15 (ITIL, compliance, audit) directly. The website pages postdate the book and are the authors' later restatement. Any direct quotation from the book's chapters needs checking against the book.

**Jez Humble, "Continuous Delivery and ITIL: Change Management", continuousdelivery.com, 29 November 2010** [PRIMARY advocacy] (fetch)

- Locator: whole post.
- Evidence: Argues heavyweight change management is an implementation choice, not an ITIL requirement. ITIL's own mechanisms (pre-authorised standard changes, delegated or electronic approval, a subset of the CAB approving) permit a low-ceremony process, and the deployment pipeline supplies the traceability auditors want. It does not propose abolishing the CAB.
- Quotes (fetch): "Standard changes are low-risk changes that are pre-authorized." / "Continuous delivery enables a low-ceremony change management process" / "Face-to-face CAB meetings serve an important purpose"
- Limits: An argument from the framework's text. No evidence that any regulator or auditor accepted it.
- Source: [continuousdelivery.com](https://continuousdelivery.com/2010/11/continuous-delivery-and-itil-change-management)

**Jez Humble, "Risk Management Theatre: On Show At An Organization Near You", continuousdelivery.com, 5 August 2013** [PRIMARY advocacy] (fetch)

- Locator: whole post, including its comparison of control-based and adaptive risk management.
- Evidence: Defines risk management theatre as controls designed for the rare bad actor that burden everyone else and are still circumventable. Ties it to Theory X management. Proposes "adaptive risk management" built on transparency, fast feedback, blameless post-mortems and system-level measures such as lead time and time to restore service. Concedes that controls can help a chaotic organisation temporarily. **The post does not mention change advisory boards by name and cites no data**; it criticises segregation of duties and manual gates.
- Quotes (fetch): "management imposes controls and processes which make life painful for the innocent but can be circumvented by the guilty" / "But controls limit our ability to adapt quickly to unexpected problems." / "The more people are treated as criminals, the more we risk that they will behave as such."
- Limits: Opinion with no empirical support in the post itself. The empirical backing came from the 2014 and 2019 State of DevOps reports (section 7).
- Source: [continuousdelivery.com](https://continuousdelivery.com/2013/08/risk-management-theatre/)

**Donald Reinertsen, "The Principles of Product Development Flow" (Celeritas, 2009), ch. 5 on batch size** [SECONDARY synthesis] (snippet only)

- Evidence from secondary summaries: principle B2 is quoted by a blog as "The Batch Size Queueing Principle: Reducing batch size reduces cycle time". Summaries say the book frames optimal batch size as a trade-off between holding cost (delayed feedback, delayed value) and transaction cost (the cost of preparing and sending a batch), and that the chapter includes a software testing example. One summary reports 175 principles in the book.
- Limits: I did not read the book. Principle numbering and wording beyond B2 are unverified. No exact quotation should be taken from these notes.
- Source: [Substack summary](https://productdevelopment101.substack.com/p/productivity-in-product-development-4bb); [second summary](https://www.boost.co.nz/blog/2018/11/reduce-batch-size-agile-software-development)

### Inferences

- The argument that moved sceptical leadership was economic and incentive-based: batch size is driven by the fixed transaction cost of a release (Humble's "large fixed cost of handing off changes"; Reinertsen's transaction versus holding cost), so the lever is to cut transaction cost through automation, after which smaller batches follow. For a twice-weekly train with three days of promotion and soak, the transaction cost is the promotion and soak itself.
- Allspaw's 2009 deck concedes the opposing premise ("change is the root cause of most outages") and then changes the conclusion. That concession is probably why it persuaded operations people.
- Allspaw's own scope limit ("for most types of F") and his 2017 retraction of averaged MTTR should be carried into the essay. In finance some failures are of the excluded type, and flags and ramps help only where exposure can be bounded and reversed.
- Humble's actual 2010 position on CABs is reformist (standard changes, delegated approval), which is a more usable argument for a regulated shop than "abolish the CAB".

### Gaps

- Humble & Farley ch. 10, 14 and 15 wording (canary, toggles versus branches, UAT stages, ITIL and compliance) could not be read; O'Reilly's pages returned HTTP 403.
- Reinertsen's exact text was not read.
- No source was found giving Flickr's or Etsy's measured change-failure data from 2009-2010; the widely circulated Etsy table is self-described as illustrative.

## 2. Error budgets as a management contract; SLOs replacing "time in environment"

### Takeaway

Google's error budget converts release pace from a standing argument between development and operations into a quantity derived from an agreed SLO: spend it on launches while it lasts, freeze when it is gone. The SRE texts explicitly present canary size and duration as an economic question with no fixed answer, and present phased rollouts as a way to spend less budget per launch.

### Cited Findings

**Marc Alvidrez (ed. Betsy Beyer et al.), "Embracing Risk", ch. 3 of "Site Reliability Engineering" (O'Reilly, 2016); the error-budget section is credited to Mark Roth** [PRIMARY, one company's published doctrine] (fetch)

- Locator: ch. 3, sections "Motivation for Error Budgets", "Forming Your Error Budget", "Benefits".
- Evidence: Product development is measured on velocity and SRE on reliability, which creates structural tension that is worsened by information asymmetry. The chapter lists the recurring disputes: software fault tolerance, amount of testing, push frequency, canary duration and size. An error budget derived from a quarterly SLO, measured by a neutral monitoring system, replaces negotiation. When the budget is nearly spent, developers themselves slow down.
- Quotes (fetch): "Every push is risky. How much should we work on reducing that risk, versus doing other work?" / "How long do we wait, and how big is the canary?" / "the product developers themselves will push for more testing or slower push velocity" / "Hope is not a strategy."
- Limits: Describes Google's internal practice for services with large request volumes and measurable availability. Gives no outcome data. Does not address domains where a single bad event is unacceptable regardless of the budget.
- Source: [sre.google/sre-book/embracing-risk](https://sre.google/sre-book/embracing-risk/)

**Benjamin Treynor Sloss, "Introduction", ch. 1 of "Site Reliability Engineering" (2016)** [PRIMARY] (fetch)

- Locator: ch. 1, sections on error budgets and change management.
- Evidence: States the dev/ops conflict as structural, sets a 50% cap on operational work for SREs, and names three change-management practices (progressive rollouts, fast and accurate problem detection, safe rollback).
- Quotes (fetch): "100% is the wrong reliability target for basically everything" / "SRE has found that roughly 70% of outages are due to changes in a live system." / "the two teams' goals are fundamentally in tension."
- Limits: The 70% figure is an unreferenced internal Google estimate. It supports "changes cause most outages", which sceptics also cite; the text's response is progressive rollout, not fewer changes.
- Source: [sre.google/sre-book/introduction](https://sre.google/sre-book/introduction/)

**Ben Treynor interviewed by Niall Murphy, "Site Reliability Engineering" (Google "in conversation" page; date not shown on page)** [PRIMARY] (fetch)

- Evidence: The business sets the availability target, and the remainder is budget to spend on launches. Phased rollouts and 1% experiments put less budget at risk and so permit more launches. When the budget is exhausted, launches freeze. SRE can hand the pager back to a development team whose system is too unreliable.
- Quotes (fetch): "SRE measures and enforces, but we do not assess or judge." / "We simply freeze launches, other than P0 bug fixes." / "once the development team figures out that this is how the game works, they self-police." / "we will hand operational responsibility back to you, the development team."
- Limits: An interview with the function's founder. Self-policing is asserted, not measured.
- Source: [sre.google/in-conversation](https://sre.google/in-conversation/)

**Steven Thurgood, "Example Error Budget Policy", appendix to "The Site Reliability Workbook" (O'Reilly, 2018); policy dated 2018-02-20** [PRIMARY, a template] (fetch)

- Evidence: If the service exceeds its budget over the preceding four weeks, "we will halt all changes and releases" other than P0 issues and security fixes "until the service is back within its SLO". A single incident consuming more than 20% of the four-week budget requires a postmortem with at least one P0 action. Disputes escalate to the CTO.
- Limits: An example document, not evidence of how often freezes are actually enforced.
- Source: [sre.google/workbook/error-budget-policy](https://sre.google/workbook/error-budget-policy/)

### Inferences

- The error budget is a written contract with three managerial features a finance organisation can copy: the target is set by the business owner and not by engineering; measurement is by a neutral system; and the consequence (freeze) is pre-agreed and automatic, with a named escalation path.
- It replaces "time spent in an environment" with "observed production behaviour against a target" as the safety measure. Netflix's 2018 account (section 3) describes soak failing in exactly this way: canarying "devolving into verifying endurance".
- An availability-ratio budget does not fit correctness failures. A ledger error is not a fraction of failed requests. The essay should say that SLOs for finance need correctness and reconciliation indicators, and that the SRE texts do not supply them.

### Gaps

- No independent evaluation of error budgets' effect on incident rates was found.
- I did not find Treynor Sloss addressing whether teams game canary length or launch reviews; the interview page does not cover it.

## 3. Ownership and on-call: Vogels 2006, Netflix 2018, costs and objections

### Takeaway

"You build it, you run it" was justified as a quality feedback loop, and Netflix's 2018 account is unusually candid that it works only when management funds tooling, training and staffing headroom. Netflix also names long soak as a symptom of the old model. Primary sources warn of burnout; I found no rigorous study isolating the effect of developer on-call.

### Cited Findings

**Werner Vogels interviewed by Jim Gray, "A Conversation with Werner Vogels", ACM Queue vol. 4 no. 4, 30 June 2006** [PRIMARY] (read)

- Locator: answers on service orientation lessons and on testing at scale.
- Evidence: Each service has a team "completely responsible for the service" from scoping to operating. Operational responsibility brings developers into daily contact with their software in operation and with customers. Vogels also concedes that testing at Amazon's scale is unsolved and describes a slow beta introduction followed by measurement.
- Quotes (read): "Giving developers operational responsibilities has greatly enhanced the quality of the services, both from a customer and a technology point of view." / "You build it, you run it." / "Testing in a very large-scale distributed setting is a major challenge." / "we will slowly introduce this to our customers, and then we measure relentlessly."
- Limits: A CTO's assertion with no data. Does not describe on-call load, compensation or attrition.
- Source: [queue.acm.org](https://queue.acm.org/detail.cfm?id=1142065)

**Philip Fisher-Ogden, Greg Burrell, Dianne Marsh, "Full Cycle Developers at Netflix: Operate What You Build", Netflix Technology Blog, 17 May 2018** [PRIMARY] (read)

- Locator: sections "One Team's Journey", "Scaling Through Developer Tools", "Full Cycle Developers", "Trade-offs", "Conclusion".
- Evidence on the old model (2012, Edge Engineering): separate ops and SRE specialists owned deploy, operate and support. Knowledge transfer was lossy, time to detect and resolve deployment problems was higher, and releases took "on the order of weeks rather than days". An intermediate hybrid model failed because developers deferred to the release specialist.
- Evidence on what management must fund: centralised tooling teams; "dev bootcamps and other forms of ongoing training"; staffing "with enough headroom to manage builds and deployments, handle production issues, and respond to partner support requests"; an on-call rotation so that others can do focused work; operational investments prioritised alongside business projects.
- Evidence on trade-offs: breadth raises each developer's cognitive load; some developers prefer narrow specialisation and Netflix helps them find such roles; paved-road tools are not mandated.
- Quotes (read): "Canarying was devolving into verifying endurance (“nothing broke after one week of canarying, let's push it”) rather than correct functionality." / "The primary upside of having a separate ops team was less developer interrupts when things were going well." / "Without these, teams risk overload and burnout." / "Deployments are routine and frequent, canaries take hours instead of days"
- Limits: One organisation's self-report with no metrics. The authors themselves say other companies "won't have the staffing to invest in centralized teams like at Netflix".
- Source: [netflixtechblog.com](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)

**Charity Majors, "On Call Shouldn't Suck: A Guide For Managers", charity.wtf, 3 October 2020** [PRIMARY advocacy] (fetch)

- Evidence: Places responsibility for on-call quality on management: release on-call engineers from project work, treat every out-of-hours alert as work to fix, track alert volume, consider compensation, and consider making after-hours on-call elective.
- Quotes (fetch): "It is management's responsibility to make sure that on call does not suck." / "When an engineer is on call, they are not responsible for normal project work — period." / "Consider making after-hours on call fully-elective."
- Limits: Opinion from a vendor founder. No data.
- Source: [charity.wtf](https://charity.wtf/p/on-call-shouldnt-suck-a-guide-for-managers)

**Google's counter-model** [PRIMARY] (fetch): SRE keeps a specialist operations function but caps its operational work at 50% and can return the pager to developers (Treynor interview and SRE ch. 1, section 2). This shows the choice is not binary. — [sre.google/in-conversation](https://sre.google/in-conversation/)

### Inferences

- The management case for developer ownership is a feedback and incentive argument (Netflix: it "creates direct feedback loops and aligns incentives"), not a cost-saving one. Netflix's account implies that costs rise in tooling, training and headroom.
- For regulated finance, segregation of duties is the usual objection to developers operating production. DORA 2019 (section 7) argues that peer review plus recorded approvals satisfies the control's intent; that is the bridge between this section and the compliance argument.

### Gaps

- No dedicated, well-argued essay against "you build it, you run it" was found in the searches run; objections surfaced only as quoted sentiments in secondary pieces. Treat the "against" case as under-sourced here.
- No quantitative study of on-call burden before and after developer ownership was located.

## 4. Blameless culture and psychological safety: Allspaw 2012, Dekker, Westrum, Project Aristotle

### Takeaway

The link to release practice is informational: people who expect punishment withhold the details needed to learn from failure, and organisations that cannot learn respond to incidents by adding gates. Westrum's typology gave DORA a measurable construct for this, and Westrum's own abstract is more cautious about the culture-to-safety link than its later use in DevOps literature suggests.

### Cited Findings

**John Allspaw, "Blameless PostMortems and a Just Culture", Etsy Code as Craft blog, 22 May 2012** [PRIMARY] (read)

- Locator: sections "A Blameless Post-Mortem", "A Second Story", "Allowing Engineers to Own Their Own Stories".
- Evidence: Imports Sidney Dekker's "Bad Apple Theory" critique and "Just Culture" (balancing safety and accountability), Erik Hollnagel on why actions made sense at the time, and the first-story versus second-story distinction from "Behind Human Error". Describes a seven-step cycle in which punishment produces silence and "Cover-Your-Ass" engineering, management becomes less informed about how work is done, and errors become more likely. Says engineers stay accountable by owning the account and the remediation.
- Quotes (read): "Having a Just Culture means that you're making effort to balance safety and accountability." / "engineers are not at all “off the hook” with a blameless PostMortem process." / "The action made sense to the person at the time they took it"
- Limits: A statement of philosophy and practice at one company, with no outcome data. It cites Dekker and Hollnagel and does not test their claims.
- Source: [etsy.com/codeascraft](https://www.etsy.com/codeascraft/blameless-postmortems)

**Ron Westrum, "A typology of organisational cultures", Quality & Safety in Health Care 13 (Suppl 2), ii22-ii27, December 2004, DOI 10.1136/qshc.2003.009522** [RESEARCH, conceptual with case evidence] (fetch of abstract only)

- Evidence: Proposes that information flow both shapes and indicates culture and can predict how an organisation responds to trouble. The pathological / bureaucratic / generative table is in the full text, which I did not read; its content is confirmed through DORA's capability page (next item).
- Quotes (fetch, abstract): "culture's impact remains a commonsense, rather than a scientific, concept." / "information culture is indeed associated with error reporting and with performance, including safety."
- Limits: Westrum's stated conclusion is that the culture-safety relation needs further investigation. The domain is healthcare and aviation safety, not software delivery.
- Source: [PMC1765804](https://pmc.ncbi.nlm.nih.gov/articles/PMC1765804/)

**DORA capability page, "Generative organizational culture" (undated web page, DORA / Google Cloud)** [RESEARCH summary by the researchers] (fetch)

- Evidence: Reproduces Westrum's six aspects (cooperation, treatment of messengers, shared risks and responsibilities, bridging, response to failure, response to novelty). Reports that generative culture predicts software delivery and organisational performance, and cites Google's team study.
- Quotes (fetch): "a high-trust, generative culture predicts software delivery and organizational performance in technology." / "Messengers are not punished when they deliver news of failures or other bad news."
- Limits: "Predicts" here is DORA's inferential-statistics term applied to cross-sectional self-report survey data; it is not experimental causation.
- Source: [dora.dev](https://dora.dev/capabilities/generative-organizational-culture/)

**Google re:Work, "Understand team effectiveness" guide (Project Aristotle; guide undated, study publicised 2015-2016)** [RESEARCH, company-internal] (fetch)

- Evidence: Studied 180 teams (115 engineering project teams, 65 sales pods). Five dynamics in order: psychological safety, dependability, structure and clarity, meaning, impact. Uses Amy Edmondson's definition. Variables found not to matter significantly included colocation, seniority, team size and tenure.
- Quotes (fetch): "a shared belief held by members of a team that the team is safe for interpersonal risk taking." / "what really mattered was less about who is on the team, and more about how the team worked together."
- Limits: One company, internally defined effectiveness measures, not peer reviewed. It says nothing about release practice.
- Source: [rework.withgoogle.com](https://rework.withgoogle.com/intl/en/guides/understand-team-effectiveness)

**Allspaw & Hammond 2009 (section 1)** list "Healthy attitude about failure" and "Avoiding Blame" as culture items 3 and 4 beside feature flags and one-step deploy in the same deck, which is direct evidence that practitioners presented them as one package. — [slides](https://www.slideshare.net/slideshow/10-deploys-per-day-dev-and-ops-cooperation-at-flickr/1628368)

### Inferences

- The mechanism connecting blamelessness to small frequent releases: frequent release means frequent small failures; if each failure triggers blame, the rational individual response is to batch, hide and seek sign-off (Allspaw's "Cover-Your-Ass engineering"). A change-approval gate works partly as blame insurance for the individual. Removing gates without changing the consequence structure will be resisted for that reason.
- DORA 2019 (section 7) reports that organisations "often respond to problems with software releases by introducing additional process and more heavyweight approvals", which is the organisational form of the same reflex.

### Gaps

- Dekker's "Just Culture" (2007) and "The Field Guide to Understanding Human Error" were not read; they are represented only through Allspaw's use of them.
- Westrum's full paper (the typology table) was not read; BMJ returned HTTP 403.
- No study was found that directly tests whether blameless review increases deployment frequency.

## 5. Experimentation leadership: Kohavi, Thomke, Booking.com, Microsoft, LinkedIn

### Takeaway

The experimentation literature's central demand on leaders is humility backed by rule: accept that most ideas fail to move the metric, define the evaluation criterion in advance, and require the test even for changes the senior person is sure of. Booking.com adds permissionless launch with universal authority to stop a harmful experiment. The two books (Kohavi/Tang/Xu 2020; Thomke 2020) could not be read; the findings below come from the authors' papers and HBR excerpts.

### Cited Findings

**Ron Kohavi, Alex Deng, Brian Frasca, Toby Walker, Ya Xu, Nils Pohlmann, "Online Controlled Experiments at Large Scale", KDD 2013** [PRIMARY, peer-reviewed practitioner paper] (read)

- Locator: sections 1 (introduction), 2 (Tenets), 3 (Cultural and Organizational Lessons, 3.1-3.7).
- Evidence: Collects practitioner testimony that most ideas fail: Quicken Loans' Regis Hadiaris guessing outcomes correctly "about 33% of the time", Etsy's Dan McKinley "nearly everything fails", Netflix reported by Mike Moran as considering 90% of what they try to be wrong. Tenet 1: the organisation wants to be data-driven and has formalised an Overall Evaluation Criterion; many organisations prefer the metric "percent of plan delivered". Four stages of organisational learning: Hubris (confidence in the HiPPO), Measurement and Control, Semmelweis Reflex, Fundamental Understanding. Leadership anecdote: at Amazon the first author insisted the re-implemented Order Pipeline pass an A/B test; it failed with a 2% revenue loss and failed again after the fix.
- Quotes (read): "we are poor at assessing the value of ideas." / "The new pipeline shipped after five iterations." / "It is often easier to generate a plan, execute against it, and declare success"
- Limits: Written by the platform's builders. The failure rates are anecdotes from several companies, not a systematic sample. The context is consumer web, where harm from a bad variant is bounded and reversible.
- Source: [paper, URL as printed on the paper](http://bit.ly/ExPScale)

**Ron Kohavi, Thomas Crook, Roger Longbotham et al., "Online Experimentation at Microsoft" (2009 workshop paper)** [PRIMARY] (read in part: one passage located by search of the text)

- Evidence: Of experiments designed to improve a key metric, "only about one-third were" successful at doing so (the sentence continues beyond the fragment I verified; paraphrase the rest).
- Limits: A Microsoft-internal count with no method given in the passage seen.
- Source: [exp-platform.com, as referenced in the paper header](http://exp-platform.com/expMicrosoft.aspx)

**Ron Kohavi & Stefan Thomke, "The Surprising Power of Online Experiments", Harvard Business Review, September-October 2017** [SECONDARY synthesis by a practitioner and an academic] (fetch; opening only, the rest is paywalled)

- Evidence: The Bing headline test: an idea needing a few days of engineering sat for more than six months among hundreds of proposals; when tested it raised revenue 12%, estimated at more than $100 million a year in the United States alone.
- Quotes (fetch): "even experts have a hard time assessing new ideas" / "It was the best revenue-generating idea in Bing's history, but until the test its value was underappreciated."
- Limits: The article's recommendations to leaders were not visible. A single best-case anecdote.
- Source: [hbr.org](https://hbr.org/2017/09/the-surprising-power-of-online-experiments)

**Stefan Thomke, "Building a Culture of Experimentation", Harvard Business Review, March-April 2020** [SECONDARY] (fetch; opening only)

- Evidence: Booking.com runs about 25,000 tests a year. Opens with a December 2017 test of a radically new home page proposed by the director of design.
- Quote (fetch): "It takes more than good tools. It takes a complete change of attitude."
- Limits: The body, which lists the cultural attributes and leadership model, was not visible. Thomke's book "Experimentation Works" (2020) was **not read**.
- Source: [hbr.org](https://hbr.org/2020/03/building-a-culture-of-experimentation)

**Raphael Lopez Kaufman, Jegar Pitchforth, Lukas Vermeer, "Democratizing online controlled experiments at Booking.com", arXiv:1710.08217, 23 October 2017** [PRIMARY] (read)

- Locator: abstract, Introduction, "Central repository of successes and failures", "Building safeguards".
- Evidence: More than a thousand concurrent experiments. Experiments are used "for asynchronous feature release and as a safety net". Decisions are decentralised to teams. A searchable repository holds every past experiment, failures included. Real-time attribution (under a minute) of each experiment's effect on business and system health. Everyone may stop a harmful experiment. The authors chose not to automate stops, to preserve ownership. Pre-registration of hypotheses and metrics, plus peer review of claimed successes, counter p-hacking.
- Quotes (read): "every change, from entire redesigns and infrastructure changes to bug fixes, is wrapped in an experiment." / "Everyone in the company must be able and feel empowered to stop harmful experiments of their own accord." / "It is therefore as much a technical as a cultural issue."
- Limits: A self-description by the platform team with no outcome data. Booking's choice against automated stops is a local judgement, and other companies (per Fabijan et al., below) automate shutdown.
- Source: [arXiv](https://arxiv.org/abs/1710.08217)

**Ya Xu, Nanyu Chen, Adrian Fernandez, Omar Sinno, Anmol Bhasin, "From Infrastructure to Culture: A/B Testing Challenges in Large Scale Social Networks", KDD 2015** [PRIMARY, peer-reviewed] (read: section 4 and conclusion)

- Locator: section 4, "Culture", subsections 4.1-4.4.
- Evidence: Names four ingredients for embedding experimentation at LinkedIn, including using one metric pipeline for both business reporting and experiments so that results are comparable and Finance can use A/B results in forecasting, and reporting site-wide impact with different thresholds for experiment owners and for managers and executives.
- Quote (read): "establishing a strong experimentation culture is also key to embedding A/B testing as part of the decision making process."
- Limits: Platform-team account. The passages read do not address leadership conduct directly.
- Source: [ACM Digital Library (DOI recalled, not re-verified)](https://dl.acm.org/doi/10.1145/2783258.2788602)

**Aleksander Fabijan et al., "The Evolution of Continuous Experimentation in Software Product Development", ICSE 2017, as summarised by Adrian Colyer, the morning paper, 29 September 2017** [RESEARCH via SECONDARY summary] (fetch of the summary)

- Evidence: The Experimentation Evolution Model (crawl, walk, run, fly) across technical, organisational and business dimensions, based on Microsoft. Early experiments exist to win funding. Gradual traffic ramp-up and alerting arrive at "run". Experiments as the default for every change, with near-real-time automatic shutdown, arrive at "fly". Data scientists move from a central team into product teams. The same crawl/walk/run/fly model is reported by search snippets to open ch. 4, "Experimentation Platform and Culture", of Kohavi, Tang & Xu, "Trustworthy Online Controlled Experiments" (Cambridge University Press, 2020), pp. 58-78; that chapter was **not read**.
- Quote (paper as quoted by the blogger): "The main purpose of the first experiments is to gain traction and evangelize the results"
- Limits: Single-company model. I read a summary, not the paper.
- Source: [blog.acolyer.org](https://blog.acolyer.org/2017/09/29/the-evolution-of-continuous-experimentation-in-software-product-development/); [Cambridge chapter page](https://core-prod.cambridgecore.org/core/books/trustworthy-online-controlled-experiments/experimentation-platform-and-culture/A83F07714647BA8454B40C256473BCEA)

### Inferences

- The documented leadership behaviours are: (a) submit one's own ideas to the test (the Amazon Order Pipeline story is a leader refusing to exempt a "safe" re-implementation); (b) fix the decision metric before the result; (c) fund a platform so the marginal experiment is cheap; (d) make failures visible and searchable; (e) give stop authority to everyone.
- Booking.com's phrasing, experiments "for asynchronous feature release and as a safety net", is the clearest primary statement that the ramped experiment and the safe release mechanism are the same machinery. That is the connection the essay needs between experimentation culture and release safety.
- The Order Pipeline story also cuts toward caution: a re-implementation believed equivalent lost 2% of revenue. The evidence it supports is "measure in production on a fraction of traffic", not "pre-release testing is unnecessary".

### Gaps

- Kohavi, Tang & Xu (2020), chapters on maturity and leadership buy-in: not read (Cambridge paywall).
- Thomke, "Experimentation Works" (2020): not read. The lists of leader obligations in the HBR articles were behind the paywall.
- No source read here covers experimentation leadership in a financial-transactions setting.

## 6. Change-management accounts: Phoenix Project, DevOps Handbook, Knight Capital, Schwartz, Smart, enterprise case talks

### Takeaway

The DevOps Handbook is the main secondary synthesis that packaged these arguments for enterprise leaders, but its text could not be read here; only chapter titles and some case-study titles are confirmed. The underlying primary and research sources for its change-approval argument were read (State of DevOps 2014; the SEC's Knight Capital order). The SEC order shows Knight's failure involved a manual, unreviewed deployment and a repurposed flag, which cuts in more than one direction.

### Cited Findings

**Gene Kim, Jez Humble, Patrick Debois, John Willis, "The DevOps Handbook" (IT Revolution, 2016; 2nd ed. 2021)** [SECONDARY synthesis] (not read; titles from snippets)

- Confirmed by publisher listings (snippet): ch. 12 is "Automate and Enable Low-Risk Releases" and opens with Chuck Rossi, Facebook's director of release engineering, on the daily code push. Ch. 18 is "Create Review and Coordination Processes to Increase Quality of Our Current Work". Ch. 23 covers integrating security and compliance into change approval. The 2nd-edition contents list "Case Study: Dark Launch of Facebook Chat (2008)", "Case Study: Peer Review at GitHub (2011)", an Etsy self-service deployment case study (2014), and a figure on blue-green deployment patterns.
- Not confirmed: the body text of ch. 11 (continuous integration), ch. 12 (dark launching, feature toggles, canary; the Dixons Retail, CSG and Etsy cases) and ch. 18 (Knight Capital as the opening case; "dangers of change approval processes"; "potential dangers of overly controlling changes"; coordination and scheduling; peer review). These section names are as given in the research brief and consistent with my recollection of the book, but **no wording was verified and page numbers were not obtained**.
- Limits: The Handbook is a secondary synthesis by advocates. Its case studies are mostly retellings of conference talks, and its statistics are drawn from the State of DevOps reports.
- Sources: [O'Reilly listing, ch. 12](https://www.oreilly.com/library/view/the-devops-handbook/9781457191381/DOHB-ch_12.xhtml); [O'Reilly listing, ch. 18](https://www.oreilly.com/library/view/the-devops-handbook/9781457191381/DOHB-ch_18.xhtml); [2nd edition excerpt, front matter](https://itrevolution.com/wp-content/uploads/2022/06/DOHB2_Excerpt.pdf)

**U.S. Securities and Exchange Commission, "In the Matter of Knight Capital Americas LLC", Release No. 34-70694, File No. 3-15570, 16 October 2013** [PRIMARY, regulator's findings] (read)

- Locator: paragraphs 13-15 (code and deployment), "Events of August 1, 2012", paragraph 26 ("Code Development and Deployment"), and the penalty section.
- Evidence: The new RLP code "repurposed a flag that was formerly used to activate the Power Peg code", functionality unused since 2003 but still present and callable. Deployment began 27 July 2012 "in stages by placing it on a limited number of servers in SMARS on successive days". A technician did not copy the new code to one of eight servers. On 1 August, orders carrying the repurposed flag reached the eighth server and triggered the old code. Result: 4 million executions in 154 stocks for more than 397 million shares in approximately 45 minutes; a loss of more than $460 million; a $12 million penalty.
- Quotes (read): "Knight did not have a second technician review this deployment" / "Knight had no written procedures that required such a review." / "Knight did not have written code development and deployment procedures for SMARS"
- Limits: The order establishes control failures under the market access rule (Rule 15c3-5). It does not say a change advisory board would have prevented the event, nor that continuous delivery would have. John Willis's later commentary (snippet) says most post-analyses of Knight, including his own, "should be considered counterfactual reasoning".
- Sources: [SEC order (PDF)](https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf); [Willis commentary on Kosli blog (snippet)](https://www.kosli.com/blog/knight-capital-a-story-about-devops-automated-governance/)

**Gene Kim, Kevin Behr, George Spafford, "The Phoenix Project" (IT Revolution, 2013)** [SECONDARY, a novel] (not read for these notes; no text verified)

- A fictional narrative used as a persuasion device. Nothing from it is recorded here because no excerpt was accessed.

**Mark Schwartz interviewed by Shaaron A. Alvares, "Mark Schwartz on DevOps, Bureaucracy and His Upcoming Book at 2019 DevOps Enterprise Summit", InfoQ, 30 October 2019** [PRIMARY interview] (fetch)

- Evidence: Bureaucratic rules usually exist for a reason. DevOps automates controls and leaves them in force. Much delay sits upstream in governance and business-case approval, before any code is written. Leaders need not fully commit before teams begin.
- Quotes (fetch): "bureaucracy is put in place for a reason" / "we're still enforcing bureaucratic rules, but we do it in an automated way which makes it much leaner." / "the governance process, which takes most of the time"
- Limits: An interview. The books "A Seat at the Table" (2017) and "War and Peace and IT" (2019) were **not read**; a search summary attributes to Schwartz the view that testing in production is among the most powerful agile risk-management techniques, without wording I could verify.
- Source: [infoq.com](https://www.infoq.com/news/2019/10/devops-bureaucracy/)

**Jonathan Smart on Barclays, reported by Manuel Pais, "Agile and DevOps at Barclays", InfoQ, 27 July 2016** [SECONDARY report of a primary talk] (fetch)

- Evidence: Barclays (about 130,000 people, more than 40 countries, per the article) assigned "control tribes" to epics at the start so security and compliance were designed in; shared principles while letting practices emerge locally; used communities of practice, a federated leadership forum, and coaching aimed especially at middle managers.
- Quotes (fetch): Smart, as reported: "lasting culture changes take years". Reporter's summary of Smart: "Imposing prescriptive frameworks or practices across the board in a top-down fashion leads to lack of engagement and trust"
- Limits: A talk write-up with no outcome metrics in the text seen. Smart's book "Sooner Safer Happier" (IT Revolution, 2020) was **not read**; the phrases "minimal viable compliance" and "safety within safety" did not appear in any source retrieved and are unverified here.
- Source: [infoq.com](https://www.infoq.com/news/2016/07/agile-devops-barclays/)

**Capital One (Tapabrata "Topo" Pal) and CSG International (Scott Prugh), DevOps Enterprise Summit talks, 2014-2018** [PRIMARY talks via SECONDARY write-ups] (snippet only)

- Capital One: pipeline design used "16 gates" as design principles, including feature toggles and an automated change order. An InformationWeek account reports a "you build it, you own it" approach and a manufacturing-style "clean room" model that stops the pipeline on failure and captures evidence. No source found says Capital One released without change approval; the reported pattern is approval automated inside the pipeline. — [Capital One tech blog](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/); [InformationWeek](https://www.informationweek.com/software-services/capital-one-devops-at-its-core)
- CSG: slide decks and write-ups report that halving batch size was followed by fewer release incidents. The reported figures vary by source: a 66% quality improvement in one deck, an 83% reduction in release-caused incidents or "release impact" in a Chef write-up. One deck reports release incidents were under 2% of total incident volume. — [Chef write-up](https://www.chef.io/blog/csg-international-and-how-devops-delivers-results); [InfoQ interview](https://www.infoq.com/articles/devops-enterprise-csg-international)
- Limits: Snippet-level only. The figures conflict across write-ups and may measure different things. Do not cite a single CSG number without checking the original talk.

### Inferences

- Knight Capital is weaker support for "CABs are dangerous" than advocacy books suggest, and also weak support for "more gates". The SEC's findings are about the absence of a second reviewer, the absence of written deployment procedures, a manual copy to eight servers, dead code left callable, and the reuse of a flag. For a feature-flag essay the pointed lessons are flag hygiene (never repurpose a flag; remove dead paths) and automated, verified, uniform deployment.
- Knight did stage the code deployment across servers over several days. The exposure, however, arrived all at once when the flag-bearing orders began flowing on 1 August. Staged deployment without staged activation and automatic halts did not bound the loss. This is an inference from paragraph 15 and the events section, not a statement in the order.
- In the regulated-enterprise accounts (Schwartz, Smart, Capital One), controls are kept and automated, and compliance staff are brought in at the start. None of the accounts retrieved describes controls being removed.

### Gaps

- DevOps Handbook body text, page locators and its presentation of Knight, Facebook Chat, Etsy, Dixons Retail, CSG and Capital One: not verified (O'Reilly returned HTTP 403; IT Revolution's excerpt contains only front matter).
- "Sooner Safer Happier", "A Seat at the Table", "War and Peace and IT", "The Phoenix Project": not read.
- Gene Kim's own DevOps Enterprise Summit talk summaries: none retrieved.

## 7. Leadership research: DORA on transformational leadership and change approval; Accelerate on top-down change; Team Topologies

### Takeaway

The best quantitative support for dropping external change approval is DORA's 2014 and 2019 findings: external approval is associated with worse throughput and no better stability. On leadership, DORA 2017 found that transformational leadership matters indirectly and is not sufficient alone. All of it is cross-sectional self-report survey evidence.

### Cited Findings

**Puppet & DORA (Forsgren, Humble, Kim, Brown, Kersten), "2017 State of DevOps Report"** [RESEARCH, survey] (read)

- Locator: "Transformational leadership" section, approximately pp. 12-19 (page labels read from text extraction); key findings summary.
- Evidence: Uses the Rafferty & Griffin (2004) five-dimension model: vision, inspirational communication, intellectual stimulation, supportive leadership, personal recognition. High-performing teams reported the strongest leadership on all five dimensions. Teams with the least transformational leaders (bottom third) "were half as likely to exhibit high IT performance". Among teams whose leaders were in the top 10%, performance still varied. Says leaders have the authority and budget for large-scale change and can "change the incentives of entire groups of engineers". Headline performance gaps for 2017: high performers had 46 times more frequent deployments, 440 times faster lead time, 96 times faster mean time to recover, and a 5 times lower change failure rate.
- Quotes (read): "leaders cannot achieve DevOps outcomes on their own." / "it is far easier to achieve success when you have effective leaders lending their support." / "transformational leadership behavior is not enough, by itself, to drive high IT performance."
- Limits: Self-selected survey respondents rating their own leaders and their own performance. Associations only. The multiples compare the extreme clusters and are sensitive to how low performers answered bucketed questions.
- Source: [DORA research archive, 2017](https://dora.dev/research/2017/) (the report was read from a saved PDF copy; this landing URL was not re-verified)

**Puppet Labs, IT Revolution, ThoughtWorks (Velasquez, Kim, Kersten, Humble), "2014 State of DevOps Report"** [RESEARCH, survey] (read)

- Locator: "Top 5 Predictors of IT Performance", item "Peer-reviewed change approval process".
- Evidence: Where external approval (for example, change approval boards) was required to deploy, IT performance decreased; where the technical team held itself accountable through peer review, it increased. External approval had no effect on restore times.
- Quote (read): "external change approval boards had a big negative impact on throughput, with negligible impact on stability."
- Limits: Survey correlation. Organisations with worse stability may have adopted external approval in response, so the causal direction is not established. "Negligible" is not "zero".
- Source: [DORA research archive, 2014](https://dora.dev/research/2014/) (read from a saved PDF copy; landing URL not re-verified)

**DORA / Google Cloud (Forsgren, Smith, Humble, Frazelle), "Accelerate: State of DevOps 2019"** [RESEARCH, survey] (read)

- Locator: section "How Do We Improve SDO & Organizational Performance?", change-management pages, approximately pp. 48-52, including sidebars "Implementing segregation of duties" and "What happens to the CAB in the continuous delivery paradigm?".
- Evidence: Tested two constructs, a heavyweight change process and a clear change process. Formal approval by an external body such as a CAB or a senior manager had a negative effect on delivery performance: respondents were 2.6 times more likely to be low performers where it existed. No evidence was found that formal approval lowers change fail rates. The hypothesis that more approvals mean slower, larger, riskier batches "was supported in the data". A clear, well-understood process had a positive effect. Recommends peer review recorded in the change system to satisfy segregation of duties, citing PCI-DSS and the NIST Risk Management Framework as examples of regimes that require it. Redefines the CAB's role as coordination, process improvement and business-level trade-offs.
- Quotes (read): "we found no evidence to support this hypothesis" / "Analysis suggests this approach will make things worse." (on adding approvals after release problems) / "from gatekeeper to process architect and information beacon"
- Limits: Self-report survey. The report concedes that regulatory control requirements are "beyond the influence of leadership and practitioners". It contains one confusingly worded sentence stating that earlier research found heavyweight approvals "negatively correlated with change failure rates"; read literally this contradicts its own conclusion, and the 2014 text it cites says "negligible" effect. Quote with care.
- Source: [2019 report (PDF)](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf); summary at [DORA capability page, "Streamlining change approval"](https://dora.dev/capabilities/streamlining-change-approval/)

**Nicole Forsgren, Jez Humble, Gene Kim, "How to Transform: Supplemental Chapter for Accelerate" (IT Revolution, 2018)** [SECONDARY guidance by the researchers] (read)

- Locator: "How Transformation Programs Fail", pp. 3-5.
- Evidence: Names three leader mistakes: treating transformation as a project with an end date; treating it as top-down, with reporting lines and processes changed without input from those affected and with the plan executed "regardless of the actual consequences"; and failing to agree measurable outcomes.
- Quotes (read): "The second mistake is to treat transformation as a top-down effort." / "teams are given the capacity, resources, and authority to make changes to their processes"
- Limits: Advice grounded in the authors' experience. This chapter presents no data showing that top-down mandates fail more often.
- Source: [IT Revolution PDF](https://itrevolution.com/wp-content/uploads/2022/06/ACC_HowToTransform.pdf)

**Matthew Skelton & Manuel Pais, "Team Topologies" (IT Revolution, 2019)** [SECONDARY synthesis] (snippet only)

- Evidence from the authors' site and secondary summaries: four team types including platform and enabling teams; the platform's purpose is reducing stream-aligned teams' cognitive load; the "thinnest viable platform" idea. Netflix's 2018 post (section 3) is a primary account of the same pattern ("paved road", centralised tooling teams as "force multipliers").
- Limits: Book not read. No exact wording verified.
- Source: [teamtopologies.com/platform-engineering](https://teamtopologies.com/platform-engineering)

### Inferences

- The DORA evidence supports a specific, limited claim for the essay: external, after-the-fact approval is not associated with fewer failed changes in survey data, while clarity of process and peer review are associated with better performance. It does not show that removing a CAB at a particular bank will be safe.
- DORA 2017's leadership finding is a caution to managers: sponsorship without architecture and technical practice does not produce the outcome. Combined with "How to Transform", the managerial job is to fund capacity and set measurable outcomes, and to leave practice choice to teams.
- DORA 2019's recommendation ("make the regular change process fast enough for emergencies") gives a concrete test for a release-train organisation: if emergency fixes bypass the train and soak, the organisation already trusts a faster path.

### Gaps

- "Accelerate" (2018) main text, including its statistical appendix, was not read.
- Rafferty & Griffin (2004) was not read.
- No peer-reviewed replication of the change-approval finding by researchers outside DORA was found.

## 8. Critiques and limits: safety engineering, configuration risk, metric gaming, reversibility

### Takeaway

The strongest critiques are scope critiques. The MTTR-first argument excludes irreversible failures by its author's own statement; safety engineers dispute that iterative methods have shown efficacy for safety-critical work; outage post-mortems show configuration and flag changes often bypass the staged rollouts applied to code; and DORA metrics are widely said to be gameable when used as targets, though the critiques found on that last point are practitioner or vendor commentary.

### Cited Findings

**Nancy Leveson and others, "[SystemSafety] Agile methods" mailing-list thread, System Safety List (University of Bielefeld), August-September 2013** [PRIMARY expert opinion, informal] (fetch of one message quoting others)

- Evidence: Leveson argues that use of agile by medical-device makers shows nothing about its efficacy for safety. Jon Davies argues agile conflicts with what is known about building high-integrity software. Steve Tockey thinks it possible but costly. A search summary of the same thread reports Martyn Thomas relaying that Kent Beck would not recommend XP for safety-critical work (snippet; not verified).
- Quotes (fetch): Leveson: "does not prove anything about their efficacy for safety-critical systems" / Davies: "this is fundamentally in conflict with many of the things we know about building high integrity software"
- Limits: A mailing-list exchange about agile methods generally, in 2013. It does not address continuous delivery, canaries or flags specifically. A search summary of Leveson's 2019 essay on nuclear command systems reports her objection to skipping up-front requirements in safety-critical applications while allowing that the approach may suit consumer apps (snippet only). I found no text in which Leveson directly evaluates progressive delivery.
- Source: [list archive message](https://lists.techfak.uni-bielefeld.de/pipermail/systemsafety/2013-September/000574.html)

**Dan Luu, "Reading postmortems" (danluu.com; undated, references events through November 2014)** [SECONDARY analysis of public post-mortems] (fetch)

- Evidence: Across public post-mortems, configuration changes are the commonest cause of the worst outages, because the staged rollout applied to code is often not applied to configuration. Error-handling paths are a major source of critical failures. Missing monitoring is a frequent contributing factor.
- Quotes (fetch): "Configuration bugs, not code bugs, are the most common cause I've seen of really bad outages." / "risky code changes are basically never simultaneously pushed out to all machines"
- Limits: An informal reading of published post-mortems, with publication bias. Not a statistical study.
- Source: [danluu.com/postmortem-lessons](https://danluu.com/postmortem-lessons/)

**SEC Knight Capital order (section 6)** [PRIMARY] (read): a flag-triggered failure in a trading system that lost more than $460 million in about 45 minutes. A finance audience will raise it as the standard counter-example. Its facts concern flag reuse, dead code and manual deployment without review. — [SEC order](https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf)

**Allspaw's own scope limit (section 1)** [PRIMARY] (fetch): "some types of failures shouldn't ever happen" and the 2017 retraction of averaged MTTR. — [kitchensoap.com](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)

**Kohavi et al. 2013 (section 5)** [PRIMARY] (read): the paper opens its Tenets section with "Running online controlled experiments is not applicable for every organization." — [paper](http://bit.ly/ExPScale)

**Canary costs** [SECONDARY] (fetch): running multiple versions at once, and database changes that must serve both versions (Sato 2014). — [martinfowler.com](https://martinfowler.com/bliki/CanaryRelease.html)

**Hillel Wayne, "We Are Not Special" (part 2 of the Crossover Project), hillelwayne.com, 20 January 2021** [RESEARCH, small interview study] (fetch)

- Evidence: Interviewees who worked in both traditional and software engineering agree that software iterates far faster, and note the consequence that fixes for physical problems get pushed into software.
- Quote (fetch, interviewee "Mike"): "The software engineer is being squeezed by the rest of the team."
- Limits: 17 interviewees per secondary descriptions; not about release practice. I found no essay by Wayne directly critiquing continuous deployment.
- Source: [hillelwayne.com](https://www.hillelwayne.com/post/we-are-not-special/)

**Critiques that DORA metrics are gamed** [SECONDARY, practitioner and vendor commentary] (snippet only)

- Evidence: Recurring claims that once deployment frequency appears in performance reviews, teams inflate it with no-op deploys, empty flags and artificially split releases; that the metrics were designed as diagnostics and not as targets; and that the Elite tier's thresholds assume environments without regulatory change-advisory requirements. The proposed mitigation is pairing frequency with change failure rate.
- Limits: Blogs and vendor posts with no data. No peer-reviewed critique of DORA's survey method or cluster analysis was found in the searches run.
- Sources: [Scrums.com](https://www.scrums.com/blog/dora-metrics-problems); [The New Stack](https://thenewstack.io/the-case-against-metrics-for-developer-productivity/)

**Burnout and cognitive load** [PRIMARY] (read): Netflix's own trade-offs section (section 3) warns that the model can devolve "into everyone jumping in on high-interrupt work like production issues, which can lead to burnout." — [netflixtechblog.com](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)

### Inferences

- A faithful statement of the limits for finance engineers: flags, canaries and ramps bound exposure only for failures that are (a) detectable quickly by an automated signal, (b) proportional to traffic exposed, and (c) reversible. Ledger corruption, mis-sent payments, mispriced trades and regulatory-reporting errors can fail any of the three. For those, the transition literature itself (Allspaw's caveat) does not claim MTTR dominance.
- Luu's observation and the Knight order together imply that the flag system is itself production change machinery and needs the same staged rollout, review and audit as code. A flag flip that takes effect everywhere at once reintroduces the big-bang release that the ramp was meant to remove.
- The Goodhart critique implies leaders should not set deploy-frequency targets. This is consistent with "How to Transform" (teams set their own target conditions) and with SRE's pairing of velocity with an error budget.
- Soak has a legitimate residual use: defects that appear only with elapsed time or calendar events (leaks, end-of-day and end-of-month batch cycles, settlement cycles). None of the sources read addresses calendar-driven financial processing, so the essay should present this as an open limit and not as something the literature has refuted.

### Gaps

- No direct, sourced statement by Leveson on canary or flag-based delivery was found; "Engineering a Safer World" was not consulted.
- No rigorous public critique of DORA's methodology was located.
- "Move fast" critiques after specific large outages were not researched beyond Knight; post-2022 events are outside the brief's period.
- No source was found that empirically compares soak time against canary analysis for defect detection.
