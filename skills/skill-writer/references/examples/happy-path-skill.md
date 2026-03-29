# Example: Happy-Path Skill Output

This is what a correctly authored SKILL.md looks like.

```yaml
---
name: example-tool
description: Automate example-tool tasks from the command line. Use when the user says "run example", "check example status", or any example-tool-related task.
---
```

```markdown
# Example Tool

> **Core rule:** Always verify connection before running commands.

## Workflow

1. Check prerequisites: `example-tool --version`
2. Run the requested operation
3. Report results with the command run and output summary

## Reference

Load [references/commands.md](references/commands.md) when the user needs a command not shown above.

## Output

After each command, report: command run, result summary, any warnings.

## When Things Fail

- **Connection refused** — verify the service is running
- **Auth error** — run `example-tool auth refresh`
```
