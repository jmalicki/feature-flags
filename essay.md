# Deploy every day, release when it is proven

*An opinion for engineering directors on replacing the release train.*

You release twice a week, and each train spends three days in promotion and soak before it reaches clients. I think you should replace that model over the next two years, starting this quarter with one service. Most of your changes could be running in production the day after they are finished, yet your clients would meet less unproven change than they do now. The price is a platform team, a rewritten change policy and a harder way of working, for your engineers and for you.

This is an opinion on a release model, formed from your description of it and from the published record of firms that have left it behind. I have not seen your change or incident records. Where the argument turns on them I say so, and the first thing I ask is that you pull them.

Three terms carry the argument. To *deploy* is to put code into production; to *release* is to let clients meet new behaviour; and a *train* is the twice-weekly bundle in which you currently do both at once.

## What three days cannot tell you

You accept the three days because they buy safety, and in part they do. A soak crosses boundaries that no short test reaches: sessions that fail only after hours of idleness, memory and file handles that creep, the roll of the business date, end-of-day running on new code while online traffic continues. I would not give any of that up. Below I move it into production, and say which runs have to stay longer.

But consider what the three days cannot see. They cannot tell you how a receiving bank will answer a real payment, because a simulator answers in its place. They cannot test a path that nothing exercises. Knight Capital's new order-routing code went onto its production servers in stages from 27 July 2012, five days before it was first used. The SEC's order against the firm records no incident in that time, because nothing was yet using the code. On the morning it was activated, the firm took on unwanted positions in about 45 minutes that cost it more than $460 million.[^knight] Nor can they make a large change small. The UK's Financial Conduct Authority examined more than a million changes made by 23 financial firms in 2019. Changes classed as major, which generally received more oversight, failed at 3.8%, against 1.6% for changes as a whole. The change boards that reviewed those major changes approved more than nine in ten of them.[^fca]

![Three panels of FCA statistics: 1.6% of all changes failed against 3.8% of major changes; change boards approved over 90% of major changes; change caused 17% of material incidents reported to the FCA and 24% of firms' high-severity incidents.](figures/07-fca-findings.svg)

The FCA's figures are associations, with caveats the review states itself: major changes are riskier by nature, and firms that described more of their work as DevOps showed a slightly higher failure rate, on a sample too small to support a conclusion. I would still take one of its key findings at face value: "firms that deployed smaller, more frequent releases had higher change success rates than those with longer release cycles".[^fca]

So the three days find one class of fault and miss two others, at a cost that no incident report records.

## Where the time goes

With trains evenly spaced through the week, a finished fix waits a little under two days on average for the next one and then spends three days in promotion. That is about five days, or seven if it has just missed a train, and a corrected label waits as long as a new routing rule for outbound payments.

Five days sounds tolerable until you multiply it. The table sets out what the model costs for four kinds of work and what I would expect in its place. The right-hand column is my estimate, which your own records will correct.

| Kind of work | On the train | Deployed daily, released separately |
| --- | --- | --- |
| An ordinary change, which is most of them | About 5 days from finished to live | In production the next business day, on every node the day after |
| A fault found in production | 5 days, or a hotfix that skips most of the three days | The same, through the normal path |
| A feature that needs three rounds of feedback from production | About 15 days of waiting | About 3 |
| A risky change on a money path | 5 days, then every client at once | Evidence from production the next day; full release in four to eight weeks |

Look at the last row, because it is the one that sounds wrong: a risky change takes longer under the model I am recommending, and it should. The gain comes from the other three rows, where ordinary work no longer queues behind it.

Bundling has a second cost, which shows up during incidents: each train carries half a week of other people's changes, so when a train misbehaves your first job is to find which change did it. And a schedule with a cut-off changes how people behave near it. Facebook measured this on its mobile releases and found that code pushed on the day of the cut was of lower quality than code pushed on other days.[^rossi16]

I cannot tell you how much of your three days is work. Amazon once measured its own pipeline at 16 days from check-in to production and found that almost 14 of them were spent waiting for someone to start the next step.[^mansour] I expect your ratio is better than that, but I would be surprised if work accounted for more than a day of the three. It is the first number I would ask you for.

![A sixteen-day bar: about two days of work and almost fourteen days of waiting for someone to start the next step.](figures/08-sixteen-days.svg)

Could you simply run the train every day? Not while each one takes three days, because three trains would then be in promotion at once, which means three sets of environments and three times the partner test windows. A fault found on the third day of one would already be in the two behind it. Every change would still wait three days and still reach every client in the same instant.

## Separate the two decisions

Speed and safety trade against each other only because the train deploys and releases in one act. The caution a risky change deserves is spent on the whole train, so everything on the train waits and everything written meanwhile queues behind it. Google's Site Reliability Workbook puts the constraint in a sentence: "If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."[^sre]

Take the two apart. Ship each change that alters what is sent, posted, charged or reported with its new behaviour disabled behind a flag. Deploy every day, since disabled code is meant to change nothing a client can see, and the pipeline has to prove that the disabled path matches yesterday's. Then release each behaviour on its own, to a few clients first, when you have evidence that it is right. The long wait moves off the train and onto the one behaviour that needs watching.

That leaves the part of a build that no flag can guard. A library upgrade, a new database driver or a runtime change belongs to the whole binary, and these are the changes that leak memory and exhaust connection pools. The binary therefore still needs time under load. I would give it that time in production and call it a bake: one node at each site first, kept there through a daily peak, before the build goes wider. Because daily deployment restarts every process daily, a slow leak may not show until a change freeze, so I would keep a multi-day soak for runtime and library upgrades. Amazon does the same at larger scale. Each build goes to one machine, then to one region, then outward in waves; each stage has a minimum wait of between one hour and twelve, and an alarm rolls the build back automatically. A change takes four or five business days to reach every region.[^liguori] Notice that Amazon's elapsed time is no shorter than yours. What differs is that builds enter one after another, each carries only the changes made since the last, and the waiting is done on real traffic at limited exposure.

Batch is the exception, because end-of-day runs once over the whole book and cannot be sliced by node. It needs its own form of the same idea: run the new code on the smallest partition for one cycle, or run it in parallel, with postings and outbound files suppressed, against the same input and compare its output with the batch of record.

## One change, both ways

Suppose outbound credit transfers below a threshold are to move from the batch clearing rail, A, to the instant rail, B. A payment on A can be pulled until the submission cut-off and settles a day or more later. A payment on B is final within seconds, at any hour, and can be recovered only by asking the beneficiary's bank to send it back. B also reaches only the banks that have joined it, limits each payment, and settles against a position you must fund in advance, weekends included.

On the present model this change joins the next train, where the regression pack runs it against simulators for both rails before it passes a performance run, a batch cycle, the soak and the change board. Then, unless you have built a per-client switch, it is live for every client and every payment in scope. If something is wrong with how real banks on B respond, you learn it from all of your clients at once, and what has been sent cannot be recalled.

Done the other way, the work starts with a design decision the train never forces. The rail is chosen once, when the payment is accepted, and written to the payment record. Enquiries, recalls and postings follow the stored rail for the life of the payment, and a payment that times out on B is resolved by status enquiry and is not sent again, on either rail, while its outcome is unknown.

The change then climbs through five stages. The hold I give for each is my own judgement of how long its evidence takes to arrive.

1. **Dark.** The code ships disabled. The build bakes on one node per site through a daily peak, and end-of-day runs the new code on its smallest partition first.
2. **Shadow.** For all traffic, the new rule records the rail it would choose, the reachability and limit checks behind the choice, and the message it would build, and sends nothing. Compare its choices with an independently written statement of the rule. Hold for at least seven days, timed to include a weekend and a payroll peak. Stop on any mismatch nobody can explain.
3. **Synthetic client.** Test accounts in production send small real payments over B to accounts you keep at other banks, through acceptance, rejection, an injected timeout resolved by status enquiry, a recall request and reconciliation. Switch the flag off mid-stream as a rehearsal. Hold for two business days and a weekend.
4. **One consenting client.** One payment type, with a low cap per payment and per day. Watch rejection rates by reason code against that client's return rates on A and the synthetic client's on B, time to confirmation, unknown outcomes, the prefunded position, and breaks in both your reconciliation and theirs. Hold for five business days and the weekend they span. Stop on any duplicate, any break, or any outcome still unknown after an hour.
5. **Widen.** Add clients, then raise the cap, never both in one step. Hold each step for a full reconciliation cycle, and hold one of them across a month-end.

Switching the flag off sends new payments back to A from its next window, but it recalls nothing. Every payment already sent on B is final, so your exposure is bounded by the caps: the daily cap, times the clients enabled, times the days a fault goes unnoticed.

Three of the stages have a failure I would plan for. In shadow, the risk is that nobody owns the mismatch report and the stage passes on elapsed time. At the synthetic client, a Saturday payment posts to Monday's business date and breaks the settlement-account reconciliation. With the first real client, the fault may be on their side: a treasury system that expected next-day value.

## What has to be true first

None of this is safe on a money path until six unglamorous things are in place, and I would not enable a single flag there without them.

- You can see one client on one build: acceptance rate, rejections by reason code, timeouts and time to confirmation, for a single client and a single version, within minutes. Infrastructure dashboards and a daily operations report are not enough.
- Yesterday's build can read what today's wrote. With a daily deployment and a one-day bake, production runs two versions every day of the year, so the pipeline has to prove on every build that each can process the other's messages and records; otherwise rollback is only a hope.
- Schema changes expand before they contract: add, write both ways, backfill, compare, switch reads. Those steps can ship daily, but the final removal is irreversible and stays on a fixed date with a rehearsal.
- Payments are idempotent end to end, because daily restarts, rollbacks and flag changes in mid-flight cause retries and redelivery. The key has to survive them and be checked before the rail is chosen, since neither rail's duplicate check sees a payment sent on the other.
- The flag service is fit for the payment path. It evaluates locally, falls back to its last known value on failure, and to the old behaviour only when it has none, is consistent across sites, and records who changed what under dual control.
- You have a client of your own in production: a fully onboarded synthetic client, with real accounts at other institutions, that takes every ramp first.

For the whole estate I would expect building these to take most of the first year, and the pilot has to build them for its one service first. It is also where the published accounts say the money goes. Monzo wrote that migration and tooling were more than 90% of the effort of introducing automated rollback,[^monzo] while Facebook kept about 5% of its engineers on tooling and OANDA 15%.[^savor]

## The part that is about people

The mechanics are the smaller part of the work. Three firms that work this way have described the larger part.

Start with the worst day. OANDA runs a currency-trading platform and deploys to it continuously. After several years of this, a major failure, in the words of the paper that describes it, "cost the company a significant amount of money within seconds". Senior management reached first for more approvals and a separate, traditional testing team. The post-mortem found something less convenient: the unit tests had caught the bug, and their failures had been ignored among false alarms. More approvers would have been approving a change whose own tests already said no. The engineers argued instead for a renewed focus on automated testing, with test results made part of the decision to deploy, and won.[^savor] Your pilot will have a day like that, and whether the programme survives it depends on the first question you ask: "Who approved this?" gets you more approvers, while "What did we know, and why did nobody act on it?" gets you a better control.

Closer to your own position are the large banks to which OANDA licensed its software, and whose policies did not allow continuous deployment. There each bundle held thousands of changes, failures were harder to isolate, and bugs judged non-critical went unfixed for many months.[^savor]

How long it takes, and who goes first, is Brian Harry's story. On the morning Microsoft launched Visual Studio 2013, his team switched on a batch of feature flags. The service became unresponsive at peak, and switching the flags off did not bring it back. One lesson Harry drew was that the service ran as a single instance, so that, flags aside, "all customers are affected or none".[^harry13] A single instance gave his team no small place to be wrong. One remedy was to deploy at weekends, which Harry called a mitigation rather than a fix. Another was a separate instance for accounts that volunteered to take every deployment first, and Harry said his own account would be on it.[^harry14a] A year later, in an outage of seven and a half hours caused by a change in the database service beneath it, some 45 minutes went on working out how to turn off the flag behind that change.[^harry14] By 2017 the change had taken about six years and, by Harry's account, was not finished; his own judgement was that attempting it all at once would have failed.[^harry17]

Then there are the people whose job is to say no. John Allspaw ran operations at Flickr, where his team, like the other groups involved in a launch, held a go or no-go decision. He described what he did with it: "A significant part of my job was working towards saying 'go', not 'no-go'." He was explicit that the dark launches and flags which made "go" safe were built by the developers rather than by operations, and that speed was conditional on safety: "When it wasn't safe, we slowed, and everyone was fine with that happening".[^allspaw] Flickr hosted photographs. Starling is a bank, releases several times a day, and in 2025 still required three approvals for every release, the last from an engineering lead, director or executive.[^starling25]

Four things will have to change, and none of them is tooling.

The author of a change owns its switch, which means deciding what the flag guards and how the disabled path behaves, building the shadow comparison, writing the ramp plan with its stop conditions, and deleting the flag when the ramp is done. It is more work per change than the train asks for. Flags that nobody deletes accumulate: Uber eventually built a tool to remove stale ones and deleted 1,381.[^piranha] Each one left in place is a second path that your regression pack never tested.

The team that writes a service deploys it and is paged for it. Netflix tried the halfway version, in which developers could deploy but a release specialist remained, and found that developers often deferred to the specialist while the specialists found it hard to make time to automate the job. It also warns that ownership without tooling and slack risks burnout.[^netflix] Your testers and release managers are the people who know where faults hide. Their work moves to the comparison tooling, the pipeline and the review of ramp plans, and you should tell them so before the rumour does.

Whoever is on call may undo a change without asking. Google told its cloud customers that when a fault is suspected in a new release, its own releasing team "rolls back first and investigates the problem second".[^hilton] That only works if the way back has been used. When RBS backed out a batch-scheduler upgrade in June 2012, the back-out caused the incident: the bank had tested returning from Version 2 to Version 1, and what was installed was Version 2A. More than six million customers were affected.[^rbs] So write down the occasions when rollback is the wrong move, such as inside a cut-off window or during a batch step, and rehearse the rest monthly: switch off every flag the newer build introduced, then restore the previous build exactly as it ran, kept by its hash, with its configuration. Rollback restores the service and does nothing for payments already sent.

![Three kinds of rollback: switch traffic back to a still-running old version; redeploy the kept image by its hash; rebuild the old source. None of them undo data written, schemas migrated, messages sent or money moved.](figures/09-three-rollbacks.svg)

Risk and audit write the policy with you. The rules and supervisory guidance I have read ask for a recorded change, proportionate testing, approval by someone with authority who is not the author, segregation of duties and a way back. Singapore's guidelines also expect a change board, and both they and the US examiners' handbook expect quality assurance independent of development. None asks for three days.[^rules] But your auditors test you against your own change policy, and that policy describes the train. A flag step has to become a recognised kind of change: approved once as part of a ramp plan, executed under dual control, and evidenced by a record of its state on any given date. If each step goes back to the board as a normal change with three days' notice, the ramp will be slower than the train was.

## What you are trading

The new model has failures of its own, and I have cited the serious ones. Set them beside the failures you would retire.

| Risk you retire or reduce | Risk you take on | What controls it |
| --- | --- | --- |
| A large bundle fails and the cause is hard to find | A flag is left in place, reused or forgotten | Expiry date on every flag, enforced by the build; permanent kill switches registered as such; never reuse |
| Every client meets a new behaviour in the same instant | Clients run different behaviour at the same time | A cap on live flags per service; one ramp per reconciliation domain at a time |
| A back-out plan is first used during an incident | A rollback meets data the old build cannot read | Mixed-version tests on every build; monthly rehearsal |
| A fault waits five days for its fix | A flag is switched on before the deployment is complete | A machine check, before any flag moves, that every node runs a build containing the flagged code |

That last row is Knight, whose new code had reached seven of eight servers with nobody checking the eighth, and whose flag had once meant something else.[^knight]

![Knight Capital: eight servers, seven with new code and one with old code; a timeline from staged deployment beginning 27 July to activation everywhere at the market open on 1 August; about 45 minutes, 4 million executions, over $460 million lost.](figures/10-knight-capital.svg)

There is also a limit to what I can show you. I have found no bank or payments firm that has published its incident record from before and after leaving the train. The firms that describe releasing many times a day while moving money, Monzo and Starling among them, were built new, and I found no account from a firm with a mainframe core. The nearest before-and-after I know comes from a news publisher: one group at the Financial Times went from about twelve releases a year, of which one or two failed, to some 2,500 in 2017 with, by its own reckoning, fewer than 25 failures.[^wells] The record supports a modest claim: small, frequent, carefully exposed change is compatible with the stability a financial firm needs. Only a trial on your own systems can show whether it improves your numbers.

## What stays on a dated release

Some changes should not be ramped. They go out whole, on a date agreed in advance, and I would have the policy say so.

Anything a client or counterparty can see in an interface stays on an agreed date: message formats, file layouts, cut-off times. The worked example changes what a client sees, in debit time and value date, which is why it needs the client's consent and an agreed start. Scheme and rulebook changes take effect on the scheme's date; the code can ship dark weeks ahead, but activation is for everyone at once and has to be rehearsed that way. The final, irreversible step of a schema change gets a rehearsal on a production-sized copy. And a new settlement file goes to a counterparty whole, at a cut-off. It cannot go to 1% of counterparties, so generate old and new in parallel through several cycles, including a period end, and compare.

Shared components are a harder case. The scheme gateway, the ledger posting engine and the batch scheduler serve every client, so a change to one of them cannot be ramped by client. Ramp it by payment type or by batch partition, or by node where nodes share no state; where none of those is possible, keep it on a dated release.

## What I am asking you to decide

I am asking for three decisions now. None commits you beyond two quarters, and the train runs throughout.

| Decision | Owner | Done when |
| --- | --- | --- |
| Pull the baseline from your own records | Head of change management | The six questions below are answered, within six weeks |
| Name one service that moves money and one director to answer for it | Engineering directors | A service you own outright is chosen, with a client willing to go first |
| Write the pilot's change policy | Head of technology risk, with that director | Dark deployment, shadow runs, flag steps and rollback are defined change types before any code moves |

The baseline is six questions.

1. Of the three days, how many hours are work and how many are waiting for an environment, a window or a person?
2. What did the soak catch in the last year, by class of fault, and what reached production in spite of it?
3. How many changes were in the train behind each of your last five incidents, and how long did it take to find the one responsible?
4. How many changes did the change board reject or send back last year?
5. How long did your last real rollback take, who authorised it, and had that path been rehearsed?
6. How do hotfixes, which skip most of the three days, compare with trains in failure rate?

The pilot should move real money at low value. A reporting service would be safer, and after two quarters it would have taught you nothing about stored decisions, irrevocable payments or reconciliation. Expect it to occupy one small team for those two quarters; I cannot size it more closely until I have seen the service.

Agree in advance what would stop it. I would stop on any loss of client money or any reconciliation break traced to a ramp, and I would not continue if at the end the answers to the six questions are no better than the baseline. In that last case you will have spent a small team's time and learned exactly what your three days buy.

One commitment is yours alone. Decide now that when the pilot has its bad day, your first question will be what the evidence showed and who was free to act on it.

## Sources

The research behind this opinion is in [the synthesis report](reports/Testing%20gates%20to%20ramping%20culture.md) and [the research notes](research_notes/Testing%20gates%20to%20ramping%20culture/). Estimates, stage durations, prerequisites and controls are my judgement, not citation.

[^knight]: Securities and Exchange Commission, [In the Matter of Knight Capital Americas LLC](https://www.sec.gov/litigation/admin/2013/34-70694.pdf), Release No. 70694, 2013.
[^fca]: Financial Conduct Authority, [Implementing technology change](https://www.fca.org.uk/publications/multi-firm-reviews/implementing-technology-change), 2021, on 2019 data.
[^rossi16]: Rossi et al., [Continuous Deployment of Mobile Software at Facebook](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf), FSE 2016.
[^mansour]: Mark Mansour, [Going faster with continuous delivery](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/), Amazon Builders' Library, 2019. The measurement was taken more than ten years earlier.
[^sre]: Google, [Canarying Releases](https://sre.google/workbook/canarying-releases/), *The Site Reliability Workbook*.
[^liguori]: Clare Liguori, [Automating safe, hands-off deployments](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/), Amazon Builders' Library, 2020.
[^monzo]: Sewell and Pallamidessi, [Argo Rollouts at scale](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale), Monzo, 2022.
[^savor]: Savor et al., [Continuous Deployment at Facebook and OANDA](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf), ICSE 2016 Companion.
[^harry13]: Brian Harry, [A Rough Patch](https://devblogs.microsoft.com/bharry/a-rough-patch/), 2013.
[^harry14a]: Brian Harry, [Visual Studio Online Update – Feb 10](https://devblogs.microsoft.com/bharry/visual-studio-online-update-feb-10/), 2014.
[^harry14]: Brian Harry, [Outage on Monday Nov-24](https://devblogs.microsoft.com/bharry/outage-on-monday-nov-24), 2014.
[^harry17]: Brian Harry, [How we approach testing VSTS to enable continuous delivery](https://devblogs.microsoft.com/bharry/testing-in-a-cloud-delivery-cadence/), 2017.
[^allspaw]: John Allspaw, [Convincing management that cooperation and collaboration was worth it](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/), 2012, reproducing a letter written in 2009.
[^starling25]: Moore and Mak, [How we made everyone a Release Engineer](https://technology.starlingbank.com/blog/how-we-made-everyone-a-release-engineer), Starling Bank, 2025.
[^piranha]: Ramanathan et al., [Piranha: Reducing Feature Flag Debt at Uber](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf), ICSE-SEIP 2020.
[^netflix]: Netflix Technology Blog, [Full Cycle Developers at Netflix](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249), 2018.
[^hilton]: Adrian Hilton, [Reliable releases and rollbacks: CRE life lessons](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons), Google Cloud, 2017.
[^rbs]: Financial Conduct Authority, [Final Notice to RBS, NatWest and Ulster Bank](https://www.fca.org.uk/publication/final-notices/rbs-natwest-ulster-final-notice.pdf), 2014.
[^rules]: The US FFIEC IT Examination Handbook booklet on development, acquisition and maintenance (2024), the European Banking Authority's guidelines on ICT risk, the EU's Digital Operational Resilience Act, and the Monetary Authority of Singapore's technology risk guidelines. Section-by-section notes are in [audit_and_compliance.md](research_notes/Testing%20gates%20to%20ramping%20culture/audit_and_compliance.md).
[^wells]: Sarah Wells, [Mature Microservices and How to Operate Them](https://www.infoq.com/presentations/microservices-financial-times/), QCon London 2019.
