# Style guide for "Moving off the release train"

The essay is a short book, *Moving off the release train*: [Chapter 1](essay.md), the general argument; [Chapter 2](data-and-models.md), its application to data and models; and [Appendices](appendices.md) holding reference material for both. These rules apply to all three. Read at least one chapter's introduction and two full sections before writing, to match the register. Each document carries the same navigation line naming all three, its structure section says how it relates to the others, and each ends with previous and next links. Reference material shared by both chapters goes in the appendices, not in a chapter.

## Register

- Meta or Uber engineering blog: formal, plain, technical, specific, confident. American spelling. No contractions outside quotations.
- It argues how software engineering should change, and explains the mechanics. It is not a sales pitch and not a literature review.
- Sources are inline Markdown links on the phrase they support, wherever they sit naturally in the sentence. No footnotes. Only where inline links would break the flow, such as a worked example where every step has several sources, or a figure whose content rests on sources the surrounding text does not cite, collect them in a collapsible "Sources" block (`<details>`) immediately after the passage, keyed to the steps or claims they support.
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
- Prose that narrates method and provenance instead of the subject, and lists of steps stuffed with a citation per clause and parenthetical tags such as "(judgment)". The commissioner called this "pure AI slop": "Each step in the list is documented by the organizations named with it, and running the steps in this order as one release is an inference assembled from those documented steps. Holds marked as judgment are the author's and come from no source." Write the example as a story of what happens, cite the few sources a reader would want, and say what is undocumented once, in an ordinary sentence.
- A catalog of cases written as paragraphs: one case after another, each a rule plus citations. The commissioner called two such sections "dry droning" and found the same content "waaay better" as a table. When a passage answers several parallel cases (objections, parties, kinds, modes, texts), state the one idea in prose and put the cases in a table with the sources in its cells. Use judgment: tables suit reference material and parallel cases that a reader scans; arguments, stories and sequences stay prose, because a table flattens them. The commissioner wants judgment here: "i don't want tables everywhere".
- Operational detail piled into prose: every hold, threshold, metric and edge case of a procedure spelled out in sentences or bold-numbered steps. The commissioner described the payments sections written this way as "overwrought" and "boring detail shoved down my throat". State what the procedure does and why, with one or two specifics that carry the point; put the full procedure in a figure, and leave the rest to the research notes.

## Opening

- The introduction is at most two short paragraphs: the situation and the claim, plus any definitions the reader needs immediately.
- No summary section. After the introduction, a short "Structure of the article" section lists the parts, linked, with one line on what each covers. It describes the structure; it does not restate the argument. This is the one permitted exception to the rule against signposting.

## Audience and scope

The essay is general: it argues how software engineering should change. Payments is its favorite running example and is preferred whenever an example is needed, but nothing may signal that the essay is written for payments or finance. Introduce a payments case as an example ("in payments, for instance"), never with "for a financial firm" or similar; no heading is named for an industry; general text says "user" or "customer" and "organization" or "company", keeping "client" for business clients in a specific example and "firm" for named financial firms or entities a regulation covers. The bar is not strict secrecy: the commissioner said "we don't have to be super stealth, but i just don't want it to be super glaring, to the point where general engineering people would check out." The test is whether a general engineering reader keeps reading; payments examples are welcome, but mechanics-level payments detail (rails, scheme rules, settlement deadlines, payments law) in a general section is kept to what the point needs, and fuller detail goes in a table cell, an appendix or the notes. Payments material gives evidence and brief answers so that a payments engineer cannot dismiss the argument; it is never a tutorial. Examples from other industries are valuable: never remove one to make room for payments.

The essay is not about regulation. Regulation appears in the body only to remove the objection that the rules forbid this model; what regulators and audit frameworks accept or require, and per-jurisdiction detail, belong in the regulation appendix. The essay does not cover PCI DSS.

## Relevance test

Every section, example, incident and regulatory citation in the body has to serve the thesis: that teams can deliver much faster while keeping safety by separating deployment from release and changing how they work. Material earns a place in the body only if it does one of the following.

- It answers an objection the reader will raise (for example, "the regulators will not allow this").
- It changes how the model has to be built (for example, independent approval, flag changes counting as changes, rollback provisions).
- It is evidence for or against the thesis that the argument relies on.
- It teaches a distinct lesson, or shows that a lesson holds in a different industry. Within one industry a lesson is illustrated once; a second example from the same industry that repeats the same fact is cut. An example from another industry stays, kept to one or two sentences and one specific fact. When two examples make the same point, merge them into one sentence and keep both organizations; cut repeated numbers, quotations and mechanics, not organizations. Never cut the only example from an industry. Where two candidate examples are otherwise equal, prefer the payments one.
- Each fact appears once in the essay. Do not restate the same evidence in the history, the body, Evidence and an appendix.

Accurate material that fails this test goes into an appendix or the research notes, not the body. Research findings are not added to the body merely because they are true and new. Per-jurisdiction regulatory detail and per-tool detail belong in appendices.

## Figures

- Use figures wherever a process, sequence, structure or comparison is easier to see than to read. Prefer a diagram over a paragraph of mechanics.
- Refer to every figure in the text, either explicitly or with a sentence that plainly describes what it shows.
- Place each figure immediately after the paragraph that contains its first reference. Never place it before that reference, and never in the middle of a paragraph. This follows the common rule in Chicago, APA and IEEE style: a figure goes as near as possible after its first mention.
- An overview figure for a whole section may follow the section's opening paragraph, before the detail.
- After any edit that moves, cuts or reorders text, check every figure: is it still immediately after its referring paragraph, does that paragraph still describe it, and does its section still discuss it?
- The figure's title, labels and alt text must agree with the text around it: the same terms, the same numbers, the same stages. A figure must never contradict the text or show something the text has changed or removed.
- A figure may carry sourced detail the text does not repeat, such as a timeline's extra events or a chart's extra data points, provided each item is sourced in the text, the figure or the research notes. Do not strip a figure down to only what the text says, and do not drop a good figure because the text around it was rewritten; restore it and update its labels instead.
- Figure titles are plain descriptive labels, under the same rules as headings. Sources for data in a figure are stated in the figure or in the adjacent text.
- Render each figure and look at it before committing: no overlapping or clipped text.

## Sections and sentences

- Build each section around one idea, stated in its first paragraph, and make every later paragraph serve it. A section that loses the reader is usually a catalog of cases or a retelling of what a figure or another section already shows.
- Where a figure already shows something, cut the text that repeats it; keep only what the figure cannot show, such as the reason, the setup and the conclusion.
- Split sentences over about 45 words. Do not weld a signpost or a second claim onto a sentence with ", and".
- Define a term before its first use, and use defined terms exactly as defined (a soak is in pre-production and a bake in production; never swap them).
- Headings describe what the section contains. Rename a heading when the content under it changes.
- Match each claim to the scope of its source: planned is not done, a bot's request is not a requirement, a consumer's right is not a business's, one company's practice is not "most companies'", and a settlement service is not a scheme.

## Review process

- After any rewrite, fact-check the changed text again. Rewrites for style have dropped qualifications and turned inferences into stated facts.
- Read the essay cold from two positions before calling it ready: a general engineering leader outside finance, and a skeptical payments engineer. The first tests whether the essay reads as general; the second tests whether a payments reader can still dismiss it.
- Check every internal anchor and render every changed figure before committing.

## Evidence rules

- Every factual statement about a named organization, regulator, document, number or date must come from the research report or notes and carry an inline link to the primary source given there.
- Quote only text listed as safe to print (read in raw text). Anything tool-extracted or snippet-only is paraphrased, or omitted if the notes say it must be re-checked.
- Where a step is the author's inference or proposal rather than documented practice, mark it in ordinary words, once: modal wording ("would", "should") or a short clause ("a control proposed here"). Do not repeat provenance refrains such as "in the published accounts" or "no published account describes" paragraph after paragraph, and do not drop the marking when removing hedges.
- Where the evidence is thin, say so once, where it is weighed, and move on.
