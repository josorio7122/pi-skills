# Exa API Reference

Complete options reference for all exa-search scripts. All scripts accept options as a JSON string second argument.

## Table of Contents

- [Search Options](#search-options)
- [Search Types](#search-types)
- [Categories](#categories)
- [Category Filter Restrictions](#category-filter-restrictions)
- [Find Similar Options](#find-similar-options)
- [Contents Options](#contents-options)
- [Answer Options](#answer-options)
- [Research Options](#research-options)

## Search Options

```bash
tsx scripts/search.ts <query> [options-json]
```

| Option               | Type        | Description                                                                           |
| -------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `numResults`         | number      | Number of results (default 10)                                                        |
| `type`               | string      | Search type (see [Search Types](#search-types))                                       |
| `category`           | string      | Content category filter (see [Categories](#categories))                               |
| `text`               | bool/object | Include page text. Object: `{"maxCharacters":5000}`                                   |
| `highlights`         | bool/object | Include highlights. Object: `{"query":"...", "numSentences":3}`                       |
| `summary`            | bool/object | Include summary. Object: `{"query":"summarize pricing"}`                              |
| `includeDomains`     | string[]    | Only search these domains. Supports path filtering and subdomain wildcards            |
| `excludeDomains`     | string[]    | Exclude these domains                                                                 |
| `startPublishedDate` | string      | ISO date — results published after this                                               |
| `endPublishedDate`   | string      | ISO date — results published before this                                              |
| `startCrawlDate`     | string      | ISO date — results crawled after this                                                 |
| `endCrawlDate`       | string      | ISO date — results crawled before this                                                |
| `includeText`        | string[]    | Page must contain these strings (**single-item arrays only**, up to 5 words per item) |
| `excludeText`        | string[]    | Page must not contain these strings (**single-item arrays only**)                     |
| `useAutoprompt`      | bool        | Enhance query automatically                                                           |
| `userLocation`       | string      | Two-letter ISO country code (e.g. `"US"`) — biases results geographically             |
| `systemPrompt`       | string      | Deep-search-only instructions guiding search process and synthesized result           |
| `subpages`           | number      | Number of subpages per result                                                         |
| `subpageTarget`      | string      | Text to match subpages against                                                        |
| `livecrawl`          | string      | `"never"`, `"fallback"`, `"auto"`, `"preferred"`, `"always"`                          |
| `livecrawlTimeout`   | number      | Timeout in ms for live crawl (default: 10000)                                         |
| `additionalQueries`  | string[]    | Alt queries for deep search (max 5)                                                   |
| `outputSchema`       | object      | JSON Schema for deep search structured output                                         |

## Search Types

| Type             | Speed   | Depth  | Use when                                            |
| ---------------- | ------- | ------ | --------------------------------------------------- |
| `auto`           | varies  | varies | Default — Exa picks the best strategy               |
| `neural`         | medium  | medium | Embeddings-based semantic search                    |
| `fast`           | fastest | low    | Quick lookups, known topics                         |
| `instant`        | instant | lowest | Simple factual queries, sub-200ms latency           |
| `deep`           | slow    | high   | Complex queries — smart query expansion + summaries |
| `deep-reasoning` | slower  | higher | Queries requiring inference and reasoning           |
| `deep-max`       | slowest | max    | Maximum depth — exhaustive research queries         |

## Categories

| Category           | Metadata returned                                       | Notes                                  |
| ------------------ | ------------------------------------------------------- | -------------------------------------- |
| `company`          | Headcount, location, funding, revenue, company homepage | Fine-tuned retrieval + entity matching |
| `people`           | LinkedIn profiles (public data)                         | 1B+ indexed profiles                   |
| `news`             | Press coverage, announcements                           | Supports date filters                  |
| `research paper`   | Academic papers                                         |                                        |
| `tweet`            | Social posts                                            |                                        |
| `pdf`              | PDF documents                                           |                                        |
| `personal site`    | Personal websites/blogs                                 |                                        |
| `financial report` | SEC filings, earnings reports                           |                                        |

## Category Filter Restrictions

**Critical** — using unsupported filters with certain categories causes **400 errors**.

### `company` category restrictions

These parameters are **NOT supported** and will error:

- `includeDomains` / `excludeDomains`
- `startPublishedDate` / `endPublishedDate`
- `startCrawlDate` / `endCrawlDate`
- `includeText` / `excludeText`

### `people` category restrictions

Same restrictions as `company`, plus:

- `includeDomains` only accepts LinkedIn domains

### Universal restrictions

- `includeText` and `excludeText` only support **single-item arrays**. Multi-item arrays cause 400 errors across all categories.

### Workaround for company deep dives

When you need domain or date filters for company research, **omit the category** and use `type: "auto"` or `type: "deep"` instead:

```bash
# ✅ Works — no category, so domain filters are allowed
tsx scripts/search.ts "Anthropic funding rounds 2024" '{"type":"deep","includeDomains":["techcrunch.com","crunchbase.com"],"text":true}'

# ❌ Fails — company category + includeDomains = 400 error
tsx scripts/search.ts "Anthropic" '{"category":"company","includeDomains":["techcrunch.com"]}'
```

## Find Similar Options

```bash
tsx scripts/find-similar.ts <url> [options-json]
```

Same content retrieval options as search, plus:

| Option                | Type     | Description                     |
| --------------------- | -------- | ------------------------------- |
| `excludeSourceDomain` | bool     | Exclude the source URL's domain |
| `includeDomains`      | string[] | Only include these domains      |
| `excludeDomains`      | string[] | Exclude these domains           |

## Contents Options

```bash
tsx scripts/contents.ts <url-or-urls-json> [options-json]
```

First argument: a single URL string, or a JSON array of URLs.

| Option               | Type        | Description                                                     |
| -------------------- | ----------- | --------------------------------------------------------------- |
| `text`               | bool/object | Include page text. Object: `{"maxCharacters":5000}`             |
| `highlights`         | bool/object | Include highlights. Object: `{"query":"...", "numSentences":3}` |
| `summary`            | bool/object | Include summary. Object: `{"query":"summarize pricing"}`        |
| `livecrawl`          | string      | `"never"`, `"fallback"`, `"auto"`, `"preferred"`, `"always"`    |
| `livecrawlTimeout`   | number      | Timeout in ms for live crawl                                    |
| `maxAgeHours`        | number      | 0 = always fresh, -1 = cache only                               |
| `filterEmptyResults` | bool        | Remove results with no content                                  |
| `subpages`           | number      | Number of subpages per result                                   |
| `subpageTarget`      | string      | Text to match subpages against                                  |

## Answer Options

```bash
tsx scripts/answer.ts <query> [options-json]
```

| Option         | Type   | Description                             |
| -------------- | ------ | --------------------------------------- |
| `text`         | bool   | Include full text in citation results   |
| `model`        | string | `"exa"` (default)                       |
| `systemPrompt` | string | Guide the LLM behavior                  |
| `outputSchema` | object | JSON Schema for structured output       |
| `stream`       | bool   | Stream chunks to stdout                 |
| `userLocation` | string | Country code for location-aware answers |

## Research Options

```bash
tsx scripts/research.ts <subcommand> <arg> [options-json]
```

### Subcommands

| Subcommand | Argument     | Description                                     |
| ---------- | ------------ | ----------------------------------------------- |
| `create`   | instructions | Start a new research task (returns immediately) |
| `get`      | research-id  | Get current status/result                       |
| `poll`     | research-id  | Poll until finished (blocks)                    |
| `list`     | —            | List research tasks                             |
| `run`      | instructions | Create + poll in one step (convenience)         |

### Create/Run Options

| Option         | Type   | Description                                                             |
| -------------- | ------ | ----------------------------------------------------------------------- |
| `model`        | string | `"exa-research-fast"`, `"exa-research"` (default), `"exa-research-pro"` |
| `outputSchema` | object | JSON Schema for structured output                                       |

### Research Models

| Model               | Speed  | Depth | Cost | Use when                               |
| ------------------- | ------ | ----- | ---- | -------------------------------------- |
| `exa-research-fast` | fast   | basic | low  | Quick summaries, simple questions      |
| `exa-research`      | medium | good  | med  | Default — most research tasks          |
| `exa-research-pro`  | slow   | deep  | high | Comprehensive analysis, complex topics |

### Poll/Get Options

| Option         | Type   | Description                      |
| -------------- | ------ | -------------------------------- |
| `pollInterval` | number | Ms between polls (default: 2000) |
| `timeoutMs`    | number | Max wait time (default: 300000)  |

### List Options

| Option  | Type   | Description           |
| ------- | ------ | --------------------- |
| `limit` | number | Max results to return |

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

Prices may change. Verify at https://exa.ai/pricing.

**Cost strategies:**

- **Default to ≤25 results** — 5x cheaper and sufficient for most queries
- **Need 50+ results?** Run multiple targeted searches with different query angles — better quality and cheaper than one large search
- **Prefer `answer.ts` over `search.ts`** for direct questions — one API call instead of search + read
- **Use `numResults`** to limit results to what you actually need
- **Avoid `research.ts`** unless the topic genuinely requires multi-step synthesis
