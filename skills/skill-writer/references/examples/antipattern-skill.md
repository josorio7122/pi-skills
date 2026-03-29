# Example: Anti-Pattern Skill + Correction

## ❌ Anti-Pattern SKILL.md

```yaml
---
name: my-tool
description: This skill provides comprehensive functionality for my-tool including installation, configuration, troubleshooting, advanced usage patterns, and integration with other tools. It covers many topics.
metadata:
  author: someone
  version: '1.0'
---
```

Problems:

- Description is descriptive, not trigger-based
- Topic enumeration ("including installation, configuration...")
- Non-standard frontmatter (metadata)
- No imperative triggers ("Use when...")

## ✅ Corrected Version

```yaml
---
name: my-tool
description: Automate my-tool from the command line. Use when asked to "configure my-tool", "troubleshoot my-tool", or any my-tool-related task.
---
```
