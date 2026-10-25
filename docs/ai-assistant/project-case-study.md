# Portfolio assistant — implementation notes (not a published Lab accomplishment)

Status: local implementation; no live inference deployment or measured model benchmark.

The design uses approved public Markdown and published site records, a deterministic build-generated index, shared weighted BM25 retrieval and a text-only chat panel. Local extraction remains useful without an API. Professional experience, personal lab stories and learning plans remain separate factual contexts.

The server independently retrieves from a canonical deployment asset and never trusts visitor-supplied excerpts. Optional inference is bounded and disabled unless secrets, verification, a real rate guard and confirmed free-tier settings are supplied. The plan deliberately avoids vector storage, external browsing, autonomous account actions and persistent chat history.

A future public writeup should distinguish mocked tests from actual edge deployment, report real inference usage/latency only after measured, and describe limitations: lexical retrieval is not semantic understanding, prompts cannot guarantee grounding, rate limiting is not a global spend cap, and knowledge-only abstention is preferable to false claims. No screenshots, performance measurements or deployment outcomes have been fabricated.
