# Does Delta Lake support the data equivalents of progressive delivery that Iceberg supports? (open-source Delta up to 4.4.1, and Databricks-only features, as of November 2026)

Scope: this note answers the author's question "does Delta Lake support this too?" for the two data cases in the article: (1) two versions of a table or column side by side, and (2) an upstream change carried through about ten derived tables into a feature store and two models served as an experiment. It complements `analytical_pipeline_changes.md`, which already covers Iceberg WAP, branches and tags, Delta shallow clone, time travel and RESTORE at a basic level. Those findings are not repeated here except where Delta needs a direct comparison. Feature-store binding in general is in `feature_stores_and_versions.md`.

Every statement says whether it applies to open-source Delta Lake (OSS Delta, delta.io and github.com/delta-io/delta) or to Databricks only (Databricks Runtime, DBR, and Unity Catalog, UC). Latest OSS release checked: Delta Lake v4.4.1, published 5 Oct 2026 (GitHub releases API, FULL-TEXT).

Source-status legend:

- FULL-TEXT: the raw page or file was fetched with curl or the GitHub API, converted to text, and read. Short quotations (under 25 words) come only from these.
- TOOL-EXTRACT: read through a summarizing fetch tool. Paraphrased, never quoted.
- SNIPPET: only a search-result summary was seen. Treat as unverified.
- VENDOR: vendor documentation or a vendor blog. All docs.databricks.com and databricks.com material is VENDOR. lakeFS material is VENDOR (Treeverse).

Pages fetched on 11 Nov 2026. Databricks docs are the AWS edition (`docs.databricks.com/aws/en/...`).

---

## 1. Write-audit-publish on Delta: is there a native equivalent of Iceberg's WAP?

### Takeaway

Open-source Delta has no native WAP. As of v4.4.1 the Delta protocol has no branches, no named tags, and no staged-then-published snapshot that a user can audit and then publish. The only such proposals are two community protocol RFCs opened in August 2026 (table branching with WAP, and multi-table transactions), both still open and not accepted. Delta does have the building blocks:

- shallow clone (OSS since 2.3);
- CHECK and NOT NULL constraints (CHECK since 0.8) that block bad rows at write time;
- `replaceWhere` atomic overwrites;
- MERGE.

So WAP on OSS Delta is a hand-built pattern: write to a staging table or shallow clone, audit it, then copy the result into production with MERGE, INSERT, `replaceWhere` or a table replace. Unlike Iceberg's `fast_forward`, the publish rewrites or re-commits data. It does not move a pointer.

On Databricks, three more things exist:

- Lakeflow (formerly Delta Live Tables) expectations with warn, drop or fail actions, which act as row-level gates inside a pipeline;
- data quality monitoring (formerly Lakehouse Monitoring), which observes after the commit and is not a gate;
- multi-statement, multi-table transactions (GA 22 July 2026, Delta only), which make a multi-table publish step atomic.

None of these is a branch.

### Cited Findings

- The Delta protocol has no branch or tag concept. In PROTOCOL.md (master, fetched Nov 2026), the only "tags" are per-file and per-checkpoint metadata maps (the `tags` field on add/remove/CDC actions and checkpoint metadata). They are not named table versions. There is no section on branches, references or WAP. The table of contents runs from Delta Table Specification through Catalog-managed tables, Iceberg Compatibility, Row Tracking, VACUUM Protocol Check, Clustered Table and Variant. — Delta Lake project, "Delta Transaction Log Protocol", PROTOCOL.md, [raw file](https://raw.githubusercontent.com/delta-io/delta/master/PROTOCOL.md). Locator: table of contents and `tags` fields. FULL-TEXT. Limit: absence of evidence in one spec version. OSS Delta.
- Catalog-managed tables contain a "staged commit", but it is internal plumbing, not a user-facing WAP step. With the `catalogManaged` feature, a client writes a proposed commit to `_delta_log/_staged_commits/<version>.<uuid>.json`. It counts only once the catalog "ratifies" it. The spec says "The catalog is the source of truth around which staged commits are ratified". Ratification happens as part of the commit, and the spec defines no user step to audit a staged commit before ratifying it. It also says "Filesystem-based access to catalog-managed tables is not supported." — same PROTOCOL.md, section "Catalog-managed tables" / "Terminology: Commits". FULL-TEXT. OSS Delta protocol; the catalog that ratifies is in practice Unity Catalog.
- Timeline of catalog-managed / coordinated commits in OSS Delta (GitHub release notes, FULL-TEXT via GitHub API):
  - v4.0.0rc1 (13 Jun 2024, pre-release) announced "Coordinated Commits" as a writer table feature.
  - The earlier RFC "Managed Commits" (issue #2598, proposed 2023-02-14) was rejected on 2025-04-07 according to the RFC index, and catalog-managed tables replaced it. Its motivation listed "No clear path to transactions that could span multiple tables". — [protocol_rfcs/README.md](https://github.com/delta-io/delta/blob/master/protocol_rfcs/README.md) and [rejected/managed-commits.md](https://github.com/delta-io/delta/blob/master/protocol_rfcs/rejected/managed-commits.md). FULL-TEXT.
  - v4.0.0 (9 Jun 2025): "Preview support for catalog-managed tables" (feature name `catalogOwned-preview`). The notes warn it "should not be enabled for production tables".
  - v4.0.1 (16 Jan 2026): the feature was renamed to `catalogManaged`.
  - v4.1.0 (26 Feb 2026): Kernel gets "Full support" for catalog-managed tables, while the Spark notes still say "Catalog managed table enhancements (preview)". Manual VACUUM is blocked on catalog-managed tables.
  - v4.2.0 (16 Apr 2026): REPLACE TABLE / RTAS / dynamic partition overwrite support for UC managed tables, labelled experimental.
  - v4.3.0 (18 Jun 2026): Delta Spark uses the UC Delta REST API by default for UC-managed tables.
  - v4.4.0 (20 Aug 2026): UC Delta API integration.
  - v4.4.1 (5 Oct 2026): "Safer maintenance for catalog-managed tables".

  — [delta-io/delta releases](https://github.com/delta-io/delta/releases). FULL-TEXT. OSS Delta. Limit: none of these releases adds branches, tags or a multi-table transaction API.
- Native branching/WAP and multi-table transactions exist only as open RFC proposals in OSS Delta:
  - Issue #7439 / PR #7440, "[PROTOCOL RFC] Table Branching & Write-Audit-Publish", opened 12 Aug 2026 by GitHub user santhoshravindran7 (affiliation not stated). It proposes a writer feature `tableBranching` with zero-copy branches under `_delta_log/_branches/<branchId>/`, audit on the branch snapshot, and atomic publish by replaying branch actions onto main with conflict detection. Its motivation says WAP and zero-copy branches "have no first-class Delta support today" and WAP is "emulated with staging tables, partition swaps, or `dataChange=false` tricks".
  - A Databricks-affiliated reviewer (kamcheungting-db, 21 Sep 2026) raised a conflict with row tracking.
  - Issue #7437 / PR #7438, "[PROTOCOL RFC] Multi-Table Transactions", opened the same day by the same author. It proposes `multiTableTransaction` on top of `catalogManaged`, with "group-ratify" by the catalog.
  - Both are open, not accepted. Under the RFC process, experimental code would use `-dev` feature names behind a flag.

  — [delta-io/delta #7439](https://github.com/delta-io/delta/issues/7439), [#7437](https://github.com/delta-io/delta/issues/7437) (FULL-TEXT via GitHub API). Status: proposal only. Do not describe as a Delta feature.
- Documented OSS WAP-like pattern: shallow clone, then validate, then MERGE back. The OSS docs' "Short-term experiments on a production table" example:
  1. `CREATE OR REPLACE TABLE my_test SHALLOW CLONE my_prod_table`;
  2. run updates on the clone, with the comment "Run a bunch of validations. Once happy:";
  3. `MERGE INTO my_prod_table USING my_test ...`;
  4. `DROP TABLE my_test`.

  Shallow clone arrived in OSS Delta 2.3 ("It is available from Delta Lake 2.3 and above"). The docs also say "Any changes made to shallow clones affect only the clones themselves and not the source table". A cloned table has its own history starting at version 0. — Delta Lake docs, "Table utility commands", [docs.delta.io/latest/delta-utility.html](https://docs.delta.io/latest/delta-utility.html), sections "Shallow clone a Delta table" and "Clone use cases". FULL-TEXT. OSS Delta. Limit: the publish is a hand-written MERGE specific to the change, and OSS has no DEEP CLONE (the page never mentions it).
- Practitioner verdicts (vendor, lakeFS):
  - Robin Moffatt: "so far as I can tell, you can't do WAP with Delta Lake". He rates the shallow-clone route "Fiddly, to say the least" because you "roll your own Publish logic". — lakeFS blog, "How to Implement Write-Audit-Publish (WAP)", published 31 May 2023, modified 10 Jan 2025, [lakefs.io](https://lakefs.io/blog/how-to-implement-write-audit-publish/). FULL-TEXT, VENDOR (competitor of Databricks for this use).
  - A 2024 lakeFS post repeats "Delta Lake doesn't support WAP". — [lakefs.io/blog/what-is-write-audit-publish](https://lakefs.io/blog/what-is-write-audit-publish) (19 Aug 2024). FULL-TEXT, VENDOR.
  - Correction: both posts say shallow clone is "Databricks Runtime (DBR)" only. That was out of date when written, since OSS Delta added shallow clone in 2.3 (April 2023).
- First-hand user account of the friction (GitHub discussion #4135, "How to efficiently implement WAP (Write-Audit-Publish) with Delta?", user dfustes, 8 Feb 2025):
  - The team keeps a "public" replica that it merges into after DQ checks and calls this "not very efficient".
  - Shallow clone + merge is "still not very fast".
  - Downstream consumers read the public tables incrementally with Change Data Feed, "which would not be supported if they consume the cloned tables".
  - The team considered hand-copying `_delta_log` entries.
  - The discussion had no replies when fetched.

  — [delta-io/delta discussion #4135](https://github.com/delta-io/delta/discussions/4135) (FULL-TEXT via GitHub GraphQL API). Organization not named.
- Constraints as an in-write audit (OSS). Delta supports `NOT NULL` and `CHECK` constraints. A violating write raises `InvariantViolationException`, so "the new data can't be added". `ALTER TABLE ADD CONSTRAINT` checks existing rows first, and adding a constraint upgrades the writer protocol. CHECK constraints shipped in OSS Delta 0.8.0 (Feb 2021, release notes). — [docs.delta.io/latest/delta-constraints.html](https://docs.delta.io/latest/delta-constraints.html) (FULL-TEXT); [v0.8.0 release](https://github.com/delta-io/delta/releases/tag/v0.8.0) (FULL-TEXT). Limit: row-level predicates only. They cannot express aggregate or distribution checks such as row-count drops or null-rate spikes, which was the Netflix example.
- `replaceWhere` atomic overwrite (OSS) is the usual partition- or predicate-scoped publish step. It "atomically overwrites the rows that match a predicate". It is available for DataFrames from Delta 1.1.0 and in SQL from 2.4.0. By default it validates that written data matches the predicate. — [docs.delta.io/latest/delta-batch.html](https://docs.delta.io/latest/delta-batch.html), "Overwrite rows matching a predicate with replaceWhere". FULL-TEXT. OSS Delta.
- Databricks-only gate: pipeline expectations.
  - Actions: `warn` (default), `drop` (`EXPECT ... ON VIOLATION DROP ROW`, `dp.expect_or_drop`) and `fail` (`EXPECT ... ON VIOLATION FAIL UPDATE`, `dp.expect_or_fail`), where "Invalid records prevent the update from succeeding."
  - The docs point to a separate quarantine pattern.
  - Expectations apply to materialized views, streaming tables and views in Lakeflow pipelines (the Python module is now `dp`, Spark Declarative Pipelines; the product was formerly Delta Live Tables).

  — Databricks, "Manage data quality with pipeline expectations", [docs.databricks.com/aws/en/ldp/expectations](https://docs.databricks.com/aws/en/ldp/expectations). FULL-TEXT, VENDOR. Databricks-only (the open-source Spark Declarative Pipelines in Apache Spark was not checked for expectation support). Limit: per-record SQL predicates. `fail` stops the whole update, but each table in the pipeline is still published by its own commit, so this is not a multi-table WAP.
- Databricks-only monitoring is observation after the commit, not a pre-publish gate. "Data profiling was formerly known as Lakehouse Monitoring." Anomaly detection judges freshness from commit history and completeness from expected row counts over the last 24 hours, and marks tables stale or incomplete. — Databricks, "Data quality monitoring", [docs.databricks.com/aws/en/data-quality-monitoring/](https://docs.databricks.com/aws/en/data-quality-monitoring/). FULL-TEXT, VENDOR.
- Databricks-only atomic publish: multi-statement, multi-table transactions. Details are in section 2. In short:
  - `BEGIN ATOMIC ... END;` or `BEGIN TRANSACTION; ... COMMIT;` over UC managed tables with catalog commits enabled.
  - Supported statements: SELECT, VALUES, INSERT (all variants), UPDATE, COPY INTO, DELETE, MERGE INTO, EXECUTE IMMEDIATE, DESCRIBE TABLE and SHOW COLUMNS.
  - DDL is not supported, and neither is time travel.
  - `SIGNAL` raises an error and rolls the transaction back, so audit checks can sit inside the transaction.

  — Databricks, "Transactions", [docs.databricks.com/aws/en/transactions/](https://docs.databricks.com/aws/en/transactions/) (last updated 19 Oct 2026). FULL-TEXT, VENDOR.

### Inferences

- On OSS Delta, "WAP" means staging table or shallow clone, then audit, then a copy-style publish (MERGE, INSERT, `replaceWhere`, or `CREATE OR REPLACE TABLE ... AS SELECT`). The publish costs compute in proportion to the data changed, where Iceberg's metadata-only `fast_forward` costs almost nothing. The publish commit is also an ordinary data change, so downstream CDF and streaming readers see it as new data (good for propagation). Rolling it back means another RESTORE commit.
- On Databricks the strongest WAP is: write each of the N new tables to staging tables (or UC shallow clones), audit them with queries or expectations, then publish all N production tables in one `BEGIN ATOMIC` block of `INSERT OVERWRITE`/`MERGE` statements, with a `SIGNAL` if a final check fails. This gives an atomic, gated, multi-table publish. It is still a data copy, not a branch merge.
- `CREATE OR REPLACE TABLE prod SHALLOW CLONE staging` as a swap is a poor publish step:
  - In UC, `CREATE OR REPLACE` cannot overwrite an existing shallow clone (Databricks docs).
  - DDL cannot run inside a transaction.
  - Catalog commits cannot be enabled or disabled through `CREATE OR REPLACE` / `REPLACE TABLE` (section 2).

### Gaps

- I found no Delta or Databricks documentation page that uses the phrase "write-audit-publish". No official Databricks WAP guide was found. A Databricks community-forum answer describing a staging-schema approach was seen only as a SNIPPET ([community thread](https://community.databricks.com/t5/data-engineering/wap-pattern-unity-catalog/td-p/103587)) and is not relied on.
- Whether the open-source Spark Declarative Pipelines (Apache Spark 4.1) include expectations was not checked.

---

## 2. Branching and isolation for a whole pipeline (ten related tables)

### Takeaway

There is no Delta-native way, in OSS or on Databricks, to branch ten tables together and later merge the branch.

- Third-party branching for Delta exists through lakeFS. Its docs say ACID operations "can span across multiple Delta tables" via commit and merge of a repository branch, but lakeFS supports only "a single writer" per Delta table and works through object paths. That conflicts with catalog-managed tables, which forbid filesystem-based access.
- Project Nessie removed its Delta Lake integration in June 2023 (Nessie 0.62.0).
- The Databricks-native answer is isolation plus an atomic publish: separate UC catalogs or schemas, UC shallow clones for a cheap v2 copy, then a multi-table transaction (GA on Databricks since 22 July 2026 for managed Delta tables; up to 100 tables) to publish the ten tables together.
- OSS Delta has no multi-table transaction API. The protocol RFC is open.

### Cited Findings

- Databricks multi-table transactions: status, verified in the release notes.
  - Blog announcement, 4 Mar 2026: "multi-statement, multi-table transactions are available in Public Preview". Iceberg tables were in Private Preview. — Databricks blog, "Transactions in the open lakehouse...", [databricks.com/blog](https://www.databricks.com/blog/transactions-open-lakehouse-unlock-mission-critical-warehousing-workloads) (datePublished 2026-03-04). FULL-TEXT, VENDOR. Quotes from Fivetran's CPO (vendor customer testimonial).
  - Release note, 9 Mar 2026: "Multi-table transactions are now in Public Preview" (`BEGIN ATOMIC ... END;`). — [Databricks release notes, March 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/march). FULL-TEXT, VENDOR.
  - Release note, 8 May 2026: "Catalog commits are now generally available." The note says catalog commits "unlock new features such as multi-statement, multi-table transactions". — [May 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/may). FULL-TEXT, VENDOR.
  - Release note, 22 Jul 2026: "Transactions that write to Unity Catalog managed Delta tables are now generally available." Both `BEGIN ATOMIC` and `BEGIN TRANSACTION; ... COMMIT;` are covered. "Transactions that write to Unity Catalog managed Iceberg tables remain in Private Preview." — [July 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/july). FULL-TEXT, VENDOR.
  - Conflict: a Microsoft Tech Community post (SNIPPET only) claims Azure Databricks GA on 16 Oct 2026. It was not verified, and the official AWS release notes say 22 Jul 2026. Azure dates may differ.
  - A DAIS 2024 session PDF titled "Towards Multi-statement txns" exists on microsites.databricks.com. Its text was extracted but not relied on. It shows the feature was being discussed in June 2024.
- Databricks transactions: requirements and limits ([Transactions](https://docs.databricks.com/aws/en/transactions/), FULL-TEXT, VENDOR):
  - Every table written must be a UC managed table (Delta or Iceberg) "that have the catalogManaged table feature enabled".
  - Compute: non-interactive transactions run on SQL warehouses, serverless, or DBR 18.0+; interactive transactions run on SQL warehouses only.
  - "DDL operations not supported" (CREATE, ALTER, DROP TABLE must run outside), and "You cannot use time travel within a transaction."
  - "A transaction can read from or write to up to 100 tables combined" and up to 100 views, with up to 100 intermediate commits per table.
  - Repeatable-read snapshot at first access and optimistic concurrency. Non-interactive transactions get row-level conflict detection; interactive ones are table-level.
  - Each committed transaction is one entry in each table's Delta log.
  - Lineage events "persist even if the transaction is rolled back."
  - Auto-rollback after 48 hours total; interactive transactions also roll back after 10 minutes idle.
- Catalog commits (Databricks): prerequisites and caveats ([Catalog commits](https://docs.databricks.com/aws/en/tables/features/catalog-commits), FULL-TEXT, VENDOR):
  - Enable with `TBLPROPERTIES ('delta.feature.catalogManaged' = 'supported')`.
  - DBR 16.4+ is needed to read or write such tables, and DBR 18.0+ to enable or disable on existing tables.
  - "You cannot turn on or turn off catalog commits on existing managed tables using CREATE OR REPLACE TABLE or REPLACE TABLE."
  - Interrupting an upgrade or downgrade can lock the table.
  - The page notes that all UC managed tables will be upgraded to catalog commits after DBR 15.4 LTS reaches end of support.
- OSS Delta: no multi-table transaction. The only route is the open RFC #7437 (section 1). The rejected Managed Commits RFC and the accepted catalog-managed RFC both name cross-table transactions as a motivation. Neither delivers them. — [protocol_rfcs](https://github.com/delta-io/delta/tree/master/protocol_rfcs) (FULL-TEXT).
- lakeFS with Delta (vendor docs, current version) ([lakeFS docs, "Delta Lake"](https://docs.lakefs.io/integrations/delta/), FULL-TEXT, VENDOR):
  - Claims: "ACID operations can span across multiple Delta tables"; CI/CD hooks can "validate Delta table contents, schema, or even referential integrity"; zero-copy branching.
  - Mechanism: lakeFS versions objects. A Delta write appears as new data files plus new `_delta_log` objects under `s3a://<repo>/<branch>/path`.
  - Limits stated in the doc:
    - "lakeFS currently supports a single writer for Delta Lake tables". Multiple writers cause merge conflicts across branches or concurrent file overwrites on one branch, because lakeFS "lacks its own implementation for a LogStore".
    - The recommended workflow is a branch per change, then merge, then retry on conflict.
    - VACUUM must be followed by lakeFS garbage collection.
    - Unity Catalog access is through a read-only "Data Catalog Export".
- lakeFS rollback across collections: `lakectl branch revert` and HEAD reset are already cited in `analytical_pipeline_changes.md` §6 ([lakeFS rollback](https://docs.lakefs.io/guides/rollback/), TOOL-EXTRACT, VENDOR).
- Project Nessie dropped Delta: PR #7108 "Remove code for and mentions of Delta Lake" (merged 23 Jun 2023, author snazy) says "The current integration is already way too old, so it will not work against the current state of Delta Lake." It shipped in Nessie 0.62.0 (23 Jun 2023), whose release notes list it. — [projectnessie/nessie PR #7108](https://github.com/projectnessie/nessie/pull/7108); [nessie-0.62.0 release](https://github.com/projectnessie/nessie/releases/tag/nessie-0.62.0) (FULL-TEXT via GitHub API). Nessie's Delta support had depended on a patched Delta build (SNIPPET, fork README, not verified).
- Unity Catalog shallow clones (Databricks-only) give a cheap isolated v2 copy with separate permissions ([Shallow clone for Unity Catalog tables](https://docs.databricks.com/aws/en/delta/clone-unity-catalog), FULL-TEXT, VENDOR):
  - Managed-table clones need DBR 13.3 LTS+ and external-table clones DBR 14.3 LTS+.
  - Managed tables clone only to managed, and external only to external.
  - Delta only, not Iceberg.
  - The clone owner sets access "independently of the source table".
- Databricks deep clone (Databricks-only; the OSS docs do not offer it) copies data and metadata. It can be synced incrementally, and streaming tables and materialized views cannot be cloned. — [Clone a table](https://docs.databricks.com/aws/en/delta/clone), FULL-TEXT, VENDOR.
- Sharing (Databricks): transactions can involve shared assets, and the docs now call the protocol "OpenSharing". A provider must share a table "WITH HISTORY" for recipients to run transactions on it. — [Transactions](https://docs.databricks.com/aws/en/transactions/), FULL-TEXT, VENDOR. I did not verify when Delta Sharing was renamed.

### Inferences

- For the ten-table case on Databricks, the closest thing to a branch is:
  1. a `v2` schema (or catalog) holding new tables or UC shallow clones of the current ones;
  2. building the v2 pipeline there, reading production inputs;
  3. auditing;
  4. one `BEGIN ATOMIC` that rewrites the ten production tables from the v2 tables.

  Consumers of the production names see all ten change at one commit point. This matches Iceberg-plus-REST-catalog multi-table commit for atomicity, but not for cost (data copy, not pointer move) or reversibility (no branch to discard; rollback is per-table RESTORE, which cannot run inside a transaction).
- lakeFS is the only documented way to get real branch-and-merge across many Delta tables. It works on path-based Delta tables. Because PROTOCOL.md forbids filesystem-based access to catalog-managed tables, lakeFS cannot coexist with catalog-managed tables, which the Databricks transactions require. A team must choose between lakeFS branching and Databricks multi-table transactions for the same tables. This is my inference. No source states the incompatibility directly.
- Using separate UC catalogs or schemas per environment is standard UC practice, but I did not fetch a page documenting it for this note.

### Gaps

- No named non-vendor organization was found describing lakeFS-on-Delta multi-table publishes in production.
- Whether Databricks transactions can mix `MERGE` into a table with deletion vectors, liquid clustering and CDF enabled at scale was not explored beyond the documented limits.
- The OSS Unity Catalog server's support for catalog-managed commits (needed for any OSS route to multi-table atomicity) was not verified beyond Delta 4.3's note that Delta Spark uses the UC Delta REST API from unitycatalog `branch-0.5`.

---

## 3. Two versions of a table or column side by side: schema evolution, column mapping, type widening, views

### Takeaway

Delta can evolve one table's schema in place without rewriting data:

- `mergeSchema` adds columns;
- column mapping allows RENAME and DROP COLUMN (OSS 1.2 and 2.0);
- type widening allows ALTER COLUMN TYPE to a wider type (OSS 3.2 preview, 4.0 GA; DBR 15.4 LTS+).

All of these change the single current schema. None lets a v1 and a v2 schema coexist for different consumers. Coexistence still requires a second table (`_v2`) or views that present v1 and v2 shapes over one table.

Several of these features also break readers:

- column mapping and type widening are irreversible-by-default protocol upgrades, readable only by newer clients;
- column mapping requires schema tracking for streaming reads after a rename or drop;
- on Databricks, any schema update terminates streams reading the table;
- `overwriteSchema` rewrites the table and breaks everything downstream at once.

### Cited Findings

- Additive evolution (OSS): set `mergeSchema` per write, or use `WITH SCHEMA EVOLUTION` / `.withSchemaEvolution()`. The docs advise against enabling evolution session-wide. Changing a column's type or name, or dropping a column, "by rewriting the table" uses `overwriteSchema`, which replaces "the schema and partitioning of the table". — [docs.delta.io delta-batch](https://docs.delta.io/latest/delta-batch.html), "Change column type or name" and "Replace table schema". FULL-TEXT. OSS Delta.
- Column mapping (OSS):
  - RENAME COLUMN shipped in 1.2.0 ("column renaming ... without the need to rewrite the underlying Parquet data files") and DROP COLUMN as a metadata-only operation in 2.0.0 (release notes).
  - The docs page still says "This feature is currently experimental with known limitations."
  - "This protocol upgrade is irreversible. Tables with column mapping enabled can only be read in Delta Lake 1.2 and above." It requires reader version 2+ and writer version 5+.
  - Setting mode back to `none` errors.
  - Streaming: reads were blocked in 2.1 and below. In 2.2+, reads are blocked after a rename or drop. In 3.0+, streaming reads after a rename or drop require `schemaTrackingLocation`.
  - CDF limits: batch CDF reads across a non-additive change "still fail if the version range specified spans a non-additive schema change" (2.3+), and streaming CDF needs schema tracking (3.0+).

  — [docs.delta.io column mapping](https://docs.delta.io/latest/delta-column-mapping.html); [docs.delta.io CDF](https://docs.delta.io/latest/delta-change-data-feed.html); [v1.2.0](https://github.com/delta-io/delta/releases/tag/v1.2.0), [v2.0.0](https://github.com/delta-io/delta/releases/tag/v2.0.0) release notes. FULL-TEXT. OSS Delta.
  - Protocol: readers must resolve columns by physical name or field id. — PROTOCOL.md "Column Mapping" (FULL-TEXT).
- Column mapping on Databricks: reading needs DBR 10.4 LTS+. In DBR 15.4 LTS+, `DROP FEATURE` can remove column mapping and downgrade the protocol for older readers. — [Databricks column mapping](https://docs.databricks.com/aws/en/delta/column-mapping), FULL-TEXT, VENDOR. Databricks-specific. I did not verify whether OSS Delta 4.x can drop the columnMapping feature.
- Type widening (OSS):
  - "available in preview in Delta Lake 3.2 and above, and fully supported in Delta Lake 4.0 and above."
  - Enabled with `delta.enableTypeWidening = true`. Then `ALTER TABLE ... ALTER COLUMN ... TYPE ...` updates the schema "without rewriting the underlying Parquet files", and schema evolution can widen types automatically on write.
  - Enabling it in 3.3+ adds the reader/writer feature `typeWidening`, so "You must use Delta Lake 3.3 or above to read and write". In 3.2 it adds `typeWidening-preview`.
  - Disabling the property does not remove the feature. Removing it is a separate drop-feature operation.
  - Integer to decimal/double changes must be applied manually.

  — [docs.delta.io type widening](https://docs.delta.io/latest/delta-type-widening.html); [v3.2.0](https://github.com/delta-io/delta/releases/tag/v3.2.0), [v4.0.0](https://github.com/delta-io/delta/releases/tag/v4.0.0) notes ("no longer in preview"). FULL-TEXT. OSS Delta.
- Type widening on Databricks:
  - DBR 15.4 LTS+, and only DBR 15.4 LTS+ can read such tables.
  - For pipeline readers on DBR 14.3 and below, either turn off type widening and do a full refresh, or enable "Compatibility Mode".
  - Dropping the feature rewrites non-conforming files.
  - Structured Streaming support needs DBR 16.4 LTS+. A schema tracking location is required up to DBR 18.0 and optional from 18.1.

  — [Databricks type widening](https://docs.databricks.com/aws/en/delta/type-widening), FULL-TEXT, VENDOR.
- Databricks: "Updating a table schema terminates any streams reading from that table." — [Databricks, Update table schema](https://docs.databricks.com/aws/en/delta/update-schema), FULL-TEXT, VENDOR.
- Generated columns (OSS): values are computed from other columns on write, are stored physically, and raise the writer protocol. They help derive a v2 representation (for example a date from a timestamp) in the same table. — [docs.delta.io delta-batch](https://docs.delta.io/latest/delta-batch.html), "Use generated columns". FULL-TEXT. OSS Delta.
- Views (OSS docs): Delta supports views. "If you alter a Delta table schema, you must recreate derivative views to account for any additions to the schema." — same page, "Views on tables". FULL-TEXT. On Databricks a "simple SELECT view" can serve as a feature table (section 6).
- Iceberg comparison: Iceberg "guarantees that schema evolution changes are independent and free of side-effects, without rewriting files", using unique column IDs. Branches can also hold a different schema state. — [Iceberg evolution](https://iceberg.apache.org/docs/latest/evolution/) (FULL-TEXT). Branch schema behaviour is not detailed here.

### Inferences

- Coexistence options on Delta, ordered from safest to most disruptive for consumers:
  1. Additive column (`mergeSchema`) carrying the v2 value next to the v1 column. Old readers ignore the new column. This is expand/contract inside one table.
  2. Views `t_v1` and `t_v2` over one physical table, which give versioned interfaces without duplicate storage.
  3. A separate `t_v2` table built in parallel (shallow clone plus backfill, or a new pipeline), with consumers moved one by one.
  4. In-place rename, drop or type widening, which is cheap but changes the single schema for all readers. It also upgrades the protocol (older Delta clients, older DBR, and some third-party engines can no longer read the table) and disrupts streams.
  5. `overwriteSchema`, a full rewrite and a hard cut-over.
- Only options 1 to 3 let v1 and v2 coexist. Options 4 and 5 are "big bang" changes in the article's terms.

### Gaps

- I did not test which third-party engines (Trino, Athena, Snowflake external tables, BigQuery) read column-mapping or type-widening tables. Reader compatibility outside Delta and DBR is not documented on the pages fetched.

---

## 4. Rollback: RESTORE, time travel, retention, and failure modes, compared with Iceberg

### Takeaway

Delta rollback is `RESTORE TABLE ... TO VERSION AS OF` / `TIMESTAMP AS OF` (OSS since 1.2.0). It writes a new data-changing commit; it does not move a pointer. That is why it re-emits restored files to streaming readers. It fails if VACUUM has removed the target version's files.

Iceberg `rollback_to_snapshot` / `set_current_snapshot` move the current-snapshot reference instead, and branches and tags can pin snapshots against expiry.

Default rollback windows:

- Delta: 7 days of data files (`delta.deletedFileRetentionDuration`) and 30 days of log (`delta.logRetentionDuration`). On Databricks, DBR 18.0+ (and UC managed tables from DBR 12.2 LTS) block time travel beyond `deletedFileRetentionDuration`. With predictive optimization, VACUUM runs automatically.
- Iceberg: snapshot expiry defaults to 5 days (`history.expire.max-snapshot-age-ms`), but only when `expire_snapshots` runs. Tags and branches can retain specific snapshots longer.

### Cited Findings

- OSS RESTORE ([docs.delta.io utility](https://docs.delta.io/latest/delta-utility.html), "Restore a Delta table to an earlier state", FULL-TEXT, OSS):
  - It accepts a version or a timestamp, and "You can restore an already restored table."
  - Restoring to a version whose data files were removed "manually or by vacuum will fail".
  - "Restore is considered a data-changing operation". Its log entries carry `dataChange = true`, and for a streaming reader "these files will be considered as newly added data and will be processed again."
  - RESTORE shipped in OSS 1.2.0 ([release notes](https://github.com/delta-io/delta/releases/tag/v1.2.0), FULL-TEXT).
- Databricks RESTORE adds one escape hatch: restoring "partially is still possible if `spark.sql.files.ignoreMissingFiles` is set to true". It repeats the duplicate-data warning for downstream streams. — [Databricks, Work with table history](https://docs.databricks.com/aws/en/delta/history), FULL-TEXT, VENDOR.
- Retention, OSS:
  - "By default you can time travel to a Delta table up to 30 days old". `delta.logRetentionDuration` defaults to 30 days and `delta.deletedFileRetentionDuration` to 7 days.
  - VACUUM's default threshold is 7 days, and "vacuum is not triggered automatically".
  - Log cleanup can also make some versions unreachable even within the window, because checkpoints are needed.

  — [delta-batch "time travel" / "Data retention"](https://docs.delta.io/latest/delta-batch.html); [delta-utility "vacuum"](https://docs.delta.io/latest/delta-utility.html). FULL-TEXT. OSS.
- Retention, Databricks:
  - "In Databricks Runtime 18.0 and above, time travel queries are blocked" beyond `deletedFileRetentionDuration` (default 7 days). For UC managed tables this applies from DBR 12.2 LTS.
  - In DBR 18.0+, `logRetentionDuration` must be at least `deletedFileRetentionDuration`.
  - The docs say not to use table history for archiving and to rely on only the past 7 days unless both retention settings are raised.
  - "If predictive optimization is enabled, Databricks automatically triggers the VACUUM operation".

  — [Databricks table history](https://docs.databricks.com/aws/en/delta/history); [VACUUM](https://docs.databricks.com/aws/en/sql/language-manual/delta-vacuum). FULL-TEXT, VENDOR. I did not verify whether predictive optimization is on by default for a given account.
- Catalog-managed tables (OSS 4.1.0+): "Manual execution of `VACUUM` is blocked for catalog-managed tables", and lifecycle is managed through the catalog. 4.4.1 extends the safeguards. — [v4.1.0](https://github.com/delta-io/delta/releases/tag/v4.1.0), [v4.4.1](https://github.com/delta-io/delta/releases/tag/v4.4.1) notes (FULL-TEXT).
- Shallow clone failure modes:
  - OSS and non-UC Databricks: VACUUM on the source breaks the clone with `FileNotFoundException`. The fix is to re-clone with replace. — [docs.delta.io utility](https://docs.delta.io/latest/delta-utility.html); [Databricks clone](https://docs.databricks.com/aws/en/delta/clone). FULL-TEXT.
  - UC (Databricks-only): "Running VACUUM on the source of a shallow clone doesn't break the cloned table", because UC tracks clone references.
  - Dropping a UC base table leaves clones readable until the files are purged after the UNDROP window (default 7 days, configurable 0 or 7 to 30 days; configuring it is in Public Preview).
  - `DROP TABLE ... FORCE` on a protected base table breaks the clones.

  — [UC shallow clone](https://docs.databricks.com/aws/en/delta/clone-unity-catalog), FULL-TEXT, VENDOR.
- Iceberg comparison ([Iceberg Spark procedures](https://iceberg.apache.org/docs/latest/spark-procedures/), [configuration](https://iceberg.apache.org/docs/latest/configuration/), [branching](https://iceberg.apache.org/docs/latest/branching/); FULL-TEXT):
  - `rollback_to_snapshot`, `rollback_to_timestamp` and `set_current_snapshot` (which can also target a ref) change the current snapshot.
  - `cherrypick_snapshot` handles only append and dynamic-overwrite snapshots.
  - `expire_snapshots` "will never remove files which are still required by a non-expired snapshot".
  - Defaults: `history.expire.max-snapshot-age-ms` is 432000000 (5 days) and `min-snapshots-to-keep` is 1.
  - Branches and tags have their own max-ref-age and retention.

### Inferences

- Rollback works per table in both formats. Iceberg's is a metadata pointer move. Delta's is a new commit that streams treat as new data. For the article: "Delta can roll a table back, but the rollback is itself a change that propagates downstream."
- Delta has no named tags, so pinning a "known good" version past the 7-day file window needs either raised retention on the whole table or a clone. The OSS docs' ML-reproducibility example uses `SHALLOW CLONE ... VERSION AS OF 15`, which still depends on source files unless the clone lives in UC or is a deep clone. Iceberg tags do this natively.

### Gaps

- I did not verify whether RESTORE writes CDF records (`_change_data` files) for the rows it re-adds or removes, or whether CDF readers see a RESTORE as inserts and deletes. Neither CDF page fetched states it.

---

## 5. Change Data Feed and streaming consumers when an upstream table changes, is restored, or is replaced

### Takeaway

Delta CDF (OSS 2.0.0+, `delta.enableChangeDataFeed = true`) records row-level `insert`, `update_preimage`, `update_postimage` and `delete` events with each commit. That is how a change propagates incrementally through derived tables. CDF is bounded by the same VACUUM retention.

Plain Delta streaming sources accept only appends. Any UPDATE, MERGE, DELETE or OVERWRITE upstream makes the stream throw unless it uses `skipChangeCommits` (which drops those changes) or the deprecated `ignoreChanges` (which emits duplicates). A RESTORE re-emits data. Schema changes stop streams on Databricks and need schema tracking on column-mapping tables.

For the ten-table chain, an upstream v2 rewrite or a rollback therefore reaches downstream either as a CDF delta that each derived table must apply with MERGE, or as a break that needs a stream restart or full backfill.

Iceberg is similar for streaming: overwrite snapshots throw by default. It offers a `create_changelog_view` procedure rather than a persisted change feed.

### Cited Findings

- CDF (OSS) ([docs.delta.io CDF](https://docs.delta.io/latest/delta-change-data-feed.html), FULL-TEXT; [v2.0.0 release](https://github.com/delta-io/delta/releases/tag/v2.0.0)):
  - Enabled per table.
  - Change data "will become available at the same time as the new data".
  - `_change_data` files follow table retention, so "if you run the VACUUM command, change data feed data is also deleted".
  - Once enabled, Delta 1.2.1 and below can no longer write the table.
  - The CDF schema is the latest table schema, with the column-mapping caveats in section 3.
- Streaming source behaviour (OSS) ([docs.delta.io streaming](https://docs.delta.io/latest/delta-streaming.html), FULL-TEXT):
  - "Structured Streaming does not handle input that is not an append and throws an exception if any modifications occur on the table being used as a source."
  - The fixes: delete output and checkpoint and restart; `skipChangeCommits` (recommended; "downstream does not see rows from those commits"); `ignoreDeletes` (legacy); or `ignoreChanges` (deprecated; "Unchanged rows may still be emitted").
  - If log retention outruns a lagging stream, Delta "does not fail the stream. This can result in data being dropped."
- RESTORE re-emits restored files to streams (section 4).
- Databricks: schema updates terminate streams (section 3).
- OSS Delta 4.2.0 release note: "Allow CDF Writes for Non-Data-Changing Operations" ([v4.2.0](https://github.com/delta-io/delta/releases/tag/v4.2.0), FULL-TEXT).
- Practitioner friction: consumers reading via CDF lose that ability if the publisher swaps them to a shallow-cloned table (discussion #4135, section 1). A clone has its own history from version 0, so CDF and stream offsets do not carry over (implied by the OSS clone docs; FULL-TEXT).
- Iceberg comparison: "Overwrite snapshots cannot be processed and will cause an exception by default", with skip options `streaming-skip-overwrite-snapshots` and `streaming-skip-delete-snapshots` ([Iceberg Structured Streaming](https://iceberg.apache.org/docs/latest/spark-structured-streaming/), FULL-TEXT). `create_changelog_view` "Creates a view that contains the changes from a given table" ([Spark procedures](https://iceberg.apache.org/docs/latest/spark-procedures/), FULL-TEXT).

### Inferences

- If a v2 upstream is published by MERGE or `INSERT OVERWRITE` (the Delta WAP publish), CDF-based derived tables receive it as normal row changes. That is better than a table swap, which breaks CDF consumers. Append-only streaming consumers fail, or silently skip it under `skipChangeCommits`.
- A RESTORE upstream behaves the same way: CDF and stream consumers see new changes, possibly duplicates, so derived tables must be idempotent (MERGE on keys) or rebuilt.

### Gaps

- I found no Databricks or OSS document that walks through restoring an upstream table and reconciling a chain of CDF-driven downstream tables.

---

## 6. Feature stores on Delta: Databricks Feature Engineering in Unity Catalog

### Takeaway

On Databricks, a feature table is simply a UC Delta table with a primary key (DBR 13.2+). Point-in-time correctness comes from a `timeseries_columns` key and `timestamp_lookup_key` "AS OF" joins, not from Delta time travel. The docs say so explicitly.

Model-to-feature binding is done by `fe.log_model`, which packages the model with the feature lookup spec (table names and feature names). `score_batch` and Model Serving then look features up automatically. The binding is to a table and feature names, not to a Delta table version; I found no `version` parameter documented.

Two models can therefore use different "versions" of features concurrently only if those versions are different tables, different columns, or different views (for example `customer_features_v1` and `customer_features_v2`). Each model is logged against its own lookups and served from its own endpoint or traffic split. Pinning a model to a Delta snapshot of one table is not a documented feature-store capability.

### Cited Findings

- Feature tables in UC are Delta tables: "In Unity Catalog, any Delta table with a primary key constraint can serve as a feature table". The feature-engineering client needs DBR 13.2+. Simple SELECT views over one Delta table can serve as feature tables (`databricks-feature-engineering` 0.7.0+, DBR 16.0 ML), and if source columns are renamed "the columns in the SELECT statement for the view definition must be renamed to match." Deleting a feature table drops the Delta table. — [Databricks, Feature tables in Unity Catalog](https://docs.databricks.com/aws/en/machine-learning/feature-store/uc/feature-tables-uc), FULL-TEXT, VENDOR.
- Point-in-time joins:
  - "The point-in-time functionality in Databricks Feature Store is not related to Delta Lake time travel."
  - A time-series feature table declares `timeseries_columns`, a FeatureLookup gives `timestamp_lookup_key`, and the lookup returns "the latest feature values prior to the timestamps".
  - `lookback_window` (a `timedelta`) excludes stale values.
  - A time-series table must have one timestamp key and no partition columns.
  - MLflow pyfunc batch inference does not support time-series feature tables; use `score_batch`.

  — [Databricks, Point-in-time feature joins](https://docs.databricks.com/aws/en/machine-learning/feature-store/time-series), FULL-TEXT, VENDOR.
- Binding:
  - "You must log the model using the log_model method of FeatureEngineeringClient".
  - The model is then "packaged with feature metadata" and "looks up features from feature tables at inference". Callers can override individual features by passing columns to `score_batch`.
  - Model Serving "will automatically lookup features published to online stores".
  - Lineage from the model to tables and functions is tracked in UC.
  - FeatureLookup takes `table_name`, `feature_names`, and so on. No table-version argument appears on the page.

  — [Databricks, Train models with feature tables](https://docs.databricks.com/aws/en/machine-learning/feature-store/train-models-with-feature-store), FULL-TEXT, VENDOR. Already summarized in `feature_stores_and_versions.md`.

### Inferences

- For the article's "two models served as an experiment": model A, logged against `features_v1`, and model B, logged against `features_v2`, can be served side by side (separate endpoints or a traffic split), and each resolves its own lookups. The ten-table chain must therefore produce v1 and v2 feature tables in parallel for the duration of the experiment. The feature store does not version one table for you.
- Because point-in-time joins are by event timestamp, a v2 feature table needs its history backfilled under v2 logic before model B can be trained.

### Gaps

- I did not fetch the online-store docs (online tables / Lakebase-backed stores) to confirm how v1 and v2 feature tables are published online at the same time, or the cost of doing so.
- I did not find documentation of a Delta-version pin (`VERSION AS OF`) in `FeatureLookup`. If one exists in a newer client, it was not on the pages read.

---

## 7. First-person and named-company accounts of WAP-style publishing on Delta

### Takeaway

I found no named company publishing a detailed first-person account of WAP or staged publishing on Delta comparable to Netflix on Iceberg or Lyft's Stage-Check-Exchange on Hive. The evidence is:

- Nike's open-source Spark-Expectations library (in-flight DQ that quarantines failing rows to an `_error` table before writing to a Delta target);
- an anonymous user's GitHub discussion on the cost of WAP via replicas and shallow clones;
- a vendor (Fivetran) testimonial on Databricks transactions;
- vendor posts from lakeFS saying Delta lacks WAP.

### Cited Findings

- Nike: `Nike-Inc/spark-expectations` (created 2 Jul 2023, last pushed 7 Oct 2026, ~200 stars). It describes itself as a "PySpark-native data quality framework" that "enforces expectation rules in-flight ... quarantining failures, passing clean data downstream". Failing records "are by default quarantined in an _error table". Its README example writes the target and error tables with `.format("delta")`. Notifications fire when the drop threshold is breached. — [GitHub README](https://github.com/Nike-Inc/spark-expectations) (FULL-TEXT via GitHub API). Company-published OSS. Limit: this is row-level filter-and-quarantine before write, not a stage-audit-publish of the whole table. A podcast episode titled "Block Bad Data Before the Write with Nike's Ashok Singamaneni" exists (SNIPPET only, not listened to).
- Anonymous team (GitHub user dfustes), Feb 2025: a WAP built on a "public" replica is slow, and shallow clones break CDF consumers (section 1). — [discussion #4135](https://github.com/delta-io/delta/discussions/4135), FULL-TEXT.
- Fivetran (VENDOR testimonial in a Databricks blog, Mar 2026): its Chief Product Officer says native transactions let connectors "reliably land data into Unity Catalog–managed tables while preserving consistency". — [Databricks blog](https://www.databricks.com/blog/transactions-open-lakehouse-unlock-mission-critical-warehousing-workloads), FULL-TEXT, VENDOR. Limit: a marketing quote, not an engineering account.
- lakeFS (VENDOR): "Delta Lake doesn't support WAP" and lakeFS is "an excellent choice of WAP tool if you want to use Apache Hudi or Delta Lake". — [lakefs.io/blog/what-is-write-audit-publish](https://lakefs.io/blog/what-is-write-audit-publish), FULL-TEXT, VENDOR (self-interested).
- Databricks blogs on clones for staging ("Attack of the Delta Clones", 20 Apr 2021, and "Easily Clone your Delta Lake for Testing, Sharing, and ML Reproducibility", 15 Sep 2020) were seen only as SNIPPETs. VENDOR.

### Inferences

- Public, first-person Delta WAP accounts are scarce. Whether Databricks customers do this and do not write about it, or do not do it, cannot be told from the public record. The article should not claim widespread WAP practice on Delta.

### Gaps

- I did not search Data+AI Summit session videos or transcripts exhaustively. No session transcript describing a named company's Delta WAP or staged publish was found and read.

---

## 8. Side-by-side comparison: Iceberg vs open-source Delta vs Databricks Delta (Unity Catalog)

### Takeaway

Iceberg has native branches, tags and WAP. OSS Delta has none of the three, only clone, constraints and copy-style publish. Databricks Delta adds atomic multi-table publish (transactions, GA July 2026), safer UC shallow clones and pipeline expectations, but still no branches or tags. All three can roll back and time travel within retention, and none can undo what downstream consumers already read.

### Cited Findings

Sources keyed in the table:

- [I-BR] [Iceberg branching](https://iceberg.apache.org/docs/latest/branching/)
- [I-PR] [Iceberg Spark procedures](https://iceberg.apache.org/docs/latest/spark-procedures/)
- [I-CF] [Iceberg configuration](https://iceberg.apache.org/docs/latest/configuration/)
- [I-EV] [Iceberg evolution](https://iceberg.apache.org/docs/latest/evolution/)
- [I-ST] [Iceberg streaming](https://iceberg.apache.org/docs/latest/spark-structured-streaming/)
- [I-REST] [Iceberg REST spec `/v1/{prefix}/transactions/commit`](https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml), "Commit updates to multiple tables in an atomic operation"
- [I-WAP] [Iceberg Spark configuration `spark.wap.branch`](https://iceberg.apache.org/docs/latest/spark-configuration/), as cited in `analytical_pipeline_changes.md`
- [D-P] [Delta PROTOCOL.md](https://github.com/delta-io/delta/blob/master/PROTOCOL.md)
- [D-U] [Delta utility docs](https://docs.delta.io/latest/delta-utility.html)
- [D-B] [Delta batch docs](https://docs.delta.io/latest/delta-batch.html)
- [D-CM] [Delta column mapping](https://docs.delta.io/latest/delta-column-mapping.html)
- [D-TW] [Delta type widening](https://docs.delta.io/latest/delta-type-widening.html)
- [D-CDF] [Delta CDF](https://docs.delta.io/latest/delta-change-data-feed.html)
- [D-S] [Delta streaming](https://docs.delta.io/latest/delta-streaming.html)
- [D-RFC] [Delta RFC #7439 / #7437](https://github.com/delta-io/delta/issues/7439)
- [DB-TX] [Databricks Transactions](https://docs.databricks.com/aws/en/transactions/)
- [DB-RN] [Databricks release notes, July 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/july)
- [DB-UCC] [UC shallow clone](https://docs.databricks.com/aws/en/delta/clone-unity-catalog)
- [DB-CL] [Databricks clone](https://docs.databricks.com/aws/en/delta/clone)
- [DB-H] [Databricks history](https://docs.databricks.com/aws/en/delta/history)
- [DB-EX] [Databricks expectations](https://docs.databricks.com/aws/en/ldp/expectations)
- [DB-TWD] [Databricks type widening](https://docs.databricks.com/aws/en/delta/type-widening)
- [DB-CMD] [Databricks column mapping](https://docs.databricks.com/aws/en/delta/column-mapping)
- [DB-US] [Databricks update table schema](https://docs.databricks.com/aws/en/delta/update-schema)
- [LFS] [lakeFS Delta](https://docs.lakefs.io/integrations/delta/)

All were fetched as FULL-TEXT except [I-WAP], which is reused from the existing note (FULL-TEXT there).

| Capability | Apache Iceberg | Open-source Delta Lake (to 4.4.1) | Databricks Delta (DBR + Unity Catalog) |
| --- | --- | --- | --- |
| Native branches | Yes. Named branches with their own retention [I-BR] | No. Not in the protocol [D-P]; branching only proposed in open RFC #7439 (Aug 2026) [D-RFC] | No. Not offered; isolation is by schema or catalog plus clones [DB-UCC] |
| Tags (named versions) | Yes. Tags with max-ref-age [I-BR] | No. Protocol "tags" are per-file metadata maps, not version names [D-P] | No. UC tags are governance labels and are not cloned [DB-CL] |
| Write-audit-publish | Native: `write.wap.enabled`, `spark.wap.branch`/`spark.wap.id`, `fast_forward`, `cherrypick_snapshot` [I-WAP] [I-PR] | Pattern only: shallow clone, then validate, then hand-written MERGE back [D-U]; CHECK constraints block bad rows [D-B]; native WAP is an open RFC [D-RFC] | Pattern plus gates: UC shallow clone or staging table, expectations warn/drop/fail [DB-EX], then a transactional publish [DB-TX] |
| Atomic multi-table publish | REST catalog spec defines an atomic multi-table commit endpoint [I-REST] (engine and catalog support varies, not verified) | No. Open RFC #7437 only [D-RFC]; lakeFS merges across Delta tables, single writer [LFS] | Yes. `BEGIN ATOMIC` / `BEGIN TRANSACTION`, up to 100 tables, managed tables with catalog commits only, no DDL, GA for Delta 22 Jul 2026 [DB-TX] [DB-RN] |
| Zero-copy clone | Branches are zero-copy [I-BR] | `SHALLOW CLONE` since 2.3; breaks if source is vacuumed [D-U] | Shallow clone (UC: VACUUM on the source does not break clones) [DB-UCC]; deep clone copies data [DB-CL] |
| Rollback | `rollback_to_snapshot`, `rollback_to_timestamp`, `set_current_snapshot` move the pointer [I-PR] | `RESTORE` since 1.2.0; new data-changing commit; fails after VACUUM [D-U] | `RESTORE`; partial restore with `ignoreMissingFiles`; duplicate-data warning [DB-H]; not allowed inside transactions [DB-TX] |
| Schema evolution without rewrite | Add, drop, rename, widen by column ID, "without rewriting files" [I-EV] | Add (`mergeSchema`) [D-B]; rename and drop via column mapping (irreversible protocol upgrade, docs say experimental) [D-CM]; widen via type widening (3.2 preview, 4.0 GA) [D-TW] | Same, plus `DROP FEATURE` to remove column mapping (DBR 15.4+) [DB-CMD]; type widening DBR 15.4+, readers must be 15.4+ [DB-TWD] |
| Time travel | Snapshot ID, timestamp, branch or tag [I-BR] [I-PR] | `VERSION AS OF` / `TIMESTAMP AS OF`, 30 days of log by default [D-B] | Same; blocked beyond `deletedFileRetentionDuration` in DBR 18.0+ (UC managed from 12.2 LTS) [DB-H] |
| Retention constraints | `history.expire.max-snapshot-age-ms` 5 days by default, applied when `expire_snapshots` runs; refs retain snapshots [I-CF] [I-PR] | `deletedFileRetentionDuration` 7 days, `logRetentionDuration` 30 days; VACUUM is manual; blocked on catalog-managed tables (4.1+) [D-U] [D-B] | Same defaults; predictive optimization can run VACUUM automatically [DB-H] |
| CDC to downstream | Streams read appends only, overwrites throw by default [I-ST]; `create_changelog_view` [I-PR] | Change Data Feed since 2.0.0, row-level, purged by VACUUM [D-CDF]; streams throw on non-append unless `skipChangeCommits` [D-S] | Same CDF; schema updates terminate streams [DB-US] |

### Inferences

- One-line answer for the article: Delta supports the side-by-side and rollback halves, but not native branching or WAP. On open-source Delta you build WAP from a clone or staging table and a MERGE. On Databricks you can now publish many tables atomically (GA July 2026), but there are still no branches or tags. Iceberg (and lakeFS for any format) remain the only options with a branch you can audit and then fast-forward.

### Gaps

- I did not verify which Iceberg catalogs and engines implement the REST multi-table commit for user-level multi-table transactions, so that cell is spec-level only.
- Snowflake, BigQuery and Hudi equivalents are out of scope.

## Additions checked November 12, 2026 (book review round)

A reviewer read these pages live on November 12, 2026 while reviewing chapter 2 and Appendix B. They are recorded here so that chapter 2 and the appendix can cite them; they were read in full on the live pages, not through a summarizing tool.

- Databricks, "Serve multiple models to a model serving endpoint". <https://docs.databricks.com/aws/en/machine-learning/model-serving/serve-multiple-models-to-serving-endpoint> A `traffic_config` routes a percentage of requests to each served model, for example 90% to `current` and 10% to `challenger`. This corrects the earlier note that a traffic split was undocumented.
- MLflow Model Registry. <https://mlflow.org/docs/latest/ml/model-registry/> Registered model versions can carry aliases such as `@champion` and `@challenger`, and serving code can load a model by alias, so promoting a model moves an alias.
- Snowflake, "Understanding and using Time Travel". <https://docs.snowflake.com/en/user-guide/data-time-travel> Time Travel retention is 1 day by default and can be set up to 90 days on Enterprise Edition and above.
- BigQuery, "Data retention with time travel". <https://cloud.google.com/bigquery/docs/time-travel> The time-travel window is configurable from 2 to 7 days, 7 by default.
- Apache Kafka, KIP-405 Tiered Storage. <https://cwiki.apache.org/confluence/display/KAFKA/KIP-405%3A+Kafka+Tiered+Storage> Tiered storage moves older log segments to remote storage so that retention can be much longer than local disk allows; the KIP records it as production-ready from Kafka 3.9, and it does not support compacted topics.
- Google Cloud, Vertex AI Feature Store overview. <https://cloud.google.com/vertex-ai/docs/featurestore/latest/overview> The product is now documented under the name Agent Platform Feature Store.
