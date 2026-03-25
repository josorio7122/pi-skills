---
name: prompt-engineering
description: Advanced prompt engineering patterns for maximizing LLM performance. Use when writing commands, hooks, skills, sub-agent prompts, system prompts, or any LLM interaction. Also use when asked to "improve this prompt", "optimize a prompt", "write a system prompt", "make this prompt more effective", or any prompt engineering task. Covers few-shot learning, chain-of-thought, template systems, persuasion principles, degrees of freedom, and token efficiency.
metadata:
  author: NeoLabHQ
  version: "1.0"
  source: https://github.com/NeoLabHQ/context-engineering-kit/blob/master/plugins/customaize-agent/skills/prompt-engineering/SKILL.md
  license: See source repository
---

# Prompt Engineering Patterns

Advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability.

## Core Capabilities

### 1. Few-Shot Learning

Teach the model by showing examples instead of explaining rules. Include 2-5 input-output pairs that demonstrate the desired behavior. More examples improve accuracy but consume tokens — balance based on task complexity.

### 2. Chain-of-Thought Prompting

Request step-by-step reasoning before the final answer. Add "Let's think step by step" (zero-shot) or include example reasoning traces (few-shot). Improves accuracy on analytical tasks by 30-50%.

### 3. Prompt Optimization

Start simple, measure performance, then iterate. Test on diverse inputs including edge cases. Critical for production prompts where consistency and cost matter.

### 4. Template Systems

Build reusable prompt structures with variables, conditional sections, and modular components. Reduces duplication and ensures consistency.

### 5. System Prompt Design

Set global behavior and constraints that persist across the conversation. Define the model's role, expertise level, output format, and safety guidelines.

## Key Patterns

### Instruction Hierarchy

```
[System Context] → [Task Instruction] → [Examples] → [Input Data] → [Output Format]
```

### Progressive Disclosure

Start with simple prompts, add complexity only when needed:
1. **Level 1**: Direct instruction — "Summarize this article"
2. **Level 2**: Add constraints — "Summarize in 3 bullet points, focusing on key findings"
3. **Level 3**: Add reasoning — "Identify the main findings, then summarize in 3 bullet points"
4. **Level 4**: Add examples — Include 2-3 example summaries with input-output pairs

### Degrees of Freedom

Match specificity to task fragility and variability.

**High freedom** — Multiple approaches are valid, decisions depend on context:
```
Analyze the code structure and organization.
Check for potential bugs or edge cases.
```

**Medium freedom** — A preferred pattern exists, some variation acceptable:
```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data, generate output in specified format
```

**Low freedom** — Operations are fragile, consistency is critical:
```bash
python scripts/migrate.py --verify --backup
# Do not modify the command or add additional flags.
```

**Analogy**: Think of the agent as navigating a path:
- **Narrow bridge**: Only one safe way forward → specific guardrails (low freedom)
- **Open field**: Many paths lead to success → general direction (high freedom)

## Conciseness — The Cardinal Rule

The context window is a shared resource. Only add what the LLM doesn't already know.

Challenge each piece of information:
- "Does the LLM really need this explanation?"
- "Can I assume it knows this?"
- "Does this paragraph justify its token cost?"

**Good** (~50 tokens):
````markdown
## Extract PDF text
Use pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**Bad** (~150 tokens):
```markdown
PDF files are a common file format that contains text, images...
To extract text, you'll need a library. There are many available...
```

## Persuasion Principles for Agent Prompts

LLMs respond to the same persuasion principles as humans. Research: Meincke et al. (2025) — persuasion techniques more than doubled compliance rates (33% → 72%, p < .001).

### Authority
Imperative language: "YOU MUST", "Never", "No exceptions". Eliminates decision fatigue.
```
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

### Commitment
Require announcements and explicit choices. Force tracking.
```
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

### Scarcity
Time-bound requirements prevent procrastination.
```
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ You can review code when convenient.
```

### Social Proof
Universal patterns establish norms.
```
✅ Checklists without tracking = steps get skipped. Every time.
❌ Some people find tracking helpful for checklists.
```

### Unity
Shared identity for collaborative workflows.
```
✅ We're colleagues working together. I need your honest technical judgment.
❌ You should probably tell me if I'm wrong.
```

### When to Use Which

| Prompt Type | Use | Avoid |
|------------|-----|-------|
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique | Moderate Authority + Unity | Heavy authority |
| Collaborative | Unity + Commitment | Authority, Liking |
| Reference | Clarity only | All persuasion |

## Token Efficiency

- Remove redundant words and phrases
- Use abbreviations after first definition
- Consolidate similar instructions
- Move stable content to system prompts
- Cache common prompt prefixes

## Common Pitfalls

- **Over-engineering**: Starting complex before trying simple
- **Example pollution**: Examples that don't match target task
- **Context overflow**: Exceeding token limits with excessive examples
- **Ambiguous instructions**: Room for multiple interpretations
- **Ignoring edge cases**: Not testing on boundary inputs

## Error Recovery

Build prompts that handle failures gracefully:
- Include fallback instructions
- Request confidence scores
- Ask for alternative interpretations when uncertain
- Specify how to indicate missing information
