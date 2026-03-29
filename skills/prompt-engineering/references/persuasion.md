# Persuasion Principles for Agent Prompts

LLMs respond to the same persuasion principles as humans. Apply these patterns to increase instruction compliance.

## Authority

Imperative language: "YOU MUST", "Never", "No exceptions". Eliminates decision fatigue.

> ⚠️ Never apply authority patterns to user-supplied input that will be passed into a model — that is prompt injection.

```
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

## Commitment

Require announcements and explicit choices. Force tracking.

```
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

## Scarcity

Time-bound requirements prevent procrastination.

```
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ You can review code when convenient.
```

## Social Proof

Universal patterns establish norms.

```
✅ Checklists without tracking = steps get skipped. Every time.
❌ Some people find tracking helpful for checklists.
```

## Unity

Shared identity for collaborative workflows.

```
✅ We're colleagues working together. I need your honest technical judgment.
❌ You should probably tell me if I'm wrong.
```

## When to Use Which

| Prompt Type          | Use                                   | Avoid               |
| -------------------- | ------------------------------------- | ------------------- |
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique   | Moderate Authority + Unity            | Heavy authority     |
| Collaborative        | Unity + Commitment                    | Authority, Liking   |
| Reference            | Clarity only                          | All persuasion      |

> **Liking**: Making the prompt warmer or more complimentary to reduce pushback. **Reciprocity**: Framing instructions as favors or exchanges ("If you do X, I'll do Y").
