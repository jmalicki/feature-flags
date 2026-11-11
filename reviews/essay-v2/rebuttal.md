# Adversarial rebuttal of "Stop soaking, start ramping", and what survives it

This review has two parts. Part A is the reply an experienced, unsentimental engineering director at a payments or core-banking firm would send to everyone who received the essay. Part B steps out of role and sorts the director's points into those the essay must concede, those it can answer, and those that rest on beliefs the director has never measured.

The director's estate details in Part A (client count, what the three days contain) are a plausible persona, not facts about any real firm.

## Part A: the reply-all

Subject: Re: Stop soaking, start ramping

All,

I am replying to everyone because it went to everyone, and I would rather settle it here than lose a quarter to it.

I am not defending the calendar. I have read Accelerate and the SRE books, and we use toggles where they suit. My objection is that the essay asks me to replace a control whose record I know with one whose record, at a firm like ours, nobody has published. It says so itself.

On evidence, read the last page first. "No bank or payments firm has released incident figures from before and after it left release trains." "No firm has published what an examiner or external auditor concluded." "No firm with a mainframe core has published how it took a release train off its money-moving systems." Those three sentences are the question. Everything before them is adjacent: a social network's chat feature in 2008, a newspaper whose failed release is a late article, and banks built last decade with no estate to migrate. The sources are blogs and conference talks, and the essay's own footer admits "they favour success stories". Firms that tried this and quietly went back do not give talks.

The FCA review is the one serious source, and it does not say what it is used to say. It compares firms like us with one another; none of them is being compared on flags versus soak. Major changes fail more often because they are major; that is why they were classed that way. A board that approves 90% of what reaches it may be working, because what would be rejected is not submitted. And the essay concedes that self-described DevOps firms "had a slightly higher failure rate" and that the FCA "warned that frequent release is not the answer for every firm". I believe I am the firm they meant.

On mechanism, a ramp is a statistical instrument. It needs volume and interchangeable units. I have a few dozen clients, each a bank, each configured differently, and flows that carry a handful of large payments a day. The essay: "A 1% ramp tells you little about a flow of a few large payments a day. Nothing published says how to ramp one." That is the business. Meanwhile every flag is a second code path in production, and nobody tests the combinations. The essay's own failure list is a list of firms doing the new thing: Knight (a flag), Google, CrowdStrike, Cloudflare, and 45 minutes at Microsoft working out how to turn a flag off. All are filed under "doing it halfway". A method that is only ever failed by its practitioners and never by itself is not making a claim I can test.

On money, "a mistake is corrected by a new entry". Here, that new entry is a client incident, a breach notice and possibly a regulatory report. One bank receiving wrong payments is not a small incident because it was the first cohort. Which client do I tell it is the canary? Their contracts carry notice periods and their own acceptance testing, which the essay concedes and walks past. On period-end jobs: "Almost nothing... That advice is assembled from neighbouring evidence." On settlement holds: "No source states the rule, but it follows." On the EU standards: "as read in summary for this essay". I am being asked to stake my regulatory standing on a rule the author read in summary, and which, on the author's own account, treats testing in production as "an exception to be justified, approved and time-limited". "None of the texts requires a soak" is true and beside the point. They require that I can show an examiner why I believed a change was safe.

On cost, the essay says "Fund the platform, and expect years." Five to fifteen per cent of engineering; two years at one firm, five at another. No figure for us, nothing on what stops shipping meanwhile, on running both processes in parallel, on on-call contracts for developers, or on segregation of duties when the author holds both the pager and the switch.

On our process, the essay describes a release that sits "under test traffic, to see whether anything degrades". That is not what we do, and the author does not know what we do: step one of the plan is "Measure your three days." The verdict is in paragraph one and the measurement is on the last page. Our three days hold a regression pack, a full end-of-day cycle with reconciliation, scheme simulators, and sign-off by people independent of the developers. Some of it is waiting. Neither of us knows how much.

On tone: "You are behind, and that is an advantage." It then explains to engineering directors what a feature flag is, what a canary is, and that the Financial Times is a newspaper. "This is the test of a management team." A third of it is technology-company history I have seen in every vendor deck since 2015, and conversion experiments are not my problem.

What would change my mind: one firm with our kind of estate, with numbers before and after and its auditor's letter. Failing that, a proposal for one service, costed, saying what we stop doing to pay for it and what result would make us abandon it. Send that and I will read it. Until then, twice a week stands.

## Part B: analysis, out of role

### 1. Points that are correct and unanswerable on the available evidence

The essay must concede or narrow on each of these. The synthesis report already concedes most of them; the essay buries them on its last page while asserting "better overall" on its first.

| Director's point | Why it stands | What the essay must do |
| --- | --- | --- |
| No before-and-after data from a bank, no incumbent's account, no auditor's verdict | The report: "No source measures change-failure rate, incident counts or money lost before and after a payments firm or bank moved from release trains to ramped delivery." "No study compares soak-and-train regimes with canary-and-flag regimes on outcomes in any industry." | Stop saying "better overall" as a finding. Say "compatible with stability at regulated firms, and associated with higher change success in the regulator's data". |
| Survivorship in company accounts | The report: "Absence of reported reversals to QA gates is weak evidence, because blogs and talks select for success." | Move this from the footer to the front, and lean on sources that are not self-selected: the FCA review, SEC and FCA enforcement documents. |
| The FCA review is correlational and partly confounded | The report: "correlational, publishes no effect sizes for the frequency finding, does not recommend abolishing change boards". "Major" changes are riskier by classification, so 3.8% against 1.6% cannot by itself show that oversight fails. | Use the FCA data to shift the burden of proof, not to prove the case. |
| Low-volume, high-value flows cannot be ramped statistically | The report: "No one has published... ramp design guidance for low-volume, high-value transaction systems." | Say plainly that for these flows the proposal is shadow comparison and a named first client, not a percentage. |
| Period-end batch | The report calls it "the weakest-evidenced area and the best surviving argument for a hold". | Keep the hold for these jobs and say so early. |
| The essay does not know what the reader's three days contain | Step 1 of section 10 is "Measure your three days", yet section 1 already concludes "you should replace it". The opening describes soak as sitting "under test traffic, to see whether anything degrades", which is a caricature of a process that probably includes regression, an end-of-day cycle and independent sign-off. | Reverse the order: measurement first, verdict conditional on the result. |
| Cost and timeline for the reader's estate | The essay gives others' percentages (5%, 15%; two years; five years) and nothing on what is displaced, on dual running, on on-call terms. No source supplies this. The report: "nothing documents changes to performance review, promotion or pay made to support the transition." | Admit it cannot cost the programme, and propose a first step cheap enough not to need costing. |
| Regulatory risk is unresolved, not absent | DORA RTS Art. 8(2)(b) permits testing in production only as an "identified, reasoned, time-limited and approved" exception (paraphrased by a fetch tool; the essay admits "as read in summary"). The report: "No text read says whether an automated gate may substitute for a human approver, and none mentions feature flags." | Do not present "no rule requires a soak" as clearance. Read the RTS at source before printing. |
| Caution buys something | The report: DORA 2018's "misguided performers", who release rarely and test heavily, "did achieve a better change-failure rate than low performers". Yuan et al.: 77% of sampled catastrophic failures reproducible by a unit test, which "argues against the claim that pre-release testing is futile". | Stop implying pre-production time is worthless. The claim is about the batch and the idle time. |
| "Halfway" is unfalsifiable as framed | Section 9 attributes every failure to incomplete adoption. The report is more careful: "there is no controlled comparison either way". | Reframe section 9 as preconditions the reader can check, and drop "None of these is a reason to keep the release train." |
| Experiments are off-topic for this reader | The report: "Published experiments at financial firms are overwhelmingly on interfaces, support, communications and payment-optimisation settings." | Cut section 4's experiment material to a paragraph or remove it. |

### 2. Points that are answerable, with the strongest honest answer

#### These are web companies

The answer is the money-moving and regulated cases, stated with their limits.

- OANDA and its bank licensees ran the same code under two regimes. The notes: the banks' "policies did not allow continuous deployment"; bugs deemed non-critical went unfixed "for many months" and each release bundled "thousands of changes". The report grants it is "qualitative and written by insiders, but it describes the reader's situation exactly".
- Uber's payments group could not "call a PSP's endpoint twice", so it replayed recorded responses and found "dozens of argument mismatches" before any user exposure.
- Incumbents exist in the notes but not in the essay. Capital One's pipeline has sixteen gates that include "automated rollback; automated change order; zero downtime release; feature toggle", and its governance director, a former auditor, wrote "We've worked with our auditors and risk compliance office". IG, a trading firm, described "deploy to a 'dark' environment, automated tests, a manual stop, then 'Flip dark to light'" at "1-3 deploys per week during core hours". These are executive or slide-level accounts, and the essay should say so, but IG in particular looks like the reader, not like Facebook.

#### You want to take away my controls

This is the director's strongest misreading and the essay invites it with the word "replace".

- The report: "None of the exemplars deleted pre-release controls." Amazon "kept alpha, beta and a production-like gamma stage".
- "every regulated firm that has published its design kept named human approvers". Starling in 2025 required three approvals including a business approval that "is here to manage our overall risk as a regulated bank".
- Amazon's adoption instruction was to "encode their current release process, manual steps and all, in a pipeline". No control is removed on day one.
- The reformist position predates the abolitionist one: Humble in 2010 argued ITIL's own "standard changes" permit this and that "Face-to-face CAB meetings serve an important purpose".

#### Ramps are reckless speed

The report's correction table: "Ramps are faster than a three-day soak" is false. "Amazon's default is four to five business days to all Regions... The gain is exposure control and small batches, not elapsed time." The honest message of the ramp figure is "that leaders wait as long or longer, in production". The essay says this in section 2, but its title and first paragraph say the opposite.

#### Money is not reversible

The essay already answers this well; the answer needs to come earlier. Beck's carve-out is quoted. The report separates three reversibilities: "The routing decision... is reversible in seconds to minutes. Internal ledger state is correctable by compensating entries... Externally settled money is not reversible by the firm alone, so the techniques aim to keep that exposure small." And the bank-native precedent is the parallel run: the Basel II draft rule required "at least four consecutive calendar quarters". Shadow comparison is something the director already believes in under another name.

The director's line that one wrong client "is not a small incident" is answerable too: the comparison is not one client against none, it is one client against all of them on the same morning, which is what the train delivers.

#### Flags add untested paths; Knight was a flag

Concede the first half. The report's own limits column says "Both states must be tested; flags outlive their purpose... the off state is often untested when needed". Then use the SEC order, not the legend: deployment was "in stages by placing it on a limited number of servers in SMARS on successive days", the reused flag guarded code unused since 2003, and "Knight did not have a second technician review this deployment". The report: "it does not argue against four-eyes review, which the SEC faulted Knight for lacking." A soak would not have exercised the path either. The honest position is that flags are a liability that must be managed (default-off, exercised deliberately, removed), and that the release train carries its own untested combination, which is the batch.

#### My clients will not accept being a canary

The client is the documented ramp unit in payments, by consent. The report: Stripe "pins each account to an API version"; Adyen tests "through 'early adopter' merchants"; Nubank "moved one shard of about 20 customers first". The boundary is clean: "external interface changes are calendar-bound by rule or by counterparty; behaviour behind a stable interface is not." Most vendors to banks already have a pilot client for major versions. The essay should ask the reader whether they do.

#### The examiner will not accept it

Partly answerable. The FFIEC 2024 booklet describes canary release as sending "a limited amount of traffic" to a new version, and says routine modifications, "Sometimes referred to as standard changes", "are often implemented with automation". The EBA amended its guidelines to say they "intend to be technology and methodology agnostic". MiFID II RTS 6 already contains the asymmetry the essay wants: a firm must "be able to cancel immediately, as an emergency measure"; in the report's words, "turning exposure up is controlled, turning it off must be immediate". What cannot be answered is the verdict: "Acceptance is implied by continued operation under supervision, not documented."

#### A board approving 90% may still deter bad changes

Plausible, and unmeasured in either direction. The FCA's own wording is that the approval rate "raises questions over the effectiveness of CABs as an assurance mechanism", and major changes failed more "despite the increased oversight". The DORA 2019 survey found "no evidence" that formal approval lowers change failure, which the report rightly labels as association with live reverse causation. The honest answer is not "your board is theatre". It is "you do not know, and you can find out" (see section 3).

#### Batch size

This is the essay's best mechanism and the rebuttal never engages it. A twice-weekly train with three days of promotion necessarily bundles several days of work. The notes: "the release train's safety benefit has an offsetting cost that the soak does not remove." Facebook found code pushed on release-cut day "is of lower quality"; Mockus and Weiss found larger, more diffuse changes fail more often across about 15,000 changes; the FCA found smaller, more frequent releases "had higher change success rates". One unused data point belongs here: in the FCA data, "on average, 1.5% of emergency changes resulted in a new incident", against 1.6% of all changes. Emergency changes get the least ceremony and are the smallest, and they failed no more often.

### 3. Points that rest on a weak belief, and how to get the director to test it

Telling this reader a belief is wrong produces the reply-all. The effective move is to ask for a number from their own records, ask them to write down a prediction first, and state in advance which result would count against the essay. Each belief below is paired with the measurement that tests it.

#### Belief: three days in pre-production is evidence

Netflix's phrase for this was "verifying endurance". The report: "no one has published defect yield per day of soak". That cuts both ways, so the reader should produce the figure.

- For every defect found in pre-production over the last twelve months: on which day of the three was it found, and by what (a scripted test, a person exploring, or elapsed time alone)?
- Of the three days, how many hours is the release being actively tested, and how many is it waiting for a person, a window or a meeting? Amazon's answer was almost 14 days of 16.
- Of your last ten production incidents caused by a change, how many releases had passed the full soak? (All of them, by construction.) For each, would a fourth day have caught it? Would anything in pre-production have caught it, or did it depend on production data, configuration, volume or one client's setup?
- Does your soak cross a month-end? If not, it does not test the case most often cited in its defence. The report: "month-end, quarter-end and leap days fall outside most three-day windows."

Falsifier to state in the essay: if most pre-production defects are found on days two and three by elapsed time, the soak is earning its keep and the essay's argument weakens.

#### Belief: our incident record vindicates the process

The record has no counterfactual, and it is usually counted per year, not per change.

- What is your change failure rate per release, and per change inside a release? How does it compare with the FCA's 1.6%?
- How many changes were in the release behind your last major incident, and how long did it take to identify which one was at fault?
- What is the failure rate of your hotfixes and emergency changes, which skip most of the three days, against your scheduled releases?

#### Belief: the change board is assurance

- How many changes did the board reject or send back last year, out of how many? How long does each change get in the meeting?
- Of the changes that caused incidents, how many did the board approve?
- If the board's value is deterrence, what was withdrawn before submission, and is that recorded anywhere?

#### Belief: we can roll back

The essay's own best line applies: "Far too many think they have safe rollbacks, only to learn otherwise during an outage." RBS "had only tested the consequences of backing out Version 2 to Version 1".

- When did you last roll back a production release? How long did it take from decision to completion, who had to authorise it, and how long did finding that person take?
- Was that rollback path rehearsed against the version actually running, including its data and schema changes?
- In your last five incidents, did you roll back or fix forward? If you fixed forward, the fix skipped the soak.

#### Belief: everything goes through the three days

Section 9's strongest pattern is the change class that bypasses the process.

- Do configuration, reference data, scheme parameter tables, operator scripts and database changes go through the same three days? What share of your incidents came from those?

#### Belief: waiting costs nothing

- How long does a non-critical defect reported by a client wait before the fix is live? How many known defects are in production today waiting for a train?
- What does release week cost in people: who is on the bridge, for how long, and at what hours?

#### Belief: clients will not agree to go first

- Has any client been asked? Do you already give one client a new version early? How many defects last year were found by a client's acceptance testing, and how many by clients in production?

The essay should print these as a one-page worksheet near the front, ahead of any history, and say that a reader whose answers favour the soak should stop there.

### 4. The strongest claim the essay can win, and what it should stop claiming

It should stop claiming that ramping is "better overall" as an established result; that the reader is "behind"; that the three days should be "replaced"; that failures of the new approach are only ever failures of half-adoption; that regulation has cleared the path; that experiments matter to this audience; and that the engineering is merely "documented". It should stop spending its opening on Facebook and its closing on its gaps.

Revised thesis: Your release process bundles four things (a batch, a wait, an approval and a way back), and the one regulator that has measured firms like yours found that the batch is where failure concentrates while the approval and the wait have no demonstrated benefit, so measure on your own records what each is buying you. Where the measurement shows waiting and bundling, not testing, firms that move money have published a way to keep every approval while shrinking the batch, exposing one consenting client first and rehearsing the way back, and it can be tried on one service without removing a single existing control.

### 5. What the first 200 words must do

- Describe the reader's process accurately and with respect, including what it does well, or decline to describe it at all. Never open with "You are behind".
- State the narrow claim and the word "keep" before the word "change": approvals, independent testing, scheme and network dates, period-end holds and client notice all stay.
- Put the three fatal gaps (no bank before-and-after, no incumbent's account, no auditor's verdict) in the opening, in the essay's own voice, before the reader finds them on the last page.
- Lead with the reader's own industry and data: the FCA figures and the OANDA banks, not Facebook Chat. No company founded as a website should appear in the first 200 words.
- Ask three or four of the measurement questions immediately, and say what answers would mean the reader is right and the essay is wrong.
- Name the cost honestly in one sentence (years, a platform team) and name the first step that costs almost nothing: measure the three days, rehearse one rollback.
- Do not define "feature flag", "canary" or "the Financial Times" for an engineering director. Move definitions to a glossary or a parenthesis later.
- Say that the essay will argue from failure rate and reach per change, never from speed, since speed is the argument this reader has learned to distrust.

A sketch of an opening that does this, at about 150 words:

> Your release process has a record, and nothing in this essay asks you to give up a control. It asks you to measure four things your process bundles together: how many changes travel in each release, how much of the three days is testing and how much is waiting, what your change board has ever stopped, and how long your last rollback took. In 2021 the FCA measured some of these across 23 financial firms and a million changes; smaller releases succeeded more often, and extra oversight of major changes did not bring their failure rate down to the average. No bank has published before-and-after figures for leaving a release train, no firm with a mainframe core has described doing it, and no auditor's verdict is public. So this is not a proof. It is a set of questions about your own system, an account of what payments firms did when their answers were uncomfortable, and one small trial you can run without removing a gate.
