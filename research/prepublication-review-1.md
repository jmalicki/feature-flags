# Prepublication review 1

**Superseded scope.** This review covers the first version of `essay.md` (commit `5facf36`). The essay has since been rewritten with a different thesis and audience; nothing below certifies the rewrite.

Reviewed November 10, 2026, before publication. Scope: `essay.md`, `README.md`, `reading-guide.md`, every research dossier, `package.json`, lockfile, Markdown configuration, pre-commit configuration, GitHub workflow, ignore rules, and Node version declaration. This review made no changes outside this file.

## Decision

**PASS: no unresolved findings.** The manuscript is ready for publication after the second independent review and any findings it raises are resolved. Both low-severity improvements identified below were fixed and rechecked. This judgment is an editorial and configuration review; it does not assert that every linked recording was watched or every external URL will remain available.

## Results by axis

| Axis | Result | Reason |
| --- | --- | --- |
| Historical chronology and causality | PASS | Publication dates are separated from practice dates. The paper avoids a fabricated single inheritance chain and identifies explicit borrowing where documented. |
| Citation support; fact versus inference | PASS | Sampled primary sources support the central claims. Interpretation, participant reports, survey evidence, and uninspected recordings are distinguished. Conclusion citations were added and rechecked. |
| Empirical quality claims and financial relevance | PASS | Coexistence of throughput and stability is supported without claiming flags caused the survey gap. Payments correctness and retained banking controls make the financial argument concrete. |
| Argument and accessibility | PASS | Installation, activation, ramps, and canaries are explained. The paper presents an engineering argument while retaining the conditions that make it defensible. |
| Privacy and accidental disclosure | PASS | No credentials, private client names, local home-directory paths, or private service endpoints were found in publishable files. Audience descriptions are generic and relevant to the requested artifact. |
| CI and pre-commit reproducibility | PASS with stated execution boundary | The local hook and workflow invoke the same pinned Markdown tool configuration. Local lint and pre-commit passed. The hosted workflow has not been executed by this reviewer. |

## Findings

### R1-01 — Low, resolved: conclusion relies on earlier citations

**Location:** `essay.md`, section 11, paragraphs beginning “The first possibility,” “The second possibility,” and “The third possibility” (lines 157–161 at review time).

These paragraphs name Adyen, Dropbox, Google, Facebook, and Stripe as historical evidence without repeating links or explicit section references. The examples are supported earlier in the essay, so this is not an unsupported factual claim or publication blocker. The user's unusually strict citation requirement would be served better by compact cross-references to sections 4, 7, and 8, or a small selection of repeated source links.

**Recommendation:** Add section cross-references or reuse the existing citations. No new research is necessary.

**Resolution verified:** Direct source links now accompany all three paragraphs. The additions point to the same primary accounts checked in the body.

### R1-02 — Low, resolved: quotation word-count metadata is inaccurate

**Location:** `research/google.md`, G10, line beginning “Short exact quotation (11 words).”

The quotation contains thirteen whitespace-separated words. The quote remains below the stated twenty-five-word maximum, and the quoted wording matches the source. This is inaccurate bookkeeping rather than a substantive source error.

**Recommendation:** Change the count to thirteen or remove the count label.

**Resolution verified:** G10 now labels the quotation as thirteen words.

## Independent primary-source checks

The review reopened original sources rather than relying solely on the previous editorial notes:

- [DORA 2018 report](https://dora.dev/research/2018/dora-report/2018-dora-accelerate-state-of-devops-report.pdf), printed pp. 11–14: checked industry scope, elite/low response categories, and the table's median qualification. The essay now states median response categories correctly and avoids converting survey findings into audited availability or isolated flag causality.
- [Stripe's migration account](https://stripe.com/blog/online-migrations), introduction, migration stages, and conclusion: checked the scale, incremental migration, availability design, and correctness comparisons. The current essay correctly describes the design rather than inventing an independently measured outage result.
- [Adyen's January 2018 account](https://www.adyen.com/knowledge-hub/from-0-100-billion-scaling-infrastructure-and-workflow-at-adyen), sections 1–2: checked mainline work, stabilized release branches, integration tests, centralized activation, and canarying. These support the paper's release-train relevance.
- [Etsy's February 2011 account](https://www.etsy.com/codeascraft/how-does-etsy-manage-development-and-operations): checked the author/date and explicit Flickr connection. This supports a documented diffusion arrow rather than merely similar terminology.
- [Google's reliable-launch chapter](https://sre.google/sre-book/reliable-product-launches/), gradual rollout and flag-framework sections: checked the cultural-default claim alongside continued launch preparation.
- [Facebook's 2015 configuration paper](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf): checked the primary paper's scope, runtime configuration, feature rollout, and safety treatment.
- [Facebook's 2017 release account](https://engineering.fb.com/2017/08/31/web/rapid-release-at-massive-scale/): checked the year-long transition and April 2017 completion, distinguishing binary rollout from behavior selection.
- [Dropbox's April 2017 desktop account](https://dropbox.tech/application/accelerating-iteration-velocity-on-dropboxs-desktop-client-part-2): checked the eight-to-two-week cadence change, risky-change gating expectation, and retained quality controls.
- [USENIX's 2014 panel record](https://www.usenix.org/conference/srecon14/technical-sessions/presentation/releasing-scale): checked the named participants and event month. The essay uses the program as evidence of participation, without inventing unverified speech content.

The GitHub article was intermittently unavailable through direct browser retrieval during this review. Its dossier already discloses that limitation and the later page revision; no new unsupported assertion was added on that basis.

## Tooling and repository checks

The following checks passed against the working tree at review time:

- `npm run lint:markdown`: twelve Markdown documents checked; zero issues.
- `pre-commit run --all-files --show-diff-on-failure`: passed.
- `git diff --cached --check`: passed.
- Package/lockfile root name and development dependencies match. Lockfile version is 3; the installed lock records the declared Markdown linter and dependency overrides.
- The executable local pre-commit hook exists. The shared hook uses `language: system`, so the README's separate Node/npm installation step is necessary and correctly documented.
- Workflow permissions are read-only, checkout credential persistence is disabled, and action references use complete commit hashes. The pinned [checkout](https://github.com/actions/checkout/commit/d23441a48e516b6c34aea4fa41551a30e30af803), [setup-node](https://github.com/actions/setup-node/commit/249970729cb0ef3589644e2896645e5dc5ba9c38), and [setup-python](https://github.com/actions/setup-python/commit/ece7cb06caefa5fff74198d8649806c4678c61a1) commits all resolved in the official repositories.

**Execution boundary:** local commands ran with Node 26.13.0, npm 11.20.0, and pre-commit 4.7.0. CI selects Node 24 from `.nvmrc` and Python 3.13. Both Node versions satisfy the package's declared engine range, but this reviewer did not perform a fresh installation or execute the hosted workflow on Node 24. The configuration is internally consistent; the eventual hosted check remains the final platform-specific confirmation.

The privacy scan covered publishable files rather than `.git` internals or ignored dependencies. Public researcher names and source links were retained appropriately. No private organization, person, credential, or machine path requires redaction based on the inspected tree.

## Final recheck

After the two fixes, this reviewer reran Markdown lint over the expanded fourteen-document tree, including both prepublication reviews: zero issues. The lead researcher additionally reported a successful locked offline dependency installation, pre-commit check, and actionlint run; these additional commands were not independently rerun in this review. The two reviewed fixes create no new historical claims or workflow changes. No findings remain open from reviewer 1.
