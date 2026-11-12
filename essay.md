# Chapter 1: The release train and its replacement

*Part of [Moving off the release train](README.md). Why engineering teams should replace testing periods and scheduled releases with dark launches, feature flags, staged rollouts and fast rollback.*

Some engineering organizations still deliver software through a release train: changes accumulate into a scheduled release, which is promoted through test environments, held in pre-production for a soak period, approved, and then released to every user at once. They should replace it with the model that Amazon, Facebook, Netflix and other large internet companies have published and that some companies in regulated industries have since adopted. Under that model, small changes reach production every day with their new behavior disabled, and each behavior is then released separately, in stages that can be reversed. The train delays every change by days regardless of its risk, and the safety it provides is narrower than it appears; separating deployment from release removes that trade-off, provided the supporting tooling and the changes in ownership are adopted in full.

To **deploy** is to put code into production, to **release** is to expose new behavior to users, and a **train** is a scheduled bundle that does both at once.

## Structure of the chapter

*Moving off the release train:* [Chapter 1: The release train and its replacement](essay.md) · [Chapter 2: Data and models](data-and-models.md) · [Appendices](appendices.md)

The second chapter applies the same model to tables, event streams, feature stores and machine-learning models, and the appendices hold reference material for both.

- [The release train](#the-release-train) describes how a scheduled release works, what its soak period finds, and what it costs in lead time and batching.
- [How the industry got here](#how-the-industry-got-here) traces the published accounts from continuous integration and online experiments to continuous deployment at large internet companies and in regulated industries.
- [Separating deployment from release](#separating-deployment-from-release) explains feature flags, where a flag is read, the kinds of flag, how canaries, ramps and experiments relate, and the changes a flag cannot guard.
- [The techniques](#the-techniques) covers dark launches and shadow traffic, canaries, rings and ramps, shared state and aggregate jobs, experiments, rollback, and deployment windows and freezes, with the limits of each.
- [Changes with effects that cannot be undone](#changes-with-effects-that-cannot-be-undone) covers changes whose effects, such as a payment sent or a message delivered, no rollback can reverse.
- [Changes that depend on an outside party](#changes-that-depend-on-an-outside-party) covers changes that wait on a partner, a payment scheme, a customer's notice period or an app store, and why most changes do not.
- [Ownership and culture](#ownership-and-culture) describes what changes for authors, service owners, testers, release managers and approvers, and how organizations have responded to failure.
- [Failure modes](#failure-modes) collects published failures that came from adopting only part of the model or from a single-event migration, and the ways a transition can stall.
- [Change control and audit](#change-control-and-audit) sets out what change-management rules and auditors require and how flag changes can be classified.
- [Evidence](#evidence) weighs the engineering record for and against the model.
- [What should change](#what-should-change) lists the changes in practice.
- [Getting started](#getting-started) covers measurement, a pipeline for the existing process, a first service, stop conditions, cost and retiring the train.

## The release train

### How it works

A release train runs on a schedule, which may be monthly, weekly, or several times a week. Everything merged since the previous cut is bundled into a release candidate. The candidate is promoted through a series of environments, typically integration, performance and pre-production, with automated and manual tests at each stage. It is then held in pre-production for a fixed soak period, approved by a change board, and released in a scheduled window.

Microsoft's product teams in the 1990s [built daily and stabilized at milestones](https://www.cs.umd.edu/~atif/Teaching/Spring2003/cusumano.pdf) that were months apart, whereas Facebook's website shipped [a weekly release](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf), cut on Sunday and pushed on Tuesday, into the 2010s.

The running example is a schedule of two trains a week, each taking three days from cut to release. On the first day the candidate is deployed to an integration environment and an automated regression pack runs against simulators for external dependencies, a few hours of machine time, much of which could run in parallel. The second day is a performance run, usually preceded by an environment reset and a data refresh that take longer than the test itself, followed by an overnight batch cycle. The third day goes to evidence assembly, change approval and the wait for a release window.

Only part of that time is work; the remainder is spent waiting for an environment, an approver, or a release window. When Amazon measured its own pipeline, before automating it, code took an average of 16 days to get from check-in to production, and for almost 14 of those days it was [waiting for someone to start a build, perform a deployment or run a test](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/). A twice-weekly train has a far better ratio, but on the breakdown above the work is unlikely to come to more than one day of the three.

![A sixteen-day bar: about two days of work and almost fourteen days of waiting for someone to start the next step.](figures/08-sixteen-days.svg)

### The purpose of the soak

A soak finds faults that appear only with elapsed time or at a boundary, which short tests and short canaries do not reach. They include:

- database and message-queue connections that only misbehave after hours of idleness
- memory, file handles and log volumes that creep
- queues that slowly deepen
- date rollovers and other time-triggered work
- batch jobs running to completion on new code while online traffic continues
- a release that no longer holds peak throughput

Some of what happens in the three days has to be preserved in any replacement:

- one full batch cycle on the new code, including its date rollover
- one daily peak, because capacity regressions do not appear at low traffic
- test windows with external partners, which run on the partner's calendar
- a second person's judgment on any high-risk change

Once deployment and release are separated, the batch cycle is kept in a [parallel run of the batch](#shared-state-and-aggregate-jobs) and the daily peak in a [bake](#changes-a-flag-cannot-guard) on part of production. Partner windows hold up [only the changes that touch the partner](#changes-that-depend-on-an-outside-party), and the second person's judgment moves into [approval of the ramp plan](#classifying-flag-changes).

### Lead time

With two evenly spaced trains a week, a finished change waits about 1.75 days on average for the next one and then spends three days in promotion. The total is about five days from finished to live, or six and a half for a change that has just missed a train, and the wait is the same for a one-line fix as for a change to core business logic.

![A timeline of one release train: finished changes wait about 1.75 days on average for the next cut, the train spends three days in promotion, and it is then released to every user at once. User exposure stays at zero and steps to 100% at release; a typical change takes about five days from finished to live.](figures/00-release-train.svg)

The table below applies the five-day figure to the kinds of work a team does. The right-hand column is an estimate of the same work once deployment and release are separated.

| Kind of work | On the train | Deployed daily, released separately |
| --- | --- | --- |
| An ordinary change | About 5 days from finished to live | In production the next business day, on every node the day after |
| A fault found in production | 5 days, or a hotfix that skips most of the three days | The same as an ordinary change, through the normal path |
| A feature that needs three rounds of feedback from production | About 15 days of waiting | About 3 days |
| A high-risk change | 5 days, then every user at once | Evidence from production the next day; full release once its slowest signal has arrived, often weeks later |

The last row shows a high-risk change deliberately taking longer under the new model. The gain comes from the other three rows, where ordinary work no longer queues behind the risky change.

Each hotfix that skips most of the three days is a change that went live without them, and hotfixes are the changes made under the most pressure, with the least verification.

### Batching

The second cost of the train is that each release carries half a week of other people's changes, so when a release misbehaves, the first job is to work out which change caused it.

A schedule with a cut-off also changes how people behave near it. LinkedIn's mobile team, releasing monthly behind a four-day manual regression pass, [described engineers rushing code in before the deadline](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases) because missing it cost a month. Facebook measured the result on its own mobile releases and found that code pushed on the day of the cut was [of lower quality than code pushed on other days](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf). A train that leaves twice a week creates the same incentive, although missing it costs half a week instead of a month.

Batching also keeps unfinished work out of the main branch. A change that takes three weeks cannot board a train until it is complete, so it lives on a branch and drifts from everyone else's work until it is merged.

The clearest account of what large batches do comes from OANDA, a currency-trading platform. OANDA deployed its own platform continuously, and also licensed the same software to large banks whose policies did not allow continuous updates, so the banks took it in periodic releases. In [a paper written with Facebook engineers](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf), the authors report that each release to the banks bundled thousands of changes, that the size of the release raised anxiety and led to much more extensive testing, that failures were significantly harder to isolate, and that bugs judged non-critical went unfixed for many months because a fix had to wait for a release.

### Why the train cannot simply run faster

One obvious remedy is to shorten the three days, but that means cutting the soak and therefore no longer looking for the faults the soak finds.

The other is to run the train daily with the same three days, which puts three trains in promotion at once. That arrangement needs three sets of environments and three times the partner test windows. A fault found on the third day of one train is already in the two behind it. Every change still waits three days, and every release still reaches every user in the same instant. Google's Site Reliability Workbook states the same constraint: ["If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."](https://sre.google/workbook/canarying-releases/) Because the train deploys and releases in one act, the caution that a risky change deserves is applied to every change on it.

### Limits of pre-production testing

A soak does not detect faults that depend on the behavior of real dependencies, on code paths that are not yet in use, or on conditions that have not yet occurred.

A soak cannot show how real dependencies behave, because pre-production talks to simulators and stubs. A simulator can confirm that a request is well formed and that scripted error and timeout cases are handled, but it cannot show how a real third party responds to real traffic.

A soak also cannot find a fault on a code path that nothing exercises, because time in an environment proves nothing about code that is not being called. Knight Capital's new order-routing code went onto its production servers in stages from July 27, 2012, five days before it was first used. The [SEC's order against the firm](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) records no incident in that time, because nothing was yet using the code, and a three-day soak would have observed no more than those five days in production did.

Elapsed time in any environment also does not find a fault whose trigger has not yet occurred. Stripe's outage of July 2019 came from a database version that had [passed testing, a phased rollout and about three months in production](https://stripe.com/rcas/2019-07-10) before a rare combination of conditions exposed it.

Staging environments differ from production in the data they hold. In April 2022 Atlassian ran a maintenance script that had been tested in staging under its normal change process and peer reviewed. It deleted the sites of 775 customers, some of whom were locked out for up to 14 days. [Atlassian's review](https://www.atlassian.com/engineering/post-incident-review-april-2022-outage) explains that staging could not have caught it, because the identifiers that triggered the fault did not exist there.

A long wait can also lose its purpose. Looking back at 2012, Netflix's engineers [wrote that their week-long canaries](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) were "devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality".

The FCA's evidence suggests that the size of a change matters more than the scrutiny it receives. In 2021 the UK's Financial Conduct Authority published [a review of how 23 financial firms had made more than a million production changes](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) during 2019. Changes the firms classed as major, which generally received more oversight, failed at 3.8%, against 1.6% for changes as a whole. Change advisory boards approved more than 90% of the major changes they reviewed, and at some firms did not reject a single one all year. The FCA's own summary was that "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles".

![Three panels of FCA statistics: 1.6% of all changes failed against 3.8% of major changes; change boards approved over 90% of major changes; change caused 17% of material incidents reported to the FCA and 24% of firms' high-severity incidents.](figures/07-fca-findings.svg)

The figures are associations and do not control for the fact that major changes are riskier by nature. The review also found a slightly higher failure rate at firms that described more of their work as DevOps, on a sample too small to support a conclusion.

## How the industry got here

The practice grew out of two separate lines of work that met around 2008. The figure below shows the main published accounts in order.

![A timeline of published accounts from 2000 to 2025: continuous integration and experimentation; dark launches, flags and frequent deployment from 2008 to 2011; scale, failures such as Knight Capital, and the first studies from 2012 to 2016; and wider adoption, including regulated industries, from 2017 to 2025, ending with the EU's DORA.](figures/03-timeline.svg)

### Integration and experiments

The first line concerned merging, and in 2000 Martin Fowler and Matthew Foemmel wrote up [continuous integration](https://martinfowler.com/articles/originalContinuousIntegration.html). Under that practice everyone merges to one branch about once a day, and an automated build and test run tells them quickly whether their work fits together. It solved the problem of changes that had diverged for too long, but it did not address putting each change into production.

The second line concerned exposure, and it came from web companies that had learned to show a change to some users and not to others, and to measure the difference. By 2007 Ron Kohavi and colleagues at Microsoft were recommending, in [a guide to running experiments](https://exp-platform.com/Documents/GuideControlledExperiments.pdf), that a new treatment start with a small share of users, ramp up gradually, and be shut off automatically if it did harm.

Google's search team built the connection between measurement and safety into its infrastructure. Its [2010 paper on experiment infrastructure](https://research.google/pubs/overlapping-experiment-infrastructure-more-better-faster-experimentation/) describes a system first deployed in 2007 in which code shipped in binary pushes, while experiments and launches were controlled by separate, faster pushes of data and configuration. A feature moved through a canary, an experiment and a gradual launch before it became the default, so the binary and the behavior were already on different schedules.

### Dark launches and flags

In 2008 Facebook used the same separation for load. Two months before anyone could use Facebook Chat, the site's pages began [connecting to the new chat servers](https://engineering.fb.com/2008/05/13/web/facebook-chat/) and sending simulated messages, so that the backend carried production load while no interface was visible, which Facebook called a dark launch. Visible rollout began on April 6 and reached everyone on April 23, according to [Eugene Letuchy's later slides](https://www.erlang-factory.com/upload/presentations/31/EugeneLetuchy-ErlangatFacebook.pdf).

Frequent deployment with flags became public vocabulary in 2009, when John Allspaw and Paul Hammond gave a talk at the Velocity conference called [10+ Deploys Per Day](https://paulhammond.org/2009/06/velocity/10deploys.pdf) about Flickr. Later that year Ross Harmes described [how Flickr used feature flags](https://code.flickr.net/2009/12/02/flipping-out/), with everyone working on the main branch, the site deploying several times a day, and unfinished features sitting in production switched off. Timothy Fitz described [IMVU deploying about fifty times a day](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/) behind an automated test suite, with deployment to a subset of machines first and automatic rollback.

Wealthfront is an early example from regulated finance. In 2010 the firm, which is regulated by the SEC, described [a deployment system](https://eng.wealthfront.com/?p=1273) in which the engineer who committed a change released it, the rollout went to one instance first and then outward, and an instance that failed its start-up self-test triggered a rollback that took about five seconds across a cluster of ten machines.

### Scale, and the first hard lessons

From 2012 the published accounts describe larger systems and are more open about failures. Facebook published a paper in 2015 on [how it managed configuration](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), which describes engineers who "release the new code into production early but in a disabled mode, and then use Gatekeeper" to widen exposure, and which acknowledges that configuration changes were causing a significant share of incidents and needed canaries of their own.

By 2017 Facebook's website had moved from scheduled pushes to [deploying continuously from the main branch](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), and in 2020 Amazon published [a detailed description of its deployment pipelines](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/).

### Regulated industries

Companies in regulated industries published less, and the fullest accounts from banks come from those built new. Starling Bank [told a conference in 2018](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf) that it released to production up to five times a day. Monzo described [more than a hundred deployments a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day) in 2022 and, later that year, [automated rollback across more than 2,100 services](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale). Financial supervisors in France, the United States and the European Union have since published texts that [accept frequent, automated change](appendices.md#what-regulators-and-auditors-accept) under conditions on approval, testing and records.

## Separating deployment from release

### The idea

A change is written so that its new behavior sits behind a feature flag, and the flag is off when the code ships. The code is built, deployed and running in production alongside everything else, and no user sees anything different. Turning the behavior on is a separate decision, taken later, for whichever users are chosen.

Deployment can then be frequent and uneventful, because deploying disabled code is meant to change nothing a user can see. Release stays deliberate, and can be more careful than it is on a train, because it applies to one behavior at a time and to as few users as required. The long hold then applies only to the behavior that needs watching, and every other change proceeds without it.

![Two arrangements. On a release train, half a week of changes is batched, held for three days of promotion and soak, and then deployed and released to every user at once. With deployment and release separated, code is deployed every day with its new behavior off, and one behavior is released on its own to no one, then a small group, then everyone, while the other changes proceed without waiting for it.](figures/14-deploy-and-release.svg)

### Flag evaluation

At its simplest a flag is a conditional that reads a value from configuration and runs the new code or the old code depending on the answer. Where each request stands alone, the flag can be read afresh on every request. Where a unit of work outlives a request, the point at which the flag is read and the behavior when the flag service is unavailable both need more care.

An order can run through fulfillment and returns for weeks, an insurance claim can stay open for months, and a payment can be returned or recalled months after it was accepted. If each of those steps reads the flag again, switching the flag partway through strands the work between two behaviors. The decision therefore has to be made once, when the work is accepted, and stored with its record. For a payment, the decision is the rail it will travel on:

```python
# At acceptance: decide once and record the decision.
payment.rail = decide_rail(payment)   # reads the flag here, and only here
ledger.record(payment)

# Everywhere else: follow the stored decision, never the flag.
gateway_for(payment.rail).submit(payment)
```

![One payment's life through acceptance, submission, confirmation, returns, recalls, status inquiries and postings, with the flag switched partway. When every step reads the flag, the steps after the switch get the other behavior and the payment is stranded between two behaviors. When the flag is read once at acceptance and the rail is stored on the payment record, every later step follows the stored rail.](figures/15-flag-evaluation.svg)

A release train creates the same hazard for work in flight whenever a release goes out; a ramp that moves back and forth creates it every time the percentage changes. Workflow engines provide a form of the rule as a built-in call. In Cadence, the engine Uber uses for [billions of workflows with lifetimes ranging from seconds to years](https://cadenceworkflow.io/blog/2025/07/01/2025-07-01-safe-deployment-of-versioned-workflows/safe-deployment-of-versioned-workflows/), a developer marks each change with a versioning call. The call fixes a version the first time a workflow reaches it, and later calls in that workflow return the same version, so later steps do not decide again. When rollbacks sent workflows that had started on new code to workers that could not run them, teams had to find, terminate and restart those workflows. The resulting on-call burden led Uber to change the versioning API so that teams can deploy the code first and activate the new version later. [Temporal's documentation](https://docs.temporal.io/develop/go/workflows/versioning) describes the same mechanism as "similar to a feature flag" and says the first call records a marker in the workflow's history.

An operator can still move work that is in flight, for example payments waiting on a payment rail that has failed. The move is an explicit operation that rewrites the stored decision for the records it names, with its own approval and audit entry, and never a re-read of the flag. Because the decision is stored, discrepancies found later, such as reconciliation breaks, failed refunds or short shipments, can also be grouped by the path that produced them.

When the flag service is unavailable, a web feature can default to "off" without harm. Where some users have already been moved to the new behavior, a default of "off" would silently send their new orders or payments down the old path, and then down the new one again when the service recovered. The safer rule is to fall back to the last known value, and to the old behavior only when there is not one.

### Kinds of flag

Pete Hodgson's article on [feature toggles](https://martinfowler.com/articles/feature-toggles.html) separates four kinds of flag, which differ in how long they should live.

- Release flags hide unfinished or unproven behavior. Hodgson's guidance is that they should not stay much longer than a week or two.
- Experiment flags split users between variants to measure a difference. They live as long as the experiment.
- Operational flags, including kill switches, let operators turn something off under load or during an incident. Some of these are permanent.
- Permission flags give a behavior to particular customers as a matter of product, and are long-lived by design.

The model rests mainly on release flags. The other kinds use the same machinery, which is part of why flags accumulate.

### Canaries, ramps, and experiments

Canaries, flag ramps and experiments follow the same loop, in which a subset is exposed and compared with the rest, and the exposure is then widened or reverted. They differ in what varies, who is exposed and the question being asked.

| | Canary | Flag ramp | Experiment |
| --- | --- | --- | --- |
| What varies | The binary | One behavior inside the binary | One behavior inside the binary |
| Who is exposed | Some machines | Some users or accounts | Randomly chosen users or accounts |
| The question | Is it broken? | Is it broken? | Is it better? |

Because the loop is the same, one infrastructure often serves all three. Google's experiment system was also its launch system. [LinkedIn's experimentation platform](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) ramps features independently of code releases. Uber built [automated rollouts with regression detection](https://www.uber.com/us/en/blog/autonomous-rollouts-regression-analysis/) on top of its experiment platform.

Wherever rules on the fair treatment of customers apply, as in lending, insurance, hiring or healthcare, the important difference is the question in the last row of the table. A safety ramp intends the same outcome for every customer and limits exposure in case something is wrong, whereas a product experiment deliberately gives customers different variants to learn which is better. The experiment raises questions about fair treatment that the ramp does not. A ramp that is described as an "experiment" attracts objections that apply only to real experiments, so the distinction should be stated explicitly, especially to risk and compliance.

### Changes a flag cannot guard

Some changes in a build cannot sit behind a flag. A library upgrade, a new database driver, a change to the runtime or a container base image belongs to the binary as a whole. Changes of this kind are the ones that leak memory and exhaust connection pools, which are the faults a soak exists to find.

The binary therefore still needs time under load, and under the new model it gets that time in production. The build goes to a small part of production first and stays there through a daily peak before it goes wider. This wait in production is usually called a **bake**, to distinguish it from a soak in pre-production.

In Amazon's pipeline, which is the best-documented example, each build goes to a single machine, then to one region, then outward in waves. Each stage has a minimum wait of between one and twelve hours and a minimum amount of real traffic that must be served before the build moves on. An alarm rolls the build back automatically. A change typically takes [four or five business days to reach every region](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/).

Amazon's elapsed time is therefore no shorter than a three-day soak. The differences are that builds enter the pipeline one after another, each carries only the changes made since the last, and the waiting is done on real traffic at limited exposure.

Daily deployment also restarts every process every day, so a slow leak may not show until a change freeze leaves a build running for two weeks. For runtime and library upgrades a deliberate multi-day bake should be retained, and it need not hold up the daily deployment of application code. The upgrade goes to a small part of the fleet and stays there for the length of the bake. That part keeps taking each day's application build, built on the new runtime, so that application changes reach it on the same schedule as the rest of production. Those daily builds still restart the processes, so a leak that appears only in a process left running for days would need a few hosts held back from daily deployment until the bake ends. No published pipeline describes this arrangement; it is the author's proposal.

## The techniques

A testing period looks for regressions, exercises load and elapsed-time behavior, gives people a chance to accept the change, bundles approval, and provides a back-out point. Dark launches, canaries, ramps, experiments and rollback each take over part of that work, and each has limits that its own practitioners describe.

### Dark launches and shadow traffic

"Dark launch" refers to dormant code, to shadow runs and, as at Facebook Chat, to simulated load on a new backend.

![Dormant code and a shadow run. Dormant: live requests go to the current code, and the new code is deployed behind a flag that is off, so nothing calls it. Shadow: live requests go to the current code and the user sees its result, while a copy of the traffic goes to the new code, whose result is compared with the current result and then discarded without any user seeing it.](figures/16-dormant-and-shadow.svg)

Dormant code is deployed behind a flag that is off. It has been merged, built and deployed, and has been shown not to disturb what is live, but nothing calls it. Dormancy allows unfinished work to merge to the main branch every day. Netflix used it to stop acceptance testing from blocking deployment, and the feature [stayed disabled in production](https://netflixtechblog.com/preparing-the-netflix-api-for-deployment-786d8f58090d) while testing continued.

In a shadow run, real traffic passes through the new code, the result is compared with what the old code produced, and the result is then discarded without any user seeing it. A shadow run tests correctness against real traffic and real data, which a soak against simulators cannot do. It reaches faults that need elapsed time only if it runs long enough at real volume, and it does not reach side effects or faults in the binary as a whole, which remain the work of the bake.

GitHub used a shadow run when it rewrote the code that merges pull requests. The team [ran the old and new implementations side by side](https://github.blog/2015-12-15-move-fast/) in production using a small library called Scientist, compared the results on tens of millions of merges, fixed mismatches for four days, and switched over after 24 hours with none. Square took a similar approach when it moved payment data to a new service, and reports that comparing the two paths ["actually caught a lot of subtle bugs"](https://developer.squareup.com/blog/breaking-up-with-your-monorail/).

Stripe's [migration of its subscriptions data](https://stripe.com/blog/online-migrations) applied the same idea to a data store, comparing reads from the old and new stores while the old one stayed authoritative, as one of a series of small reversible steps. In banking the same technique is known as a parallel run, in which two systems are fed the same input and their outputs are compared before the new one is trusted.

Shadow runs cannot be applied to code with side effects. GitHub's own post says that ["Scientist is not meant to be used for any code that has side-effects"](https://github.blog/2016-02-03-scientist/). A decision or a calculation can be shadowed, but sending an email, shipping an order or sending a payment cannot, so the shadow records what would have been sent and stops there. When Uber moved payment authorization to a new service, it could not call a payment provider twice for one authorization, so it [cached the old service's requests to each provider and the responses](https://www.uber.com/blog/migrating-functionality-between-production-systems). The new service ran on delayed copies of production requests, the request it would have sent was compared with the one actually sent, and the cached response was replayed to it. The comparison found dozens of mismatched arguments across providers, which took several iterations to fix.

Live comparison accumulates confidence slowly and does not reach data that is rarely read. When Uber moved its ledger to a new store, it set a bar that the new store be ["at least 99.99% complete and correct as measured by shadow validation"](https://www.uber.com/blog/migrating-from-dynamodb-to-ledgerstore/). Its engineers worked out that at a thousand records a second, six nines of confidence would take slightly more than a day of comparisons, and seven nines about twelve days, which they judged impractical. Live shadowing also missed records that were rarely read, so they compared stored data offline as well, 760 billion records in one job.

When a comparison harness writes mismatches to a table that nobody examines, the stage passes on elapsed time as a soak does, which is the failure Netflix described. Every mismatch needs an owner and a deadline, and the exit condition is zero unexplained mismatches over a stated volume.

### Canaries and bake time

A canary puts a new build on a small part of production and compares it with the rest before going further.

Early canaries were evaluated by hand. Netflix's account of its API in 2013 describes [a canary that ran for hours and was scored automatically](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0) against a baseline on a set of metrics. By 2018 its [Kayenta system](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69) compared a new cluster with a freshly launched copy of the old version under the same live traffic, and judged the difference statistically. Comparing against a fresh baseline matters, because a server that has been running for a week behaves differently from one that started ten minutes ago, for reasons that have nothing to do with the change.

Google's SRE Workbook has [the most careful account of what canaries cannot do](https://sre.google/workbook/canarying-releases/). Canaries need representative traffic, so they are weak on paths that few requests take. For batch and other non-interactive work, a canary has to span at least "a single work unit", and the longer a canary runs, the fewer releases fit in a week. A Google engineer writing about the company's canary analysis service [states](https://queue.acm.org/detail.cfm?id=3194655) that canarying is no substitute for unit testing, integration testing or monitoring.

Low-volume, high-value flows add the problem of too little traffic. A 1% canary gives little information about a flow of a few hundred large payments or enterprise orders a day, because there is not enough traffic for a statistical comparison. The exposure therefore has to be chosen by customer or transaction type, and the judgment rests on correctness checks more than on rates.

Shared state weakens a canary because the nodes of a service often write to one store, as the nodes of a ledger posting engine write to one ledger and the nodes of an order service to one inventory store. Putting the new build on one node limits its share of traffic without limiting the damage a bad write can do. A change to posting logic should be ramped by transaction, decided once at acceptance as under [Flag evaluation](#flag-evaluation), because a transfer posts to two accounts that a ramp keyed by account could place on different sides.

### Rings and ramps

A ring is a canary assigned to a defined population of users. Microsoft's guidance describes a major team that [deploys through five tiers](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices), starting with internal accounts that tolerate risk and bugs, with about a day's bake in each. Facebook's website [went to employees first](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), then 2% of production, then everyone. Slack [deploys to its own staff, then a 2% canary, then 10, 25, 50, 75 and 100%](https://slack.engineering/deploys-at-slack/).

![Seven published ramp schedules, including Facebook's website (employees, 2%, 100% in a few hours), Amazon (one box, first region, more regions, all regions over four to five business days), Slack (its own staff, a 2% canary, then 10% to 100%) and Uber's payment authorization (shadow, employees, 0.25%, 1%, 5%, 100%).](figures/06-published-ramps.svg)

<details>
<summary>Sources for the figure</summary>

| Schedule | Source |
| --- | --- |
| Facebook website, 2017 | [Facebook](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) |
| Facebook Android app, 2016 | [Rossi and colleagues, FSE 2016](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf) |
| Amazon services, 2020 | [Amazon Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/) |
| Azure DevOps | [Microsoft](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices) |
| Slack, 2020 | [Slack](https://slack.engineering/deploys-at-slack/) |
| Uber payment authorization, 2019 | [Uber](https://www.uber.com/blog/migrating-functionality-between-production-systems) |
| Uber ledger, 2020 | [Uber](https://www.uber.com/us/en/blog/money-scale-strong-data/) |

</details>

A ramp applies the same progression to one behavior, using a flag, where a ring applies it to a build. For a ramp, the unit of exposure matters more than the percentages, as Square found when it moved payment records to a new service using random percentages of requests. Its engineer wrote afterwards that this had hidden a regression which only appeared for a particular combination of client software versions, and that rolling out in a way that was [stable per merchant](https://developer.squareup.com/blog/breaking-up-with-your-monorail/) would have confined it to a few.

For a company whose customers are themselves businesses, the unit is the client, and a client has to agree to go first, which is a constraint a consumer website does not have. The size of each stage is still measured in the units by which harm is counted, such as transactions, value or end users, and seldom in the number of business clients, since one large client can carry more volume than hundreds of small ones.

How long to hold each step depends on how long the evidence takes to arrive. Microsoft studied this for Office and found that when an early-ring rollout moved a guardrail metric at all, [79% of those movements showed within the first three days](https://microsoft.com/en-us/research/uploads/prod/2020/06/Safe-Velocity-ICSE-SEI.pdf) and the rest by day seven. The slowest signals are often business outcomes, such as returns in retail, renewals in subscriptions, and reconciliation and period ends in payments, and where they apply they set the pace.

### Shared state and aggregate jobs

Some work computes one result from everyone's activity, and so cannot be given to a few customers first. A billing run, the allocation of stock across warehouses, a settlement netting calculation and an end-of-day batch each read the whole population and write one answer, and a new version run for 1% of customers would produce a different answer that every customer then sees. The per-account steps of a batch, such as fees, interest and statements, can still be ramped by account.

Such a job should be released by running the new version beside the old one on the same input, with only the old output used, until the two agree. The new version's output goes only where nothing downstream acts on it, such as a table that no ledger posting, settlement file or statement reads, and where the batch window cannot hold both runs before the cut-off, the new version can run afterward on a copy of the same input, since nothing waits for its output. The comparison should cover at least one real cycle, and it should include a period end such as a month-end or a year-end, because accruals, statements and fees often run only then. No organization that deploys continuously appears to have described how it validates changes to period-end jobs, although a three-day soak rarely covers a month-end either.

Shared components that serve every customer, such as the gateway to a payment scheme or a message broker, should be ramped instead by partition, transaction type or amount band, so that each stage carries a bounded slice of the shared traffic. A component that runs as one active instance, such as a gateway holding a single scheme connection, cannot take a canary by machine. Its new build goes onto the standby and takes over by failover, with failback as the rollback, and its new behavior stays behind flags ramped in the same way. The failover leaves messages in flight to reconcile, so it should be rehearsed and kept away from cut-offs.

Some controls cannot be ramped at all, because a rule requires them on every transaction or every customer, such as sanctions screening or checking a buyer's age. A new version cannot go to 1% of transactions while the rest go unchecked, and the old one cannot be withdrawn from a share of them. The two versions instead run side by side, a transaction is stopped if either one stops it, and the old version is removed only after the new one has stopped everything the old one did. Running both stops more transactions than either would alone, so the people who review stopped transactions need capacity for the extra cases.

### Experiments

An experiment gives a randomly chosen group the new behavior and measures the difference from everyone else.

Experiments are run because careful people are poor at predicting which changes help. At Microsoft, [only about a third of well-designed experiments](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf) improved the metric they were built to improve. Re-implementations that are meant to change nothing are no exception. A later paper from the same group describes a re-implementation of an order pipeline at Amazon that was believed to be equivalent to the old one, [lost 2% of revenue in its A/B test, and shipped after five iterations](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf).

Booking.com applies the practice most broadly. Its engineers write that ["every change... is wrapped in an experiment"](https://arxiv.org/abs/1710.08217), with more than a thousand running at once.

Experiments on products whose outcomes for customers are regulated are published less often, and the published examples from banks are mostly about interfaces, support flows and communications. Monzo, a UK bank, describes [a set of launch tools](https://monzo.com/blog/2023/08/03/how-we-launch-new-products-at-monzo) that includes staff testing, an opt-in group, randomized experiments and staged rollouts, and says it ran an experiment on a change to a credit product's payment dates "to make sure it didn't lead to bad outcomes".

In the UK, the FCA's [guidance on the Consumer Duty](https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf) says that customers' understanding "could be tested directly by conducting randomised controlled trials or A/B tests". In the Netherlands, the AFM has [described banks and insurers running A/B tests on customers](https://www.afm.nl/~/profmedia/files/rapporten/2025/rapport-verkenning-toepassing-gedragsinzichten-banken-verzekeraars.pdf) and questioned how they were run and read, not whether they should be.

Experiments need enough traffic to detect a difference, and results that take weeks to mature need experiments that run for weeks. Most changes to a system's internals, such as a new ledger store or a rewritten payment router, are meant to leave every outcome unchanged, so they call for a safety ramp and do not need an experiment.

### Rollback

"Rollback" can mean switching traffic back to the old version, redeploying the kept build, or rebuilding the old source, and the third of these is unsafe under pressure.

![Rollback methods: a traffic shift back to a previous version that is still running; a redeploy of the kept build, identified by its hash; and a rebuild from an earlier source revision. Rollback does not reverse data written, schema migrations, messages sent or payments made.](figures/09-three-rollbacks.svg)

Switching traffic back requires the old version to still be running. Netflix was [deploying this way by 2012](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1), bringing up the new version beside the old, moving traffic across, and keeping the old one until the new one was trusted. The switch takes seconds to minutes, and it costs the capacity to run two versions at once.

Redeploying the kept build depends on a rule from Jez Humble and David Farley's *Continuous Delivery*, which is to [build the binary once](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3) and deploy that same binary, identified by its hash, to every environment. One of their reasons was audit, since the rule proves that what was tested is what runs. It also means a rollback returns production to something that has already run there.

Rebuilding the old source means checking out an earlier revision and building it again. The result is the same as before only if the build is perfectly repeatable, and a team that has not verified this will learn of any difference during an incident.

Whichever kind is used, the previous build has to be able to read what the newer build wrote. With daily deployment and a bake, production is running two versions on the same queues and tables every day. Amazon's guidance on [rollback safety](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/) identifies protocol and format changes as the most common reason a rollback fails, and handles them in two deployments: the first teaches the software to read the new format, and the second, days later, starts writing it, so that either can be rolled back alone. Amazon also tests the rollback itself. In a production-like environment under simulated traffic, the new build is deployed to half the fleet, the deployment is completed, and then it is rolled back.

A rollback that has never been run is itself an untested change, and it is made during an incident. RBS experienced this in June 2012, when it backed out an upgrade to its batch scheduler and the back-out caused the incident. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf) says the bank "had only tested the consequences of backing out Version 2 to Version 1", and what was installed was a patched variant, Version 2A. At least 6.5 million customers were affected.

Google advises making rollback routine. Its guidance for cloud customers says that when a fault is suspected in a new release, Google's own releasing team ["rolls back first and investigates the problem second"](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons), and that a team that has gone a few weeks without a rollback should perform one deliberately. A Google engineer writing about [generic mitigations](https://www.oreilly.com/content/generic-mitigations/) puts the risk this way: "Far too many think they have safe rollbacks, only to learn otherwise during an outage."

Switching a flag off is a lighter reversal than any of these, and Facebook [preferred it to reverting a build](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) where it could. A flag reverses only one behavior, however, and a flag that has been fully on for months has an off path that nobody has exercised.

### Automated rollback

The next step after rehearsing rollback is to have the pipeline perform it. [Amazon's engineers note](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/) that an automatic rollback is often already under way by the time the on-call engineer has been paged, and [Monzo's rollbacks](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale) use the same application metrics that drive its alerts. Slack reports that [73% of its customer-facing incidents were triggered by its own changes](https://slack.engineering/deploy-safety/). By Slack's own figures, customer impact hours fell by 90% from their peak in early 2024 to January 2025, during a program in which automatic rollback was one of many parts.

Automated gates produce false alarms, and Meta's paper on [its deployment system](https://www.usenix.org/conference/osdi23/presentation/grubic) reports that a human allowed the deployment to proceed after health checks had flagged it in 11.5% of deploy actions for regular services and 41.3% for large ones. At those rates overriding becomes habit, and Facebook's earlier configuration paper records an engineer overriding a correct canary rejection on the assumption that the tool was wrong.

Neither Slack nor Monzo started with automatic rollback. Slack built alerts with manual remediation first, and Monzo automated rollback in late 2022, after daily deployment was already established.

### Deployment windows and freezes

Daily deployment still runs within set hours. Amazon's pipelines deploy only in [time windows](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/) chosen so that engineers are available to respond, which exclude nights, weekends and holidays, and many of its teams also exclude Fridays and late afternoons. The same guidance warns that windows that are too short let changes pile up, which raises the chance that one of them causes harm. A system with fixed outside deadlines, such as a payment scheme's cut-off times or a carrier's collection times, would add them and its batch windows to the calendar that its pipeline enforces. A fault introduced in those periods has little time to be found, and rolling back can leave a batch step half done. Where instant payments must be receivable at all hours, every deployment and every rollback also has to complete without taking the service down. A shadow comparison on the instant path then has to run off the request path, since the bank's own processing gets only part of the [ten seconds](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R0886) that EU rules allow for a whole euro instant payment.

Shopify, which [deploys about 40 versions a day](https://www.shopify.com/news/preparing-the-back-end-for-black-friday-and-cyber-monday) in normal times, planned to narrow its pace for November and December 2020, ahead of its seasonal peak, with fewer pull requests in each deploy and longer canaries. In repositories flagged as critical to the peak, a bot asked that features merchants would see ship only with the approval of a director or general manager, and Shopify planned to [lock deploys for a week](https://shopify.engineering/organizing-2000-developers-bfcm-remotely) around the Black Friday weekend, as it had in the past. Its engineers wrote that the arrangement cost them developer productivity.

N26, a German bank, keeps a [production freeze at the end of the year](https://newsletter.pragmaticengineer.com/p/code-freezes) with urgent fixes exempt. A freeze of this kind is compatible with the model as long as switching a flag off and rolling back a build remain available throughout, since those are the actions that contain an incident during the freeze.

## Changes with effects that cannot be undone

Kent Beck, writing about Facebook's habit of making decisions reversible, [set some cases aside](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility): "Decisions affecting people's privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible." Switching a flag off does not recall a payment that has been sent, an email that has been delivered or an order that has shipped. What it can do is limit how many of them a fault reaches before someone notices. Recovery after that relies on the business's own means, such as a recall request that the payee may refuse, or correcting entries in a ledger that is never edited in place, which customers then see on their statements.

Before anything is sent, the path is decided once and stored with each record, and the new logic runs in shadow first. A cap then limits what the new path may do in a day, such as the number of orders it may ship or, in payments, the total value it can move, which is kept well inside the liquidity that every other payment also draws on. The cap is proposed here; the stored decision and the shadow run are described under [Flag evaluation](#flag-evaluation) and [Dark launches and shadow traffic](#dark-launches-and-shadow-traffic).

A wrong payment or a wrong shipment often raises no error, so faults are found by checks on correctness. Monzo's [coherence checks](https://monzo.com/blog/2022/02/08/processing-payments-safely-at-scale) can catch a bug that affects 0.1% of payments without raising any error, and reconciliation catches what they miss, more slowly: Stripe [verifies 99.99% of its dollar volume within four days](https://stripe.dev/blog/ledger-stripe-system-for-tracking-and-validating-money-movement). A stage on a money path should therefore last at least one reconciliation cycle, and every break has to be traceable to a ramp. The path stored on each record usually allows this, and where a reconciliation cannot group its breaks by path, only one ramp should feed it at a time. A retail return can come weeks later, and under [PSD2](https://eur-lex.europa.eu/eli/dir/2015/2366/oj/eng) a consumer can reclaim a euro direct debit for eight weeks and report an unauthorized payment for up to thirteen months. The old path therefore stays deployed until the first stages' refunds are in, and claims against payments made on either path are handled for as long as they can arrive. The flag that sends new payments down the new path can still be removed once it reaches 100%; what stays is the code that handles returns and claims for payments recorded on the old path.

Payment systems have published the most about working this way. Uber ramped its [new payment-authorization service](https://www.uber.com/blog/migrating-functionality-between-production-systems) one payment method at a time after shadowing it, Adyen describes ["a centralized and systematic approach to the separation of code deployment and activation"](https://www.adyen.com/knowledge-hub/from-0-100-billion-scaling-infrastructure-and-workflow-at-adyen), and Wise reported [more than 150 deployments a day](https://medium.com/wise-engineering/state-of-our-ci-cd-pipeline-part-2-29bd17515e6f) in 2022.

## Changes that depend on an outside party

A train makes every change wait for the slowest party outside the organization, such as a partner's test window, a payment scheme's certification, a customer's notice period or an app store's review, even when the change touches none of them. In payments, for example, a scheme, which sets a network's rules and message formats, certifies only the gateway that connects to it. Separating deployment from release lets only the change that touches the outside party wait for it.

| Outside party | What has to wait for it | What does not |
| --- | --- | --- |
| A partner's test window, including a sponsor bank's | A change to what the partner receives, including retries, timeouts and submission rates | Every change behind the interface |
| Certification by a scheme or settlement service | Joining or taking up new functionality ([TIPS](https://www.ecb.europa.eu/paym/target/target-professional-use-documents-links/tips/shared/pdf/tips_certification_test_cases_participant.pdf)); a new version of a vendor's certified gateway software ([Pay.UK](https://www.wearepay.uk/what-we-do/third-party-assurance/technical-aggregator-solution-providers-and-consultants/fpsl-fee-structure-technical-accreditation/)) | Internal releases behind the gateway, which neither document asks to be recertified |
| A network's effective date | The switch-on, at a timestamp set in advance | The code, which can ship dark weeks earlier |
| Business clients' test environments | The production release, which waits until clients have tried the behavior, switched on in the sandbox where they test their integrations | The deployment, which reaches the sandbox as the same build with its flags off |
| Customers' notice periods, including the three months' notice that the PSD2 standards require before a bank changes the interface third-party providers use to reach its accounts | The release to each customer | The deployment, which customers cannot see |
| Teams or customers that call an API or read its files, such as statements loaded into a client's accounting system | Removal of the old form: [Stripe](https://stripe.com/blog/api-versioning) pins each account to the API version current at its first request, and [Shopify](https://shopify.engineering/shopify-manages-api-versioning-breaking-changes) publishes a new version every three months | Every deployment that keeps both forms working |
| Installed software: apps, terminals, on-premise | The binary, which cannot be withdrawn once installed and, for apps, is [reviewed](https://developer.apple.com/distribute/app-review/) and staged by the store: [Apple](https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/) phases an update from 1% to 100% of users over seven days, and on [Google Play](https://support.google.com/googleplay/android-developer/answer/6346149) users who received a halted rollout remain on that version | Behavior inside it, switched on from the server |
| A vendor's core system | The vendor's own upgrades | Routing decided before the core, which could send a share of traffic around it, although no organization appears to have published doing so |

A change to a partner interface ships dark, is switched on in the partner's test environment when the partner allows, and goes live first on the organization's own account at low volume. [Bacs onboarding](https://www.wearepay.uk/wp-content/uploads/2026/02/Pay.UK-Bacs-System-Principles-V18-Jan-2026.pdf) ends in a similar way, with a go/no-go call and a first live transaction before first settlement. Duffel, whose product is a connection to airlines' booking systems, wrote in 2022 that it [deploys several times a day](https://duffel.com/blog/how-to-build-a-flights-api-exploring-our-tech-stack), releases features behind toggles and tests its booking flows against the airlines' own sandboxes. Notice periods apply to releases, which customers can see, so a train must wait for the longest notice period of any customer, while a per-customer flag releases to each customer when that customer's notice ends.

What an integration environment used to catch between teams can be caught by contract tests instead. Nubank [removed its end-to-end suite](https://building.nubank.com.br/why-we-killed-our-end-to-end-test-suite/) after one experiment found 42 failures in every 1,000 runs, only one of them a bug, and afterward its time from merge to production fell to about 20 minutes and its deployments rose from at most a hundred a week to around a thousand. It added in-memory acceptance tests, because "Contract Tests can catch structural incompatibilities, but they are not good in testing behavior", and [GOV.UK Pay](https://technology.blog.gov.uk/2019/01/29/lessons-learnt-using-contract-testing-in-gov-uk-pay/) kept running its old end-to-end tests while it moved them to contract tests.

Some network changes still cannot be split. The ECB planned the consolidation of TARGET2 as a big bang, partly because there would be ["No co-existence of ISO20022 and MT messages"](https://www.ecb.europa.eu/paym/groups/shared/docs/7e0e7-ami-pay-2018-11-20-joint-ami-pay-ami-seco-item-03.2-4-t2-t2s-consolidation-big-bang-mitigation.pdf). The Bank of England delivered its new settlement system in stages but still [switched the core over one weekend](https://www.nao.org.uk/wp-content/uploads/2025/12/the-bank-of-englands-real-time-gross-settlement-system-renewal-programme.pdf), because the old and new systems could not run together.

Facebook kept a [three-day soak on employees](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf) for its iOS app while switching behavior inside its apps on and off from the server with its Gatekeeper flags. Because the regression Square found under [Rings and ramps](#rings-and-ramps) appeared only for one combination of client versions, a ramp of server behavior that installed clients depend on should be keyed by client version as well as by account.

## Ownership and culture

The published accounts describe new responsibilities for authors, service owners, testers, release managers, approvers and whoever is on call.

### Authors own the flag

Under this model the author's job no longer ends at the merge, as it does on a train. The author of a change decides what the flag guards and how the disabled path behaves, builds the shadow comparison, writes the ramp plan with its stop conditions, and deletes the flag when the ramp is done.

This is more work per change, and it asks people to plan for being wrong. The existence of a tool does not produce the habit, which follows what code review asks about, what counts as done, and what is recognized in performance reviews. Microsoft's experimentation team [wrote in 2009](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf), after three years of trying to spread a related habit, that most goals in the company were still about shipping, and doubted they had changed many people's objectives.

The mechanism should also be built by the engineers who use it. John Allspaw ran operations at Flickr, and when he left he wrote [a letter to the management above him](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/) explaining how the site had stayed up while changing many times a day. He stated explicitly that the dark launches and flags were built by the developers and not by operations.

### Service ownership and on-call

Werner Vogels stated the principle in 2006: ["You build it, you run it."](https://queue.acm.org/detail.cfm?id=1142065) The reasoning is that the people who feel a service's failures are the people who can fix their cause.

Netflix's account is the most useful, because it records an intermediate model failing. For a period its developers could deploy but a release specialist remained. The developers often deferred to the specialist, and the specialists found it hard to make time to automate the job. Full ownership worked when it was backed by central tooling teams, training and spare capacity. [The post says](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) that without those, "teams risk overload and burnout".

### Testers and release managers

This model changes what testers and release managers do, and the companies best known for it kept people in both roles.

Google moved testers out of product teams' reporting lines and turned many of them into tool builders. James Whittaker, who ran testing there, [wrote that](https://testing.googleblog.com/2011/01/how-google-tests-software.html) "it's the product teams that own quality, not testers". Google nevertheless kept test engineers, and the change took about five years and was driven at first [by volunteers without executive backing](https://martinfowler.com/articles/testing-culture.html).

Microsoft's Azure DevOps group merged its development and test organizations and rewrote its tests over more than two years. Brian Harry, who ran the group, [described the cost](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/). A separate test discipline had given the organization a measurable, controllable investment in testing and a career path for testers, and both were given up. He also admits that eighteen months in, he started asking when it would be finished.

Facebook had [no separate QA team](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf) in 2013, but its few release engineers tracked how often each engineer's code caused problems and gave more oversight to those whose code did, and an engineer who was absent during a push had the commit reverted.

The people who run the train today know where its faults have occurred. Their work moves to the comparison tooling, the pipeline and the review of ramp plans, and they should be told so early.

### Approvers

Flickr's operations team held a go or no-go decision on launches, alongside the other groups involved. Allspaw's letter describes what he did with it: "A significant part of my job was working towards saying 'go', not 'no-go'." Speed remained conditional on safety, and in his words, "When it wasn't safe, we slowed, and everyone was fine with that happening".

A change board can work the same way. Its members keep the authority to refuse, and their work shifts to approving ramp plans, setting stop conditions, and deciding which kinds of change are pre-authorized.

### Rollback authority

Whoever is on call needs the authority to switch a flag off or roll back a build without asking, and should be recognized for using it. Google's guidance says nobody should be asked to justify a rollback as long as its record describes the problem. Booking.com's rule is that ["Everyone in the company must be able and feel empowered to stop harmful experiments of their own accord."](https://arxiv.org/abs/1710.08217)

A kill switch is a control only if the people on call can find and operate it. In November 2014 Visual Studio Online had an outage of seven and a half hours caused by a change in the database service beneath it. Harry's [write-up](https://devblogs.microsoft.com/bharry/outage-on-monday-nov-24) says that once the change was identified, it took approximately 45 minutes to work out how to turn off the flag behind it, because of tooling problems and missing documentation.

### Responding to failure

Once an organization has started moving off the release train, its response to the first serious incident can decide whether it keeps going or returns to the old process. OANDA had deployed continuously for several years when a failure ["cost the company a significant amount of money within seconds"](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf). Senior management's first reaction was to ask for more approvals and a separate, traditional testing team. The post-mortem then found that the unit tests had caught the bug and that their failures had been ignored among false alarms, so additional approvers would have been approving a change whose own tests had already failed. The engineers argued for a renewed focus on automated testing instead, and prevailed.

Management's first reaction at OANDA is the one the 2019 State of DevOps report found across its survey, in which organizations ["often respond to problems with software releases by introducing additional process and more heavyweight approvals"](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf), and its analysis suggested that this makes things worse. John Allspaw's essay on [blameless post-mortems](https://www.etsy.com/codeascraft/blameless-postmortems) explains why the first question matters. An engineer who expects to be punished stops supplying detail, so management learns less about how the work is actually done.

OANDA's direction also changed without an incident when executives more inclined to traditional process took over in mid-2012, and with much the same engineering team, [deployments fell by 23%](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf).

### How long the transition takes

Published accounts of this transition describe it as taking years, and Microsoft's is the most detailed. On the morning Microsoft launched Visual Studio 2013, Harry's team switched on a batch of feature flags. The service became unresponsive at peak, and switching the flags off did not bring it back. Harry [wrote it up](https://devblogs.microsoft.com/bharry/a-rough-patch/) in detail. One lesson he drew was that the service ran as a single instance, so that, flags aside, "all customers are affected or none", and a flag could therefore not confine a fault to a subset of customers.

One remedy was to deploy at weekends, which he called a mitigation rather than a fix. Another was [a separate instance for accounts that volunteered](https://devblogs.microsoft.com/bharry/visual-studio-online-update-feb-10/) to take every deployment first, and Harry said his own account would be on it. By 2017, [Harry wrote](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/), the change had taken about six years and was not finished. His judgment was that trying to do it all at once would have failed.

LinkedIn took a different route and [stopped feature development](https://www.linkedin.com/blog/engineering/architecture/brief-history-scaling-linkedin) for a period in late 2011 to rebuild its tooling. Eight years later it wrote that its teams had [traditionally relied on a manual release process](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment), and described moving key services from a few releases a week to several a day.

## Failure modes

Published failures of the model have mostly come from adopting only part of it, such as flags without removal, staged deployment without staged activation, or staging that some kinds of change bypass.

### Flag debt

Flags are cheap to add, but each one carries a continuing cost. Every flag that is on for some users and off for others means production is running more than one system, while the regression pack tested one. Every change made near a live flag has to work in both states. The old path stops being exercised on the day the flag reaches everyone, and after that, switching it off is an untested change.

A study of Chrome found its flags growing [from 263 to 1,040](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf) over the releases it examined. Uber eventually [built a tool to remove stale flags](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf) and deleted 1,381.

A release flag is meant to be removed, along with the old code path, once it reaches 100%, and flag debt builds up when that last step is skipped. Tooling can prevent it by giving every flag an owner and an expiry date, warning in the build as the date approaches and failing the build once it has passed, with kill switches meant to be permanent registered as such and exempt. A per-service limit on live release flags, and a rule that a flag name is never reused for a different purpose, keep the count down.

![The life of a release flag: created with an owner and an expiry date, ramped so that it is on for some users and off for others, at 100%, then removed with its old path. The build passes, warns as the expiry date approaches, and fails once it has passed. While the flag is ramped, production runs both paths; after it reaches 100%, the off path is no longer exercised and switching it off is an untested change.](figures/17-flag-lifecycle.svg)

### A reused flag and an incomplete deployment

According to the SEC's order, Knight's new code reused a flag that had once activated an old function called Power Peg, which had not been used since 2003 and had been left in the code. The new code was deployed in stages over several days. A technician did not copy it to one of the eight servers, and no second person checked. Before the market opened on August 1, the system sent 97 automated emails referring to the problem, and nobody acted on them. When orders carrying the flag arrived, seven servers ran the new code and the eighth ran Power Peg. In about 45 minutes Knight's system produced 4 million executions in 154 stocks and ended up with positions that cost it more than $460 million. During the incident, the firm uninstalled the new code from the seven servers where it had been deployed correctly, and in the SEC's words, "This action worsened the problem."

![Knight Capital: eight servers, seven with new code and one with old code; a timeline from staged deployment beginning July 27 to activation everywhere at the market open on August 1; about 45 minutes, 4 million executions, over $460 million lost.](figures/10-knight-capital.svg)

Under this model flag names are never reused, dead code is deleted, a machine check confirms that every node runs a build containing the flagged code before any flag moves, and rollback follows a rehearsed procedure, so each step of the failure has a control. The SEC found that a written double-check of the deployment, or monitoring of the warning messages, could have prevented the event, and that Knight needed clear guidance on when to disconnect a malfunctioning system from the market.

### Dormant code activated everywhere at once

In June 2025 a Google Cloud outage came from code that had been rolled out region by region and never exercised, and was then triggered everywhere at once by a policy change. The staged deployment controlled where the binary was installed, and because the code was never executed during that deployment, the stages provided no evidence about it. Google's [incident report](https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW) says the code "did not have appropriate error handling nor was it feature flag protected", and commits that all changes to critical binaries will be "feature flag protected and disabled by default".

### Change types that bypass the ramp

Configuration, flags, reference data and operator scripts are changes too, and any of them that can reach every system at once carries the same risk as an unstaged release. CrowdStrike staged the rollout of its software but not of the content files the software reads. Its [analysis of the July 2024 outage](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) concludes that each such file "should be deployed in a staged rollout". Cloudflare's 2019 outage came through a channel for firewall rules whose procedure, [in Cloudflare's words](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/), "allowed a non-emergency rule change to go globally into production without a staged rollout". The flag service, the configuration system and the rollback tooling are themselves production systems and need their own staged rollout.

### Single-event migration without rollback

The opposite failure is a single large migration with no way back. TSB moved 5.2 million customers to a new platform over a single weekend in 2018, with testing cut short and no ability to roll back. It received 225,492 complaints and was fined £48.65 million by the FCA and the PRA together. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) found that fuller testing of the bank's two-data-center configuration would likely have found the fault, so TSB's failure was one of testing as well as of batch size. New Zealand's schools payroll, Novopay, followed the same path outside banking. The ministry had judged a big bang "unacceptably hazardous" and planned a staggered rollout with parallel runs, then removed the pilot and phased rollout under deadline pressure and went live for every school at once in 2012, after its contingency option had lapsed. The [ministerial inquiry](https://d2xgqyuql1olth.cloudfront.net/assets/images/MIN130501-Inquiry-Report-web%20%281%29_0.pdf) called the decisions to remove them "ill-advised and counter to good practice".

### A stalled transition

The move off the train can also stall without any single incident. A pilot on an internal reporting service can be declared a success after two quarters without teaching anything about stored decisions, irreversible actions or reconciliation. A change board can approve each ramp step as if it were a release, so that the ramp takes longer than the train did. Deployment frequency, once it becomes a target, is inflated with trivial deployments, and the 2017 State of DevOps survey found that its lowest-performing group had [sped up and reported more failures](https://dora.dev/research/2017/2017-state-of-devops-report.pdf).

## Change control and audit

Where the release train is written into the change policy, the change board's approval and the sign-off after the soak are controls that the auditors test. A team cannot stop running the train without changing the policy, and if the policy stays as it is, each ramp step can end up raised as a release and the ramp can take longer than the train did ([A stalled transition](#a-stalled-transition)). The usual objection is that auditors and regulators require the existing process, but the rules on change and an organization's own change policy are different documents, and only the policy describes a train.

### What the rules require

The rules on software change, general and financial alike, ask for broadly the same things:

- a record of every change
- testing in proportion to the risk
- approval by someone other than the author
- segregation of duties
- a way back

The texts behind them include the controls that auditors test for SOX and SOC 2, ISO 27001, the UN regulation on vehicle software updates, the FDA's guidance on planned changes to AI-enabled medical device software, and financial rules such as the EU's Digital Operational Resilience Act (DORA). [None of them requires](appendices.md#what-regulators-and-auditors-accept) a soak period or a release train.

### What auditors test

Auditors test an organization against its own change policy and control descriptions, and at a company that runs a train those documents describe the train. A company that gives its business clients an ISAE 3402 or SOC 1 report passes those descriptions on to the clients' auditors, and a report covering a period has to describe [relevant changes to the system](https://www.iaasb.org/publications/2023-2024-handbook-international-quality-management-auditing-review-other-assurance-and-related) made during it, so a policy rewritten partway through a period appears in the next report as a change. The work is therefore to rewrite the policy, with risk and audit as co-authors from the start. Rewritten for a pipeline, the controls take these forms, the first two as regulated firms have published them:

- Authorization is a reviewer other than the author, enforced by the pipeline. Monzo describes a policy that requires [at least one other person to review every change](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform).
- Segregation is the absence of standing human access to production, with the pipeline as the only way in. A Capital One technology governance director [wrote about this arrangement](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/), and the company's pipeline has [sixteen gates](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/), among them an automated change order and automated rollback.
- Evidence is an immutable log that ties commit, review, test results and deployment together.
- Exceptions are break-glass access with alerts and a review afterwards.

Human gates can stay in such a pipeline. In 2025 Starling Bank [required three layers of approval for every release](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), the last of them a business approval from an engineering lead, director or executive, and was releasing several times a day.

### Classifying flag changes

A flag change in production is a change under these rules, since DORA's standards, for example, set no threshold of materiality ([Constraints in the EU standards](appendices.md#constraints-in-the-eu-standards)). How flag changes are classified therefore decides whether a ramp runs faster than the train. The rules that ask for a way back are met by a kill switch, abort criteria fixed in the ramp plan and a rehearsed rollback.

The figure below gives one classification that fits these provisions. The code that introduces a flag is an ordinary change, the ramp plan is approved once, and each step within the plan is a standard change under dual control, while a step outside the plan is a normal change. Switching a flag off or rolling back is pre-authorized, so the on-call engineer can do either without asking, and the action is reviewed afterwards. The state of every flag on any date can be produced as evidence.

![Change classes for a flag. The code that introduces the flag goes through normal review and deployment. The ramp plan, with its stages, holds, population, caps and stop conditions, is approved once. Each step within the plan is a standard change under dual control and logged, and a step outside the plan is a normal change. Switching the flag off or rolling back to the previous build is pre-authorized and reviewed afterwards. The state of every flag on any date can be produced as evidence.](figures/20-flag-change-classes.svg)

## Evidence

The best-supported claim is that small, frequent, carefully exposed change is compatible with high stability, which is what the [FCA's review](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) under [Limits of pre-production testing](#limits-of-pre-production-testing) found. Between 2008 and 2014 Facebook's developers grew roughly twentyfold and its deployments with them, and [the paper on Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) reports that "the number of critical issues arising from deployments was almost constant regardless of the number of deployments". One group at the Financial Times, the newspaper, went from about twelve releases a year, of which one or two failed, to about 2,500 in 2017 with, [by its own count](https://www.infoq.com/presentations/microservices-financial-times/), fewer than 25 failures. Companies whose actions cannot be undone, such as Monzo, Wise and Adyen, [work the same way](#changes-with-effects-that-cannot-be-undone).

The record also supports a second claim, that heavy external approval does not improve stability, although the support consists of surveys and associations and includes no experiments. The State of DevOps surveys found in [2014](https://dora.dev/research/2014/2014-state-of-devops-report.pdf) and again in [2019](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf) that external change approval slowed delivery with no measurable benefit to stability, and the change-board approval rates in the FCA's review point the same way.

The record has gaps. No organization in a regulated industry that left a release train has published a before-and-after incident record, and the banks that release many times a day were built new, with no mainframe core to move off. There is also no published figure for how many faults a soak catches per day of waiting, or how many a canary catches, so whether the approach would improve a particular organization's numbers can be established only by that organization's own trial.

## What should change

1. Deploy small changes every day, with new behavior disabled by default.
2. Release each behavior separately: to no one first, then in a shadow run where the code has no side effects, then to a small named group, then to everyone.
3. Move the soak into production as a bake at limited exposure, and keep a pre-production hold only for changes that cannot be ramped.
4. Make rollback routine. Restore a retained build, rehearse the procedure, and allow on-call engineers to execute it without prior approval.
5. Make the author of a change responsible for its flag, its ramp plan and the removal of the flag afterward.
6. Make the team that writes a service responsible for deploying and operating it.
7. Move approval from scheduled meetings to peer review, pipeline evidence and pre-authorized change types, defined jointly with risk and audit.
8. Treat flags, configuration and reference data as changes, and stage them as code is staged.
9. For [data and models](data-and-models.md), release new versions beside old ones: publish tables only after checks pass, give every changed feature a new version, bind each model to the data versions it was trained on, and shadow a model before it makes decisions.
10. Fund central teams to build the flag service, the pipeline and the comparison tooling before product teams are asked to own their releases, as [Netflix](#service-ownership-and-on-call) did.

## Getting started

These first steps can all be taken while the train keeps running, and the train is then retired one service at a time.

### Measurement before and after

The answers to these questions show how much the current process costs and what it catches.

1. Of the three days, how many hours are work, and how many are waiting for an environment, a window or a person?
2. What did the soak catch in the last year, by class of fault, and what reached production in spite of it?
3. How many changes were in the train behind each of the last five incidents, and how long did it take to find the one responsible?
4. How many changes did the change board reject or send back last year?
5. How long did the last real rollback take, who authorized it, and had that path been rehearsed?
6. How do hotfixes, which skip most of the three days, compare with trains in failure rate?

If the soak proves to catch faults that nothing else would, and most of the three days prove to be work, the gain from leaving the train is smaller than the estimate under [Lead time](#lead-time).

After the first service has run under the new model for two quarters, the same measures are taken again, for that service and for comparable services still on the train:

- lead time from finished to live
- the share of changes that cause an incident or a rollback
- the time to restore service after a failed change
- deployment frequency, reported only beside the change failure rate
- the number of release flags past their expiry date

The first three are measured as the [State of DevOps surveys](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf) define them, so that the results can be compared with the surveys' published figures.

### A pipeline for the existing process

The first step is to encode today's process in a pipeline, manual approvals included, as Amazon told its skeptical teams to do, ["manual steps and all"](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/), and then to automate one step at a time as confidence grows. Such a pipeline removes no control, produces the record that auditors ask for on every change, and shows where the waiting is.

### A first service

The first service should be one the team owns outright, with no vendor package or mainframe in its path. It should also matter, so that the trial teaches something about the organization's real risks, for example a service that moves real money at low value or takes real orders. Where most code is in one monolith, no single team can leave the train alone, because the binary is deployed as a whole. The binary would then move to daily deployment with a bake, as under [Changes a flag cannot guard](#changes-a-flag-cannot-guard), while one team releases its behavior inside it by flags, a sequence proposed here.

Its change policy is agreed with whoever owns risk and audit before any code moves, with dark deployment, shadow runs, flag steps and rollback as defined kinds of change. Where a regulation treats testing in production as an exception, any stage that might count as one is recorded as an approved instance. The monitoring, idempotency and rollback the service needs are built first. Its metrics are reported separately for each build and each flag state, because a fault that reaches 1% of users does not show in the service's totals. The manual regression checks that guard it are automated or retired, because a ramp would otherwise wait for a manual pass at every step. Its first users are the organization's own accounts, followed by one customer willing to go first.

### Stop conditions

The trial stops on any irreversible harm traced to a ramp, such as money lost or data corrupted, or on any reconciliation break or failed correctness check that is traced to a ramp and not explained within one reconciliation cycle. It also stops if the measures taken after two quarters are no better than the baseline.

### Cost

The tooling has a continuing cost. When [Savor and colleagues](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) wrote their paper, about 5% of Facebook's engineers and 15% of OANDA's were building and maintaining deployment tools, and the authors observed that continuous deployment is harder for smaller companies, because those tools take a larger share of their engineering. OANDA spent two years developing continuous deployment for its mission-critical systems. Uber's move of its money-movement ledger platform to a new system, ramped by percentage within each country, was [a two-year cross-team effort by more than 40 people](https://www.uber.com/us/en/blog/money-scale-strong-data/). Monzo wrote that for automated rollback ["migration and tooling work was >90% of the effort"](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale). At an organization of 400 engineers, the shares at Facebook and OANDA would come to between about 20 and 60 people. No organization has published what a shorter lead time was worth to it, so the value would have to be estimated from the organization's own baseline, such as the hours spent on release coordination, on hotfixes and on finding the faulty change in a batch, which the questions under [Measurement before and after](#measurement-before-and-after) record.

### Retiring the train

An organization can keep its train until the evidence from its own systems says it can be retired. Amazon still has [pre-production stages and deployment windows](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), and Google still [runs release trains for some products](https://abseil.io/resources/swe-book/html/ch24.html).

## Further reading

- Clare Liguori, [Automating safe, hands-off deployments](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/). The most complete description of a production pipeline with bake times.
- Savor et al., [Continuous Deployment at Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf). Continuous deployment measured at a social network and a trading platform.
- Pete Hodgson, [Feature Toggles (aka Feature Flags)](https://martinfowler.com/articles/feature-toggles.html). The kinds of flag, how long each should live, and how to manage them in code.
- Google's Site Reliability Workbook, [Canarying Releases](https://sre.google/workbook/canarying-releases/). How to run a canary and what it cannot show.
- Brian Harry, [A Rough Patch](https://devblogs.microsoft.com/bharry/a-rough-patch/). A detailed account of a public outage caused by flags.
- The SEC's order on [Knight Capital](https://www.sec.gov/litigation/admin/2013/34-70694.pdf). The primary source for the incident.

The stage durations, prerequisites and controls proposed in this chapter are the author's recommendations. Source-by-source research notes are in [research_notes](research_notes/Testing%20gates%20to%20ramping%20culture/), with [a synthesis report](reports/Testing%20gates%20to%20ramping%20culture.md).

---

Contents: [Moving off the release train](README.md) · Next: [Chapter 2: Data and models](data-and-models.md)
