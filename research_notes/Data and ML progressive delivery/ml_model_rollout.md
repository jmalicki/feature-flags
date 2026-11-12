# Progressive release of ML models: shadow, canary, staged rollout, A/B, interleaving, bandits; running models trained on different data/feature schemas side by side (2013-2026)

Scope note: this file covers the *model release* mechanics: shadow, canary, ramp, experiment assignment, gates, rollback, evaluation hazards and regulation. Feature-store versioning (Feast `@v2`, Tecton Feature Services, Hopsworks feature views, Chronon joins) is in `feature_stores_and_versions.md`. Data-change-to-experiment chains and the incident record (Google Play stale table, Uber D3, Equifax) are in `end_to_end_cases_and_failures.md`. Those are cross-referenced here, not repeated.

Verification labels:

- FULL-TEXT: I downloaded the page or PDF with curl and searched the raw text myself. Quotations are exact and under 25 words.
- TOOL-EXTRACT: read through a fetch tool that summarises the page. Quoted phrases came back from the tool and were not checked against raw HTML.
- SNIPPET: search-result summary only, because the page refused automated fetches. No quotations are taken from these. Verify before use.
- VENDOR: product documentation that describes a capability, not a practitioner account.

Blocked during this run (403 or bot wall, no mirrors used): DoorDash engineering blog (all posts), Netflix Tech Blog on Medium (interleaving post), Lyft engineering on Medium, PayPal Tech on Medium, the Internet Archive (flagged as bot traffic), and the SR 11-7 attachment PDF (federalreserve.gov now returns 404 for `sr1107a1.pdf`).

---

## 1. Shadow deployment: candidate scores live traffic, output logged, not acted on

### Takeaway

Shadow mode is the most consistently documented first step for model releases. Implementers describe it at Uber, Meta (Looper), LinkedIn, Monzo, Nubank, Adyen and DoorDash (SNIPPET), and AWS sells it. It answers "does the model run, at the required latency, and do its scores look sane on today's traffic?" It cannot measure business impact, and for a model that decides which outcomes are seen (fraud blocks, credit declines) it cannot measure the counterfactual either. Every account follows shadow with a live A/B or challenger split.

### Cited Findings

**Uber Michelangelo (first-party):**

- Joseph Wang, Yunfeng Bai, Jia Li (Uber), "Continuous Integration and Deployment for Machine Learning Online Serving and Models", 30 June 2021. TOOL-EXTRACT. Auto-shadow is built into the prediction service. "Shadow traffic can be 100%, or picked based on some criteria of the primary model traffic", and "Shadowing usually spans a time window of days or weeks before it is stopped." Shadow models can be paused under load. Logging and sampling are combined so that only traffic that will be logged is shadowed. The deployment pipeline has three steps: artifact validation, compile, and serving validation, which loads the package and predicts on example training data. The article says deployment validation does not compare a new model against already-deployed ones, and it does not cover rollback. — [Uber blog](https://www.uber.com/blog/continuous-integration-deployment-ml/)
- Joseph Wang, Sophie Wang, Jia Li (Uber), "Raising the Bar on ML Model Deployment Safety", 30 October 2025. TOOL-EXTRACT (the uber.com page loaded through the fetch tool; the earlier raw curl copy had been blocked through the Internet Archive). Shadow testing is part of "over 75% of critical online use cases", with 100% targeted for 2025 H2. There are two modes:
  - Endpoint shadowing: teams configure the traffic split, validation logic and metrics.
  - Deployment shadow: automated, on by default for supported cases, and currently focused on prediction-drift detection.

  Teams that validate business impact through their own experiments get full credit in Uber's internal safety score. Scale: 400+ active use cases, 20,000+ training jobs per month, 15M+ predictions per second at peak. The article gives no shadow traffic percentage or duration. — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)

**Meta Looper (first-party, KDD 2022):**

- Markov et al. (Meta), "Looper: an end-to-end ML platform for product decisions", KDD '22, arXiv 2110.07554v8. FULL-TEXT. "Newly trained models are canaried (deployed on shadow traffic) before product use". Shadow models are evaluated on a sampled subset of logged features and observations using offline metrics such as MSE. Only one blueprint and model per use case is in production, but "many model instances may be undergoing shadow evaluation." Scale in 2021: 440 to 1,000 models and 4-6 million real-time decisions per second. The PDF text renders the range as "440-" followed by a line break, so the exact range wording is uncertain. — [arXiv 2110.07554](https://arxiv.org/abs/2110.07554)
- Note on terminology: Meta uses "canary" for what others call shadow. The article should define its terms.

**LinkedIn Pro-ML (first-party):**

- Rajeev Kumar et al. (LinkedIn), "Model health assurance at LinkedIn", 13 July 2021. FULL-TEXT. Pro-ML "hosts hundreds of AI models running in production". A failure caused by a model "can be observed in a dark canary environment before ramping the model to a production environment". The post monitors host metrics, inference latency, and "drift in features values and prediction values". It also says the code paths that generate features "may differ at training and inference time." — [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/analytics/model-health-assurance-at-linkedin)

**Monzo (bank, first-party):**

- Neal Lathia (Monzo), "Monzo's machine learning stack", 26 April 2022. FULL-TEXT. The model registry is used to "control the state of models as we validate them (we use shadow mode deployments extensively)". The post gives no durations or percentages. — [Monzo blog](https://monzo.com/blog/2022/04/26/monzos-machine-learning-stack)
- Neal Lathia (personal blog; he was at Monzo at the time), "Shadow mode deployments", 4 July 2020. FULL-TEXT. He defines three states: off, on, and shadow. In shadow, systems "log data about all of their decisions, and then return a default value as if they were off."
  - Worked case: text classifiers that powered automated customer answers were shipped in shadow. Sampled decisions were sent to manual validation tasks, and "Within days, we had precision and recall values for the classifiers".
  - He separates the questions: shadow tells you whether a system "inherently works before you go ahead and experiment with whether it impacts a business metric."
  - He names cases where A/B testing may be impeded: regulatory guidance (he imagines credit scoring) and "low-volume/high-impact traffic (as is the case in fraud monitoring)".
  - Source: [nlathia.github.io](https://nlathia.github.io/2020/07/Shadow-mode-deployments.html)

**Nubank (bank, first-party):**

- Nubank Editorial, "Practices to scale Machine Learning operations" (meetup write-up of a talk by Otávio Vasques), 7 April 2025. FULL-TEXT. Before full deployment, a fraud model runs in shadow mode, "where it processes real data but doesn't affect customer-facing decisions". This validates performance and SLAs, for example 700ms for PIX transactions. — [Building Nubank](https://building.nu.com/practices-to-scale-machine-learning-operations/)
- Felipe Almeida (Nubank), "De-risking Real-time ML Projects", 1 September 2023. FULL-TEXT. The advice is to "Deploy the model in shadow mode as early as possible". Risks it addresses: response time too high, inference performance different from training, and features unavailable at inference. Shadow is defined as a deployment where "model outputs are ignored by the caller services". — [Building Nubank](https://building.nu.com/de-risking-real-time-ml-projects-addressing-common-failure-modes/)
- Felipe Almeida (Nubank), "Dealing with Train-serve Skew in Real-time ML Models", 27 June 2023. FULL-TEXT. Shadow is used to monitor features before go-live. The comparison dataset is built by joining train-time and serving-time data "using the instance ID as the joining key". — [Building Nubank](https://building.nu.com/dealing-with-train-serve-skew-in-real-time-ml-models-a-short-guide/)

**Adyen (payments, first-party):**

- Andreu Mora (Adyen, SVP Engineering Data), "The AI behind Uplift", 17 January 2025. FULL-TEXT. New models go through stages: "ghost", where "we only log telemetries and statistics but we do not influence outcomes", then "challenger", which acts on a traffic split. — [Adyen Knowledge Hub](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)

**DoorDash (fraud models): SNIPPET only:**

- Bob Nugman (DoorDash), "Ship to Production, Darkly: Moving Fast, Staying Safe with ML Deployments", 8 March 2022. SNIPPET (403 to curl and to the fetch tool). Search summaries say production stage one is shadow traffic at about 1% of volume and stage two ramps shadow to 100%. The Curie experimentation platform then runs an A/B test of the incumbent "champion" against the "challenger". Not verified. — [DoorDash blog](https://careersatdoordash.com/?p=6836)

**PayPal: SNIPPET only:**

- Quinn Zuo et al. (PayPal Tech, Medium), "Deploying Large-scale Fraud Detection Machine Learning Models at PayPal", 2021. SNIPPET. A "shadow platform" logs scores without adjudicating. Not verified. — [Medium](https://medium.com/paypal-tech/machine-learning-model-ci-cd-and-shadow-platform-8c4f44998c78)

**AWS SageMaker (VENDOR):**

- "Shadow tests", SageMaker Developer Guide (current page, undated). FULL-TEXT. SageMaker deploys a shadow variant on the same endpoint and "routes a copy of the inference requests to it". "Only the responses of the production variant are returned". Shadow responses can be discarded or logged for offline comparison.
  - Stated use cases: comparing operational metrics such as latency and error rate, and validating a model, container or instance change.
  - Exclusions: serverless, asynchronous, multi-model and multi-container endpoints, Marketplace containers, and Inf1 instances.
  - Source: [AWS docs](https://docs.aws.amazon.com/sagemaker/latest/dg/shadow-tests.html)

**Cross-company interview evidence:**

- Shankar et al. (UC Berkeley), "Operationalizing Machine Learning: An Interview Study", arXiv 2209.09125 (2022). Already cited in `end_to_end_cases_and_failures.md`: one to four stages, including shadow, and staged deployments that can take months. — [arXiv](https://arxiv.org/pdf/2209.09125)

### Inferences

- Shadow is the ML equivalent of a dark launch. In the reader's scenario it is where a model trained on a new schema first proves that its features exist online. The Nubank and LinkedIn wording names "features unavailable at inference" and "training vs inference code paths" as the things shadow catches.
- Shadow durations are rarely published. The only first-party figure found is Uber's "days or weeks". Percentages are 1% then 100% (DoorDash, SNIPPET) or up to 100% (Uber).

### Gaps

- No first-party shadow durations or thresholds from banks. Monzo, Nubank and Adyen describe the stage but give no numbers apart from Nubank's 700ms SLA.
- Netflix, Lyft, DoorDash and PayPal primary text could not be read. Stripe's published material (below) does not mention shadow at all.

---

## 2. Serving two models with different inputs: routing, per-model feature fetch, fair logging

### Takeaway

In every first-party design found, the flag or experiment selects a *model*. The model's own config or artifact then determines which features are fetched. Uber's prediction service fetches the shadow model's extra features separately. LinkedIn's deployment system checks each model's feature dependencies offline and online and ties deployment to the experimentation platform. Booking.com describes the experiment design that keeps a model comparison fair: compute both models in every treatment arm and analyse only the requests where they disagree. No first-party account names an A/B test whose arms used different upstream tables or schemas; Uber's offline retrain comparison (`end_to_end_cases_and_failures.md`) is the closest.

### Cited Findings

- **Uber, per-model feature fetch (2021, TOOL-EXTRACT).** For shadow models the service "only fetches features from the online feature store that are not used in the primary model". Multiple models are loaded in one container, and clients can shift traffic gradually among a group of models. — [Uber blog](https://www.uber.com/blog/continuous-integration-deployment-ml/)
- **Uber Michelangelo 2017 (TOOL-EXTRACT, in `feature_stores_and_versions.md`).** Each model config holds its own feature DSL expressions. Competing models are deployed side by side and addressed by UUID or tag for A/B tests. Not repeated here.
- **LinkedIn Pro-ML, model-feature binding and experiment linkage.** Joel Young, Bee-Chung Chen, Bo Long, Marius Seritan, Priyanka Gariba (LinkedIn), "Scaling Machine Learning Productivity at LinkedIn", 3 January 2019. FULL-TEXT.
  - Artifacts record versions and dependencies on code and features. A central repository is "leveraged for automatic validation (e.g., are all the features available both offline and online?)".
  - "The deployment also ties with the experimentation platform to make sure that all active experiments have the required artifacts in the right targets".
  - The post gives no ramp numbers.
  - Source: [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/machine-learning/scaling-machine-learning-productivity-at-linkedin)
- **Booking.com, fair comparison of two models (the key design).** Bernardi, Mavridis, Estevez (Booking.com), "150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com", KDD 2019, Section 7. FULL-TEXT (PDF of the ACM paper).
  - Triggered analysis: "only the treatable (or triggered) subjects in both groups are analyzed."
  - For a competing-model test (Figure 10) there are three groups. "The control group invokes and uses the output from model 1, the current baseline, and also works as a safety net." In both treatment arms T1 and T2, "the outputs from both models are required", and the trigger condition is "models disagree".
  - Benefit stated: T1 and T2 do the same model computation, which removes latency as a confound.
  - Worked arithmetic: if model x is 80% accurate and model y fixes half of x's mistakes while adding 5% new ones, the models disagree on at most 15% of cases. The rest "only adds noise".
  - Safety: "all the traffic can be directed to the control group while studying the issue".
  - Section 7.2 warns that when exposure depends on the model output, the selective-triggering design cannot be used, because the control group does not know the model's output.
  - Source: [ACM DOI 10.1145/3292500.3330744](https://doi.org/10.1145/3292500.3330744)
- **Adyen, unified control group across model arms.** Mora, "The AI behind Uplift", 17 January 2025. FULL-TEXT. "All model deployments run on top of an experimentation service". It uses "A/B/n testing" against "a unified control group", with gradual rollouts. The control group "is consistent across all elements of a transaction and where models do not act". Control still receives a "market baseline": blocking known-stolen cards, SCA exemption, forced network token, and retry with challenge. The result is described as "a lower, but more honest uplift calculation". — [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)
- **SageMaker production variants (VENDOR).** "Testing models with production variants". FULL-TEXT. Traffic is split by per-variant weights, or routed by the caller with `TargetVariant`, which "overrides the random traffic distribution". The doc names "training on additional or more-recent data, improving feature selection" as reasons to compare variants. Splitting is per request unless the caller pins a variant, so user-level consistency is the caller's job (inference from the documented mechanism). — [AWS docs](https://docs.aws.amazon.com/sagemaker/latest/dg/model-ab-testing.html)
- **Counterfactual logging (VENDOR glossary).** Spotify Confidence, "What is Counterfactual Logging?" (undated). FULL-TEXT. This is "recording what a system would have shown a user under an alternative policy or variant, alongside what was actually shown." — [Confidence by Spotify](https://confidence.spotify.com/glossary/counterfactual-logging)

### Inferences

- A step-by-step procedure the sources support for "model B trained on schema v2 vs model A on v1":
  1. Bind each model to its own feature list in the artifact or config (LinkedIn, Uber; see the other file for feature-store mechanics).
  2. Validate before deploy that every v2 feature exists online (LinkedIn's "available both offline and online" check).
  3. Shadow model B, fetching only its extra features and logging its scores (Uber, Nubank).
  4. Run a three-arm experiment where control uses A, and T1 and T2 compute both A and B and act on one each. Analyse only the disagreement set (Booking).
  5. Ramp, and keep control as the instant fallback (Booking, Adyen).
- Computing both models in both arms doubles inference and feature-fetch cost in the treatment arms. That cost is the price of a fair comparison.

### Gaps

- No first-party account was found of an experiment whose two arms read from different upstream tables or schema versions. Booking's design is about models, not data versions.
- Netflix's per-arm feature handling in recommender A/Bs was not readable (blocked).

---

## 3. Assignment: who decides which model a request gets; unit; guardrails; automated ramp-down

### Takeaway

At Booking.com, LinkedIn, Adyen, DoorDash (SNIPPET) and Meta, model selection runs through the company's general experimentation platform, not a separate ML router. Automated ramp-down on system metrics (errors, latency, utilisation) is documented at Uber and in SageMaker. Automated ramp-down on *business* or *prediction-quality* metrics was not found in any first-party source; promotion on statistical confidence is described (Adyen) but not automatic demotion.

### Cited Findings

- Booking.com: "We have built our own experimentation platform", and "Machine Learning products are also tested through experiments." The latency study used a 4-arm RCT plus control with Šidák correction. "an increase of about 30% in latency costs more than 0.5% in conversion rate". — [ACM DOI](https://doi.org/10.1145/3292500.3330744) (FULL-TEXT)
- LinkedIn: deployment "ties with the experimentation platform" (FULL-TEXT, 2019). — [LinkedIn Engineering](https://www.linkedin.com/blog/engineering/machine-learning/scaling-machine-learning-productivity-at-linkedin). A search summary of a 2020 LinkedIn post on T-REX says experiment deployment latency fell to under five minutes (SNIPPET, not verified). — [LinkedIn Engineering](https://engineering.linkedin.com/blog/2020/our-evolution-towards-t-rex--the-prehistory-of-experimentation-i)
- Adyen: "When a challenger proves stronger performance than the principal model with statistical confidence, we sunset the principal". Exactly one model is labelled "principal" and serves "the vast majority of traffic". — [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift) (FULL-TEXT)
- Meta Looper: the data-flow figure shows "Experimentation System", "Canary System", "Publish canary" and "Promote canary". Blueprints are tied to "an adaptive experiments framework tied to product metrics". — [arXiv 2110.07554](https://arxiv.org/abs/2110.07554) (FULL-TEXT)
- Uber 2025: rollout starts with a small traffic slice. Auto-rollback "reverts to the last known good version" when error rates, latency or CPU/GPU utilisation breach thresholds. Threshold values are not published. — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/) (TOOL-EXTRACT)
- SageMaker deployment guardrails (VENDOR, FULL-TEXT). Blue/green with all-at-once, canary ("one small portion of your traffic") or linear ("n linearly spaced steps") shifting. CloudWatch alarms are watched for a "baking period", and auto-rollbacks fire if alarms trip. These are operational alarms, not experiment statistics. — [AWS docs](https://docs.aws.amazon.com/sagemaker/latest/dg/deployment-guardrails.html)
- Unit of randomisation: Booking's analysis unit is users/subjects. Adyen's control split is "consistent across all elements of a transaction". SageMaker splits per request. No source states a cookie, user or session policy for model experiments beyond these.
- Microsoft: Amershi et al., "Software Engineering for Machine Learning: A Case Study", ICSE-SEIP 2019. FULL-TEXT. 551 respondents (13.6% response rate). Teams use "combo-flighting techniques (i.e., flighting a combination of changes and updates)", multiple metrics in experiment scorecards, and human evaluation for sensitive data. The paper gives no ramp numbers. — [Microsoft Research PDF](https://www.microsoft.com/en-us/research/uploads/prod/2019/03/amershi-icse-2019_Software_Engineering_for_Machine_Learning.pdf)

### Inferences

- For the article: the "feature flag" that selects a model is, at these companies, an experiment assignment in the same platform used for UI changes. The reader's objection is answered by the fact that this is already how mature ML teams ship models.
- Automated rollback covers "the model is broken". "The model is worse" is still a human decision taken from experiment readouts.

### Gaps

- No published guardrail-metric list for a model experiment, and no automated business-metric kill switch, from any of the named organisations.
- The ramp schedule (percentages by day) is not published by Uber, LinkedIn, Booking or Adyen.

---

## 4. Validation gates before exposure (TFX, ML Test Score, platform equivalents)

### Takeaway

Google's published gates are: data validation against a schema, plus skew and drift checks; model validation against the currently serving model on slices ("blessing"); infrastructure validation (does it load and answer in the real serving binary); then canary with gradual turn-up and practised rollback. The thresholds are user-set. TFX gives example values, not recommended ones, and no source publishes production threshold values.

### Cited Findings

- Breck, Cai, Nielsen, Salib, Sculley (Google), "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction", IEEE Big Data 2017. FULL-TEXT.
  - Infra 4: before a model "affects real traffic", an automated system "must either bless the model or veto it".
  - Infra 6: "Models are tested via a canary process before they enter production serving environments". The motivating case is a model that needs an op (Op0.2) missing from older serving binaries. The remedy given: run "old and new models concurrently, with new models only seeing a small fraction of traffic, gradually increased as the new model is observed to behave sanely."
  - Infra 7: "Models can be quickly and safely rolled back to a previous serving version", and "Because rolling back is an emergency procedure, operators should practice doing it".
  - Monitor 7: prediction quality has not regressed on served data, because validation data "will always be older than real serving input data".
  - Source: [Google Research PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Baylor et al. (Google), "TFX", KDD 2017. FULL-TEXT, already cited in `end_to_end_cases_and_failures.md`. "a simple canary process"; a model failing checks "is not pushed to serving". — [TFX paper PDF](https://stevenwhang.com/tfx_paper.pdf)
- TFX Evaluator guide (Google docs, current). FULL-TEXT. "the Evaluator compares new models against a baseline (such as the currently serving model)". If the new model meets criteria such as "AUC is not lower", it is "blessed" and the Pusher may push it. Validation runs "against all of the metrics and slices that were defined".
  - Example config: `lower_bound` 0.5 on BinaryAccuracy plus a change threshold of `-1e-10`, i.e. no worse than baseline.
  - These are documentation examples, not recommendations.
  - Source: [TFX Evaluator](https://www.tensorflow.org/tfx/guide/evaluator)
- TFX InfraValidator guide. FULL-TEXT. LOAD_ONLY mode checks that the model loads in serving infrastructure. LOAD_AND_QUERY mode also sends sample requests. "InfraValidator does not care the prediction was correct or not." The Pusher takes both `model_blessing` and `infra_blessing`. — [TFX InfraValidator](https://www.tensorflow.org/tfx/guide/infra_validator)
- TFDV guide. FULL-TEXT. Schema-based example validation, training-serving skew detection, and drift between spans. "L-infinity distance for categorical features and approximate Jensen-Shannon divergence for numeric features". The threshold is user-set, and "Setting the correct distance is typically an iterative process". No default value is given. — [TFX TFDV](https://www.tensorflow.org/tfx/guide/tfdv)
- Breck et al. (Google), "Data Validation for Machine Learning", SysML 2019 (700+ pipelines). Already summarised in the other file. — [SysML PDF](https://mlsys.org/Conferences/2019/doc/2019/167.pdf)
- Uber 2025 (TOOL-EXTRACT): pre-production validation is mandatory, using backtesting on historical production data and latency budgets. A standardised model report covers data quality, feature importance and offline performance. The observability stack (Hue) can block promotion in high-risk cases. Ingestion checks cover type mismatches, distribution shifts and cardinality. — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)
- Stripe (first-party, undated guide page; date not shown in the fetched HTML). "A primer on machine learning for fraud detection". FULL-TEXT. Performance dashboards are updated after a model is trained, "before it is released", so engineers can see if a candidate "has gotten stale on a subset of traffic". Release speed tripled. Retraining last month's model on recent data with the same features and architecture "allows us to increase our recall by as much as half a percentage point each month." — [Stripe guide](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection)

### Inferences

- These gates map one-to-one onto software CD gates: schema check is a type check, blessing is a regression test, InfraValidator is a smoke test, canary is a canary, rollback is rollback. The ML-specific part is that the regression test compares against the *currently serving model on sliced data*, not against a fixed expected output.

### Gaps

- No organisation publishes its production blessing thresholds or drift thresholds.

---

## 5. Rollback for models, and what it cannot undo

### Takeaway

Rolling back the model artifact is documented as routine and fast (Google Infra 7, Uber auto-rollback, SageMaker auto-rollback, Booking's control-group fallback). What cannot be rolled back is stated directly by Stripe and Adyen: decisions already taken (blocked payments) and the outcomes those decisions hid. Bottou et al. and Meta Looper describe the training feedback loop, in which a deployed model shapes the data the next model trains on.

### Cited Findings

- Google ML Test Score Infra 7 (FULL-TEXT): roll back "not the system code but the learned model". — [PDF](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46555.pdf)
- Uber 2025 (TOOL-EXTRACT): every deployment has rollback protection by default, to "the last known good version". — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)
- Booking: control is a "safety net", and all traffic can go to control. — [ACM DOI](https://doi.org/10.1145/3292500.3330744) (FULL-TEXT)
- Stripe (FULL-TEXT): payments scored above the threshold "are blocked, and so we can't know what their outcomes would have been". Production precision-recall "involves counterfactual analysis". — [Stripe guide](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection)
- Adyen (FULL-TEXT): "once we apply a decision on a transaction (e.g. block it for fraud likelihood) we do not have access to the outcome if we wouldn't have acted on it." Remedy: "Control groups, randomization and exploration traffic help". — [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)
- Bottou et al. (Microsoft/Bing), "Counterfactual Reasoning and Learning Systems: The Example of Computational Advertising", JMLR 14 (2013) 3207-3260. FULL-TEXT. Bandit theory and RL "describe the exploration/exploitation dilemma associated with the training feedback loop"; the paper treats these interactions as a correlation-vs-causation problem. — [JMLR](https://jmlr.org/papers/v14/bottou13a.html)
- Sculley et al., "Hidden Technical Debt in ML Systems" (NeurIPS 2015), on feedback loops. In the scratch set, not re-quoted here; cited in the other file.

### Inferences

- For the article: model rollback is as cheap as code rollback, and cheaper than a release-train revert. But the harm done during exposure persists: wrongly declined customers, approved fraud, and a training set now labelled only where the bad model allowed outcomes to be seen. This argues for *small* exposure and long control or holdout arms, not for release trains.

### Gaps

- No first-party account of a model rollback that failed, or of retraining contaminated by a reverted model's period, was found.

---

## 6. ML-specific evaluation hazards: selection bias, delayed labels, saturation, interleaving, bandits, counterfactual evaluation

### Takeaway

Online model comparison is harder than UI A/B testing for four documented reasons:

- Offline gains do not predict online value (Booking: correlation about -0.1 across 23 comparisons).
- Labels arrive late (Booking: months for reviews; chargebacks in fraud).
- The model hides the outcomes it acts on (Stripe, Adyen).
- As models converge, the population where they disagree shrinks, and statistical power with it (Booking segment saturation).

The documented remedies are triggered analysis, interleaving for rankers (Netflix, DoorDash; SNIPPET), off-policy evaluation from randomised logs (Bottou 2013; Adyen +80% correlation), bandits (Adyen 2020, Meta Looper), and unified control groups.

### Cited Findings

- **Offline vs online (Booking, FULL-TEXT).** Across "23 comparisons (46 models)", offline gain vs business gain shows Pearson -0.1 (90% CI -0.45 to 0.27) and Spearman -0.18 (90% CI -0.5 to 0.19). "Offline model performance metrics are only a health check". The authors caution about external validity. — [ACM DOI](https://doi.org/10.1145/3292500.3330744)
- **Segment saturation (Booking, FULL-TEXT).** As models improve, the "disagreement rate goes down", reducing the exposed population "and with that, the power to detect gains". — same source.
- **Delayed labels (Booking, FULL-TEXT).** For a review-prediction model, the label arrives "after the guest completes the stay, which can be months later". Booking uses Response Distribution Analysis, a heuristic on prediction histograms, to detect defects early. Booking states it "cannot prove or disprove a model has high quality" and does not work for estimators or rankers. — same source.
- **Selection bias in label construction (Booking, FULL-TEXT).** Labels "only available for respondents"; an unbiased setup maps observations "1 to 1 to predictions made when serving". — same source.
- **Fraud counterfactual (Stripe, FULL-TEXT).** Quoted in section 5. The method is referenced to a Stripe talk that was not retrieved. Fraud is "on the order of 1 out of every 1,000 payments"; Radar wrongly blocks 0.1% of legitimate payments (Drapeau, "How we built it: Stripe Radar", 29 March 2023). — [stripe.dev](https://stripe.dev/blog/how-we-built-it-stripe-radar). What Stripe says about evaluation is limited to this:
  - Dashboards are refreshed before release.
  - The precision-recall curve is monitored when models change.
  - Counterfactual estimation for blocked payments is described as necessary but not explained.
  - The words "shadow", "A/B", "holdout" and "backtest" do not occur in either Stripe page read.
- **Off-policy evaluation in production (Adyen, FULL-TEXT).** A/B tests "often come back flat or insignificant". Adyen's OPE gives "high correlation (+80%) to On-policy Estimates (actual AB Tests)". Claimed savings: about 20 weeks/year of flat tests and "an incremental 9-54 million transactions over a six-month period". Adyen says the research was submitted to RecSys '25. — [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)
- **Bandits replacing A/B for payment optimisations (Adyen, FULL-TEXT).** Rodel van Rooijen, "Optimizing payment conversion rates with contextual multi-armed bandits", 2 November 2020. A/B tests split by extra features gave "small and thus insignificant A/B test groups". The fix was an epsilon-greedy contextual bandit. The post warns about selection bias in historical logs, where actions "not have been observed in the past at all". — [Adyen](https://www.adyen.com/knowledge-hub/optimizing-payment-conversion-rates-with-contextual-multi-armed-bandits)
- **Counterfactual estimation, conditions (Bottou et al. 2013, FULL-TEXT).** Importance sampling "relies on the assumption" that the logging policy's probabilities are nonzero wherever the new policy's are. In practice the data must be collected with randomisation. A wide outer confidence interval means "the sample is too small" and data collection must continue. The paper is illustrated on Bing ad placement, with mainline reserves as the example (Section 4.6). — [JMLR](https://jmlr.org/papers/v14/bottou13a.html)
- **Meta Looper (FULL-TEXT).** Policies "use randomization to explore the action space, e.g. Thompson sampling in contextual bandits". The paper notes that correlation in training data "does not imply causal improvement of product metrics", which is why A/B testing is needed. — [arXiv 2110.07554](https://arxiv.org/abs/2110.07554)
- **Interleaving (Netflix 2017): SNIPPET only.** Parks et al., Netflix Tech Blog, "Innovating Faster on Personalization Algorithms at Netflix Using Interleaving", 2017. The page refused fetches.
  - Secondary summaries say it describes a two-stage process: interleaving to prune rankers, then A/B on the survivors. They attribute roughly 100x sensitivity versus A/B to it.
  - DoorDash's interleaving post reportedly gives 100x-500x for its own experiments. Also SNIPPET.
  - Limit stated in the summaries: interleaving measures within-session preference, not retention or revenue, so A/B still follows.
  - Do not quote numbers without reading the original.
  - Sources: [Netflix Tech Blog](https://netflixtechblog.com/interleaving-in-online-experiments-at-netflix-a04ee392ec55); [DoorDash](https://careers.doordash.com/blog/doordash-experimentation-with-interleaving-designs)

### Inferences

- In fraud and credit, a "flag that sends 5% of traffic to model B" is not enough for evaluation. You also need a randomised slice where the decision is relaxed (exploration or control), or you never learn what B would have caught or wrongly blocked. That slice costs real money: approved fraud and lost good customers. Adyen's "market baseline" control is one way to cap that cost.
- Long label delays (chargebacks, Booking's months-later reviews) mean an experiment cannot be read on the same timescale as a UI test. Guardrails then use proxies such as score distributions and decline rates, which is what Booking's RDA and Uber's prediction-drift shadow are.

### Gaps

- Chargeback label-delay figures (days or weeks) were not found in a first-party source read in full.
- Netflix's and DoorDash's interleaving numbers are unverified.

---

## 7. Financial and regulatory context: SR 26-2, PRA SS1/23, champion/challenger

### Takeaway

SR 26-2 (17 April 2026) replaces SR 11-7. It asks for outcomes analysis, ongoing monitoring and validation before first use. It mentions "benchmarking to other models" only in passing, and it does not use the words "parallel", "champion" or "challenger". It also takes generative and agentic AI out of scope. The UK PRA's SS1/23 is more specific. It names challenger-model comparison in development testing, benchmarking and "parallel outcomes analysis" in monitoring, and before/after comparison for material changes in dynamic models. Neither text prescribes production A/B tests or traffic splitting. "Champion/challenger" as a deployment pattern appears in implementer language (DoorDash SNIPPET; Adyen's "principal-challenger") and as a validation tool in EBA material, not as a regulator-defined production procedure.

### Cited Findings

**Federal Reserve / OCC / FDIC, SR 26-2 (read directly at federalreserve.gov), FULL-TEXT:**

- Letter, 17 April 2026, signed by Randall D. Guynn. It issues "Revised Guidance on Model Risk Management", which "supersedes and replaces SR letter 11-7" (4 April 2011) and SR 21-8 (BSA/AML, 9 April 2021). It is jointly issued with the OCC and FDIC and is "expected to be most relevant to banking organizations with over $30 billion in total assets". — [SR 26-2](https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm)
- Attachment, footnote 3: "Generative AI and agentic AI models are novel and rapidly evolving. As such, they are not within the scope of this guidance." The principles apply to traditional models and "non-generative, non-agentic AI models". — [SR 26-2 attachment PDF](https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf)
- Model definition excludes "deterministic rulebased processes" without statistical, economic or financial theory. — same PDF.
- Section V, Model Validation and Monitoring (about pp. 7-9 of the attachment):
  - "Validation generally occurs prior to a model's first use." An urgent business need may justify use before validation is finished, with "placing limits on model use or more closely monitoring its performance".
  - Outcomes analysis "compares model outputs to corresponding real-world outcomes". Forms named are testing during development, ongoing monitoring, "back-testing or outlier analysis".
  - Ongoing monitoring evaluates whether "a model is performing as expected given potential changes in products, exposures, activities, clients, data relevance, or market conditions". Deterioration may warrant "overlays, adjustment, or redevelopment". Monitoring frequency depends on model nature and materiality.
  - The only benchmarking mention found is in developmental evidence: "benchmarking to other models".
  - A regex search of the attachment text for "parallel", "champion" and "challenger" found no matches.
  - Source: [SR 26-2 attachment PDF](https://www.federalreserve.gov/supervisionreg/srletters/SR2602a1.pdf)
- SR 11-7 text itself could not be retrieved for comparison (`sr1107a1.pdf` returns 404; the Internet Archive blocked automated access). Any claim about what SR 11-7 said on parallel runs or benchmarking must come from another source.

**Bank of England PRA, SS1/23 "Model risk management principles for banks" (read directly), FULL-TEXT:**

- Published May 2023 with PS6/23. "The policy comes into effect on Friday 17 May 2024." Applies to banks, building societies and designated investment firms with internal-model approval. — [PRA SS1/23 PDF](https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2023/ss123.pdf); [publication page](https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss)
- Principle 3.3, Model development testing:
  - Where practicable, compare model output "with the output of available challenger models". The extent of challenger comparison feeds the model's tier.
  - For material changes, "including material changes over a period of time in dynamic models (ie models able to adapt, recalibrate, or otherwise change autonomously in response to new inputs)", compare output before and after the change against actual outcomes. The PRA calls this "parallel outcomes analysis".
- Principle 4.4, Model performance monitoring: tests include "(i) benchmarking", "(ii) sensitivity testing", "(iii) analysis of overrides", and "(iv) parallel outcomes analysis – assessing whether new data should be included in model calibration". Frequency is set by model tier. Monitoring must also assess "whether the model has been used beyond the intended use".
- Principle 1.2: a decommissioned model "may be used as a challenger model itself".
- Principle 5 requires policies for "model risk mitigants when models are under-performing" and independent review of post-model adjustments.

**Champion/challenger: authoritative description:**

- No regulator text found defines a production champion/challenger traffic split.
- The PRA's "challenger models" are alternative implementations used in testing and benchmarking.
- EBA, "Machine Learning for IRB Models: Follow-up report from the consultation on the discussion paper" (2023), Section 3.2. FULL-TEXT. Institutions use ML "to develop challenger models (for example, for a robustness analysis and to challenge the variables of the final model developed)" and for benchmarking in initial and ongoing validation. This too is offline validation, not traffic splitting. — [EBA PDF](https://www.eba.europa.eu/sites/default/files/document_library/Publications/Reports/2023/1061483/Follow-up%20report%20on%20machine%20learning%20for%20IRB%20models.pdf)
- Implementer usage: Adyen "principal/ghost/challenger/retired" (FULL-TEXT); DoorDash "champion vs challenger" on Curie (SNIPPET).

### Inferences

- Regulators ask for comparison against outcomes and alternatives, and the PRA explicitly asks for before/after comparison when models change. A shadow run plus a controlled split is a direct way to generate that evidence, so progressive delivery helps compliance rather than conflicting with it. But validation must generally precede first use (SR 26-2). In a bank, even a small live challenger slice is "use" and needs prior validation or explicit limits. Shadow mode, which takes no decisions, is the stage that fits before validation sign-off. This is an inference; no regulator says it.
- For credit decisions specifically, A/B testing a model on customers raises fair-lending and adverse-action issues not covered here. Lathia's remark that regulation may impede credit A/B tests is an opinion, not a citation of law.

### Gaps

- SR 11-7 wording was not retrieved. OCC Comptroller's Handbook "Model Risk Management" (2021) was blocked.
- No US or UK enforcement action citing a model rollout or champion/challenger failure was found.

---

## 8. Limits and failures: where progressive model delivery stops working

### Takeaway

The documented limits are:

- Underpowered experiments as models converge (Booking) or as segments get small (Adyen).
- Offline/online disagreement, so every model needs a live test (Booking, Airbnb in the other file).
- Unobservable counterfactuals for decisioning models (Stripe, Adyen).
- Delayed labels (Booking).
- Slow organisational adoption: Uber reached 75% shadow coverage of critical use cases only in 2025.
- The cost of holding out traffic: Adyen calls it "sacrificing" the split.

No first-party post-mortem of a staged model rollout going wrong was found. The failure record in `end_to_end_cases_and_failures.md` is about data changes, not model ramps.

### Cited Findings

- Adyen (FULL-TEXT): an A/B test of "a bad variant it costs money". Reaching significance "can take a long time", there is an "upper-bound on the number of experiments you can run in a year", and "simply 'sacrificing' the traffic split". "in mature product orgs, AB tests often come back flat or insignificant". — [Adyen](https://www.adyen.com/knowledge-hub/the-ai-behind-uplift)
- Booking (FULL-TEXT): "too small gains, impossible to detect in an RCT in reasonable time". Also the "Uncanny Valley effect", where better predictions unsettle users, and proxy over-optimisation. — [ACM DOI](https://doi.org/10.1145/3292500.3330744)
- Uber (TOOL-EXTRACT): shadow "over 75%" of critical use cases, 100% still a target in 2025. Regressions "that once lasted days now surface within hours". — [Uber blog](https://www.uber.com/blog/raising-the-bar-on-ml-model-deployment-safety/)
- SageMaker (VENDOR): shadow tests are unavailable for serverless, async, multi-model and multi-container endpoints. Even vendor tooling does not cover every serving topology. — [AWS docs](https://docs.aws.amazon.com/sagemaker/latest/dg/shadow-tests.html)
- Lathia (FULL-TEXT): for "low-volume/high-impact traffic (as is the case in fraud monitoring)" teams may not want to send traffic "down a path that you don't know anything about". Shadow is the substitute. — [nlathia.github.io](https://nlathia.github.io/2020/07/Shadow-mode-deployments.html)
- Microsoft (FULL-TEXT): strict module boundaries between models are hard because models are "not easily extensible" and interact in non-obvious ways. Model changes, parameter tuning and data updates together drive frequent revisions. — [Microsoft Research PDF](https://www.microsoft.com/en-us/research/uploads/prod/2019/03/amershi-icse-2019_Software_Engineering_for_Machine_Learning.pdf)

### Inferences

- Where it stops working, in the reader's terms:
  - Low-traffic or high-stakes decisions: power is too small and an exploration slice is too costly. Shadow plus offline or off-policy evaluation substitutes.
  - Labels delayed for months: the ramp must be decided on proxies.
  - Credit decisions under model-risk regulation: validation precedes use, so the live slice is small and pre-approved.
  - Two models whose features need a new upstream pipeline: the pipeline must exist in production before the shadow stage. See the other file.
- None of these limits is an argument for release trains. Each is an argument for longer shadow, randomised control or holdout slices, and explicit cost budgets for them.

### Gaps

- No first-party or filing-based account of a staged model rollout that failed or caused an incident was found within the time budget. Zillow Offers (Q3 2021 wind-down) is a model-driven business failure, but its press release could not be parsed in this run, and it is not a rollout failure.
- No quantified cost of holdouts (dollars or lost conversions) apart from Adyen's "9-54 million transactions" OPE claim and Booking's latency-conversion curve.
