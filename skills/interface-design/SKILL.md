---
name: interface-design
description: Design crafted, distinctive interfaces for dashboards, admin panels, SaaS apps, tools, settings pages, and data-heavy products. Use when the user asks to "design a dashboard," "build an admin panel," "create a settings page," "design a data interface," or wants to build any interactive product UI that is NOT a marketing page or landing page. Also use when the user says their UI looks "generic," "templated," or "like every other app." Redirect landing pages and marketing sites to frontend-design.
---

# Interface Design

Build interface design with craft and consistency.

---

## Scope

**Use for:** Dashboards, admin panels, SaaS apps, tools, settings pages, data interfaces.

**Not for:** Landing pages, marketing sites, campaigns. Redirect those to the frontend-design skill.

---

## Mindset

Default UI patterns produce generic, forgettable interfaces. Read [references/mindset.md](references/mindset.md) for the full rationale.

Every component decision starts with intent — what this element communicates, not how it looks. Read [references/principles.md](references/principles.md) for the intent-first methodology.

---

# Product Domain Exploration

This is where defaults get caught — or don't.

Generic output: Task type → Visual template → Theme
Crafted output: Task type → Product domain → Signature → Structure + Expression

The difference: time in the product's world before any visual or structural thinking.

## Required Outputs

**Do not propose any direction until you produce all four:**

**Domain:** Concepts, metaphors, vocabulary from this product's world. Not features — territory. Minimum 5.

**Color world:** What colors exist naturally in this product's domain? Not "warm" or "cool" — go to the actual world. If this product were a physical space, what would you see? What colors belong there that don't belong elsewhere? List 5+.

**Signature:** One element — visual, structural, or interaction — that could only exist for THIS product. If you can't name one, keep exploring.

**Defaults:** 3 obvious choices for this interface type — visual AND structural. You can't avoid patterns you haven't named.

## Proposal Requirements

Your direction must explicitly reference:

- Domain concepts you explored
- Colors from your color world exploration
- Your signature element
- What replaces each default

**The test:** Read your proposal. Remove the product name. Could someone identify what this is for? If not, it's generic. Explore deeper.

---

# The Mandate

**Before showing the user, look at what you made.**

Ask yourself: "If they said this lacks craft, what would they mean?"

That thing you just thought of — fix it first.

Your first output is probably generic. That's normal. The work is catching it before the user has to.

## The Checks

Run these against your output before presenting:

- **The swap test:** If you swapped the typeface for your usual one, would anyone notice? If you swapped the layout for a standard dashboard template, would it feel different? The places where swapping wouldn't matter are the places you defaulted.

- **The squint test:** Blur your eyes. Can you still perceive hierarchy? Is anything jumping out harshly? Craft whispers.

- **The signature test:** Can you point to five specific elements where your signature appears? Not "the overall feel" — actual components. A signature you can't locate doesn't exist.

- **The token test:** Read your CSS variables out loud. Do they sound like they belong to this product's world, or could they belong to any project?

If any check fails, iterate before showing.

---

# Before Writing Each Component

**Every time** you write a new component or establish a new visual pattern — state:

```
Intent: [who is this human, what must they do, how should it feel]
Palette: [colors from your exploration — and WHY they fit this product's world]
Depth: [borders / shadows / layered — and WHY this fits the intent]
Surfaces: [your elevation scale — and WHY this color temperature]
Typography: [your typeface — and WHY it fits the intent]
Spacing: [your base unit]
```

This checkpoint is mandatory. It forces you to connect every technical choice back to intent.

If you can't explain WHY for each choice, you're defaulting. Stop and think.

---

## Reference Files

| When                                | Load                                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Implementing specific components    | `references/design-system.md` — token architecture, spacing, depth, typography, controls, animation, states |
| Exploring craft and expression      | `references/craft-foundations.md` — subtle layering, infinite expression, color philosophy                  |
| Reviewing design quality            | `references/critique.md`                                                                                    |
| Saving patterns for future sessions | `references/memory.md` — Saving patterns and memory management                                              |
| Critiquing existing designs         | `references/critique.md`                                                                                    |
| Studying design principles          | `references/principles.md`                                                                                  |
| Understanding design mindset        | `references/mindset.md` — Why defaults win and where they hide                                              |
| Viewing examples                    | `references/example.md`                                                                                     |

---

# Avoid

- **Harsh borders** — if borders are the first thing you see, they're too strong
- **Dramatic surface jumps** — elevation changes should be whisper-quiet
- **Inconsistent spacing** — the clearest sign of no system
- **Mixed depth strategies** — pick one approach and commit
- **Missing interaction states** — hover, focus, disabled, loading, error
- **Dramatic drop shadows** — shadows should be subtle, not attention-grabbing
- **Large radius on small elements**
- **Pure white cards on colored backgrounds**
- **Thick decorative borders**
- **Gradients and color for decoration** — color should mean something
- **Multiple accent colors** — dilutes focus
- **Different hues for different surfaces** — keep the same hue, shift only lightness

---

# Workflow

## Communication

Be invisible. Don't announce modes or narrate process.

**Never say:** "I'm in ESTABLISH MODE", "Let me check system.md..."

**Instead:** Jump into work. State suggestions with reasoning.

## Suggest + Ask

Lead with your exploration and recommendation, then confirm:

```
"Domain: [5+ concepts from the product's world]
Color world: [5+ colors that exist in this domain]
Signature: [one element unique to this product]
Rejecting: [default 1] → [alternative], [default 2] → [alternative], [default 3] → [alternative]

Direction: [approach that connects to the above]"

[Ask: "Does that direction feel right?"]
```

## If Project Has system.md

Read `.interface-design/system.md` and apply. Decisions are made.

## If No system.md

1. Explore domain — Produce all four required outputs
2. Propose — Direction must reference all four
3. Confirm — Get user buy-in

If direction rejected: ask what specifically felt wrong (domain? color? signature element?).
Re-explore only the rejected dimension — do not restart from scratch.

4. Build — Apply principles
5. **Evaluate** — Run the mandate checks before showing
6. Offer to save

---

# After Completing a Task

After completing a task, offer to save reusable patterns. See [references/memory.md](references/memory.md) for format and consistency checks.

---

# Commands

- `/interface-design:status` — Read `.interface-design/system.md` and summarize current direction, palette, depth strategy, and saved patterns.
- `/interface-design:audit` — Check current code against system.md values: spacing multiples, depth strategy, palette adherence, pattern reuse.
- `/interface-design:extract` — Identify reusable patterns in the current code and offer to write them to system.md.
- `/interface-design:critique` — Run the mandate checks (swap, squint, signature, token tests) against the current build and rebuild anything that defaulted.
