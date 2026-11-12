# End-to-end cases (source change -> derived tables -> features -> model -> experiment) and the failure record, 2014-2025

Verification labels used on every source:

- FULL-TEXT = I downloaded the page/PDF and searched the raw text myself; quotations are exact.
- TOOL-EXTRACT = read through a fetch tool that summarises the page; quotations were returned by the tool and NOT checked against raw HTML (treat wording as probable, not certain).
- SNIPPET = search-result summary only; the page itself was blocked (Medium/Cloudflare, DoorDash, Internet Archive all refused automated fetches). No quotations taken. Verify before quoting.

All quotations are under 25 words.

## 1. Best-documented end-to-end accounts

### Takeaway

No public first-person account was found that narrates the reader's exact scenario (a breaking change to a source table, N parallel versioned intermediate tables, a re-derived feature set, two models trained on the two schemas, an A/B test, then retirement). What exists is a set of partial chains; the most complete are Google Play/TFX (data fix -> retrain -> A/B, +2% installs), Uber Eats feature logging (new training table built beside the old ETL table, both models trained on the same date range and compared), and the Google data-validation "feature-store migration" (old and new stores validated side by side).

### Cited Findings

**Google Play on TFX (closest to "data change proven by A/B"):**

- Baylor et al. (Google), "TFX: A TensorFlow-Based Production-Scale Machine Learning Platform", KDD 2017 (Aug 13-17, 2017). Locator: abstract and Section 7 (Google Play case study). FULL-TEXT. Play has "over one billion active users and over one million apps"; models are continuously retrained over "hundreds of billions of examples". — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf) (author-hosted copy; DOI 10.1145/3097983.3098021)
- Mechanics: the data-validation component compared serving-log statistics with training-data statistics "on the same day" and found "a few features that were always missing from the logs, but always present in training". The fix was evaluated in "an online A/B experiment" and raised install rate on the store landing page by 2%. — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf)
- Model gate before exposure: "We validate that a model is safe to serve with a simple canary process." Quality is compared with a fixed threshold and with the current production model; "Any new model failing any of these checks is not pushed to serving, and product teams are alerted." — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf)
- Limits: does not say how long the A/B ran, how the model version was bound to the data version, or how many intermediate datasets were involved. The change was a repair (remove skew), not a planned schema change.

**Google data-validation deployment (700+ pipelines; migration validated old-vs-new):**

- Breck, Polyzotis, Roy, Whang, Zinkevich (Google), "Data Validation for Machine Learning", SysML 2019. Locator: Section 6.1-6.2. FULL-TEXT. Evidence is drawn from "more than 700 ML pipelines". — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Feature-store migration case: "Two product teams have used our system to validate the migration of their features to new stores." Schema validation and drift detection were run on datasets from the old and the new store; detected errors were used to debug the new store before completing the migration. This is a first-party description of dual-running two versions of a feature source and diffing them. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Video-recommendation team migrating training+serving to the new platform had to reach model-quality parity first; validation alerts showed a backend storing features in an unexpected format so they were silently dropped. "The total time to diagnose and fix the problem was two days, whereas similar issues have taken months to resolve." — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Schema co-evolution: the paper's Table 1 / Figure 6 report how often users edit the schema in response to anomalies; most pipelines have up to five schema revisions. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Limits: no ramp percentages, no durations for the migration, team names withheld.

**Uber Eats: new training-data chain built beside the old one ("Taming the ML Firehose"):**

- Paarth Chothani, Chirag Agrawal, Amrith M (Uber), "Taming the ML Firehose" (tool reports publication date September 22, 2026 — outside the 2014-2025 window; date not independently checked). TOOL-EXTRACT. — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- Mechanics as extracted: a feature-logging framework logs the exact feature values consumed at inference; a new training table is built from the logs; "Once data validation is complete and enough data has been accumulated", the production model is trained on it. For a "fair comparison" the team also retrains the production model on the old ETL-generated table for the same date range, and requires the new model to be at par or better on AUC and MAP. Applied to Uber Eats search and ranking models. — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- Numbers as extracted: 8 million QPS prediction traffic; about 1.7 PB/day of logged features before compression; only 5% of ranked candidates become impressions; an allow-list cuts payload 4-5x; mismatch on key features went from over 10% to 0%; feature freshness from multi-day to hours. — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- Limits: the extract found no A/B test description, no ramp percentages, no accumulation period, no statement of how the old ETL chain was retired. This is the nearest published example of "two parallel training-data pipelines feeding two versions of one model", but the comparison described is offline.

**Uber Michelangelo deployment mechanics (model side of the chain):**

- Joseph Wang, Yunfeng Bai, Jia Li (Uber), "Continuous Integration and Deployment for Machine Learning Online Serving and Models", June 30, 2021. TOOL-EXTRACT. Shadow traffic "can be 100%, or picked based on some criteria"; "Shadowing usually spans a time window of days or weeks before it is stopped." For auto-shadow, users must add the features the shadow model needs that the primary does not. — [Uber blog](https://www.uber.com/blog/continuous-integration-deployment-ml/)
- Joseph Wang, Sophie Wang, Jia Li (Uber), "Raising the Bar on ML Model Deployment Safety", October 30, 2025. TOOL-EXTRACT. Shadow testing covers "over 75% of critical online use cases"; gradual rollout starts with a small traffic slice; auto-rollback to last known good version on error/latency/utilisation breaches; 400+ active use cases, 20,000+ training jobs/month, 15M+ predictions/second peak. The post states that many severe incidents begin with upstream data changes (nulls, distribution shift, schema drift). — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)
- Suresh Srinivas, Krishna Puttaswamy (Uber), "Uber's Journey Toward Better Data Culture From First Principles", March 16, 2021. TOOL-EXTRACT. Before the programme "developers could not confidently change schemas" because downstream consumption was not visible; remedy includes "Schema changes have mandatory reviewers", mandatory ownership, dataset tiering, and tools to test changes in staging before production; scale: hundreds of thousands of datasets, 20+ systems modified. — [Uber blog](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)
- Limits: none of the three describes one named change traced from source table to experiment.

**LinkedIn: schema change with many downstream consumers (canonical, but 2012 — before the requested window):**

- Goodhope, Koshy, Kreps, Narkhede, Park, Rao, Ye (LinkedIn), "Building LinkedIn's Real-time Activity Data Pipeline", IEEE Data Engineering Bulletin, June 2012 issue. Locator: sections on the prior XML system and on schema handling. FULL-TEXT. — [IEEE DE Bulletin PDF](http://sites.computer.org/debull/A12june/pipeline.pdf)
- Before: "schemas would often change unexpectedly, breaking downstream processing". After: Avro everywhere; a registry keeps every schema version per topic and each message carries the id of its writer schema; schema review "was mandatory and built into the automatic code review process"; a compatibility model allows only additive change — "new fields can be added, but must have a default value to be used for older data" — and a failed check "results in a fatal error". Avro data was "roughly 7 times smaller than XML". — [IEEE DE Bulletin PDF](http://sites.computer.org/debull/A12june/pipeline.pdf)
- Limits: establishes the additive-only rule at the event source; says nothing about models, feature backfill or experiments. Breaking changes are simply disallowed, which is why a parallel-version procedure is not described.

**Airbnb search ranking (experiment end of the chain; feature bugs):**

- Haldar et al. (Airbnb), "Applying Deep Learning to Airbnb Search", arXiv 1810.09591 (Oct 2018; KDD 2019). FULL-TEXT. Each new model "is then tested online in an A/B testing framework"; section 2.4 "Failed models" says unsuccessful attempts "outnumber the successful ones"; section 4.2.1 reports "bugs related to currencies in the prices logged for certain geographies", found by inspecting feature distributions. — [arXiv 1810.09591](https://arxiv.org/pdf/1810.09591)
- Haldar et al. (Airbnb), "Improving Deep Learning for Airbnb Search", arXiv 2002.05515 (Feb 2020; KDD 2020). FULL-TEXT. A price-aware loss looked fine offline; online it gave "a reduction of −3.3% in average price of search results. But also a drop of −0.67% in bookings", because offline analysis "only evaluated re-ranking the top results available in logs". — [arXiv 2002.05515](https://arxiv.org/pdf/2002.05515)
- Limits: neither paper describes upstream table/schema versioning, backfill procedure or ramp schedule.

**Airbnb Chronon / Stripe Shepherd (feature platform; see researcher (c) for tooling):**

- Chronon project README (airbnb/chronon, GitHub). FULL-TEXT (project documentation, not a case study). It names the two prevailing practices, "log-and-wait" and replicating offline features online, and lists costs of each (see section 3). — [Chronon README](https://raw.githubusercontent.com/airbnb/chronon/main/README.md)
- Ben Mears (Stripe), "Shepherd: How Stripe adapted Chronon to scale ML feature development", April 15, 2024. FULL-TEXT. Stripe training data "can include thousands of features and billions of rows"; Chronon was chosen partly for "built-in consistency monitoring"; Stripe implemented Spark SQL expression support on Flink to keep online and offline definitions identical. The words "backfill", "shadow" and "version" do not occur in the text I extracted. — [Stripe blog](https://stripe.com/blog/shepherd-how-stripe-adapted-chronon-to-scale-ml-feature-development)
- Ryan Drapeau (Stripe), "How we built it: Stripe Radar", March 29, 2023. FULL-TEXT. Describes architecture evolution (removing the XGBoost component would have cost 1.5% recall; the DNN-only design cut training time "by over 85% (to less than two hours)"). It does not describe shadowing, backfilling or ramping a new feature; the words "shadow", "backfill" and "release" do not occur. — [Stripe blog](https://stripe.com/blog/how-we-built-it-stripe-radar)

**Monzo (bank; versioned training snapshot + shadow mode):**

- Neal Lathia (Monzo), "Monzo's machine learning stack", 25 April 2022. FULL-TEXT. Dataset-creation jobs run BigQuery SQL and "export a versioned snapshot of that data to Google Cloud Storage"; the model registry is used to "control the state of models as we validate them (we use shadow mode deployments extensively)"; feature-store ingestion from the warehouse has "data validation queries implemented as ingestion preconditions"; batch inputs are dbt models orchestrated with Airflow. — [Monzo blog](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack)
- Limits: a platform overview. No worked example of a source-table change, no shadow durations or percentages, no A/B description.

**DoorDash and PayPal (fraud models; shadow then experiment) — SNIPPET only:**

- Bob Nugman (DoorDash), "Ship to Production, Darkly: Moving Fast, Staying Safe with ML Deployments", March 2022. SNIPPET. Search summaries state a staged sequence for fraud models: shadow traffic at about 1% of volume, then 100% shadow, then live A/B of incumbent vs challenger on DoorDash's Curie experimentation platform. Page blocked; not verified. — [DoorDash blog](https://careersatdoordash.com/?p=6836)
- Quinn Zuo et al. (PayPal), "Deploying Large-scale Fraud Detection Machine Learning Models at PayPal", Oct 2021. SNIPPET. Search summary: models and their features go through CI/CD and a "shadow platform" in which scores are logged but do not take part in adjudication, then graduate through the same pipeline. Not verified. — [PayPal Tech on Medium](https://medium.com/paypal-tech/machine-learning-model-ci-cd-and-shadow-platform-8c4f44998c78)

**Cross-organisation interview evidence:**

- Shankar, Garcia, Hellerstein, Parameswaran (UC Berkeley), "Operationalizing Machine Learning: An Interview Study", arXiv 2209.09125 (2022). FULL-TEXT. 18 ML engineers. Organisations use "usually between one and four" deployment stages (test, dev, canary, staging, shadow, A/B). One participant on new features: "deploy that in a type of shadow mode where it's running alongside the production model and making predictions". Another said "end-to-end staged deployments could take several months". — [arXiv 2209.09125](https://arxiv.org/pdf/2209.09125)
- Bernardi, Mavridis, Estevez (Booking.com), "150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com", KDD 2019. FULL-TEXT (third-party hosted copy of the paper; DOI 10.1145/3292500.3330744). Every model is validated by randomized controlled trial; "Offline model performance metrics are only a health check". — [paper copy](https://blog.kevinhu.me/2021/04/25/25-Paper-Reading-Booking.com-Experiences/bernardi2019.pdf)

### Inferences

- Published end-to-end stories cluster at the two ends of the chain: (1) additive, compatibility-checked change at the event source (LinkedIn) and (2) shadow/canary/A-B at the model (Google, Uber, DoorDash, Monzo, Booking). The middle — versioned parallel intermediate tables — is described almost nowhere in first person; it shows up only implicitly (Uber's old ETL table vs new logged table; Google's old vs new feature store).
- The recurring binding between "data version" and "model version" in these accounts is the training dataset artefact: a versioned snapshot (Monzo), a separately named training table (Uber), or logged serving features (Google, Uber). None describes a registry that ties a model to versions of ten upstream tables.
- Additive change is the documented norm. Every account either forbids breaking change at the source (LinkedIn) or treats the new chain as a new, separately named dataset compared against the old one.

### Gaps

- Could not read (blocked): Netflix "Evolution of ML Fact Store", Airbnb Chronon announcement on Medium, DoorDash posts, Lyft "Full-Spectrum ML Model Monitoring", Instacart real-time ML, PayPal shadow platform, Pinterest backfill post. Internet Archive refused automated access. These need manual reading before quotation.
- Not found or not searched to conclusion: LinkedIn Pro-ML/Feathr migration account with experiments; Twitter, Meta, Spotify (the Spotify TFX/Kubeflow post I read contains no relevant incident), Nubank (page rendered without body text), Gojek (only the Turing README, which is tool documentation: "design, deploy and evaluate ML experiments in production" — [Turing README](https://raw.githubusercontent.com/caraml-dev/turing/main/README.md)), Capital One, Wise, Zalando, Shopify, Grab, Coupang, Mercado Libre, Block.
- No source gives the count of intermediate tables between a changed source and the feature store, nor a retirement procedure for the old chain.

## 2. Mechanics extracted per account (additive vs breaking, parallel versions, backfill, shadow, binding, ramp, retirement)

### Takeaway

The documented mechanics are: additive-only source change; a new, separately named training dataset alongside the old; either backfill or serve-time logging to obtain history; shadow for days to weeks; then an A/B test. Durations and percentages are rarely published, and no account documents retiring the old chain.

### Cited Findings

- Additive vs breaking: LinkedIn permits only backward-compatible changes, enforced at schema registration and at compile time. — [IEEE DE Bulletin PDF](http://sites.computer.org/debull/A12june/pipeline.pdf). Uber requires mandatory reviewers on schema changes (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/ubers-journey-toward-better-data-culture-from-first-principles/)
- Parallel versions: Uber Eats kept the old ETL-generated training table and the new logged-features table and trained the production model on each for the same date range (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/). Google teams validated old and new feature stores side by side. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Backfill: Google's survey defines backfilling as deciding "how should the fix be reflected to all the input data until now (this operation is known as backfilling)". — [SIGMOD Record 2018 PDF](https://sigmodrecord.org/publications/sigmodRecord/1806/pdfs/04_Surveys_Polyzotis.pdf). The ML Test Score warns a new feature "must be backfilled by imputing it from other stored data, likely using an entirely independent codepath". — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Shadow / dual-compute: Uber shadow runs "days or weeks" at up to 100% of primary traffic (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/continuous-integration-deployment-ml/). DoorDash 1% then 100% shadow then A/B (SNIPPET). — [DoorDash blog](https://careersatdoordash.com/?p=6836). Monzo uses shadow "extensively". — [Monzo blog](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack)
- Model-to-data binding: Monzo exports "a versioned snapshot" of training data per dataset-creation job. — [Monzo blog](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack). Google pipelines version the data schema alongside the pipeline and validate each batch against it. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- What is measured: Google Play — app install rate (+2%). — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf). Uber Eats — AUC and MAP parity (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/). Airbnb — bookings (−0.67% in a failed launch). — [arXiv 2002.05515](https://arxiv.org/pdf/2002.05515). Booking.com — conversion, customer-service tickets, cancellations via RCT. — [paper copy](https://blog.kevinhu.me/2021/04/25/25-Paper-Reading-Booking.com-Experiences/bernardi2019.pdf)
- Overall duration: interviewees report staged deployments that "could take several months". — [arXiv 2209.09125](https://arxiv.org/pdf/2209.09125)

### Inferences

- A defensible recipe for the reader's scenario, assembled from these sources rather than documented in any single one: (a) make the source change additive (new column/table, old retained); (b) materialise the affected derived tables under new names/versions beside the old; (c) obtain history for the new features by backfill, or by computing them at serving time in shadow and logging; (d) diff old vs new datasets with schema and drift checks; (e) train model B on the new dataset and retrain model A on the old for the same window; (f) shadow B, then A/B behind the experiment system; (g) retire the old chain. Steps (a), (d), (f) are well evidenced; (b), (e) rest on one or two accounts; (g) is undocumented.

### Gaps

- Naming/versioning schemes for intermediate tables: no first-person source found. Defer to researchers (b) and (c).
- A/B duration and ramp percentages for a data-driven model change: not published in any source read in full.
- Retirement of the old chain: not described anywhere.

## 3. Feature logging / "log-and-wait" as an alternative to backfill

### Takeaway

Logging features at serving time and training on the logs is a long-standing Google recommendation and is described by Uber and the Chronon project; it removes training-serving skew by construction but costs calendar time (wait for data to accumulate) and storage. Published waiting periods are scarce: the only figures found are secondary ("weeks" at Netflix, "more than a year" for seasonal models per an Airbnb summary).

### Cited Findings

- Martin Zinkevich (Google), "Rules of Machine Learning: Best Practices for ML Engineering" (page last updated 2025-08-25; originally published c. 2016-17). FULL-TEXT. Rule #29: "save the set of features used at serving time, and then pipe those features to a log to use them at training time". Also: "YouTube home page switched to logging features at serving time with significant quality improvements and a reduction in code complexity". — [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Rule #31 (same source): a table joined at training and at serving time may change in between; "The easiest way to avoid this sort of problem is to log features at serving time". — [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Breck et al. (Google), "The ML Test Score", IEEE Big Data 2017, test Monitor 3. FULL-TEXT. For systems that use serving input as future training data, "adding identifiers to each example at serving time will allow direct comparison"; feature values should then be identical in training and serving. — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Chronon README. FULL-TEXT (project documentation). Log-and-wait: "Once enough data has accumulated, train the model on the logs, and serve with the same data." Pro: "Features used to train the model are guaranteed to be available at serving time". Con: "It might take a long to accumulate enough data to train the model"; windowed aggregations are not always possible online. — [Chronon README](https://raw.githubusercontent.com/airbnb/chronon/main/README.md)
- Chronon project homepage (project marketing copy; FULL-TEXT) positions backfill as the replacement: "no more expensive log-and-wait pipelines or costly retraining cycles"; it lists Airbnb, Stripe, Netflix, OpenAI, Uber and others as production users (project's own claim). — [chronon.ai](https://chronon.ai/)
- Uber Eats (TOOL-EXTRACT): logging "guarantees feature consistency by logging the exact set of feature values consumed by the model"; cost about 1.7 PB/day before compression; example skew removed: locale codes formatted differently offline and online. — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- Airbnb Chronon announcement (SNIPPET): search summaries say the wait "can be more than a year for models that need to capture seasonality". Not verified. — [Airbnb on Medium](https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8)
- Netflix "Evolution of ML Fact Store" (SNIPPET, via a third-party summary): Axion stores logged facts so features can be regenerated offline, motivated by not waiting weeks for feature logging; generation time reduced from weeks to hours. Not verified against the Netflix post. — [Netflix TechBlog](https://netflixtechblog.com/evolution-of-ml-fact-store-5941d3231762); summary at [ZenML database](https://www.zenml.io/mlops-database/netflix-metaflow-axion-ml-fact-store-for-on-demand-feature-regeneration-with-iceberg-and-evcache-to-reduce-training-serv)
- Pinterest "How Pinterest Accelerates ML Feature Iterations via Effective Backfill" (SNIPPET, third-party mirror): forward logging described as costly in calendar and development time; backfill v2 uses a staging step then a promotion step and cut iteration cost/time "up to 90x". Not verified. — [mirror summary](https://thenote.app/post/en/how-pinterest-accelerates-ml-feature-iterations-via-effective-backfill-ykhzxukvad)

### Inferences

- The industry has moved in both directions: Google and Uber adopted logging to kill skew; Airbnb, Netflix and Pinterest then built point-in-time backfill (or fact logging plus offline regeneration) to avoid the wait. For the reader's scenario, logging in shadow is the low-tooling route; backfill is the fast route but requires point-in-time-correct infrastructure and creates the "independent codepath" risk the ML Test Score names.
- Netflix's fact store is a hybrid: log raw facts at serving time, regenerate features offline — which permits changing feature definitions without waiting, but not changing what was logged.

### Gaps

- No first-person, verified figure for how long a team waits under log-and-wait. DoorDash, Instacart and Twitter descriptions were not obtained.

## 4. Data-dependency versioning in the ML literature

### Takeaway

Sculley et al. (2015) explicitly recommend a frozen, versioned copy of an unstable input signal and name its cost; later Google papers add schema-as-versioned-artifact, dependency-change notification, skew monitoring and model canary/rollback. The surveys treat schema change and model-data coupling only briefly.

### Cited Findings

- Sculley et al. (Google), "Hidden Technical Debt in Machine Learning Systems", NeurIPS 2015, section on data dependencies. FULL-TEXT. Updates to an input signal owned by another team "may be made at any time"; "even "improvements" to input signals may have arbitrary detrimental effects in the consuming system". — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Exact recommendation: "One common mitigation strategy for unstable data dependencies is to create a versioned copy of a given signal." Use the frozen version "until such a time as an updated version has been fully vetted". — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Stated cost: "Versioning carries its own costs, however, such as potential staleness and the cost to maintain multiple versions of the same signal over time." — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Same paper, underutilised dependencies: old and new product-numbering schemes both left as features; a year later the code populating the old numbers is deleted. "This will not be a good day for the maintainers of the ML system." Also the CACE principle, "Changing Anything Changes Everything". — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Breck et al., "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction", IEEE Big Data 2017. FULL-TEXT. Relevant items: Data 1 (feature expectations captured in a schema); Data 7 (all input feature code is tested); Infra 1 (training is reproducible); Infra 4 (model quality validated before serving); Infra 6 (models tested via a canary process); Infra 7 (models can be quickly and safely rolled back); Monitor 1 ("Dependency changes result in notification"); Monitor 3 (training and serving features compute the same values). — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Monitor 1 rationale: source-system changes can "radically change the feature's meaning" without values strange enough to trigger other monitoring; the prescribed remedy is organisational — subscribe to dependencies' announcement lists and make sure the producing team knows you consume the data. — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- On skew (Monitor 3), the authors report from interviews with Google teams: "This sort of error is responsible for production issues across a wide swath of teams", yet the test was among the least implemented. — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Polyzotis, Roy, Whang, Zinkevich, "Data Lifecycle Challenges in Production Machine Learning: A Survey", SIGMOD Record, June 2018 (Vol. 47, No. 2). FULL-TEXT. On adding a feature: "The check list includes making sure the feature is available at serving time", plus permission to use it and return on investment; the SRE worries about new dependencies. On a data error: "The site reliability engineer, on the other hand, may want to rollback the pipeline to a working state first." The phrase "schema change" does not occur. — [SIGMOD Record PDF](https://sigmodrecord.org/publications/sigmodRecord/1806/pdfs/04_Surveys_Polyzotis.pdf)
- Paleyes, Urma, Lawrence, "Challenges in Deploying Machine Learning: a Survey of Case Studies", arXiv 2011.09926v3 (19 May 2022); ACM Computing Surveys 2022. FULL-TEXT. "Data issues can originate from bugs in code, feedback loops, changes in data dependencies." They recommend data-validation routines in the pipeline; the Updating stage is framed as concept drift and continuous delivery. The words "shadow", "upstream" and "versioning" do not occur in the text I searched. — [arXiv 2011.09926](https://arxiv.org/pdf/2011.09926)

### Inferences

- The literature's prescription maps directly onto the article's thesis: a versioned copy of a signal is the data analogue of a flag-guarded code path — old and new coexist until the new is "fully vetted", at the cost of maintaining both.
- The remedy for upstream change in the 2017 rubric is a mailing list; the 2019 paper replaces it with automated schema validation. That shift is worth stating.
- The widely cited deployment survey (Paleyes) does not discuss parallel data versions or shadow deployment at all — evidence that the end-to-end practice is thin in the academic record.

### Gaps

- Polyzotis et al., "Data Management Challenges in Production Machine Learning" (SIGMOD 2017 tutorial paper) was not retrieved; only the 2018 SIGMOD Record survey by the same authors was read.

## 5. The failure record

### Takeaway

First-party accounts consistently show upstream or pipeline data changes degrading models silently for weeks to months: Uber 45 days, Google Play 6 months (stale table), Google "months" for format-related feature loss, drift cascades 2-3 years. The one regulated-finance example with primary documentation (Equifax 2022) is a three-week score-calculation coding error; no regulator enforcement action specifically about an ML input/schema change was found.

### Cited Findings

- **Uber fares (2023 post).** Anshal Shukla, Kousik Nath, Nipun Vats et al. (Uber), "D3: An Automated System to Detect Data Drifts", February 23, 2023. TOOL-EXTRACT. A fare component was missing in the critical fares dataset for a share of sessions in key US cities; root cause "was an app experiment that started logging fares differently"; "detected after 45 days manually by one of the data scientists". The dataset trains fares ML models; the post puts the impact at a 0.23% decline in incremental gross bookings, "millions of dollars". After D3: time to detect reduced "more than 20 X", averaging 2 days, across 300+ Tier-1 datasets. Caveat: the extract gives 10% of sessions in one sentence and 30% in another — check the page before quoting a share. — [Uber blog](https://www.uber.com/blog/d3-an-automated-system-to-detect-data-drifts/)
- Note for the article: the upstream change here was itself an experiment (a flagged app change) whose data side-effect was not carried through the downstream chain.
- **Google Play stale table.** Zinkevich, Rules of ML, silent-failures rule. FULL-TEXT. "Play once had a table that was stale for 6 months, and refreshing the table alone gave a boost of 2% in install rate." Also: feature coverage can drop from 90% to 60% of examples through implementation changes. Suggested catch: track data statistics and inspect data manually. — [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)
- **Google Play missing features.** Features "always missing from the logs, but always present in training"; removing the skew gave +2% installs in an A/B test. Duration undetected not stated. Caught by comparing same-day serving and training statistics. — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf); repeated in [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- **Google serving-stack refactor (Example 1.1).** Described as reflecting an actual production outage: an "innocuous code refactoring in the serving stack" introduces a bug that "pins the value of a specific int feature to -1 for some slice of the serving data"; the model keeps predicting at lower accuracy; the bad serving data becomes the next day's training data, so the error persists until found. Duration and product not given. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- **Google video recommendations.** A backend stored features in a different format, so parsing silently dropped them; fixed in two days with validation, "whereas similar issues have taken months to resolve". — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- **Airbnb search.** Currency bugs in logged prices for certain geographies, found through feature-distribution smoothness checks; duration not stated. — [arXiv 1810.09591](https://arxiv.org/pdf/1810.09591)
- **Uber Eats format drift.** Offline pipeline and online serving formatted locale codes differently; key features had mismatch rates over 10% before serve-time logging (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- **Sculley et al. hypothetical-from-experience.** Old product numbers removed upstream a year after a migration; model still depended on them. Presented as an example, not a dated incident. — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- **Interview evidence.** Engineers describe data errors as a spectrum "hard → soft → drift"; one recounts ML bugs that "just silently cause errors" appearing as slight performance reductions. — [arXiv 2209.09125](https://arxiv.org/pdf/2209.09125)
- **Data cascades.** Sambasivan et al. (Google Research), CHI 2021, "Everyone wants to do the model work, not the data work": abstract reports 53 practitioners and 92% prevalence of data cascades (SNIPPET — abstract via search; full paper not retrieved). — [Google Research publication page](https://research.google/pubs/pub49953/). Companion blog post (FULL-TEXT): cascades "typically originate upstream, compound over the ML development process, and manifest downstream"; drift-type cascades take "up to 2-3 years" to manifest. — [Google Research blog](https://research.google/blog/data-cascades-in-machine-learning/)
- Limit: the cascades study concerns high-stakes domains with small teams (health, agriculture, lending), not schema changes in a warehouse; use it for "silent, delayed, compounding", not for the specific mechanism.
- **Equifax (regulated credit data).** Equifax, "Equifax Statement on Recent Coding Issue", August 2, 2022 (company statement). FULL-TEXT. A "coding issue within a legacy, on-premise server environment" affected how some credit scores were calculated; "The issue took place between March 17 and April 6." "less than 300,000 consumers experienced a score shift of 25 points or more". Underlying credit-report data was not changed. Stated remedy: accelerate migration to Equifax Cloud for "additional controls and monitoring that will help to detect and prevent similar issues". — [Equifax newsroom](https://www.equifax.com/newsroom/all-news/-/story/equifax-statement-on-recent-coding-issue/)
- Limits on Equifax: the statement does not say what the code change was, whether it was an input/schema change, how it was detected, or why it ran three weeks. The public statement came about four months after the fix. No regulator document was retrieved.
- **Lyft (SNIPPET, third-party summary).** Lyft's model-monitoring post reportedly lists root causes including caller services passing bad features or wrong units and unexpected changes to upstream feature definitions; remedy is feature validation and score monitoring in the serving layer. Not verified. — [ZenML summary](https://www.zenml.io/mlops-database/lyft-lyftlearn-full-spectrum-production-ml-model-monitoring-using-score-feature-validation-anomaly-detection-and-drift-c); original at [Lyft Engineering](https://eng.lyft.com/full-spectrum-ml-model-monitoring-at-lyft-a4cdaf828e8f)

### Inferences

- Common shape: the change is legal at its origin (a refactor, an experiment, a format change, a table that stops refreshing), produces values that pass type checks, and degrades rather than breaks the model. Detection is by a human noticing, weeks to months later.
- What organisations say would have caught it is uniform: schema/statistics validation on each batch, training-vs-serving comparison, and automated drift detection on tiered datasets — i.e., observation of the data path, which is the same capability a staged rollout of a data change requires.
- Model-level canaries do not catch these: the model was not what changed.

### Gaps

- No regulator enforcement action (OCC, Federal Reserve, CFPB, FCA) citing an ML model-input or schema change was found. SR 11-7 / OCC 2011-12 could not be downloaded (both URLs returned HTML, not the PDF), so no wording from model-risk guidance is cited here.
- No first-party fraud- or credit-model postmortem of an upstream schema change was found.
- DoorDash's post on online-offline feature inconsistency bugs exists (seen referenced in search results) but was not readable.

## 6. Honest assessment: how common, how well documented, what it costs

### Takeaway

Well documented in first person: additive schema evolution at the source, serve-time feature logging, data/schema validation, model shadow/canary/A-B and rollback — almost entirely from Google, Uber, Airbnb, LinkedIn, Booking, DoorDash. Not documented in first person: two full parallel versions of a multi-table pipeline feeding two models in an experiment, and its retirement. Outside the largest technology firms the complete chain is unpublished; for banks and payments the evidence is fragments (Monzo, Stripe, PayPal).

### Cited Findings

- Evidence that staged model deployment is widespread but slow: organisations use one to four stages; staged deployments "could take several months" (18 interviewees across sectors including finance). — [arXiv 2209.09125](https://arxiv.org/pdf/2209.09125)
- Evidence that even at Google the supporting tests were unevenly adopted in 2017: skew monitoring was responsible for issues "across a wide swath of teams" yet rarely implemented. — [ML Test Score PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Evidence of adoption lag at Uber: shadow testing covered "over 75% of critical online use cases" only by 2025, with 100% still a target (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)
- Cost of versioned signals, stated by the originators of the advice: staleness and "the cost to maintain multiple versions of the same signal over time". — [NeurIPS PDF](https://papers.nips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf)
- Cost of serve-time logging: about 1.7 PB/day at Uber Eats before compression; allow-listing features cuts payload 4-5x (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/taming-ml-firehose/)
- Cost of shadow: days to weeks of duplicated inference traffic, up to 100% (TOOL-EXTRACT). — [Uber blog](https://www.uber.com/blog/continuous-integration-deployment-ml/)
- Cost of log-and-wait: "It might take a long to accumulate enough data to train the model". — [Chronon README](https://raw.githubusercontent.com/airbnb/chronon/main/README.md)
- Cost of schema discipline: Google notes upfront schema effort "can discourage engineers from setting up data validation until they run into a serious data error", and noisy alerts lead on-calls to ignore or switch off validation. — [SysML 2019 PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Bank/payments evidence actually read: Monzo (versioned training snapshots, ingestion preconditions, shadow mode — no worked change). — [Monzo blog](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack). Stripe Radar and Shepherd (architecture and feature platform — no rollout procedure for a data change). — [Stripe Radar](https://stripe.com/blog/how-we-built-it-stripe-radar); [Stripe Shepherd](https://stripe.com/blog/shepherd-how-stripe-adapted-chronon-to-scale-ml-feature-development)
- Material that is project or vendor claim rather than case study: chronon.ai homepage (user logos, "guaranteed" consistency), Turing README, and third-party summary sites (ZenML database, thenote.app) used above only as pointers. — [chronon.ai](https://chronon.ai/)

### Inferences

- The honest sentence for the article: "Each link of this chain is documented by its implementers; the whole chain, run as one progressive release, is not." The reader's scenario is achievable by composing documented parts, but the composition itself (ten parallel table versions bound to a model variant in an experiment) rests on tooling documentation (dbt versions, write-audit-publish, feature-store versions — see researchers b and c), not on published case studies.
- Why the gap likely exists: large firms avoid the scenario by (1) forbidding breaking source changes and (2) logging served features, so a "new schema" reaches a model as new columns in a log rather than as a second pipeline. The parallel-pipeline design is what a team needs when neither condition holds — typical of warehouse-centric (dbt/SQL) organisations and of banks, which publish least.
- Cost scales with the number of intermediate tables times the experiment duration (compute and storage for both versions) plus shadow inference and the engineering time of a months-long staged deployment. No source quantifies this for a multi-table chain.
- The failure record supports the article's argument more strongly than the success record: undetected changes cost 45 days to 6 months of degraded models at companies with strong tooling.

### Gaps

- No published bank or payments account of the complete chain was found; absence of evidence here reflects a limited search (about 30 sources attempted, about 12 blocked), not proof that none exists.
- No quantitative cost (dollars, compute) for running two parallel pipeline versions was found. A Confluent blog attributes a $93M/year Kafka-retention backfill figure to Netflix; this is secondary vendor material, unverified, and should not be used without the original.
- Prevalence outside large technology firms is unmeasured in any source read; the interview study (n=18) is the only cross-company evidence.
