---
agent: "builder"
task: "## Task 6b: Wire exa-search tests into the test suite\n\n**Working directory:** /Users/josorio/Code/pi-skills\n\n**What to do:**\n\n1. Update the root package.json test script to include exa-search tests. Use `npm pkg set`:\n```bash\nnpm pkg set scripts.test=\"tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts skills/exa-search/scripts/__tests__/*.test.ts\"\n```\n\nAlso update the test:live script to keep it consistent (though exa-search tests don't use LIVE):\n```bash\nnpm pkg set 'scripts.test:live'=\"POSTHOG_TEST_LIVE=1 tsx --test skills/posthog-skill/scripts/__tests__/*.test.ts skills/exa-search/scripts/__tests__/*.test.ts\"\n```\n\n2. **Verify:**\n   - `pnpm test` — ALL tests pass (posthog + exa-search)\n   - `pnpm exec tsc --noEmit` — clean\n   - `pnpm run lint` — clean\n   - Show the total test count (should be 134 + 22 = ~156)\n\n**Boundaries:** Only update package.json via npm pkg set. Do not modify any other files."
exitCode: 0
usage: {"input":13,"output":2214,"cacheRead":267159,"cacheWrite":20194,"cost":0.18912420000000002,"contextTokens":35992,"turns":11}
---
