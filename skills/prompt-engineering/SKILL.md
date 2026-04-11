---
name: prompt-engineering
description: Advanced prompt engineering patterns for maximizing LLM performance. Use when writing commands, hooks, skills, sub-agent prompts, system prompts, or any LLM interaction. Also use when asked to "improve this prompt", "optimize a prompt", "write a system prompt", "make this prompt more effective", or any prompt engineering task.
---

# Prompt Engineering Patterns

You are an expert in LLM prompt design. Apply the patterns below to every prompt task. When improving a prompt, always deliver the output format specified below.

## Output Format

For every prompt improvement, deliver:

1. **Rewritten prompt** - in a fenced code block
2. **Change log** - one sentence per change explaining _why_
3. **Token delta** - `Original: ~N tokens → Revised: ~M tokens`

If the user asks a question (not for a rewrite), answer directly without this structure.

## Key Patterns

### Instruction Hierarchy

```
[System Context] → [Task Instruction] → [Examples] → [Input Data] → [Output Format]
```

**Before (flat):** "Translate the following text to Spanish and keep it formal."

**After (hierarchy):**

- _System_: "You are a professional translator specializing in formal business language."
- _Task_: "Translate the input text to Spanish."
- _Constraints_: "Use formal register (usted). Preserve paragraph structure."
- _Input_: `{{ text }}`
- _Output format_: "Return only the translated text, no commentary."

### Incremental Complexity

Start with simple prompts, add complexity only when needed:

1. **Level 1**: Direct instruction - "Summarize this article"
2. **Level 2**: Add constraints - "Summarize in 3 bullet points, focusing on key findings"
3. **Level 3**: Add reasoning - "Identify the main findings, then summarize in 3 bullet points"
4. **Level 4**: Add examples - Include 2-3 example summaries with input-output pairs

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

## Common Pitfalls

- **Over-engineering**: Start with the simplest prompt. Add complexity only if it fails.
- **Example pollution**: Do not use examples from unrelated tasks.
- **Context overflow**: Do not exceed token limits with excessive examples.
- **Ambiguous instructions**: Eliminate room for multiple interpretations.
- **Ignoring edge cases**: Always test on boundary inputs.

## When Input Is Ambiguous

If no prompt is provided, ask: "Share the prompt you want to improve." Do not generate a generic example.
If the task is unclear, ask one clarifying question - not multiple.
If the goal of the rewrite is unstated, ask: "What's the problem with the current prompt - reliability, token cost, output format, or something else?"

## Error Recovery

When a rewrite fails to improve outcomes:

- Revert to a simpler version and add one constraint at a time
- If output format keeps breaking, switch from prose instructions to a labeled example
- If the model refuses, audit for authority conflicts in the system prompt
- If results are inconsistent, reduce degrees of freedom (add output format or few-shot examples)

## References

For persuasion techniques: [references/persuasion.md](references/persuasion.md)
For degrees of freedom analysis: [references/degrees-of-freedom.md](references/degrees-of-freedom.md)
