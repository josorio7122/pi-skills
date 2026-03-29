---
name: exa-search
description: Semantic web search, content extraction, AI-powered answers, and deep research via the Exa API. Use when you need to search documentation, look up facts, find current information, extract page content from URLs, get AI answers with citations, find pages similar to a URL, research companies or people, find LinkedIn profiles, or run deep multi-step research. Also use when the user asks to "look something up," "search the web," "find docs for," "what does X's documentation say," "research this company," or needs any information that may be more current than your training data. Requires EXA_API_KEY environment variable.
compatibility: 'Requires Node.js 18+, tsx, and EXA_API_KEY environment variable set'
metadata:
  author: josorio7122
  version: '3.0'
---

# Exa Search

Semantic search, content extraction, AI answers with citations, and deep research — all via the [Exa API](https://exa.ai).

## Prerequisites

```bash
node --version   # Must be 18+
echo $EXA_API_KEY # Must be set
```

Dependencies are managed at the repository root. Run `pnpm install` from the repo root if needed.

Get an API key at: https://dashboard.exa.ai/api-keys

---

## Choosing the Right Script

This is the most important decision. Picking the wrong script wastes API credits and returns worse results.

| You need to...                               | Use                       |
| -------------------------------------------- | ------------------------- |
| Answer a factual question with sources       | `scripts/answer.ts`       |
| Find web pages about a topic                 | `scripts/search.ts`       |
| Read the contents of a known URL             | `scripts/contents.ts`     |
| Find pages similar to a URL you already have | `scripts/find-similar.ts` |
| Do multi-step research on a complex topic    | `scripts/research.ts`     |

### When to use which — decision tree

1. **Do you already have the URL?**
   - Yes, and you want its text → `contents.ts`
   - Yes, and you want related pages → `find-similar.ts`

2. **Is it a direct question with a short answer?**
   - Yes → `answer.ts` — returns a cited answer, not a list of links
   - "What is the latest version of Next.js?" → `answer.ts`
   - "How do I configure Drizzle ORM with Postgres?" → `answer.ts`

3. **Do you need to browse/explore multiple results?**
   - Yes → `search.ts` with `text: true`
   - Looking for documentation → `search.ts` with `includeDomains`
   - Exploring a topic → `search.ts` with `numResults: 5-10`

4. **Is it a complex, multi-faceted question requiring synthesis?**
   - Yes → `research.ts run` — runs asynchronously, synthesizes multiple sources
   - "Comprehensive analysis of AI chip market 2025" → `research.ts run`

---

## Quick Examples

All scripts output JSON to stdout. Pass options as a JSON string argument.

### Answer a Question

The fastest path to a sourced answer. Prefer this for direct questions.

```bash
tsx scripts/answer.ts "What is the latest Next.js version?"
tsx scripts/answer.ts "Compare React and Vue" '{"text":true}'
tsx scripts/answer.ts "Best ORMs for Node.js" '{"systemPrompt":"Be concise. List only the top 3."}'
```

### Search the Web

Semantic search — returns ranked results. Add `text: true` to include page content inline.

```bash
# Basic search
tsx scripts/search.ts "latest AI research"

# Search official docs (scope to specific domains)
tsx scripts/search.ts "drizzle ORM configuration" '{"includeDomains":["orm.drizzle.team"],"text":true,"numResults":3}'

# Deep search for thorough results
tsx scripts/search.ts "quantum computing breakthroughs" '{"type":"deep","numResults":10,"text":true}'

# Deep search with system prompt to guide results
tsx scripts/search.ts "AI safety research" '{"type":"deep","systemPrompt":"Prefer official sources. Avoid duplicate results.","text":true}'

# Filter by date and category
tsx scripts/search.ts "OpenAI" '{"category":"news","startPublishedDate":"2025-01-01T00:00:00.000Z","text":true}'
```

### Company & People Search

Exa has dedicated `company` and `people` categories with enriched metadata (headcount, location, funding, revenue for companies; LinkedIn profiles for people).

```bash
# Find companies — returns rich metadata
tsx scripts/search.ts "AI infrastructure startups San Francisco" '{"category":"company","numResults":20}'

# Find people (LinkedIn profiles)
tsx scripts/search.ts "VP Engineering AI infrastructure" '{"category":"people","numResults":15}'

# Company news coverage
tsx scripts/search.ts "Anthropic AI safety" '{"category":"news","numResults":10,"startPublishedDate":"2025-01-01T00:00:00.000Z","text":true}'
```

**⚠️ Category filter restrictions** — the `company` and `people` categories have limited filter support. See [references/api-reference.md](references/api-reference.md#category-filter-restrictions) for details. Using unsupported filters causes 400 errors.

### Fetch a Known URL

When you already have the URL and need its content.

```bash
tsx scripts/contents.ts "https://nextjs.org/docs/app/building-your-application/routing" '{"text":true}'

# Multiple URLs at once
tsx scripts/contents.ts '["https://a.com","https://b.com"]' '{"text":true}'

# Force fresh content (bypass cache)
tsx scripts/contents.ts "https://example.com" '{"text":true,"livecrawl":"always"}'
```

### Find Similar Pages

Discover related content starting from a URL you already know is good.

```bash
tsx scripts/find-similar.ts "https://react.dev" '{"text":true,"excludeSourceDomain":true,"numResults":5}'
```

### Deep Research

For complex topics that need multi-source synthesis. Runs asynchronously — blocks until done.

```bash
# One-step: create + poll until complete
tsx scripts/research.ts run "Best practices for building a CLI tool in Node.js in 2025"

# Use pro model for maximum depth
tsx scripts/research.ts run "Comprehensive analysis of AI chip market 2025" '{"model":"exa-research-pro"}'
```

---

## Common Patterns

### Documentation Lookup

When you need to check current docs for a framework or library — the most common use case.

```bash
# Option A: Direct answer (faster, good for specific questions)
tsx scripts/answer.ts "How do I configure drizzle ORM with PostgreSQL?"

# Option B: Search official docs (better for browsing/exploring)
tsx scripts/search.ts "drizzle ORM migrations" '{"includeDomains":["orm.drizzle.team"],"text":true,"numResults":3}'

# Option C: Fetch a specific docs page you already know
tsx scripts/contents.ts "https://orm.drizzle.team/docs/migrations" '{"text":true}'
```

### Verify Before You Assume

When your training data might be stale — API options, config formats, CLI flags — search before using a value.

```bash
tsx scripts/answer.ts "What are the valid values for fields.billingDetails.name in Stripe PaymentElement?"
```

### Company Research

Use query variation for better coverage — Exa returns different results for different phrasings.

```bash
# Discover companies in a space
tsx scripts/search.ts "AI developer tools startups" '{"category":"company","numResults":20}'

# Deep dive on a specific company (no category — use domain/date filters freely)
tsx scripts/search.ts "Anthropic funding rounds valuation 2024" '{"type":"deep","includeDomains":["techcrunch.com","crunchbase.com","bloomberg.com"],"numResults":10,"text":true}'

# Find LinkedIn profiles for people at a company
tsx scripts/search.ts "Anthropic engineering team" '{"category":"people","numResults":15}'
```

### Find Alternatives to a Tool

```bash
tsx scripts/find-similar.ts "https://tailwindcss.com" '{"text":true,"excludeSourceDomain":true,"numResults":5}'
```

---

## Cost Awareness

| Operation               | Price  | Notes                       |
| ----------------------- | ------ | --------------------------- |
| Search (1-25 results)   | $0.005 | Default — use this range    |
| Search (26-100 results) | $0.025 | 5x more expensive           |
| Answer                  | $0.005 | Per query                   |
| Contents                | $0.005 | Per page                    |
| Research (standard)     | Varies | 2-10x more than search      |
| Research (pro)          | Higher | Use only for complex topics |

**Cost strategies:**

- **Default to ≤25 results** — 5x cheaper and sufficient for most queries
- **Need 50+ results?** Run multiple targeted searches with different query angles — better quality and cheaper than one large search
- **Prefer `answer.ts` over `search.ts`** for direct questions — one API call instead of search + read
- **Use `numResults`** to limit results to what you actually need
- **Avoid `research.ts`** unless the topic genuinely requires multi-step synthesis

---

## Rules

- **Always check `EXA_API_KEY` is set** before running any script
- **Prefer `answer.ts` for direct questions** — it returns a synthesized answer with citations, not just links
- **Prefer `search.ts` with `includeDomains`** for documentation lookups — scopes results to official sources
- **Use `contents.ts` only for known URLs** — don't use it to "search" (that's what `search.ts` is for)
- **Use `research.ts` sparingly** — it's slower and more expensive; only for genuinely complex multi-faceted topics
- **Respect category filter restrictions** — `company` and `people` categories don't support domain/date/text filters
- **Output is always JSON** — pipe through `jq` for filtering if needed

---

## Reference

For complete options, all parameters, category restrictions, and advanced usage for each script, see [references/api-reference.md](references/api-reference.md).
