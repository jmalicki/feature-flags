# Argument review of "Stop soaking, start ramping"

Scope: this reviews the essay as an argument aimed at engineering directors at a payments or core-banking firm. It does not review prose, figures or citation accuracy. Section and word positions refer to `essay.md` as committed at 941fe30 (about 6,200 words before the sources note).

## Verdict

The commissioner is right. The essay is an accurate, well-sourced survey of a practice, arranged by technique. It is not an argument addressed to a person who believes the soak works. It announces its conclusion in the second paragraph ("change, because the alternative is better overall"), then presents ten sections of material about what other firms do, and closes by listing five reasons the evidence does not reach the reader. A risk-averse director finishes it knowing more about canaries and no less confident in the train.

The four failures that matter most:

- The essay never states, tests or defeats the reader's theory of why the soak keeps clients safe. It says the soak answers "a different question" and moves on.
- The one causal mechanism that could carry the piece (the wait creates the batch, and the batch is the risk) occupies about 500 words in section 5, under a heading about canaries, and has a hole a director will find in a minute.
- The reader's real objections (we move money, audit, our clients are banks, what happens on my watch) are answered from 65% of the way through, or not at all, after 4,000 words of Facebook, Netflix, Flickr, GitHub and Booking.com.
- The essay asks for the abolition of a control ("Stop soaking", "replacing the release train") and offers in return "better overall", a cost of "years" and 5% to 15% of engineers, and an admission that no bank has published a result.

## 1. The argument as made, and the argument it should make

### The argument the essay actually makes

Thesis, in the essay's words: "That is the whole claim of this essay: change, because the alternative is better overall."

Reconstructed premises, in the order given:

| Section | Starts at | What it contributes | Kind of support |
| --- | --- | --- | --- |
| 1. You are behind, and that is an advantage | 1% | Others did it first; a regulator's data associates small frequent change with success | Authority and precedent |
| 2. The wait moved | 10% | Leaders kept waiting but moved the wait into production | Reframing, by analogy with Netflix and Amazon |
| 3. Start dark | 18% | Dormant and shadow deployment replace the soak's observation time | Description of technique |
| 4. One idea, three settings | 25% | Canary, flag and experiment are one mechanism | Taxonomy |
| 5. Long canary versus long flag ramp | 34% | The soak holds the binary and so creates the batch | The only causal argument |
| 6. The way back | 42% | Rollback must be pre-built, pre-approved, rehearsed | Description and instruction |
| 7. What managers have to change | 52% | Ownership, approval, blame, funding | Instruction and cost |
| 8. For systems that move money | 65% | Money-moving firms do this; rule texts do not require a soak | Answer to objections |
| 9. Done halfway | 80% | Famous failures were partial adoption | Pre-emptive defence |
| 10. Where to start | 92% | Six steps, then five gaps, then the conclusion restated | Ask, concession, peroration |

The logical form is: respectable firms do X; here is what X consists of; here is how to do X properly; here is what goes wrong if you do X badly; therefore do X. That is an argument that X is feasible and respectable. It is not an argument that the reader's current practice is worse, and "better" is a comparative. The comparison is made directly in only three places: the last two paragraphs of section 2, section 5, and the single sentence in section 9 that "three days of soak would have observed the same nothing".

Sections 3, 4, 6 and 7 are a handbook. They answer "how", which the reader has not yet asked, because the reader has not yet been given a reason to want it.

### The argument it should make

For this reader the argument has to run in this order:

1. Your soak and train exist to keep clients safe. Here, stated fairly, is how you believe they do that.
2. Here is where that belief fails, in terms you can check against your own records: what the soak cannot see, and what the train itself causes (batch, all-clients-at-once exposure, a slow and improvised way back).
3. Here is a mechanism that gives you more evidence at less exposure, shown working on a payment, at a regulated firm.
4. Here is what you keep (approvals, independent testing, pre-production tests, dated external releases), so the change is smaller than it sounds.
5. Here is a bounded trial that removes no control, what it will cost, what you will measure, and when you would stop.

### Where the two differ

- The essay's argument is about the alternative. The needed argument is about the status quo. The essay spends roughly 85% of its length making ramping look respectable and roughly 10% making the soak look weak.
- The essay's thesis is replacement. The needed thesis is a claim about evidence: three days in pre-production is weaker evidence than one day at one client's exposure in production. Replacement is a consequence the reader should reach unaided.
- The essay leads with precedent ("You would not be a pioneer"). For a director who is paid to avoid incidents, precedent from Facebook is a reason for suspicion.
- The essay treats the management change as the hard part and the persuasion as done by paragraph two. The reader has not agreed to anything by section 7, which nonetheless begins issuing instructions: "So the policy for you to write has three parts."

## 2. What the reader believes, and whether the essay engages it

### The reader's theory

A director at this kind of firm believes roughly the following. None of it is stupid.

- Three days in DEV, UAT and pre-production catch defects before any client sees them. The slow ones (leaks, pool exhaustion, degradation, scheduled jobs) need elapsed time to appear.
- A scheduled train gives clients, operations and support a predictable date, release notes and a known set of changes. Our clients are banks; they plan around it.
- Named sign-offs give an audit trail, and if something goes wrong we can show we followed an approved process.
- Releasing to everyone at once means one version in production, which is simpler to support and reason about.
- Production is where the money is. Anything that looks like testing there is a risk we are choosing to take with clients' funds.
- It works. We have few incidents, and the ones we have are investigated.

### Where the essay states that belief

It never does, in the reader's terms. The attempts:

> "It is a careful process, and this essay argues that you should replace it."

This is the entire acknowledgement in section 1. "Careful" is a compliment, not a statement of what the process is believed to achieve.

> "The soak is the stretch it spends in pre-production under test traffic, to see whether anything degrades."

This is the closest the essay comes to naming the soak's purpose, and it is dropped. The essay never returns to say whether degradation is in fact caught, or how a ramp catches it instead.

> "A pre-production soak asks whether a large batch survives several days in an environment that resembles production. A ramp asks whether one small change behaves correctly on production itself, for a few clients, with a way back. The second question is the one you need answered."

This is the pivot of the whole essay, and the last sentence is a bare assertion. The reader's reply is: "I need both answered, and the first before I risk the second."

> "Your objection is fair: a bad release at a photo site shows the wrong picture, and a bad release at your firm sends the wrong payment."

This is the only place an objection is voiced as the reader would voice it. It arrives at the 65% mark.

> "Your three days protect clients by making a large batch wait in a place that is not production."

This is in the final paragraph. It restates the reader's practice in the essay's terms, as a summary of a refutation that was never carried out.

The research report has a subsection headed "What a soak still buys" that names the defect classes the soak targets (leaks, pool exhaustion, slow degradation, time-triggered work), says which evidence supports holding for a load cycle or a work unit, and says what is not supported: "a uniform multi-day hold in a smaller environment for every change". That is exactly the fair statement and partial defeat the essay needs. It was not used. Fragments of it appear as an aside in section 9 ("Hold at least one stage through a full daily peak").

The belief about defensibility (process as protection for the person accountable) is not mentioned anywhere.

### Is there a moment where the reader's mind changes?

There are three candidates, and each is muffled.

- The Netflix quotation: "nothing broke after one week of canarying, let's push it". This could be a mirror held up to the reader's own go/no-go meeting. The essay uses it as history about Netflix and summarises it for the reader ("Elapsed time had turned into the evidence") instead of asking whether the reader's own sign-off criterion is anything other than "nothing broke".
- Section 5, on the batch. This is the real argument, but it is framed as the answer to a question the reader would not ask ("why not keep your soak and call it a canary?").
- Knight: "Five days in production observed nothing because nothing used the path, and three days of soak would have observed the same nothing." This is the sharpest sentence in the essay. It sits at the 81% mark, inside a section whose job is defending the alternative.

The structure throughout is: conclusion stated, then supporting material. The reader is never led to notice something about their own process before being told what to think about it. No question is put to the reader that they would have to answer uncomfortably.

## 3. Burden of proof

### What it takes to shift it

For this reader the default is to keep what works, and the asymmetry is personal: an incident under the existing process is bad luck handled by procedure; an incident under a process the director introduced is the director's incident. The burden shifts only if one of these happens:

- The status quo is shown to be causing or failing to prevent harm the reader already recognises, so that keeping it becomes the choice that needs defending.
- The alternative is shown to add evidence without removing protection, so the first step is not a bet.
- Someone the reader answers to (supervisor, auditor, a bank client) is shown to prefer or accept it.

### What the essay does

It works almost entirely on the third route and only partly succeeds, because it concedes at the end that there is "No auditor's verdict" and "No incumbent's account".

On the first route, the material that makes the status quo look risky is thin and scattered:

- The FCA figures (major changes failing at 3.8% against 1.6%; boards approving over 90%) in section 1.
- Atlassian's staging-tested script, in one paragraph at the end of section 2.
- "When it fails, you have three days of changes to search", one sentence in section 5.
- The OANDA banks, three sentences at the end of section 5.
- The Knight counterfactual, one sentence in section 9.

None of it is about the reader. The essay never asks the reader to look at their own incidents, batch sizes or rollbacks. It contains no instruction of the form "pull your last twelve months of production incidents and count how many were caused by a release that had passed the soak". It does not ask:

- How many changes ride each train, and how many were unrelated to the one that failed last time.
- What the soak has actually caught in the last year that earlier test stages did not.
- How a fix reaches production when a train fails. If the honest answer is an expedited hotfix that skips the soak, then the firm already deploys unsoaked changes to every client at once, under pressure, at the worst moment. That is an inference from how release trains usually work, not something the sources establish, but it is the kind of observation that makes a director feel the risk in their own process. The essay has nothing like it.
- How long the last rollback took, who authorised it, and whether it had ever been rehearsed.

On the second route the essay has good material ("it removes no control on the first day"; "Keep what was kept") but places it at 92% and 63% respectively, after the reader has spent the piece assuming the proposal is to delete the soak, because the title says so.

The opening actively raises the burden. "You are behind, and that is an advantage" tells a director with a clean incident record that they are deficient by the standards of consumer internet companies. The natural response is defence, not curiosity.

Net effect: the alternative looks respectable; the status quo looks unfashionable. Unfashionable is not risky.

## 4. Evidence-to-claim fit

Grades are for this reader: decisive, suggestive, decorative, or irrelevant.

| Claim | Evidence offered | Grade | Comment |
| --- | --- | --- | --- |
| You would not be a pioneer | Facebook, Amazon, Google, Netflix, Microsoft; Uber, Square, Stripe; Monzo, Starling; FFIEC handbook | Decorative, except FFIEC (suggestive) | The first five names trigger "this is for websites". Monzo and Starling were built new, as the essay admits 5,500 words later. The FFIEC sentence describes; it does not endorse. |
| Smaller, more frequent releases succeed more often | FCA multi-firm review | Suggestive; the best single item for this reader | Correlational. The major-change comparison is confounded (major changes are inherently riskier), and a sharp reader will say so; the essay does not pre-empt it. The 24% of high-severity incidents figure appears only in a figure, not the argument. |
| Change boards are weak assurance | FCA: over 90% approved | Suggestive | The reader may not have asked about boards; the essay's target is the soak, and this is evidence about a different control. |
| The wait moved; it was not removed | Netflix canary; Amazon pipeline | Suggestive for the idea, weak for the analogy | Amazon's 14 of 16 days were "waiting for a person". The reader's three days are a deliberate soak, not idle queueing, so the comparison may not transfer. And the essay says Amazon's pipeline today takes "four or five business days", which is longer than the reader's three. A reader asking "what do I get" notes that the exemplar is slower. |
| Staging answers a different question | Atlassian 2022; Stripe 2019 | Atlassian suggestive; Stripe self-undermining | Atlassian was a maintenance script, not a release. The Stripe fault passed "a phased rollout and about three months in production", so it shows the ramp missing a fault too. The essay uses it to show waiting does not help, which damages its own remedy as much as the soak. |
| Dark launch replaces the soak's observation time | Facebook Chat, Flickr, Netflix, GitHub merges, Square | Square suggestive; the rest decorative | A chat feature and pull-request merges do not move money. Square is the only one that does and it gets one sentence. |
| Canary, flag and experiment are one mechanism | Google 2010, Kohavi 2007, LinkedIn, Uber, Booking.com | Irrelevant to this reader | True and interesting to a practitioner. A director deciding whether to keep a soak does not need the taxonomy, and "experiment" introduces a fair-treatment objection the reader did not have. |
| Experts predict badly, so run both | Microsoft: one third of experiments improved their metric | Irrelevant | It is about product ideas, not regressions, as the research report itself notes. |
| The batch is where the risk gathers | OANDA and its bank licensees; Financial Times | OANDA suggestive and the closest fit in the essay; FT weak | OANDA is qualitative and written by insiders, but "describes the reader's situation exactly" (the report's phrase). It gets three sentences at the end of a section. The FT's "before" was twelve releases a year; the reader makes about a hundred, so the reader is not the FT's before. |
| Rollback can be fast and safe | Netflix red/black; Wealthfront five seconds; Humble and Farley | Suggestive | Wealthfront in 2010 was a cluster of ten machines. The essay then lists what rollback "does not undo: data the new version wrote, a schema it migrated", and the figure adds "money moved". The reader's central fear is conceded in a caption and answered 1,500 words later. |
| On-call should be free to roll back | Google guidance, Booking.com, Amazon, Monzo, Slack | Suggestive | Followed at once by two cases of rollback going wrong (Azure DevOps, Stripe). Honest, but the reader takes away that rollback is dangerous. |
| Managers must change ownership, approval and blame | Netflix, Amazon, FT, Starling, OANDA, Allspaw | Not evidence for the thesis; it is cost | Starling (daily releases with three human approvals and auditors who "loved" the visible signal) is the best intermediate model for this reader and is one item in a list. |
| It takes years and a platform team | Facebook 5%, OANDA 15% and two years, Google five years | Decisive, against the proposal | The only quantified figures about what the reader would experience are costs. |
| Money-moving firms ramp safely | Uber authorisation shadowing; Uber ledger; Monzo; Stripe; Basel II parallel run | Suggestive to strong as existence proof | This is the best evidence in the essay for feasibility. The Basel parallel run is an excellent bridge to the reader's own vocabulary and is one sentence. All of it is at 65% or later. |
| The rules do not require a soak | PCI DSS, FFIEC, EBA, DORA, MAS texts | Suggestive | The nearest thing to a decisive answer on one objection. It is weakened by "as read in summary for this essay", by the concession that DORA standards treat testing in production "as an exception to be justified, approved and time-limited", and by the fact that auditors test against the firm's own change policy and client contracts, which the essay never mentions. |
| The famous failures were partial adoption | Knight, Google Cloud, CrowdStrike, Cloudflare, RBS, Roblox, Uber flags, TSB | Self-undermining as arranged | See below. |
| Start by encoding today's process | Amazon | Suggestive | Sound, and the most reassuring idea in the essay. It is at 92%. |

### Where the essay undermines itself

The honesty is to the essay's credit and should be kept. The problem is where the concessions sit and what they are attached to. A concession placed before a claim, as a boundary on its scope, builds trust. A concession placed immediately after a conclusion reads as a retraction.

- Section 1 quotes the FCA's strongest finding and follows it with a paragraph that begins "The review reports associations" and ends by saying the findings merely "point away from" the large release. The best evidence is discounted within 100 words of being introduced, before it has done any work.
- Section 2 ends with Stripe, a fault that survived a phased rollout and three months of production. The essay intends "waiting does not help". The reader hears "ramps do not catch it either".
- Section 3 ends: "Dormant is not the same as tested, and the worst failures in this essay are about that difference." The section that introduces the first step closes by linking it to the worst failures.
- Section 6 states the policy that rollback is pre-approved, having just shown two rollbacks that made things worse.
- Section 8 says "No source states the rule, but it follows" about the reconciliation-cycle hold, and "as read in summary for this essay" about DORA. Both tell the reader that the money and audit answers are partly the author's inference.
- Section 9 is a list of seven disasters. The claim "The failures on record are failures of doing part of this" has the shape of a no-true-Scotsman defence: every failure of the method is reclassified as not really the method. The Knight counterfactual is flagged as the author's own ("This essay's reading adds one"). TSB is conceded to argue "for better testing as well". Roblox argues for a longer hold. A sceptic reads this section as a catalogue of what flags, staged deployment and rollback did to firms larger and better resourced than theirs, including a $460 million loss at a financial firm whose trigger was a reused flag.
- Section 9 closes: "No post-mortem found for this essay blames an outage on having ramped where a soak would have served, though nobody has run a controlled comparison either way." Absence of evidence, then a hedge on the absence.
- Section 10 places five bullets of gaps directly between the ask and the peroration. The last substantive thing the reader learns before "The second way is better overall" is that there are no before-and-after numbers from a bank, no auditor's verdict, no incumbent's account, little on low volumes and almost nothing on period-end jobs. Those five gaps are, nearly word for word, the reader's five reasons to decline.
- "Better overall" is itself a hedge. "Overall" concedes that it is worse somewhere and does not say where. The essay never gives the ledger.

The fix is not to hide the gaps. It is to move them to the front as scope ("this is what the evidence can and cannot tell a firm like yours"), to state what the soak still buys, and to shrink the claim until the evidence carries it.

## 5. Structure against the sceptic's objections

The order of sections is the order of a textbook: history, concept, techniques, organisation, special cases, failure modes, getting started. The order of a sceptic's objections is different.

| Order raised | Objection | Where the reader thinks it | Where the essay answers | Assessment |
| --- | --- | --- | --- | --- |
| 1 | This is for websites | Paragraph 3, on reading "Facebook launched its chat system this way" | Partly in the same paragraph; properly in section 8 | Late by 4,000 words. Sections 3 and 4 make it worse: Facebook (13 mentions), Flickr, GitHub, Booking.com. |
| 2 | We move money; a payment cannot be recalled | Immediately | Section 8, at 65% | Late. The answer (shadow without sending; reversible decision, small exposure) is good. |
| 3 | Our soak catches real problems | Section 2 | Never | Missing. The largest single omission. |
| 4 | Audit and the regulator will not allow it | Section 1 | Section 8, fourth item; then undercut by "No auditor's verdict" in section 10 | Late, and answered from rule texts only. The firm's own change policy, external audit reports and client contracts are not mentioned. |
| 5 | Our clients are banks with their own sign-off | Section 1 | Final paragraph of section 8, about 120 words | Buried. For a vendor to banks this may be the binding constraint. "The first cohort is a client that has agreed to go first" does not say why a bank would agree. Hosted versus client-installed deployment is not distinguished. |
| 6 | Testing in production means testing on clients | Section 3 | Implicitly, through the dormant and shadow rungs | Never confronted by name. The essay itself reports that EU standards treat testing in production as an exception. |
| 7 | We tried flags and it was a mess | Section 3 or 4 | Two sentences in section 9 ("Flags became debt") | Thin. The combinatorial problem (the binary in production runs in a flag configuration nobody tested) is not raised. Mixed-version states are not discussed. |
| 8 | Who gets paged | Section 6 | Section 7 | Addressed as an instruction. Nothing on out-of-hours cover, contracts, or what happens to the release and QA teams. |
| 9 | What does it cost | Section 3 onward | Section 7: 5% to 15% of engineers, two to five years | Cost is stated; no benefit is quantified against it. |
| 10 | What if it goes wrong on my watch | Throughout | Never | Missing. The DBS six-month pause is cited, which raises the fear without answering it. "Do not answer a failure with a gate" tells the director how to behave after an incident, not how they will be protected. |
| 11 | Our volumes are low and lumpy; month-end is where it breaks | Section 4 or 5 | Conceded as gaps in section 10 | Conceded, not answered. |
| 12 | Schema and data changes cannot be flagged off | Section 6 | One paragraph (Amazon's two-phase deploy) | Thin for a ledger system. |

Three of the eight objections named in the brief are effectively missing ("on my watch", "we tried flags", the soak's real catches), two are late (money, audit), one is buried (bank clients), and two are answered as instructions to the reader (pager, cost).

## 6. Stakes and mechanism

### Does the reader get a two-sentence mechanism?

Not as written. The essay offers at least five competing framings: you are a fast follower (section 1); the wait moved (section 2); start dark (section 3); one idea, three settings (section 4); the failures are failures of doing it halfway (section 9). A reader asked afterwards "what was the argument?" would most likely say "the big tech firms use feature flags and it is safer", which is the version their boss already discounts.

### The best candidate

> A soak holds the whole release, so everything else queues behind it and every release is a bundle of several days' changes shown to every client at once; the bundle and the all-at-once exposure are where the risk is, and time in pre-production reduces neither. A flag puts the wait on the one risky behaviour, in production, at one client's exposure, with a rehearsed off switch, so you get better evidence and a smaller blast radius, and nothing else waits.

The essay contains every part of this. "The batch is where the risk gathers" is in section 5. "Each is a long wait on one behaviour. A release-train soak is a shorter wait imposed on everything" is in section 5 and is the best line in the piece.

### Is it the spine?

No. It is section 5 of ten, about 500 words (8% of the essay), under the heading "Why a long canary hurts and a long flag ramp does not", which frames it as a distinction between two techniques the reader does not yet use. It is introduced by a question the reader would not ask: "If canaries and flags are the same mechanism, why not keep your soak and call it a canary?"

### The mechanism has a hole

The essay says: "While release 1 sits in pre-production for three days, everything your engineers finish goes into release 2. So release 2 is three days of changes". The reader releases twice a week through a three-day promotion, so trains must already overlap in the pipeline; the batch is set by the cadence (about two and a half working days of merges), not by the soak length. A director will reply: "Then we could run a train every day and keep the soak." The Google quotation the essay uses concedes the point with its qualifier "while running only one canary deployment at a time".

To hold, the mechanism has to be stated as three separate costs, each of which survives that reply:

- Batch: whatever the cadence, each train carries many unrelated changes, and a failure in one blocks or rolls back all of them.
- Exposure: at the end of the soak every client gets the change at once, so the first production evidence arrives at full blast radius.
- Latency: a fix for anything found in production takes another full promotion, or skips it.

The essay runs the first and third together and states the second only in the last paragraph. Figure 5's schedule (releases on days 3, 6 and 9) also does not match "twice a week", which a careful reader will take as a sign that the author has not looked closely at their process.

## 7. The Monday test and the "what do I get" test

### What it asks for

Six steps in section 10. Assessed individually:

| Step | Bounded? | Comment |
| --- | --- | --- |
| 1. "Measure your three days" | Yes | The right instinct, but the measurement is borrowed from Amazon (work versus waiting for a person). If the three days are deliberate soak, the answer is "three days of soak" and nothing follows. The measurements that would move this reader are different: changes per train; incidents caused by releases that passed the soak; what the soak caught that earlier stages missed; hotfixes that bypassed it; time and authority for the last rollback. |
| 2. "Put today's process in a pipeline" | Mostly | The strongest step. It "removes no control on the first day" and produces audit evidence. It should be the headline, not step 2 at the 93% mark. |
| 3. "Give one team the whole job: build, deploy, and the pager" | No | A change to on-call, to the release team's remit and possibly to contracts, presented in eight words. |
| 4. "Ship that team's next risky change dark" | Yes | This is the actual pilot. It has no success criterion, no duration, no statement of which controls stay in force, and no stop condition. |
| 5. "Rehearse the way back" and write the policy | Partly | The rehearsal is bounded; the policy needs risk and audit, which the essay says elsewhere. |
| 6. "Automate what has become boring" | No | Open-ended. |

There is no statement that the train continues for everyone else during the trial, no named sponsor outside engineering (risk, audit, a client), and no point at which the director decides whether to continue.

### What it promises

"The second way is better overall." No number, no time frame, nothing the director could put in a business case. The essay does say what will not improve ("The risky change may well reach every client later than it would have on the train") and what it will cost (years; a platform team). Outcome figures that exist in the research and could bound the promise are used weakly or not at all: the FCA's 1.6% against 3.8%; the FT's roughly 16% to under 1%; Slack's 90% fall in customer impact hours after automatic rollback (in the report, not the essay).

### Proportion

The title demands abolition ("Stop soaking"), the subtitle "replacing the release train", the body says "expect years", and the first move is "measure". The ask is disproportionate to the evidence at the top and disproportionate to the rhetoric at the bottom. A director can agree to "run one risky change both ways and compare what each showed you". A director cannot agree to "stop soaking" on the strength of an essay that admits no bank has published the result.

## 8. Three alternative spines

### A. One change, two journeys

Take a single, plausible, money-affecting change (for example a change to how a settlement amount is computed for one scheme) and follow it through the reader's train: merged on Monday with forty other changes, promoted, soaked on test traffic that contains none of the affected transactions, signed off because nothing broke, released to every client on Thursday, discovered wrong at Friday's reconciliation, and then fixed either by rolling back forty changes or by an expedited patch that skips the soak. Then follow the same change through the other system: deployed dormant, shadowed against live requests without sending anything, mismatches counted, enabled for staff, then one agreeable client through one reconciliation cycle, then widened; found wrong at the shadow stage, at zero client exposure. Each of the reader's objections is answered at the point in the journey where it arises (audit at the approval step, bank clients at the first cohort, the pager at the first live stage). The essay ends with the trial: do this for your next risky change, with the train still running.

Evidence it leans on: Uber's authorisation shadowing ("dozens of argument mismatches"); Square's comparison and six-week read phase; Monzo's and Stripe's reconciliation as the stage clock; the Basel parallel run as the reader's own word for shadowing; Atlassian for the staging gap; Knight as the same journey with the shadow rung missing; OANDA's banks for the batch; Starling for approvals kept; Amazon's "encode their current release process" for the first step.

Risk: the walk-through is a composite and must be labelled as one. If the "before" journey misdescribes the reader's process (as figure 5 and the three-day batch arithmetic already do) it loses them at once. It needs someone who knows the real pipeline to check it.

### B. Audit the soak with your own numbers

Open by asking the reader for five figures from their own records: changes per train; production incidents in the last year attributable to a release that had passed the soak; defects the soak caught that earlier stages had not; hotfixes that bypassed the soak; minutes to roll back and who had to approve. Build the economic argument on those: the soak's yield per day, the cost of the batch (search space, coupled rollback, delayed fixes), and the exposure at release. Then show that the alternative attacks each cost, and state what the soak still buys (a hold through a load cycle and a batch work unit) and where to keep it.

Evidence it leans on: the FCA review; Amazon's 14 of 16 days; OANDA's banks; the FT; "What a soak still buys" from the report; Microsoft Office ring data (79% of regressions that showed did so within three days, the rest by day seven), which honestly supports some hold; Yuan and colleagues on catastrophic failures reproducing in small tests; DORA 2018's "misguided performers" for the trade between failure rate and recovery time.

Risk: the essay cannot supply the reader's numbers, so the decisive step happens off the page, and the numbers may vindicate the soak. The report admits "No source measures defects caught per day of soak". It also reads as an audit of the reader's competence unless handled with care.

### C. The six objections, in the reader's order

State the six strongest objections in the reader's own words and in the order they arise (it is for websites; we move money; our soak catches things; audit; our clients are banks; what if it fails on my watch). Give each its strongest form, the single best piece of evidence in answer, and an explicit statement of what is conceded and therefore kept.

Evidence it leans on: the same as A, redistributed; the rule-text table; Starling and Capital One for audit; the MiFID II kill-switch asymmetry (controlled to turn up, immediate to turn off) as a regulator already holding the essay's position on rollback; Stripe's and Adyen's client-opted cohorts.

Risk: it is defensive. It lets the sceptic set the frame, has no positive mechanism unless one is added, and reads as a FAQ. Each answer ends in a concession, so the cumulative effect can be "yes, but" six times. It is also where the missing evidence (no auditor's verdict, no incumbent) is most exposed.

### Recommendation

Use A as the spine. It is the only structure in which the reader sees the mechanism operate on something they recognise, and in which the status quo is made to look risky by narrative and not by assertion. It also forces the essay to cut what does not belong: there is no place in a single change's journey for the history of Facebook Chat or the unity of canaries and experiments.

Borrow two things. From B, turn the five numbers into the Monday ask, so the reader tests the walk-through against their own records. From C, take the discipline of stating each objection in the reader's words at the step where it arises. The current sections 3, 4, 6 and 7 become a short reference appendix or a second document for the team that runs the trial.

## 9. The five changes that matter most

1. Shrink the thesis and the ask to what the evidence carries. Replace "Stop soaking" and "change, because the alternative is better overall" with a claim about evidence and exposure, and a bounded trial: keep the train running; take the next risky change; run it dormant and in shadow alongside the normal process; compare what each showed; decide at a named date. State the success and stop criteria. Delete "You are behind, and that is an advantage".

2. State the reader's theory of the soak fairly and test it. Say what the soak is for (slow degradation, leaks, time-triggered work, integration, client acceptance, a defensible record), concede what it buys, and show for each job what does it better or where a scoped hold should stay. The material is in the report under "What a soak still buys". Without this, the reader has never been disagreed with, only talked past.

3. Make the batch-and-exposure mechanism the spine, and repair it. Lead with it; separate batch, all-at-once exposure and fix latency; correct the three-day arithmetic for a twice-weekly train; answer "why not a daily train with the same soak". Give the reader the measurements to check it against their own incidents. Promote OANDA's banks, the Knight counterfactual and the Netflix "nothing broke" line from asides to load-bearing evidence.

4. Move money, audit, bank clients and personal accountability to the front, and cut the consumer-internet history. Open with payments and regulated firms (Uber's shadowing, Square, Starling's approvals, the Basel parallel run, the FCA data). Add the two missing answers: how a bank client is brought to agree to be a first cohort, and how the director is protected when something goes wrong (what record the pipeline produces, risk and audit as co-designers of the trial). Reduce section 4 to a paragraph or remove it; experiments are a separate proposal with a separate objection.

5. Reposition the concessions and the failures. Put the gaps at the start as scope, not at the end as retraction, and say what they imply (a trial, not a conversion). Replace "failures of doing part of this" with an honest two-column ledger: failures the soak would also have missed, and risks the new way introduces (flag debt and reuse, untested flag combinations, mixed versions, dormant paths, rollback that does not undo data), each with its control. Stop following each strong claim with its own discount; state the claim at the strength the evidence supports the first time.
