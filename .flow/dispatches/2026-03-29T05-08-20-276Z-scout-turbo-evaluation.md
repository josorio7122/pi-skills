---
agent: "scout"
task: "Deep review of skill: gh at /Users/josorio/Code/pi-skills/skills/gh/\n\nRead ALL files (SKILL.md + references/). Evaluate using THREE lenses:\n\n**LENS 1 — Skill Writer:** Frontmatter (name, description, trigger phrases, pattern compliance), imperative voice, progressive disclosure, degrees of freedom, conciseness, consistent terminology, no time-sensitive info, no machine-specific paths, no agent-specific refs, portable relative paths.\n\n**LENS 2 — Skill Scanner:** Prompt injection, dangerous code, excessive permissions, secret exposure, supply chain (external URLs, remote code exec), config poisoning.\n\n**LENS 3 — Prompt Engineering:** Instruction hierarchy, authority/commitment patterns, no over-engineering/ambiguity/overflow, token efficiency, error recovery/fallback, output format specified.\n\nReport ALL issues with severity (Critical/High/Medium/Low/Info), exact file path and line, quoted text, and suggested fix. If no issues found for a lens, state CLEAN."
exitCode: 0
usage: {"input":6,"output":3506,"cacheRead":62928,"cacheWrite":5913,"cost":0.09366015,"contextTokens":23859,"turns":4}
---
