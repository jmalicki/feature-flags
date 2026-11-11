# Evidence review: how the essay uses its research, and how it should

Reviewed 2026-11-10 against `essay.md`, the synthesis report, the research notes and the older dossiers. No existing file was edited.

Short names for the files quoted below (all under `research_notes/Testing gates to ramping culture/` unless a path is given):

- `gfqo` = `google_facebook_quality_ownership.md`
- `ms` = `microsoft.md`
- `anle` = `amazon_netflix_linkedin_etsy.md`
- `pcbr` = `payments_core_banking_release.md`
- `cef` = `counter_evidence_and_failures.md`
- `ear` = `empirical_and_regulated.md`
- `mgmt` = `management_arguments.md`
- `qvA`, `qvB` = `quote_verification_a.md`, `quote_verification_b.md`
- `synthesis` = `reports/Testing gates to ramping culture.md`
- `research/payments.md` = the older payments dossier

Verification labels are the notes' own: FULL TEXT or READ-DIRECT (the researcher read the document), VERBATIM (re-checked against the raw page in `qvA` or `qvB`), RELAYED, FETCH or TOOL (a fetch tool returned the wording; not re-checked), SNIPPET (do not quote).

How far this review read: the essay, the synthesis, both verification files, `mgmt`, `ms`, `anle` and `pcbr` were read in full. `gfqo` section 4 (OANDA), `cef` (Knight and the finance failures), and `ear` sections 2 and 4 were read in full. The remaining notes (`audit_and_compliance.md`, `experiments_on_financial_clients.md`, `rollback_authority.md`, `rollback_technology.md`, `staging_soak_vs_production.md`, `qa_role_transitions.md`, `chart_data.md`) and the older `research/` dossiers were searched for the named cases and read in the matching passages only, relying on the synthesis for the rest. Anything in those files that the synthesis does not surface may be missing here.

## 1. How the essay currently uses evidence

### The counts

Counted on the body of `essay.md` (everything before "Sources and method", image lines removed):

| Measure | Value |
| --- | --- |
| Body length with citations stripped | about 5,530 words, 331 sentences |
| Citations (linked parentheticals) | 89 |
| Distinct source URLs | 72 |
| Named companies and firms | about 30 |
| Named regulators, standards and rule texts | about 10 |
| Total named organisations | about 40 |
| Average spacing | one citation every 62 words; a new source every 77 words |
| Average words in sentences that mention a given organisation | about 70 (median about 35, one to two sentences) |
| Organisations given more than three consecutive sentences | 6 of about 40 |

The six that get more than three consecutive sentences are Knight Capital (two paragraphs, about 230 words), Amazon (two paragraphs in section 2, about 150 words), the FCA review (about 160 words), Uber (two bullets, about 170 words), Netflix (four sentences, about 85 words) and OANDA (four sentences in each of two places, never joined). Seventeen of the thirty companies get one or two sentences: Atlassian, Flickr, GitHub, LinkedIn, Adyen, Wealthfront, Slack, Dropbox, CrowdStrike, Cloudflare, RBS, Roblox, DBS, Nubank, Azure DevOps, the Financial Times and Booking.com.

The counts are approximate: sentence splitting was by script, and "organisation" lumps Google with Google Cloud and Microsoft with Azure DevOps.

### The effect

- The unit of the essay is the claim plus citation. A typical paragraph makes an assertion and then lists three firms that did it, one sentence each. Section 3 does this with Facebook, Flickr and Netflix; section 4 with Google, Kohavi, LinkedIn, Uber and Booking.com in five consecutive sentences; section 7 with Monzo, Google, and Brian Harry in three.
- Almost nobody in the essay is a person who believed something, did something and found out. Brian Harry appears once, as the author of a closing aphorism. Sarah Wells appears as a statistic. OANDA's management appears in one sentence. There is no moment at which a reader sees someone in their own position being wrong.
- The essay's best material is split. OANDA is in section 5 (the banks) and section 7 (the failure) and the tooling figure is in a third place; the reader never learns it is one firm with one story. Azure DevOps is a 45-minute detail in section 6 and a quotation in section 7. Stripe's outage is in sections 2 and 6.
- The only case told as a story is Knight, and it is the case against. The emotional weight of the essay therefore sits on a disaster, while the positive case is a list.
- The essay is honest and well caveated, and that should survive. What it lacks is selection. A director finishes it knowing that many firms are cited and cannot retell one of them.

## 2. The richest stories for this audience, ranked

Ranking is by closeness to a payments or core-banking director's situation, not fame.

### 2.1 OANDA: the same software under two regimes, and what management did after a loss

Why first: it is an FX trading platform, it had bank clients who forbade the practice, it lost real money under the practice, and its management reacted exactly as the reader's would. No other case in the research has all four.

The arc available (all from Savor et al., ICSE 2016, FULL text read; `gfqo` section 4, `ear` lines 226-240, `staging_soak_vs_production.md` lines 103-110):

- Situation. An FX platform moving "many billions of dollars" a day (`gfqo` takeaway), "About 80 developers, all in Toronto", "Over 20,000 deployments recorded April 2010-June 2014". No test team; a release-engineering team that could reject updates. Its pre-production stage was "a full trading system, but one that only trades with virtual money", with "real clients" and a larger client base than the real-money system.
- What people believed. The banks that licensed the same code believed infrequent release was safer: their "policies did not allow continuous deployment"; "The banks did not allow continuous updates of the software running on their servers."
- What happened at the banks. Bugs the bank deemed non-critical went unfixed "for many months"; each release bundled "thousands of changes", "which increased anxiety" and led to much more testing; failures were harder to isolate; developers fixed obsolete code "with a negative attitude"; the bank-hosted versions were at "a competitive disadvantage".
- The failure. After several successful years, "a major failure occurred that cost the company a significant amount of money within seconds".
- The reflex. Senior management's first reaction was more hierarchy, more approvals, and "a full-blown, separate and traditional testing team". The authors call it "runaway process inflation".
- What the post-mortem found. Failing unit tests had correctly flagged the bug and been ignored among false positives. Engineering persuaded management to require test output in the deployment decision.
- The natural experiment. Under executives with a business background from mid-2012, "the average number of deployments dropped by 23%", with the engineering team largely unchanged; it recovered under a later supportive team.
- What they said afterwards. A continuous-deployment champion in senior management is critical "especially for non-technical management teams". Tooling was 15% of engineers; "OANDA spent 2 years perfecting continuous deployment for mission critical infrastructure". And the honest admissions: schema changes "were always ad hoc and full of fear"; a separate release team "is valuable when reliable software is important".

Numbers: 80 developers; 20,000 deployments in about four years; 23%; 15%; 2 years; average deployed change 273 lines, median 57.

Lesson for a payments director: you are the bank in this story. The batch creates the anxiety that creates the testing that creates the batch. And when the failure comes, the question is whether you add a gate or fix the signal.

### 2.2 Knight Capital from the SEC order: a staged deployment, a single activation, an improvised rollback

Why second: every reader already knows it and believes it supports them. Told from the order, it does the opposite for soak, and supports them on four-eyes review. All quotations FULL-TEXT, `cef` lines 19-36.

The arc:

- Situation. Knight handled about ten percent of trading in listed US equities. New code for an NYSE programme starting 1 August 2012 "repurposed a flag that was formerly used to activate the Power Peg code", which "remained present and callable". Use of Power Peg ceased in 2003; in 2005 Knight moved a function it depended on and "did not retest the Power Peg code after moving the cumulative quantity function".
- What they did. "Beginning on July 27, 2012, Knight deployed the new RLP code in SMARS in stages by placing it on a limited number of servers in SMARS on successive days." One technician "did not copy the new code to one of the eight SMARS computer servers." "Knight did not have a second technician review this deployment". "Knight had no written procedures that required such a review."
- The warning nobody read. From about 8:01 a.m., 97 automated emails referencing "Power Peg disabled" went to Knight staff before the 9:30 open. "Knight did not design these types of messages to be system alerts, and Knight personnel generally did not review them".
- What happened. Processing 212 small retail orders, the eighth server sent child orders "without regard to the number of share executions Knight had already received": "over 4 million executions in 154 stocks for more than 397 million shares" in about 45 minutes; loss "over $460 million".
- The rollback. "Knight uninstalled the new RLP code from the seven servers where it had been deployed correctly. This action worsened the problem".
- The detail that makes it a management story. Ten months earlier, in October 2011, a test-data error had cost Knight nearly $7.5 million. It fixed the specific cause and "did not broadly consider whether it had sufficient controls to prevent the entry of erroneous orders".
- What the regulator said afterwards. "a written procedure requiring a simple double-check of the deployment of the RLP code could have identified that a server had been missed"; Knight "needed clear guidance for its technology personnel as to when to disconnect a malfunctioning system from the market."

Lesson: five days on production servers observed nothing because nothing exercised the path. A three-day soak would have observed the same nothing. The remedy is a second pair of eyes on the deployment, a ramp of the behaviour, and a rehearsed stop.

### 2.3 Azure DevOps and Brian Harry: a vice-president's four years of public confession

Why third: it is the only case where the executive responsible wrote it down as it happened, post by post, including what did not work. The team also looks like the reader: a batched release every three weeks, promoted through tiers, with a lead engineer approving the first. All quotations below are FULL-TEXT in `ms` unless marked.

The arc:

- Situation, November 2013. The morning of the Visual Studio 2013 launch. The team switched on a batch of feature flags on a service that ran as one instance. Bekker's report of Buck Hodges (RELAYED) says about two dozen features were flipped an hour before the keynote.
- What happened. Harry: "I feel terrible about it and I can't apologize enough." They rolled back "all of the feature switches that we enabled that morning ... Unfortunately it didn't. And no one is completely sure why." The flags had "been changed enough times that it's hard to tell for certain" whether the rollback was done correctly.
- The diagnosis. "Aside from our ability to control with feature flags (which is very nice) all customers are affected or none." "The service is now at a scale where there's just too much risk in that."
- The first remedy, and its failure. Deployments moved to weekends. Sprint 59 had people "working all day Saturday and Sunday". "Time shifting the deployment isn't a fix, it's a mitigation". "it's clear weekend deployments aren't really going to be sustainable".
- The second remedy, February 2014. An instance "affectionately called 'ring 0'" which "will be where all production deployments happen first", holding accounts that volunteered, Harry's own among them. The goal: "every deployment is a 'non-event'". And his refusal to declare victory: "I'd like to see 3 or 4 smooth ones in a row before I'm willing to give too much credit."
- The relapse, November 2014. A 7.5-hour outage. The fault was behind a flag, "So, once we identified the cause, it was easy to mitigate". But "it took approximately 45 minutes to figure out how to turn it off due to tooling issues and lack of documentation", and "66 minutes to get ahold of an engineer that understood the malfunctioning code" against an expectation of 15. His conclusion: "Being down 30% is better than being down 100%."
- The long part, 2015 to 2017. "We combined the dev and test orgs into a consolidating 'engineering' org." They "set out to completely throw away our 10's of thousands of tests that took 8 years to create": 27,000 legacy tests at sprint 78, zero at sprint 120, "42 sprints over 126 weeks".
- What he said afterwards. He names what was given up: "clearly measurable and controllable investment in test, expertise and career growth in the testing discipline". He admits impatience: "18 months into it and lots of missed opportunity cost later, I started to agitate about when we were going to be 'done'". He ties the pieces together: "We couldn't really rely on Test in Production the way we are headed without also doing ring based deployments". And: "If we'd tried to do it all at once. I'm sure we would have failed."
- The reversal that shows the change worked. Later Microsoft guidance (`ms`, Learn page, FULL-TEXT, undated beyond a 2022 revision): "it becomes advantageous to push deployments during working hours, especially early in the day and early in the week". The team that hid deployments at weekends ended by deploying on Monday morning. Hodges, 2016: "We learned the hard way that it's not the morning of the event."

Numbers: 7.5 hours; 45 minutes; 66 against 15; 27,000 tests to zero in 126 weeks; about 24 hours of bake per tier; five tiers.

Lesson: flags alone are not the new way. A director will buy a flag tool and think the job is done. Harry had flags in 2013 and they did not save him. He needed somewhere small to go first, a switch people knew how to use, and years.

### 2.4 Uber: shadowing a payment you cannot send twice, and the arithmetic of confidence

Why fourth: it is the direct answer to "you cannot test in production with money". All wording VERBATIM in `qvB` items 1 and 3 (read from archive captures).

The arc:

- The problem in the engineers' words. "Since a PSP is external, we don't want to make the same request in our legacy and new systems. It would double the traffic, the behavior of the PSP might be nondeterministic, and it would not be clear which was the primary system for the request."
- What they did. "When the legacy system made a request, we cached both the request and the response from the PSP with the intent to replay the traffic to the new Auth service later." "All original production requests were forwarded to the Auth Service with a programmed delay".
- What happened. "After running the validation for a few days, we found dozens of argument mismatches across different PSPs and edge cases for state transition." Their advice (`pcbr`, FETCH): "Don't expect to get the validation right the first time."
- Then the ramp. "a couple of employees", "all Uber employees", then "incremental cohorts of real-world users, going from .25 percent, 1 percent, 5 percent until we were 100 percent rolled out", "one payment method at a time".
- The ledger, five years later. "We wanted our backfill to be at least 99.99% complete and correct as measured by shadow validation." "For 6 nines, you have to look at data of 100 million comparisons to give any results with good confidence. This means if your shadow validation is comparing 1,000 records/second, then you need to wait for a bit more than one day just to collect sufficient data. With 7 nines, you will have to wait 12 days. In practical terms this would slow the project to a halt."
- The limit they found. "live traffic tends to access only recent data. So, if there are any problems lurking in the cold data that is infrequently accessed, it will not be caught by shadow validation." So: "we compared 760 billion records in a single job." "We were able to do this migration over two years without any downtime or outages".

Lesson: these engineers waited longer than three days. They waited on a count of agreements, and they could say what the count bought.

### 2.5 Starling: a regulated bank that kept its approvals and released daily

Why fifth: it removes the false choice between "keep our gates" and "release often", and it is the only place in the research where an auditor's reaction is recorded at all.

Material (2017 and 2018 slide decks READ-DIRECT in `pcbr`; 2019 panel FETCH or TOOL; 2025 post VERBATIM in `qvB` item 11):

- 2017, Greg Hawkins, CTO. A slide that reads only: "you can do anything you can undo". "continual deployment to non-prod, sign-off into prod". "in first 221 days of production environment: 134 releases of software (~ 1 per weekday)".
- 2018, Jason Maude. "code released to production up to 5 times a day". The "take ownership" ceremony: "all engineers explicitly bless their commits in slack"; "everyone gets a last ditch 'OMG' opportunity"; "everyone asserts their change is 'good for prod'". The release-in-progress GIF: "our auditors loved this one"; "yes it's in our release documentation". Closing line: "You can do anything you can undo".
- 2019 panel (FETCH). Maude: "we use Slack for people to gain permission in a four-eyes manner to initiate a deployment to production"; the control "doesn't require us to sign bits of paper". Hawkins, moderating, pushes back: "I'm a bit concerned that you might be ignoring some of the segregation of responsibility". Suhail Patel of Monzo: "Sometimes the regulator's impressed with how far we've thought about these things."
- 2025 (VERBATIM). "we have to go through three layers of safeguards: Commit Approval, Technical Approval and Business Approval". "Business Approval is here to manage our overall risk as a regulated bank." The release tool is "our immutable audit of what software we release to production". "Starling actually release to production multiple times per day."

Lesson: the approvals stayed. The batch went. Eight years on, the bank has more named approvers than most release trains, and releases several times a day.

### 2.6 The regulator's own record: the FCA review, RBS and TSB

Why sixth: this is evidence, not story, but it is the reader's regulator speaking, and RBS is a compact story with a perfect moral.

- FCA multi-firm review (FULL, `ear` section 4). 23 firms, "over 1m production changes implemented in 2019". "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles." Nearly 68,000 major changes produced 2,600 incidents, "an average failure rate of 3.8%, compared to 1.6% from all change types", "despite the increased oversight". "CABs approved over 90% of the major changes they reviewed, and in some firms the CAB had not rejected a single change during 2019. This raises questions over the effectiveness of CABs as an assurance mechanism." And a phrase the essay does not use: "many CABs perform more of a 'flight control' role rather than an assurance function."
- RBS, June 2012 (FULL-TEXT for cited paragraphs, `cef` lines 83-92). Sunday: a batch-scheduler upgrade from Version 1 to Version 2A. Monday: anomalies. Tuesday: the team backed it out. "Technology Services had only tested the consequences of backing out Version 2 to Version 1." "This was the underlying cause of the IT Incident." At least 6.5 million customers; FCA penalty £42,000,000; redress about £70.3 million. Back-out tests "did not use representative data in the queues".
- TSB, April 2018 (FULL-TEXT for cited paragraphs, `cef` lines 69-81). "a predominantly single event data migration". "Testing only concluded the day before the decision to migrate was taken." After go-live, "if a major incident occurred, TSB would be unable to roll back". 225,492 complaints; £32,705,762 redress.

Lesson: the largest UK banking IT incident of 2012 was caused by a rollback that had been tested, against the wrong version. A way back that has not been rehearsed on the thing actually running is not a way back.

### 2.7 Netflix and Amazon: what the wait had become

Why seventh: two short mirrors for the soak. Neither is a finance firm, so each should be brief, but each has one line the reader will remember.

- Netflix, 2012 (VERBATIM, `qvA` item 12; other lines FULL TEXT in `anle`). "Deployments felt like walking through wet sand." "Canarying was devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality." The failed half-measure: developers "would often defer to the ops release specialist", and operations staff "found it hard to prioritize automation so that others didn't need to rely on them." The condition: "Without these, teams risk overload and burnout." The result: "canaries take hours instead of days".
- Amazon (FULL TEXT, `anle` source A4). "We discovered that it was taking, on average, 16 days from code check-in to production", of which "almost 14 days" was waiting for people. "many teams were not sure that continuous deployment would work." They were told to "encode their current release process, manual steps and all, in a pipeline". The admission that the metric backfired: it "could lead teams to automate their release process without providing for any testing." Priority order: "we prioritize availability first, then speed, and then making it easier for our engineers."

Lesson: "nothing broke" is not a finding. And the first step removes no control.

### 2.8 Stripe, July 2019, and Square: the honest limits, from payments firms

Why eighth: short, from the reader's own industry, and they stop the essay overclaiming.

- Stripe (VERBATIM, `qvB` item 10). "we performed thorough testing in our quality assurance environment, and executed a phased production rollout, starting with less critical clusters and moving on to increasingly critical ones." "The new version operated properly in production for the past three months, including many successful failovers." Then: "our revert to a known stable version interacted poorly with a recently-introduced configuration change to the production shards."
- Square (VERBATIM, `qvB` item 4). "this actually caught a lot of subtle bugs." "all reads going to Spot for around six weeks prior to turning off local writes." And the confession: "we made a mistake that was obvious in hindsight by using randomized rollouts instead of stable to the merchant."

Lesson: time does not find a fault whose trigger does not occur; the revert is a change too; ramp by client.

### Considered and ranked lower

- Financial Times (VERBATIM, `qvB` item 12). Good numbers and a good line, but a newspaper. Use the numbers briefly.
- Allspaw's letter to Yahoo management (FULL TEXT, `anle` E1). "A significant part of my job was working towards saying 'go', not 'no-go'." "This culture was taught, not born." Excellent single sentence for the manager's role; the firm is a photo site, so one line only.
- Facebook Chat. The origin of the term, already in the essay; not persuasive to a bank.
- Monzo. Useful facts (reconciliation; ">90% of the effort"), no narrative in the notes.
- Wealthfront. Existence proof from 2010 at a tiny firm; `qa_role_transitions.md` says it "establishes existence, not sufficiency".
- Booking.com, LinkedIn's halt. Not this audience's world; LinkedIn's two-month figure rests on Wired only.

## 3. What the essay does with each, and what is lost

| Story | What the essay says | What is lost |
| --- | --- | --- |
| OANDA | Section 5: "OANDA deployed continuously. It also licensed the same software to large banks whose policies forbade that. At the banks each release bundled thousands of changes, which raised anxiety and led to much more testing". Section 7: "after a failure that 'cost the company a significant amount of money within seconds', senior management reached for more approvals". Section 7 again: "15% at OANDA, which spent two years". | Three fragments in three places; the reader never sees one firm. Missing entirely: the 23% drop, the virtual-money demo system, the ignored unit tests as the twist, "runaway process inflation", the authors' own admissions. The essay introduces OANDA as "a study of continuous deployment at Facebook and at OANDA", which buries the only FX firm behind Facebook. |
| Knight | Two paragraphs and a figure in section 9. | The best-told case in the essay. Missing: the 2005 untested refactor, the October 2011 $7.5 million prior loss, the 212 retail orders, "did not design these types of messages to be system alerts". It sits near the end, after the reader's objection has gone unanswered for 5,000 words. |
| Azure DevOps | Section 6: "it took the team approximately 45 minutes 'to figure out how to turn it off'". Section 7: "Brian Harry, looking back on six years of change at Microsoft's Azure DevOps, wrote: 'If we'd tried to do it all at once. I'm sure we would have failed.'" | The whole story. No launch-day outage, no "all customers are affected or none", no weekends, no ring 0, no 66 minutes, no test rewrite, no admissions. The quotation in section 7 has no force because the reader has not seen what the six years contained. |
| Uber | Two bullets in section 8, with a figure. | Mostly well used. Missing the engineers' own statement of the problem, "Don't expect to get the validation right the first time", the cold-data sentence in their words, and "over two years". It reads as a technique, not as people solving the reader's objection. |
| Starling | Section 7, three sentences: "a visible release-in-progress signal about which its slides say 'our auditors loved this one'" and "three approvals for each of several daily releases". | "You can do anything you can undo" is absent, and it is the essay's thesis in seven words from a bank's CTO. Also absent: 134 releases in 221 days, the "OMG" opportunity, "doesn't require us to sign bits of paper", the business-approval sentence. Buried under a bold heading about approval. |
| FCA review | Section 1, one good paragraph and a figure. | Well used. Missing "flight control", the 13,767 incidents, and the firms' own "wide support for carrying out smaller changes gradually". |
| RBS | Section 9: "At RBS in 2012, a back-out of a batch-scheduler upgrade caused an incident that affected millions of customers. The FCA found the bank 'had only tested the consequences of backing out Version 2 to Version 1'". | The Sunday, Monday, Tuesday sequence; 6.5 million; £42 million; and its natural home, which is section 6 on rollback, not a list of failures. |
| TSB | Section 9, three sentences with numbers. | Adequate. "Testing only concluded the day before the decision to migrate was taken" would land. |
| Netflix | Section 2: the endurance quotation. Section 7: the hybrid. | Used well but split; "walking through wet sand" is absent. |
| Amazon | Section 2 (16 days; the pipeline), section 10 ("encode"). | Used well. Missing "many teams were not sure that continuous deployment would work" and the metric that backfired. |
| Stripe 2019 | Section 2 (three months) and section 6 (revert). | Split; each half weakens without the other. |
| Square | Section 3 ("caught a lot of subtle bugs"), section 4 (randomised rollout), section 5 (six weeks). | Three fragments; the author's "a mistake that was obvious in hindsight" is paraphrased away. |
| Financial Times | Section 5, three sentences. | The 16% is omitted ("one or two of those would fail"), so the before-and-after has no before. The Saturday releases negotiated with editorial are absent. |
| Allspaw | Section 7: the blameless-review argument. | The letter to management is absent. |

## 4. Persuasive evidence that is absent from the essay

- OANDA's 23% drop under process-minded executives (`gfqo`, `ear`). The notes call it "the most direct published evidence that management stance alone moves delivery behaviour". The essay's closing claim is that the work falls to managers; this is the one measured support for it.
- The whole Azure DevOps arc of 2013 to 2017 (`ms`), as in 2.3.
- "You can do anything you can undo" (`pcbr`, READ-DIRECT, Starling 2017 and 2018).
- Knight's prior $7.5 million loss in October 2011 and its narrow fix (`cef`, ¶33). It turns Knight from bad luck into a pattern of answering a failure narrowly.
- A re-implementation believed equivalent, tested anyway. Kohavi et al. 2013 (`ms`, `mgmt`, FULL-TEXT): Amazon's rewritten order pipeline, having "passed all exit criteria", failed its A/B test with a 2% revenue loss and "shipped after five iterations". The essay says "A re-implementation is a change too" and gives no example; this is the example, and it is an order pipeline.
- Capital One's governance director, a former auditor (`synthesis`, `ear`; RELAYED): "The biggest hurdle is often that one person cannot do it all and maintain appropriate segregation of duties"; "Risk cannot be mitigated with typical 'CI/CD' automation alone." An auditor's voice from a bank, which the essay lacks.
- "Sometimes the regulator's impressed" (Monzo's Patel, 2019 panel, FETCH) and Paybase on PCI certification involving "training the auditor of how containers work" (`audit_and_compliance.md`, TOOL).
- Monzo's own trend. `research/payments.md` PAY06 records that Monzo "reported more deployments per engineer while incidents fell and the rollback proportion stayed roughly constant", with the author's warning that these are imperfect proxies; `chart_data.md` adds that the post's charts have no readable values. The essay's gap list says "No bank or payments firm has released incident figures from before and after". That stays true of figures, but a bank has published a direction, and the essay does not say so.
- Slack: 73% of customer-facing incidents triggered by its own change; customer impact hours "reduced from the peak by 90%" (VERBATIM, `qvB` item 13). The one large measured improvement in the research, unused.
- DORA 2019 (`mgmt`, read): "Organizations often respond to problems with software releases by introducing additional process and more heavyweight approvals. Analysis suggests this approach will make things worse." It names OANDA's reflex in general terms. DORA 2014: "external change approval boards had a big negative impact on throughput, with negligible impact on stability." Both are survey associations.
- Nasdaq and the Facebook listing (`cef`, FULL-TEXT). Nasdaq tested its IPO cross in production with a test symbol but "limited the total number of orders that could be received in the test security to 40,000 orders"; members entered "over 496,000 orders". The fix was approved "within a few minutes" while "no one on the Code Blue call knew the precise cause". A capital-markets reader will know it, and it shows test scale mattering.
- MiFID II RTS 6 (`synthesis`, relayed): a firm must "be able to cancel immediately, as an emergency measure, any or all of its unexecuted orders". Trading regulation already holds that turning exposure off must be immediate while turning it up is controlled.
- The cost of the alternative. Bank of England RTGS renewal (`pcbr`, READ-DIRECT, NAO): old and new "could not operate simultaneously", so "a 'big bang' approach"; about 18 months late, £431 million, 15% over budget.
- Etsy's cardholder-data environment (`ear`, TOOL): "we built a whole separate Etsy, essentially", with a ticket for every change and a normal change still reaching production in under an hour.
- Allspaw's letter (`anle`, FULL TEXT): "A significant part of my job was working towards saying 'go', not 'no-go'."
- The counterweight the essay omits. Yuan et al. (`synthesis`): 98% of sampled catastrophic failures reproduced on three or fewer nodes and 77% by a unit test. A sceptical director will find it; better that the essay raises it.

## 5. Evidence in the essay that is decorative

Cut, or move to notes or a figure caption:

- Section 1, the roll-call paragraph: "Facebook launched its chat system this way in 2008. Amazon, Google, Netflix and Microsoft have published their versions in detail. Uber's payments group, Square and Stripe ... Monzo and Starling". Nine names in four sentences before any argument. Keep the FFIEC sentence.
- Section 3: Flickr 2009, Facebook's Gatekeeper sentence and Netflix 2013, three citations for "dormant code is ordinary". GitHub's merge rewrite is a good case and not this audience's; one clause at most.
- Section 4, the convergence paragraph: Google 2010, Kohavi 2007, LinkedIn 2014, Uber 2018 and Booking.com in five sentences. It is history of ideas. One sentence without names would do.
- Section 4, the sources line under figure 6 (seven citations).
- Section 6: Netflix Asgard 2012, Humble and Farley chapter 5, Wealthfront's five seconds. The three-kinds-of-rollback point stands without them. Wealthfront is an instance-level rollback on ten machines at a very small firm in 2010.
- Section 6: Booking.com's stop rule and the Slack and Monzo mention. Keep Google's "rolls back first and investigates the problem second" and Mace's line.
- Section 7: Dropbox; the Schermann survey (63% of 187); Booking.com's training cost; Kohavi on shipping goals; Bland's five years; Vogels's phrase. Each is one sentence in support of a point already made.
- Section 8: the Basel parallel-run sentence; Adyen's month; the idempotency and append-only citations. True and off the line of argument.
- Section 9: Google Cloud 2025, CrowdStrike, Cloudflare, Roblox and Uber's 1,381 flags, five bold-headed mini-cases. They make a catalogue of other people's outages. One sentence naming the pattern, with Google's remedy if a quotation is wanted, is enough. Roblox carries a caveat (see section 7) that costs more words than the case is worth.
- Section 8: DBS in one sentence. Either explain it (a supervisor answered change failures with a six-month pause) or cut it.

## 6. The ten most persuasive verified numbers

| # | Number | Source and status | Caveat that must travel | Essay's use |
| --- | --- | --- | --- | --- |
| 1 | Major changes failed at 3.8% against 1.6% for all changes, "despite the increased oversight" | FCA review, FULL (`ear`) | 23 firms' own records, inconsistent definitions, association only; published 2021 on 2019 data | Used well, section 1 and figure |
| 2 | Change boards "approved over 90% of the major changes they reviewed"; some rejected none in 2019 | FCA review, FULL | The FCA does not recommend abolishing boards | Used well |
| 3 | 16 days from check-in to production, "almost 14 days" waiting | Mansour, FULL TEXT (`anle`) | Undated ("Over 10 years ago" in 2019); no sample size | Used well, twice; the best-used number in the essay |
| 4 | Knight: 8 servers, 1 missed; 97 unread emails; about 45 minutes; over 4 million executions; over $460 million | SEC order, FULL-TEXT (`cef`) | Settled order, "without admitting or denying" | Used well |
| 5 | OANDA: deployments "dropped by 23%" under process-minded executives, team largely unchanged | Savor et al., FULL (`gfqo`) | One firm, uncontrolled; measures deployment count, not quality; insider authors | Not used |
| 6 | Azure DevOps: "approximately 45 minutes to figure out how to turn it off"; 66 minutes to reach an engineer against 15 expected; 7.5-hour outage | Harry 2014, FULL-TEXT (`ms`) | The faulty change was another team's (SQL Azure) | 45 minutes used as a detail; 66 and 7.5 hours not used |
| 7 | Uber: bar of 99.99%; six nines needs 100 million comparisons, "a bit more than one day" at 1,000 records a second; seven nines 12 days; 760 billion records in one job | `qvB` item 3, on page | 760 billion is the largest single job, not a total; migration took "over two years" | Used well |
| 8 | Financial Times: 12 releases a year, "about a 16% failure rate"; 2,500 releases in 2017, "less than 25" failed | `qvB` item 12, on page | One group; speaker's own definition; "I'm pretty confident"; 16% derived from "one or two" of 12 | Half used: the 16% is dropped |
| 9 | RBS: at least 6.5 million customers, £42 million FCA penalty, about £70.3 million redress, from an untested back-out. TSB: 225,492 complaints, £32.7 million redress | FCA final notices, FULL-TEXT for cited paragraphs (`cef`) | PRA notices not read | TSB numbers used; RBS reduced to "millions of customers" |
| 10 | Slack: 73% of customer-facing incidents triggered by its own change; impact hours down 90% from peak | `qvB` item 13, on page | Baseline is the peak quarter (February to April 2024); many projects; no date given for automatic rollback | Not used |

Close runners-up: Amazon's "four or five business days" to all Regions (used well, and disarming); Starling's 134 releases in 221 days (not used; early-stage bank); Stripe's three months in production before the fault (used); the 27,000 tests retired over 126 weeks at Azure DevOps (not used); Nasdaq's 40,000 tested against 496,000 received (not used).

## 7. Honest limits

### Caveats that must travel with each story

- OANDA. The loss amount, date and regulatory consequences are not given (`gfqo` gaps). The bank comparison is "qualitative; no numbers are given" and written by insiders. OANDA kept no failure database; its quality data is a redeploy-within-48-hours heuristic. The notes say the failure "cuts both ways. A real-money loss happened under continuous deployment". The paper itself calls continuous deployment for mission-critical software "open to debate" and says a separate release team "is valuable when reliable software is important". The notes give "about 100 engineers" in one place and "About 80 developers" in another; use 80 developers, which is the cited figure.
- Knight. The order does not say the new code was tested, does not use "kill switch", gives about ten percent of listed equity trading (not 17%), dates disuse to 2003, and names a written double-check as the remedy. That a ramp of the behaviour would have limited the loss is the essay's inference; the notes mark it as such. Knight was a broker-dealer, not a software vendor.
- Azure DevOps. No published incident trend shows rings or the test rewrite improved quality (`ms`: "no such measurement was published in anything I read"). The team still deploys in three-week batches through tiers with a human approving the first. The launch-day detail "about two dozen features an hour before the keynote" and "recovery took about two weeks" are RELAYED through Bekker; Harry's own post says about a week and a half. The merge of development and test is dated November 2014 by one account and spring 2015 by another. It coincided with company-wide layoffs. The working-hours guidance carries only a 2022 revision date.
- Uber. The page writes ".25 percent, 1 percent, 5 percent" and lists no steps between 5 and 100. The ledger rollout began in "a country with a limited number of users and partners"; the page does not say "small country" or "country by country". No mismatch rates are published.
- Starling. The 2017 and 2018 material is slides; the talks were not watched. In 2017 the bank was in closed beta. The 2025 post gives no number of releases per day. Nothing records an auditor's formal conclusion; "our auditors loved this one" is a slide about a GIF. Starling was built new. Its posts do not mention canaries or flags.
- FCA review. Correlational; no effect sizes; firms describing more work as DevOps had "a slightly higher change failure rate", sample too small to conclude; "this isn't a one-size fits all solution". The essay already carries these.
- TSB and RBS. Only cited paragraphs were read. The PRA notices were not read; `cef` says "combined FCA+PRA totals are therefore not verified here", while the synthesis takes £48.65 million from an FCA press release. The essay prints £48.65 million; check it against the press release before reprinting. TSB argues for better testing as well as smaller steps, as the essay says. The regulators' language is "test more and govern better", not "test in production".
- Netflix. One group (Edge Engineering); no metrics; the authors say many firms "won't have the staffing". In 2013 Netflix still had a weekly release and a delivery team.
- Amazon. The pipeline is not faster than a three-day soak. The 90% reduction is one "headline" pilot team.
- Stripe. The analysis announces no change to rollout or soak practice.
- Square. The figure of 1,000 payments is only in a code sample. The regression needed "a six-month-old version and an up-to-date version of Register together".
- Financial Times. As in the numbers table.
- Monzo's incident trend. Direction only, the author's own caveat, no readable values.

### Wording in the synthesis that the verification files correct

A rewrite working from the synthesis will repeat these unless told:

- Square "compared the latest 1,000 payments": not in the prose (`qvB` item 4).
- Square's regression "hit one six-month-old client version": it needed a pair of versions.
- Uber's ledger "starting with a small one": the page says "a country with a limited number of users and partners".
- Slack's drop "following the introduction of automatic rollbacks in April 2024": `qvB` item 13 says the date is NOT FOUND; "The page gives no date for the introduction of automatic rollbacks."
- Atlassian's remedy "progressive rollout": the page says "staged rollout".
- Financial Times "fewer than 25": she says "less than 25".
- Stripe Ledger: "fully ingested and verified", not "cleared".
- Cloudflare 2019: "in one go" is not on the page.
- SRE Workbook: canarying is a way "to supplement testing"; "supplements rather than replaces" is a paraphrase.
- Roblox: the feature had been enabled on some services "Several months ago"; what ran for a day was streaming on the traffic-routing service.
- Monzo's four launch methods are a toolkit, not a fixed ladder.

### Widely repeated details the research does not support

From the synthesis's corrections table and the notes:

- Knight's code was "thoroughly tested"; "no kill switch"; 17% market share; automation would have prevented it.
- Allspaw called change approval "risk theater". Not found in any Allspaw text read.
- Etsy's table of 420 successful changes and 5 failures: the deck says its numbers "are sort of made up".
- Google found most outages are fixed by rollback. Not located.
- Amazon pulls an "andon cord" on deployments. Commentators' analogy.
- Amazon, Netflix and Facebook have no QA, no staging and no release gate.
- Amazon's "75% reduction in outages" from the Jenkins talk: unverified slide claim.
- DORA proves change boards cause failures: survey association only.
- LinkedIn halted development for two months: Wired only; LinkedIn's own post gives no duration.
- Stripe deploys over 1,000 times a day; Wise's and DBS's release counts: secondary or executive self-report.
- Yahoo proved removing QA reduced errors.
- Monzo deployed automatically on merge with automated rollback in 2022.
- Any statement that an examiner or auditor approved a firm's new process. None is published.

## 8. Recommended evidence plan for a rewrite

The principle: a director should finish able to retell three stories and quote five numbers. Each long case should be told once, in one place, with its people and its caveat, and should carry one step of the argument.

### Tell at length (300 to 600 words each)

1. OANDA, as the opening. It is the reader's own situation seen from outside: the same code, released continuously by the firm and in bundles of "thousands of changes" by its bank clients. Tell the bank half first, then the failure, the reflex, the ignored tests, and stop before the 23%. Carries: the batch is the risk. Caveats in one sentence: insiders, qualitative, loss unquantified.
2. Azure DevOps and Brian Harry, in the middle. Launch morning 2013; "all customers are affected or none"; weekends; ring 0; 45 and 66 minutes; the tests thrown away; "I started to agitate"; Monday-morning deployments. Carries: what the transition looks like from the chair of the person accountable, that flags alone are not it, and that it takes years. Caveat: no published quality trend; still a three-week batch.
3. Knight, late, as the objection answered. Keep the essay's telling and add the 2005 refactor, the 212 orders and the October 2011 loss. Follow it immediately with RBS in four sentences (Sunday, Monday, Tuesday; Version 2 not 2A). Carries: the failures on record are of dormant paths and unrehearsed rollbacks, and the SEC's remedy includes the second reviewer you already have.

Uber's shadowing deserves 200 to 300 words in the engineers' own words between the second and third long cases, as the answer to "not with money".

### Use briefly (one to three sentences, one job each)

- FCA review: 3.8% against 1.6%; over 90% approved. Directly after OANDA, so the anecdote is followed by a regulator's data.
- Netflix: "verifying endurance" and, later, the failed hybrid. One place each at most; preferably together.
- Amazon: 16 days and almost 14; four or five business days; "encode their current release process, manual steps and all". The last belongs at the close.
- Starling: "You can do anything you can undo"; "our auditors loved this one"; three approvals and multiple releases a day. In the audit section, as the proof that approvals and frequency coexist.
- Stripe July 2019: three months clean, then the revert. One paragraph, joined, where the essay concedes what time and rollback cannot do.
- Square: "a mistake that was obvious in hindsight"; ramp by merchant.
- Financial Times: 16% of 12 against under 1% of 2,500, with its caveat, as the single before-and-after.
- OANDA's 23%, held back for the final section. End on it: the engineering team was the same; the management changed.

Optional single sentences: Allspaw's "working towards saying 'go', not 'no-go'"; DORA 2019's "Analysis suggests this approach will make things worse"; Kohavi's order pipeline that lost 2%; Slack's 90% with its baseline caveat; Monzo's direction of travel; TSB's "Testing only concluded the day before".

### Drop, or move to notes

Flickr, Dropbox, GitHub, LinkedIn, Booking.com, Wealthfront, Kohavi 2007, Google's 2010 paper, Schermann, Bland, Vogels, Netflix Asgard, Humble and Farley, Adyen's month, Basel, Uber's Piranha, Roblox, CrowdStrike, Cloudflare, Google Cloud 2025 (keep its remedy sentence only if the dormant-path point needs a second witness), DBS (unless explained), Nubank, Facebook's Gatekeeper sentence, the seven-source line under figure 6. Facebook Chat can stay as two sentences that define "dark launch".

### Order, to build a case

1. Your situation, seen from outside: OANDA's banks. Then the FCA's numbers.
2. What your three days are: Amazon's 16 days, Netflix's "verifying endurance". The wait moves; it does not vanish (four or five business days).
3. What the new way is: dark, shadow, staff, one client. Mechanism only, with Facebook Chat as the definition and no roll-call.
4. What it is like to get there: Brian Harry.
5. With money: Uber, then Square and Stripe as the limits, then reconciliation as the clock.
6. With auditors: the rule texts ask for evidence; Starling kept three approvals; where the texts bite.
7. The objection: Knight and RBS. What halfway looks like.
8. What managers do: do not answer a failure with a gate (OANDA's reflex, resolved); move the pager (Netflix's hybrid); then OANDA's 23%.
9. Where to start: Amazon's "encode", and the gaps stated plainly.

That is three long cases, one medium, eight brief, in about nine steps. The essay currently cites 72 sources; this plan needs about 20 in the body, and the rest can stand behind it in the notes.
