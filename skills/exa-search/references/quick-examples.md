# Exa Search — Quick Examples

All scripts output JSON to stdout. Pass options as a JSON string second argument.

## Answer a Question

The fastest path to a sourced answer. Prefer this for direct questions.

```bash
tsx scripts/answer.ts "What is the latest Next.js version?"
tsx scripts/answer.ts "Compare React and Vue" '{"text":true}'
tsx scripts/answer.ts "Best ORMs for Node.js" '{"systemPrompt":"Be concise. List only the top 3."}'
```

## Search the Web

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

## Company & People Search

Exa has dedicated `company` and `people` categories with enriched metadata (headcount, location, funding, revenue for companies; LinkedIn profiles for people).

```bash
# Find companies — returns rich metadata
tsx scripts/search.ts "AI infrastructure startups San Francisco" '{"category":"company","numResults":20}'

# Find people (LinkedIn profiles)
tsx scripts/search.ts "VP Engineering AI infrastructure" '{"category":"people","numResults":15}'

# Company news coverage
tsx scripts/search.ts "Anthropic AI safety" '{"category":"news","numResults":10,"startPublishedDate":"2025-01-01T00:00:00.000Z","text":true}'
```

**⚠️ Category filter restrictions** — the `company` and `people` categories have limited filter support. See [api-reference.md](api-reference.md#category-filter-restrictions) for details. Using unsupported filters causes 400 errors.

## Fetch a Known URL

When you already have the URL and need its content.

```bash
tsx scripts/contents.ts "https://nextjs.org/docs/app/building-your-application/routing" '{"text":true}'
```

If no options are provided, defaults to `{text: true}`.

```bash
# Multiple URLs at once
tsx scripts/contents.ts '["https://a.com","https://b.com"]' '{"text":true}'

# Force fresh content (bypass cache)
tsx scripts/contents.ts "https://example.com" '{"text":true,"livecrawl":"always"}'
```

## Find Similar Pages

Discover related content starting from a URL you already know is good.

```bash
tsx scripts/find-similar.ts "https://react.dev" '{"text":true,"excludeSourceDomain":true,"numResults":5}'
```

## Deep Research

For complex topics that need multi-source synthesis. Runs asynchronously — blocks until done.

```bash
# One-step: create + poll until complete
tsx scripts/research.ts run "Best practices for building a CLI tool in Node.js in 2025"

# Use pro model for maximum depth
tsx scripts/research.ts run "Comprehensive analysis of AI chip market 2025" '{"model":"exa-research-pro"}'
```
