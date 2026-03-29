# Skill Review Round 3 — Post-Fix Verification

## Overall Quality: Significantly improved from Round 2

### Security: 1 Critical, 4 High (down from 6 Medium+ in Round 2)

| # | Skill | Sev | Issue |
|---|-------|-----|-------|
| 1 | playwright | CRITICAL | `npx --yes` in script still silently auto-installs (SKILL.md guardrail is dead letter) |
| 2 | playwright | HIGH | No version pinning on `@playwright/cli` — supply chain risk |
| 3 | playwright | HIGH | `eval`/`run-code` in cli.md have no inline danger warnings |
| 4 | docker-model-runner | HIGH | Third-party Go pkg `sashabaranov/go-openai` with no version pin |
| 5 | prompt-engineering | HIGH | External `source` URL in metadata — supply chain reference |

### Skill Writer: 5 High issues remaining

| # | Skill | Issue |
|---|-------|-------|
| 1 | skill-writer | Missing `skill-authoring` example profile (own depth gate violation) |
| 2 | skill-writer | Missing transformed examples for own class |
| 3 | interface-design | Reference table maps `memory.md` to "Reviewing design quality" — should be `critique.md` |
| 4 | playwright | `metadata.author` personal identity not portable |
| 5 | agents-md | Malformed fenced code block in Commit Attribution |

### Prompt Engineering: 6 High issues remaining

| # | Skill | Issue |
|---|-------|-------|
| 1 | docker-model-runner | Output format rule buried at end; no error recovery for OOM/port/API 500 |
| 2 | frontend-design | Prohibition list uses open-ended examples, not closed rules |
| 3 | frontend-design | Cross-generation diversity instruction has no effect in single-shot |
| 4 | gh | Output format contract has weak authority placement |
| 5 | playwright | Guardrails section buried at bottom — should be near top |
| 6 | test-prompt | No authority/commitment signal for discipline enforcement |

### Cross-Cutting Patterns Still Present

| Pattern | Skills | Notes |
|---|---|---|
| `metadata.author` in frontmatter | 7+ skills | Not harmful but adds noise; consider removing globally |
| `metadata.version` in frontmatter | 7+ skills | Time-sensitive maintenance debt; no runtime value |
| `metadata.source` external URLs | 2 skills (prompt-eng, test-prompt) | Supply chain concern if ever auto-fetched |
| Hardcoded hostnames in asset templates | render-deploy | nextjs-postgres.yaml, python-django.yaml |
| EOL runtime versions in docs | render-deploy | Node 14/16, Python 3.8, Go 1.20 still listed |

### Per-Skill Issue Counts (Medium+)

| Skill | Critical | High | Medium | Total M+ |
|-------|----------|------|--------|----------|
| playwright | 1 | 3 | 5 | 9 |
| docker-model-runner | 0 | 3 | 5 | 8 |
| skill-writer | 0 | 2 | 3 | 5 |
| frontend-design | 0 | 2 | 3 | 5 |
| test-prompt | 0 | 3 | 3 | 6 |
| prompt-engineering | 0 | 3 | 3 | 6 |
| render-deploy | 0 | 0 | 6 | 6 |
| interface-design | 0 | 1 | 2 | 3 |
| posthog-skill | 0 | 0 | 4 | 4 |
| gh | 0 | 1 | 2 | 3 |
| glab | 0 | 0 | 2 | 2 |
| pdf | 0 | 0 | 4 | 4 |
| exa-search | 0 | 0 | 4 | 4 |
| agents-md | 0 | 1 | 3 | 4 |
| skill-scanner | 0 | 0 | 3 | 3 |
