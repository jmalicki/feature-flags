# Amazon, Netflix, LinkedIn, Etsy: from test gates, release trains and ops handoffs to developer-owned deployment (c. 2001-2020) — management and culture notes

**How to read these notes.** Every source entry states how it was read:

- **[FULL TEXT]** = I read the full page text (direct fetch, or an Internet Archive capture where the live site blocked fetching). Quotations from these were checked against the page text.
- **[EXTRACT]** = read only through an automated page-extraction/summarisation tool; wording is as the tool returned it and was NOT independently checked against the page. Treat quotations as probable, not verified.
- **[SNIPPET]** = search-result snippet only.
- **[NOT READ]** = located but not readable (video, blocked page).

All quotations are under 25 words. "Publication date" and "date the practice began" are kept separate throughout. Sources already in the existing dossier (Flickr "Flipping Out", "10+ Deploys Per Day", Etsy/Dickerson 2011, Netflix "Preparing the Netflix API for Deployment", Linden's shopping-cart story, LinkedIn XLNT 2014 post) are not re-researched here.

---

## 1. Amazon: "you build it, you run it", Apollo, Pipelines, and what Amazon kept of "soak" (bake time)

### Takeaway

Amazon's own accounts describe a sequence: service decomposition plus team ownership of operations (from about 2001), then a shared deployment service (Apollo), then a measured finding that code waited about 14 of 16 days for humans, which justified an automation programme (Pipelines) that leaders drove by adoption targets and by letting teams first encode their manual process unchanged. Amazon did not abolish waiting: it kept pre-production stages and a deliberate "bake time", but that bake happens in production under real traffic with alarm-driven automatic rollback, per stage, and a typical AWS pipeline still takes about four or five business days to reach all Regions.

### Cited Findings

**Source A1 — Werner Vogels interviewed by Jim Gray, "A Conversation with Werner Vogels: Learning from the Amazon technology platform", ACM Queue. [FULL TEXT, via Internet Archive capture dated 2022-12-29]:**

- Date: the page carries "June 30, 2006". (The interview is commonly cited as ACM Queue vol. 4 no. 4, May 2006; I did not verify the issue number on the page.) Practice dates: Vogels places the architectural break at 2001.
- Locator: Vogels's first long answer (history of Obidos), and the answer on lessons learned from services.
- Before state: Amazon began as one monolithic application ("Obidos") holding all business and display logic; scaling work focused on back-end databases "until 2001 when it became clear that the front-end application couldn't scale anymore." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- Ownership statement, exact wording: "Giving developers operational responsibilities has greatly enhanced the quality of the services, both from a customer and a technology point of view." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- Exact wording: "The traditional model is that you take your software to the wall that separates development and operations, and throw it over and then forget about it." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- Exact wording: "Not at Amazon. You build it, you run it. This brings developers into contact with the day-to-day operation of their software." He adds that it also puts developers in daily contact with the customer and calls that feedback loop essential to quality. — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- On pre-production testing, Vogels concedes there is no full-scale replica: he asks whether to "build another Amazon.test somewhere" with the same machines, data centers, customers and data, and says "These are very hard questions, and we have no simple answers." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- On release: "When the service is ready for beta testing, we will slowly introduce this to our customers, and then we measure relentlessly." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- On hiring/ownership: engineers need "a strong sense of ownership" because in small teams colleagues count on you "especially when it comes to operating the service that you have built." — [ACM Queue](https://queue.acm.org/detail.cfm?id=1142065)
- Limits: a CTO interview, not an implementer's account. Gives no deployment frequency, no on-call mechanics, no description of what happened to QA or operations staff, and no evidence for the quality claim beyond assertion. It does not say when "you build it, you run it" became policy, only that the architecture change ran over "the past five years" before 2006.

**Source A2 — "The Story of Apollo - Amazon's Deployment Engine", All Things Distributed (Werner Vogels's blog), November 12, 2014. [FULL TEXT]:**

- The page body shows no byline; it is on Vogels's blog and is conventionally attributed to him. It is also a launch post for AWS CodeDeploy (vendor motive). Practice dates: says only that Amazon "first faced this challenge many years ago".
- Sequence stated: service-oriented refactoring and reorganisation into "small autonomous teams" came first; "Each team took on full ownership of the development and operation of a single service". Deployment then "soon became a bottleneck". — [All Things Distributed](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Exact wording: "Manual deployment steps slowed down releases and introduced bugs caused by human error." — [All Things Distributed](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Platform rationale, exact wording: "It didn't make sense for each of the small service teams to duplicate this work, so Amazon created a shared internal deployment service called Apollo." — [All Things Distributed](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Volume: "In the past 12 months alone, Apollo was used for 50M deployments to development, testing, and production hosts." Note the denominator: this counts dev and test hosts as well as production. — [All Things Distributed](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Mechanics: rolling updates taking a fraction of hosts offline; striping across data centers; automatic halt when failed host updates cross "a configurable threshold"; failed hosts updated first on the next deployment "such as a quick rollback"; deployment history queryable (what version, which hosts, when). — [All Things Distributed](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Limits: no dates for Apollo's creation; no measured before/after; the 50M figure is not production-only and is not a count of distinct changes.

**Source A3 — Jon Jenkins (then Amazon), "Velocity Culture", O'Reilly Velocity 2011 (June 2011). [NOT READ — video and original slides not obtained]; statistics verified instead in a first-party Amazon deck: Jinesh Varia (Amazon Web Services), "Cloud-Powered Continuous Integration and Deployment", QCon San Francisco 2011 slides. [FULL TEXT of the PDF slide text]:**

- The O'Reilly-hosted slide PDF did not download and I did not watch the video, so nothing here is a verified transcript of Jenkins's talk.
- What I did verify: Varia's QCon SF 2011 deck contains a slide titled "Amazon May Continuous Deployment Stats (production hosts and environments only)" listing: "11.6 Seconds — Mean Time between deployments (weekday)"; "1079 — Max # of deployments in a single hour"; "10000 — Mean # of hosts simultaneously receiving a deployment"; "30000 — Max # of hosts simultaneously receiving a deployment". The deck's credits slide reads "Credits to Jon Jenkins, Paul Duvall and several engineers at Amazon". — [Varia, QCon SF 2011 slides (PDF)](https://qconsf.com/sf2011/dl/qcon-sanfran-2011/slides/JineshVaria_CloudPoweredContinuousIntegrationAndDeployment.pdf)
- "May" has no year on the slide; secondary sources and the timing of the talks (June and November 2011) imply May 2011. Treat the year as inferred.
- Scope clarifications come from a Hacker News thread on the talk, in comments by people presenting themselves as Amazon employees (unverified identities, so secondary): a "deployment" means "a single code push to one or more servers", so pushing to a thousand hosts counts once; and the figure covers "all prod deployments, including internal applications and services", not the retail website alone. One commenter misquoted the max-hosts figure as 3,000 and was corrected in-thread to 30,000, which matches the Varia slide. — [Hacker News thread, item 2971521](https://news.ycombinator.com/item?id=2971521)
- Limits: the numbers are company-wide aggregates across thousands of independently deployed services in one month; they say nothing about how often any single team or service deployed, about failure rates, or about outage frequency. I could not verify other figures often attributed to this talk (for example, reductions in outages after automation), so they are omitted.

**Source A4 — Mark Mansour (bio line: formerly Senior Manager of Software Development, AWS), "Going faster with continuous delivery", Amazon Builders' Library. [FULL TEXT]:**

- Date: the page reports published/last modified December 5, 2019 (via extraction tool). Practice dates: the article opens "Over 10 years ago", placing the measurement study and the Pipelines pilot before about 2009; no exact year is given.
- URL: <https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/> (now redirects to builder.aws.com).
- Before state and the measurement that justified change (Introduction): "We discovered that it was taking, on average, 16 days from code check-in to production." About a day and a half was writing code, under an hour was build and deploy, and "almost 14 days" was waiting for people to start a build, perform deployments and run tests. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- How it was framed to leadership: the recommendation to automate post-check-in steps was tied to the leadership principle "Insistence on the Highest Standards"; the stated goal was "to eliminate delays while maintaining or even improving quality." — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Tooling gap: the Brazil build system needed a person to start a build and Apollo needed an artifact uploaded by hand; "Pipelines" was built to automate the path between them. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Measured outcome: a pilot with a small number of teams; "the headline pilot team had achieved a 90 percent reduction in the overall time it took to go from check-in to production." — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Standardisation side-effect: Pipelines initially modelled one release process per application; teams that had separate processes for bug fixes and major releases converged on one, which the author says reduced defects. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- How management drove adoption: the Pipelines team had yearly goals to raise usage through "seductive adoption"; leadership measured the number of teams deploying via pipeline and classified pipelines by level of automation; teams took goals to move toward full automation. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- A stated failure of that metric: "in some organizations, the way we were measuring quality could lead teams to automate their release process without providing for any testing." The response was to rely on the Ownership principle rather than a central gate: "owning a product means also owning the consequences of any defects in that product", and the small single-threaded team handles production problems itself. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Encoding lessons into tools rather than meetings: senior engineers "catalogued common reasons for a release not working"; these became best-practice checks inside the build and release tools, configurable per organisation; leaders could begin with a warning shown in the tool before enforcing. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Priority order, exact wording: "we prioritize availability first, then speed, and then making it easier for our engineers." — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- What was retained before production: automated unit and integration tests, load and security testing, and a pre-production environment that uses production configuration and is "never sent traffic from customers". — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Production validation: deploy cell by cell; canary first; "If the error rate goes up, we will automatically roll the change back"; example of waiting for "3,000 positive data points, with no negative data points". — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Bake in production, and that it was debated: "We have spent a lot of time debating whether we should let changes just sit in production"; many teams wait a fixed time as well as collecting data points; "Some teams wait for hours and others wait for minutes." The stated purpose is "To test our tests": to see whether someone outside the team finds a problem the tests missed. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Shape of the ramp: get "from check-in to our first production customer as quickly as possible", then release slowly, shortening verification as confidence grows. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Controls retained: pipelines halt on alarms (teams may override to ship a fix); time windows (AWS teams generally deploy in business hours when responders are available; some Amazon teams prefer low-traffic periods; overridable); blocking of known-bad artifacts. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- How sceptical teams were brought along, exact wording: "many teams were not sure that continuous deployment would work." Teams were encouraged to "encode their current release process, manual steps and all, in a pipeline", then turn on automation stage by stage as confidence grew. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Governance: continuous-improvement programmes "are run by business leaders at different levels of the organization", with opt-out mechanisms for teams needing exemptions. — [Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Limits: a retrospective written a decade or more after the events, with no dates, no sample sizes, and one "headline" pilot team's result. The claims that standardisation "resulted in fewer defects" and that continuous deployment "has a positive impact on quality" are asserted without data. It does not describe what happened to QA or release-engineering roles.

**Source A5 — Clare Liguori (AWS Principal Engineer at time of writing), "Automating safe, hands-off deployments", Amazon Builders' Library. [FULL TEXT]:**

- Date: page reports published/last modified June 18, 2020 (via extraction tool). Describes AWS service-team practice as of about 2020. URL: <https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/> (redirects to builder.aws.com).
- No human watches (Introduction): at her interview she was told "most deployments weren't actively watched by anyone." — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Where the human approval went (section on code review), exact wording: "the code review is the last manual review and approval that a code change receives from an engineer". Approval is by a member of the owning service team; the pipeline blocks unreviewed commits. Reviewers are expected to judge deployment safety as well as correctness: sufficient tests, sufficient instrumentation for deployment monitoring, and safe rollback. Some teams attach a deployment-safety checklist to every review. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Pre-production retained (section on test deployments): alpha and beta run functional API and end-to-end tests; gamma is "as production-like as possible", with the same deployment configuration, monitoring, alarms and continuous canary tests, in multiple Regions. Gamma includes its own one-box stage, held "for some period of time, such as 30 minutes or one hour", to detect mixed-fleet incompatibility. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- One-box in production: each production wave starts with one box (one VM, one container, or a small percentage of Lambda invocations); "Typically, the one box serves at most ten percent of overall requests for the Region or Availability Zone." One-box stages also roll back on metrics scoped to that one box. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Rolling deployment: typically at most 33 percent of boxes replaced at once (some teams 5 percent, with faster 33-percent rollback). — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Waves: one Region or Availability Zone at a time "could take weeks", so deployments are grouped into waves of increasing size. Wave 1 is a low-traffic Region, one Availability Zone or cell at a time; wave 2 a high-traffic Region; later waves run several Regions in parallel (sample: 3, then up to 12, then the rest). New changes can enter the production phase at any time, "so we don't end up with large bundles of changes waiting". — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Automatic rollback: "The deployment system actively monitors an alarm to determine if it needs to automatically roll back a deployment." The same high-severity alarm pages on-call and triggers rollback; "Often, the rollback is already in progress by the time the oncall engineer has been paged". Teams build aggregate alarms spanning all their microservices and canary tests; the system also rolls back on anomalies in standard framework metrics. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Bake time, the retained "soak" (section on bake time): the rationale is slow-burning impact that "doesn't show up immediately during the deployment, especially if the service is under low load". Each production stage has bake time during which the pipeline keeps watching the team's aggregate alarm before promoting. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Bake durations, exact wording: "A typical pipeline waits at least one hour after each one-box stage, at least 12 hours after the first regional wave", then at least two to four hours after later waves. Bake also requires a minimum number of data points (example: at least 100 requests to a given API) so that the new code has actually been exercised. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Total elapsed time, exact wording: default bake times "will deploy a change to all Regions in about four or five business days." Larger or more critical services are more conservative. The stated reason for conservatism is that nobody is watching. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Where senior human scrutiny reappears: only to go faster than the pipeline. Shortening bake time for an urgent change requires review by "the organization's Principal Engineers", minimal changes in flight, and active watching. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Time windows: tuned to on-call response, not to a change calendar. Nights, holidays and weekends are excluded; many teams also exclude Fridays and late afternoons. She also names the opposite risk: very small windows make changes pile up, raising the chance that one of them causes impact. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Flags are deployed like code: runtime configuration "like API rate limit increases and feature flags" goes through its own pipeline with the same automatic rollback. — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Ownership: "The typical AWS service team owns many pipelines"; pipelines are defined as code with inherited team-wide defaults (which Regions per wave, bake time per wave). — [Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Limits: describes "typical" AWS service pipelines as of 2020, not Amazon retail and not the 2001-2011 transition. No incident or defect-escape data. It is a description of design intent by one senior engineer; the footer notes opinions are the author's.

**Source A6 — Sandeep Pokkunuri (bio line: formerly Principal Engineer, AWS), "Ensuring rollback safety during deployments", Amazon Builders' Library. [FULL TEXT for the passages quoted; rest via extraction]:**

- Date: page reports December 5, 2019. URL: <https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/>
- Automatic rollback is only safe if every version can coexist with and revert to its predecessor. Technique: "two-phase deployment" (Prepare: all servers can read the new format but still write the old; Activate: servers start writing the new). — [Builders' Library](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- A second, different use of "bake": between Prepare and Activate, "We call this time the bake period, and its duration is usually a few days." Its purpose is to be sure no rollback past Prepare will be needed, since both phases cannot be rolled back together. — [Builders' Library](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Verification is automated in the pipeline: "we explicitly verify that a software change is safe to roll forward and backward" (upgrade-downgrade testing in a pre-production stage). — [Builders' Library](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- The author's DynamoDB anecdote shows a human coordinating a cross-service protocol change and checking every server at the end of each phase. — [Builders' Library](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Limits: a technique article; nothing on organisation, approval or outcomes.

### Inferences

- Amazon's change was sequenced: ownership first (teams run their services), then a shared deploy platform, then measurement of queue time, then pipeline automation adopted team by team. The management lever described is measurement plus adoption targets plus letting teams keep their manual steps inside the new tool at first, not a mandate to drop gates.
- The 16-day study is the closest analogue to a three-day promotion-and-soak schedule: Amazon's finding was that nearly all elapsed time was waiting for people, not running checks.
- What Amazon retained of "soak" differs from pre-production soak in five stated ways: (1) it runs in production on real customer traffic, starting with one box at no more than about ten percent of a Region's requests; (2) it is per stage, so exposure grows only as evidence accumulates; (3) the exit criterion is evidence (alarm state plus a minimum count of data points), not elapsed time alone; (4) failure triggers automatic rollback with no meeting; (5) changes flow continuously, so there is no batch waiting for a train. Amazon still runs alpha/beta/gamma stages before production, so it is not evidence that pre-production environments can be removed.
- An honest caveat for the essay: Amazon's hands-off pipeline is not faster end to end than a three-day soak. Four or five business days to all Regions is slower. The difference is where the time is spent (in production, behind limited exposure and automatic rollback) and that the first customers see the change quickly while the batch size stays small.
- Human approval did not disappear; it moved to peer code review by the owning team, with deployment safety as an explicit review criterion, and senior (Principal Engineer) review reserved for requests to bypass bake time.

### Gaps

- I could not read Jon Jenkins's Velocity 2011 slides or watch the video. Only the four May statistics are verified, through a different Amazon employee's deck that credits Jenkins. Any other number attributed to that talk is unverified here.
- No primary source found for what happened to Amazon's QA/SDET or release-engineering roles, for on-call load, or for resistance from managers beyond Mansour's one sentence that many teams doubted continuous deployment.
- No dates for Apollo's or Pipelines' creation beyond "many years ago" and "over 10 years ago" (relative to 2014 and 2019).
- No defect-rate, outage, or change-failure data in any Amazon source read.

---

## 2. Netflix: from ops handoff and week-long manual canaries to full-cycle developers and automated canary judgment

### Takeaway

Netflix's first-person accounts say that in 2012 its Edge Engineering group had separate ops/SRE staff who deployed and ran code, releases took weeks, and canaries had decayed into week-long endurance waits; by 2018 the same group had developers owning deploy, operate and support on a rotating on-call, with canaries taking hours and the go/no-go decision made by a statistical comparison of canary against a fresh baseline. Netflix states the costs plainly: central platform teams, training, staffing headroom, and a risk of burnout if these are missing.

### Cited Findings

**Source N1 — Philip Fisher-Ogden, Greg Burrell, Dianne Marsh, "Full Cycle Developers at Netflix — Operate What You Build", Netflix Technology Blog, May 17, 2018. [FULL TEXT, via Internet Archive capture of netflixtechblog.com]:**

- URL: <https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249>. Practice dates: the "before" is dated 2012; the model described is "relatively common within Netflix" in 2018. Scope is Edge Engineering, with "other groups" said to see similar benefits.
- Before state (opening), exact wording: "Deployments felt like walking through wet sand." And: "Canarying was devolving into verifying endurance", glossed as "nothing broke after one week of canarying, let's push it". — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Before-state organisation: Edge Engineering "had ops-focused teams and SRE specialists who owned the deploy+operate+support parts of the software life cycle"; developers handed code to the ops team to deploy and operate. The stated upside of that model was fewer developer interrupts when things went well. — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Stated costs of the handoff: knowledge transfer between devs and ops was "lossy"; deployment problems had higher time-to-detect and time-to-resolve because ops knew less about the change; releases happened "on the order of weeks rather than days"; developers heard about operational pain second-hand. — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- An intermediate step that did not work well: a hybrid model where devs could push code and took off-hours pages. Partial responsibility "left gaps": developers "would often defer to the ops release specialist", and ops-focused staff "found it hard to prioritize automation so that others didn't need to rely on them." — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- The principle: "Operate what you build" makes the developing team responsible for operating and supporting the system, which "creates direct feedback loops and aligns incentives." Each team owns "deployment issues, performance bugs, capacity planning, alerting gaps, partner support". — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Platform investment as the precondition: centralised teams (Cloud Platform, Performance & Reliability Engineering, Engineering Tools) build common tooling and act "as force multipliers"; if developers must manage rollbacks, "rich tooling is needed" to detect problems and aid rollback. Named tools: Spinnaker (deployment pipelines) and Atlas (monitoring). — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Role change: "A full cycle developer thinks and acts like an SWE, SDET, and SRE." Netflix runs dev bootcamps and ongoing training for developers new to these areas. — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Named anti-pattern: treating operations as a distraction from the "real job". — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- What managers must provide: teams "staffed appropriately with enough headroom" for builds, deployments, production issues and support; time for training; operational automation "prioritized alongside business projects". Exact wording of the warning: "Without these, teams risk overload and burnout." — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- On-call design: a rotation in which developers "take turns handling the deployment + operations + support responsibilities", protecting focus time for the rest. Done badly, everyone gets pulled into interrupts. — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- No mandate ("context, not control" applied to tooling): "We don't mandate adoption of those paved roads but encourage adoption" by making them a far better experience. — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Stated downsides: higher cognitive load; some developers prefer deep specialism and find breadth "uncomfortable and sometimes unfulfilling"; balancing local versus central tooling investment is "one of the toughest aspects". — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Stated limit on transferability: "many companies won't have the staffing to invest in centralized teams like at Netflix"; advice is to analyse value and costs first and bring in "the least complexity necessary." — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Outcome (2018), exact wording: "Deployments are routine and frequent, canaries take hours instead of days". — [Netflix TechBlog](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Limits: qualitative; no deployment counts, incident rates or staffing numbers. Describes one organisation's path and says the model was reached by trying alternatives. It does not say Netflix as a whole has no test or ops specialists; it says specialised central teams exist and build tools. Claims in secondary coverage that Edge has "zero test teams" come from later talks I did not read.

**Source N2 — Ben Schmaus, "Deploying the Netflix API", Netflix Technology Blog, August 14, 2013. [FULL TEXT, via Internet Archive capture]:**

- URL: <https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0>. (Distinct from the 2012/2013 "Preparing the Netflix API for Deployment" post already in the dossier.) Describes the API team's process as of mid-2013.
- Explicit position on continuous delivery versus deployment: the decision to deploy "is made based on business need rather than simply deploying every commit to prod"; continuous deployment was treated as a possible later optimisation. — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Rationale for small batches: deploying smaller sets of features more often "reduces the number of changes per deployment" and makes problems easier to identify and triage. — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Two principles, "automation and insight"; exact wording: "Any process requiring people to execute manual steps repetitively will get you into trouble on a long enough timeline." — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Insight as a management tool: tracing code through environments and quality gates "helps us distribute deployment and ops responsibilities across the team in a scalable way." — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- What was retained in 2013: three long-lived branches (test, release, prod); a weekly release from the release branch; that weekly global production push "require[s] an engineer to kick off", done by "someone on our delivery team", and is automated after that. So a release cadence and a delivery team still existed alongside the daily path. — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- The fast path: commits to the prod branch are auto-deployed to a canary cluster taking a small share of live traffic; "If the result of the canary analysis phase is a 'go' then the code is auto deployed globally." — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Manual canary analysis was the earlier state: someone compared graphs and logs between baseline and canary; "this approach doesn't scale when you're deploying several times a week" across Regions. — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Automated evidence: the analyser compares "1000+ metrics" between baseline and canary and produces a confidence score; canaries with a high enough score "after 8 hours are automatically deployed globally"; a score "< 95 generally means a 'no go'". — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- The evidence package generated for each deployment: canary report with metric grid, a source diff report cross-linked to Jira, and a library/config diff between baseline and canary. — [Netflix TechBlog](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Limits: one team (the API) in 2013; an 8-hour canary is itself a retained soak, in production. No false-positive/negative rates for the score. No statement on QA roles.

**Source N3 — Michael Graff and Chris Sanden, "Automated Canary Analysis at Netflix with Kayenta", Netflix Technology Blog, April 10, 2018. [FULL TEXT, via Internet Archive capture]:**

- URL: <https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69>. Practice dates: the first generalised automated canary analysis was introduced "more than 5 years ago" (so by about 2013); Kayenta was open-sourced with Google on the publication date.
- Design: three clusters. Production is unchanged; a new baseline cluster runs the current version (typically 3 instances); the canary cluster runs the change (typically 3 instances). — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Why a fresh baseline rather than existing production: comparing a new canary with a long-lived cluster "could produce unreliable results"; a new baseline keeps metrics "free of any effects caused by long-running processes." — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Who decides: Spinnaker runs the analysis "and makes the decision to continue, rollback, or, in some cases, prompt manual intervention to proceed." — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- The manual era, exact wording: "Each canary meant several hours spent staring at graphs and combing through logs. This made it difficult to deploy new builds more than once or twice a week." The post also says visual comparison missed subtle differences. — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Evolution: first an application-specific script, then a generalised system, then Kayenta. — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Method: each metric classified Pass/High/Low using confidence intervals from the Mann-Whitney U test; the score is the share of metrics passing (9 of 10 gives 90%); "we bias towards techniques which are simple to understand." — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Trust through explanation: "Having detailed insight into why a canary release failed is crucial in building confidence in the system." — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Scale and stated limit: Kayenta then ran "approximately 30%" of production canary judgments, "an average of 200 judgments per day", with migration from the legacy system still under way. The legacy system needed hand-tuned thresholds and had flags whose intent became unclear. — [Netflix TechBlog](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- Limits: partly a product announcement. No data on how often canaries fail, false alarms, or regressions that passed. The 200 per day is judgments, not deployments.

**Source N4 — "Principles of Chaos Engineering", principlesofchaos.org. [FULL TEXT of current page]:**

- Unsigned community document that originated with Netflix's chaos engineering team; I did not verify the first-publication date or the "last update" date on the page.
- Definition, exact wording: "Chaos Engineering is the discipline of experimenting on a system in order to build confidence in the system's capability to withstand turbulent conditions in production." — [Principles of Chaos](https://principlesofchaos.org/)
- The method is framed as a controlled experiment with a control group and an experimental group, a steady-state hypothesis, and injected real-world faults; the stated aim is to find weaknesses "before they manifest in system-wide, aberrant behaviors." — [Principles of Chaos](https://principlesofchaos.org/)
- Limits: a statement of principles, not a Netflix history. Establishes nothing about dates, adoption or results.

**Source N5 — Netflix, "Netflix Culture" page (jobs.netflix.com/culture), current version. [EXTRACT]:**

- Undated living page (a footnote references Q1 2024); the tool reports the page says the culture deck was first written in 2009. Quotations below are as returned by the extraction tool and are not independently checked.
- "We expect managers to practice context not control", described as giving teams "the context and clarity needed to make good decisions". The page describes a "highly aligned and loosely coupled" approach and an aim to keep rules to a minimum. — [Netflix Culture](https://jobs.netflix.com/culture)
- Limits: this is the current wording, not the 2009 deck's. It is company self-description and says nothing specific about delivery, QA or release teams. The link between "context, not control" and the paved-road/no-mandate policy is drawn in N1, not here.

**Source N6 — Roy Rapoport (Netflix, then manager of Insight Engineering), "Canary Analyze All The Things", QCon New York 2014; InfoQ interview "Roy Rapoport on Canary Analysis at Netflix". [NOT READ]:**

- The InfoQ interview page returned only the speaker bio in text form (the content is video); I did not read the slides or watch the talk. The bio states that he joined Netflix in its datacenter IT/Ops group and managed Service Delivery for IT/Ops before moving to Product Engineering. — [InfoQ interview page](https://www.infoq.com/interviews/rapoport-canary-analysis/)
- Limits: nothing from the talk's content is verified here.

**Source N7 — "The Netflix Simian Army" (2011) and Spinnaker launch post "Global Continuous Delivery with Spinnaker" (2015), Netflix Technology Blog. [NOT READ — fetch blocked, archive unavailable at time of research]:**

- No findings recorded.

### Inferences

- Netflix's "before" canary is the closest published analogue to a time-based soak: a week of waiting whose pass criterion was "nothing broke". Netflix's own diagnosis is that this verified endurance and not correctness. The replacement shortened the wait and changed the criterion to a statistical comparison against a same-age baseline under the same traffic.
- The gate did not vanish. A canary score below threshold blocks the push. What changed is who evaluates it (software, with a report humans can inspect) and what it compares (two fresh clusters under identical live traffic, not a new build against calendar time).
- The hybrid-model passage is useful for managers: giving developers permission to deploy while keeping a release specialist produced deference to the specialist and no automation. By Netflix's account, ownership had to be complete before behaviour changed.
- Netflix in 2013 still had a weekly release branch and a delivery team for one of its most critical services. The move away from cadence-based release was gradual and ran in parallel with the fast path.

### Gaps

- No first-person source read that states Netflix never had, or abolished, a QA department or central release team. N1 documents ops/SRE specialists and an "ops release specialist" in Edge Engineering and N2 a "delivery team" in 2013. Claims of "no QA" should not be made from these notes.
- Roy Rapoport's talks, the Simian Army post and the Spinnaker posts were not readable; chaos-practice dates and Spinnaker adoption figures are therefore unverified here.
- No quantitative outcome data (deploy frequency, incident rate, canary failure rate) beyond "hours instead of days" and 200 Kayenta judgments per day.
- The 2009 culture deck itself was not read; "context, not control" is cited only from the current culture page via an extraction tool.

---

## 3. LinkedIn: Project Inversion, trunk-based development, "3x3", and experimentation as the release mechanism

### Takeaway

LinkedIn's change was a top-down intervention: in late 2011 engineering leadership paused feature development (Wired, quoting SVP Kevin Scott, says for two months) to rebuild tooling and move from feature branches and release windows to a trunk that must always be releasable. Later first-person posts show the same pattern repeated for mobile in 2015 (a monthly release with a four-day manual regression pass replaced by a three-hour commit-to-internal-users rule) and show that by 2015 feature exposure was controlled through the XLNT experimentation platform with staged ramps; yet a 2019 LinkedIn post admits many service teams still deployed manually.

### Cited Findings

**Source L1 — Josh Clemm, "A Brief History of Scaling LinkedIn", LinkedIn Engineering blog, July 20, 2015. [FULL TEXT, via Internet Archive capture]:**

- URL: <https://engineering.linkedin.com/architecture/brief-history-scaling-linkedin>. The byline on the page is Josh Clemm only (the task brief suggested Jay Kreps as co-author; the page does not show that).
- The only passage on Inversion, in full substance: "In late 2011, LinkedIn kicked off an internal initiative called Inversion. This initiative put a pause on feature development" so that the whole engineering organisation could focus on "tooling and deployment, infrastructure, and developer productivity." It is introduced with the remark that scaling can be measured on many dimensions, "including organizational." — [LinkedIn Engineering](https://engineering.linkedin.com/architecture/brief-history-scaling-linkedin)
- Limits: three sentences in an architecture retrospective written four years later. No duration, no named leader, no before/after numbers, no mention of resistance.

**Source L2 — Ryan Tate, "The Software Revolution Behind LinkedIn's Gushing Profits", Wired, April 10, 2013. [FULL TEXT, via Internet Archive capture] — SECONDARY (journalism) containing direct quotations from Kevin Scott:**

- URL: <https://www.wired.com/2013/04/linkedin-software-revolution/>
- Who drove it: Kevin Scott, senior vice president of engineering, "lured to LinkedIn in Feb. 2011", and his team. — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Before/after as reported: from "a system that required a full month to release new features" to one "that pushes out updates multiple times per day." (Wired's characterisation, not a LinkedIn measurement.) — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Before-state mechanics as reported: feature branches developed for days or weeks, then merged and re-tested together; managers "tended to tightly limit the number and scope of new features mashed together each month". — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- The intervention as reported: the switch "required halting all development for two months" while LinkedIn trained staff, migrated code and built automated tooling. — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Scott on the risk leadership accepted (direct quote): "It was a pretty big risk the business took". He describes telling engineering they would "run across a bridge and burn it behind you." — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Scott on the old approval path (direct quote, abridged within the 25-word limit): developers would ask to "integrate my feature branch into the release branch and test it and qualify it for me". — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Scott on the new rule (direct quote): "anything sitting in trunk must be releasable at any point in time, and if it's not releasable it's just as significant as a site emergency." He adds that a broken trunk stops forward development until fixed. — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- As reported, code passing automated tests is merged to trunk and "cataloged in a system that shows managers what features are ready to go live". This implies a release decision separate from merge; the article calls the whole system "continuous deployment". — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Scott's justification to the business (direct quote): "Without having done all this work to change how we built our software", shipping the subsequent products "literally would be impossible". — [Wired](https://www.wired.com/2013/04/linkedin-software-revolution/)
- Limits: secondary. The article ties the change to stock price and product output, which is correlation offered by a journalist and an executive. Its use of "continuous deployment" is loose; LinkedIn's own 2019 post (L5) says many services were still on continuous delivery with manual deploys. Wired does not use the name "Inversion"; the identification of this two-month halt with Inversion rests on matching L1's "late 2011" pause. No source read gives Scott's role in his own first-person writing.

**Source L3 — Ya Xu, Nanyu Chen, Adrian Fernandez, Omar Sinno, Anmol Bhasin (LinkedIn), "From Infrastructure to Culture: A/B Testing Challenges in Large Scale Social Networks", KDD '15, August 11-14, 2015, Sydney. [FULL TEXT of the authors' PDF as hosted by LinkedIn, via Internet Archive capture]:**

- URL: <https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf>
- Scale (Abstract and Section 1): "over 400 concurrent experiments running per day"; when XLNT launched it supported "about 50 experiments per day"; metrics grew from 60 to more than 1000. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Experimentation as part of delivery (Section 2.2): "The XLNT A/B testing platform is a key component of LinkedIn's Continuous Deployment framework". Application code makes "a simple one-line call to determine the variant" and provides a code path for the variant. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Ramping is built into the model (Section 2.1): an example begins by "diverting only 1% of US users to the treatment", then 50%, then other markets; a common practice is a "whitelist" segment of the developing team, an "internal" segment of all employees, then external segments, each with its own allocation. Consistent hashing gives a member a stable experience as a treatment ramps. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Culture is treated as a separate problem from infrastructure (Section 4): the authors identify "four necessary ingredients that have helped us instill experimentation deeply into our culture": integration with business reporting (same metric definitions, so Finance can use test results in forecasting); site-wide impact reporting; simplifying multiple testing (with over 1000 metrics per experiment, the most common question was why an irrelevant metric was significant); and "Most Impactful Experiments", which lets metric owners follow other teams' experiments that move their metrics. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Shared accountability (Section 4.4): each team runs experiments to improve its metrics and is "also responsible for the global health of the same metrics" when other teams' experiments affect them; MIE "drive[s] greater transparency regarding experiment launch decisions". — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Ownership of metrics (Section 2.3.1): a central team maintains company-wide tier-1 metrics; product and feature metrics are owned by the teams. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- A caution relevant to short ramps (Section 4.3 area): newly activated experiments often show overly large positive or negative impact that shrinks or becomes insignificant; the authors say most such cases are statistical artefacts rather than novelty effects. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Limits: this paper is about product experimentation (engagement metrics), not operational safety of deploys. I did not find in it the sentence "every change is an experiment" or a statement that all code changes must go through XLNT; do not attribute that wording to this paper. It gives no date for XLNT's launch and no data on defects caught by ramps.

**Source L4 — Drew Hannay, "3x3: Speeding Up Mobile Releases", LinkedIn Engineering blog, February 3, 2016. [FULL TEXT]:**

- URL: <https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases> (now served at linkedin.com/blog/engineering/archive/3x3-speeding-up-mobile-releases). Practice dates: adopted during Project Voyager, described as "more than a year" of work by "over 250 engineers" before the post; so about 2015.
- Before state, exact wording: "Before Voyager, we released the LinkedIn app once per month." A release candidate was handed "to the testing team, which performed a manual, four-day regression test suite"; bugs meant a hotfix, a new build, and possibly another round. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Train effects named: engineers "rushed to get their code checked in before the monthly release candidate deadline, or waited an entire month"; product and marketing planned around the release and hoped it went out on time; "we had only 12 releases a year." — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- The rule, exact wording: "Release three times per day, with no more than three hours between when code is committed and when that code is available to members." In practice the three-hourly release goes to internal users (LinkedIn employees); a weekly "known good" build is promoted to the app stores. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- The constraint was chosen to make manual gates impossible: "three hours is not enough time to conduct any manual testing steps", which "ensures we won't revert to using manual validation to certify our releases." — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- It also forced a limit on test volume: three hours "is not enough time to test everything end-to-end"; product owners decide which production-critical paths get UI tests, with edge cases pushed down to unit tests. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Flags as risk control: developers "place their new code behind feature flags, which can be enabled and disabled without releasing a new build"; features go to internal members first. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- What happened to a sign-off function: "several partner teams needed to review and sign off on each build", for example localisation. The team classified the bugs localisation usually found, replaced most of that checking with static analysis and automated "layout tests", and kept "periodic validation by the localization team" for semantic-meaning errors, for which "There is no way to avoid human validation". — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Limits: mobile apps only; the external cadence was weekly, bounded by app-store review. No defect or crash-rate comparison. Does not say what happened to the testing team's staff.

**Source L5 — Gururajan R., "Learnings from the journey to continuous deployment", LinkedIn Engineering blog, October 18, 2019. [FULL TEXT]:**

- URL: <https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment>
- Admission that the transition was incomplete eight years after Inversion: "teams have traditionally relied on a manual release process that delayed our teams from delivering value". The post defines the goal as moving from continuous delivery (trunk kept deployable, "deployment is still manual") to continuous deployment (system-triggered). — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment)
- Cultural shift named: "The primary cultural shift when moving to continuous deployment was to educate developers about writing quality tests" and to have them own test strategy across the pipeline; code review was refined to emphasise test quality. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment)
- Staging retained but distrusted: "The staging environment can be unreliable and services may be unavailable", which is given as a reason for multi-stage integration testing and for record/replay tests at build time. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment)
- Final gate is an automated canary: a small percentage of users are routed to updated hosts, analysis "runs for a preconfigured duration", metrics are compared with a control host, and on regression "the changes are immediately reversed". — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment)
- Limits: I read roughly the first two-thirds of the post; later sections (post-deploy validation, results) were not reviewed. Appears to describe one organisation's services, not all of LinkedIn. No outcome numbers recorded.

### Inferences

- LinkedIn is the clearest case of a leadership-imposed stop: an executive hired from outside (Scott, ex-Google) persuaded the business to forgo roughly two months of features for tooling. The persuasion argument recorded is capability ("it literally would be impossible" to ship what followed), not safety statistics.
- "Trunk must always be releasable; a broken trunk is a site emergency" replaces a human qualification step (the release team that integrated, tested and "qualified" a branch for a release window) with a standing invariant enforced by automated tests and by social priority.
- The 3x3 rule is a management technique worth noting: a time budget set deliberately too short for manual certification, so that the organisation cannot drift back to it.
- LinkedIn's history shows the transition is uneven. Trunk-based development (2011), mobile 3x3 (2015) and automated-canary continuous deployment for services (still in progress in 2019) are separate steps years apart.
- By 2015 LinkedIn's ramp (team whitelist, employees, 1%, 50%, wider markets) was implemented in the experimentation platform, which is how "release" and "experiment" became the same act for product features.

### Gaps

- No first-person account by Kevin Scott or other Inversion leaders was found and read; Scott's words come through Wired. The two-month figure appears only in Wired.
- No source read documents internal resistance to Inversion or the fate of LinkedIn's release-management or test teams after 2011 (L4 shows a mobile testing team and four-day manual regression still existed until about 2015).
- The phrase "every change is an experiment" / LiX-era "T-REX" posts were not located or read; no citation is offered for them.
- No measured reliability outcomes (incidents, rollback rates) in any LinkedIn source read.

---

## 4. Etsy: from the "deployment army" to one-button deploys, flags, blameless postmortems and trust

### Takeaway

Etsy's practitioners describe a 2008-2009 state of weeks-long batches released by a separate group over many hours with frequent rollbacks, replaced from about 2009-2010 by a one-button deploy tool, trunk deploys, config flags with staff-first and percentage ramps, and a deliberate culture programme (first-day deploys, blameless postmortems). Allspaw's reproduced 2009 letter to Yahoo management is the best primary record of how the argument was put to executives: operations kept its go/no-go vote, the job became getting to "go", and safety came from small changes, dark launches and flags that developers themselves built.

### Cited Findings

**Source E1 — John Allspaw, "Convincing management that cooperation and collaboration was worth it", Kitchen Soap, January 5, 2012. [FULL TEXT]:**

- URL: <https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/> . The post reproduces a note Allspaw says he "sent in late 2009 to the executive leadership of Yahoo's Engineering organization" as he left Flickr for Etsy; the practices it describes are Flickr's, 2005-2009. I read the 2012 reproduction, not the original email. The date of original sending is Allspaw's recollection ("late 2009").
- Audience and subject line: sent "to the three layers of management above me"; subject "Why Flickr went from 73rd most popular Y! property in 2005 to the 6th, 5 years later." The pitch leads with a business outcome. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Ownership, exact wording: "Everyone owned availability of the site, not just Ops." — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Culture is built, exact wording: "This culture was taught, not born." He rejects the framing of Ops as "firefighters" and Dev as "arsonists", which he says he heard elsewhere at Yahoo. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Speed is conditional on safety: the site could change "as fast as needed to be as long as it was made safe to do so"; "When it wasn't safe, we slowed, and everyone was fine with that". — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Small changes make causes visible: "When changes are small and frequent, the causes of degradation or outage due to code deploys are exceptionally transparent to all involved." — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- The gate was kept and repurposed, exact wording: "Flickr Ops had always had the 'go or no-go' decision"; "A significant part of my job was working towards saying 'go', not 'no-go'." Other groups could also vote on their preparedness. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Risky launches got written risk lists: for a feature that could not be dark-launched (people tagging), Flickr's architect listed the parts that could cause load problems, their likelihood, how to turn each off, and customer-care and community effects. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Dark launch examples: Flickr Video's code "had been on prod servers for months in beta" and launch was a switch; the homepage redesign "was dark launched 10 days earlier." Dark launching ran the back-end calls and discarded the results, with the percentage of traffic adjustable. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Effect on managers' attention: he says he had "no idea how many code deploys there were" per day because they so rarely caused issues, and that when they did, anyone could see when, who and the line-by-line change. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Staff-first and ramps: "about 95% of the features we launched in those 5 years were turned on for staff long before" everyone; where confidence was still short, "we ramped up the percentage of Flickr members" slowly. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Flags as kill switches agreed with Product in advance: flags let a degraded feature be turned off "instead of taking the entire site down", and their priority was pre-discussed with Product. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- The point he calls "extremely important": dark launches and config flags "were concepts and tools created by Flickr Development, not Flickr Operations". He adds that had Operations built them, "I do not believe we would have the same amount of success." — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Things Flickr Ops did not have to argue for: that Ops has go/no-go power "along with every other subgroup"; that spending to ensure stable launches "is the rule"; and that "Continuous Deployment is better for the availability of the site". — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Framing in the 2012 preface: on arriving at Etsy he "wasn't entirely sure that any of these approaches would work" there; Etsy's staff was larger and "continuous deployment was in its infancy when I got there." Two years on he reports the concepts had solidified. — [Kitchen Soap](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- A reader comment on the page (not by Allspaw; it sits under the commenter heading "Charles Severance" in the page text, dated January 2012) offers the phrase "amortizing risk" for small frequent changes versus accumulated risk in large packages, and describes ops trying to "eliminate risk" with ever longer test phases that enlarge each release. This is a commenter's view, not Allspaw's text. — [Kitchen Soap, comments](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/)
- Limits: describes Flickr, not Etsy. The letter asserts and does not measure the link between these practices and Flickr's rank. There is no evidence in the post that Yahoo management acted on it; Allspaw says "I have no idea if posting this letter helps anyone". It does not contain the phrase "risk theater".

**Source E2 — John Allspaw, "MTTR is more important than MTBF (for most types of F)", Kitchen Soap, November 7, 2010. [FULL TEXT for quoted passages; an update note dated 2017 was reported by the extraction tool but I did not confirm that date in the page text]:**

- URL: <https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/>
- Thesis, exact wording: "Being able to recover quickly from failure is more important than having failures less often." — [Kitchen Soap](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)
- His own limits: "some types of failures shouldn't ever happen" (data loss is the example reported); and "What I'm definitely not saying is that failure should be an acceptable condition." — [Kitchen Soap](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)
- The practices he associates with optimising for recovery include dark launching, percentage-based production rollouts and feature flags. [EXTRACT for this bullet] — [Kitchen Soap](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)
- A later update (reported by the extraction tool as dated October 17, 2017) retracts the "mean": the title should read "TTR is more important than TBF" because taking the statistical mean of these "makes absolutely no sense". [EXTRACT] — [Kitchen Soap](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)
- Limits: an argument, not data. The exception for failures that must never happen (irreversible data loss) is directly relevant to finance and should be carried into the essay rather than dropped.

**Source E3 — John Allspaw, "Blameless PostMortems and a Just Culture", Etsy Code as Craft, May 22, 2012. [FULL TEXT, via Internet Archive capture of codeascraft.com]:**

- URL: <https://www.etsy.com/codeascraft/blameless-postmortems> (original path codeascraft.com/2012/05/22/blameless-postmortems/).
- Position: Etsy rejects the "Bad Apple Theory" (Sidney Dekker's term) and wants to view mistakes "with a perspective of learning." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Definition, exact wording: "Having a Just Culture means that you're making effort to balance safety and accountability." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Mechanism: engineers whose actions contributed to an accident give a detailed account "without fear of punishment or retribution." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Why punishment backfires: an engineer expecting reprimand is "disincentivized to give the details necessary" to understand the failure, which "all but guarantees that it will repeat." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Cost to management named explicitly: blame leads to "Cover-Your-Ass" engineering, and "Management becomes less aware and informed on how work is being performed day to day". — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Not an amnesty, exact wording: "engineers are not at all 'off the hook' with a blameless PostMortem process." They are expected to help with remediation; "They are, after all, the most expert in their own error." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Method: look for the "Second Story", meaning why the action made sense to the person at the time; closing commitment: "we don't punish people for making mistakes." — [Code as Craft](https://www.etsy.com/codeascraft/blameless-postmortems)
- Limits: a statement of policy and rationale. No data on incident recurrence. Does not give the date the practice began at Etsy.

**Source E4 — Erik Kastner, "Quantum of Deployment", Etsy Code as Craft, May 20, 2010. [FULL TEXT, via Internet Archive capture]:**

- URL: <https://www.etsy.com/codeascraft/quantum-of-deployment> (original path codeascraft.com/2010/05/20/quantum-of-deployment/).
- Before/after, exact wording: Deployinator brought a web push "from 3 developers, 1 operations engineer, everyone else on standby and over an hour" down "to 1 person and under 2 minutes." — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- The metric offered to managers ("quantum of deployment"): the smallest number of steps, people and "ceremony" needed to get new code running. He asks whether emergency pushes use a hidden fast lane and whether those are logged and measured. — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Decoupling the tool from the cadence argument: easy deployment "should be non-negotiable" even for a business that ships "strongly QA'd code once a month at 3am"; and "This isn't a post about continuous deployment." — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- What becomes possible: "Features can go out a piece at a time instead of one all-or-nothing push." — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- What was retained: a QA button, then "Princess", a pre-production stage that "uses production data stores, our production network and production hardware", replacing an older Staging environment where code first met production hardware only at deploy. Environments are one-way, so what was verified on Princess is exactly what ships. — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Visibility replacing sign-off: on push, "everyone in IRC knows who pushed what code, complete with a link to the diff", plus an email to everyone. — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Who deploys: "engineers, designers… anyone really". Timings as of posting: production web push 70-150 seconds. Etsy deployed "directly from trunk". Requirements were "inspired by the way Flickr deploys". — [Code as Craft](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Limits: a tooling post from May 2010; the "before" figure is one sentence with no date. No reliability data.

**Source E5 — John Goulah, "Making it Virtually Easy to Deploy on Day One", Etsy Code as Craft, March 13, 2012. [FULL TEXT, via Internet Archive capture]:**

- URL: original path codeascraft.com/2012/03/13/making-it-virtually-easy-to-deploy-on-day-one/
- Exact wording: "At Etsy we have one hard and fast rule for new Engineers on their first day: deploy to production." The first task is adding one's photo to the about page. — [Code as Craft](https://codeascraft.com/2012/03/13/making-it-virtually-easy-to-deploy-on-day-one/)
- The stated purpose is to "overcome any fear of deployment by hopping in line". The enabling investment is a push-button development VM built with the same Chef configuration as production, because "It is extremely important that development does not drift from production". — [Code as Craft](https://codeascraft.com/2012/03/13/making-it-virtually-easy-to-deploy-on-day-one/)
- Limits: mostly an infrastructure how-to. No start date for the first-day rule.

**Source E6 — Kellan Elliott-McCrea (Etsy CTO 2011-2015; joined 2010), "Five years, building a culture, and handing it off", laughingmeme.org, August 31, 2015. [FULL TEXT]:**

- URL: <https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/> . Date taken from the URL path. A leaving post; retrospective.
- State on arrival (about 2010): "a tiny site, with a struggling software product"; later "a tiny, not-always-online website". — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- Leadership responsibility, exact wording: "Culture is what you do, not what you say. It starts at the top." — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- Exact wording: "If you aren't shipping, you aren't learning. If it slows down shipping, it probably isn't worth it." He qualifies this immediately: maturity is knowing when to make the trade-off. — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- Scale and his own doubt: his "private bet was that we'd make it to 50 engineers before things broke down"; doing continuous deployment "with over 250 engineers was, to me at least, literally unimaginable." — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- On the fate of QA as a separate discipline, exact wording of the key clause: monitoring, testing, debugging, QA, staged releases and game days "are all tools with the same goal, improving confidence, rather than separate disciplines handled by distinct teams." — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- On the professional norm he was overturning: "focusing on detection and response vs prevention" to get more reliable software "was unprofessional" five years earlier. — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- On trust: trusting designers, product managers and "everyone in the company to deploy to production" went against what the industry had been taught. On postmortems: people discussing their part in an outage "would have been a prelude to mass firings, rather than a path to profound learning." — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- A cost he names: he took a sabbatical; "Burn out is a real and pressing phenomenon in our industry". — [laughingmeme.org](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- Limits: a valedictory by the executive responsible; rhetorical ("five years ago…") and unmeasured. It does not describe Etsy's earlier release process in any detail.

**Source E7 — Ross Snyder (Etsy), "Continuous Deployment at Etsy: A Tale of Two Approaches", SXSW Lean Startup track, March 9, 2013, slides. [EXTRACT — slide transcript via extraction tool; not independently verified]:**

- URL: <https://www.slideshare.net/slideshow/ross-synder-etsy-sxsw-lean-startup-2013/17023596>
- Before state, "The Early Years (2005 - 2008)" (slides 9-20 as reported): weeks writing code; "Painful source control merge"; "Hand off to someone else to deploy"; "Deploy, site goes down"; "Roll back deploy". Slide 20 as reported: by late 2008 Etsy "has the deploy process of a much bulkier company." — [Snyder slides](https://www.slideshare.net/slideshow/ross-synder-etsy-sxsw-lean-startup-2013/17023596)
- Later state as reported: slide 26 "Most changes behind config flags (safer deploys)"; slide 32 (2012 statistics): 6,419 production deploys, about 535 a month and 25 a day; 3,851 config-only deploys; 196 different people deployed. — [Snyder slides](https://www.slideshare.net/slideshow/ross-synder-etsy-sxsw-lean-startup-2013/17023596)
- Caveats on the slides as reported: slide 29 "This isn't license to break stuff, quickly", with engineer-driven QA and unit testing integral; slide 42: database schema changes and the PCI-DSS environment cannot always be continuously deployed, and payment processing is continuously deployed only "as much … as is safe & legal (98%)". — [Snyder slides](https://www.slideshare.net/slideshow/ross-synder-etsy-sxsw-lean-startup-2013/17023596)
- Limits: slides without the spoken talk; the tool's transcription is unverified. The deck names no one as having driven the change.

**Source E8 — Mike Brittain (Engineering Director, Etsy), "Principles and Practices in Continuous Deployment at Etsy", slides, about April 2014 (date inferred from upload; venue not stated on the page). [EXTRACT — not independently verified]:**

- URL: <https://www.slideshare.net/slideshow/principles-and-practices-in-continuous-deployment-at-etsy/33055026>
- Before state ("five years ago", so about 2009) as reported: slide 5, releases contained "2-3 weeks of code changes" and took "6-14 hours"; slide 6, a "Deployment Army", "Long days and late nights", scheduled downtime; slide 8, one group wrote software and another released and operated it; slide 10 quotes a 2010 capacity plan on "frequent and prolonged outages." — [Brittain slides](https://www.slideshare.net/slideshow/principles-and-practices-in-continuous-deployment-at-etsy/33055026)
- Later state as reported: slide 3, "over 30 times per day"; slide 91, "175+ Committers, everyone deploys"; slide 32, "All enhancements are gated by Config Flags"; slide 33, "Most of the builds we deploy are 'dark' changes"; slide 69, admin-launch and whitelist, then "Ramp-up public traffic". — [Brittain slides](https://www.slideshare.net/slideshow/principles-and-practices-in-continuous-deployment-at-etsy/33055026)
- Limits: slides only, read through a tool. The "Dirty Details" talk (GOTO Aarhus 2012 and ALM Summit) is video and was NOT watched; nothing is cited from it.

### Inferences

- Allspaw's letter is a template for the manager-facing argument, and it does not ask for gates to be removed. It says the ops go/no-go stays; the manager's job becomes making "go" safe; and the safety mechanisms (dark launch, staff-only, percentage ramp, kill switch with pre-agreed product priority) should be built by the developers who own the feature.
- Etsy kept pre-production checks (QA environment, Princess on production hardware and data) and added production exposure controls. The before/after contrast in the primary sources is batch size, the number of people and ceremony per push, and who pushes; it is not "testing versus no testing".
- Blameless postmortems are presented as an information-flow argument aimed at managers: punishment reduces what management learns about how work is actually done. That is a precondition for letting many people deploy.
- The first-day deploy rule is a cultural device to remove fear of deployment; it depends on dev/prod parity tooling.
- Etsy's own practitioners state regulated-scope limits (PCI-DSS environment, schema changes), which is the part most transferable to finance: they continuously deployed what they judged "safe & legal" and handled the rest differently.

### Gaps

- "Risk theater" as a description of change approval could not be found in any Allspaw text read here; the nearest match in E1 is a reader comment about ops trying to "eliminate risk". The similar phrase "risk management theatre" is associated with Jez Humble, but I did not locate or read that source, so the attribution is unverified. Do not attribute "risk theater" to Allspaw on the basis of these notes.
- Kellan Elliott-McCrea's detailed writing on Etsy's pre-2010 release process was not found; E6 gives only "struggling" and "not-always-online". The before-state detail comes from Snyder's and Brittain's slides, read only via an extraction tool.
- Mike Brittain's "Continuous Deployment: The Dirty Details" is a video and was not watched.
- No primary account read of resistance inside Etsy (from ops, DBAs or executives) or of who formally decided the change. Secondary summaries say Allspaw and Elliott-McCrea were hired around 2009-2010 under Chad Dickerson; the Dickerson post is in the existing dossier.
- No Etsy incident-rate or change-failure data in any source read.

---

## 5. Cross-company: before states, who drove change, resistance, what was retained, measured outcomes and their limits

### Takeaway

Across the four companies the documented pattern is: ownership of operations moved to the team that writes the code; a central platform group made deployment cheap and observable; the release decision moved from a scheduled human judgment to peer review plus automated evidence gathered under limited production exposure; and some form of waiting was kept, relocated into production and tied to evidence. The published outcome numbers are about speed and effort; none of these sources publishes defect or outage rates, and several state costs (platform headcount, cognitive load, burnout risk) and exclusions (data loss, schema changes, PCI scope).

### Cited Findings

**Before states (as stated by each company's own people unless marked):**

- Amazon (before about 2009): 16 days average from check-in to production, of which almost 14 were waiting for people to start builds, deploy and test. — [Mansour, Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Netflix Edge (2012): ops/SRE specialists deployed and operated; releases "on the order of weeks"; canaries lasting a week judged by "nothing broke". — [Netflix TechBlog, 2018](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Netflix (manual canary era): several hours of graph-watching per canary; hard to deploy "more than once or twice a week". — [Netflix TechBlog, Kayenta, 2018](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- LinkedIn web (to 2011, SECONDARY): about a month to release features; feature branches merged and qualified by others for a release window. — [Wired, 2013](https://www.wired.com/2013/04/linkedin-software-revolution/)
- LinkedIn mobile (to about 2015): monthly release; four-day manual regression by a testing team; partner-team sign-offs. — [LinkedIn Engineering, 2016](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Etsy (before 2010): a push needed 3 developers, 1 operations engineer, others on standby, over an hour. — [Code as Craft, 2010](https://www.etsy.com/codeascraft/quantum-of-deployment). Slides read via tool report 2-3 weeks of changes per release taking 6-14 hours with a "Deployment Army". — [Brittain slides](https://www.slideshare.net/slideshow/principles-and-practices-in-continuous-deployment-at-etsy/33055026)

**Who drove the change, and how they made the case:**

- Amazon: a measurement project produced the recommendation; leadership tied it to "Insistence on the Highest Standards"; a tools team with yearly adoption goals; business leaders at several levels ran improvement programmes with opt-outs. — [Mansour, Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Netflix: engineering leaders of the affected group reasoned "from first principles" about time-to-value after a hybrid model failed; central teams supplied tools without mandating them. — [Netflix TechBlog, 2018](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- LinkedIn: SVP Engineering Kevin Scott, with business agreement to a development halt (SECONDARY). — [Wired, 2013](https://www.wired.com/2013/04/linkedin-software-revolution/); the pause itself is confirmed first-party. — [LinkedIn Engineering, 2015](https://engineering.linkedin.com/architecture/brief-history-scaling-linkedin)
- Flickr/Etsy: an operations manager (Allspaw) arguing to three layers of management, leading with business rank and stressing that developers built the safety tools. — [Kitchen Soap, 2012](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/); the CTO framing culture as starting "at the top". — [laughingmeme.org, 2015](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)

**Resistance and scepticism recorded:**

- Amazon: "many teams were not sure that continuous deployment would work"; answered by encoding the existing manual process in the pipeline first. — [Mansour, Builders' Library](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Netflix: developers deferred to the release specialist under the hybrid model; some developers see operations as a distraction from their "real job"; some prefer specialism. — [Netflix TechBlog, 2018](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- Etsy/Flickr: Allspaw was unsure the approach would transfer to Etsy's larger staff; Elliott-McCrea privately expected it to break at 50 engineers. — [Kitchen Soap, 2012](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/); [laughingmeme.org, 2015](https://laughingmeme.org/2015/08/31/five-years-building-a-culture-and-handing-it-off/)
- LinkedIn: manual releases persisted for many services until at least 2019. — [LinkedIn Engineering, 2019](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment)

**Where approval went:**

- Amazon: peer code review by the owning team is "the last manual review and approval", with deployment safety as review criteria; Principal Engineer review only to shorten bake time. — [Liguori, Builders' Library](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Netflix: canary score decides continue or roll back; manual intervention is an exception path. — [Netflix TechBlog, Kayenta, 2018](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- LinkedIn: trunk releasability enforced by automated tests; a time budget too short for manual certification; experiment dashboards visible to metric owners across teams. — [LinkedIn Engineering, 2016](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases); [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)
- Flickr/Etsy: go/no-go retained but oriented to "go"; every push announced with author and diff. — [Kitchen Soap, 2012](https://www.kitchensoap.com/2012/01/05/convincing-management-that-cooperation-and-collaboration-was-worth-it/); [Code as Craft, 2010](https://www.etsy.com/codeascraft/quantum-of-deployment)

**What was retained:**

- Amazon: alpha/beta/gamma pre-production; bake time per production stage (about one hour after one-box, 12 hours after the first regional wave); four to five business days to all Regions; business-hours deployment windows; a "few days" bake between Prepare and Activate for format changes. — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/); [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Netflix (2013): weekly release branch, delivery team, 8-hour canary before automatic global deploy. — [Netflix TechBlog, 2013](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- LinkedIn: staging environment and integration tests; weekly app-store promotion; periodic human localisation review. — [LinkedIn Engineering, 2019](https://engineering.linkedin.com/blog/2019/learnings-from-the-journey-to-continuous-deployment); [LinkedIn Engineering, 2016](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Etsy: QA and Princess pre-production stages. — [Code as Craft, 2010](https://www.etsy.com/codeascraft/quantum-of-deployment)

**Measured outcomes, with their limits:**

- Amazon: 90 percent reduction in check-in-to-production time for one "headline" pilot team (no date, no baseline detail). — [Mansour](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/). Company-wide aggregate of one production deployment every 11.6 seconds on weekdays in May (year inferred as 2011) across all services. — [Varia, QCon SF 2011 slides](https://qconsf.com/sf2011/dl/qcon-sanfran-2011/slides/JineshVaria_CloudPoweredContinuousIntegrationAndDeployment.pdf). 50M Apollo deployments in 12 months including dev and test hosts. — [All Things Distributed, 2014](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Netflix: canaries "hours instead of days" (qualitative); 200 Kayenta judgments a day at 30% coverage. — [Netflix TechBlog, 2018](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249); [Kayenta post](https://netflixtechblog.com/automated-canary-analysis-at-netflix-with-kayenta-3260bc7acc69)
- LinkedIn: experiments per day from about 50 to over 400; mobile from 12 releases a year to three internal releases a day and weekly store releases. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf); [LinkedIn Engineering, 2016](https://engineering.linkedin.com/blog/2016/02/3x3--speeding-up-mobile-releases)
- Etsy: push effort from several people and over an hour to one person and under two minutes. — [Code as Craft, 2010](https://www.etsy.com/codeascraft/quantum-of-deployment)

**Stated costs and exclusions:**

- Platform teams, training, staffing headroom, on-call rotation; risk of "overload and burnout". — [Netflix TechBlog, 2018](https://netflixtechblog.com/full-cycle-developers-at-netflix-a08c31f83249)
- An adoption metric that rewarded automation without tests. — [Mansour](https://aws.amazon.com/builders-library/going-faster-with-continuous-delivery/)
- Some failures must never happen; recovery speed is not a licence for failure. — [Kitchen Soap, 2010](https://www.kitchensoap.com/2010/11/07/mttr-mtbf-for-most-types-of-f/)
- Early experiment readings are often statistical artefacts. — [Xu et al., KDD 2015](https://content.linkedin.com/content/dam/engineering/site-assets/pdfs/ABTestingSocialNetwork_share.pdf)

### Inferences

- None of the four abolished waiting or pre-production testing. The honest version of the essay's thesis, on this evidence, is narrower than "replace soak with flags": these companies replaced calendar-based, batch, pre-production waiting judged by absence of complaints with exposure-limited production waiting judged by explicit metrics and ended by automatic rollback, while keeping fast automated pre-production checks.
- Release trains were removed by making the unit of release the single change (Amazon: changes enter production waves continuously; LinkedIn: trunk always releasable; Etsy: deploy queue). Batch size, not gate count, is the variable all four changed.
- The management moves that recur: measure where elapsed time goes; give one team the whole life cycle including the pager; fund a platform team and judge it by voluntary adoption; let teams bring their existing manual steps into the new tooling and remove them as confidence grows; replace sign-off meetings with peer review and visible, logged evidence; make incident review non-punitive so that information reaches management.
- Partial transfers of responsibility are reported as failing (Netflix's hybrid model). That bears on any plan to give finance developers a deploy button while retaining a release-management sign-off.
- For a finance audience the strongest transferable evidence is Amazon's (AWS is a high-consequence, multi-tenant service with conservative defaults) and Etsy's explicit carve-outs for PCI scope and schema changes. None of the four sources addresses regulatory change-approval requirements or segregation-of-duties rules, so these notes do not show that such rules are satisfied by peer review plus automated evidence.

### Gaps

- No source read publishes change-failure rate, incident counts, or customer-impact data before and after the transition. Speed and effort improvements are documented; safety improvement is asserted.
- The fate of QA and release-management staff is documented only indirectly: Netflix (developers act as "SWE, SDET, and SRE"; ops specialists existed), LinkedIn mobile (manual regression team's gate removed), Etsy (QA treated as one confidence tool, not a separate team). No source gives headcounts, redeployments or layoffs.
- Financial-industry applicability, regulatory treatment, and segregation of duties are not addressed by any source here.
- Sources not obtained despite attempts: Jenkins's Velocity 2011 slides/video; Rapoport's canary talks; Brittain's "Dirty Details" video; Netflix Simian Army and Spinnaker posts; the original 2009 Netflix culture deck; first-person LinkedIn accounts of Inversion; LinkedIn T-REX/LiX "every change is an experiment" posts.
