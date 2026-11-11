# Rollback technology: restoring a previously built, already-proven artifact (c. 2005-2025)

**How to read these notes.** Every source entry carries an access tag:

- **[FT]** = I read the full text myself (page or PDF downloaded and searched/read directly). Quotations under this tag were seen by me in the source text.
- **[TE]** = tool extraction: the page was fetched and a small model returned passages. Quotations are as returned by the tool; I did not independently re-read the page. Treat as "probably verbatim, re-check before printing".
- **[SN]** = search-result snippet only. Not verified against the page. Do not quote.

Source type is marked: **primary** (implementer writing about their own system), **vendor/project docs**, **journalism**, **secondary**. All quotations are under 25 words. Dates are publication dates unless stated; where a practice is known to predate publication I say so. Nothing here was taken from a video.

Scope boundary: rollback AUTHORITY/policy, regulator text on back-out plans, Knight Capital, RBS 2012, and Stripe online migrations belong to sibling notes and are cross-referenced only. Sibling files in this folder that already hold overlapping sources: `amazon_netflix_linkedin_etsy.md` (Builders' Library rollback-safety and hands-off deployments, Deployinator), `staging_soak_vs_production.md`, `counter_evidence_and_failures.md`, `empirical_and_regulated.md` (Monzo, Knight), `google_facebook_quality_ownership.md` (SRE release engineering, Rapid release).

---

## 1. "Build once, deploy many" and immutable artifacts: what the founding texts actually say about rollback

### Takeaway

The canonical statement is Humble & Farley's "only build your binaries once" (2010): the binary that reaches production must be the same one that passed acceptance testing, verified by hash, and recompiling later risks toolchain and dependency differences. Importantly, the founding immutable-infrastructure texts (Fowler's PhoenixServer 2012, Morris's ImmutableServer 2013, Chad Fowler 2013) argue from configuration drift and repeatability and do not themselves discuss rollback; the explicit rollback claims are in Fowler's BlueGreenDeployment (2010) and the Twelve-Factor App.

### Cited Findings

**Humble & Farley, *Continuous Delivery* (Addison-Wesley, 2010), ch. 5 "Anatomy of the Deployment Pipeline", section "Only Build Your Binaries Once" — primary (authors), read as the InformIT sample chapter. [FT]** URL: <https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3> (section "Deployment Pipeline Practices"). I did not verify the InformIT posting date; the book is 2010.

- The anti-pattern they describe is compiling repeatedly from source in each context (commit, acceptance, capacity, each deployment target). Quote: "Every time you compile the code, you run the risk of introducing some difference." — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- Named sources of difference: a different compiler version in later stages, an unintended different third-party library version, compiler configuration. Quote: "We have seen bugs from every one of these sources reaching production." — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- The core rule. Quote: "The binaries that get deployed into production should be exactly the same as those that went through the acceptance test process". They add that many pipelines check this by storing hashes of the binaries at creation and verifying them at every later stage. — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- Audit argument, directly relevant to a regulated reader. Quote: "For auditing purposes, it is essential to ensure that no changes have been introduced, either maliciously or by mistake". They note some organizations restrict compilation/packaging to an environment only senior personnel can access. — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- Artifact storage: binaries go on a filesystem/artifact repository, not version control; the CI server must let you trace a binary back to the check-in that produced it. — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- **Complication worth recording:** the same passage says backing up binaries is not worth much effort because "it should be possible to exactly re-create them by running your automated build process from the correct revision". That is in tension with the "never rebuild for rollback" reading: the authors assume a repeatable build, and their objection is to *untracked* rebuilds in the pipeline, not a claim that old artifacts must be retained forever. — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- Limits: this section does not mention rollback. The book's rollback material (ch. 10, "Deploying and Releasing Applications") is not in the free sample and I did not read it; do not attribute rollback wording to ch. 5.

**Martin Fowler, "DeploymentPipeline" (bliki), 30 May 2013 — secondary/summary by a close collaborator. [TE]** URL: <https://martinfowler.com/bliki/DeploymentPipeline.html>

- Only relevant sentence returned: "Usually the first stage of a deployment pipeline will do any compilation and provide binaries for later stages." No statement on rollback or on rebuilding. — [Fowler, DeploymentPipeline](https://martinfowler.com/bliki/DeploymentPipeline.html)

**Martin Fowler, "BlueGreenDeployment" (bliki), 1 March 2010 (updated 2015) — primary description of the pattern (credits Humble & Farley's then-forthcoming book). [TE]** URL: <https://martinfowler.com/bliki/BlueGreenDeployment.html>

- Quote: "Blue-green deployment also gives you a rapid way to rollback". Mechanism: switch the router back to the still-intact previous environment. — [Fowler, BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- Stated limit in the same article. Quote: "There's still the issue of dealing with missed transactions while the green environment was live". Suggested mitigations: feed transactions to both environments, or go read-only around cut-over. — [Fowler, BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- On databases. Quote: "The trick is to separate the deployment of schema changes from application upgrades." First deploy a schema refactoring that supports both versions, verify, then deploy the application. — [Fowler, BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- Limits: a pattern description, not a report of measured rollback times.

**Martin Fowler, "PhoenixServer" (bliki), 10 July 2012. [TE]** URL: <https://martinfowler.com/bliki/PhoenixServer.html>

- Argument is configuration drift, defined as "ad hoc changes to a systems configuration that go unrecorded." Quote: "A server should be like a phoenix, regularly rising from the ashes." — [Fowler, PhoenixServer](https://martinfowler.com/bliki/PhoenixServer.html)
- Limits: the tool reported no discussion of rollback or known-good state on this page.

**Kief Morris, "ImmutableServer" (martinfowler.com bliki), 13 June 2013. [TE]** URL: <https://martinfowler.com/bliki/ImmutableServer.html>

- Quote: "Fixes, changes, and updates are applied to the base image rather than to running systems." Servers without the change are torn down and replaced. — [Morris, ImmutableServer](https://martinfowler.com/bliki/ImmutableServer.html)
- Stated limits: "If servers are disposable, the data that lives on them often is not."; per-instance configuration should be minimized. — [Morris, ImmutableServer](https://martinfowler.com/bliki/ImmutableServer.html)
- Limits: the tool reported that the article does not discuss rollback.

**Chad Fowler, "Trash Your Servers and Burn Your Code: Immutable Infrastructure and Disposable Components", 23 June 2013 — primary (then CTO of 6Wunderkinder). [FT via Wayback Machine copy; original URL now 404].** Original URL: <http://chadfowler.com/2013/06/23/immutable-deployments.html> (archive: <https://web.archive.org/web/2017/http://chadfowler.com/2013/06/23/immutable-deployments.html>)

- The motivating problem is long-lived servers accreting one-off fixes. Quote: "A quick edit to a config file saves the day." Later: "The system becomes a house of cards." — [Chad Fowler 2013](https://web.archive.org/web/2017/http://chadfowler.com/2013/06/23/immutable-deployments.html)
- The proposal. Quote: "Build a new, upgraded system and throw the old one away." For a new app revision: build a server or image with the new revision and discard the old ones. — [Chad Fowler 2013](https://web.archive.org/web/2017/http://chadfowler.com/2013/06/23/immutable-deployments.html)
- He describes it as four months of practice at 6Wunderkinder and "a work in progress". — [Chad Fowler 2013](https://web.archive.org/web/2017/http://chadfowler.com/2013/06/23/immutable-deployments.html)
- Limits: **the post does not contain the word "rollback"** (I read the full short text). It establishes the "never upgrade in place" idea, not a rollback claim.

**Adam Wiggins (Heroku co-founder), *The Twelve-Factor App*, factor V "Build, release, run" — primary. Site first published 2011; page says last updated 2017. [TE]** URL: <https://12factor.net/build-release-run>

- Quote: "The resulting release contains both the build and the config". — [12factor V](https://12factor.net/build-release-run)
- Quote: "Releases are an append-only ledger and a release cannot be mutated once it is created." And: "Any change must create a new release." — [12factor V](https://12factor.net/build-release-run)
- Quote: "Every release should always have a unique release ID, such as a timestamp of the release". — [12factor V](https://12factor.net/build-release-run)
- On rollback. Quote: "Deployment tools typically offer release management tools, most notably the ability to roll back to a previous release." The example given is Capistrano's `releases` directory with a `current` symlink and its `rollback` command. — [12factor V](https://12factor.net/build-release-run)
- Significance: this is the clearest early statement that the unit of rollback is build **plus config**, not code alone.
- Limits: a design manifesto; no measurements.

**Google, *Site Reliability Engineering* (O'Reilly, 2016), ch. 8 "Release Engineering" (Dinah McNutt) — primary. [TE]** URL: <https://sre.google/sre-book/release-engineering/>

- Section "Hermetic Builds": builds "depend on known versions of build tools, such as compilers, and dependencies, such as libraries." Two people building the same revision: "we expect identical results." — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Rebuilding old releases is done deliberately and reproducibly for cherry-picks. Quote: "We accomplish this task by rebuilding at the same revision as the original build". Build tools are themselves versioned by the source revision. — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Section "Packaging": MPM packages are "versioned with a unique hash, and signed to ensure authenticity". Labels can be applied to a package version to mark its stage in the release process; applying an existing label to a new package moves the label. — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Section "Deployment": "Sisyphus uses the build label to specify which version of the MPM packages should be deployed." — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Limits: the tool reported that the chapter does not describe a rollback mechanism and does not state "build once" in those words. Note that MPM *labels* are mutable pointers to immutable hash-identified packages, the same tag-vs-digest structure later seen in container registries.

**Burns, Grant, Oppenheimer, Brewer, Wilkes (Google), "Borg, Omega, and Kubernetes", ACM Queue vol. 14 no. 1, 2 March 2016 — primary. [FT via Wayback Machine copy of queue.acm.org].** URL: <https://queue.acm.org/detail.cfm?id=2898444>

- Quote: "Within Google, MPM (Midas Package Manager) is used to build and deploy container images." — [Borg, Omega, and Kubernetes](https://queue.acm.org/detail.cfm?id=2898444)
- The enabling idea is a hermetic image encapsulating almost all dependencies. Quote: "program binaries are statically linked at build time to known-good library versions hosted in the companywide repository." — [Borg, Omega, and Kubernetes](https://queue.acm.org/detail.cfm?id=2898444)
- **Admitted leak in hermeticity:** Borg applications share a machine-installed base image (tar, libc). Quote: "upgrades to the base image can affect running applications and have occasionally been a significant source of trouble." — [Borg, Omega, and Kubernetes](https://queue.acm.org/detail.cfm?id=2898444)
- Limits: the article names "rollout tools" for binaries and configuration but does not describe rollback mechanics.

**Verma et al. (Google), "Large-scale cluster management at Google with Borg", EuroSys 2015 — primary. [FT, PDF].** URL: <https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/>

- Section 2.3. Quote: "Borg programs are statically linked to reduce dependencies on their runtime environment, and structured as packages of binaries and data files". — [Borg paper](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
- Job updates: "Updates are generally done in a rolling fashion", with a limit on task disruptions. — [Borg paper](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
- Limits: I searched the PDF text for "rollback", "roll back", "rolled back" and "MPM" and found none. **The Borg paper should not be cited for rollback**; it supports only static linking/packaging and rolling updates.

### Inferences

- The chain of reasoning the essay needs is assembled from several texts, not found in one: Humble & Farley supply "what was tested is what runs, checked by hash"; Twelve-Factor supplies "a release (build + config) is immutable and rollback selects an earlier one"; Fowler's blue-green supplies "keep the old one running so rollback is a router change". Presenting any single 2010-2013 text as saying all three would overstate it.
- "Why not rebuild from source for a rollback" is, in the primary texts, an argument about toolchain/dependency drift and audit, not about time pressure. I found no founding-era primary source that makes the time-pressure argument explicitly; the closest is Dan McKinley (2017, section 8) on panic and the Google CRE post (2017, section 5) on roll-forward under pressure.
- Humble & Farley's remark that binaries can be re-created from the right revision shows the principle was about *provenance and identity*, with artifact retention treated as a convenience. Later practice (digests, registries, retention windows) hardened retention because builds are often not bit-for-bit reproducible.

### Gaps

- I did not read Humble & Farley ch. 10 (rollback, blue-green, canary releasing) or ch. 12 (data); not in the free sample. A search for an online verbatim passage failed. The essay should not quote ch. 10 from these notes.
- continuousdelivery.com was not fetched; no author statements from that site are recorded here.
- Fowler's "SnowflakeServer" was not fetched.
- Bazel/Blaze reproducibility documentation was not fetched; the hermetic-build claim rests on the SRE book only.

---

## 2. Image- and artifact-based deployment at specific companies: what is rolled back to, and how

### Takeaway

Across Netflix, Amazon, Google, Facebook/Meta, Heroku, Slack, Wealthfront and Kubernetes-era firms, production rollback is implemented as re-pointing traffic or a version pointer at an artifact that already exists (an AMI in a disabled server group, a retained binary on disk, a slug, a ReplicaSet/pod template, a container image), not as a rebuild. The evidence is uneven: Netflix, Amazon, Heroku, Kubernetes and Wealthfront document the mechanism; Monzo, Slack, Uber and Shopify document that rollback exists but not precisely what artifact is restored; Etsy and GitHub deployed from source revisions and their "rollback" is a redeploy of an earlier revision or of master.

### Cited Findings

#### Netflix (AMIs, Asgard, Spinnaker)

**Michael Tripoli & Karate Vick (Netflix), "AMI Creation with Aminator", 22 March 2013 — primary. [FT via Wayback copy].** URL: <https://netflixtechblog.com/ami-creation-with-aminator-98d627ca37b0> (the live site returned HTTP 403 to my tools; read at web.archive.org).

- Why bake: start-up latency during scale-up, and no runtime dependency on package repos or config services. Quote: "The AMI would have to be discrete and hermetic." — [Aminator post](https://netflixtechblog.com/ami-creation-with-aminator-98d627ca37b0)
- Practice predates the post: it describes "the past three years" of AMI tooling. Bake times reported: S3-backed launch/bake "between 15 and 20 minutes"; EBS-backed 8-10 minutes; the Bakery "under 5 minutes". — [Aminator post](https://netflixtechblog.com/ami-creation-with-aminator-98d627ca37b0)
- A base AMI "goes through a candidate test and release process every week or two". — [Aminator post](https://netflixtechblog.com/ami-creation-with-aminator-98d627ca37b0)
- Limits: no statement about rollback; baking is justified by launch speed and hermeticity.

**Joe Sondow (Netflix), "Asgard: Web-based Cloud Management and Deployment", 25 June 2012 — primary. [FT via Wayback copy].** URL: <https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1>

- Section "Fast Rollback": versioned auto-scaling groups in a cluster (example `obiwan-v063`, `obiwan-v064`). Quote: "The old ASG is “disabled” meaning it is not taking traffic but remains available in case a problem occurs". — [Asgard post](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)
- The rollback sequence listed: create v064, enable traffic to it, disable traffic on v063, notice trouble, re-enable traffic on v063, disable v064, analyze logs, delete v064. — [Asgard post](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)
- Cost acknowledged in the same paragraph. Quote: "This method requires more instances to be in use during deployment, but it can greatly reduce the duration of service outages". — [Asgard post](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)
- Where it does not fit: a "rolling push" is offered for sharded instances or clusters (the post names Cassandra) that cannot tolerate a sudden doubling of instances. — [Asgard post](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)
- Limits: no measured rollback duration.

**Ben Schmaus (Netflix), "Deploying the Netflix API", 14 August 2013 — primary. [FT via Wayback copy].** URL: <https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0>

- Defines the "red/black push": launch a new ASG with the chosen AMI (typically baseline instance count plus 10%), then disable traffic to the baseline ASG "but keep the instances online in case a rollback is needed." — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Rollback is re-enabling traffic to the "black" ASG and disabling the new one. Caveat stated: "depending on when the rollback happens you may need to adjust server capacity of the baseline ASG." — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Quote: "Rollbacks, if needed, are also automated." — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Canary context: 1000+ metrics compared between baseline and canary; a score below 95 generally means no-go; prod-branch canaries with a high enough score "after 8 hours" are deployed globally. Each canary report includes a source diff and a library/config diff "of code changes in the AMI". — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Limits: one team's practice in 2013; no rollback timing; no statement of how long the black ASG is retained.

**Netflix Technology Blog, "How We Build Code at Netflix", 9 March 2016 — primary. [FT via Wayback copy].** URL: <https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15>

- Quote: "Our deployment strategy is centered around the Immutable Server pattern." Live modification is "strongly discouraged". — [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Quote: "Every deployment at Netflix begins with the creation of a new Amazon Machine Image, or AMI." The build produces a Debian/RPM package (Nebula ospackage) which the Bakery installs onto a Base AMI. — [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Build-once across environments. Quote: "The same AMI is usable across multiple environments as Spinnaker exposes a runtime context to the instance". — [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Measured: 16 minutes from check-in to multi-region deployment for Janitor Monkey; "the bake process took 7 minutes or 44%" of that. Bake time is named as a current "impediment". — [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Limits: **the post does not describe rollback by re-enabling the previous cluster** (the assignment brief suggested it did). I searched the text: red/black appears once in a list of Spinnaker capabilities; "rollback" does not appear. Use the 2012/2013 posts for the rollback mechanism.

**Spinnaker project docs, "Automated rollbacks" (Kubernetes provider) — project documentation. [TE]** URL: <https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/>

- "Undo Rollout" exists as an ad-hoc action and a pipeline stage; a "Revisions Back" parameter selects how far. Rollback stages "are best configured to run when other stages or branches fail". — [Spinnaker docs](https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/)
- A rollback is recorded as a new revision: "the old configuration (version 3) will be rolled forward into a new version (version 5)." — [Spinnaker docs](https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/)
- **Important caveat.** If deployed artifacts are not versioned, "rolling back your manifest will likely not roll back your code or config changes." Applies to ConfigMaps and Secrets. — [Spinnaker docs](https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/)

#### Amazon (Apollo, Builders' Library, CodeDeploy, Lambda)

**Werner Vogels (attributed; post is unsigned on his blog), "The Story of Apollo - Amazon's Deployment Engine", 12 November 2014 — primary. [TE]** URL: <https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html>

- Apollo does rolling updates of "only a fraction of the hosts" at a time, tracks per-host deployment status, and can halt automatically past a failure threshold. — [Story of Apollo](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Rollback is mentioned as "a quick rollback to the prior version". Developers can "view their history" to see what ran when. — [Story of Apollo](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Scale: "Apollo was used for 50M deployments" in the prior 12 months across dev, test and production hosts. — [Story of Apollo](https://www.allthingsdistributed.com/2014/11/apollo-amazon-deployment-engine.html)
- Limits: the tool found no use of the phrase "versioned artifacts"; the post does not explain how the prior version is stored or restored. Apollo itself dates from well before 2014.

**Clare Liguori (AWS), "Automating safe, hands-off deployments", Amazon Builders' Library, 18 June 2020 — primary. [TE]** URL: <https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/> (now redirects to builder.aws.com). Already held by sibling `amazon_netflix_linkedin_etsy.md`; recorded here only for the rollback mechanism.

- Quote: "The deployment system actively monitors an alarm to determine if it needs to automatically roll back a deployment." — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- What is restored. Quote: "A rollback will switch the environment back to the container image" previously deployed; packages "are immutable and use a checksum to verify their integrity." — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- One-box stage serves "at most ten percent" of a Region's/AZ's requests; on negative impact "the pipeline automatically rolls back the change". Rolling deployments replace at most 33% of boxes per batch; "fast rollbacks" replace 33% at a time with previous code. — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Limits: no rollback duration; no rollback frequency.

**AWS CodeDeploy User Guide, "Redeploy and roll back a deployment with CodeDeploy" — vendor documentation. [FT of the page as returned].** URL: <https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html>

- Quote: "CodeDeploy rolls back deployments by redeploying a previously deployed revision of an application as a new deployment." They are "technically new deployments, with new deployment IDs". — [CodeDeploy docs](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
- Automatic rollback triggers: deployment failure or a monitoring threshold; "the last known good version of an application revision is deployed." — [CodeDeploy docs](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
- **Documented limit of in-place (non-image) rollback:** CodeDeploy removes only files it installed; it "will not try to revert or otherwise reconcile any actions taken by any scripts in previous deployments". Files created by deployment scripts persist, and the docs give a worked case where files expected to be retained "cannot be retrieved" after a failed deployment. — [CodeDeploy docs](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
- Use: this is a concrete, vendor-documented illustration of why rolling back files on a mutable host is weaker than replacing an immutable image.

**AWS Lambda Developer Guide, "Manage Lambda function versions" and "Create an alias" — vendor documentation. [FT of pages as returned].** URLs: <https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html> ; <https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html>

- Quote: "When you publish a version, Lambda creates an immutable snapshot of your function's code and configuration." Version numbers are monotonically increasing and never reused. — [Lambda versions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
- Quote: "A Lambda alias is a pointer to a function version that you can update." An alias can "split traffic between two versions". — [Lambda aliases](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html)
- Leak in immutability noted in the docs: with runtime management in Auto mode, "the runtime version used by the function version is updated automatically." — [Lambda versions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
- Limits: the docs do not use the word rollback on these pages; rollback = repoint the alias is my reading of the mechanism.

#### Google

- See section 1 for the SRE book ch. 8, the Queue article, and the Borg paper (hash-identified signed MPM packages; movable labels; static linking; base-image leak). None of the three describes a rollback procedure. — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Google's rollback practice is described in the 2017 CRE post (section 5) and the SRE Workbook canarying chapter (section 3). — [CRE: Reliable releases and rollbacks](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)

#### Facebook / Meta

**Ryan Paul, "Exclusive: a behind-the-scenes look at Facebook release engineering", Ars Technica, 5 April 2012 — JOURNALISM (reporter's account of an interview with Chuck Rossi; not a Facebook-authored source). [FT]** URL: <https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/>

- The whole PHP code base compiled (HipHop) into one executable; Rossi "told me that the binary... is approximately 1.5GB in size." Distributed by a custom BitTorrent tracker. — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- Timing as reported: "an average of 30 minutes—15 minutes to generate the binary executable and another 15 minutes to push". — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- Rollback mechanism as reported: "The servers retain previous versions of the Facebook binary and can be made to switch back to those if it’s absolutely necessary." — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- Attitude as reported: Rossi's quoted reply was "Reverting is for losers!"; the article says binary rollback is "a measure of last resort" and that "he’s only had to do it a few times." — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- Limits: second-hand; no count, no timing for a rollback; describes the 2012 system only.

**Chuck Rossi (Facebook), "Rapid release at massive scale", 31 August 2017 — primary. [TE]** URL: <https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/> (held by siblings; recorded here for the flag-vs-binary point, see section 3).

- Staged push: employees, then "2 percent of production", then 100 percent, "in a tiered fashion over a few hours". — [Rapid release at massive scale](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/)
- Limits: the tool reported the article does not describe a binary rollback procedure.

**Grubic et al. (Meta), "Conveyor: One-Tool-Fits-All Continuous Software Deployment at Meta", OSDI 2023 — primary, peer-reviewed. [FT, PDF].** URL: <https://www.usenix.org/conference/osdi23/presentation/grubic>

- Scale: "over 30,000 deployment pipelines"; 97% of container-service pipelines are fully automated. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Health-check failure handling. Quote: "By default, a failed health check triggers Conveyor to revert the release." — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- **Meta explicitly rejects the keep-the-old-one-warm ("mirroring"/blue-green) model on cost.** Quote: "the cost of keeping spare hardware for a second deployment is prohibitive for our hyperscale services." They state "we exclusively utilize in-place updates for all services". Worked example: FrontFaaS on 500K machines every three hours would need 500K extra machines under naive mirroring. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- They concede the trade: mirroring "is safer as the traffic can be quickly redirected back to the old job if the update fails". — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- **Immutable-artifact rule relaxed.** Section "Mutable artifacts": Conveyor "initially mandated one build action at the beginning of a pipeline, resulting in an immutable artifact", but feedback-directed optimization requires recompiling with production profiles, so it "has been extended to support mutable artifacts and allow multiple builds within one pipeline." — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Operational motive for one standard tool: with bespoke tools, "very few people know how to safely revert a specific service’s problematic release." — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Limits: describes reverts as a pipeline action; does not give revert latency.

#### Heroku

**Heroku Dev Center, "Releases" — vendor documentation (current version; the releases/rollback feature dates to c. 2010-2011, not verified here). [TE]** URL: <https://devcenter.heroku.com/articles/releases>

- A new release is created "Whenever you deploy code, change a config var, or modify your app's add-on resources". — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- What rollback does. Quote: "The `heroku rollback` command creates a new release." It "copies the compiled slug or OCI image and config vars" of the target release. — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- What it does not roll back: add-on provisioning, the Heroku-hosted Git repository, and "Any state stored in add-ons or externally". — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- Vendor's own caution. Quote: "Use the `heroku rollback` command only when absolutely necessary." A rolled-back release "serves as a temporary fix"; the docs prefer `git revert` and redeploy where possible. — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- **Retention limit.** Quote: "You can't roll apps back to an `expired` release." Artifacts are destroyed for releases "older than 30 days and older than the 20 most recent releases." — [Heroku Releases](https://devcenter.heroku.com/articles/releases)

#### Docker / registries / Kubernetes

**Kubernetes documentation, "Images" — project documentation. [TE; page truncated at 100k chars].** URL: <https://kubernetes.io/docs/concepts/containers/images/>

- Quote: "Tags can be moved to point to different images, but digests are fixed." Digests "are hashes of the image's content, and are immutable." — [Kubernetes: Images](https://kubernetes.io/docs/concepts/containers/images/)
- Quote: "You should avoid using the `:latest` tag when deploying containers in production as it is harder to track which version... and more difficult to roll back properly." (middle elided by me). — [Kubernetes: Images](https://kubernetes.io/docs/concepts/containers/images/)
- With a digest, "Kubernetes runs the same code every time it starts a container". With a mutable tag changed in the registry, "you might end up with a mix of Pods running the old and new code." — [Kubernetes: Images](https://kubernetes.io/docs/concepts/containers/images/)

**Docker docs, "Image digests" (Docker Hardened Images core concepts) — vendor documentation. [TE]** URL: <https://docs.docker.com/dhi/core-concepts/digests/>

- A digest is "a unique, cryptographic identifier (SHA-256 hash) representing the content of a Docker image"; "a digest is immutable and ensures that the exact same image is pulled every time." Tags "can be reused or changed". — [Docker: digests](https://docs.docker.com/dhi/core-concepts/digests/)
- Limits: says nothing about the downside of pinning (missing patches).

**Kubernetes documentation, "Deployments" — project documentation. [TE, second half of page].** URL: <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

- Quote: "By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want". — [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- Scope of what is rolled back. Quote: "when you roll back to an earlier revision, only the Deployment's Pod template part is rolled back." A revision is created only when `.spec.template` changes; scaling does not create one. — [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- Commands: `kubectl rollout undo deployment/<name>` and `--to-revision=N`; `kubectl rollout history`. — [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- Retention. Quote: "By default, 10 old ReplicaSets will be kept". Setting `revisionHistoryLimit` to 0 means "a new Deployment rollout cannot be undone". Quote: "once an old ReplicaSet is deleted, you lose the ability to rollback to that revision". — [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- Limits: the Deployment object retains a pod template (an image *reference*), not the image bytes. If the reference is a mutable tag or the registry has deleted the image, `rollout undo` does not restore the earlier bytes. (The first half is from the Images page above; the registry-deletion half is supported only by a search snippet, see section 8.)

**Argo Rollouts documentation, "Rollback Windows" — project documentation. [TE]** URL: <https://argo-rollouts.readthedocs.io/en/stable/features/rollback/>

- By default a rollback (re-applying an older manifest) is treated "the same as a spec change" and re-runs all steps and analysis. Rollback windows (since v1.4) let a promotion back to a recent ReplicaSet "skip all steps". Example: "A rollback from revision 5 back to 4 or 3 will fall within the window, so it will be fast tracked." — [Argo Rollouts: rollback windows](https://argo-rollouts.readthedocs.io/en/stable/features/rollback/)
- Use: shows that in progressive-delivery controllers a rollback is, by default, itself a gradual rollout; speed must be deliberately configured.

**Flagger documentation, "How it works" — project documentation. [TE]** URL: <https://docs.flagger.app/usage/how-it-works>

- If "the failed checks threshold is reached, stops the analysis and rolls back the canary." Flagger watches the target deployment "including secrets and configmaps" and copies them with a `-primary` suffix. — [Flagger docs](https://docs.flagger.app/usage/how-it-works)
- Limits: the tool could not find an explicit description of traffic routing during rollback on this page.

#### Slack

**Michael Deng & Jonathan Chang (Slack), "Deploys at Slack", 29 March 2020 (updated 2022) — primary. [TE, two extractions]** URL: <https://slack.engineering/deploys-at-slack/>

- Atomic deploys: "The hot directory would serve production traffic, while the cold directory was being prepared." Before this, "each deploy would cause a burst of errors." Servers "pull the build concurrently when signaled by a Consul key change." — [Deploys at Slack](https://slack.engineering/deploys-at-slack/)
- Rollback. Quote: "we immediately roll back to a previous working build before starting our investigation". Builds "can be rolled back if there is a spike in errors". — [Deploys at Slack](https://slack.engineering/deploys-at-slack/)
- Staging: dogfood, canary at "about 2% of production traffic", then "10, 25, 50, 75, and 100 percent increments". "about 12 scheduled deploys" per day. — [Deploys at Slack](https://slack.engineering/deploys-at-slack/)
- Limits: the tool found no description of what a "build" artifact is, where it is stored, a symlink, or a rollback duration. Do not describe Slack's mechanism as a symlink swap on this evidence.

#### Wealthfront

**David Fortunato (Wealthfront), "Deployment Infrastructure for Continuous Deployment", 2 May 2010 — primary. [FT]** URL: <https://eng.wealthfront.com/2010/05/02/deployment-infrastructure-for-continuous-deployment/>

- A release is identified by a source revision for which a "release package" is built (screenshot example: revision 25978 "building the release package"). — [Wealthfront 2010](https://eng.wealthfront.com/2010/05/02/deployment-infrastructure-for-continuous-deployment/)
- Automatic rollback on failed self-test. Quote: "the Deployment Manager will initiate a rollback to the last known good revision (which takes about five seconds to complete across a cluster of 10 machines)." — [Wealthfront 2010](https://eng.wealthfront.com/2010/05/02/deployment-infrastructure-for-continuous-deployment/)
- Test suite "about three minutes". — [Wealthfront 2010](https://eng.wealthfront.com/2010/05/02/deployment-infrastructure-for-continuous-deployment/)
- Limits: the post does **not** say how the five-second rollback works (retained package on host? symlink? restart of prior jar?). The "last known good revision" wording plus a pre-built "release package" suggests a retained package, but that is inference. Ten machines in 2010 is a small fleet. This is the earliest financial-services (SEC-registered adviser) example I found of a stated rollback time.

#### Monzo

**Will Sewell (Monzo), "How we deploy to production over 100 times a day", 15-16 May 2022 — primary. [TE]** URL: <https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day>

- "Deployments to staging and production are currently triggered with a single CLI command." "We run over 2000 services". The CLI "warns engineers if there are unapplied database migrations." — [Monzo, 100 deploys a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day)
- Rollbacks per deployment are shown as a chart; the text says the rate "has remained relatively constant." No figure is given in text. — [Monzo, 100 deploys a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day)

**Will Sewell & Joseph Pallamidessi (Monzo), "Argo Rollouts at scale: Bringing Automated Rollbacks to 2,100+ services at Monzo", November 2022 (URL date 2 Nov; tool reported 7 Nov) — primary. [TE]** URL: <https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale>

- Before: rollouts were "all or nothing"; engineers relied on alerts to notice a bad release. — [Monzo, Argo Rollouts](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale)
- After: a basic canary strategy that "quickly rolled out all pods, followed by an analysis of metrics", with automated rollback on thresholds reused from generic alerts (e.g. total RPC error rate above 20%, "Any panics / crashes", database error spikes). Analysis can take more than 5 minutes. — [Monzo, Argo Rollouts](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale)
- "More than 27,000 production deployments in 2021." — [Monzo, Argo Rollouts](https://monzo.com/blog/2022/11/02/argo-rollouts-at-scale)
- Limits: **neither Monzo post states what artifact a rollback restores, how long it takes, or a rollback proportion as a number.** "shipper" is not named in either post as extracted. That it is the previous ReplicaSet's container image is an inference from Argo Rollouts/Kubernetes mechanics, not a Monzo statement.

#### Uber

**Rasmus Vestergaard & Kasper Munck (Uber), "Continuous deployment for large monorepos", 26 August 2024 — primary. [TE]** URL: <https://www.uber.com/blog/continuous-deployment/>

- Each impacted service is built "into a deployable container image." About 50,000 production deployments per week by March 2024 (about 7,000 in early 2022). — [Uber CD](https://www.uber.com/blog/continuous-deployment/)
- "more than 50% of all incidents being caused directly by code changes." Incidents per 1,000 code changes fell by more than 50% over 12 months; authors disclaim causation. — [Uber CD](https://www.uber.com/blog/continuous-deployment/)
- **Limit of per-service rollback:** with a shared-library change, "automation would be able to quickly break a lot of services simultaneously", and it is "unlikely that the problem would be automatically detected for every service". Mitigation is tier-staggered rollout of cross-cutting commits. — [Uber CD](https://www.uber.com/blog/continuous-deployment/)
- Limits: no rollback mechanism, rate or timing given.

#### Shopify, GitHub, Etsy (revision-based rather than image-based)

**Shopify, shipit-engine README — project documentation by the implementer. [TE]** URL: <https://github.com/Shopify/shipit-engine/blob/main/README.md>

- `rollback.override` "contains an array of the shell commands required to rollback the application to a previous state." It "defaults to `disabled` unless Capistrano is detected." UI action: "Rollback to this deploy". `REVISION` is "the git SHA of the revision that must be deployed". — [shipit-engine README](https://github.com/Shopify/shipit-engine/blob/main/README.md)
- Reading: Shipit's rollback is a user-supplied script keyed to a git SHA; whether that restores a pre-built artifact depends entirely on the application's script. Limits: no Shopify-production specifics.

**Aman Gupta (GitHub), "Deploying branches to GitHub.com", 2 June 2015 — primary. [TE]** URL: <https://github.blog/engineering/infrastructure/deploying-branches-to-github-com/>

- "new code is always deployed from a pull request branch, and merged only once it has been confirmed in production." A bad branch deploy "is rolled back by deploying the latest `master` to production." Heaven is "our Capistrano-based deployment API". An example production deploy completed in "82s". — [GitHub 2015](https://github.blog/engineering/infrastructure/deploying-branches-to-github-com/)
- Reading: GitHub's 2015 rollback is "deploy master", a redeploy of a known-good *revision*, with master kept equal to what is proven in production. Limits: the post does not say whether a build artifact per SHA is cached.

**Erik Kastner (Etsy), "Quantum of Deployment", Code as Craft, 20 May 2010 — primary. [FT via Wayback copy; live URL returned 403].** URL: <https://www.etsy.com/codeascraft/quantum-of-deployment>

- Quote: "Deployinator currently uses svn to update the code, then rsync to move it between environments." Web push: build directories on a deploy host, rsync to a staging area on each web box, fan out "in chunks of 10 hosts". — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Timings: a production web push is "70-150 seconds"; overall the push went from "over an hour" with four people to "1 person and under 2 minutes." — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment)
- **The post body does not describe rollback at all.** A reader comment asks "how do you guys manage roll-backs in the deployinator?"; I did not find an author answer in the text I read. — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment)
- Answer to the brief's question: on this evidence Deployinator (2010) deployed a source checkout by rsync, not a versioned artifact; any rollback would be a redeploy of an earlier revision at the same 70-150 second cost. Etsy's stated alternative (config flags in code) is in the same post: "Your app configuration options can be in code – and changed quickly."

### Inferences

- Three distinct technical meanings of "rollback" appear and should not be blurred in the essay: (a) **traffic re-point to a still-running old version** (Netflix red/black, blue-green, Lambda alias, Salesforce Edge in section 7), which takes seconds to minutes and needs no deploy; (b) **re-deploy of a retained immutable artifact** (Amazon pipelines, CodeDeploy, Heroku, Kubernetes ReplicaSet, Facebook's retained binary), which takes one deployment cycle; (c) **re-deploy of an earlier source revision** (Etsy 2010, GitHub 2015, Shipit), which is as trustworthy as the build is repeatable.
- Tools record a rollback as a *new* release/revision/deployment pointing at old content (Heroku, CodeDeploy, Spinnaker all say so). For an audit trail this is a feature: history is append-only, as Twelve-Factor prescribes.
- The mutable-pointer/immutable-content pair recurs across generations: MPM label/package hash, Lambda alias/version, Capistrano `current` symlink/release directory, Docker tag/digest, Kubernetes Deployment/ReplicaSet. Fast rollback is always "move the pointer"; trust comes from the content being addressed by hash.

### Gaps

- Stripe: no engineering source found describing deploy rollback mechanics or timings (one search; results were generic).
- Starling: a QCon London 2017 deck and third-party write-ups mention immutable infrastructure and frequent releases, but I have only search snippets and found nothing on rollback. Not usable beyond "claims immutable infrastructure" [SN].
- Nubank, Dropbox: not researched (budget). LinkedIn: one slide deck only (section 7).
- Monzo: what artifact is restored, rollback duration, and the rollback proportion are not stated in text in either post. The rollback-rate chart exists but I could not read values from it.
- Facebook Tupperware/Twine rollback specifics and HHVM-era binary retention: not found beyond the Ars Technica report and Conveyor.
- Amazon Apollo: how prior versions are stored and re-installed is not described in the 2014 post.
- Spinnaker's own description of rollback to a previous *server group* (EC2 provider) was not fetched; only the Kubernetes-provider page was read.

---

## 3. What gives rollback its speed, and how sources relate flag-off to binary rollback

### Takeaway

Speed comes from not having to build or start anything: the old version is still running (blue-green/red-black), still on disk (hot/cold directories, Capistrano `releases` + `current` symlink, Facebook's retained binaries), or behind a pointer (LB weights, Lambda alias). Sources that discuss both mechanisms treat flag-off as the first-choice, fastest reversal of *behaviour* and binary rollback as the heavier fallback (Facebook 2017; McKinley 2017), while Google's SRE material treats flags as a separately-rated change channel and the Configerator paper shows flag/config changes need their own canary and revert path.

### Cited Findings

**Fast-pointer mechanisms:**

- Capistrano layout: "`releases` holds all deployments in a timestamped folder. These folders are the target of the `current` symlink." "`current` is a symlink pointing to the latest release." `revisions.log` "is used to log every deploy or rollback." (Project docs; [TE].) — [Capistrano: structure](https://capistranorb.com/documentation/getting-started/structure/)
- Twelve-Factor cites exactly this layout as its example of release management and says the `rollback` command "makes it easy to quickly roll back to a previous release." — [12factor V](https://12factor.net/build-release-run)
- Slack: hot/cold directories with an instantaneous switch (section 2). — [Deploys at Slack](https://slack.engineering/deploys-at-slack/)
- Netflix red/black: old ASG disabled but online (section 2). — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)
- Google SRE Workbook, ch. "Canarying Releases", section "Related Concepts" (primary; [TE]): blue/green "maintains two instances of a system"; rollback is "a trivial reversal of the router change." Downside stated: "twice as many resources". — [SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/)
- Same chapter: smaller releases make it "cheaper and easier to roll back any given release artifact." It also describes a team whose process "doesn't provide us the option to roll back to a previously known good configuration." — [SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/)

**Flag-off versus binary rollback:**

- Facebook, 2017 (primary; [TE]): with Gatekeeper, if a problem appears engineers can "simply switch the gatekeeper off rather than revert back to a previous version or fix forward." Gatekeeper lets them "roll out mobile and web code releases independently from new features". — [Rapid release at massive scale](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/)
- Facebook, 2012 (journalism; [FT]): binary reversion exists but is "a measure of last resort". — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- SRE Workbook (primary; [TE]), section "Separating Components That Change at Different Rates": feature flag and experiment frameworks "allow you to separate feature launches from binary releases." — [SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/)
- Dan McKinley, "You Can't Have a Rollback Button", 28 February 2017 (practitioner essay; McKinley is a former Etsy engineer, but **the essay itself does not mention Etsy**; [TE]): recommends pushing dark code behind a disabled flag ("It's relatively easy to visually inspect an if statement for correctness."), ramping gradually, keeping off-switches, and reverting small diffs as roll-forwards; "Complete deployment rollbacks are high-G maneuvers." — [McKinley 2017](https://mcfunley.com/you-cant-have-a-rollback-button)

**Config and flag state as a versioned, revertible thing:**

- Tang et al. (Facebook), "Holistic Configuration Management at Facebook", SOSP 2015 — primary, peer-reviewed. [FT, PDF]. URL: <https://research.facebook.com/publications/holistic-configuration-management-at-facebook/>
  - Configs are source: "the git repository serves as the ground truth for committed configs." A Gatekeeper project's logic "is stored as a JSON config in Configerator." — [Configerator, SOSP 2015](https://research.facebook.com/publications/holistic-configuration-management-at-facebook/)
  - Config changes pass validators, code review, sandbox tests and an automated canary before landing; canary tests take "about ten minutes"; baseline commit-to-production propagation latency is "about 14.5 seconds". — [Configerator, SOSP 2015](https://research.facebook.com/publications/holistic-configuration-management-at-facebook/)
  - Documented revert in an incident: an engineer overrode the canary tool's rejection, the config caused crashes, and "She mitigated the problem by immediately reverting the config change." Root cause was a latent code race exposed by a correct config. — [Configerator, SOSP 2015](https://research.facebook.com/publications/holistic-configuration-management-at-facebook/)
  - Over a three-month sample, "16% of the incidents were related to configuration management"; of those, 22% were "valid config changes exposing code bugs" (Type III). — [Configerator, SOSP 2015](https://research.facebook.com/publications/holistic-configuration-management-at-facebook/)
  - Limits: I found no passage using the words "rollback"/"roll back" in the PDF text; the paper establishes git-backed history and revert-as-new-commit, not a "restore snapshot" feature.
- Google SRE book ch. 8, "Configuration Management" (primary; [TE]): four schemes; with configuration packages, "we can use the build ID to reconstruct the configuration at a specific point in time." Reading config from mainline head "often leads to skew" between checked-in and running config. — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Heroku (vendor docs; [TE]): config vars are part of the release and are restored by rollback, which can itself break things: "Take care to reconcile any add-on-related config var values". — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- Kubernetes/Spinnaker/Flagger (project docs; [TE]): a Deployment rollback restores only the pod template; unversioned ConfigMaps/Secrets are not rolled back unless versioned (Spinnaker) or copied per-revision (Flagger). — [Spinnaker docs](https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/)

### Inferences

- When flag-off is enough: the fault is in a code path guarded by the flag and the bad path has not left durable state. When the binary must be rolled back: unflagged changes (dependency bumps, refactors, start-up/crash-loop faults, resource regressions) and anything broken before flag evaluation. This split is my synthesis; no single source states it as a rule. The closest primary statements are Facebook 2017 (flag-off preferred over revert) and Configerator's Type III incidents (a flag/config flip can itself be the trigger, so the flag system needs canary + revert of its own).
- Flags and image rollback are complements with different blast radii and different audit objects: a flag flip reverses one behaviour for a chosen population in seconds; an image rollback reverses everything in the release. A regulated firm needs versioned history for both, because "what was running at 14:02" is binary digest plus config/flag state (Twelve-Factor's release = build + config).

### Gaps

- LaunchDarkly and Unleash audit-history documentation: the LaunchDarkly URL I tried returned 404 and I did not retry; no vendor claim about flag audit logs is recorded here. Any such claim in the essay needs its own citation and a "vendor" label.
- No source found that measures flag-off latency against image-rollback latency in the same organization.
- Load-balancer weight changes as a rollback mechanism: covered only implicitly (Lambda weighted alias, Netflix ASG enable/disable); no dedicated source read.

---

## 4. Supply-chain and audit value for a regulated firm

### Takeaway

The audit argument is as old as the practice: Humble & Farley (2010) justify build-once partly "for auditing purposes", with hashes checked at each stage. Google's Binary Authorization for Borg and the SLSA framework formalize it as signed provenance plus deploy-time enforcement; the documented caveats are that enforcement has an emergency override, SLSA says nothing about code quality, and artifact retention is finite.

### Cited Findings

- Humble & Farley: hashes of binaries stored at creation and verified at every later stage; audit rationale quoted in section 1. — [Humble & Farley ch. 5](https://www.informit.com/articles/article.aspx?p=1621865&seqNum=3)
- Google SRE book ch. 8: MPM packages are "versioned with a unique hash, and signed to ensure authenticity". — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Amazon: packages "are immutable and use a checksum to verify their integrity." — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Netflix: "The same AMI is usable across multiple environments" (test then production). — [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- **Google, "Binary Authorization for Borg" whitepaper — primary (Google Cloud security documentation; the page as fetched says last updated September 2026; the whitepaper was first published around 2019-2020, original date not verified by me). [TE]** URL: <https://cloud.google.com/docs/security/binary-authorization-for-borg>
  - Standard: production code and configuration must be "properly reviewed, checked in, built verifiably, and authorized". — [BAB whitepaper](https://cloud.google.com/docs/security/binary-authorization-for-borg)
  - Provenance: "a signed certificate that describes the sources and dependencies that went into the build." The build system "runs in an isolated and locked-down environment". — [BAB whitepaper](https://cloud.google.com/docs/security/binary-authorization-for-borg)
  - Enforcement and audit: it "blocks non-compliant jobs from deploying" and "creates an audit trail of the code and configuration used in BAB-enabled jobs." — [BAB whitepaper](https://cloud.google.com/docs/security/binary-authorization-for-borg)
  - **Emergency path:** "enforcement mode can be overridden using an emergency response flag"; such procedures "are only meant to be used as a last resort" and notify the central security team and the service owner. — [BAB whitepaper](https://cloud.google.com/docs/security/binary-authorization-for-borg)
  - Limits: the tool reported the document does not discuss rollback specifically.
- **SLSA specification v1.0 (OpenSSF / Linux Foundation) — standard. [TE]** URLs: <https://slsa.dev/spec/v1.0/levels> ; <https://slsa.dev/spec/v1.0/about> . The fetched pages mark v1.0 as retired and v1.2 as current; I did not verify the v1.0 release date (commonly given as April 2023) or SLSA's Google origin from these pages.
  - Build L1: "Provenance exists describing how the artifact was built". L2: build runs "on dedicated infrastructure, not an individual’s workstation" with signed provenance. L3: signing material inaccessible to user-defined build steps; builds isolated from each other. — [SLSA v1.0 levels](https://slsa.dev/spec/v1.0/levels)
  - Stated non-goals: "SLSA does not tell you whether the developers writing the source code followed secure coding practices." An artifact's level is independent of its dependencies' levels. — [SLSA v1.0 about](https://slsa.dev/spec/v1.0/about)
- **Reproducible Builds project, "Definition" — project documentation, undated. [TE]** URL: <https://reproducible-builds.org/docs/definition/>
  - "A build is reproducible if given the same source code, build environment and build instructions, any party can recreate bit-by-bit identical copies of all specified artifacts." (two sentence fragments joined as returned by the tool; 24 words). Verified "by bit-by-bit comparison", usually via cryptographic hashes. — [Reproducible Builds definition](https://reproducible-builds.org/docs/definition/)
- Retention as a hard limit on rollback evidence: Heroku destroys artifacts for releases older than 30 days and beyond the 20 most recent; Kubernetes keeps 10 old ReplicaSets by default. — [Heroku Releases](https://devcenter.heroku.com/articles/releases); [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

### Inferences

- For a payments/core-banking change record, "same digest in test and production" is a mechanical, checkable control: the evidence that the soak-tested thing is the released thing is a hash comparison, not a sign-off. And the back-out plan can name a specific digest that has already run in production. (Mapping to regulator back-out-plan text: cross-reference the sibling researcher's notes; not researched here.)
- Hermetic/reproducible builds and artifact retention are substitutes at the margin: with truly reproducible builds an old artifact can be regenerated and verified by hash; without them, the retained artifact is the only trustworthy copy and retention policy becomes a control in its own right.
- BAB's emergency override shows that even the strictest implementer keeps a break-glass path; a regulated firm will need the same and must decide whether an emergency rollback to an already-attested digest needs break-glass at all (it should not, since the digest was previously authorized). This is inference.

### Gaps

- No primary source found from a bank or payments firm describing digest-equality between test and production as audit evidence.
- No source read on registry retention/immutability features (e.g., tag immutability settings) from registry vendors.
- Original publication date of the BAB whitepaper and SLSA's stated lineage from BAB were not verified in the pages fetched.

---

## 5. Rollback testing as a pipeline stage; how often rollbacks happen; how long they take

### Takeaway

Amazon is the one firm found that documents rollback as an explicit, automated test stage (deploy to about half the fleet, complete, then roll back, under continuous traffic); Google documents a cultural rule to roll back first and to perform a rollback "just because" if none has happened for a few weeks. Hard numbers are scarce: Meta reports 0.92% of finished regular-service deployments manually reverted or patched (an upper bound), Wealthfront reported about five seconds for a 10-machine cluster in 2010, and Salesforce Edge reports ten minutes globally after moving to blue-green.

### Cited Findings

**Sandeep Pokkunuri (AWS), "Ensuring rollback safety during deployments", Amazon Builders' Library, 5 December 2019 — primary. [TE]** URL: <https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/> (now redirects to builder.aws.com). Also held by sibling `amazon_netflix_linkedin_etsy.md`.

- Rollback-test procedure in a production-like environment under simulated traffic exercising all APIs, in three stages each long enough for APIs, workflows and batch jobs to run at least once: (1) "First, we deploy the change to about half of the fleet to ensure software version coexistence."; (2) complete the deployment; (3) roll back and confirm no errors. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Test-environment fidelity requirements: "multiple servers from different Availability Zones behind each service, just as it would be in production"; same deployment configuration as production (an all-at-once test deployment had hidden a problem); same deployment order across microservices. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Ordering asymmetry: readers before writers rolling forward; writers before readers rolling back. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Conclusion quote: "explicitly testing for rollback safety eliminates the need to rely on manual analysis." — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Liguori adds that the gamma stage "validates that the code is both functional and that it can be safely deployed to production", with one-box running new code beside the current fleet. — [Liguori](https://aws.amazon.com/builders-library/automating-safe-hands-off-deployments/)
- Limits: no data on how often the rollback test fails or how often production rollbacks occur.

**Adrian Hilton (Google CRE), "Reliable releases and rollbacks - CRE life lessons", Google Cloud Blog, 24 March 2017 — primary. [TE]** URL: <https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/>

- Quote: "our philosophy is that “rollbacks are normal.”" — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Quote: "the releasing team rolls back first and investigates the problem second." — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Rollback drill. Quote: "If you haven’t rolled back in a few weeks, you should do a rollback “just because”". The aim is to "find any traps with incompatible versions, broken automation/testing etc." — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Rollbacks must be "easy to perform; and trusted to be low-risk." — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Limits: no target or measured rollback time; no frequency data; does not discuss feature flags.

**Frequency:**

- Meta, Conveyor (OSDI 2023; [FT]): "only 0.92% of finished deployments are manually reverted or patched by developers" (regular services). Table 3 gives this "false negative" proxy as 0.92% regular, 3.14% large services, 0.012% ML models, 0.12% other pipelines. The authors say these "should be viewed as an upper bound" because developers also revert/patch for non-bug reasons. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Same paper: health-check false positives (deploy actions that reported anomalies but a human let proceed) are far higher: 11.5% regular, 41.3% large services. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Same paper: about 14% of to-be-deployed executables are invalidated before deployment by a "bad package detector" that tracks dependency bugs to 14 levels. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Facebook 2012 (journalism): whole-binary reversion happened "a few times" in Rossi's years there. — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- Monzo 2022: rollbacks per deployment "remained relatively constant" as deploy volume grew; number not stated. — [Monzo, 100 deploys a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day)

**Duration (measured or stated):**

- Wealthfront 2010: rollback "takes about five seconds to complete across a cluster of 10 machines". — [Wealthfront 2010](https://eng.wealthfront.com/2010/05/02/deployment-infrastructure-for-continuous-deployment/)
- Salesforce Edge (Sanjeev Chhabria et al., Salesforce Engineering blog, published 27 January, year inferred as 2026 from the page; primary; [TE]): "This change reduced global rollback from eight to twelve hours to ten minutes." Method of measurement not stated. — [Salesforce Edge](https://engineering.salesforce.com/inside-salesforce-edge-automating-global-rollback-for-1-5-trillion-requests-in-10-minutes/)
- Indirect bounds: Etsy 2010 web push 70-150 seconds (a revision redeploy would cost the same); GitHub 2015 example production deploy 82 s; Facebook 2012 push about 15 minutes for the distribution half; Netflix 2016 bake 7 minutes (the cost a rollback avoids by reusing an existing AMI). — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment); [GitHub 2015](https://github.blog/engineering/infrastructure/deploying-branches-to-github-com/); [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/); [How We Build Code at Netflix](https://netflixtechblog.com/how-we-build-code-at-netflix-c5d9bd727f15)
- Meta: a failed deployment of a complex service "may cause a partial outage in production, which can take hours to mitigate", one reason some teams prefer fixed morning schedules over continuous deployment. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)

### Inferences

- "Seconds or minutes" is supportable for traffic re-pointing and small fleets (Wealthfront, blue-green), but the only large-fleet figures found are ten minutes (Salesforce Edge, after re-architecture) and "hours to mitigate" for some Meta services. The essay should present seconds-to-minutes as what the architecture makes *possible*, with fleet size and connection draining as the stated determinants.
- An unexercised rollback path is an untested code path. Both documented remedies (Amazon's pipeline stage; Google's periodic "just because" rollback) treat rollback as something to be continuously proven, which fits a firm that already has a soak stage: the soak window can host the upgrade-coexist-downgrade test.
- Meta's 11.5%-41.3% false-positive rate is a warning for automated rollback in a payments context: aggressive automatic reversion will frequently fire on healthy releases unless health checks are tuned.

### Gaps

- No published rollback-rate figure found for Google, Amazon, Netflix, Monzo, Slack or Uber.
- No published measured rollback latency for Amazon, Google, Netflix or Monzo.
- No source found for any firm running scheduled "rollback drills" in production other than the Google CRE recommendation.
- Google SRE book/workbook passages specifically on testing rollbacks were not located beyond the CRE post.

---

## 6. What image rollback cannot undo, and the documented approaches

### Takeaway

Rolling back the binary does not roll back data, schemas, wire formats, caches, clients or external effects; Amazon states that protocol/format changes are the most common reason rollbacks fail. The documented remedy is to make every change both forward- and backward-compatible by splitting it (Amazon's two-phase prepare/activate; Fowler/Sadalage/Sato's expand-migrate-contract; Google's "feature-free release" and one-version-back assumption), which costs extra deployments and days of bake time.

### Cited Findings

**Amazon (Pokkunuri 2019; [TE]):**

- Protocol changes are described as the most common reason rollbacks fail. Compression example: "The old version doesn't know that it has to decompress data after reading from the disk." — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Subtler example: changing a heartbeat period from 5 to 10 seconds broke rollback because the old version closed connections after just over 5 seconds without a heartbeat. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Two-phase deployment (XML to JSON example). Prepare: "we prepare all the servers to read JSON (in addition to XML) but they continue to write XML." Activate: a later version starts writing JSON. A bake period, "usually a few days", separates the phases: "We wait to make sure that we don't have to roll back to an earlier version." Old-format reading is removed only after backfill. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Precaution: verify every server reached Prepare before Activate. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)
- Serialization practices: "We generally avoid developing custom serialization formats."; give each serializer an explicit version stored with the data; tolerate and preserve unknown attributes. — [Pokkunuri](https://aws.amazon.com/builders-library/ensuring-rollback-safety-during-deployments/)

**Google (Hilton 2017; [TE]):**

- Schema hazard: rolling back after a schema change "leaves you with a binary that doesn’t expect the new schema, and hasn’t been tested with it." — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Remedy: a "feature-free release" (v+1 understands the new schema without using it; v+2 adds features) so that "you can roll back to a previous version without having to also roll back the schema." — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- N-1 assumption: "One approach here is to make an ecosystem assumption that any service could be rolled back by one version". — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)

**Expand/contract:**

- Danilo Sato, "ParallelChange" (martinfowler.com bliki), 13 May 2014 — [TE]. URL: <https://martinfowler.com/bliki/ParallelChange.html>. It is "a pattern to implement backward-incompatible changes to an interface in a safe manner", in three phases: expand, migrate, contract. It "allows your code to be released in any of these three phases." Costs stated: during migration "the supplier has to support two different versions"; if contract is skipped "you might end up in a worse state than you started." — [Sato, ParallelChange](https://martinfowler.com/bliki/ParallelChange.html)
- Pramod Sadalage & Martin Fowler, "Evolutionary Database Design", original January 2003, rewritten May 2016 — [TE]. URL: <https://martinfowler.com/articles/evodb.html>. Transition phase: "a period of time when the database supports both the old access pattern and the new ones simultaneously." Migration scripts ship in the build artifact. **On reverse (down) migrations:** "We haven't found this to be cost effective and beneficial enough to try all the time." — [Sadalage & Fowler, evodb](https://martinfowler.com/articles/evodb.html)
- Fowler 2010: separate schema change from application upgrade (section 1). — [Fowler, BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- Meta, Conveyor (2023; [FT]): for database migrations, "A common strategy is to perform double writes", reading from the old database while a background job migrates; this "simplifies the rollback process as it only requires deleting the new database and redeploying the old code." — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Stripe online migrations: cross-reference sibling notes only.

**State outside the binary:**

- McKinley 2017 ([TE]): "web applications are not self-contained, and therefore they do not have versions." And: "You can roll back the SHA the webservers are running, but you can't roll back what they've inflicted on everything else." His worked example is a corrupted cache value that still breaks the app after code rollback. Also: "There's no guarantee that the path from v1 to v2 and then back to v1 isn't actively destructive." — [McKinley 2017](https://mcfunley.com/you-cant-have-a-rollback-button)
- Fowler 2010: transactions processed by the new environment are "missed" by the old one on switch-back. — [Fowler, BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- Heroku: rollback does not affect "Any state stored in add-ons or externally"; "It's your responsibility to reconcile these resources after rolling back." — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- Morris 2013: "If servers are disposable, the data that lives on them often is not." — [Morris, ImmutableServer](https://martinfowler.com/bliki/ImmutableServer.html)
- Long-lived connections: at Salesforce Edge, after a traffic flip "existing connections stayed with their original pods until natural termination", requiring a forced TCP drain job. — [Salesforce Edge](https://engineering.salesforce.com/inside-salesforce-edge-automating-global-rollback-for-1-5-trillion-requests-in-10-minutes/)

**A documented case where rollback to the previous deployment did not work:**

- Sophie Houser (Val Town), "Post-mortem: A Backward Incompatible Database Migration", 2 April 2025 — primary incident report from a small company. [TE]. URL: <https://blog.val.town/post-mortem-db-migration>
  - Migration and application code were merged together; migrations ran but the application deploy stalled. Quote: "The new database migrations were incompatible with the old application code and crashed the process." — [Val Town post-mortem](https://blog.val.town/post-mortem-db-migration)
  - The attempted rollback to an earlier deployment was rejected by the platform because the earlier migration had already succeeded. About 12 minutes of downtime for HTTP vals. Remediation: "We've added a test to ensure database migrations are backward compatible." — [Val Town post-mortem](https://blog.val.town/post-mortem-db-migration)
  - Limits: small firm, short outage; illustrates the mechanism rather than scale. RBS 2012 and Knight Capital are covered by the sibling researcher.

### Inferences

- The durable rule that follows from Amazon, Google and Fowler/Sadalage: an image rollback is safe only one compatible step back, and only if the organisation has paid for that compatibility in advance by splitting changes. "Byte-for-byte what ran before" guarantees the code is the same; it does not guarantee the world it runs in is the same.
- For payments specifically, external side effects (a payment instruction sent, a ledger entry posted, a message delivered to a scheme) are outside every mechanism documented here; none of the sources addresses compensating transactions. This is a gap in the evidence, not a finding.
- Expand/contract trades one risky deployment for three or more low-risk ones plus bake time ("usually a few days" at Amazon). For a twice-weekly train this is an argument that the pattern needs more frequent, smaller deployments to be practical.

### Gaps

- No primary source read on message-queue contents, in-flight workflow state, or mobile/desktop client versions already shipped (beyond Facebook's remark that mobile releases are decoupled from features by flags).
- No primary incident report read from a large firm where the *previous artifact itself* failed on restore due to data written by the new version, other than Amazon's generalized examples.
- Nothing found on reversal of external financial side effects.

---

## 7. The "before" state: rollback under release trains, enterprise change management, and deploy-from-source shops

### Takeaway

First-person evidence that rollback was impractical before these techniques exists for LinkedIn ("Must fix forward: too complex to rollback", 2014 slide) and Salesforce Edge (eight to twelve hours for a global rollback before blue-green). I found no first-person account from a bank or mainframe shop of back-out by restore-from-backup; that part of the contrast is unevidenced in these notes. Early continuous-deployment shops that pushed source checkouts (Etsy 2010, GitHub 2015, Facebook pre-HipHop) relied on fast redeploys, feature flags and fix-forward rather than artifact rollback.

### Cited Findings

- **Jason Toy (LinkedIn), "The Evolution of Continuous Delivery at Scale @ LinkedIn", QCon San Francisco, November 2014 — primary slide deck (slides only; I did not watch the talk). [TE of SlideShare page].** URL: <https://www.slideshare.net/InfoQ/the-evolution-of-continuous-delivery-at-scale-linkedin>
  - Slide 10, "Problem: Deployment Hell": "Must fix forward: too complex to rollback". — [LinkedIn QCon 2014 slides](https://www.slideshare.net/InfoQ/the-evolution-of-continuous-delivery-at-scale-linkedin)
  - Slide 17, "Deployment Process" (after): "Canary Deployment (New!)", "Problem? Revert step. (New!)", "All the deployment / rollback information is in plans". — [LinkedIn QCon 2014 slides](https://www.slideshare.net/InfoQ/the-evolution-of-continuous-delivery-at-scale-linkedin)
  - Limits: slide bullets without the spoken context; no dates for the "before" period on these slides; no timings.
- **Salesforce Edge (primary; [TE])**: before blue-green, each pod took minutes to start, creation was staggered, and "Reverting a single region could take nearly an hour", giving eight to twelve hours globally. After: "The prior version already operates at full scale as a warm standby" and rollback is "a controlled traffic redirection rather than a redeployment." — [Salesforce Edge](https://engineering.salesforce.com/inside-salesforce-edge-automating-global-rollback-for-1-5-trillion-requests-in-10-minutes/)
  - Note: this "before" is a modern Kubernetes rolling deployment, not a legacy release train. It shows that containers and immutable images alone do not make rollback fast; the old version has to be kept warm.
- **Etsy before Deployinator (primary; [FT])**: a web push took "3 developers, 1 operations engineer, everyone else on standby and over an hour (when things went smoothly)". The earlier "Staging" environment meant "the first time your code would interact with actual production hardware was when you deployed." — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment)
- **Deploy-from-source shops**: Etsy 2010 used svn update plus rsync (section 2). GitHub 2015 rolled back by deploying master. Facebook by 2012 had moved to a compiled 1.5 GB binary with prior versions retained on servers. — [Quantum of Deployment](https://www.etsy.com/codeascraft/quantum-of-deployment); [GitHub 2015](https://github.blog/engineering/infrastructure/deploying-branches-to-github-com/); [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- **In-place file deployment rollback is leaky by construction** (vendor docs): CodeDeploy does not revert actions taken by deployment scripts and can leave or lose files across a failed deployment and its rollback. — [CodeDeploy docs](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
- **Chad Fowler 2013** describes the mutable-server condition that defeats trustworthy rollback: "Application code is deployed outside of the normal straight-from-source-control process." — [Chad Fowler 2013](https://web.archive.org/web/2017/http://chadfowler.com/2013/06/23/immutable-deployments.html)
- **Meta before a standard tool**: bespoke per-service deployment tools meant "very few people know how to safely revert a specific service’s problematic release." — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- **Facebook's pre-2017 train**: weekly pushes "sometimes reaching 10,000 diffs" and 500 to 700 cherry-picks per day under the old model (tool-extracted figures). — [Rapid release at massive scale](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/)

### Inferences

- The contrast the essay can safely draw: under a train, a release bundles many changes, so reverting it reverts everything and re-applying it means another train; teams therefore fix forward by hotfix/cherry-pick (Facebook's 500-700 daily cherry-picks; LinkedIn's "must fix forward"). With small immutable releases and a retained previous artifact, reverting costs one change.
- Deploy-from-source shops got away without artifact rollback because (a) deploys were one to two minutes, (b) interpreted languages made "build" trivial, and (c) flags carried most of the risk. That bargain does not transfer to compiled, multi-dependency banking systems with long builds, which is where build-once artifacts matter most. This is inference from the Etsy/GitHub/Facebook evidence.

### Gaps

- **No first-person bank, mainframe or enterprise-ITIL account of back-out duration or restore-from-backup rollback was found** (one extended search returned only vendor backup documentation). The essay must not assert "hours-long mainframe back-outs" from these notes; either source it from the sibling researcher's regulator/incident material or frame it as the reader's own experience.
- Flickr (Allspaw & Hammond, Velocity 2009): slides exist (paulhammond.org PDF) but I did not read them; no claim about Flickr's rollback practice is supported here.
- Early Facebook PHP (pre-HipHop) source-push rollback practice: not sourced.
- Humble & Farley's own description of traditional back-out plans (ch. 10): not read.

---

## 8. Counterpoints: roll-forward, cost of warm versions, false confidence, and when rebuilding is unavoidable

### Takeaway

Serious implementers dissent from "image rollback makes change safe": Meta refuses to keep old versions warm on cost grounds and has abandoned strict artifact immutability; Facebook's release head treated binary reversion as a last resort; McKinley argues a rollback button is an illusion that encourages risk; Heroku's own docs call rollback a temporary fix. Retention windows, mutable tags, unversioned config and shared base images are documented ways an "old known-good" artifact stops being available or stops being the same.

### Cited Findings

**Roll-forward / rollback scepticism:**

- Rossi as reported by Ars Technica (journalism): "Reverting is for losers!"; reversion compared to pulling a train's emergency stop. — [Ars Technica 2012](https://arstechnica.com/information-technology/2012/04/exclusive-a-behind-the-scenes-look-at-facebook-release-engineering/)
- McKinley 2017 ([TE]): a visible rollback button encourages riskier changes; "Panic buttons are for when you're panicking."; remediation "has to occur in the direction of the future." — [McKinley 2017](https://mcfunley.com/you-cant-have-a-rollback-button)
- Heroku docs (vendor): "Use the `heroku rollback` command only when absolutely necessary." — [Heroku Releases](https://devcenter.heroku.com/articles/releases)
- Sadalage & Fowler: automated reverse migrations not found "cost effective and beneficial enough to try all the time." — [Sadalage & Fowler, evodb](https://martinfowler.com/articles/evodb.html)
- Opposing view (Google CRE): roll back first, investigate second; the pressure of an outage ("for every minute it’s down another thousand users will see errors") is given as the reason not to attempt a forward fix. — [CRE post](https://cloud.google.com/blog/products/gcp/reliable-releases-and-rollbacks-cre-life-lessons/)
- Slack sides with rollback-first: "we immediately roll back to a previous working build before starting our investigation". — [Deploys at Slack](https://slack.engineering/deploys-at-slack/)

**Cost of keeping N previous versions warm:**

- Netflix: red/black "requires more instances to be in use during deployment". — [Asgard post](https://netflixtechblog.com/asgard-web-based-cloud-management-and-deployment-2c9fc4e4d3a1)
- Google SRE Workbook: blue/green uses "twice as many resources". — [SRE Workbook: Canarying Releases](https://sre.google/workbook/canarying-releases/)
- Meta: second deployment cost "is prohibitive for our hyperscale services"; in-place updates only. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Salesforce Edge: both colours must autoscale on the higher CPU of the two so either can take full load; cost not quantified. — [Salesforce Edge](https://engineering.salesforce.com/inside-salesforce-edge-automating-global-rollback-for-1-5-trillion-requests-in-10-minutes/)
- Netflix: a baseline ASG kept "black" may need capacity adjusted before it can take traffic back. — [Deploying the Netflix API](https://netflixtechblog.com/deploying-the-netflix-api-79b6176cc3f0)

**The old artifact is not always available or not always the same:**

- Retention expiry: Heroku (30 days and 20 releases); Kubernetes (10 ReplicaSets by default; 0 disables undo). — [Heroku Releases](https://devcenter.heroku.com/articles/releases); [Kubernetes: Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- Mutable tags: a tag "can be moved to point to different images"; `:latest` is "more difficult to roll back properly". — [Kubernetes: Images](https://kubernetes.io/docs/concepts/containers/images/)
- Unversioned config: "rolling back your manifest will likely not roll back your code or config changes." — [Spinnaker docs](https://spinnaker.io/docs/guides/user/kubernetes/automated-rollbacks/)
- Shared base image outside the artifact: Borg base-image upgrades "have occasionally been a significant source of trouble." — [Borg, Omega, and Kubernetes](https://queue.acm.org/detail.cfm?id=2898444)
- Managed runtime drift: Lambda function versions in Auto runtime-management mode get runtime updates automatically. — [Lambda versions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
- Artifact immutability relaxed for good reasons: Meta's FDO recompilation produces a new executable mid-pipeline. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Google rebuilds old releases by design for cherry-picks, relying on hermetic builds rather than only on the stored binary. — [SRE book ch. 8](https://sre.google/sre-book/release-engineering/)
- Netflix's base AMI is re-released "every week or two", so an application AMI baked earlier carries an older base. — [Aminator post](https://netflixtechblog.com/ami-creation-with-aminator-98d627ca37b0)

**Rollback and automation limits:**

- Automated rollback fires on false alarms: Meta's 11.5%-41.3% health-check false-positive proxy. — [Conveyor, OSDI 2023](https://www.usenix.org/conference/osdi23/presentation/grubic)
- Per-service rollback does not contain a bad shared-library change across thousands of services. — [Uber CD](https://www.uber.com/blog/continuous-deployment/)
- A rollback in a progressive-delivery controller is by default a full new rollout with analysis, i.e. slow unless a rollback window is configured. — [Argo Rollouts: rollback windows](https://argo-rollouts.readthedocs.io/en/stable/features/rollback/)
- Config/flag flips can be the incident trigger and bypass binary safety entirely (Configerator Type III incidents). — [Configerator, SOSP 2015](https://research.facebook.com/publications/holistic-configuration-management-at-facebook/)
- Platform refusing a rollback because a migration had already run (Val Town). — [Val Town post-mortem](https://blog.val.town/post-mortem-db-migration)

### Inferences

- Image rollback is necessary but not sufficient: it removes one class of risk (the restored code differs from what ran before) and leaves compatibility, state and config. Sources that are most enthusiastic about rollback (Amazon, Google) are the same ones that prescribe rollback testing and change-splitting; the enthusiasm is conditional on that investment.
- The honest framing for bank engineering managers: retained, digest-addressed artifacts make the *code* half of a back-out plan fast and verifiable; they convert "re-run an older build and hope" into "re-point to a hash that already ran". They also create new obligations: a retention window at least as long as the longest plausible rollback horizon, digest pinning rather than tags, versioned config and flags, and a periodically exercised rollback path.
- A security-driven case for rebuild is implied by the evidence (base AMIs re-released every week or two; Borg base-image coupling): an old image carries old base layers, so rolling back far enough re-introduces patched vulnerabilities, and a critical base-layer fix requires a rebuild whatever the artifact policy. I found no primary source stating this directly; it is inference.

### Gaps

- **No primary source found** for the specific counter-cases the brief asked about: expired certificates baked into old images, old images referencing removed dependencies/schemas, or a CVE forcing a rebuild instead of a rollback. One search returned only vendor/SEO blog snippets about registry garbage collection making old images unpullable ([SN], not verified, not cited).
- No quantified cost (currency or percentage) of keeping N previous versions warm, beyond "twice as many resources" and Meta's 500K-machine example.
- No documented case found of "false confidence" from image rollback causing an incident at a named large firm; McKinley's argument is reasoned, with a generic example.
- Rollback authority, regulator back-out-plan text, Knight Capital and RBS 2012: deliberately not covered (sibling researcher).
