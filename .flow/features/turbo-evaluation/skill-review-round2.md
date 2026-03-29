# Skill Review Round 2 — All 15 Skills

## Cross-Cutting Patterns

### Pattern 1: Non-standard `compatibility` frontmatter field (10 skills)
Skills: agents-md, docker-model-runner, exa-search, frontend-design, gh, glab, interface-design, pdf, render-deploy, skill-scanner
- `compatibility` is not part of the pi skill spec — silently ignored by runtime
- Usually duplicates content already in description or Prerequisites section

### Pattern 2: Missing error recovery / fallback instructions (12 skills)
Skills: agents-md, docker-model-runner, exa-search, frontend-design, gh, glab, interface-design, pdf, playwright, posthog-skill, prompt-engineering, test-prompt

### Pattern 3: Missing output format specification (7 skills)
Skills: docker-model-runner, frontend-design, gh, pdf, prompt-engineering, test-prompt, interface-design

### Pattern 4: External `metadata.source` URLs to third-party repos (2 skills)
Skills: prompt-engineering, test-prompt — both point to NeoLabHQ/context-engineering-kit

### Pattern 5: Hardcoded upstream repo paths in skill-writer (4 HIGH issues)
EVAL.md and synthesis-path.md contain `plugins/sentry-skills/` and `.codex/` paths

### Pattern 6: Descriptive voice instead of imperative (5 skills)
Skills: docker-model-runner, frontend-design, prompt-engineering, render-deploy, interface-design

---

## Master Issues Table — HIGH and MEDIUM Only

| # | Skill | Severity | Lens | Issue |
|---|-------|----------|------|-------|
| 1 | skill-writer | HIGH | Writer | EVAL.md has hardcoded `plugins/sentry-skills/` paths — fail in this repo |
| 2 | skill-writer | HIGH | Writer | EVAL.md uses `sentry-skills:skill-writer` invocation namespace |
| 3 | skill-writer | HIGH | Writer | synthesis-path.md mandatory baseline sources use wrong repo paths |
| 4 | skill-writer | HIGH | Writer | synthesis-path.md references `.codex/` provider-specific path |
| 5 | skill-writer | HIGH | PE | Routing table vs 7-step structure creates ambiguous activation order |
| 6 | skill-scanner | HIGH | Writer | `compatibility` says Python 3.8+ but script requires 3.9+ |
| 7 | skill-scanner | HIGH | Writer | Missing `allowed-tools` in frontmatter |
| 8 | interface-design | HIGH | Writer | `validation.md` misnamed — primary content is memory management, not validation |
| 9 | interface-design | HIGH | Writer | SKILL.md has ~500 words of philosophy before first actionable directive |
| 10 | interface-design | HIGH | Writer | Heavy content duplication across 3 reference files |
| 11 | interface-design | HIGH | PE | No error recovery for user rejecting proposed direction |
| 12 | playwright | HIGH | Scanner | `npx --yes` silently auto-installs without user confirmation gate |
| 13 | posthog-skill | HIGH | Writer | `references/POSTHOG_API.md` missing/broken — ENOENT |
| 14 | frontend-design | HIGH | PE | No output format specification |
| 15 | frontend-design | HIGH | PE | No forcing instruction to state aesthetic direction before coding |
| 16 | docker-model-runner | HIGH | PE | No output format specified for inference tasks |
| 17 | gh | HIGH | PE | No error recovery / troubleshooting section |
| 18 | glab | HIGH | PE | No error recovery / troubleshooting section |
| 19 | prompt-engineering | HIGH | Writer | Descriptive voice in Core Capabilities — not imperative |
| 20 | prompt-engineering | HIGH | PE | No error recovery for ambiguous skill inputs |
| 21 | test-prompt | HIGH | PE | No output format specification |
| 22 | pdf | MEDIUM | PE | No output format for read/extract tasks |
| 23 | pdf | MEDIUM | PE | `pdfplumber` vs `pypdf` — no decision rule |
| 24 | pdf | MEDIUM | PE | "merge PDFs" and "fill PDF form" in triggers but no workflow |
| 25 | pdf | MEDIUM | Writer | No progressive disclosure — all content inline |
| 26 | pdf | MEDIUM | Writer | "when working in this repo" — project-specific path |
| 27 | render-deploy | MEDIUM | Writer | Two conflicting "Prerequisites" sections |
| 28 | render-deploy | MEDIUM | Writer | Description missing database/cron creation triggers |
| 29 | render-deploy | MEDIUM | Writer | Time-sensitive pricing data hardcoded |
| 30 | render-deploy | MEDIUM | Writer | Heavy content duplication across reference files |
| 31 | render-deploy | MEDIUM | Scanner | `curl | sh` install command before warning |
| 32 | render-deploy | HIGH | Writer | `sandbox_permissions` is pi-platform-specific internal terminology |
| 33 | agents-md | MEDIUM | Writer | `"set up CLAUDE.md"` is provider-specific trigger |
| 34 | agents-md | MEDIUM | Writer | `ln -s AGENTS.md CLAUDE.md` ties skill to Claude convention |
| 35 | agents-md | MEDIUM | Writer | No `references/` directory; 120+ lines in single file |
| 36 | agents-md | MEDIUM | PE | No error recovery for ambiguous projects |
| 37 | docker-model-runner | MEDIUM | Writer | Descriptive intro paragraph — not imperative |
| 38 | docker-model-runner | MEDIUM | Scanner | `curl | sudo bash` installer in reference |
| 39 | exa-search | MEDIUM | PE | No error recovery / fallback instructions |
| 40 | glab | MEDIUM | Scanner | curl snippet with token injection risk |
| 41 | glab | MEDIUM | PE | `"secret-value"` example looks runnable |
| 42 | playwright | MEDIUM | Scanner | `eval`/`run-code` on untrusted pages — no guardrail |
| 43 | playwright | MEDIUM | Writer | Node.js 18+ version pin will go stale |
| 44 | playwright | MEDIUM | PE | Form fill pattern duplicated SKILL.md and workflows.md |
| 45 | posthog-skill | MEDIUM | Writer | Event count discrepancy: catalog shows 10, code has 9 |
| 46 | posthog-skill | MEDIUM | Writer | First Use section is user onboarding, not agent instruction |
| 47 | prompt-engineering | MEDIUM | Writer | "Progressive Disclosure" naming collision |
| 48 | prompt-engineering | MEDIUM | PE | Degrees of Freedom is reference-only, no decision trigger |
| 49 | prompt-engineering | MEDIUM | PE | Instruction hierarchy has no concrete example |
| 50 | skill-scanner | MEDIUM | Scanner | `agentskills.io` in TRUSTED_DOMAINS — unverifiable |
| 51 | skill-scanner | MEDIUM | Writer | "Full path" instruction conflicts with relative-path example |
| 52 | skill-scanner | MEDIUM | PE | Confidence guidance buried after all action phases |
| 53 | skill-writer | MEDIUM | Writer | Routing table partially duplicates 7-step structure |
| 54 | skill-writer | MEDIUM | Writer | EVAL.md target skill name is product-specific |
| 55 | skill-writer | MEDIUM | Writer | "Primary success condition" is descriptive, not imperative |
| 56 | skill-writer | MEDIUM | Scanner | EVAL.md rsync to world-readable /tmp |
| 57 | skill-writer | MEDIUM | PE | synthesis-path mandatory sources have no fallback on path miss |
| 58 | test-prompt | MEDIUM | PE | No fallback for when baseline test unexpectedly passes |
| 59 | test-prompt | MEDIUM | PE | Scenario framing ambiguity with `You` pronoun in subagent dispatch |
