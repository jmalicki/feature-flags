# Changing the schema of a live operational database while two versions of the data model coexist (2006-2025)

Source labels used throughout. FULL-TEXT: I fetched the raw page with curl and read the cited passages in the page text (I searched each page for the relevant passages; I did not read every line of every page). SNIPPET: seen only in a search-result summary; wording not verified. TOC-ONLY: only the table of contents was retrievable. Quotations are exact, under 25 words, and appear only for FULL-TEXT sources. "Vendor" marks documentation or blog posts from a company selling the tool described. Fetch date for all pages: 2026-11-11.

Sources I tried and could not retrieve (so nothing below relies on them): Etsy "Schemanator" post (403 / archive rate-limited), Facebook's 2010 OSC note, Salesforce multitenant architecture paper (403), Airbnb "Building Services at Airbnb, Part 3" and payments posts (Medium 403), Pinterest "Sharding Pinterest" (Medium 403), PayPal/Braintree Postgres post (Medium 403), Benchling migrations post (403), Greg Young's book body text (Leanpub page is script-rendered; only the table of contents came through), datomic.com best-practices page (404). I did not research Box, Basecamp, Gusto, Zalando, Wise, Monzo, Twitter Manhattan, Uber Docstore, LinkedIn Espresso schema evolution internals, or Square "Books".

## 1. The expand/contract (parallel change) pattern: steps, what keeps the two versions in sync, and how long the transition lasts

### Takeaway

The canonical recipe has not changed since 2006: add the new structure beside the old one, keep both populated (by trigger, by application dual-write, or by replaying a change log), move readers, then remove the old structure. The originators say plainly that the middle phase lasts from months to years when several applications share the database, and that it adds complexity that must be scheduled for removal.

### Cited Findings

**Scott Ambler and Pramod Sadalage, "Refactoring Databases: The Process" (excerpt of Chapter 3 of *Refactoring Databases*, Addison-Wesley, March 2006; excerpt published by Red Gate Simple Talk 9 January 2007). FULL-TEXT.** Locator: paragraphs around Figures 3.3-3.5 ("transition period").

- Defines the transition period (also called the deprecation period): when several applications use the database and cannot all be redeployed at once, the original and new schema are both supported in parallel. — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)
- Duration, in the authors' words: "Typical transition periods last for several quarters, if not years." — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)
- Worked example (Move Column, `Customer.Balance` to `Account.Balance`): the new column is added; the old column is marked for removal "on or after June 14, 2006"; two triggers (`SynchronizeAccountBalance`, `SynchronizeCustomerBalance`) keep the columns equal in both directions. The book calls the triggers "database scaffolding code" and gives them the same removal date as the old column. — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)
- Stated assumption during the period: each application works with one version of the schema, not both; old code will not maintain the new column and new code will not maintain the old one, which is why the trigger is needed. — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)
- Not every refactoring needs a transition period (e.g. Introduce Column Constraint), but narrowing allowed values can break existing applications. — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/)
- Single-application case: Ambler's own site says a team in the simple (single application) situation does not need the transition-period work and can refactor schema and code together and deploy them simultaneously. — [agiledata.org, "The Process of Database Refactoring"](https://agiledata.org/essays/databaserefactoring.html) FULL-TEXT.
- Limits: this is a method book, not an account of a named production system; no data on load, row counts or failures. The excerpt points to Chapter 5 for choosing the period's length; I did not read Chapter 5.

**databaserefactoring.com catalog (Pramod Sadalage; pages last updated 27 July 2016). FULL-TEXT (pages are thin).**

- The public catalog lists the refactorings by category (Structural: Drop Column, Merge Columns, Move Column, Rename Column, Replace Column, Split Column, Split Table, etc.). The Rename Column and Move Column pages contain a one-line definition, a diagram image and a page reference to the book (p.109 and p.103). The step-by-step mechanics are not in the page text. — [Rename Column](https://databaserefactoring.com/RenameColumn.html), [Move Column](https://databaserefactoring.com/MoveColumn.html)
- Limits: the catalog pages cannot be cited for the steps; cite the book excerpt above. `SplitColumn.html` returned 404 at the URL I tried.

**Pramod Sadalage and Martin Fowler, "Evolutionary Database Design" (martinfowler.com; original January 2003, complete rewrite May 2016). FULL-TEXT.** Locator: sections "All database changes are database refactorings" (destructive changes) and "Transition phase".

- Distinguishes non-destructive changes (e.g. Introduce New Column, which old code simply ignores) from "destructive changes" (e.g. Make Column Non Nullable, Split Table, Rename Table) that need more care. — [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)
- Definition: "A transition phase is a period of time when the database supports both the old access pattern and the new ones simultaneously." — [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)
- Rename Table example: `ALTER TABLE customer RENAME to client; CREATE VIEW customer AS SELECT id, first_name, last_name FROM client;` so old applications keep using the old name through a view. The article says views are one technique and that database triggers are used "for things like Rename Column". — [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)
- Cost and duration, stated by the authors: the parallel support "does add complexity", must be removed once downstream systems migrate, and "In some organizations this can be done in a couple of months and in some other organizations it may take years." — [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)
- Limits: no named production case or numbers; the article is about a shared database with many applications, not about feature-flag-controlled reads.

**Danilo Sato, "ParallelChange" (martinfowler.com bliki, 13 May 2014). FULL-TEXT.**

- Names the three phases: expand (support old and new), migrate (move every client), contract (remove old). "Parallel change, also known as expand and contract, is a pattern to implement backward-incompatible changes to an interface in a safe manner". — [ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)
- States that most database refactorings follow this pattern, with the migrate phase being the transition period between the two schemas; that the pattern lets code be released in any of the three phases; and that canary release and blue-green deployment are applications of the same pattern. — [ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)
- States that for external clients the migrate phase is the longest. — [ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)
- Limits: the worked example is a Java class, not a database.

**Three sync mechanisms seen in the primary sources (each cited in detail in later sections):**

- Database triggers: Ambler/Sadalage (above); GitLab `rename_column_concurrently` and bigint conversion helpers; pgroll; LHM; pt-online-schema-change; Facebook OSC. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/), [pgroll README](https://github.com/xataio/pgroll), [Shopify LHM README](https://github.com/Shopify/lhm), [Facebook OSC wiki](https://github.com/facebookincubator/OnlineSchemaChange/wiki/How-OSC-works)
- Application dual writes: Stripe 2017, Slack, Discord, Uber Mezzanine, LinkedIn, strong_migrations' recommended steps. — [Stripe](https://stripe.com/blog/online-migrations), [strong_migrations](https://github.com/ankane/strong_migrations)
- Log replay / change data capture: gh-ost (binary log), Vitess VReplication, Shopify Ghostferry (binlog), Notion (audit-log table plus catch-up script), Stripe DocDB (CDC, bidirectional). — [gh-ost announcement](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/), [Notion](https://www.notion.com/blog/sharding-postgres-at-notion), [Stripe DocDB](https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations)

### Inferences

- The 2006 book assumed the reason for coexistence was many applications sharing one database with separate release schedules. The 2015-2025 accounts apply the same mechanics inside one application because of rolling deploys and gradual ramps: at any moment old and new code versions run together. The mechanics are the same; the transition period shrinks from quarters to hours or weeks when one team owns all readers.
- The books' triggers and the later application-level dual writes are substitutes. Later sections show each has a specific failure mode: triggers add load inside the user's transaction (GitHub), and application dual writes can silently diverge (Notion, LinkedIn).

### Gaps

- I could not read the book's Chapter 5 ("Choose a sufficient transition period") or the per-refactoring mechanics pages (Rename Column p.109, Split Column, Move Column p.103); only the Chapter 3 excerpt is verified.
- No primary source found that measures how long transition periods last in practice across many refactorings.

## 2. First-person accounts of running old and new columns, tables or stores side by side, with gated reads and writes and comparison

### Takeaway

A consistent sequence appears across Stripe, Notion, Slack, Discord, Uber, LinkedIn and smaller companies: dual-write (or replicate), backfill, compare reads in production while still returning the old result, switch reads by flag or percentage, then stop writing the old copy. The accounts give durations (days to backfill, weeks to years overall) but almost never publish mismatch counts, and several teams report that rollback stops being possible, or needs a purpose-built reverse path, once the new store becomes the source of truth.

### Cited Findings

**Stripe, "Online migrations at scale" (2 February 2017). FULL-TEXT.** Locator: "A pattern for online migrations", "Part 1"-"Part 4", "Conclusion". Byline not captured in my extract.

- Case: moving "hundreds of millions" of Subscription objects out of an array field on Customer records into their own Subscriptions table, without a maintenance window. — [Stripe](https://stripe.com/blog/online-migrations)
- Four phases as listed: (1) dual write to old and new tables; (2) change all read paths to the new table; (3) change all write paths to write only to the new table; (4) remove old data. — [Stripe](https://stripe.com/blog/online-migrations)
- Phase 1 gating: Stripe suggests limiting the performance impact of the extra write by "slowly ramping up the percentage of objects that get duplicated" while watching operational metrics. Backfill used offline database snapshots in Hadoop with a Scalding (MapReduce) job to list the IDs to copy, then a multi-threaded migration, then the Scalding job again to confirm nothing was missed. — [Stripe](https://stripe.com/blog/online-migrations)
- Scale argument: at one second per object, sequentially, "it would take over three years to migrate one hundred million objects". — [Stripe](https://stripe.com/blog/online-migrations)
- Phase 2 comparison: reads went through GitHub's Scientist library, reading both the Subscriptions table and the Customers table, raising an alert on any mismatch; only "After we verified that everything matched up" did reads switch. — [Stripe](https://stripe.com/blog/online-migrations)
- Phase 3: write order reversed (write new store first, then copy back into the old store) so the two stay consistent while write paths are converted one at a time; the post calls this "arguably the most challenging part of the migration" because subscription logic spanned "thousands of lines of code across multiple services". More Scientist experiments ran during this phase. To find stragglers, the old accessor was changed to raise a hard error. — [Stripe](https://stripe.com/blog/online-migrations)
- Phase 4: stop writing the old store; empty the old array lazily whenever a subscription is loaded, then a final Scalding job and migration for the remainder. — [Stripe](https://stripe.com/blog/online-migrations)
- Summary claim: "Scientist experiments alerted us as soon as a single piece of data was inconsistent in production." — [Stripe](https://stripe.com/blog/online-migrations)
- Limits: no calendar durations, no mismatch counts, no percentages for the ramp, no statement of how the read switch was gated (flag, percentage or deploy), and no description of rollback after phase 3. It establishes the sequence and the comparison tool, not the cost.

**Stripe, "How Stripe's document databases supported 99.999% uptime with zero-downtime data migrations" (6 June 2024). FULL-TEXT.** Locator: Steps 1-6 of the Data Movement Platform.

- This is data movement between shards, not a logical schema change, but it shows the non-application route: register migration; bulk import from a snapshot at time T; asynchronous replication from T using change-data-capture; replication is bidirectional specifically so traffic can be reverted to the source; correctness check by comparing point-in-time snapshots (chosen to avoid loading the shards); traffic switch using a version token ("versioned gating"); deregistration. — [Stripe DocDB](https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations)
- Numbers: 5 million queries per second, 5,000+ collections, 2,000+ shards; "The entire traffic switch protocol takes less than two seconds to execute"; in 2023 it moved 1.5 petabytes and cut the shard count by about three quarters. — [Stripe DocDB](https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations)
- Limits: reads and writes to the chunk are rejected during the switch (clients retry), so it is brief unavailability, not zero; the two copies have the same shape, so it does not show two data models coexisting.

**GitHub, "Scientist: Measure Twice, Cut Once" (3 February 2016, updated 3 December 2020). FULL-TEXT.**

- Scientist wraps old code (control) and new code (candidate), runs both, returns the control's result, swallows candidate exceptions, and publishes timing and mismatch data. Built for rewriting GitHub's permissions code. The `enabled?` method can be overridden to run an experiment for a percentage of calls (the sample uses `rand(100) < percentage`). GitHub records a mismatch counter per experiment and stores mismatch payloads in Redis. — [GitHub Scientist](https://github.blog/developer-skills/application-development/scientist/)
- Stated limit by GitHub: Scientist is not for code with side effects; a candidate that writes to the same database is "dangerous and incorrect", and "we only use Scientist on read operations." — [GitHub Scientist](https://github.blog/developer-skills/application-development/scientist/)

**GitHub, "Move Fast and Fix Things" (15 December 2015). FULL-TEXT.** (Not a schema change; included for the only published ramp-and-mismatch numbers from GitHub.)

- Replacing the merge implementation: experiment enabled for 1% of requests first; mismatches investigated for 4 days; then run at 100% of requests for 24 hours with no mismatches; "tens of millions of merge commits" compared; about 5 days of part-time work; found 2 bugs in the old Git implementation and 3 performance problems in the new code. Most early mismatches were the old code timing out. — [GitHub](https://github.blog/engineering/infrastructure/move-fast/)

**GitHub, "Partitioning GitHub's relational databases to handle scale" (Thomas Maurer, 27 September 2021, updated 2 March 2022). FULL-TEXT.**

- Tables grouped into "schema domains"; a query linter (development and test) and a transaction linter (production, heavily sampled) find queries and transactions that cross domains before any data moves. Changes that replace joins with separate queries shipped "behind Scientist experiments that execute both the old and new implementations for a subset of requests". — [GitHub partitioning](https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/)
- Physical move by Vitess (VReplication) or a custom "write-cutover": set the old primary read-only, wait for the replica cluster to catch up by GTID, stop replication, repoint ProxySQL, re-enable writes. The six steps take "only a few tens of milliseconds" on the busiest tables, run at the lowest-traffic time, and cause "a handful of user-facing errors". 130 of the busiest tables were moved at once this way. — [GitHub partitioning](https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/)
- Result: `mysql1` served 950,000 queries/s in 2019; by 2021 the same tables across several clusters served 1,200,000 queries/s with average load per host halved. — [GitHub partitioning](https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/)
- Limits: the post does not describe rollback of a write-cutover, and I found no GitHub post describing how GitHub deprecates columns.

**Notion, "Herding elephants: Lessons learned from sharding Postgres at Notion" (6 October 2021). FULL-TEXT.** Locator: "Migrating to shards", "Double-writing with an audit log", "Backfilling old data", "Verifying data integrity", "Difficult lessons learned". Byline not captured.

- Target: 480 logical shards on 32 physical databases. Steps listed: double-write, backfill, verification, switch-over. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Notion rejected writing directly to both databases from the application: "any issue with either write can quickly lead to inconsistencies between databases", calling it too flaky for a critical-path store. It also rejected logical replication because it could not keep up with block-table write volume during the initial snapshot. It chose an audit-log table recording all writes plus a catch-up script that replays them to the new databases. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Backfill: about three days on a 96-CPU m5.24xlarge; the backfill compares record versions and skips records with newer updates so backfill and catch-up can run in either order. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Verification: a script comparing sampled contiguous UUID ranges (a full scan was too expensive), plus "dark reads": a flag fetched from both old and new databases, compared the records, discarded the sharded copy and logged discrepancies. "Introducing dark reads increased API latency, but provided confidence that the switch-over would be seamless." The migration logic and the verification logic were written by different people on purpose. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Rollback: a reverse audit log and script were built and tested to replay writes from the shards back to the monolith; it was not needed. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Limit reported by Notion itself: the final switch-over was not online. Notion took "five minutes of scheduled maintenance" because the catch-up script had to finish after the server was taken down; the post says another week of optimisation might have made a no-downtime swap possible. Because the old database was already strained, Notion could not backfill the partition key in place and had to compute it on the fly. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion)
- Limits: no discrepancy counts, no dark-read percentage, total project length given only as "months".

**Slack, "Scaling Datastores at Slack with Vitess" (1 December 2020). FULL-TEXT.**

- The migration from workspace-sharded MySQL to Vitess began in 2017; at publication, "exactly three years" in, 99% of query load had moved, from 0 to 2.3 million queries per second. — [Slack](https://slack.engineering/scaling-datastores-at-slack-with-vitess/)
- Mechanism named in the post: application routing to Vitess, "a generic backfill system for cloning the existing tables while performing double-writes from the application", and "a parallel double-read diffing system" to confirm the Vitess tables had the same semantics as the legacy databases. — [Slack](https://slack.engineering/scaling-datastores-at-slack-with-vitess/)
- The post says Slack later changed technique to move whole shards instead of tables, and refers to a case study (a table with 20% of query load) in the book *Refactoring at Scale*; neither is detailed in the post. — [Slack](https://slack.engineering/scaling-datastores-at-slack-with-vitess/)
- Limits: no diff rates, no per-table durations, no rollback description. The three-year figure is the whole programme, not one table.

**Discord, "How Discord Stores Trillions of Messages" (6 March 2023) and "How Discord Stores Billions of Messages" (13 January 2017). FULL-TEXT.**

- 2022 Cassandra to ScyllaDB (177 Cassandra nodes, trillions of messages): began dual-writing new data to both; the first migrator (Spark) estimated three months; a rewritten Rust migrator estimated nine days and ran at up to 3.2 million messages per second; it stuck at 99.9999% on token ranges full of uncompacted tombstones until those were compacted. Validation was "sending a small percentage of reads to both databases and comparing results". The switch happened in May 2022. — [Discord 2023](https://discord.com/blog/how-discord-stores-trillions-of-messages)
- 2015-2017 MongoDB to Cassandra: code was set up "to double read/write to MongoDB and Cassandra"; Cassandra became primary and MongoDB was phased out "within a week"; about six months later Cassandra became unresponsive (a large-partition/tombstone problem). — [Discord 2017](https://discord.com/blog/how-discord-stores-billions-of-messages)
- Limits: no mismatch counts, no read-comparison percentage, no rollback plan described; these are store migrations with the same logical model, not a column redesign.

**Uber, "Project Mezzanine: The Great Migration" (28 July 2015). FULL-TEXT.**

- Moving the trips table from one PostgreSQL instance to Schemaless (on MySQL) in 2014: "hundreds of millions of rows", more than 100 services, "dozens of engineers". Motivation included that adding a column or index to the PostgreSQL trips table caused downtime. — [Uber](https://www.uber.com/blog/mezzanine-codebase-data-migration/)
- Steps: a `lib/tripstore` library with a switch so each query could go to PostgreSQL or Schemaless; writes mirrored to both; all queries replayed against Schemaless and verified in the background; because validation loaded an already busy database, "we used a probabilistic approach to control the additional load". Final six weeks in a war room; the switch was flipped a month before Halloween 2014 with staff present at 6 am; reported as a non-event. — [Uber](https://www.uber.com/blog/mezzanine-codebase-data-migration/)
- Lesson stated: "Plan for multiple complete and partial backfills." — [Uber](https://www.uber.com/blog/mezzanine-codebase-data-migration/)
- Schemaless secondary indexes are versioned: to change one, create a new version, backfill it, then switch an index alias, without downtime. — [Uber](https://www.uber.com/blog/mezzanine-codebase-data-migration/)
- Limits: no mismatch numbers; no rollback description after the switch.

**Uber, "Code Migration in Production: Rewriting the Sharding Layer of Uber's Schemaless Datastore" (22 February 2018). FULL-TEXT.**

- Read endpoints were validated by executing each request in both the old (Python) and new (Go) workers and comparing responses; this doubled requests to storage, so configuration flags enabled validation per endpoint and set the percentage of requests validated, adjustable "within seconds". Write endpoints could not be validated this way because a write can succeed only once; they were covered by integration tests and a test instance, then write traffic was moved by percentage through runtime configuration. — [Uber Frontless](https://www.uber.com/blog/schemaless-rewrite/)
- Limits: a code rewrite over the same data, not a schema change; cited for the explicit read/write asymmetry.

**LinkedIn, "New Recruiter & Jobs: The largest enterprise data migration at LinkedIn" (23 July 2021). FULL-TEXT.**

- Moving Recruiter data from a single-shard relational database to Espresso (key-value) with a different data model. Building blocks: online dual writes (asynchronous, after the legacy commit succeeds; failures go to a self-healing queue), nearline change-stream verification, online shadow-read verification near the API (compares what the customer would see; discrepancies emitted as Kafka events and fixed), and offline bulk verification. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l)
- Stated difficulty: "It is extremely hard to implement dual write with distributed transactions between two systems or maintain data constraints." Eventual consistency is the best achievable. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l)
- One-way only: because the two systems' features and data are not one-to-one, "it is not practical to go back and forth between the two systems". — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l)
- Switch-over was per customer and not fully online: LinkedIn chose consistency over availability and accepted "a small window of unavailability"; it stopped bulk operations three days before each ramp and ran ramps on Sunday mornings. Reported steady-state consistency "well above 99.999%" with the potentially broken window "no more than minutes". Bootstrap backfill took "several days". — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l)
- Limits: no absolute discrepancy counts; total duration not stated in the passages I read (the product was announced August 2019, the post is July 2021).

**Figma, "How Figma's databases team lived to tell the scale" (14 March 2024). FULL-TEXT.**

- Figma explicitly avoided double writes: "We wanted to avoid complex solutions like double-writes that are challenging to implement without taking downtime or compromising on consistency." It also avoided large backfills (estimated at months) and one-way migrations. — [Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/)
- Instead it separated "logical sharding" from "physical sharding": Postgres views per shard were created on the still-unsharded database, and reads and writes were routed through them by feature flags in the query engine, with a percentage-based rollout; rollback was a configuration change, "within seconds by just rerouting traffic back to the main table". A shadow-reads framework sent live read traffic through the views and compared performance and correctness. Views cost under 10% in the worst cases in load tests. — [Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/)
- First table took about nine months; first horizontally sharded table shipped September 2023 with ten seconds of partial availability on primaries. Rolling back a physical shard split is possible but needs more coordination. — [Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/)

**Shopify, "Shard Balancing: Moving Shops Confidently with Zero-Downtime at Terabyte-scale" (24 September 2021). FULL-TEXT.**

- Moving one shop between MySQL shards ("pods") with Ghostferry: batch copy with `SELECT ... FOR UPDATE` plus tailing the binary log filtered by `shop_id`; cutover begins when replay lag is seconds; writes for that shop are stopped using a Redis-backed multi-reader-single-writer lock, the remaining events are applied, and the routing table is updated. — [Shopify](https://shopify.engineering/mysql-database-shard-balancing-terabyte-scale)
- Limits: same schema on both sides; shows per-tenant cutover, not per-tenant schema versions.

**Noah, "Zero-downtime migration of Noah's internal ledger" (25 June 2025). FULL-TEXT.** (Small company; first-person.)

- QLDB to Aurora PostgreSQL ledger. A `DualLedger` wrapper used feature flags to decide which ledgers were enabled and which was primary; phase 2 dual-wrote and read from both to log discrepancies, with the new store's errors logged and ignored; phase 3 promoted Postgres to primary while keeping QLDB to allow switching back. Three comparison methods: read comparison, stream comparison, and a third offline method. — [Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger)
- Failure reported: boolean feature flags for "which ledger is primary" were evaluated inconsistently because of caching and deployment, so "different parts of the system occasionally had conflicting views of which ledger was active", causing errors; they replaced the flag with a future-dated timestamp so all services switched at the same instant. They also report the ledgers drifting apart and needing repeated backfills. — [Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger)

**LaunchDarkly, "Feature Flagging to Mitigate Risk in Database Migrations" (3 May 2016) and migration-flag documentation (undated; fetched 2026-11-11). FULL-TEXT. Vendor.**

- 2016 post: four flags (`events-mongo-write`, `events-dynamo-write`, `events-mongo-read`, `events-dynamo-read`) evaluated per account; when both read flags are on, results are compared. The post warns its example assumes data that is never updated and that updatable data "is a bit more complicated". — [LaunchDarkly blog](https://launchdarkly.com/blog/feature-flagging-to-mitigate-risk-in-database-migration/)
- Current product codifies six stages: off (read old, write old), dualwrite (read old, write old then new), shadow (read both, return old), live (read both, return new, write new then old), rampdown (read new, write both), complete (new only). The old system is authoritative through shadow; the new from live onward. Cohorts can move through stages independently and by percentage. A two-stage (off/complete) variant is offered for cases where "you cannot run the old and new systems simultaneously". — [LaunchDarkly guide](https://launchdarkly.com/docs/guides/flags/migrations), [LaunchDarkly migration flags](https://launchdarkly.com/docs/home/flags/migration)
- Limits: vendor documentation; describes a product, not an outcome. It does not address backfill or how the two stores are reconciled when a dual write partially fails.

### Inferences

- The steps the objection asks for exist in a stable, published form: (1) add new structure; (2) write both, gated by flag or percentage; (3) backfill, usually offline or throttled; (4) read both, return old, count mismatches; (5) return new for a ramping share; (6) stop writing old; (7) delete old. Stripe, Notion, Uber, LinkedIn, Noah and LaunchDarkly's stage table all fit it.
- Reads are easy to gate and compare per request; writes are not. GitHub and Uber both say comparison harnesses apply to reads only. That is why every account keeps one store authoritative at each moment and treats the other as a copy.
- Rollback is cheap up to the point the new store becomes authoritative, then it needs a reverse sync (Notion's reverse audit log, Stripe DocDB's bidirectional replication, LaunchDarkly's "live" stage writing back to old) or it is given up (LinkedIn).
- Published accounts are survivor stories. None of the large-company posts gives a mismatch count; the evidence that comparison finds real bugs is qualitative (GitHub's merge experiment, Noah's drift, Aircall in section 7).

### Gaps

- No verified first-person account from Airbnb, Pinterest, Dropbox (the 2016 Edgestore post I fetched says schema evolution used to be "brittle and error-prone" but its schema-evolution section was not in the page I retrieved), Twitter, Box, Basecamp, Gusto, Monzo, Wise or Square "Books".
- No source gives per-phase durations for a single column-level change at a large company.
- Stripe's 2017 post does not say how the read switch was gated.

## 3. The N / N-1 compatibility rule in practice: how tools and written rules enforce it, and views that present two schema versions at once

### Takeaway

The rule that any schema must work with both the current and the previous application version is enforced by written multi-release procedures (GitLab), by linters that block unsafe migrations (strong_migrations), and by online schema-change tools that build a second copy of the table and swap it. pgroll and Vitess go further: pgroll exposes old and new schema versions simultaneously through views with triggers copying between column versions, and Vitess keeps the replication stream alive after cutover so a change can be reverted without losing later writes.

### Cited Findings

**GitLab, "Avoiding downtime in migrations" (docs.gitlab.com, living document; examples reference releases 12.5-19.1). FULL-TEXT. First-party engineering rules.**

- Dropping a column takes three releases: ignore the column in the model (release M), drop it in a post-deployment migration (M+1), remove the ignore rule (M+2). Reason given: Rails caches the table's columns at boot, and "dropping a column is a destructive operation that can't be rolled back easily". The ignore rule carries `remove_with` (a release) and `remove_after` (a date), e.g. `ignore_column :updated_at, remove_with: '12.7', remove_after: '2019-12-22'`, to stop the steps being bundled into one deployment. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Renaming a column: a regular migration using `rename_column_concurrently` (adds the new column, copies data, installs triggers to keep both in sync), ignore the old column, a post-deployment migration to clean up, then remove the ignore rule in M+1. Marked "only appropriate for small tables"; large tables use batched background migrations across multiple milestones. Warning: "With Canary it is possible that the system runs in this state for a significant amount of time." — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Changing a column type: `change_column_type_concurrently` creates a temporarily named new column with sync triggers; cleanup in a post-deployment migration. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Integer to bigint primary keys: release N adds the new column with a sync trigger and starts the backfill; a later release swaps columns in a transaction; release N+2 drops the trigger and old column. The doc lists trigger pitfalls during the swap (a trigger with a stale `UPDATE OF` column list stops firing for application writes). — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Changing a column default takes two minor releases, because during a zero-downtime deploy old processes hold a stale schema cache and may omit the column on insert. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Changing a data format (e.g. JSON to something else): add a new column in the new format, copy, deploy code, copy the remainder in a post-deployment migration; "there is no one-size-fits-all solution". — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Large tables: the concurrent helpers "can take a very long time", block the deployment and put pressure on the database; use background migrations. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/)
- Post-deployment migrations run after the new code is deployed and can be skipped at deploy time with `SKIP_POST_DEPLOYMENT_MIGRATIONS`. — [GitLab post-deployment migrations](https://docs.gitlab.com/development/database/post_deployment_migrations/)
- Renaming a table: release N.M points the model at the future name's view-compatible setup; release N.M+1 renames the table and creates a view with the old name (`CREATE VIEW issues AS SELECT * FROM tickets`) so old application instances keep working during the rolling deploy; a post-deployment migration removes the view. Restrictions: no column changes to the table during N.M and N.M+1; avoid tables used with triggers. — [GitLab rename tables](https://docs.gitlab.com/development/database/rename_database_tables/)
- Batched background migrations are throttled on database health signals (write-ahead-log queue and rate, autovacuum activity, Patroni Apdex), pausing 10 minutes on a stop signal, because "there have been incidents due to the heavy load from these migrations"; and "waiting for the next release is not enough to guarantee that the data was fully migrated", so migrations must be explicitly finalized before a required upgrade stop. — [GitLab batched background migrations](https://docs.gitlab.com/development/database/batched_background_migrations/)
- Limits: rules, not outcome data. The procedure is driven by releases and deployment order; GitLab's column procedures do not use a per-user feature flag to choose which column is read. Self-managed customers upgrading on their own schedule are a stated reason for the multi-release spacing.

**Andrew Kane, strong_migrations README (GitHub; "Battle-tested at Instacart"; current version fetched 2026-11-11). FULL-TEXT.**

- A Rails gem that raises an error in development when a migration contains a dangerous operation and prints the safer procedure. Checks include removing a column, changing a column type, renaming a column or table, adding an index non-concurrently, setting NOT NULL, adding a foreign key or check constraint with validation. — [strong_migrations](https://github.com/ankane/strong_migrations)
- For renaming a column or changing its type, the README prescribes six steps: create a new column; write to both columns; backfill; move reads to the new column; stop writing to the old column; drop the old column. — [strong_migrations](https://github.com/ankane/strong_migrations)
- For removal: Active Record caches columns at runtime, so the column must first be ignored in the model, deployed, and then dropped. States "Strong Migrations does not detect dangerous backfills." — [strong_migrations](https://github.com/ankane/strong_migrations)
- Limits: it blocks the unsafe one-step form; it does not perform or verify the dual write, the backfill or the read switch.

**PostgreSQL documentation, ALTER TABLE (current version). FULL-TEXT.**

- `ADD CONSTRAINT ... NOT VALID` skips the full-table scan; the constraint is enforced for new inserts and updates; `VALIDATE CONSTRAINT` checks existing rows later. Purpose stated: reduce the impact of adding a constraint on concurrent updates. Allowed for foreign-key, CHECK and not-null constraints. — [PostgreSQL docs](https://www.postgresql.org/docs/current/sql-altertable.html)

**Xata, pgroll README and launch post "Introducing pgroll" (3 October 2023); "Schema changes and the power of expand-contract with pgroll" (13 November 2024). FULL-TEXT. Vendor / open source.**

- pgroll describes itself as offering reversible migrations "by serving multiple schema versions simultaneously". Each schema version is a Postgres schema of views over the physical tables; a client picks a version by setting `search_path` (e.g. `SET search_path TO 'public_initial_migration'`). — [pgroll README](https://github.com/xataio/pgroll)
- For a breaking column change, pgroll adds a new physical column, backfills it in batches, and installs triggers so writes to the old or new column are propagated to the other "during the whole active migration period"; the new version's view exposes the new column under the final name. `complete` drops the old column, triggers and old views; `rollback` drops the new version, leaving the old untouched. — [pgroll README](https://github.com/xataio/pgroll), [Xata launch post](https://xata.io/blog/pgroll-schema-migrations-postgres)
- The README's benchmark section tracks "WriteAmplification/WithTrigger" against a no-trigger baseline, i.e. the project acknowledges the triggers cost write throughput; I did not read the numbers. — [pgroll README](https://github.com/xataio/pgroll)
- Limits: vendor material; Xata says it uses Postgres internally and in its product, but I found no independent production account or scale figures. Version selection is per connection (`search_path`), which maps to "old app version versus new app version", not obviously to a per-user flag.

**GitHub, "gh-ost: GitHub's online schema migration tool for MySQL" (1 August 2016) and gh-ost docs. FULL-TEXT.**

- GitHub runs schema changes "multiple times per day". All earlier tools (pt-online-schema-change, Facebook OSC, LHM, oak-online-alter-table) create a ghost table and use triggers to mirror changes. gh-ost instead reads the binary log and applies changes to the ghost table asynchronously, so it can be paused and throttled (on load, replication lag, a query, a flag file or a command) and tested on replicas. — [gh-ost announcement](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/)
- Scope: these tools change the physical table while applications see one schema; they do not by themselves let two logical versions coexist. The application-level N/N-1 discipline is still needed around them.

**Facebook/Meta, "OnlineSchemaChange rebuilt in Python" (5 May 2017) and "How OSC works" (project wiki). FULL-TEXT.**

- OSC was open-sourced in PHP in 2010 and rebuilt in Python in 2017. Phases: init (shadow table plus a "deltas" change-capture table fed by insert, update and delete triggers), dump (`SELECT INTO OUTFILE` in chunks), load, replay (repeatable), checksum (crc32 per chunk against a consistent snapshot), cut-over (lock, final replay, rename), cleanup. — [Meta engineering](https://engineering.fb.com/2017/05/05/production-engineering/onlineschemachange-rebuilt-in-python/), [OSC wiki](https://github.com/facebookincubator/OnlineSchemaChange/wiki/How-OSC-works)
- Stated limit: the swap is two separate renames, not atomic, so a transaction arriving between them gets a "table not found" error. The 2017 post says Facebook was working on a triggerless variant. — [OSC wiki](https://github.com/facebookincubator/OnlineSchemaChange/wiki/How-OSC-works)

**Square, "Shift: Safe and Easy Database Migrations" (15 April 2016). FULL-TEXT.**

- A service wrapping a patched pt-online-schema-change with submit, dry-run, peer approval, pause and resume; used "to run thousands of databases migrations every month"; handles "migrations that take weeks to complete"; can apply one DDL to many shards as a group. — [Square](https://developer.squareup.com/blog/shift-safe-and-easy-database-migrations/)

**Shopify: LHM README (Shopify fork of SoundCloud's Large Hadron Migrator); "Swappable migration backends in Rails" (Rails at Scale, 8 December 2025); "Adding NOT NULL columns" (4 October 2022). FULL-TEXT.**

- LHM uses a copy table and triggers, throttled by time or by replica lag. Shopify runs "hundreds of database migrations across many Rails applications every week"; after years of LHM it began building a central Schema Migrations Service in 2021 so developers could write ordinary Rails migrations. — [LHM README](https://github.com/Shopify/lhm), [Rails at Scale](https://railsatscale.com/2025-12-08-swappable-migration-backends-in-rails/)
- Shopify's Database Migrations team showed by experiment that an LHM migration adding a NOT NULL column with a DEFAULT and a unique index can lose rows under MySQL strict mode (the shadow table ends with fewer rows than the original). — [Shopify](https://shopify.engineering/add-not-null-colums-to-database)
- Limits: I found no Shopify post titled or about "expand, migrate, contract" or about Shipit's handling of migrations; a third-party claim that Shopify uses strong_migrations was not verified (SNIPPET only).

**Vitess managed online schema changes (docs) and PlanetScale, "Behind the scenes: How schema reverts work" (Holly Guevara and Shlomi Noach, 24 March 2022). FULL-TEXT. PlanetScale is a vendor.**

- Vitess online DDL runs `ALTER TABLE` as a VReplication workflow; old tables are retained after cutover (default 24 hours, `--retain-online-ddl-tables`); migrations are revertible and resume after failover. — [Vitess docs](https://vitess.io/docs/user-guides/schema-changes/managed-online-schema-changes/)
- Revert works because VReplication "does not terminate upon migration completion": it keeps a transactionally accurate journal, so a revert swaps the old table back while retaining rows written after the deploy. — [PlanetScale](https://planetscale.com/blog/behind-the-scenes-how-schema-reverts-work)
- PlanetScale's "Backward compatible database changes" (Taylor Barnett, 9 May 2023) gives a six-step expand/migrate/contract walkthrough (expand schema, expand application to write both, migrate data, migrate application reads, contract application, contract schema) and argues schema and application cannot deploy atomically. Vendor guidance, not a case study. — [PlanetScale](https://planetscale.com/blog/backward-compatible-databases-changes)

**Django.** FULL-TEXT of the migrations topic guide (5.2): I found no guidance there on zero-downtime or two-version coexistence; the guide covers generating, applying and reversing migrations. — [Django docs](https://docs.djangoproject.com/en/5.2/topics/migrations/)

### Inferences

- There are two layers that the objection tends to merge. The physical layer (rewrite a big table without blocking) is solved by tooling: gh-ost, OSC, LHM, pt-osc, VReplication, `NOT VALID`. The logical layer (old and new code both correct against the same data) is solved by procedure: multi-release sequencing, ignored columns, dual writes, compatibility views.
- GitLab's documentation is the most detailed public statement of the N/N-1 discipline, and it shows the price: a column rename or removal spans two to three releases, and the intermediate state can persist "for a significant amount of time" under canary.
- Views are the recurring device for showing two shapes of one table at once: Fowler/Sadalage's rename view (2016), GitLab's rename-table view, Figma's shard views, pgroll's versioned schemas.

### Gaps

- No independent production report of pgroll at scale.
- I did not verify pt-online-schema-change's own documentation; statements about it come from GitHub's and Square's posts.
- No official Django guidance found; Rails guidance is via the third-party strong_migrations gem and GitLab.

## 4. Feature-flagged reads and writes at row, tenant, shard or percentage level; per-tenant schema versions

### Takeaway

There is good evidence of ramping the read path and the dual-write path by percentage or by tenant, and of moving one tenant at a time between databases. I found no primary evidence of a relational SaaS deliberately running different physical schema versions per tenant as a steady practice; where schema changes are staged by shard, it is described as a canary for the migration's operational risk.

### Cited Findings

- Stripe ramped "the percentage of objects that get duplicated" at the dual-write step. — [Stripe 2017](https://stripe.com/blog/online-migrations) FULL-TEXT
- LaunchDarkly's 2016 example evaluates read and write flags per account, and its migration flags move "cohorts" through stages independently with percentage rollouts. — [LaunchDarkly blog](https://launchdarkly.com/blog/feature-flagging-to-mitigate-risk-in-database-migration/), [LaunchDarkly migration flags](https://launchdarkly.com/docs/home/flags/migration) FULL-TEXT, vendor
- Figma rolled out reads and writes through shard views by percentage with feature flags in its query engine, with rollback in seconds. — [Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/) FULL-TEXT
- Uber validated a configurable percentage of requests per endpoint and moved write traffic by percentage through runtime configuration. — [Uber Frontless](https://www.uber.com/blog/schemaless-rewrite/) FULL-TEXT
- LinkedIn dual-wrote and verified for all customers regardless of rollout date, then switched the source of truth customer by customer on Sunday mornings. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l) FULL-TEXT
- Aircall moved reads behind a feature flag in steps of 5%, 25%, 50%, 100% per cluster after dual-write, backfill and parity validation. — [Aircall](https://aircall.io/en-gb/blog/tech-team-stories/elasticsearch-to-opensearch/) FULL-TEXT
- Shopify's architecture is "podded": each pod has its own MySQL shard holding a subset of shops, with `shop_id` as the sharding key; a single shop is moved between shards online with a per-shop write lock at cutover. — [Shopify shard balancing](https://shopify.engineering/mysql-database-shard-balancing-terabyte-scale) FULL-TEXT
- Square's Shift applies one DDL statement to many shard databases as a "meta request" that can be approved, started or cancelled together. — [Square](https://developer.squareup.com/blog/shift-safe-and-easy-database-migrations/) FULL-TEXT
- GitHub, after the November 2021 incident, said partitioning helps because "migrations can then be run in canary mode on a single shard". — [GitHub availability report, November 2021](https://github.blog/news-insights/company-news/github-availability-report-november-2021/) FULL-TEXT
- Slack's original architecture sharded by workspace (team), and the Vitess migration moved table by table, later shard by shard. — [Slack](https://slack.engineering/scaling-datastores-at-slack-with-vitess/) FULL-TEXT
- Noah found that using an ordinary boolean flag to select the authoritative store was unsafe because services saw different flag values at the same moment. — [Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger) FULL-TEXT

### Inferences

- Flags ramp behaviour (which copy is read, whether the second write happens, whether comparison runs), while the physical schema is the same for everyone and contains both versions. Per-row or per-tenant schema divergence is avoided; per-tenant routing between identically shaped stores is common.
- A flag that selects the authoritative store needs stronger consistency than an ordinary feature flag (Noah), or the switch is done by a routing-layer token (Stripe DocDB) or a short write pause (GitHub, Shopify, LinkedIn, Notion).
- Shard-by-shard application of DDL means shards are briefly on different physical schemas, so application code must tolerate both for the duration. This follows from the Square and GitHub descriptions but neither states it.

### Gaps

- Salesforce's metadata-driven multitenant design (often cited as per-tenant logical schemas over shared physical tables) could not be retrieved; no claim is made here.
- No primary source found describing per-tenant schema versions in Shopify pods or Slack shards.
- The Etsy "Schemanator" post (side-by-side schema changes across shard pairs) could not be retrieved.

## 5. A/B testing across two data models

### Takeaway

I found no first-person account of a controlled experiment in which treatment and control users were served from different operational schema versions with a business metric as the outcome. What is documented is equivalence testing (same answer from both versions) and offline performance comparison on mirrored traffic.

### Cited Findings

- GitHub's Scientist is called an "experiment" but always returns the control result; its purpose is to detect mismatches and timing differences, and GitHub restricts it to reads. — [GitHub Scientist](https://github.blog/developer-skills/application-development/scientist/) FULL-TEXT
- Heap (21 February 2018) tests schema changes on "shadow prod": production reads and writes are mirrored to a control machine and an experimental machine holding the same data transformed into the new schema; writes go through Postgres user-defined functions so the writing service need not know the schema. Customers never see results from the experimental machine. — [Heap](https://heap.io/blog/testing-database-changes-right-way) FULL-TEXT
- Uber's Schemaless supports versioned secondary indexes switched by alias after backfill, which lets two index layouts exist at once; the post presents this as a no-downtime change mechanism, not an experiment. — [Uber Mezzanine](https://www.uber.com/blog/mezzanine-codebase-data-migration/) FULL-TEXT
- LinkedIn states the old and new Recruiter data models are not one-to-one, so moving a customer back and forth is impractical. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l) FULL-TEXT
- A web search for accounts of A/B tests assigning users to different schema versions returned none; the search tool's suggestion to combine flags, an authoritative old schema and mismatch metrics was its own synthesis, not a source. — SNIPPET (search result, 2026-11-11)

### Inferences

- The patterns in sections 1-3 make an A/B test over a changed data model feasible only when both shapes are kept populated for all users (expanded schema plus dual write or trigger), so either arm can be served and users can be moved between arms. The experiment then tests the feature reading the new column, while the data layer stays in the "expand" state for the experiment's duration.
- If the treatment writes data that has no representation in the old model (LinkedIn's case), users cannot return to control without loss; the experiment becomes one-way for those users. This is an inference from the dual-write accounts, not a documented experimentation-team statement.
- The cost of such an experiment is that the dual-running period lasts as long as the experiment, and the contract step waits on the decision.

### Gaps

- No statement found from an experimentation platform team (e.g. Microsoft ExP, Netflix, Booking, LinkedIn T-REX, Airbnb ERF) about data-model changes under experiment. This is a real gap in the evidence, not just in my search: one targeted search and the adjacent sources produced nothing.
- No account found for search-index, pricing-table or recommendation-store schema experiments on operational stores.

## 6. Event-sourced and log-based systems: schema evolution of events, and dual projections

### Takeaway

For logs, the compatibility rule is formalised and machine-checked (Confluent Schema Registry modes), and old events are adapted on read (upcasting) or the store only ever grows (Datomic). I could verify the vendor and tool documentation but not Greg Young's book text, and I found no first-person production account of serving two read models side by side behind a flag.

### Cited Findings

- Confluent Schema Registry (vendor documentation, current version): BACKWARD means consumers on the new schema can read data written with the previous schema (allowed: delete fields, add optional fields); FORWARD means consumers on the old schema can read data written with the new one; FULL is both. "The default compatibility mode is BACKWARD." BACKWARD checks only against the last version (X and X-1); the `_TRANSITIVE` variants check all earlier versions. The registry checks compatibility before accepting a new version. BACKWARD is the default so consumers can rewind to the start of a topic; Kafka Streams supports only BACKWARD; BACKWARD_TRANSITIVE is recommended for Protobuf. — [Confluent docs](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) FULL-TEXT, vendor
- Axon Framework reference (vendor documentation): an upcaster takes one stored event of revision x and outputs zero or more events of revision x+1; upcasters are chained so each revision needs only one small upcaster; upcasting must be hand-written. — [Axon docs](https://docs.axoniq.io/axon-framework-reference/4.10/events/event-versioning/) FULL-TEXT, vendor
- Greg Young, *Versioning in an Event Sourced System* (Leanpub, free to read): table of contents includes chapters on Weak Schema, Upcasting State, Copy and Replace, and Versioning Bankruptcy. — [Leanpub](https://leanpub.com/esversioning/read) TOC-ONLY. Secondary summaries describe copy-and-replace as the heavy option (write a new stream, leave the old one) — [Arkency](https://blog.arkency.com/4-strategies-when-you-need-to-change-a-published-event/) SNIPPET.
- Datomic schema-change documentation (vendor): attributes can be renamed and some properties altered, but `:db/valueType` (and several others) can never be altered; the docs have a "Growing Your System" section. — [Datomic docs](https://docs.datomic.com/schema/schema-change.html) FULL-TEXT, vendor
- Uber's Schemaless is append-only: a cell is never modified after it is written, which makes updates idempotent and replayable in any order; this is what made repeated backfills and buffered writes safe during Mezzanine. — [Uber Mezzanine](https://www.uber.com/blog/mezzanine-codebase-data-migration/) FULL-TEXT
- Noah, moving a ledger, ran two streaming pipelines (one per ledger) and compared their events with a temporary Lambda function, then deliberately created a brief overlap of duplicated events at cutover after making consumers idempotent. — [Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger) FULL-TEXT

### Inferences

- In a log-based design, "two versions of a column" becomes "two projections built from the same events". Building a second projection is a backfill by replay, and switching readers is the same flag-gated read switch as in section 2. The sources above establish the ingredients (replayable log, compatibility checks, upcasters), not a named production case of dual projections behind a flag.
- The registry's BACKWARD/FORWARD modes are the N/N-1 rule stated for messages: BACKWARD lets consumers upgrade first, FORWARD lets producers upgrade first.

### Gaps

- Greg Young's text could not be read; do not quote it.
- No Nubank/Datomic first-person account retrieved; the "accretion-only" framing is not verified beyond the Datomic documentation's limits on alteration.
- No first-person account found of dual read models served by flag or of an event-schema change gone wrong.

## 7. Limits and failures

### Takeaway

The approach has documented costs and failure modes: sync triggers have taken down primaries; a "safe" final rename caused a multi-hour GitHub outage; dual writes drift and can silently overwrite newer data; lock queues turn a millisecond DDL into an outage; some switches still need a pause or maintenance window; and some migrations are one-way. Dual-running lasts from days to years.

### Cited Findings

**Load and outages from the migration machinery:**

- GitHub on trigger-based tools before gh-ost: some migrations "would consistently cause MySQL outage"; lock contention produced "near or complete lock downs in production"; removing triggers stalled for "many seconds to a minute"; triggers cannot be paused, and "the master is brought down by the load of the triggers" even while row-copy is throttled. — [gh-ost announcement](https://github.blog/news-insights/company-news/gh-ost-github-s-online-migration-tool-for-mysql/) FULL-TEXT
- GitHub, 27 November 2021, 2 hours 50 minutes: during the final rename step of a schema migration on a large table, a significant portion of MySQL read replicas hit a semaphore deadlock and went into crash recovery; remaining replicas could not carry the load; core services were unavailable. "Schema migrations are a common task at GitHub and often take weeks to complete." GitHub "paused schema migrations" pending investigation. — [GitHub availability report, November 2021](https://github.blog/news-insights/company-news/github-availability-report-november-2021/) FULL-TEXT
- GitLab: batched background migrations are throttled because "there have been incidents due to the heavy load from these migrations". — [GitLab docs](https://docs.gitlab.com/development/database/batched_background_migrations/) FULL-TEXT
- GoCardless: "we took around 15 seconds of unexpected API downtime during a planned database migration". Adding a foreign key needed an AccessExclusive lock on a heavily used referenced table; the lock request queued behind a long-running read and every other query queued behind it. The same migration ran in a few hundred milliseconds against a backup. — [GoCardless](https://gocardless.com/blog/zero-downtime-postgres-migrations-the-hard-parts/) FULL-TEXT (page shows "Last edited Jun 2024"; original publication date not shown on the page)
- Facebook OSC's cut-over is not atomic; transactions between the two renames see "table not found". — [OSC wiki](https://github.com/facebookincubator/OnlineSchemaChange/wiki/How-OSC-works) FULL-TEXT
- Shopify: an LHM migration can silently drop rows for one combination of NOT NULL, DEFAULT, unique index and strict mode. — [Shopify](https://shopify.engineering/add-not-null-colums-to-database) FULL-TEXT

**Divergence between dual-written copies:**

- Notion judged direct application dual writes too flaky for a critical store and used an audit log instead. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion) FULL-TEXT
- LinkedIn: dual writes without distributed transactions give eventual consistency at best; it needed four separate verification-and-repair loops. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l) FULL-TEXT
- Aircall (26 June 2026; outside the 2006-2025 window, included as a clear near-miss): with dual-write already live on the target, a default reindex backfill "would have silently overwritten 13.5M newer documents with stale copies" while reporting zero failures; about 850 million documents in total; caught by a pre-flight count check; fixed with external versioning. — [Aircall](https://aircall.io/en-gb/blog/tech-team-stories/elasticsearch-to-opensearch/) FULL-TEXT
- Noah: ledgers drifted during migration; flag-evaluation inconsistency caused errors about which store was primary. — [Noah](https://noah.com/blog/zero-downtime-migration-of-noahs-internal-ledger) FULL-TEXT
- Slack built a general framework for scanning for and reporting inconsistent data, noting that a network blip can make an update succeed on one database and not another. — [Slack, "Data Consistency Checks" (27 July 2016, updated 29 June 2020)](https://slack.engineering/data-consistency-checks/) FULL-TEXT (not specific to the Vitess migration)

**Where teams accepted a pause, a window, or no way back:**

- Notion: five minutes of scheduled maintenance for the final switch. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion) FULL-TEXT
- LinkedIn: a small unavailability window per customer at switch-over; one-way sync, no return. — [LinkedIn](https://engineering.linkedin.com/blog/2021/new-recruiter---jobs--the-largest-enterprise-data-migration-at-l) FULL-TEXT
- GitHub write-cutover: read-only for tens of milliseconds, failed writes return errors. Shopify: per-shop write stop. Stripe DocDB: under two seconds of rejected requests. Figma: ten seconds of partial availability. — [GitHub](https://github.blog/engineering/infrastructure/partitioning-githubs-relational-databases-scale/), [Shopify](https://shopify.engineering/mysql-database-shard-balancing-terabyte-scale), [Stripe DocDB](https://stripe.com/blog/how-stripes-document-databases-supported-99.999-uptime-with-zero-downtime-data-migrations), [Figma](https://www.figma.com/blog/how-figmas-databases-team-lived-to-tell-the-scale/) FULL-TEXT
- GitLab: dropping a column "can't be rolled back easily"; LaunchDarkly offers a two-stage migration for systems that cannot run simultaneously. — [GitLab docs](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/), [LaunchDarkly guide](https://launchdarkly.com/docs/guides/flags/migrations) FULL-TEXT
- Uber, before Mezzanine: adding a column or index to the PostgreSQL trips table caused downtime. — [Uber](https://www.uber.com/blog/mezzanine-codebase-data-migration/) FULL-TEXT

**Cost and duration of dual-running:**

- Ambler/Sadalage: quarters to years for shared databases. Sadalage/Fowler: a couple of months to years. — [Red Gate excerpt](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/refactoring-databases-the-process/), [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html) FULL-TEXT
- Slack: three years for the Vitess programme. Figma: nine months for the first table. Uber Mezzanine: most of 2014 with a six-week final push by dozens of engineers. Notion: months, with a three-day backfill. Discord: nine days of copying after a three-month estimate. GitHub: individual schema migrations "often take weeks"; Square: migrations "that take weeks to complete". — sources as cited in sections 2, 3 and above, all FULL-TEXT
- Comparison has a runtime cost: Notion's dark reads raised API latency; Uber's validation doubled storage requests and had to be sampled; Uber Mezzanine sampled validation probabilistically because the old database was already overloaded. — [Notion](https://www.notion.com/blog/sharding-postgres-at-notion), [Uber Frontless](https://www.uber.com/blog/schemaless-rewrite/), [Uber Mezzanine](https://www.uber.com/blog/mezzanine-codebase-data-migration/) FULL-TEXT
- Engineering cost of write-path conversion: Stripe called changing every write path the hardest part, across thousands of lines in multiple services. — [Stripe 2017](https://stripe.com/blog/online-migrations) FULL-TEXT

**Incidents named in the brief that are NOT schema-migration failures:**

- GitHub, 21 October 2018 (24 hours 11 minutes degraded): caused by a 43-second network partition during optical equipment replacement and the resulting Orchestrator failover with unreplicated writes on both coasts. Not schema related. — [GitHub post-incident analysis](https://github.blog/news-insights/company-news/oct21-post-incident-analysis/) FULL-TEXT
- GitLab, 31 January 2017: arose while engineers were repairing lagging PostgreSQL replication with `pg_basebackup`; not a schema migration. — [GitLab postmortem](https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/) FULL-TEXT (I read the replication passages only)

### Inferences

- The approach "stops working", or stops being cheap, in four situations supported by the evidence: (a) the old and new models are not mutually convertible, so there is no rollback after the switch (LinkedIn); (b) the old database is too loaded to bear triggers, backfill or comparison reads (Notion, Uber, GitHub before gh-ost); (c) writes cannot be compared or replayed safely, so only reads get shadow-tested (GitHub Scientist, Uber Frontless); (d) the authoritative-store switch needs atomicity that ordinary flags do not give (Noah), so a brief write pause or a routing token is used instead.
- "Zero downtime" in these accounts usually means seconds of rejected or retried writes at the switch, and in Notion's and LinkedIn's cases a deliberate short window.
- The honest summary for the article: flags and ramps govern which copy is read and whether the second write happens; they do not remove the need for the expanded schema, the backfill, the verification loop, or a reverse sync if rollback after cutover is required.

### Gaps

- I did not find a published postmortem of a dual-write migration that was abandoned or rolled back at a large company; the failure evidence is near-misses and tool-level incidents.
- No source quantifies the storage or infrastructure cost of holding two copies.
- No published mismatch counts from Stripe, Notion, Slack, Discord or Uber.
