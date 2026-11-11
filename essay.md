# Deploy every day, release when it is proven

A fix that an engineer finishes on a Wednesday morning reaches our clients the following week. It waits for the next train, which on a twice-weekly schedule is a little under two days away on average. Then it spends three days being promoted through environments and soaked. That is about five days for a typical change and seven for an unlucky one, and it is the same five days whether the change is a corrected label or a new routing rule for card authorisations.

We have stopped seeing this as a cost, because the three days are how we keep clients safe and nobody wants to argue with that. But it shapes everything about how we develop. Work that is finished sits. The engineer who wrote it has moved on to something else by the time production tells them whether it was right. Anything bigger than a few days' work lives on a branch, drifting from everyone else's, because it cannot go on a train until it is whole. And every train carries half a week of other people's changes, so when a release misbehaves the first hour goes on working out whose change it was.

Other firms have measured the same thing in themselves. Before Amazon automated its release process, it found that code took 16 days on average to get from check-in to production, and that for almost 14 of those days nothing was happening to it: it was waiting for someone to start a build, run a deployment or run a test.[^mansour] LinkedIn's mobile team, releasing monthly behind a four-day manual regression pass, watched engineers rush code in before the cut-off because missing it cost a month.[^linkedin] Facebook measured the consequence: code pushed on the day of a release cut was of lower quality than code pushed on other days.[^rossi16] A schedule that punishes missing the train produces changes that should have missed it.

![A sixteen-day bar: about two days of work and almost fourteen days of waiting for someone to start the next step.](figures/08-sixteen-days.svg)

My argument is that we can develop a great deal faster than this and keep the safety the three days buy us. The way to do it is to stop treating deployment and release as one act. We would put code into production every day with its new behaviour switched off, and turn each behaviour on separately, for a few clients at first, when there is evidence that it is right. The tools for this are well understood. What has to change is how engineers write changes and how the rest of us approve, watch and reverse them, and that is why I think of it as a change of culture more than of technology.

## Why we cannot simply run the train faster

The obvious way to go faster is to shorten the three days or run the train daily, and the people who refuse are right to.

The three days do work. The integration packs run against the scheme simulators. There is a performance run and at least one batch cycle. The soak exists to cross boundaries that a quick test never reaches: sessions that only misbehave after hours of idle time, memory and file handles that creep, queues that deepen, the business date rolling over, the end-of-day jobs running on the new code while online traffic continues. Those are real classes of fault. Cut the soak and we stop looking for them.

Running the train daily with the same three days does not get us out of this. Three releases would be in promotion at once, which needs three sets of environments and three times the partner test windows. A fault found on the second day of one release is also in the two behind it. Each change still waits three days, and each release still reaches every client in the same moment.

So within the process we have, speed and safety trade against each other, and we have chosen safety. The trade holds only because of one assumption built into the process: that code arriving in production and clients receiving new behaviour are the same event.

## Deploying is not releasing

They need not be. A change can be written so that the new behaviour sits behind a switch, a feature flag, that is off when the code ships. The code is in production, built and deployed and running alongside everything else, and no client sees anything different. Turning the behaviour on is a separate decision, taken later, for whichever clients we choose.

Once that is true, the two things we care about come apart. Deploying becomes frequent and dull, because a deployment changes nothing a client can observe. Releasing stays careful, and can be more careful than it is now, because it happens to one behaviour at a time and to as few clients as we like.

Google's reliability handbook states the constraint we are living under: "If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."[^sre] Our soak is a long hold applied to the whole release, so everything in the release waits for it and everything written meanwhile queues behind it. A flag moves the long hold onto the single behaviour that needs watching, and the rest of the work flows past.

It would be dishonest to stop there, because not everything in a build can sit behind a flag. A library upgrade, a new database driver, a change to the runtime or to a schema are properties of the whole binary, and they are exactly the changes that cause slow leaks and exhausted connection pools. The binary still needs its soak. What changes is where it happens. Amazon's pipeline puts each build on a single machine in production, then on one region, then outward in waves, and holds at each stage for between one and twelve hours with a minimum amount of real traffic before going further. If an alarm fires, the pipeline rolls back by itself. Builds enter one after another, "so we don't end up with large bundles of changes waiting".[^liguori] For us the equivalent is a daily build that bakes on a small slice of production through a daily peak and a batch window before it goes wider. That is a day, not five, it runs on real traffic, and it carries one day of changes.

### One change, both ways

Take a change we might plausibly make: for dual-network debit cards in certain BIN ranges, route authorisations below a threshold amount to network B and no longer to network A.

Today it joins the next train. The regression pack exercises it against both network simulators. It goes through a performance run, a batch cycle and the soak, then the change board, and then it is live for every client and every BIN range in scope at once. What pre-production could show us is that the messages are well formed and the scripted reversal and timeout cases pass. What it could not show us is how real issuers on network B respond to our real card population. We learn that from production, all at once, and the fuller answer arrives with the next day's reconciliation. If we back out, the transactions already routed to B still need their reversals and clearing handled on B.

Done the other way, the change starts with a design decision that our current process never forces: the routing choice is made once, when the authorisation arrives, and stored on the transaction, so that every later event in that transaction's life follows the stored choice and not the current position of a switch. Then the code ships, switched off, in that day's build.

The first step is to run it in shadow. For all traffic, the new rule works out where it would have routed each authorisation, and we log that decision beside what the old rule actually did. Nothing is sent to B. Within a day we know what share of traffic would move and whether the rule does what we meant across the real spread of BINs and amounts. This is the step that replaces most of what we hoped the soak would tell us, and it runs on production's own traffic with no client exposed.

Shadowing shows what we would send. It says nothing about how B answers. So the next step is real money in small amounts: test cards at a synthetic client in production, through authorisation, reversal, clearing, settlement and reconciliation on the real rail. After that comes one client who has agreed to go first, on one BIN range, with a cap on the amount, held until those transactions have cleared, settled and reconciled. Then more ranges and more clients, each stage held for at least one settlement cycle.

Turning the switch off sends new authorisations back to A, while the stored decision keeps existing transactions on B until they finish. We would have rehearsed that at the synthetic-client stage, so the first time is not during an incident.

![The exposure ladder: dormant and shadow rungs seen by nobody, then staff, a small cohort, and everyone.](figures/02-exposure-ladder.svg)

Set the two side by side. The routing change itself reaches every client later under the second approach, perhaps by weeks. But the engineer has evidence from production the day after writing it. No client has been exposed to an unproven rule. And every other change written that week has shipped without waiting for this one. The gain in velocity comes from the ordinary changes no longer queuing behind the risky ones.

## Does safety survive?

The best evidence comes from our own industry. In 2021 the Financial Conduct Authority published a review of how 23 financial firms had made more than a million production changes during 2019. It found that "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles". Across all changes, 1.6% failed. Among the changes firms classed as major, which received extra oversight, 3.8% did. Change advisory boards approved more than 90% of the major changes they reviewed, and at some firms rejected none all year, which the FCA said "raises questions over the effectiveness of CABs as an assurance mechanism". Emergency changes, which skip most of the normal process, failed at 1.5%.[^fca]

![Three panels of FCA statistics: 1.6% of all changes failed against 3.8% of major changes; change boards approved over 90% of major changes; change caused 17% of material incidents reported to the FCA and 24% of firms' high-severity incidents.](figures/07-fca-findings.svg)

That review is a set of associations. Major changes are riskier by definition, and the FCA did not tell anyone to disband a change board. It is still a regulator looking at firms like ours and finding that size is where failure concentrates and that heavyweight approval did not offset it.

The closest thing to an experiment is OANDA, a currency-trading platform that deployed to production continuously. OANDA also licensed the same software to large banks, whose policies did not allow that, so the banks took it in periodic releases. The engineers who wrote it up described the difference. At the banks each release bundled thousands of changes. That raised anxiety, which led to much more testing. Failures were harder to trace to a cause. Bugs judged non-critical went unfixed for many months, because a fix had to wait for a release.[^savor] It was the same code under two release processes, and by their account the slower process was the less safe one.

OANDA is also honest about what went wrong. One failure "cost the company a significant amount of money within seconds". Senior management's first response was to ask for more approvals and "a full-blown, separate and traditional testing team". The post-mortem found something less comfortable: unit tests had caught the bug, and the failures had been ignored among false alarms. The remedy the engineers argued for, and got, was to make the test results part of the decision to deploy. Later, under executives more inclined to traditional process, deployments fell by 23% with much the same engineering team.[^savor] I draw two things from that. The practice depends on leadership that keeps its nerve after a failure. And it took OANDA two years, and about 15% of its engineers working on tooling, to do this for systems that mattered.

Facebook supplies the long view. From 2008 to 2014 its developers increased roughly twentyfold and its deployments grew with them, while "the number of critical issues arising from deployments was almost constant regardless of the number of deployments". The authors decline to claim that continuous deployment caused this.[^savor] It does show that the two can coexist at scale.

Netflix shows what the alternative had become. In 2012 its canaries ran for a week, and its engineers later wrote that they had been "devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality".[^netflix] Surviving the week had been standing in for evidence.

There is a limit to all of this, and it belongs here. No bank or payments firm has published its incident record from before and after it left release trains. The firms that describe releasing many times a day while moving money, Monzo and Starling among them, were built new; no firm with a mainframe core has written up the transition. So the evidence supports the claim that small, frequent, carefully exposed change is compatible with the stability we need, and that the regulator's own data favours it. It does not prove that our numbers would improve, and the only way to learn that is to try it somewhere bounded and measure.

## Where the care goes

Money is the hard case, because a flag reverses a decision and does not reverse a payment. The firms that have done this with payments put their effort into finding out whether new code is right before it is allowed to move anything.

When Uber replaced the system that authorises its payments, it could not send each authorisation to the processor twice to see whether old and new agreed. So it recorded what the old system sent and what came back, ran delayed copies of real requests through the new service, and compared the request the new service would have sent with the one that had actually gone. That found "dozens of argument mismatches" before a single customer was moved. Then it moved its own employees, then a quarter of a percent of users, then one percent, then five, one payment method at a time.[^uber]

![Uber's payment shadowing: the live path is unchanged and calls the payment provider once; the request and response are recorded; a delayed copy of the request goes to the new service, whose would-be request is compared with the recorded one.](figures/11-payment-shadowing.svg)

We already have a name for this. It is a parallel run, the practice banks use when they replace a system and the one regulators have written into capital rules: the US draft implementing Basel II required at least four quarters of computing capital the old way and the new way side by side.[^basel] What is new is doing it routinely, for ordinary changes, with tooling that makes it cheap. We would have to build it so that it never retains card authentication data, which constrains what can be recorded.

The unit we ramp by is the client, and that needs their consent. Square learned this the awkward way: it moved payments to a new service by random percentages of requests, and afterwards its engineer wrote that this had hidden a regression which showed up only for a particular combination of client software versions. Had the rollout been stable per merchant, it would have been confined to a few.[^square] For us, with clients who have their own notice periods and sign-off, the first cohort is a client who has agreed to go first. Changes to the interface they see stay on agreed dates. What we can ramp at our own pace is behaviour behind an interface that does not change.

Some things do not fit, and for those a hold in pre-production stays. A ledger schema change cannot hide behind a flag: it has to be widened, written both ways, backfilled, compared, switched, and only then narrowed, and the narrowing is irreversible and deserves a rehearsal on a production-sized copy. A new settlement file goes to a counterparty whole, at a cut-off, and cannot go to one percent of them; we would generate old and new in parallel through several cycles including a period end and compare them. Scheme mandates arrive on the schemes' dates. I am not proposing to ramp any of these.

Then there is the way back, which today is a back-out plan in a change record. RBS had one in June 2012, when it backed out an upgrade to its batch scheduler. The back-out caused the incident: the bank "had only tested the consequences of backing out Version 2 to Version 1", and what was installed was a patched version in between. More than six million customers were affected.[^rbs] A way back that has not been exercised is a new change made under pressure.

So rollback has to be something we do routinely. Google's advice to its customers is to roll back first and investigate second, and to do a rollback on purpose if a few weeks have passed without one.[^hilton] Amazon runs it as a stage in the pipeline: deploy to part of the fleet, then roll back, under traffic.[^pokkunuri] The thing we return to should be the previous build exactly as it ran, kept by its hash, not a rebuild from older source. And we would need rules for when a rollback is the wrong move, such as inside a cut-off window or once messages have left the building.

![Three kinds of rollback: switch traffic back to a still-running old version; redeploy the kept image by its hash; rebuild the old source. None of them undo data written, schemas migrated, messages sent or money moved.](figures/09-three-rollbacks.svg)

## The hard part is us

Flags are easy to add and expensive to live with. Each one that is switched on for some clients and off for others means production is running more than one system, and our regression pack and our scheme certification each tested one. Every change near a live flag has to work both ways. The old path, which is the thing we fall back to, stops being exercised the day the flag reaches everyone, and from then on switching it off is an untested change. Chrome went from 263 flags to 1,040 over the releases one study examined, and Uber eventually built a tool to delete stale ones and removed 1,381.[^rahman][^piranha]

Knight Capital is what a neglected flag can do. In 2012 Knight reused a flag that had once activated a function retired in 2003, and left the old function in the code. New software was copied to seven of its eight order-routing servers; nobody checked the eighth. When the flag was switched on, the eighth server ran the old function. In about 45 minutes Knight lost more than $460 million. The detail I find most instructive is that the new code had been going onto production servers for five days before that morning, and nothing had gone wrong, because nothing had called it.[^knight] Time in production had proved nothing about a path that was never exercised, and a soak would have proved the same. In June 2025 a Google Cloud outage had the same shape: code rolled out region by region, never exercised, and then triggered everywhere at once by a policy change.[^google]

![Knight Capital: eight servers, seven with new code and one with old code; a timeline from staged deployment beginning 27 July to activation everywhere at the market open on 1 August; about 45 minutes, 4 million executions, over $460 million lost.](figures/10-knight-capital.svg)

So this only works if engineers treat the switch as part of the change. The author decides what the flag guards and how the off state behaves, builds the shadow comparison, writes the ramp plan and the conditions for stopping, and removes the flag when the ramp is done. That is more work per change than we ask for now, and it asks people to plan for being wrong. Microsoft's experimentation group wrote, after three years of trying to spread a related habit, that most goals in the company were still about shipping, and doubted they had shifted many people's objectives.[^kohavi] Habits follow what code review asks, what counts as finished, and what gets noticed at review time.

Managers have their own list. The team that writes a service has to be the team that is paged for it, and Netflix found the halfway version did not work: where developers could deploy but a release specialist remained, the developers deferred to the specialist and the specialist never had time to automate the job. Netflix is equally plain that full ownership without tooling, training and slack leads to burnout.[^netflix] I do not think this removes our testers or release managers. Someone has to build the comparison tooling, own the pipeline and review ramp plans, and they are the people who know where the faults hide. None of the published accounts gives numbers for how roles changed, so that is a conversation we would have to have openly and early.

Approval moves and does not disappear. Starling Bank was releasing up to five times a day in 2018 with a step in which every engineer vouched in chat for their own commits, and a visible release-in-progress signal of which its engineers noted "our auditors loved this one".[^starling18] In 2025 it still required three approvals for every release, one of them from the business, and released several times a day.[^starling25] The rule texts I have read ask for a recorded change, proportionate testing, an authorised approver who is not the author, and a way back; none of them asks for three days. But our auditors do not test us against the rule texts. They test us against our own change policy, and our policy describes the process we have. Changing it is work for risk and audit to do with us from the first day. In particular they need to decide what a flag change is: who may make one, who approves it, how its state on a given date is evidenced, and what counts as an emergency. If a developer can turn on money-moving behaviour for a client with no record and no second person, we have rebuilt Knight.

Microsoft's Azure DevOps group is the most candid account of how long this takes. On the morning of a major launch in 2013 the team switched on a batch of flags and the service went down; switching them off did not bring it back. Brian Harry, who ran the group, wrote that the underlying problem was that "all customers are affected or none", and within months the team had built a first ring of its own staff who would take every change before anyone else.[^harry13][^harry14a] A year later a fault sat behind a flag for approximately 45 minutes while the team worked out how to turn it off.[^harry14] The rebuilding of its tests took more than two years. Looking back over six, Harry wrote: "If we'd tried to do it all at once. I'm sure we would have failed."[^harry17]

## What I am asking for

I am not asking to stop the train. I am asking for two things that can be done beside it.

The first is to measure what we have, because I have described our three days from the outside and the people who run them can correct me. Six numbers would settle most of the argument:

1. Of the three days, how many hours is something being done to the release, and how many is it waiting for a window or a person?
2. What did the soak catch in the last year, by kind of fault, and what reached production despite it?
3. How many changes were in the release behind each of our last five incidents, and how long did it take to find the one responsible?
4. How many changes did the change board reject or send back last year?
5. How long did our last real rollback take, who authorised it, and had that path been rehearsed?
6. How do hotfixes, which skip most of the three days, compare with train releases for failure rate?

If the soak turns out to be catching faults nothing else would, and most of the three days turn out to be work, then I am wrong about how much there is to gain and we should say so.

The second is one pilot. Choose one service we own outright, with no vendor package or mainframe component in its path. Agree a change policy for it with risk and audit before any code moves, covering dormant deployment, shadow runs, flag changes and rollback. Find one client willing to go first. Run it beside the train for two quarters and count the same six numbers. Decide before we start what result would make us stop.

I cannot price this properly yet. My guess is a small team for two quarters. OANDA's two years and 15% of its engineers are what it cost to do this for everything, and part of the pilot's job is to tell us what our own figure would be. What it would give us, from our own systems and our own data, is the one thing no published account can.

## Sources

The research behind this is in [the synthesis report](reports/Testing%20gates%20to%20ramping%20culture.md) and [the research notes](research_notes/Testing%20gates%20to%20ramping%20culture/). Reviews of the previous draft are in [reviews/essay-v2](reviews/essay-v2/).

[^mansour]: Mark Mansour, [Going faster with continuous delivery](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/), Amazon Builders' Library, 2019. The measurement was taken more than ten years earlier.
[^linkedin]: LinkedIn Engineering, [3x3: Speeding up mobile releases](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases), 2016.
[^rossi16]: Rossi et al., [Continuous Deployment of Mobile Software at Facebook](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf), FSE 2016.
[^sre]: Google, [Canarying Releases](https://sre.google/workbook/canarying-releases/), *The Site Reliability Workbook*.
[^liguori]: Clare Liguori, [Automating safe, hands-off deployments](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), Amazon Builders' Library, 2020.
[^fca]: Financial Conduct Authority, [Implementing technology change](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change), 2021, on 2019 data.
[^savor]: Savor et al., [Continuous Deployment at Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf), ICSE 2016.
[^netflix]: Netflix Technology Blog, [Full Cycle Developers at Netflix](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249), 2018.
[^uber]: Gajera and Blinn, [Migrating Functionality Between Large-scale Production Systems Seamlessly](https://www.uber.com/blog/migrating-functionality-between-production-systems), Uber, 2019.
[^basel]: Federal Reserve, [Basel II draft notice of proposed rulemaking, section 3](https://www.federalreserve.gov/GeneralInfo/Basel2/DraftNPR/NPR/section_3.htm), 2006.
[^square]: Zachary Anker, [Breaking up with your MonoRail](https://developer.squareup.com/blog/breaking-up-with-your-monorail/), Square, 2016.
[^rbs]: Financial Conduct Authority, [Final Notice to RBS, NatWest and Ulster Bank](https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf), 2014.
[^hilton]: Adrian Hilton, [Reliable releases and rollbacks](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons), Google Cloud, 2017.
[^pokkunuri]: Sandeep Pokkunuri, [Ensuring rollback safety during deployments](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/), Amazon Builders' Library, 2019.
[^rahman]: Rahman et al., [Feature Toggles: Practitioner Practices and a Case Study](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf), MSR 2016.
[^piranha]: Ramanathan et al., [Piranha: Reducing Feature Flag Debt at Uber](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf), ICSE 2020.
[^knight]: Securities and Exchange Commission, [In the Matter of Knight Capital Americas LLC](https://www.sec.gov/litigation/admin/2013/34-70694.pdf), Release No. 70694, 2013.
[^google]: Google Cloud, [incident report for 12 June 2025](https://status.cloud.google.com/incidents/ow5i3PPK96RduMcb1SsW).
[^kohavi]: Kohavi, Crook and Longbotham, [Online Experimentation at Microsoft](https://exp-platform.com/Documents/ExP_DMCaseStudies.pdf), 2009.
[^starling18]: Starling Bank, [QCon London 2018 slides](https://archive.qconlondon.com/system/files/presentation-slides/qcon_2018.pptx.pdf).
[^starling25]: Moore and Mak, [How we made everyone a release engineer](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), Starling Bank, 2025.
[^harry13]: Brian Harry, [A Rough Patch](https://devblogs.microsoft.com/bharry/a-rough-patch/), 2013.
[^harry14a]: Brian Harry, [Visual Studio Online update, Feb 10](https://devblogs.microsoft.com/bharry/visual-studio-online-update-feb-10/), 2014.
[^harry14]: Brian Harry, [Outage on Monday Nov 24](https://devblogs.microsoft.com/bharry/outage-on-monday-nov-24), 2014.
[^harry17]: Brian Harry, [Testing in a Cloud Delivery Cadence](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/), 2017.
