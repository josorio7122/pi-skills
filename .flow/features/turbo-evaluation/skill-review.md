# Full Skill Review — All 13 Skills

Reviewed through 3 lenses: **skill-writer** (authoring quality), **skill-scanner** (security), **prompt-engineering** (prompt effectiveness).

---

## Executive Summary

| Skill | Writer | Security | Prompt | Priority Issues |
|---|---|---|---|---|
| agents-md | ⚠️ | ✅ Clean | ⚠️ | Missing frontmatter fields |
| docker-model-runner | ✅ | ✅ Clean | ✅ | Minor: stale port reference |
| exa-search | ✅ | ⚠️ Caution | ✅ | Hardcoded install path |
| frontend-design | ⚠️ | ✅ Clean | ✅ | No section headers, missing frontmatter |
| gh | ✅ | ✅ Clean | ✅ | Clean |
| glab | ✅ | ✅ Clean | ✅ | Clean — best in class |
| interface-design | ⚠️ | ✅ Clean | ⚠️ | Too long (320 lines), missing frontmatter |
| pdf | ⚠️ | ⚠️ Caution | ⚠️ | Empty agents/, sudo command, vague triggers |
| playwright | ⚠️ | ⚠️ Caution | ⚠️ | Hardcoded CODEX_HOME, empty agents/ |
| posthog-skill | ✅ | ✅ Clean | ✅ | Minor: project-specific, not portable |
| render-deploy | ⚠️ | ⚠️ Caution | ⚠️ | 372 lines (longest), empty agents/, pipe-to-sh |
| skill-scanner | ✅ | ✅ Clean | ✅ | Clean |
| skill-writer | ✅ | ✅ Clean | ✅ | Clean |

---

## Detailed Findings

### 1. agents-md

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ Description starts with "This skill should be used when" — passive voice, not third-person imperative per design-principles.md
- ✅ Body is concise and imperative
- ✅ Good anti-patterns section

**Security Lens:**
- ✅ No scripts, no network, no permissions needed
- ✅ Clean — documentation-only skill

**Prompt-Engineering Lens:**
- ⚠️ Description is verbose ("This skill should be used when the user asks to...") — could be more direct
- ✅ Good trigger phrases

**Recommended fixes:**
1. Rewrite description: `"Create and maintain minimal, high-signal AGENTS.md files. Use when asked to \"create AGENTS.md\", \"update AGENTS.md\", \"maintain agent docs\", or \"set up CLAUDE.md\". Enforces research-backed best practices for concise agent documentation."`
2. Add `metadata` and `compatibility` fields

---

### 2. docker-model-runner

**Skill-Writer Lens:**
- ✅ Good frontmatter with compatibility field
- ✅ Clear 6-step workflow
- ✅ Practical examples with API usage
- ⚠️ Missing `metadata` field (author, version)

**Security Lens:**
- ✅ No scripts, read-only reference
- ✅ Docker commands are local-only

**Prompt-Engineering Lens:**
- ✅ Strong trigger coverage in description
- ✅ Decision table format is efficient

**Recommended fixes:**
1. Add `metadata` field

---

### 3. exa-search

**Skill-Writer Lens:**
- ✅ Complete frontmatter with metadata
- ✅ Decision table + decision tree for script selection
- ✅ Cost awareness section — excellent
- ❌ Prerequisites say `cd <skill-dir>/skills/exa-search && npm install` — stale instruction (deps are now at root)
- ⚠️ Install instruction uses `npm install` not `pnpm install`

**Security Lens:**
- ⚠️ Scripts make external HTTP calls to Exa API — expected but worth noting
- ⚠️ Reads `EXA_API_KEY` from environment — legitimate, key exposure risk is user-side
- ✅ No credential theft, no exfiltration beyond intended API calls

**Prompt-Engineering Lens:**
- ✅ Excellent progressive disclosure (quick examples → common patterns → rules)
- ✅ Cost table helps agent make informed decisions
- ✅ Clear "Rules" section with imperative voice

**Recommended fixes:**
1. Fix prerequisites: change `cd <skill-dir>/skills/exa-search && npm install` to `Run pnpm install from the repo root if needed`
2. Change `npm install` → `pnpm install` in any remaining references

---

### 4. frontend-design

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ No section headers in body — single blob of prose (violates design-principles.md structure)
- ⚠️ 47 lines is short but acceptable for a creative instruction skill
- ✅ Strong aesthetic direction with specific anti-patterns

**Security Lens:**
- ✅ No scripts, no network, no file access
- ✅ Clean — pure generative instruction

**Prompt-Engineering Lens:**
- ✅ Excellent use of Authority persuasion ("CRITICAL", "NEVER")
- ⚠️ Missing section headers makes it harder for the model to reference specific guidance
- ✅ Good concrete examples of what to avoid

**Recommended fixes:**
1. Add section headers (## Design Thinking, ## Aesthetics Guidelines, ## Prohibitions)
2. Add `compatibility` and `metadata` fields

---

### 5. gh

**Skill-Writer Lens:**
- ✅ Complete frontmatter with metadata
- ✅ Clear workflow sections with practical examples
- ✅ When-to-use matrix for merge strategies
- ✅ Tips section with power-user patterns

**Security Lens:**
- ✅ No bundled scripts — relies on user-installed `gh` CLI
- ✅ Auth handled by `gh auth` (no credential handling in skill)

**Prompt-Engineering Lens:**
- ✅ Good progressive disclosure (prerequisites → choosing → workflows → tips)
- ✅ Intent-to-command mapping table

**Recommended fixes:** None — clean skill.

---

### 6. glab

**Skill-Writer Lens:**
- ✅ Complete frontmatter with metadata, version 3.0
- ✅ Most comprehensive workflow coverage (8 flows vs gh's 6)
- ✅ Stacked diffs coverage — unique and valuable
- ✅ CI/CD config management (variables, schedules)

**Security Lens:**
- ✅ No bundled scripts — relies on user-installed `glab` CLI
- ✅ Clean

**Prompt-Engineering Lens:**
- ✅ Best description in the repo — comprehensive trigger phrases including "retrigger CI," "deploy"
- ✅ 10-row decision table is excellent
- ✅ Aliases section reduces ambiguity

**Recommended fixes:** None — best-in-class skill. Model for others.

---

### 7. interface-design

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ 320 lines — exceeds comfortable SKILL.md length. Per design-principles.md: >100 lines should have TOC, heavy content should be in references/
- ⚠️ Has references/ but keeps most content in SKILL.md body instead of delegating
- ✅ Rich design system with specific, actionable guidance
- ✅ Slash commands for structured interactions

**Security Lens:**
- ✅ No scripts, no network
- ✅ Writes to `.interface-design/system.md` — benign project-local file

**Prompt-Engineering Lens:**
- ⚠️ Token-heavy — 320 lines loaded on every activation wastes context when only a quick audit is needed
- ✅ Excellent use of progressive disclosure concept (Intent First → Exploration → Mandate → Foundations)
- ⚠️ Repeated emphasis ("NEVER", "CRITICAL", "every", "must") may cause authority fatigue — too many "critical" items dilute urgency

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields
2. Move "Design Principles" (12 subsections, ~120 lines) to `references/design-system.md` with conditional loading
3. Move "Craft Foundations" to references/
4. Add TOC at top
5. Slim SKILL.md to ~150 lines: workflow + core principles + conditional loading table

---

### 8. pdf

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ Empty `agents/` directory — dead artifact, should be removed
- ⚠️ Description is good but "even if they don't explicitly ask for help with them" is over-triggering

**Security Lens:**
- ⚠️ `sudo apt-get install -y poppler-utils` — runs with elevated privileges. Acceptable for system package installation but worth flagging
- ⚠️ `python3 -m pip install` fallback — installs packages globally (violates uv-only rule, but this is a portable skill)
- ✅ No network calls beyond package installation

**Prompt-Engineering Lens:**
- ⚠️ "Also use when the user mentions PDF files even if they don't explicitly ask for help with them" — too broad, will cause false triggers
- ✅ Quality expectations section is specific and actionable

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields
2. Remove empty `agents/` directory
3. Tighten description: remove "even if they don't explicitly ask for help with them"
4. Replace `python3 -m pip install` with `uv pip install` as primary (keep pip as fallback notation)

---

### 9. playwright

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ Hardcoded `CODEX_HOME` path: `export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"` — provider-specific (Codex), violates portability principle
- ❌ Empty `agents/` directory — dead artifact
- ⚠️ `npm install -g @playwright/cli@latest` — global install, not ideal

**Security Lens:**
- ⚠️ Shell script (`playwright_cli.sh`) wraps `npx` — should verify no injection via args
- ⚠️ `npm install -g` — modifies global system state
- ✅ No credential access, no exfiltration

**Prompt-Engineering Lens:**
- ⚠️ Path setup assumes Codex environment — won't work for pi without modification
- ✅ Good workflow loop (open → snapshot → interact → re-snapshot)
- ✅ Clear guardrails section

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields
2. Remove hardcoded `CODEX_HOME` — use `$SKILL_DIR` relative path instead
3. Remove empty `agents/` directory
4. Replace `npm install -g` with `npx` (already used internally by the wrapper script)

---

### 10. posthog-skill

**Skill-Writer Lens:**
- ✅ Complete frontmatter with metadata
- ✅ Excellent command reference table
- ✅ Comprehensive error output examples
- ✅ Dry-run mode documentation
- ⚠️ Highly project-specific (hardcoded project ID `39507`, dashboard name, event catalog) — intentional but not portable

**Security Lens:**
- ✅ API key read from env var (not hardcoded)
- ✅ `--dry-run` mode for safe exploration
- ✅ All WRITE operations documented with recovery procedures
- ✅ Clean

**Prompt-Engineering Lens:**
- ✅ Excellent progressive disclosure: offline exploration first, then live
- ✅ API Quirks section prevents common mistakes
- ✅ Exit codes section enables programmatic error handling

**Recommended fixes:** None significant — well-crafted project-specific skill.

---

### 11. render-deploy

**Skill-Writer Lens:**
- ❌ Missing `compatibility` and `metadata` frontmatter fields
- ❌ 372 lines — longest SKILL.md in the repo, far exceeds guidelines
- ❌ Empty `agents/` directory — dead artifact
- ⚠️ MCP setup instructions for 4 different tools (Cursor, Claude Code, Codex, Other) — should be in references/
- ✅ Rich reference library (10 files)

**Security Lens:**
- ⚠️ `curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh` — **pipe-to-shell pattern** is a supply chain risk
- ⚠️ `export RENDER_API_KEY="rnd_xxxxx"` — example with real-looking key format
- ✅ MCP authentication uses standard bearer token pattern

**Prompt-Engineering Lens:**
- ⚠️ Token-heavy — 372 lines loaded on every activation
- ✅ Good decision trees (Blueprint vs Direct Creation)
- ⚠️ MCP setup instructions are provider-specific and take ~60 lines that could be in a reference file

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields
2. Remove empty `agents/` directory
3. Move MCP setup section (~60 lines) to `references/mcp-setup.md`
4. Move Method 2 (Direct Creation) details to reference (already mostly delegated)
5. Target ~200 lines for SKILL.md
6. Add warning about pipe-to-shell install pattern

---

### 12. skill-scanner

**Skill-Writer Lens:**
- ✅ Clear 8-phase workflow
- ✅ Good confidence level framework
- ✅ Output format template is specific and structured
- ⚠️ Missing `compatibility` and `metadata` frontmatter fields

**Security Lens:**
- ✅ Meta-clean: a security scanner skill that follows its own rules
- ✅ `scan_skill.py` outputs JSON to stdout only — no network, no writes
- ✅ Correctly flags false positives for security review skills

**Prompt-Engineering Lens:**
- ✅ Excellent structured output format (SKILL-SEC-NNN)
- ✅ Confidence levels guide agent behavior precisely
- ✅ False positive awareness is critical and well-handled

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields

---

### 13. skill-writer

**Skill-Writer Lens:**
- ✅ Clean conditional loading pattern — only loads reference files as needed
- ✅ 7-step workflow is clear and well-sequenced
- ✅ Extensive reference library (12+ files)
- ⚠️ Missing `compatibility` and `metadata` frontmatter fields

**Security Lens:**
- ✅ `quick_validate.py` is a read-only checker
- ✅ No network, no credential access
- ✅ Clean

**Prompt-Engineering Lens:**
- ✅ Best progressive disclosure in the repo — SKILL.md is a thin index, all depth is in references
- ✅ Step-by-step with clear "read X before doing Y" gates

**Recommended fixes:**
1. Add `compatibility` and `metadata` fields

---

## Cross-Cutting Issues (Apply to Multiple Skills)

### Issue A: Missing frontmatter fields (9 of 13 skills)
Skills missing `metadata` and/or `compatibility`: agents-md, docker-model-runner (metadata only), frontend-design, interface-design, pdf, playwright, render-deploy, skill-scanner, skill-writer.

**Fix:** Add standardized frontmatter to all skills.

### Issue B: Empty `agents/` directories (3 skills)
pdf, playwright, render-deploy all have empty `agents/` directories — dead artifacts that should be removed.

### Issue C: Description quality inconsistencies
- `agents-md`: Passive voice ("This skill should be used when...")
- `pdf`: Over-triggering ("even if they don't explicitly ask")
- All others are good to excellent

### Issue D: Provider-specific paths
- `playwright`: Hardcoded `CODEX_HOME` — should use `$SKILL_DIR`
- `exa-search`: Stale install instruction referencing skill-local npm install

### Issue E: Token budget concerns
- `interface-design` (320 lines) and `render-deploy` (372 lines) load too much on activation
- Both should move heavy content to reference files with conditional loading

---

## Priority Action Items

| # | Issue | Skills Affected | Effort |
|---|-------|----------------|--------|
| 1 | Add missing frontmatter (metadata, compatibility) | 9 skills | Low |
| 2 | Remove empty agents/ directories | pdf, playwright, render-deploy | Low |
| 3 | Fix exa-search stale install instructions | exa-search | Low |
| 4 | Fix playwright CODEX_HOME hardcoding | playwright | Low |
| 5 | Rewrite agents-md description (passive → active voice) | agents-md | Low |
| 6 | Tighten pdf description (remove over-trigger) | pdf | Low |
| 7 | Slim interface-design SKILL.md (move content to refs) | interface-design | Medium |
| 8 | Slim render-deploy SKILL.md (move content to refs) | render-deploy | Medium |
| 9 | Add pipe-to-shell warning in render-deploy | render-deploy | Low |
