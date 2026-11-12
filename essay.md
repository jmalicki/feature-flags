# Moving off the release train

*Why engineering teams should replace testing periods and scheduled releases with dark launches, feature flags, staged rollouts, and fast rollback.*

Some engineering organizations still deliver software the way most of the industry did twenty years ago. Changes accumulate into a scheduled release, known as a release train, which is promoted through a series of test environments, held in pre-production for a soak period, approved, and then released to every user at once. This article argues that teams still using a release train should replace it.

In the model that has replaced it at most large internet companies, small changes are deployed to production continuously with their new behavior disabled. Each behavior is then enabled separately, first for no one, then for a small group, and then for everyone, with a rehearsed way to reverse each step. A growing number of banks and payments firms now work this way as well. Testing before production remains, but most of the evidence that a change is safe is gathered in production, at limited exposure.

The release train imposes days of delay on every change regardless of its risk, and it forces changes into batches that are harder to test and harder to debug. The safety it provides is also narrower than it appears, because a soak in a test environment cannot observe real dependencies, code paths that nothing exercises, or faults whose trigger has not yet occurred. Separating deployment from release removes the trade-off between speed and safety that the train creates, provided the supporting practices are adopted in full.

Adopting the model is primarily a change in engineering practice and culture, and that change is harder than the tooling. Engineers have to write changes that can be turned off, teams have to operate what they deploy, approval has to move from scheduled meetings to recorded evidence, and rollback has to become a routine operation.

The first half of the article covers the release train and its costs, how the industry arrived at the alternative, the techniques involved and the limits of each, what changes for the people involved, and how these efforts fail. The second half applies the argument to systems that move money, which are the hardest case, on the reasoning that a model that can be applied safely to payments can be applied elsewhere. Most of the linked sources are engineering posts and papers written by the teams that did the work.

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

The European Central Bank's [IT risk questionnaire](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf), which the banks it supervises complete each year, asks for the three main root causes of changes that caused issues in production and offers a list that includes "Misalignment between test and production environment", "Inadequate test coverage" and "Unexpected interdependencies between applications".

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

Configuration, flags, reference data and operator scripts are changes too, and any of them that can reach every system at once carries the same risk as an unstaged release. CrowdStrike staged the rollout of its software but not of the content files the software reads. Its [analysis of the July 2024 outage](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) concludes that each such file "should be deployed in a staged rollout". Cloudflare's 2019 outage came through a channel for firewall rules whose procedure, [in Cloudflare's words](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/), "allowed a non-emergency rule change to go globally into production without a staged rollout".

### Failures in the safety mechanism

The flag service, the configuration system and the rollback tooling are themselves production systems, which need their own staged rollout and must not depend on the things they exist to switch off. In December 2025 Cloudflare had another outage, of about 25 minutes affecting roughly 28% of its HTTP traffic. One of the changes involved was [a kill switch applied through a global configuration system](https://blog.cloudflare.com/5-december-2025-outage/) that reaches the whole fleet within seconds.

### A ramp that ended too early

At least one stage of a ramp has to span a real peak and, for batch work, a full run. Roblox had used a new streaming feature on some of its services for months. It then enabled the feature on its traffic-routing service, where the feature ran for a day without trouble before [a 73-hour outage began](https://about.roblox.com/newsroom/2022/01/roblox-return-to-service-10-28-10-31-2021/).

### Single-event migration without rollback

The opposite failure, a single large migration with no way back, remains the most expensive. TSB moved 5.2 million customers to a new platform over a single weekend in 2018, with testing cut short and no ability to roll back. It received 225,492 complaints and was fined £48.65 million by the FCA and the PRA together. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) found that fuller testing of the bank's two-data-center configuration would likely have found the fault, so the case argues for better testing as well as for smaller steps.

### Program-level failures

The overall effort can also stall without any single incident.

One cause is a pilot that never touches a money path. A team picks an internal reporting service because it is safe, declares success after two quarters, and has learned nothing about stored decisions, irrevocable payments or reconciliation.

A second cause is that shadow comparisons accumulate unread and stages pass on elapsed time.

A third is that the change board approves each ramp step as if it were a release, so that the ramp takes longer than the train did.

Finally, speed can become the goal. Deployment frequency is a symptom of small, safe changes, and when it becomes a target it is inflated with trivial deployments. The 2017 State of DevOps survey found that its lowest-performing group had [sped up and reported more failures](https://dora.dev/research/2017/2017-state-of-devops-report.pdf).

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

A common objection is that auditors and regulators require the existing process. The rules and a firm's own policy differ, and each needs to be considered separately.

### What the rules ask for

The rules and supervisory guidance that apply to this kind of system include the US examiners' handbook, Singapore's [technology risk guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf) and, in the EU, the [Digital Operational Resilience Act](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2554) (DORA), which has applied since January 17, 2025, together with its [technical standards on ICT risk management](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774), Commission Delegated Regulation (EU) 2024/1774. The European Banking Authority's [guidelines on ICT risk](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Guidelines/2020/GLs%20on%20ICT%20and%20security%20risk%20management/872936/Final%20draft%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf) set the EU's expectations for change management from 2020 until the EBA [deleted that section](https://eba.europa.eu/sites/default/files/2026-05/c8fb6168-0aef-42f6-8da9-114a8baf21b9/Consolidated%20version%20of%20EBA%20ameding%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf) for firms within DORA's scope from May 20, 2025. These texts, and the EBA's before them, ask for broadly the same things:

- a record of every change
- testing in proportion to the risk
- approval by someone with authority who is not the author
- segregation of duties
- separation of production from development
- a way back
- an audit trail

None of them asks for a soak period, a release train, or promotion over several days, and neither DORA nor its technical standards mentions canaries, feature flags, staged rollouts or release frequency. The standards' rules on ICT projects apply ["regardless of the ICT project management methodology chosen by the financial entity"](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774), and the same recital says that firms "should adopt testing practices and methods that suit their needs, while adhering to a risk-based approach". The EBA had made the same point in 2019, after banks complained that a draft of its guidelines implied waterfall.

Some of them ask for more than this list. Singapore's guidelines expect a change advisory board and signed-off test results, and both they and the US handbook expect quality assurance that is independent of development. The EU standards apply "in respect of all changes to software, hardware, firmware components, systems, or security parameters", with no threshold of materiality, and [Article 17(1)(b)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) requires "mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes". The standards do not define a function, and Germany's supervisor, BaFin, notes in its [guidance on DORA](https://www.bafin.de/SharedDocs/Downloads/EN/Anlage/dl_2024_07_08_Aufsichtsmitteilung_Umsetzungshinweise_DORA_en.pdf?__blob=publicationFile&v=3) that the provision "does not describe or require the implementation of a concrete process." A reasonable reading treats the requirement as met by an approver who neither requested nor wrote the change, with the pipeline as the implementer, and as hard to meet with a reviewer on the same team who also requested the change. No supervisor has confirmed that reading.

Smaller entities, such as small and non-interconnected investment firms and exempted payment institutions, follow a [simplified framework](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) whose change procedure (Article 38(2)) contains no clause on independent approval and none on testing in production.

[Article 8(2)](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774) of the standards requires production to be separated from development and testing environments, and permits testing in production only where the instances "are clearly identified, reasoned, are for limited periods of time," and are "approved by the relevant function". A recital presents this as an exception allowed "considering current ICT system development practices". Under Article 16, non-production environments hold anonymized, pseudonymized or randomized data, and may hold production data only "for specific testing occasions, for limited periods of time", with approval and a report to the ICT risk management function.

No supervisory statement was found on whether a canary, a ramp step or a dark launch counts as testing in production. One reading, which no supervisor has confirmed, is that a firm can document each change as tested before deployment and treat the canary and the ramp as the "adequate transition" that Article 17(1)(c) asks firms to design, with exposure limits and abort criteria fixed in advance. That reading is untested, and a firm that prefers not to rely on it can record each ramp as an approved instance under Article 8(2). Replaying production traffic into a test environment, which some shadow designs do, falls under the rules on production data in Article 16(6).

Change procedures under the standards must also identify "fall-back procedures and responsibilities, including procedures and responsibilities for aborting changes or recovering from changes not successfully implemented" (Article 17(1)(e)), and error-handling procedures must include "ICT system restart, rollback, and recovery procedures" (Article 8(2)(c)(iii)). A kill switch, abort criteria written into the ramp plan and a rehearsed rollback correspond directly to those provisions.

For algorithmic trading, the EU's [RTS 6](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0589) comes closest to requiring limited initial exposure. Before deploying a trading algorithm, a firm "shall set predefined limits" on instruments, orders, positions and venues (Article 8), and it must be able to cancel its unexecuted orders immediately through "kill functionality" (Article 12). The regulation does not require the limits to be raised in stages, and it keeps a person designated by senior management to authorize each deployment or substantial update (Article 5(2)).

For instant payments, the [Instant Payments Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R0886) requires every payment account that can receive credit transfers to be reachable for instant credit transfers "24 hours a day and on any calendar day". Penalties are waived only for planned maintenance whose periods of non-availability are "both foreseeable and short" and announced in advance. A long weekend release window on an instant-payment path therefore appears to carry a regulatory cost, although no supervisor has said so.

### What auditors test

The rule texts are not what auditors test a firm against. An audit measures the firm against its own change policy, its control descriptions and its client contracts, which describe the train and are where the three days are written down.

Sweden's Finansinspektionen applied the same test to Swedbank, which in April 2022 made a change to a business-critical IT system that left almost one million customers with incorrect balances. In March 2023 the regulator [fined the bank SEK 850 million](https://fi.se/en/published/news/2023/20232/swedbank-receives-a-remark-and-an-administrative-fine), finding that it "made the change in its system without following internal procedures for how such changes should be implemented" and had no suitable controls to ensure that it followed them. Under those procedures the bank should have analyzed the risk and impact of the change and assessed its timing against, among other things, the days on which salaries are paid.

The work is therefore to rewrite the policy, with risk and audit as co-authors from the start. The published accounts from regulated firms follow a consistent pattern.

- Authorization is a reviewer other than the author, enforced by the pipeline. Monzo describes a policy that requires [at least one other person to review every change](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform).
- Segregation is the absence of standing human access to production, with the pipeline as the only way in. A Capital One technology governance director with twenty years in risk and audit [wrote about this arrangement](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/), and the company's pipeline has [sixteen gates](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/), among them an automated change order and automated rollback.
- Evidence is an immutable log that ties commit, review, test results and deployment together.
- Exceptions are break-glass access with loud alerts and a review afterwards.

Starling is the most useful example for a firm on a train, because it kept its human gates and still releases daily. In 2018 its release process included a step in which every engineer vouched for their own commits in chat, and a visible release-in-progress signal about which its slides say ["our auditors loved this one"](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf). In 2025 the bank [still required three approvals for every release](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), the last of them a business approval from an engineering lead, director or executive, and was releasing several times a day.

The Financial Times is a non-financial example of the same move. Sarah Wells, then responsible for operations and reliability there, [told a conference](https://www.infoq.com/presentations/microservices-financial-times/) that the FT no longer had change approval boards: "if you're doing small changes, the best person to make the decision about whether this change should go, is the person who just made that development change." Each release is recorded automatically.

### Flag changes are changes

None of the rule texts reviewed mentions feature flags, so there is no stated classification for a flag change. A flag change in production alters behavior, however, and therefore falls inside any reasonable definition of a change. It also appears to fall inside DORA's definition, because the change-management obligation covers all changes, including changes to "security parameters", and BaFin's guidance observes that the earlier German limitation to significant changes no longer applies. A firm that lets developers switch money-moving behavior with no record and no second person has removed a control.

One workable classification is as follows.

- The code that introduces a flag goes through normal review and deployment.
- The ramp plan, with its stages, holds and stop conditions, is approved once.
- Each step of the ramp is a standard change executed under that plan, under dual control, and logged.
- Switching a flag off, and rolling back to the previous build, are pre-authorized. The on-call engineer can do either without asking, and the action is reviewed afterwards, which the EU standards allow for emergency changes by providing for their approval "after their implementation" (Article 17(1)(g)).
- The state of every flag on any given date can be produced as evidence.

Classifying too strictly fails in the opposite direction, because a ramp whose every step is raised as a normal change with three days' notice becomes slower than the train was. Germany's circular on bank IT, [BAIT](https://www.bafin.de/SharedDocs/Downloads/EN/Rundschreiben/dl_rs_1710_ba_BAIT_en.pdf?__blob=publicationFile&v=6), which applied to German banks until DORA, allowed different process rules for low-risk configuration changes and parameter settings, giving dual control, documentation of changes and downstream checks as examples.

Classifying too loosely is the risk that Norway's Finanstilsynet described in its [2026 risk and vulnerability report](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026), where it warned that unclear criteria for pre-approved changes can let changes of higher risk than assumed pass through simplified processes without sufficient testing and control. A ramp step therefore qualifies as a standard change only when the approved plan names the flag, the population, the cap and the stop conditions, and any step outside the plan is raised as a normal change.

### Supervisory expectations

The ECB, which supervises the largest banks in the euro area, has reported each year [since 2023](https://www.bankingsupervision.europa.eu/press/publications/newsletter/2023/html/ssm.nl231115.en.html) that IT changes are a leading cause of downtime of critical services, and in 2024 described them as ["still by far the most important reason for downtime"](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/annex/ssm.nl241113_4_annex.en.pdf). Anneli Tuominen, a member of its Supervisory Board, [wrote in 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html) that "38% of the major incidents reported by banks in 2025 had 'IT change' as their root cause", and the ECB's [priorities for 2026 to 2028](https://www.bankingsupervision.europa.eu/framework/priorities/pdf/ssm.supervisory_priorities202511.en.pdf) include "a targeted review of ICT change management to identify gaps in basic control frameworks". Norway's [Finanstilsynet](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026) traces many of the 313 ICT incidents reported to it in 2025 to changes that contained errors, had not been tested enough, or had unforeseen effects once in production.

After a series of outages at DBS in 2023, Singapore's regulator went further and [directed the bank to suspend changes to its IT systems](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs) for six months, apart from those needed for security, regulatory compliance and risk management.

The ECB's [IT risk questionnaire](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf), whose maturity criteria describe a traditional process, asks banks to score themselves against statements including "Significant changes are scheduled for implementation and approved by a dedicated management committee" and "The deployment of changes into production environment is only conducted by authorised production teams after a formal change approval", and asks whether a release management team is in place. It also expects emergency changes to be made "only upon formal documented approval". The Dutch central bank's [good practice for 2019 and 2020](https://www.dnb.nl/media/yffn1wji/good-practice-ib-2019-2020.pdf) lists a change advisory board among its examples, alongside change processes based on ITIL, Agile or Scrum. The ECB's [2020 report on the questionnaire](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.aroutcomesrepitriskquestionnaire202007~9ed9aaa17d.en.pdf) bases the inherent level of IT change risk on "the frequency of changes to critical IT systems (from low to high frequency)", which places a bank that deploys daily at a higher inherent risk before its controls are assessed. A bank whose developers deploy through a pipeline should expect to explain how the pipeline acts as the authorized production team and how pre-approved change types count as formal approval, since the criteria address neither point.

Of the continental texts found, BaFin's 2024 [notice on outsourcing to cloud providers](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/Aufsichtsmitteilung/dl_2024_02_01_Aenderung_Orientierungshilfe_Cloud.pdf?__blob=publicationFile&v=4) is the most supportive. It states that segregation of duties can be supported in part by technical aids such as CI/CD pipelines and automated tests, and that manual checks such as code reviews may still be needed on a risk basis. BAIT had expected testers with "appropriately structured independence from the application developers" and "reversal plans to enable an earlier version of the IT system to be restored if a problem occurs during or after going live". BaFin [removed banks subject to DORA](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/dl_250110_Informationsschreiben.pdf?__blob=publicationFile&v=1) from BAIT's scope with effect from January 17, 2025, and BAIT lapses entirely at the end of 2026.

Until February 2026 the Bank of Italy's [Circular 285](https://www.dirittobancario.it/wp-content/uploads/2022/11/Circolare-Banca-dItalia-n.-285-del-17-dicembre-2013-Aggiornamento-n.-40-del-2-novembre-2022.pdf) placed ICT change under a person or unit with a high degree of independence from development and required formal authorization of every change in production, at a level matched to its risk. The [51st update](https://www.dirittobancario.it/wp-content/uploads/2026/02/Atto-di-emanazione-del-51mo-aggiornamento-Banca-dItalia-03-febbraio-2026.pdf) repealed those sections and refers banks to DORA. In Switzerland, outside the EU, [FINMA's circular on operational risks](https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/rundschreiben/finma-rs-2023-01-20221207.pdf) requires development and test environments separate from production, and requirements that are "tested and validated based on their criticality".

Under DORA's incident rules, an incident that affects critical services is [classified as major](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1772) when it meets two or more materiality thresholds, among them more than 10% or more than 100,000 of the clients using the service, more than 10% of the daily average number or value of transactions, and more than two hours of downtime for a service supporting critical or important functions. No supervisory statement addresses ramps, but it follows from the thresholds that a defect caught at a small ramp stage and reversed within minutes may stay below those thresholds where the same defect released to every client at once would cross them. Incidents with the same apparent root cause that occur at least twice within six months and together meet the criteria count as one major incident, so a series of small change-caused failures can still become reportable.

The argument that works with a supervisor presents failure rate and reach per change, with evidence, and makes no appeal to speed. The closest supervisory wording is in the ECB's [July 2026 letter](https://www.bankingsupervision.europa.eu/press/letterstobanks/shared/pdf/2026/ssm.2026_letter_on_AI_enabled_cybersecurity_threats.en.pdf) on AI-enabled cyber threats, which refers to "ICT change management arrangements that enable rapid, risk-based remediation while maintaining operational stability" in the context of patching.

The research found no published account of what an examiner or external auditor concluded about a process like this, and found no continental European supervisor that mentions canary releases, feature flags or continuous deployment. The only public indication of acceptance is that these firms continue to operate under supervision.

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
