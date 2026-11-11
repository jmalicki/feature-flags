# Research state and continuation memory

Updated: 2026-11-10.

## Objective and audience

Produce a roughly ten-page long read showing how experiment/feature flags, dormant production code, gradual activation, and continuous delivery became established engineering practice. Audience: corporate developers used to twice-weekly releases and days of promotion through environments, serving financial clients with demanding stability requirements.

The user wants history as evidence for an engineering argument: this is a mature way to improve quality and delivery, rather than an improvised startup shortcut. Final format requested: Markdown only. No PDF is being authored.

## Completed work

- Parallel source research for Google, Facebook, wider internet companies, payments, and empirical quality findings.
- Lead research into older integration practice, Amazon/Microsoft experimentation, Flickr, IMVU, codification, and commercialization.
- Main essay, reading guide, company evidence ledgers, and independent claims audit.
- Private GitHub publication requested by user, with Markdown lint shared between CI and pre-commit. The user required two independent reviews across multiple axes before pushing; final reports are preserved in this directory.
- Linter dependencies and action references are pinned; GitHub Actions runs the pre-commit configuration itself. Local hook installation and deliberate-error rejection were verified.
- Prefer implementer accounts, original papers, original code revisions, and first-person practitioner testimony.

## Accepted framing

- Integration, deployment, and activation are distinct. CI does not necessarily imply automatic production deployment.
- The central innovation is an operating discipline, not the conditional statement itself.
- Documented Google/Facebook examples anchor the history; no examined evidence proves a single Google → Facebook → all-unicorns genealogy.
- Explicit borrowing is clearest Flickr → Etsy, with additional public references to Flickr at GitHub and Eric Ries.
- Keep the distinction between feature-cohort ramping, limited binary deployment, experimental treatment allocation, and hidden load exercise.
- Cultural expectations have stronger evidence than mere availability: Facebook SOSP2015, Google SRE2016, Dropbox desktop2017.
- Preserve load tests, automated checks, staging, stabilization and soak as complementary controls.
- Quality findings support compatibility between rapid delivery and stability. Do not attribute survey gaps or company incident trends to flags alone.
- Financial relevance: Stripe staged migration correctness, client compatibility, idempotency; Adyen deployment/activation separation; ING/Capital One testing and risk controls; Monzo as clearly dated later banking epilogue.

## Important source caveats

- Dates printed in source bodies take precedence over search crawl dates and URL paths.
- Google KDD2010 describes Web Search and dates its infrastructure March2007, not the invention of flags.
- Do not assert an exact first Google A/B-test date, Gatekeeper invention date, Stormcrow creation date, or Morpheus2013 origin from current evidence.
- Rossi's Google experience is a personnel link; his testimony credits pre-existing Facebook practices.
- Airbnb Trebuchet public code April2011 predates Mike Curtis's later arrival from Facebook; do not attribute flags to that recruitment.
- Migrated Fowler pages have later revisions; distinguish original publication date from current wording.
- Monzo2022 manual deployment command is not automatic per-merge deployment; later rollback automation is not evidence percentage traffic rollout was already complete.
- Video abstracts are not watched recordings. Inspection status appears in reading guide and dossiers.

## Productive future extensions

- Obtain and verify transcripts for Flickr Velocity2009, Facebook's2011 deployment talk and2014 release keynote, Slatkin2013, and McNutt2015.
- Deepen early Google history using archived original material rather than repeated secondary anecdotes.
- Add primary operational case studies from securities firms/exchanges if available, keeping payment/banking examples distinguished from capital-markets workloads.
- Investigate explicit personnel and technical transmission into individual2010s companies; absence of proof in this pass is not proof of independent invention.
- If tailoring to an actual firm's architecture, investigate its specific correctness contracts and release controls before proposing implementation changes. The current artifact is history and evidence, not a firm-specific migration design.

## Working files

`essay.md` is the reader-facing argument. `reading-guide.md` selects originals. The other research files preserve source evidence, locators and limits. Use those ledgers to resume without rereading the entire chat.
