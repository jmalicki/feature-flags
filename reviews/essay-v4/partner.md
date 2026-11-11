# Partner review of essay.md (v4)

Reviewed: `essay.md` at commit f0b283d, 5,125 words including sources. Evidence checked against `reports/Testing gates to ramping culture.md`. Nothing in the repository was edited.

## 1. Verdict

I would not send this to a client. It is a careful, honest literature essay that has been given the headings of an assessment: it contains no finding about the client that was not deduced from two numbers (twice weekly, three days), and it says so itself in the last paragraph of the Summary. The recommendations are ten opinions in the conditional mood ("should" appears 32 times) with no owner, no date, no cost and almost no measure, and the one real ask, a two-quarter pilot, is recommendation ten of ten and absent from the Summary. The author is a strong senior associate or first-year manager: the research discipline, the caveats and the payments worked example are better than most partners could produce, but nobody has yet forced the author to answer "what do you want the directors to decide on Monday, what will it cost, and what do they get". The prose is now grammatical and adult, which is progress, but it has overcorrected into a uniform, measured, essayist's register that explains where a consultant would commit.

## 2. Governing thought and structure

### The governing thought as written

Assembled from the Summary: "the model is sound on safety and expensive on speed", the delay "is a consequence of design", and "I recommend that the business make the same change" as firms that separated deployment from release.

Three things are wrong with it.

- It is a diagnosis plus an analogy, with no ask. "Make the same change" is not a decision anyone can approve.
- It concedes a point the body then spends a thousand words attacking. The Summary says the model is "sound on safety". Finding 5 then shows that large batched changes fail more often and that heavy approval did not offset it; recommendation 5 says back-out plans "fail when they are first used in earnest"; Finding 2 says a misbehaving train must first be searched for the guilty change. Either the model is sound on safety or it is not. And the author cannot know, having "not drawn on the business's own change and incident data".
- It promises speed for everything. The body admits otherwise in two places: Amazon's ramped pipeline "typically takes four or five business days to reach every region", and the worked example "reaches every client later under this model, perhaps by several weeks". The source report is blunter: "The gain is exposure control and small batches, not elapsed time". The Summary never tells the directors that the risky changes get slower.

### The governing thought as it should be

Something close to this, using only what the document knows:

> The train makes every change wait about five days because it can only release everything at once. Deploy daily with new behaviour off and release each material change to one client at a time on production evidence, and ordinary changes reach production in a day while risky ones are exposed more cautiously than today. Approve a six-measure baseline and a two-quarter pilot on one service; the pilot's own figures, not other firms', decide whether the train retires.

### Is the Summary an executive summary

No. Tested against the seven parts:

| Element | Present? | What the Summary actually says |
| --- | --- | --- |
| Situation | Yes | Twice a week, three days of promotion and soak |
| Complication | Yes | "roughly five days of delay on every change regardless of risk" |
| Resolution | Yes, in principle | Separate deployment from release |
| The ask | No | "three matter most", then "the first recommendation is to assemble that data". The pilot, its duration, its scope and its client are not mentioned |
| Size of the prize | No | "substantially faster". No number, and no statement of what gets slower |
| Cost | No | "The tooling for all of this is well understood." The only cost figure in the document (15% of OANDA's engineers on tooling, two years) is in the second paragraph of recommendation 10 |
| Risk | No | The Summary's only caveat is about the author's evidence, not the programme's risk |

The Summary also contradicts itself on priority. It says three recommendations "matter most" (2, 3 and 5), then says "the first recommendation is to assemble that data" (1), while the document's actual first move is recommendation 10. A director finishing the Summary has five candidate priorities and no instruction.

The sentence "The recommendations in the second half of this document are specific" is the author marking their own homework, and it is not true.

### Are the findings MECE, and do they ladder up

They are not findings and they are not MECE. They are six steps of one argument:

1. Cost (five days).
2. Consequence of that cost (overlaps 1).
3. Constraint (cannot compress).
4. Diagnosis (coupling).
5. Evidence from other firms.
6. Caveat on that evidence.

None of the six reports anything observed at the client. Findings 1 and 3 are arithmetic and inference from the model description ("In a payments business it contains..."); 2 is asserted for the client and evidenced from Amazon, LinkedIn and Facebook; 5 and 6 are a literature review.

Finding 3 contradicts recommendation 1. The heading asserts "The three days do real work". Baseline question 1 asks "for how many hours is something being done to the release, and for how many is it waiting for a window or a person?" and question 2 asks what the soak caught. The author states as a finding the thing the baseline exists to discover, two pages after citing Amazon's 14 days of waiting in 16.

Finding 5's heading overclaims. "Firms that separated the two kept their stability" is supported for Facebook and OANDA. The FCA evidence, which the section calls "the strongest", is about "smaller, more frequent releases", not about firms that separated deployment from release. The heading borrows the regulator's authority for a claim the regulator did not make.

The ladder is broken for half the recommendations. Findings 1 to 4 support recommendation 2. Finding 5 supports 2 and 3. Finding 6 supports 1 and 10. Recommendations 4 (client ramp), 5 (rollback), 6 (flag governance), 7 (ownership) and 8 (change policy) have no finding beneath them: there is no finding on how the business rolls back today, who carries the pager, what its change policy says or how its board behaves. That is why those recommendations each have to carry their own case study, and why they read as essays.

### Do the headings tell the story

Read alone, in order:

> Deploy every day, release when it is proven / An assessment of the release-train model, with recommendations / Summary / Findings / Every change pays about five days, whatever its risk / The delay degrades how software is developed / The three days do real work and cannot be compressed within the model / The trade between speed and safety comes from coupling deployment to release / Firms that separated the two kept their stability / The evidence has limits, and they bear on how to proceed / Recommendations / Establish the baseline before changing anything / Separate deployment from release / Prove each material change in production before releasing it / Ramp by client, with the client's consent / Make rollback routine and pre-authorised / Govern flags as controlled changes with a defined lifetime / Give the authoring team ownership, including the pager / Rewrite the change policy with risk and audit, and keep named approvers / Keep a pre-production hold where a ramp does not fit / Begin with one pilot, and expect the programme to take years / Sources

Credit where due: the six finding headings are genuine action titles and they do carry the diagnosis. This is the best structural feature of the draft. The failures are these.

- "Summary", "Findings", "Recommendations" and "Sources" are labels.
- The title is a slogan with no prize and no ask. The subtitle is set as a second-level heading, a sibling of "Summary", which is a formatting error.
- "The evidence has limits, and they bear on how to proceed" announces a conclusion and withholds it. Say how: "No incumbent has published a before-and-after, so prove it on one service first".
- The ten recommendation headings are a flat list of imperatives in conceptual order. Nothing in them tells the reader that 8 must happen before 10, that 10 is where to start, or that 9 is a scoping rule and not an action.
- The last heading pairs the ask with a discouragement: "Begin with one pilot, and expect the programme to take years".
- No heading mentions cost, risk, the decision required, or what the business stops doing.

## 3. Recommendations

### Overall

Weak in form, sound in substance. The 3,044 words under "Recommendations" contain roughly 400 words of recommendation and 2,600 of argument, case study and tutorial. Recommendation 3 is 769 words, of which one sentence is the recommendation. Recommendation 10 is 416 words, of which the pilot gets 78 and OANDA and Azure DevOps get the rest.

The words "owner" and "cost" appear three times each in the whole document; in neither case do they refer to the owner or cost of a recommendation. "Metric", "monitor" and "budget" do not appear at all. A document that recommends releasing "on evidence" never says what the evidence is.

### Each of the ten

| No. | Recommendation | Missing | Recommendation or essay | Note |
| --- | --- | --- | --- | --- |
| 1 | Establish the baseline | Owner, deadline, data sources, form of the output, the threshold that would stop the programme | Recommendation | The closest to actionable. But "the gain will be smaller than this assessment expects" refers to an expectation the assessment never states |
| 2 | Separate deployment from release | Definition of "material", who classifies, flag platform decision, target date for a daily build, size of the "small slice", measure | Half and half | Second paragraph contains the only concrete design in the document (daily build, bake through one peak and one batch window). It assumes production can be sliced, an unstated dependency |
| 3 | Prove each material change in production | Exit criteria per rung, mismatch threshold for the shadow run, who signs each stage, who builds the comparison tooling and at what cost | Essay | The worked example is the best content in the document and belongs in an exhibit. The ladder in the text (shadow, synthetic client, one consenting client) does not match the figure's alt text ("staff, a small cohort, and everyone") |
| 4 | Ramp by client, with consent | Who recruits the client (this is a commercial task, not engineering), on what contractual basis, what the client gets, how many | Recommendation, thin | Duplicates the fourth rung of recommendation 3 and the third sentence of recommendation 10 |
| 5 | Make rollback routine and pre-authorised | Target time to restore, rehearsal frequency, who writes the "written rules", measure | Recommendation wrapped in an essay | The pre-authorisation is a policy change and belongs with 8. RBS is well used |
| 6 | Govern flags | Maximum flag lifetime, registry owner, cap or budget on live flags, audit of stale flags | Essay | 448 words; the recommendation is the fourth paragraph. The culture recommendation is hidden in its last sentence |
| 7 | Give the authoring team the pager | Cost of the platform and training it makes conditional, on-call terms, timing, measure | Recommendation with a non-recommendation attached | "the business should address the question openly and early" is not advice. The platform is a stated precondition and has no recommendation of its own |
| 8 | Rewrite the change policy with risk and audit | Date, named counterpart, the proposed classification | Recommendation | The author's own research report contains a workable classification (ramp plan approved once as a standard change, each step a logged execution, kill switch as emergency change with after-the-fact review). The essay drops it and says "They will need to define what a flag change is" |
| 9 | Keep a pre-production hold where a ramp does not fit | A decision rule, an owner for the classification | Scope note | Three examples and "None of these is a candidate for a ramp". Useful, but it is the exclusion clause of recommendation 2 |
| 10 | Begin with one pilot | Candidate service, team size, start date, success thresholds, decision gate at the end, cost of running the pilot beside the train | The ask, followed by an essay | "A pilot on that scale occupies a small team" is the only resourcing statement in the document |

### Padding

- 9 is a scoping rule.
- 4 is one rung of 3.
- The second half of 6 (Microsoft, culture) is a different recommendation in the wrong place.
- The second and third paragraphs of 10 are evidence for a risk section that does not exist.

### Overlaps

- 3, 4 and 10 each recommend one consenting client going first.
- 5 and 8 both pre-authorise rollback.
- 6 and 8 both define who may change a flag and how it is recorded.
- 2 and 3 both begin "every material change ... behind a flag".
- 1 and 10 both own the six baseline measures.

### What is missing altogether

- Fund the platform. It is named as a precondition in 7 and sized only by anecdote in 10.
- Define the evidence. No recommendation says what signals a ramp is judged on, who builds them, or what stops a ramp. In a payments business that means reconciliation and correctness indicators, which the research report discusses and the essay does not.
- Change the incentives. The Summary calls culture "the difficult part". It has no recommendation.
- Stop something. Nothing is retired, reduced or suspended anywhere in the ten.

### Critical path

The numbering implies a sequence the content contradicts. The real order is:

1. Baseline (1).
2. Choose the pilot service, owner and team; set stop conditions and the end-of-pilot decision (10).
3. Agree the pilot's change policy with risk and audit, including flag changes and pre-authorised rollback (8, half of 5, half of 6). The essay says this must happen "before any code moves", and then numbers it eighth.
4. Build the minimum platform: default-off flags with a register, daily build with production bake, shadow comparison (2, 3, 6).
5. Rehearse rollback and flag-off (5).
6. Recruit the first client (4), which has a lead time set by the client's "own notice periods and sign-off" and should therefore start at step 2.
7. Run the ladder for two quarters and report against the baseline.
8. Decide whether to extend, and only then move the pager (7) and the incentives.

### Is the pilot buried

Yes. It is the tenth of ten, it is absent from the Summary, its heading shares the line with "expect the programme to take years", and its 78 words are followed by 338 words about other companies' bad years. A director who reads the Summary and the first page of recommendations will not learn that the author is asking for one team, one service, one client and two quarters.

## 4. The "so what" test

### Describes without concluding

> "The strongest evidence comes from financial services. In 2021 the Financial Conduct Authority published a review ... Emergency changes, for which some of the normal assurance steps are expedited, led to a new incident 1.5% of the time, although the FCA notes that this may be partly because an incident was already open."

Six statistics, no sentence saying what the directors should take from them, and a final clause that hedges a number whose relevance was never stated. The 1.5% is there to set up baseline question 6 about hotfixes, twelve paragraphs later; the link is never made.

> "Approval should be relocated, not removed. Starling Bank was releasing up to five times a day in 2018 ... In 2025 it still required three approvals for every release, the last of them a 'Business Approval' from an engineering lead, director or executive, while releasing several times a day."

Good first sentence, then a description of Starling that stops. So what should this business's approvals be?

> "Flags are cheap to add and expensive to keep. ... Chrome's flags grew from 263 to 1,040 over the releases examined in one study, and Uber eventually built a tool to delete stale flags, which removed 1,381 of them."

Ends on two counts with no denominators and no implication. (The report has Uber's denominator: about 7,982.)

> "Knight Capital shows what a neglected flag can do. ... A Google Cloud outage in June 2025 had the same shape: code rolled out region by region, never exercised, and then triggered everywhere at once by a policy change."

The paragraph reaches its point ("Time in production proved nothing about a path that was never exercised") and then walks past it to end on a second anecdote.

> "Some changes should stay on the present model. ... None of these is a candidate for a ramp."

A list. No rule for deciding the next case, and no owner for the decision.

> "A fix completed on a Wednesday morning reaches clients in the following week. ... The interval is the same for a corrected label as for a change to the routing of outbound payments."

The observation is sharp. The so-what (the model cannot price risk, so it charges every change the maximum) is left to the heading, and the cost is never multiplied by anything.

### Concludes without evidence

> "The cost is larger than the calendar time suggests. Finished work sits idle, and the engineer who wrote it has moved on by the time production shows whether it was right. Work larger than a few days is held on a branch that diverges from everyone else's ..."

Stated as fact about this business. The author has seen none of it.

> "The promotion period is not idle time to be trimmed. In a payments business it contains integration packs ... These are real classes of fault, and shortening the soak means ceasing to look for them."

"In a payments business" gives the game away: this is what such periods generally contain. Whether this soak finds these faults is baseline question 2.

> "Firms that have measured these effects report them plainly. ... A schedule that penalises missing the train puts on board the changes that should have missed it."

The evidence is LinkedIn's monthly release and Facebook's release cut. Missing a monthly train costs a month. Missing this train costs three and a half days. The inference to a twice-weekly schedule is not argued.

> "They develop substantially faster, and the best available evidence, including the UK regulator's, indicates that they do so without loss of stability."

The document contains no measurement of anyone developing faster. The stability half is supported; the speed half is asserted.

> "Every material change should be written so that its new behaviour sits behind a flag that is off when the code ships. Deployment then becomes frequent and uneventful, because it changes nothing a client can see."

The next paragraph explains why this is false for library upgrades, drivers, runtimes and schemas. The first paragraph should not claim it.

### Ends on a generality or an aphorism

> "The practice depends on leadership that holds its course after a failure."
>
> "None of the accounts I read gives figures for how roles changed, and the business should address the question openly and early."
>
> "Surviving the week had become a substitute for evidence."
>
> "The difficult part is the change in working practice it requires of engineers, managers, risk and audit, and the programme should be planned as a change of culture."
>
> "The business should do the same thing routinely, for ordinary changes, with tooling that makes it cheap."
>
> "A pilot on that scale occupies a small team."

The closing aphorism is this draft's signature tic. It gives a paragraph the sound of a conclusion without giving the reader an instruction. In a client document the last sentence of a paragraph is where the implication for the client goes.

## 5. Authority

### Where it sounds like someone who has done this

> "The choice of rail is made once, when the payment is accepted, and is stored on the payment, so that every later event in that payment's life follows the stored choice and not the current position of the flag."
>
> "Where money is involved, the shadow run is the decisive control, since a flag can reverse a decision and cannot reverse a payment."
>
> "What is restored should be the previous build exactly as it ran, retained under its hash, and never a fresh build from older source."
>
> "The old path, which is the fallback, ceases to be exercised on the day the flag reaches every client, so that switching it off thereafter is an untested change."
>
> "Auditors, however, test a firm against its own change policy, and that policy describes the process the firm has today."
>
> "Three releases would be in promotion at any time, requiring three sets of environments and three times as many partner test windows."
>
> "A new settlement file reaches a counterparty whole, at a cut-off, and cannot be sent to one percent of them"

These are specific, mechanical and unhedged. They are also uncited, which is the point: nobody needed a footnote to write them. The rail-routing example and recommendation 9 are where the author stops reporting and starts advising.

### Where it sounds like a reading summary

> "I have found no bank or payments firm that has published its incident record ..."
>
> "None of the accounts I read gives figures for how roles changed ..."
>
> "The rule texts I have read ask for ..."
>
> "The wider programme is a larger undertaking, and the published accounts are consistent about that."
>
> "Microsoft's Azure DevOps group gives the most candid account of the duration."
>
> "The engineers who documented the experience report that ..."
>
> "Firms that have measured these effects report them plainly."
>
> "Google's reliability handbook states the constraint exactly"
>
> "This assessment rests on the release model as described and on the published record of firms that have replaced it."

The first person appears five times in the document. Four of the five are about what the author read or failed to find. A consultant's "I" is attached to a judgement ("I would not start with the payment gateway"); this "I" is attached to a bibliography. There are 28 footnotes and not one sentence that begins from experience. The evidence base is Amazon, Facebook, Google, Netflix, Uber and Microsoft, and every engineering director's first response to that list is "we are not Facebook". Finding 6 anticipates the objection honestly, but honesty about a gap is not the same as authority.

### What a practitioner would say that this does not

I am listing categories, not supplying figures. Where the author's own report has the material, I say so.

- Where the client stands. Nothing compares twice-weekly-plus-three-days with any external band. The report notes that placing it between the survey's "high" and "medium" groups is an inference; an expert would make the inference and label it.
- What goes wrong in month three. The pilot team runs two processes and the train wins every scheduling conflict. Flags ship without removal dates because removal is nobody's sprint goal. The shadow comparison produces mismatches that are mostly benign and someone has to triage them daily. Automated checks cry wolf: the report has Meta's figure that health checks fired on 11.5% to 41.3% of deployments a human then let proceed. None of this is in the essay.
- The first incident. The OANDA episode is told as history. An expert would turn it into a pre-agreed protocol: before the pilot starts, the directors agree in writing what they will not do after the first flag-related incident.
- What the evidence for a ramp is. In payments the signal is reconciliation and correctness, not availability, and it arrives a day or more late. The report says this ("an availability ratio does not express a ledger error"; Stripe's verification horizon is four days). The essay asks for release "on evidence" and never names a metric.
- What the supervisor will think. The report records that MAS ordered DBS to suspend all changes for six months, and concludes "The argument that lands with a supervisor is failure rate and blast radius per change, with evidence; it is never speed." The essay's title and Summary lead on speed.
- Which rule books apply. The essay never states the business's jurisdictions. The report flags that the EU's technical standards appear to permit testing in production only as an approved, time-limited exception (a paraphrase that needs checking). "Real money at a synthetic client in production" is exactly the practice that clause would touch.
- What the CFO asks. How many people for how long; what the platform costs; what running pilot and train together costs; whether production capacity must grow (the report notes keeping an old version warm costs "twice as many resources"); when the benefit shows up in something countable. The essay answers none of these.
- What to stop doing. No ceremony, environment, sign-off or report is retired anywhere in the document. A programme that only adds work will be read as only adding work.
- The commercial work. Recruiting a client bank to go first is a negotiation with its own lead time and its own price. The essay treats it as a sentence.

## 6. Quantification

### The size of the prize as stated

- "roughly five days of delay on every change regardless of risk" (mean about 4.75 days, worst case seven; the arithmetic is sound).
- "They develop substantially faster."
- "a build is in production within a day of being cut ... and carries one day of changes where a train carries half a week's".
- Against that: the ramped change "reaches every client later under this model, perhaps by several weeks", and Amazon's pipeline takes "four or five business days".

So the stated prize is an adverb. The derivable prize is three changes in lead time, which the essay never sets side by side:

| Measure | Today (from the essay) | Recommended model (from the essay) |
| --- | --- | --- |
| Finished to running in production | About 5 days, up to 7 | Within a day of the build being cut |
| Finished to first production evidence | About 5 days | "the day after writing it" (shadow run) |
| Changes per release | Half a week's | One day's |
| Risky change, finished to every client | About 5 days | Later, "perhaps by several weeks" |

That table is the prize, honestly stated, and it should be in the Summary.

### What a partner would insist on, and where it can come from

Numbers the evidence can honestly supply now:

| Number | Source in the report | Caveat to carry |
| --- | --- | --- |
| 1.6% of all changes failed, 3.8% of major changes; boards approved over 90% | FCA 2021, read directly | Association; already in the essay |
| Nearly 68,000 major changes in the sample; change caused 17% of incidents reported to the FCA and 24% of firms' high-severity incidents | FCA 2021 | The 17% and 24% appear only in a figure's alt text, never in the essay's prose |
| 16 days check-in to production, almost 14 waiting | Amazon, Mansour | Old, undated; use as the hypothesis the baseline tests, not as a finding |
| Platform teams of about 5% of engineers (Facebook) to 15% (OANDA); two years at OANDA | Savor et al. | The essay quotes only the 15%. The 5 to 15% range is the only honest cost bracket available |
| Roughly 16% of 12 yearly releases failing, against under 1% of about 2,500 | Financial Times, Wells 2019 | One speaker, her own definition, not a payments firm. Still the only before-and-after in the file, and the essay omits it |
| Median fix time 16 days to 6 after moving to rapid release | Firefox, Khomh et al. | Not finance |
| 79% of guardrail movements seen within three days, the rest by day seven | Microsoft Office, Xia et al. | The only time-to-signal data found; sizes the length of a ramp stage |
| About 100 million comparisons for six nines, a little over a day at 1,000 records per second | Uber 2024 | Sizes the shadow run; lower volumes take longer; relayed quotation, re-check |
| Rollback durations: about five seconds (Wealthfront), 8 to 12 hours falling to ten minutes (Salesforce), 45 minutes to find the flag (Azure DevOps) | Report section on rollback | Different mechanisms; use as the range the business's own figure will be compared with |
| Flag debt: 263 to 1,040 (Chrome); 1,381 removed of about 7,982 (Uber) | Rahman et al.; Piranha | Print the denominator |
| Health checks fired on 11.5% to 41.3% of deployments that a human let proceed | Meta Conveyor | The false-alarm cost of automated gates |
| Cost of failure: more than $460 million in about 45 minutes (Knight); £42 million fine (RBS); £48.65 million in fines and £32.7 million redress (TSB) | SEC order; FCA final notices | Knight is in the essay; the fines are not |
| Respondents 2.6 times more likely to be low performers where an external body approves changes | DORA 2019 | Self-reported survey association; no interval |
| Durations of culture change: five years (Google testing culture, Atlassian), two months of halted feature work (LinkedIn), more than two years of test rebuilding (Azure DevOps) | Report section on platform investment | Sizes "years" |

Numbers that must be framed as "to be established in the baseline", because only the business has them:

- Changes per train and per year, and engineers affected. Without these, five days is a duration, not a cost.
- Share of the three days that is work and share that is waiting.
- Faults caught by the soak last year, by class, and faults that escaped it.
- Change failure rate, for comparison with the FCA's 1.6% and 3.8%.
- Change board rejection rate, for comparison with the FCA's "over 90%" approved.
- Time taken by the last real rollback, and whether it was rehearsed.
- Hotfix share of changes and hotfix failure rate, for comparison with the FCA's 1.5%.
- Changes per release behind each recent incident and time to isolate the cause.
- Cost of environments and partner test windows.
- Number of clients, their notice periods, and how many would volunteer.
- Pilot team size and platform cost in the business's own headcount.

Numbers nobody can supply, which the document should say plainly and once:

- Incident rates before and after a bank or payments firm left release trains. The essay says this.
- Faults found per day of soak, or detection rates for canaries. The report says nobody has published either; the essay does not mention it.
- A measured gain in development speed. No source in the file measures one. "Substantially faster" should be replaced by the lead-time table above or deleted.

## 7. Sentence-level prose

### What is wrong with the register

The second rejection was for sentences fit for a child. This draft answers by making every sentence a calm, balanced, medium-length statement in the same voice, with "should" as the only verb of recommendation and "the business" as its only subject (17 times). It reads like a good broadsheet leader. Consulting prose differs in three ways: the subject of the sentence is a named actor, the verb is an action with a date, and the sentence ends on a number or a consequence for the client. The draft's sentences end on reflections.

### The twenty weakest sentences, with rewrites

Bracketed items are placeholders for facts the document does not have.

1. Original: "The recommendations in the second half of this document are specific, and three matter most."

   Rewrite: Delete. Then: "Two decisions are needed now: a baseline and a pilot."

2. Original: "This assessment finds that the model is sound on safety and expensive on speed: it imposes roughly five days of delay on every change regardless of risk, it forces changes into batches, and it cannot be made faster without weakening the protection it exists to provide."

   Rewrite: "The train makes every change wait about five days, batches half a week of unrelated work into each release, and cannot be sped up without cutting the soak."

3. Original: "They develop substantially faster, and the best available evidence, including the UK regulator's, indicates that they do so without loss of stability."

   Rewrite: "Their code reaches production within a day, and the FCA's data on 23 firms shows smaller, more frequent releases failing less often, not more."

4. Original: "The tooling for all of this is well understood."

   Rewrite: "The tooling is the smaller cost; OANDA still put about 15% of its engineers on it."

5. Original: "The difficult part is the change in working practice it requires of engineers, managers, risk and audit, and the programme should be planned as a change of culture."

   Rewrite: "Three groups change how they work: authors plan each change's off state and removal, the owning team carries the pager, and risk and audit approve a ramp plan once instead of a release each time."

6. Original: "This assessment rests on the release model as described and on the published record of firms that have replaced it."

   Rewrite: "We have not yet seen the business's change and incident records. Every figure about the business in this document is arithmetic from its release calendar."

7. Original: "The cost is larger than the calendar time suggests."

   Rewrite: "Five days is the visible cost. The larger ones are late feedback, long-lived branches and releases too mixed to diagnose."

8. Original: "Firms that have measured these effects report them plainly."

   Rewrite: Delete. Start with the measurement: "At Amazon, code took 16 days from check-in to production and waited for almost 14 of them."

9. Original: "The promotion period is not idle time to be trimmed."

   Rewrite: "Do not shorten the soak. It looks for faults that no short test reaches."

10. Original: "Within the present model, then, speed and safety do trade against each other, and the business has correctly chosen safety."

    Rewrite: "Inside this model the business can have speed or safety, and it chose safety."

11. Original: "The assumption is not necessary."

    Rewrite: "They need not be the same event."

12. Original: "These are associations, and they should be read with care."

    Rewrite: "These are associations, with three limits." Then state the three, as the next sentence already does.

13. Original: "Two further cases complete the picture."

    Rewrite: Delete. Give each case its own claim: "Volume need not raise incident counts" and "A long hold can decay into waiting".

14. Original: "The evidence therefore establishes that small, frequent and carefully exposed change is compatible with the stability a financial firm requires, and that the regulator's own data favours it."

    Rewrite: "So the evidence shows the approach is safe enough for regulated firms that move money. It does not show what this business will gain."

15. Original: "The answers will show how much there is to gain and will provide the benchmark against which every later step is judged."

    Rewrite: "The six answers size the prize and become the pilot's scorecard."

16. Original: "If the soak proves to be catching faults that nothing else would, and most of the three days proves to be work, the gain will be smaller than this assessment expects, and the business should know that before it invests."

    Rewrite: "If the soak is catching faults nothing else would, and the three days are mostly work, stop here: the case is weaker than we have argued."

17. Original: "Release remains a deliberate act, applied to one behaviour at a time and to as few clients as the business chooses, and can be more careful than it is today."

    Rewrite: "Release becomes more careful than today: one behaviour, one client, one stage at a time."

18. Original: "Amazon's pipeline places each build on a single machine, then in one region, then outward in waves, holding at each stage for at least one to twelve hours and until a minimum volume of real traffic has been served, and rolling back automatically if an alarm fires."

    Rewrite: "Amazon puts each build on one machine, then one region, then the rest in waves. Each stage holds for between one and twelve hours and a minimum volume of real traffic, and rolls back by itself on an alarm." ("At least one to twelve hours" is not a quantity.)

19. Original: "The business should do the same thing routinely, for ordinary changes, with tooling that makes it cheap."

    Rewrite: "Build the comparison tooling once, in the pilot, so that a shadow run costs a team [hours, to be set], not a project."

20. Original: "None of the accounts I read gives figures for how roles changed, and the business should address the question openly and early."

    Rewrite: "Tell testers and release managers before the pilot starts what their work becomes: building the comparison tooling, owning the pipeline, reviewing ramp plans."

Five more that nearly made the list:

- "The business should therefore treat rollback as an ordinary operation." Rewrite: "Rehearse rollback on a schedule and let the on-call engineer do it without approval."
- "A pilot on that scale occupies a small team." Rewrite: "The pilot needs [n] engineers for two quarters."
- "The wider programme is a larger undertaking, and the published accounts are consistent about that." Rewrite: "The full programme takes years. OANDA took two for its trading systems alone."
- "The practice depends on leadership that holds its course after a failure." Rewrite: "Agree now what the directors will do after the pilot's first incident, because the instinct will be to add approvals."
- "This is more work per change than a train requires, and it obliges engineers to plan for being wrong." Rewrite: "Each change costs its author more: a flag, a defined off state, a shadow comparison and a removal."

### The pattern in the rewrites

- Imperative or named actor in place of "the business should".
- A number or a named thing at the end of the sentence in place of a reflection.
- No sentence about the document ("this assessment finds", "an example shows", "as recommended below").
- No sentence about the reading ("the accounts I read", "published accounts are consistent").
- One claim per sentence where the original balances two with "and".

## 8. The Summary, rewritten

Under 250 words, using only facts in the document.

> The release train makes every change wait about five days, and up to seven, whether it corrects a label or reroutes payments. The wait cannot be cut inside the present model, because deploying code and releasing behaviour are one event and the caution has to cover the whole release.
>
> Separate the two. Ship a build every day with new behaviour switched off, and bake it on a small slice of production through one peak and one batch window. Release each material behaviour on its own: shadow run, synthetic client, one consenting client, then wider. Make rollback a rehearsed action the on-call engineer takes without approval.
>
> Ordinary changes then reach production within a day. A risky change reaches every client later than today, perhaps by weeks, and no client meets an unproven rule. The FCA's review of over a million changes at 23 firms found that smaller, more frequent releases succeeded more often.
>
> Two decisions are needed. Commission a baseline of six measures from the business's own change and incident records, which this assessment has not used. Then run a two-quarter pilot on one wholly owned service, with one volunteer client, a change policy agreed with risk and audit before any code moves, and stopping conditions set in advance. The train keeps running throughout.
>
> The full programme takes years. OANDA spent two and put about 15% of its engineers on tooling. No bank has published its incident record before and after, so the pilot must supply the business's own.

## 9. Revised skeleton

### Title

Release each change on its own evidence: a baseline and a two-quarter pilot to take five days out of ordinary changes without loosening control

### Governing thought

The train makes every change wait about five days because it can only release everything at once. Deploying daily with behaviour off, and releasing each material change client by client on production evidence, gets ordinary changes to production in a day and exposes risky ones more cautiously than today. The directors should approve a baseline and one pilot, and let the pilot's figures decide the rest.

### Section action titles

1. The train charges every change about five days and half a week of batching, whatever its risk.
2. The delay cannot be cut inside the model, because deployment and release are one event.
3. Regulated firms that release small changes to few clients fail less often, though no incumbent has published a before-and-after.
4. Deploy daily with behaviour off, and release each material change client by client behind a rehearsed rollback.
5. Start with six baseline measures and a two-quarter pilot on one service; its results decide whether the train retires.
6. The programme takes years and a standing platform team, and it fails in three known ways: approvals added after the first incident, flags never removed, and ownership handed over before the tooling exists.

The worked routing example, the Knight and RBS accounts and the Uber shadowing account move to exhibits referenced from sections 4 and 6.

### Recommendations, regrouped and sequenced

Measures marked "baseline" take their target from recommendation A1.

A. Decide and measure (before the pilot)

1. Answer the six baseline questions from the business's own records. Measure: all six answered, with sources, by [date].
2. Name the pilot service, its owning director and its team. Measure: a service with no vendor package or mainframe component in its path, chosen by [date].
3. Set the pilot's stopping conditions and the decision it feeds. Measure: written, and signed by the directors, before any code moves.

B. Make it permissible (before any code moves)

1. Rewrite the change policy for the pilot service with risk and audit as co-authors. Measure: flag change defined (who may make one, who approves, how its state on a date is evidenced, what counts as an emergency); named approvers kept.
2. Pre-authorise rollback and flag-off for the on-call engineer, with written exceptions for cut-off windows and messages already sent. Measure: authority recorded in the policy.
3. Fix the list of changes that stay on the train: ledger schema changes, new settlement files, scheme mandates, client-visible interface changes. Measure: a decision rule and an owner for classifying the next case.

C. Build the mechanism (pilot, first quarter)

1. Ship every material change behind a flag that is off, with an owner, a purpose, a ramp plan with stop conditions and a removal date; never reuse a flag. Measure: every live flag has all five; none past its removal date.
2. Cut a build daily and bake it on a slice of production through one peak and one batch window. Measure: finished-to-production time, against baseline.
3. Build the shadow comparison. Measure: a shadow result within a day of a change shipping.
4. Rehearse rollback to the retained build and flag-off, on a schedule. Measure: time to restore, against baseline question 5.

D. Prove it (pilot, both quarters)

 1. Recruit one client to go first, and start the conversation at step 2. Measure: consent recorded before the first ramp.
 2. Take each material change up the ladder: shadow, synthetic client, one client, wider, each money-moving stage held for a settlement cycle. Measure: changes released by ladder; incidents; time to identify cause, against baseline question 3.

E. Decide and extend (after two quarters)

 1. Report the pilot against the six baseline measures and decide whether to add services. Measure: the decision set in recommendation 3 is taken.
 2. Before extending, fund the platform and training, then move deployment and the pager to authoring teams. Measure: platform funded before any team takes the pager.
 3. Change what code review asks for, what counts as finished and what performance review recognises. Measure: flag removal and shadow comparison are in the definition of done.

## 10. The ten changes that matter most

1. Put the ask in the first paragraph. Two decisions, baseline and pilot, with the pilot's scope, duration and client. Remove "three matter most".
2. State the prize honestly and in numbers. Use the four-row lead-time table: ordinary changes in a day, evidence in a day, one day's batch, risky changes later than today. Delete "substantially faster".
3. Stop presenting deductions as findings. Either run the baseline first and call this an assessment, or call it a proposal. Remove "sound on safety" and fix the contradiction between Finding 3 and baseline questions 1 and 2.
4. Rebuild the ten recommendations as a sequenced plan in which each line has an owner, a deliverable, a date and a measure. Policy before code. Pilot first, not tenth.
5. Add cost. Pilot team size, the 5 to 15% platform range from the evidence, the cost of running train and pilot together. Add the missing recommendation to fund the platform.
6. Add a risk section. The first-incident reflex, flag debt, ownership without tooling, noisy automated checks, the supervisor's bias towards less change. For each, the mitigation agreed in advance.
7. Define the evidence a ramp is judged on. Reconciliation and correctness signals, stop conditions, who builds them. "On evidence" is the title's promise and has no content.
8. Move the case studies out of the recommendations. Each recommendation under 120 words; the routing example, Knight, RBS, Uber, OANDA and Azure DevOps become exhibits.
9. Give culture its own recommendation or stop calling it the difficult part. The levers exist in the last sentence of recommendation 6; promote them, and say what the business stops doing.
10. Change the grammar. Imperatives and named actors for "the business should"; delete every sentence about the document or about the author's reading; end paragraphs on the implication for the client, not an aphorism. Fix the Finding 5 heading, the ladder figure that contradicts the text, and the subtitle set as a section heading.
