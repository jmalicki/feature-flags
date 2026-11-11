# What persuasive engineering writing does that this essay does not

This review compares `essay.md` ("Stop soaking, start ramping") with seventeen pieces of writing that have changed how engineers and engineering leaders work. It was written after one reading of the essay and after fetching the exemplars from their own pages or from Internet Archive captures.

The short version: the essay has a good thesis ("the wait moved"), sound facts and honest caveats, and it buries all three under a survey. It cites 89 links, names about sixty organisations, carries 13 figures and runs to about 6,400 words, and no case in it gets more than one paragraph. The exemplars do the reverse. Each has one speaker, one story or mechanism, and the reader's objection in the first few lines. The essay's best material (Knight Capital, Uber's payment shadowing, Brian Harry's launch morning, the FCA's counts) is already in the repository. It needs to be told at length, early, and most of the rest cut.

## How the exemplars were read

| Exemplar | Status | Source used |
| --- | --- | --- |
| John Allspaw, letter to Yahoo management (written 2009, posted 2012) | Read in full | kitchensoap.com (the post is dated 5 January 2012; the July 2012 address returns 404) |
| John Allspaw, "Blameless PostMortems and a Just Culture" (2012) | Read in full | Internet Archive capture of codeascraft.com (etsy.com returned 403) |
| Timothy Fitz, "Continuous Deployment at IMVU" (2009) | Read in full | Internet Archive capture of timothyfitz.com |
| Eric Ries, "Continuous deployment for mission-critical applications" (2009) | Read in full | startuplessonslearned.com |
| Joel Spolsky, "Things You Should Never Do, Part I" (2000) | Read in full | joelonsoftware.com |
| Will Larson, "Migrations: the sole scalable fix to tech debt" (2018) | Read in full | lethain.com |
| Dan Luu, "Reading postmortems" (the "Postmortem lessons" piece) | Read in full, except one embedded table | danluu.com |
| Charity Majors, "Shipping Software Should Not Be Scary" (2018) | Read nearly in full (the last section only in part) | charity.wtf |
| Brian Harry, "A Rough Patch" (2013) | Read in part: about 85%, a stretch of the diagnostic middle was not read | devblogs.microsoft.com |
| Charity Majors, "I test in prod" (Increment, 2019) | Read in part: roughly the first 60% | increment.com |
| Mark Mansour, "Going faster with continuous delivery" (2019) | Read in part: every paragraph opened, long ones only to their first few sentences | aws.amazon.com |
| Jez Humble, "Continuous Delivery and ITIL: Change Management" (2010) | Read in part: all prose, not the bullet lists | continuousdelivery.com |
| Kent Beck, "Taming Complexity with Reversibility" (2015) | Read in part: all prose, not the bullet lists | newsletter.kentbeck.com |
| Atul Gawande, "The Checklist" (New Yorker, 2007) | Read in part: opening, the B-17 and Pronovost core, the Michigan section, the ending; about 40% of 8,000 words | newyorker.com |
| Brian Harry, "Testing in a Cloud Delivery Cadence" (2017) | Read in part: opening, taxonomy, closing reflections | devblogs.microsoft.com |
| Clare Liguori, "Automating safe, hands-off deployments" (2020) | Read in part: opening anecdote and the deployment-windows passage only | aws.amazon.com |
| Pete Hodgson, "Feature Toggles" (2017) | Read in part: the opening "Toggling Tale" only | martinfowler.com |
| Chuck Rossi, "Rapid release at massive scale" (2017) | Read in part: the first third | engineering.fb.com |
| Cindy Sridharan, "Testing in Production, the safe way" | Fetched from the Internet Archive (Medium returned 403) but not read; not used below | |
| Sarah Wells, QCon transcript | Fetched but not read; not used below | |
| Dan Luu, "How (some) good corporate engineering blogs are written" | Fetched but not read; not used below | |
| Paul Graham; Dan Luu "Files are hard"; Larson's book chapters | Not attempted | |

No exemplar that was attempted proved impossible to reach. Three direct addresses failed (Etsy, Medium, the July 2012 kitchensoap URL) and each was recovered from another address.

## 1. What each exemplar does

Lengths are approximate word counts of the body.

### Allspaw, letter to Yahoo management (about 1,150 words, plus a 350-word preface)

- Opens with a subject line that is a result the reader already cares about: "Why Flickr went from 73rd most popular Y! property in 2005 to the 6th, 5 years later."
- The speaker is the operations manager who held the go/no-go vote, writing to three layers of his own management on his way out the door. His authority is that he was the person paid to say no.
- One mechanism: launches were boring because the code was already running dark. Three launches are named, each in three or four sentences with what went wrong ("I actually held the launch back by some hours").
- The objection (ops must be the brake) is answered by the brake himself: "A significant part of my job was working towards saying 'go', not 'no-go'. In fact, almost all of it."
- Almost no numbers. One striking one, used as a shrug: "I have no idea how many code deploys there were made to production on any given day in the past 5 years ... because for the most part I don't care."
- Ends on four things nobody at Flickr needs convincing of, then: "These things are taken for granted. Any other way would simply feel weird."

### Allspaw, "Blameless PostMortems and a Just Culture" (about 1,300 words)

- Opens by voicing the manager's instinct in the manager's words: "What do you do with those careless humans who caused everyone to have a bad day? Maybe they should be fired."
- Speaker: the SVP of operations at Etsy, saying "we" about a practice his firm runs.
- One mechanism, drawn as a seven-step loop: punish, lose detail, know less, fail again.
- The objection is asked outright and the first answer is a concession: "Does it mean everyone gets off the hook for making mistakes? No. Well, maybe. It depends on what 'gets off the hook' means."
- No numbers at all. Authority is borrowed openly from Dekker and Hollnagel, each in one quotation.
- Ends by restating the choice in two sentences.

### Fitz, "Continuous Deployment at IMVU" (about 750 words)

- Opens by quoting his hecklers: "your site will be down. A lot."
- Speaker: an engineer for whom this is "just one part of my day job".
- One worked example: a single commit followed from check-in to all servers, with every number from his own system (nine minutes of tests on 30 to 40 machines, six minutes to push, 15,000 test cases run 70 times a day, one-in-a-million flakiness).
- The objection is the opening, and the answer is the walk-through itself.
- Ends on a joke with a number in it: the sceptic who said he must have no customers is referred to "our million dollar a month revenue mohawks".

### Ries, "Continuous deployment for mission-critical applications" (about 1,800 words)

- Opens with the reader's exact sentence: "that sounds great - for your business - but that could never work for my application."
- Speaker: IMVU's former CTO, with one self-deprecating credential: "a phone call from a sixteen-year-old girl complaining that your new release ruined their birthday party".
- Structure is the objection, split into two named beliefs, each taken in turn. "These beliefs are rooted in fears that make sense."
- Evidence is reasoning and one vivid example (a white checkout button on a white background), not citation.
- Ends with a question to the reader: "What's preventing you from using it for your mission-critical application today?"

### Spolsky, "Things You Should Never Do, Part I" (about 1,500 words)

- Opens on one company's disaster, in the present tense, then springs the claim in a line of its own: "They decided to rewrite the code from scratch."
- Speaker: a working programmer and founder, saying "we're programmers" and confessing the shared vice.
- One idea, stated as a law and repeated: "It's harder to read code than to write it."
- The reader's belief (old code is a mess) is voiced as dialogue, then answered with one concrete object, the two-page function whose "little hairs" are each a bug fix "that Nancy had".
- No statistics. Three named disasters. Jokes throughout ("As if source code rusted").
- Ends on an insult to Netscape, not a summary.

### Larson, "Migrations" (about 1,200 words)

- Opens: "The most interesting migration I ever participated in was Uber's ..." with two numbers from that project (two weeks of clock time, two days of engineering time per service).
- Speaker: the manager who ran it, addressing other managers.
- One three-word playbook: "Derisk, Enable, and then Finish."
- Names the reader's suspicion from the inside: each team "is making a bet on you that you're going to get this damn thing done".
- Ends by asking what the reader has seen.

### Luu, "Reading postmortems" (about 2,300 words)

- Opens "I love reading postmortems."
- Speaker has no war story of his own here. His authority is that he read a great many primary documents at Google and Microsoft and reports patterns, with stated limits ("I haven't done any kind of formal analysis").
- The objection he keeps meeting is "that's obvious", and he answers it with an incident: someone told him so "at pretty much the same time their company was having a global outage ... caused by the exact thing we were talking about."
- Numbers come from one paper, explained, not from ten papers, listed.
- Humour: "Don't get me wrong, I like humans. Some of my best friends are human."
- Ends: "Just because something is obvious doesn't mean it's being done." The section is titled "Not a Conclusion".

This is the nearest model for the essay's author: a reader of sources, in the first person.

### Majors, "Shipping Software Should Not Be Scary" (about 1,500 words) and "I test in prod" (about 2,900)

- Opens on someone else's question from that week, or on a meme.
- Speaker: a founder and former on-call engineer. "Let me tell you a story. In May 2019, we decided to upgrade Ubuntu ..." followed by what broke ("we had only tested bootstrapping during 50 out of the 60 minutes of the hour").
- One idea per essay, in the title, repeated in pull quotes.
- Names the fear as a fear: "It can feel less risky to not deploy than to deploy, but that's just not the case. It's simply a different kind of risk."
- Almost no numbers. Imperatives a manager can act on: "Never promote someone to 'senior engineer' if they can't deploy and debug their own code."

### Harry, "A Rough Patch" (about 2,700 words) and "Testing in a Cloud Delivery Cadence" (about 2,700)

- Opens: "Either I'm going to get increasingly good at apologizing to fewer and fewer people or we're going to get better at this."
- Speaker: a Microsoft corporate vice president, the accountable executive, writing during the incident. "You may not have noticed it by my presentation but for the couple of hours before I was frantically working with the team to restore the service."
- One bad fortnight followed in order, including what he still does not know: rolling back the flags "didn't" fix it, "And no one is completely sure why."
- The lesson arrives as his own conclusion from his own outage: "all customers are affected or none."
- In the 2017 piece he lists what the old way was good for before saying why he left it, and admits impatience: "18 months into it ... I started to agitate about when we were going to be 'done'."

### Mansour, "Going faster with continuous delivery" (about 3,300 words)

- Opens with a measurement of his own firm's "before": 16 days, a day and a half of coding, under an hour to build and deploy, "almost 14 days" waiting.
- Speaker: a senior manager, "we" throughout.
- Admits a wrong turn: the adoption metric "could lead teams to automate their release process without providing for any testing".
- Meets sceptics where they are: "encode their current release process, manual steps and all, in a pipeline".
- States priorities in an order a risk officer would accept: "we prioritize availability first, then speed".

### Liguori, "Automating safe, hands-off deployments" (about 5,500 words; opening only)

- Opens on herself as the sceptic: at her old job she spent hours on each fix and "frantically checked logs and metrics". At her Amazon interview she asked how much of the day went on watching deployments. "He told me usually none ... 'Whoa!' I said."
- A long reference piece that still earns its length by starting with one person's before and after.

### Humble, "Continuous Delivery and ITIL: Change Management" (about 2,900 words)

- Opens by granting the reader's process its legitimacy, then argues from inside the reader's own rulebook, with page numbers: ITIL already has pre-authorised "standard changes".
- Second person, used as a prod: "Worried that pressing the 'deploy' button might break stuff? That means your automated testing and deployment processes are not up to snuff."
- Ends with costs and a limit on his own claim ("only really appropriate for strategic IT projects").

### Beck, "Taming Complexity with Reversibility" (about 1,700 words)

- Opens with a talk he heard in 2002 and "thirteen years to digest what he said".
- One metaphor (a beast with four heads; Ford cut one, Facebook another) carried from start to finish.
- A whole section titled "Exceptions", four sentences long, which is where the essay's money quotation comes from.
- Ends with an exercise: "list decisions you regret."

### Gawande, "The Checklist" (about 8,000 words)

- Opens with a three-year-old girl under the ice of an Austrian fishpond for thirty minutes, and does not mention checklists for a thousand words.
- Speaker: a practising surgeon who includes himself among the resisters ("I've had a nurse bodycheck me").
- One protagonist (Peter Pronovost), one five-line checklist printed in full, one hospital's numbers: line infections "from eleven per cent to zero", then Michigan.
- Voices the profession's objection at full strength: "Some physicians were offended ... Others had legitimate doubts about Pronovost's evidence."
- Shows how the conservative institution was actually moved: Pronovost "didn't order them to use the checklists. Instead, he asked them simply to gather data on their own infection rates."
- One refrain, earned by the B-17 story: "too much airplane for one man to fly."
- Ends by returning to the girl in the pond and revealing that a checklist saved her.

### Hodgson and Rossi (openings only)

- Hodgson's 7,900-word reference article begins "Picture the scene" and follows one invented team and one function through every stage, with the code. A constructed example, plainly presented as one.
- Rossi opens with the old system's own numbers (500 to 700 cherry-picks a day, weekly pushes of up to 10,000 diffs) and why it "was not sustainable".

## 2. Side by side with the essay

| Dimension | The exemplars | The essay | Where it falls short |
| --- | --- | --- | --- |
| Opening | A person in trouble, a heckler quoted, the reader's own sentence, or a measured "before". The claim comes after the reader is leaning in. | "It is a careful process, and this essay argues that you should replace it." Then: "That is the whole claim of this essay: change, because the alternative is better overall." | It announces a claim about itself. The heading "You are behind, and that is an advantage" tells directors they are behind before anything has earned the right. Paragraph three names twelve firms in five sentences. |
| Speaker | One person with a job title and something at stake, or (Luu) a named reader of documents saying "I". | Nobody. The only "I" and "we" in 6,400 words are inside quotations. The author appears as "this essay" eleven times: "None of the texts read for this essay", "No post-mortem found for this essay", "as read in summary for this essay". | The voice is a literature review's. A director cannot tell who is asking them to change their release process, or what that person saw. |
| Mechanism or story | One, carried through. | "The firms that left the testing period behind did not stop waiting. They moved the wait." This is a real single idea. It is then joined by a second ("One idea, three settings"), a third (three kinds of rollback), six management headings, seven failure headings and six steps. | The thesis is stated once in section 2 and not used as a spine. Knight Capital, the strongest story, is one paragraph in section 9 of 10. Uber's shadowing is five sentences. |
| The reader's objection | In the first lines (Ries, Fitz), or asked aloud and half-conceded (Allspaw). | "Your objection is fair: a bad release at a photo site shows the wrong picture, and a bad release at your firm sends the wrong payment." | This is the best sentence in the essay and it arrives about 4,000 words in, at section 8. Until then the reader has been arguing with every paragraph. |
| Concessions | The author concedes the reader's fear, or their own error. | "The review reports associations, and it does not tell anyone to abolish their change board." "Speed alone is no virtue either." "though nobody has run a controlled comparison either way." | The essay concedes the limits of its sources, which reads as hedging. It rarely concedes what the reader is afraid of, which would read as respect. Both are honest; only one persuades. |
| Evidence and numbers | Few numbers, from the author's own system, each given room. Or one study, explained. | "Google's 2010 paper ... In 2007 Ron Kohavi and colleagues ... At LinkedIn and Uber ... At Booking.com ..." (five sources, one paragraph). | Breadth in place of depth. The repeated shape "firm did thing (citation)" is the rhythm that reads as machine-assembled. None of the numbers are the reader's. "Measure your three days" is step 1 of the last section; Gawande and Mansour show it belongs at the start. |
| Admitting error and cost | In the author's voice: "no one is completely sure why"; "I started to agitate". | Section 7 reports costs faithfully, as a stack of other people's quotations. | The material is there (Harry, Netflix on burnout, OANDA's two years). It is listed where it should be told. |
| Sentence habits | Varied. Jokes, asides, a swear word, a one-line paragraph. | Nearly every paragraph is claim, three cited instances, aphorism: "The second question is the one you need answered." "Ramp them too." "It is never speed." "Count agreement, not days." "Move approval; do not delete it." | The uniform cadence and the closing epigram on each paragraph are what "AI-generated" means to a reader. Any one of these lines is fine. Twenty are a tic. |
| Ending | A question, an exercise, a joke, or a return to the opening scene. | "The second way is better overall. A regulator's data, more than fifteen years of published practice and the accounts of firms that move money for a living support it." Then "Sources and method". | A summary of what was just said, in the vaguest words in the piece ("better overall" appears three times), followed by methodology. |
| Length and furniture | 750 to 3,000 words; few or no figures. Gawande's 8,000 follow one man. | About 6,400 words, 10 numbered sections, 13 figures, 2 tables, 18 bold lead-ins, 89 links. | It is formatted as a report. The commissioner asked for an argument. |

## 3. The recurring moves, ranked by how much they would help

1. Tell one case at length, from the primary document, before making the claim. Spolsky has Netscape, Gawande the pond and the B-17, Harry his launch morning. The essay has Knight Capital and the SEC's own sentences, and Knight has the rare property that it reverses the reader's assumption: Knight did wait, and the wait saw nothing.
2. Put the reader's objection first and concede what is true in it. Ries and Fitz open with it. The essay already owns the sentence; it is in the wrong place.
3. Follow one change all the way through. Fitz follows one commit; Hodgson one function. The essay describes dormant, shadow, staff, cohort, rollback and reconciliation in separate sections and never shows one change making the trip, or the same change riding the train.
4. Use the reader's own numbers, and make the first request a measurement. Pronovost asked hospitals for their own infection rates. Mansour's 16 days was Amazon measuring itself. The reader's numbers are known: two trains a week, three days each.
5. Hold one idea and cut what does not serve it. "The wait moved" is enough. The canary, flag and experiment taxonomy is a second essay.
6. Have a speaker. Someone has to say "I".
7. Let costs and mistakes be told by the people who paid them, in long quotation, not summarised.
8. Fewer sources, quoted longer. Three quotations of three sentences beat thirty of one clause.
9. End by handing the reader something to do or answer.
10. Vary the sentences and allow some dryness. The SEC's "This action worsened the problem" is funnier and more frightening than any epigram the essay supplies.
11. Plain definitions and concrete nouns. The essay already does this well ("a setting that chooses between the old behaviour and the new without another deployment"). Keep it.

## 4. Which moves are honestly available

The author is not a practitioner with war stories, and must not pretend to be. That removes "at my firm", invented anecdotes and unlabelled composites. It removes little else.

- Extended retelling of a documented case. Knight from the SEC order, RBS from the FCA's final notice, Uber's payment shadowing from Uber's own account, and Harry's 2013 outage in his own words are all in the report with direct quotation. Two of these told over 400 to 600 words each would do more than the present forty cases.
- A borrowed first person. Harry is a corporate vice president apologising in public and Allspaw is the man who held the no-go vote. Quoted for a full paragraph, they give directors a peer's voice. The essay currently trims them to a clause.
- The investigator's first person, which is Luu's. "I went looking for a rule that requires a soak period. I read PCI DSS v4.0, the FFIEC handbook, the EBA guidelines, DORA and the MAS guidelines, and did not find one." The essay has this fact in the passive. The same goes for "I looked for a post-mortem that blames a ramp" and for the gaps. This is honest only if whoever signs the essay has done, or checked, that reading; if not, name the documents as the actors ("the SEC order says").
- What the common story gets wrong. The report's corrections table (Knight is usually told as reckless speed; the order describes a staged deployment and an unexercised path) is the available form of "what I got wrong", and it flatters the reader, who has probably heard the usual version.
- The reader's own numbers. About a hundred trains a year. Three questions they can answer in a week: how many of the three days are testing and how many are waiting; how many changes the change board rejected last year (the FCA found firms where the answer was none); when a rollback was last performed and how long it took.
- A regulator's data. The FCA's million changes at 23 firms, with its caveat in one sentence, not four.
- A constructed walk-through of one change, clearly labelled as an illustration, with every technique in it tied to a firm that published it and the one inferred rule (hold a settlement change for a reconciliation cycle) marked as inference, as the essay already does.

## 5. A proposed opening and outline

Every fact below is in the essay or in the synthesis report. Nothing is added.

### Opening (about 330 words)

> On 27 July 2012 Knight Capital began installing new order-routing code on its eight production servers. It went carefully: a few servers a day, over several days. For five days production showed nothing wrong.
>
> In those five days the code had not run once. It supported a programme that had not launched yet, so nothing called it. On the morning of 1 August the programme went live, on every server at the same moment, and two things came out that five quiet days had kept hidden. A technician had missed one of the eight servers. And the switch that turned the new code on was a reused one, which on the eighth server still started a function nobody had used since 2003. Ninety-seven automated emails naming that old function went out before the market opened. Nobody read them.
>
> In about 45 minutes Knight made 4 million executions in 154 stocks and lost more than $460 million. Then it tried to go back. It removed the new code from the seven servers that had it right. The SEC's order is dry about the result: "This action worsened the problem."
>
> Knight is usually told as a warning against moving fast. Read the order and it is a warning about the kind of waiting you do twice a week. Knight waited. It staged its deployment. What it never did was let the new behaviour handle a small amount of real work while someone watched, and its way back was improvised. Your release spends three days in pre-production for the reason Knight's code spent five days on its servers: to see whether anything goes wrong. A wait can only see what is exercised during it. Knight's saw nothing, and three days of soak would have seen the same nothing.
>
> So this is an essay about where to do your waiting. You are right that a bad release at your firm sends the wrong payment. The firms that move money and have left the release train agree with you, and on some changes they wait far longer than you do: around six weeks at Square, at least a month at Adyen. They wait in production, on one small change, for a few clients, with a way back they have rehearsed.

### Outline of the rest

Target about 3,000 words in all, three figures at most, unnumbered headings.

- What the SEC asked for. Finish Knight honestly: the order's remedies were a second person checking the deployment, monitoring of the warnings and a rule for disconnecting. Say plainly that the ramp is this essay's reading, not the SEC's.
- Your three days. The reader's hundred trains a year; Amazon's 16 days of which almost 14 were waiting; the three questions to answer before deciding anything; the FCA's counts as what a regulator found when it asked firms like theirs.
- "But we move money". The objection at full strength with Beck's exception, then Uber's payment shadowing told step by step with its own words, the 99.99% bar and the arithmetic of nines, and the reminder that banks already call this a parallel run.
- One change, both ways. A labelled illustration: one settlement change on the Tuesday train, then the same change dark, in shadow, to staff, to one client that agreed to go first, held through a reconciliation cycle, then everyone. Who waits in each version. The Square lesson about ramping by client goes here.
- The morning it goes wrong. Harry's 2013 launch in his own sentences; the 45 minutes "to figure out how to turn it off" a year later; RBS testing the wrong back-out. Then the three-part policy: pre-approved, on-call may act, rehearsed.
- What it costs, and what you keep. Told through Netflix's half-measure, OANDA's two years and 15%, and Harry's "agitate". Approval moves, it is not deleted: Starling's three approvals and "our auditors loved this one". Where the rule texts do constrain. The trains that stay (card networks, SWIFT, cut-over weekends).
- What nobody has published. The five gaps, in the first person, in under 150 words.
- This month. Measure the three days; put today's process in a pipeline unchanged; one team, one change, one rehearsed rollback. End on a question to the reader or on Knight's eighth server, not on a summary.

## 6. What to delete

- The heading "You are behind, and that is an advantage", the "fast follower" frame, and the paragraph beginning "You would not be a pioneer".
- "That is the whole claim of this essay: change, because the alternative is better overall", "This essay uses both", and every other "this essay". The phrase "better overall" everywhere.
- The italic line "Written for engineering managers ... Research completed November 10, 2026."
- Section 4 almost whole: the table, Google 2010, Kohavi 2007, LinkedIn, Booking.com, the one-third statistic, product experiments and the Consumer Duty paragraph. Experiments are a separate essay. Keep only the point that the unit of exposure is the client.
- The roll-calls in section 3 (Facebook 2015, Flickr, Netflix 2013, GitHub, Square). Keep one.
- Section 9 as a catalogue. Google Cloud 2025, CrowdStrike, Cloudflare, Roblox, Uber's 1,381 flags and TSB become a short checklist in an appendix. Knight moves to the front and RBS to the rollback section.
- The quotation stacks in section 7: the 2018 survey, Microsoft's shipping goals, Dropbox, the Google handbook line, Google's five years.
- One of Atlassian and Stripe 2019. They make the same point.
- The regulator detail in section 8 (MAS, FFIEC, PCI role counts, DORA articles) and figure 12. Two sentences stay in the body; the rest becomes an appendix for the reader's risk partner.
- Ten of the thirteen figures, including the timeline, the exposure ladder, the one-mechanism loop, the seven published ramps with its source line, the three rollbacks and the six steps. Keep the sixteen-day bar, who waits, and one of Knight or Uber's shadowing.
- "Sources and method" from the body. Link it.
- The closing summary paragraph and "Speed alone is no virtue either."
- Section numbers, bold lead-ins used as paragraph openers, and cross-references such as "as section 5 explains".
- The epigram that closes each paragraph. Keep two or three in the whole piece.
- Inline glossary asides that interrupt a sentence ("An Amazon 'Region' is ...", "RLP was the new programme the code supported").
