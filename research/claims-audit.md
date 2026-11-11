# Historical claims audit

Independent review of `google.md`, `facebook.md`, and `unicorns.md`, 2026-11-10. Source IDs below refer to those ledgers; this audit introduces no independently researched historical claims.

## Overall judgment

The central thesis is well supported: Internet companies increasingly treated installing software and exposing its new behavior as separate decisions, using shared configuration, limited exposure, measurement, and disablement. The proposed Google → Facebook → unicorns line is a useful research question but is not established as a single inheritance chain. The stronger paper follows converging traditions, identifies actual transmission where documented, and explains why release culture mattered as much as the conditional statement in code.

## Dates that can anchor the narrative

| Event | Evidentiary status | Source |
| --- | --- | --- |
| Google Search infrastructure first deployed March 2007 | A date reported in the implementers' 2010 paper; not the invention date of flags | G04 |
| Facebook Chat hidden-load exercise February 2008; visible rollout April 6–23 | Implementer slides give practice dates; 2009 presentation and 2008 post should remain distinct | FB01–02 |
| Etsy describes copying Flickr in February 2011 | Contemporary, explicit attribution and named personnel | U01 |
| Trebuchet initial commit April 7, 2011 | Version-specific README and commit inspected through GitHub API | U02 |
| Airbnb describes subset activation without deployment June 2012 | Contemporary speaker notes | U03 |
| Netflix describes production-disabled functionality during acceptance testing November 2013 | Contemporary engineering account | U04 |
| LinkedIn describes independently controlled experiment ramps August 2014 | Contemporary account; XLNT's preceding year is a reported age | U08 |
| Facebook documents routine dormant production code in 2015 | SOSP paper; documents practice by publication, not its starting year | FB08 |
| Dropbox describes expectation to gate risky desktop changes April 2017 | Strong express cultural norm, limited to the process described | U12 |
| Facebook completes quasi-continuous web rollout transition April 2017 | Date reported in August retrospective | FB10 |

## Arrows: established, plausible, or unsupported

- **Flickr → Etsy:** established by direct attribution in [Dickerson's account](https://www.etsy.com/codeascraft/how-does-etsy-manage-development-and-operations), plus named staff. This is qualitatively stronger evidence than shared vocabulary.
- **Google → Facebook:** personnel connection established; technical inheritance unproven. FB05 and FB12 positively complicate it: Rossi credits earlier Facebook practice. Do not turn a biography into a transmission claim.
- **Facebook → Airbnb:** Curtis's career establishes a human connection. Trebuchet predates his arrival, so attributing Airbnb's flags to that move would be chronologically misleading. U02–03 and U06.
- **Facebook → Uber/Dropbox/Pinterest/LinkedIn:** not demonstrated by these dossiers. Describe adoption, convergence, and wider public circulation; avoid invented parentage.
- **Talks → industry adoption:** an event proves public availability of an explanation. Attendance or publication alone does not prove a particular later company learned the practice there.

## Distinctions the essay must teach plainly

1. **Integration, installation, and activation:** merging developers' changes, installing a software version, and allowing users into a new behavior are different acts. Flags can help a team integrate incomplete work, but CI does not inherently mean production deployment.
2. **A limited binary rollout versus a feature ramp:** one installs a new version on selected machines; the other selects a behavior for chosen users, possibly in the same installed version. “Canary” can describe limited exposure in either setting. Name the actual control each time.
3. **Experiments versus safety checks:** a randomized test asks whether behavior changes outcomes; a safety rollout limits damage while checking acceptability. They can share assignment and measurement infrastructure without sharing every statistical or product goal. U13 is explicit.
4. **Dark launch:** in Facebook Chat it means hidden production load. Elsewhere the term can mean dormant installed code. Explain the particular mechanism rather than making the phrase carry the argument.
5. **Disablement versus undo:** switching to the old path can stop further gated behavior. It does not establish that previously written data, sent messages, financial transactions, or external effects are reversed. This is a technical scope distinction, not a claim about a particular historical incident.

## Quality counterexamples that strengthen the history

- Do not portray load tests, stabilization, or soak as obsolete. Google G04/G09–11, Facebook FB09, Netflix U04, and Dropbox U12 document complementary controls. Facebook's hidden-load exercise is itself a form of load validation.
- Deployment counts demonstrate throughput, not safety or causation. Reported improvements should remain company-reported; the dossiers do not supply a controlled comparison establishing flags alone caused them.
- A production-off branch can still share initialization, dependencies, resources, or data with active code. “Off” limits behavior by implementation; it is not proof of total isolation.
- Mobile and desktop cases are especially useful for readers familiar with release trains: activation can become independent even when the binary still follows a scheduled release process.
- Configuration becomes production-changing software. Facebook FB08 and Uber U18 supply evidence that the control system itself requires safeguards and can create outages; Uber U17 shows maintenance costs after adoption.

## Assertions requiring verification or omission

- G06 Slatkin talk: description verifies the rapid-deployment case; the uninspected recording cannot support detailed flag mechanics or timestamps.
- G08 McNutt and FB11 SREcon: abstracts/biographies support topics and community participation, not uninspected speech content.
- FB2011 video and FB2014 keynote: inaccessible recordings and third-party transcript leads should remain reading-list leads unless playback is verified.
- FB07a migrated byline and FB07b inconsistent page ranges: omit a disputed byline/page range if unnecessary, or resolve against publisher metadata. Neither undermines the body evidence.
- Google 2000 first-A/B-test date, Gatekeeper invention date, Stormcrow creation date, and an exact Morpheus 2013 date are not established here. Use earliest verified descriptions with appropriate wording.
- Netflix U04 named-author attribution is indirect; citing Netflix Technology Blog is sufficient.
- Avoid treating all companies as “2010s unicorns.” The research covers an Internet engineering ecosystem spanning public companies, acquired firms, and venture-backed startups. Do not infer valuation status from engineering similarity.

## Recommended framing for this audience

Open with the familiar experience of promoting a release through environments, then explain the historical discovery that the installed package and the customer's experience need not change simultaneously. Preserve testing as a source of evidence; describe limited production exposure as an additional source that addresses what simulated environments miss. The historical change is the distribution of risk and feedback across smaller decisions, rather than a contest between careful old companies and reckless or enlightened new ones.
