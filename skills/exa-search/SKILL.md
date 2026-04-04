---
name: exa-search
description: Search the web, extract page content, get AI-powered answers with citations, find similar pages, and run deep multi-step research via the Exa API. Use when asked to "search the web", "look something up", "find docs for", "what does X's documentation say", "research this topic", "extract content from this URL", "find pages similar to", or when any information may be more current than training data.
---

Run live web searches via the Exa API. All queries go to the network — results are current, not from training data. Pick the right script to avoid wasting API credits.

> Resolve all script paths relative to the directory containing this SKILL.md.

## Prerequisites

Verify before running any script:

```bash
node --version    # Must be 18+
echo $EXA_API_KEY # Must be set
```

Get an API key at: https://dashboard.exa.ai/api-keys

## Choosing the Right Script

| When...                                               | Use                                                         |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| Have a URL and want its content                       | `scripts/contents.ts`                                       |
| Have a URL and want related pages                     | `scripts/find-similar.ts`                                   |
| Direct factual question (single sourced answer)       | `scripts/answer.ts` — cited answer, not a list of links     |
| Browse/explore results; add `includeDomains` for docs | `scripts/search.ts` with `text: true`                       |
| Complex multi-source synthesis                        | `scripts/research.ts run` — slow + expensive; use sparingly |

## Rules

- **Always check `EXA_API_KEY` is set** before running any script
- **Prefer `answer.ts` for direct questions** — returns a synthesized answer with citations, not just links
- **Prefer `search.ts` with `includeDomains`** for documentation lookups — scopes results to official sources
- **Use `contents.ts` only for known URLs** — do not use it to "search" (that's `search.ts`)
- **Use `research.ts` sparingly** — slower and more expensive; only for genuinely complex multi-faceted topics
- **Respect category filter restrictions** — `company` and `people` categories do not support domain/date/text filters
- **Output is always JSON** — pipe through `jq` for filtering if needed
- When `stream: true` is set on `answer.ts`, output is raw text chunks followed by a citations block — not valid JSON

## Output Format

All scripts write JSON to stdout. Pipe through `jq` for filtering.

`search.ts` / `find-similar.ts` — array of result objects:

```json
{
  "results": [
    {
      "title": "Example Page",
      "url": "https://example.com/article",
      "score": 0.87,
      "publishedDate": "2024-06-01T00:00:00.000Z",
      "text": "Full page text if requested...",
      "highlights": ["...relevant excerpt..."],
      "summary": "AI-generated summary if requested"
    }
  ]
}
```

`answer.ts` — synthesized answer with citations:

```json
{
  "answer": "Next.js 14.2 was released in April 2024...",
  "citations": [
    { "title": "Next.js 14.2", "url": "https://nextjs.org/blog/next-14-2" }
  ]
}
```

- `contents.ts`: extracted text object per URL. Present key content, note page title and URL.
- `research.ts`: research report object. Present findings with section headers and citations.

## Error Recovery

- **400 error with `company`/`people` category** — remove domain/date filters (these categories do not support them)
- **Empty results** — broaden the query, or try `answer.ts` instead
- **`research.ts` timeout** — use `create` + `poll` separately; the default timeout is 5 minutes
- **`EXA_API_KEY` not set** — export it: `export EXA_API_KEY=your-key`
- **Malformed JSON options** — verify the options string is valid JSON (keys must be quoted)
- **429 / rate limit** — reduce `numResults`, add a pause between calls, or check the Exa plan

## References

- For quick usage examples: [references/quick-examples.md](references/quick-examples.md)
- For full options, parameters, and cost details: [references/api-reference.md](references/api-reference.md)
