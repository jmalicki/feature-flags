# Faster delivery and client stability: historical empirical evidence

Research date: 2026-11-10. Scope: evidence relevant to financial-firm developers accustomed to twice-weekly release trains and days of environment promotion. Primary sources below establish that speed and operational quality can coexist; they do not establish that feature flags alone cause either outcome. Notes are deliberately concise to leave room for source-derived prose in the essay (web source limits: 200 words apiece).

## Q01. 2014 State of DevOps Report

- Publisher/authors: Puppet Labs, IT Revolution Press, ThoughtWorks; contributors include Nicole Forsgren, Jez Humble, Gene Kim, Nigel Kersten.
- Original report hosted by DORA: <https://dora.dev/research/2014/2014-state-of-devops-report.pdf>
- Read: PDF executive summary; IT Performance pp. 13–19; measurement discussion.
- Evidence: More than 9,200 survey responses. Report identifies high-performing organizations combining much more frequent deployment with lower failure rates. It reports 30 times deployment frequency and 50% lower change-failure rates; throughput/stability are considered together. Crucially, p.15 says no specific practice correlated with change-failure rate in that year's analysis.
- Locators: printed p.10 confirms earlier findings; pp.13–15 definitions and failure results.
- Best use: date the empirical challenge to the speed-versus-quality assumption to at least 2014; avoid attributing causality to flags.

## Q02. 2016 State of DevOps Report

- Publisher: Puppet + DORA; authors include Alanna Brown, Nigel Kersten, Jez Humble, Nicole Forsgren, Gene Kim.
- URL: <https://dora.dev/research/2016/2016-state-of-devops-report.pdf>
- Read: pp.13–18 performance, p.53 methodology, sample description.
- Evidence: Over 4,600 respondents. Printed p.15 gives these high-performer categories: multiple deployments/day; commit-to-production under an hour; service recovery under an hour; change failure 0–15%. Low performers: monthly–six-month deployment; one–six-month lead time; recovery under a day; failure 16–30%. These are **survey category medians**, not universal thresholds. Methodology uses snowball recruitment and a cross-sectional design, with performance clusters constructed from the four measures.
- Best use: concrete, modest evidence of coexistence. A claim that frequent release inherently sacrifices stability conflicts with the observed high-performing group; a claim that forcing frequency improves quality does not follow.

## Q03. 2018 Accelerate State of DevOps Report

- Publisher: DORA (pre-Google acquisition report); author group includes Nicole Forsgren, Jez Humble, Gene Kim.
- URL: <https://dora.dev/research/2018/dora-report/2018-dora-accelerate-state-of-devops-report.pdf>
- Read: pp.11–21 performance and availability; methodology.
- Evidence: Nearly 1,900 participants that year. Printed p.14: elite group deployed multiple times/day, lead time and recovery under an hour, change failure 0–15%; low group deployed weekly–monthly, lead one–six months, recovery one week–month, failure 46–60%. P.11 reports high performers across industry verticals, including regulated industries. P.21 adds correlated self-reported availability practices, measured separately from performance clustering.
- Caution: headline multipliers are calculated by normalizing broad response bands. Prefer the response categories. Availability is a survey construct including targets/learning practices, not audited customer-visible uptime. Annual groups/samples differ; don't interpret comparisons as a controlled longitudinal experiment or specific firms improving by those factors.

## Q04. ING, Jan-Joost Bouwman and Ingrid Algra, October 19, 2015

- Title: *ITIL and DevOps Can Be Friends*, DevOps Enterprise Summit San Francisco.
- Presenter upload: <https://www.slideshare.net/slideshow/itil-and-devops-can-be-friends/54569849>
- Conference organizer upload with speaker notes: <https://www.slideshare.net/slideshow/jan-joost-bouwman-janjoost-bouwmanitilanddevopscanbefriends-1-55188504/55188504>
- Read: slide transcript and speaker notes, especially slide 12 in organizer deck.
- Evidence: ING describes moving to Scrum in 2011 and DevOps teams in 2013 after operations handoffs obstructed delivery. It retains risk/impact-based approval and a definition of done demonstrating production readiness, while reducing duplicate administration and planning pipeline automation of evidence. This is a contemporary bank practitioner account of adapting controls rather than equating speed with bypassing them.
- Caution: supports practice/history, not a quantified causal study or documented feature-flag rollout. Do not imply all planned automation already existed.

## Q05. ING CIO Ron van Kemenade interviewed, January 10, 2017

- Title: *Engineering the switch to digital*.
- Interviewers: Robert Carsouw, Andrea Del Miglio, Naomi Smit.
- URL: <https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/engineering-the-switch-to-digital>
- Read: full interview.
- Evidence: CIO describes introducing a continuous-delivery pipeline, DevOps, greater standardization/automation, and learning deliberately from digital-born companies. He explicitly names studying Netflix's engineering competency model. He describes changing risk perceptions through demonstrated outcomes and customer feedback.
- Best use: **documented diffusion into banking**, with a precise limit: Netflix link is for engineering/talent evaluation, not proof that ING copied a Netflix flag implementation. Interview is first-person evidence, despite being published by a consultancy. No incident-rate measurement here.

## Q06. Capital One, Paul Bruce, February 14, 2018

- Title: *No testing strategy, no DevOps*.
- URL: <https://www.capitalone.com/tech/software-engineering/no-testing-strategy-no-devops/>
- Read: full article; especially statements attributed to Capital One practitioners.
- Evidence: DevExchange Gateway manager Jeff Michel describes integration tests required before merge, integration/performance testing in the preproduction pipeline, and tests reused in blue-green production deployment. Testing specialist Aashish Kapoor describes earlier test creation and configurable automation. This directly refutes an interpretation of rapid delivery as discarding performance/integration testing.
- Caution: Bruce is an external performance/DevOps adviser; the quoted Capital One practitioners provide firsthand details. This is practice evidence, not a controlled quality outcome or feature-flag case.

## Optional primary talks for the viewing list

- Adam Auerbach, Capital One, *Making continuous delivery a reality at a large enterprise*, recorded Velocity Santa Clara May 2015; O'Reilly published October 13, 2016: <https://www.oreilly.com/content/making-continuous-delivery-a-reality-at-a-large-enterprise/> . Official description verifies subject and date; video not watched. Auerbach's contemporary role verified at <https://www.oreilly.com/people/adam-auerbach/> .
- Taco Bakker and Mark Heistek, *Scaling DevOps and continuous delivery at ING*, May 2017: <https://www.oreilly.com/videos/scaling-devops-and/0636920458982/> . Official description places reorganization in May 2013 and discusses scaling pipelines, operations, and security. Abstract read; video not watched.
- Adam Auerbach, *Part of the Pipeline: Why Continuous Testing Is Essential*, August 3, 2015: <https://www.techwell.com/techwell-insights/2015/08/part-pipeline-why-continuous-testing-essential> . Complete practitioner article read; discusses small independent tests, automated data setup, and pipeline-integrated performance/security checks. His bio on the page has since been updated; do not use today's job title as his 2015 role.

## Synthesis boundaries

The supportable historical conclusion is that by the middle and late 2010s, public evidence went beyond Silicon Valley anecdotes: practitioner accounts existed in established banking, while surveys identified teams achieving rapid delivery together with lower change-failure rates and faster restoration. The studies concern a **bundle** of engineering practices and organizational conditions. They neither isolate flags as the treatment nor certify that a particular bank can attain the same result merely by deploying more often.

For the essay, distinguish three propositions: (1) frequent deployment and stability are compatible (supported); (2) controlled exposure offers a plausible and directly documented mechanism for limiting how many users encounter a bad feature (company engineering sources elsewhere); (3) flags themselves caused the survey performance gap (not established). This preserves the financial audience's quality concern without turning the history into a transformation sales pitch.
