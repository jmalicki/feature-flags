# Review of essay v2: an engineering director's read

Vantage point: engineering director at a payments / core-banking firm, twenty years in, owning availability numbers, an audit relationship, a budget and four teams. Read once straight through, then analysed.

## 1. Gut reaction

"I read it. It's a well-sourced reading list with a thesis stapled to the front. Nobody wrote it: there is no 'we', no firm, no number of ours, no cost, no ask. It tells me to replace a process it has never looked at, on the strength of Facebook Chat in 2008 and a newspaper, and then on the last page it admits that no bank has published before-and-after numbers, no auditor's verdict exists and no incumbent has done it. Those are the three things I'd need. I'm keeping sections 8 and 9 for my own staff engineers. I'm not forwarding it upward and I'm not spending capital on it."

Verdict: neither bin nor act. File as reference material.

I made up my mind twice. Provisionally at the section 1 heading and the second paragraph ("You are behind", "better overall"): I knew I was being sold to. Finally at the gap list in section 10, where the essay concedes the case.

Where I disagree with the commissioner: it is not filler. The fact density is high, the caveats are honest, and sections 5, 8 and 9 contain real thinking. The framing prose is what reads as generated; the content does not. "Not convincing" is right. The reason is that it is a literature review written at me, with no problem statement, no author and no proposal.

## 2. Where I stopped trusting the author

| Quoted sentence | Why |
| --- | --- |
| "You are behind, and that is an advantage" | Consultant opener. I release twice a week; most banks I know release monthly or quarterly. Nobody has shown me I am behind anyone I compete with. |
| "The soak is the stretch it spends in pre-production under test traffic, to see whether anything degrades." | Explains my own process to me. The author does not know who the reader is. |
| "It is a careful process, and this essay argues that you should replace it." | No statement of what is wrong with it. No incident, no cost, no pain. A solution with no problem. |
| "That is the whole claim of this essay: change, because the alternative is better overall." | "Better overall" is not a claim I can test, fund or be held to. Better at what, by how much? |
| "You would not be a pioneer. Facebook launched its chat system this way in 2008." | Followed by Amazon, Google, Netflix, Microsoft. The standard name-roll from every transformation deck I have sat through. |
| "That makes you a fast follower." | Flattery label. Told me nothing. |
| "Changes classed as major got extra oversight and failed more than twice as often as changes overall." | Major changes are riskier by selection. This proves nothing about batch size or oversight, and the author must know it. |
| "Even so, this is a regulator's own data on regulated firms, and its main findings point away from the large, infrequent, heavily approved release." | Twice weekly is not "infrequent". The FCA finding is about firms unlike mine in the direction that favours me. The preceding caveat (DevOps firms failed slightly more) is waved through with "Even so". |
| "Netflix is the clearest example, because its starting point looked like yours." | A video-streaming canary in 2012 does not look like a pre-production soak of a ledger. Claimed too much. |
| "The second question is the one you need answered." | Assertion. The essay never asks what my soak has actually caught in the last twelve months. |
| "A study of continuous deployment at Facebook and at OANDA, a currency-trading platform, records a comparison close to your own situation." | Those banks bundled "thousands of changes" per release. I bundle three days. Not close. |
| "The Financial Times, the newspaper, gives a before-and-after." | A newspaper website is the before-and-after for a payments firm. Also: twelve releases with one or two failures became 2,500 with up to 25. I am measured on incident count, not rate. This reads to me as ten times more failed releases. |
| "Wealthfront, an SEC-regulated investment firm, reported in 2010 that a rollback took about five seconds across its cluster." | A 2010 startup. Sixteen years old. Irrelevant to a system with settlement files and a schema. |
| "The tooling is a large job, but it is documented." | Documented for greenfield cloud services. My estate has batch, a shared database, vendor packages and possibly a mainframe. This sentence is where the cost was supposed to be. |
| "This is the test of a management team." | Lecturing. Written by someone who has never had to explain an outage to a risk committee and then decline to add a control. |
| "Tooling teams were about 5% of engineers at Facebook and 15% at OANDA, which spent two years on continuous deployment for its critical systems." | The only cost figure in the document, borrowed, and not converted into my headcount or money. |
| "Your objection is fair: a bad release at a photo site shows the wrong picture, and a bad release at your firm sends the wrong payment." | Puts a soft objection in my mouth so it can be answered. My real objections are about cost, audit and blame. |
| "No source states the rule, but it follows: a change that affects settlement should hold at small exposure for at least one reconciliation cycle." | Sensible, but the author is inventing practice and saying so. Fine from a practitioner; not from a compiler of sources. |
| "The EU's technical standards under its resilience act, as read in summary for this essay, require the approver to be independent" | The author did not read the DORA standards. That is the one regulation my auditor will open first. |
| "None of the texts read for this essay requires a soak period, a release train or promotion over several days." | My auditor does not audit me against the rule text. They audit me against my own change policy and last year's findings. Dodged. |
| "And no rule text mentions feature flags, so nobody has told you how a flag change is classified." | This is the central audit question, raised and abandoned in one sentence. |
| "None of these is a reason to keep the release train." | After a page of failures involving flags and staged rollouts, including Knight, Google and Stripe. Assertion against the evidence just presented. |
| "The harder work is the change in habits described in section 7, and it falls to managers." | Hands me the risk and the work in the final sentence, having priced neither. |

## 3. What I need answered and the essay does not answer

- **What problem I have.** The essay never states one. No change-failure rate, no incident, no lead-time cost, no client complaint. Step 1 says "Measure your three days", but only for waiting time. It never asks what the soak caught and what escaped it. That is the first question anyone who ran releases would ask.
- **Money.** Nothing. No flag platform cost, no observability spend, no cost of keeping old and new versions running side by side, no cost of shadow infrastructure for payments.
- **Headcount.** "15% at OANDA" is all I get. For four teams that is perhaps six engineers for two-plus years. From where?
- **Who loses their role.** Release managers, environment owners, the test team, CAB members. The essay says "give independent testers a real role" and the Netflix passage implies the release specialist goes. Not said plainly. I have watched two of these programmes cost people their jobs; I notice the silence.
- **The first time it goes wrong.** "Do not answer a failure with a gate" is advice, not a plan. What do I say to the CTO when a flag flip causes a client-impacting incident and the question is "why did we remove the soak?" The essay gives me no pre-agreed position, no risk acceptance, no sponsor.
- **The auditor.** Is a flag flip a change? Standard, pre-approved, or ticketed? Who may flip in production, and how is segregation of duties shown? How do I evidence what behaviour client X was receiving at 14:02 on a given day? Which flag combinations were tested? Acknowledged in one sentence, then dropped.
- **The clients.** My clients are banks. Section 8 gets close ("the first cohort is a client that has agreed to go first") but does not touch contracts, SLAs, release notes, client UAT, or whether clients run their own instances. A client who learns they were the 1% will ask why they were not told.
- **The flag system as a new tier-zero dependency.** What happens when the flag service is down or serves the wrong value? Not discussed.
- **How long, and what I stop doing.** "Expect years." Which roadmap commitments slip to fund it?
- **The first 90 days.** Six steps, no durations, no owners, no exit or kill criteria, no definition of what success of the pilot looks like.
- **Evidence from firms like mine.** The essay states there is none: "No incumbent's account." Monzo and Starling were built new. Uber, Stripe and Square are not core-banking vendors with bank clients.
- **Low-volume, high-value flows and period-end batch.** Admitted as gaps. That is half my estate.

## 4. Passages that moved me

- "Canarying was devolving into verifying endurance". I recognised my soak sign-off meeting. A quote from people who had my problem, not a claim about me.
- "Five days in production observed nothing because nothing used the path, and three days of soak would have observed the same nothing." The Knight retelling from the SEC order is the best passage in the essay. It attacks elapsed time as evidence using a case I already fear.
- The RBS finding that the bank "had only tested the consequences of backing out Version 2 to Version 1". A bank, a regulator, a specific untested back-out. I will check ours on Monday.
- Section 5's argument about what waits: "A flag puts the wait on the one behaviour that needs it." The one original argument, and it concedes that the risky change may arrive later. That honesty bought credit.
- Uber's shadowing with recorded processor responses, and "Banks already know this practice as a parallel run." Translated into my vocabulary; I can say "parallel run" to a risk committee.
- "In 2025 it still required three approvals for each of several daily releases, one of them a business approval." A bank that kept gates. Shows this is not all-or-nothing.
- The constraints paragraph (MAS on change boards, PCI on the approver, FFIEC on developers validating their own work). The author arguing against interest.
- "encode their current release process, manual steps and all, in a pipeline". The only step I could start without asking anyone's permission.
- "The argument that works with a supervisor is failure rate and reach per change, with evidence. It is never speed." Correct, and useful.

These worked because each is specific, from a regulated or money-moving setting, or concedes something.

## 5. Does it sound like someone who has run releases at a bank?

No. It sounds like a careful researcher who has read everything and operated nothing.

Tells against:

- Defines soak, canary, CAB, Region, idempotent and "The Financial Times, the newspaper" for a reader who runs these things.
- No first person, no "we", no war story, no number that is not from a link.
- Refers to itself constantly: "this essay argues", "the whole claim of this essay", "texts read for this essay", "No post-mortem found for this essay", "This essay's reading adds one", "as read in summary for this essay", "Research completed November 10, 2026". That is a research artefact describing itself.
- Every paragraph has the same shape: assertion, anecdote, bracketed citation. Thirteen figures. Bold-lead paragraphs. Aphoristic closers ("Ramp them too.", "It is never speed.").
- Never asks what the soak catches. Never mentions freeze periods, change tickets, emergency change, release notes to clients, client UAT, DR tests, schema changes on a shared database, flag combinations, or who holds production access.
- Treats "every client at once" as one multi-tenant production. Core-banking vendors often are not.
- Addressed to "engineering managers" while the argument needs director and CTO decisions.

Tells for:

- Knows that scheme releases come in April and October and SWIFT annually.
- Knows reconciliation cycles set ramp length and that a 1% ramp is useless on a few large payments a day.
- Separates safety ramp from product experiment for compliance.
- Knows the client is the unit of exposure.

Those four suggest good research or a briefing from a practitioner, not lived experience.

## 6. The document that would persuade me

- **Author.** A named person inside my firm, or one who did this at an incumbent, co-signed by our head of change or operational risk. Someone whose name is attached to the outcome.
- **Opening.** Our numbers. The last twelve months: releases, change-caused incidents, what the soak caught, what escaped it and reached clients, hours spent waiting against hours spent testing, what release weekends cost in people. If the soak is earning its keep, say so and stop.
- **Body.** One pilot: one named service, not on the settlement path, one team, one consenting client. Cost in money and heads. What is deferred to pay for it. Duration with dates. Success, exit and kill criteria. What does not change for clients and for audit. The change-policy amendment in draft: flag flip as a pre-approved standard change, who may do it, what evidence is logged. What happens to release management and test roles, stated plainly. The agreed line for the CTO and risk committee when the first incident comes, signed off in advance.
- **Evidence.** Four or five external cases at most, all regulated or money-moving: FCA review, Knight, RBS, Starling, Uber shadowing. Everything else in an appendix.
- **Length.** Four pages plus appendix. This essay is about 6,400 words.
- **Tone.** A memo from a colleague who will be in the room when it breaks. Costs and unknowns on page one, not page last. No definitions of terms I use daily. No telling me what I am.

## 7. The ten most damaging sentences, ranked

1. "No before-and-after numbers from a bank." (with "No auditor's verdict." and "No incumbent's account.") Concedes, on the last page, the three pieces of evidence the case needed.
2. "That is the whole claim of this essay: change, because the alternative is better overall." An untestable claim announced as the thesis.
3. "The tooling is a large job, but it is documented." The entire cost of the programme dismissed in a subordinate clause.
4. "The soak is the stretch it spends in pre-production under test traffic, to see whether anything degrades." Proves the author does not know the reader.
5. "And no rule text mentions feature flags, so nobody has told you how a flag change is classified." Names my biggest audit exposure and walks away.
6. "The EU's technical standards under its resilience act, as read in summary for this essay, require the approver to be independent" Admits the key regulation was not read.
7. "You are behind, and that is an advantage" Unevidenced judgement of my shop, dressed as flattery.
8. "The Financial Times, the newspaper, gives a before-and-after." The headline outcome evidence is a news site, and the numbers show more failures in absolute terms.
9. "Tooling teams were about 5% of engineers at Facebook and 15% at OANDA, which spent two years on continuous deployment for its critical systems." The only price tag, and it is someone else's, alarming and unconverted.
10. "The harder work is the change in habits described in section 7, and it falls to managers." Ends by handing me unpriced risk and calling it my job.
