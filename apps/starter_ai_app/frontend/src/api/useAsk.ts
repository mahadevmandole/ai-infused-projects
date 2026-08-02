import { useCallback, useState } from "react";

import { buildApiUrl } from "../utils/config";

type AskResponse = {
  answer: string;
  context: string;
  provider: string;
  model: string;
};

export function useAsk() {
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const askBackend = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      const result = await fetch(buildApiUrl("/api/ask"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      setResponse(await result.json());
    } finally {
      setLoading(false);
    }
  }, []);

  return { askBackend, response, loading };
}
