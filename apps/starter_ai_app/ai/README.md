# AI

Shared Python code for agents, RAG, prompts, embeddings, vector stores, and evaluation.
The backend imports this package directly and uses the repo-level `.venv`.

## Model Providers

Copy `.env.example` to `.env`, then choose one provider:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
```

Supported provider values are `mock`, `openai`, `groq`, and `gemini`.
