# Independent prepublication review 2

**Superseded scope.** This review covers the first version of `essay.md` (commit `5facf36`). The essay has since been rewritten with a different thesis and audience; nothing below certifies the rewrite.

Review date: 2026-11-10. Reviewed the actual working-tree documents and tooling before publication. This review did not push, change the essay, alter configuration, or install dependencies. The only authored file is this report.

## Decision

**PASS: no publication-blocking findings.** Historical claims, financial correctness boundaries, and the local/CI lint arrangement are acceptable. Two low-severity documentation improvements are optional below. This is an editorial and configuration review, not independent certification of company reliability or a complete dependency vulnerability assessment.

## Axes assessed

| Axis | Result | Basis |
| --- | --- | --- |
| Historical support and dates | PASS | `essay.md` distinguishes publication dates from practice dates, contemporary accounts from recollections, and direct borrowing from inferred similarities. Google → Facebook is not asserted as proven technical inheritance. The Airbnb original revision, Netflix acceptance-testing account, Dropbox desktop norm, and Uber examples match the evidence ledger. |
| Citation coverage | PASS | Factual historical paragraphs have adjacent source links. Interpretations and recommendations are distinguished from measured results. Uninspected recordings are identified as viewing leads; they do not silently support detailed spoken claims. |
| Audience and narrative | PASS | The opening explains flags, ramps, and canaries for unfamiliar readers. Netflix, Dropbox, Adyen, and Stripe connect the history to scheduled promotion and dependable client behavior. The conclusion makes an affirmative engineering argument with stated scope, while avoiding frequency-as-quality reasoning. |
| Financial correctness | PASS | `essay.md` §§8–10 distinguishes contract compatibility, retries, data comparison, exposure control, and recovery. It does not imply that a flag reverses completed payments or persistent effects, or that low error rates establish correct balances. Bank accounts and survey findings are not represented as controlled causal experiments. |
| Research maintainability | PASS with optional note | `reading-guide.md` and the research ledgers retain source locators, access limitations, dates, and unresolved questions. Relative reader-facing links resolve. An earlier draft review is clearly titled as a draft review, but an explicit archival notice would help. |
| Security and privacy | PASS, bounded | No private absolute filesystem paths or apparent credential material found in publishable files. Lockfile packages use public npm registry URLs with integrity values. `.gitignore` excludes dependencies, local environments, caches, and temporary folders. Workflow permissions are read-only and checkout does not persist credentials. |
| Same lint in hook and CI | PASS | `.pre-commit-config.yaml` invokes the package script with filenames disabled and always-run enabled. `.github/workflows/markdown-lint.yml` runs that same pre-commit configuration. `.markdownlint-cli2.jsonc` selects all Markdown documents and excludes dependencies. Both actual commands passed locally. |
| Dependency and action pinning | PASS | `package.json` pins the linter and overrides; `package-lock.json` records resolved versions and integrity. All three action references are full SHAs and independently resolve in their official GitHub repositories. CI pins pre-commit 4.7.0. |
| Runtime and local setup | PASS with verification limit | `.nvmrc` and CI select Node 24; the package permits Node 22+. README provides matching installation and hook commands. This review's executable checks ran under local Node 26.13.0 and pre-commit 4.7.0, so they do not independently establish execution under Node 24 or on GitHub Actions. |

## Checks actually run

- `npm run lint:markdown`: passed; markdownlint-cli2 0.24.0 / markdownlint 0.42.0; twelve Markdown files checked before this report was added.
- `pre-commit run --all-files --show-diff-on-failure`: passed using the actual configured hook.
- `git diff --check`: passed. Files were still untracked during this review, so the linter and direct file reads provide the substantive content checks.
- Parsed Markdown links: 182 total, including nineteen relative local paths; no missing local targets. This checks paths, not external HTTP availability or every heading anchor.
- Lockfile inspection: version 3; ninety package records including the root; every dependency record has integrity and a public npm registry resolution.
- Inspected the installed Git pre-commit hook and confirmed it dispatches through `.pre-commit-config.yaml`.
- Queried official GitHub repositories to verify checkout SHA `d23441a48e516b6c34aea4fa41551a30e30af803`, setup-node SHA `249970729cb0ef3589644e2896645e5dc5ba9c38`, and setup-python SHA `ece7cb06caefa5fff74198d8649806c4678c61a1` exist there.
- Searched publication files for absolute local paths, likely secret material, and unfinished-work markers. Matches concerned ordinary source discussion and review metadata, rather than exposed credentials or private host paths.

The final committing agent should rerun the shared hook after adding both final review reports and any accepted changes.

## Optional findings

### P3: Mark the older editorial review as historical

**Path:** `research/editorial-review.md`, opening paragraph.

It records requested changes to a preceding draft, several of which are now resolved. Its draft title prevents a material ambiguity, but a reader browsing the repository could still mistake recommendations for outstanding publication conditions. Optional fix: add a brief notice that it reviews an earlier draft and that the final prepublication reports supersede it. Preserve the record rather than rewriting its findings retroactively.

### P3: Link final reviews from the repository map

**Path:** `README.md`, Files section.

The map lists the independent claims audit but not the two final prepublication reviews, which did not yet both exist when it was written. Optional fix: link both reports after they are complete so the review trail is easy to find.

## Residual limits

External URLs can change or deny automated retrieval; the package preserves original URLs and inspected-source notes rather than claiming every source is permanently reachable. The review checks citation placement and consistency against the dossiers, with deeper primary-source checks performed during research; it does not independently reread every external source. CI has been inspected and its underlying hook run locally, but a hosted workflow run is still a post-push observation. No further broad rewrite is necessary before publication.
