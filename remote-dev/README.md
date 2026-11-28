# Moving development off the laptop

When a developer opens an editor on a laptop, the checkout, compiler and debugger can all be running on a Linux server. The essay follows an engineer through that working day and asks what access the same server should give a coding agent.

## Reading

- [The essay](essay.md) follows the work from editing and testing through code review. It covers access to internal services and customer data, and what it takes to operate the servers.
- [The appendix](appendix.md) collects machine specifications, routes by which information can leave a workspace, and the evidence behind the recommendations.

## Sources and contributor notes

- The [development history notes](research/history_deep_dive.md) draw on debugging notes, support threads, personal posts and talks, with priority given to 2005–2015.
- The [source code and personal data notes](research/data_loss_deep_dive.md) document incidents, controls in use and questions about their limits.
- The original evidence ledgers cover [development servers](research/ledger_a_server.md), [access, data and agents](research/ledger_b_access_data_agents.md), and [failures, staffing and adoption](research/ledger_c_failures_staffing_transition.md). They record how each source was checked. The [scoping notes](research_notes/Remote%20development%20machines%20at%20scale/) include leads from the initial search.
- The [essay style guide](STYLE.md) gives the rules for using this evidence. To rebuild the [figures](figures/), run `node remote-dev/figures/build.mjs` from the repository root.
