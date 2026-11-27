# Keeping PII and sensitive data out of development and test environments, and what developers and AI agents use instead

Research date: 27 Nov 2026. Read tags: "raw text" = I read the text itself (curl, pdftotext, or HN API); "fetched via extraction" = WebFetch returned a model-extracted answer from the page, quotes are from that extraction; "snippet only" = search-result summary only, not verified on the page. Source types: official / named individual / anonymous commenter / vendor. Existing notes already hold Stripe devboxes (QA environment, no real user data), Ramp's sanitized replica, DORA RTS 2024/1774 Art. 16(5)(a), MAS TRM 11.1.6 and Replit; those are not repeated here. PCI DSS is excluded.

Honest summary of evidence quality: official, first-person statements of "no production data in dev" are rare. The strongest primary material found is (a) regulator decisions (Estonia, Norway), (b) GitLab's public handbook describing a pseudonymised staging copy, (c) eBay's subset-and-encrypt design, (d) incident post-mortems (Imperva, GitLab 2017, Okta, Facebook/Twitter logs). Most "how to do it" material is vendor content.

---

## 1. Stated rules: who says production data or PII is not allowed in dev/staging, and who copies it anyway

### Takeaway

Public, official bans are mostly stated by regulators and government security guidance, not by companies; companies that publish usually describe a copy with pseudonymisation or a subset (GitLab, eBay), i.e. "copy production, then transform", not "never". Practitioner testimony splits into a firm "no prod data in dev" camp (about 8 independent voices) and a "scrubbed copy" camp (about 6), with several warning that the scrubbed copy is usually done badly.

### Cited Findings

- GitLab (official, public handbook, undated, current page) [raw text via curl]: the environments table lists Staging (gstg) with Database "Pseudonymization of prod" and Terminal access "all engineers"; text: "This would be a static environment with an pseudonymized production database. The DB is a snapshot of the production DB (updated only often enough to keep migration times to a minimum)." — <https://handbook.gitlab.com/handbook/engineering/infrastructure-platforms/environments/>
- GitLab test-environments catalog (official) [raw text]: "Same topology as Production with pseudonymized production database." — <https://handbook.gitlab.com/handbook/engineering/testing/test-environments-catalog>
- GitLab "Staging Ref" page (official) [snippet only, page body did not extract]: a search summary said the page states the current staging environment "has customer data which is a blocker for giving more access to Engineering teams", and that Staging Ref is a separate sandbox with its own database. Treat as unverified until the page is read. — <https://handbook.gitlab.com/handbook/engineering/infrastructure/environments/staging-ref/>
- GitLab runbook (official) [snippet only]: staging holds a copy of the production database "that is not current", and access to staging is "treated the same as production". — <https://runbooks.gitlab.com/uncategorized/staging-environment/>
- GitLab, Jan 2017 post-mortem (official, 10 Feb 2017) [fetched via extraction]: "Every 24 hours we generate an LVM snapshot of the disk storing the production database data"; "The LVM snapshots are primarily used to easily copy data from our production environment to our staging environment." Staging as the unwitting source of the recovery copy is an unusual dual use. — <https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/>
- eBay (official engineering post, 6 Dec 2021) [fetched via extraction]: approach is "Take a subset of production data and move it to staging in a privacy-preserving way"; "Just a tiny (0.1%) subset of the listings, along with its dependency graph"; buyer and seller PII must be anonymized; "none of the data leaves the production zone without the review and approval" of security and compliance systems; it needs format-preserving encryption "where data in one domain maps to the same domain after encryption." Its earlier staging data was described in search summary as "unusable" [snippet only]. — <https://innovation.ebayinc.com/stories/the-staging-dichotomy-part-one/>
- UK Ministry of Justice security guidance (official government) [snippet only; page returned 404 on fetch]: test data must not contain live data by default and, if it does, is protected to the same standard as live data. — <https://security-guidance.service.justice.gov.uk/using-live-data-for-testing-purposes>
- Estonian Data Protection Inspectorate decision, see section 6: "As a general rule, the use of real personal data for the development or testing of information systems is prohibited." (official regulator) [raw text].
- Thoughtworks Technology Radar, "Production data in test environments", ring Hold, Oct 2021 and Mar 2022 (vendor/consultancy opinion; entry no longer on the current edition) [fetched via extraction]: "We continue to perceive production data in test environments as an area for concern." Snippet summary adds that access controls on production are pointless if data is copied to a test database all developers can reach, and that fake data is the safer approach. — <https://www.thoughtworks.com/radar/techniques/production-data-in-test-environments>
- Bishop Fox, Tony Lozano (named individual, security consultant at a vendor, 29 Aug 2019) [fetched via extraction]: "Putting prod data in dev means losing confidentiality for the sake of availability"; "Developers don't usually need real production data to test the application thoroughly"; he says he found large amounts of PII, credentials and media in test and staging environments several times in one year. — <https://bishopfox.com/blog/keep-production-out-of-development>
- thoughtbot, Sweta Sanghavi (named individual, 6 Mar 2020, updated 23 Aug 2023) [fetched via extraction]: recommends seed data with no real user data for most products; of the scrubbed-copy option she writes "The risks of this method outweigh the benefits for most products." — <https://thoughtbot.com/blog/protecting-user-data-in-HIPAA-compliant-staging-environments>

Hacker News testimony (anonymous commenters; all [raw text] via API):

- Firm "no real data in dev/staging" voices (8): bmelton, 2010, "people's dev environments are generally far less secure than their prod environments" (<https://news.ycombinator.com/item?id=1997593>); house9-2, 2019, "I personally don't put production (real) data on staging servers to begin with; always scrub your production clones or generate data" (id=21143731); chovybizzass, 2021, a security-minded company where staging held "crap data" and asking for production data "they said no" (id=26283201); jaredsohn, 2021, central staging DB with fake data, copy it locally (id=27667920); Eridrus, 2022, "SWE/SRE do not have access to user data. SWEs just have no prod access at all" (id=32968181); onion2k, 2022, staging DBs derived from production "should be considered production data" and "are a GDPR violation waiting to happen" (id=31189034); fragmede, 2026, extra spend on a dev/test environment "so dev have no prod access" (id=47788353); traceroute66, 2026, running an agent against test rather than production would have found the bug (id=49694336).
- Copy-production voices (6): professorplumb, 2013, overwrites staging with the current production DB, "as long as you're allowed to" (id=5871892); kikimora, 2025, "Snapshots to move production data into staging" (id=44345378); jypepin, 2018, subset dump with names and emails replaced, which also avoids "mistakenly sending a batch email to prod users" (id=16771496); wutwutwat, 2024, postgresql-anonymizer run weekly to produce a scrubbed copy for test/QA, then smaller trimmed copies for dev (id=39419818); softwaredoug, 2021, per-developer namespaced sandbox DBs populated by sampling a subset of prod (id=27671230); consp, 2018, same pseudonymised-subset practice but "almost always done badly (only randomizing indexes and not all data)" (id=16773898).
- Note: these are independent accounts but anonymous and unverifiable; none names an employer.

### Inferences

- The only large company in this sample that says outright that its staging holds a production-derived database is GitLab, and it states pseudonymisation, not exclusion; its terminal access is "all engineers". That makes it a useful counter-example for the essay: a "pseudonymised copy open to all engineers" is a published norm, and GitLab's own Staging Ref page (if the snippet is accurate) calls customer data in staging a blocker to more access.
- Stripe (already in notes) and Estonia's regulator are the two sources that say "not at all"; the middle ground is the common one.

### Gaps

- I found no public handbook besides GitLab's with an explicit prohibition sentence. Searches for "handbook production data not allowed in staging" returned only Thoughtworks and GitLab.
- GitLab's Staging Ref statement on customer data is snippet only; the Data Classification Standard's rule for non-production use was not read.

---

## 2. What developers use instead

### Takeaway

Everything in the list is in use, but documentation at scale comes from vendors and small teams; named large companies document subsetting plus encryption (eBay) and pseudonymised snapshots (GitLab). Common failure points are consistent across independent sources: keys and joins break under naive masking, new PII columns slip through, masked data differs from the real shape, and stale copies drift.

### Cited Findings

Seeded fixtures and factories:

- thoughtbot [fetched via extraction]: seed data is the default recommendation; drawback "it does take time to get to a high volume of data", and some bugs such as inefficient migrations may only appear at production volume. (see section 1 URL)
- HN anecdotes on Faker-based generation (anonymous, raw text): onmyway133 2021 (id=28139330), psadauskas 2026 (id=47457879), jaredsohn 2021 (id=27667920). hamdouni 2025 (id=44560236): "Real user data often has inconsistencies, missing fields, unexpected formats ... that synthetic test data tends to miss."

Synthetic generators and seeding tools:

- Snaplet (vendor, shut down; Supabase blog dated 14 Aug 2024) [snippet only]: the company closed and open-sourced Copycat (deterministic fake data), Snaplet Seed (synthetic data from a schema) and Snapshot under MIT. A product in this category closing is evidence the commercial market is thin for small teams. — <https://supabase.com/blog/snaplet-is-now-open-source>
- Neon blog (vendor, 17 Nov 2025) [fetched via extraction]: names the pitfalls of synthetic data: it "inevitably drifts from the messy, uneven patterns of real production traffic". — <https://neon.com/blog/handle-pii-staging-databases>
- Tonic, Gretel, Synthesized, Neosync: not read in this pass; no first-party figures collected. (Tonic appears only as a name in secondary snippets.)

Anonymised, masked copies and subsetting:

- eBay [fetched via extraction]: subset 0.1% plus dependency graph, format-preserving encryption, review gate (section 1).
- GitLab [raw text]: pseudonymised snapshot, updated "only often enough to keep migration times to a minimum" (staleness is accepted by design).
- HeyJobs engineering post (named company, Medium, date not captured) [snippet only]: internal "Production Anonymized Database Dump", a subset used for local setup and disposable environments, which it says needs extra checks to keep sensitive data safe. — <https://medium.com/heyjobs-tech/speeding-up-our-monolith-onboarding-from-1-day-to-15-mins-by-improving-local-data-setup-225ee8518ce8>
- PostgreSQL Anonymizer (Dalibo, open source; postgresql.org release notes) [snippet only]: declarative masking rules via security labels; modes include dynamic masking (hides PII only from masked roles), static masking (permanent removal) and anonymous dumps; v3.2 (Sept 2026) blocks superusers from masking. One practitioner (wutwutwat, above) reports weekly scrubbed copies with it. — <https://www.postgresql.org/about/news/postgresql-anonymizer-32-3373/>
- Neon [fetched via extraction] (vendor): lists the failure modes of each approach: "Foreign key relationships can get corrupted if you're not careful about consistent hashing"; "New PII fields won't get masked automatically unless you explicitly add them to the config"; "Replication lag can cause issues where staging data is minutes behind production"; replication-based masking costs "infrastructure complexity and cost"; its own branches use static masking, dynamic masking "on the roadmap", and it does not detect PII automatically.
- HackerNoon, "Akhil", Lead SDET (named individual, 13 Jul 2026) [fetched via extraction; single unverifiable account, treat as anecdote]: a manual scramble script took three days per sprint; deterministic salted hashing "keeps joins working in integration tests". See incident in section 4.
- Re-identification warnings (independent, 4 non-vendor voices): Bishop Fox, "you can't just anonymize your prod data" and "Great minds have put in a lot of time figuring out how to cross-link data and undo anonymization", suggesting k-anonymity, l-diversity and t-closeness checks; thoughtbot, "There is a risk of leaving enough user-related data that can be traced back to a user"; HN jmileham 2013, anonymised dumps on laptops still reveal "the ways in which they've used your app, the content they've created, and the graph of ot[hers]" (id=5912885); HN consp 2018 (above).
- ICO (official) [snippet only, via a Burges Salmon summary]: synthetic data generated from personal data is not automatically anonymous; the anonymisation guidance applies a "reasonably likely" test. I fetched the ICO accountability page and it does not mention synthetic data, so this attribution is unverified.

Sampled data and per-developer branches:

- softwaredoug (HN 2021, id=27671230): per-developer, per-branch namespaced sandbox DBs populated by developer-controlled sampling of prod. "The key here is 'sample' from prod to dev, otherwise it's far too large to be workable."
- Supabase docs (vendor) [fetched via extraction]: "create a development branch for your database. This allows you to test changes in a safe environment before merging them to production." (Branching copies schema, not production data, in Supabase's model; I did not verify that sentence, so I do not rely on it.) — <https://supabase.com/docs/guides/getting-started/mcp>
- Neon and Xata branching with masking (vendor) [snippet only]: Xata blog and Neon blogs describe masked branches and pgstream replication with masking applied to snapshot and every change. — <https://xata.io/blog/anonymization-the-missing-link-in-dev-workflows>
- PlanetScale, Snowflake zero-copy clones, Iceberg/Delta branches: not researched in this pass (see gaps).

Shadow traffic and replay:

- Speedscale (vendor) [snippet only]: redaction must decode JSON, Protobuf and Base64 and tokens such as JWTs; "simple anonymization doesn't often work with traffic replay because data fidelity matters"; redact at capture so the raw data never leaves the network. InfoQ (secondary) says mirroring needs on-the-fly redaction and strict isolation. No large company's first-party account of scrubbed replay was found.

### Inferences

- The recurring failure pattern, from independent sources, is a list of four: keys (joins), completeness (new columns), fidelity (masked data not behaving like real data), freshness. Only eBay and GitLab show a full design that deals with them, and GitLab accepts staleness.
- Static masking at copy time still leaves a production-derived dataset in the environment; none of the sources claim it removes the need to treat the result as sensitive (onion2k's point).

### Gaps

- No first-party numbers on cost or adoption for any vendor tool; Tonic, Gretel, Synthesized, Neosync claims not examined.
- No named company account of Snowflake clone masking, Iceberg/Delta branches or PlanetScale data branching.
- No published evidence of "masked data hid a bug" beyond hamdouni's general statement and Neon's own caveat on synthetic realism; no concrete post-mortem found.

---

## 3. Architecture that keeps PII out of reach by construction

### Takeaway

The best-documented pattern is tokenisation behind a vault plus classification and lineage that drive access control, retention and deletion (Adyen, Airbnb, Uber, Meta). These posts describe production controls; almost none say what dev environments see, so the link to "dev holds only tokens" is an inference.

### Cited Findings

- Adyen (official, 1 Oct 2019) [fetched via extraction]: incoming PII "passes through our Tokenization system, which encrypts the data with a key from the HSM-backed vault key manager"; ciphertext goes to a Data Vault with a UUID as token; the token replaces PII in a Tokenized Data Lake; report builders call a Detokenization service; internal services "can now use the Tokenized data instead of the raw data." The post does not address dev or test environments. (Described as architecture only; the system is for personal data generally.) — <https://www.adyen.com/en_GB/knowledge-hub/securing-your-personal-data-via-tokenization>
- Skyflow, CleverTap, HashiCorp Vault Transform, AWS Security Blog, DesignGurus (vendors and explainers) [snippet only]: vault vendors (Skyflow, marked vendor) say tokenisation shrinks breach impact and that detokenisation should be limited to approved callers and logged; deterministic tokens allow joins but leak equality and frequency patterns; format-preserving encryption keeps data shape with less stored state. Marketing claims; no independent verification.
- Airbnb Data Protection Platform (official, Medium series Parts 1 to 3) [snippet only; Medium returned 403]: Madoka (data inventory/metadata), Inspekt (classification service that scans data stores, with CNN, BERT-NER models), Angmar (secret detection in code), Cipher (encryption service), Obliviate (privacy request orchestration). Part 1 URL: <https://medium.com/airbnb-engineering/automating-data-protection-at-scale-part-1-c74909328e08>
- Uber (official, 9 May 2024) [fetched via extraction]: DataK9 auto-tags columns; fine-grained categorisation is "pivotal in implementing privacy and security controls, such as access policies and encryption" and supports "retention and deletion"; about 1,000 manually labelled datasets (under 1%), automation handles the rest ("(>400K)" datasets); a false negative could mean failing to "enforce appropriate retention", a false positive could "unnecessarily restrict access to non-sensitive data or delete them prematurely." — <https://www.uber.com/en-DE/blog/auto-categorizing-data-through-ai-ml/>
- Meta (official, 22 Jan 2025) [fetched via extraction]: lineage depends on steps to "inventory, schematize, and annotate data assets into a unified asset catalog"; lineage is "a key precursor to implementing Policy Zones"; purpose limitation "restricts the purposes for which data can be processed and used." The extraction did not confirm label propagation in this particular post; other Meta posts (Aug 2024 Policy Zones, Jul 2025 batch Policy Zone Manager) were seen in snippets only. — <https://engineering.fb.com/2025/01/22/security/how-meta-discovers-data-flows-via-lineage-at-scale/>
- Databricks (vendor writing about internal use, 6 Mar 2026) [fetched via extraction]: LLM column classification of internal logs and tables, "reliable labels now directly drive masking, access control, retention, and residency rules", files tickets for owning teams; "up to 92% precision and 95% recall" on 2,258 self-labelled samples (self-reported). — <https://www.databricks.com/en/blog/logsentinel-how-databricks-uses-databricks-llm-powered-pii-detection-and-governance>
- Kore Nordmann (named individual blog) [snippet only]: classifications are "declared" or "inherited" along column lineage with the most sensitive upstream input winning. Atlan and dbt (vendors) say propagation through lineage is optional or has limits (aggregations can drop classifiers). — <https://kore-nordmann.de/blog/a-boolean-pii-flag-is-not-enough.html>
- Eridrus (HN 2022, anonymous): no production access for SWEs at their employer; SREs only run signed, reviewed binaries; ML is greyer (id=32968181).

### Inferences

- Classification and lineage are documented mainly as ways to enforce retention, access and deletion in the warehouse. The step the essay needs (a dev environment only ever receives tokens or fake rows) is a design the sources support by implication (Adyen's internal services get tokens), not something a named company says about dev.
- Uber's own caveat (false positives restrict access, false negatives miss retention) is a good honest note: classification is probabilistic.

### Gaps

- No public first-party material found for Google, LinkedIn, Netflix, Lyft, Stripe, Square/Block, Monzo, Wise, Nubank or Coinbase on tagging or tokenised dev data (one combined search returned nothing from those companies).
- Envelope or field-level encryption with keys withheld from dev: only general vendor explainers; no named company statement.
- Deletion frameworks reaching copies: only Airbnb's Obliviate as a name (snippet); nothing on backups or dev copies.

---

## 4. Leaks from non-production in practice

### Takeaway

Published incidents are dominated by (a) test copies of production exposed through a pivot (Imperva), (b) regulator-documented test environments with real data (Norway, Estonia, Poland), and (c) a few staging breaches where the company says customer data was not there (New Relic). Remediation is almost always "move the copy behind the VPN and rotate keys", and in regulator cases "delete or anonymise, then write a test-data policy".

### Cited Findings

- Imperva (official post-mortem, Aug 2019) [fetched via extraction]: "we created a database snapshot for testing"; "an internal compute instance that we created was accessible from the outside world and it contained an AWS API key"; the key "was used to access the snapshot". Changes: tighter access controls, "increasing audit of snapshot access", "decommissioning inactive compute instances", rotating credentials, "putting all internal compute instances behind our VPN by default", more frequent infrastructure scanning. Secondary (snippet): the snapshot held email addresses, hashed salted passwords, API keys and TLS keys for a subset of Cloud WAF customers; learned of it in Aug 2019 via a third party. — <https://imperva.com/blog/?p=10646>
- Norwegian Confederation of Sport (regulator, May 2021) [snippet only, via search summary]: testing with real data on about 3.2 million people left it online for 87 days; regulator found no legal basis, breaches of minimisation and confidentiality, and said synthetic data or far less data could have been used. Fine reported differently: EDPB page EUR 125,000; other reports about NOK 1.2 million. — <https://www.edpb.europa.eu/node/1794_en>
- Estonian Inspectorate, Article 60 decision (published on EDPB site, 2026; incident reported 2025) [raw text, pdftotext]: copies of production data in test environments of five applications contained data on employees (27,500 in Estonia alone), their children and contact persons, including health examination data, "had not been anonymised or pseudonymised", found through an identity and access management audit; two IT developers had access. Controller response: suspended the test environment, deleted or anonymised data within two weeks, wrote a test-data framework and bought an anonymisation tool. Outcome: admonition, proceedings terminated. — <https://www.edpb.europa.eu/system/files/2026-10/decision-no-3971_en.pdf>
- Other EDPB-published decision (no. 3858) and Enforcement Tracker ETid-3108 (test environment with a publicly known username and password holding real personal data) [snippet only]. Polish Pika/Fortum case: real personal data in test environment without prior pseudonymisation [snippet only]. — <https://www.edpb.europa.eu/system/files/2026-10/decision-no-3858_en.pdf> ; <https://www.enforcementtracker.com/ETid-3108>
- New Relic (official, Dec 2023) [fetched via extraction of a news report]: attacker breached a staging environment and accessed "certain data" about customer use of the software; New Relic said customer telemetry and application data does not reside in staging. — <https://www.thestack.technology/new-relic-hack-staging/>
- Optus 2022 [snippet only]: press speculation that customer data was used in testing; I could not confirm from an official finding. Rubrik (sandbox with a subset of contact and support data) and Dell (test environment said to hold synthetic data) also [snippet only].
- HackerNoon, Akhil (13 Jul 2026) [fetched via extraction; single account, unverifiable]: staging Postgres with about 400,000 real customer rows exposed to about 80 contractors for roughly 36 hours after a junior engineer restored the raw dump instead of the sanitised one; fix was a weekly automated masked pipeline, raw access limited to one IAM role, staging account unable to read the production bucket. — <https://hackernoon.com/we-leaked-pii-in-staging-heres-the-automated-data-masking-pipeline-that-saved-us>
- HN Raed667, 2019 (anonymous): onboarding script meant to anonymise a copy of production took the production DB IP and the developer's IP as parameters; "I guess it was inevitable for those to get mixed up", no write protection on production (id=19469128).
- PII in logs: Twitter (official, May 2018) said "passwords were written to an internal log before completing the hashing process" [snippet only]; Facebook (official, 21 Mar 2019, updated 18 Apr 2019) said "some user passwords were being stored in a readable format within our internal data storage systems", later also Instagram logs, found in a routine security review, "never visible to anyone outside of Facebook", no evidence of internal abuse [fetched via extraction]. — <https://about.fb.com/news/2019/03/keeping-passwords-secure/>
- Not found: a published incident of real data in test fixtures committed to git at a named company, or PII pasted into wikis/tickets (other than Okta HAR files, section 5).

### Inferences

- Imperva shows the specific mechanism the essay can use: a testing copy made for a migration was reachable through a machine nobody treated as sensitive.
- Regulator decisions give the strongest evidence that "real data in test" happens through ordinary processes and is found by audits, not attackers (Estonia).

### Gaps

- Official post-mortems naming a staging/dev copy as the leak source are few; several widely cited cases (Optus, T-Mobile) have no confirmed test-environment link in what I could read.
- Laptop dumps: only HN voices (Kalium 2020, id=25432622: no "sane middle ground" between laptops holding PII dumps and laptops being treated as sensitive; jmileham 2013). No company incident account.

---

## 5. Side doors to a development machine

### Takeaway

The documented side doors are support artefacts (Okta HAR files), logs (Facebook, Twitter), tickets read by agents (Supabase MCP demonstration), and error telemetry. Published scrubbing practice is mostly vendor tooling and generic advice (scrub at ingestion, but better not to send PII).

### Cited Findings

- Okta (official, root-cause post Nov 2023) [fetched via extraction]: HAR files in the support case system "contained session tokens"; used to take over sessions of five customers; 134 customers (under 1%) had a file accessed per an earlier summary [snippet only]. Changes: revoked tokens in HAR files, Chrome Enterprise blocking personal Google profiles on managed laptops, more monitoring of the support system, token binding for admins; Okta advises sanitising HAR files before sharing. — <https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/>
- General Analysis demonstration, relayed by Simon Willison (named individual, 6 Jul 2025) [fetched via extraction]: a support ticket carrying hidden instructions made a Cursor agent with Supabase MCP (service-role access, bypasses row-level security) read an `integration_tokens` table and write it back into the ticket. It was a demonstration, not a real incident. Recommended: read-only, project-scoped mode, not exposing sensitive tables, treating tickets as hostile. — <https://simonwillison.net/2025/Jul/6/supabase-mcp-lethal-trifecta/>
- Databricks (vendor, 2026): scans internal logs and tables for PII with LLM classification (see section 3).
- Datadog Sensitive Data Scanner and Observability Pipelines, Elastic NER plus regex, PostHog ingestion-time scrubbing, AWS CloudWatch Logs data protection (all vendors) [snippet only]: redact before logs leave your environment; PostHog docs say scrubbing is opt-in and best-effort and the best control is not sending PII. Several sources note ingestion-time scrubbing does not clean logs already stored.
- HN ryandrake 2023 (anonymous): tag log lines containing personal data so they can be scrubbed before transmission, otherwise they sit "available to any developer reading a bug report" (id=34314114).
- Support tickets, analytics exports, CSVs in chat, notebooks with cached outputs: no first-party company policy or incident account found.

### Inferences

- The strongest "agents + side doors" evidence is a demonstration, not an incident. Okta shows human support workflows already move credentials into systems with broad internal access.

### Gaps

- Nothing found on notebooks with cached outputs, CSVs shared in chat, or analytics exports at named companies; Sentry/crash-dump scrubbing was not examined beyond vendor snippets.

---

## 6. What regulators say

### Takeaway

GDPR has no test-data rule; regulators apply Articles 5, 25 and 32 and have said plainly that real personal data in test is generally not allowed. The Estonian text is the clearest official statement found. Vendors overstate: the GDPR text does not require synthetic data, and pseudonymised data remains personal data.

### Cited Findings

- GDPR Art. 25 (official text, via gdpr-info.eu) [fetched via extraction]: 25(1) "appropriate technical and organisational measures ... such as pseudonymisation ... designed to implement data-protection principles ... such as data minimisation"; 25(2) "by default, only personal data which are necessary for each specific purpose of the processing are processed", applying to "the amount of personal data collected, the extent of their processing, the period of their storage and their accessibility", and that data are not "made accessible ... to an indefinite number of natural persons." — <https://gdpr-info.eu/art-25-gdpr/>
- Art. 5(1) (purpose limitation, minimisation, storage limitation, security) and Art. 32 (security of processing): not separately fetched; the Estonian decision restates Art. 5(1) and 5(2) [raw text]. I rely on that and on general knowledge for Art. 32, flagged as not read in primary form here.
- Estonian Data Protection Inspectorate (regulator) [raw text via pdftotext]: "As a general rule, the use of real personal data for the development or testing of information systems is prohibited." It cites the Estonian Information Security Standard E-ITS, which segregates test from production and recommends anonymisation, "or at a minimum the pseudonymisation", of test data (OPS.1.1.6.M11), and adds that "in exceptional cases and where an appropriate legal basis exists, it may be permissible to use original data for testing purposes." The controller admitted no legal basis existed. — <https://www.edpb.europa.eu/system/files/2026-10/decision-no-3971_en.pdf>
- Norwegian Datatilsynet / NIF (regulator, 2021) [snippet only]: no legal basis for testing with real data of that volume, synthetic data or far less data could have been used.
- Spanish AEPD blog, "Personal Data Breaches: Development and Pre-Production Environments" (regulator) [snippet only; fetch failed with 500]: said sampling of real data should be avoided in testing and special-category data needs explicit consent for real-data testing. — <https://www.aepd.es/en/prensa-y-comunicacion/blog/data-breaches-development-and-pre-production-enviroments>
- UK ICO (regulator): privacy-by-design page refers to "protecting personal information in development environments" [fetched via extraction; no test-data or synthetic-data text on that page]; no dedicated ICO page on test data found. — <https://ico.org.uk/privacy-design>
- EDPB Guidelines 01/2025 on Pseudonymisation (regulator, adopted 17 Jan 2025) [snippet only]: cover pseudonymisation in support of Art. 5, 25 and 32 and say pseudonymised data remains personal data; I did not find text on test environments. — <https://edpb.europa.eu/news/news/2025/edpb-adopts-pseudonymisation-guidelines-and-paves-way-improve-cooperation_en>
- DORA RTS Art. 16(5)(a) and MAS TRM 11.1.6: already in existing notes.
- Vendor claims to discount: articles saying copying production "usually fails GDPR scrutiny" (ComplyDog) or that compliance teams "keep rejecting anonymized production data" (HackerNoon) are commentary [snippet only], not regulator text.

### Inferences

- What a text requires: lawful basis, minimisation, purpose compatibility, and security proportionate to risk; a copy in test is a new processing operation with its own basis. What regulators add: in practice, anonymise or pseudonymise and segregate, and expect real data only with an explicit legal basis. What vendors add: that synthetic data is the only compliant path. The sources do not say that.
- The Estonian decision ended in an admonition, not a fine, after fast remediation; the Norwegian case ended in a fine. Remediation speed and volume appear to matter.

### Gaps

- No ICO or CNIL decision specifically about test data found. Art. 32 text and EDPB pseudonymisation guidance not read first-hand.

---

## 7. What changes for AI coding agents

### Takeaway

Published practice is thin and mostly about credentials: give the agent no production reach, use branches or dev projects, read-only mode, and treat anything the agent reads as potential instructions. First-party statements about agents reading fixtures or generating test data safely were not found.

### Cited Findings

- Stripe (already in notes): agents run in devboxes in QA with no real user data.
- Supabase docs (vendor) [fetched via extraction]: "Connect to a production project only when the task requires production evidence"; unattended routines read-only ("executes SQL queries as a read-only Postgres user"); "Keep manual approval enabled for interactive work"; "This is not foolproof though." — <https://supabase.com/docs/guides/getting-started/mcp>
- Willison / General Analysis (above): agent with private data, untrusted input and an exfiltration path (the "lethal trifecta").
- HN voices (anonymous) on agents and data: fluidcruft 2026 (id=50164050) tells Claude "no production data exists, any data that exists is mine" because it "is trained to work in production systems and behaves that way instinctively"; traceroute66 2026 (ids 49693363, 49694336) on running an agent against production instead of test; theycallmeritik 2026 (id=49722433) asks about "synthetic test data generation" as "a massive bottleneck for AI agents"; nikisweeting 2026 (id=47185440) suggests running agent actions against "a staging env with fake data" and replaying on real data without the model. Four independent voices, all anonymous.
- TigerData, Red Gate, Dev.to (vendors/practitioner blogs) [snippet only]: agents debugging staging should not hold credentials that reach production; the Replit incident is attributed to permissions rather than model behaviour.
- No official guidance by a regulator or standards body on coding agents and test data was found; no first-party report of an agent pulling real rows into a pull request.

### Inferences

- If the environment holds only fake rows, schema inspection, fixture reading and test generation by an agent can see nothing real, which removes the main published failure mode (agents with live database reach). This follows from the Stripe statement and the Supabase/Willison material; no source tests it directly.

### Gaps

- Agent-written fixtures leaking memorised or copied real rows, agents committing real data into PRs: no published case found. Cursor/Copilot/Claude Code vendor documentation on ignore files and data handling was not reviewed.

---

## 8. What a one-engineer organisation can do

### Takeaway

Public small-team accounts converge on seed scripts with no production data, one isolated staging database, and automation that makes accidental production connection hard. They do not give a rigorous standard.

### Cited Findings

- thoughtbot (named, 2020/2023) [fetched via extraction]: seed data needs no added security; scrubbed copy "adds overhead" and "the risks ... outweigh the benefits for most products."
- Search summaries of PandaStack, Dev.to authors (snippet only): Faker seed refreshed nightly, never copy production rows; the most common mistake is pointing staging at the production database; a stale shell still holding the production connection string can make a seed run hit production.
- HN jaredsohn 2021 (id=27667920): one central fake-data staging DB, local copies, restore when broken. HN house9-2 2019 (id=21143731): generate or scrub. HN fluidcruft 2026: "I am the only user, no production data exists."
- Tools usable by one person [snippet only]: PostgreSQL Anonymizer, Replibyte, Pynonymizer, EvilSeed (open source), Snaplet's open-sourced Seed/Copycat.
- Minimum arrangement supported by the sources: separate accounts or projects for dev and prod with no cross-reach (Imperva, hackernoon story, Stripe), seeded fixtures in git, any production-derived data only through an automated, reviewed, masked pipeline into a restricted location.

### Inferences

- For one engineer the cheapest route is "no production rows at all", because masking requires maintaining rules for every new column, which a one-person team will not keep current.

### Gaps

- No named solo-founder account of a documented privacy-by-construction setup; only practitioner blogs and vendor guides.

---

## Approaches table

| Approach | What it is | Who documents using it (voices) | What it protects | What it breaks | Effort |
| --- | --- | --- | --- | --- | --- |
| Seeded fixtures, factories | Generated rows in git | thoughtbot (named), HN about 4 anonymous | No real data present at all | Realism, volume, odd real formats | Low, steady upkeep |
| Synthetic generators | Schema-driven fake data, vendor tools | Snaplet (closed, open-sourced), Neon (vendor caveat) | No real data | Drift from real distributions | Low to medium |
| Static masking or pseudonymised copy | Copy production, transform | GitLab, HN wutwutwat, consp, jypepin | Direct identifiers | Missed new columns, joins, residual re-identification; copy still sensitive | Medium to high |
| Subset plus format-preserving encryption | Small slice with dependency graph | eBay (official) | Identifiers, volume | Pipeline cost; review gate | High |
| Dynamic masking | Mask at query time by role | Dalibo extension (open source), Neon roadmap | Production never copied | Real data still in the database | Medium |
| Sampling into per-developer sandboxes | Developer-controlled sample | softwaredoug (HN) | Scale | Whatever sampling copies | Medium |
| Traffic replay with redaction | Capture, scrub, replay | Speedscale (vendor), InfoQ | Avoids static copies | Fidelity vs redaction | Medium to high |
| Tokenisation and data vault | Tokens everywhere, vault detokenises | Adyen (official) | Raw PII outside the vault | Joins, audit of detokenisation | High, design-time |
| Classification and lineage | Tag columns, drive policy | Airbnb, Uber, Meta (official), Databricks (vendor) | Access, retention, deletion | False positives and negatives | High |
| No production reach for dev and agents | Separate environment, no data path | Stripe (existing notes), Eridrus, bmelton (HN) | Everything | Debugging real-data bugs | Medium, mostly architecture |

---

## Angles for an essay

1. "The copy is the leak": Imperva's testing snapshot, the Estonian test-environment copies, Norway's 3.2 million records, and the staging-restore mix-up all start with a copy made for convenience; GitLab's own handbook shows "pseudonymised production, all engineers" as normal practice.
2. "Masking is a promise you must keep forever": every independent source (Neon, Bishop Fox, thoughtbot, consp, jmileham) lists the same failure points; the only designs that hold are keep-it-out or tokenise-at-source, both architectural.
3. "Regulators already said it": the Estonian decision's plain "as a general rule, the use of real personal data for the development or testing ... is prohibited" shows a requirement from a text and a regulator, separate from vendor marketing.
4. "Agents change the cost of a bad environment": agents read everything and take instructions from tickets and rows; if the box holds only fake data, the lethal-trifecta demonstration has nothing to steal.
5. "Small teams can start at zero rows": seed scripts and no cross-reach cost less than any masking pipeline, which suits a one-engineer organisation and the broker design.

## Gaps (overall)

- No first-party statements for most named companies (Google, LinkedIn, Netflix, Lyft, Square/Block, Monzo, Wise, Nubank, Coinbase) on dev data or tokenised dev environments.
- Vendor tools (Tonic, Gretel, Synthesized, Neosync, Xata, Snowflake, PlanetScale, Iceberg/Delta branches) not read first-hand; no cost or adoption numbers.
- Several regulator items (NIF, AEPD, EDPB decision 3858, Pika) are snippet only; EDPB pseudonymisation guidelines and GDPR Art. 5 and 32 not read directly.
- No incident account found for real data in committed test fixtures, wikis or chat; no coding-agent-specific published incident of real rows reaching a PR.
- The GitLab Staging Ref "customer data" statement and the ICO synthetic-data statement are secondhand summaries; verify before quoting.
- Some pages carry dates in late 2026 (HackerNoon, Estonian decision, Neon, Databricks); the HackerNoon account is single and unverifiable.
