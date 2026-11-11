# Machine tells: essay v4

Reviewed: `essay.md` at commit f0b283d. Line numbers refer to that file. The body (everything above "Sources") is 4,733 words including headings, captions and the numbered list. Counts below are for the 40 prose paragraphs, which a script splits into 175 sentences (one of the 175 is an artefact: the Brian Harry quotation at line 140 contains a full stop). Counts of patterns that need judgement, such as lists of three, were made by hand and are given as minimums.

## Where it stands

About two thirds of the way from "obviously generated" to "indistinguishable from a skilled professional". The surface is clean: no dashes, no "delve", no bold lead-ins, numbers that are real. A reader who is not looking will get to Finding 5 before anything catches. A reader who is looking will catch it in the Summary, because the habits are structural and they repeat.

The rewrite did swap formulae. Version two's tells were bold labels and citation stacks. Version four's are these:

- A paragraph that opens on a short flat verdict and closes on a moral. 23 of 40 paragraphs open with a sentence of 15 words or fewer; 24 of 40 end on an uncited generalisation or instruction.
- "The business should". "Should" occurs 32 times; 23 sentences have the form "[subject] should"; "the business" occurs 17 times and is never given a name, a system or a number of its own.
- A consultant who has not consulted. The section called "Findings" contains no observation of the client. The first person appears five times, and four of the five report what the author read.

Details follow in the order asked for.

## 1. Templates

### 1.1 Paragraph skeleton A: verdict, development, moral

Shape: a short declarative that states the paragraph's conclusion; two to four sentences that support it; a last sentence that says what it all means.

Openers of 10 words or fewer (16 paragraphs): lines 9, 11, 23, 25, 31, 39, 43, 47, 51, 61, 104, 110, 112, 122, 126, 132. Seven more open at 12 to 15 words (19, 33, 90, 98, 120, 138, 140). Examples:

- "The delay is a consequence of design." (9)
- "The cost is larger than the calendar time suggests." (23)
- "The promotion period is not idle time to be trimmed." (31)
- "The assumption is not necessary." (39)
- "The strongest evidence comes from financial services." (43)
- "Flags are cheap to add and expensive to keep." (110)
- "Approval should be relocated, not removed." (126)
- "Some changes should stay on the present model." (132)

Closers that generalise or instruct, with no new fact (24 paragraphs): lines 9, 11, 13, 25, 31, 33, 47, 49, 51, 55, 74, 76, 84, 90, 92, 98, 116, 120, 122, 128, 132, 136, 138, 140. Examples:

- "A schedule that penalises missing the train puts on board the changes that should have missed it." (25)
- "These are real classes of fault, and shortening the soak means ceasing to look for them." (31)
- "Surviving the week had become a substitute for evidence." (51)
- "The gain in velocity comes from freeing the ordinary changes that would otherwise have queued behind the risky one." (90)
- "None of these is a candidate for a ramp." (132)
- "The practice depends on leadership that holds its course after a failure." (138)

Paragraphs with both the short opener (15 words or fewer) and the moral closer: 15 (lines 9, 11, 25, 31, 33, 47, 51, 90, 98, 120, 122, 132, 136, 138, 140).

A quick test: delete the last sentence of each paragraph. In 24 cases no fact is lost.

### 1.2 Paragraph skeleton B: citation, then moral

Nineteen paragraphs carry footnotes. Only seven end on one (37, 39, 43, 102, 110, 112, 126), so the version-two habit of closing on a citation is gone. It has been replaced: in eight of the nineteen the last cited sentence is followed by one uncited sentence that tells the reader what the evidence meant (25, 49, 51, 92, 116, 120, 138, 140). In two of them the moral repeats what the source has just said:

- Line 49 lists four things the OANDA engineers reported, then: "On their account the same code, under the slower process, was harder to debug, less efficient to deliver and slower to repair."
- Line 51 quotes Netflix on "verifying endurance … rather than correct functionality", then: "Surviving the week had become a substitute for evidence."

Three of the eight morals begin "The business should" (92, 116, 140).

### 1.3 Paragraph skeleton C: concede, then reassert

Five times a limitation is granted in one sentence and overridden in the next:

- 37 to 39: "the business has correctly chosen safety … The assumption is not necessary."
- 47: "These are associations, and they should be read with care … The central finding stands nonetheless".
- 55: "It does not establish what the business's own figures would be. That is a reason to proceed by measured stages … and not a reason to stay where it is."
- 76: "The build itself still needs a soak … That soak should move into production."
- 90: "The routing change itself reaches every client later … The engineer, however, has evidence".

Each is fair. Five in one document, all resolved in the essay's favour within two sentences, reads as a routine.

### 1.4 Section skeleton in the recommendations

Eight of the ten recommendations open their body with a "should" sentence (1, 2, 3, 4, 7, 8, 9, 10). The other two open with a problem statement (5) and an antithesis (6).

Eight of ten then go to a named organisation (2 Amazon; 3 Uber and Basel; 4 Square; 5 RBS, Google, Amazon; 6 Chrome, Uber, Knight, Google Cloud, Microsoft; 7 Netflix; 8 Starling; 10 OANDA, Microsoft). Recommendations 1 and 9 have none.

The full skeleton is: "X should Y"; a firm that did or failed to do Y; what its engineers said; a condition or return to "the business". Recommendations 4, 7 and 8 are the bare form. Recommendation 4 in one paragraph: "The unit of exposure should be the client" / "Square learned this when" / "Its engineer wrote afterwards that" / "Where the clients are themselves banks" / "What the business may ramp at its own pace is". Recommendation 7: "The team … should deploy it and be paged for it" / "Netflix found that" / "It also found that" / "The recommendation therefore carries a condition".

### 1.5 Heading, restatement, restatement

All six finding headings are full declarative sentences; all ten recommendation headings are imperatives. The body then says the heading again, and three recommendations are also stated in the Summary, so the reader meets them three times:

- Heading 3 "cannot be compressed within the model" / "The promotion period is not idle time to be trimmed" (31).
- Heading 4 "The trade between speed and safety comes from coupling deployment to release" / "speed and safety do trade against each other … The trade follows from one assumption" (37).
- Recommendation 9: heading "Keep a pre-production hold where a ramp does not fit"; first sentence "Some changes should stay on the present model"; last sentence "None of these is a candidate for a ramp".
- Summary "Rollback should become a rehearsed, pre-authorised operation that the on-call engineer can execute without seeking approval" (11) / "pre-authorised actions that the on-call engineer may take without seeking approval" (104).
- Summary "Deployment should be separated from release, with every material change shipped disabled behind a flag" (11) / "Every material change should be written so that its new behaviour sits behind a flag that is off when the code ships" (74).
- Summary "Each such change should be proven in production … before it is released generally" (11) / heading "Prove each material change in production before releasing it".

## 2. Sentence-level formulae

### 2.1 Lists of three (at least 27)

Three parallel clauses:

1. "it imposes roughly five days of delay …, it forces changes into batches, and it cannot be made faster" (7)
2. "the long hold has to be applied to the whole release, everything in the release waits for it, and everything written in the meantime queues behind it" (37)
3. "Major changes are riskier by definition, the FCA did not advise …, and it also found" (47)
4. "is in production within a day of being cut, is judged against real traffic, and carries one day of changes" (76)
5. "The engineer, however, has evidence …, no client is exposed …, and every other change … ships without waiting" (90)
6. "recorded what the old system sent and received, ran delayed copies …, and compared the request" (92)
7. "reused a flag …, left that function in the code, and copied its new software" (112)
8. "code rolled out region by region, never exercised, and then triggered everywhere at once" (112)
9. "for deciding what the flag guards …, for building the shadow comparison, and for removing the flag" (116)
10. "what code review asks for, what counts as finished, and what is recognised when performance is assessed" (116)
11. "The comparison tooling has to be built, the pipeline owned and the ramp plans reviewed" (122)
12. "the team enabled a batch of flags, the service became unresponsive at peak, and disabling the flags did not restore it" (140)
13. "a sequence of bounded steps, each measured against the baseline, with the release train kept running" (140)
14. "How long did the last real rollback take, who authorised it, and had that path been rehearsed?" (67)
15. The Summary's "three matter most", followed by three consecutive "should" sentences (11)

Three parallel words or phrases:

1. "on its own, to a few clients first, on evidence" (9)
2. "start a build, perform a deployment or run a test" (25)
3. "built, deployed and running in production" (39)
4. "harder to debug, less efficient to deliver and slower to repair" (49)
5. "small, frequent and carefully exposed change" (55)
6. "A library upgrade, a new database driver, or a change to the runtime or a schema" (76)
7. "on a single machine, then in one region, then outward in waves" (76)
8. "clients, amounts and destinations" (84)
9. "routinely, for ordinary changes, with tooling that makes it cheap" (92)
10. "tooling, training and slack" (120)
11. "an engineering lead, director or executive" (126)
12. "Three releases …, three sets of environments and three times as many partner test windows" (33)

There are also at least eight lists of four or five (lines 11, 31, 80, 82, 86, 92, 116, 128, 132), which is to the draft's credit: the count is not always three. The tell is position. Seven paragraphs end on a three (7, 49, 76, 90 in its middle sentence, 92, 116, 140), and the document's last sentence is one.

### 2.2 "X, so that Y" (6, five of them result clauses)

- "treats deploying code and releasing behaviour as a single event, so that all the caution has to be applied to the whole release at once" (9)
- "carries half a week of unrelated changes, so that when a release misbehaves" (23)
- "disabled behind a feature flag, so that it is built, deployed and running" (39)
- "should be written so that its new behaviour sits behind a flag" (74, purpose)
- "is stored on the payment, so that every later event" (84)
- "ceases to be exercised on the day the flag reaches every client, so that switching it off thereafter is an untested change" (110)

"So that" for result is rare in working prose, where people write "so" or "which means". Five in 4,700 words is a fingerprint. A trailing ", because" clause does the same job six more times (23, 74, 76, 102, 112, and "and because" in 86).

### 2.3 Paired contrast (at least 25)

Balanced antithesis:

- "sound on safety and expensive on speed" (7)
- "cheap to add and expensive to keep" (110)
- "frequent and uneventful" against "a deliberate act" (74)
- "a flag can reverse a decision and cannot reverse a payment" (92)
- "roll back first and investigate afterwards" (104, paraphrasing Google)
- "The tooling for all of this is well understood. The difficult part is" (11)
- "carries one day of changes where a train carries half a week's" (76)
- "the same for a corrected label as for a change to the routing of outbound payments" (19)

"A and not B", ", not B", "and never B" (5):

- "a reason to proceed by measured stages, as recommended below, and not a reason to stay where it is" (55)
- "follows the stored choice and not the current position of the flag" (84)
- "the client and not a random share of traffic" (98)
- "exactly as it ran, retained under its hash, and never a fresh build from older source" (104)
- "relocated, not removed" (126)

The author's own prose never uses "rather than" or "instead" (the one "rather than" is inside the Netflix quotation). "And not" is doing their work three times. That looks like a word placed on a banned list and replaced by its nearest neighbour.

Can and cannot, does and does not:

- "Pre-production can establish that the messages are well formed … It cannot establish how the receiving banks on rail B will respond" (82)
- "The evidence therefore establishes that … It does not establish what the business's own figures would be" (55)
- "A shadow run shows what would be sent and nothing about how the banks on B reply" (86)
- "found failure concentrated in large changes and found no sign that heavyweight approval offset it" (47)
- "Time in production proved nothing about a path that was never exercised, and a soak would have proved as little" (112)
- "production is running more than one system, whereas the regression pack and the scheme certification each tested one" (110)

The "establish / not establish" pair at 55 and 82 is the same sentence frame used twice.

Flat negations as thesis: "is not idle time to be trimmed" (31), "does not help" (33), "is not necessary" (39), "does not make testers or release managers redundant" (122), "None of them asks for three days" (128), "None of these is a candidate for a ramp" (132), "None of the accounts I read gives figures" (122).

Overall, 56 of 175 sentences (32%) contain not, no, never, nothing, none, cannot, without or whereas.

### 2.4 Openers

- 47 of 175 sentences (27%) begin with "The".
- 91 of 175 (52%) begin with The, A, An, This, That, These, It, Each, Every, Some or None.
- 7 begin "The business".
- 19 begin with the name of an organisation ("Facebook measured", "Square learned", "RBS backed out", "Google advises", "Amazon tests", "Netflix found", "OANDA spent" and so on).
- 32 (18%) begin with anything other than the grammatical subject, and 11 of those 32 are in the worked example (lines 80 to 92), which is the best-written stretch.

Outside the worked example, about one sentence in eight starts with something other than its subject.

### 2.5 "Should" chains

"Should" appears 32 times, "should be" 14. Twenty-three sentences are "[subject] should": Deployment, Each such change, Rollback (11); The business (61); Every material change (74); That soak (76); A change (80); The business (92); The unit of exposure (98); The business, What is restored (104); Each flag, It, The author of a change, The business (116); The team that writes a service (120); Approval (126); Risk and audit (128); Some changes (132); The business, The change policy for that service, The pilot (136); The business (140).

Worst runs:

- Line 136, five sentences: "The business should start … The change policy for that service should be agreed … One client should be recruited … The pilot should run … A pilot on that scale occupies a small team."
- Line 116: "Each flag should accordingly have … It should never be reused. The author of a change should be responsible … The business should expect the same resistance and should change".
- Line 11: "Deployment should be separated … Each such change should be proven … Rollback should become … the programme should be planned".
- Line 104: four "should" in five sentences.

### 2.6 Punctuation as a scrubbed surface

The prose has no dash of any kind, one semicolon (51) and one parenthesis (128). Fifteen sentences use a colon, twelve of them to introduce a list or gloss (7, 31, 37, 47, 80, 86, 92, 112, 120, 128, 132, 140). So there are no semicolon stacks to report; the colon has taken over. A 4,700-word professional document with exactly one semicolon and no dash reads as a rule applied, and the colon-then-list frame is as recognisable as the dash was.

### 2.7 Appositive glosses (13) and tacked-on relative clauses (8)

Glosses: "OANDA, a currency-trading platform that" (49); "Monzo and Starling among them" (55); "the instant-payments rail, B" and "the batch clearing rail, A" (80); "a parallel run, a practice regulators have written into capital rules" (92); "a patched variant, Version 2A" (102); "The old path, which is the fallback," (110); "the last of them a 'Business Approval' from" (126); "Brian Harry, who ran the group," and "a first ring, a separate instance for accounts that volunteered for the risk" (140); "hotfixes, which bypass most of the three days," (68); "major, which received additional oversight," and "Emergency changes, for which some of the normal assurance steps are expedited," (43).

Relative clauses that bolt on one more point: ", which the FCA said" (43); ", whose policies forbade the practice and who therefore took it" (49); ", after which Uber migrated" (92); ", and which a rollout held stable per merchant would have confined" (98); ", which removed 1,381 of them" (110); ", which is that the platform and the training are funded first" (120); ", of which its engineers remarked that" (126); ", after which senior management's first instinct" (138).

", of which its engineers remarked that" is the stiffest phrase in the document. Nobody speaks or writes that way now.

### 2.8 Sentences ending on an abstract noun phrase

"a consequence of design" (9); "a change of culture" (11); "an untested change" (110); "a substitute for evidence" (51); "the decisive control" (92, mid-sentence); "a candidate for a ramp" (132); "the conditions at Knight" (128); "the planning assumption" (140, before the colon); "a failure" (138).

### 2.9 Rhythm

Mean sentence length 24.1 words, standard deviation 12.3, range 4 to 61. 98 of 175 sentences (56%) are between 15 and 35 words. Sixteen are 8 words or fewer; of those, six open a paragraph and two close one, so half of the short sentences are placed for effect. Twenty-one are 40 words or more.

Paragraphs run from 32 to 203 words, median 104.5; 32 of 40 fall between 60 and 150. Twenty-six of 40 have three to five sentences. In Findings 1 to 4 the seven paragraphs have 4, 4, 5, 4, 4, 4 and 4 sentences.

The length spread is wider than in most generated text. The regularity is in placement: short sentence first, long ones in the middle, medium-length verdict last.

### 2.10 Signpost sentences (11)

Sentences whose only job is to announce the next one:

- "The recommendations in the second half of this document are specific, and three matter most." (11)
- "Firms that have measured these effects report them plainly." (25)
- "The strongest evidence comes from financial services." (43)
- "These are associations, and they should be read with care." (47)
- "The nearest thing to a controlled comparison is OANDA" (49, opening clause)
- "Two further cases complete the picture." (51)
- "Netflix shows what a long hold can decay into." (51)
- "An example shows what each rung contributes." (80)
- "Knight Capital shows what a neglected flag can do." (112)
- "The wider programme is a larger undertaking, and the published accounts are consistent about that." (138)
- "Microsoft's Azure DevOps group gives the most candid account of the duration." (140)

## 3. Vocabulary fingerprint

None of the phrases suggested in the brief as examples ("in other words", "in effect", "precisely", "what remains", "it falls to") occurs. The actual ones:

| Word or phrase | Count | Note |
| --- | --- | --- |
| should | 32 | 23 as "[subject] should" |
| the business | 17 | 8 as "the business should" |
| each / every | 19 / 19 | "every client", "every change", "each stage" |
| prove, proved, proves, proven, unproven | 13 | includes two headings |
| the same | 12 | "the same change", "the same event" twice, "the same shape", "the same thing", "the same resistance" |
| behind | 12 | "behind a flag" and "queues behind" |
| found | 11 | 5 as "found that" |
| real | 10 | "real work", "real classes of fault", "real traffic" twice, "real money" twice, "real mix", "real distribution", "real requests", "real rollback" |
| cannot | 8 | |
| establish, establishes, established | 8 | 7 in prose, 1 heading |
| still | 7 | "would still wait … would still reach" (33) |
| therefore | 6 | lines 19, 49, 55, 104, 120, 128; plus "accordingly" (116), "nonetheless" (47), "however" twice, "then" as a connective (37) |
| so that | 6 | see 2.2 |
| shows what / show how | 5 | "An example shows what", "Netflix shows what", "Knight Capital shows what", "A shadow run shows what", "The answers will show how much" |
| at once | 5 | one inside a quotation |
| ordinary | 4 | "ordinary practice", "ordinary changes" twice, "ordinary operation" |
| rehearsed, rehearsal | 4 | |
| material | 4 | "material change" three times |
| this assessment / this document | 3 / 1 | see section 6 |
| "On that …" / "On their account" | 3 | "On that design" (76), "A pilot on that scale" (136), "On their account" (49) |
| ceasing, ceases | 2 | "ceasing to look", "ceases to be exercised" |

Single uses that carry the register of generated formal prose: "report them plainly" (25); "states the constraint exactly" (37); "complete the picture" (51); "read with care" and "stands nonetheless" (47); "the decisive control" (92); "in earnest" (102); "thereafter" (110); "The instructive detail" (112); "had the same shape" (112); "from the outset" and "constitutes" (128); "warrants a rehearsal" (132); "a larger undertaking" (138); "holds its course" (138); "the most candid account" (140); "openly and early" (122); "a deliberate act" (74).

"Real" deserves a note. Ten uses in 4,700 words, most of them intensifiers ("real work", "real classes of fault"), is the word a writer reaches for when the sentence has no particular in it.

## 4. Evidence handling

There are 31 footnote markers and 14 quotations.

Organisation as grammatical subject, past-tense verb, one sentence, one footnote: 19 sentences begin with the organisation's name. Reporting verbs after an organisation or its staff: "found" 5 as attribution (25, 43, 47, 120 twice), "wrote" 3 (51, 98, 140), "report" 2, and one each of states, said, notes, advises, observed, remarked, records. The verbs vary; the frame does not.

The "its engineers" frame, four times:

- "its engineers later wrote that they had been" (51)
- "Its engineer wrote afterwards that the method had concealed" (98)
- "of which its engineers remarked that" (126)
- "The engineers who documented the experience report that" (49)

Stacks of one sentence per firm:

- Line 25: Amazon, LinkedIn, Facebook, one sentence and one footnote each, then the moral.
- Line 104: Google, Amazon, one sentence and one footnote each.
- Line 39: Facebook and the FFIEC handbook in one sentence, a footnote each.
- Line 110: Chrome and Uber in one sentence, two footnotes.

Line 25 is the version-two citation stack surviving intact.

Quotations: 2 are introduced by a colon (37, 140), 9 are run into the sentence after "that" or a verb, 3 are fragments in apposition. That is varied enough. What is uniform is their treatment: every quotation is a clause of evidence inside a sentence the author controls, and none is given room. The Harry quotation at 140 is the only one that sounds like a person, and it is the best moment in the document.

Length per case: most cases get one or two sentences. Knight gets four, OANDA gets three in Finding 5 and five in Recommendation 10, Azure DevOps gets five. So length does vary, and the longer ones are better. The short ones (Square, Chrome, Uber's Piranha, Google's rollback advice, Amazon's rollback test, Starling) are told at identical distance: what they did, in one clause, and the lesson.

Dates: twelve sentences place a year in the first clause or directly after the subject ("In 2021 the Financial Conduct Authority", "In 2012 its canaries", "In 2012 Knight", "In 2025 it still", "Between 2008 and 2014", "by 2024 the handbook").

Two small things to check against sources. The Harry quotation reads "If we'd tried to do it all at once. I'm sure we would have failed." with a full stop where a comma belongs; if that is the original's typo, leave it, and if not, fix it. The Netflix quotation at 51 has curly quotation marks nested in straight ones, the only curly marks in the file.

## 5. Smoothness

The register never moves. Three stretches show it.

Lines 9 to 11 (201 words):

> The delay is a consequence of design. The model treats deploying code and releasing behaviour as a single event, so that all the caution has to be applied to the whole release at once. Firms that have separated the two, including firms that move money, deploy daily with new behaviour switched off and release each behaviour on its own, to a few clients first, on evidence. They develop substantially faster, and the best available evidence, including the UK regulator's, indicates that they do so without loss of stability.
>
> I recommend that the business make the same change. The recommendations in the second half of this document are specific, and three matter most. Deployment should be separated from release, with every material change shipped disabled behind a flag. Each such change should be proven in production through a shadow run and a controlled ramp before it is released generally. Rollback should become a rehearsed, pre-authorised operation that the on-call engineer can execute without seeking approval. The tooling for all of this is well understood. The difficult part is the change in working practice it requires of engineers, managers, risk and audit, and the programme should be planned as a change of culture.

Every sentence is a complete, balanced proposition. No firm is named, no number given except "three". "Substantially faster" has no figure behind it anywhere in the document. "The best available evidence … indicates" is how a model hedges.

Lines 126 (last sentence) to 128 (174 words):

> In 2025 it still required three approvals for every release, the last of them a "Business Approval" from an engineering lead, director or executive, while releasing several times a day.
>
> The rule texts I have read ask for a recorded change, proportionate testing, an authorised approver (in some texts explicitly someone other than the author) and a way back. Some go further, and Singapore's guidelines expect a change advisory board and independent quality assurance. None of them asks for three days. Auditors, however, test a firm against its own change policy, and that policy describes the process the firm has today. Risk and audit should therefore be engaged as co-authors of the new policy from the outset. They will need to define what a flag change is: who may make one, who approves it, how its state on a given date is evidenced, and what constitutes an emergency. A firm in which a developer can enable money-moving behaviour for a client with no record and no second person has recreated the conditions at Knight.

The content here is good and the point about auditors testing against the firm's own policy is the kind of thing a practitioner knows. But the author has "read" rule texts; the author has not sat across from an auditor. "Engaged as co-authors … from the outset" is brochure language. "Auditors, however," "therefore," and the colon list arrive on schedule.

Lines 136 to 138 (232 words, quoted to the end of the OANDA account):

> The business should start with a single service that it owns outright, with no vendor package or mainframe component in its path. The change policy for that service should be agreed with risk and audit before any code moves. One client should be recruited to go first. The pilot should run alongside the train for two quarters, with the six baseline measures counted throughout and the conditions for stopping agreed in advance. A pilot on that scale occupies a small team.
>
> The wider programme is a larger undertaking, and the published accounts are consistent about that. OANDA spent two years perfecting continuous deployment for its mission-critical trading systems and at the time of writing had about 15% of its engineers working on tooling. It also records a failure that "cost the company a significant amount of money within seconds", after which senior management's first instinct was to demand more approvals and "a full-blown, separate and traditional testing team". The post-mortem established that unit tests had caught the bug and that their failures had been disregarded among false alarms, and the remedy the engineers secured was to make the test results part of the decision to deploy. Separately, when executives more inclined to traditional process took over in mid-2012, deployments fell by 23% although the engineering team was much the same. The practice depends on leadership that holds its course after a failure.

"A small team" has no number. "A larger undertaking" is a euphemism where a consultant would give a range. The OANDA story is a good one, about a company that nearly reverted after losing money in seconds, and it is told in the same even voice as the instruction to recruit a client.

What is missing across the whole document:

- Any sentence that could only have been written by someone who has done this: what the first shadow comparison looked like, what the on-call engineer said, which objection the head of audit raised.
- Any quantity the author is prepared to guess. The essay has dozens of other firms' numbers and none of its own beyond the five-day arithmetic.
- Any asymmetry of interest. No case bores the author and none excites them. Knight comes closest.
- Any sentence that is not a statement. There are no questions outside the numbered list, no asides, no "I think", no "I doubt".
- Any loose end. Every paragraph resolves, and even the limits of the evidence (55) are tied off inside the paragraph that raises them.

## 6. Residue from earlier drafts

### 6.1 Version-three cadence

Short subject-verb-complement sentences survive, mostly at paragraph edges:

- "The delay is a consequence of design." (9)
- "The assumption is not necessary." / "This is established practice." (39)
- "Of all changes, 1.6% failed. Of the changes that firms classed as major, which received additional oversight, 3.8% failed." (43)
- "The code then ships disabled in that day's build." (84)
- "Every change made near a live flag has to work in both states." (110)
- "It should never be reused." (116)
- "None of them asks for three days." (128)
- "Scheme mandates take effect on the schemes' dates. None of these is a candidate for a ramp." (132)
- "One client should be recruited to go first." / "A pilot on that scale occupies a small team." (136)

Two whole paragraphs are still in the version-three voice. Line 33 is four plain declaratives of 12, 22, 19 and 17 words with no subordination. Line 136 is five. Line 19 is close.

### 6.2 Self-reference (9)

- "This assessment finds that" (7)
- "The recommendations in the second half of this document" (11)
- "This assessment rests on" (13)
- "as recommended below" (55)
- "than this assessment expects" (70)
- "The recommendation therefore carries a condition" (120)
- "I have found" / "I found" (55), "None of the accounts I read" (122), "The rule texts I have read" (128)

"This assessment" acts as a grammatical agent three times (it finds, rests and expects). That is version two's "this essay" renamed.

### 6.3 Drafting machinery visible to the reader

- Line 144: "Reviews of the previous draft are in reviews/essay-v2." A client document does not link to critiques of its own earlier drafts. "The synthesis report" in the same line also exposes the pipeline.
- Line 88: the alt text for the ladder figure reads "dormant and shadow rungs seen by nobody, then staff, a small cohort, and everyone". The text's ladder at line 80 is "disabled, then run in shadow, then exercised with real money at a synthetic client, then released to one consenting client, then widened". The figure belongs to an earlier draft.
- "The long hold" appears at line 37 as if already introduced, and again as "a long hold" (51) and "a pre-production hold" (heading 9). It is never defined; it is a term from a previous version.
- Recommendation 1 poses "six questions". Line 136 calls them "the six baseline measures".
- "The practice" at line 138 has no clear antecedent.
- Finding 5's heading says "Firms that separated the two", relying on the previous section for what "the two" are.

### 6.4 Explaining what the reader knows

- "Code can be deployed with its new behaviour disabled behind a feature flag, so that it is built, deployed and running in production while no client observes any difference" (39). The reader runs an engineering organisation.
- "OANDA, a currency-trading platform" (49) is fine. "Banks will recognise this as a parallel run" (92) addresses banks in general where it should address this reader.
- "A fix completed on a Wednesday morning reaches clients in the following week" (19) explains the client's own schedule to the client.

### 6.5 Hedge, then assert

Covered in 1.3. Also: "and are careful elsewhere not to claim it as the cause of their results" (51); "although the FCA notes that this may be partly because an incident was already open" (43); "perhaps by several weeks" (90). The caveats on the FCA data are right and should stay. The problem is only that each is followed at once by the reassurance.

## 7. False notes in the consultant persona

### 7.1 Findings that are not findings

Line 13 says the assessment "has not drawn on the business's own change and incident data". Line 7 nonetheless says "This assessment finds that the model is sound on safety". Nothing was examined that could support "sound". Similar claims:

- "the business has correctly chosen safety" (37). On what evidence was the choice correct?
- "Each train carries half a week of unrelated changes" (23), and "Finished work sits idle, and the engineer who wrote it has moved on" (23). These are deductions about a generic release train, stated as observations of this one.
- "In a payments business it contains integration packs run against simulators for the payment schemes, a performance run and at least one batch cycle" (31). A consultant who had looked would write what this promotion period contains. "In a payments business" admits that nobody looked.
- "The typical interval between finished and live is therefore about five days" (19) is arithmetic from the schedule, under a heading that calls it a finding.

Findings 1 to 4 are reasoning from a description. Findings 5 and 6 are a literature review. The honest title for the section is something like "The case", and the honest verb at line 7 is "argues".

### 7.2 "The business" as a placeholder

Seventeen uses. The business has no name, no product, no count of engineers or clients, no named system. The places where the blank shows most:

- "Where the clients are themselves banks" (98). The consultant does not know who the client's clients are.
- "with no vendor package or mainframe component in its path" (136). Nor whether the business has a mainframe.
- "The equivalent for the business is a daily build that bakes on a small slice of production" (76). A slice of what?
- "Suppose outbound account-to-account payments below a threshold amount" (80). The worked example is hypothetical. An assessment would use a change from the client's backlog.
- "the business should address the question openly and early" (122). Addressed by whom, to whom?
- "A pilot on that scale occupies a small team" (136).

The term also slides: "the business" (17), "a firm" and "the firm" in 128, "a payments business" (31), "a financial firm" (55).

### 7.3 Who is speaking

Three voices alternate:

- "I": five times (11, 55 twice, 122, 128). Four of the five report reading or failing to find something. Only "I recommend" commits to anything. Between line 11 and line 55 there are fourteen paragraphs without a person in them.
- "This assessment" as agent: three times (7, 13, 70).
- Impersonal passive: "should be separated", "should be proven", "should be agreed", "should be recruited", "should be engaged", "should be pre-authorised" (14 "should be").

The first person appears only where the author is disclaiming. An assessor's "I" does the reverse: it appears where the judgement is the author's own and could be wrong.

### 7.4 Advice with no owner, date or cost

Ten recommendations and not one names who in the client acts, by when, or what it costs, other than "two quarters" for the pilot and "years" for the programme. "The platform and the training are funded first" (120) is as close as it gets. A real set of recommendations is uneven: two or three the author would fight for, some that are housekeeping, one the author expects to be refused. Here all ten are delivered at the same weight, and the Summary's "three matter most" is the only ranking.

## 8. Rewrites

The rewrites keep to facts already in the essay. Where a rewrite needs a fact the essay does not have, it says so in square brackets.

### 8.1 Ten sentences

1. Line 7. "This assessment finds that the model is sound on safety and expensive on speed: it imposes roughly five days of delay on every change regardless of risk, it forces changes into batches, and it cannot be made faster without weakening the protection it exists to provide."

    Formula: self-reference as subject, balanced antithesis, colon, three parallel "it" clauses.

    Rewrite: "The three-day soak is not wasted, and nothing here argues for shortening it. But a one-line label fix waits about five days for it, bundled with half a week of other people's changes, and I can see no way to cut the wait that does not also cut the soak."

    Why: it starts with what the author will not recommend, which is a commitment. The label fix is a particular. "I can see no way" puts a person behind the claim and admits it could be wrong.

2. Line 25. "A schedule that penalises missing the train puts on board the changes that should have missed it."

    Formula: closing aphorism built on a reversal ("missing … should have missed").

    Rewrite: delete it, and end the Facebook sentence with the inference: "…was of lower quality than code pushed on other days, which is what you would expect of work finished against a cut-off."

    Why: the point becomes a subordinate remark on a measurement and stops being a motto. The paragraph ends on evidence.

3. Line 51. "Surviving the week had become a substitute for evidence."

    Formula: moral that paraphrases the quotation before it.

    Rewrite: "The business's soak is three days where Netflix's was seven. Whether it has gone the same way is what the second baseline question is for."

    Why: it turns the case toward the client and toward something checkable, and it leaves the Netflix engineers' own phrase as the memorable one.

4. Line 126. "Approval should be relocated, not removed."

    Formula: six-word slogan, "X, not Y", with alliteration.

    Rewrite: "Starling is the answer to anyone who assumes that releasing several times a day means nobody signs anything."

    Why: it names the objection a risk officer would actually raise and lets the Starling facts that follow do the persuading. No slogan.

5. Line 110. "Flags are cheap to add and expensive to keep."

    Formula: balanced antithesis as topic sentence.

    Rewrite: open on the numbers the paragraph currently ends on. "Chrome had 263 flags at the start of the releases one study examined and 1,040 at the end. Uber let its own pile up until it built a tool to delete the stale ones, which removed 1,381." Then the three costs.

    Why: a fact with a number in the first position; the generalisation is left for the reader to draw.

6. Line 55. "That is a reason to proceed by measured stages, as recommended below, and not a reason to stay where it is."

    Formula: "a reason to X and not a reason to Y", plus a signpost.

    Rewrite: "I would still go ahead. That gap is why recommendation 10 asks for a two-quarter pilot beside the train before anything larger."

    Why: a four-word judgement in the first person, then a specific consequence. The uneven lengths are what a person produces when one thought is simple and the next is not.

7. Line 47. "The central finding stands nonetheless: a regulator examining regulated firms found failure concentrated in large changes and found no sign that heavyweight approval offset it."

    Formula: concession overridden by "nonetheless", colon, doubled "found".

    Rewrite: "Even read that cautiously, the review puts the failures in the large changes, and it was the FCA itself that questioned whether boards approving more than 90% of them were assuring anything."

    Why: the caution is subordinated into four words. "Heavyweight approval" becomes the actual figure. The emphasis falls on who said it.

8. Line 116. "The business should expect the same resistance and should change what code review asks for, what counts as finished, and what is recognised when performance is assessed."

    Formula: double "should", three parallel "what" clauses.

    Rewrite: "Expect the same here. It will not shift until reviewers ask to see the shadow comparison, a change with a live flag stops counting as finished, and appraisals stop rewarding the deploy date."

    Why: there really are three levers, so three items stay, but each is now a different concrete thing with its own verb. The grammar is no longer "what … what … what".

9. Line 138. "The practice depends on leadership that holds its course after a failure."

    Formula: abstract moral with a stock metaphor, placed last.

    Rewrite: "Whoever sponsors this should be asked now what they will do the morning after the first expensive failure, because at OANDA the first answer was a separate testing team."

    Why: it converts the moral into an action with a time and a person, and reuses the detail from the source.

10. Line 140. "The business should take that as the planning assumption: a sequence of bounded steps, each measured against the baseline, with the release train kept running until the evidence from its own systems justifies retiring it."

    Formula: "The business should", colon, three-part list, final abstraction. It is also the last sentence of the document.

    Rewrite: "Plan on Harry's timescale, which was six years. Keep the train running throughout, and retire it when the baseline numbers from the business's own systems say it is no longer catching anything the ramp misses."

    Why: the number comes first. The condition for retiring the train is stated as something that can be observed. The document ends on a condition and not on a cadence.

### 8.2 Three paragraphs

Line 33 (Finding 3, second paragraph).

> Running the train daily with the same three days does not help. Three releases would be in promotion at any time, requiring three sets of environments and three times as many partner test windows. A fault found on the second day of one release would already be present in the two behind it. Every change would still wait three days and would still reach every client at the same moment.

Formula: version-three cadence. Four end-stopped declaratives of similar length, a flat negative verdict first, a doubled "would still" last.

Rewrite:

> The obvious fix, a train every day, makes things worse. With three days of promotion and a cut every morning there are three releases in flight at once, so three sets of environments and three times the partner test windows, and a fault found on day two of one is already sitting in the two behind it. After all that expense each change still waits its three days and still lands on every client in the same minute.

Why: it names the idea as the one the reader will have had. The middle is a single sentence because it is a single chain of consequence. "After all that expense" is a judgement.

Line 98 (Recommendation 4).

> The unit of exposure should be the client and not a random share of traffic. Square learned this when it moved its payment records to a new service by random percentages of requests. Its engineer wrote afterwards that the method had concealed a regression which appeared only for a particular combination of client software versions, and which a rollout held stable per merchant would have confined to a few. Where the clients are themselves banks, with their own notice periods and sign-off, the first cohort must be a client that has agreed to go first, and changes to the interface that clients see must remain on agreed dates. What the business may ramp at its own pace is behaviour behind an interface that does not change.

Formula: the bare recommendation skeleton. "Should" claim with "and not"; "[Firm] learned this when"; "Its engineer wrote afterwards that"; a conditional about the client; a "What … is" cleft to close.

Rewrite:

> Square moved its payment records to a new service by sending it a random percentage of requests, and so missed a regression that showed up only with one combination of client software versions. Its engineer wrote afterwards that a rollout held steady per merchant would have confined the fault to a few of them. That is the engineering argument for ramping client by client. The commercial one is stronger. [If the clients are banks; the next draft must say whether they are.] They have notice periods and sign-off of their own, so the first client has to have agreed to be first, and anything that changes the interface they see stays on the dates already agreed. Only behaviour behind an unchanged interface is the business's to ramp when it likes.

Why: evidence first, recommendation drawn from it. Two arguments are distinguished and one is ranked above the other, which is a commitment. The conditional about who the clients are is exposed as a gap to be filled.

Line 136 (Recommendation 10, first paragraph).

> The business should start with a single service that it owns outright, with no vendor package or mainframe component in its path. The change policy for that service should be agreed with risk and audit before any code moves. One client should be recruited to go first. The pilot should run alongside the train for two quarters, with the six baseline measures counted throughout and the conditions for stopping agreed in advance. A pilot on that scale occupies a small team.

Formula: four consecutive "[subject] should" sentences and a short flat closer.

Rewrite:

> Pick one service with no vendor package and no mainframe component anywhere in its path. Before any code moves, get risk and audit to agree the change policy for that service alone and find one client willing to go first; if either takes more than a few weeks, that is the first result of the pilot. Then run it beside the train for two quarters, answering the six baseline questions for both as you go, with the conditions for stopping written down beforehand. This needs [a number] engineers.

Why: imperatives, matching the headings, so the modal chain disappears. The clause about the agreement taking weeks is the kind of remark that comes from having tried. The bracket marks where "a small team" must become a figure.

## 9. Checklist for the next draft

Each item gives the present value in brackets.

1. "Should" occurs no more than 15 times [32], and no paragraph contains more than two [116 has five; 11, 104 and 136 have four each].
2. "The business should" occurs no more than three times [8]. "The business" occurs no more than eight times [17].
3. No more than five paragraphs open with a sentence of 10 words or fewer [16].
4. Delete the last sentence of every paragraph. A fact is lost in at least 30 of 40 cases [16 of 40].
5. No paragraph's last sentence paraphrases a quotation or list in the sentence before it [2: lines 49, 51]. No more than two paragraphs follow a footnoted sentence with an uncited moral [8].
6. No more than ten lists of exactly three parallel items [at least 27], and none as the last element of a paragraph [7] or of the document [1].
7. ", so that" introducing a result occurs at most once [5].
8. "And not", ", not" and "and never" as contrast occur at most twice in total [5]. Balanced "A and B" antitheses of the "cheap to add and expensive to keep" kind: at most one [8].
9. "Therefore", "accordingly", "nonetheless" and sentence-medial "however" total no more than three [10].
10. Word ceilings: "establish" and its forms 2 [8]; "the same" 5 [12]; "real" 3 [10]; "shows what" 1 [4]; "found that" 2 [5]; "ordinary" 2 [4]; "at once" 2 [5].
11. No sentence exists only to introduce the next one. Test each sentence of 12 words or fewer that contains no number, name or instruction [11 signposts listed in 2.10].
12. "This assessment" and "this document" do not appear as the subject of a verb [3], and "below", "second half" and "the recommendation" as self-reference do not appear [3].
13. First person: at least ten uses, of which at least half attach to a judgement or estimate ("I would", "I doubt", "I expect") [5 uses, 1 judgement]. Or none at all, with the document reissued as unsigned. Not the present mixture.
14. At most 20% of sentences begin with "The" [27%]. At least 30% begin with something other than their grammatical subject [18%].
15. No more than eight sentences begin with the name of an organisation [19]. No paragraph contains three organisations at one sentence each [line 25].
16. "Its engineers wrote / remarked / report that" and variants occur at most once [4].
17. No three consecutive paragraphs have the same number of sentences [Findings 1 to 4: 4, 4, 5, 4, 4, 4, 4].
18. Of the sentences of eight words or fewer, no more than a quarter stand first or last in a paragraph [8 of 16].
19. Colons introducing a list or gloss: at most five [12]. No punctuation mark is held at zero by rule; at present there is one semicolon and no dash in 4,700 words.
20. No recommendation is stated in near-identical words in the Summary, the heading and the body. Check lines 11 against 74 and 104, and Recommendation 9's heading against its first and last sentences.
21. Every sentence under "Findings" that asserts something about the client is either sourced to something the client supplied or moved out of the section; or the section is renamed [at least 5 unsupported: lines 7, 19, 23, 31, 37].
22. No conditional about the client's own circumstances ("Where the clients are themselves banks") [1], and no hypothetical where a real example from the client would go ("Suppose") [1].
23. Every recommendation names an owner by role, and at least five give a duration, a headcount or a cost [0 owners; 1 duration].
24. At least one case is told at paragraph length with a named person and what they said [1: Harry], and at least three of the one-sentence cases are cut or moved to footnotes.
25. Housekeeping: the ladder figure's alt text matches the ladder in the text; "six questions" and "six baseline measures" agree; "long hold" is defined or removed; the link to reviews of the previous draft is gone from "Sources"; the Harry quotation's punctuation is checked against the original; quotation marks are of one kind.

## 10. Overall

On a five-point scale from "obviously generated" (1) to "indistinguishable from a skilled human professional" (5), this is a 3, perhaps a little above. A general reader would accept it. The commissioner, who is primed, will not, and will probably say so by the end of the Summary.

The three biggest reasons:

1. Every paragraph is the same machine. A short verdict, the support, a closing moral: 15 of 40 paragraphs have both ends of that shape and 24 have the moral. The morals are well made, which makes it worse, because a reader notices craft being applied at fixed intervals.
2. The advice is a modal verb with a placeholder for a subject. Thirty-two "should", seventeen "the business", no owner, no cost, no client detail. It is the form of a consultant's recommendations with the consulting left out, and line 13 concedes as much.
3. No one is present. The "I" appears to disclaim and then leaves. Nothing in the document is ranked by how much the author cares about it, guessed at, doubted, or found surprising. The worked example in Recommendation 3 and the Azure DevOps account at line 140 show the draft can do better: both have sequence, particular detail and sentences of uneven weight. The rest should be brought up to those two passages, and that needs material the author does not yet have, namely facts about the client. Further polishing of sentences will not supply it.
