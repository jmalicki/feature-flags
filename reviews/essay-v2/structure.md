# Structural review of "Stop soaking, start ramping"

Reviewed: `essay.md` at commit 941fe30. Scope is shape only: form, order, cuts, length and movement. The figures were not opened; they are judged by their number, their placement and how the text depends on them.

## Verdict

The draft is a literature survey with an essay's title. It has one real argument, and that argument is good: a soak holds the whole release, so the release grows into a batch, and the batch is where the risk is; a flag puts the wait on the one behaviour that needs it. That argument starts at about word 1,850 of 5,800 and gets 455 words. The other 5,300 words are a roll-call of about forty organisations, a taxonomy, a playbook, an incident catalogue, a compliance memo and a research report's limitations section.

The commissioner's two complaints have structural causes.

- It is unconvincing because the reader's main objection ("we move money") is not voiced until word 3,650, the thesis is stated without a reason ("change, because the alternative is better overall"), the strongest case (Knight Capital) arrives at 77% of the way through, and the last substantive thing before the conclusion is a list of five reasons to doubt the essay.
- It reads as generated filler because 41 of 77 body paragraphs have the same shape (a claim, one to five named firms, a linked citation), 22 of 77 are list items in form, the first five sections are all between 418 and 486 words regardless of their importance, and there are 89 inline citations, 34 bold spans and 13 figures.

The fix is to cut to one argument and two or three cases, and to move the survey to the companion documents that already exist in the repository.

## 1. Reverse outline

Paragraphs are numbered within their section. Word counts are whitespace-separated tokens, so a linked citation counts as about two words. "F" rows are figures. Cumulative position is given at each section heading, counting prose only (about 5,800 words; the file is 6,416 with headings and alt text).

### Front matter and section 1, "You are behind, and that is an advantage" (words 0 to 500)

| Para | Words | What it does |
| --- | --- | --- |
| 0 | 28 | Dateline. Names the reader ("engineering managers") and dates the research. |
| 1.1 | 73 | Tells the reader their own process; defines train and soak; announces that the essay will argue for replacing it. |
| 1.2 | 82 | States the thesis with no reason ("better overall"); defines a feature flag; summarises the ladder. |
| 1.3 | 102 | Roll-call: eleven firms in five sentences, then one regulator quote. Argument from company. |
| 1.4 | 23 | Labels the reader a "fast follower"; announces what the essay will use. |
| F3 | | Timeline, 2000 to 2024. |
| 1.5 | 112 | Cites the FCA review: four findings in one paragraph. |
| F7 | | FCA statistics. |
| 1.6 | 81 | Concedes: three caveats on the evidence just given. |

### Section 2, "What changed: the wait moved" (words 500 to 930)

| Para | Words | What it does |
| --- | --- | --- |
| 2.1 | 16 | Claims: the wait moved. |
| 2.2 | 98 | Tells Netflix: a week-long canary became "verifying endurance"; now hours. |
| 2.3 | 42 | Cites Amazon: 14 of 16 days were waiting for a person. |
| F8 | | Sixteen-day bar. |
| 2.4 | 120 | Describes Amazon's pipeline today. |
| F1 | | Two pipelines. |
| 2.5 | 46 | Claims: the soak and the ramp ask different questions. The section's point. |
| 2.6 | 108 | Tells Atlassian and Stripe: staging could not see it; three months in production did not see it. |

### Section 3, "Start dark" (words 930 to 1,350)

| Para | Words | What it does |
| --- | --- | --- |
| 3.1 | 27 | Instructs: deploy and show nobody. |
| 3.2 | 66 | Tells Facebook Chat, 2008. |
| 3.3 | 11 | Transitions into a list. |
| 3.4 | 64 | Defines dormant and shadow (two bold bullets). |
| F2 | | Exposure ladder. |
| 3.5 | 88 | Cites Facebook, Flickr and Netflix for the dormant rung. |
| 3.6 | 88 | Cites GitHub and Square for the shadow rung. |
| 3.7 | 26 | Claims; points forward to section 5. |
| 3.8 | 48 | Warns that dormant is not tested; points forward to section 9. |

### Section 4, "One idea, three settings" (words 1,350 to 1,835)

| Para | Words | What it does |
| --- | --- | --- |
| 4.1 | 41 | Claims and defines: canary, flag and experiment are one mechanism. |
| F4 | | The loop and its three settings. |
| 4.2 | 73 | Table restating 4.1 and F4. |
| 4.3 | 95 | Cites five firms in four sentences for "convergence". |
| 4.4 | 66 | Claims that experiments earn their place; cites Microsoft's one third. |
| 4.5 | 94 | Cautions: safety ramp versus product experiment; cites FCA guidance. |
| 4.6 | 73 | Cautions: the unit of exposure is the client; cites Stripe and Square. |
| 4.7 | 24 | Exists to introduce a figure and gloss two of its labels. |
| F6 | | Seven published ramps. |
| 4.8 | 20 | Source line for the figure (seven links). |

### Section 5, "Why a long canary hurts and a long flag ramp does not" (words 1,835 to 2,290)

| Para | Words | What it does |
| --- | --- | --- |
| 5.1 | 25 | Poses a question. |
| 5.2 | 84 | Argues: a soak holds the binary, so the next release is a batch. |
| 5.3 | 67 | Argues: a flag puts the wait on one behaviour. |
| F5 | | Who waits. |
| 5.4 | 40 | Argues: continuous integration and soaks pull against each other. |
| 5.5 | 67 | Reframes: long waits on one behaviour are fine (Square, Adyen). |
| 5.6 | 28 | Concedes: the risky change may arrive later. |
| 5.7 | 144 | Tells two cases in one paragraph: OANDA's bank licensees and the Financial Times. |

### Section 6, "The way back" (words 2,290 to 2,850)

| Para | Words | What it does |
| --- | --- | --- |
| 6.1 | 31 | Claims: a ramp limits reach, rollback limits duration. |
| 6.2 | 14 | Announces three kinds of rollback. |
| F9 | | Three rollbacks. |
| 6.3 | 113 | Defines the three kinds; cites Netflix and Humble and Farley. |
| 6.4 | 45 | Cites Wealthfront's five seconds; adds an audit point. |
| 6.5 | 69 | Qualifies: what a rollback does not undo; cites Amazon. |
| 6.6 | 101 | Cites Google, Booking.com, Amazon, Monzo and Slack on who may roll back. |
| 6.7 | 80 | Claims rollback must be rehearsed; cites Google twice and Amazon. |
| 6.8 | 71 | Tells two incidents: Microsoft's 45 minutes; Stripe's revert. |
| 6.9 | 37 | Instructs: the three-part policy. |

### Section 7, "What managers have to change" (words 2,850 to 3,645)

| Para | Words | What it does |
| --- | --- | --- |
| 7.1 | 29 | Transitions: the harder part is responsibility. |
| 7.2 | 103 | Bold imperative, then Google and Dropbox. |
| 7.3 | 136 | Concedes that it is hard; cites a survey, Booking.com and Microsoft; instructs. |
| 7.4 | 84 | Bold imperative, then Vogels and Netflix. |
| 7.5 | 144 | Bold imperative, then Amazon, the FT and Starling twice. |
| 7.6 | 117 | Bold imperative, then OANDA's post-mortem and Allspaw. |
| 7.7 | 93 | Bold imperative, then four numbers from four firms. |
| 7.8 | 88 | Bold imperative that is really a concession: what the famous firms kept. |

### Section 8, "For systems that move money" (words 3,645 to 4,485)

| Para | Words | What it does |
| --- | --- | --- |
| 8.1 | 55 | Voices the reader's objection for the first time; cites Beck. |
| 8.2 | 16 | Answers it in two sentences. |
| 8.3 | 98 | Bold imperative, then Uber's payment shadowing. |
| F11 | | Payment shadowing. |
| 8.4 | 130 | Bold imperative, then Uber's ledger arithmetic and the Basel II parallel run. |
| 8.5 | 122 | Bold imperative, then Monzo and Stripe; derives a rule; defines two terms. |
| 8.6 | 54 | Bold imperative; claims no rule text requires a soak. |
| F12 | | What the rules ask. |
| 8.7 | 17 | Source line for the figure. |
| 8.8 | 122 | Concedes: where the rule texts do constrain. |
| 8.9 | 77 | Instructs; cites the DBS pause. |
| 8.10 | 65 | Bold imperative that is a concession: fixed industry dates. |
| 8.11 | 85 | Concedes: client banks' notice periods. |

### Section 9, "What goes wrong when it is done halfway" (words 4,485 to 5,145)

| Para | Words | What it does |
| --- | --- | --- |
| 9.1 | 11 | Claims: the failures are failures of doing part of it. |
| 9.2 | 155 | Tells Knight Capital. |
| F10 | | Knight Capital. |
| 9.3 | 94 | Interprets Knight against the usual telling. |
| 9.4 | 57 | Bold label, then Google Cloud 2025. |
| 9.5 | 83 | Bold label, then CrowdStrike and Cloudflare; instructs. |
| 9.6 | 52 | Bold label, then RBS. |
| 9.7 | 52 | Bold label, then Roblox; instructs. |
| 9.8 | 32 | Bold label, then Uber's stale flags. |
| 9.9 | 74 | Bold label, then TSB; concedes. |
| 9.10 | 48 | Claims and concedes in the same breath. |

### Section 10, "Where to start", and the method note (words 5,145 to 5,820)

| Para | Words | What it does |
| --- | --- | --- |
| 10.1 | 47 | Cites Amazon's instruction to sceptical teams. |
| F13 | | Six steps. |
| 10.2 | 126 | Numbered list of the same six steps. |
| 10.3 | 11 | Transitions into the gaps. |
| 10.4 | 163 | Bulleted list of five gaps in the published record. |
| 10.5 | 25 | Concedes: speed alone is no virtue. |
| 10.6 | 101 | Restates the thesis and summarises the essay. |
| M1 to M5 | 202 | Method note: how quotes were checked, three layers of repository links, which figures are conceptual, a disclaimer on company accounts. |

### The pattern

Of 77 body paragraphs (headings, figures and figure source lines excluded):

- 41 are "claim, then one or more named firms, then a linked citation". In sections 6, 7 and 9 almost every paragraph is. Typical: "At LinkedIn and Uber the experimentation platform runs the rollouts. ([LinkedIn, 2014]; [Uber, 2018]) At Booking.com, 'every change... is wrapped in an experiment'. ([Kaufman et al., 2017])".
- 22 are list items in form: 18 paragraphs that open with a bold imperative or label, two bulleted lists, one numbered list and one table.
- 13 are connective tissue of under 35 words that announce what comes next: "'Dark launch' now covers two different things, and you want both:", "Published ramps look like this.", "The published record has gaps, and they fall close to you:".
- 14 are concessions or caveats, and nearly every section ends on one.
- About nine advance an argument from the paragraph before, in the sense that deleting the previous paragraph would break them. Five of the nine are in section 5. They are 2.5, 5.2, 5.3, 5.4, 5.5, 5.6, 8.2, 9.3 and 9.10.

That last number is the diagnosis. In most of the draft the paragraphs are parallel, not sequential. Sections 7 and 9 could be shuffled internally and no reader would notice. Section 3 could swap places with section 4. That is the structure of a catalogue.

Three further patterns matter.

- No organisation gets room. About forty are named. Only Knight (249 words), Uber's payments work (about 230), Amazon's pipeline (about 160) and the FCA review (about 190) get more than a paragraph. The rest get a sentence each. A director cannot weigh a case told in one sentence; they can only count the cases, and counting is not persuasion.
- The essay keeps describing itself. "This essay" appears eleven times. Provenance phrases written for a fact-checker sit in the body: "None of the texts read for this essay", "as read in summary for this essay", "No post-mortem found for this essay", "No source states the rule, but it follows", "This essay's reading adds one". These belong in notes.
- The essay defers its payoffs. "as section 5 explains", "Section 9 shows what happens otherwise", "the change in habits described in section 7". Each one admits that the material is in the wrong place.

## 2. What kind of document this is

It is trying to be seven things.

| Kind | Where | Tell |
| --- | --- | --- |
| Persuasive essay | Title, 1.1 to 1.2, 2.5, section 5, 10.6 | Second person; "this essay argues that you should replace it" |
| Survey article | Sections 3 and 4, most of 6 | "The history shows them converging"; five firms in four sentences |
| Reference page | 3.4, the table at 4.2, 6.3 | Definitions of dormant and shadow, three settings, three kinds of rollback |
| Management playbook | Sections 7 and 10 | Bold imperatives; a numbered checklist |
| Compliance memo | 8.6 to 8.11 | Five rule texts read against six requirements |
| Incident catalogue | Section 9 | Seven labelled failures |
| Research report | 10.4, the method note, the dateline | "Research completed November 10, 2026"; gaps; "three layers" of evidence |

The overall effect is a slide deck in prose: ten numbered slides, each with a title, a diagram and bullet points, and each bullet backed by a logo.

For this reader it should be one thing: an argued essay, in the manner of a memo to a decision-maker. Reasons:

- A director is deciding, not learning. They know what a canary is. They do not need "a feature flag: a setting that chooses between the old behaviour and the new without another deployment", or "The Financial Times, the newspaper", or "An Amazon 'Region' is one of its geographic groups of data centres". The glosses tell the director that the piece was written for someone else. (The dateline says "engineering managers"; the commission says directors. Decide.)
- A director who owns a three-day soak owns it for a reason. They put it there, or inherited it after an incident. Persuasion has to start from that reason, not from "Facebook launched its chat system this way in 2008".
- The risk is personal and asymmetric. The director carries the blame for a bad payment, and gets little credit for faster delivery. A survey of what forty firms do does not move that. One mechanism that shows the soak is not buying what they think it buys does.
- The survey, the playbook and the evidence trail already have homes: `reports/Testing gates to ramping culture.md`, `research_notes/` and `reading-guide.md`. The essay does not have to carry them. It has to make someone want to open them.

So: one essay that argues, plus (if wanted) a separate adoption playbook made from sections 7 and 10, and a separate method note. The essay should link to both in one line at the end.

## 3. Section by section

### Title, subtitle and dateline

The title is good. The subtitle lists three tools; it could instead state the claim. "Research completed November 10, 2026" is a report's dateline and should go. Fix the named reader.

### Section 1

- One job: make the reader feel the problem and state the claim with its reason.
- Doing it: no. The heading ("You are behind, and that is an advantage") opens with a slight and a consolation, and the advantage is never shown beyond "their mistakes are written down". The thesis sentence has no "because": "That is the whole claim of this essay: change, because the alternative is better overall." Paragraph 1.3 is a roll-call of eleven firms. Then a timeline. Then the FCA data, which is the best opening evidence in the draft (a regulator's own numbers; change boards that "had not rejected one all year"), followed at once by 81 words taking it back: "The review reports associations... It also carries a caveat... on a sample too small to conclude from".
- Verdict: rewrite. Cut 1.3, 1.4 and the timeline. Keep the FCA findings, but move them to where the batch argument needs them and put the caveats in a note plus one honest clause. Open with the reader's own reason for the soak.

### Section 2

- One job: reframe. Nobody stopped waiting; they changed what waits and what the wait proves.
- Doing it: half. Paragraph 2.5 is the point of the section and one of the best passages in the draft: "A pre-production soak asks whether a large batch survives several days in an environment that resembles production. A ramp asks whether one small change behaves correctly on production itself". Netflix's "verifying endurance" quote is the best quotation in the essay because it names what a soak turns into. But Amazon's sixteen days is a different point (waiting for a person, not soaking) and takes 160 words and two figures. And 2.6 (Atlassian, Stripe) starts a second argument, that time in staging cannot see what is not there, and then drops it.
- Verdict: merge with section 5. Sections 2 and 5 are one argument cut in half by 900 words of taxonomy. Cut Amazon's present-day pipeline to two sentences.

### Section 3

- One job: say what "dark" means.
- Doing it: yes, as a survey. Facebook Chat, Flickr, Netflix's API and GitHub's merge code are history a payments director will not weigh. The dormant and shadow distinction matters, but its payoff (Knight: dormant code proved nothing) is 3,500 words later, and the section says so twice by forward reference.
- Verdict: cut as a section. Teach "shadow" on a payment (Uber, now in section 8), and teach "dormant is not tested" through Knight, in the same place.

### Section 4

- One job: show that canary, flag and experiment are one mechanism.
- Doing it: yes, three times over: a paragraph, a figure and a table that all say the same thing. The table's second and third columns are identical in two of three rows ("One behaviour inside the binary", "Is it broken?"), which shows that it is not earning a table. The claim is true and neat, and it is an observation for engineers. It does not help a director decide anything. Experiments ("Is it better?") are a different proposal from replacing the soak, and they open a fair-treatment question the essay then has to spend 94 words closing. Paragraph 4.7 exists only to introduce a figure. The section has 16 citations in 486 words.
- Verdict: cut. Save two things. The unit of exposure is the client, with Square's hidden regression (4.6): move it to the money section. The difference between a safety ramp and a product experiment: one sentence in the regulator section.

### Section 5

- One job: the mechanism. Why the soak creates the batch, and why a flag does not.
- Doing it: yes, and too briefly. This is the essay. It gets 455 words, the same as the taxonomy. Its heading is written from an engineer's seat ("Why a long canary hurts and a long flag ramp does not"); the reader does not have a canary. It opens by answering a question the reader has not asked ("why not keep your soak and call it a canary?"). Its best evidence, OANDA licensing the same software to banks whose releases "bundled thousands of changes", is introduced as "a comparison close to your own situation" and then shares a 144-word final paragraph with the Financial Times.
- Verdict: move to the front, right after the opening, and expand. Work it through in the reader's own numbers: changes per release, what a failed release costs to bisect, how long a fix waits for the next train. Give OANDA's banks their own paragraphs. Keep 5.6 ("The risky change may well reach every client later than it would have on the train"); it is the most trust-building sentence in the draft.

### Section 6

- One job: rollback is a pre-approved, rehearsed action in the hands of whoever is on call.
- Doing it: the second subsection does. The first is an operations reference: three kinds of rollback, build once, deploy by hash. A director needs one sentence of that. This is the only section with level-3 headings, which shows that the template did not fit. The ending (6.9) is clear and should stay nearly as is. The RBS back-out, the best rollback case for a bank, is in section 9.
- Verdict: compress to 250 to 450 words. Lead with the policy. Keep Microsoft's 45 minutes "to figure out how to turn it off" and bring RBS here. Cut Wealthfront and the Netflix citation; move the hash rule to the audit discussion, where it earns its place ("the hash that ran in test is the hash that runs in production").

### Section 7

- One job: what managers must change.
- Doing it: as a slide. Six bold imperatives, each followed by two to four firms. It is the second-longest section (794 words) with 18 citations. The honest paragraph 7.3 ("Expect this to be hard") and the OANDA story in 7.6 (management reaching for "a full-blown, separate and traditional testing team" when ignored tests were the cause) are strong. "Keep what was kept" (7.8) is formatted as an instruction but is a reassurance, and it contains a sentence that belongs in the first 300 words: "What these firms removed was the batch, and the assumption that time in a lower environment is evidence."
- Verdict: move most of it to a separate playbook. In the essay keep a single passage on what is asked of the director, built on 7.3 and 7.6, in prose without bold. Move 7.8 to the opening.

### Section 8

- One job: answer "but we move money".
- Doing it: yes, and it is the section the reader came for. It begins at 63% of the way through with "Your objection is fair". By then the director has held that objection for 3,650 words. The section also does two jobs: how money-moving firms ramp (8.3 to 8.5) and what the rules require (8.6 to 8.11). "Count agreement, not days" is the best phrase in the essay, and the Basel II parallel run is the best single move, because it tells a banker that they already do this. The rule-text passage leans on its figure: the text says "They ask for evidence." and the six things they ask for are only in figure 12.
- Verdict: split and promote. The objection goes in the opening. The payment-shadowing case becomes the positive demonstration, straight after the mechanism. The regulator material becomes its own short part near the end, with the six requirements in the text or in a table. Keep "The argument that works with a supervisor is failure rate and reach per change, with evidence. It is never speed."

### Section 9

- One job: show that the known disasters are failures of partial adoption.
- Doing it: for Knight, yes. The reinterpretation ("Five days in production observed nothing because nothing used the path, and three days of soak would have observed the same nothing") is the strongest argument in the draft against the soak, and it is the case a sceptical director will raise against flags. It should be met early and at length. The other six items are headlines of 32 to 83 words. "Flags became debt" is two sentences. The list form hides that each failure belongs to a different part of the argument.
- Verdict: dissolve. Knight moves forward into the part about what a soak cannot see. RBS goes to rollback. CrowdStrike becomes one sentence ("configuration is a change; ramp it too"). TSB is one sentence or a note. Google Cloud 2025, Cloudflare, Roblox and Uber's flag clean-up go to the companion report.

### Section 10

- One job: tell the reader what to do next.
- Doing it: no. It is three documents. The numbered checklist repeats figure 13 item for item. The steps have no scope, cost, duration or measure of success, so it is not a proposal. Then comes a research report's limitations list, placed directly before the conclusion: "No before-and-after numbers from a bank", "No auditor's verdict", "No incumbent's account". Those are the three things this reader most wants, and the essay tells them, as nearly its last word, that it has none. Then an orphan caveat ("Speed alone is no virtue either"). Then a closing paragraph that restates the opening ("The second way is better overall") and refers the reader back to section 7.
- Verdict: rewrite as an ending. The gaps are honest and must stay, but they should do work: nobody has published a bank's before-and-after numbers, so the first step is designed to produce yours. That turns the weakness into the ask. The ask should be concrete: one team, one flow, one quarter, existing approvers kept, three measures.

### Sources and method

- One job: let a checker trust the citations.
- Doing it: for a checker, yes. For a director it is the clearest sign of how the piece was made: "those first gathered through a summarising tool were checked again", "fourteen files of source-by-source evidence, each tagged by how it was read", "The figures are generated by figures/build.mjs". It also discloses that six of thirteen figures are "conceptual".
- Verdict: move to its own file or the README. Leave one sentence and a link.

## 4. Momentum

### The three worst sags

1. Paragraphs 1.3 and 1.4 and the timeline (about words 180 to 310). Before any argument has been made, the reader gets "Amazon, Google, Netflix and Microsoft have published their versions in detail. Uber's payments group, Square and Stripe have published... Monzo and Starling have published...". This is where a director decides what kind of document it is, and the answer they reach is "vendor white paper".
2. Paragraph 3.5 to the end of section 4 (about words 1,150 to 1,835). Seven hundred words of who-did-what-when, a taxonomy, a table, experiments, and a paragraph whose only job is to caption a figure. The mechanism has not yet been stated. A reader skimming for the argument finds none here and stops.
3. Section 7 (words 2,850 to 3,645). Eight hundred words of bold imperatives between the mechanism and the money section. Each item is individually sound. Together they are a list, and they stand between the reader and the one section addressed to their objection.

A fourth, smaller one: 9.4 to 9.9 (six incident headlines in 350 words), followed by the gaps list. The essay loses force exactly where it should be gathering it.

### Where the best material is

| Material | Paragraph | Position |
| --- | --- | --- |
| FCA: change boards approve over 90%, some rejected nothing all year | 1.5 | 5% |
| Netflix: "verifying endurance" | 2.2 | 10% |
| Two questions: soak versus ramp | 2.5 | 14% |
| The mechanism: the soak holds the binary and makes the batch | 5.2 to 5.3 | 32% |
| OANDA's bank licensees | 5.7 | 37% |
| The rollback policy in three parts | 6.9 | 49% |
| OANDA: do not answer a failure with a gate | 7.6 | 58% |
| "What these firms removed was the batch" | 7.8 | 63% |
| Uber payment shadowing; "Count agreement, not days"; Basel II parallel run | 8.3 to 8.4 | 64% to 68% |
| Knight reread: a soak "would have observed the same nothing" | 9.3 | 80% |

Seven of the ten best things are in the back two thirds. The mechanism is a third of the way in. The case that most directly defeats the soak is four fifths of the way in. A director who gives the piece five minutes reads none of it.

## 5. Length

It is the wrong length for what it contains. At about 5,800 words it is too long for its one argument and too short for its forty organisations.

- The argument (mechanism, what the soak cannot see, a payment case, rollback, the regulator, the ask) needs 2,200 to 2,500 words.
- The survey, done properly, needs far more than it gets here, and it already exists in `reports/`.
- The current length is produced by coverage: every section gets about 450 to 800 words and every source found gets a sentence. Sections 1 to 5 run 473, 430, 418, 486 and 455 words. Sections sized that evenly were sized by a template. An argument gives its central step the most room.

The right length for the persuasion piece is about 2,300 words: something a director reads in ten minutes, in one sitting, and can forward to their head of risk with "read this". If the commissioner needs one self-contained document that also answers the regulator and management questions properly, 4,000 words is defensible, on one condition: every case that stays gets at least 80 to 100 words, and no more than about twelve organisations are named.

## 6. Formatting as a tell

| Device | Count | Helps a director? | Verdict |
| --- | --- | --- | --- |
| Numbered level-2 headings | 10 | No. Numbering signals a report and enables "see section 9" | Four to six unnumbered headings that state claims |
| Level-3 headings | 2, both in section 6 | No | Cut |
| Bold lead-ins | 18 paragraphs | No. They are slide titles; they let the writer skip transitions | Cut from the essay; fine in a separate playbook |
| Bulleted lists | 2 (definitions, gaps) | No | Fold into prose |
| Numbered checklist | 1 | Only as a proposal with scope and dates | Replace with a concrete ask in prose |
| Table | 1 | No; it restates a figure and a paragraph | Cut. One table (rule requirement against pipeline evidence) could earn a place |
| Inline linked citations | 89, about one per 65 words; one per 30 in section 4 | No. They break every second sentence and make the sources the subject | Endnotes |
| Figures | 13, one per 450 words; six "conceptual" | Three or four do | Cut to three or four |
| Italic figure source lines | 2 | No | Into the notes |
| Method note with repository links | 1 | No | Separate file |

### Figures

Thirteen is too many. Without judging the drawings:

- They interrupt. Section 1 has two figures inside its first 470 words, before the argument starts. Section 2 has two in 430 words.
- They duplicate. Figure 13 is the numbered list beneath it. Figure 4 is the table beneath it and the paragraph above it. Figure 9 is paragraph 6.3. Figure 2 is the bullets in 3.4.
- The text leans on them in three places. "Published ramps look like this." is a paragraph that exists to hold a figure. "They ask for evidence." hands the six requirements to figure 12. "'Rollback' means three different things, and only two of them are safe under pressure." shows the figure before the prose has said what the three are.
- Six are diagrams of ideas, by the method note's own account. An idea that needs a diagram and a paragraph and a table has not been stated well enough once.

Keep the ones that show something prose cannot: who waits (figure 5), payment shadowing (figure 11), Knight's eight servers and timeline (figure 10), and possibly the FCA numbers or the rules table. Each should sit after the paragraph that makes its point, and the paragraph should stand without it.

### Citations

Use numbered endnotes (Markdown footnotes), grouped under the essay's four to six part headings in a "Notes" section. Attribute in the sentence only where the source is the argument: "the FCA's 2021 review of 23 firms", "the SEC's order against Knight". Everything else becomes a number. Caveats on evidence ("associations, not causes"; "read in summary") go in the note, unless the argument turns on them. This serves the director, who reads prose, and the risk officer they forward it to, who will check the notes. A tight version needs about 15 notes; the fuller one about 35.

## 7. Two alternative structures

Both drop the numbering, the bold lead-ins, the table and the method note. Both open with the reader's objection and close with a concrete ask. Both need a decision first on the single claim. A candidate: "A soak buys elapsed time, not evidence, and it manufactures the batch that makes releases dangerous. Put the wait on the one risky behaviour, in production, at small exposure, with a rehearsed way back."

### (a) Tight version, about 2,300 words

One mechanism (the soak makes the batch and cannot see what does not happen in staging). Two cases: Knight Capital and Uber's payment shadowing. OANDA's banks as supporting evidence.

| Part | Words | Content |
| --- | --- | --- |
| Opening (no heading) | 250 | The soak's best defence, stated fairly: a wrong payment is not a wrong photo. Then the claim with its reason. Then what is not being proposed: tests, review and named approvers all stay; "what these firms removed was the batch, and the assumption that time in a lower environment is evidence". |
| The soak makes the batch | 450 | The mechanism from 5.2 to 5.4, worked in the reader's numbers. FCA findings in two sentences. OANDA's bank licensees as the case. The concession from 5.6. One figure (who waits). |
| What three days cannot see | 400 | Netflix's "verifying endurance". Knight told in full and reread: staged deployment, dormant code, reused flag, activation everywhere at once; "three days of soak would have observed the same nothing". Meet "a flag caused Knight" head on. |
| The same wait, on a payment | 500 | Uber: record, replay, compare, then staff, 0.25%, 1%, 5%. "Count agreement, not days." The Basel II parallel run. Stage length set by a reconciliation cycle. The client as the unit of exposure. One figure (payment shadowing). |
| The way back | 250 | The three-part policy from 6.9. Microsoft's 45 minutes. RBS's untested back-out. |
| What an examiner asks for | 250 | No rule text requires a soak; they require records, independent approval, proportionate testing and a way back. Where they do constrain. Keep the approvers. "It is never speed." |
| What is not known, and the first quarter | 200 | The three gaps that matter, then the ask built to close them: one team, one flow, one quarter, three measures. Link to the playbook and the evidence. |

Cut from the present draft: the roll-call and timeline; Amazon's sixteen days and pipeline; all of section 3 except one sentence defining shadow; all of section 4 except the client-as-unit point; the rollback taxonomy, Wealthfront, Humble and Farley; section 7 except one sentence; card-network dates and client notice periods (one sentence between them); Google Cloud, CrowdStrike, Cloudflare, Roblox, flag debt and TSB; the checklist; the method note; ten of thirteen figures; about 75 of 89 citations.

New material needed:

- The reader's own numbers, or a clearly labelled worked example: changes per release, share of the three days that is test execution against waiting, the last incident traced to a release and how long it took to find the change.
- A fair statement of why the soak exists. The draft never gives one.
- The ask: scope, duration, what stays in place, what is measured, what it costs in people.
- A fuller Knight narrative from the SEC order (the research notes likely hold it).

### (b) Fuller version, about 4,000 words

Same spine. It earns the extra length by answering the three follow-up questions a director will have (what about irreversible things, what does it ask of my managers, what will the supervisor say) and by telling each case properly.

| Part | Words | Content |
| --- | --- | --- |
| Opening (no heading) | 350 | As in (a), with one more paragraph on what is kept. |
| The soak makes the batch | 700 | Mechanism with worked example. FCA review with its caveat in one clause. OANDA and its bank licensees at full length. The Financial Times in two sentences. Long waits on one behaviour are fine: Square's six weeks, Adyen's month. The concession from 5.6. |
| What time in staging proves | 600 | Netflix. Atlassian's identifiers that "did not exist there". Stripe's three months. Knight in full, with the SEC's remedies and the essay's reading kept distinct. |
| Moving money in the dark | 800 | Uber's authorisation shadowing, then the ledger arithmetic and offline comparison. Parallel run. Reconciliation as a continuing test and as the clock for a ramp stage. Client as unit: Stripe's pinning, Square's regression. What cannot be ramped: shared message formats, network dates, client banks' notice periods; ship dark and switch on the date. |
| The way back | 450 | Policy first. Google's "rolls back first and investigates the problem second". What a rollback does not undo, and Amazon's two-deployment rule. Microsoft's 45 minutes, Stripe's revert, RBS. Rehearsal. |
| What it asks of managers | 500 | In prose, three things, not six: the author owns the switch and its removal; approval moves but stays (Starling's three approvals, "our auditors loved this one"); do not answer a failure with a gate (OANDA). Then the honest paragraph: it is hard, it takes years, tooling is 5% to 15% of engineers. |
| What an examiner asks for | 350 | As in (a), plus the constraints paragraph (8.8), the DBS pause, and the unclassified status of a flag change, which leads to designing pre-approved change types with risk and audit. |
| What is not known, and the first quarter | 300 | Gaps turned into the design of the pilot. The ask. |

Cut from the present draft: section 4 as a section, its table, and experiments as a topic; Facebook Chat, Flickr, Netflix's API, GitHub, LinkedIn, Booking.com, Dropbox, Wealthfront, Vogels, Allspaw, Bland, Harry's retrospective; Google Cloud 2025, Cloudflare, Roblox and flag debt (CrowdStrike and TSB survive as a sentence each); the timeline and five or six other figures; the checklist as a list; the method note.

New material needed: everything listed for (a), plus one regulated bank told at length (Starling or Monzo: what approvals remain, what the release looks like on an ordinary day), and a plain estimate of cost and time for the first year.

### Which to choose

Write (a). If, after (a) exists, the commissioner says a specific question is unanswered, add that part. Starting from (b) risks rebuilding the present draft at two thirds of its size.

## 8. Order of operations for a rewrite

1. Decide the reader and the decision. Director or manager; and what, exactly, they are being asked to approve. Until the ask is written down in two sentences, nothing else can be ordered.
2. Decide the claim, with its "because", in one sentence. "Better overall" fails this test. Every paragraph that survives must serve that sentence.
3. Decide the form: one essay, and separate homes for the playbook, the evidence and the method note. This is what gives permission to cut.
4. Choose the cases, two or three, and gather what is missing: the reader's numbers or a worked example, the full Knight and OANDA accounts from the research notes, the cost of the pilot.
5. Write the mechanism part first (the present section 5, expanded), with no citations and no company names, until it convinces on its own. If it does not, no amount of evidence will rescue the essay.
6. Write the payment case next, then Knight, then rollback, then the examiner. Each part should begin from where the last one left the reader, so that no part can be moved without rewriting its first sentence.
7. Write the ending: the gaps and the ask.
8. Write the opening after the ending, when it is clear what the opening has to set up. State the soak's defence in terms its owner would accept.
9. Then, and only then: convert citations to endnotes, choose three or four figures and place each after the paragraph it supports, write the headings as claims, and set the title.
10. Last, test the shape. Make a new reverse outline. Any paragraph that could be deleted without the next one noticing goes. Any paragraph whose shape is "claim, firm, citation" three times running gets rewritten or cut. Read the first 400 words alone and ask whether a director would know the claim, the reason and what they are being asked to do.
