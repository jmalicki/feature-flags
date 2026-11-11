# Chart data: from testing gates to ramping culture (1997-2022)

Research date: 2026-11-10. Method: every number in a "Cited Findings" table was read in the source document itself (PDF text extracted with `pdftotext`, or the HTML page fetched and converted to text), not from search snippets. "Locator" gives the page, section or paragraph where the number appears. "PDF p." means the page index in the PDF file, which matched the printed page number wherever a printed number existed. Anything I could not open is listed under "Gaps" as unverified and must not be charted without checking.

Global comparability warning: "deployment", "push", "release", "launch" and "experiment" mean different things in every source below. Amazon counts deployments across thousands of services; Facebook counts pushes of one monolith; Chrome counts client milestones; DORA reports survey answer categories. No cross-company line chart of "deploys per day" is honest unless each series is labelled with its own definition.

## 1. Release cadence over time at individual companies

### Takeaway

Several companies documented their own before-and-after cadence in primary sources (Facebook web and mobile, Chrome, Firefox, Dropbox desktop, LinkedIn experiments, Bing experiments), so per-company step charts are well supported. A single cross-company "deploys per day" axis is not supported, because the units differ, and the Etsy by-year series, Netflix, and the Microsoft box-product baseline could not be verified from a primary source in this session.

### Cited Findings

#### Facebook web (facebook.com front end)

| Value | Unit | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- |
| 1 release engineer, "around 100 developers in one location" | staff | 2008 | 2012-08-03 | [Rossi, "Ship early and ship twice as often"](https://engineering.fb.com/2012/08/03/uncategorized/ship-early-and-ship-twice-as-often/), para. 3 | Recollection by the author, round number |
| Site updated "every work day"; "hundreds of engineers working on thousands of changes every week"; "over 800 million people" | cadence, staff | early 2012 | 2012-04-05 | [Rossi, "Release engineering and push karma"](https://engineering.fb.com/2012/04/05/production-engineering/release-engineering-and-push-karma-chuck-rossi/), intro | Interview post, round numbers |
| Twice a day (New York push added to the California daily push) | pushes per day | from late July 2012 | 2012-08-03 | Same 2012-08-03 post, para. 2 | Refers to the daily pushes, not the weekly release |
| "1000 engineers"; "6 times the amount of code per week" versus 2008 | staff, ratio | Aug 2012 vs 2008 | 2012-08-03 | Same post, para. 3 | Ratio only; no absolute code volume given |
| Weekly push (Tuesday afternoon, "thousands of changes") plus "a smaller push twice daily on other workdays" | cadence | c. 2012-2013 | 2013 | [Feitelson, Frachtenberg, Beck, "Development and Deployment at Facebook"](https://www.frachtenberg.org/eitan/pubs/papers/feitelson13:devops.pdf), section on the push, PDF p. 6-7 | Author-hosted copy; journal venue not printed on this copy |
| "up to 500 times a day", "some 3,000 files" | commits per day, files changed | c. 2012-2013 | 2013 | Same paper, PDF p. 1 (first paragraph after keywords) | Upper bound ("up to"), not a mean |
| "more than 10.5 million lines", "nearly 8.5 million" PHP | lines of code | c. 2012-2013 | 2013 | Same paper, PDF p. 3 | Excludes comments and blank lines |
| "only about 1% of the engineers average more than 10 commits per week" | share of engineers | 2005-2012 data | 2013 | Same paper, Figure 4 caption, PDF p. 6 | Engineers with at least 10 commits |
| "three times a day" for "many years"; "between 500 and 700 cherry-picks per day"; weekly release branch cut | pushes per day, cherry-picks per day | before 2016 | 2017-08-31 | [Rossi, "Rapid release at massive scale"](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), para. 3 | Conflicts mildly with "twice a day" in the 2012 post and the 2013 paper; the third push is not dated |
| "more than 1,000 diffs a day" to master; weekly push "sometimes as many as 10,000 diffs" | diffs | 2016 | 2017-08-31 | Same post, para. 5 | "Diffs" are code-review units, not commits in the 2013 sense |
| "tens to hundreds of diffs every few hours"; each release reaches 100% "over a few hours" | diffs per push, duration | from April 2017 | 2017-08-31 | Same post, "Continuous delivery at scale" | "Quasi-continuous"; no exact pushes-per-day figure is given |
| "starting with a handful of engineers in 2007 to thousands today" | staff | 2007, 2017 | 2017-08-31 | Same post, para. 4 | Qualitative |

#### Facebook mobile

| Value | Unit | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- |
| Android: "from a deployment every 8 weeks to a deployment every week" "over a period of 4 years" | release cycle | c. 2012-2016 | 2016-11 | [Rossi et al., "Continuous Deployment of Mobile Software at Facebook", FSE 2016](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf), abstract and section 1 | The figures in the paper mark 4-week, 2-week and 1-week periods; the 8-week starting point appears only in the abstract and introduction |
| 4-week, then 2-week, then (Android only) 1-week cadence | release cycle | 2012-2016 | 2016-11 | Same paper, Figures 6-7 and captions | iOS stayed at 2 weeks in this paper |
| Release branch cut "once a week for Android and once every two weeks for iOS" | cadence | 2016 | 2016-11 | Same paper, section 1 | |
| Mobile engineering team "grows by a factor of 15" | ratio | 2012-2016 | 2016-11 | Same paper, Finding 1 | No absolute headcount |
| About 70 lines of code per developer per day; 0.7 (Android) and 0.8 (iOS) pushes per developer per day | productivity | 2012-2016 | 2016-11 | Same paper, section 4.1, Figures 2-3 | "Over the last two years" before publication; pushes over 2,000 lines and bot pushes excluded; company-wide figure is 0.7 |
| Cherry-picks per day stay "within a range of 5-25 for Android and within a range of 5-15 for iOS" | cherry-picks per day, per release | 2012-2016 | 2016-11 | Same paper, section 5.2, Figure 6 | Normalized by cycle length |
| Finding 5: "The shortening of the release cycle does not appear to affect the crash rate" | qualitative | 2012-2016 | 2016-11 | Same paper, section 5.3, Figure 7 | Crash rates are normalized to a hidden constant; no absolute values |
| Alpha crash rate "roughly 10X higher than for production versions" | ratio | 2012-2016 | 2016-11 | Same paper, section 5.3, Figure 8 | |
| "from four-week releases to two-week releases to one-week releases"; "1 million or so Android beta testers"; "between 50,000 and 60,000 builds a day" on Android | cycle, testers, builds | 2017 | 2017-08-31 | [Rossi 2017 post](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), "Bringing continuous delivery to mobile" | |
| Cloud-side context cited inside the FSE paper: 92 lines per update, 3.5 updates per developer per week | productivity | c. 2015 | 2016-11 | Same FSE paper, section 1, citing its reference [1] (Savor et al. 2016) | Second-hand within a primary paper; the Savor paper itself was not opened |

#### Other companies

| Company | Value | Unit | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- | --- |
| Flickr | "10 deploys per day" | deploys per day | 2009 | 2009-06 | [Allspaw and Hammond, Velocity 2009 slides](https://paulhammond.org/2009/06/velocity/10deploys.pdf), title slide | A talk title, rounded; "10+" |
| IMVU | "On average we deploy new code fifty times a day"; 9-minute test suite on 30-40 machines; 6-minute push; peak 6 deploys an hour | deploys per day | early 2009 | 2009-02-10 | [Fitz, "Continuous Deployment at IMVU"](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/), para. 2-3 | Each deploy may batch several commits |
| Etsy | Web push went from "3 developers, 1 operations engineer ... and over an hour" to "1 person and under 2 minutes" | effort per deploy | 2010 | 2010-05-20 | [Kastner, "Quantum of Deployment"](https://www.etsy.com/codeascraft/quantum-of-deployment) (read via a Wayback copy of codeascraft.com), intro | No deploys-per-day figure in this post |
| Amazon | 11.6 seconds mean time between deployments (weekday); 1,079 max deployments in one hour; 10,000 mean and 30,000 max hosts simultaneously receiving a deployment | see value | May 2011 | 2011-06-16 | [Jenkins, "Velocity Culture" slides, Velocity 2011](https://web.archive.org/web/20180831171809/http://assets.en.oreilly.com/1/event/60/Velocity%20Culture%20Presentation.pdf), slide "Amazon May Deployment Stats" | Slide says "production hosts & environments only"; counts all services |
| Amazon | "75% reduction in outages triggered by software deployments since 2006"; "90% reduction in outage minutes"; "~0.001% of software deployments cause an outage" | percent | 2006-2011 | 2011-06-16 | Same slides, later slide | Slide bullet, no method given |
| Amazon | "50M deployments" in "the past 12 months"; "more than one deployment each second" | deployments per year | Nov 2013-Nov 2014 | 2014-11-12 | [Vogels, "The Story of Apollo"](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html), para. 4 | Includes "development, testing, and production hosts"; not comparable with the 2011 production-only figure |
| LinkedIn | "a full month to release new features" to "updates multiple times per day" | cadence | before and after 2011-2012 | 2013-04-10 | [Wired, "The Software Revolution Behind LinkedIn's Gushing Profits"](https://www.wired.com/2013/04/linkedin-software-revolution/) | Journalism quoting Kevin Scott; LinkedIn's own post gives no cadence number |
| LinkedIn | "In late 2011, LinkedIn kicked off an internal initiative called Inversion", pausing feature development | event | late 2011 | 2015 | [LinkedIn, "A Brief History of Scaling LinkedIn"](https://www.linkedin.com/blog/engineering/architecture/brief-history-scaling-linkedin), "Inversion" | Wired says development halted "for two months" |
| Microsoft (Azure DevOps) | Sprints of 3 weeks; plans of 3 sprints; seasons of 6 months; deployments "usually aligned with a three-week sprint cadence" | cadence | current practice | 2022-08-18 (page date) | [Microsoft Learn, "How Microsoft plans with DevOps"](https://learn.microsoft.com/en-us/devops/plan/how-microsoft-plans-devops) and ["How Microsoft develops with DevOps"](https://learn.microsoft.com/en-us/devops/develop/how-microsoft-develops-devops) | The earlier 2-3 year box cycle is not on these pages (see Gaps) |
| Dropbox desktop | "every 2 weeks rather than every 8 weeks"; 10-18 weeks from main branch to 100% of users before; "up to 3 days" to reach an internal user; about 30 engineers at the time | cycle | 2015 vs 2016 | date not captured | [Dropbox, "Accelerating iteration velocity on Dropbox's desktop client", part 1](https://dropbox.tech/application/accelerating-iteration-velocity-on-dropboxs-desktop-client-part-1) and [part 2](https://dropbox.tech/application/accelerating-iteration-velocity-on-dropboxs-desktop-client-part-2) | Publication date not verified |
| Chrome | Stable release "about once every six weeks, roughly twice as often as we do today" | cycle | from 2010 | 2010-07-22 | [Chromium Blog, "Release Early, Release Often"](https://blog.chromium.org/2010/07/release-early-release-often.html) | Implies about 12 weeks before; the post does not state the earlier number |
| Chrome | New milestone "every 4 weeks, starting with Chrome 94 in Q3 of 2021"; Extended Stable every 8 weeks | cycle | from Q3 2021 | 2021-03-04 | [Chromium Blog, "Speeding up Chrome's release cycle"](https://blog.chromium.org/2021/03/speeding-up-release-cycle.html) | The live Chromium release-cycle doc fetched on 2026-11-10 describes a later, shorter cycle; outside the essay's period |
| Firefox | "Starting Q1 2020, we plan to ship a major Firefox release every 4 weeks"; cycle reduced "from 7 weeks down to 6, 5, 4 weeks" | cycle | 2019-2020 | 2019-09-17 | [Mozilla Hacks, "Moving Firefox to a faster 4-week release cycle"](https://hacks.mozilla.org/2019/09/moving-firefox-to-a-faster-4-week-release-cycle/) | The 2011 move to rapid release was not opened (see Gaps) |
| Monzo | "over 100 times a day"; engineering headcount "from 148 to 232" in a year | deploys per day | 2021-2022 | 2022-05-15 | [Monzo, "How we deploy to production over 100 times a day"](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day), title and "past year" paragraph | Microservice deployments; charts in the post have no readable values |

#### Experiment counts over time

| Company | Value | Unit | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- | --- |
| Google | "anywhere from 50 to 200 experiments" at any given time | concurrent experiments | Aug 2008 | 2008-08-26 | [Gomes, "Search experiments, large and small"](https://googleblog.blogspot.com/2008/08/search-experiments-large-and-small.html), para. 1 | Google sites worldwide |
| Google Search | "over 600,000 experiments that resulted in more than 4,500 improvements" | per year | 2020 | page snapshot c. 2021 | [How Search Works, Wayback snapshot](https://web.archive.org/web/2021/https://www.google.com/search/howsearchworks/mission/users/) | "Experiments" here includes rater tests |
| Google Search | 3,620 launches; 17,523 live traffic experiments; 62,937 side-by-side experiments | per year | labelled "Last year" on the same snapshot | c. 2021 | Same snapshot | The snapshot mixes a 2020 headline with a "last year" breakdown; the year of the breakdown is ambiguous (probably 2019) |
| Google Search | 4,781 launches; 16,871 live traffic experiments; 719,326 search quality tests; 124,942 side-by-side experiments | per year | 2023 | live page, read 2026-11-10 | [How Search Works, "Rigorous testing"](https://www.google.com/search/howsearchworks/how-search-works/rigorous-testing/) | Outside the 1997-2022 window |
| Bing | "over 200 concurrent experiments now running on any given day"; each user in "over 15 concurrent experiments"; 10% holdout | concurrent experiments | 2013 | 2013-08 | [Kohavi et al., "Online Controlled Experiments at Large Scale", KDD 2013](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf), abstract and section 1 | Figure 2 shows growth but has no readable data values |
| Bing | "over 10.000 experiments per year" | experiments per year | c. 2016 | 2017-05 | [Fabijan et al., "The Evolution of Continuous Experimentation in Software Product Development", ICSE 2017](https://exp-platform.com/Documents/2017-05%20ICSE2017_EvolutionOfExP.pdf), section on the Bing example | Bing only |
| LinkedIn | About 50 experiments per day at XLNT launch; "more than 200" one year later; 2,800 experiments in the first year; metrics from 60 to more than 700 | concurrent per day | 2013 to Aug 2014 | 2014-08-22 | [LinkedIn, "XLNT Platform: Driving A/B Testing at LinkedIn"](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) | |
| LinkedIn | "over 400 concurrent experiments running per day"; metrics more than 1,000 | concurrent per day | 2015 | 2015-08 | [Xu et al., "From Infrastructure to Culture", KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf), abstract and section 1 | Same platform as the row above, so 50, 200, 400 is one comparable series |
| Booking.com | "more than a thousand concurrent experiments" | concurrent experiments | 2017 | 2017-10 | [Kaufman, Pitchforth, Vermeer, "Democratizing online controlled experiments at Booking.com"](https://arxiv.org/abs/1710.08217), introduction | Includes non-web products |
| 13 organizations | "more than one hundred thousand treatments last year alone" | treatments per year | 2018 | 2019-06 | [Gupta et al., "Top Challenges from the first Practical Online Controlled Experiments Summit", SIGKDD Explorations 21(1)](https://exp-platform.com/Documents/2019-FirstPracticalOnlineControlledExperimentsSummit_SIGKDDExplorations.pdf), conclusion | Sum over Airbnb, Amazon, Booking.com, Facebook, Google, LinkedIn, Lyft, Microsoft, Netflix, Twitter, Uber, Yandex, Stanford |

### Inferences

- Facebook web gives the cleanest single-company cadence series: weekly plus daily (2012), twice daily (Aug 2012), three times daily (undated, before 2016), every few hours (April 2017). The change-volume series is also usable with care: thousands of changes per week (2012-2013), 500-700 cherry-picks per day plus a weekly push of up to 10,000 diffs (2016).
- LinkedIn's 50, 200, 400 concurrent experiments (2013, 2014, 2015) is the only multi-point experiment series where all points come from one platform with one definition.
- Client software (Chrome 6 to 4 weeks, Firefox 7 to 4 weeks, Dropbox 8 to 2 weeks, Facebook Android 8 or 4 weeks to 1 week) forms a natural second chart with a common unit, weeks per release.

### Gaps

- Etsy deploys per day by year: Etsy's Code as Craft pages blocked automated fetch and the talks were not opened. Unverified figures seen second-hand: "Etsy, which reports deploying 80 times per day" appears in the 2016 State of DevOps Report, PDF p. 16, which is a retelling. Figures of roughly 25 to 50 per day for 2011-2014 are from memory only and must not be charted.
- Flickr's footer line about deploys "in the last week" was not present in the fetched text of the 2009 "Flipping Out" post. Unverified.
- Netflix: no primary cadence number was opened. The State of DevOps reports say Amazon and Netflix "deploy thousands of times per day" (2016 report, PDF p. 16), which is second-hand.
- Microsoft box release every 2-3 years before the cloud cadence: widely retold, but not on the Microsoft Learn pages opened. Unverified.
- Firefox's 2011 switch to rapid release and Chrome's pre-2010 cadence: not opened. The Rahman 2016 paper cites both as 6 weeks, second-hand.
- Tang et al. 2010 gives no count of experiments; it describes the design only.
- Journal details for Feitelson et al. (commonly cited as IEEE Internet Computing, July-August 2013) are not printed on the author-hosted copy.

## 2. Ramp schedules actually documented

### Takeaway

Exact, primary-source ramp schedules exist for Facebook (2013, 2015, 2016, 2017), Amazon (2020), Azure DevOps (2022 page), LinkedIn (2020) and Knight's own staged server deployment (2012). Most are described by their authors as typical or example values, and few give durations.

### Cited Findings

| System | Stages as written | Durations | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- | --- |
| Facebook weekly push | H1 (internal servers, engineers only), then H2 ("a few thousand machines that serve a small fraction of real-world users"; figure labels it "1% users"), then H3 (all servers) | Code staged Sunday afternoon, push Tuesday afternoon | c. 2012-2013 | 2013 | [Feitelson et al.](https://www.frachtenberg.org/eitan/pubs/papers/feitelson13:devops.pdf), PDF p. 7 and process figure | "1% users" is a figure label |
| Facebook Gatekeeper feature launch | Developers of the feature, then employees "1%→10%→100%", then "5% of the users from a specific region", then global "1%→ 10%→100%" | None given | 2014-2015 | 2015-10 | [Tang et al., "Holistic Configuration Management at Facebook", SOSP 2015](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), section 4 (Gatekeeper) | Introduced with "For example"; illustrative |
| Facebook config canary | "phase 1, test on 20 servers; in phase 2, test in a full cluster with thousands of servers"; automated canary takes "about ten minutes" | About 10 minutes | 2015 | 2015-10 | Same paper, sections 3.3 and 6.3 | Example spec |
| Facebook migration to push-from-master | "50 percent of employees, then from 0.1 percent to 1 percent to 10 percent of production web traffic", then 100% "over the course of three days in April 2017" | Decision April 2016, complete April 2017 | 2016-2017 | 2017-08-31 | [Rossi 2017](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), para. 6 | This is the ramp of the release system itself |
| Facebook web push tiers | Employees, then "2 percent of production", then "100 percent of production" | "over a few hours" in total | 2017 | 2017-08-31 | Same post, "Continuous delivery at scale" | |
| Facebook Android app | Alpha daily from master to "several 10,000" external users; beta daily from the release branch; Play Store "typically first only 20%, then 50%, and finally 100% of the population" | "over the following three days" | 2016 | 2016-11 | [Rossi et al. FSE 2016](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf), section 2 (Android) | "Typically" |
| Amazon pipelines | Gamma one-box, then per production wave: one-box, then rolling deployment of at most 33% of boxes at a time (some teams 5%), one Availability Zone at a time; sample pipeline: wave 1 low-traffic Region, wave 2 high-traffic Region, wave 3 three Regions, wave 4 up to 12 Regions, wave 5 the rest | "at least one hour after each one-box stage, at least 12 hours after the first regional wave, and at least two to four hours after each of the rest of the regional waves"; all Regions "in about four or five business days" | 2020 | 2020-06-18 | [Liguori, "Automating safe, hands-off deployments", Amazon Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), sections "Production deployments", "One-box and rolling deployments", "Bake time" | "Typical pipeline"; services choose their own values |
| Azure DevOps | Tier 0: internal only (US West Central); tier 1: customers using a breadth of the product (a small data center); tier 2: public accounts, ideally free ones (medium or large data center); tier 3: large internal accounts and European customers; tier 4: everyone else | "a 24-hour day should be enough time for most scenarios", including a peak-usage period | current practice | 2022-07-25 (page date) | [Microsoft Learn, "Safe deployment practices"](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices), tier table and "Allow bake time" | Page calls them "tiers"; often retold as rings 0-4 |
| LinkedIn T-REX | "rolled out to 5% of a target population first, then gets expanded to 25%, 50%, and 100%" | None given | 2020 | 2020-09-24 | [LinkedIn, "Our evolution towards T-REX"](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/our-evolution-towards-t-rex-the-prehistory-of-experimentation-i) | Introduced with "For example" |
| LinkedIn XLNT | Treatment "ramped to 100% in the whitelist segment, while still running at 1% in the external segments" | None given | 2015 | 2015-08 | [Xu et al. KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf), section 2 | Example |
| Microsoft ExP | New experiments "should start on a small percentage of traffic (e.g. 0.5% of users assigned to treatment)" | None given | 2017 | 2017-05 | [Fabijan et al. ICSE 2017](https://exp-platform.com/Documents/2017-05%20ICSE2017_EvolutionOfExP.pdf), "Experiment iteration support" | Example |
| Bing | Typical analysed experiment: "20% of eligible users (10% control, 10% treatment) over 2 weeks" | 2 weeks | 2013 | 2013-08 | [Kohavi et al. KDD 2013](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf), section 1 | An analysis example, not a ramp rule |
| Uber | Staged rollout: "first to a small portion of users and then gradually ramping up to stages with larger proportions" until "100 percent" of a target | None given | 2017 | 2017-05-04 | [Uber, "Building an Intelligent Experimentation Platform"](https://www.uber.com/us/en/blog/experimentation-platform/) | No percentages stated |
| Knight Capital RLP code | New code placed "on a limited number of servers in SMARS on successive days" beginning July 27, 2012; 7 of 8 servers received it | 27 July to 1 August 2012 | 2012 | 2013-10-16 | [SEC Release No. 34-70694](https://www.sec.gov/litigation/admin/2013/34-70694.pdf), para. 15-16 | A staged deployment without verification; useful as a counter-example |
| Google experiments | Process described as canary experiment, then experiment, then gradual ramp in a "launch layer" | None given | 2010 | 2010-07 | [Tang et al., "Overlapping Experiment Infrastructure", KDD 2010](https://research.google.com/pubs/archive/36500.pdf), sections 4-5 | No percentages or durations |

### Inferences

- Three schedules have enough numbers for a faithful "exposure versus time" step illustration: Facebook web 2017 (employees, 2%, 100% in a few hours), Facebook Android 2016 (20%, 50%, 100% over three days) and the Amazon typical pipeline (1 hour, 12 hours, 2-4 hours per wave, 4-5 business days in total). The audience's own three days of environment promotion can be drawn beside them.
- The Amazon and Azure schedules show that ramping kept waiting time (12-hour and 24-hour bakes); what changed is that the wait happens in production on a small share of traffic.

### Gaps

- Facebook Chat 2008: the post dated 2008-05-13 describes a "dark launch" before the user interface was turned on but gives no rollout dates or percentages. Dated rollout steps were not found in a primary source.
- Chrome stable-channel staged rollout percentages: not found in a primary source opened this session. The live Chromium release-cycle document only says an early stable build is "shipped to a small percentage of stable channel users".
- LinkedIn "SQR" ramp stages and Uber's percentage stages: no primary source with exact stages was opened.
- Microsoft ExP ramp percentages beyond the 0.5% example: not found.

## 3. DORA four-key-metric category tables

### Takeaway

Category tables exist in the 2016, 2017, 2018, 2019, 2021 and 2022 reports; the 2014 and 2015 reports give only ratios between high and low performers. All cells are survey answer categories reported as cluster medians, clusters are re-derived every year, and cluster names and counts change, so the cells are not measurements and are not a time series of the same group.

### Cited Findings

Common caveats for every row: self-reported survey answers for "the primary application or service you work on"; clusters come from each year's cluster analysis; "Medians reported because distributions are not normal" (2018 and 2019 table notes).

#### Ratios only (2014, 2015) and the ratios derived later

| Report | Finding | Locator |
| --- | --- | --- |
| [2014](https://dora.dev/research/2014/2014-state-of-devops-report.pdf) | High performers deploy "30 times more frequently" with "50 percent fewer failures"; "more than 9,200 survey responses" | PDF p. 4, 10, 13 |
| [2015](https://dora.dev/research/2015/2015-state-of-devops-report.pdf) | "30 times more frequently and 200 times faster" lead time; "60 percent fewer failures and recover 168 times faster"; 4,976 respondents | PDF p. 9, 6 |
| [2016](https://dora.dev/research/2016/2016-state-of-devops-report.pdf) | 200 times more frequent deployments; 2,555 times faster lead times; 24 times faster recovery; 3 times lower change failure rate | PDF p. 5, 14 |
| [2017](https://dora.dev/research/2017/2017-state-of-devops-report.pdf) | 46 times more frequent; 440 times faster lead time; 96 times faster recovery; 5 times lower change failure rate | PDF p. 21, Table 1 |

How the ratios were computed (important for honesty): the 2016 report normalizes "on demand" to 1,460 deploys per year ("four deploys per day x 365 days") and the low cluster to 7 per year, and uses 60 minutes versus 3.5 months for lead time (PDF p. 16). The 2017 report uses 1,460 versus 32 deploys per year and 60 versus 26,940 minutes (PDF p. 24). The ratios are therefore arithmetic on category midpoints.

#### Category tables

| Year | Cluster | Deployment frequency | Lead time for changes | Time to restore | Change failure rate | Locator |
| --- | --- | --- | --- | --- | --- | --- |
| 2016 | High | On demand (multiple deploys per day) | Less than one hour | Less than one hour | 0-15% | [2016 report](https://dora.dev/research/2016/2016-state-of-devops-report.pdf), PDF p. 15 |
| 2016 | Medium | Between once per week and once per month | Between one week and one month | Less than one day | 31-45% | Same |
| 2016 | Low | Between once per month and once every 6 months | Between one month and 6 months | Less than one day (lower on average, same median) | 16-30% | Same |
| 2017 | High | On demand (multiple deploys per day) | Less than one hour | Less than one hour | 0-15% | [2017 report](https://dora.dev/research/2017/2017-state-of-devops-report.pdf), PDF p. 23, Table 2 |
| 2017 | Medium | Between once per week and once per month | Between one week and one month | Less than one day | 0-15% | Same |
| 2017 | Low | Between once per week and once per month (lower on average, same median) | Between one week and one month (same note) | Between one day and one week | 31-45% | Same |
| 2018 | Elite | On-demand (multiple deploys per day) | Less than one hour | Less than one hour | 0-15% | [2018 report](https://dora.dev/research/2018/dora-report/2018-dora-accelerate-state-of-devops-report.pdf), PDF p. 14 |
| 2018 | High | Between once per hour and once per day | Between one day and one week | Less than one day | 0-15% | Same |
| 2018 | Medium | Between once per week and once per month | Between one week and one month | Less than one day | 0-15% | Same |
| 2018 | Low | Between once per week and once per month | Between one month and six months | Between one week and one month | 46-60% | Same |
| 2019 | Elite | On-demand (multiple deploys per day) | Less than one day | Less than one hour | 0-15% | [2019 report](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf), PDF p. 18 |
| 2019 | High | Between once per day and once per week | Between one day and one week | Less than one day | 0-15% | Same |
| 2019 | Medium | Between once per week and once per month | Between one week and one month | Less than one day | 0-15% | Same |
| 2019 | Low | Between once per month and once every six months | Between one month and six months | Between one week and one month | 46-60% | Same |
| 2021 | Elite | On-demand (multiple deploys per day) | Less than one hour | Less than one hour | 0%-15% | [2021 report](https://dora.dev/research/2021/dora-report/2021-dora-accelerate-state-of-devops-report.pdf), PDF p. 9 |
| 2021 | High | Between once per week and once per month | Between one day and one week | Less than one day | 16%-30% | Same |
| 2021 | Medium | Between once per month and once every 6 months | Between one month and six months | Between one day and one week | 16%-30% | Same |
| 2021 | Low | Fewer than once per six months | More than six months | More than six months | 16%-30% | Same |
| 2022 | High | On-demand (multiple deploys per day) | Between one day and one week | Less than one day | 0%-15% | [2022 report](https://dora.dev/research/2022/dora-report/2022-dora-accelerate-state-of-devops-report.pdf), PDF p. 11 |
| 2022 | Medium | Between once per week and once per month | Between one week and one month | Between one day and one week | 16%-30% | Same |
| 2022 | Low | Between once per month and once every 6 months | Between one month and six months | Between one week and one month | 46%-60% | Same |

Note on extraction: the 2018 and 2021 tables were read from column-ordered PDF text; the cell assignment above was checked against the row order in the text, but the author should eyeball PDF p. 14 (2018) and p. 9 (2021) before publishing a chart. In 2018 the elite group "is a subset of the high performance group" (table footnote a).

#### Share of respondents in each cluster

| Year | Elite | High | Medium | Low | Locator |
| --- | --- | --- | --- | --- | --- |
| 2018 | 7% (subset of high) | 48% | 37% | 15% | 2018 report, PDF p. 13; repeated in 2019 p. 20, 2021 p. 11, 2022 p. 12 |
| 2019 | 20% | 23% | 44% | 12% | 2019 report, PDF p. 20 ("< 100% due to rounding") |
| 2021 | 26% | 40% | 28% | 7% | 2021 report, PDF p. 11 |
| 2022 | N/A (no elite cluster) | 11% | 69% | 19% | 2022 report, PDF p. 12 |

Sample sizes: "almost 1,000" respondents in 2019 (PDF p. 7 area, footnote 2: 3% margin of error); "Nearly 1,900 professionals" in 2018; "over 1350" in 2022. No cluster shares were found in the 2014-2017 reports.

#### Change approval (2019)

- "Heavyweight change approval processes, such as change approval boards, negatively impact speed and stability." — [2019 report](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf), PDF p. 6, key finding 6.
- "We found that formal change management processes that require the approval of an external body such as a change advisory board (CAB) or a senior manager for significant changes have a negative impact on software delivery performance. Survey respondents were 2.6 times more likely to be low performers if their organization had this kind of formal approval process in place." — same report, PDF p. 50.
- On whether formal approval lowers change fail rates: "we found no evidence to support this hypothesis, consistent with earlier research." — same report, PDF p. 50.
- Enterprise finding: organizations "with more than 5,000 employees" are "lower performers", attributed in part to "heavyweight process and controls"; and "no evidence that industry has an impact with the exception of retail", naming "financial services and government" as able to achieve high performance — same report, PDF p. 19.

### Inferences

- The honest chart is a category grid (year by cluster by metric), not a line. The deployment-frequency row for the lowest cluster moves from "once per month to once every 6 months" (2016) to "once per week to once per month" (2017, 2018) and back (2019), which shows the clusters are not a stable population.
- A twice-weekly release train sits between "once per day and once per week" (2019 high) and "once per week and once per month" (2019 medium) for deployment frequency; three days of environment promotion puts lead time in "between one day and one week" (2019 high). This placement is my inference and depends on how the reader's team would answer the survey question.

### Gaps

- 2014 and 2015 category medians: not printed in those reports.
- 2020: no report was published for 2020 (the series goes 2019, 2021); I did not open a source stating this, so treat it as unverified.
- The 2.6 times figure is an odds-style survey association, not a controlled effect.

## 4. Experiment outcome base rates

### Takeaway

The "about one third" figure is Microsoft's own, first reported in 2009 and restated in 2013 and 2014. The Google, Netflix and Bing figures commonly quoted with it are second-hand quotations inside Kohavi's papers, and Booking's figure was not found in the Booking paper opened.

### Cited Findings

| Organization | Exact wording | Refers to | Published | Source and locator | Status |
| --- | --- | --- | --- | --- | --- |
| Microsoft | "Evaluating well-designed and executed experiments that were designed to improve a key metric, only about one-third were successful at improving the key metric!" | experiments up to 2009 | 2009 | [Kohavi, Crook, Longbotham, "Online Experimentation at Microsoft"](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf), section 5 "Most Ideas Fail to Show Value" | Primary |
| Microsoft | "Only one third of the ideas tested at Microsoft improved the metric(s) they were designed to improve [5]." | restatement | 2013-08 | [Kohavi et al., KDD 2013](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf), section 3, Tenet 3 | Primary authors restating the 2009 result |
| Microsoft | "a prior probability of success of 1/3, which is what we reported is the average across multiple experiments at Microsoft" | restatement | 2014-08 | [Kohavi et al., "Seven Rules of Thumb for Web Site Experimenters", KDD 2014](https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf), Rule 2 discussion | Primary authors restating |
| Bing | "If our success rate on ideas at Bing is about 10-20%, in line with other search engines" | c. 2014 | 2014-08 | Same KDD 2014 paper, Rule 3 | Primary, but phrased conditionally ("If") |
| Bing | "thousands of experiments are being run annually, most fail, and those that succeed improve key metrics by 0.1% to 1.0%, once diluted to overall impact" | c. 2014 | 2014-08 | Same KDD 2014 paper, Rule 2 | Primary |
| Google | "Jim Manzi [17] wrote that at Google, only 'about 10 percent of these [controlled experiments, were] leading to business changes.'" | c. 2009-2012 | 2013-08 | KDD 2013 paper, section 3, Tenet 3 | Second-hand: Kohavi quoting Manzi; Manzi's book not opened |
| Netflix | "Mike Moran [28 p. 240] wrote that Netflix considers 90% of what they try to be wrong." | c. 2007 | 2009, 2013 | 2009 paper section 5 and KDD 2013 paper, Tenet 3 | Second-hand: Kohavi citing Moran, "Do It Wrong Quickly" (2007), p. 240 |
| Web analytics practice | Avinash Kaushik: "80% of the time you/we are wrong about what a customer wants." | 2006 | 2009, 2013 | Same two papers | Second-hand quotation |
| QualPro (offline experiments) | "tested 150,000 business improvement ideas over 22 years and reported that 75 percent of important business decisions and business improvement ideas either have no impact on performance or actually hurt performance" | to c. 2005 | 2009 | 2009 paper, section 5 | Second-hand; the authors add that they think the sample "is biased" |
| Quicken Loans | Regis Hadiaris: "I can only 'guess' the outcome of a test about 33% of the time!" | 2008 | 2009, 2013 | Same two papers | Second-hand quotation |

### Inferences

- The only base rate with a primary, repeated statement is Microsoft's one third; Bing's 10-20% is primary but hedged. A chart should show these two as measured or reported by the organization and the rest as quotations, visually distinct.
- These rates concern whether a change improved its target metric, which is a different question from whether pre-release testing finds defects. They support the claim that pre-release judgement does not predict user response; they do not show that pre-release testing fails to find bugs.

### Gaps

- Kohavi and Thomke, "The Surprising Power of Online Experiments" (HBR, Sept-Oct 2017): the page loaded only its header and summary; body figures (for example Microsoft's experiments per year) were not readable. Unverified.
- Booking.com "9 out of 10 experiments fail": commonly attributed to Thomke's 2020 HBR article; not in the Booking arXiv paper opened. Unverified.
- Netflix and Google base rates from those companies' own publications: none opened.

## 5. Incident-cause shares

### Takeaway

Reported shares of incidents caused by change range from 16-17% (Facebook 2015 configuration; FCA 2019 all material incidents) to "roughly 70%" (Google SRE), because the denominators differ: all reported incidents, high-severity incidents only, outages only, or outages with a known cause. The FCA review is the most relevant for a finance audience and contains explicit findings on release frequency and change advisory boards.

### Cited Findings

| Value | Exact wording | Denominator | Refers to | Published | Source and locator |
| --- | --- | --- | --- | --- | --- |
| About 70% | "SRE has found that roughly 70% of outages are due to changes in a live system." | Google outages; no data or period given | not stated | 2016 (book) | [Site Reliability Engineering, ch. 1 "Introduction"](https://sre.google/sre-book/introduction/), "Change Management" |
| 16% | "we manually analyzed the high-impact incidents during a three-month period. We found that 16% of the incidents were related to configuration management, while the rest were dominated by software bugs." | Facebook high-impact incidents, 3 months | c. 2014-2015 | 2015-10 | [Tang et al. SOSP 2015](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), section 6.4 |
| 42% / 36% / 22% | Of those configuration incidents: "Type I: common config errors 42%", "Type II: subtle config errors 36%", "Type III: valid config changes exposing code bugs 22%" | Configuration-related incidents only | same | 2015-10 | Same paper, section 6.4 table |
| 16% | "UPGRADE is one of the largest root causes (16%)"; counts: Upgrade 54, Network 52, Bugs 51, Config 34, Load 31; Unknown 355 of 597 outages | Root-cause tags among outages with a known cause, 32 public cloud services | 2009-2015 | 2016-10 | [Gunawi et al., "Why Does the Cloud Stop Computing?", SoCC 2016](https://ucare.cs.uchicago.edu/pdf/socc16-cos.pdf) (read via Wayback copy), Table 3 and section 5.1 |
| 15%, 10% | Bugs 15%, Config 10% (same table) | same | 2009-2015 | 2016-10 | Same, Table 3 |
| 8% | Fix procedure "rollback software (8%)" among the 24% of outages that reveal a fix | Outages with a reported fix | 2009-2015 | 2016-10 | Same, section 2 |
| 17% | "Nearly 1,000 material incidents were reported to the FCA in 2019, 17% of which were attributed to change activity." | Material incidents reported to the FCA | 2019 | 2021-02-05 | [FCA, "Implementing Technology Change"](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change), summary |
| 1.6% | "1.6% of technology changes resulting in an incident"; "over 13,767 incidents in 2019, of which 14% had customer-facing impact" | Over 1 million production changes at sampled firms | 2019 | 2021 | Same, "The impact of change incidents" |
| 7.4% and 24% | "of all customer-facing incidents in 2019, 7.4% had a root cause relating to change activity. However, of all incidents classified as high severity by firms in 2019, 24% had a root cause relating to change activity" | Sampled firms' incidents | 2019 | 2021 | Same, "Customer-facing and high severity incidents resulting from change" |
| 3.8% vs 1.6% | "nearly 68,000 major changes over 2019, which resulted in 2,600 incidents. This is an average failure rate of 3.8%, compared to 1.6% from all change types." | Major changes | 2019 | 2021 | Same, "Incidents resulting from major changes" |
| Over 90% | "CABs approved over 90% of the major changes they reviewed, and in some firms the CAB had not rejected a single change during 2019." | CAB decisions on major changes | 2019 | 2021 | Same, "Practices identified as contributing to change failure", item 5 |
| 1.5% | "on average, 1.5% of emergency changes resulted in a new incident"; "over 33,000 emergency changes", "between 3-5% of total change volume" | Emergency changes | 2019 | 2021 | Same, "Incidents resulting from emergency changes" |
| Over 20% | "in 2019 over 20% of incidents at third-parties were caused by change" | Third-party incidents | 2019 | 2021 | Same, "Practices identified as contributing to change failure", item 1 |
| Qualitative | "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles. Firms that made effective use of agile delivery methodologies were also less likely to experience a change incident." | Sampled firms | 2019 | 2021 | Same, "Practices identified as contributing to change success", item 4 |
| 80 | "On average, each sample firm experienced 80 customer-facing incidents resulting from failed change during 2019." | Per sampled firm | 2019 | 2021 | Same |
| Amazon | "~0.001% of software deployments cause an outage" | Amazon deployments | 2011 | 2011-06-16 | [Jenkins Velocity 2011 slides](https://web.archive.org/web/20180831171809/http://assets.en.oreilly.com/1/event/60/Velocity%20Culture%20Presentation.pdf) |

### Inferences

- Gunawi's 16% is 54 of the 340 root-cause tags (my arithmetic from the Table 3 counts, which sum to 340 across 242 outages with a known cause); it is a share of tags, and 59% of outages had no reported cause.
- The FCA numbers give a finance-specific pair suitable for one chart: change causes 17% of all material incidents but 24% of high-severity ones, while only 1.6% of changes cause an incident and major changes fail at 3.8%.
- The Google 70% and the FCA 17% are not in conflict; they measure different things (outages at one operator versus all regulatory incident reports including third-party, cyber and hardware causes).

### Gaps

- The FCA review is a web page ("Published: 05/02/2021"); the PDF URL sometimes cited for it returned "Page not found", so locators are section headings, not page numbers.
- The SRE book gives no dataset behind "roughly 70%".
- No primary figure was opened for the share of incidents caused by change at any individual bank.

## 6. Flag-population figures

### Takeaway

Primary counts exist for Uber (2019), Chrome (2010-2015) and, in order-of-magnitude terms only, Facebook (2014-2015). No count was found for LinkedIn or Dropbox flags.

### Cited Findings

| Organization | Value | Unit | Refers to | Published | Source and locator | Caveats |
| --- | --- | --- | --- | --- | --- | --- |
| Uber | 1,381 flags cleaned up, "17% of total flags"; 6,601 flags remaining; total about 7,982 (my sum) | flags in mobile app codebases | Dec 2017-May 2019 | 2020-05 | [Ramanathan et al., "Piranha: Reducing Feature Flag Debt at Uber", ICSE-SEIP 2020](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf), abstract and Figure 4 | Android and iOS apps only (Java, Swift, Objective-C) |
| Uber | 71 KLoC deleted; about 200 developers; 65% of diffs landed unchanged; 88% of diffs acted on; 75% processed within a week | cleanup outcomes | same | 2020-05 | Same, abstract and section 5 | |
| Google Chrome | 263 toggles at release 5; 1,040 at release 42; 2,409 distinct toggles across 39 releases, 70% removed at some point | toggles in source | 2010-2015 | 2016-05 | [Rahman et al., "Feature Toggles: Practitioner Practices and a Case Study", MSR 2016](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf), section 4 (RQ1), Figure 2 | Compile- and run-time switches in Chromium source, not server-side flags |
| Google Chrome | Median 73 toggles added and 43 removed per release; half of toggles survive 12 or more releases | toggle churn | same | 2016-05 | Same, sections 4.1-4.3 | |
| Google Chrome | Of release toggles checked, 51 (20%) removed and 44 (17%) "still lingered in the source code as technical debt" | release toggles | same | 2016-05 | Same, section 5 | |
| Another firm quoted in Rahman | "80 active toggles in production" by end of 2009; 48 after cleanup in 2010 | toggles | 2009-2010 | 2016-05 | Same, section 6, quoting its reference [19] | Second-hand within the paper |
| Facebook | "tens of thousands of Gatekeeper projects were created or updated" | Gatekeeper projects per year | 2014 | 2015-10 | [Tang et al. SOSP 2015](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), section 6.3 | Created or updated in a year, not a standing count |
| Facebook | "hundreds of thousands of configs"; "thousands of" config changes a day; "hundreds of restraints"; "billions of checks per second" | configs, changes, restraints, checks | 2015 | 2015-10 | Same, abstract, sections 1, 4 and 6.3 | Orders of magnitude only |
| Facebook | 16% of high-impact incidents related to configuration management | percent | 3 months | 2015-10 | Same, section 6.4 | See data set 5 |
| LinkedIn | 2,800 experiments run on XLNT in its first year | experiments | 2013-2014 | 2014-08-22 | [LinkedIn XLNT post](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) | Experiments, not flags |
| Dropbox | Feature gates "rolled out to production within 10 minutes of being changed" | propagation time | date not captured | date not captured | [Dropbox, "Introducing Stormcrow"](https://dropbox.tech/infrastructure/introducing-stormcrow) | No flag count in the post |

### Inferences

- Chrome's 263 to 1,040 toggles is the only primary flag-count series with two dated endpoints and a per-release figure (Figure 2 of the paper has the full curve but values would have to be read off the plot, which I did not do).
- The Uber and Chrome papers both quantify debt: 17% of Uber's flags were removable in 18 months; 17% of Chrome release toggles checked had outlived their purpose.

### Gaps

- LinkedIn and Dropbox flag counts: none found in primary sources.
- Facebook standing count of Gatekeeper projects: not stated.
- Release dates for Chrome releases 5 and 42 (2010 and 2015) are from general knowledge, not from the paper text.

## 7. Knight Capital and TSB

### Takeaway

All headline Knight figures are in paragraphs 10 and 13-18 of the SEC order; all headline TSB figures are in the FCA final notice and joint press release of 20 December 2022. The Slaughter and May report could not be opened.

### Cited Findings

#### Knight Capital — [SEC Release No. 34-70694, 16 October 2013](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) (read via [Wayback copy](https://web.archive.org/web/20240622204845/https://sec.gov/litigation/admin/2013/34-70694.pdf))

| Value | Unit | Wording | Paragraph |
| --- | --- | --- | --- |
| More than $460 million | loss | "Knight lost more than $460 million"; "Ultimately, Knight realized a $460 million loss on these positions." | 10, 17 |
| About 45 minutes | duration | "in approximately forty-five minutes on August 1"; "in approximately 45 minutes" | 10, 17 |
| 212 | parent orders | "For the 212 incoming parent orders that were processed by the defective Power Peg code" | 17 |
| Millions | child orders | "SMARS sent millions of child orders" | 17 |
| 4 million | executions | "resulting in 4 million executions" | 17 |
| 154 | stocks | "in 154 stocks" | 17 |
| More than 397 million | shares | "for more than 397 million shares" | 17 |
| About $3.5 billion | net long position | "approximately $3.5 billion net long position in 80 stocks" | 17 |
| About $3.15 billion | net short position | "approximately $3.15 billion net short position in 74 stocks" | 17 |
| 75 and 37 | stocks | In 75 stocks Knight's executions were more than 20% of volume with price moves over 5%; in 37 the price moved more than 10% and Knight was over 50% of volume | 18 |
| 8 servers, 1 missed | servers | "did not copy the new code to one of the eight SMARS computer servers"; "The seven servers that received the new code processed these orders correctly." | 15, 16 |
| 27 July 2012 | deployment start | "Beginning on July 27, 2012, Knight deployed the new RLP code in SMARS in stages" | 15 |
| 2003, 2005 | dates | Power Peg use ceased in 2003; cumulative-quantity function moved in 2005 without retest | 14 |
| Repurposed flag | mechanism | "The new RLP code also repurposed a flag that was formerly used to activate the Power Peg code." | 13 |
| 97 | emails | "Knight's system sent 97 of these e-mail messages" ("Power Peg disabled"), beginning about 8:01 a.m. ET | 19 |
| Nearly $7.5 million | earlier loss | October 2011 test-data incident | 33 |
| $12 million | civil penalty | "civil money penalty in the amount of $12,000,000" | Order section IV |

#### TSB (migration of 20-22 April 2018)

| Value | Unit | Wording | Source and locator |
| --- | --- | --- | --- |
| £48,650,000 | combined fine | "fined TSB Bank plc ('TSB') a total of £48,650,000" | [FCA press release, 20 December 2022](https://www.fca.org.uk/news/press-releases/tsb-fined-48m-operational-resilience-failings) |
| £29,750,000 and £18,900,000 | FCA and PRA fines | "TSB was fined £29,750,000 by the FCA and £18,900,000 by the PRA." | Same press release; FCA amount also in [FCA Final Notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf), para. 1.1 |
| £69,500,000 | fine before 30% discount | "a combined financial penalty of £69,500,000" | Same press release |
| 5.2 million | customers | "All of TSB's branches and a significant proportion of its 5.2 million customers were affected by the initial issues."; "approximately 5.2 million customers" | Press release; Final Notice para. 4.2 |
| 225,492 | complaints | "TSB received 225,492 complaints (from c.4.3% of its customer base as at MME) from 22 April 2018 to 7 April 2019" | Final Notice para. 4.26 |
| £32,705,762 | redress | "a total of £32,705,762 redress paid out during that period" | Final Notice para. 4.26 (press release rounds to £32.7m) |
| 20-30% | customers unable to pay online | "During the first week 20 – 30% of retail and business customers could not make any payments online" | Final Notice, section 4 (digital channel issues) |
| 10 December 2018 | return to normal | "TSB did not return to a BAU position until 10 December 2018." | Final Notice para. 2.7 and 4.23 |
| 22 April 2018, about 1pm | go-live | "MME was authorised to go ahead at around 1pm on 22 April 2018." | Final Notice para. 4.5 |

### Inferences

- Knight is a staged deployment (successive days, 27 July to 1 August) with a reused flag and no verification step, so it illustrates that staging without observation and without flag hygiene is not a ramp. TSB is the opposite pattern, a single "Main Migration Event" for 5.2 million customers.
- A paired illustration is supported: Knight (8 servers, 1 stale, 45 minutes, $460 million) and TSB (one weekend cut-over, 225,492 complaints, 232 days to business as usual, counting 22 April to 10 December 2018; the day count is my arithmetic).

### Gaps

- Slaughter and May's independent review of the TSB migration: the tsb.co.uk URL tried returned an error page. Figures often quoted from it (for example numbers of customers locked out) are unverified here.
- The PRA's own final notice was not opened; the PRA figure comes from the joint FCA press release.
- The number of Knight customers or the exact count of child orders is not given in the order ("millions").

## 8. Dated timeline of publications and events

### Takeaway

Forty-two items have dates (some only to the year or month) read from the source this session; a further handful of well-known items are listed separately as not verified and need a check before they go on a figure.

### Cited Findings

| Date | Event | Evidence for the date |
| --- | --- | --- |
| 2000-09-10 | Fowler and Foemmel, "Continuous Integration" (original version) | [Page dateline](https://martinfowler.com/articles/originalContinuousIntegration.html) |
| 2008-05-13 | Facebook Chat post describes a "dark launch" | [Post URL date](https://engineering.fb.com/2008/05/13/web/facebook-chat/) |
| 2008-08-26 | Google: "50 to 200 experiments" at any time | [Post dateline](https://googleblog.blogspot.com/2008/08/search-experiments-large-and-small.html) |
| 2009-02-10 | Fitz, continuous deployment at IMVU, "fifty times a day" | [Post URL date](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/) |
| 2009 | Kohavi, Crook, Longbotham, "Online Experimentation at Microsoft" (one-third result) | [Paper](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf); month not captured |
| 2009-06 | Allspaw and Hammond, "10 deploys per day", Velocity 2009 | [Slides title and URL path](https://paulhammond.org/2009/06/velocity/10deploys.pdf); day not on slides |
| 2009-12-02 | Flickr, "Flipping Out" (feature flags and flippers) | [Post URL date](https://code.flickr.net/2009/12/02/flipping-out/) |
| 2010-05-20 | Etsy, "Quantum of Deployment" (Deployinator) | Post byline, read via Wayback copy of [codeascraft.com](https://www.etsy.com/codeascraft/quantum-of-deployment) |
| 2010-07-22 | Chrome announces a six-week release cycle | [Post dateline](https://blog.chromium.org/2010/07/release-early-release-often.html) |
| 2010-07-25 to 28 | Tang et al., Google overlapping experiment infrastructure, KDD 2010 | [Paper copyright block](https://research.google.com/pubs/archive/36500.pdf) |
| 2010-10-29 | Fowler, "FeatureToggle" bliki entry | [Page dateline](https://martinfowler.com/bliki/FeatureFlag.html) |
| 2011-06-16 | Jenkins, Amazon "Velocity Culture" (11.6 seconds) | [Slide 1 date](https://web.archive.org/web/20180831171809/http://assets.en.oreilly.com/1/event/60/Velocity%20Culture%20Presentation.pdf) |
| Late 2011 | LinkedIn "Inversion" pause | [LinkedIn history post](https://www.linkedin.com/blog/engineering/architecture/brief-history-scaling-linkedin) |
| 2012-04-05 | Facebook: push karma interview | [Post dateline](https://engineering.fb.com/2012/04/05/production-engineering/release-engineering-and-push-karma-chuck-rossi/) |
| 2012-07-27 to 08-01 | Knight Capital staged RLP deployment and failure | [SEC order para. 15-17](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) |
| 2012-08-03 | Facebook moves to twice-daily pushes | [Post dateline](https://engineering.fb.com/2012/08/03/uncategorized/ship-early-and-ship-twice-as-often/) |
| 2013-04-10 | Wired on LinkedIn's move from monthly releases | [Page metadata](https://www.wired.com/2013/04/linkedin-software-revolution/) |
| 2013 | Feitelson, Frachtenberg, Beck, "Development and Deployment at Facebook" | [Author copy](https://www.frachtenberg.org/eitan/pubs/papers/feitelson13:devops.pdf); file name "feitelson13"; issue date not on copy |
| 2013-08-11 to 14 | Kohavi et al., "Online Controlled Experiments at Large Scale", KDD 2013 | [Paper copyright block](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf) |
| 2013-10-16 | SEC order against Knight Capital | [Order header](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) |
| 2014 | State of DevOps Report 2014 (survey fielded December 2013) | [Report p. 5](https://dora.dev/research/2014/2014-state-of-devops-report.pdf); release month not captured |
| 2014-08-22 | LinkedIn XLNT post (200 experiments a day) | [Post dateline](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) |
| 2014-08-24 to 27 | Kohavi et al., "Seven Rules of Thumb", KDD 2014 | [Paper copyright block](https://exp-platform.com/Documents/2014%20experimentersRulesOfThumb.pdf) |
| 2014-11-12 | Vogels, "The Story of Apollo" (50M deployments) | [Post dateline](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html) |
| 2015-08-11 to 14 | Xu et al., LinkedIn XLNT paper, KDD 2015 | [Paper copyright block](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf) |
| 2015-10-04 to 07 | Tang et al., "Holistic Configuration Management at Facebook", SOSP 2015 | [Paper copyright block](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf) |
| 2016-02-08 | Hodgson, "Feature Toggles" complete article | [Revision history on page](https://martinfowler.com/articles/feature-toggles.html) |
| 2016 | State of DevOps 2016: first category table (high, medium, low) | [Report p. 15](https://dora.dev/research/2016/2016-state-of-devops-report.pdf) |
| April 2016 to April 2017 | Facebook moves facebook.com to push-from-master | [Rossi 2017 post](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) |
| 2016-11-13 to 18 | Rossi et al., mobile continuous deployment, FSE 2016 | [Paper copyright block](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf) |
| 2017-05-04 | Uber experimentation platform post (staged rollout) | [Post dateline](https://www.uber.com/us/en/blog/experimentation-platform/) |
| 2017-08-31 | Rossi, "Rapid release at massive scale" | [Post dateline](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) |
| 2018-04-22 | TSB Main Migration Event | [FCA Final Notice para. 4.4](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) |
| 2018 | Accelerate State of DevOps 2018 introduces the "elite" cluster | [Report p. 13-14](https://dora.dev/research/2018/dora-report/2018-dora-accelerate-state-of-devops-report.pdf) |
| 2019 | Accelerate State of DevOps 2019: heavyweight change approval finding | [Report p. 50](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf) |
| 2019-09-17 | Firefox announces a four-week cycle | [Page metadata](https://hacks.mozilla.org/2019/09/moving-firefox-to-a-faster-4-week-release-cycle/) |
| 2020-05-23 to 29 | Piranha paper, ICSE-SEIP 2020 | [Paper header](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf) |
| 2020-06-18 | Liguori, "Automating safe, hands-off deployments" | ["Published Jun 18, 2020" on page](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/) |
| 2021-02-05 | FCA multi-firm review "Implementing Technology Change" (2019 data) | ["Published: 05/02/2021" on page](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) |
| 2021-03-04 | Chrome announces a four-week cycle | [Post dateline](https://blog.chromium.org/2021/03/speeding-up-release-cycle.html) |
| 2022-05-15 | Monzo, "over 100 times a day" | [Page dateline](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day) (URL says 16 May, page says 15 May) |
| 2022-12-20 | FCA and PRA fine TSB £48.65m | [Final Notice date](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) |

### Inferences

- The dated items cluster in three bands that a timeline figure can show: 2008-2010 (dark launch, continuous deployment, flags named), 2012-2016 (scale reports and the first empirical papers) and 2017-2022 (quasi-continuous delivery, documented ramp pipelines, regulator findings).

### Gaps

Not verified in this session (dates from general knowledge; check before use):

- 1997: Cusumano and Selby, "How Microsoft Builds Software", Communications of the ACM (June 1997), on daily builds and "synch-and-stabilize".
- 1999: Kent Beck, "Extreme Programming Explained".
- 2010: Humble and Farley, "Continuous Delivery" (book).
- 2014: LaunchDarkly founded.
- 2016: "Site Reliability Engineering" (book); Rahman et al. at MSR 2016 (May 2016); Gunawi et al. at SoCC 2016 (October 2016).
- 2018: Forsgren, Humble, Kim, "Accelerate" (book).

## 9. Charts and illustrations the data can honestly support

### Takeaway

Seven figures are supported by verified data; each needs its definitional caveat in the caption.

### Cited Findings

- Chart A, Facebook web cadence steps (2008-2017): weekly plus daily, twice daily (Aug 2012), three daily, every few hours (Apr 2017), annotated with engineers (about 100 in 2008, 1,000 in 2012, "thousands" in 2017) and change volume. Sources: data set 1, [2012 post](https://engineering.fb.com/2012/08/03/uncategorized/ship-early-and-ship-twice-as-often/), [2017 post](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/). Caveat: the three-a-day step is undated.
- Chart B, client release cycle in weeks: Chrome 6 to 4, Firefox 7 to 4, Dropbox desktop 8 to 2, Facebook Android 4 (or 8) to 1, iOS 4 to 2. Sources: data set 1, for example [FSE 2016](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf) and [Chromium blog 2021](https://blog.chromium.org/2021/03/speeding-up-release-cycle.html). Caveat: same unit, different products.
- Chart C, documented ramp schedules as exposure-versus-time steps: Facebook web 2017, Facebook Android 2016, Amazon typical pipeline, Azure DevOps tiers, with the reader's three-day environment promotion drawn for contrast. Sources: data set 2, for example [Liguori 2020](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/). Caveat: all are "typical" or example values.
- Chart D, DORA category grid 2016-2022 plus cluster shares 2018-2022. Source: data set 3, for example [2019 report p. 18 and 20](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf). Caveat: survey categories, clusters redefined yearly; do not draw as lines.
- Chart E, share of ideas that improve their target metric: Microsoft one third (primary), Bing 10-20% (primary, hedged), and quoted figures for Google 10% and Netflix 10% shown as second-hand. Source: data set 4, [Kohavi et al. 2009](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf) and [KDD 2013](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf).
- Chart F, FCA 2019 change statistics: 17% of material incidents and 24% of high-severity incidents caused by change; 1.6% of all changes and 3.8% of major changes cause an incident; CABs approve over 90%. Source: data set 5, [FCA review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change). Optionally a second panel with Google 70%, Facebook 16% and Gunawi 16%, each labelled with its denominator.
- Chart G, concurrent experiments: LinkedIn 50, 200, 400 (2013-2015) as a true series; Google 50-200 (2008), Bing over 200 (2013), Booking over 1,000 (2017) as labelled single points. Source: data set 1 experiment table, for example [KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf).
- Illustration H, Knight Capital in numbers (8 servers, 1 stale, 212 parent orders, 4 million executions, 154 stocks, 45 minutes, $460 million) beside TSB (5.2 million customers, 225,492 complaints, £48.65m fine). Source: data set 7, [SEC order](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) and [FCA Final Notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf).
- Illustration I, the timeline from data set 8.

### Inferences

- Flag-population data (Chrome 263 to 1,040 toggles; Uber about 8,000 flags with 17% removed) supports a small "flag debt" inset better than a full chart, because only Chrome has two dated points.
- A cross-company "deployments per day" chart (Flickr 10, IMVU 50, Monzo 100, Amazon one every 11.6 seconds) is tempting but mixes monolith pushes with fleet-wide service deployments; if drawn at all it should be a labelled table or a log-scale dot plot with the definition printed beside each point.

### Gaps

- An Etsy deploys-per-day series, a Netflix series and a Microsoft box-to-cloud series cannot be drawn from what was verified here.
- No source opened gives defect or incident rates before and after a move from release trains to ramping at the same company, other than Facebook mobile's normalized crash-rate figures (no absolute values) and Amazon's slide bullets (75% and 90% reductions since 2006, no method).
