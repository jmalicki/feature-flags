# Streaming and event schema changes: progressive delivery, coexistence and rollback (2012-2026)

Scope note. These notes extend, and try not to repeat, `analytical_pipeline_changes.md` section 5 and `operational_schema_changes.md` section 6, which already cite the Confluent BACKWARD default, the Confluent "Schema Evolution" pattern with `payments-v1`/`payments-v2`, the Axon upcaster docs, the Greg Young table of contents, Shopify's CDC post, Spotify and GoCardless. Chronon's `online=True` lock and Tecton's checkpoint restriction are in `feature_stores_and_versions.md`. Where I touch those sources here, it is for a new detail.

Access labels: FULL-TEXT means I downloaded the raw page or PDF with curl and read or searched the text myself, so short quotations are exact. TOOL-EXTRACT means a fetch tool summarised the page; no quotations are taken from those. SNIPPET means I only saw search-result text. VENDOR marks material from a company selling the product. Working files are in a local scratch folder (not in this repository)

Sites that refused automated access (curl and the fetch tool both): netflixtechblog.com and medium.com (Netflix Data Mesh post, Airbnb SpinalTap post), swift.com (all pages and the CBPR+ roadmap PDF, HTTP 403), frbservices.org (news and FAQ pages return the site's 404 page to automated clients; only the Implementation Center landing page loaded), uber.com via curl (HTTP 406; the fetch tool worked once), careersatdoordash.com (403). I did not use mirrors.

## 1. Schema evolution rules: registry compatibility types, formats, subject naming, migration rules

### Takeaway

Every major log has a registry that rejects a schema version that breaks the configured compatibility rule. The compatibility type fixes the upgrade order: BACKWARD means upgrade consumers first, FORWARD means upgrade producers first, and FULL lets either side go first. Defaults differ by product: Confluent and Glue default or recommend BACKWARD, Pulsar defaults to FULL for Avro and JSON, Nakadi defaults to forward, and Pub/Sub effectively requires full compatibility. A truly breaking change is outside all these modes. It needs either a new topic or Confluent's newer, licensed "migration rules", which transform messages between major versions when they are read.

### Cited Findings

Confluent Schema Registry (VENDOR, FULL-TEXT). Confluent, "Schema Evolution and Compatibility for Schema Registry on Confluent Platform", current docs, undated, read 2026-11-11. [docs.confluent.io](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html). Locator: "Compatibility types", "Order of upgrading clients".

- Summary lines on the page: Backward means "consumers using new schema can read data written with old schema (add optional fields, remove fields)". Forward means "consumers using old schema can read data written with new schema (remove optional fields, add fields)". Full means "add/remove optional fields only". Transitive modes are "checked against all previous versions, not just the last one".
- Non-transitive modes check only X against X-1. "The Confluent Schema Registry default compatibility type BACKWARD is non-transitive", so a chain of individually compatible changes can still make X unreadable against X-2.
- Upgrade order, quoted from the page:
  - BACKWARD and BACKWARD_TRANSITIVE: "upgrade all consumers before you start producing new events".
  - FORWARD and FORWARD_TRANSITIVE: "first upgrade all producers to using the new schema and make sure the data already produced using the older schemas are not available to consumers, then upgrade the consumers".
  - FULL and FULL_TRANSITIVE: "you can upgrade the producers and consumers independently".
  - NONE: "compatibility checks are disabled", so "be cautious about when to upgrade clients".
- Why BACKWARD is the default: "so that you can rewind consumers to the beginning of the topic". FORWARD "is harder to work with" because "you need to anticipate all future changes".
- Kafka Streams is the exception to "plain consumer first". A Streams app reads both the input topic and its own state and changelog, which still hold old-schema data. So "only BACKWARD compatibility is supported", and "The Kafka Streams apps must be upgraded first, then it's safe to upgrade the upstream producer". The same page also says FULL, FULL_TRANSITIVE and BACKWARD_TRANSITIVE "are always supported for Kafka Streams" because they include backward compatibility.
- For a truly incompatible change, such as Number to String, "upgrade all producers and consumers to the new schema version at the same time or, more likely, create a brand-new topic".
- Avro has no optional keyword. A field is made nullable with a union that includes "null", and Avro "requires that the default value conform to the first branch of the union". Adding a field without a default is not backward compatible.
- JSON Schema compatibility depends on a `compatibilityPolicy` (LENIENT or STRICT) and on whether the content model is open or closed (`additionalProperties`). The page also mentions a third policy, LOGICAL. I could not reliably reconstruct the per-cell check marks of the format table from the extracted text, so I do not reproduce it.
- Protobuf: "best practice for Protobuf is to use BACKWARD_TRANSITIVE, as adding new message types is not forward compatible". This is repeated on the [Protobuf serdes page](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/serdes-protobuf.html) (FULL-TEXT).
- Limits: vendor documentation that describes intended behaviour, not field experience.

Subject naming strategies (VENDOR, FULL-TEXT). Confluent, "Formats, Serializers, and Deserializers", current docs. [docs.confluent.io](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html). Locator: "Subject name strategy".

- TopicNameStrategy "Derives the subject name from the topic name. This strategy is the default."
- RecordNameStrategy and TopicRecordNameStrategy let "logically related events that can have different data structures" share a topic.
- The default "implicitly requires all messages in the same topic to conform to the same schema". This is why a breaking change under the default strategy usually means a new topic.
- ksqlDB "uses only the default TopicNameStrategy".
- The strategy configured on the broker for schema ID validation "doesn't propagate to clients", so clients must be configured separately.

Confluent data contracts and migration rules (VENDOR, FULL-TEXT). Confluent, "Data Contracts for Schema Registry on Confluent Platform", current docs. [docs.confluent.io](https://docs.confluent.io/platform/current/schema-registry/fundamentals/data-contracts.html). Locator: "Requirements", "Complex schema evolution", "Migration rules".

- Availability: "Schema rules are only available on Confluent Enterprise and Confluent Cloud with the Stream Governance Advanced package", and "only supported in version 7.4 or above". They are not in the Community edition. "JavaScript and .NET don't support schema migration rules for Protobuf". Non-Java clients "don't yet support the DLQ action".
- The page names two ways to make an incompatible change. "Inter-topic migrations" set up a new topic and translate the data. This is described as "complex because you must switch consumers from the old topic to the new topic without skipping data or processing it twice", which needs offset correlation, and "If something goes wrong, you also need to switch back to the old topic, again at the correct correlation point". "Intra-topic migrations" transform data at consume time. The intra-topic approach is "available starting with Confluent Platform 7.4".
- Mechanism:
  - The schema carries metadata such as `application.major.version`.
  - A `compatibilityGroup` setting limits compatibility checks to schemas with the same major version, so a breaking major version can be registered in the same subject.
  - A consumer pins itself with `use.latest.with.metadata=application.major.version=2`, with a cache TTL. The doc's example is 300 seconds.
  - Rules run in "UPGRADE mode, DOWNGRADE mode, or both (UPDOWN)". "The UPGRADE rule allows new consumers to read old messages, and the DOWNGRADE rule allows old consumers to read new messages." Version gaps run "transitively, from 1 to 2 and then from 2 to 3".
  - Rule executors include JSONata and Google CEL. The intro says "upgrade and downgrade transformations that use JSONata or CEL expressions", and the worked migration examples use JSONata.
- Confluent's claim: rules "accommodate even changes that would normally break downstream components", and producers "can use incompatible versions 1, 2, and 3 of a schema at the same time".
- Limits: I found no first-person production account of migration rules. Status is generally available (GA) in licensed editions, not preview, as far as this page shows. Transforms add work on every read. Rollback means removing or changing a rule, and consumers pick that up only after the cache TTL.

Protobuf and Buf (FULL-TEXT).

- Google, "Language Guide (proto 3)", protobuf.dev, current. [protobuf.dev](https://protobuf.dev/programming-guides/proto3/). Locator: "Assigning Field Numbers", "Consequences of Reusing Field Numbers", "Reserved Field Numbers".
  - "Field numbers should never be reused. Never take a field number out of the reserved list for reuse with a new field definition."
  - "Reusing a field number makes decoding wire-format messages ambiguous." Listed consequences include "Leaked PII/SPII" and "Data corruption".
  - Deleted field numbers must be reserved.
- AWS Glue's docs (below) add that in proto3 "all fields are optional (including repeated)".
- Buf, "Rules and categories" (breaking-change detection), current docs. [buf.build](https://buf.build/docs/breaking/rules/).
  - Four categories, "from strictest to most lenient": FILE, which is the default and protects generated code per file; PACKAGE; WIRE_JSON, which detects "changes that break wire (binary) or JSON encoding"; and WIRE, binary only.
  - "If you don't know which to pick, start with FILE (the default)".
  - Example rules: `FIELD_NO_DELETE`, `FIELD_NO_DELETE_UNLESS_NUMBER_RESERVED`, `FIELD_SAME_DEFAULT`. Changing a default "isn't backwards-compatible since it means that producers and consumers of the schema interpret serialized data differently".
  - Limit: Buf checks source files against a previous version, such as a git branch or registry module, in CI. It does not know what data is already in a topic.
- Martin Kleppmann, "Schema evolution in Avro, Protocol Buffers and Thrift", blog, 5 December 2012. [martin.kleppmann.com](https://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html). FULL-TEXT. I could not read *Designing Data-Intensive Applications* chapter 4 itself, so I cite this blog, which covers the same ground.
  - Protobuf: "you can never change a tag number". Changing required versus optional risks runtime errors.
  - Avro resolves a writer's schema into a reader's schema by field name. So renaming means: "first update all readers of the data to use the new field name, while keeping the old name as an alias", then update writers.
  - Adding a type to a union: "first update all readers"; "Only once all readers are updated, the writers may start putting this new type".
  - Removing a field is possible only if it "previously had a default value".
  - When records are stored one by one, each needs a schema version, so "You then need a schema registry".

Other logs (FULL-TEXT).

- Apache Pulsar, "Understand schema", docs (next). [pulsar.apache.org](https://pulsar.apache.org/docs/next/schema-understand/).
  - Eight strategies: ALWAYS_COMPATIBLE, ALWAYS_INCOMPATIBLE, BACKWARD, BACKWARD_TRANSITIVE, FORWARD, FORWARD_TRANSITIVE, FULL and FULL_TRANSITIVE.
  - "For Avro and JSON, the default one is FULL. For others, the default one is ALWAYS_INCOMPATIBLE."
  - Upgrade order matches Confluent: BACKWARD means "upgrade all consumers first".
  - Schema AutoUpdate is on by default.
  - For PROTOBUF_NATIVE, "the default checker compares root message names", and field-level checks are opt-in.
- Google Cloud Pub/Sub, "Commit a schema revision", docs. [cloud.google.com](https://cloud.google.com/pubsub/docs/commit-schema-revision).
  - For Protobuf, "you can add or remove optional fields. You cannot add or delete other fields. You also cannot edit any existing field."
  - For Avro, a new revision "must follow the rules as though it is both the reader schema and the writer schema", which means fully compatible.
  - "A schema can have a maximum of 20 revisions at one time." Topics validate against a revision range, and changes to that range "might take a few minutes" to take effect. Schemas can be rolled back.
- AWS Glue Schema Registry (used with Kinesis and MSK), docs. [docs.aws.amazon.com](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html).
  - Eight modes: NONE, DISABLED, BACKWARD, BACKWARD_ALL, FORWARD, FORWARD_ALL, FULL and FULL_ALL. The_ALL suffix is the transitive equivalent.
  - DISABLED "prevents versioning for a particular schema".
  - BACKWARD "is recommended".
  - There is a movable "checkpoint" version that compatibility is checked against.

Zalando Nakadi and the Zalando API guidelines (FULL-TEXT). Zalando, "Nakadi Event Broker" manual. [nakadi.io](https://nakadi.io/manual.html). Locator: "Compatibility modes". Zalando, "RESTful API and Event Guidelines", living document with changelog entries up to 2025-11-12. [opensource.zalando.com](https://opensource.zalando.com/restful-api-guidelines/). Locator: rules "MUST carefully define the compatibility mode", "MUST use semantic versioning of event type schemas", "MUST maintain backwards compatibility for events".

- Nakadi has three modes: `compatible` (full), `forward` and `none`. "The default compatibility mode is forward compatible, but full compatibility usage is definitely encouraged."
- Zalando requires `compatible` "to have data processed by business intelligence and long term event storage by the data lake".
- In `compatible` mode only "addition of new optional attributes" is allowed, and `additionalProperties`, `additionalItems`, `not` and `patternProperties` are not supported. Undeclared properties are rejected, so "producers should first update their schemas with new attributes and only after that start producing events".
- Modes should only move toward stricter ones (none, then forward, then compatible). Admins can loosen them for an incompatible change, which "assumes that admins are sure".
- Event types carry a semantic version. Under `compatible` or `forward`, "MAJOR breaking changes are not allowed". Renaming or removing fields, or adding required fields, are MAJOR changes.
- Event type names may carry a major version suffix: `<functional-name>.<event-name>[.<version>]`, where the version is the "major version of non compatible schemas". A breaking change is therefore a new event type, which is the same idea as a new topic.
- Removing an optional field means stopping sending it. Deleting it from the schema "is not allowed, as otherwise it could be added back with an incompatible type".

### Inferences

- The registry is a machine-enforced form of "N and N-1 coexist" with a fixed upgrade order. For the article: a backward-compatible schema change is safe only if every consumer, including stateful stream processors, ships before the producer. A forward-compatible change reverses that order.
- BACKWARD alone (non-transitive) does not guarantee that a consumer replaying from the start of a long-retention or compacted topic can read every old record. Teams that replay need the _TRANSITIVE variants. This is an inference from the documented X versus X-1 rule.
- Migration rules are the one mechanism that turns a breaking change into something like a flagged rollout inside one topic. Consumers opt into a major version by configuration. It is vendor-specific, licensed, and lacks published field reports.

### Gaps

- I could not reconstruct Confluent's per-format check-mark table reliably from text, so cite the definitions, not the table cells.
- I could not read DDIA chapter 4. The 2012 Kleppmann blog stands in for it.
- I found no independent, first-person account of Confluent migration rules in production.

## 2. First-person schema governance at scale

### Takeaway

The accounts I could read share one rule: compatible changes stay on the existing topic and are enforced at registration, and incompatible changes get a new topic or event type. Consumers move on their own timeline. Most accounts say little about how the old topic is retired. Numbers are mostly about scale, not about how many breaking changes happened or how long dual topics ran.

### Cited Findings

LinkedIn.

- Joel Koshy, "Kafka Ecosystem at LinkedIn", LinkedIn Engineering, 19 April 2016. [engineering.linkedin.com](https://engineering.linkedin.com/blog/2016/04/kafka-ecosystem-at-linkedin). FULL-TEXT.
  - "more than 1.4 trillion messages per day across over 1400 brokers".
  - Each producer "registers Avro schemas in the schema registry and embeds a schema-ID in each serialized message".
  - The wrapped producer (LiKafka) handles schema registration and Avro encoding. Audit events count messages per topic in 10-minute windows, and an auditor reconciles counts to detect loss.
  - Limits: no breaking-change procedure is described. The 2012 IEEE paper's additive-only rule with a fatal error on failure is already in `end_to_end_cases_and_failures.md`.

Yelp.

- Chia-Chi Lin, "More Than Just a Schema Store", Yelp Engineering, 11 August 2016. [engineeringblog.yelp.com](https://engineeringblog.yelp.com/2016/08/more-than-just-a-schema-store.html). FULL-TEXT. This is the most explicit public description of automatic topic versioning.
  - Before: upstream changes could "cause the downstream batch jobs or systems to crash or necessitate a backfill". The process was "pretty labor-intensive".
  - Rule: "Only compatible schemas can use the same topic. When an incompatible schema is registered, the Schematizer creates a new topic in the same namespace and source." Compatibility follows Avro resolution in both directions.
  - Worked example on the MySQL `Business` table: adding a column with a default stays on the same topic, while changing a column from int to varchar creates a new topic.
  - Custom rules: any change to primary-key fields is incompatible because the key drives log compaction. A schema that starts including a PII field also gets a new topic.
  - Consumers "have the flexibility to transition to the newer topics based on their own timeline".
  - Limits: no retirement policy for old topics and no counts of topic versions.

Uber.

- Yupeng Fu and Chinmay Soman, "Real-time Data Infrastructure at Uber", SIGMOD 2021, arXiv 2104.00087. [arxiv.org](https://arxiv.org/pdf/2104.00087). FULL-TEXT PDF. Locators: section 3 requirements (metadata), section 4.3 (Pinot), section 7 "Backfill", section 8 lessons.
  - Scale: "As of October 2020, trillions of messages and petabytes of such data were generated per day".
  - The metadata layer must "version the metadata and have checks for ensuring backward compatibility across versions".
  - A "centralized metadata repository" is "the source of truth for schemas across both realtime and offline systems such as Kafka, Pinot and Hive", and it tracks lineage. Pinot "integrates with Uber's schema service to automatically infer the schema from the input Kafka topic".
  - Limits: the paper does not describe how a breaking change is rolled out. The data-culture post on mandatory schema reviewers is already cited in `end_to_end_cases_and_failures.md`.

Zalando.

- See section 1 for Nakadi. Full compatibility is mandatory for data-lake ingestion, and event types use semantic versions. A breaking change becomes a new versioned event type name.

Netflix.

- netflixtechblog.com refused access. SNIPPET only: InfoQ's 2022 coverage of the Data Mesh post says Avro is the standard schema format and Kafka is the transport. A 2020 Flink Forward deck by Justin Cunningham, seen only in a search summary, describes processors with fixed input and output schemas that can opt in to automatic schema upgrades. Do not quote these; they are not verified from the Netflix post.

Airbnb SpinalTap.

- The Medium post (Jad Abi-Samra, 15 August 2018, per search) refused access. airbnb.tech's project page (FULL-TEXT) says only that SpinalTap propagates mutations "as standardized events". Its schema-change handling is not verified.

Clear Street (brokerage, financial services).

- Clear Street, "Switching to Protobuf (from Avro) on Kafka", 27 January 2023. [clearstreet.io](https://clearstreet.io/news/blog/switching-to-protobuf-from-avro-on-kafka). FULL-TEXT.
  - They "hit issues with Avro and our change data captures (CDCs)" from Debezium, and "had problems with schema migrations using Avro that could potentially lead to massive rollbacks".
  - They moved to Protobuf with "a remote schema registry using Buf.io". There was a debate over migrating historical Avro data.
  - Numbers: network use fell from "32–64 kilobytes per second to only 10 or 12"; "We removed a full 20% of the work from the services"; about 100 engineers.
  - Limits: no detail on how the two formats coexisted during the switch.

Wise, Monzo, Nubank, ING.

- See section 8. Wise, Monzo and Nubank say almost nothing public about schema rules. ING has conference talk listings only.

Shopify.

- Shopify's CDC post, already in `analytical_pipeline_changes.md`, remains the main source. I found no Shopify post on Kafka schema versioning beyond it.

Not found or not researched to conclusion: Wix, Pinterest, Robinhood, Adyen, Rabobank, BNY, Capital One, Goldman Sachs. Searches returned only generic or third-party material, so nothing about them is cited.

### Inferences

- Yelp's Schematizer is the cleanest real example of "compatibility decides whether you get a new version". It makes the versioned topic automatic instead of a human decision, and it treats a key change or a privacy-class change as breaking even when the format would allow it.
- The common public pattern is "forbid or fork": breaking changes are either blocked (LinkedIn 2012, Zalando `compatible`) or forked into a new topic (Yelp, Nakadi versioned names). Progressive migration then happens consumer by consumer.

### Gaps

- No organisation in this set published how many incompatible topic versions it created, how long old topics lived, or what dual publishing cost.
- I could not read the Netflix and Airbnb primary posts.

## 3. Breaking changes in practice: versioned topics, dual publishing, upcasting, retirement

### Takeaway

A breaking event change is handled in one of three ways. You can fork a new topic and dual-publish or translate into it. You can transform on read inside one topic (upcasting, or Confluent migration rules). Or you can copy and transform the whole stream. Every source agrees the fork is operationally heavy: consumers must switch at an exact offset correlation, and switching back is just as hard. No source I could read gives a duration or cost for running dual topics.

### Cited Findings

- Confluent data contracts (VENDOR, FULL-TEXT, cited in section 1). Moving consumers to a new topic requires that you "correlate the offsets of the two topics and start each consumer at the correct correlation point in the new topic", and rollback needs the same correlation in reverse.
- Confluent Developer course, "Case Study: Evolving Schemas" (VENDOR, FULL-TEXT, undated). [developer.confluent.io](https://developer.confluent.io/courses/microservices/case-study-evolving-schemas/).
  - Worked example for a change that cannot be done in place, a broken encryption algorithm. The team writes "a process that reads all of the events, re-encrypts each one, and emits them on a new Version 2 topic".
  - Consumers move to v2, then the producer switches, then "they can update the original producer to emit events with the new encryption" and "remove the migration process and delete any old events".
  - The cheaper alternative, a flag field with a default, is rejected because old insecure events would remain.
  - Limits: a teaching example, not a production report.
- Debezium outbox, Gunnar Morling (then Debezium lead, Red Hat), "Reliable Microservices Data Exchange With the Outbox Pattern", 19 February 2019. [debezium.io](https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/). FULL-TEXT.
  - Outbox events should be treated as "part of the emitting service's API"; change them "with compatibility considerations in mind".
  - Consumers "should be lenient" and "not fail when encountering unknown attributes".
- Martin Kleppmann 2012 (section 1). Rename via alias is a two-phase parallel change in Avro: readers first, then writers.
- Greg Young, *Versioning in an Event Sourced System*, Leanpub. [leanpub.com](https://leanpub.com/esversioning/read). Table of contents only (FULL-TEXT of the TOC page; the chapter text did not load).
  - Chapters that bear on this question include "Double Write", "Weak Schema", "Mapping", "Wrapper", "Negotiation", "Copy and Replace", "Copy-Transform", "Versioning Bankrupty" [sic] and "Internal vs External Models".
  - I could not read the chapter bodies, so I do not characterise their advice. The existing notes already list part of this TOC.
- Kafka Streams (Apache Kafka docs, trunk, FULL-TEXT from GitHub [docs/streams/developer-guide/dsl-topology-naming.md](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/dsl-topology-naming.md)).
  - Internal topics are a breaking-change trap. Generated processor names shift when you add an operator. When the state store and changelog names change, "you can't do a rolling re-deployment of your updated topology", and you "must use the Streams Reset Tool to re-calculate the aggregations".
  - The docs recommend explicit names and offer `ensure.explicit.internal.resource.naming` to enforce them.

Duration and cost.

- Jay Kreps (section 4) estimates only for a reprocessing copy: "temporarily having 2x the storage space in the output database" and "an extra few percent of capacity" on a shared cluster.
- Yelp leaves consumers to migrate "based on their own timeline" and gives no end date (section 2).
- Zalando forbids removing fields from schemas at all.

### Inferences

- For the article: the event analogue of the expand/contract column change is new topic (expand), dual-publish or translate, migrate consumers one by one, stop the old producer, then let retention expire the old topic (contract). The contract step is bounded by the slowest consumer plus topic retention. With compacted or infinite-retention topics there is no natural end.
- Translate-on-read (upcasting, migration rules) avoids a second topic, but every consumer then carries transformation code or configuration forever, or until a copy-transform rewrites history. That trade is the "versioning bankruptcy" problem the Young TOC alludes to; I have not verified its content.

### Gaps

- No first-person figure for how long `-v1` and `-v2` topics ran side by side, or what dual publishing cost in broker storage or engineering time.
- Greg Young's chapter text and DDIA chapter 4 were not readable.

## 4. Progressive delivery of stream processors: shadow, blue/green, savepoints, replay, Kappa

### Takeaway

The documented progressive pattern for stream jobs is a second copy. Run the new job on its own consumer group, with its own Debezium server ID and its own sinks. Compare it, then switch the readers. Kreps described this in 2014 as reprocessing from the start of the log into a new output table, with instant revert by pointing back to the old table. In 2026 Grab described an automated shadow stage, but its comparison is health and throughput, not record-level diffs. The hard limits are state: Flink and Spark restrict which state changes survive a restart, Kafka Streams has no consistent state rollback, and Uber could not use pure Kappa because it keeps only a few days of Kafka retention.

### Cited Findings

Jay Kreps, "Questioning the Lambda Architecture", O'Reilly Radar, 2 July 2014. [oreilly.com](https://www.oreilly.com/radar/questioning-the-lambda-architecture/). FULL-TEXT.

- The procedure, verbatim steps: "start a second instance of your stream processing job that starts processing from the beginning of the retained data, but direct this output data to a new output table." Then "When the second job has caught up, switch the application to read from the new table." Then "Stop the old version of the job, and delete the old output table."
- Retention as the limit: "if you want to reprocess up to 30 days of data, set your retention in Kafka to 30 days."
- Rollback and gradual cutover: keeping both tables "allows you to revert back instantaneously to the old logic by just having a button that redirects the application to the old table". For important cases, "you can control the cut-over with an automatic A/B test or bandit algorithm".
- Naming: "Maybe we could call this the Kappa Architecture".
- Cost: "temporarily having 2x the storage space in the output database"; budget "an extra few percent of capacity" on a shared cluster.
- LinkedIn kept "more than a petabyte of Kafka storage online".

Uber, the limit of Kappa.

- Fu and Soman, SIGMOD 2021 (FULL-TEXT, section 7). Kappa "requires very long data retention in Kafka and may not be very efficient in terms of processing throughput". Uber limits "Kafka retention to only a few days. Therefore, we're unable to adopt the Kappa architecture."
- Uber's alternative, "Kappa+", reuses the streaming logic but "can directly read archived data from offline datasets such as Hive". This needed work on bounded-input start and end, throttling of historic throughput, and job tuning.
- Amey Chaugule, "Designing a Production-Ready Kappa Architecture for Timely Data Stream Processing", Uber Engineering, 23 January 2020. [uber.com](https://www.uber.com/blog/kappa-architecture-data-stream-processing/). TOOL-EXTRACT, no quotations. Uber backfills a Spark Structured Streaming job by swapping the Kafka source for a Hive source.
  - The production job uses 10-second windows on 75 cores and 1.2 TB of memory.
  - The backfill covered about nine days of data, about 10 TB. Watermarking was relaxed from 10 seconds to 2 hours.
  - A backfill can take about a day for a few days of data.
  - Replaying Hive into Kafka was rejected because it could overwhelm Kafka and needed one-off topics.
  - The post does not describe validating backfill output or switching readers.

Grab, automated shadow stage for Flink.

- Grab Engineering (Coban data streaming team), "Enhancing Flink deployment with shadow testing", 7 May 2026. [engineering.grab.com](https://engineering.grab.com/enchancing-flink-shadow-testing). FULL-TEXT.
- Motivation: production-only failures, including a new version "unable to resume from a production checkpoint or savepoint taken by the previous version". Before shadowing, automatic rollback came after 10 minutes of observation, "leading to a downtime of the application for about the same duration".
- Mechanism: the shadow runs in a `shadow` Kubernetes namespace with a distinct job ID and `isShadow=true`. Platform connectors re-point themselves:
  - The Kafka consumer group gets a `-shadow` suffix, "to consume a full copy of the data stream without interfering with the Main application".
  - The Debezium server-ID range shifts, for example 1001-2000 to 2001-3000, so the shadow gets its own binlog stream.
  - The Kafka sink goes to a dedicated shadow cluster "with auto.create.topics.enable=true and 8h retention".
  - S3 goes to a shadow bucket with "a 7-day retention lifecycle policy".
  - Metrics get a `shadow.` prefix.
- Gate: the shadow "runs for a configured period of 1 hour by default", and success is judged by job-manager status. Users can compare Kafka `messages.in_rate` between the main and shadow sink topics. The feature is opt-in per deployment.
- Limits: the comparison is stability and throughput, not output content. The post does not say whether the shadow restores from the main job's savepoint. Only some connectors are supported.

Flink state and savepoints (Apache Flink docs, stable, FULL-TEXT).

- "State Schema Evolution". [nightlies.apache.org](https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/fault-tolerance/serialization/schema_evolution/).
  - Procedure: take a savepoint, change state types, restore. Flink migrates "automatically, and independently for each state".
  - "Currently, schema evolution is supported only for POJO and Avro types". For POJOs, fields can be added or removed, but "Declared fields types cannot change" and the class name cannot change.
  - "Schema evolution of keys is not supported", because dropping a key field could make separate keys identical. "Kryo cannot be used for schema evolution."
  - The workaround is a custom serializer or the State Processor API.
- "Upgrading Applications and Flink Versions". [nightlies.apache.org](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/upgrading/).
  - State is matched to operators by operator ID. Assigning `uid()` to every operator is "highly recommended". `disableAutoGeneratedUIDs` can enforce it.
  - Unmatched state can be skipped only by explicit opt-in. The CLI flag is `--allowNonRestoredState`, per the savepoints page.
  - Windows, joins and built-in aggregations hold internal state typed by their input. "Changing the respective input or output type breaks application state consistency and prevents an upgrade."
  - Flink "cannot revert writes to external systems". Duplicates after a restore are fine for idempotent key-value sinks "but problematic in case of appends to a durable log such as Kafka".
  - Doc tension: this page still says "It is not possible to change the data type of the state of an operator", while the schema-evolution page allows POJO and Avro evolution. Cite the schema-evolution page for what is now supported.
- "Savepoints" page. [nightlies.apache.org](https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/savepoints/). Default UIDs follow topological order and "may lead to incorrect associations between states and operators". It also describes the restore claim modes; NO_CLAIM is the default.

Spark Structured Streaming (Apache Spark docs, latest, FULL-TEXT). "Recovery Semantics after Changes in a Streaming Query". [spark.apache.org](https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html).

- Changing the number or type of input sources is "not allowed".
- Changing subscribed Kafka topics is "generally not allowed as the results are unpredictable". Changing the output Kafka topic is allowed.
- Stateful operations: "any changes (that is, additions, deletions, or schema modifications) to the stateful operations of a streaming query are not allowed between restarts". This covers aggregation keys, dedup columns, stream-stream join type, and user state in `mapGroupsWithState`.

Kafka Streams (Apache Kafka docs, trunk, FULL-TEXT from GitHub).

- "Application Reset Tool" ([app-reset-tool.md](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/app-reset-tool.md)). Reprocessing from scratch resets input offsets and deletes internal topics.
  - The tool does not reset output topics: "it is your responsibility to adjust those downstream applications".
  - All instances must be stopped.
  - "This tool makes irreversible changes to your application."
  - So a reprocess-in-place is a stop-the-world event. A copy under a new `application.id` is the non-disruptive alternative. The latter is my inference; the docs do not prescribe it.
- Confluent's schema docs (section 1) say Streams apps must upgrade before upstream producers.

Wise, first-person.

- Levani Kokhreidze (principal engineer, Wise), interviewed on Confluent's "Streaming Audio" podcast, episode 191, 21 December 2021. [developer.confluent.io](https://developer.confluent.io/podcast/running-hundreds-of-stream-processing-applications-with-apache-kafka-at-wise). FULL-TEXT transcript, vendor-hosted.
  - Wise has "around maybe 50 terabytes worth of state" in Kafka Streams.
  - "in the Kafka Streams right now, there is no way to roll back your state in a consistent manner". After a buggy release with corrupted state, "you have to pretty much wipe out your state and start from the beginning". Flink savepoints let you "roll back your state to yesterday".
  - Wise keeps "all the original event streams into compacted topics". On a new version, teams use a self-service reset to re-consume from a chosen point, for example "one year's worth of data".
  - Limits: spoken interview from 2021. Kafka Streams features may have changed since.

### Inferences

- For the article: the stream equivalent of a dark launch is a shadow job on its own consumer group writing to shadow sinks. The equivalent of the flag flip is repointing readers to the new output table or topic, as Kreps describes. Rollback is cheap only while the old job and old output are still running, so the old copy must be kept warm until the new one is trusted.
- Neither Grab nor Kreps documents record-level output comparison between versions in production. Grab compares health and rates. Content diffing of two stream outputs is undocumented in the sources I read, and the article should not imply it is standard.
- State is what makes a stream job unlike a stateless service. Changing a key, an aggregation's input type, or (in Spark) any stateful operator forces a rebuild from history. That requires either long retention (Kappa), an archive source (Uber Kappa+), or compacted source-of-truth topics (Wise).

### Gaps

- No first-person account from Netflix, LinkedIn, Lyft, Stripe, DoorDash, Shopify or Zalando of shadowing a stream job with output diffing could be read. Netflix and DoorDash refused access.
- No published duration or cost for a full-history replay into a second job beyond Uber's "about a day for a few days" figure.

## 5. Change data capture and upstream DDL; the outbox as a contract boundary

### Takeaway

CDC makes the table schema the event schema. Debezium tracks DDL so it can decode older log positions, but a rename or type change in the source table flows straight to consumers unless something sits between them. Debezium for Postgres cannot even see DDL. The documented ways to decouple are the outbox table, or a stream-processing layer that republishes a contracted stream. Both cost write load or an extra job.

### Cited Findings

Debezium MySQL connector, Debezium docs (stable, 3.x line). [debezium.io](https://debezium.io/documentation/reference/stable/connectors/mysql.html). Locator: "Schema history topic", "Schema change topic". FULL-TEXT.

- The connector parses DDL from the binlog to keep "an in-memory representation of each table's schema". It records "all DDL statements along with the position in the binlog" in a schema history topic, and rebuilds table structure from it on restart.
- That topic "is for internal connector use only". Consumers who need schema changes should read the separate schema change topic.
- "Never partition the database schema history topic." It must have a partition count of 1 to keep global order.
- The schema change topic's message format "is in an incubating state and is subject to change without notice".
- There is a recovery option "to restore a database schema history topic that is lost or corrupted".
- With gh-ost or pt-online-schema-change, the connector must also capture the tools' helper tables. An SMT can then drop their records.

Debezium PostgreSQL connector docs. [debezium.io](https://debezium.io/documentation/reference/stable/connectors/postgresql.html). FULL-TEXT.

- "Logical decoding does not support DDL changes. This means that the connector is unable to report DDL change events back to consumers."
- "The Debezium connector for PostgreSQL does not support schema changes while an incremental snapshot is running."
- The `pgoutput` plugin "does not capture values for generated columns".

Gunnar Morling, "'Change Data Capture Breaks Encapsulation'. Does it, though?", personal blog, 21 November 2023. [morling.dev](https://www.morling.dev/blog/change-data-capture-breaks-encapsulation-does-it-though). FULL-TEXT.

- Risks: "Your table model becomes your API". Any schema change such as "renaming a column or changing its type, could cause downstream event consumers to break, unless they are updated in lockstep". Change streams also leak sensitive columns by default.
- Database views cannot be exposed via CDC, because non-materialised views do not go through the transaction log.
- Outbox: the data change and the outbox insert happen "in one single database transaction". The outbox contract can be evolved separately. If a column is renamed, renaming it in the event is "a conscious decision", "potentially requiring a new major version". The outbox avoids "unsafe dual writes".
- Costs: you must modify the service to emit events on every write path, and there is "a potential performance impact" plus extra disk space for outbox rows at high volume. On Postgres, logical decoding messages avoid the housekeeping of an outbox table.
- Alternative: republish CDC streams through Flink with an explicit contract, including "creating multiple output versions for one input stream".
- Ownership: the source team should own the data contract.

Debezium outbox blog (2019, section 3).

- Explicit outbox events ensure "event consumers won't break when for instance altering the internal domain model or the PurchaseOrder table".

Yelp (section 2).

- The MySQLStreamer re-registers the table schema on each DDL. Adding a column with a default keeps the topic, and an int-to-varchar change produces a new topic. This is a documented end-to-end CDC-DDL-to-topic-version rule.

Clear Street (section 2).

- Debezium plus Avro caused problems severe enough to contribute to a format switch. The post does not specify the failure.

Documented failures.

- I found no first-party postmortem describing a CDC pipeline broken by a source DDL change. The search results were tutorials and third-party blogs, so none are cited as evidence.

### Inferences

- For the article's ten-table example: if the upstream table is published by CDC without an outbox or contract layer, an expand/contract column change is visible to every stream consumer at each step. The rename becomes an add-then-drop in the event schema, and the registry's compatibility mode decides whether the drop is accepted. An outbox or contracted republish stream lets the source table change without changing the published event.
- Yelp's rule that a primary-key change means a new topic generalises. For compacted CDC topics, the key is part of the contract, because compaction semantics depend on it.

### Gaps

- No first-party incident report of a CDC pipeline failing on a rename or drop was found.
- I could not read Airbnb's SpinalTap schema-handling details.

## 6. Rollback and replay: what can and cannot be undone

### Takeaway

Rolling back a producer stops new bad events. It does not remove the ones already written or the effects consumers already applied. Kafka's exactly-once covers only read-process-write inside Kafka. External side effects, state stores and appended sink output are not reverted. Compacted topics keep the latest value per key, so a bad value persists until it is overwritten, and a deleted key leaves a tombstone. The practical defences are consumer-first upgrades, dead-letter topics for poison messages, idempotent sinks, and keeping the old job and output alive until the new ones are trusted.

### Cited Findings

Apache Kafka design docs (trunk, FULL-TEXT from GitHub [docs/design/design.md](https://github.com/apache/kafka/blob/trunk/docs/design/design.md)).

- Transactions with `read_committed` give exactly-once for "reading, processing and writing data on Kafka topics". "Exactly-once delivery for other destination systems generally requires cooperation with such systems".
- Compaction: "Log compaction ensures that Kafka will always retain at least the last known value for each message key". A null payload is a tombstone, and delete markers are seen if a consumer reaches the head within `delete.retention.ms`. The default is 24 hours, per the same section.

Neha Narkhede (Confluent), "Exactly-Once Semantics Are Possible: Here's How Kafka Does It", Confluent blog, 30 June 2017, updated March 2025. [confluent.io](https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/). VENDOR, FULL-TEXT.

- EOS is "guaranteed within the scope of Kafka Streams' internal processing only". RPCs to remote stores and custom clients are not covered.
- Non-deterministic processing, such as reading multiple topics or calling external services, can produce different results on re-run.

Flink upgrade docs (section 4).

- Flink "cannot revert writes to external systems". Restoring from a savepoint can re-emit data, which is "problematic in case of appends to a durable log such as Kafka".

Kafka Streams.

- Reset is irreversible and does not touch output topics (section 4). Wise says Kafka Streams state cannot be rolled back consistently, so corrupted state means wiping it and replaying (section 4).
- The Streams config docs ([config-streams.md](https://github.com/apache/kafka/blob/trunk/docs/streams/developer-guide/config-streams.md), trunk) describe two built-in deserialization handlers. `LogAndContinueExceptionHandler` logs and skips. `LogAndFailExceptionHandler` "signals the processing pipeline to stop". The docs suggest a custom handler that writes to a quarantine ("dead letter queue") topic.
  - Caution: the trunk table lists different defaults for the deprecated `default.deserialization.exception.handler` (LogAndFail) and the new `deserialization.exception.handler` (LogAndContinue). Verify against a released version before stating a default.

Monzo, poison messages.

- Monzo, "How we built a queue on top of Kafka", 25 January 2024. [monzo.com](https://monzo.com/blog/how-we-built-a-queue-on-top-of-kafka). FULL-TEXT.
  - "it's only a matter of time before a partition contains a poison pill", meaning an event "your code is unable to process, stalling all work for that partition until a fix is shipped".
  - Indefinite stalls are "not acceptable to Monzo 99% of the time", so Monzo gives up ordering. After `maxAttempts` the event moves to a deadletter topic, one per consumer group and topic. A CLI replays it through a retry topic after the bug is fixed, or drains it.
  - Limits: the post does not tie poison pills specifically to schema releases.

Confluent data contracts (section 1).

- Rolling back a consumer that moved to a new topic needs offset correlation back to the old topic.

Documented incidents.

- I found no first-party postmortem (company engineering blog or status page) in which an event schema change caused an outage. The search results were tutorials, interview prep and anonymous Medium or DEV posts, so they are not cited as evidence.
- Grab's post (section 4) documents a related production failure class, a new version unable to restore from the old savepoint, and the 10-minute downtime its rollback caused.

### Inferences

- For the article: a producer rollback undoes future writes, not history. If a bad schema version has been registered and used, the registry keeps it. Rolling the producer back to the old schema is itself a new compatibility check, and it may fail under BACKWARD if the new version removed something. This is an inference from the X versus X-1 rule; I found no source describing it as an incident.
- Consumers that already applied bad events need compensating events or a replay into rebuilt state. The cheapest safety is the Kreps pattern of keeping the old output, so "rollback" is a pointer move rather than an undo.
- Under BACKWARD with consumers upgraded first, a consumer rollback after the producer has shipped is unsafe: old consumers may not read new events. Teams therefore need FULL compatibility if they want to roll back either side independently.

### Gaps

- No first-party event-schema incident postmortem found.
- No source quantifies how long compacted topics hold a bad value or how teams purge it.

## 7. Streaming features for ML

### Takeaway

Streaming features are versioned rather than edited in place: Chronon locks online GroupBys and recommends `_v2`. A new streaming feature version needs history built either by a batch backfill of the same definition (Chronon, Lyft Dryft) or by replay, which runs into the Kafka retention limit Uber documents. Online and offline values can never match exactly, so shadowing a streaming feature means logging served values and measuring consistency over time.

### Cited Findings

Chronon docs, The Chronon Authors (Airbnb, Stripe), living docs read 2026-11-11. FULL-TEXT.

- "GroupBy". [chronon.ai](https://chronon.ai/authoring_features/GroupBy.html). Once a GroupBy is marked online, `compile.py` prevents updates "so that you don't accidentally merge a change that release modified features out-of-band with model updates", and the docs recommend "create a new version your_gb_v2 instead". This is already noted in `feature_stores_and_versions.md`.
- New detail from the same page: for CDC sources, non-reversible aggregates such as max under updates are fixed because online serving "asynchronously (in the background) batch-correct[s] the aggregates by going over full data".
- "Online Offline Consistency". [chronon.ai](https://chronon.ai/test_deploy_serve/Online_Offline_Consistency.html).
  - "While 100% consistency is desirable, it is not always possible."
  - Causes: Kafka and KV-store latency of milliseconds to seconds, and batch features that lag "in the order of minutes or hours" around midnight.
  - Chronon logs inference queries and responses to a `query_logs` table with 90-day retention, then computes per-join consistency metrics.

Uber (section 4).

- Kafka retention of "only a few days" means a new streaming feature definition cannot be backfilled by replaying Kafka. Uber reads Hive archives with the same streaming code (Kappa+).
- In the 2020 post (TOOL-EXTRACT), a nine-day backfill of about 10 TB took on the order of a day per few days of data.

Lyft and DoorDash, SNIPPET only.

- Lyft's Dryft slides, from a search summary, describe backfill reading history from S3 with the same feature definition, and real-time mode from Kinesis or Kafka into DynamoDB.
- DoorDash's "Building Riviera" (Allen Wang, 4 March 2021, per search) generates Flink pipelines from a Flink SQL DSL. careersatdoordash.com returned 403.
- Neither source's handling of feature changes was verified.

Wise (section 4).

- Retaining source streams in compacted topics makes "one year's worth" replays possible for new stream-job versions. Compaction keeps only the latest value per key, so it is not a full event history. That is an inference from Kafka's compaction definition.

### Inferences

- Long-window streaming aggregates, such as 90-day counts, are the hardest feature to change progressively. The new version needs 90 days of history. Kafka rarely holds that (Uber: a few days), so history comes from an archive and a batch backfill. This reintroduces two code paths, or Kappa+-style source swapping, plus an online-offline consistency check before the new version is trusted.
- The progressive path for a streaming feature mirrors section 4: create `feature_v2`, backfill it, run it online beside v1, log both, and let the model experiment pick which version it reads.

### Gaps

- No readable first-person account of shadowing a changed streaming feature, with numbers, from Uber, DoorDash or Lyft.
- No measured cost of a long-window streaming backfill.

## 8. Financial services: event-driven banks and ISO 20022 coexistence

### Takeaway

Event-driven banks and payment firms publicly describe Kafka scale, dead-lettering and state replay more than schema-evolution rules. The best documented "two versions side by side" example in finance is industry-wide, not company-level. Swift ran MT and ISO 20022 in parallel for cross-border payments from 20 March 2023 to 22 November 2025, while Fedwire chose a single-day cutover on 14 July 2025, after one postponement.

### Cited Findings

Swift CBPR+ coexistence. SNIPPET only; swift.com returned HTTP 403 to every automated request, so dates are from search-result text of swift.com pages.

- Swift news, "ISO 20022 coexistence begins, opening new possibilities for cross-border payments". [swift.com](https://www.swift.com/news-events/news/iso-20022-coexistence-begins-opening-new-possibilities-cross-border-payments). Per the search snippet, migration for cross-border payments and reporting (CBPR+) began 20 March 2023, with MT and ISO 20022 both supported.
- Swift pages per snippets give the end of coexistence for FI-to-FI payment instructions as 22 November 2025, reconfirmed by the Swift Board in June 2024. After that date MT payment instructions are not supported on FIN for those flows. Sources: [swift.com news](https://www.swift.com/insights/news/iso-20022-new-era-global-payments) and [one-year countdown](https://www.swift.com/news-events/news/one-year-countdown-iso-20022-cbpr-begins).
- The CBPR+ phase-2 roadmap v4.2 PDF ([swift.com](https://www.swift.com/sites/default/files/files/cbpr-phase-2-roadmap_detailed_v4-2.pdf)), seen in a search summary only, indicates that some flows, for example MT101 versus pain.001 interbank, extended beyond November 2025. Not verified.
- A secondary report (Fintech News Singapore, SNIPPET) says Swift observed 97% of payment instructions already on ISO 20022 at cutover. This is not a Swift primary source; treat it as unverified.

Fedwire ISO 20022. SNIPPET only; frbservices.org serves its 404 page to automated clients. The Implementation Center landing page loaded (FULL-TEXT) but contains no dates beyond a reference to testing "ahead of the November 2027 release".

- Federal Reserve Financial Services, "Confirmed: Implementation of ISO 20022 message format on July 14 for the Fedwire Funds Service", communication dated 18 June 2025 per its URL. [frbservices.org](https://frbservices.org/news/communications/061825-fedwire-iso-go).
- FedFinancial Services "ICYMI: ISO 20022 rescheduled to July", Fed360 issue of 4 March 2025. [frbservices.org](https://www.frbservices.org/news/fed360/issues/030425/wires-icymi-iso-20022-rescheduled-july).
- Per the search summary of these pages and the [FAQ](https://frbservices.org/resources/financial-services/wires/faq/iso-20022/overview-implementation-details), the original date was 10 March 2025, rescheduled to 14 July 2025 "after careful consideration of industry requests and assessment of customer readiness". It was a single-day implementation. The FAQ says processing speed did not change, and that on 14 July 2025 message retrieval was limited to that day's messages.
- That the legacy FAIM format was retired on the implementation date comes from a Treasury Prime changelog (SNIPPET), not a Fed page.

Monzo.

- FULL-TEXT, section 6: Kafka with per-consumer-group deadletter topics, 25 January 2024.
- SNIPPET: a 30 September 2024 Monzo post says it runs almost 3,000 microservices.
- I found no Monzo post on event schema rules.

Wise.

- FULL-TEXT, section 4, December 2021: about 50 TB of Kafka Streams state; compacted topics hold "pretty much the whole history of Wise of all the core domains"; self-service reset and replay for new job versions; no consistent state rollback in Kafka Streams.
- The podcast page summary gives "around 400 total microservices".

Nubank.

- "Microservices at Nubank, An Overview", Building Nubank. [building.nubank.com](https://building.nubank.com/microservices-at-nubank-an-overview/). FULL-TEXT; undated in my extract, and it describes 2013 to 2019.
  - "we rarely run into issues due to upstream data schema changes breaking analysis downstream", thanks to tests.
  - The harder problem is "changes of 'data values' upstream", where a definition changes "dangerously subtly". This is addressed with anomaly detection on table statistics, among other things, and is "still far from a solved problem".
- SNIPPET: a Nubank meetup post on cloud limits says Nubank processes "72 billion daily events via Kafka" and runs 4,000+ microservices. Not verified.
- A Kafka Summit NYC 2019 talk by Iago Borges, "Maintaining consistency for a financial event-driven architecture", exists on SlideShare; I did not read it.

ING.

- SNIPPET only: Kafka Summit London 2018, "The Evolution of Kafka at ING Bank", says Kafka went from a 2014 proof of concept to the "Event Bus".
- Kafka Summit London 2024, "Evolve Your Schemas in a Better Way! A Deep Dive into Avro Schema Compatibility and Schema Registry", was given by ING engineers (Tim van Baarsen; Kosta Chuturkov). Slides on Speaker Deck were not read.

Clear Street (brokerage).

- FULL-TEXT, section 2: Avro-plus-Debezium problems and a move to Protobuf with a Buf registry.

Not found: Starling, Adyen, Rabobank, BNY, Capital One and Goldman Sachs. No first-person engineering account of event schema evolution surfaced in searches.

### Inferences

- ISO 20022 is a useful scale analogy for the article. Swift's two-and-a-half-year coexistence is a versioned-topic migration across an industry, with a hard retirement date set and reconfirmed by a governing body. Fedwire, a single operator, took a one-day cutover instead, and still postponed it once for readiness. The contrast mirrors the choice between parallel versions with consumer-paced migration and a big-bang switch.
- In the banks' own accounts, the operational controls they mention are dead-lettering, replay from compacted history, and tests on upstream schemas. Schema rules themselves are not described publicly. Nubank's point that value changes, not schema changes, are the unsolved problem matches the report's existing finding for ML.

### Gaps

- Swift and Fed pages could not be read directly. All dates in this section rest on search-result text of primary pages and should be re-checked in a browser before publication.
- No first-person account of event schema versioning from any bank, apart from Clear Street's format migration.
