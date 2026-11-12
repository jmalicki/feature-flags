# Dutch supervisors (DNB and AFM) on production software change, data and models (2017-2026)

Scope: what De Nederlandsche Bank (DNB, prudential supervisor) and the Autoriteit Financiële Markten (AFM, conduct supervisor) have published on changing production software and models at banks, payment institutions, insurers, pension funds, investment firms and lenders. Research date: 11 November 2026. This file does not repeat the sibling notes. `eu_regulators_change_management.md` already quotes DNB's Good Practice Information Security 2019-2020 (control 10.1: segregation of duties, "ITIL, Agile, Scrum", fall-back scenario, CAB as example). `eu_regulators_data_and_models.md` already quotes the soundness section of DNB's 2019 SAFEST paper. Both are cited below only where this file adds page numbers or new text.

Reading-status tags:

- FULL-TEXT: I read the passage myself in text extracted locally (pdftotext) from the PDF, or from the HTML downloaded with curl. Quotations are exact.
- TOOL-EXTRACT: read through the fetch tool, which summarises. Wording quoted by the tool, not checked by me against the source.
- SNIPPET: search-result text only. A lead, not evidence. Not quoted.

Access note. dnb.nl returned HTTP 403 to curl even with a desktop Chrome user-agent and Accept/Accept-Language headers (tested on the home page and on a PDF link). DNB PDFs fetched with the fetch tool were saved as binary files by the tool. I extracted those locally, so they count as FULL-TEXT. DNB HTML pages could only be read through the fetch tool (TOOL-EXTRACT). afm.nl served all documents to curl. No mirrors or third-party copies were used.

Instrument types:

- Binding law: DORA (Regulation (EU) 2022/2554) and its RTS; MiFID II RTS 6 (Delegated Regulation (EU) 2017/589); the Dutch Wft (Financial Supervision Act) duty of "beheerste en integere bedrijfsvoering" (controlled and sound business operations).
- DNB Good Practices: DNB states they are not binding (quoted in question 1).
- AFM principles: AFM states they are "indicatief" (indicative) and firms may choose another way of working (quoted in question 5).
- Supervisory reports, thematic-review results, news items, licence-application guidance, conference slides and discussion papers: not binding. They show what the supervisor looks for.

## 1. DNB on ICT change management after 2020, the relation to DORA, and DNB as DORA supervisor

### Takeaway

DNB's last ICT good practice is the Good Practice Information Security 2023. Its change-management controls (10.1-10.4) keep the 2019/2020 line: changes follow a "standardized and controlled path", nobody requests, approves and implements a critical change alone, a fallback scenario is part of the impact analysis, and changes are tested before production. They add explicit DevOps language: shift-left security, a workflow system "from change request to implementation", separation of duties inside Agile, Scrum and DevOps teams, and "definition of done" as the agile test basis. The CAB is still listed only as a good-practice example. DNB announced on 11 July 2024 that DORA replaces this Good Practice from 17 January 2025 for DORA-scope institutions and that no updated version will follow. DNB says the Good Practice can still serve as a "wegwijzer" (signpost). I found no DNB-specific DORA Q&A or sector letter on ICT change management. DNB refers firms to the ESA/EIOPA Q&A.

### Cited Findings

DNB, "Good Practice Information Security 2023" (English version; Good Practice, not binding). FULL-TEXT. The PDF metadata title is "Good Practice Information Security 2023"; it has 96 landscape pages. Page numbers below are PDF page numbers. The Dutch original (`good-practice-ib-2023.pdf`, media/vskni24i) was not read; the English quotations are DNB's own translation. — [DNB GP IS 2023 (EN)](https://www.dnb.nl/media/13jpibjp/good-practice-ib-2023-eng.pdf); [Dutch original](https://www.dnb.nl/media/vskni24i/good-practice-ib-2023.pdf)

- Status (introduction, "Scope"/"Disclaimer", p. 5): "For this Good Practice, these are non-mandatory recommendations." DNB aims for institutions to take it into account "without being obliged to do so". "DNB Good Practices are indicative in nature".
- Reason for the update (introduction): the 2023 version incorporates the EIOPA ICT and cloud-outsourcing guidelines and cites the DORA proposal, which "will apply from January 17, 2025". It "is as close as possible to the classification of 'Good Practice Information Security 2019/2020'".
- Control 10.1 "Change standards and procedures", market standards (p. 56): "Changes, including security patches in ICT applications, ICT infrastructure, ICT processes and critical system settings follow a standardized and controlled path, are prioritized and evaluated."
- 10.1 (p. 56): "Changes to critical systems and infrastructure are not requested, approved and implemented by one and the same person (separation of duties)."
- 10.1 (p. 56): "The development, implementation, operation and/or configuration of the ICT systems take place in separate systems and are documented (audit trail)."
- 10.1 good practices (p. 56): "The change management process is based on international standards and practices, such as ITIL, Agile, Scrum, Devops." The 2019/2020 version listed "ITIL, Agile, Scrum"; "Devops" is new in 2023.
- 10.1 good practices (p. 56): "The institution works according to the shift left principle, which assumes that Agile, Scrum, Devops teams include application security in the earliest stages of system development."
- 10.1 good practices (p. 56): "The institution also uses a workflow system for Agile, Scrum and Devops that supports the entire process from change request to implementation, including logging and documentation."
- 10.1 good practices (p. 56): "The institution has applied separation of duties in its Agile, Scrum, Devops system development with regard to, for example, operations and control or development and security."
- 10.1 good practices (p. 56): "The impact analysis of a change takes into account a fallback scenario in case the change is not successful."
- 10.1 good practices (p. 56): "The institution has set up a Change Advisory Board (CAB) in which various disciplines such as business, ICT and ICT Risk/ICT Security make decisions about changes." Next item: those disciplines "are sufficiently and timely involved in decisions about changes." Also: the institution "reassesses the change management procedure annually."
- 10.1 good practices (p. 56): open-source libraries are "automated and checked for vulnerabilities before production"; automated scans and reviews of code against secure-coding guidelines.
- 10.2 "Impact assessment, prioritisation and authorisation" (p. 57): the institution prioritises "by means of a classification of the change (for example: standard, normal, urgent, immediate)."
- 10.2 (p. 57), emergency changes: "Urgent or short-term necessary ICT changes are traceable and are reported to the relevant owner of the ICT asset for subsequent analyses."
- 10.3 "Test environment" (p. 58): "Access to test and production ICT systems is strictly separated." "Test and production data are not mixed." "The institution does not use uncleaned production data in the test environment." Good practice: "The institution uses the DTAP models" and the test environment runs "the same" software version as production.
- 10.4 "Testing of changes", market standards (p. 59): "Changes in the ICT infrastructure and ICT applications are tested before they are put into use (production)." Tests follow "a test plan that also includes acceptance criteria for information security and ICT performance."
- 10.4 good practices (p. 59): system, user-acceptance, regression and integration tests; "In an agile working method, software is tested based on acceptance criteria (definition of done)." Also: "The institution has defined an authorization flow that states which persons are authorized to test."
- Elsewhere in the Good Practice (p. 34, and repeated on pp. 82, 91, 93), workflow tooling is said to enforce a "4-eye principle when adjusting critical ICT systems, system parameters or data". I did not check which element each later page belongs to.
- Term search of the whole English text: no "canary", "feature flag", "toggle", "continuous delivery", "CI/CD", "rollback" or "testing in production".

DNB, news item "DORA: 17 januari 2025 nadert sneller dan u denkt", published 11 July 2024 (news item). TOOL-EXTRACT. — [DNB, 11 July 2024](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2024/dora-17-januari-2025-nadert-sneller-dan-u-denkt/)

- "Vanaf 17 januari 2025 is DORA het wettelijke kader voor operationele weerbaarheid" ... "en vervangt daarmee de huidige Good Practice Informatiebeveiliging 2023" ... "voor de instellingen die onder de reikwijdte van DORA vallen." My translation: from 17 January 2025 DORA is the legal framework for operational resilience and thereby replaces the current Good Practice Information Security 2023 for institutions within DORA's scope.
- "U kunt de Good Practice Informatiebeveiliging 2023 als wegwijzer gebruiken" ... "om prioriteit te geven aan maatregelen die de belangrijkste risico's mitigeren." My translation: you can use the Good Practice as a signpost to prioritise measures that mitigate the most important risks.
- "DNB zal DORA als wettelijk kader hanteren bij toekomstige uitvragen en onderzoeken." My translation: DNB will use DORA as the legal framework in future information requests and examinations.
- For interpretation of DORA and its RTS/ITS, DNB refers firms "naar de Q&A op de website van EIOPA" (to the Q&A on EIOPA's website).

DNB, news item "DORA: het toezicht van DNB per 17 januari 2025", published 20 December 2024, updated 24 December 2024 (news item). TOOL-EXTRACT. — [DNB, 20 December 2024](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2024/dora-het-toezicht-van-dnb-per-17-januari-2025/)

- DORA "per 17 januari 2025 de huidige Good Practice Informatiebeveiliging 2023 vervangt"; "DNB zal dan ook geen geactualiseerde Good Practice uitbrengen." My translation: DNB will therefore not publish an updated Good Practice.
- "Over het algemeen geldt: DORA gaat als verordening voor op guidelines en opinies." My translation: as a rule, DORA as a regulation takes precedence over guidelines and opinions. The ESAs were to say which guidelines would be withdrawn or amended.
- "Onder DORA zullen de bestaande toezichtmethoden dan ook niet drastisch veranderen." And: "DORA heeft dus niet geleid tot een aanpassing in het handhavingsbeleid." My translation: existing supervisory methods will not change drastically; DORA has not led to a change in enforcement policy.
- The page links the joint AFM/DNB enforcement policy and EU texts. It links no DNB Q&A.

DNB, slides "Aandachtsgebieden IT-risicobeheersing per 17 januari 2025", Verzekeringsmiddag (insurers' event), 12 November 2024 (conference slides). FULL-TEXT. — [DNB slides](https://www.dnb.nl/media/afujirzt/breakout-dora.pdf)

- Slide p. 2: "DORA vervangt de DNB Good Practice Informatiebeveiliging". My translation: DORA replaces the DNB Good Practice Information Security.
- Slide p. 5: for the sector-wide information-security analysis (SBA-IB), DNB "hanteert ... nog eenmalig de huidige questionnaire en systematiek gebaseerd op de DNB Good Practice informatiebeveiliging." My translation: DNB uses the current questionnaire and method based on the Good Practice one last time.
- Slide p. 5: "DNB zal DORA als wettelijk kader hanteren bij toekomstige uitvragen en onderzoeken." The deck maps DORA Articles 5-13 to the Good Practice elements. It has no slide on change management.
- A search snippet says another DNB deck keeps the outsourcing good practice relevant for insurers outside DORA. SNIPPET only; not verified.

DNB, "Uitoefenen van het bedrijf van betaaldienstverlener" (explanatory notes to the licence application for payment service providers), with "DORA-update" banner; PDF created 3 February 2026 (licence guidance; not binding but sets what DNB expects to see in an application). FULL-TEXT. — [DNB licence notes, PSPs](https://www.dnb.nl/media/qp2jwwiy/toelichting-vergunning-betaaldienstverlener.pdf)

- p. 25, item l, among the information-security processes an applicant must describe: "Het proces en bijbehorende procedures voor het wijzigen van informatiesystemen, informatieinfrastructuur en de getroffen beveiligingsmaatregelen inclusief het doorvoeren van ongeplande wijzigingen op zeer korte termijn (zogenaamde emergency changes)." My translation: the process and procedures for changing information systems, infrastructure and security measures, including unplanned changes at very short notice ("emergency changes").
- p. 2: from 17 January 2025 DORA applies to ICT outsourcing; where the document sets ICT-outsourcing requirements, "dient de lezing vervangen te worden door de vereisten vanuit DORA" (they are to be read as replaced by DORA's requirements).
- On segregation of duties in small firms: "Het alleen toelichten dat functiescheiding lastig te organiseren is in een kleine organisatie volstaat niet." My translation: merely explaining that segregation of duties is hard to organise in a small organisation is not enough. DNB expects alternative measures, for example outsourcing.

Status of the earlier DNB Good Practice 2019/2020: superseded by the 2023 version (the 2023 introduction compares itself with it), and for DORA entities now replaced by DORA. A Dutch version exists. SNIPPET for the URL only. — [DNB GP IB 2019/2020 (NL)](https://www.dnb.nl/media/oabls2bx/good-practice-ib-2019-2020-nl.pdf)

### Inferences

- At the same level of detail as the other national supervisors in the essay, the Dutch position is: DNB's non-binding 2023 Good Practice named DevOps, shift-left, workflow tooling and separation of duties inside DevOps teams. It treated a CAB as one example, not a requirement. Since January 2025 DNB supervises ICT change under DORA and the RTS, not under its own text. This puts DNB with BaFin's cloud notice and the ACPR 2021 notice as a supervisor that accepts DevOps in principle. DNB says nothing on canaries or flags.
- The 2023 Good Practice supports two things the essay recommends: a fallback scenario in every change's impact analysis, and automated tooling that records the path "from change request to implementation". It constrains one thing: a critical change may not be requested, approved and implemented by one person. That matches DORA RTS Art. 17(1)(b).
- The "standard, normal, urgent, immediate" classification gives a Dutch anchor for pre-approved standard changes. The flag flip or ramp step as a standard change fits it, but DNB does not say so.
- The essay should date any DNB Good Practice citation: "2019-2024; replaced by DORA for DORA-scope firms from January 2025". It may still describe how DNB examiners were trained to look at change.

### Gaps

- No DNB DORA Q&A, sector letter or circular on ICT change management was found. DNB points to the ESA/EIOPA Q&A, which I did not search.
- The Dutch original of the 2023 Good Practice was not read; quotations use DNB's English version.
- Whether DNB withdrew the Good Practice for non-DORA institutions (for example some pension funds, smaller insurers or exempt payment institutions) was not found stated. The news items speak only of DORA-scope institutions.
- DNB's "Q&A Toetsingskader Informatiebeveiliging" (referenced in the AFM's Marktindrukken 2023, p. 15) and the DNB assessment framework questionnaire were not read.

## 2. DNB supervisory findings, priorities and change-caused incidents

### Takeaway

DNB's published findings on IT risk (banks and payment institutions in 2023, insurers in 2024) are about cyber hygiene, patching speed, end-of-life systems, identity and access management, testing scope and outsourcing chains. None is about release or change practice. Since DORA, Dutch financial institutions have reported on average 13 major ICT incidents a month. DNB names "human errors or cyberattacks" as example causes and does not single out changes. The only Dutch supervisory statement that traces incidents to IT changes comes from the AFM: errors in automated credit-acceptance systems, "often" traceable to changes in those systems, had by December 2023 forced remediation for more than 10,000 consumers (question 5). I found no DNB statement about a named bank or payment-institution outage caused by a change.

### Cited Findings

- DNB, "How effectively do banks and payment institutions manage cyber risk?", 8 June 2023 (thematic findings, news item). TOOL-EXTRACT. — [DNB, 8 June 2023](https://www.dnb.nl/en/sector-news/supervision-2023/how-effectively-do-banks-and-payment-institutions-manage-cyber-risk/)
  - Basic cyber hygiene "has remained static or even deteriorated in certain cases".
  - Patching: "a large number of banks and payment institutions take longer than two weeks to implement these after they are released."
  - Testing: "almost all banks and payment institutions perform security tests", but they are "often relatively limited in their frequency and do not cover all systems". Expectation: test "the security of their most critical systems at least annually".
  - "too often we see critical processes running on systems approaching – or at – their End-Of-Life (EOL)."
  - The page does not address change management.
- DNB, "Verzekeraars voldoen nog niet aan de lat voor de beheersing van operationele risico's", 29 November 2024 (thematic findings). TOOL-EXTRACT. — [DNB, 29 November 2024](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2024/verzekeraars-voldoen-nog-niet-aan-de-lat-voor-de-beheersing-van-operationele-risico-s/)
  - Almost half of Dutch insurers did not meet DNB's bar for operational-risk control in 2024: "bijna de helft van de verzekeraars in Nederland in 2024 nog niet voldoet".
  - 23% run critical systems "die niet langer door leveranciers worden voorzien van beveiligingsupdates" (no longer receiving vendor security updates).
  - "Een groot aantal verzekeraars heeft onvoldoende zicht en grip op haar kritieke uitbestedingsketens." My translation: many insurers lack sight and control of their critical outsourcing chains.
  - For 2025: risk-based DORA review focused on awareness, IT continuity, third-party ICT risk and the ICT risk-management cycle. No change-management finding.
- DNB, "Overzicht Financiële Stabiliteit – Najaar 2025" (Financial Stability Report, autumn 2025; PDF dated 14 November 2025). FULL-TEXT. p. 18: "Sinds de invoering van de Digital Operational Resilience Act (DORA) heeft de Nederlandse financiële sector per maand gemiddeld 13 ernstige ICT gerelateerde verstoringen van de dienstverlening gemeld". Next sentence: "Deze ICT-verstoringen kunnen meerdere oorzaken hebben, zoals menselijke fouten of cyberaanvallen." My translation: since DORA the Dutch financial sector has reported on average 13 major ICT-related service disruptions a month; these can have several causes, such as human error or cyberattacks. — [DNB OFS autumn 2025](https://www.dnb.nl/media/3t3ahvxa/83872_dnb_ia-ofs-najaar-2025_tg-ua.pdf)
- DNB supervisory priorities: a search snippet says DNB's "Visie op Toezicht 2025-2028" names geopolitical risk, technological innovation and cyber resilience as focus areas. SNIPPET only; the document was not read. — [DNB Toezicht in beeld 2025-2026](https://www.dnb.nl/media/24pdf2pu/toezicht-in-beeld-2025-2026.pdf)
- DNB news item, 2026, "Wijziging proces voor rapportage van ernstige ICT-gerelateerde incidenten" (change in DORA incident-report validation from April). SNIPPET only. — [DNB, 2026](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2026/q2/wijziging-proces-voor-rapportage-van-ernstige-ict-gerelateerde-incidenten/)
- Payment-system availability: the Maatschappelijk Overleg Betalingsverkeer (MOB, chaired by DNB) publishes yearly availability reports (for example 2023 and 2025). Search snippets mention PIN availability around 99.9% and iDEAL not always meeting the norm in 2023. SNIPPET only; not read, and no change-caused cause was found in the snippets. — [MOB report 2025](https://www.dnb.nl/media/yprfnzsx/jaarrapportage-2025-maatschappelijk-overleg-betalingsverkeer.pdf)

### Inferences

- The Netherlands has no published supervisory figure like the ECB's 38% of major incidents caused by IT change or Norway's statement that many incidents stem from poor change management. The essay should not imply one. DNB's 13-a-month figure covers all causes.
- The AFM's credit-acceptance incidents (question 5) are the Dutch change-caused-incident evidence. They concern conduct harm (over-lending) from configuration and data-mapping changes, not outages.

### Gaps

- No DNB statement attributing a named outage at a Dutch bank or payment institution to an IT change was found. Company sources (ING, ABN AMRO, Rabobank, Adyen, bunq, Worldline/equensWorldline) were not searched for change-caused outages.
- DNB's Toezicht in beeld 2024-2025 and 2025-2026 and the Visie op Toezicht 2025-2028 were not read.
- DNB's DORA incident statistics broken down by root cause (DORA's taxonomy includes "change management") were not found published.

## 3. DNB on agile and DevOps: risk management, three lines and change control

### Takeaway

I found no DNB thematic review, report or speech on agile or DevOps at banks or other institutions. DNB's only statements are the Good Practice items in question 1. The 2019/2020 version says a change process may be based on "ITIL, Agile, Scrum". The 2023 version adds DevOps and expects separation of duties inside Agile/Scrum/DevOps development (for example between development and security, or operations and control). Each 2023 control page carries the reminder "Pay attention to risk-based, outsourcing and the three lines model". The text sets out no specific second-line role in agile change approval.

### Cited Findings

- DNB GP IS 2023, control 10.1 good practices (p. 56): separation of duties "in its Agile, Scrum, Devops system development"; workflow system "from change request to implementation"; shift-left. FULL-TEXT (question 1). — [DNB GP IS 2023 (EN)](https://www.dnb.nl/media/13jpibjp/good-practice-ib-2023-eng.pdf)
- Same document, every control page (for example pp. 56-59): "Pay attention to risk-based, outsourcing and the three lines model". FULL-TEXT.
- Same document, 10.4 (p. 59): "In an agile working method, software is tested based on acceptance criteria (definition of done)." FULL-TEXT.
- DNB GP 2019/2020, control 10.1: "ITIL, Agile, Scrum". FULL-TEXT in the sibling note. — [DNB GP 2019-2020](https://www.dnb.nl/media/yffn1wji/good-practice-ib-2019-2020.pdf)
- DNB Supervisory Strategy 2021 says institutions must be "agile with regard to changing market conditions" to protect their business models. SNIPPET only, and about business strategy, not software delivery. — [DNB Supervisory Strategy 2021](https://www.dnb.nl/media/yjdgeqoy/supervisory_strategy_2021_v2.pdf)
- Not supervisory: the AFM's own 2025 annual report says the AFM works internally with "dataclusters en DevOps-teams" (p. 6 area; FULL-TEXT). This describes the AFM's own organisation and says nothing about supervised firms. — [AFM Jaarverslag 2025](https://www.afm.nl/~/profmedia/files/publicaties/2026/jaarverslag-2025/jaarverslag-2025.pdf)

### Inferences

- DNB is less detailed on agile than BaFin (CI/CD pipelines and automated tests as segregation-of-duties support) and about level with the ACPR 2021 notice (agile accepted, automation must not reduce control). The essay can put DNB alongside the ACPR, as a supervisor that named agile and DevOps as acceptable bases for change control, but gave no findings on how they work in practice.

### Gaps

- No DNB examination or publication on agile transformations at Dutch banks (several large Dutch banks adopted agile models from about 2015) was found. Searches in Dutch and English on dnb.nl returned nothing. If one exists, it was not indexed in the searches used.

## 4. DNB and AFM on models and data: SAFEST, the joint AI report, ML in algorithmic trading, data quality

### Takeaway

DNB's 2019 SAFEST discussion paper is still DNB's most specific text on AI model change. It expects documented "fail criteria" and criteria for significant change, retraining when input data change, archived training data, fall-back plans, and regular comparison of material AI models "against conventional (non-AI enabled) models". The 2024 joint AFM-DNB report says existing, "technology-agnostic" rules apply, firms can use existing model-risk frameworks, and AI needs regular validation and feedback loops. The AFM's 2023 study found machine learning in 80-100% of the trading algorithms of the Dutch proprietary traders it examined, retrained every few weeks to months. It asked when a retrained algorithm becomes a new algorithm, and said testing environments are not realistic enough. Its 2026 capital-markets paper asks for documentation of "model versioning, retraining history, objective-function changes, and intervention logs". On data, DNB's published work concerns the quality of prudential reports from investment firms and pension-fund data for the pension transition. I found no DNB text on BCBS 239 follow-up or on lineage for changed pipelines.

### Cited Findings

DNB, "General principles for the use of Artificial Intelligence in the financial sector" (SAFEST), discussion paper; PDF created 24 July 2019; comments invited until "18 October 2019" (p. 36). Not binding. FULL-TEXT (fetch-tool saved PDF, extracted locally). Page numbers are PDF pages. — [DNB SAFEST](https://www.dnb.nl/media/jkbip2jc/general-principles-for-the-use-of-artificial-intelligence-in-the-financial-sector.pdf)

- p. 34, soundness, Ad 1: "In case of malfunctioning AI systems, fall-back plans are available for core business processes to ensure continuity of operations and regulatory compliance."
- p. 34, Ad 2 (new relative to sibling note): "Where appropriate, boundaries are set to constrain model outcomes, serving either as floors/ceilings or as a mechanism to delegate further decision-making to a domain expert."
- p. 35, Ad 2: models "are periodically retrained, recalibrated and assessed, especially in the event of significant changes in the input data, relevant external factors, and/or in the legal or economic environment."
- p. 35, Ad 2: "Criteria for significant change as well as other fail criteria are well documented for each AI application, and become more stringent as the model's materiality increases."
- p. 35, Ad 3 (comparison with conventional models): "The correct workings of material AI applications is regularly assessed by evaluating model outcomes against conventional (non-AI enabled) models." Also: "Material AI enabled systems are designed with 'human-in-the-loop' and/or 'human-on-the-loop' review processes."
- p. 35, Ad 3 (new): "Consistency should be maintained, where reasonable, between models used for similar analyses (eg. between models used for loss estimates and models used for pricing)."
- p. 35, Ad 4 (data): "Original data sets used to (re)train and (re)calibrate models are systematically archived." Data issues "both in development and production, are evaluated and documented".
- p. 35, Ad 5: the AI policy applies equally "to both applications developed in-house as well as applications developed by third parties."
- Validation wording: SAFEST does not use "validation" for AI models in the soundness section. It speaks of assessment and the comparison above.

AFM and DNB, "The impact of AI on the financial sector and supervision" (joint report; English PDF hosted by the AFM, PDF created 5 June 2024; a DNB copy also exists). Not binding. FULL-TEXT. — [AFM copy](https://www.afm.nl/~/profmedia/files/rapporten/2024/ai-rapport-en.pdf); [DNB copy](https://www.dnb.nl/media/gepbbikm/ai.pdf); [DNB news item](https://www.dnb.nl/en/sector-news/supervision-2024/afm-and-dnb-publish-report-on-the-impact-of-ai-on-the-financial-sector-and-supervision/)

- Key messages (p. 2): "The objectives of supervision and the standards institutions are required to comply with are technology-agnostic, and apply just as well when AI is used."
- p. 13: "Institutions are accustomed to using models, and they can also use their existing model risk management frameworks for AI models."
- p. 16: "AI applications therefore need to be validated regularly, so that changes can be made promptly when risks of this kind occur."
- p. 17: "AI models should be enhanced using feedback loops. For example, the output can be monitored against standards and the results tested for identified risks."
- Algorithmic trading is cited as an existing example of AI-specific rules: systems and strategies "need to be tested thoroughly", with pre- and post-trade controls and real-time monitoring.
- Under the AI Act, "the existing financial regulators (i.e. the AFM and DNB in the Netherlands) will also take responsibility for monitoring compliance" where AI is used for financial services (p. 2).
- No mention of A/B tests, canaries or staged rollout of models.

AFM, "Machine Learning in Algorithmic Trading: Application by Dutch Proprietary Trading Firms and Possible Risks" ("Last updated at 28-09-2023"; study report). FULL-TEXT. — [AFM ML report](https://www.afm.nl/~/profmedia/files/rapporten/2023/report-machine-learning-trading-algorithms.pdf)

- p. 12: firms say machine learning "is implicitly or explicitly used in 80%-100% of their trading algorithms."
- p. 13: "Machine learning models are retrained periodically, ranging from weeks to months. Retraining a model could potentially change the way a trading algorithm responds to market conditions."
- p. 14: difficulty predicting behaviour "puts an increasingly large burden on trading firms to test their trading algorithms properly ... before deployment on the real markets."
- p. 15: the AFM's 2021 study "concluded that many testing environments at present are not sufficiently realistic".
- p. 17, discussion point: "At what point does an updated trading algorithm become a new algorithm? What if features are added or removed? What if a model is retrained?"

AFM, "AI in Capital Markets: Balancing Innovation and Integrity", analysis report, April 2026 (PDF created 8 April 2026). FULL-TEXT. — [AFM 2026 report](https://www.afm.nl/~/profmedia/files/rapporten/2026/ai-in-capital-markets-balancing-innovation-and-integrity.pdf)

- p. 21: "firms need to be able to evidence that integrity constraints remain effective after deployment and retraining." Documentation "should cover model versioning, retraining history, objective-function changes, and intervention logs."
- p. 21: regulators "should focus on context-aware monitoring of how these models behave in live execution".
- p. 15: "it will become increasingly important to carefully test models under different scenarios (as per MiFID II RTS 6 provision)".

Data quality (DNB):

- DNB, "Resultaten onderzoek datakwaliteit", 1 July 2024: six investment firms examined in Q1 2024, following a 2022 review (thematic findings). TOOL-EXTRACT. Findings include data quality and supervisory-report quality "niet inbegrepen in de (interne) auditplannen" (not included in internal audit plans), no documented data-quality requirements, and missing controls on manual data entry. — [DNB, 1 July 2024](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2024/resultaten-onderzoek-datakwaliteit/)
- DNB, "Good Practice Datakwaliteit gepubliceerd", 1 July 2024: good practices for FINREP/IFREP reporting by investment firms and fund managers; DNB "verwacht" firms to check whether they should adjust processes (Good Practice). TOOL-EXTRACT. The page mentions no lineage, system-change or BCBS 239 text. — [DNB, 1 July 2024](https://www.dnb.nl/nieuws-voor-de-sector/toezicht-2024/good-practice-datakwaliteit-gepubliceerd/)
- DNB pension-fund data-quality good practice for the transition to the new pension system (Wtp). SNIPPET only. — [DNB GP pension data quality](https://www.dnb.nl/voor-de-sector/open-boek-toezicht/sectoren/pensioenfondsen/verzamelpagina-transitie-wet-toekomst-pensioenen/implementatieplan/good-practice-besluitvorming-datakwaliteit-door-pensioenfondsen/)

### Inferences

- SAFEST's "criteria for significant change" and "fail criteria" that tighten with materiality are the Dutch text closest to automated rollout guardrails and abort criteria for models. Its comparison "against conventional (non-AI enabled) models" supports keeping the old model running alongside as a benchmark. It is a 2019 discussion paper. The essay should call it that and not "DNB guidance". The 2024 joint report did not restate these principles in detail.
- The AFM's question "when does a retrained algorithm become a new algorithm?" bears directly on the data/ML part of the essay. For trading algorithms under RTS 6, each retrain may be a change needing the RTS 6 testing and controlled-deployment steps. The AFM raised the question and did not answer it.
- Dutch supervisors say nothing on lineage or reconciliation for changed data pipelines. For banks, ECB texts (sibling notes) cover this. DNB's data-quality work is about report quality, audit coverage and manual-entry controls at smaller firms.

### Gaps

- No DNB model-risk-management guidance (for example for less significant banks or insurers' internal models) was found. For significant banks this is the ECB's remit.
- No DNB statement on BCBS 239 follow-up was found.
- DNB's 2024 thematic examination of AI at insurers (mentioned in the joint report per search snippet) was not found as a publication.
- The 2019 AFM-DNB paper on AI in the insurance sector ("Aandachtspunten AFM en DNB bij artificiële intelligentie in de verzekeringssector"), cited in the 2024 report, was not read.

## 5. AFM: change management, algorithm governance under RTS 6, consumer-facing automation and A/B testing

### Takeaway

The AFM has the most concrete Dutch text on software change. In July 2024 it published ten principles for IT change management at consumer and mortgage lenders. It did so after more and more incident reports of errors in automated credit checks, "often" traced to changes in those systems, which by December 2023 had required remediation for more than 10,000 consumers. The principles expect a four-eyes approval, separated development/test/production, regression and acceptance tests, direct monitoring after go-live (with data analytics where possible), a fall-back plan (including running a new system in parallel with the old one), logging, prompt incident reporting and control over vendors' changes. For algorithmic trading, the AFM's RTS 6 reviews stress realistic testing before deployment, a firm-wide definition of a "trading algorithm", segregation of tasks in development and deployment, and that "merely having a kill functionality is not enough". The AFM has observed banks and insurers running A/B tests on customers that last "only a few days" with changes pushed live once a significant difference appears. It names the risk of careless methods but does not object to A/B testing.

### Cited Findings

AFM, "Changemanagement en het risico op overkreditering: Tien principes en zeven voorbeelden", 3 July 2024 (principles; indicative, not binding). FULL-TEXT. PDF page numbers. — [AFM principles 2024](https://www.afm.nl/~/profmedia/files/rapporten/2024/changemanagement-overkreditering.pdf); [AFM news item](https://www.afm.nl/en/sector/actueel/2024/juli/changemanagement-kredietverstrekking)

- p. 3, trigger: "De AFM ontvangt steeds vaker incidentmeldingen van kredietaanbieders over fouten in geautomatiseerde kredietacceptatieprocessen." My translation: the AFM increasingly receives incident reports from lenders about errors in automated credit-acceptance processes.
- p. 3, balance: automation can even reduce individual assessment errors, but "hebben wij zorgen bij de effectiviteit van huidige changemanagementprocessen om dergelijke impactvolle fouten op te sporen of te voorkomen." My translation: we have concerns about how effective current change processes are at detecting or preventing such high-impact errors.
- p. 3, legal basis: the Wft duty of controlled and sound operations; the AFM holds that process and IT errors that can lead to over-lending must be reported as incidents.
- p. 4: "Kredietverleners die geen bank zijn blijven buiten de scope van DORA." My translation: lenders that are not banks remain outside DORA's scope. The principles therefore fill a gap for non-bank lenders.
- p. 4, status: the principles "zijn indicatief voor de verwachtingen die de AFM heeft van een gedegen changemanagement". And: "Het is aan de kredietaanbieders zelf om te besluiten dat een andere werkwijze dan wordt voorgesteld in de principes beter past". My translation: they indicate what the AFM expects of sound change management; lenders may decide that another way of working fits them better.
- p. 4, purpose: an effective process can ensure that unintended consequences "ook snel worden opgespoord, beperkt en hersteld" (are also quickly detected, contained and repaired).
- The ten principles (p. 4): 1 clear process agreements; 2 identify and prioritise the change in time; 3 map the change's risks; 4 test the change beforehand; 5 monitor deviations directly after the change; 6 have a fall-back plan; 7 document the change; 8 report incidents to the AFM; 9 monitor continuously and make it easy to raise errors; 10 keep control of changes in outsourced systems.
- p. 5, principle 1: "Het 4-ogen principe: voor het doorvoeren van een change dienen minimaal twee personen goedkeuring te geven." My translation: four-eyes principle: at least two people must approve before a change is made. Good practice: an extra formal sign-off at go/no-go points by an accountable manager.
- p. 6, principle 3 good practice: for recurring changes a firm "kan worden teruggevallen op de uitkomsten van reeds uitgevoerde assessments" (may rely on earlier assessments), checking that it really is a recurring change.
- p. 6, principle 4: "De AFM constateert dat aan de basis van een incident doorgaans een onvolledig testplan ligt." My translation: the AFM finds that an incomplete test plan usually lies at the root of an incident. Development, testing and production "vinden in gescheiden systemen plaats" (take place in separate systems); regression and user-acceptance tests; test personas.
- p. 6, principle 4 good practices: test a credit-check change in several places, for example "een parallel rekenprogramma dat onafhankelijk wordt bijgewerkt" (an independently maintained parallel calculation program); use historical real customer files close to the maximum credit limit as test cases.
- p. 7, principle 5: "maak waar mogelijk gebruik van data-analytics om afwijkingen geautomatiseerd te monitoren." My translation: where possible use data analytics to monitor deviations automatically. Good practice: check the first new loans by hand ("met eigen ogen").
- p. 7, principle 6: "Bepaal of een nieuw of aangepast IT-systeem parallel naast het oude systeem gebruikt kan worden als uitwijkmogelijkheid." My translation: determine whether a new or changed system can run in parallel with the old one as a fallback. A temporary manual process is another option.
- p. 7, principle 6 good practice: falling back to old lending norms can itself cause over-lending; "Het is dan beter om orders aan te houden tot de fout is hersteld". My translation: it is then better to hold orders until the error is fixed.
- p. 7, principle 7: logs, and "een workflow- of ticket-systeem" for controlled handover and recording.
- p. 8, principle 9 good practice: automatic alerts on trend breaks at portfolio level, for example when all applications in a period are accepted although that is unusual. Also: separate the functions of acceptance and control.
- p. 8, principle 10: the lender stays responsible when systems are outsourced, including intra-group; agree timely notice of changes, sight of the vendor's impact assessment, and fallback options.
- p. 9, seven anonymised incidents, including: a configuration table changed from 2% to 0%; a webshop rebuild that broke the call to the credit check so "elke consument een krediet kan afsluiten" (every consumer could take out credit); a changed external data source no longer parsed; a data-mapping change that swapped two fields; and a data migration that doubled credit limits where "De technische test leidt niet tot fouten en een functionele test wordt niet uitgevoerd" (the technical test passed and no functional test was run).

AFM, news item "Kredietaanbieders moeten alert zijn op fouten in geautomatiseerde acceptatieprocessen", 6 December 2023. FULL-TEXT (HTML via curl). — [AFM, 6 December 2023](https://www.afm.nl/en/sector/actueel/2023/december/kredietaanbieders-acceptatieprocessen)

- "Inmiddels hebben kredietaanbieders al bij ruim 10.000 consumenten met een lening of hypotheek herstelmaatregelen moeten treffen." My translation: lenders have already had to take remedial measures for more than 10,000 consumers with a loan or mortgage.
- "De meldingen zijn vaak terug te leiden tot aanpassingen in de IT-systemen rondom de kredietwaardigheidstoets." My translation: the reports can often be traced to changes in the IT systems around the creditworthiness check.
- "Tegelijkertijd zien wij ook dat kredietaanbieders effectiever zijn geworden in het vroegtijdig opsporen van fouten". My translation: at the same time lenders have become more effective at detecting errors early.

AFM follow-up:

- AFM Agenda 2025, p. 15: "heeft de AFM in 2024 tien principes opgesteld voor IT-change management. In 2025 geven we hier opvolging aan met een assessment waarin aanbieders hun IT-change management toetsen aan de gepubliceerde principes." My translation: in 2025 lenders assess their IT change management against the principles. FULL-TEXT. — [AFM Agenda 2025](https://www.afm.nl/~/profmedia/files/publicaties/2025/agenda-2025/afm-agenda-2025nl.pdf)
- AFM Jaarverslag 2025, p. 6: "We onderzochten technologische trends en IT-changemanagement in kredietverlening". FULL-TEXT. No results of the assessment are given there. — [AFM Jaarverslag 2025](https://www.afm.nl/~/profmedia/files/publicaties/2026/jaarverslag-2025/jaarverslag-2025.pdf)

Other AFM change and IT-control texts:

- AFM, "Principles for Information Security", December 2019 (principles for AFM-supervised firms). FULL-TEXT. p. 10, principle 6 "Processes": "Changes in the firm and the IT infrastructure are implemented in such a way that information risks are reduced to an acceptable level in accordance with policy and risk appetite." — [AFM principles 2019](https://www.afm.nl/~/profmedia/files/publicaties/2019/principes-informatiebeveiliging-en.pdf)
- AFM, "Marktindrukken 2023" (market impressions; thematic review of 22 financial service providers' information security). FULL-TEXT. p. 15: "procedures en standaarden voor changemanagement voorhanden zijn. Behalve bij testen, worden alle stappen van wijzigingsbeheer adequaat beoordeeld." My translation: change-management procedures and standards exist; all change steps except testing are adequately assessed. Also: "Changemanagement en data-integriteit beschouwt slechts een klein aantal ondernemingen als een hoog risico." My translation: only a few firms regard change management and data integrity as high risk. — [AFM Marktindrukken 2023](https://www.afm.nl/~/profmedia/files/rapporten/2023/marktindrukken-2023.pdf)
- AFM, "SREP Marktbeeld" for investment firms, 2024. FULL-TEXT. Investment firms find "het testen van hun digitale operationele weerbaarheid en het testen van het Business Continuity Plan" hard. No change-management finding. — [AFM SREP Marktbeeld 2024](https://www.afm.nl/~/profmedia/files/nieuws/2024/srep-marktbeeldneddef.pdf)

Algorithmic trading under RTS 6 (binding Delegated Regulation (EU) 2017/589; AFM reports are supervisory findings):

- AFM, "Algorithmic trading – governance and controls", project report, "Publication date: 02 April 2021". FULL-TEXT. PDF pages. — [AFM 2021 report](https://www.afm.nl/~/profmedia/files/rapporten/2021/algo-2020-publication-findings-expectations-rts6-rts7.pdf?la=nl-NL)
  - p. 9 (Art. 1): "The AFM encourages firms to continue to clearly lay down an organisational structure for the development, deployment and subsequent updates of trading algorithms, thereby ensuring a sound segregation of tasks and responsibilities."
  - p. 9 (Art. 2, kill switch): most proprietary traders' compliance staff "either have direct access to the kill functionality or are in contact with other staff who have access to it. Merely having a kill functionality is not enough to comply with this article."
  - p. 12 (Arts. 5, 7, 8, 11): "The AFM encourages firms to define what is considered one trading algorithm and apply the definition consistently throughout the development/testing/deployment cycle."
  - p. 12: "The AFM expects firms to have an interpretation of 'disorderly trading conditions' as it will allow for testing this requirement explicitly."
  - p. 19 (venues, RTS 7 Art. 10): the AFM expects venues "to require their members to certify that an algorithm, a new strategy, or an updated algorithm has been tested to avoid contributing to or creating disorderly trading conditions prior to the deployment."
  - p. 19: "trading venues have difficulty creating simulation facilities which reproduce the production environment, including disorderly trading conditions, as realistically as possible."
  - Introduction: "failure of emergency controls like the kill-functionality" is listed among real-life examples of controls failing.
  - Main findings: the AFM expects the RTS 6 self-assessment and validation report to be "signed off on by senior management" in a yearly review cycle.
- AFM, "2019 Analysis AFM – self assessments RTS6" (slides). FULL-TEXT, but only headings: lists Arts. 5-8 (testing and "Controlled deployment of algorithms"), 11 ("Management of material changes"), 12 ("Kill functionality") and 16 ("Real-time monitoring"). — [AFM 2019 analysis](https://www.afm.nl/~/profmedia/files/onderwerpen/mifid-ii/rts6-analyse-2019.ashx)
- AFM, "Market Watch #8: Algorithmic Trading", March 2023. FULL-TEXT. p. 6: "At present, the testing environments used do not necessarily enable measuring market impact and/or interaction between trading algorithms." The AFM welcomes ESMA's proposal for "a principle-based testing regime". It "has observed cases in which trading algorithms do not behave as intended by the developers", for example an HFT market maker's algorithm reacting to its own orders. — [AFM Market Watch 8](https://www.afm.nl/~/profmedia/files/onderwerpen/afm-market-watch/market-watch-8-algoritme-handel.pdf)
- AFM, "Implementatie pre-trade controls verschilt en is niet eenduidig ingeregeld", 23 July 2025 (ESMA common supervisory action; AFM reviewed four proprietary traders). FULL-TEXT (HTML via curl). "Als de handelsafdeling een aanpassing wil in deze controles, dan beoordeelt de risicobeheerafdeling of dat binnen de afgesproken risico's van het bedrijf past." "De handelaren kunnen deze limieten niet zomaar zelf verhogen." My translation: if the trading desk wants a change to these controls, risk management assesses whether it fits agreed risk; traders cannot simply raise the limits themselves. — [AFM, 23 July 2025](https://www.afm.nl/en/sector/actueel/2025/juli/sb-pre-control-trade)

Consumer experiments and A/B testing:

- AFM, "Verkenning naar de toepassing van consumentengedragsinzichten door banken en verzekeraars", June 2025 (exploratory supervisory report). FULL-TEXT.
  - p. 12: "Veel ondernemingen werken met korte iteraties om hun online keuzeomgevingen te optimaliseren. Zo worden er bijvoorbeeld A/B-testen uitgevoerd die slechts enkele dagen lopen." My translation: many firms work in short iterations to optimise their online choice environments; for example, A/B tests run for only a few days.
  - p. 12: "Zodra er een statistisch significant verschil wordt vastgesteld, worden de wijzigingen direct doorgevoerd." My translation: as soon as a statistically significant difference is found, the changes are rolled out immediately.
  - p. 12, the AFM's view: the approach lets changes be made quickly and efficiently, but "wanneer methoden onzorgvuldig worden toegepast of resultaten verkeerd worden geïnterpreteerd, kunnen veranderingen worden doorgevoerd die achteraf toch niet effectief blijken te zijn." My translation: when methods are applied carelessly or results misread, changes may be rolled out that later prove ineffective.
  - pp. 12-14: worked examples from firms of A/B tests on customers (savings nudges in an app, investment emails, letters offering help to customers with arrears).
  - The AFM's questionnaire asked whether firms run "experimenten en A/B-testen" to check that behavioural interventions lead to sensible choices. The AFM treats this as good evidence practice.
  - Source: [AFM June 2025](https://www.afm.nl/~/profmedia/files/rapporten/2025/rapport-verkenning-toepassing-gedragsinzichten-banken-verzekeraars.pdf)
- The AFM has itself run randomised A/B field experiments with firms. Examples are a 2017 test with Telfort on pre-filled income fields and a credit-warning test. It has also published a brochure on running a reliable behavioural experiment. SNIPPET only. — [AFM Telfort report](https://www.afm.nl/~/profmedia/files/rapporten/2018/telecom-vooraf-ingevulde-waarden.pdf?la=nl-nl); [AFM brochure](https://www.afm.nl/~/profmedia/files/x-oud/brochures/2017/betrouwbaar-gedragsexperiment.pdf)

### Inferences

- The AFM 2024 principles are the Dutch text that best fits the essay, and they cut both ways:
  - They support it. "Monitor afwijkingen direct na de change" (monitor deviations directly after the change), automated monitoring with data analytics, checking the first live loans by hand, trend-break alerts, a fall-back plan, and running new and old systems "parallel" are exactly the essay's ramp, watch and roll back pattern. The purpose stated on p. 4 (detect, contain and repair quickly) is the essay's argument in supervisory words.
  - They constrain it. Four-eyes approval before a change, separated development/test/production, and a test plan before go-live are expected. Principle 6's good practice warns that rolling back can itself harm customers (reverting to old lending norms), and that holding transactions may be safer. That is a point the essay should make about rollback of decision logic.
  - The incident list shows small configuration and data-mapping changes doing large harm, and one case where the technical test passed and no functional test was run. This supports the essay's data-change section: a technically valid change can still be wrong.
- The AFM is the one Dutch supervisor that has described A/B testing on customers as an observed practice. It did not object to the method. It warned about statistical carelessness. Any essay claim that Dutch supervisors are hostile to customer experiments would be wrong. Any claim that they endorse them would also be wrong.
- For trading algorithms, "Merely having a kill functionality is not enough" and the call to define "one trading algorithm" across development, testing and deployment are the AFM's two most quotable points for the essay's kill-switch and versioning arguments.

### Gaps

- The results of the AFM's 2025 assessment of lenders against the ten principles were not found published.
- The AFM's 2021 "Principes voor de keuzeomgeving" (choice-architecture principles) were not read for text on experiments.
- No AFM text on AI-driven automated decision-making toward consumers beyond the joint 2024 report was read (for example any AFM work on algorithmic credit scoring or insurance pricing after 2024).

## 6. Dutch supervisor statements on canary releases, feature flags, continuous delivery, testing in production or frequent release

### Takeaway

None found. A term search across every DNB and AFM document I read returned no "canary", "feature flag", "toggle", "continuous delivery", "continuous deployment", "CI/CD", "dark launch", "blue-green", "testing in production" or "rollback". The closest Dutch material is: DNB's 2023 acceptance of DevOps with workflow tooling and separation of duties; the AFM's 2024 lender principles on monitoring deviations right after go-live, parallel running and fall-back plans; and the AFM's 2025 description, without objection, of A/B tests on customers that run a few days before changes go live.

### Cited Findings

- Term search, FULL-TEXT documents: DNB GP IS 2023 (EN), DNB SAFEST 2019, DNB DORA slides 2024, DNB OFS autumn 2025, DNB PSP licence notes 2026, AFM RTS 6 reports 2019 and 2021, AFM Market Watch 8 (2023), AFM ML report 2023, AFM-DNB AI report 2024, AFM change-management principles 2024, AFM Agenda 2025, AFM Jaarverslag 2025, AFM Marktindrukken 2023, AFM SREP Marktbeeld 2024, AFM principles for information security 2019, AFM behavioural-insights report 2025, AFM AI in capital markets 2026. Zero hits for the terms listed above. ("Pilot" and "gefaseerd" appear only in unrelated contexts: product pilots, phased pension transition.)
- Closest positive statements:
  - DNB GP IS 2023, 10.1: "ITIL, Agile, Scrum, Devops" and the workflow system "from change request to implementation". FULL-TEXT. — [DNB GP IS 2023 (EN)](https://www.dnb.nl/media/13jpibjp/good-practice-ib-2023-eng.pdf)
  - AFM 2024 principles 5 and 6: monitor directly after the change; automated monitoring; run the new system "parallel naast het oude systeem". FULL-TEXT. — [AFM principles 2024](https://www.afm.nl/~/profmedia/files/rapporten/2024/changemanagement-overkreditering.pdf)
  - AFM 2025: A/B tests "die slechts enkele dagen lopen", then changes "direct doorgevoerd". FULL-TEXT. — [AFM June 2025](https://www.afm.nl/~/profmedia/files/rapporten/2025/rapport-verkenning-toepassing-gedragsinzichten-banken-verzekeraars.pdf)
- Closest constraining statements:
  - DNB GP IS 2023, 10.4: changes "are tested before they are put into use (production)"; 10.3: test and production "strictly separated". FULL-TEXT.
  - AFM 2024 principle 1: at least two approvers before a change; principle 4: a test plan, separated environments. FULL-TEXT.
  - AFM 2021 RTS 6 report: venues should have members certify that an updated algorithm was tested "prior to the deployment". FULL-TEXT. — [AFM 2021 report](https://www.afm.nl/~/profmedia/files/rapporten/2021/algo-2020-publication-findings-expectations-rts6-rts7.pdf?la=nl-NL)

### Inferences

- Dutch material is silent on the essay's specific techniques. It supports their purpose: fast detection and containment after go-live, parallel running, fall-back plans and automated monitoring. It constrains the essay where every other European text does: separated environments, pre-production testing, and approval by someone other than the implementer.
- At the level of detail the essay gives other national supervisors, the Netherlands merits about three sentences:
  1. DNB's non-binding 2023 Good Practice accepted DevOps with separation of duties and listed a CAB only as an example, and DORA replaced it in January 2025.
  2. The AFM's 2024 principles for lenders, prompted by change-caused errors affecting more than 10,000 consumers, ask for monitoring directly after go-live, parallel running and a fall-back plan alongside four-eyes approval and pre-release testing.
  3. The AFM has described few-day A/B tests on bank and insurance customers without objecting to the method.

### Gaps

- No Dutch supervisor statement on canaries, feature flags, continuous delivery or testing in production, positive or negative, was found.
- DNB HTML pages could be read only through the summarising fetch tool. A DNB statement on these topics on an unindexed dnb.nl page cannot be ruled out.
