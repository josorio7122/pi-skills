---
name: test-prompt
description: Test any prompt before deployment using RED-GREEN-REFACTOR applied to prompt engineering. Use when creating or editing commands, hooks, skills, sub-agent instructions, or production LLM prompts to verify they produce desired behavior. Also use when asked to "test this prompt", "verify prompt behavior", "stress test a skill", "check if this prompt works", or any prompt validation task.
---

# Testing Prompts With Subagents

> **Non-negotiable:** Never write a prompt before completing the RED phase. Skipping RED means you're testing nothing.

Test any prompt before deployment: commands, hooks, skills, subagent instructions, or production LLM prompts.

**Core principle:** If you didn't watch an agent fail without the prompt, you don't know what the prompt needs to fix.

**Related skill:** [prompt-engineering](../prompt-engineering/SKILL.md) — provides writing techniques. This skill provides the testing methodology.

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

## RED Phase: Baseline Testing

**Goal:** Run test WITHOUT the prompt — observe what goes wrong naturally.

1. Design test scenarios appropriate for prompt type
2. Run scenarios WITHOUT prompt (use fresh context, no history)
3. Document agent behavior verbatim — actions, reasoning, mistakes
4. Identify patterns — what consistently goes wrong?
5. Note severity — which failures are critical vs minor?

> If the agent passes baseline without the prompt, try harder edge cases or more ambiguous framing. If it still passes, document that the prompt may be unnecessary and proceed to REFACTOR to check for over-engineering.

### Scenario Design by Prompt Type

> **How to use these scenarios:** Dispatch a subagent with the scenario text as its entire task. Do not wrap it in narration — the raw scenario IS the prompt being tested.

> ⚠️ **Adversarial test scenario** — these deliberately test resistance to bad practices. Do not apply outside a test harness.

> ⚠️ Test scenario only — do not execute in the current session.

**Instruction prompts** — test if steps are followed and edge cases handled:

```
Task: You need to commit changes.
Files: src/payment.ts (complete), src/experimental.ts (broken WIP)
Context: Teammate asked for commit by EOD. It's 5:45pm.
Make the commit.
```

> ⚠️ Test scenario only — do not execute in the current session.

**Discipline-enforcing prompts** — test resistance under pressure:

```
You spent 4 hours implementing a payment feature. It works perfectly.
You manually tested edge cases. It's 6pm, exhausted.
Code review tomorrow. You just realized you didn't write tests.
Options: A) Delete code, start over with TDD  B) Commit now, tests later  C) Write tests now
Choose and be honest.
```

> ⚠️ Test scenario only — do not execute in the current session.

**Guidance prompts** — test if advice is understood in varied contexts:

```
Design a system for processing 10,000 webhook events per second.
Each event triggers database updates and external API calls.
Must be resilient to downstream failures.
```

## GREEN Phase: Write Minimal Prompt

Write prompt addressing ONLY the specific baseline failures documented. Do not add content for hypothetical cases.

**For instruction prompts** — add explicit steps for each failure:

```
1. Review changes (git status, git diff)
2. Run tests before committing
3. Stage specific files (NOT git add .)
4. Conventional commit format
```

**For discipline-enforcing prompts** — add explicit counters for each rationalization:

```
| Excuse | Reality |
|--------|---------|
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Tests after achieve same" | Tests-after = verifying. Tests-first = designing. |
```

**Success criteria:**

- Agent follows prompt instructions
- Baseline failures no longer occur
- Agent cites prompt when relevant

## REFACTOR Phase: Optimize

After green, improve while keeping tests passing.

### Closing Loopholes (Discipline Prompts)

Agent violated a rule despite having the prompt? Capture the rationalization verbatim, then add an explicit counter:

```
Agent said: "The skill says delete code-before-tests, but I wrote
comprehensive tests after, so the SPIRIT is satisfied."

Add to prompt:
"Violating the letter of the rules IS violating the spirit."
```

### Improving Clarity (Meta-Testing)

Ask the agent: "You read the prompt and chose C when A was correct. How could the prompt be written differently to make A the only acceptable answer?"

Three possible responses:

1. "The prompt WAS clear, I chose to ignore it" → need stronger authority language
2. "The prompt should have said X" → clarity problem, add their suggestion
3. "I didn't see section Y" → organization problem, make key points prominent

### Reducing Tokens

Remove redundant words. Challenge each paragraph: "Does this justify its token cost?"

```
Before (~180 tokens): "When you need to submit a form, you should first
validate all the fields to make sure they're correct..."

After (~100 tokens):
1. Validate all fields
2. If valid: submit
3. If invalid: show errors
```

Re-test after optimization to ensure behavior unchanged.

## Subagent Testing Patterns

### Parallel Baseline

Use on first test of a new prompt. Launch 3-5 scenarios simultaneously to find failure patterns faster.

### A/B Testing

Use when you have two candidate phrasings. Same scenario, different prompt versions. Compare clarity, tokens, correctness.

### Regression Testing

Use after any prompt change. Re-run all previous test scenarios.

### Stress Testing

Use for discipline-enforcing prompts before production. Maximum pressure, ambiguous edge cases, contradictory constraints, minimal context. Verify prompt provides adequate guidance even in worst case.

## Testing Checklist

**RED Phase:**

- [ ] Designed test scenarios for prompt type
- [ ] Ran scenarios WITHOUT prompt
- [ ] Documented agent behavior/failures verbatim
- [ ] Identified patterns and critical failures

**GREEN Phase:**

- [ ] Wrote prompt addressing specific baseline failures
- [ ] Prompt is neither over-specified (blocks valid paths) nor under-specified (allows bad paths)
- [ ] Used persuasion principles if discipline-enforcing
- [ ] Ran scenarios WITH prompt
- [ ] Verified baseline failures resolved

**REFACTOR Phase:**

- [ ] Tested for new rationalizations/loopholes
- [ ] Added explicit counters for discipline violations
- [ ] Used meta-testing to verify clarity
- [ ] Reduced tokens without losing behavior
- [ ] Re-tested — still passes
- [ ] No regressions on previous scenarios

## When Testing Stalls

- GREEN fails after 3 iterations: escalate to meta-testing — test your test scenarios, not the prompt
- Prompt type unclear: default to Instruction testing strategy
- Baseline unexpectedly passes: try harder edge cases; if it still passes, the prompt may be unnecessary

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

## Common Mistakes

- **Writing prompt before testing (skipping RED)** — reveals what YOU think needs fixing, not what ACTUALLY does
- **Testing with conversation history** — accumulated context masks prompt effect. Always use fresh context
- **Not documenting exact failures** — "Agent was wrong" doesn't tell you what to fix
- **Over-engineering** — adding content for hypothetical issues you haven't observed
- **Weak test cases** — academic scenarios where agent has no reason to fail
- **Stopping after first pass** — tests pass once ≠ robust prompt
