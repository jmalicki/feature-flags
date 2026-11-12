# Moving off the release train

A short book on why engineering teams should replace testing periods and scheduled releases with dark launches, feature flags, staged rollouts and fast rollback, and how to do it. It draws on published first-person accounts.

## Contents

1. [Chapter 1: The release train and its replacement](essay.md): what the release train costs, how the industry moved past it, the techniques and their limits, irreversible effects and outside parties, ownership and culture, failure modes, change control and audit, the evidence, and how to start.
2. [Chapter 2: Data and models](data-and-models.md): how the same model applies to tables, event streams, feature stores and machine-learning models, where state persists after a rollback.
3. [Appendices](appendices.md): A, regulation of software change; B, tool support for data changes.

## Repository

The material below is for contributors and reviewers. Readers of the book need only the contents above.

- [STYLE.md](STYLE.md): the style guide for the book, including the sentence patterns that have been rejected, with the rejected sentences quoted.
- [essay.md](essay.md), [data-and-models.md](data-and-models.md) and [appendices.md](appendices.md): the two chapters and the appendices. Earlier versions are in the Git history: a hedged history at commit `5facf36`, and a survey-style argument at commit `941fe30`.
- [reviews/essay-v4/](reviews/essay-v4/): seven reviews of the fourth version (a consulting partner, a line editor, a benchmark against published professional writing, an engineering director, a forensic read for generated prose, a distinguished engineer, and a persuasion specialist). The current essay was rewritten against them.
- [reviews/essay-v2/](reviews/essay-v2/): nine reviews of the second version from different vantage points (an engineering director, a head of technology risk, a principal engineer in payments, a prose editor, and others). Two of them, `exemplars.md` and `evidence.md`, were stopped early and may be incomplete.
- [figures/](figures/): SVG figures used by both chapters and [figures/build.mjs](figures/build.mjs), which generates them. Run `node figures/build.mjs` to rebuild, or add `--check` to confirm the committed SVGs are current.
- [reading-guide.md](reading-guide.md): selected papers, engineering accounts, talks, and viewing leads.
- [research/google.md](research/google.md): Google chronology and primary-source ledger.
- [research/facebook.md](research/facebook.md): Facebook, Gatekeeper, dark launches, and release culture.
- [research/unicorns.md](research/unicorns.md): the wider 2010s ecosystem, including Etsy, Airbnb, LinkedIn, Dropbox, and Uber.
- [research/parallel-traditions.md](research/parallel-traditions.md): earlier integration, experimentation, Flickr, IMVU, and public codification.
- [research/payments.md](research/payments.md): Stripe, Adyen, and Monzo.
- [research/quality-evidence.md](research/quality-evidence.md): State of DevOps (DORA research program) findings and established-bank practice.
- [research/claims-audit.md](research/claims-audit.md): dates, causal claims, terminology, and limits reviewed independently.
- [research/prepublication-review-1.md](research/prepublication-review-1.md) and [research/prepublication-review-2.md](research/prepublication-review-2.md): two independent reviews of the first version of the essay across historical, editorial, financial, privacy, and tooling concerns. They do not cover the rewrite.
- [research/research-state.md](research/research-state.md): scope, decisions, and leads for future work.
- [reports/Testing gates to ramping culture.md](reports/Testing%20gates%20to%20ramping%20culture.md): synthesis of the second research pass on the move from testing periods to controlled exposure in production, written for the essay rewrite. It records corrections to commonly repeated claims, the verification status of quotations, and gaps.
- [reports/Data and ML progressive delivery.md](reports/Data%20and%20ML%20progressive%20delivery.md): research on applying progressive delivery to data-centric changes: two versions of a database column or table side by side, and an upstream table change carried through derived tables and a feature store into two ML models served as an experiment. It gives a step-by-step recipe for each, tied to sources, and marks which steps are undocumented or vendor-only.
- [research_notes/Data and ML progressive delivery/](research_notes/Data%20and%20ML%20progressive%20delivery/): the nine note files behind that report and the second chapter (operational schema changes, analytical pipeline changes, streaming and events, feature stores and versions, ML model rollout, Delta Lake support, data contracts and ownership, European regulators on data and models, and end-to-end cases and failures).
- [research_notes/Testing gates to ramping culture/](research_notes/Testing%20gates%20to%20ramping%20culture/): the sixteen raw note files behind that report and the first chapter (Microsoft, Google and Facebook, Amazon/Netflix/LinkedIn/Etsy, QA role transitions, management arguments, empirical and regulated-industry evidence, audit and compliance, EU regulators on change management, Dutch regulators, payments and core-banking releases, experiments on financial clients, staging and soak, rollback authority, rollback technology, counter-evidence and failures, and chart data), and three verification files. Each source is tagged by how it was read; quotations tagged as tool extractions must be re-checked against the page before they are printed. The two `quote_verification` files and `verification_round_2026_11.md` record that re-check for the quotations the book uses.

Research dates: November 10 to 12, 2026. Markdown with SVG figures.

## Checks and local setup

Use Node.js 24 (see `.nvmrc`) and pre-commit 4.7.0 or newer. Install the locked linter dependencies and the Git hook:

```sh
npm ci --ignore-scripts
python3 -m pip install pre-commit==4.7.0
pre-commit install
```

Check every Markdown document with the same hook that runs in GitHub Actions:

```sh
pre-commit run --all-files --show-diff-on-failure
```

For direct linting or automatic style fixes:

```sh
npm run lint:markdown
npm run lint:markdown:fix
```

CI runs the pre-commit configuration itself, so its Markdown rules match local commits. The linter version is pinned in `package.json` and `package-lock.json`; dependency overrides select patched RE2JS and KaTeX releases until the upstream pins catch up. All standard Markdown rules are enabled, with line-length checks disabled for prose and source URLs, and duplicate-heading checks scoped to sibling sections. Lint checks document structure and formatting; source accuracy requires editorial review.
