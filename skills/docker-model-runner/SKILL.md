---
name: docker-model-runner
description: Run AI models locally using Docker Model Runner with an OpenAI-compatible API. Use when the user wants to run a local LLM, use local inference, pull or manage AI models with Docker, set up a local model endpoint, or integrate local models into code via the OpenAI SDK. Also use when they mention "docker model," "local LLM," "run a model locally," or need an alternative to cloud AI APIs.
---

# Docker Model Runner

Run Docker Model Runner workflows in this exact sequence. Never assume the runner is active — always verify with `docker model version` first.

## Workflow

> **Default API base:** `http://localhost:12434/engines/llama.cpp/v1`

When helping users with local LLM inference using Docker Model Runner:

1. **Check if Docker Model Runner is available** by running `docker model version`

   If `docker model version` fails, verify Docker Desktop ≥ 4.40 is running. Direct the user to https://docs.docker.com/desktop/features/model-runner/.

   Always verify Docker Model Runner is available before proceeding — never assume it is running.

   If on Linux without Docker Desktop, load the reference guide for Docker Engine installation. Do not proceed until `docker model version` succeeds.

2. **List available models** with `docker model list` to see what's already pulled

3. **Search for models** on Docker Hub or HuggingFace:
   - `docker model search <query>` to find models
   - Popular models include: `ai/gemma3`, `ai/llama3.2`, `ai/smollm2`, `ai/qwen3`

4. **Pull models** before running: `docker model pull <model>`

   Always pull the model before running — the runner does not auto-pull.

5. **Run models** for inference:
   - One-time prompt: `docker model run ai/smollm2 "Your prompt here"`
   - Interactive chat: `docker model run ai/smollm2`
   - Pre-load model: `docker model run --detach ai/smollm2`

6. **Use the OpenAI-compatible API** for programmatic access (see the API base above):
   - Endpoint: `http://localhost:12434/engines/llama.cpp/v1/chat/completions`
   - This is compatible with OpenAI client libraries

> **Output rule:** Display the model's response content directly — not the raw JSON wrapper.

## Output Format

Display the model's response content directly — not the raw JSON wrapper. For multi-turn conversations, show each response as plain text. If the user asks for raw API output, show the full JSON in a fenced code block.

## Reference

Load [references/docker-model-guide.md](references/docker-model-guide.md) when:

- User asks for SDK examples in a specific language
- Full CLI command reference needed
- Installation instructions for Linux/Docker Engine
- Configuration options (env vars, ctx-size)

## Troubleshooting

If you hit an error, load [references/docker-model-guide.md](references/docker-model-guide.md) § Troubleshooting.
