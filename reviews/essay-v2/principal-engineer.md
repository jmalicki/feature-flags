# Principal engineer's review of "Stop soaking, start ramping"

Reviewer's vantage point: a principal engineer with fifteen years in card authorisation, ledgers, settlement and core banking, plus time at a large internet company that practises progressive delivery. This is a persona review. Statements tagged *[judgement]* are professional judgement, not sourced claims; nothing tagged that way has been checked against a published source. Statements tagged *[notes]* refer to evidence that is in the project's research notes but did not reach the essay. I read the essay once, then consulted the synthesis report and three research notes (`payments_core_banking_release.md`, `staging_soak_vs_production.md`, `rollback_technology.md`).

## 1. My reaction, as I would give it to the director

The direction is right. The essay is not yet something I can defend in a room of your senior engineers, and they will take it apart in about ten minutes.

Three reasons.

First, it argues against a process you do not have. It defines your soak as "the stretch it spends in pre-production under test traffic, to see whether anything degrades" and then spends nine sections showing that elapsed time in staging is weak evidence. Your three days are not three days of watching a graph. They contain a scheme-simulator regression pack, at least one end-of-day batch cycle with a date roll, a performance run, possibly a failover, a client or partner test window, and an operations handover. The essay never lists these, so it never says which of them a flag ramp replaces and which it does not. The first step in section 10, "Measure your three days", is the step the author needed to do before writing section 1.

Second, almost every mechanism in it is borrowed from stateless request/response systems, and it is silent on the things that make our systems hard: a transaction has a lifecycle that lasts days to months (authorisation, reversal, completion, clearing, settlement, reconciliation, dispute), messages are in flight during every deploy and every flag flip, clients share queues, batches and settlement files, and part of the estate is a mainframe or a vendor package. The essay does not contain the words HSM, reversal, clearing, cut-off, timeout, failover, simulator, certification, tenant, vendor or in-flight. "Schema" appears twice, both in lists of things rollback does not undo. A senior engineer notices the missing vocabulary before they notice any argument.

Third, its strongest evidence is about a bigger gap than yours. You release twice a week. The FCA finding is about "smaller, more frequent releases" against "longer release cycles"; the OANDA banks bundled "thousands of changes"; the Financial Times went from twelve releases a year. By those standards you are already frequent. The essay gives no evidence about the step you would actually be taking, from a three-day batch to a one-change batch, and it should say so.

What I would tell you is this. The core claim is sound: put the wait on the one risky behaviour, in production, at small exposure, and practise the way back. I have seen it work on money-moving systems. But it is an architecture programme with prerequisites, not a release-process change, and for a defined part of your estate (batch, schema, vendor and mainframe components, scheme mandates) some form of pre-production hold stays. The essay admits pieces of this in section 8 and in its list of gaps, in a tone that reads as disclaimers. Your engineers will read those disclaimers as the actual content and the rest as filler, which I think is why it "reads like generated filler": every paragraph is somebody else's anecdote with a citation, and there is no paragraph where the author walks one of our changes through the proposed process and says what you would see at each step.

## 2. Technical credibility: where it is hand-wavy, wrong, or shows no payments experience

### 2.1 What a soak is for

> "The soak is the stretch it spends in pre-production under test traffic, to see whether anything degrades."

That is the textbook definition, and the research notes knew better: the soak note's own inference is that "the defect classes soak is designed for (leaks, pool exhaustion, disk/log growth, slow degradation, time-triggered jobs) are real and are the same classes that short canaries miss. The dispute is where and under what load the elapsed time is spent, not whether elapsed time ever matters." *[notes]* That sentence is more honest than anything in the essay and it was left out.

In our estates the multi-day window exists to cross boundaries, not to accumulate hours *[judgement]*:

- Connection and session behaviour: database and MQ connection pools, scheme TCP sessions with sign-on and echo (network management) messages, key-exchange schedules, idle-timeout and reconnect behaviour that only shows after hours.
- Resource creep: heap, native memory, file handles, log and spool volumes, MQ depth and dead-letter queues.
- Clock behaviour: business-date roll, end-of-day, scheme cut-offs, the first transaction of a new settlement day, daylight-saving changes, certificate and key expiry.
- Batch windows: whether tonight's clearing, posting and extract jobs run to completion and inside their window on the new code, with online traffic still running.
- Capacity: whether the release still holds peak (end-of-month, payday, seasonal peak) throughput within the authorisation timeout budget.
- Failover: whether the release survives a site switch or a node loss in the active-active pair.

A flag ramp addresses none of the first three for the binary itself. They are whole-binary properties.

### 2.2 What three days of promotion contain

> "It is built from everything merged since the last one, promoted through environments, soaked in pre-production, approved, and then given to every client at once."

The essay treats promotion as transport plus waiting. Typical content *[judgement]*: integration against scheme and network simulators and certification test packs; booked test windows with third-party processors and partner banks, which exist on the partner's calendar, not yours; a performance run; a batch cycle with business-date manipulation; data-migration rehearsal for any schema change; sometimes a DR or failover exercise; client UAT or at least client notice; operations acceptance of runbooks. The Amazon "14 of 16 days were waiting" figure is used to imply that most of your three days are idle. They may be. But the essay has no basis for implying it, and if a senior engineer can name what happens in each of the three days, the analogy collapses.

### 2.3 "The binary contains nothing new that is switched on"

> "The binary's canary can then be short, because the binary contains nothing new that is switched on. It only has to show that the build starts, serves and does not disturb what is live."

This is the most damaging sentence in the essay, because the whole of section 5 rests on it and it is false. A build contains things no flag can guard: runtime and library upgrades, driver and MQ client versions, TLS and crypto library changes, compiler and container base-image changes, refactors, the flag checks themselves, configuration schema changes, and database migrations. These are exactly the changes that produce slow leaks and pool exhaustion. The essay's own examples contradict the sentence: Stripe's 2019 outage was "a database version", RBS was "a batch-scheduler upgrade", and Google's 2025 remedy exists because code was not flag-guarded. If the binary canary is short, the soak's real job has been dropped, not moved. Amazon's answer, which the essay cites three paragraphs earlier, is a production bake of an hour to twelve hours per stage with a minimum request count. Say that the binary still needs a bake that crosses a daily peak and a batch window, in production on a small slice, and section 5 becomes defensible.

### 2.4 "It costs no client anything"

> "A shadow run lasts as long as the evidence requires. It costs no client anything, and, as section 5 explains, it holds up nobody else's work."

Shadowing costs capacity and latency on shared resources: database reads, HSM throughput, MQ, CPU on the authorisation path. If the shadow call is synchronous it eats timeout budget; if it is asynchronous it needs a queue, storage and a comparison service that are themselves production changes. Uber used delayed copies for this reason. In a multi-tenant estate every client pays for a shadow run through shared headroom *[judgement]*.

### 2.5 Shadowing anything with side effects, HSM calls or external rails

> "Shadow. Real traffic runs through the new code. Its output is compared with the old code's output and then thrown away."

This is GitHub Scientist's model and it only works for pure computation. The essay partly recovers in section 8 with Uber's record-and-replay, which is the right idea, but it does not say what cannot be handled that way *[judgement]*:

- Stateful checks. Available balance, velocity counters, application transaction counters and holds have moved on by the time a delayed copy is replayed, so the shadow legitimately disagrees. You need either snapshot-consistent reads or a comparison that knows which fields are state-dependent.
- Generated values. System trace numbers, retrieval reference numbers, timestamps, MACs and cryptograms differ by construction. The diff has to be field-aware, and building the field-level ignore list for an ISO 8583 or ISO 20022 message is weeks of work.
- HSM calls. PIN translation, PIN verification, MAC generation and cryptogram validation go to a capacity-limited, audited device. Shadow traffic doubles that load unless stubbed, and stubbing means the cryptographic path is not tested.
- Sensitive authentication data. Record-and-replay stores the request. For card traffic the request contains data (PIN block, card verification value, full track) that PCI DSS forbids retaining after authorisation. Uber could record its requests to a processor; an issuer processor or acquirer switch cannot simply write raw authorisation messages to a replay store. The essay cites PCI DSS v4.0 for change control and does not notice that its own central technique collides with the same standard's storage rules. A reviewer on your security team will spot this immediately.
- External responses. Replaying a recorded response tests that your new code would have sent the same request. It says nothing about how the counterparty behaves on a new route, endpoint or format, which is usually the risk.
- Mismatch triage. Someone has to look at the mismatches. That means developers reading production payment data, or a masked diff tool that does not exist yet.

### 2.6 Flag evaluation inside a transaction and across a flow

> "a feature flag: a setting that chooses between the old behaviour and the new without another deployment"

Nothing in the essay says when the flag is read. In a payment flow this is the whole design *[judgement]*:

- The decision must be made once, at ingress, and carried in the message context. If the gateway, the authorisation service, the ledger and the clearing extract each read the flag independently, a flip in mid-flow produces a transaction that was authorised under one behaviour and posted under another.
- The decision must be persisted on the transaction, because the lifecycle outlives the flag state. A reversal, completion, refund, clearing record or chargeback arriving days later must follow the path the original took, not the path the flag selects today. "Turn it off again in seconds" is true of new transactions only.
- Flag state must be consistent across both data centres, or be explicitly per-site. Two sites disagreeing about a flag during a propagation delay or a partition is a split-brain in business logic.
- The flag store becomes a dependency of the authorisation path. It needs local evaluation, a defined behaviour when the store is unreachable, and an availability target at least as high as authorisation.

### 2.7 In-flight messages, exactly-once and ordering across mixed versions

The essay's only treatment is Amazon's two-phase "read the new format, then write it" in section 6. That is correct and it is the single most transferable technique in the essay, but it is presented as a footnote to rollback. In a rolling deploy or a canary, old and new versions consume the same queues at the same time. Request and reply may be handled by different versions. Per-account ordering guarantees, duplicate detection windows and idempotency keys must mean the same thing in both versions. Long-running units of work (a batch step, a saga that spans authorisation and posting, a two-phase commit with the ledger) will straddle the deploy. Connection draining for long-lived scheme sessions is its own problem; the notes have a Salesforce example of connections that "stayed with their original pods until natural termination" *[notes]* and the essay does not use it. None of this is mentioned.

### 2.8 Stateful services and schema changes

> "remember what an image rollback does not undo: data the new version wrote, a schema it migrated, a message format it started emitting."

One sentence. For a ledger or a card-management database, schema change is the main event. The notes contain Fowler's expand, migrate, contract pattern and Google's warning that a rollback after a schema change "leaves you with a binary that doesn't expect the new schema, and hasn't been tested with it" *[notes]*; neither reaches the essay. Missing: every schema change must be compatible with version N and N-1 at once; a flag does not guard a column; on DB2 or a mainframe the change may need a bind, a reorg or a copybook change that ripples through every program sharing the record layout; the "contract" step is the irreversible one and it is the step that needs the rehearsal.

### 2.9 Per-client ramping when clients share everything

> "For a payments firm the natural unit of exposure is a client, not a random slice of requests."

Right instinct, unexamined. In a multi-tenant processor clients share queues, thread pools, the batch schedule, HSMs, scheme connections and often the settlement and clearing files *[judgement]*. A flag for client A that changes the content of a shared clearing file, or the duration of a shared batch step, or the load on a shared connection, has exposed every client. The essay needs to distinguish behaviour that is isolated per client (pricing, a product rule, routing for that client's BINs) from behaviour that is shared-fate, and say that shared-fate changes cannot be ramped by client at all. It also needs to acknowledge the other deployment model: clients on dedicated stacks, where the "ramp" is a sequence of deployments, each of which is that client's big bang, on that client's change calendar.

The citation is also wrong for the purpose. "Stripe pins each account to an API version" describes compatibility of the API surface; the code behind it is the same for everyone. It is not a mechanism for ramping an implementation change by client, and the essay uses it that way twice.

### 2.10 "Then for staff"

> "You turn the behaviour on for nobody, then for staff, then for a few clients, then for everyone"

A processor whose clients are banks has no staff population. Nobody at the firm holds a card on a client's BIN or sends a payment through a client's institution ID. The equivalent rung is a synthetic institution in production with test BINs, test merchants and real connectivity, carrying small real-value transactions end to end through clearing and settlement *[judgement]*. Starling's production simulator generating "160,000 card authorisations a day" is in the notes *[notes]* and is the closest published analogue; the essay omits it. Without that rung, the ladder in figure 2 has a hole exactly where the first real exposure should be.

### 2.11 Canary statistics at low volume and high value

> "Little on low volumes. A 1% ramp tells you little about a flow of a few large payments a day. Nothing published says how to ramp one; shadow comparison is the closest substitute."

Honest, but buried in a list of gaps on the last page, and it understates the problem. Netflix-style canary analysis compares error rates and latency. Our failures do not raise error rates: an approval that should have been a decline, a wrong amount, a duplicate posting, a wrong fee, a transaction in the wrong settlement file. Every one returns success. The canary metric for payments is a correctness metric (response-code distribution against a control cohort, reversal and timeout rates, stand-in rates, reconciliation breaks, suspense-account balances, ledger invariants), and for high-value flows a single wrong payment is the incident, so percentages are the wrong tool and amount caps or named-payment pilots are the right one *[judgement]*. The notes record that no source describes amount-capped canaries *[notes]*; the essay should say that this is practice the firm will have to design itself.

### 2.12 Mainframe and vendor components

> "No incumbent's account. Monzo, Starling and Nubank were built new. No firm with a mainframe core has published how it took a release train off its money-moving systems."

Again honest and again in the gap list. For the reader this is not a gap in the literature; it may be half the estate. A vendor switch, card-management package or payment hub ships on the vendor's schedule as a certified release, cannot be flagged by you, and may not support two versions side by side. A mainframe deploy is load modules, binds and region recycles, not images and hashes; "redeploy the kept image by its hash" has no direct meaning there. The essay should also notice something in the reader's favour *[judgement]*: core-banking and switch estates have been parameter-driven for decades. Institution-level parameters, product tables and BIN-level configuration are per-client feature flags that already exist, already have maker-checker controls, and are already trusted by operations. That is a far better opening than Facebook Chat, and its risks (a table load that goes everywhere at once) are exactly the CrowdStrike lesson.

### 2.13 What rollback means when messages have left the building

> "Rolling back to the previous image and switching a flag off are pre-approved actions. Whoever is on call may take them without asking."

Figure 9's caption does say that none of the rollbacks undo "data written, schemas migrated, messages sent or money moved". The policy sentence ignores its own caption. In this estate *[judgement]*:

- A rollback in the middle of a batch window or within minutes of a scheme cut-off can be worse than the fault. Pre-approval has to be conditional on time of day and on batch state.
- After a rollback the old version must process the lifecycle events of transactions the new version created. That is a compatibility requirement that has to be tested before the deploy, not discovered at 03:00.
- For anything that has left (an authorisation response, a clearing file, a payment instruction), the way back is a business process: reversals, adjustments, recalls, scheme dispute procedures, client communication. The essay offers "a mistake is corrected by a new entry" for the internal ledger and nothing for the external leg.
- The essay's own RBS and Stripe examples are both failures caused by the rollback. It uses them to argue for rehearsal, which is fair, but the natural reading for a payments engineer is that roll-back-first is not a safe default here and that the on-call needs a decision rule, not a blanket permission.

"Wealthfront ... reported in 2010 that a rollback took about five seconds across its cluster" will make people laugh. A stateless web tier in 2010 is not evidence about a switch with open scheme sessions.

### 2.14 Knight Capital

> "This essay's reading adds one: a ramp of the *behaviour*, on limited order flow, would have exercised the path while the damage was still small."

I would cut or rewrite this. As I recall the SEC order, the defective legacy function sent child orders without tracking fills against the parent order, and a couple of hundred parent orders produced the four million executions; that should be checked against the order before the essay relies on it. If that recollection is right, a small share of order flow reaching the eighth server would still have produced unbounded child orders until a human stopped it. Limited exposure does not bound damage when the fault amplifies. More generally, senior engineers read Knight as the case where a feature flag destroyed a firm: a flag whose meaning differed between code versions on a fleet with version skew. The essay uses it as an argument for more flags without first addressing why flags plus skew are dangerous. It should state the rule Knight actually teaches: a flag's meaning must be identical on every version that can be running, flag names are never reused, and deploy completeness is verified by machine before any activation.

### 2.15 Reconciliation as the signal

> "a change that affects settlement should hold at small exposure for at least one reconciliation cycle"

Good, and correctly marked as the essay's own inference. But "one cycle" is too short for most changes *[judgement]*. An authorisation change is not proven until its transactions have cleared, settled, reconciled and appeared on a statement; a fee or interest change is not proven until a month-end; a dispute-path change is not proven for months. The essay should give the ladder of signal latencies (seconds for response codes, a day for clearing, one to three days for settlement and reconciliation, a month for period-end, a quarter for disputes) and say that the ramp stage length is set by the slowest signal the change can affect.

### 2.16 Observability

> "names the metric that will show the change is working"

This assumes the metric can be had. Most estates of this kind have infrastructure monitoring and operations dashboards by scheme and by channel. Few have correctness metrics sliced by client, by code version and by flag cohort, in near real time *[judgement]*. Without that slice there is nothing to compare the exposed subset against, and the loop in figure 4 ("compare with the rest") cannot run. This is the first prerequisite and the essay does not list it.

### 2.17 Scheme certification and shared formats

> "A message format shared with every counterparty cannot be ramped ... These remain release trains. Ship your side early and dark, and switch it on when the date arrives."

Mostly right. Two corrections. Schemes do ramp formats, through coexistence periods with translation; the ISO 20022 migrations are the obvious case and the notes mention the coexistence date *[notes]*. And "switch it on when the date arrives" is activation everywhere at once of a path that has never carried live traffic, which is the exact pattern section 9 condemns under "Deployed gradually, activated all at once". The essay needs to reconcile the two: for a mandate date, the dark period has to include certification against the scheme's test facility and, where the scheme allows early activation, a pilot on a subset of BINs or participants.

### 2.18 On-call and production access

> "Move the pager to the team that wrote the code."

In a PCI-scoped, segregated estate the developer who is paged typically has no production access, cannot see cardholder data, and sits behind a 24-hour operations bridge that owns scheme and client communication *[judgement]*. Figure 12 lists "separation of production" as something the rules ask for, and section 7 never reconciles that with "You build it, you run it". The workable design is narrow, audited, pre-approved actions (flag off, traffic shift, image rollback) exposed through tooling to an on-call developer who still cannot log in to a box. Say that. Also say who is on call for a batch failure at 02:00 when the author is a developer in another time zone and the operator is the one with the run-book.

### 2.19 Configuration

> "Configuration, flags, reference data and operator scripts are all changes. Ramp them too."

Correct and important, and the essay deserves credit for it. It should be concrete: BIN tables, routing tables, fee and interchange tables, scheme parameter updates, key rotations and certificate renewals are our "content files". Many of them today bypass the release train entirely and go to every node at once.

### 2.20 Smaller points

- "While release 1 sits in pre-production for three days, everything your engineers finish goes into release 2. So release 2 is three days of changes". With two releases a week and a three-day promotion, trains overlap and the batch is set by the cadence, not by the soak. The arithmetic should be made to match the reader's actual schedule.
- "Each stage waits at least an hour ... on real customer traffic." Amazon's stages are safe because Regions and cells are isolated. An active-active pair of data centres is not a cell architecture; half the estate is not a small blast radius.
- "Idempotent operations ... bound the damage of a retry." True within one version. Across mixed versions, the idempotency key derivation and the duplicate-detection window must be unchanged, or the retry is a duplicate.
- "The tooling is a large job, but it is documented." The tooling for stateless services on containers is documented. The tooling for this estate is not, as the essay's own gap list admits.

## 3. What it gets right, and which examples transfer

What it gets right technically:

- The exposure ladder, and the distinction between dormant and shadow. "Dormant is not the same as tested" is the best sentence in the essay.
- Stable, client-keyed cohorts instead of random percentages, with Square's own regret as evidence.
- Record-and-replay for flows with external side effects.
- Agreement counts in place of elapsed days, with offline comparison for rarely-read data.
- Reconciliation as a continuous production test, and stage length tied to its cycle.
- Build once, deploy by hash; the three meanings of rollback; rehearsing rollback.
- Two-phase format changes.
- Treating configuration and reference data as changes that need a ramp.
- "Keep what was kept", and the refusal to claim that regulators have endorsed any of this.
- The half-measure failures in section 9 as a checklist.

Example by example:

| Example | Transfers? | Why |
| --- | --- | --- |
| Facebook Chat dark launch | Partly | It was a load test of a new, read-mostly backend with simulated messages. It shows how to prove capacity dark. It says nothing about correctness or side effects. |
| Netflix canaries and Kayenta | To the stateless online tier only | Needs high volume, tolerates individual errors, and judges on error rate and latency. Usable for card-authorisation front ends at volume if the metrics are correctness metrics. Not usable for batch, ledgers or high-value flows. The "endurance, not correctness" quote is a fair hit on any soak. |
| Amazon pipeline | Best structural model | Production bake time with alarms and a request-count condition is the honest replacement for a soak, and Amazon kept pre-production stages. Depends on cell and Region isolation that this estate lacks. The 14-of-16-days figure is rhetoric until the reader's own three days are measured. |
| GitHub Scientist | For pure functions only | Fee, interest and FX calculation, routing decisions, risk scoring, message parsing and mapping between ISO 8583 and ISO 20022. Not for anything that writes, calls an HSM or sends. The essay should name these targets. |
| Square payments migration | Good | Real payment traffic, comparison of responses, a client-version-pair regression hidden by random percentages, six weeks of dual running before retiring writes. The most useful single case in the essay and under-used. |
| Uber payment shadowing | Good, with limits | The right technique for external calls. Uber is a merchant calling a processor; it does not hold PIN blocks or run HSMs, and its recorded requests are not sensitive authentication data. |
| Uber ledger migration | Good for a store migration | Immutable historical records at a thousand a second. A model for moving a ledger between stores, with offline comparison. Not a model for a behaviour change, and not for low volumes. |
| Stripe API versioning | Does not support the claim made | Interface compatibility, not implementation ramping. |
| Stripe ledger verification, idempotency | Good | Direct analogues for reconciliation as a signal and for safe retries. |
| Stripe July 2019 outage | Cuts both ways | Shows time does not find a rare trigger. Also shows a phased rollout did not find it, an unflaggable component caused it, and the rollback caused the second outage. |
| Monzo, Starling | Good for the distributed tier | They are scheme-connected and regulated, which matters. They are also greenfield, single-institution, cloud-native and have no client banks on their release calendar. The essay says the first three; it omits the fourth. |
| Adyen risk experiments | Good | A month-long hold because chargebacks arrive late is exactly the slow-signal argument. |
| OANDA | Good culturally, weaker technically | Money-moving, and the "do not answer a failure with a gate" story is strong. The bank comparison is about releases bundling thousands of changes, not a twice-weekly train. |
| Financial Times | Does not transfer | A content site going from twelve releases a year to thousands. |
| FCA 2021 review | Strongest evidence, wrong distance | Regulated firms and a regulator's data. But the contrast is with long cycles, and the reader is already at twice a week. The essay's own caveat about the DevOps sub-sample is to its credit. |
| Basel II parallel run | Good hook | Bankers know parallel running. Core conversions and mock conversion weekends are an even closer hook *[judgement]*. |
| Atlassian 2022 | Weak | A script given the wrong identifiers. It argues for production-like data and for ramping operator scripts, not against a soak. |
| Wealthfront five-second rollback | Does not transfer | Stateless web tier, 2010. |
| Knight Capital | Transfers, but against the essay as written | Version skew plus a reused flag. See 2.14. |
| Google Cloud 2025 | Good | Dormant code first exercised globally by a data change. Maps to a table load activating a dormant path. |
| CrowdStrike, Cloudflare | Good | Maps directly to BIN, routing and fee table loads and scheme parameter updates. |
| RBS 2012 | Most relevant, least examined | A mainframe batch-scheduler upgrade and its back-out. It supports rehearsing the way back. It also shows a change that cannot be flagged, shadowed or ramped by client, which the essay does not acknowledge. |
| TSB 2018 | Honest inclusion | The essay concedes it argues for better pre-production testing of the two-site configuration. That concession deserves to be in section 5, not only section 9. |
| Roblox | Fine | Supports holding a stage through a daily peak and a batch run. |
| DBS pause | Fine | Correct warning about supervisory reaction. |

## 4. The mechanism in section 5

Is it right? Yes, as a queueing argument. A hold applied to the deployable unit forces everything in that unit to wait and to batch; a hold applied to one behaviour does not. The Google SRE quote states the constraint correctly, and the Square and Adyen examples show long holds on single behaviours. It is the essay's one original piece of reasoning and it is worth keeping.

Is it the whole story? No. It leaves out the following *[judgement throughout]*:

- The unflaggable part of every build. Dependencies, runtime, drivers, base images, refactors, migrations. The binary still needs a bake, and that bake has to cross a daily peak and a batch window. See 2.3.
- Time-dependent whole-binary defects. Leaks and pool exhaustion are caused by the binary, not by one behaviour. The essay moves the behaviour's wait and silently deletes the binary's.
- Flag combinatorics. With N live flags, production is in one of up to 2^N states, and with per-client flags each client may be running a different system. The pre-production regression pack tested one state. Scheme certification certified one state. Support has to reproduce a client's problem in that client's state.
- The test matrix. Every change made while a flag is live must be tested with the flag on and off. That doubles the regression scope per live flag in the affected area, unless flags are short-lived and few. The essay mentions flag debt only as a clean-up problem.
- Off-path rot. The old path is the rollback target. If nothing exercises it once the ramp reaches 100%, turning the flag off a month later is an untested change. This is the essay's own "dormant is not tested" point applied to the off branch, and it does not make the connection.
- Mixed-version and mixed-flag state. Records written under flag-on must be readable and processable under flag-off, and by version N-1. Otherwise the flag is not a way back.
- Flags in shared libraries and across services. A behaviour that spans gateway, authorisation, ledger and extract needs one decision, not four flags flipped in the right order. See 2.6.
- The kill switch's own path. The flag system, its store, its distribution and its access control must not depend on the thing being switched off, must work when a data centre is isolated, and must itself be ramped. The synthesis report has a 2025 Cloudflare case where a kill switch pushed through a fleet-wide config system caused an outage *[notes]*; the essay does not use it.
- Attribution under slow signals. The batch reappears at the slowest signal. If reconciliation is daily and month-end is monthly, then every flag ramping during that interval is, for that signal, one batch. Fifteen concurrent ramps and one reconciliation break gives the same search problem the essay attributes to the release train. The answer is a limit on concurrent ramps per settlement-affecting domain, and nobody has said so.
- Shared fate. A flag only isolates what the exposure unit isolates. See 2.9.
- Review and approval of the flip. If turning a flag from 1% to 100% is not a controlled change, the control has been removed, not moved. The essay notes that "nobody has told you how a flag change is classified" and leaves it there.

## 5. What a sceptical senior engineer would need to see

One change, walked through both processes, with what is observed at each step and what can go wrong. I would choose an authorisation routing change, because it is common, touches an external rail, and has a full lifecycle.

The change: for dual-network debit cards in a set of BIN ranges, route authorisations under a threshold amount to network B instead of network A.

### Current process

| Step | What happens | What is observed | What it cannot see |
| --- | --- | --- | --- |
| Merge and build | Change joins the train with everything else merged that half-week | Unit tests | Interaction with the other changes |
| Integration | Regression pack against network A and B simulators | Message formats, response handling, reversal and timeout cases as scripted | Real issuer behaviour on network B; real BIN-table edge cases |
| Client or partner test | Test window with network B and any client that asked for one | Certification cases pass | Production card population |
| Pre-production | Performance run, end-of-day cycle, clearing file generation, soak | Throughput, batch completes, files well-formed, no resource creep over the window | Approval-rate effect, real fees, real settlement positions |
| Approval | Change board | Evidence pack | Nothing new |
| Release | All clients, all BIN ranges in scope, at once | Operations watch response codes and scheme dashboards | Which change caused any movement; the answer arrives with the next day's reconciliation |
| Back-out | Redeploy previous release | Service recovers | Transactions already routed to B still need their reversals, clearing and disputes handled on B |

### Proposed process

| Step | What happens | What is observed | What can go wrong |
| --- | --- | --- | --- |
| 0. Design | Routing decision is evaluated once at ingress, stamped on the transaction and persisted. All lifecycle events route by the stored decision, not the live flag. Both paths are compatible with version N-1. | Design review | If this is skipped, a flag flip strands reversals and completions on the wrong network |
| 1. Deploy dormant | Build goes to one node at one site, then the rest. Flag off everywhere. Binary bakes through a daily peak and one batch window. | Start-up, scheme sign-on, pool levels, heap, MQ depth, response-code mix against the previous day and against untouched nodes | An unflagged dependency change leaks slowly; a short canary would miss it |
| 2. Shadow the decision | New rule computes its routing decision alongside the old one for all traffic; only the decision and non-sensitive fields are logged. Nothing is sent to B. | Share of traffic that would move; mismatches against expectation by BIN and amount; added latency against the timeout budget | Shadow shows what would be sent. It shows nothing about how B responds |
| 3. Synthetic institution | Test cards on a test BIN at a synthetic client transact for small real amounts via B, through authorisation, reversal, clearing, settlement and reconciliation | Full lifecycle on the real rail; settlement position and fees as actually charged by B | Synthetic cards do not represent the issuer mix |
| 4. First client | One consenting client, one BIN range, amount cap, limited hours. Hold until those transactions have cleared, settled and reconciled. | Approval rate and response-code distribution against that client's control BINs; timeout, late-response and stand-in rates; reversal rate; reconciliation breaks; the client's own reconciliation | Client's settlement file now mixes networks; their back office may not expect it. Flag state differs between sites during propagation |
| 5. Widen | More BIN ranges, then more clients, each stage at least one settlement cycle; one stage spans a month-end | Same metrics, plus network B capacity and interchange outcome | Concurrent ramps in the same domain make a reconciliation break unattributable |
| 6. Way back | Flag off: new authorisations return to A. Stored decisions keep existing transactions on B for their lifecycle. Rehearsed at step 3 and step 4, not first used in anger. | Reversals and clearing for B-routed transactions still complete | Off path has rotted; on-call flips the flag in a cut-off window; binary rollback to N-1 cannot process B-stamped records |
| 7. Finish | Flag removed, old route deleted or retained deliberately as a tested fallback | Regression pack back to one state | Flag left in place and reused |

A senior engineer reading that table can argue with every row, which is the point. The essay as written gives them nothing to argue with except citations.

Two other changes deserve a shorter treatment, because they show where the ramp does not fit:

- A ledger schema change. No flag guards a column. The work is expand, dual-write, backfill, compare stored records offline, switch reads behind a flag, hold through a month-end, then contract. The contract step is irreversible and needs a rehearsal on a production-sized copy. That rehearsal is a pre-production hold and it stays.
- A new settlement file format. The file is one-shot with external effect at a cut-off. It cannot go to 1% of a counterparty. The approach is to generate old and new in parallel for several cycles including a period end, diff them, have the recipient validate the new file in their test facility, then cut over per recipient on an agreed date with the old generator kept runnable. The notes reach the same conclusion: "the evidence supports keeping a deliberate hold: a shadow cycle or a rehearsal before first live use" *[notes]*. The essay relegates it to the final bullet of its gap list.

## 6. Prerequisites, in the order they would have to be built

All *[judgement]*.

1. An inventory of the three days: what each activity is, what defect class it targets, which changes need it. Then a segmentation of the estate into what can be ramped (stateless online services you own), what can be shadowed (pure calculations, generated files), and what can be neither (vendor packages, mainframe infrastructure, schema contraction, scheme mandate dates).
2. Correctness observability sliced by client, code version and flag cohort: response-code distributions, reversal, timeout and stand-in rates, ledger invariants, suspense balances, and reconciliation run as often as the data allows. Without this there is nothing for a ramp to be judged on.
3. Build once, immutable artefacts, automated deployment for code, configuration and reference data, with connection draining and scheme session handling in the rolling deploy.
4. An N and N-1 compatibility discipline for messages, schemas, files and idempotency keys, enforced by mixed-version tests in the pipeline. Expand and contract as the only permitted form of schema change.
5. Transaction-pinned decisions: evaluate once, propagate in context, persist on the record, route lifecycle events by the stored value.
6. A flag platform that is fit for the authorisation path: local evaluation, defined failure default, consistent across sites, maker-checker on changes, full audit trail, its own staged rollout, expiry dates and a cap on live flags per domain.
7. An isolation unit: a synthetic institution in production with test BINs and merchants; client-level routing; and a clear list of shared-fate components where client ramping is not possible.
8. A shadow harness: side-effect stubbing, record-and-replay that does not retain sensitive authentication data, field-aware comparison, masked mismatch tooling.
9. Rehearsed ways back: flag off, traffic shift, artefact rollback, each with a rule for when not to use it (batch windows, cut-offs), plus compensation tooling and procedures for what has already left.
10. A control framework agreed with risk, audit and clients: standard change types for dormant deploy, shadow run, flag step and rollback; classification of flag changes; contract terms and notice for clients in early cohorts.
11. The operating model: who is paged, what they can do without production access, how the operations bridge and the development on-call divide responsibility.

The essay's section 10 starts at item 3 and treats items 1 and 2 as a measurement exercise. Items 4, 5, 7 and 8 do not appear.

## 7. The five additions or corrections that would most increase credibility

In priority order.

1. Describe the reader's three days truthfully and say what stays. Replace the one-line definition of soak with an inventory of what promotion contains and which defect class each activity targets. State plainly that a production bake of the binary through a peak and a batch window remains, and that schema contraction, one-shot files, vendor and mainframe releases and scheme mandates keep a pre-production rehearsal. Fix "the binary contains nothing new that is switched on" and "it costs no client anything". An essay that concedes the residue precisely will be believed about the rest.
2. Add one worked example in the estate's own vocabulary, of the kind in section 5 of this review, through both processes, with observations and failure modes per step. This single addition would do more than every other change combined to stop it reading as filler.
3. Add a section on state and lifecycle: flag decided once and pinned to the transaction; in-flight messages and mixed versions on shared queues; N and N-1 compatibility and expand and contract; what flag-off and rollback mean for transactions already created; what the way back is once a message or file has left. Make the rollback pre-approval conditional.
4. State the limits of the section 5 mechanism: unflaggable changes, flag combinatorics and the test and certification matrix, off-path rot, shared-fate components that defeat per-client ramping, the kill switch's own dependencies, and the reappearance of the batch at the slowest signal. Rewrite the Knight paragraph so it teaches the version-skew and flag-reuse lesson and drops the claim that limited order flow would have kept the damage small unless the SEC order supports it.
5. Fit the ladder and the evidence to a multi-tenant processor. Replace "staff" with a synthetic institution in production. Replace error-rate canaries with correctness metrics and amount caps, and move the low-volume and period-end material out of the gap list into the body. Address the PCI storage constraint on record-and-replay and the access model for on-call. And say honestly that the FCA, OANDA and Financial Times evidence compares continuous delivery with releases far larger and rarer than a twice-weekly train, so the size of the gain for this reader is not known.
