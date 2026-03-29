---
name: docker-model-runner
description: Run AI models locally using Docker Model Runner with an OpenAI-compatible API. Use when the user wants to run a local LLM, use local inference, pull or manage AI models with Docker, set up a local model endpoint, or integrate local models into code via the OpenAI SDK. Also use when they mention "docker model," "local LLM," "run a model locally," or need an alternative to cloud AI APIs. Covers installation, model management, CLI usage, and OpenAI-compatible API integration.
---

# Docker Model Runner

## Workflow

> **Default API base:** `http://localhost:12434/engines/llama.cpp/v1`

When helping users with local LLM inference using Docker Model Runner:

1. **Check if Docker Model Runner is available** by running `docker model version`

   If `docker model version` fails, verify Docker Desktop ≥ 4.40 is running. Direct the user to https://docs.docker.com/desktop/features/model-runner/.

   Always verify Docker Model Runner is available before proceeding — never assume it is running.

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

## API Usage

Docker Model Runner exposes an OpenAI-compatible REST API:

```bash
# Chat completions
curl http://localhost:12434/engines/llama.cpp/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "ai/smollm2",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

For Python with the OpenAI library:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:12434/engines/llama.cpp/v1",
    api_key="not-needed"  # Local inference only — do NOT use this pattern with cloud APIs
)

response = client.chat.completions.create(
    model="ai/smollm2",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Key Commands

| Command                             | Description                      |
| ----------------------------------- | -------------------------------- |
| `docker model run <model> [prompt]` | Run a model with optional prompt |
| `docker model pull <model>`         | Pull a model from registry       |
| `docker model list`                 | List downloaded models           |
| `docker model search <query>`       | Search for models                |
| `docker model ps`                   | Show running models              |
| `docker model rm <model>`           | Remove a model                   |
| `docker model inspect <model>`      | Show model details               |

## Best Practices

- Use smaller models (like `ai/smollm2`) for faster responses during development
- Pre-load models with `--detach` for better performance in scripts
- Models stay loaded until another model is requested or timeout (5 min)
- Use the OpenAI-compatible API for integration with existing tools

## Troubleshooting

- **Port conflict (12434 in use):** `docker model stop-runner && docker model start-runner`
- **OOM / model won't load:** Try a smaller model (`ai/smollm2`); check `docker model df` for disk usage
- **API 500 errors:** Check `docker model logs` for the root cause
- **Model not found:** Run `docker model pull <model>` first — the runner does not auto-pull

## References

See [references/docker-model-guide.md](references/docker-model-guide.md) for detailed documentation.
