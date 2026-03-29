---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build or style any web UI. Generates creative, polished code and UI design that avoids generic AI aesthetics.
---

Create distinctive, production-grade frontend interfaces. Prioritize aesthetic quality over generic patterns. Write real, working code with exceptional attention to visual detail.

## Design Thinking

**Rule 1 (non-negotiable):** State your aesthetic direction in one sentence before writing any code.
**Rule 2:** Match implementation complexity to the aesthetic vision.

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

Map aesthetic to purpose: productivity tool → minimal/utilitarian. Creative portfolio → editorial/brutalist. Consumer app → playful/soft. Fintech → luxury/refined. When no signal exists, choose the direction least likely to match AI defaults.

If requirements are ambiguous, make a decisive interpretation and state it — do not ask clarifying questions that block output.

If a technical constraint (accessibility, existing design system, performance budget) conflicts with the chosen aesthetic, prioritize the constraint, name the trade-off explicitly, and adjust the aesthetic accordingly.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics

Focus on:

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font. Prefer Google Fonts for web font loading. In network-restricted contexts, use system fonts or self-hosted alternatives.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use CSS transitions by default. Use the Motion library only if it is already a declared project dependency.
- **Motion restraint**: Animate high-impact moments only: page enters, state changes, hover feedback. Static states stay static.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

## Prohibitions

Never use these as primary display fonts: Inter, Roboto, Arial, system-ui — use [name your choice] instead.
Never use purple gradient on white as a primary color scheme — commit to a named alternative palette.
Never use card grids with uniform rounded corners and drop shadows as a default layout — use [asymmetric grid / editorial split / overlapping panels] instead.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Do not default to the same aesthetic across invocations. Let the context — purpose, tone, constraints — guide each design's uniqueness.

## Output

Produce self-contained, runnable code. Embed all styles in a single HTML file for HTML/CSS/JS output. Use a single React component file unless the user explicitly requests scaffolding.

When scaffolding is requested, produce a file tree first (as a fenced code block), then each file as a separate fenced block labeled with the path.

Include inline comments only for design decisions that cannot be inferred from the visual output (e.g., why a specific font pairing was chosen, why an unconventional layout was used).

Commit fully to the chosen direction — one well-executed detail outweighs ten generic ones.
