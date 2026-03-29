# REFACTOR Phase Techniques

## Closing Loopholes (Discipline Prompts)

Agent violated a rule despite having the prompt? Capture the rationalization verbatim, then add an explicit counter:

```
Agent said: "The skill says delete code-before-tests, but I wrote
comprehensive tests after, so the SPIRIT is satisfied."

Add to prompt:
"Violating the letter of the rules IS violating the spirit."
```

## Improving Clarity (Meta-Testing)

Ask the agent: "You read the prompt and chose C when A was correct. How could the prompt be written differently to make A the only acceptable answer?"

Three possible responses:

1. "The prompt WAS clear, I chose to ignore it" → need stronger authority language
2. "The prompt should have said X" → clarity problem, add their suggestion
3. "I didn't see section Y" → organization problem, make key points prominent

## Reducing Tokens

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
