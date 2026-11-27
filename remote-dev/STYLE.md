# Style guide for "Moving development off the laptop"

This essay follows the [style guide of the book in this repository](../STYLE.md) in register, the list of rejected sentence patterns, the opening, the relevance test, figures, sections and sentences, and the review process. The rules below replace or add to that guide for this essay only.

## Thesis and scope

The essay argues that an organization should do development on Linux servers that engineers reach by ssh, with the editor on the desktop, and should run AI coding agents on those servers with access to internal tools through a gateway, to public code and documentation through a narrow read path, and to data only through a broker. Every section serves that argument.

- The essay is about Linux. Windows remote desktops and Windows virtual desktops are out of scope.
- Machine sizes appear once, as a benchmark of what a developer has at a leading company. The essay does not argue how to size machines.
- Staffing is treated as the main cost. Each recommendation says what a small platform team, down to one engineer, can run.
- BeyondCorp is presented as the far end of a range of sound choices for access, with what it buys. The recommendation is a lighter point on that range.
- The essay is general and names no organization as its audience. Payments and finance examples are preferred where an example is needed, under the same rule as the book: a general engineering reader must keep reading.
- The essay does not cover PCI DSS.

## Evidence rules

These replace the evidence rules of the book's guide.

- Only publicly published material is evidence. Company posts, papers, talks, product documentation, regulators' texts and court filings are the strongest kind.
- Companies do not publish most details of their development machines, so public statements by individuals are accepted: forum comments, personal blogs, podcasts, and public bug reports that show a machine's details. Several independent people saying the same thing is good evidence, and the text says how many ("seven commenters who identify themselves as Google engineers"). A single voice is marked as one person's account.
- Recollections of the commissioner or the author are never evidence. They decide where to look. A fact that only a recollection supports stays out of the essay.
- Vendor case studies are marked as such in the sentence that uses them.
- A complaint in a court filing is an allegation and is written as one.
- Quote only text recorded in the [evidence ledgers](research/) as read in raw text. Everything else is paraphrased.
- The essay takes positions. Where the evidence is thin and the essay recommends anyway, the sentence says once, in ordinary words, that this is the author's judgment or inference. A bet is never written as an established fact, and an established fact is not hedged.
- Each claim keeps the scope of its source: one company's practice, a stated plan, a product's capability and a regulator's guidance are each described as what they are.
