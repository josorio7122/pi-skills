# Skill Review Round 5 — Full 15-Skill Deep Review (1 scout per skill)

## Aggregate Stats

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 11 |
| MEDIUM | 53 |
| LOW | 55 |
| MINOR | 23 |
| INFO | 12 |
| **Total** | **155** |

## Per-Skill Issue Counts (MEDIUM+)

| Skill | CRIT | HIGH | MED | Total M+ | Verdict |
|-------|------|------|-----|----------|---------|
| posthog-skill | 0 | 3 | 5 | 8 | NEEDS_WORK |
| interface-design | 0 | 0 | 5* | 5 | FAIL (2 CRITICAL per scout's scale) |
| render-deploy | 0 | 1 | 5 | 6 | NEEDS_WORK |
| exa-search | 0 | 2 | 5 | 7 | NEEDS_WORK |
| test-prompt | 1 | 0 | 4 | 5 | NEEDS_WORK |
| glab | 0 | 2 | 3 | 5 | NEEDS_WORK |
| gh | 0 | 1 | 3 | 4 | NEEDS_WORK |
| skill-scanner | 0 | 0 | 3 | 3 | NEEDS_WORK |
| skill-writer | 0 | 1 | 3 | 4 | NEEDS_WORK |
| prompt-engineering | 0 | 0 | 3 | 3 | NEEDS_WORK |
| agents-md | 0 | 1 | 4 | 5 | NEEDS_WORK |
| pdf | 0 | 0 | 4 | 4 | NEEDS_WORK |
| playwright | 0 | 1 | 3 | 4 | NEEDS_WORK |
| docker-model-runner | 0 | 1 | 2 | 3 | NEEDS_WORK |
| frontend-design | 0 | 2 | 1 | 3 | NEEDS_WORK |

*interface-design scout used CRITICAL/MAJOR scale instead of HIGH/MEDIUM — normalized above

## TOP 15 Most Impactful Issues

| # | Skill | Sev | Lens | Issue |
|---|-------|-----|------|-------|
| 1 | posthog-skill | HIGH | SEC | Real project ID `39507` hardcoded in dry-run fixtures (L2-2) |
| 2 | posthog-skill | HIGH | SEC | Real insight ID `drOq2lO5` in compare fixture + test (L2-3) |
| 3 | posthog-skill | HIGH | SEC | POSTHOG_PROJECT_ID required for ALL cmds; offline claims false (L2-1) |
| 4 | render-deploy | HIGH | SEC | `rejectUnauthorized: false` as production TLS pattern |
| 5 | playwright | HIGH | SEC | Security warning trapped inside fenced code block — invisible |
| 6 | test-prompt | CRIT | SW | 235 lines, no references/, zero load gates |
| 7 | exa-search | HIGH | SW | SKILL.md ~175 lines, exceeds 150-line limit |
| 8 | exa-search | HIGH | PE | Rules section buried at bottom — critical constraints last |
| 9 | glab | HIGH | SEC | `glab variable set <key> <value>` in reference table |
| 10 | glab | HIGH | SW | SKILL.md ~185 lines, exceeds 150-line limit |
| 11 | gh | HIGH | SEC | `gh run delete` missing from destructive guard list |
| 12 | frontend-design | HIGH | SW+PE | Missing Error Recovery section |
| 13 | frontend-design | HIGH | PE | Competing authority signals (Rule 1/2 + Prohibitions) |
| 14 | docker-model-runner | HIGH | SW | Duplicate `## References` section (unconditional) |
| 15 | skill-writer | HIGH | SW | Description commits own documented anti-pattern |

## Cross-Cutting Patterns

| Pattern | Skills Affected | Count |
|---------|----------------|-------|
| SKILL.md exceeds 150-line limit | test-prompt (235), glab (185), exa-search (175), posthog (260), skill-scanner (~200) | 5 |
| No conditional load gates / no references/ | test-prompt, prompt-engineering, frontend-design | 3 |
| Description topic enumeration | exa-search, glab, skill-scanner, skill-writer, render-deploy, posthog | 6 |
| Content duplicated SKILL.md↔refs | playwright, posthog, render-deploy (×3), interface-design | 5 |
| Content duplicated ref↔ref | render-deploy (blueprint-spec↔runtimes, service-types↔blueprint-spec), interface-design (principles↔design-system, craft-foundations↔example) | 2 |
| No authority in first 3 lines | agents-md, docker-model-runner, exa-search, glab, gh, render-deploy | 6 |
| Missing Error Recovery section | frontend-design, interface-design, skill-writer | 3 |
| Missing Output Format section | glab, interface-design | 2 |
| Real production IDs in fixtures/tests | posthog-skill (39507 × 4 locations, drOq2lO5 × 2) | 1 |
| Security warnings inside code fences | playwright cli.md | 1 |
| Unsafe TLS/auth patterns in examples | render-deploy (rejectUnauthorized, ALLOWED_HOSTS) | 1 |
| Secrets in CLI args (not stdin) | glab commands.md | 1 |
| Orphan/dead reference files | render-deploy (deployment-details.md) | 1 |
