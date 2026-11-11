# Review of "Stop soaking, start ramping" from technology risk and change governance

Reviewer's vantage point: head of technology risk and change governance at a payments and core-banking firm, chair of the change advisory board, formerly an IT auditor at a Big Four firm. I read the essay once straight through, then went back through it against the synthesis report and the audit and compliance research note.

Convention used below: statements tagged **[PJ]** are my own professional judgement about how regulated firms, auditors and supervisors work in practice. They are not sourced from the essay or the research notes, and where they concern a specific rule text they should be checked against that text before anyone prints them. Untagged statements about what the essay or the notes say are taken from those files.

## 1. My reaction, as I would give it to the director

I agree with more of this than you expect, and I cannot sign any of it.

The engineering argument is sound. Small changes fail less than big ones, a pre-production environment is not production, a rollback nobody has rehearsed is a hazard, and our CAB approves almost everything put in front of it. I have known all of that for years. The FCA review says it in a regulator's voice, and I would use it myself.

The problem is that the essay argues with a rule book, and I do not run a rule book. I run a control framework that this firm wrote, that our board approved, that our external auditor tests, that our service-organisation report describes to every client's auditor, and that our client contracts refer to. The essay's central compliance claim, that no rule text requires a soak, is true and almost beside the point. Nobody audits us against PCI DSS in the abstract. They audit us against what we said we do. The soak is in our policy, in our control descriptions and probably in at least some client schedules. Removing it is a change to a control, with an owner, a risk assessment, a governance route and people who must be told. The essay has no section on that.

It also proposes four things that each land on my desk as a finding unless they are designed first, and it designs none of them:

- code deployed to production before testing is signed off ("deploy dark");
- a second channel for changing production behaviour, the flag, with no stated owner, approver, record or access model;
- developers who build, deploy and carry the pager;
- an on-call engineer with standing authority to change production without asking.

Each is workable. I have seen each made to work. But the essay presents them as habits for managers to adopt, and to me they are changes to segregation of duties, privileged access and change classification that need a control design before the first flag is flipped.

What makes this frustrating is that the author's own research notes contain most of the missing material: the control mapping (no human write access to production, the pipeline as the release actor, break-glass with alerts), a proposed classification of flag changes, the auditor's benchmarking problem, the PRA line on scenario testing, the PCI "significant change" clause. The essay left nearly all of it out. Someone decided the control design was detail. For my function it is the proposal.

So my answer is: not this document, but yes to a pilot, if the next version is written with us and contains what section 5 below lists. Bring me the version that tells me who approves the step from 1% to 10%, and I will take it to the risk committee with you.

## 2. Statements that would not survive scrutiny

### 2.1 Change control, records and classification

> "None of the texts read for this essay requires a soak period, a release train or promotion over several days. ... They ask for evidence."

True and insufficient. **[PJ]** An auditor tests two things: whether a control is designed to address the risk, and whether it operated as described over the period. The benchmark is the firm's own policy and control descriptions. If our change policy, our risk and control self-assessment, our SOC 1 / ISAE 3402 control descriptions or a client schedule mention staged promotion and a soak, then skipping it is a control failure regardless of what DORA says. The essay's list also omits the things that actually bind a payments processor day to day: the service-organisation report, SOX or equivalent financial-reporting controls at clients, client contracts, scheme rules and certification, the firm's own operational-resilience self-assessment, and outsourcing rules as they flow down from client banks. The author's notes list most of these as "not read" or "not researched"; the essay does not pass that warning on.

> "Put today's process in a pipeline, manual approvals included. You now have the record auditors ask for, on every change."

A record is not a control. **[PJ]** The auditor will ask: how do you know the population of changes is complete (what reaches production that did not go through the pipeline)? Who can alter the pipeline definition, the branch-protection settings and the approver lists, and is that itself under change control? Are the approvals by people on a maintained list of authorised approvers? Is the record linked to a risk assessment, test evidence and a back-out plan? Is it retained, immutable and retrievable for the retention period? A pipeline log answers "what happened". It does not show that nothing else could have happened.

> "Rolling back to the previous image and switching a flag off are pre-approved actions."

This is the right idea stated without the machinery. **[PJ]** In change-management terms there are three categories. A standard change is a specific, repeatable, low-risk procedure that the change authority has pre-authorised as a model, with entry criteria, and whose pre-authorisation is withdrawn when it fails. A normal change is assessed and authorised individually. An emergency change is expedited under an emergency approver with retrospective review. "Pre-approved" therefore means someone approved a defined model: which flags, which systems, what preconditions, what record is created, who reviews afterwards. It is not a blanket attribute of the verb "roll back". The essay itself supplies the reason: Knight's uninstall "worsened the problem", RBS's back-out caused the incident, Stripe's revert "interacted poorly". Flag-off is safe only for flags whose off path has been tested against data already written under the on path. That has to be attested per flag, not assumed per policy. The research note's own synthesis (ramp plan approved once as a change model; each step a logged execution; kill switch as emergency change with after-the-fact review) is a serviceable starting point and the essay dropped it.

> "And no rule text mentions feature flags, so nobody has told you how a flag change is classified."

It reads as an open question, and a team will hear a loophole. The author's notes are firmer: a production flag flip "is plainly a 'change'" under the scope clauses. The essay should say so in those words. **[PJ]** A flag that alters how a payment is routed, priced, authorised, posted or reported is a program change for control purposes even though no binary moved. If it sits outside the change population, the population is incomplete, and that is a deficiency in its own right.

> "Configuration, flags, reference data and operator scripts are all changes. Ramp them too."

Correct, and it undercuts the essay's own design without the author noticing. The CrowdStrike and Cloudflare cases are about a fast global channel that bypassed the staged pipeline. A feature-flag service is such a channel by construction: it changes production behaviour everywhere, in seconds, without a deployment. The essay offers the flag as the cure and never treats the flag plane as the thing to be governed.

> "Hold at least one stage through a full daily peak, and for batch work through a full run."

Reasonable. Missing entirely: the change calendar. **[PJ]** A CAB's real work is less about approving code than about scheduling, collision between changes, dependencies across teams and clients, business readiness (operations, client services, communications) and freezes: period end, scheme peak days, client-mandated freezes, regulator-imposed pauses. The essay never mentions a freeze. If code is frozen but flags are not, the freeze is fiction. If ramps run for "a day or a month", several will be mid-ramp at every freeze and every period end, and somebody must own that picture.

### 2.2 Approvals and the CAB

> "Change advisory boards (CABs) approved more than 90% of the major changes put to them ... which the FCA said 'raises questions over the effectiveness of CABs as an assurance mechanism'."

Quoted accurately. The inference invited is too strong. **[PJ]** A high approval rate is what a working upstream process produces: weak changes are sent back or withdrawn before they reach the board. It is also what a rubber stamp produces. The number cannot tell the two apart, which is exactly why the FCA wrote "raises questions" and not "shows". Likewise, major changes failing more often "despite the increased oversight" is confounded by the fact that they are major: they got the oversight because they were riskier. I say this as someone who thinks the FCA's question is fair and that my own board spends too long on changes it cannot meaningfully assess.

> "Move approval; do not delete it."

The heading is right. The first two examples under it are deletions: Amazon, where code review is "the last manual review", and a newspaper that "dropped its change approval board". Neither is supervised as we are. Starling is the relevant example, and what it shows is three approvals per release including a business approval that "is here to manage our overall risk as a regulated bank". That is the model to lead with. The essay buries it third and summarises it as "how far you can go while keeping human gates", as though the gates were the cost.

> "if you're doing small changes, the best person to make the decision about whether this change should go, is the person who just made that development change."

In a regulated firm this is the definition of the thing segregation of duties exists to prevent. The author's notes record that PCI DSS (manual review) names three roles, that the DORA technical standard requires the approving function to be independent of the requesting and implementing functions, and that whether a same-team peer counts as an independent "function" is unsettled. The essay quotes the FT line with approval and deals with the conflict four sections later.

> "A sign-off meeting cannot tell you whether the new settlement path behaves like the old one. Running both can."

Agreed on the second sentence. The first mistakes what sign-off is for. **[PJ]** Sign-off is not a prediction that the code works. It is a named, accountable person accepting a risk on stated evidence. Shadow comparison is better evidence. Somebody still has to accept it, against a threshold set in advance, and be answerable for the decision. In the UK that accountability ultimately runs to a senior manager under the individual-accountability regime, who must be able to show reasonable steps. The essay nowhere says who accepts the shadow result or what the pass mark is, except in Uber's case.

> "Do not answer a failure with a gate. This is the test of a management team."

After a material incident the board, the audit committee and the supervisor will each ask what control has been added or strengthened, and "we decided not to add one" needs a very good paper behind it. The essay's own example disproves its heading: OANDA's fix was to wire test results into the deploy decision, which is a gate, an automated and better one. The defensible advice is "answer a failure with the control that addresses its cause, and prefer automated preventive controls to more signatures". As written, it tells directors to resist remediation, and the DBS case two sections later shows what a supervisor does when it concludes a firm's change discipline is not improving.

### 2.3 Segregation of duties, production access and toxic combinations

> "Give one team the whole job: build, deploy, and the pager."
>
> "Move the pager to the team that wrote the code."

Stated with no compensating control. The author's notes contain the answer used by Monzo, Capital One and Google: nobody has standing write access to production, the pipeline is the only route and is the release actor, review by a qualified second person is machine-enforced, break-glass access raises loud alerts and is reviewed afterwards. None of that is in the essay. Without it, step 3 of the plan creates developers who can develop, deploy and operate, which is the single-individual path MAS 7.6.1 describes and that every access review I have run would flag.

**[PJ]** The toxic combinations that matter in this model, none of which the essay mentions:

- author of the code and holder of flag-write permission in production for that flag;
- repository or pipeline administrator who can alter or bypass the review rule that constrains them;
- pipeline definition stored in the same repository as the code it gates, editable by the author;
- approver of a pull request who is also on call with break-glass rights;
- administrator of the flag platform who can edit or purge its audit log;
- service accounts and pipeline credentials that can do what no human is allowed to do, with humans able to act through them;
- on-call engineers with standing rather than time-bound privileged access.

Peer review as the second pair of eyes also needs rules auditors will test: reviewer independence and competence, approvals invalidated by later commits, a size limit above which "reviewed" is not credible, and no self-approval through a second identity.

> "Booking.com's rule is that 'Everyone in the company must be able and feel empowered to stop harmful experiments of their own accord.'"

At a travel site. Universal write access to production configuration on a payments platform is an access-control finding. The principle can be kept (anyone can raise the stop; a small, entitled, logged group can execute it immediately) but the quotation as given is not a model for us.

> "Whoever is on call may take them without asking."

Who is on call, with what entitlement, obtained how, logged where, reviewed by whom afterwards? And "without asking" collides with incident management. **[PJ]** The moment a production fault affects clients there is an incident with a manager, a severity, a clock for client and regulatory notification, and a communications owner. Roll back first is right. Roll back silently is not. The essay quotes Google's condition that the rollback's "record describes the problem" and then leaves the record out of its own three-part policy.

> "Amazon, Monzo and Slack go further and let the pipeline roll back on the same signals that would page a person."

I would support this. **[PJ]** But an automated rollback is an automated control and an automated change. Its thresholds are configuration under change control, its operation has to be tested and evidenced, and its failure modes (false rollback at period end, rollback across a data migration) belong in the design. The essay treats it as a convenience.

### 2.4 Dark launches and testing in production

> "Deploy the code to production, and show it to nobody."
>
> "Netflix used it to stop acceptance testing from blocking deployment: the feature stayed disabled in production while testing carried on."

This is the most consequential control change in the essay and it is presented as a technique. Our policy, like most, says a change is tested and the results accepted before it goes to production. The author's notes quote MAS saying exactly that ("Test results should be accepted and signed off before the changes are deployed to the production environment"), and the essay mentions it once in passing. Deploying incomplete or not-yet-accepted code to production, switched off, requires the firm to redefine its control around two events instead of one: deployment (binary in production, behaviour unchanged, evidenced by what?) and release (behaviour exposed, authorised by whom, on what evidence?). That is a policy rewrite, and it is the first thing I would want drafted. **[PJ]** It also creates latent functionality in production, which security review, code-integrity controls and the PCI assessor will each ask about: what stops dormant code being reached by a route other than its flag?

> "It has been merged, built, deployed and proven not to disturb what is live."

Proven how, and who accepted the proof? The essay itself says two paragraphs later that "Dormant is not the same as tested".

> "A shadow run ... costs no client anything."

Not so. **[PJ]** Shadow traffic consumes capacity on shared databases, queues and cryptographic hardware. The dangerous defect in a shadow run is an unsuppressed side effect: a ledger write, an outbound message, a notification, a velocity counter in a fraud engine, a call to a third party. Each of those is a real event caused by untested code. A shadow run needs a side-effect inventory, signed off, before it starts.

> "Uber's payments group recorded the request the old system sent to the processor and the response it got."

**[PJ]** In a card environment a recorded authorisation request contains cardholder data and may contain sensitive authentication data, which PCI DSS does not permit to be retained after authorisation. The comparison store, the mismatch logs and the dashboards built on them come into PCI scope and into data-protection scope (purpose, retention, access). A team copying this pattern literally could create a reportable compliance breach while trying to be careful. The essay presents the pattern with a diagram and no warning.

> "Put it behind a flag at zero, run it in shadow, then give it to staff, then to one client."

"Staff" at a bank are customers with real accounts and real money, covered by staff-account policies. At a business-to-business processor there may be no staff cohort at all, only test merchants, and synthetic activity in production books is its own long-standing audit problem: it must be excluded from regulatory reporting, financial statements, transaction monitoring and client statements. The essay imports "employees first" from consumer internet firms without asking what it means here.

> "The EU's technical standards under its resilience act, as read in summary for this essay, require ... and treat testing in production as an exception to be justified, approved and time-limited."

The honesty about "as read in summary" is noted. But this single sentence is in direct tension with the essay's title and its first step, and the essay moves on without resolving it. If the firm is in scope of that regime, shadow runs and canaries either are "testing in production", in which case each needs to be identified, reasoned, time-limited and approved, or they are a controlled release method, in which case someone has to write down why. That argument is winnable. It has to be made, to me and probably to the supervisor, before the first run.

### 2.5 Clients, contracts, outsourcing and experiments

> "then give it to staff, then to one client"
>
> "For the rest, the first cohort is a client that has agreed to go first."

The essay recognises that clients may be banks with notice periods, and that is to its credit. It stops well short of what that means. **[PJ]** If our clients are regulated firms, we are their outsourced or third-party provider of a critical or important function. Their regulators require them to have contractual rights over us: notice of material changes to the service, audit and access rights, incident notification within set times, agreed service levels, sometimes approval of changes to the service description. Their own change management treats our change as a change to their estate. Their auditors rely on our service-organisation report, whose change-management controls are described in fixed words and tested over a period. In some jurisdictions the supervisor examines us directly as a service provider. So:

- "one client" is not 1% of anything from that client's point of view. It is 100% of that bank's customers, and that bank's important business service and impact tolerance.
- Choosing which client gets new behaviour first is a commercial and contractual decision, not an engineering one. A client that discovers it was the canary without having agreed will read its contract.
- Per-client flags mean clients run materially different versions of the service at the same time. The service description, release notes, support desk and client auditors all need to know which.
- Changing how we control change may itself be a notifiable change under those contracts, and the description in the assurance report must change in step, or the report will carry exceptions.

The flag service itself, if bought in, becomes a third party supporting a critical function, with everything that brings: due diligence, a register entry, exit planning, and a design question about what every flag evaluates to when the service is unreachable.

> "The UK regulator is more open to real experiments than most engineers assume: its Consumer Duty guidance says customer understanding 'could be tested directly by conducting randomised controlled trials or A/B tests'."

Accurately quoted and over-read. That paragraph is about testing whether retail customers understand communications. It is not authority for randomising how payments are processed, priced, routed or risk-scored for the clients of a business-to-business processor. The synthesis report is more careful than the essay: it notes that different outcomes for different groups must be justified, that the FTC used a firm's own A/B results as evidence of knowledge, that experiment records are discoverable, and that no first-person account exists of randomised experiments on price, credit decisions or ledger behaviour. The essay keeps the encouraging sentence and drops the three cautions.

> "Adyen recommends running risk experiments for at least a month, because chargebacks arrive late."

**[PJ]** A change to fraud rules, risk scores, pricing or credit logic is usually a model or decision-logic change with its own governance: validation independent of the developer, a challenger framework, approval by a model or pricing committee, monitoring, and conduct review where outcomes differ between customers. The essay's table gives "Is it better?" as the experiment's question and assigns it to nobody. The author's notes say the model-risk guidance could not be retrieved; the essay should therefore have ruled these changes out of scope, and instead it cites one as an example.

### 2.6 Evidence, audit trail and financial-reporting controls

> "The rule also gives you something for audit: the hash that ran in test is the hash that runs in production."

A good control, and the flag model weakens exactly the assurance it gives. With flags, the same hash exhibits different behaviour depending on configuration held elsewhere. Equality of binaries no longer evidences that what was tested is what is running. The evidence has to become "binary hash plus the flag state", versioned together, and tested in the combinations that will exist in production. The essay offers the hash as audit comfort in section 6 without connecting it to what sections 3 to 5 did to it.

Nothing in the essay addresses the combinatorial question. Ten independent flags are over a thousand possible states. Which were tested? Which are permitted? During a ramp lasting "a day or a month", with several ramps overlapping and old and new versions running side by side, the configuration serving a given client at a given minute may be one that no test environment ever held.

Nothing addresses point-in-time evidence. **[PJ]** I must be able to state, years later, for a dispute, a complaint, a client's auditor or a supervisor, which behaviour a given client or transaction received on a given date, who enabled it and on what authority. That needs flag state history held immutably outside the flag tool's own retention, and ideally the evaluated flag values recorded with the transaction. Retention runs to years.

Nothing addresses financial-reporting controls. The author's notes record that the audit standard makes frequent change to code containing automated financial controls more expensive to audit, because benchmarking favours applications with few changes. For a processor whose clients' auditors rely on its automated calculations (interest, fees, settlement, posting), that is a real cost and a conversation to have with the external auditor before the cadence changes. The essay is silent on it.

### 2.7 Incidents and operational resilience

The essay never mentions impact tolerances, important business services or incident reporting, though the notes quote the PRA: "firms that implement changes to their operations more frequently should undertake more frequent scenario testing."

**[PJ]** Two consequences. First, a canary that fails on real clients and rolls back in ten minutes is the mechanism working, in the essay's terms. In mine it may still be a production incident: logged, classified, possibly notifiable to the affected client under contract and, depending on the service and the numbers, assessable against regulatory reporting criteria. A method that deliberately takes small failures in production needs an agreed position on which of them are incidents, or it will either flood the incident process or, worse, train teams not to log. Second, the ramp is naturally expressed in resilience language: cohort size and stage duration should be derived from the impact tolerance of the service concerned, so that the worst credible failure of a stage stays inside tolerance. That framing would have won me over and the essay does not use it.

> "A study ... 'I'm pretty confident in 2017 we had less than 25 releases fail' ... 'less than a 1% failure rate.'"

A newspaper's recollection is not evidence for a bank. Note also that twelve releases with one or two failures and 2,500 releases with up to 25 failures is more failures in absolute terms. Whether that is better depends entirely on the size of each failure, which is the essay's whole argument and is not measured here.

### 2.8 Use of supervisory material in the opening

> "In 2024 the handbook that US bank examiners work from described canary releases ... and observed that 'in a DevOps environment, the same number and type of changes can be made daily or even hourly'."

Description is not endorsement. The same passage, per the author's notes, warns that automation with rapid release "may result in perpetuation of errors or invalid code" and tells management to assess the risks and implement controls. The notes also record the handbook's preference for off-peak deployment, its example of restricting production repositories to release management, and its statement that developers should not validate their own work. Quoting the permissive half in the opening and the restrictive half seven sections later is the kind of selectivity an examiner notices.

> "Knight is usually told as a story about reckless deployment. ... three days of soak would have observed the same nothing."

The second sentence is conjecture. More important, Knight is a feature-flag failure: a reused flag, dormant code left callable, inconsistent deployment, no second-person check, an improvised rollback. Those are the characteristic risks of the method being proposed, and the firm will have hundreds of flags where Knight had one. The essay does treat section 9 as a checklist, which is the right instinct. "None of these is a reason to keep the release train" is assertion. And the SEC's finding that Knight lacked a second person and a written procedure is an argument for my controls, which the essay reports and then reads past.

## 3. Questions the essay cannot answer

### Authority and approval

- Who is the approver of record for each ramp step, for example 1% to 10% at 02:00? If the answer is "the plan was approved once", who approved the plan, against what criteria, and who confirms the criteria were met before each step?
- Who sets the pass mark for a shadow comparison, and who accepts the result? Is 99.99% agreement acceptable when the remaining 0.01% is somebody's payment?
- Who may enable a flag in production, who may only disable it, and are those different entitlements?
- When the on-call engineer is also the author of the change, who is the second person?
- Under whose delegated authority does the on-call engineer act, and where is that delegation written down for the accountable senior manager?
- Who decides which client goes first, and who signs the agreement with that client?
- Who can stop a ramp for business reasons (a client's period end, a scheme peak day) and how do they know a ramp is in progress?

### Access and segregation

- What is the control that stops a developer enabling their own flag in production?
- Who administers the flag platform, the pipeline and the repository protections, and who reviews those administrators?
- Can the pipeline definition or the canary thresholds be changed by the team whose change they gate?
- Is on-call production access standing or time-bound, and how is each use reviewed?
- What is the break-glass route, and what happens the morning after it is used?

### Evidence

- How is flag state evidenced at a point in time for a regulator, a client's auditor or a court?
- How do we show a client which behaviour they received on a given date, five years on?
- How does the auditor obtain a complete population of production changes, including flag changes, ramp steps, automated rollbacks and kill-switch uses?
- What is the evidence that dormant code was dormant: that nothing but the flag could reach it?
- Where is the record that a shadow run produced no external side effects?

### Testing

- What is tested when old and new versions run side by side for a week, and which combinations of concurrent flags were tested together?
- Which test evidence is signed off before deployment, and which before exposure? By whom in each case?
- Who performs testing independent of the developer under the new model, and what is their veto?
- Has the off path of each flag been tested against data written while it was on?
- What does every flag evaluate to if the flag service is unavailable, and has that been tested in the payment path?
- For a flow of a few large payments a day, what replaces the percentage ramp? The essay admits it does not know.

### Clients, contracts and third parties

- Which client contracts, service descriptions or SLAs refer to release cadence, notice of change, client acceptance testing or a named testing process?
- Is the change to our change process itself notifiable to clients or to a supervisor?
- What do we tell client auditors who rely on our assurance report when the described control changes mid-period?
- When a canary fails on one client, what are we contractually obliged to tell that client, and how fast?
- If clients run different behaviours concurrently, how does the service desk know what a given client is running?

### Incidents and resilience

- Is an automatically rolled-back canary an incident? At what threshold of clients, value or duration?
- How does a ramp stage map to the impact tolerance of the service it touches?
- How many ramps may be in flight at once, and who sees the aggregate exposure?
- Does a freeze apply to flags? Who enforces it?

### Experiments and decision logic

- Which changes count as product experiments, and who in compliance approves differential treatment of clients or their customers?
- Are fraud rules, pricing, fees, credit decisions and limits in scope? Under which governance?
- Who owns the experiment record, and for how long is it kept, given that it may be used against us?

### The business case

- What did our soak actually catch in the last twelve months, and would a shadow run or a canary have caught each item? The essay concedes nobody has published this. We can measure it ourselves, and it is the first number I would ask for.
- We already release twice a week. The FCA compared frequent small releases with "longer release cycles". On what basis does the essay place us in the worse group?

## 4. Where the essay is right and what I would back

I would back the following without reservation:

- **Batch size is risk.** Three days of merged changes released to every client at once is a larger change than any one of its parts, harder to assess and harder to diagnose.
- **Pre-production is not production.** The Atlassian example is exactly the class of fault I have seen survive every environment.
- **Deployment and activation are different events.** The Knight reading (staged deployment, single activation) is correct and useful, as is the Google 2025 parallel.
- **Rollback must be rehearsed.** RBS is the right case, accurately used. I would make rehearsed back-out a mandatory evidence item tomorrow, whatever else we decide.
- **Build once, deploy by hash.** A stronger integrity control than most firms have.
- **The two-step treatment of data and format changes**, and the plain statement that an image rollback does not undo data written or money moved.
- **The client as the unit of exposure**, and the Square lesson about stable cohorts.
- **Hold a settlement-affecting change through at least one reconciliation cycle.** The essay says no source states this. It is right anyway. **[PJ]** I would extend it to a statement cycle, a billing cycle, a regulatory-reporting cycle and the relevant dispute window, depending on what the change touches.
- **The parallel run.** This is the best bridge in the essay to my world. A parallel run with a pre-agreed tolerance, a defined period and a formal acceptance is something risk functions and supervisors have accepted for decades. The essay mentions it in one sentence. Note that the cited regulatory parallel run was long, supervised and formally signed off, which argues for the governed version of shadowing, not the lightweight one.
- **Encode today's process in a pipeline first.** The only step in section 10 that removes no control, and the right first move.
- **The distinction between a safety ramp and a product experiment.** Correct and important. It deserves a control consequence, not just advice about vocabulary.
- **The admitted gaps.** No bank's before-and-after numbers, no auditor's verdict, no incumbent's account, nothing on low volumes or period end. This candour raised my trust in the author more than anything else in the document.

On the evidence:

- **The FCA review** is the best asset here and is quoted accurately, with its caveats. It is not used to full effect, and in two places it is over-pressed. It is deployed in section 1 as a jab at CABs and then never returns. It should instead supply the measurement framework: the FCA's own definitions of change failure, major change and emergency change are the metrics a pilot should report, because they are the ones a supervisor already uses. The over-pressing is the oversight inference discussed in 2.2. **[PJ]** My recollection is that the same review also associated well-established governance, lower legacy estate and investment in change capability with higher success rates. If so, quoting only the frequency and CAB findings is selective and a reader in my seat will know it. Check the source and include them.
- **Starling** is the single most persuasive example for my function and is used accurately. It should be the centrepiece of the governance argument.
- **DBS** is used honestly, against the essay's own interest.
- **TSB** is used fairly, including the concession that it argues for better testing.
- **The FFIEC booklet** is used selectively, as noted.
- **Consumer Duty** is stretched beyond what it covers.
- **Material the author had and did not use:** the control mapping from Monzo, Capital One and Google; the Capital One former auditor's statement that the biggest hurdle is segregation of duties and that auditors and regulators "must be brought into the conversation"; Etsy's separate cardholder environment with distinct pusher roles; the trading rule that requires an immediate kill capability and designated authorisation to deploy, which is the closest regulatory precedent for "turning up is controlled, turning off is immediate"; the PCI "significant change" clause; the auditor's benchmarking cost; the PRA's scenario-testing line. Every one of these would have strengthened the essay with my function.

## 5. What a version I could co-sign would contain

### The control framework

- A policy definition that separates deployment from release, with the control objectives, evidence and approver for each.
- A change taxonomy that places every action: code deployment, flag creation, ramp-plan approval, each ramp step, flag-off, image rollback, automated rollback, shadow run, flag removal. For each: standard, normal or emergency; the authoriser; the record; the review.
- Entry criteria for the standard-change models, and the rule that a model's pre-authorisation is suspended when it fails.
- A redefined CAB remit: approving change models, ramp plans for high-risk changes, exceptions and the calendar; reviewing outcome data; no longer reading individual low-risk changes.
- A segregation-of-duties matrix covering author, reviewer, release approver, flag operator, platform administrator and on-call, with the prohibited combinations and how each is enforced technically.
- A production access model: no standing human write access, the pipeline and the flag platform as the only routes, time-bound elevation for on-call, break-glass with alerting and next-day review.
- Flag governance: a register with owner, purpose, risk tier, permitted states, tested combinations, default on platform failure, kill-switch safety attestation, expiry date; a ban on reuse of flag identifiers; removal as a tracked obligation.
- Rules for shadow runs: side-effect inventory, data-handling assessment, capacity assessment, and scope decisions for cardholder and personal data.
- An independent testing role with defined authority under the new model.
- A statement of how the method sits with any testing-in-production restriction that applies to us.

### The artefacts

- Revised change policy and standard, approved through governance.
- Updated risk and control self-assessment and control descriptions, agreed in advance with internal audit and walked through with the external and service auditors before the period in which they change.
- A ramp-plan template: cohort definition, stage sizes, stage durations tied to the slowest relevant signal, metrics and thresholds, abort criteria, approver per stage, client communications.
- Point-in-time evidence design: immutable flag history, flag values recorded with transactions, retention period.
- Rollback rehearsal records.
- Incident classification rules for canary and ramp failures.
- A contract and service-description review, with a client communication plan and named consenting clients.
- A third-party assessment for any bought-in flag or experimentation service.

### The pilot scope

- One team, one service that sits behind a stable external interface, with no change to client-visible behaviour, message formats or the ledger of record.
- A side-by-side period in which the existing process keeps running and the new evidence is produced alongside it. A parallel run of the control itself.
- First exposure to internal or synthetic counterparties under agreed rules, then to named clients who have consented in writing.
- Internal audit observing from the first day, not reviewing at the end.

### The metrics

- Change failure rate, by the FCA review's definitions, for the pilot and for the baseline train.
- Incidents caused by change, with clients affected, value affected and duration.
- Time to detect and time to restore.
- What the soak caught during the pilot period and whether the new method caught the same items earlier, later or not at all.
- Shadow mismatch rates and their disposition.
- Flag inventory, age, and flags past expiry.
- Every break-glass use, every kill-switch use, every automated rollback, each with its review.
- Control exceptions: changes outside the pipeline, steps without the required approval, segregation breaches.

### The exit criteria

- Agreed before the pilot starts, by the risk committee: the period, the minimum number of changes, the failure-rate and exposure thresholds, zero unresolved segregation or evidence exceptions, a clean internal audit review of design and operation.
- Explicit stop conditions that end the pilot early.
- An explicit decision point for extension to a second service. No drift.

### Out of scope until separately approved

- The general ledger of record and period-end, end-of-day and settlement batch.
- External interfaces and message formats with notice or certification obligations.
- Pricing, fees, credit decisions, limits, fraud and risk models, and any randomised product experiment on clients or their customers.
- Low-volume, high-value flows where a percentage ramp is uninformative.
- Any client that has not agreed in writing.
- Anything during a freeze.
- Removal of the soak for any service not in the pilot.

## 6. Tone

The essay mostly does not see my function, addresses it occasionally as an obstacle to be managed, and once, briefly, as a partner.

It is "Written for engineering managers", and its closing line says the work "falls to managers". Risk, compliance, audit, change management, client services and legal are absent from the list of who has to change in section 7 and from all six steps in section 10. Step 5 says "Write the policy that lets the on-call engineer do it without asking". The policy in question is mine.

Where we do appear, the framing is adversarial or instrumental:

> "Answer the auditor from the rule texts."

The auditor is an opponent to be answered, and the answer is a citation.

> "so say which one you mean when you talk to risk and compliance"

Advice on how to phrase things to us.

> "The argument that works with a supervisor is failure rate and reach per change, with evidence. It is never speed."

Good advice, framed as which argument "works".

> "A sign-off meeting cannot tell you whether the new settlement path behaves like the old one."
>
> "Do not answer a failure with a gate. This is the test of a management team."
>
> "You now have the record auditors ask for"

Sign-off as ceremony, controls as a failure of nerve, audit as a consumer of records.

The opening also sets the register: "You are behind", and the current process is "approved" in a list with "soaked", shortly before the reader learns that CABs approve more than 90% of what they see.

Against that there is one sentence of partnership:

> "So keep named approvers, give independent testers a real role, and bring audit and risk in to help design the pre-approved change types, including the ones for a shadow run, a flag ramp and a rollback."

That is the right sentence. It is the only one, it is in the middle of section 8, and it is not in the plan.

The effect is predictable. A director who takes this to their risk partner has been equipped with rebuttals and no proposal, so the first meeting is a debate about rule texts and not a design session. The risk partner sees a document that names their controls as waste, omits the control design, and reaches them after the engineers have read it. They will respond by defending the existing process, which is the outcome the author least wants. The Capital One former auditor in the author's own notes said auditors and regulators "must be brought into the conversation and given full transparency". The essay should open the governance discussion with that, and should be addressed to both of us.

## 7. The single most dangerous thing a team might do after reading this

Start at step 4.

A capable team reads sections 3 to 6, adopts a flag library, deploys new money-moving behaviour to production "dark" before acceptance testing is complete, and then turns it on for staff and a first client by changing a flag. They do it from a console the author of the code can reach, with no change record, no independent approver, no agreed ramp plan and no notice to the client, in the sincere belief that the essay has told them flags are how careful firms do it and that "nobody has told you how a flag change is classified".

At that point the firm has an unrecorded, unsegregated channel for changing production payment behaviour, operated by developers, outside the change population, invisible to the CAB, the freeze calendar and the client. The essay pre-approves only switching off, but it describes switching on as the author's job ("The author of a change, not a release team, writes the switch ... plans the ramp") and never says who authorises it. Readers will fill that silence in their own favour.

That is Knight's set of conditions (dormant code, a flag, no second person, no written procedure) reproduced deliberately and at scale. And on the day it goes wrong there will be no record from which I can tell a client or a supervisor what ran, for whom, since when, and on whose authority.

A close second is the shadow run copied from the Uber diagram into a card environment: recorded authorisation traffic in a store nobody scoped, and a shadow path with one side effect nobody suppressed.
