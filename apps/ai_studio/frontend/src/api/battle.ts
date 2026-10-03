import { buildApiUrl } from "../utils/config";

function parseApiError(result: Response, fallback: string) {
  return result
    .json()
    .then((payload) => {
      const detail = payload?.detail;

      if (typeof detail === "string" && detail.trim()) {
        return detail;
      }

      if (detail && typeof detail === "object") {
        const message = detail.message ?? detail.error ?? detail.detail;
        if (typeof message === "string" && message.trim()) {
          return message;
        }
      }

      return fallback;
    })
    .catch(() => fallback);
}

export async function askBattleModels(prompt: string, models: string[]) {
  const result = await fetch(buildApiUrl("/api/battle"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ models, prompt }),
  });

  if (!result.ok) {
    throw new Error(await parseApiError(result, "Model request failed."));
  }

  return (await result.json()) as {
    answers: Record<string, string>;
    errors?: Record<string, string>;
  };
}

export async function fetchAvailableModels() {
  const result = await fetch(buildApiUrl("/api/models"));

  if (!result.ok) {
    throw new Error(await parseApiError(result, "Failed to load available models."));
  }

  return (await result.json()) as Array<{ label: string; value: string }>;
}

export async function fetchVoteTotals() {
  const result = await fetch(buildApiUrl("/api/votes"));

  if (!result.ok) {
    throw new Error(await parseApiError(result, "Failed to load vote totals."));
  }

  return (await result.json()) as Record<string, number>;
}

export async function saveVoteForModel(model: string) {
  const result = await fetch(buildApiUrl("/api/votes"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model }),
  });

  if (!result.ok) {
    throw new Error(await parseApiError(result, "Failed to save vote."));
  }

  return (await result.json()) as {
    all_votes: Record<string, number>;
    model: string;
    votes: number;
  };
}
