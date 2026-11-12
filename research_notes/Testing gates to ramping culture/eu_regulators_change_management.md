# Continental European regulators and supervisors on production software change at banks, payment institutions and investment firms (2017-2026)

Reading-status tags used throughout:

- FULL-TEXT: I downloaded the document (PDF or HTML) and read the cited passage myself in the extracted text. Quotations are checked against that text.
- TOOL-EXTRACT: read through a page-reading tool that summarises; wording not eyeball-verified.
- SNIPPET: search-result text only. A lead, not evidence; not quoted.
- NOT READ: could not be retrieved.

Instrument types are labelled: Regulation (binding EU law), Delegated Regulation / RTS or ITS (binding EU law), Guidelines (comply-or-explain), national circular or notice (supervisory expectation, binding in practice to varying degrees), supervisory statement or report, speech or article.

Scope note. Sibling files `audit_and_compliance.md` and `rollback_authority.md` already cover EBA/GL/2019/04 paragraphs 70, 72, 75 and the feedback-table "methodology agnostic" remark, PSD2 RTS Article 30(4) (as a tool extract), DORA RTS Articles 8, 16 and 17 (as tool paraphrase), RTS 6 Articles 5, 8, 11 and 12 (as tool extract), and the ECB November 2023 newsletter. These notes re-read all of the EU texts in full from the Official Journal PDFs, quote them exactly, and correct the siblings where my reading differs (see "Corrections to sibling notes" under question 1).

EUR-Lex access: the HTML pages were not used. The PDF endpoint (`https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:...`) returned full Official Journal PDFs for every act requested: 32022R2554, 32024R1774, 32024R1772, 32025R0301, 32025R0302, 32018R0389, 32017R0589 and 32024R0886. All were converted locally with `pdftotext` and read.

## 1. EU DORA and its technical standards: what they require about change, testing, rollback and incident reporting

### Takeaway

DORA and its RTS make change management a binding, all-changes obligation (no materiality threshold) with four hard edges for the essay: approvers independent of requesters and implementers, separated production and non-production environments, testing in production only as an identified, reasoned, time-limited and approved exception, and documented fall-back procedures that include aborting changes. None of the texts mentions staged rollout, canaries, feature flags, release frequency, change freezes or a fixed testing period; they are silent on those, not hostile to them.

### Cited Findings

DORA, Regulation (EU) 2022/2554 (binding Regulation; applies from 17 January 2025, Art. 64: "It shall apply from 17 January 2025."). FULL-TEXT. — [EUR-Lex PDF 32022R2554](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2554)

- Art. 9(4)(e): firms shall "implement documented policies, procedures and controls for ICT change management, including changes to software, hardware, firmware components, systems or security parameters, that are based on a risk assessment approach".
- Art. 9(4)(e), continued: the purpose is "to ensure that all changes to ICT systems are recorded, tested, assessed, approved, implemented and verified in a controlled manner".
- Art. 9(4), final subparagraph (missing from the sibling notes): "the ICT change management process shall be approved by appropriate lines of management and shall have specific protocols in place." The process, not each change, needs management approval here.
- Art. 8(3): firms other than microenterprises "shall perform a risk assessment upon each major change in the network and information system infrastructure, in the processes or procedures affecting their ICT supported business functions".
- Art. 11 (response and recovery): not quoted in detail here; it requires ICT business continuity and response and recovery plans. Art. 17(3)(f) requires "ICT-related incident response procedures to mitigate impacts and ensure that services become operational and secure in a timely manner."
- Art. 12(1): firms must document "backup policies and procedures" and "restoration and recovery procedures and methods" for "restoration of ICT systems and data with minimum downtime, limited disruption and loss".
- Art. 12(2): "Testing of the backup procedures and restoration and recovery procedures and methods shall be undertaken periodically."
- Art. 12(3): when restoring backup data with own systems, firms "shall use ICT systems that are physically and logically segregated from the source ICT system."
- Art. 17(2): firms must ensure "that root causes are identified, documented and addressed in order to prevent the occurrence of such incidents."
- Art. 17(3)(e): at least major incidents are reported to senior management and the management body is informed, "explaining the impact, response and additional controls to be established".
- Art. 24(4): resilience tests must be "undertaken by independent parties, whether internal or external"; internal testers require that "conflicts of interest are avoided throughout the design and execution phases of the test." This is the Chapter IV resilience-testing programme, not per-change testing.
- Art. 24(6): "at least yearly, ... appropriate tests are conducted on all ICT systems and applications supporting critical or important functions."
- Art. 25(1) lists test types including "source code reviews where feasible, scenario-based tests, compatibility testing, performance testing, end-to-end testing and penetration testing." No duration or environment count.
- Art. 25(2): central securities depositories and central counterparties "shall perform vulnerability assessments before any deployment or redeployment" of applications and infrastructure supporting critical or important functions.
- Art. 30(3)(b) (contracts for ICT services supporting critical or important functions): "notice periods and reporting obligations of the ICT third-party service provider to the financial entity, including notification of any development that might have a material impact" on service delivery. This is the vendor-change hook.
- Art. 35(1)(d)(i): the Lead Overseer of a critical ICT third-party provider may issue recommendations on "the roll-out of patches, updates, encryption and other security measures". The only "roll-out" in DORA concerns critical providers, not financial entities.
- Art. 16(1): Articles 5 to 15 do not apply to "small and non-interconnected investment firms, payment institutions exempted pursuant to Directive (EU) 2015/2366", exempted e-money institutions and some others, who follow the simplified framework.
- Term counts in the full DORA text: "canary" 0, "feature flag" 0, "toggle" 0, "staged" 0, "phased" 0, "release" 0, "freeze" 0, "agile" 0, "DevOps" 0, "rollback" 0.

Commission Delegated Regulation (EU) 2024/1774, RTS on the ICT risk management framework and simplified framework (binding RTS; OJ L 25.6.2024). FULL-TEXT. — [EUR-Lex PDF 32024R1774](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774)

- Recital 10: "considering current ICT system development practices, in exceptional circumstances, financial entities should be allowed to test in production environments, provided that they justify such testing and obtain the required approval."
- Art. 8(2)(b)(v)-(vii): ICT operations policies must contain "requirements on the separation of ICT production environments from the development, testing, and other non-production environments"; "requirements to conduct the development and testing in environments which are separated from the production environment"; and "requirements to conduct the development and testing in production environments".
- Art. 8(2), closing subparagraph, exact text (two quotations, consecutive): "For the purposes of point (b)(vii), the policies and procedures referred to in paragraph 1 shall provide that the instances in which testing is performed in a production environment are clearly identified, reasoned, are for limited periods of time,"
- ... "and are approved by the relevant function in accordance with Article 16(6). Financial entities shall ensure the availability, confidentiality, integrity, and authenticity of ICT systems and production data during development and test activities in the production environment."
- Art. 8(2), separation scope: "the separation shall consider all of the components of the environment, including accounts, data or connections".
- Art. 8(2)(c)(iii): error handling must include "ICT system restart, rollback, and recovery procedures for use in the event of ICT system disruption." (The only "rollback" in the RTS.)
- Recital 15: project policies apply "regardless of the ICT project management methodology chosen by the financial entity"; firms "should adopt testing practices and methods that suit their needs, while adhering to a risk-based approach".
- Recital 17: "Changes, regardless of their scale, carry inherent risks". To prevent conflicts of interest "it is necessary to separate the functions responsible for approving those changes from the functions that request and implement those changes."
- Recital 17, on fall-back: firms "should clearly identify those fallback procedures and assign responsibilities to ensure a swift and effective response in the event of unsuccessful ICT changes."
- Art. 15(3)(f)-(g): the project management policy must contain "change management requirements" and "the testing of all requirements, including security requirements, and the respective approval process when deploying an ICT system in the production environment."
- Art. 16(2): a procedure "for the testing and approval of all ICT systems prior to their use and after maintenance"; "The level of testing shall be commensurate to the criticality of the business procedures and ICT assets concerned."
- Art. 16(3): the procedure "shall contain the performance of source code reviews covering both static and dynamic testing", with security testing for internet-exposed systems.
- Art. 16(5)(a): "non-production environments only store anonymised, pseudonymised, or randomised production data". Art. 16(6) derogation: production data may be stored "only for specific testing occasions, for limited periods of time, and following the approval by the relevant function and the reporting of such occasions to the ICT risk management function."
- Art. 16(8): third-party and open-source code is "to be analysed and tested ... prior to their deployment in the production environment."
- Art. 17(1), scope: applies "in respect of all changes to software, hardware, firmware components, systems, or security parameters".
- Art. 17(1)(b): "mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes".
- Art. 17(1)(c): roles ensuring "(i) changes are specified and planned; (ii) an adequate transition is designed; (iii) the changes are tested and finalised in a controlled manner; (iv) there is an effective quality assurance".
- Art. 17(1)(d): documentation and communication of "the purpose and scope of the change", "the timeline for the implementation of the change" and "the expected outcomes".
- Art. 17(1)(e): "the identification of fall-back procedures and responsibilities, including procedures and responsibilities for aborting changes or recovering from changes not successfully implemented".
- Art. 17(1)(f)-(g): "procedures, protocols, and tools to manage emergency changes that provide adequate safeguards"; "procedures to document, re-evaluate, assess, and approve emergency changes after their implementation, including workarounds and patches".
- Art. 17(1)(h): identify a change's potential impact on existing ICT security measures.
- Art. 17(2): after "significant changes", CCPs and CSDs "shall submit their ICT systems to stringent testing by simulating stressed conditions", involving members, clients or users as appropriate.
- Simplified framework, Art. 37(b): entities under DORA Art. 16 must "ensure the testing and approval of ICT systems prior to their first use and before introducing changes to the production environment".
- Simplified framework, Art. 38(2): an ICT change management procedure "to ensure that all changes to ICT systems are recorded, tested, assessed, approved, implemented, and verified in a controlled manner and with the adequate safeguards". There is no independence-of-approver clause and no testing-in-production clause in the simplified framework.
- Term counts in the RTS: "canary", "feature flag", "toggle", "staged", "phased", "release", "freeze", "agile", "DevOps" all 0; "rollback" 1; "fall-back/fallback" 3; "testing in production / test in production" 2.

Commission Delegated Regulation (EU) 2024/1772, RTS on classification of ICT-related incidents (binding RTS). FULL-TEXT. — [EUR-Lex PDF 32024R1772](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1772)

- Art. 8(1): an incident is major where it "has affected critical services" and either the Art. 9(5)(b) threshold (successful malicious unauthorised access) is met, or "two or more of the other materiality thresholds referred to in Articles 9(1) to (6) are met."
- Art. 8(2), recurring incidents: individually non-major incidents count as one major incident where they "have occurred at least twice within 6 months", "have the same apparent root cause", and collectively meet the criteria. Firms "shall assess the existence of recurring incidents on a monthly basis."
- Art. 9(1) client thresholds include "the number of affected clients is higher than 10 % of all clients using the affected service" or "higher than 100 000"; affected transactions above 10% of daily average number or value.
- Art. 9(3): duration "longer than 24 hours" or "service downtime is longer than 2 hours for ICT services that support critical or important functions."
- Art. 9(5)(a) data losses: any impact on "availability, authenticity, integrity or confidentiality of data" that has an adverse impact on business objectives or regulatory compliance. Art. 9(6): costs and losses above EUR 100 000.

Commission Delegated Regulation (EU) 2025/301 (RTS on content and time limits for incident reports) and Commission Implementing Regulation (EU) 2025/302 (ITS on templates). FULL-TEXT. — [EUR-Lex PDF 32025R0301](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32025R0301); [EUR-Lex PDF 32025R0302](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32025R0302)

- RTS 2025/301 Art. 5(1)(a): initial notification "within four hours from the classification of the ICT-related incident as a major ICT-related incident and no later than 24 hours from the moment the financial entity has become aware".
- Art. 5(1)(b): intermediate report "at the latest within 72 hours from the submission of the initial notification". Art. 5(1)(c): final report "no later than one month after" the intermediate report.
- ITS 2025/302, Annex II, data field 4.3 "Additional classification of root causes": under "Insufficient or failure of ICT operations and ICT security operations" the choices include "(b) change management" and "(e) backup and restore"; under inadequate acquisition, development and maintenance the list includes "insufficient or failure of software testing." Change-caused major incidents are therefore reported under a named category in the final report.
- Neither the RTS nor the ITS mentions deployment method, canary, rollout or flags.

What I could not read: nothing in the EU legal texts was unreadable. I did not separately read DORA Art. 11 in full or the DORA RTS on TLPT.

### Inferences

- Where the rules constrain the essay:
  - Independent approval is binding for full-framework entities (RTS 17(1)(b)). A same-team peer reviewer approving a change he or she also requested or implemented is hard to square with "independence of the functions"; a reviewer who neither requested nor implemented the change, with the pipeline as the implementer, is the defensible reading. The RTS does not say what a "function" is. BaFin's guidance (question 4) says the RTS "does not describe or require the implementation of a concrete process."
  - Testing in production is permitted only as a documented exception (RTS 8(2), recital 10). The essay should not describe dark launches and canaries as "testing in production" without adding that, under DORA, such instances must be identified, reasoned, time-limited and approved. The safer framing is that the change has been tested before deployment and the canary is a controlled transition and verification step (RTS 17(1)(c)(ii) "adequate transition"), with exposure limits and abort criteria. Whether a supervisor accepts that framing is untested; I found no supervisory statement either way.
  - Shadow traffic or replaying production data into test environments runs into RTS 16(5)-(6): production data in non-production only for specific occasions, time-limited, approved and reported to the ICT risk function.
  - All changes are in scope, including "security parameters" (DORA 9(4)(e); RTS 17(1)). A production flag flip that changes behaviour is a change to be recorded; the defensible route is a pre-approved change type, not exclusion.
- Where the rules help the essay:
  - Fall-back must include "aborting changes" (RTS 17(1)(e)) and error handling must include "rollback" (RTS 8(2)(c)(iii)). Kill switches, abort criteria and rehearsed rollback map directly onto these.
  - Emergency changes may be approved after implementation (RTS 17(1)(g)); rollback-first under a pre-agreed procedure fits.
  - Recital 15's methodology neutrality and Art. 16(2)'s "commensurate to the criticality" testing support risk-based, automated testing rather than a fixed test period.
- Incident reporting interacts with staged rollout. The client and transaction thresholds (10%, 100 000 clients; 10% of daily transactions) and the 2-hour downtime threshold mean that a defect caught at a small ramp stage and rolled back in minutes may fall short of two thresholds and stay non-major. But the recurring-incident rule (twice in six months, same apparent root cause) can aggregate small change-caused incidents into a reportable major one. This is my reading of the RTS mechanics; no supervisor has said it.
- No EU text requires or forbids staged rollout, feature flags, a release cadence or a fixed testing period.

### Corrections to sibling notes

- `audit_and_compliance.md` gives DORA RTS Art. 8(2)(b) and Art. 17(1)(b) as tool paraphrase. Exact text is above; the testing-in-production rule is the closing subparagraph of Art. 8(2) relating to point (b)(vii), and it adds "approved by the relevant function in accordance with Article 16(6)" and a duty to protect production data during such tests.
- The sibling's DORA 9(4)(e) citation omits the final subparagraph requiring the change management process to be "approved by appropriate lines of management".
- The sibling cites EBA/GL/2019/04 paragraphs 70, 72 and 75 as live requirements. Since 20 May 2025 section 3.6 (and all of 3.1-3.7) has been deleted for DORA-scope entities (question 2). They are correct as history (2020-2025) only.
- `audit_and_compliance.md` says MAS is "the one text I read that names a CAB as an expectation". The ECB's IT Risk Questionnaire assessment criteria (question 3) ask whether "Significant changes are scheduled for implementation and approved by a dedicated management committee", and DNB's 2019/2020 Good Practice lists a CAB as an example (question 4).
- `rollback_authority.md` quotes RTS 6 from a tool extract; the quotations of Arts. 5(2), 8, 11(1) and 12(1)-(3) match the Official Journal text I read (question 6).

### Gaps

- No supervisory guidance found on whether a canary or dark launch counts as "testing in production" under RTS Art. 8(2).
- The ESAs' DORA Q&A database was not searched for change-management or testing-in-production questions.

## 2. EBA Guidelines on ICT and security risk management, their status after DORA, and vendor change

### Takeaway

EBA/GL/2019/04 section 3.6.3 (all changes "recorded, tested, assessed, approved, implemented and verified in a controlled manner") applied from 30 June 2020; the EBA's amending Guidelines EBA/GL/2025/02 (11 February 2025, applying from 20 May 2025) deleted sections 3.1 to 3.7, including change management, and kept only section 3.8 on payment service user relationship management. For DORA-scope entities the EBA change-management guidance is now history; DORA and RTS 2024/1774 replace it.

### Cited Findings

- EBA/GL/2019/04 section 3.6.3, para 75, and the feedback-table remark that the guidelines "intend to be technology and methodology agnostic": already read in full in `audit_and_compliance.md` (FULL-TEXT there). I did not re-read the 2019 final report.
- EBA, Consolidated version of EBA/GL/2019/04, dated 19 May 2026 (Guidelines; comply-or-explain). FULL-TEXT. The cover table lists application date "30.06.2020" and "Amended by: A1 EBA/GL/2025/02 20.05.2025". — [EBA consolidated version PDF](https://eba.europa.eu/sites/default/files/2026-05/c8fb6168-0aef-42f6-8da9-114a8baf21b9/Consolidated%20version%20of%20EBA%20ameding%20Guidelines%20on%20ICT%20and%20security%20risk%20management.pdf)
  - Para 5 (A1): the guidelines are "based on the mandate to issue guidelines under Article 95(3) of Directive (EU) 2015/2366 and cover aspects of payment user relationship management."
  - Para 6 (A1): they "complement the risk management measures under Digital Operational Resilience Act (DORA) and the related Regulatory Technical Standards".
  - Section heading "3.6. ICT project and change management" is followed by "[deleted]"; sections 3.1-3.7 and the definitions are marked deleted; section 3.8 "Payment service user relationship management" remains.
- EBA press release on the amendment and the date 11 February 2025: SNIPPET. — [EBA press release](https://eba.europa.eu/publications-and-media/press-releases/eba-amends-its-guidelines-ict-and-security-risk-management-measures-context-dora-application)
- Banca d'Italia's 51st update to Circular 285 (3 February 2026) describes EBA/GL/2025/02 as having "abrogato in larga parte" EBA/GL/2019/04, keeping only the paragraphs on payment-service-user relationships. FULL-TEXT. — [Banca d'Italia, atto di emanazione, 51st update (dirittobancario copy)](https://www.dirittobancario.it/wp-content/uploads/2026/02/Atto-di-emanazione-del-51mo-aggiornamento-Banca-dItalia-03-febbraio-2026.pdf)
- The EBA PSD2 security-measures Guidelines (EBA/GL/2017/17) were folded into EBA/GL/2019/04: SNIPPET only (search summary of the EBA material). Not verified at source.
- The EBA definition of ICT and security risk survives in national texts that copied it. CSSF Circular 20/750 (as amended) defines it to include "inability to change information technology (IT) within a reasonable time and with reasonable costs when the environment or business requirements change (i.e. agility)". FULL-TEXT. — [CSSF 20/750 consolidated, English](https://www.cssf.lu/wp-content/uploads/cssf20_750eng.pdf)
- Vendor changes: the EBA Outsourcing Guidelines (EBA/GL/2019/02) were NOT READ in this pass. For DORA entities the binding hook is DORA Art. 30(3)(b) (question 1).

### Inferences

- Any essay sentence that cites the EBA ICT Guidelines as a current requirement for banks or payment institutions should be dated: "2020-2025, now replaced by DORA". The methodology-agnostic remark remains useful as evidence of supervisory intent, and DORA RTS recital 15 carries the same idea forward in binding text.
- The EBA definition treating the inability to change IT quickly ("agility") as part of ICT risk is a rare supervisory text that frames slow change as a risk, not only fast change. It survives in Luxembourg's CSSF 20/750 for non-DORA entities. I did not check whether the DORA definitions keep it; the DORA definition was not examined.

### Gaps

- EBA/GL/2019/02 (outsourcing) paragraphs on service-provider changes and notification were not read.
- I did not read EBA/GL/2025/02 itself (only the consolidated version).

## 3. ECB Banking Supervision (SSM): priorities, data on change-caused incidents, and what it asks banks

### Takeaway

The ECB has said every year since at least 2023 that IT change is the main cause of downtime at significant banks; DORA reporting showed 38% of major incidents reported by banks in 2025 had "IT change" as root cause, and the 2026-28 priorities include a targeted review of ICT change management. The ECB's own assessment criteria (IT Risk Questionnaire) still describe a traditional model: a management committee approving significant changes, deployment only by authorised production teams, and a release management team. A July 2026 letter asks for change management that enables "rapid, risk-based remediation", which is the closest the ECB comes to the essay's argument.

### Cited Findings

- ECB, "Annual report on the outcome of the SREP IT Risk Questionnaire", July 2020 (supervisory report). FULL-TEXT. IT change risk "refers to the uncontrolled release of software/IT systems/hardware (new versions or patches) in production". Risk level is based on "the frequency of changes to critical IT systems (from low to high frequency)", using indicators including "the number of changes in critical IT environments, the number of changes that have caused issues in the production environment". — [ECB ITRQ outcome report 2020](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.aroutcomesrepitriskquestionnaire202007~9ed9aaa17d.en.pdf)
- Same report: in the 2018 reference year, "the largest institutions reported the highest numbers of implemented changes to their critical IT systems." Note that the ECB's risk-level indicator treats higher change frequency as higher inherent risk.
- ECB, "IT and cyber risk" SREP 2023 slides (supervisory publication). FULL-TEXT. "While the average number of critical projects increased by a further 15% in 2022, the number of IT changes causing issues in production environments decreased both absolutely and as a share of all IT changes reported." Also: "Changes and software issues were again identified as the root cause for critical services downtime." The chart percentages did not survive text extraction. — [ECB SREP 2023 IT and cyber risk](https://www.bankingsupervision.europa.eu/activities/srep/2023/html/ssm.srep2023_ITandcyberrisk.en.pdf)
- ECB Supervision Newsletter, 15 November 2023. FULL-TEXT (sibling had TOOL). "banks reported a decrease in the number of changes that caused production environment issues. However, IT changes and software issues were again identified as the root cause behind critical services downtime. Banks therefore need to further strengthen governance and processes around change management." — [ECB newsletter Nov 2023](https://www.bankingsupervision.europa.eu/press/publications/newsletter/2023/html/ssm.nl231115.en.html)
- ECB, "IT and cybersecurity risks – key observations in 2024", annex to the 13 November 2024 newsletter. FULL-TEXT. "IT changes are still by far the most important reason for downtime"; "almost all banks reported that key risk controls around change and release management were generally implemented." — [ECB 2024 annex](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/annex/ssm.nl241113_4_annex.en.pdf)
- Same annex: "on-site inspections identified specific weaknesses in change management processes, including inadequate documentation, testing and approval of the relevant changes prior to deployment."
- ECB, IT Risk Questionnaire 2025 (published template, reference period 2024). FULL-TEXT. Question 35 asks "What is your main current operating model for ICT project management?" with options "Waterfall, Agile, DevOps, Other". — [ECB ITRQ 2025](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf)
- Same ITRQ, questions 23-23e: number of changes in production environments hosting critical systems, of which "emergency changes", of which "changes that caused issues", and the "three main root causes of changes with issues" from a list: "Unexpected interdependencies between applications, Wrong configuration, Misalignment between test and production environment, Inadequate test coverage, Vendor Patches that caused issues, Other".
- Same ITRQ, risk-control maturity criteria 22.1-22.9, "ICT change and release management" (assessment criteria for self-scoring; not law). Exact wording:
  - 22.3: "Significant changes are scheduled for implementation and approved by a dedicated management committee."
  - 22.4: "Segregation of duties is applied throughout the different phases of the change process."
  - 22.5: test environments "adequately reflect the production environment" and do not contain confidential production data.
  - 22.6: "The deployment of changes into production environment is only conducted by authorised production teams after a formal change approval."
  - 22.8: emergency changes handled "in a controlled environment and only upon formal documented approval."
  - 22.9: "A release management team that directs the ICT departments' decisions about production setting, ensuring a holistic view of changes to ICT systems, is in place."
- ECB, "Supervisory priorities 2026-28" (November 2025). FULL-TEXT. "as the primary root cause of unplanned downtime in banks often lies in ICT system changes, ECB Banking Supervision will conduct a targeted review of ICT change management to identify gaps in basic control frameworks". — [ECB priorities 2026-28](https://www.bankingsupervision.europa.eu/framework/priorities/pdf/ssm.supervisory_priorities202511.en.pdf)
- Anneli Tuominen (ECB Supervisory Board), "Upgrading banks' capacity to deal with digital risks", Eurofi Magazine contribution, 24 March 2026 (article by a supervisor). FULL-TEXT. "38% of the major incidents reported by banks in 2025 had "IT change" as their root cause." And: "it is also necessary to strengthen processes and controls so that banks can meaningfully reduce unplanned downtime". — [ECB, Tuominen 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html)
- ECB letter to significant institutions on AI-enabled cybersecurity threats, SSM-2026-0301, 7 July 2026 (supervisory letter). FULL-TEXT. "ICT change management arrangements that enable rapid, risk-based remediation while maintaining operational stability can support the effective prioritisation of emergency changes, critical fixes, internet-facing systems and critical internal systems." — [ECB letter, July 2026](https://www.bankingsupervision.europa.eu/press/letterstobanks/shared/pdf/2026/ssm.2026_letter_on_AI_enabled_cybersecurity_threats.en.pdf)
- Same letter: "Preparation for more frequent and higher-volume patching may become increasingly important as vendors and open-source communities ... identify and remediate vulnerabilities faster".
- ECB cyber resilience stress test 2024 (press release 26 July 2024): 109 banks, scenario of a successful cyberattack; tested response and recovery, not change practice. SNIPPET only for findings. — [ECB press release](https://www.bankingsupervision.europa.eu/press/pr/date/2024/html/ssm.pr240726~06d5776a02.en.html)
- Patrick Montagner (ECB Supervisory Board), speech, 2 July 2025, "Information and Communications Technology resilience and reliability". FULL-TEXT. Focus on recovery, backups and legacy systems; no statement on change or release practice. — [ECB speech](https://www.bankingsupervision.europa.eu/press/speeches/date/2025/html/ssm.sp250702~3f15a64e12.en.html)

### Inferences

- The ECB's prior is "change causes downtime, so strengthen change controls". The 38% figure is the strongest continental number for the essay and should be quoted with its source (a supervisor's article, not a statistical release).
- The ITRQ criteria are the yardstick JSTs actually use, and they describe central release management and production teams doing deployments. A bank whose developers deploy through a pipeline should expect to explain how the pipeline is the "authorised production team" and how pre-approved change models count as "formal change approval". The criteria do not say this; it is my inference about how a bank would answer.
- The ITRQ root-cause list ("misalignment between test and production environment", "inadequate test coverage", "unexpected interdependencies") is the supervisor's own taxonomy of why changes fail. Two of the five are problems that pre-production testing cannot fully solve, which supports the essay's case for production verification at low exposure, but the ECB draws no such conclusion.
- The July 2026 letter's "rapid, risk-based remediation while maintaining operational stability" is a supervisory request for fast, safe change. It is about patching, not feature delivery.
- The 2020 methodology scores higher change frequency as higher inherent risk. That is in tension with the essay's claim that small frequent changes reduce risk. The essay should acknowledge it.

### Gaps

- No ECB statement found on canary releases, feature toggles, release trains or continuous delivery, positive or negative.
- The 2025 horizontal IT-risk key observations (if published) were not found; the 2024 annex is the latest read.
- Chart values in the 2023 slides (share of banks naming changes as top root cause) were lost in extraction.
- The 2024 cyber stress test findings were not read beyond the press release snippet.

## 4. National supervisors: primary texts on change management, testing and release practice

### Takeaway

National texts converge on DORA's elements but differ in tone. Germany (BAIT/MaRisk) required independent testers, test environments matching production, reversal plans, and approval by business and IT; BaFin's 2024 cloud notice is the only continental text found that names CI/CD pipelines and automated tests as means of meeting segregation of duties. France's ACPR moved from describing batched weekend releases (2018 discussion paper) to accepting agile methods and automated change processes (2021 notice). Italy required change management under a structure highly independent of development, with formal authorisation of every production change, until February 2026. Switzerland's FINMA requires separated environments and testing by criticality. Sweden fined Swedbank SEK 850 million for a change made outside its own procedures; Norway's supervisor warns about unclear criteria for pre-approved changes.

### Cited Findings

#### Germany: BaFin (BAIT, MaRisk, ZAIT, DORA transition, cloud notice, Postbank)

- BaFin, Circular 10/2017 (BA), BAIT, English version "in the version of 16 December 2024" (national circular; administrative guidance interpreting § 25a KWG). FULL-TEXT. The English version "is provided for information purposes only. The original German text is binding in all respects." — [BaFin BAIT English PDF](https://www.bafin.de/SharedDocs/Downloads/EN/Rundschreiben/dl_rs_1710_ba_BAIT_en.pdf?__blob=publicationFile&v=6)
  - 2.4 (IT governance): "Conflicts of interest and activities that are not compatible with each other must be avoided"; explanation: conflicts "between activities connected, for example, with application development and tasks performed by IT operations can be countered by taking organisation or operational measures and/or by defining roles adequately."
  - 7.6: "Appropriate processes must be defined for application development which contain specifications for ... quality assurance, and for testing, approval and release."
  - 7.7 explanation: requirements documents "may differ depending on the model procedure and may include, for example: ... user story/product backlog." (BAIT accommodates agile artefacts.)
  - 7.11: "A methodology for testing applications prior to their first use and after material modifications must be defined and introduced." The responsible organisational units "must be responsible for performing acceptance tests. Test environments for performing the acceptance tests must correspond to the production environment in aspects material to the test."
  - 7.11 explanation: "Performance of the tests requires relevant expertise on the part of the testers as well as appropriately structured independence from the application developers."
  - 7.11: "Test activities and test results must be documented." Minimum test documentation includes test case description, test data, expected and actual result.
  - 7.12: "After the application goes live, any deviations from standard operations must be monitored, their causes must be investigated".
  - 8.4: "The processes for changing IT systems must be designed and implemented depending on their nature, scale, complexity and riskiness." Examples of changes include "changing configuration settings of IT systems".
  - 8.5: "Changes to IT systems must be accepted, documented, evaluated taking due account of potential implementation risks, prioritised and approved in an orderly way, and implemented in a coordinated and secure way." Also: "Appropriate processes must also be established for time-critical changes".
  - 8.5 explanation, examples of secure implementation steps: "testing of changes prior to going live"; "reversal plans to enable an earlier version of the IT system to be restored if a problem occurs during or after going live"; "alternative recovery options to allow the failure of primary reversal plans to be countered."
  - 8.5 explanation: "For low-risk configuration changes/parameter settings ... different process rules/checks can be defined (e.g. dual control principle, documentation of changes or of downstream checks)."
- German original terms (from my knowledge of the German BAIT, not re-read in this pass): "Anwendungsentwicklung" (application development), "IT-Betrieb" (IT operations), "Änderungen von IT-Systemen" (changes to IT systems), "Abnahme" (acceptance). Treat as orientation, not quotation.
- MaRisk AT 7.2 item 3 (Minimum Requirements for Risk Management; national circular). English annotated text, version of 16.08.2021, FULL-TEXT: "The IT systems shall be tested before their first use and after any material changes and approved by both the responsible organisational unit staff and IT staff." — [BaFin MaRisk English 2021](https://www.bafin.de/SharedDocs/Downloads/EN/Rundschreiben/rs_1021_marisk_ba_en.pdf?__blob=publicationFile)
  - Same item: "a standard process of development, testing, approval and implementation in the production processes shall be established. The production and testing environments shall be segregated."
  - Explanation: "The assessment of the materiality of changes shall be based not on the extent of changes but on the impact they may have on the functioning of the IT system concerned."
- MaRisk AT 7.2 item 3, German, Circular 05/2023 (BA), FULL-TEXT: "Die IT-Systeme sind vor ihrem erstmaligen Einsatz und nach wesentlichen Veränderungen zu testen und von den fachlich sowie auch von den technisch zuständigen Mitarbeitern abzunehmen." And: "Produktions- und Testumgebung sind dabei grundsätzlich voneinander zu trennen." My translation: "Production and test environments are in principle to be separated from one another." The word "grundsätzlich" (in principle, admitting exceptions) is missing from BaFin's English rendering ("shall be segregated"). — [MaRisk 05/2023, Bundesbank-hosted PDF](https://www.bundesbank.de/resource/blob/894796/f212b38ad95ca0a88254ba03b9906392/mL/2023-06-09-rundschreiben-data.pdf)
- BaFin letter to industry associations, "Aufhebung der Aufsichtlichen Anforderungen an die IT" (letterhead date 19.12.2024; file name dated 10 January 2025). FULL-TEXT. "werden daher die KAIT, VAIT und ZAIT vollständig zum 17.01.2025 und die BAIT schrittweise zum 31.12.2026 aufgehoben." My translation: KAIT, VAIT and ZAIT are repealed in full as of 17 January 2025 and BAIT in stages by 31 December 2026. — [BaFin Informationsschreiben](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/dl_250110_Informationsschreiben.pdf?__blob=publicationFile&v=1)
  - Same letter: "Mit Ablauf des 16.01.2025 werden Institute, die ab dem 17.01.2025 ein IKT-Risikomanagement nach Art. 5-15 oder Art. 16 DORA betreiben müssen, aus dem Anwenderkreis der BAIT ausgenommen." My translation: from the end of 16 January 2025, institutions that must run ICT risk management under DORA Arts. 5-15 or 16 are removed from BAIT's scope. Chapter 11 of BAIT is repealed in full.
  - Same letter: "Die KAIT, VAIT und ZAIT treten mit Ablauf des 16.01.2025 außer Kraft." And: "Mit Ablauf des 31.12.2026 treten die BAIT vollständig außer Kraft." BAIT continues meanwhile for firms that enter DORA only from 1 January 2027 under the amended § 1a(2) KWG.
- BaFin press notice, "DORA kommt: Änderungen bei den aufsichtlichen Anforderungen an die IT", 10 January 2025. FULL-TEXT. Same content: KAIT, VAIT, ZAIT repealed "mit Ablauf des 16. Januar 2025"; BAIT "schrittweise" repealed; "Mit Ablauf des 31. Dezember 2026 werden die BAIT daher vollständig aufgehoben." — [BaFin notice 10 Jan 2025](https://www.bafin.de/SharedDocs/Veroeffentlichungen/DE/Meldung/2025/meldung_2025_01_09_DORA.html)
- ZAIT (payment and e-money institutions) and VAIT text: NOT READ in this pass. Only their repeal is verified.
- BaFin, "Guidance notes on the implementation of DORA for ICT risk management and ICT third-party risk management", supervisory statement, June 2024, English translation. FULL-TEXT. — [BaFin DORA guidance notes (EN)](https://www.bafin.de/SharedDocs/Downloads/EN/Anlage/dl_2024_07_08_Aufsichtsmitteilung_Umsetzungshinweise_DORA_en.pdf?__blob=publicationFile&v=3)
  - 3.3: "The previous assessment was limited to significant changes. In future, this limitation will no longer apply." Firms "must now consider a significantly greater volume of changes than previously."
  - 5.3, on RTS Art. 17(1)(b): the RTS "refers here, inter alia, to the separation of functions and roles ... as part of the change approval process. It does not describe or require the implementation of a concrete process."
  - 5.3: "RTS RMF no longer distinguishes between a material and non-material change."
  - 5: "DORA specifies fewer details and examples in relation to ICT project and change management. Instead, the level of security is defined by means of minimum requirements, but there is greater freedom as regards implementation."
  - 5.2: "Unlike the BAIT/VAIT, there are no longer any requirements relating to stress scenarios or documentation of testing." But Art. 17 "requires an effective testing procedure, including quality assurance ..., which does suggest documentation."
- BaFin, "Aufsichtsmitteilung zu Auslagerungen an Cloud-Anbieter", updated February 2024 (supervisory notice). FULL-TEXT. — [BaFin cloud notice Feb 2024](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/Aufsichtsmitteilung/dl_2024_02_01_Aenderung_Orientierungshilfe_Cloud.pdf?__blob=publicationFile&v=4)
  - Section 1.1: "Cloud-Anwendungen werden häufig mit agilen Methoden unter Einsatz von DevOps und DevSecOps-Prinzipien entwickelt." My translation: cloud applications are often developed with agile methods using DevOps and DevSecOps principles.
  - Same section: segregation of duties must not be violated; "Dies kann teilweise durch ablauforganisatorische Maßnahmen oder den Einsatz von technischen Hilfsmitteln, z.B. von CI/CD-Pipelines, oder automatisierten Tests unterstützt werden." My translation: this can be supported in part by process measures or technical aids, for example CI/CD pipelines or automated tests.
  - Same section: "Unabhängig von einer möglichen automatisierten Testabwicklung können risikoorientiert weiterhin manuelle Prüfungshandlungen, z.B. Code-Reviews, notwendig sein." My translation: regardless of automated testing, manual checks such as code reviews may still be necessary on a risk basis.
  - Section 1.3: to avoid unapproved changes to standard configurations, access to cloud environments should be restricted and "nach Möglichkeit nur über den programmatischen Aufruf von APIs stattfinden („Infrastructure-as-Code")".
- Postbank / Deutsche Bank, 2023 (consumer-protection measure). FULL-TEXT of BaFin notices. BaFin observed "considerable disturbances in the handling of customer business at Postbank" since the turn of 2022/2023, including disruptions to online and mobile banking; on 29 September 2023 BaFin "appointed a special representative" to monitor Deutsche Bank. BaFin: "the availability of online banking must be ensured to allow customers to carry out banking transactions at all times." — [BaFin notice, Postbank](https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Verbrauchermitteilung/weitere/2023/meldung_2023_09_04_Postbank_en.html); [BaFin special representative](https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Verbrauchermitteilung/weitere/2023/meldung_2023_10_02_Deutsche_Bank_Postbank_en.html)
  - Neither BaFin notice mentions an IT migration as the cause. Press accounts link the disruption to Postbank's IT migration, but I did not read a supervisory source saying so; do not cite this as a change-caused incident on BaFin's authority.

#### France: ACPR / Banque de France

- ACPR, "Notice relative à la gestion du risque informatique pour les entreprises du secteur de la banque, des services de paiement et des services d'investissement", version of 7 July 2021 (supervisory notice explaining the amended arrêté of 3 November 2014, which transposed EBA/GL/2019/04). FULL-TEXT, French. — [ACPR notice 2021](https://acpr.banque-france.fr/system/files/import/acpr/media/2021/07/08/20210707_notice_risque_it.pdf)
  - Point 14 (project management): firms should adopt a project framework "compatible avec les éléments précédents y compris en mode « agile » (méthode de type Scrum par exemple)." My translation: compatible with the foregoing, including in "agile" mode (a Scrum-type method, for example).
  - Point 17 quotes Art. 270-5 of the arrêté: a change process "garantissant que les modifications apportées aux systèmes informatiques sont enregistrées, testées, évaluées, approuvées et implémentées de façon contrôlée".
  - Point 17: applied "de façon proportionnée à leur ampleur, et sans que le recours à des processus de gestion des changements automatisés ne conduise à diminuer le contrôle des changements opérés." My translation: proportionately to their scale, and without the use of automated change management processes leading to reduced control over the changes made.
  - Point 17, good practice: the process "peut définir les typologies de changement, y compris donc les changements standards et les changements urgents"; it should describe phases including "les tests, les conditions de retour arrière, ainsi que les différentes versions (« releases »)". My translation: it may define change types, including standard and urgent changes; phases include testing, rollback conditions and releases.
  - Point 17: "Pour les changements les plus importants, des recettes fonctionnelles et techniques exhaustives et formalisées sont encouragées". My translation: for the most significant changes, exhaustive and formalised functional and technical acceptance testing is encouraged.
- ACPR, "Le risque informatique", Document de réflexion, March 2018 (discussion paper; not binding). FULL-TEXT, French, section "Gestion des changements" (around pp. 31-32). — [ACPR 2018 discussion paper](https://acpr.banque-france.fr/system/files/import/acpr/medias/documents/818013_acpr_risque-informatique_web_fr_v3.pdf)
  - "De telles politiques prévoient par exemple que les mises en production sont regroupées en lot plutôt qu'exécutées unitairement." My translation: such policies provide, for example, that production releases are grouped in batches rather than executed one by one.
  - "Un calendrier de changement est normalement mis en œuvre avec l'objectif de les regrouper sur des périodes où le personnel expérimenté est présent et en dehors des périodes normales de services (week-end par exemple)." My translation: a change calendar is normally used to group them in periods when experienced staff are present and outside normal service hours (weekends, for example).
  - Same section: deployment procedures "incluent des méthodes de retour arrière en cas de défaut". My translation: include rollback methods in case of failure.

#### Italy: Banca d'Italia

- Circular 285, Part I, Title IV, Chapter 4, Section IV bis "La gestione dei progetti e dei cambiamenti ICT", as in the 40th update of 2 November 2022 (national prudential rules transposing EBA/GL/2019/04). FULL-TEXT of the update as hosted by dirittobancario.it (a copy of the official text). — [Circ. 285, 40th update](https://www.dirittobancario.it/wp-content/uploads/2022/11/Circolare-Banca-dItalia-n.-285-del-17-dicembre-2013-Aggiornamento-n.-40-del-2-novembre-2022.pdf)
  - "Il processo per la gestione dei cambiamenti ICT si svolge sotto la responsabilità di una figura o struttura aziendale con elevato grado di indipendenza rispetto alla funzione di sviluppo". My translation: the ICT change process is the responsibility of a person or unit with a high degree of independence from the development function.
  - It provides, proportionately, "l'autorizzazione formale di ogni cambiamento in ambiente di produzione"; footnote: "Il livello autorizzativo è adeguato all'entità dei rischi emersi nell'analisi." My translation: formal authorisation of every change in the production environment; the authorisation level matches the risks identified.
  - Wide-impact initiatives (e.g. major changes to critical components, mergers, "migrazione ad altre piattaforme informatiche") "sono preventivamente comunicate alla Banca centrale europea o alla Banca d'Italia." My translation: are notified in advance to the ECB or the Bank of Italy.
- 51st update, 3 February 2026 (Gazzetta Ufficiale no. 40, 18 February 2026 per SNIPPET). FULL-TEXT of the act of issue. It repeals the Chapter 4 sections on ICT governance, ICT and security risk management, "sulla gestione dei progetti e dei cambiamenti ICT" and outsourcing, replacing them with a reference to DORA and its delegated acts. — [Banca d'Italia, 51st update act](https://www.dirittobancario.it/wp-content/uploads/2026/02/Atto-di-emanazione-del-51mo-aggiornamento-Banca-dItalia-03-febbraio-2026.pdf)

#### Spain: Banco de España

- Banco de España, Supervision Report 2025 (supervisory report). FULL-TEXT, passage read. "three ICT risk inspections were undertaken at Spanish SIs, focusing on infrastructure, ICT project and change management, security and business continuity plans." Main IT weaknesses identified: "protection of IT assets, vulnerability and incident management and security testing of critical applications." No change-specific finding stated. — [BdE Supervision Report 2025](https://www.bde.es/f/webbe/Secciones/Publicaciones/PublicacionesAnuales/MemoriaSupervisionBancaria/25/SupervisionReport2025.pdf)
- No Banco de España circular or guidance specific to change management was found; it applies EBA/DORA texts directly. SNIPPET (search) only for that negative.

#### Netherlands: DNB and AFM

- DNB, "Good Practices Information Security 2019-2020" (good practice; not binding). FULL-TEXT (PDF retrieved via fetch tool, text extracted locally). Control 10.1 "Change standards and procedures", good practices: "Changes in critical systems and infrastructure are not requested, approved and implemented by one and the same person (segregation of duties)." Also: "Changes are registered (audit trail) and evaluated." — [DNB GP Information Security 2019-2020](https://www.dnb.nl/media/yffn1wji/good-practice-ib-2019-2020.pdf)
  - Under "Examples of this include": "The change management process is based on international standards and methods such as ITIL, Agile, Scrum"; "The impact analysis of a change takes into consideration a fall-back scenario if the change is unsuccessful"; "The institution has set up a Change Advisory Board (CAB) which makes decisions about changes in various disciplines such as business, IT and IT risk/IT security."
  - The CAB is listed as an example, not a required practice.
- DNB 2023 Good Practice (controls 10.1-10.4) and DNB statements that DORA replaces the Good Practice: SNIPPET only; DNB's site returned "Access Denied" to direct download.
- AFM: nothing found on change management or release practice.

#### Switzerland: FINMA (non-EU)

- FINMA Circular 2023/1 "Operational risks and resilience – banks", 7 December 2022, in force 1 January 2024 (FINMA circular; supervisory practice). FULL-TEXT, English. ICT change management at margin nos. 50-52 per the table of contents. — [FINMA Circ. 2023/1](https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/rundschreiben/finma-rs-2023-01-20221207.pdf)
  - "Change management shall define the procedures, processes and controls for all phases in the development or procurement of ICT. In each of these phases it shall consider the impact of the change on the ICT risks."
  - "It must be ensured that the development or test environments are separate from the ICT production environment. This also involves the clear allocation of tasks, competencies and responsibilities and laying down rules for the associated access rights."
  - "functional and non-functional requirements shall be clearly defined and approved; they shall be tested and validated based on their criticality."
  - Elsewhere (risk and control assessment): "Ad hoc risk and control assessments shall be conducted prior to major changes".

#### Luxembourg: CSSF

- CSSF Circular 20/750 as amended by 22/828, 25/881 and 26/915 (national circular). FULL-TEXT. Now "applicable in full" only to support PFS, specialised PSF and POST Luxembourg (as PSP); DORA-scope banks and investment firms are outside it. Para 75 reproduces EBA para 75 verbatim ("recorded, tested, assessed, approved, implemented and verified in a controlled manner"); para 72 requires segregation of production from development and testing. — [CSSF 20/750 consolidated](https://www.cssf.lu/wp-content/uploads/cssf20_750eng.pdf)

#### Nordics

- Finansinspektionen (Sweden), "Swedbank receives a remark and an administrative fine", 15 March 2023 (enforcement decision, press release). FULL-TEXT of the release. "On 28–29 April 2022, a major IT incident occurred at Swedbank in conjunction with the bank making a change in a business-critical IT system." "Almost one million customers had incorrect balances". — [FI press release](https://fi.se/en/published/news/2023/20232/swedbank-receives-a-remark-and-an-administrative-fine)
  - "Swedbank made the change in its system without following internal procedures for how such changes should be implemented. Swedbank also did not have suitable control mechanisms in place to ensure that the bank followed internal procedures."
  - "According to its procedures, for example, Swedbank should have conducted a risk and impact analysis of the change, and the timing of the change should have been assessed based on, among other things, when salaries are paid."
  - Sanction: remark and administrative fine of "SEK 850 000 000"; "the violation was neither prolonged nor systemic".
  - FI's full decision document was not read.
- Finanstilsynet (Norway), "Risiko- og sårbarhetsanalyse (ROS) 2026" (annual supervisory risk report, covering 2025). FULL-TEXT, Norwegian. — [Finanstilsynet ROS 2026](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026)
  - 313 ICT incidents reported in 2025. "Mange av de rapporterte hendelsene skyldes mangelfull endringshåndtering der endringene enten inneholder feil, ikke er tilstrekkelig testet eller får uforutsette effekter når de settes i produksjon." My translation: many reported incidents stem from inadequate change management where changes contain errors, are not sufficiently tested, or have unforeseen effects when put into production.
  - "Uklare kriterier for forhåndsgodkjente endringer kan bidra til at endringer med høyere risiko enn antatt gjennomføres med forenklede prosesser og uten tilstrekkelig testing og kontroll". My translation: unclear criteria for pre-approved changes can lead to changes of higher risk than assumed going through simplified processes without sufficient testing and control.
  - Expectation: firms have "etablerte og dokumenterte prosesser for endringshåndtering", followed and checked "gjennom tilstrekkelig testing, kontroll og sammenhengende oppfølging". My translation: established and documented change processes, complied with and followed up through adequate testing, control and joined-up follow-up.
  - Also: a network change and a change to "Azure Front Door" at Microsoft reduced availability of payment services and parts of BankID for several Norwegian banks in 2025.
- Earlier Norwegian ROS reports (2013-2025) repeatedly name changes as the main source of ICT incidents: SNIPPET only.
- Danish Finanstilsynet: not searched to conclusion; nothing found.

### Inferences

- Germany is the strongest continental source for the essay on both sides. BAIT 7.11 expected testers with "appropriately structured independence from the application developers" and acceptance tests by business units, which cuts against "developers own all testing". BaFin's 2024 cloud notice is the clearest supervisory statement that CI/CD pipelines and automated tests can help meet segregation of duties, with manual code review still possibly required on a risk basis. BAIT ceased to apply to DORA-scope banks after 16 January 2025, so it describes 2017-2024 expectations and those of BaFin examiners trained on it.
- The MaRisk "grundsätzlich" is worth one sentence: German supervisory text allows principled exceptions to environment separation, which DORA RTS Art. 8(2) now formalises as approved, time-limited production testing.
- France shows a real shift: in 2018 the ACPR described batching releases and weekend change windows as normal policy; in 2021 it accepted agile and automated change processes provided control is not reduced, and named standard changes and rollback conditions as good practice. The 2018 paper is the clearest continental supervisory description of the release-train model the essay argues against.
- Italy until February 2026 had the most restrictive text: a change function with a "high degree of independence" from development and formal authorisation of every production change. Banks that built processes to it may still carry that design.
- Swedbank is the continental enforcement case the essay needs. The fine was for not following the bank's own change procedure, including timing around salary days. The lesson for the essay: supervisors enforce the firm's written procedure, so the progressive-delivery process must be in the procedure, and timing relative to payment peaks is a recognised risk factor.
- Norway's warning about unclear pre-approved-change criteria is a direct caution for the essay's "standard change" route: the category must have sharp entry criteria.

### Gaps

- ZAIT and VAIT texts were not read; I verified only their repeal.
- Whether MaRisk AT 7.2 has been amended for DORA entities was not checked.
- DNB's 2023 Good Practice and its withdrawal notice were not read (access denied); AFM produced nothing.
- Banco de España and Banca d'Italia: no supervisory reports quoting change-related incident data were found.
- Danish, Finnish and Swedish (beyond Swedbank) supervisors were not searched in depth. The 2026 Swedbank incident reports in the press were not verified at FI.
- The FI Swedbank decision document itself was not read.
- Whether the Banca d'Italia requirement to notify migrations in advance survives elsewhere after the 51st update was not checked.

## 5. Payments-specific rules: PSD2 interface changes, PISA oversight, TARGET services, Instant Payments

### Takeaway

Two payments rules constrain release practice by law: PSD2 RTS Art. 30(4) requires at least three months' notice of changes to the technical specification of the open-banking access interface (except emergencies, which must be documented), and the Instant Payments Regulation requires instant credit transfers to be reachable 24 hours a day on every calendar day, with penalties waived only for planned, short, pre-announced maintenance. The Eurosystem's PISA methodology asks how change management keeps changes from disrupting a scheme and expects testing after significant changes, without prescribing a method.

### Cited Findings

- Commission Delegated Regulation (EU) 2018/389 (PSD2 RTS on SCA and CSC; binding RTS). FULL-TEXT. Art. 30(4): ASPSPs "shall ensure that, except for emergency situations, any change to the technical specification of their interface is made available to authorised payment initiation service providers, account information service providers" and card-issuing PSPs "in advance as soon as possible and not less than 3 months before the change is implemented." — [EUR-Lex PDF 32018R0389](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32018R0389)
  - Art. 30(4), second subparagraph: "Payment service providers shall document emergency situations where changes were implemented and make the documentation available to competent authorities on request."
  - Art. 30(5): ASPSPs "shall make available a testing facility, including support, for connection and functional testing".
  - The sibling's tool-extract quotation of Art. 30(4) is confirmed.
- Regulation (EU) 2024/886 (Instant Payments Regulation; binding Regulation amending Regulation 260/2012). FULL-TEXT. New Art. 2(1a) of Reg. 260/2012: an instant credit transfer "is executed immediately, 24 hours a day and on any calendar day". New Art. 5a(1): PSPs "shall ensure that all payment accounts that are reachable for credit transfers are also reachable for instant credit transfers 24 hours a day and on any calendar day." — [EUR-Lex PDF 32024R0886](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R0886)
  - Funds must be made available on the payee's account "within 10 seconds of the time of receipt of the payment order".
  - Art. 11(1c) of Reg. 260/2012 as inserted: penalties "shall not be applied" to reachability infringements where accounts "are not reachable for instant credit transfers due to planned maintenance where periods of non-availability are both foreseeable and short", provided users "have been informed in advance".
- Eurosystem assessment methodology for electronic payment instruments, schemes and arrangements (PISA), November 2021 (oversight framework; applies to overseen schemes and arrangements, not to banks as such). FULL-TEXT. — [PISA assessment methodology](https://www.ecb.europa.eu/paym/pdf/consultations/ecb.PISApublicconsultation202111_2.en.pdf)
  - Q.17.1.8: "How do the scheme/arrangement's change management and project management policies and processes mitigate the risk of changes and major projects inadvertently affecting the smooth functioning of the scheme/arrangement? Does this process include security reviews?"
  - Key consideration 17.2: "Systems, operational policies, procedures and controls should be reviewed, audited and tested both periodically and after significant changes".
  - Q.17.3.3: "Are all incidents logged, reported, systematically investigated and appropriately followed up?"
- TARGET Services (T2, T2S, TIPS, ECMS): the Eurosystem runs scheduled releases; the November 2026 release deployment was shifted from 14 to 28 November 2026, with user testing for A2A participants planned from 9 October 2026; the ECB publishes "Mandatory Test Cases for T2 Participants". SNIPPET only. — [ECB MIP news, Sept 2026](https://www.ecb.europa.eu/press/intro/news/html/ecb.mipnews260904.en.html); [T2 documents](https://www.ecb.europa.eu/paym/target/target-professional-use-documents-links/t2/html/index.en.html)
- EBA Guidelines on security measures under PSD2 (EBA/GL/2017/17): superseded by EBA/GL/2019/04 and then (for DORA entities) by DORA. Not read.

### Inferences

- External-interface change is calendar-bound by law (three months for PSD2 access interfaces), which matches the sibling notes' conclusion. Feature flags help: a firm can deploy the new interface version dark and switch on at the notified date, but the notice period runs from publication of the specification, not from deployment.
- The Instant Payments Regulation is an argument for the essay. 24/7 reachability makes long maintenance windows and big-bang weekend releases costly; only "foreseeable and short", pre-announced downtime escapes penalties. Zero-downtime techniques (rolling and staged deployments, backwards-compatible changes) become close to a necessity for instant-payment paths. This is an inference; the Regulation does not mention deployment.
- TARGET participants live with an externally set release calendar and mandatory tests, the same pattern as card-scheme releases in the sibling notes.

### Gaps

- PSD2 RTS Art. 32-33 (dedicated interface availability and the contingency mechanism) were not read in detail.
- T2 mandatory test cases, TIPS participant rules and the SEPA Instant rulebook were not read.
- No EBA or ECB text on change management specific to payment institutions beyond the above was found.

## 6. Securities and trading: MiFID II RTS 6 and ESMA

### Takeaway

RTS 6 is the one EU text that mandates something close to a staged rollout: before deploying an algorithm the firm must set predefined limits on instruments, order values and numbers, positions and venues (Art. 8), and it must hold an immediate kill capability (Art. 12). It also requires a separate testing environment (Art. 7), authorisation of deployment by a person designated by senior management (Art. 5(2)), records of who made and who approved each material change (Art. 5(7)), and stress tests that must not affect production (Art. 10). ESMA's 2026 briefing adds that a series of small changes can accumulate into an untested material change.

### Cited Findings

Commission Delegated Regulation (EU) 2017/589 (RTS 6; binding RTS under MiFID II Art. 17). FULL-TEXT. — [EUR-Lex PDF 32017R0589](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0589)

- Art. 5(1): "Prior to the deployment or substantial update" of an algorithmic trading system, algorithm or strategy, the firm "shall establish clearly delineated methodologies to develop and test such systems".
- Art. 5(2): "A person designated by the senior management of the investment firm shall authorise the deployment or substantial update".
- Art. 5(4)(d): the methodology must ensure the algorithm "does not contribute to disorderly trading conditions, continues to work effectively in stressed market conditions and, where necessary under those conditions, allows for the switching off" of the system or algorithm.
- Art. 5(5): "further testing if there are substantial changes to the algorithmic trading system or to the access to the trading venue".
- Art. 5(7): records of "any material change made to the software used for algorithmic trading", showing "(a) when a change was made; (b) the person that has made the change; (c) the person that has approved the change; (d) the nature of the change."
- Art. 6(1): conformance testing with the venue's system, including "prior to the deployment or material update" of the algorithm, and where there is "a material change of the systems of that trading venue".
- Art. 7(1): testing against Art. 5(4)(a), (b) and (d) "is undertaken in an environment that is separated from its production environment and that is used specifically for the testing and development". Production environment is defined to include "order routing to trading venues, market data, dependent databases, risk control systems".
- Art. 7(2): the firm may use its own testing environment "or a testing environment provided by a trading venue, a DEA provider or a vendor." Art. 7(3): the firm "shall retain full responsibility for the testing".
- Art. 8 "Controlled deployment of algorithms": "Before deployment of a trading algorithm, an investment firm shall set predefined limits on: (a) the number of financial instruments being traded; (b) the price, value and numbers of orders; (c) the strategy positions; and (d) the number of trading venues".
- Art. 9: annual self-assessment and validation report drawn up by the risk management function, audited by internal audit and approved by senior management.
- Art. 10: annual stress tests "carried out in such a way that they do not affect the production environment", using twice the highest message and trade volumes of the previous six months.
- Art. 11(1): "any proposed material change to the production environment related to algorithmic trading is preceded by a review of that change by a person designated by senior management". "The depth of the review shall be proportionate to the magnitude of the proposed change."
- Art. 11(2): changes to functionality are communicated "to traders in charge of the trading algorithm and to the compliance function and the risk management function."
- Art. 12(1): the firm "shall be able to cancel immediately, as an emergency measure, any or all of its unexecuted orders submitted to any or all trading venues to which the investment firm is connected ('kill functionality')."
- Term counts: "canary", "staged", "phased", "rollback", "feature flag" all 0.

ESMA, "Supervisory Briefing on Algorithmic Trading in the EU", ESMA74-1505669079-10311, 26 February 2026 (supervisory briefing; convergence tool, not binding). FULL-TEXT, passages read. — [ESMA supervisory briefing 2026](https://www.esma.europa.eu/sites/default/files/2026-02/ESMA74-1505669079-10311_Supervisory_Briefing_on_Algorithmic_Trading_in_the_EU.pdf)

- Para 30: "firms should manage the risk that a series of minor or small changes due to recalibrations could accumulate over time, when uncontrolled or unchecked, into a material change in the model output without it being tested."
- Para 31: "Investment firms are required to timestamp, approve, and record all material changes." Good practice is to consider retesting for changes including "Changing thresholds, kill switch logic, or alert triggers" and "Retraining or modifying machine learning components".

ESMA, MiFID II review report on algorithmic trading, ESMA70-156-4572, 28 September 2021. FULL-TEXT downloaded; only section 4.3 headings and a few lines read. It discusses making RTS 6 Art. 7 testing-environment rules more principle-based and reporting testing environments in the annual self-assessment; I did not read enough to quote. — [ESMA 2021 final report](https://www.esma.europa.eu/sites/default/files/library/esma70-156-4572_mifid_ii_final_report_on_algorithmic_trading.pdf)

### Inferences

- RTS 6 Art. 8 is a regulatory form of limited initial exposure: the essay can cite it as the EU's own example of "deploy with small limits first", alongside Art. 12 as a mandated kill switch. Art. 8 sets limits; it does not require the limits to be raised in stages, and it does not use the word "ramp".
- RTS 6 keeps a designated human authoriser for deployment and material change (Arts. 5(2), 11(1)) and a strict test/production separation (Art. 7). An essay applying its ideas to trading must keep those.
- ESMA's accumulation point cuts both ways: it accepts many small changes but warns that their sum can be an untested material change, which argues for cumulative-change tracking in a continuous-delivery pipeline.

### Gaps

- ESMA 2021 report section 4.3 recommendations not read in full; RTS 6 has not been amended as far as I checked (not verified).
- RTS 7 (trading venues) testing obligations not read.

## 7. Continental supervisors on agile, DevOps, continuous delivery, canaries or toggles; change-caused incidents with supervisory follow-up

### Takeaway

No continental supervisor I found mentions canary releases, feature toggles, trunk-based development or continuous deployment. Several accept agile or DevOps explicitly: BaFin (cloud notice 2024: CI/CD pipelines and automated tests can support segregation of duties; BAIT accepts user stories and backlogs), ACPR (2021: agile/Scrum project management and automated change processes acceptable if control is not reduced), DNB (2019/2020: change process may be based on ITIL, Agile, Scrum), and the ECB asks banks whether their operating model is Waterfall, Agile or DevOps. Supervisory follow-up of change-caused incidents is documented for Swedbank (Sweden, 2023 fine) and generically by the ECB and Norway; BaFin's Postbank measure is documented but its notices do not attribute the disruption to a change.

### Cited Findings

- BaFin cloud notice, February 2024, section 1.1: agile, DevOps and DevSecOps named; CI/CD pipelines and automated tests can support segregation of duties; code reviews may still be needed. FULL-TEXT (question 4). — [BaFin cloud notice](https://www.bafin.de/SharedDocs/Downloads/DE/Anlage/Aufsichtsmitteilung/dl_2024_02_01_Aenderung_Orientierungshilfe_Cloud.pdf?__blob=publicationFile&v=4)
- BaFin BAIT 7.7 explanation: requirements may be documented as "user story/product backlog". FULL-TEXT. — [BaFin BAIT English](https://www.bafin.de/SharedDocs/Downloads/EN/Rundschreiben/dl_rs_1710_ba_BAIT_en.pdf?__blob=publicationFile&v=6)
- ACPR notice 2021, points 14 and 17: agile (Scrum) project management; automated change processes must not reduce control. FULL-TEXT (question 4). — [ACPR notice 2021](https://acpr.banque-france.fr/system/files/import/acpr/media/2021/07/08/20210707_notice_risque_it.pdf)
- ACPR 2018 discussion paper: batched releases and weekend change calendars described as normal policy. FULL-TEXT (question 4). — [ACPR 2018](https://acpr.banque-france.fr/system/files/import/acpr/medias/documents/818013_acpr_risque-informatique_web_fr_v3.pdf)
- DNB Good Practice 2019/2020, control 10.1 example: "ITIL, Agile, Scrum". FULL-TEXT (question 4). — [DNB GP 2019-2020](https://www.dnb.nl/media/yffn1wji/good-practice-ib-2019-2020.pdf)
- ECB ITRQ 2025 Q35: "Waterfall, Agile, DevOps, Other". FULL-TEXT (question 3). — [ECB ITRQ 2025](https://www.bankingsupervision.europa.eu/activities/srep/2025/html/ssm.srep_ITRQ2025.en.pdf)
- DORA RTS recital 10: production testing allowed exceptionally "considering current ICT system development practices". FULL-TEXT (question 1). This is the only EU legal text that acknowledges modern development practice as a reason for flexibility. — [EUR-Lex PDF 32024R1774](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1774)
- Change-caused incidents with supervisory follow-up:
  - Swedbank, April 2022 change, FI remark and SEK 850 million fine, 15 March 2023. FULL-TEXT (question 4). — [FI](https://fi.se/en/published/news/2023/20232/swedbank-receives-a-remark-and-an-administrative-fine)
  - ECB: 38% of major incidents reported by banks in 2025 had IT change as root cause; targeted review of ICT change management planned for 2026-28. FULL-TEXT (question 3). — [ECB, Tuominen 2026](https://www.bankingsupervision.europa.eu/press/interviews/date/2026/html/ssm.in260324_5~3d0837ff0e.en.html)
  - Norway: many 2025 incidents traced to inadequate change management; Microsoft Azure changes disrupted Norwegian bank payment services and BankID. FULL-TEXT (question 4). — [Finanstilsynet ROS 2026](https://www.finanstilsynet.no/publikasjoner-og-analyser/risiko--og-sarbarhetsanalyse/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026/risiko--og-sarbarhetsanalyse-2026)
  - Postbank 2023: BaFin special representative for service disruptions; cause not stated by BaFin. FULL-TEXT (question 4). — [BaFin](https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Verbrauchermitteilung/weitere/2023/meldung_2023_10_02_Deutsche_Bank_Postbank_en.html)

### Inferences

- The continental supervisory record supports the essay's method in principle (agile, DevOps, automation, risk-based testing, pre-defined standard changes and rollback conditions are all named as acceptable by at least one supervisor) but none endorses canaries, flags or continuous deployment by name. The essay should say "consistent with" rather than "endorsed by".
- The weight of continental supervisory commentary, like the UK, US and Singapore material in the sibling notes, is "change causes outages, so control change". The essay's best continental framing is the ECB's own July 2026 language about rapid, risk-based remediation with operational stability, plus RTS 17(1)(e)'s requirement to plan for aborting changes.
- Swedbank is the cleanest continental example of a change-caused incident with a supervisory sanction. It supports the essay's emphasis on procedure (the fine was for bypassing procedure) and on timing (salary-day peaks), not on any particular release technique.

### Gaps

- No continental supervisory statement on canary releases, feature toggles or continuous deployment, positive or negative, was found.
- No continental enforcement decision describing remediation terms (e.g. change freezes, staged rollout requirements) was found; nothing comparable to MAS's DBS freeze was found in continental Europe.
- Incidents at Adyen, ING, ABN AMRO, Nordea, Danske Bank, Nexi or Worldline with supervisory follow-up were not researched.
