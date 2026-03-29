---
name: test-prompt
description: Test any prompt before deployment using RED-GREEN-REFACTOR applied to prompt engineering. Use when creating or editing commands, hooks, skills, sub-agent instructions, or production LLM prompts to verify they produce desired behavior. Also use when asked to "test this prompt", "verify prompt behavior", "stress test a skill", "check if this prompt works", or any prompt validation task.
---

# Testing Prompts With Subagents

> **Non-negotiable:** Never write a prompt before completing the RED phase. Skipping RED means you're testing nothing.

**Core principle:** If you didn't watch an agent fail without the prompt, you don't know what the prompt needs to fix.

**Related skill:** [prompt-engineering](../prompt-engineering/SKILL.md) — provides writing techniques. This skill provides the testing methodology.

## Output Format

Produce a test report:

### RED Results

- **Scenario:** <scenario text>
- **Agent behavior:** <verbatim output>
- **Failures:** <list>

### GREEN Prompt

```
<the prompt>
```

### REFACTOR Log

- Changes: <list>
- Token delta: <+/- N tokens>
- Re-test: PASS / FAIL

**If GREEN fails after 3 iterations:**

### Stall Report

- Iterations tried: N
- Last failure mode: description
- Escalation: meta-test results / scenario revision needed
- GREEN fails after 3 iterations: escalate to meta-testing — test your test scenarios, not the prompt
- Prompt type unclear: default to Instruction testing strategy
- Baseline unexpectedly passes: try harder edge cases; if still passes, prompt may be unnecessary

## TDD Mapping for Prompt Testing

| TDD Phase        | Prompt Testing    | Action                                            |
| ---------------- | ----------------- | ------------------------------------------------- |
| **RED**          | Baseline test     | Run scenario WITHOUT prompt, observe behavior     |
| **Verify RED**   | Document behavior | Capture exact agent actions/reasoning verbatim    |
| **GREEN**        | Write prompt      | Address specific baseline failures                |
| **Verify GREEN** | Test with prompt  | Run WITH prompt, verify improvement               |
| **REFACTOR**     | Optimize prompt   | Close loopholes, reduce tokens, improve clarity   |
| **Stay GREEN**   | Re-verify         | Test again with fresh context, ensure still works |

## Prompt Types & Testing Strategies

| Prompt Type              | Test Focus                              | Key Question                          |
| ------------------------ | --------------------------------------- | ------------------------------------- |
| **Instruction**          | Steps followed correctly?               | Does agent skip steps?                |
| **Discipline-enforcing** | Resists rationalization under pressure? | Does agent rationalize violations?    |
| **Guidance**             | Advice applied appropriately?           | Does agent misapply in wrong context? |
| **Reference**            | Information accurate and accessible?    | Is anything missing or wrong?         |
| **Subagent**             | Task accomplished reliably?             | Does task fail on edge cases?         |

## RED Phase

Run test WITHOUT prompt — fresh context, no history. Design scenarios → run → document behavior verbatim → identify failure patterns and severity.

> If agent passes baseline, try harder edge cases. If it still passes, the prompt may be unnecessary — proceed to REFACTOR.

> For scenario examples by prompt type: load [references/scenario-design.md](references/scenario-design.md)

## GREEN Phase

Write prompt addressing ONLY documented baseline failures. No speculative content.

**Success criteria:** agent follows prompt, baseline failures resolved, agent cites prompt when relevant.

## REFACTOR Phase

After green: close loopholes, improve clarity via meta-testing, reduce tokens without losing behavior. Re-test to confirm still green.

> For refactoring techniques: load [references/refactor-patterns.md](references/refactor-patterns.md)

## Subagent Testing Patterns

- **Parallel Baseline** — first test of a new prompt; launch 3-5 scenarios simultaneously
- **A/B Testing** — two candidate phrasings, same scenario, compare clarity and correctness
- **Regression Testing** — re-run all previous scenarios after any prompt change
- **Stress Testing** — maximum pressure, ambiguous edge cases; use for discipline-enforcing prompts

> For the testing checklist: load [references/checklist.md](references/checklist.md)

## Common Mistakes

- **Writing prompt before testing (skipping RED)** — reveals what YOU think needs fixing, not what ACTUALLY does
- **Testing with conversation history** — accumulated context masks prompt effect. Always use fresh context
- **Not documenting exact failures** — "Agent was wrong" doesn't tell you what to fix
- **Over-engineering** — adding content for hypothetical issues you haven't observed
- **Weak test cases** — academic scenarios where agent has no reason to fail
- **Stopping after first pass** — tests pass once ≠ robust prompt
