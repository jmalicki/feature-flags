# Verification round, November 2026

Primary-source checks made while restructuring the essay so that it reads as a general argument. Labels: RAW means the raw text was read (curl and pdftotext); TOOL means read only through a summarizing fetch tool; SNIPPET means seen only in search results. Sites that refused automated access are noted.

## Cost of the transition

- Savor et al., "Continuous Deployment at Facebook and OANDA", ICSE 2016. RAW. <https://www.eecg.toronto.edu/~stumm/Papers/Savor-ICSE16.pdf>
  - "Developing, improving, and maintaining these tools takes considerable effort. Facebook had approximately 5% of its engineers dedicated to the task, while OANDA had 15% at time of writing."
  - "it is more difficult for smaller companies to use continuous deployment because a larger percentage of its engineering resources are needed for internal tool development."
  - "OANDA spent 2 years perfecting continuous deployment for mission critical infrastructure trading billions of dollars a day."
  - "However, OANDA's database schema changes always were always ad hoc and full of fear." (sic)
  - The percentages describe engineers building and maintaining deployment tools, not release engineering as a whole.

## Peak-season freezes

- Shopify Engineering, "Organizing 2000 developers for BFCM remotely", 7 December 2020. RAW. <https://shopify.engineering/organizing-2000-developers-bfcm-remotely>
  - "In the past, our Deploys team would lock the ability to automatically deploy to production for a week."
  - For November and December a bot asked for "a thorough risk to value assessment on any new PRs" in critical repositories; merchant-facing features shipped "only ... if approved by a director or GM in their area".
  - "we planned to reduce the amount of PRs that could be shipped in a deploy and increase the amount of time they would spend in canaries", and "we also planned to lock deploys for a week around the BFCM weekend."
- Shopify news, "Preparing the back end for Black Friday and Cyber Monday", undated. RAW. <https://www.shopify.com/news/preparing-the-back-end-for-black-friday-and-cyber-monday>
  - "When it's business as usual, we deploy around 40 new versions of Shopify each day." Before BFCM it sets a feature freeze and a code freeze in which "Only critical fixes can be deployed."

## Contract testing in place of an end-to-end environment

- Nubank, Alexandre Freire, "Why we killed our end-to-end test suite", 24 September 2021. RAW. <https://building.nubank.com.br/why-we-killed-our-end-to-end-test-suite/>
  - "One experiment suggested that, for every 1000 runs, we had 42 failures, only 1 bug".
  - After moving to contract tests, cycle time "went from unpredictable (hours or even days) to about 20 mins", and deployments went from "at most a hundred deploys a week" to "in the order of a thousand deploys per week".
  - "Contract Tests can catch structural incompatibilities, but they are not good in testing behavior." Nubank added in-memory acceptance tests.
- GOV.UK Pay, Oswald Quek, "Lessons learnt using contract testing in GOV.UK Pay", 29 January 2019. RAW. <https://technology.blog.gov.uk/2019/01/29/lessons-learnt-using-contract-testing-in-gov-uk-pay/>
  - "By switching to contract testing we now have confidence that any service we deploy will always be compatible with the things it needs to connect with."
  - "Moving existing end-to-end tests to contract testing will take some time so we still have to run these."

## Mobile clients

- Apple, "Release a version update in phases". RAW. <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases>
  - Updates go out "gradually over 7 days" to users with automatic updates: 1%, 2%, 5%, 10%, 20%, 50%, 100%; the release can be paused "for up to 30 days"; anyone can still download the update manually.
- Google Play, "Release app updates with staged rollouts". RAW. <https://support.google.com/googleplay/android-developer/answer/6346149>
  - "With a staged rollout, your update reaches only a percentage of your users, which you can increase over time."
  - "Users who already received the app version in your staged rollout version will remain on that version." The fix is a new release.

## Payment schemes and market infrastructure

- ECB, TIPS Certification Test Cases v1.3.00, 30 June 2025. RAW. <https://www.ecb.europa.eu/paym/target/target-professional-use-documents-links/tips/shared/pdf/tips_certification_test_cases_participant.pdf>
  - Tests are "mandatory for the certification of TIPS Participants and are applicable based on the intended functionality used by each TIPS Participants in Production"; certification "must be completed before the end of User Testing in order for the new participant to progress to TIPS production". Participants taking up new functionality test only that functionality.
- Pay.UK, Faster Payments technical accreditation. TOOL (403 to curl). Vendors and aggregators re-accredit "if a material change is made to the gateway (i.e. a new or updated software version)" and annually.
- Pay.UK, Bacs onboarding (System Principles V18, January 2026). RAW via saved PDF. Onboarding ends with a Go/No-Go checkpoint and a first live transaction ("send or receive a transaction to generate a non-zero settlement position") before first settlement.
- No published scheme document found that requires recertification for a participant's internal releases behind a certified gateway. EBA CLEARING STEP2/RT1: no primary document found.
- ISO 20022 migrations: TARGET2/T2S consolidation was explicitly big-bang, "No co-existence of ISO20022 and MT messages" (ECB AMI-Pay/AMI-SeCo, 20 November 2018, RAW). CHAPS migrated on 19 June 2023, with new data fields optional before mandatory (Bank of England, RAW). Only Swift's cross-border CBPR+ ran an MT/MX coexistence period, to November 2025.
- "Live proving" as a standard scheme term: not found.

## Payment firms with frequent or progressive deployment

- Wise, Massimo Pacher, "State of our CI/CD pipeline (Part 2)", 5 September 2022. RAW via Wayback. <https://medium.com/wise-engineering/state-of-our-ci-cd-pipeline-part-2-29bd17515e6f>
  - "enabling more than 150 deployments per day across our service fleet"; a feature service to stage a release "(e.g. 10% of users, only users from a specific region, etc)"; canary assessment "depends on the expertise and knowledge of the releasing engineer".
- Adyen, Michiel Toneman, "From 0-100 billion: scaling infrastructure and workflow at Adyen", 3 January 2018. RAW. <https://www.adyen.com/knowledge-hub/from-0-100-billion-scaling-infrastructure-and-workflow-at-adyen>
  - "We mitigate this risk by having a centralized and systematic approach to the separation of code deployment and activation. Following thorough testing on dev and integration, we toggle features one-by-one on production, and then canary them". Adyen also uses release branches.
- GoCardless, "Moving fast at GoCardless". RAW. <https://gocardless.com/blog/moving-fast-at-gocardless/> One team "usually deploys 10+ times per day".
- Not found: first-person engineering accounts with numbers from Form3, ING, Nationwide, Lloyds, JPMorgan or Worldpay.

## Rules on change outside finance

None of these requires a soak period, a release train or fixed release windows.

- PCAOB AS 2201 (SOX audits). RAW via Wayback. Automated controls are lower risk "if relevant information technology general controls are effective"; reliance on a baseline depends on "the strength of the company's program change controls" and on whether "the application is stable (i.e., there are few changes from period to period)" (.47, .B29, .B31). Frequent change raises the evidence the auditor needs; the standard prescribes no procedure.
- COSO 2013, Principle 11. RAW. General controls over technology; manual or automated control activities; alternatives where segregation of duties is impractical.
- AICPA Trust Services Criteria (SOC 2), CC8.1. RAW (2017 criteria, 2020 update). "The entity authorizes, designs, develops or acquires, configures, documents, tests, approves, and implements changes..." Points of focus include authorization "prior to development" and testing and approval "prior to implementation", and an emergency path; points of focus are not mandatory.
- ISO/IEC 27001:2022 Annex A 8.32. Not read (paywalled). Paraphrase only: changes are subject to change management procedures, which the standard does not specify.
- UN Regulation No. 156, vehicle software updates. RAW (OJ L 82/60, 2021). Requires a process to "confirm the compatibility of a software update with the target vehicle(s) configuration before it is issued" (7.1.1.7), records of configuration before and after, and for over-the-air updates the ability to "restore systems to their previous version in case of a failed or interrupted update" (7.2.2.1.1). No cadence or soak.
- FDA, guidance on predetermined change control plans for AI-enabled device software functions, December 2024, revised August 2025. RAW. Nonbinding. A plan describes planned modifications, a modification protocol and an impact assessment; the update procedures should say whether updates are automatic or manual and "deployed globally or locally". Staged rollout is allowed if planned in advance.

## DORA incident classification

- Commission Delegated Regulation (EU) 2024/1772. RAW. <https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1772>
  - An incident is major if it affects critical services and meets two or more thresholds (Art. 8(1)). Client thresholds include more than 10% of clients using the service, more than 100,000 clients, or any client identified as relevant (Art. 9(1)); duration over 24 hours measured from when the incident began (Art. 3(1), 9(3)); any impact on data integrity that harms business objectives or compliance (Art. 9(5)(a)); costs over EUR 100,000 (Art. 9(6)).
  - A small ramp stage therefore does not keep a defect below the thresholds at a firm with few large clients.

## Direct-debit refunds

- PSD2 (Directive (EU) 2015/2366). RAW. Unconditional refund of an authorized SEPA direct debit within 8 weeks (Arts 76(1), 77(1)); notice of an unauthorized transaction up to 13 months after the debit date (Art. 71(1)); business payers may contract out (Art. 61(1)).

## Gaps outside finance

### Deciding once for long-lived work

- Uber, Seva Kaloshin, "Safe deployments of Versioned workflows", Cadence blog, July 2025. RAW. <https://cadenceworkflow.io/blog/2025/07/01/2025-07-01-safe-deployment-of-versioned-workflows/safe-deployment-of-versioned-workflows>
  - "At Uber, we manage billions of workflows with lifetimes ranging from seconds to years."
  - "By using workflow.GetVersion, you can mark points in your code where changes occur, ensuring that future calls will return a specific version number."
  - "If a new workflow is rescheduled to an old worker, it will be blocked or even fail" (during rollouts and especially rollbacks); a customer "needed to identify all problematic workflows, terminate them if they did not fail automatically, and restart them. These steps resulted in a significant on-call burden, leading to possible SLO violations and incidents."
  - The fix separated "code changes from the activation of the new version".
- Temporal, Go SDK versioning documentation, read November 11, 2026. RAW. <https://docs.temporal.io/develop/go/versioning>
  - "A Patch defines a logical branch in a Workflow for a specific change, similar to a feature flag. It applies a code change to new Workflow Executions while avoiding disruptive changes to in-progress Workflow Executions."

### Big-bang cut-over outside banking

- Report of the Ministerial Inquiry into the Novopay Project (New Zealand schools payroll), June 2013. RAW. <https://d2xgqyuql1olth.cloudfront.net/assets/images/MIN130501-Inquiry-Report-web%20%281%29_0.pdf>
  - In 2005 the Ministry judged "a 'Big Bang' model, whereby the new payroll service would be rolled out to all users at the same time, was unacceptably hazardous" and planned "An eight-month staggered implementation" and "Parallel runs of the new and existing systems".
  - Later "the intended pilot and phased rollout of the service were removed from the project plan"; "The project became locked into a 'big bang' Go Live on 20 August 2012."
  - "The Business Owner made it clear to us that once Confidence Point Two was accepted there was no turning back"; a contingency option "by 30 June 2012 had lapsed."
  - "The decisions to remove the pilot and staged rollout, due to timeline pressures, were ill-advised and counter to good practice. Both were feasible and, had they been conducted, would have exposed issues before a much larger number of schools were affected at Go Live."
- Canada's Phoenix pay system, Auditor General's opening statement, House of Commons Standing Committee on Public Accounts, meeting 105, June 14, 2018. RAW. <https://ourcommons.ca/Content/Committee/421/PACP/Evidence/EV9984635/PACPEV105-E.PDF>
  - "In order to meet budgets and timelines, Public Services and Procurement Canada decided to remove critical pay functions, curtail system tests, and forgo a pilot implementation of the system." The "no system to go back to" wording is an MP's, not an audit finding; Phoenix went live in two waves.

### Partner integrations (adjacent sources only)

- Duffel, "How to build a flight API: exploring our tech stack", July 2022. RAW. <https://duffel.com/blog/how-to-build-a-flights-api-exploring-our-tech-stack>
  - "Working with capricious airline APIs and developing new features regularly means we need to deploy new versions of our code multiple times a day."; feature toggles via Unleash "for both gradual release and emergency control"; end-to-end tests that check "booking flows with airline sandboxes". The toggles are not described as per airline.
- Shopify, Tom Newton, "How Shopify Manages API Versioning and Breaking Changes", December 17, 2019. RAW. <https://shopify.engineering/shopify-manages-api-versioning-breaking-changes>
  - "Shopify releases a new API version every three months at the beginning of the quarter."; changes enter the unstable version and "can optionally have a beta flag associated with the change", checked at runtime with `ApiChange.in_effect?`.
- Not found: a first-person account of deploying a partner integration dark and enabling it per partner; EDI, carrier, healthcare-exchange (NHS pages refused) and Twilio searches returned marketing or nothing.
