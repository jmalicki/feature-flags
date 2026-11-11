# Persuasion review of essay v4

Reviewed: `essay.md` (5,125 words: Summary 312, Findings 1,357, Recommendations 3,046, remainder notes), against `reports/Testing gates to ramping culture.md` and the research notes.

## Verdict

The document would not change a sceptical director's mind. It is accurate, careful and well sourced, and it reads as a literature review with recommendations attached. It fails as persuasion for five reasons.

- It concedes the safety argument in its second sentence ("the model is sound on safety and expensive on speed") and then asks risk-averse directors to change a sound model for the sake of speed. No director does that.
- It never says how much faster. "Velocity" appears once in 5,125 words. The only after-state figure for the reader's own business is that the worked example "reaches every client later under this model, perhaps by several weeks".
- "Culture" appears once, in the Summary, and never again. The commissioner's spine is a subordinate clause.
- The readers are never addressed. "Director" appears once, in a description of Starling's approvers. There is no "you", no decision, no date, no owner.
- It confesses in its Summary that it has not looked at the client: "It has not drawn on the business's own change and incident data". A document titled "An assessment" that has not assessed invites the response "then come back when you have".

The material to win the argument is already in the essay and the research. It is in the wrong order, in the wrong voice, and carrying the wrong emphasis.

## 1. The thesis: wanted and delivered

### What the commissioner wants argued

The business can vastly improve development velocity while preserving safety if it changes its culture to adopt feature flags and the practices around them.

### What the document argues

The release train is safe but slow; the slowness is structural; other firms have separated deployment from release without losing stability; the business should therefore run a two-quarter pilot beside the train and expect a multi-year programme. In the document's own words: "a sequence of bounded steps, each measured against the baseline, with the release train kept running until the evidence from its own systems justifies retiring it."

That is a narrower, more defensive and less interesting claim. It is a recommendation to investigate.

### "Vastly improve velocity": gestured at

The claim is asserted once and never quantified for the business.

- Summary: "They develop substantially faster". No number, no source at that point, no unit.
- Finding 2 quantifies other firms' before-states (Amazon's 16 days, LinkedIn's month). Neither is a flags-versus-trains comparison, and Amazon's figure is waiting eliminated by automation, which a director will rightly say is a different remedy.
- The only sentence that states the velocity mechanism is the last line of the sixth paragraph of Recommendation 3: "The gain in velocity comes from freeing the ordinary changes that would otherwise have queued behind the risky one." That sentence is the thesis. It arrives at about word 2,900.
- The document supplies two numbers that cut against the claim and leaves them unanswered. Amazon's pipeline "typically takes four or five business days to reach every region", which is the reader's five days. And the worked example "reaches every client later under this model, perhaps by several weeks". A director adds these up and concludes the new model is slower.
- The arithmetic that would make the case is never done. Under Recommendation 2, "a build is in production within a day of being cut". So the corrected label of Finding 1 goes from about five days to about one, and the engineer on the routing change has "evidence from production the day after writing it" instead of the following week. The document has both facts and never puts them side by side.
- Recommendation 1 then undercuts the whole: "the gain will be smaller than this assessment expects". The assessment has never said what it expects.

### "Preserving safety": asserted with caveats, to the wrong standard

The Summary's claim is "the best available evidence, including the UK regulator's, indicates that they do so without loss of stability". "Indicates" and "without loss" make it a parity claim resting on other people's data. Finding 5 then qualifies it ("These are associations, and they should be read with care") and Finding 6 withdraws most of it ("I have found no bank or payments firm that has published its incident record from before and after").

A risk-averse director does not need a correlation from 23 other firms. They need to see, control by control, that nothing they rely on today is removed and that something is added. The document has that argument. It is the routing example in Recommendation 3, and it shows the new model is safer in mechanism: today the change "goes live for every client and every payment type in scope at once", and what the receiving banks do "is learned from production, all at once"; under the ladder "no client is exposed to an unproven rule". The document also holds four pieces of evidence that the present model is less safe than the directors believe:

- Pre-production "cannot establish how the receiving banks on rail B will respond to the real mix of payments".
- Knight's code sat on production servers for five days and "a soak would have proved as little".
- Back-out plans "fail when they are first used in earnest" (RBS).
- Change boards "approved more than 90% of the major changes put before them".

Having assembled the case that the three days buy less than they appear to, the document opens by declaring the model "sound on safety". That single concession converts a safety argument, which directors must act on, into a speed argument, which they may defer.

### "Culture change": an afterthought

The Summary's last substantive sentence says "the programme should be planned as a change of culture". The body does not plan it. The cultural content is:

- Three sentences at the end of Recommendation 6, after flag counts and Knight: "The business should expect the same resistance and should change what code review asks for, what counts as finished, and what is recognised when performance is assessed."
- Recommendation 7 (143 words), half of which is about Netflix.
- Recommendation 8, which is about policy text.
- One sentence in the second paragraph of Recommendation 10: "The practice depends on leadership that holds its course after a failure." This is the most important sentence in the document for its actual readers. It is placed as a remark on programme duration.

The recommendation headings are all mechanisms: separate, prove, ramp, rollback, govern, own, rewrite, keep, begin. A reader skimming the headings would not know the document thought culture mattered.

## 2. Findings then recommendations: the form hurts

### No reason to care before being told what to do

The Summary opens with a description of something the reader already knows ("The business releases twice a week") and reaches its recommendation in paragraph three without having made anyone uncomfortable. The cost is stated as an abstraction: "expensive on speed". Nothing has been lost, no client has waited, no incident has been hard to diagnose, no competitor has moved.

The single concrete image, "A fix completed on a Wednesday morning reaches clients in the following week", is in Finding 1 and is given one sentence.

### Observations in order, no tension

The findings run: the delay exists; the delay has costs; the delay is justified; the delay comes from a coupling; others decoupled; the evidence is limited. That is the order of an investigation. It has no turn. Finding 3 ("The three days do real work and cannot be compressed") is honest and necessary, but as the third of six it lets the reader settle back: the consultant agrees the soak is needed. Finding 6 then ends the section on doubt. The reader arrives at the recommendations having just been told what the evidence "does not establish".

A persuasive structure sets a trap the reader recognises and then springs it: you accept five days because you think it buys safety; here is what it does not buy; here is how to get both. The material for this is Finding 4's first sentence ("speed and safety do trade against each other, and the business has correctly chosen safety") followed by "The assumption is not necessary". That is the hinge of the argument and it is in the middle of a paragraph.

### Ten recommendations of equal weight

The Summary says "three matter most". The body does not act on that. Recommendation 3 gets 769 words, Recommendation 9 gets 103, and the pilot, the only thing the directors are being asked to approve, is tenth. Recommendation 1 is "measure", which from an outside consultant reads as a request for a second engagement.

Ten parallel "should" paragraphs is the form of an audit report. Audit reports are complied with, not believed. The commissioner wants belief.

### The genre is wrong for the evidence held

An assessment claims to have examined the client. This one has examined the literature. The honest form for that is an opinion: a named expert's judgment, argued, with a specific first step. An opinion can say "I have not seen your figures; I predict what they will show" and gain authority from the prediction. An assessment that says the same thing loses it.

## 3. Strength of recommendation

### The modal problem

"Should" appears 32 times. "The business should" appears 8 times. "I recommend" appears once. The directors are never "you". Every recommendation is in the third person at one remove: "Rollback should become a rehearsed, pre-authorised operation". Nobody is told to do anything.

### Catalogue

| Location | Text | Verdict |
| --- | --- | --- |
| Summary | "the model is sound on safety and expensive on speed" | Flinch. Concedes the case. |
| Summary | "They develop substantially faster" | Flinch. An intensifier where a number belongs. |
| Summary | "the best available evidence ... indicates that they do so without loss of stability" | Flinch. Two softeners on a parity claim. |
| Summary | "It has not drawn on the business's own change and incident data" | Honest, fatally placed. Belongs with the ask, as a prediction. |
| Finding 5 | "although the FCA notes that this may be partly because an incident was already open" | Honest; a footnote. |
| Finding 5 | "These are associations, and they should be read with care." | Honest; needs one clause, gets a paragraph. |
| Finding 5 | "a result from which it drew no conclusion given the sample" | Honest; footnote. |
| Finding 5 | "The nearest thing to a controlled comparison"; "On their account" | Honest and adequate. |
| Finding 5 | "are careful elsewhere not to claim it as the cause of their results" | Honest; cut the case instead. It proves little and costs a caveat. |
| Finding 6 | The whole finding: "I have found no bank ..."; "It does not establish what the business's own figures would be." | Necessary once. As a numbered finding closing the section, it is the author arguing against himself at the moment of maximum attention. |
| Finding 6 | "That is a reason to proceed by measured stages ... and not a reason to stay where it is." | The right instinct, phrased as a defence. |
| Rec 1 | "the gain will be smaller than this assessment expects, and the business should know that before it invests" | Flinch. An exit built into the first recommendation, about an expectation never stated. |
| Rec 2 | "The build itself still needs a soak" | Not a hedge; good design. Keep. |
| Rec 3 | "This supplies most of what the soak was expected to reveal" | Vague. Say which part it does not supply. |
| Rec 3 | "perhaps by several weeks" | Flinch by vagueness. An unanchored concession on the commissioner's headline claim. |
| Rec 4 | "must be a client that has agreed to go first" | Necessary. |
| Rec 5 | "subject to written rules for the occasions on which rollback is the wrong response" | Necessary and specific. |
| Rec 6 | "This is more work per change than a train requires" | Honest and useful; it should be argued, not dropped in. |
| Rec 6 | "The business should expect the same resistance" | Flinch. Names no one and prescribes nothing. |
| Rec 7 | "The recommendation therefore carries a condition" | Fine. |
| Rec 7 | "None of the accounts I read gives figures for how roles changed, and the business should address the question openly and early." | Flinch. The hardest people question is handed back to the client. |
| Rec 8 | "The rule texts I have read" | Honest scope; fine. |
| Rec 9 | Whole recommendation | Necessary. It is what makes the rest credible. |
| Rec 10 | "expect the programme to take years" (in a heading) | Honest; wrong place. The heading of the ask should not lead with the cost. |
| Rec 10 | "with the release train kept running until the evidence from its own systems justifies retiring it" | Flinch. The last words of the document are about keeping the train. |

### How strong recommendations carry uncertainty

A professional recommendation does four things with doubt. It separates what is certain (the mechanism) from what is estimated (the magnitude). It converts unknowns into predictions the client can check. It states in advance what result would change the advice. And it bounds the cost of being wrong. Caveats are stated once, in one place, in terms of the decision. The call itself is made without modal verbs.

Rewrites from this document:

Original: "The model is sound on safety and expensive on speed."

Rewrite: "The three days find the faults a soak can find. They do not find the faults that have hurt financial firms most, and they cost every change about five days."

Original: "It has not drawn on the business's own change and incident data, and the first recommendation is to assemble that data."

Rewrite: "I have not seen your change and incident records. I expect them to show that the change board rejected fewer than one change in ten last year, that well under half of the three days is work, and that your last rollback had not been rehearsed. Six questions, set out below, will tell you within a month whether I am right. If I am wrong on the first two, do not proceed." (The predictions rest on the FCA's 90% approval finding, Amazon's 14 days in 16, and RBS.)

Original: "If the soak proves to be catching faults that nothing else would, and most of the three days proves to be work, the gain will be smaller than this assessment expects, and the business should know that before it invests."

Rewrite: "Two answers would change my advice: a soak that is catching faults nothing else would, or three days that are mostly work. In either case keep the train and spend the money on shortening the work."

Original: "It does not establish what the business's own figures would be. That is a reason to proceed by measured stages, as recommended below, and not a reason to stay where it is."

Rewrite: "No bank has published its record from before and after. You will be producing that evidence, which is why the first step is one service, one client, two quarters, with the train still running."

Original: "The routing change itself reaches every client later under this model, perhaps by several weeks."

Rewrite: "The routing change reaches its last client later than it does today, and that is the intent: a rule that moves money is released at the pace at which payments settle and reconcile. Every other change written that week reaches clients the next day."

Original: "None of the accounts I read gives figures for how roles changed, and the business should address the question openly and early."

Rewrite: "Tell your testers and release managers before the pilot starts that their jobs change and do not disappear: someone has to build the comparison tooling, own the pipeline and review every ramp plan, and they are the people who know where faults hide. No published account gives numbers, so give them yours."

Original: "The business should expect the same resistance and should change what code review asks for, what counts as finished, and what is recognised when performance is assessed."

Rewrite: "Expect engineers to treat the flag as overhead until their managers stop calling work finished when it merges. Finished means ramped to every client and the flag removed, and that definition goes into review and appraisal in the pilot team from its first week."

## 4. The culture argument

### What the document says, against what a director needs

| Question | What the document offers | Vivid? |
| --- | --- | --- |
| What must people do differently? | Engineers: decide "what the flag guards and how the disabled state behaves", build the shadow comparison, remove the flag, carry the pager. Scattered across Recs 3, 6, 7. | No. Never gathered, never shown as a day in someone's work. |
| Who resists, and why? | "The business should expect the same resistance." | No. No one is named. |
| What does the leader do on Monday? | Nothing. | Absent. |
| What does failure look like? | Azure DevOps 2013 and 2014, in Rec 10, as evidence of duration. | Half. The facts are there; the telling is flat. |
| How should leaders react to the first incident? | "The practice depends on leadership that holds its course after a failure." | No. One abstract sentence after the story, not the point of it. |

The research is specific on all five. The notes identify who resists and why: people who see the new practice "as a risk to their power and/or prestige" (Kohavi); developers who "would often defer to the ops release specialist" (Netflix); teams with "a mindset that buffers for stabilization" (Microsoft Learn); and the inference in `management_arguments.md` that "a change-approval gate works partly as blame insurance for the individual", so removing gates without changing consequences will be resisted. That last point is the real reason a director's own staff will fight this, and the essay does not make it.

### The strongest culture material available, and its use

| Material | Where | Use in the essay |
| --- | --- | --- |
| OANDA: the loss "within seconds", management's reach for approvals and "a full-blown, separate and traditional testing team", the post-mortem, the 23% fall under process-minded executives | Report, "Incentives and blame"; `google_facebook_quality_ownership.md` | Used, compressed into four sentences in Rec 10 under a heading about years. Wasted. This is the directors' own story and it is told as a footnote on duration. |
| Brian Harry, 2013 to 2014: "I feel terrible about it and I can't apologize enough"; flags off and "no one is completely sure why"; weekend deployments with people "working all day Saturday and Sunday"; "Time shifting the deployment isn't a fix, it's a mitigation"; ring 0 holding Harry's own account; "I'd like to see 3 or 4 smooth ones in a row"; later guidance to deploy in working hours, early in the week | `microsoft.md`; report | Half used. The essay has the outage and "all customers are affected or none". It omits the apology, the weekends, the leader putting his own account first, and the reversal to weekday deployment, which the report calls "the cleanest documented example of risk perception changing as a consequence of engineering, not exhortation". |
| Allspaw's letter to Yahoo management: "A significant part of my job was working towards saying 'go', not 'no-go'"; "This culture was taught, not born"; the tools "were concepts and tools created by Flickr Development, not Flickr Operations"; "When it wasn't safe, we slowed, and everyone was fine with that" | Report; `amazon_netflix_linkedin_etsy.md` | Not used. The notes call it "the best primary record of how the argument was put to executives". |
| Google on rollback: "No-one will ask 'why did you roll back this change?'" | Report; `rollback_authority.md` | The source is cited in Rec 5 for the mechanics. The one sentence that is about culture is left out. |
| Allspaw on blame: an engineer expecting punishment is "disincentivized to give the details necessary" and "Management becomes less aware and informed"; engineers "are not at all 'off the hook'" | Report | Not used. It is the argument addressed to managers' self-interest. |
| Facebook's push karma: the penalty was for being unreachable when a change broke, not for the breakage | Report | Not used. It answers "does blameless mean unaccountable?" |
| Amazon's device for sceptical teams: "encode their current release process, manual steps and all, in a pipeline" and automate stage by stage | Report | Not used. It is the Monday-morning instruction. |
| DORA 2019: "Organizations often respond to problems with software releases by introducing additional process and more heavyweight approvals. Analysis suggests this approach will make things worse" | Report | Not used. Survey evidence, so one clause at most, but it names the reflex. |
| Starling's "take ownership" ceremony and "our auditors loved this one" | Report | Used well in Rec 8. |
| Rollback authority levers: say rollback is normal; require only a written reason afterwards; one-step tool everyone has used; realistic drills; reward mitigators; keep the author reachable | `rollback_authority.md`, section 6 inferences | Not used as a list of leader actions. |

### The three stories that should carry it

Each is written below as it might appear. Facts are limited to the essay and the research.

#### Story one: the day after the loss (OANDA)

OANDA runs a currency-trading platform and deploys to it continuously. One of those deployments contained a fault that, in its engineers' words, "cost the company a significant amount of money within seconds".

What happened next is the part that concerns you. Senior management's first response was the one any of us would have: more hierarchy, more approvals, and "a full-blown, separate and traditional testing team". The post-mortem found something less convenient. The unit tests had caught the bug. Their failures had been ignored, lost among false alarms. More approvers would have been approving a change whose own tests were already saying no.

The engineers argued for a different remedy and got it: the test results became part of the decision to deploy. The signal that had been ignored could no longer be.

The same firm supplies the control. In mid-2012 executives more inclined to traditional process took over. The engineering team was much the same. Deployments fell by 23%.

Your pilot will have a day like OANDA's. The question that decides whether the programme survives it is the first one you ask. "Who approved this?" produces more approvers. "What did we know, and why did nobody act on it?" produces a better control.

#### Story two: the leader who went first (Azure DevOps)

On the morning Microsoft launched Visual Studio 2013, Brian Harry's team switched on a batch of feature flags. The service fell over at peak. They switched the flags off again, and it did not recover. "No one is completely sure why," Harry wrote. He also wrote: "I feel terrible about it and I can't apologize enough."

His diagnosis was one sentence: "all customers are affected or none". Flags had given the team a switch. They had not given it a small place to be wrong.

The first remedy was the cautious one: deploy at weekends. Before long he had people "working all day Saturday and Sunday" and called it what it was: "a mitigation", not a fix. The second remedy was a separate instance for accounts that volunteered to take every deployment first. Harry put his own account on it. He declined to celebrate: "I'd like to see 3 or 4 smooth ones in a row before I'm willing to give too much credit."

A year later an outage still ran 45 minutes while the team worked out how to turn off the flag behind it. The wider change took some six years. But note where it ended: the group's guidance now is to deploy in working hours, early in the week, because everyone who can help is at their desk. Nobody was persuaded to feel safer. The exposure got smaller, and the fear went with it.

#### Story three: the gatekeeper whose job became "go" (Flickr, with Starling)

When John Allspaw left Flickr he wrote to three layers of management above him to explain how a site that changed many times a day had stayed up. He ran operations. He held the go or no-go decision on every launch, and he kept it. What changed was what the decision was for: "A significant part of my job was working towards saying 'go', not 'no-go'."

Two details in the letter matter for your release managers and your change board. The first is that the dark launches and flags that made "go" safe "were concepts and tools created by Flickr Development, not Flickr Operations"; had operations built them, he did not believe they would have worked as well. The people who write the change must build its off switch. The second is that speed was never the rule: "When it wasn't safe, we slowed, and everyone was fine with that." And none of it was natural: "This culture was taught, not born."

Flickr hosted photographs. Starling is a bank, releases several times a day, and requires three approvals for every release, the last from an engineering lead, director or executive. Of its visible release ceremony its engineers said, "our auditors loved this one."

Nobody in this business loses the authority to say no. They acquire the job of making yes safe.

## 5. Objections

| # | The director's objection | Where the document answers | Strength | Two-sentence dispatch |
| --- | --- | --- | --- | --- |
| 1 | "We have not had a serious release incident. The three days work. Why touch them?" | Summary concedes it: "sound on safety". Findings 2 and 5 answer by implication. | Weak. The document agrees with the objector. | The three days test what simulators and elapsed time can show, then send the change to every client at once; they cannot show how real counterparties respond or exercise a path nothing uses, which is how Knight ran five clean days in production before losing $460 million. A record without incident is evidence about the changes you have made so far, and the FCA found the heavily overseen ones fail at 3.8% against 1.6% overall. |
| 2 | "Show me a bank like us that has done it." | Finding 6: none found. | Honest; stated as a weakness. | None has published it, and I will not pretend otherwise; the closest evidence is OANDA, whose bank clients took the same code in periodic releases and got slower fixes and harder diagnosis. That is why the first step is one service beside a running train: you produce the evidence before you rely on it. |
| 3 | "The regulator and our auditors will not accept it." | Rec 8. | Good, and buried at eighth. "None of them asks for three days" is the best short sentence in the document. | The rule texts ask for a recorded change, proportionate testing, an authorised approver and a way back; none asks for three days, and Starling releases several times a day with three named approvals. Your auditors test you against your own policy, so they write the pilot's policy with you before any code moves. |
| 4 | "You are proposing to test in production with clients' money, and our clients are banks who will not agree to be a canary." | Recs 3 and 4. | Strong on substance; never framed as an answer; no reason given for a client to consent. | The shadow run sends nothing and exposes no one, and the first real payments come from your own test accounts; it is today's model that learns "from production, all at once". The first client is one that has agreed, on one payment type, under an amount cap, which is a better offer than the one every client receives now. |
| 5 | "Flags are complexity. Knight Capital was a flag." | Rec 6. | Accurate; told as a warning inside a recommendation, so it frightens more than it reassures. | Knight was a reused flag with no owner, dead code left callable, and a deployment nobody checked; the SEC's remedy was a written double-check. Every one of those is a governance failure this paper closes: owner, purpose, removal date, never reused, second person on every money-moving change. |
| 6 | "Where is the speed? Amazon takes five days and you admit the risky change takes weeks longer. And what does it cost?" | Rec 3, one sentence; Rec 10, "a small team", "15% of its engineers", "years". | Weak. The document raises the objection against itself and does not answer it; no cost or return is stated. | The risky change is meant to go slower; the gain is every ordinary change, which goes from about five days to the next day's build because it no longer queues behind the risky one. The decision today costs one small team for two quarters, and the larger investment is decided on the pilot's figures. |
| 7 | "My engineers do not want a pager, and what happens to my testers and release managers?" | Rec 7. | Half. The Netflix condition is good; the roles question is handed back. | Do not move the pager until the platform and training are funded; Netflix found ownership without them risks burnout, and a half-measure where a release specialist remains is worse than either. Testers and release managers build the comparison tooling, own the pipeline and review ramp plans, and you tell them so before the pilot starts. |
| 8 | "The first incident under the new model will be mine. Under the train it is the process's." | Rec 10, OANDA, obliquely. | The right story, not aimed at the objection. | That is the honest reason approval gates survive: they insure the individual, and a board that approves over 90% of what it sees insures little else. Agree now, in writing, that the pilot's first incident is reviewed for what the evidence showed and who could act on it, and that on-call is never asked why they rolled back. |

The document names none of these as objections. A director reads to find their own objection stated in their own words; when it is absent they assume the author has not thought of it.

## 6. Emotional and practical register

### Cost of the status quo

Never felt. The register is uniformly level: "The cost is larger than the calendar time suggests." The strongest available images are present and unexploited:

- "A fix completed on a Wednesday morning reaches clients in the following week."
- "The interval is the same for a corrected label as for a change to the routing of outbound payments."
- OANDA's bank clients: "bugs judged non-critical went unfixed for many months because a fix had to wait for a release". This is a description of the reader, and it is presented as a description of someone else.
- "when a release misbehaves the first task is to establish which change is responsible."

None is turned towards the reader. Nothing says: this is your engineer, your client, your incident call.

### Attraction of the alternative

Never shown. The after-state exists only as mechanism. The nearest thing to an attraction is "Deployment then becomes frequent and uneventful". Harry's phrase, that "every deployment is a 'non-event'", is in the notes and is the director's version of the prize: no release nights, no weekend change windows. It is not used.

### Eighteen months on

There is no picture. The document ends on Microsoft's six years and on keeping the train. A sketch that the facts support: the pilot service ships a build every working day; material changes arrive switched off and are released client by client on evidence; the on-call engineer has rolled back several times and nobody asked why; one client has gone first on several changes and has asked to continue; risk and audit can show a flag's state on any date; the train still runs, for the ledger schema, the settlement file and the scheme dates, and carries less than it did.

### First commitment

Recommendation 10 has the right content: one owned service, policy agreed first, one client, two quarters, stop conditions. It has no date, no named decision, no owner, and no statement of what the directors are approving today as against deferring. It is tenth of ten, under a heading whose second half is "expect the programme to take years". The document closes on a planning assumption and asks for nothing.

## 7. Order, emphasis and form

### Form

It should not remain "findings plus ten recommendations". It should be an opinion with recommendations, addressed to the directors: a first-person paper of about 3,300 words with three recommendations and one ask, followed by an annex holding the operating detail.

Reasons:

- The author has not examined the client. An opinion is the honest form for expert judgment from outside, and it turns the missing data into checkable predictions.
- Directors are being asked to believe something and then authorise something small. That needs an argument with a turn and a single decision. A findings report distributes attention evenly across sixteen numbered items.
- The technical readers who must implement need the detail of Recommendations 2 to 6 and 9. They will read an annex. The directors will not read 769 words on payment rails before learning what they are asked to decide.

### Proposed order

| # | Section | Words | Content |
| --- | --- | --- | --- |
| 1 | Opening and opinion | 250 | The five days, what they are believed to buy, what they do not, the opinion, the claim on the reader. |
| 2 | What the delay costs you | 350 | The Wednesday fix; label and routing change paying the same; batches and diagnosis; OANDA's banks as a mirror. One before and after figure for an ordinary change. |
| 3 | What the three days buy and what they cannot see | 400 | Credit the soak (Finding 3, compressed). Then rail B, Knight's five days, RBS's back-out, FCA 3.8% against 1.6%, boards at 90%. One sentence of caveat on association. |
| 4 | The alternative, in one change | 450 | The routing example cut by a third, ending on the velocity sentence and the next-day figure. One figure: the exposure ladder. |
| 5 | Why I believe it, and what nobody has shown | 250 | FCA, OANDA comparison, Starling. Evidence limits stated once. |
| 6 | What changes for your people | 700 | The spine. A short table of who does what differently (engineer, manager, release manager and tester, on-call, risk and audit, director). Allspaw and Harry stories. Who will resist and why, including approval as blame insurance. |
| 7 | The first bad day | 250 | OANDA told properly. The commitment asked of directors. |
| 8 | What you will say to me | 350 | Four or five objections in the directors' words, two sentences each. The rest go to the annex. |
| 9 | What I ask you to decide | 200 | Three recommendations in a sentence each. The pilot: service, sponsor, client, two quarters, baseline first, stop conditions, the two answers that would change the advice. |
| 10 | Close | 150 | Eighteen months on in three sentences; the ask restated. |
| Annex A | Operating standard | 1,200 | Current Recs 2, 4, 5, 6, 9 as terse rules, with the three-rollbacks figure. |
| Annex B | Evidence and its limits; sources | As needed | Finding 6 in full, the FCA caveats, verification notes. |

### Cuts from the main text

- Amazon's 16 days and its figure: a pre-automation measure, not evidence for flags. One clause at most.
- LinkedIn's monthly release and Facebook's cut-day finding.
- Netflix's week-long canary and Facebook's 2008 to 2014 issue counts. Each costs a caveat and adds little the FCA and OANDA do not.
- Facebook Chat and the FFIEC sentence in Finding 4 (the FFIEC point moves to the regulator objection).
- Basel II parallel run: keep the phrase "banks will recognise this as a parallel run"; cut the rule citation.
- Square, Chrome's flag counts, Uber's Piranha, the Google Cloud 2025 outage, Amazon's rollback testing detail: annex.
- Uber's payment shadowing: one sentence in section 4; the figure to the annex.
- Four of the seven figures. Keep the exposure ladder, the FCA panel and Knight.
- The numbering of findings, and Finding 6 as a finding.

## 8. Opening and closing of the persuasive version

### Opening (about 250 words)

To the engineering directors

Every change this business makes, whether a corrected label or a new rule for routing outbound payments, waits about five days between the morning an engineer finishes it and the day a client sees it. The first two, on average, are spent waiting for the next train. The other three are spent in promotion and soak. At the end of them the change goes live for every client at once.

You accept that delay because it buys safety, and in part it does. The soak finds leaks, exhausted connection pools and end-of-day faults that no short test reaches, and I do not recommend giving that up.

Consider, though, what three days cannot tell you. They cannot tell you how the receiving banks will answer a real payment, because a simulator answers in their place. They cannot test a path that nothing exercises: Knight Capital's new code had been going onto its production servers for five days without incident when it was activated, and the firm lost more than $460 million in about 45 minutes. And when the UK regulator examined more than a million changes at 23 financial firms, it found that the major changes, which received the most oversight, failed at more than twice the rate of changes as a whole.

My opinion is that this business can put most changes into production within a day of their completion, and expose its clients to less unproven change than it does today. The means are well understood. The difficulty lies in what it asks of your people, and of you.

### Closing (about 150 words)

I am asking for three decisions now, and none commits the business beyond two quarters. Name one service that the business owns outright, and one director to answer for it. Have the six baseline questions answered from your own change and incident records before any code moves. Ask risk and audit to write the pilot's change policy with you.

The release train runs throughout. If the pilot's figures do not beat the baseline, stop: you will have spent a small team's time and learned exactly what your three days buy.

I ask one commitment of you personally. The pilot will have a bad day. On theirs, OANDA's senior managers reached first for more approvals and a separate testing team, and the post-mortem showed that the tests had caught the fault and been ignored. Decide today that your first question will be what the evidence showed, and who was free to act on it.

### The choices explained

- Address. "To the engineering directors" and "you" throughout. The current document never addresses its readers.
- First sentence. It starts with the cost, in the reader's own units, using the essay's best contrast (label against payment routing). "At once" is planted in paragraph one because it is the safety argument in two words.
- Concession second, and bounded. The soak is credited in specific terms (Finding 3's fault classes) so the reader sees the author is not a zealot. It is conceded as "in part", not as "sound".
- The turn. "Consider, though, what three days cannot tell you" is the tension the current document lacks. Three items, each from the essay: the rail B simulator point, Knight's five days, the FCA's 3.8% against 1.6%. Knight is used here for what the SEC order supports (time in production proved nothing about an unexercised path), not as a flag horror story. The FCA sentence gives the comparison and leaves the association caveat to section 3, where it gets one clause.
- The opinion. One sentence, first person, no "should". It makes a velocity claim with a unit ("within a day of their completion", which is Recommendation 2's "a build is in production within a day of being cut") and a safety claim stronger than parity ("less unproven change", which is Recommendation 3's "no client is exposed to an unproven rule"). I have avoided "vastly": the evidence supports a large gain for ordinary changes and a deliberate slowing of risky ones, and a director will trust the precise claim more.
- The last line of the opening. It tells the directors the paper is about them. That is the culture thesis, stated as a claim on the reader.
- The close asks for decisions, not agreement. Three, each small, each nameable in minutes. "None commits the business beyond two quarters" bounds the downside before the reader can raise it.
- "Stop" is offered explicitly. A recommendation with a stated exit is stronger than one with hedges, because the uncertainty is carried by the design of the step and not by the verbs.
- The final paragraph moves OANDA from a remark on duration to the personal commitment. It ends on the director's own behaviour because that is the one variable the research says decides the outcome, and because the current ending ("kept running until the evidence ... justifies retiring it") ends on the train.
- Limits observed. No invented figures, dates or client facts. The meeting date and pilot service are left for the commissioner to fill, and the paper should carry real ones.

## 9. The eight changes, in order of effect

1. Withdraw the concession. Replace "sound on safety and expensive on speed" with the argument the document already contains: the three days find what a soak can find, cannot see what has hurt financial firms, and expose every client at once. Lead with what the soak cannot see. This turns an optional speed case into a safety case directors must answer.
2. Quantify the velocity claim for this business. State the before and after for an ordinary change (about five days to the next day's build), say plainly that the risky change is meant to go slower, and deal with Amazon's "four or five business days" before the reader does. Move "The gain in velocity comes from freeing the ordinary changes" from word 2,900 to the first page.
3. Make culture the spine. Give it its own section of about 700 words, placed before the ask: who does what differently, who resists and why (including approval as blame insurance), and three stories told at length: OANDA's day after, Harry going first, Allspaw's "go". Add Google's "No-one will ask 'why did you roll back this change?'".
4. Change the form to an opinion addressed to the directors, at about 3,300 words, with three recommendations and one ask. Move the operating detail of Recommendations 2, 4, 5, 6 and 9 to an annex.
5. End on a dated, owned, bounded decision. Service, sponsoring director, first client, two quarters, baseline first, stop conditions, and the two findings that would change the advice. Put real dates in. Remove "expect the programme to take years" from the heading of the ask.
6. Convert hedges into predictions and conditions, and state the evidence limits once. Predict the baseline answers. Replace 32 instances of "should" with first-person recommendations and second-person instructions. Delete "the gain will be smaller than this assessment expects".
7. Answer the objections by name. A short section in the directors' own words, two sentences each, starting with "we have not had an incident" and "the first incident will be mine".
8. Make the reader feel both states. Turn the Wednesday fix and OANDA's banks towards the reader as their own situation, and give three sentences on the business eighteen months on, including the train that still runs for the changes that need it.
