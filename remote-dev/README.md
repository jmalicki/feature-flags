# Moving development off the laptop

An essay arguing that engineering organizations should develop on Linux servers reached by ssh, run their coding agents there, and decide at the server's network boundary what people and agents can reach. It draws on companies' published accounts and on public statements by their engineers.

## Contents

1. [The essay](essay.md): what the laptop costs and how attackers use it, how the industry moved, a working day on a Stripe devbox, the development server, access, what the server can reach, agents, what the design does against each attacker, failure modes, staffing and cost, the changes in three phases, and how to start.
2. [Appendix](appendix.md): machine sizes seen in public, channels out of a development server, the path from a Google laptop to production, and the strength of the evidence by claim.

## Repository

The material below is for contributors and reviewers.

- [STYLE.md](STYLE.md): the rules for this essay, which add to [the book's style guide](../STYLE.md). It sets the evidence rules: only published material counts, and several independent public voices are good evidence.
- [research/](research/): three evidence ledgers. Each fact in them was re-opened at its source on November 27, 2026 and is marked by how it was read. The essay quotes only text the ledgers record as read in raw form.
- [research_notes/Remote development machines at scale/](research_notes/Remote%20development%20machines%20at%20scale/): the 21 note files from the scoping research of November 26 and 27, 2026. Quotations in the notes that do not appear in a ledger have not been checked against their pages.
- [figures/](figures/): SVG figures and [figures/build.mjs](figures/build.mjs), which generates them. Run `node remote-dev/figures/build.mjs` from the repository root to rebuild.
