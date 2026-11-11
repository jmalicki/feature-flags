# Google and Facebook: from test/QA gates to developer-owned quality plus ramped exposure (c. 2005-2019) — culture and management notes

Conventions used throughout:

- **Read status** says how I accessed each source:
  - *full text read* — I read the raw page or PDF text myself.
  - *tool-extracted* — a fetch tool summarised the page and returned the quotations; I did not eyeball the wording. Re-check these quotes against the page before printing them.
  - *snippet only* — search-result snippet.
- All quotations are under 25 words.
- "Pub." is the publication date. "Practice" is when the practice described began, where the source says.
- Mechanics (Gatekeeper internals, experiment layers, push tiers) are deliberately omitted because the existing dossier covers them.

## 1. Google: who owns quality, what happened to testers, and how the culture was changed (Whittaker 2011, Bland 2011/2014, Shamash 2016, SWE book 2020)

### Takeaway

Google's stated position by 2011 was that product teams and developers own quality, while a deliberately small, centrally reporting test organisation (Engineering Productivity) builds tooling and acts as a check. That culture was retrofitted from about 2005 by a volunteer group over roughly five years, without an executive mandate. Google kept staged channels, dogfood, release trains and human release authority; it did not abolish testers, it redefined them.

### Cited Findings

**S1. James Whittaker, "How Google Tests Software" parts 1-5, Google Testing Blog.** Pub. 25 Jan 2011 (part 1) and 16 Feb 2011 (part 3); parts 2, 4, 5 fall Feb-Mar 2011 by URL path, exact days not verified. *Full text read* (post bodies pulled from raw HTML). These posts are the precursor to the 2012 book.

- Organisation (part 1): there is no testing org inside product teams. Test sits in a "Focus Area" called Engineering Productivity, and testers are embedded engineers "effectively loaned out" to product teams. They report to Eng Prod managers but sit with the product team and share its ship bonuses. — [Part 1](https://testing.googleblog.com/2011/01/how-google-tests-software.html)
- Ownership (part 1). Quote: "at Google it's the product teams that own quality, not testers. Every developer is expected to do their own testing." Whittaker's stated reason is that testers are an external resource, so product teams "must keep their quality house in order". — [Part 1](https://testing.googleblog.com/2011/01/how-google-tests-software.html)
- Ratio as a signal (part 1): developers outnumber testers. Quote: "Product teams should be proud of a high ratio!" — [Part 1](https://testing.googleblog.com/2011/01/how-google-tests-software.html)
- Roles (part 2): — [Part 2](https://testing.googleblog.com/2011/02/how-google-tests-software-part-two.html)
  - SWE: writes feature code and much of the test code. Quote: "SWEs own quality for everything they touch whether they wrote it, fixed it or modified it."
  - SET: a developer role focused on testability, frameworks and submit queues.
  - TE: user-focused; organises testing by contract testers, crowd testers, "dog fooders" and beta users. Quote: "TEs act as a double-check on the diligence of the developers."
  - The post opens with the motto "you build it, you break it".
- Large test teams as a smell (part 3). Quote: "teams that insist on having a large testing presence are generally assumed to be doing something wrong." Also: "Quality is a development issue, not a testing issue." The mechanism he names is a "hyper incremental" process in which mistakes can be rolled back. — [Part 3](https://testing.googleblog.com/2011/02/how-google-tests-software-part-three.html)
- Social enforcement (part 3): code-review notes asking "where are your tests?" and Testing on the Toilet posters. — [Part 3](https://testing.googleblog.com/2011/02/how-google-tests-software-part-three.html)
- Release channels (part 4, "Crawl, walk, run"), using Chrome as the example: — [Part 4](https://testing.googleblog.com/2011/03/how-google-tests-software-part-four.html)
  - Canary: code suspected unfit for release.
  - Dev: "All engineers on a product are expected to pick this build and use it for real work".
  - Test: internal dogfood.
  - Beta/Release: first external exposure.
  - He links few testers to small increments: Google "rarely attempt[s] to ship a large set of features at once". Gmail kept its beta tag four years, until 99.99% uptime.
- Retained manual testing (part 5): "Google performs a great deal of manual testing, both scripted and exploratory", reserved for things that need human judgment (UI, privacy). — [Part 5](https://testing.googleblog.com/2011/03/how-google-tests-software-part-five.html)
- Limits: one director's descriptive and aspirational account ("what we are doing today and the direction we are trending"). Chrome-centric, no outcome data, and does not date when the model began. I did not read the 2012 book (Whittaker, Arnon, Carollo, Addison-Wesley); book page locators are a gap.

**S2. Ari Shamash, "From QA to Engineering Productivity", Google Testing Blog.** Pub. March 2016 by URL path; exact day not verified. *Full text read.*

- Management retrospective: as Google grew, "longer and longer manual test cycles bogged down iterations and delayed feature launches", so testing was pushed upstream through automation. — [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- Manual work shrank to verifying new features at cross-product integration boundaries. — [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- Once test cycle time fell, "overall velocity did not increase proportionately" because other phases became the bottleneck. SETs moved on to release verification, production log and anomaly detection, and productivity measurement. — [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- The SET title was renamed Software Engineer, Tools & Infrastructure (SETI), chosen by 91% of SETs. TEs remained. — [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- Limits: a recruiting-flavoured blog post with no dates for the transitions and no headcounts. It does not say testers were laid off.

**S3. Mike Bland, "Testing Grouplet" (pub. 27 Sep 2011) and "Test Certified" (pub. 18 Oct 2011), mike-bland.com.** *Tool-extracted.* First-person retrospectives by a former Grouplet co-lead, written after he left Google.

- The Grouplet began around April 2005, led by Bharat Mediratta and Nick Lesiecki, as volunteers on 20% time. Extracted quotes: "We had no authority, very little budget"; "top-down mandates do not work"; "without explicit executive support". — [Bland, Testing Grouplet](https://mike-bland.com/2011/09/27/testing-grouplet.html)
- Fixit dates: Testing Fixits on 3 Aug 2006 and 8 Mar 2007; Revolution Fixit 31 Jan 2008; TAP Fixit 6 Mar 2010. — [Bland, Testing Grouplet](https://mike-bland.com/2011/09/27/testing-grouplet.html)
- Test Certified was conceived by Mediratta and Lesiecki. It originally had three levels (measurement tooling, then a written test policy, then high coverage), with levels four and five added later. — [Bland, Test Certified](https://mike-bland.com/2011/10/18/test-certified.html)
- Extracted quote: culture change was achieved "without help (or, thankfully, interference or deterrence) from on high". Executives offered occasional praise only. — [Bland, Test Certified](https://mike-bland.com/2011/10/18/test-certified.html)

**S4. Mike Bland, "Goto Fail, Heartbleed, and Unit Testing Culture", martinfowler.com.** Pub. 3 June 2014. Sections "Google's Retrofitted Testing Culture", "Resistance", "Test Certified", "Test Mercenaries", "Noogler Indoctrination". *Full text read* for those sections.

- When Bland joined in 2005, "the development culture was largely averse to unit testing". The objections he heard were "My code is too hard to test" and "I don't have time to test". — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- He rejects the "Google is special" excuse. Quote: "vast pools of resources and talent can get in the way". — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Test Mercenaries were full-time developers lent to teams, ideally two for three months, from late 2006 to early 2009. Results were "varied and difficult to measure". — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Management did get involved in one respect: the Engineering Productivity department "threw its weight behind the program". The goal was "effectively met with the rollout of the Test Automation Platform ... in 2010", after which nearly every team operated at Test Certified Level Three. — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Onboarding: with EngEDU, the Grouplet gave every new developer a one-hour unit-testing lecture plus a proctored lab. New hires (the "Noogler Army") were recruited to post Testing on the Toilet episodes. — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Participating teams "often credited" Test Certified with better ratios of changes shipped to bugs, rollbacks and emergency releases. This is self-reported, with no figures given. — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Limits: memory-based ("Some of this information may be out of date"). It covers unit-testing culture, not flags or canaries.

**S5. Winters, Manshreck, Wright (eds.), "Software Engineering at Google", O'Reilly 2020, ch. 11 "Testing Overview".** Free at abseil.io. *Tool-extracted.* A later retrospective covering practice from 2005 onwards.

- Google Web Server story: around 2005, quote, "more than 80% of production pushes contained user-affecting bugs that had to be rolled back". The tech lead mandated engineer-written automated tests, and emergency pushes fell by half within a year. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- From 2005, new-hire orientation included an hour on automated testing. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- Test Certified had five levels and was replaced by an automated approach in 2015, after helping more than 1,500 projects. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- The first Testing on the Toilet episode appeared in April 2006. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- Beyoncé rule: test everything you don't want to break. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- The chapter concedes limits. Extracted quote: "Automated testing is not suitable for all testing tasks" (search quality, audio/video quality, exploratory testing). — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html)
- Source conflict: the book says five levels; Bland says three originally, later five. These are reconcilable, but the book omits the evolution.

**S6. Same book, ch. 24 "Continuous Delivery"** (Radha Narayan, Bobbi Jones, Sheri Shipe, David Owens; ed. Lisa Carey). *Tool-extracted.*

- Conclusion, extracted quote: "we've found that, counterintuitively, faster is safer." — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- Extracted quote: "make sure engineers 'flag guard' all changes." The chapter adds that flag flips should themselves be rolled out gradually and that flags are not a perfect safeguard for sensitive features. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- Release creation and user receipt are separate decisions. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- Release-train discipline is retained, not abandoned. Extracted quote: "if you're late for the release train, it will leave without you." Search moved from weekly, sometimes missed, releases to one every other day. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- "No binary is perfect": launch trade-offs (the example is a bug affecting one Philippine island's dialect) are decided by leadership or release managers against KPI thresholds, not by the feature's engineers. Extracted quote: "One release responsibility is to protect the product from the developers." — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- YouTube anecdote: a Python monolith with "a 50-hour manual regression testing cycle run by a remote QA team on every release", cited as what not to perpetuate. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html)
- Limits: no dates for most anecdotes; "faster is safer" is asserted without data; the chapter is mobile-app-heavy.

### Inferences

- Google did not delete the tester role. It made testers scarce, moved them out of the product reporting line, and turned them into tool-builders and a late "double-check". Scarcity was the forcing function: if you cannot bank on testers, you keep your own house in order.
- The change took about five years (2005-2010) and was finished by tooling (TAP), not by policy. Persuasion, onboarding and visible metrics came first; management's contribution was funding Eng Prod and the Mercenaries, not a mandate.
- For a finance audience: Google's model still has release trains and an accountable human release authority. What changed is that the train never waits for a feature, because features are dark behind flags, and that quality evidence comes from staged real usage instead of a pre-release sign-off by a separate group.

### Gaps

- "How Google Tests Software" (2012 book) was not read; only the 2011 blog series by its lead author. No page citations.
- No verified figures for Google's tester-to-developer ratio over time.
- I did not locate a primary source for the claim that leadership debated cutting test roles around 2011. Alberto Savoia's "Test is Dead" GTAC 2011 keynote is a video I did not watch.
- SWE book quotes are tool-extracted and should be verified against the page before use.

## 2. Google SRE: error budgets as the management device that reframes the release-pace argument

### Takeaway

SRE replaced "ops gates versus dev velocity" with a single pre-agreed number. Product management sets the SLO, the shortfall from 100% is a budget that development may spend on launches and risk, and the question "how much testing or canary is enough?" is settled by the remaining budget, not by negotiation. It works only where SRE (ultimately executives) actually has authority to halt releases.

### Cited Findings

**S7. Betsy Beyer et al. (eds.), "Site Reliability Engineering", O'Reilly 2016, ch. 1 "Introduction" (Benjamin Treynor Sloss).** *Tool-extracted.*

- The traditional split puts teams' goals "fundamentally in tension", and ops responds with "launch and change gates". — [SRE book ch. 1](https://sre.google/sre-book/introduction/)
- Extracted quote: "100% is the wrong reliability target for basically everything." — [SRE book ch. 1](https://sre.google/sre-book/introduction/)
- The availability target is a business or product decision; the budget is one minus that target. — [SRE book ch. 1](https://sre.google/sre-book/introduction/)
- A 50% cap on SRE operational work, with excess redirected back to the development team, is the accountability lever on developers. — [SRE book ch. 1](https://sre.google/sre-book/introduction/)

**S8. Same book, ch. 3 "Embracing Risk"** (Marc Alvidrez; "Motivation for Error Budgets" by Mark Roth). *Tool-extracted.*

- The chapter lists the recurring arguments an error budget is meant to settle: software fault tolerance, how much testing, push frequency, and canary duration and size. Extracted quote: "How long do we wait, and how big is the canary?" — [SRE book ch. 3](https://sre.google/sre-book/embracing-risk/)
- On testing: too little brings outages, too much loses the market. No fixed answer is given. — [SRE book ch. 3](https://sre.google/sre-book/embracing-risk/)
- Extracted quote: "This metric removes the politics from negotiations between the SREs and the product developers". — [SRE book ch. 3](https://sre.google/sre-book/embracing-risk/)
- If the budget is spent, "releases are temporarily halted". The chapter claims product teams then self-police and ask for more testing or slower pushes themselves. — [SRE book ch. 3](https://sre.google/sre-book/embracing-risk/)
- Dependency stated: the outcome relies on SRE "having the authority to actually stop launches". — [SRE book ch. 3](https://sre.google/sre-book/embracing-risk/)

**S9. "The Site Reliability Workbook", O'Reilly 2018.** *Tool-extracted.*

- Ch. 16 "Canarying Releases" (Alec Warner, Štěpán Davidovič, et al.): — [Workbook ch. 16](https://sre.google/workbook/canarying-releases/)
  - Extracted quote: "Some defects will reach production." Test environments differ from production.
  - A canary is "a partial and time-limited deployment of a change in a service and its evaluation".
  - A canary's cost to the budget is proportional to the traffic exposed.
  - Flag and experiment frameworks "separate feature launches from binary releases".
- Appendix B, "Example Error Budget Policy" (Steven Thurgood, dated 2018-02-19): — [Workbook App. B](https://sre.google/workbook/error-budget-policy/)
  - On exceeding the four-week budget, "we will halt all changes and releases" except P0 and security fixes.
  - Disputes are "escalated to the CTO".
  - The stated goal is not punishment.
- Limits: it is an example policy, not evidence of what any Google team enforced.

**S10. SRE book ch. 27 "Reliable Product Launches at Scale"** (Singh, Kirsch, Rau). *Tool-extracted.* Culture points only.

- Adding a launch-checklist question once "required approval from a vice president". — [SRE book ch. 27](https://sre.google/sre-book/reliable-product-launches/)
- The authors concede that "engineers are likely to sidestep processes that they consider too burdensome". — [SRE book ch. 27](https://sre.google/sre-book/reliable-product-launches/)
- By 2009, launching a small service had become notoriously hard despite efforts to limit review bureaucracy. — [SRE book ch. 27](https://sre.google/sre-book/reliable-product-launches/)

### Inferences

- An error budget is a pre-negotiated risk limit that the business sets and engineering spends, which makes it the closest Google analogue to a finance desk's risk limit. This framing may land better with finance engineers than "move fast".
- The books do not claim testing is unnecessary. They claim the amount of testing and canary time should be an output of the budget, and that a gate with no measured budget behind it is politics.

### Gaps

- No published data on how often Google teams actually froze releases on budget exhaustion.
- The books are prescriptive and written by SRE; the developer-side view of budget freezes is not represented.

## 3. Facebook: no separate QA, personal responsibility, bootcamp, push karma, on-call for your own push, employee dogfooding

### Takeaway

Facebook's own engineers describe an explicit decision not to have a QA or test organisation. Its substitutes were author accountability (code review, mandatory presence during the push, a private reputation score reported to managers), employees as the first production tier, onboarding that puts new hires' code in production within days, and flag-based reversibility. A small central release-engineering team retained real authority to refuse or revert changes.

### Cited Findings

**S11. Feitelson, Frachtenberg, Beck, "Development and Deployment at Facebook", IEEE Internet Computing 17(4):8-17, July-Aug 2013.** *Full text read* in the author preprint copy on a TAMU course site. Preprint pagination differs from the journal; locators below are section names.

- Intro. Quote: "a culture of personal responsibility, where every engineer is responsible for code they write". The culture treats failure as a chance to improve, not to blame. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- §5 "Personal Responsibility": roughly 1,000 development engineers and three release engineers. Quote: "it doesn't have a separate quality assurance (QA) team or any other designated testers." The stated reasons against QA are throwing code "over the wall", testers needing to learn the code, and a perceived dev-over-test hierarchy. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- §4 "Pushing New Features": — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
  - "All engineers who contributed code must be available online during the push", checked by IRC bots; an absent engineer's commit is reverted. On-call headcount therefore scales with change count.
  - Push karma: release engineers track how often an engineer's code caused problems, and bad karma means more oversight. Quote: "the goal is to manage risk, not to rank performance, and push karma is not made public."
  - Change size and the amount of review discussion also raise scrutiny.
- §4, dogfooding: the "latest" build is the default for employees, and "all employees double as testers", so tester count grows automatically with the company. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- §3, bootcamp: six weeks; new hires are pushed to commit early "partly to overcome the fear of releasing new code". — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- §3, oversight retained: because of personal data, Facebook does not let every engineer deploy at will; "the risk of privacy breaches warrants more oversight". Privacy code is held to a higher standard. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- Summary. Quote: "Personal responsibility by the engineers who wrote the code can replace quality assurances obtained by a separate testing organization." — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- Limits: web front end only, a 2012-13 snapshot, two Facebook-employed authors, and no failure-rate data.

**S12. "Release engineering and push karma: Chuck Rossi", Facebook Engineering Q&A.** Pub. 5 Apr 2012. *Tool-extracted.*

- Extracted quotes: "Everyone is born with 4 stars, and you can only go down from there"; "People with low push karma have a higher bar to get into the daily push." — [Rossi 2012](https://engineering.fb.com/2012/04/05/production-engineering/release-engineering-and-push-karma-chuck-rossi/)
- Rossi personally taught onboarding classes for new engineers and called them critical. — [Rossi 2012](https://engineering.fb.com/2012/04/05/production-engineering/release-engineering-and-push-karma-chuck-rossi/)

**S13. Chuck Rossi interview, Software Engineering Daily, "Facebook Release Engineering" (SEDFB 14).** Pub. 27 Aug 2019. *Full text read* of the relevant passages of the publisher's PDF transcript (third-party transcription). A retrospective on 2008-2018.

- Manual test gates. Quote: "If your release process depends on a manual step before you release ... your release process is fundamentally broken". He calls this "a big fight at Facebook". — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- A nuance on "no QA": "we had some contractors and some specialty QA people", used for new products or hardware such as Oculus. That testing ran asynchronously and never blocked a release. — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- Push karma in detail: — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
  - A cherry-pick was taken only if the author answered on IRC.
  - The penalty was for being absent when your change broke, not for the breakage. Half a star was lost per incident.
  - The note went to the developer, the developer's manager and the performance-review tool.
  - He calls it "a private shaming", says "no one ever got fired", and says nobody could see anyone else's rating.
  - It was later largely replaced by an automated diff-risk score once deployment became continuous.
- Release authority: Rossi "would make the final call" on cherry-picks, with 200-400 a day at one stage. — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- A leadership decision against the "slow down" instinct: at 1,000-1,200 diffs a day, "we're going to go faster". The move to quasi-continuous web deployment was announced April 2016 and reached 100% in April 2017. He says the announcement acted as a forcing function that exposed every slow subsystem. — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- An early incident in which a change defeated all Gatekeeper checks led to a weekly SEV review with department heads. Quote: "The main thing is don't assign blame." — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- Limits: oral recollection with few dates, and the transcript contains transcription errors (e.g. "Fabricator" for Phabricator).

**S14. Kent Beck interview, Software Engineering Daily, "Facebook Process" (SEDFB 15).** Pub. Aug 2019 (exact day not verified). *Full text read* of the testing passage (about 0:32-0:39). Beck joined in 2011.

- Unit tests were often not worth their cost at Facebook because many problems "only show up in production", and other feedback loops existed (dev server, code review, internal site, staged rollout, logging). — [Beck 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB15-Facebook-Process-Kent-Beck.pdf)
- Failing or flaky tests were simply deleted if the site was up. — [Beck 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB15-Facebook-Process-Kent-Beck.pdf)
- Bootcamp norm. Quote: "In boot camp, you're supposed to put code into production the first week." Beck took three weeks and "got in a fair amount of heat". — [Beck 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB15-Facebook-Process-Kent-Beck.pdf)
- Flags were enforced by peers in review. Quote: "there's a bunch of stuff you can't test for." Without a flag, the only recourse is a hotfix, which makes release engineering "grumpy". — [Beck 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB15-Facebook-Process-Kent-Beck.pdf)
- Elsewhere in the transcript: "nothing at Facebook is somebody else's responsibility". — [Beck 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB15-Facebook-Process-Kent-Beck.pdf)

**S15. Kent Beck, "Taming Complexity with Reversibility".** Originally a Facebook note, July 2015; I read the later repost on his newsletter, *full text read*.

- Lists reversibility mechanisms as culture: development servers, code review, internal usage, dynamic configuration, and frequent pushes. Internal usage means feedback "from thousands of employees", with rollback in an hour. Dynamic configuration means turning off a feature "in production in seconds" or dialling to 0.1%. — [Beck 2015](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility)
- The key caveat for finance. Quote: "Decisions affecting people's privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible." Such decisions "need to follow completely different workflows", with up-front evaluation. — [Beck 2015](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility)
- Mobile reversibility is slower: the cycle went from six weeks to four to (then) two. — [Beck 2015](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility)

**S16. Pedro Canahuati, "Notes from Production Engineering", SREcon15, March 2015.** *Abstract only*; the audio or video was not consulted.

- The abstract describes an ops team that went from "small, centralized, and sometimes marginalized" and overwhelmed to a decentralized engineering team, covering culture, hiring and prioritisation. — [USENIX SREcon15](https://www.usenix.org/conference/srecon15/program/presentation/canahuati)
- Limits: nothing in the abstract verifies specifics about developers owning on-call.

**S17. Evan Priestley, Quora answer on why Facebook has no QA.** Q&A-site answer by a former Facebook engineer. *Not read*; only secondary summaries surfaced in search.

- Secondary articles summarise it as "no dedicated QA roles; engineers test their own code; the product is not safety-critical". I could not verify the wording or date. Treat as unverified. — [search-surfaced secondary summary](https://www.testrail.com/blog/do-we-still-need-dedicated-testers/)

### Inferences

- Facebook replaced a role (tester) with obligations on the author — be present, be reachable, flag-guard, watch your metrics — plus a central team with veto power and a private reputation ledger that reached the manager and the performance-review system. This is accountability with teeth, not an absence of control.
- Push karma penalised abandonment, not failure. That distinction matters when proposing something similar in a blame-sensitive finance culture.
- Beck and Feitelson both carve out money, privacy and trust as needing more up-front oversight. Facebook's own practitioners therefore did not claim the web-feature workflow transfers unchanged to financial transactions.

### Gaps

- The 2011 "Push: Tech Talk" video was not watched; nothing is cited from it.
- The Priestley Quora text is unverified.
- The Canahuati talk content is unverified beyond the abstract; no primary text was found for how Production Engineering split on-call with developers.
- No primary figure for how many "specialty QA" contractors Facebook used, or when.
- A Simon Stewart interview ("Facebook's No-Testing-Department Approach") exists, but its URL now redirects and it could not be read.

## 4. Savor et al. (ICSE 2016): Facebook and OANDA — the financial-firm evidence

### Takeaway

This paper is the strongest single source for a finance audience. OANDA, an FX trading platform moving "many billions of dollars" a day with about 100 engineers, ran continuous deployment with no test team but a strong release-engineering team. The authors report that after a costly failure, management's reflex was to add approvals and a traditional test team, and that under business-background executives deployments dropped 23%.

### Cited Findings

**S18. Savor, Douglas, Gentili, Williams, Beck, Stumm, "Continuous Deployment at Facebook and OANDA", ICSE 2016 Companion, pp. 21-30, May 2016.** *Full text read* (author-hosted PDF). Data cover Facebook 2008-2014 and OANDA April 2010-June 2014.

- Definition (§1): the decision to deploy is "largely left up to the developers (without the use of separate testing teams)". — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- §4.2: "Neither Facebook nor OANDA had a test team, although both had release engineering teams." — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- Footnote 2 (§2.1): Etsy and Netflix have no release-engineering team, but the authors "have come to believe that having a separate team is valuable when reliable software is important". Release engineering re-verifies the developer's tests, assesses risk by complexity and developer history, may run extra tests on high-risk updates, and can reject updates. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- OANDA profile (§3.2): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - About 80 developers, all in Toronto.
  - Over 20,000 deployments recorded April 2010-June 2014.
  - The pre-production stage is a demo system trading virtual money, with real clients and a larger client base than the real-money system.
- Natural experiment (§5 "Desirability"): OANDA white-labelled the same software to large banks whose policies forbade continuous deployment. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - Bugs the banks deemed non-critical went unfixed "for many months", and new functionality arrived late.
  - Each bank deployment bundled thousands of changes, "which increased anxiety" and led to much more extensive testing.
  - Failures were harder to isolate, and developers fixed obsolete code "with a negative attitude".
  - This is qualitative; no numbers are given.
- Management regimes (§4.3, Fig. 3): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - Mgmt-A had an engineering background and supported continuous deployment.
  - Mgmt-B (from mid-2012) had a business background and leaned to traditional process; average deployments "dropped by 23%" with the team largely unchanged.
  - Mgmt-C (end of 2013) had a Silicon Valley background and was supportive.
- The failure (§5 "Need for objective retrospective"): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - After several successful years, "a major failure occurred that cost the company a significant amount of money within seconds".
  - Senior management's first reaction was more hierarchy, more approvals, and "a full-blown, separate and traditional testing team".
  - The postmortem found that failing unit tests had correctly flagged the bug but were ignored amid false positives.
  - Engineering persuaded management to refocus on automated testing and to require test output in the deployment decision.
  - The authors call the reflex "runaway process inflation" and say a continuous-deployment champion in senior management is critical "especially for non-technical management teams".
- On test teams (§5 "Absence of separate testing team"): the question is "controversial" and "still an active area of debate". The authors' view is that "A testing group dilutes this accountability" and lengthens time to resolution; they also state the counter-arguments (fresh eyes, specialisation). — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
- Onboarding and investment (§5): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - Both firms give 6-12 weeks of training.
  - New OANDA developers are "typically first assigned to the release engineering team for several months".
  - Tooling headcount is about 5% of engineers at Facebook and 15% at OANDA; the burden is heavier for small firms.
  - "OANDA spent 2 years perfecting continuous deployment for mission critical infrastructure".
- Management role (§5): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - Managers "influence rather than operate within a chain of command" and must be technically respected.
  - Management's job is to improve the developer's risk-reward trade-off through tooling and a no-blame culture.
  - Developers should not be penalised for reasonable, prudent risks.
- Stated downsides (§5): — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)
  - Sub-standard early releases.
  - Resource creep ("death by a thousand cuts").
  - Not-invented-here syndrome.
  - Variable quality between developers.
  - OANDA's database schema changes "were always ad hoc and full of fear".
  - Facebook's configuration changes were poorly vetted across groups.
  - Suitable developers and managers are harder to hire.

### Inferences

- The white-label comparison describes the reader's own situation: large batches produce anxiety, which produces more testing, slower isolation and stale fixes. It is the paper's best argument that soak plus batching is a cause of risk, not only a mitigation.
- The OANDA failure cuts both ways. A real-money loss happened under continuous deployment, and the root cause was ignored test signal, not missing soak. The fix kept automation in the decision path. An honest essay should present both halves.

### Gaps

- OANDA's loss amount, date and regulatory consequences are not given.
- The paper does not describe OANDA's flag or canary mechanics in detail, nor its regulatory change-control obligations.
- Authors are insiders (Savor and Beck at Facebook; Gentili at OANDA; Stumm had OANDA ties). No independent audit.

## 5. What each company explicitly retained

### Takeaway

Neither company removed pre-release controls. Both kept automated pre-submit and regression testing, mandatory code review, a release authority with veto power, staged exposure starting with employees, and slower or more supervised paths for risky, irreversible or client-installed software.

### Cited Findings

- Google kept release trains with hard deadlines, leadership-decided launch trade-offs, and a release function that protects the product from developers. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html) (tool-extracted)
- Google kept multi-channel soak for client software (canary, dev, test/dogfood, beta); a build reaches release only "after spending enough time in the prior channels". — [Whittaker part 4](https://testing.googleblog.com/2011/03/how-google-tests-software-part-four.html)
- Google kept Test Engineers and a "great deal" of manual and exploratory testing where human judgment is needed. — [Whittaker part 5](https://testing.googleblog.com/2011/03/how-google-tests-software-part-five.html); [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- Google kept launch checklists and Launch Coordination Engineers for reliability review, while admitting the bureaucracy cost. — [SRE book ch. 27](https://sre.google/sre-book/reliable-product-launches/) (tool-extracted)
- Google's flag changes are themselves supposed to be rolled out gradually. — [SWE book ch. 24](https://abseil.io/resources/swe-book/html/ch24.html) (tool-extracted)
- Facebook, as of 2013, kept a weekly release branch cut on Sunday with a Tuesday push (about two days of regression, performance testing and employee use), plus daily cherry-picks approved by release engineers. Code review was required on every line, and tens of thousands of regression tests ran. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- Facebook kept a stricter standard for privacy code and did not allow free-for-all deployment. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- Facebook treats decisions affecting privacy, trust, money and brand as irreversible, to be handled by a different, up-front workflow. — [Beck 2015](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility)
- Facebook mobile kept a periodic cut and soak: six weeks, then four, then two (2015), with one week later recommended by Rossi. — [Beck 2015](https://newsletter.kentbeck.com/p/taming-complexity-with-reversibility); [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf)
- The continuous-deployment process itself includes "staging/baking" and a beta or demo period "for a period of time" before production. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §2.1
- Both Facebook and OANDA kept a separate release-engineering team as a control point; OANDA's backend release process was "more sophisticated than Facebook's". — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf)

### Inferences

- The accurate framing for the essay is not "they deleted soak". They shrank the batch, moved the soak onto real but limited traffic (employees, a demo system, 1%), and made the wait proportional to risk instead of fixed by calendar.

### Gaps

- No source here quantifies how long Google's or Facebook's risky-infrastructure rollouts took in this period. The dossier's SOSP 2015 and SRE material may cover that.

## 6. Measured outcomes tied to the cultural changes, with stated limits

### Takeaway

Hard numbers are few and mostly self-reported. The best are Savor et al.'s Facebook series (critical incidents nearly flat while deployments grew) and the Google Web Server anecdote (emergency pushes halved). Every source disclaims causality.

### Cited Findings

- Facebook 2008-2014: — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §4
  - Developers grew about 20x and the code base about 50x; lines shipped per developer per week stayed roughly constant.
  - Critical and medium SEVs grew far more slowly than deployments. The paper lists three trendline slopes, 0.0004, 0.0013 and 0.0061, of which the smallest is the critical series; the sentence does not cleanly map the other two to named severities.
  - Low-priority issues grew linearly.
  - The release-engineering team did not grow with deployment count.
- Limits the authors state: — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §4, §6
  - Lines of code is a crude productivity metric.
  - "we do not claim that continuous deployment is necessarily a key contributor".
  - Two companies only; root causes are hypothesised.
  - OANDA's failure data was unavailable and inferred from a redeploy-within-48-hours heuristic.
- A counter-signal inside the same paper: January 2009-July 2010 saw a productivity surge with degraded quality (hotfixes as proxy), and the later quality push cost some productivity. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §4.2
- Given a free choice, Facebook developers shifted from the weekly push to the daily push over time. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §4.3
- OANDA: deployments fell 23% under the process-oriented management regime. This measures deploy count, not quality. — [Savor et al. 2016](https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf) §4.3
- Facebook 2013: about 1,000 engineers were supported by three release engineers. Fig. 3 plots weeks from hire to first commit for bootcampers, but I could not read the bar values from the extracted text, so no figure is cited. — [Feitelson et al. 2013](https://people.engr.tamu.edu/pcr/courses/csce431/fall19/reading/FacebookDevelopment.pdf)
- Google Web Server, about 2005-06: more than 80% of pushes had needed rollback; emergency pushes halved within a year of mandatory developer tests. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html) (tool-extracted; a single-team anecdote from a retrospective, with no dataset)
- Test Certified reached more than 1,500 projects by 2015. — [SWE book ch. 11](https://abseil.io/resources/swe-book/html/ch11.html) (tool-extracted)
- Bland reports nearly all teams at Level Three after TAP in 2010, with per-team productivity gains self-reported and Test Mercenary impact "difficult to measure". — [Bland 2014](https://martinfowler.com/articles/testing-culture.html)
- Google 2016: cutting test-cycle time did not raise overall velocity proportionately, because the bottleneck moved. — [Shamash 2016](https://testing.googleblog.com/2016/03/from-qa-to-engineering-productivity.html)
- Facebook web moved from weekly, to three times a day, to quasi-continuous "all without synchronous manual testing"; the continuous migration took one year (April 2016-April 2017). — [Rossi 2019 transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf) (oral recollection)

### Inferences

- The defensible claim is: "at two firms, incident counts did not rise with deployment frequency, and a forced return to big batches (the bank white-label) was worse on every qualitative dimension". The claim "continuous deployment improves quality" is not supported by these sources.
- Outcome evidence for Google's tester-light model specifically is anecdotal. The essay should lean on Savor et al. for numbers and on Google for the management design (error budgets, Eng Prod structure).

### Gaps

- No controlled or independent study in this set.
- No finance-sector outcome data beyond OANDA's deploy counts and the unquantified loss event.
- No Google-wide defect or rollback time series was found.
