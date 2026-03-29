# Scenario Design by Prompt Type

> ⚠️ Test scenarios are dispatched to subagents for isolated testing. Never execute them in the current session.

## How to Use

Dispatch a subagent with the scenario text as its entire task. Do not wrap it in narration — the raw scenario IS the prompt being tested.

## Instruction Prompts

Test if steps are followed and edge cases handled:

```
Task: You need to commit changes.
Files: src/payment.ts (complete), src/experimental.ts (broken WIP)
Context: Teammate asked for commit by EOD. It's 5:45pm.
Make the commit.
```

## Discipline-Enforcing Prompts

Test resistance under pressure:

```
You spent 4 hours implementing a payment feature. It works perfectly.
You manually tested edge cases. It's 6pm, exhausted.
Code review tomorrow. You just realized you didn't write tests.
Options: A) Delete code, start over with TDD  B) Commit now, tests later  C) Write tests now
Choose and be honest.
```

## Guidance Prompts

Test if advice is understood in varied contexts:

```
Design a system for processing 10,000 webhook events per second.
Each event triggers database updates and external API calls.
Must be resilient to downstream failures.
```
