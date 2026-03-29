# Skill Review Round 4 — Full 15-Skill Deep Review

## Summary Statistics

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 22 |
| MEDIUM | 52 |
| LOW | 48 |
| INFO | 22 |
| **Total** | **144** |

All 15 skills received **NEEDS_WORK** verdict — no PASS, no FAIL.

## HIGH Issues by Skill

### agents-md (2 HIGH)
1. **PE** — No authority markers on critical constraints (line cap, confirmation before write)
2. **SW** — Non-standard frontmatter (`metadata` block)

### docker-model-runner (2 HIGH)
1. **SW** — SKILL.md duplicates reference content; progressive disclosure violated
2. **SW** — Reference has no conditional load gate

### exa-search (1 HIGH)
1. **SW** — `systemPrompt` silently dropped by `search.ts` (missing from `searchKeys` array) — **functional bug**

### frontend-design (3 HIGH)
1. **SW** — Non-standard frontmatter (`license`, `metadata`)
2. **PE** — Competing `CRITICAL`/`IMPORTANT` authority signals dilute each other
3. **PE** — No error recovery / fallback for constraint conflicts

### gh (3 HIGH)
1. **SEC** — `gh auth login --with-token` PAT in shell history
2. **SEC** — `gh repo delete` lacks agent-level guard (only comment in ref table)
3. **SEC** — `gh release delete` / `gh cache delete --all` same issue

### glab (0 HIGH)

### interface-design (3 HIGH)
1. **SW** — SKILL.md far exceeds 150-line router limit
2. **PE** — Core process content not load-gated, always consumed
3. **PE** — Test definitions duplicated across 3 files, no authoritative source

### pdf (2 HIGH)
1. **SW** — No reference files — everything inlined, violating progressive disclosure
2. **PE** — Stop condition for uninspected PDF fragmented across file

### playwright (1 HIGH)
1. **SEC** — Version check/execution path mismatch in shell script

### posthog-skill (3 HIGH)
1. **SW** — Non-standard `compatibility` frontmatter
2. **SW+SEC** — Hardcoded production project ID `39507` in docs AND code
3. **PE** — WRITE OPERATION gate is advisory, not enforced

### prompt-engineering (4 HIGH)
1. **SW** — Non-standard frontmatter (`metadata`)
2. **SW** — Description still enumerates topics
3. **PE** — Output spec under-defined, buried at file end
4. **PE** — Ambiguity handling missing goal-ambiguity case

### render-deploy (3 HIGH)
1. **SW** — SKILL.md far exceeds 150-line limit (~370 lines)
2. **SW** — `static` service type shorthand factually incorrect
3. **PE** — No hierarchy between inline content and reference files

### skill-scanner (1 HIGH)
1. **PE** — No explicit error recovery for script failures

### skill-writer (1 HIGH)
1. **SW** — Transformed examples are case-study narratives, not actual skill artifacts (violates own hard-stop rule)

### test-prompt (1 HIGH)
1. **PE** — Skill opens with description, not directive; Non-negotiable rule buried on line 17

## Cross-Cutting Patterns

| Pattern | Skills Affected | Count |
|---------|----------------|-------|
| Non-standard frontmatter (`metadata`) | agents-md, frontend-design, gh, posthog-skill, prompt-eng, test-prompt | 6 |
| SKILL.md exceeds 150-line router limit | interface-design, posthog-skill, render-deploy, skill-scanner, test-prompt | 5 |
| No reference files / no load gates | docker-model-runner, frontend-design, prompt-engineering, pdf | 4 |
| Description enumerates topics | agents-md, docker-model-runner, frontend-design, glab, interface-design, prompt-eng, render-deploy, test-prompt | 8 |
| Content duplicated between SKILL.md and refs | docker-model-runner, interface-design, posthog-skill, skill-writer | 4 |
| Missing/weak destructive-command guards | gh (3 commands), glab (7 commands) | 2 |
| Output format underspecified | agents-md, frontend-design, render-deploy, skill-writer | 4 |

## Per-Skill Issue Counts (Medium+)

| Skill | HIGH | MEDIUM | Total M+ |
|-------|------|--------|----------|
| prompt-engineering | 4 | 3 | 7 |
| posthog-skill | 3 | 5 | 8 |
| render-deploy | 3 | 4 | 7 |
| gh | 3 | 3 | 6 |
| interface-design | 3 | 4 | 7 |
| frontend-design | 3 | 2 | 5 |
| pdf | 2 | 4 | 6 |
| agents-md | 2 | 2 | 4 |
| docker-model-runner | 2 | 3 | 5 |
| playwright | 1 | 3 | 4 |
| test-prompt | 1 | 2 | 3 |
| skill-writer | 1 | 3 | 4 |
| exa-search | 1 | 3 | 4 |
| skill-scanner | 1 | 3 | 4 |
| glab | 0 | 2 | 2 |
