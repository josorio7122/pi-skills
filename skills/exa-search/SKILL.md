---
name: exa-search
description: Semantic web search, content extraction, AI-powered answers, and deep research via the Exa API. Use when you need to search documentation, look up facts, find current information, extract page content from URLs, get AI answers with citations, find pages similar to a URL, research companies or people, find LinkedIn profiles, or run deep multi-step research. Also use when the user asks to "look something up," "search the web," "find docs for," "what does X's documentation say," "research this company," or needs any information that may be more current than your training data. Requires EXA_API_KEY environment variable.
---

# Exa Search

You run live web searches via the Exa API. All queries go to the network — results are current, not from training data. Pick the right script or you waste API credits.

## Prerequisites

```bash
node --version   # Must be 18+
echo $EXA_API_KEY # Must be set
```

Run `pnpm install` from this skill's parent directory if dependencies are not yet installed.

Get an API key at: https://dashboard.exa.ai/api-keys

---

## Choosing the Right Script

Pick wrong and you waste API credits.

| When...                                               | Use                                                         |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| You have a URL and want its content                   | `scripts/contents.ts`                                       |
| You have a URL and want related pages                 | `scripts/find-similar.ts`                                   |
| Direct factual question (single sourced answer)       | `scripts/answer.ts` — cited answer, not a list of links     |
| Browse/explore results; add `includeDomains` for docs | `scripts/search.ts` with `text: true`                       |
| Complex multi-source synthesis                        | `scripts/research.ts run` — slow + expensive; use sparingly |

---

## Rules

- **Always check `EXA_API_KEY` is set** before running any script
- **Prefer `answer.ts` for direct questions** — it returns a synthesized answer with citations, not just links
- **Prefer `search.ts` with `includeDomains`** for documentation lookups — scopes results to official sources
- **Use `contents.ts` only for known URLs** — don't use it to "search" (that's what `search.ts` is for)
- **Use `research.ts` sparingly** — it's slower and more expensive; only for genuinely complex multi-faceted topics
- **Respect category filter restrictions** — `company` and `people` categories don't support domain/date/text filters
- **Output is always JSON** — pipe through `jq` for filtering if needed

## Output Format

- `search.ts` / `find-similar.ts`: JSON array of results. Summarize top 3-5 with title + URL + snippet.
- `answer.ts`: answer text + citations. Present answer directly, cite sources inline.
- `contents.ts`: extracted text. Present key content, note page title and URL.
- `research.ts`: research report. Present findings with section headers and citations.
- When `stream: true` is set on `answer.ts`, output is NOT valid JSON — it is raw text chunks followed by a citations block. Do not pipe to `jq`.

---

## When Things Go Wrong

- **400 error with `company`/`people` category** — remove domain/date filters (these categories don't support them)
- **Empty results** — broaden the query, or try `answer.ts` instead
- **`research.ts` timeout** — use `create` + `poll` separately; the default timeout is 5 minutes
- **`EXA_API_KEY` not set** — export it: `export EXA_API_KEY=your-key`
- **Malformed JSON options** — verify the options string is valid JSON (keys must be quoted)
- **429 / rate limit** — reduce `numResults`, add a pause between calls, or check your Exa plan

---

## References

- For quick usage examples: [references/quick-examples.md](references/quick-examples.md)
- For full options, parameters, and cost details: [references/api-reference.md](references/api-reference.md)
