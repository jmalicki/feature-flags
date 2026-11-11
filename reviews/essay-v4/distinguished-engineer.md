# Distinguished engineer's review of "Deploy every day, release when it is proven"

Reviewer's vantage point: a distinguished engineer who has led release engineering and production operations on a large bank's payments platform (ISO 20022 messaging, instant and batch rails, ledgers, end-of-day, reconciliation, active-active sites, vendor packages, mainframe adjacency) and at a hyperscale internet company that practises progressive delivery. This is a persona review of `essay.md` as it stands on `main`. The essay was not edited.

Tagging convention: `[judgement]` marks my professional judgement, which nothing in the repository supports or contradicts. `[repo]` marks something I checked against the research notes or the synthesis report. All statements about how instant and batch rails behave, and every target number, are `[judgement]` even where I have not repeated the tag on each line of a list or table that is tagged at its head.

## Verdict

The document is a well-argued literature review with one good paragraph of engineering in it. It does not yet read as the work of someone who has run this transition. The argument is correct, the citations are careful, and the caveats are honest. What is missing is everything a practitioner knows that is not in a blog post: the prerequisites, the order, the numbers, the failure modes of the programme itself, and the mechanics of the rails in the worked example. A payments engineer will accept findings 1 to 4, will stop trusting the author at the phrase "returns and reconciliation handled on B", and will read the rest as advocacy.

The fastest route to authority is to cut about a third of the borrowed anecdote and replace it with the author's own prerequisites, thresholds and stop conditions.

## 1. Does it read as written by an expert practitioner?

Partly. It reads as written by a rigorous analyst who has read the practitioners. The voice gives it away: "The rule texts I have read", "None of the accounts I read", "I have found no bank". An expert consultant's sentences begin "In my experience", "The usual failure is" and "I would not start until".

### The five strongest tells that it does

1. The transaction-pinned decision. "The choice of rail is made once, when the payment is accepted, and is stored on the payment, so that every later event in that payment's life follows the stored choice and not the current position of the flag." This is the single sentence in the document that only someone who has thought about payment lifecycles writes. It should be promoted from an aside in an example to a stated design rule.
2. The unflaggable residue. "A library upgrade, a new database driver, or a change to the runtime or a schema is a property of the binary as a whole, and these are the changes that produce slow leaks and exhausted connection pools." Advocates of flags usually skip this. Conceding it is what makes recommendation 2 defensible.
3. Off-path rot. "The old path, which is the fallback, ceases to be exercised on the day the flag reaches every client, so that switching it off thereafter is an untested change." Correct, non-obvious, and learned the hard way by everyone who has done this.
4. Rollback to the artefact, with exceptions. "What is restored should be the previous build exactly as it ran, retained under its hash, and never a fresh build from older source", together with "written rules for the occasions on which rollback is the wrong response, such as within a cut-off window". The second half is the practitioner's instinct; most writers stop at "roll back first".
5. What the soak is for. "sessions that fail only after hours of idleness, memory and file handles that creep, queues that deepen, the roll of the business date, and end-of-day jobs running on new code while online traffic continues". This is a boundary-crossing account of soak, not an hours-accumulated one, and baseline question 1 ("for how many hours is something being done to the release, and for how many is it waiting for a window or a person?") is exactly the first question I ask a client.

### The ten strongest tells that it does not

1. The author has not looked at the client. "This assessment rests on the release model as described and on the published record of firms that have replaced it. It has not drawn on the business's own change and incident data". An assessment that has examined no pipeline, no incident record and no environment is a position paper. Either rename it or do one week of fieldwork and report what the three days contain.
2. "The tooling for all of this is well understood." It is well understood for stateless services on containers. For a batch estate with mainframe adjacency and vendor packages it is not, and the document's own finding 6 says so ("I found no account from a firm with a mainframe core"). A practitioner would never write the first sentence having written the second.
3. No prerequisites at all. The words observability, idempotent, compatibility, configuration, reference data and in-flight do not appear. The document recommends ramping by client without asking whether the business can see a metric by client, and recommends daily deployment without saying that old and new versions will then share queues and tables permanently.
4. Batch on a slice. "a daily build that bakes on a small slice of production through one daily peak and one batch window". End-of-day is a singleton that runs once over the whole book. It does not run on a slice of nodes. Anyone who has operated a batch scheduler stops reading here.
5. Rail B is described as rail A but faster. "send payments over B through acceptance, settlement, returns and reconciliation" and "each stage held for at least one settlement cycle". An instant payment is final in seconds; there is no return as of right, only a recall request the beneficiary bank may refuse; and the settlement cycle on an instant rail is seconds or a few hours, so "one settlement cycle" is not a hold at all.
6. Shadow oversold as a replacement for soak. "This supplies most of what the soak was expected to reveal". A shadow of a routing decision reveals nothing about leaks, sessions, date roll or end-of-day, which is what the document itself says the soak is for two pages earlier.
7. The wrong control named as decisive. "Where money is involved, the shadow run is the decisive control, since a flag can reverse a decision and cannot reverse a payment." The premise argues against the conclusion. When the payment is irrevocable the decisive control is the cap on exposure at each stage; the shadow run only reduces the chance of needing it.
8. Knight misapplied. "A firm in which a developer can enable money-moving behaviour for a client with no record and no second person has recreated the conditions at Knight." Knight's conditions were a manual deployment that left one of eight servers on old code, a repurposed flag, dead code left callable, and no second technician reviewing the deployment `[repo]`. Nobody at Knight flipped a flag without approval.
9. No numbers of its own. Every figure in the document belongs to someone else. "a ramp plan with stop conditions" never states a stop condition; "perhaps by several weeks" is the only estimate of the new lead time; there is no target for deploy frequency, change-failure rate, time to restore, flag count or flag age. Experts commit to ranges.
10. A pilot designed not to find anything, and a pager with no access model. "a single service that it owns outright, with no vendor package or mainframe component in its path" describes the service least like the estate. "The team that writes a service should deploy it and be paged for it" says nothing about segregation of duties, production access or the operations bridge, which is the first objection every bank raises.

## 2. Expert content that is missing

Each item below is written as the text I would put in the report. All of it is `[judgement]` unless marked `[repo]`.

### What the three days contain, and which parts are irreducible

Before anything else, write down what the three days are. In an estate of this kind they usually decompose as follows. Day one is deployment to the integration environment and the automated regression pack against the scheme simulators: four to eight hours of machine time, most of it parallelisable. Day two is a performance run of two to four hours, preceded by an environment reset and a data refresh that often take longer than the test, followed by an overnight batch cycle with a business-date roll. Day three is evidence assembly, change approval and the wait for a release window, which is normally an evening slot chosen to avoid scheme cut-offs. In the estates I have measured, between eight and fourteen of the seventy-two hours are work. The rest is queueing for an environment, a person or a window.

Four things in the three days are irreducible, and the recommendations must preserve each of them somewhere:

- One real end-of-day with a date roll on the new code. It can be moved into production as a bake, but it cannot be shortened below one cycle.
- One peak. Capacity regressions do not show at 03:00.
- Partner and scheme test windows. They run on the counterparty's calendar and no internal change shortens them.
- A second person's judgement on anything that moves money. It can become a review of a ramp plan in place of a board meeting, but it cannot disappear.

Everything else in the three days is compressible, and most of it is waiting.

### The prerequisites that decide whether any of this is possible

I would not enable a single flag on a money path until seven things are true.

- Observability sliced by client and by version. If the business cannot produce, within five minutes, acceptance rate, rejection rate by reason code, timeout rate, time to confirmation and queue depth for one client on one build, there is nothing to judge a ramp against. Most estates of this kind have infrastructure monitoring and a daily operations report. Neither is enough, and building the slice is typically three to six months of work.
- N and N-1 compatibility as a standing discipline. Daily deployment with a one-day bake means production runs two versions every day of the year, on the same queues and the same tables. Every message, record, file and cache entry written by build N must be processable by build N-1, and the pipeline must prove it with a mixed-version test on every build. Without this, rollback is a hope.
- Expand and contract as the only permitted form of schema change. Add, dual-write, backfill, verify, switch reads, and only then remove. The expand steps ship daily. The contract step is irreversible and stays on a dated release with a rehearsal.
- Idempotency end to end. Every payment instruction carries a key that survives retries, redelivery, failover between sites and replay, and the key's derivation and the duplicate-detection window are identical in N and N-1. A ramp multiplies redelivery; without idempotency it multiplies payments.
- Evaluate once, pin to the transaction. A flag that governs a payment is read once, at acceptance, and the result is written to the payment record and carried in the message context. No downstream service reads the flag again. Returns, recalls, status enquiries and postings follow the stored value for the life of the payment, which may be months.
- A flag service fit for the hot path. Evaluation is local and in memory, with no network call per payment. The failure default is defined per flag and is always the old behaviour. State is consistent across both sites or explicitly per site. Changes propagate everywhere within sixty seconds and are audited, dual-controlled and themselves staged. The flag service must not depend on anything it may be asked to switch off.
- A synthetic tenant in production. A fully onboarded client that belongs to the business, with real accounts here and at three or four other institutions, real connectivity to every rail, and its own ledger entries, limits and reconciliation. It is the first cohort of every ramp and it runs a continuous trickle of payments so that the baseline is never empty. Its postings must be excluded from regulatory and financial reporting by design, which takes longer to agree with finance than to build.

### The order in which capabilities must be built

The order is not negotiable, because each step is the evidence base for the next.

1. Inventory the three days and baseline the four delivery metrics.
2. Build per-client, per-version observability and run reconciliation as often as the data allows.
3. Build once, promote the same artefact, automate deployment and rollback, and rehearse rollback monthly.
4. Enforce N and N-1 compatibility and expand and contract in the pipeline.
5. Make acceptance idempotent and pin decisions to the transaction.
6. Stand up the flag service and agree the change policy for flag steps as a pre-approved standard change.
7. Create the synthetic tenant.
8. Build the shadow harness and the mismatch triage tooling.
9. Run the first ramp on a real money path at low value.
10. Move on-call to the authoring team, once the tooling exists.
11. Retire the train service by service, on evidence.

The document starts at step 6 and treats steps 2, 4, 5 and 7 as implied.

### Where firms typically fail

- Flag sprawl by month six. The first flags are added with care. By the sixth month there are two hundred, a third have no owner who is still on the team, and nobody will delete one because nobody remembers what the off path does. The remedy is mechanical: a flag cannot be created without an expiry date, the build fails when a flag passes its date, and there is a hard cap on live release flags per service.
- Shadow comparisons nobody reads. The harness is built, mismatches accumulate in a table, and the stage is passed on elapsed time. That is the Netflix endurance failure `[repo]` in a new place. Every mismatch must be classified by a named person within a business day, and the exit criterion is zero unexplained mismatches over a stated volume.
- The pilot that never touches a money path. The business chooses an internal reporting service because it is safe, declares success after two quarters, and has learned nothing about pinned decisions, irrevocable sends or reconciliation. The first pilot must move real money, at low value, with a real lifecycle.
- On-call imposed without tooling. Developers are given a pager, no production access, no dashboards by client, and a runbook written by operations for operations. Attrition follows within two quarters. Netflix's own caveat about tooling and burnout `[repo]` is the polite version of this.
- A change board that approves ramps as if they were releases. Each flag step is raised as a normal change with a three-day lead time, and the ramp takes longer than the train did. The policy must classify a flag step inside an approved ramp plan as a standard change, approved once with the plan and executed under dual control without returning to the board.
- A partial deployment taken for a complete one. Activation proceeds while one node, one site or one batch server is still on the old build. This is Knight `[repo]`. Fleet version uniformity must be asserted by machine before any flag moves.

### What good looks like numerically

All ranges are my judgement for a business of this kind two years into the programme, for services that have qualified to leave the train. They are not sourced.

| Measure | Typical starting point | Target range [judgement] |
| --- | --- | --- |
| Deploy frequency per service | 2 a week | 1 per business day; more is not a goal |
| Lead time, merge to running dark in production | 5 to 7 days | Median under 24 hours, 90th percentile under 3 days |
| Lead time, merge to full release, money-path change | 5 to 7 days | 2 to 6 weeks, and this is acceptable |
| Deployment failure rate (rollback or hotfix needed) | Unknown; the FCA's all-change figure of 1.6% is the only sector reference `[repo]` | Under 2% |
| Flag steps reversed | Not applicable | 5% to 15%; a rate near zero means stop conditions are too loose |
| Time to detect, online signal | Often the next morning | Under 15 minutes |
| Time to restore by flag | Not applicable | Under 5 minutes from decision; propagation under 60 seconds |
| Time to restore by artefact rollback | Hours | Under 30 minutes, rehearsed at least every 30 days |
| Live release flags per service | 0 | 10 or fewer |
| Flag age | Not applicable | Median under 45 days; removed within 30 days of reaching 100%; none over 180 days without reclassification as a permanent operational control |
| Unexplained shadow mismatches at exit | Not applicable | Zero on any money-affecting field, over at least 7 days including a weekend |
| Mismatch triage time | Not applicable | One business day |
| Reconciliation breaks attributable to a change | Unknown | Zero tolerated; one break halts every ramp in that domain |
| Share of changes still on a dated release | 100% | Under 20% |

Deploy frequency is a diagnostic and must never be a target; once it appears in an objective, teams inflate it with empty deployments `[repo]`.

### Concurrent-ramp limits tied to the slowest signal

A ramp is only attributable for as long as it is the only thing that changed. The slowest signal that a change can affect sets the limit. If the signal is the daily reconciliation of a settlement account, then every ramp step touching that account within the same day is, for that signal, one batch, and the search problem the train created has returned. The rule I use: one ramp in flight per reconciliation domain per reconciliation cycle; no more than two or three money-path ramps across the whole platform at once; no ramp step in the last three business days of a month or the first two of the next; and any change that can affect fees, interest or statements holds one stage across a month-end before it widens.

### Shared-fate components

Per-client ramping only isolates what is partitioned per client. The scheme gateway and its single participant connection, the message broker, the ledger posting engine, the batch scheduler, the liquidity and position manager, the sanctions screening engine and the message-signing service are shared by every client; a change to any of them exposes everyone the moment it is live. For these, choose another axis: one node at one site (never half the estate, because an active-active pair is not a cell architecture); one payment type or amount band; one batch partition; or a parallel instance fed a copy of the traffic and compared. Where no axis exists, say so, and keep the change on a dated release with a rehearsal. The medium-term remedy is architectural: partition the shared component so that a later change can be ramped.

### Batch and period-end validation

Batch needs its own form of canary, because it cannot bake on a slice of nodes. There are three workable forms. First, partition the batch by legal entity, client or book, and run the new code on the smallest partition for a cycle before the rest. Second, run the new code in parallel against the same input snapshot and compare its output files and postings with the batch of record; this is the shadow run for batch, and it is cheap once the snapshot tooling exists. Third, for period-end jobs that run twelve times a year, run them every night in pre-production against a production-sized copy with the business date advanced to the boundary, so that month-end is exercised thirty times before it happens. The repository's own conclusion is that period-boundary batch is the weakest-evidenced area and the best surviving argument for a hold `[repo]`; the report should say that plainly and give these three techniques as the answer.

### What stays on a dated release

Five classes of change stay on a dated, rehearsed, pre-announced release, and the report should list them as a positive design and not as a concession:

- Anything a client or counterparty can see in an interface: message formats, file layouts, API contracts, statement and report content, cut-off times.
- Scheme and rulebook changes, which take effect on the scheme's date. The code ships dark weeks ahead and is certified in the scheme's test environment, but activation is by date, for everyone, and is rehearsed as such.
- Schema contraction and any other irreversible data change.
- Vendor package and mainframe subsystem upgrades, which arrive as certified releases and often cannot run two versions side by side.
- Changes to shared-fate components that have no ramp axis.

In my experience these are 10% to 20% of changes by count and well over half of the risk.

### Three further points the document should make

- Configuration and reference data are changes. Routing tables, reachability directories, limits, cut-off tables, holiday calendars and certificates usually bypass the train and reach every node at once. The Google incident the document cites was triggered by a globally replicated policy change `[repo]`, and the lesson is that data needs a ramp as much as code does.
- Flags are of three kinds and only one is temporary. Release flags are removed after the ramp. Operational controls (kill switches, throttles) are permanent and tested on a schedule. Client entitlements are permanent configuration under maker-checker. Governing all three under one lifecycle guarantees that the rule is ignored.
- The estate already has per-client switches. Core-banking and payment-hub packages have been parameter-driven for decades, with institution-level parameters under maker-checker control. The programme should present flags as an extension of a control that operations and audit already trust.

## 3. Technical errors, loose statements and over-claims

Each item gives the quotation, the problem and the wording I would use. Corrections concerning rail mechanics are `[judgement]`; checks against the notes are marked `[repo]`.

### 3.1 Batch does not bake on a slice

Quoted: "a daily build that bakes on a small slice of production through one daily peak and one batch window before it is promoted further".

Problem: online traffic can be sliced; end-of-day cannot. The sentence also hides that a one-day bake under daily deployment means two versions are in production permanently.

Expert wording: "Each daily build bakes on one node at each site through one daily peak. Batch code is proven separately, by running the new version on the smallest batch partition or in parallel against the batch of record, for one full cycle. Production therefore runs two versions at all times, and compatibility between them is a standing requirement, tested on every build."

### 3.2 Instant payments do not have returns in the batch sense

Quoted: "send payments over B through acceptance, settlement, returns and reconciliation" and "the payments already sent over B still need their returns and reconciliation handled on B".

Problem: on a batch rail a return is a normal, rule-governed event that arrives for days afterwards. On an instant rail the receiving bank accepts or rejects within seconds, the accepted payment is final, and recovery is a recall request that the beneficiary bank may decline. The lifecycle to exercise on B is acceptance, rejection by reason code, timeout with unknown outcome, status enquiry, recall request and its answer, settlement-account posting and reconciliation.

Expert wording: "Payments already sent over B are final. If the release is backed out they are not undone; any that were wrong must be recovered one by one through recall requests, which succeed only with the receiving bank's and often the beneficiary's consent."

### 3.3 "One settlement cycle" is not a hold on an instant rail

Quoted: "Further payment types and clients follow, each stage held for at least one settlement cycle."

Problem: settlement on an instant rail is immediate against a prefunded position or runs in several cycles a day. One cycle is minutes or hours. The signal that matters is the reconciliation of the settlement account and of the client's own books, which is daily, and the first weekend, because the instant rail runs when the batch rail and often the ledger's business day do not.

Expert wording: "Each stage is held for at least one full reconciliation cycle on both sides, the first client stage for five business days including a weekend, and one stage across a month-end."

### 3.4 What switching the flag off does and does not do

Quoted: "Switching the flag off returns new payments to A, while the stored decision keeps existing payments on B until they complete".

Problem: correct as far as it goes, and incomplete in three ways. Payments on B complete in seconds, so "until they complete" describes almost nothing; what persists is their recalls, enquiries and reconciliation. Returning to A is not neutral: after A's last submission cut-off of the day the payment waits until the next window, so the client sees a day's delay. And nothing is said of the payment that was sent to B and has not been confirmed.

Expert wording: "Switching the flag off sends payments accepted from that moment to A, from A's next submission window. It recalls nothing. A payment submitted to B whose outcome is unknown is resolved by status enquiry and is never resent on A. Exposure at the moment of switching off is bounded by the stage's caps, and by nothing else."

### 3.5 The example never mentions the differences that make the change risky

Quoted: "Suppose outbound account-to-account payments below a threshold amount are to be sent over the instant-payments rail, B, in place of the batch clearing rail, A."

Problem: a payments engineer immediately asks five questions the example does not raise. Is the beneficiary bank reachable on B, and what happens when it is not? Does sanctions and fraud screening, which had hours under A, complete in line within B's time limit? Who funds the prefunded position at the weekend? What value date and status report does the client receive? What is B's per-payment limit? The change also removes the window in which a payment on A can be pulled before submission.

Expert wording: add one sentence. "The two rails differ in more than speed: B is final within seconds, runs every day of the year, reaches only participating banks, has a per-payment limit, requires screening to complete in line and draws on a prefunded position; the rule must handle each of these, and the ramp exists to prove that it does."

### 3.6 This is not behaviour behind an unchanged interface

Quoted: "What the business may ramp at its own pace is behaviour behind an interface that does not change."

Problem: the principle is right, and the worked example breaks it. Moving a client's payments to an instant rail changes the debit time, the value date, the status messages and the statement entries the client sees. The example does require consent, but the document should say why.

Expert wording: "The routing change alters what the client observes (timing, value date, reporting) though no message format changes; it therefore needs the client's consent and notice, and cannot be ramped at the business's sole discretion."

### 3.7 Shadow does not replace the soak

Quoted: "This supplies most of what the soak was expected to reveal, from production's own traffic and with no client exposed."

Problem: contradicts finding 3. A shadow of a decision reveals whether the rule is right. It reveals nothing about leaks, sessions, date roll or batch. It is also not free: it consumes capacity and latency budget on the acceptance path.

Expert wording: "This supplies what the regression pack was expected to reveal about the rule, across a far wider range of cases. What the soak reveals about the build is supplied by the production bake."

### 3.8 The decisive control

Quoted: "Where money is involved, the shadow run is the decisive control, since a flag can reverse a decision and cannot reverse a payment."

Problem: non sequitur, and by the document's own account the shadow run "shows what would be sent and nothing about how the banks on B reply".

Expert wording: "Where money is involved the decisive control is the cap: at every stage the most that can go wrong is bounded by amount, count and client before the stage begins. The shadow run reduces the likelihood of reaching the cap; it does not replace it."

### 3.9 Card-specific material that should not be there

Quoted: "When Uber replaced the system that authorises its payments, it could not send each authorisation to the processor twice" and "then a quarter of a percent of users, then one percent, then five, one payment method at a time". Also: "Square learned this when it moved its payment records to a new service ... a rollout held stable per merchant".

Problem: both are card-acquiring cases (authorisation, processor, payment method, merchant) presented without qualification in a document about systems outside card scope. The technique transfers; the vocabulary tells the reader the author's mental model is cards. Figure 2 is worse: it still shows a "Staff" rung and a cohort of "1%, one merchant, one country" `[repo]`, while the text's ladder is synthetic client then one consenting client. The caption ("then staff, a small cohort, and everyone") contradicts the paragraph above it. Figure 11 shows a "Payment provider" called by a "Customer request".

Expert wording: introduce each as an analogy. "Uber, a merchant calling a card processor, faced the same constraint in a different business: a request that cannot be sent twice." Redraw figure 2 with the rungs the text uses: dark, shadow, synthetic tenant, one consenting client, widen. Add one sentence on the equivalent data constraint for account-to-account traffic: recorded payment messages contain names and account identifiers and fall under data-protection and bank-secrecy obligations, so the replay store needs masking, access control and a retention limit.

### 3.10 The Basel II parallel run is the wrong banking analogy

Quoted: "Banks will recognise this as a parallel run, a practice regulators have written into capital rules".

Problem: a four-quarter parallel calculation of capital is a parallel run of a model, not of a payment flow, and no payments person thinks of it first. The native analogies are the parallel run in a core or payment-hub migration, the mock conversion weekend, and the coexistence period of an ISO 20022 migration. `[judgement]`

Expert wording: "Banks will recognise this as the parallel run of a platform migration, applied to an ordinary change."

### 3.11 Knight's conditions

Quoted: "A firm in which a developer can enable money-moving behaviour for a client with no record and no second person has recreated the conditions at Knight."

Problem: see tell 8. The SEC order describes a deployment with no second technician's review, not an unapproved flag change `[repo]`. The document also draws only one rule from Knight ("It should never be reused").

Expert wording: "A firm in which one person can enable money-moving behaviour with no record and no second approver has no control over its most consequential changes. Knight teaches three further rules: a flag means the same thing on every version that may be running; code that a flag no longer guards is deleted; and the completeness of a deployment is verified by machine before anything is activated."

### 3.12 Google 2025 and Knight do not have "the same shape"

Quoted: "A Google Cloud outage in June 2025 had the same shape: code rolled out region by region, never exercised, and then triggered everywhere at once by a policy change."

Problem: the common element is dormant code first exercised at full scale. The mechanisms differ: Knight was version skew plus a repurposed flag; Google was unguarded code triggered by data that replicated globally in seconds. The second is the more useful lesson for this business and the document does not draw it.

Expert wording: "A Google Cloud outage in June 2025 shared the essential feature, a path first exercised everywhere at once, and adds a lesson of its own: the trigger was a data change that replicated globally in seconds. Configuration and reference data need a ramp as much as code does."

### 3.13 The FFIEC handbook

Quoted: "by 2024 the handbook used by US bank examiners described canary releases as ordinary practice".

Problem: over-claim. The notes record that the handbook names canary release as a function of an API gateway in its microservices material, in two mentions, with no mention of feature flags `[repo]`. That is recognition of a technique, not a description of ordinary practice.

Expert wording: "by 2024 the handbook used by US bank examiners named canary release among the recognised techniques for introducing a new version of a service".

### 3.14 Amazon's bake times

Quoted: "holding at each stage for at least one to twelve hours".

Problem: loose. The source gives at least one hour after each one-box stage, at least twelve hours after the first regional wave, and two to four hours after later waves, with a minimum count of data points `[repo]`. It also omits that Amazon's stages are safe because Regions and cells are isolated from one another, which a two-site active-active estate is not.

Expert wording: "holding for at least an hour after the first machine, at least twelve hours after the first region and two to four hours after each later wave, and in every case until a minimum volume of real traffic has been served. Amazon can do this because its regions fail independently; the business has two sites that do not."

### 3.15 The heading of finding 5 claims more than the evidence

Quoted: "Firms that separated the two kept their stability" and, in the summary, "the best available evidence, including the UK regulator's, indicates that they do so without loss of stability".

Problem: the FCA measured release size and frequency, not the separation of deployment from release, and its contrast is with long cycles; the business already releases twice a week. The document's own caveat paragraph is good, but the heading and summary outrun it.

Expert wording: heading, "Firms that release in smaller units have not been less stable". Summary: "the best available evidence, including the UK regulator's, associates smaller and more frequent change with higher success rates; none of it measures the specific step from a twice-weekly train to daily deployment".

### 3.16 The five-day arithmetic

Quoted: "It waits for the next train, which on a twice-weekly schedule is on average a little under two days away, and then spends three days in promotion and soak. The typical interval between finished and live is therefore about five days, and the worst case is seven."

Problem: the average wait is under two days only if the trains are evenly spaced (Monday and Thursday gives about 1.8 days; Tuesday and Thursday gives a little over two). The text does not say whether the three days are business or calendar days, and "A fix completed on a Wednesday morning reaches clients in the following week" depends on which. A reader with the release calendar will check this first.

Expert wording: state the calendar. "With trains cut on Monday and Thursday and three business days of promotion, a change waits 1.8 days on average for a train and reaches clients three business days later: five to six calendar days typically, eight at worst across a weekend." Then replace it with the measured figure as soon as the baseline exists.

### 3.17 Schema changes are not all dated releases

Quoted: "Some changes should stay on the present model. A ledger schema change cannot be hidden behind a flag".

Problem: the paragraph then describes expand and contract correctly but files the whole change under "stay on the present model". Only the contraction is irreversible. The expand steps are additive, backward-compatible and belong in the daily build; the read switch is itself a flag.

Expert wording: "A ledger schema change is made by expand and contract. The additive steps ship in the daily build, and the switch of reads is ramped behind a flag. Only the contraction, which is irreversible, stays on a dated release with a rehearsal on a production-sized copy."

### 3.18 Scheme dates are a single activation and should be treated as one

Quoted: "Scheme mandates take effect on the schemes' dates. None of these is a candidate for a ramp."

Problem: true, and it leaves the business doing exactly what the Knight section condemns: activating everywhere, on a date, a path that has never carried live traffic.

Expert wording: "Scheme changes take effect on the scheme's date. The code ships dark well ahead, is certified in the scheme's test environment and exercised by the synthetic tenant wherever the scheme permits early activation, and the activation itself is rehearsed, because it is the one event that remains all at once."

### 3.19 Rollback omits its own precondition and its ordering

Quoted: "Rollback to that build, and switching a flag off, should be pre-authorised actions that the on-call engineer may take without seeking approval".

Problem: rollback to N-1 is safe only if N-1 can process what N wrote; the Amazon article cited in the same paragraph is about exactly that and is used only for its half-fleet test. Nothing says the flag goes off before the binary goes back, nor that a flag whose code does not exist in N-1 must be off before rollback. "after messages have left the building" is colloquial.

Expert wording: "Rollback is pre-authorised on three conditions: the previous build has been shown to process everything the current build can write; every flag introduced by the current build is off; and no cut-off or batch step is in progress. The order is flag first, then traffic, then artefact. Once payment messages have been submitted to a rail, rollback restores the service and does nothing for those payments; they are handled by the recall and repair procedure."

### 3.20 Smaller points

- "Google's reliability handbook" is the Site Reliability Workbook. Name it.
- "the six baseline measures" in recommendation 10 refers to six questions, several of which are not measures. Add the four standard delivery metrics and call the set the baseline.
- "A pilot on that scale occupies a small team." Give a number. In my experience it is six to eight engineers on the service plus three or four on the platform, for two to three quarters. `[judgement]`
- "Every material change should be written so that its new behaviour sits behind a flag". "Material" is undefined. Define it: any change to what is sent, posted, charged or reported.
- "Starling Bank ... three approvals for every release" is accurate to the notes `[repo]`, but Starling's published production simulator, cited in the notes, generated card authorisations `[repo]`; if the synthetic tenant is footnoted to Starling, say it is a card-side analogue.
- "Three releases would be in promotion at any time, requiring three sets of environments and three times as many partner test windows." Correct, and one of the better operational sentences in the document.

## 4. The worked example

It is not yet convincing to a payments engineer. The pinned decision is right and the ladder is right. What fails is the treatment of rail B (returns, settlement cycle), the absence of any number (cap, duration, threshold), the absence of stop conditions, and the absence of anything going wrong. An example in which nothing can go wrong reads as a brochure.

The rewrite below is how I would put it in the report. It is `[judgement]` throughout, and the durations and caps are illustrative starting points to be set with the business.

### The example as an expert would write it

Take one change: outbound credit transfers under a threshold move from the batch clearing rail (A) to the instant rail (B). The rails are not interchangeable. A payment on A can be pulled until the submission cut-off and settles a day or more later. A payment on B is final within seconds, at any hour of any day, and can be recovered only by asking the beneficiary's bank to send it back.

The design decision comes first. The rail is chosen once, at acceptance, written to the payment record and never re-evaluated: recalls, enquiries and postings follow the stored rail. A payment submitted to B that times out is resolved by status enquiry and is never resent on A.

Stage one is dark. The code ships disabled and the build bakes on one node per site through a peak and an end-of-day. The usual failure is that the disabled path is not identical to yesterday's behaviour.

Stage two is shadow. For all traffic the rule records the rail it would choose, the reachability and limit checks, and the message it would build, validated and never sent. It is held for seven days, to include a weekend and a payroll peak, and stops on any unexplained mismatch. The usual failure is that nobody owns the mismatch report.

Stage three is the synthetic tenant. Test accounts in production send small real payments over B to accounts the business holds at other banks, through acceptance, rejection, timeout, recall and reconciliation, and the flag is switched off mid-stream as a rehearsal. It is held for two business days and a weekend. The usual failure is a Saturday payment posted to Monday's business date, breaking the settlement-account reconciliation.

Stage four is one consenting client, one payment type, a low cap per payment and per day. The team watches rejection rates by reason code against that client's history, time to confirmation, unknown outcomes, the prefunded position, and breaks in both the business's and the client's reconciliation. It stops on any duplicate, any break, or any outcome unknown for an hour. It is held for five business days. The usual failure is on the client's side: its treasury system expected next-day value.

Stage five widens by client, then raises the cap, never both in one step. Each step is held for a full reconciliation cycle and one across a month-end. The usual failure is a second ramp on the same settlement account, which makes a break unattributable.

Switching off sends new payments to A from its next window. It recalls nothing: every payment already sent on B is final, so exposure equals the caps. The cap is the control.

## 5. The recommendations

### Assessment of the ten as written

| No. | Recommendation | Verdict | Comment |
| --- | --- | --- | --- |
| 1 | Establish the baseline | Right, incomplete | The six questions are good. Add the four delivery metrics, and add the inventory of what each promotion activity is for. |
| 2 | Separate deployment from release | Right, missing its preconditions | Cannot be done safely before N and N-1 compatibility, idempotency and observability exist. The batch-on-a-slice sentence is wrong. |
| 3 | Prove each material change in production | Right in shape, naive in detail | "Material" is undefined; no stop conditions or caps; shadow is oversold. |
| 4 | Ramp by client, with consent | Right, naive about shared fate | Says nothing about components all clients share, or contractual terms for early cohorts. |
| 5 | Make rollback routine and pre-authorised | Right, in the wrong place | Must precede recommendation 3. A ramp without a rehearsed way back is the release train with extra steps. Missing the compatibility precondition. |
| 6 | Govern flags with a lifetime | Right, late and soft | Governance must exist before the first production flag. "A removal date" needs enforcement and a cap. Does not distinguish release flags from permanent controls. |
| 7 | Give the authoring team the pager | Right in principle, naive for a bank | No access model, no segregation of duties, no role for the operations bridge. Correctly conditioned on tooling. |
| 8 | Rewrite the change policy | Right, too late | This gates everything from recommendation 2 onward and should be third. Needs the standard-change construct. |
| 9 | Keep a pre-production hold where a ramp does not fit | Right, under-specified | Omits vendor packages, mainframe subsystems, interface changes and shared-fate components; misfiles schema expansion. |
| 10 | Begin with one pilot; expect years | Half right | "Expect years" and "keep the train running" are right. Choosing a service with nothing hard in its path is the classic mistake. |

Missing entirely: observability; compatibility and schema discipline; idempotency and pinned decisions as a platform rule; the flag service's own engineering; the synthetic tenant as a standing capability; configuration and reference data; batch validation; concurrent-ramp limits; numerical targets.

### The list as I would write it for this business

All rationale sentences are `[judgement]`.

1. Inventory the three days and baseline the delivery metrics before changing anything. You cannot defend removing a control whose purpose and yield you have not measured.
2. Build observability by client, by version and by flag cohort, and reconcile as frequently as the data allows. A ramp is a comparison, and without the slice there is nothing to compare.
3. Rewrite the change policy with risk and audit now, defining the dark deployment, the flag step within an approved ramp plan and the rollback as pre-approved standard changes under dual control. Auditors test you against your own policy, so the policy must change before the practice does.
4. Build once, deploy the same artefact everywhere automatically, and rehearse rollback on every service at least monthly. A way back that has not been used this month should be assumed not to work.
5. Enforce compatibility between consecutive versions in the pipeline, and permit schema change only by expand and contract. Daily deployment means two versions in production permanently, and rollback is only as good as the older version's ability to read what the newer one wrote.
6. Make payment acceptance idempotent end to end, and require every flag on a money path to be evaluated once and stored on the transaction. Ramps multiply retries and outlive flag states, and these two rules are what stop either from moving money twice or down two paths.
7. Stand up a flag service engineered for the payment path, with local evaluation, a safe default on failure, consistency across sites, dual control and a full audit trail. The flag service becomes the most powerful change tool in the firm and must be built and governed as one.
8. Govern flags from the first one: owner, purpose, expiry enforced by the build, a cap per service, no reuse, and separate treatment for permanent operational controls. Flag debt is cheap to prevent in month one and expensive to remove in month twelve.
9. Create a synthetic tenant in production with real accounts and real rail connectivity, and keep it transacting continuously. It is the first cohort of every ramp and the only place a reversal can be rehearsed with real money.
10. Deploy daily with new behaviour dark, and bake each build on one node per site through a peak and an end-of-day before promoting it. The build's risk is separate from the behaviour's and still needs time, in production, at small exposure.
11. Prove every money-path change by shadow, synthetic tenant, one consenting client and capped widening, with written stop conditions and a named reader for the comparison. Where a payment is irrevocable the cap is the control, and a comparison nobody reads is not evidence.
12. Limit concurrent ramps to one per reconciliation domain per cycle, and hold any change that touches fees, interest or statements across a month-end. Attribution is lost the moment two changes share the slowest signal.
13. Validate batch and period-end code by partition, by parallel run against the batch of record, and by nightly period-end rehearsal on a production-sized copy. Batch cannot be ramped by traffic, and its failures arrive on the dates when they cost the most.
14. Keep interface changes, scheme changes, schema contraction, vendor and mainframe upgrades and shared-fate components on dated, rehearsed releases. These cannot be ramped, and saying so precisely is what makes the rest credible.
15. Bring configuration and reference data under the same staged rollout as code. Tables that reach every node at once are the largest unramped change class in most payment estates.
16. Move on-call to the authoring teams only after they have per-client dashboards, audited one-action controls for flag-off and rollback, and a defined hand-off with the operations bridge. Ownership without tooling produces attrition, not reliability.
17. Run the first pilot on a real money path at low value, alongside the train, for two to three quarters with stop criteria agreed in advance. A pilot that cannot lose money cannot teach you how to avoid losing it.
18. Retire the train one service at a time, when that service has met its targets for two consecutive quarters, and plan the programme over three to five years. The firms that succeeded did it in bounded steps, and those that tried to do it at once did not.

## 6. Vocabulary

### Terms an expert would use that are absent

| Absent term | Where it belongs |
| --- | --- |
| Progressive delivery | The name of the practice being recommended; never used |
| Blast radius | The concept behind every rung of the ladder |
| Bake, bake time | The production hold on a build; the document calls it a soak |
| Dark launch, dark deployment | "shipped disabled" |
| Kill switch; operational flag; release flag | Recommendation 6 |
| N and N-1 compatibility; mixed-version | Recommendations 2 and 5 |
| Expand and contract | Recommendation 9 ("widened ... narrowed") |
| Idempotency; idempotency key; duplicate detection | Worked example and prerequisites |
| In-flight | Payments and messages during a deployment or a flag change |
| Finality; irrevocability | The defining property of rail B |
| Recall; request for return; status enquiry | Lifecycle on rail B |
| Reachability | Whether a beneficiary bank is on rail B |
| Value date; cut-off; submission window | Client-visible effects; cut-off appears, the others do not |
| Prefunding; liquidity; settlement account; nostro | What moving volume to an instant rail changes |
| Break; suspense | What reconciliation actually produces |
| Standard change; pre-approved change | The construct that makes recommendation 8 work |
| Dual control; maker-checker; four-eyes; segregation of duties | Recommendations 7 and 8 ("a second person") |
| Shared fate; cell; partition | Limits of per-client ramping |
| Guardrail metric; stop condition threshold | Ramp plans |
| Change-failure rate; lead time; time to restore | The baseline |
| Synthetic tenant | "synthetic client" |
| Reference data; configuration | Change classes the document omits |
| Drain; graceful shutdown | Deploying under long-lived sessions |
| Date roll; end-of-day; start-of-day | "the roll of the business date" appears once |
| Impact tolerance; important business service | The UK operational-resilience frame risk will use |

### Terms used loosely or wrongly

| Term as used | Problem | Replacement |
| --- | --- | --- |
| "soak" for the production hold in recommendation 2 | Same word for the pre-production soak and the production bake blurs the argument | "soak" in pre-production; "bake" in production |
| "returns" on rail B | Batch-rail concept | "rejections, recalls and enquiries" |
| "settlement cycle" as a hold | Minutes or hours on an instant rail | "reconciliation cycle" |
| "shadow run" for both decision logging and Uber's record-and-replay | Two techniques with different costs and limits | "shadow evaluation" and "record and replay" |
| "parallel run" via Basel II | Wrong referent for a payments audience | "parallel run, as in a platform migration" |
| "rollback" for flag-off and artefact redeploy alike | Different speed, scope and authority | "disable" for flags; "rollback" for the artefact |
| "the binary", "the build", "a release", "the train" | Used interchangeably | "build" for the artefact, "deployment" for placing it, "release" for exposing behaviour |
| "material change" | Undefined threshold for the whole policy | Define by effect: changes what is sent, posted, charged or reported |
| "synthetic client" and "test accounts" | Suggests test data | "synthetic tenant: a real client of the firm, owned by the firm" |
| "retained under its hash" | Informal | "the immutable artefact, identified by digest" |
| "after messages have left the building" | Colloquial | "after submission to the rail" |
| "widened ... narrowed" | Non-standard | "expanded ... contracted" |
| "back-out", "backed out", "rollback" | Mixed | "back-out" only when quoting; otherwise "rollback" |
| "pilot" | A service chosen to be easy | "pilot on a money path at low value" |
| "the pager" | Fine for an internet company; a bank says "on-call" and "second-line support" | "on-call responsibility" |
| "Google's reliability handbook" | Imprecise | "Google's Site Reliability Workbook" |
| "scheme certification" | Not all rails certify per release | "scheme testing or certification, where the scheme requires it" |
| "authorises", "processor", "payment method", "merchant" | Card vocabulary in an account-to-account report | Keep only inside clearly labelled analogies |

## 7. The ten edits that would most increase technical authority

In order.

1. Rewrite the worked example along the lines of section 4: correct the mechanics of rail B, state the cap as the control, give durations, stop conditions and the usual failure at each stage. This is where a payments reader decides whether to believe the rest.
2. Add a "Preconditions" section between the findings and the recommendations, covering observability by client and version, N and N-1 compatibility, expand and contract, idempotency, evaluate-once-and-pin, the flag service and the synthetic tenant, with the sentence "I would not enable a flag on a money path until these are true".
3. Reorder and extend the recommendations as in section 5: change policy and rollback before the first ramp, flag governance before the first flag, on-call after tooling, and the build order stated explicitly.
4. Add the table of numerical targets, labelled as the author's judgement, and add the four delivery metrics to the baseline. One table of committed ranges does more for authority than five more citations.
5. Fix recommendation 2's bake: one node per site for online traffic, a separate method for batch, and the statement that two versions are in production permanently.
6. Add a short "Where this programme usually fails" section: flag sprawl, unread comparisons, the safe pilot, on-call without tooling, the board approving ramps as releases, partial deployment before activation.
7. Expand recommendation 9 into a positive list of what stays on a dated release, correct the schema paragraph so that only contraction stays, and add shared-fate components, vendor and mainframe upgrades, batch and period-end validation and the concurrent-ramp rule.
8. Remove or relabel card-specific material: redraw figure 2 to match the text's ladder (no "Staff", no "merchant"), introduce Uber and Square as analogies from card acquiring, and replace the Basel II analogy with the migration parallel run.
9. Correct the over-claims: "The tooling for all of this is well understood"; "the shadow run is the decisive control"; "most of what the soak was expected to reveal"; "recreated the conditions at Knight"; the FFIEC sentence; the heading of finding 5; the Amazon bake times; the five-day arithmetic.
10. Change the voice from reader to practitioner. Replace "the accounts I read" and "I have found no" with first-hand statements of what usually happens and what the author would do, and either do a week of fieldwork on the business's three days or retitle the document a position paper. Add configuration and reference data, the three kinds of flag, and the access model for on-call while doing so.
