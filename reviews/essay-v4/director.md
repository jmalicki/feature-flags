# Director's review of essay v4

Read once, straight through, as an engineering director at a business that moves money, releases on twice-weekly trains and answers to a CTO, a risk committee, auditors and bank clients. Everything below is from that chair.

## 1. Was the consultant worth the money?

No, not for an assessment. Yes, perhaps, for a reading list. What I received is a well-researched literature review with "the business" pasted in where my company's name should be. It tells me accurately what Amazon, Facebook, Uber, Starling and the FCA have published, and it describes my release model in two sentences that I could have dictated over the phone. It contains no number of mine, no cost, no headcount, no date, no named system and no decision for me to take. Its first recommendation is that I go and collect the data an assessment is supposed to be built on. The direction is probably right and several passages are good, but I cannot take this to the risk committee: the first question will be "what does it cost and what did our own incidents show?" and the document's answer to both is "unknown".

I decided at the last paragraph of the Summary:

> "This assessment rests on the release model as described and on the published record of firms that have replaced it. It has not drawn on the business's own change and incident data, and the first recommendation is to assemble that data."

Up to that point I was reading an assessment. After it I was reading an essay, and I read the rest looking for what I could salvage. The Sources section then confirmed it: a consultant's report that links to "the synthesis report", "the research notes" and "Reviews of the previous draft" is showing me its workings as a desk study.

## 2. My business, or the industry?

Someone who has read about the industry, carefully. Not someone who has been inside my business, and not obviously someone who has run this change anywhere.

### Tells that the author knows payments

- "the roll of the business date, and end-of-day jobs running on new code while online traffic continues". That is what my soak is for, and most consultants do not know it.
- "three sets of environments and three times as many partner test windows". Partner windows are a real constraint.
- "a flag can reverse a decision and cannot reverse a payment".
- "The choice of rail is made once, when the payment is accepted, and is stored on the payment". A design point a practitioner would make.
- "Auditors, however, test a firm against its own change policy, and that policy describes the process the firm has today."
- "Where the clients are themselves banks, with their own notice periods and sign-off".
- "A new settlement file reaches a counterparty whole, at a cut-off, and cannot be sent to one percent of them".
- "after messages have left the building".

### Tells that the author has not looked at my business

- "the release model as described". Described by whom, in how much detail? The whole description of my operation is the first sentence of the Summary.
- "In a payments business it contains integration packs run against simulators for the payment schemes, a performance run and at least one batch cycle." That is what one would contain, not what mine contains.
- "Suppose outbound account-to-account payments below a threshold amount are to be sent over the instant-payments rail, B". A hypothetical. A consultant who had read my change log would have used one of my last ten changes.
- "The equivalent for the business is a daily build that bakes on a small slice of production". Whether my production can be sliced is the first architectural question, and it is not asked. If my bank clients are on dedicated stacks, the sentence means something quite different.
- "A fix completed on a Wednesday morning reaches clients in the following week." The author does not say which days my trains run, or whether the three days are business days. The seven-day worst case only works for one particular pair of days.
- "The rule texts I have read", citing FFIEC, EBA, DORA and MAS. The author does not know which regulator I answer to.
- "None of the accounts I read gives figures for how roles changed". "I have found no bank or payments firm that has published". The first person here is a researcher's. Nowhere does the author say "when I did this at a processor" or "in my experience the second-line objection is". An industry expert would.
- The exposure-ladder figure's caption reads "then staff, a small cohort, and everyone". The text's ladder is synthetic client, consenting client, further clients. The figure is from a consumer-tech deck.
- The only chart of delay in the document is Amazon's sixteen days, from before 2009. There is no picture of my five.
- "A pilot on that scale occupies a small team." The only resourcing statement in 4,700 words.
- "should" appears 32 times. There is not one currency figure, headcount or calendar date for the programme.

### How the admission lands

Badly, for three reasons.

It is in the fourth paragraph, after "This assessment finds". It reads as a disclaimer slipped in after the claim. A finding is something found; nothing here was found in my business.

It contradicts the headline finding. "The model is sound on safety" is asserted without incident data. The author cannot know that. Equally "expensive on speed" is asserted without lead-time data.

It turns Recommendation 1 into an invoice for work I assumed was in scope. The six questions are good questions. They are the diagnostic. I expected the answers.

Then there is this, at the end of Recommendation 1: "the gain will be smaller than this assessment expects". The assessment never says what gain it expects. There is nothing to be smaller than.

### How a report in that position should be framed

- Call it what it is on the title page and in the first sentence: a position paper and a proposal for a diagnostic, not an assessment. Drop "finds". Use "we expect", "the published record shows", "the hypothesis to test is".
- Put the limitation first and make it work for the reader: "We have not seen your data. Here is what we would expect to find, why, and the six measurements that would confirm or kill it. They take N weeks and need these extracts from these systems."
- Replace my missing numbers with a model I can fill in. "At C changes per train and E engineers, each day of queue is worth X. Put your own C and E in this table." Give the table.
- State what result would make the author withdraw the recommendation. One sentence does this now ("If the soak proves to be catching faults that nothing else would"); it needs thresholds.
- Split the recommendations into those that hold whatever the data says (rollback rehearsal, flag governance, baseline) and those conditional on it (daily deployment, pager, retiring the train).
- Speak from experience where it exists and say so where it does not. "I have found no account from a firm with a mainframe core" is honest; it should be followed by what the author has personally seen, or by an admission that this is desk research.
- Remove the links to drafts, reviews and research notes from the deliverable.

## 3. The ten recommendations

None of the ten carries a cost, an owner, a duration or a dependency. They are numbered, not sequenced. The Summary says "three matter most" and then the body gives ten of equal weight. Nothing tells me what stops, and stopping things is how I fund starting things.

### 1. Establish the baseline

- Act on it: yes, immediately. It is cheap and I should already know these answers.
- Defend upward: easily.
- Missing: who does it, from which systems, in how long; what answers constitute go and no-go; why the consultant did not do it. Also missing from the six: changes per train, engineer-hours per train, done-to-live distribution rather than average, hotfix count, share of changes that could not be flagged.
- Commit or wriggle: commits on the questions, then wriggles: "the gain will be smaller than this assessment expects".

### 2. Separate deployment from release

- Act on it: not on this text.
- Defend upward: no. "Every material change" is undefined. The risk committee will ask what "material" means and who decides.
- Missing: what happens to pre-production. "That soak should move into production" — and the scheme simulator packs, the performance run, the batch cycle? Do they stay, shrink or go? What is the pipeline between merge and the production slice? Which clients are on the "small slice", and did they consent to running a build with one day of soak instead of three? Recommendation 4 demands consent for behaviour; the build canary gets none. Flag platform: build or buy, and what is its availability target given every payment path will consult it? Does one daily peak and one batch window catch the slow leaks Finding 3 says need the soak? What about month-end?
- Commit or wriggle: commits in grammar, hand-waves in substance: "The equivalent for the business is". It also hands me the objection: Amazon's "change typically takes four or five business days to reach every region". My train takes five. The distinction (in production in a day, exposed gradually) is there but the reader has to dig for it.

### 3. Prove each material change in production

- Act on it: I would trial it. This is the best section.
- Defend upward: the shadow run, yes; "parallel run" is language my risk committee already uses. The synthetic client with real money, not yet.
- Missing: the synthetic client. Which legal entity, funded by whom, booked where, permitted by which scheme rules, screened how, reconciled by which operations team? Shadow computation "for all traffic": what does it cost in latency and capacity on the payment path? Who builds the comparison tooling and how long does it take? "with tooling that makes it cheap" is a wish. Which share of my changes are candidates for this ladder and which are too small to bother?
- Commit or wriggle: commits, and is honest that "the routing change itself reaches every client later under this model, perhaps by several weeks". But "This supplies most of what the soak was expected to reveal" is an overclaim that contradicts Finding 3: the soak looks for leaks and date-roll faults, and a shadow run of a routing rule finds neither.

### 4. Ramp by client, with consent

- Act on it: in principle.
- Defend upward: to the CTO, yes. To clients, I have nothing to say yet.
- Missing: the commercial side entirely. What does a client get for going first? What do contracts and change-notification clauses say now? My clients are banks for whom I am an outsourced service; what do their own outsourcing obligations require of a per-client behaviour change? What if nobody volunteers? What does support do when client A and client B are on different behaviour and both ring the desk? How is "which client had which behaviour on which date" evidenced in a dispute?
- Commit or wriggle: commits. "must be a client that has agreed to go first" is clear. Square is a thin basis for the principle but the principle is right.

### 5. Make rollback routine and pre-authorised

- Act on it: yes, this quarter, on the current train. It does not depend on anything else in the document, which the document does not notice.
- Defend upward: yes. RBS Version 2A is the single most usable piece of evidence here; my risk committee knows the case.
- Missing: rehearsal frequency; rollback with schema or data changes in the build; who writes the "written rules"; how on-call authority sits with the incident commander and with client notification duties; a target time.
- Commit or wriggle: commits. The exception clause ("such as within a cut-off window or after messages have left the building") is the right kind of caveat: specific, operational.

### 6. Govern flags as controlled changes

- Act on it: yes, as a condition of 2.
- Defend upward: yes, though Knight in a report recommending flags needs more careful handling than it gets (see section 5).
- Missing: a ceiling on live flags; maximum flag lifetime; who audits; what the regression pack does about flag combinations; kill-switch propagation time; what happens to in-flight payments if the flag service is down. "should change ... what is recognised when performance is assessed" is an HR programme disposed of in a subordinate clause.
- Commit or wriggle: commits on the controls ("It should never be reused"), then trails off into Microsoft's experimentation group doubting it changed anyone's objectives, which tells me the author expects this to fail and has no remedy.

### 7. Authoring team owns the pager

- Act on it: no, not on this text. It is the most expensive and contentious item and gets two paragraphs.
- Defend upward: no.
- Missing: on-call pay, contracts, employee consultation, attrition risk, hiring profile, rota sizes for small teams, what the operations and release teams become, and segregation of duties. "The team that writes a service should deploy it" runs straight into "an authorised approver (in some texts explicitly someone other than the author)" one section later, and the document does not reconcile them.
- Commit or wriggle: wriggles twice. "The recommendation therefore carries a condition, which is that the platform and the training are funded first" — how much? And "the business should address the question openly and early" is the consultant handing the hardest conversation back to me with no advice.

### 8. Rewrite the change policy with risk and audit

- Act on it: yes, and first, before 2.
- Defend upward: yes. "None of them asks for three days" is a line I would use.
- Missing: my regulator; my external assurance report cycle (clients rely on my control descriptions, and changing a control mid-period has consequences); client audit rights; a draft of the policy clauses; who in the second line owns it. Starling's "three approvals for every release", the last by a director or executive, several times a day, is the rubber stamp the FCA paragraph criticised in change boards. The document does not see the tension.
- Commit or wriggle: commits. "Approval should be relocated, not removed" is clear and defensible.

### 9. Keep a pre-production hold where a ramp does not fit

- Act on it: yes; it is what I do now.
- Defend upward: yes, and it reassures.
- Missing: what proportion of my change this covers. If it is a tenth, fine. If it is four tenths, the business case is different and I am paying for two pipelines for ever. Who classifies a change into this lane, and what stops everything drifting into it?
- Commit or wriggle: commits. "None of these is a candidate for a ramp."

### 10. One pilot; expect years

- Act on it: yes, if someone tells me what it costs.
- Defend upward: partly. "Two quarters" and "one client" are concrete. "Expect the programme to take years" with no number of years and no cost is not a thing I can put before a CTO.
- Missing: which service; whether a service "with no vendor package or mainframe component in its path" that still moves money exists in my estate, and if it does not, what the pilot proves; team size; budget; the stop conditions themselves, not the instruction to agree some; success thresholds; what happens at the end of quarter two. The one hard cost figure in the document, OANDA's "about 15% of its engineers working on tooling", is never applied to me. On 200 engineers that is 30 people. The document should have said so.
- Commit or wriggle: commits on the pilot, then spends two long paragraphs on OANDA's and Microsoft's bad days and closes on "The practice depends on leadership that holds its course after a failure", which is the consultant pre-assigning blame.

## 4. The velocity case

The prize is not vivid and not credible, because it is never stated. The Summary says such firms "develop substantially faster". No figure follows, anywhere. The title promises "Deploy every day"; nothing says what I get for it in features, quarters or money.

"About five days" is trivially dismissed. My reply is: five days is fine, clients do not want change faster than that, and twice a week is already quick for a business like mine. The document makes this worse in four ways.

- Its evidence is from slower models than mine. Amazon's sixteen days predates 2009 (the footnote admits it). LinkedIn's example is a monthly mobile release. A twice-weekly train is not the patient those studies describe.
- The FCA's "smaller, more frequent releases had higher change success rates" can be read as endorsing twice-weekly trains. Against the 2019 population of financial firms I am probably already at the frequent end. The document does not address this.
- It concedes that the flagship risky change arrives "later under this model, perhaps by several weeks", and that Amazon takes "four or five business days". So the benefit lies wholly in the ordinary changes "that would otherwise have queued behind the risky one", and it never says how many of those there are or what they are worth.
- Finding 2 asserts effects ("Finished work sits idle", "held on a branch that diverges") in the indicative mood as if observed in my teams. They were not observed.

What would make me feel it in my own numbers:

- The fixed cost of the trains. 104 trains a year, three days each, times the people who shepherd, test, attend the board and stand by. That is a salary figure and I can compute it by lunchtime. The document never asks.
- Feature lead time, not change lead time. A feature that needs six rounds of production feedback pays the five days six times: thirty days of queue on top of the work. Five days per change is tolerable; a month per feature is not.
- The hotfix path. If I run an expedited path at all, I have already conceded that five days is unacceptable when it matters. How many hotfixes a year, and what share of change is that? Baseline question 6 points at this and the velocity argument never uses it.
- The cost of missing a train. A half-day slip costs three or four days. That drives the day-of-cut rush the Facebook citation describes; the document cites it and does not connect it to my Thursdays.
- Diagnosis time. Changes per train times time to isolate the culprit is in my incident records. Baseline question 3 asks for it; the Findings should have estimated it.
- Branch age and merge rework: median age of branches at merge, conflicts per week.
- Environment and partner-window cost: what I spend on pre-production estates and scheme test slots sized for the train.
- Client response time: how long from a client's request, or a competitor's feature, to live for the first client. That is the number my commercial director cares about.
- Cost of delay: one named initiative, its expected revenue or penalty per week, times the weeks of queue it paid.
- Engineer attention: how many finished-but-not-live changes an engineer carries, and how often they are pulled back to a change they finished a week ago.

A worked calculation with stated assumptions and a blank column for my figures would do more than all of Finding 2.

## 5. The safety case

I am half convinced. I believe the mechanism (shadow, ramp by client, rehearsed rollback) is sound. I am not convinced the document has shown the net risk goes down, because it never lists what new risks the model introduces and sets them against what it removes.

### What lands

- RBS: the back-out "had only tested the consequences of backing out Version 2 to Version 1". A regulator's final notice, a bank, a failure mode I recognise.
- Knight's five days: "nothing had gone wrong, because nothing was yet using it". This is the best argument in the document against trusting a soak, and it is buried in the flag-governance section.
- The FCA's change boards approving "more than 90%" and rejecting none at some firms. It lands because I know my own board's rejection rate is near zero.
- Netflix's canaries "devolving into verifying endurance".
- The stored-rail design and the reversal semantics. This shows someone has thought about money in flight.
- The concessions: "The build itself still needs a soak", and Recommendation 9. They make me trust the author more.

### What is decoration

- Facebook Chat in 2008. A chat product proves nothing to a risk committee.
- Chrome's 1,040 flags and Uber's 1,381 deletions. Colour.
- Basel II's four quarters of parallel run. A capital calculation is not a release practice; the analogy is strained and a risk officer will say so.
- The FFIEC handbook describing canaries "as ordinary practice". Mentioned is not endorsed.
- Facebook's "almost constant" critical issues, immediately qualified by "are careful elsewhere not to claim it as the cause". A point that cancels itself.

### Where the document undermines itself

- Every disaster in it is a disaster of the recommended model or a near relative. Knight: a flag and a partial deployment. Google Cloud 2025: "code rolled out region by region, never exercised, and then triggered everywhere at once" — which is dormant code behind a switch, exactly what Recommendation 2 puts into my production every day. Azure DevOps: "disabling the flags did not restore it", and later 45 minutes "while the team worked out how to turn off the flag". OANDA: "cost the company a significant amount of money within seconds". The honesty is to the author's credit. But the document never draws up the account, so a sceptical reader leaves with four flag catastrophes and no train catastrophe except RBS.
- The Summary says "without loss of stability" and "sound on safety"; Finding 6 says "I have found no bank or payments firm that has published its incident record from before and after it left release trains" and no account at all from a firm with a mainframe core. The Summary's confidence is not earned by the body.
- "That is a reason to proceed by measured stages ... and not a reason to stay where it is." That is asserted, not argued. Absence of evidence for firms like mine is precisely a reason some of my colleagues will give for staying.
- The FCA paragraph is followed by a paragraph taking most of it back: "These are associations", DevOps firms "had a slightly higher failure rate". After that, "The central finding stands nonetheless" asks me to take it on trust.
- "No client observes any difference" (Finding 4) against "a daily build that bakes on a small slice of production" (Recommendation 2). Clients on the slice run a new binary with a day's soak. They are exposed.
- Finding 3 says shortening the soak "means ceasing to look for" a class of faults. Recommendation 2 shortens it to "one daily peak and one batch window". The reconciliation (real traffic is a better test than three synthetic days) is not made.
- OANDA is called "the nearest thing to a controlled comparison". It is one firm's engineers describing their own preferred process against their customers'. The document half admits it ("On their account").

What is missing is a risk register: flag-state combinatorics, the flag service as a dependency of the payment path, configuration change as a new unreviewed route to production, real-money testing, shadow load, dormant code. Against each, the control and the residual. That one table would do more for the safety case than six case studies.

## 6. What I would ask next

1. What does the programme cost over three years, in people and money, and what does the pilot cost?
2. What do I stop doing to pay for it?
3. How much faster, in a unit I can report: feature lead time, changes per engineer, client request to live?
4. What share of my changes last year could have gone behind a flag, and what share falls under Recommendation 9?
5. Can my production be sliced by client at all? If large clients are on dedicated stacks, what is "a small slice"?
6. What happens to the pre-production environments, the scheme simulator packs and the performance run under daily deployment? What is kept, what is cut, and what does that save?
7. Which clients sit on the slice that bakes each daily build, and what have they been told?
8. Does one day's bake catch what three days of soak catches? What about month-end, quarter-end and year-end?
9. Who is the synthetic client legally, who funds its accounts, and do the schemes permit test payments in production?
10. Which of my regulators, and which clauses of my client contracts and assurance reports, constrain the pace of change, and has anyone read them?
11. What do I offer the first client, and what is my liability if a ramped behaviour harms them?
12. Where does segregation of duties sit when the author deploys, flips the flag and holds the pager?
13. Is a flag change a change under policy? Who approves it at 02:00?
14. What is the availability target and failure mode of the flag service, and what do payments do when it cannot be reached?
15. How many flags may be live at once, and how does the regression pack cover the combinations?
16. What does on-call cost: pay, contracts, consultation, attrition? How many of my teams are too small to carry a rota?
17. What becomes of the release managers, testers and the change board chair, in numbers?
18. Build or buy for flags, shadow comparison and progressive delivery? Which vendors operate in regulated payments?
19. Which service is the pilot, and does a money-moving service free of vendor and mainframe components exist in my estate?
20. What are the pilot's success thresholds and stop conditions, as numbers?
21. What is the sequence and what depends on what? Which recommendations can start now under the train?
22. Who has done this at a business like mine, and can I talk to them?
23. If the baseline shows the soak catches real faults, what is the fallback recommendation?
24. How do support and operations know which client is on which behaviour during an incident?
25. What decision are you asking me to take, by when?

## 7. Prose, from the reader's chair

Where I skimmed: Finding 2's second paragraph (Amazon, LinkedIn, Facebook: other people's problems); the Facebook and Netflix paragraph in Finding 5; the Chrome and Uber flag counts; almost all of the last two paragraphs of Recommendation 10, which are a history of OANDA and Azure DevOps where my roadmap should be.

Where I re-read: the Amazon pipeline sentence; the flag-off reversal sentence; the Facebook "almost constant" sentence; the caveats paragraph after the FCA figures.

Tone: mostly bloodless rather than pompous. "The business" seventeen times; "should" thirty-two times. It never addresses me. It lectures in places ("should be read with care"), and it hedges exactly where I need it to commit (the gain, the cost, the roles, the duration). The scholarly fairness — every case followed by its qualification — is admirable in a paper and tiring in advice. The document reports; it does not advise.

The worst ten, for a reader like me:

1. "They develop substantially faster, and the best available evidence, including the UK regulator's, indicates that they do so without loss of stability." The central claim, with no number and two hedges. I wanted: how much faster, according to whom, and one sentence on why I should believe it applies to me.

2. "This assessment rests on the release model as described and on the published record of firms that have replaced it." Passive, evasive. I wanted: "I have not seen your data. This is a desk study. Here is what it can and cannot tell you."

3. "The tooling for all of this is well understood." Breezy. By whom? At what price? I wanted the three components named, build or buy, and an order of magnitude.

4. "If the soak proves to be catching faults that nothing else would, and most of the three days proves to be work, the gain will be smaller than this assessment expects, and the business should know that before it invests." No expectation was ever stated. I wanted: "I expect X. If the baseline shows Y, do not proceed past the pilot."

5. "Firms that have measured these effects report them plainly." Filler, and it introduces three firms whose circumstances are not mine. I wanted my own figures or a method to get them.

6. "These are associations, and they should be read with care." Lecturing. I wanted the caveat in a clause and the conclusion in the main verb.

7. "Amazon's pipeline places each build on a single machine, then in one region, then outward in waves, holding at each stage for at least one to twelve hours and until a minimum volume of real traffic has been served, and rolling back automatically if an alarm fires." Too much in one sentence, and "at least one to twelve hours" does not parse. I wanted two sentences, and then what my version looks like.

8. "This supplies most of what the soak was expected to reveal, from production's own traffic and with no client exposed." An overclaim that contradicts Finding 3. I wanted a plain list: what the shadow run shows, what it does not.

9. "None of the accounts I read gives figures for how roles changed, and the business should address the question openly and early." Abdication on the question my people will ask first. I wanted the consultant's own view of which roles change into what, and how to say it to them.

10. "The practice depends on leadership that holds its course after a failure." A sermon, and a pre-emptive excuse. I wanted: "Agree now, in writing, what you will and will not do after the first incident under the new model."

Dishonourable mentions: "Two further cases complete the picture."; "A pilot on that scale occupies a small team."; "The business should do the same thing routinely, for ordinary changes, with tooling that makes it cheap."

## 8. Three passages that worked

Finding 3, first paragraph: "sessions that fail only after hours of idleness, memory and file handles that creep, queues that deepen, the roll of the business date". It takes my process seriously before criticising it. It is the one moment I thought the author had stood in a room like mine, and it buys the hearing for Finding 4. "The business has correctly chosen safety" does the same.

Recommendation 3, the rail A to rail B example, particularly "stored on the payment, so that every later event in that payment's life follows the stored choice and not the current position of the flag" and the frank "reaches every client later under this model, perhaps by several weeks". It is concrete, it shows the present model and the proposed one on the same change, it deals with money in flight, and it admits a cost. If the whole report were written at this level, on one of my own changes, I would have bought it.

Recommendation 8: "None of them asks for three days. Auditors, however, test a firm against its own change policy, and that policy describes the process the firm has today." This told me something I half knew and had not put so clearly, and it gives me a first action: the policy is mine to change. With RBS Version 2A and Knight's "nothing was yet using it", these are the lines I would repeat to the CTO.

## 9. Brief for the rewrite

1. Decide what this document is. If you have not seen our data, title it a position paper and diagnostic proposal, say so in the first sentence, and stop writing "finds". If it is to be an assessment, do the baseline first and come back.
2. Put a price on it. Pilot: people, months, money. Programme: a range per year and the assumptions. Apply OANDA's 15% to a firm of our size. Say what stops to fund it.
3. State the prize as a number with a method. Build the velocity case as a calculation over our variables (changes per train, engineers, hotfix rate, people-days per train, iterations per feature) with a column we can fill in. Lead with feature lead time and the fixed cost of 104 trains, not "about five days".
4. Give a sequenced roadmap, not ten parallel "shoulds": what starts this quarter under the existing train (baseline, rollback rehearsal, policy drafting), what gates what, what the decision points are, and what you are asking us to approve.
5. Add the risk account. A table of the risks the new model introduces, the control for each and the residual, set against the risks it retires. Explain why Knight, Google and Azure DevOps argue for your controls and not against your proposal.
6. Answer the questions you currently hand back: roles and numbers, on-call terms, segregation of duties when the author deploys, what "material" means, what happens to pre-production, who sits on the production slice.
7. Deal with clients and contracts properly: consent, notification, incentive for the first mover, liability, support, evidence of who had what when. Name our regulatory regime, not four jurisdictions.
8. Meet the two obvious objections head on: "five days is fine for us" and "twice weekly already counts as small and frequent, so the FCA finding is on our side".
9. Cut the case studies by half and make each one earn a sentence about us. Keep RBS, Knight, the FCA, Uber's shadowing, Starling. Drop Facebook Chat, Chrome, Basel, and most of the OANDA and Azure narrative. Fix the ladder figure so it matches the text. Remove the links to drafts and reviews.
10. Write it to us. Second person, active, a recommendation and its reason in the first two sentences of each section, caveats in clauses. Tell us what you would do in our seat, from experience where you have it, and say plainly where you do not.
