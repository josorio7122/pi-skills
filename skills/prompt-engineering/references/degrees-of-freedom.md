# Degrees of Freedom

Match specificity to task fragility and variability.

## High Freedom

Multiple approaches are valid, decisions depend on context:

```
Analyze the code structure and organization.
Check for potential bugs or edge cases.
```

## Medium Freedom

A preferred pattern exists, some variation acceptable:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data, generate output in specified format
```

## Low Freedom

Operations are fragile, consistency is critical:

```bash
# Example only - illustrative
python scripts/migrate.py --verify --backup
# Do not modify the command or add additional flags.
```

## Analogy

Think of the agent as navigating a path:

- **Narrow bridge**: Only one safe way forward → specific guardrails (low freedom)
- **Open field**: Many paths lead to success → general direction (high freedom)

## Classification Guide

Before writing any prompt, classify the task:

- Fragile/irreversible operations → Low freedom (strict commands, exact formats)
- Creative/exploratory tasks → High freedom (goals and constraints only)
- Standard workflows → Medium freedom (guidelines with examples)
