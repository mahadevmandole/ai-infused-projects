import { useCallback, useEffect, useState } from "react";

import { fetchVoteTotals, saveVoteForModel } from "./battle";

export function useVotes() {
  const [voteTotals, setVoteTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadVoteTotals = useCallback(async () => {
    setIsLoading(true);

    try {
      setVoteTotals(await fetchVoteTotals());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const castVote = useCallback(async (model: string) => {
    const response = await saveVoteForModel(model);
    setVoteTotals(response.all_votes);
    return response;
  }, []);

  useEffect(() => {
    void loadVoteTotals();
  }, [loadVoteTotals]);

  return { castVote, isLoading, loadVoteTotals, voteTotals };
}
