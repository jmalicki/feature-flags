# Feature flags, continuous delivery, and the history of safer change

Start with [the essay](essay.md): approximately 4,700 words in eleven sections, with citations throughout. It is written for corporate engineers accustomed to twice-weekly releases and days of promotion through environments, particularly engineers responsible for financial clients' stability.

The argument is that small changes, independent activation, controlled exposure, meaningful validation, and prepared recovery became a mature engineering discipline. The history supplies the evidence; deployment counts alone are not treated as quality evidence.

## Files

- [essay.md](essay.md): the main long read.
- [reading-guide.md](reading-guide.md): selected papers, engineering accounts, talks, and viewing leads.
- [research/google.md](research/google.md): Google chronology and primary-source ledger.
- [research/facebook.md](research/facebook.md): Facebook, Gatekeeper, dark launches, and release culture.
- [research/unicorns.md](research/unicorns.md): the wider 2010s ecosystem, including Etsy, Airbnb, LinkedIn, Dropbox, and Uber.
- [research/parallel-traditions.md](research/parallel-traditions.md): earlier integration, experimentation, Flickr, IMVU, and public codification.
- [research/payments.md](research/payments.md): Stripe, Adyen, and Monzo.
- [research/quality-evidence.md](research/quality-evidence.md): DORA findings and established-bank practice.
- [research/claims-audit.md](research/claims-audit.md): dates, causal claims, terminology, and limits reviewed independently.
- [research/prepublication-review-1.md](research/prepublication-review-1.md) and [research/prepublication-review-2.md](research/prepublication-review-2.md): two independent reviews across historical, editorial, financial, privacy, and tooling concerns before publication.
- [research/research-state.md](research/research-state.md): scope, decisions, and leads for future work.
- [reports/Testing gates to ramping culture.md](reports/Testing%20gates%20to%20ramping%20culture.md): synthesis of the second research pass on the move from testing periods to controlled exposure in production, written for the essay rewrite. It records corrections to commonly repeated claims, the verification status of quotations, and gaps.
- [research_notes/Testing gates to ramping culture/](research_notes/Testing%20gates%20to%20ramping%20culture/): the fourteen raw note files behind that report (Microsoft, Google and Facebook, Amazon/Netflix/LinkedIn/Etsy, QA role transitions, management arguments, empirical and regulated-industry evidence, audit and compliance, payments and core-banking releases, experiments on financial clients, staging and soak, rollback authority, rollback technology, counter-evidence and failures, and chart data). Each source is tagged by how it was read; quotations tagged as tool extractions must be re-checked against the page before they are printed.

Research date: November 10, 2026. Markdown only, as requested. The main history ends in the late 2010s; later evidence is identified explicitly.

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
