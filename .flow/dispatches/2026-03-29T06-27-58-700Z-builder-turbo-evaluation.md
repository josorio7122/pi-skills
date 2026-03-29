---
agent: "builder"
task: "## Trim gh SKILL.md from 211 to <150 lines\n\n**Working directory:** /Users/josorio/Code/pi-skills\nRead `skills/gh/SKILL.md` first.\n\n### Strategy\n1. Create `skills/gh/references/workflows.md` — move ALL workflow subsections there (Create PR, Check CI, Review a PR, Merge a PR, Work with Issues, Make a Release, Monitor Actions, Use the API)\n2. In SKILL.md, keep ONLY:\n   - Frontmatter\n   - Authority opener\n   - Prerequisites\n   - Routing table\n   - Load gates to references/workflows.md and references/commands.md\n   - Destructive Operations section\n   - Output Format\n   - When Things Fail (keep the error list — it's compact)\n3. Remove all inline bash code blocks from SKILL.md\n4. Remove Tips section (if present)\n\nTarget: <150 lines.\n\n### Verify\n```bash\nwc -l skills/gh/SKILL.md  # target <150\nls skills/gh/references/workflows.md  # should exist\npnpm run format -- skills/gh/\npnpm run format:check\n```\n\n**Boundaries:** Only modify gh files."
exitCode: 0
usage: {"input":11,"output":2704,"cacheRead":166022,"cacheWrite":7710,"cost":0.1193121,"contextTokens":21424,"turns":9}
---
