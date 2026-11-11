# Benchmark review: essay.md against published professional writing

## Scope and method

I read `essay.md` once, then fetched and read seventeen published documents of the kinds it is trying to be. Quotations below are copied from the fetched text. Where I read only part of a document I say so, and I list the documents I could not reach at the end of section 1.

The sentence statistics in section 2 come from a crude splitter run over body paragraphs only (paragraphs longer than 200 characters). They are good enough to compare documents with each other and should not be quoted as exact.

The short version of the result:

- The essay already has the skeleton of an audit report (summary, numbered findings, numbered recommendations, a statement of limits). Its skeleton is better than most of the consulting exemplars.
- What it lacks is at the level of the paragraph and the sentence. It argues by lining up other firms' cases, closes most paragraphs on an epigram, phrases every recommendation as "the business should", and keeps its uncertainty in separate paragraphs.
- The best exemplars for this audience (the Google SRE book, the AWS Builders' Library, Will Larson, the FCA review at its best) reason from the mechanism, do their own arithmetic, give instructions, and attach each caveat to the claim it qualifies.

## 1. The exemplars

### Regulator and audit-body prose

#### FCA, "Implementing technology change" (multi-firm review, 2021)

- Access: read in full (main body; annexes skimmed).
- Type: regulator's thematic review, findings without binding recommendations.
- Opening: "This review sets out the findings from our cross-Financial Services change management review which looked at how financial firms manage technology change, the impact of change failures and the practices utilised within the industry to help reduce the impact of incidents resulting from change management. A number of significant IT failures in the last 10 years have led to greater scrutiny of the effectiveness of technology change management in the financial services (FS) sector."
- Finding, stated as a heading that is a full sentence: "Major changes were twice as likely to result in an incident when compared with standard changes".
- Evidence and uncertainty: "However, due to the sample size no firm conclusion could be identified as to the impact a DevOps methodology has on change success." And on emergency changes: "This could be due to an incident already being open for the issue being addressed by the change, but may also indicate strong risk awareness when it comes to implementing emergency changes."
- Texture: mean about 24 words, very even (only 1% of sentences under nine words, 10% over 34). Paragraphs of two or three sentences. The recurring frame is "We found that…", then "However, …", then "This may indicate…". The verbs are graded: "found", "observed a link", "may indicate", "supports the view".
- Authority: it says what it did before it says what it found ("We used a data-driven approach to analyse over 1m production changes implemented in 2019"), and every percentage arrives with its denominator.
- The standard: "In total, the sampled firms deployed nearly 68,000 major changes over 2019, which resulted in 2,600 incidents. This is an average failure rate of 3.8%, compared to 1.6% from all change types."
- Weakness to note: the framing paragraphs are flabby ("leveraging different business models", "it is critically important for firms to understand", "practices utilised"). The FCA is a model for its findings and a warning in its connective tissue.

#### PRA Supervisory Statement SS1/21, "Operational resilience: Impact tolerances for important business services" (2021)

- Access: read in part (chapters 1, 2 and 4 of nine).
- Type: supervisory expectations.
- Opening: "This Supervisory Statement (SS) sets out the Prudential Regulation Authority's (PRA) expectations for the operational resilience of firms' important business services, for which they are required to set impact tolerances. The policy objective is to improve the resilience to operational disruptions of both firms and the wider financial sector."
- Recommendation: "Firms are expected to have a prioritised plan which sets out how they will comply with the requirement to be able to remain within their impact tolerances within a reasonable time, and no later than Monday 31 March 2025."
- Uncertainty and proportion: "Firms are not expected to have performed mapping and scenario testing to the full extent of sophistication by Thursday 31 March 2022."
- Texture: numbered paragraphs, one expectation each. Three modal verbs with fixed meanings ("must" for rules, "are expected to" for supervisory expectation, "should" for guidance). Each abstract expectation is followed by a worked example with numbers ("after six hours of disruption, this impacts customers' abilities to settle transactions… after eight hours of disruption, this creates a reputational risk").
- Authority: named owner ("Senior management are expected to take responsibility for delivering the policy outcomes"), named date, and the refusal to pretend disruption can be prevented.
- The standard: "The PRA's approach to operational resilience is based on the assumption that, from time to time, disruptions will occur which will prevent firms from operating as usual and see them unable to provide their services for a period."

#### FCA Final Notice to TSB Bank plc (December 2022)

- Access: read in part (sections 1 and 2, the action and summary of reasons, of a document of roughly 39,000 words). I used this in place of the Slaughter and May report, which I could not retrieve intact.
- Type: enforcement finding on a failed technology migration.
- Opening: "For the reasons given in this Final Notice, the Authority hereby imposes on TSB Bank plc ("TSB") a financial penalty of £29.75 million pursuant to section 206 of the Act. TSB agreed to resolve this matter and qualified for a 30% (stage 1) discount under the Authority's executive settlement procedures."
- Finding: "However, nine days after it had resolved to re-plan, and before it had concluded its re-planning exercise, TSB publicly announced it would now migrate in Q1 2018."
- Evidence: "Between 22 April 2018 and 7 April 2019, TSB received 225,492 complaints from customers (c.4.3% of its customer base as at MME) as a result of the Migration Incident, and paid a total of £32,705,762 in redress during that period."
- Texture: the conclusion comes first (the penalty), then the narrative. Sentences run long but each carries one dated fact. Adjectives are rationed; the damning word is usually a plain one ("insufficiently", "before").
- Authority: dates, counts and sequence do the criticising. The notice never says the planning was reckless; it gives two dates nine days apart.
- The standard: "Testing only concluded the day before the decision to migrate was taken."

#### Lael Brainard, "Some Preliminary Financial Stability Lessons from the COVID-19 Shock" (Federal Reserve speech, March 2021)

- Access: read in part (roughly the first two-thirds). It is on financial stability, not operational resilience; the Bank of England and BIS operational-resilience speeches I tried would not load.
- Opening: "It has now been one year since the devastating effects of the first wave of the COVID-19 pandemic hit our shores, a year marked by heartbreak and hardship. We look forward to a brighter time ahead, when vaccinations are widespread, the recovery is broad based and inclusive, and the economy fully springs back to life."
- Recommendation: "CCPs could assess their margin models, consider improvements to reduce pro-cyclicality, and consider increased transparency to help clearing members anticipate margin calls during periods of volatility."
- Evidence: "Over the worst two weeks in mid-March, net redemptions at publicly offered institutional prime MMFs amounted to 30 percent of assets."
- Texture: the longest sentences of anything I read (mean about 28 words, 28% over 34). Recommendations are attributed to nobody ("A number of possible reforms have been suggested", "Some have suggested").
- Authority: the office of the speaker and the precision of the figures. The prose itself earns little.
- The standard: "For the second time in 12 years, a run on MMFs triggered the need for policy intervention to mitigate the effect on financial conditions and the wider economy."
- Use: mostly a negative model. "Warrant careful analysis", "underscores the importance of" and "presents an important opportunity to reflect" are what a recommendation sounds like when its author may not commit.

### Strategy-consultancy prose

#### McKinsey, "Yes, you can measure software developer productivity" (2023)

- Access: read most of it (all but the last section).
- Opening: "Compared with other critical business functions such as sales or customer operations, software development is perennially undermeasured. The long-held belief by many in tech is that it's not possible to do it correctly—and that, in any case, only trained engineers are knowledgeable enough to assess the performance of their peers."
- Recommendation: "Top tech companies aim for developers to spend up to 70 percent of their time doing inner-loop activities."
- Evidence: "This new approach has been implemented at nearly 20 tech, finance, and pharmaceutical companies, and the initial results are promising."
- Texture: mean about 25 words. Concession first ("There is no denying that…"), then "To help overcome these challenges… we developed an approach". Evidence is the anonymous vignette: "one company found…", "Another company, after discovering…".
- Authority: the firm's name, a count of clients, and a prize stated as three bullets ("20 to 30 percent reduction in customer-reported product defects"). It never shows a denominator or a failure.
- The standard, such as it is: "For instance, while deployment frequency is a perfectly good metric to assess systems or teams, it depends on all team members doing their respective tasks and is, therefore, not a useful way to track individual performance."
- Use: the answer-first opening and the quantified prize are worth copying. The vocabulary is the list in section 6.

#### McKinsey, "Developer Velocity: How software excellence fuels business performance" (2020)

- Access: read in part (the research and findings sections, from an Internet Archive capture; I did not capture the article's opening paragraphs).
- First two sentences of its findings: "Our research reveals that top-quartile DVI scores correlate with 2014–18 revenue growth that is four to five times faster than bottom-quartile DVI scores (Exhibit 1). Top-quartile companies also have 60 percent higher total shareholder returns and 20 percent higher operating margins."
- Finding: "Our research shows that best-in-class tools are the top contributor to business success—enabling greater productivity, visibility, and coordination. Yet only 5 percent of executives recognized this link and ranked tools among their top-three software enablers."
- Uncertainty: carried by one word, "correlate", and then forgotten; by the next paragraph tools are "the top contributor to business success".
- Authority: sample size ("senior executives at 440 large enterprises, more than 100 expert interviews") and the surprise structure: what executives believe, then what the data shows.
- The standard: the "Yet only 5 percent of executives…" sentence. A finding lands harder when set against the belief it overturns.

#### Thoughtworks Technology Radar, "Decoupling deployment from release"

- Access: read in full (it is one paragraph).
- Opening: "Implementing Continuous Delivery continues to be a challenge for many organizations, and it remains important to highlight useful techniques such as decoupling deployment from release. We recommend strictly using the term Deployment when referring to the act of deploying a change to application components or infrastructure."
- Recommendation: as above, "We recommend strictly using…".
- Uncertainty: none inside the entry; the Radar's ring carries the confidence, and the archive banner says "our assessment might be different today".
- Texture: five sentences. Define the two terms, name the techniques, state the benefit to each party.
- Authority: a verdict from people who do the work, with no supporting cases at all.
- The standard: "More-frequent deployments reduce the risk associated with change, while business stakeholders retain control over when features are released to end users."
- Use: this is the essay's whole thesis in 22 words, with the benefit to engineering in one clause and the benefit to the business in the other.

#### Accenture, "Technology Vision 2024" (negative exemplar)

- Access: read in part (the introduction and the first trend).
- Opening: "This is a moment for reinvention. In the coming years, businesses will have an increasingly powerful array of technologies at their disposal that will open new pathways to unleash greater human potential, productivity, and creativity."
- Recommendation: "The world is watching. Will you be a role model or a cautionary tale?"
- Evidence: "Case in point: OpenAI launched ChatGPT in November 2022, and it became the fastest-growing app of all time."
- Texture: short declarative, then a long abstract sentence, then a run of rhetorical questions (7% of its sentences are questions; the essay and the FCA have none).
- Authority: none on the page.
- Use: section 6.

### Practitioner-expert prose

#### Google, Site Reliability Engineering, chapter 3, "Embracing Risk"

- Access: read most of it (the opening, "Managing Risk", "Measuring Service Risk", and "Motivation for Error Budgets" through "Key Insights"; I skipped the middle sections on risk tolerance by service type).
- Opening: "You might expect Google to try to build 100% reliable services—ones that never fail. It turns out that past a certain point, however, increasing reliability is worse for a service (and its users) rather than better!"
- Finding: "100% is probably never the right reliability target: not only is it impossible to achieve, it's typically more reliability than a service's users want or notice."
- Evidence and uncertainty: "Unfortunately, one can rarely prove that this balance is optimal, rather than just a function of the negotiating skills of the engineers involved."
- Texture: mean about 22 words, narrow spread. The paragraph pattern is claim, mechanism, small worked sum: "If a problem causes us to fail 0.0002% of the expected queries for the quarter, the problem spends 20% of the service's quarterly error budget." No outside firm is cited anywhere in what I read.
- Authority: "we" who run the systems; the reader's expected objection stated first and then reversed; arithmetic the reader can check.
- The standard: "We strive to make a service reliable enough, but no more reliable than it needs to be."

#### Clare Liguori, "Automating safe, hands-off deployments" (AWS Builders' Library, 2020)

- Access: read in part (introduction, the sections on bake time and on alarm and time-window blockers, and the conclusion).
- Opening: "When I interviewed for my job at Amazon, I made sure to ask one of the interviewers, "How often do you deploy to production?" At the time, I was working on a product that rolled out a major release once or twice a year, but sometimes I needed to release a small fix in between big releases."
- Practice stated as fact: "A typical pipeline waits at least one hour after each one-box stage, at least 12 hours after the first regional wave, and at least two to four hours after each of the rest of the regional waves, with additional bake time for individual Regions, Availability Zones, and cells within each wave."
- Uncertainty and exception: "Though it's extremely rare, in some cases an urgent change (like a security fix or a mitigation for a large-scale event affecting service availability) might need to be delivered to customers more quickly than the time the pipeline usually takes to bake changes and deploy."
- Texture: mean about 25 words, steady. The characteristic move is the stated trade: "we need to balance the risk of causing a broader impact… versus the speed at which we can deliver changes", and "On the one hand… On the other hand…" with a mechanism on each side.
- Authority: every number has a unit and a reason; "We have found that" precedes each design choice; the cost of the safe option is always named.
- The standard: "On the one hand, very small time windows can cause changes to pile up in the pipeline while the time window is closed, increasing the likelihood that any one of those changes in the next deployment will have an impact when the time window opens."

#### Martin Fowler, "FrequencyReducesDifficulty" (2011)

- Access: read substantially in full (a short piece; the sentences around its diagram may not have been captured).
- Opening: "One of my favorite soundbites is: if it hurts, do it more often. It has the happy property of seeming nonsensical on the surface, but yielding some valuable meaning when you dig deeper".
- Recommendation: "So whenever you're faced with a painful activity, ask yourself if these forces apply."
- Uncertainty: "What is it that causes this effect? I think there are three broad reasons."
- Texture: mean about 15 words; 27% of sentences under nine words. One aphorism, placed first, then three reasons signposted "Firstly", "a second reason", "A third reason".
- Authority: he explains why the rule works and so tells the reader when it will not.
- The standard: "It did hurt, so you did it more often, and now it no longer hurts."

#### Will Larson, "Migrations: the sole scalable fix to tech debt" (2018)

- Access: read in full.
- Opening: "The most interesting migration I ever participated in was Uber's migration from Puppet-managed services to a fully self-service provisioning model where any engineer at the company could spin up a new service in two clicks. Not only could they, they did, provisioning multiple services each day by the time the service was complete, and every newly hired engineer spinning up a service from scratch their first day."
- Recommendation: "Don't start with the easiest migrations, which can lead to a false sense of security."
- Evidence and uncertainty: "Lore tells us that Googlers have a phrase, "Running to stand still"…". Hearsay is labelled as hearsay.
- Texture: mean about 22 words with real variation. Imperatives carry the advice: "Write a design document and shop it with the teams that you believe will have the hardest time migrating. Iterate." The whole method is three verbs: "Derisk, Enable, and then Finish."
- Authority: one case he ran himself, with its two numbers ("about two weeks of clock time and about two days of engineering time"), and a playbook with an order.
- The standard: "This is always the first step, because it turns time into your friend. Instead of falling behind by default, you're now making progress by default."

#### Dan McKinley, "Choose Boring Technology" (2015)

- Access: read in full.
- Opening: "Probably the single best thing to happen to me in my career was having had Kellan placed in charge of me. I stuck around long enough to see Kellan's technical decisionmaking start to bear fruit."
- Finding: "It is basically always the case that the long-term costs of keeping a system working reliably vastly exceed any inconveniences you encounter while building it."
- Uncertainty: "Clearly this model is approximate, but I think it helps."
- Texture: mean about 16 words, 22% under nine. One invented unit (the innovation token) carries the argument. The opposing slogan is quoted and taken apart: "The problem with "best tool for the job" thinking is that it takes a myopic view of the words "best" and "job.""
- Authority: named experience (Etsy, with the failure in a footnote), and the willingness to dismiss the alternative in one sentence.
- The standard: "The nice thing about boringness (so constrained) is that the capabilities of these things are well understood. But more importantly, their failure modes are well understood."

#### Charity Majors, "Friday Deploy Freezes Are Exactly Like Murdering Puppies" (2019)

- Access: read in part (roughly the first half and the closing paragraphs).
- Opening: the post opens on an embedded tweet and "So, that happened."
- Finding: "There's nothing morally "wrong" with Friday freezes. But it is a costly and cumbersome bandage for a problem that you would be better served to address directly."
- Uncertainty: "I'm not saying that every place is perfect, or that every company can run like a tech startup."
- Texture: the widest spread of any exemplar (standard deviation about 15 words). Capitals, profanity, bulleted costs.
- Authority: the diagnosis is concrete (the list of what engineers do while waiting: "batching up changes into bigger changes that are decidedly unsafe to deploy").
- Use: the content is the essay's Finding 2; the register is wrong for a commissioned assessment. It marks the upper bound of heat.

### Journalistic and long-form briefing prose

#### Atul Gawande, "The Checklist" (The New Yorker, 2007)

- Access: read in part (the opening and the Pronovost section, about a third of the article).
- Opening: "The damage that the human body can survive these days is as awesome as it is horrible: crushing, burning, bombing, a burst blood vessel in the brain, a ruptured colon, a massive heart attack, rampaging infection. These conditions had once been uniformly fatal."
- Finding: "Checklists established a higher standard of baseline performance."
- Evidence and uncertainty: "The results were so dramatic that they weren't sure whether to believe them: the ten-day line-infection rate went from eleven per cent to zero. So they followed patients for fifteen more months."
- Texture: mean about 19 words; 19% under nine; paragraphs of six sentences. One case (Pronovost at Johns Hopkins) is followed for thousands of words: baseline, intervention, result, replication.
- Authority: before-and-after numbers from one place, and the author's own scepticism voiced before the reader's ("These are, of course, ridiculously primitive insights").
- The standard: "In more than a third of patients, they skipped at least one."

### Post-incident reviews

#### Stripe, "Root cause analysis: significantly elevated error rates on 2019-07-10"

- Access: read in full.
- Opening: "Millions of businesses rely on Stripe. We see reliability as one of our most serious obligations and highest priorities."
- Finding: "We describe the failure in more detail below, but the very short summary is that two different database bugs and a configuration change interacted in an unforeseen way, causing a cascading failure across several critical services."
- Uncertainty: "Two nodes became stalled for yet-to-be-determined reasons."
- Texture: mean about 19 words. Subject, verb, time: "Automated monitoring detected the failed election within a minute. We began incident response within two minutes."
- Authority: it reports its own wrong assumption without softening ("We initially assumed that the same issue had reoccurred on multiple shards").
- The standard: "The new version operated properly in production for the past three months, including many successful failovers. However, the new version also introduced a subtle fault in the database's failover system that only manifested in the presence of multiple stalled nodes." (This is also the essay's Knight point, that time in production proves nothing about a path not exercised, made without commentary.)

#### Atlassian, post-incident review of the April 2022 outage

- Access: read in part (executive summary, "What happened", and the headings and first paragraphs of the learnings).
- Opening: "On Tuesday, April 5th, 2022, starting at 7:38 UTC, 775 Atlassian customers lost access to their Atlassian products. The outage spanned up to 14 days for a subset of these customers, with the first set of customers being restored on April 8th and all customer sites progressively restored by April 18th."
- Recommendation: a heading that is a sentence, "Learning 1: "Soft deletes" should be universal across all systems", followed by commitments in the future tense: "We will release public communications on incidents within hours."
- Texture: bolded label, then one plain sentence of cause. Counts everywhere (883 sites, 775 customers, 07:38 to 08:01).
- The standard: "Instead of providing the IDs of the intended app being marked for deletion, the team provided the IDs of the entire cloud site where the apps were to be deleted."

### Documents I could not read

- UK National Audit Office, "Lessons learned: Delivering programmes at speed" and the RTGS renewal report: blocked on the live site and absent from the archive captures I tried.
- Slaughter and May's independent review of the TSB migration: the archived PDF arrived truncated and unreadable.
- House of Commons Treasury Committee, "IT failures in the financial services sector": refused (HTTP 403).
- The Economist (leader on the CrowdStrike outage), a BIS speech and a Bank of England operational-resilience speech: blocked or returned only cookie notices.
- DORA State of DevOps 2023: only the landing-page summary loaded, not the report.
- Kohavi and Thomke, "The Surprising Power of Online Experiments" (HBR): the first paragraph only, before the paywall.
- Cloudflare's July 2019 outage post and the SRE book's "Release Engineering" chapter: opening paragraphs only; not used as evidence here.

Because no audit-office report loaded, the claims below about audit prose rest on the FCA review, the FCA Final Notice and the PRA statement.

## 2. Side by side

### Sentence texture

| Document | Mean words per sentence | Share of sentences of 8 words or fewer | Share of 35 words or more |
| --- | --- | --- | --- |
| essay.md | 24 | 10% | 24% |
| FCA review | 24 | 1% | 10% |
| SRE, "Embracing Risk" | 22 | 4% | 10% |
| AWS, Liguori | 25 | 2% | 17% |
| Larson | 22 | 10% | 18% |
| Stripe RCA | 19 | 8% | 8% |
| Gawande | 19 | 19% | 8% |
| McKinley | 16 | 22% | 1% |
| Fowler | 15 | 27% | 0% |
| McKinsey (productivity) | 25 | 8% | 17% |
| Brainard speech | 28 | 11% | 28% |

The essay's average is ordinary. Its tail is not: about a quarter of its sentences run to 35 words or more, a share matched only by the central-bank speech. The long sentences are mostly the ones that carry a case and its citation.

### Opening

The essay:

> The business releases twice a week, and each release spends three days being promoted through environments and soaked before it reaches clients. This assessment finds that the model is sound on safety and expensive on speed: it imposes roughly five days of delay on every change regardless of risk, it forces changes into batches, and it cannot be made faster without weakening the protection it exists to provide.

Stripe:

> We describe the failure in more detail below, but the very short summary is that two different database bugs and a configuration change interacted in an unforeseen way, causing a cascading failure across several critical services.

SRE:

> You might expect Google to try to build 100% reliable services—ones that never fail. It turns out that past a certain point, however, increasing reliability is worse for a service (and its users) rather than better!

The difference. The essay's opening is its second-best paragraph and does put a finding in sentence two. Three things hold it back. The verdict is phrased as a balanced pair ("sound on safety and expensive on speed"), which reads as even-handedness where a number would read as a finding. The recommendation does not appear until the third paragraph. And the prize is never quantified: "They develop substantially faster" is the only statement of what the reader gets, although the essay's own body contains the figures (a build in production within a day; one day of changes per build against half a week's).

### Statement of the problem

The essay, Finding 2:

> The cost is larger than the calendar time suggests. Finished work sits idle, and the engineer who wrote it has moved on by the time production shows whether it was right.

AWS:

> On the one hand, very small time windows can cause changes to pile up in the pipeline while the time window is closed, increasing the likelihood that any one of those changes in the next deployment will have an impact when the time window opens.

The difference. Finding 1 is the essay at professional standard: it does its own arithmetic and ends on a concrete contrast ("the same for a corrected label as for a change to the routing of outbound payments"). Finding 2 then states three good mechanisms in one paragraph and leaves them, to make room for a paragraph about Amazon, LinkedIn and Facebook. Liguori gives one mechanism a whole sentence with cause and consequence joined ("pile up… increasing the likelihood"). The essay's heading also retreats into an abstract verb: "The delay degrades how software is developed". The FCA's equivalent heading names the thing counted: "Major changes were twice as likely to result in an incident".

### Statement of recommendations

The essay:

> Rollback should become a rehearsed, pre-authorised operation that the on-call engineer can execute without seeking approval.
>
> The business should therefore treat rollback as an ordinary operation.

PRA:

> Senior management are expected to take responsibility for delivering the policy outcomes. Firms are expected to have a prioritised plan which sets out how they will comply… within a reasonable time, and no later than Monday 31 March 2025.

Larson:

> Write a design document and shop it with the teams that you believe will have the hardest time migrating. Iterate.

Atlassian:

> We will release public communications on incidents within hours.

The difference. The essay uses "should" 32 times and "the business" 17 times. Nearly every recommendation is "X should be Y" or "The business should Z": no owner, no date, no measure of done. The exemplars pick a grammatical mood and hold it: the imperative (Larson), the dated expectation with a named owner (PRA), or the commitment (Atlassian). Recommendation 10 is the exception and shows the essay can do it: one service, one client, two quarters, stop conditions agreed in advance.

### Use of numbers

The essay, Finding 5:

> Of all changes, 1.6% failed. Of the changes that firms classed as major, which received additional oversight, 3.8% failed. Change advisory boards approved more than 90% of the major changes put before them, and at some firms rejected none during the year…

The FCA, on the same data:

> In total, the sampled firms deployed nearly 68,000 major changes over 2019, which resulted in 2,600 incidents. This is an average failure rate of 3.8%, compared to 1.6% from all change types.

SRE:

> If a problem causes us to fail 0.0002% of the expected queries for the quarter, the problem spends 20% of the service's quarterly error budget.

The difference. The essay puts six of the FCA's figures into one paragraph and then repeats them in a figure. It drops the denominators that make them credible, and it does not say which one figure the reader should remember. The exemplars give one number a paragraph, with its base, and then say what it means. The essay's most persuasive number is the one it worked out itself (five days); it has no second number of that kind. The six baseline questions in Recommendation 1 are the place its own numbers would come from, and they appear only as questions.

### Use of quotation

The essay:

> Google's reliability handbook states the constraint exactly: "If you release daily, you can't let your canary last for a week while running only one canary deployment at a time."
>
> Looking back over six, Harry wrote: "If we'd tried to do it all at once. I'm sure we would have failed."

The FCA paraphrases its sources:

> Workshop attendees attributed this to their complexity, and the inability to break them down into smaller components.

The difference. The essay has about fourteen direct quotations. Several are there so that an authority can say what the assessor ought to say in his own voice (the Google line; the Harry line that closes the document). The exemplars quote when the words themselves are the evidence, and otherwise paraphrase with attribution. By that test the essay should keep perhaps four: the FCA's "raises questions over the effectiveness of CABs as an assurance mechanism", the RBS "had only tested the consequences of backing out Version 2 to Version 1", Netflix's "devolving into verifying endurance", and Starling's "our auditors loved this one". An expert who ends his assessment in someone else's words has handed over the conclusion.

### Handling of caveats

The essay:

> These are associations, and they should be read with care. … The central finding stands nonetheless: a regulator examining regulated firms found failure concentrated in large changes and found no sign that heavyweight approval offset it.

The FCA:

> However, due to the sample size no firm conclusion could be identified as to the impact a DevOps methodology has on change success.

Stripe:

> Two nodes became stalled for yet-to-be-determined reasons.

McKinley:

> Clearly this model is approximate, but I think it helps.

The difference. The essay is honest about its limits, and Finding 6 ("I have found no bank or payments firm that has published its incident record from before and after it left release trains") is as good as anything in the exemplars. The fault is placement and manner. Caveats are collected into their own paragraph or their own finding, introduced by an instruction on how to read ("should be read with care"), and then overridden ("stands nonetheless", "not a reason to stay where it is"). The exemplars put the limit in the same sentence as the claim, state it as a fact about the evidence, and move on without a rebuttal. The essay also lacks a fixed vocabulary of confidence. It uses "finds", "indicates", "establishes", "shows" and "suggests" without a visible rule, where the FCA's "found", "observed a link" and "may indicate" are three distinct grades.

### Paragraph construction

The essay, Finding 2, second paragraph, in outline:

> Firms that have measured these effects report them plainly. [Amazon, one sentence.] [LinkedIn, one sentence.] [Facebook, one sentence.] A schedule that penalises missing the train puts on board the changes that should have missed it.

SRE, in outline:

> [Claim.] [Mechanism.] For example, imagine that a service's SLO is to successfully serve 99.999% of all queries per quarter. This means that the service's error budget is a failure rate of 0.001% for a given quarter. [Consequence in numbers.]

The difference. The essay has one paragraph template and uses it throughout: topic sentence, two to four cases from other firms each with a citation, closing epigram. The template recurs in Findings 2 and 5 and Recommendations 3, 5, 6, 8 and 10. The closing epigrams are the most recognisable habit in the document:

- "A schedule that penalises missing the train puts on board the changes that should have missed it."
- "These are real classes of fault, and shortening the soak means ceasing to look for them."
- "Surviving the week had become a substitute for evidence."
- "That is a reason to proceed by measured stages, as recommended below, and not a reason to stay where it is."
- "Time in production proved nothing about a path that was never exercised, and a soak would have proved as little."
- "None of them asks for three days."
- "The practice depends on leadership that holds its course after a failure."

Each is a good sentence. Seven of them in one document is a signature, and it is the signature the commissioner has already called machine-made. The professional exemplars end paragraphs on a fact, a number or a consequence. Fowler and McKinley each allow themselves one aphorism, and it is the thesis.

The same applies to the corrective pair ("X, not Y"): "The promotion period is not idle time to be trimmed", "the client and not a random share of traffic", "Approval should be relocated, not removed", "and never a fresh build from older source". The FCA review, the PRA statement and the Stripe report use it rarely.

### Sentence variety

The essay:

> Because they are the same event, the long hold has to be applied to the whole release, everything in the release waits for it, and everything written in the meantime queues behind it.

Larson:

> Start by stopping the bleeding, which is ensuring that all newly written code uses the new approach. … This is always the first step, because it turns time into your friend. Instead of falling behind by default, you're now making progress by default.

Fowler:

> It did hurt, so you did it more often, and now it no longer hurts.

The difference. The essay varies length less than it appears to; what it lacks is variety of kind. It has no questions, no imperatives outside the title, one list, and no sentence that addresses the reader. Its long sentences are often three parallel clauses joined by commas (as above), a rhythm that recurs in the Summary ("it imposes…, it forces…, and it cannot…"). The practitioner exemplars mix the instruction, the reason and the short consequence.

### Vocabulary

The essay:

> Flags are cheap to add and expensive to keep.
>
> …sessions that fail only after hours of idleness, memory and file handles that creep, queues that deepen, the roll of the business date…

AWS:

> It's slow burning. That is, it doesn't show up immediately during the deployment, especially if the service is under low load at the time.

The difference. The essay's nouns are often excellent; the second passage above is as concrete as Liguori. Its weakness is the connective tissue, which has drifted toward a formal register that none of the practitioner exemplars use: "therefore" (six times), "so that" (six), "whereas", "accordingly", "nonetheless", "thereafter", "ceasing to", "the occasions on which". This is where "professional" has been reached for through diction. The second weakness is the addressee. "The business" is an abstraction that cannot own a pager; the exemplars write to "you" (Larson, McKinley, Fowler), about "firms" (FCA, PRA), or as "we" (SRE, AWS, Stripe).

### Ending

The essay:

> The business should take that as the planning assumption: a sequence of bounded steps, each measured against the baseline, with the release train kept running until the evidence from its own systems justifies retiring it.

SRE closes with three "Key Insights", the last of which is:

> An error budget aligns incentives and emphasizes joint ownership between SRE and product development.

PRA:

> For a firm's plan to be effective, firms must have started putting the plan into effect by Thursday 31 March 2022.

Stripe:

> We have already conducted the first of a series of thorough reviews to identify improvements to our systems and practices.

The difference. The essay stops at the end of Recommendation 10; it has no close. Its last sentence is sound in content and arrives directly after a borrowed quotation, inside a paragraph about Microsoft. The reader is not told what decision is being asked of them now, what it costs, or when the assessor expects the first evidence. The exemplars end on what happens next and who does it.

## 3. The registers

### (a) Regulator and audit-report prose

Institutional "we". Method before findings. Findings as full-sentence headings. Every figure with its base. A fixed scale of confidence verbs. Modal verbs with assigned meanings. Dated, owned expectations. Almost no figurative language and no outside quotation. Its authority is access: the regulator saw data nobody else has.

### (b) Strategy-consultancy deliverable prose

Answer first. A quantified prize in the opening lines. Action titles. Three or four "levers". Anonymous client vignettes. Benchmarks against "top-quartile" peers. A closing call to begin now. Its authority is the firm's name and the breadth of its sample. At its best it is the clearest of the four on what to do; at its usual standard it is abstract and unfalsifiable.

### (c) Practitioner-expert essay prose

First person, singular or plural, held throughout. The mechanism explained before any case is cited. One worked example carried through. The author's own arithmetic. Trade-offs stated with a cost on each side. Advice as instructions, in order. Costs and exceptions conceded in passing. One memorable formulation at most. Its authority is that the reader can check the reasoning.

### (d) High-end journalistic briefing prose

A scene or a surprising fact to open. One protagonist case followed at length. Short sentences among long ones. The author's doubt voiced before the reader's. The turn at the end of a paragraph. Its authority is narrative and the quality of the reporting.

### Where the essay is, and where it should be

The essay is a hybrid. Its skeleton is (a): summary, numbered findings with sentence headings, numbered recommendations, a limits section. Its paragraph endings are (d): the turn, the epigram. Its evidence is a literature review, which belongs to none of the four. Its voice is the impersonal "the business should" of a regulator, without the regulator's access to data.

That last point is the structural problem. Register (a) draws its authority from having examined the subject, and the essay says in its fourth paragraph that it has not: "It has not drawn on the business's own change and incident data." An audit voice with no audit behind it reads as borrowed.

For engineering directors receiving an expert's assessment, the essay should keep the skeleton of (a) and write its paragraphs in (c). The authority available to this author, on the facts in the document, is of the practitioner kind: the arithmetic of the schedule, the mechanism by which coupling deployment to release forces batching, the worked payment-routing example, and a candid account of what the published record does and does not show. The defining habits to adopt:

- Speak as "I" throughout, and to "you".
- Derive each finding from the reader's own model first; bring in an outside case only to size or confirm it, in a clause.
- Do the sums in front of the reader.
- State each trade with its cost: what gets slower, what it takes, what stays as it is.
- Write recommendations as instructions with an owner and a test of done.
- Grade every claim with one of three verbs and use them consistently.
- End paragraphs on the fact.

It should borrow two things from (b): the answer and the size of the prize in the first lines, and a one-page table of recommendations. It should borrow nothing from (d) except the single sustained example, which it already has.

## 4. The professional moves the essay lacks, ranked by impact

1. Reason from the reader's system and subordinate the cases. The essay cites more than fifteen organisations. The SRE chapter cites none and is more persuasive, because every step can be checked. Each finding should stand on the mechanics of a twice-weekly train with a three-day hold. Outside evidence then enters in a subordinate clause, and only where it sizes an effect ("at Amazon the waiting was 14 of 16 days") or removes an objection (the FCA data). Findings 2 and 5 and Recommendations 6 and 10 are the places to cut.

2. Put the answer, the prize and the ask in the first paragraph. The Summary should say in its opening lines what to do, what the reader gets in the essay's own figures (in production within a day; one day of changes per build against half a week's; ordinary changes no longer queue behind risky ones), what gets worse (a risky change reaches its last client later, "perhaps by several weeks"), and what is being asked for now (the baseline and one pilot).

3. Adopt a calibrated vocabulary of confidence and attach it to each claim. Three grades are enough: "I found" or "the schedule shows" for what follows from the facts given; "I judge" for inference from the published record; "I could not establish" for what needs the business's own data. Each finding should end with its "could not establish" line, pointing to the baseline question that would settle it. That removes the separate Finding 6 and the "nonetheless" paragraphs.

4. Turn recommendations into instructions with an owner, a measure and an order. "Rollback should become a rehearsed, pre-authorised operation" becomes an instruction to a role, with a test of done. Add a single table: recommendation, who acts, what shows it is done, what it depends on. Recommendation 10 already has this shape; the other nine do not.

5. Remove the paragraph-closing epigrams and the "X, not Y" pairs. Keep one formulation for the whole document. The title already is that formulation. Every other paragraph should end on its last fact.

6. Build the argument on the one worked example. The payment-routing change (rail A to rail B) in Recommendation 3 is the strongest passage in the document and the only place where the assessor's own expertise is on show. It is introduced two-thirds of the way through with "Suppose". It should appear in the Summary, set the terms of the Findings (what happens to this change today), and return in each recommendation, as Pronovost's checklist does in Gawande and the error budget does in the SRE chapter. A two-column table of the same change under each model would do the work of several case paragraphs.

7. Hold one voice and one addressee. "I" appears five times in a document otherwise written in the impersonal. Choose "I" and "you", as Larson, McKinley and Liguori do, and drop "the business" and "this assessment finds".

8. State the cost with the same precision as the benefit. The essay does concede costs ("This is more work per change than a train requires"; OANDA's 15% of engineers on tooling; "more than two years"), and they are spread across Recommendations 6, 7 and 10. Liguori states the cost in the same sentence as each safeguard. A short section on what this will cost and what will get slower, before the recommendations, would do more for credibility than any further case.

9. Dismiss the weak alternatives in one place. The essay disposes of "run the train daily" well in Finding 3. It never names the other alternatives a director will raise: shorten the soak, add more approval. A short passage on options considered and rejected, each with its one-sentence reason from the essay's own facts, is standard in the regulator and practitioner exemplars alike.

10. Give numbers their bases and one number per point. Where the FCA data stays, use the FCA's own form (68,000 major changes, 2,600 incidents, 3.8% against 1.6%) and choose the one figure that matters to the argument.

11. Close on commitment. End with what happens in the first quarter, what the pilot must show for the programme to continue, and what result would cause the assessor to withdraw the recommendation. The essay already contains the last of these ("If the soak proves to be catching faults that nothing else would… the gain will be smaller than this assessment expects"); it is buried at the end of Recommendation 1.

12. Break the long sentences that carry a case and a citation, and use a list where the content is a list. The six questions are the only list; the ladder in Recommendation 3, the flag-governance fields in Recommendation 6 and the exceptions in Recommendation 9 are lists written as prose.

## 5. Demonstration

The rewrite below uses only facts present in `essay.md`. It addresses the reader as "you"; if the commissioner prefers the third person, "the firm" can be substituted without other change.

### Summary

A finished change takes about five days to reach your clients, and seven at worst. A little under two of those days are the wait for the next train. Three are promotion and soak. Every change pays the same: a corrected label waits as long as a change to the routing of outbound payments.

I do not recommend shortening the three days. They find faults that no short test reaches, and within the present model any time taken out of them is protection given up. The cost comes from somewhere else. The model treats deploying code and releasing behaviour as one event, so the caution that a risky change needs is paid by every change that travels with it.

I recommend that you separate the two:

- Deploy a build every day, with new behaviour switched off behind flags.
- Soak that build on a small slice of production, through one daily peak and one batch window, before promoting it further.
- Release each material change on its own: in shadow first, then with real money at a synthetic client, then to one client that has agreed to go first, then more widely.
- Make rollback a rehearsed operation that the on-call engineer may carry out without asking.

On that design a build is in production within a day of being cut and carries one day of changes where a train carries half a week's. A risky change will reach its last client later than it does today, perhaps by several weeks. The ordinary changes that now queue behind it will stop waiting. Some changes should stay on the train: ledger schema changes, new settlement files, and scheme mandates.

My confidence differs by claim, and I mark it throughout.

- The five days follow from your schedule. I am certain of them.
- I judge that stability would not suffer. The best evidence is the Financial Conduct Authority's review of more than a million production changes at 23 financial firms in 2019, which found that firms deploying smaller, more frequent releases had higher change success rates. That is an association. No bank or payments firm has published its incident record from before and after leaving release trains, and I found no account of a firm with a mainframe core doing so for its money-moving systems.
- I could not establish what your own figures would be. I have not seen your change and incident data.

For that reason the first recommendation is to answer six questions from your own records, and the last is a pilot: one service you own outright, one client, two quarters, run alongside the train, with the conditions for stopping agreed in advance. That is what I am asking you to approve now. It occupies a small team. The wider programme will take years.

### Finding 1. Every change waits about five days, whatever its risk

Trains leave twice a week, so a finished change waits a little under two days, on average, for the next one. Promotion and soak then take three days. The typical interval from finished to live is about five days. A change that has just missed a train waits seven. A fix completed on a Wednesday morning reaches clients the following week.

The schedule sets this interval, and nothing about the change can shorten it. A corrected label and a change to the routing of outbound payments board the same train and are held for the same three days.

I could not establish how much of the three days is work. Baseline question 1 asks for the split: the hours in which something is being done to the release, and the hours in which it is waiting for a window or a person.

### Finding 2. The wait makes changes later to prove, larger, and harder to trace

The five days cost more than five days. The schedule has three further effects, and each follows from its design.

- Proof arrives late. Production shows whether a change was right about five days after it was finished, and by then the engineer who wrote it has moved on to other work.
- Work is held back. A piece of work larger than a few days cannot join a train until it is complete, so it stays on a branch that diverges from everyone else's.
- Faults are harder to trace. Each train carries half a week of unrelated changes. When a release misbehaves, the first task is to find out which of them is responsible.

I have not measured these effects in your data. Baseline question 3 will size the third: how many changes were in the release behind each of your last five incidents, and how long it took to identify the one responsible.

Two published measurements show how large such effects can be. Before Amazon automated its release process, code took an average of 16 days to travel from check-in to production, and for almost 14 of them it was waiting for someone to start a build, perform a deployment or run a test. Your equivalent of that ratio is the answer to baseline question 1.

The second measurement concerns what a cut-off does to behaviour. LinkedIn's mobile team released monthly, and its engineers rushed work in ahead of the cut-off because missing it cost a month. Facebook found that code pushed on the day of a release cut was of lower quality than code pushed on other days. Missing one of your trains costs half a week where missing LinkedIn's cost a month, so I would expect the effect to be weaker here. I have no measurement of it either way.

### What I did

- Put the answer, the prize in the essay's own numbers, the cost, and the decision being asked for into the Summary, and turned the three "recommendations that matter most" into a list of instructions.
- Replaced "this assessment finds" and "the business" with "I" and "you", and graded each claim as certain, judged, or not established.
- Moved each limit to the claim it limits, and pointed it at the baseline question that would resolve it. Findings 1 and 2 now each end on what I could not establish.
- Stated each mechanism in Finding 2 as its own item with cause and consequence, and gave the heading the three effects in place of "degrades".
- Kept Amazon, LinkedIn and Facebook, and made each do a job: Amazon sizes the waiting, and the other two support one behavioural point, with a stated reason to expect it to be weaker here.
- Removed the closing epigram ("A schedule that penalises missing the train…") and the balanced verdict ("sound on safety and expensive on speed").
- Shortened the sentences that carried parallel clauses, and used lists where the content was a list.
- Added no fact. The one inference (that the cut-off effect should be weaker at half a week than at a month) is marked as my expectation.

## 6. Constructions and words to avoid

These come from the weaker exemplars: the two McKinsey articles, the Accenture report, the Brainard speech, and the framing paragraphs of the FCA review. They are what "sounding professional" turns into when it is done through diction.

### Inflated verbs and nouns

- "leverage", "leveraging" (FCA: "leveraging different business models"; McKinsey: "Leveraging productivity insights")
- "utilise" (FCA: "practices utilised within the industry")
- "unlock", "unleash", "drive", "enable", "empower" (Accenture: "unleash greater human potential"; McKinsey: "activities that truly drive value")
- "journey", "landscape", "ecosystem", "lens" (McKinsey: "requires different lenses"; "personalized learning journeys")
- "best-in-class", "top-quartile", "world-class", "robust", "holistic", "nuanced" (McKinsey: "a sufficiently nuanced system")
- "reinvent", "transform", "a new era" (Accenture: "a race toward a new era of value and capability")

### Importance asserted in place of a reason

- "it is critically important for firms to…" (FCA)
- "underscores the importance of", "highlights the need for" (Brainard; FCA)
- "more important than ever" (McKinsey)
- "warrant careful analysis", "presents an important opportunity to reflect" (Brainard)
- "truly", "critical", "key", "essential" as intensifiers (McKinsey: "To truly benefit from measuring productivity")

### Evidence without a base

- "one company found…", "Another company, after discovering…" (McKinsey's anonymous vignette)
- "up to 70 percent", "up to two times faster" (McKinsey: a ceiling presented as a result)
- "the initial results are promising" (McKinsey)
- "Case in point:" followed by a headline (Accenture)
- A correlation reported once as "correlate" and thereafter as cause (McKinsey: "the top contributor to business success")

### Agentless recommendation

- "A number of possible reforms have been suggested", "Some have suggested" (Brainard)
- "could consider", "could help", "can help" in sequence (Brainard; FCA)
- "organizations should aspire to" (McKinsey)

### Rhetorical packaging

- The call to begin: "there is no time like the present" (McKinsey)
- The closing question: "Will you be a role model or a cautionary tale?" (Accenture)
- The manufactured surprise: "Interestingly, these findings fly in the face of conventional industry wisdom" (McKinsey)
- The concession opener: "There is no denying that…" (McKinsey)
- The portentous opener: "This is a moment for reinvention." (Accenture)

### The essay's own versions of the same fault

The essay has avoided nearly all of the above, which is to its credit. Its risk lies in a different set of words, reached for to sound formal:

- Connectives: "therefore", "accordingly", "nonetheless", "thereafter", "whereas", "so that".
- Self-description: "This assessment finds", "The strongest evidence comes from", "The nearest thing to a controlled comparison is", "Two further cases complete the picture", "gives the most candid account", "The instructive detail is".
- Instructions on how to read: "they should be read with care", "The central finding stands nonetheless".
- The corrective pair: "relocated, not removed", "the client and not a random share of traffic".
- The closing epigram, listed in section 2.
- "The business should", as the default form of a recommendation.

None of these is wrong in a single use. Together they are the document's accent, and the practitioner exemplars do without them.
