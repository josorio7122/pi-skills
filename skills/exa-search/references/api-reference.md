# Exa API Reference

Complete options reference for all exa-search scripts. All scripts accept options as a JSON string second argument.

## Table of Contents

- [Search Options](#search-options)
- [Find Similar Options](#find-similar-options)
- [Contents Options](#contents-options)
- [Answer Options](#answer-options)
- [Research Options](#research-options)
- [Content Retrieval Options](#content-retrieval-options)

## Search Options

```bash
tsx scripts/search.ts <query> [options-json]
```

| Option               | Type        | Description                                                                  |
| -------------------- | ----------- | ---------------------------------------------------------------------------- |
| `numResults`         | number      | Number of results (default 10)                                               |
| `type`               | string      | `"auto"`, `"fast"`, `"deep"`, `"deep-reasoning"`, `"deep-max"`, `"instant"` |
| `text`               | bool/object | Include page text. Object: `{"maxCharacters":5000}`                          |
| `highlights`         | bool/object | Include highlights. Object: `{"query":"...", "numSentences":3}`              |
| `summary`            | bool/object | Include summary. Object: `{"query":"summarize pricing"}`                     |
| `includeDomains`     | string[]    | Only search these domains                                                    |
| `excludeDomains`     | string[]    | Exclude these domains                                                        |
| `category`           | string      | Filter by content category (see below)                                       |
| `startPublishedDate` | string      | ISO date — results published after this                                      |
| `endPublishedDate`   | string      | ISO date — results published before this                                     |
| `includeText`        | string[]    | Page must contain these strings (max 1, up to 5 words)                       |
| `excludeText`        | string[]    | Page must not contain these strings                                          |
| `useAutoprompt`      | bool        | Enhance query automatically                                                  |
| `subpages`           | number      | Number of subpages per result                                                |
| `subpageTarget`      | string      | Text to match subpages against                                               |
| `livecrawl`          | string      | `"never"`, `"fallback"`, `"auto"`, `"preferred"`, `"always"`                |
| `livecrawlTimeout`   | number      | Timeout in ms for live crawl (default: 10000)                                |
| `additionalQueries`  | string[]    | Alt queries for deep search (max 5)                                          |
| `outputSchema`       | object      | JSON Schema for deep search structured output                                |

### Search Types

| Type             | Speed   | Depth  | Use when                                                  |
| ---------------- | ------- | ------ | --------------------------------------------------------- |
| `auto`           | varies  | varies | Default — Exa picks the best strategy                     |
| `fast`           | fastest | low    | Quick lookups, known topics                                |
| `instant`        | instant | lowest | Simple factual queries (even less processing than `fast`)  |
| `deep`           | slow    | high   | Complex queries needing thorough results                   |
| `deep-reasoning` | slower  | higher | Queries requiring inference and reasoning                  |
| `deep-max`       | slowest | max    | Maximum depth — exhaustive research queries                |

### Categories

`news`, `research paper`, `company`, `pdf`, `tweet`, `personal site`, `financial report`, `people`

## Find Similar Options

```bash
tsx scripts/find-similar.ts <url> [options-json]
```

Same content retrieval options as search, plus:

| Option                | Type   | Description                         |
| --------------------- | ------ | ----------------------------------- |
| `excludeSourceDomain` | bool   | Exclude the source URL's domain     |
| `includeDomains`      | string[] | Only include these domains        |
| `excludeDomains`      | string[] | Exclude these domains             |

## Contents Options

```bash
tsx scripts/contents.ts <url-or-urls-json> [options-json]
```

First argument: a single URL string, or a JSON array of URLs.

| Option               | Type        | Description                                                 |
| -------------------- | ----------- | ----------------------------------------------------------- |
| `text`               | bool/object | Include page text. Object: `{"maxCharacters":5000}`         |
| `highlights`         | bool/object | Include highlights. Object: `{"query":"...", "numSentences":3}` |
| `summary`            | bool/object | Include summary. Object: `{"query":"summarize pricing"}`    |
| `livecrawl`          | string      | `"never"`, `"fallback"`, `"auto"`, `"preferred"`, `"always"` |
| `livecrawlTimeout`   | number      | Timeout in ms for live crawl                                |
| `maxAgeHours`        | number      | 0 = always fresh, -1 = cache only                           |
| `filterEmptyResults` | bool        | Remove results with no content                              |
| `subpages`           | number      | Number of subpages per result                               |
| `subpageTarget`      | string      | Text to match subpages against                              |

## Answer Options

```bash
tsx scripts/answer.ts <query> [options-json]
```

| Option         | Type   | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| `text`         | bool   | Include full text in citation results        |
| `model`        | string | `"exa"` (default)                            |
| `systemPrompt` | string | Guide the LLM behavior                       |
| `outputSchema` | object | JSON Schema for structured output            |
| `stream`       | bool   | Stream chunks to stdout                      |
| `userLocation` | string | Country code for location-aware answers      |

## Research Options

```bash
tsx scripts/research.ts <subcommand> <arg> [options-json]
```

### Subcommands

| Subcommand | Argument       | Description                                    |
| ---------- | -------------- | ---------------------------------------------- |
| `create`   | instructions   | Start a new research task (returns immediately) |
| `get`      | research-id    | Get current status/result                       |
| `poll`     | research-id    | Poll until finished (blocks)                    |
| `list`     | —              | List research tasks                             |
| `run`      | instructions   | Create + poll in one step (convenience)         |

### Create/Run Options

| Option         | Type   | Description                                                              |
| -------------- | ------ | ------------------------------------------------------------------------ |
| `model`        | string | `"exa-research-fast"`, `"exa-research"` (default), `"exa-research-pro"` |
| `outputSchema` | object | JSON Schema for structured output                                        |

### Research Models

| Model                | Speed   | Depth  | Cost  | Use when                              |
| -------------------- | ------- | ------ | ----- | ------------------------------------- |
| `exa-research-fast`  | fast    | basic  | low   | Quick summaries, simple questions     |
| `exa-research`       | medium  | good   | med   | Default — most research tasks         |
| `exa-research-pro`   | slow    | deep   | high  | Comprehensive analysis, complex topics |

### Poll/Get Options

| Option         | Type   | Description                         |
| -------------- | ------ | ----------------------------------- |
| `pollInterval` | number | Ms between polls (default: 2000)    |
| `timeoutMs`    | number | Max wait time (default: 300000)     |

### List Options

| Option  | Type   | Description               |
| ------- | ------ | ------------------------- |
| `limit` | number | Max results to return     |
