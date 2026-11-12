# Moving off the release train

*Why engineering teams should replace testing periods and scheduled releases with dark launches, feature flags, staged rollouts, and fast rollback.*

Some engineering organizations still deliver software the way most of the industry did twenty years ago. Changes accumulate into a scheduled release, known as a release train, which is promoted through a series of test environments, held in pre-production for a soak period, approved, and then released to every user at once. This article argues that teams still using a release train should replace it.

In the model that has replaced it at most large internet companies, small changes are deployed to production continuously with their new behavior disabled. Each behavior is then enabled separately, first for no one, then for a small group, and then for everyone, with a rehearsed way to reverse each step. A growing number of banks and payments firms now work this way as well. Testing before production remains, but most of the evidence that a change is safe is gathered in production, at limited exposure.

The release train imposes days of delay on every change regardless of its risk, and it forces changes into batches that are harder to test and harder to debug. The safety it provides is also narrower than it appears, because a soak in a test environment cannot observe real dependencies, code paths that nothing exercises, or faults whose trigger has not yet occurred. Separating deployment from release removes the trade-off between speed and safety that the train creates, provided the supporting practices are adopted in full.

Adopting the model is primarily a change in engineering practice and culture, and that change is harder than the tooling. Engineers have to write changes that can be turned off, teams have to operate what they deploy, approval has to move from scheduled meetings to recorded evidence, and rollback has to become a routine operation.

The first half of the article covers the release train and its costs, how the industry arrived at the alternative, the techniques involved and the limits of each, what changes for the people involved, and how these efforts fail. A separate part covers changes to data and machine-learning models, where state persists after a rollback and changes propagate to downstream tables and models, so the techniques take different forms. The second half applies the argument to systems that move money, which are the hardest case, on the reasoning that a model that can be applied safely to payments can be applied elsewhere. Most of the linked sources are engineering posts and papers written by the teams that did the work.

In this article, to **deploy** is to put code into production, to **release** is to expose new behavior to users, and a **train** is a scheduled bundle that does both at once.

## The release train

### How it works

A release train runs on a schedule, which may be monthly, weekly, or several times a week. Everything merged since the previous cut is bundled into a release candidate. The candidate is promoted through a series of environments, typically integration, performance and pre-production, with automated and manual tests at each stage. It is then held in pre-production for a fixed soak period, approved by a change board, and released in a scheduled window.

![A timeline of one release train: finished changes wait about 1.75 days on average for the next cut, the train spends three days in promotion, and it is then released to every user at once. User exposure stays at zero and steps to 100% at release; a typical change takes about five days from finished to live.](figures/00-release-train.svg)

Microsoft's product teams in the 1990s [built daily and stabilized at milestones](https://www.cs.umd.edu/~atif/Teaching/Spring2003/cusumano.pdf) that were months apart, whereas Facebook's website shipped [a weekly release](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf), cut on Sunday and pushed on Tuesday, into the 2010s. Mobile applications ran on cycles of several weeks.

The running example in this article is a schedule of two trains a week, each taking three days from cut to release, and the three days are divided roughly as follows.

The first day consists of deployment to an integration environment, followed by an automated regression pack run against simulators for external dependencies. This work amounts to a few hours of machine time, much of which could run in parallel.

The second day is a performance run, usually preceded by an environment reset and a data refresh that take longer than the test itself, followed by an overnight batch cycle.

The third day is evidence assembly, change approval, and the wait for a release window.

Only part of that time is work; the remainder is spent waiting for an environment, an approver, or a release window. When Amazon measured its own pipeline, before automating it, code took an average of 16 days to get from check-in to production, and for almost 14 of those days it was [waiting for someone to start a build, perform a deployment or run a test](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/). A twice-weekly train will have a far better ratio, but it would be surprising if the work came to more than one day of the three.

![A sixteen-day bar: about two days of work and almost fourteen days of waiting for someone to start the next step.](figures/08-sixteen-days.svg)

### The purpose of the soak

A soak finds faults that appear only with elapsed time or at a boundary, which short tests and short canaries do not reach. They include:

- database and message-queue connections that only misbehave after hours of idleness
- memory, file handles and log volumes that creep
- queues that slowly deepen
- date rollovers and other time-triggered work
- batch jobs running to completion on new code while online traffic continues
- whether the release still holds peak throughput

The model described here keeps those checks and changes where the waiting happens and how much work has to wait for it.

Some of what happens in the three days has to be preserved in any replacement:

- one full batch cycle on the new code
- one daily peak, because capacity regressions do not appear at low traffic
- test windows with external partners, which run on the partner's calendar
- a second person's judgment on any high-risk change

The rest of the three days is largely queueing, which can be reduced.

### Lead time

With two evenly spaced trains a week, a finished change waits a little under two days on average for the next one and then spends three days in promotion. The total is about five days from finished to live, or six and a half for a change that has just missed a train, and the wait is the same for a one-line fix as for a change to core business logic.

The table below applies the five-day figure to the kinds of work a team does. The right-hand column is an estimate of the same work once deployment and release are separated.

| Kind of work | On the train | Deployed daily, released separately |
| --- | --- | --- |
| An ordinary change, which is most of them | About 5 days from finished to live | In production the next business day, on every node the day after |
| A fault found in production | 5 days, or a hotfix that skips most of the three days | The same as an ordinary change, through the normal path |
| A feature that needs three rounds of feedback from production | About 15 days of waiting | About 3 |
| A high-risk change | 5 days, then every client at once | Evidence from production the next day; full release in four to eight weeks |

The last row shows a high-risk change taking longer under the new model, which is intended. The gain comes from the other three rows, where ordinary work no longer queues behind the risky change.

The hotfix row reflects the emergency path that usually accompanies a train and that skips most of the three days. The existence of that path shows that the three days are sometimes more than a change needs. It also means that changes made under the most pressure receive less verification than any others.

### Batching

The second cost of the train is that each release carries half a week of other people's changes, so when a release misbehaves, the first job is to work out which change caused it.

A schedule with a cut-off also changes how people behave near it. LinkedIn's mobile team, releasing monthly behind a four-day manual regression pass, [described engineers rushing code in before the deadline](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases) because missing it cost a month. Facebook measured the result on its own mobile releases and found that code pushed on the day of the cut was [of lower quality than code pushed on other days](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf). The same mechanism applies, with a weaker effect, when missing the train costs half a week instead of a month.

Batching also keeps unfinished work out of the main branch. A change that takes three weeks cannot board a train until it is complete, so it lives on a branch and drifts from everyone else's work until it is merged.

The clearest account of what large batches do in a financial setting comes from OANDA, a currency-trading platform. OANDA deployed its own platform continuously, and also licensed the same software to large banks whose policies did not allow continuous updates, so the banks took it in periodic releases. In [a paper written with Facebook engineers](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf), the authors report that each release to the banks bundled thousands of changes, that the size of the release raised anxiety and led to much more extensive testing, that failures were significantly harder to isolate, and that bugs judged non-critical went unfixed for many months because a fix had to wait for a release.

### Why the train cannot simply run faster

One obvious remedy is to shorten the three days, but that means cutting the soak and therefore no longer looking for the faults the soak finds.

The other is to run the train daily with the same three days, which does not work either, because three trains are then in promotion at once. That arrangement needs three sets of environments and three times the partner test windows. A fault found on the third day of one train is already in the two behind it. Every change still waits three days, and every release still reaches every client in the same instant.

Within the train model, speed and safety trade against each other, and a responsible team chooses safety. The trade-off exists only because the train deploys and releases in one act, so the caution that a risky change deserves is applied to the whole train and everything on the train waits for it.

Google's Site Reliability Workbook states the constraint as follows: ["If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."](https://sre.google/workbook/canarying-releases/)

### Limits of pre-production testing

A soak is effective against faults that depend on elapsed time. It does not detect faults that depend on the behavior of real dependencies, on code paths that are not yet in use, or on conditions that have not yet occurred.

A soak cannot show how real dependencies behave, because pre-production talks to simulators and stubs. A simulator can confirm that a request is well formed and that scripted error and timeout cases are handled, but it cannot show how a real third party responds to real traffic.

A soak also cannot find a fault on a code path that nothing exercises, because time in an environment proves nothing about code that is not being called. Knight Capital's new order-routing code went onto its production servers in stages from July 27, 2012, five days before it was first used. The [SEC's order against the firm](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) records no incident in that time, because nothing was yet using the code, and a three-day soak would have observed no more than those five days in production did. On the morning it was activated, the firm took on unwanted positions in about 45 minutes that cost it more than $460 million.

Elapsed time in any environment also does not find a fault whose trigger has not yet occurred. Stripe's outage of July 2019 came from a database version that had [passed testing, a phased rollout and about three months in production](https://stripe.com/rcas/2019-07-10) before a rare combination of conditions exposed it.

Staging environments also differ from production in the data they hold. In April 2022 Atlassian ran a maintenance script that had been tested in staging under its normal change process and peer reviewed. It deleted the sites of 775 customers, some of whom were locked out for up to 14 days. [Atlassian's review](https://www.atlassian.com/engineering/post-incident-review-april-2022-outage) explains that staging could not have caught it, because the identifiers that triggered the fault did not exist there.

A long wait can also lose its purpose, as Netflix's engineers reported when, looking back at 2012, they [wrote that their week-long canaries](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) were "devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality".

The size of a change also matters more than the scrutiny it receives. In 2021 the UK's Financial Conduct Authority published [a review of how 23 financial firms had made more than a million production changes](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) during 2019. Changes the firms classed as major, which generally received more oversight, failed at 3.8%, against 1.6% for changes as a whole. Change advisory boards approved more than 90% of the major changes they reviewed, and at some firms did not reject a single one all year. The FCA's own summary was that "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles".

![Three panels of FCA statistics: 1.6% of all changes failed against 3.8% of major changes; change boards approved over 90% of major changes; change caused 17% of material incidents reported to the FCA and 24% of firms' high-severity incidents.](figures/07-fca-findings.svg)

The findings come from a regulator examining regulated firms, and they show failure concentrated in large changes, which heavy approval did not offset. They are associations and not controlled comparisons. Major changes are riskier by nature, and the review also found a slightly higher failure rate at firms that described more of their work as DevOps, on a sample too small to support a conclusion.

## How the industry got here

The practice grew out of two separate lines of work that met around 2008.

### Integration and experiments

The first of these lines dealt with the merging of changes, which Martin Fowler and Matthew Foemmel addressed in 2000 when they wrote up [continuous integration](https://martinfowler.com/articles/originalContinuousIntegration.html). Under that practice everyone merges to one branch about once a day, and an automated build and test run tells them quickly whether their work fits together. It solved the problem of changes that had diverged for too long, but it did not address putting each change into production.

The second line concerned exposure, and it came from web companies that had learned to show a change to some users and not to others, and to measure the difference. By 2007 Ron Kohavi and colleagues at Microsoft were recommending, in [a guide to running experiments](https://exp-platform.com/Documents/GuideControlledExperiments.pdf), that a new treatment start with a small share of users, ramp up gradually, and be shut off automatically if it did harm, a safety mechanism set out in a paper about measurement.

Google's search team built the connection between measurement and safety into its infrastructure. Its [2010 paper on experiment infrastructure](https://research.google/pubs/overlapping-experiment-infrastructure-more-better-faster-experimentation/) describes a system first deployed in 2007 in which code shipped in binary pushes, while experiments and launches were controlled by separate, faster pushes of data and configuration. A feature moved through a canary, an experiment and a gradual launch before it became the default, so the binary and the behavior were already on different schedules.

### Dark launches and flags

In 2008 Facebook used the same separation for load. Two months before anyone could use Facebook Chat, the site's pages began [connecting to the new chat servers](https://engineering.fb.com/2008/05/13/web/facebook-chat/) and sending simulated messages, so that the backend carried production load while no interface was visible, which Facebook called a dark launch. Visible rollout began on April 6 and reached everyone on April 23, according to [the engineer's later slides](https://www.erlang-factory.com/upload/presentations/31/EugeneLetuchy-ErlangatFacebook.pdf).

The technique became public vocabulary in 2009, when John Allspaw and Paul Hammond gave a talk at the Velocity conference called [10+ Deploys Per Day](https://paulhammond.org/2009/06/velocity/10deploys.pdf) about Flickr. Later that year Ross Harmes described [how Flickr used feature flags](https://code.flickr.net/2009/12/02/flipping-out/), with everyone working on the main branch, the site deploying several times a day, and unfinished features sitting in production switched off. Timothy Fitz described [IMVU deploying about fifty times a day](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/) behind an automated test suite, with deployment to a subset of machines first and automatic rollback. In 2011 Etsy's Chad Dickerson wrote that [Etsy's flags were taken almost directly from Flickr's](https://www.etsy.com/codeascraft/how-does-etsy-manage-development-and-operations), brought over by engineers who had worked at both.

Wealthfront is an early example from regulated finance. In 2010 the firm, which is regulated by the SEC, described [a deployment system](https://eng.wealthfront.com/?p=1273) in which the engineer who committed a change released it, the rollout went to one instance first and then outward, and an instance that failed its start-up self-test triggered a rollback that took about five seconds across a cluster of ten machines.

### Scale, and the first hard lessons

From 2012 the published accounts describe larger systems and are more open about failures. Netflix described [an automated canary score](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0) for its API in 2013. Microsoft's Visual Studio Online team had a public outage on the morning of a launch, caused by flags, and responded by building [a first ring of volunteer accounts](https://devblogs.microsoft.com/bharry/visual-studio-online-update-feb-10/) that took every deployment before anyone else. Facebook published a paper in 2015 on [how it managed configuration](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), which describes engineers who "release the new code into production early but in a disabled mode, and then use Gatekeeper" to widen exposure, and which acknowledges that configuration changes were causing a real share of incidents and needed canaries of their own.

By 2017 Facebook's website had moved from scheduled pushes to [deploying continuously from the main branch](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), with each build going to employees, then 2% of production, then everyone. In 2020 Amazon published [a detailed description of its deployment pipelines](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), with a single machine first, then one region, then waves, bake times at each stage and automatic rollback.

### Banks and regulators

Firms that move money came later, and the first to write about it were the ones built new. Starling Bank [told a conference in 2018](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf) that it released to production up to five times a day. Monzo described [more than a hundred deployments a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day) in 2022 and, later that year, [automated rollback across more than 2,100 services](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale).

Regulators have since published on the subject. France's banking supervisor, the ACPR, described in a [2018 discussion paper](https://acpr.banque-france.fr/system/files/import/acpr/medias/documents/818013_acpr_risque-informatique_web_fr_v3.pdf) change policies under which releases are grouped into batches and scheduled outside normal service hours, at weekends for example. Its [2021 notice](https://acpr.banque-france.fr/system/files/import/acpr/media/2021/07/08/20210707_notice_risque_it.pdf) accepted agile project methods and automated change processes, provided that automation does not reduce control over the changes made. The FCA's review appeared in 2021. The 2024 edition of the [handbook that US bank examiners work from](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf) mentions canary releases and observes that "in a DevOps environment, the same number and type of changes can be made daily or even hourly". In the EU, the [Digital Operational Resilience Act](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2554) has made change management a binding requirement for banks, payment institutions and investment firms since January 2025, and its [technical standards](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) permit testing in production as an approved exception, a concession they attribute to "current ICT system development practices".

A team adopting the practice now can draw on about fifteen years of published accounts, which include the failures.

## Separating deployment from release

### The idea

A change is written so that its new behavior sits behind a feature flag, and the flag is off when the code ships. The code is built, deployed and running in production alongside everything else, and no client sees anything different. Turning the behavior on is a separate decision, taken later, for whichever clients are chosen.

With that arrangement, deployment and release no longer have to happen together. Deployment can be frequent and uneventful, because deploying disabled code is meant to change nothing a client can see. Release stays deliberate, and can be more careful than it is on a train, because it applies to one behavior at a time and to as few users as required. The long wait then applies to the one behavior that needs watching, and every other change proceeds without waiting for it.

### Flag evaluation

At its simplest a flag is a conditional that reads a value from configuration:

```python
if flags.enabled("route-small-payments-instant", client=payment.client_id):
    rail = choose_rail_v2(payment)
else:
    rail = choose_rail_v1(payment)
```

In a transactional system, the point at which the flag is read and the behavior when the flag service is unavailable both need more care than they do on a website.

A payment has a life that can run for days or months, through acceptance, submission, confirmation, returns, recalls, status inquiries and postings. If each of those steps reads the flag again, switching the flag mid-life strands the payment between two behaviors. The decision therefore has to be made once, at acceptance, and stored with the payment:

```python
# At acceptance: decide once and record the decision.
payment.rail = decide_rail(payment)   # reads the flag here, and only here
ledger.record(payment)

# Everywhere else: follow the stored decision, never the flag.
gateway_for(payment.rail).submit(payment)
```

Downstream services follow the stored decision and do not read the flag again. A release train never forces this design decision, because on a train the behavior changes for everyone at once and there is nothing to be consistent with.

When the flag service is unavailable, a web feature can default to "off" without harm. For a client who has already been moved to the new behavior, a default of "off" would silently move live payments back to the old path and then forward again when the service recovered. The safer rule is to fall back to the last known value, and to the old behavior only when there is not one.

### Kinds of flag

Pete Hodgson's article on [feature toggles](https://martinfowler.com/articles/feature-toggles.html) separates four kinds of flag, which differ in how long they should live.

- **Release flags** hide unfinished or unproven behavior. Hodgson's guidance is that they should not stay much longer than a week or two.
- **Experiment flags** split users between variants to measure a difference. They live as long as the experiment.
- **Operational flags**, including kill switches, let operators turn something off under load or during an incident. Some of these are permanent.
- **Permission flags** give a behavior to particular clients as a matter of product, and are long-lived by design.

This article is mostly concerned with release flags. The other kinds use the same machinery, which is part of why flags accumulate.

### Canaries, ramps, and experiments

Canaries, flag ramps and experiments follow the same loop, in which a subset is exposed and compared with the rest, and the exposure is then widened or reverted. They differ in what varies, who is exposed and the question being asked.

| | Canary | Flag ramp | Experiment |
| --- | --- | --- | --- |
| What varies | The binary | One behavior inside the binary | One behavior inside the binary |
| Who is exposed | Some machines | Some clients or accounts | Randomly chosen clients or accounts |
| The question | Is it broken? | Is it broken? | Is it better? |

The same infrastructure therefore usually serves all three. Google's experiment system was also its launch system. [LinkedIn's experimentation platform](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) ramps features independently of code releases. Uber built [automated rollouts with regression detection](https://www.uber.com/us/en/blog/autonomous-rollouts-regression-analysis/) on top of its experiment platform.

For a financial firm, the important difference is the question in the last row of the table. A safety ramp intends the same outcome for every client and limits exposure in case something is wrong, whereas a product experiment deliberately gives clients different variants to learn which is better. The experiment raises questions about fair treatment that the ramp does not. A ramp that is described as an "experiment" attracts objections that apply only to real experiments, so the distinction should be stated explicitly, especially to risk and compliance.

### Changes a flag cannot guard

Some changes in a build cannot sit behind a flag. A library upgrade, a new database driver, a change to the runtime or a container base image belongs to the binary as a whole. Changes of this kind are the ones that leak memory and exhaust connection pools, which are the faults a soak exists to find.

The binary therefore still needs time under load, and under the new model it gets that time in production. The build goes to a small part of production first and stays there through a daily peak before it goes wider. This wait is usually called a **bake**. This article uses "soak" for the wait in pre-production and "bake" for the wait in production.

In Amazon's pipeline, which is the best-documented example, each build goes to a single machine, then to one region, then outward in waves. Each stage has a minimum wait of between one and twelve hours and a minimum amount of real traffic that must be served before the build moves on. An alarm rolls the build back automatically. A change typically takes [four or five business days to reach every region](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/).

Amazon's elapsed time is therefore no shorter than a three-day soak. The differences are that builds enter the pipeline one after another, each carries only the changes made since the last, and the waiting is done on real traffic at limited exposure.

Daily deployment also restarts every process every day, so a slow leak may not show until a change freeze leaves a build running for two weeks. For runtime and library upgrades a deliberate multi-day soak should be retained.

## The techniques

A testing period looks for regressions, exercises load and elapsed-time behavior, gives people a chance to accept the change, bundles approval, and provides a back-out point. Each technique in this section replaces part of what the three days do, and each has a limit that its own authors describe.

### Dark launches and shadow traffic

"Dark launch" refers both to dormant code and to shadow runs.

**Dormant** code is deployed behind a flag that is off. It has been merged, built and deployed, and has been shown not to disturb what is live, but nothing calls it. Dormancy allows unfinished work to merge to the main branch every day. Netflix used it to stop acceptance testing from blocking deployment, and the feature [stayed disabled in production](https://netflixtechblog.com/preparing-the-netflix-api-for-deployment-786d8f58090d) while testing continued.

In a **shadow** run, real traffic passes through the new code, the result is compared with what the old code produced, and the result is then discarded without any client seeing it. Because a shadow run uses production's own traffic and data, it replaces most of what a soak is expected to reveal.

GitHub used a shadow run when it rewrote the code that merges pull requests. The team [ran the old and new implementations side by side](https://github.blog/2015-12-15-move-fast/) in production using a small library called Scientist, compared the results on tens of millions of merges, fixed mismatches for four days, and switched over after 24 hours with none. Square took a similar approach when it moved payment data to a new service, and reports that comparing the two paths ["actually caught a lot of subtle bugs"](https://developer.squareup.com/blog/breaking-up-with-your-monorail/).

Stripe's [migration of its subscriptions data](https://stripe.com/blog/online-migrations) applied the same idea to a data store, in a sequence of small steps that could each be reversed. The team wrote to the old and new stores at once, backfilled existing records, compared reads from both while the old store stayed authoritative, switched reads, then switched writes, and only then removed the old path.

Banks already know a version of this technique as a parallel run, in which two systems are fed the same input and their outputs are compared before the new one is trusted.

Shadow runs cannot be applied to code with side effects. GitHub's own post says that ["Scientist is not meant to be used for any code that has side-effects"](https://github.blog/2016-02-03-scientist/). A decision or a calculation can be shadowed, but sending a payment cannot, so for money movement the shadow records what would have been sent and stops there.

Live comparison accumulates confidence slowly and does not reach data that is rarely read. When Uber moved its ledger to a new store, it set a bar that the new store be ["at least 99.99% complete and correct as measured by shadow validation"](https://www.uber.com/blog/migrating-from-dynamodb-to-ledgerstore/). Its engineers worked out that at a thousand records a second, six nines of confidence would take slightly more than a day of comparisons, and seven nines about twelve days, which they judged impractical. Live shadowing also missed records that were rarely read, so they compared stored data offline as well, 760 billion records in one job.

When a comparison harness writes mismatches to a table that nobody examines, the stage passes on elapsed time as a soak does, which is the failure Netflix described. Every mismatch needs an owner and a deadline, and the exit condition is zero unexplained mismatches over a stated volume.

### Canaries and bake time

A canary puts a new build on a small part of production and compares it with the rest before going further.

Early canaries were evaluated by hand. Netflix's account of its API in 2013 describes [a canary that ran for hours and was scored automatically](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0) against a baseline on a set of metrics. By 2018 its [Kayenta system](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69) compared a new cluster with a freshly launched copy of the old version under the same live traffic, and judged the difference statistically. Comparing against a fresh baseline matters, because a server that has been running for a week behaves differently from one that started ten minutes ago, for reasons that have nothing to do with the change.

Amazon's version is the one-box stage, in which one machine takes the new build and a small share of a region's traffic. The build stays there for at least an hour and until a minimum number of requests has been served, and it moves on only if the alarms are quiet.

Google's SRE Workbook has [the most careful account of what canaries cannot do](https://sre.google/workbook/canarying-releases/). Canaries need representative traffic, so they are weak on paths that few requests take. For batch and other non-interactive work, a canary has to span at least "a single work unit", and the longer a canary runs, the fewer releases fit in a week. A Google engineer writing about the company's canary analysis service [states](https://queue.acm.org/detail.cfm?id=3194655) that canarying is no substitute for unit testing, integration testing or monitoring.

Transactional systems add the problems of low volume and shared state. A 1% canary gives little information about a flow of a few hundred large payments a day, because there is not enough traffic for a statistical comparison. The exposure therefore has to be chosen by client or payment type, and the judgment rests on correctness checks more than on rates.

Shared state weakens a canary because two nodes of a ledger posting engine write to one ledger. Putting the new build on one node limits its share of traffic without limiting the damage a bad write can do.

### Rings and ramps

A ring is a canary assigned to a defined population of users. Microsoft's guidance describes a major team that [deploys through five tiers](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices), starting with internal accounts that tolerate risk and bugs, with about a day's bake in each. Facebook's website went to employees first, then 2% of production, then everyone. Slack [deploys to its own staff, then a 2% canary, then 10, 25, 50, 75 and 100%](https://slack.engineering/deploys-at-slack/).

A ramp applies the same progression to one behavior, using a flag, where a ring applies it to a build.

The unit of exposure matters more than the percentages, as Square found when it moved payment records to a new service using random percentages of requests. Its engineer wrote afterwards that this had hidden a regression which only appeared for a particular combination of client software versions, and that rolling out in a way that was [stable per merchant](https://developer.squareup.com/blog/breaking-up-with-your-monorail/) would have confined it to a few.

For a firm whose clients are themselves businesses, the unit is the client, and a client has to agree to go first, which is a constraint a consumer website does not have. Stripe handles a related problem by [pinning each account to an API version](https://stripe.com/blog/api-versioning) and letting the account choose when to move.

![Seven published ramp schedules, from Facebook's website (employees, 2%, 100% in a few hours) to Amazon (one box, first Region, more Regions, all Regions over four to five business days), Slack (its own staff, a 2% canary, then 10% to 100%) and Uber's payment authorization (shadow, employees, 0.25%, 1%, 5%, 100%).](figures/06-published-ramps.svg)

How long to hold each step depends on how long the evidence takes to arrive. Microsoft studied this for Office and found that when an early-ring rollout moved a guardrail metric at all, [79% of those movements showed within the first three days](https://microsoft.com/en-us/research/uploads/prod/2020/06/Safe-Velocity-ICSE-SEI.pdf) and the rest by day seven. For payments the slow signals are reconciliation and period ends, and they set the pace.

### Experiments

An experiment gives a randomly chosen group the new behavior and measures the difference from everyone else.

Experiments are run because careful people are poor at predicting which changes help. At Microsoft, [only about a third of well-designed experiments](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf) improved the metric they were built to improve. The same applies to re-implementations, which a sign-off meeting cannot show to behave like the old path. A later paper from the same group describes a re-implementation of an order pipeline at Amazon that was believed to be equivalent to the old one, [lost 2% of revenue in its A/B test, and shipped after five iterations](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf).

Booking.com applies the practice most broadly. Its engineers write that ["every change... is wrapped in an experiment"](https://arxiv.org/abs/1710.08217), with more than a thousand running at once, and that anyone in the company may stop one that is doing harm.

Financial firms publish less about experiments, and what they publish is mostly about interfaces, support flows and communications. Monzo describes [a set of launch tools](https://monzo.com/blog/2023/08/03/how-we-launch-new-products-at-monzo) that includes staff testing, an opt-in group, randomized experiments and staged rollouts, and says it ran an experiment on a change to a credit product's payment dates "to make sure it didn't lead to bad outcomes".

In the UK, the FCA's [guidance on the Consumer Duty](https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf) says that customers' understanding "could be tested directly by conducting randomised controlled trials or A/B tests", and adds that a firm which tests its communications to maximize sales should test customer understanding to the same standard.

Experiments need enough traffic to detect a difference, and results that take weeks to mature need experiments that run for weeks. Most changes to a payment platform's internals call for a safety ramp and do not need an experiment.

### Rollback

"Rollback" can mean switching traffic back to the old version, redeploying the kept build, or rebuilding the old source, and the third of these is unsafe under pressure.

![Rollback methods: a traffic shift back to a previous version that is still running; a redeploy of the retained build, identified by its hash; and a rebuild from an earlier source revision. Rollback does not reverse data written, schema migrations, messages sent or payments made.](figures/09-three-rollbacks.svg)

When traffic is switched back, the old version is still running and traffic is pointed at it again. Netflix was [deploying this way by 2012](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1), bringing up the new version beside the old, moving traffic across, and keeping the old one until the new one was trusted. The switch takes seconds to minutes, and it costs the capacity to run two versions at once.

Redeploying the kept build means that the previous build is deployed again as it was. This depends on a rule from Jez Humble and David Farley's *Continuous Delivery*, which is to [build the binary once](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3) and deploy that same binary, identified by its hash, to every environment. One of their reasons was audit, since the rule proves that what was tested is what runs. It also means a rollback returns production to something that has already run there.

Rebuilding the old source means checking out an earlier revision and building it again. The result is the same as before only if the build is perfectly repeatable, and a team that has not verified this will learn of any difference during an incident.

Whichever kind is used, the previous build has to be able to read what the newer build wrote. With daily deployment and a bake, production is running two versions on the same queues and tables every day. Amazon's guidance on [rollback safety](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/) identifies protocol and format changes as the most common reason a rollback fails, and handles them in two deployments: the first teaches the software to read the new format, and the second, days later, starts writing it, so that either can be rolled back alone. Amazon also tests the rollback itself. In a production-like environment under simulated traffic, the new build is deployed to half the fleet, the deployment is completed, and then it is rolled back.

A rollback that has never been run is itself an untested change, and it is made during an incident. RBS experienced this in June 2012, when it backed out an upgrade to its batch scheduler and the back-out caused the incident. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf) says the bank "had only tested the consequences of backing out Version 2 to Version 1", and what was installed was a patched variant, Version 2A. More than six million customers were affected.

Google advises making rollback routine. Its guidance for cloud customers says that when a fault is suspected in a new release, Google's own releasing team ["rolls back first and investigates the problem second"](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons), and that a team that has gone a few weeks without a rollback should perform one deliberately. A Google engineer writing about [generic mitigations](https://www.oreilly.com/content/generic-mitigations/) puts the risk this way: "Far too many think they have safe rollbacks, only to learn otherwise during an outage."

Rollback restores the service but does not undo data the newer build wrote, a schema it changed, a message it sent or a payment it made. Rolling back is also the wrong action at certain times, such as inside a cut-off window or halfway through a batch step, and those times need to be written down in advance.

Switching a flag off is a lighter reversal than any of these, and Facebook [preferred it to reverting a build](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) where it could. A flag reverses only one behavior, however, and a flag that has been fully on for months has an off path that nobody has exercised.

### Automated rollback

The next step after rehearsing rollback is to have the pipeline perform it. Amazon's deployments roll back on alarms without anyone watching, and its engineers note that a rollback is often already under way by the time the on-call engineer has been paged. Monzo's rollbacks use the same application metrics that drive its alerts. Slack reports that [73% of its customer-facing incidents were triggered by its own changes](https://slack.engineering/deploy-safety/). By Slack's own figures, customer impact hours fell by 90% from their peak in early 2024 to January 2025, during a program in which automatic rollback was one of many parts.

Automated gates produce false alarms, and Meta's paper on [its deployment system](https://www.usenix.org/conference/osdi23/presentation/grubic) reports that a human allowed the deployment to proceed after health checks had flagged it in 11.5% of deploy actions for regular services and 41.3% for large ones. A gate that raises false alarms that often will be overridden. Facebook's earlier configuration paper records an engineer overriding a correct canary rejection on the assumption that the tool was wrong.

The order in which these capabilities are adopted matters as well. Slack built alerts with manual remediation first and automatic rollback second, and Monzo was already deploying more than a hundred times a day when it automated rollback.

## Ownership and culture

The mechanics are the smaller part of the work, and most of what the published accounts describe is a change in who is responsible for what.

### Authors own the flag

Under this model the author's job no longer ends at the merge, as it does on a train. The author of a change decides what the flag guards and how the disabled path behaves, builds the shadow comparison, writes the ramp plan with its stop conditions, and deletes the flag when the ramp is done.

This is more work per change, and it asks people to plan for being wrong. The existence of a tool does not produce the habit, which follows what code review asks about, what counts as done, and what is recognized at review time. Microsoft's experimentation team [wrote in 2009](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf), after three years of trying to spread a related habit, that most goals in the company were still about shipping, and doubted they had changed many people's objectives.

The mechanism should also be built by the engineers who use it. John Allspaw ran operations at Flickr, and when he left he wrote [a letter to the management above him](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/) explaining how the site had stayed up while changing many times a day. He stated explicitly that the dark launches and flags were built by the developers and not by operations.

### Service ownership and on-call

Werner Vogels stated the principle in 2006: ["You build it, you run it."](https://queue.acm.org/detail.cfm?id=1142065) The reasoning is that the people who feel a service's failures are the people who can fix their cause.

Netflix's account is the most useful, because it records an intermediate model failing. For a period its developers could deploy but a release specialist remained. The developers often deferred to the specialist, and the specialists found it hard to make time to automate the job. Full ownership worked, but only with central tooling teams, training and spare capacity. [The post says](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) that without those, "teams risk overload and burnout".

Putting developers on call without dashboards they can read, access they can use, or a runbook written for them leads to attrition.

### Testers and release managers

This model does not make testers or release managers redundant, and the companies best known for it retained both.

Google moved testers out of product teams' reporting lines and turned many of them into tool builders. James Whittaker, who ran testing there, [wrote that](https://testing.googleblog.com/2011/01/how-google-tests-software.html) "it's the product teams that own quality, not testers". Google nevertheless kept test engineers, and the change took about five years and was driven at first [by volunteers without executive backing](https://martinfowler.com/articles/testing-culture.html).

Microsoft's Azure DevOps group merged its development and test organizations and rewrote its tests over more than two years. Brian Harry, who ran the group, [described the cost](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/). A separate test discipline had given the organization a measurable, controllable investment in testing and a career path for testers, and both were given up. He also admits that eighteen months in, he started asking when it would be finished.

Facebook, which is often said to have no QA, had a release engineering team with the power to refuse and revert changes, and kept a three-day soak for its iOS app, on employees, because an app on a phone cannot be recalled.

The people who run the train today have the most knowledge of where faults occur. Their work moves to the comparison tooling, the pipeline and the review of ramp plans, and that should be communicated early.

### Approvers

Flickr's operations team held a go or no-go decision on launches, alongside the other groups involved. Allspaw's letter describes what he did with it: "A significant part of my job was working towards saying 'go', not 'no-go'." Speed remained conditional on safety, and in his words, "When it wasn't safe, we slowed, and everyone was fine with that happening".

A change board can work the same way. Its members keep the authority to refuse, and their job becomes making approval safe by approving ramp plans, setting stop conditions, and deciding which kinds of change are pre-authorized.

### Rollback authority

Whoever is on call needs the authority to switch a flag off or roll back a build without asking, and needs to be thanked for it afterwards. Google's guidance says nobody should be asked to justify a rollback as long as its record describes the problem. Booking.com's rule is that ["Everyone in the company must be able and feel empowered to stop harmful experiments of their own accord."](https://arxiv.org/abs/1710.08217)

A kill switch is a control only if the people on call can find and operate it. In November 2014 Microsoft's service had an outage of seven and a half hours caused by a change in the database service beneath it. Harry's [write-up](https://devblogs.microsoft.com/bharry/outage-on-monday-nov-24) says that once the change was identified, it took approximately 45 minutes to work out how to turn off the flag behind it, because of tooling problems and missing documentation.

### Responding to failure

Every one of these programs eventually has a serious incident, and the response determines whether the program continues.

OANDA had deployed continuously for several years when a major failure, in the words of the paper that describes it, "cost the company a significant amount of money within seconds". Senior management's first reaction was to ask for more approvals and a separate, traditional testing team. The post-mortem found that the unit tests had caught the bug and that their failures had been ignored among false alarms. Additional approvers would have been approving a change whose own tests had already failed. The engineers argued instead for a renewed focus on automated testing, and prevailed.

The same paper records the effect of a change in leadership. In mid-2012, executives more inclined to traditional process took over, and although the engineering team was much the same, deployments fell by 23%.

John Allspaw's essay on [blameless post-mortems](https://www.etsy.com/codeascraft/blameless-postmortems) explains the mechanism from a manager's side. An engineer who expects to be punished stops supplying detail, and management knows less about how the work is done. The first question asked after a failure sets the direction of the response. Asking "Who approved this?" leads to more approvers, and asking "What did we know, and why did nobody act on it?" leads to a better control.

The 2019 State of DevOps report found the same pattern across its survey: organizations ["often respond to problems with software releases by introducing additional process and more heavyweight approvals"](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf), and its analysis suggested that this makes things worse.

### Timeline

Published accounts of this transition describe it as taking years. On the morning Microsoft launched Visual Studio 2013, Harry's team switched on a batch of feature flags. The service became unresponsive at peak, and switching the flags off did not bring it back. Harry [wrote it up](https://devblogs.microsoft.com/bharry/a-rough-patch/) in detail. One lesson he drew was that the service ran as a single instance, so that, flags aside, "all customers are affected or none", and a flag could therefore not confine a fault to a subset of customers.

One remedy was to deploy at weekends, which he called a mitigation rather than a fix. Another was a separate instance for accounts that volunteered to take every deployment first, and Harry said his own account would be on it. By 2017, by his own account, the change had taken about six years and was not finished. His judgment was that trying to do it all at once would have failed.

LinkedIn took a different route and [stopped feature development](https://www.linkedin.com/blog/engineering/architecture/brief-history-scaling-linkedin) for a period in late 2011 to rebuild its tooling. Eight years later it wrote that its teams had [traditionally relied on a manual release process](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment), and described moving key services from a few releases a week to several a day.

Amazon's approach to skeptical teams is the most transferable. They were told to ["encode their current release process, manual steps and all, in a pipeline"](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/), and then to automate one step at a time as their confidence grew, so that nothing was removed on the first day.

## Failure modes

The published failures of this model come from adopting only part of it.

### Flag debt

Flags are cheap to add, but each one carries a continuing cost. Every flag that is on for some clients and off for others means production is running more than one system, while the regression pack tested one. Every change made near a live flag has to work in both states. The old path stops being exercised on the day the flag reaches everyone, and after that, switching it off is an untested change.

A study of Chrome found its flags growing [from 263 to 1,040](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf) over the releases it examined. Uber eventually [built a tool to remove stale flags](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf) and deleted 1,381.

Flag debt is controlled by rules that tooling can enforce. Every flag is created with an owner and an expiry date. The build warns as that date approaches and fails once it has passed. Kill switches that are intended to be permanent are registered as permanent and are exempt from expiry. Each service has a limit on the number of live release flags, and a flag name is not reused for a different purpose.

### A reused flag and an incomplete deployment

Knight Capital is the standard cautionary example and is often described inaccurately.

According to the SEC's order, Knight's new code reused a flag that had once activated an old function called Power Peg, which had not been used since 2003 and had been left in the code. The new code was deployed in stages over several days. A technician did not copy it to one of the eight servers, and no second person checked. Before the market opened on August 1, the system sent 97 automated emails referring to the problem, and nobody acted on them. When orders carrying the flag arrived, seven servers ran the new code and the eighth ran Power Peg. In about 45 minutes Knight executed 4 million trades in 154 stocks and ended up with positions that cost it more than $460 million. During the incident, the firm uninstalled the new code from the seven servers where it had been deployed correctly, and in the SEC's words, "This action worsened the problem."

![Knight Capital: eight servers, seven with new code and one with old code; a timeline from staged deployment beginning July 27 to activation everywhere at the market open on August 1; about 45 minutes, 4 million executions, over $460 million lost.](figures/10-knight-capital.svg)

The case shows that a flag should not be reused, that dead code should be deleted, that a machine check should confirm, before any flag moves, that every node is running a build that contains the flagged code, and that a rollback should not be improvised. The controls the SEC said could have prevented the event were a second person checking the deployment, monitoring of the warning messages, and a clear rule for when to disconnect.

### Dormant code activated everywhere at once

In June 2025 a Google Cloud outage came from code that had been rolled out region by region and never exercised, and was then triggered everywhere at once by a policy change. The staged deployment controlled where the binary was installed, and because the code was never executed during that deployment, the stages provided no evidence about it. Google's [incident report](https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW) says the code "did not have appropriate error handling nor was it feature flag protected", and commits that all changes to critical binaries will be "feature flag protected and disabled by default".

### Change types that bypass the ramp

Configuration, flags, reference data and operator scripts are changes too, and any of them that can reach every system at once carries the same risk as an unstaged release. CrowdStrike staged the rollout of its software but not of the content files the software reads. Its [analysis of the July 2024 outage](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) concludes that each such file "should be deployed in a staged rollout". Cloudflare's 2019 outage came through a channel for firewall rules whose procedure, [in Cloudflare's words](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/), "allowed a non-emergency rule change to go globally into production without a staged rollout". The same applies to the safety mechanisms themselves: the flag service, the configuration system and the rollback tooling are production systems that need their own staged rollout.

### Single-event migration without rollback

The opposite failure, a single large migration with no way back, remains the most expensive. TSB moved 5.2 million customers to a new platform over a single weekend in 2018, with testing cut short and no ability to roll back. It received 225,492 complaints and was fined £48.65 million by the FCA and the PRA together. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) found that fuller testing of the bank's two-data-center configuration would likely have found the fault, so the case argues for better testing as well as for smaller steps.

### Program-level failures

The overall effort can also stall without any single incident.

One cause is a pilot that never touches a money path. A team picks an internal reporting service because it is safe, declares success after two quarters, and has learned nothing about stored decisions, irrevocable payments or reconciliation.

A second cause is that shadow comparisons accumulate unread and stages pass on elapsed time.

A third is that the change board approves each ramp step as if it were a release, so that the ramp takes longer than the train did.

Finally, speed can become the goal. Deployment frequency is a symptom of small, safe changes, and when it becomes a target it is inflated with trivial deployments. The 2017 State of DevOps survey found that its lowest-performing group had [sped up and reported more failures](https://dora.dev/research/2017/2017-state-of-devops-report.pdf).

## Data and models

Many software changes are changes to data: a column split in an operational database, a new derivation in a reporting table, a feature recomputed for a model, or a model retrained on a different schema. These changes can also be released progressively, and the organizations that describe doing so include several that move money. The mechanics differ from those for code at almost every step, because rolling back the code that wrote a new version of a dataset does not bring the old version back.

### Differences between data and code changes

A code change can be ramped because each request is handled on its own and the previous build still exists. A data change alters stored state that outlives the process that wrote it. That state is read by jobs, tables, dashboards and models, many of which belong to other teams, and the effect of a bad change can go unnoticed for weeks. At Uber, an app experiment that was itself controlled by a flag changed how fares were logged, a fare component disappeared from a dataset that downstream consumers relied on, and a data scientist found the gap by hand 45 days later ([Uber](https://www.uber.com/blog/d3-an-automated-system-to-detect-data-drifts/)). Sculley and colleagues at Google traced this class of fault to the situation that arises "when the engineering ownership of the input signal is separate from the engineering ownership of the model that consumes it" ([Sculley et al.](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)).

A percentage ramp works for reads from an operational store and for traffic to a model, and Aircall moved reads to a new search cluster at 5%, 25%, 50% and 100% ([Aircall](https://aircall.io/en-gb/blog/tech-team-stories/elasticsearch-to-opensearch/)). A derived table cannot be ramped that way, because a table whose rows are 5% computed under a new derivation and 95% under the old one gives no reader a coherent answer. In the published accounts the thing that is ramped is a parallel copy of the data, a second stream job or a model, and exposure grows by consumer or by batch of jobs. Meta moved tens of thousands of ingestion jobs to a new system in batches ([Meta](https://engineering.fb.com/2026/05/12/data-infrastructure/migrating-data-ingestion-systems-at-meta-scale/)), and LinkedIn's consumers move between versions of a shared view when they choose to ([LinkedIn](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data)).

The main control for data is therefore a check before anything is published, together with a period in which the old and new versions are both available. Rollback exists for individual tables, where Iceberg moves a snapshot pointer and Delta Lake restores an earlier version, although Delta records a restore as a new commit ("Restore is considered a data-changing operation"), so streaming readers process the restored files again as if they were new data ([Delta Lake](https://docs.delta.io/latest/delta-utility.html)). Every table, feature and trained model built from the bad version keeps its contents until each is recomputed, and on Delta the files of an earlier version become eligible for deletion after seven days by default.

<!-- FIGURE: A source table feeding a chain of ten derived tables, a feature store and two models. A rollback arrow points at the source table only; the derived tables, features and models are shaded to show that they keep the bad data until recomputed. -->

### Versions as the unit of release

If both versions are to be available at once, each needs its own name. LinkedIn's Dali system exposes shared datasets as versioned views, and its engineers wrote that "multiple versions of the same View can happily coexist", across more than 300 views ([LinkedIn](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data)). Consumers then move to the new version before a deprecation date, which dbt records as a `deprecation_date` on each model version ([dbt](https://docs.getdbt.com/docs/mesh/govern/model-versions), vendor documentation).

The rule applies with more force to features, because a model learns the meaning of each input during training. Sculley and colleagues wrote in 2015 that "One common mitigation strategy for unstable data dependencies is to create a versioned copy of a given signal" ([Sculley et al.](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)). Chronon, the feature platform that Airbnb open-sourced and Stripe adopted, enforces the rule: "Once a groupBy is marked online, the compiler compile.py will prevent you from updating it", and its documentation recommends creating a `_v2` instead ([Chronon](https://chronon.ai/authoring_features/GroupBy.html)).

Each model is then bound to the exact versions of the data and features it was trained on. Feast's design note on feature versioning takes as its motivating case a model A that uses v1 features and a model B that uses v2 features, and it rejects a shared table with a version column because "a model trained against v1 of a feature must retrieve v1 rows, not v2 rows that happen to occupy the same table" ([Feast](https://feast.dev/blog/feature-view-versioning)).

A schema registry, a dbt contract or a compiler check will catch a renamed column or a changed type. A semantic change, in which the type stays the same and the meaning moves, has to be declared by its author as a new version, because none of these tools detects it. [LinkedIn's](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data) example is a time field that changes from seconds to milliseconds, and dbt's guidance lists changes to the logic, granularity or filters behind a metric as changes that may break consumers and that its contracts do not catch ([dbt](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-6-coordinate-versions), vendor documentation). Nubank wrote that "we rarely run into issues due to upstream data schema changes breaking analysis downstream", and described changes to upstream data values as the harder problem ([Nubank](https://building.nubank.com/microservices-at-nubank-an-overview/)).

The [2015 paper](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf) also named the running cost: "Versioning carries its own costs, however, such as potential staleness and the cost to maintain multiple versions of the same signal over time." Old versions accumulate as flags do, because removal waits for the last consumer and is done by hand, and Feast's design record notes that it has no mechanism to prune old versions ([Feast ADR-0008](https://docs.feast.dev/project/adr/adr-0008-feature-view-versioning)).

### Two versions of a column or table

Two versions of one column in an operational database is the best-documented case, and Stripe, Notion, Slack, Discord, Uber, LinkedIn, Figma, GitHub and the ledger company Noah each describe the same sequence in the first person. Ambler and Sadalage set it out in 2006 as a transition period during which the database supports both schemas, and warned that "Typical transition periods last for several quarters, if not years." when several applications share the database ([Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)). When one team owns every reader, the period can shrink to hours or weeks, an inference from comparing the recent accounts with the 2006 sources.

Whether to refactor the database first depends on which of two problems is in the way. Rewriting a large table without locking it is a physical problem, handled by online schema-change tools such as GitHub's gh-ost ([GitHub](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)). Making old and new code both correct against the same data is a logical problem, which requires every read and write to pass through one place where a flag can choose the target. Figma created Postgres views for each future shard on its still unsharded database, routed reads and writes through them with flags and percentage rollouts, and could roll back "within seconds by just rerouting traffic back to the main table" before any data had moved ([Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/)).

The steps, in the order the published accounts give them, are as follows.

1. Expand. Add the new column or table beside the old one, so that existing code ignores it ([GitLab](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)).
2. Keep both populated, with a database trigger, with application writes to both copies gated by a flag or percentage, or by replaying a change log. Stripe gradually raised the share of objects written to both stores while watching operational metrics ([Stripe](https://stripe.com/blog/online-migrations)), and Notion replayed changes from an audit-log table ([Notion](https://www.notion.com/blog/sharding-postgres-at-notion)).
3. Backfill historical rows, throttled against the health of the database. Notion's backfill took about three days on a 96-CPU machine and Discord's nine days ([Discord](https://discord.com/blog/how-discord-stores-trillions-of-messages)).
4. Compare reads while still returning the old result. [Notion](https://www.notion.com/blog/sharding-postgres-at-notion) called these dark reads and wrote that "Introducing dark reads increased API latency, but provided confidence that the switch-over would be seamless." Slack built a system that read both copies and reported differences ([Slack](https://slack.engineering/scaling-datastores-at-slack-with-vitess/)).
5. Switch reads by flag or percentage. Aircall moved reads at 5%, 25%, 50% and 100% for each cluster, and LinkedIn switched one customer at a time ([LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l)).
6. Make the new copy authoritative for writes, and keep a reverse sync if rollback is to remain possible. [Stripe](https://stripe.com/blog/online-migrations) reversed its write order, so that the new store was written first and changes were copied back to the old one. Stripe's document-database platform keeps replication running in both directions and reports that "The entire traffic switch protocol takes less than two seconds to execute" ([Stripe](https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations)).
7. Contract. Stop writing the old column and delete it once enough releases have passed. [GitLab](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/) drops a column over three releases, because Rails caches the column list at boot and "dropping a column is a destructive operation that can't be rolled back easily". Uber kept its old ledger store for about a month after writes to it stopped ([Uber](https://www.uber.com/blog/migrating-from-dynamodb-to-ledgerstore/)).

<!-- FIGURE: The seven steps as a timeline with two columns, old and new, showing for each step which copy is written, which is read, which is authoritative, and where the flag sits. -->

The flag that chooses the authoritative store needs stronger guarantees than an ordinary feature flag. Noah moved its ledger between two databases behind boolean flags, and because of caching and deployment timing, "different parts of the system occasionally had conflicting views of which ledger was active"; it replaced the flag with a timestamp set in the future, at which every service switched together ([Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger)). The other accounts use a routing token (Stripe), a write pause of a few tens of milliseconds (GitHub), or a scheduled maintenance window (Notion and LinkedIn).

Request-by-request comparison is limited to reads. GitHub states that "we only use Scientist on read operations.", because a candidate that wrote to the same database would corrupt it ([GitHub](https://github.blog/developer-skills/application-development/scientist/)). [Uber](https://www.uber.com/blog/schemaless-rewrite/) validated its read endpoints by running both implementations, covered writes with tests, and then moved write traffic by percentage.

Several published failures came from the migration machinery itself. On 27 November 2021, the final rename step of a schema migration on a large table put a significant portion of GitHub's read replicas into a deadlock and crash recovery, and core services were unavailable for 2 hours 50 minutes ([GitHub](https://github.blog/news-insights/company-news/github-availability-report-november-2021/)). GoCardless wrote that "we took around 15 seconds of unexpected API downtime during a planned database migration" when a foreign-key lock queued behind a long-running read ([GoCardless](https://gocardless.com/blog/zero-downtime-postgres-migrations-the-hard-parts/)). Aircall's backfill tool reported zero failures for a run that "would have silently overwritten 13.5M newer documents with stale copies" ([Aircall](https://aircall.io/en-gb/blog/tech-team-stories/elasticsearch-to-opensearch/)). [Notion's](https://www.notion.com/blog/sharding-postgres-at-notion) switch needed five minutes of scheduled maintenance, and [LinkedIn's](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l) old and new models did not map one to one, so "it is not practical to go back and forth between the two systems". GitHub writes that its schema migrations "often take weeks to complete", [Figma's](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/) first sharded table took about nine months, and [Slack's](https://slack.engineering/scaling-datastores-at-slack-with-vitess/) move to Vitess took "exactly three years" to carry 99% of its query load.

### Changing a table that has downstream dependents

Before a shared table changes, its owner needs a list of everything that reads it, including consumers that a lineage tool cannot see, such as notebooks, exports and feature pipelines in another system. LinkedIn built lineage and usage pipelines before a warehouse migration and used them to cut its scope from 1,424 datasets to 450, after an earlier attempt had left both warehouses running with "double the maintenance cost and complexity, along with very confused consumers" ([LinkedIn](https://engineering.linkedin.com/blog/2021/evolving-linkedin-s-analytics-tech-stack)).

The new version of each table is then written where consumers cannot see it, checked, and only afterward made visible. Netflix presented this as write-audit-publish in a 2017 talk, ["Whoops, The Numbers Are Wrong! Scaling Data Quality @ Netflix"](https://www.slideshare.net/slideshow/whoops-the-numbers-are-wrong-scaling-data-quality-netflix/77278406), Ryan Blue of Netflix built support for it into Apache Iceberg in 2019 ([Iceberg PR #342](https://github.com/apache/iceberg/pull/342)), and by 2023 Netflix's workflow scheduler offered it as a template ([Netflix](https://netflixtechblog.com/incremental-processing-using-netflix-maestro-and-apache-iceberg-b8ba072ddeeb)). Lyft built its own version, which stages data and promotes it only after a blocking check, after bad data "caused tainted experimentation metrics, inaccurate machine learning features, and flawed executive dashboards" ([Lyft](https://eng.lyft.com/from-big-data-to-better-data-ensuring-data-quality-with-verity-a996b49343f6)). On Iceberg, the audit happens on a branch and publishing moves a pointer ([Iceberg](https://iceberg.apache.org/docs/latest/branching/)). Open-source Delta Lake has no branches, so the documented route is a staging table or shallow clone, checks, and a write back into production ([Delta Lake](https://docs.delta.io/latest/delta-utility.html)). To make several tables visible at one commit point, Databricks supports a transaction across up to 100 tables, with an abort if a final check fails ([Databricks](https://docs.databricks.com/aws/en/transactions/), vendor documentation). A table restore cannot run inside such a transaction, so rollback after a joint publish still proceeds table by table.

<!-- FIGURE: Write-audit-publish for a chain of tables: v2 tables built in a staging area, checks run on each, then a single commit makes all of them visible; v1 tables remain readable throughout. -->

For a change that alters values on purpose, the v2 chain is built beside the v1 chain and the outputs are compared. Meta's 2026 account of moving tens of thousands of ingestion jobs is the most detailed. In the first phase, new jobs read the same source as the old ones and wrote to shadow tables, and the team compared row counts and checksums, landing latency and resource use. In the second phase, which Meta calls reverse shadow, the new job wrote the production table and the old job wrote the shadow table, so comparison continued and rollback did not require the old job to be recreated. Migration capacity was limited, so jobs moved in batches, and change data capture carried any problem in previously landed data forward into the new tables ([Meta](https://engineering.fb.com/2026/05/12/data-infrastructure/migrating-data-ingestion-systems-at-meta-scale/)).

A v2 table is of no use until its history has been rebuilt, and in a chain the rebuilds run in dependency order. Airbnb splits two years of history into 24 monthly batches that run in parallel, and wrote that "In practice, backfills often could not catch up with user changes, especially when updates affect many datasets" ([Airbnb](https://medium.com/airbnb-engineering/airbnb-metric-computation-with-minerva-part-2-9afe6695b486)).

Consumers then cut over one at a time, before the v1 deprecation date. Streaming consumers need particular care, because a plain Delta streaming source accepts only appends: "Structured Streaming does not handle input that is not an append and throws an exception if any modifications occur on the table being used as a source." ([Delta Lake](https://docs.delta.io/latest/delta-streaming.html)).

The dominant cost of a parallel chain is the backfill, with duplicate storage a smaller item, which is an inference from the Airbnb, Meta and Netflix accounts. Netflix reports that reprocessing a lookback window for late data costs almost X times as much, where X is the window's length in days ([Netflix](https://netflixtechblog.com/incremental-processing-using-netflix-maestro-and-apache-iceberg-b8ba072ddeeb)).

### Event streams

A schema registry rejects any new event schema that breaks the configured compatibility mode, and the mode fixes the order in which producers and consumers must upgrade. Confluent's documentation says that under BACKWARD compatibility teams should "upgrade all consumers before you start producing new events", that under FORWARD the producers go first, and that under FULL the two can be upgraded independently ([Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html), vendor documentation). BACKWARD is the default and checks a new version only against the one before it, so a consumer that replays from the start of a long-retention topic needs a transitive mode, which is an inference from the documented rule. Kafka Streams applications also read state and changelog topics that hold old-schema data, so "The Kafka Streams apps must be upgraded first, then it's safe to upgrade the upstream producer" ([Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html)).

The published practice for a breaking change is to forbid it or to fork it onto a new topic. LinkedIn's 2012 pipeline allowed only additive changes with a default value for each new field ([LinkedIn](http://sites.computer.org/debull/A12june/pipeline.pdf)), and [Shopify](https://shopify.engineering/capturing-every-change-shopify-sharded-monolith) avoids breaking schema changes wherever it can. Yelp's rule is that "Only compatible schemas can use the same topic.", so registering an incompatible schema creates a new topic automatically and consumers move to it on their own timeline ([Yelp](https://engineeringblog.yelp.com/2016/08/more-than-just-a-schema-store.html)). Each consumer must then switch without skipping data or processing it twice, which Confluent describes as complex ([Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/data-contracts.html), vendor documentation).

Jay Kreps described in 2014 a procedure for changing the logic of a stream job: "start a second instance of your stream processing job that starts processing from the beginning of the retained data", direct its output to a new table, switch the application to read that table once the second job has caught up, and then stop the old job and delete the old table ([Kreps](https://www.oreilly.com/radar/questioning-the-lambda-architecture/)). While both tables exist, reverting is a matter of pointing the application back at the old one. Kreps added that for important changes "you can control the cut-over with an automatic A/B test or bandit algorithm", which is the only published proposal found for an A/B test between two data outputs. A job can rebuild only from what the log still holds. Uber keeps Kafka data for only a few days, wrote that "Therefore, we're unable to adopt the Kappa architecture.", and runs the same streaming code against archived Hive data instead ([Fu and Soman](https://arxiv.org/pdf/2104.00087)). Wise keeps its original event streams in compacted topics so that a new job version can consume, for example, a year of data ([Wise](https://developer.confluent.io/podcast/running-hundreds-of-stream-processing-applications-with-apache-kafka-at-wise)), although compaction keeps only the latest value for each key ([Kafka](https://github.com/apache/kafka/blob/trunk/docs/design/design.md)).

<!-- FIGURE: Kreps's procedure: the log on the left, job v1 writing output table v1, job v2 started from offset 0 writing output table v2, the application's read pointer moving from v1 to v2, and v1 kept until v2 is trusted. -->

Grab published in 2026 the only first-person account of an automated shadow stage for stream jobs. A new version of a Flink job runs with a consumer group whose `-shadow` suffix lets it "consume a full copy of the data stream without interfering with the Main application", and writes to a shadow Kafka cluster with 8-hour retention ([Grab](https://engineering.grab.com/enchancing-flink-shadow-testing)). The shadow "runs for a configured period of 1 hour by default", and success is judged on job health, with message rates in the main and shadow sinks available for comparison. Grab built it because new versions sometimes could not resume from the old version's savepoint, which had caused about ten minutes of downtime before automatic rollback.

Stream state limits what can change in place, because Flink cannot evolve the schema of keys, and changing the input or output type of a window, join or aggregation prevents an upgrade ([Flink](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/upgrading/)). The Kafka Streams reset tool warns "This tool makes irreversible changes to your application." ([Kafka](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/app-reset-tool.md)), and a principal engineer at [Wise](https://developer.confluent.io/podcast/running-hundreds-of-stream-processing-applications-with-apache-kafka-at-wise) said in 2021 that "in the Kafka Streams right now, there is no way to roll back your state in a consistent manner".

Change data capture makes the source table's schema the event schema. Gunnar Morling, formerly Debezium's lead, summarized the risk as "Your table model becomes your API", and described an outbox table, written in the same database transaction as the business change, whose event contract evolves separately from the table ([Morling](https://www.morling.dev/blog/change-data-capture-breaks-encapsulation-does-it-though)). Without an outbox or a contracted republishing job, each step of an expand-and-contract change to the source column reaches every stream consumer, which is an inference from the same sources.

Rolling back a producer or a stream job affects only the events written afterward. Kafka's transactions give exactly-once processing only within Kafka, and a compacted topic keeps a bad value for a key until a newer value replaces it ([Kafka](https://github.com/apache/kafka/blob/trunk/docs/design/design.md)). Monzo, which writes that "it's only a matter of time before a partition contains a poison pill", moves events that keep failing to a dead-letter topic for each consumer group and replays them after the fix ([Monzo](https://monzo.com/blog/how-we-built-a-queue-on-top-of-kafka)). By inference from the compatibility rules, with no published incident to show it, rolling a producer back to an older schema is a new registration that can fail under BACKWARD, and a team that wants to roll producers and consumers back independently needs FULL compatibility.

### Feature stores

A feature store holds the inputs that models read, computed offline for training and served online at decision time, and it adds two requirements to versioning. The first is point-in-time correctness, under which a training row may use only events that preceded its timestamp ([Chronon](https://chronon.ai/authoring_features/Join.html)). Databricks states that "The point-in-time functionality in Databricks Feature Store is not related to Delta Lake time travel." ([Databricks](https://docs.databricks.com/aws/en/machine-learning/feature-store/time-series), vendor documentation), so a v2 feature table needs its history backfilled under the v2 logic before any model can be trained on it.

The second requirement is agreement between online and offline values, which failed at Google Play, where some features were always missing from serving logs and always present in training; an A/B experiment showed that removing this skew raised the install rate on the store's main landing page by 2% ([TFX](https://stevenwhang.com/tfx_paper.pdf)). Chronon measures the gap automatically, by logging a sample of online requests and responses, recomputing the same features offline, and reporting a mismatch rate, with the caveat that "While 100% consistency is desirable, it is not always possible." ([Chronon](https://chronon.ai/test_deploy_serve/Online_Offline_Consistency.html)). A v2 feature can therefore be materialized online with no model reading it and compared with its backfill, the feature-store equivalent of a dark launch. Stripe integrated this consistency monitoring for a SEPA fraud model with more than 200 features ([Stripe](https://stripe.com/blog/shepherd-how-stripe-adapted-chronon-to-scale-ml-feature-development)).

The alternative to a backfill is to log features at serving time and train on the logs. Google's Rules of ML recommends this as Rule #29 and reports that the YouTube home page switched to it with significant quality improvements ([Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)), and Uber Eats built a new training table from logged features beside its older ETL table ([Uber](https://www.uber.com/blog/taming-ml-firehose/)). Logging removes skew by construction and costs calendar time, since a model cannot be trained until enough history has accumulated ([Chronon README](https://raw.githubusercontent.com/airbnb/chronon/main/README.md)). A 90-day streaming aggregate needs 90 days of history before its v2 can be trusted, and since Kafka retention rarely covers that, the history comes from an archive and a batch backfill, which brings back the second code path; that is an inference from the retention limits described for streams.

<!-- FIGURE: Two routes to history for a v2 feature: backfill from the archive under v2 logic, followed by a consistency check, and logging at serving time in shadow, which is consistent by construction but needs weeks or months to accumulate. -->

The binding between a model and its features is held in the model's configuration or artifact. Databricks binds a logged model to table and feature names and documents no parameter for a table version, so v1 and v2 must exist as separate tables or views for as long as either model serves ([Databricks](https://docs.databricks.com/aws/en/machine-learning/feature-store/train-models-with-feature-store), vendor documentation). Uber allows a feature to be removed only when no model references it ([Uber](https://content.hopsworks.ai/hubfs/Feature%20Store%20Summit%202022/FS%20Summit%2022%20-%20Uber.pdf)), and DoorDash waits until a feature's usage has been zero for about 30 days ([InfoQ](https://www.infoq.com/presentations/fabricator-ml)).

### Releasing models

Shadow scoring is the most consistently documented first stage of a model release. Uber's prediction service runs shadow models on all or part of the primary model's traffic, usually for days or weeks, and fetches only the features the primary model does not already use ([Uber](https://www.uber.com/blog/continuous-integration-deployment-ml/)). Monzo writes that "we use shadow mode deployments extensively" ([Monzo](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack)), and its former machine-learning lead names fraud monitoring, with its low volume and high impact, as a case where shadow mode stands in for an A/B test ([Lathia](https://nlathia.github.io/2020/07/Shadow-mode-deployments.html)). Nubank runs fraud models in shadow ([Nubank](https://building.nu.com/practices-to-scale-machine-learning-operations/)) and advises "Deploy the model in shadow mode as early as possible" ([Nubank](https://building.nu.com/de-risking-real-time-ml-projects-addressing-common-failure-modes/)).

The flag or experiment selects a model, and the model's own configuration determines which features it fetches. LinkedIn's model registry records each artifact's dependencies on code and features, checks automatically "are all the features available both offline and online?", and ties deployment to the experimentation platform that LinkedIn uses for other product changes ([LinkedIn](https://www.linkedin.com/blog/engineering/machine-learning/scaling-machine-learning-productivity-at-linkedin)).

Booking.com published the design that keeps a comparison between two models fair. The control group "invokes and uses the output from model 1, the current baseline, and also works as a safety net". In both treatment arms "the outputs from both models are required", and each arm acts on one of them, so both carry the same computational load and latency drops out as a confounder. The analysis covers only the requests on which the models disagree ([Booking.com](https://doi.org/10.1145/3292500.3330744)). Computing both models in both treatment arms doubles inference and feature-fetching cost in those arms.

<!-- FIGURE: Booking.com's three-arm design: control runs model 1 only; T1 and T2 each compute models 1 and 2, T1 acts on model 1 and T2 on model 2; analysis restricted to requests where the models disagree. -->

Adyen's lifecycle runs from ghost, in which "we only log telemetries and statistics but we do not influence outcomes", to challenger, principal and retired. Every model runs on an experimentation service that compares several arms against one shared control group, which still receives a market baseline such as blocking cards known to be stolen, and a challenger replaces the principal when it performs better with statistical confidence ([Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)).

Google's ML Test Score requires that before a model affects real traffic, an automated system "must either bless the model or veto it", that models pass through a canary, and that "Models can be quickly and safely rolled back to a previous serving version" ([ML Test Score](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)). Uber's deployments roll back automatically to the last known good version when error rates, latency or utilization breach thresholds ([Uber](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)). Automated rollback in these accounts responds to a broken model, and the judgment that a model performs worse on business outcomes is made by people reading experiment results.

Booking.com, Stripe and Adyen describe hazards in model releases that have no close counterpart in code. For one of [Booking.com's](https://doi.org/10.1145/3292500.3330744) models the label arrives after the guest's stay, "which can be months later". A decision hides its own outcome: Stripe writes that payments its model scores above the threshold "are blocked, and so we can't know what their outcomes would have been" ([Stripe](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection)), and [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift) says the same of transactions it blocks for fraud. A deployed model also shapes the data its successor trains on, which Bottou and colleagues analysed as the training feedback loop ([Bottou et al.](https://jmlr.org/papers/v14/bottou13a.html)), so reverting a bad model leaves a training set labelled only where that model let outcomes be seen, an inference from the Stripe and Adyen statements. Tests lose power as models improve, because the rate at which a model and its successor disagree falls, and the exposed population with it. Across 23 comparisons involving 46 models, Booking.com found that offline gains correlated with business gains at a Pearson coefficient of -0.1, with a 90% confidence interval from -0.45 to 0.27, and concluded that "Offline model performance metrics are only a health check" ([Booking.com](https://doi.org/10.1145/3292500.3330744)).

### Worked example: from a source table to two models

In this example a payments firm's `transactions` table records a merchant as one free-text category, and the change replaces it with a merchant identifier and a category from a new code set. Ten lakehouse tables are derived from `transactions` through change data capture, and a feature, `merchant_risk_30d`, is computed from the last of them. Model A, a fraud model in production, was trained on the old category, model B is trained on features computed from the new one, and the two are to be served as an experiment.

No organization has published this chain run end to end as one progressive release. Each step in the list is documented by the organizations named with it, and running the steps in this order as one release is an inference assembled from those documented steps. Holds marked as judgment are the author's and come from no source.

1. Make the source change additive by adding `merchant_id` and `merchant_category_v2` beside the old column, following the seven-step recipe ([Stripe](https://stripe.com/blog/online-migrations), [GitLab](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)). If the table is published through an outbox, the event gains the new fields under a compatible schema version ([Morling](https://www.morling.dev/blog/change-data-capture-breaks-encapsulation-does-it-though)); if the event change is breaking, it goes to a new topic, as at [Yelp](https://engineeringblog.yelp.com/2016/08/more-than-just-a-schema-store.html).
2. Find every consumer of the ten tables through lineage and usage logs ([LinkedIn](https://engineering.linkedin.com/blog/2021/evolving-linkedin-s-analytics-tech-stack)), and make each owner a reviewer of the change ([Uber](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)). Tables that feed models go in the stricter review class that [Nubank](https://building.nubank.com/scaling-data-analytics-with-software-engineering-best-practices/) uses for model inputs.
3. Build v2 of each affected derived table beside v1 under versioned names, with a deprecation date for v1 ([LinkedIn](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data), [Airbnb](https://medium.com/airbnb-engineering/how-airbnb-achieved-metric-consistency-at-scale-f23cc53dea70)).
4. Backfill the v2 history in dependency order and in monthly batches ([Airbnb](https://medium.com/airbnb-engineering/how-airbnb-achieved-metric-consistency-at-scale-f23cc53dea70)), with effective dates on any logic that should not apply to earlier periods ([Beauchemin](https://maximebeauchemin.medium.com/functional-data-engineering-a-modern-paradigm-for-batch-data-processing-2327ec32c42a)).
5. Audit each v2 table before publishing it ([Netflix](https://www.slideshare.net/slideshow/whoops-the-numbers-are-wrong-scaling-data-quality-netflix/77278406), [Lyft](https://eng.lyft.com/from-big-data-to-better-data-ensuring-data-quality-with-verity-a996b49343f6)), and compare row counts and checksums with v1 on the columns the change should not touch ([Meta](https://engineering.fb.com/2026/05/12/data-infrastructure/migrating-data-ingestion-systems-at-meta-scale/)). Publishing all ten v2 tables at one commit point rests on vendor documentation alone ([Databricks](https://docs.databricks.com/aws/en/transactions/)).
6. Define `merchant_risk_30d_v2` as a new feature, backfill it with point-in-time joins, and materialize it online with no model reading it ([Chronon](https://chronon.ai/authoring_features/GroupBy.html)). Run the online-offline consistency job against it, as [Stripe](https://stripe.com/blog/shepherd-how-stripe-adapted-chronon-to-scale-ml-feature-development) did for its SEPA fraud model, and hold until the mismatch rate is stable across at least one month-end (judgment).
7. Train model B on v2 and retrain model A on v1 over the same date range, as Uber Eats did when it compared models trained on an old ETL table and a new logged table ([Uber](https://www.uber.com/blog/taming-ml-firehose/)). Bind each model to its own feature set ([Feast](https://feast.dev/blog/feature-view-versioning)), and check that every v2 feature is available both offline and online ([LinkedIn](https://www.linkedin.com/blog/engineering/machine-learning/scaling-machine-learning-productivity-at-linkedin)).
8. Shadow model B on live traffic, fetching only its extra features and logging its scores ([Uber](https://www.uber.com/blog/continuous-integration-deployment-ml/), [Nubank](https://building.nu.com/de-risking-real-time-ml-projects-addressing-common-failure-modes/), the ghost stage at [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)). Uber reports shadow periods of days or weeks; two weeks including a weekend and a payroll peak is a judgment.
9. Run the experiment with model A in control and two treatment arms that compute both models and act on one each, analysing the requests on which they disagree ([Booking.com](https://doi.org/10.1145/3292500.3330744)). The experiment platform assigns the model, the feature version follows from the model, and the model version is logged with every decision. The treatment share is capped so that a challenger with twice model A's fraud rate could not lift the firm's blended rate above its PSD2 reference rate (judgment).
10. Ramp model B with model A as the fallback, roll back automatically on error rate, latency and resource use as [Uber](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/) does, and decide promotion on the experiment readout once labels have matured (judgment).
11. Retire the v1 chain. Remove `merchant_risk_30d` once no model references it ([Uber](https://content.hopsworks.ai/hubfs/Feature%20Store%20Summit%202022/FS%20Summit%2022%20-%20Uber.pdf)) and its usage has been zero for about 30 days ([DoorDash](https://www.infoq.com/presentations/fabricator-ml)), retire the v1 tables after their deprecation date, and drop the old column from `transactions` over several releases ([GitLab](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)).

<!-- FIGURE: The worked example as a swimlane diagram with lanes for the operational table, the ten derived tables, the feature store, model A and model B; each of the eleven steps placed in its lane, with steps resting on vendor documentation or judgment shaded differently from documented ones. -->

A rollback at step 10 routes all traffic to the control arm, as [Booking.com](https://doi.org/10.1145/3292500.3330744) describes, and payments that model B declined in the meantime stay declined.

### Ownership of shared data

Each of these procedures assumes that someone knows who reads a table and someone has the authority to change it. Google's Rules of ML asks teams to "Give feature columns owners and documentation." ([Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)).

Data contracts put the producer under written obligation. Andrew Jones introduced them at GoCardless in 2021, and in an account on the blog of the monitoring vendor Monte Carlo he describes contracts that provision BigQuery and Pub/Sub resources when merged, with a change process that "is intentionally heavy" ([Jones](https://www.montecarlodata.com/blog-data-contracts/)). Adevinta Spain rules that "For any change, including schema changes, whether minor or major, a new contract version should be created", and automating pipelines from contracts cut its time to usable data from about five days to about 30 minutes ([Adevinta](https://adevinta.com/techblog/creating-source-aligned-data-products-in-adevinta-spain/)). Monzo, with more than 100 teams contributing to more than 12,000 dbt models, found that "A schema change here broke downstream models there." It made selected models interfaces, which a team declares as governed contracts for other teams, and enforces an explicit owner team and freshness tests on every pull request ([Monzo](https://monzo.com/blog/a-meshy-approach-to-data)).

Uber made ownership mandatory where it could not be inferred and made reviewers mandatory for schema changes, and for mobile analytics events producers and consumers can add themselves as reviewers ([Uber](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)). Nubank requires the dataset owner in structured metadata, requires integration tests to pass before a table is published or changed, and places tables that feed models in a stricter class with different expectations about who validates changes ([Nubank](https://building.nubank.com/scaling-data-analytics-with-software-engineering-best-practices/)). That is the only first-person rule found that raises the approval requirement because a model consumes a table, and it addresses the split between feature owners and model owners that Sculley identified.

LinkedIn deprecated datasets by identifying those with no dependencies and low usage, emailing their users, and locking, archiving and deleting them after a grace period whose length it does not give ([LinkedIn](https://engineering.linkedin.com/blog/2021/evolving-linkedin-s-analytics-tech-stack)). In the published accounts, data on-call takes the form of alerts routed to owners and subscribers. LinkedIn's Data Health Monitor watches about 150,000 critical datasets, emails more than 2,000 consumer subscriptions within roughly 30 minutes, and names email alert fatigue as its problem ([LinkedIn](https://engineering.linkedin.com/blog/2022/towards-data-quality-management-at-linkedin)).

LinkedIn's Super Tables are a deliberate counter-example to continuous change. The 2022 post starts from the observation that "Changes to the datasets or their sources are usually made without consulting with or even notifying all downstream consumers", and for its most widely shared tables LinkedIn adopted "committed change velocity (e.g., monthly deployment of changes)", a governing body that includes producers and consumers, an availability target above 99%, and a migration guide for the dozen tables and views each Super Table replaces ([LinkedIn](https://engineering.linkedin.com/blog/2022/super-tables--the-road-to-building-reliable-and-discoverable-dat)). Read alongside Monzo's interfaces, the case suggests a division in which changes inside a team stay small and frequent, while the interface between teams is versioned and paced for its consumers, and the producer bears the cost of the slower cadence; this reading is an inference from the two accounts.

No published source measures a reduction in incidents after contracts or mandatory ownership were introduced. The measured outcomes are delivery speed at Adevinta, alert latency at LinkedIn and detection coverage at Uber.

### Regulation of data and model changes

In the United States, SR 26-2, issued in April 2026, replaces SR 11-7 ([SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm)). Its attachment states that "Validation generally occurs prior to a model's first use.", and the words "parallel", "champion" and "challenger" do not appear in it ([SR 26-2 attachment](https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf)). The UK PRA's SS1/23 asks banks to compare development output "with the output of available challenger models" where practicable, and to compare output before and after a material change against actual outcomes, which it calls "parallel outcomes analysis" ([PRA SS1/23](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2023/ss123.pdf)).

BCBS 239 accepts more than one data model where there are "robust automated reconciliation procedures where multiple models are in use" ([BCBS 239](https://www.bis.org/publications/201301-guidelines-principles-effective-risk-data-aggregation-and-risk-reporting.pdf)), which is the closest any banking standard comes to accepting two schemas side by side. The ECB's 2024 guide on risk data aggregation expects "complete and up-to-date data lineages on data attribute level", automated quality controls with tolerances, and governance involvement in material changes, and names no deployment method ([ECB](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides240503_riskreporting.en.pdf)).

For internal ratings-based (IRB) capital models, Delegated Regulation 529/2014 requires notification at least two months before implementation for a "change of the data sources used in the process of allocating exposures to grades or pools or for parameter estimation" ([529/2014](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0529)), so swapping the upstream table under an IRB model is a notifiable change even if the numbers do not move. The ECB's guide to internal models expects a bank applying for a material change to replicate the model and the capital calculation in "a parallel version of a live production environment that is already in place" ([ECB](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guide_egim_202606.en.pdf)). The EBA's 2023 report states that the change framework "does not constrain the use of self-training and self-development model challengers" while the rating system used for capital is unchanged ([EBA](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Reports/2023/1061483/Follow-up%20report%20on%20machine%20learning%20for%20IRB%20models.pdf)), and its 2020 report describes an optional period in which a challenger "runs in parallel with the old system to enable a comparison of the results" ([EBA](https://www.eba.europa.eu/sites/default/documents/files/document_library/Final%20Report%20on%20Big%20Data%20and%20Advanced%20Analytics.pdf)).

The EU AI Act treats credit scoring of natural persons as high-risk, excluding systems used to detect financial fraud ([AI Act](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689)), and Regulation 2026/1744 moved those obligations to "2 December 2027" ([2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32026R1744)). A change that affects compliance and was not foreseen in the initial conformity assessment is a substantial modification and needs a new assessment, so a model retrained on a new upstream schema with redefined features is likely to need one unless the change plan foresaw it, which is an inference.

No EU text forbids serving two credit models to different applicants, and each applicant keeps the GDPR Article 22 rights of the subject of a solely automated decision, including human intervention ([GDPR](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679)). The CJEU held in SCHUFA that a credit score is such a decision where a lender "draws strongly on that probability value" ([SCHUFA](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62021CJ0634)), and from 20 November 2026 the Consumer Credit Directive entitles consumers to an explanation of the logic of an automated creditworthiness assessment ([CCD](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32023L2225)). The explanation has to describe the model that actually scored each applicant, so the model version must be logged with each decision, which is an inference.

For fraud models, the PSD2 standard on strong customer authentication lets a provider exempt low-risk remote transactions only while its fraud rate over a rolling 90 days stays at or below reference rates (for remote card payments, 0.13% up to EUR 100, 0.06% up to EUR 250 and 0.01% up to EUR 500), and a provider above the rate for two consecutive quarters "shall immediately cease to make use of the exemption" ([Delegated Regulation 2018/389](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R0389)). A challenger's fraud counts in the same provider-wide rate, so a worse challenger on a share of traffic puts the exemption at risk for every customer in that band, which is an inference.

The DORA standard on ICT risk management, whose change rules are covered under Change control and audit, adds one constraint specific to data. Its [Article 16](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1774) requires that "non-production environments only store anonymised, pseudonymised, or randomised production data", so an unanonymised clone of a production table used for validation elsewhere needs a derogation, and a shadow run in production may need the approval that Article 8 describes; both are inferences. Under the incident classification standard, an impact on the integrity of data is one criterion for a major incident ([RTS 2024/1772](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1772)).

Read together, and as an inference that no regulator states, these texts place validation before live use everywhere, and treat a parallel run that takes no decisions as expected (the ECB for IRB changes), as good practice (the EBA in 2020 and the PRA) or as unconstrained (the EBA in 2023), which makes a shadow run the stage that fits before sign-off. None of them defines or forbids a traffic-split experiment. A live challenger arm makes decisions, so it counts as use and needs prior validation, and in Europe it carries the customer rights, the PSD2 fraud-rate limit, the IRB notification period and DORA's change controls with it.

### What has not been documented

No published first-person account was found of the following:

- an A/B test in which treatment and control were served from different operational schema versions, with a business metric as the outcome
- the full chain in the worked example, from a source-table change to two models in an experiment, run as one release
- the retirement of an old chain of derived tables after its replacement went live
- mismatch counts from a large company's dual run of a schema change, or record-level comparison of two stream-job versions in production
- the compute and storage cost of running v1 and v2 chains in parallel, for tables, features or topics
- a standard notice period for a breaking data change, or a policy on who may change a feature that many models use
- a regulatory text that names parallel runs or dual writes for data pipelines, or that addresses A/B testing credit models on customers

## Applying the model to systems that move money

The techniques above were developed on consumer websites, where a bad release shows a user the wrong page. Payment and banking systems carry a different risk, because a bad release there can send the wrong payment. The following sections apply the techniques to those systems. The examples assume systems outside card processing, namely account-to-account payments, ledgers, settlement and batch.

Several properties of these systems constrain how the techniques apply. A payment that has been sent cannot be recalled by switching a flag off, and the clients are businesses with their own notice periods and sign-off. Batch and period-end processing cannot be sliced the way an online service can. Change control is audited, and the auditors test against a written policy.

## Worked example: moving payments to an instant rail

The change in this example moves outbound credit transfers below a threshold from the batch clearing rail, A, to the instant rail, B. The sections below follow it through both models.

The two rails differ in ways that raise the risk of the change. A payment on A can be pulled until the submission cut-off and settles a day or more later. A payment on B is final within seconds, at any hour, and can only be recovered by asking the beneficiary's bank to send it back. B also reaches only the banks that have joined it, has a limit per payment, and settles against a position that has to be funded in advance, weekends included.

### On the train

The change joins the next train, where the regression pack runs it against simulators for both rails. It passes a performance run, a batch cycle, the soak and the change board. Then, unless a per-client switch has been built specially, it is live for every client and every payment in scope.

If something is wrong with how real banks on B respond, the team learns it from all its clients at once, and what has been sent cannot be recalled. If the release is backed out, the payments already sent over B still need their inquiries and reconciliation handled on B.

### With deployment and release separated

The work starts with the design decision to pin the choice of rail to the payment. The rail is chosen once, when the payment is accepted, and written to the payment record. Inquiries, recalls and postings follow the stored rail for the life of the payment. A payment that times out on B is resolved by status inquiry and is not sent again, on either rail, while its outcome is unknown.

The change then goes through the stages below. The durations are a judgment about how long each stage's evidence takes to arrive, and a team with different rails or volumes would set them differently.

**1. Dark.** The code ships disabled. The build bakes on one node per site through a daily peak, and end-of-day runs the new code on its smallest partition first. The check at this stage is that the disabled path behaves identically to yesterday's build.

**2. Shadow.** For all traffic, the new rule records the rail it would choose, the reachability and limit checks behind that choice, and the message it would build, and sends nothing. The recorded choices are compared with an independently written statement of the rule. This stage is held for at least seven days, timed to include a weekend and a payroll peak, and it stops on any mismatch nobody can explain.

**3. Synthetic client.** Test accounts in production send small real payments over B to accounts the firm keeps at other banks. They go through acceptance, rejection, an injected timeout resolved by status inquiry, a recall request and reconciliation. The flag is switched off mid-stream as a rehearsal. This stage runs for two business days and a weekend.

**4. One consenting client.** The rule is enabled for one payment type, with a low cap per payment and per day. The team watches rejection rates by reason code, time to confirmation, unknown outcomes, the prefunded position, and breaks in both its own reconciliation and the client's. This stage runs for five business days and the weekend they span, and it stops on any duplicate, any reconciliation break, or any outcome still unknown after an hour.

**5. Widen.** The rollout adds more clients first and then raises the cap, and no single step does both. Each step is held for a full reconciliation cycle, and one of them is held across a month-end.

Together the stages take four to eight weeks from first deployment to full release.

### Effect of switching the flag off

Switching the flag off sends new payments back to A from its next submission window and recalls none of the payments already sent on B. Those payments are final, so the exposure is bounded by the caps: the daily cap multiplied by the number of clients enabled and by the number of days a fault goes unnoticed. The shadow run shows only what would be sent, which leaves the cap as the control that limits the damage.

Switching off after A's last cut-off of the day also means those payments wait until the next business day, which the client will notice.

### Likely failures at each stage

Each stage has a characteristic failure that can be planned for. In shadow, nobody owns the mismatch report, and the stage passes because seven days have gone by. At the synthetic client, a Saturday payment posts to Monday's business date and breaks the settlement-account reconciliation. With the first real client, the fault may be on the client's side, such as a treasury system that expected next-day value. When widening, a second ramp starts on the same settlement account, and a reconciliation break can no longer be traced to either.

### Comparing the two

Separating deployment from release delivers the routing change to every client a month or more later than the train would. In exchange, the engineer has evidence from production the day after writing the code, no client meets an unproven rule, and every other change written in those weeks ships without waiting.

## Prerequisites

None of this is safe on a payment path until the following are in place, in rough order:

- Observability by client and by build. A ramp can be judged only if acceptance rate, rejections by reason code, timeouts and time to confirmation are visible for one client on one build, within minutes. Infrastructure dashboards and a daily operations report do not provide that view, and building it often takes months.
- Build once. One artifact, identified by its hash, is promoted unchanged through every environment, and deployment is automated for code, configuration and reference data alike.

- Compatibility between adjacent builds. With daily deployment and a bake, production runs two versions every day of the year, on the same queues and the same tables. Every message, record and file written by today's build has to be readable by yesterday's. The pipeline should prove that on every build with a mixed-version test, because without it rollback cannot be relied on.
- Expand and contract for schema changes. Add the new structure, write both ways, backfill, compare, switch reads, and only then remove the old one. The expand steps can ship daily, while the final removal is irreversible and belongs on a fixed date with a rehearsal.

- Idempotency end to end. Daily restarts, rollbacks and flag changes in mid-flight cause retries and redelivery, and every payment instruction needs a key that survives them. Stripe's post on [idempotency](https://stripe.com/blog/idempotency) introduces the reasoning. In the worked example the key has to be checked before the rail is chosen, because neither rail's own duplicate check can see a payment that went out on the other.
- Decisions pinned to the transaction. Each decision is evaluated once at acceptance and stored, and every later step follows the stored value.

- A flag service fit for the payment path. It evaluates locally, with no network call per payment, and falls back to the last known value on failure. Its state is consistent across sites, and changes are audited, made under dual control, and themselves rolled out a site at a time, because a flag change is an instant change to the whole fleet with no bake. It does not depend on anything it might be asked to switch off.
- A client of your own in production. This is a fully onboarded synthetic client, with real accounts at other institutions and real connectivity to every rail, that takes every ramp first. Agreeing with finance how to keep its postings out of financial and regulatory reporting takes longer than building it.

- Rehearsed ways back. Flag off, traffic shift and artifact rollback are each rehearsed, and each has a written rule for when not to use it.

The effort of adoption goes into building these prerequisites. Monzo wrote that for automated rollback, ["migration and tooling work was >90% of the effort"](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale). The paper on Facebook and OANDA reports that Facebook had about 5% of its engineers working on tooling and OANDA 15%, and that OANDA spent two years perfecting continuous deployment for its mission-critical systems.

## Changes that should not be ramped

Some changes do not fit this model, and a team should list them as part of the design so that they are not discovered one at a time.

### Batch and period ends

End-of-day runs once over the whole book and cannot be sliced by node the way an online service can. The same idea can be applied to batch in the following ways.

- Partition the batch by legal entity, client or book, and run the new code on the smallest partition for a cycle before the rest.
- Run the new code in parallel against the same input, with postings and outbound files suppressed, and compare its output with the batch of record, which amounts to a shadow run for batch.
- For jobs that only run at a period end, run them every night in pre-production against a production-sized copy with the business date advanced to the boundary, so that month-end has been exercised thirty times before it occurs in production.

Period-end behavior is the least well documented area in the published material on this subject. The research for this article found no published account, from a firm that deploys continuously, of how it validates changes to interest, statement or settlement jobs before the boundary arrives. The techniques listed here are the best available answer, and code that runs only at a period end remains unproven until its output has been compared across one. A three-day soak does not cover period-end behavior either, since most three-day windows contain no month-end.

### Changes that stay on a date

The following kinds of change should go out whole, on a date agreed in advance.

- Anything a client or counterparty can see in an interface: message formats, file layouts, cut-off times. The worked example changes what a client sees, in debit time and value date, which is why it needs the client's consent and an agreed start.
- Scheme and rulebook changes, which take effect on the scheme's date. The code can ship dark weeks ahead and be certified in the scheme's test environment, but activation is for everyone at once and has to be rehearsed that way.
- The final, irreversible step of a schema change, which gets a rehearsal on a production-sized copy.
- New settlement and regulatory files, since a file goes to a counterparty whole, at a cut-off, and cannot go to 1% of them. The method is to generate old and new in parallel through several cycles, including a period end, and compare.
- Cut-overs that counterparties have to make together. The Bank of England's renewal of its settlement system was [delivered in stages that could each stand alone](https://www.nao.org.uk/wp-content/uploads/2025/12/the-bank-of-englands-real-time-gross-settlement-system-renewal-programme.pdf), but the core switch had to happen over one weekend because the old and new systems could not run side by side.

### Shared components

Per-client ramping only isolates what is partitioned per client. The scheme gateway, the message broker, the ledger posting engine and the batch scheduler serve everyone, so a change to one of them reaches every client as soon as it is live.

For these, pick another axis: one payment type or amount band, one batch partition, or one node where nodes share no state. Where no axis exists, keep the change on a dated release with a rehearsal. The longer-term fix is an architectural one, partitioning the shared component so that later changes can be ramped.

### One ramp at a time per signal

The results of a ramp can be attributed to it only while nothing else has changed. If two ramps touch the same settlement account in the same day and the daily reconciliation breaks, the team has to work out which change was responsible, as it did with the train.

A workable rule is one ramp in flight per reconciliation domain per cycle, a small limit on money-path ramps across the platform, and no ramp steps in the last few business days of a month.

## Correctness controls

Switching a flag off changes how later payments are handled and leaves payments already sent as they are. Kent Beck, writing about Facebook's habit of making decisions reversible, [set money aside explicitly](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility): "Decisions affecting people's privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible."

Firms that move money accept that constraint. Their effort goes into establishing whether new code is correct before it is allowed to move anything, and into detecting quickly when it is not.

Reconciliation is used as a test that runs continuously in production. Monzo runs [coherence checks](https://monzo.com/blog/2022/02/08/processing-payments-safely-at-scale) over payments in production and reconciles its ledger against settlement daily. Stripe reports that ["99.99% of our dollar volume is fully ingested and verified within four days"](https://stripe.dev/blog/ledger-stripe-system-for-tracking-and-validating-money-movement). Reconciliation signals arrive more slowly than an error rate, and they set the length of a ramp stage. A change that affects settlement should hold at small exposure for at least one reconciliation cycle before it widens.

An append-only ledger also helps, because it keeps an error visible and its correction auditable. Square describes its ledger as ["effectively append-only and immutable once stored"](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/), with mistakes corrected by a new entry and never erased.

For anything irrevocable, the amount cap is the control, because it makes the maximum possible loss a known quantity.

For a migration, keep the new path non-authoritative while its results are compared with the old one's, as Stripe, Square and GitHub did. Agreement is counted in records, and the comparison continues until enough records have been counted.

## Change control and audit

A common objection is that auditors and regulators require the existing process. That objection needs two answers, because what the rules require and what a firm's own policy requires are different documents.

### What the rules require

The rules that apply to this kind of system include the US examiners' handbook, Singapore's [technology risk guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf) and, in the EU, the [Digital Operational Resilience Act](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2554) (DORA), which has applied since January 17, 2025, together with its [technical standards on ICT risk management](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774). They ask for broadly the same things:

- a record of every change
- testing in proportion to the risk
- approval by someone with authority who is not the author
- segregation of duties
- separation of production from development
- a way back
- an audit trail

None of them asks for a soak period, a release train, or promotion over several days, and none mentions canaries, feature flags or staged rollouts. The EU standards apply ["regardless of the ICT project management methodology chosen by the financial entity"](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774). Some texts ask for more than the list above: Singapore's guidelines expect a change advisory board and signed-off test results, and Singapore and the US handbook both expect quality assurance that is independent of development. Notes on individual jurisdictions are in the appendix.

### Constraints that shape the design

Four provisions in the EU standards affect how the model in this article has to be built, and comparable expectations appear elsewhere.

Approval has to be independent. [Article 17(1)(b)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) requires "mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes". The standards do not define a function, and BaFin notes in its [guidance on DORA](https://www.bafin.de/SharedDocs/Downloads/EN/Anlage/dl_2024_07_08_Aufsichtsmitteilung_Umsetzungshinweise_DORA_en.pdf?__blob=publicationFile&v=3) that the provision "does not describe or require the implementation of a concrete process". A reasonable reading, which no supervisor has confirmed, is that an approver who neither requested nor wrote the change satisfies it, with the pipeline as the implementer.

Testing in production is an approved exception. [Article 8(2)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) permits it only where the instances "are clearly identified, reasoned, are for limited periods of time," and are "approved by the relevant function", and Article 16 restricts the use of production data outside production. No supervisor has said whether a canary or a ramp step counts as testing in production. A firm can document each change as tested before deployment and treat the ramp as the managed transition that Article 17(1)(c) asks for, or it can record each ramp as an approved instance under Article 8(2); the change policy should say which.

Every change is in scope. The standards cover "all changes to software, hardware, firmware components, systems, or security parameters", with no threshold of materiality, so a flag change in production is a change.

A way back is required, and emergencies are provided for. Change procedures must include "procedures and responsibilities for aborting changes or recovering from changes not successfully implemented" (Article 17(1)(e)), error handling must include "rollback" (Article 8(2)(c)(iii)), and emergency changes may be approved "after their implementation" (Article 17(1)(g)). A kill switch, abort criteria fixed in the ramp plan and a rehearsed rollback map directly onto these provisions.

### What auditors test

Auditors do not test a firm against the rule texts. They test it against its own change policy, its control descriptions and its client contracts, and those documents describe the train. The work is therefore to rewrite the policy, with risk and audit as co-authors from the start. Published accounts from regulated firms follow a consistent pattern.

- Authorization is a reviewer other than the author, enforced by the pipeline. Monzo describes a policy that requires [at least one other person to review every change](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform).
- Segregation is the absence of standing human access to production, with the pipeline as the only way in. A Capital One technology governance director [wrote about this arrangement](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/), and the company's pipeline has [sixteen gates](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/), among them an automated change order and automated rollback. BaFin's 2024 [notice on cloud outsourcing](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/Aufsichtsmitteilung/dl_2024_02_01_Aenderung_Orientierungshilfe_Cloud.pdf?__blob=publicationFile&v=4) likewise accepts that CI/CD pipelines and automated tests can support segregation of duties, with manual review still needed on a risk basis.
- Evidence is an immutable log that ties commit, review, test results and deployment together.
- Exceptions are break-glass access with alerts and a review afterwards.

Starling Bank kept its human gates and still releases daily. In 2025 it [required three approvals for every release](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), the last of them a business approval from an engineering lead, director or executive, and was releasing several times a day.

### Flag changes are changes

A workable classification for flags is as follows.

- The code that introduces a flag goes through normal review and deployment.
- The ramp plan, with its stages, holds, population, caps and stop conditions, is approved once.
- Each step within the plan is a standard change, executed under dual control and logged. A step outside the plan is a normal change.
- Switching a flag off, and rolling back to the previous build, are pre-authorized. The on-call engineer can do either without asking, and the action is reviewed afterwards.
- The state of every flag on any given date can be produced as evidence.

Classification can fail in either direction. If every ramp step is raised as a normal change with three days' notice, the ramp becomes slower than the train was. If the criteria for pre-approval are loose, risky changes pass through the simplified route, which Norway's supervisor warned about in its [2026 risk report](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026).

### What supervisors report

Supervisors' own data supports smaller changes. The UK FCA's review found smaller, more frequent releases succeeding more often. The ECB has reported [since 2023](https://www.bankingsupervision.europa.eu/press/publications/newsletter/2023/html/ssm.nl231115.en.html) that IT changes are a leading cause of downtime of critical services, and in 2024 described them as ["still by far the most important reason for downtime"](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/annex/ssm.nl241113_4_annex.en.pdf). A member of its Supervisory Board [wrote in 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html) that "38% of the major incidents reported by banks in 2025 had 'IT change' as their root cause", and the ECB's [priorities for 2026 to 2028](https://www.bankingsupervision.europa.eu/framework/priorities/pdf/ssm.supervisory_priorities202511.en.pdf) include a targeted review of ICT change management.

Supervisors' instinct after an incident nevertheless runs toward less change, and some of their assessment tools assume the traditional process. After a series of outages at DBS in 2023, Singapore's regulator [directed the bank to suspend changes to its IT systems](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs) for six months, apart from those needed for security, regulatory compliance and risk management. The ECB's [IT risk questionnaire](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf) asks whether significant changes are approved by a dedicated management committee and deployed only by authorized production teams. A bank that deploys through a pipeline should expect to explain how the pipeline fills that role. The argument that works with a supervisor is failure rate and reach per change, with evidence.

The research found no published account of what an examiner or external auditor concluded about a process like this.

## Risk trade-offs

The model retires some risks and introduces others, and the table below sets them side by side with their controls.

| Risk retired or reduced | Risk taken on | What controls it |
| --- | --- | --- |
| A large bundle fails and the cause is hard to find | A flag is left in place, reused or forgotten | An owner and expiry date on every flag, enforced by the build; never reuse |
| Every client meets a new behavior in the same instant | Clients run different behavior at the same time | A cap on live flags per service; one ramp per reconciliation domain at a time |
| A back-out plan is first used during an incident | A rollback meets data the old build cannot read | Mixed-version tests on every build; a rollback rehearsal every month |
| A fault waits five days for its fix | A flag is switched on before the deployment is complete | A machine check, before any flag moves, that every node runs a build containing the flagged code |
| Changes pile up behind a soak | A flag change reaches the whole fleet instantly | Flag changes rolled out a site at a time, under dual control |

## Evidence

The published evidence supports some parts of this case and is absent for others.

The well-supported part is that small, frequent, carefully exposed change is compatible with the stability a financial firm needs. The FCA's review found smaller, more frequent releases succeeding more often. Between 2008 and 2014 Facebook's developers grew roughly twentyfold and its deployments with them, and [the paper on Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) reports that "the number of critical issues arising from deployments was almost constant regardless of the number of deployments". One group at the Financial Times went from about twelve releases a year, of which one or two failed, to about 2,500 in 2017 with, by its own count, fewer than 25 failures.

The record also supports a second claim, that heavy external approval does not improve stability, although the support consists of surveys and associations and includes no experiments. The State of DevOps surveys found in 2014 and again in 2019 that external change approval slowed delivery with no measurable benefit to stability, and the FCA's finding about change boards points the same way.

No bank or payments firm that left a release train has published a before-and-after incident record. The firms that describe releasing many times a day while moving money, Monzo and Starling among them, were built new. No account was found from a firm with a mainframe core of how it made the transition. No published figure was found for how many faults a soak catches per day of waiting, or how many a canary catches.

The published record therefore supports the claim that this approach works and is safe when done completely. It cannot show whether the approach would improve a particular firm's numbers, which only that firm's own trial can establish.

## What should change

The argument reduces to the following changes in practice.

1. Deploy small changes every day, with new behavior disabled by default.
2. Release each behavior separately: to no one first, then in a shadow run, then to a small named group, then to everyone.
3. Move the soak into production as a bake at limited exposure, and keep a pre-production hold only for changes that cannot be ramped.
4. Make rollback routine. Restore a retained build, rehearse the procedure, and allow on-call engineers to execute it without prior approval.
5. Make the author of a change responsible for its flag, its ramp plan and the removal of the flag afterward.
6. Make the team that writes a service responsible for deploying and operating it.
7. Move approval from scheduled meetings to peer review, pipeline evidence and pre-authorized change types, defined jointly with risk and audit.
8. Treat flags, configuration and reference data as changes, and stage them as code is staged.
9. For data and models, release new versions beside old ones: publish tables only after checks pass, give every changed feature a new version, bind each model to the data versions it was trained on, and shadow a model before it makes decisions.

The changes depend on one another, and the failures described earlier came from adopting some of them without the others.

## Getting started

This work can begin while the train keeps running, and the most useful first steps run alongside it.

### Measure the current process

The following questions settle most arguments about whether there is anything to gain.

1. Of the three days, how many hours are work, and how many are waiting for an environment, a window or a person?
2. What did the soak catch in the last year, by class of fault, and what reached production in spite of it?
3. How many changes were in the train behind each of the last five incidents, and how long did it take to find the one responsible?
4. How many changes did the change board reject or send back last year?
5. How long did the last real rollback take, who authorized it, and had that path been rehearsed?
6. How do hotfixes, which skip most of the three days, compare with trains in failure rate?

If the soak proves to catch faults that nothing else would, and most of the three days prove to be work, there is less to gain than argued here, which is itself a useful result.

### Put the existing process in a pipeline

Encode today's process in a pipeline, manual approvals included, as Amazon did. Doing so removes no control, produces the record that auditors ask for on every change, and shows where the waiting is.

### Pick one service that moves money

Choose a service the team owns outright, with no vendor package or mainframe component in its path, and that moves real money at low value. A reporting service would be safer, but it would not exercise stored decisions, irrevocable payments or reconciliation.

Agree its change policy with risk and audit before any code moves, with dark deployment, shadow runs, flag steps and rollback as defined kinds of change. For a firm under DORA, the policy should also state whether any stage counts as testing in production, and record any that does as an identified, reasoned, time-limited and approved instance. Find one client willing to go first, and build the prerequisites for that one service.

### Define stop conditions in advance

Reasonable stop conditions are any loss of client money, any reconciliation break traced to a ramp, or six answers at the end of two quarters that are no better than the baseline. In that last case the cost was a small team's time, and the firm knows what its three days buy.

### Expand gradually

The firms that got furthest did it in bounded steps over years and kept what worked. A firm can likewise keep its train until the evidence from its own systems says it can be retired. Amazon still has pre-production stages and deployment windows, and Google still runs release trains for some products.

## Further reading

The following sources are particularly useful.

- Clare Liguori, [Automating safe, hands-off deployments](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/). The most complete description of a production pipeline with bake times.
- The FCA's [Implementing technology change](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change). A regulator's data on what makes changes fail.
- Savor et al., [Continuous Deployment at Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf). Includes a trading firm and its bank clients.
- Brian Harry, [A Rough Patch](https://devblogs.microsoft.com/bharry/a-rough-patch/). A detailed account of a public outage caused by flags.
- The SEC's order on [Knight Capital](https://www.sec.gov/litigation/admin/2013/34-70694.pdf). The primary source for the incident.

The research notes behind this article, with a source-by-source record of what was read and how, are in [research_notes](research_notes/Testing%20gates%20to%20ramping%20culture/) and [the synthesis report](reports/Testing%20gates%20to%20ramping%20culture.md). The stage durations, prerequisites and controls in this article reflect judgment and are not taken from the cited sources.

## Appendix: regulatory notes by jurisdiction

These notes support the section on change control and audit. They summarize what each text says about change management; they are not legal advice, and they reflect the texts as read in November 2026.

### European Union

- DORA, [Regulation (EU) 2022/2554](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2554), applies from January 17, 2025. Its technical standards on ICT risk management, [Delegated Regulation (EU) 2024/1774](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774), contain the change-management requirements: independent approval (Article 17(1)(b)), fall-back and aborting changes (Article 17(1)(e)), emergency changes approved after implementation (Article 17(1)(g)), separation of production from development and testing in production as an approved, time-limited exception (Article 8(2)), rollback in error handling (Article 8(2)(c)(iii)), and restrictions on production data in non-production environments (Article 16). Smaller entities follow a simplified framework (Article 38) without the independence clause.
- The EBA's [guidelines on ICT and security risk management](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Guidelines/2020/GLs%20on%20ICT%20and%20security%20risk%20management/872936/Final%20draft%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf) set change-management expectations from 2020. The EBA [deleted that section](https://eba.europa.eu/sites/default/files/2026-05/c8fb6168-0aef-42f6-8da9-114a8baf21b9/Consolidated%20version%20of%20EBA%20ameding%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf) for firms within DORA's scope from May 20, 2025.
- Under DORA's incident rules, [Delegated Regulation (EU) 2024/1772](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1772), an incident affecting critical services is major when it meets two or more thresholds, among them more than 10% or more than 100,000 of the clients using the service and more than two hours of downtime for a service supporting critical or important functions. Recurring incidents with the same root cause within six months are aggregated. A defect caught at a small ramp stage may stay below these thresholds; no supervisor has addressed this.
- For algorithmic trading, [RTS 6](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0589) requires predefined limits before an algorithm is deployed (Article 8), immediate "kill functionality" (Article 12) and a person designated by senior management to authorize deployment (Article 5(2)).
- The [Instant Payments Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R0886) requires instant credit transfers to be receivable "24 hours a day and on any calendar day", with penalties waived only for short, foreseeable, pre-announced maintenance.

### European Central Bank

- The ECB has reported [since 2023](https://www.bankingsupervision.europa.eu/press/publications/newsletter/2023/html/ssm.nl231115.en.html) that IT changes are a leading cause of downtime of critical services. Its [2026 to 2028 priorities](https://www.bankingsupervision.europa.eu/framework/priorities/pdf/ssm.supervisory_priorities202511.en.pdf) include a targeted review of ICT change management.
- Its [IT risk questionnaire](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf) asks whether significant changes are approved by a dedicated management committee, whether deployment is performed only by authorized production teams after formal approval, and whether a release management team exists. Its [2020 methodology report](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.aroutcomesrepitriskquestionnaire202007~9ed9aaa17d.en.pdf) scores the inherent risk of IT change by the frequency of changes to critical systems.
- A July 2026 [letter on AI-enabled cyber threats](https://www.bankingsupervision.europa.eu/press/letterstobanks/shared/pdf/2026/ssm.2026_letter_on_AI_enabled_cybersecurity_threats.en.pdf) refers to change management that enables "rapid, risk-based remediation while maintaining operational stability", in the context of patching.

### Germany

- BaFin's circular on bank IT, [BAIT](https://www.bafin.de/SharedDocs/Downloads/EN/Rundschreiben/dl_rs_1710_ba_BAIT_en.pdf?__blob=publicationFile&v=6), expected testers independent of developers, acceptance tests by business units and plans for reverting to an earlier version, and allowed lighter process rules for low-risk configuration and parameter changes. BaFin [removed banks within DORA's scope](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/dl_250110_Informationsschreiben.pdf?__blob=publicationFile&v=1) from BAIT with effect from January 17, 2025, and BAIT lapses entirely at the end of 2026.
- BaFin's [guidance on DORA](https://www.bafin.de/SharedDocs/Downloads/EN/Anlage/dl_2024_07_08_Aufsichtsmitteilung_Umsetzungshinweise_DORA_en.pdf?__blob=publicationFile&v=3) states that the change-management article "does not describe or require the implementation of a concrete process".
- BaFin's 2024 [notice on cloud outsourcing](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/Aufsichtsmitteilung/dl_2024_02_01_Aenderung_Orientierungshilfe_Cloud.pdf?__blob=publicationFile&v=4) accepts CI/CD pipelines and automated tests as partial support for segregation of duties.

### Other European supervisors

- France: the ACPR's 2021 notice on ICT risk accepts agile methods and automated change processes provided they do not reduce control.
- Italy: the Bank of Italy's [Circular 285](https://www.dirittobancario.it/wp-content/uploads/2022/11/Circolare-Banca-dItalia-n.-285-del-17-dicembre-2013-Aggiornamento-n.-40-del-2-novembre-2022.pdf) placed ICT change under a unit independent of development until its [51st update](https://www.dirittobancario.it/wp-content/uploads/2026/02/Atto-di-emanazione-del-51mo-aggiornamento-Banca-dItalia-03-febbraio-2026.pdf) of February 2026 repealed those sections in favor of DORA.
- Netherlands: the Dutch central bank's [good practice for 2019 and 2020](https://www.dnb.nl/media/yffn1wji/good-practice-ib-2019-2020.pdf) lists a change advisory board among its examples, alongside change processes based on ITIL, Agile or Scrum.
- Sweden: Finansinspektionen [fined Swedbank SEK 850 million](https://fi.se/en/published/news/2023/20232/swedbank-receives-a-remark-and-an-administrative-fine) in March 2023 for a 2022 change made "without following internal procedures", which left almost one million customers with incorrect balances.
- Norway: Finanstilsynet's [2026 risk report](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026) traces many of the 313 ICT incidents reported in 2025 to changes, and warns about loose criteria for pre-approved changes.
- Switzerland: [FINMA's circular on operational risks](https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/rundschreiben/finma-rs-2023-01-20221207.pdf) requires separate development and test environments and testing based on criticality.

### Singapore, the United Kingdom and the United States

- Singapore's [technology risk guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf) expect a change advisory board, signed-off test results and independent quality assurance. After outages in 2023, the regulator [suspended non-essential IT changes at DBS](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs) for six months.
- The UK FCA's [review of technology change](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) is discussed in the body.
- The US [FFIEC examiners' handbook](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf) describes canary releases and frequent deployment, and expects quality assurance independent of development.

## Appendix: tool support for data changes

Each table lists the tools that support one step of the workflow for data changes, with versions, limits, retention defaults and release status as of November 2026. Material from Databricks, Confluent, lakeFS, Tecton, Hopsworks, AWS, Google Cloud and the pgroll project is the vendor's own documentation and is marked "vendor documentation" in the source column. Apache Iceberg, Delta Lake, Kafka, Flink, Spark, Debezium, Chronon, Feast and MLflow material is open-source project documentation.

### Publishing a table only after checks pass

| Tool | How it supports the step | Version and status | Limits | Source |
| --- | --- | --- | --- | --- |
| Apache Iceberg write-audit-publish | `write.wap.enabled` with `spark.wap.id` stages a snapshot without making it current; `spark.wap.branch` writes to an audit branch, and the `fast_forward` procedure publishes it | WAP identifiers since 2019 ([PR #342](https://github.com/apache/iceberg/pull/342)); branches in current releases | `publish_changes` and `cherrypick_snapshot` work only for append and dynamic-overwrite snapshots | [Iceberg branching](https://iceberg.apache.org/docs/latest/branching/), [procedures](https://iceberg.apache.org/docs/latest/spark-procedures/) |
| Delta Lake (open source) | No native write-audit-publish, because the protocol has no branches or named tags. The documented pattern is a staging table or shallow clone, checks, then MERGE, INSERT or `replaceWhere` back into the production table | Releases up to 4.4.1 (5 October 2026). Branching with write-audit-publish exists only as protocol RFC #7439 (August 2026), not accepted ([issue](https://github.com/delta-io/delta/issues/7439)) | Publishing rewrites or re-commits data instead of moving a pointer, so its cost grows with the data changed | [Delta utilities](https://docs.delta.io/latest/delta-utility.html), [protocol](https://github.com/delta-io/delta/blob/master/PROTOCOL.md) |
| Delta Lake constraints | `NOT NULL` and `CHECK` constraints reject violating writes | `CHECK` since 0.8.0 (February 2021) | Row-level predicates only, with no aggregate checks such as row-count drops or null-rate spikes; adding a constraint upgrades the writer protocol | [Delta constraints](https://docs.delta.io/latest/delta-constraints.html) |
| Delta Lake `replaceWhere` | Atomically overwrites the rows that match a predicate | DataFrames since 1.1.0, SQL since 2.4.0 | Validates written data against the predicate by default | [Delta batch](https://docs.delta.io/latest/delta-batch.html) |
| Databricks pipeline expectations | `warn`, `drop` or `fail` on each record in Lakeflow pipelines (formerly Delta Live Tables) | Databricks | Per-record SQL predicates; each table commits separately | [Databricks](https://docs.databricks.com/aws/en/ldp/expectations), vendor documentation |
| Databricks data quality monitoring | Freshness and completeness anomaly detection (formerly Lakehouse Monitoring) | Databricks | Observes data after commit and does not block a publish | [Databricks](https://docs.databricks.com/aws/en/data-quality-monitoring/), vendor documentation |
| Nike Spark-Expectations | Rules applied in flight move failing rows to an `_error` table before the write to Delta | Open source published by Nike | Filters rows; does not stage and publish a whole table | [GitHub](https://github.com/Nike-Inc/spark-expectations) |
| lakeFS hooks | Checks run on a branch before merge | Current documentation | One writer per Delta table | [lakeFS](https://docs.lakefs.io/integrations/delta/), vendor documentation |
| AWS Glue Data Quality with Iceberg branches | Reference implementation of write-audit-publish | Blog post, 2024 | Worked example uses a sample dataset; the post names added latency as the pattern's main cost | [AWS](https://aws.amazon.com/blogs/big-data/build-write-audit-publish-pattern-with-apache-iceberg-branching-and-aws-glue-data-quality/), vendor documentation |

### Publishing several tables together

| Tool | How it supports the step | Version and status | Limits | Source |
| --- | --- | --- | --- | --- |
| Databricks multi-statement, multi-table transactions | `BEGIN ATOMIC ... END;` or `BEGIN TRANSACTION; ... COMMIT;`, with `SIGNAL` to abort and roll back | Public Preview 9 March 2026; catalog commits generally available 8 May 2026; generally available for Unity Catalog managed Delta tables 22 July 2026 ([release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/july)); Iceberg tables still in Private Preview | Every written table must be a Unity Catalog managed table with the `catalogManaged` feature; runs on SQL warehouses, serverless or DBR 18.0+; no DDL inside a transaction; no time travel inside; up to 100 tables, 100 views and 100 intermediate commits per table; repeatable-read snapshot with row-level conflict detection for non-interactive transactions; automatic rollback after 48 hours, or 10 minutes idle for interactive transactions; lineage events persist after rollback; RESTORE cannot run inside a transaction | [Databricks](https://docs.databricks.com/aws/en/transactions/), vendor documentation |
| Databricks catalog commits | Prerequisite for multi-table transactions | DBR 16.4+ to read or write, 18.0+ to enable on existing tables | Cannot be switched on or off through `CREATE OR REPLACE TABLE`; an interrupted upgrade can lock the table | [Databricks](https://docs.databricks.com/aws/en/tables/features/catalog-commits), vendor documentation |
| Delta Lake (open source) | No multi-table transaction API; catalog-managed tables are the foundation for one | Catalog-managed tables in preview in 4.0.0 (June 2025, not for production tables), renamed in 4.0.1, full Kernel support in 4.1.0; multi-table transactions exist only as open RFC #7437 ([issue](https://github.com/delta-io/delta/issues/7437)) | "Filesystem-based access to catalog-managed tables is not supported"; manual VACUUM blocked on them from 4.1.0 | [Delta protocol](https://github.com/delta-io/delta/blob/master/PROTOCOL.md), [releases](https://github.com/delta-io/delta/releases) |
| lakeFS | A branch merge spans many Delta tables | Current documentation | "lakeFS currently supports a single writer for Delta Lake tables"; path-based access, so it cannot serve catalog-managed tables (an inference from the two sets of documentation) | [lakeFS](https://docs.lakefs.io/integrations/delta/), vendor documentation |
| Project Nessie | Multi-table commits for Iceberg | Project documentation | Delta integration removed in 0.62.0 (June 2023) ([PR #7108](https://github.com/projectnessie/nessie/pull/7108)) | [Nessie](https://projectnessie.org/guides/about/) |
| Iceberg REST catalog | Specification endpoint to commit updates to multiple tables in one atomic operation | Specification | Which catalogs and engines implement it was not verified | [Specification](https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml) |
| Snowflake swap, or dbt blue/green | `ALTER TABLE ... SWAP WITH`, or `alter database prod swap with stage` after building and testing the whole project in a staging database | Current documentation | Views compiled with a schema prefix still point at the old schema after a swap; incremental models lose their latest batch | [Snowflake](https://docs.snowflake.com/en/sql-reference/sql/alter-table), vendor documentation; [dbt Discourse](https://discourse.getdbt.com/t/performing-a-blue-green-deploy-of-your-dbt-project-on-snowflake/1349) |

### Keeping v1 and v2 side by side

| Tool | How it supports the step | Version and status | Limits | Source |
| --- | --- | --- | --- | --- |
| Online schema-change tools for operational databases | gh-ost (GitHub) copies a table by tailing the binary log; Facebook's OnlineSchemaChange, Shopify's LHM and Vitess VReplication rewrite large tables without long locks; PostgreSQL `ADD CONSTRAINT ... NOT VALID` defers validation of existing rows | Open source | Applications still see one schema; Shopify showed that LHM can lose rows for one combination of NOT NULL, default, unique index and strict mode ([Shopify](https://shopify.engineering/add-not-null-colums-to-database)) | [gh-ost](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/), [OSC](https://github.com/facebookincubator/OnlineSchemaChange/wiki/How-OSC-works), [PostgreSQL](https://www.postgresql.org/docs/current/sql-altertable.html) |
| GitLab migration helpers | Trigger-based `rename_column_concurrently`, batched background migrations that pause on database health signals, and ignore-column helpers for a three-release drop | Current documentation | Driven by release order, not by a per-user flag | [GitLab](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/), [batched migrations](https://docs.gitlab.com/development/database/batched_background_migrations/) |
| pgroll | Serves each schema version as a Postgres schema of views and keeps old and new physical columns in sync with triggers; a client chooses a version with `search_path` | Open source published by a vendor | Version choice is per connection; no independent production account at scale was found | [pgroll](https://github.com/xataio/pgroll), vendor documentation |
| GitHub Scientist | Runs old and new code paths, returns the old result, and records mismatches | Open source | GitHub uses it on read operations only | [GitHub](https://github.blog/developer-skills/application-development/scientist/) |
| LaunchDarkly migration flags | Six stages: off, dualwrite, shadow, live, rampdown, complete | Current documentation | A product design, not an outcome report | [LaunchDarkly](https://launchdarkly.com/docs/guides/flags/migrations), vendor documentation |
| Delta Lake, additive column | `mergeSchema` on a write, or `WITH SCHEMA EVOLUTION`; old readers ignore the new column | Open source | The documentation advises against enabling evolution for a whole session; `overwriteSchema` rewrites the table and breaks all readers at once | [Delta batch](https://docs.delta.io/latest/delta-batch.html) |
| Delta Lake, column mapping (rename and drop) | Metadata-only rename and drop | Rename since 1.2.0, drop since 2.0.0; documentation still says "experimental with known limitations" | "This protocol upgrade is irreversible"; readable only by Delta 1.2+ (reader version 2, writer version 5); streaming reads after a rename or drop need `schemaTrackingLocation` (3.0+); batch change-feed reads across a non-additive change fail. Databricks can remove the feature with `DROP FEATURE` from DBR 15.4 LTS ([Databricks](https://docs.databricks.com/aws/en/delta/column-mapping), vendor documentation) | [Delta column mapping](https://docs.delta.io/latest/delta-column-mapping.html) |
| Delta Lake, type widening | `ALTER COLUMN ... TYPE` to a wider type without rewriting files | Preview in 3.2, generally available in 4.0; Databricks DBR 15.4 LTS+ | Readers need Delta 3.3+ (or DBR 15.4 LTS+); disabling the property does not remove the feature; integer-to-decimal changes are manual; Databricks streaming support needs DBR 16.4 LTS+ ([Databricks](https://docs.databricks.com/aws/en/delta/type-widening), vendor documentation) | [Delta type widening](https://docs.delta.io/latest/delta-type-widening.html) |
| Delta Lake, views | `t_v1` and `t_v2` views over one table | Open source | Views derived from the table must be recreated after a schema change | [Delta batch](https://docs.delta.io/latest/delta-batch.html) |
| Databricks, any schema update | Applies the change to a Delta table | DBR | "Updating a table schema terminates any streams reading from that table" | [Databricks](https://docs.databricks.com/aws/en/delta/update-schema), vendor documentation |
| Apache Iceberg schema evolution | Add, drop, rename and widen columns by column identifier without rewriting files; a branch can hold a different schema state | Open source | Changes one current schema; behavior of schemas on branches was not researched in detail | [Iceberg](https://iceberg.apache.org/docs/latest/evolution/) |
| dbt model versions and contracts | Consumers pin a model version; `deprecation_date` marks the end of the migration window; enforced contracts check column names and types before a build | Versions and contracts generally dated to dbt Core 1.5 (not re-verified); `deprecation_date` 1.6; constraint changes treated as breaking from 1.6; deleting or renaming a contracted model checked from 1.9 | Contracts check structure and not logic; a contracted model cannot be deleted before its `deprecation_date` | [dbt versions](https://docs.getdbt.com/docs/mesh/govern/model-versions), [contracts](https://docs.getdbt.com/docs/mesh/govern/model-contracts), [deprecation_date](https://docs.getdbt.com/reference/resource-properties/deprecation_date), vendor documentation |
| Iceberg branches | Zero-copy named branches, each with its own retention | Open source | Per table | [Iceberg branching](https://iceberg.apache.org/docs/latest/branching/) |
| Delta Lake shallow clone | `SHALLOW CLONE` copies metadata only, so changes affect only the clone | Open source since 2.3 (April 2023); no deep clone in open source | The clone fails with `FileNotFoundException` if the source is vacuumed; its history starts at version 0, so change-feed and stream offsets do not carry over | [Delta utilities](https://docs.delta.io/latest/delta-utility.html) |
| Unity Catalog shallow clone | As above, with separate permissions | Managed tables DBR 13.3 LTS+, external tables DBR 14.3 LTS+; Delta only | VACUUM on the source does not break the clone; managed clones only to managed tables; `DROP TABLE ... FORCE` on a protected base breaks clones; UNDROP window 7 days by default | [Databricks](https://docs.databricks.com/aws/en/delta/clone-unity-catalog), vendor documentation |
| Databricks deep clone | Copies data and metadata, with incremental sync | Databricks only | Streaming tables and materialized views cannot be cloned | [Databricks](https://docs.databricks.com/aws/en/delta/clone), vendor documentation |
| lakeFS branches | Zero-copy branch over a whole repository of Delta or other tables | Current documentation | Single writer per Delta table; path-based access; VACUUM must be followed by lakeFS garbage collection; Unity Catalog access only through a read-only export | [lakeFS](https://docs.lakefs.io/integrations/delta/), vendor documentation |

### Rolling back a table, and the retention that bounds it

| Tool | How it supports the step | Version and status | Limits and retention defaults | Source |
| --- | --- | --- | --- | --- |
| Apache Iceberg | `rollback_to_snapshot`, `rollback_to_timestamp` and `set_current_snapshot` move the current-snapshot pointer | Open source | Snapshot expiry default 5 days (`history.expire.max-snapshot-age-ms` = 432000000), applied only when `expire_snapshots` runs; `min-snapshots-to-keep` 1; tags and branches can retain snapshots longer | [Iceberg procedures](https://iceberg.apache.org/docs/latest/spark-procedures/), [configuration](https://iceberg.apache.org/docs/latest/configuration/) |
| Delta Lake (open source) | `RESTORE TABLE ... TO VERSION AS OF` or `TIMESTAMP AS OF` writes a new data-changing commit | Since 1.2.0 | Fails if the target version's files were vacuumed; streaming readers reprocess the restored files; `deletedFileRetentionDuration` 7 days and `logRetentionDuration` 30 days by default; VACUUM is not automatic; with no named tags, keeping a known-good version beyond 7 days needs raised retention or a clone (an inference from the documentation) | [Delta utilities](https://docs.delta.io/latest/delta-utility.html) |
| Databricks Delta | The same RESTORE, plus partial restore with `spark.sql.files.ignoreMissingFiles` | DBR | Time travel blocked beyond `deletedFileRetentionDuration` in DBR 18.0+ (Unity Catalog managed tables from DBR 12.2 LTS); predictive optimization can run VACUUM automatically ([VACUUM](https://docs.databricks.com/aws/en/sql/language-manual/delta-vacuum)); RESTORE not allowed inside a transaction | [Databricks](https://docs.databricks.com/aws/en/delta/history), vendor documentation |
| lakeFS | `lakectl branch revert` or a HEAD reset across many tables | Current documentation | Read through a summarizing tool, not in raw text | [lakeFS](https://docs.lakefs.io/guides/rollback/), vendor documentation |
| Delta Change Data Feed | Records inserts, updates (pre- and post-image) and deletes with each commit, so downstream tables can apply a restore or publish as row changes | Since 2.0.0; 4.2.0 allows change-feed writes for non-data-changing operations | Purged by VACUUM; once enabled, Delta 1.2.1 and earlier cannot write the table; the feed uses the latest table schema | [Delta](https://docs.delta.io/latest/delta-change-data-feed.html) |
| Delta Lake as a streaming source | Reads appends | Open source | Non-append commits throw an exception unless `skipChangeCommits` (which drops them) or the deprecated `ignoreChanges` (which emits duplicates) is set; a stream that lags past log retention can drop data | [Delta streaming](https://docs.delta.io/latest/delta-streaming.html) |
| Iceberg as a streaming source | Reads appends; `create_changelog_view` builds a view of changes | Open source | Overwrite snapshots cause an exception by default; skip options exist | [Iceberg streaming](https://iceberg.apache.org/docs/latest/spark-structured-streaming/), [procedures](https://iceberg.apache.org/docs/latest/spark-procedures/) |

### Schema compatibility for events

| Tool | How it supports the step | Default and status | Limits | Source |
| --- | --- | --- | --- | --- |
| Confluent Schema Registry | Rejects schema versions that break the configured mode: BACKWARD, FORWARD, FULL, their transitive variants, or NONE | Default BACKWARD, non-transitive; BACKWARD_TRANSITIVE recommended for Protobuf | The default TopicNameStrategy ties one schema to one topic, which is why a breaking change usually means a new topic; ksqlDB uses only that strategy ([Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html)) | [Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html), vendor documentation |
| Confluent migration rules | Consumers pin `application.major.version`; JSONata or CEL rules transform messages between major versions on read (UPGRADE, DOWNGRADE or both) | Confluent Enterprise and Confluent Cloud with Stream Governance Advanced; Platform 7.4+ | Not in the Community edition; JavaScript and .NET clients lack Protobuf migration rules; consumers see rule changes only after the cache TTL (300 seconds in the example); no production field report found | [Confluent](https://docs.confluent.io/platform/current/schema-registry/fundamentals/data-contracts.html), vendor documentation |
| Apache Pulsar | Eight compatibility strategies; automatic schema update on by default | FULL for Avro and JSON, ALWAYS_INCOMPATIBLE for other types | Native Protobuf checks compare root message names unless field checks are enabled | [Pulsar](https://pulsar.apache.org/docs/next/schema-understand/) |
| Google Pub/Sub | Schema revisions; each topic validates against a range of revisions | Avro revisions must be fully compatible; Protobuf allows only adding or removing optional fields | Maximum 20 revisions; range changes can take a few minutes to apply | [Pub/Sub](https://cloud.google.com/pubsub/docs/commit-schema-revision), vendor documentation |
| AWS Glue Schema Registry | Eight modes, with a movable checkpoint version | BACKWARD recommended | | [AWS](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html), vendor documentation |
| Zalando Nakadi | `compatible`, `forward` and `none` modes; the major version is part of the event type's name | Default forward; full compatibility encouraged | Compatible mode allows only new optional attributes | [Nakadi](https://nakadi.io/manual.html) |
| Buf | Breaking-change rules applied to Protobuf source files in continuous integration | FILE category by default | Compares source files with a previous version and has no knowledge of the data already in a topic | [Buf](https://buf.build/docs/breaking/rules/) |
| Apache Flink | Savepoint, change state types, restore | Stable documentation | State schema evolution only for POJO and Avro types; no key evolution; no Kryo; operator `uid()` strongly recommended; unmatched state skipped only with `--allowNonRestoredState`; default restore mode NO_CLAIM; cannot revert writes to external systems | [Flink schema evolution](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/serialization/schema_evolution/), [upgrading](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/upgrading/), [savepoints](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/savepoints/) |
| Spark Structured Streaming | Restart from a checkpoint | Current documentation | No changes to stateful operations, or to the number or type of input sources; changing subscribed Kafka topics generally not allowed | [Spark](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html) |
| Kafka Streams | Reset tool for reprocessing; explicit internal naming (`ensure.explicit.internal.resource.naming`) | Trunk documentation | Reset is irreversible, needs every instance stopped, and does not reset output topics; adding an operator can rename internal stores and prevent a rolling redeploy; deserialization-handler defaults differ between the old and new configuration names in trunk and should be checked against a released version | [Reset tool](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/app-reset-tool.md), [naming](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/dsl-topology-naming.md) |
| Apache Kafka | Transactions and log compaction | Trunk documentation | Exactly-once only within Kafka; compaction keeps the latest value per key; tombstones visible within `delete.retention.ms` (default 24 hours) | [Kafka design](https://github.com/apache/kafka/blob/trunk/docs/design/design.md) |
| Debezium | The MySQL connector's schema history topic records DDL with binlog positions; the outbox event router publishes from an outbox table | Stable 3.x documentation | The history topic must have one partition; the schema change topic format is "in an incubating state"; the Postgres connector cannot report DDL, cannot handle schema changes during an incremental snapshot, and its `pgoutput` plugin does not capture generated columns | [MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), [Postgres](https://debezium.io/documentation/reference/stable/connectors/postgresql.html), [outbox](https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/) |

### Feature versioning

| Tool | How it supports the step | Version and status | Limits | Source |
| --- | --- | --- | --- | --- |
| Chronon | Online feature groups are locked against edits and a `_v2` is recommended; a consistency job logs sampled queries to `query_logs` (90-day retention) and reports mismatch rates; bootstrap combines logged and backfilled values | Open source (Airbnb, used at Stripe) | Consistency is never 100% for streaming features | [GroupBy](https://chronon.ai/authoring_features/GroupBy.html), [consistency](https://chronon.ai/test_deploy_serve/Online_Offline_Consistency.html), [bootstrap](https://chronon.ai/authoring_features/Bootstrap.html) |
| Feast | Version-qualified feature references (for example `driver_stats@v2:trips_today`), a separate online table per version, and `feast apply --no-promote` to save a version without activating it | 2026, experimental | Version-qualified reads only on SQLite initially; each version needs its own materialization; no mechanism to prune old versions | [ADR-0008](https://docs.feast.dev/project/adr/adr-0008-feature-view-versioning), [blog](https://feast.dev/blog/feature-view-versioning) |
| Tecton | Immutable objects, `:v2` variants, and one feature service per deployed model | Current documentation | Will not apply in place a change that would invalidate a stream aggregate's checkpoint; re-materialization incurs cost and downtime | [Tecton](https://docs.tecton.ai/docs/running-in-production/production-best-practices), [costs](https://docs.tecton.ai/docs/manage-costs/suppress-recreates), vendor documentation |
| Hopsworks | Version bump followed by a backfill; feature views tie a model to the versions it reads | Current documentation | | [Hopsworks](https://docs.hopsworks.ai/latest/concepts/fs/feature_group/versioning/), vendor documentation |
| Databricks Feature Engineering | Any Unity Catalog Delta table with a primary key is a feature table; point-in-time joins by timestamp key; `log_model` binds a model to its feature lookups | Client needs DBR 13.2+; simple views as feature tables from client 0.7.0 and DBR 16.0 ML | Binding is to table and feature names, with no documented table-version parameter; point-in-time joins are unrelated to Delta time travel; deleting a feature table drops the Delta table; publishing v1 and v2 online side by side was not researched | [Feature tables](https://docs.databricks.com/aws/en/machine-learning/feature-store/uc/feature-tables-uc), [point-in-time](https://docs.databricks.com/aws/en/machine-learning/feature-store/time-series), [training](https://docs.databricks.com/aws/en/machine-learning/feature-store/train-models-with-feature-store), vendor documentation |
| Vertex AI Feature Store | Managed feature store | Current documentation | Supports only version 0 for features | [Google Cloud](https://cloud.google.com/vertex-ai/docs/featurestore/latest/overview), vendor documentation |
| SageMaker Feature Store | Managed feature store | Current documentation | Features can be added but not removed, and added features are not backfilled | [AWS](https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store-update-feature-group.html), vendor documentation |
| MLflow model signatures | Validates a model's input schema when it is loaded or served | Open source | Checks names and types at the model boundary, not whether values came from the same feature definition; Unity Catalog rejects models without signatures | [MLflow](https://mlflow.org/docs/latest/ml/model/signatures/) |

### Model shadow and traffic split

| Tool | How it supports the step | Version and status | Limits | Source |
| --- | --- | --- | --- | --- |
| SageMaker shadow tests | Copies inference requests to a shadow variant on the same endpoint; only the production variant's responses are returned | Current documentation | Not available for serverless, asynchronous, multi-model or multi-container endpoints, Marketplace containers, or Inf1 instances | [AWS](https://docs.aws.amazon.com/sagemaker/latest/dg/shadow-tests.html), vendor documentation |
| SageMaker production variants | Weighted split per request, or the caller pins a variant with `TargetVariant` | Current documentation | Randomization is per request, so keeping a user on one variant is the caller's job (an inference from the documented mechanism) | [AWS](https://docs.aws.amazon.com/sagemaker/latest/dg/model-ab-testing.html), vendor documentation |
| SageMaker deployment guardrails | Blue/green deployment with all-at-once, canary or linear traffic shifting, and rollback when an alarm fires during a baking period | Current documentation | Uses operational alarms, not experiment statistics | [AWS](https://docs.aws.amazon.com/sagemaker/latest/dg/deployment-guardrails.html), vendor documentation |
| Databricks Model Serving | Serves models logged with feature lookups and fetches their features automatically | Current documentation | Serving v1 and v2 models side by side through separate endpoints or a split was not read in the documentation and is an inference | [Databricks](https://docs.databricks.com/aws/en/machine-learning/feature-store/train-models-with-feature-store), vendor documentation |
| TensorFlow Extended Evaluator and InfraValidator | The Evaluator blesses a candidate only if it meets configured criteria against the currently serving model on every metric and slice; InfraValidator checks that the model loads and answers in the serving infrastructure | Current documentation | Thresholds are set by the user; the documentation gives examples and no recommended values | [Evaluator](https://www.tensorflow.org/tfx/guide/evaluator), [InfraValidator](https://www.tensorflow.org/tfx/guide/infra_validator) |
