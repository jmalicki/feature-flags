# Who owns a table: data contracts, data ownership, producer-consumer coordination, data on-call and ML feature ownership (2013-2026)

Scope: the organizational and cultural side of changing shared data safely. This covers who owns a table, event or feature; who must be told before it changes; who approves; how breakage is detected and who is alerted; and how the old version is retired. It is the data counterpart to the article's claims that authors own their flags, teams operate what they deploy, and approval moves from meetings to recorded evidence.

Already covered elsewhere, so not repeated here except as cross-references:

- `analytical_pipeline_changes.md` covers dbt contracts and versions, schema registries, lineage tools, Dali views, Minerva, the GoCardless "6 months on" post, the PayPal template sections and Convoy's Protobuf events as mechanisms.
- `end_to_end_cases_and_failures.md` and `feature_stores_and_versions.md` cover Sculley et al. 2015 (versioned copies), the data cascades abstract, Uber's 2021 culture post (schema-change reviewers), and feature-version retention.

Access marks:

- FULL-TEXT means I read the raw page or PDF text with curl and text extraction, and quotations come from that text.
- TOOL-EXTRACT means a fetch tool summarized the page. Wording is the tool's and needs re-checking before it is quoted.
- SNIPPET means search-result text only.

Blocked or refused automated access during this run (no mirrors used): Medium (GoCardless Tech, Airbnb Engineering, Barr Moses), netflixtechblog.com (403, so Netflix Data Mesh and Data Lineage posts are unread), whatnot.com (403 to both curl and the fetch tool), Packt (403, so Andrew Jones's 2023 book is unread), and uber.com to curl (406; the fetch tool worked).

## 1. Data contracts as a practice: origins, first-person accounts, contents, enforcement and what changed organizationally

### Takeaway

Data contracts began in 2021 as one engineer's programme at GoCardless and spread through 2022 advocacy (Chad Sanderson, Convoy) into an open standard (PayPal's 2023 template, then ODCS under the Linux Foundation's Bitol project, v3.0.0 on 2024-10-21 and v3.1.0 on 2025-12-08). The documented organizational change is the same in every first-person account: the producing team becomes the named owner, consumers state their needs up front, and changing a contract is made deliberately heavier than changing a table. Enforcement is via Git plus CI or plus a platform that provisions resources from the contract. Adoption by producers of analytics-only data was slow at GoCardless. No account gives a measured drop in incidents.

### Cited Findings

Origins and GoCardless (Andrew Jones):

- Andrew Jones, "Improving Data Quality with Data Contracts", GoCardless Tech (Medium), dated 23 Dec 2021 in search results. SNIPPET only, because Medium returned 403 to curl and to the fetch tool. Search text says a later post would describe the implementation and tooling. — [Medium](https://medium.com/gocardless-tech/improving-data-quality-with-data-contracts-238041e35698)
- Andrew Jones, "Implementing Data Contracts at GoCardless", GoCardless Tech (Medium), 2022. Blocked (403). Not read. — [Medium](https://medium.com/gocardless-tech/implementing-data-contracts-at-gocardless-3b5c49074d13)
- Jones's Medium bio (SNIPPET) says he coined the term "data contracts" in April 2021. His own site says "I created data contracts in 2021 and wrote the definitive book in 2023" (FULL-TEXT, home page). This is a self-description, not independent dating. Note that Microsoft WCF used "data contract" for a different, older concept; I did not verify any earlier analytics usage. — [andrew-jones.com](https://andrew-jones.com/)
- Andrew Jones (first person, hosted by a vendor), "7 Lessons From GoCardless' Implementation of Data Contracts", Monte Carlo blog, datePublished 2022-07-07, with an editor's note and a foreword by Barr Moses, Monte Carlo's CEO. FULL-TEXT. Mark it as vendor-hosted; the body is Jones in the first person. Findings:
  - Before contracts, data arrived through CDC and "a data engineer would own that data". Teams that wanted to change their data "would need to go through us" (the data team).
  - Rollout was a roadshow: "We started talking to every engineering team at the company", explaining contracts and taking feedback. Most teams rejected Avro, so the contracts used JSON (Jsonnet).
  - Mechanism: once the contract file is merged in GitHub, BigQuery and Pub/Sub resources are provisioned automatically. The process is "completely self-serve". Privacy and security helped build in categorization of "which entity owned which data asset".
  - Numbers at six months: "Roughly 30 different data contracts" powering "about 60% of asynchronous inter-service communication events". This conflicts with the GoCardless "6 months on" post cited in `analytical_pipeline_changes.md` (about 50%). The two are probably different snapshots; the discrepancy is unresolved.
  - Organizational effects: consumers and producers were "working together to set the data requirements – something that rarely happened before". The process for changing a contract "is intentionally heavy". Contracts "moved the onus on service owners to communicate", and producers now know "which teams to coordinate with regarding which data assets".
  - Adoption pattern: best adoption came from teams wanting new data streams, not migrations of existing ones. Inter-service consumers adopted fastest. Analytics and data-science consumers came "slower".
  - Claimed outcome: "our data quality has started to improve". This is qualitative only. A forecast that "upstream data incidents [will] plummet" is a prediction, not a result.
  - Limits: no incident counts, no deprecation policy, no on-call design. Lineage and SLOs are described as future work.
  — [Monte Carlo blog](https://www.montecarlodata.com/blog-data-contracts/)
- Andrew Jones, "Driving Data Quality with Data Contracts" (Packt, 2023). The Packt product page returned 403. Not read, so nothing is cited from it.

Advocacy (Chad Sanderson, then at Convoy):

- Chad Sanderson, "The Rise of Data Contracts", Data Products newsletter (Substack), 22 Aug 2022 (post_date in page JSON). FULL-TEXT. This is advocacy, clearly so: it argues a thesis and promises a later implementation post. Sanderson is also associated with a data-contract vendor, Gable; gable.ai hosts conference material, but I did not read a source that dates his role there. Points:
  - Diagnosis: "engineers have almost no incentive to take ownership of the data quality they produce outside operational use cases". CDC and ELT treat the production schema "as a non-consensual API".
  - The "GIGO cycle" lists, among other steps, "Producers have no idea how their data is being used downstream" and "Teams argue for better ownership and a 'single throat to choke'".
  - Ownership model: "Producers own a single contract for each entity (CRUD) or semantic event", and consumers request changes to it. Contracts evolve "in a way that is backward compatible".
  - He recommends column-level lineage so engineers see downstream impact: "It's hard to take accountability without awareness."
  - Starting point: begin from "the most recent data-centric Sev1 or Sev2", define an SLA, and bring the data team on board.
  - The Convoy example of a column drop breaking a revenue pricing model is already cited in `analytical_pipeline_changes.md`.
  — [Substack](https://dataproducts.substack.com/p/the-rise-of-data-contracts)

Critique of contracts:

- Benn Stancil (co-founder of Mode, an analytics vendor), "Fine, let's talk about data contracts", benn.substack, 23 Sep 2022. FULL-TEXT. Opinion. He accepts the problem but rejects the negotiated-agreement form as "impractical to achieve, impossible to maintain". It "replace[s] a brittle technical system with a negotiating table". Producers such as Salesforce administrators often "can't guarantee them anyway". He proposes a defence built by the data team itself. His own example: a Salesforce change broke reporting, and within a day a customer success manager showed a customer wrong numbers. — [Substack](https://benn.substack.com/p/data-contracts)

The open standard (PayPal, then Bitol/ODCS):

- PayPal, "Template for Data Contract" README, GitHub. FULL-TEXT. It describes "the data contract being used in the implementation of Data Mesh at PayPal". Its sections are fundamentals, schema, data quality, SLA, security and stakeholders, and custom properties. The repo now states it "has evolved and is now called Open Data Contract Standard (ODCS)", part of Bitol under the Linux Foundation. The articles list dates the open-sourcing coverage to 2023-05-01 through 2023-05-07. — [GitHub](https://github.com/paypal/data-contract-template)
- Bitol, ODCS changelog. FULL-TEXT. Versions and dates as published:
  - v2.1.0 on 2023-03-23 and v2.1.1 on 2023-04-26
  - v2.2.0 on 2023-07-27, v2.2.1 on 2023-12-18, and v2.2.2 on 2024-05-23 ("LAST VERSION OF THE v2 BRANCH")
  - v3.0.0 on 2024-10-21, v3.0.1 on 2024-12-22, and v3.0.2 on 2025-03-31
  - v3.1.0 on 2025-12-08
  - v3.2.0 is marked "APPROVED" with no date on the page I read (fetched Nov 2026). The README says "Its current version is v3.2.0."
  - The standard deprecates its own fields with a stated removal version (for example, slaDefaultElement "will be removed in ODCS v4.0.0"). That is a deprecation policy applied to the standard itself.
  — [ODCS changelog](https://bitol-io.github.io/open-data-contract-standard/latest/changelog/); [ODCS README](https://github.com/bitol-io/open-data-contract-standard)
- ODCS README (current). FULL-TEXT. Sections: fundamentals, schema, references, data quality, support and communication channels, pricing, team, roles, SLA, infrastructure and servers, authoritative definitions, tags, and custom properties. "Team", "roles" and "support & communication channels" are where ownership and who-to-tell live in the standard. — [GitHub](https://github.com/bitol-io/open-data-contract-standard)
- Bitol announcement of ODCS v3, Jean-Georges Perrin, 21 Oct 2024. FULL-TEXT. Bitol is described as "an incubation project from the Linux Foundation". The Technical Steering Committee is chaired by Perrin and includes Andrew Jones, along with several vendor CTOs and founders, such as Soda's. So the standard is shaped partly by vendors. — [bitol.io](https://bitol.io/odcs-version-3-transforming-data-contracts-with-enhanced-flexibility-integration-and-global-collaboration/)
- Bitol, "Bitol Announces ODCS v3.1.0", 7 Dec 2025 (page byline). FULL-TEXT. It thanks "Linux Foundation AI & Data" for governance; the release date is given as December 2025. The changelog date (2025-12-08) differs by a day from the announcement byline (7 Dec). — [bitol.io](https://bitol.io/bitol-announces-odcs-v3-1-0-stronger-smarter-and-stricter/)

Other first-person production accounts:

- Adevinta Spain (Data Platform team), "Creating source-aligned data products in Adevinta Spain", Adevinta tech blog, datePublished 2024-11-05. FULL-TEXT.
  - Ownership rule: "the team owner of a business domain who is the owner of the data produced in it" is accountable for publishing the data and its catalogue metadata.
  - Before contracts, the Kafka JSON ingestion "lacks key features such as versioning, runtime contract checks, SLOs and governance".
  - The contract is an immutable JSON file in GitHub. "For any change, including schema changes, whether minor or major, a new contract version should be created". There is a "Validity end date" applicable once a higher version exists, which is how the old version is retired. Schema versions are X.Y (major.minor).
  - The SLO block carries the owner, a support contact point, periodicity, time to recover, retention and sites.
  - Each field is flagged as needed for analytics or not, and PII fields are split into separate tables.
  - Outcome: automating DAG creation from the contract cut "Time to Effective Data" from about 5 days to about 30 minutes.
  - Limits: no consumer-notification process, no incident data, and no length for the validity window.
  — [Adevinta tech blog](https://adevinta.com/techblog/creating-source-aligned-data-products-in-adevinta-spain/)
- Monzo (Antonia Badarau, Irina Mugford, Massimo Frangiamore, analytics engineers), "A 'meshy' approach to Data: Enabling 100+ teams to build Data Models", Monzo blog, 22 April 2026. FULL-TEXT. See section 2 for the ownership model. The contract element is "interfaces": "An interface is a dbt model that a team explicitly declares as a governed contract for cross-team consumption." Only normalised and logical-layer models may be interfaces. Before this, consumers used "whichever model looked right… often something internal that could change without warning". The post reports "hundreds of formalised interfaces". — [Monzo](https://monzo.com/blog/a-meshy-approach-to-data)
- Monzo Customer Operations, "From Dashboards to Data Products", Monzo blog, 11 July 2025. FULL-TEXT. Each data product has "crystal-clear ownership" and "an informal data contract covering things like freshness, uptime, ownership, and documentation". This is explicitly informal, not machine-enforced. — [Monzo](https://monzo.com/blog/from-dashboards-to-data-products-how-we-are-redesigning-analytics-in-monzo)
- Virgin Media O2 with Google Cloud, "VMO2 uses data contracts to build scalable AI and data products", Google Cloud blog, 9-10 Dec 2025. FULL-TEXT. Vendor-hosted and co-written with the vendor; it promotes Dataplex.
  - The contract is YAML in GitLab and covers schema, semantics, quality metrics and SLOs (freshness, completeness).
  - CI reads the SLOs and provisions Dataplex data-quality scans.
  - Hub-and-spoke model: a central hub provides tooling and departmental spokes "own the contract and data quality".
  - Alerts flag schema drift and SLA breaches, so teams "treat data issues with the same urgency as application outages".
  - No incident numbers.
  — [Google Cloud blog](https://cloud.google.com/blog/products/data-analytics/vmo2-uses-data-contracts-to-build-scalable-ai-and-data-products/)
- Saxo Bank (Graham Stirling, Head of Data Platforms), "Saxo Bank's Best Practices for a Distributed Domain-Driven Architecture Founded on the Data Mesh", Confluent blog, 23 Jun 2021. FULL-TEXT. Vendor-hosted, written by a Saxo employee. Contract practices:
  - Protobuf schemas with semantic annotations, adopted "in late 2020".
  - Field- and message-level deprecation markers that give "consumers… insight into your future plans for breaking changes".
  - A review step in which schemas "changed in small increments are quickly approved".
  - Data-quality rules in Great Expectations, managed per domain via GitOps.
  — [Confluent](https://www.confluent.io/blog/distributed-domain-driven-architecture-data-mesh-best-practices/)
- Whatnot (Zack Klein), "Data contracts in the modern data stack", Data Council Austin 2023 talk and a Whatnot engineering post. SNIPPET only, because whatnot.com returned 403. Search summaries say Protobuf is the source of truth for event definitions, with dbt models generated automatically. — [Whatnot](https://www.whatnot.com/engineering/data-contracts-in-the-modern-data-stack); [Data Council slides](https://www.datacouncil.ai/hubfs/Data%20Council/slides/austin23/Lightning_11_ZackKlein_Data%20contracts%20in%20the%20modern%20data%20stack.pdf?hsLang=en)
- Not found as first-person accounts in this run: Shopify (covered in `analytical_pipeline_changes.md`), Miro (only a secondary vendor mention), Glovo, Wise, Zalando contracts specifically, and ING. For Saxo, JPMorgan, Nubank and Monzo, see section 2.

### Inferences

- Every first-person account moves three things the article cares about. First, ownership is written into the contract (owner team, support contact) rather than held in a wiki. Second, change goes through a pull request on the contract, so approval is a recorded review, not a meeting. Third, the producer, not the data team, learns who consumes what. This mirrors "authors own their flags" and "approval moves to recorded evidence".
- Contracts slow change on purpose. GoCardless calls the change process "intentionally heavy", and Adevinta makes every change a new version with an end date. That works against the article's "ship small, often" ethos at the source boundary. The likely reconciliation is to keep many small, cheap changes inside a team and make the cross-team interface slow and versioned (Monzo's interface layer).
- The contracts movement is unusually vendor-shaped. The Bitol steering committee has many vendor executives. Key first-person accounts appear on vendor blogs (Monte Carlo, Confluent, Google Cloud). The best-known advocate is linked to a contracts vendor. Treat claims of benefit accordingly.

### Gaps

- No first-person account gives a before-and-after count of incidents, breaking changes blocked, or time to detect after contracts were introduced.
- No account says who pays for running two contract versions in parallel, or how long the overlap lasts. Adevinta has an end-date field but publishes no typical window.
- GoCardless primary posts (2021-2022), the Jones book, Whatnot and Netflix were unreadable. The 50% versus 60% adoption figure for GoCardless at six months is unresolved.
- I found no Glovo, Wise, ING, Zalando or Miro first-person contract account.

## 2. Data mesh and domain ownership: principles, bank and payments accounts, and critiques

### Takeaway

Dehghani's 2019 and 2020 articles make ownership the first principle: analytical data is owned and served by the domain that produces it, through a "data product owner" who decides "when to change, revise and retire data and schemas". First-person bank and fintech accounts (Saxo 2021, JPMorgan 2021 via AWS, Nubank 2021, Monzo 2021-2026) show named ownership becoming mandatory metadata, combined with a central platform and central standards. None shows full decentralization. Critiques from 2022-2026, mostly from consultancies and vendors, report "re-badged" IT domains, missing skills and budgets, and partial adoption as the common outcome.

### Cited Findings

Principles (FULL-TEXT, martinfowler.com):

- Zhamak Dehghani (Thoughtworks), "How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh", martinfowler.com, 20 May 2019. FULL-TEXT.
  - Diagnosis: "We have moved away from domain oriented data ownership to a centralized domain agnostic data ownership". The central team consists of "hyper-specialized data engineers siloed from the operational units".
  - The product owner role: a data product owner "is responsible for the lifecycle of the domain datasets, when to change, revise and retire data and schemas", and "strikes a balance between the competing needs of the domain data consumers".
  - Success measure: "the lead time for consumers of a data product to discover and use the data product".
  - SLOs: owners must "provide an acceptable Service Level Objective around the truthfulness of the data". Each data product "defines and assures the target level of its integrity and truthfulness as a set of SLOs". One example is a near-real-time 'play events' product with lower accuracy alongside a delayed, more accurate one.
  — [martinfowler.com](https://martinfowler.com/articles/data-monolith-to-mesh.html)
- Zhamak Dehghani, "Data Mesh Principles and Logical Architecture", martinfowler.com, 3 Dec 2020. FULL-TEXT.
  - It names four principles: "domain-oriented decentralized data ownership and architecture, data as a product, self-serve data infrastructure as a platform, and federated computational governance".
  - Consumers "should be treated as customers". The domain data product owner is responsible for measures including "data quality, decreased lead time of data consumption, and in general data user satisfaction through net promoter score".
  - Governance: central certification of "golden datasets… is no longer relevant". Domain owners decide how to measure quality but "need to comply with the modeling of quality and specification of SLOs based on a global standard… automated by the platform".
  — [martinfowler.com](https://martinfowler.com/articles/data-mesh-principles.html)
- Limits: these articles are advocacy by a consultant; they define principles and do not report outcomes. Neither prescribes a deprecation window or a consumer-notification procedure.

Banks and payments firms:

- Saxo Bank (Graham Stirling), Confluent blog, 23 Jun 2021. FULL-TEXT, vendor-hosted.
  - "we federated the ownership of domain data and their representations and centralised oversight". Ownership is to be "anchored appropriately (typically in the business)".
  - A Data Governance Office is responsible for "'Activating' data domains, including identifying ownership, known data quality" issues. Data-quality issues "should be fixed at the source, not on consumption".
  - Ownership, lineage and quality metrics are published to "Data Workbench", built on LinkedIn's open-source DataHub.
  - Candid limit: "This process isn't easy, and we've only just begun."
  — [Confluent](https://www.confluent.io/blog/distributed-domain-driven-architecture-data-mesh-best-practices/)
- JPMorgan Chase (Anu Jain, Graham Person, Paul Conroy) with Nivas Shankar (AWS), "How JPMorgan Chase built a data mesh architecture…", AWS Big Data Blog, 5 May 2021 (page notes it was last reviewed April 2024 by AWS). FULL-TEXT. Vendor-hosted and co-written with the vendor.
  - Data products are "curated by people who understand the data". Each product has its own lake, "managed by a team of data product owners".
  - Before the mesh, "data product owners couldn't easily see when their data was flowing between systems". A mesh catalog gives "visibility of which lakes are sharing data with which data consumers", so owners "know where their data is being used".
  - Consumers find and request data through an enterprise catalog. Data is shared in place, not copied, so owners' decisions (such as tokenization) bind consumers.
  - Limits: an architecture description with no outcomes or incident data, and nothing on change notification.
  — [AWS](https://aws.amazon.com/blogs/big-data/how-jpmorgan-chase-built-a-data-mesh-architecture-to-drive-significant-value-to-enhance-their-enterprise-data-platform/)
- Nubank (Ariane Hoffenberg, Head of Analytics Engineering; João Pedro, Senior Analytics Engineer), "Scaling data analytics with software engineering best practices", Building Nubank, 15 Jul 2021. FULL-TEXT.
  - Each dataset declares structured metadata including "the dataset owner", data-protection clearances and quality layer.
  - "To publish a new table or make changes to an existing one, all the integration tests must pass", which check that inputs (tables and columns) exist.
  - Peer review is rotated, and they "usually are able to review every pull request within one day".
  - Tables are classed (core, critical, model inputs) with "different expectations regarding how fast an issue should be solved and who should validate the changes".
  - Alerts go "directly… on Slack to the responsible people".
  - "Even though we have data owners for all our data objects", anyone may change a dataset behind these guardrails.
  - Scale: "from 0 to 800 data platform contributors in 8 years".
  — [Building Nubank](https://building.nubank.com/scaling-data-analytics-with-software-engineering-best-practices/)
- Monzo, "Spinning up an Analytics Engineering Team", 9 Aug 2021. FULL-TEXT.
  - Aim: "a data culture such that every engineer owns the data they're producing". The data function grew from 20 to over 80 people, with more than 4,000 dbt models.
  - Under the heading "Shared ownership is not so shared anymore", the post says changes became hard to reason about at scale. Response: a small central analytics-engineering team to "Take ownership of data that is crucial and common to many projects".
  — [Monzo](https://monzo.com/blog/2021/08/10/spinning-up-an-analytics-engineering-team)
- Monzo, "A 'meshy' approach to Data", 22 April 2026. FULL-TEXT.
  - Scale: "over 100 independent, empowered teams" contribute to "12,000+ dbt models", and "The health of data is owned across all these teams."
  - Problem: "A schema change here broke downstream models there."
  - Answer: "Rather than reverting to central ownership", they introduced layers, interfaces, Modelgen and CI rules. Every model needs "an explicit owner team" and freshness tests, enforced as "checks that run in CI on every pull request".
  - Exceptions "are explicitly declared and justified". Principle: "Automate, don't gatekeep".
  — [Monzo](https://monzo.com/blog/a-meshy-approach-to-data); secondary coverage [InfoQ, 17 May 2026](https://www.infoq.com/news/2026/05/monzo-data-mesh/)
- ING: only a Thoughtworks client page (a proof of concept with synthetic data) and a job posting appeared (SNIPPET). There is no first-person ING account of ownership. — [Thoughtworks](https://www.thoughtworks.com/clients/financial-services-insurance/ing-bank)
- Netflix "Data Mesh" platform post (2022): blocked (403). Note that Netflix's "Data Mesh" is a data-movement platform name, not necessarily Dehghani's organizational model. — [Netflix Tech Blog](https://netflixtechblog.com/data-mesh-a-data-movement-and-processing-platform-netflix-1288bcab2873)
- Zalando: only conference slides and podcasts by Max Schultze, 2020 (SNIPPET). Search summaries say ownership was handed to the business units that create the data, while the infrastructure stayed central ("decentralized ownership does not imply decentralized infrastructure"). — [Slides](https://www.slideshare.net/slideshow/data-mesh-in-practice-how-europes-leading-online-platform-for-fashion-goes-beyond-the-data-lake-236728093/236728093)
- LinkedIn Super Tables (David Lu et al.), 28 Sep 2022. FULL-TEXT. Super Tables are framed as data-as-a-product with "formal ownership and commitments". The entity is "owned/governed by a domain (possibly a virtual team) – a key concept in Data Mesh". The governance details are in section 3. — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2022/super-tables--the-road-to-building-reliable-and-discoverable-dat)

Critiques and failure reports:

- Thoughtworks, "The state of data mesh in 2026: from hype to hard-won maturity", 16 Jan 2026. FULL-TEXT. Consultancy, and Dehghani's former employer, so it is an insider critique rather than a neutral one. Points:
  - "Data mesh is an organizational transformation, not merely a technical one."
  - The domain ownership anti-pattern: "an IT department re-badges its old teams as 'domains' (e.g., the 'SAP domain,' the 'Salesforce domain') without any genuine business ownership".
  - Organizations spending "a year in 'analysis paralysis'" on domain boundaries.
  - Project managers "rebrand[ed]" into data product owners without training.
  - Data teams are held back by "project-based, short-term budget cycles".
  - What works: a central office moving from gatekeeper to a centre of excellence that "doesn't own the data; it owns the practice of data".
  — [Thoughtworks](https://www.thoughtworks.com/en-ca/insights/blog/data-strategy/the-state-of-data-mesh-in-2026-from-hype-to-hard-won-maturity)
- Starburst, "Data Mesh: What Happened?", 23 Dec 2025. FULL-TEXT. A vendor that sells query federation, which its conclusions favour.
  - It cites Gartner's 2022 Hype Cycle placing data mesh as "obsolete before plateau". This is second-hand; I did not read Gartner.
  - "Ownership boundaries get messy fast… an ongoing negotiation".
  - "The talent gap is structural, not temporary". Quality standards diverge without enforcement.
  - Big-bang reorganizations "often found themselves with neither the benefits of decentralization nor the clarity of centralized control".
  — [Starburst](https://www.starburst.io/blog/data-mesh-what-happened/)

### Inferences

- In practice, "domain ownership" in these accounts means owner metadata that cannot be omitted, plus CI rules and a central platform (Nubank, Monzo, Saxo, JPMorgan). It is not full domain autonomy. Monzo's 2021 central team and its 2026 "rather than reverting to central ownership" show the pendulum explicitly.
- The data product owner in Dehghani's text is the closest analogue to the article's flag owner. That person decides "when to change, revise and retire" a dataset, and that retirement duty is the data version of removing a flag.
- Failure reports are consultancy and vendor observations without counts. There is no peer-reviewed or survey-based estimate of how many mesh programmes stalled.

### Gaps

- I found no first-person account of a failed or reversed data mesh adoption at a named company.
- ING, Nubank 2023 and later, Zalando and Netflix organizational accounts were unavailable or unread.
- None of the bank accounts describes what happens to consumers when a domain owner changes or retires a product.

## 3. Producer-consumer coordination for a breaking change: registration, impact analysis, notice, migration support and cost

### Takeaway

Published processes exist, but they are thin on durations. LinkedIn's 2021 warehouse migration used lineage and usage data to pick deprecation candidates, emailed users, and archived after an unstated "grace period". LinkedIn Super Tables (2022) created a governance body of upstream and downstream teams, a "committed change velocity (e.g., monthly deployment of changes)", and a migration guide. Uber (2021) made schema-change reviewers mandatory, let consumers register themselves as reviewers, and made ownership mandatory. Meta built lineage because hand-drawn data-flow diagrams did not scale. No source states a standard notice period for a breaking data change, and none says who pays for running both versions.

### Cited Findings

- LinkedIn (Steven Chuang, Qinyu Yue, Aravind Rao, Srihari Duddukuru), "Evolving LinkedIn's analytics tech stack", 7 Dec 2021. FULL-TEXT.
  - Scale: "1400+ datasets, 900+ data flows, and 2100+ users". An earlier attempt left both warehouses running, with "double the maintenance cost and complexity, along with very confused consumers".
  - Impact analysis: they built a data product for upstream and downstream dependencies plus usage pipelines. Teradata lineage required scraping logs, while Hadoop and Trino were instrumented to emit lineage events to Kafka. Cataloguing let them consolidate "1424 datasets down to 450" (about 70% less migration work).
  - Deprecation: a service "identified candidates for deprecation, i.e., TD datasets with no dependency and low usage". It "sent emails to dataset users about the upcoming deprecation and notified SREs to lock, archive, and delete the dataset from TD after a grace period". The grace period length is not stated.
  - The post thanks "the downstream consumers of the data that worked with us and held us accountable".
  — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2021/evolving-linkedin-s-analytics-tech-stack)
- LinkedIn (David Lu, Hong Liu, Thomas Kwan, Christopher Harris, Weiping Si), "Super Tables", 28 Sep 2022. FULL-TEXT.
  - Problem: "Changes to the datasets or their sources are usually made without consulting with or even notifying all downstream consumers, occasionally resulting in breaking changes being deployed."
  - Remedy: "well-defined governance policies for change management and communication and committed change velocity (e.g., monthly deployment of changes)", with "Upstream data producers and downstream consumers… both involved".
  - The governance body reviews requests such as adding a field. Upstream sources must agree SLAs, and "Any changes will be notified".
  - Availability target: "99+%", which for a daily table is "approximately one SLA miss per quarter".
  - JOBS Super Table: 57+ sources and 158 columns, replacing "a dozen tables and views", which "will be deprecated and migrated".
  - Lesson: "it is imperative to provide awareness and support to the downstream users who need to perform the migrations", via a migration guide. Another lesson is to identify semantic-logic "owners". Stricter SLAs need "ironclad alerting and escalation".
  — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2022/super-tables--the-road-to-building-reliable-and-discoverable-dat)
- Uber (Suresh Srinivas, Krishna Puttaswamy), "Uber's Journey Toward Better Data Culture From First Principles", 16 Mar 2021. TOOL-EXTRACT (curl got 406; the fetch tool worked). Paraphrase, with wording to re-check:
  - Every data artifact must have a clear owner. Ownership was made mandatory where it cannot be inferred, which "eliminated new unowned data". Heuristics assigned owners to abandoned datasets, aiming at 100% ownership coverage.
  - Datasets are tiered (tier-1 or tier-2 if they affect compliance, revenue or brand; ad hoc datasets default to tier-5). Tier sets the incident level and bug-fix SLA.
  - Every dataset must have freshness and completeness checks with a default SLA. Freshness is defined as the delay until data is 99.9% complete. "The owner is responsible for upholding those SLAs."
  - Schema changes have mandatory reviewers. For mobile analytics events, producers and consumers can add themselves as reviewers, which is a consumer-registration mechanism.
  - Artifacts should be deprecated when their use ends, with lifecycle enforcement. The programme modified over 20 systems.
  - Overlap: `end_to_end_cases_and_failures.md` already cites this post for schema-change confidence. This entry adds the ownership, tiering and SLA detail.
  — [Uber](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)
- Uber (Luyao Li, Kaan Onuk, Lauren Tindal), "Databook: Turning Big Data into Knowledge with Metadata at Uber", 3 Aug 2018. TOOL-EXTRACT. Databook shows table freshness, SLAs and owners. Ownership applies to the same table across clusters. Users search by owner. Producers and consumers both add semantic metadata. The post does not say how owners are assigned or verified. — [Uber](https://www.uber.com/blog/databook/)
- Meta, "How Meta discovers data flows via lineage at scale", Engineering at Meta, 22 Jan 2025. FULL-TEXT.
  - Hand-made lineage "via code inspection using manually authored data flow diagrams and spreadsheets" "does not scale" across "billions of lines of continuously evolving code".
  - The new system combines static analysis, runtime instrumentation and input/output matching.
  - Lessons: they first neglected consumption tools, so "owners had to use raw lineage signals", which was "overwhelmingly complex". Asking every system to emit lineage made "progress… slow"; shared libraries with built-in lineage worked better.
  - Purpose: placing privacy controls, not schema changes, but the consumer-discovery problem is the same.
  — [Engineering at Meta](https://engineering.fb.com/2025/01/22/security/how-meta-discovers-data-flows-via-lineage-at-scale/)
- JPMorgan (2021, above): the mesh catalog lets owners see "which lakes are sharing data with which data consumers", so registration is implicit in the access grant. — [AWS](https://aws.amazon.com/blogs/big-data/how-jpmorgan-chase-built-a-data-mesh-architecture-to-drive-significant-value-to-enhance-their-enterprise-data-platform/)
- Spotify (Anastasia Khlebnikova, Carol Cunha), "Data Platform Explained Part II", 28 May 2024. TOOL-EXTRACT.
  - Pipelines produce "endpoints" with retention policies, access controls, lineage tracking and quality checks.
  - Resource definitions live in the pipeline repo and are maintained by the codeowners.
  - Monitoring includes alerts for data lateness, failing workflows and endpoints.
  - The fetch tool reported no mention of SLOs, so the prompt's "data endpoints with owners and SLOs" is only half-confirmed (owners and alerts yes, SLOs not found).
  — [Spotify Engineering](https://engineering.atspotify.com/2024/05/data-platform-explained-part-ii)
- Saxo (2021): deprecation markers in the schema signal "future plans for breaking changes". Schemas changed "in small increments are quickly approved". — [Confluent](https://www.confluent.io/blog/distributed-domain-driven-architecture-data-mesh-best-practices/)
- Airbnb Midas certification and Data Quality Score posts (Medium): blocked, not read. Minerva is covered in `analytical_pipeline_changes.md`. Google Goods (SIGMOD 2016) is covered there too.
- Numbers on how many consumers a table has: the only concrete figures found are LinkedIn's (2,100+ users across 1,400+ datasets in the migrated warehouse; JOBS drawing on 57+ sources). Uber's 2021 data-quality platform covered "over 2,000 critical datasets" (section 4). No source gives a typical consumer count per table.

### Inferences

- The documented coordination pattern is to find consumers from lineage and usage logs, notify them directly (email or reviewer tags), offer a migration guide or a new consolidated table, wait for an unstated period, then lock, archive and delete. This matches the expand-contract shape in the existing notes. What is added here is who does each step: the producer or platform team runs the notification, and consumers are pulled in as reviewers.
- LinkedIn's "committed change velocity (e.g., monthly deployment of changes)" for Super Tables is a deliberate release train for a shared data product. That is a direct counterpoint for the article. For widely shared tables, at least one large company chose a slow, scheduled change cadence over continuous change.
- "Consumer registration" appears in three forms: explicit opt-in as a reviewer (Uber mobile events), implicit through access grants (JPMorgan mesh catalog, Monzo interfaces), and inferred through lineage and query logs (LinkedIn, Meta). Undeclared consumers (Sculley) are the residual that only lineage can find.

### Gaps

- No published standard notice or deprecation window for breaking data changes was found in this run. LinkedIn says "grace period" without a number. Windows from other domains (GitLab releases, dbt deprecation_date, DoorDash's 30 days of zero usage) are in other notes files.
- No source says who pays for running both versions, or for consumer migration effort.
- Airbnb (Midas, DQ Score), Netflix (lineage, data mesh), Google Goods ownership details and LinkedIn Dali deprecation were not readable or not re-read in this run.

## 4. Observability and on-call for data: data quality monitoring, "data downtime", SLOs and who is alerted

### Takeaway

Large platforms describe dataset SLAs (freshness, completeness) tied to tiers and owners, with alerts routed to table owners or subscribing consumers. Uber reported tests on over 2,000 critical datasets that caught about 90% of data-quality incidents. LinkedIn reported 150k critical datasets monitored and an alert latency of about 30 minutes. True paging (wake-up) for data is rarely described. The first-person rotations found are working-hours "data responder" rotas or analytics-engineer on-call with OpsGenie. Their pain points are unclear ownership of the upstream source and missing lineage for impact. "Data downtime" is a vendor (Monte Carlo) term, and the incident statistics behind it come from vendor-commissioned surveys.

### Cited Findings

- Uber (Ying Zou, Wei Yan, Maggie Ying), "How Uber Achieves Operational Excellence in the Data Quality Experience", 5 Aug 2021. TOOL-EXTRACT. Paraphrase, with wording to re-check:
  - The platform supports over 2,000 critical datasets and detects about 90% of data-quality incidents. It runs about 100,000 daily executions of about 18,000 tests.
  - Alerts are per dataset per test category, and parameters such as table owners and alert emails come from the metadata service.
  - Freshness alerts suppress dependent completeness alerts to avoid duplicate notifications.
  - A "sustain period" (4-hour example) and backoff reruns reduce transient alerts. Grace periods before enabling alerts let owners fix known issues.
  - Users can notify all potentially impacted downstream tables through lineage. Producers can acknowledge incidents that consumers report and annotate the ETA, root cause and backfill status.
  - Tiers 0-5 set default SLAs, with a goal of 100% alert coverage for top-tier datasets.
  - The fetch tool reported that the post does not describe paging and gives no time-to-detect figure. The 90% has no stated denominator method.
  — [Uber](https://www.uber.com/blog/operational-excellence-data-quality/)
- LinkedIn (Liangzhao Zeng, Ting Yu (Cliff) Leung, Jimmy Hong, Kevin Lau), "Towards data quality management at LinkedIn", 9 Jun 2022. FULL-TEXT.
  - Data Health Monitor has been generally available since August 2021. It collects "1B data health vital signs for about 150k critical datasets" daily.
  - Consumers create subscriptions, which reached "more than 2,000 in several months". Alert SLA (detection to email) is "roughly 30 minutes".
  - Problems named: "email alert fatigue". Consumers receive alerts "technically valid but not relevant". Per-consumer expectations differ, as when a pipeline that starts at 2 p.m. does not care about an 8 a.m. SLA miss.
  - Alerts are email to subscribers, not pages.
  — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2022/towards-data-quality-management-at-linkedin)
- LinkedIn Super Tables, 2022 (FULL-TEXT): the 99+% availability target, and "the stricter the SLA… ironclad alerting and escalation, and runtime data quality checks". — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2022/super-tables--the-road-to-building-reliable-and-discoverable-dat)
- Nubank, 2021 (FULL-TEXT): alerts go on Slack "to the responsible people triggered by some criticality rules". Classification sets how fast an issue must be solved. — [Building Nubank](https://building.nubank.com/scaling-data-analytics-with-software-engineering-best-practices/)
- Monzo, 2026 (FULL-TEXT): every model must have freshness tests ("alerts when data stops arriving on time") and an owner team. The post does not describe who is paged. — [Monzo](https://monzo.com/blog/a-meshy-approach-to-data)
- Spotify, 2024 (TOOL-EXTRACT): alerts on lateness, failing workflows and endpoints. — [Spotify Engineering](https://engineering.atspotify.com/2024/05/data-platform-explained-part-ii)
- Navo Das (incident.io Data team), "How our data team handles incidents", incident.io blog, datePublished 2024-07-26. FULL-TEXT. Written by a vendor about its own data team, using its own product.
  - Each week, one person is the "Data Responder", with a schedule set to "working hours only".
  - The hourly dbt run sends alerts on model failures or test errors.
  - Routing rule: errors with customer-facing impact (in-app analytics built on the same dbt job) go "to the team of on-call engineers (e.g. if the failure occurs overnight)". Internal errors go to the data team during working hours.
  - They "intentionally lowered the barrier to declaring incidents" because "false negatives are much more problematic than false positives".
  - Postmortems are for bigger incidents, such as data privacy. Periodic meta-reviews check for repeat offenders.
  — [incident.io](https://incident.io/blog/how-our-data-team-handles-incidents)
- Robert Sahlin, "The Madness of Data Incident Management", Substack, 4 Oct 2024. FULL-TEXT. A first-person practitioner opinion; the author writes as an analytics engineer and manager.
  - On-call analytics engineers are alerted through OpsGenie. The likely root cause may be "a schema change upstream".
  - Pain points: "lack of data lineage" to find affected dashboards and consumers, and "figuring out ownership… Who owns the upstream source… Are they aware?"
  - A reader comment, also first person and unverified, says building searchable runbooks took "6 months to 1 year".
  — [Substack](https://robertsahlin.substack.com/p/the-madness-of-data-incident-management)
- Google, "Rules of Machine Learning" (Martin Zinkevich), Rule #10, "Watch for silent failures". FULL-TEXT. A joined table that stops updating degrades a model gradually. "Sometimes you find tables that are months out of date, and a simple refresh improves performance more than any other launch that quarter!" — [Google Developers](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Vendor term and survey: "data downtime" is Monte Carlo's term. Monte Carlo, "Data quality survey" page (Wakefield Research, commissioned by Monte Carlo, 200 data professionals, March 2023). FULL-TEXT of Monte Carlo's write-up. It is a vendor survey: self-reported, and the vendor sells observability.
  - Monthly data incidents rose "from 59 in 2022 to 67 in 2023".
  - "68% of respondents reported an average time of detection… of four hours or more", up from 62%.
  - Time to resolution averaged 15 hours per incident, a claimed 166% increase.
  - Respondents reported an average of 31% of revenue "impacted" by data quality issues, up from 26%.
  - Conflict: press coverage of the 2022 edition reported 61 incidents a month, not 59 (SNIPPET).
  — [Monte Carlo](https://www.montecarlodata.com/blog-data-quality-survey/); 2022 coverage [VentureBeat](https://venturebeat.com/enterprise-analytics/report-data-engineers-spend-2-days-per-week-firefighting-bad-data-quality) (SNIPPET)

### Inferences

- In the large-company accounts, alerts for bad data go to the table owner (Uber, Nubank), to subscribing consumers (LinkedIn), or to a rota on the data team (incident.io, Sahlin). Pages that wake people are reserved for data behind customer-facing features (incident.io routes those to the product on-call). This is closer to "you operate what you deploy" than to a central data on-call. It works only where ownership metadata is mandatory.
- The dataset SLO practice is concrete: freshness (time to 99.9% complete at Uber), completeness (row ratio to source), tier-based defaults, and availability targets (99+% at LinkedIn Super Tables). Dehghani's 2019 call for owner-defined SLOs is visibly implemented at Uber and LinkedIn by 2021-2022.
- Alert fatigue is the recurring failure, named by LinkedIn and, in other notes, by Google's data validation paper. Several published designs (Uber's sustain periods and alert dependencies, LinkedIn's de-duplication and subscriptions) exist mainly to reduce noise.

### Gaps

- I found no first-person description of a data on-call rotation at Airbnb, Netflix, Spotify or Monzo (pages blocked or silent on paging).
- I found no published blameless postmortem of a specific data incident from a large tech firm in this run.
- No independent, non-vendor survey of data incident rates was found. The Monte Carlo and Wakefield figures are the most cited, and they are vendor-commissioned.

## 5. ML-specific ownership: feature owners and model owners, shared features, undeclared consumers and data cascades

### Takeaway

The ML literature names the organizational hazard precisely. Sculley et al. (2015) locate unstable data dependencies where "the engineering ownership of the input signal is separate from the engineering ownership of the model that consumes it". They describe undeclared consumers as invisible coupling that makes "any changes… at all" costly. Google's Rules of ML asks for feature columns to have owners and for unused features to be removed. Industry feature stores record an owner per shared feature (Uber 2017: "owner, description, SLA"), but no first-person account says who may change a feature that many models use. Sambasivan et al. (CHI 2021) explain why the work is neglected: data work is "not easily 'tracked' or rewarded, as opposed to models".

### Cited Findings

- D. Sculley et al. (Google), "Hidden Technical Debt in Machine Learning Systems", NeurIPS 2015. FULL-TEXT (PDF).
  - Undeclared consumers (section 2): "Without access controls, some of these consumers may be undeclared, silently using the output of a given model as an input to another system." The resulting coupling "can radically increase the cost and difficulty of making any changes to ma at all, even if they are improvements". They "may be difficult to detect unless the system is specifically designed to guard against this case, for example with access restrictions or strict service-level agreements (SLAs)". And "engineers will naturally use the most convenient signal at hand, especially when working against deadline pressures."
  - Unstable data dependencies (section 3): this can happen "when the engineering ownership of the input signal is separate from the engineering ownership of the model that consumes it", in which case "updates to the input signal may be made at any time". Even "'improvements' to input signals may have arbitrary detrimental effects". Example: correcting a miscalibrated signal that the model had fitted to.
  - Static analysis of data dependencies is described as "essential for error checking, tracking down consumers, and enforcing migration and updates".
  - The versioned-copy mitigation and its cost are already quoted in `feature_stores_and_versions.md`.
  — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Martin Zinkevich (Google), "Rules of Machine Learning", Google Developers (living document). FULL-TEXT.
  - "Rule #11: Give feature columns owners and documentation." "If you find that the person who understands a feature column is leaving, make sure that someone has the information."
  - "Rule #22: Clean up features you are no longer using." "Unused features create technical debt."
  — [Google Developers](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Uber (Jeremy Hermann, Mike Del Balso), "Meet Michelangelo: Uber's Machine Learning Platform", 5 Sep 2017. TOOL-EXTRACT. The shared feature store lets teams "create and manage canonical features" and share them across organizations. Adding a feature requires "a small amount of extra metadata (owner, description, SLA, etc.)". About 10,000 features existed. The fetch tool reported that the post does not say who may change a shared feature. Feature retirement at Uber ("No Model references") is in `feature_stores_and_versions.md`. — [Uber](https://www.uber.com/blog/michelangelo-machine-learning-platform/)
- Nubank, 2021 (FULL-TEXT): "model inputs" are a dataset class with stricter expectations about who validates changes. This is the only first-person rule found that raises change-approval requirements because a model consumes a table. — [Building Nubank](https://building.nubank.com/scaling-data-analytics-with-software-engineering-best-practices/)
- Monzo, 2026 (FULL-TEXT): ML features sit in the "Presentation" layer, as consumer-shaped leaf models that cannot be declared as interfaces. Models therefore depend on interfaces upstream rather than on each other's feature tables. — [Monzo](https://monzo.com/blog/a-meshy-approach-to-data)
- Nithya Sambasivan, Shivani Kapania, Hannah Highfill, Diana Akrong, Praveen Paritosh, Lora Aroyo (Google Research), "'Everyone wants to do the model work, not the data work': Data Cascades in High-Stakes AI", CHI 2021 (Yokohama). FULL-TEXT (PDF from Google Research).
  - Method: interviews with 53 practitioners in India, East and West Africa and the US, May to July 2020. "92% experienced at least one cascade."
  - Definition: data cascades are "compounding events causing negative, downstream effects from data issues, that result in technical debt over time".
  - Incentives: data is "the least incentivized aspect, viewed as 'operational' relative to the" model work. "Care of, and improvements to data are not easily 'tracked' or rewarded, as opposed to models." Models were "the means for prestige and upward mobility". The title quote comes from participant P4 (healthcare, India).
  - Cascades are "Opaque… with no clear indicators, tools, and metrics". Practitioners fell back on proxy metrics measured at the system level.
  - "Conflicting reward systems" is one cascade type (32.1% in the paper's breakdown), from "Misaligned incentives and priorities between practitioners, domain experts, and field partners".
  - Limits: the sample is high-stakes domains (health, conservation, lending, and so on), often with small teams and field data collection. It does not study schema changes in a warehouse or feature stores at a tech firm.
  — [PDF](https://storage.googleapis.com/gweb-research2023-media/pubtools/5936.pdf); [Google Research blog, 4 Jun 2021](https://research.google/blog/data-cascades-in-machine-learning/)
- LinkedIn Feathr and Airbnb Zipline and Chronon feature ownership: no first-person statement on who may change a shared feature was found here. The versioning mechanics are in `feature_stores_and_versions.md`. Feast documents a "federated" registry with team ownership boundaries (vendor and project documentation, SNIPPET). — [Feast docs](https://docs.feast.dev/how-to-guides/feast-snowflake-gcp-aws/federated-feature-store)

### Inferences

- The feature-owner versus model-owner split is the ML form of producer versus consumer. The literature's remedies (access control and SLAs to surface undeclared consumers, versioned copies, owner metadata, static dependency analysis) are the same remedies the data-contract movement adopted later. Sculley et al. 2015 predates "data contracts" by six years and already names SLAs as the barrier.
- Because "improvements" to a feature can harm a model fitted to the old values, a shared feature's owner cannot judge a change safe from the feature alone. The consuming model owners have to be in the approval loop. That argues for model-owner reviewers on feature changes, as with Uber's consumer reviewers on schema changes. No source documents this for features specifically.
- Data cascades give the cultural reason the article should name: careers reward the model, not the table, so ownership duties for shared data go unfunded unless they are made explicit.

### Gaps

- No first-person policy from Uber, Airbnb, LinkedIn, Spotify or Meta says who may change a feature used by many models, or how its consumer models are told.
- No numbers on how many models share a typical feature.

## 6. Evidence of effect: measured outcomes of contracts, ownership and data SLOs

### Takeaway

Measured outcomes are scarce and mostly operational rather than causal. The figures found are Adevinta's cut in time-to-data from about 5 days to about 30 minutes; Monzo's early "~40% cost reduction and ~25% faster landing times in some domains", 30% into a migration; Uber's about 90% of data-quality incidents detected by its test platform; LinkedIn's about 30-minute alert SLA and 2,000+ subscriptions; LinkedIn's consolidation from 1,424 to 450 datasets; and GoCardless's adoption counts. No source measures fewer breaking-change incidents after contracts or ownership, with a baseline. Industry incident statistics come from vendor-commissioned surveys.

### Cited Findings

- Adevinta Spain, 2024 (FULL-TEXT): Time to Effective Data went from about 5 days to about 30 minutes after contract-driven automation. This measures delivery speed, not quality. — [Adevinta](https://adevinta.com/techblog/creating-source-aligned-data-products-in-adevinta-spain/)
- Monzo, 2026 (FULL-TEXT): "about 30% through a company-wide migration"; "~40% cost reduction and ~25% faster landing times in some domains - but it's early days still". These are cost and latency, not incidents, and the authors themselves call them early. — [Monzo](https://monzo.com/blog/a-meshy-approach-to-data)
- Uber, 2021 (TOOL-EXTRACT): about 90% of data-quality incidents detected across 2,000+ critical datasets. The method of counting undetected incidents is not given. — [Uber](https://www.uber.com/blog/operational-excellence-data-quality/)
- LinkedIn, 2022 (FULL-TEXT): 150k critical datasets monitored, 2,000+ subscriptions within months, and an alert latency of about 30 minutes. These are adoption and latency figures, not incident reduction. — [LinkedIn](https://engineering.linkedin.com/blog/2022/towards-data-quality-management-at-linkedin)
- LinkedIn, 2021 (FULL-TEXT): lineage and usage cataloguing cut migration scope from 1,424 to 450 datasets (about 70%). — [LinkedIn](https://engineering.linkedin.com/blog/2021/evolving-linkedin-s-analytics-tech-stack)
- GoCardless, 2022 (FULL-TEXT, vendor-hosted): about 30 contracts and about 60% of async events at six months. Quality improvement is claimed only qualitatively. — [Monte Carlo blog](https://www.montecarlodata.com/blog-data-contracts/)
- Uber, 2021 culture post (TOOL-EXTRACT): making ownership mandatory "eliminated new unowned data". No incident figures. — [Uber](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)
- Vendor survey (Monte Carlo and Wakefield, 2023, FULL-TEXT of the vendor page): 67 incidents a month, 68% take four hours or more to detect, 15 hours average resolution. Self-reported by 200 respondents; the vendor sells monitoring; and a 2022 figure conflicts across sources (59 versus 61). — [Monte Carlo](https://www.montecarlodata.com/blog-data-quality-survey/)
- Unsourced ROI claims seen in search (for example a "70% reduction in data incidents" from contracts) appear on blogs with no underlying data. They are excluded as unreliable (SNIPPET).

### Inferences

- The evidence supports a modest claim. Making ownership mandatory and wiring SLAs and tests into CI is feasible at large scale (Uber, LinkedIn, Monzo, Nubank), and improves speed or cost in the cases measured. The evidence does not support a claim that contracts cut incidents by any stated amount.
- This parallels the article's software evidence, where DORA-style correlations exist. For data there are no comparable independent studies; the nearest are vendor surveys.

### Gaps

- No peer-reviewed or independent study measures the effect of data contracts or domain ownership on incident rates.
- No company publishes a count of breaking changes blocked by contract CI checks.

## 7. Financial services: regulatory expectations on data ownership, and bank accounts

### Takeaway

Regulators require named data ownership in banking. BCBS 239 (January 2013, G-SIB compliance expected by January 2016) requires roles for "ownership and quality of risk data" across business and IT. The ECB's May 2024 guide lists, as minimum elements, "Data owners responsible for key risk indicators and critical data elements" who agree quality controls "in alignment with data users (or consumers)", plus attribute-level lineage and a register of data-quality issues with deadlines for remediation. The bank accounts found (Saxo, JPMorgan, Nubank, Monzo) present ownership as both an engineering choice and a governance duty. None explicitly links its contracts to BCBS 239. Cross-reference only: another researcher is covering EU regulators in depth.

### Cited Findings

- Basel Committee on Banking Supervision, "Principles for effective risk data aggregation and risk reporting" (BCBS 239), January 2013. FULL-TEXT (PDF).
  - Paragraph 34: "Roles and responsibilities should be established as they relate to the ownership and quality of risk data and information for both the business and IT functions." The owners, with risk managers, should ensure "adequate controls throughout the lifecycle of the data". The business owner ensures data is correctly entered, kept current and "aligned with the data definitions".
  - Paragraph 33 requires integrated data taxonomies and metadata.
  - Paragraph 26: the board should oversee "senior management's ownership of implementing all the risk data aggregation and risk reporting principles".
  - The deadline for G-SIBs was the beginning of 2016.
  — [BIS PDF](https://www.bis.org/publications/201301-guidelines-principles-effective-risk-data-aggregation-and-risk-reporting.pdf)
- ECB Banking Supervision, "Guide on effective risk data aggregation and risk reporting", May 2024. FULL-TEXT (PDF). Section 3.3 lists minimum elements:
  - "Data owners responsible for key risk indicators and critical data elements throughout the complete aggregation process (front to end)", who contribute "in alignment with data users (or consumers)" to defining quality controls, ensure accuracy, completeness and timeliness, and manage lineage and dictionary metadata.
  - A central data governance function that participates in change management for changes with material RDARR impact, including "upgrades of existing tools and other IT change initiatives".
  - An independent validation function in the second line of defence.
  - Elsewhere the guide calls for "uniform data definitions and glossaries with clear ownership of data" and "complete and up-to-date data lineages on data attribute level".
  - It also requires a "register" of data-quality issues with severity, root cause, quantitative impact, escalation responsibilities, "deadlines for remediation" and "appropriate evidence".
  — [ECB PDF](https://www.bankingsupervision.europa.eu/ecb/pub/pdf/ssm.supervisory_guides240503_riskreporting.en.pdf)
- Bank and payments first-person accounts, detailed in sections 1-2:
  - Saxo (2021): a Data Governance Office "activates" domains and identifies owners.
  - JPMorgan (2021, AWS-hosted): data product owners, with a catalog showing who consumes.
  - Nubank (2021): owners for all data objects, and model inputs are a stricter class.
  - Monzo (2021, 2025, 2026): mandatory owner team in CI, and interfaces as contracts. Monzo notes that its models feed "regulatory submissions".
  - PayPal (2023): contract template used in its data mesh.
  - GoCardless (2021-2022): contracts.
  - Regulatory linkage stated in these accounts: Saxo cites PII classification and encryption; VMO2 (telecom, not a bank) cites GDPR and PCI in contracts. None names BCBS 239 or RDARR as a driver.

### Inferences

- The ECB's 2024 wording closely matches contract practice. It asks for a named owner per critical data element, quality controls agreed with consumers, lineage, change management with a central function involved, and an evidence-backed issue register. A bank could present contracts, CI owner checks and lineage as RDARR evidence. That fits the article's theme of approval moving to recorded evidence. This mapping is my inference; no bank account I read makes it.
- The regulator also expects a central governance function in change management. So in banks, pure domain autonomy (as in a strict reading of data mesh) is constrained; the federated pattern (Saxo, VMO2 hub-and-spoke, Monzo) is the one that fits.

### Gaps

- I found no first-person bank account that ties data contracts or domain ownership to BCBS 239 or ECB RDARR findings.
- Supervisory findings on RDARR (for example ECB thematic reviews) are left to the EU-regulator researcher.
- ING, JPMorgan after 2021, and other banks' (Saxo after 2021) follow-ups were not found.
