# Quote verification B: payments firms and engineering blogs

Checked on 2026-11-10. Every page was read as raw HTML fetched with `curl`, tags stripped locally, then searched for the distinctive fragments. No summarising fetch tool was used for any item. Items 1 to 3 (Uber) returned HTTP 406 to `curl` on the live site and were read from Internet Archive captures instead; all other items were read from the live page.

Status key: VERBATIM means the quoted fragment appears character for character (allowing only for curly versus straight apostrophes). DIFFERS means the page says something close but the wording or figure is not what the brief stated. Text in quotation marks in the table and notes is copied from the page.

## Summary table

| # | Source | Status | Author(s) as shown | Date as shown | How read |
| --- | -------- | -------- | -------------------- | --------------- | ---------- |
| 1 | Uber, "Migrating Functionality Between Large-scale Production Systems Seamlessly" | Shadowing and replay: VERBATIM. "dozens of argument mismatches": VERBATIM. Rollout stages: DIFFERS in form (page writes ".25 percent, 1 percent, 5 percent", not "0.25%") | Shirish Gajera, Chris Blinn | August 7, 2019 | Raw HTML, Wayback capture 20250323070730 |
| 2 | Uber, "Revolutionizing Money Movements at Scale with Strong Data Consistency" | Percentages: VERBATIM. "Country by country, starting with a small country": DIFFERS (paraphrase; see exact sentences) | Aakriti Singla, Simon Wu | October 2, 2020 | Raw HTML, Wayback capture 20260413014241 |
| 3 | Uber, "Migrating a Trillion Entries of Uber's Ledger Data from DynamoDB to LedgerStore" | 99.99% bar: VERBATIM. Six and seven nines arithmetic: on page (wording "6 nines", "7 nines"). 760 billion: on page. Duration: "over two years" | Raghav Gautam, Erik Seaberg, Abhishek Kanhar | "April 11" on page; metadata 2024-04-11 | Raw HTML, Wayback capture 20241019075157 |
| 4 | Square, "Breaking up with your MonoRail" | Title DIFFERS in capitalisation (MonoRail). Six weeks: on page. "actually caught a lot of subtle bugs": VERBATIM. "Latest ~1,000 payments": only in a code sample, not in prose. Rollout lesson: DIFFERS from the brief's paraphrase | Zachary Anker | January 13, 2016 | Raw HTML, live page |
| 5 | Square, "Books, an immutable double-entry accounting database service" | Both quotes VERBATIM | Łukasz Strzałkowski (page metadata; "Authored By" block) | October 16, 2019 | Raw HTML, live page |
| 6 | Monzo, "Processing payments safely at scale" | Title VERBATIM. 0.1% sentence on page. "not the fastest way to find out about issues": VERBATIM. Daily comparison: on page | Joost van Oorschot, Staff Backend Engineer | 8 February 2022 | Raw HTML, live page |
| 7 | Monzo, "Argo Rollouts at scale: Bringing Automated Rollbacks to 2,100+ services at Monzo" | 2,100+: on page. Metrics-based rollback: on page. "migration and tooling work was >90% of the effort": VERBATIM. Date DIFFERS from URL | Will Sewell, Joseph Pallamidessi (both Backend Engineer) | 7 November 2022 (URL path says 2022/11/02) | Raw HTML, live page |
| 8 | Monzo, "How we launch new products at Monzo" | Both phrases VERBATIM. The four methods are presented as a toolkit of options, not as a fixed ladder | Ed Stuart-Bourne, Product Director | 3 August 2023 | Raw HTML, live page |
| 9 | Stripe, "Ledger: Stripe's system for tracking and validating money movement" | DIFFERS: page says "fully ingested and verified", not "cleared" | Ilya Ganelin | 2024.2.16 | Raw HTML, live page |
| 10 | Stripe, "Root cause analysis: significantly elevated error rates on 2019-07-10" | Three months and phased rollout: on page. Second-outage quote: VERBATIM | David Singleton, CTO | July 12, 2019 | Raw HTML, live page |
| 11 | Starling Bank, "How we made everyone a Release Engineer" | Three approvals: on page. Both quotes VERBATIM. Releases per day: no number given ("multiple times per day") | Paul J Moore and Marcus Mak | October 23, 2025 | Raw HTML, live page |
| 12 | Sarah Wells, InfoQ transcript (page title "Mature Microservices and How to Operate Them") | All figures on page in the transcript. "fewer than 25" DIFFERS: she says "less than 25" | Sarah Wells | Mar 28, 2019 (QCon London 2019) | Raw HTML, live page, transcript text |
| 13 | Slack, "Deploy Safety: Reducing customer impact from change" | 73%: on page. 90%: on page. 10 and 20 minute targets: on page as bullet points. Date automatic rollbacks were introduced: NOT FOUND (no date stated) | Sam Bailey, Senior Engineering Manager | October 7, 2025 | Raw HTML, live page; date cross-checked against Wayback capture 20251009012159 |
| 14 | Slack, "Deploys at Slack" | Stages: on page, across three sentences | Michael Deng, Jonathan Chang | March 29, 2020 (Updated: January 3, 2022) | Raw HTML, live page |
| 15 | Shopify, "Software Release Culture at Shopify" | Fragment VERBATIM, but the sentence continues after "windows". Canary 5% and 10 minutes: on page in two separate sentences | Byline "By Jack Li, Kate Neely, and Jon Geiger"; page header "by Kate Neely" | Apr 15, 2020 | Raw HTML, live page |
| 16 | Atlassian, "Post-Incident Review on the Atlassian April 2022 outage" | 775 customers, up to 14 days: on page. Staging and peer review: on page. Soft deletes: on page. "Progressive rollout" DIFFERS: page says "staged rollout" | Sri Viswanath | April 29, 2022 | Raw HTML, live page |
| 17 | GitHub, "Move Fast and Fix Things" and "Scientist: Measure Twice, Cut Once" | 4 days and 24 hours: on page. Merge count DIFFERS from any exact figure: page says only "tens of millions". Side-effects caveat: on page | Vicent Martí (Move Fast); Jesse Toth (Scientist) | December 15, 2015; February 3, 2016 (Updated December 3, 2020) | Raw HTML, live pages |

## Exact sentences by item

### 1. Uber, migrating payments authorisation

Shadowing: "All original production requests were forwarded to the Auth Service with a programmed delay using dedicated Celery queues."

Why the provider is not called twice: "Since a PSP is external, we don’t want to make the same request in our legacy and new systems. It would double the traffic, the behavior of the PSP might be nondeterministic, and it would not be clear which was the primary system for the request."

Caching and replay: "When the legacy system made a request, we cached both the request and the response from the PSP with the intent to replay the traffic to the new Auth service later."

The "twice" phrase: "Also, as we can’t call a PSP’s endpoint twice, the response will be replayed from Redis for the particular request and the AuthHold state will be updated in our Auth service database, as shown in Figure 1, below:"

Mismatches: "After running the validation for a few days, we found dozens of argument mismatches across different PSPs and edge cases for state transition."

Rollout: "We also decided that it would be best to roll out one payment method at a time to account for additional differences." Then: "For each payment method, we began with a test plan for a couple of employees to test known success and failure cases. Then we moved to put all Uber employees on the new system, followed by incremental cohorts of real-world users, going from .25 percent, 1 percent, 5 percent until we were 100 percent rolled out."

Points to watch:

- The page writes ".25 percent, 1 percent, 5 percent", with no leading zero and the word "percent", and lists no steps between 5 and 100.
- The employee stage has two parts: "a couple of employees" on a test plan, then "all Uber employees".
- The migration is dated to 2018 in the text ("In 2018, Uber’s payments engineers migrated the functionality of dozens of complex payment instruments"); the post is dated August 7, 2019.

### 2. Uber, Gulfstream ledger rollout

The rollout is a bulleted list under "Smart rollout strategy". The lead-in: "The actual rollout is an incremental slow rollout with multiple strategies. We defined the control group and experimental group with hundreds of users and partners in each group."

The bullets:

- "We picked a country with a limited number of users and partners for initial rollout"
- "We based our rollout on a percentage in each country, starting from 1% and gradually increasing to 5%, 10%, 20%, 50%, 100%."
- "We controlled the rollout by dynamic configurations so that we did not need to deploy code during the rollout."

Points to watch:

- The page does not say "small country"; it says "a country with a limited number of users and partners".
- The page does not say "country by country" in those words. It says "a percentage in each country" and later "we started expanding to more and more countries".
- The date "October 2, 2020" appears in the page markup of the archived capture. The URL given in the brief resolves to this title.

### 3. Uber, DynamoDB to LedgerStore

The bar: "We wanted our backfill to be at least 99.99% complete and correct as measured by shadow validation. We also had a 99.9999% upper bound for the same."

Six and seven nines: "For 6 nines, you have to look at data of 100 million comparisons to give any results with good confidence. This means if your shadow validation is comparing 1,000 records/second, then you need to wait for a bit more than one day just to collect sufficient data. With 7 nines, you will have to wait 12 days. In practical terms this would slow the project to a halt."

Limits of live shadowing: "Unfortunately, live shadow validation can’t give strong guarantees about our corpus of rarely-accessed historical data."

Cold data: "This has to be done in addition to shadow validation because live traffic tends to access only recent data. So, if there are any problems lurking in the cold data that is infrequently accessed, it will not be caught by shadow validation."

Offline job: "The biggest data that we tackled was 70 TB compressed (estimated 300 TB uncompressed) in size and we compared 760 billion records in a single job."

Total duration: "We were able to do this migration over two years without any downtime or outages during or after the migration."

Points to watch:

- The page writes "6 nines" and "7 nines" in digits, "a bit more than one day" (not "a little over a day"), and "1,000 records/second".
- The 760 billion figure is the largest single job ("The biggest data that we tackled"), not stated as the total compared across all jobs.
- The final cutover is described separately: "We rolled it out over a few weeks and with go-aheads from on-call engineers of the major callers of our service."
- The page shows the date as "April 11 / Global" with no year; the year 2024 is in the page metadata (`article:published_time` 2024-04-11).

### 4. Square, "Breaking up with your MonoRail"

Title on page: "Breaking up with your MonoRail", subtitle "Planning an extraction from a monolithic Rails app." Byline: "Written by Zachary Anker." Date: "January 13, 2016".

Reads before writes: "The final result was a successful extraction in January 2016, with all reads going to Spot for around six weeks prior to turning off local writes."

Comparison: the prose says "Due to the significant divergence, we confirmed that our wrappers returned data in a manner Square/Web expected:" followed by a code sample containing `Payment.order("id DESC").limit(1000).each do |payment|`, and then: "We manually ran this until we had fixed all the discrepancies it found, this actually caught a lot of subtle bugs."

Rollout lesson: "Finally, we made a mistake that was obvious in hindsight by using randomized rollouts instead of stable to the merchant. We ended up with a regression bug that only occurred when using a six-month-old version and an up-to-date version of Register together. It wasn’t noticeable with randomized rollouts, because at lower percentages, merchants are more likely to just refresh a page and then see it work."

Recommendation: "Neither are good user experiences, but a stable rollout mitigates the Register app to consistently breaking for a smaller number of merchants, rather than inconsistently breaking it for a larger subset of them."

Points to watch:

- The figure 1,000 appears only as `limit(1000)` in a code sample that the author labels "a dramatic simplification from our actual code". The prose never says "the latest 1,000 payments".
- The comparison is described as being between Spot (new service) and Square/Web (monolith) data, run manually.
- The regression was not tied to one old client version alone. It "only occurred when using a six-month-old version and an up-to-date version of Register together".
- The page contrasts "randomized rollouts" with rollouts "stable to the merchant". It does not use the words "roll out by merchant" or "percentage rollouts".

### 5. Square, Books

"Because we cache balances on the book_entires, both journal and book entries data sets are effectively append-only and immutable once stored." (The misspelling "book_entires" is on the page.)

"This means that if you make a mistake what you want to do instead of updating is to write a new entry that corrects the previous one."

### 6. Monzo, "Processing payments safely at scale"

The 0.1% example appears twice. As a bullet: "the scheduling service has a subtle bug that means 0.1% of payments are not being scheduled as expected".

In prose: "Consider the example where the scheduling service has a bug that means 0.1% of payments are not being scheduled as expected. If it’s a bug that doesn’t trigger an error, and we don’t have an alert, or its threshold is set too high, we could miss it."

Daily reconciliation: "One table contains ledger entries and one contains bank statement lines. We compare them on a daily basis."

Speed: "The downside is that it’s not the fastest way to find out about issues, especially when your payment system settles on a daily basis."

Points to watch:

- Monzo's term is "coherence checks" and "coherence checking". The word "invariant" does not appear on the page.
- The 0.1% figure is a hypothetical illustration, not a reported incident.

### 7. Monzo, Argo Rollouts

Service count: "We have over 2,100 services and deploy over 100 times per day. In fact, we deployed to production more than 27,000 times 2021" (the missing "in" is on the page). The title also carries "2,100+ services". Later the text says "migrating all 2000+ microservices" and "2k+ services".

Metrics: "We wanted the automated rollback system to be based on Prometheus metrics." And: "We configured a global set of rules that would trigger rollbacks based on the same metrics and thresholds we use for our generic alerts. Currently these are things like" followed by "The total RPC error rate is >20 %", "Any panics / crashes", "Large spikes in database errors".

The quote: "For us, migration and tooling work was >90% of the effort."

Date: the page displays "Published on: 7 November 2022". The URL path contains 2022/11/02. Cite 7 November 2022.

### 8. Monzo, "How we launch new products at Monzo"

The four methods are introduced with: "They’re one of several tools we can use to test our hypotheses. Here are some of the other options in our toolkit:" The headings are "Staff testing", "Monzo Labs", "Experiments", "Staged rollouts".

Experiments: "Also known as A/B testing, we use experiments to randomly assign some customers to a new feature, while holding out a ‘control’ group that doesn’t yet receive it."

Staged rollouts: "Almost all products and features are released gradually rather than in one big bang. For example, we might make it available to 10% of customers on day 1, 20% on day 2, etc."

First phrase: "This is a great way to test that our findings scale and uncover edge cases, with a clear plan to roll back if necessary."

Second phrase: "Then, to make sure it didn’t lead to bad outcomes (like customers being unclear how it worked, or struggling to make their payments as a result), we ran an experiment."

Points to watch:

- The page does not present the four as a mandatory sequence. It describes choosing among them ("when we might choose an experiment instead of Monzo Labs, and vice versa"). The examples do show sequences: staff then Labs for mortgage visibility; staff then experiment for the Flex payment date change.
- The second phrase concerns one specific feature (Monzo Flex customers changing their payment date), not launches in general.

### 9. Stripe, Ledger

"Each day, Ledger sees five billion events and 99.99% of our dollar volume is fully ingested and verified within four days."

The page does not say "cleared" in this sentence. Use "fully ingested and verified".

### 10. Stripe, root cause analysis for 10 July 2019

"Three months ago, we upgraded our databases to a new minor version. As part of the upgrade, we performed thorough testing in our quality assurance environment, and executed a phased production rollout, starting with less critical clusters and moving on to increasingly critical ones."

"The new version operated properly in production for the past three months, including many successful failovers. However, the new version also introduced a subtle fault in the database’s failover system that only manifested in the presence of multiple stalled nodes."

Timeline entry: "[Three months prior to the incident] We upgraded our databases to a new minor version that introduced a subtle, undetected fault in the database’s failover system."

Second outage: "However, the second period of degradation had a different cause: our revert to a known stable version interacted poorly with a recently-introduced configuration change to the production shards."

The fault is described as being in "the database’s failover system", and the suspect code path as being "in a new version of the database’s election protocol".

### 11. Starling Bank, release engineering

Title on page: "How we made everyone a Release Engineer". Byline: "Paul J Moore & Marcus Mak". Date: "October 23, 2025".

Three approvals: "if we want to conduct a release, we have to go through three layers of safeguards: Commit Approval, Technical Approval and Business Approval, the scope of which becomes wider at each layer."

Business approval: "So, why do we need an extra approval? Business Approval is here to manage our overall risk as a regulated bank."

Audit: "It is the tool that captures the technical detail of our changes, the approvals from the correct people, and the metadata related to a release that regulators require banks have - it is our immutable audit of what software we release to production."

Release frequency: "Starling actually release to production multiple times per day." No number is given.

### 12. Sarah Wells, QCon London 2019 transcript

Page title: "Mature Microservices and How to Operate Them". The page shows "Recorded at:" QCon London, "Mar 28, 2019", "by Sarah Wells"; page metadata gives datePublished 2019-03-28.

Twelve releases: "Also, you can't experiment when you're only doing 12 releases a year, because by the time you get feedback, you do some changes, you put it out, it's six weeks before you even find out whether it's at all worth doing."

Failure share: "When we did 12 releases a year, one or two of them would fail and when they failed they were incredibly painful. It's about a 16% failure rate."

2017: "In 2017 we did 2,500 releases and it works out about 10 releases per working day." And: "I'm pretty confident in 2017 we had less than 25 releases fail. So that's less than a 1% failure rate."

Change approval board: "So it's not a good thing and we don't have change approval boards anymore. Our theory is, if you're doing small changes, the best person to make the decision about whether this change should go, is the person who just made that development change."

Points to watch:

- She says "less than 25", not "fewer than 25", and hedges with "I'm pretty confident".
- The 2,500 figure is for one group: "this is from the content delivery platform, so this is just one group within the FT."
- The 16% is derived from "one or two" of 12 failing.
- What replaced the board is the developer's own judgement, plus a lightweight record described earlier in the talk: "So we call an API to say, \"We released this system. This git commit, this person.\""

### 13. Slack, Deploy Safety

73%: "The increasing majority (73%) of customer facing incidents were triggered by Slack-induced change, particularly code deploys."

90%: "It’s mid 2023 and we’ve identified some opportunities to improve our reliability. Fast forward to January 2025. Customer impact hours are reduced from the peak by 90% and continuing to trend downward."

Peak: "Once projects started to deliver changes, we then had the peak quarter of impact between February and April of 2024."

Automatic rollbacks: "What we needed was automatic instead of manual remediation. Once automatic rollbacks were introduced we observed dramatic improvement in results. We’ve continued to experience a 3-6 month lag time to observe each project’s full impact."

Targets, as bullet points under 'initial “North Star” goals across all deployment methods for our highest importance services', heading "Reducing impact time from deployments":

- "Automated detection & remediation within 10 minutes"
- "Manual detection & remediation within 20 minutes"

Points to watch:

- The page gives no date for the introduction of automatic rollbacks. The only ordering stated is that they came after the February to April 2024 peak quarter.
- The 90% reduction is measured from the peak (February to April 2024) to January 2025. Mid 2023 is when the problem was identified, not the baseline for the 90%.
- The targets cover "detection & remediation", not rollback alone, and are goals, not reported results. The page separately says customers found interruptions "more disruptive after about 10 minutes".
- The displayed date is October 7, 2025, on both the live page and the earliest Internet Archive capture (9 October 2025). The page's images carry upload paths dated 2025/05.

### 14. Slack, Deploys at Slack

Staging: "The next step is to deploy the build to the staging servers and run an automated smoke test. Staging is a production environment that does not accept public traffic."

Dogfood and canary: "The rollout to production starts with the dogfood tier, a set of hosts that serves some of our internal Slack workspaces." And: "Once we are confident that core functionality is unchanged, the build is deployed to canary, which has about 2% of production traffic routed to it."

Percentages: "We break up the rollout in 10, 25, 50, 75, and 100 percent increments in order to slowly expose production traffic to the new build while giving us time to investigate if there are any spikes or anomalies."

Displayed date: "March 29, 2020", with "Updated: January 3, 2022". The earliest Internet Archive capture is August 2020.

### 15. Shopify, release culture

"Developers own the whole process. There are no release managers, sign offs, or windows that developers are allowed to make releases in."

The fragment "There are no release managers, sign offs, or windows" is verbatim, but the sentence does not end at "windows". Do not close the quotation with a full stop inside the quotation marks.

Canary: "The Canary environment receives a random 5% of all incoming requests." And: "Developers have tooling allowing them to test their changes in the Canary environment for 10 minutes. If there’s no manual intervention and the automated canary analysis doesn’t trigger any alerts, the changes are deployed to Production"

### 16. Atlassian, April 2022 post-incident review

Scale: "On Tuesday, April 5th, 2022, starting at 7:38 UTC, 775 Atlassian customers lost access to their Atlassian products. The outage spanned up to 14 days for a subset of these customers, with the first set of customers being restored on April 8th and all customer sites progressively restored by April 18th."

Review and staging: "The script that was executed followed our standard peer-review process, which focused on which endpoint was being called and how. It did not cross-check the provided cloud site IDs to validate whether they referred to the app or to the entire site. The script was tested in Staging per our standard change management processes, however, it would not have detected that the IDs input were incorrect as the IDs did not exist in the Staging environment."

Sites: "The result was an immediate deletion of 883 sites (representing 775 customers) between 07:38 UTC and 08:01 UTC on Tuesday, April 5th, 2022."

Remedies: "Establish universal “soft deletes” across all systems. Overall, a deletion of this type should be prohibited or have multiple layers of protections to avoid errors, including staged rollout and tested rollback plan for “soft deletes”."

Staged rollout detail: "Enforce staged rollout of any soft-delete actions: All new operations that require deletion will first be tested within our own sites to validate our approach and verify automation. Once we’ve completed that validation, we will progressively move customers through the same process and continue to test for irregularities before applying the automation to the entire selected user base."

Points to watch:

- The page's term is "staged rollout", with "progressively" used as an adverb. "Progressive rollout" as a noun phrase is not on the page.
- The displayed date is April 29, 2022 (metadata timestamp 2022-04-30T03:28 UTC). The author shown under "About This Article" is Sri Viswanath; the review opens with a letter from the co-founders and co-CEOs.

### 17. GitHub, Scientist

Method: "we will be testing and benchmarking the two implementations, in production but without affecting in any way our existing users, thanks to the power of Scientist."

How it compares: "The first thing we do when starting an experiment is enable it for a tiny fraction (1%) of all the requests." The same sentence says Scientist "compares the result of the control against the candidate, logging exceptions or mismatches in our Scientist web UI."

Iteration: "We did that for 4 days, every morning waking up to a tidy list of cases where the result of the new code was different from the old code, and cases where the new code was just giving good results but running too slowly."

Result: "After 4 days of iterating on this process, we managed to get the experiment running for 100% of the requests, for 24 hours, and with no mismatches nor slow cases during the whole run. In total, Scientist verified tens of millions of merge commits to be virtually identical in the old and new paths."

Caveat, from "Scientist: Measure Twice, Cut Once": "The most important caveat is that Scientist is not meant to be used for any code that has side-effects. A candidate code path that writes to the same database as the control, invalidates a cache, or otherwise modifies data that affects the original, production behavior is dangerous and incorrect. For this reason, we only use Scientist on read operations."

Points to watch:

- The page gives no exact count of merges. It says "tens of millions of merge commits" and "virtually identical".
- The page writes "4 days" in digits.
- The 24 hours had "no mismatches nor slow cases", so the criterion covered performance as well as correctness.

## Access notes

- Uber's live blog returned HTTP 406 with a 14-byte body to `curl` with a browser user agent. The three Uber posts were read from Internet Archive captures dated 23 March 2025, 13 April 2026 and 19 October 2024 respectively.
- Working files (raw HTML and stripped text) were kept in a temporary scratch folder and are not part of this repository.
