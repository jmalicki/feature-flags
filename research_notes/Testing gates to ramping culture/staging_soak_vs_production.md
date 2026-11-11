# What a multi-day pre-production soak buys, and what replaces it (2007-2024)

Reading key for access status used on every source below:

- **FULL** = I retrieved the full text (PDF or page, some via the Wayback Machine) and read the passages cited. Quotations from these are copied from the text I read.
- **TOOL** = page was read through a fetch tool that returns a model-written extraction. Quotations marked TOOL were returned by that extraction and I did not see the raw page; re-check wording before printing.
- **ABSTRACT** / **SNIPPET** = only the abstract or a search-result summary was seen.

"Cuts FOR" = supports replacing soak-and-release-train with flags, canaries and ramps. "Cuts AGAINST" = supports keeping pre-production gates or elapsed-time holds. Many sources cut both ways and are marked so.

Two corrections to the brief, found during research:

1. **Lyft did not abandon shared staging.** The 2021-22 series describes abandoning per-developer on-demand environments (Devbox/Onebox) and per-service integration tests in CI. Shared staging was kept, upgraded to a "first-class" paged environment, and made the place where deploy-gating acceptance tests and a 10-minute bake run. Details under Key Question 1.
2. **Souza et al. does not show rapid release made things worse in the simple sense.** The overall backout rate rose, but late backouts fell and backouts were found not to affect users. Details under Key Question 2.

## Key Question 1: Staging fidelity. Why pre-production environments fail to predict production, and the evidence that simple pre-release testing still catches a lot

### Takeaway

Practitioner accounts from Google, Uber, Lyft, DoorDash, Facebook and independent writers agree on a consistent list of fidelity gaps (scale, config that differs because scale differs, data shape, traffic mix, monitoring, dependency versions, cross-team drift), and one academic outage study (Gunawi 2016) finds upgrades the largest known outage cause even though the upgrades "had been tested". But the strongest empirical paper on the other side (Yuan 2014) shows most catastrophic distributed-system failures were reproducible on three or fewer nodes with simple tests, so the evidence supports "staging cannot predict production-scale and production-mix behavior", not "pre-release testing is ineffective".

### Cited Findings

**Cindy Sridharan, "Testing in Production, the safe way", Medium, 25 Mar 2018.** Opinion/practitioner survey essay. FULL (via Wayback). Section "Why test in production when one can test in staging?". Cuts FOR, with explicit caveats AGAINST.

- Lists specific staging differences: cluster size ("sometimes it's a single machine masquerading as a cluster"); configuration of load balancers, databases and queues differs because the cluster is smaller (file descriptors, DB connections, thread-pool size, Kafka partitions); in-flight connection counts and TCP reuse; missing or misleading monitoring; a query that full-table-scans is fast on a small test table and slow in production. — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- Concedes these are "anti-patterns to be avoided" rather than arguments against staging as such, but says parity takes "a copious amount of engineering effort" and "trying to attain said parity might be akin to being on a hiding to nothing." — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- Directly on soak: says soak testing is one of the forms of testing "best performed with real traffic", defining it as verification "over long period of time under a realistic level of concurrency and load, used to detect memory leaks, GC pause times, CPU utilization". — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- Caveats (exact): "Testing in production is by no means a substitute to pre-production testing nor is it, by any stretch, easy." She scopes the essay to services whose deployment the developers control and explicitly excludes "safety critical systems"; says no form of production testing is "entirely risk-free"; says staging is not "completely useless" but is "relied upon to a much greater degree than necessarily needed". — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- Limits: no data; an argument from experience plus a literature tour.

**Cindy Sridharan, "Testing Microservices, the sane way", Medium, published December 2017 (date per the series index in the 2018 post; the post page shows "40 min read").** Opinion essay. FULL (via Wayback). Sections "Testing in Production as a substitute to Pre-Production testing?", "The Goal of pre-production testing", "Integration Testing". Cuts FOR, with a carve-out AGAINST for money.

- "pre-production testing is a best effort verification of a small subset of the guarantees of a system" and can be "grossly insufficient for long running systems with protean traffic patterns". — [Sridharan 2017](https://copyconstruct.medium.com/testing-microservices-the-sane-way-9bb31d158c16)
- Goal of pre-production testing "isn't to prove there aren't any bugs (except perhaps in parsers and any application that deals with money or safety)". This parenthetical is a carve-out a finance audience will notice. — [Sridharan 2017](https://copyconstruct.medium.com/testing-microservices-the-sane-way-9bb31d158c16)
- Integration-test environments require separate dev/test/staging kept in sync, "a significant investment in automation (and personnel)". — [Sridharan 2017](https://copyconstruct.medium.com/testing-microservices-the-sane-way-9bb31d158c16)
- I did not locate a passage in this post citing Yuan et al. (searched the text for "Yuan" and "simple testing"; no hit). Do not attribute a Yuan discussion to this post without re-checking.

**Charity Majors, "I test in prod", Increment issue 10 (Testing), August 2019.** Opinion essay; author is co-founder/CTO of observability vendor Honeycomb (commercial interest). TOOL. Cuts FOR.

- Each deploy is "a unique and never-to-be-replicated combination of artifact, environment, infra, and time of day" (TOOL quote); "you aren't testing code anymore, you're testing systems" (TOOL quote). — [Majors 2019](https://increment.com/testing/i-test-in-production/)
- Not anti-pre-production: "Yes, you should test before and in prod" (TOOL quote); says returns to further pre-production hardening diminish quickly; says risk tolerance should be lowest near user or billing data. Lists "Specific times of day, week, month, year, and decade" among production factors (TOOL quote). — [Majors 2019](https://increment.com/testing/i-test-in-production/)
- Limits: no data.

**Charity Majors, "Shipping Software Should Not Be Scary", charity.wtf, 19 Aug 2018.** Opinion blog; vendor-affiliated. TOOL. Cuts FOR.

- Claims "smaller and more frequent changes are much safer than larger and less frequent changes" and that rollouts are the proximate cause of "the overwhelming majority of incidents" (TOOL quotes); neither is backed by figures in the post. Recommends automated canary promotion, flags, cohort ordering starting with internal users, and warns against large ramp jumps (10% to 25% to 50%) because of backend saturation. — [Majors 2018](https://charity.wtf/2018/08/19/shipping-software-should-not-be-scary/)
- The "15-minute deploy" argument: I could NOT locate or read the primary charity.wtf post. Only a secondary write-up (Infobip developer blog, SNIPPET) attributes to her that code should be in production within about 15 minutes of merge and calls the motto somewhat hyperbolic. Treat as unverified against primary. — [Infobip write-up](https://www.infobip.com/developers/blog/testing-in-production-deploying-on-fridays-and-how-to-be-a-happy-developer-with-charity-majors-cto-at-honeycomb)

**Google, Site Reliability Engineering (2016), ch. 1 "Introduction" and ch. 17 "Testing for Reliability" (Alex Perry, Max Luebbe).** Practitioner book. Ch. 1: FULL. Ch. 17: TOOL. Cuts BOTH.

- Ch. 1 (exact, read): "SRE has found that roughly 70% of outages are due to changes in a live system." No dataset or method is given. — [SRE book ch. 1](https://sre.google/sre-book/introduction/)
- Ch. 17, "Canary test": canarying is closer to "structured user acceptance" than a test and "doesn't always catch newly introduced faults" (TOOL quotes); incubation is called "baking the binary". The chapter gives an exponential-rollout model relating cumulative fault reports to rollout growth and an estimate of the "order" of the fault (first-order = request hits broken code; higher orders involve damaged/reused data). The tool rendered the formula as "CU = RK"; verify the exact notation in the chapter before reproducing. — [SRE book ch. 17](https://sre.google/sre-book/testing-reliability/)
- Ch. 17, "Relationships Between Testing and Mean Time to Repair": a test that blocks a push gives "zero MTTR" because the bug "never reaches production" (TOOL quotes). This is the book's own argument FOR pre-release gates. — [SRE book ch. 17](https://sre.google/sre-book/testing-reliability/)
- Ch. 17 does not use the term "soak test"; the nearest idea is performance tests ensuring a system "doesn't become incrementally slower without anyone noticing" (TOOL quote). — [SRE book ch. 17](https://sre.google/sre-book/testing-reliability/)

**Google, The Site Reliability Workbook (2018), ch. 16 "Canarying Releases" (Alec Warner, Štěpán Davidovič et al.).** Practitioner book. TOOL. Cuts FOR on fidelity; see Key Question 4 for its canary limits.

- "your test environments aren't 100% identical to production" and "your tests probably don't cover 100% of possible scenarios"; "you won't be able to detect all release-related defects until real traffic is hitting the service" (TOOL quotes). — [SRE Workbook ch. 16](https://sre.google/workbook/canarying-releases/)
- Synthetic load "does a good job of maximizing code coverage, but doesn't provide good state coverage" (TOOL quote); artificial load "might not accurately model organic traffic shifts". — [SRE Workbook ch. 16](https://sre.google/workbook/canarying-releases/)

**Veeraraghavan et al. (Facebook), "Kraken: Leveraging Live Traffic Tests to Identify and Resolve Resource Utilization Bottlenecks in Large Scale Web Services", OSDI 2016, pp. 635-651 (Nov 2016).** Peer-reviewed. ABSTRACT only (via TOOL; the PDF download was truncated and unreadable). Cuts FOR.

- Kraken load-tests by continually shifting live user traffic to one or more data centers while monitoring user experience and system health in a feedback loop; in production three years; let Facebook increase hardware utilization by "over 20%" (abstract figure, TOOL). — [Kraken, OSDI 2016](https://www.usenix.org/conference/osdi16/technical-sessions/presentation/veeraraghavan)
- A passage from the Kraken paper is quoted inside Sridharan 2018 (which I read): shadow tests "must not trigger these side effects", and stubbing side effects is called impractical because server logic changes frequently. This is the stated reason Facebook used live traffic rather than replay for its web tier. Second-hand; verify against the paper's design section. — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- Limits: about capacity/load, not functional correctness. I could not verify the paper's own count of bottlenecks found.

**Amit Gud (Uber), "Why We Leverage Multi-tenancy in Uber's Microservice Architecture", Uber Engineering blog, 11 Mar 2020.** First-party practitioner. TOOL. Cuts FOR.

- Reasons a parallel test stack is inadequate: hardware and maintenance cost; drift ("A test stack is only useful if it is identical to its corresponding production stack", TOOL quote); unreliable tests when another team's service is broken; test load may not saturate the stack so capacity stays unknown. Alternative: make production multi-tenant, route by tenancy, treat canary as "yet another tenant", stub outbound calls for shadow traffic. — [Uber 2020](https://www.uber.com/blog/multitenancy-microservice-architecture/)
- Limits: gives no quantitative results; calls the approach "ambitious"; requires tenancy propagation through every call, queue and datastore.

**Lyft, "Scaling productivity on microservices at Lyft", parts 1, 3, 4 (Garrett Heel, 10 Nov 2021; Matthew Grossman, 15 Dec 2021; Ben Radler, Garrett Heel, Shu Zheng, 2 Feb 2022).** First-party practitioner. FULL for parts 1, 3, 4 (via Wayback); part 2 not retrieved. Cuts BOTH: against heavy pre-merge integration environments, but FOR a well-run shared staging plus a short bake.

- What was abandoned: Devbox/Onebox on-demand multi-service environments and integration tests on CI. "It was time to replace Devbox, Onebox, and integration tests on CI" (part 1, "Changing course"). — [Lyft part 1](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-1-a2f5d9a77813)
- Evidence on integration-test value (part 1, "Breaking point"): for the most actively developed services, "80% or more of tests were either unnecessary... or could be rewritten to run without external dependencies"; when tests failed "the majority were false-positives", and the rest "would usually be caught before causing production impact via the staging or canary environments." — [Lyft part 1](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-1-a2f5d9a77813)
- Staging was kept and is described as "nearly identical to production–short of a smaller footprint and no production data" with continuous simulated ride traffic (part 1). Part 3: "Staging at Lyft is a first-class environment where breached SLOs will page on-call engineers". — [Lyft part 3](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-3-extending-our-envoy-mesh-with-staging-fdaafafca82f)
- Part 4: about 95% of integration tests were "redundant or could be rewritten as a unit test with mocks"; roughly 40 acceptance scenarios replaced them and run in staging after each deploy, gating production. Every staging deploy has a "bake time" gate so "persistent simulated traffic" can "trip alarms"; default bake time is 10 minutes. — [Lyft part 4](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-4-gating-deploys-with-automated-acceptance-4417e0ebc274)
- Outcomes after about 6 months (part 4): PRs ready to merge in under 10 minutes (down from 30); "Since removing E2E tests from PRs there has been no measurable increase in the number of bugs reaching production."; "Acceptance tests are catching issues weekly before they make it into production." — [Lyft part 4](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-4-gating-deploys-with-automated-acceptance-4417e0ebc274)
- Limits: self-reported, no incident counts or method for "no measurable increase"; ride-sharing, not finance; the retained gate is minutes, not days, and nothing in the series tests whether a longer bake would catch more.

**DoorDash, "Moving e2e testing into production with multi-tenancy for increased speed and reliability", DoorDash Engineering blog, 3 Mar 2022 (date from URL).** First-party practitioner. FULL (via Wayback). Cuts FOR.

- Staging e2e testing became unreliable through lack of e2e observability/alerting and no good way to simulate production data; copying production data would put PII in staging; "the staging environment became increasingly divergent from the production environment"; teams ignored staging and rolled straight to production. They chose not to fix staging (would need an overhaul of hundreds of services) and created a "DoorTest" tenant in production. — [DoorDash 2022](https://doordash.engineering/2022/03/03/moving-e2e-testing-into-production-with-multi-tenancy-for-increased-speed-and-reliability/)
- Limits: no quantitative before/after; describes e2e functional testing, not soak.

**Yuan et al., "Simple Testing Can Prevent Most Critical Failures", OSDI 2014 (Aug 2014), pp. 249-265.** Peer-reviewed. FULL. Cuts AGAINST the claim that pre-release testing is futile.

- Sample: 198 randomly sampled user-reported failures in Cassandra, HBase, HDFS, Hadoop MapReduce, Redis (Section 2). — [Yuan 2014](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)
- Finding 10: "almost all (92%) of the catastrophic system failures are the result of incorrect handling of non-fatal errors explicitly signaled in software". Intro: in 58% of catastrophic failures the faults "could easily have been detected through simple testing of error handling code"; Finding 11: 35% fall into three trivial patterns (e.g., empty handler, handler with a TODO). — [Yuan 2014](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)
- Finding 3: 98% of failures manifest on no more than 3 nodes, 84% on no more than 2; "it is not necessary to have a large cluster to test for and reproduce failures". Finding 4: 74% (147/198) deterministic. Finding 9: 77% (153/198) reproducible by a unit test. Finding 1: 77% need more than one input event; 90% need no more than 3. — [Yuan 2014](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)
- On long-running conditions: the paper says failures "typically occurred on long-running, large production clusters" yet were reproducible offline; about a quarter of failures triggered by starting a service occurred on systems running a long time (example: HBase region split), and such a failure "can be exposed intentionally by forcing a start of the service during testing". In the discussion of why random fault injection misses these it also states "38% of the failures only occur in long-running systems" (denominator should be re-checked in context). — [Yuan 2014](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)
- Authors' own caveat (Finding 3 discussion): a large cluster "usually involves more diverse workloads and fault modes, thus increasing the chances for failures to manifest"; testing "is a probabilistic exercise". — [Yuan 2014](https://www.usenix.org/system/files/conference/osdi14/osdi14-paper-yuan.pdf)
- Limits: open-source data-storage systems; issue-tracker reports only; misconfiguration deliberately excluded; shows failures were reproducible in hindsight by targeted tests, NOT that a staging soak would have found them. It supports targeted error-path tests, and if anything argues that waiting passively is the wrong way to reach long-running states.

**Gunawi et al., "Why Does the Cloud Stop Computing? Lessons from Hundreds of Service Outages", SoCC 2016.** Peer-reviewed. FULL. Cuts FOR on fidelity; neutral on remedy.

- Dataset: 597 unplanned outages at 32 internet services, from 1,247 news items and public post-mortems, 2009-2015. 355 of 597 have UNKNOWN root cause. Among those with reported causes, UPGRADE is the largest (16%), then NETWORK (15%), BUGS (15%), CONFIG (10%), LOAD (9%) (Table 3, Section 5). — [Gunawi 2016](https://ucare.cs.uchicago.edu/pdf/socc16-cos.pdf)
- Section 4.1: developers "had tested the software upgrades, but when the updates were pushed to the full ecosystem, they caused new failures/anomalies that were undetected in the offline testing." Section 5.1 quotes a post-mortem: "a code push which behaved differently in widespread use than it had during testing", and says the ecosystem "is hard to reproduce in research environments". — [Gunawi 2016](https://ucare.cs.uchicago.edu/pdf/socc16-cos.pdf)
- Examples include a feature update exposing "a new memory management bug only evident under heavy usage", and an operator enabling a configuration switch for one front-end type "while the pre-production test was done for" another (Section 5.9). — [Gunawi 2016](https://ucare.cs.uchicago.edu/pdf/socc16-cos.pdf)
- Limits: public reports only, biased to large visible outages and to transparent providers; the authors warn against using it to rank services; it does not measure how many upgrade defects offline testing did catch (no denominator); "presumably... tested thoroughly" is the authors' assumption.

**Savor et al., "Continuous Deployment at Facebook and OANDA", ICSE 2016 Companion (SEIP).** Peer-reviewed industry paper; authors are insiders. FULL (text copy in shared workspace). Cuts FOR, and is the closest finance-adjacent case (OANDA is a currency-trading platform).

- Facebook: number of critical and medium-priority production issues grew "significantly slower than the number of deployments per month, with trendline slopes of 0.0004, 0.0013, and 0.0061" for critical, medium, low (Fig. 2). "Observation 3: The number of critical issues arising from deployments was almost constant regardless of the number of deployments." — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)
- Per-deploy size: Facebook average 92 lines (median 33); OANDA average 273 lines (median 57). — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)
- OANDA staged through a demo system that is "a full trading system, but one that only trades with virtual money" with "real clients" and a larger client base than the real-money system; the paper treats beta/demo sites as production sites. — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)
- Natural comparison: OANDA white-labeled the same code to large banks; "The banks did not allow continuous updates of the software running on their servers." Reported result: the bank-hosted versions were at "a competitive disadvantage", with bugs the bank deemed non-critical "not fixed for many months". — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)
- The paper still lists "staging/baking" and shadow testing as standard pipeline stages and says testing environments "must be as identical to the production environment as possible". It also says a separate release-engineering team is valuable "when reliable software is important". — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)
- Limits: OANDA kept no failure database; critical failures were inferred from redeploys within 48 hours. The bank comparison is qualitative. Authors say continuous deployment for safety- or mission-critical software is "open to debate".

**FCA Final Notice to TSB Bank plc, 20 Dec 2022 (2018 migration incident).** Regulator finding. FULL for para 2.14 (text copy in shared workspace; URL below is the standard FCA location and was not fetched by me). Cuts BOTH: a finance example where pre-production testing lacked production fidelity, and where the regulator's remedy is more representative testing, not less.

- Para 2.14: scope of non-functional testing in "Active-Active configuration" across the data centres was reduced; "Had this testing been conducted, it is likely that a problem in the configuration of certain components in the data centres... would have been found." — [FCA Final Notice, TSB](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf)
- Limits: a one-off big-bang migration, not a release train; shows a configuration-fidelity gap, not a soak-duration gap.

### Inferences

- The fidelity argument is specifically about properties that depend on scale, traffic mix, data shape and configuration-at-scale. A soak in a smaller environment with synthetic load exercises elapsed time but not those properties, so "three days in staging" mostly tests time-dependent behavior under the wrong load.
- Yuan et al. imply that reaching "long-running" states by forcing them in targeted tests is more effective than waiting for them. This is an argument against passive soak as much as against skipping tests.
- Lyft and Savor both show that organizations which removed heavy pre-production gates kept a short staging/demo stage. The honest framing is "shrink and automate the pre-production stage", not "delete it".
- For a finance audience the Savor bank comparison and Sridharan's "money or safety" carve-out pull in opposite directions; both should be reported.

### Gaps

- No source found that measures, for the same system, what fraction of escaped defects a staging environment did and did not catch. Lyft's "80%" and "95%" figures are about test redundancy, not defect yield.
- Netflix's own explanation of why it canaries instead of relying on test environments was not located in a primary source; the Kayenta post (Key Question 4) does not argue the point.
- Monzo's 2022 deploy post was seen only in a text copy in the shared workspace; it says the pipeline blocks deploying a version to production that has not been deployed to staging, and "less friction encourages smaller changes, and smaller changes are less risky". URL not verified by me (likely on monzo.com/blog, published 15 May 2022).
- Kraken's body text (number of bottlenecks, rationale section) could not be read.

## Key Question 2: Soak testing specifically. What it finds, documented practice, and evidence on defects caught versus elapsed time

### Takeaway

Soak/endurance testing is defined around time-dependent resource defects (leaks, exhaustion, slow degradation), and I found no empirical study reporting defects caught per day of soak; the nearest evidence is release-cadence studies (Firefox, Facebook mobile), which find shorter stabilization periods did not measurably worsen user-visible quality, with real caveats (lower median uptime at crash, smaller share of bugs fixed pre-release, narrower test scope). AWS is important counter-evidence: it keeps elapsed-time "bake" for slow-burning problems, but in production stages and measured in hours with request-count conditions.

### Cited Findings

**Microsoft patterns & practices (J.D. Meier et al.), "Performance Testing Guidance for Web Applications", ch. 2 "Types of Performance Testing", September 2007.** Vendor methodology guide. FULL for the definitions (author list not captured in my extract; date "September 2007" read on page). Neutral/definitional.

- "An endurance test is a type of performance test focused on determining or validating the performance characteristics of the product under test when subjected to workload models and load volumes anticipated during production operations over an extended period of time." May be used to calculate MTBF/MTTF. Memory leaks, synchronization issues and race conditions are listed under stress testing in the same chapter. — [Microsoft p&p 2007](https://learn.microsoft.com/en-us/previous-versions/msp-n-p/bb924357(v=pandp.10))
- Limits: prescriptive; no defect-yield data; no duration recommendation in the passage read.

**Vendor and tutorial material on soak duration (RadView, SoftwareTestingHelp, BrowserStack and similar).** Vendor/SEO content. SNIPPET only. Weak evidence; use only to characterize convention.

- Typical recommended durations are 8 to 72 hours; 72 hours is described as a convention for 24x7 systems (fits a weekend); slow heap leaks "may need 24-72 hours" to distinguish from variance; connection-pool leaks and log/disk growth often surface in 4-12 hours. None cites data. — [RadView blog](https://www.radview.com/blog/soak-testing-enterprise-playbook-catching-slow-burn-defects-memory-leaks-resource-exhaustion/); [SoftwareTestingHelp](https://www.softwaretestinghelp.com/?p=21156)

**Rossi et al. (Facebook), "Continuous Deployment of Mobile Software at Facebook (Showcase)", FSE 2016.** Peer-reviewed industry paper; authors are insiders. FULL (text copy in shared workspace). Cuts FOR on cadence; note it still has a soak.

- iOS process at the time: release branch cut every two weeks; "After five days of stabilization efforts, the code is frozen and a 'soak' period of three days begins. During the soak period, only fixes for launch-blocking issues are accepted." Android cut weekly, with alpha (from master) and beta (from release branch) channels to real users. — [Rossi 2016](https://doi.org/10.1145/2950290.2994157)
- Finding 4: "The length of the deployment cycle does not significantly affect the relative number of cherry-picks and launch-blockers as it decreases from 4 weeks to 2 weeks (and then to 1 week for Android)." Finding 5: "The shortening of the release cycle does not appear to affect the crash rate." Finding 3: critical issues from deployments "almost constant regardless of the number of deployments". — [Rossi 2016](https://doi.org/10.1145/2950290.2994157)
- Finding 6: "Software pushed on the day of the deadline is of lower quality." Finding 7: more developers modifying a file per release correlates with lower quality. Abstract: dog-fooding and alpha/beta feedback are "critical to maintaining release quality". — [Rossi 2016](https://doi.org/10.1145/2950290.2994157)
- Limits: the paper does NOT report how many issues were found during the three-day soak versus the five-day stabilization, so it gives no defect-versus-time curve. The soak here runs with builds in the hands of employees and beta users (real usage), not a lab. Mobile cannot roll back, which is why a soak exists at all; server-side has more options. Finding 6 is evidence that release-train deadlines themselves degrade quality.

**Khomh, Dhaliwal, Zou, Adams, "Do Faster Releases Improve Software Quality? An Empirical Case Study of Mozilla Firefox", MSR 2012.** Peer-reviewed. FULL. Mixed.

- Compared Firefox traditional releases (3.6, 4.0; about 52 weeks between majors) with rapid releases (5-9; 6-week cycle), 2010-2011, using Socorro crash data and Bugzilla. — [Khomh 2012](https://swat.polymtl.ca/~foutsekh/docs/Khomh-MSR-2012.pdf)
- Abstract: "(1) with shorter release cycles, users do not experience significantly more post-release bugs and (2) bugs are fixed faster, yet (3) users experience these bugs earlier during software execution (the program crashes earlier)." — [Khomh 2012](https://swat.polymtl.ca/~foutsekh/docs/Khomh-MSR-2012.pdf)
- RQ1: no significant difference in post-release bugs per day when controlling for cycle length; median uptime (time from start to crash) significantly lower for rapid-release versions. RQ2: median fix time 16 days (traditional) versus 6 days (rapid), Wilcoxon p = 5.22e-08; "developers take almost three times longer to fix bugs under the traditional release cycle". But "a smaller proportion of bugs is fixed compared to the traditional release model, which allows a longer testing period." RQ3: rapid-release versions are adopted faster by users. — [Khomh 2012](https://swat.polymtl.ca/~foutsekh/docs/Khomh-MSR-2012.pdf)
- Limits: one product, a consumer browser; crash-linked bugs only; observational before/after with confounds (process and tooling changed at the same time); says nothing about soak environments.

**Khomh, Adams, Dhaliwal, Zou, "Understanding the impact of rapid releases on software quality: the case of Firefox", Empirical Software Engineering 20(2), 2015 (online 2014).** Peer-reviewed. ABSTRACT only (truncated). Mixed.

- Extension of the 2012 study adding feedback from Mozilla project members and analysis of source-code changes; compares crash rates, median uptime and proportion of pre- and post-release bugs. I could not read the results beyond the abstract's framing. — [Khomh 2015](https://link.springer.com/article/10.1007/s10664-014-9308-x)

**Mäntylä, Adams, Khomh, Engström, Petersen, "On rapid releases and software testing: a case study and a semi-systematic literature review", Empirical Software Engineering, 2015 (online 2014).** Peer-reviewed. NOT READ: abstract and full text were inaccessible (publisher redirect; abstract elided in Semantic Scholar). Only bibliographic data verified. — [Mäntylä 2015](https://doi.org/10.1007/s10664-014-9338-4)

- Second-hand only: the sidebar in Souza et al. 2015 (which I read) summarizes prior work by Mäntylä et al. as finding Mozilla had to involve more testers and narrow the testing's scope under rapid releases. Treat as a pointer, not a verified finding; exact figures (test executions, platforms covered) could not be confirmed.

**Souza, Chavez, Bittencourt, "Rapid Releases and Patch Backouts: A Software Analytics Approach", IEEE Software 32(2), Mar/Apr 2015, pp. 89-96.** Peer-reviewed magazine article. FULL (author-archived PDF). Mixed, on balance FOR.

- Table (traditional / transitional / rapid periods): bug fixes per day 17.8 / 21.1 / 33.7; fixes backed out 6.3% / 9.1% / 9.4%; early backout rate 3.5% / 5.1% / 8.3%; late backout rate 3.1% / 4.9% / 1.5%; share of backed-out fixes backed out early 56.7% / 55.5% / 87.7%; median time-to-backout 5.7 / 12.6 / 4.2 hours. — [Souza 2015](https://repositorio.ufba.br/bitstream/ri/19295/1/2015-ISW-RodrigoSouza.pdf)
- "Early" = before the bug was marked Fixed (typically the commit broke its first build or automated tests); "late" = after. The overall backout rate rose under rapid release; the late rate fell after integration repositories and build "sheriffs" were introduced. — [Souza 2015](https://repositorio.ufba.br/bitstream/ri/19295/1/2015-ISW-RodrigoSouza.pdf)
- "only very late backouts affected users, and these were rare under both traditional and rapid releases", because fixes still passed through Aurora and Beta channels "during two release cycles" before general release. A Mozilla engineer is quoted: the process "gives us a margin of safety to detect regressions well before the code actually reaches the hands of users." — [Souza 2015](https://repositorio.ufba.br/bitstream/ri/19295/1/2015-ISW-RodrigoSouza.pdf)
- Limits: single project; backouts identified by commit-message heuristics; Firefox's safety margin is a staged exposure to progressively larger real-user populations (Nightly, Aurora, Beta), i.e. a ramp, not a lab soak. Related work by the same authors (SBES 2014, SNIPPET only) reports the bug reopening rate rose from 12.6% to 13.5% under rapid release. — [Souza SBES 2014 slides](https://speakerdeck.com/rodrigorgs/do-rapid-releases-affect-bug-reopening-a-case-study-of-firefox)

**Clare Liguori (AWS), "Automating safe, hands-off deployments", Amazon Builders' Library, published 18 Jun 2020.** First-party practitioner article (vendor-published; byline not captured in my extract, attribution per the AWS page). FULL. Cuts AGAINST dropping elapsed-time holds; FOR moving them into production stages.

- Section "Bake time": "Sometimes a negative impact caused by a deployment is not readily apparent. It's slow burning." It may not show "especially if the service is under low load at the time". Each production stage therefore has bake time during which the pipeline watches the high-severity aggregate alarm. — [AWS Builders' Library 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Numbers: typical pipeline waits "at least one hour after each one-box stage, at least 12 hours after the first regional wave, and at least two to four hours after each of the rest of the regional waves"; bake also requires a minimum number of data points (example: "wait for at least 100 requests to the Create API"); default bake times deploy a change to all Regions "in about four or five business days"; larger or highly critical services are more conservative. — [AWS Builders' Library 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Pre-production is retained: alpha, beta, gamma stages; gamma is "as production-like as possible" with the same alarms and continuous synthetic canary tests; a gamma one-box stage runs new and old code side by side "such as 30 minutes or one hour" to check backward compatibility. — [AWS Builders' Library 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Batching caveat: narrow deployment time windows "can cause changes to pile up", raising the likelihood that one of them has an impact when the window opens; changes enter the production pipeline continuously "so we don't end up with large bundles of changes". Many teams exclude Fridays and late afternoons because "some issues might not surface for hours". — [AWS Builders' Library 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Limits: describes practice and rationale; gives no data on how many defects bake time catches or at what elapsed time.

**Lyft part 4 (see Key Question 1).** Staging bake gate defaults to 10 minutes and relies on continuous simulated traffic to trip alarms. — [Lyft part 4](https://eng.lyft.com/scaling-productivity-on-microservices-at-lyft-part-4-gating-deploys-with-automated-acceptance-4417e0ebc274)

**Netflix Kayenta post (see Key Question 4).** Netflix creates a fresh baseline cluster so metrics are "free of any effects caused by long-running processes", which means its canary comparison is deliberately blind to long-uptime effects. — [Netflix 2018](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)

### Inferences

- The defect classes soak is designed for (leaks, pool exhaustion, disk/log growth, slow degradation, time-triggered jobs) are real and are the same classes that short canaries miss. The dispute is where and under what load the elapsed time is spent, not whether elapsed time ever matters.
- AWS's design is the clearest model of "what replaces it": hold time in a small production slice, under real load, with automated alarms and a minimum-traffic condition, with new changes flowing continuously rather than batched. Its end-to-end time (four to five business days to all Regions) is comparable to the reader's three-day promotion; the difference is that exposure is real and incremental and changes are not bundled.
- The Firefox and Facebook studies suggest shortening stabilization did not raise user-visible defect rates, but both retained staged exposure to real users. They are evidence for "staged real-user exposure substitutes for long stabilization", not for "no hold period".
- A three-day soak cannot, by construction, observe month-end, quarter-end or other calendar-driven batch behavior unless the clock or data is manipulated; neither can a short canary. Majors lists calendar time among production-only factors (opinion).

### Gaps

- No empirical defect-detection-versus-soak-time data found (no curve of defects found by hour/day of soak) in any primary source. Rossi et al. describe a three-day soak but do not break out what it catches. This is the main evidentiary hole on both sides.
- No authoritative source found for documented soak practice in finance, telecom or embedded (e.g., a standard mandating 72-hour soak). Only vendor/tutorial convention was found. The claim "finance soaks for N days because of X regulation" could not be sourced.
- Mäntylä et al. findings could not be verified from the paper.
- Chrome release-channel studies were not located.

## Key Question 3: Change size and risk

### Takeaway

Peer-reviewed studies from telecom (5ESS) and Windows show that larger and more diffuse changes are more failure-prone, and industry papers from Facebook show critical issues staying roughly flat as deployment counts rose with small per-deploy sizes; survey research (DORA) associates high deployment frequency with lower change-failure rates. None of these is a controlled test of "same code shipped as one large release versus many small ones", so the batch-size claim is well supported by correlation and mechanism but not by experiment.

### Cited Findings

**Mockus and Weiss, "Predicting Risk of Software Changes", Bell Labs Technical Journal 5(2), Apr-Jun 2000.** Peer-reviewed; telecom switching software. FULL (author-hosted PDF; results section read). Cuts FOR.

- Models probability that a change (IMR) to 5ESS switch software causes a failure, using about 15,000 IMRs over ten years. Predictors: size (lines added/deleted), diffusion (files, modules, subsystems touched), interval, developer experience, type. — [Mockus and Weiss 2000](http://mockus.us/papers/bltj13.pdf)
- Result: "the IMR failure probability increases with the number of deltas, the number of lines of code added, and the number of subsystems touched. Average programmer experience significantly decreases the failure probability." Changes fixing field problems are more likely to fail, other things equal. Abstract: "change diffusion and developer experience are essential to predicting failures". The paper also notes very large releases "typically cause at least one failure". — [Mockus and Weiss 2000](http://mockus.us/papers/bltj13.pdf)
- Limits: one commercial project; predates 2007; a predictive association, not a causal experiment; it was used to target extra inspection and testing at risky changes, i.e. it supports risk-proportional gating rather than uniform gating.

**Nagappan and Ball, "Use of Relative Code Churn Measures to Predict System Defect Density", ICSE 2005.** Peer-reviewed (Microsoft Research). FULL (abstract and hypotheses read). Cuts FOR, weakly.

- On Windows Server 2003, relative churn measures predict defect density while "absolute measures of code churn are poor predictors"; the metric suite discriminates fault-prone from not-fault-prone binaries "with an accuracy of 89.0 percent". — [Nagappan and Ball 2005](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/icse05churn.pdf)
- Limits: about churn per binary within a boxed release, not deployment batch size; the finding that absolute churn is a poor predictor is a caution against a naive "fewer lines = safer" reading.

**Savor et al. 2016 and Rossi et al. 2016 (see above).** Facebook average deployed update 92 lines (median 33); critical issues roughly constant as deployments grew; low-priority issues grow with lines deployed. Rossi Finding 6: code pushed on the branch-cut deadline day is of lower quality. — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/); [Rossi 2016](https://doi.org/10.1145/2950290.2994157)

**DORA / Puppet, "2017 State of DevOps Report" (Forsgren, Humble, Kim et al.); basis for the book Accelerate (2018).** Survey research with commercial sponsors. Text copy in shared workspace read for the cited lines only; the book Accelerate was NOT read. URL below is the usual DORA-hosted location and was not fetched by me. Cuts FOR.

- High performers reported change failure rate between zero and 15 percent and a rate "5 times lower" than low performers; the report lists "Working in small batches" among associated practices. — [2017 State of DevOps Report](https://services.google.com/fh/files/misc/state-of-devops-2017.pdf)
- Limits: self-reported survey with banded answers; cross-sectional association; change failure rate is per change, so a team shipping many small changes can have a low rate and a similar absolute number of failures; batch size is not measured directly.

**Allspaw and Hammond (Flickr), "10+ Deploys Per Day: Dev and Ops Cooperation at Flickr", Velocity 2009 slides.** Conference talk. Slide text read (copy in shared workspace); no narration. Cuts FOR as historical opinion.

- Slides state "change is the root cause of most outages!" and advocate "Small frequent changes" and "Dark launches" to lower the risk of change. — [Hammond slides PDF](https://paulhammond.org/2009/06/velocity/10deploys.pdf)
- I could NOT find or verify any Allspaw/Etsy graph of change size versus incidents. Do not cite one.

**Monzo, "How we deploy to production over 100 times a day", 15 May 2022.** First-party practitioner (a regulated UK bank). Text copy in shared workspace; URL not verified by me. Cuts FOR.

- "less friction encourages smaller changes, and smaller changes are less risky"; reports "a significant reduction in incidents" while rollbacks per deployment stayed "relatively constant"; cautions that these metrics "are just proxies". Pipeline still requires staging before production. — [Monzo 2022 (URL unverified)](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day)

**Google SRE book ch. 1 (see above).** "roughly 70% of outages are due to changes in a live system" (no method given). — [SRE book ch. 1](https://sre.google/sre-book/introduction/)

**SEC order, In the Matter of Knight Capital Americas LLC, Release No. 34-70694, 16 Oct 2013.** Regulator finding. Text copy in shared workspace read for cited facts; URL is the standard SEC location, not fetched by me. Cuts AGAINST naive flag use (a caution, not an argument for soak).

- New code repurposed a flag that formerly activated a long-unused function ("Power Peg") which remained "present and callable"; Knight had not retested that code after a 2005 change; losses exceeded $460 million in about forty-five minutes on 1 Aug 2012. — [SEC order 34-70694](https://www.sec.gov/litigation/admin/2013/34-70694.pdf)
- Limits: a deployment-control and dead-code failure; does not bear on soak duration.

### Inferences

- A twice-weekly train with three days of promotion necessarily batches several days of changes; AWS and Rossi both identify batching/deadline effects as risk-increasing in their own right. So the release train's safety benefit has an offsetting cost that the soak does not remove.
- Diagnosis is a separate benefit from failure probability: with one small change per deploy, a regression in a canary is attributable to that change. I found this asserted (Majors, Monzo) but not measured.
- Flags add their own risk surface (stale flags, flag reuse), as Knight shows; a ramping culture needs flag lifecycle controls.

### Gaps

- No controlled study of deployment size versus incident rate found. No Google or Facebook dataset relating change size to production incident probability was located (Savor/Rossi report sizes and issue trends, not a size-to-failure regression).
- Accelerate itself was not read; page-level claims about batch size should be checked against the book.

## Key Question 4: Statistical and operational design of ramps, and what ramps cannot detect

### Takeaway

The literature gives concrete design rules: small first stages are for risk containment and should be short, power comes from population rather than waiting, hold at the maximum-power stage for at least a full week when the goal is measuring user-behavior effects, and use sequential tests for continuous monitoring. The same sources are explicit that canaries miss slow-manifesting, low-traffic, rare-path, stateful and higher-order (data-damage) faults and are "not a panacea".

### Cited Findings

**Xu, Duan, Huang (LinkedIn), "SQR: Balancing Speed, Quality and Risk in Online Experiments", KDD 2018 (arXiv 1801.08532).** Peer-reviewed industry paper. FULL. Cuts FOR, and supplies the design vocabulary.

- Baseline at LinkedIn: an experiment took on average four ramps to reach 100%, "where each ramp takes about six days"; teams waited about 6 days at 5% and 6.5 days at 50%, i.e. treated all ramps alike. — [SQR, KDD 2018](https://arxiv.org/pdf/1801.08532)
- Waiting is weak; population is strong: "the benefit of running longer drastically diminishes after 1 week"; a 10% ramp for 1 week gives a narrower confidence interval than a 5% ramp for 2 weeks (Fig. 2). A 10% ramp for two weeks may be unable to detect a -1% revenue effect that a 50% ramp detects in two days, while losing more revenue. — [SQR, KDD 2018](https://arxiv.org/pdf/1801.08532)
- Four phases: pre-MPR ramps for risk mitigation; the Maximum Power Ramp (50/50 with one treatment) for measurement; optional post-MPR ramps for operational/capacity concerns; optional long-term holdout. Principle 1: ramp quickly to MPR once risk is judged small; "we should not be 'waiting' for statistical significance at any pre-MPR ramps". Principle 2: stay at MPR "for at least a week, and longer if burn-in effect is present", because a one-day run is biased to heavy users and misses day-of-week effects. Principle 3: post-MPR operational ramps "should only take a day or less, usually covering peak traffic period". Principle 4: long-term holdouts (e.g., 5% held out "usually over a month") only with a clear learning objective. — [SQR, KDD 2018](https://arxiv.org/pdf/1801.08532)
- Risk at early ramps is quantified against a risk tolerance and tested with a Generalized Sequential Probability Ratio Test to decide whether to advance (Section 4). — [SQR, KDD 2018](https://arxiv.org/pdf/1801.08532)
- Limits: designed for product/business metrics on a very large user base; does not address rare events, data corruption or batch jobs; assumes abundant traffic. A system with few, large, heterogeneous transactions may never reach the power these rules assume.

**Google SRE Workbook ch. 16 "Canarying Releases" (2018).** Practitioner book. TOOL. Cuts BOTH.

- Definition: "a partial and time-limited deployment of a change in a service and its evaluation" (TOOL quote). Error-budget impact is proportional to traffic exposed; worked example given by the tool: a defect causing 20% errors costs about 1% overall when confined to a 5% canary. Canary should be "sizeable and last long enough to be representative"; with 20 deploys a day the canary "must be significantly shorter"; "We strongly advise running only one canary deployment at a time." — [SRE Workbook ch. 16](https://sre.google/workbook/canarying-releases/)
- Stated limits: "Performance defects typically manifest only under heavy load"; ending a canary "after receiving just a handful of queries doesn't provide a useful signal"; before/after comparison is unreliable because time is a major source of metric change; traffic teeing "doesn't adequately identify risk in stateful systems"; artificial load is dangerous for mutable systems ("it may be downright dangerous to attempt to generate artificial load on a billing system") (all TOOL quotes). — [SRE Workbook ch. 16](https://sre.google/workbook/canarying-releases/)
- The tool reported that the chapter does not name memory leaks or "bake time" explicitly; do not attribute those terms to it. The chapter's own quantitative model is described as simple with "clear flaws".

**Štěpán Davidovič with Betsy Beyer (Google), "Canary Analysis Service", ACM Queue 16(1), 6 Mar 2018.** Practitioner article in a reviewed magazine. FULL. Cuts BOTH.

- "Canarying is a very useful method of increasing production safety, but it is not a panacea. It should not replace unit testing, integration testing, or monitoring." — [CAS, ACM Queue 2018](https://queue.acm.org/detail.cfm?id=3194655)
- "CAS is useful but far from perfect. It has experienced incidents when users disregarded a canary failure and pushed a broken release." Over-strict canary configurations block acceptable releases and cause toil. — [CAS, ACM Queue 2018](https://queue.acm.org/detail.cfm?id=3194655)
- Section "Impact Analysis is Very Hard": Google could not cleanly measure how many outages CAS prevents; it settled on "near-miss analysis" of large post-mortems that CAS could have prevented but did not. — [CAS, ACM Queue 2018](https://queue.acm.org/detail.cfm?id=3194655)
- Limits: no detection-rate figures. Important for honesty: even Google reports no quantified effectiveness for automated canarying.

**Michael Graff and Chris Sanden (Netflix), "Automated Canary Analysis at Netflix with Kayenta", Netflix Tech Blog, 10 Apr 2018.** First-party practitioner. FULL (via Wayback). Cuts FOR, with a built-in limit.

- Three clusters: production, a fresh baseline (same code as production; "Typically, 3 instances"), and canary (3 instances). Metrics compared with confidence intervals from the Mann-Whitney U test; each metric classified Pass/High/Low; score = share of metrics passing; Spinnaker continues, rolls back or asks for manual judgment. — [Netflix 2018](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- "Creating a brand new baseline cluster ensures that the metrics produced are free of any effects caused by long-running processes." Manual canary analysis previously took "several hours" per canary and limited deploys to once or twice a week. — [Netflix 2018](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Limits: no canary duration guidance or detection-rate data in the post; three-instance canaries see a small traffic sample.

**Uber, "Under the Hood of Uber's Experimentation Platform", 28 Aug 2018.** First-party practitioner. FULL (via Wayback). Cuts FOR.

- Fixed-horizon tests inflate Type-I error under repeated looks, so Uber monitors running experiments with sequential tests, mainly the mixture sequential probability ratio test (mSPRT), comparing metrics such as app crash rates and trip frequency between treatment and control; experiments are alerted or paused on significant degradation. Variance is estimated with delete-a-group jackknife/block bootstrap because same-user observations across days are correlated; Benjamini-Hochberg correction across many monitored metrics. — [Uber 2018](https://www.uber.com/blog/xp/)
- Limits: no figures on detection time or population; monitoring is on daily cumulative differences in the example.

**Microsoft ExP: Machmouchi, Gupta, Zhang, Fabijan, "Patterns of Trustworthy Experimentation: Pre-Experiment Stage", 31 Jul 2020; and Xia et al., "Safe Velocity: A Practical Guide to Software Deployment at Scale using Controlled Rollout", ICSE-SEIP 2019.** Vendor research blog (TOOL) and peer-reviewed paper (ABSTRACT only). Cuts FOR.

- Blog: safe rollout exposes treatment "gradually across various user populations or rings" (dogfood/beta first), then by percentage, e.g. 1%, then 5%, then 10%; dogfood results will not necessarily apply to the general population; larger exposure gives power to detect "unanticipated regressions" (TOOL quotes). No stage durations given. — [Microsoft ExP 2020](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-pre-experiment-stage/)
- Safe Velocity abstract: "controlled rollout (CRL)... applies controlled experimentation to each ring of a traditional phased rollout"; covers "strategies for selecting the length of the rollout period", metrics and pass criteria per ring; evaluated on "hundreds of controlled rollouts at Microsoft Office". I could not read the paper's specific durations or results. — [Safe Velocity, MSR page](https://www.microsoft.com/en-us/research/publication/safe-velocity-a-practical-guide-to-software-deployment-at-scale-using-controlled-rollout/)

**Google SRE book ch. 17 (see Key Question 1).** A canary "doesn't always catch newly introduced faults"; higher-order faults (damaged or reused data) surface later than first-order ones in the chapter's rollout model (TOOL). — [SRE book ch. 17](https://sre.google/sre-book/testing-reliability/)

**AWS Builders' Library (see Key Question 2).** Operational answer to slow-burn faults: bake of at least 1 hour per one-box, at least 12 hours after the first regional wave, plus minimum request counts; one-box alarms scoped to the one box because a small slice "might not trigger the service's high-severity rollback alarm". — [AWS Builders' Library 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)

**Cindy Sridharan, "Testing in Production: the hard parts", Medium, 29 Sep 2019.** Opinion/practitioner essay. FULL (via Wayback). Cuts AGAINST easy adoption.

- "Two of the hardest problems of testing in production are curtailing blast radius and dealing with state." Staged deploys of stateless services are "much easier" than of databases or platform software; for stateful or platform components, "there indeed might be no such thing as a rollback". Slow degradation is "a latent failure mode that is uniquely hard to model and test". — [Sridharan 2019](https://copyconstruct.medium.com/testing-in-production-the-hard-parts-3f06cefaf592)
- Quotes a Netflix post on data: "bad data on 1% of load balancers is an annoyance, bad data on 100% of them is an outage" (second-hand). — [Sridharan 2019](https://copyconstruct.medium.com/testing-in-production-the-hard-parts-3f06cefaf592)
- Sridharan 2018 also quotes a Facebook source noting that an A/B test on a small share of users that makes servers crash or run out of memory has impact "beyond the limited users in the test" (second-hand). — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)

### Inferences

- Mapping SQR to release safety: the pre-MPR stages (risk containment) need hours and a minimum event count, not days; elapsed time is needed for a defined purpose (weekly cycle, burn-in, slow leak), which argues for one deliberate hold at a meaningful exposure rather than uniform multi-day holds at every environment.
- What ramps cannot detect, assembled from the sources: (a) slow leaks and other long-uptime effects, unless a bake is added (AWS) and the baseline is not reset (Kayenta's fresh baseline hides them); (b) calendar-dependent behavior such as month-end batch, which no hold shorter than the calendar period sees; (c) rare client paths and low-volume endpoints, where the canary receives too few events (Workbook; AWS minimum-request rule); (d) higher-order faults where data is damaged and consumed later (SRE ch. 17), including irreversible writes for which rollback does not undo harm (Sridharan 2019); (e) load-dependent defects that only appear at full traffic (Workbook; SQR's post-MPR ramps); (f) shared-resource damage where a small cohort's failure takes down shared servers.
- For finance specifically, (b) and (d) are the hard cases. The sources offer compensating controls (shadow comparison, tenancy isolation, reconciliation) rather than a claim that ramps cover them.
- The absence of any published detection-rate data for canaries (CAS) mirrors the absence of defect-yield data for soak. The essay should not claim canaries are empirically proven to catch more; the defensible claim is about fidelity and exposure control.

### Gaps

- No source gives a formula or table for canary duration as a function of traffic and target detectable regression for operational metrics; SQR does this for product metrics only. Safe Velocity may, but was not readable.
- No quantified false-negative rate for canary analysis found.
- Nothing found on ramp design for low-volume, high-value transaction systems (the finance case), where per-stage populations are small.

## Key Question 5: Shadow/dark traffic and old-versus-new comparison as a substitute for pre-production regression soak

### Takeaway

Mirroring production requests to a candidate and diffing its responses against the incumbent is well documented (Twitter Diffy, GitHub Scientist, Facebook/OANDA shadow testing, Uber replay) and directly targets correctness on real input distributions without user exposure; its documented limit is side effects and state, so for write paths it needs stubbing, isolation or read-only comparison.

### Cited Findings

**Twitter Engineering, "Diffy: Testing services without writing tests", 3 Sep 2015.** First-party practitioner (post has no personal byline in the copy I read). FULL (via Wayback). Cuts FOR.

- Diffy proxies each request to three instances: candidate (new code), primary (known-good), secondary (same known-good). Candidate-versus-primary differences are compared with primary-versus-secondary differences to cancel non-deterministic noise (timestamps, random values, races in live downstream data). — [Twitter 2015](https://blog.twitter.com/engineering/en_us/a/2015/diffy-testing-services-without-writing-tests)
- Premise: if two implementations return "similar" responses "for a sufficiently large and diverse set of requests", the new one "can be treated as equivalent" and regression-free. — [Twitter 2015](https://blog.twitter.com/engineering/en_us/a/2015/diffy-testing-services-without-writing-tests)
- Limits: no detection statistics; correctness of responses only; the post does not address writes.

**GitHub Engineering, "Scientist: Measure Twice, Cut Over Once", 3 Feb 2016; and "Move Fast and Fix Things", 15 Dec 2015.** First-party practitioner. FULL. Cuts FOR, with a hard limit.

- Scientist runs the old path (control) and new path (candidate) in production, returns the control's result to the user, and records mismatches and timings. Rationale: tests are not enough because production data has quality problems that cause untested behavior. — [GitHub 2016](https://github.blog/2016-02-03-scientist/)
- Case (merge implementation rewrite): started at 1% of requests; iterated on mismatches and slow cases for 4 days; then ran at 100% for 24 hours with no mismatches. "Scientist verified tens of millions of merge commits to be virtually identical in the old and new paths." Most early mismatches were the old code timing out; one real bug was a missing time argument. GitHub was doing about 60 deploys a day of its main application at the time. — [GitHub 2015](https://github.blog/2015-12-15-move-fast/)
- Limit (exact): "Scientist is not meant to be used for any code that has side-effects." Writing to the same database or invalidating a cache from the candidate path is "dangerous and incorrect". There is also a production performance cost; experiments should run only as long as needed. — [GitHub 2016](https://github.blog/2016-02-03-scientist/)

**Sridharan 2018, sections "Shadowing" and "Tap Compare".** Opinion/survey. FULL. Cuts BOTH.

- Distinguishes shadowing (fire-and-forget mirror; tests load, impact, config) from tap compare (responses compared for correctness). Full-traffic shadowing at peak may need "2X the capacity". — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)
- "shadowing works best for testing idempotent requests or testing stateless services with any stateful backend being stubbed out"; interaction with stateful backends for non-idempotent requests is then left to "integration testing or in a staging environment". For tap compare, "side-effects still remain an unsolved problem"; it is "less useful" for judging behavior under peak load. — [Sridharan 2018](https://copyconstruct.medium.com/testing-in-production-the-safe-way-18ca102d0ef1)

**Savor et al. 2016.** Shadow testing listed as a standard practice at Facebook/OANDA: production traffic "is cloned and sent to a set of shadow machines that execute newer code than production"; results "can be automatically compared and discrepancies reported as failures." — [Savor 2016](https://research.facebook.com/publications/continuous-deployment-at-facebook-and-oanda/)

**Uber 2020 (multi-tenancy).** Replay and shadow traffic get their own tenancy; "we stub responses for any outbound calls made by the instance being tested" (TOOL quote); data isolation must cover config, logs, metrics, storage and queues. — [Uber 2020](https://www.uber.com/blog/multitenancy-microservice-architecture/)

**SRE Workbook ch. 16.** Traffic teeing: the canary "serves the copy and discards the responses"; it "doesn't adequately identify risk in stateful systems"; a shared cache can inflate hit rates and invalidate performance measurement (TOOL quotes). — [SRE Workbook ch. 16](https://sre.google/workbook/canarying-releases/)

### Inferences

- For a correctness-critical finance system, old-versus-new comparison on mirrored production input is the closest substitute for a regression soak: it gives production input diversity (which staging lacks) with zero customer exposure (which canaries lack), and a zero-mismatch run over N million real requests is a stronger and more legible acceptance criterion than "three days passed without an alarm".
- It does not replace the soak's time dimension unless it is left running, and it does not cover write paths without isolation. A plausible combined design from the sources: shadow/tap-compare for read and pure-computation paths; tenancy or virtual-money environments (OANDA's demo system) for write paths; a production bake with minimum event counts for slow-burn effects; flags to separate deploy from release.
- GitHub's 4-days-then-24-hours example shows shadow comparison still consumes calendar time; the gain is that the time is spent finding real mismatches on real data, and that it is per-change rather than a fixed tax on every release.

### Gaps

- No published detection-rate or false-positive data for Diffy-style comparison.
- No first-party finance (bank, exchange, payments) account of shadow comparison for ledger or pricing systems was found in this pass; OANDA's virtual-money demo system is the nearest.
- Sridharan's 2022 "Testing in Production: the fate of state" (on stateful systems) was not retrieved; it is the obvious next source for write-path comparison.
