# Quote verification A: Google, incident reports, Netflix, Beck

Checked 2026-11-10. Every item was read from the page's own bytes (raw HTML fetched with `curl`, tags stripped, then searched; `pdftotext` for the PDF). No summarising fetch tool was used for any wording. Item 12 is the only one read from Internet Archive captures, because the live page returned HTTP 403.

"VERBATIM" means the words, word order and punctuation match. The only differences ignored are typographic: the pages use curly quotes and apostrophes, and where the essay nests a quotation the page's inner double quotes become single quotes.

## Results

| # | Source | Quote or claim | Status | Exact wording on the page | Author and date on page | How read |
| --- | -------- | ---------------- | -------- | --------------------------- | ------------------------- | ---------- |
| 1a | Google Cloud blog, "Reliable releases and rollbacks—CRE life lessons" | "rollbacks are normal" | VERBATIM | At Google, our philosophy is that “rollbacks are normal.” | Adrian Hilton, Customer Reliability Engineer, SRE; March 24, 2017 | Raw HTML (live) |
| 1b | Same | "the releasing team rolls back first and investigates the problem second" | VERBATIM | When an error is found or reasonably suspected in a new release, the releasing team rolls back first and investigates the problem second. | Same | Raw HTML (live) |
| 1c | Same | "No-one will ask 'why did you roll back this change?'" | VERBATIM | No-one will ask “why did you roll back this change?” as long as the rollback changelist describes the problem that was seen. | Same | Raw HTML (live) |
| 1d | Same | "If you haven't rolled back in a few weeks, you should do a rollback 'just because'" | VERBATIM | If you haven’t rolled back in a few weeks, you should do a rollback “just because”; aim to find any traps with incompatible versions, broken automation/testing etc. | Same | Raw HTML (live) |
| 2a | Jennifer Mace, "Generic mitigations", O'Reilly | "that any oncall feels comfortable using" | VERBATIM | The goal is to create easy, safe, frictionless panic buttons for your service that any oncall feels comfortable using at the slightest suspicion they might help. | Jennifer Mace; December 15, 2020 | Raw HTML (live) |
| 2b | Same | "Far too many think they have safe rollbacks, only to learn otherwise during an outage" | VERBATIM | Far too many think they have safe rollbacks, only to learn otherwise during an outage. | Same | Raw HTML (live) |
| 3a | Google SRE Workbook, ch. 16 "Canarying Releases" | "a single work unit" | VERBATIM | Accordingly, make sure the canary duration at minimum spans the duration of a single work unit. | Alec Warner and Štěpán Davidovič with Alex Hidalgo, Betsy Beyer, Kyle Smith, and Matt Duftler; no date on the page (book published 2018) | Raw HTML (live) |
| 3b | Same | Tension between canary duration and release velocity | FOUND (wording supplied) | When choosing an appropriate canary duration, you need to factor in development velocity. If you release daily, you can’t let your canary last for a week while running only one canary deployment at a time. | Same | Raw HTML (live) |
| 3c | Same | Canarying supplements rather than replaces testing | FOUND, but only "supplement"; the page has no "rather than replace" wording | Canarying can be a simple, robust, and easily integratable way to supplement testing. | Same | Raw HTML (live) |
| 4 | Google SRE book, ch. 1 "Introduction" | "roughly 70% of outages are due to changes in a live system" | VERBATIM | SRE has found that roughly 70% of outages are due to changes in a live system. | Written by Benjamin Treynor Sloss, edited by Betsy Beyer; no date on the page (book published 2016) | Raw HTML (live) |
| 5a | Google Cloud incident report ow5i3PPK96RduMcb1SsW | "did not have appropriate error handling nor was it feature flag protected" | VERBATIM | The issue with this change was that it did not have appropriate error handling nor was it feature flag protected. | Google Cloud (no personal byline); incident report posted 13 Jun 2025 16:45 PDT; incident date 12 June 2025 | Raw HTML (live) |
| 5b | Same | "We will enforce all changes to critical binaries to be feature flag protected and disabled by default" | VERBATIM | We will enforce all changes to critical binaries to be feature flag protected and disabled by default. | Same | Raw HTML (live) |
| 6a | Software Engineering at Google, ch. 24 "Continuous Delivery" | "if you're late for the release train, it will leave without you" | VERBATIM | The second idea is that if you’re late for the release train, it will leave without you. | Written by Radha Narayan, Bobbi Jones, Sheri Shipe, and David Owens; edited by Lisa Carey; no date on the page (book published 2020) | Raw HTML (live) |
| 6b | Same | Statement about flag-guarding | FOUND (wording supplied) | A key to reliable continuous releases is to make sure engineers "flag guard" all changes. | Same | Raw HTML (live) |
| 6c | Same | "faster is safer" | VERBATIM as a phrase; it is not a section heading | A core tenet of Continuous Delivery (CD) as well as of Agile methodology is that over time, smaller batches of changes result in higher quality; in other words, faster is safer. | Same | Raw HTML (live) |
| 7 | Cloudflare, "Details of the Cloudflare outage on July 2, 2019" | WAF rule changes went global in one step by design, skipping DOG/PIG/Canary | CONFIRMED (wording supplied); the phrase "in one go" does NOT appear | The SOP for a rule change specifically allows it to be pushed globally. This is very different from all the software we release at Cloudflare where the SOP first pushes software to an internal dogfooding network point of presence (PoP) | John Graham-Cumming; July 12, 2019 | Raw HTML (live) |
| 8a | Cloudflare, "Cloudflare outage on December 5, 2025" | "propagates changes within seconds to the entire fleet" | VERBATIM | This system does not perform gradual rollouts, but rather propagates changes within seconds to the entire fleet of servers in our network and is under review following the outage we experienced on November 18. | Dane Knecht; December 5, 2025 | Raw HTML (live) |
| 8b | Same | Kill switch / global configuration system triggered the outage | CONFIRMED (wording supplied); page spells it "killswitch", one word | This second change of turning off our WAF testing tool was implemented using our global configuration system. | Same | Raw HTML (live) |
| 8c | Same | Share of traffic and duration | CONFIRMED: about 28% of HTTP traffic, about 25 minutes (08:47 to 09:12 UTC) | A subset of customers were impacted, accounting for approximately 28% of all HTTP traffic served by Cloudflare. | Same | Raw HTML (live) |
| 9a | CrowdStrike, "External Technical Root Cause Analysis — Channel File 291" | "Each Template Instance should be deployed in a staged rollout" | VERBATIM | Findings: Each Template Instance should be deployed in a staged rollout. | CrowdStrike (no personal byline); file name dated 08.06.2024; text says "As of July 29 at 5 p.m. PT" | PDF text (`pdftotext`, live PDF) |
| 9b | Same | "additional bake-in time" | VERBATIM | Promoting a Template Instance to the next successive ring is followed by additional bake-in time, where telemetry is gathered to determine the overall impact of the Template Instance on the endpoint. | Same | PDF text (`pdftotext`, live PDF) |
| 10a | Roblox, "Roblox Return to Service" | 73 hours | CONFIRMED | Starting October 28th and fully resolving on October 31st, Roblox experienced a 73-hour outage. | By Daniel Sturman in collaboration with Scott Delap, Max Ross, & many others from Roblox and HashiCorp; published Jan 20, 2022 | Raw HTML (live) |
| 10b | Same | Streaming had run for about a day before the incident | CONFIRMED (wording supplied) | The system had worked well with streaming at this level for a day before the incident started, so it wasn’t initially clear why it’s performance had changed. | Same | Raw HTML (live) |
| 11 | Kent Beck, "Taming Complexity with Reversibility" | "Decisions affecting people's privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible" | VERBATIM, including the semicolon and the serial comma | Decisions affecting people’s privacy, trust, and money; and decisions affecting the Facebook brand aren't reversible. | Kent Beck; Substack post dated Nov 17, 2023, labelled "Originally published July 2015" | Raw HTML (live) |
| 12 | Netflix, "Full Cycle Developers at Netflix — Operate What You Build" | "Canarying was devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality." | VERBATIM | Canarying was devolving into verifying endurance (“nothing broke after one week of canarying, let’s push it”) rather than correct functionality. | Account byline "Netflix Technology Blog"; closing credit "By Philip Fisher-Ogden, Greg Burrell, and Dianne Marsh"; May 17, 2018 | Archive captures (raw HTML of 20231213071604 and 20180519120116); live page returned 403 |

## Notes

### Item 1

- The page title uses an em dash with no spaces: "Reliable releases and rollbacks—CRE life lessons".
- Adrian Hilton is the only author shown. The date shown is March 24, 2017.
- In 1c the sentence continues after the quoted part ("as long as the rollback changelist describes the problem that was seen"), so the quote should not be closed with a full stop as if the sentence ended there.
- In 1d the sentence continues after a semicolon.

### Item 3

- "Release frequency" does not occur anywhere in the chapter. The chapter's term is "development velocity".
- The same paragraph continues: "If you deploy weekly, you have time to perform fairly long canaries. If you deploy continuously (for example, 20 times in a day), your canary duration must be significantly shorter."
- The chapter says canarying is a way "to supplement testing". It does not contain a sentence that says canarying does not replace testing, so "supplements rather than replaces" is a paraphrase and should not be put in quotation marks. The nearby sentence is: "No single testing methodology is a panacea, and testing strategies should be informed by the requirements and behavior of the system."

### Item 5

- The status page header reads: "Incident began at 2025-06-12 10:51 and ended at 2025-06-12 18:18 (all times are US/Pacific)."
- The incident report body gives "Incident Start: 12 June, 2025 10:49" and "Incident End: 12 June, 2025 13:49", duration 3 hours. The header and the report therefore give different end times; both agree on 12 June 2025.
- The page also carries a "Mini Incident Report" dated 12 Jun 2025 23:34 PDT. Both quotes are in the full report dated 13 Jun 2025 16:45 PDT.

### Item 6

- "Faster is safer" appears three times: in the "Idioms of Continuous Delivery at Google" opening (quoted in the table), in the conclusion ("we’ve found that, counterintuitively, faster is safer."), and as a TL;DR bullet ("Faster is safer: Ship early and often and in small batches to reduce the risk of each release and to minimize time to market."). No section heading uses the phrase.
- The flag-guarding sentence sits under the heading "Evaluating Changes in Isolation: Flag-Guarding Features". The page uses straight double quotes around "flag guard".
- The release-train sentence sits under the heading "Meet Your Release Deadline"; the words from "if you’re late" to "without you" are emphasised on the page.

### Item 7

- The words "in one go" are not on the page. Do not quote them.
- Other sentences on the page that support the claim:
  - "Because WAF rules are required to address emergent threats they are deployed using our Quicksilver distributed key-value (KV) store that can push changes globally in seconds."
  - "The SOP allowed a non-emergency rule change to go globally into production without a staged rollout."
  - "Once approved deployment to what we call the “animal PoPs” occurs: DOG, PIG, and the Canaries." (this describes the software release process that rule changes did not follow)
- The remediation list includes: "Changing the SOP to do staged rollouts of rules in the same manner used for other software at Cloudflare while retaining the ability to do emergency global deployment for active attacks."

### Item 8

- The page carries a note: "This post was updated to clarify the relationship of the internal WAF tool with the incident on Dec. 5." The wording quoted here is from the updated version as served on 2026-11-10.
- The page spells the mechanism "killswitch" (one word). Relevant sentences:
  - "We have a killswitch subsystem as part of the rulesets system which is intended to allow a rule which is misbehaving to be disabled quickly."
  - "This killswitch system receives information from our global configuration system mentioned in the prior sections."
  - "However, we have never before applied a killswitch to a rule with an action of “execute”."
- The page's own statement of the trigger is broader than the killswitch: "Instead, it was triggered by changes being made to our body parsing logic while attempting to detect and mitigate an industry-wide vulnerability disclosed this week in React Server Components." The killswitch, delivered through the global configuration system, was the second change that produced the error state; an essay sentence saying "a kill switch triggered the outage" compresses this and is a paraphrase, not the page's wording.
- Duration sentence: "The incident was resolved at 09:12 (~25 minutes total impact), when all services were fully restored."

### Item 9

- The PDF's own title is "External Technical Root Cause Analysis — Channel File 291". The date 6 August 2024 comes from the file name; the body text does not print a publication date.
- The staged-rollout sentence is finding 6, under the heading "Template Instances should have staged deployment", and is prefixed "Findings:".

### Item 10

- The on-page headline is "Roblox Return to Service"; the date range "10/28-10/31 2021" is in the URL slug only.
- The page gives the enablement time precisely: "On October 27th at 14:00, one day before the outage, we enabled this feature on a backend service that is responsible for traffic routing."
- The feature was not new to Roblox on that day. The page says: "Several months ago, we enabled a new Consul streaming feature on a subset of our services." What had run for a day was streaming on the traffic-routing service. An essay sentence saying the feature "had run for about a day" needs that qualification.
- The quoted sentence contains the page's own error "it’s performance"; reproduce or mark it if quoting.
- 73 hours also appears as "The outage lasted 73 hours."

### Item 11

- The page mixes apostrophe styles: curly in "people’s", straight in "aren't".
- The live page is a 2023 Substack republication headed "From the Archives" and labelled "Originally published July 2015". The original 2015 Facebook note was not checked.

### Item 12

- The live URL returned HTTP 403 to `curl`. Two Internet Archive captures were read as raw HTML: netflixtechblog.com on 2023-12-13 and the original medium.com/netflix-techblog URL on 2018-05-19. The sentence is identical in both.
- Both captures carry the metadata `datePublished` 2018-05-17T15:01:01Z.
- The sentence uses curly double quotes inside the parentheses and a curly apostrophe in "let’s".
