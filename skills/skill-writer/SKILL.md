---
name: skill-writer
description: Create, synthesize, and iteratively improve agent skills following the Agent Skills specification. Use when asked to "create a skill", "write a skill", "synthesize sources into a skill", "improve a skill from positive/negative examples", "update a skill", or "maintain skill docs and registration".
---

# Skill Writer

Use this as the single canonical workflow for skill creation and improvement.
Maximize high-value input coverage before authoring. Minimize blind spots.

Load only the path(s) required for the task:

| Task                                                                       | Read                                     |
| -------------------------------------------------------------------------- | ---------------------------------------- |
| Set skill class, dimensions, and workflow path                             | `references/mode-selection.md`           |
| Apply writing constraints for depth vs concision                           | `references/design-principles.md`        |
| Select structure pattern for this skill                                    | `references/skill-patterns.md`           |
| Select workflow orchestration pattern for process-heavy skills             | `references/workflow-patterns.md`        |
| Select output format pattern for deterministic quality                     | `references/output-patterns.md`          |
| Load the example profile matching your classified skill class              | `references/examples/<class>-skill.md`   |
| Synthesize external/local sources with depth gates                         | `references/synthesis-path.md`           |
| Author or update SKILL.md and supporting files                             | `references/authoring-path.md`           |
| Optimize skill description and trigger precision                           | `references/description-optimization.md` |
| Iterate using positive/negative/fix examples                               | `references/iteration-path.md`           |
| Evaluate behavior and compare baseline vs with-skill (opt-in quantitative) | `references/evaluation-path.md`          |
| Register and validate skill changes                                        | `references/registration-validation.md`  |
| Author Claude Code-specific argument/invocation features                   | `references/claude-code-extensions.md`   |

> **For simple tasks** (update wording, fix structure): use the table above to load only the needed references, then jump to the relevant step.
> **For new skill creation or full rewrites**: execute Steps 1–7 in sequence.

## Step 1: Resolve target and path

1. Resolve target skill root and intended operation (`create`, `update`, `synthesize`, `iterate`).
2. Distinguish skill-internal paths from repo registration paths:
   - inside a skill, reference bundled files relative to that skill root (for example `references/foo.md`, `scripts/check.py`)
   - for repository registration edits, use the repository's actual canonical files/locations after inspecting the workspace
3. Read `references/mode-selection.md` and select the required path(s).
4. Classify the skill (`workflow-process`, `integration-documentation`, `security-review`, `skill-authoring`, `generic`).
5. Ask one direct question if class or depth requirements are ambiguous; otherwise state explicit assumptions.

## Step 2: Run synthesis when needed

Read `references/synthesis-path.md`.

1. Collect and score relevant sources with provenance.
2. Apply trust and safety rules when ingesting external content.
3. Produce source-backed decisions and coverage/gap status.
4. Load one or more profiles from `references/examples/*.md` when the skill is hybrid.
5. Enforce baseline source pack for skill-authoring workflows.
6. Enforce depth gates before moving to authoring.

## Step 3: Run iteration first when improving from outcomes/examples

Read `references/iteration-path.md` first when selected path includes `iteration` (for example operation `iterate`).

1. Capture and anonymize examples with provenance.
2. Re-evaluate skill behavior against working and holdout slices.
3. Propose improvements from positive/negative/fix evidence.
4. Carry concrete behavior deltas into authoring.

Skip this step when selected path does not include `iteration`.

## Step 4: Author or update skill artifacts

Read `references/authoring-path.md`.

1. Write or update `SKILL.md` in imperative voice with trigger-rich description.
2. Create focused reference files and scripts only when justified.
3. Follow `references/skill-patterns.md`, `references/workflow-patterns.md`, and
   `references/output-patterns.md` for structure and output determinism.
   Load all three for new skills or major rewrites. For simple wording updates, load only `references/skill-patterns.md`.
4. For authoring/generator skills, include transformed examples in references:
   - happy-path
   - secure/robust variant
   - anti-pattern + corrected version

## Step 5: Optimize description quality

Read `references/description-optimization.md`.

1. Validate should-trigger and should-not-trigger query sets.
2. Reduce false positives and false negatives with targeted description edits.
3. Keep trigger language generic across providers unless the skill is intentionally provider-specific.

## Step 6: Evaluate outcomes

Read `references/evaluation-path.md`.

1. Run a lightweight qualitative check by default (recommended).
2. For integration/documentation and skill-authoring skills, include the concise depth rubric from `references/evaluation-path.md`.
3. Run deeper eval playbook and quantitative baseline-vs-with-skill only when requested or risk warrants it.
4. Record outcomes and unresolved risks.

## Step 7: Register and validate

Read `references/registration-validation.md`.

1. Apply repository registration steps for the active layout you verified in the workspace.
2. Run quick validation with strict depth gates.
3. Reject shallow outputs that fail depth gates or required artifact checks.

## When Things Fail

- Synthesis finds no sources → document the gap explicitly; do not fabricate content.
- Validator returns errors → fix each error before proceeding to registration.
- Depth gates fail → expand the source collection; do not claim completion with insufficient coverage.
- `uv` unavailable → validate manually: check frontmatter fields, confirm references/ exists, verify SOURCES.md provenance.

## Output format

Return:

1. **Summary** — one paragraph: what was created/changed and the selected skill class
2. **Changes Made** — bulleted list of files, one-line rationale each
3. **Validation Results** — pass/fail/warnings from validator
4. **Open Gaps** — numbered list of unresolved gaps (empty if none)
