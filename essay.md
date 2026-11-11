# Moving off the release train

*How teams that move money replaced a multi-day soak with dark launches, feature flags, staged rollouts and fast rollback, and what it took.*

A lot of payments and banking software ships on a release train. Twice a week, say, everything merged since the last cut is bundled together, promoted through a series of environments over about three days, soaked in pre-production, approved, and released to every client at once. It's a careful process, and it has kept a great many bad changes away from clients.

It's also slow, in a way that's easy to stop noticing. This post is about the alternative that most large internet companies, and a growing number of banks and payments firms, have moved to over the last fifteen years. Small changes are deployed to production continuously with their new behaviour switched off. Each behaviour is then turned on separately: for nobody at first, then for a few clients, then for everyone, with a rehearsed way back at each step.

The post covers how the train works and what it costs, the techniques that replace it and where each one stops working, a worked example on a payment path, what has to be built first, how change control and audit fit in, what changes for the people involved, and how these programmes go wrong. It's long. Sources are linked throughout, and most of them are engineering posts and papers written by the people who did the work.

The examples assume systems that move money but sit outside card processing: account-to-account payments, ledgers, settlement and batch.

Three words are used precisely throughout: to **deploy** is to put code into production, to **release** is to let clients meet new behaviour, and a **train** is the scheduled bundle that does both at once.

## The release train

### What happens in the three days

The details vary by firm, but a three-day promotion on a payments platform usually looks something like this.

The first day is deployment to an integration environment and an automated regression pack run against simulators for the payment schemes. That's a few hours of machine time, and much of it could run in parallel.

The second day is a performance run, usually preceded by an environment reset and a data refresh that take longer than the test itself, followed by an overnight batch cycle with a business-date roll.

The third day is evidence assembly, change approval, and the wait for a release window, which is normally an evening slot chosen to avoid scheme cut-offs.

Some of that is work and some of it is waiting for an environment, a person or a window. It's worth knowing the split, and most teams don't. When Amazon measured its own pipeline, before it automated it, code took an average of 16 days to get from check-in to production, and for almost 14 of those days it was [waiting for someone to start a build, perform a deployment or run a test](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/). A twice-weekly train will have a far better ratio than that, but it would be surprising if the work came to more than a day of the three.

![A sixteen-day bar: about two days of work and almost fourteen days of waiting for someone to start the next step.](figures/08-sixteen-days.svg)

### What the soak is for

The soak deserves a fair description, because the argument for replacing it is weaker if it starts from a caricature.

A soak exists to cross boundaries that a short test never reaches:

- database and message-queue connections that only misbehave after hours of idleness
- memory, file handles and log volumes that creep
- queues that slowly deepen
- the roll of the business date and the first transaction of a new settlement day
- end-of-day jobs running to completion on new code while online traffic continues
- whether the release still holds peak throughput

Those are real classes of fault, and a short canary misses most of them. Nothing in this post argues for giving them up. The argument is about where the waiting happens and how much has to wait.

Four things in the three days can't be removed, only moved:

- One real end-of-day with a date roll on the new code.
- One daily peak, because capacity regressions don't show at three in the morning.
- Partner and scheme test windows, which run on the counterparty's calendar.
- A second person's judgement on anything that moves money.

Everything else is compressible, and a good part of it is queueing.

### What it costs

With two evenly spaced trains a week, a finished change waits a little under two days on average for the next one and then spends three days in promotion. That's about five days from finished to live, and seven if it has just missed a train. A corrected label waits as long as a new routing rule for outbound payments.

Five days sounds tolerable until it's multiplied across the kinds of work a team does. The right-hand column below is an estimate of what the same work looks like once deployment and release are separated; the rest of the post explains where it comes from.

| Kind of work | On the train | Deployed daily, released separately |
| --- | --- | --- |
| An ordinary change, which is most of them | About 5 days from finished to live | In production the next business day, on every node the day after |
| A fault found in production | 5 days, or a hotfix that skips most of the three days | The same as an ordinary change, through the normal path |
| A feature that needs three rounds of feedback from production | About 15 days of waiting | About 3 |
| A risky change on a money path | 5 days, then every client at once | Evidence from production the next day; full release in four to eight weeks |

The last row is the one that looks wrong. A risky change takes longer under the new model, and it should. The gain comes from the other three rows, where ordinary work no longer queues behind the risky change.

The hotfix row is worth a second look too. Most firms on a train have an emergency path that skips most of the three days. Its existence is a quiet admission that the three days are sometimes more than a change needs, and it means the changes made under the most pressure get the least checking.

### Batching

The train's second cost is the batch. Each one carries half a week of other people's changes, so when a release misbehaves, the first job is to work out which change did it.

A schedule with a cut-off also changes how people behave near it. LinkedIn's mobile team, releasing monthly behind a four-day manual regression pass, [described engineers rushing code in before the deadline](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases) because missing it cost a month. Facebook measured the result on its own mobile releases and found that code pushed on the day of the cut was [of lower quality than code pushed on other days](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf). The effect will be weaker when missing the train costs half a week and not a month, but it's the same mechanism.

Batching also keeps unfinished work out of the main branch. A change that takes three weeks can't board a train until it's complete, so it lives on a branch and drifts from everyone else's work until it's merged.

The clearest account of what large batches do in a financial setting comes from OANDA, a currency-trading platform. OANDA deployed its own platform continuously, and also licensed the same software to large banks whose policies didn't allow continuous updates, so the banks took it in periodic releases. In [a paper written with Facebook engineers](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf), OANDA's people describe what happened at the banks: each release bundled thousands of changes, the size of the release raised anxiety and led to much more extensive testing, failures were significantly harder to isolate, and bugs judged non-critical went unfixed for many months because a fix had to wait for a release. It was the same code under two release processes.

### Why not just run the train faster

The obvious fix is to shorten the three days or run the train daily. Neither works.

Shortening the three days means cutting the soak, which means no longer looking for the faults the soak finds.

Running the train daily with the same three days means three trains in promotion at once. That needs three sets of environments and three times the partner test windows. A fault found on the third day of one train is already in the two behind it. Every change still waits three days, and every release still reaches every client in the same instant.

Within the train model, speed and safety really do trade against each other, and a responsible team chooses safety. The trade only exists because the train deploys and releases in one act. The caution that a risky change deserves gets spent on the whole train, so everything on the train waits for it.

Google's Site Reliability Workbook states the constraint in one sentence: ["If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."](https://sre.google/workbook/canarying-releases/)

### What the three days don't cover

The soak finds one class of fault well. There are at least three it can't find, however long it runs.

The first is how real counterparties behave. Pre-production talks to simulators, and a simulator can confirm that a message is well formed and that scripted rejection and timeout cases are handled. It can't show how the receiving banks on a real rail respond to a real mix of payments.

The second is any path that nothing exercises. Time in an environment proves nothing about code that isn't being called. Knight Capital's new order-routing code went onto its production servers in stages from 27 July 2012, five days before it was first used. The [SEC's order against the firm](https://www.sec.gov/litigation/admin/2013/34-70694.pdf) records no incident in that time, because nothing was yet using the code. On the morning it was activated, the firm took on unwanted positions in about 45 minutes that cost it more than $460 million. That story comes up again later, because it's really about flags and deployment. The point here is narrower: five days in production observed nothing, and three days of soak would have observed the same nothing.

The third is a fault whose trigger hasn't happened yet. Stripe's outage of July 2019 came from a database version that had [passed testing, a phased rollout and about three months in production](https://stripe.com/rcas/2019-07-10) before a rare combination of conditions exposed it. Elapsed time, in any environment, doesn't find a fault whose trigger doesn't occur.

Staging has its own blind spots on top of these. In April 2022 Atlassian ran a maintenance script that had been tested in staging under its normal change process and peer reviewed. It deleted the sites of 775 customers, some of whom were locked out for up to 14 days. [Atlassian's review](https://www.atlassian.com/engineering/post-incident-review-april-2022-outage) explains that staging couldn't have caught it, because the identifiers that triggered the fault didn't exist there.

There's also the question of what a long wait turns into. Netflix's engineers, looking back at 2012, [wrote that their week-long canaries](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) were "devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality". Surviving the wait had started to stand in for evidence.

Finally, the size of a change matters more than the scrutiny it gets. In 2021 the UK's Financial Conduct Authority published [a review of how 23 financial firms had made more than a million production changes](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change) during 2019. Changes the firms classed as major, which generally received more oversight, failed at 3.8%, against 1.6% for changes as a whole. Change advisory boards approved more than 90% of the major changes they reviewed, and at some firms didn't reject a single one all year. The FCA's own summary was that "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles".

![Three panels of FCA statistics: 1.6% of all changes failed against 3.8% of major changes; change boards approved over 90% of major changes; change caused 17% of material incidents reported to the FCA and 24% of firms' high-severity incidents.](figures/07-fca-findings.svg)

Those are associations, and the review says so. Major changes are riskier by nature, and it also found a slightly higher failure rate at firms that described more of their work as DevOps, on a sample too small to support a conclusion. But it is a regulator looking at regulated firms and finding that failure concentrates in large changes, and that heavy approval didn't offset it.

## How the industry got here

None of this is new, and it helps to know how old it is. The practice wasn't invented in one place; it grew out of two separate lines of work that met around 2008.

### Integration and experiments

The first line was about merging. In 2000 Martin Fowler and Matthew Foemmel wrote up [continuous integration](https://martinfowler.com/articles/originalContinuousIntegration.html): everyone merges to one branch at least daily, and an automated build and test run tells them quickly whether their work fits together. It solved the problem of changes that had diverged for too long. It said nothing about putting each change into production.

The second line was about exposure: web companies had learned to show a change to some users and not others, and to measure the difference. By 2007 Ron Kohavi and colleagues at Microsoft were recommending, in [a guide to running experiments](https://exp-platform.com/Documents/GuideControlledExperiments.pdf), that a new treatment start with a small share of users, ramp up gradually, and be shut off automatically if it did harm. That is a safety mechanism described inside a paper about measurement.

Google's search team built that connection into its infrastructure. Its [2010 paper on experiment infrastructure](https://research.google/pubs/overlapping-experiment-infrastructure-more-better-faster-experimentation/) describes a system first deployed in 2007 in which code shipped in binary pushes, while experiments and launches were controlled by separate, faster pushes of data and configuration. A feature moved through a canary, an experiment and a gradual launch before it became the default. The binary and the behaviour were already on different schedules.

### Dark launches and flags

In 2008 Facebook used the same separation for load. Two months before anyone could use Facebook Chat, the site's pages began [quietly connecting to the new chat servers](https://engineering.fb.com/2008/05/13/web/facebook-chat/) and sending simulated messages, so that the backend carried production load while no interface was visible, which Facebook called a dark launch. Visible rollout began on 6 April and reached everyone on 23 April.

The technique became public vocabulary in 2009, when John Allspaw and Paul Hammond gave a talk at the Velocity conference called [10+ Deploys Per Day](https://paulhammond.org/2009/06/velocity/10deploys.pdf) about Flickr, and later that year Ross Harmes described [how Flickr used feature flags](https://code.flickr.net/2009/12/02/flipping-out/): everyone worked on the main branch, the site deployed several times a day, and unfinished features sat in production switched off. Timothy Fitz described [IMVU deploying about fifty times a day](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/) behind an automated test suite, with deployment to a subset of machines first and automatic rollback. In 2011 Etsy's Chad Dickerson wrote that [Etsy's flags were taken almost directly from Flickr's](https://www.etsy.com/codeascraft/how-does-etsy-manage-development-and-operations), brought over by engineers who had worked at both.

Wealthfront is an early example from regulated finance. In 2010 the firm, which is regulated by the SEC, described [a deployment system](https://eng.wealthfront.com/?p=1273) in which the engineer who committed a change released it, the rollout went to one instance first and then outward, and a failed health check rolled everything back in about five seconds across a cluster of ten machines.

### Scale, and the first hard lessons

From 2012 the accounts get larger and more candid. Netflix described [an automated canary score](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0) for its API in 2013. Microsoft's Visual Studio Online team had a public outage on the morning of a launch, caused by flags, and responded by building [a first ring of volunteer accounts](https://devblogs.microsoft.com/bharry/visual-studio-online-update-feb-10/) that took every deployment before anyone else. Facebook published a paper in 2015 on [how it managed configuration](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf), which describes engineers who "release the new code into production early but in a disabled mode, and then use Gatekeeper" to widen exposure, and which is frank that configuration changes were causing a real share of incidents and needed canaries of their own.

By 2017 Facebook's website had moved from scheduled pushes to [deploying continuously from the main branch](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/), with each build going to employees, then 2% of production, then everyone. In 2020 Amazon published [a detailed description of its deployment pipelines](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), with a single machine first, then one region, then waves, bake times at each stage and automatic rollback.

### Banks and regulators

Firms that move money came later, and the first to write about it were the ones built new. Starling Bank [told a conference in 2018](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf) that it released to production up to five times a day. Monzo described [more than a hundred deployments a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day) in 2022 and, later that year, [automated rollback across more than 2,100 services](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale).

Regulators noticed. The FCA's review, already mentioned, was published in 2021. The 2024 edition of the [handbook that US bank examiners work from](https://business.cch.com/BFLD/FFIEC-IT-DevelopmentAcquisitionMaintenance-Hankbook-08292024.pdf) mentions canary releases and observes that "in a DevOps environment, the same number and type of changes can be made daily or even hourly".

So a team starting now is not experimenting. The practice has about fifteen years of published history, including the mistakes.

## Deploying without releasing

### The idea

A change is written so that its new behaviour sits behind a feature flag, and the flag is off when the code ships. The code is built, deployed and running in production alongside everything else, and no client sees anything different. Turning the behaviour on is a separate decision, taken later, for whichever clients are chosen.

Once that's in place, the two things the train binds together come apart. Deployment can be frequent and uneventful, because deploying disabled code is meant to change nothing a client can see. Release stays deliberate, and can be more careful than it is on a train, because it applies to one behaviour at a time and to as few clients as you like.

The long wait moves off the train and onto the one behaviour that needs watching, while everything else flows past it.

### What a flag looks like

At its simplest a flag is a conditional that reads a value from configuration:

```python
if flags.enabled("route-small-payments-instant", client=payment.client_id):
    rail = choose_rail_v2(payment)
else:
    rail = choose_rail_v1(payment)
```

Two details matter far more in a payments system than they do on a website.

The first is when the flag is read. A payment has a life that can run for days or months: acceptance, submission, confirmation, returns, recalls, status enquiries, postings. If each of those steps reads the flag again, then switching the flag mid-life strands the payment between two behaviours. The decision has to be made once, at acceptance, and stored with the payment:

```python
# At acceptance: decide once and record the decision.
payment.rail = decide_rail(payment)   # reads the flag here, and only here
ledger.record(payment)

# Everywhere else: follow the stored decision, never the flag.
gateway_for(payment.rail).submit(payment)
```

No downstream service reads the flag again. This is a design decision that a release train never forces, because on a train the behaviour changes for everyone at once and there is nothing to be consistent with.

The second is what happens when the flag service is unavailable. For a web feature, defaulting to "off" is fine. For a client who has already been moved to the new behaviour, a default of "off" would silently move live payments back to the old path and then forward again when the service recovered. The safer rule is to fall back to the last known value, and to the old behaviour only when there isn't one.

### Kinds of flag

Pete Hodgson's article on [feature toggles](https://martinfowler.com/articles/feature-toggles.html) separates four kinds, and the distinction is useful because they have different lifetimes.

- **Release flags** hide unfinished or unproven behaviour. They should live for weeks and then be deleted.
- **Experiment flags** split users between variants to measure a difference. They live as long as the experiment.
- **Operational flags**, including kill switches, let operators turn something off under load or during an incident. Some of these are permanent.
- **Permission flags** give a behaviour to particular clients as a matter of product, and are long-lived by design.

Most of this post is about release flags. The other kinds use the same machinery, which is part of why flags accumulate; more on that under "How it goes wrong".

### Canaries, ramps and experiments are the same loop

Canaries, flag ramps and experiments tend to be discussed as three subjects. They are one loop with different settings: expose a subset, compare it with the rest, then widen or revert.

| | Canary | Flag ramp | Experiment |
| --- | --- | --- | --- |
| What varies | The binary | One behaviour inside the binary | One behaviour inside the binary |
| Who is exposed | Some machines | Some clients or accounts | Randomly chosen clients or accounts |
| The question | Is it broken? | Is it broken? | Is it better? |

That's why the same infrastructure usually ends up serving all three. Google's experiment system was also its launch system. [LinkedIn's experimentation platform](https://www.linkedin.com/blog/engineering/ab-testing-experimentation/xlnt-platform-driving-ab-testing-linkedin) ramps features independently of code releases. Uber built [automated rollouts with regression detection](https://www.uber.com/us/en/blog/autonomous-rollouts-regression-analysis/) on top of its experiment platform.

The difference that matters in finance is the last row. A safety ramp intends the same outcome for every client and limits exposure in case something is wrong. A product experiment deliberately gives clients different variants to learn which is better. The second raises questions about fair treatment that the first doesn't, so it's worth saying which one you mean, especially to risk and compliance. Calling a ramp an "experiment" invites objections that belong only to real experiments.

### What a flag can't guard

Not everything in a build can sit behind a flag. A library upgrade, a new database driver, a change to the runtime or a container base image belongs to the binary as a whole. These are exactly the changes that leak memory and exhaust connection pools, which is to say the faults a soak exists to find.

So the binary still needs time under load; what changes is where it gets it. On the new model the build goes to a small part of production first and stays there through a daily peak before it goes wider. The usual name for this wait is a **bake**, and this post uses "soak" for the wait in pre-production and "bake" for the wait in production.

In Amazon's pipeline, which is the best-documented example, each build goes to a single machine, then to one region, then outward in waves. Each stage has a minimum wait, of between one and twelve hours, and a minimum amount of real traffic that must be served before the build moves on, and an alarm rolls the build back automatically. A change typically takes [four or five business days to reach every region](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/).

That last number matters, because it shows what this is and isn't. Amazon's elapsed time is no shorter than a three-day soak. What differs is that builds enter the pipeline one after another, each carries only the changes made since the last, and the waiting is done on real traffic at limited exposure.

One catch with daily deployment is that if every process restarts every day, a slow leak may never get the chance to show, until a change freeze leaves a build running for two weeks. For runtime and library upgrades it's worth keeping a deliberate multi-day soak.

## The techniques

A testing period does several jobs at once. It looks for regressions, exercises load and elapsed-time behaviour, gives people a chance to accept the change, bundles approval, and provides a back-out point. The techniques below take those jobs apart: each one replaces part of what the three days do, and each has a limit that its own authors describe.

### Dark launches and shadow traffic

"Dark launch" gets used for two different things, and both are useful.

The first is **dormant** code: deployed behind a flag that is off. It has been merged, built and deployed, and has been shown not to disturb what's live, but nothing calls it. This is what lets unfinished work merge to the main branch every day. Netflix used it to stop acceptance testing from blocking deployment: the feature [stayed disabled in production](https://netflixtechblog.com/preparing-the-netflix-api-for-deployment-786d8f58090d) while testing carried on.

The second is a **shadow** run: real traffic passes through the new code, the result is compared with what the old code produced, and then it's thrown away without any client seeing it. This is the part that replaces most of what people hope a soak will tell them, because it runs on production's own traffic and data.

GitHub's rewrite of the code that merges pull requests is a good example of how it goes. The team [ran the old and new implementations side by side](https://github.blog/2015-12-15-move-fast/) in production using a small library called Scientist, compared the results on tens of millions of merges, fixed mismatches for four days, and switched over after 24 hours with none. Square did something similar when it moved payment data to a new service, and reports that comparing the two paths ["actually caught a lot of subtle bugs"](https://developer.squareup.com/blog/breaking-up-with-your-monorail/).

Stripe's [migration of its subscriptions data](https://stripe.com/blog/online-migrations) shows the same idea applied to a data store. The team wrote to the old and new stores at once, backfilled existing records, compared reads from both while the old store stayed authoritative, switched reads, then switched writes, and only then removed the old path. Each step was small and could be reversed.

Banks already know a version of this as a parallel run: two systems fed the same input, with their outputs compared before the new one is trusted.

Shadow runs have three limits.

- Side effects. GitHub's own documentation says that ["Scientist is not meant to be used for any code that has side-effects"](https://github.blog/2016-02-03-scientist/). You can shadow a decision or a calculation. You can't shadow sending a payment, so for money movement the shadow records what would have been sent and stops there.
- Cold data. When Uber moved its ledger to a new store, it set a bar that the new store be ["at least 99.99% complete and correct as measured by shadow validation"](https://www.uber.com/blog/migrating-from-dynamodb-to-ledgerstore/). Its engineers worked out that at a thousand records a second, six nines of confidence would take a bit more than a day of comparisons, and seven nines about twelve days, which they judged impractical. Live shadowing also missed records that were rarely read, so they compared stored data offline as well, 760 billion records in one job.
- Nobody reading the results. A comparison harness that writes mismatches to a table nobody looks at is a soak by another name. The stage passes on elapsed time, which is the failure Netflix described. Every mismatch needs an owner and a deadline, and the exit condition is zero unexplained mismatches over a stated volume.

So shadowing swaps a calendar for evidence, but the evidence still takes time to collect.

### Canaries and bake time

A canary puts a new build on a small part of production and compares it with the rest before going further.

Early canaries were watched by people. Netflix's account of its API in 2013 describes [a canary that ran for hours and was scored automatically](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0) against the existing fleet on a set of metrics. By 2018 its [Kayenta system](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69) compared a new cluster with a freshly launched copy of the old version under the same live traffic, and judged the difference statistically. Comparing against a fresh baseline matters, because a server that has been running for a week behaves differently from one that started ten minutes ago, for reasons that have nothing to do with the change.

Amazon's version is the one-box stage: one machine takes the new build and a small share of a region's traffic. The build stays there for at least an hour and until a minimum number of requests has been served, and it only moves on if the alarms are quiet.

Google's SRE Workbook has [the most careful account of what canaries can't do](https://sre.google/workbook/canarying-releases/). They need representative traffic, so they're weak on paths that few requests take. For batch and other non-interactive work, a canary has to span at least "a single work unit". And the longer a canary runs, the fewer releases fit in a week. A Google engineer writing about the company's canary analysis service [says plainly](https://queue.acm.org/detail.cfm?id=3194655) that canarying is no substitute for unit testing, integration testing or monitoring.

Two further limits apply to payments in particular.

Low volume. A 1% canary tells you little about a flow of a few hundred large payments a day. There isn't enough traffic for a statistical comparison, so the exposure has to be chosen by client or payment type, and the judgement rests on correctness checks more than on rates.

Shared state. Two nodes of a ledger posting engine write to one ledger. Putting the new build on one node limits its share of traffic. It doesn't limit the damage a bad write can do.

### Rings and ramps

A ring is a canary with a population attached. Microsoft's Azure DevOps service [deploys through a series of rings](https://learn.microsoft.com/en-us/devops/operate/safe-deployment-practices), starting with an instance for accounts that volunteered to go first, with about a day's bake in each. Facebook's website went to employees first, then 2% of production, then everyone. Slack [deploys to its own staff, then a 2% canary, then 10, 25, 50, 75 and 100%](https://slack.engineering/deploys-at-slack/).

A ramp is the same thing done to one behaviour with a flag instead of to a build.

The choice of unit matters more than the percentages. Square moved payment records to a new service using random percentages of requests. Its engineer wrote afterwards that this had hidden a regression which only appeared for a particular combination of client software versions, and that rolling out in a way that was [stable per merchant](https://developer.squareup.com/blog/breaking-up-with-your-monorail/) would have confined it to a few.

For a firm whose clients are themselves businesses, the unit is the client. That brings a constraint a consumer website doesn't have: a client has to agree to go first. Stripe handles a related problem by [pinning each account to an API version](https://stripe.com/blog/api-versioning) and letting the account choose when to move.

![Seven published ramp schedules, from Facebook's website (employees, 2%, 100% in a few hours) to Amazon (one box, first Region, more Regions, all Regions over four to five business days), Slack (its own staff, a 2% canary, then 10% to 100%) and Uber's payment authorisation (shadow, employees, 0.25%, 1%, 5%, 100%).](figures/06-published-ramps.svg)

How long to hold each step depends on how long the evidence takes to arrive. Microsoft studied this for Office and found that when an early-ring rollout moved a guardrail metric at all, [79% of those movements showed within the first three days](https://microsoft.com/en-us/research/uploads/prod/2020/06/Safe-Velocity-ICSE-SEI.pdf) and the rest by day seven. For payments the slow signals are reconciliation and period ends, and they set the pace, as later sections describe.

### Experiments

An experiment gives a randomly chosen group the new behaviour and measures the difference from everyone else.

The reason to run them is that careful people are poor at predicting which changes help. At Microsoft, [only about a third of well-designed experiments](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf) improved the metric they were built to improve. A later paper from the same group describes a re-implementation of an order pipeline at Amazon that was believed to be equivalent to the old one, [lost 2% of revenue in its A/B test, and shipped after five iterations](https://exp-platform.com/Documents/2013%20controlledExperimentsAtScale.pdf). A re-implementation is a change too, and a sign-off meeting can't tell you whether the new path behaves like the old one.

Booking.com takes this furthest: its engineers write that ["every change... is wrapped in an experiment"](https://arxiv.org/abs/1710.08217), with more than a thousand running at once, and that anyone in the company may stop one that is doing harm.

Financial firms publish less about experiments, and what they publish is mostly about interfaces, support flows and communications. Monzo describes [a set of launch tools](https://monzo.com/blog/2023/08/03/how-we-launch-new-products-at-monzo) that includes staff testing, an opt-in group, randomised experiments and staged rollouts, and says it ran an experiment on a change to a credit product's payment dates "to make sure it didn't lead to bad outcomes".

The UK regulator is more open to this than engineers tend to assume. The FCA's [guidance on the Consumer Duty](https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf) says that customers' understanding "could be tested directly by conducting randomised controlled trials or A/B tests", and adds that a firm which tests its communications to maximise sales should test customer understanding to the same standard.

Experiments need enough traffic to detect a difference, and results that take weeks to mature need experiments that run for weeks. For most changes to a payment platform's internals, a safety ramp is the right tool and an experiment isn't needed.

### Rollback

"Rollback" means three different things, and only two of them are safe under pressure.

![Three kinds of rollback: switch traffic back to a still-running old version; redeploy the kept image by its hash; rebuild the old source. None of them undo data written, schemas migrated, messages sent or money moved.](figures/09-three-rollbacks.svg)

The first is switching traffic back. The old version is still running, and traffic is pointed at it again. Netflix was [deploying this way by 2012](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1): bring up the new version beside the old, move traffic across, and keep the old one until you're sure. It takes seconds to minutes, and it costs the capacity to run two versions at once.

The second is redeploying the kept build: the previous build is deployed again exactly as it was. This depends on a rule from Jez Humble and David Farley's *Continuous Delivery*: [build the binary once](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3) and deploy that same binary, identified by its hash, to every environment. They gave the rule for audit reasons, since it proves that what was tested is what runs. It also means a rollback returns production to something that has already run there.

The third is rebuilding the old source: an earlier revision is checked out and built again. The result is only the same as before if the build is perfectly repeatable, and during an incident is a bad time to find out that it isn't.

Whichever kind is used, the previous build has to be able to read what the newer build wrote. With daily deployment and a bake, production is running two versions on the same queues and tables every day. Amazon's guidance on [rollback safety](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/) identifies protocol and format changes as the commonest reason a rollback fails, and handles them in two deployments: the first teaches the software to read the new format, and the second, days later, starts writing it, so that either can be rolled back alone. Amazon also tests the rollback itself: in a production-like environment under simulated traffic, the new build is deployed to half the fleet, the deployment is completed, and then it's rolled back.

A rollback that has never been run is a new, untested change made during an incident. RBS found this out in June 2012, when it backed out an upgrade to its batch scheduler and the back-out caused the incident. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf) says the bank "had only tested the consequences of backing out Version 2 to Version 1", and what was installed was a patched variant, Version 2A; more than six million customers were affected.

Google's advice is to make rollback routine. Its guidance for cloud customers says that when a fault is suspected in a new release, Google's own releasing team ["rolls back first and investigates the problem second"](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons), and that if a few weeks have gone by without a rollback, you should do one on purpose. A Google engineer writing about [generic mitigations](https://www.oreilly.com/content/generic-mitigations/) puts the risk this way: "Far too many think they have safe rollbacks, only to learn otherwise during an outage."

Rollback restores the service and nothing else. It does nothing for data the newer build wrote, a schema it changed, a message it sent or a payment it made. There are also times when rolling back is the wrong move, such as inside a cut-off window or halfway through a batch step, and those need to be written down in advance.

Switching a flag off is a lighter reversal than any of these. Facebook [preferred it to reverting a build](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/) where it could. But it reverses one behaviour, and a flag that has been fully on for months has an off path nobody has exercised.

### Automated rollback

The step after rehearsed rollback is to let the pipeline do it. Amazon's deployments roll back on alarms without anyone watching, and its engineers note that a rollback is often already under way by the time the on-call engineer has been paged. Monzo's rollbacks use the same application metrics that drive its alerts. Slack reports that [73% of its customer-facing incidents were triggered by its own changes](https://slack.engineering/deploy-safety/), and that customer impact hours fell by 90% from their peak in early 2024 to January 2025, during a programme that included automatic rollbacks. Those are Slack's own figures, and the programme had many parts.

The cost of automation is false alarms. Meta's paper on [its deployment system](https://www.usenix.org/conference/osdi23/presentation/grubic) reports that health checks flagged between 11.5% and 41.3% of deployments that a human then allowed to proceed. An automatic gate that cries wolf that often gets overridden, and Facebook's earlier configuration paper records an engineer overriding a correct canary rejection on the assumption that the tool was wrong.

The order matters as well: Slack built alerts with manual remediation first and automatic rollback second, and Monzo was deploying hundreds of times a day for years before it automated rollback.

## A worked example

Take one change and follow it both ways. Outbound credit transfers below a threshold are to move from the batch clearing rail, A, to the instant rail, B.

The two rails differ in ways that make this riskier than it sounds. A payment on A can be pulled until the submission cut-off and settles a day or more later. A payment on B is final within seconds, at any hour, and can only be recovered by asking the beneficiary's bank to send it back. B also reaches only the banks that have joined it, has a limit per payment, and settles against a position that has to be funded in advance, weekends included.

### On the train

The change joins the next train. The regression pack runs it against simulators for both rails. It passes a performance run, a batch cycle, the soak and the change board. Then, unless a per-client switch has been built specially, it's live for every client and every payment in scope.

If something is wrong with how real banks on B respond, the team learns it from all its clients at once, and what has been sent can't be recalled. If the release is backed out, the payments already sent over B still need their enquiries and reconciliation handled on B.

### With deployment and release separated

The work starts with the design decision described earlier. The rail is chosen once, when the payment is accepted, and written to the payment record. Enquiries, recalls and postings follow the stored rail for the life of the payment. A payment that times out on B is resolved by status enquiry and is not sent again, on either rail, while its outcome is unknown.

The change then goes through five stages. The durations given are a judgement about how long each stage's evidence takes to arrive, and a team with different rails or volumes would set them differently.

**1. Dark.** The code ships disabled. The build bakes on one node per site through a daily peak, and end-of-day runs the new code on its smallest partition first. The thing to check is that the disabled path behaves exactly as yesterday's build did.

**2. Shadow.** For all traffic, the new rule records the rail it would choose, the reachability and limit checks behind that choice, and the message it would build, and sends nothing. The recorded choices are compared with an independently written statement of the rule. This stage is held for at least seven days, timed to include a weekend and a payroll peak, and it stops on any mismatch nobody can explain.

**3. Synthetic client.** Test accounts in production send small real payments over B to accounts the firm keeps at other banks. They go through acceptance, rejection, an injected timeout resolved by status enquiry, a recall request and reconciliation. The flag is switched off mid-stream as a rehearsal. This stage runs for two business days and a weekend.

**4. One consenting client.** One payment type, with a low cap per payment and per day. The team watches rejection rates by reason code, time to confirmation, unknown outcomes, the prefunded position, and breaks in both its own reconciliation and the client's. This stage runs for five business days and the weekend they span, and it stops on any duplicate, any reconciliation break, or any outcome still unknown after an hour.

**5. Widen.** More clients, then a higher cap, never both in one step. Each step is held for a full reconciliation cycle, and one of them is held across a month-end.

Added up, that's four to eight weeks from first deployment to full release.

### What switching off does

Switching the flag off sends new payments back to A from its next submission window, but it recalls nothing. Every payment already sent on B is final, so the exposure is bounded by the caps: the daily cap, times the number of clients enabled, times the number of days a fault goes unnoticed. The shadow run only shows what would be sent, so it is the cap that limits the damage.

Switching off after A's last cut-off of the day also means those payments wait until the next business day, which the client will notice.

### Where each stage tends to go wrong

It helps to plan for the likely failure at each stage.

In shadow, nobody owns the mismatch report, and the stage passes because seven days have gone by. At the synthetic client, a Saturday payment posts to Monday's business date and breaks the settlement-account reconciliation. With the first real client, the fault may be on the client's side: a treasury system that expected next-day value. When widening, a second ramp starts on the same settlement account, and a reconciliation break can no longer be traced to either.

### Comparing the two

The routing change reaches every client later this way, by a month or more. Against that, the engineer has evidence from production the day after writing the code, no client meets an unproven rule, and every other change written in those weeks ships without waiting.

## What has to be built first

None of this is safe on a payment path until some unglamorous things are in place. In rough order:

- Observability by client and by build. If you can't see acceptance rate, rejections by reason code, timeouts and time to confirmation for one client on one build, within minutes, there's nothing to judge a ramp against. Infrastructure dashboards and a daily operations report aren't enough. This is often months of work.
- Build once. One artefact, identified by its hash, promoted unchanged through every environment, with deployment automated for code, configuration and reference data alike.

- Compatibility between adjacent builds. With daily deployment and a bake, production runs two versions every day of the year, on the same queues and the same tables. Every message, record and file written by today's build has to be readable by yesterday's. The pipeline should prove that on every build with a mixed-version test, because without it rollback is only a hope.
- Expand and contract for schema changes. Add the new structure, write both ways, backfill, compare, switch reads, and only then remove the old one. The expand steps can ship daily, while the final removal is irreversible and belongs on a fixed date with a rehearsal.

- Idempotency end to end. Daily restarts, rollbacks and flag changes in mid-flight cause retries and redelivery. Every payment instruction needs a key that survives them. Stripe's post on [idempotency](https://stripe.com/blog/idempotency) is a good introduction to why. In the worked example the key has to be checked before the rail is chosen, because neither rail's own duplicate check can see a payment that went out on the other.
- Decisions pinned to the transaction. As above: evaluate once at acceptance, store the result, and have every later step follow the stored value.

- A flag service fit for the payment path. It evaluates locally, with no network call per payment. It falls back to the last known value on failure. Its state is consistent across sites, and changes are audited, made under dual control, and themselves rolled out a site at a time, because a flag change is an instant change to the whole fleet with no bake. It doesn't depend on anything it might be asked to switch off.
- A client of your own in production. A fully onboarded synthetic client, with real accounts at other institutions and real connectivity to every rail, that takes every ramp first. Keeping its postings out of financial and regulatory reporting takes longer to agree with finance than to build.

- Rehearsed ways back. Flag off, traffic shift and artefact rollback, each with a written rule for when not to use it.

Building these is where the effort goes: Monzo wrote that for automated rollback, ["migration and tooling work was >90% of the effort"](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale). The paper on Facebook and OANDA reports that Facebook had about 5% of its engineers working on tooling and OANDA 15%, and that OANDA spent two years perfecting continuous deployment for its mission-critical systems.

## What doesn't ramp

Some changes don't fit this model, and it's better to list them as a matter of design than to discover them one at a time.

### Batch and period ends

End-of-day runs once over the whole book. It can't be sliced by node the way an online service can. It needs its own form of the same idea, and there are three that work.

- Partition the batch by legal entity, client or book, and run the new code on the smallest partition for a cycle before the rest.
- Run the new code in parallel against the same input, with postings and outbound files suppressed, and compare its output with the batch of record, which amounts to a shadow run for batch.
- For jobs that only run at a period end, run them every night in pre-production against a production-sized copy with the business date advanced to the boundary, so that month-end has been exercised thirty times before it happens for real.

Period-end behaviour is the weakest-documented area in everything written about this subject. No firm that deploys continuously has published how it validates changes to interest, statement or settlement jobs before the boundary arrives. A three-day soak doesn't cover it either, since most three-day windows contain no month-end. The three techniques above are the best available answer, and code that only runs at a period end isn't proven until it has been compared across one.

### Changes that stay on a date

Five kinds of change should go out whole, on a date agreed in advance.

- Anything a client or counterparty can see in an interface: message formats, file layouts, cut-off times. The worked example changes what a client sees, in debit time and value date, which is why it needs the client's consent and an agreed start.
- Scheme and rulebook changes, which take effect on the scheme's date. The code can ship dark weeks ahead and be certified in the scheme's test environment, but activation is for everyone at once and has to be rehearsed that way.
- The final, irreversible step of a schema change, which gets a rehearsal on a production-sized copy.
- New settlement and regulatory files, since a file goes to a counterparty whole, at a cut-off, and can't go to 1% of them. The method is to generate old and new in parallel through several cycles, including a period end, and compare.
- Cut-overs that counterparties have to make together. The Bank of England's renewal of its settlement system was [delivered in stages that could each stand alone](https://www.nao.org.uk/wp-content/uploads/2025/12/the-bank-of-englands-real-time-gross-settlement-system-renewal-programme.pdf), but the core switch had to happen over one weekend because the old and new systems couldn't run side by side.

### Shared components

Per-client ramping only isolates what is partitioned per client. The scheme gateway, the message broker, the ledger posting engine and the batch scheduler serve everyone, so a change to one of them reaches every client as soon as it's live.

For these, pick another axis: one payment type or amount band, one batch partition, or one node where nodes share no state. Where no axis exists, keep the change on a dated release with a rehearsal. The longer-term fix is architectural, which is to partition the shared component so that later changes can be ramped.

### One ramp at a time per signal

A ramp is only attributable while it's the only thing that changed. If two ramps touch the same settlement account in the same day and the daily reconciliation breaks, the team is back to working out which change did it, which is the problem the train had.

A workable rule is one ramp in flight per reconciliation domain per cycle, a small limit on money-path ramps across the platform, and no ramp steps in the last few business days of a month.

## Keeping the money right

A flag can reverse a decision but not a payment. Kent Beck, writing about Facebook's habit of making decisions reversible, [set money aside explicitly](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility): "Decisions affecting people's privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible."

Firms that move money don't claim otherwise. They put their effort into finding out whether new code is right before it's allowed to move anything, and into noticing quickly when it isn't.

Reconciliation becomes a test that runs all the time. Monzo runs [coherence checks](https://monzo.com/blog/2022/02/08/processing-payments-safely-at-scale) over payments in production and reconciles its ledger against settlement daily. Stripe reports that ["99.99% of our dollar volume is fully ingested and verified within four days"](https://stripe.dev/blog/ledger-stripe-system-for-tracking-and-validating-money-movement). These are slower signals than an error rate, and they set the length of a ramp stage. A change that affects settlement should hold at small exposure for at least one reconciliation cycle before it widens.

An append-only ledger helps as well: Square describes its ledger as ["effectively append-only and immutable once stored"](https://developer.squareup.com/blog/books-an-immutable-double-entry-accounting-database-service/), with mistakes corrected by a new entry and never erased. That keeps the error visible and the correction auditable.

For anything irrevocable, the amount cap is the control, because it turns "how bad could this be" into arithmetic.

For a migration, keep the new path non-authoritative while its results are compared with the old one's, as Stripe, Square and GitHub did. Agreement is counted in records, and the count takes as long as it takes.

## Change control and audit

The usual objection at this point is that auditors and regulators require the process as it is. It's worth separating what the rules say from what a firm's own policy says, because they aren't the same thing.

### What the rules ask for

The rules and supervisory guidance that apply to this kind of system include the US examiners' handbook, the European Banking Authority's [guidelines on ICT risk](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Guidelines/2020/GLs%20on%20ICT%20and%20security%20risk%20management/872936/Final%20draft%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf), the EU's [Digital Operational Resilience Act](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2554) and Singapore's [technology risk guidelines](https://www.mas.gov.sg/-/media/MAS/Regulations-and-Financial-Stability/Regulatory-and-Supervisory-Framework/Risk-Management/TRM-Guidelines-18-January-2021.pdf). They ask for broadly the same things:

- a record of every change
- testing in proportion to the risk
- approval by someone with authority who isn't the author
- segregation of duties
- separation of production from development
- a way back
- an audit trail

None of them asks for a soak period, a release train, or promotion over several days. The EBA went out of its way to say its guidelines don't prescribe a development method, after banks complained that a draft implied waterfall.

Some of them do ask for more than the list above. Singapore's guidelines expect a change advisory board and signed-off test results. Both they and the US handbook expect quality assurance that is independent of development. The EU's technical standards, which I've read only in summary, appear to require the approver to be independent of whoever requested and built the change. So the approvals stay, and so does a role for independent testers.

### What auditors actually test

Auditors don't test a firm against the rule texts. They test it against its own change policy, its control descriptions and its client contracts, and those describe the train, which is where the three days are actually written down.

So the work is to rewrite the policy, and it has to be done with risk and audit as co-authors from the start. The pattern that regulated firms have published looks like this.

- Authorisation is a reviewer other than the author, enforced by the pipeline. Monzo describes a policy that requires [at least one other person to review every change](https://monzo.com/blog/2022/03/31/how-we-secure-monzos-banking-platform).
- Segregation is the absence of standing human access to production, with the pipeline as the only way in. Capital One's governance lead, a former auditor, [wrote about exactly this](https://www.capitalone.com/tech/software-engineering/governance-in-a-devops-environment/), and its pipeline has [sixteen gates](https://www.capitalone.com/tech/software-engineering/focusing-on-the-devops-pipeline/), among them an automated change order and automated rollback.
- Evidence is an immutable log that ties commit, review, test results and deployment together.
- Exceptions are break-glass access with loud alerts and a review afterwards.

Starling is the most useful example for a firm on a train, because it kept its human gates and still releases daily. In 2018 its release process included a step in which every engineer vouched for their own commits in chat, and a visible release-in-progress signal about which its slides say ["our auditors loved this one"](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf). In 2025 the bank [still required three approvals for every release](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), the last of them a business approval from an engineering lead, director or executive, and was releasing several times a day.

The Financial Times is a non-financial example of the same move. Sarah Wells, who led the work, [told a conference](https://www.infoq.com/presentations/microservices-financial-times/) that the FT no longer had change approval boards: "if you're doing small changes, the best person to make the decision about whether this change should go, is the person who just made that development change." Each release is recorded automatically.

### Flag changes are changes

No rule text mentions feature flags, so nobody has told the industry how a flag change is classified. But a flag change in production alters behaviour, so it falls inside any reasonable definition of a change, and a firm that lets developers flip money-moving behaviour with no record and no second person has removed a control.

A classification that works:

- The code that introduces a flag goes through normal review and deployment.
- The ramp plan, with its stages, holds and stop conditions, is approved once.
- Each step of the ramp is a standard change executed under that plan, under dual control, and logged.
- Switching a flag off, and rolling back to the previous build, are pre-authorised. Whoever is on call can do either without asking, and it's reviewed afterwards.
- The state of every flag on any given date can be produced as evidence.

The failure to avoid is the opposite one. If every ramp step is raised as a normal change with three days' notice, the ramp ends up slower than the train was.

### What supervisors expect

It's worth being realistic about the supervisor's instinct, which runs toward less change. After a series of outages at DBS, Singapore's regulator [ordered a six-month pause on non-essential changes](https://www.mas.gov.sg/news/media-releases/2023/mas-imposes-six-month-pause-on-dbs) in 2023. The argument that works with a supervisor is failure rate and reach per change, with evidence, and never speed.

One gap: no firm has published what an examiner or external auditor concluded about a process like this. Acceptance is implied by firms continuing to operate under supervision, and that's all the public record offers.

## People

The mechanics are the smaller part of the work. Most of what the published accounts describe, when they're candid, is about who is responsible for what.

### The author owns the switch

On a train, an engineer's job ends at the merge. Under this model the author of a change also decides what the flag guards and how the disabled path behaves, builds the shadow comparison, writes the ramp plan with its stop conditions, and deletes the flag when the ramp is done.

That's more work per change, , it asks people to plan for being wrong, and it doesn't happen just because a tool exists. Microsoft's experimentation team [wrote in 2009](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf), after three years of trying to spread a related habit, that most goals in the company were still about shipping, and doubted they had changed many people's objectives. Habits follow what code review asks about, what counts as done, and what's recognised at review time.

Who builds the mechanism matters as well. John Allspaw ran operations at Flickr, and when he left he wrote [a letter to the management above him](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/) explaining how the site had stayed up while changing many times a day. He was explicit that the dark launches and flags were built by the developers and not by operations.

### The team that writes it runs it

Werner Vogels put it in four words in 2006: ["You build it, you run it."](https://queue.acm.org/detail.cfm?id=1142065) The reasoning is that the people who feel a service's failures are the people who can fix their cause.

Netflix's account is the most useful, because it records the halfway version failing. For a while its developers could deploy but a release specialist remained. The developers often deferred to the specialist, and the specialists found it hard to make time to automate the job. Full ownership worked, but only with central tooling teams, training and spare capacity. [The post says](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249) that without those, "teams risk overload and burnout".

Putting developers on call without dashboards they can read, access they can use, or a runbook written for them is the fastest way to lose them.

### Testers and release managers

None of this makes testers or release managers redundant, and the firms that are famous for it kept more of both than their reputations suggest.

Google moved testers out of product teams' reporting lines and turned many of them into tool builders. James Whittaker, who ran testing there, [wrote that](https://testing.googleblog.com/2011/01/how-google-tests-software.html) "it's the product teams that own quality, not testers". But Google kept test engineers, and the change took about five years, driven at first [by volunteers without executive backing](https://martinfowler.com/articles/testing-culture.html).

Microsoft's Azure DevOps group merged its development and test organisations and rewrote its tests over more than two years. Brian Harry, who ran the group, [was candid about the cost](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/): a separate test discipline had given the organisation a measurable, controllable investment in testing and a career path for testers, and both were given up. He also admits that eighteen months in, he started asking when it would be finished.

Facebook, which is often said to have no QA, had a release engineering team with the power to refuse and revert changes, and kept a three-day soak for its iOS app, on employees and beta users, because an app on a phone can't be recalled.

The people who run the train today know where the faults hide. Their work moves to the comparison tooling, the pipeline and the review of ramp plans. It's better to say so early than to let people guess.

### The people who say no

Flickr's operations team held a go or no-go decision on launches, alongside the other groups involved. Allspaw's letter describes what he did with it: "A significant part of my job was working towards saying 'go', not 'no-go'." Speed was conditional on safety. In his words, "When it wasn't safe, we slowed, and everyone was fine with that happening".

A change board can work the same way. Its members don't lose the authority to refuse. Their job becomes making it safe to say yes: approving ramp plans, setting stop conditions, and deciding which kinds of change are pre-authorised.

### On-call can undo

Whoever is on call needs the authority to switch a flag off or roll back a build without asking, and needs to be thanked for it afterwards. Google's guidance says nobody should be asked to justify a rollback as long as its record describes the problem. Booking.com's rule is that ["Everyone in the company must be able and feel empowered to stop harmful experiments of their own accord."](https://arxiv.org/abs/1710.08217)

The alternative is on record too. In November 2014 Microsoft's service had an outage of seven and a half hours caused by a change in the database service beneath it. Harry's [write-up](https://devblogs.microsoft.com/bharry/outage-on-monday-nov-24) says that once the change was identified, it took approximately 45 minutes to work out how to turn off the flag behind it, because of tooling problems and missing documentation. A kill switch that the people on call can't find or operate isn't a control.

### The first bad day

Every one of these programmes has a bad day, and what happens next decides whether it survives.

OANDA had deployed continuously for several years when a major failure, in the words of the paper that describes it, "cost the company a significant amount of money within seconds". Senior management's first reaction was to ask for more approvals and a separate, traditional testing team. The post-mortem found something less convenient: the unit tests had caught the bug, and their failures had been ignored among false alarms. More approvers would have been approving a change whose own tests already said no. The engineers argued instead for a renewed focus on automated testing, and won.

The same paper records what happens when leadership changes its mind. In mid-2012, executives more inclined to traditional process took over, and although the engineering team was much the same, deployments fell by 23%.

John Allspaw's essay on [blameless post-mortems](https://www.etsy.com/codeascraft/blameless-postmortems) explains the mechanism from a manager's side. An engineer who expects to be punished stops supplying detail, and management ends up knowing less about how the work is actually done. The first question after a failure shapes everything after it. "Who approved this?" produces more approvers, while "What did we know, and why did nobody act on it?" produces a better control.

The 2019 State of DevOps report found the same pattern across its survey: organisations ["often respond to problems with software releases by introducing additional process and more heavyweight approvals"](https://dora.dev/research/2019/dora-report/2019-dora-accelerate-state-of-devops-report.pdf), and its analysis suggested that this makes things worse.

### How long it takes

Longer than anyone plans for. On the morning Microsoft launched Visual Studio 2013, Harry's team switched on a batch of feature flags. The service became unresponsive at peak, and switching the flags off didn't bring it back. Harry [wrote it up](https://devblogs.microsoft.com/bharry/a-rough-patch/) in detail, and one lesson he drew was that the service ran as a single instance, so that, flags aside, "all customers are affected or none". Flags had given his team a switch but no small place to be wrong.

One remedy was to deploy at weekends, which he called a mitigation rather than a fix. Another was a separate instance for accounts that volunteered to take every deployment first, and Harry said his own account would be on it. By 2017, by his own account, the change had taken about six years and wasn't finished. His judgement was that trying to do it all at once would have failed.

LinkedIn took a different route and [stopped feature development](https://www.linkedin.com/blog/engineering/architecture/brief-history-scaling-linkedin) for a period in late 2011 to rebuild its tooling. Eight years later it wrote that many of its teams [still relied on a manual release process](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment).

Amazon's approach to sceptical teams is the most transferable. They were told to ["encode their current release process, manual steps and all, in a pipeline"](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/), and then to automate one step at a time as their confidence grew, so that nothing was removed on the first day.

## How it goes wrong

The published failures of this model are failures of doing part of it.

### Flag debt

Flags are cheap to add and expensive to keep. Every flag that's on for some clients and off for others means production is running more than one system, and the regression pack tested one. Every change made near a live flag has to work in both states. The old path stops being exercised on the day the flag reaches everyone, and after that, switching it off is an untested change.

A study of Chrome found its flags growing [from 263 to 1,040](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf) over the releases it examined. Uber eventually [built a tool to remove stale flags](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf) and deleted 1,381.

The remedy is mechanical: a flag can't be created without an owner and an expiry date. The build warns as the date approaches and fails once it has passed. Kill switches that are meant to be permanent are registered as such. There's a cap on live release flags per service, and a flag is never reused.

### A reused flag and an incomplete deployment

Knight Capital is the standard cautionary tale, and it's usually told wrong. The SEC's order describes the following.

Knight's new code reused a flag that had once activated an old function called Power Peg, which hadn't been used since 2003 and had been left in the code. The new code was deployed in stages over several days. A technician didn't copy it to one of the eight servers, and no second person checked. Before the market opened on 1 August, the system sent 97 automated emails referring to the problem, and nobody acted on them. When orders carrying the flag arrived, seven servers ran the new code and the eighth ran Power Peg. In about 45 minutes Knight executed 4 million trades in 154 stocks and ended up with positions that cost it more than $460 million. During the incident, the firm uninstalled the new code from the seven servers where it had been deployed correctly, and in the SEC's words, "This action worsened the problem."

![Knight Capital: eight servers, seven with new code and one with old code; a timeline from staged deployment beginning 27 July to activation everywhere at the market open on 1 August; about 45 minutes, 4 million executions, over $460 million lost.](figures/10-knight-capital.svg)

There are four separate lessons in that: don't reuse a flag; delete dead code; check by machine, before any flag moves, that every node is running a build that contains the flagged code; and don't improvise a rollback. The SEC's own remedies were a second person checking the deployment, monitoring of the warning messages, and a clear rule for when to disconnect.

### Dormant code switched on everywhere

In June 2025 a Google Cloud outage came from code that had been rolled out region by region and never exercised, and was then triggered everywhere at once by a policy change. Google's [incident report](https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW) says the code "did not have appropriate error handling nor was it feature flag protected", and commits that all changes to critical binaries will be "feature flag protected and disabled by default".

Deploying gradually isn't the same as exposing gradually. Code that sits in production unexercised has proved nothing.

### A kind of change that skipped the ramp

CrowdStrike staged the rollout of its software but not of the content files the software reads. Its [analysis of the July 2024 outage](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) concludes that each such file "should be deployed in a staged rollout". Cloudflare's 2019 outage came through a channel for firewall rules whose procedure, [in Cloudflare's words](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/), "allowed a non-emergency rule change to go globally into production without a staged rollout".

Configuration, flags, reference data and operator scripts are all changes. If one of them has a fast path that reaches everything at once, that's the path the next outage will use.

### The safety mechanism as the cause

In December 2025 Cloudflare had another outage, of about 25 minutes affecting roughly 28% of its HTTP traffic. One of the changes involved was [a kill switch applied through a global configuration system](https://blog.cloudflare.com/5-december-2025-outage/) that reaches the whole fleet within seconds.

The flag service, the configuration system and the rollback tooling are production systems. They need their own staged rollout, and they mustn't depend on the things they exist to switch off.

### A ramp that ended too soon

Roblox had used a new streaming feature on some of its services for months. A day after it enabled the feature on its traffic-routing service, [a 73-hour outage began](https://about.roblox.com/newsroom/2022/01/roblox-return-to-service-10-28-10-31-2021/). It had run for a day without trouble before the incident started.

At least one stage of a ramp has to span a real peak, and for batch, a full run.

### A big bang with no way back

The opposite failure is still the most expensive. TSB moved 5.2 million customers to a new platform over a single weekend in 2018, with testing cut short and no ability to roll back. It received 225,492 complaints and was fined £48.65 million. The [FCA's final notice](https://www.fca.org.uk/publication/final-notices/tsb-bank-plc-2022.pdf) found that fuller testing of the bank's two-data-centre configuration would likely have found the fault, so the case argues for better testing as well as for smaller steps.

### How programmes fail

Beyond single incidents, there are a few ways the whole effort tends to stall.

In the first, the pilot never touches a money path: a team picks an internal reporting service because it's safe, declares success after two quarters, and has learned nothing about stored decisions, irrevocable payments or reconciliation.

Shadow comparisons pile up unread, and stages pass on elapsed time.

The change board approves each ramp step as if it were a release, and the ramp takes longer than the train did.

In the last, speed becomes the goal. The 2017 State of DevOps survey found that its lowest-performing group had [sped up and reported more failures](https://dora.dev/research/2017/2017-state-of-devops-report.pdf). Deployment frequency is a symptom of small, safe changes, and as a target it gets gamed.

## What you take on

It's fair to set the new risks beside the ones being retired.

| Risk retired or reduced | Risk taken on | What controls it |
| --- | --- | --- |
| A large bundle fails and the cause is hard to find | A flag is left in place, reused or forgotten | An owner and expiry date on every flag, enforced by the build; never reuse |
| Every client meets a new behaviour in the same instant | Clients run different behaviour at the same time | A cap on live flags per service; one ramp per reconciliation domain at a time |
| A back-out plan is first used during an incident | A rollback meets data the old build can't read | Mixed-version tests on every build; a rollback rehearsal every month |
| A fault waits five days for its fix | A flag is switched on before the deployment is complete | A machine check, before any flag moves, that every node runs a build containing the flagged code |
| Changes pile up behind a soak | A flag change reaches the whole fleet instantly | Flag changes rolled out a site at a time, under dual control |

## What the evidence shows

The case that this is better rests on a few things that are well supported and a few that aren't.

Well supported: small, frequent, carefully exposed change is compatible with the stability a financial firm needs. The FCA's review found smaller, more frequent releases succeeding more often. Between 2008 and 2014 Facebook's developers grew roughly twentyfold and its deployments with them, and [the paper on Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) reports that "the number of critical issues arising from deployments was almost constant regardless of the number of deployments". One group at the Financial Times went from about twelve releases a year, of which one or two failed, to about 2,500 in 2017 with, by its own count, fewer than 25 failures.

Also well supported: heavy external approval doesn't buy stability. The State of DevOps surveys found from 2014 onwards that external change approval slowed delivery with no measurable benefit to stability, and the FCA's finding about change boards points the same way. These are surveys and associations, not experiments.

Not available: a before-and-after incident record from a bank or payments firm that left a release train. The firms that describe releasing many times a day while moving money, Monzo and Starling among them, were built new. No firm with a mainframe core has published how it made the transition. Nobody has published how many faults a soak catches per day of waiting, or how many a canary catches.

So the published record supports the claim that this works and is safe when done completely. Whether it improves a particular firm's numbers is something only that firm's own trial can show.

## Getting started

Nobody has to stop the train to begin. The most useful first steps can run beside it.

### Measure the three days

Six questions settle most arguments about whether there's anything to gain.

1. Of the three days, how many hours are work, and how many are waiting for an environment, a window or a person?
2. What did the soak catch in the last year, by class of fault, and what reached production in spite of it?
3. How many changes were in the train behind each of the last five incidents, and how long did it take to find the one responsible?
4. How many changes did the change board reject or send back last year?
5. How long did the last real rollback take, who authorised it, and had that path been rehearsed?
6. How do hotfixes, which skip most of the three days, compare with trains in failure rate?

If the soak turns out to be catching faults nothing else would, and most of the three days turn out to be work, there's less to gain than this post suggests, and that's worth knowing.

### Put the existing process in a pipeline

Encode today's process, manual approvals included, as Amazon did. This removes no control, and it produces the record that auditors ask for on every change, and it shows where the waiting is.

### Pick one service that moves money

Choose a service the team owns outright, with no vendor package or mainframe component in its path, and that moves real money at low value. A reporting service is safer and teaches nothing.

Agree its change policy with risk and audit before any code moves: dark deployment, shadow runs, flag steps and rollback as defined kinds of change. Find one client willing to go first, and build the prerequisites for that one service.

### Decide in advance what stops it

Reasonable stop conditions are any loss of client money, any reconciliation break traced to a ramp, or six answers at the end of two quarters that are no better than the baseline. In that last case the cost was a small team's time, and the firm knows exactly what its three days buy.

### Then widen slowly

The firms that got furthest did it in bounded steps over years, and kept what worked. Amazon still has pre-production stages and deployment windows. Google still runs release trains for some products. The train doesn't have to be retired until the evidence from your own systems says it can be.

## Further reading

If you read five things, read these.

- Clare Liguori, [Automating safe, hands-off deployments](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/). The most complete description of a production pipeline with bake times.
- The FCA's [Implementing technology change](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change). A regulator's data on what makes changes fail.
- Savor et al., [Continuous Deployment at Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf). Includes a trading firm and its bank clients.
- Brian Harry, [A Rough Patch](https://devblogs.microsoft.com/bharry/a-rough-patch/). What it looks like when flags go wrong in public.
- The SEC's order on [Knight Capital](https://www.sec.gov/litigation/admin/2013/34-70694.pdf). Worth reading in the original.

The research notes behind this post, with a source-by-source record of what was read and how, are in [research_notes](research_notes/Testing%20gates%20to%20ramping%20culture/) and [the synthesis report](reports/Testing%20gates%20to%20ramping%20culture.md). The stage durations, prerequisites and controls in this post are judgement, not citation.
