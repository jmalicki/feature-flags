# Changing an upstream table in an analytical data platform without breaking the derived tables and features built on it (2012-2025)

Scope: batch and streaming analytical pipelines (warehouse or lakehouse). The case is a source table with many derived tables between it and an ML feature store. Other notes already cover operational database schema changes (`operational_schema_changes.md`), feature-store versioning (`feature_stores_and_versions.md`) and end-to-end data-to-model cases (`end_to_end_cases_and_failures.md`). This file avoids repeating them and points to them where they overlap (Uber D3, Sculley 2015, Google data cascades).

Source-status legend:

- FULL-TEXT: the raw page text was fetched with curl and read.
- TOOL-EXTRACT: the content was read through a summarizing fetch tool. Wording is paraphrased and nothing is quoted from it.
- SNIPPET: only a search-result snippet was seen.
- VENDOR: vendor documentation or a vendor blog.
- (via IA): the Medium-hosted or Netflix/Uber page was read from an Internet Archive `id_` snapshot fetched in an earlier session. The live Medium page refused automated fetches.

All exact quotations are under 25 words and come from FULL-TEXT raw text.

---

## 1. Write-Audit-Publish (WAP): origin, mechanics, implementations, and who says they use it

### Takeaway

WAP is the data-pipeline equivalent of a dark launch with a gate. The new output is written somewhere consumers cannot see, it is checked, and only then is it made visible with an atomic pointer move: a partition swap, an Iceberg snapshot or branch fast-forward, a lakeFS merge, or a Snowflake `SWAP`. Netflix presented it in 2017 and later built it into Iceberg (2019) and into its Maestro scheduler as a template (2023). The gate works on one table, or one commit for each publish. It checks the quality of the new data. It does not keep a second version of the pipeline running for consumers, and practitioner polling suggests most data engineers had not heard of it as of 2023.

### Cited Findings

- **Origin (Netflix, 2017).** The slide deck "Whoops, The Numbers Are Wrong! Scaling Data Quality @ Netflix" was presented at Hadoop Summit / DataWorks Summit, San Jose, June 2017. The tool extract names the speaker as **Michelle Ufford**, and the SlideShare account in the URL is "MichelleFUfford". The deck describes WAP as an ETL pattern in four stages:
  - Stage 0: create an audit table, e.g. `audit.my_table_f_1497312000`.
  - Stage 1: write the new partition (`utc_date=20170612`) to that audit table.
  - Stage 2: the Quinto data-quality service compares the partition's metrics with prior data.
  - Stage 3: publish into `dw.my_table_f` and advance a `valid_thru_ts` watermark.

  Example rules: a RowCount check fails the job, and a NullCount check (normal distribution) only warns. In the worked example, the new partition had 17,240 rows and 17,240 nulls, against 16,135 rows and 21 nulls the day before, and the null check fired. The deck also mentions a WAP Python library. Scale figures given: 60+ PB warehouse, 700+ billion events written per day, 300 TB written and 5 PB read. — [SlideShare, Netflix / Ufford, Jun 2017](https://www.slideshare.net/slideshow/whoops-the-numbers-are-wrong-scaling-data-quality-netflix/77278406) (TOOL-EXTRACT; curl was blocked by a client challenge).
  - **Naming conflict.** The lakeFS blog attributes the same talk to "Michelle Winters" at DataWorks Summit 2017 ([lakeFS / Robin Moffatt, May 30 2023](https://lakefs.io/blog/data-engineering-patterns-write-audit-publish/), FULL-TEXT, VENDOR). The slides carry the name Ufford. I did not verify whether these are the same person under different surnames, so cite the talk by title.
- **WAP built into Iceberg by its creator at Netflix (2019).** Ryan Blue's PR #342 "Spark: Add support for write-audit-publish workflows" was merged on 1 Aug 2019. With WAP, "the new table snapshot is added to table metadata but not made the current table snapshot". An external audit then publishes it. The mechanics:
  - the table property `write.wap.enabled` and the Spark property `spark.wap.id` stage the commit;
  - the WAP ID is recorded in the commit summary so the auditor can find it.

  — [apache/iceberg PR #342](https://github.com/apache/iceberg/pull/342) (FULL-TEXT via GitHub API).
- **Iceberg branches as the newer WAP mechanism.**
  - Mechanics: set `spark.wap.branch = audit-branch`, write, validate, then `CALL system.fast_forward('prod.db.table','main','audit-branch')`. A branch can be created with retention, e.g. `RETAIN 7 DAYS`.
  - Iceberg's docs also list `publish_changes`, `cherrypick_snapshot`, `rollback_to_snapshot`, `rollback_to_timestamp` and `set_current_snapshot`. `publish_changes` only works for append and dynamic-overwrite snapshots, and fails if several snapshots share the WAP ID.
  - The branching doc says "Branches can also be used as part of data engineering workflows, for enabling experimental branches for testing and validating new jobs."

  — [Iceberg docs: Branching and Tagging](https://iceberg.apache.org/docs/latest/branching/) (FULL-TEXT, "Audit Branch" section); [Iceberg Spark procedures](https://iceberg.apache.org/docs/latest/spark-procedures/) (FULL-TEXT); [Iceberg Spark configuration](https://iceberg.apache.org/docs/latest/spark-configuration/) (FULL-TEXT, `spark.wap.id`, `spark.wap.branch`).
- **Netflix production use, 2023.** Netflix's Maestro scheduler offers a "write-audit-publish templatized pattern" to its users. Maestro runs "100% workload", with thousands of users and tens of thousands of workflows. — [Jun He, Yingyi Zhang, Pawan Dixit, "Incremental Processing using Netflix Maestro and Apache Iceberg", Netflix TechBlog, Nov 2023](https://netflixtechblog.com/incremental-processing-using-netflix-maestro-and-apache-iceberg-b8ba072ddeeb) (FULL-TEXT via IA). WAP is mentioned only in passing. The post gives no WAP metrics such as the rate of blocked publishes.
- **AWS reference implementation (vendor).** Iceberg branches plus AWS Glue Data Quality, with Write to a staging branch, Audit there, and Publish by `fast_forward` to main. The post states the cost plainly: "The primary challenge of the WAP pattern is the increased latency it introduces." It also says WAP needs "more sophisticated orchestration" than a dead-letter-queue approach. The worked example is a sample room-temperature dataset, not a customer case. — [Tomohiro Tanaka, Sotaro Hikita, Noritaka Sekiyama, AWS Big Data Blog, 9 Dec 2024](https://aws.amazon.com/blogs/big-data/build-write-audit-publish-pattern-with-apache-iceberg-branching-and-aws-glue-data-quality/) (FULL-TEXT, VENDOR).
- **Lyft's variant, "Stage-Check-Exchange".** The `VerityAirflowOperator` can block: "create data in a staged schema, verify the data with a blocking operator, then promote it to production if it passes quality checks." The DAG is `create_staged_data >> dq_check_blocking >> exchange_data`. Lyft's motivation: poor Hive data quality "caused tainted experimentation metrics, inaccurate machine learning features, and flawed executive dashboards." — [Michael McPhillips, "From Big Data to Better Data: Ensuring Data Quality with Verity", Lyft Engineering, Oct 2023](https://eng.lyft.com/from-big-data-to-better-data-ensuring-data-quality-with-verity-a996b49343f6) (FULL-TEXT via IA). No numbers are given on how often a check blocks a run.
- **lakeFS and Project Nessie: git-like branches over a whole lake (vendor and OSS project).**
  - A Nessie commit can group files from many tables, so you can think of it "as a (multi-table) transaction". Spark jobs and engineers' experiments are isolated on branches, so "Failed jobs do not add additional harm to the data." — [Project Nessie, "About Nessie"](https://projectnessie.org/guides/about/) (FULL-TEXT, project docs, Dremio-originated).
  - Moffatt compares WAP to blue-green deployment and lists the publish options: insert from staging, merge a branch, or flip a flag or view. — [lakeFS blog, Robin Moffatt, May 30 2023](https://lakefs.io/blog/data-engineering-patterns-write-audit-publish/) (FULL-TEXT, VENDOR).
- **How common WAP is (informal poll, vendor author).** Moffatt polled social platforms. On r/dataengineering (100+ votes), "the vast majority hadn't even heard of WAP, let alone used it". On LinkedIn, nearly a third of respondents used it. His summary: many people have not heard of WAP, and perhaps half of those who have use it. — same lakeFS post (FULL-TEXT, VENDOR; self-selected sample).
- **Delta Lake and Snowflake building blocks.**
  - Delta shallow clone (Delta Lake 2.3+) copies metadata only. Changes to the clone do not touch the source, but `VACUUM` on the source breaks shallow clones with a FileNotFoundException. — [Delta Lake utility docs](https://docs.delta.io/latest/delta-utility.html) (FULL-TEXT).
  - Snowflake `ALTER TABLE ... SWAP WITH`: "Swap renames two tables in a single transaction." — [Snowflake ALTER TABLE](https://docs.snowflake.com/en/sql-reference/sql/alter-table) (FULL-TEXT, VENDOR).
  - Snowflake clones "share the same underlying storage as the source table". — [Snowflake cloning considerations](https://docs.snowflake.com/en/user-guide/object-clone) (FULL-TEXT, VENDOR).
  - Section 4 covers dbt's Snowflake blue/green recipe, which uses `alter database prod swap with stage`.

### Inferences

- WAP maps onto the article's vocabulary as follows: a dark write (Write), an automated health check (Audit), and an atomic, reversible switch (Publish). What it lacks is percentage exposure. Every consumer sees the new data at the same moment, so it is a gate, not a canary.
- Per-table WAP does not solve the ten-tables-downstream case alone. Each derived table needs its own audit, or the platform needs a multi-table commit (Nessie, lakeFS) so that all ten tables publish together.

### Gaps

- I found no first-party numbers on how often WAP audits block a publish, or on the latency WAP adds, at Netflix or anywhere else.
- I found no first-party production account of Nessie or lakeFS multi-table publishes from a named non-vendor organization in this pass. Vendor case studies exist but were not read.
- The Netflix talk video and transcript were not available. The slides were read only through a summarizing fetch.

---

## 2. Versioned tables and data contracts: publishing two versions of a table with a migration window

### Takeaway

Two ways to change a table without breaking its consumers are documented:

1. **Versioned interfaces.** dbt model versions with `deprecation_date`, LinkedIn's versioned Dali views, Kafka `-v1`/`-v2` streams, and Airbnb Minerva's hashed "data versions". The old and new tables coexist, consumers move at their own pace, and the producer pays for both builds until a date set in advance.
2. **Contracts that refuse breaking changes.** dbt enforced contracts, Uber's schema service, GoCardless and PayPal data contracts, and Convoy's Protobuf events.

Both catch structural breaks: names, types, removed columns. Semantic changes (seconds to milliseconds, a new filter, a metric redefinition) are left to humans. The vendors say so themselves, and so does LinkedIn.

### Cited Findings

- **dbt model versions (docs, vendor OSS).**
  - The doc treats a shared model as an API. The recommended answer to a breaking change is to "Offer a migration window off the 'old' version". In the example, `dim_customers` has v2 as latest, v3 as prerelease and v1 as old, each materialized as `dim_customers_v<N>`.
  - An alias or `latest_version_pointer` view (dbt 1.12+) keeps the unversioned name pointing at the current version.
  - Setting `latest_version: 1` while v2 exists makes v2 a "prerelease". Bumping it is the cut-over.
  - The doc admits the cost: "There is a real trade-off that exists here—the cost to frequently migrate downstream code, and the cost (and clutter) of materializing multiple versions". It also says "The process of sunsetting and migrating model versions requires real work, and likely significant coordination across teams."
  - Adding a column or fixing a bug in a column's calculation is classed as non-breaking and needs no new version.

  — [dbt docs: Model versions](https://docs.getdbt.com/docs/mesh/govern/model-versions) (FULL-TEXT).
- **Release dates.** The same doc says "dbt 1.6 introduced first-class support for deprecating models by specifying a deprecation_date." That makes `deprecation_date` a dbt **1.6** feature, not 1.5. Versions and contracts are generally dated to dbt Core 1.5 (April 2023), but my fetch of the 1.5 release post failed, so that date is not re-verified here.
  - The design intent appears in Jeremy Cohen's (dbt Labs) GitHub discussion "Multi-project collaboration" of 25 Jan 2023. It proposes contracts and versioning for cross-team models. It notes that "large" projects (>500 models) had tripled in a year and called <500 models the ideal size. — [dbt-core discussion #6725](https://github.com/dbt-labs/dbt-core/discussions/6725) (FULL-TEXT via GitHub API).
- **dbt deprecation enforcement.**
  - dbt warns as a deprecation date approaches.
  - "If your model has an enforced contract, you cannot delete the model until after the deprecation_date has passed."
  - Deleting a versioned model early raises an error and fails jobs.

  — [dbt docs: deprecation_date](https://docs.getdbt.com/reference/resource-properties/deprecation_date) (FULL-TEXT).
  - The producer playbook is: set a deprecation date, communicate, bump latest, clean up. dbt lists "Changing logic behind a metric", "Changing granularity" and "Modifying filters" as changes that "might be breaking depending on your business logic". The contract cannot catch these. — [dbt best practices: Coordinating model versions](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-6-coordinate-versions) (FULL-TEXT).
- **dbt model contracts.**
  - An enforced contract makes dbt run a "preflight" check of column names and types.
  - Compared with the previous state, dbt treats these as breaking changes: removing a column, changing `data_type`, removing or modifying a constraint (1.6+), and deleting, renaming or disabling a contracted model (1.9+). Versioned models raise an error and unversioned models raise a warning.
  - On many warehouses, `not_null` and `check` constraints are "definable but not enforced".
  - Tests are explicitly not part of the contract.

  — [dbt docs: Model contracts](https://docs.getdbt.com/docs/mesh/govern/model-contracts) (FULL-TEXT).
- **Competitor critique (vendor).** Toby Mao argues that "dbt's model contracts don't take into account logic, only structure". He also says versions were added so models could "migrate at their own pace" because contracts do not help migrate downstream dependencies. — [Tobiko Data, "The False Promise of dbt Contracts", Apr 20 2023](https://tobikodata.com/the-false-promise-of-dbt-contracts.html) (FULL-TEXT, VENDOR, competitor).
- **SQLMesh change classification (vendor OSS).**
  - SQLMesh classifies each directly modified model as breaking, non-breaking or forward-only, and infers the category of indirectly modified downstream models.
  - Breaking: "it and its downstream dependencies will be backfilled", which is safest but most expensive. Adding a WHERE clause is the docs' example.
  - Non-breaking: only the changed model is backfilled.
  - Forward-only: the existing physical table is reused and "no backfill will take place". The dev preview then lives in a temporary table or shallow clone and is not reused in production.
  - If upstream categories conflict, the most conservative (breaking) wins. `select *` is classified only "on a best-effort basis".

  — [SQLMesh docs: Plans](https://sqlmesh.readthedocs.io/en/stable/concepts/plans/) (FULL-TEXT, VENDOR).
- **LinkedIn Dali views (2017).**
  - LinkedIn names semantic change explicitly: "when a field representing granularity of time is modified from seconds to milliseconds, a number of downstream processes are impacted".
  - Dali views are SQL in Git, code-reviewed, published to Artifactory, "immutable and versioned", and "multiple versions of the same View can happily coexist".
  - Versioning replaces "an all-or-nothing and expensive atomic push upgrade with an incremental pull upgrade initiated by the consumer."
  - Worked case: page-view events were split into per-type topics such as `VoyagerPageView`, and a union view kept consumers unchanged. In a mobile and desktop app relaunch, "only a View definition was changed" and no downstream scripts were touched.
  - Scale: "over 300 Views deployed in production".

  — [Carl Steinbach and Vasanth Rajamani, "Dali Views: Functions as a Service for Big Data", LinkedIn Engineering, Nov 9 2017](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data) (FULL-TEXT).
- **LinkedIn Coral (2020).** Dali views can be read from Hive, Spark, Pig and Presto. They are "agile", meaning view schemas evolve with the tables beneath them, but they "are built on tables that adhere to strict schema evolution rules". The stated goal is to let producers change logic or sources "with zero dataset consumer downtime, and zero data staleness." — [Walaa Eldin Moustafa, "Coral", LinkedIn Engineering, Dec 10 2020](https://engineering.linkedin.com/blog/2020/coral) (FULL-TEXT).
- **Airbnb Minerva: hashed data versions with automatic backfill (2021).**
  - A "data version" is a hash of the config fields that affect output. When it changes, "a new dataset gets created and backfilled automatically". A dimension change triggers backfills in every dimension set that uses it.
  - Scale: 12,000+ metrics, 4,000+ dimensions and 200+ data producers (Part I); 5,000+ datasets across 80+ teams (Part II).
  - Two years of backfill are split into 24 one-month batches that run in parallel.

  — [Robert Chang et al., "How Airbnb Achieved Metric Consistency at Scale", Apr 30 2021](https://medium.com/airbnb-engineering/how-airbnb-achieved-metric-consistency-at-scale-f23cc53dea70) (FULL-TEXT via IA); [Amit Pahwa et al., "How Airbnb Standardized Metric Computation at Scale", Jun 1 2021](https://medium.com/airbnb-engineering/airbnb-metric-computation-with-minerva-part-2-9afe6695b486) (FULL-TEXT via IA). The staging environment is covered in section 4. Midas was not readable: the Medium page served a bot challenge and the archive had no copy.
- **Uber (2018): a schema service was the fix for silent upstream breakage.**
  - First-generation ingestion was ad hoc JSON with no "formal contract" between producers and consumers, and was "not resilient to changes in the producer code". Backfills were "very time-and-labor-consuming".
  - Fix: a central schema service, Parquet, and upstream stores moving to mandatory schema checks that reject non-conforming data.
  - Uber's caveat: schemas do not check values, so it was extending the service with "semantic checks".

  — [Reza Shiftehfar, "Uber's Big Data Platform: 100+ Petabytes with Minute Latency", Uber Engineering, Oct 17 2018](https://www.uber.com/blog/uber-big-data-platform/) (FULL-TEXT via IA). Databook: the live page returned 406 and the archive had no copy, so it was not read.
- **Shopify.**
  - CDC (2021): "Breaking schema changes are extremely disruptive for our downstream consumers, so we do our best as a company to avoid them whenever possible." Shopify was still "exploring better options". It enforces one domain per topic with evolution-compatible schemas, and uses the schema registry plus ACLs to find which consumers to notify. — [John Martin, "Capturing Every Change From Shopify's Sharded Monolith", Mar 12 2021](https://shopify.engineering/capturing-every-change-shopify-sharded-monolith) (FULL-TEXT).
  - Seamster on dbt (2020): a one-to-one "base" layer over raw sources "serves to protect users from breaking changes in raw sources". Only the base model is fixed, not every downstream model. Context: Starscream ran 76,000 jobs and wrote 300 TB per day, and about 70% of PySpark jobs were plain batch queries. — [Michelle Ark and Chris Wu, "How to Build a Production Grade Workflow with SQL Modelling", Nov 19 2020](https://shopify.engineering/build-production-grade-workflow-sql-modelling) (FULL-TEXT).
- **GoCardless data contracts (Andrew Jones).**
  - The 2021 rationale: on CDC sources, "breaking changes and data migrations will be a regular part of the applications evolution" and are made without knowing downstream use. The contract is versioned, and breaking changes are avoided as with an API. — [Andrew Jones, "Data contracts", 8 Apr 2021](https://andrew-jones.com/blog/data-contracts/) (FULL-TEXT, personal blog).
  - Six months in, contracts powered about 50% of asynchronous inter-service events. They had "not yet seen the same kind of adoption for data primarily produced for the data teams", which still came mostly from CDC. Teams found it hard to justify moving against other priorities until the CDC pipeline is decommissioned. — [Andrew Jones, "Data Contracts at GoCardless — 6 Months On", May 25 2022](https://medium.com/gocardless-tech/data-contracts-at-gocardless-6-months-on-bbf24a37206e) (FULL-TEXT via IA).
- **PayPal.** PayPal published the data contract template "being used in the implementation of Data Mesh at PayPal". Its sections are fundamentals, schema, data quality, SLA, security and stakeholders, and custom properties. It became the Open Data Contract Standard (Bitol, Linux Foundation). — [paypal/data-contract-template README](https://github.com/paypal/data-contract-template) (FULL-TEXT). The README does not describe how PayPal migrates consumers between contract versions.
- **Convoy.** Chad Sanderson described Protobuf-like IDL plus Kafka events whose "Data APIs are versioned with strong CI/CD and change management". His example: the pricing algorithm that generates 80% of revenue "is broken after the column is dropped in a production table upstream". This is presented as illustrative, not as a dated incident. — [Chad Sanderson, "The Rise of Data Contracts", Data Products newsletter (Substack), Aug 22 2022](https://dataproducts.substack.com/p/the-rise-of-data-contracts) (FULL-TEXT via IA; personal newsletter, author was then at Convoy).
- **Monzo (2021).**
  - Scale: "over 4700 models in our dbt project with ~600k lines of SQL", in a forked dbt.
  - Custom "upstream prod" builds only the edited models in development and reads their parents from production.
  - `indirect_ref` "interface tables" act as a contract between a sensitive project and its consumers. GitHub CODEOWNERS tags the producing team on PRs.

  — [Monzo, "An introduction to Monzo's data stack", 13 Oct 2021](https://monzo.com/blog/2021/10/14/an-introduction-to-monzos-data-stack) (FULL-TEXT).
- **Spotify (2024).** More than 38,000 actively scheduled pipelines. Data "endpoints" each follow a schema and carry retention, ACLs, lineage and quality checks. Platform goal: "seamless upgrade paths (nobody likes to be disrupted by platform upgrades and breaking changes)." The post gives no mechanism for versioning an endpoint. — [Spotify Engineering, "Data Platform Explained Part II", May 28 2024](https://engineering.atspotify.com/2024/05/data-platform-explained-part-ii) (FULL-TEXT).
- **Meta Tulip (2022).** "Thousands of engineers create, update, and delete logging schemas every month." The old positional Hive-text format allowed new columns "only at the end", so deleting or inserting a column made rows unreadable. Tulip adds forward and backward compatibility, and the platform, not engineers, assigns field IDs. — [Dhruv Matani et al., "Tulip: Schematizing Meta's data platform", Engineering at Meta, Nov 9 2022](https://engineering.fb.com/2022/11/09/developer-tools/tulip-schematizing-metas-data-platform/) (FULL-TEXT).

### Inferences

- For the reader's case (ten tables between the source and the feature store), the documented pattern has several parts:
  - Put a contracted or versioned interface (Dali view, dbt versioned model, Shopify base model) right above the source, so most source changes stop there.
  - When a change must propagate, build `_v2` of each affected derived table next to `_v1`.
  - Move consumers by pin or view swap within a stated deprecation window.
- This is expand/contract applied to tables. The cost is real: dbt itself calls it "real work" and names the duplicate materialization cost.
- The tools catch structure, not meaning. Every source here that discusses semantic change (LinkedIn's seconds-to-milliseconds, dbt's "might be breaking" list, Tobiko, Uber's "semantic checks") leaves it to review or data checks.

### Gaps

- I found no first-person account, from any named organization, of a dbt model-version migration with dates, the length of the deprecation window, and the extra warehouse cost.
- No primary source on Uber Databook or Airbnb Midas was readable in this pass.
- No PayPal or GoCardless account describes running two contract versions at once.

---

## 3. Lineage-driven impact analysis and automated blocking of breaking changes in CI

### Takeaway

The mature, documented practice is to rebuild the changed model and everything downstream of it in an isolated schema on every pull request, reading unchanged parents from production. dbt calls this "slim CI": `state:modified+` with `--defer`. Teams then add contract checks, data tests, and optionally a row-level data diff against production. Lineage catalogs (DataHub, OpenLineage, dbt exposures) can list downstream consumers. Wiring them into CI to block merges is offered by vendors, but I found no named organization describing that setup first-hand. Streaming and event schemas get blocked automatically by schema-registry compatibility checks.

### Cited Findings

- **dbt slim CI and defer.**
  - "By comparing to artifacts from a previous production run, dbt can determine which models are modified and build them on top of their unmodified parents": `dbt run -s state:modified+ --defer --state path/to/prod/artifacts`. — [dbt best practice workflows](https://docs.getdbt.com/best-practices/best-practice-workflows) (FULL-TEXT).
  - Defer resolves `ref()` to production for anything not built in the current run. It lets you "modify end-of-pipeline models by pointing to production models, instead of running everything upstream." — [dbt docs: defer](https://docs.getdbt.com/reference/node-selection/defer) (FULL-TEXT).
  - dbt Cloud CI builds "only the modified data assets in your pull request (PR) and their downstream dependencies" into a temporary schema `dbt_cloud_pr_<job_id>_<pr_id>`. The schema is dropped on merge or close, though a custom `generate_schema_name` may leave it behind. Stale runs are cancelled to cut "data platform spend on wasteful CI runs". — [dbt docs: Continuous integration](https://docs.getdbt.com/docs/deploy/continuous-integration) (FULL-TEXT, VENDOR for Cloud features).
  - Monzo built its own version of this before dbt had it (see section 2).
- **dbt exposures** declare downstream uses (dashboards, applications, "data science pipeline") so you can "run, test, and list resources that feed into your exposure". Some integrations create them automatically. — [dbt docs: Exposures](https://docs.getdbt.com/docs/build/exposures) (FULL-TEXT).
- **DataHub Lineage Impact Analysis.** It lists upstream and downstream dependencies "to proactively identify the impact of breaking schema changes", through the UI and GraphQL, "supporting manual and automated workflows". — [DataHub docs: Lineage Impact Analysis](https://docs.datahub.com/docs/act-on-metadata/impact-analysis) (FULL-TEXT, OSS / vendor docs).
  - A DataHub support article describes a dbt-specific GitHub Action with a fail-on-high-impact option. — [DataHub support](https://support.datahub.com/hc/en-us/articles/42653605290907-GitHub-Actions-Framework-for-Impact-Analysis) (SNIPPET, VENDOR).
- **OpenLineage column-level lineage facet.** It records which input columns produce which output columns, answering "Which root input columns are used to construct column x?" — [OpenLineage spec: Column Level Lineage Dataset Facet](https://openlineage.io/docs/spec/facets/dataset-facets/column_lineage_facet/) (FULL-TEXT).
- **Google Goods (SIGMOD 2016).** Google crawls metadata, including provenance, for billions of datasets in a setting "where there is no centralized system for storing and querying them". — [Halevy et al., "Goods: Organizing Google's Datasets"](https://research.google/pubs/goods-organizing-googles-datasets/) (FULL-TEXT abstract only). This shows lineage at scale is inferred after the fact, not declared.
- **Data diff in CI (vendor).** Datafold compares production and staging builds "at the row and column level". It posts value-level differences and downstream BI impact as a PR comment, and needs a CI step that builds staging data first. — [Datafold docs: How it works](https://docs.datafold.com/deployment-testing/how-it-works) (FULL-TEXT, VENDOR).
- **Data-quality audit libraries.**
  - Amazon's Deequ supplies declarative "unit tests for data" on Spark, with incremental metrics on growing datasets, anomaly detection on metric histories, and suggested constraints. Motivation: deployed ML models "rely on strong assumptions about the shape of their inputs" and "subtle errors introduced by changes in data can be very hard to detect". — [Schelter et al., "Automating Large-Scale Data Quality Verification", PVLDB 11(12), 2018](https://www.vldb.org/pvldb/vol11/p1781-schelter.pdf) (FULL-TEXT, Amazon Research).
  - Lyft Verity's blocking operator is described in section 1.
  - Great Expectations and Soda were not researched in this pass.
- **Schema-registry blocking for events.** Confluent Schema Registry's default mode is BACKWARD. It "checks compatibility before accepting the new version". BACKWARD_TRANSITIVE and FULL_TRANSITIVE check against all earlier versions, not just the last one. The docs recommend BACKWARD_TRANSITIVE for Protobuf. — [Confluent docs: Schema Evolution and Compatibility](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) (FULL-TEXT, VENDOR; also cited in `operational_schema_changes.md`).
  - Meta validates logging-schema changes before publishing them to the platform (Tulip, section 2).

### Inferences

- Slim CI is the closest thing analytics has to a pre-merge canary. It runs the new code on real production inputs for the whole downstream subgraph, but in a throwaway schema with no real consumers.
- Slim CI catches build failures, contract breaks and test failures. It catches value shifts only if a data diff or a statistical check is added.
- Lineage coverage is usually incomplete. Downstream consumers outside the tool (notebooks, exports, feature pipelines in another system) are invisible unless declared as exposures or captured through OpenLineage. That limits any automated "who breaks?" check.

### Gaps

- I found no first-party write-up from a named non-vendor company that blocks merges on DataHub, Amundsen or OpenLineage impact analysis, and no published false-positive or catch rates for such gates.
- I found no published cost for full `state:modified+` CI rebuilds of large downstream subgraphs. The cost drivers (incremental models, large tables) appear only in vendor material.

---

## 4. Running the old and new pipelines side by side: shadow, backfill, diff, cut-over, cost

### Takeaway

There are three documented patterns:

1. **A parallel environment that backfills before swapping.** Airbnb Minerva staging, SQLMesh virtual environments, dbt blue/green with a database swap.
2. **Shadow then reverse-shadow with row-count and checksum diffs.** Meta's 2026 ingestion migration, which is outside the 2012-2025 window but the most detailed first-person account found.
3. **Versioned tables with consumer-paced migration.** dbt versions, Dali.

The costs are stated plainly in these sources:

- Backfills can fail to keep up with the rate of change.
- Shadow capacity limits how much can run in parallel.
- CDC pipelines carry bad data forward.
- Incremental and stateful tables break naive blue/green.

### Cited Findings

- **Airbnb Minerva staging environment (2021).** The key admission: "In practice, backfills often could not catch up with user changes, especially when updates affect many datasets". A dataset that changes rapidly "could end up in backfill mode forever and cause significant data downtime."
  - Fix: a shared Staging environment built from pending config changes. It backfills the modified datasets, and only then are the Staging configs merged into Production, which serves them "immediately".
  - Several unreleased changes share one set of backfills, and "Data consumers no longer experience data downtime."
  - Minerva calls this critical for "many mass data migrations projects". A separate prototyping tool "reads from Production but writes to an isolated sandbox".

  — [Pahwa et al., Airbnb Tech Blog, Jun 1 2021](https://medium.com/airbnb-engineering/airbnb-metric-computation-with-minerva-part-2-9afe6695b486) (FULL-TEXT via IA). No durations or costs are given.
- **Meta: shadow, then reverse shadow, for tens of thousands of ingestion jobs (posted May 12 2026).**
  - Exit criteria: no data difference, checked by "comparing both the row count and the checksum"; no landing-latency regression; no resource regression.
  - Phase 1: shadow jobs read the same source and write to a shadow table. Mismatches are investigated and fixed.
  - Phase 2, reverse shadow: the new job writes the production table and the old job writes the shadow table. Comparison continues, and rollback is possible "without needing to recreate or reconfigure the old system job". Backfills were run on both as an early signal.
  - Bad partitions were marked in metadata so propagation stopped.
  - Limits stated:
    - "migration capacity was limited", so jobs were migrated in batches;
    - CDC "means if previous landed data has any issues the problematic data will be passed to the new landed data";
    - each new job started with a full dump that is "slow and expensive".
  - Outcome: 100% of the workload moved and the legacy system was deprecated.

  — [Zihao Tao et al., "Migrating Data Ingestion Systems at Meta Scale", Engineering at Meta, May 12 2026](https://engineering.fb.com/2026/05/12/data-infrastructure/migrating-data-ingestion-systems-at-meta-scale/) (FULL-TEXT). Note: published after the 2012-2025 window. It is a platform migration rather than a schema change, but the mechanics carry over.
- **dbt blue/green on Snowflake (2020).**
  - Recipe: run and test the whole project into `stage`, then `alter database prod swap with stage`. "Hey presto! No bad data creeping into prod ever". It is credited to work by Alan at tails.com.
  - Limits raised in the thread:
    - "Too bad BigQuery won't let you rename a dataset";
    - views compiled with a schema prefix still point at the old schema after a schema swap;
    - incremental models break, because the demoted prod tables "don't have the latest incremental batch";
    - reporting roles can see both databases.
  - This is a full rebuild each run, so compute is twice that of an incremental run.

  — [Claire Carroll, "Performing a blue/green deploy of your dbt project on Snowflake", dbt Discourse, Jul 1 2020, and replies to 2022](https://discourse.getdbt.com/t/performing-a-blue-green-deploy-of-your-dbt-project-on-snowflake/1349) (FULL-TEXT via Discourse JSON).
- **SQLMesh virtual data environments (vendor).**
  - Each model version writes "into its own unique table". Consumers read through views, so promotion is "the atomic and almost instantaneous operation of updating a view". The author argues reverting is also cheap because old physical tables are kept.
  - Criticism of the alternative: re-running changes in production after testing gives no "guarantee of yielding the same results", and code and data are out of sync while the recompute runs.

  — [Iaroslav Zeigerman, "Virtual Data Environments", Tobiko Data, Apr 18 2023](https://www.tobikodata.com/blog/virtual-data-environments) (FULL-TEXT, VENDOR).
  - Fingerprints include upstream fingerprints, so unchanged model variants are reused across environments. — [SQLMesh docs: Environments](https://sqlmesh.readthedocs.io/en/stable/concepts/environments/) (FULL-TEXT, VENDOR).
- **Backfill as the hidden cost of any v2 table: Netflix (2023).**
  - Managed backfill turns "a few days or weeks of engineering work to build backfill workflows" into one click.
  - Before that, multi-stage pipelines needed backfill workflows created "manually ... for each of them".
  - Late-data lookback windows usually cost "almost X times more" than a pipeline that ignores late data (X = window in days).
  - Worked example: a two-stage pipeline of 7 h + 3.5 h with a 14-day window. Rebuilding it on incremental processing used about 10% of the resources, a >80% cost reduction.

  — [He, Zhang, Dixit, Netflix TechBlog, Nov 2023](https://netflixtechblog.com/incremental-processing-using-netflix-maestro-and-apache-iceberg-b8ba072ddeeb) (FULL-TEXT via IA).
- **Netflix Psyberg (2023).** Before automation, late upstream data meant an on-call engineer who "was usually not the SME" had to:
  - find the impacted workflows;
  - rerun stateful hourly loads in sequence (e.g. hours 3-6);
  - then catch up on the schedule.

  — [Abhinaya Shetty and Bharath Mummadisetty, "Streamlining Membership Data Engineering at Netflix with Psyberg", Nov 2023](https://netflixtechblog.com/1-streamlining-membership-data-engineering-at-netflix-with-psyberg-f68830617dd1) (FULL-TEXT via IA).
- **Functional data engineering (2018).** Immutable partitions, idempotent overwrite and "immutable data along with versioned logic are key to reproducibility".
  - A non-retroactive logic change (e.g. a 2018 tax rule) should be gated by effective date inside the task. Otherwise a later backfill of 2017 silently applies the 2018 rule. This is the closest analytic analogue to a flag inside the code.
  - Self-dependent partitions make reprocessing grow with history: more than a thousand partitions deep after three years of daily snapshots.

  — [Maxime Beauchemin, "Functional Data Engineering", Jan 8 2018](https://maximebeauchemin.medium.com/functional-data-engineering-a-modern-paradigm-for-batch-data-processing-2327ec32c42a) (FULL-TEXT via IA).
- **LinkedIn Dali** (section 2): consumers pull an upgrade by choosing a view version. This is versioned coexistence without dual materialization, since views are virtual.

### Inferences

- The analytic version of "dark launch, compare, ramp" exists and is documented: shadow table, diff, reverse shadow, retire.
- The ramp is by job or by consumer, never by percentage of rows or users. Meta ramped in job batches, Minerva swaps whole configs, and dbt moves consumers one ref at a time.
- The dominant cost is not the duplicate storage but the backfill. A new derived table version is useless until its history is recomputed, and for ten chained tables that recompute is sequential.

### Gaps

- No source gives the duplicate compute and storage cost, or the calendar duration, of running v1 and v2 of a derived-table chain in parallel for a schema change. Meta gives criteria but no durations. Minerva gives batch sizing but no totals.
- I found no first-party account that runs a feature-store-bound chain in shadow and diffs the resulting features. `feature_stores_and_versions.md` and `end_to_end_cases_and_failures.md` cover feature-level parallel versions.

---

## 5. Streaming: compatibility modes, versioned topics, dual publishing

### Takeaway

For compatible changes, the schema registry enforces in-place evolution and blocks incompatible schemas at registration. For incompatible changes, both vendor documentation and practitioners prescribe a new versioned topic, with producers writing to both and consumers migrating before the old topic is retired. This is expand/contract again, with dual-write consistency risk.

### Cited Findings

- **Compatibility modes and the incompatible-change escape hatch.**
  - BACKWARD is the default "so that you can rewind consumers to the beginning of the topic". Under BACKWARD, "upgrade all consumers before you start producing new events".
  - Kafka Streams supports only BACKWARD.
  - For incompatible changes: upgrade everyone at once, or more likely "create a brand-new topic and start migrating applications to use the new topic and new schema".

  — [Confluent docs: Schema Evolution and Compatibility](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html) (FULL-TEXT, VENDOR).
- **Versioned streams / dual schema upgrades.** Sources write to `payments-v1` and `payments-v2`. Each consumer reads the stream it is compatible with. After all consumers are upgraded, the v1 stream is retired. — [Confluent Developer, "Schema Evolution" pattern](https://developer.confluent.io/patterns/event-stream/schema-evolution/) (FULL-TEXT, VENDOR).
- **Dual-write risks.** Dual writes can diverge if one succeeds and the other fails, and push consistency into the application. — [AutoMQ blog](https://www.automq.com/blog/client-migration-hardest-part-moving-kafka) (SNIPPET, VENDOR).
  - Schema-registry "migration rules" (UPGRADE/DOWNGRADE transforms at read time) are a vendor alternative to a new topic. — [Confluent tutorial](https://developer.confluent.io/learn/streamables/how-to-evolve-your-schemas-with-migration-rules-or-data-quality-rules/) (SNIPPET, VENDOR).
- **Named organizations.**
  - LinkedIn split PageView into per-type topics behind a union Dali view (section 2).
  - Shopify keeps one domain per topic with compatible schemas and uses the registry plus ACLs to find consumers to warn (section 2).
  - Spotify redeploys event-specific infrastructure when an event schema changes: "Any changes to the event schema triggers the deployment" of new components. — [Spotify Engineering, May 28 2024](https://engineering.atspotify.com/2024/05/data-platform-explained-part-ii) (FULL-TEXT).
  - GoCardless uses contract-backed events on GCP Pub/Sub, published through an outbox pattern that adds database load (section 2).
  - Meta's Tulip covers forward and backward compatibility for logging schemas (section 2).

### Inferences

- In streaming, the "N and N-1 coexist" rule is enforced by machine at registration. Breaking changes still need a parallel topic for the life of the slowest consumer plus topic retention.

### Gaps

- I found no first-party post from a named company that gives the duration and cost of a v1/v2 topic dual-publish migration.

---

## 6. Rollback for data: what snapshots can and cannot undo

### Takeaway

Rolling back one table is cheap and fast in every table format. Iceberg can roll back to a snapshot or timestamp, Delta has `RESTORE`, lakeFS can revert a branch, and Snowflake has clone/Time Travel and SWAP. All of it is bounded by retention (`VACUUM`, snapshot expiry). None of it reaches downstream state:

- derived tables already rebuilt from the bad data;
- streaming consumers that already read it, where Delta's own docs warn of duplicates;
- exports, and models already trained.

Recovery from a bad publish is re-materialization (backfill) of everything downstream, which is why the sources put the gate before publish (WAP) rather than rely on rollback after it.

### Cited Findings

- **Iceberg.** `rollback_to_snapshot`, `rollback_to_timestamp`, `set_current_snapshot` and `cherrypick_snapshot` all move the current pointer. Snapshot retention, `expire_snapshots`, and per-branch or per-tag retention bound how far back you can go. — [Iceberg Spark procedures](https://iceberg.apache.org/docs/latest/spark-procedures/); [Iceberg branching](https://iceberg.apache.org/docs/latest/branching/) (FULL-TEXT).
- **Delta Lake RESTORE.**
  - Restoring to a version whose files were removed fails: "Restoring a table to an older version where the data files were deleted manually or by vacuum will fail."
  - Restore is a data-changing commit (`dataChange = true`). For a downstream Structured Streaming reader, the restored files look like new data, and "processing them may result in duplicate data." The docs give a worked example where rows from versions 0 and 1 are re-emitted.
  - `VACUUM` has a 7-day default retention, after which time travel to older versions is lost.

  — [Delta Lake utility docs](https://docs.delta.io/latest/delta-utility.html) (FULL-TEXT).
- **lakeFS.** You can reset a branch HEAD to an earlier commit "in seconds", or `lakectl branch revert` a bad commit, even when it spans multiple collections. The docs frame rollback as a stopgap before root-cause analysis and note you may not see the latest data afterwards. — [lakeFS docs: Rollback](https://docs.lakefs.io/guides/rollback/) (TOOL-EXTRACT, VENDOR).
- **Meta's CDC migration.** Rollback had to fix data that was already landed, because CDC carries bad data forward. Bad partitions were marked and repaired by backfill (section 4). — [Engineering at Meta, May 12 2026](https://engineering.fb.com/2026/05/12/data-infrastructure/migrating-data-ingestion-systems-at-meta-scale/) (FULL-TEXT).
- **Reverting has a cost unless old outputs are kept.** In a classic dev-to-prod flow, "State is discarded once the changes are deployed to production, making it impossible to reuse previously built datasets when reverting applied changes." — [Zeigerman, Tobiko, Apr 18 2023](https://www.tobikodata.com/blog/virtual-data-environments) (FULL-TEXT, VENDOR).
- **Retracting published data costs trust.** WAP's purpose is to avoid "the loss of trust that can occur if processed data is made available and then retrospectively withdrawn or fixed". — [lakeFS / Moffatt, 2023](https://lakefs.io/blog/data-engineering-patterns-write-audit-publish/) (FULL-TEXT, VENDOR).

### Inferences

- Code rollback restores behavior. Data rollback restores one table's pointer, and every downstream table, feature and trained model built in between stays as it was until it is recomputed.
- For a ten-table chain into a feature store, "rollback" means invalidating and backfilling every partition of every derived table written since the bad change, then dealing with any model trained on them. The article's "rollback" claim should be scoped to "per-table pointer rollback plus downstream re-materialization".

### Gaps

- I found no first-party incident write-up that times a full downstream re-materialization after a bad upstream publish (hours, cost).
- I did not research Snowflake Time Travel retention limits in detail. The cloning page says Time Travel and retention affect clones but gives no specific numbers in the parts read.

---

## 7. Limits and failures: silent breakage, semantics, late data, irreversibility

### Takeaway

The evidence supports four limits on carrying progressive delivery over to data pipelines:

1. **Silent semantic changes slip past structural gates.** Field meaning, units, filters, partial nulls.
2. **Late data and daily partitions** make "the new version" a moving target that has to be recomputed over a lookback window.
3. **Exposure can't be split.** There is no per-user or percentage exposure for a table, so ramps are per consumer or per job.
4. **Published data propagates.** Once it has spread downstream, it cannot be withdrawn, only recomputed.

Several organizations say outright that breaking changes are avoided rather than rolled out. Others (Uber, Lyft) report silent upstream changes reaching ML features and dashboards and being caught late.

### Cited Findings

- **Semantic change as the core problem (LinkedIn, 2017).** Schema and semantic changes "can have widespread downstream impact". The example is seconds to milliseconds. The cost "invariably overshadows the benefits, and as a result, necessary changes tend to get put off". — [Steinbach and Rajamani, LinkedIn, Nov 9 2017](https://engineering.linkedin.com/blog/2017/11/dali-views--functions-as-a-service-for-big-data) (FULL-TEXT).
- **Structural contracts miss logic.**
  - dbt lists metric-logic, granularity and filter changes as "might be breaking". — [dbt coordinating versions](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-6-coordinate-versions) (FULL-TEXT).
  - "dbt's model contracts don't take into account logic, only structure". — [Tobiko, Apr 20 2023](https://tobikodata.com/the-false-promise-of-dbt-contracts.html) (FULL-TEXT, VENDOR).
  - Uber: schemas "do not check the actual data values". — [Shiftehfar, Uber, Oct 17 2018](https://www.uber.com/blog/uber-big-data-platform/) (FULL-TEXT via IA).
- **Silent upstream changes reaching ML features (Uber, 2023).**
  - Uber lists among its data-incident causes that new features "may alter the logs", e.g. a field "omitted due to schema changes, or the meaning of a field may be changed".
  - Partial-data incidents take 5x longer to detect than ETL or infra failures.
  - A missing fare component in 10% of sessions in key US cities was "detected after 45 days manually by one of the data scientists". It fed fares ML models, and Uber estimates such an incident at millions of dollars.

  — [Uber, "D3: An Automated System to Detect Data Drifts"](https://www.uber.com/blog/d3-an-automated-system-to-detect-data-drifts/) (FULL-TEXT via IA). Already detailed in `end_to_end_cases_and_failures.md`; cite there to avoid duplication.
  - Uber's earlier statistical monitoring treats a break in a seasonal trend as possibly "a change in the schema of a data table or its ancestor". — [Uber, "Monitoring Data Quality at Scale with Statistical Modeling"](https://www.uber.com/blog/monitoring-data-quality-at-scale/) (FULL-TEXT via IA).
- **Lyft (2023).**
  - A TrinoSQL transformation bug nulled `session_id`, and a bug in the origin web service inflated cancel counts.
  - Poor Hive data "caused tainted experimentation metrics, inaccurate machine learning features, and flawed executive dashboards".
  - Late detection "increased the difficulty and cost of data backfills".

  — [McPhillips, Lyft, Oct 2023](https://eng.lyft.com/from-big-data-to-better-data-ensuring-data-quality-with-verity-a996b49343f6) (FULL-TEXT via IA).
- **Breaking changes avoided rather than rolled out.** Shopify: "we do our best as a company to avoid them whenever possible" and wants "as much forewarning as possible". — [Shopify, Mar 12 2021](https://shopify.engineering/capturing-every-change-shopify-sharded-monolith) (FULL-TEXT).
  - dbt: "You should opt for non-breaking changes whenever possible", at the cost of models with "lots of unused or deprecated columns". — [dbt model versions](https://docs.getdbt.com/docs/mesh/govern/model-versions) (FULL-TEXT).
- **CDC couples consumers to the producer's internal model.** Shopify: "the tight coupling of the external event consumers to the internal data model of the source". This is quoted approvingly by Andrew Jones as the reason for contracts. — [Shopify, 2021](https://shopify.engineering/capturing-every-change-shopify-sharded-monolith); [Jones, Apr 2021](https://andrew-jones.com/blog/data-contracts/) (FULL-TEXT).
  - GoCardless found producers reluctant to adopt contracts for analytics data while CDC remained (section 2).
- **Late data and partitions.**
  - Netflix pipelines run with "a lag of a few hours to leave room for late-arriving data". Fixed lookbacks reprocess redundantly, e.g. "reprocessing the past 6 hours of data every hour". — [Netflix Psyberg, Nov 2023](https://netflixtechblog.com/1-streamlining-membership-data-engineering-at-netflix-with-psyberg-f68830617dd1) (FULL-TEXT via IA).
  - Lookback windows cost about X times more; the 14-day example is in section 4. — [Netflix Maestro IPS, Nov 2023](https://netflixtechblog.com/incremental-processing-using-netflix-maestro-and-apache-iceberg-b8ba072ddeeb) (FULL-TEXT via IA).
  - Beauchemin: state that depends on prior partitions grows the reprocessing graph linearly with history (section 4).
- **Rollback does not undo propagation.**
  - Delta RESTORE re-emits rows to streaming readers, and retention bounds rollback (section 6).
  - CDC re-propagates bad landed data (Meta, section 6).
  - Minerva's backfills "could not catch up with user changes" (section 4).
- **Analytics-specific objections to blue/green.** BigQuery could not rename datasets (2020). Incremental models lose their latest batch on swap. Views keep pointing at the old schema. — [dbt Discourse thread, 2020-2022](https://discourse.getdbt.com/t/performing-a-blue-green-deploy-of-your-dbt-project-on-snowflake/1349) (FULL-TEXT).
- **ML literature on unstable data dependencies.** Sculley et al. 2015 and Google's "data cascades" (CHI 2021) are already summarized in `end_to_end_cases_and_failures.md`. They are not repeated here.

### Inferences

- The reader's objection holds in specific ways:
  - you cannot send 5% of a table's rows to a new derivation and still have a coherent table;
  - consumers (and ML models trained on history) need the whole history recomputed under the new logic;
  - the switch, once consumers and features have read the data, cannot be cleanly undone.
- The evidence still shows the progressive-delivery toolkit translates:
  - a dark write (WAP, staging, shadow tables);
  - an automated gate (contract, tests, data diff, Verity/Deequ checks);
  - an atomic switch (snapshot fast-forward, view or SWAP);
  - coexistence of N and N+1 with a deprecation window (dbt versions, Dali views, v2 topics);
  - comparison during cut-over (Meta reverse shadow).
- What does not translate is percentage-based exposure and cheap rollback of downstream effects. Those are replaced by consumer-by-consumer migration and backfill.
- A fair statement for the article: for data, "rollback" is per table and fast, "undo" of downstream effects is a backfill, and the main safety mechanism is therefore the pre-publish gate plus versioned coexistence, not post-release ramping.

### Gaps

- I found no first-party postmortem, with a timeline, from a named company in which a specific upstream column rename or type change silently broke a chain of derived tables into an ML feature. The Uber D3 case is the closest: a missing field component, detected after 45 days.
- I found no published argument by a named practitioner that explicitly says data "cannot be feature-flagged". The closest sources are Beauchemin's effective-date conditional logic inside tasks (a kind of time-based flag) and the blue/green objections.
- Several Medium-hosted posts (Airbnb Midas and Wall) could not be read live or from the archive. The archive also rate-limited some requests (Netflix Dataflow, the Tabular WAP post).
