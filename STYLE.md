# Style guide for "Moving off the release train"

The essay is [essay.md](essay.md). Read at least its introduction and two full sections before writing, to match its register.

## Register

- Meta or Uber engineering blog: formal, plain, technical, specific, confident. American spelling. No contractions outside quotations.
- It argues how software engineering should change, and explains the mechanics. It is not a sales pitch and not a literature review.
- Sources are inline Markdown links on the phrase they support. No footnotes.
- Mention a tool only where it supports a step of the workflow, in a clause or a sentence. Never compare tools against each other in the body. Version numbers, limits, retention defaults and preview/GA status go in an appendix.

## Patterns the commissioner has rejected as "AI slop" (never use)

Each was flagged by the commissioner verbatim.

- Recap or verdict sentences about what was just said: "Those are real classes of fault, and a short canary misses most of them."
- Counted announcements: "Four things in the three days cannot be removed, only moved:", "There are at least three it cannot find", "Shadow runs have three limits."
- Balanced antitheses and slogans: "X, not Y", "X, only Y", "not X but Y", "X and not Y" used for rhetorical balance; "the same nothing".
- Short punchy sentences used for effect that state a generalization, moral or transition: "Most teams do not know the split.", "Neither works.", "The soak finds one class of fault well."
- Slogan titles and headings: "Measure the three days before defending them", "What three days cannot tell you", "Deploy every day, release when it is proven". Headings are plain noun-phrase labels ("Lead time", "Rollback authority", "Failure modes").
- Verdict-then-colon openers: "The remedy is mechanical: a flag cannot be created without an owner and an expiry date."
- Folksy phrasing: "A lot of…", "Twice a week, say,", "a great many", "worth a second look", "cries wolf", "it's long".
- Childish short sentences in sequence. Sentences should average about 20 words with natural variation, using ordinary subordinate clauses; do not weld independent clauses with ", and" as a habit either.
- Paragraphs that end on a moral, aphorism or restatement. End on the most specific fact.
- Signposting and self-reference ("as later sections describe", "more on that below", "this section shows").
- Bold lead-in paragraphs or bold labels used as pseudo-headings.
- Unsupported generalizations about what "most teams" or "most firms" do, or claims such as "common in financial services".
- Also avoid: em dashes, "it is worth noting", "importantly", "notably", "in other words", "that said", "crucially", "at its core", "serves as", "plays a role", rhetorical questions.

## Evidence rules

- Every factual statement about a named organization, regulator, document, number or date must come from the research report or notes and carry an inline link to the primary source given there.
- Quote only text listed as safe to print (read in raw text). Anything tool-extracted or snippet-only is paraphrased, or omitted if the notes say it must be re-checked.
- Where a step is the author's inference rather than documented practice, say so plainly in the sentence ("No published account describes…", "This step is an inference from…").
- Where the evidence is thin, say so once, where it is weighed, and move on.
