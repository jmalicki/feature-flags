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
- FDA, guidance on predetermined change control plans for AI-enabled device software functions, December 2024, revised August 2025. RAW. Nonbinding. A plan describes planned modifications, a modification protocol and an impact assessment; the update procedures should say whether modifications are implemented automatically, manually or both. "Deployed globally or locally" appears only in a sentence on monitoring, where global means the same update on every device and local a change for a particular site or patient; the guidance does not discuss staged rollout (corrected after a re-read).

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

## Held-back payments facts, checked November 12, 2026

Read in raw text (HTML, or pdftotext from the official PDF).

Method: I fetched EUR-Lex and the EBA Q&A pages with curl, stripped the HTML to text and read the result raw. EUR-Lex did not refuse curl. I downloaded the PDFs (EBA opinion, EPC rulebook, FCA PS25/12) from the official URLs and read them with pdftotext -layout. All quotes below are verbatim from those texts.

### 1. Transaction-risk-analysis (TRA) exemption from SCA

Commission Delegated Regulation (EU) 2018/389, <https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R0389>

- Art. 18(1): "Payment service providers shall be allowed not to apply strong customer authentication where the payer initiates a remote electronic payment transaction identified by the payment service provider as posing a low level of risk". The Article does not say whether this means the payer's or the payee's provider.
- Art. 18(2)(a): the fraud rate is the one "reported by the payment service provider and calculated in accordance with Article 19".
- Art. 19(1): "the overall fraud rates covering both payment transactions authenticated through strong customer authentication and those executed under any of the exemptions referred to in Articles 13 to 18". The rate is "calculated as the total value of unauthorised or fraudulent remote transactions, whether the funds have been recovered or not, divided by the total value of all remote transactions for the same type of transactions ... on a rolling quarterly basis (90 days)."
- Art. 20(1): a provider must "immediately report to the competent authorities" when a monitored fraud rate exceeds the reference rate.
- Art. 20(2): "Payment service providers shall immediately cease to make use of the exemption referred to in Article 18 for any type of payment transactions indicated in the table set out in the Annex in the specific exemption threshold range where their monitored fraud rate exceeds for two consecutive quarters the reference fraud rate". Cessation therefore applies per type and per amount band.
- Art. 20(3): the exemption cannot be used again until the rate has been at or below the reference "for one quarter". Art. 20(4) requires notifying the authority before resuming.
- Annex reference rates (card / credit transfer): EUR 500: 0,01 / 0,005; EUR 250: 0,06 / 0,01; EUR 100: 0,13 / 0,015. These match appendices.md.

EBA Opinion EBA-Op-2018-04, 13 June 2018, <https://eba.europa.eu/sites/default/documents/files/documents/10180/2137845/0f525dc7-0f97-4be7-9ad7-800723365b8e/Opinion%20on%20the%20implementation%20of%20the%20RTS%20on%20SCA%20and%20CSC%20%28EBA-2018-Op-04%29.pdf>

- Para 40: "payees can never decide whether or not to use an exemption".
- Table 2, "Summary table on who may apply an exemption", row "Article 18 Transaction risk analysis": the payer's PSP "Yes"; the payee's PSP "No" for credit transfers and "Yes*" for cards. The footnote reads: "*The payer's PSP always makes the ultimate decision on whether or not to accept or apply an exemption; the payer's PSP may wish to revert to applying SCA to execute the transaction if technically feasible or decline the initiation of the transaction."
- Para 46: for card transactions the fraud counted for a given PSP is "(i) the unauthorised transactions for which the given PSP has borne liability, as determined in accordance with Article 74 of PSD2, and (ii) other fraudulent transactions which have not been prevented by that PSP." The fraud rate also includes "fraudulent transactions resulting from the manipulation of the payer".
- Para 47: the fraud rate "is calculated for all credit transfer transactions and all card payment transactions and cannot be defined per individual payee (e.g. merchant) or per channel (whether app or web interface)". An acquirer may let "certain predefined merchants" benefit from its exemption, but the rate is "calculated on the basis of the payee PSP's executed or acquired transactions, rather than on the merchant's transactions."

EBA Q&A 2018_4034 (published 11/10/2019), <https://www.eba.europa.eu/single-rule-book-qa/qna/view/publicId/2018_4034>

- "Yes, only the payment service provider (PSP) wishing to apply the transaction risk analysis (TRA) exemption should have fraud level below the reference fraud rates".
- "In the case where the fraud level of the acquirer is below the reference fraud rate but the issuer's fraud rate is above, the acquirer can decide whether to apply the TRA exemption or not."

EBA Q&A 2018_4035 (published 26/10/2018), <https://www.eba.europa.eu/single-rule-book-qa/qna/view/publicId/2018_4035>

- "Only the payer's and payee's PSP may make a decision of whether or not to apply the exemption and the payer's and payee's PSPs apply this exemption based on their own fraud rate."
- Where those PSPs contract with other entities (for example gateways), "the reference fraud rate remains the fraud rate of the payer's or payee's PSP respectively."

What this means for the book: the payer's provider holds the exemption for credit transfers, and for cards either the issuer or the acquirer holds it, each on its own rate, with the issuer deciding in the end. A company running a fraud challenger affects the exemption only if it is that provider. A gateway or merchant does not hold the exemption.

### 2. Business payers' refund and claim periods

PSD2, Directive (EU) 2015/2366, <https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32015L2366>

- Art. 61(1): "Where the payment service user is not a consumer, the payment service user and the payment service provider may agree that Article 62(1), Article 64(3), and Articles 72, 74, 76, 77, 80 and 89 do not apply in whole or in part. The payment service user and the payment service provider may also agree on time limits that are different from those laid down in Article 71." Article 71 itself cannot be disapplied; only its time limits can be changed.
- Art. 61(3): "Member States may provide that provisions in this Title are applied to microenterprises in the same way as to consumers."
- Art. 71(1): notification "no later than 13 months after the debit date".
- Art. 76(1), fourth subparagraph: "for direct debits as referred to in Article 1 of Regulation (EU) No 260/2012, the payer has an unconditional right to a refund within the time limits laid down in Article 77".
- Art. 77(1): a refund request "for a period of 8 weeks from the date on which the funds were debited".

EPC, SEPA Direct Debit Business-to-Business Scheme Rulebook, EPC222-07, 2025 version 1.0 (issued 28 November 2024, effective 05 October 2025), <https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-11/EPC222-07%202025%20SDD%20B2B%20Rulebook%20version%201.0.pdf>. The EPC site did not refuse automated access.

- Section 2.2: "A Debtor PSP cannot offer the Scheme to a Debtor who is a 'consumer'". "A Payment Service User may only use the Scheme as a Debtor, when he is authorised by national law to opt-out from the refund right in respect of authorised transactions contained in Articles 61(1) and 76(1) of the Payment Services Directive".
- Section 4.2: "The Debtor has no right to obtain a refund for an authorised transaction under the Scheme by request to the Debtor PSP." The section adds that the Debtor PSP "may return a Collection after Settlement up to three Inter-PSP Business Days after the Settlement Date ... or because the Debtor wishes to refuse the debit."
- Section 4.3.4: "Refunds are not provided for under the B2B Scheme."
- Section 4.4: "The concept of a refund is defined as a claim initiated by the Debtor after Settlement for reimbursement of a direct debit, but it is not part of the B2B Scheme."
- An annex lists the B2B scheme as "excluding the Debtor's right of refund for authorised direct debit transactions and stating that refunds for unauthorised transactions fall outside the scope of the B2B Scheme".

### 3. Safeguarding

PSD2 Art. 10(1), same URL as above: a payment institution must "safeguard all funds which have been received from the payment service users or through another payment service provider for the execution of payment transactions" in one of two ways. The first is (a): funds "shall not be commingled at any time with the funds of any natural or legal person other than payment service users". Funds still held "by the end of the business day following the day when the funds have been received" must be deposited in a separate account or invested in secure, liquid, low-risk assets, and insulated from other creditors. The second is (b): insurance or a comparable guarantee. Article 10 says nothing about reconciliation.

FCA PS25/12, "Changes to the safeguarding regime for payments and e-money firms", August 2025, instrument FCA 2025/38, <https://www.fca.org.uk/publication/policy/ps25-12.pdf>

- Commencement: "This instrument comes into force on 7 May 2026."
- 15.1.2R scope: "authorised payment institutions", "small payment institutions that voluntarily safeguard", "electronic money institutions", and "credit unions that issue electronic money".
- Glossary: "reconciliation day" means a UK business day, excluding weekends and bank holidays.
- 15.8.10R: an internal safeguarding reconciliation checks whether the "safeguarding resource was equal to its safeguarding requirement" and must "promptly identify and resolve any discrepancies".
- 15.8.19R: "must perform an internal safeguarding reconciliation as frequently as necessary and no less than once each reconciliation day."
- 15.8.42R: an external safeguarding reconciliation is due "as frequently as necessary and no less than once each reconciliation day".
- 15.8.50R: the institution "must determine the reason for the discrepancy" and ensure that "any shortfall is paid into a relevant funds bank account or invested in relevant assets as soon as possible and, in any case, by the end of the day on which the reconciliation is performed".
- 15.8.56R: discrepancies from an external reconciliation must be resolved "without undue delay", unless they arise "solely as a result of timing differences".
- 15.8.57R: an unresolved external discrepancy requires the institution to assume the record showing the greater requirement is accurate and to "pay its own funds" in.
- 15.8.8R(1): records must allow the institution "to determine the total amount of relevant funds it should be holding for each of its clients promptly and at any time".
- 15.8.60R: the institution "must inform the FCA in writing without delay if" any of the following applies: (1) its records are "materially out of date, inaccurate or invalid"; (2) it fails to do an internal reconciliation; (3) it "will be unable to, or materially fails to, pay any shortfall"; (4) and (5) external reconciliation failures; (6) "at any time in the preceding 12 months, the amount of relevant funds safeguarded was materially different from the total aggregate amount of relevant funds the safeguarding institution was required to safeguard".

What this means for the book: a fault on a new money path that misstates customer balances would make the safeguarding requirement wrong. CASS 15 gives the institution until the end of the same day to cover a shortfall, and requires notice to the FCA in the listed cases. This is the author's inference; the text does not mention software changes. The trial's stop condition, which allows a break one reconciliation cycle to be explained, therefore suffices for stopping the trial. It does not change the safeguarding deadline. I read the CASS 15 text in the PS25/12 instrument, not on the Handbook website, which is rendered client-side and returned an empty shell to curl.
