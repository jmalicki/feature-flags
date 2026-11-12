# Continental European regulators on changing risk-data pipelines and production models (2013-2026)

Scope note: this file covers EU, euro-area and selected national (Germany, Netherlands, France, Italy, Switzerland) rules on changing risk-data pipelines and production models in banks, payment institutions and other financial firms. US SR 26-2 and UK PRA SS1/23 are in `ml_model_rollout.md` and are not repeated here. Research date: 11 November 2026.

Verification labels:

- FULL-TEXT: I downloaded the PDF or EUR-Lex HTML with curl (or, for DNB, through the fetch tool's saved PDF), converted it to text, and searched it myself. Quotations are exact and under 40 words.
- TOOL-EXTRACT: read through a fetch tool that summarises the page. Not used for any quotation below.
- SNIPPET: search-result summary only. No quotations; verify before use.

Legal-status key used throughout:

| Instrument type | Binding? | Examples below |
| --- | --- | --- |
| EU regulation (level 1) | Binding, directly applicable | CRR 575/2013, AI Act 2024/1689, Digital Omnibus on AI 2026/1744, GDPR, DORA 2022/2554 |
| EU directive | Binding once transposed | Consumer Credit Directive (EU) 2023/2225 |
| Commission delegated regulation (RTS) | Binding, directly applicable | 529/2014 (IRB model changes), 2018/389 (PSD2 SCA RTS), 2024/1774 (DORA ICT risk RTS) |
| EBA guidelines | Comply-or-explain for competent authorities and firms | EBA/GL/2020/06 loan origination |
| EBA reports, discussion papers, Q&As | Not binding; Q&As are interpretive | EBA/REP/2020/01, EBA/REP/2023/28 |
| ECB guides | Not binding law; explain how the ECB reads the law for significant institutions it supervises directly | ECB RDARR guide (May 2024), ECB guide to internal models (v4.1, June 2026) |
| National supervisory circulars and principles | MaRisk is binding administrative practice in Germany; BaFin principles, DNB, ACPR papers are non-binding; FINMA guidance states supervisory observations | BaFin MaRisk, BaFin BDAI principles, DNB SAFEST, ACPR 2020, FINMA 08/2024 |
| International standards | Not binding until implemented | BCBS 239 |

---

## 1. Data lineage and data changes: BCBS 239, the ECB RDARR guide, and ECB follow-up

### Takeaway

BCBS 239 (January 2013) and the ECB's May 2024 RDARR guide both treat a change to data flows as a governed event. BCBS 239 says risk data aggregation must be "considered as part of" IT change initiatives. The ECB guide goes further. It expects a central data governance function to take part in change management that has a material impact on RDARR, and it expects attribute-level lineage "starting from data capture and including extraction, transformation and loading". It also expects automated data-quality controls from source systems to reports, and periodic reconciliation. Neither text says how to deploy a pipeline change. Neither mentions running old and new tables side by side, parallel runs of data pipelines, or rollback. They require the evidence a dual-write or parallel-table migration produces: reconciliation of old against new, lineage kept current, and data-quality indicators with tolerances. The ECB says this is still the weakest area. RDARR was "the worst-rated sub-category of internal governance in the 2023 SREP cycle". The 2026-2028 priorities report "no improvement" in the 2025 SREP sub-score.

### Cited Findings

BCBS 239, "Principles for effective risk data aggregation and risk reporting", Basel Committee, January 2013. FULL-TEXT. International standard. Mandatory for G-SIBs designated in 2011/2012 "by January 2016" (para 14). The Committee "strongly suggested" that supervisors also apply it to D-SIBs (para 15). It is not EU law, but the ECB guide applies it to significant institutions. Source: [BIS PDF](https://www.bis.org/publications/201301-guidelines-principles-effective-risk-data-aggregation-and-risk-reporting.pdf).

- Para 29(b) (Principle 1, Governance): risk data aggregation capabilities should be "Considered as part of any new initiatives, including acquisitions and/or divestitures, new product development, as well as broader process and IT change initiatives."
- Principle 2 (Data architecture and IT infrastructure), para 33: banks should establish "integrated data taxonomies and architecture across the banking group, which includes information on the characteristics of the data (metadata)".
- Para 33, footnote 16: banks do not need one data model; "rather, there should be robust automated reconciliation procedures where multiple models are in use." This is the closest BCBS text to running two schemas side by side. It allows multiple models if reconciliation is automated.
- Principle 3 (Accuracy and Integrity), headline: data "should be aggregated on a largely automated basis so as to minimise the probability of errors."
- Para 36(c): "Risk data should be reconciled with bank's sources, including accounting data where appropriate". Footnote 17 defines reconciliation as "the process of comparing items or outcomes and explaining the differences."
- Para 37: as a precondition, a bank should have a "dictionary" of the concepts used, so that data is defined consistently.
- Principle 6 (Adaptability), para 49(c) and (d): adaptability includes "Capabilities to incorporate new developments on the organisation of the business" and "Capabilities to incorporate changes in the regulatory framework."
- Glossary: adaptability is "The ability of risk data aggregation capabilities to change (or be changed) in response to changed circumstances (internal or external)."

ECB, "Guide on effective risk data aggregation and risk reporting", May 2024. FULL-TEXT. ECB guide (not binding). Addressed to significant institutions directly supervised by the ECB. The guide says it "does not impose new requirements" and sets "minimum supervisory expectations" based on CRD as transposed. Source: [ECB PDF](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides240503_riskreporting.en.pdf).

- Background:
  - The 2016 thematic review of 25 significant institutions included "a 'data lineage' exercise for credit risk". It found that none of the sampled institutions "had fully followed the BCBS 239 principles."
  - Footnote 7 records "Large-scale miscalculations of key risk ratios and limits... caused by reconciliation errors, extensive manual adjustments, inconsistent or incomplete underlying data". It also records "production times of 40 or more working days" for monthly risk reports.
  - Footnote 9: RDARR "was the worst-rated sub-category of internal governance in the 2023 SREP cycle".
- Scope (Section 3.2, point 2): the scope should include Pillar 1 models (IRB), Pillar 2 models and other key models (IFRS 9, VaR). It covers "input data for model development as well as resulting model outputs (e.g. exposure at default, probability of default or loss-give-default estimates)". So the data feeding ML or IRB models is in scope.
- Change management (Section 3.3, point 2): a central data governance function is responsible for "participating in change management processes with a material impact on RDARR". Named triggers include "the launch of new tools, upgrades of existing tools and other IT change initiatives."
- Validation (Section 3.3, point 3): an independent second-line validation function should assess all RDARR components, "(e.g. IT infrastructure, data lineage and data taxonomy), including the oversight of outsourced functions, IT change initiatives".
- Lineage (Section 3.4, point 3): data taxonomies should include "complete and up-to-date data lineages on data attribute level (starting from data capture and including extraction, transformation and loading)" for the risk indicators and their critical data elements.
- Lineage purpose (footnote 23): lineage lets a bank "ensure that when data fields are loaded or transformed across or within systems they are still in line with the reporting requirements and definitions". It also lets the bank, "in case of data quality incidents be able to track back the source of the issue in a timely manner".
- Footnote 24 says data attributes are "often stored as a column in a table". This is the column-level granularity a column migration touches.
- Controls (Section 3.5, point 1): "data quality controls (covering, at least, the dimensions of accuracy and integrity, completeness and timeliness) from front office systems... to the reporting layer". These should be "automated where appropriate". Point 1 also requires "periodical reconciliation with institutions' sources and reports... and related model development data."
- Section 3.5, point 2: data quality indicators must have "tolerance levels and robust correction processes" and "documented operational processes in case of breaches".
- Section 3.5, point 5: manual workarounds must be controlled, including "rigorous documentation and audit trailing of changes, data overrides and sign-offs", until steps are "embedded in an audit-trailed IT-controlled environment".
- Implementation programmes (Section 4): these "should consider their potential effect on (i) internal models".
- Annex: the guide cites the EBA ICT guidelines (EBA/GL/2019/04), which define ICT risk to include "inability to change IT within a reasonable time and with reasonable costs when the environment or business requirements change (i.e. agility)". The guide notes that those guidelines cover "ICT project and change management".
- A search of the guide found no text on parallel runs of pipelines, dual-running tables, blue/green data releases or rollback.

ECB follow-up statements:

- ECB Banking Supervision, "Supervisory priorities for 2026-2028" (published November 2025). FULL-TEXT.
  - Banks should "effectively and timely remedy material weaknesses identified in their RDARR frameworks".
  - "The SREP 2025 outcomes point to persistent deficiencies in banks' RDARR frameworks, with no improvement in the relevant average sub-score".
  - In December 2024 the Supervisory Board approved "a system-wide strategy, covering all supervised entities". Targeted on-site inspections will follow.
  - Source: [ECB priorities](https://www.bankingsupervision.europa.eu/framework/priorities/html/ssm.supervisory_priorities202511.en.html)
- The 2019 letter from the SSM Supervisory Board Chair to all significant institutions on RDARR is referenced in the guide (footnote 8, June 2019). I did not read the letter itself.

German national rule (binding for German banks, including less significant institutions): BaFin Circular 06/2024 (BA), MaRisk, AT 4.3.4 and AT 8.2. FULL-TEXT (text only; the explanatory notes are not in the PDF read). AT 4.3.4 applies to significant institutions. AT 7.2 and AT 8.2 apply to all institutions. Source: [Bundesbank copy of Rundschreiben 06/2024](https://bundesbank.de/resource/blob/932738/fa6ddd3636c40c9f9d5cb4fad4f07121/mL/2024-05-29-rundschreiben-data.pdf).

- AT 4.3.4 Tz. 4, original: "Die Risikodaten sind mit anderen im Institut vorhandenen Informationen abzugleichen und zu plausibilisieren." Translation: "Risk data are to be reconciled and plausibility-checked against other information available in the institution."
- AT 4.3.4 Tz. 2, original: "Bei unterschiedlichen Namenskonventionen und Kennzeichnungen hat das Institut sicherzustellen, dass Daten automatisiert ineinander überleitbar sind." Translation: "Where naming conventions and labels differ, the institution must ensure that data can be automatically mapped into one another."
- AT 7.2 Tz. 3, original: "Die IT-Systeme sind vor ihrem erstmaligen Einsatz und nach wesentlichen Veränderungen zu testen und von den fachlich sowie auch von den technisch zuständigen Mitarbeitern abzunehmen." Translation: "IT systems are to be tested before first use and after material changes, and accepted by both the business and the technical staff responsible."
- AT 7.2 Tz. 3 continues: "Produktions- und Testumgebung sind dabei grundsätzlich voneinander zu trennen." Translation: "Production and test environments are in principle to be kept separate."
- AT 8.2 Tz. 1, original: before material changes "in den IT-Systemen hat das Institut die Auswirkungen der geplanten Veränderungen auf die Kontrollverfahren und die Kontrollintensität zu analysieren." Translation: before material changes to IT systems, the institution must analyse the effects of the planned changes on control procedures and control intensity. Risk control, compliance and internal audit must be involved.

EU ICT change management, binding for credit institutions, payment institutions, e-money institutions and other DORA financial entities: Commission Delegated Regulation (EU) 2024/1774 (DORA RTS on ICT risk management). FULL-TEXT. Source: [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1774).

- Article 17(1) covers "all changes to software, hardware, firmware components, systems, or security parameters". It requires:
  - "mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes" (point (b))
  - that "the changes are tested and finalised in a controlled manner" (point (c)(iii))
  - "fall-back procedures... including procedures and responsibilities for aborting changes or recovering from changes not successfully implemented" (point (e))
- Article 8(2), final subparagraph: testing in production must be "clearly identified, reasoned, are for limited periods of time, and are approved by the relevant function".
- Article 16(5)(a): "non-production environments only store anonymised, pseudonymised, or randomised production data". Article 16(6) allows a derogation for specific testing occasions with approval.
- DORA's application date (17 January 2025) is stated from background knowledge; DORA's own text was not re-read in this run.

### Inferences

- For the reader's case (an upstream table change carried through about ten derived tables into a feature store), the European texts ask for four things:
  1. Lineage at column level that is current after the change (ECB 3.4).
  2. Data-quality controls with tolerances along the whole chain (ECB 3.5(1)-(2)).
  3. Reconciliation of the new path against sources and against model development data (ECB 3.5(1); BCBS 36(c)).
  4. Involvement of the data governance function and independent validation in the change (ECB 3.3).
- Running v1 and v2 tables side by side and reconciling them before cutover produces exactly this evidence. BCBS footnote 16 accepts multiple data models if "robust automated reconciliation procedures" exist. This is an inference; no supervisor says that dual-running is the preferred method.
- DORA RTS 2024/1774 Article 17(1)(e) asks for fall-back and abort procedures for every ICT change, and Article 8(2) allows time-limited, approved testing in production. Together these support flags and rollback for data pipelines. The Article 16(5) rule that non-production environments hold only anonymised, pseudonymised or randomised production data pushes realistic validation toward controlled production (shadow) runs rather than full copies in test environments. This is an inference.
- None of these texts constrains running two versions of a table in parallel. They are silent on the mechanism.

### Gaps

- The June 2019 ECB letter to significant institutions and the February 2025 ECB newsletter "Sound risk data reporting" were not read.
- I found no ECB, EBA or national text that names parallel runs, shadow tables or dual-writes for data pipelines.
- DORA Level 1 (Regulation 2022/2554) Article 9(4)(e) was not re-read. It is cited only through the RTS.

---

## 2. Internal (IRB) models and model changes: CRR, Delegated Regulation 529/2014 and its 2026 revision, ECB guide to internal models

### Takeaway

For IRB banks only, every change to a rating system must be notified (CRR Article 143(4)). Material changes need prior permission (Article 143(3)). Delegated Regulation 529/2014 sorts changes into three classes:

- material, needing approval;
- ex ante notification "at least two months before their implementation";
- ex post notification "at least on an annual basis".

A material change can be used only "from the date specified in the new permission". The ECB expects that date to be no more than three months after the permission is notified.

The ECB guide (v4.1, June 2026) expects that a bank applying for a material change can "fully replicate the execution of the model and the calculation of own funds requirements according to the model change in a non-live production environment". It defines that environment as "a parallel version of a live production environment". This is a parallel run before approval, but of the capital calculation, not of customer-facing decisions.

The EBA (2023) says the change framework "does not constrain the use of self-training and self-development model challengers" as long as the rating system used for own funds is not updated. That is the clearest European statement that shadow or challenger models are allowed outside the approved model. Automatic retraining of the regulatory model itself must be monitored, and material changes must be blocked from going live automatically (ECB guide).

There is no concept of staged rollout of a changed IRB model to a share of exposures. CRR Article 144(1)(h) requires that each exposure in the range of application be assigned to a grade of "that rating system". On the regulatory calculation, the old and new model cannot split the book. That conclusion is an inference from the text.

### Cited Findings

CRR (Regulation (EU) No 575/2013), consolidated 29 June 2025 (including CRR3, Regulation 2024/1623). FULL-TEXT. Binding. Applies to IRB institutions. Source: [EUR-Lex consolidated](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02013R0575-20250629).

- Article 143(3): institutions "shall obtain the prior permission of the competent authorities" for "(a) material changes to the range of application of a rating system" and "(b) material changes to a rating system".
- Article 143(4): "Institutions shall notify the competent authorities of all changes to rating systems."
- Article 143(5) (CRR3): the EBA must develop RTS on materiality "by 10 January 2026".
- Article 144(1)(f): before permission, the institution must have "validated each rating system during an appropriate period prior to the permission to use that rating system". This is the CRR's own pre-use parallel period for initial approval.
- Article 144(1)(h): the institution "has assigned and continues to assign each exposure in the range of application of a rating system to a rating grade or pool of that rating system."
- Article 174(d): "a regular cycle of model validation that includes monitoring of model performance and stability; review of model specification; and testing of model outputs against outcomes".
- Article 174(e): the statistical model must be complemented by "human judgement and human oversight to review model-based assignments".
- Article 174(b): "a process for vetting data inputs into the model, which includes an assessment of the accuracy, completeness and appropriateness of the data".
- Article 175(2): the institution "shall document all major changes in the risk rating process".
- Article 179(1)(c): estimates "shall reflect the implications of technical advances and new data and other information, as it becomes available", with review "at least on an annual basis".
- Article 185(b): "regularly compare realised default rates with estimated PDs for each grade". This is back-testing.
- Article 185(c): "use other quantitative validation tools and comparisons with relevant external data sources". This is benchmarking.
- Article 185(d): "Changes in estimation and validation methods and data (both data sources and periods covered) shall be documented".
- Article 189(2)(a): senior management must notify the management body "of material changes or exceptions from established policies that will materially impact the operations of the institution's rating systems".

Commission Delegated Regulation (EU) No 529/2014 of 12 March 2014. FULL-TEXT of the original OJ text; amended by Delegated Regulation 2015/942, which I did not read. Binding RTS for IRB (and formerly AMA) institutions. Source: [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0529).

- Recital 2 gives the rationale for splitting notifications: "extensions or changes of minor importance need not be known to the competent authorities in advance". Ex ante notification gives authorities "the possibility to review the correct application of this Regulation."
- Article 2(1)-(2) sets the three categories: material changes requiring permission; changes requiring "notification before their implementation"; changes requiring "notification after their implementation".
- Article 3(3): "One material extension or change shall not be split into several changes or extensions of lower materiality."
- Article 3(4): "In case of doubt, institutions shall assign extensions and changes to the category of the highest potential materiality."
- Article 3(5): institutions use an approved material change "from the date specified in the new permission". If they do not implement it on that date, they need "a new permission".
- Article 4(1)(c): a change is material if it causes a decrease of "1,5 %" of overall consolidated credit-risk RWEA, or "15 % or more" of the RWEA in the rating system's range of application.
- Article 5(1)(a): non-material changes in Annex I Part I/II Section 2, or with an RWEA decrease of "at least 5 %", "shall be notified to competent authorities at least two months before their implementation".
- Article 5(1)(b): "all other changes shall be notified... after their implementation at least on an annual basis."
- Annex I, Part II, Section 1, point 2(d): changes to rating criteria are material if they "change the rank ordering" or "change the distribution of obligors, facilities or exposures across grades or pools... in a significant manner". The institution defines the measure.
- Annex I, Part II, Section 2, point 5 (data changes requiring ex ante notification): "(b) change of the data sources used in the process of allocating exposures to grades or pools or for parameter estimation". This is directly relevant to an upstream table or schema change that feeds an IRB model.
- Annex I, Part II, Section 2, point 2(f) (ex ante): "inclusion of new or additional information in a model for parameter estimation". Adding features is in this class.
- Recital 7: permission relates to "methods, processes, controls, data collection and IT systems". It says "on-going alignment of the models to the calculation data-set used... should not be covered by this Regulation." The ECB guide (footnote 38) quotes recital 7 of Delegated Regulation 2015/942, which calls this "model maintenance".
- Article 8(1) lists the documentation for an approval: rationale, "implementation date", technical documents, "reports of the institutions' independent review or validation", internal approval, quantitative impact, and version records.

EBA, Final Report, draft RTS amending 529/2014 (EBA/RTS/2026/05, 30 March 2026). FULL-TEXT. Status: final draft RTS submitted under CRR Article 143(5). I could not verify adoption by the Commission or publication in the OJ, so it is not yet law. Source: [EBA PDF](https://www.eba.europa.eu/sites/default/files/2026-03/7bbbbcd4-caa4-489d-b2b4-a837d04e709e/Final%20report%20RTS%20on%20material%20model%20changes.pdf).

- The draft RTS "classify a lower number of model changes as material". They introduce "a stronger reliance on the quantitative thresholds". Qualitative changes will "now only be material if they lead to a breach of the quantitative threshold". The exception is "a complete model re-design".
- The focus shifts "toward enabling a more efficient model maintenance process".
- Proposed ex ante items include "(m) re-estimations that are purely based only on additional or updated data that go beyond the annual inclusion of the latest observations".
- In the feedback table, industry argued that lighter treatment of recalibrations "is especially relevant in the context of machine learning". The EBA answered that recalibrations including the latest observations "require an ex post notification, unless already classified as requiring approval or ex ante notification".

ECB guide to internal models, version 4.1, 26 June 2026. Version 4.0 was dated 28 July 2025. v4.1 removed CCF-estimation content. FULL-TEXT. ECB guide for significant institutions; it "provides transparency on how the ECB understands those rules". Source: [ECB PDF](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guide_egim_202606.en.pdf).

- Overarching principles, para 79 (implementation timing): implementation of an approved material change "should happen within a reasonable time frame". The ECB "generally expects this time frame to be no longer than three months from the date of the notification". Exceptions are possible for "an implementation requiring a staggered approach, such as the implementation across different jurisdictions... or of technical constraints inherent to the IT framework".
- Credit risk chapter, para 97: institutions should have a change policy with detailed classification criteria so "that any arbitrage in that regard is avoided".
- Para 98(c): the policy should set "an end-to-end process from identification to notification/application".
- Para 100: an ex ante change "should not be split into several changes or extensions to produce one that is notified after implementation (ex post)". Unrelated changes should not be combined "to produce one change of lower materiality".
- Para 99: ECB templates exist for ex ante and ex post notifications and material-change applications.
- Para 121 (initial approval) requires evidence that the model is implemented "into a live or, if duly justified, non-live production environment". The bank must also have "successfully completed IT user acceptance tests".
- Para 122 (material change): the institution must show it can provide "a new version of the relevant IT systems ready to be put into production once the change is approved". It "should also be able to fully replicate the execution of the model and the calculation of own funds requirements according to the model change in a non-live production environment".
- Footnote 102: "The non-live production environment should be understood in this context as a parallel version of a live production environment that is already in place".
- Paras 123-124: an IT-testing policy is triggered by "software releases or material IT-related changes, regulatory changes, model methodology changes and the extension of the range of application of a rating system". Para 125 lists the tests, starting with unit/component tests.
- Parallel run for definition-of-default changes (credit risk chapter): to rebuild data under a new default definition, institutions may use "a parallel run (i.e. the implementation of the new definition of default in a parallel environment to the productive systems)". Alternatives are "a retrospective simulation" or similar classification. This is a data-definition change handled by a parallel run, and is the nearest analogue to a schema change.
- Benchmarking (credit risk chapter, validation content (viii.b)): "Benchmarking analyses should be performed at initial validation and at an adequate frequency thereafter, but at least as part of a full validation."
- Terminology trap: section 16.1.5, "Use of shadow rating models", uses "shadow rating model" for an internal approach that replicates external ratings (para 222). It is not a shadow deployment. Do not cite it as support for shadow mode.
- The words "champion", "challenger" (apart from "challenger tools" in the ML section), "A/B" and "canary" do not appear in a text search of the guide.

### Inferences

- An IRB model change has a regulatory clock. The bank classifies the change. If it is ex ante, it waits at least two months. If it is material, it waits for an ECB decision and then implements within about three months. Feature flags cannot shorten this. Flags and shadow runs do help meet the ECB's expectation that the changed model already runs in a "parallel version of a live production environment" before approval.
- "Staged rollout" of a changed IRB model across a share of the portfolio does not fit the framework. Approval sets one implementation date, and Article 144(1)(h) requires each in-scope exposure to be rated by "that rating system". Running the new model in shadow on 100% of exposures, without using its output for own funds, is consistent with the EBA statement on challengers and with the ECB's parallel non-live environment.
- A changed upstream data source for an IRB model is itself a notifiable change (529/2014 Annex I Part II Section 2 point 5(b)). An engineering team that swaps the upstream table under an IRB model without telling model risk management may cause a notification breach, even if the numbers do not change.

### Gaps

- The 2015/942 amending text and the consolidated 529/2014 were not read. Article and annex wording above is from the 2014 OJ text.
- Whether the Commission has adopted the EBA's March 2026 draft RTS was not verified.
- I did not read the ECB Guide on Materiality Assessment (EGMA), which the internal-models guide cites for market-risk model changes.

---

## 3. Machine learning specifically: EBA 2020 and 2023 reports, EBA loan-origination guidelines, ECB guide ML section, ECB AI statements

### Takeaway

The EBA's 2020 big data report is the only EU-level text found that describes a production parallel run with a challenger in deployment terms. It says the model "may be deployed in production only after a parallel testing period during which the new candidate model (also called the 'challenger model') runs in parallel with the old system". It also describes monitoring "by comparing the outcomes of the ML model with those of the previous system running in parallel". It recommends a model version register to "perform a roll-back if necessary". It is a non-binding report and says the step is optional.

The EBA's 2023 ML-for-IRB report and the ECB guide to internal models (v4.0/v4.1) are stricter for regulatory models:

- Frequent or automatic retraining must go through the change framework.
- The first switch to a mostly ML model is expected to be material.
- Monitoring must "prevent the automatic implementation of material changes".

The EBA loan-origination guidelines (binding on a comply-or-explain basis, from 30 June 2021) require automated credit models to have data-quality and bias controls, traceability, back-testing, overrides and continuous performance monitoring. They say nothing on how a new model is introduced.

An ECB newsletter (November 2025) reports that among 13 banks, "none of the banks in the sample permits self-learning after deployment".

### Cited Findings

EBA, "Report on Big Data and Advanced Analytics", EBA/REP/2020/01, January 2020. FULL-TEXT. Non-binding report. Source: [EBA PDF](https://www.eba.europa.eu/sites/default/documents/files/document_library/Final%20Report%20on%20Big%20Data%20and%20Advanced%20Analytics.pdf).

- Model deployment (p. 33): "The deployment of the model into production should be integrated into the standard change management process of the institution". Integration tests verify "that the end-to-end process will work appropriately in production."
- Parallel challenger (p. 34): "Optionally, the model may be deployed in production only after a parallel testing period during which the new candidate model (also called the 'challenger model') runs in parallel with the old system to enable a comparison of the results."
- Go-live decision (p. 34): "made after considering the overall business benefits and also based on other criteria such as explainability and fairness".
- Monitoring (p. 34): it can be automated via "'early signals' or threshold warnings (e.g. accuracy under a specific value)". "Performance can also be monitored by comparing the outcomes of the ML model with those of the previous system running in parallel."
- Model update (p. 34): "the model may be retrained periodically using new datasets"; "the model should be retrained frequently when incoming data change rapidly."
- Traceability and versioning (Section 4.4): "Having all the versions of a model registered enables an institution to compare different models or perform a roll-back if necessary." To repeat a decision, "the correct version of the model and data could be used".
- Human in the loop (p. 34): a model may run fully automated or "with a 'human in the loop' involved in critical decisions". Escalation may apply "if the decision is not clear enough (e.g. the model gives a credit score between x and y)".
- Online learning (Annex): "when the model is deployed in an online learning mode... the model changes constantly".

EBA, "Machine Learning for IRB Models: Follow-up report from the consultation on the discussion paper", EBA/REP/2023/28, August 2023. FULL-TEXT. Non-binding report. Applies to IRB models. Source: [EBA PDF](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Reports/2023/1061483/Follow-up%20report%20on%20machine%20learning%20for%20IRB%20models.pdf). Note: `ml_model_rollout.md` already cites its Section 3.2 on ML challenger models for validation. The points below are new.

- Para 35(a): "Any update of the rating system used to calculate own funds requirements needs to be assessed according to the prudential model change framework". For "ML models updated at a high frequency and/or automatically updating models", two rules are "especially relevant". The first is point (d) of 529/2014 Annex I Part II Section 1(2): a significant change in rank ordering or distribution is material. The second is Article 3(3): no splitting.
- Para 35(b): "as long as the rating system used to calculate own fund requirements is not updated, the model change framework does not constrain the use of self-training and self-development model challengers (e.g. for the yearly review of estimate) that incorporate additional data when it becomes available."
- Recommendations annex: "As credit risk is, however, not supposed to change frequently... such updates are expected, in general, not to occur frequently. Therefore, the parameters of the model should generally be stable."
- Validation should cover "the relationship between the output variable and the drivers in subsequent releases of the model". The purpose is to assess "whether changes between inputs and outputs require regulatory approval, ex ante or ex post notification."

ECB guide to internal models, Section 9 "The use of machine learning techniques in internal models" (first added in v4.0, July 2025; retained in v4.1, June 2026). FULL-TEXT. Significant institutions, Pillar 1 models. Source: [ECB PDF](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guide_egim_202606.en.pdf).

- Para 31 gives a practitioner definition: models that "rely on a large number of parameters, can represent highly non-linear functions and/or may require large amounts of data". Footnote 35: generalised linear models "are not deemed to be ML techniques for the purposes of this guide."
- Para 33 lists ML uses including "data preparation, modelling, challenger tools etc."
- Para 34: "ML-based internal models are more likely to be classified as material".
- Para 38: the change policy must define "what constitutes a change with regard to ML-based internal models". For market risk, it must distinguish model changes from "model maintenance".
- Para 39: "the initial switch in the design of an internal model from a largely traditional approach to a mostly ML-based approach should be classified as a material change".
- Para 40: for dynamic models, institutions must monitor "the updates, as well as autonomous adaptations, recalibrations and changes".
- Para 41: institutions using dynamic ML models "should justify the reason for this approach". They should establish monitoring "to identify changes, prevent the automatic implementation of material changes and of non-material changes requiring ex ante notification, and recognise model drift". Monitoring should "indicate if and when a series of automatic non-material changes leads to a material change".
- Para 43(a): validation should evaluate "the stability and robustness of the outcomes with respect to other possible approaches taken, hyperparameters selected and the randomness of the training process". It should pay attention to "out-of-sample and out-of-time data".
- Para 43(b): validation frequency for ML models "might actually be higher".
- Para 43(c): the ECB expects "a set of explainability techniques and tools". Para 43(d) requires validation of those tools "at least yearly".
- Para 51 (data): ML inputs "should undergo an additional exploratory analysis to ensure a clear understanding of data formats, the treatment of missing values, and potential sources of bias."

EBA Guidelines on loan origination and monitoring, EBA/GL/2020/06. FULL-TEXT. EBA guidelines (comply or explain). They apply to CRR institutions and, for Section 5 on creditworthiness, to CCD and MCD creditors. They apply "from 30 June 2021". Source: [EBA PDF](https://www.eba.europa.eu/sites/default/documents/files/document_library/Publications/Guidelines/2020/Guidelines%20on%20loan%20origination%20and%20monitoring/884283/EBA%20GL%202020%2006%20Final%20Report%20on%20GL%20on%20loan%20origination%20and%20monitoring.pdf).

- Para 53 (technology-enabled innovation), point (d): "If explanations are required during the models' use, then consideration should be given to developing an interpretable model."
- Para 53(f): "Ensure the performance of the model, including the validity and quality of its outputs, is continuously monitored and appropriate remediation measures are taken in a timely manner".
- Para 54 (automated models for creditworthiness assessment and credit decision-making), institutions must have:
  - (a) "internal policies and procedures detecting and preventing bias and ensuring the quality of the input data"
  - (b) "measures to ensure the traceability, auditability, and robustness and resilience of the inputs and outputs"
  - (c) policies ensuring "the quality of the model output is regularly assessed... including backtesting the performance of the model"
  - (d) "control mechanisms, model overrides and escalation procedures".
- Para 55(b): documentation must cover "the use of model outputs in the decision-making process and the monitoring of these automated decisions on the overall quality of the portfolio".
- The guidelines contain no paragraph on introducing a new model version, on parallel running or on challengers.

ECB statements on AI in banking supervision:

- ECB Supervision Newsletter, "AI's impact on banking: use cases for credit scoring and fraud detection", 20 November 2025. FULL-TEXT. Workshops with "13 banks". Findings are "based on high-level information from a small sample of banks and should not be generalised".
  - "To ensure models remain stable and auditable, none of the banks in the sample permits self-learning after deployment."
  - "Most banks in the sample use explainability tools to monitor models' performance."
  - "there is no clarity yet on whether logistic regression is considered AI in the context of the AI Act."
  - Source: [ECB newsletter](https://www.bankingsupervision.europa.eu/press/supervisory-newsletters/newsletter/2025/html/ssm.nl251120_1.en.html)
- ECB supervisory priorities 2026-2028. FULL-TEXT. The ECB "will continue to monitor the general use of AI, while taking a more targeted approach to focus on banks' generative AI applications". Planned work includes cooperation "with market surveillance authorities responsible for the Artificial Intelligence Act and with the European Banking Authority". Source: [ECB priorities](https://www.bankingsupervision.europa.eu/framework/priorities/html/ssm.supervisory_priorities202511.en.html).

### Inferences

- European texts support a three-stage pattern for credit models:
  1. Offline challenger and benchmarking (EBA 2023, CRR 185(c)).
  2. A parallel production run where the challenger scores live cases but the old system decides (EBA 2020; for IRB, the ECB's non-live parallel environment).
  3. A governed cutover with a version register and roll-back (EBA 2020).

  None of them describes splitting live credit decisions between two models, which is A/B testing. They do not forbid it either; see Section 5 for the customer-side constraints.
- The ECB's "no self-learning after deployment" observation and para 41 of the internal-models guide mean that continuous retraining pipelines should produce candidate versions that pass through change classification. They should not update the serving model in place. Each retrain is a release. This is an inference.

### Gaps

- The EBA's 2021 discussion paper on ML for IRB (EBA/DP/2021/04) was not read; the 2023 follow-up summarises it.
- I found no EBA or ECB text on A/B testing credit models on customers.

---

## 4. EU AI Act (Regulation (EU) 2024/1689) as amended by the Digital Omnibus on AI (Regulation (EU) 2024/1689 amended by (EU) 2026/1744)

### Takeaway

AI systems used "to evaluate the creditworthiness of natural persons or establish their credit score" are high-risk (Annex III point 5(b)). Fraud-detection systems are expressly excluded.

The Digital Omnibus on AI, Regulation (EU) 2026/1744 of 8 July 2026, was published in the OJ on 24 July 2026 and entered into force three days later. It moved the Annex III high-risk obligations (Chapter III Sections 1-3) from 2 August 2026 to 2 December 2027. This is adopted law, not a proposal.

A change "not foreseen or planned in the initial conformity assessment" that affects compliance is a "substantial modification" (Article 3(23)) and requires a new conformity assessment (Article 43(4)). Changes from continued learning that were "pre-determined by the provider" and documented are not.

So whether a retrained model, or a model trained on a new data schema, is a substantial modification depends on whether the conformity assessment planned and documented that kind of change. Recital 128 gives "change of operating system or software architecture" as an example of a change that may affect compliance.

Legacy credit-scoring systems placed on the market before the Chapter III date fall under the Act only if they later undergo "significant changes in their designs" (Article 111(2), as amended). Recital 177 says that phrase is equivalent in substance to substantial modification. A redesign after December 2027 can therefore pull a legacy system into full scope.

Testing a high-risk Annex III system on real customers before placing it on the market is allowed under Article 60. The conditions are heavy:

- a real-world testing plan approved by the market surveillance authority, with tacit approval after 30 days;
- registration;
- a maximum of six months, extendable by six;
- informed consent of subjects (Article 61);
- decisions that "can be effectively reversed and disregarded".

The Act has no rule for A/B testing two versions of an already-compliant system.

### Cited Findings

All from the AI Act consolidated by me from the OJ text, FULL-TEXT: [EUR-Lex 32024R1689](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689). Binding EU regulation. The high-risk obligations apply only to high-risk systems; the financial-institution adaptations apply only to regulated financial institutions.

- Annex III, point 5(b): "AI systems intended to be used to evaluate the creditworthiness of natural persons or establish their credit score, with the exception of AI systems used for the purpose of detecting financial fraud".
- Article 3(23): "'substantial modification' means a change to an AI system after its placing on the market or putting into service which is not foreseen or planned in the initial conformity assessment carried out by the provider and as a result of which the compliance of the AI system with the requirements set out in Chapter III, Section 2 is affected or results in a modification to the intended purpose".
- Article 43(4), first subparagraph: systems "shall undergo a new conformity assessment procedure in the event of a substantial modification, regardless of whether the modified system is intended to be further distributed or continues to be used by the current deployer."
- Article 43(4), second subparagraph: for systems "that continue to learn", changes "pre-determined by the provider at the moment of the initial conformity assessment and are part of the information contained in the technical documentation referred to in point 2(f) of Annex IV, shall not constitute a substantial modification."
- Recital 128: "whenever a change occurs which may affect the compliance of a high-risk AI system with this Regulation (e.g. change of operating system or software architecture), or when the intended purpose of the system changes, that AI system should be considered to be a new AI system". Changes from systems that continue to "learn" are not substantial "provided that those changes have been pre-determined by the provider and assessed at the moment of the conformity assessment."
- Recital 177: "the concept of significant change should be understood as equivalent in substance to the notion of substantial modification".
- Article 10(2): training, validation and testing data must be subject to governance practices covering, among others:
  - "(b) data collection processes and the origin of data";
  - "(c) relevant data-preparation processing operations, such as annotation, labelling, cleaning, updating, enrichment and aggregation";
  - "(f) examination in view of possible biases... especially where data outputs influence inputs for future operations".
- Article 12(1): systems "shall technically allow for the automatic recording of events (logs) over the lifetime of the system". Article 12(2)(a): logging must support "identifying situations that may result in the high-risk AI system presenting a risk... or in a substantial modification". Article 12(2)(b) links logging to post-market monitoring.
- Article 14(1): systems must be designed so "they can be effectively overseen by natural persons during the period in which they are in use". Article 14(4)(b) addresses "automation bias".
- Article 72(1)-(2): providers must run a post-market monitoring system that "shall actively and systematically collect, document and analyse relevant data... on the performance of high-risk AI systems throughout their lifetime".
- Article 72(4), second subparagraph: for Annex III point 5 systems "placed on the market or put into service by financial institutions" subject to Union financial-services governance law, providers may integrate post-market monitoring into existing systems.
- Article 17(4): for providers that are regulated financial institutions, the quality management system obligation (with exceptions for paragraph 1 points (g), (h) and (i)) "shall be deemed to be fulfilled by complying with the rules on internal governance arrangements or processes" under financial-services law.
- Article 26(5): for deployers that are regulated financial institutions, the monitoring obligation is "deemed to be fulfilled" by complying with financial-services governance rules. Logs are kept "as part of the documentation kept pursuant to the relevant Union financial service law".
- Article 74(6): the market surveillance authority for AI systems used by regulated financial institutions is "the relevant national authority responsible for the financial supervision of those institutions".
- Article 3(57): testing in real-world conditions "does not qualify as placing the AI system on the market or putting it into service... provided that all the conditions laid down in Article 57 or 60 are fulfilled".
- Article 60(2): providers may test Annex III systems in real-world conditions "at any time before the placing on the market or the putting into service".
- Article 60(4) conditions include:
  - (a)-(b) a plan submitted to and approved by the market surveillance authority, with tacit approval after "30 days";
  - (c) registration;
  - (f) "not longer than six months, which may be extended for an additional period of six months";
  - (i) "informed consent in accordance with Article 61";
  - (k) "the predictions, recommendations or decisions of the AI system can be effectively reversed and disregarded."
- Article 60(5): subjects may withdraw "without any resulting detriment".
- Article 111(2) (original): the Act applies to high-risk systems already placed on the market or put into service "only if, as from that date, those systems are subject to significant changes in their designs".
- Article 113 (original): general application "from 2 August 2026", with Article 6(1) (Annex I products) from 2 August 2027.

Digital Omnibus on AI: Regulation (EU) 2026/1744 of the European Parliament and of the Council of 8 July 2026, OJ L series 24.7.2026. FULL-TEXT. Adopted and in force. Source: [EUR-Lex 32026R1744](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32026R1744).

- Final article: "This Regulation shall enter into force on the third day following that of its publication", i.e. 27 July 2026, computed from the 24 July publication date.
- Amended Article 113, point (c): "Chapter III, Sections 1, 2, and 3, with the exception of Article 6(5), shall apply from: (i) 2 December 2027 as regards AI systems classified as high-risk pursuant to Article 6(2) and Annex III; and (ii) 2 August 2028" for Annex I.
- Amended Article 111(2): the legacy carve-out now refers to systems placed on the market "before the date of application of Chapter III referred to in Article 113". That means 2 December 2027 for credit scoring.
- Recital on Article 111(2): "the grace period should apply where the type and model of AI system has already been placed on the market". Also: "Any significant change to the design of that AI system after the date specified in Article 111(2) should trigger the obligation of the provider to fully comply".
- Amended Article 72(3): the Commission's implementing act on a post-market monitoring template is replaced by "guidance, including a template... by 2 September 2027".
- Article 60 is extended to Annex I Section A products, and a new Article 60a is added for Annex I Section B. Annex III testing rules are otherwise unchanged in the text read.
- Article 43(4) and Article 3(23) do not appear among the amended provisions in the text read. The omnibus amends Article 43(3) only.

Secondary confirmation of the dates: Gibson Dunn and White & Case alerts. SNIPPET only. [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/); [White & Case](https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act).

### Inferences

- Retraining. Article 43(4) and recital 128 put a provider-controlled lever in the conformity assessment. If the technical documentation (Annex IV point 2(f)) pre-determines the retraining cadence, data window, feature set and performance bounds, routine retrains within those bounds are not substantial modifications.
- New data schema. A model retrained on a new upstream schema, with new or redefined features or changed data-preparation steps (Article 10(2)(c)), is outside a typical pre-determined change plan. It is likely to "affect" compliance with Article 10 and therefore to be a substantial modification, unless the plan foresaw it. This is an inference; no guidance read says so for credit scoring.
- Legacy systems. A bank's credit scorecard already in use before 2 December 2027 stays outside the Act until a "significant change" in design. A schema-driven re-architecture after that date may trigger full compliance for that system. This creates an incentive to land planned redesigns before December 2027, or to document them as foreseen.
- A/B testing. Once the system is placed on the market or put into service and compliant, the Act has no specific rule for routing customers between two versions. Each version must itself be compliant, and a version that is a substantial modification needs its own conformity assessment before it serves anyone.
- Pre-market real-world testing under Article 60 needs informed consent. Silent A/B testing of an unassessed credit model on applicants would not fit Article 60. This is an inference from Article 60(4)(i) and Article 61.
- For banks, most of this sits inside existing governance. Articles 17(4), 26(5) and 72(4) defer to financial-services governance rules. The market surveillance authority is the financial supervisor (Article 74(6)).
- Fraud-detection models are not high-risk under point 5(b). The AI Act does not constrain champion/challenger fraud splits. PSD2 rules do; see Section 7.

### Gaps

- No Commission guidelines on substantial modification, and no harmonised standard, were found or read. Article 96 guidance on substantial modification was not checked.
- I did not read the original Commission omnibus proposal (COM(2025) 836, November 2025) or the Parliament and Council positions. Only the adopted text was read.
- The Article 60 implementing act on real-world testing plans was not located.

---

## 5. Experiments on customers: GDPR Article 22, WP251rev.01, CJEU SCHUFA (C-634/21), Consumer Credit Directive Article 18

### Takeaway

No EU text prohibits serving two credit-scoring models to different applicants. Every applicant scored by either model has the same rights:

- Under Article 22 GDPR, a solely automated credit decision is lawful only if it is "necessary" for the contract, authorised by law, or based on explicit consent. The data subject keeps the right to "obtain human intervention". SCHUFA (December 2023) extends this to a bureau score that the lender "draws strongly on".
- The Consumer Credit Directive (EU) 2023/2225, applicable from 20 November 2026, adds the right to "request and obtain from the creditor human intervention", "a clear and comprehensible explanation", and "a review" whenever the creditworthiness assessment uses automated processing.

For an experiment, three consequences follow. The explanation and "meaningful information about the logic involved" must be correct for whichever model actually scored the applicant. Human review must work for both arms. The controller must be able to say which model version decided each case. WP251 adds an expectation of "frequent assessments" and testing of scoring methods to keep them fair, effective and unbiased. It does not mention experiments.

### Cited Findings

GDPR (Regulation (EU) 2016/679). FULL-TEXT. Binding. Source: [EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679).

- Article 22(1): "The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her."
- Article 22(2): exceptions where the decision "(a) is necessary for entering into, or performance of, a contract", "(b) is authorised by Union or Member State law", or "(c) is based on the data subject's explicit consent."
- Article 22(3): the controller "shall implement suitable measures... at least the right to obtain human intervention on the part of the controller, to express his or her point of view and to contest the decision."
- Articles 13(2)(f), 14(2)(g) and 15(1)(h): the data subject must receive information on "the existence of automated decision-making... and, at least in those cases, meaningful information about the logic involved, as well as the significance and the envisaged consequences".

Article 29 Working Party, "Guidelines on Automated individual decision-making and Profiling", WP251rev.01, adopted 3 October 2017, "As last Revised and Adopted on 6 February 2018". Endorsed by the EDPB in May 2018 (background knowledge; endorsement not re-read). FULL-TEXT. Non-binding guidance. Source: [EC PDF](https://ec.europa.eu/newsroom/article29/document.cfm?action=display&doc_id=49826).

- Necessity: "The controller must be able to show that this type of processing is necessary, taking into account whether a less privacy-intrusive method could be adopted."
- Human involvement must be "meaningful, rather than just a token gesture".
- Credit-scoring example: the controller advises the data subject "that the credit scoring methods used are regularly tested to ensure they remain fair, effective and unbiased."
- "Controllers should carry out frequent assessments on the data sets they process to check for any bias". "Systems that audit algorithms and regular reviews of the accuracy and relevance of automated decision-making including profiling are other useful measures."
- Measures "should be used on a cyclical basis; not only at the design stage, but also continuously... The outcome of such testing should feed back into the system design."
- A text search found no mention of A/B testing or experiments on data subjects.

CJEU, Case C-634/21, SCHUFA Holding (Scoring), judgment of the First Chamber, 7 December 2023. FULL-TEXT. Binding interpretation of EU law. Source: [EUR-Lex 62021CJ0634](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62021CJ0634).

- Operative part, quoted in two parts: Article 22(1) "must be interpreted as meaning that the automated establishment, by a credit information agency, of a probability value based on personal data relating to a person and concerning his or her ability to meet payment commitments in the future constitutes 'automated individual decision-making'..."
- "...where a third party, to which that probability value is transmitted, draws strongly on that probability value to establish, implement or terminate a contractual relationship with that person."

Consumer Credit Directive (EU) 2023/2225. FULL-TEXT. Binding directive. Member States had to transpose by 20 November 2025 and "shall apply those measures from 20 November 2026". Directive 2008/48/EC is repealed from that date. Applies to creditors in consumer credit. Source: [EUR-Lex 32023L2225](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32023L2225).

- Article 18(1): the creditor must carry out "a thorough assessment of the consumer's creditworthiness... in the interest of the consumer, to prevent irresponsible lending practices and over-indebtedness".
- Article 18(4): creditors must "establish procedures for the assessment referred to in paragraph 1 and to document and maintain such procedures."
- Article 18(8): "Where the creditworthiness assessment involves the use of automated processing of personal data, Member States shall ensure that the consumer has the right to request and obtain from the creditor human intervention". This consists of the right to:
  - (a) "a clear and comprehensible explanation of the assessment of creditworthiness, including on the logic and risks involved";
  - (b) express a point of view;
  - (c) "request a review of the assessment of the creditworthiness and the decision".
- Article 18(9): on rejection, the creditor must inform the consumer "of the fact that the assessment of creditworthiness is based on automated processing of data and about the consumer's right to human assessment".
- Status check: search results found no proposal to postpone the 20 November 2026 application date. SNIPPET only, from a secondary wiki and a Better Regulation note. Not verified on EUR-Lex.

### Inferences

- Running two credit models on different applicants is permitted in the sense that nothing forbids it. It is constrained in four ways:
  - Article 22(2)(a) necessity has to hold for each model.
  - Article 13-15 logic information and CCD Article 18(8)(a) explanations must describe the model that actually scored that person. A bank that tells all applicants "model A" while some get model B has a transparency problem.
  - Human review (GDPR 22(3), CCD 18(8)(c)) must be able to reproduce the decision of either arm. This requires logging the model version per decision, which matches AI Act Article 12 and EBA traceability.
  - Fairness: if one arm is worse for a protected group, the controller has knowingly exposed applicants to it. WP251's expectation of regular testing for bias applies to both arms.
- A shadow model, which scores but does not decide, produces no "decision" under Article 22. Its legal basis is ordinary processing under Article 6, plus purpose limitation. This is an inference. The SCHUFA holding turns on the lender drawing "strongly" on the score. A shadow score that is not used to decide is not drawn on.
- Fraud models: Article 22 can apply to automatic payment blocks that "similarly significantly" affect a person. WP251 discusses fraud prevention only as a legitimate-interest ground. I found no EU text on randomised fraud-model splits.

### Gaps

- CJEU C-203/22 Dun & Bradstreet Austria (27 February 2025), on explaining the logic of automated credit decisions, was not read.
- EDPB guidance after 2018 on AI and credit scoring was not searched.
- No national data-protection authority decision on A/B testing credit models was found.
- Whether any Member State's CCD transposition adds rules on model testing was not checked.

---

## 6. National supervisors: BaFin, DNB, ACPR, Banca d'Italia, FINMA

### Takeaway

The national texts are principles, not procedures:

- BaFin (2021) requires independent validation "vor Übernahme in den operativen Betrieb" (before going live). It names triggers for ad hoc revalidation, including "eine systematische Veränderung der Inputdaten" (a systematic change in input data). It proposes a tiered threshold "Stopping-Rule" that halts automated decisions and forces revalidation, which is in effect a supervisor-proposed automated kill switch.
- MaRisk AT 4.3.5 (binding in Germany from 1 January 2024; text from Circular 06/2024) requires suitability to be assessed "vor dem Einsatz eines Modells" (before a model is used) and regular validation, explicitly including AI.
- DNB (2019) suggests that material AI be "regularly assessed by evaluating model outcomes against conventional (non-AI enabled) models". This is the nearest national text to a champion/challenger comparison.
- ACPR (2020) mentions CI/CD, archiving every production model version, and challenger models as an audit technique. It also concludes that ML internal models "can be treated like traditional internal models" for model-update policy.
- FINMA (2024) checks testing "before productive use, in the event of changes" and fallback mechanisms.

None of them addresses traffic-split experiments on customers. Banca d'Italia has no specific AI model-change expectations that I could find.

### Cited Findings

BaFin, "Big Data und künstliche Intelligenz: Prinzipien für den Einsatz von Algorithmen in Entscheidungsprozessen", 15 June 2021. FULL-TEXT (German original; translations are mine). Non-binding. The paper says the principles "stellen vorläufige Überlegungen zu aufsichtlichen Mindestanforderungen... dar" (represent preliminary thoughts on minimum supervisory requirements). Source: [BaFin PDF](https://www.bafin.de/SharedDocs/Downloads/DE/Aufsichtsrecht/dl_Prinzipienpapier_BDAI.pdf?__blob=publicationFile&v=1).

- Context, original: "die Rekalibrierungszyklen von Modellen und Algorithmen immer kürzer werden; die Grenzen zwischen Kalibrierung und Validierung verschwimmen." Translation: "recalibration cycles of models and algorithms are becoming ever shorter; the boundaries between calibration and validation are blurring."
- Appropriate validation processes, original: "Jeder Algorithmus sollte vor Übernahme in den operativen Betrieb einen angemessenen Validierungsprozess durchlaufen." Translation: "Every algorithm should go through an appropriate validation process before being taken into live operation." Initial validation should be done, or at least reviewed, by an independent function or person.
- Ad hoc revalidation triggers, original: "eine systematische Veränderung der Inputdaten, externe (makroökonomischer) Schocks, eine Veränderung der rechtlichen Voraussetzungen... und ein Feedback aus der Outputphase wie das Brechen eines Limits". Translation: "a systematic change in input data, external (macroeconomic) shocks, a change in the legal conditions... and feedback from the output phase such as a limit breach." These can lead to "Neu-Kalibrierung oder der Auswahl eines alternativen Algorithmus" (recalibration or selection of an alternative algorithm).
- Data, original: "Eine Kalibrierung oder Validierung mit unpassenden oder fehlerhaften Daten kann die Performance des Algorithmus im Livebetrieb systematisch beeinträchtigen." Translation: "Calibration or validation with unsuitable or faulty data can systematically impair the algorithm's performance in live operation." For very risk-sensitive processes the data used "gespeichert und vorgehalten werden" (should be stored and retained).
- Intensive release and feedback processes ("Intensive Freigabe- und Feedbackprozesse"), original: "In der letzten Stufe sollte eine Freigabe zunächst nicht erfolgen ('Stopping-Rule'), sondern es sollte ein Signal zur Überprüfung des Modells... und zur Unterbrechung des Prozesses gegeben werden." Translation: "At the last stage, release should not occur at first ('stopping rule'); instead a signal should be given to review the model... and to interrupt the process." Lower tiers require human release, then release only after checking input data for outliers.
- Emergency measures ("Etablierung von Notmaßnahmen"): firms should have measures to keep business running "falls es zu Problemen bei algorithmenbasierten Entscheidungsprozessen kommt" (if problems occur in algorithm-based decision processes), at least for business-critical applications.
- Ongoing validation, original: "Wenn neue Algorithmen eingesetzt werden, sollten zudem in einer übergeordneten Evaluation Interaktion und Aggregation der Risiken regelmäßig überprüft werden." Translation: "When new algorithms are deployed, the interaction and aggregation of risks should also be reviewed regularly in an overarching evaluation."

BaFin, MaRisk (Circular 06/2024 (BA), 29 May 2024), AT 4.3.5 "Verwendung von Modellen". FULL-TEXT (text only). Binding supervisory practice for German institutions. AT 4.3.5 covers models used in MaRisk processes, i.e. Pillar 2 and business models. A secondary source (SNIPPET, PwC) says CRR Pillar 1 models are excluded; I did not see the explanatory note. Source: [Bundesbank PDF](https://bundesbank.de/resource/blob/932738/fa6ddd3636c40c9f9d5cb4fad4f07121/mL/2024-05-29-rundschreiben-data.pdf).

- Tz. 1, original: the requirements "finden auch Anwendung bei automatisierten Modellen, technologiegestützter Innovation und künstlicher Intelligenz." Translation: they "also apply to automated models, technology-enabled innovation and artificial intelligence."
- Tz. 2, original: "Die Angemessenheit und Eignung sind vor dem Einsatz eines Modells zu bewerten und regelmäßig zu überprüfen." Translation: "Appropriateness and suitability are to be assessed before a model is used and reviewed regularly."
- Tz. 3: procedures must ensure the quality of underlying data, and "Qualitätsschwächen in den zugrundeliegenden Daten erkannt und bereinigt werden" (quality weaknesses in the underlying data are to be detected and remedied).
- Tz. 5: "regelmäßige Validierung der Modelle"; "Die Qualität der Modellergebnisse, insbesondere die Genauigkeit, Stabilität und Konsistenz der Verfahren, ist regelmäßig zu analysieren." Translation: regular validation of models; "the quality of model results, in particular the accuracy, stability and consistency of the procedures, is to be analysed regularly."
- Tz. 6: "hinreichende Erklärbarkeit" (sufficient explainability), especially for AI.
- A search result (SNIPPET) indicates a 2026 MaRisk consultation (02/2026) and a Bundesbank change list dated 30 June 2026 that may renumber this module. Not verified. Check the current version before citing paragraph numbers.

DNB, "General principles for the use of Artificial Intelligence in the financial sector" (discussion paper, comment deadline 18 October 2019). FULL-TEXT (PDF obtained through the fetch tool's saved file; direct curl was blocked with HTTP Access Denied). Non-binding. Framed within "controlled and sound business operations" under the Dutch Financial Supervision Act, Articles 3:10, 3:17 and 3:18. Source: [DNB PDF](https://www.dnb.nl/media/jkbip2jc/general-principles-for-the-use-of-artificial-intelligence-in-the-financial-sector.pdf).

- SAFEST: "soundness (§4.1), accountability (§4.2), fairness (§4.3), ethics (§4.4), skills (§4.5), and transparency (§4.6)".
- Soundness: AI applications "should first and foremost be reliable and accurate, behave predictably, and operate within in the boundaries of applicable rules and regulations".
- Soundness, Ad 1: "In case of malfunctioning AI systems, fall-back plans are available for core business processes".
- Soundness, Ad 2: "Models, where appropriate, are periodically retrained, recalibrated and assessed, especially in the event of significant changes in the input data". Also: "Criteria for significant change as well as other fail criteria are well documented for each AI application, and become more stringent as the model's materiality increases."
- Soundness, Ad 3: "The correct workings of material AI applications is regularly assessed by evaluating model outcomes against conventional (non-AI enabled) models." Material AI systems use "'human-in-the-loop' and/or 'human-on-the-loop' review processes."
- Soundness, Ad 4: "Original data sets used to (re)train and (re)calibrate models are systematically archived." Data issues "both in development and production, are evaluated and documented".

ACPR (Banque de France), "Governance of Artificial Intelligence in Finance", discussion document, June 2020 (Dupont, Fliche, Yang). FULL-TEXT. Non-binding. Source: [ACPR PDF](https://acpr.banque-france.fr/sites/default/files/medias/documents/20200612_ai_governance_finance.pdf).

- Audit: the empirical facet "relies on two techniques for testing an algorithm as a black box: challenger models (to compare against the model under test) and benchmarking datasets, both curated by the auditor."
- Re-training (3.3.3): re-training "does not solve all instability issues, since it results at the very least in non-reproducible decisions on a given input between subsequent versions". This can be compensated "by properly archiving all subsequent versions of an ML model used in production."
- Engineering (5.2): the process can range "all the way to a continuous process which can also be fully automated, typically using CI/CD". Box: "full traceability of the AI design and engineering process should be guaranteed."
- AML example: "Model validation needs to be performed much more frequently than e.g. in the case of capital requirements models, since drifts may occur in real time". Some operators were assigned "to manual labelling in parallel with the algorithm's execution, thus continuously yielding new training data". This preserves a labelled control sample for false negatives.
- Internal model updates (5.3.4): "ML-based internal models become invalid following a major change in their input data". Also: "from a model update policy standpoint, it appears that ML-based models can be treated like traditional internal models."
- Later ACPR work (2024-2025) was not searched in this run.

FINMA, Guidance 08/2024, "Governance and risk management when using artificial intelligence", 18 December 2024. FULL-TEXT. Swiss supervisory guidance setting out FINMA's observations and what it assessed. Not EU. Source: [FINMA PDF](https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20241218-finma-aufsichtsmitteilung-08-2024.pdf).

- 2.3: "some supervised institutions have not defined any requirements or controls to ensure data quality for AI applications". Also: "Data quality is therefore often more important than the selection of the specific model."
- 2.4: FINMA assessed whether institutions "monitor changes in input data to ensure that models remain applicable in a changing environment (recognition and treatment of data drift)". Monitoring includes "analysing cases in which the output has been ignored or changed by users".
- Footnote 8: tests include backtesting, out-of-sample tests, stress tests, adversarial testing and "tests against additional, possibly simpler benchmark models".
- Footnote 9: assess "whether the application is working according to its purpose before productive use, in the event of changes and – especially due to the adaptive nature of today's applications – on an ongoing basis". Also consider "fallback mechanisms in order to be prepared if the AI develops in an undesirable direction".
- 2.7: "only a few supervised institutions carry out an independent review of the entire model development process".

Banca d'Italia: SNIPPET only. Searches found speeches and a May 2025 study on AI ethics ("Mercati, infrastrutture, sistemi di pagamento" no. 58), and statements that financial supervisors will supervise high-risk AI uses. No Banca d'Italia supervisory expectations on model change, parallel runs or AI testing were found. Sources: [ABI event presentation](https://media.abieventi.it/eventi/CAFC65E6-912C-4372-8E3C-2E21944BD6EA/relatori/20260402104509COMPAGNONI_20260331_ABI_Intervento_Compagnoni.pdf); [dirittobancario.it](https://www.dirittobancario.it/art/sulletica-dellintelligenza-artificiale-nel-settore-finanziario/).

### Inferences

- BaFin's tiered threshold process is the closest regulator text to automated guardrails and a kill switch on a live model. It maps directly to a feature flag that drops traffic back to a human or a fallback model when a metric breaches a limit.
- DNB's comparison "against conventional (non-AI enabled) models" and ACPR's auditor-curated "challenger models" support keeping the old model running in parallel as a benchmark after an AI model goes live.
- No national supervisor read here mentions randomised customer experiments. Silence is not permission. Experiments fall under the general validation-before-use expectations (BaFin "vor Übernahme in den operativen Betrieb"; MaRisk "vor dem Einsatz"; FINMA "before productive use"). So a live challenger arm needs prior validation.

### Gaps

- I did not search ACPR's 2024-2025 AI work (for example its AI Act market-surveillance role and any 2025 reflection papers).
- The MaRisk explanatory notes (Erläuterungen) to AT 4.3.5, and the status of the 2026 MaRisk consultation, were not read.
- Banca d'Italia: no primary supervisory text found.
- I found no national supervisor text on A/B testing or shadow deployment.

---

## 7. Payments and fraud models: PSD2 RTS on SCA (Delegated Regulation 2018/389)

### Takeaway

A payment service provider that uses the transaction-risk-analysis (TRA) exemption from strong customer authentication carries a hard, binding outcome constraint, measured at the level of the PSP and the transaction type:

- Its overall fraud rate must stay at or below the reference rates in the Annex, measured on a "rolling quarterly basis (90 days)". For remote card payments the rates are 0.13% up to EUR 100, 0.06% up to EUR 250 and 0.01% up to EUR 500.
- It must "immediately report" any breach.
- It must stop using the exemption after two consecutive quarters above the rate.
- The "methodology, the model and the reported fraud rates" must be audited at least yearly, by an external auditor in the first year and at least every three years.

The RTS has no rule on changing or A/B testing the fraud model. But fraud from a challenger arm counts in the same PSP-wide fraud rate. A worse challenger on a share of traffic directly risks the exemption for all traffic in that band. Fraud models are excluded from AI Act high-risk point 5(b).

### Cited Findings

Commission Delegated Regulation (EU) 2018/389 (RTS on SCA and common and secure open standards of communication). FULL-TEXT. Binding. Applies to payment service providers (banks, payment institutions, e-money institutions). Source: [EUR-Lex 32018R0389](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018R0389).

- Article 2(1): PSPs "shall have transaction monitoring mechanisms in place that enable them to detect unauthorised or fraudulent payment transactions".
- Article 18(1): PSPs may skip SCA for remote electronic transactions "identified by the payment service provider as posing a low level of risk".
- Article 18(2)(a): this requires that the fraud rate "calculated in accordance with Article 19, is equivalent to or below the reference fraud rates" in the Annex.
- Article 18(2)(c): the real-time risk analysis must not have identified abnormal spending patterns, unusual device information, malware, known fraud scenarios, abnormal payer location or high-risk payee location.
- Article 18(3): the assessment "shall combine all those risk-based factors into a risk scoring for each individual transaction".
- Article 19(1): the overall fraud rate covers transactions "authenticated through strong customer authentication and those executed under any of the exemptions". It is calculated "on a rolling quarterly basis (90 days)".
- Article 19(3): "The methodology and any model, used by the payment service provider to calculate the fraud rates, as well as the fraud rates themselves, shall be adequately documented and made fully available to competent authorities and to EBA... upon their request."
- Article 20(1): PSPs "shall immediately report to the competent authorities" where a monitored fraud rate exceeds the reference rate, and describe remedial measures.
- Article 20(2): PSPs "shall immediately cease to make use of the exemption" in a threshold band where the rate "exceeds for two consecutive quarters the reference fraud rate".
- Article 20(3)-(4): re-use requires one compliant quarter, notification, and evidence of restored compliance.
- Article 3(2): PSPs using the Article 18 exemption "shall be subject to an audit of the methodology, the model and the reported fraud rates at a minimum on a yearly basis". In the first year, and at least every 3 years thereafter, the auditor must be "an independent and qualified external auditor".
- Annex reference fraud rates:

| Exemption threshold value | Remote card-based payments | Remote credit transfers |
| --- | --- | --- |
| EUR 500 | 0,01 % | 0,005 % |
| EUR 250 | 0,06 % | 0,01 % |
| EUR 100 | 0,13 % | 0,015 % |

EBA Single Rulebook Q&As on TRA (e.g. 2018_4033, 2018_4034, 2019_4702). SNIPPET only (search summaries). Interpretive, non-binding. The summaries say the fraud rate is calculated per transaction type, not per amount band, and that first-party ("friendly") fraud is excluded. Not verified. Source: [EBA Q&A 2019_4702](https://www.eba.europa.eu/single-rule-book-qa/qna/view/publicId/2019_4702).

AI Act Annex III 5(b) excludes "AI systems used for the purpose of detecting financial fraud" from the credit-scoring high-risk category. FULL-TEXT, see Section 4.

ACPR (2020), on AML models: validation "needs to be performed much more frequently than e.g. in the case of capital requirements models, since drifts may occur in real time". FULL-TEXT, see Section 6.

### Inferences

- A champion/challenger split of a TRA fraud model is permitted. Nothing in the RTS mentions it. But the challenger's errors land in the single PSP-level fraud rate per transaction type. The cost of a bad challenger is therefore a regulatory threshold, not only financial loss.
- Two quarters over the rate end the exemption for the whole band. That forces SCA on all customers in it, which costs conversion.
- Practical consequences, inferred: cap challenger exposure so that even a worst-case challenger fraud rate cannot push the blended rate over the reference rate. Monitor the blended rate continuously, not quarterly. Keep the ability to route all traffic back to the champion (a flag) immediately.
- The model change must sit within the documented "methodology and any model" that the annual audit covers. Swapping models between audits without documentation would leave the audit trail incomplete. This is an inference from Article 3(2) and Article 19(3).
- The data-pipeline point from Section 1 applies here too. The fraud-rate calculation is itself a data pipeline subject to audit (Article 19(2)). Changing its upstream tables changes an audited figure.

### Gaps

- EBA Q&A texts were not read in full. The EBA Opinion on SCA implementation (June 2018) and any EBA statement specifically on changing TRA models were not found.
- The PSD3 / Payment Services Regulation (PSR) negotiations, including any revised fraud-monitoring or TRA provisions, and the adoption status of the political agreement, were not checked in this run. Do not assume the RTS text above has been superseded or not.
